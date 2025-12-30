import { Test, TestingModule } from '@nestjs/testing';
import { ProductController } from './product.controller';
import { ProductService } from './product.service';
import { CreateProductDto, UpdateProductStockDto } from './dto/product.dto';
import { Product } from './entities/product.model';

describe('ProductController', () => {
  let controller: ProductController;
  let service: ProductService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ProductController],
      providers: [
        {
          provide: ProductService,
          useValue: {
            create: jest.fn(),
            findAllPaginated: jest.fn(),
            updateProductStock: jest.fn(),
            deleteProduct: jest.fn(),
          },
        },
      ],
    }).compile();

    controller = module.get<ProductController>(ProductController);
    service = module.get<ProductService>(ProductService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('create', () => {
    it('should call productService.create with the provided dto', async () => {
      const createProductDto: CreateProductDto = {
        productToken: 'token123',
        name: 'Test Product',
        price: 10.99,
        stock: 100,
      };
      const mockProduct = { id: 1, ...createProductDto } as Product;

      const createSpy = jest
        .spyOn(service, 'create')
        .mockResolvedValue(mockProduct);

      const result = await controller.create(createProductDto);

      expect(createSpy).toHaveBeenCalledWith(createProductDto);
      expect(result).toEqual(mockProduct);
    });
  });

  describe('findAllPaginated', () => {
    it('should call productService.findAllPaginated with correct parameters', async () => {
      const query = { limit: 5, offset: 10 };
      const mockResult = { rows: [], count: 0 };

      const findAllPaginatedSpy = jest
        .spyOn(service, 'findAllPaginated')
        .mockResolvedValue(mockResult);

      const result = await controller.findAllPaginated(query);

      expect(findAllPaginatedSpy).toHaveBeenCalledWith(5, 10);
      expect(result).toEqual(mockResult);
    });

    it('should use default values when query parameters are not provided', async () => {
      const query = {};
      const mockResult = { rows: [], count: 0 };

      const findAllPaginatedSpy = jest
        .spyOn(service, 'findAllPaginated')
        .mockResolvedValue(mockResult);

      const result = await controller.findAllPaginated(query);

      expect(findAllPaginatedSpy).toHaveBeenCalledWith(100, 0);
      expect(result).toEqual(mockResult);
    });
  });

  describe('updateProductStock', () => {
    it('should call productService.updateProductStock with correct parameters', async () => {
      const id = 1;
      const updateProductStockDto: UpdateProductStockDto = { stock: 50 };
      const mockUpdatedProduct = {
        id: 1,
        productToken: 'token1',
        name: 'Product 1',
        price: 10.99,
        stock: 50,
      } as Product;

      const updateProductStockSpy = jest
        .spyOn(service, 'updateProductStock')
        .mockResolvedValue(mockUpdatedProduct);

      const result = await controller.updateProductStock(
        id,
        updateProductStockDto,
      );

      expect(updateProductStockSpy).toHaveBeenCalledWith(
        id,
        updateProductStockDto,
      );
      expect(result).toEqual(mockUpdatedProduct);
    });
  });

  describe('deleteProduct', () => {
    it('should call productService.deleteProduct with correct id', async () => {
      const id = 1;

      const deleteProductSpy = jest
        .spyOn(service, 'deleteProduct')
        .mockResolvedValue(undefined);

      const result = await controller.deleteProduct(id);

      expect(deleteProductSpy).toHaveBeenCalledWith(id);
      expect(result).toBeUndefined();
    });
  });
});
