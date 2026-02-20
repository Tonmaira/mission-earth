const express = require('express');
const router = express.Router();
const refreshTokenController = require('../middleware/refreshTokenController');
const ROLES_LIST = require('../config/roles_list');
const verifyRoles = require('../middleware/verifyRoles');


router.get('/', refreshTokenController.handleRefreshToken);

router.route('/check')
    .get(verifyRoles(ROLES_LIST.User,ROLES_LIST.Editor,ROLES_LIST.Admin), refreshTokenController.checkToken);
    
module.exports = router;