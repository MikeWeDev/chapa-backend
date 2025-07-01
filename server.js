const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const mongoose = require("mongoose");

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 5000;

// Import Payment model (must be loaded before using it in routes)
require("./model/payment");

// Import payment routes
const paymentRoutes = require("./routes/paymentRoutes");
app.use("/", paymentRoutes); // Or use "/api" prefix if desired

// ✅ Connect to MongoDB, then start server
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => {
  console.log("✅ MongoDB Connected");
  app.listen(PORT, () => {
    console.log(`🚀 Server running on http://localhost:${PORT}`);
  });
})
.catch((err) => {
  console.log("❌ Mongo Error:", err);
});
