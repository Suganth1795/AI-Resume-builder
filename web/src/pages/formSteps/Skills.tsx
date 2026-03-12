import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useResume } from '../../context/ResumeContext';
import ProgressBar from '../../components/ProgressBar';
import StepNavigation from '../../components/StepNavigation';
import TagInput from '../../components/TagInput';

type SkillsType = {
  languages: string[];
  frameworks: string[];
  tools: string[];
  concepts: string[];
};

const Skills: React.FC = () => {
  const { resumeData, updateSkills } = useResume();
  const navigate = useNavigate();

  // Initialize structure
  const initialSkills: SkillsType = Array.isArray(resumeData.skills) 
    ? { languages: [], frameworks: [], tools: [], concepts: [] }
    : (resumeData.skills || { languages: [], frameworks: [], tools: [], concepts: [] });
  
  const [skills, setSkills] = useState<SkillsType>(initialSkills);

  const handleNext = () => {
    updateSkills(skills);
    navigate('/form/certifications');
  };

  const handleBack = () => {
    navigate('/form/projects');
  };

  const steps = ['Personal', 'Education', 'Experience', 'Projects', 'Skills', 'Certifications', 'Achievements', 'Extra', 'Declaration'];

  const suggestions = {
      languages: ["JavaScript", "TypeScript", "Python", "Java", "C++", "C#", "Go", "Rust", "Swift", "Kotlin", "PHP", "Ruby", "SQL", "HTML5", "CSS3", "Sass"],
      frameworks: ["React", "Vue.js", "Angular", "Next.js", "Express", "Django", "Flask", "Spring Boot", ".NET Core", "Laravel", "Tailwind CSS", "Bootstrap", "Material UI"],
      tools: ["Git", "GitHub", "GitLab", "Docker", "Kubernetes", "AWS", "Azure", "Google Cloud", "Jenkins", "Jira", "Figma", "Postman", "VS Code", "Webpack", "Vite", "Linux"],
      concepts: ["REST APIs", "GraphQL", "Microservices", "CI/CD", "Agile", "Scrum", "TDD", "OOP", "Functional Programming", "Data Structures", "Algorithms", "System Design"]
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.4 }}
      className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12"
    >
      <ProgressBar currentStep={5} totalSteps={9} steps={steps} />
      
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
          Technical Skills
        </h1>
        <p className="text-gray-600 dark:text-gray-300">
            Categorize your skills to help ATS systems understand your profile better.
        </p>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 border border-gray-100 dark:border-gray-700 space-y-6">
        
        <TagInput 
            className="mb-6"
            label="Programming Languages" 
            placeholder="e.g. JavaScript, Python..." 
            tags={skills.languages} 
            setTags={(tags) => setSkills(prev => ({...prev, languages: tags}))} 
            suggestions={suggestions.languages}
        />

        <TagInput 
            className="mb-6"
            label="Frameworks & Libraries" 
            placeholder="e.g. React, Django..." 
            tags={skills.frameworks} 
            setTags={(tags) => setSkills(prev => ({...prev, frameworks: tags}))} 
            suggestions={suggestions.frameworks}
        />

        <TagInput 
            className="mb-6"
            label="Tools & Platforms" 
            placeholder="e.g. Git, AWS..." 
            tags={skills.tools} 
            setTags={(tags) => setSkills(prev => ({...prev, tools: tags}))} 
            suggestions={suggestions.tools}
        />

        <TagInput 
            className="mb-6"
            label="Key Concepts" 
            placeholder="e.g. REST API, Agile..." 
            tags={skills.concepts} 
            setTags={(tags) => setSkills(prev => ({...prev, concepts: tags}))} 
            suggestions={suggestions.concepts}
        />
        
        <StepNavigation
            onBack={handleBack}
            onNext={handleNext}
            backLabel="Back"
            nextLabel="Next: Certifications"
        />
      </div>
    </motion.div>
  );
};

export default Skills;