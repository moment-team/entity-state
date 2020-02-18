"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _get2 = _interopRequireDefault(require("lodash/fp/get"));

var _set2 = _interopRequireDefault(require("lodash/fp/set"));

var _unset2 = _interopRequireDefault(require("lodash/fp/unset"));

var _omitBy2 = _interopRequireDefault(require("lodash/fp/omitBy"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(source, true).forEach(function (key) { _defineProperty(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(source).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

var EntityState = {};

function setState(state, source, sourcePath) {
  return source && sourcePath ? (0, _set2["default"])(sourcePath, state, source) : state;
}
/**
 * Initialize state
 *
 * @param {object} source Data source containing the state
 * @param {string} sourcePath Path inside source data where state should be located
 * @return {object} State or new source that includes state
 */


EntityState.initialize = function (source, sourcePath) {
  var state = {
    // The data this state is for
    data: undefined,
    // Unstaged changes to the data (like before sending to a server)
    pathChange: {},
    // { [path]: changed-value }
    // Initial value, at the time it started changing in this state. For undo features and showing
    // what properties was changed after changes has been submitted.
    pathInitial: {},
    // { [path]: initial-value }
    // Timestamp when this state where first initialized
    initializedAt: undefined,
    // Timestamp when this state where last loaded
    loadedAt: undefined,
    // Timestamp when last unstaged change where added to the state
    changedAt: undefined,
    // Error that is relevant for the whole data set
    error: undefined,
    // Errors that apply to a given place in the data structure
    pathError: {},
    // View mode, like 'edit' for toggeling display of a form
    mode: undefined,
    // View modes relevant for a given path. Like editing an object that is part of an array
    pathMode: {},
    // An operation that will load new data into this state when done is pending
    loading: false,
    // Loading data pending for a given subset of data
    pathLoading: {},
    // [path]: true
    // An operation that is updating the remote source of this data is pending
    updating: false,
    // Updating data pending for given subset of data
    pathUpdating: {} // [path]: true

  }; // return (source && sourcePath) ?
  //   _set(sourcePath, state, source)
  //   :
  //   state;

  return setState(state, source, sourcePath);
};

function getState(source, sourcePath) {
  return (source && sourcePath ? (0, _get2["default"])(sourcePath, source) : source) || EntityState.initialize();
}
/**
 * Load data into state
 *
 * @param {object|array} data Data to load
 * @param {object} source Data source containing the state
 * @param {string} sourcePath Path inside source data where state should be located
 * @return {object} New state
 */


EntityState.load = function (data, source, sourcePath) {
  var state = getState(source, sourcePath);
  return setState(_objectSpread({}, EntityState.initialize(), {
    pathChange: state.pathChange || {},
    data: data
  }), source, sourcePath);
};
/**
 * Set a new value at the given path in the data
 *
 * @param {string} path Path to where inside the data-set to set the new value
 * @param {object|array} value Value to set at (path) in data-set
 * @param {object} source Data source containing the state
 * @param {string} sourcePath Path inside source data where state should be located
 * @return {object} New state
 */


EntityState.set = function (path, value, source, sourcePath) {
  if (typeof path !== 'string' || path.length === 0) {
    throw new Error('EntityState.set - path is invalid: ' + path);
  }

  if (source !== undefined && _typeof(source) !== 'object') {
    throw new Error('EntityState.set - source must be an object or array');
  }

  return source && sourcePath ? value === undefined ? (0, _unset2["default"])("".concat(sourcePath, ".data.").concat(path), source) : (0, _set2["default"])("".concat(sourcePath, ".data.").concat(path), value, source) : value === undefined ? (0, _unset2["default"])("data.".concat(path), source || EntityState.initialize()) : (0, _set2["default"])("data.".concat(path), value, source || EntityState.initialize());
};
/**
 * Stage a new value at a given path of the data in `pathChange`, while keeping the original set in `data`
 *
 * @param {string} path Path to where inside the state data-set to stage the new value
 * @param {object|array} value Value to set at (path) in the state data-set
 * @param {object} source Data source containing the state
 * @param {string} sourcePath Path inside source data where state should be located
 * @return {object} New state
 */


EntityState.stage = function (path, value, source, sourcePath) {
  // if ((typeof path !== 'string') || path.length === 0) {
  //   throw new Error('EntityState.set - path is invalid: ' + path);
  // }
  // if (source !== undefined && (typeof source) !== 'object') {
  //   throw new Error('EntityState.set - source must be an object or array');
  // }
  // const prevState = (source && sourcePath) ? _get(sourcePath, source)
  var prevState = getState(source, sourcePath); // const withChange = _set(`pathChange["${path}"]`, value, prevState);
  // return

  var initialValue = (0, _get2["default"])("pathInitial[\"".concat(path, "\"]"), prevState) || (0, _get2["default"])("data.".concat(path), prevState);
  var state = (0, _set2["default"])("pathInitial[\"".concat(path, "\"]"), initialValue, (0, _set2["default"])("pathChange[\"".concat(path, "\"]"), value, prevState));
  return setState(state, source, sourcePath); // return setState({
  //   pathInitial: {}
  // }, source, sourcePath);
  // return (source && sourcePath) ?
  //   _set(`${sourcePath}.pathChange["${path}"]`, value, source)
  //   :
  //   _set(`pathChange["${path}"]`, value, source || EntityState.initialize());
};
/**
 * Set an error in the state, that is regarding the whole data set or surrounding processes.
 *
 * @param {object} error Error object
 * @param {object} source Data source containing the state
 * @param {string} sourcePath Path inside source data where state should be located
 * @return {object} New state
 */


EntityState.error = function (error, source, sourcePath) {
  return source && sourcePath ? (0, _set2["default"])("".concat(sourcePath, ".error"), error, source) : (0, _set2["default"])('error', error, source || EntityState.initialize());
};
/**
 * Set an error for a given path in the state
 *
 * @param {string} path Path to the value inside the state data-set where this error applies
 * @param {object} error Error object
 * @param {object} source Data source containing the state
 * @param {string} sourcePath Path inside source data where state should be located
 * @return {object} New state
 */


EntityState.pathError = function (path, error, source, sourcePath) {
  return source && sourcePath ? (0, _set2["default"])("".concat(sourcePath, ".pathError[\"").concat(path, "\"]"), error, source) : (0, _set2["default"])("pathError[\"".concat(path, "\"]"), error, source || EntityState.initialize());
};
/**
 * Clear the state structure, removing both the data and all metadata
 *
 * @param {object} source Data source containing the state
 * @param {string} sourcePath Path inside source data where state is located
 * @return {object} New state
 */


EntityState.clear = function (source, sourcePath) {
  return source && sourcePath ? (0, _set2["default"])(sourcePath, undefined, source) : undefined;
};
/**
 * Clean the structure, keeping the data but removing any local change or errors in the metadata
 *
 * @param {object} source Data source containing the state
 * @param {string} sourcePath Path inside source data where state is located
 * @return {object} New state
 */


EntityState.clean = function (source, sourcePath) {
  return source && sourcePath ? (0, _set2["default"])(sourcePath, _objectSpread({}, (0, _get2["default"])(sourcePath, source) || {}, {
    pathChange: {},
    pathError: {}
  }), source) : _objectSpread({}, source || {}, {
    pathChange: {},
    pathError: {}
  });
};
/**
 * Clean the structure for a given path, removing local changes and errors for paths starting
 * with the given path, while keeping the rest
 * @param {string} pathPrefix Prefix of state to clean (leaving others intact)
 * @param {object} state Entity state object
 * @return {object} New entity state object
 */


EntityState.cleanPath = function (pathPrefix, state) {
  return ['pathError', 'pathChange', 'pathInitial'].reduce(function (state, statePath) {
    return state[statePath] ? (0, _set2["default"])(statePath, (0, _omitBy2["default"])(function (val, path) {
      return path.substr(0, pathPrefix.length) === pathPrefix;
    }, state[statePath]), state) : state;
  }, state);
};
/**
 * Indent path-based metadata of structure, adding a given prefix to all path-based keys
 * @param {string} pathPrefix The prefix for the existing path keys
 * @param {object} source Data source containing the state
 * @return {object} New state
 */


EntityState.indent = function (pathPrefix, source) {
  return ['pathError', 'pathChange', 'pathInitial', 'pathMode', 'pathLoading', 'pathUpdating'].reduce(function (source, statePath) {
    return source[statePath] ? (0, _set2["default"])(statePath, Object.keys(source[statePath]).reduce(function (subState, path) {
      return _objectSpread({}, subState, _defineProperty({}, "".concat(pathPrefix, ".").concat(path), source[statePath][path]));
    }, {}), source) : source;
  }, source);
};
/**
 * Get a copy of the data from a given state object, with the local changes merged in to the structure
 *
 * @param {object} state State containing the relevant data
 * @return {object|array} Data structure
 */


EntityState.dataWithChanges = function () {
  var state = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
  var data = state.data,
      _state$pathChange = state.pathChange,
      pathChange = _state$pathChange === void 0 ? {} : _state$pathChange;

  if (data === undefined || data === null) {
    // No data, avoid returning an empty object
    return data;
  } // Merge staged changes with original data to form the active data set


  return Object.keys(pathChange).reduce(function (data, path) {
    return (0, _set2["default"])(path, pathChange[path], data);
  }, data || {});
};

var _default = EntityState;
exports["default"] = _default;