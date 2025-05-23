const jwt = require("jsonwebtoken");
const { JWT_ADMIN_SECRET } = require("../jwt.config")

function adminAuth(req, res, next) {
    const token = req.headers.authorization;

    const response = jwt.verify(token, JWT_ADMIN_SECRET);

    if (response) {
        req.adminId = response.id;
        next();
    } else {
        res.status(403).json({
            message: "Incorrect creds"
        })
    }
}

module.exports = {
    adminAuth,
}
