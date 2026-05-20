const cron = require("node-cron");
const Book = require("../models/bookModel");

const runOverdueCheck = async () => {
    try {
        const now = new Date();

        // Mark overdue — books that are OUT and past return date
        const overdue = await Book.updateMany(
            {
                status: "OUT",
                returnDate: { $lt: now },
                isOverdue: false
            },
            { $set: { isOverdue: true } }
        );

        // Clear overdue — books that have been returned
        const cleared = await Book.updateMany(
            {
                status: "IN",
                isOverdue: true
            },
            { $set: { isOverdue: false } }
        );

        console.log(`Overdue check: ${overdue.modifiedCount} marked overdue, ${cleared.modifiedCount} cleared`);
    } catch (error) {
        console.error("Overdue check failed:", error.message);
    }
};

// Runs every day at midnight
const scheduleOverdueCheck = () => {
    cron.schedule("0 0 * * *", () => {
        console.log("Running daily overdue check...");
        runOverdueCheck();
    });
};

module.exports = { scheduleOverdueCheck, runOverdueCheck };