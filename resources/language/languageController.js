import Language from "./languageModel.js"
import { sendResponse } from "../../util/sendResponse.js";

export const getAlllanguages = async (req, res, next) => {
  try {
    const { skip, limit } = req.query
    const totalDocs = await Language.countDocuments();
    const result = await Language.find().skip(skip).limit(limit)
    sendResponse(200, true, {totalDocs,result}, res)
  } catch (e) {
    console.log(e);
    sendResponse(400, false, e.message, res)
  }
};

export const getSinglelanguage = async (req, res, next) => {
  try {
    const language = await Language.findById(req.params.id);
    if (!language) {
      return sendResponse(400, false, `language does not exist with Id: ${req.params.id}`, res)
    }
    sendResponse(200, true, language, res)
  } catch (e) {
    console.log(e);
    sendResponse(400, false, e.message, res)
  }
};

export const addlanguage = async (req, res, next) => {
  try {
    const { language, uniqueId } = req.body;
    // console.log(req.files)
    const data = await Language.create({
      _id: uniqueId,
      language,
    })
    sendResponse(201, true, data, res)
  } catch (e) {
    if (e.code) {
      return sendResponse(400, false, `${Object.keys(e.keyValue)} Already in use`, res)
    }
    sendResponse(400, false, e, res)
  }
};


export const updatelanguage = async (req, res, next) => {
  try {
    const { language } = req.body;

    const newlanguageData = {
      language,
    };

    await Language.findByIdAndUpdate(req.params.id, newlanguageData);
    sendResponse(200, true, 'Updated Successfully', res)
  } catch (e) {
    if (e.code) {
      return sendResponse(400, false, `${Object.keys(e.keyValue)} Already in use`, res)
    }
    sendResponse(400, false, e, res)
  }
};

export const deleteSinglelanguage = async (req, res, next) => {
  try {
    await Language.deleteOne({ _id: req.params.id })
    sendResponse(201, true, 'language deleted', res)
  } catch (e) {
    sendResponse(400, false, e.message, res)
  }
}