import User from '../models/User.js';

function mapAddressPayload(body) {
  return {
    label: body.label,
    fullName: body.fullName,
    phone: body.phone,
    line1: body.line1,
    line2: body.line2 || '',
    city: body.city,
    state: body.state,
    postalCode: body.postalCode,
    country: body.country || 'India',
    isDefault: Boolean(body.isDefault)
  };
}

export async function getProfile(req, res) {
  res.json({ success: true, data: { user: req.user } });
}

export async function updateProfile(req, res, next) {
  try {
    const { name, phone, avatarUrl } = req.body;
    const user = await User.findById(req.user._id);

    if (!user) {
      return res.status(404).json({
        success: false,
        error: {
          code: 'USER_NOT_FOUND',
          message: 'User not found'
        }
      });
    }

    if (name !== undefined) user.name = name;
    if (phone !== undefined) user.phone = phone;
    if (avatarUrl !== undefined) user.avatarUrl = avatarUrl;

    await user.save();

    res.json({ success: true, data: { user: user.toJSON() }, message: 'Profile updated successfully' });
  } catch (error) {
    next(error);
  }
}

export async function addAddress(req, res, next) {
  try {
    const user = await User.findById(req.user._id);
    if (!user) {
      return res.status(404).json({
        success: false,
        error: {
          code: 'USER_NOT_FOUND',
          message: 'User not found'
        }
      });
    }

    user.addresses.push(mapAddressPayload(req.body));
    await user.save();

    res.status(201).json({ success: true, data: { user: user.toJSON() }, message: 'Address added successfully' });
  } catch (error) {
    next(error);
  }
}

export async function updateAddress(req, res, next) {
  try {
    const user = await User.findById(req.user._id);
    if (!user) {
      return res.status(404).json({
        success: false,
        error: {
          code: 'USER_NOT_FOUND',
          message: 'User not found'
        }
      });
    }

    const address = user.addresses.id(req.params.addressId);
    if (!address) {
      return res.status(404).json({
        success: false,
        error: {
          code: 'ADDRESS_NOT_FOUND',
          message: 'Address not found'
        }
      });
    }

    Object.assign(address, mapAddressPayload({ ...address.toObject(), ...req.body }));
    await user.save();

    res.json({ success: true, data: { user: user.toJSON() }, message: 'Address updated successfully' });
  } catch (error) {
    next(error);
  }
}

export async function deleteAddress(req, res, next) {
  try {
    const user = await User.findById(req.user._id);
    if (!user) {
      return res.status(404).json({
        success: false,
        error: {
          code: 'USER_NOT_FOUND',
          message: 'User not found'
        }
      });
    }

    const address = user.addresses.id(req.params.addressId);
    if (!address) {
      return res.status(404).json({
        success: false,
        error: {
          code: 'ADDRESS_NOT_FOUND',
          message: 'Address not found'
        }
      });
    }

    address.deleteOne();
    await user.save();

    res.json({ success: true, data: { user: user.toJSON() }, message: 'Address deleted successfully' });
  } catch (error) {
    next(error);
  }
}
