import React from 'react';

export const ECGAnimation: React.FC = () => {
  return (
    <svg
      width="108px"
      height="64px"
      viewBox="0 0 54 64"
      xmlns="http://www.w3.org/2000/svg"
      className="ecg-svg"
    >
      <path
        className="beat-loader"
        d="M0.5,38.5 L16,38.5 L19,25.5 L24.5,57.5 L31.5,7.5 L37.5,46.5 L43,38.5 L53.5,38.5"
        fill="none"
        strokeWidth="2"
      />
    </svg>
  );
};
