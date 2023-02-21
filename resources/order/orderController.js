import Order from "./orderModel.js"
import Book from "../book/bookModel.js"
import DeliveryFees from "../deliveryFees/deliveryFeesModel.js"
import ServiceFees from "../serviceFees/serviceFeesModel.js"
import UserAddress from "../userAddress/userAddressModel.js"
import InternetHandlingFees from "../internetHandlingFees/internetHandlingFeesModel.js"
import User from "../user/userModel.js";
import { sendResponse } from "../../util/sendResponse.js";
import { equalsIgnoringCase } from "../../util/others.js";
import { verifyPayment } from '../../util/razorpay.js'
import { SECRETS } from "../../util/config.js"

export const getNewOrders = async (req, res, next) => {
  try {
    const { skip, limit, status } = req.query
    const totalDocs = await Order.countDocuments();
    const userOrder = await Order.find({ status: status }).skip(skip).limit(limit);
    sendResponse(200, true, { totalDocs, userOrder }, res);
  } catch (e) {
    console.log(e);
    sendResponse(400, false, e.message, res)
  }
};

export const getOrderById = async (req, res, next) => {
  try {
    const order = await Order.findById(req.params.id).populate({
      path: 'items',
      populate: { path: 'itemId' }
    });
    if (!order) {
      return sendResponse(400, false, `order does not exist with Id: ${req.params.id}`, res)
    }
    sendResponse(200, true, order, res)
  } catch (e) {
    console.log(e);
    sendResponse(400, false, e.message, res)
  }
};


// **********************************************************CLIENT CONTROLLER

export const getOrdersByUserId = async (req, res, next) => {
  try {
    const userId = req.authTokenData.id;
    const { skip, limit } = req.query;
    const totalDocs = await Order.countDocuments();
    const userOrder = await User.findById(userId).select('order').populate('order').skip(skip).limit(limit);

    let orders = [];

    userOrder.order.forEach(el => {
      let feed = {};
      feed.address = el.address;
      feed.items = el.items;
      feed.info = {
        "internetHandlingFees": el.internetHandlingFees,
        "deliveryFees": el.deliveryFees,
        "serviceFees": el.serviceFees,
        "totalAmountBeforeCharges": el.totalAmountBeforeCharges,
        "totalAmountAfterCharges": el.totalAmountAfterCharges,
        "status": el.status,
        "createdAt": el.createdAt,
        "updatedAt": el.updatedAt,
        "razorpayOrderId": el.razorpayOrderId,
        "razorpayPaymentId": el.razorpayPaymentId,
        "razorpaySignature": el.razorpaySignature,
      }
      orders.push(feed);
    });

    sendResponse(200, true, { totalDocs, result: orders }, res);
  } catch (e) {
    console.log(e);
    sendResponse(400, false, e.message, res)
  }
};

