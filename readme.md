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
var options = {force: true};
ln(src, dest, function(err) {
    if (err) console.error(err);
});

```

```js
//or sync version
ln.sync('fixtures/:module/public', 'public/:module');

```
 > use absolute paths on `src` and `dest` to create links.
 
 > you can use the whole [glob](https://github.com/isaacs/node-glob) syntax in the `src` and `dest` pattern, as well as the `glob-var` variables starting with a colon `:`

# functions

## ln(srcPattern, destPattern [,options] ,callback)
async glob ln version.

## ln.sync(srcPattern, destPattern [,options])
sync glob ln version.


# options

```js
// options with the following default values:
var options = {

  // remove destination before operation
  force: false

};
```

# test
```bash
npm test
```

# license
MIT


