import jwt from "jsonwebtoken";

export const verifyToken = (req, res, next) => {
  try {
    const token = req.cookies.token; // GET token from cookies
    if (!token) {
      return res
        .status(401)
        .json({ success: false, message: "Unauthorized - no token provided!" });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);
    if (!decoded) {
      return res
        .status(401)
        .json({ success: false, message: "Unauthorized - invalid token!" });
    }

    req.userID = decoded.userID; // Attach userID to request object for further use

    next(); // Call the next middleware or route handler
  } catch (error) {
    console.log("Error in verifyToken middleware:", error);
    return res.status(500).json({ success: false, message: "Server error!!" });
  }
};
