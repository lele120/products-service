// Database Field Names and Values Constants
export const DATABASE_FIELDS = {
  // Product Model Fields
  ID: 'id',
  PRODUCT_TOKEN: 'productToken',
  NAME: 'name',
  PRICE: 'price',
  STOCK: 'stock',

  // Table Names
  PRODUCTS_TABLE: 'products',

  // Order Directions
  ORDER_ASC: 'ASC',
  ORDER_DESC: 'DESC',
} as const;

// Database Configuration Constants
export const DATABASE_CONFIG = {
  // Default Values
  DEFAULT_PORT: 3306,
  DEFAULT_HOST: 'localhost',
  DEFAULT_USERNAME: 'root',
  DEFAULT_PASSWORD: '',
  DEFAULT_DATABASE: 'ecommerce_db',

  // Pool Settings
  POOL_MAX: 10,
  POOL_MIN: 0,
  POOL_ACQUIRE: 30000,
  POOL_IDLE: 10000,
} as const;
