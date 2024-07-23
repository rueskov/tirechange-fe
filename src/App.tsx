import React, { useState, useEffect } from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import 'react-phone-input-2/lib/style.css';
import TireChangeList from './components/TireChangeList';
import Pagination from './components/Pagination';
import ModalComponent from './components/ModalComponent';
import useFetchAvailableTimes from './hooks/useFetchAvailableTimes';
import { calculateOneMonthLater } from './utils/dateUtils';
import { bookLondonTireChange, bookManchesterTireChange } from './api';
import { AvailableTime } from './types';
import './styles/styles.css';

const App: React.FC = () => {
  const [currentPage, setCurrentPage] = useState(0);
  const [selectedCity, setSelectedCity] = useState<string>('');
  const [fromDate, setFromDate] = useState<Date | null>(new Date());
  const [untilDate, setUntilDate] = useState<Date | null>(calculateOneMonthLater());
  const [selectedVehicleType, setSelectedVehicleType] = useState<string>('');
  const [showModal, setShowModal] = useState<boolean>(false);
  const [contactInformation, setContactInformation] = useState<string>('');
  const [selectedTime, setSelectedTime] = useState<AvailableTime | null>(null);
  const [errorMessage, setErrorMessage] = useState<string>(''); // New state for error message
  const [successMessage, setSuccessMessage] = useState<string>(''); // New state for success message
  const [tireChangeTimes, setTireChangeTimes] = useState<AvailableTime[]>([]);
  const [totalPages, setTotalPages] = useState(1);

  const toUTCString = (date: Date | null, endOfDay: boolean = false): string => {
    if (!date) return '';
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');

    let hours = '00';
    let minutes = '00';
    let seconds = '00';

    // Set hours and minutes to 23:59 for end of day
    if (endOfDay) {
      hours = '23';
      minutes = '59';
    } else if (date.toDateString() === new Date().toDateString()) {
      // If the date is today, use the current hours and minutes
      hours = String(date.getHours()).padStart(2, '0');
      minutes = String(date.getMinutes()).padStart(2, '0');
    }

    return `${year}-${month}-${day}T${hours}:${minutes}:${seconds}Z`;
  };

  const fromDateString = toUTCString(fromDate);
  const untilDateString = toUTCString(untilDate, true);
  const { tireChangeTimes: fetchedTimes, totalPages: fetchedPages } = useFetchAvailableTimes(currentPage, selectedCity, fromDateString, untilDateString, selectedVehicleType);

  useEffect(() => {
    setTireChangeTimes(fetchedTimes);
    setTotalPages(fetchedPages);
  }, [fetchedTimes, fetchedPages]);

  const handlePageChange = (newPage: number) => {
    setCurrentPage(newPage);
  };

  const handleCityChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedCity(event.target.value);
    setCurrentPage(0);
  };

  const handleFromDateChange = (date: Date | null) => {
    if (date) {
      const now = new Date();
      if (date.toDateString() === now.toDateString()) {
        date.setHours(now.getHours(), now.getMinutes(), 0, 0);
      } else {
        date.setHours(0, 0, 0, 0);
      }
      setFromDate(date);
      if (untilDate && date > untilDate) {
        const newUntilDate = new Date(date);
        newUntilDate.setHours(23, 59, 0, 0);
        setUntilDate(newUntilDate);
      }
    }
    setCurrentPage(0);
  };

  const handleUntilDateChange = (date: Date | null) => {
    console.log("=-=-=")
    console.log(date?.toDateString());
    console.log(new Date().toDateString());
    console.log(date?.toDateString() === new Date().toDateString());
    console.log("=-=-=")
    const now = new Date();
    if (date) {
      date.setHours(23, 59, 0, 0);
      setUntilDate(date);
      if (date.toDateString() === now.toDateString()) {
        setFromDate(now);
      }
      else if (fromDate && date < fromDate) {
        const tempDate = new Date(date);
        tempDate.setHours(0);
        tempDate.setMinutes(0)
        setFromDate(tempDate);
        //setFromDate(new Date(date));
      }
    }
    setCurrentPage(0);
  };

  const handleVehicleTypeChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedVehicleType(event.target.value);
    setCurrentPage(0);
  };

  const handleBookAppointment = (time: AvailableTime) => {
    setSelectedTime(time);
    setShowModal(true);
  };

  const handleModalClose = () => {
    setShowModal(false);
    setContactInformation('');
    setErrorMessage(''); // Reset error message when modal is closed
    setSuccessMessage(''); // Reset success message when modal is closed
  };

  const handleFormSubmit = async () => {
    if (!contactInformation) {
      setErrorMessage('Contact information is required');
      return;
    }

    // Custom validation for phone number length
    const phoneLength = contactInformation.replace(/\D/g, '').length;
    if (phoneLength < 10 || phoneLength > 15) {
      setErrorMessage('Phone number is invalid');
      return;
    }

    try {
      if (selectedTime) {
        if (selectedTime.city === 'London') {
          await bookLondonTireChange(selectedTime.id, selectedTime.city.toLocaleLowerCase(), contactInformation);
        } else if (selectedTime.city === 'Manchester') {
          await bookManchesterTireChange(selectedTime.id, selectedTime.city.toLocaleLowerCase(), contactInformation);
        }
        setSuccessMessage('Booking successful'); // Set success message

        // Remove the booked time from the list
        setTireChangeTimes((prevTimes) => prevTimes.filter(time => time.id !== selectedTime.id));
      }
    } catch (error) {
      console.error('Booking failed', error);
      setErrorMessage('Booking failed');
    }
  };

  return (
    <div className="container">
      <h1>Tire Change Appointment Booking</h1>
      <div className="date-picker-container">
        <div className="date-picker">
          <label htmlFor="from-date">From: </label>
          <DatePicker
            id="from-date"
            selected={fromDate}
            onChange={handleFromDateChange}
            dateFormat="yyyy-MM-dd"
            onFocus={e => e.target.blur()} // Prevent the input from being edited
            minDate={new Date()} // Disable past dates
          />
        </div>
        <div className="date-picker until-date-picker">
          <label htmlFor="until-date">Until: </label>
          <DatePicker
            id="until-date"
            selected={untilDate}
            onChange={handleUntilDateChange}
            dateFormat="yyyy-MM-dd"
            onFocus={e => e.target.blur()} // Prevent the input from being edited
            minDate={new Date()} // Disable past dates
          />
        </div>
      </div>
      <div className="select-container">
        <div>
          <label htmlFor="city-select">Select City: </label>
          <select id="city-select" value={selectedCity} onChange={handleCityChange}>
            <option value="">All</option>
            <option value="london">London</option>
            <option value="manchester">Manchester</option>
          </select>
        </div>
        <div>
          <label htmlFor="vehicle-type-select">Select Vehicle Type: </label>
          <select id="vehicle-type-select" value={selectedVehicleType} onChange={handleVehicleTypeChange}>
            <option value="">All</option>
            <option value="car">Car</option>
            <option value="truck">Truck</option>
          </select>
        </div>
      </div>
      <TireChangeList tireChangeTimes={tireChangeTimes} onBookAppointment={handleBookAppointment} />
      <Pagination currentPage={currentPage} totalPages={totalPages === 0 ? 1 : totalPages} onPageChange={handlePageChange} />

      <ModalComponent
        showModal={showModal}
        handleClose={handleModalClose}
        handleSubmit={handleFormSubmit}
        contactInformation={contactInformation}
        setContactInformation={setContactInformation}
        successMessage={successMessage}
        errorMessage={errorMessage}
      />
    </div>
  );
};

export default App;
