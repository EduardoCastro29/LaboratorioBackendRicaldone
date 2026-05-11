import express from "express";
import studentLoginController from "../Controllers/StudentLoginController.js";

const router = express.Router();
router.route("/").post(studentLoginController.login);

export default router;