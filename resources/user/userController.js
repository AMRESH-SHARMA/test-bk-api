import User from "./userModel.js"
import UserOtpVerification from "../userOtpVerification/userOtpVerificationModel.js"
import UserAddress from '../userAddress/userAddressModel.js'
import mongoose from "mongoose"
import { sendResponse } from "../../util/sendResponse.js"
import { generateOtp } from "../../util/others.js"
import { newToken } from '../../util/jwt.js'
import { bcryptPassword } from '../../util/bcryptPassword.js'
import cloudinary from "../../util/cloudinary.js"
import { mediaDel } from "../../util/mediaDel.js"
import { generateFromEmail, generateUsername } from "unique-username-generator";

//Register a User
export const registerUser = async (req, res, next) => {
  try {
    const { email, password, address } = req.body;

    const verifiedEmail = await UserOtpVerification.findOne({ email: email }).where('verified').equals(true);
    if (!verifiedEmail) {
      return sendResponse(400, false, 'email is not verified', res)
    }

    const userName = generateFromEmail(email, 3);
    const hashedPassword = await bcryptPassword(password)

    let newUserData = {
      userName,
      email,
      password: hashedPassword,
      address
    }

    if (req.file) {
      await cloudinary.v2.uploader.upload(req.file.path, {
        folder: "user/",
      }).then((result) => {
        newUserData.image = {
          public_id: result.public_id,
          url: result.url,
        }
        mediaDel()
      })
    }

    const user = await User.create(newUserData);
    verifiedEmail.reserved = true;
    verifiedEmail.save();

    const userId = user._id;
    const { addressLine1, type, city, state, zipCode } = req.body;

    let payLoadObj = {
      addressLine1,
      type,
      city,
      state,
      country: 'India',
      zipCode
    }

    const newUserAddress = await UserAddress.create(payLoadObj);
    const findUser = await User.findById(userId);
    findUser.address.push(newUserAddress._id);
    await findUser.save();

    sendResponse(201, true, 'registration done', res)
  } catch (e) {
    console.log(e);
    if (e.code) {
      return sendResponse(400, false, `${Object.keys(e.keyValue)} already in use`, res)
    }
    sendResponse(400, false, e.message, res)
  }
};

//Login User
export const loginUser = async (req, res, next) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email }).where('approved').equals(true).select("+password");
    if (!user) {
      return sendResponse(400, false, 'user not found with this email', res);
    }
    const isPasswordMatched = await user.comparePassword(password);
    if (!isPasswordMatched) {
      return sendResponse(400, false, 'password incorrect', res);
    }

    const userData = await User.findOne({ email }).populate('address');
    const result = userData
    const token = newToken(result)
    const options = {
      expires: new Date(
        Date.now() + 20 * 24 * 60 * 60 * 1000
      ),
      httpOnly: true,
    };

    res.cookie("token", token, options)
    sendResponse(201, true, { token, result }, res);
  } catch (e) {
    sendResponse(400, false, e.message, res)
  }
};

//USER NAME EXIST
export const userNameExist = async (req, res, next) => {
  try {
    const { userName } = req.body;

    const exist = await User.findOne({ userName: userName }).where('approved').equals(true).countDocuments();
    if (exist) {
      return sendResponse(400, false, 'username already in use', res)
    }

    sendResponse(200, true, 'username is unique', res)
  } catch (e) {
    sendResponse(400, false, e.message, res)
  }
};

//Logout User
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

// 4.Forgot Password
export const forgotPassword = async (req, res, next) => {
  try {
    const { email } = req.body;
    const exist = await User.findOne({ email: email }).countDocuments();
    if (!exist) { return sendResponse(404, false, 'user not found', res) }
    // Get ResetPassword Token
    const OTP = generateOtp();
    let user = await User.findOne({ email: email });
    user.resetPasswordOtp = OTP;
    user.resetPasswordUpdatedAt = new Date();
    await user.save()
    //SEND EMAIL SERVICE
    sendResponse(200, true, OTP, res)
  } catch (e) {
    console.log(e);
    return sendResponse(400, false, e.message, res);
  }
};

// Change password otp verification
export const changePasswordOtpVerify = async (req, res, next) => {
  try {
    const { email, otp } = req.body;
    const user = await User.findOne({ email: email }).where('resetPasswordOtp').equals(otp);
    if (!user) return sendResponse(400, false, "otp is incorrect", res)

    const timeDiff = parseInt((new Date() - user.resetPasswordUpdatedAt) / (1000 * 60));
    if (timeDiff > 10) { return sendResponse(400, false, 'otp expired', res) }

    user.resetPasswordOtpVerify = true;
    await user.save();
    sendResponse(200, true, "otp verified", res);
  } catch (e) {
    console.log(e);
    sendResponse(400, false, e.message, res)
  }
};

