(function (global, factory) {
  if (typeof define === "function" && define.amd) {
    define(['module', 'exports', 'preact', '../Dropdown', 'react-native-listener'], factory);
  } else if (typeof exports !== "undefined") {
    factory(module, exports, require('preact'), require('../Dropdown'), require('react-native-listener'));
  } else {
    var mod = {
      exports: {}
    };
    factory(mod, mod.exports, global.preact, global.Dropdown, global.reactNativeListener);
    global.index = mod.exports;
  }
})(this, function (module, exports, _preact, _Dropdown, _reactNativeListener) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = undefined;

  var _Dropdown2 = _interopRequireDefault(_Dropdown);

  var _reactNativeListener2 = _interopRequireDefault(_reactNativeListener);

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

  var options = [{
    value: 'passport',
    label: 'Passport',
    icon: 'icon-passport'
  }, {
    value: 'identity',
    label: 'Identity Card',
    icon: 'icon-identity'
  }, {
    value: 'license',
    label: 'Drivers License',
    icon: 'icon-license'
  }];

  var DocumentSelector = function (_Component) {
    _inherits(DocumentSelector, _Component);

    function DocumentSelector() {
      var _temp, _this, _ret;

      _classCallCheck(this, DocumentSelector);

      for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
        args[_key] = arguments[_key];
      }

      return _ret = (_temp = (_this = _possibleConstructorReturn(this, _Component.call.apply(_Component, [this].concat(args))), _this), _this.handleChange = function (option) {
        var _this$props = _this.props;
        var setDocumentType = _this$props.setDocumentType;
        var changeView = _this$props.changeView;

        setDocumentType(option.value);
        changeView(true, 'document');
      }, _temp), _possibleConstructorReturn(_this, _ret);
    }

    DocumentSelector.prototype.render = function render() {
      return (0, _preact.h)(
        _reactNativeListener2.default,
        { stopClick: true },
        (0, _preact.h)(_Dropdown2.default, {
          options: options,
          onChange: this.handleChange,
          placeholder: 'Select document type'
        })
      );
    };

    return DocumentSelector;
  }(_preact.Component);

  exports.default = DocumentSelector;
  module.exports = exports['default'];
});