import mongoose from "mongoose"
import DeliveryCarrier from "./deliveryCarrierModel.js"
import { sendResponse } from "../../util/sendResponse.js"
import cloudinary from "../../util/cloudinary.js"
import { mediaDel } from "../../util/mediaDel.js"

//carrier create
export const createDeliveryCarrier = async (req, res, next) => {
  try {
    const { uniqueId, carrierName, email, phone, address } = req.body;
    console.log(req.body);
    const exist1 = await DeliveryCarrier.findOne({ carrierName: carrierName }).countDocuments();
    if (exist1) {
      return sendResponse(400, false, 'carrier name already in use', res)
    }

    const exist2 = await DeliveryCarrier.findOne({ email: email }).countDocuments();
    if (exist2) {
      return sendResponse(409, false, 'email already in use', res)
    }

    const newData = await DeliveryCarrier.create({
      _id: uniqueId,
      carrierName,
      email,
      phone,
      address
    });
    sendResponse(201, true, newData, res)
  } catch (e) {
    console.log(e);
    if (e.code) {
      return sendResponse(400, false, `${Object.keys(e.keyValue)} already in use`, res)
    }
    sendResponse(400, false, e.message, res)
  }
};

//get all carrier
export const getAllCarrier = async (req, res, next) => {
  try {
    const { skip, limit } = req.query
    const totalDocs = await DeliveryCarrier.countDocuments();
    if (totalDocs) {
      const result = await DeliveryCarrier.find().sort({ carrierName: -1 }).skip(skip).limit(limit)
      sendResponse(200, true, { totalDocs, result }, res)
    } else sendResponse(400, false, 'carrier not found', res)
  } catch (e) {
    console.log(e);
    sendResponse(400, false, e.message, res)
  }
};

//get single carrier by param
export const getSingleCarrier = async (req, res, next) => {
  try {
    const { carrierId } = req.params;

    const result = await DeliveryCarrier.findById(carrierId);
    if (!result) {
      return sendResponse(400, false, `Carrier does not exist with Id: ${carrierId}`, res)
    }
    sendResponse(200, true, result, res)
  } catch (e) {
    console.log(e);
    sendResponse(400, false, e.message, res)
  }
};

//update status
export const updateStatus = async (req, res, next) => {
  try {
    const { carrierId } = req.body;
    const TrueStatus = { approved: 'true' };
    const FalseStatus = { approved: 'false' };
    const carrier = await DeliveryCarrier.findById(carrierId);
    if (carrier.approved) {
      await DeliveryCarrier.findByIdAndUpdate(carrierId, FalseStatus);
    } else {
      await DeliveryCarrier.findByIdAndUpdate(carrierId, TrueStatus);
    }
    sendResponse(200, true, 'Status Updated', res)
  } catch (e) {
    sendResponse(400, false, e.message, res)
  }
};

// **************************************************

// 4.Forgot Password
// export const forgotPassword = async (req, res, next) => {
//   const user = await User.findOne({ email: req.body.email });

//   if (!user) {
//     return sendResponse(404, false, 'User not found', res)
//   }

//   try {
//     // Get ResetPassword Token
//     const resetToken = user.getResetPasswordToken();//call function

//     //save database reset token
//     await user.save({ validateBeforeSave: false });
//     //create link for send mail
//     // const resetPasswordUrl = `http://localhost:5000/api/v1/user/password/reset/${resetToken}` //send from localhost
//     //send from anyhost
//     // const resetPasswordUrl = `${req.protocol}://${req.get(
//     //     "host"
//     // )}/api/v1/user/password/reset/${resetToken}`;
//     //const resetPasswordUrl = `${process.env.FRONTEND_URL}:/api/user/password/reset/${resetToken}`;
//     //const resetPasswordUrl = `${process.env.FRONTEND_URL}/password/reset/${resetToken}`;
//     const password = generator.generate({
//       length: 10,
//       numbers: true
//     });
//     user.password = password;
//     await user.save()
//     // const message = `Your password reset token are :- \n\n ${resetPasswordUrl} \n\nyour new password is:${password}\n\nIf you have not requested this email then, please ignore it.`;
//     // await sendEmail({

//     //   to: `${user.email}`, // Change to your recipient
//     //   from: 'project.edufuture@gmail.com', // Change to your verified sender
//     //   subject: `CMP Password Recovery`,
//     //   html: `your new password is: <br/> <strong> ${password}</strong><br/><br/>If you have not requested this email then, please ignore it.`

//     // });
//     console.log(resetToken);
//     // res.status(200).json({
//     //   success: true,
//     //   message: `Email sent to ${user.email} successfully`,
//     // });
//     sendResponse(200, true, resetToken, res)
//   } catch (e) {
//     user.resetPasswordToken = undefined;
//     user.resetPasswordExpire = undefined;

