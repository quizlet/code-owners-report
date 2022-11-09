'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.addOwners = exports.whoOwns = exports.parseCodeownersFile = exports.findCodeownersPath = undefined;

var _findUp = require('find-up');

var _findUp2 = _interopRequireDefault(_findUp);

var _fs = require('fs');

var _fs2 = _interopRequireDefault(_fs);

var _ignore = require('ignore');

var _ignore2 = _interopRequireDefault(_ignore);

var _path = require('path');

var _path2 = _interopRequireDefault(_path);

var _trueCasePath = require('true-case-path');

var _trueCasePath2 = _interopRequireDefault(_trueCasePath);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _toArray(arr) { return Array.isArray(arr) ? arr : Array.from(arr); }
// Lots copied from https://github.com/beaugunderson/codeowners/blob/master/codeowners.js

const findCodeownersPath = exports.findCodeownersPath = () => {
  const codeownersPath = _findUp2.default.sync('CODEOWNERS', { cwd: process.cwd() });

  if (!codeownersPath) {
    throw new Error('findCodeownersPath() failed. Please specify instead.');
  }

  const trueCaseCodeownersPath = (0, _trueCasePath2.default)(codeownersPath);

  const codeownersFile = _path2.default.basename(trueCaseCodeownersPath);

  if (codeownersFile !== 'CODEOWNERS') {
    throw new Error(`Found a CODEOWNERS file but it was lower-cased: ${trueCaseCodeownersPath}`);
  }
  return trueCaseCodeownersPath;
};

function ownerMatcher(pathString) {
  const matcher = (0, _ignore2.default)().add(pathString);

  return function (fileString) {
    return matcher.ignores(fileString);
  };
}

const parseCodeownersFile = exports.parseCodeownersFile = pathname => {
  const lines = _fs2.default.readFileSync(pathname).toString().split('\n');
  const ownerEntries = [];

  lines.forEach(line => {
    if (!line) {
      return;
    }

    if (line.startsWith('#')) {
      return;
    }

    var _line$split = line.split(/\s+/),
        _line$split2 = _toArray(_line$split);

    const pathString = _line$split2[0],
          usernames = _line$split2.slice(1);

    ownerEntries.push({
      path: pathString,
      usernames,
      match: ownerMatcher(pathString)
    });
  });
  return ownerEntries;
};

/*
 * Return list of owners per CODEOWNERS for the given file.
 */
// TODO memoize to cache between repeated calls from different sites
const whoOwns = exports.whoOwns = (ownersEntries, filePath) => {
  let lastMatchingEntry = { usernames: [] };
  var _iteratorNormalCompletion = true;
  var _didIteratorError = false;
  var _iteratorError = undefined;

  try {
    for (var _iterator = ownersEntries[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
      const entry = _step.value;

      if (entry.match(filePath)) {
        lastMatchingEntry = entry;
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

  return lastMatchingEntry.usernames;
};

const addOwners = exports.addOwners = (ownersEntries, filePath, metrics) => {
  const owners = whoOwns(ownersEntries, filePath).join(', ');
  Object.assign(metrics, { owners });
};