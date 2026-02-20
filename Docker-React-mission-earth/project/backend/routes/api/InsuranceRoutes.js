const express = require("express");
const router = express.Router();
const ROLES_LIST = require("../../config/roles_list");
const verifyRoles = require("../../middleware/verifyRoles");
const InsuranceCompany  = require("../../controllers/RightVerifyControllers/InsuranceCompanyController");

router.route("/")
  .post(verifyRoles(ROLES_LIST.Editor, ROLES_LIST.Admin, ROLES_LIST.User),InsuranceCompany.newInsuranceCompany)
  .get(InsuranceCompany.getAllInsuranceCompany);

module.exports = router;
