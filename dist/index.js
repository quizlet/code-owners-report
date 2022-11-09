'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.formatMarkdownReport = exports.findCodeownersPath = exports.generateReport = undefined;

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _codeowners = require('./codeowners');

Object.defineProperty(exports, 'findCodeownersPath', {
  enumerable: true,
  get: function get() {
    return _codeowners.findCodeownersPath;
  }
});

var _formatMarkdown = require('./formatMarkdown');

Object.defineProperty(exports, 'formatMarkdownReport', {
  enumerable: true,
  get: function get() {
    return _formatMarkdown.formatReport;
  }
});

var _measureFileTree = require('./measureFileTree');

var _measureFileTree2 = _interopRequireDefault(_measureFileTree);

var _aggregateCounts = require('./aggregateCounts');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

/**
 * Generate a report over the `basedir`
 */
const generateReport = exports.generateReport = (() => {
  var _ref = _asyncToGenerator(function* (basedirOpt, reportSpec, ignores = [], codeownersPath) {
    console.log({ ignores });
    const ownerEntries = codeownersPath ? (0, _codeowners.parseCodeownersFile)(codeownersPath) : null;

    const basedirs = Array.isArray(basedirOpt) ? basedirOpt : [basedirOpt];
    console.log('basedirs', basedirs);
    const filesByDir = yield Promise.all(basedirs.map(function (d) {
      return (0, _measureFileTree2.default)(d, reportSpec, ignores);
    }));
    const eachFile = filesByDir.reduce(function (acc, curr) {
      return _extends({}, acc, curr);
    }, {});

    const allSum = (0, _aggregateCounts.sumAll)(reportSpec, eachFile);
    let ownerSum = null;
    if (ownerEntries) {
      ownerSum = (0, _aggregateCounts.sumByOwner)(reportSpec, eachFile, ownerEntries);
      var _iteratorNormalCompletion = true;
      var _didIteratorError = false;
      var _iteratorError = undefined;

      try {
        for (var _iterator = Object.keys(eachFile)[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
          const filename = _step.value;

          (0, _codeowners.addOwners)(ownerEntries, filename, eachFile[filename]);
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
    }
    return { eachFile, allSum, ownerSum };
  });

  return function generateReport(_x, _x2) {
    return _ref.apply(this, arguments);
  };
})();