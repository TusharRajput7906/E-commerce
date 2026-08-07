const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const authRoutes = require("./Routes/authRoutes");
const productRoutes = require("./Routes/productRoutes");


const app=express();

app.use(express.json());
app.use(cors({
    origin:"https://localhost:5173",
    credentials:true
}));

app.use(cookieParser());

app.use("/api/auth",authRoutes);
app.use("/api/products", productRoutes);



app.get("/api/health",(req,res)=>{
    res.status(200).json({message:"Server is Running fine"});
});

module.exports = app;