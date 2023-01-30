import jwt from "jsonwebtoken";

export const isAuthenticated = async (req, res, next) => {
  try {

    console.log(req.headers);
    const getToken = req.headers.authorization;
    
    const tokendecoded = jwt.verify(getToken, process.env.JWT_SECRET);

    console.log(tokendecoded);
    req.authTokenData = tokendecoded;

    next();
  } catch (e) {
    console.log(e);
    return res.status(400).json({
      success: false,
      message: e.message,
    });
  }
};