// 8.update User password
export const updatePassword = async (req, res, next) => {
  const { email, newPassword, confirmPassword } = req.body;

  if (newPassword != confirmPassword) {
    return sendResponse(400, false, "password and confirm password does not match", res)
  }
  const user = await User.findOne({ email: email }).where('resetPasswordOtpVerify').equals(true).countDocuments();
  if (!user) return sendResponse(400, false, "otp is not verified", res)

  const timeDiff = parseInt((new Date() - user.resetPasswordUpdatedAt) / (1000 * 60));
  if (timeDiff > 10) { return sendResponse(400, false, 'otp expired', res) }

  const hashedPassword = await bcryptPassword(newPassword);
  user.password = hashedPassword;
  user.resetPasswordOtpVerify = false;
  await user.save();
  sendToken(200, true, "password updated", res);
};

// user create
export const addUser = async (req, res, next) => {
  try {
    const { uniqueId, userName, fullName, email, phone } = req.body;

    const exist1 = await User.findOne({ userName: userName }).countDocuments();
    if (exist1) {
      return sendResponse(400, false, 'username already in use', res)
    }

    const exist2 = await User.findOne({ email: email }).countDocuments();
    if (exist2) {
      return sendResponse(409, false, 'email already in use', res)
    }

    const user = await User.create({
      _id: uniqueId,
      userName,
      fullName,
      email,
      phone,
      role: 'user'
    });
    sendResponse(201, true, user, res)
  } catch (e) {
    console.log(e);
    if (e.code) {
      return sendResponse(400, false, `${Object.keys(e.keyValue)} already in use`, res)
    }
    sendResponse(400, false, e.message, res)
  }
};

//Get all users(except admin)
export const getAllUser = async (req, res, next) => {
  try {
    const { skip, limit } = req.query
    const totalDocs = await User.countDocuments();
    if (totalDocs) {
      const result = await User.find().sort({ userName: -1 }).all('role', ['user']).skip(skip).limit(limit)
      sendResponse(200, true, { totalDocs, result }, res)
    } else sendResponse(400, false, 'users not found', res)
  } catch (e) {
    console.log(e);
    sendResponse(400, false, e.message, res)
  }
};

//Get single user by param
export const getSingleUserByParam = async (req, res, next) => {
  try {
    const userId = req.params.id;

    const user = await User.findById(userId).populate('booksAdded address')
    if (!user) {
      return sendResponse(400, false, `User does not exist with Id: ${userId}`, res)
    }
    sendResponse(200, true, user, res)
  } catch (e) {
    console.log(e);
    sendResponse(400, false, e.message, res)
  }
};

//Get single user
export const getSingleUser = async (req, res, next) => {
  try {
    const userId = req.authTokenData.id;

    const user = await User.findById(userId).where('approved').equals(true).populate('booksAdded').populate('address')
    if (!user) {
      return sendResponse(400, false, `User does not exist with Id: ${userId}`, res)
    }
    sendResponse(200, true, user, res)
  } catch (e) {
    console.log(e);
    sendResponse(400, false, e.message, res)
  }
};

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
export const updateUserByParam = async (req, res, next) => {
  try {

    const userId = req.params.id

    if (req.file) {
      await cloudinary.v2.uploader.upload(req.file.path, {
        folder: "user/",
      }).then((result) => {
        req.body.image = {
          public_id: result.public_id,
          url: result.url,
        }
        mediaDel()
      })
    }

    await User.findByIdAndUpdate(userId, req.body);
    sendResponse(200, true, 'Updated Successfully', res)
  } catch (e) {
    if (e.code) {
      return sendResponse(400, false, `${Object.keys(e.keyValue)} already in use`, res)
    }
    sendResponse(400, false, e, res)
  }
};

//Update user
export const updateUser = async (req, res, next) => {
  try {

    const userId = req.authTokenData.id;

    if (req.file) {
      await cloudinary.v2.uploader.upload(req.file.path, {
        folder: "user/",
      }).then((result) => {
        req.body.image = {
          public_id: result.public_id,
          url: result.url,
        }
        mediaDel()
      })
    }

    await User.findByIdAndUpdate(userId, req.body);
    sendResponse(200, true, 'Updated Successfully', res)
  } catch (e) {
    if (e.code) {
      return sendResponse(400, false, `${Object.keys(e.keyValue)} already in use`, res)
    }
    sendResponse(400, false, e, res)
  }
};


//UPDATE USER STATUS
export const updateUserStatus = async (req, res, next) => {
  try {
    const TrueStatus = {
      approved: 'true'
    };
    const FalseStatus = {
      approved: 'false'
    };
    const user = await User.findById(req.body.id);
    if (user.approved) {
      await User.updateOne({ _id: mongoose.mongo.ObjectId(req.body.id) }, FalseStatus);
    } else {
      await User.updateOne({ _id: mongoose.mongo.ObjectId(req.body.id) }, TrueStatus);
    }
    sendResponse(200, true, 'User Status Updated', res)
  } catch (e) {
    sendResponse(400, false, e.message, res)
  }
};

