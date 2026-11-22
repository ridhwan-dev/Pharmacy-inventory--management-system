# PIMS – Pharmacy Inventory Management System

## 1. Project Overview

PIMS (Pharmacy Inventory Management System) is a web-based application designed to help pharmacy staff manage medicine inventory efficiently.

Pharmacies need to monitor medicine quantities, expiry dates and stock levels to avoid shortages, wastage and poor inventory management. PIMS provides a centralized dashboard for managing medicines and monitoring stock conditions.

**Live Application:** https://pims-pharmacy-management.web.app

**GitHub Repository:** https://github.com/ridhwan-dev/Pharmacy-inventory--management-system

## 2. Problem Statement

Many pharmacies experience difficulties managing medicine inventory manually. This can result in inaccurate stock records, medicine shortages, expired products and delays in identifying medicines that need replenishment.

## 3. Proposed Solution

PIMS provides a responsive digital inventory management platform that allows authorized pharmacy staff to register, log in, manage medicine records and monitor inventory through a centralized dashboard.

The application uses Firebase Authentication for user authentication and Cloud Firestore for persistent medicine storage.

## 4. Minimum Viable Product (MVP) Features

- User registration and login using email and password.
- Google authentication.
- Secure logout and protected application routes.
- Add new medicine records.
- View and retrieve stored medicines.
- Update existing medicine information.
- Delete medicine records.
- Search medicines by name.
- Low-stock alerts for medicines with quantities of 10 or below.
- Expiry alerts for expired medicines and medicines expiring within 30 days.
- Dashboard displaying inventory statistics.
- Loading, error and empty states.

## 5. Technologies Used

| Technology | Purpose |
|---|---|
| React | Frontend development |
| JavaScript | Application functionality |
| Tailwind CSS | Styling configuration |
| Firebase Authentication | User authentication |
| Cloud Firestore | Database and persistent storage |
| React Router | Application navigation |
| Vitest | Automated testing |
| React Testing Library | Component testing |
| Git and GitHub | Version control |
| GitHub Actions | Continuous integration |
| Firebase Hosting | Application deployment |

## 6. Project Structure

```text
src/
├── components/
├── context/
├── pages/
├── services/
├── hooks/
└── test/
```

- **components:** Reusable interface components.
- **context:** Shared application and authentication state.
- **pages:** Application pages, including Dashboard, Login, Register and Medicines.
- **services:** Firebase configuration and authentication/inventory operations.
- **test:** Test setup and configuration.

## 7. Installation and Setup

### Prerequisites

- Node.js and npm
- Git
- A Firebase account

### Clone the repository

```bash
git clone https://github.com/ridhwan-dev/Pharmacy-inventory--management-system.git
cd Pharmacy-inventory--management-system
```

### Install dependencies

```bash
npm install
```

### Configure Firebase

Create a Firebase project and enable:

- Email/Password Authentication
- Google Authentication
- Cloud Firestore

Create a `.env` file in the project root and add your Firebase configuration:

```env
VITE_FIREBASE_API_KEY=your_api_key
VITE_FIREBASE_AUTH_DOMAIN=your_auth_domain
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_storage_bucket
VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
VITE_FIREBASE_APP_ID=your_app_id
```

Replace the placeholder values with your Firebase project configuration.

**Important:** Never commit your actual `.env` file to GitHub.

### Start the development server

```bash
npm run dev
```

Open the local URL displayed in your terminal.

## 8. Testing

The project uses Vitest and React Testing Library for automated testing.

Run all tests:

```bash
npm test
```

Generate a coverage report:

```bash
npm run test:coverage
```

### Test Results

- 32 automated tests.
- 65.2% statement coverage.
- Tests cover authentication, medicine services, dashboard functionality, reusable components and application context.

### Continuous Integration

GitHub Actions automatically runs automated tests and a production build when changes are pushed or pull requests are created.

## 9. Production Build

Generate an optimized production build:

```bash
npm run build
```

The production files are generated in the `dist` directory.

## 10. Deployment

PIMS is deployed using Firebase Hosting.

**Live Application:** https://pims-pharmacy-management.web.app

To deploy an updated version:

```bash
npm run build
firebase deploy --only hosting
```

## 11. Project Objectives

- Build a functional pharmacy inventory management application.
- Implement React components and reusable application architecture.
- Apply React state, props, hooks and context.
- Implement user authentication and protected routes.
- Perform CRUD operations using Cloud Firestore.
- Implement search and inventory alerts.
- Write automated tests and achieve at least 65% code coverage.
- Use GitHub branches and pull requests for collaborative development practices.
- Configure continuous integration using GitHub Actions.
- Deploy the application using Firebase Hosting.

## 12. Author

**Ridhwan Inshar**

GitHub: https://github.com/ridhwan-dev

---

*PIMS – Making Pharmacy Inventory Management More Efficient.*