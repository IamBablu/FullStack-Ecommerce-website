import { AsyncHandler } from "../utils/AsyncHandler.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { ApiError } from "../utils/ApiError.js";
import { uploadCloudinary } from "../utils/Cloudinary.js";
import transporter from "../utils/EmailTransporter.js";

import { User } from "../models/user.model.js";

import jwt from "jsonwebtoken";
import mongoose from "mongoose";

const generateAccessAndRefreshToken = async (userId) => {
  try {
    if (!userId) return new ApiError(400, "user Id is missing");
    const user = await User.findById(userId);
    if (!user) return new ApiError(401, "user not found!");
    const accessToken = await user.generateAccessToken();
    const refreshToken = await user.generateRefreshToken();

    user.refreshToken = refreshToken;
    await user.save({ validateBeforeSave: false });

    return { accessToken, refreshToken };
  } catch (error) {
    throw new ApiError(
      500,
      "Something went wrong while generating Access and Refresh Token!",
    );
  }
};

const option = {
  httpOnly: true,
  secure: true,
  sameSite: "None",
};
const otpStore = {};

const sendOtp = AsyncHandler(async (req, res) => {
  const { email } = req.body;
  if (!email) throw new ApiError(402, "Email is required");
  const existUser = await User.findOne({ email });
  if (existUser) throw new ApiError(401, "User already exists!");
  const otp = Math.floor(100000 + Math.random() * 900000).toString();
  const expiryAt = Date.now() + 5 * 60 * 1000;
  otpStore[email] = { otp, expiryAt };
  // const transporter = transporter();
  transporter.sendMail({
    from: `MyCart.com <${process.env.EMAIL_USER}>`,
    to: email,
    subject: "Your registration otp",
    text: `Your OTP for registration is ${otp}. It will expire in 5 minutes.`,
    html: `<h3>Registration Verification</h3><p>Your OTP is <b>${otp}</b>. It will expire in 5 minutes.</p>`,
  });
  res.status(200).json(new ApiResponse(200, "Otp send successfully"));
});

const createUser = AsyncHandler(async (req, res) => {
  const {
    username,
    email,
    otp,
    fullName,
    password,
    role,
    shopName,
    shopAddress,
    gstNumber,
  } = req.body;

  if (
    [username, email, fullName, password, otp].some(
      (field) => field?.trim() === "",
    )
  ) {
    throw new ApiError(400, "All Fields are required");
  }

  //for otp verification
  const record = otpStore[email];
  if (!record)
    throw new ApiError(400, "Otp not found, please request new one.");

  if (Date.now() > record.expiryAt) {
    delete otpStore[email];
    throw new ApiError(409, "Otp has expired");
  }

  if (record.otp !== otp) throw new ApiError(409, "Invalid Otp");

  // if already admin exist we not allow anyone to change his role as Admin
  if (role == "Admin") {
    const user = await User.findOne({ role: "Admin" });
    if (user) throw new ApiError(500, "Admin Already Exist!");
  }

  const existUser = await User.findOne({
    $or: [{ username }, { email }],
  });
  if (existUser) {
    throw new ApiError(
      409,
      "User already exist with this username or email Id",
    );
  }

  const user = await User.create({
    username: username.toLowerCase(),
    email,
    password,
    fullName,
    role,
    shopName,
    shopAddress,
    gstNumber,
    requestedAt: new Date(),
  });

  const { accessToken, refreshToken } = await generateAccessAndRefreshToken(
    user._id,
  );
  const createdUser = await User.findById(user._id).select(
    "-password -refreshToken",
  );

  if (!createdUser) {
    throw new ApiError(500, "Something went wrong while registering the user");
  }
  return res
    .status(200)
    .cookie("accessToken", accessToken, {
      ...option,
      maxAge: 24 * 60 * 60 * 1000,
    })
    .cookie("refreshToken", refreshToken, {
      ...option,
      maxAge: 480 * 60 * 60 * 1000,
    })
    .json(new ApiResponse(200, createdUser, "User register successfully"));
});

const loginUser = AsyncHandler(async (req, res) => {
  let { username, email, password, loginKey } = req.body;

  if (!(username || email || loginKey)) {
    throw new ApiError(402, "username or email is required");
  }
  if (loginKey) {
    const isEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(loginKey);
    if (isEmail) {
      email = loginKey;
    } else username = loginKey;
  }
  const user = await User.findOne({
    $or: [{ username: username }, { email: email }],
  });
  if (!user) throw new ApiError(400, "user does not exist!");
  const isPasswordValidate = await user.isPasswordCorrect(password);
  if (!isPasswordValidate) throw new ApiError(409, "Invalid user credentials");

  const { accessToken, refreshToken } = await generateAccessAndRefreshToken(
    user._id,
  );
  const loggedInUser = await User.findById(user._id).select(
    "-password -refreshToken",
  );

  return res
    .status(200)
    .cookie("accessToken", accessToken, {
      ...option,
      maxAge: 24 * 60 * 60 * 1000,
    })
    .cookie("refreshToken", refreshToken, {
      ...option,
      maxAge: 480 * 60 * 60 * 1000,
    })
    .json(
      new ApiResponse(
        200,
        {
          user: loggedInUser,
          accessToken,
          refreshToken,
        },
        "user loggedIn successfully!",
      ),
    );
});

