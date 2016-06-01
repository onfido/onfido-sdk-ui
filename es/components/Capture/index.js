(function (global, factory) {
  if (typeof define === "function" && define.amd) {
    define(['module', 'exports', 'preact', 'onfido-sdk-core', 'classnames', '../utils/screenWidth', '../Uploader', '../Camera', '../CameraNavigation', '../Previews'], factory);
  } else if (typeof exports !== "undefined") {
    factory(module, exports, require('preact'), require('onfido-sdk-core'), require('classnames'), require('../utils/screenWidth'), require('../Uploader'), require('../Camera'), require('../CameraNavigation'), require('../Previews'));
  } else {
    var mod = {
      exports: {}
    };
    factory(mod, mod.exports, global.preact, global.onfidoSdkCore, global.classnames, global.screenWidth, global.Uploader, global.Camera, global.CameraNavigation, global.Previews);
    global.index = mod.exports;
  }
})(this, function (module, exports, _preact, _onfidoSdkCore, _classnames, _screenWidth, _Uploader, _Camera, _CameraNavigation, _Previews) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = undefined;

  var _classnames2 = _interopRequireDefault(_classnames);

  var _screenWidth2 = _interopRequireDefault(_screenWidth);

  var _Uploader2 = _interopRequireDefault(_Uploader);

  var _Camera2 = _interopRequireDefault(_Camera);

  var _CameraNavigation2 = _interopRequireDefault(_CameraNavigation);

  var _Previews2 = _interopRequireDefault(_Previews);

  function _interopRequireDefault(obj) {
    return obj && obj.__esModule ? obj : {
      default: obj
    };
  }

  var _extends = Object.assign || function (target) {
    for (var i = 1; i < arguments.length; i++) {
      var source = arguments[i];

      for (var key in source) {
        if (Object.prototype.hasOwnProperty.call(source, key)) {
          target[key] = source[key];
        }
      }
    }

    return target;
  };

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

  var Capture = function (_Component) {
    _inherits(Capture, _Component);

    function Capture() {
      var _temp, _this, _ret;

      _classCallCheck(this, Capture);

      for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
        args[_key] = arguments[_key];
      }

      return _ret = (_temp = (_this = _possibleConstructorReturn(this, _Component.call.apply(_Component, [this].concat(args))), _this), _this.state = {
        noDocument: false,
        uploading: false
      }, _this.isUploadValid = function (uploading, noDocument) {
        _this.setState({ uploading: uploading, noDocument: noDocument });
      }, _this.setUploadState = function (uploading) {
        _this.setState({ uploading: uploading });
      }, _this.renderPreviews = function (method) {
        var _this$props = _this.props;
        var documentCaptures = _this$props.documentCaptures;
        var faceCaptures = _this$props.faceCaptures;
        var actions = _this$props.actions;
        var setDocumentCaptured = actions.setDocumentCaptured;
        var setFaceCaptured = actions.setFaceCaptured;

        var captured = _this.hasCaptured(method);
        var methods = {
          'document': function () {
            return captured ? (0, _preact.h)(_Previews2.default, { method: method, captures: documentCaptures, action: setDocumentCaptured }) : null;
          },
          'face': function () {
            return captured ? (0, _preact.h)(_Previews2.default, { method: method, captures: faceCaptures, action: setFaceCaptured }) : null;
          },
          'home': function () {
            return null;
          }
        };
        return (methods[method] || methods['home'])();
      }, _this.hasCaptured = function (method) {
        var methods = {
          'document': _this.props.hasDocumentCaptured,
          'face': _this.props.hasFaceCaptured,
          'home': null
        };
        return methods[method] || methods['home'];
      }, _this.handleMessages = function (message) {
        var _this$props2 = _this.props;
        var changeView = _this$props2.changeView;
        var actions = _this$props2.actions;

        if (message.is_document) {
          actions.captureIsValid(message.id);
          actions.setDocumentCaptured(true);
          _this.isUploadValid(false, false);
          changeView();
        } else {
          _this.isUploadValid(false, true);
        }
      }, _this.handleImage = function (method, payload) {
        var _this$props3 = _this.props;
        var actions = _this$props3.actions;
        var socket = _this$props3.socket;
        var documentType = _this$props3.documentType;
        var changeView = _this$props3.changeView;

        var methods = {
          'document': function (payload) {
            payload.isValid = false;
            payload.documentType = documentType;
            socket.sendMessage(JSON.stringify(payload));
            actions.documentCapture(payload);
          },
          'face': function (payload) {
            payload.isValid = true;
            actions.faceCapture(payload);
            actions.setFaceCaptured(true);
            changeView();
          },
          'home': function () {
            return null;
          }
        };
        return (methods[method] || methods['home'])(payload);
      }, _this.renderCapture = function (useCapture) {
        var actions = {
          handleMessages: _this.handleMessages,
          handleImage: _this.handleImage,
          setUploadState: _this.setUploadState,
          hasCaptured: _this.hasCaptured
        };
        if (useCapture) {
          return (0, _preact.h)(_Camera2.default, _extends({}, _this.props, actions, _this.state));
        } else {
          return (0, _preact.h)(_Uploader2.default, _extends({}, _this.props, actions, _this.state));
        }
      }, _temp), _possibleConstructorReturn(_this, _ret);
    }

    Capture.prototype.componentDidMount = function componentDidMount() {
      var _this2 = this;

      _onfidoSdkCore.events.on('onMessage', function (message) {
        return _this2.handleMessages(message);
      });
    };

    Capture.prototype.render = function render() {
      var _props = this.props;
      var supportsGetUserMedia = _props.supportsGetUserMedia;
      var changeView = _props.changeView;
      var method = _props.method;

      var useCapture = supportsGetUserMedia && _screenWidth2.default > 800;
      var captured = this.hasCaptured(method);
      var classes = (0, _classnames2.default)({
        'onfido-camera': useCapture,
        'onfido-uploader': !useCapture
      });
      return (0, _preact.h)(
        'div',
        { id: 'onfido-camera', className: classes },
        (0, _preact.h)(_CameraNavigation2.default, { changeView: changeView }),
        captured && this.renderPreviews(method),
        !captured && this.renderCapture(useCapture)
      );
    };

    return Capture;
  }(_preact.Component);

  exports.default = Capture;
  module.exports = exports['default'];
});