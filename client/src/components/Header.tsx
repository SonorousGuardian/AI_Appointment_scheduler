import React from 'react';
import { ECGAnimation } from './ECGAnimation';

export const Header: React.FC = () => {
  return (
    <header className="mb-8 text-center">
      <div className="inline-flex items-center justify-center mb-4">
        <ECGAnimation />
      </div>
      <h1 className="text-4xl font-bold text-slate-100 mb-2">
        AI Appointment Scheduler
      </h1>
      <p className="text-slate-400 text-lg">
        Upload a note or type your request. We'll handle the scheduling logic for you.
      </p>
    </header>
  );
};
