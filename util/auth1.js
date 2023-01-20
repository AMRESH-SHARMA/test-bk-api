import { newToken, verifyToken } from "./jwt.js";

const signup = async (req, res, next) => {
  const Model = req.model;
  if (!req.body.email || !req.body.password) {
    return res.status(400).send({
      message: "Required fields missing",
    });
  }
  if (req.body.userType === "admin")
    return res.status(400).send({
      message: "You are not authorised to create admin user",
    });
  const user = await Model.findOne({ email: req.body.email });
  if (user) {
    return res
      .status(200)
      .send({ status: "failed", message: "Mobile No is already in use" });
  } else {
    try {
      const user = await Model.create({
        ...req.body,
        otp,
        approved: true,
        active: true,
      });
      const userfound = await Model.findOne({ email: req.body.email }).select(
        "name mobile -password"
      );
      const token = newToken(user);
      return res
        .status(201)
        .send({ status: "ok", data: userfound, token: token });
    } catch (e) {
      console.log(e.message);
    }
    return res.status(400).send({ status: "Error Communicating with server" });
  }
};

const signin = async (req, res) => {
  const Model = req.model;

  if (!req.body.email || !req.body.password)
    return res.status(400).send({ message: "Mobile and password required" });
  const user = await Model.findOne({ mobile: req.body.mobile }).exec();
  if (!user) {
    return res
      .status(200)
      .send({ status: "failed", message: "Mobile No not registered" });
  }
  if (user.active === "false") {
    if (user.loginAttempts > 4)
      return res.status(200).send({
        status: "failed",
        message: "Your account is blocked, try after few minutes.",
      });
    return res.status(200).send({
      status: "failed",
      message: "Account is suspended.Please contact admin.",
    });
  }

  try {
    const match = await user.checkPassword(req.body.password);
    if (!match) {
      if (user.loginAttempts === 4) {
        await Model.findOneAndUpdate(
          { mobile: req.body.mobile },
          {
            active: false,
            $inc: { loginAttempts: 1 },
          }
        );
        setTimeout(async () => {
          await Model.findOneAndUpdate(
            { mobile: req.body.mobile },
            {
              active: true,

              loginAttempts: 0,
            }
          );
        }, 300000);
        return res.status(200).send({
          status: "failed",
          message:
            "You had 5 unsuccessful login attempts, try after 5 minutes.",
        });
      }
      return res
        .status(200)
        .send({ status: "failed", message: "Invalid Password" });
    }
    const userfound = await Model.findOne({ mobile: req.body.mobile }).select(
      "name mobile district"
    );
    const token = newToken(user);

    return res
      .status(201)
      .send({ status: "ok", userData: userfound, token: token });
  } catch (e) {
    console.log(e);
    return res.status(401).send({ message: "Not Authorized" });
  }
};

const protect = async (req, res, next) => {
  const Model = req.model;
  if (!req.headers.authorization) {
    return res.status(401).send({ message: "User not authorized" });
  }
  let token = req.headers.authorization.split("Bearer ")[1];
  if (!token) {
    return res.status(401).send({ message: "Token not found" });
  }
  try {
    const payload = await verifyToken(token);
    console.log(payload);
    const user = await Model.findById(payload.id)
      .select("-password")
      .lean()
      .exec();
    req.user = user;
    next();
  } catch (e) {
    console.log(e);
    return res.status(401).end();
  }
};
const adminProtect = async (req, res, next) => {
  const Model = req.model;

  if (!req.headers.authorization) {
    return res.status(401).send({ message: "User not authorized" });
  }
  let token = req.headers.authorization.split("Bearer ")[1];
  if (!token) {
    return res.status(401).send({ message: "Token not found" });
  }
  try {
    const payload = await verifyToken(token);
    console.log(payload);
    const user = await Model.findById(payload.id)
      .select("-password")
      .lean()
      .exec();
    if (user.active === false)
      return res.status(401).send({ message: "Your Account is suspended" });
    req.user = user;
    next();
  } catch (e) {
    console.log(e);
    return res.status(401).send({ message: "Not Authorized" });
  }
};

const adminSignin = async (req, res) => {
  const Model = req.model;

  if (!req.body.email || !req.body.password)
    return res.status(400).send({ message: "Email and password required" });
  const user = await Model.findOne({ email: req.body.email }).exec();

  if (!user) {
    return res.status(400).send({ message: "Email not registered" });
  }

  if (!user.active) {
    return res.status(400).send({ message: "Your account is suspended!" });
  }

  try {
    const match = await user.checkPassword(req.body.password);

    if (!match) {
      return res.status(401).send({ message: "Invalid Email or Password" });
    }

    const token = newToken(user);

    return res.status(201).send({
      status: "ok",
      token: token,
      user: { userType: user.userType, permissions: user.permissions },
    });
  } catch (e) {
    console.log(e);
    return res.status(401).send({ message: "Not Authorized" });
  }
};

const employerSignUp = async (req, res, next) => {
  const Model = req.model;
  if (!req.body.email || !req.body.password) {
    return res.status(400).send({
      message: "Required fields missing",
    });
  }
  const user = await Model.findOne({ email: req.body.email });
  if (user)
    return res
      .status(200)
      .send({ status: "failed", message: "Email is already in use" });
  else {
    try {
      const user = await Model.create({ ...req.body, approved: true });
      //  send_email("Pop_Employer_Credentials", req.body);
      return res.status(201).send({ status: "ok", data: user });
    } catch (e) {
      console.log(e);
      return res
        .status(400)
        .send({ status: "Error Communicating with server" });
    }
  }
};

export { signup, signin, protect, adminSignin, adminProtect, employerSignUp };
