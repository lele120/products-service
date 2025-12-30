import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Product } from './entities/product.model';
import { CreateProductDto, UpdateProductStockDto } from './dto/product.dto';

@Injectable()
export class ProductService {
  constructor(
    @InjectModel(Product)
    private productModel: typeof Product,
  ) {}
  async create(productData: CreateProductDto): Promise<Product> {
    const product = await this.productModel.create(productData);
    return product as Product;
  }

  async findAllPaginated(
    limit: number,
    offset: number,
    orderBy: 'name' | 'price' | 'stock' | 'id',
    orderDirection: 'ASC' | 'DESC' = 'DESC',
  ): Promise<{ rows: Product[]; count: number }> {
    const products = await this.productModel.findAndCountAll({
      limit,
      offset,
      order: [[orderBy, orderDirection]],
      // Optimize query by selecting only needed fields for list view
      attributes: ['id', 'productToken', 'name', 'price', 'stock'],
    });
    return products as { rows: Product[]; count: number };
  }

  async updateProductStock(
    id: number,
    updateProductStockDto: UpdateProductStockDto,
  ): Promise<Product> {
    const [affectedRows] = await this.productModel.update(
      updateProductStockDto,
      {
        where: { id },
      },
    );

    if (affectedRows === 0) {
      throw new NotFoundException('Product not found');
    }

    // Fetch the updated product
    const updatedProduct = await this.productModel.findByPk(id);
    if (!updatedProduct) {
      throw new NotFoundException('Product not found');
    }

    return updatedProduct as Product;
  }

  async deleteProduct(id: number): Promise<void> {
    const product = await this.productModel.destroy({ where: { id } });
    if (product === 0) {
      throw new NotFoundException('Product not found');
    }
    return;
  }
}
