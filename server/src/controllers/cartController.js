import Cart from '../models/Cart.js';
import Product from '../models/Product.js';

async function getOrCreateCart(userId) {
  let cart = await Cart.findOne({ user: userId }).populate('items.product');

  if (!cart) {
    cart = await Cart.create({ user: userId, items: [] });
    cart = await Cart.findById(cart._id).populate('items.product');
  }

  return cart;
}

export async function getCart(req, res, next) {
  try {
    const cart = await getOrCreateCart(req.user._id);
    res.json({ success: true, data: { cart } });
  } catch (error) {
    next(error);
  }
}

export async function addOrUpdateCartItem(req, res, next) {
  try {
    const { productId } = req.params;
    const quantity = Math.max(parseInt(req.body.quantity, 10) || 1, 1);
    const product = await Product.findById(productId);

    if (!product || !product.isActive) {
      return res.status(404).json({
        success: false,
        error: {
          code: 'PRODUCT_NOT_FOUND',
          message: 'Product not found'
        }
      });
    }

    const cart = await Cart.findOne({ user: req.user._id });
    if (!cart) {
      const createdCart = await Cart.create({
        user: req.user._id,
        items: [{ product: product._id, quantity, unitPriceSnapshot: product.price }]
      });

      const populated = await Cart.findById(createdCart._id).populate('items.product');
      return res.json({ success: true, data: { cart: populated } });
    }

    const existingItem = cart.items.find((item) => item.product.toString() === productId);
    if (existingItem) {
      existingItem.quantity = quantity;
      existingItem.unitPriceSnapshot = product.price;
    } else {
      cart.items.push({ product: product._id, quantity, unitPriceSnapshot: product.price });
    }

    await cart.save();
    const populated = await Cart.findById(cart._id).populate('items.product');

    res.json({ success: true, data: { cart: populated } });
  } catch (error) {
    next(error);
  }
}

export async function removeCartItem(req, res, next) {
  try {
    const { productId } = req.params;
    const cart = await Cart.findOne({ user: req.user._id });

    if (!cart) {
      return res.json({ success: true, data: { cart: null } });
    }

    cart.items = cart.items.filter((item) => item.product.toString() !== productId);
    await cart.save();

    const populated = await Cart.findById(cart._id).populate('items.product');
    res.json({ success: true, data: { cart: populated } });
  } catch (error) {
    next(error);
  }
}

export async function clearCart(req, res, next) {
  try {
    const cart = await Cart.findOne({ user: req.user._id });
    if (cart) {
      cart.items = [];
      await cart.save();
    }

    res.json({ success: true, message: 'Cart cleared' });
  } catch (error) {
    next(error);
  }
}