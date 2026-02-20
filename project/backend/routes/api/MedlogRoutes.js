const express = require("express");
const router = express.Router();
const MedlogController = require("../../controllers/MedLogController");
  
router.route("/")
  .post(MedlogController.CreateMedlog)

router.route("/:an")
  .delete(MedlogController.DeleteMedlog)
  
module.exports = router;
