/*
 * module dependencies
 */

var fs = require('fs');
var path = require('path');
var mkdirp = require('mkdirp');
var rimraf = require('rimraf');
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
    debug('\n\rsrc', srcPaths, ' \n\rdest', destPaths);

    var next = after(srcPaths.length, cb);

    srcPaths.forEach(function(src, i) {
      src = path.resolve(src);
      var dest = path.resolve(destPaths[i]);

      // make sure the dest directory exists
      var destPath = (dest.charAt(dest.length - 1) == '/') ? dest.slice(0, -1) : dest;
      var dir = path.dirname(destPath);
      mkdirp(dir, options, function(err, result) {
        if (err) return next(err);

        // check src type
        fs.stat(src, function(err, stat) {
          if (err) return next(err);
          var type = stat.isDirectory() ? 'dir' : 'file';

          if (!options.force) {
            try {
              // try unlink first
              fs.unlink(dest, function(err) {
                // catch err and try to make link
                fs.symlink(src, dest, type, next);
              });
            } catch (err) {
              // most likely link didn't exist, which is o.k.
              // so make link anyway
              fs.symlink(src, dest, type, next);
            }
          } else {
            rimraf.sync(dest);
            fs.symlink(src, dest, type, next);
          }

        });

      });

    });

  });

};

exports = module.exports = exports.async;

exports.sync = function(srcPattern, destPattern, options) {
  if (!options) options = {};

  // extract src vars
  var result = resolve.sync(srcPattern, destPattern, options);

  var srcPaths = result.src.paths;
  var destPaths = result.dest.paths;

  srcPaths.forEach(function(src, i) {
    src = path.resolve(src);
    var dest = path.resolve(destPaths[i]);


    // make sure the dest directory exists
    var destPath = (dest.charAt(dest.length - 1) == '/') ? dest.slice(0, -1) : dest;
    var dir = path.dirname(destPath);
    mkdirp.sync(dir, options);

    // check src type
    var stat = fs.statSync(src);
    var type = stat.isDirectory() ? 'dir' : 'file';

    if (!options.force) {
      try {
        // try unlink first
        fs.unlinkSync(dest);
      } catch (err) {
        // most likely link didn't exist, which is o.k.
      } finally {
        fs.symlinkSync(src, dest, type);
      }
    } else {
      rimraf.sync(dest);
      fs.symlinkSync(src, dest, type);
    }

  });

};

/*
 * helper functions
 */

function noop() {
}
