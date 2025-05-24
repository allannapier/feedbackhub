# API Design Documentation

## Overview

FeedbackHub's API follows RESTful principles with a clear, predictable structure. All API routes are implemented using Next.js App Router API routes.

## Authentication

All authenticated endpoints require a Bearer token in the Authorization header:
```
Authorization: Bearer <token>
```

## Base URL

Development: `http://localhost:3000/api`
Production: `https://feedbackhub.app/api`

## Endpoints

### Authentication

#### POST /api/auth/register
Create a new user account
```json
{
  "email": "user@example.com",
  "password": "securepassword",
  "name": "John Doe"
}
```

#### POST /api/auth/login
Login to existing account
```json
{
  "email": "user@example.com",
  "password": "securepassword"
}
```

### Forms

#### GET /api/forms
Get all forms for authenticated user

#### POST /api/forms
Create a new feedback form
```json
{
  "title": "Customer Satisfaction",
  "question": "How would you rate our service?",
  "type": "rating",
  "settings": {
    "maxRating": 5,
    "color": "#3B82F6"
  }
}
```

#### GET /api/forms/:id
Get specific form details

#### PUT /api/forms/:id
Update form settings

#### DELETE /api/forms/:id
Delete a form