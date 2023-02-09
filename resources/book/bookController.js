import Book from "./bookModel.js"
import User from "../user/userModel.js"
import mongoose from "mongoose"
import cloudinary from "../../util/cloudinary.js";
import { sendResponse } from "../../util/sendResponse.js";
import { mediaDel } from "../../util/mediaDel.js";

export const getAllBooks = async (req, res, next) => {
  try {
    const { language, genre, skip, limit } = req.query

    if (genre && language) {
      const totalDocs = await Book.find({ genre, language }).countDocuments()
      const result = await Book.find({ genre, language }).sort({ createdAt: -1 }).populate('language').populate('genre').skip(skip).limit(limit)
      return sendResponse(200, true, { totalDocs, result }, res)
    }
    if (genre) {
      const totalDocs = await Book.find({ genre }).countDocuments()
      const result = await Book.find({ genre }).sort({ createdAt: -1 }).populate('language').populate('genre').skip(skip).limit(limit)
      return sendResponse(200, true, { totalDocs, result }, res)
    }
    if (language) {
      const totalDocs = await Book.find({ language }).countDocuments()
      const result = await Book.find({ language }).sort({ createdAt: -1 }).populate('language').populate('genre').skip(skip).limit(limit)
      return sendResponse(200, true, { totalDocs, result }, res)
    }

    const totalDocs = await Book.countDocuments()
    const result = await Book.find().sort({ createdAt: -1 }).populate('language').populate('genre').skip(skip).limit(limit)
    sendResponse(200, true, { totalDocs, result }, res)

  } catch (e) {
    console.log(e);
    sendResponse(400, false, e.message, res)
  }
};

export const getAllBooksApproved = async (req, res, next) => {
  try {
    const { language, genre, skip, limit } = req.query

    if (genre && language) {
      const totalDocs = await Book.find({ genre, language }).where('approved').equals(true).countDocuments()
      const result = await Book.find({ genre, language }).where('approved').equals(true).sort({ createdAt: -1 }).populate('language').populate('genre').skip(skip).limit(limit)
      return sendResponse(200, true, { totalDocs, result }, res)
    }
    if (genre) {
      const totalDocs = await Book.find({ genre }).where('approved').equals(true).countDocuments()
      const result = await Book.find({ genre }).where('approved').equals(true).sort({ createdAt: -1 }).populate('language').populate('genre').skip(skip).limit(limit)
      return sendResponse(200, true, { totalDocs, result }, res)
    }
    if (language) {
      const totalDocs = await Book.find({ language }).where('approved').equals(true).countDocuments()
      const result = await Book.find({ language }).where('approved').equals(true).sort({ createdAt: -1 }).populate('language').populate('genre').skip(skip).limit(limit)
      return sendResponse(200, true, { totalDocs, result }, res)
    }

    const totalDocs = await Book.countDocuments()
    const result = await Book.find().sort({ createdAt: -1 }).where('approved').equals(true).populate('language').populate('genre').skip(skip).limit(limit)
    sendResponse(200, true, { totalDocs, result }, res)

  } catch (e) {
    console.log(e);
    sendResponse(400, false, e.message, res)
  }
};

export const getSingleBookApproved = async (req, res, next) => {
  try {
    const book = await Book.findById(req.params.id).where('approved').equals(true).populate('language').populate('genre');
    if (!book) {
      return sendResponse(400, false, `Book does not exist with Id: ${req.params.id}`, res)
    }
    sendResponse(200, true, book, res)
  } catch (e) {
    console.log(e);
    sendResponse(400, false, e.message, res)
  }
};

export const getSingleBook = async (req, res, next) => {
  try {
    const book = await Book.findById(req.params.id).populate('language').populate('genre');
    if (!book) {
      return sendResponse(400, false, `Book does not exist with Id: ${req.params.id}`, res)
    }
    sendResponse(200, true, book, res)
  } catch (e) {
    console.log(e);
    sendResponse(400, false, e.message, res)
  }
};

