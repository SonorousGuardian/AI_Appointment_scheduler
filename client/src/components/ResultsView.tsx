import React from 'react';
import { AlertCircle, Clock, Calendar } from 'lucide-react';
import clsx from 'clsx';
import { motion, AnimatePresence } from 'framer-motion';

interface AppointmentResponse {
  step1_ocr: { raw_text: string; confidence: number };
  step2_extraction: { entities: any; confidence: number };
  step3_normalization?: { normalized: any; confidence: number };
  appointment?: { department: string; date: string; time: string; tz: string };
  status: string;
  message?: string;
}

interface ResultsViewProps {
  result: AppointmentResponse | null;
  error: string | null;
}

export const ResultsView: React.FC<ResultsViewProps> = ({ result, error }) => {
  return (
    <div className="space-y-6">
      <AnimatePresence>
        {error && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="bg-red-950/50 text-red-300 p-4 rounded-xl border border-red-800/50 flex items-start gap-3"
            role="alert"
            aria-live="polite"
          >
            <AlertCircle className="w-5 h-5 shrink-0" aria-hidden="true" />
            <p>{error}</p>
          </motion.div>
        )}

        {result && (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="glass-panel p-8"
            role="region"
            aria-label="Appointment processing results"
          >
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-slate-100">Results</h2>
              <span
                className={clsx(
                  'px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wide',
                  result.status === 'ok'
                    ? 'bg-emerald-900/50 text-emerald-300 border border-emerald-500/30'
                    : 'bg-yellow-900/50 text-yellow-300 border border-yellow-500/30'
                )}
                role="status"
                aria-label={`Status: ${result.status}`}
              >
                {result.status}
              </span>
            </div>

            {/* Appointment Ticket */}
            {result.status === 'ok' && result.appointment && (
              <div className="bg-gradient-to-br from-emerald-900 to-emerald-950 rounded-2xl p-6 text-white shadow-lg shadow-emerald-900/50 mb-8 relative overflow-hidden border border-emerald-500/20">
                <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/10 rounded-full -translate-y-1/2 translate-x-1/2"></div>
                <div className="relative z-10">
                  <h3 className="text-emerald-300 text-sm font-medium uppercase tracking-wider mb-1">
                    Appointment Confirmed
                  </h3>
                  <div className="text-3xl font-bold mb-4">{result.appointment.department}</div>

                  <div className="flex gap-6">
                    <div className="flex items-center gap-2 bg-emerald-950/60 border border-emerald-500/30 px-3 py-2 rounded-lg">
                      <Calendar size={18} aria-hidden="true" />
                      <span>{result.appointment.date}</span>
                    </div>
                    <div className="flex items-center gap-2 bg-emerald-950/60 border border-emerald-500/30 px-3 py-2 rounded-lg">
                      <Clock size={18} aria-hidden="true" />
                      <span>{result.appointment.time}</span>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Clarification Message */}
            {result.status === 'needs_clarification' && result.message && (
              <div className="bg-yellow-950/30 border border-yellow-700/50 rounded-xl p-4 mb-6 text-yellow-200">
                <p className="flex items-start gap-2">
                  <AlertCircle size={18} className="shrink-0 mt-0.5" aria-hidden="true" />
                  <span>{result.message}</span>
                </p>
              </div>
            )}

            {/* Pipeline Steps Visualization */}
            <div className="space-y-4">
              <h3 className="text-sm font-semibold text-slate-400 uppercase tracking-wider">
                Pipeline Details
              </h3>

              {/* Step 1: OCR */}
              <div className="bg-slate-800/50 rounded-lg p-4 border border-slate-700">
                <div className="flex justify-between items-center mb-2">
                  <span className="font-medium text-slate-300 text-sm">1. OCR Processing</span>
                  <span className="text-xs font-mono text-slate-500">
                    Confidence: {(result.step1_ocr.confidence * 100).toFixed(0)}%
                  </span>
                </div>
                <p className="text-sm text-slate-300 font-mono bg-slate-900/50 p-2 rounded border border-slate-700">
                  {result.step1_ocr.raw_text}
                </p>
              </div>

              {/* Step 2: Extraction */}
              <div className="bg-slate-800/50 rounded-lg p-4 border border-slate-700">
                <div className="flex justify-between items-center mb-2">
                  <span className="font-medium text-slate-300 text-sm">2. Entity Extraction</span>
                  <span className="text-xs font-mono text-slate-500">
                    Confidence: {(result.step2_extraction.confidence * 100).toFixed(0)}%
                  </span>
                </div>
                <div className="text-sm text-slate-300 space-y-1">
                  {result.step2_extraction.entities.date_phrase && (
                    <div className="flex justify-between">
                      <span>Date Phrase:</span>
                      <span className="font-medium text-emerald-400">
                        {result.step2_extraction.entities.date_phrase}
                      </span>
                    </div>
                  )}
                  {result.step2_extraction.entities.time_phrase && (
                    <div className="flex justify-between">
                      <span>Time Phrase:</span>
                      <span className="font-medium text-emerald-400">
                        {result.step2_extraction.entities.time_phrase}
                      </span>
                    </div>
                  )}
                  {result.step2_extraction.entities.department && (
                    <div className="flex justify-between">
                      <span>Department:</span>
                      <span className="font-medium text-emerald-400">
                        {result.step2_extraction.entities.department}
                      </span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
