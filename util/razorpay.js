import Razorpay from "razorpay";
import { SECRETS } from "./config.js";
import crypto from "crypto";

export const instance = new Razorpay({
  key_id: SECRETS.razorpay_key_id,
  key_secret: SECRETS.razorpay_key_secret,
});

export const verifyPayment = (params) => {

  const { orderId, paymentId, signature } = params;
  const body = orderId + "|" + paymentId;

  var expectedSignature = crypto.createHmac('sha256', SECRETS.razorpay_key_secret)
    .update(body.toString())
    .digest('hex');
  console.log("sig received ", signature);
  console.log("sig generated ", expectedSignature);
  if (expectedSignature === signature) {
    return true;
  } else return false;
}