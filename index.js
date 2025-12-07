import "dotenv/config";
import session from "express-session";
import express from "express";
import mongoose from "mongoose";
import Lab5 from "./Lab5/index.js";
import cors from "cors";
import db from "./Database/index.js";
import UserRoutes from "./Users/routes.js";
import CourseRoutes from "./Courses/routes.js";
import ModulesRoutes from "./Modules/routes.js";
import AssignmentsRoutes from "./Assignments/routes.js";
import EnrollmentsRoutes from "./Enrollments/routes.js";

const CONNECTION_STRING = process.env.DATABASE_CONNECTION_STRING || "mongodb://127.0.0.1:27017/kambaz"
mongoose.connect(CONNECTION_STRING);
const app = express();

app.use(
  cors({
    credentials: true,
    origin: process.env.CLIENT_URL || "http://localhost:3000",
  })
);

// Tab-specific session store
const tabSessions = new Map(); // tabId -> { currentUser: ... }

// Middleware to handle tab-specific sessions
app.use((req, res, next) => {
  const tabId = req.headers["x-tab-id"];
  if (tabId) {
    // Create or retrieve tab-specific session
    if (!tabSessions.has(tabId)) {
      tabSessions.set(tabId, { currentUser: null, lastAccess: Date.now() });
    }
    // Attach tab-specific session to request
    req.tabSession = tabSessions.get(tabId);
    // Update last access time
    req.tabSession.lastAccess = Date.now();
  } else {
    // Fallback: use empty session if no tab ID
    req.tabSession = { currentUser: null };
  }
  next();
});

const sessionOptions = {
  secret: process.env.SESSION_SECRET || "kambaz",
  resave: false,
  saveUninitialized: false,
};
if (process.env.SERVER_ENV !== "development") {
  sessionOptions.proxy = true;
  sessionOptions.cookie = {
    sameSite: "none",
    secure: true,
    domain: process.env.SERVER_URL,
  };
}
app.use(session(sessionOptions));
app.use(express.json());

app.use("/api/users", (req, res, next) => {
  console.log("HIT /api/users:", req.method, req.originalUrl);
  next();
});

UserRoutes(app, db);
CourseRoutes(app, db);
ModulesRoutes(app,db);
AssignmentsRoutes(app,db);
EnrollmentsRoutes(app,db);
Lab5(app);

// Clean up old tab sessions periodically (every hour)
setInterval(() => {
  // Keep sessions for 24 hours of inactivity
  const now = Date.now();
  for (const [tabId, session] of tabSessions.entries()) {
    if (session.lastAccess && now - session.lastAccess > 24 * 60 * 60 * 1000) {
      tabSessions.delete(tabId);
    }
  }
}, 60 * 60 * 1000);

app.listen(4000);
