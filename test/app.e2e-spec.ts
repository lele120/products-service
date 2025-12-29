import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import request from 'supertest';
import { App } from 'supertest/types';
import { AppModule } from './../src/app.module';

describe('AppController (e2e)', () => {
  let app: INestApplication<App>;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  it('/ (GET)', () => {
    return request(app.getHttpServer())
      .get('/')
      .expect(200)
      .expect('Hello World!');
  });

  describe('Products', () => {
    it('/products (POST) - should create a product', () => {
      const createProductDto = {
        productToken: 'token123',
        name: 'Test Product',
        price: 10.99,
        stock: 100,
      };

      return request(app.getHttpServer())
        .post('/products')
        .send(createProductDto)
        .expect(201)
        .then((response) => {
          expect(response.body).toMatchObject(createProductDto);
          expect(response.body).toHaveProperty('id');
        });
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
  });
});
