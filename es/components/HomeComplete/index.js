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


  var HomeComplete = function () {
    return (0, _preact.h)(
      'div',
      { className: 'onfido-complete' },
      (0, _preact.h)(
        'div',
        { className: 'onfido-header' },
        'Complete'
      ),
      (0, _preact.h)(
        'div',
        { className: 'onfido-method-selector onfido-method' },
        (0, _preact.h)('span', { className: 'onfido-icon onfido-icon--complete' }),
        (0, _preact.h)(
          'p',
          { className: 'onfido-complete-text' },
          'Everything is complete, thank you.',
          (0, _preact.h)('br', null),
          'You can now close this window.'
        )
      )
    );
  };

  exports.default = HomeComplete;
  module.exports = exports['default'];
});