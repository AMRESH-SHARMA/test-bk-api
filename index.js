// packages
import express from "express";
import expressListRoutes from "express-list-routes";
import mongoose from "mongoose";
import { config } from "dotenv";
import cors from "cors";
import { connectDatabase } from "./util/db.js";

config();
const app = express()
const PORT = process.env.PORT || 8080;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());

//endpoint shows Server Running
app.get("/", (req, res) => {
  res.json(`Server Connected to DB and Running : ${new Date().toLocaleString()}`);
});

//endpoint To generate uid
app.get("/getUid", (req, res) => {
  try {
    const newId = new mongoose.Types.ObjectId();
    res.status(200).json({ success: true, msg: { _id: newId } });
  } catch (err) {
    return res.status(500).json({ success: false, msg: "Unable to get ID." });
  }
});

// ****************************************************************************************************

// ADMIN API

//Admin
import adminRoute from "./resources/admin/adminRoute.js";
app.use("/", adminRoute);

//User
import userRoute from "./resources/user/userRoute.js";
app.use("/", userRoute);

//User ADDRESS
import userAddressRoute from "./resources/userAddress/userAddressRoute.js";
app.use("/", userAddressRoute);

//Book
import bookRoute from "./resources/book/bookRoute.js";
app.use("/", bookRoute);

//Genre
import genreRoute from "./resources/genre/genreRoute.js";
app.use("/", genreRoute);

//Language
import languageRoute from "./resources/language/languageRoute.js";
app.use("/", languageRoute);

//Logos
import logosRoute from "./resources/logos/logosRoute.js";
app.use("/", logosRoute);

//Address
import addressRoute from "./resources/address/addressRoute.js";
app.use("/", addressRoute);

// Social Media
import socialMediaRoute from "./resources/socialMedia/socialMediaRoute.js";
app.use("/", socialMediaRoute);

// State
import stateRoute from "./resources/state/stateRoute.js";
app.use("/", stateRoute);

// CITY
import cityRoute from "./resources/city/cityRoute.js";
app.use("/", cityRoute);

// InternetHandlingFees
import internetHandlingFeesRoute from "./resources/internetHandlingFees/internetHandlingFeesRoute.js";
app.use("/", internetHandlingFeesRoute);

// Delivery Fees
import deliveryFeesRoute from "./resources/deliveryFees/deliveryFeesRoute.js";
app.use("/", deliveryFeesRoute);

// Service Fees
import serviceFeesRoute from "./resources/serviceFees/serviceFeesRoute.js";
app.use("/", serviceFeesRoute);

//Order
import orderRoute from "./resources/order/orderRoute.js";
app.use("/", orderRoute);


// ****************************************************************************************************

// CLIENT API

//User
import user_ClientRoute from "./resources/user/user_ClientRoute.js";
app.use("/client", user_ClientRoute);


//User ADDRESS
import userAddress_ClientRoute from "./resources/userAddress/userAddress_ClientRoute.js";
app.use("/client", userAddress_ClientRoute);

//Book
import book_ClientRoute from "./resources/book/book_ClientRoute.js";
app.use("/client", book_ClientRoute);

//Order
import order_ClientRoute from "./resources/order/order_ClientRoute.js";
app.use("/client", order_ClientRoute);

// Connect to the database before listening
connectDatabase().then(() => {
  app.listen(PORT, () => {
    console.log(`Listening on port ${PORT}...`);
  })
  expressListRoutes(app);
})