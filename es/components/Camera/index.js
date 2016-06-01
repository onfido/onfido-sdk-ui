(function (global, factory) {
  if (typeof define === "function" && define.amd) {
    define(['module', 'exports', 'preact', 'getusermedia', 'countup.js', 'classnames', 'blueimp-load-image/js/load-image', 'onfido-sdk-core', '../utils/randomString', '../utils/screenWidth', '../utils/createBase64', '../Document', '../Face', '../Uploader', '../CameraNavigation', '../Countdown', '../Previews'], factory);
  } else if (typeof exports !== "undefined") {
    factory(module, exports, require('preact'), require('getusermedia'), require('countup.js'), require('classnames'), require('blueimp-load-image/js/load-image'), require('onfido-sdk-core'), require('../utils/randomString'), require('../utils/screenWidth'), require('../utils/createBase64'), require('../Document'), require('../Face'), require('../Uploader'), require('../CameraNavigation'), require('../Countdown'), require('../Previews'));
  } else {
    var mod = {
      exports: {}
    };
    factory(mod, mod.exports, global.preact, global.getusermedia, global.countup, global.classnames, global.loadImage, global.onfidoSdkCore, global.randomString, global.screenWidth, global.createBase64, global.Document, global.Face, global.Uploader, global.CameraNavigation, global.Countdown, global.Previews);
    global.index = mod.exports;
  }
})(this, function (module, exports, _preact, _getusermedia, _countup, _classnames, _loadImage, _onfidoSdkCore, _randomString, _screenWidth, _createBase, _Document, _Face, _Uploader, _CameraNavigation, _Countdown, _Previews) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = undefined;

  var _getusermedia2 = _interopRequireDefault(_getusermedia);

  var _countup2 = _interopRequireDefault(_countup);

  var _classnames2 = _interopRequireDefault(_classnames);

  var _loadImage2 = _interopRequireDefault(_loadImage);

  var _randomString2 = _interopRequireDefault(_randomString);

  var _screenWidth2 = _interopRequireDefault(_screenWidth);

  var _CameraNavigation2 = _interopRequireDefault(_CameraNavigation);

  var _Countdown2 = _interopRequireDefault(_Countdown);

  var _Previews2 = _interopRequireDefault(_Previews);

  function _interopRequireDefault(obj) {
    return obj && obj.__esModule ? obj : {
      default: obj
    };
  }

  function _classCallCheck(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
      throw new TypeError("Cannot call a class as a function");
    }
  }

  function _possibleConstructorReturn(self, call) {
    if (!self) {
      throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
    }

    return call && (typeof call === "object" || typeof call === "function") ? call : self;
  }

  function _inherits(subClass, superClass) {
    if (typeof superClass !== "function" && superClass !== null) {
      throw new TypeError("Super expression must either be null or a function, not " + typeof superClass);
    }

    subClass.prototype = Object.create(superClass && superClass.prototype, {
      constructor: {
        value: subClass,
        enumerable: false,
        writable: true,
        configurable: true
      }
    });
    if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass;
  }

  var Camera = function (_Component) {
    _inherits(Camera, _Component);

    function Camera() {
      var _temp, _this, _ret;

      _classCallCheck(this, Camera);

      for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
        args[_key] = arguments[_key];
      }

      return _ret = (_temp = (_this = _possibleConstructorReturn(this, _Component.call.apply(_Component, [this].concat(args))), _this), _this.createImage = function () {
        var _this2 = _this;
        var canvas = _this2.canvas;
        var video = _this2.video;
        var dimensions = _this2.dimensions;
        var _this$props = _this.props;
        var method = _this$props.method;
        var handleImage = _this$props.handleImage;

        (0, _createBase.createBase64)(canvas, video, dimensions, function (image) {
          var payload = {
            id: (0, _randomString2.default)(),
            messageType: method,
            image: image
          };
          return handleImage(method, payload);
        });
      }, _this.capture = function (method) {
        var methods = {
          'document': function () {
            setTimeout(function () {
              return _this.video.play();
            }, 50);
            _this.interval = setInterval(function () {
              return _this.createImage();
            }, 1000);
          },
          'face': function () {
            return setTimeout(function () {
              return _this.video.play();
            }, 50);
          },
          'home': function () {
            return clearInterval(_this.interval);
          },
          'stop': function () {
            return clearInterval(_this.interval);
          },
          'default': function () {
            return null;
          }
        };
        return (methods[method] || methods['default'])();
      }, _this.captureOnce = function () {
        var options = { useEasing: false, useGrouping: false };
        var countdown = new _countup2.default(_this.countdown, 3, 0, 0, 3, options);
        countdown.start(function () {
          _this.video.pause();
          _this.createImage();
        });
      }, _this.init = function () {
        var _this$video = _this.video;
        var clientWidth = _this$video.clientWidth;
        var clientHeight = _this$video.clientHeight;

        var ratio = clientWidth / clientHeight;
        _this.dimensions = { clientWidth: clientWidth, clientHeight: clientHeight, ratio: ratio };
        _onfidoSdkCore.events.on('onBeforeOpen', function () {
          return _this.props.changeView();
        });
        _onfidoSdkCore.events.on('onBeforeClose', function () {
          return _this.capture('stop');
        });
      }, _this.renderVideo = function (method) {
        return (0, _preact.h)('video', {
          id: 'onfido-video',
          className: 'onfido-video',
          autoplay: true,
          muted: true,
          ref: function (video) {
            _this.video = video;
          }
        });
      }, _this.renderInstructions = function (method) {
        var methods = {
          'document': function () {
            return (0, _preact.h)(_Document.DocumentInstructions, null);
          },
          'face': function () {
            return (0, _preact.h)(
              'div',
              null,
              (0, _preact.h)(_Countdown2.default, { ref: function (c) {
                  _this.countdown = c;
                } }),
              (0, _preact.h)(_Face.FaceInstructions, { handeClick: _this.captureOnce })
            );
          },
          'home': function () {
            return null;
          }
        };
        return (methods[method] || methods['home'])();
      }, _temp), _possibleConstructorReturn(_this, _ret);
    }

    Camera.prototype.componentWillReceiveProps = function componentWillReceiveProps(nextProps) {
      var _props = this.props;
      var supportsGetUserMedia = _props.supportsGetUserMedia;
      var cameraActive = _props.cameraActive;

      var useCapture = supportsGetUserMedia && _screenWidth2.default > 800;
      if (useCapture && nextProps.cameraActive !== cameraActive) {
        return this.capture(nextProps.method);
      }
    };

    Camera.prototype.componentDidMount = function componentDidMount() {
      var _this3 = this;

      var handleMessages = this.props.handleMessages;

      this.canvas = document.createElement('canvas');
      (0, _getusermedia2.default)(function (err, stream) {
        if (!err) {
          _this3.video.src = window.URL.createObjectURL(stream);
          _this3.video.play();
          _onfidoSdkCore.events.once('initCamera', function () {
            return _this3.init();
          });
        }
      });
    };

    Camera.prototype.componentWillUnmount = function componentWillUnmount() {
      this.capture('stop');
    };

    Camera.prototype.render = function render() {
      var _props2 = this.props;
      var method = _props2.method;
      var hasCaptured = _props2.hasCaptured;

      var captured = hasCaptured(method);
      return (0, _preact.h)(
        'div',
        { className: 'onfido-center' },
        this.renderInstructions(method),
        this.renderVideo(method)
      );
    };

    return Camera;
  }(_preact.Component);

  exports.default = Camera;
  module.exports = exports['default'];
});