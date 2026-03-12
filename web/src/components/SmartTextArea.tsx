import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, Check, RefreshCw } from 'lucide-react';

type SmartTextAreaProps = {
  label?: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  rows?: number;
  required?: boolean;
  type?: 'summary' | 'responsibility' | 'general';
};

const SmartTextArea: React.FC<SmartTextAreaProps> = ({
  label,
  value,
  onChange,
  placeholder,
  rows = 3,
  required,
  type = 'general'
}) => {
  const [isEnhancing, setIsEnhancing] = useState(false);
  const [originalValue, setOriginalValue] = useState('');
  const [showUndo, setShowUndo] = useState(false);

  // If you can't access backend, set this to true to see UI
  const ENABLE_AI = true;

  const handleEnhance = async () => {
    if (!value.trim()) return;

    setIsEnhancing(true);
    setOriginalValue(value);

    try {
        const response = await fetch('http://localhost:8000/enhance-text', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                text: value,
                type: type === 'summary' ? 'summary' : type === 'responsibility' ? 'responsibility' : 'description'
            })
        });

        if (response.ok) {
            const data = await response.json();
            if (data.enhancedText) {
                onChange(data.enhancedText);
                setShowUndo(true);
                setTimeout(() => setShowUndo(false), 5000); 
            }
        } else {
            console.error('Failed to enhance text');
        }
    } catch (e) {
        console.error("AI service error", e);
    } finally {
        setIsEnhancing(false);
    }
  };

  const handleUndo = () => {
    onChange(originalValue);
    setShowUndo(false);
  };

  return (
    <div className="mb-4">
      <div className="flex justify-between items-center mb-2">
        {label && (
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
            {label}
            {required && <span className="text-red-500 ml-1">*</span>}
          </label>
        )}
        
        {value.length > 10 && (
          <div className="flex items-center space-x-2">
            {showUndo && (
               <button onClick={handleUndo} className="text-xs text-gray-500 hover:text-gray-700 dark:text-gray-400">
                   Undo
               </button>
            )}
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleEnhance}
              disabled={isEnhancing}
              className={`flex items-center text-xs px-2 py-1 rounded-md transition-colors ${
                isEnhancing 
                  ? 'bg-gray-200 text-gray-500 cursor-not-allowed' 
                  : 'bg-gradient-to-r from-purple-500 to-indigo-600 text-white shadow-sm hover:shadow-md'
              }`}
            >
              {isEnhancing ? (
                <RefreshCw className="w-3 h-3 mr-1 animate-spin" />
              ) : (
                <Sparkles className="w-3 h-3 mr-1" />
              )}
              {isEnhancing ? 'Improving...' : 'AI Enhance'}
            </motion.button>
          </div>
        )}
      </div>
      
      <div className="relative">
        <textarea
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          rows={rows}
          className={`w-full px-4 py-3 rounded-lg border transition-all duration-200
            bg-white dark:bg-gray-800 
            text-gray-900 dark:text-white
            placeholder-gray-500 dark:placeholder-gray-400
            focus:outline-none focus:ring-2 focus:ring-primary-500
            border-gray-300 dark:border-gray-600 focus:border-primary-500
          `}
        />
        {showUndo && (
            <motion.div 
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0 }}
                className="absolute bottom-2 right-2 flex items-center bg-green-100 text-green-800 px-2 py-1 rounded text-xs"
            >
                <Check className="w-3 h-3 mr-1" />
                Enhanced
            </motion.div>
        )}
      </div>
      <p className="text-xs text-gray-500 mt-1 dark:text-gray-400">
          Tip: Write drafted content and click 'AI Enhance' to get professional wording.
      </p>
    </div>
  );
};

export default SmartTextArea;