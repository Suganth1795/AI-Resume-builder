import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useResume } from '../../context/ResumeContext';
import ProgressBar from '../../components/ProgressBar';
import FormField from '../../components/FormField';
import StepNavigation from '../../components/StepNavigation';

const PersonalInfo: React.FC = () => {
  const { resumeData, updatePersonalInfo } = useResume();
  const navigate = useNavigate();
  
  const [formData, setFormData] = useState(resumeData.personalInfo);
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    document.title = 'Personal Information - AI Resume Generator';
  }, []);

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    
    if (!formData.firstName.trim()) {
      newErrors.firstName = 'First name is required';
    }
    
    if (!formData.lastName.trim()) {
      newErrors.lastName = 'Last name is required';
    }
    
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }
    
    if (!formData.phone.trim()) {
      newErrors.phone = 'Phone number is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    if (validateForm()) {
      updatePersonalInfo(formData);
      // BACKEND HOOK HERE: Save personal info to JSON or temporary storage
      console.log('Saving personal info:', formData);
      navigate('/form/education');
    }
  };

  const canProceed = formData.firstName && formData.lastName && formData.email && formData.phone;

  return (
    <motion.div
      initial={{ opacity: 0, x: 100 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -100 }}
      transition={{ duration: 0.5 }}
      className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8"
    >
      <ProgressBar 
        currentStep={1} 
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
          Personal Information
        </h1>
        <p className="text-gray-600 dark:text-gray-300 mb-8">
          Let's start with your basic information to create your professional resume.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <FormField
            label="First Name"
            value={formData.firstName}
            onChange={(value) => handleInputChange('firstName', value)}
            placeholder="Enter your first name"
            required
            error={errors.firstName}
          />
          
          <FormField
            label="Last Name"
            value={formData.lastName}
            onChange={(value) => handleInputChange('lastName', value)}
            placeholder="Enter your last name"
            required
            error={errors.lastName}
          />
          
          <FormField
            label="Email Address"
            type="email"
            value={formData.email}
            onChange={(value) => handleInputChange('email', value)}
            placeholder="your.email@example.com"
            required
            error={errors.email}
          />
          
          <FormField
            label="Phone Number"
            type="tel"
            value={formData.phone}
            onChange={(value) => handleInputChange('phone', value)}
            placeholder="+1 (555) 123-4567"
            required
            error={errors.phone}
          />
        </div>

        <FormField
          label="Address"
          value={formData.address}
          onChange={(value) => handleInputChange('address', value)}
          placeholder="City, State, Country"
        />

        <FormField
          label="Professional Summary"
          value={formData.summary}
          onChange={(value) => handleInputChange('summary', value)}
          placeholder="Brief overview of your professional background and goals..."
          multiline
          rows={4}
        />

        <StepNavigation
          onNext={handleNext}
          canGoNext={canProceed}
          nextLabel="Continue to Education"
        />
      </motion.div>
    </motion.div>
  );
};

export default PersonalInfo;