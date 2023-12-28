const Product = require("../modules/productModule");
const ErrorHandler = require("../utile/errorHandle/errorHandle");
const asyncErrorHandler = require("../middleWare/asyncErrorHandle");
const APIFeature = require("../utile/apiFeature");

//getAll req -api/v1/products

exports.getProducts = async (req, res, next) => {
  let resPerPage = 3;
  //  const apiFeature=new APIFeature(Product.find(), req.query).search().filt er().paginate(resPerPage)
  const buildQuery = () => {
    return new APIFeature(Product.find(), req.query).search().filter();
  };
  const filteredProducts = await buildQuery().query.countDocuments({});
  const totalProductCount = await Product.countDocuments({});
  let productsCount = totalProductCount;
  if (productsCount !== filteredProducts) {
    productsCount = filteredProducts;
  }

  const products = await buildQuery().paginate(resPerPage).query;
  // const totalCount=await Product.countDocuments({})
  // await new Promise(resolve=>setTimeout(resolve,3000))
  //used to delay the request
  // return(
  //     next(new ErrorHandler("unable to get products"),404)
  // )
  res.status(200).json({
    success: true,
    count: productsCount,
    resPerPage,
    products,
  });
};

//post req -api/v1/products/new

exports.newProducts = asyncErrorHandler(async (req, res, next) => {
  let images = [];
  if (req.files.length > 0) {
    req.files.forEach((file) => {
      let url = `${process.env.BACKGROUND_URL}/uploads/product/${file.originalname}`;
      images.push({ image: url });
    });
  }
  req.body.images = images;
  req.body.user = req.user.id;
  const product = await Product.create(req.body);
  //    const product= ProductBlue.create(req.body)
  res.status(201).json({
    success: true,
    product,
  });
});

//get single product by Id;

exports.getSingleProduct = async (req, res, next) => {
  const product = await Product.findById(req.params.id).populate(
    "reviews.user",
    "name email"
  );

  if (!product) {
    // return res.status(404).json({
    //     success: false,
    //     message: "product not found"
    // });
    return next(new ErrorHandler("products not found", 400));
  }
  res.status(201).json({
    sucess: true,
    product,
  });
};
//update the product;

exports.updateProduct = async (req, res, next) => {
  const product = await Product.findById(req.params.id);
//uploading images
  let images = [];
  //if images not cleared we keep existing images
  if(req.body.imagesCleared==='false'){
    images=product.images
  }

  if (req.files.length > 0) { 
    req.files.forEach((file) => { 
      let url = `${process.env.BACKGROUND_URL}/uploads/product/${file.originalname}`;
      images.push({ image: url });
    });
  }
  req.body.images = images;
  if (!product) {
    return res.status(404).json({
      sucess: false,
      message: "product not found",
    });
  }

  const productUpdated = await Product.findByIdAndUpdate(
    req.params.id,
    req.body,
    {
      new: true,
      //new means updated data stored
      runValidators: true,
      //check the module option
    }
  );
  res.status(200).json({
    success: true,
    productUpdated,
  });
};

//Delete product

exports.deleteProduct = async (req, res, next) => {
  const idForDeleteProduct = await Product.findById(req.params.id);

  if (!idForDeleteProduct) {
    return res.status(404).json({
      success: false,
      message: "product not found",
    });
  }
  await idForDeleteProduct.remove();

  res.status(200).json({
    success: true,
    message: "product deleted ",
  });
};
// Admin Product list

exports.AdminAllProduct = asyncErrorHandler(async (req, res, next) => {
  const products = await Product.find();
  res.status(201).json({
    success: true,
    products,
  });
});
