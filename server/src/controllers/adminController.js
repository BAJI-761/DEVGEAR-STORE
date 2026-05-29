import Product from '../models/Product.js';
import Order from '../models/Order.js';
import User from '../models/User.js';

function normalizeProductPayload(body) {
  return {
    name: body.name,
    slug: body.slug,
    sku: body.sku,
    description: body.description,
    category: body.category,
    subcategory: body.subcategory || '',
    brand: body.brand || '',
    price: Number(body.price),
    compareAtPrice: body.compareAtPrice === undefined || body.compareAtPrice === '' ? null : Number(body.compareAtPrice),
    stock: Number(body.stock),
    images: Array.isArray(body.images) ? body.images : [],
    tags: Array.isArray(body.tags) ? body.tags : [],
    specs: body.specs || {},
    isFeatured: Boolean(body.isFeatured),
    isActive: body.isActive === undefined ? true : Boolean(body.isActive)
  };
}

export async function listAdminProducts(_req, res, next) {
  try {
    const products = await Product.find().sort({ createdAt: -1 });
    res.json({ success: true, data: { products } });
  } catch (error) {
    next(error);
  }
}

export async function createAdminProduct(req, res, next) {
  try {
    const product = await Product.create(normalizeProductPayload(req.body));
    res.status(201).json({ success: true, data: { product }, message: 'Product created successfully' });
  } catch (error) {
    next(error);
  }
}

export async function updateAdminProduct(req, res, next) {
  try {
    const product = await Product.findByIdAndUpdate(req.params.productId, normalizeProductPayload(req.body), {
      new: true,
      runValidators: true
    });

    if (!product) {
      return res.status(404).json({
        success: false,
        error: {
          code: 'PRODUCT_NOT_FOUND',
          message: 'Product not found'
        }
      });
    }

    res.json({ success: true, data: { product }, message: 'Product updated successfully' });
  } catch (error) {
    next(error);
  }
}

export async function deleteAdminProduct(req, res, next) {
  try {
    const product = await Product.findByIdAndDelete(req.params.productId);

    if (!product) {
      return res.status(404).json({
        success: false,
        error: {
          code: 'PRODUCT_NOT_FOUND',
          message: 'Product not found'
        }
      });
    }

    res.json({ success: true, message: 'Product deleted successfully' });
  } catch (error) {
    next(error);
  }
}

export async function listAdminOrders(req, res, next) {
  try {
    const { status } = req.query;
    const filter = {};

    if (status) {
      filter.status = status;
    }

    const orders = await Order.find(filter).sort({ createdAt: -1 });
    res.json({ success: true, data: { orders } });
  } catch (error) {
    next(error);
  }
}

export async function updateAdminOrderStatus(req, res, next) {
  try {
    const { status, paymentStatus, trackingNumber } = req.body;
    const order = await Order.findById(req.params.orderId);

    if (!order) {
      return res.status(404).json({
        success: false,
        error: {
          code: 'ORDER_NOT_FOUND',
          message: 'Order not found'
        }
      });
    }

    if (status) {
      order.status = status;
    }

    if (paymentStatus) {
      order.paymentStatus = paymentStatus;
    }

    if (trackingNumber !== undefined) {
      order.trackingNumber = trackingNumber;
    }

    await order.save();

    res.json({ success: true, data: { order }, message: 'Order updated successfully' });
  } catch (error) {
    next(error);
  }
}

export async function listAdminUsers(_req, res, next) {
  try {
    const users = await User.find().select('-passwordHash').sort({ createdAt: -1 });
    res.json({ success: true, data: { users } });
  } catch (error) {
    next(error);
  }
}

export async function getAdminStats(_req, res, next) {
  try {
    const [totalProducts, totalOrders, revenueResult] = await Promise.all([
      Product.countDocuments(),
      Order.countDocuments(),
      Order.aggregate([{ $group: { _id: null, revenue: { $sum: '$totalAmount' } } }])
    ]);

    res.json({
      success: true,
      data: {
        totalProducts,
        totalOrders,
        totalRevenue: revenueResult[0]?.revenue || 0
      }
    });
  } catch (error) {
    next(error);
  }
}