// BOOK MARK / UNMARK
export const toggleBookmark = async (req, res, next) => {
  try {
    const userId = req.authTokenData.id;
    const bookId = req.body.bookId;

    const user = await User.findById(userId);
    const exist = await User.find({ booksMarked: { "$in": [bookId] } });
    if (exist.length) {
      user.booksMarked.pull({ _id: bookId });
      await user.save();
      return sendResponse(201, true, 'book unmarked', res)
    } else {
      user.booksMarked.push(bookId);
      await user.save();
      return sendResponse(201, true, 'book marked', res)
    }

  } catch (e) {
    console.log(e);
    sendResponse(400, false, e.message, res)
  }
};

// GET ALL BOOK MARK
export const allBookmark = async (req, res, next) => {
  try {
    const userId = req.authTokenData.id;

    const user = await User.findById(userId).select("booksMarked").populate({
      path: 'booksMarked', populate: { path: 'genre language' }, model: 'Book'
    })
    sendResponse(201, true, user, res)
  } catch (e) {
    console.log(e);
    sendResponse(400, false, e.message, res)
  }
};

// PUSH TO CART
export const pushToCart = async (req, res, next) => {
  try {
    const userId = req.authTokenData.id;
    const noOfDays = req.body.noOfDays;
    if (parseInt(noOfDays) < 3) return sendResponse(400, true, 'minimum days should be 3', res)
    const bookId = req.params.bookId;

    let payLoadObj = { itemId: bookId, noOfDays: noOfDays };

    let user = await User.findById(userId);

    // Check whether incoming bookId is already in cart or not 
    let itemFound = 0;
    user.cart.forEach((el) => {
      if (el.itemId.equals(mongoose.Types.ObjectId(bookId))) {
        return itemFound = 1;
      }
    })
    if (itemFound) return sendResponse(201, true, 'book already added to cart', res)

    user.cart.push(payLoadObj);
    await user.save();
    return sendResponse(201, true, 'book added to cart', res)

  } catch (e) {
    console.log(e);
    sendResponse(400, false, e.message, res)
  }
};

// UPDATE CART
export const updateItemDurationInCart = async (req, res, next) => {
  try {
    const userId = req.authTokenData.id;
    const noOfDays = req.body.noOfDays;
    if (parseInt(noOfDays) < 3) return sendResponse(400, true, 'minimum days should be 3', res)
    const bookId = req.params.bookId;

    let user = await User.findById(userId);

    // Update no of days
    user.cart.forEach((el) => {
      if (el.itemId.equals(mongoose.Types.ObjectId(bookId))) {
        el.noOfDays = noOfDays;
      }
    })

    await user.save();
    return sendResponse(201, true, 'item duration updated in cart', res)
  } catch (e) {
    console.log(e);
    sendResponse(400, false, e.message, res)
  }
};

// POP FROM CART
export const popFromCart = async (req, res, next) => {
  try {
    const userId = req.authTokenData.id;
    const bookIdString = req.body.bookIdArray;

    let bookIdArray = bookIdString.split(" ");
    let user = await User.findById(userId);
    bookIdArray.forEach(bookId => {
      user.cart.forEach((el, index) => {
        if (el.itemId.equals(mongoose.Types.ObjectId(bookId))) {
          user.cart.splice(index, 1)
        }
      })
    })

    await user.save();
    return sendResponse(201, true, 'book removed from cart', res)

  } catch (e) {
    console.log(e);
    sendResponse(400, false, e.message, res)
  }
};

// Empty cart
export const emptyCart = async (req, res, next) => {
  try {
    const userId = req.authTokenData.id;
    await User.updateOne({ _id: userId }, { $unset: { cart: 1 } })

    return sendResponse(201, true, 'cart is empty now', res)
  } catch (e) {
    console.log(e);
    sendResponse(400, false, e.message, res)
  }
};

// GET CART
export const getCart = async (req, res, next) => {
  try {
    const userId = req.authTokenData.id;

    let cartData = await User.findById(userId).select("cart").populate({
      path: 'cart.itemId',
      populate: { path: 'genre language' }
    });

    let totalAmountBeforeCharges = 0;
    cartData.cart.forEach(el => {
      totalAmountBeforeCharges += el.itemId.rentPerDay * el.noOfDays;
    });

    let subTotal = {
      totalAmountBeforeCharges,
    };
    return sendResponse(201, true, { cartData, subTotal }, res);

  } catch (e) {
    console.log(e);
    sendResponse(400, false, e.message, res)
  }
};