import os
import json
import html
from io import BytesIO
from typing import List, Optional

from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import Response
from pydantic import BaseModel
from dotenv import load_dotenv

import google.generativeai as genai
from reportlab.lib.pagesizes import letter
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.lib.units import inch
from reportlab.platypus import SimpleDocTemplate, Paragraph, Spacer, Table, TableStyle, PageBreak
from reportlab.lib import colors
from reportlab.lib.enums import TA_LEFT, TA_CENTER, TA_JUSTIFY

# --- Configuration ---

load_dotenv()

GEMINI_API_KEY = os.getenv("GEMINI_API_KEY")
GEMINI_MODEL_NAME = 'gemini-2.0-flash-lite'

if GEMINI_API_KEY:
    genai.configure(api_key=GEMINI_API_KEY)
else:
    print("Warning: GEMINI_API_KEY not found in environment variables")

app = FastAPI(title="AI Resume Generator API")

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://localhost:5174", "http://localhost:3000"], 
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# --- Pydantic Models ---

class PersonalInfo(BaseModel):
    firstName: str
    lastName: str
    email: str
    phone: str
    address: str
    summary: str

class Education(BaseModel):
    id: str
    degree: str
    institution: str
    startYear: str
    endYear: str
    gpa: Optional[str] = None

class Experience(BaseModel):
    id: str
    jobTitle: str
    company: str
    startDate: str
    endDate: str
    responsibilities: List[str]
    current: bool

class TextEnhancementRequest(BaseModel):
    text: str
    # 'summary', 'description', 'responsibility', 'general'
    type: str

class ResumeData(BaseModel):
    personalInfo: PersonalInfo
    education: List[Education]
    experience: List[Experience]
    skills: List[str]
    extra: List[str]

# --- Helper Functions ---

def enhance_resume_with_gemini(resume_data: ResumeData) -> dict:
    """
    Use Gemini API to enhance resume content for ATS compatibility.
    Returns a dict with enhanced summary and experience descriptions.
    """
    try:
        if not GEMINI_API_KEY:
            return {
                "summary": resume_data.personalInfo.summary,
                "experiences": {exp.id: exp.responsibilities for exp in resume_data.experience}
            }
        
        model = genai.GenerativeModel(GEMINI_MODEL_NAME)
        
        # 1. Enhance professional summary
        summary_prompt = f"""You are an expert resume writer. Rewrite this professional summary to be more ATS-friendly, impactful, and keyword-rich while keeping it concise (2-3 sentences):

Original Summary: {resume_data.personalInfo.summary}

Return only the enhanced summary text, nothing else."""
        
        enhanced_summary = resume_data.personalInfo.summary
        try:
            summary_response = model.generate_content(summary_prompt)
            if summary_response.text:
                enhanced_summary = summary_response.text.strip()
        except Exception as e:
            print(f"Error enhancing summary: {str(e)}")
        
        # 2. Enhance experience descriptions
        enhanced_experiences = {}
        for exp in resume_data.experience:
            exp_prompt = f"""You are an expert resume writer. Rewrite these job responsibilities to be more ATS-friendly.

Job Title: {exp.jobTitle}
Company: {exp.company}
Responsibilities:
{chr(10).join([f"- {resp}" for resp in exp.responsibilities])}

Return only the enhanced bullet points, one per line, starting with "•". Keep the same number of points."""
            
            try:
                exp_response = model.generate_content(exp_prompt)
                if exp_response.text:
                    enhanced_bullets = [line.strip().lstrip('•').strip() for line in exp_response.text.split('\n') if line.strip()]
                    enhanced_experiences[exp.id] = enhanced_bullets if enhanced_bullets else exp.responsibilities
                else:
                    enhanced_experiences[exp.id] = exp.responsibilities
            except Exception as e:
                print(f"Error enhancing experience {exp.id}: {str(e)}")
                enhanced_experiences[exp.id] = exp.responsibilities
        
        return {
            "summary": enhanced_summary,
            "experiences": enhanced_experiences
        }
    except Exception as e:
        print(f"Error calling Gemini API: {str(e)}")
        # Fallback to original data
        return {
            "summary": resume_data.personalInfo.summary,
            "experiences": {exp.id: exp.responsibilities for exp in resume_data.experience}
        }