//     await user.save({ validateBeforeSave: false });

//     return sendResponse(500, false, e.message, res);
//   }
// };


// // 5.Reset Password
// export const resetPassword = catchAsyncErrors(async (req, res, next) => {
//   // creating token hash
//   const resetPasswordToken = crypto
//     .createHash("sha256")
//     .update(req.params.token)
//     .digest("hex");

//   const user = await User.findOne({
//     resetPasswordToken,
//     resetPasswordExpire: { $gt: Date.now() },
//   });

//   if (!user) {
//     return next(
//       new ErrorHander(
//         "Reset Password Token is invalid or has been expired",
//         400
//       )
//     );
//   }
//   //replace previous password
//   if (req.body.password !== req.body.confirmPassword) {
//     return next(new ErrorHander("Password does not password", 400));
//   }

//   user.password = req.body.password;
//   user.resetPasswordToken = undefined;
//   user.resetPasswordExpire = undefined;

//   await user.save();

//   sendToken(user, 200, res);
// });


// // 8.update User password
// export const updatePassword = catchAsyncErrors(async (req, res, next) => {
//   const user = await User.findById(req.user.id).select("+password");

//   const isPasswordMatched = await user.comparePassword(req.body.oldPassword);

//   if (!isPasswordMatched) {
//     return next(new ErrorHander("Old password is incorrect", 400));
//   }

//   if (req.body.newPassword !== req.body.confirmPassword) {
//     return next(new ErrorHander("password does not match", 400));
//   }

//   user.password = req.body.newPassword;

//   await user.save();

//   sendToken(user, 200, res);
// });

// 9.update User Profile
// export const updateProfile = async (req, res, next) => {
//   const newUserData = {
//     name: req.body.name,
//     phone: req.body.phone,
//     email: req.body.email,
//   };

//   if (req.files) {
//     const files = req.files.avatar;
//     const user = await User.findById(req.user.id);

//     const imageId = user.avatar.public_id;

//     await cloudinary.uploader.destroy(imageId)

//     const myCloud = await cloudinary.uploader.upload(files.tempFilePath, {
//       folder: "image",
//     },
//       function (error, result) { (result, error) });

//     newUserData.avatar = {
//       public_id: myCloud.public_id,
//       url: myCloud.secure_url,
//     };
//   }
//   const user = await User.findByIdAndUpdate(req.user.id, newUserData, {
//     new: true,
//     runValidators: true,
//     useFindAndModify: false,
//   });

//   sendResponse(200, true, user, res)
// };

// // 9.Get all users(admin)
// export const getAllUser = catchAsyncErrors(async (req, res, next) => {

//   const users = await User.find()//.select('-role');

//   res.status(200).json({
//     success: true,
//     users,
//   });
// });

//Get single user


//Get Books Uploaded By Single User By Param

export const getBooksUploadedBySingleUserByParam = async (req, res, next) => {
  try {

    const userId = req.params.id;

    const user = await User.findById(userId).select('booksAdded').populate({
      path: 'booksAdded',
      populate: { path: 'genre language' }
    });

    if (!user) {
      return sendResponse(400, false, `User does not exist with Id: ${userId}`, res)
    }
    sendResponse(200, true, user, res)
  } catch (e) {
    console.log(e);
    sendResponse(400, false, e.message, res)
  }
};

//Get Books Uploaded By Single User
export const getBooksUploadedBySingleUser = async (req, res, next) => {
  try {

    const userId = req.authTokenData.id;

    const user = await User.findById(userId).where('approved').equals(true).select('booksAdded').populate({
      path: 'booksAdded',
      populate: { path: 'genre language' }
    });

    if (!user) {
      return sendResponse(400, false, `User does not exist with Id: ${userId}`, res)
    }
    sendResponse(200, true, user, res)
  } catch (e) {
    console.log(e);
    sendResponse(400, false, e.message, res)
  }
};

//Update user by param
// export const updateUserByParam = async (req, res, next) => {
//   try {

//     const userId = req.params.id

//     if (req.file) {
//       await cloudinary.v2.uploader.upload(req.file.path, {
//         folder: "user/",
//       }).then((result) => {
//         req.body.image = {
//           public_id: result.public_id,
//           url: result.url,
//         }
//         mediaDel()
//       })
//     }

//     await User.findByIdAndUpdate(userId, req.body);
//     sendResponse(200, true, 'Updated Successfully', res)
//   } catch (e) {
//     if (e.code) {
//       return sendResponse(400, false, `${Object.keys(e.keyValue)} already in use`, res)
//     }
//     sendResponse(400, false, e, res)
//   }
// };