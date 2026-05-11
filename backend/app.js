import express from "express";
import cookieParser from "cookie-parser";
import cors from "cors";
// Estudiantes endPoint
import studentRoutes from "./src/Routes/StudentRoute.js";
import studentRegisterRoutes from "./src/Routes/StudentRegisterRoute.js";
import studentLoginRoutes from "./src/Routes/StudentLoginRoute.js";
import studentRecoveryPasswordRoutes from "./src/Routes/StudentRecoveryPasswordRoute.js";
import studenLogoutRoutes from "./src/Routes/StudentLogoutRoute.js";
// Profesores endPoint
import teacherRoutes from "./src/Routes/TeacherRoute.js";
import teacherRegisterRoutes from "./src/Routes/TeacherRegisterRoute.js";
import teacherLoginRoutes from "./src/Routes/TeacherLoginRoute.js"
import teacherRecoveryPasswordRoutes from "./src/Routes/TeacherRecoveryPasswordRoute.js";
const app = express();

app.use(
  cors({
    origin: ["http://localhost:5137/", "http://localhost5174"],
    credentials: true,
  }),
);

app.use(express.json());
app.use (cookieParser());

// Endpoints student
app.use ("/api/student",studentRoutes);
app.use ("/api/studentRegister",studentRegisterRoutes);
app.use ("/api/loginStudent",studentLoginRoutes);
app.use ("/api/recoveryPasswordStudent",studentRecoveryPasswordRoutes);
app.use ("/api/logoutStudent",studenLogoutRoutes);
// Endpoints teacher
app.use ("/api/teacher",teacherRoutes);
app.use("/api/teacherRegister",teacherRegisterRoutes);
app.use("/api/loginTeacher",teacherLoginRoutes);
app.use ("/api/recoveryPasswordTeacher",teacherRecoveryPasswordRoutes);



export default app;