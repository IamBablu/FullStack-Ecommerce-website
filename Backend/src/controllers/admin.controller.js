import { ApiError } from "../utils/ApiError.js";
import { AsyncHandler } from "../utils/AsyncHandler.js";
import { User } from "../models/user.model.js";
import { Order } from "../models/order.model.js";
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

// Get all vendors (admin only)
const getVendors = AsyncHandler(async (req, res) => {
    // Check if user is admin
    if (req.user.role !== 'Admin') {
        throw new ApiError(403, "Unauthorized access. Admin only.");
    }

    const vendors = await User.find({ role: 'Vendor' })
        .select('-password -refreshToken')
        .sort({ createdAt: -1 });

    // Get additional statistics for each vendor
    const vendorsWithStats = await Promise.all(vendors.map(async (vendor) => {
        const products = await Product.find({ vendor: vendor._id });
        const orders = await Order.find({ productVendor: vendor._id });
        const deliveredOrders = orders.filter(o => o.orderStatus === 'delivered');
        const totalRevenue = deliveredOrders.reduce((sum, order) => sum + order.totalAmount, 0);

        return {
            ...vendor.toObject(),
            totalProducts: products.length,
            totalOrders: orders.length,
            totalRevenue: totalRevenue
        };
    }));

    return res
        .status(200)
        .json(new ApiResponse(200, vendorsWithStats, "All vendors fetched successfully"));
});

const getAllProduct = AsyncHandler(async (req, res) => {
  const user = req.user;
  if (!user) throw new ApiError(403, "UnAuthorized request");
  const admin = await User.findById(user._id);
  if (admin.role !== "Admin")
    throw new ApiError(400, "Only Admin can access this route");
  const products = await Product.find({})
  .populate("vendor", "shopName");
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
