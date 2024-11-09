const mongoose = require("mongoose");
const initData = require("./data.js");
const Listing = require("../models/listing.js");

const MONGO_URL = "mongodb://127.0.0.1:27017/wanderlust";

main()
  .then(() => {
    console.log("connected to DB");
    return initDB(); // Ensure initDB is called after connection
  })
  .then(() => {
    console.log("data was initialized");
  })
  .catch((err) => {
    console.error("Error initializing the database:", err);
  });

async function main() {
  await mongoose.connect(MONGO_URL);
}

const initDB = async () => {
  try {
    await Listing.deleteMany({});
    await Listing.insertMany(initData.data);
  } catch (err) {
    console.error("Error during data initialization:", err);
    throw err;
  }
};
