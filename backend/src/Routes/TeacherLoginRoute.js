import express from "express";
import teacherLoginController from "../Controllers/TeacherLoginController.js";

const router = express.Router();
router.route("/").post(teacherLoginController.login);

export default router;