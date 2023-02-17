import { Sequelize } from "sequelize";
import { initTagModel } from "./model.js";

export async function initDatabase(path: string) {
  const sequelize = new Sequelize({
    dialect: "sqlite",
    storage: path,
  });
  initTagModel(sequelize);
  await sequelize.authenticate();
  await sequelize.sync();
}

export { TagBag } from "./tagbag.js";
export type { ITag } from "./tagbag.js";
