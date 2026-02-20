const users = require('../models/users');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
require('dotenv').config();
const { Op } = require('sequelize');

const handleLogin = async (req, res) => {
    console.log('handleLogin called');
    const { UserId, Password } = req.body;
    if (!UserId || !Password) return res.status(400).json({ 'message': 'Username and password are required.' });

    try {
        const foundUser = await users.findOne({ 
            where: { 
              UserId: UserId,
              DeleteAt: null 
            }
          });

        if (!foundUser) {
            return res.sendStatus(401); // Unauthorized
        }
        
        console.log('handleLogin called');
        console.log('Comparing password...From:',foundUser.UserId);
        let match; 
        try {
            match = await bcrypt.compare(Password, foundUser.Password);
            console.log('Password compared:', match);
        } catch (error) {
            console.error('Error during bcrypt comparison:', error);
        }

        if (match) {
            console.log('user matched:', foundUser);
            const Role = foundUser.Role;

            const accessToken = jwt.sign(
                {
                    "UserInfo": {
                        "UserId": foundUser.UserId,
                        "Role": Role
                    }
                },
                process.env.ACCESS_TOKEN_SECRET,
                { expiresIn: '1d' }
            );
            const refreshToken = jwt.sign(
                { "UserId": foundUser.UserId },
                process.env.REFRESH_TOKEN_SECRET,
                { expiresIn: '1d' }
            );

            foundUser.refreshToken = refreshToken;
            await foundUser.save();

            res.cookie('jwt', refreshToken, { httpOnly: true, secure: true, sameSite: 'None', maxAge: 24 * 60 * 60 * 1000 });
            res.json({ Role, accessToken });
        } else {
            res.sendStatus(401);
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ 'message': 'An error occurred.' + error.message });
    }
}

module.exports = { handleLogin };

