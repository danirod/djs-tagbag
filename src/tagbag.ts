import type { Snowflake } from "discord.js";
import { Tag as TagModel } from "./model.js";

export interface ITag<T> {
  get(defaultValue?: T): Promise<T | undefined>;
  set(value: T): Promise<void>;
  delete(): Promise<void>;
}

export class BoundTag<T> implements ITag<T> {
  private whereVector: Pick<TagModel<T>, "ownerType" | "ownerId" | "key">;

  constructor(ownerType: string, ownerId: Snowflake, key: string) {
    this.whereVector = { ownerType, ownerId, key };
  }

  async get<T>(defaultValue?: T): Promise<T | undefined> {
    const tag = await TagModel.findOne({
      where: this.whereVector,
      attributes: { include: ["value"] },
    });
    if (!tag) {
      return defaultValue;
    }
    return tag.getDataValue("value") as T;
  }

  async set(value: T): Promise<void> {
    await TagModel.upsert({ ...this.whereVector, value });
  }

  async delete(): Promise<void> {
    await TagModel.destroy({ where: this.whereVector });
  }
}

export class TagBag {
  constructor(private type: string, private id: Snowflake) {}

  tag<T>(name: string): ITag<T> {
    return new BoundTag(this.type, this.id, name);
  }

  async tags(): Promise<string[]> {
    const tags = await TagModel.findAll({
      where: {
        ownerType: this.type,
        ownerId: this.id,
      },
      attributes: {
        include: ["key"],
      },
    });
    return tags.map((t) => t.getDataValue("key"));
  }
}
