const express = require("express");
const router = express.Router();
const ROLES_LIST = require("../../config/roles_list");
const verifyRoles = require("../../middleware/verifyRoles");
const PatInfoController = require("../../controllers/PatInfoController");

// router.route("/vn/:id")
// .get(PatInfoController.getPatInfoByVN);

// router.route("/hn/:id")
// .get(PatInfoController.getPatInfoByHN);

router.route("/vn/check/:VN")
.get(PatInfoController.checkInfoExistbyVN);

// router.route("/hn")
// .post(PatInfoController.postPatInfoByHN);

router.route("/vn/:vn")
.get(PatInfoController.getPatInfoByVN);


module.exports = router;
