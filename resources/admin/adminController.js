import Admin from "./adminModel.js"
import mongoose from "mongoose"
import { sendResponse } from "../../util/sendResponse.js";
import { newToken } from '../../util/jwt.js'
import cloudinary from "../../util/cloudinary.js";
import { mediaDel } from "../../util/mediaDel.js";

//Register a admin
export const register = async (req, res, next) => {
  try {
    const { adminName, email, password } = req.body;

    const exist = await Admin.findOne({ email: email }).countDocuments();
    if (exist) {
      return sendResponse(409, false, 'Email already in use', res)
    }

    const admin = await Admin.create({
      name: adminName,
      email,
      password,
    });
    sendResponse(201, true, admin, res)
  } catch (e) {
    console.log(e);
    sendResponse(400, false, e.message, res)
  }
};

//Login admin
export const login = async (req, res, next) => {
  const { email, password } = req.body;

  const admin = await Admin.findOne({ email }).select("+password");
  if (!admin) {
    return sendResponse(400, false, 'Wrong Email', res);
  }

  try {
    const isPasswordMatched = await admin.comparePassword(password);
    console.log(isPasswordMatched);
    if (!isPasswordMatched) {
      return sendResponse(400, false, 'Wrong Password', res);
    }
    const token = newToken(admin)
    const options = {
      expires: new Date(
        Date.now() + 20 * 24 * 60 * 60 * 1000
      ),
      httpOnly: true,
    };

    res.cookie("token", token, options)
    sendResponse(201, true, token, res);
  } catch (e) {
    sendResponse(400, false, e.message, res)
  }
};


//Logout admin
export const logout = async (req, res, next) => {
  try {
    const options = {
      expires: new Date(
        Date.now() + 20 * 24 * 60 * 60 * 1000
      ),
      httpOnly: true,
    };
    res.cookie("token", null, options);
    sendResponse(200, true, 'Logged Out', res)
  } catch (e) {
    sendResponse(400, false, e.message, res)
  }
};

// Update admin password
export const updatePassword = async (req, res, next) => {
  try {
    // console.log(req.adminId);
    const admin = await Admin.findById(req.adminId).select("+password");

    const isPasswordMatched = await admin.comparePassword(req.body.currentPassword);

    if (!isPasswordMatched) {
      return sendResponse(400, false, "Current password is incorrect", res);
    }

    admin.password = req.body.newPassword;

    await admin.save();

    sendResponse(201, true, 'Password Updated', res);
  } catch (e) {
    console.log(e);
    sendResponse(400, false, e.message, res)
  }
};

// 4.Forgot Password
// export const forgotPassword = async (req, res, next) => {
//   const admin = await admin.findOne({ email: req.body.email });

//   if (!admin) {
//     return sendResponse(404, false, 'admin not found', res)
//   }

//   try {
//     // Get ResetPassword Token
//     const resetToken = admin.getResetPasswordToken();//call function

//     //save database reset token
//     await admin.save({ validateBeforeSave: false });
//     //create link for send mail
//     // const resetPasswordUrl = `http://localhost:5000/api/v1/admin/password/reset/${resetToken}` //send from localhost
//     //send from anyhost
//     // const resetPasswordUrl = `${req.protocol}://${req.get(
//     //     "host"
//     // )}/api/v1/admin/password/reset/${resetToken}`;
//     //const resetPasswordUrl = `${process.env.FRONTEND_URL}:/api/admin/password/reset/${resetToken}`;
//     //const resetPasswordUrl = `${process.env.FRONTEND_URL}/password/reset/${resetToken}`;
//     const password = generator.generate({
//       length: 10,
//       numbers: true
//     });
//     admin.password = password;
//     await admin.save()
//     // const message = `Your password reset token are :- \n\n ${resetPasswordUrl} \n\nyour new password is:${password}\n\nIf you have not requested this email then, please ignore it.`;
//     // await sendEmail({

//     //   to: `${admin.email}`, // Change to your recipient
//     //   from: 'project.edufuture@gmail.com', // Change to your verified sender
//     //   subject: `CMP Password Recovery`,
//     //   html: `your new password is: <br/> <strong> ${password}</strong><br/><br/>If you have not requested this email then, please ignore it.`

//     // });
//     console.log(resetToken);
//     // res.status(200).json({
//     //   success: true,
//     //   message: `Email sent to ${admin.email} successfully`,
//     // });
//     sendResponse(200, true, resetToken, res)
//   } catch (e) {
//     admin.resetPasswordToken = undefined;
//     admin.resetPasswordExpire = undefined;

