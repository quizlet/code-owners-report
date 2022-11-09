'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _fs = require('mz/fs');

var _fs2 = _interopRequireDefault(_fs);

var _regexpMetrics = require('./regexpMetrics');

var _eslintMetrics = require('./eslintMetrics');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

const measureFile = (() => {
  var _ref = _asyncToGenerator(function* (filePath, spec) {
    const metrics = {};

    const contents = yield _fs2.default.readFile(filePath, { encoding: 'utf8' });

    if (spec.regexpMetrics) {
      Object.assign(metrics, (0, _regexpMetrics.countRegExpMatches)(contents, spec.regexpMetrics));
    }

    if (spec.eslintFlags) {
      Object.assign(metrics, (0, _eslintMetrics.countEslintRuleViolations)(contents, spec.eslintFlags));
    }

    return metrics;
  });

  return function measureFile(_x, _x2) {
    return _ref.apply(this, arguments);
  };
})();

/**
 * Report metrics on every file within `dir`
 */

exports.default = (() => {
  var _ref2 = _asyncToGenerator(function* (dir, spec, ignoredPaths) {
    console.log(ignoredPaths);
    console.log('Measuring directory', dir);

    const metrics = {};

    // consider https://github.com/jergason/recursive-readdir
    const files = (_fs2.default.readdirSync(dir) || []).filter(function (filename) {
      return !ignoredPaths.some(function (filepath) {
        return filename.match(filepath);
      });
    });
    console.log({ files });
    // Revisit this if perf is an issue.
    var _iteratorNormalCompletion = true;
    var _didIteratorError = false;
    var _iteratorError = undefined;

    try {
      for (var _iterator = files[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
        const file = _step.value;

        const subpath = `${dir}/${file}`;
        if (_fs2.default.statSync(subpath).isDirectory()) {
          // eslint-disable-next-line no-await-in-loop
          const treeMetrics = yield measureFileTree(subpath, spec, ignoredPaths);
          Object.assign(metrics, treeMetrics);
        } else if (spec.omit && subpath.match(spec.omit)) {
          console.log('  omitting file', subpath);
        } else {
          console.log('  measuring file', subpath);
          // eslint-disable-next-line no-await-in-loop
          const fileMetrics = yield measureFile(subpath, spec);
          metrics[subpath] = fileMetrics;
        }
      }
    } catch (err) {
      _didIteratorError = true;
      _iteratorError = err;
    } finally {
      try {
        if (!_iteratorNormalCompletion && _iterator.return) {
          _iterator.return();
        }
      } finally {
        if (_didIteratorError) {
          throw _iteratorError;
        }
      }
    }

    return metrics;
  });

  function measureFileTree(_x3, _x4, _x5) {
    return _ref2.apply(this, arguments);
  }

  return measureFileTree;
})();