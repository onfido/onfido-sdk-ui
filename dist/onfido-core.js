(function webpackUniversalModuleDefinition(root, factory) {
	if(typeof exports === 'object' && typeof module === 'object')
		module.exports = factory();
	else if(typeof define === 'function' && define.amd)
		define([], factory);
	else if(typeof exports === 'object')
		exports["Onfido"] = factory();
	else
		root["Onfido"] = factory();
})(this, function() {
return /******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};

/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {

/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;

/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};

/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);

/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;

/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}


/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;

/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;

/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";

/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	exports.__esModule = true;
	exports.unboundActions = exports.events = exports.actions = exports.store = exports.connect = undefined;

	var _connect = __webpack_require__(11);

	var _connect2 = _interopRequireDefault(_connect);

	var _store = __webpack_require__(3);

	var _store2 = _interopRequireDefault(_store);

	var _events = __webpack_require__(5);

	var _events2 = _interopRequireDefault(_events);

	var _actions = __webpack_require__(2);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

	exports.connect = _connect2["default"];
	exports.store = _store2["default"];
	exports.actions = _actions.actions;
	exports.events = _events2["default"];
	exports.unboundActions = _actions.unboundActions;

/***/ },
/* 1 */
/***/ function(module, exports) {

	'use strict';

	exports.__esModule = true;
	var DEV_SOCKET_URL = exports.DEV_SOCKET_URL = '\nwss://document-check-staging.onfido.co.uk:9876';
	var SOCKET_URL = exports.SOCKET_URL = 'wss://172.31.72.132:9876';
	var XHR_URL = exports.XHR_URL = 'https://api.onfido.com';

	var DOCUMENT_CAPTURE = exports.DOCUMENT_CAPTURE = 'DOCUMENT_CAPTURE';
	var FACE_CAPTURE = exports.FACE_CAPTURE = 'FACE_CAPTURE';

	var SET_TOKEN = exports.SET_TOKEN = 'SET_TOKEN';
	var SET_AUTHENTICATED = exports.SET_AUTHENTICATED = 'SET_AUTHENTICATED';
	var SET_WEBSOCKET_SUPPORT = exports.SET_WEBSOCKET_SUPPORT = 'SET_WEBSOCKET_SUPPORT';
	var SET_GUM_SUPPORT = exports.SET_GUM_SUPPORT = 'SET_GUM_SUPPORT';
	var SET_DOCUMENT_CAPTURED = exports.SET_DOCUMENT_CAPTURED = 'SET_DOCUMENT_CAPTURED';
	var SET_FACE_CAPTURED = exports.SET_FACE_CAPTURED = 'SET_FACE_CAPTURED';

/***/ },
/* 2 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	exports.__esModule = true;
	exports.actions = exports.unboundActions = undefined;

	var _redux = __webpack_require__(4);

	var _objectAssign = __webpack_require__(7);

	var _objectAssign2 = _interopRequireDefault(_objectAssign);

	var _store = __webpack_require__(3);

	var _store2 = _interopRequireDefault(_store);

	var _globals = __webpack_require__(14);

	var globals = _interopRequireWildcard(_globals);

	var _captures = __webpack_require__(13);

	var captures = _interopRequireWildcard(_captures);

	function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj["default"] = obj; return newObj; } }

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

	var unboundActions = exports.unboundActions = (0, _objectAssign2["default"])({}, globals, captures);
	var actions = exports.actions = (0, _redux.bindActionCreators)(unboundActions, _store2["default"].dispatch);

/***/ },
/* 3 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	exports.__esModule = true;

	var _redux = __webpack_require__(4);

	var _reducers = __webpack_require__(17);

	var _reducers2 = _interopRequireDefault(_reducers);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

	var store = (0, _redux.createStore)(_reducers2["default"], window.devToolsExtension ? window.devToolsExtension() : undefined);

	exports["default"] = store;

/***/ },
/* 4 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	exports.__esModule = true;
	exports.compose = exports.applyMiddleware = exports.bindActionCreators = exports.combineReducers = exports.createStore = undefined;

	var _createStore = __webpack_require__(9);

	var _createStore2 = _interopRequireDefault(_createStore);

	var _combineReducers = __webpack_require__(27);

	var _combineReducers2 = _interopRequireDefault(_combineReducers);

	var _bindActionCreators = __webpack_require__(26);

	var _bindActionCreators2 = _interopRequireDefault(_bindActionCreators);

	var _applyMiddleware = __webpack_require__(25);

	var _applyMiddleware2 = _interopRequireDefault(_applyMiddleware);

	var _compose = __webpack_require__(8);

	var _compose2 = _interopRequireDefault(_compose);

	var _warning = __webpack_require__(10);

	var _warning2 = _interopRequireDefault(_warning);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

	/*
	* This is a dummy function to check if the function name has been altered by minification.
	* If the function has been minified and NODE_ENV !== 'production', warn the user.
	*/
	function isCrushed() {}

	if (("development") !== 'production' && typeof isCrushed.name === 'string' && isCrushed.name !== 'isCrushed') {
	  (0, _warning2["default"])('You are currently using minified code outside of NODE_ENV === \'production\'. ' + 'This means that you are running a slower development build of Redux. ' + 'You can use loose-envify (https://github.com/zertosh/loose-envify) for browserify ' + 'or DefinePlugin for webpack (http://stackoverflow.com/questions/30030031) ' + 'to ensure you have the correct code for your production build.');
	}

	exports.createStore = _createStore2["default"];
	exports.combineReducers = _combineReducers2["default"];
	exports.bindActionCreators = _bindActionCreators2["default"];
	exports.applyMiddleware = _applyMiddleware2["default"];
	exports.compose = _compose2["default"];

