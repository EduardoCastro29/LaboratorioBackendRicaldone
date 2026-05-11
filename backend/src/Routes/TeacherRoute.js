import express from "express";
import teacherController from "../Controllers/TeacherController.js";

const router = express.Router();

router.route("/").get(teacherController.getTeacher);
// Por id
router.route("/:id")
.put(teacherController.updateTeacher)
.delete(teacherController.deleteTeacher);

export default router;