import mongoose, { Schema } from 'mongoose'

const orderSchema = new Schema({
    products: [
        {
            product: {
                type: mongoose.Schema.Types.ObjectId,
                ref: "Product",
                required: true
            },
            quantity: {
                type: Number,
                required: true
            },
            price: {
                type: Number,
                required: true
            }
        }
    ],
    buyer: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    productVendor: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    // productTotal: {
    //     type: Number,
    //     required: true
    // },
    deliveryCharge: {
        type: Number,
        default: 0
    },
    serviceCharge: {
        type: Number,
        default: 0
    },
    totalAmount: {
        type: Number,
        required: true,
    },
    paymentMethod: {
        type: String,
        enum: ["cod", "stripe"],
        required: true
    },
    isPaid: {
        type: Boolean,
        default: false
    },
    orderStatus: {
        type: String,
        enum: [
            "pending",
            "confirmed",
            "shipped",
            "delivered",
            "returned",
            "canceled"
        ],
        default: "pending"
    },
    cancelledAt: {
        type: Date
    },

    returnedAmount: {
        type: Number,
        default: 0
    },
    userInfo: {
        name: {
            type: String,
            required: true
        },
        email: {
            type: String,
        },
        phone: {
            type: Number,
            required: true
        },
        address: {
            type: String,
            required: true
        },
        city: {
            type: String,
            required: true
        },
        pinCode: {
            type: Number,
            required: true
        },
    },

    paymentDetails: {
        stripePaymentId: String,
        stripeSessionId: String
    },
    deliveryDate: {
        type: Date
    },
    deliveryOtp: {
        type: String
    },
    otpExpireAt: {
        type: Date
    }
    
},{timestamps: true})

export const Order = mongoose.model("Order", orderSchema)