"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(source, true).forEach(function (key) { _defineProperty(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(source).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(_next, _throw); } }

function _asyncToGenerator(fn) { return function () { var self = this, args = arguments; return new Promise(function (resolve, reject) { var gen = fn.apply(self, args); function _next(value) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value); } function _throw(err) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err); } _next(undefined); }); }; }

// import 'whatwg-fetch';
var Http = {};

Http._fetch = function () {
  return fetch.apply(void 0, arguments);
};
/**
 * Make HTTP Request
 *
 * @param {object} options Request options
 * @return {object} Promise resolved with { statusCode, response, error }
 */


Http.request =
/*#__PURE__*/
_asyncToGenerator(
/*#__PURE__*/
regeneratorRuntime.mark(function _callee() {
  var options,
      baseUrl,
      headers,
      _options$method,
      method,
      _options$path,
      path,
      _options$query,
      query,
      body,
      _options$credentials,
      credentials,
      _options$contentType,
      contentType,
      _options$cache,
      cache,
      _options$redirect,
      redirect,
      _options$referrerPoli,
      referrerPolicy,
      _options$mode,
      mode,
      url,
      fetchHeaders,
      res,
      fetchBody,
      error,
      _error,
      responseContentType,
      statusCode,
      isJson,
      response,
      _error2,
      _error3,
      _args = arguments;

  return regeneratorRuntime.wrap(function _callee$(_context) {
    while (1) {
      switch (_context.prev = _context.next) {
        case 0:
          options = _args.length > 0 && _args[0] !== undefined ? _args[0] : {};
          baseUrl = options.baseUrl, headers = options.headers, _options$method = options.method, method = _options$method === void 0 ? 'GET' : _options$method, _options$path = options.path, path = _options$path === void 0 ? '' : _options$path, _options$query = options.query, query = _options$query === void 0 ? {} : _options$query, body = options.body, _options$credentials = options.credentials, credentials = _options$credentials === void 0 ? 'include' : _options$credentials, _options$contentType = options.contentType, contentType = _options$contentType === void 0 ? 'application/json' : _options$contentType, _options$cache = options.cache, cache = _options$cache === void 0 ? 'default' : _options$cache, _options$redirect = options.redirect, redirect = _options$redirect === void 0 ? 'follow' : _options$redirect, _options$referrerPoli = options.referrerPolicy, referrerPolicy = _options$referrerPoli === void 0 ? '' : _options$referrerPoli, _options$mode = options.mode, mode = _options$mode === void 0 ? 'cors' : _options$mode;
          url = baseUrl.concat(path).concat(Object.keys(query).length > 0 ? '?' + Object.keys(query).map(function (key) {
            return "".concat(encodeURIComponent(key), "=").concat(encodeURIComponent(query[key]));
          }).join('&') : '');
          fetchHeaders = new Headers();

          if (headers) {
            // for (const name in headers) {
            //   fetchHeaders.append(name, headers[name]);
            // }
            Object.keys(headers).forEach(function (name) {
              return fetchHeaders.append(name, headers[name]);
            });
          }

          if (contentType && (!headers || !headers['Content-Type'])) {
            fetchHeaders.append('Content-Type', contentType);
          }

          fetchBody = JSON.stringify(body);
          _context.prev = 7;
          _context.next = 10;
          return Http._fetch(url, {
            headers: fetchHeaders,
            method: method,
            credentials: credentials,
            cache: cache,
            redirect: redirect,
            referrerPolicy: referrerPolicy,
            mode: mode,
            body: contentType && contentType.includes('json') ? fetchBody : body
          });

        case 10:
          res = _context.sent;
          _context.next = 19;
          break;

        case 13:
          _context.prev = 13;
          _context.t0 = _context["catch"](7);
          error = new Error('Can\'t connect to url.');
          error.statusCode = undefined;
          error.connectionError = true;
          throw error;

        case 19:
          if (res) {
            _context.next = 22;
            break;
          }

          _error = new Error('No result from fetch');
          throw _error;

        case 22:
          responseContentType = res.headers.get('Content-Type');
          statusCode = res.status;
          isJson = Boolean(responseContentType && (responseContentType.includes('application/json') || responseContentType.includes('application/hal+json')));
          _context.next = 27;
          return isJson ? res.json() : res.text();

        case 27:
          response = _context.sent;

          if (!(statusCode >= 200 && statusCode <= 290)) {
            _context.next = 32;
            break;
          }

          return _context.abrupt("return", {
            statusCode: statusCode,
            response: response,
            error: undefined
          });

        case 32:
          if (!isJson) {
            _context.next = 41;
            break;
          }

          _error2 = new Error(response.message || res.statusText);
          _error2.details = response.details;
          _error2.stack = response.stack;
          _error2.connectionError = false;
          _error2.statusCode = statusCode;
          throw _error2;

        case 41:
          _error3 = new Error(res.statusText || 'Unknown request error');
          _error3.connectionError = false;
          _error3.statusCode = statusCode;
          throw _error3;

        case 45:
        case "end":
          return _context.stop();
      }
    }
  }, _callee, null, [[7, 13]]);
}));
/**
 * Make GET request
 *
 * @param {string} path URL Path
 * @param {object} query URL Query
 * @param {object} options Request options
 * @return {object} Promise resolved with { statusCode, response, error }
 */

