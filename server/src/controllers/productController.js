import mongoose from 'mongoose';
import Product from '../models/Product.js';

function escapeRegex(value) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

export async function listProducts(req, res, next) {
  try {
    const {
      page = '1',
      limit = '12',
      search = '',
      category = '',
      subcategory = '',
      sort = 'newest'
    } = req.query;

    const pageNumber = Math.max(parseInt(page, 10) || 1, 1);
    const pageSize = Math.min(Math.max(parseInt(limit, 10) || 12, 1), 48);

    const filter = { isActive: true };

    if (search.trim()) {
      filter.$or = [
        { name: { $regex: escapeRegex(search.trim()), $options: 'i' } },
        { description: { $regex: escapeRegex(search.trim()), $options: 'i' } },
        { tags: { $in: [new RegExp(escapeRegex(search.trim()), 'i')] } }
      ];
    }

    if (category.trim()) {
      filter.category = category.trim();
    }

    if (subcategory.trim()) {
      filter.subcategory = subcategory.trim();
    }

    const sortMap = {
      newest: { createdAt: -1 },
      oldest: { createdAt: 1 },
      price_asc: { price: 1 },
      price_desc: { price: -1 },
      name_asc: { name: 1 },
      name_desc: { name: -1 }
    };

    const sortOption = sortMap[sort] || sortMap.newest;
    const [items, total] = await Promise.all([
      Product.find(filter)
        .sort(sortOption)
        .skip((pageNumber - 1) * pageSize)
        .limit(pageSize),
      Product.countDocuments(filter)
    ]);

    res.json({
      success: true,
      data: {
        items,
        page: pageNumber,
        limit: pageSize,
        total,
        totalPages: Math.max(Math.ceil(total / pageSize), 1)
      }
    });
  } catch (error) {
    next(error);
  }
}

export async function getProductByIdentifier(req, res, next) {
  try {
    const { identifier } = req.params;
    const query = mongoose.isValidObjectId(identifier)
      ? { isActive: true, _id: identifier }
      : { isActive: true, slug: identifier };

    const product = await Product.findOne(query);

    if (!product) {
      return res.status(404).json({
        success: false,
        error: {
          code: 'PRODUCT_NOT_FOUND',
          message: 'Product not found'
        }
      });
    }

    res.json({
      success: true,
      data: {
        product
      }
    });
  } catch (error) {
    next(error);
  }
}