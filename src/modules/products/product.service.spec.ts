import { Test, TestingModule } from '@nestjs/testing';
import { getModelToken } from '@nestjs/sequelize';
import { NotFoundException } from '@nestjs/common';
import { ProductService } from './product.service';
import { Product } from './entities/product.model';
import { CreateProductDto, UpdateProductStockDto } from './dto/product.dto';

describe('ProductService', () => {
  let service: ProductService;
  let mockProductModel: any;

  beforeEach(async () => {
    mockProductModel = {
      create: jest.fn(),
      findAndCountAll: jest.fn(),
      findByPk: jest.fn(),
      update: jest.fn(),
      destroy: jest.fn(),
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

  describe('updateProductStock', () => {
    it('should update product stock and return the updated product', async () => {
      const id = 1;
      const updateProductStockDto: UpdateProductStockDto = { stock: 50 };
      const mockProduct = {
        id: 1,
        productToken: 'token1',
        name: 'Product 1',
        price: 10.99,
        stock: 100,
        update: jest.fn().mockImplementation(function (dto) {
          this.stock = dto.stock;
          return Promise.resolve(this);
        }),
      } as any;

      mockProductModel.findByPk.mockResolvedValue(mockProduct);

      const result = await service.updateProductStock(
        id,
        updateProductStockDto,
      );

      expect(mockProductModel.findByPk).toHaveBeenCalledWith(id);
      expect(mockProduct.update).toHaveBeenCalledWith(updateProductStockDto);
      expect(result).toMatchObject({
        id: 1,
        productToken: 'token1',
        name: 'Product 1',
        price: 10.99,
        stock: 50,
      });
    });

    it('should throw NotFoundException if product not found', async () => {
      const id = 999;
      const updateProductStockDto: UpdateProductStockDto = { stock: 50 };

      mockProductModel.findByPk.mockResolvedValue(null);

      await expect(
        service.updateProductStock(id, updateProductStockDto),
      ).rejects.toThrow(NotFoundException);
      expect(mockProductModel.findByPk).toHaveBeenCalledWith(id);
    });
  });

  describe('deleteProduct', () => {
    it('should delete the product successfully', async () => {
      const id = 1;

      mockProductModel.destroy.mockResolvedValue(1);

      await expect(service.deleteProduct(id)).resolves.toBeUndefined();
      expect(mockProductModel.destroy).toHaveBeenCalledWith({ where: { id } });
    });

    it('should throw NotFoundException if product not found', async () => {
      const id = 999;

      mockProductModel.destroy.mockResolvedValue(0);

      await expect(service.deleteProduct(id)).rejects.toThrow(
        NotFoundException,
      );
      expect(mockProductModel.destroy).toHaveBeenCalledWith({ where: { id } });
    });
  });
});
