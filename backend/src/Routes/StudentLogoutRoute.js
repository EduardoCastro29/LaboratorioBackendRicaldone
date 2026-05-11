import express from "express";
import studentLogoutController from "../Controllers/StudentLogoutController.js";

const router = express.Router();
router.route("/").post(studentLogoutController.logout);

export default router;