const express = require("express");
const router = express.Router();
const ROLES_LIST = require("../../config/roles_list");
const verifyRoles = require("../../middleware/verifyRoles");
const StockCodeController = require("../../controllers/StockCodeController");

// router.route("/edit/:id")
  // .post(verifyRoles(ROLES_LIST.Editor, ROLES_LIST.Admin,ROLES_LIST.User), DeptController.updateDeptById);

// router.route("/:id")
  // .put(verifyRoles(ROLES_LIST.Editor, ROLES_LIST.Admin,ROLES_LIST.User), DeptController.switchStatusDeptById);
  router.route("/")
  // .post(verifyRoles(ROLES_LIST.Editor, ROLES_LIST.Admin,ROLES_LIST.User), DoctorController.newDept)
  .get(StockCodeController.getAllStockCODE);

module.exports = router;
