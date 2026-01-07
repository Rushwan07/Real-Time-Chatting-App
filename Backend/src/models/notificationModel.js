const mongoose = require("mongoose")

const notificationSchema = new mongoose.Schema(
    {
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true
        },

        fromUser: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User"
        },

        type: {
            type: String,
            enum: [
                "REQUEST_SENT",
                "REQUEST_ACCEPTED",
                "REQUEST_REJECTED"
            ],
            required: true
        },

        isRead: {
            type: Boolean,
            default: false
        },

        data: {
            type: Object,
            default: {}
        }
    },
    { timestamps: true }
)

module.exports = mongoose.model("Notification", notificationSchema)
