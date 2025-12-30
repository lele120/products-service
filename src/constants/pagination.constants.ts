// Pagination Constants
export const PAGINATION = {
  DEFAULT_LIMIT: 100,
  DEFAULT_OFFSET: 0,
  MAX_LIMIT: 100,
  MIN_LIMIT: 1,
  MIN_OFFSET: 0,
} as const;

// Order By Options
export const ORDER_BY_OPTIONS = ['name', 'price', 'stock', 'id'] as const;

export const ORDER_DIRECTION_OPTIONS = ['ASC', 'DESC'] as const;
