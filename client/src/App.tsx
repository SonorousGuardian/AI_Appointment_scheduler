import React, { useState } from 'react';
import axios from 'axios';
import { Header } from './components/Header';
import { InputForm } from './components/InputForm';
import { ResultsView } from './components/ResultsView';
import { AppointmentList } from './components/AppointmentList';

interface AppointmentResponse {
  step1_ocr: { raw_text: string; confidence: number };
  step2_extraction: { entities: any; confidence: number };
  step3_normalization?: { normalized: any; confidence: number };
  appointment?: { department: string; date: string; time: string; tz: string };
  status: string;
  message?: string;
}

interface Appointment {
  id: string;
  department: string;
  date: string;
  time: string;
  tz: string;
  createdAt: Date;
}

function App() {
  const [textInput, setTextInput] = useState('');
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<AppointmentResponse | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [appointments, setAppointments] = useState<Appointment[]>([]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setResult(null);

    const formData = new FormData();
    if (textInput) formData.append('text', textInput);
    if (file) formData.append('image', file);

    try {
      const response = await axios.post('http://localhost:3000/api/v1/parse', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      setResult(response.data);

      // If successful, add to appointments list
      if (response.data.status === 'ok' && response.data.appointment) {
        const newAppointment: Appointment = {
          id: Date.now().toString(),
          ...response.data.appointment,
          createdAt: new Date(),
        };
        setAppointments((prev) => [newAppointment, ...prev]);
      }
    } catch (err) {
      setError('Failed to process request. Please ensure the backend is running.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteAppointment = (id: string) => {
    setAppointments((prev) => prev.filter((apt) => apt.id !== id));
  };

  return (
    <div className="min-h-screen bg-slate-950 relative overflow-hidden">
      {/* Background */}
      <div className="fixed inset-0 -z-10">
        <div className="absolute top-0 left-0 w-full h-96 bg-gradient-to-b from-emerald-950/30 to-slate-950"></div>
        <div className="absolute -top-24 -right-24 w-96 h-96 bg-emerald-900/10 rounded-full blur-3xl"></div>
        <div className="absolute top-48 -left-24 w-72 h-72 bg-emerald-800/10 rounded-full blur-3xl"></div>
      </div>

      <div className="max-w-4xl mx-auto px-6 py-12">
        <Header />

        {/* Centered vertical layout */}
        <main className="space-y-8">
          <InputForm
            textInput={textInput}
            setTextInput={setTextInput}
            file={file}
            setFile={setFile}
            loading={loading}
            onSubmit={handleSubmit}
          />

          {(result || error) && <ResultsView result={result} error={error} />}

          <AppointmentList appointments={appointments} onDelete={handleDeleteAppointment} />
        </main>
      </div>
    </div>
  );
}

export default App;
