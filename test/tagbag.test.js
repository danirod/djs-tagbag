const { describe, it, beforeEach, afterEach } = require("node:test");
const assert = require("node:assert");

const { Tag } = require("../dist/model");
const { BoundTag } = require("../dist/tagbag");
const { initDatabase } = require("../dist/index");

describe("BoundTag", async () => {
  beforeEach(async () => await initDatabase(":memory:"));

  afterEach(async () => await Tag.truncate());

  describe("#get", async () => {
    it("returns the value when the tag value is previously set", async () => {
      await Tag.create({
        ownerType: "Snowflake",
        ownerId: "1234",
        key: "count",
        value: 10,
      });

      const bound = new BoundTag("Snowflake", "1234", "count");
      assert.strictEqual(await bound.get(), 10);
    });

    it("returns the default value when the tag is not previously set", async () => {
      const bound = new BoundTag("Snowflake", "1234", "max");
      assert.strictEqual(await bound.get(5), 5);
    });

    it("returns undefined value when the tag is not previously set", async () => {
      const bound = new BoundTag("Snowflake", "1234", "max");
      assert.strictEqual(await bound.get(), undefined);
    });
  });

  describe("#set", async () => {
    it("creates a tag if it did not exist", async () => {
      const vector = {
        ownerType: "Snowflake",
        ownerId: "1234",
        key: "max",
        value: 15,
      };
      const bound = new BoundTag(vector.ownerType, vector.ownerId, vector.key);
      await bound.set(vector.value);
      assert.strictEqual(1, await Tag.count({ where: vector }));
    });

    it("updates the value of a previously set tag", async () => {
      const vector = {
        ownerType: "Snowflake",
        ownerId: "12345678",
        key: "max",
        value: 5,
      };
      await Tag.create(vector);

      const bound = new BoundTag(vector.ownerType, vector.ownerId, vector.key);
      await bound.set(10);
      assert.strictEqual(
        1,
        await Tag.count({ where: { ...vector, value: 10 } }),
      );
    });
  });

  describe("#delete", async () => {
    it("will delete the tag", async () => {
      const vector = {
        ownerType: "Snowflake",
        ownerId: "1234",
        key: "count",
      };
      await Tag.create({ ...vector, value: 5 });
      const bound = new BoundTag("Snowflake", "1234", "count");
      await bound.delete();
      assert.strictEqual(0, await Tag.count({ where: vector }));
    });

    it("will not fail if the tag did not exist", () => {
      const bound = new BoundTag("Snowflake", "1234", "count");
      assert.doesNotReject(bound.delete());
    });
  });
});
