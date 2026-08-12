const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const authRoutes = require("./Routes/authRoutes");
const productRoutes = require("./Routes/productRoutes");
const { notFound, errorHandler } = require("./Middleware/errorMiddleware");
const cartRoutes = require("./Routes/cartRoutes");
const orderRoutes = require("./Routes/orderRoutes");


const app=express();

app.use(express.json());
const allowedOrigins = ["http://localhost:5173", "http://localhost:5174"];
app.use(cors({
    origin: allowedOrigins,
    credentials:true
}));

app.use(cookieParser());

app.use("/api/auth",authRoutes);
app.use("/api/products", productRoutes);
app.use("/api/cart", cartRoutes);
app.use("/api/orders", orderRoutes);


app.get("/api/health",(req,res)=>{
    res.status(200).json({message:"Server is Running fine"});
});

app.use(notFound);
app.use(errorHandler);
module.exports = app;