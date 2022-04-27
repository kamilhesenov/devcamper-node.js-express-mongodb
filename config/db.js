const mongoose = require("mongoose");

const connectDB = async () => {
  const url =
    "mongodb+srv://kamil90:kamil90@devcamper.xm9zx.mongodb.net/devcamper?retryWrites=true&w=majority";
  const connect = await mongoose.connect(url, {
    useUnifiedTopology: true,
    useNewUrlParser: true,
  });
  console.log(`MongoDB connect: ${connect.connection.host}`);
};

module.exports = connectDB;
