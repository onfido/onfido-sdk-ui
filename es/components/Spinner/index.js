(function (global, factory) {
  if (typeof define === "function" && define.amd) {
    define(["module", "exports", "preact"], factory);
  } else if (typeof exports !== "undefined") {
    factory(module, exports, require("preact"));
  } else {
    var mod = {
      exports: {}
    };
    factory(mod, mod.exports, global.preact);
    global.index = mod.exports;
  }
})(this, function (module, exports, _preact) {
  "use strict";

  Object.defineProperty(exports, "__esModule", {
    value: true
  });


  var Spinner = function () {
    return (0, _preact.h)(
      "div",
      { className: "loader" },
      (0, _preact.h)(
        "div",
        { className: "loader-inner ball-scale-ripple-multiple" },
        (0, _preact.h)("div", null),
        (0, _preact.h)("div", null),
        (0, _preact.h)("div", null)
      )
    );
  };

  exports.default = Spinner;
  module.exports = exports["default"];
});