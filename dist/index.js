"use strict";

function _toConsumableArray(arr) { return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _unsupportedIterableToArray(arr) || _nonIterableSpread(); }

function _nonIterableSpread() { throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }

function _iterableToArray(iter) { if (typeof Symbol !== "undefined" && iter[Symbol.iterator] != null || iter["@@iterator"] != null) return Array.from(iter); }

function _arrayWithoutHoles(arr) { if (Array.isArray(arr)) return _arrayLikeToArray(arr); }

function _slicedToArray(arr, i) { return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _unsupportedIterableToArray(arr, i) || _nonIterableRest(); }

function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }

function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }

function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }

function _iterableToArrayLimit(arr, i) { var _i = arr && (typeof Symbol !== "undefined" && arr[Symbol.iterator] || arr["@@iterator"]); if (_i == null) return; var _arr = []; var _n = true; var _d = false; var _s, _e; try { for (_i = _i.call(arr); !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"] != null) _i["return"](); } finally { if (_d) throw _e; } } return _arr; }

function _arrayWithHoles(arr) { if (Array.isArray(arr)) return arr; }

var _require = require('./util'),
    flatten = _require.flatten,
    zip = _require.zip;

var updateBlockquote = require('./blockquoteTokens');

module.exports = function markdownItAttribution(md, options) {
  var attributionPrefix = options && options.attributionPrefix || '--';
  var Token;

  function setupBlockquoteRule() {
    md.core.ruler.after('block', 'attribution', blockquoteRule);
  }

  function blockquoteRule(state) {
    // make Token constructor accessible to deeply nested helper functions
    Token = state.Token;
    var indicePairs = blockquoteIndicePairs(state.tokens);
    indicePairs.forEach(function (indices) {
      var _indices = _slicedToArray(indices, 2),
          fromIndex = _indices[0],
          toIndex = _indices[1];

      var originalBlockquoteTokens = state.tokens.slice(fromIndex, toIndex + 1);
      var updatedBlockquoteTokens = customBlockquoteTokens(originalBlockquoteTokens);
      replaceBlockquoteTokens(state.tokens, fromIndex, toIndex, updatedBlockquoteTokens);
    });
  }

  function blockquoteIndicePairs(tokens) {
    var blockquoteOpenIndices = indicesWithTokenType(tokens, 'blockquote_open');
    var blockquoteCloseIndices = indicesWithTokenType(tokens, 'blockquote_close');
    return zip(blockquoteOpenIndices, blockquoteCloseIndices);
  }

  function replaceBlockquoteTokens(tokens, fromIndex, toIndex, updatedTokens) {
    var deleteCount = toIndex - fromIndex + 1;
    tokens.splice.apply(tokens, [fromIndex, deleteCount].concat(_toConsumableArray(updatedTokens)));
  }

  function customBlockquoteTokens(blockquoteTokens) {
    var openingToken = blockquoteTokens[0];
    var closingToken = blockquoteTokens[blockquoteTokens.length - 1];
    var updatedBlockquoteTokens = updateBlockquote(blockquoteTokens, Token, attributionPrefix);
    return flatten([openingToken, updatedBlockquoteTokens, closingToken]);
  }

  function indicesWithTokenType(tokens, tokenType) {
    var mapped = tokens.map(function (token, index) {
      return token.type === tokenType ? index : null;
    });
    var filtered = mapped.filter(function (element) {
      return element !== null;
    });
    return filtered;
  }

  setupBlockquoteRule();
};