/***/ },
/* 5 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	exports.__esModule = true;

	var _eventemitter = __webpack_require__(19);

	var _eventemitter2 = _interopRequireDefault(_eventemitter);

	var _store = __webpack_require__(3);

	var _store2 = _interopRequireDefault(_store);

	var _actions = __webpack_require__(2);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

	var events = new _eventemitter2["default"]();
	_store2["default"].subscribe(handleEvent);

	var authenticated = function authenticated(state) {
	  return state.globals.authenticated;
	};
	var hasDocumentCaptured = function hasDocumentCaptured(state) {
	  return state.globals.hasDocumentCaptured;
	};
	var hasFaceCaptured = function hasFaceCaptured(state) {
	  return state.globals.hasFaceCaptured;
	};

	function handleEvent() {
	  var state = _store2["default"].getState();
	  var documentCaptures = state.documentCaptures;
	  var faceCaptures = state.faceCaptures;

	  var data = {
	    documentCaptures: documentCaptures[0] || null,
	    faceCaptures: faceCaptures[0] || null
	  };
	  if (authenticated(state)) {
	    events.emit('ready');
	  }
	  if (hasDocumentCaptured(state)) {
	    events.emit('documentCapture', data);
	  }
	  if (hasFaceCaptured(state)) {
	    events.emit('faceCapture', data);
	  }
	  if (hasDocumentCaptured(state) && hasFaceCaptured(state)) {
	    events.emit('complete', data);
	  }
	}

	exports["default"] = events;

/***/ },
/* 6 */
/***/ function(module, exports, __webpack_require__) {

	var getPrototype = __webpack_require__(20),
	    isHostObject = __webpack_require__(21),
	    isObjectLike = __webpack_require__(22);

	/** `Object#toString` result references. */
	var objectTag = '[object Object]';

	/** Used for built-in method references. */
	var objectProto = Object.prototype;

	/** Used to resolve the decompiled source of functions. */
	var funcToString = Function.prototype.toString;

	/** Used to check objects for own properties. */
	var hasOwnProperty = objectProto.hasOwnProperty;

	/** Used to infer the `Object` constructor. */
	var objectCtorString = funcToString.call(Object);

	/**
	 * Used to resolve the
	 * [`toStringTag`](http://ecma-international.org/ecma-262/6.0/#sec-object.prototype.tostring)
	 * of values.
	 */
	var objectToString = objectProto.toString;

	/**
	 * Checks if `value` is a plain object, that is, an object created by the
	 * `Object` constructor or one with a `[[Prototype]]` of `null`.
	 *
	 * @static
	 * @memberOf _
	 * @since 0.8.0
	 * @category Lang
	 * @param {*} value The value to check.
	 * @returns {boolean} Returns `true` if `value` is a plain object,
	 *  else `false`.
	 * @example
	 *
	 * function Foo() {
	 *   this.a = 1;
	 * }
	 *
	 * _.isPlainObject(new Foo);
	 * // => false
	 *
	 * _.isPlainObject([1, 2, 3]);
	 * // => false
	 *
	 * _.isPlainObject({ 'x': 0, 'y': 0 });
	 * // => true
	 *
	 * _.isPlainObject(Object.create(null));
	 * // => true
	 */
	function isPlainObject(value) {
	  if (!isObjectLike(value) ||
	      objectToString.call(value) != objectTag || isHostObject(value)) {
	    return false;
	  }
	  var proto = getPrototype(value);
	  if (proto === null) {
	    return true;
	  }
	  var Ctor = hasOwnProperty.call(proto, 'constructor') && proto.constructor;
	  return (typeof Ctor == 'function' &&
	    Ctor instanceof Ctor && funcToString.call(Ctor) == objectCtorString);
	}

	module.exports = isPlainObject;


/***/ },
/* 7 */
/***/ function(module, exports) {

	/* eslint-disable no-unused-vars */
	'use strict';
	var hasOwnProperty = Object.prototype.hasOwnProperty;
	var propIsEnumerable = Object.prototype.propertyIsEnumerable;

	function toObject(val) {
		if (val === null || val === undefined) {
			throw new TypeError('Object.assign cannot be called with null or undefined');
		}

		return Object(val);
	}

	module.exports = Object.assign || function (target, source) {
		var from;
		var to = toObject(target);
		var symbols;

		for (var s = 1; s < arguments.length; s++) {
			from = Object(arguments[s]);

			for (var key in from) {
				if (hasOwnProperty.call(from, key)) {
					to[key] = from[key];
				}
			}

			if (Object.getOwnPropertySymbols) {
				symbols = Object.getOwnPropertySymbols(from);
				for (var i = 0; i < symbols.length; i++) {
					if (propIsEnumerable.call(from, symbols[i])) {
						to[symbols[i]] = from[symbols[i]];
					}
				}
			}
		}

		return to;
	};


/***/ },
/* 8 */
/***/ function(module, exports) {

	"use strict";

	exports.__esModule = true;
	exports["default"] = compose;
	/**
	 * Composes single-argument functions from right to left. The rightmost
	 * function can take multiple arguments as it provides the signature for
	 * the resulting composite function.
	 *
	 * @param {...Function} funcs The functions to compose.
	 * @returns {Function} A function obtained by composing the argument functions
	 * from right to left. For example, compose(f, g, h) is identical to doing
	 * (...args) => f(g(h(...args))).
	 */

	function compose() {
	  for (var _len = arguments.length, funcs = Array(_len), _key = 0; _key < _len; _key++) {
	    funcs[_key] = arguments[_key];
	  }

	  return function () {
	    if (funcs.length === 0) {
	      return arguments.length <= 0 ? undefined : arguments[0];
	    }

	    var last = funcs[funcs.length - 1];
	    var rest = funcs.slice(0, -1);

	    return rest.reduceRight(function (composed, f) {
	      return f(composed);
	    }, last.apply(undefined, arguments));
	  };
	}

/***/ },
/* 9 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	exports.__esModule = true;
	exports.ActionTypes = undefined;
	exports["default"] = createStore;

	var _isPlainObject = __webpack_require__(6);

	var _isPlainObject2 = _interopRequireDefault(_isPlainObject);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

	/**
	 * These are private action types reserved by Redux.
	 * For any unknown actions, you must return the current state.
	 * If the current state is undefined, you must return the initial state.
	 * Do not reference these action types directly in your code.
	 */
	var ActionTypes = exports.ActionTypes = {
	  INIT: '@@redux/INIT'
	};

	/**
	 * Creates a Redux store that holds the state tree.
	 * The only way to change the data in the store is to call `dispatch()` on it.
	 *
	 * There should only be a single store in your app. To specify how different
	 * parts of the state tree respond to actions, you may combine several reducers
	 * into a single reducer function by using `combineReducers`.
	 *
	 * @param {Function} reducer A function that returns the next state tree, given
	 * the current state tree and the action to handle.
	 *
	 * @param {any} [initialState] The initial state. You may optionally specify it
	 * to hydrate the state from the server in universal apps, or to restore a
	 * previously serialized user session.
	 * If you use `combineReducers` to produce the root reducer function, this must be
	 * an object with the same shape as `combineReducers` keys.
	 *
	 * @param {Function} enhancer The store enhancer. You may optionally specify it
	 * to enhance the store with third-party capabilities such as middleware,
	 * time travel, persistence, etc. The only store enhancer that ships with Redux
	 * is `applyMiddleware()`.
	 *
	 * @returns {Store} A Redux store that lets you read the state, dispatch actions
	 * and subscribe to changes.
	 */
	function createStore(reducer, initialState, enhancer) {
	  if (typeof initialState === 'function' && typeof enhancer === 'undefined') {
	    enhancer = initialState;
	    initialState = undefined;
	  }

	  if (typeof enhancer !== 'undefined') {
	    if (typeof enhancer !== 'function') {
	      throw new Error('Expected the enhancer to be a function.');
	    }

	    return enhancer(createStore)(reducer, initialState);
	  }

	  if (typeof reducer !== 'function') {
	    throw new Error('Expected the reducer to be a function.');
	  }

	  var currentReducer = reducer;
	  var currentState = initialState;
	  var currentListeners = [];
	  var nextListeners = currentListeners;
	  var isDispatching = false;

	  function ensureCanMutateNextListeners() {
	    if (nextListeners === currentListeners) {
	      nextListeners = currentListeners.slice();
	    }
	  }

	  /**
	   * Reads the state tree managed by the store.
	   *
	   * @returns {any} The current state tree of your application.
	   */
	  function getState() {
	    return currentState;
	  }

	  /**
	   * Adds a change listener. It will be called any time an action is dispatched,
	   * and some part of the state tree may potentially have changed. You may then
	   * call `getState()` to read the current state tree inside the callback.
	   *
	   * You may call `dispatch()` from a change listener, with the following
	   * caveats:
	   *
	   * 1. The subscriptions are snapshotted just before every `dispatch()` call.
	   * If you subscribe or unsubscribe while the listeners are being invoked, this
	   * will not have any effect on the `dispatch()` that is currently in progress.
	   * However, the next `dispatch()` call, whether nested or not, will use a more
	   * recent snapshot of the subscription list.
	   *
	   * 2. The listener should not expect to see all state changes, as the state
	   * might have been updated multiple times during a nested `dispatch()` before
	   * the listener is called. It is, however, guaranteed that all subscribers
	   * registered before the `dispatch()` started will be called with the latest
	   * state by the time it exits.
	   *
	   * @param {Function} listener A callback to be invoked on every dispatch.
	   * @returns {Function} A function to remove this change listener.
	   */
	  function subscribe(listener) {
	    if (typeof listener !== 'function') {
	      throw new Error('Expected listener to be a function.');
	    }

	    var isSubscribed = true;

	    ensureCanMutateNextListeners();
	    nextListeners.push(listener);

	    return function unsubscribe() {
	      if (!isSubscribed) {
	        return;
	      }

	      isSubscribed = false;

	      ensureCanMutateNextListeners();
	      var index = nextListeners.indexOf(listener);
	      nextListeners.splice(index, 1);
	    };
	  }

	  /**
	   * Dispatches an action. It is the only way to trigger a state change.
	   *
	   * The `reducer` function, used to create the store, will be called with the
	   * current state tree and the given `action`. Its return value will
	   * be considered the **next** state of the tree, and the change listeners
	   * will be notified.
	   *
	   * The base implementation only supports plain object actions. If you want to
	   * dispatch a Promise, an Observable, a thunk, or something else, you need to
	   * wrap your store creating function into the corresponding middleware. For
	   * example, see the documentation for the `redux-thunk` package. Even the
	   * middleware will eventually dispatch plain object actions using this method.
	   *
	   * @param {Object} action A plain object representing “what changed”. It is
	   * a good idea to keep actions serializable so you can record and replay user
	   * sessions, or use the time travelling `redux-devtools`. An action must have
	   * a `type` property which may not be `undefined`. It is a good idea to use
	   * string constants for action types.
	   *
	   * @returns {Object} For convenience, the same action object you dispatched.
	   *
	   * Note that, if you use a custom middleware, it may wrap `dispatch()` to
	   * return something else (for example, a Promise you can await).
	   */
	  function dispatch(action) {
	    if (!(0, _isPlainObject2["default"])(action)) {
	      throw new Error('Actions must be plain objects. ' + 'Use custom middleware for async actions.');
	    }

	    if (typeof action.type === 'undefined') {
	      throw new Error('Actions may not have an undefined "type" property. ' + 'Have you misspelled a constant?');
	    }

	    if (isDispatching) {
	      throw new Error('Reducers may not dispatch actions.');
	    }

	    try {
	      isDispatching = true;
	      currentState = currentReducer(currentState, action);
	    } finally {
	      isDispatching = false;
	    }

	    var listeners = currentListeners = nextListeners;
	    for (var i = 0; i < listeners.length; i++) {
	      listeners[i]();
	    }

	    return action;
	  }

	  /**
	   * Replaces the reducer currently used by the store to calculate the state.
	   *
	   * You might need this if your app implements code splitting and you want to
	   * load some of the reducers dynamically. You might also need this if you
	   * implement a hot reloading mechanism for Redux.
	   *
	   * @param {Function} nextReducer The reducer for the store to use instead.
	   * @returns {void}
	   */
	  function replaceReducer(nextReducer) {
	    if (typeof nextReducer !== 'function') {
	      throw new Error('Expected the nextReducer to be a function.');
	    }

	    currentReducer = nextReducer;
	    dispatch({ type: ActionTypes.INIT });
	  }

	  // When a store is created, an "INIT" action is dispatched so that every
	  // reducer returns their initial state. This effectively populates
	  // the initial state tree.
	  dispatch({ type: ActionTypes.INIT });

	  return {
	    dispatch: dispatch,
	    subscribe: subscribe,
	    getState: getState,
	    replaceReducer: replaceReducer
	  };
	}

