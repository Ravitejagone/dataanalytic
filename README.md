# DataSync - Advanced BI & Data Analytics Dashboard

DataSync is a premium full-stack Business Intelligence platform built for modern data teams. It allows users to upload datasets (CSV/Excel), build dynamic drag-and-drop dashboards, and monitor KPIs in real-time.

## 🚀 Key Features

- **Multi-Source Data Integration**: Seamlessly upload and parse CSV and Excel files.
- **Dynamic Dashboard Builder**: Drag, resize, and configure widgets (Line, Bar, Pie, KPI, Tables).
- **Responsive Aesthetics**: Modern, premium UI with glassmorphism and smooth transitions.
- **Secure Authentication**: JWT-based login/signup with role-based access control.
- **Real-time KPI Monitoring**: Powered by WebSockets for live data updates (ready for extension).

## 🛠️ Tech Stack

- **Frontend**: React.js, Tailwind CSS, Recharts, Lucide Icons, Framer Motion.
- **Backend**: Node.js, Express.js, Sequelize ORM, Socket.io.
- **Database**: PostgreSQL (with JSONB for flexible data storage).

## 📂 Project Structure

```text
dataanalytics/
├── client/                # Frontend React application
│   ├── src/
│   │   ├── components/    # Reusable UI & Chart components
│   │   ├── pages/         # Dashboard, Datasets, Auth pages
│   │   ├── services/      # Axios API configuration
│   │   └── context/       # Auth state management
├── server/                # Backend Node.js API
│   ├── models/            # Sequelize Database models
│   ├── controllers/       # Business logic
│   ├── routes/            # Express route definitions
│   ├── config/            # Database configuration
│   └── utils/             # Helpers & Seeding scripts
```

## 🚥 Getting Started

### 1. Prerequisites
- PostgreSQL installed and running.
- Node.js (v16+) installed.

### 2. Backend Setup
1. Open a terminal in the `server` folder.
2. Create a database named `dataanalytics` in PostgreSQL.
3. Update `.env` with your PostgreSQL credentials if different.
4. Run `npm install`.
5. Run the seed script to populate initial data:
   ```bash
   node utils/seed.js
   ```
6. Start the server:
   ```bash
   npm run dev  # or: nodemon app.js
   ```

### 3. Frontend Setup
1. Open a terminal in the `client` folder.
2. Run `npm install`.
3. Start the development server:
   ```bash
   npm run dev
   ```
4. Open your browser at `http://localhost:5173`.

### 4. Default Login
- **Email**: `admin@example.com`
- **Password**: `password123`

---
*Built with ❤️ for High-Performance Analytics.*
