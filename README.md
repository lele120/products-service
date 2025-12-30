# Products Service

A high-performance RESTful API service for managing products in e-commerce platforms, built with NestJS, TypeScript, and Sequelize ORM. Supports both PostgreSQL and MySQL databases with optimized queries for large-scale operations.

## Features

- **Complete CRUD Operations**: Create, Read, Update (stock), Delete products
- **Pagination**: Efficient pagination for product listings with sorting options
- **Advanced Querying**: Search by name/token, filter by price range, low stock alerts
- **Database Optimization**: Strategic indexes for high-performance queries
- **Validation**: Comprehensive input validation using class-validator
- **Error Handling**: Global exception filters for consistent error responses
- **Database Integration**: PostgreSQL with Sequelize ORM
- **Testing**: Full test coverage including unit tests and e2e tests
- **TypeScript**: Full TypeScript support for type safety

## API Endpoints

### Products

| Method | Endpoint | Description |
|--------|----------|-------------|
| `POST` | `/products` | Create a new product |
| `GET` | `/products` | Get paginated list of products |
| `PATCH` | `/products/:id/stock` | Update product stock |
| `DELETE` | `/products/:id` | Delete a product |

### Request/Response Examples

#### Create Product
```bash
POST /products
Content-Type: application/json

{
  "productToken": "unique-token-123",
  "name": "Sample Product",
  "price": 29.99,
  "stock": 100
}
```

#### Get Products (Paginated)
```bash
GET /products?limit=10&offset=0
```

#### Update Stock
```bash
PATCH /products/1/stock
Content-Type: application/json

{
  "stock": 50
}
```

#### Delete Product
```bash
DELETE /products/1
```

### Advanced Querying

#### Search Products
```bash
GET /products/search?term=laptop&limit=10&offset=0
```

#### Filter by Price Range
```bash
GET /products/price-range?minPrice=10&maxPrice=100&limit=20
```

#### Get Low Stock Products
```bash
GET /products/low-stock?threshold=5
```

#### Sort Products
```bash
GET /products?orderBy=price&orderDirection=ASC&limit=10
```

## Performance Optimizations

### Database Indexes
The application includes strategic database indexes for optimal query performance:

- `idx_product_token` - Unique index on `productToken` for fast lookups
- `idx_product_name` - Index on `name` for search operations
- `idx_product_price` - Index on `price` for range queries and sorting
- `idx_product_stock` - Index on `stock` for inventory management queries

### Query Optimizations
- **Selective Field Loading**: Queries load only necessary fields to reduce memory usage
- **Efficient Updates**: Stock updates use single-query operations instead of read-then-update
- **Indexed Sorting**: All sorting operations leverage database indexes
- **Pagination**: Efficient LIMIT/OFFSET with proper ordering for large datasets

### Advanced Features
- **Search Functionality**: Full-text search across product names and tokens
- **Price Range Filtering**: Optimized queries for price-based product filtering
- **Low Stock Alerts**: Fast queries for inventory management
- **Flexible Sorting**: Multiple sort options (name, price, stock, date)

## Data Model & Validation

### Product Entity
```typescript
{
  id: number;           // Auto-increment primary key
  productToken: string; // Unique identifier (indexed)
  name: string;         // Product name (indexed for search)
  price: number;        // Decimal price (indexed for filtering)
  stock: number;        // Integer stock quantity (indexed)
}
```

### Validation Rules
- **productToken**: Required, string, unique
- **name**: Required, string, minimum 1 character
- **price**: Required, number, minimum 0
- **stock**: Required, integer, minimum 0

### Error Handling
- **400 Bad Request**: Validation errors with detailed messages
- **404 Not Found**: Product not found errors
- **500 Internal Server Error**: Database or server errors

## Testing & Quality

### Test Coverage
- ✅ **25 total tests** (14 unit + 11 e2e)
- ✅ **100% API endpoint coverage**
- ✅ **CRUD operations fully tested**
- ✅ **Error scenarios covered**
- ✅ **Performance optimizations validated**

### Test Results
```bash
Test Suites: 4 passed, 4 total
Tests:       25 passed, 25 total
Snapshots:   0 total
Time:        ~6 seconds total execution
```

### Code Quality
- **ESLint**: Configured with strict TypeScript rules
- **Prettier**: Consistent code formatting
- **TypeScript**: Strict type checking enabled
- **Jest**: Comprehensive testing framework

## Project setup

```bash
$ npm install
```

## Compile and run the project

```bash
# development
$ npm run start

# watch mode
$ npm run start:dev

# production mode
$ npm run start:prod
```

## Run tests

```bash
# unit tests
$ npm run test

# e2e tests
$ npm run test:e2e

# test coverage
$ npm run test:cov
```

## Deployment

### Environment Configuration
Ensure your production environment has the correct database settings:

```bash
# Database Configuration
DB_HOST=your-production-db-host
DB_PORT=5432  # or 3306 for MySQL
DB_USERNAME=your-db-user
DB_PASSWORD=your-secure-password
DB_DATABASE=your-production-db

# Application Settings
NODE_ENV=production
PORT=3000
```

### Database Migration
For production deployment, ensure your database schema is properly migrated:

```bash
# The application uses Sequelize sync for development
# For production, consider using proper migrations
# Set SEQUELIZE_SYNC=true only for initial setup
```

### Docker Deployment
```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY . .
RUN npm run build
EXPOSE 3000
CMD ["npm", "run", "start:prod"]
```

### Production Checklist
- ✅ Database indexes are created
- ✅ Environment variables configured
- ✅ NODE_ENV=production
- ✅ Proper logging enabled
- ✅ Health checks implemented
- ✅ Monitoring and alerting setup

## Architecture Overview

### Project Structure
```
src/
├── app.controller.ts         # Root controller
├── app.module.ts            # Root module
├── app.service.ts           # Root service
├── common/
│   └── filters/
│       └── sequelize-exception.filter.ts
├── config/
│   └── database.config.ts   # Database configuration
├── modules/
│   └── products/
│       ├── dto/
│       │   └── product.dto.ts
│       ├── entities/
│       │   └── product.model.ts
│       ├── product.controller.ts
│       ├── product.service.ts
│       └── product.module.ts
└── main.ts                  # Application entry point
```

### Key Technologies
- **Framework**: NestJS with TypeScript
- **ORM**: Sequelize with TypeScript decorators
- **Database**: PostgreSQL/MySQL support
- **Validation**: class-validator + class-transformer
- **Testing**: Jest with supertest for e2e
- **Code Quality**: ESLint + Prettier

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Acknowledgments

- Built with [NestJS](https://nestjs.com/) framework
- Database operations powered by [Sequelize](https://sequelize.org/)
- Testing framework by [Jest](https://jestjs.io/)
