export const sendResponse = async (statusCode, success, msg, res) => {
  res.status(statusCode).json({
    success: success,
    msg: msg,
  });
};