/***/ },
/* 10 */
/***/ function(module, exports) {

	'use strict';

	exports.__esModule = true;
	exports["default"] = warning;
	/**
	 * Prints a warning in the console if it exists.
	 *
	 * @param {String} message The warning message.
	 * @returns {void}
	 */
	function warning(message) {
	  /* eslint-disable no-console */
	  if (typeof console !== 'undefined' && typeof console.error === 'function') {
	    console.error(message);
	  }
	  /* eslint-enable no-console */
	  try {
	    // This error was thrown as a convenience so that you can use this stack
	    // to find the callsite that caused this warning to fire.
	    throw new Error(message);
	    /* eslint-disable no-empty */
	  } catch (e) {}
	  /* eslint-enable no-empty */
	}

/***/ },
/* 11 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	exports.__esModule = true;
	exports["default"] = connect;

	var _socket = __webpack_require__(12);

	var _socket2 = _interopRequireDefault(_socket);

	var _actions = __webpack_require__(2);

	var _featureDetection = __webpack_require__(18);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

	var setWebSocketSupport = _actions.actions.setWebSocketSupport;
	var setGumSupport = _actions.actions.setGumSupport;


	function setSupport() {
	  setWebSocketSupport(_featureDetection.supportsWebSockets);
	  setGumSupport(_featureDetection.supportsGetUserMedia);
	}

	function connect(jwt) {
	  setSupport();
	  try {
	    if (!_featureDetection.supportsWebSockets) throw 'WebSockets not supported';
	    var socket = new _socket2["default"]();
	    socket.connect(jwt);
	    return socket;
	  } catch (err) {
	    console.log(err);
	  }
	}

/***/ },
/* 12 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	exports.__esModule = true;

	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

	var _queryString = __webpack_require__(23);

	var _queryString2 = _interopRequireDefault(_queryString);

	var _events = __webpack_require__(5);

	var _events2 = _interopRequireDefault(_events);

	var _constants = __webpack_require__(1);

	var constants = _interopRequireWildcard(_constants);

	var _actions = __webpack_require__(2);

	var _reconnectingwebsocket = __webpack_require__(24);

	var _reconnectingwebsocket2 = _interopRequireDefault(_reconnectingwebsocket);

	function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj["default"] = obj; return newObj; } }

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

	var setDocumentCaptured = _actions.actions.setDocumentCaptured;
	var setToken = _actions.actions.setToken;
	var setAuthenticated = _actions.actions.setAuthenticated;

	var Socket = function () {
	  function Socket() {
	    _classCallCheck(this, Socket);
	  }

	  _createClass(Socket, [{
	    key: 'connect',
	    value: function connect(jwt) {
	      var _this = this;

	      var query = _queryString2["default"].stringify({ jwt: jwt });
	      var url = constants.DEV_SOCKET_URL + '?' + query;
	      var socket = new _reconnectingwebsocket2["default"](url);
	      socket.onopen = function () {
	        _this.socket = socket;
	        _this.onMessage();
	        setToken(jwt);
	        setAuthenticated(true);
	      };
	    }
	  }, {
	    key: 'onMessage',
	    value: function onMessage() {
	      this.socket.onmessage = function (e) {
	        var data = JSON.parse(e.data);
	        _events2["default"].emit('onMessage', data);
	      };
	    }
	  }, {
	    key: 'sendMessage',
	    value: function sendMessage(message) {
	      this.socket.send(message);
	    }
	  }]);

	  return Socket;
	}();

	exports["default"] = Socket;

/***/ },
/* 13 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	exports.__esModule = true;
	exports.documentCapture = documentCapture;
	exports.faceCapture = faceCapture;

	var _constants = __webpack_require__(1);

	var constants = _interopRequireWildcard(_constants);

	function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj["default"] = obj; return newObj; } }

	function documentCapture(payload) {
	  return {
	    type: constants.DOCUMENT_CAPTURE,
	    payload: payload
	  };
	}

	function faceCapture(payload) {
	  return {
	    type: constants.FACE_CAPTURE,
	    payload: payload
	  };
	}

/***/ },
/* 14 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	exports.__esModule = true;
	exports.setToken = setToken;
	exports.setWebSocketSupport = setWebSocketSupport;
	exports.setDocumentCaptured = setDocumentCaptured;
	exports.setFaceCaptured = setFaceCaptured;
	exports.setAuthenticated = setAuthenticated;
	exports.setGumSupport = setGumSupport;

	var _constants = __webpack_require__(1);

	var constants = _interopRequireWildcard(_constants);

	function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj["default"] = obj; return newObj; } }

	function setToken(payload) {
	  return {
	    type: constants.SET_TOKEN,
	    payload: payload
	  };
	}

	function setWebSocketSupport(payload) {
	  return {
	    type: constants.SET_WEBSOCKET_SUPPORT,
	    payload: payload
	  };
	}

	function setDocumentCaptured(payload) {
	  return {
	    type: constants.SET_DOCUMENT_CAPTURED,
	    payload: payload
	  };
	}

	function setFaceCaptured(payload) {
	  return {
	    type: constants.SET_FACE_CAPTURED,
	    payload: payload
	  };
	}

	function setAuthenticated(payload) {
	  return {
	    type: constants.SET_AUTHENTICATED,
	    payload: payload
	  };
	}

	function setGumSupport(payload) {
	  return {
	    type: constants.SET_GUM_SUPPORT,
	    payload: payload
	  };
	}

/***/ },
/* 15 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	exports.__esModule = true;
	exports.documentCaptures = documentCaptures;
	exports.faceCaptures = faceCaptures;

	var _constants = __webpack_require__(1);

	var constants = _interopRequireWildcard(_constants);

	function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj["default"] = obj; return newObj; } }

	function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

	function documentCaptures() {
	  var state = arguments.length <= 0 || arguments[0] === undefined ? [] : arguments[0];
	  var action = arguments[1];

	  switch (action.type) {
	    case constants.DOCUMENT_CAPTURE:
	      var arr = state.slice(0, 2);
	      return [action.payload].concat(_toConsumableArray(arr));
	    default:
	      return state;
	  }
	}

	function faceCaptures() {
	  var state = arguments.length <= 0 || arguments[0] === undefined ? [] : arguments[0];
	  var action = arguments[1];

	  switch (action.type) {
	    case constants.FACE_CAPTURE:
	      var arr = state.slice(0, 2);
	      return [action.payload].concat(_toConsumableArray(arr));
	    default:
	      return state;
	  }
	}

/***/ },
/* 16 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	exports.__esModule = true;
	exports["default"] = globals;

	var _objectAssign = __webpack_require__(7);

	var _objectAssign2 = _interopRequireDefault(_objectAssign);

	var _constants = __webpack_require__(1);

	var constants = _interopRequireWildcard(_constants);

	function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj["default"] = obj; return newObj; } }

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

	var initialState = {
	  jwt: null,
	  authenticated: false,
	  supportsWebSockets: false,
	  supportsGetUserMedia: false,
	  hasDocumentCaptured: false,
	  hasFaceCaptured: false
	};

	function globals() {
	  var state = arguments.length <= 0 || arguments[0] === undefined ? initialState : arguments[0];
	  var action = arguments[1];

	  switch (action.type) {
	    case constants.SET_TOKEN:
	      state = (0, _objectAssign2["default"])({}, state, { jwt: action.payload });
	      return state;
	    case constants.SET_AUTHENTICATED:
	      state = (0, _objectAssign2["default"])({}, state, { authenticated: action.payload });
	      return state;
	    case constants.SET_WEBSOCKET_SUPPORT:
	      state = (0, _objectAssign2["default"])({}, state, { supportsWebSockets: action.payload });
	      return state;
	    case constants.SET_GUM_SUPPORT:
	      state = (0, _objectAssign2["default"])({}, state, { supportsGetUserMedia: action.payload });
	      return state;
	    case constants.SET_DOCUMENT_CAPTURED:
	      state = (0, _objectAssign2["default"])({}, state, { hasDocumentCaptured: action.payload });
	      return state;
	    case constants.SET_FACE_CAPTURED:
	      state = (0, _objectAssign2["default"])({}, state, { hasFaceCaptured: action.payload });
	      return state;
	    default:
	      return state;
	  }
	}

/***/ },
/* 17 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	exports.__esModule = true;

	var _redux = __webpack_require__(4);

	var _captures = __webpack_require__(15);

	var _globals = __webpack_require__(16);

	var _globals2 = _interopRequireDefault(_globals);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

	exports["default"] = (0, _redux.combineReducers)({
	  globals: _globals2["default"],
	  documentCaptures: _captures.documentCaptures,
	  faceCaptures: _captures.faceCaptures
	});

/***/ },
/* 18 */
/***/ function(module, exports) {

	'use strict';

	exports.__esModule = true;
	var supportsGetUserMedia = exports.supportsGetUserMedia = 'getUserMedia' in navigator || 'webkitGetUserMedia' in navigator || 'mozGetUserMedia' in navigator || 'msGetUserMedia' in navigator;

	var supportsWebSockets = exports.supportsWebSockets = 'WebSocket' in window;

/***/ },
/* 19 */
/***/ function(module, exports, __webpack_require__) {

	var __WEBPACK_AMD_DEFINE_RESULT__;/*!
	 * EventEmitter2
	 * https://github.com/hij1nx/EventEmitter2
	 *
	 * Copyright (c) 2013 hij1nx
	 * Licensed under the MIT license.
	 */
	;!function(undefined) {

	  var isArray = Array.isArray ? Array.isArray : function _isArray(obj) {
	    return Object.prototype.toString.call(obj) === "[object Array]";
	  };
	  var defaultMaxListeners = 10;

	  function init() {
	    this._events = {};
	    if (this._conf) {
	      configure.call(this, this._conf);
	    }
	  }

	  function configure(conf) {
	    if (conf) {

	      this._conf = conf;

	      conf.delimiter && (this.delimiter = conf.delimiter);
	      conf.maxListeners && (this._events.maxListeners = conf.maxListeners);
	      conf.wildcard && (this.wildcard = conf.wildcard);
	      conf.newListener && (this.newListener = conf.newListener);

	      if (this.wildcard) {
	        this.listenerTree = {};
	      }
	    }
	  }

	  function EventEmitter(conf) {
	    this._events = {};
	    this.newListener = false;
	    configure.call(this, conf);
	  }
	  EventEmitter.EventEmitter2 = EventEmitter; // backwards compatibility for exporting EventEmitter property

	  //
	  // Attention, function return type now is array, always !
	  // It has zero elements if no any matches found and one or more
	  // elements (leafs) if there are matches
	  //
	  function searchListenerTree(handlers, type, tree, i) {
	    if (!tree) {
	      return [];
	    }
	    var listeners=[], leaf, len, branch, xTree, xxTree, isolatedBranch, endReached,
	        typeLength = type.length, currentType = type[i], nextType = type[i+1];
	    if (i === typeLength && tree._listeners) {
	      //
	      // If at the end of the event(s) list and the tree has listeners
	      // invoke those listeners.
	      //
	      if (typeof tree._listeners === 'function') {
	        handlers && handlers.push(tree._listeners);
	        return [tree];
	      } else {
	        for (leaf = 0, len = tree._listeners.length; leaf < len; leaf++) {
	          handlers && handlers.push(tree._listeners[leaf]);
	        }
	        return [tree];
	      }
	    }

	    if ((currentType === '*' || currentType === '**') || tree[currentType]) {
	      //
	      // If the event emitted is '*' at this part
	      // or there is a concrete match at this patch
	      //
	      if (currentType === '*') {
	        for (branch in tree) {
	          if (branch !== '_listeners' && tree.hasOwnProperty(branch)) {
	            listeners = listeners.concat(searchListenerTree(handlers, type, tree[branch], i+1));
	          }
	        }
	        return listeners;
	      } else if(currentType === '**') {
	        endReached = (i+1 === typeLength || (i+2 === typeLength && nextType === '*'));
	        if(endReached && tree._listeners) {
	          // The next element has a _listeners, add it to the handlers.
	          listeners = listeners.concat(searchListenerTree(handlers, type, tree, typeLength));
	        }

	        for (branch in tree) {
	          if (branch !== '_listeners' && tree.hasOwnProperty(branch)) {
	            if(branch === '*' || branch === '**') {
	              if(tree[branch]._listeners && !endReached) {
	                listeners = listeners.concat(searchListenerTree(handlers, type, tree[branch], typeLength));
	              }
	              listeners = listeners.concat(searchListenerTree(handlers, type, tree[branch], i));
	            } else if(branch === nextType) {
	              listeners = listeners.concat(searchListenerTree(handlers, type, tree[branch], i+2));
	            } else {
	              // No match on this one, shift into the tree but not in the type array.
	              listeners = listeners.concat(searchListenerTree(handlers, type, tree[branch], i));
	            }
	          }
	        }
	        return listeners;
	      }

	      listeners = listeners.concat(searchListenerTree(handlers, type, tree[currentType], i+1));
	    }

	    xTree = tree['*'];
	    if (xTree) {
	      //
	      // If the listener tree will allow any match for this part,
	      // then recursively explore all branches of the tree
	      //
	      searchListenerTree(handlers, type, xTree, i+1);
	    }

	    xxTree = tree['**'];
	    if(xxTree) {
	      if(i < typeLength) {
	        if(xxTree._listeners) {
	          // If we have a listener on a '**', it will catch all, so add its handler.
	          searchListenerTree(handlers, type, xxTree, typeLength);
	        }

	        // Build arrays of matching next branches and others.
	        for(branch in xxTree) {
	          if(branch !== '_listeners' && xxTree.hasOwnProperty(branch)) {
	            if(branch === nextType) {
	              // We know the next element will match, so jump twice.
	              searchListenerTree(handlers, type, xxTree[branch], i+2);
	            } else if(branch === currentType) {
	              // Current node matches, move into the tree.
	              searchListenerTree(handlers, type, xxTree[branch], i+1);
	            } else {
	              isolatedBranch = {};
	              isolatedBranch[branch] = xxTree[branch];
	              searchListenerTree(handlers, type, { '**': isolatedBranch }, i+1);
	            }
	          }
	        }
	      } else if(xxTree._listeners) {
	        // We have reached the end and still on a '**'
	        searchListenerTree(handlers, type, xxTree, typeLength);
	      } else if(xxTree['*'] && xxTree['*']._listeners) {
	        searchListenerTree(handlers, type, xxTree['*'], typeLength);
	      }
	    }

	    return listeners;
	  }

	  function growListenerTree(type, listener) {

	    type = typeof type === 'string' ? type.split(this.delimiter) : type.slice();

	    //
	    // Looks for two consecutive '**', if so, don't add the event at all.
	    //
	    for(var i = 0, len = type.length; i+1 < len; i++) {
	      if(type[i] === '**' && type[i+1] === '**') {
	        return;
	      }
	    }

	    var tree = this.listenerTree;
	    var name = type.shift();

	    while (name) {

	      if (!tree[name]) {
	        tree[name] = {};
	      }

	      tree = tree[name];

	      if (type.length === 0) {

	        if (!tree._listeners) {
	          tree._listeners = listener;
	        }
	        else if(typeof tree._listeners === 'function') {
	          tree._listeners = [tree._listeners, listener];
	        }
	        else if (isArray(tree._listeners)) {

	          tree._listeners.push(listener);

	          if (!tree._listeners.warned) {

	            var m = defaultMaxListeners;

	            if (typeof this._events.maxListeners !== 'undefined') {
	              m = this._events.maxListeners;
	            }

	            if (m > 0 && tree._listeners.length > m) {

	              tree._listeners.warned = true;
	              console.error('(node) warning: possible EventEmitter memory ' +
	                            'leak detected. %d listeners added. ' +
	                            'Use emitter.setMaxListeners() to increase limit.',
	                            tree._listeners.length);
	              if(console.trace){
	                console.trace();
	              }
	            }
	          }
	        }
	        return true;
	      }
	      name = type.shift();
	    }
	    return true;
	  }

	  // By default EventEmitters will print a warning if more than
	  // 10 listeners are added to it. This is a useful default which
	  // helps finding memory leaks.
	  //
	  // Obviously not all Emitters should be limited to 10. This function allows
	  // that to be increased. Set to zero for unlimited.

	  EventEmitter.prototype.delimiter = '.';

	  EventEmitter.prototype.setMaxListeners = function(n) {
	    this._events || init.call(this);
	    this._events.maxListeners = n;
	    if (!this._conf) this._conf = {};
	    this._conf.maxListeners = n;
	  };

	  EventEmitter.prototype.event = '';

	  EventEmitter.prototype.once = function(event, fn) {
	    this.many(event, 1, fn);
	    return this;
	  };

	  EventEmitter.prototype.many = function(event, ttl, fn) {
	    var self = this;

	    if (typeof fn !== 'function') {
	      throw new Error('many only accepts instances of Function');
	    }

	    function listener() {
	      if (--ttl === 0) {
	        self.off(event, listener);
	      }
	      fn.apply(this, arguments);
	    }

	    listener._origin = fn;

	    this.on(event, listener);

	    return self;
	  };

	  EventEmitter.prototype.emit = function() {

	    this._events || init.call(this);

	    var type = arguments[0];

	    if (type === 'newListener' && !this.newListener) {
	      if (!this._events.newListener) { return false; }
	    }

	    // Loop through the *_all* functions and invoke them.
	    if (this._all) {
	      var l = arguments.length;
	      var args = new Array(l - 1);
	      for (var i = 1; i < l; i++) args[i - 1] = arguments[i];
	      for (i = 0, l = this._all.length; i < l; i++) {
	        this.event = type;
	        this._all[i].apply(this, [type].concat(args));
	      }
	    }

	    // If there is no 'error' event listener then throw.
	    if (type === 'error') {

	      if (!this._all &&
	        !this._events.error &&
	        !(this.wildcard && this.listenerTree.error)) {

	        if (arguments[1] instanceof Error) {
	          throw arguments[1]; // Unhandled 'error' event
	        } else {
	          throw new Error("Uncaught, unspecified 'error' event.");
	        }
	        return false;
	      }
	    }

	    var handler;

	    if(this.wildcard) {
	      handler = [];
	      var ns = typeof type === 'string' ? type.split(this.delimiter) : type.slice();
	      searchListenerTree.call(this, handler, ns, this.listenerTree, 0);
	    }
	    else {
	      handler = this._events[type];
	    }

	    if (typeof handler === 'function') {
	      this.event = type;
	      if (arguments.length === 1) {
	        handler.call(this);
	      }
	      else if (arguments.length > 1)
	        switch (arguments.length) {
	          case 2:
	            handler.call(this, arguments[1]);
	            break;
	          case 3:
	            handler.call(this, arguments[1], arguments[2]);
	            break;
	          // slower
	          default:
	            var l = arguments.length;
	            var args = new Array(l - 1);
	            for (var i = 1; i < l; i++) args[i - 1] = arguments[i];
	            handler.apply(this, args);
	        }
	      return true;
	    }
	    else if (handler) {
	      var l = arguments.length;
	      var args = new Array(l - 1);
	      for (var i = 1; i < l; i++) args[i - 1] = arguments[i];

	      var listeners = handler.slice();
	      for (var i = 0, l = listeners.length; i < l; i++) {
	        this.event = type;
	        listeners[i].apply(this, args);
	      }
	      return (listeners.length > 0) || !!this._all;
	    }
	    else {
	      return !!this._all;
	    }

	  };

	  EventEmitter.prototype.emitAsync = function() {

	    this._events || init.call(this);

	    var type = arguments[0];

	    if (type === 'newListener' && !this.newListener) {
	      if (!this._events.newListener) { return Promise.resolve([false]); }
	    }

	    var promises= [];

	    // Loop through the *_all* functions and invoke them.
	    if (this._all) {
	      var l = arguments.length;
	      var args = new Array(l - 1);
	      for (var i = 1; i < l; i++) args[i - 1] = arguments[i];
	      for (i = 0, l = this._all.length; i < l; i++) {
	        this.event = type;
	        promises.push(this._all[i].apply(this, args));
	      }
	    }

	    // If there is no 'error' event listener then throw.
	    if (type === 'error') {

	      if (!this._all &&
	        !this._events.error &&
	        !(this.wildcard && this.listenerTree.error)) {

	        if (arguments[1] instanceof Error) {
	          return Promise.reject(arguments[1]); // Unhandled 'error' event
	        } else {
	          return Promise.reject("Uncaught, unspecified 'error' event.");
	        }
	      }
	    }

	    var handler;

	    if(this.wildcard) {
	      handler = [];
	      var ns = typeof type === 'string' ? type.split(this.delimiter) : type.slice();
	      searchListenerTree.call(this, handler, ns, this.listenerTree, 0);
	    }
	    else {
	      handler = this._events[type];
	    }

	    if (typeof handler === 'function') {
	      this.event = type;
	      if (arguments.length === 1) {
	        promises.push(handler.call(this));
	      }
	      else if (arguments.length > 1) {
	        switch (arguments.length) {
	          case 2:
	            promises.push(handler.call(this, arguments[1]));
	            break;
	          case 3:
	            promises.push(handler.call(this, arguments[1], arguments[2]));
	            break;
	          // slower
	          default:
	            var l = arguments.length;
	            var args = new Array(l - 1);
	            for (var i = 1; i < l; i++) args[i - 1] = arguments[i];
	            promises.push(handler.apply(this, args));
	        }
	      }
	    }
	    else if (handler) {
	      var l = arguments.length;
	      var args = new Array(l - 1);
	      for (var i = 1; i < l; i++) args[i - 1] = arguments[i];

	      var listeners = handler.slice();
	      for (var i = 0, l = listeners.length; i < l; i++) {
	        this.event = type;
	        promises.push(listeners[i].apply(this, args));
	      }
	    }
	    return Promise.all(promises);
	  };

	  EventEmitter.prototype.on = function(type, listener) {

	    if (typeof type === 'function') {
	      this.onAny(type);
	      return this;
	    }

	    if (typeof listener !== 'function') {
	      throw new Error('on only accepts instances of Function');
	    }
	    this._events || init.call(this);

	    // To avoid recursion in the case that type == "newListeners"! Before
	    // adding it to the listeners, first emit "newListeners".
	    this.emit('newListener', type, listener);

	    if(this.wildcard) {
	      growListenerTree.call(this, type, listener);
	      return this;
	    }

	    if (!this._events[type]) {
	      // Optimize the case of one listener. Don't need the extra array object.
	      this._events[type] = listener;
	    }
	    else if(typeof this._events[type] === 'function') {
	      // Adding the second element, need to change to array.
	      this._events[type] = [this._events[type], listener];
	    }
	    else if (isArray(this._events[type])) {
	      // If we've already got an array, just append.
	      this._events[type].push(listener);

	      // Check for listener leak
	      if (!this._events[type].warned) {

	        var m = defaultMaxListeners;

	        if (typeof this._events.maxListeners !== 'undefined') {
	          m = this._events.maxListeners;
	        }

	        if (m > 0 && this._events[type].length > m) {

	          this._events[type].warned = true;
	          console.error('(node) warning: possible EventEmitter memory ' +
	                        'leak detected. %d listeners added. ' +
	                        'Use emitter.setMaxListeners() to increase limit.',
	                        this._events[type].length);
	          if(console.trace){
	            console.trace();
	          }
	        }
	      }
	    }
	    return this;
	  };

	  EventEmitter.prototype.onAny = function(fn) {

	    if (typeof fn !== 'function') {
	      throw new Error('onAny only accepts instances of Function');
	    }

	    if(!this._all) {
	      this._all = [];
	    }

	    // Add the function to the event listener collection.
	    this._all.push(fn);
	    return this;
	  };

	  EventEmitter.prototype.addListener = EventEmitter.prototype.on;

	  EventEmitter.prototype.off = function(type, listener) {
	    if (typeof listener !== 'function') {
	      throw new Error('removeListener only takes instances of Function');
	    }

	    var handlers,leafs=[];

	    if(this.wildcard) {
	      var ns = typeof type === 'string' ? type.split(this.delimiter) : type.slice();
	      leafs = searchListenerTree.call(this, null, ns, this.listenerTree, 0);
	    }
	    else {
	      // does not use listeners(), so no side effect of creating _events[type]
	      if (!this._events[type]) return this;
	      handlers = this._events[type];
	      leafs.push({_listeners:handlers});
	    }

	    for (var iLeaf=0; iLeaf<leafs.length; iLeaf++) {
	      var leaf = leafs[iLeaf];
	      handlers = leaf._listeners;
	      if (isArray(handlers)) {

	        var position = -1;

	        for (var i = 0, length = handlers.length; i < length; i++) {
	          if (handlers[i] === listener ||
	            (handlers[i].listener && handlers[i].listener === listener) ||
	            (handlers[i]._origin && handlers[i]._origin === listener)) {
	            position = i;
	            break;
	          }
	        }

	        if (position < 0) {
	          continue;
	        }

	        if(this.wildcard) {
	          leaf._listeners.splice(position, 1);
	        }
	        else {
	          this._events[type].splice(position, 1);
	        }

	        if (handlers.length === 0) {
	          if(this.wildcard) {
	            delete leaf._listeners;
	          }
	          else {
	            delete this._events[type];
	          }
	        }
	        
	        this.emit("removeListener", type, listener);
	        
	        return this;
	      }
	      else if (handlers === listener ||
	        (handlers.listener && handlers.listener === listener) ||
	        (handlers._origin && handlers._origin === listener)) {
	        if(this.wildcard) {
	          delete leaf._listeners;
	        }
	        else {
	          delete this._events[type];
	        }
	        
	        this.emit("removeListener", type, listener);
	      }
	    }

	    function recursivelyGarbageCollect(root) {
	      if (root === undefined) {
	        return;
	      }
	      var keys = Object.keys(root);
	      for (var i in keys) {
	        var key = keys[i];
	        var obj = root[key];
	        if ((obj instanceof Function) || (typeof obj !== "object"))
	          continue;
	        if (Object.keys(obj).length > 0) {
	          recursivelyGarbageCollect(root[key]);
	        }
	        if (Object.keys(obj).length === 0) {
	          delete root[key];
	        }
	      }
	    }
	    recursivelyGarbageCollect(this.listenerTree);

	    return this;
	  };

	  EventEmitter.prototype.offAny = function(fn) {
	    var i = 0, l = 0, fns;
	    if (fn && this._all && this._all.length > 0) {
	      fns = this._all;
	      for(i = 0, l = fns.length; i < l; i++) {
	        if(fn === fns[i]) {
	          fns.splice(i, 1);
	          this.emit("removeListenerAny", fn);
	          return this;
	        }
	      }
	    } else {
	      fns = this._all;
	      for(i = 0, l = fns.length; i < l; i++)
	        this.emit("removeListenerAny", fns[i]);
	      this._all = [];
	    }
	    return this;
	  };

	  EventEmitter.prototype.removeListener = EventEmitter.prototype.off;

	  EventEmitter.prototype.removeAllListeners = function(type) {
	    if (arguments.length === 0) {
	      !this._events || init.call(this);
	      return this;
	    }

	    if(this.wildcard) {
	      var ns = typeof type === 'string' ? type.split(this.delimiter) : type.slice();
	      var leafs = searchListenerTree.call(this, null, ns, this.listenerTree, 0);

	      for (var iLeaf=0; iLeaf<leafs.length; iLeaf++) {
	        var leaf = leafs[iLeaf];
	        leaf._listeners = null;
	      }
	    }
	    else {
	      if (!this._events || !this._events[type]) return this;
	      this._events[type] = null;
	    }
	    return this;
	  };

	  EventEmitter.prototype.listeners = function(type) {
	    if(this.wildcard) {
	      var handlers = [];
	      var ns = typeof type === 'string' ? type.split(this.delimiter) : type.slice();
	      searchListenerTree.call(this, handlers, ns, this.listenerTree, 0);
	      return handlers;
	    }

	    this._events || init.call(this);

	    if (!this._events[type]) this._events[type] = [];
	    if (!isArray(this._events[type])) {
	      this._events[type] = [this._events[type]];
	    }
	    return this._events[type];
	  };

	  EventEmitter.prototype.listenersAny = function() {

	    if(this._all) {
	      return this._all;
	    }
	    else {
	      return [];
	    }

	  };

	  if (true) {
	     // AMD. Register as an anonymous module.
	    !(__WEBPACK_AMD_DEFINE_RESULT__ = function() {
	      return EventEmitter;
	    }.call(exports, __webpack_require__, exports, module), __WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));
	  } else if (typeof exports === 'object') {
	    // CommonJS
	    module.exports = EventEmitter;
	  }
	  else {
	    // Browser global.
	    window.EventEmitter2 = EventEmitter;
	  }
	}();


