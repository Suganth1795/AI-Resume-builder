import React, { createContext, useContext, useState, useEffect } from 'react';

// --- Types ---

export type PersonalInfo = {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  address: string;
  summary: string;
};

export type Education = {
  id: string;
  degree: string;
  institution: string;
  startYear: string;
  endYear: string;
  gpa?: string;
};

export type Experience = {
  id: string;
  jobTitle: string;
  company: string;
  location?: string;
  startDate: string;
  endDate: string;
  responsibilities: string[];
  current: boolean;
};

export type Project = {
  id: string;
  title: string;
  description: string;
  technologies: string;
  link?: string;
};

export type Certification = {
  id: string;
  name: string;
  issuer: string;
  date: string;
};

export type Skills = {
  languages: string[];
  frameworks: string[];
  tools: string[];
  concepts: string[];
};

export type ResumeData = {
  personalInfo: PersonalInfo;
  education: Education[];
  experience: Experience[];
  projects: Project[];
  skills: Skills;
  certifications: Certification[];
  achievements: string[];
  extra: string[]; // Extra-curricular activities
  declaration?: string;
};

// --- Context Type ---

type ResumeContextType = {
  resumeData: ResumeData;
  updatePersonalInfo: (info: PersonalInfo) => void;
  updateEducation: (education: Education[]) => void;
  updateExperience: (experience: Experience[]) => void;
  updateProjects: (projects: Project[]) => void;
  updateSkills: (skills: Skills) => void;
  updateCertifications: (certifications: Certification[]) => void;
  updateAchievements: (achievements: string[]) => void;
  updateExtra: (extra: string[]) => void;
  updateDeclaration: (declaration: string) => void;
  resetForm: () => void;
};

// --- Defaults ---

const defaultResumeData: ResumeData = {
  personalInfo: {
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    address: '',
    summary: '',
  },
  education: [],
  experience: [],
  projects: [],
  skills: {
    languages: [],
    frameworks: [],
    tools: [],
    concepts: [],
  },
  certifications: [],
  achievements: [],
  extra: [],
  declaration: '',
};

const ResumeContext = createContext<ResumeContextType | undefined>(undefined);

// --- Hook ---

export const useResume = () => {
  const context = useContext(ResumeContext);
  if (!context) {
    throw new Error('useResume must be used within a ResumeProvider');
  }
  return context;
};

// --- Provider ---

export const ResumeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Lazy initialization from localStorage to avoid race conditions
  const [resumeData, setResumeData] = useState<ResumeData>(() => {
    try {
      const savedData = localStorage.getItem('resumeData');
      if (savedData) {
        const parsed = JSON.parse(savedData);
        // Ensure structure compatibility (e.g. migration for skills)
        if (Array.isArray(parsed.skills)) {
          parsed.skills = {
            languages: parsed.skills,
            frameworks: [],
            tools: [],
            concepts: []
          };
        }
        return { ...defaultResumeData, ...parsed };
      }
    } catch (error) {
      console.error("Failed to load resume data", error);
    }
    return defaultResumeData;
  });

  // Save to localStorage whenever data changes
  useEffect(() => {
    localStorage.setItem('resumeData', JSON.stringify(resumeData));
  }, [resumeData]);

  // --- Actions ---

  const updatePersonalInfo = (info: PersonalInfo) => {
    setResumeData(prev => ({ ...prev, personalInfo: info }));
  };

  const updateEducation = (education: Education[]) => {
    setResumeData(prev => ({ ...prev, education }));
  };

  const updateExperience = (experience: Experience[]) => {
    setResumeData(prev => ({ ...prev, experience }));
  };

  const updateProjects = (projects: Project[]) => {
    setResumeData(prev => ({ ...prev, projects }));
  };

  const updateSkills = (skills: Skills) => {
    setResumeData(prev => ({ ...prev, skills }));
  };

  const updateCertifications = (certifications: Certification[]) => {
    setResumeData(prev => ({ ...prev, certifications }));
  };

  const updateAchievements = (achievements: string[]) => {
    setResumeData(prev => ({ ...prev, achievements }));
  };

  const updateExtra = (extra: string[]) => {
    setResumeData(prev => ({ ...prev, extra }));
  };

  const updateDeclaration = (declaration: string) => {
    setResumeData(prev => ({ ...prev, declaration }));
  };

  const resetForm = () => {
    setResumeData(defaultResumeData);
    localStorage.removeItem('resumeData');
  };

  return (
    <ResumeContext.Provider value={{
      resumeData,
      updatePersonalInfo,
      updateEducation,
      updateExperience,
      updateProjects,
      updateSkills,
      updateCertifications,
      updateAchievements,
      updateExtra,
      updateDeclaration,
      resetForm
    }}>
      {children}
    </ResumeContext.Provider>
  );
};

