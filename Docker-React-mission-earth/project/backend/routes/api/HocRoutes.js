const express = require("express");
const router = express.Router();
const ROLES_LIST = require("../../config/roles_list");
const verifyRoles = require("../../middleware/verifyRoles");
const HocController = require("../../controllers/HocController");

router.route("/report/:start/:end")
  .get(verifyRoles(ROLES_LIST.Editor, ROLES_LIST.Admin,ROLES_LIST.User), HocController.HistoryAllHoc);

//   router.route("/revalidate/:id")
//   .put(verifyRoles(ROLES_LIST.Editor, ROLES_LIST.Admin,ROLES_LIST.User), HocController.updateStatusByStatusNoAndRemark);

router.route("/status/:id")
  .put(verifyRoles(ROLES_LIST.Editor, ROLES_LIST.Admin,ROLES_LIST.User), HocController.updateStatusByStatusNo);

// router.route("/order/:id")
//   .put(verifyRoles(ROLES_LIST.Editor, ROLES_LIST.Admin,ROLES_LIST.User), HocController.updateRightOrder);
//   // .get(HocController.getAllHocById);

router.route("/VN/:id")
  .get(HocController.getAllHocByVN);

// router.route("/printstatus")
//   .put(verifyRoles(ROLES_LIST.Editor, ROLES_LIST.Admin,ROLES_LIST.User), HocController.updatePrintStatus);

// router.route("/check")
//   .post(HocController.checkDuplicateHoc);
  
router.route("/:id")
  .get(HocController.getAllHocById)
  .delete(verifyRoles(ROLES_LIST.Editor, ROLES_LIST.Admin,ROLES_LIST.User), HocController.updateStatusDelete)
  .put(verifyRoles(ROLES_LIST.Editor, ROLES_LIST.Admin,ROLES_LIST.User), HocController.updateHoc);

router.route("/")
  .post(verifyRoles(ROLES_LIST.Editor, ROLES_LIST.Admin,ROLES_LIST.User), HocController.newHoc)
//   .get(HocController.getAllHoc);
  
module.exports = router;
