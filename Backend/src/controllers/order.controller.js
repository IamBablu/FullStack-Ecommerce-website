import { AsyncHandler } from "../utils/AsyncHandler.js";
import { ApiError } from '../utils/ApiError.js'
import { ApiResponse } from '../utils/ApiResponse.js'
import { User } from '../models/user.model.js'
import { Order } from "../models/order.model.js";
import { Product } from "../models//product.model.js";


const placeOrder = AsyncHandler(async(req, res)=> {
    const userId = req.user._id;
    const {productId, quantity, vendorId, userInfo, deliveryCharge, serviceCharge, price, totalAmount, paymentMethod} = req.body;

    if(!userId) throw new ApiError(403, "userId not found")
    if(!(productId && quantity && vendorId && price && totalAmount)) throw new ApiError(402, "Product Details not found")
    if(!(userInfo && userInfo.name && userInfo.phone && userInfo.address && userInfo.city && userInfo.pinCode)) throw new ApiError(403, "UserInfo required")
    if(quantity < 1) throw new ApiError(403, "quantity must be at lest 1")
    const user = await User.findById(userId)
    if(!user) throw new ApiError(404, "User not fount")

    const productVendor = await User.findById(vendorId)
    if(!productVendor) throw new ApiError(404, "Vendor not found")

    const product = await Product.findById(productId)
    if(!product) throw new ApiError(404, "Product not found")
    if(product.vendor.toString() !== vendorId) throw new ApiError(403, "You are not authorized to add this product")
    
    if(product.stock < quantity) throw new ApiError(409, "quantity in sufficient")


    const order = await Order.create({
        products: [{
                product: productId,
                quantity: quantity,
                price: price
            }],
        buyer: user._id,
        productVendor: productVendor._id,
        productTotal: price * quantity,
        deliveryCharge: deliveryCharge,
        serviceCharge: serviceCharge,
        totalAmount: totalAmount,
        paymentMethod: paymentMethod && "cod",
        status: "Pending",
        userInfo: {
            name: userInfo.name,
            email: userInfo.email,
            phone: userInfo.phone,
            address: userInfo.address,
            city: userInfo.city,
            pinCode: userInfo.pinCode
        },
    })

    const createdOrder = await Order.findById(order._id)
    if(!createdOrder) throw new ApiError(500, "Failed to create order")

    user.orders.push(createdOrder._id)
    user.cart = user.cart.filter(item => !item.product.equals(product._id))
    await user.save()

    product.stock -= quantity
    await product.save()

    return res
    .status(201)
    .json(new ApiResponse(201, createdOrder, "Order placed Successfully!"))

})


// Get all orders for admin
const getAdminOrder = AsyncHandler(async (req, res) => {
    const adminId = req.user._id;
    console.log(adminId)
    // Check if user is admin (you need to implement this check)
    if (req.user.role !== 'Admin') {
        throw new ApiError(403, "Unauthorized access. Admin only.");
    }

    const orders = await Order
        .find({})
        .populate("buyer", "fullName email phone")
        .populate("productVendor", "fullName email phone")
        .populate({
            path: "products.product",
            model: "Product",
            select: "title image price category stock replacementDays",
        })
        .sort({ createdAt: -1 });

    return res
        .status(200)
        .json(new ApiResponse(200, orders, "All orders fetched successfully"));
});

const getVendorOrder = AsyncHandler(async(req, res) => {
    const vendorId = req.user._id;
    if(!vendorId) throw new ApiError(403, "Unauthorized request")
    const orders = await Order
    .find({productVendor : vendorId})
    .populate("buyer", "fullName email phone")
    .populate({
        path: "products.product",
        model: "Product",
        select: "title image price category stock replacementDays",
    }).sort({createdAt: -1})

    return res
    .status(200)
    .json(new ApiResponse(200, orders, "Orders searching successful "))
})

const getUserOrder = AsyncHandler(async (req, res)=> {
    const userId = req.user._id;
    if(!userId) throw new ApiError(203, "UserId not found")
    const orders = await Order
    .find({buyer : userId})
    .populate("productVendor", "fullName shopName email")
    .populate({
        path: "products.product",
        model: "Product",
        select: "title image price category stock replacementDays",
    })
    .sort({createdAt: -1})

    return res
    .status(200)
    .json(new ApiResponse(200, orders, "Orders searching successful "))


})

