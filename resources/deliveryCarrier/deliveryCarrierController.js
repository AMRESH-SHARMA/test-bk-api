import mongoose from "mongoose"
import DeliveryCarrier from "./deliveryCarrierModel.js"
import { sendResponse } from "../../util/sendResponse.js"
import cloudinary from "../../util/cloudinary.js"
import { mediaDel } from "../../util/mediaDel.js"

//carrier create
export const createDeliveryCarrier = async (req, res, next) => {
  try {
    const { uniqueId, carrierName, email, phone, address } = req.body;
    const exist1 = await DeliveryCarrier.findOne({ carrierName: carrierName }).countDocuments();
    if (exist1) {
      return sendResponse(400, false, 'carrier name already in use', res)
    }

    const exist2 = await DeliveryCarrier.findOne({ email: email }).countDocuments();
    if (exist2) {
      return sendResponse(409, false, 'email already in use', res)
    }

    let payLoadObj = {
      _id: uniqueId,
      carrierName,
      email,
      phone,
      address
    }

    if (req.file) {
      await cloudinary.v2.uploader.upload(req.file.path, {
        folder: "deliveryCarrier/",
      }).then((result) => {
        payLoadObj.image = {
          public_id: result.public_id,
          url: result.url,
        }
        mediaDel()
      })
    }

    const newData = await DeliveryCarrier.create(payLoadObj);
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

// update
export const updateDeliveryCarrier = async (req, res, next) => {
  try {
    const { carrierId } = req.params
    const dc = await DeliveryCarrier.findById(carrierId);
    if (req.file) {
      await cloudinary.v2.uploader.destroy(dc.image.public_id);
      await cloudinary.v2.uploader.upload(req.file.path, {
        folder: "deliveryCarrier/",
      }).then((result) => {
        req.body.image = {
          public_id: result.public_id,
          url: result.url,
        }
        mediaDel()
      })
    }

    await DeliveryCarrier.findByIdAndUpdate(carrierId, req.body);
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
export const deleteDeliveryCarrier = async (req, res, next) => {
  try {
    const { carrierId } = req.params;
    const dc = await DeliveryCarrier.findById(carrierId);

    await cloudinary.v2.uploader.destroy(dc.image.public_id)
    await DeliveryCarrier.deleteOne({ _id: carrierId });
    sendResponse(201, true, 'deleted', res)
  } catch (e) {
    console.log(e);
    sendResponse(400, false, e.message, res)
  }
}