Loan Application System

A fully responsive, dark-mode-friendly, Firebase-powered Loan Application System built with React, TypeScript, Tailwind CSS, and modern UI libraries. This application allows users to apply for loans, track their application progress, view EMIs on a calendar, and make repayments. Admin features like auto-approval based on user criteria are integrated for demo purposes.

⸻

🌐 Live Demo

Click here to visit the deployed site

[Visit the Loan App Demo](loan-application-system-lovat.vercel.app)

⸻

🌐 Github Link

Click here to visit Repo

[Visit the Github Repo](https://github.com/akash-collab/Loan-Application-System)

⸻

🌐 Video Link

Click here to visit Repo

[Visit the Youtube Video](https://youtu.be/XXFfPRHQIQg?si=xzbS5MJqiNIQ6LYs)

⸻


📋 Demo Account

Use this free account to test the app:
	•	Email: akash@gmail.com
	•	Password: 123456

Click the @ icon at the bottom of the Auth page to view demo credentials.

⸻

🔧 Prerequisites

Before you begin, make sure you have:
	•	Node.js (v16 or higher)
	•	npm or yarn
	•	Firebase account

Firebase services used:
	•	Firebase Authentication
	•	Firebase Realtime Database

⸻

🚀 Installation & Setup
	1.	Clone the repo

git clone https://github.com/your-username/loan-app.git
cd loan-app

	2.	Install dependencies

npm install
# or
yarn install

	3.	Setup Firebase

	•	Go to Firebase Console
	•	Create a new project
	•	Enable Email/Password Authentication
	•	Setup Realtime Database with test rules (for development):

{
  "rules": {
    ".read": "auth != null",
    ".write": "auth != null"
  }
}

	•	Get your config from Project Settings > General > Firebase SDK snippet

	4.	Create .env file

VITE_FIREBASE_API_KEY=YOUR_KEY
VITE_FIREBASE_AUTH_DOMAIN=YOUR_DOMAIN
VITE_FIREBASE_DATABASE_URL=YOUR_DB_URL
VITE_FIREBASE_PROJECT_ID=YOUR_PROJECT_ID

	5.	Run the app

npm run dev
# or
yarn dev

The app runs locally at: http://localhost:5173

⸻

🧩 Tech Stack
	•	React + TypeScript
	•	Tailwind CSS (with dark mode)
	•	Framer Motion (animations)
	•	Firebase Auth + Realtime DB
	•	Lucide Icons + react-hot-toast
	•	Vite (blazing fast dev server)

⸻

⚙️ Project Structure

src/
  components/        # UI components like Calendar, Notifications, Calculator
  contexts/          # Auth context
  layouts/           # MainLayout with navbar and sidebar
  pages/
    AuthPage/        # Login & Register screen
    Dashboard/       # Loan status, EMI calendar, history
    Apply/           # Loan form (multi-step)
  services/          # Firebase setup
  hooks/             # Custom React hooks


⸻

💡 Features

✅ Authentication
	•	Email/password login and registration
	•	Protected routes
	•	Auto-redirect to dashboard after login

🧾 Loan Application
	•	Multi-step form: Personal Info, Financial Info, Document Upload
	•	Zod validation
	•	Loan type selection (with dynamic interest)
	•	Auto-generation of repayment schedule

📊 Dashboard
	•	Responsive layout with:
	•	Top navbar
	•	Left calculator
	•	Right calendar with notifications
	•	Dynamic loan status bar (Pending > Under Review > Approved/Rejected)
	•	Filters and sorters by amount, date, loan type, status

📅 Repayment Calendar
	•	View upcoming EMIs
	•	EMI color status: Due, Paid, Missed
	•	EMI payment per month or full payoff

🔔 Notifications
	•	Recent updates below calendar
	•	Bell icon opens full list

📚 Loan Calculator
	•	Select loan type or use custom interest
	•	EMI, interest, processing fee, insurance calculator
	•	Copy estimate to clipboard

⸻

🔁 Flow of the Website

[ Login / Register ]
        ↓
[ Dashboard ]
    ↙        ↘
Apply Loan     View EMIs
    ↓               ↓
Status Bar     Repayment Calendar
                  ↓
             Payment History

	1.	Login/Register: Auth with Firebase
	2.	Dashboard: Shows user’s loan status + EMI schedule
	3.	Apply for Loan: Fill 3-step form
	4.	Auto Approval: In 20 seconds, backend logic approves or rejects based on income, employment, etc.
	5.	Calendar Sidebar: Shows EMI dates (clickable only if EMI exists)
	6.	Repayment Calendar: View all EMIs, pay one or all
	7.	History: Shows paid loans

⸻

🔐 Admin Logic (Demo)
	•	Auto-approval after 20s using income-to-loan ratio
	•	EMI generation for each approved loan
	•	No backend/server needed — all handled in Realtime DB logic

⸻

📷 Screenshots

Include screenshots of:
	•	![Dashboard](../LoanApplication/src/assets/Screenshots/Dashboard.png)
	•	![Loan Form ](../LoanApplication/src/assets/Screenshots/Loan%20Form.png)
	•	![Calendar Sidebar](../LoanApplication/src/assets/Screenshots/Calendar_Sidebar.png)  
	•	![Notification Toasts](../LoanApplication/src/assets/Screenshots/Notification_Toasts.png) 
	•	![Loan Calculator](../LoanApplication/src/assets/Screenshots/Loan_Calculator.png)
    •	![Payment History](../LoanApplication/src/assets/Screenshots/Payment_History.png)
    •	![Upcoming Payment](../LoanApplication/src/assets/Screenshots/Upcoming_Payments.png)

⸻

📦 Packages Used
	•	firebase
	•	react-hot-toast
	•	framer-motion
	•	lucide-react
	•	zod
	•	react-hook-form
	•	copy-to-clipboard
	•	date-fns

Install with:

npm install firebase react-hot-toast framer-motion lucide-react zod react-hook-form copy-to-clipboard date-fns


⸻

👨‍💻 Author

Built by @Akash

⸻

📄 License

MIT License — Feel free to use and modify.
