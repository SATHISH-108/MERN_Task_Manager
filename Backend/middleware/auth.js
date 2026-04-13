import jwt from "jsonwebtoken";

export const Protected = async (request, response, next) => {
  try {
    let token = request.cookies?.accessToken;

    if (!token) {
      const authHeaders = request.headers.authorization;
      if (authHeaders && authHeaders.startsWith("Bearer ")) {
        token = authHeaders.split(" ")[1];
      }
    }

    if (!token) {
      return response.status(401).json({ message: "JWT Token Missing" });
    }

    const decoded = jwt.verify(token, process.env.JWT_ACCESS_SECRET);
    request.user = { id: decoded.id, role: decoded.role };
    return next();
  } catch (error) {
    console.log("Protected middleware error:", error.message);
    return response
      .status(401)
      .json({ success: false, message: "Authentication Failed" });
  }
};

export const AuthorizationRoles = (...allowedRoles) => {
  const allowed = allowedRoles.map((r) => String(r).toLowerCase());
  return (request, response, next) => {
    if (!request.user || !request.user.role) {
      return response
        .status(401)
        .json({ message: "Unauthorized: No user information found" });
    }
    const userRole = String(request.user.role).toLowerCase();
    if (!allowed.includes(userRole)) {
      return response
        .status(403)
        .json({ message: "Forbidden: Insufficient Roles" });
    }
    return next();
  };
};
