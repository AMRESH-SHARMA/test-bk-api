import { config } from "dotenv";
config();

export const SECRETS = {
  jwt: process.env.JWT_SECRET,
  jwtExp: "1y",
  node_env: process.env.NODE_ENV,

  cloud_name: process.env.Cloudinary_CLOUD_NAME,
  api_key: process.env.Cloudinary_API_KEY,
  api_secret: process.env.Cloudinary_API_SECRET,

  razorpay_key_id: process.env.Razorpay_KEY_ID,
  razorpay_key_secret: process.env.Razorpay_KEY_SECRET,
  // spacesEndpoint: process.env.DO_SPACES_ENDPOINT,
  // spacesAcessKey: process.env.DO_SPACES_ACCESS_KEY,
  // spacesSecretKey: process.env.DO_SPACES_SECRET_KEY,
  // region: process.env.COGNITO_REGION,
  // aws_accessKey_Id: process.env.AWS_ACCESS_KEY_ID,
  // aws_secret_key_Id: process.env.AWS_SECRET_ACCESS_KEY,
  // region: process.env.AWS_REGION,
  sendGrid: process.env.SEND_GRID,
  senderEmail: process.env.SENDER_EMAIL,
};
