'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
const countRegExpMatches = exports.countRegExpMatches = (contents, expressionMap) => {
  const matches = {};
  var _iteratorNormalCompletion = true;
  var _didIteratorError = false;
  var _iteratorError = undefined;

  try {
    for (var _iterator = Object.keys(expressionMap)[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
      const key = _step.value;

      const re = expressionMap[key];
      matches[key] = (contents.match(re) || []).length;
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

  return matches;
};