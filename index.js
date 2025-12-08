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
import QuizzesRoutes from "./Quizzes/routes.js";
import QuizAttemptsRoutes from "./Quizzes/Attempts/routes.js";

const CONNECTION_STRING = process.env.DATABASE_CONNECTION_STRING || "mongodb://127.0.0.1:27017/kambaz"
mongoose.connect(CONNECTION_STRING);
const app = express();

app.use(
  cors({
    credentials: true,
    origin: process.env.CLIENT_URL || "http://localhost:3000",
  })
);

const tabSessions = new Map();

app.use((req, res, next) => {
  const tabId = req.headers["x-tab-id"];
  if (tabId) {
    if (!tabSessions.has(tabId)) {
      tabSessions.set(tabId, { currentUser: null, lastAccess: Date.now() });
    }
    req.tabSession = tabSessions.get(tabId);
    req.tabSession.lastAccess = Date.now();
  } else {
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
QuizzesRoutes(app,db);
QuizAttemptsRoutes(app,db);
Lab5(app);

setInterval(() => {
  const now = Date.now();
  for (const [tabId, session] of tabSessions.entries()) {
    if (session.lastAccess && now - session.lastAccess > 24 * 60 * 60 * 1000) {
      tabSessions.delete(tabId);
    }
  }
}, 60 * 60 * 1000);

app.listen(4000);