//     await admin.save({ validateBeforeSave: false });

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

//   const admin = await admin.findOne({
//     resetPasswordToken,
//     resetPasswordExpire: { $gt: Date.now() },
//   });

//   if (!admin) {
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

//   admin.password = req.body.password;
//   admin.resetPasswordToken = undefined;
//   admin.resetPasswordExpire = undefined;

//   await admin.save();

//   sendToken(admin, 200, res);
// });

// 9.update admin Profile
// export const updateProfile = async (req, res, next) => {
//   const newadminData = {
//     name: req.body.name,
//     phone: req.body.phone,
//     email: req.body.email,
//   };

//   if (req.files) {
//     const files = req.files.avatar;
//     const admin = await admin.findById(req.admin.id);

//     const imageId = admin.avatar.public_id;

//     await cloudinary.uploader.destroy(imageId)

//     const myCloud = await cloudinary.uploader.upload(files.tempFilePath, {
//       folder: "image",
//     },
//       function (error, result) { (result, error) });

//     newadminData.avatar = {
//       public_id: myCloud.public_id,
//       url: myCloud.secure_url,
//     };
//   }
//   const admin = await admin.findByIdAndUpdate(req.admin.id, newadminData, {
//     new: true,
//     runValidators: true,
//     useFindAndModify: false,
//   });

//   sendResponse(200, true, admin, res)
// };

// // 9.Get all admins(admin)
// export const getAlladmin = catchAsyncErrors(async (req, res, next) => {

//   const admins = await admin.find()//.select('-role');

//   res.status(200).json({
//     success: true,
//     admins,
//   });
// });

//admin create
export const createadmin = async (req, res, next) => {
  try {
    const { uniqueId, adminName, email, phone, city } = req.body;
    const exist = await admin.findOne({ email: email }).countDocuments();
    if (exist) {
      return sendResponse(409, false, 'admin already exist', res)
    }
    const admin = await admin.create({
      _id: uniqueId,
      adminName,
      email,
      phone,
      city,
      role: 'admin'
    });
    sendResponse(201, true, admin, res)
  } catch (e) {
    if (e.code) {
      return sendResponse(400, false, `${Object.keys(e.keyValue)} Already in use`, res)
    }
    sendResponse(400, false, e, res)
  }
};

//Get all admins(except admin)
export const getAlladmin = async (req, res, next) => {
  try {
    const admins = await admin.find().all('role', ['admin']);
    sendResponse(200, true, admins, res)
  } catch (e) {
    console.log(e);
    sendResponse(400, false, e.message, res)
  }
};

//Get single admin
export const getSingleAdmin = async (req, res, next) => {
  try {
    const admin = await Admin.findById(req.params.id)
    if (!admin) {
      return sendResponse(400, false, `admin does not exist with Id: ${req.params.id}`, res)
    }
    sendResponse(200, true, admin, res)
  } catch (e) {
    console.log(e);
    sendResponse(400, false, e.message, res)
  }
};

//Update admin
export const updateAdmin = async (req, res, next) => {
  try {
    const { uniqueId, adminName, email } = req.body

    const payloadObj = {
      _id: uniqueId,
      name: adminName,
      email,
    };
    if (req.file) {
      await cloudinary.v2.uploader.upload(req.file.path, {
        folder: "admin/",
      }).then((result1) => {
        payloadObj.image = {
          public_id: result1.public_id,
          url: result1.url,
        }
        mediaDel()
      })
    }

    await Admin.findByIdAndUpdate(req.params.id, payloadObj);
    sendResponse(200, true, 'Updated Successfully', res)
  } catch (e) {
    console.log(e);
    sendResponse(400, false, e, res)
  }
};

//Update admin
export const updateadminStatus = async (req, res, next) => {
  try {
    const TrueStatus = {
      approved: 'true'
    };
    const FalseStatus = {
      approved: 'false'
    };
    const admin = await admin.findById(req.body.id);
    if (admin.approved) {
      await admin.updateOne({ _id: mongoose.mongo.ObjectId(req.body.id) }, FalseStatus);
    } else {
      await admin.updateOne({ _id: mongoose.mongo.ObjectId(req.body.id) }, TrueStatus);
    }
    sendResponse(200, true, 'admin Status Updated', res)
  } catch (e) {
    sendResponse(400, false, e.message, res)
  }
};