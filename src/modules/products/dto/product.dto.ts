import { IsString, IsNotEmpty, IsNumber, Min, IsInt } from 'class-validator';

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
