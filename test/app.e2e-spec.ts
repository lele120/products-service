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

  it('/ (GET)', () => {
    return request(app.getHttpServer())
      .get('/')
      .expect(200)
      .expect('Hello World!');
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
      expect(response.body.price).toBe(createProductDto.price.toString()); // DECIMAL returned as string
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
  });
});
