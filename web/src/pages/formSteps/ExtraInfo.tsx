import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Plus, X } from 'lucide-react';
import { useResume } from '../../context/ResumeContext';
import ProgressBar from '../../components/ProgressBar';
import StepNavigation from '../../components/StepNavigation';

const ExtraInfo: React.FC = () => {
  const { resumeData, updateExtra } = useResume();
  const navigate = useNavigate();
  const [extraInput, setExtraInput] = useState('');
  const [extraList, setExtraList] = useState<string[]>(resumeData.extra || []);

  useEffect(() => {
    document.title = 'Extra Information - AI Resume Generator';
  }, []);

  const addExtra = () => {
    if (extraInput.trim()) {
      setExtraList(prev => [...prev, extraInput.trim()]);
      setExtraInput('');
    }
  };

  const removeExtra = (item: string) => {
    setExtraList(prev => prev.filter(e => e !== item));
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      addExtra();
    }
  };

  const handleNext = () => {
    updateExtra(extraList);
    navigate('/preview');
  };

  const handleBack = () => {
    navigate('/form/skills');
  };

  const canProceed = true; // This step is optional

  return (
    <motion.div
      initial={{ opacity: 0, x: 100 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -100 }}
      transition={{ duration: 0.5 }}
      className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8"
    >
      <ProgressBar
        currentStep={5}
        totalSteps={5}
        steps={['Personal', 'Education', 'Experience', 'Skills', 'Extra']}
      />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.2 }}
        className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-8"
      >
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
          Extra Information (Optional)
        </h1>
        <p className="text-gray-600 dark:text-gray-300 mb-8">
          Add any extra information you want to highlight on your resume, such as certifications, achievements, awards, languages, or anything else.
        </p>

        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Add Extra Information
          </label>
          <div className="flex space-x-2">
            <input
              type="text"
              value={extraInput}
              onChange={(e) => setExtraInput(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="e.g., AWS Certified, Hackathon Winner, Fluent in Spanish"
              className="flex-1 px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary-500"
            />
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={addExtra}
              className="px-4 py-3 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
            >
              <Plus className="w-5 h-5" />
            </motion.button>
          </div>
        </div>

        {extraList.length > 0 && (
          <div className="mb-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">
              Your Extra Information
            </h3>
            <div className="flex flex-wrap gap-2">
              {extraList.map((item, index) => (
                <motion.span
                  key={index}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: index * 0.05 }}
                  className="inline-flex items-center px-3 py-1 bg-primary-100 dark:bg-primary-900 text-primary-700 dark:text-primary-300 rounded-full text-sm font-medium"
                >
                  {item}
                  <button
                    onClick={() => removeExtra(item)}
                    className="ml-2 text-primary-500 hover:text-primary-700 transition-colors"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </motion.span>
              ))}
            </div>
          </div>
        )}

        <StepNavigation
          onBack={handleBack}
          onNext={handleNext}
          canGoNext={canProceed}
          nextLabel="Preview Resume"
          isLastStep={true}
        />
      </motion.div>
    </motion.div>
  );
};

export default ExtraInfo; 