def format_resume_text(resume_data: ResumeData) -> str:
    """Format resume data into plain text format (fallback if Gemini API fails or for logging)."""
    text = f"""
{resume_data.personalInfo.firstName.upper()} {resume_data.personalInfo.lastName.upper()}
{resume_data.personalInfo.email} | {resume_data.personalInfo.phone} | {resume_data.personalInfo.address}

PROFESSIONAL SUMMARY
{resume_data.personalInfo.summary}

EXPERIENCE
"""
    for exp in resume_data.experience:
        text += f"\n{exp.jobTitle}\n{exp.company} | {exp.startDate} - {'Present' if exp.current else exp.endDate}\n"
        for resp in exp.responsibilities:
            text += f"• {resp}\n"
    
    text += "\nEDUCATION\n"
    for edu in resume_data.education:
        text += f"\n{edu.degree}\n{edu.institution} | {edu.startYear} - {edu.endYear}"
        if edu.gpa:
            text += f" | GPA: {edu.gpa}"
        text += "\n"
    
    text += "\nSKILLS\n"
    text += ", ".join(resume_data.skills)
    
    if resume_data.extra:
        text += "\n\nADDITIONAL INFORMATION\n"
        for item in resume_data.extra:
            text += f"• {item}\n"
    
    return text

def create_ats_friendly_pdf(resume_data: ResumeData, enhanced_content: dict) -> BytesIO:
    """Create an ATS-friendly PDF resume using ReportLab."""
    buffer = BytesIO()
    doc = SimpleDocTemplate(buffer, pagesize=letter,
                           rightMargin=72, leftMargin=72,
                           topMargin=72, bottomMargin=18)
    
    elements = []
    styles = getSampleStyleSheet()
    
    # Custom styles
    title_style = ParagraphStyle(
        'CustomTitle',
        parent=styles['Heading1'],
        fontSize=20,
        textColor=colors.HexColor('#1a1a1a'),
        spaceAfter=6,
        alignment=TA_CENTER,
        fontName='Helvetica-Bold'
    )
    
    heading_style = ParagraphStyle(
        'CustomHeading',
        parent=styles['Heading2'],
        fontSize=12,
        textColor=colors.HexColor('#2c3e50'), # Dark Blue-Grey
        spaceAfter=6,
        spaceBefore=12,
        fontName='Helvetica-Bold'
    )
    
    normal_style = ParagraphStyle(
        'CustomNormal',
        parent=styles['Normal'],
        fontSize=10,
        textColor=colors.HexColor('#333333'),
        spaceAfter=6,
        alignment=TA_LEFT,
        fontName='Helvetica'
    )
    
    def escape_html(text: str) -> str:
        """Escape HTML special characters for ReportLab Paragraph."""
        if not text:
            return ""
        return html.escape(str(text))
    
    # 1. Header
    name = f"{resume_data.personalInfo.firstName.upper()} {resume_data.personalInfo.lastName.upper()}"
    elements.append(Paragraph(escape_html(name), title_style))
    elements.append(Spacer(1, 0.1*inch))
    
    # 2. Contact Information
    contact_info = f"{resume_data.personalInfo.email} | {resume_data.personalInfo.phone}"
    if resume_data.personalInfo.address:
        contact_info += f" | {resume_data.personalInfo.address}"
    elements.append(Paragraph(escape_html(contact_info), normal_style))
    elements.append(Spacer(1, 0.2*inch))
    
    # 3. Professional Summary
    summary_text = enhanced_content.get("summary", resume_data.personalInfo.summary)
    if summary_text:
        elements.append(Paragraph("PROFESSIONAL SUMMARY", heading_style))
        elements.append(Paragraph(escape_html(summary_text), normal_style))
        elements.append(Spacer(1, 0.1*inch))
    
    # 4. Experience
    if resume_data.experience:
        elements.append(Paragraph("PROFESSIONAL EXPERIENCE", heading_style))
        for exp in resume_data.experience:
            # Job title and company line
            job_title_escaped = escape_html(exp.jobTitle)
            company_escaped = escape_html(exp.company) if exp.company else ""
            
            job_header = f"<b>{job_title_escaped}</b>"
            if company_escaped:
                job_header += f" | {company_escaped}"
            
            date_range = f"{exp.startDate} - {'Present' if exp.current else exp.endDate}"
            
            elements.append(Paragraph(job_header, normal_style))
            elements.append(Paragraph(escape_html(date_range), normal_style))
            elements.append(Spacer(1, 0.05*inch))
            
            # Responsibilities
            enhanced_resps = enhanced_content.get("experiences", {}).get(exp.id, exp.responsibilities)
            for resp in enhanced_resps:
                resp_escaped = escape_html(str(resp))
                elements.append(Paragraph(f"• {resp_escaped}", normal_style))
            elements.append(Spacer(1, 0.1*inch))
    
    # 5. Education
    if resume_data.education:
        elements.append(Paragraph("EDUCATION", heading_style))
        for edu in resume_data.education:
            degree_escaped = escape_html(edu.degree)
            institution_escaped = escape_html(edu.institution)
            elements.append(Paragraph(f"<b>{degree_escaped}</b>", normal_style))
            
            edu_details = f"{institution_escaped} | {edu.startYear} - {edu.endYear}"
            if edu.gpa:
                edu_details += f" | GPA: {edu.gpa}"
            elements.append(Paragraph(escape_html(edu_details), normal_style))
            elements.append(Spacer(1, 0.1*inch))
    
    # 6. Skills
    if resume_data.skills:
        elements.append(Paragraph("SKILLS", heading_style))
        skills_text = ", ".join([escape_html(s) for s in resume_data.skills])
        elements.append(Paragraph(skills_text, normal_style))
        elements.append(Spacer(1, 0.1*inch))
    
    # 7. Additional Info
    if resume_data.extra:
        elements.append(Paragraph("ADDITIONAL INFORMATION", heading_style))
        for item in resume_data.extra:
            item_escaped = escape_html(str(item))
            elements.append(Paragraph(f"• {item_escaped}", normal_style))

    doc.build(elements)
    buffer.seek(0)
    return buffer

