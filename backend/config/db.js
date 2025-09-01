const mongoose = require('mongoose');

const connectDB = async () => {
  await mongoose.connect(process.env.MONGODB_URI)
    .then(() => {
      console.log("db connected 👍🏻")
    })
    .catch((err) => console.log(err))

};

module.exports = connectDB;