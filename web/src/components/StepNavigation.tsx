import React from 'react';
import { motion } from 'framer-motion';
import { ChevronLeft, ChevronRight } from 'lucide-react';

type StepNavigationProps = {
  onBack?: () => void;
  onNext?: () => void;
  canGoBack?: boolean;
  canGoNext?: boolean;
  nextLabel?: string;
  backLabel?: string;
  isLastStep?: boolean;
};

const StepNavigation: React.FC<StepNavigationProps> = ({
  onBack,
  onNext,
  canGoBack = true,
  canGoNext = true,
  nextLabel = 'Next',
  backLabel = 'Back',
  isLastStep = false,
}) => {
  return (
    <div className="flex justify-between items-center pt-8">
      {onBack && canGoBack ? (
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={onBack}
          className="flex items-center px-6 py-3 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
        >
          <ChevronLeft className="w-4 h-4 mr-2" />
          {backLabel}
        </motion.button>
      ) : (
        <div />
      )}

      {onNext && (
        <motion.button
          whileHover={{ scale: canGoNext ? 1.02 : 1 }}
          whileTap={{ scale: canGoNext ? 0.98 : 1 }}
          onClick={onNext}
          disabled={!canGoNext}
          className={`flex items-center px-6 py-3 rounded-lg font-medium transition-colors ${
            canGoNext
              ? 'bg-primary-600 hover:bg-primary-700 text-white'
              : 'bg-gray-300 dark:bg-gray-700 text-gray-500 dark:text-gray-400 cursor-not-allowed'
          }`}
        >
          {nextLabel}
          {!isLastStep && <ChevronRight className="w-4 h-4 ml-2" />}
        </motion.button>
      )}
    </div>
  );
};

export default StepNavigation;