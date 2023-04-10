# djs-tagbag

## About

This plugin allows your bot to quickly persist settings which can be retrieved later even after the bot starts.

In order to store the data, it uses a database stored in your file system. You can save data using tags which are key-value entities bound to API objects like Guilds, Messages, Channels, GuildMembers… or pretty much anything that you can imagine.

## Installation and requirements

Install the project using:

```
npm i --save djs-tagbag
```

You can use TypeScript or plain JavaScript. You can use ES Modules or CommonJS. I don't want to have an opinion or that, my idea is that it should work out of the box. **Please open an issue if something goes wrong**.

I don't depend on Discord.js. However, if you are using the TypeScript version, you will need the types because I verify that you use Snowflakes and not just any kind of string. However, I don't check the version since all versions starting with Discord.js 11 have the same exported type called `Snowflake`, so it should work out of the box as long as Discord.js exports a type called like this.

## Configuration

Call `initDatabase()` during your application initialization. Pass the path to the database as a parameter. This will internally set the database bound to the tags, so in future calls to Tag and TagBad methods, it will use the database that you provide.

```js
const client = new Client({ ... });
client.on("ready", async () => {
	await initDatabase("settings.db");
});
```

You can additionally provide some extra options when calling the `initDatabase` function by providing an extra object. The following keys are accepted:

- `logger` (boolean): whether to enable logging. If enabled, will print the executed queries to the console when the application is running.

Here is an example where the queries would be logged if the `LOG_QUERIES` environment variable has been set:

```js
await initDatabase("settings.db", {
  logger: !!process.env.LOG_QUERIES,
});
```

After awaiting for `initDatabase`, your database file should be ready and you should be able to use the tagbag and tags from now on.

## How to use

**Tags** are key-value settings stored in the database. They are always bound into an owning entity. So the first thing you will need to do is to create a **TagBag**. The TagBag is a class that holds a list of tags belonging to a specific entity in the system.

```js
const messageBag = new TagBag("Message", msg.id);
const channelBag = new TagBag("Channel", msg.channel.id);
const userBag = new TagBag("User", msg.author.id);
```

You might be wondering why we need to pass the category of the entity, given that snowflakes should be unique.

This is partially true. However, for a brief period of time, snowflakes were not unique in Discord. For instance, there used to be a time when the first channel created right after setting up a new guild had the same ID as the guild it belonged to.

That is the whole reason. Nowadays this behaviour has been fixed, and the snowflakes are always different in Discord. However, in order to protect these old channels of old servers, I decided to keep this workaround. I'm sorry.

Once you have a tagbag, you can use it to fetch specific tags:

```js
// Given the following tagbag.
const userBag = new TagBag("User", msg.author.id);

// The following examples retrieve specific tags.
const scoreTag = userBag.tag("score");
const levelTag = userBag.tag("level");
const didSentMessageTag = userBag.tag("didSentMessage");
```

And once you have a tag, you can use the Tag API to get, set or delete the value of the tag. **All the methods are async and return promises.**

- `get()`: resolves to the current value of a tag. If the tag does not have a value, it will return a fallback value which can be given as a parameter. (Otherwise it just resolves to `undefined`). **Note that if the tag does not have a value yet, this is not an error, it will resolve to a fallback or to an undefined**.

- `set(value)`: sets the tag to the value given as a parameter. It is async and it will resolve once the value is stored in the database.

- `delete()`: removes the value of the tag, if it was set. Otherwise, it is just a noop.

Examples:

```js
// Given the following tagbag and tag
const userBag = new TagBag("User", msg.author.id);
const scoreTag = userBag.tag("score");

// The following code will give the level, or undefined if not set.
const level = await scoreTag.get();

// The following code will give the level, or 0 as a fallback.
const level_ = await scoreTag.get(0);

// Set the level to something
await scoreTag.set(5);

// This should now return 5 if the set was successful.
const level__ = await scoreTag.get();

// Delete the tag value.
await scoreTag.delete();
```

## TypeScript support

Fully supported. Plus, the Tag class actually will make use of a generic. You can use it to type the value of a tag and help with the type inference on the other variables that you use. An example of this (probably not the best example, but you get the idea):

```ts
const bag = new TagBag("Message", msg.id);
const tag = bag.tag<number>("score");
// `tag` is now a Tag<number>, which means
// that it will get and set numbers.

const value = await tag.get();
// value should now be of type `number`.

await tag.set("hello");
// This should be marked as an error since
// the value of the tag must be of type number.
```

## Copyright and license

[ISC License](https://opensource.org/licenses/ISC). Happy to hear about
cool projects using this library.

```
Copyright 2023 Dani Rodríguez

Permission to use, copy, modify, and/or distribute this software for
any purpose with or without fee is hereby granted, provided that the
above copyright notice and this permission notice appear in all copies.

THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL
WARRANTIES WITH REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES
OF MERCHANTABILITY AND FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE
FOR ANY SPECIAL, DIRECT, INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY
DAMAGES WHATSOEVER RESULTING FROM LOSS OF USE, DATA OR PROFITS, WHETHER
IN AN ACTION OF CONTRACT, NEGLIGENCE OR OTHER TORTIOUS ACTION, ARISING
OUT OF OR IN CONNECTION WITH THE USE OR PERFORMANCE OF THIS SOFTWARE.
```
