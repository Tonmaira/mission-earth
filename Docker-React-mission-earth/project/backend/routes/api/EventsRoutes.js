const express = require("express");
const router = express.Router();
const ROLES_LIST = require("../../config/roles_list");
const verifyRoles = require("../../middleware/verifyRoles");
const EventsController = require("../../controllers/EventCrontroller");
  
router.route("/:id")
  .get(EventsController.getEventHistory)

module.exports = router;
