const { validationResult, check } = require('express-validator');

exports.validateInvoice = [
  // Customer validation
  check('customerName')
    .trim()
    .notEmpty().withMessage('Customer name is required')
    .isLength({ min: 2 }).withMessage('Customer name must be at least 2 characters long'),
  
  check('email')
    .trim()
    .notEmpty().withMessage('Email is required')
    .isEmail().withMessage('Invalid email format'),
  
  // Items validation
  check('items')
    .isArray().withMessage('Items must be an array')
    .notEmpty().withMessage('At least one item is required'),
  
  check('items.*.description')
    .trim()
    .notEmpty().withMessage('Item description is required'),
  
  check('items.*.quantity')
    .isInt({ min: 1 }).withMessage('Quantity must be at least 1'),
  
  check('items.*.price')
    .isFloat({ min: 0 }).withMessage('Price must be a positive number'),
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