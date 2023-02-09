import Logos from "./logosModel.js"
import cloudinary from "../../util/cloudinary.js";
import { sendResponse } from "../../util/sendResponse.js";
import { mediaDel } from "../../util/mediaDel.js";

export const getAllLogos = async (req, res, next) => {
  try {
    const logos = await Logos.find();
    sendResponse(200, true, logos, res)
  } catch (e) {
    console.log(e);
    sendResponse(400, false, e.message, res)
  }
};


export const updateLogos = async (req, res, next) => {
  try {
    const { websiteHeader, websiteFooter, websiteAdminHeader } = req.files
    const logos = await Logos.findOne();
    const payloadObj = {}
    if (logos) {

      if (websiteHeader) {
        await cloudinary.v2.uploader.destroy(logos.websiteHeader.public_id);
        await cloudinary.v2.uploader.upload(websiteHeader[0].path, {
          folder: "logos/",
        }).then((result) => {
          console.log(result)
          payloadObj.websiteHeader = {
            public_id: result.public_id,
            url: result.url,
          }
        })
      }

      if (websiteFooter) {
        await cloudinary.v2.uploader.destroy(logos.websiteFooter.public_id);
        await cloudinary.v2.uploader.upload(websiteFooter[0].path, {
          folder: "logos/",
        }).then((result) => {
          payloadObj.websiteFooter = {
            public_id: result.public_id,
            url: result.url,
          }
        })
      }

      if (websiteAdminHeader) {
        await cloudinary.v2.uploader.destroy(logos.websiteAdminHeader.public_id);
        await cloudinary.v2.uploader.upload(websiteAdminHeader[0].path, {
          folder: "logos/",
        }).then((result) => {
          payloadObj.websiteAdminHeader = {
            public_id: result.public_id,
            url: result.url,
          }
        })
      }
      mediaDel()

      if (Object.keys(payloadObj).length != 0) {
        await Logos.updateOne(payloadObj);
        return sendResponse(201, true, 'Updated Successfully', res);
      }
    }

    if (websiteHeader) {
      await cloudinary.v2.uploader.upload(websiteHeader[0].path, {
        folder: "logos/",
      }).then((result) => {
        console.log(result)
        payloadObj.websiteHeader = {
          public_id: result.public_id,
          url: result.url,
        }
      })
    }

    if (websiteFooter) {
      await cloudinary.v2.uploader.upload(websiteFooter[0].path, {
        folder: "logos/",
      }).then((result) => {
        payloadObj.websiteFooter = {
          public_id: result.public_id,
          url: result.url,
        }
      })
    }

    if (websiteAdminHeader) {
      await cloudinary.v2.uploader.upload(websiteAdminHeader[0].path, {
        folder: "logos/",
      }).then((result) => {
        payloadObj.websiteAdminHeader = {
          public_id: result.public_id,
          url: result.url,
        }
      })
    }
    mediaDel()

    if (Object.keys(payloadObj).length != 0) {
      await Logos.create(payloadObj);
      return sendResponse(201, true, 'Updated Successfully', res);
    }
    sendResponse(200, true, 'Updated Successfully', res);
  } catch (e) {
    console.log(e)
    sendResponse(400, false, e.message, res)
  }
};