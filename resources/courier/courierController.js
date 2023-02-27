import Courier from "./courierModel.js"
import { sendResponse } from "../../util/sendResponse.js"
import cloudinary from "../../util/cloudinary.js"
import { mediaDel } from "../../util/mediaDel.js"

//carrier create
export const createCourier = async (req, res, next) => {
  try {
    const { uniqueId, courierName, email, phone, address } = req.body;
    const exist1 = await Courier.findOne({ courierName: courierName }).countDocuments();
    if (exist1) {
      return sendResponse(400, false, 'courier name name already in use', res)
    }

    const exist2 = await Courier.findOne({ email: email }).countDocuments();
    if (exist2) {
      return sendResponse(409, false, 'email already in use', res)
    }

    let payLoadObj = {
      _id: uniqueId,
      courierName,
      email,
      phone,
      address
    }

    if (req.file) {
      await cloudinary.v2.uploader.upload(req.file.path, {
        folder: "courier/",
      }).then((result) => {
        payLoadObj.image = {
          public_id: result.public_id,
          url: result.url,
        }
        mediaDel()
      })
    }

    const newData = await Courier.create(payLoadObj);
    sendResponse(201, true, newData, res)
  } catch (e) {
    console.log(e);
    if (e.code) {
      return sendResponse(400, false, `${Object.keys(e.keyValue)} already in use`, res)
    }
    sendResponse(400, false, e.message, res)
  }
};

//get all courier
export const getAllCourier = async (req, res, next) => {
  try {
    const { skip, limit } = req.query
    const totalDocs = await Courier.countDocuments();
    if (totalDocs) {
      const result = await Courier.find().sort({ courierName: -1 }).skip(skip).limit(limit)
      sendResponse(200, true, { totalDocs, result }, res)
    } else sendResponse(400, false, 'courier not found', res)
  } catch (e) {
    console.log(e);
    sendResponse(400, false, e.message, res)
  }
};

//get all approved courier
export const getAllApprovedCourier = async (req, res, next) => {
  try {
    const { skip, limit } = req.query
    const totalDocs = await Courier.find({approved:true}).countDocuments();
    if (totalDocs) {
      const result = await Courier.find({approved:true}).sort({ courierName: -1 }).skip(skip).limit(limit)
      sendResponse(200, true, { totalDocs, result }, res)
    } else sendResponse(400, false, 'courier not found', res)
  } catch (e) {
    console.log(e);
    sendResponse(400, false, e.message, res)
  }
};

//get single courier by param
export const getSingleCourier = async (req, res, next) => {
  try {
    const { courierId } = req.params;

    const result = await Courier.findById(courierId);
    if (!result) {
      return sendResponse(400, false, `courier does not exist with Id: ${courierId}`, res)
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
    const { courierId } = req.body;
    const TrueStatus = { approved: 'true' };
    const FalseStatus = { approved: 'false' };
    const courier = await Courier.findById(courierId);
    if (courier.approved) {
      await Courier.findByIdAndUpdate(courierId, FalseStatus);
    } else {
      await Courier.findByIdAndUpdate(courierId, TrueStatus);
    }
    sendResponse(200, true, 'Status Updated', res)
  } catch (e) {
    sendResponse(400, false, e.message, res)
  }
};

// update courier
export const updateCourier = async (req, res, next) => {
  try {
    const { courierId } = req.params
    const dc = await Courier.findById(courierId);
    if (req.file) {
      await cloudinary.v2.uploader.destroy(dc.image.public_id);
      await cloudinary.v2.uploader.upload(req.file.path, {
        folder: "Courier/",
      }).then((result) => {
        req.body.image = {
          public_id: result.public_id,
          url: result.url,
        }
        mediaDel()
      })
    }

    await Courier.findByIdAndUpdate(courierId, req.body);
    sendResponse(200, true, 'Updated Successfully', res)
  } catch (e) {
    console.log(e);
    if (e.code) {
      return sendResponse(400, false, `${Object.keys(e.keyValue)} already in use`, res)
    }
    sendResponse(400, false, e, res)
  }
};

// delete
export const deleteCourier = async (req, res, next) => {
  try {
    const { courierId } = req.params;
    const dc = await Courier.findById(courierId);
console.log(courierId);
    await cloudinary.v2.uploader.destroy(dc.image.public_id)
    await Courier.deleteOne({ _id: courierId });
    sendResponse(201, true, 'deleted', res)
  } catch (e) {
    console.log(e);
    sendResponse(400, false, e.message, res)
  }
}