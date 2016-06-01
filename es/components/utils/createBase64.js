(function (global, factory) {
  if (typeof define === "function" && define.amd) {
    define(['exports'], factory);
  } else if (typeof exports !== "undefined") {
    factory(exports);
  } else {
    var mod = {
      exports: {}
    };
    factory(mod.exports);
    global.createBase64 = mod.exports;
  }
})(this, function (exports) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  var createBase64 = exports.createBase64 = function (canvas, video, dimensions, callback) {
    if (!video || !dimensions) return;
    var ratio = dimensions.ratio;

    var ctx = canvas.getContext('2d');
    var width = 960;
    var height = 960 / ratio;
    canvas.width = width;
    canvas.height = height;
    ctx.drawImage(video, 0, 0, width, height);
    var image = canvas.toDataURL('image/webp');
    callback(image);
  };
});