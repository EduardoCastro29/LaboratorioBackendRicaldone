import express from "express";
import specialtieController from "../Controllers/SpecialtieController.js";

const router = express.Router();

router.route("/").get(specialtieController.getEspecialtie);
router.route ("/").post (specialtieController.insertSpecialtie);
// Por id
router.route("/:id")
.put(specialtieController.updateSpecialtie)
.delete(specialtieController.deleteSpecialtie);

export default router;