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


  var CameraNavigation = function (_ref) {
    var changeView = _ref.changeView;

    return (0, _preact.h)(
      'div',
      { 'class': 'onfido-actions' },
      (0, _preact.h)(
        'a',
        { className: 'onfido-btn-nav', onClick: changeView.bind(undefined, false, 'home') },
        (0, _preact.h)(
          'span',
          null,
          '← Back'
        )
      ),
      (0, _preact.h)(
        'a',
        { rel: 'modal:close', className: 'onfido-btn-nav' },
        (0, _preact.h)(
          'span',
          null,
          '× Close'
        )
      )
    );
  };

  exports.default = CameraNavigation;
  module.exports = exports['default'];
});