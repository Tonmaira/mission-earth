const express = require("express");
const router = express.Router();
const ROLES_LIST = require("../../config/roles_list");
const verifyRoles = require("../../middleware/verifyRoles");
const FormularController = require("../../controllers/FormulaController");
const ImportController = require("../../controllers/importlabcontroller");

router.route("/import/lab")
  .get(verifyRoles(ROLES_LIST.Editor, ROLES_LIST.Admin, ROLES_LIST.User),ImportController.ReadLabExcel);
router.route("/import/Treatment")
  .get(verifyRoles(ROLES_LIST.Editor, ROLES_LIST.Admin, ROLES_LIST.User),ImportController.ReadTreatmentExcel);
router.route("/import/Xray")
  .get(verifyRoles(ROLES_LIST.Editor, ROLES_LIST.Admin, ROLES_LIST.User),ImportController.ReadXrayExcel);
  
router.route("/list")
  .get(verifyRoles(ROLES_LIST.Editor, ROLES_LIST.Admin, ROLES_LIST.User),FormularController.getFormulaList);

router.route("/:id")
  .get(verifyRoles(ROLES_LIST.Editor, ROLES_LIST.Admin, ROLES_LIST.User),FormularController.getAllFormulaById)
  .put(verifyRoles(ROLES_LIST.Editor, ROLES_LIST.Admin, ROLES_LIST.User),FormularController.UpdateFormulaById)
  .delete(verifyRoles(ROLES_LIST.Editor, ROLES_LIST.Admin, ROLES_LIST.User),FormularController.DeleteFormulaById);

router.route("/")
  .get(FormularController.getAllFormula)
  .post(verifyRoles(ROLES_LIST.Editor, ROLES_LIST.Admin, ROLES_LIST.User),FormularController.newFormula);

module.exports = router;
