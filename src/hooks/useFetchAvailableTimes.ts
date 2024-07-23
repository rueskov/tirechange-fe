import { useState, useEffect } from 'react';
import { AvailableTime } from '../types';
import { getPaginatedTireChangeTimes } from '../api';

const useFetchAvailableTimes = (
  currentPage: number,
  selectedCity: string,
  fromDateString: string,
  untilDateString: string,
  selectedVehicleType: string
) => {
  const [tireChangeTimes, setTireChangeTimes] = useState<AvailableTime[]>([]);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    const fetchAvailableTimes = async () => {
      try {
        const response = await getPaginatedTireChangeTimes(currentPage, 15, selectedCity, fromDateString, untilDateString, selectedVehicleType);
        setTireChangeTimes(response.data);
        setTotalPages(response.totalPages);
      } catch (error) {
        console.error('Error fetching available times:', error);
      }
    };

    fetchAvailableTimes();
  }, [currentPage, selectedCity, fromDateString, untilDateString, selectedVehicleType]);

  return { tireChangeTimes, totalPages };
};

export default useFetchAvailableTimes;
