import express from "express";
import tuitionController from "../Controllers/TuitionController.js";

const router = express.Router();

router.route("/").get(tuitionController.getTuition);
router.route ("/").post (tuitionController.insertTuition);
// Por id
router.route("/:id")
.put(tuitionController.updateTuition)
.delete(tuitionController.deleteTuition);

export default router;