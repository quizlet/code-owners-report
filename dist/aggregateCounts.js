'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.sumByOwner = exports.sumAll = undefined;

var _codeowners = require('./codeowners');

var _config = require('./config');

const mkInitialCounts = spec => {
  const headings = [_config.FILES_SUM_METRIC_KEY].concat(spec.regexpMetrics && Object.keys(spec.regexpMetrics), spec.eslintFlags && Object.keys(spec.eslintFlags));
  const counts = {};
  var _iteratorNormalCompletion = true;
  var _didIteratorError = false;
  var _iteratorError = undefined;

  try {
    for (var _iterator = headings[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
      const heading = _step.value;

      if (heading) {
        counts[heading] = 0;
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

  return counts;
};

const sumAll = exports.sumAll = (spec, filesMetricsMap) => {
  const counts = mkInitialCounts(spec);

  var _iteratorNormalCompletion2 = true;
  var _didIteratorError2 = false;
  var _iteratorError2 = undefined;

  try {
    for (var _iterator2 = Object.keys(filesMetricsMap)[Symbol.iterator](), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
      const filename = _step2.value;

      const fileMetrics = filesMetricsMap[filename];
      var _iteratorNormalCompletion3 = true;
      var _didIteratorError3 = false;
      var _iteratorError3 = undefined;

      try {
        for (var _iterator3 = Object.keys(fileMetrics)[Symbol.iterator](), _step3; !(_iteratorNormalCompletion3 = (_step3 = _iterator3.next()).done); _iteratorNormalCompletion3 = true) {
          const heading = _step3.value;

          // metric value may be boolean, but that'll cast here to 1 or 0
          counts[heading] += fileMetrics[heading];
        }
      } catch (err) {
        _didIteratorError3 = true;
        _iteratorError3 = err;
      } finally {
        try {
          if (!_iteratorNormalCompletion3 && _iterator3.return) {
            _iterator3.return();
          }
        } finally {
          if (_didIteratorError3) {
            throw _iteratorError3;
          }
        }
      }
    }
  } catch (err) {
    _didIteratorError2 = true;
    _iteratorError2 = err;
  } finally {
    try {
      if (!_iteratorNormalCompletion2 && _iterator2.return) {
        _iterator2.return();
      }
    } finally {
      if (_didIteratorError2) {
        throw _iteratorError2;
      }
    }
  }

  counts[_config.FILES_SUM_METRIC_KEY] = Object.keys(filesMetricsMap).length;

  return counts;
};

const sumByOwner = exports.sumByOwner = (spec, filesMetricsMap, ownerEntries) => {
  const ownerCounts = {};

  var _iteratorNormalCompletion4 = true;
  var _didIteratorError4 = false;
  var _iteratorError4 = undefined;

  try {
    for (var _iterator4 = Object.keys(filesMetricsMap)[Symbol.iterator](), _step4; !(_iteratorNormalCompletion4 = (_step4 = _iterator4.next()).done); _iteratorNormalCompletion4 = true) {
      const filename = _step4.value;

      const owners = (0, _codeowners.whoOwns)(ownerEntries, filename);
      var _iteratorNormalCompletion5 = true;
      var _didIteratorError5 = false;
      var _iteratorError5 = undefined;

      try {
        for (var _iterator5 = owners[Symbol.iterator](), _step5; !(_iteratorNormalCompletion5 = (_step5 = _iterator5.next()).done); _iteratorNormalCompletion5 = true) {
          const owner = _step5.value;

          if (!ownerCounts[owner]) {
            ownerCounts[owner] = mkInitialCounts(spec);
          }
          const fileMetrics = filesMetricsMap[filename];
          var _iteratorNormalCompletion6 = true;
          var _didIteratorError6 = false;
          var _iteratorError6 = undefined;

          try {
            for (var _iterator6 = Object.keys(fileMetrics)[Symbol.iterator](), _step6; !(_iteratorNormalCompletion6 = (_step6 = _iterator6.next()).done); _iteratorNormalCompletion6 = true) {
              const heading = _step6.value;

              // HACK for passing owners info on the metrics object
              // eslint-disable-next-line no-continue
              if (heading === 'owners') continue;
              // metric value may be boolean, but that'll cast here to 1 or 0
              ownerCounts[owner][heading] += fileMetrics[heading];
            }
          } catch (err) {
            _didIteratorError6 = true;
            _iteratorError6 = err;
          } finally {
            try {
              if (!_iteratorNormalCompletion6 && _iterator6.return) {
                _iterator6.return();
              }
            } finally {
              if (_didIteratorError6) {
                throw _iteratorError6;
              }
            }
          }

          ownerCounts[owner][_config.FILES_SUM_METRIC_KEY] += 1;
        }
      } catch (err) {
        _didIteratorError5 = true;
        _iteratorError5 = err;
      } finally {
        try {
          if (!_iteratorNormalCompletion5 && _iterator5.return) {
            _iterator5.return();
          }
        } finally {
          if (_didIteratorError5) {
            throw _iteratorError5;
          }
        }
      }
    }
  } catch (err) {
    _didIteratorError4 = true;
    _iteratorError4 = err;
  } finally {
    try {
      if (!_iteratorNormalCompletion4 && _iterator4.return) {
        _iterator4.return();
      }
    } finally {
      if (_didIteratorError4) {
        throw _iteratorError4;
      }
    }
  }

  return ownerCounts;
};