/***/ },
/* 20 */
/***/ function(module, exports) {

	/* Built-in method references for those with the same name as other `lodash` methods. */
	var nativeGetPrototype = Object.getPrototypeOf;

	/**
	 * Gets the `[[Prototype]]` of `value`.
	 *
	 * @private
	 * @param {*} value The value to query.
	 * @returns {null|Object} Returns the `[[Prototype]]`.
	 */
	function getPrototype(value) {
	  return nativeGetPrototype(Object(value));
	}

	module.exports = getPrototype;


/***/ },
/* 21 */
/***/ function(module, exports) {

	/**
	 * Checks if `value` is a host object in IE < 9.
	 *
	 * @private
	 * @param {*} value The value to check.
	 * @returns {boolean} Returns `true` if `value` is a host object, else `false`.
	 */
	function isHostObject(value) {
	  // Many host objects are `Object` objects that can coerce to strings
	  // despite having improperly defined `toString` methods.
	  var result = false;
	  if (value != null && typeof value.toString != 'function') {
	    try {
	      result = !!(value + '');
	    } catch (e) {}
	  }
	  return result;
	}

	module.exports = isHostObject;


/***/ },
/* 22 */
/***/ function(module, exports) {

	/**
	 * Checks if `value` is object-like. A value is object-like if it's not `null`
	 * and has a `typeof` result of "object".
	 *
	 * @static
	 * @memberOf _
	 * @since 4.0.0
	 * @category Lang
	 * @param {*} value The value to check.
	 * @returns {boolean} Returns `true` if `value` is object-like, else `false`.
	 * @example
	 *
	 * _.isObjectLike({});
	 * // => true
	 *
	 * _.isObjectLike([1, 2, 3]);
	 * // => true
	 *
	 * _.isObjectLike(_.noop);
	 * // => false
	 *
	 * _.isObjectLike(null);
	 * // => false
	 */
	function isObjectLike(value) {
	  return !!value && typeof value == 'object';
	}

	module.exports = isObjectLike;


/***/ },
/* 23 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	var strictUriEncode = __webpack_require__(28);

	function encode(value, strict) {
		return strict ? strictUriEncode(value) : encodeURIComponent(value);
	}

	exports.extract = function (str) {
		return str.split('?')[1] || '';
	};

	exports.parse = function (str) {
		// Create an object with no prototype
		// https://github.com/sindresorhus/query-string/issues/47
		var ret = Object.create(null);

		if (typeof str !== 'string') {
			return ret;
		}

		str = str.trim().replace(/^(\?|#|&)/, '');

		if (!str) {
			return ret;
		}

		str.split('&').forEach(function (param) {
			var parts = param.replace(/\+/g, ' ').split('=');
			// Firefox (pre 40) decodes `%3D` to `=`
			// https://github.com/sindresorhus/query-string/pull/37
			var key = parts.shift();
			var val = parts.length > 0 ? parts.join('=') : undefined;

			key = decodeURIComponent(key);

			// missing `=` should be `null`:
			// http://w3.org/TR/2012/WD-url-20120524/#collect-url-parameters
			val = val === undefined ? null : decodeURIComponent(val);

			if (ret[key] === undefined) {
				ret[key] = val;
			} else if (Array.isArray(ret[key])) {
				ret[key].push(val);
			} else {
				ret[key] = [ret[key], val];
			}
		});

		return ret;
	};

	exports.stringify = function (obj, opts) {
		opts = opts || {};

		var strict = opts.strict !== false;

		return obj ? Object.keys(obj).sort().map(function (key) {
			var val = obj[key];

			if (val === undefined) {
				return '';
			}

			if (val === null) {
				return key;
			}

			if (Array.isArray(val)) {
				var result = [];

				val.slice().sort().forEach(function (val2) {
					if (val2 === undefined) {
						return;
					}

					if (val2 === null) {
						result.push(encode(key, strict));
					} else {
						result.push(encode(key, strict) + '=' + encode(val2, strict));
					}
				});

				return result.join('&');
			}

			return encode(key, strict) + '=' + encode(val, strict);
		}).filter(function (x) {
			return x.length > 0;
		}).join('&') : '';
	};


/***/ },
/* 24 */
/***/ function(module, exports, __webpack_require__) {

	var __WEBPACK_AMD_DEFINE_FACTORY__, __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;// MIT License:
	//
	// Copyright (c) 2010-2012, Joe Walnes
	//
	// Permission is hereby granted, free of charge, to any person obtaining a copy
	// of this software and associated documentation files (the "Software"), to deal
	// in the Software without restriction, including without limitation the rights
	// to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
	// copies of the Software, and to permit persons to whom the Software is
	// furnished to do so, subject to the following conditions:
	//
	// The above copyright notice and this permission notice shall be included in
	// all copies or substantial portions of the Software.
	//
	// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
	// IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
	// FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
	// AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
	// LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
	// OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
	// THE SOFTWARE.

	/**
	 * This behaves like a WebSocket in every way, except if it fails to connect,
	 * or it gets disconnected, it will repeatedly poll until it successfully connects
	 * again.
	 *
	 * It is API compatible, so when you have:
	 *   ws = new WebSocket('ws://....');
	 * you can replace with:
	 *   ws = new ReconnectingWebSocket('ws://....');
	 *
	 * The event stream will typically look like:
	 *  onconnecting
	 *  onopen
	 *  onmessage
	 *  onmessage
	 *  onclose // lost connection
	 *  onconnecting
	 *  onopen  // sometime later...
	 *  onmessage
	 *  onmessage
	 *  etc...
	 *
	 * It is API compatible with the standard WebSocket API, apart from the following members:
	 *
	 * - `bufferedAmount`
	 * - `extensions`
	 * - `binaryType`
	 *
	 * Latest version: https://github.com/joewalnes/reconnecting-websocket/
	 * - Joe Walnes
	 *
	 * Syntax
	 * ======
	 * var socket = new ReconnectingWebSocket(url, protocols, options);
	 *
	 * Parameters
	 * ==========
	 * url - The url you are connecting to.
	 * protocols - Optional string or array of protocols.
	 * options - See below
	 *
	 * Options
	 * =======
	 * Options can either be passed upon instantiation or set after instantiation:
	 *
	 * var socket = new ReconnectingWebSocket(url, null, { debug: true, reconnectInterval: 4000 });
	 *
	 * or
	 *
	 * var socket = new ReconnectingWebSocket(url);
	 * socket.debug = true;
	 * socket.reconnectInterval = 4000;
	 *
	 * debug
	 * - Whether this instance should log debug messages. Accepts true or false. Default: false.
	 *
	 * automaticOpen
	 * - Whether or not the websocket should attempt to connect immediately upon instantiation. The socket can be manually opened or closed at any time using ws.open() and ws.close().
	 *
	 * reconnectInterval
	 * - The number of milliseconds to delay before attempting to reconnect. Accepts integer. Default: 1000.
	 *
	 * maxReconnectInterval
	 * - The maximum number of milliseconds to delay a reconnection attempt. Accepts integer. Default: 30000.
	 *
	 * reconnectDecay
	 * - The rate of increase of the reconnect delay. Allows reconnect attempts to back off when problems persist. Accepts integer or float. Default: 1.5.
	 *
	 * timeoutInterval
	 * - The maximum time in milliseconds to wait for a connection to succeed before closing and retrying. Accepts integer. Default: 2000.
	 *
	 */
	(function (global, factory) {
	    if (true) {
	        !(__WEBPACK_AMD_DEFINE_ARRAY__ = [], __WEBPACK_AMD_DEFINE_FACTORY__ = (factory), __WEBPACK_AMD_DEFINE_RESULT__ = (typeof __WEBPACK_AMD_DEFINE_FACTORY__ === 'function' ? (__WEBPACK_AMD_DEFINE_FACTORY__.apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__)) : __WEBPACK_AMD_DEFINE_FACTORY__), __WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));
	    } else if (typeof module !== 'undefined' && module.exports){
	        module.exports = factory();
	    } else {
	        global.ReconnectingWebSocket = factory();
	    }
	})(this, function () {

	    if (!('WebSocket' in window)) {
	        return;
	    }

	    function ReconnectingWebSocket(url, protocols, options) {

	        // Default settings
	        var settings = {

	            /** Whether this instance should log debug messages. */
	            debug: false,

	            /** Whether or not the websocket should attempt to connect immediately upon instantiation. */
	            automaticOpen: true,

	            /** The number of milliseconds to delay before attempting to reconnect. */
	            reconnectInterval: 1000,
	            /** The maximum number of milliseconds to delay a reconnection attempt. */
	            maxReconnectInterval: 30000,
	            /** The rate of increase of the reconnect delay. Allows reconnect attempts to back off when problems persist. */
	            reconnectDecay: 1.5,

	            /** The maximum time in milliseconds to wait for a connection to succeed before closing and retrying. */
	            timeoutInterval: 2000,

	            /** The maximum number of reconnection attempts to make. Unlimited if null. */
	            maxReconnectAttempts: null
	        }
	        if (!options) { options = {}; }

	        // Overwrite and define settings with options if they exist.
	        for (var key in settings) {
	            if (typeof options[key] !== 'undefined') {
	                this[key] = options[key];
	            } else {
	                this[key] = settings[key];
	            }
	        }

	        // These should be treated as read-only properties

	        /** The URL as resolved by the constructor. This is always an absolute URL. Read only. */
	        this.url = url;

	        /** The number of attempted reconnects since starting, or the last successful connection. Read only. */
	        this.reconnectAttempts = 0;

	        /**
	         * The current state of the connection.
	         * Can be one of: WebSocket.CONNECTING, WebSocket.OPEN, WebSocket.CLOSING, WebSocket.CLOSED
	         * Read only.
	         */
	        this.readyState = WebSocket.CONNECTING;

	        /**
	         * A string indicating the name of the sub-protocol the server selected; this will be one of
	         * the strings specified in the protocols parameter when creating the WebSocket object.
	         * Read only.
	         */
	        this.protocol = null;

	        // Private state variables

	        var self = this;
	        var ws;
	        var forcedClose = false;
	        var timedOut = false;
	        var eventTarget = document.createElement('div');

	        // Wire up "on*" properties as event handlers

	        eventTarget.addEventListener('open',       function(event) { self.onopen(event); });
	        eventTarget.addEventListener('close',      function(event) { self.onclose(event); });
	        eventTarget.addEventListener('connecting', function(event) { self.onconnecting(event); });
	        eventTarget.addEventListener('message',    function(event) { self.onmessage(event); });
	        eventTarget.addEventListener('error',      function(event) { self.onerror(event); });

	        // Expose the API required by EventTarget

	        this.addEventListener = eventTarget.addEventListener.bind(eventTarget);
	        this.removeEventListener = eventTarget.removeEventListener.bind(eventTarget);
	        this.dispatchEvent = eventTarget.dispatchEvent.bind(eventTarget);

	        /**
	         * This function generates an event that is compatible with standard
	         * compliant browsers and IE9 - IE11
	         *
	         * This will prevent the error:
	         * Object doesn't support this action
	         *
	         * http://stackoverflow.com/questions/19345392/why-arent-my-parameters-getting-passed-through-to-a-dispatched-event/19345563#19345563
	         * @param s String The name that the event should use
	         * @param args Object an optional object that the event will use
	         */
	        function generateEvent(s, args) {
	        	var evt = document.createEvent("CustomEvent");
	        	evt.initCustomEvent(s, false, false, args);
	        	return evt;
	        };

	        this.open = function (reconnectAttempt) {
	            ws = new WebSocket(self.url, protocols || []);

	            if (reconnectAttempt) {
	                if (this.maxReconnectAttempts && this.reconnectAttempts > this.maxReconnectAttempts) {
	                    return;
	                }
	            } else {
	                eventTarget.dispatchEvent(generateEvent('connecting'));
	                this.reconnectAttempts = 0;
	            }

	            if (self.debug || ReconnectingWebSocket.debugAll) {
	                console.debug('ReconnectingWebSocket', 'attempt-connect', self.url);
	            }

	            var localWs = ws;
	            var timeout = setTimeout(function() {
	                if (self.debug || ReconnectingWebSocket.debugAll) {
	                    console.debug('ReconnectingWebSocket', 'connection-timeout', self.url);
	                }
	                timedOut = true;
	                localWs.close();
	                timedOut = false;
	            }, self.timeoutInterval);

	            ws.onopen = function(event) {
	                clearTimeout(timeout);
	                if (self.debug || ReconnectingWebSocket.debugAll) {
	                    console.debug('ReconnectingWebSocket', 'onopen', self.url);
	                }
	                self.protocol = ws.protocol;
	                self.readyState = WebSocket.OPEN;
	                self.reconnectAttempts = 0;
	                var e = generateEvent('open');
	                e.isReconnect = reconnectAttempt;
	                reconnectAttempt = false;
	                eventTarget.dispatchEvent(e);
	            };

	            ws.onclose = function(event) {
	                clearTimeout(timeout);
	                ws = null;
	                if (forcedClose) {
	                    self.readyState = WebSocket.CLOSED;
	                    eventTarget.dispatchEvent(generateEvent('close'));
	                } else {
	                    self.readyState = WebSocket.CONNECTING;
	                    var e = generateEvent('connecting');
	                    e.code = event.code;
	                    e.reason = event.reason;
	                    e.wasClean = event.wasClean;
	                    eventTarget.dispatchEvent(e);
	                    if (!reconnectAttempt && !timedOut) {
	                        if (self.debug || ReconnectingWebSocket.debugAll) {
	                            console.debug('ReconnectingWebSocket', 'onclose', self.url);
	                        }
	                        eventTarget.dispatchEvent(generateEvent('close'));
	                    }

	                    var timeout = self.reconnectInterval * Math.pow(self.reconnectDecay, self.reconnectAttempts);
	                    setTimeout(function() {
	                        self.reconnectAttempts++;
	                        self.open(true);
	                    }, timeout > self.maxReconnectInterval ? self.maxReconnectInterval : timeout);
	                }
	            };
	            ws.onmessage = function(event) {
	                if (self.debug || ReconnectingWebSocket.debugAll) {
	                    console.debug('ReconnectingWebSocket', 'onmessage', self.url, event.data);
	                }
	                var e = generateEvent('message');
	                e.data = event.data;
	                eventTarget.dispatchEvent(e);
	            };
	            ws.onerror = function(event) {
	                if (self.debug || ReconnectingWebSocket.debugAll) {
	                    console.debug('ReconnectingWebSocket', 'onerror', self.url, event);
	                }
	                eventTarget.dispatchEvent(generateEvent('error'));
	            };
	        }

	        // Whether or not to create a websocket upon instantiation
	        if (this.automaticOpen == true) {
	            this.open(false);
	        }

	        /**
	         * Transmits data to the server over the WebSocket connection.
	         *
	         * @param data a text string, ArrayBuffer or Blob to send to the server.
	         */
	        this.send = function(data) {
	            if (ws) {
	                if (self.debug || ReconnectingWebSocket.debugAll) {
	                    console.debug('ReconnectingWebSocket', 'send', self.url, data);
	                }
	                return ws.send(data);
	            } else {
	                throw 'INVALID_STATE_ERR : Pausing to reconnect websocket';
	            }
	        };

	        /**
	         * Closes the WebSocket connection or connection attempt, if any.
	         * If the connection is already CLOSED, this method does nothing.
	         */
	        this.close = function(code, reason) {
	            // Default CLOSE_NORMAL code
	            if (typeof code == 'undefined') {
	                code = 1000;
	            }
	            forcedClose = true;
	            if (ws) {
	                ws.close(code, reason);
	            }
	        };

	        /**
	         * Additional public API method to refresh the connection if still open (close, re-open).
	         * For example, if the app suspects bad data / missed heart beats, it can try to refresh.
	         */
	        this.refresh = function() {
	            if (ws) {
	                ws.close();
	            }
	        };
	    }

	    /**
	     * An event listener to be called when the WebSocket connection's readyState changes to OPEN;
	     * this indicates that the connection is ready to send and receive data.
	     */
	    ReconnectingWebSocket.prototype.onopen = function(event) {};
	    /** An event listener to be called when the WebSocket connection's readyState changes to CLOSED. */
	    ReconnectingWebSocket.prototype.onclose = function(event) {};
	    /** An event listener to be called when a connection begins being attempted. */
	    ReconnectingWebSocket.prototype.onconnecting = function(event) {};
	    /** An event listener to be called when a message is received from the server. */
	    ReconnectingWebSocket.prototype.onmessage = function(event) {};
	    /** An event listener to be called when an error occurs. */
	    ReconnectingWebSocket.prototype.onerror = function(event) {};

	    /**
	     * Whether all instances of ReconnectingWebSocket should log debug messages.
	     * Setting this to true is the equivalent of setting all instances of ReconnectingWebSocket.debug to true.
	     */
	    ReconnectingWebSocket.debugAll = false;

	    ReconnectingWebSocket.CONNECTING = WebSocket.CONNECTING;
	    ReconnectingWebSocket.OPEN = WebSocket.OPEN;
	    ReconnectingWebSocket.CLOSING = WebSocket.CLOSING;
	    ReconnectingWebSocket.CLOSED = WebSocket.CLOSED;

	    return ReconnectingWebSocket;
	});


