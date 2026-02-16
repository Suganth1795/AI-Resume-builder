import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Plus, Trash2, X } from 'lucide-react';
import { useResume, Experience as ExperienceType } from '../../context/ResumeContext';
import ProgressBar from '../../components/ProgressBar';
import FormField from '../../components/FormField';
import StepNavigation from '../../components/StepNavigation';

const Experience: React.FC = () => {
  const { resumeData, updateExperience } = useResume();
  const navigate = useNavigate();
  
  const [experienceList, setExperienceList] = useState<ExperienceType[]>(
    resumeData.experience.length > 0 ? resumeData.experience : [{
      id: Date.now().toString(),
      jobTitle: '',
      company: '',
      startDate: '',
      endDate: '',
      responsibilities: [''],
      current: false,
    }]
  );

  useEffect(() => {
    document.title = 'Experience - AI Resume Generator';
  }, []);

  const handleInputChange = (id: string, field: string, value: string | boolean) => {
    setExperienceList(prev => prev.map(exp => 
      exp.id === id ? { ...exp, [field]: value } : exp
    ));
  };

  const handleResponsibilityChange = (expId: string, index: number, value: string) => {
    setExperienceList(prev => prev.map(exp => 
      exp.id === expId ? {
        ...exp,
        responsibilities: exp.responsibilities.map((resp, i) => i === index ? value : resp)
      } : exp
    ));
  };

  const addResponsibility = (expId: string) => {
    setExperienceList(prev => prev.map(exp => 
      exp.id === expId ? {
        ...exp,
        responsibilities: [...exp.responsibilities, '']
      } : exp
    ));
  };

  const removeResponsibility = (expId: string, index: number) => {
    setExperienceList(prev => prev.map(exp => 
      exp.id === expId ? {
        ...exp,
        responsibilities: exp.responsibilities.filter((_, i) => i !== index)
      } : exp
    ));
  };

  const addExperience = () => {
    setExperienceList(prev => [...prev, {
      id: Date.now().toString(),
      jobTitle: '',
      company: '',
      startDate: '',
      endDate: '',
      responsibilities: [''],
      current: false,
    }]);
  };

  const removeExperience = (id: string) => {
    if (experienceList.length > 1) {
      setExperienceList(prev => prev.filter(exp => exp.id !== id));
    }
  };

  const handleNext = () => {
    const validExperience = experienceList.filter(exp => 
      exp.jobTitle.trim() && exp.company.trim() && exp.startDate.trim() && 
      (exp.current || exp.endDate.trim()) && exp.responsibilities.some(resp => resp.trim())
    ).map(exp => ({
      ...exp,
      responsibilities: exp.responsibilities.filter(resp => resp.trim())
    }));
    
    updateExperience(validExperience);
    // BACKEND HOOK HERE: Save experience data to JSON or temporary storage
    console.log('Saving experience:', validExperience);
    navigate('/form/skills');
  };

  const handleSkipExperience = () => {
    updateExperience([]);
    // BACKEND HOOK HERE: Save empty experience data
    console.log('Skipping experience section');
    navigate('/form/skills');
  };
  const handleBack = () => {
    navigate('/form/education');
  };


  return (
    <motion.div
      initial={{ opacity: 0, x: 100 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -100 }}
      transition={{ duration: 0.5 }}
      className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8"
    >
      <ProgressBar 
        currentStep={3} 
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
          Work Experience
        </h1>
        <p className="text-gray-600 dark:text-gray-300 mb-8">
          Add your work experience to highlight your professional journey. This section is optional - you can skip it if you're a recent graduate or changing careers.
        </p>

        <div className="space-y-8">
          {experienceList.map((experience, index) => (
            <motion.div
              key={experience.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="border border-gray-200 dark:border-gray-700 rounded-lg p-6"
            >
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                  Experience {index + 1}
                </h3>
                {experienceList.length > 1 && (
                  <button
                    onClick={() => removeExperience(experience.id)}
                    className="text-red-500 hover:text-red-700 transition-colors"
                  >
                    <Trash2 className="w-5 h-5" />
                  </button>
                )}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <FormField
                  label="Job Title"
                  value={experience.jobTitle}
                  onChange={(value) => handleInputChange(experience.id, 'jobTitle', value)}
                  placeholder="Software Engineer"
                  required
                />
                
                <FormField
                  label="Company"
                  value={experience.company}
                  onChange={(value) => handleInputChange(experience.id, 'company', value)}
                  placeholder="Tech Corp"
                  required
                />
                
                <FormField
                  label="Start Date"
                  type="month"
                  value={experience.startDate}
                  onChange={(value) => handleInputChange(experience.id, 'startDate', value)}
                  required
                />
                
                <div>
                  <div className="flex items-center mb-2">
                    <input
                      type="checkbox"
                      id={`current-${experience.id}`}
                      checked={experience.current}
                      onChange={(e) => handleInputChange(experience.id, 'current', e.target.checked)}
                      className="mr-2"
                    />
                    <label htmlFor={`current-${experience.id}`} className="text-sm font-medium text-gray-700 dark:text-gray-300">
                      I currently work here
                    </label>
                  </div>
                  {!experience.current && (
                    <FormField
                      label="End Date"
                      type="month"
                      value={experience.endDate}
                      onChange={(value) => handleInputChange(experience.id, 'endDate', value)}
                      required
                    />
                  )}
                </div>
              </div>

              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Responsibilities <span className="text-red-500">*</span>
                </label>
                <div className="space-y-2">
                  {experience.responsibilities.map((responsibility, respIndex) => (
                    <div key={respIndex} className="flex items-center space-x-2">
                      <input
                        type="text"
                        value={responsibility}
                        onChange={(e) => handleResponsibilityChange(experience.id, respIndex, e.target.value)}
                        placeholder="Describe your responsibilities..."
                        className="flex-1 px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary-500"
                      />
                      {experience.responsibilities.length > 1 && (
                        <button
                          onClick={() => removeResponsibility(experience.id, respIndex)}
                          className="text-red-500 hover:text-red-700 transition-colors"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                  ))}
                  <button
                    onClick={() => addResponsibility(experience.id)}
                    className="flex items-center text-primary-600 dark:text-primary-400 hover:text-primary-700 transition-colors"
                  >
                    <Plus className="w-4 h-4 mr-1" />
                    Add Responsibility
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={addExperience}
          className="flex items-center px-4 py-2 text-primary-600 dark:text-primary-400 hover:bg-primary-50 dark:hover:bg-primary-900 rounded-lg transition-colors mt-6"
        >
          <Plus className="w-5 h-5 mr-2" />
          Add Another Experience
        </motion.button>

        <StepNavigation
          onBack={handleBack}
          onNext={handleNext}
          canGoNext={true}
          nextLabel="Continue to Skills"
        />
        
        <div className="text-center mt-4">
          <button
            onClick={handleSkipExperience}
            className="text-gray-500 dark:text-gray-400 hover:text-primary-600 dark:hover:text-primary-400 text-sm underline transition-colors"
          >
            Skip this section - I don't have work experience yet
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default Experience;