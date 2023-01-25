import InternetHandlingFees from "./internetHandlingFeesModel.js"
import { sendResponse } from "../../util/sendResponse.js";

export const getInternetHandlingFees = async (req, res, next) => {
  try {
    const result = await InternetHandlingFees.find();
    sendResponse(200, true, result, res)
  } catch (e) {
    console.log(e);
    sendResponse(400, false, e.message, res)
  }
};

export const updateInternetHandlingFees = async (req, res, next) => {
  try {
    const { fees } = req.body;

    const newData = {
      fees
    };

    await InternetHandlingFees.findByIdAndUpdate(req.params.id, newData);
    // await InternetHandlingFees.create(newData);
    sendResponse(200, true, 'Updated Successfully', res)
  } catch (e) {
    console.log(e);
    sendResponse(400, false, e.message, res)
  }
};