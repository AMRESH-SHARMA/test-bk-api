import ServiceFees from "./serviceFeesModel.js"
import { sendResponse } from "../../util/sendResponse.js";

export const getAllServiceFees = async (req, res, next) => {
  try {
    const { skip, limit } = req.query
    const totalDocs = await ServiceFees.countDocuments();
    const result = await ServiceFees.find().populate('city').populate('state').skip(skip).limit(limit)
    sendResponse(200, true, { totalDocs, result }, res)
  } catch (e) {
    console.log(e);
    sendResponse(400, false, e.message, res)
  }
};

export const getSingleServiceFees = async (req, res, next) => {
  try {
    const result = await ServiceFees.findById(req.params.id).populate('city').populate('state')
    if (!result) {
      return sendResponse(400, false, `ServiceFees does not exist with Id: ${req.params.id}`, res)
    }
    sendResponse(200, true, result, res)
  } catch (e) {
    console.log(e);
    sendResponse(400, false, e.message, res)
  }
};

export const addServiceFees = async (req, res, next) => {
  try {
    const { fees, city, state, uniqueId } = req.body;

    const count = await ServiceFees.findOne({ city: city }).countDocuments()
    if (count) {
      return sendResponse(400, false, 'city already exist', res)
    }

    const result = await ServiceFees.create({
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


export const updateServiceFees = async (req, res, next) => {
  try {
    const { fees, city, state } = req.body;

    const newServiceFeesData = {
      fees,
      city,
      state
    };

    await ServiceFees.findByIdAndUpdate(req.params.id, newServiceFeesData);
    sendResponse(200, true, 'Updated Successfully', res)
  } catch (e) {
    if (e.code) {
      return sendResponse(400, false, `${Object.keys(e.keyValue)} Already in use`, res)
    }
    sendResponse(400, false, e, res)
  }
};

export const deleteSingleServiceFees = async (req, res, next) => {
  try {
    await ServiceFees.deleteOne({ _id: req.params.id })
    sendResponse(201, true, 'Service Fees deleted', res)
  } catch (e) {
    sendResponse(400, false, e.message, res)
  }
}