import mongoose from 'mongoose';

const productSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      trim: true,
      required: true,
      index: true
    },
    slug: {
      type: String,
      trim: true,
      lowercase: true,
      required: true,
      unique: true,
      index: true
    },
    sku: {
      type: String,
      trim: true,
      required: true,
      unique: true,
      index: true
    },
    description: {
      type: String,
      trim: true,
      required: true
    },
    category: {
      type: String,
      trim: true,
      required: true,
      index: true
    },
    subcategory: {
      type: String,
      trim: true,
      default: '',
      index: true
    },
    brand: {
      type: String,
      trim: true,
      default: ''
    },
    price: {
      type: Number,
      required: true,
      min: 0
    },
    compareAtPrice: {
      type: Number,
      default: null,
      min: 0
    },
    stock: {
      type: Number,
      required: true,
      min: 0,
      default: 0
    },
    images: [
      {
        url: { type: String, trim: true, required: true },
        alt: { type: String, trim: true, default: '' },
        variants: { type: Object, default: {} }
      }
    ],
    tags: [
      {
        type: String,
        trim: true
      }
    ],
    specs: {
      type: Map,
      of: String,
      default: {}
    },
    ratingAverage: {
      type: Number,
      default: 0,
      min: 0,
      max: 5
    },
    ratingCount: {
      type: Number,
      default: 0,
      min: 0
    },
    isFeatured: {
      type: Boolean,
      default: false,
      index: true
    },
    isActive: {
      type: Boolean,
      default: true,
      index: true
    }
  },
  {
    timestamps: true,
    versionKey: false
  }
);

productSchema.index({ name: 'text', description: 'text', category: 'text', tags: 'text' });

export default mongoose.model('Product', productSchema);