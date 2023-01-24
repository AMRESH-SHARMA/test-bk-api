import State from "./stateModel.js"
import { sendResponse } from "../../util/sendResponse.js";

export const getAllStates = async (req, res, next) => {
  try {
    const { skip, limit } = req.query
    const totalDocs = await State.countDocuments();
    const result = await State.find().populate('state').skip(skip).limit(limit)
    sendResponse(200, true, { totalDocs, result }, res)
  } catch (e) {
    console.log(e);
    sendResponse(400, false, e.message, res)
  }
};

export const getSingleState = async (req, res, next) => {
  try {
    const state = await State.findById(req.params.id);
    if (!state) {
      return sendResponse(400, false, `state does not exist with Id: ${req.params.id}`, res)
    }
    sendResponse(200, true, state, res)
  } catch (e) {
    console.log(e);
    sendResponse(400, false, e.message, res)
  }
};

export const addState = async (req, res, next) => {
  try {
    const { state, uniqueId } = req.body;
    const data = await State.create({
      _id: uniqueId,
      state,
    })
    sendResponse(201, true, data, res)
  } catch (e) {
    console.log(e);
    if (e.code) {
      return sendResponse(400, false, `${Object.keys(e.keyValue)} already in use`, res)
    }
    sendResponse(400, false, e, res)
  }
};


export const updateState = async (req, res, next) => {
  try {
    const { state } = req.body;

    const newstateData = {
      state,
    };

    await State.findByIdAndUpdate(req.params.id, newstateData);
    sendResponse(200, true, 'Updated Successfully', res)
  } catch (e) {
    if (e.code) {
      return sendResponse(400, false, `${Object.keys(e.keyValue)} Already in use`, res)
    }
    sendResponse(400, false, e, res)
  }
};

export const deleteSingleState = async (req, res, next) => {
  try {
    await State.deleteOne({ _id: req.params.id })
    sendResponse(201, true, 'state deleted', res)
  } catch (e) {
    sendResponse(400, false, e.message, res)
  }
}