import jwt from "jsonwebtoken";

export const isAuthenticatedUser = async (req, res, next) => {
  try {
    if (!req.headers) {
      return res.status(400).json({
        success: false,
        message: "Access Token Does not Token not exist",
      });
    }
    const getToken = req.headers;
    
    const tokendecoded = jwt.verify(getToken.authorization, process.env.JWT_SECRET);

    // console.log(tokendecoded);
    req.adminId = tokendecoded.id;

    next();
  } catch (error) {
    return res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};