import DeliveryFees from "./deliveryFeesModel.js"
import { sendResponse } from "../../util/sendResponse.js";

export const getAllDeliveryFees = async (req, res, next) => {
  try {
    const { skip, limit } = req.query
    const totalDocs = await DeliveryFees.countDocuments();
    const result = await DeliveryFees.find().populate('city').populate('state').skip(skip).limit(limit)
    sendResponse(200, true, { totalDocs, result }, res)
  } catch (e) {
    console.log(e);
    sendResponse(400, false, e.message, res)
  }
};

export const getSingleDeliveryFees = async (req, res, next) => {
  try {
    const result = await DeliveryFees.findById(req.params.id).populate('city').populate('state')
    if (!result) {
      return sendResponse(400, false, `deliveryFees does not exist with Id: ${req.params.id}`, res)
    }
    sendResponse(200, true, result, res)
  } catch (e) {
    console.log(e);
    sendResponse(400, false, e.message, res)
  }
};

export const addDeliveryFees = async (req, res, next) => {
  try {
    const { fees, city, state, uniqueId } = req.body;

    const count = await DeliveryFees.findOne({ city: city }).countDocuments()
    if (count) {
      return sendResponse(400, false, 'city already exist', res)
    }

    const result = await DeliveryFees.create({
      _id: uniqueId,
      fees,
      city,
      state
    })
    sendResponse(201, true, result, res)
  } catch (e) {
    if (e.code) {
      return sendResponse(400, false, `${Object.keys(e.keyValue)} Already in use`, res)
    }
    sendResponse(400, false, e, res)
  }
};


export const updateDeliveryFees = async (req, res, next) => {
  try {
    const { fees, city, state } = req.body;

    // const count = await DeliveryFees.findOne({ city: city }).countDocuments()
    // if (count) {
    //   return sendResponse(400, false, 'city already exist', res)
    // }

    const newdeliveryFeesData = {
      fees,
      city,
      state
    };

    await DeliveryFees.findByIdAndUpdate(req.params.id, newdeliveryFeesData);
    sendResponse(200, true, 'Updated Successfully', res)
  } catch (e) {
    if (e.code) {
      return sendResponse(400, false, `${Object.keys(e.keyValue)} Already in use`, res)
    }
    sendResponse(400, false, e, res)
  }
};

export const deleteSingleDeliveryFees = async (req, res, next) => {
  try {
    await DeliveryFees.deleteOne({ _id: req.params.id })
    sendResponse(201, true, 'delivery Fees deleted', res)
  } catch (e) {
    sendResponse(400, false, e.message, res)
  }
}