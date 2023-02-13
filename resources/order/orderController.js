import Order from "./orderModel.js"
import { sendResponse } from "../../util/sendResponse.js";

export const getAllOrders = async (req, res, next) => {
  try {
    const { skip, limit } = req.query
    const totalDocs = await Order.countDocuments();
    const result = await Order.find().skip(skip).limit(limit)
    sendResponse(200, true, { totalDocs, result }, res)
  } catch (e) {
    console.log(e);
    sendResponse(400, false, e.message, res)
  }
};

export const getOrderById = async (req, res, next) => {
  try {
    const order = await Order.findById(req.params.id);
    if (!order) {
      return sendResponse(400, false, `order does not exist with Id: ${req.params.id}`, res)
    }
    sendResponse(200, true, order, res)
  } catch (e) {
    console.log(e);
    sendResponse(400, false, e.message, res)
  }
};

export const addOrder = async (req, res, next) => {
  try {
    const { uniqueId, address, itemId,paymentMode } = req.body

    const exist = await Order.findById(uniqueId).countDocuments();
    if (exist) {
      return sendResponse(409, false, 'order already exist', res)
    }

    const payloadObj = {
      _id: uniqueId,
      address,
      paymentMode,
    }

    const result = await Order.create(payloadObj)
    sendResponse(201, true, result, res)
  } catch (e) {
    console.log(e)
    sendResponse(400, false, e.message, res)
  }
};


export const updateorder = async (req, res, next) => {
  try {
    const { order } = req.body;
    const exist = await order.findOne({ order: order }).countDocuments();
    if (exist) {
      return sendResponse(401, false, 'order already exist', res)
    }
    const neworderData = {
      order,
    };
    await order.findByIdAndUpdate(req.params.id, neworderData);
    sendResponse(200, true, 'Updated Successfully', res)
  } catch (e) {
    sendResponse(400, false, e, res)
  }
};

export const deleteSingleorder = async (req, res, next) => {
  try {
    await order.deleteOne({ _id: req.params.id })
    sendResponse(201, true, 'order deleted', res)
  } catch (e) {
    sendResponse(400, false, e.message, res)
  }
}