export const addBook = async (req, res, next) => {
  try {
    const { uniqueId, bookName, genre, language, author, description, rentPerDay, uploadedBy } = req.body;
    const { image1, image2, image3, image4 } = req.files

    var payloadObj = {
      _id: uniqueId,
      bookName,
      genre,
      language,
      author,
      description,
      rentPerDay,
      uploadedBy,
    }

    await cloudinary.v2.uploader.upload(image1[0].path, {
      folder: "book/",
    }).then((result1) => {
      payloadObj.image1 = {
        public_id: result1.public_id,
        url: result1.url,
      }
    })

    if (image2) {
      await cloudinary.v2.uploader.upload(image2[0].path, {
        folder: "book/",
      }).then((result2) => {
        payloadObj.image2 = {
          public_id: result2.public_id,
          url: result2.url,
        }
      })
    }
    if (image3) {
      await cloudinary.v2.uploader.upload(image3[0].path, {
        folder: "book/",
      }).then((result3) => {
        payloadObj.image3 = {
          public_id: result3.public_id,
          url: result3.url,
        }
      })
    }
    if (image4) {
      await cloudinary.v2.uploader.upload(image4[0].path, {
        folder: "book/",
      }).then((result4) => {
        payloadObj.image4 = {
          public_id: result4.public_id,
          url: result4.url,
        }
      })
    }
    mediaDel()
    const newBook = await Book.create(payloadObj)

    const user = await User.findById(uploadedBy)
    user.booksAdded.push(newBook._id)
    await user.save();

    const result = await Book.findById(uniqueId).populate('genre language')

    sendResponse(201, true, result, res)

  } catch (e) {
    console.log(e);
    sendResponse(400, false, e.message, res)
  }
};

export const updateBook = async (req, res, next) => {
  try {
    const { bookName, genre, language, author, description, rentPerDay } = req.body;

    const newBookData = {
      bookName,
      genre,
      language,
      author,
      description,
      rentPerDay,
    };

    await Book.findByIdAndUpdate(req.params.id, newBookData);
    sendResponse(200, true, 'Updated Successfully', res)
  } catch (e) {
    if (e.code) {
      return sendResponse(400, false, `${Object.keys(e.keyValue)} Already in use`, res)
    }
    sendResponse(400, false, e, res)
  }
};

export const updateBookApproved = async (req, res, next) => {
  try {
    const userId = req.authTokenData.id;
    const { bookName, genre, language, author, description, rentPerDay } = req.body;

    const newBookData = {
      bookName,
      genre,
      language,
      author,
      description,
      rentPerDay,
    };

    await Book.findByIdAndUpdate(userId, newBookData).where('approved').equals(true);
    sendResponse(200, true, 'Updated Successfully', res)
  } catch (e) {
    if (e.code) {
      return sendResponse(400, false, `${Object.keys(e.keyValue)} Already in use`, res)
    }
    sendResponse(400, false, e, res)
  }
};

export const updateBookStatus = async (req, res, next) => {
  try {
    const TrueStatus = {
      approved: 'true'
    };
    const FalseStatus = {
      approved: 'false'
    };
    const book = await Book.findById(req.body.id);
    if (book.approved) {
      await Book.updateOne({ _id: mongoose.mongo.ObjectId(req.body.id) }, FalseStatus);
    } else {
      await Book.updateOne({ _id: mongoose.mongo.ObjectId(req.body.id) }, TrueStatus);
    }
    sendResponse(200, true, 'Book Status Updated', res)
  } catch (e) {
    sendResponse(400, false, e.message, res)
  }
};

export const deleteSingleBookApproved = async (req, res, next) => {
  try {
    const userId = req.authTokenData.id;
    const bookId = req.params.id

    const book = await Book.findById(bookId);

    await cloudinary.v2.uploader.destroy(book.image1.public_id)
    if (book.image2) {
      await cloudinary.v2.uploader.destroy(book.image2.public_id)
    }
    if (book.image3) {
      await cloudinary.v2.uploader.destroy(book.image3.public_id)
    }
    if (book.image4) {
      await cloudinary.v2.uploader.destroy(book.image4.public_id)
    }
    await Book.deleteOne({ _id: bookId });
    const user = await User.findById(userId);
    user.booksAdded.pull({ _id: bookId });
    await user.save();

    sendResponse(201, true, 'Book deleted', res)
  } catch (e) {
    console.log(e);
    sendResponse(400, false, e.message, res)
  }
}

export const deleteSingleBook = async (req, res, next) => {
  try {
    const userId = req.params.uploadedBy;
    const bookId = req.params.bookId;

    const book = await Book.findById(bookId);

    await cloudinary.v2.uploader.destroy(book.image1.public_id)
    if (book.image2) {
      await cloudinary.v2.uploader.destroy(book.image2.public_id)
    }
    if (book.image3) {
      await cloudinary.v2.uploader.destroy(book.image3.public_id)
    }
    if (book.image4) {
      await cloudinary.v2.uploader.destroy(book.image4.public_id)
    }

    await Book.deleteOne({ _id: bookId });
    const user = await User.findById(userId);
    user.booksAdded.pull({ _id: bookId });
    await user.save();

    sendResponse(201, true, 'Book deleted', res)
  } catch (e) {
    console.log(e);
    sendResponse(400, false, e.message, res)
  }
}