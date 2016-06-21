(function (global, factory) {
  if (typeof define === "function" && define.amd) {
    define(['module', 'exports', 'preact', 'react-dropzone', 'onfido-sdk-core', 'blueimp-load-image/js/load-image', '../utils/randomString', '../utils/screenWidth', '../utils/createBase64', '../Document', '../Spinner', '../Previews'], factory);
  } else if (typeof exports !== "undefined") {
    factory(module, exports, require('preact'), require('react-dropzone'), require('onfido-sdk-core'), require('blueimp-load-image/js/load-image'), require('../utils/randomString'), require('../utils/screenWidth'), require('../utils/createBase64'), require('../Document'), require('../Spinner'), require('../Previews'));
  } else {
    var mod = {
      exports: {}
    };
    factory(mod, mod.exports, global.preact, global.reactDropzone, global.onfidoSdkCore, global.loadImage, global.randomString, global.screenWidth, global.createBase64, global.Document, global.Spinner, global.Previews);
    global.index = mod.exports;
  }
})(this, function (module, exports, _preact, _reactDropzone, _onfidoSdkCore, _loadImage, _randomString, _screenWidth, _createBase, _Document, _Spinner, _Previews) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = undefined;

  var _reactDropzone2 = _interopRequireDefault(_reactDropzone);

  var _loadImage2 = _interopRequireDefault(_loadImage);

  var _randomString2 = _interopRequireDefault(_randomString);

  var _screenWidth2 = _interopRequireDefault(_screenWidth);

  var _Spinner2 = _interopRequireDefault(_Spinner);

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

  var UploadInstructions = function () {
    return (0, _preact.h)(
      'div',
      { className: 'onfido-upload' },
      (0, _preact.h)('span', { className: 'onfido-icon onfido-icon--upload' }),
      (0, _preact.h)(
        'p',
        { className: 'onfido-upload-text' },
        'Take a photo with your camera or upload one from your library.'
      )
    );
  };

  var UploadProcessing = function () {
    return (0, _preact.h)(
      'div',
      { className: 'onfido-center' },
      (0, _preact.h)(_Spinner2.default, null),
      (0, _preact.h)(
        'div',
        { className: 'onfido-processing' },
        'Processing your document'
      )
    );
  };

  var Uploader = function (_Component) {
    _inherits(Uploader, _Component);

    function Uploader() {
      var _temp, _this, _ret;

      _classCallCheck(this, Uploader);

      for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
        args[_key] = arguments[_key];
      }

      return _ret = (_temp = (_this = _possibleConstructorReturn(this, _Component.call.apply(_Component, [this].concat(args))), _this), _this.handleUpload = function (files) {
        var _this$props = _this.props;
        var method = _this$props.method;
        var handleImage = _this$props.handleImage;
        var setUploadState = _this$props.setUploadState;

        setUploadState(true);
        var options = {
          maxWidth: 960,
          maxHeight: 960,
          canvas: true
        };
        var file = files[0];

        (0, _loadImage2.default)(file.preview, function (canvas) {
          _onfidoSdkCore.events.emit('imageLoaded', canvas);
        }, options);
        _onfidoSdkCore.events.once('imageLoaded', function (canvas) {
          var image = canvas.toDataURL('image/webp');
          var payload = {
            id: (0, _randomString2.default)(),
            messageType: method,
            image: image
          };
          return handleImage(method, payload);
        });
      }, _this.renderUploader = function (captured) {
        if (captured) {
          return (0, _preact.h)(_Previews2.default, _this.props);
        } else {
          return _this.renderDropzone();
        }
      }, _this.renderDropzone = function () {
        var _this$props2 = _this.props;
        var uploading = _this$props2.uploading;
        var noDocument = _this$props2.noDocument;

        return (0, _preact.h)(
          _reactDropzone2.default,
          {
            onDrop: _this.handleUpload,
            multiple: false,
            className: 'onfido-dropzone'
          },
          uploading && (0, _preact.h)(UploadProcessing, null) || (0, _preact.h)(UploadInstructions, null),
          !uploading && noDocument && (0, _preact.h)(_Document.DocumentNotFound, null)
        );
      }, _temp), _possibleConstructorReturn(_this, _ret);
    }

    Uploader.prototype.componentDidMount = function componentDidMount() {
      this.canvas = document.createElement('canvas');
    };

    Uploader.prototype.render = function render() {
      var _this2 = this;

      var _props = this.props;
      var documentCaptured = _props.documentCaptured;
      var faceCaptured = _props.faceCaptured;
      var method = _props.method;

      var methods = {
        'document': function () {
          return _this2.renderUploader(documentCaptured);
        },
        'face': function () {
          return _this2.renderUploader(faceCaptured);
        },
        'home': function () {
          return null;
        }
      };
      return (methods[method] || methods['home'])();
    };

    return Uploader;
  }(_preact.Component);

  exports.default = Uploader;
  module.exports = exports['default'];
});