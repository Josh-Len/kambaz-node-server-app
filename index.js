import "dotenv/config";
import session from "express-session";
import express from "express";
import Lab5 from "./Lab5/index.js";
import cors from "cors";
import db from "../kambaz-next-js/app/(Kambaz)/Database/index.js";
import UserRoutes from "../kambaz-next-js/app/(Kambaz)/Users/routes.js";
import CourseRoutes from "../kambaz-next-js/app/(Kambaz)/Courses/routes.js";
import ModulesRoutes from "../kambaz-next-js/app/(Kambaz)/Courses/[cid]/Modules/routes.js";
import AssignmentsRoutes from "../kambaz-next-js/app/(Kambaz)/Courses/[cid]/Assignments/routes.js";
import EnrollmentsRoutes from "../kambaz-next-js/app/(Kambaz)/Enrollments/routes.js";

const app = express();

app.use(
  cors({
    credentials: true,
    origin: process.env.CLIENT_URL || "http://localhost:3000",
  })
);

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

app.listen(4000);
