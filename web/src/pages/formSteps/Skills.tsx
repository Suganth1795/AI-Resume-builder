import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { X, Plus } from 'lucide-react';
import { useResume } from '../../context/ResumeContext';
import ProgressBar from '../../components/ProgressBar';
import StepNavigation from '../../components/StepNavigation';

const Skills: React.FC = () => {
  const { resumeData, updateSkills } = useResume();
  const navigate = useNavigate();
  
  const [skillInput, setSkillInput] = useState('');
  const [skillsList, setSkillsList] = useState<string[]>(resumeData.skills);

  useEffect(() => {
    document.title = 'Skills - AI Resume Generator';
  }, []);

  const addSkill = () => {
    if (skillInput.trim() && !skillsList.includes(skillInput.trim())) {
      setSkillsList(prev => [...prev, skillInput.trim()]);
      setSkillInput('');
    }
  };

  const removeSkill = (skillToRemove: string) => {
    setSkillsList(prev => prev.filter(skill => skill !== skillToRemove));
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      addSkill();
    }
  };

  const handleNext = () => {
    updateSkills(skillsList);
    // BACKEND HOOK HERE: Save skills data to JSON or temporary storage
    console.log('Saving skills:', skillsList);
    navigate('/form/extra');
  };

  const handleBack = () => {
    navigate('/form/experience');
  };

  const canProceed = skillsList.length > 0;

  const commonSkills = [
    'JavaScript', 'Python', 'React', 'Node.js', 'HTML/CSS', 'TypeScript',
    'Java', 'C++', 'SQL', 'MongoDB', 'AWS', 'Docker', 'Git', 'Agile',
    'Project Management', 'Leadership', 'Communication', 'Problem Solving',
    'Team Collaboration', 'Adobe Creative Suite', 'Figma', 'Marketing'
  ];

  return (
    <motion.div
      initial={{ opacity: 0, x: 100 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -100 }}
      transition={{ duration: 0.5 }}
      className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8"
    >
      <ProgressBar 
        currentStep={4} 
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
          Skills
        </h1>
        <p className="text-gray-600 dark:text-gray-300 mb-8">
          Add your technical and soft skills to showcase your capabilities.
        </p>

        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Add Skills
          </label>
          <div className="flex space-x-2">
            <input
              type="text"
              value={skillInput}
              onChange={(e) => setSkillInput(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Enter a skill (e.g., JavaScript, Leadership)"
              className="flex-1 px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary-500"
            />
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={addSkill}
              className="px-4 py-3 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
            >
              <Plus className="w-5 h-5" />
            </motion.button>
          </div>
        </div>

        {skillsList.length > 0 && (
          <div className="mb-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">
              Your Skills
            </h3>
            <div className="flex flex-wrap gap-2">
              {skillsList.map((skill, index) => (
                <motion.span
                  key={index}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: index * 0.05 }}
                  className="inline-flex items-center px-3 py-1 bg-primary-100 dark:bg-primary-900 text-primary-700 dark:text-primary-300 rounded-full text-sm font-medium"
                >
                  {skill}
                  <button
                    onClick={() => removeSkill(skill)}
                    className="ml-2 text-primary-500 hover:text-primary-700 transition-colors"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </motion.span>
              ))}
            </div>
          </div>
        )}

        <div className="mb-8">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">
            Common Skills (Click to Add)
          </h3>
          <div className="flex flex-wrap gap-2">
            {commonSkills.filter(skill => !skillsList.includes(skill)).map((skill, index) => (
              <motion.button
                key={index}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.02 }}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => {
                  setSkillsList(prev => [...prev, skill]);
                }}
                className="px-3 py-1 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-full text-sm hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
              >
                {skill}
              </motion.button>
            ))}
          </div>
        </div>

        <StepNavigation
          onBack={handleBack}
          onNext={handleNext}
          canGoNext={canProceed}
          nextLabel="Continue to Extra Info"
          isLastStep={false}
        />
      </motion.div>
    </motion.div>
  );
};

export default Skills;