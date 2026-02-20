const express = require("express");
const router = express.Router();
const ROLES_LIST = require("../../config/roles_list");
const verifyRoles = require("../../middleware/verifyRoles");
const StaffsController = require("../../controllers/StaffsControllers/StaffsController");

router.route("/password/:id")
  .put(verifyRoles(ROLES_LIST.Editor, ROLES_LIST.Admin),StaffsController.updateStaffPasswordById);
router.route("/resetpassword/:id")
  .get(verifyRoles(ROLES_LIST.Editor, ROLES_LIST.Admin),StaffsController.resetStaffPasswordById);

router.route("/switch/:id")
  .get(verifyRoles(ROLES_LIST.Editor, ROLES_LIST.Admin),StaffsController.switchStaffStatusById);

router.route("/:id")
  .get(StaffsController.getStaffById)
  .put(verifyRoles(ROLES_LIST.Editor, ROLES_LIST.Admin),StaffsController.updateStaffById);

router.route("/")
  .post(verifyRoles(ROLES_LIST.Editor, ROLES_LIST.Admin),StaffsController.handleNewStaff)
  .get(StaffsController.getAllStaff);

module.exports = router;
