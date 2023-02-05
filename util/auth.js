import jwt from "jsonwebtoken";

export const isAuthenticated = async (req, res, next) => {
  try {

    // console.log(req.headers.authorization.split(" ")[1]);
    const getToken = req.headers.authorization.split(" ")[1];

    const tokendecoded = jwt.verify(getToken, process.env.JWT_SECRET);

    // console.log(tokendecoded);
    req.authTokenData = tokendecoded;

    next();
  } catch (e) {
    console.log(e);
    return res.status(400).json({
      success: false,
      msg: 'Invalid auth token',
    });
  }
};

export const isAuthenticatedAdmin = async (req, res, next) => {
  try {

    // console.log(req.headers);
    const getToken = req.headers.authorization;

    const tokendecoded = jwt.verify(getToken, process.env.JWT_SECRET);

    // console.log(tokendecoded);
    if (tokendecoded.role == 'admin') {
      req.authTokenData = tokendecoded;
      next();
    } else return res.status(400).json({ success: false, msg: 'You are not authorized', });


  } catch (e) {
    console.log(e);
    return res.status(400).json({
      success: false,
      msg: 'Invalid auth token',
    });
  }
};