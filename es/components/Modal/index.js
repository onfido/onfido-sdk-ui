(function (global, factory) {
  if (typeof define === "function" && define.amd) {
    define(['module', 'exports', 'vanilla-modal', 'onfido-sdk-core'], factory);
  } else if (typeof exports !== "undefined") {
    factory(module, exports, require('vanilla-modal'), require('onfido-sdk-core'));
  } else {
    var mod = {
      exports: {}
    };
    factory(mod, mod.exports, global.vanillaModal, global.onfidoSdkCore);
    global.index = mod.exports;
  }
})(this, function (module, exports, _vanillaModal, _onfidoSdkCore) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });

  var _vanillaModal2 = _interopRequireDefault(_vanillaModal);

  function _interopRequireDefault(obj) {
    return obj && obj.__esModule ? obj : {
      default: obj
    };
  }

  var Modal = {};

  Modal.template = '\n  <div class=\'onfido-modal-inner\'>\n    <div class=\'onfido-modal-content\'></div>\n  </div>\n';

  Modal.create = function (options) {
    var modal = document.createElement('div');
    modal.className = 'onfido-modal';
    modal.innerHTML = Modal.template;
    options.mount.parentNode.insertBefore(modal, options.mount.nextSibling);
    _onfidoSdkCore.events.emit('modalMounted', options);
  };

  Modal.options = {
    modal: '.onfido-modal',
    modalInner: '.onfido-modal-inner',
    modalContent: '.onfido-modal-content',
    onOpen: function () {
      return _onfidoSdkCore.events.emit('onOpen');
    },
    onClose: function () {
      return _onfidoSdkCore.events.emit('onClose');
    },
    onBeforeOpen: function () {
      return _onfidoSdkCore.events.emit('onBeforeOpen');
    },
    onBeforeClose: function () {
      return _onfidoSdkCore.events.emit('onBeforeClose');
    }
  };

  _onfidoSdkCore.events.on('modalMounted', function (options) {
    var modal = new _vanillaModal2.default(Modal.options);
    var button = document.getElementById(options.buttonId);
    var id = '#' + options.mount.getAttribute('id');
    button.addEventListener('click', function () {
      return modal.open(id);
    });
    _onfidoSdkCore.events.on('onOpen', function () {
      return options.mount.style.display = 'block';
    });
    _onfidoSdkCore.events.on('onClose', function () {
      return options.mount.style.display = 'none';
    });
    _onfidoSdkCore.events.on('closeModal', function () {
      return modal.close();
    });
    _onfidoSdkCore.events.once('ready', function () {
      return button.disabled = false;
    });
  });

  exports.default = Modal;
  module.exports = exports['default'];
});