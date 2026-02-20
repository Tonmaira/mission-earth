const user = require('../models/users');
const jwt = require('jsonwebtoken');
require('dotenv').config();
const Sequelize = require('sequelize');

const handleRefreshToken = async (req, res) => {
    const cookies = req.cookies;
    if (!cookies?.jwt) return res.sendStatus(401);
    const refreshToken = cookies.jwt;

    try {
        const decodedToken = jwt.decode(refreshToken);
        if (!decodedToken || !decodedToken.UserId) {
            return res.sendStatus(403); // Invalid token
        }
        const foundUser = await user.findOne({ 
            where: { 
                UserId: decodedToken.UserId,
                deleteAt: null  // deleteAt is NULL
                
            },
        });
        
        if (!foundUser) return res.sendStatus(403); // Forbidden

        jwt.verify(
            refreshToken,
            process.env.REFRESH_TOKEN_SECRET,
            (err, decoded) => {
                if (err || foundUser.UserId !== decoded.UserId) return res.sendStatus(403);
                const roles = foundUser.Role;
                const accessToken = jwt.sign(
                    {
                        "UserInfo": {
                            "UserId": decoded.UserId,
                            "Role": roles
                        }
                    },
                    process.env.ACCESS_TOKEN_SECRET,
                    { expiresIn: '10s' }
                );
                res.json({ roles, accessToken });
            }
        );
    } catch (error) {
        console.error(error);
        res.sendStatus(500);
    }
}
const checkToken = async (req, res) => {
    res.status(201).json({ message: 'check successful' });
}


module.exports = { 
    handleRefreshToken,
    checkToken 
};
