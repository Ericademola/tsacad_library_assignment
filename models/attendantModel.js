const mongoose = require("mongoose");

const attendantSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true
        }
    },
    { timestamps: true }
)

module.exports = mongoose.model("attendant", attendantSchema);