/***/ },
/* 25 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	exports.__esModule = true;

	var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

	exports["default"] = applyMiddleware;

	var _compose = __webpack_require__(8);

	var _compose2 = _interopRequireDefault(_compose);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

	/**
	 * Creates a store enhancer that applies middleware to the dispatch method
	 * of the Redux store. This is handy for a variety of tasks, such as expressing
	 * asynchronous actions in a concise manner, or logging every action payload.
	 *
	 * See `redux-thunk` package as an example of the Redux middleware.
	 *
	 * Because middleware is potentially asynchronous, this should be the first
	 * store enhancer in the composition chain.
	 *
	 * Note that each middleware will be given the `dispatch` and `getState` functions
	 * as named arguments.
	 *
	 * @param {...Function} middlewares The middleware chain to be applied.
	 * @returns {Function} A store enhancer applying the middleware.
	 */
	function applyMiddleware() {
	  for (var _len = arguments.length, middlewares = Array(_len), _key = 0; _key < _len; _key++) {
	    middlewares[_key] = arguments[_key];
	  }

	  return function (createStore) {
	    return function (reducer, initialState, enhancer) {
	      var store = createStore(reducer, initialState, enhancer);
	      var _dispatch = store.dispatch;
	      var chain = [];

	      var middlewareAPI = {
	        getState: store.getState,
	        dispatch: function dispatch(action) {
	          return _dispatch(action);
	        }
	      };
	      chain = middlewares.map(function (middleware) {
	        return middleware(middlewareAPI);
	      });
	      _dispatch = _compose2["default"].apply(undefined, chain)(store.dispatch);

	      return _extends({}, store, {
	        dispatch: _dispatch
	      });
	    };
	  };
	}

