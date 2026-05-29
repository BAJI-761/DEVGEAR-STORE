import mongoose from 'mongoose';
import Order from '../models/Order.js';
import Product from '../models/Product.js';
import Review from '../models/Review.js';

async function resolveProduct(identifier) {
  const query = mongoose.isValidObjectId(identifier)
    ? { _id: identifier }
    : { slug: identifier };

  return Product.findOne(query);
}

async function recalculateProductRating(productId) {
  const aggregate = await Review.aggregate([
    { $match: { product: productId } },
    {
      $group: {
        _id: '$product',
        ratingAverage: { $avg: '$rating' },
        ratingCount: { $sum: 1 }
      }
    }
  ]);

  await Product.findByIdAndUpdate(productId, {
    ratingAverage: aggregate[0]?.ratingAverage || 0,
    ratingCount: aggregate[0]?.ratingCount || 0
  });
}

export async function listProductReviews(req, res, next) {
  try {
    const product = await resolveProduct(req.params.productId);

    if (!product) {
      return res.status(404).json({
        success: false,
        error: {
          code: 'PRODUCT_NOT_FOUND',
          message: 'Product not found'
        }
      });
    }

    const reviews = await Review.find({ product: product._id }).sort({ createdAt: -1 });
    res.json({ success: true, data: { reviews } });
  } catch (error) {
    next(error);
  }
}

export async function createProductReview(req, res, next) {
  try {
    const { rating, title, comment } = req.body;
    const product = await resolveProduct(req.params.productId);

    if (!product) {
      return res.status(404).json({
        success: false,
        error: {
          code: 'PRODUCT_NOT_FOUND',
          message: 'Product not found'
        }
      });
    }

    const hasPurchased = await Order.exists({
      user: req.user._id,
      'items.product': product._id,
      status: { $in: ['confirmed', 'packed', 'shipped', 'delivered'] }
    });

    if (!hasPurchased) {
      return res.status(403).json({
        success: false,
        error: {
          code: 'PURCHASE_REQUIRED',
          message: 'You must purchase this product before reviewing it'
        }
      });
    }

    const review = await Review.findOneAndUpdate(
      { product: product._id, user: req.user._id },
      { rating, title, comment },
      { new: true, upsert: true, runValidators: true }
    );

    await recalculateProductRating(product._id);

    res.status(201).json({ success: true, data: { review }, message: 'Review saved successfully' });
  } catch (error) {
    next(error);
  }
}

export async function updateOwnReview(req, res, next) {
  try {
    const review = await Review.findOneAndUpdate(
      { _id: req.params.reviewId, user: req.user._id },
      req.body,
      { new: true, runValidators: true }
    );

    if (!review) {
      return res.status(404).json({
        success: false,
        error: {
          code: 'REVIEW_NOT_FOUND',
          message: 'Review not found'
        }
      });
    }

    await recalculateProductRating(review.product);

    res.json({ success: true, data: { review }, message: 'Review updated successfully' });
  } catch (error) {
    next(error);
  }
}

export async function deleteOwnReview(req, res, next) {
  try {
    const review = await Review.findOneAndDelete({ _id: req.params.reviewId, user: req.user._id });

    if (!review) {
      return res.status(404).json({
        success: false,
        error: {
          code: 'REVIEW_NOT_FOUND',
          message: 'Review not found'
        }
      });
    }

    await recalculateProductRating(review.product);

    res.json({ success: true, message: 'Review deleted successfully' });
  } catch (error) {
    next(error);
  }
}
