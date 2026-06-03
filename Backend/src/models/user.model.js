import mongoose, { Schema } from "mongoose";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";

const userSchema = new Schema(
  {
    username: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
      index: true,
    },
    phone: {
        type: Number
    },
    fullName: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        trim: true,

    },
    avatar: {
        type: String,
    },
    password: {
      type: String,
      required: [true, "Password is required"],
    },
    role: {
        type: String,
        enum: ["User" , "Vendor" , "Admin"],
        default: "user"
    },
    refreshToken: {
      type: String,
    },
    
    // for shopkeeper

    shopName: {
        type: String,
    },
    shopAddress: {
        type: String
    },
    gstNumber: {
        type: String
    },
    isValidate: {
        type: Boolean,
        default: false
    },
    verificationStatus: {
        type : String,
        enum: ["Pending", "Approved", "Rejected"],
        default: "Pending"
    },
    requestedAt: {
        type: Date
    },
    approvedAt: {
        type: Date

    },
    rejectedReason: {
        type: String
    },
    vendorProduct: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "product"
    }],

    // for user
    orders: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'orders'
    }],
    cart: [{
        product: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "product"
        },
        quantity: {
            type: Number,
            default: 1
        }
    }]

  },
  { timestamps: true },
);

userSchema.pre("save", async function () {
    if (!this.isModified("password")) return;

    this.password = await bcrypt.hash(this.password, 12);
});

userSchema.methods.isPasswordCorrect = async function (password) {
    return await bcrypt.compare(password, this.password)
    
}

userSchema.methods.generateAccessToken = function () {
    return jwt.sign({
        _id : this._id,
        username: this.username,
        email: this.email,
        fullName: this.fullName
    },process.env.ACCESS_TOKEN_SECRETE, {expiresIn: process.env.ACCESS_TOKEN_EXPIRY})
        
}

userSchema.methods.generateRefreshToken = function () {
    return jwt.sign({
        _id: this._id
    },process.env.REFRESH_TOKEN_SECRETE, {expiresIn: process.env.REFRESH_TOKEN_EXPIRY})
}


export const User = mongoose.model("User", userSchema)


