'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.countEslintRuleViolations = undefined;

var _eslint = require('eslint');

const eslinter = new _eslint.CLIEngine({
  useEslintrc: true
});

const countEslintRuleViolations = exports.countEslintRuleViolations = (contents, ruleFlags) => {
  var _eslinter$executeOnTe = eslinter.executeOnText(contents);

  const results = _eslinter$executeOnTe.results;

  // only one result possible for executeOnText()

  const fileMessages = results[0].messages;

  const eslintCounts = fileMessages.reduce((acc = {}, message) => {
    const ruleId = message.ruleId;

    if (ruleFlags[ruleId]) {
      acc[ruleId] = 1 + (acc[ruleId] || 0);
    }
    return acc;
  }, {});

  return eslintCounts;
};