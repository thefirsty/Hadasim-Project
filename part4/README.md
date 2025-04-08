# Grocery Store Management System
## מערכת ניהול חנות מכולת

A full-stack web application for managing a grocery store, built with modern technologies.
אפליקציית ווב מלאה לניהול חנות מכולת, בנויה עם טכנולוגיות מודרניות.

## Project Overview | סקירת הפרויקט

This project consists of two main parts:
הפרויקט מורכב משני חלקים עיקריים:

### Client Side | צד לקוח (GroceryClient)
- Built with React + TypeScript
- Uses Vite as build tool
- Redux for state management
- React Router for navigation
- Axios for API calls
- Modern, responsive UI design

### Server Side | צד שרת (Grocery)
- Built with .NET (C#)
- Clean Architecture design pattern
- Layered structure:
  - Service Layer
  - Repository Layer
  - Common Layer
  - Mock Layer 
- RESTful API architecture

## Prerequisites | דרישות מקדימות

Before running the project, make sure you have:
לפני הרצת הפרויקט, וודאו שיש לכם:

### For Client | לצד לקוח
- Node.js (v18 or higher)
- npm or yarn package manager

### For Server | לצד שרת
- .NET SDK 6.0 or higher
- Visual Studio 2022 or VS Code with C# extensions
- SQL Server (if using SQL Server as database)

## Installation & Setup | התקנה והגדרה

### Client Side | צד לקוח
```bash
cd GroceryClient
npm install
npm run dev
```

The client will run on `http://localhost:5173`

### Server Side | צד שרת
1. Open the `Grocery.sln` solution in Visual Studio
2. Restore NuGet packages
3. Build the solution
4. Run the project

The server will run on `https://localhost:7001` (or similar port)

## Project Structure | מבנה הפרויקט

### Client Structure | מבנה צד לקוח
```
GroceryClient/
├── src/
│   ├── components/    # React components
│   ├── pages/        # Page components
│   ├── store/        # Redux store
│   ├── services/     # API services
│   └── types/        # TypeScript types
├── public/           # Static files
└── package.json      # Dependencies
```

### Server Structure | מבנה צד שרת
```
Grocery/
├── Service/          # Business logic and application services
├── Repository/       # Data access layer
├── Common/          # Shared code, models, and interfaces
├── Mock/            # Mock implementations for testing
└── Grocery.sln      # Solution file
```

## Features | תכונות

- User authentication and authorization
- Product management (CRUD operations)
- Shopping cart functionality
- Order management
- Admin dashboard
- Responsive design
- Clean architecture implementation
- Separation of concerns

## Environment Setup | הגדרות סביבה

### Client | צד לקוח
Create a `.env` file in the client root:
```
VITE_API_URL=https://localhost:7001
```

### Server | צד שרת
Configure the following in `appsettings.json`:
```json
{
  "ConnectionStrings": {
    "DefaultConnection": "your_connection_string"
  },
  "AppSettings": {
    "Secret": "your_jwt_secret"
  }
}
```

## API Documentation | תיעוד ה-API

The server provides RESTful endpoints for:
השרת מספק נקודות קצה RESTful עבור:

- Authentication and Authorization
- Product Management
- Order Processing
- User Management
- Shopping Cart Operations

Detailed API documentation is available through Swagger when running the server.




