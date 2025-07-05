import React from 'react';

const LoadingOverlay = ({ progress = 0, message = "Processing your request..." }) => (
  <div className="fixed inset-0 bg-main_dark bg-opacity-85 flex items-center justify-center z-50 backdrop-blur-sm">
    <div className="bg-purewhite rounded-2xl shadow-2xl p-8 max-w-md w-full mx-4 border-2 border-light_brown">
      {/* Construction site header */}
      <div className="text-center mb-6">
        <p className="text-slatebluegray font-poppins font-semibold">
          {message}
        </p>
      </div>

      {/* Progress bar */}
      <div className="mb-6">
        <div className="flex justify-between items-center mb-2">
          <span className="text-sm font-poppins font-medium text-deep_green">Progress</span>
          <span className="text-sm font-poppins font-medium text-deep_green">{progress.toFixed(2)}%</span>
        </div>
        <div className="w-full bg-light_gray rounded-full h-3 overflow-hidden">
          <div 
            className="bg-gradient-to-r from-web_yellow to-yellow-400 h-full rounded-full transition-all duration-300 ease-out shadow-sm"
            style={{ width: `${progress.toFixed(2)}%` }}
          ></div>
        </div>
      </div>

      {/* Animated construction elements */}
      <div className="flex justify-center items-center space-x-4">
        <div className="w-3 h-3 bg-web_yellow rounded-full animate-bounce"></div>
        <div className="w-4 h-4 bg-deep_green rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
        <div className="w-3 h-3 bg-light_brown rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
      </div>

    </div>
  </div>
);

export default LoadingOverlay;
