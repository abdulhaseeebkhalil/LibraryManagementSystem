import cron from "node-cron";
import User from "../models/userModel.js";
import { sendEmail } from "../utils/sendEmails.js";

export const notifyUsers = () => {
  cron.schedule("0 9 * * *", async () => {
    console.log("Running daily reminder job...");

    const users = await User.find({
      "borrowedBooks.returnedDate": false,
    });

    for (const user of users) {
      const dueBooks = user.borrowedBooks.filter(
        (book) =>
          !book.returnedDate &&
          new Date(book.dueDate) <= new Date()
      );

      if (dueBooks.length > 0) {
        const message = `
Hello ${user.name},

You have overdue books. Please return them as soon as possible.

Thanks,
Library Team
`;

        await sendEmail({
          email: user.email,
          subject: "Overdue Book Reminder",
          message,
        });
      }
    }
  });
};