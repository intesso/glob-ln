/*
 * module dependencies
 */

var fs = require('fs');
var path = require('path');
var resolve = require('glob-resolve');
var onetime = require('onetime');
var after = require('after');
var debug = require('debug')('glob-ln:debug');

/*
 * api functions
 */

exports.async = function(srcPattern, destPattern, options, cb) {
  // get arguments right
  if (typeof options === 'function') cb = options, options = {};
  if (!options) options = {};
  // make sure cb is only called once
  cb = onetime(cb || noop);


  resolve(srcPattern, destPattern, options, function(err, result) {
    if (err) return cb(err);
    var srcPaths = result.src.paths;
    var destPaths = result.dest.paths;
    debug('src', srcPaths, ' / dest', destPaths);

    var next = after(srcPaths.length, cb);

    srcPaths.forEach(function(src, i) {
      var dest = destPaths[i];

      fs.stat(src, function(err, stat) {

        var isDir = stat.isDirectory();
        var type = isDir ? 'dir' : 'file';

        try {
          fs.unlink(dest, function(err) {
            if (err) return next(err);
            fs.symlink(src, dest, type, next);
          });
        } catch (err) {
          // most likely link didn't exist, which is o.k.
          fs.symlink(src, dest, type, next);
        }

      });

    });

  });

};

exports = module.exports = exports.async;

exports.sync = function(srcPattern, destPattern, options) {
  // extract src vars
  var result = resolve.sync(srcPattern, destPattern, options);

  var srcPaths = result.src.paths;
  var destPaths = result.dest.paths;

  srcPaths.forEach(function(src, i) {
    var dest = destPaths[i];

    var stat = fs.statSync(src);
    var isDir = stat.isDirectory();
    var type = isDir ? 'dir' : 'file';

    try {
      fs.unlinkSync(dest);
    } catch (err) {
      // most likely link didn't exist, which is o.k.
    } finally {
      fs.symlinkSync(src, dest, type);
    }

  });

};

/*
 * helper functions
 */

function noop() {
}
