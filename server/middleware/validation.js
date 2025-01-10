const { validationResult, check } = require('express-validator');

exports.validateInvoice = [
  // Customer validation
  check('customerName')
    .trim()
    .notEmpty().withMessage('Customer name is required')
    .isLength({ min: 2 }).withMessage('Customer name must be at least 2 characters long'),
  
  check('customerEmail')
    .trim()
    .notEmpty().withMessage('Email is required')
    .isEmail().withMessage('Invalid email format'),
  
  // Products validation
  check('products')
    .isArray().withMessage('Products must be an array')
    .notEmpty().withMessage('At least one product is required'),

  check('products.*.name')
    .trim()
    .notEmpty().withMessage('Product name is required'),

  check('products.*.quantity')
    .isInt({ min: 1 }).withMessage('Quantity must be at least 1'),

  check('products.*.price')
    .isFloat({ min: 0 }).withMessage('Price must be a positive number'),
  
  // Tax validation
  check('tax')
    .isFloat({ min: 0 }).withMessage('Tax must be a non-negative number'),

  // Total validation
  check('total')
    .isFloat({ min: 0 }).withMessage('Total must be a non-negative number'),
];

exports.validateId = [
  check('id')
    .isMongoId().withMessage('Invalid invoice ID')
];

exports.validate = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  next();
};
