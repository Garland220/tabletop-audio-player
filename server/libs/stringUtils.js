'use strict';

function firstToUpper(string) {
  return string.charAt(0).toUpperCase() + string.slice(1);
}

String.prototype.firstToUpper = function() {
  return firstToUpper(this);
};

module.exports = firstToUpper;
