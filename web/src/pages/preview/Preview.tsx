import React, { useRef } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Download, Edit } from 'lucide-react';
import { useResume } from '../../context/ResumeContext';
import LivePreview from '../../components/LivePreview';
// @ts-ignore
import html2pdf from 'html2pdf.js';

const Preview: React.FC = () => {
  const { resumeData } = useResume();
  const navigate = useNavigate();
  const resumeRef = useRef<HTMLDivElement>(null);

  const handleDownload = () => {
    const element = document.getElementById('resume-preview');
    const opt = {
      margin: [10, 10, 10, 10], // top, left, bottom, right in mm
      filename: `${resumeData.personalInfo.firstName}_Resume.pdf`,
      image: { type: 'jpeg', quality: 0.98 },
      html2canvas: { scale: 2 },
      jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' }
    };

    html2pdf().set(opt).from(element).save();
  };

  const hasCompleteData = resumeData.personalInfo.firstName && resumeData.personalInfo.lastName;

  if (!hasCompleteData) {
      return (
          <div className="p-8 text-center">
              <h1 className="text-2xl font-bold mb-4">No Data</h1>
              <button onClick={() => navigate('/form/personal')} className="text-blue-600 underline">Start</button>
          </div>
      )
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="min-h-screen bg-gray-100 dark:bg-gray-900 py-12 px-4 sm:px-6 lg:px-8"
    >
      <div className="max-w-5xl mx-auto mb-8 flex flex-col sm:flex-row justify-between items-center gap-4">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
          Review Your Resume
        </h1>
        <div className="flex space-x-4">
          <button
            onClick={() => navigate('/form/personal')}
            className="flex items-center px-6 py-3 bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-200 rounded-lg shadow-sm hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
          >
            <Edit className="w-5 h-5 mr-2" />
            Edit Resume
          </button>
          <button
            onClick={handleDownload}
            className="flex items-center px-6 py-3 bg-primary-600 text-white rounded-lg shadow-sm hover:bg-primary-700 transition-colors"
          >
            <Download className="w-5 h-5 mr-2" />
            Download PDF
          </button>
        </div>
      </div>

      <div className="overflow-x-auto">
          <div className="min-w-[800px] bg-white shadow-xl mx-auto rounded-sm overflow-hidden" ref={resumeRef}>
            <LivePreview />
          </div>
      </div>
    </motion.div>
  );
};

export default Preview;