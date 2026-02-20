const jwt = require('jsonwebtoken');
require('dotenv').config();

const verifyRoles = (...allowedRoles) => {
    return (req, res, next) => {
        const authHeader = req.headers.authorization || req.headers.Authorization;
        if (!authHeader?.startsWith('Bearer ')) return res.sendStatus(401);
        const token = authHeader.split(' ')[1];

        try {
            const decodedToken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
            
            if (decodedToken.exp < Date.now() / 1000) {
                return res.status(401).json({ message: 'Token has expired', expiredAt: new Date(decodedToken.exp * 1000) });
            }
            
            console.log('Decoded Token:', decodedToken.UserInfo);

            const userRoles = decodedToken.UserInfo ? decodedToken.UserInfo.Role : 0;
            const rolesArray = [...allowedRoles];

            console.log('User allowedRoles:', allowedRoles);

            const result = rolesArray.includes(userRoles);
            console.log('User Role:', userRoles, 'Result:', result);

            if (!result) return res.sendStatus(401);
            next();
        } catch (error) {
            if (error.name === 'TokenExpiredError') {
                return res.status(401).json({ message: 'Token has expired', expiredAt: error.expiredAt });
            } else {
                console.error('Error verifying token:', error);
                return res.sendStatus(401);
            }
        }
    }
}

module.exports = verifyRoles;