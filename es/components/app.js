(function (global, factory) {
  if (typeof define === "function" && define.amd) {
    define(['module', 'exports', 'preact', 'classnames', 'redux', 'react-redux', 'onfido-sdk-core', './Home', './Capture', './utils/screenWidth', '../style/style.css'], factory);
  } else if (typeof exports !== "undefined") {
    factory(module, exports, require('preact'), require('classnames'), require('redux'), require('react-redux'), require('onfido-sdk-core'), require('./Home'), require('./Capture'), require('./utils/screenWidth'), require('../style/style.css'));
  } else {
    var mod = {
      exports: {}
    };
    factory(mod, mod.exports, global.preact, global.classnames, global.redux, global.reactRedux, global.onfidoSdkCore, global.Home, global.Capture, global.screenWidth, global.style);
    global.app = mod.exports;
  }
})(this, function (module, exports, _preact, _classnames, _redux, _reactRedux, _onfidoSdkCore, _Home, _Capture, _screenWidth, _style) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });

  var _classnames2 = _interopRequireDefault(_classnames);

  var _Home2 = _interopRequireDefault(_Home);

  var _Capture2 = _interopRequireDefault(_Capture);

  var _screenWidth2 = _interopRequireDefault(_screenWidth);

  var _style2 = _interopRequireDefault(_style);

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

  var App = function (_Component) {
    _inherits(App, _Component);

    function App() {
      var _temp, _this, _ret;

      _classCallCheck(this, App);

      for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
        args[_key] = arguments[_key];
      }

      return _ret = (_temp = (_this = _possibleConstructorReturn(this, _Component.call.apply(_Component, [this].concat(args))), _this), _this.state = {
        cameraActive: false,
        method: 'home'
      }, _this.changeView = function () {
        var cameraActive = arguments.length <= 0 || arguments[0] === undefined ? false : arguments[0];
        var method = arguments.length <= 1 || arguments[1] === undefined ? 'home' : arguments[1];

        _this.setState({ cameraActive: cameraActive, method: method });
        _onfidoSdkCore.events.emit('initCamera');
      }, _temp), _possibleConstructorReturn(_this, _ret);
    }

    App.prototype.componentWillMount = function componentWillMount() {
      var options = this.props.options;
      var token = options.token;

      this.socket = (0, _onfidoSdkCore.connect)(token);
    };

    App.prototype.render = function render() {
      var cameraActive = this.state.cameraActive;

      var classes = (0, _classnames2.default)({
        'onfido-verify': true,
        'onfido-camera-active': cameraActive
      });
      return (0, _preact.h)(
        'div',
        { id: 'app', className: classes },
        (0, _preact.h)(_Home2.default, _extends({
          changeView: this.changeView
        }, this.state, this.props)),
        (0, _preact.h)(_Capture2.default, _extends({
          socket: this.socket,
          changeView: this.changeView
        }, this.state, this.props))
      );
    };

    return App;
  }(_preact.Component);

  function mapStateToProps(state) {
    return _extends({
      documentCaptures: state.documentCaptures,
      faceCaptures: state.faceCaptures
    }, state.globals);
  }

  function mapDispatchToProps(dispatch) {
    return { actions: (0, _redux.bindActionCreators)(_onfidoSdkCore.unboundActions, dispatch) };
  }

  exports.default = (0, _reactRedux.connect)(mapStateToProps, mapDispatchToProps)(App);
  module.exports = exports['default'];
});