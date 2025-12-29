import { Column, Model, Table, DataType } from 'sequelize-typescript';

interface ProductAttributes {
  id: number;
  productToken: string;
  name: string;
  price: number;
  stock: number;
}

@Table({ tableName: 'products' })
export class Product extends Model<
  ProductAttributes,
  Omit<ProductAttributes, 'id'>
> {
  @Column({ type: DataType.INTEGER, autoIncrement: true, primaryKey: true })
  declare id: number;

  @Column({ type: DataType.STRING, allowNull: false, unique: true })
  productToken: string;

  @Column({ type: DataType.STRING, allowNull: false })
  name: string;

  @Column({ type: DataType.DECIMAL(10, 2), allowNull: false })
  price: number;

  @Column({ type: DataType.INTEGER, allowNull: false })
  stock: number;
}
