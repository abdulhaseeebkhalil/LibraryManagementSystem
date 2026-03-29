const mongoose = require('mongoose');

const uri = "mongodb+srv://db_user_01:%4012345678@cluster0.qedcs9l.mongodb.net/library";

async function fixUsers() {
  try {
    console.log("Connecting to MongoDB...");
    await mongoose.connect(uri);
    console.log("Connected.");
    
    const db = mongoose.connection.db;
    const result = await db.collection('users').updateMany(
      { accountVerified: { $ne: true } }, 
      { $set: { accountVerified: true } }
    );
    
    console.log(`Successfully verified ${result.modifiedCount} old users!`);
  } catch (error) {
    console.error("Error migrating users:", error);
  } finally {
    process.exit(0);
  }
}

fixUsers();