Http.get = function (path, query) {
  var options = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};
  return Http.request(_objectSpread({}, options, {
    method: 'GET',
    path: path,
    query: query
  }));
};
/**
 * Make POST request
 *
 * @param {string} path URL Path
 * @param {object} body Request body
 * @param {object} options Request options
 * @return {object} Promise resolved with { statusCode, response, error }
 */


Http.post = function (path, body) {
  var options = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};
  return Http.request(_objectSpread({}, options, {
    method: 'POST',
    path: path,
    body: body
  }));
};
/**
 * Make PUT request
 *
 * @param {string} path URL Path
 * @param {object} body Request body
 * @param {object} options Request options
 * @return {object} Promise resolved with { statusCode, response, error }
 */


Http.put = function (path, body) {
  var options = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};
  return Http.request(_objectSpread({}, options, {
    method: 'PUT',
    path: path,
    body: body
  }));
};
/**
 * Make PATCH request
 *
 * @param {string} path URL Path
 * @param {object} body Request body
 * @param {object} options Request options
 * @return {object} Promise resolved with { statusCode, response, error }
 */


Http.patch = function (path, body) {
  var options = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};
  return Http.request(_objectSpread({}, options, {
    method: 'PATCH',
    path: path,
    body: body
  }));
};
/**
 * Make DELETE request
 *
 * @param {string} path URL Path
 * @param {object} query URL Query
 * @param {object} options Request options
 * @return {object} Promise resolved with { statusCode, response, error }
 */


Http["delete"] = function (path, query) {
  var options = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};
  return Http.request(_objectSpread({}, options, {
    method: 'DELETE',
    path: path,
    query: query
  }));
};
/**
 * Make composed call functions to all methods with the given options merged in
 *
 * @param {object} options Request options
 * @return {object} Function literal
 */


Http.withOptions = function () {
  var options = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
  return {
    request: function request() {
      var callOptions = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
      return Http.request(_objectSpread({}, options, {}, callOptions));
    },
    get: function get(path, query) {
      var callOptions = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};
      return Http.get(path, query, _objectSpread({}, options, {}, callOptions));
    },
    post: function post(path, body) {
      var callOptions = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};
      return Http.post(path, body, _objectSpread({}, options, {}, callOptions));
    },
    put: function put(path, body) {
      var callOptions = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};
      return Http.put(path, body, _objectSpread({}, options, {}, callOptions));
    },
    patch: function patch(path, body) {
      var callOptions = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};
      return Http.patch(path, body, _objectSpread({}, options, {}, callOptions));
    },
    "delete": function _delete(path, query) {
      var callOptions = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};
      return Http["delete"](path, query, _objectSpread({}, options, {}, callOptions));
    }
  };
};

var _default = Http;
exports["default"] = _default;