const jwt = require("jsonwebtoken");
const user = require("../Models/User");

const protect= async (req,res,next)=> {
    
    const token = req.cookies.token;
    try{
        if(!token){
            return res.status(401).json({message:"Not authorized, no token"});
        }

        const decoded = jwt.verify(token,process.env.JWT_SECRET);
        req.user = await user.findById(decoded.userId).select("-password");

        next();
    }catch(error){
        console.log("Token received:", token);
console.error("JWT verify error:", error.message);
        res.status(401).json({message:"Not authorized,token failed"});
    }
};

const admin = (req,res,next)=>{
    if(req.user && req.user.role ==="admin"){
        next();
    }else{
        res.status(403).json({message:"Not authorized as admin"});
    }
};

module.exports = {protect,admin};