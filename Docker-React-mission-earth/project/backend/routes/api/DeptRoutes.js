const express = require("express");
const router = express.Router();
const ROLES_LIST = require("../../config/roles_list");
const verifyRoles = require("../../middleware/verifyRoles");
const DeptController = require("../../controllers/StaffsControllers/DeptController");

router.route("/edit/:id")
  .post(verifyRoles(ROLES_LIST.Editor, ROLES_LIST.Admin), DeptController.updateDeptById);

router.route("/:id")
  .put(verifyRoles(ROLES_LIST.Editor, ROLES_LIST.Admin), DeptController.switchStatusDeptById);

router.route("/")
  .post(verifyRoles(ROLES_LIST.Editor, ROLES_LIST.Admin), DeptController.newDept)
  .get(DeptController.getAllDept);

module.exports = router;
