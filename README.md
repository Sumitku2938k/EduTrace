# EduTrace

EduTrace is an AI-assisted smart attendance and behavior analysis system designed to automate classroom attendance and generate insights from attendance data. The system uses face recognition for automatic attendance marking and analyzes patterns such as absenteeism, irregular attendance, and sudden drops in participation. 

Instead of only recording presence, EduTrace focuses on data-driven monitoring, helping teachers identify at-risk students and take early action.

## Problem Statement

Traditional attendance systems rely on manual entry, which is time-consuming and prone to errors. Most digital attendance tools only store attendance records but fail to provide meaningful insights.

Teachers often lack visibility into:
- Students with frequent absences
- Late arrival patterns
- Sudden drops in attendance
- Long-term attendance trends

Without analytics, attendance data becomes stored information rather than actionable intelligence.

## Objective

EduTrace aims to transform raw attendance data into behavioral insights by:
- Automating attendance using face recognition
- Tracking attendance trends over time
- Identifying irregular and at-risk students
- Providing teachers with actionable dashboards and alerts

## Key Features

### 📸 Smart Attendance
- Automatic face detection from classroom camera
- Face recognition using pre-trained models
- Attendance marked with timestamp
- No manual entry required

### 📊 Behavior Analysis
Attendance data is analyzed to detect patterns such as:
- Frequent absenteeism
- Late arrival patterns
- Sudden attendance drops
- Irregular attendance trends

Students are categorized into:
- **Regular**
- **Irregular**
- **At-Risk**

### 🖥️ Teacher Dashboard
The dashboard provides:
- Student attendance history
- Monthly attendance trends
- Risk indicators
- Early alerts for irregular attendance

## System Architecture

The system follows a modular architecture separating web services and AI processing.

```text
React Frontend
      ↓
Node.js / Express Backend
      ↓
Python AI Microservice
      ↓
MongoDB Database
```

### Components
- **Frontend (React)**: Provides teacher dashboard, charts, and student analytics.
- **Backend (Node.js + Express)**: Handles APIs, authentication, business logic, and communication with the AI service.
- **Database (MongoDB)**: Stores student records, attendance logs, face embeddings, and analysis results.
- **AI Microservice (Python)**: Handles face recognition and behavior analysis logic.

## Tech Stack

- **Frontend:** React.js, Chart libraries for visualization
- **Backend:** Node.js, Express.js
- **Database:** MongoDB
- **AI / Data Processing:** Python, Face recognition libraries, Basic ML / statistical analysis

## Behavior Analysis Logic

The system identifies patterns using rule-based analytics combined with simple machine learning techniques.

**Examples:**
- Attendance < 75% → **At-Risk**
- Frequent late entries → **Irregular**
- Sudden attendance drop → **Alert generated**

This approach ensures explainable AI decisions rather than black-box predictions.

## Folder Structure (Planned)

```text
EduTrace
│
├── frontend
│   ├── components
│   ├── pages
│   └── dashboard
│
├── backend
│   ├── controllers
│   ├── routes
│   ├── models
│   └── server.js
│
├── ai-service
│   ├── face_recognition.py
│   └── behavior_analysis.py
│
└── README.md
```

## Future Improvements
- Real-time classroom engagement detection
- Integration with Learning Management Systems (LMS)
- Parent notification system
- Academic performance correlation
- Predictive risk analysis

## Impact

EduTrace helps educational institutions move from manual attendance tracking to intelligent classroom monitoring, enabling early intervention and improved student accountability.