const logOut = AsyncHandler(async (req, res) => {
  await User.findByIdAndUpdate(
    req.user._id,
    {
      $unset: {
        refreshToken: 1,
      },
    },
    {
      returnDocument: "after",
    },
  );
  return res
    .status(200)
    .clearCookie("accessToken", option)
    .clearCookie("refreshToken", option)
    .json(new ApiResponse(200, {}, "User loggedOut successful"));
});

const changePassword = AsyncHandler(async (req, res) => {
  const { loginKey, oldPassword, newPassword } = req.body;
  if (!(loginKey && oldPassword && newPassword && otp)) {
    throw new ApiError(402, "All fields required");
  }

  const isEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(loginKey);
  const query = isEmail ? { email: loginKey } : { username: loginKey };

  const user = await User.findOne({ query });

  if (!user) {
    throw new ApiError(400, "user not found");
  }

  const isPasswordValidate = await user.isPasswordCorrect(oldPassword);
  if (!isPasswordValidate) {
    throw new ApiError(409, "your password is incorrect");
  }

  user.password = newPassword;
  await user.save({ validateBeforeSave: true });

  const newUser = await User.findById(user._id).select(
    "-password -refreshToken",
  );

  return res
    .status(200)
    .json(new ApiResponse(200, newUser, "Password updated successfully"));
});

const updateUser = AsyncHandler(async (req, res) => {
  const {
    loginKey,
    fullName,
    password,
    role,
    shopName,
    shopAddress,
    gstNumber,
    phone,
  } = req.body;

  if (!(loginKey && password)) throw new ApiError(402, "All fields required");

  // if already admin exist we not allow anyone to change his role as Admin
  if (role == "Admin") {
    const user = await User.findOne({ role: "Admin" });
    if (user) throw new ApiError(500, "Admin Already Exist!");
  }

  const isEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(loginKey);

  const query = isEmail ? { email: loginKey } : { username: loginKey };
  const user = await User.findOne(query);

  if (!user) throw new ApiError(400, "user not found");
  const isPasswordValidate = await user.isPasswordCorrect(password);
  if (!isPasswordValidate) throw new ApiError(409, "Password is incorrect");

  if (role == "User" || role == "Admin") {
    user.fullName = fullName;
    user.phone = phone;
  } else {
    user.phone = phone;
    user.fullName = fullName;
    user.shopName = shopName;
    user.shopAddress = shopAddress;
    user.gstNumber = gstNumber;
    user.requestedAt = new Date();
    user.verificationStatus = "Pending";
    user.rejectedReason = "";
  }

  await user.save({ validateBeforeSave: false });

  const newUser = await User.findById(user._id).select(
    "-password -refreshToken",
  );
  return res
    .status(200)
    .json(new ApiResponse(200, newUser, "User Updated Successfully"));
});

const updateAvatar = AsyncHandler(async (req, res) => {
  const avatarLocalPath = req.file?.path;
  if (!avatarLocalPath) throw new ApiError(409, "Avatar not found");
  const avatar = await uploadCloudinary(avatarLocalPath);
  if (!avatar)
    throw new ApiError(
      500,
      "Error has occurred while avatar uploading on cloudinary",
    );

  const user = await User.findByIdAndUpdate(
    req.user?._id,
    { $set: { avatar: avatar.url } },
    { returnDocument: "after" },
  ).select("-password -refreshToken");

  return res
    .status(200)
    .json(new ApiResponse(200, user, "Avatar has successfully changed"));
});

const getCurrentUser = AsyncHandler(async (req, res) => {
  const user = await User.findById(req.user?._id).select(
    "-password -refreshToken",
  );
  return res.status(200).json(new ApiResponse(200, user, "Returning userData"));
});

const EditToCart = AsyncHandler(async (req, res) => {
  const { productId, action = "add" } = req.body;
  const userId = req.user?._id;
  if (!productId) throw new ApiError(400, "Product Id is required");
  if (!userId) throw new ApiError(400, "User Id is required");
  const user = await User.findById(userId);
  if (!user) throw new ApiError(400, "User not found");
  const isExist = user.cart.find(
    (item) => item.product.toString() === productId,
  );
  if (action === "add") {
    if (isExist) {
      await User.findOneAndUpdate(
        { _id: userId, "cart.product": productId },
        { $inc: { "cart.$.quantity": 1 } },
        { returnDocument: "after" },
      );
    } else {
      await User.findByIdAndUpdate(
        userId,
        { $push: { cart: { product: productId, quantity: 1 } } },
        { returnDocument: "after" },
      );
    }
  } else if (action === "subtract") {
    if (isExist) {
      if (isExist.quantity === 1) {
        await User.findByIdAndUpdate(
          userId,
          { $pull: { cart: { product: productId } } },
          { returnDocument: "after" },
        );
      } else if (isExist.quantity > 1) {
        await User.findOneAndUpdate(
          { _id: userId, "cart.product": productId },
          { $inc: { "cart.$.quantity": -1 } },
          { returnDocument: "after" },
        );
      }
    } else {
      throw new ApiError(400, "Invalid cart item quantity");
    }
  } else if (action == "remove") {
    await User.findByIdAndUpdate(
      userId,
      {
        $pull: { cart: { product: new mongoose.Types.ObjectId(productId) } },
      },
      { returnDocument: "after" },
    );
  }

  const updatedUser = await User.findById(userId).select("cart");
  return res
    .status(200)
    .json(new ApiResponse(200, updatedUser.cart, "Cart updated successfully"));
});


export {
  logOut,
  loginUser,
  createUser,
  generateAccessAndRefreshToken,
  sendOtp,
  changePassword,
  updateUser,
  updateAvatar,
  getCurrentUser,
  EditToCart,
};
