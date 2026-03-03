import { useState, useEffect, useCallback } from 'react';
import { Calendar } from 'lucide-react';
import type { Countdown } from '../../types';
import { TimeBlock } from '../ui';

interface CountdownTimerProps {
  endTime: string;
  startsAt: string;
  endsAt: string;
}

function calculateCountdown(endsAt: string): Countdown {
  const diff = new Date(endsAt).getTime() - Date.now();
  if (diff <= 0) return { days: 0, hours: 0, minutes: 0, seconds: 0 };
  return {
    days: Math.floor(diff / (1000 * 60 * 60 * 24)),
    hours: Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
    minutes: Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60)),
    seconds: Math.floor((diff % (1000 * 60)) / 1000),
  };
}

function calculateProgress(startsAt: string, endsAt: string): number {
  const start = new Date(startsAt).getTime();
  const end = new Date(endsAt).getTime();
  const elapsed = Date.now() - start;
  const total = end - start;
  if (elapsed <= 0) return 0;
  if (elapsed >= total) return 100;
  return Math.round((elapsed / total) * 100);
}

export function CountdownTimer({ endTime, startsAt, endsAt }: CountdownTimerProps) {
  const computeState = useCallback(() => ({
    countdown: calculateCountdown(endsAt),
    timeProgress: calculateProgress(startsAt, endsAt),
  }), [startsAt, endsAt]);

  const [state, setState] = useState(computeState);

  useEffect(() => {
    setState(computeState());
    const id = setInterval(() => setState(computeState()), 1000);
    return () => clearInterval(id);
  }, [computeState]);

  const { countdown, timeProgress } = state;

  return (
    <>
      {/* Date Row - Gray Background */}
      <div className="bg-gray-100 px-4 py-3">
        <div className="flex items-center justify-end gap-1.5 text-gray-500">
          <span className="text-sm">{endTime}</span>
          <Calendar className="w-4 h-4" />
        </div>
      </div>

      {/* Countdown Timer - White Background */}
      <div className="bg-white px-4 py-4">
        <div className="flex items-center justify-between">
          <TimeBlock value={countdown.days} label="DAY" />
          <div className="w-px h-8 bg-gray-200" />
          <TimeBlock value={countdown.hours} label="HOURS" />
          <div className="w-px h-8 bg-gray-200" />
          <TimeBlock value={countdown.minutes} label="MINUTES" />
          <div className="w-px h-8 bg-gray-200" />
          <TimeBlock value={countdown.seconds} label="SECONDS" />
        </div>
      </div>

      {/* Blue Progress Bar */}
      <div className="h-1 bg-gray-200 overflow-hidden">
        <div 
          className="h-full bg-blue-600 transition-all duration-1000 ease-linear progress-bar"
          style={{ width: `${Math.max(timeProgress, 2)}%` }}
        />
      </div>
    </>
  );
}
