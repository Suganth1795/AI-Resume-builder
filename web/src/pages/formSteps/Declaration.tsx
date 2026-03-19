import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useResume } from '../../context/ResumeContext';
import ProgressBar from '../../components/ProgressBar';
import FormField from '../../components/FormField';


const Declaration: React.FC = () => {
    const { resumeData, updateDeclaration } = useResume();
    const navigate = useNavigate();
    
    // Default declaration if not present
    const defaultText = "I hereby declare that the information provided above is true and accurate to the best of my knowledge.";
    const [declaration, setDeclaration] = useState<string>(
        resumeData.declaration || defaultText
    );

    useEffect(() => {
        document.title = 'Declaration - AI Resume Generator';
    }, []);

    const handleChange = (value: string) => {
        setDeclaration(value);
    };

    const handleNext = () => {
        updateDeclaration(declaration);
        navigate('/preview');
    };

    const handleSkip = () => {
        updateDeclaration('');
        navigate('/preview');
    };

    const handleBack = () => {
        navigate('/form/extra');
    };

    const steps = ['Personal', 'Education', 'Experience', 'Projects', 'Skills', 'Certifications', 'Achievements', 'Extra', 'Declaration'];

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.4 }}
            className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12"
        >
            <ProgressBar currentStep={9} totalSteps={9} steps={steps} />
            
            <div className="mb-8">
                <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                    Declaration
                </h1>
                <p className="text-gray-600 dark:text-gray-300">
                    Add a declaration to certify the authenticity of your details.
                </p>
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 border border-gray-100 dark:border-gray-700">
                <FormField
                    label="Declaration Statement"
                    value={declaration}
                    onChange={handleChange}
                    placeholder="Enter declaration text..."
                    multiline
                    rows={3}
                    required
                />
            </div>

            <div className="flex justify-between items-center pt-8">
                <button
                    onClick={handleBack}
                    className="text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white font-medium"
                >
                    Back
                </button>
                <div className="flex space-x-4">
                    <button
                        onClick={handleSkip}
                        className="px-6 py-3 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
                    >
                        Skip
                    </button>
                    <button
                        onClick={handleNext}
                        className="px-6 py-3 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors font-medium"
                    >
                        Finish & Preview
                    </button>
                 </div>
            </div>
        </motion.div>
    );
};

export default Declaration;