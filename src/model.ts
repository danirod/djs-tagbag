import {
  DataTypes,
  InferAttributes,
  InferCreationAttributes,
  Model,
  Sequelize,
} from "sequelize";

export class Tag<T> extends Model<
  InferAttributes<Tag<T>>,
  InferCreationAttributes<Tag<T>>
> {
  declare ownerType: string;
  declare ownerId: string;
  declare key: string;
  declare value: T;
}

export function initTagModel(sequelize: Sequelize) {
  Tag.init(
    {
      ownerType: {
        field: "owner_type",
        type: DataTypes.STRING,
        primaryKey: true,
        allowNull: false,
      },
      ownerId: {
        field: "owner_id",
        type: DataTypes.STRING,
        primaryKey: true,
        allowNull: false,
      },
      key: {
        type: DataTypes.STRING,
        primaryKey: true,
        allowNull: false,
      },
      value: {
        type: DataTypes.JSON,
        allowNull: true,
      },
    },
    {
      tableName: "tags",
      createdAt: "created_at",
      updatedAt: "updated_at",
      sequelize,
    },
  );
}
