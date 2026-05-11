import express from "express";
import cookieParser from "cookie-parser";
import cors from "cors";
import studentRoutes from "./src/Routes/StudentRoute.js";
import studenRegisterRoutes from "./src/Routes/StudentRegisterRoute.js";

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
app.use ("/api/studentRegister",studenRegisterRoutes);


export default app;