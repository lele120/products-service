// Validation Messages Constants
export const VALIDATION_MESSAGES = {
  // Product Token
  PRODUCT_TOKEN_STRING: 'Product token must be a string',
  PRODUCT_TOKEN_NOT_EMPTY: 'Product token should not be empty',

  // Name
  NAME_STRING: 'Name must be a string',
  NAME_NOT_EMPTY: 'Name should not be empty',

  // Price
  PRICE_NUMBER: 'Price must be a number',
  PRICE_NOT_EMPTY: 'Price should not be empty',

  // Stock
  STOCK_NUMBER: 'Stock must be a number',
  STOCK_NOT_EMPTY: 'Stock should not be empty',
  STOCK_MIN: 'Stock must be at least 0',
} as const;
