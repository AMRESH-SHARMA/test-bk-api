import mongoose from "mongoose"
import UserAddress from "./userAddressModel.js"
import { sendResponse } from "../../util/sendResponse.js";
import User from "../user/userModel.js";

//CREATE USER ADDRESS
export const addUserAddress = async (req, res, next) => {
  try {
    const { uniqueId, userId, addressLine1, addressLine2,type, landmark, city, state, country, zipCode } = req.body;

    let payLoadObj = {
      _id: uniqueId,
      addressLine1,
      type,
      city,
      state,
      country,
      zipCode
    }
    if (addressLine2) {
      payLoadObj.addressLine2 = addressLine2;
    }
    if (landmark) {
      payLoadObj.landmark = landmark;
    }

    const newUserAddress = await UserAddress.create(payLoadObj);
    const user = await User.findById(userId);
    user.address.push(newUserAddress._id);
    await user.save();
    const result = await User.findById(userId).populate('address')

    sendResponse(201, true, 'userAddress', res)
  } catch (e) {
    console.log(e);
    sendResponse(400, false, e.message, res)
  }
};

//GET ALL USER ADDRESS BY PARAM
export const getAllAddressByParam = async (req, res, next) => {
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

//GET ALL USER ADDRESS BY PARAM USERID
export const getSingleUserAddressByParam = async (req, res, next) => {
  try {
    const addressId = req.params.addressId;

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

// DEL SINGLE ADDRESS BY PARAMS
export const deleteSingleAddress = async (req, res, next) => {
  try {
    const addressId = req.params.addressId;
    const userId = req.params.userId;

    await UserAddress.deleteOne({ _id: addressId });
    const user = await User.findById(userId);
    user.address.pull({ _id: addressId });
    await user.save();

    sendResponse(201, true, 'address deleted', res)
  } catch (e) {
    console.log(e);
    sendResponse(400, false, e.message, res)
  }
}

// UPDATE USER ADDRESS
export const updateUserAddress = async (req, res, next) => {
  try {
    const addressId = req.params.addressId;

    await UserAddress.findByIdAndUpdate(addressId, req.body);
    sendResponse(200, true, 'Updated Successfully', res)
  } catch (e) {
    console.log(e);
    sendResponse(400, false, e, res)
  }
};
// CLIENT**********************************************************************************************

//CREATE USER ADDRESS CLIENT
export const addUserAddressClient = async (req, res, next) => {
  try {
    const userId = req.authTokenData.id;
    const { addressLine1,addressLine2,type, landmark, city, state, country, zipCode } = req.body;

    let payLoadObj = {
      addressLine1,
      type,
      city,
      state,
      country,
      zipCode
    }
    if (addressLine2) {
      payLoadObj.addressLine2 = addressLine2;
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

//Get ALL ADDRESS
export const getAllAddressClient = async (req, res, next) => {
  try {
    const userId = req.authTokenData.id;
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

//DEL USER ADDRESS
export const deleteSingleAddressClient = async (req, res, next) => {
  try {
    const userId = req.authTokenData.id;
    const addressId = req.params.addressId;

    await UserAddress.deleteOne({ _id: addressId });
    const user = await User.findById(userId);
    user.address.pull({ _id: addressId });
    await user.save();

    sendResponse(201, true, 'address deleted', res)
  } catch (e) {
    console.log(e);
    sendResponse(400, false, e.message, res)
  }
}