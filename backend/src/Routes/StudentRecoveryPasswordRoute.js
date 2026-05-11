import express from "express";
import studentRecoveryPasswordController from "../Controllers/StudentRecoveryPasswordController.js";

const router = express.Router();

router.route("/requestCode").post(studentRecoveryPasswordController.requestCode);
router.route("/verifyCode").post(studentRecoveryPasswordController.verifyCode);
router.route("/newPassword").post(studentRecoveryPasswordController.newPassword);

export default router;