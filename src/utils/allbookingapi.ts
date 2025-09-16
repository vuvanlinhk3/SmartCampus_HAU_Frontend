// src/utils/allbookingapi.ts
import { getAuthToken } from './token';

export interface BookingStatistic {
  bookingId: number;
  roomId: number;
  bookingDate: string;
}

const API_BASE_URL = 'https://localhost:7072/api';

export async function getAllBookingsForStatistics(): Promise<BookingStatistic[]> {
  try {
    const token = getAuthToken();

    const response = await fetch(`${API_BASE_URL}/Booking/booking/getallforstatistic`, {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
        ...(token && { 'Authorization': `Bearer ${token}` }),
      },
      credentials: 'include',
    });

    if (response.status === 401) {
      throw new Error('Authentication failed. Please login again.');
    }

    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }

    const bookings: BookingStatistic[] = await response.json();
    return bookings;
  } catch (error) {
    console.error('Error fetching booking statistics:', error);
    throw error;
  }
}
