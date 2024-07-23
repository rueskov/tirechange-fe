import React from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

interface DatePickerComponentProps {
  label: string;
  selectedDate: Date | null;
  onDateChange: (date: Date | null) => void;
  minDate?: Date;
}

const DatePickerComponent: React.FC<DatePickerComponentProps> = ({ label, selectedDate, onDateChange, minDate }) => {
  return (
    <div className="date-picker">
      <label>{label}</label>
      <DatePicker
        selected={selectedDate}
        onChange={onDateChange}
        dateFormat="yyyy-MM-dd"
        onFocus={(e) => e.target.blur()}
        minDate={minDate}
      />
    </div>
  );
};

export default DatePickerComponent;
