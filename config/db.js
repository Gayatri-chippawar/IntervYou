// config/db.js
// const mongoose = require('mongoose');

// const connectDB = async () => {
//   try {
//    await mongoose.connect(process.env.MONGODB_URI);
//    console.log('✅ MongoDB Connected');
//   } catch (err) {
//     console.error('❌ MongoDB Error:', err);
//     process.exit(1);
//   }
// };
// db.js

const mongoose = require('mongoose');
require('dotenv').config();

mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log('✅ MongoDB connected'))
.catch((err) => console.error('❌ MongoDB connection error:', err));


module.exports = connectDB;
