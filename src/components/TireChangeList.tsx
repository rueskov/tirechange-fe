import React from 'react';
import { AvailableTime } from '../types';

interface TireChangeListProps {
  tireChangeTimes: AvailableTime[];
  onBookAppointment: (time: AvailableTime) => void;
}

const TireChangeList: React.FC<TireChangeListProps> = ({ tireChangeTimes, onBookAppointment }) => {
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toISOString().slice(0, 16).replace('T', ' ');
  };

  const capitalizeCity = (city: string) => {
    return city.charAt(0).toUpperCase() + city.slice(1);
  };

  return (
    <ul className="tire-change-list">
      {tireChangeTimes.map((time) => (
        <li key={time.id} className="tire-change-item">
          <div className="tire-change-details">
            <span className="tire-change-city">{capitalizeCity(time.city)}</span>
            <span className="tire-change-address">{time.address}</span>
            <span className="tire-change-date-time">{formatDate(time.time)}</span>
          </div>
          <button className="tire-change-button" onClick={() => onBookAppointment(time)}>Book</button>
        </li>
      ))}
    </ul>
  );
};

export default TireChangeList;
