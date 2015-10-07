var test = require('tape');
var fs = require('fs');
var equal = require('object-equal');
var ln = require('../index');
var rm = require('rimraf');

test('do async directory', function(t) {

  cleanup();

  var src = __dirname + '/fixtures/:module/public';
  var dest = __dirname + '/public/:module';

  ln(src, dest, function(err) {

    t.ok(!err);
    t.ok(exists(__dirname + '/public/test_pub'));
    t.ok(exists(__dirname + '/public/Irish-Pub'));

    t.end(err);
  });

});

test('do sync directory', function(t) {

  cleanup();

  var src = __dirname + '/fixtures/:module/public';
  var dest = __dirname + '/public/:module';

  ln.sync(src, dest);

  t.ok(exists(__dirname + '/public/test_pub'));
  t.ok(exists(__dirname + '/public/Irish-Pub'));

  t.end();

});

test('do async files', function(t) {

  cleanup();

  var src = __dirname + '/fixtures/:module/public/js/*.*';
  var dest = __dirname + '/public/:module/js/*.*';

  ln(src, dest, function(err) {

    t.ok(!err);
    t.ok(exists(__dirname + '/public/test_pub/js/bundle.js'));
    t.ok(exists(__dirname + '/public/Irish-Pub/js/bundle.js'));

    t.end(err);
  });

});

test('do sync files', function(t) {

  cleanup();

  var src = __dirname + '/fixtures/:module/public/js/*.*';
  var dest = __dirname + '/public/:module/js/*.*';

  ln.sync(src, dest);

  t.ok(exists(__dirname + '/public/test_pub/js/bundle.js'));
  t.ok(exists(__dirname + '/public/Irish-Pub/js/bundle.js'));

  t.end();

});

test('do sync files with force', function(t) {

  cleanup();
  fs.mkdirSync(__dirname + '/public');
  fs.mkdirSync(__dirname + '/public/Irish-Pub');
  fs.mkdirSync(__dirname + '/public/test_pub');

  var src = __dirname + '/fixtures/:module/public/js/*.*';
  var dest = __dirname + '/public/:module/js/*.*';
  var options = {force:true};

  ln.sync(src, dest, options);

  t.ok(exists(__dirname + '/public/test_pub/js/bundle.js'));
  t.ok(exists(__dirname + '/public/Irish-Pub/js/bundle.js'));

  t.end();

});


test('do sync directory with force', function(t) {

  cleanup();
  fs.mkdirSync(__dirname + '/public');
  fs.mkdirSync(__dirname + '/public/Irish-Pub');
  fs.mkdirSync(__dirname + '/public/test_pub');

  var src = __dirname + '/fixtures/:module/public';
  var dest = __dirname + '/public/:module';
  var options = {force:true};

  ln.sync(src, dest, options);

  t.ok(exists(__dirname + '/public/test_pub'));
  t.ok(exists(__dirname + '/public/Irish-Pub'));

  t.end();

});



function cleanup() {
  rm.sync(__dirname + '/public');
}

function exists(p) {
  try {
    var fd = fs.openSync(p, 'r');
    return !!fd;
  } catch (err) {
    return false;
  }
}