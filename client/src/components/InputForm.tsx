import React from 'react';
import { Upload, FileText, ArrowRight } from 'lucide-react';
import clsx from 'clsx';
import { motion } from 'framer-motion';

interface InputFormProps {
  textInput: string;
  setTextInput: (value: string) => void;
  file: File | null;
  setFile: (file: File | null) => void;
  loading: boolean;
  onSubmit: (e: React.FormEvent) => void;
}

export const InputForm: React.FC<InputFormProps> = ({
  textInput,
  setTextInput,
  file,
  setFile,
  loading,
  onSubmit,
}) => {
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
      setTextInput('');
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="glass-panel p-8"
    >
      <form onSubmit={onSubmit} className="space-y-6">
        <div>
          <label 
            htmlFor="text-input"
            className="block text-sm font-medium text-slate-300 mb-2"
          >
            <FileText className="inline w-4 h-4 mr-2" aria-hidden="true" />
            Text Request
          </label>
          <textarea
            id="text-input"
            className="input-area h-32"
            placeholder="e.g., Book dentist next Friday at 3pm..."
            value={textInput}
            onChange={(e) => {
              setTextInput(e.target.value);
              setFile(null);
            }}
            disabled={!!file}
            aria-label="Enter your appointment request as text"
          />
        </div>

        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-slate-700"></div>
          </div>
          <div className="relative flex justify-center text-sm">
            <span className="bg-slate-900 px-2 text-slate-500">Or upload an image</span>
          </div>
        </div>

        <div>
          <label 
            htmlFor="file-upload"
            className="block text-sm font-medium text-slate-300 mb-2"
          >
            <Upload className="inline w-4 h-4 mr-2" aria-hidden="true" />
            Image Note
          </label>
          <div
            className={clsx(
              'border-2 border-dashed rounded-xl p-8 text-center transition-colors cursor-pointer',
              file
                ? 'border-emerald-500 bg-emerald-950/30'
                : 'border-slate-700 hover:border-emerald-500/50'
            )}
          >
            <input
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              className="hidden"
              id="file-upload"
              aria-label="Upload image with appointment details"
            />
            <label htmlFor="file-upload" className="cursor-pointer w-full h-full block">
              {file ? (
                <div className="text-emerald-400 font-medium">{file.name}</div>
              ) : (
                <div className="text-slate-400">
                  <span className="text-emerald-500 font-semibold">Click to upload</span> or drag
                  and drop
                </div>
              )}
            </label>
          </div>
          {file && (
            <button
              type="button"
              onClick={() => setFile(null)}
              className="text-xs text-red-400 mt-2 hover:underline focus:outline-none focus:ring-2 focus:ring-red-500/50 rounded px-1"
              aria-label="Remove uploaded file"
            >
              Remove file
            </button>
          )}
        </div>

        <button
          type="submit"
          disabled={loading || (!textInput && !file)}
          className="btn-primary w-full flex items-center justify-center gap-2"
          aria-label={loading ? 'Processing your request' : 'Submit appointment request'}
        >
          {loading ? (
            'Processing...'
          ) : (
            <>
              Process Request <ArrowRight size={18} aria-hidden="true" />
            </>
          )}
        </button>
      </form>
    </motion.div>
  );
};
