const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const mongoose = require("mongoose");

dotenv.config();
const app = express();
app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 5000;

// Connect to MongoDB (keep this in server.js)
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log("✅ MongoDB Connected"))
.catch((err) => console.log("❌ Mongo Error:", err));

// Import Payment model here or in paymentRoutes.js (recommended to put it in separate models folder)
require("./model/payment");

// Import payment routes
const paymentRoutes = require("./routes/paymentRoutes");
app.use("/", paymentRoutes); // Mount the routes at root path or use "/api" prefix

app.listen(PORT, () => {
  console.log(`🚀 Server running on :${PORT}`);
});
