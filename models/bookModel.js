const mongoose = require("mongoose");

const bookSchema = new mongoose.Schema(
    {
        title: { type: String, required: true },
        isbn: { type: String, required: true, unique: true },
        authors: [{ type: mongoose.Schema.Types.ObjectId, ref: "author", required: true }],
        status: { type: String, enum: ["IN", "OUT"], required: true, default: "IN" },
        borrowedBy: { type: mongoose.Schema.Types.ObjectId, ref: "student", default: null },
        issuedBy: { type: mongoose.Schema.Types.ObjectId, ref: "attendant", default: null },
        returnDate: { type: Date, default: null },
    },
    { timestamps: true }
)

module.exports = mongoose.model("book", bookSchema);