const updateOrderStatus = AsyncHandler(async (req, res) => {
    const { orderId } = req.params;
    const { orderStatus } = req.body;
    const userId = req.user._id;
    console.log(orderId, userId, orderStatus)

    // Validate orderId
    if (!orderId) {
        throw new ApiError(400, "Order ID is required");
    }

    // Validate orderStatus
    const validStatuses = ["pending", "confirmed", "shipped", "delivered", "returned", "canceled"];
    if (!orderStatus || !validStatuses.includes(orderStatus)) {
        throw new ApiError(400, "Invalid order status");
    }

    //check user is vendor or itself Admin
    const user = await User.findById(userId).select("role")
    let order;
    let statusFlow;
    if (user.role == "Admin") {
        order = await Order.findById(orderId)
        statusFlow = {
        pending: ["confirmed", "canceled"],
        confirmed: ["shipped", "canceled"],
        shipped: ["delivered", "returned", "canceled"],
        delivered: ["return"],
        returned: ["canceled"],
        canceled: []
    };
    }else if(user.role == "Vendor"){
         // Find the order and check if it belongs to the vendor
    order = await Order.findOne({
        _id: orderId,
        productVendor: userId
    });
     // Define status flow rules
    statusFlow = {
        pending: ["confirmed", "canceled"],
        confirmed: ["shipped", "canceled"],
        shipped: ["delivered", "returned"],
        delivered: [],
        returned: [],
        canceled: []
    };
    }else{
        throw new ApiError(400, "Unauthorized Request")
    }

   
    
    if (!order) {
        throw new ApiError(404, "Order not found");
    }

   

    // Check if status transition is valid
    if (!statusFlow[order.orderStatus]?.includes(orderStatus)) {
        throw new ApiError(400, `Cannot change status from ${order.orderStatus} to ${orderStatus}`);
    }

    // Update order status
    order.orderStatus = orderStatus;

    // Add timestamps for specific statuses
    if (orderStatus === "canceled") {
        order.cancelledAt = new Date();
    }

    if (orderStatus === "delivered") {
        order.deliveryDate = new Date();
    }

    // Save the updated order
    await order.save();

    // Populate necessary fields for response
    const updatedOrder = await Order.findById(orderId)
        .populate("buyer", "fullName email phone")
        .populate({
            path: "products.product",
            model: "Product",
            select: "title image price category stock replacementDays",
        });

    return res
        .status(200)
        .json(new ApiResponse(200, updatedOrder, `Order status updated to ${orderStatus} successfully`));
});


// Cancel order by customer
const cancelOrder = AsyncHandler(async (req, res) => {
    const { orderId } = req.params;
    const customerId = req.user._id;

    // Validate orderId
    if (!orderId) {
        throw new ApiError(400, "Order ID is required");
    }

    // Find the order and check if it belongs to the customer
    const order = await Order.findOne({
        _id: orderId,
        buyer: customerId
    });

    if (!order) {
        throw new ApiError(404, "Order not found or unauthorized");
    }

    // Check if order can be cancelled (only pending or confirmed orders can be cancelled)
    const cancellableStatuses = ["pending", "confirmed"];
    if (!cancellableStatuses.includes(order.orderStatus)) {
        throw new ApiError(400, `Cannot cancel order with status: ${order.orderStatus}. Only pending or confirmed orders can be cancelled.`);
    }

    // Check if order is already cancelled
    if (order.orderStatus === "canceled") {
        throw new ApiError(400, "Order is already cancelled");
    }

    // Update order status to cancelled
    order.orderStatus = "canceled";
    order.cancelledAt = new Date();

    // If payment was made, mark as not paid and handle refund
    if (order.isPaid && order.paymentMethod === "stripe") {
        order.isPaid = false;
        // You can add refund logic here
        // await processRefund(order);
    }

    await order.save();

    // Populate necessary fields for response
    const updatedOrder = await Order.findById(orderId)
        .populate("buyer", "fullName email phone")
        .populate({
            path: "products.product",
            model: "Product",
            select: "title image price category stock",
        });

    return res
        .status(200)
        .json(new ApiResponse(200, updatedOrder, "Order cancelled successfully"));
});

// Return order by customer
const returnOrder = AsyncHandler(async (req, res) => {
    const { orderId } = req.params;
    const customerId = req.user._id;
    const { returnReason, returnDetails } = req.body;

    // Validate orderId
    if (!orderId) {
        throw new ApiError(400, "Order ID is required");
    }

    // Find the order and check if it belongs to the customer
    const order = await Order.findOne({
        _id: orderId,
        buyer: customerId
    });

    if (!order) {
        throw new ApiError(404, "Order not found or unauthorized");
    }

    // Check if order can be returned (only delivered orders can be returned)
    if (order.orderStatus !== "delivered") {
        throw new ApiError(400, `Cannot return order with status: ${order.orderStatus}. Only delivered orders can be returned.`);
    }

    // Check if already returned
    if (order.orderStatus === "returned") {
        throw new ApiError(400, "Order is already returned");
    }

    // Check return window (e.g., within 7 days of delivery)
    if (order.deliveryDate) {
        const daysSinceDelivery = Math.floor((new Date() - new Date(order.deliveryDate)) / (1000 * 60 * 60 * 24));
        const returnWindowDays = 7; // You can make this configurable
        
        if (daysSinceDelivery > returnWindowDays) {
            throw new ApiError(400, `Return window expired. Can only return within ${returnWindowDays} days of delivery.`);
        }
    }

    // Update order status to returned
    order.orderStatus = "returned";
    order.returnedAmount = order.totalAmount;
    order.returnedAt = new Date();
    order.returnReason = returnReason || "No reason provided";
    order.returnDetails = returnDetails || {};

    // If payment was made, mark as refund pending or process refund
    if (order.isPaid) {
        order.isPaid = false;
        // You can add refund logic here
        // await processRefund(order);
    }

    await order.save();

    // Populate necessary fields for response
    const updatedOrder = await Order.findById(orderId)
        .populate("buyer", "fullName email phone")
        .populate({
            path: "products.product",
            model: "Product",
            select: "title image price category stock",
        });

    return res
        .status(200)
        .json(new ApiResponse(200, updatedOrder, "Order returned successfully"));
});
export {
    placeOrder,
    getAdminOrder,
    getUserOrder,
    getVendorOrder,
    updateOrderStatus,
    cancelOrder,
    returnOrder
}