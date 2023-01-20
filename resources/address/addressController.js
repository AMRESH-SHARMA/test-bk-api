import Address from "./addressModel.js"
import { sendResponse } from "../../util/sendResponse.js";

export const getAddress = async (req, res, next) => {
  try {
    const result = await Address.find();
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

    await Address.findByIdAndUpdate(req.params.id, newData);
    // await Address.create(newData);
    sendResponse(200, true, 'Updated Successfully', res)
  } catch (e) {
    console.log(e);
    sendResponse(400, false, e.message, res)
  }
};