import { Injectable, NotFoundException, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Product } from './entities/product.model';
import { CreateProductDto, UpdateProductStockDto } from './dto/product.dto';
import { ERROR_MESSAGES } from '../../constants';

@Injectable()
export class ProductService {
  private readonly logger = new Logger(ProductService.name);

  constructor(
    @InjectModel(Product)
    private productModel: typeof Product,
  ) {}
  async create(productData: CreateProductDto): Promise<Product> {
    this.logger.debug(`Creating new product: ${productData.productToken}`);

    try {
      const product = await this.productModel.create(productData);
      this.logger.log(
        `Product created successfully: ${product.productToken} (ID: ${product.id})`,
      );
      return product as Product;
    } catch (error) {
      this.logger.error(
        `Failed to create product: ${productData.productToken}`,
        error.message,
      );
      throw error;
    }
  }

  async findAllPaginated(
    limit: number,
    offset: number,
    orderBy: 'name' | 'price' | 'stock' | 'id',
    orderDirection: 'ASC' | 'DESC' = 'DESC',
  ): Promise<{ rows: Product[]; count: number }> {
    this.logger.debug(
      `Fetching products: limit=${limit}, offset=${offset}, orderBy=${orderBy}, orderDirection=${orderDirection}`,
    );

    const start = Date.now();
    const products = await this.productModel.findAndCountAll({
      limit,
      offset,
      order: [[orderBy, orderDirection]],
      // Optimize query by selecting only needed fields for list view
      attributes: ['id', 'productToken', 'name', 'price', 'stock'],
    });

    const duration = Date.now() - start;
    this.logger.debug(
      `Products fetched: ${products.rows.length} items in ${duration}ms`,
    );

    return products as { rows: Product[]; count: number };
  }

  async updateProductStock(
    id: number,
    updateProductStockDto: UpdateProductStockDto,
  ): Promise<Product> {
    this.logger.debug(
      `Updating stock for product ${id} to ${updateProductStockDto.stock}`,
    );

    const start = Date.now();
    const [affectedRows] = await this.productModel.update(
      updateProductStockDto,
      {
        where: { id },
      },
    );

    if (affectedRows === 0) {
      this.logger.warn(`Product ${id} not found for stock update`);
      throw new NotFoundException(ERROR_MESSAGES.PRODUCT_NOT_FOUND);
    }

    // Fetch the updated product
    const updatedProduct = await this.productModel.findByPk(id);
    if (!updatedProduct) {
      this.logger.error(`Product ${id} not found after update`);
      throw new NotFoundException(ERROR_MESSAGES.PRODUCT_NOT_FOUND);
    }

    const duration = Date.now() - start;
    this.logger.log(
      `Stock updated successfully for product ${id} in ${duration}ms`,
    );

    return updatedProduct as Product;
  }

  async deleteProduct(id: number): Promise<void> {
    this.logger.debug(`Deleting product ${id}`);

    const affectedRows = await this.productModel.destroy({ where: { id } });
    if (affectedRows === 0) {
      this.logger.warn(`Product ${id} not found for deletion`);
      throw new NotFoundException(ERROR_MESSAGES.PRODUCT_NOT_FOUND);
    }

    this.logger.log(`Product ${id} deleted successfully`);
  }
}
