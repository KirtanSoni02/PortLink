# ⚓ Web Sailor

**Web Sailor** is a real-time vessel tracking and sailor contract management platform. It empowers port authorities and sailors to interact through a seamless web interface to manage contracts, assign crews, monitor ships, and track live ship movements with real-time location updates and weather intelligence.


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
- [📄 License](#-license)

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
- Vercel / Netlify (Frontend Deployment)
- Render / Railway / Fly.io (Backend Deployment)

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
npm run dev
```

3. **Frontend Setup:**

```bash
cd ../frontend
npm install
npm start
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

| Method | Endpoint               | Description                 |
| ------ | ---------------------- | --------------------------- |
| GET    | `/api/jobs`            | List all jobs               |
| POST   | `/api/jobs`            | Create new job post         |
| PUT    | `/api/jobs/:id`        | Edit job post               |
| POST   | `/api/sailor/apply`    | Sailor applies to a job     |
| GET    | `/api/ships`           | View ships                  |
| PUT    | `/api/sailor/location` | Update sailor live location |

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





