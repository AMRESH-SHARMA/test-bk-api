import Address from "./addressModel.js"
import { sendResponse } from "../../util/sendResponse.js";

export const getAddress = async (req, res, next) => {
  try {
    const { skip, limit } = req.query
    const result = await Address.find().skip(skip).limit(limit);
    sendResponse(200, true, result, res)
  } catch (e) {
    console.log(e);
    sendResponse(400, false, e.message, res)
  }
};

export const updateAddress = async (req, res, next) => {
  try {
    const { companyName, address, city, state, country, pinCode, gstin, website, phone, email } = req.body;

    const newData = {
      companyName,
      address,
      city,
      state,
      country,
      pinCode,
      gstin,
      website,
      phone,
      email
    };
    const result = await Address.findOne();
    if (result) {
      await Address.updateOne(newData);
      return sendResponse(200, true, 'Updated Successfully', res);
    }
    await Address.create(newData);
    sendResponse(200, true, 'Updated Successfully', res);

  } catch (e) {
    console.log(e);
    sendResponse(400, false, e.message, res)
  }
};