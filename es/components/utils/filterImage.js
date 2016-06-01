(function (global, factory) {
  if (typeof define === "function" && define.amd) {
    define(['module', 'exports'], factory);
  } else if (typeof exports !== "undefined") {
    factory(module, exports);
  } else {
    var mod = {
      exports: {}
    };
    factory(mod, mod.exports);
    global.filterImage = mod.exports;
  }
})(this, function (module, exports) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = filterImage;
  function filterImage(image) {
    switch (typeof image) {
      case 'string':
        return image.split(',')[1];
      case 'object':
        return image;
      default:
        return;
    }
  }
  module.exports = exports['default'];
});