# --- API Endpoints ---

@app.post("/enhance-text")
async def enhance_text(request: TextEnhancementRequest):
    """Enhance specific text segments using Gemini."""
    if not request.text.strip():
        return {"enhancedText": ""}
    
    if not GEMINI_API_KEY:
        return {"enhancedText": request.text}

    try:
        model = genai.GenerativeModel(GEMINI_MODEL_NAME)
        
        prompt = ""
        if request.type == 'summary':
            prompt = f"""You are an expert resume writer. Rewrite the following professional summary to be more professional, impactful, and ATS-friendly. 
            Also correct any spelling or grammar mistakes. Keep it concise (2-3 sentences).
            original: "{request.text}"
            return only the enhanced text."""
        elif request.type == 'description' or request.type == 'responsibility':
            prompt = f"""You are an expert resume writer. Rewrite the following job responsibility or project description to use strong action verbs, be more professional, and impactful.
            Also correct any spelling or grammar mistakes.
            original: "{request.text}"
            return only the enhanced text."""
        else:
            prompt = f"""You are an expert editor. Polish the following text for a professional resume, correcting any spelling and grammar errors.
            original: "{request.text}"
            return only the enhanced text."""

        response = model.generate_content(prompt)
        return {"enhancedText": response.text.strip()}
    except Exception as e:
        print(f"Error enhancing text: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/generate-resume")
async def generate_resume_endpoint(resume: ResumeData):
    """Generate the full resume PDF."""
    try:
        # 1. Enhance Content
        enhanced_content = enhance_resume_with_gemini(resume)
        
        # 2. Generate PDF
        pdf_buffer = create_ats_friendly_pdf(resume, enhanced_content)
        
        # 3. Return PDF
        headers = {
            'Content-Disposition': f'attachment; filename="resume_{resume.personalInfo.lastName}.pdf"'
        }
        return Response(content=pdf_buffer.getvalue(), headers=headers, media_type="application/pdf")
        
    except Exception as e:
        print(f"Error generating resume: {str(e)}")
        # Log stack trace in a real app
        raise HTTPException(status_code=500, detail="Failed to generate resume")

# --- Entry Point ---

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)