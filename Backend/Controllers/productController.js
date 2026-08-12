const Product = require("../Models/Product");
const asyncHandler = require("../Middleware/asyncHandler");


const createProduct = asyncHandler(async (req,res)=>{
    const {name,description,price, category,brand,stock,images} = req.body;
    const product = await Product.create({
        name,
        description,
        price,
        category,
        brand,
        stock,
        images,
        user:req.user._id,
    });

    res.status(201).json(product);
});


const getProducts = asyncHandler(async (req, res) => {
  const pageSize = 12;
  const page = Number(req.query.page) || 1;

  const keyword = req.query.keyword
    ? { name: { $regex: req.query.keyword, $options: "i" } }
    : {};

  const category = req.query.category ? { category: req.query.category } : {};

  // Price range filter — naya
  const priceFilter = {};
  if (req.query.minPrice) {
    priceFilter.$gte = Number(req.query.minPrice);
  }
  if (req.query.maxPrice) {
    priceFilter.$lte = Number(req.query.maxPrice);
  }
  const price = Object.keys(priceFilter).length > 0 ? { price: priceFilter } : {};

  const filters = { ...keyword, ...category, ...price };

  const count = await Product.countDocuments(filters);
  const products = await Product.find(filters)
    .limit(pageSize)
    .skip(pageSize * (page - 1))
    .sort({ createdAt: -1 });

  res.status(200).json({
    products,
    page,
    pages: Math.ceil(count / pageSize),
    total: count,
  });
});

const getProductById = asyncHandler(async (req, res) => {
    const product = await Product.findById(req.params.id);

    if (!product) {
        res.status(404);
        throw new Error("Product not found");
    }

    res.status(200).json(product);
});


const updateProduct = asyncHandler(async (req,res)=>{
    const product = await Product.findById(req.params.id);

    if(!product){
        res.status(404);
        throw new Error("Product not found");
    }

    Object.assign(product,req.body);
    const updateProduct = await product.save();

    res.status(200).json(updateProduct);
});

const deleteProduct = asyncHandler(async (req,res)=>{
    const product = await Product.findById(req.params.id);

    if(!product){
        res.status(404);
        throw new Error("Product not found");
    }

    await product.deleteOne();
    res.status(200).json({message:"Product removed"});
});

module.exports ={createProduct,getProducts,getProductById,updateProduct,deleteProduct};
