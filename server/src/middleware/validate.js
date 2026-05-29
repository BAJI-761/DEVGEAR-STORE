function collectMissingFields(payload, fields) {
  return fields.filter((field) => {
    const value = payload?.[field];
    return value === undefined || value === null || value === '';
  });
}

function sendValidationError(res, fields) {
  return res.status(400).json({
    success: false,
    error: {
      code: 'VALIDATION_ERROR',
      message: 'Request validation failed',
      fields
    }
  });
}

export function validateRequiredBody(fields) {
  return (req, res, next) => {
    const missingFields = collectMissingFields(req.body, fields);
    if (missingFields.length > 0) {
      return sendValidationError(res, missingFields);
    }

    next();
  };
}

export function validateOrderPlacement(req, res, next) {
  const requiredFields = ['fullName', 'phone', 'line1', 'city', 'state', 'postalCode'];
  const missingFields = collectMissingFields(req.body, requiredFields);

  if (missingFields.length > 0) {
    return sendValidationError(res, missingFields);
  }

  next();
}

export function validateProductPayload(req, res, next) {
  const requiredFields = ['name', 'slug', 'sku', 'description', 'category', 'price', 'stock'];
  const missingFields = collectMissingFields(req.body, requiredFields);

  if (missingFields.length > 0) {
    return sendValidationError(res, missingFields);
  }

  next();
}
