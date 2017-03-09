# node-red-contrib-redis-storage
An implementation of the [Node-RED Storage API](http://nodered.org/docs/api/storage/) using Redis.

This works particularly well if you want to host Node-RED on a Heroku instance, or any other provider that uses an ephemeral filesystem.

## Usage

Install the npm package by running `npm install node-red-contrib-redis-storage` or `npm install node-red-contrib-redis-storage --save` to save it to your package.json file.

Then, add the following configuration option to your `settings.js` file:
```javascript
storageModule: require("node-red-contrib-redis-storage")
```

If you're running in a non-local environment, configure the Redis URL by setting an environment variable: `REDIS_URL`.

Then, start Node-RED and all of your data will be persisted to Redis, rather than the filesystem.

## Contributing

Pull requests are welcome!

Please post feature requests, bug reports and suggestions in the Github issue tracker.

## License

### ISC License (ISC)
Copyright 2017, Andrew Allen

Permission to use, copy, modify, and/or distribute this software for any purpose with or without fee is hereby granted, provided that the above copyright notice and this permission notice appear in all copies.

THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES WITH REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR ANY SPECIAL, DIRECT, INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES WHATSOEVER RESULTING FROM LOSS OF USE, DATA OR PROFITS, WHETHER IN AN ACTION OF CONTRACT, NEGLIGENCE OR OTHER TORTIOUS ACTION, ARISING OUT OF OR IN CONNECTION WITH THE USE OR PERFORMANCE OF THIS SOFTWARE.
