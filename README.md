# ⏱️ TimeKeeper: Ultimate Productivity Tracker

**TimeKeeper** is a premium, high-performance time tracking application designed for individuals and teams who value precision. Built with a modern Angular stack and a "Serverless" Google Sheets backend, it combines professional-grade analytics with an elegant, glassmorphic interface.

![Project Preview](https://via.placeholder.com/800x400?text=TimeKeeper+Dashboard+Preview)

## ✨ Features

- 🕒 **Precision Tracking**: Start and end sessions with a single click. Uses standardized 24-hour formatting (`HH:mm:ss`) for total accuracy.
- 📊 **Dynamic Dashboard**: Real-time duration calculation and session history categorized by status and target times.
- 📅 **Calendar Views**: Visualize your productivity across the month with integrated calendar headers and daily deep-dives.
- ☁️ **Zero-Backend Cloud Sync**: All data is securely synced to a private Google Sheet via a custom Apps Script Bridge. No expensive database needed.
- 🔐 **Multi-User Isolation**: Supporting both Google Identity Services and Simple Profile modes. Keep team logs separate and private.
- 🎨 **Premium Aesthetics**: Built with Tailwind CSS and Angular Material. Features glassmorphism, smooth micro-animations, and a responsive layout.
- 📥 **Export to Excel**: One-click export for project reporting and payroll.

## 🚀 Tech Stack

- **Frontend**: Angular 19+ (Standalone Components, Signals, RxJS)
- **Styling**: Tailwind CSS, Angular Material, Glassmorphism
- **Backend / DB**: Google Sheets + Google Apps Script (RESTful API)
- **Auth**: Google Identity Services (GSI)
- **Data Export**: XLSX / File-Saver

## 🛠️ Quick Start

### 1. Prerequisites
- Node.js (v18+)
- Angular CLI (`npm install -g @angular/cli`)

### 2. Installation
```bash
git clone https://github.com/your-username/time-tracker.git
cd time-tracker
npm install
```

### 3. Google Sheets Setup (Backend)
1. Create a new Google Sheet.
2. Go to **Extensions > Apps Script**.
3. Paste the provided `Code.gs` script (found in the project documentation).
4. Click **Deploy > New Deployment**.
5. Select type "Web App", set "Execute as: Me", and "Who has access: Anyone".
6. Copy the **Web App URL** and paste it into `src/app/services/time-log.service.ts` as `SCRIPT_URL`.

### 4. Running Locally
```bash
ng serve
```
Navigate to `http://localhost:4200`.

## 📖 Authentication Setup

To use **Continue with Google**:
1. Obtain a **Client ID** from the [Google Cloud Console](https://console.cloud.google.com/).
2. Add `http://localhost:4200` to your Authorized JavaScript Origins.
3. Replace the placeholder in `src/app/login/login.component.ts` with your ID.

---

## 👨‍💻 Author
**Anshuman** - [GitHub Profile](https://github.com/your-profile)

## 📄 License
This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
