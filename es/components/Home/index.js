(function (global, factory) {
  if (typeof define === "function" && define.amd) {
    define(['module', 'exports', 'preact', 'classnames', 'onfido-sdk-core', 'react-native-listener', '../HomeComplete', '../DocumentSelector'], factory);
  } else if (typeof exports !== "undefined") {
    factory(module, exports, require('preact'), require('classnames'), require('onfido-sdk-core'), require('react-native-listener'), require('../HomeComplete'), require('../DocumentSelector'));
  } else {
    var mod = {
      exports: {}
    };
    factory(mod, mod.exports, global.preact, global.classnames, global.onfidoSdkCore, global.reactNativeListener, global.HomeComplete, global.DocumentSelector);
    global.index = mod.exports;
  }
})(this, function (module, exports, _preact, _classnames, _onfidoSdkCore, _reactNativeListener, _HomeComplete, _DocumentSelector) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = undefined;

  var _classnames2 = _interopRequireDefault(_classnames);

  var _reactNativeListener2 = _interopRequireDefault(_reactNativeListener);

  var _HomeComplete2 = _interopRequireDefault(_HomeComplete);

  var _DocumentSelector2 = _interopRequireDefault(_DocumentSelector);

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

  var Home = function (_Component) {
    _inherits(Home, _Component);

    function Home() {
      var _temp, _this, _ret;

      _classCallCheck(this, Home);

      for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
        args[_key] = arguments[_key];
      }

      return _ret = (_temp = (_this = _possibleConstructorReturn(this, _Component.call.apply(_Component, [this].concat(args))), _this), _this.handleClick = function (method) {
        var _this$props = _this.props;
        var changeView = _this$props.changeView;
        var documentType = _this$props.documentType;

        if (!documentType) return;
        var methods = {
          'document': function () {
            return changeView(true, method);
          },
          'face': function () {
            return changeView(true, method);
          },
          'home': function () {
            return null;
          }
        };
        return (methods[method] || methods['home'])();
      }, _temp), _possibleConstructorReturn(_this, _ret);
    }

    Home.prototype.renderMethod = function renderMethod(method, index) {
      var _classNames, _classNames2;

      var _props = this.props;
      var documentCaptured = _props.documentCaptured;
      var changeView = _props.changeView;
      var view = method.view;
      var complete = method.complete;
      var renderDropdown = method.renderDropdown;
      var hint = method.hint;
      var setDocumentType = this.props.actions.setDocumentType;

      var classes = (0, _classnames2.default)((_classNames = {
        'onfido-method': true,
        'onfido-disabled': !documentCaptured,
        'onfido-method--double': true
      }, _classNames['onfido-method--' + view] = true, _classNames));
      var iconClass = (0, _classnames2.default)((_classNames2 = {
        'onfido-icon': true,
        'onfido-icon--complete': complete
      }, _classNames2['onfido-icon--' + view] = !complete, _classNames2));
      return (0, _preact.h)(
        'div',
        { className: classes },
        (0, _preact.h)(
          'a',
          {
            onClick: this.handleClick.bind(this, view),
            className: 'onfido-method-selector'
          },
          (0, _preact.h)('span', { className: iconClass }),
          renderDropdown && (0, _preact.h)(_DocumentSelector2.default, { changeView: changeView, setDocumentType: setDocumentType }),
          (0, _preact.h)(
            'p',
            { className: 'onfido-instructions' },
            hint
          )
        )
      );
    };

    Home.prototype.renderMethods = function renderMethods(methods) {
      return (0, _preact.h)(
        'div',
        { className: 'onfido-methods' },
        (0, _preact.h)(
          'div',
          { className: 'onfido-header' },
          'Verify your identity'
        ),
        methods.map(this.renderMethod.bind(this))
      );
    };

    Home.prototype.render = function render() {
      var _props2 = this.props;
      var documentCaptured = _props2.documentCaptured;
      var faceCaptured = _props2.faceCaptured;

      var complete = documentCaptured && faceCaptured;
      var methods = [{
        view: 'document',
        hint: 'Take a capture of your passport or national identity card, which will be used to verify your identity.',
        title: 'Document capture',
        complete: documentCaptured,
        renderDropdown: true
      }, {
        view: 'face',
        hint: 'Take a photo of your face, which will be automatically matched with the photo from your document.',
        title: 'A photo of you',
        complete: faceCaptured,
        renderDropdown: false
      }];
      return (0, _preact.h)(
        'div',
        { className: 'onfido-wrapper' },
        (0, _preact.h)(
          'div',
          { className: 'onfido-actions' },
          (0, _preact.h)('span', null),
          (0, _preact.h)(
            'a',
            { rel: 'modal:close', className: 'onfido-btn-nav onfido-btn-nav--right' },
            '× Close'
          )
        ),
        complete && (0, _preact.h)(_HomeComplete2.default, null) || this.renderMethods(methods)
      );
    };

    return Home;
  }(_preact.Component);

  exports.default = Home;
  module.exports = exports['default'];
});