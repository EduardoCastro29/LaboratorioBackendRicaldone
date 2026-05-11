import express from "express";
import studentController from "../Controllers/StudentController.js";

const router = express.Router();

router.route("/").get(studentController.getStudent);
// Por id
router.route("/:id")
.put(studentController.updateStudent)
.delete(studentController.deleteStudent);

export default router;