import Genre from "./genreModel.js"
import cloudinary from "../../util/cloudinary.js";
import { sendResponse } from "../../util/sendResponse.js";
import { mediaDel } from "../../util/mediaDel.js";

export const getAllgenres = async (req, res, next) => {
  try {
    const { skip, limit } = req.query
    const totalDocs = await Genre.countDocuments();
    const result = await Genre.find().sort({genre: 1}).skip(skip).limit(limit)
    sendResponse(200, true, { totalDocs, result }, res)
  } catch (e) {
    console.log(e);
    sendResponse(400, false, e.message, res)
  }
};

export const getSinglegenre = async (req, res, next) => {
  try {
    const genre = await Genre.findById(req.params.id);
    if (!genre) {
      return sendResponse(400, false, `genre does not exist with Id: ${req.params.id}`, res)
    }
    sendResponse(200, true, genre, res)
  } catch (e) {
    console.log(e);
    sendResponse(400, false, e.message, res)
  }
};

export const addgenre = async (req, res, next) => {
  try {
    const { uniqueId, genre } = req.body

    const exist = await Genre.findOne({ genre: genre }).countDocuments();
    if (exist) {
      return sendResponse(409, false, 'Genre already exist', res)
    }

    const payloadObj = {
      _id: uniqueId,
      genre,
    }


    await cloudinary.v2.uploader.upload(req.file.path, {
      folder: "genre/",
    }).then((result1) => {
      payloadObj.image = {
        public_id: result1.public_id,
        url: result1.url,
      }
      mediaDel()
    })

    const result = await Genre.create(payloadObj)
    sendResponse(201, true, result, res)
  } catch (e) {
    console.log(e)
    sendResponse(400, false, e.message, res)
  }
};


export const updategenre = async (req, res, next) => {
  try {
    const { genre } = req.body;
    const exist = await Genre.findOne({ genre: genre }).countDocuments();
    if (exist) {
      return sendResponse(401, false, 'Genre already exist', res)
    }
    const newgenreData = {
      genre,
    };
    await Genre.findByIdAndUpdate(req.params.id, newgenreData);
    sendResponse(200, true, 'Updated Successfully', res)
  } catch (e) {
    sendResponse(400, false, e, res)
  }
};

export const deleteSinglegenre = async (req, res, next) => {
  try {
    await Genre.deleteOne({ _id: req.params.id })
    sendResponse(201, true, 'genre deleted', res)
  } catch (e) {
    sendResponse(400, false, e.message, res)
  }
}