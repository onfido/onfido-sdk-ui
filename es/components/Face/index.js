(function (global, factory) {
  if (typeof define === "function" && define.amd) {
    define(['exports', 'preact'], factory);
  } else if (typeof exports !== "undefined") {
    factory(exports, require('preact'));
  } else {
    var mod = {
      exports: {}
    };
    factory(mod.exports, global.preact);
    global.index = mod.exports;
  }
})(this, function (exports, _preact) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.FaceInstructions = undefined;
  var FaceInstructions = exports.FaceInstructions = function (_ref) {
    var handeClick = _ref.handeClick;

    return (0, _preact.h)(
      'div',
      { className: 'onfido-capture-ui' },
      (0, _preact.h)(
        'button',
        { id: 'onfido-capture', className: 'onfido-btn onfido-btn-primary onfido-btn-capture', onClick: handeClick },
        'Take photo'
      )
    );
  };
});