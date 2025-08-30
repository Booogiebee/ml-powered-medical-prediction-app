# MediPredict - AI Disease Diagnosis System

A production-ready web application that uses machine learning to predict common diseases (malaria, typhoid, influenza) from patient-reported symptoms and vital signs.

## 🚀 Features

- **AI-Powered Predictions**: Calibrated multiclass classification with probability scores and confidence intervals
- **Role-Based Authentication**: Secure access for Patients, Doctors, and Administrators
- **Comprehensive UI**: Responsive design with clinical-grade accessibility
- **PDF Reports**: Professional medical reports with disclaimers and recommendations
- **RESTful API**: OpenAPI-documented endpoints with rate limiting
- **Patient Management**: Complete visit history and timeline tracking

## 🛠 Tech Stack

- **Frontend**: Next.js 14, TypeScript, Tailwind CSS, shadcn/ui
- **Backend**: Next.js API Routes, NextAuth.js
- **Database**: PostgreSQL with Prisma ORM
- **ML Model**: JavaScript implementation with probability calibration
- **PDF Generation**: jsPDF with html2canvas
- **State Management**: React Query (TanStack Query)

## 📋 Prerequisites

- Node.js 18+ 
- PostgreSQL database
- npm or yarn package manager

## 🚀 Quick Start

1. **Clone and Install**
   ```bash
   npm install
   ```

2. **Environment Setup**
   ```bash
   cp .env.example .env
   # Edit .env with your database credentials and secrets
   ```

3. **Database Setup**
   ```bash
   npx prisma migrate dev
   npx prisma db seed
   ```

4. **Start Development Server**
   ```bash
   npm run dev
   ```

Visit http://localhost:3000 to access the application.

## 🔐 Demo Accounts

- **Doctor**: doctor@demo.com / password123
- **Patient**: patient@demo.com / password123
- **Admin**: admin@demo.com / password123

## 📊 API Documentation

### Prediction Endpoint

```http
POST /api/predict
Authorization: Bearer <jwt-token>
Content-Type: application/json

{
  "age": 30,
  "sex": "female",
  "temperatureC": 38.5,
  "heartRate": 95,
  "symptoms": ["fever", "headache", "muscle aches"],
  "durationDays": 3,
  "travelHistory": false,
  "notes": "Patient reports feeling weak"
}
```

### Response Format

```json
{
  "ranked": [
    {
      "label": "influenza",
      "probability": 0.72,
      "ci95": [0.65, 0.79]
    }
  ],
  "calibrated": true,
  "confidence": 0.85,
  "explanation": [
    {
      "feature": "High temperature (38.5°C)",
      "contribution": 0.3
    }
  ],
  "modelVersion": "1.0.0"
}
```

## 🏥 Medical Safety

This application includes comprehensive medical disclaimers and safety measures:

- Clear educational-only disclaimers on all diagnostic outputs
- Confidence thresholds with low-confidence warnings
- Emergency contact recommendations for severe symptoms
- Professional medical consultation advisories

## 🔒 Security Features

- JWT-based authentication with role-based access control
- Input validation and sanitization
- Rate limiting on API endpoints
- HTTPS enforcement
- Audit logging for all predictions

## 📱 Accessibility

- WCAG 2.1 AA compliant
- Keyboard navigation support
- Screen reader optimization
- High contrast color schemes
- Focus management and ARIA labels

## 🎯 Model Performance

The ML model provides:
- Multiclass classification for 4 conditions
- Probability calibration for reliable confidence scores
- Bootstrap confidence intervals
- Feature importance explanations
- Performance metrics tracking

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## ⚠️ Disclaimer

This application is for educational and research purposes only. It is not intended to replace professional medical diagnosis or treatment. Always consult qualified healthcare professionals for medical decisions.
## Can I connect a custom domain to my Lovable project?

Yes, you can!

To connect a domain, navigate to Project > Settings > Domains and click Connect Domain.

Read more here: [Setting up a custom domain](https://docs.lovable.dev/tips-tricks/custom-domain#step-by-step-guide)
