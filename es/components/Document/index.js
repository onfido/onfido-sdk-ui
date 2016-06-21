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
  exports.DocumentInstructions = exports.DocumentNotFound = undefined;
  var DocumentNotFound = exports.DocumentNotFound = function () {
    return (0, _preact.h)(
      'div',
      { className: 'onfido-upload-text onfido-upload-error' },
      'We couldn’t detect a passport or identity card in this image. Please upload another one.'
    );
  };

  var DocumentInstructions = exports.DocumentInstructions = function () {
    return (0, _preact.h)(
      'div',
      { className: 'onfido-capture-ui' },
      (0, _preact.h)(
        'p',
        { className: 'onfido-hint' },
        'Hold your document up to the camera. It will be detected automatically.'
      )
    );
  };
});