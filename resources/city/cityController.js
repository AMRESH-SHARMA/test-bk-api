import City from "./cityModel.js"
import { sendResponse } from "../../util/sendResponse.js";

export const getAllCities = async (req, res, next) => {
  try {
    const { skip, limit } = req.query
    const totalDocs = await City.countDocuments();
    const result = await City.find().populate('state').skip(skip).limit(limit)
    sendResponse(200, true, { totalDocs, result }, res)
  } catch (e) {
    console.log(e);
    sendResponse(400, false, e.message, res)
  }
};

export const getSingleCity = async (req, res, next) => {
  try {
    const city = await City.findById(req.params.id).populate('state');
    if (!city) {
      return sendResponse(400, false, `city does not exist with Id: ${req.params.id}`, res)
    }
    sendResponse(200, true, city, res)
  } catch (e) {
    console.log(e);
    sendResponse(400, false, e.message, res)
  }
};

export const addCity = async (req, res, next) => {
  try {
    const { city, state, uniqueId } = req.body;
    const data = await City.create({
      _id: uniqueId,
      city,
      state,
    })
    sendResponse(201, true, data, res)
  } catch (e) {
    if (e.code) {
      return sendResponse(400, false, `${Object.keys(e.keyValue)} Already in use`, res)
    }
    sendResponse(400, false, e, res)
  }
};


export const updateCity = async (req, res, next) => {
  try {
    const { city, state } = req.body;

    const newcityData = {
      city,
      state
    };

    await City.findByIdAndUpdate(req.params.id, newcityData);
    sendResponse(200, true, 'Updated Successfully', res)
  } catch (e) {
    if (e.code) {
      return sendResponse(400, false, `${Object.keys(e.keyValue)} Already in use`, res)
    }
    sendResponse(400, false, e, res)
  }
};

export const deleteSingleCity = async (req, res, next) => {
  try {
    await City.deleteOne({ _id: req.params.id })
    sendResponse(201, true, 'city deleted', res)
  } catch (e) {
    sendResponse(400, false, e.message, res)
  }
}