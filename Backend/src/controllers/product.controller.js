import { ApiError } from "../utils/ApiError.js";
import { AsyncHandler } from "../utils/AsyncHandler.js";
import { uploadCloudinary } from "../utils/Cloudinary.js";
import { Product } from "../models/product.model.js";
import { User } from "../models/user.model.js";
import { ApiResponse } from "../utils/ApiResponse.js";

const createProduct = AsyncHandler(async (req, res) => {
  // const localPathImage = req.file?.path; //when uploading by using "single" in upload middleware
  const imageLocalPath = req.files; //when uploading is more than one

  const {
    title,
    price,
    description,
    stock,
    category,
    isWearable = false,
    replacementDays = "",
    warranty = "",
    freeDelivery = false,
    payOnDelivery = false,
    detailPoints = [],
    size = [],
  } = req.body;


  const vendorId = req.user?._id;
  if (!vendorId) throw new ApiError(400, "Unauthorized request");

  if (!(title && price && description && stock && category))
    throw new ApiError(403, "All fields required");
  if (!imageLocalPath) throw new ApiError(409, "Image required");

  const uploadPromises = imageLocalPath.map(async (file) => {
    const result = await uploadCloudinary(file.path);
    return result ? result.secure_url : null;
  });
  const imageUrl = await Promise.all(uploadPromises);
  const cleanImageUrl = imageUrl.filter((url) => url !== null);
  if (cleanImageUrl.length === 0) throw new ApiError(500, "Error in Uploading images");

  const product = await Product.create({
    title,
    price,
    description,
    stock,
    isStockAvailable: stock ? true : false,
    vendor: vendorId,
    image: cleanImageUrl,
    category,
    isWearable,
    size,
    requestedAt: Date.now(),
    replacementDays,
    freeDelivery,
    warranty,
    payOnDelivery,
    detailPoints,
  });

  const createdProduct = await Product.findById(product._id);
  if (!createdProduct) throw new ApiError(500, "Something went wrong!");

  const vendorUpdate = await User.findByIdAndUpdate(
    vendorId,
    {
      $push: { vendorProduct: createProduct._id },
    },
    { returnDocument: "after" },
  );

  return res
    .status(200)
    .json(new ApiResponse(200, createdProduct, "product created successfully"));
});

const editProduct = AsyncHandler(async (req, res) => {
  const newFiles = req.files || [];

  const {
    productId,
    title,
    price,
    description,
    stock,
    category,
    isWearable = false,
    replacementDays = "",
    warranty = "",
    freeDelivery = false,
    payOnDelivery = false,
    detailPoints = [],
    size = [],
    existingImg = [],
  } = req.body;
  const vendorId = req.user?._id;
  if (!vendorId) throw new ApiError(400, "Unauthorized request");

  if (!productId) throw new ApiError(400, "Product Id is missing");

  if (!(title && price && description && stock && category))
    throw new ApiError(403, "All fields required");

  let keptUrl = [];
  let cleanImageUrl = [];
  if (existingImg) {
    keptUrl = Array.isArray(existingImg) ? existingImg : [existingImg];
  }
  if (newFiles.length > 0) {
    const uploadPromises = newFiles.map(async (file) => {
      const result = await uploadCloudinary(file.path);
      return result ? result.secure_url : null;
    });
    const imageUrl = await Promise.all(uploadPromises);

    cleanImageUrl = imageUrl.filter((url) => url !== null);

    if (!cleanImageUrl) throw new ApiError(500, "Error in Uploading images");
  }


const finalImgList = [...keptUrl, ...cleanImageUrl];
  if (finalImgList.length === 0) throw new ApiError(403, "images not found");
  const product = await Product.findByIdAndUpdate(
    productId,
    {
      title,
      price,
      description,
      stock,
      isStockAvailable: stock ? true : false,
      image: finalImgList,
      category,
      isWearable,
      size,
      requestedAt: Date.now(),
      replacementDays,
      freeDelivery,
      warranty,
      payOnDelivery,
      detailPoints,
      verificationStatus: "Pending",
    },
    { returnDocument: "after" },
  );

  return res
    .status(200)
    .json(new ApiResponse(200, product, "product has Edited successfully"));
});

const getMyProduct = AsyncHandler(async (req, res) => {
  const user = req.user;
  if (!user) throw new ApiError(403, "UnAuthorized request");
  const vendor = await User.findById(user._id);
  if (vendor.role !== "Vendor")
    throw new ApiError(400, "Only Vendor can access this route");
  const products = await Product.find({ vendor: vendor._id });
  return res
    .status(200)
    .json(new ApiResponse(200, products, "Searching Products Successful"));
});

const getUserProduct = AsyncHandler(async (req, res) => {
  console.log("fired")
  const products = await Product.find({
    verificationStatus: "Approved",
    isActive: true,
  });
  return res
    .status(200)
    .json(new ApiResponse(200, products, "Searching Products Successful"));
});

const activeProduct = AsyncHandler(async (req, res) => {
  const { productId, isActive } = req.body;
  const user = req.user;
  if (!user) throw new ApiError(403, "UnAuthorized request");
  const vendor = await User.findById(user._id);
  if (vendor.role !== "Vendor")
    throw new ApiError(400, "Only Vendor can access this route");
  const products = await Product.findByIdAndUpdate(
    productId,
    { isActive: isActive },
    { new: true },
  );
  return res
    .status(200)
    .json(new ApiResponse(200, products, "IsActive Edited"));
});
const getCartProduct = AsyncHandler(async(req, res) => {
  const {ids} = req.query;
  if(!ids) throw new ApiError(403, "ids not found")

  const parsedIds = JSON.parse(ids);
  if(!Array.isArray(parsedIds) || parsedIds.length === 0) throw new ApiError(403, "ids should be an array")
  const products = await Product.find({_id: {$in: parsedIds}});

  return res
  .status(200)
  .json(new ApiResponse(200, products, "products fetched successful"))
})
export {
  createProduct,
  getMyProduct,
  getUserProduct,
  editProduct,
  activeProduct,
  getCartProduct
};
