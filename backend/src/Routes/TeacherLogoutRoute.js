import express from "express";
import teacherLogoutController from "../Controllers/TeacherLogoutController.js";

const router = express.Router();
router.route("/").post(teacherLogoutController.logout);

export default router;