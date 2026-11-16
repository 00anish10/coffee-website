import { useEffect, useState } from 'react';

export const CAFE_OPEN_HOUR = 7;
export const CAFE_CLOSE_HOUR = 21;
const KATHMANDU_TIME_ZONE = 'Asia/Kathmandu';

export interface CafeStatus {
  isOpen: boolean;
  label: string;
  detail: string;
}

function getKathmanduMinutes(date: Date): number {
  const parts = new Intl.DateTimeFormat('en-US', {
    timeZone: KATHMANDU_TIME_ZONE,
    hour: '2-digit',
    minute: '2-digit',
    hourCycle: 'h23',
  }).formatToParts(date);

  const hour = Number(parts.find((part) => part.type === 'hour')?.value ?? '0');
  const minute = Number(parts.find((part) => part.type === 'minute')?.value ?? '0');
  return hour * 60 + minute;
}

export function computeCafeStatus(date = new Date()): CafeStatus {
  const minutes = getKathmanduMinutes(date);
  const openAt = CAFE_OPEN_HOUR * 60;
  const closeAt = CAFE_CLOSE_HOUR * 60;
  const isOpen = minutes >= openAt && minutes < closeAt;

  return {
    isOpen,
    label: isOpen ? 'Open now' : 'Closed now',
    detail: isOpen ? 'Closes 9:00 PM' : 'Opens 7:00 AM',
  };
}

/** Recomputes the cafe open/closed state against Kathmandu time every minute. */
export function useCafeStatus(): CafeStatus {
  const [status, setStatus] = useState<CafeStatus>(() => computeCafeStatus());

  useEffect(() => {
    const update = () => setStatus(computeCafeStatus());
    update();
    const id = window.setInterval(update, 60_000);
    return () => window.clearInterval(id);
  }, []);

  return status;
}
