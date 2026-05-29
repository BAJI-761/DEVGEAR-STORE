import Wishlist from '../models/Wishlist.js';

async function getOrCreateWishlist(userId) {
  let wishlist = await Wishlist.findOne({ user: userId }).populate('products');

  if (!wishlist) {
    wishlist = await Wishlist.create({ user: userId, products: [] });
    wishlist = await Wishlist.findById(wishlist._id).populate('products');
  }

  return wishlist;
}

export async function getWishlist(req, res, next) {
  try {
    const wishlist = await getOrCreateWishlist(req.user._id);
    res.json({ success: true, data: { wishlist } });
  } catch (error) {
    next(error);
  }
}

export async function addToWishlist(req, res, next) {
  try {
    const wishlist = await Wishlist.findOne({ user: req.user._id });
    if (!wishlist) {
      const created = await Wishlist.create({ user: req.user._id, products: [req.params.productId] });
      const populated = await Wishlist.findById(created._id).populate('products');
      return res.status(201).json({ success: true, data: { wishlist: populated }, message: 'Added to wishlist' });
    }

    if (!wishlist.products.some((productId) => productId.toString() === req.params.productId)) {
      wishlist.products.push(req.params.productId);
      await wishlist.save();
    }

    const populated = await Wishlist.findById(wishlist._id).populate('products');
    res.json({ success: true, data: { wishlist: populated }, message: 'Added to wishlist' });
  } catch (error) {
    next(error);
  }
}

export async function removeFromWishlist(req, res, next) {
  try {
    const wishlist = await Wishlist.findOne({ user: req.user._id });
    if (!wishlist) {
      return res.json({ success: true, data: { wishlist: null } });
    }

    wishlist.products = wishlist.products.filter((productId) => productId.toString() !== req.params.productId);
    await wishlist.save();

    const populated = await Wishlist.findById(wishlist._id).populate('products');
    res.json({ success: true, data: { wishlist: populated }, message: 'Removed from wishlist' });
  } catch (error) {
    next(error);
  }
}
