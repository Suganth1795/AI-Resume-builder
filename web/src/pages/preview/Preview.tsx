import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Download, Edit, Sparkles, FileText, Eye } from 'lucide-react';
import { useResume } from '../../context/ResumeContext';
import ResumeCard from '../../components/ResumeCard';

const Preview: React.FC = () => {
  const { resumeData, resetForm } = useResume();
  const navigate = useNavigate();
  const [isGenerating, setIsGenerating] = useState(false);
  const [isGenerated, setIsGenerated] = useState(false);
  const [pdfUrl, setPdfUrl] = useState<string | null>(null);

  useEffect(() => {
    document.title = 'Preview Resume - AI Resume Generator';
  }, []);

  const handleGenerateResume = async () => {
    setIsGenerating(true);
    try {
      const response = await fetch('http://localhost:8000/generate-resume', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(resumeData),
      });
      if (response.ok) {
        // Store PDF for preview and download
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        setPdfUrl(url);
        setIsGenerated(true);
      } else {
        const error = await response.json();
        alert(error.error || 'Failed to generate resume');
      }
    } catch (err) {
      alert('Error connecting to backend');
    } finally {
      setIsGenerating(false);
    }
  };

  const handleDownload = () => {
    if (pdfUrl) {
      const a = document.createElement('a');
      a.href = pdfUrl;
      a.download = `${resumeData.personalInfo.firstName}_${resumeData.personalInfo.lastName}_Resume.pdf`;
      document.body.appendChild(a);
      a.click();
      a.remove();
    }
  };

  const handlePreview = () => {
    if (pdfUrl) {
      window.open(pdfUrl, '_blank');
    }
  };

  const handleEditResume = () => {
    navigate('/form/personal');
  };

  const handleCreateNew = () => {
    resetForm();
    navigate('/form/personal');
  };

  const hasCompleteData = resumeData.personalInfo.firstName &&
    resumeData.personalInfo.lastName &&
    resumeData.personalInfo.email;

  if (!hasCompleteData) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 text-center"
      >
        <FileText className="w-16 h-16 text-gray-400 mx-auto mb-4" />
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
          No Resume Data Found
        </h1>
        <p className="text-gray-600 dark:text-gray-300 mb-8">
          Please complete the resume form to preview your resume.
        </p>
        <button
          onClick={() => navigate('/form/personal')}
          className="inline-flex items-center px-6 py-3 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
        >
          Start Creating Resume
        </button>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
      className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8"
    >
      <div className="text-center mb-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            Resume Preview
          </h1>
          <p className="text-gray-600 dark:text-gray-300">
            Review your resume and generate the final AI-powered version
          </p>
        </motion.div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Resume Preview */}
        <div className="lg:col-span-3">
          <ResumeCard data={resumeData} />
        </div>

        {/* Actions Panel */}
        <div className="lg:col-span-1">
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 sticky top-24"
          >
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">
              Actions
            </h2>

            {!isGenerated ? (
              <div className="space-y-4">
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={handleGenerateResume}
                  disabled={isGenerating}
                  className={`w-full flex items-center justify-center px-6 py-4 rounded-lg font-medium transition-all duration-200 ${isGenerating
                      ? 'bg-primary-400 cursor-not-allowed'
                      : 'bg-primary-600 hover:bg-primary-700'
                    } text-white shadow-lg`}
                >
                  {isGenerating ? (
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                      className="w-5 h-5 border-2 border-white border-t-transparent rounded-full mr-2"
                    />
                  ) : (
                    <Sparkles className="w-5 h-5 mr-2" />
                  )}
                  {isGenerating ? 'Generating...' : 'Generate AI Resume'}
                </motion.button>

                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={handleEditResume}
                  className="w-full flex items-center justify-center px-6 py-3 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                >
                  <Edit className="w-5 h-5 mr-2" />
                  Edit Resume
                </motion.button>
              </div>
            ) : (
              <div className="space-y-4">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="text-center mb-6"
                >
                  <div className="w-12 h-12 bg-green-100 dark:bg-green-900 rounded-full flex items-center justify-center mx-auto mb-3">
                    <Sparkles className="w-6 h-6 text-green-600 dark:text-green-400" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-1">
                    Your AI Resume is Ready!
                  </h3>
                  <p className="text-sm text-gray-600 dark:text-gray-300">
                    Your professional resume has been generated successfully
                  </p>
                </motion.div>

                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={handlePreview}
                  className="w-full flex items-center justify-center px-6 py-4 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors shadow-lg"
                >
                  <Eye className="w-5 h-5 mr-2" />
                  Preview PDF
                </motion.button>

                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={handleDownload}
                  className="w-full flex items-center justify-center px-6 py-4 bg-green-600 hover:bg-green-700 text-white rounded-lg font-medium transition-colors shadow-lg"
                >
                  <Download className="w-5 h-5 mr-2" />
                  Download PDF
                </motion.button>

                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={handleCreateNew}
                  className="w-full flex items-center justify-center px-6 py-3 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                >
                  <FileText className="w-5 h-5 mr-2" />
                  Create New Resume
                </motion.button>
              </div>
            )}

            <div className="mt-6 pt-6 border-t border-gray-200 dark:border-gray-700">
              <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-3">
                Resume Summary
              </h3>
              <div className="space-y-2 text-sm text-gray-600 dark:text-gray-300">
                <div className="flex justify-between">
                  <span>Education:</span>
                  <span>{resumeData.education.length} entries</span>
                </div>
                <div className="flex justify-between">
                  <span>Experience:</span>
                  <span>{resumeData.experience.length} entries</span>
                </div>
                <div className="flex justify-between">
                  <span>Skills:</span>
                  <span>{resumeData.skills.length} skills</span>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </motion.div>
  );
};

export default Preview;