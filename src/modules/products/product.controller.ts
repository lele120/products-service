import {
  Controller,
  Post,
  Body,
  Get,
  Query,
  Patch,
  Param,
  ParseIntPipe,
  Delete,
  HttpCode,
} from '@nestjs/common';
import { ProductService } from './product.service';
import {
  CreateProductDto,
  PaginationQueryDto,
  UpdateProductStockDto,
} from './dto/product.dto';

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
      query.orderBy ?? 'id',
      query.orderDirection ?? 'DESC',
    );
  }

  @Patch(':id/stock')
  async updateProductStock(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateProductStockDto: UpdateProductStockDto,
  ) {
    return this.productService.updateProductStock(id, updateProductStockDto);
  }

  @Delete(':id')
  @HttpCode(204)
  async deleteProduct(@Param('id', ParseIntPipe) id: number) {
    return this.productService.deleteProduct(id);
  }
}
