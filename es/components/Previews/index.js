(function (global, factory) {
  if (typeof define === "function" && define.amd) {
    define(['module', 'exports', 'preact'], factory);
  } else if (typeof exports !== "undefined") {
    factory(module, exports, require('preact'));
  } else {
    var mod = {
      exports: {}
    };
    factory(mod, mod.exports, global.preact);
    global.index = mod.exports;
  }
})(this, function (module, exports, _preact) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });


  var Retake = function (_ref) {
    var action = _ref.action;

    return (0, _preact.h)(
      'p',
      { className: 'onfido-retake' },
      (0, _preact.h)(
        'button',
        {
          onClick: function () {
            return action(false);
          },
          className: 'onfido-btn onfido-btn-outline'
        },
        'Retake?'
      )
    );
  };

  var Captures = function (_ref2) {
    var captures = _ref2.captures;

    var filterValid = function (capture) {
      return capture.isValid;
    };

    var _captures$filter = captures.filter(filterValid);

    var capture = _captures$filter[0];

    return (0, _preact.h)(
      'div',
      { 'class': 'onfido-captures' },
      (0, _preact.h)('img', { src: capture.image, className: 'onfido-image' })
    );
  };

  var Previews = function (_ref3) {
    var captures = _ref3.captures;
    var method = _ref3.method;
    var action = _ref3.action;

    var methods = {
      'document': function () {
        return (0, _preact.h)(
          'div',
          { className: 'onfido-previews' },
          (0, _preact.h)(Captures, { captures: captures }),
          (0, _preact.h)(Retake, { action: action })
        );
      },
      'face': function () {
        return (0, _preact.h)(
          'div',
          { className: 'onfido-previews' },
          (0, _preact.h)(Captures, { captures: captures }),
          (0, _preact.h)(Retake, { action: action })
        );
      },
      'home': function () {
        return null;
      }
    };
    return (methods[method] || methods['home'])();
  };

  exports.default = Previews;
  module.exports = exports['default'];
});