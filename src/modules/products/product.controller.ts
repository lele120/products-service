import { Controller, Post, Body, Get, Query } from '@nestjs/common';
import { ProductService } from './product.service';
import { CreateProductDto, PaginationQueryDto } from './dto/product.dto';

@Controller('products')
export class ProductController {
  constructor(private readonly productService: ProductService) {}

  @Post()
  async create(@Body() createProductDto: CreateProductDto) {
    return this.productService.create(createProductDto);
  }

  @Get()
  async findAllPaginated(@Query() query: PaginationQueryDto) {
    return this.productService.findAllPaginated(
      query.limit ?? 100,
      query.offset ?? 0,
    );
  }
}
