import SocialMedia from "./socialMediaModel.js"
import { sendResponse } from "../../util/sendResponse.js";

export const getSocialMedia = async (req, res, next) => {
  try {
    const result = await SocialMedia.find();
    sendResponse(200, true, result, res)
  } catch (e) {
    console.log(e);
    sendResponse(400, false, e.message, res)
  }
};

export const updateSocialMedia = async (req, res, next) => {
  try {
    const { facebook, twitter, instagram, linkedin } = req.body;

    const newData = {
      facebook,
      twitter,
      instagram,
      linkedin
    };

    await SocialMedia.findByIdAndUpdate(req.params.id, newData);
    // await SocialMedia.create(newData);
    sendResponse(200, true, 'Updated Successfully', res)
  } catch (e) {
    console.log(e);
    sendResponse(400, false, e, res)
  }
};