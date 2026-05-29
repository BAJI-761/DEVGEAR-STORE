import crypto from 'crypto';
import Cart from '../models/Cart.js';
import Order from '../models/Order.js';
import Product from '../models/Product.js';

function generateOrderNumber() {
  return `DG-${Date.now()}-${crypto.randomBytes(2).toString('hex').toUpperCase()}`;
}

function normalizeShippingAddress(body) {
  return {
    fullName: body.fullName,
    phone: body.phone,
    line1: body.line1,
    line2: body.line2 || '',
    city: body.city,
    state: body.state,
    postalCode: body.postalCode,
    country: body.country || 'India'
  };
}

export async function createOrderFromCart(req, res, next) {
  try {
    const cart = await Cart.findOne({ user: req.user._id }).populate('items.product');

    if (!cart || cart.items.length === 0) {
      return res.status(400).json({
        success: false,
        error: {
          code: 'CART_EMPTY',
          message: 'Cart is empty'
        }
      });
    }

    const items = cart.items.map((item) => ({
      product: item.product._id,
      productName: item.product.name,
      productSlug: item.product.slug,
      quantity: item.quantity,
      unitPrice: item.unitPriceSnapshot,
      lineTotal: item.quantity * item.unitPriceSnapshot
    }));

    for (const item of cart.items) {
      if (item.product.stock < item.quantity) {
        return res.status(409).json({
          success: false,
          error: {
            code: 'INSUFFICIENT_STOCK',
            message: `${item.product.name} only has ${item.product.stock} unit(s) left in stock`
          }
        });
      }
    }

    const subtotal = items.reduce((sum, item) => sum + item.lineTotal, 0);
    const shippingFee = 0;
    const taxAmount = Math.round(subtotal * 0.18 * 100) / 100;
    const totalAmount = subtotal + shippingFee + taxAmount;

    for (const item of cart.items) {
      item.product.stock -= item.quantity;
      await item.product.save();
    }

    const order = await Order.create({
      orderNumber: generateOrderNumber(),
      user: req.user._id,
      items,
      shippingAddress: normalizeShippingAddress(req.body),
      subtotal,
      shippingFee,
      taxAmount,
      totalAmount,
      paymentMethod: req.body.paymentMethod || 'mock',
      paymentStatus: 'pending',
      status: 'confirmed'
    });

    cart.items = [];
    await cart.save();

    res.status(201).json({
      success: true,
      data: {
        order
      },
      message: 'Order placed successfully'
    });
  } catch (error) {
    next(error);
  }
}

export async function listMyOrders(req, res, next) {
  try {
    const orders = await Order.find({ user: req.user._id }).sort({ createdAt: -1 });
    res.json({ success: true, data: { orders } });
  } catch (error) {
    next(error);
  }
}

export async function getMyOrderById(req, res, next) {
  try {
    const order = await Order.findOne({ _id: req.params.orderId, user: req.user._id });

    if (!order) {
      return res.status(404).json({
        success: false,
        error: {
          code: 'ORDER_NOT_FOUND',
          message: 'Order not found'
        }
      });
    }

    res.json({ success: true, data: { order } });
  } catch (error) {
    next(error);
  }
}

export async function cancelMyOrder(req, res, next) {
  try {
    const order = await Order.findOne({ _id: req.params.orderId, user: req.user._id });

    if (!order) {
      return res.status(404).json({
        success: false,
        error: {
          code: 'ORDER_NOT_FOUND',
          message: 'Order not found'
        }
      });
    }

    if (['shipped', 'delivered', 'cancelled'].includes(order.status)) {
      return res.status(409).json({
        success: false,
        error: {
          code: 'ORDER_NOT_CANCELABLE',
          message: 'This order can no longer be cancelled'
        }
      });
    }

    for (const item of order.items) {
      await Product.findByIdAndUpdate(item.product, { $inc: { stock: item.quantity } });
    }

    order.status = 'cancelled';
    order.paymentStatus = order.paymentStatus === 'paid' ? 'refunded' : order.paymentStatus;
    await order.save();

    res.json({ success: true, data: { order }, message: 'Order cancelled successfully' });
  } catch (error) {
    next(error);
  }
}