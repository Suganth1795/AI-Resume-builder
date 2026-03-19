import React, { useState } from 'react';
import { Eye, EyeOff, FileText, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import LivePreview from './LivePreview';

interface FormLayoutProps {
  children: React.ReactNode;
}

const FormLayout: React.FC<FormLayoutProps> = ({ children }) => {
  const [showPreview, setShowPreview] = useState(true);
  const [showMobilePreview, setShowMobilePreview] = useState(false);

  // Handle window resize to auto-show/hide preview based on screen width is handled by CSS media queries mostly,
  // but we can keep the state for explicit user toggling on desktop if needed.
  // For this requested layout ("two-column"), we'll default showPreview to true on desktop.

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="max-w-[1920px] mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="lg:grid lg:grid-cols-12 lg:gap-8 items-start">
          
          {/* Left Side: Form */}
          <div className={`${showPreview ? 'lg:col-span-6' : 'lg:col-span-12'} transition-all duration-300`}>
             <div className="flex justify-between items-center mb-6 lg:hidden">
                <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100">Resume Details</h2>
             </div>
             
             {/* Desktop Toggle (Optional, keeps layout flexible) */}
             <div className="hidden lg:flex justify-end mb-4">
                <button
                    onClick={() => setShowPreview(!showPreview)}
                    className="flex items-center text-sm text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-100 transition-colors"
                >
                    {showPreview ? (
                        <>
                            <EyeOff className="w-4 h-4 mr-2" />
                            Expand Form
                        </>
                    ) : (
                        <>
                            <Eye className="w-4 h-4 mr-2" />
                            Show Preview
                        </>
                    )}
                </button>
             </div>

             <div className="space-y-6 pb-24 lg:pb-0">
                {children}
             </div>
          </div>

          {/* Right Side: Live Preview (Desktop) */}
          {showPreview && (
            <div className="hidden lg:block lg:col-span-6 sticky top-[80px]">
                <div className="bg-white dark:bg-gray-800 rounded-xl shadow-xl overflow-hidden border border-gray-200 dark:border-gray-700">
                    <div className="p-4 bg-gray-100 dark:bg-gray-700 border-b border-gray-200 dark:border-gray-600 flex justify-between items-center">
                        <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-200 uppercase tracking-wider">Live Preview</h3>
                        <div className="flex space-x-2">
                             <div className="w-3 h-3 rounded-full bg-red-400"></div>
                             <div className="w-3 h-3 rounded-full bg-yellow-400"></div>
                             <div className="w-3 h-3 rounded-full bg-green-400"></div>
                        </div>
                    </div>
                    
                    <div className="bg-gray-500/10 dark:bg-gray-900/50 p-4 h-[calc(100vh-140px)] overflow-y-auto scrollbar-thin scrollbar-thumb-gray-300 dark:scrollbar-thumb-gray-600 custom-scrollbar flex justify-center items-start">
                        <div className="origin-top transform transition-transform duration-300 scale-[0.55] xl:scale-[0.65] 2xl:scale-[0.75] shadow-2xl">
                             <div className="w-[800px] min-h-[1100px] bg-white">
                                 <LivePreview />
                             </div>
                        </div>
                    </div>
                </div>
            </div>
          )}
        </div>
      </div>

      {/* Mobile Preview FAB */}
      <button
        onClick={() => setShowMobilePreview(true)}
        className="lg:hidden fixed bottom-6 right-6 z-50 bg-primary-600 hover:bg-primary-700 text-white rounded-full p-4 shadow-lg flex items-center justify-center shadow-primary-500/30 transition-all hover:scale-110 active:scale-90"
        aria-label="Preview Resume"
      >
        <FileText className="w-6 h-6" />
      </button>

      {/* Mobile Preview Modal */}
      <AnimatePresence>
        {showMobilePreview && (
          <motion.div
            initial={{ opacity: 0, y: "100%" }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: "100%" }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
            className="fixed inset-0 z-[60] bg-gray-100 dark:bg-gray-900 flex flex-col h-full w-full"
          >
            <div className="bg-white dark:bg-gray-800 p-4 shadow-md flex justify-between items-center z-10 sticky top-0 shrink-0">
              <h2 className="text-lg font-bold text-gray-900 dark:text-white">Resume Preview</h2>
              <button 
                onClick={() => setShowMobilePreview(false)}
                className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full transition-colors"
              >
                <X className="w-6 h-6 text-gray-600 dark:text-gray-300" />
              </button>
            </div>
            
            <div className="flex-1 overflow-auto p-4 bg-gray-200 dark:bg-gray-900 flex justify-center">
                 <div className="w-full max-w-[800px] bg-white shadow-xl min-h-[1000px] scale-[0.5] origin-top sm:scale-[0.7] md:scale-[0.8] mb-12">
                   <LivePreview />
                 </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default FormLayout;