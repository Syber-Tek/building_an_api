# Technical Deep-Dive: Pulse-Check-API

This document provides an exhaustive technical overview of the "Watchdog" Sentinel project, detailing the architectural decisions, code structure, and core logic.

---

## 📂 Project Structure

The project follows a modular "Service-Controller-Route" pattern to ensure separation of concerns and maintainability.

```text
pulse-check-api/
├── src/
│   ├── server.js            # Application entry point & middleware config
│   ├── routes/              # API Endpoint definitions
│   │   └── monitorRoutes.js
│   ├── controllers/         # Request handling & response orchestration
│   │   └── monitorController.js
│   ├── services/            # Core Business Logic (Timers, State, History)
│   │   └── monitorService.js
│   ├── data/                # In-memory data store (Map-based)
│   │   └── monitors.js
│   └── utils/               # Shared utilities (Logger, Alerting)
│       └── logger.js
├── README.md                # Main project overview & setup
└── PROJECT_DETAILS.md       # Technical deep-dive (This file)
```

---

## ⚙️ Core Logic & State Management

### 1. Timer Management (The "Dead Man's Switch")
The system uses Node.js `setTimeout` and `clearTimeout` to manage device lifecycles.
- **On Registration/Heartbeat**: A new timer is instantiated. If an old timer exists, it is cleared immediately to prevent ghost alerts.
- **On Pause**: The active timer is cleared, and the monitor's `paused` flag is set to `true`. Monitoring is suspended until the next heartbeat.

### 2. State Transitions
A monitor can exist in three primary states:
- `up`: The device is active and sending heartbeats.
- `down`: The timer expired before a heartbeat was received.
- `paused`: Monitoring is manually suspended for maintenance.

---

## 📊 Data Model

We use a JavaScript `Map` for the in-memory data store (`src/data/monitors.js`). This provides $O(1)$ lookup time for heartbeats, which is crucial for high-frequency monitoring systems.

**Monitor Object Schema:**
```json
{
  "id": "string (unique)",
  "timeout": "number (seconds)",
  "alert_email": "string",
  "status": "up | down | paused",
  "paused": "boolean",
  "lastHeartbeat": "ISO Timestamp",
  "history": "Array<EventObject>",
  "timer": "TimeoutObject (Internal only)"
}
```

---

## 🌟 Developer's Choice: Event History Logging

### Technical Implementation
The `monitorService` interacts with `addHistory` in the `logger.js` utility. Every critical transition is pushed into a history array within the monitor object.

**Why this matters for CritMon:**
1. **Root Cause Analysis (RCA)**: If a weather station goes down, engineers can check the history to see if it was being "paused" frequently before the failure, indicating a pre-existing power issue.
2. **Reliability Metrics**: By analyzing the `HEARTBEAT` timestamps in the history, the system can eventually calculate "uptime percentages" for each client.

---

## 🛡️ Error Handling & Robustness

- **Validation**: The `registerMonitor` service validates that the timeout is a positive number and that IDs are unique.
- **Graceful Failures**: If a heartbeat is sent for a non-existent ID, the system returns a standard `404 Not Found` rather than crashing.
- **Memory Management**: Timers are strictly cleared before being reassigned to prevent memory leaks in a long-running server environment.

---

## 🔧 Future Scalability

While this prototype uses in-memory storage, the architecture is designed to be "Database-Ready":
- The `monitorService` can be easily updated to use **Redis** (ideal for timers/heartbeats) or **PostgreSQL** without changing the Controller or Route logic.
- Webhook support can be added to the `logAlert` utility to send real-time notifications to Slack or PagerDuty.

---
*Technical documentation prepared for the CritMon Servers Inc. Engineering Team.*
