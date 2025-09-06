import jwt from "jsonwebtoken";

// ==========================
// 📌 Auth Middleware
// Checks if JWT token is valid
// ==========================
export const auth = (req, res, next) => {
  // Token expected in headers as: "Authorization: Bearer <token>"
  const token = req.headers["authorization"]?.split(" ")[1];

  if (!token) {
    return res.status(401).json({ success: false, message: "No token provided" });
  }

  try {
    const decoded = jwt.verify(token, process.env.SECRET_KEY);
    req.user = decoded; // Attach user info to request
    next();
  } catch (err) {
    return res.status(403).json({ success: false, message: "Invalid or expired token" });
  }
};

// ==========================
// 📌 Role Check Middleware
// Checks if logged-in user has required role(s)
// ==========================
export const checkRole = (roles) => (req, res, next) => {
  if (!req.user || !roles.includes(req.user.role)) {
    return res.status(403).json({ success: false, message: "Access denied" });
  }
  next();
};
