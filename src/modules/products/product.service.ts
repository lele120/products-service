import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Product } from './entities/product.model';
import { CreateProductDto } from './dto/product.dto';

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
  ): Promise<{ rows: Product[]; count: number }> {
    const products = await this.productModel.findAndCountAll({
      limit,
      offset,
    });
    return products as { rows: Product[]; count: number };
  }
}
