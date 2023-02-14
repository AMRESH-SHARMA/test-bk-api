import Order from "./orderModel.js"
import { equalsIgnoringCase } from "../../util/others.js"
import DeliveryFees from "../deliveryFees/deliveryFeesModel.js"
import ServiceFees from "../serviceFees/serviceFeesModel.js"
import UserAddress from "../userAddress/userAddressModel.js"
import InternetHandlingFees from "../internetHandlingFees/internetHandlingFeesModel.js"
import { sendResponse } from "../../util/sendResponse.js";
import User from "../user/userModel.js";

export const getAllOrders = async (req, res, next) => {
  try {
    const { skip, limit, status } = req.query
    const totalDocs = await Order.countDocuments();
    const result = await Order.find({ serviceFees: "1" }).skip(skip).limit(limit);
    sendResponse(200, true, { totalDocs, result }, res);
  } catch (e) {
    console.log(e);
    sendResponse(400, false, e.message, res)
  }
};

export const getOrdersByUserId = async (req, res, next) => {
  try {
    const userId = req.authTokenData.id;
    const { skip, limit } = req.query
    const totalDocs = await Order.countDocuments();
    const result = await User.findById(userId).select('order').populate('order').skip(skip).limit(limit)
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
    const userId = req.authTokenData.id;
    // const userId = "63e11509075a28576731a353";
    const { uniqueId, addressId, paymentMode } = req.body

    const exist = await Order.findById(uniqueId).countDocuments();
    if (exist) {
      return sendResponse(409, false, 'order already exist', res)
    }

    let cartData = await User.findById(userId).select("cart").populate({ path: 'cart.itemId' });
    let address = await UserAddress.findById(addressId);
    const internetHandlingFees = await InternetHandlingFees.find();
    
    let df = await DeliveryFees.find().populate('state city');
    let dfResult = ""
    df.map((item) => {
      if (equalsIgnoringCase(item.state.state, address.state) && equalsIgnoringCase(item.city.city, address.city)) {
        dfResult = item.fees
      }
    })

    let sf = await ServiceFees.find().populate('state city');
    let sfResult = ""
    sf.map((item) => {
      if (equalsIgnoringCase(item.state.state, address.state) && equalsIgnoringCase(item.city.city, address.city)) {
        sfResult = item.fees
      }
    })


    let items = [];
    let totalAmountBeforeCharges = 0;

    cartData.cart.forEach(el => {
      let feed = {};
      feed.itemId = el.itemId._id;
      feed.noOfDays = el.noOfDays;
      feed.rentPerDay = el.itemId.rentPerDay;
      feed.amount = el.itemId.rentPerDay * el.noOfDays;
      totalAmountBeforeCharges += feed.amount;
      items.push(feed);
    });

    const payloadObj = {
      _id: uniqueId,
      address,
      items,
      paymentMode,
      internetHandlingFees: internetHandlingFees[0].fees,
      deliveryFees: dfResult,
      serviceFees: sfResult,
      totalAmountBeforeCharges,
      totalAmountAfterCharges: totalAmountBeforeCharges + internetHandlingFees[0].fees + dfResult + sfResult,
    }

    const newOrder = await Order.create(payloadObj);
    let user = await User.findById(userId);
    user.order.push(newOrder._id)
    await user.save();
    sendResponse(201, true, "order placed", res)
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