import { AsyncHandler } from "../utils/AsyncHandler.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { ApiError } from "../utils/ApiError.js";
import { uploadCloudinary } from "../utils/Cloudinary.js";

import { User } from "../models/user.model.js";

import jwt from "jsonwebtoken";
import mongoose from "mongoose";
import { use } from "react";

const generateAccessAndRefreshToken = async (userId) => {
  try {
    if (!userId) return new ApiError(400, "user Id is missing");
    const user = await User.findById(userId);
    if (!user) return new ApiError(401, "user not found!");
    const accessToken = await user.generateAccessToken();
    const refreshToken = await user.generateRefreshToken();

    user.refreshToken = refreshToken;
    use.save({ validateBeforeSave: false });

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
};

const createUser = AsyncHandler(async (req, res) => {
  const { username, email, fullName, password } = req.body;

  if (
    [username, email, fullName, password].some((field) => field?.trim() === "")
  ) {
    throw new ApiError(400, "All Fields are required");
  }
  const existUser = User.findOne({
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
  });

  const createdUser = await User.findById(user._id).select(
    "-password -refreshToken",
  );

  if (!createdUser) {
    throw new ApiError(500, "Something went wrong while registering the user");
  }

  return res
    .status(200)
    .json(new ApiResponse(200, createdUser, "User register successfully"));
});

const loginUser = AsyncHandler(async (req, res) => {
  const { username, email, password } = req.body;

  if (!(username || email)) {
    throw new ApiError(402, "username or email is required");
  }

  const user = await User.findOne({
    $or: [{ username }, { email }],
  });
  if (!user) throw new ApiError(400, "user does not exist!");

  const isPasswordValidate = user.isPasswordCorrect(password);
  if (!isPasswordValidate) throw new ApiError(409, "Invalid user credentials");

  const { accessToken, refreshToken } = await generateAccessAndRefreshToken(
    user._id,
  );
  const loggedInUser = await User.findById(user._id).select(
    "-password -refreshToken",
  );

  return res
    .status(200)
    .cookie("accessToken", accessToken, option)
    .cookie("refreshToken", refreshToken, option)
    .json(new ApiResponse(200, {
        user: loggedInUser,
        accessToken,
        refreshToken
    },
    'user loggedIn successfully!'));
});


const logOut = AsyncHandler(async (req, res)=>{
    await User.findByIdAndUpdate(
        req.body._id,
        {
            $unset: {
                refreshToken: 1
            }
        },{
            new: true
        });
        return res
        .status(200)
        .clearCookie('accessToken', option)
        .clearCookie('refreshToken', option)
        .json(new ApiResponse(200,{},"User loggedOut successful"))
})