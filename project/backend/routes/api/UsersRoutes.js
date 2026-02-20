const express = require("express");
const router = express.Router();
const ROLES_LIST = require("../../config/roles_list");
const verifyRoles = require("../../middleware/verifyRoles");
const UsersController = require("../../controllers/UsersController");

router.route("/password/:id")
  .put(verifyRoles(ROLES_LIST.Editor, ROLES_LIST.Admin),UsersController.updateUserPasswordById);
router.route("/resetpassword/:id")
  .get(verifyRoles(ROLES_LIST.Editor, ROLES_LIST.Admin),UsersController.resetUserPasswordById);

router.route("/switch/:id")
  .get(verifyRoles(ROLES_LIST.Editor, ROLES_LIST.Admin),UsersController.switchUserStatusById);

router.route("/:id")
  .get(UsersController.getUserById)
  .put(verifyRoles(ROLES_LIST.Editor, ROLES_LIST.Admin),UsersController.updateUserById);

router.route("/")
  .post(verifyRoles(ROLES_LIST.Editor, ROLES_LIST.Admin),UsersController.handleNewUser)
  .get(UsersController.getAllUser);

module.exports = router;
