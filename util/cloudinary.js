import cloudinary from "cloudinary"
import { SECRETS } from "./config.js";

cloudinary.v2.config({
  cloud_name: SECRETS.cloud_name,
  api_key: SECRETS.api_key,
  api_secret: SECRETS.api_secret,
});
export default cloudinary;