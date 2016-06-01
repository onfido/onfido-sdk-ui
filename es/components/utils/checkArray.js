(function (global, factory) {
  if (typeof define === "function" && define.amd) {
    define(["module", "exports"], factory);
  } else if (typeof exports !== "undefined") {
    factory(module, exports);
  } else {
    var mod = {
      exports: {}
    };
    factory(mod, mod.exports);
    global.checkArray = mod.exports;
  }
})(this, function (module, exports) {
  "use strict";

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  var isEmpty = function (array) {
    if (array === undefined || array.length == 0) {
      return true;
    } else {
      return false;
    }
  };

  exports.default = isEmpty;
  module.exports = exports["default"];
});