import jwt from "jsonwebtoken";

// export const isAuthenticatedUser = async (req, res, next) => {
//   try {
//     if (!req.headers) {
//       return res.status(400).json({
//         success: false,
//         message: "Access Token Does not exist",
//       });
//     }
//     const getToken = req.headers;
    
//     const tokendecoded = jwt.verify(getToken.authorization, process.env.JWT_SECRET);

//     console.log(tokendecoded);
//     req.adminId = tokendecoded.id;

//     next();
//   } catch (error) {
//     return res.status(400).json({
//       success: false,
//       message: error.message,
//     });
//   }
// };

export const isAuthenticatedUser = async (req, res, next) => {
  try {
    
    const getToken = req.headers.token;
    
    const tokendecoded = jwt.verify(getToken, process.env.JWT_SECRET);

    // console.log(tokendecoded);
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