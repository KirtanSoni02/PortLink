# ⚓ PortLink

**PortLink** is a real-time vessel tracking and sailor contract management platform. It empowers port authorities and sailors to interact through a seamless web interface to manage contracts, assign crews, monitor ships, and track live ship movements with real-time location updates and weather intelligence.

🌐 **Live Website:** [Visit PortLink](https://portlink-realtime-marine-operations-and.onrender.com)

---

## 📌 Table of Contents

- [🚀 Features](#-features)
- [🛠️ Tech Stack](#️-tech-stack)
- [🧠 Project Structure](#-project-structure)
- [📦 Installation](#-installation)
- [🖥️ Usage](#️-usage)
- [🔗 API Overview](#-api-overview)
- [🌐 WebSocket Events](#-websocket-events)
- [🗺️ Live Tracking](#-live-tracking)
- [📈 Ship Conversion Logic](#-ship-conversion-logic)
- [📊 Dashboard UI](#-dashboard-ui)
- [🧪 Testing](#-testing)
- [🚧 Future Enhancements](#-future-enhancements)


---

## 🚀 Features

- 📝 **Job Posting System**: Port Authorities can post job openings for sailors.
- 📥 **Sailor Application**: Sailors can apply to job posts and get assigned automatically.
- ⛴️ **Ship Conversion**: Job posts are auto-converted to ships when criteria match.
- 🌍 **Real-Time Location Tracking**: Using WebSockets to track ships & sailors on live maps.
- 🌦️ **Weather Updates**: Dynamic weather fetched via OpenWeather API.
- 📍 **Route Monitoring**: Source, Destination, and Current location markers with ETA.
- 🔐 **Authentication & Authorization**: Role-based access (Port Authority / Sailor).
- 📊 **Interactive Dashboard**: Visual representation of ongoing contracts and ship status.

---

## 🛠️ Tech Stack

**Frontend:**
- React.js + TypeScript
- Tailwind CSS + Framer Motion
- Leaflet.js (for maps)

**Backend:**
- Node.js + Express.js
- MongoDB (via Mongoose)
- Socket.io (WebSocket handling)
- OpenWeatherMap API (for weather)

**Other Tools:**
- JWT (Authentication)
- Axios (HTTP requests)
- Render (Frontend Deployment)
- Render (Backend Deployment)

---

## 🧠 Project Structure

```

web-sailor/
├── backend/
│   ├── controllers/
│   ├── models/
│   ├── routes/
│   ├── utils/
│   ├── middlewares/
│   ├── portLocations.js
│   └── server.js
├── frontend/
│   ├── components/
│   ├── pages/
│   ├── utils/
│   └── App.tsx
└── README.md

````

---

## 📦 Installation

1. **Clone the repo:**
```bash
git clone https://github.com/your-username/web-sailor.git
cd web-sailor
````

2. **Backend Setup:**

```bash
cd backend
npm install
cp .env.example .env
# Fill in the environment variables
npm start
```

3. **Frontend Setup:**

```bash
cd ../frontend
npm install
npm run dev
```

---

## 🖥️ Usage

* **Port Authorities** can:

  * Create job posts.
  * View applications.
  * Track live ship movement.
  * See weather & ETA data.

* **Sailors** can:

  * Apply to job posts.
  * View contract history.
  * Track their assigned ship’s progress.

---

## 🔗 API Overview

| Method | Endpoint                                   | Description                                 |
| ------ | ------------------------------------------ | ------------------------------------------- |
| POST   | `/api/auth/login`                          | User login                                  |
| POST   | `/api/auth/register`                       | User registration                           |
| GET    | `/api/auth/`                               | Auth route test                             |
| GET    | `/api/port/profile`                        | Get port dashboard profile                  |
| GET    | `/api/port/jobs`                           | Get all job posts for port                  |
| POST   | `/api/port/jobs`                           | Create new job post (port authority)        |
| GET    | `/api/port/dashboard`                      | Get port dashboard overview                 |
| GET    | `/api/activejob/activejobpost`             | Get active job posts                        |
| DELETE | `/api/activejob/delete/:jobId`             | Delete active job post                      |
| GET    | `/api/activejob/view/:jobId`               | View active job post details                |
| GET    | `/api/contract/completed`                  | Get all completed contracts                 |
| DELETE | `/api/contract/delete/:id`                 | Delete completed contract                   |
| GET    | `/api/ship/active`                         | Get active ships by port                    |
| GET    | `/api/ship/incoming`                       | Get incoming ships to port                  |
| GET    | `/api/ship/realtimetracking`               | Get all ship information (real-time)        |
| GET    | `/api/sailor/dashboard`                    | Get sailor dashboard data                   |
| PUT    | `/api/sailor/edit-profile`                 | Update sailor profile                       |
| GET    | `/api/sailor/available-shipments`          | Get available shipments for sailor          |
| GET    | `/api/sailor/contractshistory/:sailorId`   | Get sailor contract history                 |
| POST   | `/api/sailor/jobposts/assign-crew`         | Assign sailor to job post (apply)           |
---

## 🌐 WebSocket Events

| Event Name             | From            | To       | Description                     |
| ---------------------- | --------------- | -------- | ------------------------------- |
| `sailorLocationUpdate` | Sailor Frontend | Backend  | Emits live location of a sailor |
| `shipLocationUpdate`   | Backend         | Frontend | Sends updated ship location     |

---

## 🗺️ Live Tracking

* Built with **Leaflet** for modern map rendering.
* Shows:

  * 🟢 Source Port
  * 🔴 Current Location (with pulse)
  * 🔵 Destination Port
* Animated ship trajectory using Framer Motion.

---

## 📈 Ship Conversion Logic

* Job Post is auto-converted to a Ship when:

  * All sailors are assigned.
  * Or departure time has arrived.
* ETA is calculated using Haversine distance.
* Weather is fetched via OpenWeather API.

---

## 📊 Dashboard UI

* Components:

  * LiveMap.tsx
  * ShipDetails.tsx
  * JobManagement.tsx
  * RealTimeTracking.tsx
* Styled with Tailwind and animated with Framer Motion.
* Responsively shows:

  * Ship info
  * Progress bar
  * Weather status
  * Departure & Arrival dates

---

## 🧪 Testing

* Manual testing via Postman & UI.
* Jest + Supertest planned for backend endpoints.
* Cypress integration for frontend workflows (planned).

---

## 🚧 Future Enhancements

* 📱 Progressive Web App (PWA) support.
* 🛰️ AIS integration for real-world ship data.
* 📈 Admin analytics dashboard (charts, heatmaps).
* 📌 Geo-fencing alerts & SOS.
* 🧭 Navigation prediction using ML.
* 📑 PDF contract generation.

---

> Made with ❤️ for Indian coastal logistics by Kirtan Soni.






