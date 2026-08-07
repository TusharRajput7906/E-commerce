const User = require("../Models/User");
const generateToken = require("../Utils/generateToken");

const registerUser = async (req,res)=>{
    try{
        const {name,email,password}=req.body;

        if(!name||!email||!password){
            return res.status(400).json({message:"Please fill all field"});
        }

        const userExists = await User.findOne({email});
        if(userExists){
            return res.status(400).json({message:"User already exist"});
        }

        const user= await User.create({name,email,password});

        generateToken(res,user._id);

        res.status(201).json({
            _id:user._id,
            name:user.name,
            email:user.email,
            role:user.role
        });
    }catch(error){
        console.error(error);
            res.status(500).json({message:error.message});
    }
};

const loginUser = async (req,res) => {
    try{
        const {email,password}=req.body;
        if(!email||!password){
            return res.status(400).json({message:"Please Enter email and password"});
        }

        const user = await User.findOne({email}).select("+password");
    
        if(!user || !(await user.comparePassword(password))){
            return res.status(401).json({message:"Invalid email and password"});
        }

        generateToken(res,user._id);

        res.status(200).json({
            _id:user._id,
            name:user.name,
            email:user.email,
            role:user.role,
        });
    }catch(error){
        console.error(error);
        res.status(500).json({message:"error.message"});
    }
};

const logoutUser = async (req,res)=> {
    res.cookie("token","",{
        httpOnly:true,
        expires:new Date(0),
    });
    
    res.status(200).json({message:"Logout out successfully"});
};

module.exports = {registerUser,loginUser,logoutUser};