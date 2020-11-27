const jwt = require('jsonwebtoken');

// verify token
function authenticateToken(req, res, next) {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (token == null) {
        return res.status(401).json({
            status: false,
            error: "There is any token"
        });
    }

    jwt.verify(token, 'secret-development', (error, decoded) => {
        if (error) {
            return res.status(401).json({
                status: false,
                error: "Token invalid",
            });
        }

        req.token = token;
        req.user = decoded.user;
        next();
    });
}

module.exports = {
    authenticateToken,
};
