import {
  IsString,
  IsNotEmpty,
  IsNumber,
  Min,
  IsInt,
  IsOptional,
  Max,
  IsIn,
} from 'class-validator';
import { Type, Transform, TransformFnParams } from 'class-transformer';

export class CreateProductDto {
  @IsString({ message: 'Product token must be a string' })
  @IsNotEmpty({ message: 'Product token should not be empty' })
  productToken: string;

  @IsString({ message: 'Name must be a string' })
  @IsNotEmpty({ message: 'Name should not be empty' })
  name: string;

  @IsNumber({}, { message: 'Price must be a number' })
  @IsNotEmpty({ message: 'Price should not be empty' })
  @Min(0)
  price: number;

  @IsNumber({}, { message: 'Stock must be a number' })
  @IsNotEmpty({ message: 'Stock should not be empty' })
  @IsInt()
  @Min(0, { message: 'Stock must be at least 0' })
  stock: number;
}

export class PaginationQueryDto {
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @Max(100)
  @Transform(({ value }: TransformFnParams) => parseInt(String(value), 10))
  limit?: number = 100;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(0)
  @Transform(({ value }: TransformFnParams) => parseInt(String(value), 10))
  offset?: number = 0;

  @IsOptional()
  @IsIn(['name', 'price', 'stock', 'id'])
  orderBy?: 'name' | 'price' | 'stock' | 'id';

  @IsOptional()
  @IsIn(['ASC', 'DESC'])
  orderDirection?: 'ASC' | 'DESC' = 'DESC';
}

export class UpdateProductStockDto {
  @IsNumber({}, { message: 'Stock must be a number' })
  @IsNotEmpty({ message: 'Stock should not be empty' })
  @IsInt()
  @Min(0, { message: 'Stock must be at least 0' })
  stock: number;
}
