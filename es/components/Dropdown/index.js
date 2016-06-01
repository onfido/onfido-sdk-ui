(function (global, factory) {
  if (typeof define === "function" && define.amd) {
    define(['module', 'exports', 'preact', 'react-dom', 'classnames'], factory);
  } else if (typeof exports !== "undefined") {
    factory(module, exports, require('preact'), require('react-dom'), require('classnames'));
  } else {
    var mod = {
      exports: {}
    };
    factory(mod, mod.exports, global.preact, global.reactDom, global.classnames);
    global.index = mod.exports;
  }
})(this, function (module, exports, _preact, _reactDom, _classnames) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });

  var _reactDom2 = _interopRequireDefault(_reactDom);

  var _classnames2 = _interopRequireDefault(_classnames);

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

  var Dropdown = function (_Component) {
    _inherits(Dropdown, _Component);

    function Dropdown(props) {
      _classCallCheck(this, Dropdown);

      var _this = _possibleConstructorReturn(this, _Component.call(this, props));

      _this.state = {
        selected: props.value || {
          label: props.placeholder || 'Select...',
          value: ''
        },
        isOpen: false
      };
      _this.mounted = true;
      _this.handleDocumentClick = _this.handleDocumentClick.bind(_this);
      _this.fireChangeEvent = _this.fireChangeEvent.bind(_this);
      return _this;
    }

    Dropdown.prototype.componentWillReceiveProps = function componentWillReceiveProps(newProps) {
      if (newProps.value && newProps.value !== this.state.selected) {
        this.setState({ selected: newProps.value });
      } else if (!newProps.value && newProps.placeholder) {
        // this.setState({selected: { label: newProps.placeholder, value: '' }})
      }
    };

    Dropdown.prototype.componentDidMount = function componentDidMount() {
      document.addEventListener('click', this.handleDocumentClick, false);
      document.addEventListener('touchend', this.handleDocumentClick, false);
    };

    Dropdown.prototype.componentWillUnmount = function componentWillUnmount() {
      this.mounted = false;
      document.removeEventListener('click', this.handleDocumentClick, false);
      document.removeEventListener('touchend', this.handleDocumentClick, false);
    };

    Dropdown.prototype.handleMouseDown = function handleMouseDown(event) {
      if (event.type === 'mousedown' && event.button !== 0) return;
      event.stopPropagation();
      event.preventDefault();

      this.setState({
        isOpen: !this.state.isOpen
      });
    };

    Dropdown.prototype.setValue = function setValue(value, label) {
      var newState = {
        selected: {
          value: value,
          label: label
        },
        isOpen: false
      };
      this.fireChangeEvent(newState);
      this.setState(newState);
    };

    Dropdown.prototype.fireChangeEvent = function fireChangeEvent(newState) {
      if (newState.selected !== this.state.selected && this.props.onChange) {
        this.props.onChange(newState.selected);
      }
    };

    Dropdown.prototype.renderOption = function renderOption(option) {
      var _classNames;

      var optionClass = (0, _classnames2.default)((_classNames = {}, _classNames[this.props.baseClassName + '-option'] = true, _classNames['is-selected'] = option === this.state.selected, _classNames));

      var value = option.value || option.label || option;
      var label = option.label || option.value || option;

      return (0, _preact.h)(
        'div',
        {
          key: value,
          className: optionClass,
          onMouseDown: this.setValue.bind(this, value, label),
          onClick: this.setValue.bind(this, value, label) },
        label
      );
    };

    Dropdown.prototype.buildMenu = function buildMenu() {
      var _this2 = this;

      var _props = this.props;
      var options = _props.options;
      var baseClassName = _props.baseClassName;

      var ops = options.map(function (option) {
        if (option.type === 'group') {
          var groupTitle = (0, _preact.h)(
            'div',
            { className: baseClassName + '-title' },
            option.name
          );
          var _options = option.items.map(function (item) {
            return _this2.renderOption(item);
          });

          return (0, _preact.h)(
            'div',
            { className: baseClassName + '-group', key: option.name },
            groupTitle,
            _options
          );
        } else {
          return _this2.renderOption(option);
        }
      });

      return ops.length ? ops : (0, _preact.h)(
        'div',
        { className: baseClassName + '-noresults' },
        'No options found'
      );
    };

    Dropdown.prototype.handleDocumentClick = function handleDocumentClick(event) {
      if (this.mounted) {
        if (!_reactDom2.default.findDOMNode(this).contains(event.target)) {
          this.setState({ isOpen: false });
        }
      }
    };

    Dropdown.prototype.render = function render() {
      var _classNames2;

      var baseClassName = this.props.baseClassName;

      var placeHolderValue = typeof this.state.selected === 'string' ? this.state.selected : this.state.selected.label;
      var value = (0, _preact.h)(
        'div',
        { className: baseClassName + '-placeholder' },
        placeHolderValue
      );
      var menu = this.state.isOpen ? (0, _preact.h)(
        'div',
        { className: baseClassName + '-menu' },
        this.buildMenu()
      ) : null;

      var dropdownClass = (0, _classnames2.default)((_classNames2 = {}, _classNames2[baseClassName + '-root'] = true, _classNames2['is-open'] = this.state.isOpen, _classNames2));

      return (0, _preact.h)(
        'div',
        { className: dropdownClass },
        (0, _preact.h)(
          'div',
          { className: baseClassName + '-control', onMouseDown: this.handleMouseDown.bind(this), onTouchEnd: this.handleMouseDown.bind(this) },
          value,
          (0, _preact.h)('span', { className: baseClassName + '-arrow' })
        ),
        menu
      );
    };

    return Dropdown;
  }(_preact.Component);

  Dropdown.defaultProps = { baseClassName: 'Dropdown' };
  exports.default = Dropdown;
  module.exports = exports['default'];
});