import mongoose from "mongoose"
import UserAddress from "./userAddressModel.js"
import { sendResponse } from "../../util/sendResponse.js";
import User from "../user/userModel.js";

//CREATE USER ADDRESS
export const addUserAddress = async (req, res, next) => {
  try {
    const { uniqueId, userId, addressLine, landmark, city, state, country, zipCode } = req.body;

    let payLoadObj = {
      _id: uniqueId,
      addressLine,
      city,
      state,
      country,
      zipCode
    }
    if (landmark) {
      payLoadObj.landmark = landmark;
    }

    const newUserAddress = await UserAddress.create(payLoadObj);
    console.log(newUserAddress);

    const user = await User.findById(userId);
    console.log(user);
    user.address.push(newUserAddress._id);
    await user.save();

    const result = await User.findById(userId).populate('address')
    console.log(result);

    sendResponse(201, true, 'userAddress', res)
  } catch (e) {
    console.log(e);
    sendResponse(400, false, e.message, res)
  }
};

//CREATE USER ADDRESS CLIENT
export const addUserAddressClient = async (req, res, next) => {
  try {
    const userId = req.authTokenData.id;
    const { addressLine, landmark, city, state, country, zipCode } = req.body;

    let payLoadObj = {
      addressLine,
      city,
      state,
      country,
      zipCode
    }
    if (landmark) {
      payLoadObj.landmark = landmark;
    }

    const newUserAddress = await UserAddress.create(payLoadObj);
    console.log(newUserAddress);

    const user = await User.findById(userId);
    user.address.push(newUserAddress._id);
    await user.save();

    sendResponse(201, true, 'address created', res);
  } catch (e) {
    console.log(e);
    sendResponse(400, false, e.message, res)
  }
};

//GET ALL USER ADDRESS BY USERID
export const getAllAddressByUserId = async (req, res, next) => {
  try {
    const userId = req.params.userId;
    const { skip, limit } = req.query;

    const totalDocs = await User.findById(userId).select('address').populate('address')
    if (totalDocs.address.length) {
      const result = await User.findById(userId).select('address').populate('address').skip(skip).limit(limit);
      sendResponse(200, true, { totalDocs: totalDocs.address.length, result }, res)
    } else sendResponse(400, false, 'address not found', res)
  } catch (e) {
    console.log(e);
    sendResponse(400, false, e.message, res)
  }
};

// //GET SINGLE USER ADDRESS
export const getSingleUserAddressByParam = async (req, res, next) => {
  try {
    const addressId = req.params.id;

    const address = await UserAddress.findById(addressId);
    if (!address) {
      return sendResponse(400, false, `address does not exist with Id: ${addressId}`, res)
    }
    sendResponse(200, true, address, res)
  } catch (e) {
    console.log(e);
    sendResponse(400, false, e.message, res)
  }
};

//GET SINGLE USER ADDRESS
// export const getSingleUserAddressByParam = async (req, res, next) => {
//   try {
//     const userId = req.authTokenData.id;

//     const user = await User.findById(userId).where('approved').equals(true).populate('booksAdded')
//     if (!user) {
//       return sendResponse(400, false, `User does not exist with Id: ${userId}`, res)
//     }
//     sendResponse(200, true, user, res)
//   } catch (e) {
//     console.log(e);
//     sendResponse(400, false, e.message, res)
//   }
// };

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

    const u = await User.findByIdAndUpdate(userId, req.body);
    console.log(u);
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

//Update user
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