import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import request from 'supertest';
import { App } from 'supertest/types';
import { AppModule } from './../src/app.module';
import { SequelizeExceptionFilter } from '../src/common/filters/sequelize-exception.filter';

describe('AppController (e2e)', () => {
  let app: INestApplication<App>;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    app.useGlobalPipes(
      new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true }),
    );
    app.useGlobalFilters(new SequelizeExceptionFilter());
    await app.init();
  });

  it('/health (GET)', () => {
    return request(app.getHttpServer())
      .get('/health')
      .expect(200)
      .expect({ status: 'ok' });
  });

  describe('Products', () => {
    it('/products (POST) - should create a product', async () => {
      const createProductDto = {
        productToken: `token${Date.now()}`,
        name: 'Test Product',
        price: 10.99,
        stock: 100,
      };

      const response = await request(app.getHttpServer())
        .post('/products')
        .send(createProductDto)
        .expect(201);
      expect(response.body).toHaveProperty('id');
      expect(response.body).toHaveProperty('productToken');
      expect(response.body.name).toBe(createProductDto.name);
      expect(response.body.price).toBe(createProductDto.price); // DECIMAL returned as number in MySQL
      expect(response.body.stock).toBe(createProductDto.stock);
    });

    it('/products (POST) - should fail with invalid data', () => {
      const invalidDto = {
        productToken: '',
        name: '',
        price: -1,
        stock: -1,
      };

      return request(app.getHttpServer())
        .post('/products')
        .send(invalidDto)
        .expect(400);
    });

    it('/products (GET) - should return paginated products', async () => {
      const response = await request(app.getHttpServer())
        .get('/products?limit=10&offset=0')
        .expect(200);
      expect(response.body).toHaveProperty('rows');
      expect(response.body).toHaveProperty('count');
      expect(Array.isArray(response.body.rows)).toBe(true);
      expect(typeof response.body.count).toBe('number');
    });

    it('/products (GET) - should use default pagination values', async () => {
      const response = await request(app.getHttpServer())
        .get('/products')
        .expect(200);
      expect(response.body).toHaveProperty('rows');
      expect(response.body).toHaveProperty('count');
    });

    it('/products/:id/stock (PATCH) - should update product stock', async () => {
      // First create a product
      const createProductDto = {
        productToken: `token${Date.now()}`,
        name: 'Test Product for Update',
        price: 20.99,
        stock: 100,
      };
      const createResponse = await request(app.getHttpServer())
        .post('/products')
        .send(createProductDto)
        .expect(201);
      const productId = createResponse.body.id;

      // Now update stock
      const updateStockDto = { stock: 50 };
      const updateResponse = await request(app.getHttpServer())
        .patch(`/products/${productId}/stock`)
        .send(updateStockDto)
        .expect(200);
      expect(updateResponse.body.stock).toBe(50);
      expect(updateResponse.body.id).toBe(productId);
    });

    it('/products/:id/stock (PATCH) - should fail with invalid stock', () => {
      const updateStockDto = { stock: -1 };
      return request(app.getHttpServer())
        .patch('/products/1/stock')
        .send(updateStockDto)
        .expect(400);
    });

    it('/products/:id/stock (PATCH) - should fail if product not found', () => {
      const updateStockDto = { stock: 50 };
      return request(app.getHttpServer())
        .patch('/products/99999/stock')
        .send(updateStockDto)
        .expect(404);
    });

    it('/products/:id (DELETE) - should delete a product', async () => {
      // First create a product
      const createProductDto = {
        productToken: `token${Date.now()}`,
        name: 'Test Product for Delete',
        price: 15.99,
        stock: 75,
      };
      const createResponse = await request(app.getHttpServer())
        .post('/products')
        .send(createProductDto)
        .expect(201);
      const productId = createResponse.body.id;

      // Now delete
      await request(app.getHttpServer())
        .delete(`/products/${productId}`)
        .expect(204);

      // Verify it's deleted by trying to get it or update
      await request(app.getHttpServer())
        .patch(`/products/${productId}/stock`)
        .send({ stock: 10 })
        .expect(404);
    });

    it('/products/:id (DELETE) - should fail if product not found', () => {
      return request(app.getHttpServer()).delete('/products/99999').expect(404);
    });

    it('/products/:id (DELETE) - should fail with invalid id', () => {
      return request(app.getHttpServer())
        .delete('/products/invalid')
        .expect(400);
    });
  });
});
