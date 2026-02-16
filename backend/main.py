from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import Response
from pydantic import BaseModel
from typing import List, Optional
import os
from dotenv import load_dotenv
import google.generativeai as genai
from reportlab.lib.pagesizes import letter
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.lib.units import inch
from reportlab.platypus import SimpleDocTemplate, Paragraph, Spacer, Table, TableStyle, PageBreak
from reportlab.lib import colors
from reportlab.lib.enums import TA_LEFT, TA_CENTER, TA_JUSTIFY
from io import BytesIO
import json
import html

# Load environment variables
load_dotenv()

app = FastAPI(title="AI Resume Generator API")

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://localhost:5174", "http://localhost:3000"],  # Add your frontend URLs
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Configure Gemini API
GEMINI_API_KEY = os.getenv("GEMINI_API_KEY")
if GEMINI_API_KEY:
    genai.configure(api_key=GEMINI_API_KEY)
else:
    print("Warning: GEMINI_API_KEY not found in environment variables")

# Pydantic models matching frontend structure
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

class ResumeData(BaseModel):
    personalInfo: PersonalInfo
    education: List[Education]
    experience: List[Experience]
    skills: List[str]
    extra: List[str]

def enhance_resume_with_gemini(resume_data: ResumeData) -> dict:
    """Use Gemini API to enhance resume content for ATS compatibility.
    Returns a dict with enhanced summary and experience descriptions."""
    try:
        if not GEMINI_API_KEY:
            return {
                "summary": resume_data.personalInfo.summary,
                "experiences": {exp.id: exp.responsibilities for exp in resume_data.experience}
            }
        
        model = genai.GenerativeModel('gemini-2.5-flash-lite')
        
        # Enhance professional summary
        summary_prompt = f"""You are an expert resume writer. Rewrite this professional summary to be more ATS-friendly, impactful, and keyword-rich while keeping it concise (2-3 sentences):

Original Summary: {resume_data.personalInfo.summary}

Return only the enhanced summary text, nothing else."""
        
        enhanced_summary = resume_data.personalInfo.summary
        try:
            summary_response = model.generate_content(summary_prompt)
            enhanced_summary = summary_response.text.strip()
        except Exception as e:
            print(f"Error enhancing summary: {str(e)}")
        
        # Enhance experience descriptions
        enhanced_experiences = {}
        for exp in resume_data.experience:
            exp_prompt = f"""You are an expert resume writer. Rewrite these job responsibilities to be more ATS-friendly with:
1. Strong action verbs (e.g., "Developed", "Implemented", "Led")
2. Quantifiable achievements where possible
3. Relevant keywords naturally integrated
4. Clear, concise bullet points

Job Title: {exp.jobTitle}
Company: {exp.company}
Responsibilities:
{chr(10).join([f"- {resp}" for resp in exp.responsibilities])}

Return only the enhanced bullet points, one per line, starting with "•". Keep the same number of points."""
            
            try:
                exp_response = model.generate_content(exp_prompt)
                enhanced_bullets = [line.strip().lstrip('•').strip() for line in exp_response.text.split('\n') if line.strip()]
                enhanced_experiences[exp.id] = enhanced_bullets if enhanced_bullets else exp.responsibilities
            except Exception as e:
                print(f"Error enhancing experience {exp.id}: {str(e)}")
                enhanced_experiences[exp.id] = exp.responsibilities
        
        return {
            "summary": enhanced_summary,
            "experiences": enhanced_experiences
        }
    except Exception as e:
        print(f"Error calling Gemini API: {str(e)}")
        return {
            "summary": resume_data.personalInfo.summary,
            "experiences": {exp.id: exp.responsibilities for exp in resume_data.experience}
        }