/***/ },
/* 26 */
/***/ function(module, exports) {

	'use strict';

	exports.__esModule = true;
	exports["default"] = bindActionCreators;
	function bindActionCreator(actionCreator, dispatch) {
	  return function () {
	    return dispatch(actionCreator.apply(undefined, arguments));
	  };
	}

	/**
	 * Turns an object whose values are action creators, into an object with the
	 * same keys, but with every function wrapped into a `dispatch` call so they
	 * may be invoked directly. This is just a convenience method, as you can call
	 * `store.dispatch(MyActionCreators.doSomething())` yourself just fine.
	 *
	 * For convenience, you can also pass a single function as the first argument,
	 * and get a function in return.
	 *
	 * @param {Function|Object} actionCreators An object whose values are action
	 * creator functions. One handy way to obtain it is to use ES6 `import * as`
	 * syntax. You may also pass a single function.
	 *
	 * @param {Function} dispatch The `dispatch` function available on your Redux
	 * store.
	 *
	 * @returns {Function|Object} The object mimicking the original object, but with
	 * every action creator wrapped into the `dispatch` call. If you passed a
	 * function as `actionCreators`, the return value will also be a single
	 * function.
	 */
	function bindActionCreators(actionCreators, dispatch) {
	  if (typeof actionCreators === 'function') {
	    return bindActionCreator(actionCreators, dispatch);
	  }

	  if (typeof actionCreators !== 'object' || actionCreators === null) {
	    throw new Error('bindActionCreators expected an object or a function, instead received ' + (actionCreators === null ? 'null' : typeof actionCreators) + '. ' + 'Did you write "import ActionCreators from" instead of "import * as ActionCreators from"?');
	  }

	  var keys = Object.keys(actionCreators);
	  var boundActionCreators = {};
	  for (var i = 0; i < keys.length; i++) {
	    var key = keys[i];
	    var actionCreator = actionCreators[key];
	    if (typeof actionCreator === 'function') {
	      boundActionCreators[key] = bindActionCreator(actionCreator, dispatch);
	    }
	  }
	  return boundActionCreators;
	}

/***/ },
/* 27 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	exports.__esModule = true;
	exports["default"] = combineReducers;

	var _createStore = __webpack_require__(9);

	var _isPlainObject = __webpack_require__(6);

	var _isPlainObject2 = _interopRequireDefault(_isPlainObject);

	var _warning = __webpack_require__(10);

	var _warning2 = _interopRequireDefault(_warning);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

	function getUndefinedStateErrorMessage(key, action) {
	  var actionType = action && action.type;
	  var actionName = actionType && '"' + actionType.toString() + '"' || 'an action';

	  return 'Given action ' + actionName + ', reducer "' + key + '" returned undefined. ' + 'To ignore an action, you must explicitly return the previous state.';
	}

	function getUnexpectedStateShapeWarningMessage(inputState, reducers, action) {
	  var reducerKeys = Object.keys(reducers);
	  var argumentName = action && action.type === _createStore.ActionTypes.INIT ? 'initialState argument passed to createStore' : 'previous state received by the reducer';

	  if (reducerKeys.length === 0) {
	    return 'Store does not have a valid reducer. Make sure the argument passed ' + 'to combineReducers is an object whose values are reducers.';
	  }

	  if (!(0, _isPlainObject2["default"])(inputState)) {
	    return 'The ' + argumentName + ' has unexpected type of "' + {}.toString.call(inputState).match(/\s([a-z|A-Z]+)/)[1] + '". Expected argument to be an object with the following ' + ('keys: "' + reducerKeys.join('", "') + '"');
	  }

	  var unexpectedKeys = Object.keys(inputState).filter(function (key) {
	    return !reducers.hasOwnProperty(key);
	  });

	  if (unexpectedKeys.length > 0) {
	    return 'Unexpected ' + (unexpectedKeys.length > 1 ? 'keys' : 'key') + ' ' + ('"' + unexpectedKeys.join('", "') + '" found in ' + argumentName + '. ') + 'Expected to find one of the known reducer keys instead: ' + ('"' + reducerKeys.join('", "') + '". Unexpected keys will be ignored.');
	  }
	}

	function assertReducerSanity(reducers) {
	  Object.keys(reducers).forEach(function (key) {
	    var reducer = reducers[key];
	    var initialState = reducer(undefined, { type: _createStore.ActionTypes.INIT });

	    if (typeof initialState === 'undefined') {
	      throw new Error('Reducer "' + key + '" returned undefined during initialization. ' + 'If the state passed to the reducer is undefined, you must ' + 'explicitly return the initial state. The initial state may ' + 'not be undefined.');
	    }

	    var type = '@@redux/PROBE_UNKNOWN_ACTION_' + Math.random().toString(36).substring(7).split('').join('.');
	    if (typeof reducer(undefined, { type: type }) === 'undefined') {
	      throw new Error('Reducer "' + key + '" returned undefined when probed with a random type. ' + ('Don\'t try to handle ' + _createStore.ActionTypes.INIT + ' or other actions in "redux/*" ') + 'namespace. They are considered private. Instead, you must return the ' + 'current state for any unknown actions, unless it is undefined, ' + 'in which case you must return the initial state, regardless of the ' + 'action type. The initial state may not be undefined.');
	    }
	  });
	}

	/**
	 * Turns an object whose values are different reducer functions, into a single
	 * reducer function. It will call every child reducer, and gather their results
	 * into a single state object, whose keys correspond to the keys of the passed
	 * reducer functions.
	 *
	 * @param {Object} reducers An object whose values correspond to different
	 * reducer functions that need to be combined into one. One handy way to obtain
	 * it is to use ES6 `import * as reducers` syntax. The reducers may never return
	 * undefined for any action. Instead, they should return their initial state
	 * if the state passed to them was undefined, and the current state for any
	 * unrecognized action.
	 *
	 * @returns {Function} A reducer function that invokes every reducer inside the
	 * passed object, and builds a state object with the same shape.
	 */
	function combineReducers(reducers) {
	  var reducerKeys = Object.keys(reducers);
	  var finalReducers = {};
	  for (var i = 0; i < reducerKeys.length; i++) {
	    var key = reducerKeys[i];
	    if (typeof reducers[key] === 'function') {
	      finalReducers[key] = reducers[key];
	    }
	  }
	  var finalReducerKeys = Object.keys(finalReducers);

	  var sanityError;
	  try {
	    assertReducerSanity(finalReducers);
	  } catch (e) {
	    sanityError = e;
	  }

	  return function combination() {
	    var state = arguments.length <= 0 || arguments[0] === undefined ? {} : arguments[0];
	    var action = arguments[1];

	    if (sanityError) {
	      throw sanityError;
	    }

	    if (true) {
	      var warningMessage = getUnexpectedStateShapeWarningMessage(state, finalReducers, action);
	      if (warningMessage) {
	        (0, _warning2["default"])(warningMessage);
	      }
	    }

	    var hasChanged = false;
	    var nextState = {};
	    for (var i = 0; i < finalReducerKeys.length; i++) {
	      var key = finalReducerKeys[i];
	      var reducer = finalReducers[key];
	      var previousStateForKey = state[key];
	      var nextStateForKey = reducer(previousStateForKey, action);
	      if (typeof nextStateForKey === 'undefined') {
	        var errorMessage = getUndefinedStateErrorMessage(key, action);
	        throw new Error(errorMessage);
	      }
	      nextState[key] = nextStateForKey;
	      hasChanged = hasChanged || nextStateForKey !== previousStateForKey;
	    }
	    return hasChanged ? nextState : state;
	  };
	}

/***/ },
/* 28 */
/***/ function(module, exports) {

	'use strict';
	module.exports = function (str) {
		return encodeURIComponent(str).replace(/[!'()*]/g, function (c) {
			return '%' + c.charCodeAt(0).toString(16).toUpperCase();
		});
	};


/***/ }
/******/ ])
});
;