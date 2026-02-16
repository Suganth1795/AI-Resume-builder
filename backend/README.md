# AI Resume Generator Backend

Backend server for generating ATS-friendly resumes using Google Gemini AI.

## Setup

1. Install dependencies:
```bash
pip install -r requirements.txt
```

2. Create a `.env` file in the backend directory:
```bash
cp .env.example .env
```

3. Add your Google Gemini API key to `.env`:
```
GEMINI_API_KEY=your_actual_api_key_here
```

To get a Gemini API key:
- Visit https://makersuite.google.com/app/apikey
- Sign in with your Google account
- Create a new API key
- Copy the key to your `.env` file

## Running the Server

```bash
python main.py
```

Or using uvicorn directly:
```bash
uvicorn main:app --reload --port 8000
```

The server will run on `http://localhost:8000`

## API Endpoints

### POST `/generate-resume`

Generates an ATS-friendly resume PDF.

**Request Body:**
```json
{
  "personalInfo": {
    "firstName": "John",
    "lastName": "Doe",
    "email": "john.doe@email.com",
    "phone": "123-456-7890",
    "address": "123 Main St, City, State",
    "summary": "Experienced software developer..."
  },
  "education": [
    {
      "id": "1",
      "degree": "Bachelor of Science",
      "institution": "University Name",
      "startYear": "2018",
      "endYear": "2022",
      "gpa": "3.8"
    }
  ],
  "experience": [
    {
      "id": "1",
      "jobTitle": "Software Engineer",
      "company": "Tech Company",
      "startDate": "2022-01",
      "endDate": "2024-01",
      "responsibilities": ["Developed web applications", "Led team projects"],
      "current": false
    }
  ],
  "skills": ["Python", "JavaScript", "React"],
  "extra": ["Additional information"]
}
```

**Response:**
- PDF file (application/pdf)
- Content-Disposition header with filename

## Features

- ✅ Uses Google Gemini AI to enhance resume content
- ✅ Generates ATS-friendly PDF resumes
- ✅ Standard resume formatting
- ✅ CORS enabled for frontend integration
- ✅ Error handling and fallback mechanisms
