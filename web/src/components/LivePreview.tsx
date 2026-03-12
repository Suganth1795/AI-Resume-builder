import React, { useState, useEffect } from 'react';
import { useResume } from '../context/ResumeContext';

const LivePreview: React.FC = () => {
  const { resumeData } = useResume();
  const [debouncedResumeData, setDebouncedResumeData] = useState(resumeData);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedResumeData(resumeData);
    }, 800); // 800ms debounce for smoother typing experience

    return () => {
      clearTimeout(handler);
    };
  }, [resumeData]);

  const { personalInfo, education, experience, projects, skills, certifications, achievements, extra, declaration } = debouncedResumeData;

  const formatDate = (dateString: string) => {
      if (!dateString) return '';
      // Simple pass-through or format if needed. Assuming user enters text like "Aug 2023"
      return dateString;
  };

  return (
    <div className="bg-white text-black p-[40px] shadow-2xl min-h-[1100px] w-full text-[12px] font-sans leading-relaxed" id="resume-preview">
      {/* HEADER */}
      <div className="mb-4">
        <h1 className="text-3xl font-bold uppercase mb-2 tracking-wide text-gray-900 border-b-2 border-gray-900 pb-2">
          {personalInfo.firstName} {personalInfo.lastName}
        </h1>
        <div className="mt-2 text-sm text-gray-800 flex flex-wrap gap-3 items-center">
            {personalInfo.phone && <span>{personalInfo.phone}</span>}
            {personalInfo.email && (
                <>
                    <span className="text-gray-400">|</span>
                    <span>{personalInfo.email}</span>
                </>
            )}
            {personalInfo.address && (
                <>
                    <span className="text-gray-400">|</span>
                    <span>{personalInfo.address}</span>
                </>
            )}
             {/* Add LinkedIn/GitHub logic if fields added later to PersonalInfo */}
        </div>
      </div>

      {/* PROFESSIONAL SUMMARY */}
      {personalInfo.summary && (
        <div className="mb-4">
          <h2 className="text-sm font-bold uppercase border-b border-gray-400 mb-2 pb-1 tracking-wider">
            Professional Summary
          </h2>
          <p className="text-gray-800 leading-snug">
            {personalInfo.summary}
          </p>
        </div>
      )}

      {/* EDUCATION */}
      {education.length > 0 && (
        <div className="mb-4">
          <h2 className="text-sm font-bold uppercase border-b border-gray-400 mb-2 pb-1 tracking-wider">
            Education
          </h2>
          <div className="space-y-3">
            {education.map((edu, index) => (
              <div key={index}>
                <div className="flex justify-between font-bold">
                  <span>{edu.degree}</span>
                  <span>{edu.startYear} – {edu.endYear}</span>
                </div>
                <div className="flex justify-between">
                    <span className="italic text-gray-800">{edu.institution}</span>
                    {edu.gpa && <span className="text-gray-700 text-xs">GPA: {edu.gpa}</span>}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* PROFESSIONAL EXPERIENCE */}
      {experience.length > 0 && (
        <div className="mb-4">
          <h2 className="text-sm font-bold uppercase border-b border-gray-400 mb-2 pb-1 tracking-wider">
            Professional Experience
          </h2>
          <div className="space-y-4">
            {experience.map((exp, index) => (
              <div key={index}>
                <div className="flex justify-between font-bold">
                  <span>{exp.jobTitle}</span>
                  <span className="text-nowrap">{exp.startDate} – {exp.current ? 'Present' : exp.endDate}</span>
                </div>
                <div className="flex justify-between mb-1">
                    <span className="italic font-semibold text-gray-800">{exp.company} {exp.location ? `| ${exp.location}` : ''}</span>
                </div>
                <ul className="list-disc pl-5 space-y-1 text-gray-800">
                  {exp.responsibilities.map((resp, idx) => (
                    resp && <li key={idx} className="pl-1">{resp}</li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* PROJECTS */}
      {projects.length > 0 && (
        <div className="mb-4">
          <h2 className="text-sm font-bold uppercase border-b border-gray-400 mb-2 pb-1 tracking-wider">
            Projects
          </h2>
          <div className="space-y-3">
            {projects.map((proj, index) => (
              <div key={index}>
                <div className="flex justify-between font-bold">
                  <span>{proj.title}</span>
                  {proj.link && <a href={`https://${proj.link.replace(/^https?:\/\//, '')}`} target="_blank" rel="noreferrer" className="text-blue-600 text-xs font-normal underline">{proj.link}</a>}
                </div>
                <div className="text-gray-800 font-semibold text-xs mb-1">
                    {proj.technologies}
                </div>
                <p className="text-gray-800">
                    {proj.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TECHNICAL SKILLS */}
      {(skills.languages.length > 0 || skills.frameworks.length > 0 || skills.tools.length > 0 || skills.concepts.length > 0) && (
        <div className="mb-4">
          <h2 className="text-sm font-bold uppercase border-b border-gray-400 mb-2 pb-1 tracking-wider">
            Technical Skills
          </h2>
          <div className="space-y-1 text-gray-800">
             {skills.languages.length > 0 && (
                 <div className="flex">
                     <span className="font-bold w-40 flex-shrink-0">Programming Languages:</span>
                     <span>{skills.languages.join(', ')}</span>
                 </div>
             )}
             {skills.frameworks.length > 0 && (
                 <div className="flex">
                     <span className="font-bold w-40 flex-shrink-0">Frameworks / Libraries:</span>
                     <span>{skills.frameworks.join(', ')}</span>
                 </div>
             )}
             {skills.tools.length > 0 && (
                 <div className="flex">
                     <span className="font-bold w-40 flex-shrink-0">Tools / Technologies:</span>
                     <span>{skills.tools.join(', ')}</span>
                 </div>
             )}
             {skills.concepts.length > 0 && (
                 <div className="flex">
                     <span className="font-bold w-40 flex-shrink-0">Concepts:</span>
                     <span>{skills.concepts.join(', ')}</span>
                 </div>
             )}
             {/* Backward compatibility for old skills array if any */}
             {Array.isArray(skills) && skills.length > 0 && (
                 <div className="flex">
                     <span className="font-bold w-40 flex-shrink-0">Skills:</span>
                     <span>{skills.join(', ')}</span>
                 </div>
             )}
          </div>
        </div>
      )}

      {/* CERTIFICATIONS */}
      {certifications.length > 0 && (
        <div className="mb-4">
          <h2 className="text-sm font-bold uppercase border-b border-gray-400 mb-2 pb-1 tracking-wider">
            Certifications
          </h2>
          <ul className="list-disc pl-5 space-y-1 text-gray-800">
              {certifications.map((cert, index) => (
                  <li key={index} className="pl-1">
                      <span className="font-bold">{cert.name}</span> – {cert.issuer} {cert.date && <span className="text-gray-600 text-xs">({cert.date})</span>}
                  </li>
              ))}
          </ul>
        </div>
      )}

      {/* ACHIEVEMENTS */}
      {achievements.length > 0 && achievements.some(a => a.trim()) && (
        <div className="mb-4">
          <h2 className="text-sm font-bold uppercase border-b border-gray-400 mb-2 pb-1 tracking-wider">
            Achievements
          </h2>
          <ul className="list-disc pl-5 space-y-1 text-gray-800">
              {achievements.filter(a => a.trim()).map((achievement, index) => (
                  <li key={index} className="pl-1">{achievement}</li>
              ))}
          </ul>
        </div>
      )}

      {/* EXTRA-CURRICULAR */}
      {extra.length > 0 && extra.some(e => e.trim()) && (
        <div className="mb-4">
          <h2 className="text-sm font-bold uppercase border-b border-gray-400 mb-2 pb-1 tracking-wider">
            Extra-Curricular Activities
          </h2>
          <ul className="list-disc pl-5 space-y-1 text-gray-800">
              {extra.filter(e => e.trim()).map((item, index) => (
                  <li key={index} className="pl-1">{item}</li>
              ))}
          </ul>
        </div>
      )}

      {/* DECLARATION */}
      {declaration && (
         <div className="mb-4 mt-8">
            <h2 className="text-sm font-bold uppercase border-b border-gray-400 mb-2 pb-1 tracking-wider">
                Declaration
            </h2>
            <p className="text-gray-800 italic">
                {declaration}
            </p>
         </div>
      )}

    </div>
  );
};

export default LivePreview;