def format_resume_text(resume_data: ResumeData) -> str:
    """Format resume data into text format (fallback if Gemini API fails)."""
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
    """Create an ATS-friendly PDF resume."""
    buffer = BytesIO()
    doc = SimpleDocTemplate(buffer, pagesize=letter,
                           rightMargin=72, leftMargin=72,
                           topMargin=72, bottomMargin=18)
    
    # Container for the 'Flowable' objects
    elements = []
    
    # Define styles
    styles = getSampleStyleSheet()
    
    # Custom styles for ATS-friendly resume
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
        textColor=colors.HexColor('#2c3e50'),
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
    
    # Header
    name = f"{resume_data.personalInfo.firstName.upper()} {resume_data.personalInfo.lastName.upper()}"
    elements.append(Paragraph(escape_html(name), title_style))
    elements.append(Spacer(1, 0.1*inch))
    
    # Contact Information
    contact_info = f"{resume_data.personalInfo.email} | {resume_data.personalInfo.phone}"
    if resume_data.personalInfo.address:
        contact_info += f" | {resume_data.personalInfo.address}"
    elements.append(Paragraph(escape_html(contact_info), normal_style))
    elements.append(Spacer(1, 0.2*inch))
    
    # Professional Summary (use enhanced version if available)
    summary_text = enhanced_content.get("summary", resume_data.personalInfo.summary)
    if summary_text:
        elements.append(Paragraph("PROFESSIONAL SUMMARY", heading_style))
        elements.append(Paragraph(escape_html(summary_text), normal_style))
        elements.append(Spacer(1, 0.1*inch))
    
    # Experience
    if resume_data.experience:
        elements.append(Paragraph("PROFESSIONAL EXPERIENCE", heading_style))
        for exp in resume_data.experience:
            # Job title and company
            job_title_escaped = escape_html(exp.jobTitle)
            company_escaped = escape_html(exp.company) if exp.company else ""
            job_header = f"<b>{job_title_escaped}</b>"
            if company_escaped:
                job_header += f" | {company_escaped}"
            date_range = f"{exp.startDate} - {'Present' if exp.current else exp.endDate}"
            elements.append(Paragraph(job_header, normal_style))
            elements.append(Paragraph(escape_html(date_range), normal_style))
            elements.append(Spacer(1, 0.05*inch))
            
            # Responsibilities (use enhanced version if available)
            enhanced_resps = enhanced_content.get("experiences", {}).get(exp.id, exp.responsibilities)
            for resp in enhanced_resps:
                resp_escaped = escape_html(str(resp))
                elements.append(Paragraph(f"• {resp_escaped}", normal_style))
            elements.append(Spacer(1, 0.1*inch))
    
    # Education
    if resume_data.education:
        elements.append(Paragraph("EDUCATION", heading_style))
        for edu in resume_data.education:
            degree_escaped = escape_html(edu.degree)
            institution_escaped = escape_html(edu.institution) if edu.institution else ""
            edu_text = f"<b>{degree_escaped}</b>"
            if institution_escaped:
                edu_text += f" | {institution_escaped}"
            edu_text += f" | {edu.startYear} - {edu.endYear}"
            if edu.gpa:
                edu_text += f" | GPA: {escape_html(edu.gpa)}"
            elements.append(Paragraph(edu_text, normal_style))
            elements.append(Spacer(1, 0.05*inch))
    
    # Skills
    if resume_data.skills:
        elements.append(Paragraph("SKILLS", heading_style))
        # Format skills as simple text for better ATS parsing
        skills_text = ", ".join([escape_html(skill) for skill in resume_data.skills])
        elements.append(Paragraph(skills_text, normal_style))
        elements.append(Spacer(1, 0.1*inch))
    
    # Additional Information
    if resume_data.extra:
        elements.append(Paragraph("ADDITIONAL INFORMATION", heading_style))
        for item in resume_data.extra:
            item_escaped = escape_html(str(item))
            elements.append(Paragraph(f"• {item_escaped}", normal_style))
    
    # Build PDF
    try:
        doc.build(elements)
        buffer.seek(0)
        return buffer
    except Exception as e:
        print(f"Error building PDF: {str(e)}")
        raise

@app.get("/")
def read_root():
    return {"message": "AI Resume Generator API is running"}

@app.post("/generate-resume")
async def generate_resume(resume_data: ResumeData):
    """Generate an ATS-friendly resume PDF using Gemini AI."""
    try:
        # Enhance resume content with Gemini AI
        enhanced_content = enhance_resume_with_gemini(resume_data)
        
        # Create PDF
        pdf_buffer = create_ats_friendly_pdf(resume_data, enhanced_content)
        
        # Get PDF bytes
        pdf_bytes = pdf_buffer.getvalue()
        pdf_buffer.close()
        
        # Validate PDF was created
        if not pdf_bytes or len(pdf_bytes) < 100:
            raise HTTPException(status_code=500, detail="Failed to generate PDF - PDF buffer is empty or too small")
        
        # Return PDF as response
        return Response(
            content=pdf_bytes,
            media_type="application/pdf",
            headers={
                "Content-Disposition": f"attachment; filename=\"{resume_data.personalInfo.firstName}_{resume_data.personalInfo.lastName}_Resume.pdf\"",
                "Content-Length": str(len(pdf_bytes))
            }
        )
    except HTTPException:
        raise
    except Exception as e:
        import traceback
        error_details = traceback.format_exc()
        print(f"Error generating resume: {error_details}")
        raise HTTPException(status_code=500, detail=f"Error generating resume: {str(e)}")

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
