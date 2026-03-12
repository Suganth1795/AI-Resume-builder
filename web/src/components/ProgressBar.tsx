import React, { useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Check } from 'lucide-react';

type ProgressBarProps = {
  currentStep: number;
  totalSteps: number;
  steps: string[];
};

const ProgressBar: React.FC<ProgressBarProps> = ({ currentStep, totalSteps, steps }) => {
  const scrollRef = useRef<HTMLDivElement>(null);

  // Auto scroll to active step on mobile if we were using a scroller
  // But we are using a simplified view for mobile, so this might not be needed unless we decide to scroll.

  return (
    <div className="w-full mb-8">
      {/* Desktop View - Stepper */}
      <div className="hidden md:block relative px-4">
        {/* Background Grey Line */}
        <div className="absolute top-4 left-0 w-full h-0.5 bg-gray-200 dark:bg-gray-700 -z-10" 
             style={{ left: '50%', transform: 'translateX(-50%)', width: 'calc(100% - 2rem)' }} 
        />
        
        {/* Active Colored Line */}
        <motion.div 
          className="absolute top-4 left-0 h-0.5 bg-primary-600 -z-10 origin-left"
          initial={{ scaleX: 0 }}
          animate={{ scaleX: (currentStep - 1) / (totalSteps - 1) }}
          transition={{ duration: 0.5 }}
          style={{ 
              left: '1rem', // Start at center of first circle (approx)
              width: 'calc(100% - 2rem)' // End at center of last circle
          }}
        />

        <div className="flex justify-between items-center w-full">
          {steps.map((step, index) => {
             const isCompleted = index + 1 < currentStep;
             const isActive = index + 1 === currentStep;
             
             return (
                <div key={step} className="flex flex-col items-center group relative cursor-default">
                    <div 
                        className={`
                            w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium transition-all duration-300 border-2 z-10
                            ${isCompleted ? 'bg-primary-600 border-primary-600 text-white' : ''}
                            ${isActive ? 'bg-white dark:bg-gray-800 border-primary-600 text-primary-600 scale-110 shadow-lg' : ''}
                            ${!isCompleted && !isActive ? 'bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-600 text-gray-400' : ''}
                        `}
                    >
                        {isCompleted ? <Check className="w-4 h-4" /> : index + 1}
                    </div>
                    {/* Step Label - Show on desktop */}
                    <span 
                        className={`
                            absolute top-10 text-xs font-medium whitespace-nowrap transition-colors duration-300
                            ${isActive ? 'text-primary-600 dark:text-primary-400' : 'text-gray-500 dark:text-gray-400'}
                        `}
                    >
                        {step}
                    </span>
                </div>
             );
          })}
        </div>
      </div>

      {/* Mobile View - Simplified */}
      <div className="md:hidden">
         <div className="flex justify-between items-center mb-2">
            <span className="text-sm font-medium text-gray-900 dark:text-white">
                Step {currentStep} of {totalSteps}
            </span>
            <span className="text-sm font-medium text-primary-600">
                {steps[currentStep - 1]}
            </span>
         </div>
         <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
            <motion.div
              className="bg-primary-600 h-2 rounded-full"
              initial={{ width: 0 }}
              animate={{ width: `${((currentStep) / totalSteps) * 100}%` }}
              transition={{ duration: 0.3 }}
            />
         </div>
      </div>
    </div>
  );
};

export default ProgressBar;