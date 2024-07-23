import axios from 'axios';
import { AvailableTime } from './types';

const API_BASE_URL = 'http://localhost:8080/api';

export const getPaginatedTireChangeTimes = async (
  page: number,
  size: number,
  city: string,
  fromDate?: string,
  untilDate?: string,
  vehicleType?: string
): Promise<{ data: AvailableTime[], totalPages: number }> => {
  let url = `${API_BASE_URL}/available-times?page=${page}&size=${size}&amount=15`;
  if (fromDate && untilDate) {
    url += `&from=${fromDate}&until=${untilDate}`;
  }
  if (city) {
    url += `&city=${city}`;
  }
  if (vehicleType) {
    url += `&vehicleType=${vehicleType}`;
  }

  const response = await axios.get(url);

  return {
    data: response.data.content,
    totalPages: response.data.totalPages,
  };
};

export const bookLondonTireChange = async (id: string, city: string, contactInformation: string) => {
  const response = await axios.post(`${API_BASE_URL}/available-times/${id}/booking?city=${city}&contactInformation=${contactInformation}`, {
    headers: {
      'Content-Type': 'text/xml',
      'Accept': 'text/xml'
    }
  });
  return response.data;
};

export const bookManchesterTireChange = async (id: string, city: string, contactInformation: string) => {
  const response = await axios.post(`${API_BASE_URL}/available-times/${id}/booking?city=${city}&contactInformation=${contactInformation}`, {
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json'
    }
  });
  return response.data;
};


