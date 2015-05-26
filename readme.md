# glob-ln
link files and directories with [glob](https://github.com/isaacs/node-glob) patterns and [variables](https://github.com/intesso/glob-resolve).

# install

```bash
npm install glob-ln
```

# use

```js

var ln = require('glob-ln');

// async
var src = __dirname + '/fixtures/:module/public';
var dest = __dirname + '/public/:module';
ln(src, dest, function(err) {
    if (err) console.error(err);
});

```

```js
//or sync version
ln.sync('fixtures/:module/public', 'public/:module');

```

 > you can use the whole [glob](https://github.com/isaacs/node-glob) syntax in the `src` and `dest` pattern, as well as the `glob-var` variables starting with a colon `:`

# functions

## ln(srcPattern, destPattern [,options] ,callback)
async glob ln version.

## ln.sync(srcPattern, destPattern [,options])
sync glob ln version.


# test
```bash
npm test
```

# license
MIT


