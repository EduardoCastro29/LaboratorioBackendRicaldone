import express from "express";
import teacherRecoveryPasswordController from "../Controllers/TeacherRecoveryPasswordController.js";

const router = express.Router();

router.route("/requestCode").post(teacherRecoveryPasswordController.requestCode);
router.route("/verifyCode").post(teacherRecoveryPasswordController.verifyCode);
router.route("/newPassword").post(teacherRecoveryPasswordController.newPassword);

export default router;