export const orderCart = async (req, res, next) => {
  try {
    const userId = req.authTokenData.id;
    const { addressId, paymentId, orderId, signature } = req.body;

    let cartData = await User.findById(userId).select("cart").populate({ path: 'cart.itemId' });
    let address = await UserAddress.findById(addressId);
    const internetHandlingFees = await InternetHandlingFees.find();

    let df = await DeliveryFees.find().populate('state city');
    let dfuserOrder = ""
    df.map((item) => {
      if (equalsIgnoringCase(item.state.state, address.state) && equalsIgnoringCase(item.city.city, address.city)) {
        dfuserOrder = item.fees
      }
    })

    let sf = await ServiceFees.find().populate('state city');
    let sfuserOrder = ""
    sf.map((item) => {
      if (equalsIgnoringCase(item.state.state, address.state) && equalsIgnoringCase(item.city.city, address.city)) {
        sfuserOrder = item.fees
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

    const currentDate = new Date();
    const payloadObj = {
      address,
      items,
      internetHandlingFees: internetHandlingFees[0].fees,
      deliveryFees: dfuserOrder,
      serviceFees: sfuserOrder,
      totalAmountBeforeCharges,
      totalAmountAfterCharges: totalAmountBeforeCharges + internetHandlingFees[0].fees + dfuserOrder + sfuserOrder,
      statusTimeline: { new: currentDate },
      razorpayOrderId: orderId,
      razorpayPaymentId: paymentId,
      razorpaySignature: signature,
    }

    const newOrder = await Order.create(payloadObj);
    let user = await User.findById(userId);
    user.order.push(newOrder._id)
    await user.save();

    // Verify payment status
    let verifyPaymentInput = {};
    verifyPaymentInput = { orderId, paymentId, signature }
    console.log(verifyPayment(verifyPaymentInput))
    if (verifyPayment(verifyPaymentInput)) {
      await Order.findByIdAndUpdate(newOrder._id, { paymentStatus: 'success' })
    } else {
      await Order.findByIdAndUpdate(newOrder._id, { paymentStatus: 'failed' })
      return sendResponse(400, true, "order failed", res)
    }

    // make  book availability to false for other users
    cartData.cart.forEach(async el => {
      console.log(el.itemId._id);
      await Book.findByIdAndUpdate(el.itemId._id, { availability: false });
    });
    return sendResponse(201, true, "order placed", res)

  } catch (e) {
    console.log(e)
    sendResponse(400, false, e.message, res)
  }
};

export const generateOrderBill = async (req, res, next) => {
  try {
    const userId = req.authTokenData.id;
    const { addressId } = req.body

    let cartData = await User.findById(userId).select("cart").populate({ path: 'cart.itemId' });
    let address = await UserAddress.findById(addressId);
    const internetHandlingFees = await InternetHandlingFees.find();

    let df = await DeliveryFees.find().populate('state city');
    let dfuserOrder = ""
    df.map((item) => {
      if (equalsIgnoringCase(item.state.state, address.state) && equalsIgnoringCase(item.city.city, address.city)) {
        dfuserOrder = item.fees
      }
    })

    let sf = await ServiceFees.find().populate('state city');
    let sfuserOrder = ""
    sf.map((item) => {
      if (equalsIgnoringCase(item.state.state, address.state) && equalsIgnoringCase(item.city.city, address.city)) {
        sfuserOrder = item.fees
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
      address,
      items,
      total: {
        internetHandlingFees: internetHandlingFees[0].fees,
        deliveryFees: dfuserOrder,
        serviceFees: sfuserOrder,
        totalAmountBeforeCharges,
        totalAmountAfterCharges: totalAmountBeforeCharges + internetHandlingFees[0].fees + dfuserOrder + sfuserOrder,
      }
    }

    return sendResponse(201, true, payloadObj, res);
  } catch (e) {
    console.log(e)
    sendResponse(400, false, e.message, res)
  }
};

export const orderSingleItem = async (req, res, next) => {
  try {
    const userId = req.authTokenData.id;
    const { addressId, itemId, noOfDays, paymentId, orderId, signature, errorCode, errorDescription } = req.body;

    let book = await Book.findById(itemId);
    let address = await UserAddress.findById(addressId);
    const internetHandlingFees = await InternetHandlingFees.find();

    let df = await DeliveryFees.find().populate('state city');
    let dfuserOrder = ""
    df.map((item) => {
      if (equalsIgnoringCase(item.state.state, address.state) && equalsIgnoringCase(item.city.city, address.city)) {
        dfuserOrder = item.fees
      }
    })

    let sf = await ServiceFees.find().populate('state city');
    let sfuserOrder = ""
    sf.map((item) => {
      if (equalsIgnoringCase(item.state.state, address.state) && equalsIgnoringCase(item.city.city, address.city)) {
        sfuserOrder = item.fees
      }
    })

    let items = [];
    let totalAmountBeforeCharges = 0;

    let feed = {};
    feed.itemId = itemId;
    feed.noOfDays = noOfDays;
    feed.rentPerDay = book.rentPerDay;
    feed.amount = feed.rentPerDay * noOfDays;
    totalAmountBeforeCharges += feed.amount;
    items.push(feed);

    const currentDate = new Date();
    const payloadObj = {
      address,
      items,
      internetHandlingFees: internetHandlingFees[0].fees,
      deliveryFees: dfuserOrder,
      serviceFees: sfuserOrder,
      totalAmountBeforeCharges,
      totalAmountAfterCharges: totalAmountBeforeCharges + internetHandlingFees[0].fees + dfuserOrder + sfuserOrder,
      statusTimeline: { new: currentDate },
      razorpayOrderId: orderId,
      razorpayPaymentId: paymentId,
      razorpaySignature: signature,
    }

    const newOrder = await Order.create(payloadObj);
    let user = await User.findById(userId);
    user.order.push(newOrder._id)
    await user.save();

    let verifyPaymentInput = {};
    verifyPaymentInput = { orderId, paymentId, signature }
    console.log(verifyPayment(verifyPaymentInput))
    if (verifyPayment(verifyPaymentInput)) {
      await Order.findByIdAndUpdate(newOrder._id, { paymentStatus: 'success' })
      return sendResponse(201, true, "order placed", res)
    } else {
      verifyPaymentInput = { orderId }
      await Order.findByIdAndUpdate(newOrder._id, { paymentStatus: 'failed' })
      return sendResponse(400, true, "order failed", res)
    }
  } catch (e) {
    console.log(e)
    sendResponse(400, false, e.message, res)
  }
};

export const generateSingleOrderBill = async (req, res, next) => {
  try {
    const userId = req.authTokenData.id;
    const { addressId, itemId, noOfDays } = req.body
    if (parseInt(noOfDays) < 3) return sendResponse(400, true, 'minimum days should be 3', res)
    let book = await Book.findById(itemId);
    let address = await UserAddress.findById(addressId);
    const internetHandlingFees = await InternetHandlingFees.find();

    let df = await DeliveryFees.find().populate('state city');
    let dfuserOrder = ""
    df.map((item) => {
      if (equalsIgnoringCase(item.state.state, address.state) && equalsIgnoringCase(item.city.city, address.city)) {
        dfuserOrder = item.fees
      }
    })

    let sf = await ServiceFees.find().populate('state city');
    let sfuserOrder = ""
    sf.map((item) => {
      if (equalsIgnoringCase(item.state.state, address.state) && equalsIgnoringCase(item.city.city, address.city)) {
        sfuserOrder = item.fees
      }
    })


    let items = [];
    let totalAmountBeforeCharges = 0;

    let feed = {};
    feed.itemId = itemId;
    feed.noOfDays = noOfDays;
    feed.rentPerDay = book.rentPerDay;
    feed.amount = feed.rentPerDay * noOfDays;
    totalAmountBeforeCharges += feed.amount;
    items.push(feed);

    const payloadObj = {
      address,
      items,
      total: {
        internetHandlingFees: internetHandlingFees[0].fees,
        deliveryFees: dfuserOrder,
        serviceFees: sfuserOrder,
        totalAmountBeforeCharges,
        totalAmountAfterCharges: totalAmountBeforeCharges + internetHandlingFees[0].fees + dfuserOrder + sfuserOrder,
      }
    }

    return sendResponse(201, true, payloadObj, res);
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