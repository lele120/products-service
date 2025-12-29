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
  declare productToken: string;

  @Column({ type: DataType.STRING, allowNull: false })
  declare name: string;

  @Column({ type: DataType.DECIMAL(10, 2), allowNull: false })
  declare price: number;

  @Column({ type: DataType.INTEGER, allowNull: false })
  declare stock: number;
}
