const mongoose = require("mongoose");

const productSchmea = mongoose.Schema({
  name: {
    type: String,
    required: [true],
    trim: true,
    maxLength: [100, "Please enter the correct product name"],
  },
  price: {
    type: Number,
    default: 0.0, //initial value
  },
  description: {
    type: String,
    required: [true, "Enter the product description "],
    //         if     else this error will be show
    trim: true,
  },
  ratings: {
    type: String,
    default: 0,
  },
  images: [
    {
      image: {
        type: String,
        required: true,
      },
    },
  ],
  category: {
    type: String,
    required: [true, "Please enter product catagory"],
    enum: {
      values: [
        "Beauty/Health",
        "Clothes/Shoes",
        "Mobile Phones",
        "Accessories",
        "Electronics",
        "Headphones",
        "Laptops",
        "Foods",
        "Books",
        "Sports",
        "Home",
        "Outdoor"
      ],

      message: "please select the catagory field",
    },
  },

  seller: {
    type: String,
    required: [true, "Enter the product seller "],
  },
  stock: {
    type: Number,
    required: [20, "Product not exceed 20"],
  },
  numOfReviews: {
    //number of reviews
    type: Number,
    default: 0,
  },

  reviews: [
    {
      user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "user",
      },
      rating: {
        type: String,
        required: true,
      },
      comment: {
        type: String,
        required: true,
      },
    },
  ],
  user: {
    type: mongoose.Schema.Types.ObjectId,
  },
  createdAt: {
    type: Date,
    default: Date.now(),
  },
});

module.exports = mongoose.model("Products", productSchmea);
