import express from "express";
import cookieParser from "cookie-parser";
import cors from "cors";
import studentRoutes from "./src/Routes/StudentRoute.js";
import studentRegisterRoutes from "./src/Routes/StudentRegisterRoute.js";
import studentLoginRoutes from "./src/Routes/StudentLoginRoute.js";
const app = express();

app.use(
  cors({
    origin: ["http://localhost:5137/", "http://localhost5174"],
    credentials: true,
  }),
);

app.use(express.json());
app.use (cookieParser());

app.use ("/api/student",studentRoutes);
app.use ("/api/studentRegister",studentRegisterRoutes);
app.use ("/api/loginStudent",studentLoginRoutes);


export default app;