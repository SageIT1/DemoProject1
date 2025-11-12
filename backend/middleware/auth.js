// backend/middleware/auth.js
function authorizeRoles(...allowedRoles) {
  return (req, res, next) => {
    const user = req.user; // assuming req.user is set by authentication middleware

    if (!user) {
      return res.status(401).json({ message: "Unauthorized: User not found" });
    }

    if (!allowedRoles.includes(user.role)) {
      return res.status(403).json({ message: "Forbidden: Insufficient permissions" });
    }

    next();
  };
}

module.exports = { authorizeRoles };
