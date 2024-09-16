import * as mongoose from 'mongoose';


const cropPostSchema = new mongoose.Schema({
  cropName: {
    type: String,
    required: true,
  },
  cropType: {
    type: String,
    required: true,
  },
  minprice: {
    type: String,
    required: true,
  },
  maxPrice: {
    type: String,
    required: true,
  },
  quantity: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  address: {
    type: String,
    required: true,
  },
  pictureUrl:{
    type: String,
    required: true
  },
  status: {
    default: false,
    type: Boolean,
    required: true
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  }
  
}, {timestamps: true});

const CropPost = mongoose.model("CropPost", cropPostSchema);

export default CropPost;