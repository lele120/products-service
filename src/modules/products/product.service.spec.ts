import { Test, TestingModule } from '@nestjs/testing';
import { getModelToken } from '@nestjs/sequelize';
import { ProductService } from './product.service';
import { Product } from './entities/product.model';
import { CreateProductDto } from './dto/product.dto';

describe('ProductService', () => {
  let service: ProductService;
  let mockProductModel: any;

  beforeEach(async () => {
    mockProductModel = {
      create: jest.fn(),
      findAndCountAll: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ProductService,
        {
          provide: getModelToken(Product),
          useValue: mockProductModel,
        },
      ],
    }).compile();

    service = module.get<ProductService>(ProductService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('should create a product and return it', async () => {
      const createProductDto: CreateProductDto = {
        productToken: 'token123',
        name: 'Test Product',
        price: 10.99,
        stock: 100,
      };
      const mockProduct = { id: 1, ...createProductDto } as Product;

      mockProductModel.create.mockResolvedValue(mockProduct);

      const result = await service.create(createProductDto);

      expect(mockProductModel.create).toHaveBeenCalledWith(createProductDto);
      expect(result).toEqual(mockProduct);
    });
  });

  describe('findAllPaginated', () => {
    it('should return paginated products', async () => {
      const limit = 10;
      const offset = 0;
      const mockResult = {
        rows: [
          {
            id: 1,
            productToken: 'token1',
            name: 'Product 1',
            price: 10.99,
            stock: 100,
          },
        ],
        count: 1,
      };

      mockProductModel.findAndCountAll.mockResolvedValue(mockResult);

      const result = await service.findAllPaginated(limit, offset);

      expect(mockProductModel.findAndCountAll).toHaveBeenCalledWith({
        limit,
        offset,
      });
      expect(result).toEqual(mockResult);
    });
  });
});
