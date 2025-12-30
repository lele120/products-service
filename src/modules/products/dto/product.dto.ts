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
import {
  VALIDATION_MESSAGES,
  PAGINATION,
  ORDER_BY_OPTIONS,
  ORDER_DIRECTION_OPTIONS,
} from '../../../constants';

export class CreateProductDto {
  @IsString({ message: VALIDATION_MESSAGES.PRODUCT_TOKEN_STRING })
  @IsNotEmpty({ message: VALIDATION_MESSAGES.PRODUCT_TOKEN_NOT_EMPTY })
  productToken: string;

  @IsString({ message: VALIDATION_MESSAGES.NAME_STRING })
  @IsNotEmpty({ message: VALIDATION_MESSAGES.NAME_NOT_EMPTY })
  name: string;

  @IsNumber({}, { message: VALIDATION_MESSAGES.PRICE_NUMBER })
  @IsNotEmpty({ message: VALIDATION_MESSAGES.PRICE_NOT_EMPTY })
  @Min(0)
  price: number;

  @IsNumber({}, { message: VALIDATION_MESSAGES.STOCK_NUMBER })
  @IsNotEmpty({ message: VALIDATION_MESSAGES.STOCK_NOT_EMPTY })
  @IsInt()
  @Min(0, { message: VALIDATION_MESSAGES.STOCK_MIN })
  stock: number;
}

export class PaginationQueryDto {
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(PAGINATION.MIN_LIMIT)
  @Max(PAGINATION.MAX_LIMIT)
  @Transform(({ value }: TransformFnParams) => parseInt(String(value), 10))
  limit?: number = PAGINATION.DEFAULT_LIMIT;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(PAGINATION.MIN_OFFSET)
  @Transform(({ value }: TransformFnParams) => parseInt(String(value), 10))
  offset?: number = PAGINATION.DEFAULT_OFFSET;

  @IsOptional()
  @IsIn(ORDER_BY_OPTIONS)
  orderBy?: (typeof ORDER_BY_OPTIONS)[number];

  @IsOptional()
  @IsIn(ORDER_DIRECTION_OPTIONS)
  orderDirection?: (typeof ORDER_DIRECTION_OPTIONS)[number] = 'DESC';
}

export class UpdateProductStockDto {
  @IsNumber({}, { message: VALIDATION_MESSAGES.STOCK_NUMBER })
  @IsNotEmpty({ message: VALIDATION_MESSAGES.STOCK_NOT_EMPTY })
  @IsInt()
  @Min(0, { message: VALIDATION_MESSAGES.STOCK_MIN })
  stock: number;
}
