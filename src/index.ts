import { Sequelize } from "sequelize";
import { initTagModel } from "./model.js";

export interface DatabaseOptions {
  logger: boolean;
}

export async function initDatabase(path: string, options?: DatabaseOptions) {
  const sequelize = new Sequelize({
    dialect: "sqlite",
    logging: options?.logger,
    storage: path,
  });
  initTagModel(sequelize);
  await sequelize.authenticate();
  await sequelize.sync();
}

export { TagBag } from "./tagbag.js";
export type { ITag } from "./tagbag.js";
