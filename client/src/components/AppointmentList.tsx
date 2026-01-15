import React from 'react';
import { Calendar, Clock, Trash2 } from 'lucide-react';

interface Appointment {
  id: string;
  department: string;
  date: string;
  time: string;
  tz: string;
  createdAt: Date;
}

interface AppointmentListProps {
  appointments: Appointment[];
  onDelete: (id: string) => void;
}

export const AppointmentList: React.FC<AppointmentListProps> = ({ appointments, onDelete }) => {
  if (appointments.length === 0) {
    return (
      <div className="glass-panel p-8 text-center">
        <p className="text-slate-500">No appointments yet. Create your first one above!</p>
      </div>
    );
  }

  return (
    <div className="glass-panel p-6">
      <h2 className="text-xl font-bold text-slate-100 mb-4 flex items-center gap-2">
        <Calendar size={20} className="text-emerald-400" />
        Appointments List ({appointments.length})
      </h2>
      <div className="space-y-3">
        {appointments.map((apt) => (
          <div
            key={apt.id}
            className="bg-slate-800/50 border border-slate-700 rounded-lg p-4 flex items-center justify-between hover:border-emerald-500/50 transition-all"
          >
            <div className="flex-1">
              <h3 className="text-emerald-400 font-semibold text-lg mb-1">{apt.department}</h3>
              <div className="flex items-center gap-4 text-sm text-slate-400">
                <span className="flex items-center gap-1">
                  <Calendar size={14} />
                  {apt.date}
                </span>
                <span className="flex items-center gap-1">
                  <Clock size={14} />
                  {apt.time}
                </span>
              </div>
            </div>
            <button
              onClick={() => onDelete(apt.id)}
              className="p-2 rounded-lg bg-red-900/30 hover:bg-red-900/50 text-red-400 hover:text-red-300 transition-all"
              aria-label="Delete appointment"
            >
              <Trash2 size={18} />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};
