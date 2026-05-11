import express from "express";
import subjectController from "../Controllers/SubjectController.js";

const router = express.Router();

router.route("/").get(subjectController.getSubject);
router.route ("/").post (subjectController.insertSubject);
// Por id
router.route("/:id")
.put(subjectController.updateSubject)
.delete(subjectController.deleteSubject);

export default router;