# Health Insurance Claim Processing and Fraud Detection System

A centralized system to automate claim processing, validate policy coverage, manage approvals, and identify potentially fraudulent claims.

## Tech Stack
- **Frontend:** HTML, CSS, JavaScript (Vanilla)
- **Backend:** Node.js, Express.js
- **Database:** MySQL (with Sequelize ORM)

## Features
1. **Authentication:** Role-based access for Hospitals, Policyholders, and Insurance Officers.
2. **Claim Submission:** Hospitals can submit claims and upload documents.
3. **Policy Validation:** Automated check for policy existence, expiry, and coverage.
4. **Fraud Risk Scoring:** Rule-based scoring system (0-100) to identify high-risk claims.
5. **Dashboards:**
   - **Officer:** Review claims, view fraud scores, approve/reject, and view audit logs.
   - **Hospital:** Submit claims and track their status.
   - **Policyholder:** View claim history and status.
6. **Notifications:** Simple alerts for claim status changes.
7. **Audit Trail:** Logs all major actions in the system.

## Setup Instructions

### 1. Database Setup
1. Install MySQL.
2. Create a database named `health_insurance_db`.
3. Update `.env` file with your MySQL credentials.

### 2. Backend Setup
1. Open terminal in the project root.
2. Run `npm install` to install dependencies.
3. Run `node server.js` to start the server.
4. The database tables will be automatically created on the first run.

### 3. Usage
1. Open `http://localhost:5000` in your browser.
2. Register a new user (Hospital, Policyholder, or Officer).
3. Hospitals can submit claims.
4. Officers can review and update claim statuses.
5. Policyholders and Hospitals can see status updates and notifications.

## Project Structure
- `backend/`: Controllers, Models, Routes, Middlewares, and Config.
- `frontend/`: HTML, CSS, and JS files.
- `server.js`: Main entry point.
- `.env`: Environment variables.
