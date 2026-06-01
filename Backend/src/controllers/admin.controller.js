import { ApiError } from "../utils/ApiError.js";
import { AsyncHandler } from "../utils/AsyncHandler.js";
import { User } from "../models/user.model.js";
import { Product } from "../models/product.model.js";
import { ApiResponse } from "../utils/ApiResponse.js";

const verifyVendor = AsyncHandler(async (req, res) => {
  const admin = req.user;
  const { status, vendorId, rejectedReason } = req.body;
  if (!admin) throw new ApiError(403, "Admin not found");
  if (!status || !vendorId)
    throw new ApiError(403, "Status and Vendor ID are required");

  const Admin = await User.findById(admin._id);
  if (!Admin) throw new ApiError(400, "Admin not found");
  if (Admin.role !== "Admin") throw new ApiError(400, "UnAuthorized request");
  const vendor = await User.findById(vendorId);
  if (!vendor) throw new ApiError(400, "Vendor not found");
  if (status == "Approved") {
    vendor.verificationStatus = "Approved";
    vendor.isValidate = true;
    vendor.approvedAt = new Date();
    vendor.rejectedReason = rejectedReason;
  }
  if (status == "Rejected") {
    vendor.verificationStatus = "Rejected";
    vendor.isValidate = false;
    vendor.approvedAt = new Date();
    vendor.rejectedReason = rejectedReason;
  }
  vendor.save({ validateBeforeSave: false });

  const verifiedVendor = await User.findById(vendorId);

  if (!verifiedVendor) throw new ApiError(500, "Something went wrong");

  return res
    .status(200)
    .json(new ApiResponse(200, verifiedVendor, "Vendor updated successfully"));
});

const getVendors = AsyncHandler(async (req, res) => {
  const user = req.user;
  if (!user) throw new ApiError(403, "UnAuthorized request");
  const admin = await User.findById(user._id);
  if (admin.role !== "Admin") throw new ApiError(400, "Admin not found");
  const vendors = await User.find({ role: "Vendor" });
  if (!vendors) throw new ApiError(400, "Vendors not found");
  return res
    .status(200)
    .json(new ApiResponse(200, vendors, "Vendors getting successful"));
});

const getAllProduct = AsyncHandler(async (req, res) => {
  const user = req.user;
  if (!user) throw new ApiError(403, "UnAuthorized request");
  const admin = await User.findById(user._id);
  if (admin.role !== "Admin")
    throw new ApiError(400, "Only Admin can access this route");
  const products = await Product.find({});
  return res
    .status(200)
    .json(new ApiResponse(200, products, "Searching Products Successful"));
});

const verifyProduct = AsyncHandler(async (req, res) => {
  const admin = req.user;
  const { status, productId, rejectedReason } = req.body;
  if (!admin) throw new ApiError(403, "Admin not found");
  if (!status || !productId)
    throw new ApiError(403, "Status and Product ID are required");

  const Admin = await User.findById(admin._id);
  if (!Admin) throw new ApiError(400, "Admin not found");

  if (Admin.role !== "Admin") throw new ApiError(400, "UnAuthorized request");

  const product = await Product.findByIdAndUpdate(productId,{
    verificationStatus: status,
    approvedAt: Date.now(),
    rejectedReason: rejectedReason
  },{returnDocument: "after"});
  if (!product) throw new ApiError(400, "product not found");


  return res
    .status(200)
    .json(new ApiResponse(200, product, "product updated successfully"));
});

export { verifyVendor, getVendors, getAllProduct, verifyProduct };
