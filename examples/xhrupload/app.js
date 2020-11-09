(function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){
// Adapted from https://github.com/Flet/prettier-bytes/
// Changing 1000 bytes to 1024, so we can keep uppercase KB vs kB
// ISC License (c) Dan Flettre https://github.com/Flet/prettier-bytes/blob/master/LICENSE
module.exports = function prettierBytes (num) {
  if (typeof num !== 'number' || isNaN(num)) {
    throw new TypeError('Expected a number, got ' + typeof num)
  }

  var neg = num < 0
  var units = ['B', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB']

  if (neg) {
    num = -num
  }

  if (num < 1) {
    return (neg ? '-' : '') + num + ' B'
  }

  var exponent = Math.min(Math.floor(Math.log(num) / Math.log(1024)), units.length - 1)
  num = Number(num / Math.pow(1024, exponent))
  var unit = units[exponent]

  if (num >= 10 || num % 1 === 0) {
    // Do not show decimals when the number is two-digit, or if the number has no
    // decimal component.
    return (neg ? '-' : '') + num.toFixed(0) + ' ' + unit
  } else {
    return (neg ? '-' : '') + num.toFixed(1) + ' ' + unit
  }
}

},{}],2:[function(require,module,exports){
/**
 * cuid.js
 * Collision-resistant UID generator for browsers and node.
 * Sequential for fast db lookups and recency sorting.
 * Safe for element IDs and server-side lookups.
 *
 * Extracted from CLCTR
 *
 * Copyright (c) Eric Elliott 2012
 * MIT License
 */

var fingerprint = require('./lib/fingerprint.js');
var pad = require('./lib/pad.js');
var getRandomValue = require('./lib/getRandomValue.js');

var c = 0,
  blockSize = 4,
  base = 36,
  discreteValues = Math.pow(base, blockSize);

function randomBlock () {
  return pad((getRandomValue() *
    discreteValues << 0)
    .toString(base), blockSize);
}

function safeCounter () {
  c = c < discreteValues ? c : 0;
  c++; // this is not subliminal
  return c - 1;
}

function cuid () {
  // Starting with a lowercase letter makes
  // it HTML element ID friendly.
  var letter = 'c', // hard-coded allows for sequential access

    // timestamp
    // warning: this exposes the exact date and time
    // that the uid was created.
    timestamp = (new Date().getTime()).toString(base),

    // Prevent same-machine collisions.
    counter = pad(safeCounter().toString(base), blockSize),

    // A few chars to generate distinct ids for different
    // clients (so different computers are far less
    // likely to generate the same id)
    print = fingerprint(),

    // Grab some more chars from Math.random()
    random = randomBlock() + randomBlock();

  return letter + timestamp + counter + print + random;
}

cuid.slug = function slug () {
  var date = new Date().getTime().toString(36),
    counter = safeCounter().toString(36).slice(-4),
    print = fingerprint().slice(0, 1) +
      fingerprint().slice(-1),
    random = randomBlock().slice(-2);

  return date.slice(-2) +
    counter + print + random;
};

cuid.isCuid = function isCuid (stringToCheck) {
  if (typeof stringToCheck !== 'string') return false;
  if (stringToCheck.startsWith('c')) return true;
  return false;
};

cuid.isSlug = function isSlug (stringToCheck) {
  if (typeof stringToCheck !== 'string') return false;
  var stringLength = stringToCheck.length;
  if (stringLength >= 7 && stringLength <= 10) return true;
  return false;
};

cuid.fingerprint = fingerprint;

module.exports = cuid;

},{"./lib/fingerprint.js":3,"./lib/getRandomValue.js":4,"./lib/pad.js":5}],3:[function(require,module,exports){
var pad = require('./pad.js');

var env = typeof window === 'object' ? window : self;
var globalCount = Object.keys(env).length;
var mimeTypesLength = navigator.mimeTypes ? navigator.mimeTypes.length : 0;
var clientId = pad((mimeTypesLength +
  navigator.userAgent.length).toString(36) +
  globalCount.toString(36), 4);

module.exports = function fingerprint () {
  return clientId;
};

},{"./pad.js":5}],4:[function(require,module,exports){

var getRandomValue;

var crypto = typeof window !== 'undefined' &&
  (window.crypto || window.msCrypto) ||
  typeof self !== 'undefined' &&
  self.crypto;

if (crypto) {
    var lim = Math.pow(2, 32) - 1;
    getRandomValue = function () {
        return Math.abs(crypto.getRandomValues(new Uint32Array(1))[0] / lim);
    };
} else {
    getRandomValue = Math.random;
}

module.exports = getRandomValue;

},{}],5:[function(require,module,exports){
module.exports = function pad (num, size) {
  var s = '000000000' + num;
  return s.substr(s.length - size);
};

},{}],6:[function(require,module,exports){
// This file can be required in Browserify and Node.js for automatic polyfill
// To use it:  require('es6-promise/auto');
'use strict';
module.exports = require('./').polyfill();

},{"./":7}],7:[function(require,module,exports){
(function (process,global){(function (){
/*!
 * @overview es6-promise - a tiny implementation of Promises/A+.
 * @copyright Copyright (c) 2014 Yehuda Katz, Tom Dale, Stefan Penner and contributors (Conversion to ES6 API by Jake Archibald)
 * @license   Licensed under MIT license
 *            See https://raw.githubusercontent.com/stefanpenner/es6-promise/master/LICENSE
 * @version   v4.2.8+1e68dce6
 */

(function (global, factory) {
	typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
	typeof define === 'function' && define.amd ? define(factory) :
	(global.ES6Promise = factory());
}(this, (function () { 'use strict';

function objectOrFunction(x) {
  var type = typeof x;
  return x !== null && (type === 'object' || type === 'function');
}

function isFunction(x) {
  return typeof x === 'function';
}



var _isArray = void 0;
if (Array.isArray) {
  _isArray = Array.isArray;
} else {
  _isArray = function (x) {
    return Object.prototype.toString.call(x) === '[object Array]';
  };
}

var isArray = _isArray;

var len = 0;
var vertxNext = void 0;
var customSchedulerFn = void 0;

var asap = function asap(callback, arg) {
  queue[len] = callback;
  queue[len + 1] = arg;
  len += 2;
  if (len === 2) {
    // If len is 2, that means that we need to schedule an async flush.
    // If additional callbacks are queued before the queue is flushed, they
    // will be processed by this flush that we are scheduling.
    if (customSchedulerFn) {
      customSchedulerFn(flush);
    } else {
      scheduleFlush();
    }
  }
};

function setScheduler(scheduleFn) {
  customSchedulerFn = scheduleFn;
}

function setAsap(asapFn) {
  asap = asapFn;
}

var browserWindow = typeof window !== 'undefined' ? window : undefined;
var browserGlobal = browserWindow || {};
var BrowserMutationObserver = browserGlobal.MutationObserver || browserGlobal.WebKitMutationObserver;
var isNode = typeof self === 'undefined' && typeof process !== 'undefined' && {}.toString.call(process) === '[object process]';

// test for web worker but not in IE10
var isWorker = typeof Uint8ClampedArray !== 'undefined' && typeof importScripts !== 'undefined' && typeof MessageChannel !== 'undefined';

// node
function useNextTick() {
  // node version 0.10.x displays a deprecation warning when nextTick is used recursively
  // see https://github.com/cujojs/when/issues/410 for details
  return function () {
    return process.nextTick(flush);
  };
}

// vertx
function useVertxTimer() {
  if (typeof vertxNext !== 'undefined') {
    return function () {
      vertxNext(flush);
    };
  }

  return useSetTimeout();
}

function useMutationObserver() {
  var iterations = 0;
  var observer = new BrowserMutationObserver(flush);
  var node = document.createTextNode('');
  observer.observe(node, { characterData: true });

  return function () {
    node.data = iterations = ++iterations % 2;
  };
}

// web worker
function useMessageChannel() {
  var channel = new MessageChannel();
  channel.port1.onmessage = flush;
  return function () {
    return channel.port2.postMessage(0);
  };
}

function useSetTimeout() {
  // Store setTimeout reference so es6-promise will be unaffected by
  // other code modifying setTimeout (like sinon.useFakeTimers())
  var globalSetTimeout = setTimeout;
  return function () {
    return globalSetTimeout(flush, 1);
  };
}

var queue = new Array(1000);
function flush() {
  for (var i = 0; i < len; i += 2) {
    var callback = queue[i];
    var arg = queue[i + 1];

    callback(arg);

    queue[i] = undefined;
    queue[i + 1] = undefined;
  }

  len = 0;
}

function attemptVertx() {
  try {
    var vertx = Function('return this')().require('vertx');
    vertxNext = vertx.runOnLoop || vertx.runOnContext;
    return useVertxTimer();
  } catch (e) {
    return useSetTimeout();
  }
}

var scheduleFlush = void 0;
// Decide what async method to use to triggering processing of queued callbacks:
if (isNode) {
  scheduleFlush = useNextTick();
} else if (BrowserMutationObserver) {
  scheduleFlush = useMutationObserver();
} else if (isWorker) {
  scheduleFlush = useMessageChannel();
} else if (browserWindow === undefined && typeof require === 'function') {
  scheduleFlush = attemptVertx();
} else {
  scheduleFlush = useSetTimeout();
}

function then(onFulfillment, onRejection) {
  var parent = this;

  var child = new this.constructor(noop);

  if (child[PROMISE_ID] === undefined) {
    makePromise(child);
  }

  var _state = parent._state;


  if (_state) {
    var callback = arguments[_state - 1];
    asap(function () {
      return invokeCallback(_state, child, callback, parent._result);
    });
  } else {
    subscribe(parent, child, onFulfillment, onRejection);
  }

  return child;
}

/**
  `Promise.resolve` returns a promise that will become resolved with the
  passed `value`. It is shorthand for the following:

  ```javascript
  let promise = new Promise(function(resolve, reject){
    resolve(1);
  });

  promise.then(function(value){
    // value === 1
  });
  ```

  Instead of writing the above, your code now simply becomes the following:

  ```javascript
  let promise = Promise.resolve(1);

  promise.then(function(value){
    // value === 1
  });
  ```

  @method resolve
  @static
  @param {Any} value value that the returned promise will be resolved with
  Useful for tooling.
  @return {Promise} a promise that will become fulfilled with the given
  `value`
*/
function resolve$1(object) {
  /*jshint validthis:true */
  var Constructor = this;

  if (object && typeof object === 'object' && object.constructor === Constructor) {
    return object;
  }

  var promise = new Constructor(noop);
  resolve(promise, object);
  return promise;
}

var PROMISE_ID = Math.random().toString(36).substring(2);

function noop() {}

var PENDING = void 0;
var FULFILLED = 1;
var REJECTED = 2;

function selfFulfillment() {
  return new TypeError("You cannot resolve a promise with itself");
}

function cannotReturnOwn() {
  return new TypeError('A promises callback cannot return that same promise.');
}

function tryThen(then$$1, value, fulfillmentHandler, rejectionHandler) {
  try {
    then$$1.call(value, fulfillmentHandler, rejectionHandler);
  } catch (e) {
    return e;
  }
}

function handleForeignThenable(promise, thenable, then$$1) {
  asap(function (promise) {
    var sealed = false;
    var error = tryThen(then$$1, thenable, function (value) {
      if (sealed) {
        return;
      }
      sealed = true;
      if (thenable !== value) {
        resolve(promise, value);
      } else {
        fulfill(promise, value);
      }
    }, function (reason) {
      if (sealed) {
        return;
      }
      sealed = true;

      reject(promise, reason);
    }, 'Settle: ' + (promise._label || ' unknown promise'));

    if (!sealed && error) {
      sealed = true;
      reject(promise, error);
    }
  }, promise);
}

function handleOwnThenable(promise, thenable) {
  if (thenable._state === FULFILLED) {
    fulfill(promise, thenable._result);
  } else if (thenable._state === REJECTED) {
    reject(promise, thenable._result);
  } else {
    subscribe(thenable, undefined, function (value) {
      return resolve(promise, value);
    }, function (reason) {
      return reject(promise, reason);
    });
  }
}

function handleMaybeThenable(promise, maybeThenable, then$$1) {
  if (maybeThenable.constructor === promise.constructor && then$$1 === then && maybeThenable.constructor.resolve === resolve$1) {
    handleOwnThenable(promise, maybeThenable);
  } else {
    if (then$$1 === undefined) {
      fulfill(promise, maybeThenable);
    } else if (isFunction(then$$1)) {
      handleForeignThenable(promise, maybeThenable, then$$1);
    } else {
      fulfill(promise, maybeThenable);
    }
  }
}

function resolve(promise, value) {
  if (promise === value) {
    reject(promise, selfFulfillment());
  } else if (objectOrFunction(value)) {
    var then$$1 = void 0;
    try {
      then$$1 = value.then;
    } catch (error) {
      reject(promise, error);
      return;
    }
    handleMaybeThenable(promise, value, then$$1);
  } else {
    fulfill(promise, value);
  }
}

function publishRejection(promise) {
  if (promise._onerror) {
    promise._onerror(promise._result);
  }

  publish(promise);
}

function fulfill(promise, value) {
  if (promise._state !== PENDING) {
    return;
  }

  promise._result = value;
  promise._state = FULFILLED;

  if (promise._subscribers.length !== 0) {
    asap(publish, promise);
  }
}

function reject(promise, reason) {
  if (promise._state !== PENDING) {
    return;
  }
  promise._state = REJECTED;
  promise._result = reason;

  asap(publishRejection, promise);
}

function subscribe(parent, child, onFulfillment, onRejection) {
  var _subscribers = parent._subscribers;
  var length = _subscribers.length;


  parent._onerror = null;

  _subscribers[length] = child;
  _subscribers[length + FULFILLED] = onFulfillment;
  _subscribers[length + REJECTED] = onRejection;

  if (length === 0 && parent._state) {
    asap(publish, parent);
  }
}

function publish(promise) {
  var subscribers = promise._subscribers;
  var settled = promise._state;

  if (subscribers.length === 0) {
    return;
  }

  var child = void 0,
      callback = void 0,
      detail = promise._result;

  for (var i = 0; i < subscribers.length; i += 3) {
    child = subscribers[i];
    callback = subscribers[i + settled];

    if (child) {
      invokeCallback(settled, child, callback, detail);
    } else {
      callback(detail);
    }
  }

  promise._subscribers.length = 0;
}

function invokeCallback(settled, promise, callback, detail) {
  var hasCallback = isFunction(callback),
      value = void 0,
      error = void 0,
      succeeded = true;

  if (hasCallback) {
    try {
      value = callback(detail);
    } catch (e) {
      succeeded = false;
      error = e;
    }

    if (promise === value) {
      reject(promise, cannotReturnOwn());
      return;
    }
  } else {
    value = detail;
  }

  if (promise._state !== PENDING) {
    // noop
  } else if (hasCallback && succeeded) {
    resolve(promise, value);
  } else if (succeeded === false) {
    reject(promise, error);
  } else if (settled === FULFILLED) {
    fulfill(promise, value);
  } else if (settled === REJECTED) {
    reject(promise, value);
  }
}

function initializePromise(promise, resolver) {
  try {
    resolver(function resolvePromise(value) {
      resolve(promise, value);
    }, function rejectPromise(reason) {
      reject(promise, reason);
    });
  } catch (e) {
    reject(promise, e);
  }
}

var id = 0;
function nextId() {
  return id++;
}

function makePromise(promise) {
  promise[PROMISE_ID] = id++;
  promise._state = undefined;
  promise._result = undefined;
  promise._subscribers = [];
}

function validationError() {
  return new Error('Array Methods must be provided an Array');
}

var Enumerator = function () {
  function Enumerator(Constructor, input) {
    this._instanceConstructor = Constructor;
    this.promise = new Constructor(noop);

    if (!this.promise[PROMISE_ID]) {
      makePromise(this.promise);
    }

    if (isArray(input)) {
      this.length = input.length;
      this._remaining = input.length;

      this._result = new Array(this.length);

      if (this.length === 0) {
        fulfill(this.promise, this._result);
      } else {
        this.length = this.length || 0;
        this._enumerate(input);
        if (this._remaining === 0) {
          fulfill(this.promise, this._result);
        }
      }
    } else {
      reject(this.promise, validationError());
    }
  }

  Enumerator.prototype._enumerate = function _enumerate(input) {
    for (var i = 0; this._state === PENDING && i < input.length; i++) {
      this._eachEntry(input[i], i);
    }
  };

  Enumerator.prototype._eachEntry = function _eachEntry(entry, i) {
    var c = this._instanceConstructor;
    var resolve$$1 = c.resolve;


    if (resolve$$1 === resolve$1) {
      var _then = void 0;
      var error = void 0;
      var didError = false;
      try {
        _then = entry.then;
      } catch (e) {
        didError = true;
        error = e;
      }

      if (_then === then && entry._state !== PENDING) {
        this._settledAt(entry._state, i, entry._result);
      } else if (typeof _then !== 'function') {
        this._remaining--;
        this._result[i] = entry;
      } else if (c === Promise$1) {
        var promise = new c(noop);
        if (didError) {
          reject(promise, error);
        } else {
          handleMaybeThenable(promise, entry, _then);
        }
        this._willSettleAt(promise, i);
      } else {
        this._willSettleAt(new c(function (resolve$$1) {
          return resolve$$1(entry);
        }), i);
      }
    } else {
      this._willSettleAt(resolve$$1(entry), i);
    }
  };

  Enumerator.prototype._settledAt = function _settledAt(state, i, value) {
    var promise = this.promise;


    if (promise._state === PENDING) {
      this._remaining--;

      if (state === REJECTED) {
        reject(promise, value);
      } else {
        this._result[i] = value;
      }
    }

    if (this._remaining === 0) {
      fulfill(promise, this._result);
    }
  };

  Enumerator.prototype._willSettleAt = function _willSettleAt(promise, i) {
    var enumerator = this;

    subscribe(promise, undefined, function (value) {
      return enumerator._settledAt(FULFILLED, i, value);
    }, function (reason) {
      return enumerator._settledAt(REJECTED, i, reason);
    });
  };

  return Enumerator;
}();

/**
  `Promise.all` accepts an array of promises, and returns a new promise which
  is fulfilled with an array of fulfillment values for the passed promises, or
  rejected with the reason of the first passed promise to be rejected. It casts all
  elements of the passed iterable to promises as it runs this algorithm.

  Example:

  ```javascript
  let promise1 = resolve(1);
  let promise2 = resolve(2);
  let promise3 = resolve(3);
  let promises = [ promise1, promise2, promise3 ];

  Promise.all(promises).then(function(array){
    // The array here would be [ 1, 2, 3 ];
  });
  ```

  If any of the `promises` given to `all` are rejected, the first promise
  that is rejected will be given as an argument to the returned promises's
  rejection handler. For example:

  Example:

  ```javascript
  let promise1 = resolve(1);
  let promise2 = reject(new Error("2"));
  let promise3 = reject(new Error("3"));
  let promises = [ promise1, promise2, promise3 ];

  Promise.all(promises).then(function(array){
    // Code here never runs because there are rejected promises!
  }, function(error) {
    // error.message === "2"
  });
  ```

  @method all
  @static
  @param {Array} entries array of promises
  @param {String} label optional string for labeling the promise.
  Useful for tooling.
  @return {Promise} promise that is fulfilled when all `promises` have been
  fulfilled, or rejected if any of them become rejected.
  @static
*/
function all(entries) {
  return new Enumerator(this, entries).promise;
}

/**
  `Promise.race` returns a new promise which is settled in the same way as the
  first passed promise to settle.

  Example:

  ```javascript
  let promise1 = new Promise(function(resolve, reject){
    setTimeout(function(){
      resolve('promise 1');
    }, 200);
  });

  let promise2 = new Promise(function(resolve, reject){
    setTimeout(function(){
      resolve('promise 2');
    }, 100);
  });

  Promise.race([promise1, promise2]).then(function(result){
    // result === 'promise 2' because it was resolved before promise1
    // was resolved.
  });
  ```

  `Promise.race` is deterministic in that only the state of the first
  settled promise matters. For example, even if other promises given to the
  `promises` array argument are resolved, but the first settled promise has
  become rejected before the other promises became fulfilled, the returned
  promise will become rejected:

  ```javascript
  let promise1 = new Promise(function(resolve, reject){
    setTimeout(function(){
      resolve('promise 1');
    }, 200);
  });

  let promise2 = new Promise(function(resolve, reject){
    setTimeout(function(){
      reject(new Error('promise 2'));
    }, 100);
  });

  Promise.race([promise1, promise2]).then(function(result){
    // Code here never runs
  }, function(reason){
    // reason.message === 'promise 2' because promise 2 became rejected before
    // promise 1 became fulfilled
  });
  ```

  An example real-world use case is implementing timeouts:

  ```javascript
  Promise.race([ajax('foo.json'), timeout(5000)])
  ```

  @method race
  @static
  @param {Array} promises array of promises to observe
  Useful for tooling.
  @return {Promise} a promise which settles in the same way as the first passed
  promise to settle.
*/
function race(entries) {
  /*jshint validthis:true */
  var Constructor = this;

  if (!isArray(entries)) {
    return new Constructor(function (_, reject) {
      return reject(new TypeError('You must pass an array to race.'));
    });
  } else {
    return new Constructor(function (resolve, reject) {
      var length = entries.length;
      for (var i = 0; i < length; i++) {
        Constructor.resolve(entries[i]).then(resolve, reject);
      }
    });
  }
}

/**
  `Promise.reject` returns a promise rejected with the passed `reason`.
  It is shorthand for the following:

  ```javascript
  let promise = new Promise(function(resolve, reject){
    reject(new Error('WHOOPS'));
  });

  promise.then(function(value){
    // Code here doesn't run because the promise is rejected!
  }, function(reason){
    // reason.message === 'WHOOPS'
  });
  ```

  Instead of writing the above, your code now simply becomes the following:

  ```javascript
  let promise = Promise.reject(new Error('WHOOPS'));

  promise.then(function(value){
    // Code here doesn't run because the promise is rejected!
  }, function(reason){
    // reason.message === 'WHOOPS'
  });
  ```

  @method reject
  @static
  @param {Any} reason value that the returned promise will be rejected with.
  Useful for tooling.
  @return {Promise} a promise rejected with the given `reason`.
*/
function reject$1(reason) {
  /*jshint validthis:true */
  var Constructor = this;
  var promise = new Constructor(noop);
  reject(promise, reason);
  return promise;
}

function needsResolver() {
  throw new TypeError('You must pass a resolver function as the first argument to the promise constructor');
}

function needsNew() {
  throw new TypeError("Failed to construct 'Promise': Please use the 'new' operator, this object constructor cannot be called as a function.");
}

/**
  Promise objects represent the eventual result of an asynchronous operation. The
  primary way of interacting with a promise is through its `then` method, which
  registers callbacks to receive either a promise's eventual value or the reason
  why the promise cannot be fulfilled.

  Terminology
  -----------

  - `promise` is an object or function with a `then` method whose behavior conforms to this specification.
  - `thenable` is an object or function that defines a `then` method.
  - `value` is any legal JavaScript value (including undefined, a thenable, or a promise).
  - `exception` is a value that is thrown using the throw statement.
  - `reason` is a value that indicates why a promise was rejected.
  - `settled` the final resting state of a promise, fulfilled or rejected.

  A promise can be in one of three states: pending, fulfilled, or rejected.

  Promises that are fulfilled have a fulfillment value and are in the fulfilled
  state.  Promises that are rejected have a rejection reason and are in the
  rejected state.  A fulfillment value is never a thenable.

  Promises can also be said to *resolve* a value.  If this value is also a
  promise, then the original promise's settled state will match the value's
  settled state.  So a promise that *resolves* a promise that rejects will
  itself reject, and a promise that *resolves* a promise that fulfills will
  itself fulfill.


  Basic Usage:
  ------------

  ```js
  let promise = new Promise(function(resolve, reject) {
    // on success
    resolve(value);

    // on failure
    reject(reason);
  });

  promise.then(function(value) {
    // on fulfillment
  }, function(reason) {
    // on rejection
  });
  ```

  Advanced Usage:
  ---------------

  Promises shine when abstracting away asynchronous interactions such as
  `XMLHttpRequest`s.

  ```js
  function getJSON(url) {
    return new Promise(function(resolve, reject){
      let xhr = new XMLHttpRequest();

      xhr.open('GET', url);
      xhr.onreadystatechange = handler;
      xhr.responseType = 'json';
      xhr.setRequestHeader('Accept', 'application/json');
      xhr.send();

      function handler() {
        if (this.readyState === this.DONE) {
          if (this.status === 200) {
            resolve(this.response);
          } else {
            reject(new Error('getJSON: `' + url + '` failed with status: [' + this.status + ']'));
          }
        }
      };
    });
  }

  getJSON('/posts.json').then(function(json) {
    // on fulfillment
  }, function(reason) {
    // on rejection
  });
  ```

  Unlike callbacks, promises are great composable primitives.

  ```js
  Promise.all([
    getJSON('/posts'),
    getJSON('/comments')
  ]).then(function(values){
    values[0] // => postsJSON
    values[1] // => commentsJSON

    return values;
  });
  ```

  @class Promise
  @param {Function} resolver
  Useful for tooling.
  @constructor
*/

var Promise$1 = function () {
  function Promise(resolver) {
    this[PROMISE_ID] = nextId();
    this._result = this._state = undefined;
    this._subscribers = [];

    if (noop !== resolver) {
      typeof resolver !== 'function' && needsResolver();
      this instanceof Promise ? initializePromise(this, resolver) : needsNew();
    }
  }

  /**
  The primary way of interacting with a promise is through its `then` method,
  which registers callbacks to receive either a promise's eventual value or the
  reason why the promise cannot be fulfilled.
   ```js
  findUser().then(function(user){
    // user is available
  }, function(reason){
    // user is unavailable, and you are given the reason why
  });
  ```
   Chaining
  --------
   The return value of `then` is itself a promise.  This second, 'downstream'
  promise is resolved with the return value of the first promise's fulfillment
  or rejection handler, or rejected if the handler throws an exception.
   ```js
  findUser().then(function (user) {
    return user.name;
  }, function (reason) {
    return 'default name';
  }).then(function (userName) {
    // If `findUser` fulfilled, `userName` will be the user's name, otherwise it
    // will be `'default name'`
  });
   findUser().then(function (user) {
    throw new Error('Found user, but still unhappy');
  }, function (reason) {
    throw new Error('`findUser` rejected and we're unhappy');
  }).then(function (value) {
    // never reached
  }, function (reason) {
    // if `findUser` fulfilled, `reason` will be 'Found user, but still unhappy'.
    // If `findUser` rejected, `reason` will be '`findUser` rejected and we're unhappy'.
  });
  ```
  If the downstream promise does not specify a rejection handler, rejection reasons will be propagated further downstream.
   ```js
  findUser().then(function (user) {
    throw new PedagogicalException('Upstream error');
  }).then(function (value) {
    // never reached
  }).then(function (value) {
    // never reached
  }, function (reason) {
    // The `PedgagocialException` is propagated all the way down to here
  });
  ```
   Assimilation
  ------------
   Sometimes the value you want to propagate to a downstream promise can only be
  retrieved asynchronously. This can be achieved by returning a promise in the
  fulfillment or rejection handler. The downstream promise will then be pending
  until the returned promise is settled. This is called *assimilation*.
   ```js
  findUser().then(function (user) {
    return findCommentsByAuthor(user);
  }).then(function (comments) {
    // The user's comments are now available
  });
  ```
   If the assimliated promise rejects, then the downstream promise will also reject.
   ```js
  findUser().then(function (user) {
    return findCommentsByAuthor(user);
  }).then(function (comments) {
    // If `findCommentsByAuthor` fulfills, we'll have the value here
  }, function (reason) {
    // If `findCommentsByAuthor` rejects, we'll have the reason here
  });
  ```
   Simple Example
  --------------
   Synchronous Example
   ```javascript
  let result;
   try {
    result = findResult();
    // success
  } catch(reason) {
    // failure
  }
  ```
   Errback Example
   ```js
  findResult(function(result, err){
    if (err) {
      // failure
    } else {
      // success
    }
  });
  ```
   Promise Example;
   ```javascript
  findResult().then(function(result){
    // success
  }, function(reason){
    // failure
  });
  ```
   Advanced Example
  --------------
   Synchronous Example
   ```javascript
  let author, books;
   try {
    author = findAuthor();
    books  = findBooksByAuthor(author);
    // success
  } catch(reason) {
    // failure
  }
  ```
   Errback Example
   ```js
   function foundBooks(books) {
   }
   function failure(reason) {
   }
   findAuthor(function(author, err){
    if (err) {
      failure(err);
      // failure
    } else {
      try {
        findBoooksByAuthor(author, function(books, err) {
          if (err) {
            failure(err);
          } else {
            try {
              foundBooks(books);
            } catch(reason) {
              failure(reason);
            }
          }
        });
      } catch(error) {
        failure(err);
      }
      // success
    }
  });
  ```
   Promise Example;
   ```javascript
  findAuthor().
    then(findBooksByAuthor).
    then(function(books){
      // found books
  }).catch(function(reason){
    // something went wrong
  });
  ```
   @method then
  @param {Function} onFulfilled
  @param {Function} onRejected
  Useful for tooling.
  @return {Promise}
  */

  /**
  `catch` is simply sugar for `then(undefined, onRejection)` which makes it the same
  as the catch block of a try/catch statement.
  ```js
  function findAuthor(){
  throw new Error('couldn't find that author');
  }
  // synchronous
  try {
  findAuthor();
  } catch(reason) {
  // something went wrong
  }
  // async with promises
  findAuthor().catch(function(reason){
  // something went wrong
  });
  ```
  @method catch
  @param {Function} onRejection
  Useful for tooling.
  @return {Promise}
  */


  Promise.prototype.catch = function _catch(onRejection) {
    return this.then(null, onRejection);
  };

  /**
    `finally` will be invoked regardless of the promise's fate just as native
    try/catch/finally behaves
  
    Synchronous example:
  
    ```js
    findAuthor() {
      if (Math.random() > 0.5) {
        throw new Error();
      }
      return new Author();
    }
  
    try {
      return findAuthor(); // succeed or fail
    } catch(error) {
      return findOtherAuther();
    } finally {
      // always runs
      // doesn't affect the return value
    }
    ```
  
    Asynchronous example:
  
    ```js
    findAuthor().catch(function(reason){
      return findOtherAuther();
    }).finally(function(){
      // author was either found, or not
    });
    ```
  
    @method finally
    @param {Function} callback
    @return {Promise}
  */


  Promise.prototype.finally = function _finally(callback) {
    var promise = this;
    var constructor = promise.constructor;

    if (isFunction(callback)) {
      return promise.then(function (value) {
        return constructor.resolve(callback()).then(function () {
          return value;
        });
      }, function (reason) {
        return constructor.resolve(callback()).then(function () {
          throw reason;
        });
      });
    }

    return promise.then(callback, callback);
  };

  return Promise;
}();

Promise$1.prototype.then = then;
Promise$1.all = all;
Promise$1.race = race;
Promise$1.resolve = resolve$1;
Promise$1.reject = reject$1;
Promise$1._setScheduler = setScheduler;
Promise$1._setAsap = setAsap;
Promise$1._asap = asap;

/*global self*/
function polyfill() {
  var local = void 0;

  if (typeof global !== 'undefined') {
    local = global;
  } else if (typeof self !== 'undefined') {
    local = self;
  } else {
    try {
      local = Function('return this')();
    } catch (e) {
      throw new Error('polyfill failed because global object is unavailable in this environment');
    }
  }

  var P = local.Promise;

  if (P) {
    var promiseToString = null;
    try {
      promiseToString = Object.prototype.toString.call(P.resolve());
    } catch (e) {
      // silently ignored
    }

    if (promiseToString === '[object Promise]' && !P.cast) {
      return;
    }
  }

  local.Promise = Promise$1;
}

// Strange compat..
Promise$1.polyfill = polyfill;
Promise$1.Promise = Promise$1;

return Promise$1;

})));





}).call(this)}).call(this,require('_process'),typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})

},{"_process":12}],8:[function(require,module,exports){
(function (global){(function (){
/**
 * lodash (Custom Build) <https://lodash.com/>
 * Build: `lodash modularize exports="npm" -o ./`
 * Copyright jQuery Foundation and other contributors <https://jquery.org/>
 * Released under MIT license <https://lodash.com/license>
 * Based on Underscore.js 1.8.3 <http://underscorejs.org/LICENSE>
 * Copyright Jeremy Ashkenas, DocumentCloud and Investigative Reporters & Editors
 */

/** Used as the `TypeError` message for "Functions" methods. */
var FUNC_ERROR_TEXT = 'Expected a function';

/** Used as references for various `Number` constants. */
var NAN = 0 / 0;

/** `Object#toString` result references. */
var symbolTag = '[object Symbol]';

/** Used to match leading and trailing whitespace. */
var reTrim = /^\s+|\s+$/g;

/** Used to detect bad signed hexadecimal string values. */
var reIsBadHex = /^[-+]0x[0-9a-f]+$/i;

/** Used to detect binary string values. */
var reIsBinary = /^0b[01]+$/i;

/** Used to detect octal string values. */
var reIsOctal = /^0o[0-7]+$/i;

/** Built-in method references without a dependency on `root`. */
var freeParseInt = parseInt;

/** Detect free variable `global` from Node.js. */
var freeGlobal = typeof global == 'object' && global && global.Object === Object && global;

/** Detect free variable `self`. */
var freeSelf = typeof self == 'object' && self && self.Object === Object && self;

/** Used as a reference to the global object. */
var root = freeGlobal || freeSelf || Function('return this')();

/** Used for built-in method references. */
var objectProto = Object.prototype;

/**
 * Used to resolve the
 * [`toStringTag`](http://ecma-international.org/ecma-262/7.0/#sec-object.prototype.tostring)
 * of values.
 */
var objectToString = objectProto.toString;

/* Built-in method references for those with the same name as other `lodash` methods. */
var nativeMax = Math.max,
    nativeMin = Math.min;

/**
 * Gets the timestamp of the number of milliseconds that have elapsed since
 * the Unix epoch (1 January 1970 00:00:00 UTC).
 *
 * @static
 * @memberOf _
 * @since 2.4.0
 * @category Date
 * @returns {number} Returns the timestamp.
 * @example
 *
 * _.defer(function(stamp) {
 *   console.log(_.now() - stamp);
 * }, _.now());
 * // => Logs the number of milliseconds it took for the deferred invocation.
 */
var now = function() {
  return root.Date.now();
};

/**
 * Creates a debounced function that delays invoking `func` until after `wait`
 * milliseconds have elapsed since the last time the debounced function was
 * invoked. The debounced function comes with a `cancel` method to cancel
 * delayed `func` invocations and a `flush` method to immediately invoke them.
 * Provide `options` to indicate whether `func` should be invoked on the
 * leading and/or trailing edge of the `wait` timeout. The `func` is invoked
 * with the last arguments provided to the debounced function. Subsequent
 * calls to the debounced function return the result of the last `func`
 * invocation.
 *
 * **Note:** If `leading` and `trailing` options are `true`, `func` is
 * invoked on the trailing edge of the timeout only if the debounced function
 * is invoked more than once during the `wait` timeout.
 *
 * If `wait` is `0` and `leading` is `false`, `func` invocation is deferred
 * until to the next tick, similar to `setTimeout` with a timeout of `0`.
 *
 * See [David Corbacho's article](https://css-tricks.com/debouncing-throttling-explained-examples/)
 * for details over the differences between `_.debounce` and `_.throttle`.
 *
 * @static
 * @memberOf _
 * @since 0.1.0
 * @category Function
 * @param {Function} func The function to debounce.
 * @param {number} [wait=0] The number of milliseconds to delay.
 * @param {Object} [options={}] The options object.
 * @param {boolean} [options.leading=false]
 *  Specify invoking on the leading edge of the timeout.
 * @param {number} [options.maxWait]
 *  The maximum time `func` is allowed to be delayed before it's invoked.
 * @param {boolean} [options.trailing=true]
 *  Specify invoking on the trailing edge of the timeout.
 * @returns {Function} Returns the new debounced function.
 * @example
 *
 * // Avoid costly calculations while the window size is in flux.
 * jQuery(window).on('resize', _.debounce(calculateLayout, 150));
 *
 * // Invoke `sendMail` when clicked, debouncing subsequent calls.
 * jQuery(element).on('click', _.debounce(sendMail, 300, {
 *   'leading': true,
 *   'trailing': false
 * }));
 *
 * // Ensure `batchLog` is invoked once after 1 second of debounced calls.
 * var debounced = _.debounce(batchLog, 250, { 'maxWait': 1000 });
 * var source = new EventSource('/stream');
 * jQuery(source).on('message', debounced);
 *
 * // Cancel the trailing debounced invocation.
 * jQuery(window).on('popstate', debounced.cancel);
 */
function debounce(func, wait, options) {
  var lastArgs,
      lastThis,
      maxWait,
      result,
      timerId,
      lastCallTime,
      lastInvokeTime = 0,
      leading = false,
      maxing = false,
      trailing = true;

  if (typeof func != 'function') {
    throw new TypeError(FUNC_ERROR_TEXT);
  }
  wait = toNumber(wait) || 0;
  if (isObject(options)) {
    leading = !!options.leading;
    maxing = 'maxWait' in options;
    maxWait = maxing ? nativeMax(toNumber(options.maxWait) || 0, wait) : maxWait;
    trailing = 'trailing' in options ? !!options.trailing : trailing;
  }

  function invokeFunc(time) {
    var args = lastArgs,
        thisArg = lastThis;

    lastArgs = lastThis = undefined;
    lastInvokeTime = time;
    result = func.apply(thisArg, args);
    return result;
  }

  function leadingEdge(time) {
    // Reset any `maxWait` timer.
    lastInvokeTime = time;
    // Start the timer for the trailing edge.
    timerId = setTimeout(timerExpired, wait);
    // Invoke the leading edge.
    return leading ? invokeFunc(time) : result;
  }

  function remainingWait(time) {
    var timeSinceLastCall = time - lastCallTime,
        timeSinceLastInvoke = time - lastInvokeTime,
        result = wait - timeSinceLastCall;

    return maxing ? nativeMin(result, maxWait - timeSinceLastInvoke) : result;
  }

  function shouldInvoke(time) {
    var timeSinceLastCall = time - lastCallTime,
        timeSinceLastInvoke = time - lastInvokeTime;

    // Either this is the first call, activity has stopped and we're at the
    // trailing edge, the system time has gone backwards and we're treating
    // it as the trailing edge, or we've hit the `maxWait` limit.
    return (lastCallTime === undefined || (timeSinceLastCall >= wait) ||
      (timeSinceLastCall < 0) || (maxing && timeSinceLastInvoke >= maxWait));
  }

  function timerExpired() {
    var time = now();
    if (shouldInvoke(time)) {
      return trailingEdge(time);
    }
    // Restart the timer.
    timerId = setTimeout(timerExpired, remainingWait(time));
  }

  function trailingEdge(time) {
    timerId = undefined;

    // Only invoke if we have `lastArgs` which means `func` has been
    // debounced at least once.
    if (trailing && lastArgs) {
      return invokeFunc(time);
    }
    lastArgs = lastThis = undefined;
    return result;
  }

  function cancel() {
    if (timerId !== undefined) {
      clearTimeout(timerId);
    }
    lastInvokeTime = 0;
    lastArgs = lastCallTime = lastThis = timerId = undefined;
  }

  function flush() {
    return timerId === undefined ? result : trailingEdge(now());
  }

  function debounced() {
    var time = now(),
        isInvoking = shouldInvoke(time);

    lastArgs = arguments;
    lastThis = this;
    lastCallTime = time;

    if (isInvoking) {
      if (timerId === undefined) {
        return leadingEdge(lastCallTime);
      }
      if (maxing) {
        // Handle invocations in a tight loop.
        timerId = setTimeout(timerExpired, wait);
        return invokeFunc(lastCallTime);
      }
    }
    if (timerId === undefined) {
      timerId = setTimeout(timerExpired, wait);
    }
    return result;
  }
  debounced.cancel = cancel;
  debounced.flush = flush;
  return debounced;
}

/**
 * Creates a throttled function that only invokes `func` at most once per
 * every `wait` milliseconds. The throttled function comes with a `cancel`
 * method to cancel delayed `func` invocations and a `flush` method to
 * immediately invoke them. Provide `options` to indicate whether `func`
 * should be invoked on the leading and/or trailing edge of the `wait`
 * timeout. The `func` is invoked with the last arguments provided to the
 * throttled function. Subsequent calls to the throttled function return the
 * result of the last `func` invocation.
 *
 * **Note:** If `leading` and `trailing` options are `true`, `func` is
 * invoked on the trailing edge of the timeout only if the throttled function
 * is invoked more than once during the `wait` timeout.
 *
 * If `wait` is `0` and `leading` is `false`, `func` invocation is deferred
 * until to the next tick, similar to `setTimeout` with a timeout of `0`.
 *
 * See [David Corbacho's article](https://css-tricks.com/debouncing-throttling-explained-examples/)
 * for details over the differences between `_.throttle` and `_.debounce`.
 *
 * @static
 * @memberOf _
 * @since 0.1.0
 * @category Function
 * @param {Function} func The function to throttle.
 * @param {number} [wait=0] The number of milliseconds to throttle invocations to.
 * @param {Object} [options={}] The options object.
 * @param {boolean} [options.leading=true]
 *  Specify invoking on the leading edge of the timeout.
 * @param {boolean} [options.trailing=true]
 *  Specify invoking on the trailing edge of the timeout.
 * @returns {Function} Returns the new throttled function.
 * @example
 *
 * // Avoid excessively updating the position while scrolling.
 * jQuery(window).on('scroll', _.throttle(updatePosition, 100));
 *
 * // Invoke `renewToken` when the click event is fired, but not more than once every 5 minutes.
 * var throttled = _.throttle(renewToken, 300000, { 'trailing': false });
 * jQuery(element).on('click', throttled);
 *
 * // Cancel the trailing throttled invocation.
 * jQuery(window).on('popstate', throttled.cancel);
 */
function throttle(func, wait, options) {
  var leading = true,
      trailing = true;

  if (typeof func != 'function') {
    throw new TypeError(FUNC_ERROR_TEXT);
  }
  if (isObject(options)) {
    leading = 'leading' in options ? !!options.leading : leading;
    trailing = 'trailing' in options ? !!options.trailing : trailing;
  }
  return debounce(func, wait, {
    'leading': leading,
    'maxWait': wait,
    'trailing': trailing
  });
}

/**
 * Checks if `value` is the
 * [language type](http://www.ecma-international.org/ecma-262/7.0/#sec-ecmascript-language-types)
 * of `Object`. (e.g. arrays, functions, objects, regexes, `new Number(0)`, and `new String('')`)
 *
 * @static
 * @memberOf _
 * @since 0.1.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is an object, else `false`.
 * @example
 *
 * _.isObject({});
 * // => true
 *
 * _.isObject([1, 2, 3]);
 * // => true
 *
 * _.isObject(_.noop);
 * // => true
 *
 * _.isObject(null);
 * // => false
 */
function isObject(value) {
  var type = typeof value;
  return !!value && (type == 'object' || type == 'function');
}

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

/**
 * Checks if `value` is classified as a `Symbol` primitive or object.
 *
 * @static
 * @memberOf _
 * @since 4.0.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is a symbol, else `false`.
 * @example
 *
 * _.isSymbol(Symbol.iterator);
 * // => true
 *
 * _.isSymbol('abc');
 * // => false
 */
function isSymbol(value) {
  return typeof value == 'symbol' ||
    (isObjectLike(value) && objectToString.call(value) == symbolTag);
}

/**
 * Converts `value` to a number.
 *
 * @static
 * @memberOf _
 * @since 4.0.0
 * @category Lang
 * @param {*} value The value to process.
 * @returns {number} Returns the number.
 * @example
 *
 * _.toNumber(3.2);
 * // => 3.2
 *
 * _.toNumber(Number.MIN_VALUE);
 * // => 5e-324
 *
 * _.toNumber(Infinity);
 * // => Infinity
 *
 * _.toNumber('3.2');
 * // => 3.2
 */
function toNumber(value) {
  if (typeof value == 'number') {
    return value;
  }
  if (isSymbol(value)) {
    return NAN;
  }
  if (isObject(value)) {
    var other = typeof value.valueOf == 'function' ? value.valueOf() : value;
    value = isObject(other) ? (other + '') : other;
  }
  if (typeof value != 'string') {
    return value === 0 ? value : +value;
  }
  value = value.replace(reTrim, '');
  var isBinary = reIsBinary.test(value);
  return (isBinary || reIsOctal.test(value))
    ? freeParseInt(value.slice(2), isBinary ? 2 : 8)
    : (reIsBadHex.test(value) ? NAN : +value);
}

module.exports = throttle;

}).call(this)}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})

},{}],9:[function(require,module,exports){
var wildcard = require('wildcard');
var reMimePartSplit = /[\/\+\.]/;

/**
  # mime-match

  A simple function to checker whether a target mime type matches a mime-type
  pattern (e.g. image/jpeg matches image/jpeg OR image/*).

  ## Example Usage

  <<< example.js

**/
module.exports = function(target, pattern) {
  function test(pattern) {
    var result = wildcard(pattern, target, reMimePartSplit);

    // ensure that we have a valid mime type (should have two parts)
    return result && result.length >= 2;
  }

  return pattern ? test(pattern.split(';')[0]) : test;
};

},{"wildcard":14}],10:[function(require,module,exports){
/**
* Create an event emitter with namespaces
* @name createNamespaceEmitter
* @example
* var emitter = require('./index')()
*
* emitter.on('*', function () {
*   console.log('all events emitted', this.event)
* })
*
* emitter.on('example', function () {
*   console.log('example event emitted')
* })
*/
module.exports = function createNamespaceEmitter () {
  var emitter = {}
  var _fns = emitter._fns = {}

  /**
  * Emit an event. Optionally namespace the event. Handlers are fired in the order in which they were added with exact matches taking precedence. Separate the namespace and event with a `:`
  * @name emit
  * @param {String} event – the name of the event, with optional namespace
  * @param {...*} data – up to 6 arguments that are passed to the event listener
  * @example
  * emitter.emit('example')
  * emitter.emit('demo:test')
  * emitter.emit('data', { example: true}, 'a string', 1)
  */
  emitter.emit = function emit (event, arg1, arg2, arg3, arg4, arg5, arg6) {
    var toEmit = getListeners(event)

    if (toEmit.length) {
      emitAll(event, toEmit, [arg1, arg2, arg3, arg4, arg5, arg6])
    }
  }

  /**
  * Create en event listener.
  * @name on
  * @param {String} event
  * @param {Function} fn
  * @example
  * emitter.on('example', function () {})
  * emitter.on('demo', function () {})
  */
  emitter.on = function on (event, fn) {
    if (!_fns[event]) {
      _fns[event] = []
    }

    _fns[event].push(fn)
  }

  /**
  * Create en event listener that fires once.
  * @name once
  * @param {String} event
  * @param {Function} fn
  * @example
  * emitter.once('example', function () {})
  * emitter.once('demo', function () {})
  */
  emitter.once = function once (event, fn) {
    function one () {
      fn.apply(this, arguments)
      emitter.off(event, one)
    }
    this.on(event, one)
  }

  /**
  * Stop listening to an event. Stop all listeners on an event by only passing the event name. Stop a single listener by passing that event handler as a callback.
  * You must be explicit about what will be unsubscribed: `emitter.off('demo')` will unsubscribe an `emitter.on('demo')` listener,
  * `emitter.off('demo:example')` will unsubscribe an `emitter.on('demo:example')` listener
  * @name off
  * @param {String} event
  * @param {Function} [fn] – the specific handler
  * @example
  * emitter.off('example')
  * emitter.off('demo', function () {})
  */
  emitter.off = function off (event, fn) {
    var keep = []

    if (event && fn) {
      var fns = this._fns[event]
      var i = 0
      var l = fns ? fns.length : 0

      for (i; i < l; i++) {
        if (fns[i] !== fn) {
          keep.push(fns[i])
        }
      }
    }

    keep.length ? this._fns[event] = keep : delete this._fns[event]
  }

  function getListeners (e) {
    var out = _fns[e] ? _fns[e] : []
    var idx = e.indexOf(':')
    var args = (idx === -1) ? [e] : [e.substring(0, idx), e.substring(idx + 1)]

    var keys = Object.keys(_fns)
    var i = 0
    var l = keys.length

    for (i; i < l; i++) {
      var key = keys[i]
      if (key === '*') {
        out = out.concat(_fns[key])
      }

      if (args.length === 2 && args[0] === key) {
        out = out.concat(_fns[key])
        break
      }
    }

    return out
  }

  function emitAll (e, fns, args) {
    var i = 0
    var l = fns.length

    for (i; i < l; i++) {
      if (!fns[i]) break
      fns[i].event = e
      fns[i].apply(fns[i], args)
    }
  }

  return emitter
}

},{}],11:[function(require,module,exports){
!function() {
    'use strict';
    function VNode() {}
    function h(nodeName, attributes) {
        var lastSimple, child, simple, i, children = EMPTY_CHILDREN;
        for (i = arguments.length; i-- > 2; ) stack.push(arguments[i]);
        if (attributes && null != attributes.children) {
            if (!stack.length) stack.push(attributes.children);
            delete attributes.children;
        }
        while (stack.length) if ((child = stack.pop()) && void 0 !== child.pop) for (i = child.length; i--; ) stack.push(child[i]); else {
            if ('boolean' == typeof child) child = null;
            if (simple = 'function' != typeof nodeName) if (null == child) child = ''; else if ('number' == typeof child) child = String(child); else if ('string' != typeof child) simple = !1;
            if (simple && lastSimple) children[children.length - 1] += child; else if (children === EMPTY_CHILDREN) children = [ child ]; else children.push(child);
            lastSimple = simple;
        }
        var p = new VNode();
        p.nodeName = nodeName;
        p.children = children;
        p.attributes = null == attributes ? void 0 : attributes;
        p.key = null == attributes ? void 0 : attributes.key;
        if (void 0 !== options.vnode) options.vnode(p);
        return p;
    }
    function extend(obj, props) {
        for (var i in props) obj[i] = props[i];
        return obj;
    }
    function cloneElement(vnode, props) {
        return h(vnode.nodeName, extend(extend({}, vnode.attributes), props), arguments.length > 2 ? [].slice.call(arguments, 2) : vnode.children);
    }
    function enqueueRender(component) {
        if (!component.__d && (component.__d = !0) && 1 == items.push(component)) (options.debounceRendering || defer)(rerender);
    }
    function rerender() {
        var p, list = items;
        items = [];
        while (p = list.pop()) if (p.__d) renderComponent(p);
    }
    function isSameNodeType(node, vnode, hydrating) {
        if ('string' == typeof vnode || 'number' == typeof vnode) return void 0 !== node.splitText;
        if ('string' == typeof vnode.nodeName) return !node._componentConstructor && isNamedNode(node, vnode.nodeName); else return hydrating || node._componentConstructor === vnode.nodeName;
    }
    function isNamedNode(node, nodeName) {
        return node.__n === nodeName || node.nodeName.toLowerCase() === nodeName.toLowerCase();
    }
    function getNodeProps(vnode) {
        var props = extend({}, vnode.attributes);
        props.children = vnode.children;
        var defaultProps = vnode.nodeName.defaultProps;
        if (void 0 !== defaultProps) for (var i in defaultProps) if (void 0 === props[i]) props[i] = defaultProps[i];
        return props;
    }
    function createNode(nodeName, isSvg) {
        var node = isSvg ? document.createElementNS('http://www.w3.org/2000/svg', nodeName) : document.createElement(nodeName);
        node.__n = nodeName;
        return node;
    }
    function removeNode(node) {
        var parentNode = node.parentNode;
        if (parentNode) parentNode.removeChild(node);
    }
    function setAccessor(node, name, old, value, isSvg) {
        if ('className' === name) name = 'class';
        if ('key' === name) ; else if ('ref' === name) {
            if (old) old(null);
            if (value) value(node);
        } else if ('class' === name && !isSvg) node.className = value || ''; else if ('style' === name) {
            if (!value || 'string' == typeof value || 'string' == typeof old) node.style.cssText = value || '';
            if (value && 'object' == typeof value) {
                if ('string' != typeof old) for (var i in old) if (!(i in value)) node.style[i] = '';
                for (var i in value) node.style[i] = 'number' == typeof value[i] && !1 === IS_NON_DIMENSIONAL.test(i) ? value[i] + 'px' : value[i];
            }
        } else if ('dangerouslySetInnerHTML' === name) {
            if (value) node.innerHTML = value.__html || '';
        } else if ('o' == name[0] && 'n' == name[1]) {
            var useCapture = name !== (name = name.replace(/Capture$/, ''));
            name = name.toLowerCase().substring(2);
            if (value) {
                if (!old) node.addEventListener(name, eventProxy, useCapture);
            } else node.removeEventListener(name, eventProxy, useCapture);
            (node.__l || (node.__l = {}))[name] = value;
        } else if ('list' !== name && 'type' !== name && !isSvg && name in node) {
            setProperty(node, name, null == value ? '' : value);
            if (null == value || !1 === value) node.removeAttribute(name);
        } else {
            var ns = isSvg && name !== (name = name.replace(/^xlink:?/, ''));
            if (null == value || !1 === value) if (ns) node.removeAttributeNS('http://www.w3.org/1999/xlink', name.toLowerCase()); else node.removeAttribute(name); else if ('function' != typeof value) if (ns) node.setAttributeNS('http://www.w3.org/1999/xlink', name.toLowerCase(), value); else node.setAttribute(name, value);
        }
    }
    function setProperty(node, name, value) {
        try {
            node[name] = value;
        } catch (e) {}
    }
    function eventProxy(e) {
        return this.__l[e.type](options.event && options.event(e) || e);
    }
    function flushMounts() {
        var c;
        while (c = mounts.pop()) {
            if (options.afterMount) options.afterMount(c);
            if (c.componentDidMount) c.componentDidMount();
        }
    }
    function diff(dom, vnode, context, mountAll, parent, componentRoot) {
        if (!diffLevel++) {
            isSvgMode = null != parent && void 0 !== parent.ownerSVGElement;
            hydrating = null != dom && !('__preactattr_' in dom);
        }
        var ret = idiff(dom, vnode, context, mountAll, componentRoot);
        if (parent && ret.parentNode !== parent) parent.appendChild(ret);
        if (!--diffLevel) {
            hydrating = !1;
            if (!componentRoot) flushMounts();
        }
        return ret;
    }
    function idiff(dom, vnode, context, mountAll, componentRoot) {
        var out = dom, prevSvgMode = isSvgMode;
        if (null == vnode || 'boolean' == typeof vnode) vnode = '';
        if ('string' == typeof vnode || 'number' == typeof vnode) {
            if (dom && void 0 !== dom.splitText && dom.parentNode && (!dom._component || componentRoot)) {
                if (dom.nodeValue != vnode) dom.nodeValue = vnode;
            } else {
                out = document.createTextNode(vnode);
                if (dom) {
                    if (dom.parentNode) dom.parentNode.replaceChild(out, dom);
                    recollectNodeTree(dom, !0);
                }
            }
            out.__preactattr_ = !0;
            return out;
        }
        var vnodeName = vnode.nodeName;
        if ('function' == typeof vnodeName) return buildComponentFromVNode(dom, vnode, context, mountAll);
        isSvgMode = 'svg' === vnodeName ? !0 : 'foreignObject' === vnodeName ? !1 : isSvgMode;
        vnodeName = String(vnodeName);
        if (!dom || !isNamedNode(dom, vnodeName)) {
            out = createNode(vnodeName, isSvgMode);
            if (dom) {
                while (dom.firstChild) out.appendChild(dom.firstChild);
                if (dom.parentNode) dom.parentNode.replaceChild(out, dom);
                recollectNodeTree(dom, !0);
            }
        }
        var fc = out.firstChild, props = out.__preactattr_, vchildren = vnode.children;
        if (null == props) {
            props = out.__preactattr_ = {};
            for (var a = out.attributes, i = a.length; i--; ) props[a[i].name] = a[i].value;
        }
        if (!hydrating && vchildren && 1 === vchildren.length && 'string' == typeof vchildren[0] && null != fc && void 0 !== fc.splitText && null == fc.nextSibling) {
            if (fc.nodeValue != vchildren[0]) fc.nodeValue = vchildren[0];
        } else if (vchildren && vchildren.length || null != fc) innerDiffNode(out, vchildren, context, mountAll, hydrating || null != props.dangerouslySetInnerHTML);
        diffAttributes(out, vnode.attributes, props);
        isSvgMode = prevSvgMode;
        return out;
    }
    function innerDiffNode(dom, vchildren, context, mountAll, isHydrating) {
        var j, c, f, vchild, child, originalChildren = dom.childNodes, children = [], keyed = {}, keyedLen = 0, min = 0, len = originalChildren.length, childrenLen = 0, vlen = vchildren ? vchildren.length : 0;
        if (0 !== len) for (var i = 0; i < len; i++) {
            var _child = originalChildren[i], props = _child.__preactattr_, key = vlen && props ? _child._component ? _child._component.__k : props.key : null;
            if (null != key) {
                keyedLen++;
                keyed[key] = _child;
            } else if (props || (void 0 !== _child.splitText ? isHydrating ? _child.nodeValue.trim() : !0 : isHydrating)) children[childrenLen++] = _child;
        }
        if (0 !== vlen) for (var i = 0; i < vlen; i++) {
            vchild = vchildren[i];
            child = null;
            var key = vchild.key;
            if (null != key) {
                if (keyedLen && void 0 !== keyed[key]) {
                    child = keyed[key];
                    keyed[key] = void 0;
                    keyedLen--;
                }
            } else if (!child && min < childrenLen) for (j = min; j < childrenLen; j++) if (void 0 !== children[j] && isSameNodeType(c = children[j], vchild, isHydrating)) {
                child = c;
                children[j] = void 0;
                if (j === childrenLen - 1) childrenLen--;
                if (j === min) min++;
                break;
            }
            child = idiff(child, vchild, context, mountAll);
            f = originalChildren[i];
            if (child && child !== dom && child !== f) if (null == f) dom.appendChild(child); else if (child === f.nextSibling) removeNode(f); else dom.insertBefore(child, f);
        }
        if (keyedLen) for (var i in keyed) if (void 0 !== keyed[i]) recollectNodeTree(keyed[i], !1);
        while (min <= childrenLen) if (void 0 !== (child = children[childrenLen--])) recollectNodeTree(child, !1);
    }
    function recollectNodeTree(node, unmountOnly) {
        var component = node._component;
        if (component) unmountComponent(component); else {
            if (null != node.__preactattr_ && node.__preactattr_.ref) node.__preactattr_.ref(null);
            if (!1 === unmountOnly || null == node.__preactattr_) removeNode(node);
            removeChildren(node);
        }
    }
    function removeChildren(node) {
        node = node.lastChild;
        while (node) {
            var next = node.previousSibling;
            recollectNodeTree(node, !0);
            node = next;
        }
    }
    function diffAttributes(dom, attrs, old) {
        var name;
        for (name in old) if ((!attrs || null == attrs[name]) && null != old[name]) setAccessor(dom, name, old[name], old[name] = void 0, isSvgMode);
        for (name in attrs) if (!('children' === name || 'innerHTML' === name || name in old && attrs[name] === ('value' === name || 'checked' === name ? dom[name] : old[name]))) setAccessor(dom, name, old[name], old[name] = attrs[name], isSvgMode);
    }
    function collectComponent(component) {
        var name = component.constructor.name;
        (components[name] || (components[name] = [])).push(component);
    }
    function createComponent(Ctor, props, context) {
        var inst, list = components[Ctor.name];
        if (Ctor.prototype && Ctor.prototype.render) {
            inst = new Ctor(props, context);
            Component.call(inst, props, context);
        } else {
            inst = new Component(props, context);
            inst.constructor = Ctor;
            inst.render = doRender;
        }
        if (list) for (var i = list.length; i--; ) if (list[i].constructor === Ctor) {
            inst.__b = list[i].__b;
            list.splice(i, 1);
            break;
        }
        return inst;
    }
    function doRender(props, state, context) {
        return this.constructor(props, context);
    }
    function setComponentProps(component, props, opts, context, mountAll) {
        if (!component.__x) {
            component.__x = !0;
            if (component.__r = props.ref) delete props.ref;
            if (component.__k = props.key) delete props.key;
            if (!component.base || mountAll) {
                if (component.componentWillMount) component.componentWillMount();
            } else if (component.componentWillReceiveProps) component.componentWillReceiveProps(props, context);
            if (context && context !== component.context) {
                if (!component.__c) component.__c = component.context;
                component.context = context;
            }
            if (!component.__p) component.__p = component.props;
            component.props = props;
            component.__x = !1;
            if (0 !== opts) if (1 === opts || !1 !== options.syncComponentUpdates || !component.base) renderComponent(component, 1, mountAll); else enqueueRender(component);
            if (component.__r) component.__r(component);
        }
    }
    function renderComponent(component, opts, mountAll, isChild) {
        if (!component.__x) {
            var rendered, inst, cbase, props = component.props, state = component.state, context = component.context, previousProps = component.__p || props, previousState = component.__s || state, previousContext = component.__c || context, isUpdate = component.base, nextBase = component.__b, initialBase = isUpdate || nextBase, initialChildComponent = component._component, skip = !1;
            if (isUpdate) {
                component.props = previousProps;
                component.state = previousState;
                component.context = previousContext;
                if (2 !== opts && component.shouldComponentUpdate && !1 === component.shouldComponentUpdate(props, state, context)) skip = !0; else if (component.componentWillUpdate) component.componentWillUpdate(props, state, context);
                component.props = props;
                component.state = state;
                component.context = context;
            }
            component.__p = component.__s = component.__c = component.__b = null;
            component.__d = !1;
            if (!skip) {
                rendered = component.render(props, state, context);
                if (component.getChildContext) context = extend(extend({}, context), component.getChildContext());
                var toUnmount, base, childComponent = rendered && rendered.nodeName;
                if ('function' == typeof childComponent) {
                    var childProps = getNodeProps(rendered);
                    inst = initialChildComponent;
                    if (inst && inst.constructor === childComponent && childProps.key == inst.__k) setComponentProps(inst, childProps, 1, context, !1); else {
                        toUnmount = inst;
                        component._component = inst = createComponent(childComponent, childProps, context);
                        inst.__b = inst.__b || nextBase;
                        inst.__u = component;
                        setComponentProps(inst, childProps, 0, context, !1);
                        renderComponent(inst, 1, mountAll, !0);
                    }
                    base = inst.base;
                } else {
                    cbase = initialBase;
                    toUnmount = initialChildComponent;
                    if (toUnmount) cbase = component._component = null;
                    if (initialBase || 1 === opts) {
                        if (cbase) cbase._component = null;
                        base = diff(cbase, rendered, context, mountAll || !isUpdate, initialBase && initialBase.parentNode, !0);
                    }
                }
                if (initialBase && base !== initialBase && inst !== initialChildComponent) {
                    var baseParent = initialBase.parentNode;
                    if (baseParent && base !== baseParent) {
                        baseParent.replaceChild(base, initialBase);
                        if (!toUnmount) {
                            initialBase._component = null;
                            recollectNodeTree(initialBase, !1);
                        }
                    }
                }
                if (toUnmount) unmountComponent(toUnmount);
                component.base = base;
                if (base && !isChild) {
                    var componentRef = component, t = component;
                    while (t = t.__u) (componentRef = t).base = base;
                    base._component = componentRef;
                    base._componentConstructor = componentRef.constructor;
                }
            }
            if (!isUpdate || mountAll) mounts.unshift(component); else if (!skip) {
                if (component.componentDidUpdate) component.componentDidUpdate(previousProps, previousState, previousContext);
                if (options.afterUpdate) options.afterUpdate(component);
            }
            if (null != component.__h) while (component.__h.length) component.__h.pop().call(component);
            if (!diffLevel && !isChild) flushMounts();
        }
    }
    function buildComponentFromVNode(dom, vnode, context, mountAll) {
        var c = dom && dom._component, originalComponent = c, oldDom = dom, isDirectOwner = c && dom._componentConstructor === vnode.nodeName, isOwner = isDirectOwner, props = getNodeProps(vnode);
        while (c && !isOwner && (c = c.__u)) isOwner = c.constructor === vnode.nodeName;
        if (c && isOwner && (!mountAll || c._component)) {
            setComponentProps(c, props, 3, context, mountAll);
            dom = c.base;
        } else {
            if (originalComponent && !isDirectOwner) {
                unmountComponent(originalComponent);
                dom = oldDom = null;
            }
            c = createComponent(vnode.nodeName, props, context);
            if (dom && !c.__b) {
                c.__b = dom;
                oldDom = null;
            }
            setComponentProps(c, props, 1, context, mountAll);
            dom = c.base;
            if (oldDom && dom !== oldDom) {
                oldDom._component = null;
                recollectNodeTree(oldDom, !1);
            }
        }
        return dom;
    }
    function unmountComponent(component) {
        if (options.beforeUnmount) options.beforeUnmount(component);
        var base = component.base;
        component.__x = !0;
        if (component.componentWillUnmount) component.componentWillUnmount();
        component.base = null;
        var inner = component._component;
        if (inner) unmountComponent(inner); else if (base) {
            if (base.__preactattr_ && base.__preactattr_.ref) base.__preactattr_.ref(null);
            component.__b = base;
            removeNode(base);
            collectComponent(component);
            removeChildren(base);
        }
        if (component.__r) component.__r(null);
    }
    function Component(props, context) {
        this.__d = !0;
        this.context = context;
        this.props = props;
        this.state = this.state || {};
    }
    function render(vnode, parent, merge) {
        return diff(merge, vnode, {}, !1, parent, !1);
    }
    var options = {};
    var stack = [];
    var EMPTY_CHILDREN = [];
    var defer = 'function' == typeof Promise ? Promise.resolve().then.bind(Promise.resolve()) : setTimeout;
    var IS_NON_DIMENSIONAL = /acit|ex(?:s|g|n|p|$)|rph|ows|mnc|ntw|ine[ch]|zoo|^ord/i;
    var items = [];
    var mounts = [];
    var diffLevel = 0;
    var isSvgMode = !1;
    var hydrating = !1;
    var components = {};
    extend(Component.prototype, {
        setState: function(state, callback) {
            var s = this.state;
            if (!this.__s) this.__s = extend({}, s);
            extend(s, 'function' == typeof state ? state(s, this.props) : state);
            if (callback) (this.__h = this.__h || []).push(callback);
            enqueueRender(this);
        },
        forceUpdate: function(callback) {
            if (callback) (this.__h = this.__h || []).push(callback);
            renderComponent(this, 2);
        },
        render: function() {}
    });
    var preact = {
        h: h,
        createElement: h,
        cloneElement: cloneElement,
        Component: Component,
        render: render,
        rerender: rerender,
        options: options
    };
    if ('undefined' != typeof module) module.exports = preact; else self.preact = preact;
}();

},{}],12:[function(require,module,exports){
// shim for using process in browser
var process = module.exports = {};

// cached from whatever global is present so that test runners that stub it
// don't break things.  But we need to wrap it in a try catch in case it is
// wrapped in strict mode code which doesn't define any globals.  It's inside a
// function because try/catches deoptimize in certain engines.

var cachedSetTimeout;
var cachedClearTimeout;

function defaultSetTimout() {
    throw new Error('setTimeout has not been defined');
}
function defaultClearTimeout () {
    throw new Error('clearTimeout has not been defined');
}
(function () {
    try {
        if (typeof setTimeout === 'function') {
            cachedSetTimeout = setTimeout;
        } else {
            cachedSetTimeout = defaultSetTimout;
        }
    } catch (e) {
        cachedSetTimeout = defaultSetTimout;
    }
    try {
        if (typeof clearTimeout === 'function') {
            cachedClearTimeout = clearTimeout;
        } else {
            cachedClearTimeout = defaultClearTimeout;
        }
    } catch (e) {
        cachedClearTimeout = defaultClearTimeout;
    }
} ())
function runTimeout(fun) {
    if (cachedSetTimeout === setTimeout) {
        //normal enviroments in sane situations
        return setTimeout(fun, 0);
    }
    // if setTimeout wasn't available but was latter defined
    if ((cachedSetTimeout === defaultSetTimout || !cachedSetTimeout) && setTimeout) {
        cachedSetTimeout = setTimeout;
        return setTimeout(fun, 0);
    }
    try {
        // when when somebody has screwed with setTimeout but no I.E. maddness
        return cachedSetTimeout(fun, 0);
    } catch(e){
        try {
            // When we are in I.E. but the script has been evaled so I.E. doesn't trust the global object when called normally
            return cachedSetTimeout.call(null, fun, 0);
        } catch(e){
            // same as above but when it's a version of I.E. that must have the global object for 'this', hopfully our context correct otherwise it will throw a global error
            return cachedSetTimeout.call(this, fun, 0);
        }
    }


}
function runClearTimeout(marker) {
    if (cachedClearTimeout === clearTimeout) {
        //normal enviroments in sane situations
        return clearTimeout(marker);
    }
    // if clearTimeout wasn't available but was latter defined
    if ((cachedClearTimeout === defaultClearTimeout || !cachedClearTimeout) && clearTimeout) {
        cachedClearTimeout = clearTimeout;
        return clearTimeout(marker);
    }
    try {
        // when when somebody has screwed with setTimeout but no I.E. maddness
        return cachedClearTimeout(marker);
    } catch (e){
        try {
            // When we are in I.E. but the script has been evaled so I.E. doesn't  trust the global object when called normally
            return cachedClearTimeout.call(null, marker);
        } catch (e){
            // same as above but when it's a version of I.E. that must have the global object for 'this', hopfully our context correct otherwise it will throw a global error.
            // Some versions of I.E. have different rules for clearTimeout vs setTimeout
            return cachedClearTimeout.call(this, marker);
        }
    }



}
var queue = [];
var draining = false;
var currentQueue;
var queueIndex = -1;

function cleanUpNextTick() {
    if (!draining || !currentQueue) {
        return;
    }
    draining = false;
    if (currentQueue.length) {
        queue = currentQueue.concat(queue);
    } else {
        queueIndex = -1;
    }
    if (queue.length) {
        drainQueue();
    }
}

function drainQueue() {
    if (draining) {
        return;
    }
    var timeout = runTimeout(cleanUpNextTick);
    draining = true;

    var len = queue.length;
    while(len) {
        currentQueue = queue;
        queue = [];
        while (++queueIndex < len) {
            if (currentQueue) {
                currentQueue[queueIndex].run();
            }
        }
        queueIndex = -1;
        len = queue.length;
    }
    currentQueue = null;
    draining = false;
    runClearTimeout(timeout);
}

process.nextTick = function (fun) {
    var args = new Array(arguments.length - 1);
    if (arguments.length > 1) {
        for (var i = 1; i < arguments.length; i++) {
            args[i - 1] = arguments[i];
        }
    }
    queue.push(new Item(fun, args));
    if (queue.length === 1 && !draining) {
        runTimeout(drainQueue);
    }
};

// v8 likes predictible objects
function Item(fun, array) {
    this.fun = fun;
    this.array = array;
}
Item.prototype.run = function () {
    this.fun.apply(null, this.array);
};
process.title = 'browser';
process.browser = true;
process.env = {};
process.argv = [];
process.version = ''; // empty string to avoid regexp issues
process.versions = {};

function noop() {}

process.on = noop;
process.addListener = noop;
process.once = noop;
process.off = noop;
process.removeListener = noop;
process.removeAllListeners = noop;
process.emit = noop;
process.prependListener = noop;
process.prependOnceListener = noop;

process.listeners = function (name) { return [] }

process.binding = function (name) {
    throw new Error('process.binding is not supported');
};

process.cwd = function () { return '/' };
process.chdir = function (dir) {
    throw new Error('process.chdir is not supported');
};
process.umask = function() { return 0; };

},{}],13:[function(require,module,exports){
(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports) :
  typeof define === 'function' && define.amd ? define(['exports'], factory) :
  (factory((global.WHATWGFetch = {})));
}(this, (function (exports) { 'use strict';

  var support = {
    searchParams: 'URLSearchParams' in self,
    iterable: 'Symbol' in self && 'iterator' in Symbol,
    blob:
      'FileReader' in self &&
      'Blob' in self &&
      (function() {
        try {
          new Blob();
          return true
        } catch (e) {
          return false
        }
      })(),
    formData: 'FormData' in self,
    arrayBuffer: 'ArrayBuffer' in self
  };

  function isDataView(obj) {
    return obj && DataView.prototype.isPrototypeOf(obj)
  }

  if (support.arrayBuffer) {
    var viewClasses = [
      '[object Int8Array]',
      '[object Uint8Array]',
      '[object Uint8ClampedArray]',
      '[object Int16Array]',
      '[object Uint16Array]',
      '[object Int32Array]',
      '[object Uint32Array]',
      '[object Float32Array]',
      '[object Float64Array]'
    ];

    var isArrayBufferView =
      ArrayBuffer.isView ||
      function(obj) {
        return obj && viewClasses.indexOf(Object.prototype.toString.call(obj)) > -1
      };
  }

  function normalizeName(name) {
    if (typeof name !== 'string') {
      name = String(name);
    }
    if (/[^a-z0-9\-#$%&'*+.^_`|~]/i.test(name)) {
      throw new TypeError('Invalid character in header field name')
    }
    return name.toLowerCase()
  }

  function normalizeValue(value) {
    if (typeof value !== 'string') {
      value = String(value);
    }
    return value
  }

  // Build a destructive iterator for the value list
  function iteratorFor(items) {
    var iterator = {
      next: function() {
        var value = items.shift();
        return {done: value === undefined, value: value}
      }
    };

    if (support.iterable) {
      iterator[Symbol.iterator] = function() {
        return iterator
      };
    }

    return iterator
  }

  function Headers(headers) {
    this.map = {};

    if (headers instanceof Headers) {
      headers.forEach(function(value, name) {
        this.append(name, value);
      }, this);
    } else if (Array.isArray(headers)) {
      headers.forEach(function(header) {
        this.append(header[0], header[1]);
      }, this);
    } else if (headers) {
      Object.getOwnPropertyNames(headers).forEach(function(name) {
        this.append(name, headers[name]);
      }, this);
    }
  }

  Headers.prototype.append = function(name, value) {
    name = normalizeName(name);
    value = normalizeValue(value);
    var oldValue = this.map[name];
    this.map[name] = oldValue ? oldValue + ', ' + value : value;
  };

  Headers.prototype['delete'] = function(name) {
    delete this.map[normalizeName(name)];
  };

  Headers.prototype.get = function(name) {
    name = normalizeName(name);
    return this.has(name) ? this.map[name] : null
  };

  Headers.prototype.has = function(name) {
    return this.map.hasOwnProperty(normalizeName(name))
  };

  Headers.prototype.set = function(name, value) {
    this.map[normalizeName(name)] = normalizeValue(value);
  };

  Headers.prototype.forEach = function(callback, thisArg) {
    for (var name in this.map) {
      if (this.map.hasOwnProperty(name)) {
        callback.call(thisArg, this.map[name], name, this);
      }
    }
  };

  Headers.prototype.keys = function() {
    var items = [];
    this.forEach(function(value, name) {
      items.push(name);
    });
    return iteratorFor(items)
  };

  Headers.prototype.values = function() {
    var items = [];
    this.forEach(function(value) {
      items.push(value);
    });
    return iteratorFor(items)
  };

  Headers.prototype.entries = function() {
    var items = [];
    this.forEach(function(value, name) {
      items.push([name, value]);
    });
    return iteratorFor(items)
  };

  if (support.iterable) {
    Headers.prototype[Symbol.iterator] = Headers.prototype.entries;
  }

  function consumed(body) {
    if (body.bodyUsed) {
      return Promise.reject(new TypeError('Already read'))
    }
    body.bodyUsed = true;
  }

  function fileReaderReady(reader) {
    return new Promise(function(resolve, reject) {
      reader.onload = function() {
        resolve(reader.result);
      };
      reader.onerror = function() {
        reject(reader.error);
      };
    })
  }

  function readBlobAsArrayBuffer(blob) {
    var reader = new FileReader();
    var promise = fileReaderReady(reader);
    reader.readAsArrayBuffer(blob);
    return promise
  }

  function readBlobAsText(blob) {
    var reader = new FileReader();
    var promise = fileReaderReady(reader);
    reader.readAsText(blob);
    return promise
  }

  function readArrayBufferAsText(buf) {
    var view = new Uint8Array(buf);
    var chars = new Array(view.length);

    for (var i = 0; i < view.length; i++) {
      chars[i] = String.fromCharCode(view[i]);
    }
    return chars.join('')
  }

  function bufferClone(buf) {
    if (buf.slice) {
      return buf.slice(0)
    } else {
      var view = new Uint8Array(buf.byteLength);
      view.set(new Uint8Array(buf));
      return view.buffer
    }
  }

  function Body() {
    this.bodyUsed = false;

    this._initBody = function(body) {
      this._bodyInit = body;
      if (!body) {
        this._bodyText = '';
      } else if (typeof body === 'string') {
        this._bodyText = body;
      } else if (support.blob && Blob.prototype.isPrototypeOf(body)) {
        this._bodyBlob = body;
      } else if (support.formData && FormData.prototype.isPrototypeOf(body)) {
        this._bodyFormData = body;
      } else if (support.searchParams && URLSearchParams.prototype.isPrototypeOf(body)) {
        this._bodyText = body.toString();
      } else if (support.arrayBuffer && support.blob && isDataView(body)) {
        this._bodyArrayBuffer = bufferClone(body.buffer);
        // IE 10-11 can't handle a DataView body.
        this._bodyInit = new Blob([this._bodyArrayBuffer]);
      } else if (support.arrayBuffer && (ArrayBuffer.prototype.isPrototypeOf(body) || isArrayBufferView(body))) {
        this._bodyArrayBuffer = bufferClone(body);
      } else {
        this._bodyText = body = Object.prototype.toString.call(body);
      }

      if (!this.headers.get('content-type')) {
        if (typeof body === 'string') {
          this.headers.set('content-type', 'text/plain;charset=UTF-8');
        } else if (this._bodyBlob && this._bodyBlob.type) {
          this.headers.set('content-type', this._bodyBlob.type);
        } else if (support.searchParams && URLSearchParams.prototype.isPrototypeOf(body)) {
          this.headers.set('content-type', 'application/x-www-form-urlencoded;charset=UTF-8');
        }
      }
    };

    if (support.blob) {
      this.blob = function() {
        var rejected = consumed(this);
        if (rejected) {
          return rejected
        }

        if (this._bodyBlob) {
          return Promise.resolve(this._bodyBlob)
        } else if (this._bodyArrayBuffer) {
          return Promise.resolve(new Blob([this._bodyArrayBuffer]))
        } else if (this._bodyFormData) {
          throw new Error('could not read FormData body as blob')
        } else {
          return Promise.resolve(new Blob([this._bodyText]))
        }
      };

      this.arrayBuffer = function() {
        if (this._bodyArrayBuffer) {
          return consumed(this) || Promise.resolve(this._bodyArrayBuffer)
        } else {
          return this.blob().then(readBlobAsArrayBuffer)
        }
      };
    }

    this.text = function() {
      var rejected = consumed(this);
      if (rejected) {
        return rejected
      }

      if (this._bodyBlob) {
        return readBlobAsText(this._bodyBlob)
      } else if (this._bodyArrayBuffer) {
        return Promise.resolve(readArrayBufferAsText(this._bodyArrayBuffer))
      } else if (this._bodyFormData) {
        throw new Error('could not read FormData body as text')
      } else {
        return Promise.resolve(this._bodyText)
      }
    };

    if (support.formData) {
      this.formData = function() {
        return this.text().then(decode)
      };
    }

    this.json = function() {
      return this.text().then(JSON.parse)
    };

    return this
  }

  // HTTP methods whose capitalization should be normalized
  var methods = ['DELETE', 'GET', 'HEAD', 'OPTIONS', 'POST', 'PUT'];

  function normalizeMethod(method) {
    var upcased = method.toUpperCase();
    return methods.indexOf(upcased) > -1 ? upcased : method
  }

  function Request(input, options) {
    options = options || {};
    var body = options.body;

    if (input instanceof Request) {
      if (input.bodyUsed) {
        throw new TypeError('Already read')
      }
      this.url = input.url;
      this.credentials = input.credentials;
      if (!options.headers) {
        this.headers = new Headers(input.headers);
      }
      this.method = input.method;
      this.mode = input.mode;
      this.signal = input.signal;
      if (!body && input._bodyInit != null) {
        body = input._bodyInit;
        input.bodyUsed = true;
      }
    } else {
      this.url = String(input);
    }

    this.credentials = options.credentials || this.credentials || 'same-origin';
    if (options.headers || !this.headers) {
      this.headers = new Headers(options.headers);
    }
    this.method = normalizeMethod(options.method || this.method || 'GET');
    this.mode = options.mode || this.mode || null;
    this.signal = options.signal || this.signal;
    this.referrer = null;

    if ((this.method === 'GET' || this.method === 'HEAD') && body) {
      throw new TypeError('Body not allowed for GET or HEAD requests')
    }
    this._initBody(body);
  }

  Request.prototype.clone = function() {
    return new Request(this, {body: this._bodyInit})
  };

  function decode(body) {
    var form = new FormData();
    body
      .trim()
      .split('&')
      .forEach(function(bytes) {
        if (bytes) {
          var split = bytes.split('=');
          var name = split.shift().replace(/\+/g, ' ');
          var value = split.join('=').replace(/\+/g, ' ');
          form.append(decodeURIComponent(name), decodeURIComponent(value));
        }
      });
    return form
  }

  function parseHeaders(rawHeaders) {
    var headers = new Headers();
    // Replace instances of \r\n and \n followed by at least one space or horizontal tab with a space
    // https://tools.ietf.org/html/rfc7230#section-3.2
    var preProcessedHeaders = rawHeaders.replace(/\r?\n[\t ]+/g, ' ');
    preProcessedHeaders.split(/\r?\n/).forEach(function(line) {
      var parts = line.split(':');
      var key = parts.shift().trim();
      if (key) {
        var value = parts.join(':').trim();
        headers.append(key, value);
      }
    });
    return headers
  }

  Body.call(Request.prototype);

  function Response(bodyInit, options) {
    if (!options) {
      options = {};
    }

    this.type = 'default';
    this.status = options.status === undefined ? 200 : options.status;
    this.ok = this.status >= 200 && this.status < 300;
    this.statusText = 'statusText' in options ? options.statusText : 'OK';
    this.headers = new Headers(options.headers);
    this.url = options.url || '';
    this._initBody(bodyInit);
  }

  Body.call(Response.prototype);

  Response.prototype.clone = function() {
    return new Response(this._bodyInit, {
      status: this.status,
      statusText: this.statusText,
      headers: new Headers(this.headers),
      url: this.url
    })
  };

  Response.error = function() {
    var response = new Response(null, {status: 0, statusText: ''});
    response.type = 'error';
    return response
  };

  var redirectStatuses = [301, 302, 303, 307, 308];

  Response.redirect = function(url, status) {
    if (redirectStatuses.indexOf(status) === -1) {
      throw new RangeError('Invalid status code')
    }

    return new Response(null, {status: status, headers: {location: url}})
  };

  exports.DOMException = self.DOMException;
  try {
    new exports.DOMException();
  } catch (err) {
    exports.DOMException = function(message, name) {
      this.message = message;
      this.name = name;
      var error = Error(message);
      this.stack = error.stack;
    };
    exports.DOMException.prototype = Object.create(Error.prototype);
    exports.DOMException.prototype.constructor = exports.DOMException;
  }

  function fetch(input, init) {
    return new Promise(function(resolve, reject) {
      var request = new Request(input, init);

      if (request.signal && request.signal.aborted) {
        return reject(new exports.DOMException('Aborted', 'AbortError'))
      }

      var xhr = new XMLHttpRequest();

      function abortXhr() {
        xhr.abort();
      }

      xhr.onload = function() {
        var options = {
          status: xhr.status,
          statusText: xhr.statusText,
          headers: parseHeaders(xhr.getAllResponseHeaders() || '')
        };
        options.url = 'responseURL' in xhr ? xhr.responseURL : options.headers.get('X-Request-URL');
        var body = 'response' in xhr ? xhr.response : xhr.responseText;
        resolve(new Response(body, options));
      };

      xhr.onerror = function() {
        reject(new TypeError('Network request failed'));
      };

      xhr.ontimeout = function() {
        reject(new TypeError('Network request failed'));
      };

      xhr.onabort = function() {
        reject(new exports.DOMException('Aborted', 'AbortError'));
      };

      xhr.open(request.method, request.url, true);

      if (request.credentials === 'include') {
        xhr.withCredentials = true;
      } else if (request.credentials === 'omit') {
        xhr.withCredentials = false;
      }

      if ('responseType' in xhr && support.blob) {
        xhr.responseType = 'blob';
      }

      request.headers.forEach(function(value, name) {
        xhr.setRequestHeader(name, value);
      });

      if (request.signal) {
        request.signal.addEventListener('abort', abortXhr);

        xhr.onreadystatechange = function() {
          // DONE (success or failure)
          if (xhr.readyState === 4) {
            request.signal.removeEventListener('abort', abortXhr);
          }
        };
      }

      xhr.send(typeof request._bodyInit === 'undefined' ? null : request._bodyInit);
    })
  }

  fetch.polyfill = true;

  if (!self.fetch) {
    self.fetch = fetch;
    self.Headers = Headers;
    self.Request = Request;
    self.Response = Response;
  }

  exports.Headers = Headers;
  exports.Request = Request;
  exports.Response = Response;
  exports.fetch = fetch;

  Object.defineProperty(exports, '__esModule', { value: true });

})));

},{}],14:[function(require,module,exports){
/* jshint node: true */
'use strict';

/**
  # wildcard

  Very simple wildcard matching, which is designed to provide the same
  functionality that is found in the
  [eve](https://github.com/adobe-webplatform/eve) eventing library.

  ## Usage

  It works with strings:

  <<< examples/strings.js

  Arrays:

  <<< examples/arrays.js

  Objects (matching against keys):

  <<< examples/objects.js

  While the library works in Node, if you are are looking for file-based
  wildcard matching then you should have a look at:

  <https://github.com/isaacs/node-glob>
**/

function WildcardMatcher(text, separator) {
  this.text = text = text || '';
  this.hasWild = ~text.indexOf('*');
  this.separator = separator;
  this.parts = text.split(separator);
}

WildcardMatcher.prototype.match = function(input) {
  var matches = true;
  var parts = this.parts;
  var ii;
  var partsCount = parts.length;
  var testParts;

  if (typeof input == 'string' || input instanceof String) {
    if (!this.hasWild && this.text != input) {
      matches = false;
    } else {
      testParts = (input || '').split(this.separator);
      for (ii = 0; matches && ii < partsCount; ii++) {
        if (parts[ii] === '*')  {
          continue;
        } else if (ii < testParts.length) {
          matches = parts[ii] === testParts[ii];
        } else {
          matches = false;
        }
      }

      // If matches, then return the component parts
      matches = matches && testParts;
    }
  }
  else if (typeof input.splice == 'function') {
    matches = [];

    for (ii = input.length; ii--; ) {
      if (this.match(input[ii])) {
        matches[matches.length] = input[ii];
      }
    }
  }
  else if (typeof input == 'object') {
    matches = {};

    for (var key in input) {
      if (this.match(key)) {
        matches[key] = input[key];
      }
    }
  }

  return matches;
};

module.exports = function(text, test, separator) {
  var matcher = new WildcardMatcher(text, separator || /[\/\.]/);
  if (typeof test != 'undefined') {
    return matcher.match(test);
  }

  return matcher;
};

},{}],15:[function(require,module,exports){
module.exports={
  "name": "@uppy/companion-client",
  "description": "Client library for communication with Companion. Intended for use in Uppy plugins.",
  "version": "1.6.0",
  "license": "MIT",
  "main": "lib/index.js",
  "types": "types/index.d.ts",
  "keywords": [
    "file uploader",
    "uppy",
    "uppy-plugin",
    "companion",
    "provider"
  ],
  "homepage": "https://uppy.io",
  "bugs": {
    "url": "https://github.com/transloadit/uppy/issues"
  },
  "repository": {
    "type": "git",
    "url": "git+https://github.com/transloadit/uppy.git"
  },
  "dependencies": {
    "@uppy/utils": "file:../utils",
    "namespace-emitter": "^2.0.1"
  }
}

},{}],16:[function(require,module,exports){
'use strict';

function _inheritsLoose(subClass, superClass) { subClass.prototype = Object.create(superClass.prototype); subClass.prototype.constructor = subClass; subClass.__proto__ = superClass; }

function _wrapNativeSuper(Class) { var _cache = typeof Map === "function" ? new Map() : undefined; _wrapNativeSuper = function _wrapNativeSuper(Class) { if (Class === null || !_isNativeFunction(Class)) return Class; if (typeof Class !== "function") { throw new TypeError("Super expression must either be null or a function"); } if (typeof _cache !== "undefined") { if (_cache.has(Class)) return _cache.get(Class); _cache.set(Class, Wrapper); } function Wrapper() { return _construct(Class, arguments, _getPrototypeOf(this).constructor); } Wrapper.prototype = Object.create(Class.prototype, { constructor: { value: Wrapper, enumerable: false, writable: true, configurable: true } }); return _setPrototypeOf(Wrapper, Class); }; return _wrapNativeSuper(Class); }

function _construct(Parent, args, Class) { if (_isNativeReflectConstruct()) { _construct = Reflect.construct; } else { _construct = function _construct(Parent, args, Class) { var a = [null]; a.push.apply(a, args); var Constructor = Function.bind.apply(Parent, a); var instance = new Constructor(); if (Class) _setPrototypeOf(instance, Class.prototype); return instance; }; } return _construct.apply(null, arguments); }

function _isNativeReflectConstruct() { if (typeof Reflect === "undefined" || !Reflect.construct) return false; if (Reflect.construct.sham) return false; if (typeof Proxy === "function") return true; try { Date.prototype.toString.call(Reflect.construct(Date, [], function () {})); return true; } catch (e) { return false; } }

function _isNativeFunction(fn) { return Function.toString.call(fn).indexOf("[native code]") !== -1; }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }

var AuthError = /*#__PURE__*/function (_Error) {
  _inheritsLoose(AuthError, _Error);

  function AuthError() {
    var _this;

    _this = _Error.call(this, 'Authorization required') || this;
    _this.name = 'AuthError';
    _this.isAuthError = true;
    return _this;
  }

  return AuthError;
}( /*#__PURE__*/_wrapNativeSuper(Error));

module.exports = AuthError;

},{}],17:[function(require,module,exports){
'use strict';

function _extends() { _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }

function _inheritsLoose(subClass, superClass) { subClass.prototype = Object.create(superClass.prototype); subClass.prototype.constructor = subClass; subClass.__proto__ = superClass; }

var RequestClient = require('./RequestClient');

var tokenStorage = require('./tokenStorage');

var _getName = function _getName(id) {
  return id.split('-').map(function (s) {
    return s.charAt(0).toUpperCase() + s.slice(1);
  }).join(' ');
};

module.exports = /*#__PURE__*/function (_RequestClient) {
  _inheritsLoose(Provider, _RequestClient);

  function Provider(uppy, opts) {
    var _this;

    _this = _RequestClient.call(this, uppy, opts) || this;
    _this.provider = opts.provider;
    _this.id = _this.provider;
    _this.name = _this.opts.name || _getName(_this.id);
    _this.pluginId = _this.opts.pluginId;
    _this.tokenKey = "companion-" + _this.pluginId + "-auth-token";
    return _this;
  }

  var _proto = Provider.prototype;

  _proto.headers = function headers() {
    return Promise.all([_RequestClient.prototype.headers.call(this), this.getAuthToken()]).then(function (_ref) {
      var headers = _ref[0],
          token = _ref[1];
      return _extends({}, headers, {
        'uppy-auth-token': token
      });
    });
  };

  _proto.onReceiveResponse = function onReceiveResponse(response) {
    response = _RequestClient.prototype.onReceiveResponse.call(this, response);
    var plugin = this.uppy.getPlugin(this.pluginId);
    var oldAuthenticated = plugin.getPluginState().authenticated;
    var authenticated = oldAuthenticated ? response.status !== 401 : response.status < 400;
    plugin.setPluginState({
      authenticated: authenticated
    });
    return response;
  } // @todo(i.olarewaju) consider whether or not this method should be exposed
  ;

  _proto.setAuthToken = function setAuthToken(token) {
    return this.uppy.getPlugin(this.pluginId).storage.setItem(this.tokenKey, token);
  };

  _proto.getAuthToken = function getAuthToken() {
    return this.uppy.getPlugin(this.pluginId).storage.getItem(this.tokenKey);
  };

  _proto.authUrl = function authUrl() {
    return this.hostname + "/" + this.id + "/connect";
  };

  _proto.fileUrl = function fileUrl(id) {
    return this.hostname + "/" + this.id + "/get/" + id;
  };

  _proto.list = function list(directory) {
    return this.get(this.id + "/list/" + (directory || ''));
  };

  _proto.logout = function logout() {
    var _this2 = this;

    return this.get(this.id + "/logout").then(function (response) {
      return Promise.all([response, _this2.uppy.getPlugin(_this2.pluginId).storage.removeItem(_this2.tokenKey)]);
    }).then(function (_ref2) {
      var response = _ref2[0];
      return response;
    });
  };

  Provider.initPlugin = function initPlugin(plugin, opts, defaultOpts) {
    plugin.type = 'acquirer';
    plugin.files = [];

    if (defaultOpts) {
      plugin.opts = _extends({}, defaultOpts, opts);
    }

    if (opts.serverUrl || opts.serverPattern) {
      throw new Error('`serverUrl` and `serverPattern` have been renamed to `companionUrl` and `companionAllowedHosts` respectively in the 0.30.5 release. Please consult the docs (for example, https://uppy.io/docs/instagram/ for the Instagram plugin) and use the updated options.`');
    }

    if (opts.companionAllowedHosts) {
      var pattern = opts.companionAllowedHosts; // validate companionAllowedHosts param

      if (typeof pattern !== 'string' && !Array.isArray(pattern) && !(pattern instanceof RegExp)) {
        throw new TypeError(plugin.id + ": the option \"companionAllowedHosts\" must be one of string, Array, RegExp");
      }

      plugin.opts.companionAllowedHosts = pattern;
    } else {
      // does not start with https://
      if (/^(?!https?:\/\/).*$/i.test(opts.companionUrl)) {
        plugin.opts.companionAllowedHosts = "https://" + opts.companionUrl.replace(/^\/\//, '');
      } else {
        plugin.opts.companionAllowedHosts = opts.companionUrl;
      }
    }

    plugin.storage = plugin.opts.storage || tokenStorage;
  };

  return Provider;
}(RequestClient);

},{"./RequestClient":18,"./tokenStorage":22}],18:[function(require,module,exports){
'use strict';

var _class, _temp;

function _extends() { _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

var AuthError = require('./AuthError');

var fetchWithNetworkError = require('./../../utils/lib/fetchWithNetworkError'); // Remove the trailing slash so we can always safely append /xyz.


function stripSlash(url) {
  return url.replace(/\/$/, '');
}

module.exports = (_temp = _class = /*#__PURE__*/function () {
  function RequestClient(uppy, opts) {
    this.uppy = uppy;
    this.opts = opts;
    this.onReceiveResponse = this.onReceiveResponse.bind(this);
    this.allowedHeaders = ['accept', 'content-type', 'uppy-auth-token'];
    this.preflightDone = false;
  }

  var _proto = RequestClient.prototype;

  _proto.headers = function headers() {
    var userHeaders = this.opts.companionHeaders || this.opts.serverHeaders || {};
    return Promise.resolve(_extends({}, this.defaultHeaders, userHeaders));
  };

  _proto._getPostResponseFunc = function _getPostResponseFunc(skip) {
    var _this = this;

    return function (response) {
      if (!skip) {
        return _this.onReceiveResponse(response);
      }

      return response;
    };
  };

  _proto.onReceiveResponse = function onReceiveResponse(response) {
    var state = this.uppy.getState();
    var companion = state.companion || {};
    var host = this.opts.companionUrl;
    var headers = response.headers; // Store the self-identified domain name for the Companion instance we just hit.

    if (headers.has('i-am') && headers.get('i-am') !== companion[host]) {
      var _extends2;

      this.uppy.setState({
        companion: _extends({}, companion, (_extends2 = {}, _extends2[host] = headers.get('i-am'), _extends2))
      });
    }

    return response;
  };

  _proto._getUrl = function _getUrl(url) {
    if (/^(https?:|)\/\//.test(url)) {
      return url;
    }

    return this.hostname + "/" + url;
  };

  _proto._json = function _json(res) {
    if (res.status === 401) {
      throw new AuthError();
    }

    if (res.status < 200 || res.status > 300) {
      var errMsg = "Failed request with status: " + res.status + ". " + res.statusText;
      return res.json().then(function (errData) {
        errMsg = errData.message ? errMsg + " message: " + errData.message : errMsg;
        errMsg = errData.requestId ? errMsg + " request-Id: " + errData.requestId : errMsg;
        throw new Error(errMsg);
      }).catch(function () {
        throw new Error(errMsg);
      });
    }

    return res.json();
  };

  _proto.preflight = function preflight(path) {
    var _this2 = this;

    if (this.preflightDone) {
      return Promise.resolve(this.allowedHeaders.slice());
    }

    return fetch(this._getUrl(path), {
      method: 'OPTIONS'
    }).then(function (response) {
      if (response.headers.has('access-control-allow-headers')) {
        _this2.allowedHeaders = response.headers.get('access-control-allow-headers').split(',').map(function (headerName) {
          return headerName.trim().toLowerCase();
        });
      }

      _this2.preflightDone = true;
      return _this2.allowedHeaders.slice();
    }).catch(function (err) {
      _this2.uppy.log("[CompanionClient] unable to make preflight request " + err, 'warning');

      _this2.preflightDone = true;
      return _this2.allowedHeaders.slice();
    });
  };

  _proto.preflightAndHeaders = function preflightAndHeaders(path) {
    var _this3 = this;

    return Promise.all([this.preflight(path), this.headers()]).then(function (_ref) {
      var allowedHeaders = _ref[0],
          headers = _ref[1];
      // filter to keep only allowed Headers
      Object.keys(headers).forEach(function (header) {
        if (allowedHeaders.indexOf(header.toLowerCase()) === -1) {
          _this3.uppy.log("[CompanionClient] excluding unallowed header " + header);

          delete headers[header];
        }
      });
      return headers;
    });
  };

  _proto.get = function get(path, skipPostResponse) {
    var _this4 = this;

    return this.preflightAndHeaders(path).then(function (headers) {
      return fetchWithNetworkError(_this4._getUrl(path), {
        method: 'get',
        headers: headers,
        credentials: 'same-origin'
      });
    }).then(this._getPostResponseFunc(skipPostResponse)).then(function (res) {
      return _this4._json(res);
    }).catch(function (err) {
      err = err.isAuthError ? err : new Error("Could not get " + _this4._getUrl(path) + ". " + err);
      return Promise.reject(err);
    });
  };

  _proto.post = function post(path, data, skipPostResponse) {
    var _this5 = this;

    return this.preflightAndHeaders(path).then(function (headers) {
      return fetchWithNetworkError(_this5._getUrl(path), {
        method: 'post',
        headers: headers,
        credentials: 'same-origin',
        body: JSON.stringify(data)
      });
    }).then(this._getPostResponseFunc(skipPostResponse)).then(function (res) {
      return _this5._json(res);
    }).catch(function (err) {
      err = err.isAuthError ? err : new Error("Could not post " + _this5._getUrl(path) + ". " + err);
      return Promise.reject(err);
    });
  };

  _proto.delete = function _delete(path, data, skipPostResponse) {
    var _this6 = this;

    return this.preflightAndHeaders(path).then(function (headers) {
      return fetchWithNetworkError(_this6.hostname + "/" + path, {
        method: 'delete',
        headers: headers,
        credentials: 'same-origin',
        body: data ? JSON.stringify(data) : null
      });
    }).then(this._getPostResponseFunc(skipPostResponse)).then(function (res) {
      return _this6._json(res);
    }).catch(function (err) {
      err = err.isAuthError ? err : new Error("Could not delete " + _this6._getUrl(path) + ". " + err);
      return Promise.reject(err);
    });
  };

  _createClass(RequestClient, [{
    key: "hostname",
    get: function get() {
      var _this$uppy$getState = this.uppy.getState(),
          companion = _this$uppy$getState.companion;

      var host = this.opts.companionUrl;
      return stripSlash(companion && companion[host] ? companion[host] : host);
    }
  }, {
    key: "defaultHeaders",
    get: function get() {
      return {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        'Uppy-Versions': "@uppy/companion-client=" + RequestClient.VERSION
      };
    }
  }]);

  return RequestClient;
}(), _class.VERSION = require('../package.json').version, _temp);

},{"../package.json":15,"./../../utils/lib/fetchWithNetworkError":40,"./AuthError":16}],19:[function(require,module,exports){
'use strict';

function _inheritsLoose(subClass, superClass) { subClass.prototype = Object.create(superClass.prototype); subClass.prototype.constructor = subClass; subClass.__proto__ = superClass; }

var RequestClient = require('./RequestClient');

var _getName = function _getName(id) {
  return id.split('-').map(function (s) {
    return s.charAt(0).toUpperCase() + s.slice(1);
  }).join(' ');
};

module.exports = /*#__PURE__*/function (_RequestClient) {
  _inheritsLoose(SearchProvider, _RequestClient);

  function SearchProvider(uppy, opts) {
    var _this;

    _this = _RequestClient.call(this, uppy, opts) || this;
    _this.provider = opts.provider;
    _this.id = _this.provider;
    _this.name = _this.opts.name || _getName(_this.id);
    _this.pluginId = _this.opts.pluginId;
    return _this;
  }

  var _proto = SearchProvider.prototype;

  _proto.fileUrl = function fileUrl(id) {
    return this.hostname + "/search/" + this.id + "/get/" + id;
  };

  _proto.search = function search(text, queries) {
    queries = queries ? "&" + queries : '';
    return this.get("search/" + this.id + "/list?q=" + encodeURIComponent(text) + queries);
  };

  return SearchProvider;
}(RequestClient);

},{"./RequestClient":18}],20:[function(require,module,exports){
var ee = require('namespace-emitter');

module.exports = /*#__PURE__*/function () {
  function UppySocket(opts) {
    this.opts = opts;
    this._queued = [];
    this.isOpen = false;
    this.emitter = ee();
    this._handleMessage = this._handleMessage.bind(this);
    this.close = this.close.bind(this);
    this.emit = this.emit.bind(this);
    this.on = this.on.bind(this);
    this.once = this.once.bind(this);
    this.send = this.send.bind(this);

    if (!opts || opts.autoOpen !== false) {
      this.open();
    }
  }

  var _proto = UppySocket.prototype;

  _proto.open = function open() {
    var _this = this;

    this.socket = new WebSocket(this.opts.target);

    this.socket.onopen = function (e) {
      _this.isOpen = true;

      while (_this._queued.length > 0 && _this.isOpen) {
        var first = _this._queued[0];

        _this.send(first.action, first.payload);

        _this._queued = _this._queued.slice(1);
      }
    };

    this.socket.onclose = function (e) {
      _this.isOpen = false;
    };

    this.socket.onmessage = this._handleMessage;
  };

  _proto.close = function close() {
    if (this.socket) {
      this.socket.close();
    }
  };

  _proto.send = function send(action, payload) {
    // attach uuid
    if (!this.isOpen) {
      this._queued.push({
        action: action,
        payload: payload
      });

      return;
    }

    this.socket.send(JSON.stringify({
      action: action,
      payload: payload
    }));
  };

  _proto.on = function on(action, handler) {
    this.emitter.on(action, handler);
  };

  _proto.emit = function emit(action, payload) {
    this.emitter.emit(action, payload);
  };

  _proto.once = function once(action, handler) {
    this.emitter.once(action, handler);
  };

  _proto._handleMessage = function _handleMessage(e) {
    try {
      var message = JSON.parse(e.data);
      this.emit(message.action, message.payload);
    } catch (err) {
      console.log(err);
    }
  };

  return UppySocket;
}();

},{"namespace-emitter":10}],21:[function(require,module,exports){
'use strict';
/**
 * Manages communications with Companion
 */

var RequestClient = require('./RequestClient');

var Provider = require('./Provider');

var SearchProvider = require('./SearchProvider');

var Socket = require('./Socket');

module.exports = {
  RequestClient: RequestClient,
  Provider: Provider,
  SearchProvider: SearchProvider,
  Socket: Socket
};

},{"./Provider":17,"./RequestClient":18,"./SearchProvider":19,"./Socket":20}],22:[function(require,module,exports){
'use strict';
/**
 * This module serves as an Async wrapper for LocalStorage
 */

module.exports.setItem = function (key, value) {
  return new Promise(function (resolve) {
    localStorage.setItem(key, value);
    resolve();
  });
};

module.exports.getItem = function (key) {
  return Promise.resolve(localStorage.getItem(key));
};

module.exports.removeItem = function (key) {
  return new Promise(function (resolve) {
    localStorage.removeItem(key);
    resolve();
  });
};

},{}],23:[function(require,module,exports){
module.exports={
  "name": "@uppy/core",
  "description": "Core module for the extensible JavaScript file upload widget with support for drag&drop, resumable uploads, previews, restrictions, file processing/encoding, remote providers like Instagram, Dropbox, Google Drive, S3 and more :dog:",
  "version": "1.13.3",
  "license": "MIT",
  "main": "lib/index.js",
  "style": "dist/style.min.css",
  "types": "types/index.d.ts",
  "keywords": [
    "file uploader",
    "uppy",
    "uppy-plugin"
  ],
  "homepage": "https://uppy.io",
  "bugs": {
    "url": "https://github.com/transloadit/uppy/issues"
  },
  "repository": {
    "type": "git",
    "url": "git+https://github.com/transloadit/uppy.git"
  },
  "dependencies": {
    "@transloadit/prettier-bytes": "0.0.7",
    "@uppy/store-default": "file:../store-default",
    "@uppy/utils": "file:../utils",
    "cuid": "^2.1.1",
    "lodash.throttle": "^4.1.1",
    "mime-match": "^1.0.2",
    "namespace-emitter": "^2.0.1",
    "preact": "8.2.9"
  }
}

},{}],24:[function(require,module,exports){
function _extends() { _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }

var preact = require('preact');

var findDOMElement = require('./../../utils/lib/findDOMElement');
/**
 * Defer a frequent call to the microtask queue.
 */


function debounce(fn) {
  var calling = null;
  var latestArgs = null;
  return function () {
    for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    latestArgs = args;

    if (!calling) {
      calling = Promise.resolve().then(function () {
        calling = null; // At this point `args` may be different from the most
        // recent state, if multiple calls happened since this task
        // was queued. So we use the `latestArgs`, which definitely
        // is the most recent call.

        return fn.apply(void 0, latestArgs);
      });
    }

    return calling;
  };
}
/**
 * Boilerplate that all Plugins share - and should not be used
 * directly. It also shows which methods final plugins should implement/override,
 * this deciding on structure.
 *
 * @param {object} main Uppy core object
 * @param {object} object with plugin options
 * @returns {Array|string} files or success/fail message
 */


module.exports = /*#__PURE__*/function () {
  function Plugin(uppy, opts) {
    this.uppy = uppy;
    this.opts = opts || {};
    this.update = this.update.bind(this);
    this.mount = this.mount.bind(this);
    this.install = this.install.bind(this);
    this.uninstall = this.uninstall.bind(this);
  }

  var _proto = Plugin.prototype;

  _proto.getPluginState = function getPluginState() {
    var _this$uppy$getState = this.uppy.getState(),
        plugins = _this$uppy$getState.plugins;

    return plugins[this.id] || {};
  };

  _proto.setPluginState = function setPluginState(update) {
    var _extends2;

    var _this$uppy$getState2 = this.uppy.getState(),
        plugins = _this$uppy$getState2.plugins;

    this.uppy.setState({
      plugins: _extends({}, plugins, (_extends2 = {}, _extends2[this.id] = _extends({}, plugins[this.id], update), _extends2))
    });
  };

  _proto.setOptions = function setOptions(newOpts) {
    this.opts = _extends({}, this.opts, newOpts);
    this.setPluginState(); // so that UI re-renders with new options
  };

  _proto.update = function update(state) {
    if (typeof this.el === 'undefined') {
      return;
    }

    if (this._updateUI) {
      this._updateUI(state);
    }
  } // Called after every state update, after everything's mounted. Debounced.
  ;

  _proto.afterUpdate = function afterUpdate() {}
  /**
   * Called when plugin is mounted, whether in DOM or into another plugin.
   * Needed because sometimes plugins are mounted separately/after `install`,
   * so this.el and this.parent might not be available in `install`.
   * This is the case with @uppy/react plugins, for example.
   */
  ;

  _proto.onMount = function onMount() {}
  /**
   * Check if supplied `target` is a DOM element or an `object`.
   * If it’s an object — target is a plugin, and we search `plugins`
   * for a plugin with same name and return its target.
   *
   * @param {string|object} target
   *
   */
  ;

  _proto.mount = function mount(target, plugin) {
    var _this = this;

    var callerPluginName = plugin.id;
    var targetElement = findDOMElement(target);

    if (targetElement) {
      this.isTargetDOMEl = true; // API for plugins that require a synchronous rerender.

      this.rerender = function (state) {
        // plugin could be removed, but this.rerender is debounced below,
        // so it could still be called even after uppy.removePlugin or uppy.close
        // hence the check
        if (!_this.uppy.getPlugin(_this.id)) return;
        _this.el = preact.render(_this.render(state), targetElement, _this.el);

        _this.afterUpdate();
      };

      this._updateUI = debounce(this.rerender);
      this.uppy.log("Installing " + callerPluginName + " to a DOM element '" + target + "'"); // clear everything inside the target container

      if (this.opts.replaceTargetContent) {
        targetElement.innerHTML = '';
      }

      this.el = preact.render(this.render(this.uppy.getState()), targetElement);
      this.onMount();
      return this.el;
    }

    var targetPlugin;

    if (typeof target === 'object' && target instanceof Plugin) {
      // Targeting a plugin *instance*
      targetPlugin = target;
    } else if (typeof target === 'function') {
      // Targeting a plugin type
      var Target = target; // Find the target plugin instance.

      this.uppy.iteratePlugins(function (plugin) {
        if (plugin instanceof Target) {
          targetPlugin = plugin;
          return false;
        }
      });
    }

    if (targetPlugin) {
      this.uppy.log("Installing " + callerPluginName + " to " + targetPlugin.id);
      this.parent = targetPlugin;
      this.el = targetPlugin.addTarget(plugin);
      this.onMount();
      return this.el;
    }

    this.uppy.log("Not installing " + callerPluginName);
    var message = "Invalid target option given to " + callerPluginName + ".";

    if (typeof target === 'function') {
      message += ' The given target is not a Plugin class. ' + 'Please check that you\'re not specifying a React Component instead of a plugin. ' + 'If you are using @uppy/* packages directly, make sure you have only 1 version of @uppy/core installed: ' + 'run `npm ls @uppy/core` on the command line and verify that all the versions match and are deduped correctly.';
    } else {
      message += 'If you meant to target an HTML element, please make sure that the element exists. ' + 'Check that the <script> tag initializing Uppy is right before the closing </body> tag at the end of the page. ' + '(see https://github.com/transloadit/uppy/issues/1042)\n\n' + 'If you meant to target a plugin, please confirm that your `import` statements or `require` calls are correct.';
    }

    throw new Error(message);
  };

  _proto.render = function render(state) {
    throw new Error('Extend the render method to add your plugin to a DOM element');
  };

  _proto.addTarget = function addTarget(plugin) {
    throw new Error('Extend the addTarget method to add your plugin to another plugin\'s target');
  };

  _proto.unmount = function unmount() {
    if (this.isTargetDOMEl && this.el && this.el.parentNode) {
      this.el.parentNode.removeChild(this.el);
    }
  };

  _proto.install = function install() {};

  _proto.uninstall = function uninstall() {
    this.unmount();
  };

  return Plugin;
}();

},{"./../../utils/lib/findDOMElement":41,"preact":11}],25:[function(require,module,exports){
function _extends() { _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _inheritsLoose(subClass, superClass) { subClass.prototype = Object.create(superClass.prototype); subClass.prototype.constructor = subClass; subClass.__proto__ = superClass; }

function _wrapNativeSuper(Class) { var _cache = typeof Map === "function" ? new Map() : undefined; _wrapNativeSuper = function _wrapNativeSuper(Class) { if (Class === null || !_isNativeFunction(Class)) return Class; if (typeof Class !== "function") { throw new TypeError("Super expression must either be null or a function"); } if (typeof _cache !== "undefined") { if (_cache.has(Class)) return _cache.get(Class); _cache.set(Class, Wrapper); } function Wrapper() { return _construct(Class, arguments, _getPrototypeOf(this).constructor); } Wrapper.prototype = Object.create(Class.prototype, { constructor: { value: Wrapper, enumerable: false, writable: true, configurable: true } }); return _setPrototypeOf(Wrapper, Class); }; return _wrapNativeSuper(Class); }

function _construct(Parent, args, Class) { if (_isNativeReflectConstruct()) { _construct = Reflect.construct; } else { _construct = function _construct(Parent, args, Class) { var a = [null]; a.push.apply(a, args); var Constructor = Function.bind.apply(Parent, a); var instance = new Constructor(); if (Class) _setPrototypeOf(instance, Class.prototype); return instance; }; } return _construct.apply(null, arguments); }

function _isNativeReflectConstruct() { if (typeof Reflect === "undefined" || !Reflect.construct) return false; if (Reflect.construct.sham) return false; if (typeof Proxy === "function") return true; try { Date.prototype.toString.call(Reflect.construct(Date, [], function () {})); return true; } catch (e) { return false; } }

function _isNativeFunction(fn) { return Function.toString.call(fn).indexOf("[native code]") !== -1; }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }

var Translator = require('./../../utils/lib/Translator');

var ee = require('namespace-emitter');

var cuid = require('cuid');

var throttle = require('lodash.throttle');

var prettierBytes = require('@transloadit/prettier-bytes');

var match = require('mime-match');

var DefaultStore = require('./../../store-default');

var getFileType = require('./../../utils/lib/getFileType');

var getFileNameAndExtension = require('./../../utils/lib/getFileNameAndExtension');

var generateFileID = require('./../../utils/lib/generateFileID');

var supportsUploadProgress = require('./supportsUploadProgress');

var _require = require('./loggers'),
    justErrorsLogger = _require.justErrorsLogger,
    debugLogger = _require.debugLogger;

var Plugin = require('./Plugin'); // Exported from here.


var RestrictionError = /*#__PURE__*/function (_Error) {
  _inheritsLoose(RestrictionError, _Error);

  function RestrictionError() {
    var _this;

    for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    _this = _Error.call.apply(_Error, [this].concat(args)) || this;
    _this.isRestriction = true;
    return _this;
  }

  return RestrictionError;
}( /*#__PURE__*/_wrapNativeSuper(Error));
/**
 * Uppy Core module.
 * Manages plugins, state updates, acts as an event bus,
 * adds/removes files and metadata.
 */


var Uppy = /*#__PURE__*/function () {
  /**
   * Instantiate Uppy
   *
   * @param {object} opts — Uppy options
   */
  function Uppy(opts) {
    var _this2 = this;

    this.defaultLocale = {
      strings: {
        addBulkFilesFailed: {
          0: 'Failed to add %{smart_count} file due to an internal error',
          1: 'Failed to add %{smart_count} files due to internal errors'
        },
        youCanOnlyUploadX: {
          0: 'You can only upload %{smart_count} file',
          1: 'You can only upload %{smart_count} files'
        },
        youHaveToAtLeastSelectX: {
          0: 'You have to select at least %{smart_count} file',
          1: 'You have to select at least %{smart_count} files'
        },
        // The default `exceedsSize2` string only combines the `exceedsSize` string (%{backwardsCompat}) with the size.
        // Locales can override `exceedsSize2` to specify a different word order. This is for backwards compat with
        // Uppy 1.9.x and below which did a naive concatenation of `exceedsSize2 + size` instead of using a locale-specific
        // substitution.
        // TODO: In 2.0 `exceedsSize2` should be removed in and `exceedsSize` updated to use substitution.
        exceedsSize2: '%{backwardsCompat} %{size}',
        exceedsSize: 'This file exceeds maximum allowed size of',
        inferiorSize: 'This file is smaller than the allowed size of %{size}',
        youCanOnlyUploadFileTypes: 'You can only upload: %{types}',
        noNewAlreadyUploading: 'Cannot add new files: already uploading',
        noDuplicates: 'Cannot add the duplicate file \'%{fileName}\', it already exists',
        companionError: 'Connection with Companion failed',
        companionUnauthorizeHint: 'To unauthorize to your %{provider} account, please go to %{url}',
        failedToUpload: 'Failed to upload %{file}',
        noInternetConnection: 'No Internet connection',
        connectedToInternet: 'Connected to the Internet',
        // Strings for remote providers
        noFilesFound: 'You have no files or folders here',
        selectX: {
          0: 'Select %{smart_count}',
          1: 'Select %{smart_count}'
        },
        selectAllFilesFromFolderNamed: 'Select all files from folder %{name}',
        unselectAllFilesFromFolderNamed: 'Unselect all files from folder %{name}',
        selectFileNamed: 'Select file %{name}',
        unselectFileNamed: 'Unselect file %{name}',
        openFolderNamed: 'Open folder %{name}',
        cancel: 'Cancel',
        logOut: 'Log out',
        filter: 'Filter',
        resetFilter: 'Reset filter',
        loading: 'Loading...',
        authenticateWithTitle: 'Please authenticate with %{pluginName} to select files',
        authenticateWith: 'Connect to %{pluginName}',
        searchImages: 'Search for images',
        enterTextToSearch: 'Enter text to search for images',
        backToSearch: 'Back to Search',
        emptyFolderAdded: 'No files were added from empty folder',
        folderAdded: {
          0: 'Added %{smart_count} file from %{folder}',
          1: 'Added %{smart_count} files from %{folder}'
        }
      }
    };
    var defaultOptions = {
      id: 'uppy',
      autoProceed: false,
      allowMultipleUploads: true,
      debug: false,
      restrictions: {
        maxFileSize: null,
        minFileSize: null,
        maxTotalFileSize: null,
        maxNumberOfFiles: null,
        minNumberOfFiles: null,
        allowedFileTypes: null
      },
      meta: {},
      onBeforeFileAdded: function onBeforeFileAdded(currentFile, files) {
        return currentFile;
      },
      onBeforeUpload: function onBeforeUpload(files) {
        return files;
      },
      store: DefaultStore(),
      logger: justErrorsLogger
    }; // Merge default options with the ones set by user,
    // making sure to merge restrictions too

    this.opts = _extends({}, defaultOptions, opts, {
      restrictions: _extends({}, defaultOptions.restrictions, opts && opts.restrictions)
    }); // Support debug: true for backwards-compatability, unless logger is set in opts
    // opts instead of this.opts to avoid comparing objects — we set logger: justErrorsLogger in defaultOptions

    if (opts && opts.logger && opts.debug) {
      this.log('You are using a custom `logger`, but also set `debug: true`, which uses built-in logger to output logs to console. Ignoring `debug: true` and using your custom `logger`.', 'warning');
    } else if (opts && opts.debug) {
      this.opts.logger = debugLogger;
    }

    this.log("Using Core v" + this.constructor.VERSION);

    if (this.opts.restrictions.allowedFileTypes && this.opts.restrictions.allowedFileTypes !== null && !Array.isArray(this.opts.restrictions.allowedFileTypes)) {
      throw new TypeError('`restrictions.allowedFileTypes` must be an array');
    }

    this.i18nInit(); // Container for different types of plugins

    this.plugins = {};
    this.getState = this.getState.bind(this);
    this.getPlugin = this.getPlugin.bind(this);
    this.setFileMeta = this.setFileMeta.bind(this);
    this.setFileState = this.setFileState.bind(this);
    this.log = this.log.bind(this);
    this.info = this.info.bind(this);
    this.hideInfo = this.hideInfo.bind(this);
    this.addFile = this.addFile.bind(this);
    this.removeFile = this.removeFile.bind(this);
    this.pauseResume = this.pauseResume.bind(this); // ___Why throttle at 500ms?
    //    - We must throttle at >250ms for superfocus in Dashboard to work well (because animation takes 0.25s, and we want to wait for all animations to be over before refocusing).
    //    [Practical Check]: if thottle is at 100ms, then if you are uploading a file, and click 'ADD MORE FILES', - focus won't activate in Firefox.
    //    - We must throttle at around >500ms to avoid performance lags.
    //    [Practical Check] Firefox, try to upload a big file for a prolonged period of time. Laptop will start to heat up.

    this._calculateProgress = throttle(this._calculateProgress.bind(this), 500, {
      leading: true,
      trailing: true
    });
    this.updateOnlineStatus = this.updateOnlineStatus.bind(this);
    this.resetProgress = this.resetProgress.bind(this);
    this.pauseAll = this.pauseAll.bind(this);
    this.resumeAll = this.resumeAll.bind(this);
    this.retryAll = this.retryAll.bind(this);
    this.cancelAll = this.cancelAll.bind(this);
    this.retryUpload = this.retryUpload.bind(this);
    this.upload = this.upload.bind(this);
    this.emitter = ee();
    this.on = this.on.bind(this);
    this.off = this.off.bind(this);
    this.once = this.emitter.once.bind(this.emitter);
    this.emit = this.emitter.emit.bind(this.emitter);
    this.preProcessors = [];
    this.uploaders = [];
    this.postProcessors = [];
    this.store = this.opts.store;
    this.setState({
      plugins: {},
      files: {},
      currentUploads: {},
      allowNewUpload: true,
      capabilities: {
        uploadProgress: supportsUploadProgress(),
        individualCancellation: true,
        resumableUploads: false
      },
      totalProgress: 0,
      meta: _extends({}, this.opts.meta),
      info: {
        isHidden: true,
        type: 'info',
        message: ''
      }
    });
    this._storeUnsubscribe = this.store.subscribe(function (prevState, nextState, patch) {
      _this2.emit('state-update', prevState, nextState, patch);

      _this2.updateAll(nextState);
    }); // Exposing uppy object on window for debugging and testing

    if (this.opts.debug && typeof window !== 'undefined') {
      window[this.opts.id] = this;
    }

    this._addListeners(); // Re-enable if we’ll need some capabilities on boot, like isMobileDevice
    // this._setCapabilities()

  } // _setCapabilities = () => {
  //   const capabilities = {
  //     isMobileDevice: isMobileDevice()
  //   }
  //   this.setState({
  //     ...this.getState().capabilities,
  //     capabilities
  //   })
  // }


  var _proto = Uppy.prototype;

  _proto.on = function on(event, callback) {
    this.emitter.on(event, callback);
    return this;
  };

  _proto.off = function off(event, callback) {
    this.emitter.off(event, callback);
    return this;
  }
  /**
   * Iterate on all plugins and run `update` on them.
   * Called each time state changes.
   *
   */
  ;

  _proto.updateAll = function updateAll(state) {
    this.iteratePlugins(function (plugin) {
      plugin.update(state);
    });
  }
  /**
   * Updates state with a patch
   *
   * @param {object} patch {foo: 'bar'}
   */
  ;

  _proto.setState = function setState(patch) {
    this.store.setState(patch);
  }
  /**
   * Returns current state.
   *
   * @returns {object}
   */
  ;

  _proto.getState = function getState() {
    return this.store.getState();
  }
  /**
   * Back compat for when uppy.state is used instead of uppy.getState().
   */
  ;

  /**
   * Shorthand to set state for a specific file.
   */
  _proto.setFileState = function setFileState(fileID, state) {
    var _extends2;

    if (!this.getState().files[fileID]) {
      throw new Error("Can\u2019t set state for " + fileID + " (the file could have been removed)");
    }

    this.setState({
      files: _extends({}, this.getState().files, (_extends2 = {}, _extends2[fileID] = _extends({}, this.getState().files[fileID], state), _extends2))
    });
  };

  _proto.i18nInit = function i18nInit() {
    this.translator = new Translator([this.defaultLocale, this.opts.locale]);
    this.locale = this.translator.locale;
    this.i18n = this.translator.translate.bind(this.translator);
    this.i18nArray = this.translator.translateArray.bind(this.translator);
  };

  _proto.setOptions = function setOptions(newOpts) {
    this.opts = _extends({}, this.opts, newOpts, {
      restrictions: _extends({}, this.opts.restrictions, newOpts && newOpts.restrictions)
    });

    if (newOpts.meta) {
      this.setMeta(newOpts.meta);
    }

    this.i18nInit();

    if (newOpts.locale) {
      this.iteratePlugins(function (plugin) {
        plugin.setOptions();
      });
    }

    this.setState(); // so that UI re-renders with new options
  };

  _proto.resetProgress = function resetProgress() {
    var defaultProgress = {
      percentage: 0,
      bytesUploaded: 0,
      uploadComplete: false,
      uploadStarted: null
    };

    var files = _extends({}, this.getState().files);

    var updatedFiles = {};
    Object.keys(files).forEach(function (fileID) {
      var updatedFile = _extends({}, files[fileID]);

      updatedFile.progress = _extends({}, updatedFile.progress, defaultProgress);
      updatedFiles[fileID] = updatedFile;
    });
    this.setState({
      files: updatedFiles,
      totalProgress: 0
    });
    this.emit('reset-progress');
  };

  _proto.addPreProcessor = function addPreProcessor(fn) {
    this.preProcessors.push(fn);
  };

  _proto.removePreProcessor = function removePreProcessor(fn) {
    var i = this.preProcessors.indexOf(fn);

    if (i !== -1) {
      this.preProcessors.splice(i, 1);
    }
  };

  _proto.addPostProcessor = function addPostProcessor(fn) {
    this.postProcessors.push(fn);
  };

  _proto.removePostProcessor = function removePostProcessor(fn) {
    var i = this.postProcessors.indexOf(fn);

    if (i !== -1) {
      this.postProcessors.splice(i, 1);
    }
  };

  _proto.addUploader = function addUploader(fn) {
    this.uploaders.push(fn);
  };

  _proto.removeUploader = function removeUploader(fn) {
    var i = this.uploaders.indexOf(fn);

    if (i !== -1) {
      this.uploaders.splice(i, 1);
    }
  };

  _proto.setMeta = function setMeta(data) {
    var updatedMeta = _extends({}, this.getState().meta, data);

    var updatedFiles = _extends({}, this.getState().files);

    Object.keys(updatedFiles).forEach(function (fileID) {
      updatedFiles[fileID] = _extends({}, updatedFiles[fileID], {
        meta: _extends({}, updatedFiles[fileID].meta, data)
      });
    });
    this.log('Adding metadata:');
    this.log(data);
    this.setState({
      meta: updatedMeta,
      files: updatedFiles
    });
  };

  _proto.setFileMeta = function setFileMeta(fileID, data) {
    var updatedFiles = _extends({}, this.getState().files);

    if (!updatedFiles[fileID]) {
      this.log('Was trying to set metadata for a file that has been removed: ', fileID);
      return;
    }

    var newMeta = _extends({}, updatedFiles[fileID].meta, data);

    updatedFiles[fileID] = _extends({}, updatedFiles[fileID], {
      meta: newMeta
    });
    this.setState({
      files: updatedFiles
    });
  }
  /**
   * Get a file object.
   *
   * @param {string} fileID The ID of the file object to return.
   */
  ;

  _proto.getFile = function getFile(fileID) {
    return this.getState().files[fileID];
  }
  /**
   * Get all files in an array.
   */
  ;

  _proto.getFiles = function getFiles() {
    var _this$getState = this.getState(),
        files = _this$getState.files;

    return Object.keys(files).map(function (fileID) {
      return files[fileID];
    });
  }
  /**
   * Check if minNumberOfFiles restriction is reached before uploading.
   *
   * @private
   */
  ;

  _proto._checkMinNumberOfFiles = function _checkMinNumberOfFiles(files) {
    var minNumberOfFiles = this.opts.restrictions.minNumberOfFiles;

    if (Object.keys(files).length < minNumberOfFiles) {
      throw new RestrictionError("" + this.i18n('youHaveToAtLeastSelectX', {
        smart_count: minNumberOfFiles
      }));
    }
  }
  /**
   * Check if file passes a set of restrictions set in options: maxFileSize, minFileSize,
   * maxNumberOfFiles and allowedFileTypes.
   *
   * @param {object} files Object of IDs → files already added
   * @param {object} file object to check
   * @private
   */
  ;

  _proto._checkRestrictions = function _checkRestrictions(files, file) {
    var _this$opts$restrictio = this.opts.restrictions,
        maxFileSize = _this$opts$restrictio.maxFileSize,
        minFileSize = _this$opts$restrictio.minFileSize,
        maxTotalFileSize = _this$opts$restrictio.maxTotalFileSize,
        maxNumberOfFiles = _this$opts$restrictio.maxNumberOfFiles,
        allowedFileTypes = _this$opts$restrictio.allowedFileTypes;

    if (maxNumberOfFiles) {
      if (Object.keys(files).length + 1 > maxNumberOfFiles) {
        throw new RestrictionError("" + this.i18n('youCanOnlyUploadX', {
          smart_count: maxNumberOfFiles
        }));
      }
    }

    if (allowedFileTypes) {
      var isCorrectFileType = allowedFileTypes.some(function (type) {
        // is this is a mime-type
        if (type.indexOf('/') > -1) {
          if (!file.type) return false;
          return match(file.type.replace(/;.*?$/, ''), type);
        } // otherwise this is likely an extension


        if (type[0] === '.') {
          return file.extension.toLowerCase() === type.substr(1).toLowerCase();
        }

        return false;
      });

      if (!isCorrectFileType) {
        var allowedFileTypesString = allowedFileTypes.join(', ');
        throw new RestrictionError(this.i18n('youCanOnlyUploadFileTypes', {
          types: allowedFileTypesString
        }));
      }
    } // We can't check maxTotalFileSize if the size is unknown.


    if (maxTotalFileSize && file.data.size != null) {
      var totalFilesSize = 0;
      totalFilesSize += file.data.size;
      Object.keys(files).forEach(function (file) {
        totalFilesSize += files[file].data.size;
      });

      if (totalFilesSize > maxTotalFileSize) {
        throw new RestrictionError(this.i18n('exceedsSize2', {
          backwardsCompat: this.i18n('exceedsSize'),
          size: prettierBytes(maxTotalFileSize)
        }));
      }
    } // We can't check maxFileSize if the size is unknown.


    if (maxFileSize && file.data.size != null) {
      if (file.data.size > maxFileSize) {
        throw new RestrictionError(this.i18n('exceedsSize2', {
          backwardsCompat: this.i18n('exceedsSize'),
          size: prettierBytes(maxFileSize)
        }));
      }
    } // We can't check minFileSize if the size is unknown.


    if (minFileSize && file.data.size != null) {
      if (file.data.size < minFileSize) {
        throw new RestrictionError(this.i18n('inferiorSize', {
          size: prettierBytes(minFileSize)
        }));
      }
    }
  }
  /**
   * Logs an error, sets Informer message, then throws the error.
   * Emits a 'restriction-failed' event if it’s a restriction error
   *
   * @param {object | string} err — Error object or plain string message
   * @param {object} [options]
   * @param {boolean} [options.showInformer=true] — Sometimes developer might want to show Informer manually
   * @param {object} [options.file=null] — File object used to emit the restriction error
   * @param {boolean} [options.throwErr=true] — Errors shouldn’t be thrown, for example, in `upload-error` event
   * @private
   */
  ;

  _proto._showOrLogErrorAndThrow = function _showOrLogErrorAndThrow(err, _temp) {
    var _ref = _temp === void 0 ? {} : _temp,
        _ref$showInformer = _ref.showInformer,
        showInformer = _ref$showInformer === void 0 ? true : _ref$showInformer,
        _ref$file = _ref.file,
        file = _ref$file === void 0 ? null : _ref$file,
        _ref$throwErr = _ref.throwErr,
        throwErr = _ref$throwErr === void 0 ? true : _ref$throwErr;

    var message = typeof err === 'object' ? err.message : err;
    var details = typeof err === 'object' && err.details ? err.details : ''; // Restriction errors should be logged, but not as errors,
    // as they are expected and shown in the UI.

    var logMessageWithDetails = message;

    if (details) {
      logMessageWithDetails += ' ' + details;
    }

    if (err.isRestriction) {
      this.log(logMessageWithDetails);
      this.emit('restriction-failed', file, err);
    } else {
      this.log(logMessageWithDetails, 'error');
    } // Sometimes informer has to be shown manually by the developer,
    // for example, in `onBeforeFileAdded`.


    if (showInformer) {
      this.info({
        message: message,
        details: details
      }, 'error', 5000);
    }

    if (throwErr) {
      throw typeof err === 'object' ? err : new Error(err);
    }
  };

  _proto._assertNewUploadAllowed = function _assertNewUploadAllowed(file) {
    var _this$getState2 = this.getState(),
        allowNewUpload = _this$getState2.allowNewUpload;

    if (allowNewUpload === false) {
      this._showOrLogErrorAndThrow(new RestrictionError(this.i18n('noNewAlreadyUploading')), {
        file: file
      });
    }
  }
  /**
   * Create a file state object based on user-provided `addFile()` options.
   *
   * Note this is extremely side-effectful and should only be done when a file state object will be added to state immediately afterward!
   *
   * The `files` value is passed in because it may be updated by the caller without updating the store.
   */
  ;

  _proto._checkAndCreateFileStateObject = function _checkAndCreateFileStateObject(files, file) {
    var fileType = getFileType(file);
    file.type = fileType;
    var onBeforeFileAddedResult = this.opts.onBeforeFileAdded(file, files);

    if (onBeforeFileAddedResult === false) {
      // Don’t show UI info for this error, as it should be done by the developer
      this._showOrLogErrorAndThrow(new RestrictionError('Cannot add the file because onBeforeFileAdded returned false.'), {
        showInformer: false,
        file: file
      });
    }

    if (typeof onBeforeFileAddedResult === 'object' && onBeforeFileAddedResult) {
      file = onBeforeFileAddedResult;
    }

    var fileName;

    if (file.name) {
      fileName = file.name;
    } else if (fileType.split('/')[0] === 'image') {
      fileName = fileType.split('/')[0] + '.' + fileType.split('/')[1];
    } else {
      fileName = 'noname';
    }

    var fileExtension = getFileNameAndExtension(fileName).extension;
    var isRemote = file.isRemote || false;
    var fileID = generateFileID(file);

    if (files[fileID]) {
      this._showOrLogErrorAndThrow(new RestrictionError(this.i18n('noDuplicates', {
        fileName: fileName
      })), {
        file: file
      });
    }

    var meta = file.meta || {};
    meta.name = fileName;
    meta.type = fileType; // `null` means the size is unknown.

    var size = isFinite(file.data.size) ? file.data.size : null;
    var newFile = {
      source: file.source || '',
      id: fileID,
      name: fileName,
      extension: fileExtension || '',
      meta: _extends({}, this.getState().meta, meta),
      type: fileType,
      data: file.data,
      progress: {
        percentage: 0,
        bytesUploaded: 0,
        bytesTotal: size,
        uploadComplete: false,
        uploadStarted: null
      },
      size: size,
      isRemote: isRemote,
      remote: file.remote || '',
      preview: file.preview
    };

    try {
      this._checkRestrictions(files, newFile);
    } catch (err) {
      this._showOrLogErrorAndThrow(err, {
        file: newFile
      });
    }

    return newFile;
  } // Schedule an upload if `autoProceed` is enabled.
  ;

  _proto._startIfAutoProceed = function _startIfAutoProceed() {
    var _this3 = this;

    if (this.opts.autoProceed && !this.scheduledAutoProceed) {
      this.scheduledAutoProceed = setTimeout(function () {
        _this3.scheduledAutoProceed = null;

        _this3.upload().catch(function (err) {
          if (!err.isRestriction) {
            _this3.log(err.stack || err.message || err);
          }
        });
      }, 4);
    }
  }
  /**
   * Add a new file to `state.files`. This will run `onBeforeFileAdded`,
   * try to guess file type in a clever way, check file against restrictions,
   * and start an upload if `autoProceed === true`.
   *
   * @param {object} file object to add
   * @returns {string} id for the added file
   */
  ;

  _proto.addFile = function addFile(file) {
    var _extends3;

    this._assertNewUploadAllowed(file);

    var _this$getState3 = this.getState(),
        files = _this$getState3.files;

    var newFile = this._checkAndCreateFileStateObject(files, file);

    this.setState({
      files: _extends({}, files, (_extends3 = {}, _extends3[newFile.id] = newFile, _extends3))
    });
    this.emit('file-added', newFile);
    this.log("Added file: " + newFile.name + ", " + newFile.id + ", mime type: " + newFile.type);

    this._startIfAutoProceed();

    return newFile.id;
  }
  /**
   * Add multiple files to `state.files`. See the `addFile()` documentation.
   *
   * This cuts some corners for performance, so should typically only be used in cases where there may be a lot of files.
   *
   * If an error occurs while adding a file, it is logged and the user is notified. This is good for UI plugins, but not for programmatic use. Programmatic users should usually still use `addFile()` on individual files.
   */
  ;

  _proto.addFiles = function addFiles(fileDescriptors) {
    var _this4 = this;

    this._assertNewUploadAllowed(); // create a copy of the files object only once


    var files = _extends({}, this.getState().files);

    var newFiles = [];
    var errors = [];

    for (var i = 0; i < fileDescriptors.length; i++) {
      try {
        var newFile = this._checkAndCreateFileStateObject(files, fileDescriptors[i]);

        newFiles.push(newFile);
        files[newFile.id] = newFile;
      } catch (err) {
        if (!err.isRestriction) {
          errors.push(err);
        }
      }
    }

    this.setState({
      files: files
    });
    newFiles.forEach(function (newFile) {
      _this4.emit('file-added', newFile);
    });

    if (newFiles.length > 5) {
      this.log("Added batch of " + newFiles.length + " files");
    } else {
      Object.keys(newFiles).forEach(function (fileID) {
        _this4.log("Added file: " + newFiles[fileID].name + "\n id: " + newFiles[fileID].id + "\n type: " + newFiles[fileID].type);
      });
    }

    if (newFiles.length > 0) {
      this._startIfAutoProceed();
    }

    if (errors.length > 0) {
      var message = 'Multiple errors occurred while adding files:\n';
      errors.forEach(function (subError) {
        message += "\n * " + subError.message;
      });
      this.info({
        message: this.i18n('addBulkFilesFailed', {
          smart_count: errors.length
        }),
        details: message
      }, 'error', 5000);
      var err = new Error(message);
      err.errors = errors;
      throw err;
    }
  };

  _proto.removeFiles = function removeFiles(fileIDs, reason) {
    var _this5 = this;

    var _this$getState4 = this.getState(),
        files = _this$getState4.files,
        currentUploads = _this$getState4.currentUploads;

    var updatedFiles = _extends({}, files);

    var updatedUploads = _extends({}, currentUploads);

    var removedFiles = Object.create(null);
    fileIDs.forEach(function (fileID) {
      if (files[fileID]) {
        removedFiles[fileID] = files[fileID];
        delete updatedFiles[fileID];
      }
    }); // Remove files from the `fileIDs` list in each upload.

    function fileIsNotRemoved(uploadFileID) {
      return removedFiles[uploadFileID] === undefined;
    }

    var uploadsToRemove = [];
    Object.keys(updatedUploads).forEach(function (uploadID) {
      var newFileIDs = currentUploads[uploadID].fileIDs.filter(fileIsNotRemoved); // Remove the upload if no files are associated with it anymore.

      if (newFileIDs.length === 0) {
        uploadsToRemove.push(uploadID);
        return;
      }

      updatedUploads[uploadID] = _extends({}, currentUploads[uploadID], {
        fileIDs: newFileIDs
      });
    });
    uploadsToRemove.forEach(function (uploadID) {
      delete updatedUploads[uploadID];
    });
    var stateUpdate = {
      currentUploads: updatedUploads,
      files: updatedFiles
    }; // If all files were removed - allow new uploads!

    if (Object.keys(updatedFiles).length === 0) {
      stateUpdate.allowNewUpload = true;
      stateUpdate.error = null;
    }

    this.setState(stateUpdate);

    this._calculateTotalProgress();

    var removedFileIDs = Object.keys(removedFiles);
    removedFileIDs.forEach(function (fileID) {
      _this5.emit('file-removed', removedFiles[fileID], reason);
    });

    if (removedFileIDs.length > 5) {
      this.log("Removed " + removedFileIDs.length + " files");
    } else {
      this.log("Removed files: " + removedFileIDs.join(', '));
    }
  };

  _proto.removeFile = function removeFile(fileID, reason) {
    if (reason === void 0) {
      reason = null;
    }

    this.removeFiles([fileID], reason);
  };

  _proto.pauseResume = function pauseResume(fileID) {
    if (!this.getState().capabilities.resumableUploads || this.getFile(fileID).uploadComplete) {
      return;
    }

    var wasPaused = this.getFile(fileID).isPaused || false;
    var isPaused = !wasPaused;
    this.setFileState(fileID, {
      isPaused: isPaused
    });
    this.emit('upload-pause', fileID, isPaused);
    return isPaused;
  };

  _proto.pauseAll = function pauseAll() {
    var updatedFiles = _extends({}, this.getState().files);

    var inProgressUpdatedFiles = Object.keys(updatedFiles).filter(function (file) {
      return !updatedFiles[file].progress.uploadComplete && updatedFiles[file].progress.uploadStarted;
    });
    inProgressUpdatedFiles.forEach(function (file) {
      var updatedFile = _extends({}, updatedFiles[file], {
        isPaused: true
      });

      updatedFiles[file] = updatedFile;
    });
    this.setState({
      files: updatedFiles
    });
    this.emit('pause-all');
  };

  _proto.resumeAll = function resumeAll() {
    var updatedFiles = _extends({}, this.getState().files);

    var inProgressUpdatedFiles = Object.keys(updatedFiles).filter(function (file) {
      return !updatedFiles[file].progress.uploadComplete && updatedFiles[file].progress.uploadStarted;
    });
    inProgressUpdatedFiles.forEach(function (file) {
      var updatedFile = _extends({}, updatedFiles[file], {
        isPaused: false,
        error: null
      });

      updatedFiles[file] = updatedFile;
    });
    this.setState({
      files: updatedFiles
    });
    this.emit('resume-all');
  };

  _proto.retryAll = function retryAll() {
    var updatedFiles = _extends({}, this.getState().files);

    var filesToRetry = Object.keys(updatedFiles).filter(function (file) {
      return updatedFiles[file].error;
    });
    filesToRetry.forEach(function (file) {
      var updatedFile = _extends({}, updatedFiles[file], {
        isPaused: false,
        error: null
      });

      updatedFiles[file] = updatedFile;
    });
    this.setState({
      files: updatedFiles,
      error: null
    });
    this.emit('retry-all', filesToRetry);

    if (filesToRetry.length === 0) {
      return Promise.resolve({
        successful: [],
        failed: []
      });
    }

    var uploadID = this._createUpload(filesToRetry, {
      forceAllowNewUpload: true // create new upload even if allowNewUpload: false

    });

    return this._runUpload(uploadID);
  };

  _proto.cancelAll = function cancelAll() {
    this.emit('cancel-all');

    var _this$getState5 = this.getState(),
        files = _this$getState5.files;

    var fileIDs = Object.keys(files);

    if (fileIDs.length) {
      this.removeFiles(fileIDs, 'cancel-all');
    }

    this.setState({
      totalProgress: 0,
      error: null
    });
  };

  _proto.retryUpload = function retryUpload(fileID) {
    this.setFileState(fileID, {
      error: null,
      isPaused: false
    });
    this.emit('upload-retry', fileID);

    var uploadID = this._createUpload([fileID], {
      forceAllowNewUpload: true // create new upload even if allowNewUpload: false

    });

    return this._runUpload(uploadID);
  };

  _proto.reset = function reset() {
    this.cancelAll();
  };

  _proto._calculateProgress = function _calculateProgress(file, data) {
    if (!this.getFile(file.id)) {
      this.log("Not setting progress for a file that has been removed: " + file.id);
      return;
    } // bytesTotal may be null or zero; in that case we can't divide by it


    var canHavePercentage = isFinite(data.bytesTotal) && data.bytesTotal > 0;
    this.setFileState(file.id, {
      progress: _extends({}, this.getFile(file.id).progress, {
        bytesUploaded: data.bytesUploaded,
        bytesTotal: data.bytesTotal,
        percentage: canHavePercentage // TODO(goto-bus-stop) flooring this should probably be the choice of the UI?
        // we get more accurate calculations if we don't round this at all.
        ? Math.round(data.bytesUploaded / data.bytesTotal * 100) : 0
      })
    });

    this._calculateTotalProgress();
  };

  _proto._calculateTotalProgress = function _calculateTotalProgress() {
    // calculate total progress, using the number of files currently uploading,
    // multiplied by 100 and the summ of individual progress of each file
    var files = this.getFiles();
    var inProgress = files.filter(function (file) {
      return file.progress.uploadStarted || file.progress.preprocess || file.progress.postprocess;
    });

    if (inProgress.length === 0) {
      this.emit('progress', 0);
      this.setState({
        totalProgress: 0
      });
      return;
    }

    var sizedFiles = inProgress.filter(function (file) {
      return file.progress.bytesTotal != null;
    });
    var unsizedFiles = inProgress.filter(function (file) {
      return file.progress.bytesTotal == null;
    });

    if (sizedFiles.length === 0) {
      var progressMax = inProgress.length * 100;
      var currentProgress = unsizedFiles.reduce(function (acc, file) {
        return acc + file.progress.percentage;
      }, 0);

      var _totalProgress = Math.round(currentProgress / progressMax * 100);

      this.setState({
        totalProgress: _totalProgress
      });
      return;
    }

    var totalSize = sizedFiles.reduce(function (acc, file) {
      return acc + file.progress.bytesTotal;
    }, 0);
    var averageSize = totalSize / sizedFiles.length;
    totalSize += averageSize * unsizedFiles.length;
    var uploadedSize = 0;
    sizedFiles.forEach(function (file) {
      uploadedSize += file.progress.bytesUploaded;
    });
    unsizedFiles.forEach(function (file) {
      uploadedSize += averageSize * (file.progress.percentage || 0) / 100;
    });
    var totalProgress = totalSize === 0 ? 0 : Math.round(uploadedSize / totalSize * 100); // hot fix, because:
    // uploadedSize ended up larger than totalSize, resulting in 1325% total

    if (totalProgress > 100) {
      totalProgress = 100;
    }

    this.setState({
      totalProgress: totalProgress
    });
    this.emit('progress', totalProgress);
  }
  /**
   * Registers listeners for all global actions, like:
   * `error`, `file-removed`, `upload-progress`
   */
  ;

  _proto._addListeners = function _addListeners() {
    var _this6 = this;

    this.on('error', function (error) {
      var errorMsg = 'Unknown error';

      if (error.message) {
        errorMsg = error.message;
      }

      if (error.details) {
        errorMsg += ' ' + error.details;
      }

      _this6.setState({
        error: errorMsg
      });
    });
    this.on('upload-error', function (file, error, response) {
      var errorMsg = 'Unknown error';

      if (error.message) {
        errorMsg = error.message;
      }

      if (error.details) {
        errorMsg += ' ' + error.details;
      }

      _this6.setFileState(file.id, {
        error: errorMsg,
        response: response
      });

      _this6.setState({
        error: error.message
      });

      if (typeof error === 'object' && error.message) {
        var newError = new Error(error.message);
        newError.details = error.message;

        if (error.details) {
          newError.details += ' ' + error.details;
        }

        newError.message = _this6.i18n('failedToUpload', {
          file: file.name
        });

        _this6._showOrLogErrorAndThrow(newError, {
          throwErr: false
        });
      } else {
        _this6._showOrLogErrorAndThrow(error, {
          throwErr: false
        });
      }
    });
    this.on('upload', function () {
      _this6.setState({
        error: null
      });
    });
    this.on('upload-started', function (file, upload) {
      if (!_this6.getFile(file.id)) {
        _this6.log("Not setting progress for a file that has been removed: " + file.id);

        return;
      }

      _this6.setFileState(file.id, {
        progress: {
          uploadStarted: Date.now(),
          uploadComplete: false,
          percentage: 0,
          bytesUploaded: 0,
          bytesTotal: file.size
        }
      });
    });
    this.on('upload-progress', this._calculateProgress);
    this.on('upload-success', function (file, uploadResp) {
      if (!_this6.getFile(file.id)) {
        _this6.log("Not setting progress for a file that has been removed: " + file.id);

        return;
      }

      var currentProgress = _this6.getFile(file.id).progress;

      _this6.setFileState(file.id, {
        progress: _extends({}, currentProgress, {
          postprocess: _this6.postProcessors.length > 0 ? {
            mode: 'indeterminate'
          } : null,
          uploadComplete: true,
          percentage: 100,
          bytesUploaded: currentProgress.bytesTotal
        }),
        response: uploadResp,
        uploadURL: uploadResp.uploadURL,
        isPaused: false
      });

      _this6._calculateTotalProgress();
    });
    this.on('preprocess-progress', function (file, progress) {
      if (!_this6.getFile(file.id)) {
        _this6.log("Not setting progress for a file that has been removed: " + file.id);

        return;
      }

      _this6.setFileState(file.id, {
        progress: _extends({}, _this6.getFile(file.id).progress, {
          preprocess: progress
        })
      });
    });
    this.on('preprocess-complete', function (file) {
      if (!_this6.getFile(file.id)) {
        _this6.log("Not setting progress for a file that has been removed: " + file.id);

        return;
      }

      var files = _extends({}, _this6.getState().files);

      files[file.id] = _extends({}, files[file.id], {
        progress: _extends({}, files[file.id].progress)
      });
      delete files[file.id].progress.preprocess;

      _this6.setState({
        files: files
      });
    });
    this.on('postprocess-progress', function (file, progress) {
      if (!_this6.getFile(file.id)) {
        _this6.log("Not setting progress for a file that has been removed: " + file.id);

        return;
      }

      _this6.setFileState(file.id, {
        progress: _extends({}, _this6.getState().files[file.id].progress, {
          postprocess: progress
        })
      });
    });
    this.on('postprocess-complete', function (file) {
      if (!_this6.getFile(file.id)) {
        _this6.log("Not setting progress for a file that has been removed: " + file.id);

        return;
      }

      var files = _extends({}, _this6.getState().files);

      files[file.id] = _extends({}, files[file.id], {
        progress: _extends({}, files[file.id].progress)
      });
      delete files[file.id].progress.postprocess; // TODO should we set some kind of `fullyComplete` property on the file object
      // so it's easier to see that the file is upload…fully complete…rather than
      // what we have to do now (`uploadComplete && !postprocess`)

      _this6.setState({
        files: files
      });
    });
    this.on('restored', function () {
      // Files may have changed--ensure progress is still accurate.
      _this6._calculateTotalProgress();
    }); // show informer if offline

    if (typeof window !== 'undefined' && window.addEventListener) {
      window.addEventListener('online', function () {
        return _this6.updateOnlineStatus();
      });
      window.addEventListener('offline', function () {
        return _this6.updateOnlineStatus();
      });
      setTimeout(function () {
        return _this6.updateOnlineStatus();
      }, 3000);
    }
  };

  _proto.updateOnlineStatus = function updateOnlineStatus() {
    var online = typeof window.navigator.onLine !== 'undefined' ? window.navigator.onLine : true;

    if (!online) {
      this.emit('is-offline');
      this.info(this.i18n('noInternetConnection'), 'error', 0);
      this.wasOffline = true;
    } else {
      this.emit('is-online');

      if (this.wasOffline) {
        this.emit('back-online');
        this.info(this.i18n('connectedToInternet'), 'success', 3000);
        this.wasOffline = false;
      }
    }
  };

  _proto.getID = function getID() {
    return this.opts.id;
  }
  /**
   * Registers a plugin with Core.
   *
   * @param {object} Plugin object
   * @param {object} [opts] object with options to be passed to Plugin
   * @returns {object} self for chaining
   */
  ;

  _proto.use = function use(Plugin, opts) {
    if (typeof Plugin !== 'function') {
      var msg = "Expected a plugin class, but got " + (Plugin === null ? 'null' : typeof Plugin) + "." + ' Please verify that the plugin was imported and spelled correctly.';
      throw new TypeError(msg);
    } // Instantiate


    var plugin = new Plugin(this, opts);
    var pluginId = plugin.id;
    this.plugins[plugin.type] = this.plugins[plugin.type] || [];

    if (!pluginId) {
      throw new Error('Your plugin must have an id');
    }

    if (!plugin.type) {
      throw new Error('Your plugin must have a type');
    }

    var existsPluginAlready = this.getPlugin(pluginId);

    if (existsPluginAlready) {
      var _msg = "Already found a plugin named '" + existsPluginAlready.id + "'. " + ("Tried to use: '" + pluginId + "'.\n") + 'Uppy plugins must have unique `id` options. See https://uppy.io/docs/plugins/#id.';

      throw new Error(_msg);
    }

    if (Plugin.VERSION) {
      this.log("Using " + pluginId + " v" + Plugin.VERSION);
    }

    this.plugins[plugin.type].push(plugin);
    plugin.install();
    return this;
  }
  /**
   * Find one Plugin by name.
   *
   * @param {string} id plugin id
   * @returns {object|boolean}
   */
  ;

  _proto.getPlugin = function getPlugin(id) {
    var foundPlugin = null;
    this.iteratePlugins(function (plugin) {
      if (plugin.id === id) {
        foundPlugin = plugin;
        return false;
      }
    });
    return foundPlugin;
  }
  /**
   * Iterate through all `use`d plugins.
   *
   * @param {Function} method that will be run on each plugin
   */
  ;

  _proto.iteratePlugins = function iteratePlugins(method) {
    var _this7 = this;

    Object.keys(this.plugins).forEach(function (pluginType) {
      _this7.plugins[pluginType].forEach(method);
    });
  }
  /**
   * Uninstall and remove a plugin.
   *
   * @param {object} instance The plugin instance to remove.
   */
  ;

  _proto.removePlugin = function removePlugin(instance) {
    this.log("Removing plugin " + instance.id);
    this.emit('plugin-remove', instance);

    if (instance.uninstall) {
      instance.uninstall();
    }

    var list = this.plugins[instance.type].slice();
    var index = list.indexOf(instance);

    if (index !== -1) {
      list.splice(index, 1);
      this.plugins[instance.type] = list;
    }

    var updatedState = this.getState();
    delete updatedState.plugins[instance.id];
    this.setState(updatedState);
  }
  /**
   * Uninstall all plugins and close down this Uppy instance.
   */
  ;

  _proto.close = function close() {
    var _this8 = this;

    this.log("Closing Uppy instance " + this.opts.id + ": removing all files and uninstalling plugins");
    this.reset();

    this._storeUnsubscribe();

    this.iteratePlugins(function (plugin) {
      _this8.removePlugin(plugin);
    });
  }
  /**
   * Set info message in `state.info`, so that UI plugins like `Informer`
   * can display the message.
   *
   * @param {string | object} message Message to be displayed by the informer
   * @param {string} [type]
   * @param {number} [duration]
   */
  ;

  _proto.info = function info(message, type, duration) {
    if (type === void 0) {
      type = 'info';
    }

    if (duration === void 0) {
      duration = 3000;
    }

    var isComplexMessage = typeof message === 'object';
    this.setState({
      info: {
        isHidden: false,
        type: type,
        message: isComplexMessage ? message.message : message,
        details: isComplexMessage ? message.details : null
      }
    });
    this.emit('info-visible');
    clearTimeout(this.infoTimeoutID);

    if (duration === 0) {
      this.infoTimeoutID = undefined;
      return;
    } // hide the informer after `duration` milliseconds


    this.infoTimeoutID = setTimeout(this.hideInfo, duration);
  };

  _proto.hideInfo = function hideInfo() {
    var newInfo = _extends({}, this.getState().info, {
      isHidden: true
    });

    this.setState({
      info: newInfo
    });
    this.emit('info-hidden');
  }
  /**
   * Passes messages to a function, provided in `opts.logger`.
   * If `opts.logger: Uppy.debugLogger` or `opts.debug: true`, logs to the browser console.
   *
   * @param {string|object} message to log
   * @param {string} [type] optional `error` or `warning`
   */
  ;

  _proto.log = function log(message, type) {
    var logger = this.opts.logger;

    switch (type) {
      case 'error':
        logger.error(message);
        break;

      case 'warning':
        logger.warn(message);
        break;

      default:
        logger.debug(message);
        break;
    }
  }
  /**
   * Obsolete, event listeners are now added in the constructor.
   */
  ;

  _proto.run = function run() {
    this.log('Calling run() is no longer necessary.', 'warning');
    return this;
  }
  /**
   * Restore an upload by its ID.
   */
  ;

  _proto.restore = function restore(uploadID) {
    this.log("Core: attempting to restore upload \"" + uploadID + "\"");

    if (!this.getState().currentUploads[uploadID]) {
      this._removeUpload(uploadID);

      return Promise.reject(new Error('Nonexistent upload'));
    }

    return this._runUpload(uploadID);
  }
  /**
   * Create an upload for a bunch of files.
   *
   * @param {Array<string>} fileIDs File IDs to include in this upload.
   * @returns {string} ID of this upload.
   */
  ;

  _proto._createUpload = function _createUpload(fileIDs, opts) {
    var _extends4;

    if (opts === void 0) {
      opts = {};
    }

    var _opts = opts,
        _opts$forceAllowNewUp = _opts.forceAllowNewUpload,
        forceAllowNewUpload = _opts$forceAllowNewUp === void 0 ? false : _opts$forceAllowNewUp;

    var _this$getState6 = this.getState(),
        allowNewUpload = _this$getState6.allowNewUpload,
        currentUploads = _this$getState6.currentUploads;

    if (!allowNewUpload && !forceAllowNewUpload) {
      throw new Error('Cannot create a new upload: already uploading.');
    }

    var uploadID = cuid();
    this.emit('upload', {
      id: uploadID,
      fileIDs: fileIDs
    });
    this.setState({
      allowNewUpload: this.opts.allowMultipleUploads !== false,
      currentUploads: _extends({}, currentUploads, (_extends4 = {}, _extends4[uploadID] = {
        fileIDs: fileIDs,
        step: 0,
        result: {}
      }, _extends4))
    });
    return uploadID;
  };

  _proto._getUpload = function _getUpload(uploadID) {
    var _this$getState7 = this.getState(),
        currentUploads = _this$getState7.currentUploads;

    return currentUploads[uploadID];
  }
  /**
   * Add data to an upload's result object.
   *
   * @param {string} uploadID The ID of the upload.
   * @param {object} data Data properties to add to the result object.
   */
  ;

  _proto.addResultData = function addResultData(uploadID, data) {
    var _extends5;

    if (!this._getUpload(uploadID)) {
      this.log("Not setting result for an upload that has been removed: " + uploadID);
      return;
    }

    var currentUploads = this.getState().currentUploads;

    var currentUpload = _extends({}, currentUploads[uploadID], {
      result: _extends({}, currentUploads[uploadID].result, data)
    });

    this.setState({
      currentUploads: _extends({}, currentUploads, (_extends5 = {}, _extends5[uploadID] = currentUpload, _extends5))
    });
  }
  /**
   * Remove an upload, eg. if it has been canceled or completed.
   *
   * @param {string} uploadID The ID of the upload.
   */
  ;

  _proto._removeUpload = function _removeUpload(uploadID) {
    var currentUploads = _extends({}, this.getState().currentUploads);

    delete currentUploads[uploadID];
    this.setState({
      currentUploads: currentUploads
    });
  }
  /**
   * Run an upload. This picks up where it left off in case the upload is being restored.
   *
   * @private
   */
  ;

  _proto._runUpload = function _runUpload(uploadID) {
    var _this9 = this;

    var uploadData = this.getState().currentUploads[uploadID];
    var restoreStep = uploadData.step;
    var steps = [].concat(this.preProcessors, this.uploaders, this.postProcessors);
    var lastStep = Promise.resolve();
    steps.forEach(function (fn, step) {
      // Skip this step if we are restoring and have already completed this step before.
      if (step < restoreStep) {
        return;
      }

      lastStep = lastStep.then(function () {
        var _extends6;

        var _this9$getState = _this9.getState(),
            currentUploads = _this9$getState.currentUploads;

        var currentUpload = currentUploads[uploadID];

        if (!currentUpload) {
          return;
        }

        var updatedUpload = _extends({}, currentUpload, {
          step: step
        });

        _this9.setState({
          currentUploads: _extends({}, currentUploads, (_extends6 = {}, _extends6[uploadID] = updatedUpload, _extends6))
        }); // TODO give this the `updatedUpload` object as its only parameter maybe?
        // Otherwise when more metadata may be added to the upload this would keep getting more parameters


        return fn(updatedUpload.fileIDs, uploadID);
      }).then(function (result) {
        return null;
      });
    }); // Not returning the `catch`ed promise, because we still want to return a rejected
    // promise from this method if the upload failed.

    lastStep.catch(function (err) {
      _this9.emit('error', err, uploadID);

      _this9._removeUpload(uploadID);
    });
    return lastStep.then(function () {
      // Set result data.
      var _this9$getState2 = _this9.getState(),
          currentUploads = _this9$getState2.currentUploads;

      var currentUpload = currentUploads[uploadID];

      if (!currentUpload) {
        return;
      }

      var files = currentUpload.fileIDs.map(function (fileID) {
        return _this9.getFile(fileID);
      });
      var successful = files.filter(function (file) {
        return !file.error;
      });
      var failed = files.filter(function (file) {
        return file.error;
      });

      _this9.addResultData(uploadID, {
        successful: successful,
        failed: failed,
        uploadID: uploadID
      });
    }).then(function () {
      // Emit completion events.
      // This is in a separate function so that the `currentUploads` variable
      // always refers to the latest state. In the handler right above it refers
      // to an outdated object without the `.result` property.
      var _this9$getState3 = _this9.getState(),
          currentUploads = _this9$getState3.currentUploads;

      if (!currentUploads[uploadID]) {
        return;
      }

      var currentUpload = currentUploads[uploadID];
      var result = currentUpload.result;

      _this9.emit('complete', result);

      _this9._removeUpload(uploadID);

      return result;
    }).then(function (result) {
      if (result == null) {
        _this9.log("Not setting result for an upload that has been removed: " + uploadID);
      }

      return result;
    });
  }
  /**
   * Start an upload for all the files that are not currently being uploaded.
   *
   * @returns {Promise}
   */
  ;

  _proto.upload = function upload() {
    var _this10 = this;

    if (!this.plugins.uploader) {
      this.log('No uploader type plugins are used', 'warning');
    }

    var files = this.getState().files;
    var onBeforeUploadResult = this.opts.onBeforeUpload(files);

    if (onBeforeUploadResult === false) {
      return Promise.reject(new Error('Not starting the upload because onBeforeUpload returned false'));
    }

    if (onBeforeUploadResult && typeof onBeforeUploadResult === 'object') {
      files = onBeforeUploadResult; // Updating files in state, because uploader plugins receive file IDs,
      // and then fetch the actual file object from state

      this.setState({
        files: files
      });
    }

    return Promise.resolve().then(function () {
      return _this10._checkMinNumberOfFiles(files);
    }).catch(function (err) {
      _this10._showOrLogErrorAndThrow(err);
    }).then(function () {
      var _this10$getState = _this10.getState(),
          currentUploads = _this10$getState.currentUploads; // get a list of files that are currently assigned to uploads


      var currentlyUploadingFiles = Object.keys(currentUploads).reduce(function (prev, curr) {
        return prev.concat(currentUploads[curr].fileIDs);
      }, []);
      var waitingFileIDs = [];
      Object.keys(files).forEach(function (fileID) {
        var file = _this10.getFile(fileID); // if the file hasn't started uploading and hasn't already been assigned to an upload..


        if (!file.progress.uploadStarted && currentlyUploadingFiles.indexOf(fileID) === -1) {
          waitingFileIDs.push(file.id);
        }
      });

      var uploadID = _this10._createUpload(waitingFileIDs);

      return _this10._runUpload(uploadID);
    }).catch(function (err) {
      _this10._showOrLogErrorAndThrow(err, {
        showInformer: false
      });
    });
  };

  _createClass(Uppy, [{
    key: "state",
    get: function get() {
      return this.getState();
    }
  }]);

  return Uppy;
}();

Uppy.VERSION = require('../package.json').version;

module.exports = function (opts) {
  return new Uppy(opts);
}; // Expose class constructor.


module.exports.Uppy = Uppy;
module.exports.Plugin = Plugin;
module.exports.debugLogger = debugLogger;

},{"../package.json":23,"./../../store-default":33,"./../../utils/lib/Translator":38,"./../../utils/lib/generateFileID":42,"./../../utils/lib/getFileNameAndExtension":43,"./../../utils/lib/getFileType":44,"./Plugin":24,"./loggers":26,"./supportsUploadProgress":27,"@transloadit/prettier-bytes":1,"cuid":2,"lodash.throttle":8,"mime-match":9,"namespace-emitter":10}],26:[function(require,module,exports){
var getTimeStamp = require('./../../utils/lib/getTimeStamp'); // Swallow all logs, except errors.
// default if logger is not set or debug: false


var justErrorsLogger = {
  debug: function debug() {},
  warn: function warn() {},
  error: function error() {
    var _console;

    for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    return (_console = console).error.apply(_console, ["[Uppy] [" + getTimeStamp() + "]"].concat(args));
  }
}; // Print logs to console with namespace + timestamp,
// set by logger: Uppy.debugLogger or debug: true

var debugLogger = {
  debug: function debug() {
    // IE 10 doesn’t support console.debug
    var debug = console.debug || console.log;

    for (var _len2 = arguments.length, args = new Array(_len2), _key2 = 0; _key2 < _len2; _key2++) {
      args[_key2] = arguments[_key2];
    }

    debug.call.apply(debug, [console, "[Uppy] [" + getTimeStamp() + "]"].concat(args));
  },
  warn: function warn() {
    var _console2;

    for (var _len3 = arguments.length, args = new Array(_len3), _key3 = 0; _key3 < _len3; _key3++) {
      args[_key3] = arguments[_key3];
    }

    return (_console2 = console).warn.apply(_console2, ["[Uppy] [" + getTimeStamp() + "]"].concat(args));
  },
  error: function error() {
    var _console3;

    for (var _len4 = arguments.length, args = new Array(_len4), _key4 = 0; _key4 < _len4; _key4++) {
      args[_key4] = arguments[_key4];
    }

    return (_console3 = console).error.apply(_console3, ["[Uppy] [" + getTimeStamp() + "]"].concat(args));
  }
};
module.exports = {
  justErrorsLogger: justErrorsLogger,
  debugLogger: debugLogger
};

},{"./../../utils/lib/getTimeStamp":46}],27:[function(require,module,exports){
// Edge 15.x does not fire 'progress' events on uploads.
// See https://github.com/transloadit/uppy/issues/945
// And https://developer.microsoft.com/en-us/microsoft-edge/platform/issues/12224510/
module.exports = function supportsUploadProgress(userAgent) {
  // Allow passing in userAgent for tests
  if (userAgent == null) {
    userAgent = typeof navigator !== 'undefined' ? navigator.userAgent : null;
  } // Assume it works because basically everything supports progress events.


  if (!userAgent) return true;
  var m = /Edge\/(\d+\.\d+)/.exec(userAgent);
  if (!m) return true;
  var edgeVersion = m[1];

  var _edgeVersion$split = edgeVersion.split('.'),
      major = _edgeVersion$split[0],
      minor = _edgeVersion$split[1];

  major = parseInt(major, 10);
  minor = parseInt(minor, 10); // Worked before:
  // Edge 40.15063.0.0
  // Microsoft EdgeHTML 15.15063

  if (major < 15 || major === 15 && minor < 15063) {
    return true;
  } // Fixed in:
  // Microsoft EdgeHTML 18.18218


  if (major > 18 || major === 18 && minor >= 18218) {
    return true;
  } // other versions don't work.


  return false;
};

},{}],28:[function(require,module,exports){
module.exports={
  "name": "@uppy/file-input",
  "description": "Simple UI of a file input button that works with Uppy right out of the box",
  "version": "1.4.18",
  "license": "MIT",
  "main": "lib/index.js",
  "style": "dist/style.min.css",
  "types": "types/index.d.ts",
  "keywords": [
    "file uploader",
    "upload",
    "uppy",
    "uppy-plugin",
    "file-input"
  ],
  "homepage": "https://uppy.io",
  "bugs": {
    "url": "https://github.com/transloadit/uppy/issues"
  },
  "repository": {
    "type": "git",
    "url": "git+https://github.com/transloadit/uppy.git"
  },
  "dependencies": {
    "@uppy/utils": "file:../utils",
    "preact": "8.2.9"
  },
  "peerDependencies": {
    "@uppy/core": "^1.0.0"
  }
}

},{}],29:[function(require,module,exports){
var _class, _temp;

function _extends() { _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _inheritsLoose(subClass, superClass) { subClass.prototype = Object.create(superClass.prototype); subClass.prototype.constructor = subClass; subClass.__proto__ = superClass; }

var _require = require('./../../core'),
    Plugin = _require.Plugin;

var toArray = require('./../../utils/lib/toArray');

var Translator = require('./../../utils/lib/Translator');

var _require2 = require('preact'),
    h = _require2.h;

module.exports = (_temp = _class = /*#__PURE__*/function (_Plugin) {
  _inheritsLoose(FileInput, _Plugin);

  function FileInput(uppy, opts) {
    var _this;

    _this = _Plugin.call(this, uppy, opts) || this;
    _this.id = _this.opts.id || 'FileInput';
    _this.title = 'File Input';
    _this.type = 'acquirer';
    _this.defaultLocale = {
      strings: {
        // The same key is used for the same purpose by @uppy/robodog's `form()` API, but our
        // locale pack scripts can't access it in Robodog. If it is updated here, it should
        // also be updated there!
        chooseFiles: 'Choose files'
      }
    }; // Default options

    var defaultOptions = {
      target: null,
      pretty: true,
      inputName: 'files[]'
    }; // Merge default options with the ones set by user

    _this.opts = _extends({}, defaultOptions, opts);

    _this.i18nInit();

    _this.render = _this.render.bind(_assertThisInitialized(_this));
    _this.handleInputChange = _this.handleInputChange.bind(_assertThisInitialized(_this));
    _this.handleClick = _this.handleClick.bind(_assertThisInitialized(_this));
    return _this;
  }

  var _proto = FileInput.prototype;

  _proto.setOptions = function setOptions(newOpts) {
    _Plugin.prototype.setOptions.call(this, newOpts);

    this.i18nInit();
  };

  _proto.i18nInit = function i18nInit() {
    this.translator = new Translator([this.defaultLocale, this.uppy.locale, this.opts.locale]);
    this.i18n = this.translator.translate.bind(this.translator);
    this.i18nArray = this.translator.translateArray.bind(this.translator);
    this.setPluginState(); // so that UI re-renders and we see the updated locale
  };

  _proto.addFiles = function addFiles(files) {
    var _this2 = this;

    var descriptors = files.map(function (file) {
      return {
        source: _this2.id,
        name: file.name,
        type: file.type,
        data: file
      };
    });

    try {
      this.uppy.addFiles(descriptors);
    } catch (err) {
      this.uppy.log(err);
    }
  };

  _proto.handleInputChange = function handleInputChange(event) {
    this.uppy.log('[FileInput] Something selected through input...');
    var files = toArray(event.target.files);
    this.addFiles(files); // We clear the input after a file is selected, because otherwise
    // change event is not fired in Chrome and Safari when a file
    // with the same name is selected.
    // ___Why not use value="" on <input/> instead?
    //    Because if we use that method of clearing the input,
    //    Chrome will not trigger change if we drop the same file twice (Issue #768).

    event.target.value = null;
  };

  _proto.handleClick = function handleClick(ev) {
    this.input.click();
  };

  _proto.render = function render(state) {
    var _this3 = this;

    /* http://tympanus.net/codrops/2015/09/15/styling-customizing-file-inputs-smart-way/ */
    var hiddenInputStyle = {
      width: '0.1px',
      height: '0.1px',
      opacity: 0,
      overflow: 'hidden',
      position: 'absolute',
      zIndex: -1
    };
    var restrictions = this.uppy.opts.restrictions;
    var accept = restrictions.allowedFileTypes ? restrictions.allowedFileTypes.join(',') : null;
    return h("div", {
      class: "uppy-Root uppy-FileInput-container"
    }, h("input", {
      class: "uppy-FileInput-input",
      style: this.opts.pretty && hiddenInputStyle,
      type: "file",
      name: this.opts.inputName,
      onchange: this.handleInputChange,
      multiple: restrictions.maxNumberOfFiles !== 1,
      accept: accept,
      ref: function ref(input) {
        _this3.input = input;
      }
    }), this.opts.pretty && h("button", {
      class: "uppy-FileInput-btn",
      type: "button",
      onclick: this.handleClick
    }, this.i18n('chooseFiles')));
  };

  _proto.install = function install() {
    var target = this.opts.target;

    if (target) {
      this.mount(target, this);
    }
  };

  _proto.uninstall = function uninstall() {
    this.unmount();
  };

  return FileInput;
}(Plugin), _class.VERSION = require('../package.json').version, _temp);

},{"../package.json":28,"./../../core":25,"./../../utils/lib/Translator":38,"./../../utils/lib/toArray":52,"preact":11}],30:[function(require,module,exports){
module.exports={
  "name": "@uppy/progress-bar",
  "description": "A progress bar UI for Uppy",
  "version": "1.3.20",
  "license": "MIT",
  "main": "lib/index.js",
  "style": "dist/style.min.css",
  "types": "types/index.d.ts",
  "keywords": [
    "file uploader",
    "uppy",
    "uppy-plugin",
    "progress",
    "progress bar",
    "upload progress"
  ],
  "homepage": "https://uppy.io",
  "bugs": {
    "url": "https://github.com/transloadit/uppy/issues"
  },
  "repository": {
    "type": "git",
    "url": "git+https://github.com/transloadit/uppy.git"
  },
  "dependencies": {
    "@uppy/utils": "file:../utils",
    "preact": "8.2.9"
  },
  "peerDependencies": {
    "@uppy/core": "^1.0.0"
  }
}

},{}],31:[function(require,module,exports){
var _class, _temp;

function _extends() { _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _inheritsLoose(subClass, superClass) { subClass.prototype = Object.create(superClass.prototype); subClass.prototype.constructor = subClass; subClass.__proto__ = superClass; }

var _require = require('./../../core'),
    Plugin = _require.Plugin;

var _require2 = require('preact'),
    h = _require2.h;
/**
 * Progress bar
 *
 */


module.exports = (_temp = _class = /*#__PURE__*/function (_Plugin) {
  _inheritsLoose(ProgressBar, _Plugin);

  function ProgressBar(uppy, opts) {
    var _this;

    _this = _Plugin.call(this, uppy, opts) || this;
    _this.id = _this.opts.id || 'ProgressBar';
    _this.title = 'Progress Bar';
    _this.type = 'progressindicator'; // set default options

    var defaultOptions = {
      target: 'body',
      replaceTargetContent: false,
      fixed: false,
      hideAfterFinish: true
    }; // merge default options with the ones set by user

    _this.opts = _extends({}, defaultOptions, opts);
    _this.render = _this.render.bind(_assertThisInitialized(_this));
    return _this;
  }

  var _proto = ProgressBar.prototype;

  _proto.render = function render(state) {
    var progress = state.totalProgress || 0; // before starting and after finish should be hidden if specified in the options

    var isHidden = (progress === 0 || progress === 100) && this.opts.hideAfterFinish;
    return h("div", {
      class: "uppy uppy-ProgressBar",
      style: {
        position: this.opts.fixed ? 'fixed' : 'initial'
      },
      "aria-hidden": isHidden
    }, h("div", {
      class: "uppy-ProgressBar-inner",
      style: {
        width: progress + '%'
      }
    }), h("div", {
      class: "uppy-ProgressBar-percentage"
    }, progress));
  };

  _proto.install = function install() {
    var target = this.opts.target;

    if (target) {
      this.mount(target, this);
    }
  };

  _proto.uninstall = function uninstall() {
    this.unmount();
  };

  return ProgressBar;
}(Plugin), _class.VERSION = require('../package.json').version, _temp);

},{"../package.json":30,"./../../core":25,"preact":11}],32:[function(require,module,exports){
module.exports={
  "name": "@uppy/store-default",
  "description": "The default simple object-based store for Uppy.",
  "version": "1.2.4",
  "license": "MIT",
  "main": "lib/index.js",
  "types": "types/index.d.ts",
  "keywords": [
    "file uploader",
    "uppy",
    "uppy-store"
  ],
  "homepage": "https://uppy.io",
  "bugs": {
    "url": "https://github.com/transloadit/uppy/issues"
  },
  "repository": {
    "type": "git",
    "url": "git+https://github.com/transloadit/uppy.git"
  }
}

},{}],33:[function(require,module,exports){
function _extends() { _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }

/**
 * Default store that keeps state in a simple object.
 */
var DefaultStore = /*#__PURE__*/function () {
  function DefaultStore() {
    this.state = {};
    this.callbacks = [];
  }

  var _proto = DefaultStore.prototype;

  _proto.getState = function getState() {
    return this.state;
  };

  _proto.setState = function setState(patch) {
    var prevState = _extends({}, this.state);

    var nextState = _extends({}, this.state, patch);

    this.state = nextState;

    this._publish(prevState, nextState, patch);
  };

  _proto.subscribe = function subscribe(listener) {
    var _this = this;

    this.callbacks.push(listener);
    return function () {
      // Remove the listener.
      _this.callbacks.splice(_this.callbacks.indexOf(listener), 1);
    };
  };

  _proto._publish = function _publish() {
    for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    this.callbacks.forEach(function (listener) {
      listener.apply(void 0, args);
    });
  };

  return DefaultStore;
}();

DefaultStore.VERSION = require('../package.json').version;

module.exports = function defaultStore() {
  return new DefaultStore();
};

},{"../package.json":32}],34:[function(require,module,exports){
/**
 * Create a wrapper around an event emitter with a `remove` method to remove
 * all events that were added using the wrapped emitter.
 */
module.exports = /*#__PURE__*/function () {
  function EventTracker(emitter) {
    this._events = [];
    this._emitter = emitter;
  }

  var _proto = EventTracker.prototype;

  _proto.on = function on(event, fn) {
    this._events.push([event, fn]);

    return this._emitter.on(event, fn);
  };

  _proto.remove = function remove() {
    var _this = this;

    this._events.forEach(function (_ref) {
      var event = _ref[0],
          fn = _ref[1];

      _this._emitter.off(event, fn);
    });
  };

  return EventTracker;
}();

},{}],35:[function(require,module,exports){
function _inheritsLoose(subClass, superClass) { subClass.prototype = Object.create(superClass.prototype); subClass.prototype.constructor = subClass; subClass.__proto__ = superClass; }

function _wrapNativeSuper(Class) { var _cache = typeof Map === "function" ? new Map() : undefined; _wrapNativeSuper = function _wrapNativeSuper(Class) { if (Class === null || !_isNativeFunction(Class)) return Class; if (typeof Class !== "function") { throw new TypeError("Super expression must either be null or a function"); } if (typeof _cache !== "undefined") { if (_cache.has(Class)) return _cache.get(Class); _cache.set(Class, Wrapper); } function Wrapper() { return _construct(Class, arguments, _getPrototypeOf(this).constructor); } Wrapper.prototype = Object.create(Class.prototype, { constructor: { value: Wrapper, enumerable: false, writable: true, configurable: true } }); return _setPrototypeOf(Wrapper, Class); }; return _wrapNativeSuper(Class); }

function _construct(Parent, args, Class) { if (_isNativeReflectConstruct()) { _construct = Reflect.construct; } else { _construct = function _construct(Parent, args, Class) { var a = [null]; a.push.apply(a, args); var Constructor = Function.bind.apply(Parent, a); var instance = new Constructor(); if (Class) _setPrototypeOf(instance, Class.prototype); return instance; }; } return _construct.apply(null, arguments); }

function _isNativeReflectConstruct() { if (typeof Reflect === "undefined" || !Reflect.construct) return false; if (Reflect.construct.sham) return false; if (typeof Proxy === "function") return true; try { Date.prototype.toString.call(Reflect.construct(Date, [], function () {})); return true; } catch (e) { return false; } }

function _isNativeFunction(fn) { return Function.toString.call(fn).indexOf("[native code]") !== -1; }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }

var NetworkError = /*#__PURE__*/function (_Error) {
  _inheritsLoose(NetworkError, _Error);

  function NetworkError(error, xhr) {
    var _this;

    if (xhr === void 0) {
      xhr = null;
    }

    _this = _Error.call(this, "This looks like a network error, the endpoint might be blocked by an internet provider or a firewall.\n\nSource error: [" + error + "]") || this;
    _this.isNetworkError = true;
    _this.request = xhr;
    return _this;
  }

  return NetworkError;
}( /*#__PURE__*/_wrapNativeSuper(Error));

module.exports = NetworkError;

},{}],36:[function(require,module,exports){
/**
 * Helper to abort upload requests if there has not been any progress for `timeout` ms.
 * Create an instance using `timer = new ProgressTimeout(10000, onTimeout)`
 * Call `timer.progress()` to signal that there has been progress of any kind.
 * Call `timer.done()` when the upload has completed.
 */
var ProgressTimeout = /*#__PURE__*/function () {
  function ProgressTimeout(timeout, timeoutHandler) {
    this._timeout = timeout;
    this._onTimedOut = timeoutHandler;
    this._isDone = false;
    this._aliveTimer = null;
    this._onTimedOut = this._onTimedOut.bind(this);
  }

  var _proto = ProgressTimeout.prototype;

  _proto.progress = function progress() {
    // Some browsers fire another progress event when the upload is
    // cancelled, so we have to ignore progress after the timer was
    // told to stop.
    if (this._isDone) return;

    if (this._timeout > 0) {
      if (this._aliveTimer) clearTimeout(this._aliveTimer);
      this._aliveTimer = setTimeout(this._onTimedOut, this._timeout);
    }
  };

  _proto.done = function done() {
    if (this._aliveTimer) {
      clearTimeout(this._aliveTimer);
      this._aliveTimer = null;
    }

    this._isDone = true;
  };

  return ProgressTimeout;
}();

module.exports = ProgressTimeout;

},{}],37:[function(require,module,exports){
/**
 * Array.prototype.findIndex ponyfill for old browsers.
 */
function findIndex(array, predicate) {
  for (var i = 0; i < array.length; i++) {
    if (predicate(array[i])) return i;
  }

  return -1;
}

function createCancelError() {
  return new Error('Cancelled');
}

module.exports = /*#__PURE__*/function () {
  function RateLimitedQueue(limit) {
    if (typeof limit !== 'number' || limit === 0) {
      this.limit = Infinity;
    } else {
      this.limit = limit;
    }

    this.activeRequests = 0;
    this.queuedHandlers = [];
  }

  var _proto = RateLimitedQueue.prototype;

  _proto._call = function _call(fn) {
    var _this = this;

    this.activeRequests += 1;
    var _done = false;
    var cancelActive;

    try {
      cancelActive = fn();
    } catch (err) {
      this.activeRequests -= 1;
      throw err;
    }

    return {
      abort: function abort() {
        if (_done) return;
        _done = true;
        _this.activeRequests -= 1;
        cancelActive();

        _this._queueNext();
      },
      done: function done() {
        if (_done) return;
        _done = true;
        _this.activeRequests -= 1;

        _this._queueNext();
      }
    };
  };

  _proto._queueNext = function _queueNext() {
    var _this2 = this;

    // Do it soon but not immediately, this allows clearing out the entire queue synchronously
    // one by one without continuously _advancing_ it (and starting new tasks before immediately
    // aborting them)
    Promise.resolve().then(function () {
      _this2._next();
    });
  };

  _proto._next = function _next() {
    if (this.activeRequests >= this.limit) {
      return;
    }

    if (this.queuedHandlers.length === 0) {
      return;
    } // Dispatch the next request, and update the abort/done handlers
    // so that cancelling it does the Right Thing (and doesn't just try
    // to dequeue an already-running request).


    var next = this.queuedHandlers.shift();

    var handler = this._call(next.fn);

    next.abort = handler.abort;
    next.done = handler.done;
  };

  _proto._queue = function _queue(fn, options) {
    var _this3 = this;

    if (options === void 0) {
      options = {};
    }

    var handler = {
      fn: fn,
      priority: options.priority || 0,
      abort: function abort() {
        _this3._dequeue(handler);
      },
      done: function done() {
        throw new Error('Cannot mark a queued request as done: this indicates a bug');
      }
    };
    var index = findIndex(this.queuedHandlers, function (other) {
      return handler.priority > other.priority;
    });

    if (index === -1) {
      this.queuedHandlers.push(handler);
    } else {
      this.queuedHandlers.splice(index, 0, handler);
    }

    return handler;
  };

  _proto._dequeue = function _dequeue(handler) {
    var index = this.queuedHandlers.indexOf(handler);

    if (index !== -1) {
      this.queuedHandlers.splice(index, 1);
    }
  };

  _proto.run = function run(fn, queueOptions) {
    if (this.activeRequests < this.limit) {
      return this._call(fn);
    }

    return this._queue(fn, queueOptions);
  };

  _proto.wrapPromiseFunction = function wrapPromiseFunction(fn, queueOptions) {
    var _this4 = this;

    return function () {
      for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
        args[_key] = arguments[_key];
      }

      var queuedRequest;
      var outerPromise = new Promise(function (resolve, reject) {
        queuedRequest = _this4.run(function () {
          var cancelError;
          var innerPromise;

          try {
            innerPromise = Promise.resolve(fn.apply(void 0, args));
          } catch (err) {
            innerPromise = Promise.reject(err);
          }

          innerPromise.then(function (result) {
            if (cancelError) {
              reject(cancelError);
            } else {
              queuedRequest.done();
              resolve(result);
            }
          }, function (err) {
            if (cancelError) {
              reject(cancelError);
            } else {
              queuedRequest.done();
              reject(err);
            }
          });
          return function () {
            cancelError = createCancelError();
          };
        }, queueOptions);
      });

      outerPromise.abort = function () {
        queuedRequest.abort();
      };

      return outerPromise;
    };
  };

  return RateLimitedQueue;
}();

},{}],38:[function(require,module,exports){
function _extends() { _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }

var has = require('./hasProperty');
/**
 * Translates strings with interpolation & pluralization support.
 * Extensible with custom dictionaries and pluralization functions.
 *
 * Borrows heavily from and inspired by Polyglot https://github.com/airbnb/polyglot.js,
 * basically a stripped-down version of it. Differences: pluralization functions are not hardcoded
 * and can be easily added among with dictionaries, nested objects are used for pluralization
 * as opposed to `||||` delimeter
 *
 * Usage example: `translator.translate('files_chosen', {smart_count: 3})`
 */


module.exports = /*#__PURE__*/function () {
  /**
   * @param {object|Array<object>} locales - locale or list of locales.
   */
  function Translator(locales) {
    var _this = this;

    this.locale = {
      strings: {},
      pluralize: function pluralize(n) {
        if (n === 1) {
          return 0;
        }

        return 1;
      }
    };

    if (Array.isArray(locales)) {
      locales.forEach(function (locale) {
        return _this._apply(locale);
      });
    } else {
      this._apply(locales);
    }
  }

  var _proto = Translator.prototype;

  _proto._apply = function _apply(locale) {
    if (!locale || !locale.strings) {
      return;
    }

    var prevLocale = this.locale;
    this.locale = _extends({}, prevLocale, {
      strings: _extends({}, prevLocale.strings, locale.strings)
    });
    this.locale.pluralize = locale.pluralize || prevLocale.pluralize;
  }
  /**
   * Takes a string with placeholder variables like `%{smart_count} file selected`
   * and replaces it with values from options `{smart_count: 5}`
   *
   * @license https://github.com/airbnb/polyglot.js/blob/master/LICENSE
   * taken from https://github.com/airbnb/polyglot.js/blob/master/lib/polyglot.js#L299
   *
   * @param {string} phrase that needs interpolation, with placeholders
   * @param {object} options with values that will be used to replace placeholders
   * @returns {string} interpolated
   */
  ;

  _proto.interpolate = function interpolate(phrase, options) {
    var _String$prototype = String.prototype,
        split = _String$prototype.split,
        replace = _String$prototype.replace;
    var dollarRegex = /\$/g;
    var dollarBillsYall = '$$$$';
    var interpolated = [phrase];

    for (var arg in options) {
      if (arg !== '_' && has(options, arg)) {
        // Ensure replacement value is escaped to prevent special $-prefixed
        // regex replace tokens. the "$$$$" is needed because each "$" needs to
        // be escaped with "$" itself, and we need two in the resulting output.
        var replacement = options[arg];

        if (typeof replacement === 'string') {
          replacement = replace.call(options[arg], dollarRegex, dollarBillsYall);
        } // We create a new `RegExp` each time instead of using a more-efficient
        // string replace so that the same argument can be replaced multiple times
        // in the same phrase.


        interpolated = insertReplacement(interpolated, new RegExp('%\\{' + arg + '\\}', 'g'), replacement);
      }
    }

    return interpolated;

    function insertReplacement(source, rx, replacement) {
      var newParts = [];
      source.forEach(function (chunk) {
        // When the source contains multiple placeholders for interpolation,
        // we should ignore chunks that are not strings, because those
        // can be JSX objects and will be otherwise incorrectly turned into strings.
        // Without this condition we’d get this: [object Object] hello [object Object] my <button>
        if (typeof chunk !== 'string') {
          return newParts.push(chunk);
        }

        split.call(chunk, rx).forEach(function (raw, i, list) {
          if (raw !== '') {
            newParts.push(raw);
          } // Interlace with the `replacement` value


          if (i < list.length - 1) {
            newParts.push(replacement);
          }
        });
      });
      return newParts;
    }
  }
  /**
   * Public translate method
   *
   * @param {string} key
   * @param {object} options with values that will be used later to replace placeholders in string
   * @returns {string} translated (and interpolated)
   */
  ;

  _proto.translate = function translate(key, options) {
    return this.translateArray(key, options).join('');
  }
  /**
   * Get a translation and return the translated and interpolated parts as an array.
   *
   * @param {string} key
   * @param {object} options with values that will be used to replace placeholders
   * @returns {Array} The translated and interpolated parts, in order.
   */
  ;

  _proto.translateArray = function translateArray(key, options) {
    if (!has(this.locale.strings, key)) {
      throw new Error("missing string: " + key);
    }

    var string = this.locale.strings[key];
    var hasPluralForms = typeof string === 'object';

    if (hasPluralForms) {
      if (options && typeof options.smart_count !== 'undefined') {
        var plural = this.locale.pluralize(options.smart_count);
        return this.interpolate(string[plural], options);
      } else {
        throw new Error('Attempted to use a string with plural forms, but no value was given for %{smart_count}');
      }
    }

    return this.interpolate(string, options);
  };

  return Translator;
}();

},{"./hasProperty":47}],39:[function(require,module,exports){
var throttle = require('lodash.throttle');

function _emitSocketProgress(uploader, progressData, file) {
  var progress = progressData.progress,
      bytesUploaded = progressData.bytesUploaded,
      bytesTotal = progressData.bytesTotal;

  if (progress) {
    uploader.uppy.log("Upload progress: " + progress);
    uploader.uppy.emit('upload-progress', file, {
      uploader: uploader,
      bytesUploaded: bytesUploaded,
      bytesTotal: bytesTotal
    });
  }
}

module.exports = throttle(_emitSocketProgress, 300, {
  leading: true,
  trailing: true
});

},{"lodash.throttle":8}],40:[function(require,module,exports){
var NetworkError = require('./../lib/NetworkError');
/**
 * Wrapper around window.fetch that throws a NetworkError when appropriate
 */


module.exports = function fetchWithNetworkError() {
  return fetch.apply(void 0, arguments).catch(function (err) {
    if (err.name === 'AbortError') {
      throw err;
    } else {
      throw new NetworkError(err);
    }
  });
};

},{"./../lib/NetworkError":35}],41:[function(require,module,exports){
var isDOMElement = require('./isDOMElement');
/**
 * Find a DOM element.
 *
 * @param {Node|string} element
 * @returns {Node|null}
 */


module.exports = function findDOMElement(element, context) {
  if (context === void 0) {
    context = document;
  }

  if (typeof element === 'string') {
    return context.querySelector(element);
  }

  if (isDOMElement(element)) {
    return element;
  }
};

},{"./isDOMElement":48}],42:[function(require,module,exports){
/**
 * Takes a file object and turns it into fileID, by converting file.name to lowercase,
 * removing extra characters and adding type, size and lastModified
 *
 * @param {object} file
 * @returns {string} the fileID
 */
module.exports = function generateFileID(file) {
  // It's tempting to do `[items].filter(Boolean).join('-')` here, but that
  // is slower! simple string concatenation is fast
  var id = 'uppy';

  if (typeof file.name === 'string') {
    id += '-' + encodeFilename(file.name.toLowerCase());
  }

  if (file.type !== undefined) {
    id += '-' + file.type;
  }

  if (file.meta && typeof file.meta.relativePath === 'string') {
    id += '-' + encodeFilename(file.meta.relativePath.toLowerCase());
  }

  if (file.data.size !== undefined) {
    id += '-' + file.data.size;
  }

  if (file.data.lastModified !== undefined) {
    id += '-' + file.data.lastModified;
  }

  return id;
};

function encodeFilename(name) {
  var suffix = '';
  return name.replace(/[^A-Z0-9]/ig, function (character) {
    suffix += '-' + encodeCharacter(character);
    return '/';
  }) + suffix;
}

function encodeCharacter(character) {
  return character.charCodeAt(0).toString(32);
}

},{}],43:[function(require,module,exports){
/**
 * Takes a full filename string and returns an object {name, extension}
 *
 * @param {string} fullFileName
 * @returns {object} {name, extension}
 */
module.exports = function getFileNameAndExtension(fullFileName) {
  var lastDot = fullFileName.lastIndexOf('.'); // these count as no extension: "no-dot", "trailing-dot."

  if (lastDot === -1 || lastDot === fullFileName.length - 1) {
    return {
      name: fullFileName,
      extension: undefined
    };
  } else {
    return {
      name: fullFileName.slice(0, lastDot),
      extension: fullFileName.slice(lastDot + 1)
    };
  }
};

},{}],44:[function(require,module,exports){
var getFileNameAndExtension = require('./getFileNameAndExtension');

var mimeTypes = require('./mimeTypes');

module.exports = function getFileType(file) {
  var fileExtension = file.name ? getFileNameAndExtension(file.name).extension : null;
  fileExtension = fileExtension ? fileExtension.toLowerCase() : null;

  if (file.type) {
    // if mime type is set in the file object already, use that
    return file.type;
  } else if (fileExtension && mimeTypes[fileExtension]) {
    // else, see if we can map extension to a mime type
    return mimeTypes[fileExtension];
  } else {
    // if all fails, fall back to a generic byte stream type
    return 'application/octet-stream';
  }
};

},{"./getFileNameAndExtension":43,"./mimeTypes":50}],45:[function(require,module,exports){
module.exports = function getSocketHost(url) {
  // get the host domain
  var regex = /^(?:https?:\/\/|\/\/)?(?:[^@\n]+@)?(?:www\.)?([^\n]+)/i;
  var host = regex.exec(url)[1];
  var socketProtocol = /^http:\/\//i.test(url) ? 'ws' : 'wss';
  return socketProtocol + "://" + host;
};

},{}],46:[function(require,module,exports){
/**
 * Returns a timestamp in the format of `hours:minutes:seconds`
 */
module.exports = function getTimeStamp() {
  var date = new Date();
  var hours = pad(date.getHours().toString());
  var minutes = pad(date.getMinutes().toString());
  var seconds = pad(date.getSeconds().toString());
  return hours + ':' + minutes + ':' + seconds;
};
/**
 * Adds zero to strings shorter than two characters
 */


function pad(str) {
  return str.length !== 2 ? 0 + str : str;
}

},{}],47:[function(require,module,exports){
module.exports = function has(object, key) {
  return Object.prototype.hasOwnProperty.call(object, key);
};

},{}],48:[function(require,module,exports){
/**
 * Check if an object is a DOM element. Duck-typing based on `nodeType`.
 *
 * @param {*} obj
 */
module.exports = function isDOMElement(obj) {
  return obj && typeof obj === 'object' && obj.nodeType === Node.ELEMENT_NODE;
};

},{}],49:[function(require,module,exports){
function isNetworkError(xhr) {
  if (!xhr) {
    return false;
  }

  return xhr.readyState !== 0 && xhr.readyState !== 4 || xhr.status === 0;
}

module.exports = isNetworkError;

},{}],50:[function(require,module,exports){
// ___Why not add the mime-types package?
//    It's 19.7kB gzipped, and we only need mime types for well-known extensions (for file previews).
// ___Where to take new extensions from?
//    https://github.com/jshttp/mime-db/blob/master/db.json
module.exports = {
  md: 'text/markdown',
  markdown: 'text/markdown',
  mp4: 'video/mp4',
  mp3: 'audio/mp3',
  svg: 'image/svg+xml',
  jpg: 'image/jpeg',
  png: 'image/png',
  gif: 'image/gif',
  heic: 'image/heic',
  heif: 'image/heif',
  yaml: 'text/yaml',
  yml: 'text/yaml',
  csv: 'text/csv',
  tsv: 'text/tab-separated-values',
  tab: 'text/tab-separated-values',
  avi: 'video/x-msvideo',
  mks: 'video/x-matroska',
  mkv: 'video/x-matroska',
  mov: 'video/quicktime',
  doc: 'application/msword',
  docm: 'application/vnd.ms-word.document.macroenabled.12',
  docx: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  dot: 'application/msword',
  dotm: 'application/vnd.ms-word.template.macroenabled.12',
  dotx: 'application/vnd.openxmlformats-officedocument.wordprocessingml.template',
  xla: 'application/vnd.ms-excel',
  xlam: 'application/vnd.ms-excel.addin.macroenabled.12',
  xlc: 'application/vnd.ms-excel',
  xlf: 'application/x-xliff+xml',
  xlm: 'application/vnd.ms-excel',
  xls: 'application/vnd.ms-excel',
  xlsb: 'application/vnd.ms-excel.sheet.binary.macroenabled.12',
  xlsm: 'application/vnd.ms-excel.sheet.macroenabled.12',
  xlsx: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
  xlt: 'application/vnd.ms-excel',
  xltm: 'application/vnd.ms-excel.template.macroenabled.12',
  xltx: 'application/vnd.openxmlformats-officedocument.spreadsheetml.template',
  xlw: 'application/vnd.ms-excel',
  txt: 'text/plain',
  text: 'text/plain',
  conf: 'text/plain',
  log: 'text/plain',
  pdf: 'application/pdf'
};

},{}],51:[function(require,module,exports){
module.exports = function settle(promises) {
  var resolutions = [];
  var rejections = [];

  function resolved(value) {
    resolutions.push(value);
  }

  function rejected(error) {
    rejections.push(error);
  }

  var wait = Promise.all(promises.map(function (promise) {
    return promise.then(resolved, rejected);
  }));
  return wait.then(function () {
    return {
      successful: resolutions,
      failed: rejections
    };
  });
};

},{}],52:[function(require,module,exports){
/**
 * Converts list into array
 */
module.exports = function toArray(list) {
  return Array.prototype.slice.call(list || [], 0);
};

},{}],53:[function(require,module,exports){
module.exports={
  "name": "@uppy/xhr-upload",
  "description": "Plain and simple classic HTML multipart form uploads with Uppy, as well as uploads using the HTTP PUT method.",
  "version": "1.6.5",
  "license": "MIT",
  "main": "lib/index.js",
  "types": "types/index.d.ts",
  "keywords": [
    "file uploader",
    "xhr",
    "xhr upload",
    "XMLHttpRequest",
    "ajax",
    "fetch",
    "uppy",
    "uppy-plugin"
  ],
  "homepage": "https://uppy.io",
  "bugs": {
    "url": "https://github.com/transloadit/uppy/issues"
  },
  "repository": {
    "type": "git",
    "url": "git+https://github.com/transloadit/uppy.git"
  },
  "dependencies": {
    "@uppy/companion-client": "file:../companion-client",
    "@uppy/utils": "file:../utils",
    "cuid": "^2.1.1"
  },
  "peerDependencies": {
    "@uppy/core": "^1.0.0"
  }
}

},{}],54:[function(require,module,exports){
var _class, _temp;

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _inheritsLoose(subClass, superClass) { subClass.prototype = Object.create(superClass.prototype); subClass.prototype.constructor = subClass; subClass.__proto__ = superClass; }

function _extends() { _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }

var _require = require('./../../core'),
    Plugin = _require.Plugin;

var cuid = require('cuid');

var Translator = require('./../../utils/lib/Translator');

var _require2 = require('./../../companion-client'),
    Provider = _require2.Provider,
    RequestClient = _require2.RequestClient,
    Socket = _require2.Socket;

var emitSocketProgress = require('./../../utils/lib/emitSocketProgress');

var getSocketHost = require('./../../utils/lib/getSocketHost');

var settle = require('./../../utils/lib/settle');

var EventTracker = require('./../../utils/lib/EventTracker');

var ProgressTimeout = require('./../../utils/lib/ProgressTimeout');

var RateLimitedQueue = require('./../../utils/lib/RateLimitedQueue');

var NetworkError = require('./../../utils/lib/NetworkError');

var isNetworkError = require('./../../utils/lib/isNetworkError');

function buildResponseError(xhr, error) {
  // No error message
  if (!error) error = new Error('Upload error'); // Got an error message string

  if (typeof error === 'string') error = new Error(error); // Got something else

  if (!(error instanceof Error)) {
    error = _extends(new Error('Upload error'), {
      data: error
    });
  }

  if (isNetworkError(xhr)) {
    error = new NetworkError(error, xhr);
    return error;
  }

  error.request = xhr;
  return error;
}
/**
 * Set `data.type` in the blob to `file.meta.type`,
 * because we might have detected a more accurate file type in Uppy
 * https://stackoverflow.com/a/50875615
 *
 * @param {object} file File object with `data`, `size` and `meta` properties
 * @returns {object} blob updated with the new `type` set from `file.meta.type`
 */


function setTypeInBlob(file) {
  var dataWithUpdatedType = file.data.slice(0, file.data.size, file.meta.type);
  return dataWithUpdatedType;
}

module.exports = (_temp = _class = /*#__PURE__*/function (_Plugin) {
  _inheritsLoose(XHRUpload, _Plugin);

  function XHRUpload(uppy, opts) {
    var _this;

    _this = _Plugin.call(this, uppy, opts) || this;
    _this.type = 'uploader';
    _this.id = _this.opts.id || 'XHRUpload';
    _this.title = 'XHRUpload';
    _this.defaultLocale = {
      strings: {
        timedOut: 'Upload stalled for %{seconds} seconds, aborting.'
      }
    }; // Default options

    var defaultOptions = {
      formData: true,
      fieldName: 'files[]',
      method: 'post',
      metaFields: null,
      responseUrlFieldName: 'url',
      bundle: false,
      headers: {},
      timeout: 30 * 1000,
      limit: 0,
      withCredentials: false,
      responseType: '',

      /**
       * @typedef respObj
       * @property {string} responseText
       * @property {number} status
       * @property {string} statusText
       * @property {object.<string, string>} headers
       *
       * @param {string} responseText the response body string
       * @param {XMLHttpRequest | respObj} response the response object (XHR or similar)
       */
      getResponseData: function getResponseData(responseText, response) {
        var parsedResponse = {};

        try {
          parsedResponse = JSON.parse(responseText);
        } catch (err) {
          console.log(err);
        }

        return parsedResponse;
      },

      /**
       *
       * @param {string} responseText the response body string
       * @param {XMLHttpRequest | respObj} response the response object (XHR or similar)
       */
      getResponseError: function getResponseError(responseText, response) {
        var error = new Error('Upload error');

        if (isNetworkError(response)) {
          error = new NetworkError(error, response);
        }

        return error;
      },

      /**
       * Check if the response from the upload endpoint indicates that the upload was successful.
       *
       * @param {number} status the response status code
       * @param {string} responseText the response body string
       * @param {XMLHttpRequest | respObj} response the response object (XHR or similar)
       */
      validateStatus: function validateStatus(status, responseText, response) {
        return status >= 200 && status < 300;
      }
    };
    _this.opts = _extends({}, defaultOptions, opts);

    _this.i18nInit();

    _this.handleUpload = _this.handleUpload.bind(_assertThisInitialized(_this)); // Simultaneous upload limiting is shared across all uploads with this plugin.
    // __queue is for internal Uppy use only!

    if (_this.opts.__queue instanceof RateLimitedQueue) {
      _this.requests = _this.opts.__queue;
    } else {
      _this.requests = new RateLimitedQueue(_this.opts.limit);
    }

    if (_this.opts.bundle && !_this.opts.formData) {
      throw new Error('`opts.formData` must be true when `opts.bundle` is enabled.');
    }

    _this.uploaderEvents = Object.create(null);
    return _this;
  }

  var _proto = XHRUpload.prototype;

  _proto.setOptions = function setOptions(newOpts) {
    _Plugin.prototype.setOptions.call(this, newOpts);

    this.i18nInit();
  };

  _proto.i18nInit = function i18nInit() {
    this.translator = new Translator([this.defaultLocale, this.uppy.locale, this.opts.locale]);
    this.i18n = this.translator.translate.bind(this.translator);
    this.setPluginState(); // so that UI re-renders and we see the updated locale
  };

  _proto.getOptions = function getOptions(file) {
    var overrides = this.uppy.getState().xhrUpload;

    var opts = _extends({}, this.opts, overrides || {}, file.xhrUpload || {}, {
      headers: {}
    });

    _extends(opts.headers, this.opts.headers);

    if (overrides) {
      _extends(opts.headers, overrides.headers);
    }

    if (file.xhrUpload) {
      _extends(opts.headers, file.xhrUpload.headers);
    }

    return opts;
  };

  _proto.addMetadata = function addMetadata(formData, meta, opts) {
    var metaFields = Array.isArray(opts.metaFields) ? opts.metaFields // Send along all fields by default.
    : Object.keys(meta);
    metaFields.forEach(function (item) {
      formData.append(item, meta[item]);
    });
  };

  _proto.createFormDataUpload = function createFormDataUpload(file, opts) {
    var formPost = new FormData();
    this.addMetadata(formPost, file.meta, opts);
    var dataWithUpdatedType = setTypeInBlob(file);

    if (file.name) {
      formPost.append(opts.fieldName, dataWithUpdatedType, file.meta.name);
    } else {
      formPost.append(opts.fieldName, dataWithUpdatedType);
    }

    return formPost;
  };

  _proto.createBundledUpload = function createBundledUpload(files, opts) {
    var _this2 = this;

    var formPost = new FormData();

    var _this$uppy$getState = this.uppy.getState(),
        meta = _this$uppy$getState.meta;

    this.addMetadata(formPost, meta, opts);
    files.forEach(function (file) {
      var opts = _this2.getOptions(file);

      var dataWithUpdatedType = setTypeInBlob(file);

      if (file.name) {
        formPost.append(opts.fieldName, dataWithUpdatedType, file.name);
      } else {
        formPost.append(opts.fieldName, dataWithUpdatedType);
      }
    });
    return formPost;
  };

  _proto.createBareUpload = function createBareUpload(file, opts) {
    return file.data;
  };

  _proto.upload = function upload(file, current, total) {
    var _this3 = this;

    var opts = this.getOptions(file);
    this.uppy.log("uploading " + current + " of " + total);
    return new Promise(function (resolve, reject) {
      _this3.uppy.emit('upload-started', file);

      var data = opts.formData ? _this3.createFormDataUpload(file, opts) : _this3.createBareUpload(file, opts);
      var xhr = new XMLHttpRequest();
      _this3.uploaderEvents[file.id] = new EventTracker(_this3.uppy);
      var timer = new ProgressTimeout(opts.timeout, function () {
        xhr.abort();
        queuedRequest.done();
        var error = new Error(_this3.i18n('timedOut', {
          seconds: Math.ceil(opts.timeout / 1000)
        }));

        _this3.uppy.emit('upload-error', file, error);

        reject(error);
      });
      var id = cuid();
      xhr.upload.addEventListener('loadstart', function (ev) {
        _this3.uppy.log("[XHRUpload] " + id + " started");
      });
      xhr.upload.addEventListener('progress', function (ev) {
        _this3.uppy.log("[XHRUpload] " + id + " progress: " + ev.loaded + " / " + ev.total); // Begin checking for timeouts when progress starts, instead of loading,
        // to avoid timing out requests on browser concurrency queue


        timer.progress();

        if (ev.lengthComputable) {
          _this3.uppy.emit('upload-progress', file, {
            uploader: _this3,
            bytesUploaded: ev.loaded,
            bytesTotal: ev.total
          });
        }
      });
      xhr.addEventListener('load', function (ev) {
        _this3.uppy.log("[XHRUpload] " + id + " finished");

        timer.done();
        queuedRequest.done();

        if (_this3.uploaderEvents[file.id]) {
          _this3.uploaderEvents[file.id].remove();

          _this3.uploaderEvents[file.id] = null;
        }

        if (opts.validateStatus(ev.target.status, xhr.responseText, xhr)) {
          var body = opts.getResponseData(xhr.responseText, xhr);
          var uploadURL = body[opts.responseUrlFieldName];
          var uploadResp = {
            status: ev.target.status,
            body: body,
            uploadURL: uploadURL
          };

          _this3.uppy.emit('upload-success', file, uploadResp);

          if (uploadURL) {
            _this3.uppy.log("Download " + file.name + " from " + uploadURL);
          }

          return resolve(file);
        } else {
          var _body = opts.getResponseData(xhr.responseText, xhr);

          var error = buildResponseError(xhr, opts.getResponseError(xhr.responseText, xhr));
          var response = {
            status: ev.target.status,
            body: _body
          };

          _this3.uppy.emit('upload-error', file, error, response);

          return reject(error);
        }
      });
      xhr.addEventListener('error', function (ev) {
        _this3.uppy.log("[XHRUpload] " + id + " errored");

        timer.done();
        queuedRequest.done();

        if (_this3.uploaderEvents[file.id]) {
          _this3.uploaderEvents[file.id].remove();

          _this3.uploaderEvents[file.id] = null;
        }

        var error = buildResponseError(xhr, opts.getResponseError(xhr.responseText, xhr));

        _this3.uppy.emit('upload-error', file, error);

        return reject(error);
      });
      xhr.open(opts.method.toUpperCase(), opts.endpoint, true); // IE10 does not allow setting `withCredentials` and `responseType`
      // before `open()` is called.

      xhr.withCredentials = opts.withCredentials;

      if (opts.responseType !== '') {
        xhr.responseType = opts.responseType;
      }

      Object.keys(opts.headers).forEach(function (header) {
        xhr.setRequestHeader(header, opts.headers[header]);
      });

      var queuedRequest = _this3.requests.run(function () {
        xhr.send(data);
        return function () {
          timer.done();
          xhr.abort();
        };
      });

      _this3.onFileRemove(file.id, function () {
        queuedRequest.abort();
        reject(new Error('File removed'));
      });

      _this3.onCancelAll(file.id, function () {
        queuedRequest.abort();
        reject(new Error('Upload cancelled'));
      });
    });
  };

  _proto.uploadRemote = function uploadRemote(file, current, total) {
    var _this4 = this;

    var opts = this.getOptions(file);
    return new Promise(function (resolve, reject) {
      _this4.uppy.emit('upload-started', file);

      var fields = {};
      var metaFields = Array.isArray(opts.metaFields) ? opts.metaFields // Send along all fields by default.
      : Object.keys(file.meta);
      metaFields.forEach(function (name) {
        fields[name] = file.meta[name];
      });
      var Client = file.remote.providerOptions.provider ? Provider : RequestClient;
      var client = new Client(_this4.uppy, file.remote.providerOptions);
      client.post(file.remote.url, _extends({}, file.remote.body, {
        endpoint: opts.endpoint,
        size: file.data.size,
        fieldname: opts.fieldName,
        metadata: fields,
        httpMethod: opts.method,
        useFormData: opts.formData,
        headers: opts.headers
      })).then(function (res) {
        var token = res.token;
        var host = getSocketHost(file.remote.companionUrl);
        var socket = new Socket({
          target: host + "/api/" + token,
          autoOpen: false
        });
        _this4.uploaderEvents[file.id] = new EventTracker(_this4.uppy);

        _this4.onFileRemove(file.id, function () {
          socket.send('pause', {});
          queuedRequest.abort();
          resolve("upload " + file.id + " was removed");
        });

        _this4.onCancelAll(file.id, function () {
          socket.send('pause', {});
          queuedRequest.abort();
          resolve("upload " + file.id + " was canceled");
        });

        _this4.onRetry(file.id, function () {
          socket.send('pause', {});
          socket.send('resume', {});
        });

        _this4.onRetryAll(file.id, function () {
          socket.send('pause', {});
          socket.send('resume', {});
        });

        socket.on('progress', function (progressData) {
          return emitSocketProgress(_this4, progressData, file);
        });
        socket.on('success', function (data) {
          var body = opts.getResponseData(data.response.responseText, data.response);
          var uploadURL = body[opts.responseUrlFieldName];
          var uploadResp = {
            status: data.response.status,
            body: body,
            uploadURL: uploadURL
          };

          _this4.uppy.emit('upload-success', file, uploadResp);

          queuedRequest.done();

          if (_this4.uploaderEvents[file.id]) {
            _this4.uploaderEvents[file.id].remove();

            _this4.uploaderEvents[file.id] = null;
          }

          return resolve();
        });
        socket.on('error', function (errData) {
          var resp = errData.response;
          var error = resp ? opts.getResponseError(resp.responseText, resp) : _extends(new Error(errData.error.message), {
            cause: errData.error
          });

          _this4.uppy.emit('upload-error', file, error);

          queuedRequest.done();

          if (_this4.uploaderEvents[file.id]) {
            _this4.uploaderEvents[file.id].remove();

            _this4.uploaderEvents[file.id] = null;
          }

          reject(error);
        });

        var queuedRequest = _this4.requests.run(function () {
          socket.open();

          if (file.isPaused) {
            socket.send('pause', {});
          }

          return function () {
            return socket.close();
          };
        });
      }).catch(function (err) {
        _this4.uppy.emit('upload-error', file, err);

        reject(err);
      });
    });
  };

  _proto.uploadBundle = function uploadBundle(files) {
    var _this5 = this;

    return new Promise(function (resolve, reject) {
      var endpoint = _this5.opts.endpoint;
      var method = _this5.opts.method;

      var optsFromState = _this5.uppy.getState().xhrUpload;

      var formData = _this5.createBundledUpload(files, _extends({}, _this5.opts, optsFromState || {}));

      var xhr = new XMLHttpRequest();
      var timer = new ProgressTimeout(_this5.opts.timeout, function () {
        xhr.abort();
        var error = new Error(_this5.i18n('timedOut', {
          seconds: Math.ceil(_this5.opts.timeout / 1000)
        }));
        emitError(error);
        reject(error);
      });

      var emitError = function emitError(error) {
        files.forEach(function (file) {
          _this5.uppy.emit('upload-error', file, error);
        });
      };

      xhr.upload.addEventListener('loadstart', function (ev) {
        _this5.uppy.log('[XHRUpload] started uploading bundle');

        timer.progress();
      });
      xhr.upload.addEventListener('progress', function (ev) {
        timer.progress();
        if (!ev.lengthComputable) return;
        files.forEach(function (file) {
          _this5.uppy.emit('upload-progress', file, {
            uploader: _this5,
            bytesUploaded: ev.loaded / ev.total * file.size,
            bytesTotal: file.size
          });
        });
      });
      xhr.addEventListener('load', function (ev) {
        timer.done();

        if (_this5.opts.validateStatus(ev.target.status, xhr.responseText, xhr)) {
          var body = _this5.opts.getResponseData(xhr.responseText, xhr);

          var uploadResp = {
            status: ev.target.status,
            body: body
          };
          files.forEach(function (file) {
            _this5.uppy.emit('upload-success', file, uploadResp);
          });
          return resolve();
        }

        var error = _this5.opts.getResponseError(xhr.responseText, xhr) || new Error('Upload error');
        error.request = xhr;
        emitError(error);
        return reject(error);
      });
      xhr.addEventListener('error', function (ev) {
        timer.done();
        var error = _this5.opts.getResponseError(xhr.responseText, xhr) || new Error('Upload error');
        emitError(error);
        return reject(error);
      });

      _this5.uppy.on('cancel-all', function () {
        timer.done();
        xhr.abort();
      });

      xhr.open(method.toUpperCase(), endpoint, true); // IE10 does not allow setting `withCredentials` and `responseType`
      // before `open()` is called.

      xhr.withCredentials = _this5.opts.withCredentials;

      if (_this5.opts.responseType !== '') {
        xhr.responseType = _this5.opts.responseType;
      }

      Object.keys(_this5.opts.headers).forEach(function (header) {
        xhr.setRequestHeader(header, _this5.opts.headers[header]);
      });
      xhr.send(formData);
      files.forEach(function (file) {
        _this5.uppy.emit('upload-started', file);
      });
    });
  };

  _proto.uploadFiles = function uploadFiles(files) {
    var _this6 = this;

    var promises = files.map(function (file, i) {
      var current = parseInt(i, 10) + 1;
      var total = files.length;

      if (file.error) {
        return Promise.reject(new Error(file.error));
      } else if (file.isRemote) {
        return _this6.uploadRemote(file, current, total);
      } else {
        return _this6.upload(file, current, total);
      }
    });
    return settle(promises);
  };

  _proto.onFileRemove = function onFileRemove(fileID, cb) {
    this.uploaderEvents[fileID].on('file-removed', function (file) {
      if (fileID === file.id) cb(file.id);
    });
  };

  _proto.onRetry = function onRetry(fileID, cb) {
    this.uploaderEvents[fileID].on('upload-retry', function (targetFileID) {
      if (fileID === targetFileID) {
        cb();
      }
    });
  };

  _proto.onRetryAll = function onRetryAll(fileID, cb) {
    var _this7 = this;

    this.uploaderEvents[fileID].on('retry-all', function (filesToRetry) {
      if (!_this7.uppy.getFile(fileID)) return;
      cb();
    });
  };

  _proto.onCancelAll = function onCancelAll(fileID, cb) {
    var _this8 = this;

    this.uploaderEvents[fileID].on('cancel-all', function () {
      if (!_this8.uppy.getFile(fileID)) return;
      cb();
    });
  };

  _proto.handleUpload = function handleUpload(fileIDs) {
    var _this9 = this;

    if (fileIDs.length === 0) {
      this.uppy.log('[XHRUpload] No files to upload!');
      return Promise.resolve();
    } // no limit configured by the user, and no RateLimitedQueue passed in by a "parent" plugin (basically just AwsS3) using the top secret `__queue` option


    if (this.opts.limit === 0 && !this.opts.__queue) {
      this.uppy.log('[XHRUpload] When uploading multiple files at once, consider setting the `limit` option (to `10` for example), to limit the number of concurrent uploads, which helps prevent memory and network issues: https://uppy.io/docs/xhr-upload/#limit-0', 'warning');
    }

    this.uppy.log('[XHRUpload] Uploading...');
    var files = fileIDs.map(function (fileID) {
      return _this9.uppy.getFile(fileID);
    });

    if (this.opts.bundle) {
      // if bundle: true, we don’t support remote uploads
      var isSomeFileRemote = files.some(function (file) {
        return file.isRemote;
      });

      if (isSomeFileRemote) {
        throw new Error('Can’t upload remote files when bundle: true option is set');
      }

      return this.uploadBundle(files);
    }

    return this.uploadFiles(files).then(function () {
      return null;
    });
  };

  _proto.install = function install() {
    if (this.opts.bundle) {
      var _this$uppy$getState2 = this.uppy.getState(),
          capabilities = _this$uppy$getState2.capabilities;

      this.uppy.setState({
        capabilities: _extends({}, capabilities, {
          individualCancellation: false
        })
      });
    }

    this.uppy.addUploader(this.handleUpload);
  };

  _proto.uninstall = function uninstall() {
    if (this.opts.bundle) {
      var _this$uppy$getState3 = this.uppy.getState(),
          capabilities = _this$uppy$getState3.capabilities;

      this.uppy.setState({
        capabilities: _extends({}, capabilities, {
          individualCancellation: true
        })
      });
    }

    this.uppy.removeUploader(this.handleUpload);
  };

  return XHRUpload;
}(Plugin), _class.VERSION = require('../package.json').version, _temp);

},{"../package.json":53,"./../../companion-client":21,"./../../core":25,"./../../utils/lib/EventTracker":34,"./../../utils/lib/NetworkError":35,"./../../utils/lib/ProgressTimeout":36,"./../../utils/lib/RateLimitedQueue":37,"./../../utils/lib/Translator":38,"./../../utils/lib/emitSocketProgress":39,"./../../utils/lib/getSocketHost":45,"./../../utils/lib/isNetworkError":49,"./../../utils/lib/settle":51,"cuid":2}],55:[function(require,module,exports){
require('es6-promise/auto');

require('whatwg-fetch');

var Uppy = require('./../../../../packages/@uppy/core');

var FileInput = require('./../../../../packages/@uppy/file-input');

var XHRUpload = require('./../../../../packages/@uppy/xhr-upload');

var ProgressBar = require('./../../../../packages/@uppy/progress-bar');

var uppy = new Uppy({
  debug: true,
  autoProceed: true
});
uppy.use(FileInput, {
  target: '.UppyForm',
  replaceTargetContent: true
});
uppy.use(ProgressBar, {
  target: '.UppyProgressBar',
  hideAfterFinish: false
});
uppy.use(XHRUpload, {
  endpoint: 'https://xhr-server.herokuapp.com/upload',
  formData: true,
  fieldName: 'files[]'
}); // And display uploaded files

uppy.on('upload-success', function (file, response) {
  var url = response.uploadURL;
  var fileName = file.name;
  var li = document.createElement('li');
  var a = document.createElement('a');
  a.href = url;
  a.target = '_blank';
  a.appendChild(document.createTextNode(fileName));
  li.appendChild(a);
  document.querySelector('.uploaded-files ol').appendChild(li);
});

},{"./../../../../packages/@uppy/core":25,"./../../../../packages/@uppy/file-input":29,"./../../../../packages/@uppy/progress-bar":31,"./../../../../packages/@uppy/xhr-upload":54,"es6-promise/auto":6,"whatwg-fetch":13}]},{},[55])
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uL25vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCIuLi9ub2RlX21vZHVsZXMvQHRyYW5zbG9hZGl0L3ByZXR0aWVyLWJ5dGVzL3ByZXR0aWVyQnl0ZXMuanMiLCIuLi9ub2RlX21vZHVsZXMvY3VpZC9pbmRleC5qcyIsIi4uL25vZGVfbW9kdWxlcy9jdWlkL2xpYi9maW5nZXJwcmludC5icm93c2VyLmpzIiwiLi4vbm9kZV9tb2R1bGVzL2N1aWQvbGliL2dldFJhbmRvbVZhbHVlLmJyb3dzZXIuanMiLCIuLi9ub2RlX21vZHVsZXMvY3VpZC9saWIvcGFkLmpzIiwiLi4vbm9kZV9tb2R1bGVzL2VzNi1wcm9taXNlL2F1dG8uanMiLCIuLi9ub2RlX21vZHVsZXMvZXM2LXByb21pc2UvZGlzdC9lczYtcHJvbWlzZS5qcyIsIi4uL25vZGVfbW9kdWxlcy9sb2Rhc2gudGhyb3R0bGUvaW5kZXguanMiLCIuLi9ub2RlX21vZHVsZXMvbWltZS1tYXRjaC9pbmRleC5qcyIsIi4uL25vZGVfbW9kdWxlcy9uYW1lc3BhY2UtZW1pdHRlci9pbmRleC5qcyIsIi4uL25vZGVfbW9kdWxlcy9wcmVhY3QvZGlzdC9wcmVhY3QuanMiLCIuLi9ub2RlX21vZHVsZXMvcHJvY2Vzcy9icm93c2VyLmpzIiwiLi4vbm9kZV9tb2R1bGVzL3doYXR3Zy1mZXRjaC9kaXN0L2ZldGNoLnVtZC5qcyIsIi4uL25vZGVfbW9kdWxlcy93aWxkY2FyZC9pbmRleC5qcyIsIi4uL3BhY2thZ2VzL0B1cHB5L2NvbXBhbmlvbi1jbGllbnQvcGFja2FnZS5qc29uIiwiLi4vcGFja2FnZXMvQHVwcHkvY29tcGFuaW9uLWNsaWVudC9zcmMvQXV0aEVycm9yLmpzIiwiLi4vcGFja2FnZXMvQHVwcHkvY29tcGFuaW9uLWNsaWVudC9zcmMvUHJvdmlkZXIuanMiLCIuLi9wYWNrYWdlcy9AdXBweS9jb21wYW5pb24tY2xpZW50L3NyYy9SZXF1ZXN0Q2xpZW50LmpzIiwiLi4vcGFja2FnZXMvQHVwcHkvY29tcGFuaW9uLWNsaWVudC9zcmMvU2VhcmNoUHJvdmlkZXIuanMiLCIuLi9wYWNrYWdlcy9AdXBweS9jb21wYW5pb24tY2xpZW50L3NyYy9Tb2NrZXQuanMiLCIuLi9wYWNrYWdlcy9AdXBweS9jb21wYW5pb24tY2xpZW50L3NyYy9pbmRleC5qcyIsIi4uL3BhY2thZ2VzL0B1cHB5L2NvbXBhbmlvbi1jbGllbnQvc3JjL3Rva2VuU3RvcmFnZS5qcyIsIi4uL3BhY2thZ2VzL0B1cHB5L2NvcmUvcGFja2FnZS5qc29uIiwiLi4vcGFja2FnZXMvQHVwcHkvY29yZS9zcmMvUGx1Z2luLmpzIiwiLi4vcGFja2FnZXMvQHVwcHkvY29yZS9zcmMvaW5kZXguanMiLCIuLi9wYWNrYWdlcy9AdXBweS9jb3JlL3NyYy9sb2dnZXJzLmpzIiwiLi4vcGFja2FnZXMvQHVwcHkvY29yZS9zcmMvc3VwcG9ydHNVcGxvYWRQcm9ncmVzcy5qcyIsIi4uL3BhY2thZ2VzL0B1cHB5L2ZpbGUtaW5wdXQvcGFja2FnZS5qc29uIiwiLi4vcGFja2FnZXMvQHVwcHkvZmlsZS1pbnB1dC9zcmMvaW5kZXguanMiLCIuLi9wYWNrYWdlcy9AdXBweS9wcm9ncmVzcy1iYXIvcGFja2FnZS5qc29uIiwiLi4vcGFja2FnZXMvQHVwcHkvcHJvZ3Jlc3MtYmFyL3NyYy9pbmRleC5qcyIsIi4uL3BhY2thZ2VzL0B1cHB5L3N0b3JlLWRlZmF1bHQvcGFja2FnZS5qc29uIiwiLi4vcGFja2FnZXMvQHVwcHkvc3RvcmUtZGVmYXVsdC9zcmMvaW5kZXguanMiLCIuLi9wYWNrYWdlcy9AdXBweS91dGlscy9zcmMvRXZlbnRUcmFja2VyLmpzIiwiLi4vcGFja2FnZXMvQHVwcHkvdXRpbHMvc3JjL05ldHdvcmtFcnJvci5qcyIsIi4uL3BhY2thZ2VzL0B1cHB5L3V0aWxzL3NyYy9Qcm9ncmVzc1RpbWVvdXQuanMiLCIuLi9wYWNrYWdlcy9AdXBweS91dGlscy9zcmMvUmF0ZUxpbWl0ZWRRdWV1ZS5qcyIsIi4uL3BhY2thZ2VzL0B1cHB5L3V0aWxzL3NyYy9UcmFuc2xhdG9yLmpzIiwiLi4vcGFja2FnZXMvQHVwcHkvdXRpbHMvc3JjL2VtaXRTb2NrZXRQcm9ncmVzcy5qcyIsIi4uL3BhY2thZ2VzL0B1cHB5L3V0aWxzL3NyYy9mZXRjaFdpdGhOZXR3b3JrRXJyb3IuanMiLCIuLi9wYWNrYWdlcy9AdXBweS91dGlscy9zcmMvZmluZERPTUVsZW1lbnQuanMiLCIuLi9wYWNrYWdlcy9AdXBweS91dGlscy9zcmMvZ2VuZXJhdGVGaWxlSUQuanMiLCIuLi9wYWNrYWdlcy9AdXBweS91dGlscy9zcmMvZ2V0RmlsZU5hbWVBbmRFeHRlbnNpb24uanMiLCIuLi9wYWNrYWdlcy9AdXBweS91dGlscy9zcmMvZ2V0RmlsZVR5cGUuanMiLCIuLi9wYWNrYWdlcy9AdXBweS91dGlscy9zcmMvZ2V0U29ja2V0SG9zdC5qcyIsIi4uL3BhY2thZ2VzL0B1cHB5L3V0aWxzL3NyYy9nZXRUaW1lU3RhbXAuanMiLCIuLi9wYWNrYWdlcy9AdXBweS91dGlscy9zcmMvaGFzUHJvcGVydHkuanMiLCIuLi9wYWNrYWdlcy9AdXBweS91dGlscy9zcmMvaXNET01FbGVtZW50LmpzIiwiLi4vcGFja2FnZXMvQHVwcHkvdXRpbHMvc3JjL2lzTmV0d29ya0Vycm9yLmpzIiwiLi4vcGFja2FnZXMvQHVwcHkvdXRpbHMvc3JjL21pbWVUeXBlcy5qcyIsIi4uL3BhY2thZ2VzL0B1cHB5L3V0aWxzL3NyYy9zZXR0bGUuanMiLCIuLi9wYWNrYWdlcy9AdXBweS91dGlscy9zcmMvdG9BcnJheS5qcyIsIi4uL3BhY2thZ2VzL0B1cHB5L3hoci11cGxvYWQvcGFja2FnZS5qc29uIiwiLi4vcGFja2FnZXMvQHVwcHkveGhyLXVwbG9hZC9zcmMvaW5kZXguanMiLCJzcmMvZXhhbXBsZXMveGhydXBsb2FkL2FwcC5lczYiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7QUNBQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQy9CQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNwRkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDWkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDbEJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDSkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7O0FDSkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7Ozs7QUN0cENBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7Ozs7QUN2YkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDeEJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDeElBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUN2WkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUN4TEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDbmhCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUM3RkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDM0JBOzs7Ozs7Ozs7Ozs7Ozs7O0lBRU0sUzs7O0FBQ0osdUJBQWU7QUFBQTs7QUFDYiw4QkFBTSx3QkFBTjtBQUNBLFVBQUssSUFBTCxHQUFZLFdBQVo7QUFDQSxVQUFLLFdBQUwsR0FBbUIsSUFBbkI7QUFIYTtBQUlkOzs7aUNBTHFCLEs7O0FBUXhCLE1BQU0sQ0FBQyxPQUFQLEdBQWlCLFNBQWpCOzs7QUNWQTs7Ozs7O0FBRUEsSUFBTSxhQUFhLEdBQUcsT0FBTyxDQUFDLGlCQUFELENBQTdCOztBQUNBLElBQU0sWUFBWSxHQUFHLE9BQU8sQ0FBQyxnQkFBRCxDQUE1Qjs7QUFFQSxJQUFNLFFBQVEsR0FBRyxTQUFYLFFBQVcsQ0FBQyxFQUFELEVBQVE7QUFDdkIsU0FBTyxFQUFFLENBQUMsS0FBSCxDQUFTLEdBQVQsRUFBYyxHQUFkLENBQWtCLFVBQUMsQ0FBRDtBQUFBLFdBQU8sQ0FBQyxDQUFDLE1BQUYsQ0FBUyxDQUFULEVBQVksV0FBWixLQUE0QixDQUFDLENBQUMsS0FBRixDQUFRLENBQVIsQ0FBbkM7QUFBQSxHQUFsQixFQUFpRSxJQUFqRSxDQUFzRSxHQUF0RSxDQUFQO0FBQ0QsQ0FGRDs7QUFJQSxNQUFNLENBQUMsT0FBUDtBQUFBOztBQUNFLG9CQUFhLElBQWIsRUFBbUIsSUFBbkIsRUFBeUI7QUFBQTs7QUFDdkIsc0NBQU0sSUFBTixFQUFZLElBQVo7QUFDQSxVQUFLLFFBQUwsR0FBZ0IsSUFBSSxDQUFDLFFBQXJCO0FBQ0EsVUFBSyxFQUFMLEdBQVUsTUFBSyxRQUFmO0FBQ0EsVUFBSyxJQUFMLEdBQVksTUFBSyxJQUFMLENBQVUsSUFBVixJQUFrQixRQUFRLENBQUMsTUFBSyxFQUFOLENBQXRDO0FBQ0EsVUFBSyxRQUFMLEdBQWdCLE1BQUssSUFBTCxDQUFVLFFBQTFCO0FBQ0EsVUFBSyxRQUFMLGtCQUE2QixNQUFLLFFBQWxDO0FBTnVCO0FBT3hCOztBQVJIOztBQUFBLFNBVUUsT0FWRixHQVVFLG1CQUFXO0FBQ1QsV0FBTyxPQUFPLENBQUMsR0FBUixDQUFZLDBCQUFPLE9BQVAsYUFBa0IsS0FBSyxZQUFMLEVBQWxCLENBQVosRUFDSixJQURJLENBQ0M7QUFBQSxVQUFFLE9BQUY7QUFBQSxVQUFXLEtBQVg7QUFBQSxhQUNKLFNBQWMsRUFBZCxFQUFrQixPQUFsQixFQUEyQjtBQUFFLDJCQUFtQjtBQUFyQixPQUEzQixDQURJO0FBQUEsS0FERCxDQUFQO0FBSUQsR0FmSDs7QUFBQSxTQWlCRSxpQkFqQkYsR0FpQkUsMkJBQW1CLFFBQW5CLEVBQTZCO0FBQzNCLElBQUEsUUFBUSw0QkFBUyxpQkFBVCxZQUEyQixRQUEzQixDQUFSO0FBQ0EsUUFBTSxNQUFNLEdBQUcsS0FBSyxJQUFMLENBQVUsU0FBVixDQUFvQixLQUFLLFFBQXpCLENBQWY7QUFDQSxRQUFNLGdCQUFnQixHQUFHLE1BQU0sQ0FBQyxjQUFQLEdBQXdCLGFBQWpEO0FBQ0EsUUFBTSxhQUFhLEdBQUcsZ0JBQWdCLEdBQUcsUUFBUSxDQUFDLE1BQVQsS0FBb0IsR0FBdkIsR0FBNkIsUUFBUSxDQUFDLE1BQVQsR0FBa0IsR0FBckY7QUFDQSxJQUFBLE1BQU0sQ0FBQyxjQUFQLENBQXNCO0FBQUUsTUFBQSxhQUFhLEVBQWI7QUFBRixLQUF0QjtBQUNBLFdBQU8sUUFBUDtBQUNELEdBeEJILENBMEJFO0FBMUJGOztBQUFBLFNBMkJFLFlBM0JGLEdBMkJFLHNCQUFjLEtBQWQsRUFBcUI7QUFDbkIsV0FBTyxLQUFLLElBQUwsQ0FBVSxTQUFWLENBQW9CLEtBQUssUUFBekIsRUFBbUMsT0FBbkMsQ0FBMkMsT0FBM0MsQ0FBbUQsS0FBSyxRQUF4RCxFQUFrRSxLQUFsRSxDQUFQO0FBQ0QsR0E3Qkg7O0FBQUEsU0ErQkUsWUEvQkYsR0ErQkUsd0JBQWdCO0FBQ2QsV0FBTyxLQUFLLElBQUwsQ0FBVSxTQUFWLENBQW9CLEtBQUssUUFBekIsRUFBbUMsT0FBbkMsQ0FBMkMsT0FBM0MsQ0FBbUQsS0FBSyxRQUF4RCxDQUFQO0FBQ0QsR0FqQ0g7O0FBQUEsU0FtQ0UsT0FuQ0YsR0FtQ0UsbUJBQVc7QUFDVCxXQUFVLEtBQUssUUFBZixTQUEyQixLQUFLLEVBQWhDO0FBQ0QsR0FyQ0g7O0FBQUEsU0F1Q0UsT0F2Q0YsR0F1Q0UsaUJBQVMsRUFBVCxFQUFhO0FBQ1gsV0FBVSxLQUFLLFFBQWYsU0FBMkIsS0FBSyxFQUFoQyxhQUEwQyxFQUExQztBQUNELEdBekNIOztBQUFBLFNBMkNFLElBM0NGLEdBMkNFLGNBQU0sU0FBTixFQUFpQjtBQUNmLFdBQU8sS0FBSyxHQUFMLENBQVksS0FBSyxFQUFqQixlQUE0QixTQUFTLElBQUksRUFBekMsRUFBUDtBQUNELEdBN0NIOztBQUFBLFNBK0NFLE1BL0NGLEdBK0NFLGtCQUFVO0FBQUE7O0FBQ1IsV0FBTyxLQUFLLEdBQUwsQ0FBWSxLQUFLLEVBQWpCLGNBQ0osSUFESSxDQUNDLFVBQUMsUUFBRDtBQUFBLGFBQWMsT0FBTyxDQUFDLEdBQVIsQ0FBWSxDQUM5QixRQUQ4QixFQUU5QixNQUFJLENBQUMsSUFBTCxDQUFVLFNBQVYsQ0FBb0IsTUFBSSxDQUFDLFFBQXpCLEVBQW1DLE9BQW5DLENBQTJDLFVBQTNDLENBQXNELE1BQUksQ0FBQyxRQUEzRCxDQUY4QixDQUFaLENBQWQ7QUFBQSxLQURELEVBSUQsSUFKQyxDQUlJO0FBQUEsVUFBRSxRQUFGO0FBQUEsYUFBZ0IsUUFBaEI7QUFBQSxLQUpKLENBQVA7QUFLRCxHQXJESDs7QUFBQSxXQXVEUyxVQXZEVCxHQXVERSxvQkFBbUIsTUFBbkIsRUFBMkIsSUFBM0IsRUFBaUMsV0FBakMsRUFBOEM7QUFDNUMsSUFBQSxNQUFNLENBQUMsSUFBUCxHQUFjLFVBQWQ7QUFDQSxJQUFBLE1BQU0sQ0FBQyxLQUFQLEdBQWUsRUFBZjs7QUFDQSxRQUFJLFdBQUosRUFBaUI7QUFDZixNQUFBLE1BQU0sQ0FBQyxJQUFQLEdBQWMsU0FBYyxFQUFkLEVBQWtCLFdBQWxCLEVBQStCLElBQS9CLENBQWQ7QUFDRDs7QUFFRCxRQUFJLElBQUksQ0FBQyxTQUFMLElBQWtCLElBQUksQ0FBQyxhQUEzQixFQUEwQztBQUN4QyxZQUFNLElBQUksS0FBSixDQUFVLG1RQUFWLENBQU47QUFDRDs7QUFFRCxRQUFJLElBQUksQ0FBQyxxQkFBVCxFQUFnQztBQUM5QixVQUFNLE9BQU8sR0FBRyxJQUFJLENBQUMscUJBQXJCLENBRDhCLENBRTlCOztBQUNBLFVBQUksT0FBTyxPQUFQLEtBQW1CLFFBQW5CLElBQStCLENBQUMsS0FBSyxDQUFDLE9BQU4sQ0FBYyxPQUFkLENBQWhDLElBQTBELEVBQUUsT0FBTyxZQUFZLE1BQXJCLENBQTlELEVBQTRGO0FBQzFGLGNBQU0sSUFBSSxTQUFKLENBQWlCLE1BQU0sQ0FBQyxFQUF4QixpRkFBTjtBQUNEOztBQUNELE1BQUEsTUFBTSxDQUFDLElBQVAsQ0FBWSxxQkFBWixHQUFvQyxPQUFwQztBQUNELEtBUEQsTUFPTztBQUNMO0FBQ0EsVUFBSSx1QkFBdUIsSUFBdkIsQ0FBNEIsSUFBSSxDQUFDLFlBQWpDLENBQUosRUFBb0Q7QUFDbEQsUUFBQSxNQUFNLENBQUMsSUFBUCxDQUFZLHFCQUFaLGdCQUErQyxJQUFJLENBQUMsWUFBTCxDQUFrQixPQUFsQixDQUEwQixPQUExQixFQUFtQyxFQUFuQyxDQUEvQztBQUNELE9BRkQsTUFFTztBQUNMLFFBQUEsTUFBTSxDQUFDLElBQVAsQ0FBWSxxQkFBWixHQUFvQyxJQUFJLENBQUMsWUFBekM7QUFDRDtBQUNGOztBQUVELElBQUEsTUFBTSxDQUFDLE9BQVAsR0FBaUIsTUFBTSxDQUFDLElBQVAsQ0FBWSxPQUFaLElBQXVCLFlBQXhDO0FBQ0QsR0FuRkg7O0FBQUE7QUFBQSxFQUF3QyxhQUF4Qzs7O0FDVEE7Ozs7Ozs7Ozs7QUFFQSxJQUFNLFNBQVMsR0FBRyxPQUFPLENBQUMsYUFBRCxDQUF6Qjs7QUFDQSxJQUFNLHFCQUFxQixHQUFHLE9BQU8sQ0FBQyx1Q0FBRCxDQUFyQyxDLENBRUE7OztBQUNBLFNBQVMsVUFBVCxDQUFxQixHQUFyQixFQUEwQjtBQUN4QixTQUFPLEdBQUcsQ0FBQyxPQUFKLENBQVksS0FBWixFQUFtQixFQUFuQixDQUFQO0FBQ0Q7O0FBRUQsTUFBTSxDQUFDLE9BQVA7QUFHRSx5QkFBYSxJQUFiLEVBQW1CLElBQW5CLEVBQXlCO0FBQ3ZCLFNBQUssSUFBTCxHQUFZLElBQVo7QUFDQSxTQUFLLElBQUwsR0FBWSxJQUFaO0FBQ0EsU0FBSyxpQkFBTCxHQUF5QixLQUFLLGlCQUFMLENBQXVCLElBQXZCLENBQTRCLElBQTVCLENBQXpCO0FBQ0EsU0FBSyxjQUFMLEdBQXNCLENBQUMsUUFBRCxFQUFXLGNBQVgsRUFBMkIsaUJBQTNCLENBQXRCO0FBQ0EsU0FBSyxhQUFMLEdBQXFCLEtBQXJCO0FBQ0Q7O0FBVEg7O0FBQUEsU0F5QkUsT0F6QkYsR0F5QkUsbUJBQVc7QUFDVCxRQUFNLFdBQVcsR0FBRyxLQUFLLElBQUwsQ0FBVSxnQkFBVixJQUE4QixLQUFLLElBQUwsQ0FBVSxhQUF4QyxJQUF5RCxFQUE3RTtBQUNBLFdBQU8sT0FBTyxDQUFDLE9BQVIsY0FDRixLQUFLLGNBREgsRUFFRixXQUZFLEVBQVA7QUFJRCxHQS9CSDs7QUFBQSxTQWlDRSxvQkFqQ0YsR0FpQ0UsOEJBQXNCLElBQXRCLEVBQTRCO0FBQUE7O0FBQzFCLFdBQU8sVUFBQyxRQUFELEVBQWM7QUFDbkIsVUFBSSxDQUFDLElBQUwsRUFBVztBQUNULGVBQU8sS0FBSSxDQUFDLGlCQUFMLENBQXVCLFFBQXZCLENBQVA7QUFDRDs7QUFFRCxhQUFPLFFBQVA7QUFDRCxLQU5EO0FBT0QsR0F6Q0g7O0FBQUEsU0EyQ0UsaUJBM0NGLEdBMkNFLDJCQUFtQixRQUFuQixFQUE2QjtBQUMzQixRQUFNLEtBQUssR0FBRyxLQUFLLElBQUwsQ0FBVSxRQUFWLEVBQWQ7QUFDQSxRQUFNLFNBQVMsR0FBRyxLQUFLLENBQUMsU0FBTixJQUFtQixFQUFyQztBQUNBLFFBQU0sSUFBSSxHQUFHLEtBQUssSUFBTCxDQUFVLFlBQXZCO0FBQ0EsUUFBTSxPQUFPLEdBQUcsUUFBUSxDQUFDLE9BQXpCLENBSjJCLENBSzNCOztBQUNBLFFBQUksT0FBTyxDQUFDLEdBQVIsQ0FBWSxNQUFaLEtBQXVCLE9BQU8sQ0FBQyxHQUFSLENBQVksTUFBWixNQUF3QixTQUFTLENBQUMsSUFBRCxDQUE1RCxFQUFvRTtBQUFBOztBQUNsRSxXQUFLLElBQUwsQ0FBVSxRQUFWLENBQW1CO0FBQ2pCLFFBQUEsU0FBUyxFQUFFLFNBQWMsRUFBZCxFQUFrQixTQUFsQiw2QkFDUixJQURRLElBQ0QsT0FBTyxDQUFDLEdBQVIsQ0FBWSxNQUFaLENBREM7QUFETSxPQUFuQjtBQUtEOztBQUNELFdBQU8sUUFBUDtBQUNELEdBekRIOztBQUFBLFNBMkRFLE9BM0RGLEdBMkRFLGlCQUFTLEdBQVQsRUFBYztBQUNaLFFBQUksa0JBQWtCLElBQWxCLENBQXVCLEdBQXZCLENBQUosRUFBaUM7QUFDL0IsYUFBTyxHQUFQO0FBQ0Q7O0FBQ0QsV0FBVSxLQUFLLFFBQWYsU0FBMkIsR0FBM0I7QUFDRCxHQWhFSDs7QUFBQSxTQWtFRSxLQWxFRixHQWtFRSxlQUFPLEdBQVAsRUFBWTtBQUNWLFFBQUksR0FBRyxDQUFDLE1BQUosS0FBZSxHQUFuQixFQUF3QjtBQUN0QixZQUFNLElBQUksU0FBSixFQUFOO0FBQ0Q7O0FBRUQsUUFBSSxHQUFHLENBQUMsTUFBSixHQUFhLEdBQWIsSUFBb0IsR0FBRyxDQUFDLE1BQUosR0FBYSxHQUFyQyxFQUEwQztBQUN4QyxVQUFJLE1BQU0sb0NBQWtDLEdBQUcsQ0FBQyxNQUF0QyxVQUFpRCxHQUFHLENBQUMsVUFBL0Q7QUFDQSxhQUFPLEdBQUcsQ0FBQyxJQUFKLEdBQ0osSUFESSxDQUNDLFVBQUMsT0FBRCxFQUFhO0FBQ2pCLFFBQUEsTUFBTSxHQUFHLE9BQU8sQ0FBQyxPQUFSLEdBQXFCLE1BQXJCLGtCQUF3QyxPQUFPLENBQUMsT0FBaEQsR0FBNEQsTUFBckU7QUFDQSxRQUFBLE1BQU0sR0FBRyxPQUFPLENBQUMsU0FBUixHQUF1QixNQUF2QixxQkFBNkMsT0FBTyxDQUFDLFNBQXJELEdBQW1FLE1BQTVFO0FBQ0EsY0FBTSxJQUFJLEtBQUosQ0FBVSxNQUFWLENBQU47QUFDRCxPQUxJLEVBS0YsS0FMRSxDQUtJLFlBQU07QUFBRSxjQUFNLElBQUksS0FBSixDQUFVLE1BQVYsQ0FBTjtBQUF5QixPQUxyQyxDQUFQO0FBTUQ7O0FBQ0QsV0FBTyxHQUFHLENBQUMsSUFBSixFQUFQO0FBQ0QsR0FqRkg7O0FBQUEsU0FtRkUsU0FuRkYsR0FtRkUsbUJBQVcsSUFBWCxFQUFpQjtBQUFBOztBQUNmLFFBQUksS0FBSyxhQUFULEVBQXdCO0FBQ3RCLGFBQU8sT0FBTyxDQUFDLE9BQVIsQ0FBZ0IsS0FBSyxjQUFMLENBQW9CLEtBQXBCLEVBQWhCLENBQVA7QUFDRDs7QUFFRCxXQUFPLEtBQUssQ0FBQyxLQUFLLE9BQUwsQ0FBYSxJQUFiLENBQUQsRUFBcUI7QUFDL0IsTUFBQSxNQUFNLEVBQUU7QUFEdUIsS0FBckIsQ0FBTCxDQUdKLElBSEksQ0FHQyxVQUFDLFFBQUQsRUFBYztBQUNsQixVQUFJLFFBQVEsQ0FBQyxPQUFULENBQWlCLEdBQWpCLENBQXFCLDhCQUFyQixDQUFKLEVBQTBEO0FBQ3hELFFBQUEsTUFBSSxDQUFDLGNBQUwsR0FBc0IsUUFBUSxDQUFDLE9BQVQsQ0FBaUIsR0FBakIsQ0FBcUIsOEJBQXJCLEVBQ25CLEtBRG1CLENBQ2IsR0FEYSxFQUNSLEdBRFEsQ0FDSixVQUFDLFVBQUQ7QUFBQSxpQkFBZ0IsVUFBVSxDQUFDLElBQVgsR0FBa0IsV0FBbEIsRUFBaEI7QUFBQSxTQURJLENBQXRCO0FBRUQ7O0FBQ0QsTUFBQSxNQUFJLENBQUMsYUFBTCxHQUFxQixJQUFyQjtBQUNBLGFBQU8sTUFBSSxDQUFDLGNBQUwsQ0FBb0IsS0FBcEIsRUFBUDtBQUNELEtBVkksRUFXSixLQVhJLENBV0UsVUFBQyxHQUFELEVBQVM7QUFDZCxNQUFBLE1BQUksQ0FBQyxJQUFMLENBQVUsR0FBVix5REFBb0UsR0FBcEUsRUFBMkUsU0FBM0U7O0FBQ0EsTUFBQSxNQUFJLENBQUMsYUFBTCxHQUFxQixJQUFyQjtBQUNBLGFBQU8sTUFBSSxDQUFDLGNBQUwsQ0FBb0IsS0FBcEIsRUFBUDtBQUNELEtBZkksQ0FBUDtBQWdCRCxHQXhHSDs7QUFBQSxTQTBHRSxtQkExR0YsR0EwR0UsNkJBQXFCLElBQXJCLEVBQTJCO0FBQUE7O0FBQ3pCLFdBQU8sT0FBTyxDQUFDLEdBQVIsQ0FBWSxDQUFDLEtBQUssU0FBTCxDQUFlLElBQWYsQ0FBRCxFQUF1QixLQUFLLE9BQUwsRUFBdkIsQ0FBWixFQUNKLElBREksQ0FDQyxnQkFBK0I7QUFBQSxVQUE3QixjQUE2QjtBQUFBLFVBQWIsT0FBYTtBQUNuQztBQUNBLE1BQUEsTUFBTSxDQUFDLElBQVAsQ0FBWSxPQUFaLEVBQXFCLE9BQXJCLENBQTZCLFVBQUMsTUFBRCxFQUFZO0FBQ3ZDLFlBQUksY0FBYyxDQUFDLE9BQWYsQ0FBdUIsTUFBTSxDQUFDLFdBQVAsRUFBdkIsTUFBaUQsQ0FBQyxDQUF0RCxFQUF5RDtBQUN2RCxVQUFBLE1BQUksQ0FBQyxJQUFMLENBQVUsR0FBVixtREFBOEQsTUFBOUQ7O0FBQ0EsaUJBQU8sT0FBTyxDQUFDLE1BQUQsQ0FBZDtBQUNEO0FBQ0YsT0FMRDtBQU9BLGFBQU8sT0FBUDtBQUNELEtBWEksQ0FBUDtBQVlELEdBdkhIOztBQUFBLFNBeUhFLEdBekhGLEdBeUhFLGFBQUssSUFBTCxFQUFXLGdCQUFYLEVBQTZCO0FBQUE7O0FBQzNCLFdBQU8sS0FBSyxtQkFBTCxDQUF5QixJQUF6QixFQUNKLElBREksQ0FDQyxVQUFDLE9BQUQ7QUFBQSxhQUNKLHFCQUFxQixDQUFDLE1BQUksQ0FBQyxPQUFMLENBQWEsSUFBYixDQUFELEVBQXFCO0FBQ3hDLFFBQUEsTUFBTSxFQUFFLEtBRGdDO0FBRXhDLFFBQUEsT0FBTyxFQUFFLE9BRitCO0FBR3hDLFFBQUEsV0FBVyxFQUFFO0FBSDJCLE9BQXJCLENBRGpCO0FBQUEsS0FERCxFQU9KLElBUEksQ0FPQyxLQUFLLG9CQUFMLENBQTBCLGdCQUExQixDQVBELEVBUUosSUFSSSxDQVFDLFVBQUMsR0FBRDtBQUFBLGFBQVMsTUFBSSxDQUFDLEtBQUwsQ0FBVyxHQUFYLENBQVQ7QUFBQSxLQVJELEVBU0osS0FUSSxDQVNFLFVBQUMsR0FBRCxFQUFTO0FBQ2QsTUFBQSxHQUFHLEdBQUcsR0FBRyxDQUFDLFdBQUosR0FBa0IsR0FBbEIsR0FBd0IsSUFBSSxLQUFKLG9CQUEyQixNQUFJLENBQUMsT0FBTCxDQUFhLElBQWIsQ0FBM0IsVUFBa0QsR0FBbEQsQ0FBOUI7QUFDQSxhQUFPLE9BQU8sQ0FBQyxNQUFSLENBQWUsR0FBZixDQUFQO0FBQ0QsS0FaSSxDQUFQO0FBYUQsR0F2SUg7O0FBQUEsU0F5SUUsSUF6SUYsR0F5SUUsY0FBTSxJQUFOLEVBQVksSUFBWixFQUFrQixnQkFBbEIsRUFBb0M7QUFBQTs7QUFDbEMsV0FBTyxLQUFLLG1CQUFMLENBQXlCLElBQXpCLEVBQ0osSUFESSxDQUNDLFVBQUMsT0FBRDtBQUFBLGFBQ0oscUJBQXFCLENBQUMsTUFBSSxDQUFDLE9BQUwsQ0FBYSxJQUFiLENBQUQsRUFBcUI7QUFDeEMsUUFBQSxNQUFNLEVBQUUsTUFEZ0M7QUFFeEMsUUFBQSxPQUFPLEVBQUUsT0FGK0I7QUFHeEMsUUFBQSxXQUFXLEVBQUUsYUFIMkI7QUFJeEMsUUFBQSxJQUFJLEVBQUUsSUFBSSxDQUFDLFNBQUwsQ0FBZSxJQUFmO0FBSmtDLE9BQXJCLENBRGpCO0FBQUEsS0FERCxFQVFKLElBUkksQ0FRQyxLQUFLLG9CQUFMLENBQTBCLGdCQUExQixDQVJELEVBU0osSUFUSSxDQVNDLFVBQUMsR0FBRDtBQUFBLGFBQVMsTUFBSSxDQUFDLEtBQUwsQ0FBVyxHQUFYLENBQVQ7QUFBQSxLQVRELEVBVUosS0FWSSxDQVVFLFVBQUMsR0FBRCxFQUFTO0FBQ2QsTUFBQSxHQUFHLEdBQUcsR0FBRyxDQUFDLFdBQUosR0FBa0IsR0FBbEIsR0FBd0IsSUFBSSxLQUFKLHFCQUE0QixNQUFJLENBQUMsT0FBTCxDQUFhLElBQWIsQ0FBNUIsVUFBbUQsR0FBbkQsQ0FBOUI7QUFDQSxhQUFPLE9BQU8sQ0FBQyxNQUFSLENBQWUsR0FBZixDQUFQO0FBQ0QsS0FiSSxDQUFQO0FBY0QsR0F4Skg7O0FBQUEsU0EwSkUsTUExSkYsR0EwSkUsaUJBQVEsSUFBUixFQUFjLElBQWQsRUFBb0IsZ0JBQXBCLEVBQXNDO0FBQUE7O0FBQ3BDLFdBQU8sS0FBSyxtQkFBTCxDQUF5QixJQUF6QixFQUNKLElBREksQ0FDQyxVQUFDLE9BQUQ7QUFBQSxhQUNKLHFCQUFxQixDQUFJLE1BQUksQ0FBQyxRQUFULFNBQXFCLElBQXJCLEVBQTZCO0FBQ2hELFFBQUEsTUFBTSxFQUFFLFFBRHdDO0FBRWhELFFBQUEsT0FBTyxFQUFFLE9BRnVDO0FBR2hELFFBQUEsV0FBVyxFQUFFLGFBSG1DO0FBSWhELFFBQUEsSUFBSSxFQUFFLElBQUksR0FBRyxJQUFJLENBQUMsU0FBTCxDQUFlLElBQWYsQ0FBSCxHQUEwQjtBQUpZLE9BQTdCLENBRGpCO0FBQUEsS0FERCxFQVFKLElBUkksQ0FRQyxLQUFLLG9CQUFMLENBQTBCLGdCQUExQixDQVJELEVBU0osSUFUSSxDQVNDLFVBQUMsR0FBRDtBQUFBLGFBQVMsTUFBSSxDQUFDLEtBQUwsQ0FBVyxHQUFYLENBQVQ7QUFBQSxLQVRELEVBVUosS0FWSSxDQVVFLFVBQUMsR0FBRCxFQUFTO0FBQ2QsTUFBQSxHQUFHLEdBQUcsR0FBRyxDQUFDLFdBQUosR0FBa0IsR0FBbEIsR0FBd0IsSUFBSSxLQUFKLHVCQUE4QixNQUFJLENBQUMsT0FBTCxDQUFhLElBQWIsQ0FBOUIsVUFBcUQsR0FBckQsQ0FBOUI7QUFDQSxhQUFPLE9BQU8sQ0FBQyxNQUFSLENBQWUsR0FBZixDQUFQO0FBQ0QsS0FiSSxDQUFQO0FBY0QsR0F6S0g7O0FBQUE7QUFBQTtBQUFBLHdCQVdrQjtBQUFBLGdDQUNRLEtBQUssSUFBTCxDQUFVLFFBQVYsRUFEUjtBQUFBLFVBQ04sU0FETSx1QkFDTixTQURNOztBQUVkLFVBQU0sSUFBSSxHQUFHLEtBQUssSUFBTCxDQUFVLFlBQXZCO0FBQ0EsYUFBTyxVQUFVLENBQUMsU0FBUyxJQUFJLFNBQVMsQ0FBQyxJQUFELENBQXRCLEdBQStCLFNBQVMsQ0FBQyxJQUFELENBQXhDLEdBQWlELElBQWxELENBQWpCO0FBQ0Q7QUFmSDtBQUFBO0FBQUEsd0JBaUJ3QjtBQUNwQixhQUFPO0FBQ0wsUUFBQSxNQUFNLEVBQUUsa0JBREg7QUFFTCx3QkFBZ0Isa0JBRlg7QUFHTCxxREFBMkMsYUFBYSxDQUFDO0FBSHBELE9BQVA7QUFLRDtBQXZCSDs7QUFBQTtBQUFBLFlBQ1MsT0FEVCxHQUNtQixPQUFPLENBQUMsaUJBQUQsQ0FBUCxDQUEyQixPQUQ5Qzs7O0FDVkE7Ozs7QUFFQSxJQUFNLGFBQWEsR0FBRyxPQUFPLENBQUMsaUJBQUQsQ0FBN0I7O0FBRUEsSUFBTSxRQUFRLEdBQUcsU0FBWCxRQUFXLENBQUMsRUFBRCxFQUFRO0FBQ3ZCLFNBQU8sRUFBRSxDQUFDLEtBQUgsQ0FBUyxHQUFULEVBQWMsR0FBZCxDQUFrQixVQUFDLENBQUQ7QUFBQSxXQUFPLENBQUMsQ0FBQyxNQUFGLENBQVMsQ0FBVCxFQUFZLFdBQVosS0FBNEIsQ0FBQyxDQUFDLEtBQUYsQ0FBUSxDQUFSLENBQW5DO0FBQUEsR0FBbEIsRUFBaUUsSUFBakUsQ0FBc0UsR0FBdEUsQ0FBUDtBQUNELENBRkQ7O0FBSUEsTUFBTSxDQUFDLE9BQVA7QUFBQTs7QUFDRSwwQkFBYSxJQUFiLEVBQW1CLElBQW5CLEVBQXlCO0FBQUE7O0FBQ3ZCLHNDQUFNLElBQU4sRUFBWSxJQUFaO0FBQ0EsVUFBSyxRQUFMLEdBQWdCLElBQUksQ0FBQyxRQUFyQjtBQUNBLFVBQUssRUFBTCxHQUFVLE1BQUssUUFBZjtBQUNBLFVBQUssSUFBTCxHQUFZLE1BQUssSUFBTCxDQUFVLElBQVYsSUFBa0IsUUFBUSxDQUFDLE1BQUssRUFBTixDQUF0QztBQUNBLFVBQUssUUFBTCxHQUFnQixNQUFLLElBQUwsQ0FBVSxRQUExQjtBQUx1QjtBQU14Qjs7QUFQSDs7QUFBQSxTQVNFLE9BVEYsR0FTRSxpQkFBUyxFQUFULEVBQWE7QUFDWCxXQUFVLEtBQUssUUFBZixnQkFBa0MsS0FBSyxFQUF2QyxhQUFpRCxFQUFqRDtBQUNELEdBWEg7O0FBQUEsU0FhRSxNQWJGLEdBYUUsZ0JBQVEsSUFBUixFQUFjLE9BQWQsRUFBdUI7QUFDckIsSUFBQSxPQUFPLEdBQUcsT0FBTyxTQUFPLE9BQVAsR0FBbUIsRUFBcEM7QUFDQSxXQUFPLEtBQUssR0FBTCxhQUFtQixLQUFLLEVBQXhCLGdCQUFxQyxrQkFBa0IsQ0FBQyxJQUFELENBQXZELEdBQWdFLE9BQWhFLENBQVA7QUFDRCxHQWhCSDs7QUFBQTtBQUFBLEVBQThDLGFBQTlDOzs7QUNSQSxJQUFNLEVBQUUsR0FBRyxPQUFPLENBQUMsbUJBQUQsQ0FBbEI7O0FBRUEsTUFBTSxDQUFDLE9BQVA7QUFDRSxzQkFBYSxJQUFiLEVBQW1CO0FBQ2pCLFNBQUssSUFBTCxHQUFZLElBQVo7QUFDQSxTQUFLLE9BQUwsR0FBZSxFQUFmO0FBQ0EsU0FBSyxNQUFMLEdBQWMsS0FBZDtBQUNBLFNBQUssT0FBTCxHQUFlLEVBQUUsRUFBakI7QUFFQSxTQUFLLGNBQUwsR0FBc0IsS0FBSyxjQUFMLENBQW9CLElBQXBCLENBQXlCLElBQXpCLENBQXRCO0FBRUEsU0FBSyxLQUFMLEdBQWEsS0FBSyxLQUFMLENBQVcsSUFBWCxDQUFnQixJQUFoQixDQUFiO0FBQ0EsU0FBSyxJQUFMLEdBQVksS0FBSyxJQUFMLENBQVUsSUFBVixDQUFlLElBQWYsQ0FBWjtBQUNBLFNBQUssRUFBTCxHQUFVLEtBQUssRUFBTCxDQUFRLElBQVIsQ0FBYSxJQUFiLENBQVY7QUFDQSxTQUFLLElBQUwsR0FBWSxLQUFLLElBQUwsQ0FBVSxJQUFWLENBQWUsSUFBZixDQUFaO0FBQ0EsU0FBSyxJQUFMLEdBQVksS0FBSyxJQUFMLENBQVUsSUFBVixDQUFlLElBQWYsQ0FBWjs7QUFFQSxRQUFJLENBQUMsSUFBRCxJQUFTLElBQUksQ0FBQyxRQUFMLEtBQWtCLEtBQS9CLEVBQXNDO0FBQ3BDLFdBQUssSUFBTDtBQUNEO0FBQ0Y7O0FBbEJIOztBQUFBLFNBb0JFLElBcEJGLEdBb0JFLGdCQUFRO0FBQUE7O0FBQ04sU0FBSyxNQUFMLEdBQWMsSUFBSSxTQUFKLENBQWMsS0FBSyxJQUFMLENBQVUsTUFBeEIsQ0FBZDs7QUFFQSxTQUFLLE1BQUwsQ0FBWSxNQUFaLEdBQXFCLFVBQUMsQ0FBRCxFQUFPO0FBQzFCLE1BQUEsS0FBSSxDQUFDLE1BQUwsR0FBYyxJQUFkOztBQUVBLGFBQU8sS0FBSSxDQUFDLE9BQUwsQ0FBYSxNQUFiLEdBQXNCLENBQXRCLElBQTJCLEtBQUksQ0FBQyxNQUF2QyxFQUErQztBQUM3QyxZQUFNLEtBQUssR0FBRyxLQUFJLENBQUMsT0FBTCxDQUFhLENBQWIsQ0FBZDs7QUFDQSxRQUFBLEtBQUksQ0FBQyxJQUFMLENBQVUsS0FBSyxDQUFDLE1BQWhCLEVBQXdCLEtBQUssQ0FBQyxPQUE5Qjs7QUFDQSxRQUFBLEtBQUksQ0FBQyxPQUFMLEdBQWUsS0FBSSxDQUFDLE9BQUwsQ0FBYSxLQUFiLENBQW1CLENBQW5CLENBQWY7QUFDRDtBQUNGLEtBUkQ7O0FBVUEsU0FBSyxNQUFMLENBQVksT0FBWixHQUFzQixVQUFDLENBQUQsRUFBTztBQUMzQixNQUFBLEtBQUksQ0FBQyxNQUFMLEdBQWMsS0FBZDtBQUNELEtBRkQ7O0FBSUEsU0FBSyxNQUFMLENBQVksU0FBWixHQUF3QixLQUFLLGNBQTdCO0FBQ0QsR0F0Q0g7O0FBQUEsU0F3Q0UsS0F4Q0YsR0F3Q0UsaUJBQVM7QUFDUCxRQUFJLEtBQUssTUFBVCxFQUFpQjtBQUNmLFdBQUssTUFBTCxDQUFZLEtBQVo7QUFDRDtBQUNGLEdBNUNIOztBQUFBLFNBOENFLElBOUNGLEdBOENFLGNBQU0sTUFBTixFQUFjLE9BQWQsRUFBdUI7QUFDckI7QUFFQSxRQUFJLENBQUMsS0FBSyxNQUFWLEVBQWtCO0FBQ2hCLFdBQUssT0FBTCxDQUFhLElBQWIsQ0FBa0I7QUFBRSxRQUFBLE1BQU0sRUFBTixNQUFGO0FBQVUsUUFBQSxPQUFPLEVBQVA7QUFBVixPQUFsQjs7QUFDQTtBQUNEOztBQUVELFNBQUssTUFBTCxDQUFZLElBQVosQ0FBaUIsSUFBSSxDQUFDLFNBQUwsQ0FBZTtBQUM5QixNQUFBLE1BQU0sRUFBTixNQUQ4QjtBQUU5QixNQUFBLE9BQU8sRUFBUDtBQUY4QixLQUFmLENBQWpCO0FBSUQsR0ExREg7O0FBQUEsU0E0REUsRUE1REYsR0E0REUsWUFBSSxNQUFKLEVBQVksT0FBWixFQUFxQjtBQUNuQixTQUFLLE9BQUwsQ0FBYSxFQUFiLENBQWdCLE1BQWhCLEVBQXdCLE9BQXhCO0FBQ0QsR0E5REg7O0FBQUEsU0FnRUUsSUFoRUYsR0FnRUUsY0FBTSxNQUFOLEVBQWMsT0FBZCxFQUF1QjtBQUNyQixTQUFLLE9BQUwsQ0FBYSxJQUFiLENBQWtCLE1BQWxCLEVBQTBCLE9BQTFCO0FBQ0QsR0FsRUg7O0FBQUEsU0FvRUUsSUFwRUYsR0FvRUUsY0FBTSxNQUFOLEVBQWMsT0FBZCxFQUF1QjtBQUNyQixTQUFLLE9BQUwsQ0FBYSxJQUFiLENBQWtCLE1BQWxCLEVBQTBCLE9BQTFCO0FBQ0QsR0F0RUg7O0FBQUEsU0F3RUUsY0F4RUYsR0F3RUUsd0JBQWdCLENBQWhCLEVBQW1CO0FBQ2pCLFFBQUk7QUFDRixVQUFNLE9BQU8sR0FBRyxJQUFJLENBQUMsS0FBTCxDQUFXLENBQUMsQ0FBQyxJQUFiLENBQWhCO0FBQ0EsV0FBSyxJQUFMLENBQVUsT0FBTyxDQUFDLE1BQWxCLEVBQTBCLE9BQU8sQ0FBQyxPQUFsQztBQUNELEtBSEQsQ0FHRSxPQUFPLEdBQVAsRUFBWTtBQUNaLE1BQUEsT0FBTyxDQUFDLEdBQVIsQ0FBWSxHQUFaO0FBQ0Q7QUFDRixHQS9FSDs7QUFBQTtBQUFBOzs7QUNGQTtBQUVBO0FBQ0E7QUFDQTs7QUFFQSxJQUFNLGFBQWEsR0FBRyxPQUFPLENBQUMsaUJBQUQsQ0FBN0I7O0FBQ0EsSUFBTSxRQUFRLEdBQUcsT0FBTyxDQUFDLFlBQUQsQ0FBeEI7O0FBQ0EsSUFBTSxjQUFjLEdBQUcsT0FBTyxDQUFDLGtCQUFELENBQTlCOztBQUNBLElBQU0sTUFBTSxHQUFHLE9BQU8sQ0FBQyxVQUFELENBQXRCOztBQUVBLE1BQU0sQ0FBQyxPQUFQLEdBQWlCO0FBQ2YsRUFBQSxhQUFhLEVBQWIsYUFEZTtBQUVmLEVBQUEsUUFBUSxFQUFSLFFBRmU7QUFHZixFQUFBLGNBQWMsRUFBZCxjQUhlO0FBSWYsRUFBQSxNQUFNLEVBQU47QUFKZSxDQUFqQjs7O0FDWEE7QUFFQTtBQUNBO0FBQ0E7O0FBQ0EsTUFBTSxDQUFDLE9BQVAsQ0FBZSxPQUFmLEdBQXlCLFVBQUMsR0FBRCxFQUFNLEtBQU4sRUFBZ0I7QUFDdkMsU0FBTyxJQUFJLE9BQUosQ0FBWSxVQUFDLE9BQUQsRUFBYTtBQUM5QixJQUFBLFlBQVksQ0FBQyxPQUFiLENBQXFCLEdBQXJCLEVBQTBCLEtBQTFCO0FBQ0EsSUFBQSxPQUFPO0FBQ1IsR0FITSxDQUFQO0FBSUQsQ0FMRDs7QUFPQSxNQUFNLENBQUMsT0FBUCxDQUFlLE9BQWYsR0FBeUIsVUFBQyxHQUFELEVBQVM7QUFDaEMsU0FBTyxPQUFPLENBQUMsT0FBUixDQUFnQixZQUFZLENBQUMsT0FBYixDQUFxQixHQUFyQixDQUFoQixDQUFQO0FBQ0QsQ0FGRDs7QUFJQSxNQUFNLENBQUMsT0FBUCxDQUFlLFVBQWYsR0FBNEIsVUFBQyxHQUFELEVBQVM7QUFDbkMsU0FBTyxJQUFJLE9BQUosQ0FBWSxVQUFDLE9BQUQsRUFBYTtBQUM5QixJQUFBLFlBQVksQ0FBQyxVQUFiLENBQXdCLEdBQXhCO0FBQ0EsSUFBQSxPQUFPO0FBQ1IsR0FITSxDQUFQO0FBSUQsQ0FMRDs7O0FDaEJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7OztBQ2hDQSxJQUFNLE1BQU0sR0FBRyxPQUFPLENBQUMsUUFBRCxDQUF0Qjs7QUFDQSxJQUFNLGNBQWMsR0FBRyxPQUFPLENBQUMsZ0NBQUQsQ0FBOUI7QUFFQTtBQUNBO0FBQ0E7OztBQUNBLFNBQVMsUUFBVCxDQUFtQixFQUFuQixFQUF1QjtBQUNyQixNQUFJLE9BQU8sR0FBRyxJQUFkO0FBQ0EsTUFBSSxVQUFVLEdBQUcsSUFBakI7QUFDQSxTQUFPLFlBQWE7QUFBQSxzQ0FBVCxJQUFTO0FBQVQsTUFBQSxJQUFTO0FBQUE7O0FBQ2xCLElBQUEsVUFBVSxHQUFHLElBQWI7O0FBQ0EsUUFBSSxDQUFDLE9BQUwsRUFBYztBQUNaLE1BQUEsT0FBTyxHQUFHLE9BQU8sQ0FBQyxPQUFSLEdBQWtCLElBQWxCLENBQXVCLFlBQU07QUFDckMsUUFBQSxPQUFPLEdBQUcsSUFBVixDQURxQyxDQUVyQztBQUNBO0FBQ0E7QUFDQTs7QUFDQSxlQUFPLEVBQUUsTUFBRixTQUFNLFVBQU4sQ0FBUDtBQUNELE9BUFMsQ0FBVjtBQVFEOztBQUNELFdBQU8sT0FBUDtBQUNELEdBYkQ7QUFjRDtBQUVEO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7O0FBQ0EsTUFBTSxDQUFDLE9BQVA7QUFDRSxrQkFBYSxJQUFiLEVBQW1CLElBQW5CLEVBQXlCO0FBQ3ZCLFNBQUssSUFBTCxHQUFZLElBQVo7QUFDQSxTQUFLLElBQUwsR0FBWSxJQUFJLElBQUksRUFBcEI7QUFFQSxTQUFLLE1BQUwsR0FBYyxLQUFLLE1BQUwsQ0FBWSxJQUFaLENBQWlCLElBQWpCLENBQWQ7QUFDQSxTQUFLLEtBQUwsR0FBYSxLQUFLLEtBQUwsQ0FBVyxJQUFYLENBQWdCLElBQWhCLENBQWI7QUFDQSxTQUFLLE9BQUwsR0FBZSxLQUFLLE9BQUwsQ0FBYSxJQUFiLENBQWtCLElBQWxCLENBQWY7QUFDQSxTQUFLLFNBQUwsR0FBaUIsS0FBSyxTQUFMLENBQWUsSUFBZixDQUFvQixJQUFwQixDQUFqQjtBQUNEOztBQVRIOztBQUFBLFNBV0UsY0FYRixHQVdFLDBCQUFrQjtBQUFBLDhCQUNJLEtBQUssSUFBTCxDQUFVLFFBQVYsRUFESjtBQUFBLFFBQ1IsT0FEUSx1QkFDUixPQURROztBQUVoQixXQUFPLE9BQU8sQ0FBQyxLQUFLLEVBQU4sQ0FBUCxJQUFvQixFQUEzQjtBQUNELEdBZEg7O0FBQUEsU0FnQkUsY0FoQkYsR0FnQkUsd0JBQWdCLE1BQWhCLEVBQXdCO0FBQUE7O0FBQUEsK0JBQ0YsS0FBSyxJQUFMLENBQVUsUUFBVixFQURFO0FBQUEsUUFDZCxPQURjLHdCQUNkLE9BRGM7O0FBR3RCLFNBQUssSUFBTCxDQUFVLFFBQVYsQ0FBbUI7QUFDakIsTUFBQSxPQUFPLGVBQ0YsT0FERSw2QkFFSixLQUFLLEVBRkQsaUJBR0EsT0FBTyxDQUFDLEtBQUssRUFBTixDQUhQLEVBSUEsTUFKQTtBQURVLEtBQW5CO0FBU0QsR0E1Qkg7O0FBQUEsU0E4QkUsVUE5QkYsR0E4QkUsb0JBQVksT0FBWixFQUFxQjtBQUNuQixTQUFLLElBQUwsZ0JBQWlCLEtBQUssSUFBdEIsRUFBK0IsT0FBL0I7QUFDQSxTQUFLLGNBQUwsR0FGbUIsQ0FFRztBQUN2QixHQWpDSDs7QUFBQSxTQW1DRSxNQW5DRixHQW1DRSxnQkFBUSxLQUFSLEVBQWU7QUFDYixRQUFJLE9BQU8sS0FBSyxFQUFaLEtBQW1CLFdBQXZCLEVBQW9DO0FBQ2xDO0FBQ0Q7O0FBRUQsUUFBSSxLQUFLLFNBQVQsRUFBb0I7QUFDbEIsV0FBSyxTQUFMLENBQWUsS0FBZjtBQUNEO0FBQ0YsR0EzQ0gsQ0E2Q0U7QUE3Q0Y7O0FBQUEsU0E4Q0UsV0E5Q0YsR0E4Q0UsdUJBQWUsQ0FFZDtBQUVEO0FBQ0Y7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQXZEQTs7QUFBQSxTQXdERSxPQXhERixHQXdERSxtQkFBVyxDQUVWO0FBRUQ7QUFDRjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQW5FQTs7QUFBQSxTQW9FRSxLQXBFRixHQW9FRSxlQUFPLE1BQVAsRUFBZSxNQUFmLEVBQXVCO0FBQUE7O0FBQ3JCLFFBQU0sZ0JBQWdCLEdBQUcsTUFBTSxDQUFDLEVBQWhDO0FBRUEsUUFBTSxhQUFhLEdBQUcsY0FBYyxDQUFDLE1BQUQsQ0FBcEM7O0FBRUEsUUFBSSxhQUFKLEVBQW1CO0FBQ2pCLFdBQUssYUFBTCxHQUFxQixJQUFyQixDQURpQixDQUdqQjs7QUFDQSxXQUFLLFFBQUwsR0FBZ0IsVUFBQyxLQUFELEVBQVc7QUFDekI7QUFDQTtBQUNBO0FBQ0EsWUFBSSxDQUFDLEtBQUksQ0FBQyxJQUFMLENBQVUsU0FBVixDQUFvQixLQUFJLENBQUMsRUFBekIsQ0FBTCxFQUFtQztBQUNuQyxRQUFBLEtBQUksQ0FBQyxFQUFMLEdBQVUsTUFBTSxDQUFDLE1BQVAsQ0FBYyxLQUFJLENBQUMsTUFBTCxDQUFZLEtBQVosQ0FBZCxFQUFrQyxhQUFsQyxFQUFpRCxLQUFJLENBQUMsRUFBdEQsQ0FBVjs7QUFDQSxRQUFBLEtBQUksQ0FBQyxXQUFMO0FBQ0QsT0FQRDs7QUFRQSxXQUFLLFNBQUwsR0FBaUIsUUFBUSxDQUFDLEtBQUssUUFBTixDQUF6QjtBQUVBLFdBQUssSUFBTCxDQUFVLEdBQVYsaUJBQTRCLGdCQUE1QiwyQkFBa0UsTUFBbEUsUUFkaUIsQ0FnQmpCOztBQUNBLFVBQUksS0FBSyxJQUFMLENBQVUsb0JBQWQsRUFBb0M7QUFDbEMsUUFBQSxhQUFhLENBQUMsU0FBZCxHQUEwQixFQUExQjtBQUNEOztBQUVELFdBQUssRUFBTCxHQUFVLE1BQU0sQ0FBQyxNQUFQLENBQWMsS0FBSyxNQUFMLENBQVksS0FBSyxJQUFMLENBQVUsUUFBVixFQUFaLENBQWQsRUFBaUQsYUFBakQsQ0FBVjtBQUVBLFdBQUssT0FBTDtBQUNBLGFBQU8sS0FBSyxFQUFaO0FBQ0Q7O0FBRUQsUUFBSSxZQUFKOztBQUNBLFFBQUksT0FBTyxNQUFQLEtBQWtCLFFBQWxCLElBQThCLE1BQU0sWUFBWSxNQUFwRCxFQUE0RDtBQUMxRDtBQUNBLE1BQUEsWUFBWSxHQUFHLE1BQWY7QUFDRCxLQUhELE1BR08sSUFBSSxPQUFPLE1BQVAsS0FBa0IsVUFBdEIsRUFBa0M7QUFDdkM7QUFDQSxVQUFNLE1BQU0sR0FBRyxNQUFmLENBRnVDLENBR3ZDOztBQUNBLFdBQUssSUFBTCxDQUFVLGNBQVYsQ0FBeUIsVUFBQyxNQUFELEVBQVk7QUFDbkMsWUFBSSxNQUFNLFlBQVksTUFBdEIsRUFBOEI7QUFDNUIsVUFBQSxZQUFZLEdBQUcsTUFBZjtBQUNBLGlCQUFPLEtBQVA7QUFDRDtBQUNGLE9BTEQ7QUFNRDs7QUFFRCxRQUFJLFlBQUosRUFBa0I7QUFDaEIsV0FBSyxJQUFMLENBQVUsR0FBVixpQkFBNEIsZ0JBQTVCLFlBQW1ELFlBQVksQ0FBQyxFQUFoRTtBQUNBLFdBQUssTUFBTCxHQUFjLFlBQWQ7QUFDQSxXQUFLLEVBQUwsR0FBVSxZQUFZLENBQUMsU0FBYixDQUF1QixNQUF2QixDQUFWO0FBRUEsV0FBSyxPQUFMO0FBQ0EsYUFBTyxLQUFLLEVBQVo7QUFDRDs7QUFFRCxTQUFLLElBQUwsQ0FBVSxHQUFWLHFCQUFnQyxnQkFBaEM7QUFFQSxRQUFJLE9BQU8sdUNBQXFDLGdCQUFyQyxNQUFYOztBQUNBLFFBQUksT0FBTyxNQUFQLEtBQWtCLFVBQXRCLEVBQWtDO0FBQ2hDLE1BQUEsT0FBTyxJQUFJLDhDQUNULGtGQURTLEdBRVQseUdBRlMsR0FHVCwrR0FIRjtBQUlELEtBTEQsTUFLTztBQUNMLE1BQUEsT0FBTyxJQUFJLHVGQUNULGdIQURTLEdBRVQsMkRBRlMsR0FHVCwrR0FIRjtBQUlEOztBQUNELFVBQU0sSUFBSSxLQUFKLENBQVUsT0FBVixDQUFOO0FBQ0QsR0E1SUg7O0FBQUEsU0E4SUUsTUE5SUYsR0E4SUUsZ0JBQVEsS0FBUixFQUFlO0FBQ2IsVUFBTyxJQUFJLEtBQUosQ0FBVSw4REFBVixDQUFQO0FBQ0QsR0FoSkg7O0FBQUEsU0FrSkUsU0FsSkYsR0FrSkUsbUJBQVcsTUFBWCxFQUFtQjtBQUNqQixVQUFPLElBQUksS0FBSixDQUFVLDRFQUFWLENBQVA7QUFDRCxHQXBKSDs7QUFBQSxTQXNKRSxPQXRKRixHQXNKRSxtQkFBVztBQUNULFFBQUksS0FBSyxhQUFMLElBQXNCLEtBQUssRUFBM0IsSUFBaUMsS0FBSyxFQUFMLENBQVEsVUFBN0MsRUFBeUQ7QUFDdkQsV0FBSyxFQUFMLENBQVEsVUFBUixDQUFtQixXQUFuQixDQUErQixLQUFLLEVBQXBDO0FBQ0Q7QUFDRixHQTFKSDs7QUFBQSxTQTRKRSxPQTVKRixHQTRKRSxtQkFBVyxDQUVWLENBOUpIOztBQUFBLFNBZ0tFLFNBaEtGLEdBZ0tFLHFCQUFhO0FBQ1gsU0FBSyxPQUFMO0FBQ0QsR0FsS0g7O0FBQUE7QUFBQTs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUNsQ0EsSUFBTSxVQUFVLEdBQUcsT0FBTyxDQUFDLDRCQUFELENBQTFCOztBQUNBLElBQU0sRUFBRSxHQUFHLE9BQU8sQ0FBQyxtQkFBRCxDQUFsQjs7QUFDQSxJQUFNLElBQUksR0FBRyxPQUFPLENBQUMsTUFBRCxDQUFwQjs7QUFDQSxJQUFNLFFBQVEsR0FBRyxPQUFPLENBQUMsaUJBQUQsQ0FBeEI7O0FBQ0EsSUFBTSxhQUFhLEdBQUcsT0FBTyxDQUFDLDZCQUFELENBQTdCOztBQUNBLElBQU0sS0FBSyxHQUFHLE9BQU8sQ0FBQyxZQUFELENBQXJCOztBQUNBLElBQU0sWUFBWSxHQUFHLE9BQU8sQ0FBQyxxQkFBRCxDQUE1Qjs7QUFDQSxJQUFNLFdBQVcsR0FBRyxPQUFPLENBQUMsNkJBQUQsQ0FBM0I7O0FBQ0EsSUFBTSx1QkFBdUIsR0FBRyxPQUFPLENBQUMseUNBQUQsQ0FBdkM7O0FBQ0EsSUFBTSxjQUFjLEdBQUcsT0FBTyxDQUFDLGdDQUFELENBQTlCOztBQUNBLElBQU0sc0JBQXNCLEdBQUcsT0FBTyxDQUFDLDBCQUFELENBQXRDOztlQUMwQyxPQUFPLENBQUMsV0FBRCxDO0lBQXpDLGdCLFlBQUEsZ0I7SUFBa0IsVyxZQUFBLFc7O0FBQzFCLElBQU0sTUFBTSxHQUFHLE9BQU8sQ0FBQyxVQUFELENBQXRCLEMsQ0FBbUM7OztJQUU3QixnQjs7O0FBQ0osOEJBQXNCO0FBQUE7O0FBQUEsc0NBQU4sSUFBTTtBQUFOLE1BQUEsSUFBTTtBQUFBOztBQUNwQixvREFBUyxJQUFUO0FBQ0EsVUFBSyxhQUFMLEdBQXFCLElBQXJCO0FBRm9CO0FBR3JCOzs7aUNBSjRCLEs7QUFPL0I7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7O0lBQ00sSTtBQUdKO0FBQ0Y7QUFDQTtBQUNBO0FBQ0E7QUFDRSxnQkFBYSxJQUFiLEVBQW1CO0FBQUE7O0FBQ2pCLFNBQUssYUFBTCxHQUFxQjtBQUNuQixNQUFBLE9BQU8sRUFBRTtBQUNQLFFBQUEsa0JBQWtCLEVBQUU7QUFDbEIsYUFBRyw0REFEZTtBQUVsQixhQUFHO0FBRmUsU0FEYjtBQUtQLFFBQUEsaUJBQWlCLEVBQUU7QUFDakIsYUFBRyx5Q0FEYztBQUVqQixhQUFHO0FBRmMsU0FMWjtBQVNQLFFBQUEsdUJBQXVCLEVBQUU7QUFDdkIsYUFBRyxpREFEb0I7QUFFdkIsYUFBRztBQUZvQixTQVRsQjtBQWFQO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxRQUFBLFlBQVksRUFBRSw0QkFsQlA7QUFtQlAsUUFBQSxXQUFXLEVBQUUsMkNBbkJOO0FBb0JQLFFBQUEsWUFBWSxFQUFFLHVEQXBCUDtBQXFCUCxRQUFBLHlCQUF5QixFQUFFLCtCQXJCcEI7QUFzQlAsUUFBQSxxQkFBcUIsRUFBRSx5Q0F0QmhCO0FBdUJQLFFBQUEsWUFBWSxFQUFFLGtFQXZCUDtBQXdCUCxRQUFBLGNBQWMsRUFBRSxrQ0F4QlQ7QUF5QlAsUUFBQSx3QkFBd0IsRUFBRSxpRUF6Qm5CO0FBMEJQLFFBQUEsY0FBYyxFQUFFLDBCQTFCVDtBQTJCUCxRQUFBLG9CQUFvQixFQUFFLHdCQTNCZjtBQTRCUCxRQUFBLG1CQUFtQixFQUFFLDJCQTVCZDtBQTZCUDtBQUNBLFFBQUEsWUFBWSxFQUFFLG1DQTlCUDtBQStCUCxRQUFBLE9BQU8sRUFBRTtBQUNQLGFBQUcsdUJBREk7QUFFUCxhQUFHO0FBRkksU0EvQkY7QUFtQ1AsUUFBQSw2QkFBNkIsRUFBRSxzQ0FuQ3hCO0FBb0NQLFFBQUEsK0JBQStCLEVBQUUsd0NBcEMxQjtBQXFDUCxRQUFBLGVBQWUsRUFBRSxxQkFyQ1Y7QUFzQ1AsUUFBQSxpQkFBaUIsRUFBRSx1QkF0Q1o7QUF1Q1AsUUFBQSxlQUFlLEVBQUUscUJBdkNWO0FBd0NQLFFBQUEsTUFBTSxFQUFFLFFBeENEO0FBeUNQLFFBQUEsTUFBTSxFQUFFLFNBekNEO0FBMENQLFFBQUEsTUFBTSxFQUFFLFFBMUNEO0FBMkNQLFFBQUEsV0FBVyxFQUFFLGNBM0NOO0FBNENQLFFBQUEsT0FBTyxFQUFFLFlBNUNGO0FBNkNQLFFBQUEscUJBQXFCLEVBQUUsd0RBN0NoQjtBQThDUCxRQUFBLGdCQUFnQixFQUFFLDBCQTlDWDtBQStDUCxRQUFBLFlBQVksRUFBRSxtQkEvQ1A7QUFnRFAsUUFBQSxpQkFBaUIsRUFBRSxpQ0FoRFo7QUFpRFAsUUFBQSxZQUFZLEVBQUUsZ0JBakRQO0FBa0RQLFFBQUEsZ0JBQWdCLEVBQUUsdUNBbERYO0FBbURQLFFBQUEsV0FBVyxFQUFFO0FBQ1gsYUFBRywwQ0FEUTtBQUVYLGFBQUc7QUFGUTtBQW5ETjtBQURVLEtBQXJCO0FBMkRBLFFBQU0sY0FBYyxHQUFHO0FBQ3JCLE1BQUEsRUFBRSxFQUFFLE1BRGlCO0FBRXJCLE1BQUEsV0FBVyxFQUFFLEtBRlE7QUFHckIsTUFBQSxvQkFBb0IsRUFBRSxJQUhEO0FBSXJCLE1BQUEsS0FBSyxFQUFFLEtBSmM7QUFLckIsTUFBQSxZQUFZLEVBQUU7QUFDWixRQUFBLFdBQVcsRUFBRSxJQUREO0FBRVosUUFBQSxXQUFXLEVBQUUsSUFGRDtBQUdaLFFBQUEsZ0JBQWdCLEVBQUUsSUFITjtBQUlaLFFBQUEsZ0JBQWdCLEVBQUUsSUFKTjtBQUtaLFFBQUEsZ0JBQWdCLEVBQUUsSUFMTjtBQU1aLFFBQUEsZ0JBQWdCLEVBQUU7QUFOTixPQUxPO0FBYXJCLE1BQUEsSUFBSSxFQUFFLEVBYmU7QUFjckIsTUFBQSxpQkFBaUIsRUFBRSwyQkFBQyxXQUFELEVBQWMsS0FBZDtBQUFBLGVBQXdCLFdBQXhCO0FBQUEsT0FkRTtBQWVyQixNQUFBLGNBQWMsRUFBRSx3QkFBQyxLQUFEO0FBQUEsZUFBVyxLQUFYO0FBQUEsT0FmSztBQWdCckIsTUFBQSxLQUFLLEVBQUUsWUFBWSxFQWhCRTtBQWlCckIsTUFBQSxNQUFNLEVBQUU7QUFqQmEsS0FBdkIsQ0E1RGlCLENBZ0ZqQjtBQUNBOztBQUNBLFNBQUssSUFBTCxnQkFDSyxjQURMLEVBRUssSUFGTDtBQUdFLE1BQUEsWUFBWSxlQUNQLGNBQWMsQ0FBQyxZQURSLEVBRU4sSUFBSSxJQUFJLElBQUksQ0FBQyxZQUZQO0FBSGQsT0FsRmlCLENBMkZqQjtBQUNBOztBQUNBLFFBQUksSUFBSSxJQUFJLElBQUksQ0FBQyxNQUFiLElBQXVCLElBQUksQ0FBQyxLQUFoQyxFQUF1QztBQUNyQyxXQUFLLEdBQUwsQ0FBUywyS0FBVCxFQUFzTCxTQUF0TDtBQUNELEtBRkQsTUFFTyxJQUFJLElBQUksSUFBSSxJQUFJLENBQUMsS0FBakIsRUFBd0I7QUFDN0IsV0FBSyxJQUFMLENBQVUsTUFBVixHQUFtQixXQUFuQjtBQUNEOztBQUVELFNBQUssR0FBTCxrQkFBd0IsS0FBSyxXQUFMLENBQWlCLE9BQXpDOztBQUVBLFFBQUksS0FBSyxJQUFMLENBQVUsWUFBVixDQUF1QixnQkFBdkIsSUFDQSxLQUFLLElBQUwsQ0FBVSxZQUFWLENBQXVCLGdCQUF2QixLQUE0QyxJQUQ1QyxJQUVBLENBQUMsS0FBSyxDQUFDLE9BQU4sQ0FBYyxLQUFLLElBQUwsQ0FBVSxZQUFWLENBQXVCLGdCQUFyQyxDQUZMLEVBRTZEO0FBQzNELFlBQU0sSUFBSSxTQUFKLENBQWMsa0RBQWQsQ0FBTjtBQUNEOztBQUVELFNBQUssUUFBTCxHQTNHaUIsQ0E2R2pCOztBQUNBLFNBQUssT0FBTCxHQUFlLEVBQWY7QUFFQSxTQUFLLFFBQUwsR0FBZ0IsS0FBSyxRQUFMLENBQWMsSUFBZCxDQUFtQixJQUFuQixDQUFoQjtBQUNBLFNBQUssU0FBTCxHQUFpQixLQUFLLFNBQUwsQ0FBZSxJQUFmLENBQW9CLElBQXBCLENBQWpCO0FBQ0EsU0FBSyxXQUFMLEdBQW1CLEtBQUssV0FBTCxDQUFpQixJQUFqQixDQUFzQixJQUF0QixDQUFuQjtBQUNBLFNBQUssWUFBTCxHQUFvQixLQUFLLFlBQUwsQ0FBa0IsSUFBbEIsQ0FBdUIsSUFBdkIsQ0FBcEI7QUFDQSxTQUFLLEdBQUwsR0FBVyxLQUFLLEdBQUwsQ0FBUyxJQUFULENBQWMsSUFBZCxDQUFYO0FBQ0EsU0FBSyxJQUFMLEdBQVksS0FBSyxJQUFMLENBQVUsSUFBVixDQUFlLElBQWYsQ0FBWjtBQUNBLFNBQUssUUFBTCxHQUFnQixLQUFLLFFBQUwsQ0FBYyxJQUFkLENBQW1CLElBQW5CLENBQWhCO0FBQ0EsU0FBSyxPQUFMLEdBQWUsS0FBSyxPQUFMLENBQWEsSUFBYixDQUFrQixJQUFsQixDQUFmO0FBQ0EsU0FBSyxVQUFMLEdBQWtCLEtBQUssVUFBTCxDQUFnQixJQUFoQixDQUFxQixJQUFyQixDQUFsQjtBQUNBLFNBQUssV0FBTCxHQUFtQixLQUFLLFdBQUwsQ0FBaUIsSUFBakIsQ0FBc0IsSUFBdEIsQ0FBbkIsQ0F6SGlCLENBMkhqQjtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUNBLFNBQUssa0JBQUwsR0FBMEIsUUFBUSxDQUFDLEtBQUssa0JBQUwsQ0FBd0IsSUFBeEIsQ0FBNkIsSUFBN0IsQ0FBRCxFQUFxQyxHQUFyQyxFQUEwQztBQUFFLE1BQUEsT0FBTyxFQUFFLElBQVg7QUFBaUIsTUFBQSxRQUFRLEVBQUU7QUFBM0IsS0FBMUMsQ0FBbEM7QUFFQSxTQUFLLGtCQUFMLEdBQTBCLEtBQUssa0JBQUwsQ0FBd0IsSUFBeEIsQ0FBNkIsSUFBN0IsQ0FBMUI7QUFDQSxTQUFLLGFBQUwsR0FBcUIsS0FBSyxhQUFMLENBQW1CLElBQW5CLENBQXdCLElBQXhCLENBQXJCO0FBRUEsU0FBSyxRQUFMLEdBQWdCLEtBQUssUUFBTCxDQUFjLElBQWQsQ0FBbUIsSUFBbkIsQ0FBaEI7QUFDQSxTQUFLLFNBQUwsR0FBaUIsS0FBSyxTQUFMLENBQWUsSUFBZixDQUFvQixJQUFwQixDQUFqQjtBQUNBLFNBQUssUUFBTCxHQUFnQixLQUFLLFFBQUwsQ0FBYyxJQUFkLENBQW1CLElBQW5CLENBQWhCO0FBQ0EsU0FBSyxTQUFMLEdBQWlCLEtBQUssU0FBTCxDQUFlLElBQWYsQ0FBb0IsSUFBcEIsQ0FBakI7QUFDQSxTQUFLLFdBQUwsR0FBbUIsS0FBSyxXQUFMLENBQWlCLElBQWpCLENBQXNCLElBQXRCLENBQW5CO0FBQ0EsU0FBSyxNQUFMLEdBQWMsS0FBSyxNQUFMLENBQVksSUFBWixDQUFpQixJQUFqQixDQUFkO0FBRUEsU0FBSyxPQUFMLEdBQWUsRUFBRSxFQUFqQjtBQUNBLFNBQUssRUFBTCxHQUFVLEtBQUssRUFBTCxDQUFRLElBQVIsQ0FBYSxJQUFiLENBQVY7QUFDQSxTQUFLLEdBQUwsR0FBVyxLQUFLLEdBQUwsQ0FBUyxJQUFULENBQWMsSUFBZCxDQUFYO0FBQ0EsU0FBSyxJQUFMLEdBQVksS0FBSyxPQUFMLENBQWEsSUFBYixDQUFrQixJQUFsQixDQUF1QixLQUFLLE9BQTVCLENBQVo7QUFDQSxTQUFLLElBQUwsR0FBWSxLQUFLLE9BQUwsQ0FBYSxJQUFiLENBQWtCLElBQWxCLENBQXVCLEtBQUssT0FBNUIsQ0FBWjtBQUVBLFNBQUssYUFBTCxHQUFxQixFQUFyQjtBQUNBLFNBQUssU0FBTCxHQUFpQixFQUFqQjtBQUNBLFNBQUssY0FBTCxHQUFzQixFQUF0QjtBQUVBLFNBQUssS0FBTCxHQUFhLEtBQUssSUFBTCxDQUFVLEtBQXZCO0FBQ0EsU0FBSyxRQUFMLENBQWM7QUFDWixNQUFBLE9BQU8sRUFBRSxFQURHO0FBRVosTUFBQSxLQUFLLEVBQUUsRUFGSztBQUdaLE1BQUEsY0FBYyxFQUFFLEVBSEo7QUFJWixNQUFBLGNBQWMsRUFBRSxJQUpKO0FBS1osTUFBQSxZQUFZLEVBQUU7QUFDWixRQUFBLGNBQWMsRUFBRSxzQkFBc0IsRUFEMUI7QUFFWixRQUFBLHNCQUFzQixFQUFFLElBRlo7QUFHWixRQUFBLGdCQUFnQixFQUFFO0FBSE4sT0FMRjtBQVVaLE1BQUEsYUFBYSxFQUFFLENBVkg7QUFXWixNQUFBLElBQUksZUFBTyxLQUFLLElBQUwsQ0FBVSxJQUFqQixDQVhRO0FBWVosTUFBQSxJQUFJLEVBQUU7QUFDSixRQUFBLFFBQVEsRUFBRSxJQUROO0FBRUosUUFBQSxJQUFJLEVBQUUsTUFGRjtBQUdKLFFBQUEsT0FBTyxFQUFFO0FBSEw7QUFaTSxLQUFkO0FBbUJBLFNBQUssaUJBQUwsR0FBeUIsS0FBSyxLQUFMLENBQVcsU0FBWCxDQUFxQixVQUFDLFNBQUQsRUFBWSxTQUFaLEVBQXVCLEtBQXZCLEVBQWlDO0FBQzdFLE1BQUEsTUFBSSxDQUFDLElBQUwsQ0FBVSxjQUFWLEVBQTBCLFNBQTFCLEVBQXFDLFNBQXJDLEVBQWdELEtBQWhEOztBQUNBLE1BQUEsTUFBSSxDQUFDLFNBQUwsQ0FBZSxTQUFmO0FBQ0QsS0FId0IsQ0FBekIsQ0ExS2lCLENBK0tqQjs7QUFDQSxRQUFJLEtBQUssSUFBTCxDQUFVLEtBQVYsSUFBbUIsT0FBTyxNQUFQLEtBQWtCLFdBQXpDLEVBQXNEO0FBQ3BELE1BQUEsTUFBTSxDQUFDLEtBQUssSUFBTCxDQUFVLEVBQVgsQ0FBTixHQUF1QixJQUF2QjtBQUNEOztBQUVELFNBQUssYUFBTCxHQXBMaUIsQ0FzTGpCO0FBQ0E7O0FBQ0QsRyxDQUVEO0FBQ0E7QUFDQTtBQUNBO0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7Ozs7U0FFQSxFLEdBQUEsWUFBSSxLQUFKLEVBQVcsUUFBWCxFQUFxQjtBQUNuQixTQUFLLE9BQUwsQ0FBYSxFQUFiLENBQWdCLEtBQWhCLEVBQXVCLFFBQXZCO0FBQ0EsV0FBTyxJQUFQO0FBQ0QsRzs7U0FFRCxHLEdBQUEsYUFBSyxLQUFMLEVBQVksUUFBWixFQUFzQjtBQUNwQixTQUFLLE9BQUwsQ0FBYSxHQUFiLENBQWlCLEtBQWpCLEVBQXdCLFFBQXhCO0FBQ0EsV0FBTyxJQUFQO0FBQ0Q7QUFFRDtBQUNGO0FBQ0E7QUFDQTtBQUNBOzs7U0FDRSxTLEdBQUEsbUJBQVcsS0FBWCxFQUFrQjtBQUNoQixTQUFLLGNBQUwsQ0FBb0IsVUFBQSxNQUFNLEVBQUk7QUFDNUIsTUFBQSxNQUFNLENBQUMsTUFBUCxDQUFjLEtBQWQ7QUFDRCxLQUZEO0FBR0Q7QUFFRDtBQUNGO0FBQ0E7QUFDQTtBQUNBOzs7U0FDRSxRLEdBQUEsa0JBQVUsS0FBVixFQUFpQjtBQUNmLFNBQUssS0FBTCxDQUFXLFFBQVgsQ0FBb0IsS0FBcEI7QUFDRDtBQUVEO0FBQ0Y7QUFDQTtBQUNBO0FBQ0E7OztTQUNFLFEsR0FBQSxvQkFBWTtBQUNWLFdBQU8sS0FBSyxLQUFMLENBQVcsUUFBWCxFQUFQO0FBQ0Q7QUFFRDtBQUNGO0FBQ0E7OztBQUtFO0FBQ0Y7QUFDQTtTQUNFLFksR0FBQSxzQkFBYyxNQUFkLEVBQXNCLEtBQXRCLEVBQTZCO0FBQUE7O0FBQzNCLFFBQUksQ0FBQyxLQUFLLFFBQUwsR0FBZ0IsS0FBaEIsQ0FBc0IsTUFBdEIsQ0FBTCxFQUFvQztBQUNsQyxZQUFNLElBQUksS0FBSiwrQkFBaUMsTUFBakMseUNBQU47QUFDRDs7QUFFRCxTQUFLLFFBQUwsQ0FBYztBQUNaLE1BQUEsS0FBSyxFQUFFLFNBQWMsRUFBZCxFQUFrQixLQUFLLFFBQUwsR0FBZ0IsS0FBbEMsNkJBQ0osTUFESSxJQUNLLFNBQWMsRUFBZCxFQUFrQixLQUFLLFFBQUwsR0FBZ0IsS0FBaEIsQ0FBc0IsTUFBdEIsQ0FBbEIsRUFBaUQsS0FBakQsQ0FETDtBQURLLEtBQWQ7QUFLRCxHOztTQUVELFEsR0FBQSxvQkFBWTtBQUNWLFNBQUssVUFBTCxHQUFrQixJQUFJLFVBQUosQ0FBZSxDQUFDLEtBQUssYUFBTixFQUFxQixLQUFLLElBQUwsQ0FBVSxNQUEvQixDQUFmLENBQWxCO0FBQ0EsU0FBSyxNQUFMLEdBQWMsS0FBSyxVQUFMLENBQWdCLE1BQTlCO0FBQ0EsU0FBSyxJQUFMLEdBQVksS0FBSyxVQUFMLENBQWdCLFNBQWhCLENBQTBCLElBQTFCLENBQStCLEtBQUssVUFBcEMsQ0FBWjtBQUNBLFNBQUssU0FBTCxHQUFpQixLQUFLLFVBQUwsQ0FBZ0IsY0FBaEIsQ0FBK0IsSUFBL0IsQ0FBb0MsS0FBSyxVQUF6QyxDQUFqQjtBQUNELEc7O1NBRUQsVSxHQUFBLG9CQUFZLE9BQVosRUFBcUI7QUFDbkIsU0FBSyxJQUFMLGdCQUNLLEtBQUssSUFEVixFQUVLLE9BRkw7QUFHRSxNQUFBLFlBQVksZUFDUCxLQUFLLElBQUwsQ0FBVSxZQURILEVBRU4sT0FBTyxJQUFJLE9BQU8sQ0FBQyxZQUZiO0FBSGQ7O0FBU0EsUUFBSSxPQUFPLENBQUMsSUFBWixFQUFrQjtBQUNoQixXQUFLLE9BQUwsQ0FBYSxPQUFPLENBQUMsSUFBckI7QUFDRDs7QUFFRCxTQUFLLFFBQUw7O0FBRUEsUUFBSSxPQUFPLENBQUMsTUFBWixFQUFvQjtBQUNsQixXQUFLLGNBQUwsQ0FBb0IsVUFBQyxNQUFELEVBQVk7QUFDOUIsUUFBQSxNQUFNLENBQUMsVUFBUDtBQUNELE9BRkQ7QUFHRDs7QUFFRCxTQUFLLFFBQUwsR0F0Qm1CLENBc0JIO0FBQ2pCLEc7O1NBRUQsYSxHQUFBLHlCQUFpQjtBQUNmLFFBQU0sZUFBZSxHQUFHO0FBQ3RCLE1BQUEsVUFBVSxFQUFFLENBRFU7QUFFdEIsTUFBQSxhQUFhLEVBQUUsQ0FGTztBQUd0QixNQUFBLGNBQWMsRUFBRSxLQUhNO0FBSXRCLE1BQUEsYUFBYSxFQUFFO0FBSk8sS0FBeEI7O0FBTUEsUUFBTSxLQUFLLEdBQUcsU0FBYyxFQUFkLEVBQWtCLEtBQUssUUFBTCxHQUFnQixLQUFsQyxDQUFkOztBQUNBLFFBQU0sWUFBWSxHQUFHLEVBQXJCO0FBQ0EsSUFBQSxNQUFNLENBQUMsSUFBUCxDQUFZLEtBQVosRUFBbUIsT0FBbkIsQ0FBMkIsVUFBQSxNQUFNLEVBQUk7QUFDbkMsVUFBTSxXQUFXLEdBQUcsU0FBYyxFQUFkLEVBQWtCLEtBQUssQ0FBQyxNQUFELENBQXZCLENBQXBCOztBQUNBLE1BQUEsV0FBVyxDQUFDLFFBQVosR0FBdUIsU0FBYyxFQUFkLEVBQWtCLFdBQVcsQ0FBQyxRQUE5QixFQUF3QyxlQUF4QyxDQUF2QjtBQUNBLE1BQUEsWUFBWSxDQUFDLE1BQUQsQ0FBWixHQUF1QixXQUF2QjtBQUNELEtBSkQ7QUFNQSxTQUFLLFFBQUwsQ0FBYztBQUNaLE1BQUEsS0FBSyxFQUFFLFlBREs7QUFFWixNQUFBLGFBQWEsRUFBRTtBQUZILEtBQWQ7QUFLQSxTQUFLLElBQUwsQ0FBVSxnQkFBVjtBQUNELEc7O1NBRUQsZSxHQUFBLHlCQUFpQixFQUFqQixFQUFxQjtBQUNuQixTQUFLLGFBQUwsQ0FBbUIsSUFBbkIsQ0FBd0IsRUFBeEI7QUFDRCxHOztTQUVELGtCLEdBQUEsNEJBQW9CLEVBQXBCLEVBQXdCO0FBQ3RCLFFBQU0sQ0FBQyxHQUFHLEtBQUssYUFBTCxDQUFtQixPQUFuQixDQUEyQixFQUEzQixDQUFWOztBQUNBLFFBQUksQ0FBQyxLQUFLLENBQUMsQ0FBWCxFQUFjO0FBQ1osV0FBSyxhQUFMLENBQW1CLE1BQW5CLENBQTBCLENBQTFCLEVBQTZCLENBQTdCO0FBQ0Q7QUFDRixHOztTQUVELGdCLEdBQUEsMEJBQWtCLEVBQWxCLEVBQXNCO0FBQ3BCLFNBQUssY0FBTCxDQUFvQixJQUFwQixDQUF5QixFQUF6QjtBQUNELEc7O1NBRUQsbUIsR0FBQSw2QkFBcUIsRUFBckIsRUFBeUI7QUFDdkIsUUFBTSxDQUFDLEdBQUcsS0FBSyxjQUFMLENBQW9CLE9BQXBCLENBQTRCLEVBQTVCLENBQVY7O0FBQ0EsUUFBSSxDQUFDLEtBQUssQ0FBQyxDQUFYLEVBQWM7QUFDWixXQUFLLGNBQUwsQ0FBb0IsTUFBcEIsQ0FBMkIsQ0FBM0IsRUFBOEIsQ0FBOUI7QUFDRDtBQUNGLEc7O1NBRUQsVyxHQUFBLHFCQUFhLEVBQWIsRUFBaUI7QUFDZixTQUFLLFNBQUwsQ0FBZSxJQUFmLENBQW9CLEVBQXBCO0FBQ0QsRzs7U0FFRCxjLEdBQUEsd0JBQWdCLEVBQWhCLEVBQW9CO0FBQ2xCLFFBQU0sQ0FBQyxHQUFHLEtBQUssU0FBTCxDQUFlLE9BQWYsQ0FBdUIsRUFBdkIsQ0FBVjs7QUFDQSxRQUFJLENBQUMsS0FBSyxDQUFDLENBQVgsRUFBYztBQUNaLFdBQUssU0FBTCxDQUFlLE1BQWYsQ0FBc0IsQ0FBdEIsRUFBeUIsQ0FBekI7QUFDRDtBQUNGLEc7O1NBRUQsTyxHQUFBLGlCQUFTLElBQVQsRUFBZTtBQUNiLFFBQU0sV0FBVyxHQUFHLFNBQWMsRUFBZCxFQUFrQixLQUFLLFFBQUwsR0FBZ0IsSUFBbEMsRUFBd0MsSUFBeEMsQ0FBcEI7O0FBQ0EsUUFBTSxZQUFZLEdBQUcsU0FBYyxFQUFkLEVBQWtCLEtBQUssUUFBTCxHQUFnQixLQUFsQyxDQUFyQjs7QUFFQSxJQUFBLE1BQU0sQ0FBQyxJQUFQLENBQVksWUFBWixFQUEwQixPQUExQixDQUFrQyxVQUFDLE1BQUQsRUFBWTtBQUM1QyxNQUFBLFlBQVksQ0FBQyxNQUFELENBQVosR0FBdUIsU0FBYyxFQUFkLEVBQWtCLFlBQVksQ0FBQyxNQUFELENBQTlCLEVBQXdDO0FBQzdELFFBQUEsSUFBSSxFQUFFLFNBQWMsRUFBZCxFQUFrQixZQUFZLENBQUMsTUFBRCxDQUFaLENBQXFCLElBQXZDLEVBQTZDLElBQTdDO0FBRHVELE9BQXhDLENBQXZCO0FBR0QsS0FKRDtBQU1BLFNBQUssR0FBTCxDQUFTLGtCQUFUO0FBQ0EsU0FBSyxHQUFMLENBQVMsSUFBVDtBQUVBLFNBQUssUUFBTCxDQUFjO0FBQ1osTUFBQSxJQUFJLEVBQUUsV0FETTtBQUVaLE1BQUEsS0FBSyxFQUFFO0FBRkssS0FBZDtBQUlELEc7O1NBRUQsVyxHQUFBLHFCQUFhLE1BQWIsRUFBcUIsSUFBckIsRUFBMkI7QUFDekIsUUFBTSxZQUFZLEdBQUcsU0FBYyxFQUFkLEVBQWtCLEtBQUssUUFBTCxHQUFnQixLQUFsQyxDQUFyQjs7QUFDQSxRQUFJLENBQUMsWUFBWSxDQUFDLE1BQUQsQ0FBakIsRUFBMkI7QUFDekIsV0FBSyxHQUFMLENBQVMsK0RBQVQsRUFBMEUsTUFBMUU7QUFDQTtBQUNEOztBQUNELFFBQU0sT0FBTyxHQUFHLFNBQWMsRUFBZCxFQUFrQixZQUFZLENBQUMsTUFBRCxDQUFaLENBQXFCLElBQXZDLEVBQTZDLElBQTdDLENBQWhCOztBQUNBLElBQUEsWUFBWSxDQUFDLE1BQUQsQ0FBWixHQUF1QixTQUFjLEVBQWQsRUFBa0IsWUFBWSxDQUFDLE1BQUQsQ0FBOUIsRUFBd0M7QUFDN0QsTUFBQSxJQUFJLEVBQUU7QUFEdUQsS0FBeEMsQ0FBdkI7QUFHQSxTQUFLLFFBQUwsQ0FBYztBQUFFLE1BQUEsS0FBSyxFQUFFO0FBQVQsS0FBZDtBQUNEO0FBRUQ7QUFDRjtBQUNBO0FBQ0E7QUFDQTs7O1NBQ0UsTyxHQUFBLGlCQUFTLE1BQVQsRUFBaUI7QUFDZixXQUFPLEtBQUssUUFBTCxHQUFnQixLQUFoQixDQUFzQixNQUF0QixDQUFQO0FBQ0Q7QUFFRDtBQUNGO0FBQ0E7OztTQUNFLFEsR0FBQSxvQkFBWTtBQUFBLHlCQUNRLEtBQUssUUFBTCxFQURSO0FBQUEsUUFDRixLQURFLGtCQUNGLEtBREU7O0FBRVYsV0FBTyxNQUFNLENBQUMsSUFBUCxDQUFZLEtBQVosRUFBbUIsR0FBbkIsQ0FBdUIsVUFBQyxNQUFEO0FBQUEsYUFBWSxLQUFLLENBQUMsTUFBRCxDQUFqQjtBQUFBLEtBQXZCLENBQVA7QUFDRDtBQUVEO0FBQ0Y7QUFDQTtBQUNBO0FBQ0E7OztTQUNFLHNCLEdBQUEsZ0NBQXdCLEtBQXhCLEVBQStCO0FBQUEsUUFDckIsZ0JBRHFCLEdBQ0EsS0FBSyxJQUFMLENBQVUsWUFEVixDQUNyQixnQkFEcUI7O0FBRTdCLFFBQUksTUFBTSxDQUFDLElBQVAsQ0FBWSxLQUFaLEVBQW1CLE1BQW5CLEdBQTRCLGdCQUFoQyxFQUFrRDtBQUNoRCxZQUFNLElBQUksZ0JBQUosTUFBd0IsS0FBSyxJQUFMLENBQVUseUJBQVYsRUFBcUM7QUFBRSxRQUFBLFdBQVcsRUFBRTtBQUFmLE9BQXJDLENBQXhCLENBQU47QUFDRDtBQUNGO0FBRUQ7QUFDRjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7O1NBQ0Usa0IsR0FBQSw0QkFBb0IsS0FBcEIsRUFBMkIsSUFBM0IsRUFBaUM7QUFBQSxnQ0FDNEQsS0FBSyxJQUFMLENBQVUsWUFEdEU7QUFBQSxRQUN2QixXQUR1Qix5QkFDdkIsV0FEdUI7QUFBQSxRQUNWLFdBRFUseUJBQ1YsV0FEVTtBQUFBLFFBQ0csZ0JBREgseUJBQ0csZ0JBREg7QUFBQSxRQUNxQixnQkFEckIseUJBQ3FCLGdCQURyQjtBQUFBLFFBQ3VDLGdCQUR2Qyx5QkFDdUMsZ0JBRHZDOztBQUcvQixRQUFJLGdCQUFKLEVBQXNCO0FBQ3BCLFVBQUksTUFBTSxDQUFDLElBQVAsQ0FBWSxLQUFaLEVBQW1CLE1BQW5CLEdBQTRCLENBQTVCLEdBQWdDLGdCQUFwQyxFQUFzRDtBQUNwRCxjQUFNLElBQUksZ0JBQUosTUFBd0IsS0FBSyxJQUFMLENBQVUsbUJBQVYsRUFBK0I7QUFBRSxVQUFBLFdBQVcsRUFBRTtBQUFmLFNBQS9CLENBQXhCLENBQU47QUFDRDtBQUNGOztBQUVELFFBQUksZ0JBQUosRUFBc0I7QUFDcEIsVUFBTSxpQkFBaUIsR0FBRyxnQkFBZ0IsQ0FBQyxJQUFqQixDQUFzQixVQUFDLElBQUQsRUFBVTtBQUN4RDtBQUNBLFlBQUksSUFBSSxDQUFDLE9BQUwsQ0FBYSxHQUFiLElBQW9CLENBQUMsQ0FBekIsRUFBNEI7QUFDMUIsY0FBSSxDQUFDLElBQUksQ0FBQyxJQUFWLEVBQWdCLE9BQU8sS0FBUDtBQUNoQixpQkFBTyxLQUFLLENBQUMsSUFBSSxDQUFDLElBQUwsQ0FBVSxPQUFWLENBQWtCLE9BQWxCLEVBQTJCLEVBQTNCLENBQUQsRUFBaUMsSUFBakMsQ0FBWjtBQUNELFNBTHVELENBT3hEOzs7QUFDQSxZQUFJLElBQUksQ0FBQyxDQUFELENBQUosS0FBWSxHQUFoQixFQUFxQjtBQUNuQixpQkFBTyxJQUFJLENBQUMsU0FBTCxDQUFlLFdBQWYsT0FBaUMsSUFBSSxDQUFDLE1BQUwsQ0FBWSxDQUFaLEVBQWUsV0FBZixFQUF4QztBQUNEOztBQUNELGVBQU8sS0FBUDtBQUNELE9BWnlCLENBQTFCOztBQWNBLFVBQUksQ0FBQyxpQkFBTCxFQUF3QjtBQUN0QixZQUFNLHNCQUFzQixHQUFHLGdCQUFnQixDQUFDLElBQWpCLENBQXNCLElBQXRCLENBQS9CO0FBQ0EsY0FBTSxJQUFJLGdCQUFKLENBQXFCLEtBQUssSUFBTCxDQUFVLDJCQUFWLEVBQXVDO0FBQUUsVUFBQSxLQUFLLEVBQUU7QUFBVCxTQUF2QyxDQUFyQixDQUFOO0FBQ0Q7QUFDRixLQTVCOEIsQ0E4Qi9COzs7QUFDQSxRQUFJLGdCQUFnQixJQUFJLElBQUksQ0FBQyxJQUFMLENBQVUsSUFBVixJQUFrQixJQUExQyxFQUFnRDtBQUM5QyxVQUFJLGNBQWMsR0FBRyxDQUFyQjtBQUNBLE1BQUEsY0FBYyxJQUFJLElBQUksQ0FBQyxJQUFMLENBQVUsSUFBNUI7QUFDQSxNQUFBLE1BQU0sQ0FBQyxJQUFQLENBQVksS0FBWixFQUFtQixPQUFuQixDQUEyQixVQUFDLElBQUQsRUFBVTtBQUNuQyxRQUFBLGNBQWMsSUFBSSxLQUFLLENBQUMsSUFBRCxDQUFMLENBQVksSUFBWixDQUFpQixJQUFuQztBQUNELE9BRkQ7O0FBR0EsVUFBSSxjQUFjLEdBQUcsZ0JBQXJCLEVBQXVDO0FBQ3JDLGNBQU0sSUFBSSxnQkFBSixDQUFxQixLQUFLLElBQUwsQ0FBVSxjQUFWLEVBQTBCO0FBQ25ELFVBQUEsZUFBZSxFQUFFLEtBQUssSUFBTCxDQUFVLGFBQVYsQ0FEa0M7QUFFbkQsVUFBQSxJQUFJLEVBQUUsYUFBYSxDQUFDLGdCQUFEO0FBRmdDLFNBQTFCLENBQXJCLENBQU47QUFJRDtBQUNGLEtBM0M4QixDQTZDL0I7OztBQUNBLFFBQUksV0FBVyxJQUFJLElBQUksQ0FBQyxJQUFMLENBQVUsSUFBVixJQUFrQixJQUFyQyxFQUEyQztBQUN6QyxVQUFJLElBQUksQ0FBQyxJQUFMLENBQVUsSUFBVixHQUFpQixXQUFyQixFQUFrQztBQUNoQyxjQUFNLElBQUksZ0JBQUosQ0FBcUIsS0FBSyxJQUFMLENBQVUsY0FBVixFQUEwQjtBQUNuRCxVQUFBLGVBQWUsRUFBRSxLQUFLLElBQUwsQ0FBVSxhQUFWLENBRGtDO0FBRW5ELFVBQUEsSUFBSSxFQUFFLGFBQWEsQ0FBQyxXQUFEO0FBRmdDLFNBQTFCLENBQXJCLENBQU47QUFJRDtBQUNGLEtBckQ4QixDQXVEL0I7OztBQUNBLFFBQUksV0FBVyxJQUFJLElBQUksQ0FBQyxJQUFMLENBQVUsSUFBVixJQUFrQixJQUFyQyxFQUEyQztBQUN6QyxVQUFJLElBQUksQ0FBQyxJQUFMLENBQVUsSUFBVixHQUFpQixXQUFyQixFQUFrQztBQUNoQyxjQUFNLElBQUksZ0JBQUosQ0FBcUIsS0FBSyxJQUFMLENBQVUsY0FBVixFQUEwQjtBQUNuRCxVQUFBLElBQUksRUFBRSxhQUFhLENBQUMsV0FBRDtBQURnQyxTQUExQixDQUFyQixDQUFOO0FBR0Q7QUFDRjtBQUNGO0FBRUQ7QUFDRjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7O1NBQ0UsdUIsR0FBQSxpQ0FBeUIsR0FBekIsU0FBMEY7QUFBQSxrQ0FBSixFQUFJO0FBQUEsaUNBQTFELFlBQTBEO0FBQUEsUUFBMUQsWUFBMEQsa0NBQTNDLElBQTJDO0FBQUEseUJBQXJDLElBQXFDO0FBQUEsUUFBckMsSUFBcUMsMEJBQTlCLElBQThCO0FBQUEsNkJBQXhCLFFBQXdCO0FBQUEsUUFBeEIsUUFBd0IsOEJBQWIsSUFBYTs7QUFDeEYsUUFBTSxPQUFPLEdBQUcsT0FBTyxHQUFQLEtBQWUsUUFBZixHQUEwQixHQUFHLENBQUMsT0FBOUIsR0FBd0MsR0FBeEQ7QUFDQSxRQUFNLE9BQU8sR0FBSSxPQUFPLEdBQVAsS0FBZSxRQUFmLElBQTJCLEdBQUcsQ0FBQyxPQUFoQyxHQUEyQyxHQUFHLENBQUMsT0FBL0MsR0FBeUQsRUFBekUsQ0FGd0YsQ0FJeEY7QUFDQTs7QUFDQSxRQUFJLHFCQUFxQixHQUFHLE9BQTVCOztBQUNBLFFBQUksT0FBSixFQUFhO0FBQ1gsTUFBQSxxQkFBcUIsSUFBSSxNQUFNLE9BQS9CO0FBQ0Q7O0FBQ0QsUUFBSSxHQUFHLENBQUMsYUFBUixFQUF1QjtBQUNyQixXQUFLLEdBQUwsQ0FBUyxxQkFBVDtBQUNBLFdBQUssSUFBTCxDQUFVLG9CQUFWLEVBQWdDLElBQWhDLEVBQXNDLEdBQXRDO0FBQ0QsS0FIRCxNQUdPO0FBQ0wsV0FBSyxHQUFMLENBQVMscUJBQVQsRUFBZ0MsT0FBaEM7QUFDRCxLQWZ1RixDQWlCeEY7QUFDQTs7O0FBQ0EsUUFBSSxZQUFKLEVBQWtCO0FBQ2hCLFdBQUssSUFBTCxDQUFVO0FBQUUsUUFBQSxPQUFPLEVBQUUsT0FBWDtBQUFvQixRQUFBLE9BQU8sRUFBRTtBQUE3QixPQUFWLEVBQWtELE9BQWxELEVBQTJELElBQTNEO0FBQ0Q7O0FBRUQsUUFBSSxRQUFKLEVBQWM7QUFDWixZQUFPLE9BQU8sR0FBUCxLQUFlLFFBQWYsR0FBMEIsR0FBMUIsR0FBZ0MsSUFBSSxLQUFKLENBQVUsR0FBVixDQUF2QztBQUNEO0FBQ0YsRzs7U0FFRCx1QixHQUFBLGlDQUF5QixJQUF6QixFQUErQjtBQUFBLDBCQUNGLEtBQUssUUFBTCxFQURFO0FBQUEsUUFDckIsY0FEcUIsbUJBQ3JCLGNBRHFCOztBQUc3QixRQUFJLGNBQWMsS0FBSyxLQUF2QixFQUE4QjtBQUM1QixXQUFLLHVCQUFMLENBQTZCLElBQUksZ0JBQUosQ0FBcUIsS0FBSyxJQUFMLENBQVUsdUJBQVYsQ0FBckIsQ0FBN0IsRUFBdUY7QUFBRSxRQUFBLElBQUksRUFBSjtBQUFGLE9BQXZGO0FBQ0Q7QUFDRjtBQUVEO0FBQ0Y7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOzs7U0FDRSw4QixHQUFBLHdDQUFnQyxLQUFoQyxFQUF1QyxJQUF2QyxFQUE2QztBQUMzQyxRQUFNLFFBQVEsR0FBRyxXQUFXLENBQUMsSUFBRCxDQUE1QjtBQUNBLElBQUEsSUFBSSxDQUFDLElBQUwsR0FBWSxRQUFaO0FBRUEsUUFBTSx1QkFBdUIsR0FBRyxLQUFLLElBQUwsQ0FBVSxpQkFBVixDQUE0QixJQUE1QixFQUFrQyxLQUFsQyxDQUFoQzs7QUFFQSxRQUFJLHVCQUF1QixLQUFLLEtBQWhDLEVBQXVDO0FBQ3JDO0FBQ0EsV0FBSyx1QkFBTCxDQUE2QixJQUFJLGdCQUFKLENBQXFCLCtEQUFyQixDQUE3QixFQUFvSDtBQUFFLFFBQUEsWUFBWSxFQUFFLEtBQWhCO0FBQXVCLFFBQUEsSUFBSSxFQUFKO0FBQXZCLE9BQXBIO0FBQ0Q7O0FBRUQsUUFBSSxPQUFPLHVCQUFQLEtBQW1DLFFBQW5DLElBQStDLHVCQUFuRCxFQUE0RTtBQUMxRSxNQUFBLElBQUksR0FBRyx1QkFBUDtBQUNEOztBQUVELFFBQUksUUFBSjs7QUFDQSxRQUFJLElBQUksQ0FBQyxJQUFULEVBQWU7QUFDYixNQUFBLFFBQVEsR0FBRyxJQUFJLENBQUMsSUFBaEI7QUFDRCxLQUZELE1BRU8sSUFBSSxRQUFRLENBQUMsS0FBVCxDQUFlLEdBQWYsRUFBb0IsQ0FBcEIsTUFBMkIsT0FBL0IsRUFBd0M7QUFDN0MsTUFBQSxRQUFRLEdBQUcsUUFBUSxDQUFDLEtBQVQsQ0FBZSxHQUFmLEVBQW9CLENBQXBCLElBQXlCLEdBQXpCLEdBQStCLFFBQVEsQ0FBQyxLQUFULENBQWUsR0FBZixFQUFvQixDQUFwQixDQUExQztBQUNELEtBRk0sTUFFQTtBQUNMLE1BQUEsUUFBUSxHQUFHLFFBQVg7QUFDRDs7QUFDRCxRQUFNLGFBQWEsR0FBRyx1QkFBdUIsQ0FBQyxRQUFELENBQXZCLENBQWtDLFNBQXhEO0FBQ0EsUUFBTSxRQUFRLEdBQUcsSUFBSSxDQUFDLFFBQUwsSUFBaUIsS0FBbEM7QUFFQSxRQUFNLE1BQU0sR0FBRyxjQUFjLENBQUMsSUFBRCxDQUE3Qjs7QUFFQSxRQUFJLEtBQUssQ0FBQyxNQUFELENBQVQsRUFBbUI7QUFDakIsV0FBSyx1QkFBTCxDQUE2QixJQUFJLGdCQUFKLENBQXFCLEtBQUssSUFBTCxDQUFVLGNBQVYsRUFBMEI7QUFBRSxRQUFBLFFBQVEsRUFBUjtBQUFGLE9BQTFCLENBQXJCLENBQTdCLEVBQTRGO0FBQUUsUUFBQSxJQUFJLEVBQUo7QUFBRixPQUE1RjtBQUNEOztBQUVELFFBQU0sSUFBSSxHQUFHLElBQUksQ0FBQyxJQUFMLElBQWEsRUFBMUI7QUFDQSxJQUFBLElBQUksQ0FBQyxJQUFMLEdBQVksUUFBWjtBQUNBLElBQUEsSUFBSSxDQUFDLElBQUwsR0FBWSxRQUFaLENBbEMyQyxDQW9DM0M7O0FBQ0EsUUFBTSxJQUFJLEdBQUcsUUFBUSxDQUFDLElBQUksQ0FBQyxJQUFMLENBQVUsSUFBWCxDQUFSLEdBQTJCLElBQUksQ0FBQyxJQUFMLENBQVUsSUFBckMsR0FBNEMsSUFBekQ7QUFDQSxRQUFNLE9BQU8sR0FBRztBQUNkLE1BQUEsTUFBTSxFQUFFLElBQUksQ0FBQyxNQUFMLElBQWUsRUFEVDtBQUVkLE1BQUEsRUFBRSxFQUFFLE1BRlU7QUFHZCxNQUFBLElBQUksRUFBRSxRQUhRO0FBSWQsTUFBQSxTQUFTLEVBQUUsYUFBYSxJQUFJLEVBSmQ7QUFLZCxNQUFBLElBQUksZUFDQyxLQUFLLFFBQUwsR0FBZ0IsSUFEakIsRUFFQyxJQUZELENBTFU7QUFTZCxNQUFBLElBQUksRUFBRSxRQVRRO0FBVWQsTUFBQSxJQUFJLEVBQUUsSUFBSSxDQUFDLElBVkc7QUFXZCxNQUFBLFFBQVEsRUFBRTtBQUNSLFFBQUEsVUFBVSxFQUFFLENBREo7QUFFUixRQUFBLGFBQWEsRUFBRSxDQUZQO0FBR1IsUUFBQSxVQUFVLEVBQUUsSUFISjtBQUlSLFFBQUEsY0FBYyxFQUFFLEtBSlI7QUFLUixRQUFBLGFBQWEsRUFBRTtBQUxQLE9BWEk7QUFrQmQsTUFBQSxJQUFJLEVBQUUsSUFsQlE7QUFtQmQsTUFBQSxRQUFRLEVBQUUsUUFuQkk7QUFvQmQsTUFBQSxNQUFNLEVBQUUsSUFBSSxDQUFDLE1BQUwsSUFBZSxFQXBCVDtBQXFCZCxNQUFBLE9BQU8sRUFBRSxJQUFJLENBQUM7QUFyQkEsS0FBaEI7O0FBd0JBLFFBQUk7QUFDRixXQUFLLGtCQUFMLENBQXdCLEtBQXhCLEVBQStCLE9BQS9CO0FBQ0QsS0FGRCxDQUVFLE9BQU8sR0FBUCxFQUFZO0FBQ1osV0FBSyx1QkFBTCxDQUE2QixHQUE3QixFQUFrQztBQUFFLFFBQUEsSUFBSSxFQUFFO0FBQVIsT0FBbEM7QUFDRDs7QUFFRCxXQUFPLE9BQVA7QUFDRCxHLENBRUQ7OztTQUNBLG1CLEdBQUEsK0JBQXVCO0FBQUE7O0FBQ3JCLFFBQUksS0FBSyxJQUFMLENBQVUsV0FBVixJQUF5QixDQUFDLEtBQUssb0JBQW5DLEVBQXlEO0FBQ3ZELFdBQUssb0JBQUwsR0FBNEIsVUFBVSxDQUFDLFlBQU07QUFDM0MsUUFBQSxNQUFJLENBQUMsb0JBQUwsR0FBNEIsSUFBNUI7O0FBQ0EsUUFBQSxNQUFJLENBQUMsTUFBTCxHQUFjLEtBQWQsQ0FBb0IsVUFBQyxHQUFELEVBQVM7QUFDM0IsY0FBSSxDQUFDLEdBQUcsQ0FBQyxhQUFULEVBQXdCO0FBQ3RCLFlBQUEsTUFBSSxDQUFDLEdBQUwsQ0FBUyxHQUFHLENBQUMsS0FBSixJQUFhLEdBQUcsQ0FBQyxPQUFqQixJQUE0QixHQUFyQztBQUNEO0FBQ0YsU0FKRDtBQUtELE9BUHFDLEVBT25DLENBUG1DLENBQXRDO0FBUUQ7QUFDRjtBQUVEO0FBQ0Y7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7OztTQUNFLE8sR0FBQSxpQkFBUyxJQUFULEVBQWU7QUFBQTs7QUFDYixTQUFLLHVCQUFMLENBQTZCLElBQTdCOztBQURhLDBCQUdLLEtBQUssUUFBTCxFQUhMO0FBQUEsUUFHTCxLQUhLLG1CQUdMLEtBSEs7O0FBSWIsUUFBTSxPQUFPLEdBQUcsS0FBSyw4QkFBTCxDQUFvQyxLQUFwQyxFQUEyQyxJQUEzQyxDQUFoQjs7QUFFQSxTQUFLLFFBQUwsQ0FBYztBQUNaLE1BQUEsS0FBSyxlQUNBLEtBREEsNkJBRUYsT0FBTyxDQUFDLEVBRk4sSUFFVyxPQUZYO0FBRE8sS0FBZDtBQU9BLFNBQUssSUFBTCxDQUFVLFlBQVYsRUFBd0IsT0FBeEI7QUFDQSxTQUFLLEdBQUwsa0JBQXdCLE9BQU8sQ0FBQyxJQUFoQyxVQUF5QyxPQUFPLENBQUMsRUFBakQscUJBQW1FLE9BQU8sQ0FBQyxJQUEzRTs7QUFFQSxTQUFLLG1CQUFMOztBQUVBLFdBQU8sT0FBTyxDQUFDLEVBQWY7QUFDRDtBQUVEO0FBQ0Y7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOzs7U0FDRSxRLEdBQUEsa0JBQVUsZUFBVixFQUEyQjtBQUFBOztBQUN6QixTQUFLLHVCQUFMLEdBRHlCLENBR3pCOzs7QUFDQSxRQUFNLEtBQUssZ0JBQVEsS0FBSyxRQUFMLEdBQWdCLEtBQXhCLENBQVg7O0FBQ0EsUUFBTSxRQUFRLEdBQUcsRUFBakI7QUFDQSxRQUFNLE1BQU0sR0FBRyxFQUFmOztBQUNBLFNBQUssSUFBSSxDQUFDLEdBQUcsQ0FBYixFQUFnQixDQUFDLEdBQUcsZUFBZSxDQUFDLE1BQXBDLEVBQTRDLENBQUMsRUFBN0MsRUFBaUQ7QUFDL0MsVUFBSTtBQUNGLFlBQU0sT0FBTyxHQUFHLEtBQUssOEJBQUwsQ0FBb0MsS0FBcEMsRUFBMkMsZUFBZSxDQUFDLENBQUQsQ0FBMUQsQ0FBaEI7O0FBQ0EsUUFBQSxRQUFRLENBQUMsSUFBVCxDQUFjLE9BQWQ7QUFDQSxRQUFBLEtBQUssQ0FBQyxPQUFPLENBQUMsRUFBVCxDQUFMLEdBQW9CLE9BQXBCO0FBQ0QsT0FKRCxDQUlFLE9BQU8sR0FBUCxFQUFZO0FBQ1osWUFBSSxDQUFDLEdBQUcsQ0FBQyxhQUFULEVBQXdCO0FBQ3RCLFVBQUEsTUFBTSxDQUFDLElBQVAsQ0FBWSxHQUFaO0FBQ0Q7QUFDRjtBQUNGOztBQUVELFNBQUssUUFBTCxDQUFjO0FBQUUsTUFBQSxLQUFLLEVBQUw7QUFBRixLQUFkO0FBRUEsSUFBQSxRQUFRLENBQUMsT0FBVCxDQUFpQixVQUFDLE9BQUQsRUFBYTtBQUM1QixNQUFBLE1BQUksQ0FBQyxJQUFMLENBQVUsWUFBVixFQUF3QixPQUF4QjtBQUNELEtBRkQ7O0FBSUEsUUFBSSxRQUFRLENBQUMsTUFBVCxHQUFrQixDQUF0QixFQUF5QjtBQUN2QixXQUFLLEdBQUwscUJBQTJCLFFBQVEsQ0FBQyxNQUFwQztBQUNELEtBRkQsTUFFTztBQUNMLE1BQUEsTUFBTSxDQUFDLElBQVAsQ0FBWSxRQUFaLEVBQXNCLE9BQXRCLENBQThCLFVBQUEsTUFBTSxFQUFJO0FBQ3RDLFFBQUEsTUFBSSxDQUFDLEdBQUwsa0JBQXdCLFFBQVEsQ0FBQyxNQUFELENBQVIsQ0FBaUIsSUFBekMsZUFBdUQsUUFBUSxDQUFDLE1BQUQsQ0FBUixDQUFpQixFQUF4RSxpQkFBc0YsUUFBUSxDQUFDLE1BQUQsQ0FBUixDQUFpQixJQUF2RztBQUNELE9BRkQ7QUFHRDs7QUFFRCxRQUFJLFFBQVEsQ0FBQyxNQUFULEdBQWtCLENBQXRCLEVBQXlCO0FBQ3ZCLFdBQUssbUJBQUw7QUFDRDs7QUFFRCxRQUFJLE1BQU0sQ0FBQyxNQUFQLEdBQWdCLENBQXBCLEVBQXVCO0FBQ3JCLFVBQUksT0FBTyxHQUFHLGdEQUFkO0FBQ0EsTUFBQSxNQUFNLENBQUMsT0FBUCxDQUFlLFVBQUMsUUFBRCxFQUFjO0FBQzNCLFFBQUEsT0FBTyxjQUFZLFFBQVEsQ0FBQyxPQUE1QjtBQUNELE9BRkQ7QUFJQSxXQUFLLElBQUwsQ0FBVTtBQUNSLFFBQUEsT0FBTyxFQUFFLEtBQUssSUFBTCxDQUFVLG9CQUFWLEVBQWdDO0FBQUUsVUFBQSxXQUFXLEVBQUUsTUFBTSxDQUFDO0FBQXRCLFNBQWhDLENBREQ7QUFFUixRQUFBLE9BQU8sRUFBRTtBQUZELE9BQVYsRUFHRyxPQUhILEVBR1ksSUFIWjtBQUtBLFVBQU0sR0FBRyxHQUFHLElBQUksS0FBSixDQUFVLE9BQVYsQ0FBWjtBQUNBLE1BQUEsR0FBRyxDQUFDLE1BQUosR0FBYSxNQUFiO0FBQ0EsWUFBTSxHQUFOO0FBQ0Q7QUFDRixHOztTQUVELFcsR0FBQSxxQkFBYSxPQUFiLEVBQXNCLE1BQXRCLEVBQThCO0FBQUE7O0FBQUEsMEJBQ00sS0FBSyxRQUFMLEVBRE47QUFBQSxRQUNwQixLQURvQixtQkFDcEIsS0FEb0I7QUFBQSxRQUNiLGNBRGEsbUJBQ2IsY0FEYTs7QUFFNUIsUUFBTSxZQUFZLGdCQUFRLEtBQVIsQ0FBbEI7O0FBQ0EsUUFBTSxjQUFjLGdCQUFRLGNBQVIsQ0FBcEI7O0FBRUEsUUFBTSxZQUFZLEdBQUcsTUFBTSxDQUFDLE1BQVAsQ0FBYyxJQUFkLENBQXJCO0FBQ0EsSUFBQSxPQUFPLENBQUMsT0FBUixDQUFnQixVQUFDLE1BQUQsRUFBWTtBQUMxQixVQUFJLEtBQUssQ0FBQyxNQUFELENBQVQsRUFBbUI7QUFDakIsUUFBQSxZQUFZLENBQUMsTUFBRCxDQUFaLEdBQXVCLEtBQUssQ0FBQyxNQUFELENBQTVCO0FBQ0EsZUFBTyxZQUFZLENBQUMsTUFBRCxDQUFuQjtBQUNEO0FBQ0YsS0FMRCxFQU40QixDQWE1Qjs7QUFDQSxhQUFTLGdCQUFULENBQTJCLFlBQTNCLEVBQXlDO0FBQ3ZDLGFBQU8sWUFBWSxDQUFDLFlBQUQsQ0FBWixLQUErQixTQUF0QztBQUNEOztBQUNELFFBQU0sZUFBZSxHQUFHLEVBQXhCO0FBQ0EsSUFBQSxNQUFNLENBQUMsSUFBUCxDQUFZLGNBQVosRUFBNEIsT0FBNUIsQ0FBb0MsVUFBQyxRQUFELEVBQWM7QUFDaEQsVUFBTSxVQUFVLEdBQUcsY0FBYyxDQUFDLFFBQUQsQ0FBZCxDQUF5QixPQUF6QixDQUFpQyxNQUFqQyxDQUF3QyxnQkFBeEMsQ0FBbkIsQ0FEZ0QsQ0FHaEQ7O0FBQ0EsVUFBSSxVQUFVLENBQUMsTUFBWCxLQUFzQixDQUExQixFQUE2QjtBQUMzQixRQUFBLGVBQWUsQ0FBQyxJQUFoQixDQUFxQixRQUFyQjtBQUNBO0FBQ0Q7O0FBRUQsTUFBQSxjQUFjLENBQUMsUUFBRCxDQUFkLGdCQUNLLGNBQWMsQ0FBQyxRQUFELENBRG5CO0FBRUUsUUFBQSxPQUFPLEVBQUU7QUFGWDtBQUlELEtBYkQ7QUFlQSxJQUFBLGVBQWUsQ0FBQyxPQUFoQixDQUF3QixVQUFDLFFBQUQsRUFBYztBQUNwQyxhQUFPLGNBQWMsQ0FBQyxRQUFELENBQXJCO0FBQ0QsS0FGRDtBQUlBLFFBQU0sV0FBVyxHQUFHO0FBQ2xCLE1BQUEsY0FBYyxFQUFFLGNBREU7QUFFbEIsTUFBQSxLQUFLLEVBQUU7QUFGVyxLQUFwQixDQXJDNEIsQ0EwQzVCOztBQUNBLFFBQUksTUFBTSxDQUFDLElBQVAsQ0FBWSxZQUFaLEVBQTBCLE1BQTFCLEtBQXFDLENBQXpDLEVBQTRDO0FBQzFDLE1BQUEsV0FBVyxDQUFDLGNBQVosR0FBNkIsSUFBN0I7QUFDQSxNQUFBLFdBQVcsQ0FBQyxLQUFaLEdBQW9CLElBQXBCO0FBQ0Q7O0FBRUQsU0FBSyxRQUFMLENBQWMsV0FBZDs7QUFDQSxTQUFLLHVCQUFMOztBQUVBLFFBQU0sY0FBYyxHQUFHLE1BQU0sQ0FBQyxJQUFQLENBQVksWUFBWixDQUF2QjtBQUNBLElBQUEsY0FBYyxDQUFDLE9BQWYsQ0FBdUIsVUFBQyxNQUFELEVBQVk7QUFDakMsTUFBQSxNQUFJLENBQUMsSUFBTCxDQUFVLGNBQVYsRUFBMEIsWUFBWSxDQUFDLE1BQUQsQ0FBdEMsRUFBZ0QsTUFBaEQ7QUFDRCxLQUZEOztBQUlBLFFBQUksY0FBYyxDQUFDLE1BQWYsR0FBd0IsQ0FBNUIsRUFBK0I7QUFDN0IsV0FBSyxHQUFMLGNBQW9CLGNBQWMsQ0FBQyxNQUFuQztBQUNELEtBRkQsTUFFTztBQUNMLFdBQUssR0FBTCxxQkFBMkIsY0FBYyxDQUFDLElBQWYsQ0FBb0IsSUFBcEIsQ0FBM0I7QUFDRDtBQUNGLEc7O1NBRUQsVSxHQUFBLG9CQUFZLE1BQVosRUFBb0IsTUFBcEIsRUFBbUM7QUFBQSxRQUFmLE1BQWU7QUFBZixNQUFBLE1BQWUsR0FBTixJQUFNO0FBQUE7O0FBQ2pDLFNBQUssV0FBTCxDQUFpQixDQUFDLE1BQUQsQ0FBakIsRUFBMkIsTUFBM0I7QUFDRCxHOztTQUVELFcsR0FBQSxxQkFBYSxNQUFiLEVBQXFCO0FBQ25CLFFBQUksQ0FBQyxLQUFLLFFBQUwsR0FBZ0IsWUFBaEIsQ0FBNkIsZ0JBQTlCLElBQ0MsS0FBSyxPQUFMLENBQWEsTUFBYixFQUFxQixjQUQxQixFQUMwQztBQUN4QztBQUNEOztBQUVELFFBQU0sU0FBUyxHQUFHLEtBQUssT0FBTCxDQUFhLE1BQWIsRUFBcUIsUUFBckIsSUFBaUMsS0FBbkQ7QUFDQSxRQUFNLFFBQVEsR0FBRyxDQUFDLFNBQWxCO0FBRUEsU0FBSyxZQUFMLENBQWtCLE1BQWxCLEVBQTBCO0FBQ3hCLE1BQUEsUUFBUSxFQUFFO0FBRGMsS0FBMUI7QUFJQSxTQUFLLElBQUwsQ0FBVSxjQUFWLEVBQTBCLE1BQTFCLEVBQWtDLFFBQWxDO0FBRUEsV0FBTyxRQUFQO0FBQ0QsRzs7U0FFRCxRLEdBQUEsb0JBQVk7QUFDVixRQUFNLFlBQVksR0FBRyxTQUFjLEVBQWQsRUFBa0IsS0FBSyxRQUFMLEdBQWdCLEtBQWxDLENBQXJCOztBQUNBLFFBQU0sc0JBQXNCLEdBQUcsTUFBTSxDQUFDLElBQVAsQ0FBWSxZQUFaLEVBQTBCLE1BQTFCLENBQWlDLFVBQUMsSUFBRCxFQUFVO0FBQ3hFLGFBQU8sQ0FBQyxZQUFZLENBQUMsSUFBRCxDQUFaLENBQW1CLFFBQW5CLENBQTRCLGNBQTdCLElBQ0EsWUFBWSxDQUFDLElBQUQsQ0FBWixDQUFtQixRQUFuQixDQUE0QixhQURuQztBQUVELEtBSDhCLENBQS9CO0FBS0EsSUFBQSxzQkFBc0IsQ0FBQyxPQUF2QixDQUErQixVQUFDLElBQUQsRUFBVTtBQUN2QyxVQUFNLFdBQVcsR0FBRyxTQUFjLEVBQWQsRUFBa0IsWUFBWSxDQUFDLElBQUQsQ0FBOUIsRUFBc0M7QUFDeEQsUUFBQSxRQUFRLEVBQUU7QUFEOEMsT0FBdEMsQ0FBcEI7O0FBR0EsTUFBQSxZQUFZLENBQUMsSUFBRCxDQUFaLEdBQXFCLFdBQXJCO0FBQ0QsS0FMRDtBQU9BLFNBQUssUUFBTCxDQUFjO0FBQUUsTUFBQSxLQUFLLEVBQUU7QUFBVCxLQUFkO0FBQ0EsU0FBSyxJQUFMLENBQVUsV0FBVjtBQUNELEc7O1NBRUQsUyxHQUFBLHFCQUFhO0FBQ1gsUUFBTSxZQUFZLEdBQUcsU0FBYyxFQUFkLEVBQWtCLEtBQUssUUFBTCxHQUFnQixLQUFsQyxDQUFyQjs7QUFDQSxRQUFNLHNCQUFzQixHQUFHLE1BQU0sQ0FBQyxJQUFQLENBQVksWUFBWixFQUEwQixNQUExQixDQUFpQyxVQUFDLElBQUQsRUFBVTtBQUN4RSxhQUFPLENBQUMsWUFBWSxDQUFDLElBQUQsQ0FBWixDQUFtQixRQUFuQixDQUE0QixjQUE3QixJQUNBLFlBQVksQ0FBQyxJQUFELENBQVosQ0FBbUIsUUFBbkIsQ0FBNEIsYUFEbkM7QUFFRCxLQUg4QixDQUEvQjtBQUtBLElBQUEsc0JBQXNCLENBQUMsT0FBdkIsQ0FBK0IsVUFBQyxJQUFELEVBQVU7QUFDdkMsVUFBTSxXQUFXLEdBQUcsU0FBYyxFQUFkLEVBQWtCLFlBQVksQ0FBQyxJQUFELENBQTlCLEVBQXNDO0FBQ3hELFFBQUEsUUFBUSxFQUFFLEtBRDhDO0FBRXhELFFBQUEsS0FBSyxFQUFFO0FBRmlELE9BQXRDLENBQXBCOztBQUlBLE1BQUEsWUFBWSxDQUFDLElBQUQsQ0FBWixHQUFxQixXQUFyQjtBQUNELEtBTkQ7QUFPQSxTQUFLLFFBQUwsQ0FBYztBQUFFLE1BQUEsS0FBSyxFQUFFO0FBQVQsS0FBZDtBQUVBLFNBQUssSUFBTCxDQUFVLFlBQVY7QUFDRCxHOztTQUVELFEsR0FBQSxvQkFBWTtBQUNWLFFBQU0sWUFBWSxHQUFHLFNBQWMsRUFBZCxFQUFrQixLQUFLLFFBQUwsR0FBZ0IsS0FBbEMsQ0FBckI7O0FBQ0EsUUFBTSxZQUFZLEdBQUcsTUFBTSxDQUFDLElBQVAsQ0FBWSxZQUFaLEVBQTBCLE1BQTFCLENBQWlDLFVBQUEsSUFBSSxFQUFJO0FBQzVELGFBQU8sWUFBWSxDQUFDLElBQUQsQ0FBWixDQUFtQixLQUExQjtBQUNELEtBRm9CLENBQXJCO0FBSUEsSUFBQSxZQUFZLENBQUMsT0FBYixDQUFxQixVQUFDLElBQUQsRUFBVTtBQUM3QixVQUFNLFdBQVcsR0FBRyxTQUFjLEVBQWQsRUFBa0IsWUFBWSxDQUFDLElBQUQsQ0FBOUIsRUFBc0M7QUFDeEQsUUFBQSxRQUFRLEVBQUUsS0FEOEM7QUFFeEQsUUFBQSxLQUFLLEVBQUU7QUFGaUQsT0FBdEMsQ0FBcEI7O0FBSUEsTUFBQSxZQUFZLENBQUMsSUFBRCxDQUFaLEdBQXFCLFdBQXJCO0FBQ0QsS0FORDtBQU9BLFNBQUssUUFBTCxDQUFjO0FBQ1osTUFBQSxLQUFLLEVBQUUsWUFESztBQUVaLE1BQUEsS0FBSyxFQUFFO0FBRkssS0FBZDtBQUtBLFNBQUssSUFBTCxDQUFVLFdBQVYsRUFBdUIsWUFBdkI7O0FBRUEsUUFBSSxZQUFZLENBQUMsTUFBYixLQUF3QixDQUE1QixFQUErQjtBQUM3QixhQUFPLE9BQU8sQ0FBQyxPQUFSLENBQWdCO0FBQ3JCLFFBQUEsVUFBVSxFQUFFLEVBRFM7QUFFckIsUUFBQSxNQUFNLEVBQUU7QUFGYSxPQUFoQixDQUFQO0FBSUQ7O0FBRUQsUUFBTSxRQUFRLEdBQUcsS0FBSyxhQUFMLENBQW1CLFlBQW5CLEVBQWlDO0FBQ2hELE1BQUEsbUJBQW1CLEVBQUUsSUFEMkIsQ0FDdEI7O0FBRHNCLEtBQWpDLENBQWpCOztBQUdBLFdBQU8sS0FBSyxVQUFMLENBQWdCLFFBQWhCLENBQVA7QUFDRCxHOztTQUVELFMsR0FBQSxxQkFBYTtBQUNYLFNBQUssSUFBTCxDQUFVLFlBQVY7O0FBRFcsMEJBR08sS0FBSyxRQUFMLEVBSFA7QUFBQSxRQUdILEtBSEcsbUJBR0gsS0FIRzs7QUFLWCxRQUFNLE9BQU8sR0FBRyxNQUFNLENBQUMsSUFBUCxDQUFZLEtBQVosQ0FBaEI7O0FBQ0EsUUFBSSxPQUFPLENBQUMsTUFBWixFQUFvQjtBQUNsQixXQUFLLFdBQUwsQ0FBaUIsT0FBakIsRUFBMEIsWUFBMUI7QUFDRDs7QUFFRCxTQUFLLFFBQUwsQ0FBYztBQUNaLE1BQUEsYUFBYSxFQUFFLENBREg7QUFFWixNQUFBLEtBQUssRUFBRTtBQUZLLEtBQWQ7QUFJRCxHOztTQUVELFcsR0FBQSxxQkFBYSxNQUFiLEVBQXFCO0FBQ25CLFNBQUssWUFBTCxDQUFrQixNQUFsQixFQUEwQjtBQUN4QixNQUFBLEtBQUssRUFBRSxJQURpQjtBQUV4QixNQUFBLFFBQVEsRUFBRTtBQUZjLEtBQTFCO0FBS0EsU0FBSyxJQUFMLENBQVUsY0FBVixFQUEwQixNQUExQjs7QUFFQSxRQUFNLFFBQVEsR0FBRyxLQUFLLGFBQUwsQ0FBbUIsQ0FBQyxNQUFELENBQW5CLEVBQTZCO0FBQzVDLE1BQUEsbUJBQW1CLEVBQUUsSUFEdUIsQ0FDbEI7O0FBRGtCLEtBQTdCLENBQWpCOztBQUdBLFdBQU8sS0FBSyxVQUFMLENBQWdCLFFBQWhCLENBQVA7QUFDRCxHOztTQUVELEssR0FBQSxpQkFBUztBQUNQLFNBQUssU0FBTDtBQUNELEc7O1NBRUQsa0IsR0FBQSw0QkFBb0IsSUFBcEIsRUFBMEIsSUFBMUIsRUFBZ0M7QUFDOUIsUUFBSSxDQUFDLEtBQUssT0FBTCxDQUFhLElBQUksQ0FBQyxFQUFsQixDQUFMLEVBQTRCO0FBQzFCLFdBQUssR0FBTCw2REFBbUUsSUFBSSxDQUFDLEVBQXhFO0FBQ0E7QUFDRCxLQUo2QixDQU05Qjs7O0FBQ0EsUUFBTSxpQkFBaUIsR0FBRyxRQUFRLENBQUMsSUFBSSxDQUFDLFVBQU4sQ0FBUixJQUE2QixJQUFJLENBQUMsVUFBTCxHQUFrQixDQUF6RTtBQUNBLFNBQUssWUFBTCxDQUFrQixJQUFJLENBQUMsRUFBdkIsRUFBMkI7QUFDekIsTUFBQSxRQUFRLGVBQ0gsS0FBSyxPQUFMLENBQWEsSUFBSSxDQUFDLEVBQWxCLEVBQXNCLFFBRG5CO0FBRU4sUUFBQSxhQUFhLEVBQUUsSUFBSSxDQUFDLGFBRmQ7QUFHTixRQUFBLFVBQVUsRUFBRSxJQUFJLENBQUMsVUFIWDtBQUlOLFFBQUEsVUFBVSxFQUFFLGlCQUFpQixDQUMzQjtBQUNBO0FBRjJCLFVBR3pCLElBQUksQ0FBQyxLQUFMLENBQVcsSUFBSSxDQUFDLGFBQUwsR0FBcUIsSUFBSSxDQUFDLFVBQTFCLEdBQXVDLEdBQWxELENBSHlCLEdBSXpCO0FBUkU7QUFEaUIsS0FBM0I7O0FBYUEsU0FBSyx1QkFBTDtBQUNELEc7O1NBRUQsdUIsR0FBQSxtQ0FBMkI7QUFDekI7QUFDQTtBQUNBLFFBQU0sS0FBSyxHQUFHLEtBQUssUUFBTCxFQUFkO0FBRUEsUUFBTSxVQUFVLEdBQUcsS0FBSyxDQUFDLE1BQU4sQ0FBYSxVQUFDLElBQUQsRUFBVTtBQUN4QyxhQUFPLElBQUksQ0FBQyxRQUFMLENBQWMsYUFBZCxJQUNMLElBQUksQ0FBQyxRQUFMLENBQWMsVUFEVCxJQUVMLElBQUksQ0FBQyxRQUFMLENBQWMsV0FGaEI7QUFHRCxLQUprQixDQUFuQjs7QUFNQSxRQUFJLFVBQVUsQ0FBQyxNQUFYLEtBQXNCLENBQTFCLEVBQTZCO0FBQzNCLFdBQUssSUFBTCxDQUFVLFVBQVYsRUFBc0IsQ0FBdEI7QUFDQSxXQUFLLFFBQUwsQ0FBYztBQUFFLFFBQUEsYUFBYSxFQUFFO0FBQWpCLE9BQWQ7QUFDQTtBQUNEOztBQUVELFFBQU0sVUFBVSxHQUFHLFVBQVUsQ0FBQyxNQUFYLENBQWtCLFVBQUMsSUFBRDtBQUFBLGFBQVUsSUFBSSxDQUFDLFFBQUwsQ0FBYyxVQUFkLElBQTRCLElBQXRDO0FBQUEsS0FBbEIsQ0FBbkI7QUFDQSxRQUFNLFlBQVksR0FBRyxVQUFVLENBQUMsTUFBWCxDQUFrQixVQUFDLElBQUQ7QUFBQSxhQUFVLElBQUksQ0FBQyxRQUFMLENBQWMsVUFBZCxJQUE0QixJQUF0QztBQUFBLEtBQWxCLENBQXJCOztBQUVBLFFBQUksVUFBVSxDQUFDLE1BQVgsS0FBc0IsQ0FBMUIsRUFBNkI7QUFDM0IsVUFBTSxXQUFXLEdBQUcsVUFBVSxDQUFDLE1BQVgsR0FBb0IsR0FBeEM7QUFDQSxVQUFNLGVBQWUsR0FBRyxZQUFZLENBQUMsTUFBYixDQUFvQixVQUFDLEdBQUQsRUFBTSxJQUFOLEVBQWU7QUFDekQsZUFBTyxHQUFHLEdBQUcsSUFBSSxDQUFDLFFBQUwsQ0FBYyxVQUEzQjtBQUNELE9BRnVCLEVBRXJCLENBRnFCLENBQXhCOztBQUdBLFVBQU0sY0FBYSxHQUFHLElBQUksQ0FBQyxLQUFMLENBQVcsZUFBZSxHQUFHLFdBQWxCLEdBQWdDLEdBQTNDLENBQXRCOztBQUNBLFdBQUssUUFBTCxDQUFjO0FBQUUsUUFBQSxhQUFhLEVBQWI7QUFBRixPQUFkO0FBQ0E7QUFDRDs7QUFFRCxRQUFJLFNBQVMsR0FBRyxVQUFVLENBQUMsTUFBWCxDQUFrQixVQUFDLEdBQUQsRUFBTSxJQUFOLEVBQWU7QUFDL0MsYUFBTyxHQUFHLEdBQUcsSUFBSSxDQUFDLFFBQUwsQ0FBYyxVQUEzQjtBQUNELEtBRmUsRUFFYixDQUZhLENBQWhCO0FBR0EsUUFBTSxXQUFXLEdBQUcsU0FBUyxHQUFHLFVBQVUsQ0FBQyxNQUEzQztBQUNBLElBQUEsU0FBUyxJQUFJLFdBQVcsR0FBRyxZQUFZLENBQUMsTUFBeEM7QUFFQSxRQUFJLFlBQVksR0FBRyxDQUFuQjtBQUNBLElBQUEsVUFBVSxDQUFDLE9BQVgsQ0FBbUIsVUFBQyxJQUFELEVBQVU7QUFDM0IsTUFBQSxZQUFZLElBQUksSUFBSSxDQUFDLFFBQUwsQ0FBYyxhQUE5QjtBQUNELEtBRkQ7QUFHQSxJQUFBLFlBQVksQ0FBQyxPQUFiLENBQXFCLFVBQUMsSUFBRCxFQUFVO0FBQzdCLE1BQUEsWUFBWSxJQUFJLFdBQVcsSUFBSSxJQUFJLENBQUMsUUFBTCxDQUFjLFVBQWQsSUFBNEIsQ0FBaEMsQ0FBWCxHQUFnRCxHQUFoRTtBQUNELEtBRkQ7QUFJQSxRQUFJLGFBQWEsR0FBRyxTQUFTLEtBQUssQ0FBZCxHQUNoQixDQURnQixHQUVoQixJQUFJLENBQUMsS0FBTCxDQUFXLFlBQVksR0FBRyxTQUFmLEdBQTJCLEdBQXRDLENBRkosQ0E1Q3lCLENBZ0R6QjtBQUNBOztBQUNBLFFBQUksYUFBYSxHQUFHLEdBQXBCLEVBQXlCO0FBQ3ZCLE1BQUEsYUFBYSxHQUFHLEdBQWhCO0FBQ0Q7O0FBRUQsU0FBSyxRQUFMLENBQWM7QUFBRSxNQUFBLGFBQWEsRUFBYjtBQUFGLEtBQWQ7QUFDQSxTQUFLLElBQUwsQ0FBVSxVQUFWLEVBQXNCLGFBQXRCO0FBQ0Q7QUFFRDtBQUNGO0FBQ0E7QUFDQTs7O1NBQ0UsYSxHQUFBLHlCQUFpQjtBQUFBOztBQUNmLFNBQUssRUFBTCxDQUFRLE9BQVIsRUFBaUIsVUFBQyxLQUFELEVBQVc7QUFDMUIsVUFBSSxRQUFRLEdBQUcsZUFBZjs7QUFDQSxVQUFJLEtBQUssQ0FBQyxPQUFWLEVBQW1CO0FBQ2pCLFFBQUEsUUFBUSxHQUFHLEtBQUssQ0FBQyxPQUFqQjtBQUNEOztBQUVELFVBQUksS0FBSyxDQUFDLE9BQVYsRUFBbUI7QUFDakIsUUFBQSxRQUFRLElBQUksTUFBTSxLQUFLLENBQUMsT0FBeEI7QUFDRDs7QUFFRCxNQUFBLE1BQUksQ0FBQyxRQUFMLENBQWM7QUFBRSxRQUFBLEtBQUssRUFBRTtBQUFULE9BQWQ7QUFDRCxLQVhEO0FBYUEsU0FBSyxFQUFMLENBQVEsY0FBUixFQUF3QixVQUFDLElBQUQsRUFBTyxLQUFQLEVBQWMsUUFBZCxFQUEyQjtBQUNqRCxVQUFJLFFBQVEsR0FBRyxlQUFmOztBQUNBLFVBQUksS0FBSyxDQUFDLE9BQVYsRUFBbUI7QUFDakIsUUFBQSxRQUFRLEdBQUcsS0FBSyxDQUFDLE9BQWpCO0FBQ0Q7O0FBRUQsVUFBSSxLQUFLLENBQUMsT0FBVixFQUFtQjtBQUNqQixRQUFBLFFBQVEsSUFBSSxNQUFNLEtBQUssQ0FBQyxPQUF4QjtBQUNEOztBQUVELE1BQUEsTUFBSSxDQUFDLFlBQUwsQ0FBa0IsSUFBSSxDQUFDLEVBQXZCLEVBQTJCO0FBQ3pCLFFBQUEsS0FBSyxFQUFFLFFBRGtCO0FBRXpCLFFBQUEsUUFBUSxFQUFSO0FBRnlCLE9BQTNCOztBQUtBLE1BQUEsTUFBSSxDQUFDLFFBQUwsQ0FBYztBQUFFLFFBQUEsS0FBSyxFQUFFLEtBQUssQ0FBQztBQUFmLE9BQWQ7O0FBRUEsVUFBSSxPQUFPLEtBQVAsS0FBaUIsUUFBakIsSUFBNkIsS0FBSyxDQUFDLE9BQXZDLEVBQWdEO0FBQzlDLFlBQU0sUUFBUSxHQUFHLElBQUksS0FBSixDQUFVLEtBQUssQ0FBQyxPQUFoQixDQUFqQjtBQUNBLFFBQUEsUUFBUSxDQUFDLE9BQVQsR0FBbUIsS0FBSyxDQUFDLE9BQXpCOztBQUNBLFlBQUksS0FBSyxDQUFDLE9BQVYsRUFBbUI7QUFDakIsVUFBQSxRQUFRLENBQUMsT0FBVCxJQUFvQixNQUFNLEtBQUssQ0FBQyxPQUFoQztBQUNEOztBQUNELFFBQUEsUUFBUSxDQUFDLE9BQVQsR0FBbUIsTUFBSSxDQUFDLElBQUwsQ0FBVSxnQkFBVixFQUE0QjtBQUFFLFVBQUEsSUFBSSxFQUFFLElBQUksQ0FBQztBQUFiLFNBQTVCLENBQW5COztBQUNBLFFBQUEsTUFBSSxDQUFDLHVCQUFMLENBQTZCLFFBQTdCLEVBQXVDO0FBQ3JDLFVBQUEsUUFBUSxFQUFFO0FBRDJCLFNBQXZDO0FBR0QsT0FWRCxNQVVPO0FBQ0wsUUFBQSxNQUFJLENBQUMsdUJBQUwsQ0FBNkIsS0FBN0IsRUFBb0M7QUFDbEMsVUFBQSxRQUFRLEVBQUU7QUFEd0IsU0FBcEM7QUFHRDtBQUNGLEtBaENEO0FBa0NBLFNBQUssRUFBTCxDQUFRLFFBQVIsRUFBa0IsWUFBTTtBQUN0QixNQUFBLE1BQUksQ0FBQyxRQUFMLENBQWM7QUFBRSxRQUFBLEtBQUssRUFBRTtBQUFULE9BQWQ7QUFDRCxLQUZEO0FBSUEsU0FBSyxFQUFMLENBQVEsZ0JBQVIsRUFBMEIsVUFBQyxJQUFELEVBQU8sTUFBUCxFQUFrQjtBQUMxQyxVQUFJLENBQUMsTUFBSSxDQUFDLE9BQUwsQ0FBYSxJQUFJLENBQUMsRUFBbEIsQ0FBTCxFQUE0QjtBQUMxQixRQUFBLE1BQUksQ0FBQyxHQUFMLDZEQUFtRSxJQUFJLENBQUMsRUFBeEU7O0FBQ0E7QUFDRDs7QUFDRCxNQUFBLE1BQUksQ0FBQyxZQUFMLENBQWtCLElBQUksQ0FBQyxFQUF2QixFQUEyQjtBQUN6QixRQUFBLFFBQVEsRUFBRTtBQUNSLFVBQUEsYUFBYSxFQUFFLElBQUksQ0FBQyxHQUFMLEVBRFA7QUFFUixVQUFBLGNBQWMsRUFBRSxLQUZSO0FBR1IsVUFBQSxVQUFVLEVBQUUsQ0FISjtBQUlSLFVBQUEsYUFBYSxFQUFFLENBSlA7QUFLUixVQUFBLFVBQVUsRUFBRSxJQUFJLENBQUM7QUFMVDtBQURlLE9BQTNCO0FBU0QsS0FkRDtBQWdCQSxTQUFLLEVBQUwsQ0FBUSxpQkFBUixFQUEyQixLQUFLLGtCQUFoQztBQUVBLFNBQUssRUFBTCxDQUFRLGdCQUFSLEVBQTBCLFVBQUMsSUFBRCxFQUFPLFVBQVAsRUFBc0I7QUFDOUMsVUFBSSxDQUFDLE1BQUksQ0FBQyxPQUFMLENBQWEsSUFBSSxDQUFDLEVBQWxCLENBQUwsRUFBNEI7QUFDMUIsUUFBQSxNQUFJLENBQUMsR0FBTCw2REFBbUUsSUFBSSxDQUFDLEVBQXhFOztBQUNBO0FBQ0Q7O0FBRUQsVUFBTSxlQUFlLEdBQUcsTUFBSSxDQUFDLE9BQUwsQ0FBYSxJQUFJLENBQUMsRUFBbEIsRUFBc0IsUUFBOUM7O0FBQ0EsTUFBQSxNQUFJLENBQUMsWUFBTCxDQUFrQixJQUFJLENBQUMsRUFBdkIsRUFBMkI7QUFDekIsUUFBQSxRQUFRLEVBQUUsU0FBYyxFQUFkLEVBQWtCLGVBQWxCLEVBQW1DO0FBQzNDLFVBQUEsV0FBVyxFQUFFLE1BQUksQ0FBQyxjQUFMLENBQW9CLE1BQXBCLEdBQTZCLENBQTdCLEdBQWlDO0FBQzVDLFlBQUEsSUFBSSxFQUFFO0FBRHNDLFdBQWpDLEdBRVQsSUFIdUM7QUFJM0MsVUFBQSxjQUFjLEVBQUUsSUFKMkI7QUFLM0MsVUFBQSxVQUFVLEVBQUUsR0FMK0I7QUFNM0MsVUFBQSxhQUFhLEVBQUUsZUFBZSxDQUFDO0FBTlksU0FBbkMsQ0FEZTtBQVN6QixRQUFBLFFBQVEsRUFBRSxVQVRlO0FBVXpCLFFBQUEsU0FBUyxFQUFFLFVBQVUsQ0FBQyxTQVZHO0FBV3pCLFFBQUEsUUFBUSxFQUFFO0FBWGUsT0FBM0I7O0FBY0EsTUFBQSxNQUFJLENBQUMsdUJBQUw7QUFDRCxLQXRCRDtBQXdCQSxTQUFLLEVBQUwsQ0FBUSxxQkFBUixFQUErQixVQUFDLElBQUQsRUFBTyxRQUFQLEVBQW9CO0FBQ2pELFVBQUksQ0FBQyxNQUFJLENBQUMsT0FBTCxDQUFhLElBQUksQ0FBQyxFQUFsQixDQUFMLEVBQTRCO0FBQzFCLFFBQUEsTUFBSSxDQUFDLEdBQUwsNkRBQW1FLElBQUksQ0FBQyxFQUF4RTs7QUFDQTtBQUNEOztBQUNELE1BQUEsTUFBSSxDQUFDLFlBQUwsQ0FBa0IsSUFBSSxDQUFDLEVBQXZCLEVBQTJCO0FBQ3pCLFFBQUEsUUFBUSxFQUFFLFNBQWMsRUFBZCxFQUFrQixNQUFJLENBQUMsT0FBTCxDQUFhLElBQUksQ0FBQyxFQUFsQixFQUFzQixRQUF4QyxFQUFrRDtBQUMxRCxVQUFBLFVBQVUsRUFBRTtBQUQ4QyxTQUFsRDtBQURlLE9BQTNCO0FBS0QsS0FWRDtBQVlBLFNBQUssRUFBTCxDQUFRLHFCQUFSLEVBQStCLFVBQUMsSUFBRCxFQUFVO0FBQ3ZDLFVBQUksQ0FBQyxNQUFJLENBQUMsT0FBTCxDQUFhLElBQUksQ0FBQyxFQUFsQixDQUFMLEVBQTRCO0FBQzFCLFFBQUEsTUFBSSxDQUFDLEdBQUwsNkRBQW1FLElBQUksQ0FBQyxFQUF4RTs7QUFDQTtBQUNEOztBQUNELFVBQU0sS0FBSyxHQUFHLFNBQWMsRUFBZCxFQUFrQixNQUFJLENBQUMsUUFBTCxHQUFnQixLQUFsQyxDQUFkOztBQUNBLE1BQUEsS0FBSyxDQUFDLElBQUksQ0FBQyxFQUFOLENBQUwsR0FBaUIsU0FBYyxFQUFkLEVBQWtCLEtBQUssQ0FBQyxJQUFJLENBQUMsRUFBTixDQUF2QixFQUFrQztBQUNqRCxRQUFBLFFBQVEsRUFBRSxTQUFjLEVBQWQsRUFBa0IsS0FBSyxDQUFDLElBQUksQ0FBQyxFQUFOLENBQUwsQ0FBZSxRQUFqQztBQUR1QyxPQUFsQyxDQUFqQjtBQUdBLGFBQU8sS0FBSyxDQUFDLElBQUksQ0FBQyxFQUFOLENBQUwsQ0FBZSxRQUFmLENBQXdCLFVBQS9COztBQUVBLE1BQUEsTUFBSSxDQUFDLFFBQUwsQ0FBYztBQUFFLFFBQUEsS0FBSyxFQUFFO0FBQVQsT0FBZDtBQUNELEtBWkQ7QUFjQSxTQUFLLEVBQUwsQ0FBUSxzQkFBUixFQUFnQyxVQUFDLElBQUQsRUFBTyxRQUFQLEVBQW9CO0FBQ2xELFVBQUksQ0FBQyxNQUFJLENBQUMsT0FBTCxDQUFhLElBQUksQ0FBQyxFQUFsQixDQUFMLEVBQTRCO0FBQzFCLFFBQUEsTUFBSSxDQUFDLEdBQUwsNkRBQW1FLElBQUksQ0FBQyxFQUF4RTs7QUFDQTtBQUNEOztBQUNELE1BQUEsTUFBSSxDQUFDLFlBQUwsQ0FBa0IsSUFBSSxDQUFDLEVBQXZCLEVBQTJCO0FBQ3pCLFFBQUEsUUFBUSxFQUFFLFNBQWMsRUFBZCxFQUFrQixNQUFJLENBQUMsUUFBTCxHQUFnQixLQUFoQixDQUFzQixJQUFJLENBQUMsRUFBM0IsRUFBK0IsUUFBakQsRUFBMkQ7QUFDbkUsVUFBQSxXQUFXLEVBQUU7QUFEc0QsU0FBM0Q7QUFEZSxPQUEzQjtBQUtELEtBVkQ7QUFZQSxTQUFLLEVBQUwsQ0FBUSxzQkFBUixFQUFnQyxVQUFDLElBQUQsRUFBVTtBQUN4QyxVQUFJLENBQUMsTUFBSSxDQUFDLE9BQUwsQ0FBYSxJQUFJLENBQUMsRUFBbEIsQ0FBTCxFQUE0QjtBQUMxQixRQUFBLE1BQUksQ0FBQyxHQUFMLDZEQUFtRSxJQUFJLENBQUMsRUFBeEU7O0FBQ0E7QUFDRDs7QUFDRCxVQUFNLEtBQUssR0FBRyxTQUFjLEVBQWQsRUFBa0IsTUFBSSxDQUFDLFFBQUwsR0FBZ0IsS0FBbEMsQ0FBZDs7QUFDQSxNQUFBLEtBQUssQ0FBQyxJQUFJLENBQUMsRUFBTixDQUFMLEdBQWlCLFNBQWMsRUFBZCxFQUFrQixLQUFLLENBQUMsSUFBSSxDQUFDLEVBQU4sQ0FBdkIsRUFBa0M7QUFDakQsUUFBQSxRQUFRLEVBQUUsU0FBYyxFQUFkLEVBQWtCLEtBQUssQ0FBQyxJQUFJLENBQUMsRUFBTixDQUFMLENBQWUsUUFBakM7QUFEdUMsT0FBbEMsQ0FBakI7QUFHQSxhQUFPLEtBQUssQ0FBQyxJQUFJLENBQUMsRUFBTixDQUFMLENBQWUsUUFBZixDQUF3QixXQUEvQixDQVR3QyxDQVV4QztBQUNBO0FBQ0E7O0FBRUEsTUFBQSxNQUFJLENBQUMsUUFBTCxDQUFjO0FBQUUsUUFBQSxLQUFLLEVBQUU7QUFBVCxPQUFkO0FBQ0QsS0FmRDtBQWlCQSxTQUFLLEVBQUwsQ0FBUSxVQUFSLEVBQW9CLFlBQU07QUFDeEI7QUFDQSxNQUFBLE1BQUksQ0FBQyx1QkFBTDtBQUNELEtBSEQsRUFySmUsQ0EwSmY7O0FBQ0EsUUFBSSxPQUFPLE1BQVAsS0FBa0IsV0FBbEIsSUFBaUMsTUFBTSxDQUFDLGdCQUE1QyxFQUE4RDtBQUM1RCxNQUFBLE1BQU0sQ0FBQyxnQkFBUCxDQUF3QixRQUF4QixFQUFrQztBQUFBLGVBQU0sTUFBSSxDQUFDLGtCQUFMLEVBQU47QUFBQSxPQUFsQztBQUNBLE1BQUEsTUFBTSxDQUFDLGdCQUFQLENBQXdCLFNBQXhCLEVBQW1DO0FBQUEsZUFBTSxNQUFJLENBQUMsa0JBQUwsRUFBTjtBQUFBLE9BQW5DO0FBQ0EsTUFBQSxVQUFVLENBQUM7QUFBQSxlQUFNLE1BQUksQ0FBQyxrQkFBTCxFQUFOO0FBQUEsT0FBRCxFQUFrQyxJQUFsQyxDQUFWO0FBQ0Q7QUFDRixHOztTQUVELGtCLEdBQUEsOEJBQXNCO0FBQ3BCLFFBQU0sTUFBTSxHQUNWLE9BQU8sTUFBTSxDQUFDLFNBQVAsQ0FBaUIsTUFBeEIsS0FBbUMsV0FBbkMsR0FDSSxNQUFNLENBQUMsU0FBUCxDQUFpQixNQURyQixHQUVJLElBSE47O0FBSUEsUUFBSSxDQUFDLE1BQUwsRUFBYTtBQUNYLFdBQUssSUFBTCxDQUFVLFlBQVY7QUFDQSxXQUFLLElBQUwsQ0FBVSxLQUFLLElBQUwsQ0FBVSxzQkFBVixDQUFWLEVBQTZDLE9BQTdDLEVBQXNELENBQXREO0FBQ0EsV0FBSyxVQUFMLEdBQWtCLElBQWxCO0FBQ0QsS0FKRCxNQUlPO0FBQ0wsV0FBSyxJQUFMLENBQVUsV0FBVjs7QUFDQSxVQUFJLEtBQUssVUFBVCxFQUFxQjtBQUNuQixhQUFLLElBQUwsQ0FBVSxhQUFWO0FBQ0EsYUFBSyxJQUFMLENBQVUsS0FBSyxJQUFMLENBQVUscUJBQVYsQ0FBVixFQUE0QyxTQUE1QyxFQUF1RCxJQUF2RDtBQUNBLGFBQUssVUFBTCxHQUFrQixLQUFsQjtBQUNEO0FBQ0Y7QUFDRixHOztTQUVELEssR0FBQSxpQkFBUztBQUNQLFdBQU8sS0FBSyxJQUFMLENBQVUsRUFBakI7QUFDRDtBQUVEO0FBQ0Y7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOzs7U0FDRSxHLEdBQUEsYUFBSyxNQUFMLEVBQWEsSUFBYixFQUFtQjtBQUNqQixRQUFJLE9BQU8sTUFBUCxLQUFrQixVQUF0QixFQUFrQztBQUNoQyxVQUFNLEdBQUcsR0FBRyx1Q0FBb0MsTUFBTSxLQUFLLElBQVgsR0FBa0IsTUFBbEIsR0FBMkIsT0FBTyxNQUF0RSxVQUNWLG9FQURGO0FBRUEsWUFBTSxJQUFJLFNBQUosQ0FBYyxHQUFkLENBQU47QUFDRCxLQUxnQixDQU9qQjs7O0FBQ0EsUUFBTSxNQUFNLEdBQUcsSUFBSSxNQUFKLENBQVcsSUFBWCxFQUFpQixJQUFqQixDQUFmO0FBQ0EsUUFBTSxRQUFRLEdBQUcsTUFBTSxDQUFDLEVBQXhCO0FBQ0EsU0FBSyxPQUFMLENBQWEsTUFBTSxDQUFDLElBQXBCLElBQTRCLEtBQUssT0FBTCxDQUFhLE1BQU0sQ0FBQyxJQUFwQixLQUE2QixFQUF6RDs7QUFFQSxRQUFJLENBQUMsUUFBTCxFQUFlO0FBQ2IsWUFBTSxJQUFJLEtBQUosQ0FBVSw2QkFBVixDQUFOO0FBQ0Q7O0FBRUQsUUFBSSxDQUFDLE1BQU0sQ0FBQyxJQUFaLEVBQWtCO0FBQ2hCLFlBQU0sSUFBSSxLQUFKLENBQVUsOEJBQVYsQ0FBTjtBQUNEOztBQUVELFFBQU0sbUJBQW1CLEdBQUcsS0FBSyxTQUFMLENBQWUsUUFBZixDQUE1Qjs7QUFDQSxRQUFJLG1CQUFKLEVBQXlCO0FBQ3ZCLFVBQU0sSUFBRyxHQUFHLG1DQUFpQyxtQkFBbUIsQ0FBQyxFQUFyRCxnQ0FDUSxRQURSLGFBRVYsbUZBRkY7O0FBR0EsWUFBTSxJQUFJLEtBQUosQ0FBVSxJQUFWLENBQU47QUFDRDs7QUFFRCxRQUFJLE1BQU0sQ0FBQyxPQUFYLEVBQW9CO0FBQ2xCLFdBQUssR0FBTCxZQUFrQixRQUFsQixVQUErQixNQUFNLENBQUMsT0FBdEM7QUFDRDs7QUFFRCxTQUFLLE9BQUwsQ0FBYSxNQUFNLENBQUMsSUFBcEIsRUFBMEIsSUFBMUIsQ0FBK0IsTUFBL0I7QUFDQSxJQUFBLE1BQU0sQ0FBQyxPQUFQO0FBRUEsV0FBTyxJQUFQO0FBQ0Q7QUFFRDtBQUNGO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7OztTQUNFLFMsR0FBQSxtQkFBVyxFQUFYLEVBQWU7QUFDYixRQUFJLFdBQVcsR0FBRyxJQUFsQjtBQUNBLFNBQUssY0FBTCxDQUFvQixVQUFDLE1BQUQsRUFBWTtBQUM5QixVQUFJLE1BQU0sQ0FBQyxFQUFQLEtBQWMsRUFBbEIsRUFBc0I7QUFDcEIsUUFBQSxXQUFXLEdBQUcsTUFBZDtBQUNBLGVBQU8sS0FBUDtBQUNEO0FBQ0YsS0FMRDtBQU1BLFdBQU8sV0FBUDtBQUNEO0FBRUQ7QUFDRjtBQUNBO0FBQ0E7QUFDQTs7O1NBQ0UsYyxHQUFBLHdCQUFnQixNQUFoQixFQUF3QjtBQUFBOztBQUN0QixJQUFBLE1BQU0sQ0FBQyxJQUFQLENBQVksS0FBSyxPQUFqQixFQUEwQixPQUExQixDQUFrQyxVQUFBLFVBQVUsRUFBSTtBQUM5QyxNQUFBLE1BQUksQ0FBQyxPQUFMLENBQWEsVUFBYixFQUF5QixPQUF6QixDQUFpQyxNQUFqQztBQUNELEtBRkQ7QUFHRDtBQUVEO0FBQ0Y7QUFDQTtBQUNBO0FBQ0E7OztTQUNFLFksR0FBQSxzQkFBYyxRQUFkLEVBQXdCO0FBQ3RCLFNBQUssR0FBTCxzQkFBNEIsUUFBUSxDQUFDLEVBQXJDO0FBQ0EsU0FBSyxJQUFMLENBQVUsZUFBVixFQUEyQixRQUEzQjs7QUFFQSxRQUFJLFFBQVEsQ0FBQyxTQUFiLEVBQXdCO0FBQ3RCLE1BQUEsUUFBUSxDQUFDLFNBQVQ7QUFDRDs7QUFFRCxRQUFNLElBQUksR0FBRyxLQUFLLE9BQUwsQ0FBYSxRQUFRLENBQUMsSUFBdEIsRUFBNEIsS0FBNUIsRUFBYjtBQUNBLFFBQU0sS0FBSyxHQUFHLElBQUksQ0FBQyxPQUFMLENBQWEsUUFBYixDQUFkOztBQUNBLFFBQUksS0FBSyxLQUFLLENBQUMsQ0FBZixFQUFrQjtBQUNoQixNQUFBLElBQUksQ0FBQyxNQUFMLENBQVksS0FBWixFQUFtQixDQUFuQjtBQUNBLFdBQUssT0FBTCxDQUFhLFFBQVEsQ0FBQyxJQUF0QixJQUE4QixJQUE5QjtBQUNEOztBQUVELFFBQU0sWUFBWSxHQUFHLEtBQUssUUFBTCxFQUFyQjtBQUNBLFdBQU8sWUFBWSxDQUFDLE9BQWIsQ0FBcUIsUUFBUSxDQUFDLEVBQTlCLENBQVA7QUFDQSxTQUFLLFFBQUwsQ0FBYyxZQUFkO0FBQ0Q7QUFFRDtBQUNGO0FBQ0E7OztTQUNFLEssR0FBQSxpQkFBUztBQUFBOztBQUNQLFNBQUssR0FBTCw0QkFBa0MsS0FBSyxJQUFMLENBQVUsRUFBNUM7QUFFQSxTQUFLLEtBQUw7O0FBRUEsU0FBSyxpQkFBTDs7QUFFQSxTQUFLLGNBQUwsQ0FBb0IsVUFBQyxNQUFELEVBQVk7QUFDOUIsTUFBQSxNQUFJLENBQUMsWUFBTCxDQUFrQixNQUFsQjtBQUNELEtBRkQ7QUFHRDtBQUVEO0FBQ0Y7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7OztTQUVFLEksR0FBQSxjQUFNLE9BQU4sRUFBZSxJQUFmLEVBQThCLFFBQTlCLEVBQStDO0FBQUEsUUFBaEMsSUFBZ0M7QUFBaEMsTUFBQSxJQUFnQyxHQUF6QixNQUF5QjtBQUFBOztBQUFBLFFBQWpCLFFBQWlCO0FBQWpCLE1BQUEsUUFBaUIsR0FBTixJQUFNO0FBQUE7O0FBQzdDLFFBQU0sZ0JBQWdCLEdBQUcsT0FBTyxPQUFQLEtBQW1CLFFBQTVDO0FBRUEsU0FBSyxRQUFMLENBQWM7QUFDWixNQUFBLElBQUksRUFBRTtBQUNKLFFBQUEsUUFBUSxFQUFFLEtBRE47QUFFSixRQUFBLElBQUksRUFBRSxJQUZGO0FBR0osUUFBQSxPQUFPLEVBQUUsZ0JBQWdCLEdBQUcsT0FBTyxDQUFDLE9BQVgsR0FBcUIsT0FIMUM7QUFJSixRQUFBLE9BQU8sRUFBRSxnQkFBZ0IsR0FBRyxPQUFPLENBQUMsT0FBWCxHQUFxQjtBQUoxQztBQURNLEtBQWQ7QUFTQSxTQUFLLElBQUwsQ0FBVSxjQUFWO0FBRUEsSUFBQSxZQUFZLENBQUMsS0FBSyxhQUFOLENBQVo7O0FBQ0EsUUFBSSxRQUFRLEtBQUssQ0FBakIsRUFBb0I7QUFDbEIsV0FBSyxhQUFMLEdBQXFCLFNBQXJCO0FBQ0E7QUFDRCxLQWxCNEMsQ0FvQjdDOzs7QUFDQSxTQUFLLGFBQUwsR0FBcUIsVUFBVSxDQUFDLEtBQUssUUFBTixFQUFnQixRQUFoQixDQUEvQjtBQUNELEc7O1NBRUQsUSxHQUFBLG9CQUFZO0FBQ1YsUUFBTSxPQUFPLEdBQUcsU0FBYyxFQUFkLEVBQWtCLEtBQUssUUFBTCxHQUFnQixJQUFsQyxFQUF3QztBQUN0RCxNQUFBLFFBQVEsRUFBRTtBQUQ0QyxLQUF4QyxDQUFoQjs7QUFHQSxTQUFLLFFBQUwsQ0FBYztBQUNaLE1BQUEsSUFBSSxFQUFFO0FBRE0sS0FBZDtBQUdBLFNBQUssSUFBTCxDQUFVLGFBQVY7QUFDRDtBQUVEO0FBQ0Y7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOzs7U0FDRSxHLEdBQUEsYUFBSyxPQUFMLEVBQWMsSUFBZCxFQUFvQjtBQUFBLFFBQ1YsTUFEVSxHQUNDLEtBQUssSUFETixDQUNWLE1BRFU7O0FBRWxCLFlBQVEsSUFBUjtBQUNFLFdBQUssT0FBTDtBQUFjLFFBQUEsTUFBTSxDQUFDLEtBQVAsQ0FBYSxPQUFiO0FBQXVCOztBQUNyQyxXQUFLLFNBQUw7QUFBZ0IsUUFBQSxNQUFNLENBQUMsSUFBUCxDQUFZLE9BQVo7QUFBc0I7O0FBQ3RDO0FBQVMsUUFBQSxNQUFNLENBQUMsS0FBUCxDQUFhLE9BQWI7QUFBdUI7QUFIbEM7QUFLRDtBQUVEO0FBQ0Y7QUFDQTs7O1NBQ0UsRyxHQUFBLGVBQU87QUFDTCxTQUFLLEdBQUwsQ0FBUyx1Q0FBVCxFQUFrRCxTQUFsRDtBQUNBLFdBQU8sSUFBUDtBQUNEO0FBRUQ7QUFDRjtBQUNBOzs7U0FDRSxPLEdBQUEsaUJBQVMsUUFBVCxFQUFtQjtBQUNqQixTQUFLLEdBQUwsMkNBQWdELFFBQWhEOztBQUVBLFFBQUksQ0FBQyxLQUFLLFFBQUwsR0FBZ0IsY0FBaEIsQ0FBK0IsUUFBL0IsQ0FBTCxFQUErQztBQUM3QyxXQUFLLGFBQUwsQ0FBbUIsUUFBbkI7O0FBQ0EsYUFBTyxPQUFPLENBQUMsTUFBUixDQUFlLElBQUksS0FBSixDQUFVLG9CQUFWLENBQWYsQ0FBUDtBQUNEOztBQUVELFdBQU8sS0FBSyxVQUFMLENBQWdCLFFBQWhCLENBQVA7QUFDRDtBQUVEO0FBQ0Y7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7O1NBQ0UsYSxHQUFBLHVCQUFlLE9BQWYsRUFBd0IsSUFBeEIsRUFBbUM7QUFBQTs7QUFBQSxRQUFYLElBQVc7QUFBWCxNQUFBLElBQVcsR0FBSixFQUFJO0FBQUE7O0FBQUEsZ0JBRzdCLElBSDZCO0FBQUEsc0NBRS9CLG1CQUYrQjtBQUFBLFFBRS9CLG1CQUYrQixzQ0FFVCxLQUZTOztBQUFBLDBCQUtVLEtBQUssUUFBTCxFQUxWO0FBQUEsUUFLekIsY0FMeUIsbUJBS3pCLGNBTHlCO0FBQUEsUUFLVCxjQUxTLG1CQUtULGNBTFM7O0FBTWpDLFFBQUksQ0FBQyxjQUFELElBQW1CLENBQUMsbUJBQXhCLEVBQTZDO0FBQzNDLFlBQU0sSUFBSSxLQUFKLENBQVUsZ0RBQVYsQ0FBTjtBQUNEOztBQUVELFFBQU0sUUFBUSxHQUFHLElBQUksRUFBckI7QUFFQSxTQUFLLElBQUwsQ0FBVSxRQUFWLEVBQW9CO0FBQ2xCLE1BQUEsRUFBRSxFQUFFLFFBRGM7QUFFbEIsTUFBQSxPQUFPLEVBQUU7QUFGUyxLQUFwQjtBQUtBLFNBQUssUUFBTCxDQUFjO0FBQ1osTUFBQSxjQUFjLEVBQUUsS0FBSyxJQUFMLENBQVUsb0JBQVYsS0FBbUMsS0FEdkM7QUFHWixNQUFBLGNBQWMsZUFDVCxjQURTLDZCQUVYLFFBRlcsSUFFQTtBQUNWLFFBQUEsT0FBTyxFQUFFLE9BREM7QUFFVixRQUFBLElBQUksRUFBRSxDQUZJO0FBR1YsUUFBQSxNQUFNLEVBQUU7QUFIRSxPQUZBO0FBSEYsS0FBZDtBQWFBLFdBQU8sUUFBUDtBQUNELEc7O1NBRUQsVSxHQUFBLG9CQUFZLFFBQVosRUFBc0I7QUFBQSwwQkFDTyxLQUFLLFFBQUwsRUFEUDtBQUFBLFFBQ1osY0FEWSxtQkFDWixjQURZOztBQUdwQixXQUFPLGNBQWMsQ0FBQyxRQUFELENBQXJCO0FBQ0Q7QUFFRDtBQUNGO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7OztTQUNFLGEsR0FBQSx1QkFBZSxRQUFmLEVBQXlCLElBQXpCLEVBQStCO0FBQUE7O0FBQzdCLFFBQUksQ0FBQyxLQUFLLFVBQUwsQ0FBZ0IsUUFBaEIsQ0FBTCxFQUFnQztBQUM5QixXQUFLLEdBQUwsOERBQW9FLFFBQXBFO0FBQ0E7QUFDRDs7QUFDRCxRQUFNLGNBQWMsR0FBRyxLQUFLLFFBQUwsR0FBZ0IsY0FBdkM7O0FBQ0EsUUFBTSxhQUFhLEdBQUcsU0FBYyxFQUFkLEVBQWtCLGNBQWMsQ0FBQyxRQUFELENBQWhDLEVBQTRDO0FBQ2hFLE1BQUEsTUFBTSxFQUFFLFNBQWMsRUFBZCxFQUFrQixjQUFjLENBQUMsUUFBRCxDQUFkLENBQXlCLE1BQTNDLEVBQW1ELElBQW5EO0FBRHdELEtBQTVDLENBQXRCOztBQUdBLFNBQUssUUFBTCxDQUFjO0FBQ1osTUFBQSxjQUFjLEVBQUUsU0FBYyxFQUFkLEVBQWtCLGNBQWxCLDZCQUNiLFFBRGEsSUFDRixhQURFO0FBREosS0FBZDtBQUtEO0FBRUQ7QUFDRjtBQUNBO0FBQ0E7QUFDQTs7O1NBQ0UsYSxHQUFBLHVCQUFlLFFBQWYsRUFBeUI7QUFDdkIsUUFBTSxjQUFjLGdCQUFRLEtBQUssUUFBTCxHQUFnQixjQUF4QixDQUFwQjs7QUFDQSxXQUFPLGNBQWMsQ0FBQyxRQUFELENBQXJCO0FBRUEsU0FBSyxRQUFMLENBQWM7QUFDWixNQUFBLGNBQWMsRUFBRTtBQURKLEtBQWQ7QUFHRDtBQUVEO0FBQ0Y7QUFDQTtBQUNBO0FBQ0E7OztTQUNFLFUsR0FBQSxvQkFBWSxRQUFaLEVBQXNCO0FBQUE7O0FBQ3BCLFFBQU0sVUFBVSxHQUFHLEtBQUssUUFBTCxHQUFnQixjQUFoQixDQUErQixRQUEvQixDQUFuQjtBQUNBLFFBQU0sV0FBVyxHQUFHLFVBQVUsQ0FBQyxJQUEvQjtBQUVBLFFBQU0sS0FBSyxhQUNOLEtBQUssYUFEQyxFQUVOLEtBQUssU0FGQyxFQUdOLEtBQUssY0FIQyxDQUFYO0FBS0EsUUFBSSxRQUFRLEdBQUcsT0FBTyxDQUFDLE9BQVIsRUFBZjtBQUNBLElBQUEsS0FBSyxDQUFDLE9BQU4sQ0FBYyxVQUFDLEVBQUQsRUFBSyxJQUFMLEVBQWM7QUFDMUI7QUFDQSxVQUFJLElBQUksR0FBRyxXQUFYLEVBQXdCO0FBQ3RCO0FBQ0Q7O0FBRUQsTUFBQSxRQUFRLEdBQUcsUUFBUSxDQUFDLElBQVQsQ0FBYyxZQUFNO0FBQUE7O0FBQUEsOEJBQ0YsTUFBSSxDQUFDLFFBQUwsRUFERTtBQUFBLFlBQ3JCLGNBRHFCLG1CQUNyQixjQURxQjs7QUFFN0IsWUFBTSxhQUFhLEdBQUcsY0FBYyxDQUFDLFFBQUQsQ0FBcEM7O0FBQ0EsWUFBSSxDQUFDLGFBQUwsRUFBb0I7QUFDbEI7QUFDRDs7QUFFRCxZQUFNLGFBQWEsR0FBRyxTQUFjLEVBQWQsRUFBa0IsYUFBbEIsRUFBaUM7QUFDckQsVUFBQSxJQUFJLEVBQUU7QUFEK0MsU0FBakMsQ0FBdEI7O0FBR0EsUUFBQSxNQUFJLENBQUMsUUFBTCxDQUFjO0FBQ1osVUFBQSxjQUFjLEVBQUUsU0FBYyxFQUFkLEVBQWtCLGNBQWxCLDZCQUNiLFFBRGEsSUFDRixhQURFO0FBREosU0FBZCxFQVY2QixDQWdCN0I7QUFDQTs7O0FBQ0EsZUFBTyxFQUFFLENBQUMsYUFBYSxDQUFDLE9BQWYsRUFBd0IsUUFBeEIsQ0FBVDtBQUNELE9BbkJVLEVBbUJSLElBbkJRLENBbUJILFVBQUMsTUFBRCxFQUFZO0FBQ2xCLGVBQU8sSUFBUDtBQUNELE9BckJVLENBQVg7QUFzQkQsS0E1QkQsRUFWb0IsQ0F3Q3BCO0FBQ0E7O0FBQ0EsSUFBQSxRQUFRLENBQUMsS0FBVCxDQUFlLFVBQUMsR0FBRCxFQUFTO0FBQ3RCLE1BQUEsTUFBSSxDQUFDLElBQUwsQ0FBVSxPQUFWLEVBQW1CLEdBQW5CLEVBQXdCLFFBQXhCOztBQUNBLE1BQUEsTUFBSSxDQUFDLGFBQUwsQ0FBbUIsUUFBbkI7QUFDRCxLQUhEO0FBS0EsV0FBTyxRQUFRLENBQUMsSUFBVCxDQUFjLFlBQU07QUFDekI7QUFEeUIsNkJBRUUsTUFBSSxDQUFDLFFBQUwsRUFGRjtBQUFBLFVBRWpCLGNBRmlCLG9CQUVqQixjQUZpQjs7QUFHekIsVUFBTSxhQUFhLEdBQUcsY0FBYyxDQUFDLFFBQUQsQ0FBcEM7O0FBQ0EsVUFBSSxDQUFDLGFBQUwsRUFBb0I7QUFDbEI7QUFDRDs7QUFFRCxVQUFNLEtBQUssR0FBRyxhQUFhLENBQUMsT0FBZCxDQUNYLEdBRFcsQ0FDUCxVQUFDLE1BQUQ7QUFBQSxlQUFZLE1BQUksQ0FBQyxPQUFMLENBQWEsTUFBYixDQUFaO0FBQUEsT0FETyxDQUFkO0FBRUEsVUFBTSxVQUFVLEdBQUcsS0FBSyxDQUFDLE1BQU4sQ0FBYSxVQUFDLElBQUQ7QUFBQSxlQUFVLENBQUMsSUFBSSxDQUFDLEtBQWhCO0FBQUEsT0FBYixDQUFuQjtBQUNBLFVBQU0sTUFBTSxHQUFHLEtBQUssQ0FBQyxNQUFOLENBQWEsVUFBQyxJQUFEO0FBQUEsZUFBVSxJQUFJLENBQUMsS0FBZjtBQUFBLE9BQWIsQ0FBZjs7QUFDQSxNQUFBLE1BQUksQ0FBQyxhQUFMLENBQW1CLFFBQW5CLEVBQTZCO0FBQUUsUUFBQSxVQUFVLEVBQVYsVUFBRjtBQUFjLFFBQUEsTUFBTSxFQUFOLE1BQWQ7QUFBc0IsUUFBQSxRQUFRLEVBQVI7QUFBdEIsT0FBN0I7QUFDRCxLQWJNLEVBYUosSUFiSSxDQWFDLFlBQU07QUFDWjtBQUNBO0FBQ0E7QUFDQTtBQUpZLDZCQUtlLE1BQUksQ0FBQyxRQUFMLEVBTGY7QUFBQSxVQUtKLGNBTEksb0JBS0osY0FMSTs7QUFNWixVQUFJLENBQUMsY0FBYyxDQUFDLFFBQUQsQ0FBbkIsRUFBK0I7QUFDN0I7QUFDRDs7QUFDRCxVQUFNLGFBQWEsR0FBRyxjQUFjLENBQUMsUUFBRCxDQUFwQztBQUNBLFVBQU0sTUFBTSxHQUFHLGFBQWEsQ0FBQyxNQUE3Qjs7QUFDQSxNQUFBLE1BQUksQ0FBQyxJQUFMLENBQVUsVUFBVixFQUFzQixNQUF0Qjs7QUFFQSxNQUFBLE1BQUksQ0FBQyxhQUFMLENBQW1CLFFBQW5COztBQUVBLGFBQU8sTUFBUDtBQUNELEtBN0JNLEVBNkJKLElBN0JJLENBNkJDLFVBQUMsTUFBRCxFQUFZO0FBQ2xCLFVBQUksTUFBTSxJQUFJLElBQWQsRUFBb0I7QUFDbEIsUUFBQSxNQUFJLENBQUMsR0FBTCw4REFBb0UsUUFBcEU7QUFDRDs7QUFDRCxhQUFPLE1BQVA7QUFDRCxLQWxDTSxDQUFQO0FBbUNEO0FBRUQ7QUFDRjtBQUNBO0FBQ0E7QUFDQTs7O1NBQ0UsTSxHQUFBLGtCQUFVO0FBQUE7O0FBQ1IsUUFBSSxDQUFDLEtBQUssT0FBTCxDQUFhLFFBQWxCLEVBQTRCO0FBQzFCLFdBQUssR0FBTCxDQUFTLG1DQUFULEVBQThDLFNBQTlDO0FBQ0Q7O0FBRUQsUUFBSSxLQUFLLEdBQUcsS0FBSyxRQUFMLEdBQWdCLEtBQTVCO0FBRUEsUUFBTSxvQkFBb0IsR0FBRyxLQUFLLElBQUwsQ0FBVSxjQUFWLENBQXlCLEtBQXpCLENBQTdCOztBQUVBLFFBQUksb0JBQW9CLEtBQUssS0FBN0IsRUFBb0M7QUFDbEMsYUFBTyxPQUFPLENBQUMsTUFBUixDQUFlLElBQUksS0FBSixDQUFVLCtEQUFWLENBQWYsQ0FBUDtBQUNEOztBQUVELFFBQUksb0JBQW9CLElBQUksT0FBTyxvQkFBUCxLQUFnQyxRQUE1RCxFQUFzRTtBQUNwRSxNQUFBLEtBQUssR0FBRyxvQkFBUixDQURvRSxDQUVwRTtBQUNBOztBQUNBLFdBQUssUUFBTCxDQUFjO0FBQ1osUUFBQSxLQUFLLEVBQUU7QUFESyxPQUFkO0FBR0Q7O0FBRUQsV0FBTyxPQUFPLENBQUMsT0FBUixHQUNKLElBREksQ0FDQztBQUFBLGFBQU0sT0FBSSxDQUFDLHNCQUFMLENBQTRCLEtBQTVCLENBQU47QUFBQSxLQURELEVBRUosS0FGSSxDQUVFLFVBQUMsR0FBRCxFQUFTO0FBQ2QsTUFBQSxPQUFJLENBQUMsdUJBQUwsQ0FBNkIsR0FBN0I7QUFDRCxLQUpJLEVBS0osSUFMSSxDQUtDLFlBQU07QUFBQSw2QkFDaUIsT0FBSSxDQUFDLFFBQUwsRUFEakI7QUFBQSxVQUNGLGNBREUsb0JBQ0YsY0FERSxFQUVWOzs7QUFDQSxVQUFNLHVCQUF1QixHQUFHLE1BQU0sQ0FBQyxJQUFQLENBQVksY0FBWixFQUE0QixNQUE1QixDQUFtQyxVQUFDLElBQUQsRUFBTyxJQUFQO0FBQUEsZUFBZ0IsSUFBSSxDQUFDLE1BQUwsQ0FBWSxjQUFjLENBQUMsSUFBRCxDQUFkLENBQXFCLE9BQWpDLENBQWhCO0FBQUEsT0FBbkMsRUFBOEYsRUFBOUYsQ0FBaEM7QUFFQSxVQUFNLGNBQWMsR0FBRyxFQUF2QjtBQUNBLE1BQUEsTUFBTSxDQUFDLElBQVAsQ0FBWSxLQUFaLEVBQW1CLE9BQW5CLENBQTJCLFVBQUMsTUFBRCxFQUFZO0FBQ3JDLFlBQU0sSUFBSSxHQUFHLE9BQUksQ0FBQyxPQUFMLENBQWEsTUFBYixDQUFiLENBRHFDLENBRXJDOzs7QUFDQSxZQUFLLENBQUMsSUFBSSxDQUFDLFFBQUwsQ0FBYyxhQUFoQixJQUFtQyx1QkFBdUIsQ0FBQyxPQUF4QixDQUFnQyxNQUFoQyxNQUE0QyxDQUFDLENBQXBGLEVBQXdGO0FBQ3RGLFVBQUEsY0FBYyxDQUFDLElBQWYsQ0FBb0IsSUFBSSxDQUFDLEVBQXpCO0FBQ0Q7QUFDRixPQU5EOztBQVFBLFVBQU0sUUFBUSxHQUFHLE9BQUksQ0FBQyxhQUFMLENBQW1CLGNBQW5CLENBQWpCOztBQUNBLGFBQU8sT0FBSSxDQUFDLFVBQUwsQ0FBZ0IsUUFBaEIsQ0FBUDtBQUNELEtBckJJLEVBc0JKLEtBdEJJLENBc0JFLFVBQUMsR0FBRCxFQUFTO0FBQ2QsTUFBQSxPQUFJLENBQUMsdUJBQUwsQ0FBNkIsR0FBN0IsRUFBa0M7QUFDaEMsUUFBQSxZQUFZLEVBQUU7QUFEa0IsT0FBbEM7QUFHRCxLQTFCSSxDQUFQO0FBMkJELEc7Ozs7d0JBcDBDWTtBQUNYLGFBQU8sS0FBSyxRQUFMLEVBQVA7QUFDRDs7Ozs7O0FBelBHLEksQ0FDRyxPLEdBQVUsT0FBTyxDQUFDLGlCQUFELENBQVAsQ0FBMkIsTzs7QUE2akQ5QyxNQUFNLENBQUMsT0FBUCxHQUFpQixVQUFVLElBQVYsRUFBZ0I7QUFDL0IsU0FBTyxJQUFJLElBQUosQ0FBUyxJQUFULENBQVA7QUFDRCxDQUZELEMsQ0FJQTs7O0FBQ0EsTUFBTSxDQUFDLE9BQVAsQ0FBZSxJQUFmLEdBQXNCLElBQXRCO0FBQ0EsTUFBTSxDQUFDLE9BQVAsQ0FBZSxNQUFmLEdBQXdCLE1BQXhCO0FBQ0EsTUFBTSxDQUFDLE9BQVAsQ0FBZSxXQUFmLEdBQTZCLFdBQTdCOzs7QUMvbERBLElBQU0sWUFBWSxHQUFHLE9BQU8sQ0FBQyw4QkFBRCxDQUE1QixDLENBRUE7QUFDQTs7O0FBQ0EsSUFBTSxnQkFBZ0IsR0FBRztBQUN2QixFQUFBLEtBQUssRUFBRSxpQkFBYSxDQUFFLENBREM7QUFFdkIsRUFBQSxJQUFJLEVBQUUsZ0JBQWEsQ0FBRSxDQUZFO0FBR3ZCLEVBQUEsS0FBSyxFQUFFO0FBQUE7O0FBQUEsc0NBQUksSUFBSjtBQUFJLE1BQUEsSUFBSjtBQUFBOztBQUFBLFdBQWEsWUFBQSxPQUFPLEVBQUMsS0FBUiwrQkFBeUIsWUFBWSxFQUFyQyxlQUErQyxJQUEvQyxFQUFiO0FBQUE7QUFIZ0IsQ0FBekIsQyxDQU1BO0FBQ0E7O0FBQ0EsSUFBTSxXQUFXLEdBQUc7QUFDbEIsRUFBQSxLQUFLLEVBQUUsaUJBQWE7QUFDbEI7QUFDQSxRQUFNLEtBQUssR0FBRyxPQUFPLENBQUMsS0FBUixJQUFpQixPQUFPLENBQUMsR0FBdkM7O0FBRmtCLHVDQUFULElBQVM7QUFBVCxNQUFBLElBQVM7QUFBQTs7QUFHbEIsSUFBQSxLQUFLLENBQUMsSUFBTixPQUFBLEtBQUssR0FBTSxPQUFOLGVBQTBCLFlBQVksRUFBdEMsZUFBZ0QsSUFBaEQsRUFBTDtBQUNELEdBTGlCO0FBTWxCLEVBQUEsSUFBSSxFQUFFO0FBQUE7O0FBQUEsdUNBQUksSUFBSjtBQUFJLE1BQUEsSUFBSjtBQUFBOztBQUFBLFdBQWEsYUFBQSxPQUFPLEVBQUMsSUFBUixnQ0FBd0IsWUFBWSxFQUFwQyxlQUE4QyxJQUE5QyxFQUFiO0FBQUEsR0FOWTtBQU9sQixFQUFBLEtBQUssRUFBRTtBQUFBOztBQUFBLHVDQUFJLElBQUo7QUFBSSxNQUFBLElBQUo7QUFBQTs7QUFBQSxXQUFhLGFBQUEsT0FBTyxFQUFDLEtBQVIsZ0NBQXlCLFlBQVksRUFBckMsZUFBK0MsSUFBL0MsRUFBYjtBQUFBO0FBUFcsQ0FBcEI7QUFVQSxNQUFNLENBQUMsT0FBUCxHQUFpQjtBQUNmLEVBQUEsZ0JBQWdCLEVBQWhCLGdCQURlO0FBRWYsRUFBQSxXQUFXLEVBQVg7QUFGZSxDQUFqQjs7O0FDdEJBO0FBQ0E7QUFDQTtBQUNBLE1BQU0sQ0FBQyxPQUFQLEdBQWlCLFNBQVMsc0JBQVQsQ0FBaUMsU0FBakMsRUFBNEM7QUFDM0Q7QUFDQSxNQUFJLFNBQVMsSUFBSSxJQUFqQixFQUF1QjtBQUNyQixJQUFBLFNBQVMsR0FBRyxPQUFPLFNBQVAsS0FBcUIsV0FBckIsR0FBbUMsU0FBUyxDQUFDLFNBQTdDLEdBQXlELElBQXJFO0FBQ0QsR0FKMEQsQ0FLM0Q7OztBQUNBLE1BQUksQ0FBQyxTQUFMLEVBQWdCLE9BQU8sSUFBUDtBQUVoQixNQUFNLENBQUMsR0FBRyxtQkFBbUIsSUFBbkIsQ0FBd0IsU0FBeEIsQ0FBVjtBQUNBLE1BQUksQ0FBQyxDQUFMLEVBQVEsT0FBTyxJQUFQO0FBRVIsTUFBTSxXQUFXLEdBQUcsQ0FBQyxDQUFDLENBQUQsQ0FBckI7O0FBWDJELDJCQVl0QyxXQUFXLENBQUMsS0FBWixDQUFrQixHQUFsQixDQVpzQztBQUFBLE1BWXRELEtBWnNEO0FBQUEsTUFZL0MsS0FaK0M7O0FBYTNELEVBQUEsS0FBSyxHQUFHLFFBQVEsQ0FBQyxLQUFELEVBQVEsRUFBUixDQUFoQjtBQUNBLEVBQUEsS0FBSyxHQUFHLFFBQVEsQ0FBQyxLQUFELEVBQVEsRUFBUixDQUFoQixDQWQyRCxDQWdCM0Q7QUFDQTtBQUNBOztBQUNBLE1BQUksS0FBSyxHQUFHLEVBQVIsSUFBZSxLQUFLLEtBQUssRUFBVixJQUFnQixLQUFLLEdBQUcsS0FBM0MsRUFBbUQ7QUFDakQsV0FBTyxJQUFQO0FBQ0QsR0FyQjBELENBdUIzRDtBQUNBOzs7QUFDQSxNQUFJLEtBQUssR0FBRyxFQUFSLElBQWUsS0FBSyxLQUFLLEVBQVYsSUFBZ0IsS0FBSyxJQUFJLEtBQTVDLEVBQW9EO0FBQ2xELFdBQU8sSUFBUDtBQUNELEdBM0IwRCxDQTZCM0Q7OztBQUNBLFNBQU8sS0FBUDtBQUNELENBL0JEOzs7QUNIQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOzs7Ozs7Ozs7O2VDL0JtQixPQUFPLENBQUMsWUFBRCxDO0lBQWxCLE0sWUFBQSxNOztBQUNSLElBQU0sT0FBTyxHQUFHLE9BQU8sQ0FBQyx5QkFBRCxDQUF2Qjs7QUFDQSxJQUFNLFVBQVUsR0FBRyxPQUFPLENBQUMsNEJBQUQsQ0FBMUI7O2dCQUNjLE9BQU8sQ0FBQyxRQUFELEM7SUFBYixDLGFBQUEsQzs7QUFFUixNQUFNLENBQUMsT0FBUDtBQUFBOztBQUdFLHFCQUFhLElBQWIsRUFBbUIsSUFBbkIsRUFBeUI7QUFBQTs7QUFDdkIsK0JBQU0sSUFBTixFQUFZLElBQVo7QUFDQSxVQUFLLEVBQUwsR0FBVSxNQUFLLElBQUwsQ0FBVSxFQUFWLElBQWdCLFdBQTFCO0FBQ0EsVUFBSyxLQUFMLEdBQWEsWUFBYjtBQUNBLFVBQUssSUFBTCxHQUFZLFVBQVo7QUFFQSxVQUFLLGFBQUwsR0FBcUI7QUFDbkIsTUFBQSxPQUFPLEVBQUU7QUFDUDtBQUNBO0FBQ0E7QUFDQSxRQUFBLFdBQVcsRUFBRTtBQUpOO0FBRFUsS0FBckIsQ0FOdUIsQ0FldkI7O0FBQ0EsUUFBTSxjQUFjLEdBQUc7QUFDckIsTUFBQSxNQUFNLEVBQUUsSUFEYTtBQUVyQixNQUFBLE1BQU0sRUFBRSxJQUZhO0FBR3JCLE1BQUEsU0FBUyxFQUFFO0FBSFUsS0FBdkIsQ0FoQnVCLENBc0J2Qjs7QUFDQSxVQUFLLElBQUwsZ0JBQWlCLGNBQWpCLEVBQW9DLElBQXBDOztBQUVBLFVBQUssUUFBTDs7QUFFQSxVQUFLLE1BQUwsR0FBYyxNQUFLLE1BQUwsQ0FBWSxJQUFaLCtCQUFkO0FBQ0EsVUFBSyxpQkFBTCxHQUF5QixNQUFLLGlCQUFMLENBQXVCLElBQXZCLCtCQUF6QjtBQUNBLFVBQUssV0FBTCxHQUFtQixNQUFLLFdBQUwsQ0FBaUIsSUFBakIsK0JBQW5CO0FBN0J1QjtBQThCeEI7O0FBakNIOztBQUFBLFNBbUNFLFVBbkNGLEdBbUNFLG9CQUFZLE9BQVosRUFBcUI7QUFDbkIsc0JBQU0sVUFBTixZQUFpQixPQUFqQjs7QUFDQSxTQUFLLFFBQUw7QUFDRCxHQXRDSDs7QUFBQSxTQXdDRSxRQXhDRixHQXdDRSxvQkFBWTtBQUNWLFNBQUssVUFBTCxHQUFrQixJQUFJLFVBQUosQ0FBZSxDQUFDLEtBQUssYUFBTixFQUFxQixLQUFLLElBQUwsQ0FBVSxNQUEvQixFQUF1QyxLQUFLLElBQUwsQ0FBVSxNQUFqRCxDQUFmLENBQWxCO0FBQ0EsU0FBSyxJQUFMLEdBQVksS0FBSyxVQUFMLENBQWdCLFNBQWhCLENBQTBCLElBQTFCLENBQStCLEtBQUssVUFBcEMsQ0FBWjtBQUNBLFNBQUssU0FBTCxHQUFpQixLQUFLLFVBQUwsQ0FBZ0IsY0FBaEIsQ0FBK0IsSUFBL0IsQ0FBb0MsS0FBSyxVQUF6QyxDQUFqQjtBQUNBLFNBQUssY0FBTCxHQUpVLENBSVk7QUFDdkIsR0E3Q0g7O0FBQUEsU0ErQ0UsUUEvQ0YsR0ErQ0Usa0JBQVUsS0FBVixFQUFpQjtBQUFBOztBQUNmLFFBQU0sV0FBVyxHQUFHLEtBQUssQ0FBQyxHQUFOLENBQVUsVUFBQyxJQUFEO0FBQUEsYUFBVztBQUN2QyxRQUFBLE1BQU0sRUFBRSxNQUFJLENBQUMsRUFEMEI7QUFFdkMsUUFBQSxJQUFJLEVBQUUsSUFBSSxDQUFDLElBRjRCO0FBR3ZDLFFBQUEsSUFBSSxFQUFFLElBQUksQ0FBQyxJQUg0QjtBQUl2QyxRQUFBLElBQUksRUFBRTtBQUppQyxPQUFYO0FBQUEsS0FBVixDQUFwQjs7QUFPQSxRQUFJO0FBQ0YsV0FBSyxJQUFMLENBQVUsUUFBVixDQUFtQixXQUFuQjtBQUNELEtBRkQsQ0FFRSxPQUFPLEdBQVAsRUFBWTtBQUNaLFdBQUssSUFBTCxDQUFVLEdBQVYsQ0FBYyxHQUFkO0FBQ0Q7QUFDRixHQTVESDs7QUFBQSxTQThERSxpQkE5REYsR0E4REUsMkJBQW1CLEtBQW5CLEVBQTBCO0FBQ3hCLFNBQUssSUFBTCxDQUFVLEdBQVYsQ0FBYyxpREFBZDtBQUNBLFFBQU0sS0FBSyxHQUFHLE9BQU8sQ0FBQyxLQUFLLENBQUMsTUFBTixDQUFhLEtBQWQsQ0FBckI7QUFDQSxTQUFLLFFBQUwsQ0FBYyxLQUFkLEVBSHdCLENBS3hCO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFDQSxJQUFBLEtBQUssQ0FBQyxNQUFOLENBQWEsS0FBYixHQUFxQixJQUFyQjtBQUNELEdBMUVIOztBQUFBLFNBNEVFLFdBNUVGLEdBNEVFLHFCQUFhLEVBQWIsRUFBaUI7QUFDZixTQUFLLEtBQUwsQ0FBVyxLQUFYO0FBQ0QsR0E5RUg7O0FBQUEsU0FnRkUsTUFoRkYsR0FnRkUsZ0JBQVEsS0FBUixFQUFlO0FBQUE7O0FBQ2I7QUFDQSxRQUFNLGdCQUFnQixHQUFHO0FBQ3ZCLE1BQUEsS0FBSyxFQUFFLE9BRGdCO0FBRXZCLE1BQUEsTUFBTSxFQUFFLE9BRmU7QUFHdkIsTUFBQSxPQUFPLEVBQUUsQ0FIYztBQUl2QixNQUFBLFFBQVEsRUFBRSxRQUphO0FBS3ZCLE1BQUEsUUFBUSxFQUFFLFVBTGE7QUFNdkIsTUFBQSxNQUFNLEVBQUUsQ0FBQztBQU5jLEtBQXpCO0FBU0EsUUFBTSxZQUFZLEdBQUcsS0FBSyxJQUFMLENBQVUsSUFBVixDQUFlLFlBQXBDO0FBQ0EsUUFBTSxNQUFNLEdBQUcsWUFBWSxDQUFDLGdCQUFiLEdBQWdDLFlBQVksQ0FBQyxnQkFBYixDQUE4QixJQUE5QixDQUFtQyxHQUFuQyxDQUFoQyxHQUEwRSxJQUF6RjtBQUVBLFdBQ0U7QUFBSyxNQUFBLEtBQUssRUFBQztBQUFYLE9BQ0U7QUFDRSxNQUFBLEtBQUssRUFBQyxzQkFEUjtBQUVFLE1BQUEsS0FBSyxFQUFFLEtBQUssSUFBTCxDQUFVLE1BQVYsSUFBb0IsZ0JBRjdCO0FBR0UsTUFBQSxJQUFJLEVBQUMsTUFIUDtBQUlFLE1BQUEsSUFBSSxFQUFFLEtBQUssSUFBTCxDQUFVLFNBSmxCO0FBS0UsTUFBQSxRQUFRLEVBQUUsS0FBSyxpQkFMakI7QUFNRSxNQUFBLFFBQVEsRUFBRSxZQUFZLENBQUMsZ0JBQWIsS0FBa0MsQ0FOOUM7QUFPRSxNQUFBLE1BQU0sRUFBRSxNQVBWO0FBUUUsTUFBQSxHQUFHLEVBQUUsYUFBQyxLQUFELEVBQVc7QUFBRSxRQUFBLE1BQUksQ0FBQyxLQUFMLEdBQWEsS0FBYjtBQUFvQjtBQVJ4QyxNQURGLEVBV0csS0FBSyxJQUFMLENBQVUsTUFBVixJQUNDO0FBQ0UsTUFBQSxLQUFLLEVBQUMsb0JBRFI7QUFFRSxNQUFBLElBQUksRUFBQyxRQUZQO0FBR0UsTUFBQSxPQUFPLEVBQUUsS0FBSztBQUhoQixPQUtHLEtBQUssSUFBTCxDQUFVLGFBQVYsQ0FMSCxDQVpKLENBREY7QUFzQkQsR0FwSEg7O0FBQUEsU0FzSEUsT0F0SEYsR0FzSEUsbUJBQVc7QUFDVCxRQUFNLE1BQU0sR0FBRyxLQUFLLElBQUwsQ0FBVSxNQUF6Qjs7QUFDQSxRQUFJLE1BQUosRUFBWTtBQUNWLFdBQUssS0FBTCxDQUFXLE1BQVgsRUFBbUIsSUFBbkI7QUFDRDtBQUNGLEdBM0hIOztBQUFBLFNBNkhFLFNBN0hGLEdBNkhFLHFCQUFhO0FBQ1gsU0FBSyxPQUFMO0FBQ0QsR0EvSEg7O0FBQUE7QUFBQSxFQUF5QyxNQUF6QyxVQUNTLE9BRFQsR0FDbUIsT0FBTyxDQUFDLGlCQUFELENBQVAsQ0FBMkIsT0FEOUM7OztBQ0xBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7Ozs7Ozs7OztlQ2hDbUIsT0FBTyxDQUFDLFlBQUQsQztJQUFsQixNLFlBQUEsTTs7Z0JBQ00sT0FBTyxDQUFDLFFBQUQsQztJQUFiLEMsYUFBQSxDO0FBRVI7QUFDQTtBQUNBO0FBQ0E7OztBQUNBLE1BQU0sQ0FBQyxPQUFQO0FBQUE7O0FBR0UsdUJBQWEsSUFBYixFQUFtQixJQUFuQixFQUF5QjtBQUFBOztBQUN2QiwrQkFBTSxJQUFOLEVBQVksSUFBWjtBQUNBLFVBQUssRUFBTCxHQUFVLE1BQUssSUFBTCxDQUFVLEVBQVYsSUFBZ0IsYUFBMUI7QUFDQSxVQUFLLEtBQUwsR0FBYSxjQUFiO0FBQ0EsVUFBSyxJQUFMLEdBQVksbUJBQVosQ0FKdUIsQ0FNdkI7O0FBQ0EsUUFBTSxjQUFjLEdBQUc7QUFDckIsTUFBQSxNQUFNLEVBQUUsTUFEYTtBQUVyQixNQUFBLG9CQUFvQixFQUFFLEtBRkQ7QUFHckIsTUFBQSxLQUFLLEVBQUUsS0FIYztBQUlyQixNQUFBLGVBQWUsRUFBRTtBQUpJLEtBQXZCLENBUHVCLENBY3ZCOztBQUNBLFVBQUssSUFBTCxHQUFZLFNBQWMsRUFBZCxFQUFrQixjQUFsQixFQUFrQyxJQUFsQyxDQUFaO0FBRUEsVUFBSyxNQUFMLEdBQWMsTUFBSyxNQUFMLENBQVksSUFBWiwrQkFBZDtBQWpCdUI7QUFrQnhCOztBQXJCSDs7QUFBQSxTQXVCRSxNQXZCRixHQXVCRSxnQkFBUSxLQUFSLEVBQWU7QUFDYixRQUFNLFFBQVEsR0FBRyxLQUFLLENBQUMsYUFBTixJQUF1QixDQUF4QyxDQURhLENBRWI7O0FBQ0EsUUFBTSxRQUFRLEdBQUcsQ0FBQyxRQUFRLEtBQUssQ0FBYixJQUFrQixRQUFRLEtBQUssR0FBaEMsS0FBd0MsS0FBSyxJQUFMLENBQVUsZUFBbkU7QUFDQSxXQUNFO0FBQ0UsTUFBQSxLQUFLLEVBQUMsdUJBRFI7QUFFRSxNQUFBLEtBQUssRUFBRTtBQUFFLFFBQUEsUUFBUSxFQUFFLEtBQUssSUFBTCxDQUFVLEtBQVYsR0FBa0IsT0FBbEIsR0FBNEI7QUFBeEMsT0FGVDtBQUdFLHFCQUFhO0FBSGYsT0FLRTtBQUFLLE1BQUEsS0FBSyxFQUFDLHdCQUFYO0FBQW9DLE1BQUEsS0FBSyxFQUFFO0FBQUUsUUFBQSxLQUFLLEVBQUUsUUFBUSxHQUFHO0FBQXBCO0FBQTNDLE1BTEYsRUFNRTtBQUFLLE1BQUEsS0FBSyxFQUFDO0FBQVgsT0FBMEMsUUFBMUMsQ0FORixDQURGO0FBVUQsR0FyQ0g7O0FBQUEsU0F1Q0UsT0F2Q0YsR0F1Q0UsbUJBQVc7QUFDVCxRQUFNLE1BQU0sR0FBRyxLQUFLLElBQUwsQ0FBVSxNQUF6Qjs7QUFDQSxRQUFJLE1BQUosRUFBWTtBQUNWLFdBQUssS0FBTCxDQUFXLE1BQVgsRUFBbUIsSUFBbkI7QUFDRDtBQUNGLEdBNUNIOztBQUFBLFNBOENFLFNBOUNGLEdBOENFLHFCQUFhO0FBQ1gsU0FBSyxPQUFMO0FBQ0QsR0FoREg7O0FBQUE7QUFBQSxFQUEyQyxNQUEzQyxVQUNTLE9BRFQsR0FDbUIsT0FBTyxDQUFDLGlCQUFELENBQVAsQ0FBMkIsT0FEOUM7OztBQ1BBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOzs7O0FDckJBO0FBQ0E7QUFDQTtJQUNNLFk7QUFHSiwwQkFBZTtBQUNiLFNBQUssS0FBTCxHQUFhLEVBQWI7QUFDQSxTQUFLLFNBQUwsR0FBaUIsRUFBakI7QUFDRDs7OztTQUVELFEsR0FBQSxvQkFBWTtBQUNWLFdBQU8sS0FBSyxLQUFaO0FBQ0QsRzs7U0FFRCxRLEdBQUEsa0JBQVUsS0FBVixFQUFpQjtBQUNmLFFBQU0sU0FBUyxHQUFHLFNBQWMsRUFBZCxFQUFrQixLQUFLLEtBQXZCLENBQWxCOztBQUNBLFFBQU0sU0FBUyxHQUFHLFNBQWMsRUFBZCxFQUFrQixLQUFLLEtBQXZCLEVBQThCLEtBQTlCLENBQWxCOztBQUVBLFNBQUssS0FBTCxHQUFhLFNBQWI7O0FBQ0EsU0FBSyxRQUFMLENBQWMsU0FBZCxFQUF5QixTQUF6QixFQUFvQyxLQUFwQztBQUNELEc7O1NBRUQsUyxHQUFBLG1CQUFXLFFBQVgsRUFBcUI7QUFBQTs7QUFDbkIsU0FBSyxTQUFMLENBQWUsSUFBZixDQUFvQixRQUFwQjtBQUNBLFdBQU8sWUFBTTtBQUNYO0FBQ0EsTUFBQSxLQUFJLENBQUMsU0FBTCxDQUFlLE1BQWYsQ0FDRSxLQUFJLENBQUMsU0FBTCxDQUFlLE9BQWYsQ0FBdUIsUUFBdkIsQ0FERixFQUVFLENBRkY7QUFJRCxLQU5EO0FBT0QsRzs7U0FFRCxRLEdBQUEsb0JBQW1CO0FBQUEsc0NBQU4sSUFBTTtBQUFOLE1BQUEsSUFBTTtBQUFBOztBQUNqQixTQUFLLFNBQUwsQ0FBZSxPQUFmLENBQXVCLFVBQUMsUUFBRCxFQUFjO0FBQ25DLE1BQUEsUUFBUSxNQUFSLFNBQVksSUFBWjtBQUNELEtBRkQ7QUFHRCxHOzs7OztBQW5DRyxZLENBQ0csTyxHQUFVLE9BQU8sQ0FBQyxpQkFBRCxDQUFQLENBQTJCLE87O0FBcUM5QyxNQUFNLENBQUMsT0FBUCxHQUFpQixTQUFTLFlBQVQsR0FBeUI7QUFDeEMsU0FBTyxJQUFJLFlBQUosRUFBUDtBQUNELENBRkQ7OztBQ3pDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLE1BQU0sQ0FBQyxPQUFQO0FBQ0Usd0JBQWEsT0FBYixFQUFzQjtBQUNwQixTQUFLLE9BQUwsR0FBZSxFQUFmO0FBQ0EsU0FBSyxRQUFMLEdBQWdCLE9BQWhCO0FBQ0Q7O0FBSkg7O0FBQUEsU0FNRSxFQU5GLEdBTUUsWUFBSSxLQUFKLEVBQVcsRUFBWCxFQUFlO0FBQ2IsU0FBSyxPQUFMLENBQWEsSUFBYixDQUFrQixDQUFDLEtBQUQsRUFBUSxFQUFSLENBQWxCOztBQUNBLFdBQU8sS0FBSyxRQUFMLENBQWMsRUFBZCxDQUFpQixLQUFqQixFQUF3QixFQUF4QixDQUFQO0FBQ0QsR0FUSDs7QUFBQSxTQVdFLE1BWEYsR0FXRSxrQkFBVTtBQUFBOztBQUNSLFNBQUssT0FBTCxDQUFhLE9BQWIsQ0FBcUIsZ0JBQWlCO0FBQUEsVUFBZixLQUFlO0FBQUEsVUFBUixFQUFROztBQUNwQyxNQUFBLEtBQUksQ0FBQyxRQUFMLENBQWMsR0FBZCxDQUFrQixLQUFsQixFQUF5QixFQUF6QjtBQUNELEtBRkQ7QUFHRCxHQWZIOztBQUFBO0FBQUE7Ozs7Ozs7Ozs7Ozs7Ozs7O0lDSk0sWTs7O0FBQ0osd0JBQWEsS0FBYixFQUFvQixHQUFwQixFQUFnQztBQUFBOztBQUFBLFFBQVosR0FBWTtBQUFaLE1BQUEsR0FBWSxHQUFOLElBQU07QUFBQTs7QUFDOUIsMkpBQWlJLEtBQWpJO0FBRUEsVUFBSyxjQUFMLEdBQXNCLElBQXRCO0FBQ0EsVUFBSyxPQUFMLEdBQWUsR0FBZjtBQUo4QjtBQUsvQjs7O2lDQU53QixLOztBQVMzQixNQUFNLENBQUMsT0FBUCxHQUFpQixZQUFqQjs7O0FDVEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0lBQ00sZTtBQUNKLDJCQUFhLE9BQWIsRUFBc0IsY0FBdEIsRUFBc0M7QUFDcEMsU0FBSyxRQUFMLEdBQWdCLE9BQWhCO0FBQ0EsU0FBSyxXQUFMLEdBQW1CLGNBQW5CO0FBQ0EsU0FBSyxPQUFMLEdBQWUsS0FBZjtBQUNBLFNBQUssV0FBTCxHQUFtQixJQUFuQjtBQUNBLFNBQUssV0FBTCxHQUFtQixLQUFLLFdBQUwsQ0FBaUIsSUFBakIsQ0FBc0IsSUFBdEIsQ0FBbkI7QUFDRDs7OztTQUVELFEsR0FBQSxvQkFBWTtBQUNWO0FBQ0E7QUFDQTtBQUNBLFFBQUksS0FBSyxPQUFULEVBQWtCOztBQUVsQixRQUFJLEtBQUssUUFBTCxHQUFnQixDQUFwQixFQUF1QjtBQUNyQixVQUFJLEtBQUssV0FBVCxFQUFzQixZQUFZLENBQUMsS0FBSyxXQUFOLENBQVo7QUFDdEIsV0FBSyxXQUFMLEdBQW1CLFVBQVUsQ0FBQyxLQUFLLFdBQU4sRUFBbUIsS0FBSyxRQUF4QixDQUE3QjtBQUNEO0FBQ0YsRzs7U0FFRCxJLEdBQUEsZ0JBQVE7QUFDTixRQUFJLEtBQUssV0FBVCxFQUFzQjtBQUNwQixNQUFBLFlBQVksQ0FBQyxLQUFLLFdBQU4sQ0FBWjtBQUNBLFdBQUssV0FBTCxHQUFtQixJQUFuQjtBQUNEOztBQUNELFNBQUssT0FBTCxHQUFlLElBQWY7QUFDRCxHOzs7OztBQUdILE1BQU0sQ0FBQyxPQUFQLEdBQWlCLGVBQWpCOzs7QUNwQ0E7QUFDQTtBQUNBO0FBQ0EsU0FBUyxTQUFULENBQW9CLEtBQXBCLEVBQTJCLFNBQTNCLEVBQXNDO0FBQ3BDLE9BQUssSUFBSSxDQUFDLEdBQUcsQ0FBYixFQUFnQixDQUFDLEdBQUcsS0FBSyxDQUFDLE1BQTFCLEVBQWtDLENBQUMsRUFBbkMsRUFBdUM7QUFDckMsUUFBSSxTQUFTLENBQUMsS0FBSyxDQUFDLENBQUQsQ0FBTixDQUFiLEVBQXlCLE9BQU8sQ0FBUDtBQUMxQjs7QUFDRCxTQUFPLENBQUMsQ0FBUjtBQUNEOztBQUVELFNBQVMsaUJBQVQsR0FBOEI7QUFDNUIsU0FBTyxJQUFJLEtBQUosQ0FBVSxXQUFWLENBQVA7QUFDRDs7QUFFRCxNQUFNLENBQUMsT0FBUDtBQUNFLDRCQUFhLEtBQWIsRUFBb0I7QUFDbEIsUUFBSSxPQUFPLEtBQVAsS0FBaUIsUUFBakIsSUFBNkIsS0FBSyxLQUFLLENBQTNDLEVBQThDO0FBQzVDLFdBQUssS0FBTCxHQUFhLFFBQWI7QUFDRCxLQUZELE1BRU87QUFDTCxXQUFLLEtBQUwsR0FBYSxLQUFiO0FBQ0Q7O0FBRUQsU0FBSyxjQUFMLEdBQXNCLENBQXRCO0FBQ0EsU0FBSyxjQUFMLEdBQXNCLEVBQXRCO0FBQ0Q7O0FBVkg7O0FBQUEsU0FZRSxLQVpGLEdBWUUsZUFBTyxFQUFQLEVBQVc7QUFBQTs7QUFDVCxTQUFLLGNBQUwsSUFBdUIsQ0FBdkI7QUFFQSxRQUFJLEtBQUksR0FBRyxLQUFYO0FBRUEsUUFBSSxZQUFKOztBQUNBLFFBQUk7QUFDRixNQUFBLFlBQVksR0FBRyxFQUFFLEVBQWpCO0FBQ0QsS0FGRCxDQUVFLE9BQU8sR0FBUCxFQUFZO0FBQ1osV0FBSyxjQUFMLElBQXVCLENBQXZCO0FBQ0EsWUFBTSxHQUFOO0FBQ0Q7O0FBRUQsV0FBTztBQUNMLE1BQUEsS0FBSyxFQUFFLGlCQUFNO0FBQ1gsWUFBSSxLQUFKLEVBQVU7QUFDVixRQUFBLEtBQUksR0FBRyxJQUFQO0FBQ0EsUUFBQSxLQUFJLENBQUMsY0FBTCxJQUF1QixDQUF2QjtBQUNBLFFBQUEsWUFBWTs7QUFDWixRQUFBLEtBQUksQ0FBQyxVQUFMO0FBQ0QsT0FQSTtBQVNMLE1BQUEsSUFBSSxFQUFFLGdCQUFNO0FBQ1YsWUFBSSxLQUFKLEVBQVU7QUFDVixRQUFBLEtBQUksR0FBRyxJQUFQO0FBQ0EsUUFBQSxLQUFJLENBQUMsY0FBTCxJQUF1QixDQUF2Qjs7QUFDQSxRQUFBLEtBQUksQ0FBQyxVQUFMO0FBQ0Q7QUFkSSxLQUFQO0FBZ0JELEdBekNIOztBQUFBLFNBMkNFLFVBM0NGLEdBMkNFLHNCQUFjO0FBQUE7O0FBQ1o7QUFDQTtBQUNBO0FBQ0EsSUFBQSxPQUFPLENBQUMsT0FBUixHQUFrQixJQUFsQixDQUF1QixZQUFNO0FBQzNCLE1BQUEsTUFBSSxDQUFDLEtBQUw7QUFDRCxLQUZEO0FBR0QsR0FsREg7O0FBQUEsU0FvREUsS0FwREYsR0FvREUsaUJBQVM7QUFDUCxRQUFJLEtBQUssY0FBTCxJQUF1QixLQUFLLEtBQWhDLEVBQXVDO0FBQ3JDO0FBQ0Q7O0FBQ0QsUUFBSSxLQUFLLGNBQUwsQ0FBb0IsTUFBcEIsS0FBK0IsQ0FBbkMsRUFBc0M7QUFDcEM7QUFDRCxLQU5NLENBUVA7QUFDQTtBQUNBOzs7QUFDQSxRQUFNLElBQUksR0FBRyxLQUFLLGNBQUwsQ0FBb0IsS0FBcEIsRUFBYjs7QUFDQSxRQUFNLE9BQU8sR0FBRyxLQUFLLEtBQUwsQ0FBVyxJQUFJLENBQUMsRUFBaEIsQ0FBaEI7O0FBQ0EsSUFBQSxJQUFJLENBQUMsS0FBTCxHQUFhLE9BQU8sQ0FBQyxLQUFyQjtBQUNBLElBQUEsSUFBSSxDQUFDLElBQUwsR0FBWSxPQUFPLENBQUMsSUFBcEI7QUFDRCxHQW5FSDs7QUFBQSxTQXFFRSxNQXJFRixHQXFFRSxnQkFBUSxFQUFSLEVBQVksT0FBWixFQUEwQjtBQUFBOztBQUFBLFFBQWQsT0FBYztBQUFkLE1BQUEsT0FBYyxHQUFKLEVBQUk7QUFBQTs7QUFDeEIsUUFBTSxPQUFPLEdBQUc7QUFDZCxNQUFBLEVBQUUsRUFBRixFQURjO0FBRWQsTUFBQSxRQUFRLEVBQUUsT0FBTyxDQUFDLFFBQVIsSUFBb0IsQ0FGaEI7QUFHZCxNQUFBLEtBQUssRUFBRSxpQkFBTTtBQUNYLFFBQUEsTUFBSSxDQUFDLFFBQUwsQ0FBYyxPQUFkO0FBQ0QsT0FMYTtBQU1kLE1BQUEsSUFBSSxFQUFFLGdCQUFNO0FBQ1YsY0FBTSxJQUFJLEtBQUosQ0FBVSw0REFBVixDQUFOO0FBQ0Q7QUFSYSxLQUFoQjtBQVdBLFFBQU0sS0FBSyxHQUFHLFNBQVMsQ0FBQyxLQUFLLGNBQU4sRUFBc0IsVUFBQyxLQUFELEVBQVc7QUFDdEQsYUFBTyxPQUFPLENBQUMsUUFBUixHQUFtQixLQUFLLENBQUMsUUFBaEM7QUFDRCxLQUZzQixDQUF2Qjs7QUFHQSxRQUFJLEtBQUssS0FBSyxDQUFDLENBQWYsRUFBa0I7QUFDaEIsV0FBSyxjQUFMLENBQW9CLElBQXBCLENBQXlCLE9BQXpCO0FBQ0QsS0FGRCxNQUVPO0FBQ0wsV0FBSyxjQUFMLENBQW9CLE1BQXBCLENBQTJCLEtBQTNCLEVBQWtDLENBQWxDLEVBQXFDLE9BQXJDO0FBQ0Q7O0FBQ0QsV0FBTyxPQUFQO0FBQ0QsR0ExRkg7O0FBQUEsU0E0RkUsUUE1RkYsR0E0RkUsa0JBQVUsT0FBVixFQUFtQjtBQUNqQixRQUFNLEtBQUssR0FBRyxLQUFLLGNBQUwsQ0FBb0IsT0FBcEIsQ0FBNEIsT0FBNUIsQ0FBZDs7QUFDQSxRQUFJLEtBQUssS0FBSyxDQUFDLENBQWYsRUFBa0I7QUFDaEIsV0FBSyxjQUFMLENBQW9CLE1BQXBCLENBQTJCLEtBQTNCLEVBQWtDLENBQWxDO0FBQ0Q7QUFDRixHQWpHSDs7QUFBQSxTQW1HRSxHQW5HRixHQW1HRSxhQUFLLEVBQUwsRUFBUyxZQUFULEVBQXVCO0FBQ3JCLFFBQUksS0FBSyxjQUFMLEdBQXNCLEtBQUssS0FBL0IsRUFBc0M7QUFDcEMsYUFBTyxLQUFLLEtBQUwsQ0FBVyxFQUFYLENBQVA7QUFDRDs7QUFDRCxXQUFPLEtBQUssTUFBTCxDQUFZLEVBQVosRUFBZ0IsWUFBaEIsQ0FBUDtBQUNELEdBeEdIOztBQUFBLFNBMEdFLG1CQTFHRixHQTBHRSw2QkFBcUIsRUFBckIsRUFBeUIsWUFBekIsRUFBdUM7QUFBQTs7QUFDckMsV0FBTyxZQUFhO0FBQUEsd0NBQVQsSUFBUztBQUFULFFBQUEsSUFBUztBQUFBOztBQUNsQixVQUFJLGFBQUo7QUFDQSxVQUFNLFlBQVksR0FBRyxJQUFJLE9BQUosQ0FBWSxVQUFDLE9BQUQsRUFBVSxNQUFWLEVBQXFCO0FBQ3BELFFBQUEsYUFBYSxHQUFHLE1BQUksQ0FBQyxHQUFMLENBQVMsWUFBTTtBQUM3QixjQUFJLFdBQUo7QUFDQSxjQUFJLFlBQUo7O0FBQ0EsY0FBSTtBQUNGLFlBQUEsWUFBWSxHQUFHLE9BQU8sQ0FBQyxPQUFSLENBQWdCLEVBQUUsTUFBRixTQUFNLElBQU4sQ0FBaEIsQ0FBZjtBQUNELFdBRkQsQ0FFRSxPQUFPLEdBQVAsRUFBWTtBQUNaLFlBQUEsWUFBWSxHQUFHLE9BQU8sQ0FBQyxNQUFSLENBQWUsR0FBZixDQUFmO0FBQ0Q7O0FBRUQsVUFBQSxZQUFZLENBQUMsSUFBYixDQUFrQixVQUFDLE1BQUQsRUFBWTtBQUM1QixnQkFBSSxXQUFKLEVBQWlCO0FBQ2YsY0FBQSxNQUFNLENBQUMsV0FBRCxDQUFOO0FBQ0QsYUFGRCxNQUVPO0FBQ0wsY0FBQSxhQUFhLENBQUMsSUFBZDtBQUNBLGNBQUEsT0FBTyxDQUFDLE1BQUQsQ0FBUDtBQUNEO0FBQ0YsV0FQRCxFQU9HLFVBQUMsR0FBRCxFQUFTO0FBQ1YsZ0JBQUksV0FBSixFQUFpQjtBQUNmLGNBQUEsTUFBTSxDQUFDLFdBQUQsQ0FBTjtBQUNELGFBRkQsTUFFTztBQUNMLGNBQUEsYUFBYSxDQUFDLElBQWQ7QUFDQSxjQUFBLE1BQU0sQ0FBQyxHQUFELENBQU47QUFDRDtBQUNGLFdBZEQ7QUFnQkEsaUJBQU8sWUFBTTtBQUNYLFlBQUEsV0FBVyxHQUFHLGlCQUFpQixFQUEvQjtBQUNELFdBRkQ7QUFHRCxTQTVCZSxFQTRCYixZQTVCYSxDQUFoQjtBQTZCRCxPQTlCb0IsQ0FBckI7O0FBZ0NBLE1BQUEsWUFBWSxDQUFDLEtBQWIsR0FBcUIsWUFBTTtBQUN6QixRQUFBLGFBQWEsQ0FBQyxLQUFkO0FBQ0QsT0FGRDs7QUFJQSxhQUFPLFlBQVA7QUFDRCxLQXZDRDtBQXdDRCxHQW5KSDs7QUFBQTtBQUFBOzs7OztBQ2RBLElBQU0sR0FBRyxHQUFHLE9BQU8sQ0FBQyxlQUFELENBQW5CO0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7O0FBQ0EsTUFBTSxDQUFDLE9BQVA7QUFDRTtBQUNGO0FBQ0E7QUFDRSxzQkFBYSxPQUFiLEVBQXNCO0FBQUE7O0FBQ3BCLFNBQUssTUFBTCxHQUFjO0FBQ1osTUFBQSxPQUFPLEVBQUUsRUFERztBQUVaLE1BQUEsU0FBUyxFQUFFLG1CQUFVLENBQVYsRUFBYTtBQUN0QixZQUFJLENBQUMsS0FBSyxDQUFWLEVBQWE7QUFDWCxpQkFBTyxDQUFQO0FBQ0Q7O0FBQ0QsZUFBTyxDQUFQO0FBQ0Q7QUFQVyxLQUFkOztBQVVBLFFBQUksS0FBSyxDQUFDLE9BQU4sQ0FBYyxPQUFkLENBQUosRUFBNEI7QUFDMUIsTUFBQSxPQUFPLENBQUMsT0FBUixDQUFnQixVQUFDLE1BQUQ7QUFBQSxlQUFZLEtBQUksQ0FBQyxNQUFMLENBQVksTUFBWixDQUFaO0FBQUEsT0FBaEI7QUFDRCxLQUZELE1BRU87QUFDTCxXQUFLLE1BQUwsQ0FBWSxPQUFaO0FBQ0Q7QUFDRjs7QUFwQkg7O0FBQUEsU0FzQkUsTUF0QkYsR0FzQkUsZ0JBQVEsTUFBUixFQUFnQjtBQUNkLFFBQUksQ0FBQyxNQUFELElBQVcsQ0FBQyxNQUFNLENBQUMsT0FBdkIsRUFBZ0M7QUFDOUI7QUFDRDs7QUFFRCxRQUFNLFVBQVUsR0FBRyxLQUFLLE1BQXhCO0FBQ0EsU0FBSyxNQUFMLEdBQWMsU0FBYyxFQUFkLEVBQWtCLFVBQWxCLEVBQThCO0FBQzFDLE1BQUEsT0FBTyxFQUFFLFNBQWMsRUFBZCxFQUFrQixVQUFVLENBQUMsT0FBN0IsRUFBc0MsTUFBTSxDQUFDLE9BQTdDO0FBRGlDLEtBQTlCLENBQWQ7QUFHQSxTQUFLLE1BQUwsQ0FBWSxTQUFaLEdBQXdCLE1BQU0sQ0FBQyxTQUFQLElBQW9CLFVBQVUsQ0FBQyxTQUF2RDtBQUNEO0FBRUQ7QUFDRjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQTVDQTs7QUFBQSxTQTZDRSxXQTdDRixHQTZDRSxxQkFBYSxNQUFiLEVBQXFCLE9BQXJCLEVBQThCO0FBQUEsNEJBQ0QsTUFBTSxDQUFDLFNBRE47QUFBQSxRQUNwQixLQURvQixxQkFDcEIsS0FEb0I7QUFBQSxRQUNiLE9BRGEscUJBQ2IsT0FEYTtBQUU1QixRQUFNLFdBQVcsR0FBRyxLQUFwQjtBQUNBLFFBQU0sZUFBZSxHQUFHLE1BQXhCO0FBQ0EsUUFBSSxZQUFZLEdBQUcsQ0FBQyxNQUFELENBQW5COztBQUVBLFNBQUssSUFBTSxHQUFYLElBQWtCLE9BQWxCLEVBQTJCO0FBQ3pCLFVBQUksR0FBRyxLQUFLLEdBQVIsSUFBZSxHQUFHLENBQUMsT0FBRCxFQUFVLEdBQVYsQ0FBdEIsRUFBc0M7QUFDcEM7QUFDQTtBQUNBO0FBQ0EsWUFBSSxXQUFXLEdBQUcsT0FBTyxDQUFDLEdBQUQsQ0FBekI7O0FBQ0EsWUFBSSxPQUFPLFdBQVAsS0FBdUIsUUFBM0IsRUFBcUM7QUFDbkMsVUFBQSxXQUFXLEdBQUcsT0FBTyxDQUFDLElBQVIsQ0FBYSxPQUFPLENBQUMsR0FBRCxDQUFwQixFQUEyQixXQUEzQixFQUF3QyxlQUF4QyxDQUFkO0FBQ0QsU0FQbUMsQ0FRcEM7QUFDQTtBQUNBOzs7QUFDQSxRQUFBLFlBQVksR0FBRyxpQkFBaUIsQ0FBQyxZQUFELEVBQWUsSUFBSSxNQUFKLENBQVcsU0FBUyxHQUFULEdBQWUsS0FBMUIsRUFBaUMsR0FBakMsQ0FBZixFQUFzRCxXQUF0RCxDQUFoQztBQUNEO0FBQ0Y7O0FBRUQsV0FBTyxZQUFQOztBQUVBLGFBQVMsaUJBQVQsQ0FBNEIsTUFBNUIsRUFBb0MsRUFBcEMsRUFBd0MsV0FBeEMsRUFBcUQ7QUFDbkQsVUFBTSxRQUFRLEdBQUcsRUFBakI7QUFDQSxNQUFBLE1BQU0sQ0FBQyxPQUFQLENBQWUsVUFBQyxLQUFELEVBQVc7QUFDeEI7QUFDQTtBQUNBO0FBQ0E7QUFDQSxZQUFJLE9BQU8sS0FBUCxLQUFpQixRQUFyQixFQUErQjtBQUM3QixpQkFBTyxRQUFRLENBQUMsSUFBVCxDQUFjLEtBQWQsQ0FBUDtBQUNEOztBQUVELFFBQUEsS0FBSyxDQUFDLElBQU4sQ0FBVyxLQUFYLEVBQWtCLEVBQWxCLEVBQXNCLE9BQXRCLENBQThCLFVBQUMsR0FBRCxFQUFNLENBQU4sRUFBUyxJQUFULEVBQWtCO0FBQzlDLGNBQUksR0FBRyxLQUFLLEVBQVosRUFBZ0I7QUFDZCxZQUFBLFFBQVEsQ0FBQyxJQUFULENBQWMsR0FBZDtBQUNELFdBSDZDLENBSzlDOzs7QUFDQSxjQUFJLENBQUMsR0FBRyxJQUFJLENBQUMsTUFBTCxHQUFjLENBQXRCLEVBQXlCO0FBQ3ZCLFlBQUEsUUFBUSxDQUFDLElBQVQsQ0FBYyxXQUFkO0FBQ0Q7QUFDRixTQVREO0FBVUQsT0FuQkQ7QUFvQkEsYUFBTyxRQUFQO0FBQ0Q7QUFDRjtBQUVEO0FBQ0Y7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBckdBOztBQUFBLFNBc0dFLFNBdEdGLEdBc0dFLG1CQUFXLEdBQVgsRUFBZ0IsT0FBaEIsRUFBeUI7QUFDdkIsV0FBTyxLQUFLLGNBQUwsQ0FBb0IsR0FBcEIsRUFBeUIsT0FBekIsRUFBa0MsSUFBbEMsQ0FBdUMsRUFBdkMsQ0FBUDtBQUNEO0FBRUQ7QUFDRjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFoSEE7O0FBQUEsU0FpSEUsY0FqSEYsR0FpSEUsd0JBQWdCLEdBQWhCLEVBQXFCLE9BQXJCLEVBQThCO0FBQzVCLFFBQUksQ0FBQyxHQUFHLENBQUMsS0FBSyxNQUFMLENBQVksT0FBYixFQUFzQixHQUF0QixDQUFSLEVBQW9DO0FBQ2xDLFlBQU0sSUFBSSxLQUFKLHNCQUE2QixHQUE3QixDQUFOO0FBQ0Q7O0FBRUQsUUFBTSxNQUFNLEdBQUcsS0FBSyxNQUFMLENBQVksT0FBWixDQUFvQixHQUFwQixDQUFmO0FBQ0EsUUFBTSxjQUFjLEdBQUcsT0FBTyxNQUFQLEtBQWtCLFFBQXpDOztBQUVBLFFBQUksY0FBSixFQUFvQjtBQUNsQixVQUFJLE9BQU8sSUFBSSxPQUFPLE9BQU8sQ0FBQyxXQUFmLEtBQStCLFdBQTlDLEVBQTJEO0FBQ3pELFlBQU0sTUFBTSxHQUFHLEtBQUssTUFBTCxDQUFZLFNBQVosQ0FBc0IsT0FBTyxDQUFDLFdBQTlCLENBQWY7QUFDQSxlQUFPLEtBQUssV0FBTCxDQUFpQixNQUFNLENBQUMsTUFBRCxDQUF2QixFQUFpQyxPQUFqQyxDQUFQO0FBQ0QsT0FIRCxNQUdPO0FBQ0wsY0FBTSxJQUFJLEtBQUosQ0FBVSx3RkFBVixDQUFOO0FBQ0Q7QUFDRjs7QUFFRCxXQUFPLEtBQUssV0FBTCxDQUFpQixNQUFqQixFQUF5QixPQUF6QixDQUFQO0FBQ0QsR0FuSUg7O0FBQUE7QUFBQTs7O0FDYkEsSUFBTSxRQUFRLEdBQUcsT0FBTyxDQUFDLGlCQUFELENBQXhCOztBQUVBLFNBQVMsbUJBQVQsQ0FBOEIsUUFBOUIsRUFBd0MsWUFBeEMsRUFBc0QsSUFBdEQsRUFBNEQ7QUFBQSxNQUNsRCxRQURrRCxHQUNWLFlBRFUsQ0FDbEQsUUFEa0Q7QUFBQSxNQUN4QyxhQUR3QyxHQUNWLFlBRFUsQ0FDeEMsYUFEd0M7QUFBQSxNQUN6QixVQUR5QixHQUNWLFlBRFUsQ0FDekIsVUFEeUI7O0FBRTFELE1BQUksUUFBSixFQUFjO0FBQ1osSUFBQSxRQUFRLENBQUMsSUFBVCxDQUFjLEdBQWQsdUJBQXNDLFFBQXRDO0FBQ0EsSUFBQSxRQUFRLENBQUMsSUFBVCxDQUFjLElBQWQsQ0FBbUIsaUJBQW5CLEVBQXNDLElBQXRDLEVBQTRDO0FBQzFDLE1BQUEsUUFBUSxFQUFSLFFBRDBDO0FBRTFDLE1BQUEsYUFBYSxFQUFFLGFBRjJCO0FBRzFDLE1BQUEsVUFBVSxFQUFFO0FBSDhCLEtBQTVDO0FBS0Q7QUFDRjs7QUFFRCxNQUFNLENBQUMsT0FBUCxHQUFpQixRQUFRLENBQUMsbUJBQUQsRUFBc0IsR0FBdEIsRUFBMkI7QUFDbEQsRUFBQSxPQUFPLEVBQUUsSUFEeUM7QUFFbEQsRUFBQSxRQUFRLEVBQUU7QUFGd0MsQ0FBM0IsQ0FBekI7OztBQ2RBLElBQU0sWUFBWSxHQUFHLE9BQU8sQ0FBQyw4QkFBRCxDQUE1QjtBQUVBO0FBQ0E7QUFDQTs7O0FBQ0EsTUFBTSxDQUFDLE9BQVAsR0FBaUIsU0FBUyxxQkFBVCxHQUE0QztBQUMzRCxTQUFPLEtBQUssTUFBTCxvQkFDSixLQURJLENBQ0UsVUFBQyxHQUFELEVBQVM7QUFDZCxRQUFJLEdBQUcsQ0FBQyxJQUFKLEtBQWEsWUFBakIsRUFBK0I7QUFDN0IsWUFBTSxHQUFOO0FBQ0QsS0FGRCxNQUVPO0FBQ0wsWUFBTSxJQUFJLFlBQUosQ0FBaUIsR0FBakIsQ0FBTjtBQUNEO0FBQ0YsR0FQSSxDQUFQO0FBUUQsQ0FURDs7O0FDTEEsSUFBTSxZQUFZLEdBQUcsT0FBTyxDQUFDLGdCQUFELENBQTVCO0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOzs7QUFDQSxNQUFNLENBQUMsT0FBUCxHQUFpQixTQUFTLGNBQVQsQ0FBeUIsT0FBekIsRUFBa0MsT0FBbEMsRUFBc0Q7QUFBQSxNQUFwQixPQUFvQjtBQUFwQixJQUFBLE9BQW9CLEdBQVYsUUFBVTtBQUFBOztBQUNyRSxNQUFJLE9BQU8sT0FBUCxLQUFtQixRQUF2QixFQUFpQztBQUMvQixXQUFPLE9BQU8sQ0FBQyxhQUFSLENBQXNCLE9BQXRCLENBQVA7QUFDRDs7QUFFRCxNQUFJLFlBQVksQ0FBQyxPQUFELENBQWhCLEVBQTJCO0FBQ3pCLFdBQU8sT0FBUDtBQUNEO0FBQ0YsQ0FSRDs7O0FDUkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxNQUFNLENBQUMsT0FBUCxHQUFpQixTQUFTLGNBQVQsQ0FBeUIsSUFBekIsRUFBK0I7QUFDOUM7QUFDQTtBQUVBLE1BQUksRUFBRSxHQUFHLE1BQVQ7O0FBQ0EsTUFBSSxPQUFPLElBQUksQ0FBQyxJQUFaLEtBQXFCLFFBQXpCLEVBQW1DO0FBQ2pDLElBQUEsRUFBRSxJQUFJLE1BQU0sY0FBYyxDQUFDLElBQUksQ0FBQyxJQUFMLENBQVUsV0FBVixFQUFELENBQTFCO0FBQ0Q7O0FBRUQsTUFBSSxJQUFJLENBQUMsSUFBTCxLQUFjLFNBQWxCLEVBQTZCO0FBQzNCLElBQUEsRUFBRSxJQUFJLE1BQU0sSUFBSSxDQUFDLElBQWpCO0FBQ0Q7O0FBRUQsTUFBSSxJQUFJLENBQUMsSUFBTCxJQUFhLE9BQU8sSUFBSSxDQUFDLElBQUwsQ0FBVSxZQUFqQixLQUFrQyxRQUFuRCxFQUE2RDtBQUMzRCxJQUFBLEVBQUUsSUFBSSxNQUFNLGNBQWMsQ0FBQyxJQUFJLENBQUMsSUFBTCxDQUFVLFlBQVYsQ0FBdUIsV0FBdkIsRUFBRCxDQUExQjtBQUNEOztBQUVELE1BQUksSUFBSSxDQUFDLElBQUwsQ0FBVSxJQUFWLEtBQW1CLFNBQXZCLEVBQWtDO0FBQ2hDLElBQUEsRUFBRSxJQUFJLE1BQU0sSUFBSSxDQUFDLElBQUwsQ0FBVSxJQUF0QjtBQUNEOztBQUNELE1BQUksSUFBSSxDQUFDLElBQUwsQ0FBVSxZQUFWLEtBQTJCLFNBQS9CLEVBQTBDO0FBQ3hDLElBQUEsRUFBRSxJQUFJLE1BQU0sSUFBSSxDQUFDLElBQUwsQ0FBVSxZQUF0QjtBQUNEOztBQUVELFNBQU8sRUFBUDtBQUNELENBekJEOztBQTJCQSxTQUFTLGNBQVQsQ0FBeUIsSUFBekIsRUFBK0I7QUFDN0IsTUFBSSxNQUFNLEdBQUcsRUFBYjtBQUNBLFNBQU8sSUFBSSxDQUFDLE9BQUwsQ0FBYSxhQUFiLEVBQTRCLFVBQUMsU0FBRCxFQUFlO0FBQ2hELElBQUEsTUFBTSxJQUFJLE1BQU0sZUFBZSxDQUFDLFNBQUQsQ0FBL0I7QUFDQSxXQUFPLEdBQVA7QUFDRCxHQUhNLElBR0YsTUFITDtBQUlEOztBQUVELFNBQVMsZUFBVCxDQUEwQixTQUExQixFQUFxQztBQUNuQyxTQUFPLFNBQVMsQ0FBQyxVQUFWLENBQXFCLENBQXJCLEVBQXdCLFFBQXhCLENBQWlDLEVBQWpDLENBQVA7QUFDRDs7O0FDNUNEO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLE1BQU0sQ0FBQyxPQUFQLEdBQWlCLFNBQVMsdUJBQVQsQ0FBa0MsWUFBbEMsRUFBZ0Q7QUFDL0QsTUFBTSxPQUFPLEdBQUcsWUFBWSxDQUFDLFdBQWIsQ0FBeUIsR0FBekIsQ0FBaEIsQ0FEK0QsQ0FFL0Q7O0FBQ0EsTUFBSSxPQUFPLEtBQUssQ0FBQyxDQUFiLElBQWtCLE9BQU8sS0FBSyxZQUFZLENBQUMsTUFBYixHQUFzQixDQUF4RCxFQUEyRDtBQUN6RCxXQUFPO0FBQ0wsTUFBQSxJQUFJLEVBQUUsWUFERDtBQUVMLE1BQUEsU0FBUyxFQUFFO0FBRk4sS0FBUDtBQUlELEdBTEQsTUFLTztBQUNMLFdBQU87QUFDTCxNQUFBLElBQUksRUFBRSxZQUFZLENBQUMsS0FBYixDQUFtQixDQUFuQixFQUFzQixPQUF0QixDQUREO0FBRUwsTUFBQSxTQUFTLEVBQUUsWUFBWSxDQUFDLEtBQWIsQ0FBbUIsT0FBTyxHQUFHLENBQTdCO0FBRk4sS0FBUDtBQUlEO0FBQ0YsQ0FkRDs7O0FDTkEsSUFBTSx1QkFBdUIsR0FBRyxPQUFPLENBQUMsMkJBQUQsQ0FBdkM7O0FBQ0EsSUFBTSxTQUFTLEdBQUcsT0FBTyxDQUFDLGFBQUQsQ0FBekI7O0FBRUEsTUFBTSxDQUFDLE9BQVAsR0FBaUIsU0FBUyxXQUFULENBQXNCLElBQXRCLEVBQTRCO0FBQzNDLE1BQUksYUFBYSxHQUFHLElBQUksQ0FBQyxJQUFMLEdBQVksdUJBQXVCLENBQUMsSUFBSSxDQUFDLElBQU4sQ0FBdkIsQ0FBbUMsU0FBL0MsR0FBMkQsSUFBL0U7QUFDQSxFQUFBLGFBQWEsR0FBRyxhQUFhLEdBQUcsYUFBYSxDQUFDLFdBQWQsRUFBSCxHQUFpQyxJQUE5RDs7QUFFQSxNQUFJLElBQUksQ0FBQyxJQUFULEVBQWU7QUFDYjtBQUNBLFdBQU8sSUFBSSxDQUFDLElBQVo7QUFDRCxHQUhELE1BR08sSUFBSSxhQUFhLElBQUksU0FBUyxDQUFDLGFBQUQsQ0FBOUIsRUFBK0M7QUFDcEQ7QUFDQSxXQUFPLFNBQVMsQ0FBQyxhQUFELENBQWhCO0FBQ0QsR0FITSxNQUdBO0FBQ0w7QUFDQSxXQUFPLDBCQUFQO0FBQ0Q7QUFDRixDQWREOzs7QUNIQSxNQUFNLENBQUMsT0FBUCxHQUFpQixTQUFTLGFBQVQsQ0FBd0IsR0FBeEIsRUFBNkI7QUFDNUM7QUFDQSxNQUFJLEtBQUssR0FBRyx3REFBWjtBQUNBLE1BQUksSUFBSSxHQUFHLEtBQUssQ0FBQyxJQUFOLENBQVcsR0FBWCxFQUFnQixDQUFoQixDQUFYO0FBQ0EsTUFBSSxjQUFjLEdBQUcsY0FBYyxJQUFkLENBQW1CLEdBQW5CLElBQTBCLElBQTFCLEdBQWlDLEtBQXREO0FBRUEsU0FBVSxjQUFWLFdBQThCLElBQTlCO0FBQ0QsQ0FQRDs7O0FDQUE7QUFDQTtBQUNBO0FBQ0EsTUFBTSxDQUFDLE9BQVAsR0FBaUIsU0FBUyxZQUFULEdBQXlCO0FBQ3hDLE1BQUksSUFBSSxHQUFHLElBQUksSUFBSixFQUFYO0FBQ0EsTUFBSSxLQUFLLEdBQUcsR0FBRyxDQUFDLElBQUksQ0FBQyxRQUFMLEdBQWdCLFFBQWhCLEVBQUQsQ0FBZjtBQUNBLE1BQUksT0FBTyxHQUFHLEdBQUcsQ0FBQyxJQUFJLENBQUMsVUFBTCxHQUFrQixRQUFsQixFQUFELENBQWpCO0FBQ0EsTUFBSSxPQUFPLEdBQUcsR0FBRyxDQUFDLElBQUksQ0FBQyxVQUFMLEdBQWtCLFFBQWxCLEVBQUQsQ0FBakI7QUFDQSxTQUFPLEtBQUssR0FBRyxHQUFSLEdBQWMsT0FBZCxHQUF3QixHQUF4QixHQUE4QixPQUFyQztBQUNELENBTkQ7QUFRQTtBQUNBO0FBQ0E7OztBQUNBLFNBQVMsR0FBVCxDQUFjLEdBQWQsRUFBbUI7QUFDakIsU0FBTyxHQUFHLENBQUMsTUFBSixLQUFlLENBQWYsR0FBbUIsSUFBSSxHQUF2QixHQUE2QixHQUFwQztBQUNEOzs7QUNoQkQsTUFBTSxDQUFDLE9BQVAsR0FBaUIsU0FBUyxHQUFULENBQWMsTUFBZCxFQUFzQixHQUF0QixFQUEyQjtBQUMxQyxTQUFPLE1BQU0sQ0FBQyxTQUFQLENBQWlCLGNBQWpCLENBQWdDLElBQWhDLENBQXFDLE1BQXJDLEVBQTZDLEdBQTdDLENBQVA7QUFDRCxDQUZEOzs7QUNBQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsTUFBTSxDQUFDLE9BQVAsR0FBaUIsU0FBUyxZQUFULENBQXVCLEdBQXZCLEVBQTRCO0FBQzNDLFNBQU8sR0FBRyxJQUFJLE9BQU8sR0FBUCxLQUFlLFFBQXRCLElBQWtDLEdBQUcsQ0FBQyxRQUFKLEtBQWlCLElBQUksQ0FBQyxZQUEvRDtBQUNELENBRkQ7OztBQ0xBLFNBQVMsY0FBVCxDQUF5QixHQUF6QixFQUE4QjtBQUM1QixNQUFJLENBQUMsR0FBTCxFQUFVO0FBQ1IsV0FBTyxLQUFQO0FBQ0Q7O0FBQ0QsU0FBUSxHQUFHLENBQUMsVUFBSixLQUFtQixDQUFuQixJQUF3QixHQUFHLENBQUMsVUFBSixLQUFtQixDQUE1QyxJQUFrRCxHQUFHLENBQUMsTUFBSixLQUFlLENBQXhFO0FBQ0Q7O0FBRUQsTUFBTSxDQUFDLE9BQVAsR0FBaUIsY0FBakI7OztBQ1BBO0FBQ0E7QUFDQTtBQUNBO0FBRUEsTUFBTSxDQUFDLE9BQVAsR0FBaUI7QUFDZixFQUFBLEVBQUUsRUFBRSxlQURXO0FBRWYsRUFBQSxRQUFRLEVBQUUsZUFGSztBQUdmLEVBQUEsR0FBRyxFQUFFLFdBSFU7QUFJZixFQUFBLEdBQUcsRUFBRSxXQUpVO0FBS2YsRUFBQSxHQUFHLEVBQUUsZUFMVTtBQU1mLEVBQUEsR0FBRyxFQUFFLFlBTlU7QUFPZixFQUFBLEdBQUcsRUFBRSxXQVBVO0FBUWYsRUFBQSxHQUFHLEVBQUUsV0FSVTtBQVNmLEVBQUEsSUFBSSxFQUFFLFlBVFM7QUFVZixFQUFBLElBQUksRUFBRSxZQVZTO0FBV2YsRUFBQSxJQUFJLEVBQUUsV0FYUztBQVlmLEVBQUEsR0FBRyxFQUFFLFdBWlU7QUFhZixFQUFBLEdBQUcsRUFBRSxVQWJVO0FBY2YsRUFBQSxHQUFHLEVBQUUsMkJBZFU7QUFlZixFQUFBLEdBQUcsRUFBRSwyQkFmVTtBQWdCZixFQUFBLEdBQUcsRUFBRSxpQkFoQlU7QUFpQmYsRUFBQSxHQUFHLEVBQUUsa0JBakJVO0FBa0JmLEVBQUEsR0FBRyxFQUFFLGtCQWxCVTtBQW1CZixFQUFBLEdBQUcsRUFBRSxpQkFuQlU7QUFvQmYsRUFBQSxHQUFHLEVBQUUsb0JBcEJVO0FBcUJmLEVBQUEsSUFBSSxFQUFFLGtEQXJCUztBQXNCZixFQUFBLElBQUksRUFBRSx5RUF0QlM7QUF1QmYsRUFBQSxHQUFHLEVBQUUsb0JBdkJVO0FBd0JmLEVBQUEsSUFBSSxFQUFFLGtEQXhCUztBQXlCZixFQUFBLElBQUksRUFBRSx5RUF6QlM7QUEwQmYsRUFBQSxHQUFHLEVBQUUsMEJBMUJVO0FBMkJmLEVBQUEsSUFBSSxFQUFFLGdEQTNCUztBQTRCZixFQUFBLEdBQUcsRUFBRSwwQkE1QlU7QUE2QmYsRUFBQSxHQUFHLEVBQUUseUJBN0JVO0FBOEJmLEVBQUEsR0FBRyxFQUFFLDBCQTlCVTtBQStCZixFQUFBLEdBQUcsRUFBRSwwQkEvQlU7QUFnQ2YsRUFBQSxJQUFJLEVBQUUsdURBaENTO0FBaUNmLEVBQUEsSUFBSSxFQUFFLGdEQWpDUztBQWtDZixFQUFBLElBQUksRUFBRSxtRUFsQ1M7QUFtQ2YsRUFBQSxHQUFHLEVBQUUsMEJBbkNVO0FBb0NmLEVBQUEsSUFBSSxFQUFFLG1EQXBDUztBQXFDZixFQUFBLElBQUksRUFBRSxzRUFyQ1M7QUFzQ2YsRUFBQSxHQUFHLEVBQUUsMEJBdENVO0FBdUNmLEVBQUEsR0FBRyxFQUFFLFlBdkNVO0FBd0NmLEVBQUEsSUFBSSxFQUFFLFlBeENTO0FBeUNmLEVBQUEsSUFBSSxFQUFFLFlBekNTO0FBMENmLEVBQUEsR0FBRyxFQUFFLFlBMUNVO0FBMkNmLEVBQUEsR0FBRyxFQUFFO0FBM0NVLENBQWpCOzs7QUNMQSxNQUFNLENBQUMsT0FBUCxHQUFpQixTQUFTLE1BQVQsQ0FBaUIsUUFBakIsRUFBMkI7QUFDMUMsTUFBTSxXQUFXLEdBQUcsRUFBcEI7QUFDQSxNQUFNLFVBQVUsR0FBRyxFQUFuQjs7QUFDQSxXQUFTLFFBQVQsQ0FBbUIsS0FBbkIsRUFBMEI7QUFDeEIsSUFBQSxXQUFXLENBQUMsSUFBWixDQUFpQixLQUFqQjtBQUNEOztBQUNELFdBQVMsUUFBVCxDQUFtQixLQUFuQixFQUEwQjtBQUN4QixJQUFBLFVBQVUsQ0FBQyxJQUFYLENBQWdCLEtBQWhCO0FBQ0Q7O0FBRUQsTUFBTSxJQUFJLEdBQUcsT0FBTyxDQUFDLEdBQVIsQ0FDWCxRQUFRLENBQUMsR0FBVCxDQUFhLFVBQUMsT0FBRDtBQUFBLFdBQWEsT0FBTyxDQUFDLElBQVIsQ0FBYSxRQUFiLEVBQXVCLFFBQXZCLENBQWI7QUFBQSxHQUFiLENBRFcsQ0FBYjtBQUlBLFNBQU8sSUFBSSxDQUFDLElBQUwsQ0FBVSxZQUFNO0FBQ3JCLFdBQU87QUFDTCxNQUFBLFVBQVUsRUFBRSxXQURQO0FBRUwsTUFBQSxNQUFNLEVBQUU7QUFGSCxLQUFQO0FBSUQsR0FMTSxDQUFQO0FBTUQsQ0FwQkQ7OztBQ0FBO0FBQ0E7QUFDQTtBQUNBLE1BQU0sQ0FBQyxPQUFQLEdBQWlCLFNBQVMsT0FBVCxDQUFrQixJQUFsQixFQUF3QjtBQUN2QyxTQUFPLEtBQUssQ0FBQyxTQUFOLENBQWdCLEtBQWhCLENBQXNCLElBQXRCLENBQTJCLElBQUksSUFBSSxFQUFuQyxFQUF1QyxDQUF2QyxDQUFQO0FBQ0QsQ0FGRDs7O0FDSEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7Ozs7Ozs7OztlQ2xDbUIsT0FBTyxDQUFDLFlBQUQsQztJQUFsQixNLFlBQUEsTTs7QUFDUixJQUFNLElBQUksR0FBRyxPQUFPLENBQUMsTUFBRCxDQUFwQjs7QUFDQSxJQUFNLFVBQVUsR0FBRyxPQUFPLENBQUMsNEJBQUQsQ0FBMUI7O2dCQUM0QyxPQUFPLENBQUMsd0JBQUQsQztJQUEzQyxRLGFBQUEsUTtJQUFVLGEsYUFBQSxhO0lBQWUsTSxhQUFBLE07O0FBQ2pDLElBQU0sa0JBQWtCLEdBQUcsT0FBTyxDQUFDLG9DQUFELENBQWxDOztBQUNBLElBQU0sYUFBYSxHQUFHLE9BQU8sQ0FBQywrQkFBRCxDQUE3Qjs7QUFDQSxJQUFNLE1BQU0sR0FBRyxPQUFPLENBQUMsd0JBQUQsQ0FBdEI7O0FBQ0EsSUFBTSxZQUFZLEdBQUcsT0FBTyxDQUFDLDhCQUFELENBQTVCOztBQUNBLElBQU0sZUFBZSxHQUFHLE9BQU8sQ0FBQyxpQ0FBRCxDQUEvQjs7QUFDQSxJQUFNLGdCQUFnQixHQUFHLE9BQU8sQ0FBQyxrQ0FBRCxDQUFoQzs7QUFDQSxJQUFNLFlBQVksR0FBRyxPQUFPLENBQUMsOEJBQUQsQ0FBNUI7O0FBQ0EsSUFBTSxjQUFjLEdBQUcsT0FBTyxDQUFDLGdDQUFELENBQTlCOztBQUVBLFNBQVMsa0JBQVQsQ0FBNkIsR0FBN0IsRUFBa0MsS0FBbEMsRUFBeUM7QUFDdkM7QUFDQSxNQUFJLENBQUMsS0FBTCxFQUFZLEtBQUssR0FBRyxJQUFJLEtBQUosQ0FBVSxjQUFWLENBQVIsQ0FGMkIsQ0FHdkM7O0FBQ0EsTUFBSSxPQUFPLEtBQVAsS0FBaUIsUUFBckIsRUFBK0IsS0FBSyxHQUFHLElBQUksS0FBSixDQUFVLEtBQVYsQ0FBUixDQUpRLENBS3ZDOztBQUNBLE1BQUksRUFBRSxLQUFLLFlBQVksS0FBbkIsQ0FBSixFQUErQjtBQUM3QixJQUFBLEtBQUssR0FBRyxTQUFjLElBQUksS0FBSixDQUFVLGNBQVYsQ0FBZCxFQUF5QztBQUFFLE1BQUEsSUFBSSxFQUFFO0FBQVIsS0FBekMsQ0FBUjtBQUNEOztBQUVELE1BQUksY0FBYyxDQUFDLEdBQUQsQ0FBbEIsRUFBeUI7QUFDdkIsSUFBQSxLQUFLLEdBQUcsSUFBSSxZQUFKLENBQWlCLEtBQWpCLEVBQXdCLEdBQXhCLENBQVI7QUFDQSxXQUFPLEtBQVA7QUFDRDs7QUFFRCxFQUFBLEtBQUssQ0FBQyxPQUFOLEdBQWdCLEdBQWhCO0FBQ0EsU0FBTyxLQUFQO0FBQ0Q7QUFFRDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOzs7QUFDQSxTQUFTLGFBQVQsQ0FBd0IsSUFBeEIsRUFBOEI7QUFDNUIsTUFBTSxtQkFBbUIsR0FBRyxJQUFJLENBQUMsSUFBTCxDQUFVLEtBQVYsQ0FBZ0IsQ0FBaEIsRUFBbUIsSUFBSSxDQUFDLElBQUwsQ0FBVSxJQUE3QixFQUFtQyxJQUFJLENBQUMsSUFBTCxDQUFVLElBQTdDLENBQTVCO0FBQ0EsU0FBTyxtQkFBUDtBQUNEOztBQUVELE1BQU0sQ0FBQyxPQUFQO0FBQUE7O0FBR0UscUJBQWEsSUFBYixFQUFtQixJQUFuQixFQUF5QjtBQUFBOztBQUN2QiwrQkFBTSxJQUFOLEVBQVksSUFBWjtBQUNBLFVBQUssSUFBTCxHQUFZLFVBQVo7QUFDQSxVQUFLLEVBQUwsR0FBVSxNQUFLLElBQUwsQ0FBVSxFQUFWLElBQWdCLFdBQTFCO0FBQ0EsVUFBSyxLQUFMLEdBQWEsV0FBYjtBQUVBLFVBQUssYUFBTCxHQUFxQjtBQUNuQixNQUFBLE9BQU8sRUFBRTtBQUNQLFFBQUEsUUFBUSxFQUFFO0FBREg7QUFEVSxLQUFyQixDQU51QixDQVl2Qjs7QUFDQSxRQUFNLGNBQWMsR0FBRztBQUNyQixNQUFBLFFBQVEsRUFBRSxJQURXO0FBRXJCLE1BQUEsU0FBUyxFQUFFLFNBRlU7QUFHckIsTUFBQSxNQUFNLEVBQUUsTUFIYTtBQUlyQixNQUFBLFVBQVUsRUFBRSxJQUpTO0FBS3JCLE1BQUEsb0JBQW9CLEVBQUUsS0FMRDtBQU1yQixNQUFBLE1BQU0sRUFBRSxLQU5hO0FBT3JCLE1BQUEsT0FBTyxFQUFFLEVBUFk7QUFRckIsTUFBQSxPQUFPLEVBQUUsS0FBSyxJQVJPO0FBU3JCLE1BQUEsS0FBSyxFQUFFLENBVGM7QUFVckIsTUFBQSxlQUFlLEVBQUUsS0FWSTtBQVdyQixNQUFBLFlBQVksRUFBRSxFQVhPOztBQVlyQjtBQUNOO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNNLE1BQUEsZUF0QnFCLDJCQXNCSixZQXRCSSxFQXNCVSxRQXRCVixFQXNCb0I7QUFDdkMsWUFBSSxjQUFjLEdBQUcsRUFBckI7O0FBQ0EsWUFBSTtBQUNGLFVBQUEsY0FBYyxHQUFHLElBQUksQ0FBQyxLQUFMLENBQVcsWUFBWCxDQUFqQjtBQUNELFNBRkQsQ0FFRSxPQUFPLEdBQVAsRUFBWTtBQUNaLFVBQUEsT0FBTyxDQUFDLEdBQVIsQ0FBWSxHQUFaO0FBQ0Q7O0FBRUQsZUFBTyxjQUFQO0FBQ0QsT0EvQm9COztBQWdDckI7QUFDTjtBQUNBO0FBQ0E7QUFDQTtBQUNNLE1BQUEsZ0JBckNxQiw0QkFxQ0gsWUFyQ0csRUFxQ1csUUFyQ1gsRUFxQ3FCO0FBQ3hDLFlBQUksS0FBSyxHQUFHLElBQUksS0FBSixDQUFVLGNBQVYsQ0FBWjs7QUFFQSxZQUFJLGNBQWMsQ0FBQyxRQUFELENBQWxCLEVBQThCO0FBQzVCLFVBQUEsS0FBSyxHQUFHLElBQUksWUFBSixDQUFpQixLQUFqQixFQUF3QixRQUF4QixDQUFSO0FBQ0Q7O0FBRUQsZUFBTyxLQUFQO0FBQ0QsT0E3Q29COztBQThDckI7QUFDTjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDTSxNQUFBLGNBckRxQiwwQkFxREwsTUFyREssRUFxREcsWUFyREgsRUFxRGlCLFFBckRqQixFQXFEMkI7QUFDOUMsZUFBTyxNQUFNLElBQUksR0FBVixJQUFpQixNQUFNLEdBQUcsR0FBakM7QUFDRDtBQXZEb0IsS0FBdkI7QUEwREEsVUFBSyxJQUFMLGdCQUFpQixjQUFqQixFQUFvQyxJQUFwQzs7QUFFQSxVQUFLLFFBQUw7O0FBRUEsVUFBSyxZQUFMLEdBQW9CLE1BQUssWUFBTCxDQUFrQixJQUFsQiwrQkFBcEIsQ0EzRXVCLENBNkV2QjtBQUNBOztBQUNBLFFBQUksTUFBSyxJQUFMLENBQVUsT0FBVixZQUE2QixnQkFBakMsRUFBbUQ7QUFDakQsWUFBSyxRQUFMLEdBQWdCLE1BQUssSUFBTCxDQUFVLE9BQTFCO0FBQ0QsS0FGRCxNQUVPO0FBQ0wsWUFBSyxRQUFMLEdBQWdCLElBQUksZ0JBQUosQ0FBcUIsTUFBSyxJQUFMLENBQVUsS0FBL0IsQ0FBaEI7QUFDRDs7QUFFRCxRQUFJLE1BQUssSUFBTCxDQUFVLE1BQVYsSUFBb0IsQ0FBQyxNQUFLLElBQUwsQ0FBVSxRQUFuQyxFQUE2QztBQUMzQyxZQUFNLElBQUksS0FBSixDQUFVLDZEQUFWLENBQU47QUFDRDs7QUFFRCxVQUFLLGNBQUwsR0FBc0IsTUFBTSxDQUFDLE1BQVAsQ0FBYyxJQUFkLENBQXRCO0FBekZ1QjtBQTBGeEI7O0FBN0ZIOztBQUFBLFNBK0ZFLFVBL0ZGLEdBK0ZFLG9CQUFZLE9BQVosRUFBcUI7QUFDbkIsc0JBQU0sVUFBTixZQUFpQixPQUFqQjs7QUFDQSxTQUFLLFFBQUw7QUFDRCxHQWxHSDs7QUFBQSxTQW9HRSxRQXBHRixHQW9HRSxvQkFBWTtBQUNWLFNBQUssVUFBTCxHQUFrQixJQUFJLFVBQUosQ0FBZSxDQUFDLEtBQUssYUFBTixFQUFxQixLQUFLLElBQUwsQ0FBVSxNQUEvQixFQUF1QyxLQUFLLElBQUwsQ0FBVSxNQUFqRCxDQUFmLENBQWxCO0FBQ0EsU0FBSyxJQUFMLEdBQVksS0FBSyxVQUFMLENBQWdCLFNBQWhCLENBQTBCLElBQTFCLENBQStCLEtBQUssVUFBcEMsQ0FBWjtBQUNBLFNBQUssY0FBTCxHQUhVLENBR1k7QUFDdkIsR0F4R0g7O0FBQUEsU0EwR0UsVUExR0YsR0EwR0Usb0JBQVksSUFBWixFQUFrQjtBQUNoQixRQUFNLFNBQVMsR0FBRyxLQUFLLElBQUwsQ0FBVSxRQUFWLEdBQXFCLFNBQXZDOztBQUNBLFFBQU0sSUFBSSxnQkFDTCxLQUFLLElBREEsRUFFSixTQUFTLElBQUksRUFGVCxFQUdKLElBQUksQ0FBQyxTQUFMLElBQWtCLEVBSGQ7QUFJUixNQUFBLE9BQU8sRUFBRTtBQUpELE1BQVY7O0FBTUEsYUFBYyxJQUFJLENBQUMsT0FBbkIsRUFBNEIsS0FBSyxJQUFMLENBQVUsT0FBdEM7O0FBQ0EsUUFBSSxTQUFKLEVBQWU7QUFDYixlQUFjLElBQUksQ0FBQyxPQUFuQixFQUE0QixTQUFTLENBQUMsT0FBdEM7QUFDRDs7QUFDRCxRQUFJLElBQUksQ0FBQyxTQUFULEVBQW9CO0FBQ2xCLGVBQWMsSUFBSSxDQUFDLE9BQW5CLEVBQTRCLElBQUksQ0FBQyxTQUFMLENBQWUsT0FBM0M7QUFDRDs7QUFFRCxXQUFPLElBQVA7QUFDRCxHQTNISDs7QUFBQSxTQTZIRSxXQTdIRixHQTZIRSxxQkFBYSxRQUFiLEVBQXVCLElBQXZCLEVBQTZCLElBQTdCLEVBQW1DO0FBQ2pDLFFBQU0sVUFBVSxHQUFHLEtBQUssQ0FBQyxPQUFOLENBQWMsSUFBSSxDQUFDLFVBQW5CLElBQ2YsSUFBSSxDQUFDLFVBRFUsQ0FFakI7QUFGaUIsTUFHZixNQUFNLENBQUMsSUFBUCxDQUFZLElBQVosQ0FISjtBQUlBLElBQUEsVUFBVSxDQUFDLE9BQVgsQ0FBbUIsVUFBQyxJQUFELEVBQVU7QUFDM0IsTUFBQSxRQUFRLENBQUMsTUFBVCxDQUFnQixJQUFoQixFQUFzQixJQUFJLENBQUMsSUFBRCxDQUExQjtBQUNELEtBRkQ7QUFHRCxHQXJJSDs7QUFBQSxTQXVJRSxvQkF2SUYsR0F1SUUsOEJBQXNCLElBQXRCLEVBQTRCLElBQTVCLEVBQWtDO0FBQ2hDLFFBQU0sUUFBUSxHQUFHLElBQUksUUFBSixFQUFqQjtBQUVBLFNBQUssV0FBTCxDQUFpQixRQUFqQixFQUEyQixJQUFJLENBQUMsSUFBaEMsRUFBc0MsSUFBdEM7QUFFQSxRQUFNLG1CQUFtQixHQUFHLGFBQWEsQ0FBQyxJQUFELENBQXpDOztBQUVBLFFBQUksSUFBSSxDQUFDLElBQVQsRUFBZTtBQUNiLE1BQUEsUUFBUSxDQUFDLE1BQVQsQ0FBZ0IsSUFBSSxDQUFDLFNBQXJCLEVBQWdDLG1CQUFoQyxFQUFxRCxJQUFJLENBQUMsSUFBTCxDQUFVLElBQS9EO0FBQ0QsS0FGRCxNQUVPO0FBQ0wsTUFBQSxRQUFRLENBQUMsTUFBVCxDQUFnQixJQUFJLENBQUMsU0FBckIsRUFBZ0MsbUJBQWhDO0FBQ0Q7O0FBRUQsV0FBTyxRQUFQO0FBQ0QsR0FySkg7O0FBQUEsU0F1SkUsbUJBdkpGLEdBdUpFLDZCQUFxQixLQUFyQixFQUE0QixJQUE1QixFQUFrQztBQUFBOztBQUNoQyxRQUFNLFFBQVEsR0FBRyxJQUFJLFFBQUosRUFBakI7O0FBRGdDLDhCQUdmLEtBQUssSUFBTCxDQUFVLFFBQVYsRUFIZTtBQUFBLFFBR3hCLElBSHdCLHVCQUd4QixJQUh3Qjs7QUFJaEMsU0FBSyxXQUFMLENBQWlCLFFBQWpCLEVBQTJCLElBQTNCLEVBQWlDLElBQWpDO0FBRUEsSUFBQSxLQUFLLENBQUMsT0FBTixDQUFjLFVBQUMsSUFBRCxFQUFVO0FBQ3RCLFVBQU0sSUFBSSxHQUFHLE1BQUksQ0FBQyxVQUFMLENBQWdCLElBQWhCLENBQWI7O0FBRUEsVUFBTSxtQkFBbUIsR0FBRyxhQUFhLENBQUMsSUFBRCxDQUF6Qzs7QUFFQSxVQUFJLElBQUksQ0FBQyxJQUFULEVBQWU7QUFDYixRQUFBLFFBQVEsQ0FBQyxNQUFULENBQWdCLElBQUksQ0FBQyxTQUFyQixFQUFnQyxtQkFBaEMsRUFBcUQsSUFBSSxDQUFDLElBQTFEO0FBQ0QsT0FGRCxNQUVPO0FBQ0wsUUFBQSxRQUFRLENBQUMsTUFBVCxDQUFnQixJQUFJLENBQUMsU0FBckIsRUFBZ0MsbUJBQWhDO0FBQ0Q7QUFDRixLQVZEO0FBWUEsV0FBTyxRQUFQO0FBQ0QsR0ExS0g7O0FBQUEsU0E0S0UsZ0JBNUtGLEdBNEtFLDBCQUFrQixJQUFsQixFQUF3QixJQUF4QixFQUE4QjtBQUM1QixXQUFPLElBQUksQ0FBQyxJQUFaO0FBQ0QsR0E5S0g7O0FBQUEsU0FnTEUsTUFoTEYsR0FnTEUsZ0JBQVEsSUFBUixFQUFjLE9BQWQsRUFBdUIsS0FBdkIsRUFBOEI7QUFBQTs7QUFDNUIsUUFBTSxJQUFJLEdBQUcsS0FBSyxVQUFMLENBQWdCLElBQWhCLENBQWI7QUFFQSxTQUFLLElBQUwsQ0FBVSxHQUFWLGdCQUEyQixPQUEzQixZQUF5QyxLQUF6QztBQUNBLFdBQU8sSUFBSSxPQUFKLENBQVksVUFBQyxPQUFELEVBQVUsTUFBVixFQUFxQjtBQUN0QyxNQUFBLE1BQUksQ0FBQyxJQUFMLENBQVUsSUFBVixDQUFlLGdCQUFmLEVBQWlDLElBQWpDOztBQUVBLFVBQU0sSUFBSSxHQUFHLElBQUksQ0FBQyxRQUFMLEdBQ1QsTUFBSSxDQUFDLG9CQUFMLENBQTBCLElBQTFCLEVBQWdDLElBQWhDLENBRFMsR0FFVCxNQUFJLENBQUMsZ0JBQUwsQ0FBc0IsSUFBdEIsRUFBNEIsSUFBNUIsQ0FGSjtBQUlBLFVBQU0sR0FBRyxHQUFHLElBQUksY0FBSixFQUFaO0FBQ0EsTUFBQSxNQUFJLENBQUMsY0FBTCxDQUFvQixJQUFJLENBQUMsRUFBekIsSUFBK0IsSUFBSSxZQUFKLENBQWlCLE1BQUksQ0FBQyxJQUF0QixDQUEvQjtBQUVBLFVBQU0sS0FBSyxHQUFHLElBQUksZUFBSixDQUFvQixJQUFJLENBQUMsT0FBekIsRUFBa0MsWUFBTTtBQUNwRCxRQUFBLEdBQUcsQ0FBQyxLQUFKO0FBQ0EsUUFBQSxhQUFhLENBQUMsSUFBZDtBQUNBLFlBQU0sS0FBSyxHQUFHLElBQUksS0FBSixDQUFVLE1BQUksQ0FBQyxJQUFMLENBQVUsVUFBVixFQUFzQjtBQUFFLFVBQUEsT0FBTyxFQUFFLElBQUksQ0FBQyxJQUFMLENBQVUsSUFBSSxDQUFDLE9BQUwsR0FBZSxJQUF6QjtBQUFYLFNBQXRCLENBQVYsQ0FBZDs7QUFDQSxRQUFBLE1BQUksQ0FBQyxJQUFMLENBQVUsSUFBVixDQUFlLGNBQWYsRUFBK0IsSUFBL0IsRUFBcUMsS0FBckM7O0FBQ0EsUUFBQSxNQUFNLENBQUMsS0FBRCxDQUFOO0FBQ0QsT0FOYSxDQUFkO0FBUUEsVUFBTSxFQUFFLEdBQUcsSUFBSSxFQUFmO0FBRUEsTUFBQSxHQUFHLENBQUMsTUFBSixDQUFXLGdCQUFYLENBQTRCLFdBQTVCLEVBQXlDLFVBQUMsRUFBRCxFQUFRO0FBQy9DLFFBQUEsTUFBSSxDQUFDLElBQUwsQ0FBVSxHQUFWLGtCQUE2QixFQUE3QjtBQUNELE9BRkQ7QUFJQSxNQUFBLEdBQUcsQ0FBQyxNQUFKLENBQVcsZ0JBQVgsQ0FBNEIsVUFBNUIsRUFBd0MsVUFBQyxFQUFELEVBQVE7QUFDOUMsUUFBQSxNQUFJLENBQUMsSUFBTCxDQUFVLEdBQVYsa0JBQTZCLEVBQTdCLG1CQUE2QyxFQUFFLENBQUMsTUFBaEQsV0FBNEQsRUFBRSxDQUFDLEtBQS9ELEVBRDhDLENBRTlDO0FBQ0E7OztBQUNBLFFBQUEsS0FBSyxDQUFDLFFBQU47O0FBRUEsWUFBSSxFQUFFLENBQUMsZ0JBQVAsRUFBeUI7QUFDdkIsVUFBQSxNQUFJLENBQUMsSUFBTCxDQUFVLElBQVYsQ0FBZSxpQkFBZixFQUFrQyxJQUFsQyxFQUF3QztBQUN0QyxZQUFBLFFBQVEsRUFBRSxNQUQ0QjtBQUV0QyxZQUFBLGFBQWEsRUFBRSxFQUFFLENBQUMsTUFGb0I7QUFHdEMsWUFBQSxVQUFVLEVBQUUsRUFBRSxDQUFDO0FBSHVCLFdBQXhDO0FBS0Q7QUFDRixPQWJEO0FBZUEsTUFBQSxHQUFHLENBQUMsZ0JBQUosQ0FBcUIsTUFBckIsRUFBNkIsVUFBQyxFQUFELEVBQVE7QUFDbkMsUUFBQSxNQUFJLENBQUMsSUFBTCxDQUFVLEdBQVYsa0JBQTZCLEVBQTdCOztBQUNBLFFBQUEsS0FBSyxDQUFDLElBQU47QUFDQSxRQUFBLGFBQWEsQ0FBQyxJQUFkOztBQUNBLFlBQUksTUFBSSxDQUFDLGNBQUwsQ0FBb0IsSUFBSSxDQUFDLEVBQXpCLENBQUosRUFBa0M7QUFDaEMsVUFBQSxNQUFJLENBQUMsY0FBTCxDQUFvQixJQUFJLENBQUMsRUFBekIsRUFBNkIsTUFBN0I7O0FBQ0EsVUFBQSxNQUFJLENBQUMsY0FBTCxDQUFvQixJQUFJLENBQUMsRUFBekIsSUFBK0IsSUFBL0I7QUFDRDs7QUFFRCxZQUFJLElBQUksQ0FBQyxjQUFMLENBQW9CLEVBQUUsQ0FBQyxNQUFILENBQVUsTUFBOUIsRUFBc0MsR0FBRyxDQUFDLFlBQTFDLEVBQXdELEdBQXhELENBQUosRUFBa0U7QUFDaEUsY0FBTSxJQUFJLEdBQUcsSUFBSSxDQUFDLGVBQUwsQ0FBcUIsR0FBRyxDQUFDLFlBQXpCLEVBQXVDLEdBQXZDLENBQWI7QUFDQSxjQUFNLFNBQVMsR0FBRyxJQUFJLENBQUMsSUFBSSxDQUFDLG9CQUFOLENBQXRCO0FBRUEsY0FBTSxVQUFVLEdBQUc7QUFDakIsWUFBQSxNQUFNLEVBQUUsRUFBRSxDQUFDLE1BQUgsQ0FBVSxNQUREO0FBRWpCLFlBQUEsSUFBSSxFQUFKLElBRmlCO0FBR2pCLFlBQUEsU0FBUyxFQUFUO0FBSGlCLFdBQW5COztBQU1BLFVBQUEsTUFBSSxDQUFDLElBQUwsQ0FBVSxJQUFWLENBQWUsZ0JBQWYsRUFBaUMsSUFBakMsRUFBdUMsVUFBdkM7O0FBRUEsY0FBSSxTQUFKLEVBQWU7QUFDYixZQUFBLE1BQUksQ0FBQyxJQUFMLENBQVUsR0FBVixlQUEwQixJQUFJLENBQUMsSUFBL0IsY0FBNEMsU0FBNUM7QUFDRDs7QUFFRCxpQkFBTyxPQUFPLENBQUMsSUFBRCxDQUFkO0FBQ0QsU0FqQkQsTUFpQk87QUFDTCxjQUFNLEtBQUksR0FBRyxJQUFJLENBQUMsZUFBTCxDQUFxQixHQUFHLENBQUMsWUFBekIsRUFBdUMsR0FBdkMsQ0FBYjs7QUFDQSxjQUFNLEtBQUssR0FBRyxrQkFBa0IsQ0FBQyxHQUFELEVBQU0sSUFBSSxDQUFDLGdCQUFMLENBQXNCLEdBQUcsQ0FBQyxZQUExQixFQUF3QyxHQUF4QyxDQUFOLENBQWhDO0FBRUEsY0FBTSxRQUFRLEdBQUc7QUFDZixZQUFBLE1BQU0sRUFBRSxFQUFFLENBQUMsTUFBSCxDQUFVLE1BREg7QUFFZixZQUFBLElBQUksRUFBSjtBQUZlLFdBQWpCOztBQUtBLFVBQUEsTUFBSSxDQUFDLElBQUwsQ0FBVSxJQUFWLENBQWUsY0FBZixFQUErQixJQUEvQixFQUFxQyxLQUFyQyxFQUE0QyxRQUE1Qzs7QUFDQSxpQkFBTyxNQUFNLENBQUMsS0FBRCxDQUFiO0FBQ0Q7QUFDRixPQXRDRDtBQXdDQSxNQUFBLEdBQUcsQ0FBQyxnQkFBSixDQUFxQixPQUFyQixFQUE4QixVQUFDLEVBQUQsRUFBUTtBQUNwQyxRQUFBLE1BQUksQ0FBQyxJQUFMLENBQVUsR0FBVixrQkFBNkIsRUFBN0I7O0FBQ0EsUUFBQSxLQUFLLENBQUMsSUFBTjtBQUNBLFFBQUEsYUFBYSxDQUFDLElBQWQ7O0FBQ0EsWUFBSSxNQUFJLENBQUMsY0FBTCxDQUFvQixJQUFJLENBQUMsRUFBekIsQ0FBSixFQUFrQztBQUNoQyxVQUFBLE1BQUksQ0FBQyxjQUFMLENBQW9CLElBQUksQ0FBQyxFQUF6QixFQUE2QixNQUE3Qjs7QUFDQSxVQUFBLE1BQUksQ0FBQyxjQUFMLENBQW9CLElBQUksQ0FBQyxFQUF6QixJQUErQixJQUEvQjtBQUNEOztBQUVELFlBQU0sS0FBSyxHQUFHLGtCQUFrQixDQUFDLEdBQUQsRUFBTSxJQUFJLENBQUMsZ0JBQUwsQ0FBc0IsR0FBRyxDQUFDLFlBQTFCLEVBQXdDLEdBQXhDLENBQU4sQ0FBaEM7O0FBQ0EsUUFBQSxNQUFJLENBQUMsSUFBTCxDQUFVLElBQVYsQ0FBZSxjQUFmLEVBQStCLElBQS9CLEVBQXFDLEtBQXJDOztBQUNBLGVBQU8sTUFBTSxDQUFDLEtBQUQsQ0FBYjtBQUNELE9BWkQ7QUFjQSxNQUFBLEdBQUcsQ0FBQyxJQUFKLENBQVMsSUFBSSxDQUFDLE1BQUwsQ0FBWSxXQUFaLEVBQVQsRUFBb0MsSUFBSSxDQUFDLFFBQXpDLEVBQW1ELElBQW5ELEVBN0ZzQyxDQThGdEM7QUFDQTs7QUFDQSxNQUFBLEdBQUcsQ0FBQyxlQUFKLEdBQXNCLElBQUksQ0FBQyxlQUEzQjs7QUFDQSxVQUFJLElBQUksQ0FBQyxZQUFMLEtBQXNCLEVBQTFCLEVBQThCO0FBQzVCLFFBQUEsR0FBRyxDQUFDLFlBQUosR0FBbUIsSUFBSSxDQUFDLFlBQXhCO0FBQ0Q7O0FBRUQsTUFBQSxNQUFNLENBQUMsSUFBUCxDQUFZLElBQUksQ0FBQyxPQUFqQixFQUEwQixPQUExQixDQUFrQyxVQUFDLE1BQUQsRUFBWTtBQUM1QyxRQUFBLEdBQUcsQ0FBQyxnQkFBSixDQUFxQixNQUFyQixFQUE2QixJQUFJLENBQUMsT0FBTCxDQUFhLE1BQWIsQ0FBN0I7QUFDRCxPQUZEOztBQUlBLFVBQU0sYUFBYSxHQUFHLE1BQUksQ0FBQyxRQUFMLENBQWMsR0FBZCxDQUFrQixZQUFNO0FBQzVDLFFBQUEsR0FBRyxDQUFDLElBQUosQ0FBUyxJQUFUO0FBQ0EsZUFBTyxZQUFNO0FBQ1gsVUFBQSxLQUFLLENBQUMsSUFBTjtBQUNBLFVBQUEsR0FBRyxDQUFDLEtBQUo7QUFDRCxTQUhEO0FBSUQsT0FOcUIsQ0FBdEI7O0FBUUEsTUFBQSxNQUFJLENBQUMsWUFBTCxDQUFrQixJQUFJLENBQUMsRUFBdkIsRUFBMkIsWUFBTTtBQUMvQixRQUFBLGFBQWEsQ0FBQyxLQUFkO0FBQ0EsUUFBQSxNQUFNLENBQUMsSUFBSSxLQUFKLENBQVUsY0FBVixDQUFELENBQU47QUFDRCxPQUhEOztBQUtBLE1BQUEsTUFBSSxDQUFDLFdBQUwsQ0FBaUIsSUFBSSxDQUFDLEVBQXRCLEVBQTBCLFlBQU07QUFDOUIsUUFBQSxhQUFhLENBQUMsS0FBZDtBQUNBLFFBQUEsTUFBTSxDQUFDLElBQUksS0FBSixDQUFVLGtCQUFWLENBQUQsQ0FBTjtBQUNELE9BSEQ7QUFJRCxLQTFITSxDQUFQO0FBMkhELEdBL1NIOztBQUFBLFNBaVRFLFlBalRGLEdBaVRFLHNCQUFjLElBQWQsRUFBb0IsT0FBcEIsRUFBNkIsS0FBN0IsRUFBb0M7QUFBQTs7QUFDbEMsUUFBTSxJQUFJLEdBQUcsS0FBSyxVQUFMLENBQWdCLElBQWhCLENBQWI7QUFDQSxXQUFPLElBQUksT0FBSixDQUFZLFVBQUMsT0FBRCxFQUFVLE1BQVYsRUFBcUI7QUFDdEMsTUFBQSxNQUFJLENBQUMsSUFBTCxDQUFVLElBQVYsQ0FBZSxnQkFBZixFQUFpQyxJQUFqQzs7QUFFQSxVQUFNLE1BQU0sR0FBRyxFQUFmO0FBQ0EsVUFBTSxVQUFVLEdBQUcsS0FBSyxDQUFDLE9BQU4sQ0FBYyxJQUFJLENBQUMsVUFBbkIsSUFDZixJQUFJLENBQUMsVUFEVSxDQUVqQjtBQUZpQixRQUdmLE1BQU0sQ0FBQyxJQUFQLENBQVksSUFBSSxDQUFDLElBQWpCLENBSEo7QUFLQSxNQUFBLFVBQVUsQ0FBQyxPQUFYLENBQW1CLFVBQUMsSUFBRCxFQUFVO0FBQzNCLFFBQUEsTUFBTSxDQUFDLElBQUQsQ0FBTixHQUFlLElBQUksQ0FBQyxJQUFMLENBQVUsSUFBVixDQUFmO0FBQ0QsT0FGRDtBQUlBLFVBQU0sTUFBTSxHQUFHLElBQUksQ0FBQyxNQUFMLENBQVksZUFBWixDQUE0QixRQUE1QixHQUF1QyxRQUF2QyxHQUFrRCxhQUFqRTtBQUNBLFVBQU0sTUFBTSxHQUFHLElBQUksTUFBSixDQUFXLE1BQUksQ0FBQyxJQUFoQixFQUFzQixJQUFJLENBQUMsTUFBTCxDQUFZLGVBQWxDLENBQWY7QUFDQSxNQUFBLE1BQU0sQ0FBQyxJQUFQLENBQVksSUFBSSxDQUFDLE1BQUwsQ0FBWSxHQUF4QixlQUNLLElBQUksQ0FBQyxNQUFMLENBQVksSUFEakI7QUFFRSxRQUFBLFFBQVEsRUFBRSxJQUFJLENBQUMsUUFGakI7QUFHRSxRQUFBLElBQUksRUFBRSxJQUFJLENBQUMsSUFBTCxDQUFVLElBSGxCO0FBSUUsUUFBQSxTQUFTLEVBQUUsSUFBSSxDQUFDLFNBSmxCO0FBS0UsUUFBQSxRQUFRLEVBQUUsTUFMWjtBQU1FLFFBQUEsVUFBVSxFQUFFLElBQUksQ0FBQyxNQU5uQjtBQU9FLFFBQUEsV0FBVyxFQUFFLElBQUksQ0FBQyxRQVBwQjtBQVFFLFFBQUEsT0FBTyxFQUFFLElBQUksQ0FBQztBQVJoQixVQVNHLElBVEgsQ0FTUSxVQUFDLEdBQUQsRUFBUztBQUNmLFlBQU0sS0FBSyxHQUFHLEdBQUcsQ0FBQyxLQUFsQjtBQUNBLFlBQU0sSUFBSSxHQUFHLGFBQWEsQ0FBQyxJQUFJLENBQUMsTUFBTCxDQUFZLFlBQWIsQ0FBMUI7QUFDQSxZQUFNLE1BQU0sR0FBRyxJQUFJLE1BQUosQ0FBVztBQUFFLFVBQUEsTUFBTSxFQUFLLElBQUwsYUFBaUIsS0FBekI7QUFBa0MsVUFBQSxRQUFRLEVBQUU7QUFBNUMsU0FBWCxDQUFmO0FBQ0EsUUFBQSxNQUFJLENBQUMsY0FBTCxDQUFvQixJQUFJLENBQUMsRUFBekIsSUFBK0IsSUFBSSxZQUFKLENBQWlCLE1BQUksQ0FBQyxJQUF0QixDQUEvQjs7QUFFQSxRQUFBLE1BQUksQ0FBQyxZQUFMLENBQWtCLElBQUksQ0FBQyxFQUF2QixFQUEyQixZQUFNO0FBQy9CLFVBQUEsTUFBTSxDQUFDLElBQVAsQ0FBWSxPQUFaLEVBQXFCLEVBQXJCO0FBQ0EsVUFBQSxhQUFhLENBQUMsS0FBZDtBQUNBLFVBQUEsT0FBTyxhQUFXLElBQUksQ0FBQyxFQUFoQixrQkFBUDtBQUNELFNBSkQ7O0FBTUEsUUFBQSxNQUFJLENBQUMsV0FBTCxDQUFpQixJQUFJLENBQUMsRUFBdEIsRUFBMEIsWUFBTTtBQUM5QixVQUFBLE1BQU0sQ0FBQyxJQUFQLENBQVksT0FBWixFQUFxQixFQUFyQjtBQUNBLFVBQUEsYUFBYSxDQUFDLEtBQWQ7QUFDQSxVQUFBLE9BQU8sYUFBVyxJQUFJLENBQUMsRUFBaEIsbUJBQVA7QUFDRCxTQUpEOztBQU1BLFFBQUEsTUFBSSxDQUFDLE9BQUwsQ0FBYSxJQUFJLENBQUMsRUFBbEIsRUFBc0IsWUFBTTtBQUMxQixVQUFBLE1BQU0sQ0FBQyxJQUFQLENBQVksT0FBWixFQUFxQixFQUFyQjtBQUNBLFVBQUEsTUFBTSxDQUFDLElBQVAsQ0FBWSxRQUFaLEVBQXNCLEVBQXRCO0FBQ0QsU0FIRDs7QUFLQSxRQUFBLE1BQUksQ0FBQyxVQUFMLENBQWdCLElBQUksQ0FBQyxFQUFyQixFQUF5QixZQUFNO0FBQzdCLFVBQUEsTUFBTSxDQUFDLElBQVAsQ0FBWSxPQUFaLEVBQXFCLEVBQXJCO0FBQ0EsVUFBQSxNQUFNLENBQUMsSUFBUCxDQUFZLFFBQVosRUFBc0IsRUFBdEI7QUFDRCxTQUhEOztBQUtBLFFBQUEsTUFBTSxDQUFDLEVBQVAsQ0FBVSxVQUFWLEVBQXNCLFVBQUMsWUFBRDtBQUFBLGlCQUFrQixrQkFBa0IsQ0FBQyxNQUFELEVBQU8sWUFBUCxFQUFxQixJQUFyQixDQUFwQztBQUFBLFNBQXRCO0FBRUEsUUFBQSxNQUFNLENBQUMsRUFBUCxDQUFVLFNBQVYsRUFBcUIsVUFBQyxJQUFELEVBQVU7QUFDN0IsY0FBTSxJQUFJLEdBQUcsSUFBSSxDQUFDLGVBQUwsQ0FBcUIsSUFBSSxDQUFDLFFBQUwsQ0FBYyxZQUFuQyxFQUFpRCxJQUFJLENBQUMsUUFBdEQsQ0FBYjtBQUNBLGNBQU0sU0FBUyxHQUFHLElBQUksQ0FBQyxJQUFJLENBQUMsb0JBQU4sQ0FBdEI7QUFFQSxjQUFNLFVBQVUsR0FBRztBQUNqQixZQUFBLE1BQU0sRUFBRSxJQUFJLENBQUMsUUFBTCxDQUFjLE1BREw7QUFFakIsWUFBQSxJQUFJLEVBQUosSUFGaUI7QUFHakIsWUFBQSxTQUFTLEVBQVQ7QUFIaUIsV0FBbkI7O0FBTUEsVUFBQSxNQUFJLENBQUMsSUFBTCxDQUFVLElBQVYsQ0FBZSxnQkFBZixFQUFpQyxJQUFqQyxFQUF1QyxVQUF2Qzs7QUFDQSxVQUFBLGFBQWEsQ0FBQyxJQUFkOztBQUNBLGNBQUksTUFBSSxDQUFDLGNBQUwsQ0FBb0IsSUFBSSxDQUFDLEVBQXpCLENBQUosRUFBa0M7QUFDaEMsWUFBQSxNQUFJLENBQUMsY0FBTCxDQUFvQixJQUFJLENBQUMsRUFBekIsRUFBNkIsTUFBN0I7O0FBQ0EsWUFBQSxNQUFJLENBQUMsY0FBTCxDQUFvQixJQUFJLENBQUMsRUFBekIsSUFBK0IsSUFBL0I7QUFDRDs7QUFDRCxpQkFBTyxPQUFPLEVBQWQ7QUFDRCxTQWpCRDtBQW1CQSxRQUFBLE1BQU0sQ0FBQyxFQUFQLENBQVUsT0FBVixFQUFtQixVQUFDLE9BQUQsRUFBYTtBQUM5QixjQUFNLElBQUksR0FBRyxPQUFPLENBQUMsUUFBckI7QUFDQSxjQUFNLEtBQUssR0FBRyxJQUFJLEdBQ2QsSUFBSSxDQUFDLGdCQUFMLENBQXNCLElBQUksQ0FBQyxZQUEzQixFQUF5QyxJQUF6QyxDQURjLEdBRWQsU0FBYyxJQUFJLEtBQUosQ0FBVSxPQUFPLENBQUMsS0FBUixDQUFjLE9BQXhCLENBQWQsRUFBZ0Q7QUFBRSxZQUFBLEtBQUssRUFBRSxPQUFPLENBQUM7QUFBakIsV0FBaEQsQ0FGSjs7QUFHQSxVQUFBLE1BQUksQ0FBQyxJQUFMLENBQVUsSUFBVixDQUFlLGNBQWYsRUFBK0IsSUFBL0IsRUFBcUMsS0FBckM7O0FBQ0EsVUFBQSxhQUFhLENBQUMsSUFBZDs7QUFDQSxjQUFJLE1BQUksQ0FBQyxjQUFMLENBQW9CLElBQUksQ0FBQyxFQUF6QixDQUFKLEVBQWtDO0FBQ2hDLFlBQUEsTUFBSSxDQUFDLGNBQUwsQ0FBb0IsSUFBSSxDQUFDLEVBQXpCLEVBQTZCLE1BQTdCOztBQUNBLFlBQUEsTUFBSSxDQUFDLGNBQUwsQ0FBb0IsSUFBSSxDQUFDLEVBQXpCLElBQStCLElBQS9CO0FBQ0Q7O0FBQ0QsVUFBQSxNQUFNLENBQUMsS0FBRCxDQUFOO0FBQ0QsU0FaRDs7QUFjQSxZQUFNLGFBQWEsR0FBRyxNQUFJLENBQUMsUUFBTCxDQUFjLEdBQWQsQ0FBa0IsWUFBTTtBQUM1QyxVQUFBLE1BQU0sQ0FBQyxJQUFQOztBQUNBLGNBQUksSUFBSSxDQUFDLFFBQVQsRUFBbUI7QUFDakIsWUFBQSxNQUFNLENBQUMsSUFBUCxDQUFZLE9BQVosRUFBcUIsRUFBckI7QUFDRDs7QUFFRCxpQkFBTztBQUFBLG1CQUFNLE1BQU0sQ0FBQyxLQUFQLEVBQU47QUFBQSxXQUFQO0FBQ0QsU0FQcUIsQ0FBdEI7QUFRRCxPQWhGRCxFQWdGRyxLQWhGSCxDQWdGUyxVQUFDLEdBQUQsRUFBUztBQUNoQixRQUFBLE1BQUksQ0FBQyxJQUFMLENBQVUsSUFBVixDQUFlLGNBQWYsRUFBK0IsSUFBL0IsRUFBcUMsR0FBckM7O0FBQ0EsUUFBQSxNQUFNLENBQUMsR0FBRCxDQUFOO0FBQ0QsT0FuRkQ7QUFvRkQsS0FuR00sQ0FBUDtBQW9HRCxHQXZaSDs7QUFBQSxTQXlaRSxZQXpaRixHQXlaRSxzQkFBYyxLQUFkLEVBQXFCO0FBQUE7O0FBQ25CLFdBQU8sSUFBSSxPQUFKLENBQVksVUFBQyxPQUFELEVBQVUsTUFBVixFQUFxQjtBQUN0QyxVQUFNLFFBQVEsR0FBRyxNQUFJLENBQUMsSUFBTCxDQUFVLFFBQTNCO0FBQ0EsVUFBTSxNQUFNLEdBQUcsTUFBSSxDQUFDLElBQUwsQ0FBVSxNQUF6Qjs7QUFFQSxVQUFNLGFBQWEsR0FBRyxNQUFJLENBQUMsSUFBTCxDQUFVLFFBQVYsR0FBcUIsU0FBM0M7O0FBQ0EsVUFBTSxRQUFRLEdBQUcsTUFBSSxDQUFDLG1CQUFMLENBQXlCLEtBQXpCLGVBQ1osTUFBSSxDQUFDLElBRE8sRUFFWCxhQUFhLElBQUksRUFGTixFQUFqQjs7QUFLQSxVQUFNLEdBQUcsR0FBRyxJQUFJLGNBQUosRUFBWjtBQUVBLFVBQU0sS0FBSyxHQUFHLElBQUksZUFBSixDQUFvQixNQUFJLENBQUMsSUFBTCxDQUFVLE9BQTlCLEVBQXVDLFlBQU07QUFDekQsUUFBQSxHQUFHLENBQUMsS0FBSjtBQUNBLFlBQU0sS0FBSyxHQUFHLElBQUksS0FBSixDQUFVLE1BQUksQ0FBQyxJQUFMLENBQVUsVUFBVixFQUFzQjtBQUFFLFVBQUEsT0FBTyxFQUFFLElBQUksQ0FBQyxJQUFMLENBQVUsTUFBSSxDQUFDLElBQUwsQ0FBVSxPQUFWLEdBQW9CLElBQTlCO0FBQVgsU0FBdEIsQ0FBVixDQUFkO0FBQ0EsUUFBQSxTQUFTLENBQUMsS0FBRCxDQUFUO0FBQ0EsUUFBQSxNQUFNLENBQUMsS0FBRCxDQUFOO0FBQ0QsT0FMYSxDQUFkOztBQU9BLFVBQU0sU0FBUyxHQUFHLFNBQVosU0FBWSxDQUFDLEtBQUQsRUFBVztBQUMzQixRQUFBLEtBQUssQ0FBQyxPQUFOLENBQWMsVUFBQyxJQUFELEVBQVU7QUFDdEIsVUFBQSxNQUFJLENBQUMsSUFBTCxDQUFVLElBQVYsQ0FBZSxjQUFmLEVBQStCLElBQS9CLEVBQXFDLEtBQXJDO0FBQ0QsU0FGRDtBQUdELE9BSkQ7O0FBTUEsTUFBQSxHQUFHLENBQUMsTUFBSixDQUFXLGdCQUFYLENBQTRCLFdBQTVCLEVBQXlDLFVBQUMsRUFBRCxFQUFRO0FBQy9DLFFBQUEsTUFBSSxDQUFDLElBQUwsQ0FBVSxHQUFWLENBQWMsc0NBQWQ7O0FBQ0EsUUFBQSxLQUFLLENBQUMsUUFBTjtBQUNELE9BSEQ7QUFLQSxNQUFBLEdBQUcsQ0FBQyxNQUFKLENBQVcsZ0JBQVgsQ0FBNEIsVUFBNUIsRUFBd0MsVUFBQyxFQUFELEVBQVE7QUFDOUMsUUFBQSxLQUFLLENBQUMsUUFBTjtBQUVBLFlBQUksQ0FBQyxFQUFFLENBQUMsZ0JBQVIsRUFBMEI7QUFFMUIsUUFBQSxLQUFLLENBQUMsT0FBTixDQUFjLFVBQUMsSUFBRCxFQUFVO0FBQ3RCLFVBQUEsTUFBSSxDQUFDLElBQUwsQ0FBVSxJQUFWLENBQWUsaUJBQWYsRUFBa0MsSUFBbEMsRUFBd0M7QUFDdEMsWUFBQSxRQUFRLEVBQUUsTUFENEI7QUFFdEMsWUFBQSxhQUFhLEVBQUUsRUFBRSxDQUFDLE1BQUgsR0FBWSxFQUFFLENBQUMsS0FBZixHQUF1QixJQUFJLENBQUMsSUFGTDtBQUd0QyxZQUFBLFVBQVUsRUFBRSxJQUFJLENBQUM7QUFIcUIsV0FBeEM7QUFLRCxTQU5EO0FBT0QsT0FaRDtBQWNBLE1BQUEsR0FBRyxDQUFDLGdCQUFKLENBQXFCLE1BQXJCLEVBQTZCLFVBQUMsRUFBRCxFQUFRO0FBQ25DLFFBQUEsS0FBSyxDQUFDLElBQU47O0FBRUEsWUFBSSxNQUFJLENBQUMsSUFBTCxDQUFVLGNBQVYsQ0FBeUIsRUFBRSxDQUFDLE1BQUgsQ0FBVSxNQUFuQyxFQUEyQyxHQUFHLENBQUMsWUFBL0MsRUFBNkQsR0FBN0QsQ0FBSixFQUF1RTtBQUNyRSxjQUFNLElBQUksR0FBRyxNQUFJLENBQUMsSUFBTCxDQUFVLGVBQVYsQ0FBMEIsR0FBRyxDQUFDLFlBQTlCLEVBQTRDLEdBQTVDLENBQWI7O0FBQ0EsY0FBTSxVQUFVLEdBQUc7QUFDakIsWUFBQSxNQUFNLEVBQUUsRUFBRSxDQUFDLE1BQUgsQ0FBVSxNQUREO0FBRWpCLFlBQUEsSUFBSSxFQUFKO0FBRmlCLFdBQW5CO0FBSUEsVUFBQSxLQUFLLENBQUMsT0FBTixDQUFjLFVBQUMsSUFBRCxFQUFVO0FBQ3RCLFlBQUEsTUFBSSxDQUFDLElBQUwsQ0FBVSxJQUFWLENBQWUsZ0JBQWYsRUFBaUMsSUFBakMsRUFBdUMsVUFBdkM7QUFDRCxXQUZEO0FBR0EsaUJBQU8sT0FBTyxFQUFkO0FBQ0Q7O0FBRUQsWUFBTSxLQUFLLEdBQUcsTUFBSSxDQUFDLElBQUwsQ0FBVSxnQkFBVixDQUEyQixHQUFHLENBQUMsWUFBL0IsRUFBNkMsR0FBN0MsS0FBcUQsSUFBSSxLQUFKLENBQVUsY0FBVixDQUFuRTtBQUNBLFFBQUEsS0FBSyxDQUFDLE9BQU4sR0FBZ0IsR0FBaEI7QUFDQSxRQUFBLFNBQVMsQ0FBQyxLQUFELENBQVQ7QUFDQSxlQUFPLE1BQU0sQ0FBQyxLQUFELENBQWI7QUFDRCxPQW5CRDtBQXFCQSxNQUFBLEdBQUcsQ0FBQyxnQkFBSixDQUFxQixPQUFyQixFQUE4QixVQUFDLEVBQUQsRUFBUTtBQUNwQyxRQUFBLEtBQUssQ0FBQyxJQUFOO0FBRUEsWUFBTSxLQUFLLEdBQUcsTUFBSSxDQUFDLElBQUwsQ0FBVSxnQkFBVixDQUEyQixHQUFHLENBQUMsWUFBL0IsRUFBNkMsR0FBN0MsS0FBcUQsSUFBSSxLQUFKLENBQVUsY0FBVixDQUFuRTtBQUNBLFFBQUEsU0FBUyxDQUFDLEtBQUQsQ0FBVDtBQUNBLGVBQU8sTUFBTSxDQUFDLEtBQUQsQ0FBYjtBQUNELE9BTkQ7O0FBUUEsTUFBQSxNQUFJLENBQUMsSUFBTCxDQUFVLEVBQVYsQ0FBYSxZQUFiLEVBQTJCLFlBQU07QUFDL0IsUUFBQSxLQUFLLENBQUMsSUFBTjtBQUNBLFFBQUEsR0FBRyxDQUFDLEtBQUo7QUFDRCxPQUhEOztBQUtBLE1BQUEsR0FBRyxDQUFDLElBQUosQ0FBUyxNQUFNLENBQUMsV0FBUCxFQUFULEVBQStCLFFBQS9CLEVBQXlDLElBQXpDLEVBOUVzQyxDQStFdEM7QUFDQTs7QUFDQSxNQUFBLEdBQUcsQ0FBQyxlQUFKLEdBQXNCLE1BQUksQ0FBQyxJQUFMLENBQVUsZUFBaEM7O0FBQ0EsVUFBSSxNQUFJLENBQUMsSUFBTCxDQUFVLFlBQVYsS0FBMkIsRUFBL0IsRUFBbUM7QUFDakMsUUFBQSxHQUFHLENBQUMsWUFBSixHQUFtQixNQUFJLENBQUMsSUFBTCxDQUFVLFlBQTdCO0FBQ0Q7O0FBRUQsTUFBQSxNQUFNLENBQUMsSUFBUCxDQUFZLE1BQUksQ0FBQyxJQUFMLENBQVUsT0FBdEIsRUFBK0IsT0FBL0IsQ0FBdUMsVUFBQyxNQUFELEVBQVk7QUFDakQsUUFBQSxHQUFHLENBQUMsZ0JBQUosQ0FBcUIsTUFBckIsRUFBNkIsTUFBSSxDQUFDLElBQUwsQ0FBVSxPQUFWLENBQWtCLE1BQWxCLENBQTdCO0FBQ0QsT0FGRDtBQUlBLE1BQUEsR0FBRyxDQUFDLElBQUosQ0FBUyxRQUFUO0FBRUEsTUFBQSxLQUFLLENBQUMsT0FBTixDQUFjLFVBQUMsSUFBRCxFQUFVO0FBQ3RCLFFBQUEsTUFBSSxDQUFDLElBQUwsQ0FBVSxJQUFWLENBQWUsZ0JBQWYsRUFBaUMsSUFBakM7QUFDRCxPQUZEO0FBR0QsS0EvRk0sQ0FBUDtBQWdHRCxHQTFmSDs7QUFBQSxTQTRmRSxXQTVmRixHQTRmRSxxQkFBYSxLQUFiLEVBQW9CO0FBQUE7O0FBQ2xCLFFBQU0sUUFBUSxHQUFHLEtBQUssQ0FBQyxHQUFOLENBQVUsVUFBQyxJQUFELEVBQU8sQ0FBUCxFQUFhO0FBQ3RDLFVBQU0sT0FBTyxHQUFHLFFBQVEsQ0FBQyxDQUFELEVBQUksRUFBSixDQUFSLEdBQWtCLENBQWxDO0FBQ0EsVUFBTSxLQUFLLEdBQUcsS0FBSyxDQUFDLE1BQXBCOztBQUVBLFVBQUksSUFBSSxDQUFDLEtBQVQsRUFBZ0I7QUFDZCxlQUFPLE9BQU8sQ0FBQyxNQUFSLENBQWUsSUFBSSxLQUFKLENBQVUsSUFBSSxDQUFDLEtBQWYsQ0FBZixDQUFQO0FBQ0QsT0FGRCxNQUVPLElBQUksSUFBSSxDQUFDLFFBQVQsRUFBbUI7QUFDeEIsZUFBTyxNQUFJLENBQUMsWUFBTCxDQUFrQixJQUFsQixFQUF3QixPQUF4QixFQUFpQyxLQUFqQyxDQUFQO0FBQ0QsT0FGTSxNQUVBO0FBQ0wsZUFBTyxNQUFJLENBQUMsTUFBTCxDQUFZLElBQVosRUFBa0IsT0FBbEIsRUFBMkIsS0FBM0IsQ0FBUDtBQUNEO0FBQ0YsS0FYZ0IsQ0FBakI7QUFhQSxXQUFPLE1BQU0sQ0FBQyxRQUFELENBQWI7QUFDRCxHQTNnQkg7O0FBQUEsU0E2Z0JFLFlBN2dCRixHQTZnQkUsc0JBQWMsTUFBZCxFQUFzQixFQUF0QixFQUEwQjtBQUN4QixTQUFLLGNBQUwsQ0FBb0IsTUFBcEIsRUFBNEIsRUFBNUIsQ0FBK0IsY0FBL0IsRUFBK0MsVUFBQyxJQUFELEVBQVU7QUFDdkQsVUFBSSxNQUFNLEtBQUssSUFBSSxDQUFDLEVBQXBCLEVBQXdCLEVBQUUsQ0FBQyxJQUFJLENBQUMsRUFBTixDQUFGO0FBQ3pCLEtBRkQ7QUFHRCxHQWpoQkg7O0FBQUEsU0FtaEJFLE9BbmhCRixHQW1oQkUsaUJBQVMsTUFBVCxFQUFpQixFQUFqQixFQUFxQjtBQUNuQixTQUFLLGNBQUwsQ0FBb0IsTUFBcEIsRUFBNEIsRUFBNUIsQ0FBK0IsY0FBL0IsRUFBK0MsVUFBQyxZQUFELEVBQWtCO0FBQy9ELFVBQUksTUFBTSxLQUFLLFlBQWYsRUFBNkI7QUFDM0IsUUFBQSxFQUFFO0FBQ0g7QUFDRixLQUpEO0FBS0QsR0F6aEJIOztBQUFBLFNBMmhCRSxVQTNoQkYsR0EyaEJFLG9CQUFZLE1BQVosRUFBb0IsRUFBcEIsRUFBd0I7QUFBQTs7QUFDdEIsU0FBSyxjQUFMLENBQW9CLE1BQXBCLEVBQTRCLEVBQTVCLENBQStCLFdBQS9CLEVBQTRDLFVBQUMsWUFBRCxFQUFrQjtBQUM1RCxVQUFJLENBQUMsTUFBSSxDQUFDLElBQUwsQ0FBVSxPQUFWLENBQWtCLE1BQWxCLENBQUwsRUFBZ0M7QUFDaEMsTUFBQSxFQUFFO0FBQ0gsS0FIRDtBQUlELEdBaGlCSDs7QUFBQSxTQWtpQkUsV0FsaUJGLEdBa2lCRSxxQkFBYSxNQUFiLEVBQXFCLEVBQXJCLEVBQXlCO0FBQUE7O0FBQ3ZCLFNBQUssY0FBTCxDQUFvQixNQUFwQixFQUE0QixFQUE1QixDQUErQixZQUEvQixFQUE2QyxZQUFNO0FBQ2pELFVBQUksQ0FBQyxNQUFJLENBQUMsSUFBTCxDQUFVLE9BQVYsQ0FBa0IsTUFBbEIsQ0FBTCxFQUFnQztBQUNoQyxNQUFBLEVBQUU7QUFDSCxLQUhEO0FBSUQsR0F2aUJIOztBQUFBLFNBeWlCRSxZQXppQkYsR0F5aUJFLHNCQUFjLE9BQWQsRUFBdUI7QUFBQTs7QUFDckIsUUFBSSxPQUFPLENBQUMsTUFBUixLQUFtQixDQUF2QixFQUEwQjtBQUN4QixXQUFLLElBQUwsQ0FBVSxHQUFWLENBQWMsaUNBQWQ7QUFDQSxhQUFPLE9BQU8sQ0FBQyxPQUFSLEVBQVA7QUFDRCxLQUpvQixDQU1yQjs7O0FBQ0EsUUFBSSxLQUFLLElBQUwsQ0FBVSxLQUFWLEtBQW9CLENBQXBCLElBQXlCLENBQUMsS0FBSyxJQUFMLENBQVUsT0FBeEMsRUFBaUQ7QUFDL0MsV0FBSyxJQUFMLENBQVUsR0FBVixDQUNFLGtQQURGLEVBRUUsU0FGRjtBQUlEOztBQUVELFNBQUssSUFBTCxDQUFVLEdBQVYsQ0FBYywwQkFBZDtBQUNBLFFBQU0sS0FBSyxHQUFHLE9BQU8sQ0FBQyxHQUFSLENBQVksVUFBQyxNQUFEO0FBQUEsYUFBWSxNQUFJLENBQUMsSUFBTCxDQUFVLE9BQVYsQ0FBa0IsTUFBbEIsQ0FBWjtBQUFBLEtBQVosQ0FBZDs7QUFFQSxRQUFJLEtBQUssSUFBTCxDQUFVLE1BQWQsRUFBc0I7QUFDcEI7QUFDQSxVQUFNLGdCQUFnQixHQUFHLEtBQUssQ0FBQyxJQUFOLENBQVcsVUFBQSxJQUFJO0FBQUEsZUFBSSxJQUFJLENBQUMsUUFBVDtBQUFBLE9BQWYsQ0FBekI7O0FBQ0EsVUFBSSxnQkFBSixFQUFzQjtBQUNwQixjQUFNLElBQUksS0FBSixDQUFVLDJEQUFWLENBQU47QUFDRDs7QUFFRCxhQUFPLEtBQUssWUFBTCxDQUFrQixLQUFsQixDQUFQO0FBQ0Q7O0FBRUQsV0FBTyxLQUFLLFdBQUwsQ0FBaUIsS0FBakIsRUFBd0IsSUFBeEIsQ0FBNkI7QUFBQSxhQUFNLElBQU47QUFBQSxLQUE3QixDQUFQO0FBQ0QsR0Fya0JIOztBQUFBLFNBdWtCRSxPQXZrQkYsR0F1a0JFLG1CQUFXO0FBQ1QsUUFBSSxLQUFLLElBQUwsQ0FBVSxNQUFkLEVBQXNCO0FBQUEsaUNBQ0ssS0FBSyxJQUFMLENBQVUsUUFBVixFQURMO0FBQUEsVUFDWixZQURZLHdCQUNaLFlBRFk7O0FBRXBCLFdBQUssSUFBTCxDQUFVLFFBQVYsQ0FBbUI7QUFDakIsUUFBQSxZQUFZLGVBQ1AsWUFETztBQUVWLFVBQUEsc0JBQXNCLEVBQUU7QUFGZDtBQURLLE9BQW5CO0FBTUQ7O0FBRUQsU0FBSyxJQUFMLENBQVUsV0FBVixDQUFzQixLQUFLLFlBQTNCO0FBQ0QsR0FubEJIOztBQUFBLFNBcWxCRSxTQXJsQkYsR0FxbEJFLHFCQUFhO0FBQ1gsUUFBSSxLQUFLLElBQUwsQ0FBVSxNQUFkLEVBQXNCO0FBQUEsaUNBQ0ssS0FBSyxJQUFMLENBQVUsUUFBVixFQURMO0FBQUEsVUFDWixZQURZLHdCQUNaLFlBRFk7O0FBRXBCLFdBQUssSUFBTCxDQUFVLFFBQVYsQ0FBbUI7QUFDakIsUUFBQSxZQUFZLGVBQ1AsWUFETztBQUVWLFVBQUEsc0JBQXNCLEVBQUU7QUFGZDtBQURLLE9BQW5CO0FBTUQ7O0FBRUQsU0FBSyxJQUFMLENBQVUsY0FBVixDQUF5QixLQUFLLFlBQTlCO0FBQ0QsR0FqbUJIOztBQUFBO0FBQUEsRUFBeUMsTUFBekMsVUFDUyxPQURULEdBQ21CLE9BQU8sQ0FBQyxpQkFBRCxDQUFQLENBQTJCLE9BRDlDOzs7QUM3Q0EsT0FBTyxDQUFDLGtCQUFELENBQVA7O0FBQ0EsT0FBTyxDQUFDLGNBQUQsQ0FBUDs7QUFDQSxJQUFNLElBQUksR0FBRyxPQUFPLENBQUMsWUFBRCxDQUFwQjs7QUFDQSxJQUFNLFNBQVMsR0FBRyxPQUFPLENBQUMsa0JBQUQsQ0FBekI7O0FBQ0EsSUFBTSxTQUFTLEdBQUcsT0FBTyxDQUFDLGtCQUFELENBQXpCOztBQUNBLElBQU0sV0FBVyxHQUFHLE9BQU8sQ0FBQyxvQkFBRCxDQUEzQjs7QUFFQSxJQUFNLElBQUksR0FBRyxJQUFJLElBQUosQ0FBUztBQUFFLEVBQUEsS0FBSyxFQUFFLElBQVQ7QUFBZSxFQUFBLFdBQVcsRUFBRTtBQUE1QixDQUFULENBQWI7QUFDQSxJQUFJLENBQUMsR0FBTCxDQUFTLFNBQVQsRUFBb0I7QUFDbEIsRUFBQSxNQUFNLEVBQUUsV0FEVTtBQUVsQixFQUFBLG9CQUFvQixFQUFFO0FBRkosQ0FBcEI7QUFJQSxJQUFJLENBQUMsR0FBTCxDQUFTLFdBQVQsRUFBc0I7QUFDcEIsRUFBQSxNQUFNLEVBQUUsa0JBRFk7QUFFcEIsRUFBQSxlQUFlLEVBQUU7QUFGRyxDQUF0QjtBQUlBLElBQUksQ0FBQyxHQUFMLENBQVMsU0FBVCxFQUFvQjtBQUNsQixFQUFBLFFBQVEsRUFBRSx5Q0FEUTtBQUVsQixFQUFBLFFBQVEsRUFBRSxJQUZRO0FBR2xCLEVBQUEsU0FBUyxFQUFFO0FBSE8sQ0FBcEIsRSxDQU1BOztBQUNBLElBQUksQ0FBQyxFQUFMLENBQVEsZ0JBQVIsRUFBMEIsVUFBQyxJQUFELEVBQU8sUUFBUCxFQUFvQjtBQUM1QyxNQUFNLEdBQUcsR0FBRyxRQUFRLENBQUMsU0FBckI7QUFDQSxNQUFNLFFBQVEsR0FBRyxJQUFJLENBQUMsSUFBdEI7QUFFQSxNQUFNLEVBQUUsR0FBRyxRQUFRLENBQUMsYUFBVCxDQUF1QixJQUF2QixDQUFYO0FBQ0EsTUFBTSxDQUFDLEdBQUcsUUFBUSxDQUFDLGFBQVQsQ0FBdUIsR0FBdkIsQ0FBVjtBQUNBLEVBQUEsQ0FBQyxDQUFDLElBQUYsR0FBUyxHQUFUO0FBQ0EsRUFBQSxDQUFDLENBQUMsTUFBRixHQUFXLFFBQVg7QUFDQSxFQUFBLENBQUMsQ0FBQyxXQUFGLENBQWMsUUFBUSxDQUFDLGNBQVQsQ0FBd0IsUUFBeEIsQ0FBZDtBQUNBLEVBQUEsRUFBRSxDQUFDLFdBQUgsQ0FBZSxDQUFmO0FBRUEsRUFBQSxRQUFRLENBQUMsYUFBVCxDQUF1QixvQkFBdkIsRUFBNkMsV0FBN0MsQ0FBeUQsRUFBekQ7QUFDRCxDQVpEIiwiZmlsZSI6ImdlbmVyYXRlZC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzQ29udGVudCI6WyIoZnVuY3Rpb24oKXtmdW5jdGlvbiByKGUsbix0KXtmdW5jdGlvbiBvKGksZil7aWYoIW5baV0pe2lmKCFlW2ldKXt2YXIgYz1cImZ1bmN0aW9uXCI9PXR5cGVvZiByZXF1aXJlJiZyZXF1aXJlO2lmKCFmJiZjKXJldHVybiBjKGksITApO2lmKHUpcmV0dXJuIHUoaSwhMCk7dmFyIGE9bmV3IEVycm9yKFwiQ2Fubm90IGZpbmQgbW9kdWxlICdcIitpK1wiJ1wiKTt0aHJvdyBhLmNvZGU9XCJNT0RVTEVfTk9UX0ZPVU5EXCIsYX12YXIgcD1uW2ldPXtleHBvcnRzOnt9fTtlW2ldWzBdLmNhbGwocC5leHBvcnRzLGZ1bmN0aW9uKHIpe3ZhciBuPWVbaV1bMV1bcl07cmV0dXJuIG8obnx8cil9LHAscC5leHBvcnRzLHIsZSxuLHQpfXJldHVybiBuW2ldLmV4cG9ydHN9Zm9yKHZhciB1PVwiZnVuY3Rpb25cIj09dHlwZW9mIHJlcXVpcmUmJnJlcXVpcmUsaT0wO2k8dC5sZW5ndGg7aSsrKW8odFtpXSk7cmV0dXJuIG99cmV0dXJuIHJ9KSgpIiwiLy8gQWRhcHRlZCBmcm9tIGh0dHBzOi8vZ2l0aHViLmNvbS9GbGV0L3ByZXR0aWVyLWJ5dGVzL1xuLy8gQ2hhbmdpbmcgMTAwMCBieXRlcyB0byAxMDI0LCBzbyB3ZSBjYW4ga2VlcCB1cHBlcmNhc2UgS0IgdnMga0Jcbi8vIElTQyBMaWNlbnNlIChjKSBEYW4gRmxldHRyZSBodHRwczovL2dpdGh1Yi5jb20vRmxldC9wcmV0dGllci1ieXRlcy9ibG9iL21hc3Rlci9MSUNFTlNFXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIHByZXR0aWVyQnl0ZXMgKG51bSkge1xuICBpZiAodHlwZW9mIG51bSAhPT0gJ251bWJlcicgfHwgaXNOYU4obnVtKSkge1xuICAgIHRocm93IG5ldyBUeXBlRXJyb3IoJ0V4cGVjdGVkIGEgbnVtYmVyLCBnb3QgJyArIHR5cGVvZiBudW0pXG4gIH1cblxuICB2YXIgbmVnID0gbnVtIDwgMFxuICB2YXIgdW5pdHMgPSBbJ0InLCAnS0InLCAnTUInLCAnR0InLCAnVEInLCAnUEInLCAnRUInLCAnWkInLCAnWUInXVxuXG4gIGlmIChuZWcpIHtcbiAgICBudW0gPSAtbnVtXG4gIH1cblxuICBpZiAobnVtIDwgMSkge1xuICAgIHJldHVybiAobmVnID8gJy0nIDogJycpICsgbnVtICsgJyBCJ1xuICB9XG5cbiAgdmFyIGV4cG9uZW50ID0gTWF0aC5taW4oTWF0aC5mbG9vcihNYXRoLmxvZyhudW0pIC8gTWF0aC5sb2coMTAyNCkpLCB1bml0cy5sZW5ndGggLSAxKVxuICBudW0gPSBOdW1iZXIobnVtIC8gTWF0aC5wb3coMTAyNCwgZXhwb25lbnQpKVxuICB2YXIgdW5pdCA9IHVuaXRzW2V4cG9uZW50XVxuXG4gIGlmIChudW0gPj0gMTAgfHwgbnVtICUgMSA9PT0gMCkge1xuICAgIC8vIERvIG5vdCBzaG93IGRlY2ltYWxzIHdoZW4gdGhlIG51bWJlciBpcyB0d28tZGlnaXQsIG9yIGlmIHRoZSBudW1iZXIgaGFzIG5vXG4gICAgLy8gZGVjaW1hbCBjb21wb25lbnQuXG4gICAgcmV0dXJuIChuZWcgPyAnLScgOiAnJykgKyBudW0udG9GaXhlZCgwKSArICcgJyArIHVuaXRcbiAgfSBlbHNlIHtcbiAgICByZXR1cm4gKG5lZyA/ICctJyA6ICcnKSArIG51bS50b0ZpeGVkKDEpICsgJyAnICsgdW5pdFxuICB9XG59XG4iLCIvKipcbiAqIGN1aWQuanNcbiAqIENvbGxpc2lvbi1yZXNpc3RhbnQgVUlEIGdlbmVyYXRvciBmb3IgYnJvd3NlcnMgYW5kIG5vZGUuXG4gKiBTZXF1ZW50aWFsIGZvciBmYXN0IGRiIGxvb2t1cHMgYW5kIHJlY2VuY3kgc29ydGluZy5cbiAqIFNhZmUgZm9yIGVsZW1lbnQgSURzIGFuZCBzZXJ2ZXItc2lkZSBsb29rdXBzLlxuICpcbiAqIEV4dHJhY3RlZCBmcm9tIENMQ1RSXG4gKlxuICogQ29weXJpZ2h0IChjKSBFcmljIEVsbGlvdHQgMjAxMlxuICogTUlUIExpY2Vuc2VcbiAqL1xuXG52YXIgZmluZ2VycHJpbnQgPSByZXF1aXJlKCcuL2xpYi9maW5nZXJwcmludC5qcycpO1xudmFyIHBhZCA9IHJlcXVpcmUoJy4vbGliL3BhZC5qcycpO1xudmFyIGdldFJhbmRvbVZhbHVlID0gcmVxdWlyZSgnLi9saWIvZ2V0UmFuZG9tVmFsdWUuanMnKTtcblxudmFyIGMgPSAwLFxuICBibG9ja1NpemUgPSA0LFxuICBiYXNlID0gMzYsXG4gIGRpc2NyZXRlVmFsdWVzID0gTWF0aC5wb3coYmFzZSwgYmxvY2tTaXplKTtcblxuZnVuY3Rpb24gcmFuZG9tQmxvY2sgKCkge1xuICByZXR1cm4gcGFkKChnZXRSYW5kb21WYWx1ZSgpICpcbiAgICBkaXNjcmV0ZVZhbHVlcyA8PCAwKVxuICAgIC50b1N0cmluZyhiYXNlKSwgYmxvY2tTaXplKTtcbn1cblxuZnVuY3Rpb24gc2FmZUNvdW50ZXIgKCkge1xuICBjID0gYyA8IGRpc2NyZXRlVmFsdWVzID8gYyA6IDA7XG4gIGMrKzsgLy8gdGhpcyBpcyBub3Qgc3VibGltaW5hbFxuICByZXR1cm4gYyAtIDE7XG59XG5cbmZ1bmN0aW9uIGN1aWQgKCkge1xuICAvLyBTdGFydGluZyB3aXRoIGEgbG93ZXJjYXNlIGxldHRlciBtYWtlc1xuICAvLyBpdCBIVE1MIGVsZW1lbnQgSUQgZnJpZW5kbHkuXG4gIHZhciBsZXR0ZXIgPSAnYycsIC8vIGhhcmQtY29kZWQgYWxsb3dzIGZvciBzZXF1ZW50aWFsIGFjY2Vzc1xuXG4gICAgLy8gdGltZXN0YW1wXG4gICAgLy8gd2FybmluZzogdGhpcyBleHBvc2VzIHRoZSBleGFjdCBkYXRlIGFuZCB0aW1lXG4gICAgLy8gdGhhdCB0aGUgdWlkIHdhcyBjcmVhdGVkLlxuICAgIHRpbWVzdGFtcCA9IChuZXcgRGF0ZSgpLmdldFRpbWUoKSkudG9TdHJpbmcoYmFzZSksXG5cbiAgICAvLyBQcmV2ZW50IHNhbWUtbWFjaGluZSBjb2xsaXNpb25zLlxuICAgIGNvdW50ZXIgPSBwYWQoc2FmZUNvdW50ZXIoKS50b1N0cmluZyhiYXNlKSwgYmxvY2tTaXplKSxcblxuICAgIC8vIEEgZmV3IGNoYXJzIHRvIGdlbmVyYXRlIGRpc3RpbmN0IGlkcyBmb3IgZGlmZmVyZW50XG4gICAgLy8gY2xpZW50cyAoc28gZGlmZmVyZW50IGNvbXB1dGVycyBhcmUgZmFyIGxlc3NcbiAgICAvLyBsaWtlbHkgdG8gZ2VuZXJhdGUgdGhlIHNhbWUgaWQpXG4gICAgcHJpbnQgPSBmaW5nZXJwcmludCgpLFxuXG4gICAgLy8gR3JhYiBzb21lIG1vcmUgY2hhcnMgZnJvbSBNYXRoLnJhbmRvbSgpXG4gICAgcmFuZG9tID0gcmFuZG9tQmxvY2soKSArIHJhbmRvbUJsb2NrKCk7XG5cbiAgcmV0dXJuIGxldHRlciArIHRpbWVzdGFtcCArIGNvdW50ZXIgKyBwcmludCArIHJhbmRvbTtcbn1cblxuY3VpZC5zbHVnID0gZnVuY3Rpb24gc2x1ZyAoKSB7XG4gIHZhciBkYXRlID0gbmV3IERhdGUoKS5nZXRUaW1lKCkudG9TdHJpbmcoMzYpLFxuICAgIGNvdW50ZXIgPSBzYWZlQ291bnRlcigpLnRvU3RyaW5nKDM2KS5zbGljZSgtNCksXG4gICAgcHJpbnQgPSBmaW5nZXJwcmludCgpLnNsaWNlKDAsIDEpICtcbiAgICAgIGZpbmdlcnByaW50KCkuc2xpY2UoLTEpLFxuICAgIHJhbmRvbSA9IHJhbmRvbUJsb2NrKCkuc2xpY2UoLTIpO1xuXG4gIHJldHVybiBkYXRlLnNsaWNlKC0yKSArXG4gICAgY291bnRlciArIHByaW50ICsgcmFuZG9tO1xufTtcblxuY3VpZC5pc0N1aWQgPSBmdW5jdGlvbiBpc0N1aWQgKHN0cmluZ1RvQ2hlY2spIHtcbiAgaWYgKHR5cGVvZiBzdHJpbmdUb0NoZWNrICE9PSAnc3RyaW5nJykgcmV0dXJuIGZhbHNlO1xuICBpZiAoc3RyaW5nVG9DaGVjay5zdGFydHNXaXRoKCdjJykpIHJldHVybiB0cnVlO1xuICByZXR1cm4gZmFsc2U7XG59O1xuXG5jdWlkLmlzU2x1ZyA9IGZ1bmN0aW9uIGlzU2x1ZyAoc3RyaW5nVG9DaGVjaykge1xuICBpZiAodHlwZW9mIHN0cmluZ1RvQ2hlY2sgIT09ICdzdHJpbmcnKSByZXR1cm4gZmFsc2U7XG4gIHZhciBzdHJpbmdMZW5ndGggPSBzdHJpbmdUb0NoZWNrLmxlbmd0aDtcbiAgaWYgKHN0cmluZ0xlbmd0aCA+PSA3ICYmIHN0cmluZ0xlbmd0aCA8PSAxMCkgcmV0dXJuIHRydWU7XG4gIHJldHVybiBmYWxzZTtcbn07XG5cbmN1aWQuZmluZ2VycHJpbnQgPSBmaW5nZXJwcmludDtcblxubW9kdWxlLmV4cG9ydHMgPSBjdWlkO1xuIiwidmFyIHBhZCA9IHJlcXVpcmUoJy4vcGFkLmpzJyk7XG5cbnZhciBlbnYgPSB0eXBlb2Ygd2luZG93ID09PSAnb2JqZWN0JyA/IHdpbmRvdyA6IHNlbGY7XG52YXIgZ2xvYmFsQ291bnQgPSBPYmplY3Qua2V5cyhlbnYpLmxlbmd0aDtcbnZhciBtaW1lVHlwZXNMZW5ndGggPSBuYXZpZ2F0b3IubWltZVR5cGVzID8gbmF2aWdhdG9yLm1pbWVUeXBlcy5sZW5ndGggOiAwO1xudmFyIGNsaWVudElkID0gcGFkKChtaW1lVHlwZXNMZW5ndGggK1xuICBuYXZpZ2F0b3IudXNlckFnZW50Lmxlbmd0aCkudG9TdHJpbmcoMzYpICtcbiAgZ2xvYmFsQ291bnQudG9TdHJpbmcoMzYpLCA0KTtcblxubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiBmaW5nZXJwcmludCAoKSB7XG4gIHJldHVybiBjbGllbnRJZDtcbn07XG4iLCJcbnZhciBnZXRSYW5kb21WYWx1ZTtcblxudmFyIGNyeXB0byA9IHR5cGVvZiB3aW5kb3cgIT09ICd1bmRlZmluZWQnICYmXG4gICh3aW5kb3cuY3J5cHRvIHx8IHdpbmRvdy5tc0NyeXB0bykgfHxcbiAgdHlwZW9mIHNlbGYgIT09ICd1bmRlZmluZWQnICYmXG4gIHNlbGYuY3J5cHRvO1xuXG5pZiAoY3J5cHRvKSB7XG4gICAgdmFyIGxpbSA9IE1hdGgucG93KDIsIDMyKSAtIDE7XG4gICAgZ2V0UmFuZG9tVmFsdWUgPSBmdW5jdGlvbiAoKSB7XG4gICAgICAgIHJldHVybiBNYXRoLmFicyhjcnlwdG8uZ2V0UmFuZG9tVmFsdWVzKG5ldyBVaW50MzJBcnJheSgxKSlbMF0gLyBsaW0pO1xuICAgIH07XG59IGVsc2Uge1xuICAgIGdldFJhbmRvbVZhbHVlID0gTWF0aC5yYW5kb207XG59XG5cbm1vZHVsZS5leHBvcnRzID0gZ2V0UmFuZG9tVmFsdWU7XG4iLCJtb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIHBhZCAobnVtLCBzaXplKSB7XG4gIHZhciBzID0gJzAwMDAwMDAwMCcgKyBudW07XG4gIHJldHVybiBzLnN1YnN0cihzLmxlbmd0aCAtIHNpemUpO1xufTtcbiIsIi8vIFRoaXMgZmlsZSBjYW4gYmUgcmVxdWlyZWQgaW4gQnJvd3NlcmlmeSBhbmQgTm9kZS5qcyBmb3IgYXV0b21hdGljIHBvbHlmaWxsXG4vLyBUbyB1c2UgaXQ6ICByZXF1aXJlKCdlczYtcHJvbWlzZS9hdXRvJyk7XG4ndXNlIHN0cmljdCc7XG5tb2R1bGUuZXhwb3J0cyA9IHJlcXVpcmUoJy4vJykucG9seWZpbGwoKTtcbiIsIi8qIVxuICogQG92ZXJ2aWV3IGVzNi1wcm9taXNlIC0gYSB0aW55IGltcGxlbWVudGF0aW9uIG9mIFByb21pc2VzL0ErLlxuICogQGNvcHlyaWdodCBDb3B5cmlnaHQgKGMpIDIwMTQgWWVodWRhIEthdHosIFRvbSBEYWxlLCBTdGVmYW4gUGVubmVyIGFuZCBjb250cmlidXRvcnMgKENvbnZlcnNpb24gdG8gRVM2IEFQSSBieSBKYWtlIEFyY2hpYmFsZClcbiAqIEBsaWNlbnNlICAgTGljZW5zZWQgdW5kZXIgTUlUIGxpY2Vuc2VcbiAqICAgICAgICAgICAgU2VlIGh0dHBzOi8vcmF3LmdpdGh1YnVzZXJjb250ZW50LmNvbS9zdGVmYW5wZW5uZXIvZXM2LXByb21pc2UvbWFzdGVyL0xJQ0VOU0VcbiAqIEB2ZXJzaW9uICAgdjQuMi44KzFlNjhkY2U2XG4gKi9cblxuKGZ1bmN0aW9uIChnbG9iYWwsIGZhY3RvcnkpIHtcblx0dHlwZW9mIGV4cG9ydHMgPT09ICdvYmplY3QnICYmIHR5cGVvZiBtb2R1bGUgIT09ICd1bmRlZmluZWQnID8gbW9kdWxlLmV4cG9ydHMgPSBmYWN0b3J5KCkgOlxuXHR0eXBlb2YgZGVmaW5lID09PSAnZnVuY3Rpb24nICYmIGRlZmluZS5hbWQgPyBkZWZpbmUoZmFjdG9yeSkgOlxuXHQoZ2xvYmFsLkVTNlByb21pc2UgPSBmYWN0b3J5KCkpO1xufSh0aGlzLCAoZnVuY3Rpb24gKCkgeyAndXNlIHN0cmljdCc7XG5cbmZ1bmN0aW9uIG9iamVjdE9yRnVuY3Rpb24oeCkge1xuICB2YXIgdHlwZSA9IHR5cGVvZiB4O1xuICByZXR1cm4geCAhPT0gbnVsbCAmJiAodHlwZSA9PT0gJ29iamVjdCcgfHwgdHlwZSA9PT0gJ2Z1bmN0aW9uJyk7XG59XG5cbmZ1bmN0aW9uIGlzRnVuY3Rpb24oeCkge1xuICByZXR1cm4gdHlwZW9mIHggPT09ICdmdW5jdGlvbic7XG59XG5cblxuXG52YXIgX2lzQXJyYXkgPSB2b2lkIDA7XG5pZiAoQXJyYXkuaXNBcnJheSkge1xuICBfaXNBcnJheSA9IEFycmF5LmlzQXJyYXk7XG59IGVsc2Uge1xuICBfaXNBcnJheSA9IGZ1bmN0aW9uICh4KSB7XG4gICAgcmV0dXJuIE9iamVjdC5wcm90b3R5cGUudG9TdHJpbmcuY2FsbCh4KSA9PT0gJ1tvYmplY3QgQXJyYXldJztcbiAgfTtcbn1cblxudmFyIGlzQXJyYXkgPSBfaXNBcnJheTtcblxudmFyIGxlbiA9IDA7XG52YXIgdmVydHhOZXh0ID0gdm9pZCAwO1xudmFyIGN1c3RvbVNjaGVkdWxlckZuID0gdm9pZCAwO1xuXG52YXIgYXNhcCA9IGZ1bmN0aW9uIGFzYXAoY2FsbGJhY2ssIGFyZykge1xuICBxdWV1ZVtsZW5dID0gY2FsbGJhY2s7XG4gIHF1ZXVlW2xlbiArIDFdID0gYXJnO1xuICBsZW4gKz0gMjtcbiAgaWYgKGxlbiA9PT0gMikge1xuICAgIC8vIElmIGxlbiBpcyAyLCB0aGF0IG1lYW5zIHRoYXQgd2UgbmVlZCB0byBzY2hlZHVsZSBhbiBhc3luYyBmbHVzaC5cbiAgICAvLyBJZiBhZGRpdGlvbmFsIGNhbGxiYWNrcyBhcmUgcXVldWVkIGJlZm9yZSB0aGUgcXVldWUgaXMgZmx1c2hlZCwgdGhleVxuICAgIC8vIHdpbGwgYmUgcHJvY2Vzc2VkIGJ5IHRoaXMgZmx1c2ggdGhhdCB3ZSBhcmUgc2NoZWR1bGluZy5cbiAgICBpZiAoY3VzdG9tU2NoZWR1bGVyRm4pIHtcbiAgICAgIGN1c3RvbVNjaGVkdWxlckZuKGZsdXNoKTtcbiAgICB9IGVsc2Uge1xuICAgICAgc2NoZWR1bGVGbHVzaCgpO1xuICAgIH1cbiAgfVxufTtcblxuZnVuY3Rpb24gc2V0U2NoZWR1bGVyKHNjaGVkdWxlRm4pIHtcbiAgY3VzdG9tU2NoZWR1bGVyRm4gPSBzY2hlZHVsZUZuO1xufVxuXG5mdW5jdGlvbiBzZXRBc2FwKGFzYXBGbikge1xuICBhc2FwID0gYXNhcEZuO1xufVxuXG52YXIgYnJvd3NlcldpbmRvdyA9IHR5cGVvZiB3aW5kb3cgIT09ICd1bmRlZmluZWQnID8gd2luZG93IDogdW5kZWZpbmVkO1xudmFyIGJyb3dzZXJHbG9iYWwgPSBicm93c2VyV2luZG93IHx8IHt9O1xudmFyIEJyb3dzZXJNdXRhdGlvbk9ic2VydmVyID0gYnJvd3Nlckdsb2JhbC5NdXRhdGlvbk9ic2VydmVyIHx8IGJyb3dzZXJHbG9iYWwuV2ViS2l0TXV0YXRpb25PYnNlcnZlcjtcbnZhciBpc05vZGUgPSB0eXBlb2Ygc2VsZiA9PT0gJ3VuZGVmaW5lZCcgJiYgdHlwZW9mIHByb2Nlc3MgIT09ICd1bmRlZmluZWQnICYmIHt9LnRvU3RyaW5nLmNhbGwocHJvY2VzcykgPT09ICdbb2JqZWN0IHByb2Nlc3NdJztcblxuLy8gdGVzdCBmb3Igd2ViIHdvcmtlciBidXQgbm90IGluIElFMTBcbnZhciBpc1dvcmtlciA9IHR5cGVvZiBVaW50OENsYW1wZWRBcnJheSAhPT0gJ3VuZGVmaW5lZCcgJiYgdHlwZW9mIGltcG9ydFNjcmlwdHMgIT09ICd1bmRlZmluZWQnICYmIHR5cGVvZiBNZXNzYWdlQ2hhbm5lbCAhPT0gJ3VuZGVmaW5lZCc7XG5cbi8vIG5vZGVcbmZ1bmN0aW9uIHVzZU5leHRUaWNrKCkge1xuICAvLyBub2RlIHZlcnNpb24gMC4xMC54IGRpc3BsYXlzIGEgZGVwcmVjYXRpb24gd2FybmluZyB3aGVuIG5leHRUaWNrIGlzIHVzZWQgcmVjdXJzaXZlbHlcbiAgLy8gc2VlIGh0dHBzOi8vZ2l0aHViLmNvbS9jdWpvanMvd2hlbi9pc3N1ZXMvNDEwIGZvciBkZXRhaWxzXG4gIHJldHVybiBmdW5jdGlvbiAoKSB7XG4gICAgcmV0dXJuIHByb2Nlc3MubmV4dFRpY2soZmx1c2gpO1xuICB9O1xufVxuXG4vLyB2ZXJ0eFxuZnVuY3Rpb24gdXNlVmVydHhUaW1lcigpIHtcbiAgaWYgKHR5cGVvZiB2ZXJ0eE5leHQgIT09ICd1bmRlZmluZWQnKSB7XG4gICAgcmV0dXJuIGZ1bmN0aW9uICgpIHtcbiAgICAgIHZlcnR4TmV4dChmbHVzaCk7XG4gICAgfTtcbiAgfVxuXG4gIHJldHVybiB1c2VTZXRUaW1lb3V0KCk7XG59XG5cbmZ1bmN0aW9uIHVzZU11dGF0aW9uT2JzZXJ2ZXIoKSB7XG4gIHZhciBpdGVyYXRpb25zID0gMDtcbiAgdmFyIG9ic2VydmVyID0gbmV3IEJyb3dzZXJNdXRhdGlvbk9ic2VydmVyKGZsdXNoKTtcbiAgdmFyIG5vZGUgPSBkb2N1bWVudC5jcmVhdGVUZXh0Tm9kZSgnJyk7XG4gIG9ic2VydmVyLm9ic2VydmUobm9kZSwgeyBjaGFyYWN0ZXJEYXRhOiB0cnVlIH0pO1xuXG4gIHJldHVybiBmdW5jdGlvbiAoKSB7XG4gICAgbm9kZS5kYXRhID0gaXRlcmF0aW9ucyA9ICsraXRlcmF0aW9ucyAlIDI7XG4gIH07XG59XG5cbi8vIHdlYiB3b3JrZXJcbmZ1bmN0aW9uIHVzZU1lc3NhZ2VDaGFubmVsKCkge1xuICB2YXIgY2hhbm5lbCA9IG5ldyBNZXNzYWdlQ2hhbm5lbCgpO1xuICBjaGFubmVsLnBvcnQxLm9ubWVzc2FnZSA9IGZsdXNoO1xuICByZXR1cm4gZnVuY3Rpb24gKCkge1xuICAgIHJldHVybiBjaGFubmVsLnBvcnQyLnBvc3RNZXNzYWdlKDApO1xuICB9O1xufVxuXG5mdW5jdGlvbiB1c2VTZXRUaW1lb3V0KCkge1xuICAvLyBTdG9yZSBzZXRUaW1lb3V0IHJlZmVyZW5jZSBzbyBlczYtcHJvbWlzZSB3aWxsIGJlIHVuYWZmZWN0ZWQgYnlcbiAgLy8gb3RoZXIgY29kZSBtb2RpZnlpbmcgc2V0VGltZW91dCAobGlrZSBzaW5vbi51c2VGYWtlVGltZXJzKCkpXG4gIHZhciBnbG9iYWxTZXRUaW1lb3V0ID0gc2V0VGltZW91dDtcbiAgcmV0dXJuIGZ1bmN0aW9uICgpIHtcbiAgICByZXR1cm4gZ2xvYmFsU2V0VGltZW91dChmbHVzaCwgMSk7XG4gIH07XG59XG5cbnZhciBxdWV1ZSA9IG5ldyBBcnJheSgxMDAwKTtcbmZ1bmN0aW9uIGZsdXNoKCkge1xuICBmb3IgKHZhciBpID0gMDsgaSA8IGxlbjsgaSArPSAyKSB7XG4gICAgdmFyIGNhbGxiYWNrID0gcXVldWVbaV07XG4gICAgdmFyIGFyZyA9IHF1ZXVlW2kgKyAxXTtcblxuICAgIGNhbGxiYWNrKGFyZyk7XG5cbiAgICBxdWV1ZVtpXSA9IHVuZGVmaW5lZDtcbiAgICBxdWV1ZVtpICsgMV0gPSB1bmRlZmluZWQ7XG4gIH1cblxuICBsZW4gPSAwO1xufVxuXG5mdW5jdGlvbiBhdHRlbXB0VmVydHgoKSB7XG4gIHRyeSB7XG4gICAgdmFyIHZlcnR4ID0gRnVuY3Rpb24oJ3JldHVybiB0aGlzJykoKS5yZXF1aXJlKCd2ZXJ0eCcpO1xuICAgIHZlcnR4TmV4dCA9IHZlcnR4LnJ1bk9uTG9vcCB8fCB2ZXJ0eC5ydW5PbkNvbnRleHQ7XG4gICAgcmV0dXJuIHVzZVZlcnR4VGltZXIoKTtcbiAgfSBjYXRjaCAoZSkge1xuICAgIHJldHVybiB1c2VTZXRUaW1lb3V0KCk7XG4gIH1cbn1cblxudmFyIHNjaGVkdWxlRmx1c2ggPSB2b2lkIDA7XG4vLyBEZWNpZGUgd2hhdCBhc3luYyBtZXRob2QgdG8gdXNlIHRvIHRyaWdnZXJpbmcgcHJvY2Vzc2luZyBvZiBxdWV1ZWQgY2FsbGJhY2tzOlxuaWYgKGlzTm9kZSkge1xuICBzY2hlZHVsZUZsdXNoID0gdXNlTmV4dFRpY2soKTtcbn0gZWxzZSBpZiAoQnJvd3Nlck11dGF0aW9uT2JzZXJ2ZXIpIHtcbiAgc2NoZWR1bGVGbHVzaCA9IHVzZU11dGF0aW9uT2JzZXJ2ZXIoKTtcbn0gZWxzZSBpZiAoaXNXb3JrZXIpIHtcbiAgc2NoZWR1bGVGbHVzaCA9IHVzZU1lc3NhZ2VDaGFubmVsKCk7XG59IGVsc2UgaWYgKGJyb3dzZXJXaW5kb3cgPT09IHVuZGVmaW5lZCAmJiB0eXBlb2YgcmVxdWlyZSA9PT0gJ2Z1bmN0aW9uJykge1xuICBzY2hlZHVsZUZsdXNoID0gYXR0ZW1wdFZlcnR4KCk7XG59IGVsc2Uge1xuICBzY2hlZHVsZUZsdXNoID0gdXNlU2V0VGltZW91dCgpO1xufVxuXG5mdW5jdGlvbiB0aGVuKG9uRnVsZmlsbG1lbnQsIG9uUmVqZWN0aW9uKSB7XG4gIHZhciBwYXJlbnQgPSB0aGlzO1xuXG4gIHZhciBjaGlsZCA9IG5ldyB0aGlzLmNvbnN0cnVjdG9yKG5vb3ApO1xuXG4gIGlmIChjaGlsZFtQUk9NSVNFX0lEXSA9PT0gdW5kZWZpbmVkKSB7XG4gICAgbWFrZVByb21pc2UoY2hpbGQpO1xuICB9XG5cbiAgdmFyIF9zdGF0ZSA9IHBhcmVudC5fc3RhdGU7XG5cblxuICBpZiAoX3N0YXRlKSB7XG4gICAgdmFyIGNhbGxiYWNrID0gYXJndW1lbnRzW19zdGF0ZSAtIDFdO1xuICAgIGFzYXAoZnVuY3Rpb24gKCkge1xuICAgICAgcmV0dXJuIGludm9rZUNhbGxiYWNrKF9zdGF0ZSwgY2hpbGQsIGNhbGxiYWNrLCBwYXJlbnQuX3Jlc3VsdCk7XG4gICAgfSk7XG4gIH0gZWxzZSB7XG4gICAgc3Vic2NyaWJlKHBhcmVudCwgY2hpbGQsIG9uRnVsZmlsbG1lbnQsIG9uUmVqZWN0aW9uKTtcbiAgfVxuXG4gIHJldHVybiBjaGlsZDtcbn1cblxuLyoqXG4gIGBQcm9taXNlLnJlc29sdmVgIHJldHVybnMgYSBwcm9taXNlIHRoYXQgd2lsbCBiZWNvbWUgcmVzb2x2ZWQgd2l0aCB0aGVcbiAgcGFzc2VkIGB2YWx1ZWAuIEl0IGlzIHNob3J0aGFuZCBmb3IgdGhlIGZvbGxvd2luZzpcblxuICBgYGBqYXZhc2NyaXB0XG4gIGxldCBwcm9taXNlID0gbmV3IFByb21pc2UoZnVuY3Rpb24ocmVzb2x2ZSwgcmVqZWN0KXtcbiAgICByZXNvbHZlKDEpO1xuICB9KTtcblxuICBwcm9taXNlLnRoZW4oZnVuY3Rpb24odmFsdWUpe1xuICAgIC8vIHZhbHVlID09PSAxXG4gIH0pO1xuICBgYGBcblxuICBJbnN0ZWFkIG9mIHdyaXRpbmcgdGhlIGFib3ZlLCB5b3VyIGNvZGUgbm93IHNpbXBseSBiZWNvbWVzIHRoZSBmb2xsb3dpbmc6XG5cbiAgYGBgamF2YXNjcmlwdFxuICBsZXQgcHJvbWlzZSA9IFByb21pc2UucmVzb2x2ZSgxKTtcblxuICBwcm9taXNlLnRoZW4oZnVuY3Rpb24odmFsdWUpe1xuICAgIC8vIHZhbHVlID09PSAxXG4gIH0pO1xuICBgYGBcblxuICBAbWV0aG9kIHJlc29sdmVcbiAgQHN0YXRpY1xuICBAcGFyYW0ge0FueX0gdmFsdWUgdmFsdWUgdGhhdCB0aGUgcmV0dXJuZWQgcHJvbWlzZSB3aWxsIGJlIHJlc29sdmVkIHdpdGhcbiAgVXNlZnVsIGZvciB0b29saW5nLlxuICBAcmV0dXJuIHtQcm9taXNlfSBhIHByb21pc2UgdGhhdCB3aWxsIGJlY29tZSBmdWxmaWxsZWQgd2l0aCB0aGUgZ2l2ZW5cbiAgYHZhbHVlYFxuKi9cbmZ1bmN0aW9uIHJlc29sdmUkMShvYmplY3QpIHtcbiAgLypqc2hpbnQgdmFsaWR0aGlzOnRydWUgKi9cbiAgdmFyIENvbnN0cnVjdG9yID0gdGhpcztcblxuICBpZiAob2JqZWN0ICYmIHR5cGVvZiBvYmplY3QgPT09ICdvYmplY3QnICYmIG9iamVjdC5jb25zdHJ1Y3RvciA9PT0gQ29uc3RydWN0b3IpIHtcbiAgICByZXR1cm4gb2JqZWN0O1xuICB9XG5cbiAgdmFyIHByb21pc2UgPSBuZXcgQ29uc3RydWN0b3Iobm9vcCk7XG4gIHJlc29sdmUocHJvbWlzZSwgb2JqZWN0KTtcbiAgcmV0dXJuIHByb21pc2U7XG59XG5cbnZhciBQUk9NSVNFX0lEID0gTWF0aC5yYW5kb20oKS50b1N0cmluZygzNikuc3Vic3RyaW5nKDIpO1xuXG5mdW5jdGlvbiBub29wKCkge31cblxudmFyIFBFTkRJTkcgPSB2b2lkIDA7XG52YXIgRlVMRklMTEVEID0gMTtcbnZhciBSRUpFQ1RFRCA9IDI7XG5cbmZ1bmN0aW9uIHNlbGZGdWxmaWxsbWVudCgpIHtcbiAgcmV0dXJuIG5ldyBUeXBlRXJyb3IoXCJZb3UgY2Fubm90IHJlc29sdmUgYSBwcm9taXNlIHdpdGggaXRzZWxmXCIpO1xufVxuXG5mdW5jdGlvbiBjYW5ub3RSZXR1cm5Pd24oKSB7XG4gIHJldHVybiBuZXcgVHlwZUVycm9yKCdBIHByb21pc2VzIGNhbGxiYWNrIGNhbm5vdCByZXR1cm4gdGhhdCBzYW1lIHByb21pc2UuJyk7XG59XG5cbmZ1bmN0aW9uIHRyeVRoZW4odGhlbiQkMSwgdmFsdWUsIGZ1bGZpbGxtZW50SGFuZGxlciwgcmVqZWN0aW9uSGFuZGxlcikge1xuICB0cnkge1xuICAgIHRoZW4kJDEuY2FsbCh2YWx1ZSwgZnVsZmlsbG1lbnRIYW5kbGVyLCByZWplY3Rpb25IYW5kbGVyKTtcbiAgfSBjYXRjaCAoZSkge1xuICAgIHJldHVybiBlO1xuICB9XG59XG5cbmZ1bmN0aW9uIGhhbmRsZUZvcmVpZ25UaGVuYWJsZShwcm9taXNlLCB0aGVuYWJsZSwgdGhlbiQkMSkge1xuICBhc2FwKGZ1bmN0aW9uIChwcm9taXNlKSB7XG4gICAgdmFyIHNlYWxlZCA9IGZhbHNlO1xuICAgIHZhciBlcnJvciA9IHRyeVRoZW4odGhlbiQkMSwgdGhlbmFibGUsIGZ1bmN0aW9uICh2YWx1ZSkge1xuICAgICAgaWYgKHNlYWxlZCkge1xuICAgICAgICByZXR1cm47XG4gICAgICB9XG4gICAgICBzZWFsZWQgPSB0cnVlO1xuICAgICAgaWYgKHRoZW5hYmxlICE9PSB2YWx1ZSkge1xuICAgICAgICByZXNvbHZlKHByb21pc2UsIHZhbHVlKTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIGZ1bGZpbGwocHJvbWlzZSwgdmFsdWUpO1xuICAgICAgfVxuICAgIH0sIGZ1bmN0aW9uIChyZWFzb24pIHtcbiAgICAgIGlmIChzZWFsZWQpIHtcbiAgICAgICAgcmV0dXJuO1xuICAgICAgfVxuICAgICAgc2VhbGVkID0gdHJ1ZTtcblxuICAgICAgcmVqZWN0KHByb21pc2UsIHJlYXNvbik7XG4gICAgfSwgJ1NldHRsZTogJyArIChwcm9taXNlLl9sYWJlbCB8fCAnIHVua25vd24gcHJvbWlzZScpKTtcblxuICAgIGlmICghc2VhbGVkICYmIGVycm9yKSB7XG4gICAgICBzZWFsZWQgPSB0cnVlO1xuICAgICAgcmVqZWN0KHByb21pc2UsIGVycm9yKTtcbiAgICB9XG4gIH0sIHByb21pc2UpO1xufVxuXG5mdW5jdGlvbiBoYW5kbGVPd25UaGVuYWJsZShwcm9taXNlLCB0aGVuYWJsZSkge1xuICBpZiAodGhlbmFibGUuX3N0YXRlID09PSBGVUxGSUxMRUQpIHtcbiAgICBmdWxmaWxsKHByb21pc2UsIHRoZW5hYmxlLl9yZXN1bHQpO1xuICB9IGVsc2UgaWYgKHRoZW5hYmxlLl9zdGF0ZSA9PT0gUkVKRUNURUQpIHtcbiAgICByZWplY3QocHJvbWlzZSwgdGhlbmFibGUuX3Jlc3VsdCk7XG4gIH0gZWxzZSB7XG4gICAgc3Vic2NyaWJlKHRoZW5hYmxlLCB1bmRlZmluZWQsIGZ1bmN0aW9uICh2YWx1ZSkge1xuICAgICAgcmV0dXJuIHJlc29sdmUocHJvbWlzZSwgdmFsdWUpO1xuICAgIH0sIGZ1bmN0aW9uIChyZWFzb24pIHtcbiAgICAgIHJldHVybiByZWplY3QocHJvbWlzZSwgcmVhc29uKTtcbiAgICB9KTtcbiAgfVxufVxuXG5mdW5jdGlvbiBoYW5kbGVNYXliZVRoZW5hYmxlKHByb21pc2UsIG1heWJlVGhlbmFibGUsIHRoZW4kJDEpIHtcbiAgaWYgKG1heWJlVGhlbmFibGUuY29uc3RydWN0b3IgPT09IHByb21pc2UuY29uc3RydWN0b3IgJiYgdGhlbiQkMSA9PT0gdGhlbiAmJiBtYXliZVRoZW5hYmxlLmNvbnN0cnVjdG9yLnJlc29sdmUgPT09IHJlc29sdmUkMSkge1xuICAgIGhhbmRsZU93blRoZW5hYmxlKHByb21pc2UsIG1heWJlVGhlbmFibGUpO1xuICB9IGVsc2Uge1xuICAgIGlmICh0aGVuJCQxID09PSB1bmRlZmluZWQpIHtcbiAgICAgIGZ1bGZpbGwocHJvbWlzZSwgbWF5YmVUaGVuYWJsZSk7XG4gICAgfSBlbHNlIGlmIChpc0Z1bmN0aW9uKHRoZW4kJDEpKSB7XG4gICAgICBoYW5kbGVGb3JlaWduVGhlbmFibGUocHJvbWlzZSwgbWF5YmVUaGVuYWJsZSwgdGhlbiQkMSk7XG4gICAgfSBlbHNlIHtcbiAgICAgIGZ1bGZpbGwocHJvbWlzZSwgbWF5YmVUaGVuYWJsZSk7XG4gICAgfVxuICB9XG59XG5cbmZ1bmN0aW9uIHJlc29sdmUocHJvbWlzZSwgdmFsdWUpIHtcbiAgaWYgKHByb21pc2UgPT09IHZhbHVlKSB7XG4gICAgcmVqZWN0KHByb21pc2UsIHNlbGZGdWxmaWxsbWVudCgpKTtcbiAgfSBlbHNlIGlmIChvYmplY3RPckZ1bmN0aW9uKHZhbHVlKSkge1xuICAgIHZhciB0aGVuJCQxID0gdm9pZCAwO1xuICAgIHRyeSB7XG4gICAgICB0aGVuJCQxID0gdmFsdWUudGhlbjtcbiAgICB9IGNhdGNoIChlcnJvcikge1xuICAgICAgcmVqZWN0KHByb21pc2UsIGVycm9yKTtcbiAgICAgIHJldHVybjtcbiAgICB9XG4gICAgaGFuZGxlTWF5YmVUaGVuYWJsZShwcm9taXNlLCB2YWx1ZSwgdGhlbiQkMSk7XG4gIH0gZWxzZSB7XG4gICAgZnVsZmlsbChwcm9taXNlLCB2YWx1ZSk7XG4gIH1cbn1cblxuZnVuY3Rpb24gcHVibGlzaFJlamVjdGlvbihwcm9taXNlKSB7XG4gIGlmIChwcm9taXNlLl9vbmVycm9yKSB7XG4gICAgcHJvbWlzZS5fb25lcnJvcihwcm9taXNlLl9yZXN1bHQpO1xuICB9XG5cbiAgcHVibGlzaChwcm9taXNlKTtcbn1cblxuZnVuY3Rpb24gZnVsZmlsbChwcm9taXNlLCB2YWx1ZSkge1xuICBpZiAocHJvbWlzZS5fc3RhdGUgIT09IFBFTkRJTkcpIHtcbiAgICByZXR1cm47XG4gIH1cblxuICBwcm9taXNlLl9yZXN1bHQgPSB2YWx1ZTtcbiAgcHJvbWlzZS5fc3RhdGUgPSBGVUxGSUxMRUQ7XG5cbiAgaWYgKHByb21pc2UuX3N1YnNjcmliZXJzLmxlbmd0aCAhPT0gMCkge1xuICAgIGFzYXAocHVibGlzaCwgcHJvbWlzZSk7XG4gIH1cbn1cblxuZnVuY3Rpb24gcmVqZWN0KHByb21pc2UsIHJlYXNvbikge1xuICBpZiAocHJvbWlzZS5fc3RhdGUgIT09IFBFTkRJTkcpIHtcbiAgICByZXR1cm47XG4gIH1cbiAgcHJvbWlzZS5fc3RhdGUgPSBSRUpFQ1RFRDtcbiAgcHJvbWlzZS5fcmVzdWx0ID0gcmVhc29uO1xuXG4gIGFzYXAocHVibGlzaFJlamVjdGlvbiwgcHJvbWlzZSk7XG59XG5cbmZ1bmN0aW9uIHN1YnNjcmliZShwYXJlbnQsIGNoaWxkLCBvbkZ1bGZpbGxtZW50LCBvblJlamVjdGlvbikge1xuICB2YXIgX3N1YnNjcmliZXJzID0gcGFyZW50Ll9zdWJzY3JpYmVycztcbiAgdmFyIGxlbmd0aCA9IF9zdWJzY3JpYmVycy5sZW5ndGg7XG5cblxuICBwYXJlbnQuX29uZXJyb3IgPSBudWxsO1xuXG4gIF9zdWJzY3JpYmVyc1tsZW5ndGhdID0gY2hpbGQ7XG4gIF9zdWJzY3JpYmVyc1tsZW5ndGggKyBGVUxGSUxMRURdID0gb25GdWxmaWxsbWVudDtcbiAgX3N1YnNjcmliZXJzW2xlbmd0aCArIFJFSkVDVEVEXSA9IG9uUmVqZWN0aW9uO1xuXG4gIGlmIChsZW5ndGggPT09IDAgJiYgcGFyZW50Ll9zdGF0ZSkge1xuICAgIGFzYXAocHVibGlzaCwgcGFyZW50KTtcbiAgfVxufVxuXG5mdW5jdGlvbiBwdWJsaXNoKHByb21pc2UpIHtcbiAgdmFyIHN1YnNjcmliZXJzID0gcHJvbWlzZS5fc3Vic2NyaWJlcnM7XG4gIHZhciBzZXR0bGVkID0gcHJvbWlzZS5fc3RhdGU7XG5cbiAgaWYgKHN1YnNjcmliZXJzLmxlbmd0aCA9PT0gMCkge1xuICAgIHJldHVybjtcbiAgfVxuXG4gIHZhciBjaGlsZCA9IHZvaWQgMCxcbiAgICAgIGNhbGxiYWNrID0gdm9pZCAwLFxuICAgICAgZGV0YWlsID0gcHJvbWlzZS5fcmVzdWx0O1xuXG4gIGZvciAodmFyIGkgPSAwOyBpIDwgc3Vic2NyaWJlcnMubGVuZ3RoOyBpICs9IDMpIHtcbiAgICBjaGlsZCA9IHN1YnNjcmliZXJzW2ldO1xuICAgIGNhbGxiYWNrID0gc3Vic2NyaWJlcnNbaSArIHNldHRsZWRdO1xuXG4gICAgaWYgKGNoaWxkKSB7XG4gICAgICBpbnZva2VDYWxsYmFjayhzZXR0bGVkLCBjaGlsZCwgY2FsbGJhY2ssIGRldGFpbCk7XG4gICAgfSBlbHNlIHtcbiAgICAgIGNhbGxiYWNrKGRldGFpbCk7XG4gICAgfVxuICB9XG5cbiAgcHJvbWlzZS5fc3Vic2NyaWJlcnMubGVuZ3RoID0gMDtcbn1cblxuZnVuY3Rpb24gaW52b2tlQ2FsbGJhY2soc2V0dGxlZCwgcHJvbWlzZSwgY2FsbGJhY2ssIGRldGFpbCkge1xuICB2YXIgaGFzQ2FsbGJhY2sgPSBpc0Z1bmN0aW9uKGNhbGxiYWNrKSxcbiAgICAgIHZhbHVlID0gdm9pZCAwLFxuICAgICAgZXJyb3IgPSB2b2lkIDAsXG4gICAgICBzdWNjZWVkZWQgPSB0cnVlO1xuXG4gIGlmIChoYXNDYWxsYmFjaykge1xuICAgIHRyeSB7XG4gICAgICB2YWx1ZSA9IGNhbGxiYWNrKGRldGFpbCk7XG4gICAgfSBjYXRjaCAoZSkge1xuICAgICAgc3VjY2VlZGVkID0gZmFsc2U7XG4gICAgICBlcnJvciA9IGU7XG4gICAgfVxuXG4gICAgaWYgKHByb21pc2UgPT09IHZhbHVlKSB7XG4gICAgICByZWplY3QocHJvbWlzZSwgY2Fubm90UmV0dXJuT3duKCkpO1xuICAgICAgcmV0dXJuO1xuICAgIH1cbiAgfSBlbHNlIHtcbiAgICB2YWx1ZSA9IGRldGFpbDtcbiAgfVxuXG4gIGlmIChwcm9taXNlLl9zdGF0ZSAhPT0gUEVORElORykge1xuICAgIC8vIG5vb3BcbiAgfSBlbHNlIGlmIChoYXNDYWxsYmFjayAmJiBzdWNjZWVkZWQpIHtcbiAgICByZXNvbHZlKHByb21pc2UsIHZhbHVlKTtcbiAgfSBlbHNlIGlmIChzdWNjZWVkZWQgPT09IGZhbHNlKSB7XG4gICAgcmVqZWN0KHByb21pc2UsIGVycm9yKTtcbiAgfSBlbHNlIGlmIChzZXR0bGVkID09PSBGVUxGSUxMRUQpIHtcbiAgICBmdWxmaWxsKHByb21pc2UsIHZhbHVlKTtcbiAgfSBlbHNlIGlmIChzZXR0bGVkID09PSBSRUpFQ1RFRCkge1xuICAgIHJlamVjdChwcm9taXNlLCB2YWx1ZSk7XG4gIH1cbn1cblxuZnVuY3Rpb24gaW5pdGlhbGl6ZVByb21pc2UocHJvbWlzZSwgcmVzb2x2ZXIpIHtcbiAgdHJ5IHtcbiAgICByZXNvbHZlcihmdW5jdGlvbiByZXNvbHZlUHJvbWlzZSh2YWx1ZSkge1xuICAgICAgcmVzb2x2ZShwcm9taXNlLCB2YWx1ZSk7XG4gICAgfSwgZnVuY3Rpb24gcmVqZWN0UHJvbWlzZShyZWFzb24pIHtcbiAgICAgIHJlamVjdChwcm9taXNlLCByZWFzb24pO1xuICAgIH0pO1xuICB9IGNhdGNoIChlKSB7XG4gICAgcmVqZWN0KHByb21pc2UsIGUpO1xuICB9XG59XG5cbnZhciBpZCA9IDA7XG5mdW5jdGlvbiBuZXh0SWQoKSB7XG4gIHJldHVybiBpZCsrO1xufVxuXG5mdW5jdGlvbiBtYWtlUHJvbWlzZShwcm9taXNlKSB7XG4gIHByb21pc2VbUFJPTUlTRV9JRF0gPSBpZCsrO1xuICBwcm9taXNlLl9zdGF0ZSA9IHVuZGVmaW5lZDtcbiAgcHJvbWlzZS5fcmVzdWx0ID0gdW5kZWZpbmVkO1xuICBwcm9taXNlLl9zdWJzY3JpYmVycyA9IFtdO1xufVxuXG5mdW5jdGlvbiB2YWxpZGF0aW9uRXJyb3IoKSB7XG4gIHJldHVybiBuZXcgRXJyb3IoJ0FycmF5IE1ldGhvZHMgbXVzdCBiZSBwcm92aWRlZCBhbiBBcnJheScpO1xufVxuXG52YXIgRW51bWVyYXRvciA9IGZ1bmN0aW9uICgpIHtcbiAgZnVuY3Rpb24gRW51bWVyYXRvcihDb25zdHJ1Y3RvciwgaW5wdXQpIHtcbiAgICB0aGlzLl9pbnN0YW5jZUNvbnN0cnVjdG9yID0gQ29uc3RydWN0b3I7XG4gICAgdGhpcy5wcm9taXNlID0gbmV3IENvbnN0cnVjdG9yKG5vb3ApO1xuXG4gICAgaWYgKCF0aGlzLnByb21pc2VbUFJPTUlTRV9JRF0pIHtcbiAgICAgIG1ha2VQcm9taXNlKHRoaXMucHJvbWlzZSk7XG4gICAgfVxuXG4gICAgaWYgKGlzQXJyYXkoaW5wdXQpKSB7XG4gICAgICB0aGlzLmxlbmd0aCA9IGlucHV0Lmxlbmd0aDtcbiAgICAgIHRoaXMuX3JlbWFpbmluZyA9IGlucHV0Lmxlbmd0aDtcblxuICAgICAgdGhpcy5fcmVzdWx0ID0gbmV3IEFycmF5KHRoaXMubGVuZ3RoKTtcblxuICAgICAgaWYgKHRoaXMubGVuZ3RoID09PSAwKSB7XG4gICAgICAgIGZ1bGZpbGwodGhpcy5wcm9taXNlLCB0aGlzLl9yZXN1bHQpO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgdGhpcy5sZW5ndGggPSB0aGlzLmxlbmd0aCB8fCAwO1xuICAgICAgICB0aGlzLl9lbnVtZXJhdGUoaW5wdXQpO1xuICAgICAgICBpZiAodGhpcy5fcmVtYWluaW5nID09PSAwKSB7XG4gICAgICAgICAgZnVsZmlsbCh0aGlzLnByb21pc2UsIHRoaXMuX3Jlc3VsdCk7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9IGVsc2Uge1xuICAgICAgcmVqZWN0KHRoaXMucHJvbWlzZSwgdmFsaWRhdGlvbkVycm9yKCkpO1xuICAgIH1cbiAgfVxuXG4gIEVudW1lcmF0b3IucHJvdG90eXBlLl9lbnVtZXJhdGUgPSBmdW5jdGlvbiBfZW51bWVyYXRlKGlucHV0KSB7XG4gICAgZm9yICh2YXIgaSA9IDA7IHRoaXMuX3N0YXRlID09PSBQRU5ESU5HICYmIGkgPCBpbnB1dC5sZW5ndGg7IGkrKykge1xuICAgICAgdGhpcy5fZWFjaEVudHJ5KGlucHV0W2ldLCBpKTtcbiAgICB9XG4gIH07XG5cbiAgRW51bWVyYXRvci5wcm90b3R5cGUuX2VhY2hFbnRyeSA9IGZ1bmN0aW9uIF9lYWNoRW50cnkoZW50cnksIGkpIHtcbiAgICB2YXIgYyA9IHRoaXMuX2luc3RhbmNlQ29uc3RydWN0b3I7XG4gICAgdmFyIHJlc29sdmUkJDEgPSBjLnJlc29sdmU7XG5cblxuICAgIGlmIChyZXNvbHZlJCQxID09PSByZXNvbHZlJDEpIHtcbiAgICAgIHZhciBfdGhlbiA9IHZvaWQgMDtcbiAgICAgIHZhciBlcnJvciA9IHZvaWQgMDtcbiAgICAgIHZhciBkaWRFcnJvciA9IGZhbHNlO1xuICAgICAgdHJ5IHtcbiAgICAgICAgX3RoZW4gPSBlbnRyeS50aGVuO1xuICAgICAgfSBjYXRjaCAoZSkge1xuICAgICAgICBkaWRFcnJvciA9IHRydWU7XG4gICAgICAgIGVycm9yID0gZTtcbiAgICAgIH1cblxuICAgICAgaWYgKF90aGVuID09PSB0aGVuICYmIGVudHJ5Ll9zdGF0ZSAhPT0gUEVORElORykge1xuICAgICAgICB0aGlzLl9zZXR0bGVkQXQoZW50cnkuX3N0YXRlLCBpLCBlbnRyeS5fcmVzdWx0KTtcbiAgICAgIH0gZWxzZSBpZiAodHlwZW9mIF90aGVuICE9PSAnZnVuY3Rpb24nKSB7XG4gICAgICAgIHRoaXMuX3JlbWFpbmluZy0tO1xuICAgICAgICB0aGlzLl9yZXN1bHRbaV0gPSBlbnRyeTtcbiAgICAgIH0gZWxzZSBpZiAoYyA9PT0gUHJvbWlzZSQxKSB7XG4gICAgICAgIHZhciBwcm9taXNlID0gbmV3IGMobm9vcCk7XG4gICAgICAgIGlmIChkaWRFcnJvcikge1xuICAgICAgICAgIHJlamVjdChwcm9taXNlLCBlcnJvcik7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgaGFuZGxlTWF5YmVUaGVuYWJsZShwcm9taXNlLCBlbnRyeSwgX3RoZW4pO1xuICAgICAgICB9XG4gICAgICAgIHRoaXMuX3dpbGxTZXR0bGVBdChwcm9taXNlLCBpKTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHRoaXMuX3dpbGxTZXR0bGVBdChuZXcgYyhmdW5jdGlvbiAocmVzb2x2ZSQkMSkge1xuICAgICAgICAgIHJldHVybiByZXNvbHZlJCQxKGVudHJ5KTtcbiAgICAgICAgfSksIGkpO1xuICAgICAgfVxuICAgIH0gZWxzZSB7XG4gICAgICB0aGlzLl93aWxsU2V0dGxlQXQocmVzb2x2ZSQkMShlbnRyeSksIGkpO1xuICAgIH1cbiAgfTtcblxuICBFbnVtZXJhdG9yLnByb3RvdHlwZS5fc2V0dGxlZEF0ID0gZnVuY3Rpb24gX3NldHRsZWRBdChzdGF0ZSwgaSwgdmFsdWUpIHtcbiAgICB2YXIgcHJvbWlzZSA9IHRoaXMucHJvbWlzZTtcblxuXG4gICAgaWYgKHByb21pc2UuX3N0YXRlID09PSBQRU5ESU5HKSB7XG4gICAgICB0aGlzLl9yZW1haW5pbmctLTtcblxuICAgICAgaWYgKHN0YXRlID09PSBSRUpFQ1RFRCkge1xuICAgICAgICByZWplY3QocHJvbWlzZSwgdmFsdWUpO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgdGhpcy5fcmVzdWx0W2ldID0gdmFsdWU7XG4gICAgICB9XG4gICAgfVxuXG4gICAgaWYgKHRoaXMuX3JlbWFpbmluZyA9PT0gMCkge1xuICAgICAgZnVsZmlsbChwcm9taXNlLCB0aGlzLl9yZXN1bHQpO1xuICAgIH1cbiAgfTtcblxuICBFbnVtZXJhdG9yLnByb3RvdHlwZS5fd2lsbFNldHRsZUF0ID0gZnVuY3Rpb24gX3dpbGxTZXR0bGVBdChwcm9taXNlLCBpKSB7XG4gICAgdmFyIGVudW1lcmF0b3IgPSB0aGlzO1xuXG4gICAgc3Vic2NyaWJlKHByb21pc2UsIHVuZGVmaW5lZCwgZnVuY3Rpb24gKHZhbHVlKSB7XG4gICAgICByZXR1cm4gZW51bWVyYXRvci5fc2V0dGxlZEF0KEZVTEZJTExFRCwgaSwgdmFsdWUpO1xuICAgIH0sIGZ1bmN0aW9uIChyZWFzb24pIHtcbiAgICAgIHJldHVybiBlbnVtZXJhdG9yLl9zZXR0bGVkQXQoUkVKRUNURUQsIGksIHJlYXNvbik7XG4gICAgfSk7XG4gIH07XG5cbiAgcmV0dXJuIEVudW1lcmF0b3I7XG59KCk7XG5cbi8qKlxuICBgUHJvbWlzZS5hbGxgIGFjY2VwdHMgYW4gYXJyYXkgb2YgcHJvbWlzZXMsIGFuZCByZXR1cm5zIGEgbmV3IHByb21pc2Ugd2hpY2hcbiAgaXMgZnVsZmlsbGVkIHdpdGggYW4gYXJyYXkgb2YgZnVsZmlsbG1lbnQgdmFsdWVzIGZvciB0aGUgcGFzc2VkIHByb21pc2VzLCBvclxuICByZWplY3RlZCB3aXRoIHRoZSByZWFzb24gb2YgdGhlIGZpcnN0IHBhc3NlZCBwcm9taXNlIHRvIGJlIHJlamVjdGVkLiBJdCBjYXN0cyBhbGxcbiAgZWxlbWVudHMgb2YgdGhlIHBhc3NlZCBpdGVyYWJsZSB0byBwcm9taXNlcyBhcyBpdCBydW5zIHRoaXMgYWxnb3JpdGhtLlxuXG4gIEV4YW1wbGU6XG5cbiAgYGBgamF2YXNjcmlwdFxuICBsZXQgcHJvbWlzZTEgPSByZXNvbHZlKDEpO1xuICBsZXQgcHJvbWlzZTIgPSByZXNvbHZlKDIpO1xuICBsZXQgcHJvbWlzZTMgPSByZXNvbHZlKDMpO1xuICBsZXQgcHJvbWlzZXMgPSBbIHByb21pc2UxLCBwcm9taXNlMiwgcHJvbWlzZTMgXTtcblxuICBQcm9taXNlLmFsbChwcm9taXNlcykudGhlbihmdW5jdGlvbihhcnJheSl7XG4gICAgLy8gVGhlIGFycmF5IGhlcmUgd291bGQgYmUgWyAxLCAyLCAzIF07XG4gIH0pO1xuICBgYGBcblxuICBJZiBhbnkgb2YgdGhlIGBwcm9taXNlc2AgZ2l2ZW4gdG8gYGFsbGAgYXJlIHJlamVjdGVkLCB0aGUgZmlyc3QgcHJvbWlzZVxuICB0aGF0IGlzIHJlamVjdGVkIHdpbGwgYmUgZ2l2ZW4gYXMgYW4gYXJndW1lbnQgdG8gdGhlIHJldHVybmVkIHByb21pc2VzJ3NcbiAgcmVqZWN0aW9uIGhhbmRsZXIuIEZvciBleGFtcGxlOlxuXG4gIEV4YW1wbGU6XG5cbiAgYGBgamF2YXNjcmlwdFxuICBsZXQgcHJvbWlzZTEgPSByZXNvbHZlKDEpO1xuICBsZXQgcHJvbWlzZTIgPSByZWplY3QobmV3IEVycm9yKFwiMlwiKSk7XG4gIGxldCBwcm9taXNlMyA9IHJlamVjdChuZXcgRXJyb3IoXCIzXCIpKTtcbiAgbGV0IHByb21pc2VzID0gWyBwcm9taXNlMSwgcHJvbWlzZTIsIHByb21pc2UzIF07XG5cbiAgUHJvbWlzZS5hbGwocHJvbWlzZXMpLnRoZW4oZnVuY3Rpb24oYXJyYXkpe1xuICAgIC8vIENvZGUgaGVyZSBuZXZlciBydW5zIGJlY2F1c2UgdGhlcmUgYXJlIHJlamVjdGVkIHByb21pc2VzIVxuICB9LCBmdW5jdGlvbihlcnJvcikge1xuICAgIC8vIGVycm9yLm1lc3NhZ2UgPT09IFwiMlwiXG4gIH0pO1xuICBgYGBcblxuICBAbWV0aG9kIGFsbFxuICBAc3RhdGljXG4gIEBwYXJhbSB7QXJyYXl9IGVudHJpZXMgYXJyYXkgb2YgcHJvbWlzZXNcbiAgQHBhcmFtIHtTdHJpbmd9IGxhYmVsIG9wdGlvbmFsIHN0cmluZyBmb3IgbGFiZWxpbmcgdGhlIHByb21pc2UuXG4gIFVzZWZ1bCBmb3IgdG9vbGluZy5cbiAgQHJldHVybiB7UHJvbWlzZX0gcHJvbWlzZSB0aGF0IGlzIGZ1bGZpbGxlZCB3aGVuIGFsbCBgcHJvbWlzZXNgIGhhdmUgYmVlblxuICBmdWxmaWxsZWQsIG9yIHJlamVjdGVkIGlmIGFueSBvZiB0aGVtIGJlY29tZSByZWplY3RlZC5cbiAgQHN0YXRpY1xuKi9cbmZ1bmN0aW9uIGFsbChlbnRyaWVzKSB7XG4gIHJldHVybiBuZXcgRW51bWVyYXRvcih0aGlzLCBlbnRyaWVzKS5wcm9taXNlO1xufVxuXG4vKipcbiAgYFByb21pc2UucmFjZWAgcmV0dXJucyBhIG5ldyBwcm9taXNlIHdoaWNoIGlzIHNldHRsZWQgaW4gdGhlIHNhbWUgd2F5IGFzIHRoZVxuICBmaXJzdCBwYXNzZWQgcHJvbWlzZSB0byBzZXR0bGUuXG5cbiAgRXhhbXBsZTpcblxuICBgYGBqYXZhc2NyaXB0XG4gIGxldCBwcm9taXNlMSA9IG5ldyBQcm9taXNlKGZ1bmN0aW9uKHJlc29sdmUsIHJlamVjdCl7XG4gICAgc2V0VGltZW91dChmdW5jdGlvbigpe1xuICAgICAgcmVzb2x2ZSgncHJvbWlzZSAxJyk7XG4gICAgfSwgMjAwKTtcbiAgfSk7XG5cbiAgbGV0IHByb21pc2UyID0gbmV3IFByb21pc2UoZnVuY3Rpb24ocmVzb2x2ZSwgcmVqZWN0KXtcbiAgICBzZXRUaW1lb3V0KGZ1bmN0aW9uKCl7XG4gICAgICByZXNvbHZlKCdwcm9taXNlIDInKTtcbiAgICB9LCAxMDApO1xuICB9KTtcblxuICBQcm9taXNlLnJhY2UoW3Byb21pc2UxLCBwcm9taXNlMl0pLnRoZW4oZnVuY3Rpb24ocmVzdWx0KXtcbiAgICAvLyByZXN1bHQgPT09ICdwcm9taXNlIDInIGJlY2F1c2UgaXQgd2FzIHJlc29sdmVkIGJlZm9yZSBwcm9taXNlMVxuICAgIC8vIHdhcyByZXNvbHZlZC5cbiAgfSk7XG4gIGBgYFxuXG4gIGBQcm9taXNlLnJhY2VgIGlzIGRldGVybWluaXN0aWMgaW4gdGhhdCBvbmx5IHRoZSBzdGF0ZSBvZiB0aGUgZmlyc3RcbiAgc2V0dGxlZCBwcm9taXNlIG1hdHRlcnMuIEZvciBleGFtcGxlLCBldmVuIGlmIG90aGVyIHByb21pc2VzIGdpdmVuIHRvIHRoZVxuICBgcHJvbWlzZXNgIGFycmF5IGFyZ3VtZW50IGFyZSByZXNvbHZlZCwgYnV0IHRoZSBmaXJzdCBzZXR0bGVkIHByb21pc2UgaGFzXG4gIGJlY29tZSByZWplY3RlZCBiZWZvcmUgdGhlIG90aGVyIHByb21pc2VzIGJlY2FtZSBmdWxmaWxsZWQsIHRoZSByZXR1cm5lZFxuICBwcm9taXNlIHdpbGwgYmVjb21lIHJlamVjdGVkOlxuXG4gIGBgYGphdmFzY3JpcHRcbiAgbGV0IHByb21pc2UxID0gbmV3IFByb21pc2UoZnVuY3Rpb24ocmVzb2x2ZSwgcmVqZWN0KXtcbiAgICBzZXRUaW1lb3V0KGZ1bmN0aW9uKCl7XG4gICAgICByZXNvbHZlKCdwcm9taXNlIDEnKTtcbiAgICB9LCAyMDApO1xuICB9KTtcblxuICBsZXQgcHJvbWlzZTIgPSBuZXcgUHJvbWlzZShmdW5jdGlvbihyZXNvbHZlLCByZWplY3Qpe1xuICAgIHNldFRpbWVvdXQoZnVuY3Rpb24oKXtcbiAgICAgIHJlamVjdChuZXcgRXJyb3IoJ3Byb21pc2UgMicpKTtcbiAgICB9LCAxMDApO1xuICB9KTtcblxuICBQcm9taXNlLnJhY2UoW3Byb21pc2UxLCBwcm9taXNlMl0pLnRoZW4oZnVuY3Rpb24ocmVzdWx0KXtcbiAgICAvLyBDb2RlIGhlcmUgbmV2ZXIgcnVuc1xuICB9LCBmdW5jdGlvbihyZWFzb24pe1xuICAgIC8vIHJlYXNvbi5tZXNzYWdlID09PSAncHJvbWlzZSAyJyBiZWNhdXNlIHByb21pc2UgMiBiZWNhbWUgcmVqZWN0ZWQgYmVmb3JlXG4gICAgLy8gcHJvbWlzZSAxIGJlY2FtZSBmdWxmaWxsZWRcbiAgfSk7XG4gIGBgYFxuXG4gIEFuIGV4YW1wbGUgcmVhbC13b3JsZCB1c2UgY2FzZSBpcyBpbXBsZW1lbnRpbmcgdGltZW91dHM6XG5cbiAgYGBgamF2YXNjcmlwdFxuICBQcm9taXNlLnJhY2UoW2FqYXgoJ2Zvby5qc29uJyksIHRpbWVvdXQoNTAwMCldKVxuICBgYGBcblxuICBAbWV0aG9kIHJhY2VcbiAgQHN0YXRpY1xuICBAcGFyYW0ge0FycmF5fSBwcm9taXNlcyBhcnJheSBvZiBwcm9taXNlcyB0byBvYnNlcnZlXG4gIFVzZWZ1bCBmb3IgdG9vbGluZy5cbiAgQHJldHVybiB7UHJvbWlzZX0gYSBwcm9taXNlIHdoaWNoIHNldHRsZXMgaW4gdGhlIHNhbWUgd2F5IGFzIHRoZSBmaXJzdCBwYXNzZWRcbiAgcHJvbWlzZSB0byBzZXR0bGUuXG4qL1xuZnVuY3Rpb24gcmFjZShlbnRyaWVzKSB7XG4gIC8qanNoaW50IHZhbGlkdGhpczp0cnVlICovXG4gIHZhciBDb25zdHJ1Y3RvciA9IHRoaXM7XG5cbiAgaWYgKCFpc0FycmF5KGVudHJpZXMpKSB7XG4gICAgcmV0dXJuIG5ldyBDb25zdHJ1Y3RvcihmdW5jdGlvbiAoXywgcmVqZWN0KSB7XG4gICAgICByZXR1cm4gcmVqZWN0KG5ldyBUeXBlRXJyb3IoJ1lvdSBtdXN0IHBhc3MgYW4gYXJyYXkgdG8gcmFjZS4nKSk7XG4gICAgfSk7XG4gIH0gZWxzZSB7XG4gICAgcmV0dXJuIG5ldyBDb25zdHJ1Y3RvcihmdW5jdGlvbiAocmVzb2x2ZSwgcmVqZWN0KSB7XG4gICAgICB2YXIgbGVuZ3RoID0gZW50cmllcy5sZW5ndGg7XG4gICAgICBmb3IgKHZhciBpID0gMDsgaSA8IGxlbmd0aDsgaSsrKSB7XG4gICAgICAgIENvbnN0cnVjdG9yLnJlc29sdmUoZW50cmllc1tpXSkudGhlbihyZXNvbHZlLCByZWplY3QpO1xuICAgICAgfVxuICAgIH0pO1xuICB9XG59XG5cbi8qKlxuICBgUHJvbWlzZS5yZWplY3RgIHJldHVybnMgYSBwcm9taXNlIHJlamVjdGVkIHdpdGggdGhlIHBhc3NlZCBgcmVhc29uYC5cbiAgSXQgaXMgc2hvcnRoYW5kIGZvciB0aGUgZm9sbG93aW5nOlxuXG4gIGBgYGphdmFzY3JpcHRcbiAgbGV0IHByb21pc2UgPSBuZXcgUHJvbWlzZShmdW5jdGlvbihyZXNvbHZlLCByZWplY3Qpe1xuICAgIHJlamVjdChuZXcgRXJyb3IoJ1dIT09QUycpKTtcbiAgfSk7XG5cbiAgcHJvbWlzZS50aGVuKGZ1bmN0aW9uKHZhbHVlKXtcbiAgICAvLyBDb2RlIGhlcmUgZG9lc24ndCBydW4gYmVjYXVzZSB0aGUgcHJvbWlzZSBpcyByZWplY3RlZCFcbiAgfSwgZnVuY3Rpb24ocmVhc29uKXtcbiAgICAvLyByZWFzb24ubWVzc2FnZSA9PT0gJ1dIT09QUydcbiAgfSk7XG4gIGBgYFxuXG4gIEluc3RlYWQgb2Ygd3JpdGluZyB0aGUgYWJvdmUsIHlvdXIgY29kZSBub3cgc2ltcGx5IGJlY29tZXMgdGhlIGZvbGxvd2luZzpcblxuICBgYGBqYXZhc2NyaXB0XG4gIGxldCBwcm9taXNlID0gUHJvbWlzZS5yZWplY3QobmV3IEVycm9yKCdXSE9PUFMnKSk7XG5cbiAgcHJvbWlzZS50aGVuKGZ1bmN0aW9uKHZhbHVlKXtcbiAgICAvLyBDb2RlIGhlcmUgZG9lc24ndCBydW4gYmVjYXVzZSB0aGUgcHJvbWlzZSBpcyByZWplY3RlZCFcbiAgfSwgZnVuY3Rpb24ocmVhc29uKXtcbiAgICAvLyByZWFzb24ubWVzc2FnZSA9PT0gJ1dIT09QUydcbiAgfSk7XG4gIGBgYFxuXG4gIEBtZXRob2QgcmVqZWN0XG4gIEBzdGF0aWNcbiAgQHBhcmFtIHtBbnl9IHJlYXNvbiB2YWx1ZSB0aGF0IHRoZSByZXR1cm5lZCBwcm9taXNlIHdpbGwgYmUgcmVqZWN0ZWQgd2l0aC5cbiAgVXNlZnVsIGZvciB0b29saW5nLlxuICBAcmV0dXJuIHtQcm9taXNlfSBhIHByb21pc2UgcmVqZWN0ZWQgd2l0aCB0aGUgZ2l2ZW4gYHJlYXNvbmAuXG4qL1xuZnVuY3Rpb24gcmVqZWN0JDEocmVhc29uKSB7XG4gIC8qanNoaW50IHZhbGlkdGhpczp0cnVlICovXG4gIHZhciBDb25zdHJ1Y3RvciA9IHRoaXM7XG4gIHZhciBwcm9taXNlID0gbmV3IENvbnN0cnVjdG9yKG5vb3ApO1xuICByZWplY3QocHJvbWlzZSwgcmVhc29uKTtcbiAgcmV0dXJuIHByb21pc2U7XG59XG5cbmZ1bmN0aW9uIG5lZWRzUmVzb2x2ZXIoKSB7XG4gIHRocm93IG5ldyBUeXBlRXJyb3IoJ1lvdSBtdXN0IHBhc3MgYSByZXNvbHZlciBmdW5jdGlvbiBhcyB0aGUgZmlyc3QgYXJndW1lbnQgdG8gdGhlIHByb21pc2UgY29uc3RydWN0b3InKTtcbn1cblxuZnVuY3Rpb24gbmVlZHNOZXcoKSB7XG4gIHRocm93IG5ldyBUeXBlRXJyb3IoXCJGYWlsZWQgdG8gY29uc3RydWN0ICdQcm9taXNlJzogUGxlYXNlIHVzZSB0aGUgJ25ldycgb3BlcmF0b3IsIHRoaXMgb2JqZWN0IGNvbnN0cnVjdG9yIGNhbm5vdCBiZSBjYWxsZWQgYXMgYSBmdW5jdGlvbi5cIik7XG59XG5cbi8qKlxuICBQcm9taXNlIG9iamVjdHMgcmVwcmVzZW50IHRoZSBldmVudHVhbCByZXN1bHQgb2YgYW4gYXN5bmNocm9ub3VzIG9wZXJhdGlvbi4gVGhlXG4gIHByaW1hcnkgd2F5IG9mIGludGVyYWN0aW5nIHdpdGggYSBwcm9taXNlIGlzIHRocm91Z2ggaXRzIGB0aGVuYCBtZXRob2QsIHdoaWNoXG4gIHJlZ2lzdGVycyBjYWxsYmFja3MgdG8gcmVjZWl2ZSBlaXRoZXIgYSBwcm9taXNlJ3MgZXZlbnR1YWwgdmFsdWUgb3IgdGhlIHJlYXNvblxuICB3aHkgdGhlIHByb21pc2UgY2Fubm90IGJlIGZ1bGZpbGxlZC5cblxuICBUZXJtaW5vbG9neVxuICAtLS0tLS0tLS0tLVxuXG4gIC0gYHByb21pc2VgIGlzIGFuIG9iamVjdCBvciBmdW5jdGlvbiB3aXRoIGEgYHRoZW5gIG1ldGhvZCB3aG9zZSBiZWhhdmlvciBjb25mb3JtcyB0byB0aGlzIHNwZWNpZmljYXRpb24uXG4gIC0gYHRoZW5hYmxlYCBpcyBhbiBvYmplY3Qgb3IgZnVuY3Rpb24gdGhhdCBkZWZpbmVzIGEgYHRoZW5gIG1ldGhvZC5cbiAgLSBgdmFsdWVgIGlzIGFueSBsZWdhbCBKYXZhU2NyaXB0IHZhbHVlIChpbmNsdWRpbmcgdW5kZWZpbmVkLCBhIHRoZW5hYmxlLCBvciBhIHByb21pc2UpLlxuICAtIGBleGNlcHRpb25gIGlzIGEgdmFsdWUgdGhhdCBpcyB0aHJvd24gdXNpbmcgdGhlIHRocm93IHN0YXRlbWVudC5cbiAgLSBgcmVhc29uYCBpcyBhIHZhbHVlIHRoYXQgaW5kaWNhdGVzIHdoeSBhIHByb21pc2Ugd2FzIHJlamVjdGVkLlxuICAtIGBzZXR0bGVkYCB0aGUgZmluYWwgcmVzdGluZyBzdGF0ZSBvZiBhIHByb21pc2UsIGZ1bGZpbGxlZCBvciByZWplY3RlZC5cblxuICBBIHByb21pc2UgY2FuIGJlIGluIG9uZSBvZiB0aHJlZSBzdGF0ZXM6IHBlbmRpbmcsIGZ1bGZpbGxlZCwgb3IgcmVqZWN0ZWQuXG5cbiAgUHJvbWlzZXMgdGhhdCBhcmUgZnVsZmlsbGVkIGhhdmUgYSBmdWxmaWxsbWVudCB2YWx1ZSBhbmQgYXJlIGluIHRoZSBmdWxmaWxsZWRcbiAgc3RhdGUuICBQcm9taXNlcyB0aGF0IGFyZSByZWplY3RlZCBoYXZlIGEgcmVqZWN0aW9uIHJlYXNvbiBhbmQgYXJlIGluIHRoZVxuICByZWplY3RlZCBzdGF0ZS4gIEEgZnVsZmlsbG1lbnQgdmFsdWUgaXMgbmV2ZXIgYSB0aGVuYWJsZS5cblxuICBQcm9taXNlcyBjYW4gYWxzbyBiZSBzYWlkIHRvICpyZXNvbHZlKiBhIHZhbHVlLiAgSWYgdGhpcyB2YWx1ZSBpcyBhbHNvIGFcbiAgcHJvbWlzZSwgdGhlbiB0aGUgb3JpZ2luYWwgcHJvbWlzZSdzIHNldHRsZWQgc3RhdGUgd2lsbCBtYXRjaCB0aGUgdmFsdWUnc1xuICBzZXR0bGVkIHN0YXRlLiAgU28gYSBwcm9taXNlIHRoYXQgKnJlc29sdmVzKiBhIHByb21pc2UgdGhhdCByZWplY3RzIHdpbGxcbiAgaXRzZWxmIHJlamVjdCwgYW5kIGEgcHJvbWlzZSB0aGF0ICpyZXNvbHZlcyogYSBwcm9taXNlIHRoYXQgZnVsZmlsbHMgd2lsbFxuICBpdHNlbGYgZnVsZmlsbC5cblxuXG4gIEJhc2ljIFVzYWdlOlxuICAtLS0tLS0tLS0tLS1cblxuICBgYGBqc1xuICBsZXQgcHJvbWlzZSA9IG5ldyBQcm9taXNlKGZ1bmN0aW9uKHJlc29sdmUsIHJlamVjdCkge1xuICAgIC8vIG9uIHN1Y2Nlc3NcbiAgICByZXNvbHZlKHZhbHVlKTtcblxuICAgIC8vIG9uIGZhaWx1cmVcbiAgICByZWplY3QocmVhc29uKTtcbiAgfSk7XG5cbiAgcHJvbWlzZS50aGVuKGZ1bmN0aW9uKHZhbHVlKSB7XG4gICAgLy8gb24gZnVsZmlsbG1lbnRcbiAgfSwgZnVuY3Rpb24ocmVhc29uKSB7XG4gICAgLy8gb24gcmVqZWN0aW9uXG4gIH0pO1xuICBgYGBcblxuICBBZHZhbmNlZCBVc2FnZTpcbiAgLS0tLS0tLS0tLS0tLS0tXG5cbiAgUHJvbWlzZXMgc2hpbmUgd2hlbiBhYnN0cmFjdGluZyBhd2F5IGFzeW5jaHJvbm91cyBpbnRlcmFjdGlvbnMgc3VjaCBhc1xuICBgWE1MSHR0cFJlcXVlc3Rgcy5cblxuICBgYGBqc1xuICBmdW5jdGlvbiBnZXRKU09OKHVybCkge1xuICAgIHJldHVybiBuZXcgUHJvbWlzZShmdW5jdGlvbihyZXNvbHZlLCByZWplY3Qpe1xuICAgICAgbGV0IHhociA9IG5ldyBYTUxIdHRwUmVxdWVzdCgpO1xuXG4gICAgICB4aHIub3BlbignR0VUJywgdXJsKTtcbiAgICAgIHhoci5vbnJlYWR5c3RhdGVjaGFuZ2UgPSBoYW5kbGVyO1xuICAgICAgeGhyLnJlc3BvbnNlVHlwZSA9ICdqc29uJztcbiAgICAgIHhoci5zZXRSZXF1ZXN0SGVhZGVyKCdBY2NlcHQnLCAnYXBwbGljYXRpb24vanNvbicpO1xuICAgICAgeGhyLnNlbmQoKTtcblxuICAgICAgZnVuY3Rpb24gaGFuZGxlcigpIHtcbiAgICAgICAgaWYgKHRoaXMucmVhZHlTdGF0ZSA9PT0gdGhpcy5ET05FKSB7XG4gICAgICAgICAgaWYgKHRoaXMuc3RhdHVzID09PSAyMDApIHtcbiAgICAgICAgICAgIHJlc29sdmUodGhpcy5yZXNwb25zZSk7XG4gICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHJlamVjdChuZXcgRXJyb3IoJ2dldEpTT046IGAnICsgdXJsICsgJ2AgZmFpbGVkIHdpdGggc3RhdHVzOiBbJyArIHRoaXMuc3RhdHVzICsgJ10nKSk7XG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICB9O1xuICAgIH0pO1xuICB9XG5cbiAgZ2V0SlNPTignL3Bvc3RzLmpzb24nKS50aGVuKGZ1bmN0aW9uKGpzb24pIHtcbiAgICAvLyBvbiBmdWxmaWxsbWVudFxuICB9LCBmdW5jdGlvbihyZWFzb24pIHtcbiAgICAvLyBvbiByZWplY3Rpb25cbiAgfSk7XG4gIGBgYFxuXG4gIFVubGlrZSBjYWxsYmFja3MsIHByb21pc2VzIGFyZSBncmVhdCBjb21wb3NhYmxlIHByaW1pdGl2ZXMuXG5cbiAgYGBganNcbiAgUHJvbWlzZS5hbGwoW1xuICAgIGdldEpTT04oJy9wb3N0cycpLFxuICAgIGdldEpTT04oJy9jb21tZW50cycpXG4gIF0pLnRoZW4oZnVuY3Rpb24odmFsdWVzKXtcbiAgICB2YWx1ZXNbMF0gLy8gPT4gcG9zdHNKU09OXG4gICAgdmFsdWVzWzFdIC8vID0+IGNvbW1lbnRzSlNPTlxuXG4gICAgcmV0dXJuIHZhbHVlcztcbiAgfSk7XG4gIGBgYFxuXG4gIEBjbGFzcyBQcm9taXNlXG4gIEBwYXJhbSB7RnVuY3Rpb259IHJlc29sdmVyXG4gIFVzZWZ1bCBmb3IgdG9vbGluZy5cbiAgQGNvbnN0cnVjdG9yXG4qL1xuXG52YXIgUHJvbWlzZSQxID0gZnVuY3Rpb24gKCkge1xuICBmdW5jdGlvbiBQcm9taXNlKHJlc29sdmVyKSB7XG4gICAgdGhpc1tQUk9NSVNFX0lEXSA9IG5leHRJZCgpO1xuICAgIHRoaXMuX3Jlc3VsdCA9IHRoaXMuX3N0YXRlID0gdW5kZWZpbmVkO1xuICAgIHRoaXMuX3N1YnNjcmliZXJzID0gW107XG5cbiAgICBpZiAobm9vcCAhPT0gcmVzb2x2ZXIpIHtcbiAgICAgIHR5cGVvZiByZXNvbHZlciAhPT0gJ2Z1bmN0aW9uJyAmJiBuZWVkc1Jlc29sdmVyKCk7XG4gICAgICB0aGlzIGluc3RhbmNlb2YgUHJvbWlzZSA/IGluaXRpYWxpemVQcm9taXNlKHRoaXMsIHJlc29sdmVyKSA6IG5lZWRzTmV3KCk7XG4gICAgfVxuICB9XG5cbiAgLyoqXG4gIFRoZSBwcmltYXJ5IHdheSBvZiBpbnRlcmFjdGluZyB3aXRoIGEgcHJvbWlzZSBpcyB0aHJvdWdoIGl0cyBgdGhlbmAgbWV0aG9kLFxuICB3aGljaCByZWdpc3RlcnMgY2FsbGJhY2tzIHRvIHJlY2VpdmUgZWl0aGVyIGEgcHJvbWlzZSdzIGV2ZW50dWFsIHZhbHVlIG9yIHRoZVxuICByZWFzb24gd2h5IHRoZSBwcm9taXNlIGNhbm5vdCBiZSBmdWxmaWxsZWQuXG4gICBgYGBqc1xuICBmaW5kVXNlcigpLnRoZW4oZnVuY3Rpb24odXNlcil7XG4gICAgLy8gdXNlciBpcyBhdmFpbGFibGVcbiAgfSwgZnVuY3Rpb24ocmVhc29uKXtcbiAgICAvLyB1c2VyIGlzIHVuYXZhaWxhYmxlLCBhbmQgeW91IGFyZSBnaXZlbiB0aGUgcmVhc29uIHdoeVxuICB9KTtcbiAgYGBgXG4gICBDaGFpbmluZ1xuICAtLS0tLS0tLVxuICAgVGhlIHJldHVybiB2YWx1ZSBvZiBgdGhlbmAgaXMgaXRzZWxmIGEgcHJvbWlzZS4gIFRoaXMgc2Vjb25kLCAnZG93bnN0cmVhbSdcbiAgcHJvbWlzZSBpcyByZXNvbHZlZCB3aXRoIHRoZSByZXR1cm4gdmFsdWUgb2YgdGhlIGZpcnN0IHByb21pc2UncyBmdWxmaWxsbWVudFxuICBvciByZWplY3Rpb24gaGFuZGxlciwgb3IgcmVqZWN0ZWQgaWYgdGhlIGhhbmRsZXIgdGhyb3dzIGFuIGV4Y2VwdGlvbi5cbiAgIGBgYGpzXG4gIGZpbmRVc2VyKCkudGhlbihmdW5jdGlvbiAodXNlcikge1xuICAgIHJldHVybiB1c2VyLm5hbWU7XG4gIH0sIGZ1bmN0aW9uIChyZWFzb24pIHtcbiAgICByZXR1cm4gJ2RlZmF1bHQgbmFtZSc7XG4gIH0pLnRoZW4oZnVuY3Rpb24gKHVzZXJOYW1lKSB7XG4gICAgLy8gSWYgYGZpbmRVc2VyYCBmdWxmaWxsZWQsIGB1c2VyTmFtZWAgd2lsbCBiZSB0aGUgdXNlcidzIG5hbWUsIG90aGVyd2lzZSBpdFxuICAgIC8vIHdpbGwgYmUgYCdkZWZhdWx0IG5hbWUnYFxuICB9KTtcbiAgIGZpbmRVc2VyKCkudGhlbihmdW5jdGlvbiAodXNlcikge1xuICAgIHRocm93IG5ldyBFcnJvcignRm91bmQgdXNlciwgYnV0IHN0aWxsIHVuaGFwcHknKTtcbiAgfSwgZnVuY3Rpb24gKHJlYXNvbikge1xuICAgIHRocm93IG5ldyBFcnJvcignYGZpbmRVc2VyYCByZWplY3RlZCBhbmQgd2UncmUgdW5oYXBweScpO1xuICB9KS50aGVuKGZ1bmN0aW9uICh2YWx1ZSkge1xuICAgIC8vIG5ldmVyIHJlYWNoZWRcbiAgfSwgZnVuY3Rpb24gKHJlYXNvbikge1xuICAgIC8vIGlmIGBmaW5kVXNlcmAgZnVsZmlsbGVkLCBgcmVhc29uYCB3aWxsIGJlICdGb3VuZCB1c2VyLCBidXQgc3RpbGwgdW5oYXBweScuXG4gICAgLy8gSWYgYGZpbmRVc2VyYCByZWplY3RlZCwgYHJlYXNvbmAgd2lsbCBiZSAnYGZpbmRVc2VyYCByZWplY3RlZCBhbmQgd2UncmUgdW5oYXBweScuXG4gIH0pO1xuICBgYGBcbiAgSWYgdGhlIGRvd25zdHJlYW0gcHJvbWlzZSBkb2VzIG5vdCBzcGVjaWZ5IGEgcmVqZWN0aW9uIGhhbmRsZXIsIHJlamVjdGlvbiByZWFzb25zIHdpbGwgYmUgcHJvcGFnYXRlZCBmdXJ0aGVyIGRvd25zdHJlYW0uXG4gICBgYGBqc1xuICBmaW5kVXNlcigpLnRoZW4oZnVuY3Rpb24gKHVzZXIpIHtcbiAgICB0aHJvdyBuZXcgUGVkYWdvZ2ljYWxFeGNlcHRpb24oJ1Vwc3RyZWFtIGVycm9yJyk7XG4gIH0pLnRoZW4oZnVuY3Rpb24gKHZhbHVlKSB7XG4gICAgLy8gbmV2ZXIgcmVhY2hlZFxuICB9KS50aGVuKGZ1bmN0aW9uICh2YWx1ZSkge1xuICAgIC8vIG5ldmVyIHJlYWNoZWRcbiAgfSwgZnVuY3Rpb24gKHJlYXNvbikge1xuICAgIC8vIFRoZSBgUGVkZ2Fnb2NpYWxFeGNlcHRpb25gIGlzIHByb3BhZ2F0ZWQgYWxsIHRoZSB3YXkgZG93biB0byBoZXJlXG4gIH0pO1xuICBgYGBcbiAgIEFzc2ltaWxhdGlvblxuICAtLS0tLS0tLS0tLS1cbiAgIFNvbWV0aW1lcyB0aGUgdmFsdWUgeW91IHdhbnQgdG8gcHJvcGFnYXRlIHRvIGEgZG93bnN0cmVhbSBwcm9taXNlIGNhbiBvbmx5IGJlXG4gIHJldHJpZXZlZCBhc3luY2hyb25vdXNseS4gVGhpcyBjYW4gYmUgYWNoaWV2ZWQgYnkgcmV0dXJuaW5nIGEgcHJvbWlzZSBpbiB0aGVcbiAgZnVsZmlsbG1lbnQgb3IgcmVqZWN0aW9uIGhhbmRsZXIuIFRoZSBkb3duc3RyZWFtIHByb21pc2Ugd2lsbCB0aGVuIGJlIHBlbmRpbmdcbiAgdW50aWwgdGhlIHJldHVybmVkIHByb21pc2UgaXMgc2V0dGxlZC4gVGhpcyBpcyBjYWxsZWQgKmFzc2ltaWxhdGlvbiouXG4gICBgYGBqc1xuICBmaW5kVXNlcigpLnRoZW4oZnVuY3Rpb24gKHVzZXIpIHtcbiAgICByZXR1cm4gZmluZENvbW1lbnRzQnlBdXRob3IodXNlcik7XG4gIH0pLnRoZW4oZnVuY3Rpb24gKGNvbW1lbnRzKSB7XG4gICAgLy8gVGhlIHVzZXIncyBjb21tZW50cyBhcmUgbm93IGF2YWlsYWJsZVxuICB9KTtcbiAgYGBgXG4gICBJZiB0aGUgYXNzaW1saWF0ZWQgcHJvbWlzZSByZWplY3RzLCB0aGVuIHRoZSBkb3duc3RyZWFtIHByb21pc2Ugd2lsbCBhbHNvIHJlamVjdC5cbiAgIGBgYGpzXG4gIGZpbmRVc2VyKCkudGhlbihmdW5jdGlvbiAodXNlcikge1xuICAgIHJldHVybiBmaW5kQ29tbWVudHNCeUF1dGhvcih1c2VyKTtcbiAgfSkudGhlbihmdW5jdGlvbiAoY29tbWVudHMpIHtcbiAgICAvLyBJZiBgZmluZENvbW1lbnRzQnlBdXRob3JgIGZ1bGZpbGxzLCB3ZSdsbCBoYXZlIHRoZSB2YWx1ZSBoZXJlXG4gIH0sIGZ1bmN0aW9uIChyZWFzb24pIHtcbiAgICAvLyBJZiBgZmluZENvbW1lbnRzQnlBdXRob3JgIHJlamVjdHMsIHdlJ2xsIGhhdmUgdGhlIHJlYXNvbiBoZXJlXG4gIH0pO1xuICBgYGBcbiAgIFNpbXBsZSBFeGFtcGxlXG4gIC0tLS0tLS0tLS0tLS0tXG4gICBTeW5jaHJvbm91cyBFeGFtcGxlXG4gICBgYGBqYXZhc2NyaXB0XG4gIGxldCByZXN1bHQ7XG4gICB0cnkge1xuICAgIHJlc3VsdCA9IGZpbmRSZXN1bHQoKTtcbiAgICAvLyBzdWNjZXNzXG4gIH0gY2F0Y2gocmVhc29uKSB7XG4gICAgLy8gZmFpbHVyZVxuICB9XG4gIGBgYFxuICAgRXJyYmFjayBFeGFtcGxlXG4gICBgYGBqc1xuICBmaW5kUmVzdWx0KGZ1bmN0aW9uKHJlc3VsdCwgZXJyKXtcbiAgICBpZiAoZXJyKSB7XG4gICAgICAvLyBmYWlsdXJlXG4gICAgfSBlbHNlIHtcbiAgICAgIC8vIHN1Y2Nlc3NcbiAgICB9XG4gIH0pO1xuICBgYGBcbiAgIFByb21pc2UgRXhhbXBsZTtcbiAgIGBgYGphdmFzY3JpcHRcbiAgZmluZFJlc3VsdCgpLnRoZW4oZnVuY3Rpb24ocmVzdWx0KXtcbiAgICAvLyBzdWNjZXNzXG4gIH0sIGZ1bmN0aW9uKHJlYXNvbil7XG4gICAgLy8gZmFpbHVyZVxuICB9KTtcbiAgYGBgXG4gICBBZHZhbmNlZCBFeGFtcGxlXG4gIC0tLS0tLS0tLS0tLS0tXG4gICBTeW5jaHJvbm91cyBFeGFtcGxlXG4gICBgYGBqYXZhc2NyaXB0XG4gIGxldCBhdXRob3IsIGJvb2tzO1xuICAgdHJ5IHtcbiAgICBhdXRob3IgPSBmaW5kQXV0aG9yKCk7XG4gICAgYm9va3MgID0gZmluZEJvb2tzQnlBdXRob3IoYXV0aG9yKTtcbiAgICAvLyBzdWNjZXNzXG4gIH0gY2F0Y2gocmVhc29uKSB7XG4gICAgLy8gZmFpbHVyZVxuICB9XG4gIGBgYFxuICAgRXJyYmFjayBFeGFtcGxlXG4gICBgYGBqc1xuICAgZnVuY3Rpb24gZm91bmRCb29rcyhib29rcykge1xuICAgfVxuICAgZnVuY3Rpb24gZmFpbHVyZShyZWFzb24pIHtcbiAgIH1cbiAgIGZpbmRBdXRob3IoZnVuY3Rpb24oYXV0aG9yLCBlcnIpe1xuICAgIGlmIChlcnIpIHtcbiAgICAgIGZhaWx1cmUoZXJyKTtcbiAgICAgIC8vIGZhaWx1cmVcbiAgICB9IGVsc2Uge1xuICAgICAgdHJ5IHtcbiAgICAgICAgZmluZEJvb29rc0J5QXV0aG9yKGF1dGhvciwgZnVuY3Rpb24oYm9va3MsIGVycikge1xuICAgICAgICAgIGlmIChlcnIpIHtcbiAgICAgICAgICAgIGZhaWx1cmUoZXJyKTtcbiAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgdHJ5IHtcbiAgICAgICAgICAgICAgZm91bmRCb29rcyhib29rcyk7XG4gICAgICAgICAgICB9IGNhdGNoKHJlYXNvbikge1xuICAgICAgICAgICAgICBmYWlsdXJlKHJlYXNvbik7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfVxuICAgICAgICB9KTtcbiAgICAgIH0gY2F0Y2goZXJyb3IpIHtcbiAgICAgICAgZmFpbHVyZShlcnIpO1xuICAgICAgfVxuICAgICAgLy8gc3VjY2Vzc1xuICAgIH1cbiAgfSk7XG4gIGBgYFxuICAgUHJvbWlzZSBFeGFtcGxlO1xuICAgYGBgamF2YXNjcmlwdFxuICBmaW5kQXV0aG9yKCkuXG4gICAgdGhlbihmaW5kQm9va3NCeUF1dGhvcikuXG4gICAgdGhlbihmdW5jdGlvbihib29rcyl7XG4gICAgICAvLyBmb3VuZCBib29rc1xuICB9KS5jYXRjaChmdW5jdGlvbihyZWFzb24pe1xuICAgIC8vIHNvbWV0aGluZyB3ZW50IHdyb25nXG4gIH0pO1xuICBgYGBcbiAgIEBtZXRob2QgdGhlblxuICBAcGFyYW0ge0Z1bmN0aW9ufSBvbkZ1bGZpbGxlZFxuICBAcGFyYW0ge0Z1bmN0aW9ufSBvblJlamVjdGVkXG4gIFVzZWZ1bCBmb3IgdG9vbGluZy5cbiAgQHJldHVybiB7UHJvbWlzZX1cbiAgKi9cblxuICAvKipcbiAgYGNhdGNoYCBpcyBzaW1wbHkgc3VnYXIgZm9yIGB0aGVuKHVuZGVmaW5lZCwgb25SZWplY3Rpb24pYCB3aGljaCBtYWtlcyBpdCB0aGUgc2FtZVxuICBhcyB0aGUgY2F0Y2ggYmxvY2sgb2YgYSB0cnkvY2F0Y2ggc3RhdGVtZW50LlxuICBgYGBqc1xuICBmdW5jdGlvbiBmaW5kQXV0aG9yKCl7XG4gIHRocm93IG5ldyBFcnJvcignY291bGRuJ3QgZmluZCB0aGF0IGF1dGhvcicpO1xuICB9XG4gIC8vIHN5bmNocm9ub3VzXG4gIHRyeSB7XG4gIGZpbmRBdXRob3IoKTtcbiAgfSBjYXRjaChyZWFzb24pIHtcbiAgLy8gc29tZXRoaW5nIHdlbnQgd3JvbmdcbiAgfVxuICAvLyBhc3luYyB3aXRoIHByb21pc2VzXG4gIGZpbmRBdXRob3IoKS5jYXRjaChmdW5jdGlvbihyZWFzb24pe1xuICAvLyBzb21ldGhpbmcgd2VudCB3cm9uZ1xuICB9KTtcbiAgYGBgXG4gIEBtZXRob2QgY2F0Y2hcbiAgQHBhcmFtIHtGdW5jdGlvbn0gb25SZWplY3Rpb25cbiAgVXNlZnVsIGZvciB0b29saW5nLlxuICBAcmV0dXJuIHtQcm9taXNlfVxuICAqL1xuXG5cbiAgUHJvbWlzZS5wcm90b3R5cGUuY2F0Y2ggPSBmdW5jdGlvbiBfY2F0Y2gob25SZWplY3Rpb24pIHtcbiAgICByZXR1cm4gdGhpcy50aGVuKG51bGwsIG9uUmVqZWN0aW9uKTtcbiAgfTtcblxuICAvKipcbiAgICBgZmluYWxseWAgd2lsbCBiZSBpbnZva2VkIHJlZ2FyZGxlc3Mgb2YgdGhlIHByb21pc2UncyBmYXRlIGp1c3QgYXMgbmF0aXZlXG4gICAgdHJ5L2NhdGNoL2ZpbmFsbHkgYmVoYXZlc1xuICBcbiAgICBTeW5jaHJvbm91cyBleGFtcGxlOlxuICBcbiAgICBgYGBqc1xuICAgIGZpbmRBdXRob3IoKSB7XG4gICAgICBpZiAoTWF0aC5yYW5kb20oKSA+IDAuNSkge1xuICAgICAgICB0aHJvdyBuZXcgRXJyb3IoKTtcbiAgICAgIH1cbiAgICAgIHJldHVybiBuZXcgQXV0aG9yKCk7XG4gICAgfVxuICBcbiAgICB0cnkge1xuICAgICAgcmV0dXJuIGZpbmRBdXRob3IoKTsgLy8gc3VjY2VlZCBvciBmYWlsXG4gICAgfSBjYXRjaChlcnJvcikge1xuICAgICAgcmV0dXJuIGZpbmRPdGhlckF1dGhlcigpO1xuICAgIH0gZmluYWxseSB7XG4gICAgICAvLyBhbHdheXMgcnVuc1xuICAgICAgLy8gZG9lc24ndCBhZmZlY3QgdGhlIHJldHVybiB2YWx1ZVxuICAgIH1cbiAgICBgYGBcbiAgXG4gICAgQXN5bmNocm9ub3VzIGV4YW1wbGU6XG4gIFxuICAgIGBgYGpzXG4gICAgZmluZEF1dGhvcigpLmNhdGNoKGZ1bmN0aW9uKHJlYXNvbil7XG4gICAgICByZXR1cm4gZmluZE90aGVyQXV0aGVyKCk7XG4gICAgfSkuZmluYWxseShmdW5jdGlvbigpe1xuICAgICAgLy8gYXV0aG9yIHdhcyBlaXRoZXIgZm91bmQsIG9yIG5vdFxuICAgIH0pO1xuICAgIGBgYFxuICBcbiAgICBAbWV0aG9kIGZpbmFsbHlcbiAgICBAcGFyYW0ge0Z1bmN0aW9ufSBjYWxsYmFja1xuICAgIEByZXR1cm4ge1Byb21pc2V9XG4gICovXG5cblxuICBQcm9taXNlLnByb3RvdHlwZS5maW5hbGx5ID0gZnVuY3Rpb24gX2ZpbmFsbHkoY2FsbGJhY2spIHtcbiAgICB2YXIgcHJvbWlzZSA9IHRoaXM7XG4gICAgdmFyIGNvbnN0cnVjdG9yID0gcHJvbWlzZS5jb25zdHJ1Y3RvcjtcblxuICAgIGlmIChpc0Z1bmN0aW9uKGNhbGxiYWNrKSkge1xuICAgICAgcmV0dXJuIHByb21pc2UudGhlbihmdW5jdGlvbiAodmFsdWUpIHtcbiAgICAgICAgcmV0dXJuIGNvbnN0cnVjdG9yLnJlc29sdmUoY2FsbGJhY2soKSkudGhlbihmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgcmV0dXJuIHZhbHVlO1xuICAgICAgICB9KTtcbiAgICAgIH0sIGZ1bmN0aW9uIChyZWFzb24pIHtcbiAgICAgICAgcmV0dXJuIGNvbnN0cnVjdG9yLnJlc29sdmUoY2FsbGJhY2soKSkudGhlbihmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgdGhyb3cgcmVhc29uO1xuICAgICAgICB9KTtcbiAgICAgIH0pO1xuICAgIH1cblxuICAgIHJldHVybiBwcm9taXNlLnRoZW4oY2FsbGJhY2ssIGNhbGxiYWNrKTtcbiAgfTtcblxuICByZXR1cm4gUHJvbWlzZTtcbn0oKTtcblxuUHJvbWlzZSQxLnByb3RvdHlwZS50aGVuID0gdGhlbjtcblByb21pc2UkMS5hbGwgPSBhbGw7XG5Qcm9taXNlJDEucmFjZSA9IHJhY2U7XG5Qcm9taXNlJDEucmVzb2x2ZSA9IHJlc29sdmUkMTtcblByb21pc2UkMS5yZWplY3QgPSByZWplY3QkMTtcblByb21pc2UkMS5fc2V0U2NoZWR1bGVyID0gc2V0U2NoZWR1bGVyO1xuUHJvbWlzZSQxLl9zZXRBc2FwID0gc2V0QXNhcDtcblByb21pc2UkMS5fYXNhcCA9IGFzYXA7XG5cbi8qZ2xvYmFsIHNlbGYqL1xuZnVuY3Rpb24gcG9seWZpbGwoKSB7XG4gIHZhciBsb2NhbCA9IHZvaWQgMDtcblxuICBpZiAodHlwZW9mIGdsb2JhbCAhPT0gJ3VuZGVmaW5lZCcpIHtcbiAgICBsb2NhbCA9IGdsb2JhbDtcbiAgfSBlbHNlIGlmICh0eXBlb2Ygc2VsZiAhPT0gJ3VuZGVmaW5lZCcpIHtcbiAgICBsb2NhbCA9IHNlbGY7XG4gIH0gZWxzZSB7XG4gICAgdHJ5IHtcbiAgICAgIGxvY2FsID0gRnVuY3Rpb24oJ3JldHVybiB0aGlzJykoKTtcbiAgICB9IGNhdGNoIChlKSB7XG4gICAgICB0aHJvdyBuZXcgRXJyb3IoJ3BvbHlmaWxsIGZhaWxlZCBiZWNhdXNlIGdsb2JhbCBvYmplY3QgaXMgdW5hdmFpbGFibGUgaW4gdGhpcyBlbnZpcm9ubWVudCcpO1xuICAgIH1cbiAgfVxuXG4gIHZhciBQID0gbG9jYWwuUHJvbWlzZTtcblxuICBpZiAoUCkge1xuICAgIHZhciBwcm9taXNlVG9TdHJpbmcgPSBudWxsO1xuICAgIHRyeSB7XG4gICAgICBwcm9taXNlVG9TdHJpbmcgPSBPYmplY3QucHJvdG90eXBlLnRvU3RyaW5nLmNhbGwoUC5yZXNvbHZlKCkpO1xuICAgIH0gY2F0Y2ggKGUpIHtcbiAgICAgIC8vIHNpbGVudGx5IGlnbm9yZWRcbiAgICB9XG5cbiAgICBpZiAocHJvbWlzZVRvU3RyaW5nID09PSAnW29iamVjdCBQcm9taXNlXScgJiYgIVAuY2FzdCkge1xuICAgICAgcmV0dXJuO1xuICAgIH1cbiAgfVxuXG4gIGxvY2FsLlByb21pc2UgPSBQcm9taXNlJDE7XG59XG5cbi8vIFN0cmFuZ2UgY29tcGF0Li5cblByb21pc2UkMS5wb2x5ZmlsbCA9IHBvbHlmaWxsO1xuUHJvbWlzZSQxLlByb21pc2UgPSBQcm9taXNlJDE7XG5cbnJldHVybiBQcm9taXNlJDE7XG5cbn0pKSk7XG5cblxuXG4vLyMgc291cmNlTWFwcGluZ1VSTD1lczYtcHJvbWlzZS5tYXBcbiIsIi8qKlxuICogbG9kYXNoIChDdXN0b20gQnVpbGQpIDxodHRwczovL2xvZGFzaC5jb20vPlxuICogQnVpbGQ6IGBsb2Rhc2ggbW9kdWxhcml6ZSBleHBvcnRzPVwibnBtXCIgLW8gLi9gXG4gKiBDb3B5cmlnaHQgalF1ZXJ5IEZvdW5kYXRpb24gYW5kIG90aGVyIGNvbnRyaWJ1dG9ycyA8aHR0cHM6Ly9qcXVlcnkub3JnLz5cbiAqIFJlbGVhc2VkIHVuZGVyIE1JVCBsaWNlbnNlIDxodHRwczovL2xvZGFzaC5jb20vbGljZW5zZT5cbiAqIEJhc2VkIG9uIFVuZGVyc2NvcmUuanMgMS44LjMgPGh0dHA6Ly91bmRlcnNjb3JlanMub3JnL0xJQ0VOU0U+XG4gKiBDb3B5cmlnaHQgSmVyZW15IEFzaGtlbmFzLCBEb2N1bWVudENsb3VkIGFuZCBJbnZlc3RpZ2F0aXZlIFJlcG9ydGVycyAmIEVkaXRvcnNcbiAqL1xuXG4vKiogVXNlZCBhcyB0aGUgYFR5cGVFcnJvcmAgbWVzc2FnZSBmb3IgXCJGdW5jdGlvbnNcIiBtZXRob2RzLiAqL1xudmFyIEZVTkNfRVJST1JfVEVYVCA9ICdFeHBlY3RlZCBhIGZ1bmN0aW9uJztcblxuLyoqIFVzZWQgYXMgcmVmZXJlbmNlcyBmb3IgdmFyaW91cyBgTnVtYmVyYCBjb25zdGFudHMuICovXG52YXIgTkFOID0gMCAvIDA7XG5cbi8qKiBgT2JqZWN0I3RvU3RyaW5nYCByZXN1bHQgcmVmZXJlbmNlcy4gKi9cbnZhciBzeW1ib2xUYWcgPSAnW29iamVjdCBTeW1ib2xdJztcblxuLyoqIFVzZWQgdG8gbWF0Y2ggbGVhZGluZyBhbmQgdHJhaWxpbmcgd2hpdGVzcGFjZS4gKi9cbnZhciByZVRyaW0gPSAvXlxccyt8XFxzKyQvZztcblxuLyoqIFVzZWQgdG8gZGV0ZWN0IGJhZCBzaWduZWQgaGV4YWRlY2ltYWwgc3RyaW5nIHZhbHVlcy4gKi9cbnZhciByZUlzQmFkSGV4ID0gL15bLStdMHhbMC05YS1mXSskL2k7XG5cbi8qKiBVc2VkIHRvIGRldGVjdCBiaW5hcnkgc3RyaW5nIHZhbHVlcy4gKi9cbnZhciByZUlzQmluYXJ5ID0gL14wYlswMV0rJC9pO1xuXG4vKiogVXNlZCB0byBkZXRlY3Qgb2N0YWwgc3RyaW5nIHZhbHVlcy4gKi9cbnZhciByZUlzT2N0YWwgPSAvXjBvWzAtN10rJC9pO1xuXG4vKiogQnVpbHQtaW4gbWV0aG9kIHJlZmVyZW5jZXMgd2l0aG91dCBhIGRlcGVuZGVuY3kgb24gYHJvb3RgLiAqL1xudmFyIGZyZWVQYXJzZUludCA9IHBhcnNlSW50O1xuXG4vKiogRGV0ZWN0IGZyZWUgdmFyaWFibGUgYGdsb2JhbGAgZnJvbSBOb2RlLmpzLiAqL1xudmFyIGZyZWVHbG9iYWwgPSB0eXBlb2YgZ2xvYmFsID09ICdvYmplY3QnICYmIGdsb2JhbCAmJiBnbG9iYWwuT2JqZWN0ID09PSBPYmplY3QgJiYgZ2xvYmFsO1xuXG4vKiogRGV0ZWN0IGZyZWUgdmFyaWFibGUgYHNlbGZgLiAqL1xudmFyIGZyZWVTZWxmID0gdHlwZW9mIHNlbGYgPT0gJ29iamVjdCcgJiYgc2VsZiAmJiBzZWxmLk9iamVjdCA9PT0gT2JqZWN0ICYmIHNlbGY7XG5cbi8qKiBVc2VkIGFzIGEgcmVmZXJlbmNlIHRvIHRoZSBnbG9iYWwgb2JqZWN0LiAqL1xudmFyIHJvb3QgPSBmcmVlR2xvYmFsIHx8IGZyZWVTZWxmIHx8IEZ1bmN0aW9uKCdyZXR1cm4gdGhpcycpKCk7XG5cbi8qKiBVc2VkIGZvciBidWlsdC1pbiBtZXRob2QgcmVmZXJlbmNlcy4gKi9cbnZhciBvYmplY3RQcm90byA9IE9iamVjdC5wcm90b3R5cGU7XG5cbi8qKlxuICogVXNlZCB0byByZXNvbHZlIHRoZVxuICogW2B0b1N0cmluZ1RhZ2BdKGh0dHA6Ly9lY21hLWludGVybmF0aW9uYWwub3JnL2VjbWEtMjYyLzcuMC8jc2VjLW9iamVjdC5wcm90b3R5cGUudG9zdHJpbmcpXG4gKiBvZiB2YWx1ZXMuXG4gKi9cbnZhciBvYmplY3RUb1N0cmluZyA9IG9iamVjdFByb3RvLnRvU3RyaW5nO1xuXG4vKiBCdWlsdC1pbiBtZXRob2QgcmVmZXJlbmNlcyBmb3IgdGhvc2Ugd2l0aCB0aGUgc2FtZSBuYW1lIGFzIG90aGVyIGBsb2Rhc2hgIG1ldGhvZHMuICovXG52YXIgbmF0aXZlTWF4ID0gTWF0aC5tYXgsXG4gICAgbmF0aXZlTWluID0gTWF0aC5taW47XG5cbi8qKlxuICogR2V0cyB0aGUgdGltZXN0YW1wIG9mIHRoZSBudW1iZXIgb2YgbWlsbGlzZWNvbmRzIHRoYXQgaGF2ZSBlbGFwc2VkIHNpbmNlXG4gKiB0aGUgVW5peCBlcG9jaCAoMSBKYW51YXJ5IDE5NzAgMDA6MDA6MDAgVVRDKS5cbiAqXG4gKiBAc3RhdGljXG4gKiBAbWVtYmVyT2YgX1xuICogQHNpbmNlIDIuNC4wXG4gKiBAY2F0ZWdvcnkgRGF0ZVxuICogQHJldHVybnMge251bWJlcn0gUmV0dXJucyB0aGUgdGltZXN0YW1wLlxuICogQGV4YW1wbGVcbiAqXG4gKiBfLmRlZmVyKGZ1bmN0aW9uKHN0YW1wKSB7XG4gKiAgIGNvbnNvbGUubG9nKF8ubm93KCkgLSBzdGFtcCk7XG4gKiB9LCBfLm5vdygpKTtcbiAqIC8vID0+IExvZ3MgdGhlIG51bWJlciBvZiBtaWxsaXNlY29uZHMgaXQgdG9vayBmb3IgdGhlIGRlZmVycmVkIGludm9jYXRpb24uXG4gKi9cbnZhciBub3cgPSBmdW5jdGlvbigpIHtcbiAgcmV0dXJuIHJvb3QuRGF0ZS5ub3coKTtcbn07XG5cbi8qKlxuICogQ3JlYXRlcyBhIGRlYm91bmNlZCBmdW5jdGlvbiB0aGF0IGRlbGF5cyBpbnZva2luZyBgZnVuY2AgdW50aWwgYWZ0ZXIgYHdhaXRgXG4gKiBtaWxsaXNlY29uZHMgaGF2ZSBlbGFwc2VkIHNpbmNlIHRoZSBsYXN0IHRpbWUgdGhlIGRlYm91bmNlZCBmdW5jdGlvbiB3YXNcbiAqIGludm9rZWQuIFRoZSBkZWJvdW5jZWQgZnVuY3Rpb24gY29tZXMgd2l0aCBhIGBjYW5jZWxgIG1ldGhvZCB0byBjYW5jZWxcbiAqIGRlbGF5ZWQgYGZ1bmNgIGludm9jYXRpb25zIGFuZCBhIGBmbHVzaGAgbWV0aG9kIHRvIGltbWVkaWF0ZWx5IGludm9rZSB0aGVtLlxuICogUHJvdmlkZSBgb3B0aW9uc2AgdG8gaW5kaWNhdGUgd2hldGhlciBgZnVuY2Agc2hvdWxkIGJlIGludm9rZWQgb24gdGhlXG4gKiBsZWFkaW5nIGFuZC9vciB0cmFpbGluZyBlZGdlIG9mIHRoZSBgd2FpdGAgdGltZW91dC4gVGhlIGBmdW5jYCBpcyBpbnZva2VkXG4gKiB3aXRoIHRoZSBsYXN0IGFyZ3VtZW50cyBwcm92aWRlZCB0byB0aGUgZGVib3VuY2VkIGZ1bmN0aW9uLiBTdWJzZXF1ZW50XG4gKiBjYWxscyB0byB0aGUgZGVib3VuY2VkIGZ1bmN0aW9uIHJldHVybiB0aGUgcmVzdWx0IG9mIHRoZSBsYXN0IGBmdW5jYFxuICogaW52b2NhdGlvbi5cbiAqXG4gKiAqKk5vdGU6KiogSWYgYGxlYWRpbmdgIGFuZCBgdHJhaWxpbmdgIG9wdGlvbnMgYXJlIGB0cnVlYCwgYGZ1bmNgIGlzXG4gKiBpbnZva2VkIG9uIHRoZSB0cmFpbGluZyBlZGdlIG9mIHRoZSB0aW1lb3V0IG9ubHkgaWYgdGhlIGRlYm91bmNlZCBmdW5jdGlvblxuICogaXMgaW52b2tlZCBtb3JlIHRoYW4gb25jZSBkdXJpbmcgdGhlIGB3YWl0YCB0aW1lb3V0LlxuICpcbiAqIElmIGB3YWl0YCBpcyBgMGAgYW5kIGBsZWFkaW5nYCBpcyBgZmFsc2VgLCBgZnVuY2AgaW52b2NhdGlvbiBpcyBkZWZlcnJlZFxuICogdW50aWwgdG8gdGhlIG5leHQgdGljaywgc2ltaWxhciB0byBgc2V0VGltZW91dGAgd2l0aCBhIHRpbWVvdXQgb2YgYDBgLlxuICpcbiAqIFNlZSBbRGF2aWQgQ29yYmFjaG8ncyBhcnRpY2xlXShodHRwczovL2Nzcy10cmlja3MuY29tL2RlYm91bmNpbmctdGhyb3R0bGluZy1leHBsYWluZWQtZXhhbXBsZXMvKVxuICogZm9yIGRldGFpbHMgb3ZlciB0aGUgZGlmZmVyZW5jZXMgYmV0d2VlbiBgXy5kZWJvdW5jZWAgYW5kIGBfLnRocm90dGxlYC5cbiAqXG4gKiBAc3RhdGljXG4gKiBAbWVtYmVyT2YgX1xuICogQHNpbmNlIDAuMS4wXG4gKiBAY2F0ZWdvcnkgRnVuY3Rpb25cbiAqIEBwYXJhbSB7RnVuY3Rpb259IGZ1bmMgVGhlIGZ1bmN0aW9uIHRvIGRlYm91bmNlLlxuICogQHBhcmFtIHtudW1iZXJ9IFt3YWl0PTBdIFRoZSBudW1iZXIgb2YgbWlsbGlzZWNvbmRzIHRvIGRlbGF5LlxuICogQHBhcmFtIHtPYmplY3R9IFtvcHRpb25zPXt9XSBUaGUgb3B0aW9ucyBvYmplY3QuXG4gKiBAcGFyYW0ge2Jvb2xlYW59IFtvcHRpb25zLmxlYWRpbmc9ZmFsc2VdXG4gKiAgU3BlY2lmeSBpbnZva2luZyBvbiB0aGUgbGVhZGluZyBlZGdlIG9mIHRoZSB0aW1lb3V0LlxuICogQHBhcmFtIHtudW1iZXJ9IFtvcHRpb25zLm1heFdhaXRdXG4gKiAgVGhlIG1heGltdW0gdGltZSBgZnVuY2AgaXMgYWxsb3dlZCB0byBiZSBkZWxheWVkIGJlZm9yZSBpdCdzIGludm9rZWQuXG4gKiBAcGFyYW0ge2Jvb2xlYW59IFtvcHRpb25zLnRyYWlsaW5nPXRydWVdXG4gKiAgU3BlY2lmeSBpbnZva2luZyBvbiB0aGUgdHJhaWxpbmcgZWRnZSBvZiB0aGUgdGltZW91dC5cbiAqIEByZXR1cm5zIHtGdW5jdGlvbn0gUmV0dXJucyB0aGUgbmV3IGRlYm91bmNlZCBmdW5jdGlvbi5cbiAqIEBleGFtcGxlXG4gKlxuICogLy8gQXZvaWQgY29zdGx5IGNhbGN1bGF0aW9ucyB3aGlsZSB0aGUgd2luZG93IHNpemUgaXMgaW4gZmx1eC5cbiAqIGpRdWVyeSh3aW5kb3cpLm9uKCdyZXNpemUnLCBfLmRlYm91bmNlKGNhbGN1bGF0ZUxheW91dCwgMTUwKSk7XG4gKlxuICogLy8gSW52b2tlIGBzZW5kTWFpbGAgd2hlbiBjbGlja2VkLCBkZWJvdW5jaW5nIHN1YnNlcXVlbnQgY2FsbHMuXG4gKiBqUXVlcnkoZWxlbWVudCkub24oJ2NsaWNrJywgXy5kZWJvdW5jZShzZW5kTWFpbCwgMzAwLCB7XG4gKiAgICdsZWFkaW5nJzogdHJ1ZSxcbiAqICAgJ3RyYWlsaW5nJzogZmFsc2VcbiAqIH0pKTtcbiAqXG4gKiAvLyBFbnN1cmUgYGJhdGNoTG9nYCBpcyBpbnZva2VkIG9uY2UgYWZ0ZXIgMSBzZWNvbmQgb2YgZGVib3VuY2VkIGNhbGxzLlxuICogdmFyIGRlYm91bmNlZCA9IF8uZGVib3VuY2UoYmF0Y2hMb2csIDI1MCwgeyAnbWF4V2FpdCc6IDEwMDAgfSk7XG4gKiB2YXIgc291cmNlID0gbmV3IEV2ZW50U291cmNlKCcvc3RyZWFtJyk7XG4gKiBqUXVlcnkoc291cmNlKS5vbignbWVzc2FnZScsIGRlYm91bmNlZCk7XG4gKlxuICogLy8gQ2FuY2VsIHRoZSB0cmFpbGluZyBkZWJvdW5jZWQgaW52b2NhdGlvbi5cbiAqIGpRdWVyeSh3aW5kb3cpLm9uKCdwb3BzdGF0ZScsIGRlYm91bmNlZC5jYW5jZWwpO1xuICovXG5mdW5jdGlvbiBkZWJvdW5jZShmdW5jLCB3YWl0LCBvcHRpb25zKSB7XG4gIHZhciBsYXN0QXJncyxcbiAgICAgIGxhc3RUaGlzLFxuICAgICAgbWF4V2FpdCxcbiAgICAgIHJlc3VsdCxcbiAgICAgIHRpbWVySWQsXG4gICAgICBsYXN0Q2FsbFRpbWUsXG4gICAgICBsYXN0SW52b2tlVGltZSA9IDAsXG4gICAgICBsZWFkaW5nID0gZmFsc2UsXG4gICAgICBtYXhpbmcgPSBmYWxzZSxcbiAgICAgIHRyYWlsaW5nID0gdHJ1ZTtcblxuICBpZiAodHlwZW9mIGZ1bmMgIT0gJ2Z1bmN0aW9uJykge1xuICAgIHRocm93IG5ldyBUeXBlRXJyb3IoRlVOQ19FUlJPUl9URVhUKTtcbiAgfVxuICB3YWl0ID0gdG9OdW1iZXIod2FpdCkgfHwgMDtcbiAgaWYgKGlzT2JqZWN0KG9wdGlvbnMpKSB7XG4gICAgbGVhZGluZyA9ICEhb3B0aW9ucy5sZWFkaW5nO1xuICAgIG1heGluZyA9ICdtYXhXYWl0JyBpbiBvcHRpb25zO1xuICAgIG1heFdhaXQgPSBtYXhpbmcgPyBuYXRpdmVNYXgodG9OdW1iZXIob3B0aW9ucy5tYXhXYWl0KSB8fCAwLCB3YWl0KSA6IG1heFdhaXQ7XG4gICAgdHJhaWxpbmcgPSAndHJhaWxpbmcnIGluIG9wdGlvbnMgPyAhIW9wdGlvbnMudHJhaWxpbmcgOiB0cmFpbGluZztcbiAgfVxuXG4gIGZ1bmN0aW9uIGludm9rZUZ1bmModGltZSkge1xuICAgIHZhciBhcmdzID0gbGFzdEFyZ3MsXG4gICAgICAgIHRoaXNBcmcgPSBsYXN0VGhpcztcblxuICAgIGxhc3RBcmdzID0gbGFzdFRoaXMgPSB1bmRlZmluZWQ7XG4gICAgbGFzdEludm9rZVRpbWUgPSB0aW1lO1xuICAgIHJlc3VsdCA9IGZ1bmMuYXBwbHkodGhpc0FyZywgYXJncyk7XG4gICAgcmV0dXJuIHJlc3VsdDtcbiAgfVxuXG4gIGZ1bmN0aW9uIGxlYWRpbmdFZGdlKHRpbWUpIHtcbiAgICAvLyBSZXNldCBhbnkgYG1heFdhaXRgIHRpbWVyLlxuICAgIGxhc3RJbnZva2VUaW1lID0gdGltZTtcbiAgICAvLyBTdGFydCB0aGUgdGltZXIgZm9yIHRoZSB0cmFpbGluZyBlZGdlLlxuICAgIHRpbWVySWQgPSBzZXRUaW1lb3V0KHRpbWVyRXhwaXJlZCwgd2FpdCk7XG4gICAgLy8gSW52b2tlIHRoZSBsZWFkaW5nIGVkZ2UuXG4gICAgcmV0dXJuIGxlYWRpbmcgPyBpbnZva2VGdW5jKHRpbWUpIDogcmVzdWx0O1xuICB9XG5cbiAgZnVuY3Rpb24gcmVtYWluaW5nV2FpdCh0aW1lKSB7XG4gICAgdmFyIHRpbWVTaW5jZUxhc3RDYWxsID0gdGltZSAtIGxhc3RDYWxsVGltZSxcbiAgICAgICAgdGltZVNpbmNlTGFzdEludm9rZSA9IHRpbWUgLSBsYXN0SW52b2tlVGltZSxcbiAgICAgICAgcmVzdWx0ID0gd2FpdCAtIHRpbWVTaW5jZUxhc3RDYWxsO1xuXG4gICAgcmV0dXJuIG1heGluZyA/IG5hdGl2ZU1pbihyZXN1bHQsIG1heFdhaXQgLSB0aW1lU2luY2VMYXN0SW52b2tlKSA6IHJlc3VsdDtcbiAgfVxuXG4gIGZ1bmN0aW9uIHNob3VsZEludm9rZSh0aW1lKSB7XG4gICAgdmFyIHRpbWVTaW5jZUxhc3RDYWxsID0gdGltZSAtIGxhc3RDYWxsVGltZSxcbiAgICAgICAgdGltZVNpbmNlTGFzdEludm9rZSA9IHRpbWUgLSBsYXN0SW52b2tlVGltZTtcblxuICAgIC8vIEVpdGhlciB0aGlzIGlzIHRoZSBmaXJzdCBjYWxsLCBhY3Rpdml0eSBoYXMgc3RvcHBlZCBhbmQgd2UncmUgYXQgdGhlXG4gICAgLy8gdHJhaWxpbmcgZWRnZSwgdGhlIHN5c3RlbSB0aW1lIGhhcyBnb25lIGJhY2t3YXJkcyBhbmQgd2UncmUgdHJlYXRpbmdcbiAgICAvLyBpdCBhcyB0aGUgdHJhaWxpbmcgZWRnZSwgb3Igd2UndmUgaGl0IHRoZSBgbWF4V2FpdGAgbGltaXQuXG4gICAgcmV0dXJuIChsYXN0Q2FsbFRpbWUgPT09IHVuZGVmaW5lZCB8fCAodGltZVNpbmNlTGFzdENhbGwgPj0gd2FpdCkgfHxcbiAgICAgICh0aW1lU2luY2VMYXN0Q2FsbCA8IDApIHx8IChtYXhpbmcgJiYgdGltZVNpbmNlTGFzdEludm9rZSA+PSBtYXhXYWl0KSk7XG4gIH1cblxuICBmdW5jdGlvbiB0aW1lckV4cGlyZWQoKSB7XG4gICAgdmFyIHRpbWUgPSBub3coKTtcbiAgICBpZiAoc2hvdWxkSW52b2tlKHRpbWUpKSB7XG4gICAgICByZXR1cm4gdHJhaWxpbmdFZGdlKHRpbWUpO1xuICAgIH1cbiAgICAvLyBSZXN0YXJ0IHRoZSB0aW1lci5cbiAgICB0aW1lcklkID0gc2V0VGltZW91dCh0aW1lckV4cGlyZWQsIHJlbWFpbmluZ1dhaXQodGltZSkpO1xuICB9XG5cbiAgZnVuY3Rpb24gdHJhaWxpbmdFZGdlKHRpbWUpIHtcbiAgICB0aW1lcklkID0gdW5kZWZpbmVkO1xuXG4gICAgLy8gT25seSBpbnZva2UgaWYgd2UgaGF2ZSBgbGFzdEFyZ3NgIHdoaWNoIG1lYW5zIGBmdW5jYCBoYXMgYmVlblxuICAgIC8vIGRlYm91bmNlZCBhdCBsZWFzdCBvbmNlLlxuICAgIGlmICh0cmFpbGluZyAmJiBsYXN0QXJncykge1xuICAgICAgcmV0dXJuIGludm9rZUZ1bmModGltZSk7XG4gICAgfVxuICAgIGxhc3RBcmdzID0gbGFzdFRoaXMgPSB1bmRlZmluZWQ7XG4gICAgcmV0dXJuIHJlc3VsdDtcbiAgfVxuXG4gIGZ1bmN0aW9uIGNhbmNlbCgpIHtcbiAgICBpZiAodGltZXJJZCAhPT0gdW5kZWZpbmVkKSB7XG4gICAgICBjbGVhclRpbWVvdXQodGltZXJJZCk7XG4gICAgfVxuICAgIGxhc3RJbnZva2VUaW1lID0gMDtcbiAgICBsYXN0QXJncyA9IGxhc3RDYWxsVGltZSA9IGxhc3RUaGlzID0gdGltZXJJZCA9IHVuZGVmaW5lZDtcbiAgfVxuXG4gIGZ1bmN0aW9uIGZsdXNoKCkge1xuICAgIHJldHVybiB0aW1lcklkID09PSB1bmRlZmluZWQgPyByZXN1bHQgOiB0cmFpbGluZ0VkZ2Uobm93KCkpO1xuICB9XG5cbiAgZnVuY3Rpb24gZGVib3VuY2VkKCkge1xuICAgIHZhciB0aW1lID0gbm93KCksXG4gICAgICAgIGlzSW52b2tpbmcgPSBzaG91bGRJbnZva2UodGltZSk7XG5cbiAgICBsYXN0QXJncyA9IGFyZ3VtZW50cztcbiAgICBsYXN0VGhpcyA9IHRoaXM7XG4gICAgbGFzdENhbGxUaW1lID0gdGltZTtcblxuICAgIGlmIChpc0ludm9raW5nKSB7XG4gICAgICBpZiAodGltZXJJZCA9PT0gdW5kZWZpbmVkKSB7XG4gICAgICAgIHJldHVybiBsZWFkaW5nRWRnZShsYXN0Q2FsbFRpbWUpO1xuICAgICAgfVxuICAgICAgaWYgKG1heGluZykge1xuICAgICAgICAvLyBIYW5kbGUgaW52b2NhdGlvbnMgaW4gYSB0aWdodCBsb29wLlxuICAgICAgICB0aW1lcklkID0gc2V0VGltZW91dCh0aW1lckV4cGlyZWQsIHdhaXQpO1xuICAgICAgICByZXR1cm4gaW52b2tlRnVuYyhsYXN0Q2FsbFRpbWUpO1xuICAgICAgfVxuICAgIH1cbiAgICBpZiAodGltZXJJZCA9PT0gdW5kZWZpbmVkKSB7XG4gICAgICB0aW1lcklkID0gc2V0VGltZW91dCh0aW1lckV4cGlyZWQsIHdhaXQpO1xuICAgIH1cbiAgICByZXR1cm4gcmVzdWx0O1xuICB9XG4gIGRlYm91bmNlZC5jYW5jZWwgPSBjYW5jZWw7XG4gIGRlYm91bmNlZC5mbHVzaCA9IGZsdXNoO1xuICByZXR1cm4gZGVib3VuY2VkO1xufVxuXG4vKipcbiAqIENyZWF0ZXMgYSB0aHJvdHRsZWQgZnVuY3Rpb24gdGhhdCBvbmx5IGludm9rZXMgYGZ1bmNgIGF0IG1vc3Qgb25jZSBwZXJcbiAqIGV2ZXJ5IGB3YWl0YCBtaWxsaXNlY29uZHMuIFRoZSB0aHJvdHRsZWQgZnVuY3Rpb24gY29tZXMgd2l0aCBhIGBjYW5jZWxgXG4gKiBtZXRob2QgdG8gY2FuY2VsIGRlbGF5ZWQgYGZ1bmNgIGludm9jYXRpb25zIGFuZCBhIGBmbHVzaGAgbWV0aG9kIHRvXG4gKiBpbW1lZGlhdGVseSBpbnZva2UgdGhlbS4gUHJvdmlkZSBgb3B0aW9uc2AgdG8gaW5kaWNhdGUgd2hldGhlciBgZnVuY2BcbiAqIHNob3VsZCBiZSBpbnZva2VkIG9uIHRoZSBsZWFkaW5nIGFuZC9vciB0cmFpbGluZyBlZGdlIG9mIHRoZSBgd2FpdGBcbiAqIHRpbWVvdXQuIFRoZSBgZnVuY2AgaXMgaW52b2tlZCB3aXRoIHRoZSBsYXN0IGFyZ3VtZW50cyBwcm92aWRlZCB0byB0aGVcbiAqIHRocm90dGxlZCBmdW5jdGlvbi4gU3Vic2VxdWVudCBjYWxscyB0byB0aGUgdGhyb3R0bGVkIGZ1bmN0aW9uIHJldHVybiB0aGVcbiAqIHJlc3VsdCBvZiB0aGUgbGFzdCBgZnVuY2AgaW52b2NhdGlvbi5cbiAqXG4gKiAqKk5vdGU6KiogSWYgYGxlYWRpbmdgIGFuZCBgdHJhaWxpbmdgIG9wdGlvbnMgYXJlIGB0cnVlYCwgYGZ1bmNgIGlzXG4gKiBpbnZva2VkIG9uIHRoZSB0cmFpbGluZyBlZGdlIG9mIHRoZSB0aW1lb3V0IG9ubHkgaWYgdGhlIHRocm90dGxlZCBmdW5jdGlvblxuICogaXMgaW52b2tlZCBtb3JlIHRoYW4gb25jZSBkdXJpbmcgdGhlIGB3YWl0YCB0aW1lb3V0LlxuICpcbiAqIElmIGB3YWl0YCBpcyBgMGAgYW5kIGBsZWFkaW5nYCBpcyBgZmFsc2VgLCBgZnVuY2AgaW52b2NhdGlvbiBpcyBkZWZlcnJlZFxuICogdW50aWwgdG8gdGhlIG5leHQgdGljaywgc2ltaWxhciB0byBgc2V0VGltZW91dGAgd2l0aCBhIHRpbWVvdXQgb2YgYDBgLlxuICpcbiAqIFNlZSBbRGF2aWQgQ29yYmFjaG8ncyBhcnRpY2xlXShodHRwczovL2Nzcy10cmlja3MuY29tL2RlYm91bmNpbmctdGhyb3R0bGluZy1leHBsYWluZWQtZXhhbXBsZXMvKVxuICogZm9yIGRldGFpbHMgb3ZlciB0aGUgZGlmZmVyZW5jZXMgYmV0d2VlbiBgXy50aHJvdHRsZWAgYW5kIGBfLmRlYm91bmNlYC5cbiAqXG4gKiBAc3RhdGljXG4gKiBAbWVtYmVyT2YgX1xuICogQHNpbmNlIDAuMS4wXG4gKiBAY2F0ZWdvcnkgRnVuY3Rpb25cbiAqIEBwYXJhbSB7RnVuY3Rpb259IGZ1bmMgVGhlIGZ1bmN0aW9uIHRvIHRocm90dGxlLlxuICogQHBhcmFtIHtudW1iZXJ9IFt3YWl0PTBdIFRoZSBudW1iZXIgb2YgbWlsbGlzZWNvbmRzIHRvIHRocm90dGxlIGludm9jYXRpb25zIHRvLlxuICogQHBhcmFtIHtPYmplY3R9IFtvcHRpb25zPXt9XSBUaGUgb3B0aW9ucyBvYmplY3QuXG4gKiBAcGFyYW0ge2Jvb2xlYW59IFtvcHRpb25zLmxlYWRpbmc9dHJ1ZV1cbiAqICBTcGVjaWZ5IGludm9raW5nIG9uIHRoZSBsZWFkaW5nIGVkZ2Ugb2YgdGhlIHRpbWVvdXQuXG4gKiBAcGFyYW0ge2Jvb2xlYW59IFtvcHRpb25zLnRyYWlsaW5nPXRydWVdXG4gKiAgU3BlY2lmeSBpbnZva2luZyBvbiB0aGUgdHJhaWxpbmcgZWRnZSBvZiB0aGUgdGltZW91dC5cbiAqIEByZXR1cm5zIHtGdW5jdGlvbn0gUmV0dXJucyB0aGUgbmV3IHRocm90dGxlZCBmdW5jdGlvbi5cbiAqIEBleGFtcGxlXG4gKlxuICogLy8gQXZvaWQgZXhjZXNzaXZlbHkgdXBkYXRpbmcgdGhlIHBvc2l0aW9uIHdoaWxlIHNjcm9sbGluZy5cbiAqIGpRdWVyeSh3aW5kb3cpLm9uKCdzY3JvbGwnLCBfLnRocm90dGxlKHVwZGF0ZVBvc2l0aW9uLCAxMDApKTtcbiAqXG4gKiAvLyBJbnZva2UgYHJlbmV3VG9rZW5gIHdoZW4gdGhlIGNsaWNrIGV2ZW50IGlzIGZpcmVkLCBidXQgbm90IG1vcmUgdGhhbiBvbmNlIGV2ZXJ5IDUgbWludXRlcy5cbiAqIHZhciB0aHJvdHRsZWQgPSBfLnRocm90dGxlKHJlbmV3VG9rZW4sIDMwMDAwMCwgeyAndHJhaWxpbmcnOiBmYWxzZSB9KTtcbiAqIGpRdWVyeShlbGVtZW50KS5vbignY2xpY2snLCB0aHJvdHRsZWQpO1xuICpcbiAqIC8vIENhbmNlbCB0aGUgdHJhaWxpbmcgdGhyb3R0bGVkIGludm9jYXRpb24uXG4gKiBqUXVlcnkod2luZG93KS5vbigncG9wc3RhdGUnLCB0aHJvdHRsZWQuY2FuY2VsKTtcbiAqL1xuZnVuY3Rpb24gdGhyb3R0bGUoZnVuYywgd2FpdCwgb3B0aW9ucykge1xuICB2YXIgbGVhZGluZyA9IHRydWUsXG4gICAgICB0cmFpbGluZyA9IHRydWU7XG5cbiAgaWYgKHR5cGVvZiBmdW5jICE9ICdmdW5jdGlvbicpIHtcbiAgICB0aHJvdyBuZXcgVHlwZUVycm9yKEZVTkNfRVJST1JfVEVYVCk7XG4gIH1cbiAgaWYgKGlzT2JqZWN0KG9wdGlvbnMpKSB7XG4gICAgbGVhZGluZyA9ICdsZWFkaW5nJyBpbiBvcHRpb25zID8gISFvcHRpb25zLmxlYWRpbmcgOiBsZWFkaW5nO1xuICAgIHRyYWlsaW5nID0gJ3RyYWlsaW5nJyBpbiBvcHRpb25zID8gISFvcHRpb25zLnRyYWlsaW5nIDogdHJhaWxpbmc7XG4gIH1cbiAgcmV0dXJuIGRlYm91bmNlKGZ1bmMsIHdhaXQsIHtcbiAgICAnbGVhZGluZyc6IGxlYWRpbmcsXG4gICAgJ21heFdhaXQnOiB3YWl0LFxuICAgICd0cmFpbGluZyc6IHRyYWlsaW5nXG4gIH0pO1xufVxuXG4vKipcbiAqIENoZWNrcyBpZiBgdmFsdWVgIGlzIHRoZVxuICogW2xhbmd1YWdlIHR5cGVdKGh0dHA6Ly93d3cuZWNtYS1pbnRlcm5hdGlvbmFsLm9yZy9lY21hLTI2Mi83LjAvI3NlYy1lY21hc2NyaXB0LWxhbmd1YWdlLXR5cGVzKVxuICogb2YgYE9iamVjdGAuIChlLmcuIGFycmF5cywgZnVuY3Rpb25zLCBvYmplY3RzLCByZWdleGVzLCBgbmV3IE51bWJlcigwKWAsIGFuZCBgbmV3IFN0cmluZygnJylgKVxuICpcbiAqIEBzdGF0aWNcbiAqIEBtZW1iZXJPZiBfXG4gKiBAc2luY2UgMC4xLjBcbiAqIEBjYXRlZ29yeSBMYW5nXG4gKiBAcGFyYW0geyp9IHZhbHVlIFRoZSB2YWx1ZSB0byBjaGVjay5cbiAqIEByZXR1cm5zIHtib29sZWFufSBSZXR1cm5zIGB0cnVlYCBpZiBgdmFsdWVgIGlzIGFuIG9iamVjdCwgZWxzZSBgZmFsc2VgLlxuICogQGV4YW1wbGVcbiAqXG4gKiBfLmlzT2JqZWN0KHt9KTtcbiAqIC8vID0+IHRydWVcbiAqXG4gKiBfLmlzT2JqZWN0KFsxLCAyLCAzXSk7XG4gKiAvLyA9PiB0cnVlXG4gKlxuICogXy5pc09iamVjdChfLm5vb3ApO1xuICogLy8gPT4gdHJ1ZVxuICpcbiAqIF8uaXNPYmplY3QobnVsbCk7XG4gKiAvLyA9PiBmYWxzZVxuICovXG5mdW5jdGlvbiBpc09iamVjdCh2YWx1ZSkge1xuICB2YXIgdHlwZSA9IHR5cGVvZiB2YWx1ZTtcbiAgcmV0dXJuICEhdmFsdWUgJiYgKHR5cGUgPT0gJ29iamVjdCcgfHwgdHlwZSA9PSAnZnVuY3Rpb24nKTtcbn1cblxuLyoqXG4gKiBDaGVja3MgaWYgYHZhbHVlYCBpcyBvYmplY3QtbGlrZS4gQSB2YWx1ZSBpcyBvYmplY3QtbGlrZSBpZiBpdCdzIG5vdCBgbnVsbGBcbiAqIGFuZCBoYXMgYSBgdHlwZW9mYCByZXN1bHQgb2YgXCJvYmplY3RcIi5cbiAqXG4gKiBAc3RhdGljXG4gKiBAbWVtYmVyT2YgX1xuICogQHNpbmNlIDQuMC4wXG4gKiBAY2F0ZWdvcnkgTGFuZ1xuICogQHBhcmFtIHsqfSB2YWx1ZSBUaGUgdmFsdWUgdG8gY2hlY2suXG4gKiBAcmV0dXJucyB7Ym9vbGVhbn0gUmV0dXJucyBgdHJ1ZWAgaWYgYHZhbHVlYCBpcyBvYmplY3QtbGlrZSwgZWxzZSBgZmFsc2VgLlxuICogQGV4YW1wbGVcbiAqXG4gKiBfLmlzT2JqZWN0TGlrZSh7fSk7XG4gKiAvLyA9PiB0cnVlXG4gKlxuICogXy5pc09iamVjdExpa2UoWzEsIDIsIDNdKTtcbiAqIC8vID0+IHRydWVcbiAqXG4gKiBfLmlzT2JqZWN0TGlrZShfLm5vb3ApO1xuICogLy8gPT4gZmFsc2VcbiAqXG4gKiBfLmlzT2JqZWN0TGlrZShudWxsKTtcbiAqIC8vID0+IGZhbHNlXG4gKi9cbmZ1bmN0aW9uIGlzT2JqZWN0TGlrZSh2YWx1ZSkge1xuICByZXR1cm4gISF2YWx1ZSAmJiB0eXBlb2YgdmFsdWUgPT0gJ29iamVjdCc7XG59XG5cbi8qKlxuICogQ2hlY2tzIGlmIGB2YWx1ZWAgaXMgY2xhc3NpZmllZCBhcyBhIGBTeW1ib2xgIHByaW1pdGl2ZSBvciBvYmplY3QuXG4gKlxuICogQHN0YXRpY1xuICogQG1lbWJlck9mIF9cbiAqIEBzaW5jZSA0LjAuMFxuICogQGNhdGVnb3J5IExhbmdcbiAqIEBwYXJhbSB7Kn0gdmFsdWUgVGhlIHZhbHVlIHRvIGNoZWNrLlxuICogQHJldHVybnMge2Jvb2xlYW59IFJldHVybnMgYHRydWVgIGlmIGB2YWx1ZWAgaXMgYSBzeW1ib2wsIGVsc2UgYGZhbHNlYC5cbiAqIEBleGFtcGxlXG4gKlxuICogXy5pc1N5bWJvbChTeW1ib2wuaXRlcmF0b3IpO1xuICogLy8gPT4gdHJ1ZVxuICpcbiAqIF8uaXNTeW1ib2woJ2FiYycpO1xuICogLy8gPT4gZmFsc2VcbiAqL1xuZnVuY3Rpb24gaXNTeW1ib2wodmFsdWUpIHtcbiAgcmV0dXJuIHR5cGVvZiB2YWx1ZSA9PSAnc3ltYm9sJyB8fFxuICAgIChpc09iamVjdExpa2UodmFsdWUpICYmIG9iamVjdFRvU3RyaW5nLmNhbGwodmFsdWUpID09IHN5bWJvbFRhZyk7XG59XG5cbi8qKlxuICogQ29udmVydHMgYHZhbHVlYCB0byBhIG51bWJlci5cbiAqXG4gKiBAc3RhdGljXG4gKiBAbWVtYmVyT2YgX1xuICogQHNpbmNlIDQuMC4wXG4gKiBAY2F0ZWdvcnkgTGFuZ1xuICogQHBhcmFtIHsqfSB2YWx1ZSBUaGUgdmFsdWUgdG8gcHJvY2Vzcy5cbiAqIEByZXR1cm5zIHtudW1iZXJ9IFJldHVybnMgdGhlIG51bWJlci5cbiAqIEBleGFtcGxlXG4gKlxuICogXy50b051bWJlcigzLjIpO1xuICogLy8gPT4gMy4yXG4gKlxuICogXy50b051bWJlcihOdW1iZXIuTUlOX1ZBTFVFKTtcbiAqIC8vID0+IDVlLTMyNFxuICpcbiAqIF8udG9OdW1iZXIoSW5maW5pdHkpO1xuICogLy8gPT4gSW5maW5pdHlcbiAqXG4gKiBfLnRvTnVtYmVyKCczLjInKTtcbiAqIC8vID0+IDMuMlxuICovXG5mdW5jdGlvbiB0b051bWJlcih2YWx1ZSkge1xuICBpZiAodHlwZW9mIHZhbHVlID09ICdudW1iZXInKSB7XG4gICAgcmV0dXJuIHZhbHVlO1xuICB9XG4gIGlmIChpc1N5bWJvbCh2YWx1ZSkpIHtcbiAgICByZXR1cm4gTkFOO1xuICB9XG4gIGlmIChpc09iamVjdCh2YWx1ZSkpIHtcbiAgICB2YXIgb3RoZXIgPSB0eXBlb2YgdmFsdWUudmFsdWVPZiA9PSAnZnVuY3Rpb24nID8gdmFsdWUudmFsdWVPZigpIDogdmFsdWU7XG4gICAgdmFsdWUgPSBpc09iamVjdChvdGhlcikgPyAob3RoZXIgKyAnJykgOiBvdGhlcjtcbiAgfVxuICBpZiAodHlwZW9mIHZhbHVlICE9ICdzdHJpbmcnKSB7XG4gICAgcmV0dXJuIHZhbHVlID09PSAwID8gdmFsdWUgOiArdmFsdWU7XG4gIH1cbiAgdmFsdWUgPSB2YWx1ZS5yZXBsYWNlKHJlVHJpbSwgJycpO1xuICB2YXIgaXNCaW5hcnkgPSByZUlzQmluYXJ5LnRlc3QodmFsdWUpO1xuICByZXR1cm4gKGlzQmluYXJ5IHx8IHJlSXNPY3RhbC50ZXN0KHZhbHVlKSlcbiAgICA/IGZyZWVQYXJzZUludCh2YWx1ZS5zbGljZSgyKSwgaXNCaW5hcnkgPyAyIDogOClcbiAgICA6IChyZUlzQmFkSGV4LnRlc3QodmFsdWUpID8gTkFOIDogK3ZhbHVlKTtcbn1cblxubW9kdWxlLmV4cG9ydHMgPSB0aHJvdHRsZTtcbiIsInZhciB3aWxkY2FyZCA9IHJlcXVpcmUoJ3dpbGRjYXJkJyk7XG52YXIgcmVNaW1lUGFydFNwbGl0ID0gL1tcXC9cXCtcXC5dLztcblxuLyoqXG4gICMgbWltZS1tYXRjaFxuXG4gIEEgc2ltcGxlIGZ1bmN0aW9uIHRvIGNoZWNrZXIgd2hldGhlciBhIHRhcmdldCBtaW1lIHR5cGUgbWF0Y2hlcyBhIG1pbWUtdHlwZVxuICBwYXR0ZXJuIChlLmcuIGltYWdlL2pwZWcgbWF0Y2hlcyBpbWFnZS9qcGVnIE9SIGltYWdlLyopLlxuXG4gICMjIEV4YW1wbGUgVXNhZ2VcblxuICA8PDwgZXhhbXBsZS5qc1xuXG4qKi9cbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24odGFyZ2V0LCBwYXR0ZXJuKSB7XG4gIGZ1bmN0aW9uIHRlc3QocGF0dGVybikge1xuICAgIHZhciByZXN1bHQgPSB3aWxkY2FyZChwYXR0ZXJuLCB0YXJnZXQsIHJlTWltZVBhcnRTcGxpdCk7XG5cbiAgICAvLyBlbnN1cmUgdGhhdCB3ZSBoYXZlIGEgdmFsaWQgbWltZSB0eXBlIChzaG91bGQgaGF2ZSB0d28gcGFydHMpXG4gICAgcmV0dXJuIHJlc3VsdCAmJiByZXN1bHQubGVuZ3RoID49IDI7XG4gIH1cblxuICByZXR1cm4gcGF0dGVybiA/IHRlc3QocGF0dGVybi5zcGxpdCgnOycpWzBdKSA6IHRlc3Q7XG59O1xuIiwiLyoqXG4qIENyZWF0ZSBhbiBldmVudCBlbWl0dGVyIHdpdGggbmFtZXNwYWNlc1xuKiBAbmFtZSBjcmVhdGVOYW1lc3BhY2VFbWl0dGVyXG4qIEBleGFtcGxlXG4qIHZhciBlbWl0dGVyID0gcmVxdWlyZSgnLi9pbmRleCcpKClcbipcbiogZW1pdHRlci5vbignKicsIGZ1bmN0aW9uICgpIHtcbiogICBjb25zb2xlLmxvZygnYWxsIGV2ZW50cyBlbWl0dGVkJywgdGhpcy5ldmVudClcbiogfSlcbipcbiogZW1pdHRlci5vbignZXhhbXBsZScsIGZ1bmN0aW9uICgpIHtcbiogICBjb25zb2xlLmxvZygnZXhhbXBsZSBldmVudCBlbWl0dGVkJylcbiogfSlcbiovXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIGNyZWF0ZU5hbWVzcGFjZUVtaXR0ZXIgKCkge1xuICB2YXIgZW1pdHRlciA9IHt9XG4gIHZhciBfZm5zID0gZW1pdHRlci5fZm5zID0ge31cblxuICAvKipcbiAgKiBFbWl0IGFuIGV2ZW50LiBPcHRpb25hbGx5IG5hbWVzcGFjZSB0aGUgZXZlbnQuIEhhbmRsZXJzIGFyZSBmaXJlZCBpbiB0aGUgb3JkZXIgaW4gd2hpY2ggdGhleSB3ZXJlIGFkZGVkIHdpdGggZXhhY3QgbWF0Y2hlcyB0YWtpbmcgcHJlY2VkZW5jZS4gU2VwYXJhdGUgdGhlIG5hbWVzcGFjZSBhbmQgZXZlbnQgd2l0aCBhIGA6YFxuICAqIEBuYW1lIGVtaXRcbiAgKiBAcGFyYW0ge1N0cmluZ30gZXZlbnQg4oCTIHRoZSBuYW1lIG9mIHRoZSBldmVudCwgd2l0aCBvcHRpb25hbCBuYW1lc3BhY2VcbiAgKiBAcGFyYW0gey4uLip9IGRhdGEg4oCTIHVwIHRvIDYgYXJndW1lbnRzIHRoYXQgYXJlIHBhc3NlZCB0byB0aGUgZXZlbnQgbGlzdGVuZXJcbiAgKiBAZXhhbXBsZVxuICAqIGVtaXR0ZXIuZW1pdCgnZXhhbXBsZScpXG4gICogZW1pdHRlci5lbWl0KCdkZW1vOnRlc3QnKVxuICAqIGVtaXR0ZXIuZW1pdCgnZGF0YScsIHsgZXhhbXBsZTogdHJ1ZX0sICdhIHN0cmluZycsIDEpXG4gICovXG4gIGVtaXR0ZXIuZW1pdCA9IGZ1bmN0aW9uIGVtaXQgKGV2ZW50LCBhcmcxLCBhcmcyLCBhcmczLCBhcmc0LCBhcmc1LCBhcmc2KSB7XG4gICAgdmFyIHRvRW1pdCA9IGdldExpc3RlbmVycyhldmVudClcblxuICAgIGlmICh0b0VtaXQubGVuZ3RoKSB7XG4gICAgICBlbWl0QWxsKGV2ZW50LCB0b0VtaXQsIFthcmcxLCBhcmcyLCBhcmczLCBhcmc0LCBhcmc1LCBhcmc2XSlcbiAgICB9XG4gIH1cblxuICAvKipcbiAgKiBDcmVhdGUgZW4gZXZlbnQgbGlzdGVuZXIuXG4gICogQG5hbWUgb25cbiAgKiBAcGFyYW0ge1N0cmluZ30gZXZlbnRcbiAgKiBAcGFyYW0ge0Z1bmN0aW9ufSBmblxuICAqIEBleGFtcGxlXG4gICogZW1pdHRlci5vbignZXhhbXBsZScsIGZ1bmN0aW9uICgpIHt9KVxuICAqIGVtaXR0ZXIub24oJ2RlbW8nLCBmdW5jdGlvbiAoKSB7fSlcbiAgKi9cbiAgZW1pdHRlci5vbiA9IGZ1bmN0aW9uIG9uIChldmVudCwgZm4pIHtcbiAgICBpZiAoIV9mbnNbZXZlbnRdKSB7XG4gICAgICBfZm5zW2V2ZW50XSA9IFtdXG4gICAgfVxuXG4gICAgX2Zuc1tldmVudF0ucHVzaChmbilcbiAgfVxuXG4gIC8qKlxuICAqIENyZWF0ZSBlbiBldmVudCBsaXN0ZW5lciB0aGF0IGZpcmVzIG9uY2UuXG4gICogQG5hbWUgb25jZVxuICAqIEBwYXJhbSB7U3RyaW5nfSBldmVudFxuICAqIEBwYXJhbSB7RnVuY3Rpb259IGZuXG4gICogQGV4YW1wbGVcbiAgKiBlbWl0dGVyLm9uY2UoJ2V4YW1wbGUnLCBmdW5jdGlvbiAoKSB7fSlcbiAgKiBlbWl0dGVyLm9uY2UoJ2RlbW8nLCBmdW5jdGlvbiAoKSB7fSlcbiAgKi9cbiAgZW1pdHRlci5vbmNlID0gZnVuY3Rpb24gb25jZSAoZXZlbnQsIGZuKSB7XG4gICAgZnVuY3Rpb24gb25lICgpIHtcbiAgICAgIGZuLmFwcGx5KHRoaXMsIGFyZ3VtZW50cylcbiAgICAgIGVtaXR0ZXIub2ZmKGV2ZW50LCBvbmUpXG4gICAgfVxuICAgIHRoaXMub24oZXZlbnQsIG9uZSlcbiAgfVxuXG4gIC8qKlxuICAqIFN0b3AgbGlzdGVuaW5nIHRvIGFuIGV2ZW50LiBTdG9wIGFsbCBsaXN0ZW5lcnMgb24gYW4gZXZlbnQgYnkgb25seSBwYXNzaW5nIHRoZSBldmVudCBuYW1lLiBTdG9wIGEgc2luZ2xlIGxpc3RlbmVyIGJ5IHBhc3NpbmcgdGhhdCBldmVudCBoYW5kbGVyIGFzIGEgY2FsbGJhY2suXG4gICogWW91IG11c3QgYmUgZXhwbGljaXQgYWJvdXQgd2hhdCB3aWxsIGJlIHVuc3Vic2NyaWJlZDogYGVtaXR0ZXIub2ZmKCdkZW1vJylgIHdpbGwgdW5zdWJzY3JpYmUgYW4gYGVtaXR0ZXIub24oJ2RlbW8nKWAgbGlzdGVuZXIsXG4gICogYGVtaXR0ZXIub2ZmKCdkZW1vOmV4YW1wbGUnKWAgd2lsbCB1bnN1YnNjcmliZSBhbiBgZW1pdHRlci5vbignZGVtbzpleGFtcGxlJylgIGxpc3RlbmVyXG4gICogQG5hbWUgb2ZmXG4gICogQHBhcmFtIHtTdHJpbmd9IGV2ZW50XG4gICogQHBhcmFtIHtGdW5jdGlvbn0gW2ZuXSDigJMgdGhlIHNwZWNpZmljIGhhbmRsZXJcbiAgKiBAZXhhbXBsZVxuICAqIGVtaXR0ZXIub2ZmKCdleGFtcGxlJylcbiAgKiBlbWl0dGVyLm9mZignZGVtbycsIGZ1bmN0aW9uICgpIHt9KVxuICAqL1xuICBlbWl0dGVyLm9mZiA9IGZ1bmN0aW9uIG9mZiAoZXZlbnQsIGZuKSB7XG4gICAgdmFyIGtlZXAgPSBbXVxuXG4gICAgaWYgKGV2ZW50ICYmIGZuKSB7XG4gICAgICB2YXIgZm5zID0gdGhpcy5fZm5zW2V2ZW50XVxuICAgICAgdmFyIGkgPSAwXG4gICAgICB2YXIgbCA9IGZucyA/IGZucy5sZW5ndGggOiAwXG5cbiAgICAgIGZvciAoaTsgaSA8IGw7IGkrKykge1xuICAgICAgICBpZiAoZm5zW2ldICE9PSBmbikge1xuICAgICAgICAgIGtlZXAucHVzaChmbnNbaV0pXG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9XG5cbiAgICBrZWVwLmxlbmd0aCA/IHRoaXMuX2Zuc1tldmVudF0gPSBrZWVwIDogZGVsZXRlIHRoaXMuX2Zuc1tldmVudF1cbiAgfVxuXG4gIGZ1bmN0aW9uIGdldExpc3RlbmVycyAoZSkge1xuICAgIHZhciBvdXQgPSBfZm5zW2VdID8gX2Zuc1tlXSA6IFtdXG4gICAgdmFyIGlkeCA9IGUuaW5kZXhPZignOicpXG4gICAgdmFyIGFyZ3MgPSAoaWR4ID09PSAtMSkgPyBbZV0gOiBbZS5zdWJzdHJpbmcoMCwgaWR4KSwgZS5zdWJzdHJpbmcoaWR4ICsgMSldXG5cbiAgICB2YXIga2V5cyA9IE9iamVjdC5rZXlzKF9mbnMpXG4gICAgdmFyIGkgPSAwXG4gICAgdmFyIGwgPSBrZXlzLmxlbmd0aFxuXG4gICAgZm9yIChpOyBpIDwgbDsgaSsrKSB7XG4gICAgICB2YXIga2V5ID0ga2V5c1tpXVxuICAgICAgaWYgKGtleSA9PT0gJyonKSB7XG4gICAgICAgIG91dCA9IG91dC5jb25jYXQoX2Zuc1trZXldKVxuICAgICAgfVxuXG4gICAgICBpZiAoYXJncy5sZW5ndGggPT09IDIgJiYgYXJnc1swXSA9PT0ga2V5KSB7XG4gICAgICAgIG91dCA9IG91dC5jb25jYXQoX2Zuc1trZXldKVxuICAgICAgICBicmVha1xuICAgICAgfVxuICAgIH1cblxuICAgIHJldHVybiBvdXRcbiAgfVxuXG4gIGZ1bmN0aW9uIGVtaXRBbGwgKGUsIGZucywgYXJncykge1xuICAgIHZhciBpID0gMFxuICAgIHZhciBsID0gZm5zLmxlbmd0aFxuXG4gICAgZm9yIChpOyBpIDwgbDsgaSsrKSB7XG4gICAgICBpZiAoIWZuc1tpXSkgYnJlYWtcbiAgICAgIGZuc1tpXS5ldmVudCA9IGVcbiAgICAgIGZuc1tpXS5hcHBseShmbnNbaV0sIGFyZ3MpXG4gICAgfVxuICB9XG5cbiAgcmV0dXJuIGVtaXR0ZXJcbn1cbiIsIiFmdW5jdGlvbigpIHtcbiAgICAndXNlIHN0cmljdCc7XG4gICAgZnVuY3Rpb24gVk5vZGUoKSB7fVxuICAgIGZ1bmN0aW9uIGgobm9kZU5hbWUsIGF0dHJpYnV0ZXMpIHtcbiAgICAgICAgdmFyIGxhc3RTaW1wbGUsIGNoaWxkLCBzaW1wbGUsIGksIGNoaWxkcmVuID0gRU1QVFlfQ0hJTERSRU47XG4gICAgICAgIGZvciAoaSA9IGFyZ3VtZW50cy5sZW5ndGg7IGktLSA+IDI7ICkgc3RhY2sucHVzaChhcmd1bWVudHNbaV0pO1xuICAgICAgICBpZiAoYXR0cmlidXRlcyAmJiBudWxsICE9IGF0dHJpYnV0ZXMuY2hpbGRyZW4pIHtcbiAgICAgICAgICAgIGlmICghc3RhY2subGVuZ3RoKSBzdGFjay5wdXNoKGF0dHJpYnV0ZXMuY2hpbGRyZW4pO1xuICAgICAgICAgICAgZGVsZXRlIGF0dHJpYnV0ZXMuY2hpbGRyZW47XG4gICAgICAgIH1cbiAgICAgICAgd2hpbGUgKHN0YWNrLmxlbmd0aCkgaWYgKChjaGlsZCA9IHN0YWNrLnBvcCgpKSAmJiB2b2lkIDAgIT09IGNoaWxkLnBvcCkgZm9yIChpID0gY2hpbGQubGVuZ3RoOyBpLS07ICkgc3RhY2sucHVzaChjaGlsZFtpXSk7IGVsc2Uge1xuICAgICAgICAgICAgaWYgKCdib29sZWFuJyA9PSB0eXBlb2YgY2hpbGQpIGNoaWxkID0gbnVsbDtcbiAgICAgICAgICAgIGlmIChzaW1wbGUgPSAnZnVuY3Rpb24nICE9IHR5cGVvZiBub2RlTmFtZSkgaWYgKG51bGwgPT0gY2hpbGQpIGNoaWxkID0gJyc7IGVsc2UgaWYgKCdudW1iZXInID09IHR5cGVvZiBjaGlsZCkgY2hpbGQgPSBTdHJpbmcoY2hpbGQpOyBlbHNlIGlmICgnc3RyaW5nJyAhPSB0eXBlb2YgY2hpbGQpIHNpbXBsZSA9ICExO1xuICAgICAgICAgICAgaWYgKHNpbXBsZSAmJiBsYXN0U2ltcGxlKSBjaGlsZHJlbltjaGlsZHJlbi5sZW5ndGggLSAxXSArPSBjaGlsZDsgZWxzZSBpZiAoY2hpbGRyZW4gPT09IEVNUFRZX0NISUxEUkVOKSBjaGlsZHJlbiA9IFsgY2hpbGQgXTsgZWxzZSBjaGlsZHJlbi5wdXNoKGNoaWxkKTtcbiAgICAgICAgICAgIGxhc3RTaW1wbGUgPSBzaW1wbGU7XG4gICAgICAgIH1cbiAgICAgICAgdmFyIHAgPSBuZXcgVk5vZGUoKTtcbiAgICAgICAgcC5ub2RlTmFtZSA9IG5vZGVOYW1lO1xuICAgICAgICBwLmNoaWxkcmVuID0gY2hpbGRyZW47XG4gICAgICAgIHAuYXR0cmlidXRlcyA9IG51bGwgPT0gYXR0cmlidXRlcyA/IHZvaWQgMCA6IGF0dHJpYnV0ZXM7XG4gICAgICAgIHAua2V5ID0gbnVsbCA9PSBhdHRyaWJ1dGVzID8gdm9pZCAwIDogYXR0cmlidXRlcy5rZXk7XG4gICAgICAgIGlmICh2b2lkIDAgIT09IG9wdGlvbnMudm5vZGUpIG9wdGlvbnMudm5vZGUocCk7XG4gICAgICAgIHJldHVybiBwO1xuICAgIH1cbiAgICBmdW5jdGlvbiBleHRlbmQob2JqLCBwcm9wcykge1xuICAgICAgICBmb3IgKHZhciBpIGluIHByb3BzKSBvYmpbaV0gPSBwcm9wc1tpXTtcbiAgICAgICAgcmV0dXJuIG9iajtcbiAgICB9XG4gICAgZnVuY3Rpb24gY2xvbmVFbGVtZW50KHZub2RlLCBwcm9wcykge1xuICAgICAgICByZXR1cm4gaCh2bm9kZS5ub2RlTmFtZSwgZXh0ZW5kKGV4dGVuZCh7fSwgdm5vZGUuYXR0cmlidXRlcyksIHByb3BzKSwgYXJndW1lbnRzLmxlbmd0aCA+IDIgPyBbXS5zbGljZS5jYWxsKGFyZ3VtZW50cywgMikgOiB2bm9kZS5jaGlsZHJlbik7XG4gICAgfVxuICAgIGZ1bmN0aW9uIGVucXVldWVSZW5kZXIoY29tcG9uZW50KSB7XG4gICAgICAgIGlmICghY29tcG9uZW50Ll9fZCAmJiAoY29tcG9uZW50Ll9fZCA9ICEwKSAmJiAxID09IGl0ZW1zLnB1c2goY29tcG9uZW50KSkgKG9wdGlvbnMuZGVib3VuY2VSZW5kZXJpbmcgfHwgZGVmZXIpKHJlcmVuZGVyKTtcbiAgICB9XG4gICAgZnVuY3Rpb24gcmVyZW5kZXIoKSB7XG4gICAgICAgIHZhciBwLCBsaXN0ID0gaXRlbXM7XG4gICAgICAgIGl0ZW1zID0gW107XG4gICAgICAgIHdoaWxlIChwID0gbGlzdC5wb3AoKSkgaWYgKHAuX19kKSByZW5kZXJDb21wb25lbnQocCk7XG4gICAgfVxuICAgIGZ1bmN0aW9uIGlzU2FtZU5vZGVUeXBlKG5vZGUsIHZub2RlLCBoeWRyYXRpbmcpIHtcbiAgICAgICAgaWYgKCdzdHJpbmcnID09IHR5cGVvZiB2bm9kZSB8fCAnbnVtYmVyJyA9PSB0eXBlb2Ygdm5vZGUpIHJldHVybiB2b2lkIDAgIT09IG5vZGUuc3BsaXRUZXh0O1xuICAgICAgICBpZiAoJ3N0cmluZycgPT0gdHlwZW9mIHZub2RlLm5vZGVOYW1lKSByZXR1cm4gIW5vZGUuX2NvbXBvbmVudENvbnN0cnVjdG9yICYmIGlzTmFtZWROb2RlKG5vZGUsIHZub2RlLm5vZGVOYW1lKTsgZWxzZSByZXR1cm4gaHlkcmF0aW5nIHx8IG5vZGUuX2NvbXBvbmVudENvbnN0cnVjdG9yID09PSB2bm9kZS5ub2RlTmFtZTtcbiAgICB9XG4gICAgZnVuY3Rpb24gaXNOYW1lZE5vZGUobm9kZSwgbm9kZU5hbWUpIHtcbiAgICAgICAgcmV0dXJuIG5vZGUuX19uID09PSBub2RlTmFtZSB8fCBub2RlLm5vZGVOYW1lLnRvTG93ZXJDYXNlKCkgPT09IG5vZGVOYW1lLnRvTG93ZXJDYXNlKCk7XG4gICAgfVxuICAgIGZ1bmN0aW9uIGdldE5vZGVQcm9wcyh2bm9kZSkge1xuICAgICAgICB2YXIgcHJvcHMgPSBleHRlbmQoe30sIHZub2RlLmF0dHJpYnV0ZXMpO1xuICAgICAgICBwcm9wcy5jaGlsZHJlbiA9IHZub2RlLmNoaWxkcmVuO1xuICAgICAgICB2YXIgZGVmYXVsdFByb3BzID0gdm5vZGUubm9kZU5hbWUuZGVmYXVsdFByb3BzO1xuICAgICAgICBpZiAodm9pZCAwICE9PSBkZWZhdWx0UHJvcHMpIGZvciAodmFyIGkgaW4gZGVmYXVsdFByb3BzKSBpZiAodm9pZCAwID09PSBwcm9wc1tpXSkgcHJvcHNbaV0gPSBkZWZhdWx0UHJvcHNbaV07XG4gICAgICAgIHJldHVybiBwcm9wcztcbiAgICB9XG4gICAgZnVuY3Rpb24gY3JlYXRlTm9kZShub2RlTmFtZSwgaXNTdmcpIHtcbiAgICAgICAgdmFyIG5vZGUgPSBpc1N2ZyA/IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnROUygnaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmcnLCBub2RlTmFtZSkgOiBkb2N1bWVudC5jcmVhdGVFbGVtZW50KG5vZGVOYW1lKTtcbiAgICAgICAgbm9kZS5fX24gPSBub2RlTmFtZTtcbiAgICAgICAgcmV0dXJuIG5vZGU7XG4gICAgfVxuICAgIGZ1bmN0aW9uIHJlbW92ZU5vZGUobm9kZSkge1xuICAgICAgICB2YXIgcGFyZW50Tm9kZSA9IG5vZGUucGFyZW50Tm9kZTtcbiAgICAgICAgaWYgKHBhcmVudE5vZGUpIHBhcmVudE5vZGUucmVtb3ZlQ2hpbGQobm9kZSk7XG4gICAgfVxuICAgIGZ1bmN0aW9uIHNldEFjY2Vzc29yKG5vZGUsIG5hbWUsIG9sZCwgdmFsdWUsIGlzU3ZnKSB7XG4gICAgICAgIGlmICgnY2xhc3NOYW1lJyA9PT0gbmFtZSkgbmFtZSA9ICdjbGFzcyc7XG4gICAgICAgIGlmICgna2V5JyA9PT0gbmFtZSkgOyBlbHNlIGlmICgncmVmJyA9PT0gbmFtZSkge1xuICAgICAgICAgICAgaWYgKG9sZCkgb2xkKG51bGwpO1xuICAgICAgICAgICAgaWYgKHZhbHVlKSB2YWx1ZShub2RlKTtcbiAgICAgICAgfSBlbHNlIGlmICgnY2xhc3MnID09PSBuYW1lICYmICFpc1N2Zykgbm9kZS5jbGFzc05hbWUgPSB2YWx1ZSB8fCAnJzsgZWxzZSBpZiAoJ3N0eWxlJyA9PT0gbmFtZSkge1xuICAgICAgICAgICAgaWYgKCF2YWx1ZSB8fCAnc3RyaW5nJyA9PSB0eXBlb2YgdmFsdWUgfHwgJ3N0cmluZycgPT0gdHlwZW9mIG9sZCkgbm9kZS5zdHlsZS5jc3NUZXh0ID0gdmFsdWUgfHwgJyc7XG4gICAgICAgICAgICBpZiAodmFsdWUgJiYgJ29iamVjdCcgPT0gdHlwZW9mIHZhbHVlKSB7XG4gICAgICAgICAgICAgICAgaWYgKCdzdHJpbmcnICE9IHR5cGVvZiBvbGQpIGZvciAodmFyIGkgaW4gb2xkKSBpZiAoIShpIGluIHZhbHVlKSkgbm9kZS5zdHlsZVtpXSA9ICcnO1xuICAgICAgICAgICAgICAgIGZvciAodmFyIGkgaW4gdmFsdWUpIG5vZGUuc3R5bGVbaV0gPSAnbnVtYmVyJyA9PSB0eXBlb2YgdmFsdWVbaV0gJiYgITEgPT09IElTX05PTl9ESU1FTlNJT05BTC50ZXN0KGkpID8gdmFsdWVbaV0gKyAncHgnIDogdmFsdWVbaV07XG4gICAgICAgICAgICB9XG4gICAgICAgIH0gZWxzZSBpZiAoJ2Rhbmdlcm91c2x5U2V0SW5uZXJIVE1MJyA9PT0gbmFtZSkge1xuICAgICAgICAgICAgaWYgKHZhbHVlKSBub2RlLmlubmVySFRNTCA9IHZhbHVlLl9faHRtbCB8fCAnJztcbiAgICAgICAgfSBlbHNlIGlmICgnbycgPT0gbmFtZVswXSAmJiAnbicgPT0gbmFtZVsxXSkge1xuICAgICAgICAgICAgdmFyIHVzZUNhcHR1cmUgPSBuYW1lICE9PSAobmFtZSA9IG5hbWUucmVwbGFjZSgvQ2FwdHVyZSQvLCAnJykpO1xuICAgICAgICAgICAgbmFtZSA9IG5hbWUudG9Mb3dlckNhc2UoKS5zdWJzdHJpbmcoMik7XG4gICAgICAgICAgICBpZiAodmFsdWUpIHtcbiAgICAgICAgICAgICAgICBpZiAoIW9sZCkgbm9kZS5hZGRFdmVudExpc3RlbmVyKG5hbWUsIGV2ZW50UHJveHksIHVzZUNhcHR1cmUpO1xuICAgICAgICAgICAgfSBlbHNlIG5vZGUucmVtb3ZlRXZlbnRMaXN0ZW5lcihuYW1lLCBldmVudFByb3h5LCB1c2VDYXB0dXJlKTtcbiAgICAgICAgICAgIChub2RlLl9fbCB8fCAobm9kZS5fX2wgPSB7fSkpW25hbWVdID0gdmFsdWU7XG4gICAgICAgIH0gZWxzZSBpZiAoJ2xpc3QnICE9PSBuYW1lICYmICd0eXBlJyAhPT0gbmFtZSAmJiAhaXNTdmcgJiYgbmFtZSBpbiBub2RlKSB7XG4gICAgICAgICAgICBzZXRQcm9wZXJ0eShub2RlLCBuYW1lLCBudWxsID09IHZhbHVlID8gJycgOiB2YWx1ZSk7XG4gICAgICAgICAgICBpZiAobnVsbCA9PSB2YWx1ZSB8fCAhMSA9PT0gdmFsdWUpIG5vZGUucmVtb3ZlQXR0cmlidXRlKG5hbWUpO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgdmFyIG5zID0gaXNTdmcgJiYgbmFtZSAhPT0gKG5hbWUgPSBuYW1lLnJlcGxhY2UoL154bGluazo/LywgJycpKTtcbiAgICAgICAgICAgIGlmIChudWxsID09IHZhbHVlIHx8ICExID09PSB2YWx1ZSkgaWYgKG5zKSBub2RlLnJlbW92ZUF0dHJpYnV0ZU5TKCdodHRwOi8vd3d3LnczLm9yZy8xOTk5L3hsaW5rJywgbmFtZS50b0xvd2VyQ2FzZSgpKTsgZWxzZSBub2RlLnJlbW92ZUF0dHJpYnV0ZShuYW1lKTsgZWxzZSBpZiAoJ2Z1bmN0aW9uJyAhPSB0eXBlb2YgdmFsdWUpIGlmIChucykgbm9kZS5zZXRBdHRyaWJ1dGVOUygnaHR0cDovL3d3dy53My5vcmcvMTk5OS94bGluaycsIG5hbWUudG9Mb3dlckNhc2UoKSwgdmFsdWUpOyBlbHNlIG5vZGUuc2V0QXR0cmlidXRlKG5hbWUsIHZhbHVlKTtcbiAgICAgICAgfVxuICAgIH1cbiAgICBmdW5jdGlvbiBzZXRQcm9wZXJ0eShub2RlLCBuYW1lLCB2YWx1ZSkge1xuICAgICAgICB0cnkge1xuICAgICAgICAgICAgbm9kZVtuYW1lXSA9IHZhbHVlO1xuICAgICAgICB9IGNhdGNoIChlKSB7fVxuICAgIH1cbiAgICBmdW5jdGlvbiBldmVudFByb3h5KGUpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuX19sW2UudHlwZV0ob3B0aW9ucy5ldmVudCAmJiBvcHRpb25zLmV2ZW50KGUpIHx8IGUpO1xuICAgIH1cbiAgICBmdW5jdGlvbiBmbHVzaE1vdW50cygpIHtcbiAgICAgICAgdmFyIGM7XG4gICAgICAgIHdoaWxlIChjID0gbW91bnRzLnBvcCgpKSB7XG4gICAgICAgICAgICBpZiAob3B0aW9ucy5hZnRlck1vdW50KSBvcHRpb25zLmFmdGVyTW91bnQoYyk7XG4gICAgICAgICAgICBpZiAoYy5jb21wb25lbnREaWRNb3VudCkgYy5jb21wb25lbnREaWRNb3VudCgpO1xuICAgICAgICB9XG4gICAgfVxuICAgIGZ1bmN0aW9uIGRpZmYoZG9tLCB2bm9kZSwgY29udGV4dCwgbW91bnRBbGwsIHBhcmVudCwgY29tcG9uZW50Um9vdCkge1xuICAgICAgICBpZiAoIWRpZmZMZXZlbCsrKSB7XG4gICAgICAgICAgICBpc1N2Z01vZGUgPSBudWxsICE9IHBhcmVudCAmJiB2b2lkIDAgIT09IHBhcmVudC5vd25lclNWR0VsZW1lbnQ7XG4gICAgICAgICAgICBoeWRyYXRpbmcgPSBudWxsICE9IGRvbSAmJiAhKCdfX3ByZWFjdGF0dHJfJyBpbiBkb20pO1xuICAgICAgICB9XG4gICAgICAgIHZhciByZXQgPSBpZGlmZihkb20sIHZub2RlLCBjb250ZXh0LCBtb3VudEFsbCwgY29tcG9uZW50Um9vdCk7XG4gICAgICAgIGlmIChwYXJlbnQgJiYgcmV0LnBhcmVudE5vZGUgIT09IHBhcmVudCkgcGFyZW50LmFwcGVuZENoaWxkKHJldCk7XG4gICAgICAgIGlmICghLS1kaWZmTGV2ZWwpIHtcbiAgICAgICAgICAgIGh5ZHJhdGluZyA9ICExO1xuICAgICAgICAgICAgaWYgKCFjb21wb25lbnRSb290KSBmbHVzaE1vdW50cygpO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiByZXQ7XG4gICAgfVxuICAgIGZ1bmN0aW9uIGlkaWZmKGRvbSwgdm5vZGUsIGNvbnRleHQsIG1vdW50QWxsLCBjb21wb25lbnRSb290KSB7XG4gICAgICAgIHZhciBvdXQgPSBkb20sIHByZXZTdmdNb2RlID0gaXNTdmdNb2RlO1xuICAgICAgICBpZiAobnVsbCA9PSB2bm9kZSB8fCAnYm9vbGVhbicgPT0gdHlwZW9mIHZub2RlKSB2bm9kZSA9ICcnO1xuICAgICAgICBpZiAoJ3N0cmluZycgPT0gdHlwZW9mIHZub2RlIHx8ICdudW1iZXInID09IHR5cGVvZiB2bm9kZSkge1xuICAgICAgICAgICAgaWYgKGRvbSAmJiB2b2lkIDAgIT09IGRvbS5zcGxpdFRleHQgJiYgZG9tLnBhcmVudE5vZGUgJiYgKCFkb20uX2NvbXBvbmVudCB8fCBjb21wb25lbnRSb290KSkge1xuICAgICAgICAgICAgICAgIGlmIChkb20ubm9kZVZhbHVlICE9IHZub2RlKSBkb20ubm9kZVZhbHVlID0gdm5vZGU7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIG91dCA9IGRvY3VtZW50LmNyZWF0ZVRleHROb2RlKHZub2RlKTtcbiAgICAgICAgICAgICAgICBpZiAoZG9tKSB7XG4gICAgICAgICAgICAgICAgICAgIGlmIChkb20ucGFyZW50Tm9kZSkgZG9tLnBhcmVudE5vZGUucmVwbGFjZUNoaWxkKG91dCwgZG9tKTtcbiAgICAgICAgICAgICAgICAgICAgcmVjb2xsZWN0Tm9kZVRyZWUoZG9tLCAhMCk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICAgICAgb3V0Ll9fcHJlYWN0YXR0cl8gPSAhMDtcbiAgICAgICAgICAgIHJldHVybiBvdXQ7XG4gICAgICAgIH1cbiAgICAgICAgdmFyIHZub2RlTmFtZSA9IHZub2RlLm5vZGVOYW1lO1xuICAgICAgICBpZiAoJ2Z1bmN0aW9uJyA9PSB0eXBlb2Ygdm5vZGVOYW1lKSByZXR1cm4gYnVpbGRDb21wb25lbnRGcm9tVk5vZGUoZG9tLCB2bm9kZSwgY29udGV4dCwgbW91bnRBbGwpO1xuICAgICAgICBpc1N2Z01vZGUgPSAnc3ZnJyA9PT0gdm5vZGVOYW1lID8gITAgOiAnZm9yZWlnbk9iamVjdCcgPT09IHZub2RlTmFtZSA/ICExIDogaXNTdmdNb2RlO1xuICAgICAgICB2bm9kZU5hbWUgPSBTdHJpbmcodm5vZGVOYW1lKTtcbiAgICAgICAgaWYgKCFkb20gfHwgIWlzTmFtZWROb2RlKGRvbSwgdm5vZGVOYW1lKSkge1xuICAgICAgICAgICAgb3V0ID0gY3JlYXRlTm9kZSh2bm9kZU5hbWUsIGlzU3ZnTW9kZSk7XG4gICAgICAgICAgICBpZiAoZG9tKSB7XG4gICAgICAgICAgICAgICAgd2hpbGUgKGRvbS5maXJzdENoaWxkKSBvdXQuYXBwZW5kQ2hpbGQoZG9tLmZpcnN0Q2hpbGQpO1xuICAgICAgICAgICAgICAgIGlmIChkb20ucGFyZW50Tm9kZSkgZG9tLnBhcmVudE5vZGUucmVwbGFjZUNoaWxkKG91dCwgZG9tKTtcbiAgICAgICAgICAgICAgICByZWNvbGxlY3ROb2RlVHJlZShkb20sICEwKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICB2YXIgZmMgPSBvdXQuZmlyc3RDaGlsZCwgcHJvcHMgPSBvdXQuX19wcmVhY3RhdHRyXywgdmNoaWxkcmVuID0gdm5vZGUuY2hpbGRyZW47XG4gICAgICAgIGlmIChudWxsID09IHByb3BzKSB7XG4gICAgICAgICAgICBwcm9wcyA9IG91dC5fX3ByZWFjdGF0dHJfID0ge307XG4gICAgICAgICAgICBmb3IgKHZhciBhID0gb3V0LmF0dHJpYnV0ZXMsIGkgPSBhLmxlbmd0aDsgaS0tOyApIHByb3BzW2FbaV0ubmFtZV0gPSBhW2ldLnZhbHVlO1xuICAgICAgICB9XG4gICAgICAgIGlmICghaHlkcmF0aW5nICYmIHZjaGlsZHJlbiAmJiAxID09PSB2Y2hpbGRyZW4ubGVuZ3RoICYmICdzdHJpbmcnID09IHR5cGVvZiB2Y2hpbGRyZW5bMF0gJiYgbnVsbCAhPSBmYyAmJiB2b2lkIDAgIT09IGZjLnNwbGl0VGV4dCAmJiBudWxsID09IGZjLm5leHRTaWJsaW5nKSB7XG4gICAgICAgICAgICBpZiAoZmMubm9kZVZhbHVlICE9IHZjaGlsZHJlblswXSkgZmMubm9kZVZhbHVlID0gdmNoaWxkcmVuWzBdO1xuICAgICAgICB9IGVsc2UgaWYgKHZjaGlsZHJlbiAmJiB2Y2hpbGRyZW4ubGVuZ3RoIHx8IG51bGwgIT0gZmMpIGlubmVyRGlmZk5vZGUob3V0LCB2Y2hpbGRyZW4sIGNvbnRleHQsIG1vdW50QWxsLCBoeWRyYXRpbmcgfHwgbnVsbCAhPSBwcm9wcy5kYW5nZXJvdXNseVNldElubmVySFRNTCk7XG4gICAgICAgIGRpZmZBdHRyaWJ1dGVzKG91dCwgdm5vZGUuYXR0cmlidXRlcywgcHJvcHMpO1xuICAgICAgICBpc1N2Z01vZGUgPSBwcmV2U3ZnTW9kZTtcbiAgICAgICAgcmV0dXJuIG91dDtcbiAgICB9XG4gICAgZnVuY3Rpb24gaW5uZXJEaWZmTm9kZShkb20sIHZjaGlsZHJlbiwgY29udGV4dCwgbW91bnRBbGwsIGlzSHlkcmF0aW5nKSB7XG4gICAgICAgIHZhciBqLCBjLCBmLCB2Y2hpbGQsIGNoaWxkLCBvcmlnaW5hbENoaWxkcmVuID0gZG9tLmNoaWxkTm9kZXMsIGNoaWxkcmVuID0gW10sIGtleWVkID0ge30sIGtleWVkTGVuID0gMCwgbWluID0gMCwgbGVuID0gb3JpZ2luYWxDaGlsZHJlbi5sZW5ndGgsIGNoaWxkcmVuTGVuID0gMCwgdmxlbiA9IHZjaGlsZHJlbiA/IHZjaGlsZHJlbi5sZW5ndGggOiAwO1xuICAgICAgICBpZiAoMCAhPT0gbGVuKSBmb3IgKHZhciBpID0gMDsgaSA8IGxlbjsgaSsrKSB7XG4gICAgICAgICAgICB2YXIgX2NoaWxkID0gb3JpZ2luYWxDaGlsZHJlbltpXSwgcHJvcHMgPSBfY2hpbGQuX19wcmVhY3RhdHRyXywga2V5ID0gdmxlbiAmJiBwcm9wcyA/IF9jaGlsZC5fY29tcG9uZW50ID8gX2NoaWxkLl9jb21wb25lbnQuX19rIDogcHJvcHMua2V5IDogbnVsbDtcbiAgICAgICAgICAgIGlmIChudWxsICE9IGtleSkge1xuICAgICAgICAgICAgICAgIGtleWVkTGVuKys7XG4gICAgICAgICAgICAgICAga2V5ZWRba2V5XSA9IF9jaGlsZDtcbiAgICAgICAgICAgIH0gZWxzZSBpZiAocHJvcHMgfHwgKHZvaWQgMCAhPT0gX2NoaWxkLnNwbGl0VGV4dCA/IGlzSHlkcmF0aW5nID8gX2NoaWxkLm5vZGVWYWx1ZS50cmltKCkgOiAhMCA6IGlzSHlkcmF0aW5nKSkgY2hpbGRyZW5bY2hpbGRyZW5MZW4rK10gPSBfY2hpbGQ7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKDAgIT09IHZsZW4pIGZvciAodmFyIGkgPSAwOyBpIDwgdmxlbjsgaSsrKSB7XG4gICAgICAgICAgICB2Y2hpbGQgPSB2Y2hpbGRyZW5baV07XG4gICAgICAgICAgICBjaGlsZCA9IG51bGw7XG4gICAgICAgICAgICB2YXIga2V5ID0gdmNoaWxkLmtleTtcbiAgICAgICAgICAgIGlmIChudWxsICE9IGtleSkge1xuICAgICAgICAgICAgICAgIGlmIChrZXllZExlbiAmJiB2b2lkIDAgIT09IGtleWVkW2tleV0pIHtcbiAgICAgICAgICAgICAgICAgICAgY2hpbGQgPSBrZXllZFtrZXldO1xuICAgICAgICAgICAgICAgICAgICBrZXllZFtrZXldID0gdm9pZCAwO1xuICAgICAgICAgICAgICAgICAgICBrZXllZExlbi0tO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0gZWxzZSBpZiAoIWNoaWxkICYmIG1pbiA8IGNoaWxkcmVuTGVuKSBmb3IgKGogPSBtaW47IGogPCBjaGlsZHJlbkxlbjsgaisrKSBpZiAodm9pZCAwICE9PSBjaGlsZHJlbltqXSAmJiBpc1NhbWVOb2RlVHlwZShjID0gY2hpbGRyZW5bal0sIHZjaGlsZCwgaXNIeWRyYXRpbmcpKSB7XG4gICAgICAgICAgICAgICAgY2hpbGQgPSBjO1xuICAgICAgICAgICAgICAgIGNoaWxkcmVuW2pdID0gdm9pZCAwO1xuICAgICAgICAgICAgICAgIGlmIChqID09PSBjaGlsZHJlbkxlbiAtIDEpIGNoaWxkcmVuTGVuLS07XG4gICAgICAgICAgICAgICAgaWYgKGogPT09IG1pbikgbWluKys7XG4gICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBjaGlsZCA9IGlkaWZmKGNoaWxkLCB2Y2hpbGQsIGNvbnRleHQsIG1vdW50QWxsKTtcbiAgICAgICAgICAgIGYgPSBvcmlnaW5hbENoaWxkcmVuW2ldO1xuICAgICAgICAgICAgaWYgKGNoaWxkICYmIGNoaWxkICE9PSBkb20gJiYgY2hpbGQgIT09IGYpIGlmIChudWxsID09IGYpIGRvbS5hcHBlbmRDaGlsZChjaGlsZCk7IGVsc2UgaWYgKGNoaWxkID09PSBmLm5leHRTaWJsaW5nKSByZW1vdmVOb2RlKGYpOyBlbHNlIGRvbS5pbnNlcnRCZWZvcmUoY2hpbGQsIGYpO1xuICAgICAgICB9XG4gICAgICAgIGlmIChrZXllZExlbikgZm9yICh2YXIgaSBpbiBrZXllZCkgaWYgKHZvaWQgMCAhPT0ga2V5ZWRbaV0pIHJlY29sbGVjdE5vZGVUcmVlKGtleWVkW2ldLCAhMSk7XG4gICAgICAgIHdoaWxlIChtaW4gPD0gY2hpbGRyZW5MZW4pIGlmICh2b2lkIDAgIT09IChjaGlsZCA9IGNoaWxkcmVuW2NoaWxkcmVuTGVuLS1dKSkgcmVjb2xsZWN0Tm9kZVRyZWUoY2hpbGQsICExKTtcbiAgICB9XG4gICAgZnVuY3Rpb24gcmVjb2xsZWN0Tm9kZVRyZWUobm9kZSwgdW5tb3VudE9ubHkpIHtcbiAgICAgICAgdmFyIGNvbXBvbmVudCA9IG5vZGUuX2NvbXBvbmVudDtcbiAgICAgICAgaWYgKGNvbXBvbmVudCkgdW5tb3VudENvbXBvbmVudChjb21wb25lbnQpOyBlbHNlIHtcbiAgICAgICAgICAgIGlmIChudWxsICE9IG5vZGUuX19wcmVhY3RhdHRyXyAmJiBub2RlLl9fcHJlYWN0YXR0cl8ucmVmKSBub2RlLl9fcHJlYWN0YXR0cl8ucmVmKG51bGwpO1xuICAgICAgICAgICAgaWYgKCExID09PSB1bm1vdW50T25seSB8fCBudWxsID09IG5vZGUuX19wcmVhY3RhdHRyXykgcmVtb3ZlTm9kZShub2RlKTtcbiAgICAgICAgICAgIHJlbW92ZUNoaWxkcmVuKG5vZGUpO1xuICAgICAgICB9XG4gICAgfVxuICAgIGZ1bmN0aW9uIHJlbW92ZUNoaWxkcmVuKG5vZGUpIHtcbiAgICAgICAgbm9kZSA9IG5vZGUubGFzdENoaWxkO1xuICAgICAgICB3aGlsZSAobm9kZSkge1xuICAgICAgICAgICAgdmFyIG5leHQgPSBub2RlLnByZXZpb3VzU2libGluZztcbiAgICAgICAgICAgIHJlY29sbGVjdE5vZGVUcmVlKG5vZGUsICEwKTtcbiAgICAgICAgICAgIG5vZGUgPSBuZXh0O1xuICAgICAgICB9XG4gICAgfVxuICAgIGZ1bmN0aW9uIGRpZmZBdHRyaWJ1dGVzKGRvbSwgYXR0cnMsIG9sZCkge1xuICAgICAgICB2YXIgbmFtZTtcbiAgICAgICAgZm9yIChuYW1lIGluIG9sZCkgaWYgKCghYXR0cnMgfHwgbnVsbCA9PSBhdHRyc1tuYW1lXSkgJiYgbnVsbCAhPSBvbGRbbmFtZV0pIHNldEFjY2Vzc29yKGRvbSwgbmFtZSwgb2xkW25hbWVdLCBvbGRbbmFtZV0gPSB2b2lkIDAsIGlzU3ZnTW9kZSk7XG4gICAgICAgIGZvciAobmFtZSBpbiBhdHRycykgaWYgKCEoJ2NoaWxkcmVuJyA9PT0gbmFtZSB8fCAnaW5uZXJIVE1MJyA9PT0gbmFtZSB8fCBuYW1lIGluIG9sZCAmJiBhdHRyc1tuYW1lXSA9PT0gKCd2YWx1ZScgPT09IG5hbWUgfHwgJ2NoZWNrZWQnID09PSBuYW1lID8gZG9tW25hbWVdIDogb2xkW25hbWVdKSkpIHNldEFjY2Vzc29yKGRvbSwgbmFtZSwgb2xkW25hbWVdLCBvbGRbbmFtZV0gPSBhdHRyc1tuYW1lXSwgaXNTdmdNb2RlKTtcbiAgICB9XG4gICAgZnVuY3Rpb24gY29sbGVjdENvbXBvbmVudChjb21wb25lbnQpIHtcbiAgICAgICAgdmFyIG5hbWUgPSBjb21wb25lbnQuY29uc3RydWN0b3IubmFtZTtcbiAgICAgICAgKGNvbXBvbmVudHNbbmFtZV0gfHwgKGNvbXBvbmVudHNbbmFtZV0gPSBbXSkpLnB1c2goY29tcG9uZW50KTtcbiAgICB9XG4gICAgZnVuY3Rpb24gY3JlYXRlQ29tcG9uZW50KEN0b3IsIHByb3BzLCBjb250ZXh0KSB7XG4gICAgICAgIHZhciBpbnN0LCBsaXN0ID0gY29tcG9uZW50c1tDdG9yLm5hbWVdO1xuICAgICAgICBpZiAoQ3Rvci5wcm90b3R5cGUgJiYgQ3Rvci5wcm90b3R5cGUucmVuZGVyKSB7XG4gICAgICAgICAgICBpbnN0ID0gbmV3IEN0b3IocHJvcHMsIGNvbnRleHQpO1xuICAgICAgICAgICAgQ29tcG9uZW50LmNhbGwoaW5zdCwgcHJvcHMsIGNvbnRleHQpO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgaW5zdCA9IG5ldyBDb21wb25lbnQocHJvcHMsIGNvbnRleHQpO1xuICAgICAgICAgICAgaW5zdC5jb25zdHJ1Y3RvciA9IEN0b3I7XG4gICAgICAgICAgICBpbnN0LnJlbmRlciA9IGRvUmVuZGVyO1xuICAgICAgICB9XG4gICAgICAgIGlmIChsaXN0KSBmb3IgKHZhciBpID0gbGlzdC5sZW5ndGg7IGktLTsgKSBpZiAobGlzdFtpXS5jb25zdHJ1Y3RvciA9PT0gQ3Rvcikge1xuICAgICAgICAgICAgaW5zdC5fX2IgPSBsaXN0W2ldLl9fYjtcbiAgICAgICAgICAgIGxpc3Quc3BsaWNlKGksIDEpO1xuICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIGluc3Q7XG4gICAgfVxuICAgIGZ1bmN0aW9uIGRvUmVuZGVyKHByb3BzLCBzdGF0ZSwgY29udGV4dCkge1xuICAgICAgICByZXR1cm4gdGhpcy5jb25zdHJ1Y3Rvcihwcm9wcywgY29udGV4dCk7XG4gICAgfVxuICAgIGZ1bmN0aW9uIHNldENvbXBvbmVudFByb3BzKGNvbXBvbmVudCwgcHJvcHMsIG9wdHMsIGNvbnRleHQsIG1vdW50QWxsKSB7XG4gICAgICAgIGlmICghY29tcG9uZW50Ll9feCkge1xuICAgICAgICAgICAgY29tcG9uZW50Ll9feCA9ICEwO1xuICAgICAgICAgICAgaWYgKGNvbXBvbmVudC5fX3IgPSBwcm9wcy5yZWYpIGRlbGV0ZSBwcm9wcy5yZWY7XG4gICAgICAgICAgICBpZiAoY29tcG9uZW50Ll9fayA9IHByb3BzLmtleSkgZGVsZXRlIHByb3BzLmtleTtcbiAgICAgICAgICAgIGlmICghY29tcG9uZW50LmJhc2UgfHwgbW91bnRBbGwpIHtcbiAgICAgICAgICAgICAgICBpZiAoY29tcG9uZW50LmNvbXBvbmVudFdpbGxNb3VudCkgY29tcG9uZW50LmNvbXBvbmVudFdpbGxNb3VudCgpO1xuICAgICAgICAgICAgfSBlbHNlIGlmIChjb21wb25lbnQuY29tcG9uZW50V2lsbFJlY2VpdmVQcm9wcykgY29tcG9uZW50LmNvbXBvbmVudFdpbGxSZWNlaXZlUHJvcHMocHJvcHMsIGNvbnRleHQpO1xuICAgICAgICAgICAgaWYgKGNvbnRleHQgJiYgY29udGV4dCAhPT0gY29tcG9uZW50LmNvbnRleHQpIHtcbiAgICAgICAgICAgICAgICBpZiAoIWNvbXBvbmVudC5fX2MpIGNvbXBvbmVudC5fX2MgPSBjb21wb25lbnQuY29udGV4dDtcbiAgICAgICAgICAgICAgICBjb21wb25lbnQuY29udGV4dCA9IGNvbnRleHQ7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBpZiAoIWNvbXBvbmVudC5fX3ApIGNvbXBvbmVudC5fX3AgPSBjb21wb25lbnQucHJvcHM7XG4gICAgICAgICAgICBjb21wb25lbnQucHJvcHMgPSBwcm9wcztcbiAgICAgICAgICAgIGNvbXBvbmVudC5fX3ggPSAhMTtcbiAgICAgICAgICAgIGlmICgwICE9PSBvcHRzKSBpZiAoMSA9PT0gb3B0cyB8fCAhMSAhPT0gb3B0aW9ucy5zeW5jQ29tcG9uZW50VXBkYXRlcyB8fCAhY29tcG9uZW50LmJhc2UpIHJlbmRlckNvbXBvbmVudChjb21wb25lbnQsIDEsIG1vdW50QWxsKTsgZWxzZSBlbnF1ZXVlUmVuZGVyKGNvbXBvbmVudCk7XG4gICAgICAgICAgICBpZiAoY29tcG9uZW50Ll9fcikgY29tcG9uZW50Ll9fcihjb21wb25lbnQpO1xuICAgICAgICB9XG4gICAgfVxuICAgIGZ1bmN0aW9uIHJlbmRlckNvbXBvbmVudChjb21wb25lbnQsIG9wdHMsIG1vdW50QWxsLCBpc0NoaWxkKSB7XG4gICAgICAgIGlmICghY29tcG9uZW50Ll9feCkge1xuICAgICAgICAgICAgdmFyIHJlbmRlcmVkLCBpbnN0LCBjYmFzZSwgcHJvcHMgPSBjb21wb25lbnQucHJvcHMsIHN0YXRlID0gY29tcG9uZW50LnN0YXRlLCBjb250ZXh0ID0gY29tcG9uZW50LmNvbnRleHQsIHByZXZpb3VzUHJvcHMgPSBjb21wb25lbnQuX19wIHx8IHByb3BzLCBwcmV2aW91c1N0YXRlID0gY29tcG9uZW50Ll9fcyB8fCBzdGF0ZSwgcHJldmlvdXNDb250ZXh0ID0gY29tcG9uZW50Ll9fYyB8fCBjb250ZXh0LCBpc1VwZGF0ZSA9IGNvbXBvbmVudC5iYXNlLCBuZXh0QmFzZSA9IGNvbXBvbmVudC5fX2IsIGluaXRpYWxCYXNlID0gaXNVcGRhdGUgfHwgbmV4dEJhc2UsIGluaXRpYWxDaGlsZENvbXBvbmVudCA9IGNvbXBvbmVudC5fY29tcG9uZW50LCBza2lwID0gITE7XG4gICAgICAgICAgICBpZiAoaXNVcGRhdGUpIHtcbiAgICAgICAgICAgICAgICBjb21wb25lbnQucHJvcHMgPSBwcmV2aW91c1Byb3BzO1xuICAgICAgICAgICAgICAgIGNvbXBvbmVudC5zdGF0ZSA9IHByZXZpb3VzU3RhdGU7XG4gICAgICAgICAgICAgICAgY29tcG9uZW50LmNvbnRleHQgPSBwcmV2aW91c0NvbnRleHQ7XG4gICAgICAgICAgICAgICAgaWYgKDIgIT09IG9wdHMgJiYgY29tcG9uZW50LnNob3VsZENvbXBvbmVudFVwZGF0ZSAmJiAhMSA9PT0gY29tcG9uZW50LnNob3VsZENvbXBvbmVudFVwZGF0ZShwcm9wcywgc3RhdGUsIGNvbnRleHQpKSBza2lwID0gITA7IGVsc2UgaWYgKGNvbXBvbmVudC5jb21wb25lbnRXaWxsVXBkYXRlKSBjb21wb25lbnQuY29tcG9uZW50V2lsbFVwZGF0ZShwcm9wcywgc3RhdGUsIGNvbnRleHQpO1xuICAgICAgICAgICAgICAgIGNvbXBvbmVudC5wcm9wcyA9IHByb3BzO1xuICAgICAgICAgICAgICAgIGNvbXBvbmVudC5zdGF0ZSA9IHN0YXRlO1xuICAgICAgICAgICAgICAgIGNvbXBvbmVudC5jb250ZXh0ID0gY29udGV4dDtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGNvbXBvbmVudC5fX3AgPSBjb21wb25lbnQuX19zID0gY29tcG9uZW50Ll9fYyA9IGNvbXBvbmVudC5fX2IgPSBudWxsO1xuICAgICAgICAgICAgY29tcG9uZW50Ll9fZCA9ICExO1xuICAgICAgICAgICAgaWYgKCFza2lwKSB7XG4gICAgICAgICAgICAgICAgcmVuZGVyZWQgPSBjb21wb25lbnQucmVuZGVyKHByb3BzLCBzdGF0ZSwgY29udGV4dCk7XG4gICAgICAgICAgICAgICAgaWYgKGNvbXBvbmVudC5nZXRDaGlsZENvbnRleHQpIGNvbnRleHQgPSBleHRlbmQoZXh0ZW5kKHt9LCBjb250ZXh0KSwgY29tcG9uZW50LmdldENoaWxkQ29udGV4dCgpKTtcbiAgICAgICAgICAgICAgICB2YXIgdG9Vbm1vdW50LCBiYXNlLCBjaGlsZENvbXBvbmVudCA9IHJlbmRlcmVkICYmIHJlbmRlcmVkLm5vZGVOYW1lO1xuICAgICAgICAgICAgICAgIGlmICgnZnVuY3Rpb24nID09IHR5cGVvZiBjaGlsZENvbXBvbmVudCkge1xuICAgICAgICAgICAgICAgICAgICB2YXIgY2hpbGRQcm9wcyA9IGdldE5vZGVQcm9wcyhyZW5kZXJlZCk7XG4gICAgICAgICAgICAgICAgICAgIGluc3QgPSBpbml0aWFsQ2hpbGRDb21wb25lbnQ7XG4gICAgICAgICAgICAgICAgICAgIGlmIChpbnN0ICYmIGluc3QuY29uc3RydWN0b3IgPT09IGNoaWxkQ29tcG9uZW50ICYmIGNoaWxkUHJvcHMua2V5ID09IGluc3QuX19rKSBzZXRDb21wb25lbnRQcm9wcyhpbnN0LCBjaGlsZFByb3BzLCAxLCBjb250ZXh0LCAhMSk7IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICAgICAgdG9Vbm1vdW50ID0gaW5zdDtcbiAgICAgICAgICAgICAgICAgICAgICAgIGNvbXBvbmVudC5fY29tcG9uZW50ID0gaW5zdCA9IGNyZWF0ZUNvbXBvbmVudChjaGlsZENvbXBvbmVudCwgY2hpbGRQcm9wcywgY29udGV4dCk7XG4gICAgICAgICAgICAgICAgICAgICAgICBpbnN0Ll9fYiA9IGluc3QuX19iIHx8IG5leHRCYXNlO1xuICAgICAgICAgICAgICAgICAgICAgICAgaW5zdC5fX3UgPSBjb21wb25lbnQ7XG4gICAgICAgICAgICAgICAgICAgICAgICBzZXRDb21wb25lbnRQcm9wcyhpbnN0LCBjaGlsZFByb3BzLCAwLCBjb250ZXh0LCAhMSk7XG4gICAgICAgICAgICAgICAgICAgICAgICByZW5kZXJDb21wb25lbnQoaW5zdCwgMSwgbW91bnRBbGwsICEwKTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICBiYXNlID0gaW5zdC5iYXNlO1xuICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgIGNiYXNlID0gaW5pdGlhbEJhc2U7XG4gICAgICAgICAgICAgICAgICAgIHRvVW5tb3VudCA9IGluaXRpYWxDaGlsZENvbXBvbmVudDtcbiAgICAgICAgICAgICAgICAgICAgaWYgKHRvVW5tb3VudCkgY2Jhc2UgPSBjb21wb25lbnQuX2NvbXBvbmVudCA9IG51bGw7XG4gICAgICAgICAgICAgICAgICAgIGlmIChpbml0aWFsQmFzZSB8fCAxID09PSBvcHRzKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAoY2Jhc2UpIGNiYXNlLl9jb21wb25lbnQgPSBudWxsO1xuICAgICAgICAgICAgICAgICAgICAgICAgYmFzZSA9IGRpZmYoY2Jhc2UsIHJlbmRlcmVkLCBjb250ZXh0LCBtb3VudEFsbCB8fCAhaXNVcGRhdGUsIGluaXRpYWxCYXNlICYmIGluaXRpYWxCYXNlLnBhcmVudE5vZGUsICEwKTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBpZiAoaW5pdGlhbEJhc2UgJiYgYmFzZSAhPT0gaW5pdGlhbEJhc2UgJiYgaW5zdCAhPT0gaW5pdGlhbENoaWxkQ29tcG9uZW50KSB7XG4gICAgICAgICAgICAgICAgICAgIHZhciBiYXNlUGFyZW50ID0gaW5pdGlhbEJhc2UucGFyZW50Tm9kZTtcbiAgICAgICAgICAgICAgICAgICAgaWYgKGJhc2VQYXJlbnQgJiYgYmFzZSAhPT0gYmFzZVBhcmVudCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgYmFzZVBhcmVudC5yZXBsYWNlQ2hpbGQoYmFzZSwgaW5pdGlhbEJhc2UpO1xuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKCF0b1VubW91bnQpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBpbml0aWFsQmFzZS5fY29tcG9uZW50ID0gbnVsbDtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICByZWNvbGxlY3ROb2RlVHJlZShpbml0aWFsQmFzZSwgITEpO1xuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGlmICh0b1VubW91bnQpIHVubW91bnRDb21wb25lbnQodG9Vbm1vdW50KTtcbiAgICAgICAgICAgICAgICBjb21wb25lbnQuYmFzZSA9IGJhc2U7XG4gICAgICAgICAgICAgICAgaWYgKGJhc2UgJiYgIWlzQ2hpbGQpIHtcbiAgICAgICAgICAgICAgICAgICAgdmFyIGNvbXBvbmVudFJlZiA9IGNvbXBvbmVudCwgdCA9IGNvbXBvbmVudDtcbiAgICAgICAgICAgICAgICAgICAgd2hpbGUgKHQgPSB0Ll9fdSkgKGNvbXBvbmVudFJlZiA9IHQpLmJhc2UgPSBiYXNlO1xuICAgICAgICAgICAgICAgICAgICBiYXNlLl9jb21wb25lbnQgPSBjb21wb25lbnRSZWY7XG4gICAgICAgICAgICAgICAgICAgIGJhc2UuX2NvbXBvbmVudENvbnN0cnVjdG9yID0gY29tcG9uZW50UmVmLmNvbnN0cnVjdG9yO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGlmICghaXNVcGRhdGUgfHwgbW91bnRBbGwpIG1vdW50cy51bnNoaWZ0KGNvbXBvbmVudCk7IGVsc2UgaWYgKCFza2lwKSB7XG4gICAgICAgICAgICAgICAgaWYgKGNvbXBvbmVudC5jb21wb25lbnREaWRVcGRhdGUpIGNvbXBvbmVudC5jb21wb25lbnREaWRVcGRhdGUocHJldmlvdXNQcm9wcywgcHJldmlvdXNTdGF0ZSwgcHJldmlvdXNDb250ZXh0KTtcbiAgICAgICAgICAgICAgICBpZiAob3B0aW9ucy5hZnRlclVwZGF0ZSkgb3B0aW9ucy5hZnRlclVwZGF0ZShjb21wb25lbnQpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgaWYgKG51bGwgIT0gY29tcG9uZW50Ll9faCkgd2hpbGUgKGNvbXBvbmVudC5fX2gubGVuZ3RoKSBjb21wb25lbnQuX19oLnBvcCgpLmNhbGwoY29tcG9uZW50KTtcbiAgICAgICAgICAgIGlmICghZGlmZkxldmVsICYmICFpc0NoaWxkKSBmbHVzaE1vdW50cygpO1xuICAgICAgICB9XG4gICAgfVxuICAgIGZ1bmN0aW9uIGJ1aWxkQ29tcG9uZW50RnJvbVZOb2RlKGRvbSwgdm5vZGUsIGNvbnRleHQsIG1vdW50QWxsKSB7XG4gICAgICAgIHZhciBjID0gZG9tICYmIGRvbS5fY29tcG9uZW50LCBvcmlnaW5hbENvbXBvbmVudCA9IGMsIG9sZERvbSA9IGRvbSwgaXNEaXJlY3RPd25lciA9IGMgJiYgZG9tLl9jb21wb25lbnRDb25zdHJ1Y3RvciA9PT0gdm5vZGUubm9kZU5hbWUsIGlzT3duZXIgPSBpc0RpcmVjdE93bmVyLCBwcm9wcyA9IGdldE5vZGVQcm9wcyh2bm9kZSk7XG4gICAgICAgIHdoaWxlIChjICYmICFpc093bmVyICYmIChjID0gYy5fX3UpKSBpc093bmVyID0gYy5jb25zdHJ1Y3RvciA9PT0gdm5vZGUubm9kZU5hbWU7XG4gICAgICAgIGlmIChjICYmIGlzT3duZXIgJiYgKCFtb3VudEFsbCB8fCBjLl9jb21wb25lbnQpKSB7XG4gICAgICAgICAgICBzZXRDb21wb25lbnRQcm9wcyhjLCBwcm9wcywgMywgY29udGV4dCwgbW91bnRBbGwpO1xuICAgICAgICAgICAgZG9tID0gYy5iYXNlO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgaWYgKG9yaWdpbmFsQ29tcG9uZW50ICYmICFpc0RpcmVjdE93bmVyKSB7XG4gICAgICAgICAgICAgICAgdW5tb3VudENvbXBvbmVudChvcmlnaW5hbENvbXBvbmVudCk7XG4gICAgICAgICAgICAgICAgZG9tID0gb2xkRG9tID0gbnVsbDtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGMgPSBjcmVhdGVDb21wb25lbnQodm5vZGUubm9kZU5hbWUsIHByb3BzLCBjb250ZXh0KTtcbiAgICAgICAgICAgIGlmIChkb20gJiYgIWMuX19iKSB7XG4gICAgICAgICAgICAgICAgYy5fX2IgPSBkb207XG4gICAgICAgICAgICAgICAgb2xkRG9tID0gbnVsbDtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHNldENvbXBvbmVudFByb3BzKGMsIHByb3BzLCAxLCBjb250ZXh0LCBtb3VudEFsbCk7XG4gICAgICAgICAgICBkb20gPSBjLmJhc2U7XG4gICAgICAgICAgICBpZiAob2xkRG9tICYmIGRvbSAhPT0gb2xkRG9tKSB7XG4gICAgICAgICAgICAgICAgb2xkRG9tLl9jb21wb25lbnQgPSBudWxsO1xuICAgICAgICAgICAgICAgIHJlY29sbGVjdE5vZGVUcmVlKG9sZERvbSwgITEpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIHJldHVybiBkb207XG4gICAgfVxuICAgIGZ1bmN0aW9uIHVubW91bnRDb21wb25lbnQoY29tcG9uZW50KSB7XG4gICAgICAgIGlmIChvcHRpb25zLmJlZm9yZVVubW91bnQpIG9wdGlvbnMuYmVmb3JlVW5tb3VudChjb21wb25lbnQpO1xuICAgICAgICB2YXIgYmFzZSA9IGNvbXBvbmVudC5iYXNlO1xuICAgICAgICBjb21wb25lbnQuX194ID0gITA7XG4gICAgICAgIGlmIChjb21wb25lbnQuY29tcG9uZW50V2lsbFVubW91bnQpIGNvbXBvbmVudC5jb21wb25lbnRXaWxsVW5tb3VudCgpO1xuICAgICAgICBjb21wb25lbnQuYmFzZSA9IG51bGw7XG4gICAgICAgIHZhciBpbm5lciA9IGNvbXBvbmVudC5fY29tcG9uZW50O1xuICAgICAgICBpZiAoaW5uZXIpIHVubW91bnRDb21wb25lbnQoaW5uZXIpOyBlbHNlIGlmIChiYXNlKSB7XG4gICAgICAgICAgICBpZiAoYmFzZS5fX3ByZWFjdGF0dHJfICYmIGJhc2UuX19wcmVhY3RhdHRyXy5yZWYpIGJhc2UuX19wcmVhY3RhdHRyXy5yZWYobnVsbCk7XG4gICAgICAgICAgICBjb21wb25lbnQuX19iID0gYmFzZTtcbiAgICAgICAgICAgIHJlbW92ZU5vZGUoYmFzZSk7XG4gICAgICAgICAgICBjb2xsZWN0Q29tcG9uZW50KGNvbXBvbmVudCk7XG4gICAgICAgICAgICByZW1vdmVDaGlsZHJlbihiYXNlKTtcbiAgICAgICAgfVxuICAgICAgICBpZiAoY29tcG9uZW50Ll9fcikgY29tcG9uZW50Ll9fcihudWxsKTtcbiAgICB9XG4gICAgZnVuY3Rpb24gQ29tcG9uZW50KHByb3BzLCBjb250ZXh0KSB7XG4gICAgICAgIHRoaXMuX19kID0gITA7XG4gICAgICAgIHRoaXMuY29udGV4dCA9IGNvbnRleHQ7XG4gICAgICAgIHRoaXMucHJvcHMgPSBwcm9wcztcbiAgICAgICAgdGhpcy5zdGF0ZSA9IHRoaXMuc3RhdGUgfHwge307XG4gICAgfVxuICAgIGZ1bmN0aW9uIHJlbmRlcih2bm9kZSwgcGFyZW50LCBtZXJnZSkge1xuICAgICAgICByZXR1cm4gZGlmZihtZXJnZSwgdm5vZGUsIHt9LCAhMSwgcGFyZW50LCAhMSk7XG4gICAgfVxuICAgIHZhciBvcHRpb25zID0ge307XG4gICAgdmFyIHN0YWNrID0gW107XG4gICAgdmFyIEVNUFRZX0NISUxEUkVOID0gW107XG4gICAgdmFyIGRlZmVyID0gJ2Z1bmN0aW9uJyA9PSB0eXBlb2YgUHJvbWlzZSA/IFByb21pc2UucmVzb2x2ZSgpLnRoZW4uYmluZChQcm9taXNlLnJlc29sdmUoKSkgOiBzZXRUaW1lb3V0O1xuICAgIHZhciBJU19OT05fRElNRU5TSU9OQUwgPSAvYWNpdHxleCg/OnN8Z3xufHB8JCl8cnBofG93c3xtbmN8bnR3fGluZVtjaF18em9vfF5vcmQvaTtcbiAgICB2YXIgaXRlbXMgPSBbXTtcbiAgICB2YXIgbW91bnRzID0gW107XG4gICAgdmFyIGRpZmZMZXZlbCA9IDA7XG4gICAgdmFyIGlzU3ZnTW9kZSA9ICExO1xuICAgIHZhciBoeWRyYXRpbmcgPSAhMTtcbiAgICB2YXIgY29tcG9uZW50cyA9IHt9O1xuICAgIGV4dGVuZChDb21wb25lbnQucHJvdG90eXBlLCB7XG4gICAgICAgIHNldFN0YXRlOiBmdW5jdGlvbihzdGF0ZSwgY2FsbGJhY2spIHtcbiAgICAgICAgICAgIHZhciBzID0gdGhpcy5zdGF0ZTtcbiAgICAgICAgICAgIGlmICghdGhpcy5fX3MpIHRoaXMuX19zID0gZXh0ZW5kKHt9LCBzKTtcbiAgICAgICAgICAgIGV4dGVuZChzLCAnZnVuY3Rpb24nID09IHR5cGVvZiBzdGF0ZSA/IHN0YXRlKHMsIHRoaXMucHJvcHMpIDogc3RhdGUpO1xuICAgICAgICAgICAgaWYgKGNhbGxiYWNrKSAodGhpcy5fX2ggPSB0aGlzLl9faCB8fCBbXSkucHVzaChjYWxsYmFjayk7XG4gICAgICAgICAgICBlbnF1ZXVlUmVuZGVyKHRoaXMpO1xuICAgICAgICB9LFxuICAgICAgICBmb3JjZVVwZGF0ZTogZnVuY3Rpb24oY2FsbGJhY2spIHtcbiAgICAgICAgICAgIGlmIChjYWxsYmFjaykgKHRoaXMuX19oID0gdGhpcy5fX2ggfHwgW10pLnB1c2goY2FsbGJhY2spO1xuICAgICAgICAgICAgcmVuZGVyQ29tcG9uZW50KHRoaXMsIDIpO1xuICAgICAgICB9LFxuICAgICAgICByZW5kZXI6IGZ1bmN0aW9uKCkge31cbiAgICB9KTtcbiAgICB2YXIgcHJlYWN0ID0ge1xuICAgICAgICBoOiBoLFxuICAgICAgICBjcmVhdGVFbGVtZW50OiBoLFxuICAgICAgICBjbG9uZUVsZW1lbnQ6IGNsb25lRWxlbWVudCxcbiAgICAgICAgQ29tcG9uZW50OiBDb21wb25lbnQsXG4gICAgICAgIHJlbmRlcjogcmVuZGVyLFxuICAgICAgICByZXJlbmRlcjogcmVyZW5kZXIsXG4gICAgICAgIG9wdGlvbnM6IG9wdGlvbnNcbiAgICB9O1xuICAgIGlmICgndW5kZWZpbmVkJyAhPSB0eXBlb2YgbW9kdWxlKSBtb2R1bGUuZXhwb3J0cyA9IHByZWFjdDsgZWxzZSBzZWxmLnByZWFjdCA9IHByZWFjdDtcbn0oKTtcbi8vIyBzb3VyY2VNYXBwaW5nVVJMPXByZWFjdC5qcy5tYXAiLCIvLyBzaGltIGZvciB1c2luZyBwcm9jZXNzIGluIGJyb3dzZXJcbnZhciBwcm9jZXNzID0gbW9kdWxlLmV4cG9ydHMgPSB7fTtcblxuLy8gY2FjaGVkIGZyb20gd2hhdGV2ZXIgZ2xvYmFsIGlzIHByZXNlbnQgc28gdGhhdCB0ZXN0IHJ1bm5lcnMgdGhhdCBzdHViIGl0XG4vLyBkb24ndCBicmVhayB0aGluZ3MuICBCdXQgd2UgbmVlZCB0byB3cmFwIGl0IGluIGEgdHJ5IGNhdGNoIGluIGNhc2UgaXQgaXNcbi8vIHdyYXBwZWQgaW4gc3RyaWN0IG1vZGUgY29kZSB3aGljaCBkb2Vzbid0IGRlZmluZSBhbnkgZ2xvYmFscy4gIEl0J3MgaW5zaWRlIGFcbi8vIGZ1bmN0aW9uIGJlY2F1c2UgdHJ5L2NhdGNoZXMgZGVvcHRpbWl6ZSBpbiBjZXJ0YWluIGVuZ2luZXMuXG5cbnZhciBjYWNoZWRTZXRUaW1lb3V0O1xudmFyIGNhY2hlZENsZWFyVGltZW91dDtcblxuZnVuY3Rpb24gZGVmYXVsdFNldFRpbW91dCgpIHtcbiAgICB0aHJvdyBuZXcgRXJyb3IoJ3NldFRpbWVvdXQgaGFzIG5vdCBiZWVuIGRlZmluZWQnKTtcbn1cbmZ1bmN0aW9uIGRlZmF1bHRDbGVhclRpbWVvdXQgKCkge1xuICAgIHRocm93IG5ldyBFcnJvcignY2xlYXJUaW1lb3V0IGhhcyBub3QgYmVlbiBkZWZpbmVkJyk7XG59XG4oZnVuY3Rpb24gKCkge1xuICAgIHRyeSB7XG4gICAgICAgIGlmICh0eXBlb2Ygc2V0VGltZW91dCA9PT0gJ2Z1bmN0aW9uJykge1xuICAgICAgICAgICAgY2FjaGVkU2V0VGltZW91dCA9IHNldFRpbWVvdXQ7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBjYWNoZWRTZXRUaW1lb3V0ID0gZGVmYXVsdFNldFRpbW91dDtcbiAgICAgICAgfVxuICAgIH0gY2F0Y2ggKGUpIHtcbiAgICAgICAgY2FjaGVkU2V0VGltZW91dCA9IGRlZmF1bHRTZXRUaW1vdXQ7XG4gICAgfVxuICAgIHRyeSB7XG4gICAgICAgIGlmICh0eXBlb2YgY2xlYXJUaW1lb3V0ID09PSAnZnVuY3Rpb24nKSB7XG4gICAgICAgICAgICBjYWNoZWRDbGVhclRpbWVvdXQgPSBjbGVhclRpbWVvdXQ7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBjYWNoZWRDbGVhclRpbWVvdXQgPSBkZWZhdWx0Q2xlYXJUaW1lb3V0O1xuICAgICAgICB9XG4gICAgfSBjYXRjaCAoZSkge1xuICAgICAgICBjYWNoZWRDbGVhclRpbWVvdXQgPSBkZWZhdWx0Q2xlYXJUaW1lb3V0O1xuICAgIH1cbn0gKCkpXG5mdW5jdGlvbiBydW5UaW1lb3V0KGZ1bikge1xuICAgIGlmIChjYWNoZWRTZXRUaW1lb3V0ID09PSBzZXRUaW1lb3V0KSB7XG4gICAgICAgIC8vbm9ybWFsIGVudmlyb21lbnRzIGluIHNhbmUgc2l0dWF0aW9uc1xuICAgICAgICByZXR1cm4gc2V0VGltZW91dChmdW4sIDApO1xuICAgIH1cbiAgICAvLyBpZiBzZXRUaW1lb3V0IHdhc24ndCBhdmFpbGFibGUgYnV0IHdhcyBsYXR0ZXIgZGVmaW5lZFxuICAgIGlmICgoY2FjaGVkU2V0VGltZW91dCA9PT0gZGVmYXVsdFNldFRpbW91dCB8fCAhY2FjaGVkU2V0VGltZW91dCkgJiYgc2V0VGltZW91dCkge1xuICAgICAgICBjYWNoZWRTZXRUaW1lb3V0ID0gc2V0VGltZW91dDtcbiAgICAgICAgcmV0dXJuIHNldFRpbWVvdXQoZnVuLCAwKTtcbiAgICB9XG4gICAgdHJ5IHtcbiAgICAgICAgLy8gd2hlbiB3aGVuIHNvbWVib2R5IGhhcyBzY3Jld2VkIHdpdGggc2V0VGltZW91dCBidXQgbm8gSS5FLiBtYWRkbmVzc1xuICAgICAgICByZXR1cm4gY2FjaGVkU2V0VGltZW91dChmdW4sIDApO1xuICAgIH0gY2F0Y2goZSl7XG4gICAgICAgIHRyeSB7XG4gICAgICAgICAgICAvLyBXaGVuIHdlIGFyZSBpbiBJLkUuIGJ1dCB0aGUgc2NyaXB0IGhhcyBiZWVuIGV2YWxlZCBzbyBJLkUuIGRvZXNuJ3QgdHJ1c3QgdGhlIGdsb2JhbCBvYmplY3Qgd2hlbiBjYWxsZWQgbm9ybWFsbHlcbiAgICAgICAgICAgIHJldHVybiBjYWNoZWRTZXRUaW1lb3V0LmNhbGwobnVsbCwgZnVuLCAwKTtcbiAgICAgICAgfSBjYXRjaChlKXtcbiAgICAgICAgICAgIC8vIHNhbWUgYXMgYWJvdmUgYnV0IHdoZW4gaXQncyBhIHZlcnNpb24gb2YgSS5FLiB0aGF0IG11c3QgaGF2ZSB0aGUgZ2xvYmFsIG9iamVjdCBmb3IgJ3RoaXMnLCBob3BmdWxseSBvdXIgY29udGV4dCBjb3JyZWN0IG90aGVyd2lzZSBpdCB3aWxsIHRocm93IGEgZ2xvYmFsIGVycm9yXG4gICAgICAgICAgICByZXR1cm4gY2FjaGVkU2V0VGltZW91dC5jYWxsKHRoaXMsIGZ1biwgMCk7XG4gICAgICAgIH1cbiAgICB9XG5cblxufVxuZnVuY3Rpb24gcnVuQ2xlYXJUaW1lb3V0KG1hcmtlcikge1xuICAgIGlmIChjYWNoZWRDbGVhclRpbWVvdXQgPT09IGNsZWFyVGltZW91dCkge1xuICAgICAgICAvL25vcm1hbCBlbnZpcm9tZW50cyBpbiBzYW5lIHNpdHVhdGlvbnNcbiAgICAgICAgcmV0dXJuIGNsZWFyVGltZW91dChtYXJrZXIpO1xuICAgIH1cbiAgICAvLyBpZiBjbGVhclRpbWVvdXQgd2Fzbid0IGF2YWlsYWJsZSBidXQgd2FzIGxhdHRlciBkZWZpbmVkXG4gICAgaWYgKChjYWNoZWRDbGVhclRpbWVvdXQgPT09IGRlZmF1bHRDbGVhclRpbWVvdXQgfHwgIWNhY2hlZENsZWFyVGltZW91dCkgJiYgY2xlYXJUaW1lb3V0KSB7XG4gICAgICAgIGNhY2hlZENsZWFyVGltZW91dCA9IGNsZWFyVGltZW91dDtcbiAgICAgICAgcmV0dXJuIGNsZWFyVGltZW91dChtYXJrZXIpO1xuICAgIH1cbiAgICB0cnkge1xuICAgICAgICAvLyB3aGVuIHdoZW4gc29tZWJvZHkgaGFzIHNjcmV3ZWQgd2l0aCBzZXRUaW1lb3V0IGJ1dCBubyBJLkUuIG1hZGRuZXNzXG4gICAgICAgIHJldHVybiBjYWNoZWRDbGVhclRpbWVvdXQobWFya2VyKTtcbiAgICB9IGNhdGNoIChlKXtcbiAgICAgICAgdHJ5IHtcbiAgICAgICAgICAgIC8vIFdoZW4gd2UgYXJlIGluIEkuRS4gYnV0IHRoZSBzY3JpcHQgaGFzIGJlZW4gZXZhbGVkIHNvIEkuRS4gZG9lc24ndCAgdHJ1c3QgdGhlIGdsb2JhbCBvYmplY3Qgd2hlbiBjYWxsZWQgbm9ybWFsbHlcbiAgICAgICAgICAgIHJldHVybiBjYWNoZWRDbGVhclRpbWVvdXQuY2FsbChudWxsLCBtYXJrZXIpO1xuICAgICAgICB9IGNhdGNoIChlKXtcbiAgICAgICAgICAgIC8vIHNhbWUgYXMgYWJvdmUgYnV0IHdoZW4gaXQncyBhIHZlcnNpb24gb2YgSS5FLiB0aGF0IG11c3QgaGF2ZSB0aGUgZ2xvYmFsIG9iamVjdCBmb3IgJ3RoaXMnLCBob3BmdWxseSBvdXIgY29udGV4dCBjb3JyZWN0IG90aGVyd2lzZSBpdCB3aWxsIHRocm93IGEgZ2xvYmFsIGVycm9yLlxuICAgICAgICAgICAgLy8gU29tZSB2ZXJzaW9ucyBvZiBJLkUuIGhhdmUgZGlmZmVyZW50IHJ1bGVzIGZvciBjbGVhclRpbWVvdXQgdnMgc2V0VGltZW91dFxuICAgICAgICAgICAgcmV0dXJuIGNhY2hlZENsZWFyVGltZW91dC5jYWxsKHRoaXMsIG1hcmtlcik7XG4gICAgICAgIH1cbiAgICB9XG5cblxuXG59XG52YXIgcXVldWUgPSBbXTtcbnZhciBkcmFpbmluZyA9IGZhbHNlO1xudmFyIGN1cnJlbnRRdWV1ZTtcbnZhciBxdWV1ZUluZGV4ID0gLTE7XG5cbmZ1bmN0aW9uIGNsZWFuVXBOZXh0VGljaygpIHtcbiAgICBpZiAoIWRyYWluaW5nIHx8ICFjdXJyZW50UXVldWUpIHtcbiAgICAgICAgcmV0dXJuO1xuICAgIH1cbiAgICBkcmFpbmluZyA9IGZhbHNlO1xuICAgIGlmIChjdXJyZW50UXVldWUubGVuZ3RoKSB7XG4gICAgICAgIHF1ZXVlID0gY3VycmVudFF1ZXVlLmNvbmNhdChxdWV1ZSk7XG4gICAgfSBlbHNlIHtcbiAgICAgICAgcXVldWVJbmRleCA9IC0xO1xuICAgIH1cbiAgICBpZiAocXVldWUubGVuZ3RoKSB7XG4gICAgICAgIGRyYWluUXVldWUoKTtcbiAgICB9XG59XG5cbmZ1bmN0aW9uIGRyYWluUXVldWUoKSB7XG4gICAgaWYgKGRyYWluaW5nKSB7XG4gICAgICAgIHJldHVybjtcbiAgICB9XG4gICAgdmFyIHRpbWVvdXQgPSBydW5UaW1lb3V0KGNsZWFuVXBOZXh0VGljayk7XG4gICAgZHJhaW5pbmcgPSB0cnVlO1xuXG4gICAgdmFyIGxlbiA9IHF1ZXVlLmxlbmd0aDtcbiAgICB3aGlsZShsZW4pIHtcbiAgICAgICAgY3VycmVudFF1ZXVlID0gcXVldWU7XG4gICAgICAgIHF1ZXVlID0gW107XG4gICAgICAgIHdoaWxlICgrK3F1ZXVlSW5kZXggPCBsZW4pIHtcbiAgICAgICAgICAgIGlmIChjdXJyZW50UXVldWUpIHtcbiAgICAgICAgICAgICAgICBjdXJyZW50UXVldWVbcXVldWVJbmRleF0ucnVuKCk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgcXVldWVJbmRleCA9IC0xO1xuICAgICAgICBsZW4gPSBxdWV1ZS5sZW5ndGg7XG4gICAgfVxuICAgIGN1cnJlbnRRdWV1ZSA9IG51bGw7XG4gICAgZHJhaW5pbmcgPSBmYWxzZTtcbiAgICBydW5DbGVhclRpbWVvdXQodGltZW91dCk7XG59XG5cbnByb2Nlc3MubmV4dFRpY2sgPSBmdW5jdGlvbiAoZnVuKSB7XG4gICAgdmFyIGFyZ3MgPSBuZXcgQXJyYXkoYXJndW1lbnRzLmxlbmd0aCAtIDEpO1xuICAgIGlmIChhcmd1bWVudHMubGVuZ3RoID4gMSkge1xuICAgICAgICBmb3IgKHZhciBpID0gMTsgaSA8IGFyZ3VtZW50cy5sZW5ndGg7IGkrKykge1xuICAgICAgICAgICAgYXJnc1tpIC0gMV0gPSBhcmd1bWVudHNbaV07XG4gICAgICAgIH1cbiAgICB9XG4gICAgcXVldWUucHVzaChuZXcgSXRlbShmdW4sIGFyZ3MpKTtcbiAgICBpZiAocXVldWUubGVuZ3RoID09PSAxICYmICFkcmFpbmluZykge1xuICAgICAgICBydW5UaW1lb3V0KGRyYWluUXVldWUpO1xuICAgIH1cbn07XG5cbi8vIHY4IGxpa2VzIHByZWRpY3RpYmxlIG9iamVjdHNcbmZ1bmN0aW9uIEl0ZW0oZnVuLCBhcnJheSkge1xuICAgIHRoaXMuZnVuID0gZnVuO1xuICAgIHRoaXMuYXJyYXkgPSBhcnJheTtcbn1cbkl0ZW0ucHJvdG90eXBlLnJ1biA9IGZ1bmN0aW9uICgpIHtcbiAgICB0aGlzLmZ1bi5hcHBseShudWxsLCB0aGlzLmFycmF5KTtcbn07XG5wcm9jZXNzLnRpdGxlID0gJ2Jyb3dzZXInO1xucHJvY2Vzcy5icm93c2VyID0gdHJ1ZTtcbnByb2Nlc3MuZW52ID0ge307XG5wcm9jZXNzLmFyZ3YgPSBbXTtcbnByb2Nlc3MudmVyc2lvbiA9ICcnOyAvLyBlbXB0eSBzdHJpbmcgdG8gYXZvaWQgcmVnZXhwIGlzc3Vlc1xucHJvY2Vzcy52ZXJzaW9ucyA9IHt9O1xuXG5mdW5jdGlvbiBub29wKCkge31cblxucHJvY2Vzcy5vbiA9IG5vb3A7XG5wcm9jZXNzLmFkZExpc3RlbmVyID0gbm9vcDtcbnByb2Nlc3Mub25jZSA9IG5vb3A7XG5wcm9jZXNzLm9mZiA9IG5vb3A7XG5wcm9jZXNzLnJlbW92ZUxpc3RlbmVyID0gbm9vcDtcbnByb2Nlc3MucmVtb3ZlQWxsTGlzdGVuZXJzID0gbm9vcDtcbnByb2Nlc3MuZW1pdCA9IG5vb3A7XG5wcm9jZXNzLnByZXBlbmRMaXN0ZW5lciA9IG5vb3A7XG5wcm9jZXNzLnByZXBlbmRPbmNlTGlzdGVuZXIgPSBub29wO1xuXG5wcm9jZXNzLmxpc3RlbmVycyA9IGZ1bmN0aW9uIChuYW1lKSB7IHJldHVybiBbXSB9XG5cbnByb2Nlc3MuYmluZGluZyA9IGZ1bmN0aW9uIChuYW1lKSB7XG4gICAgdGhyb3cgbmV3IEVycm9yKCdwcm9jZXNzLmJpbmRpbmcgaXMgbm90IHN1cHBvcnRlZCcpO1xufTtcblxucHJvY2Vzcy5jd2QgPSBmdW5jdGlvbiAoKSB7IHJldHVybiAnLycgfTtcbnByb2Nlc3MuY2hkaXIgPSBmdW5jdGlvbiAoZGlyKSB7XG4gICAgdGhyb3cgbmV3IEVycm9yKCdwcm9jZXNzLmNoZGlyIGlzIG5vdCBzdXBwb3J0ZWQnKTtcbn07XG5wcm9jZXNzLnVtYXNrID0gZnVuY3Rpb24oKSB7IHJldHVybiAwOyB9O1xuIiwiKGZ1bmN0aW9uIChnbG9iYWwsIGZhY3RvcnkpIHtcbiAgdHlwZW9mIGV4cG9ydHMgPT09ICdvYmplY3QnICYmIHR5cGVvZiBtb2R1bGUgIT09ICd1bmRlZmluZWQnID8gZmFjdG9yeShleHBvcnRzKSA6XG4gIHR5cGVvZiBkZWZpbmUgPT09ICdmdW5jdGlvbicgJiYgZGVmaW5lLmFtZCA/IGRlZmluZShbJ2V4cG9ydHMnXSwgZmFjdG9yeSkgOlxuICAoZmFjdG9yeSgoZ2xvYmFsLldIQVRXR0ZldGNoID0ge30pKSk7XG59KHRoaXMsIChmdW5jdGlvbiAoZXhwb3J0cykgeyAndXNlIHN0cmljdCc7XG5cbiAgdmFyIHN1cHBvcnQgPSB7XG4gICAgc2VhcmNoUGFyYW1zOiAnVVJMU2VhcmNoUGFyYW1zJyBpbiBzZWxmLFxuICAgIGl0ZXJhYmxlOiAnU3ltYm9sJyBpbiBzZWxmICYmICdpdGVyYXRvcicgaW4gU3ltYm9sLFxuICAgIGJsb2I6XG4gICAgICAnRmlsZVJlYWRlcicgaW4gc2VsZiAmJlxuICAgICAgJ0Jsb2InIGluIHNlbGYgJiZcbiAgICAgIChmdW5jdGlvbigpIHtcbiAgICAgICAgdHJ5IHtcbiAgICAgICAgICBuZXcgQmxvYigpO1xuICAgICAgICAgIHJldHVybiB0cnVlXG4gICAgICAgIH0gY2F0Y2ggKGUpIHtcbiAgICAgICAgICByZXR1cm4gZmFsc2VcbiAgICAgICAgfVxuICAgICAgfSkoKSxcbiAgICBmb3JtRGF0YTogJ0Zvcm1EYXRhJyBpbiBzZWxmLFxuICAgIGFycmF5QnVmZmVyOiAnQXJyYXlCdWZmZXInIGluIHNlbGZcbiAgfTtcblxuICBmdW5jdGlvbiBpc0RhdGFWaWV3KG9iaikge1xuICAgIHJldHVybiBvYmogJiYgRGF0YVZpZXcucHJvdG90eXBlLmlzUHJvdG90eXBlT2Yob2JqKVxuICB9XG5cbiAgaWYgKHN1cHBvcnQuYXJyYXlCdWZmZXIpIHtcbiAgICB2YXIgdmlld0NsYXNzZXMgPSBbXG4gICAgICAnW29iamVjdCBJbnQ4QXJyYXldJyxcbiAgICAgICdbb2JqZWN0IFVpbnQ4QXJyYXldJyxcbiAgICAgICdbb2JqZWN0IFVpbnQ4Q2xhbXBlZEFycmF5XScsXG4gICAgICAnW29iamVjdCBJbnQxNkFycmF5XScsXG4gICAgICAnW29iamVjdCBVaW50MTZBcnJheV0nLFxuICAgICAgJ1tvYmplY3QgSW50MzJBcnJheV0nLFxuICAgICAgJ1tvYmplY3QgVWludDMyQXJyYXldJyxcbiAgICAgICdbb2JqZWN0IEZsb2F0MzJBcnJheV0nLFxuICAgICAgJ1tvYmplY3QgRmxvYXQ2NEFycmF5XSdcbiAgICBdO1xuXG4gICAgdmFyIGlzQXJyYXlCdWZmZXJWaWV3ID1cbiAgICAgIEFycmF5QnVmZmVyLmlzVmlldyB8fFxuICAgICAgZnVuY3Rpb24ob2JqKSB7XG4gICAgICAgIHJldHVybiBvYmogJiYgdmlld0NsYXNzZXMuaW5kZXhPZihPYmplY3QucHJvdG90eXBlLnRvU3RyaW5nLmNhbGwob2JqKSkgPiAtMVxuICAgICAgfTtcbiAgfVxuXG4gIGZ1bmN0aW9uIG5vcm1hbGl6ZU5hbWUobmFtZSkge1xuICAgIGlmICh0eXBlb2YgbmFtZSAhPT0gJ3N0cmluZycpIHtcbiAgICAgIG5hbWUgPSBTdHJpbmcobmFtZSk7XG4gICAgfVxuICAgIGlmICgvW15hLXowLTlcXC0jJCUmJyorLl5fYHx+XS9pLnRlc3QobmFtZSkpIHtcbiAgICAgIHRocm93IG5ldyBUeXBlRXJyb3IoJ0ludmFsaWQgY2hhcmFjdGVyIGluIGhlYWRlciBmaWVsZCBuYW1lJylcbiAgICB9XG4gICAgcmV0dXJuIG5hbWUudG9Mb3dlckNhc2UoKVxuICB9XG5cbiAgZnVuY3Rpb24gbm9ybWFsaXplVmFsdWUodmFsdWUpIHtcbiAgICBpZiAodHlwZW9mIHZhbHVlICE9PSAnc3RyaW5nJykge1xuICAgICAgdmFsdWUgPSBTdHJpbmcodmFsdWUpO1xuICAgIH1cbiAgICByZXR1cm4gdmFsdWVcbiAgfVxuXG4gIC8vIEJ1aWxkIGEgZGVzdHJ1Y3RpdmUgaXRlcmF0b3IgZm9yIHRoZSB2YWx1ZSBsaXN0XG4gIGZ1bmN0aW9uIGl0ZXJhdG9yRm9yKGl0ZW1zKSB7XG4gICAgdmFyIGl0ZXJhdG9yID0ge1xuICAgICAgbmV4dDogZnVuY3Rpb24oKSB7XG4gICAgICAgIHZhciB2YWx1ZSA9IGl0ZW1zLnNoaWZ0KCk7XG4gICAgICAgIHJldHVybiB7ZG9uZTogdmFsdWUgPT09IHVuZGVmaW5lZCwgdmFsdWU6IHZhbHVlfVxuICAgICAgfVxuICAgIH07XG5cbiAgICBpZiAoc3VwcG9ydC5pdGVyYWJsZSkge1xuICAgICAgaXRlcmF0b3JbU3ltYm9sLml0ZXJhdG9yXSA9IGZ1bmN0aW9uKCkge1xuICAgICAgICByZXR1cm4gaXRlcmF0b3JcbiAgICAgIH07XG4gICAgfVxuXG4gICAgcmV0dXJuIGl0ZXJhdG9yXG4gIH1cblxuICBmdW5jdGlvbiBIZWFkZXJzKGhlYWRlcnMpIHtcbiAgICB0aGlzLm1hcCA9IHt9O1xuXG4gICAgaWYgKGhlYWRlcnMgaW5zdGFuY2VvZiBIZWFkZXJzKSB7XG4gICAgICBoZWFkZXJzLmZvckVhY2goZnVuY3Rpb24odmFsdWUsIG5hbWUpIHtcbiAgICAgICAgdGhpcy5hcHBlbmQobmFtZSwgdmFsdWUpO1xuICAgICAgfSwgdGhpcyk7XG4gICAgfSBlbHNlIGlmIChBcnJheS5pc0FycmF5KGhlYWRlcnMpKSB7XG4gICAgICBoZWFkZXJzLmZvckVhY2goZnVuY3Rpb24oaGVhZGVyKSB7XG4gICAgICAgIHRoaXMuYXBwZW5kKGhlYWRlclswXSwgaGVhZGVyWzFdKTtcbiAgICAgIH0sIHRoaXMpO1xuICAgIH0gZWxzZSBpZiAoaGVhZGVycykge1xuICAgICAgT2JqZWN0LmdldE93blByb3BlcnR5TmFtZXMoaGVhZGVycykuZm9yRWFjaChmdW5jdGlvbihuYW1lKSB7XG4gICAgICAgIHRoaXMuYXBwZW5kKG5hbWUsIGhlYWRlcnNbbmFtZV0pO1xuICAgICAgfSwgdGhpcyk7XG4gICAgfVxuICB9XG5cbiAgSGVhZGVycy5wcm90b3R5cGUuYXBwZW5kID0gZnVuY3Rpb24obmFtZSwgdmFsdWUpIHtcbiAgICBuYW1lID0gbm9ybWFsaXplTmFtZShuYW1lKTtcbiAgICB2YWx1ZSA9IG5vcm1hbGl6ZVZhbHVlKHZhbHVlKTtcbiAgICB2YXIgb2xkVmFsdWUgPSB0aGlzLm1hcFtuYW1lXTtcbiAgICB0aGlzLm1hcFtuYW1lXSA9IG9sZFZhbHVlID8gb2xkVmFsdWUgKyAnLCAnICsgdmFsdWUgOiB2YWx1ZTtcbiAgfTtcblxuICBIZWFkZXJzLnByb3RvdHlwZVsnZGVsZXRlJ10gPSBmdW5jdGlvbihuYW1lKSB7XG4gICAgZGVsZXRlIHRoaXMubWFwW25vcm1hbGl6ZU5hbWUobmFtZSldO1xuICB9O1xuXG4gIEhlYWRlcnMucHJvdG90eXBlLmdldCA9IGZ1bmN0aW9uKG5hbWUpIHtcbiAgICBuYW1lID0gbm9ybWFsaXplTmFtZShuYW1lKTtcbiAgICByZXR1cm4gdGhpcy5oYXMobmFtZSkgPyB0aGlzLm1hcFtuYW1lXSA6IG51bGxcbiAgfTtcblxuICBIZWFkZXJzLnByb3RvdHlwZS5oYXMgPSBmdW5jdGlvbihuYW1lKSB7XG4gICAgcmV0dXJuIHRoaXMubWFwLmhhc093blByb3BlcnR5KG5vcm1hbGl6ZU5hbWUobmFtZSkpXG4gIH07XG5cbiAgSGVhZGVycy5wcm90b3R5cGUuc2V0ID0gZnVuY3Rpb24obmFtZSwgdmFsdWUpIHtcbiAgICB0aGlzLm1hcFtub3JtYWxpemVOYW1lKG5hbWUpXSA9IG5vcm1hbGl6ZVZhbHVlKHZhbHVlKTtcbiAgfTtcblxuICBIZWFkZXJzLnByb3RvdHlwZS5mb3JFYWNoID0gZnVuY3Rpb24oY2FsbGJhY2ssIHRoaXNBcmcpIHtcbiAgICBmb3IgKHZhciBuYW1lIGluIHRoaXMubWFwKSB7XG4gICAgICBpZiAodGhpcy5tYXAuaGFzT3duUHJvcGVydHkobmFtZSkpIHtcbiAgICAgICAgY2FsbGJhY2suY2FsbCh0aGlzQXJnLCB0aGlzLm1hcFtuYW1lXSwgbmFtZSwgdGhpcyk7XG4gICAgICB9XG4gICAgfVxuICB9O1xuXG4gIEhlYWRlcnMucHJvdG90eXBlLmtleXMgPSBmdW5jdGlvbigpIHtcbiAgICB2YXIgaXRlbXMgPSBbXTtcbiAgICB0aGlzLmZvckVhY2goZnVuY3Rpb24odmFsdWUsIG5hbWUpIHtcbiAgICAgIGl0ZW1zLnB1c2gobmFtZSk7XG4gICAgfSk7XG4gICAgcmV0dXJuIGl0ZXJhdG9yRm9yKGl0ZW1zKVxuICB9O1xuXG4gIEhlYWRlcnMucHJvdG90eXBlLnZhbHVlcyA9IGZ1bmN0aW9uKCkge1xuICAgIHZhciBpdGVtcyA9IFtdO1xuICAgIHRoaXMuZm9yRWFjaChmdW5jdGlvbih2YWx1ZSkge1xuICAgICAgaXRlbXMucHVzaCh2YWx1ZSk7XG4gICAgfSk7XG4gICAgcmV0dXJuIGl0ZXJhdG9yRm9yKGl0ZW1zKVxuICB9O1xuXG4gIEhlYWRlcnMucHJvdG90eXBlLmVudHJpZXMgPSBmdW5jdGlvbigpIHtcbiAgICB2YXIgaXRlbXMgPSBbXTtcbiAgICB0aGlzLmZvckVhY2goZnVuY3Rpb24odmFsdWUsIG5hbWUpIHtcbiAgICAgIGl0ZW1zLnB1c2goW25hbWUsIHZhbHVlXSk7XG4gICAgfSk7XG4gICAgcmV0dXJuIGl0ZXJhdG9yRm9yKGl0ZW1zKVxuICB9O1xuXG4gIGlmIChzdXBwb3J0Lml0ZXJhYmxlKSB7XG4gICAgSGVhZGVycy5wcm90b3R5cGVbU3ltYm9sLml0ZXJhdG9yXSA9IEhlYWRlcnMucHJvdG90eXBlLmVudHJpZXM7XG4gIH1cblxuICBmdW5jdGlvbiBjb25zdW1lZChib2R5KSB7XG4gICAgaWYgKGJvZHkuYm9keVVzZWQpIHtcbiAgICAgIHJldHVybiBQcm9taXNlLnJlamVjdChuZXcgVHlwZUVycm9yKCdBbHJlYWR5IHJlYWQnKSlcbiAgICB9XG4gICAgYm9keS5ib2R5VXNlZCA9IHRydWU7XG4gIH1cblxuICBmdW5jdGlvbiBmaWxlUmVhZGVyUmVhZHkocmVhZGVyKSB7XG4gICAgcmV0dXJuIG5ldyBQcm9taXNlKGZ1bmN0aW9uKHJlc29sdmUsIHJlamVjdCkge1xuICAgICAgcmVhZGVyLm9ubG9hZCA9IGZ1bmN0aW9uKCkge1xuICAgICAgICByZXNvbHZlKHJlYWRlci5yZXN1bHQpO1xuICAgICAgfTtcbiAgICAgIHJlYWRlci5vbmVycm9yID0gZnVuY3Rpb24oKSB7XG4gICAgICAgIHJlamVjdChyZWFkZXIuZXJyb3IpO1xuICAgICAgfTtcbiAgICB9KVxuICB9XG5cbiAgZnVuY3Rpb24gcmVhZEJsb2JBc0FycmF5QnVmZmVyKGJsb2IpIHtcbiAgICB2YXIgcmVhZGVyID0gbmV3IEZpbGVSZWFkZXIoKTtcbiAgICB2YXIgcHJvbWlzZSA9IGZpbGVSZWFkZXJSZWFkeShyZWFkZXIpO1xuICAgIHJlYWRlci5yZWFkQXNBcnJheUJ1ZmZlcihibG9iKTtcbiAgICByZXR1cm4gcHJvbWlzZVxuICB9XG5cbiAgZnVuY3Rpb24gcmVhZEJsb2JBc1RleHQoYmxvYikge1xuICAgIHZhciByZWFkZXIgPSBuZXcgRmlsZVJlYWRlcigpO1xuICAgIHZhciBwcm9taXNlID0gZmlsZVJlYWRlclJlYWR5KHJlYWRlcik7XG4gICAgcmVhZGVyLnJlYWRBc1RleHQoYmxvYik7XG4gICAgcmV0dXJuIHByb21pc2VcbiAgfVxuXG4gIGZ1bmN0aW9uIHJlYWRBcnJheUJ1ZmZlckFzVGV4dChidWYpIHtcbiAgICB2YXIgdmlldyA9IG5ldyBVaW50OEFycmF5KGJ1Zik7XG4gICAgdmFyIGNoYXJzID0gbmV3IEFycmF5KHZpZXcubGVuZ3RoKTtcblxuICAgIGZvciAodmFyIGkgPSAwOyBpIDwgdmlldy5sZW5ndGg7IGkrKykge1xuICAgICAgY2hhcnNbaV0gPSBTdHJpbmcuZnJvbUNoYXJDb2RlKHZpZXdbaV0pO1xuICAgIH1cbiAgICByZXR1cm4gY2hhcnMuam9pbignJylcbiAgfVxuXG4gIGZ1bmN0aW9uIGJ1ZmZlckNsb25lKGJ1Zikge1xuICAgIGlmIChidWYuc2xpY2UpIHtcbiAgICAgIHJldHVybiBidWYuc2xpY2UoMClcbiAgICB9IGVsc2Uge1xuICAgICAgdmFyIHZpZXcgPSBuZXcgVWludDhBcnJheShidWYuYnl0ZUxlbmd0aCk7XG4gICAgICB2aWV3LnNldChuZXcgVWludDhBcnJheShidWYpKTtcbiAgICAgIHJldHVybiB2aWV3LmJ1ZmZlclxuICAgIH1cbiAgfVxuXG4gIGZ1bmN0aW9uIEJvZHkoKSB7XG4gICAgdGhpcy5ib2R5VXNlZCA9IGZhbHNlO1xuXG4gICAgdGhpcy5faW5pdEJvZHkgPSBmdW5jdGlvbihib2R5KSB7XG4gICAgICB0aGlzLl9ib2R5SW5pdCA9IGJvZHk7XG4gICAgICBpZiAoIWJvZHkpIHtcbiAgICAgICAgdGhpcy5fYm9keVRleHQgPSAnJztcbiAgICAgIH0gZWxzZSBpZiAodHlwZW9mIGJvZHkgPT09ICdzdHJpbmcnKSB7XG4gICAgICAgIHRoaXMuX2JvZHlUZXh0ID0gYm9keTtcbiAgICAgIH0gZWxzZSBpZiAoc3VwcG9ydC5ibG9iICYmIEJsb2IucHJvdG90eXBlLmlzUHJvdG90eXBlT2YoYm9keSkpIHtcbiAgICAgICAgdGhpcy5fYm9keUJsb2IgPSBib2R5O1xuICAgICAgfSBlbHNlIGlmIChzdXBwb3J0LmZvcm1EYXRhICYmIEZvcm1EYXRhLnByb3RvdHlwZS5pc1Byb3RvdHlwZU9mKGJvZHkpKSB7XG4gICAgICAgIHRoaXMuX2JvZHlGb3JtRGF0YSA9IGJvZHk7XG4gICAgICB9IGVsc2UgaWYgKHN1cHBvcnQuc2VhcmNoUGFyYW1zICYmIFVSTFNlYXJjaFBhcmFtcy5wcm90b3R5cGUuaXNQcm90b3R5cGVPZihib2R5KSkge1xuICAgICAgICB0aGlzLl9ib2R5VGV4dCA9IGJvZHkudG9TdHJpbmcoKTtcbiAgICAgIH0gZWxzZSBpZiAoc3VwcG9ydC5hcnJheUJ1ZmZlciAmJiBzdXBwb3J0LmJsb2IgJiYgaXNEYXRhVmlldyhib2R5KSkge1xuICAgICAgICB0aGlzLl9ib2R5QXJyYXlCdWZmZXIgPSBidWZmZXJDbG9uZShib2R5LmJ1ZmZlcik7XG4gICAgICAgIC8vIElFIDEwLTExIGNhbid0IGhhbmRsZSBhIERhdGFWaWV3IGJvZHkuXG4gICAgICAgIHRoaXMuX2JvZHlJbml0ID0gbmV3IEJsb2IoW3RoaXMuX2JvZHlBcnJheUJ1ZmZlcl0pO1xuICAgICAgfSBlbHNlIGlmIChzdXBwb3J0LmFycmF5QnVmZmVyICYmIChBcnJheUJ1ZmZlci5wcm90b3R5cGUuaXNQcm90b3R5cGVPZihib2R5KSB8fCBpc0FycmF5QnVmZmVyVmlldyhib2R5KSkpIHtcbiAgICAgICAgdGhpcy5fYm9keUFycmF5QnVmZmVyID0gYnVmZmVyQ2xvbmUoYm9keSk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICB0aGlzLl9ib2R5VGV4dCA9IGJvZHkgPSBPYmplY3QucHJvdG90eXBlLnRvU3RyaW5nLmNhbGwoYm9keSk7XG4gICAgICB9XG5cbiAgICAgIGlmICghdGhpcy5oZWFkZXJzLmdldCgnY29udGVudC10eXBlJykpIHtcbiAgICAgICAgaWYgKHR5cGVvZiBib2R5ID09PSAnc3RyaW5nJykge1xuICAgICAgICAgIHRoaXMuaGVhZGVycy5zZXQoJ2NvbnRlbnQtdHlwZScsICd0ZXh0L3BsYWluO2NoYXJzZXQ9VVRGLTgnKTtcbiAgICAgICAgfSBlbHNlIGlmICh0aGlzLl9ib2R5QmxvYiAmJiB0aGlzLl9ib2R5QmxvYi50eXBlKSB7XG4gICAgICAgICAgdGhpcy5oZWFkZXJzLnNldCgnY29udGVudC10eXBlJywgdGhpcy5fYm9keUJsb2IudHlwZSk7XG4gICAgICAgIH0gZWxzZSBpZiAoc3VwcG9ydC5zZWFyY2hQYXJhbXMgJiYgVVJMU2VhcmNoUGFyYW1zLnByb3RvdHlwZS5pc1Byb3RvdHlwZU9mKGJvZHkpKSB7XG4gICAgICAgICAgdGhpcy5oZWFkZXJzLnNldCgnY29udGVudC10eXBlJywgJ2FwcGxpY2F0aW9uL3gtd3d3LWZvcm0tdXJsZW5jb2RlZDtjaGFyc2V0PVVURi04Jyk7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9O1xuXG4gICAgaWYgKHN1cHBvcnQuYmxvYikge1xuICAgICAgdGhpcy5ibG9iID0gZnVuY3Rpb24oKSB7XG4gICAgICAgIHZhciByZWplY3RlZCA9IGNvbnN1bWVkKHRoaXMpO1xuICAgICAgICBpZiAocmVqZWN0ZWQpIHtcbiAgICAgICAgICByZXR1cm4gcmVqZWN0ZWRcbiAgICAgICAgfVxuXG4gICAgICAgIGlmICh0aGlzLl9ib2R5QmxvYikge1xuICAgICAgICAgIHJldHVybiBQcm9taXNlLnJlc29sdmUodGhpcy5fYm9keUJsb2IpXG4gICAgICAgIH0gZWxzZSBpZiAodGhpcy5fYm9keUFycmF5QnVmZmVyKSB7XG4gICAgICAgICAgcmV0dXJuIFByb21pc2UucmVzb2x2ZShuZXcgQmxvYihbdGhpcy5fYm9keUFycmF5QnVmZmVyXSkpXG4gICAgICAgIH0gZWxzZSBpZiAodGhpcy5fYm9keUZvcm1EYXRhKSB7XG4gICAgICAgICAgdGhyb3cgbmV3IEVycm9yKCdjb3VsZCBub3QgcmVhZCBGb3JtRGF0YSBib2R5IGFzIGJsb2InKVxuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIHJldHVybiBQcm9taXNlLnJlc29sdmUobmV3IEJsb2IoW3RoaXMuX2JvZHlUZXh0XSkpXG4gICAgICAgIH1cbiAgICAgIH07XG5cbiAgICAgIHRoaXMuYXJyYXlCdWZmZXIgPSBmdW5jdGlvbigpIHtcbiAgICAgICAgaWYgKHRoaXMuX2JvZHlBcnJheUJ1ZmZlcikge1xuICAgICAgICAgIHJldHVybiBjb25zdW1lZCh0aGlzKSB8fCBQcm9taXNlLnJlc29sdmUodGhpcy5fYm9keUFycmF5QnVmZmVyKVxuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIHJldHVybiB0aGlzLmJsb2IoKS50aGVuKHJlYWRCbG9iQXNBcnJheUJ1ZmZlcilcbiAgICAgICAgfVxuICAgICAgfTtcbiAgICB9XG5cbiAgICB0aGlzLnRleHQgPSBmdW5jdGlvbigpIHtcbiAgICAgIHZhciByZWplY3RlZCA9IGNvbnN1bWVkKHRoaXMpO1xuICAgICAgaWYgKHJlamVjdGVkKSB7XG4gICAgICAgIHJldHVybiByZWplY3RlZFxuICAgICAgfVxuXG4gICAgICBpZiAodGhpcy5fYm9keUJsb2IpIHtcbiAgICAgICAgcmV0dXJuIHJlYWRCbG9iQXNUZXh0KHRoaXMuX2JvZHlCbG9iKVxuICAgICAgfSBlbHNlIGlmICh0aGlzLl9ib2R5QXJyYXlCdWZmZXIpIHtcbiAgICAgICAgcmV0dXJuIFByb21pc2UucmVzb2x2ZShyZWFkQXJyYXlCdWZmZXJBc1RleHQodGhpcy5fYm9keUFycmF5QnVmZmVyKSlcbiAgICAgIH0gZWxzZSBpZiAodGhpcy5fYm9keUZvcm1EYXRhKSB7XG4gICAgICAgIHRocm93IG5ldyBFcnJvcignY291bGQgbm90IHJlYWQgRm9ybURhdGEgYm9keSBhcyB0ZXh0JylcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHJldHVybiBQcm9taXNlLnJlc29sdmUodGhpcy5fYm9keVRleHQpXG4gICAgICB9XG4gICAgfTtcblxuICAgIGlmIChzdXBwb3J0LmZvcm1EYXRhKSB7XG4gICAgICB0aGlzLmZvcm1EYXRhID0gZnVuY3Rpb24oKSB7XG4gICAgICAgIHJldHVybiB0aGlzLnRleHQoKS50aGVuKGRlY29kZSlcbiAgICAgIH07XG4gICAgfVxuXG4gICAgdGhpcy5qc29uID0gZnVuY3Rpb24oKSB7XG4gICAgICByZXR1cm4gdGhpcy50ZXh0KCkudGhlbihKU09OLnBhcnNlKVxuICAgIH07XG5cbiAgICByZXR1cm4gdGhpc1xuICB9XG5cbiAgLy8gSFRUUCBtZXRob2RzIHdob3NlIGNhcGl0YWxpemF0aW9uIHNob3VsZCBiZSBub3JtYWxpemVkXG4gIHZhciBtZXRob2RzID0gWydERUxFVEUnLCAnR0VUJywgJ0hFQUQnLCAnT1BUSU9OUycsICdQT1NUJywgJ1BVVCddO1xuXG4gIGZ1bmN0aW9uIG5vcm1hbGl6ZU1ldGhvZChtZXRob2QpIHtcbiAgICB2YXIgdXBjYXNlZCA9IG1ldGhvZC50b1VwcGVyQ2FzZSgpO1xuICAgIHJldHVybiBtZXRob2RzLmluZGV4T2YodXBjYXNlZCkgPiAtMSA/IHVwY2FzZWQgOiBtZXRob2RcbiAgfVxuXG4gIGZ1bmN0aW9uIFJlcXVlc3QoaW5wdXQsIG9wdGlvbnMpIHtcbiAgICBvcHRpb25zID0gb3B0aW9ucyB8fCB7fTtcbiAgICB2YXIgYm9keSA9IG9wdGlvbnMuYm9keTtcblxuICAgIGlmIChpbnB1dCBpbnN0YW5jZW9mIFJlcXVlc3QpIHtcbiAgICAgIGlmIChpbnB1dC5ib2R5VXNlZCkge1xuICAgICAgICB0aHJvdyBuZXcgVHlwZUVycm9yKCdBbHJlYWR5IHJlYWQnKVxuICAgICAgfVxuICAgICAgdGhpcy51cmwgPSBpbnB1dC51cmw7XG4gICAgICB0aGlzLmNyZWRlbnRpYWxzID0gaW5wdXQuY3JlZGVudGlhbHM7XG4gICAgICBpZiAoIW9wdGlvbnMuaGVhZGVycykge1xuICAgICAgICB0aGlzLmhlYWRlcnMgPSBuZXcgSGVhZGVycyhpbnB1dC5oZWFkZXJzKTtcbiAgICAgIH1cbiAgICAgIHRoaXMubWV0aG9kID0gaW5wdXQubWV0aG9kO1xuICAgICAgdGhpcy5tb2RlID0gaW5wdXQubW9kZTtcbiAgICAgIHRoaXMuc2lnbmFsID0gaW5wdXQuc2lnbmFsO1xuICAgICAgaWYgKCFib2R5ICYmIGlucHV0Ll9ib2R5SW5pdCAhPSBudWxsKSB7XG4gICAgICAgIGJvZHkgPSBpbnB1dC5fYm9keUluaXQ7XG4gICAgICAgIGlucHV0LmJvZHlVc2VkID0gdHJ1ZTtcbiAgICAgIH1cbiAgICB9IGVsc2Uge1xuICAgICAgdGhpcy51cmwgPSBTdHJpbmcoaW5wdXQpO1xuICAgIH1cblxuICAgIHRoaXMuY3JlZGVudGlhbHMgPSBvcHRpb25zLmNyZWRlbnRpYWxzIHx8IHRoaXMuY3JlZGVudGlhbHMgfHwgJ3NhbWUtb3JpZ2luJztcbiAgICBpZiAob3B0aW9ucy5oZWFkZXJzIHx8ICF0aGlzLmhlYWRlcnMpIHtcbiAgICAgIHRoaXMuaGVhZGVycyA9IG5ldyBIZWFkZXJzKG9wdGlvbnMuaGVhZGVycyk7XG4gICAgfVxuICAgIHRoaXMubWV0aG9kID0gbm9ybWFsaXplTWV0aG9kKG9wdGlvbnMubWV0aG9kIHx8IHRoaXMubWV0aG9kIHx8ICdHRVQnKTtcbiAgICB0aGlzLm1vZGUgPSBvcHRpb25zLm1vZGUgfHwgdGhpcy5tb2RlIHx8IG51bGw7XG4gICAgdGhpcy5zaWduYWwgPSBvcHRpb25zLnNpZ25hbCB8fCB0aGlzLnNpZ25hbDtcbiAgICB0aGlzLnJlZmVycmVyID0gbnVsbDtcblxuICAgIGlmICgodGhpcy5tZXRob2QgPT09ICdHRVQnIHx8IHRoaXMubWV0aG9kID09PSAnSEVBRCcpICYmIGJvZHkpIHtcbiAgICAgIHRocm93IG5ldyBUeXBlRXJyb3IoJ0JvZHkgbm90IGFsbG93ZWQgZm9yIEdFVCBvciBIRUFEIHJlcXVlc3RzJylcbiAgICB9XG4gICAgdGhpcy5faW5pdEJvZHkoYm9keSk7XG4gIH1cblxuICBSZXF1ZXN0LnByb3RvdHlwZS5jbG9uZSA9IGZ1bmN0aW9uKCkge1xuICAgIHJldHVybiBuZXcgUmVxdWVzdCh0aGlzLCB7Ym9keTogdGhpcy5fYm9keUluaXR9KVxuICB9O1xuXG4gIGZ1bmN0aW9uIGRlY29kZShib2R5KSB7XG4gICAgdmFyIGZvcm0gPSBuZXcgRm9ybURhdGEoKTtcbiAgICBib2R5XG4gICAgICAudHJpbSgpXG4gICAgICAuc3BsaXQoJyYnKVxuICAgICAgLmZvckVhY2goZnVuY3Rpb24oYnl0ZXMpIHtcbiAgICAgICAgaWYgKGJ5dGVzKSB7XG4gICAgICAgICAgdmFyIHNwbGl0ID0gYnl0ZXMuc3BsaXQoJz0nKTtcbiAgICAgICAgICB2YXIgbmFtZSA9IHNwbGl0LnNoaWZ0KCkucmVwbGFjZSgvXFwrL2csICcgJyk7XG4gICAgICAgICAgdmFyIHZhbHVlID0gc3BsaXQuam9pbignPScpLnJlcGxhY2UoL1xcKy9nLCAnICcpO1xuICAgICAgICAgIGZvcm0uYXBwZW5kKGRlY29kZVVSSUNvbXBvbmVudChuYW1lKSwgZGVjb2RlVVJJQ29tcG9uZW50KHZhbHVlKSk7XG4gICAgICAgIH1cbiAgICAgIH0pO1xuICAgIHJldHVybiBmb3JtXG4gIH1cblxuICBmdW5jdGlvbiBwYXJzZUhlYWRlcnMocmF3SGVhZGVycykge1xuICAgIHZhciBoZWFkZXJzID0gbmV3IEhlYWRlcnMoKTtcbiAgICAvLyBSZXBsYWNlIGluc3RhbmNlcyBvZiBcXHJcXG4gYW5kIFxcbiBmb2xsb3dlZCBieSBhdCBsZWFzdCBvbmUgc3BhY2Ugb3IgaG9yaXpvbnRhbCB0YWIgd2l0aCBhIHNwYWNlXG4gICAgLy8gaHR0cHM6Ly90b29scy5pZXRmLm9yZy9odG1sL3JmYzcyMzAjc2VjdGlvbi0zLjJcbiAgICB2YXIgcHJlUHJvY2Vzc2VkSGVhZGVycyA9IHJhd0hlYWRlcnMucmVwbGFjZSgvXFxyP1xcbltcXHQgXSsvZywgJyAnKTtcbiAgICBwcmVQcm9jZXNzZWRIZWFkZXJzLnNwbGl0KC9cXHI/XFxuLykuZm9yRWFjaChmdW5jdGlvbihsaW5lKSB7XG4gICAgICB2YXIgcGFydHMgPSBsaW5lLnNwbGl0KCc6Jyk7XG4gICAgICB2YXIga2V5ID0gcGFydHMuc2hpZnQoKS50cmltKCk7XG4gICAgICBpZiAoa2V5KSB7XG4gICAgICAgIHZhciB2YWx1ZSA9IHBhcnRzLmpvaW4oJzonKS50cmltKCk7XG4gICAgICAgIGhlYWRlcnMuYXBwZW5kKGtleSwgdmFsdWUpO1xuICAgICAgfVxuICAgIH0pO1xuICAgIHJldHVybiBoZWFkZXJzXG4gIH1cblxuICBCb2R5LmNhbGwoUmVxdWVzdC5wcm90b3R5cGUpO1xuXG4gIGZ1bmN0aW9uIFJlc3BvbnNlKGJvZHlJbml0LCBvcHRpb25zKSB7XG4gICAgaWYgKCFvcHRpb25zKSB7XG4gICAgICBvcHRpb25zID0ge307XG4gICAgfVxuXG4gICAgdGhpcy50eXBlID0gJ2RlZmF1bHQnO1xuICAgIHRoaXMuc3RhdHVzID0gb3B0aW9ucy5zdGF0dXMgPT09IHVuZGVmaW5lZCA/IDIwMCA6IG9wdGlvbnMuc3RhdHVzO1xuICAgIHRoaXMub2sgPSB0aGlzLnN0YXR1cyA+PSAyMDAgJiYgdGhpcy5zdGF0dXMgPCAzMDA7XG4gICAgdGhpcy5zdGF0dXNUZXh0ID0gJ3N0YXR1c1RleHQnIGluIG9wdGlvbnMgPyBvcHRpb25zLnN0YXR1c1RleHQgOiAnT0snO1xuICAgIHRoaXMuaGVhZGVycyA9IG5ldyBIZWFkZXJzKG9wdGlvbnMuaGVhZGVycyk7XG4gICAgdGhpcy51cmwgPSBvcHRpb25zLnVybCB8fCAnJztcbiAgICB0aGlzLl9pbml0Qm9keShib2R5SW5pdCk7XG4gIH1cblxuICBCb2R5LmNhbGwoUmVzcG9uc2UucHJvdG90eXBlKTtcblxuICBSZXNwb25zZS5wcm90b3R5cGUuY2xvbmUgPSBmdW5jdGlvbigpIHtcbiAgICByZXR1cm4gbmV3IFJlc3BvbnNlKHRoaXMuX2JvZHlJbml0LCB7XG4gICAgICBzdGF0dXM6IHRoaXMuc3RhdHVzLFxuICAgICAgc3RhdHVzVGV4dDogdGhpcy5zdGF0dXNUZXh0LFxuICAgICAgaGVhZGVyczogbmV3IEhlYWRlcnModGhpcy5oZWFkZXJzKSxcbiAgICAgIHVybDogdGhpcy51cmxcbiAgICB9KVxuICB9O1xuXG4gIFJlc3BvbnNlLmVycm9yID0gZnVuY3Rpb24oKSB7XG4gICAgdmFyIHJlc3BvbnNlID0gbmV3IFJlc3BvbnNlKG51bGwsIHtzdGF0dXM6IDAsIHN0YXR1c1RleHQ6ICcnfSk7XG4gICAgcmVzcG9uc2UudHlwZSA9ICdlcnJvcic7XG4gICAgcmV0dXJuIHJlc3BvbnNlXG4gIH07XG5cbiAgdmFyIHJlZGlyZWN0U3RhdHVzZXMgPSBbMzAxLCAzMDIsIDMwMywgMzA3LCAzMDhdO1xuXG4gIFJlc3BvbnNlLnJlZGlyZWN0ID0gZnVuY3Rpb24odXJsLCBzdGF0dXMpIHtcbiAgICBpZiAocmVkaXJlY3RTdGF0dXNlcy5pbmRleE9mKHN0YXR1cykgPT09IC0xKSB7XG4gICAgICB0aHJvdyBuZXcgUmFuZ2VFcnJvcignSW52YWxpZCBzdGF0dXMgY29kZScpXG4gICAgfVxuXG4gICAgcmV0dXJuIG5ldyBSZXNwb25zZShudWxsLCB7c3RhdHVzOiBzdGF0dXMsIGhlYWRlcnM6IHtsb2NhdGlvbjogdXJsfX0pXG4gIH07XG5cbiAgZXhwb3J0cy5ET01FeGNlcHRpb24gPSBzZWxmLkRPTUV4Y2VwdGlvbjtcbiAgdHJ5IHtcbiAgICBuZXcgZXhwb3J0cy5ET01FeGNlcHRpb24oKTtcbiAgfSBjYXRjaCAoZXJyKSB7XG4gICAgZXhwb3J0cy5ET01FeGNlcHRpb24gPSBmdW5jdGlvbihtZXNzYWdlLCBuYW1lKSB7XG4gICAgICB0aGlzLm1lc3NhZ2UgPSBtZXNzYWdlO1xuICAgICAgdGhpcy5uYW1lID0gbmFtZTtcbiAgICAgIHZhciBlcnJvciA9IEVycm9yKG1lc3NhZ2UpO1xuICAgICAgdGhpcy5zdGFjayA9IGVycm9yLnN0YWNrO1xuICAgIH07XG4gICAgZXhwb3J0cy5ET01FeGNlcHRpb24ucHJvdG90eXBlID0gT2JqZWN0LmNyZWF0ZShFcnJvci5wcm90b3R5cGUpO1xuICAgIGV4cG9ydHMuRE9NRXhjZXB0aW9uLnByb3RvdHlwZS5jb25zdHJ1Y3RvciA9IGV4cG9ydHMuRE9NRXhjZXB0aW9uO1xuICB9XG5cbiAgZnVuY3Rpb24gZmV0Y2goaW5wdXQsIGluaXQpIHtcbiAgICByZXR1cm4gbmV3IFByb21pc2UoZnVuY3Rpb24ocmVzb2x2ZSwgcmVqZWN0KSB7XG4gICAgICB2YXIgcmVxdWVzdCA9IG5ldyBSZXF1ZXN0KGlucHV0LCBpbml0KTtcblxuICAgICAgaWYgKHJlcXVlc3Quc2lnbmFsICYmIHJlcXVlc3Quc2lnbmFsLmFib3J0ZWQpIHtcbiAgICAgICAgcmV0dXJuIHJlamVjdChuZXcgZXhwb3J0cy5ET01FeGNlcHRpb24oJ0Fib3J0ZWQnLCAnQWJvcnRFcnJvcicpKVxuICAgICAgfVxuXG4gICAgICB2YXIgeGhyID0gbmV3IFhNTEh0dHBSZXF1ZXN0KCk7XG5cbiAgICAgIGZ1bmN0aW9uIGFib3J0WGhyKCkge1xuICAgICAgICB4aHIuYWJvcnQoKTtcbiAgICAgIH1cblxuICAgICAgeGhyLm9ubG9hZCA9IGZ1bmN0aW9uKCkge1xuICAgICAgICB2YXIgb3B0aW9ucyA9IHtcbiAgICAgICAgICBzdGF0dXM6IHhoci5zdGF0dXMsXG4gICAgICAgICAgc3RhdHVzVGV4dDogeGhyLnN0YXR1c1RleHQsXG4gICAgICAgICAgaGVhZGVyczogcGFyc2VIZWFkZXJzKHhoci5nZXRBbGxSZXNwb25zZUhlYWRlcnMoKSB8fCAnJylcbiAgICAgICAgfTtcbiAgICAgICAgb3B0aW9ucy51cmwgPSAncmVzcG9uc2VVUkwnIGluIHhociA/IHhoci5yZXNwb25zZVVSTCA6IG9wdGlvbnMuaGVhZGVycy5nZXQoJ1gtUmVxdWVzdC1VUkwnKTtcbiAgICAgICAgdmFyIGJvZHkgPSAncmVzcG9uc2UnIGluIHhociA/IHhoci5yZXNwb25zZSA6IHhoci5yZXNwb25zZVRleHQ7XG4gICAgICAgIHJlc29sdmUobmV3IFJlc3BvbnNlKGJvZHksIG9wdGlvbnMpKTtcbiAgICAgIH07XG5cbiAgICAgIHhoci5vbmVycm9yID0gZnVuY3Rpb24oKSB7XG4gICAgICAgIHJlamVjdChuZXcgVHlwZUVycm9yKCdOZXR3b3JrIHJlcXVlc3QgZmFpbGVkJykpO1xuICAgICAgfTtcblxuICAgICAgeGhyLm9udGltZW91dCA9IGZ1bmN0aW9uKCkge1xuICAgICAgICByZWplY3QobmV3IFR5cGVFcnJvcignTmV0d29yayByZXF1ZXN0IGZhaWxlZCcpKTtcbiAgICAgIH07XG5cbiAgICAgIHhoci5vbmFib3J0ID0gZnVuY3Rpb24oKSB7XG4gICAgICAgIHJlamVjdChuZXcgZXhwb3J0cy5ET01FeGNlcHRpb24oJ0Fib3J0ZWQnLCAnQWJvcnRFcnJvcicpKTtcbiAgICAgIH07XG5cbiAgICAgIHhoci5vcGVuKHJlcXVlc3QubWV0aG9kLCByZXF1ZXN0LnVybCwgdHJ1ZSk7XG5cbiAgICAgIGlmIChyZXF1ZXN0LmNyZWRlbnRpYWxzID09PSAnaW5jbHVkZScpIHtcbiAgICAgICAgeGhyLndpdGhDcmVkZW50aWFscyA9IHRydWU7XG4gICAgICB9IGVsc2UgaWYgKHJlcXVlc3QuY3JlZGVudGlhbHMgPT09ICdvbWl0Jykge1xuICAgICAgICB4aHIud2l0aENyZWRlbnRpYWxzID0gZmFsc2U7XG4gICAgICB9XG5cbiAgICAgIGlmICgncmVzcG9uc2VUeXBlJyBpbiB4aHIgJiYgc3VwcG9ydC5ibG9iKSB7XG4gICAgICAgIHhoci5yZXNwb25zZVR5cGUgPSAnYmxvYic7XG4gICAgICB9XG5cbiAgICAgIHJlcXVlc3QuaGVhZGVycy5mb3JFYWNoKGZ1bmN0aW9uKHZhbHVlLCBuYW1lKSB7XG4gICAgICAgIHhoci5zZXRSZXF1ZXN0SGVhZGVyKG5hbWUsIHZhbHVlKTtcbiAgICAgIH0pO1xuXG4gICAgICBpZiAocmVxdWVzdC5zaWduYWwpIHtcbiAgICAgICAgcmVxdWVzdC5zaWduYWwuYWRkRXZlbnRMaXN0ZW5lcignYWJvcnQnLCBhYm9ydFhocik7XG5cbiAgICAgICAgeGhyLm9ucmVhZHlzdGF0ZWNoYW5nZSA9IGZ1bmN0aW9uKCkge1xuICAgICAgICAgIC8vIERPTkUgKHN1Y2Nlc3Mgb3IgZmFpbHVyZSlcbiAgICAgICAgICBpZiAoeGhyLnJlYWR5U3RhdGUgPT09IDQpIHtcbiAgICAgICAgICAgIHJlcXVlc3Quc2lnbmFsLnJlbW92ZUV2ZW50TGlzdGVuZXIoJ2Fib3J0JywgYWJvcnRYaHIpO1xuICAgICAgICAgIH1cbiAgICAgICAgfTtcbiAgICAgIH1cblxuICAgICAgeGhyLnNlbmQodHlwZW9mIHJlcXVlc3QuX2JvZHlJbml0ID09PSAndW5kZWZpbmVkJyA/IG51bGwgOiByZXF1ZXN0Ll9ib2R5SW5pdCk7XG4gICAgfSlcbiAgfVxuXG4gIGZldGNoLnBvbHlmaWxsID0gdHJ1ZTtcblxuICBpZiAoIXNlbGYuZmV0Y2gpIHtcbiAgICBzZWxmLmZldGNoID0gZmV0Y2g7XG4gICAgc2VsZi5IZWFkZXJzID0gSGVhZGVycztcbiAgICBzZWxmLlJlcXVlc3QgPSBSZXF1ZXN0O1xuICAgIHNlbGYuUmVzcG9uc2UgPSBSZXNwb25zZTtcbiAgfVxuXG4gIGV4cG9ydHMuSGVhZGVycyA9IEhlYWRlcnM7XG4gIGV4cG9ydHMuUmVxdWVzdCA9IFJlcXVlc3Q7XG4gIGV4cG9ydHMuUmVzcG9uc2UgPSBSZXNwb25zZTtcbiAgZXhwb3J0cy5mZXRjaCA9IGZldGNoO1xuXG4gIE9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCAnX19lc01vZHVsZScsIHsgdmFsdWU6IHRydWUgfSk7XG5cbn0pKSk7XG4iLCIvKiBqc2hpbnQgbm9kZTogdHJ1ZSAqL1xuJ3VzZSBzdHJpY3QnO1xuXG4vKipcbiAgIyB3aWxkY2FyZFxuXG4gIFZlcnkgc2ltcGxlIHdpbGRjYXJkIG1hdGNoaW5nLCB3aGljaCBpcyBkZXNpZ25lZCB0byBwcm92aWRlIHRoZSBzYW1lXG4gIGZ1bmN0aW9uYWxpdHkgdGhhdCBpcyBmb3VuZCBpbiB0aGVcbiAgW2V2ZV0oaHR0cHM6Ly9naXRodWIuY29tL2Fkb2JlLXdlYnBsYXRmb3JtL2V2ZSkgZXZlbnRpbmcgbGlicmFyeS5cblxuICAjIyBVc2FnZVxuXG4gIEl0IHdvcmtzIHdpdGggc3RyaW5nczpcblxuICA8PDwgZXhhbXBsZXMvc3RyaW5ncy5qc1xuXG4gIEFycmF5czpcblxuICA8PDwgZXhhbXBsZXMvYXJyYXlzLmpzXG5cbiAgT2JqZWN0cyAobWF0Y2hpbmcgYWdhaW5zdCBrZXlzKTpcblxuICA8PDwgZXhhbXBsZXMvb2JqZWN0cy5qc1xuXG4gIFdoaWxlIHRoZSBsaWJyYXJ5IHdvcmtzIGluIE5vZGUsIGlmIHlvdSBhcmUgYXJlIGxvb2tpbmcgZm9yIGZpbGUtYmFzZWRcbiAgd2lsZGNhcmQgbWF0Y2hpbmcgdGhlbiB5b3Ugc2hvdWxkIGhhdmUgYSBsb29rIGF0OlxuXG4gIDxodHRwczovL2dpdGh1Yi5jb20vaXNhYWNzL25vZGUtZ2xvYj5cbioqL1xuXG5mdW5jdGlvbiBXaWxkY2FyZE1hdGNoZXIodGV4dCwgc2VwYXJhdG9yKSB7XG4gIHRoaXMudGV4dCA9IHRleHQgPSB0ZXh0IHx8ICcnO1xuICB0aGlzLmhhc1dpbGQgPSB+dGV4dC5pbmRleE9mKCcqJyk7XG4gIHRoaXMuc2VwYXJhdG9yID0gc2VwYXJhdG9yO1xuICB0aGlzLnBhcnRzID0gdGV4dC5zcGxpdChzZXBhcmF0b3IpO1xufVxuXG5XaWxkY2FyZE1hdGNoZXIucHJvdG90eXBlLm1hdGNoID0gZnVuY3Rpb24oaW5wdXQpIHtcbiAgdmFyIG1hdGNoZXMgPSB0cnVlO1xuICB2YXIgcGFydHMgPSB0aGlzLnBhcnRzO1xuICB2YXIgaWk7XG4gIHZhciBwYXJ0c0NvdW50ID0gcGFydHMubGVuZ3RoO1xuICB2YXIgdGVzdFBhcnRzO1xuXG4gIGlmICh0eXBlb2YgaW5wdXQgPT0gJ3N0cmluZycgfHwgaW5wdXQgaW5zdGFuY2VvZiBTdHJpbmcpIHtcbiAgICBpZiAoIXRoaXMuaGFzV2lsZCAmJiB0aGlzLnRleHQgIT0gaW5wdXQpIHtcbiAgICAgIG1hdGNoZXMgPSBmYWxzZTtcbiAgICB9IGVsc2Uge1xuICAgICAgdGVzdFBhcnRzID0gKGlucHV0IHx8ICcnKS5zcGxpdCh0aGlzLnNlcGFyYXRvcik7XG4gICAgICBmb3IgKGlpID0gMDsgbWF0Y2hlcyAmJiBpaSA8IHBhcnRzQ291bnQ7IGlpKyspIHtcbiAgICAgICAgaWYgKHBhcnRzW2lpXSA9PT0gJyonKSAge1xuICAgICAgICAgIGNvbnRpbnVlO1xuICAgICAgICB9IGVsc2UgaWYgKGlpIDwgdGVzdFBhcnRzLmxlbmd0aCkge1xuICAgICAgICAgIG1hdGNoZXMgPSBwYXJ0c1tpaV0gPT09IHRlc3RQYXJ0c1tpaV07XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgbWF0Y2hlcyA9IGZhbHNlO1xuICAgICAgICB9XG4gICAgICB9XG5cbiAgICAgIC8vIElmIG1hdGNoZXMsIHRoZW4gcmV0dXJuIHRoZSBjb21wb25lbnQgcGFydHNcbiAgICAgIG1hdGNoZXMgPSBtYXRjaGVzICYmIHRlc3RQYXJ0cztcbiAgICB9XG4gIH1cbiAgZWxzZSBpZiAodHlwZW9mIGlucHV0LnNwbGljZSA9PSAnZnVuY3Rpb24nKSB7XG4gICAgbWF0Y2hlcyA9IFtdO1xuXG4gICAgZm9yIChpaSA9IGlucHV0Lmxlbmd0aDsgaWktLTsgKSB7XG4gICAgICBpZiAodGhpcy5tYXRjaChpbnB1dFtpaV0pKSB7XG4gICAgICAgIG1hdGNoZXNbbWF0Y2hlcy5sZW5ndGhdID0gaW5wdXRbaWldO1xuICAgICAgfVxuICAgIH1cbiAgfVxuICBlbHNlIGlmICh0eXBlb2YgaW5wdXQgPT0gJ29iamVjdCcpIHtcbiAgICBtYXRjaGVzID0ge307XG5cbiAgICBmb3IgKHZhciBrZXkgaW4gaW5wdXQpIHtcbiAgICAgIGlmICh0aGlzLm1hdGNoKGtleSkpIHtcbiAgICAgICAgbWF0Y2hlc1trZXldID0gaW5wdXRba2V5XTtcbiAgICAgIH1cbiAgICB9XG4gIH1cblxuICByZXR1cm4gbWF0Y2hlcztcbn07XG5cbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24odGV4dCwgdGVzdCwgc2VwYXJhdG9yKSB7XG4gIHZhciBtYXRjaGVyID0gbmV3IFdpbGRjYXJkTWF0Y2hlcih0ZXh0LCBzZXBhcmF0b3IgfHwgL1tcXC9cXC5dLyk7XG4gIGlmICh0eXBlb2YgdGVzdCAhPSAndW5kZWZpbmVkJykge1xuICAgIHJldHVybiBtYXRjaGVyLm1hdGNoKHRlc3QpO1xuICB9XG5cbiAgcmV0dXJuIG1hdGNoZXI7XG59O1xuIiwibW9kdWxlLmV4cG9ydHM9e1xuICBcIm5hbWVcIjogXCJAdXBweS9jb21wYW5pb24tY2xpZW50XCIsXG4gIFwiZGVzY3JpcHRpb25cIjogXCJDbGllbnQgbGlicmFyeSBmb3IgY29tbXVuaWNhdGlvbiB3aXRoIENvbXBhbmlvbi4gSW50ZW5kZWQgZm9yIHVzZSBpbiBVcHB5IHBsdWdpbnMuXCIsXG4gIFwidmVyc2lvblwiOiBcIjEuNi4wXCIsXG4gIFwibGljZW5zZVwiOiBcIk1JVFwiLFxuICBcIm1haW5cIjogXCJsaWIvaW5kZXguanNcIixcbiAgXCJ0eXBlc1wiOiBcInR5cGVzL2luZGV4LmQudHNcIixcbiAgXCJrZXl3b3Jkc1wiOiBbXG4gICAgXCJmaWxlIHVwbG9hZGVyXCIsXG4gICAgXCJ1cHB5XCIsXG4gICAgXCJ1cHB5LXBsdWdpblwiLFxuICAgIFwiY29tcGFuaW9uXCIsXG4gICAgXCJwcm92aWRlclwiXG4gIF0sXG4gIFwiaG9tZXBhZ2VcIjogXCJodHRwczovL3VwcHkuaW9cIixcbiAgXCJidWdzXCI6IHtcbiAgICBcInVybFwiOiBcImh0dHBzOi8vZ2l0aHViLmNvbS90cmFuc2xvYWRpdC91cHB5L2lzc3Vlc1wiXG4gIH0sXG4gIFwicmVwb3NpdG9yeVwiOiB7XG4gICAgXCJ0eXBlXCI6IFwiZ2l0XCIsXG4gICAgXCJ1cmxcIjogXCJnaXQraHR0cHM6Ly9naXRodWIuY29tL3RyYW5zbG9hZGl0L3VwcHkuZ2l0XCJcbiAgfSxcbiAgXCJkZXBlbmRlbmNpZXNcIjoge1xuICAgIFwiQHVwcHkvdXRpbHNcIjogXCJmaWxlOi4uL3V0aWxzXCIsXG4gICAgXCJuYW1lc3BhY2UtZW1pdHRlclwiOiBcIl4yLjAuMVwiXG4gIH1cbn1cbiIsIid1c2Ugc3RyaWN0J1xuXG5jbGFzcyBBdXRoRXJyb3IgZXh0ZW5kcyBFcnJvciB7XG4gIGNvbnN0cnVjdG9yICgpIHtcbiAgICBzdXBlcignQXV0aG9yaXphdGlvbiByZXF1aXJlZCcpXG4gICAgdGhpcy5uYW1lID0gJ0F1dGhFcnJvcidcbiAgICB0aGlzLmlzQXV0aEVycm9yID0gdHJ1ZVxuICB9XG59XG5cbm1vZHVsZS5leHBvcnRzID0gQXV0aEVycm9yXG4iLCIndXNlIHN0cmljdCdcblxuY29uc3QgUmVxdWVzdENsaWVudCA9IHJlcXVpcmUoJy4vUmVxdWVzdENsaWVudCcpXG5jb25zdCB0b2tlblN0b3JhZ2UgPSByZXF1aXJlKCcuL3Rva2VuU3RvcmFnZScpXG5cbmNvbnN0IF9nZXROYW1lID0gKGlkKSA9PiB7XG4gIHJldHVybiBpZC5zcGxpdCgnLScpLm1hcCgocykgPT4gcy5jaGFyQXQoMCkudG9VcHBlckNhc2UoKSArIHMuc2xpY2UoMSkpLmpvaW4oJyAnKVxufVxuXG5tb2R1bGUuZXhwb3J0cyA9IGNsYXNzIFByb3ZpZGVyIGV4dGVuZHMgUmVxdWVzdENsaWVudCB7XG4gIGNvbnN0cnVjdG9yICh1cHB5LCBvcHRzKSB7XG4gICAgc3VwZXIodXBweSwgb3B0cylcbiAgICB0aGlzLnByb3ZpZGVyID0gb3B0cy5wcm92aWRlclxuICAgIHRoaXMuaWQgPSB0aGlzLnByb3ZpZGVyXG4gICAgdGhpcy5uYW1lID0gdGhpcy5vcHRzLm5hbWUgfHwgX2dldE5hbWUodGhpcy5pZClcbiAgICB0aGlzLnBsdWdpbklkID0gdGhpcy5vcHRzLnBsdWdpbklkXG4gICAgdGhpcy50b2tlbktleSA9IGBjb21wYW5pb24tJHt0aGlzLnBsdWdpbklkfS1hdXRoLXRva2VuYFxuICB9XG5cbiAgaGVhZGVycyAoKSB7XG4gICAgcmV0dXJuIFByb21pc2UuYWxsKFtzdXBlci5oZWFkZXJzKCksIHRoaXMuZ2V0QXV0aFRva2VuKCldKVxuICAgICAgLnRoZW4oKFtoZWFkZXJzLCB0b2tlbl0pID0+XG4gICAgICAgIE9iamVjdC5hc3NpZ24oe30sIGhlYWRlcnMsIHsgJ3VwcHktYXV0aC10b2tlbic6IHRva2VuIH0pXG4gICAgICApXG4gIH1cblxuICBvblJlY2VpdmVSZXNwb25zZSAocmVzcG9uc2UpIHtcbiAgICByZXNwb25zZSA9IHN1cGVyLm9uUmVjZWl2ZVJlc3BvbnNlKHJlc3BvbnNlKVxuICAgIGNvbnN0IHBsdWdpbiA9IHRoaXMudXBweS5nZXRQbHVnaW4odGhpcy5wbHVnaW5JZClcbiAgICBjb25zdCBvbGRBdXRoZW50aWNhdGVkID0gcGx1Z2luLmdldFBsdWdpblN0YXRlKCkuYXV0aGVudGljYXRlZFxuICAgIGNvbnN0IGF1dGhlbnRpY2F0ZWQgPSBvbGRBdXRoZW50aWNhdGVkID8gcmVzcG9uc2Uuc3RhdHVzICE9PSA0MDEgOiByZXNwb25zZS5zdGF0dXMgPCA0MDBcbiAgICBwbHVnaW4uc2V0UGx1Z2luU3RhdGUoeyBhdXRoZW50aWNhdGVkIH0pXG4gICAgcmV0dXJuIHJlc3BvbnNlXG4gIH1cblxuICAvLyBAdG9kbyhpLm9sYXJld2FqdSkgY29uc2lkZXIgd2hldGhlciBvciBub3QgdGhpcyBtZXRob2Qgc2hvdWxkIGJlIGV4cG9zZWRcbiAgc2V0QXV0aFRva2VuICh0b2tlbikge1xuICAgIHJldHVybiB0aGlzLnVwcHkuZ2V0UGx1Z2luKHRoaXMucGx1Z2luSWQpLnN0b3JhZ2Uuc2V0SXRlbSh0aGlzLnRva2VuS2V5LCB0b2tlbilcbiAgfVxuXG4gIGdldEF1dGhUb2tlbiAoKSB7XG4gICAgcmV0dXJuIHRoaXMudXBweS5nZXRQbHVnaW4odGhpcy5wbHVnaW5JZCkuc3RvcmFnZS5nZXRJdGVtKHRoaXMudG9rZW5LZXkpXG4gIH1cblxuICBhdXRoVXJsICgpIHtcbiAgICByZXR1cm4gYCR7dGhpcy5ob3N0bmFtZX0vJHt0aGlzLmlkfS9jb25uZWN0YFxuICB9XG5cbiAgZmlsZVVybCAoaWQpIHtcbiAgICByZXR1cm4gYCR7dGhpcy5ob3N0bmFtZX0vJHt0aGlzLmlkfS9nZXQvJHtpZH1gXG4gIH1cblxuICBsaXN0IChkaXJlY3RvcnkpIHtcbiAgICByZXR1cm4gdGhpcy5nZXQoYCR7dGhpcy5pZH0vbGlzdC8ke2RpcmVjdG9yeSB8fCAnJ31gKVxuICB9XG5cbiAgbG9nb3V0ICgpIHtcbiAgICByZXR1cm4gdGhpcy5nZXQoYCR7dGhpcy5pZH0vbG9nb3V0YClcbiAgICAgIC50aGVuKChyZXNwb25zZSkgPT4gUHJvbWlzZS5hbGwoW1xuICAgICAgICByZXNwb25zZSxcbiAgICAgICAgdGhpcy51cHB5LmdldFBsdWdpbih0aGlzLnBsdWdpbklkKS5zdG9yYWdlLnJlbW92ZUl0ZW0odGhpcy50b2tlbktleSlcbiAgICAgIF0pKS50aGVuKChbcmVzcG9uc2VdKSA9PiByZXNwb25zZSlcbiAgfVxuXG4gIHN0YXRpYyBpbml0UGx1Z2luIChwbHVnaW4sIG9wdHMsIGRlZmF1bHRPcHRzKSB7XG4gICAgcGx1Z2luLnR5cGUgPSAnYWNxdWlyZXInXG4gICAgcGx1Z2luLmZpbGVzID0gW11cbiAgICBpZiAoZGVmYXVsdE9wdHMpIHtcbiAgICAgIHBsdWdpbi5vcHRzID0gT2JqZWN0LmFzc2lnbih7fSwgZGVmYXVsdE9wdHMsIG9wdHMpXG4gICAgfVxuXG4gICAgaWYgKG9wdHMuc2VydmVyVXJsIHx8IG9wdHMuc2VydmVyUGF0dGVybikge1xuICAgICAgdGhyb3cgbmV3IEVycm9yKCdgc2VydmVyVXJsYCBhbmQgYHNlcnZlclBhdHRlcm5gIGhhdmUgYmVlbiByZW5hbWVkIHRvIGBjb21wYW5pb25VcmxgIGFuZCBgY29tcGFuaW9uQWxsb3dlZEhvc3RzYCByZXNwZWN0aXZlbHkgaW4gdGhlIDAuMzAuNSByZWxlYXNlLiBQbGVhc2UgY29uc3VsdCB0aGUgZG9jcyAoZm9yIGV4YW1wbGUsIGh0dHBzOi8vdXBweS5pby9kb2NzL2luc3RhZ3JhbS8gZm9yIHRoZSBJbnN0YWdyYW0gcGx1Z2luKSBhbmQgdXNlIHRoZSB1cGRhdGVkIG9wdGlvbnMuYCcpXG4gICAgfVxuXG4gICAgaWYgKG9wdHMuY29tcGFuaW9uQWxsb3dlZEhvc3RzKSB7XG4gICAgICBjb25zdCBwYXR0ZXJuID0gb3B0cy5jb21wYW5pb25BbGxvd2VkSG9zdHNcbiAgICAgIC8vIHZhbGlkYXRlIGNvbXBhbmlvbkFsbG93ZWRIb3N0cyBwYXJhbVxuICAgICAgaWYgKHR5cGVvZiBwYXR0ZXJuICE9PSAnc3RyaW5nJyAmJiAhQXJyYXkuaXNBcnJheShwYXR0ZXJuKSAmJiAhKHBhdHRlcm4gaW5zdGFuY2VvZiBSZWdFeHApKSB7XG4gICAgICAgIHRocm93IG5ldyBUeXBlRXJyb3IoYCR7cGx1Z2luLmlkfTogdGhlIG9wdGlvbiBcImNvbXBhbmlvbkFsbG93ZWRIb3N0c1wiIG11c3QgYmUgb25lIG9mIHN0cmluZywgQXJyYXksIFJlZ0V4cGApXG4gICAgICB9XG4gICAgICBwbHVnaW4ub3B0cy5jb21wYW5pb25BbGxvd2VkSG9zdHMgPSBwYXR0ZXJuXG4gICAgfSBlbHNlIHtcbiAgICAgIC8vIGRvZXMgbm90IHN0YXJ0IHdpdGggaHR0cHM6Ly9cbiAgICAgIGlmICgvXig/IWh0dHBzPzpcXC9cXC8pLiokL2kudGVzdChvcHRzLmNvbXBhbmlvblVybCkpIHtcbiAgICAgICAgcGx1Z2luLm9wdHMuY29tcGFuaW9uQWxsb3dlZEhvc3RzID0gYGh0dHBzOi8vJHtvcHRzLmNvbXBhbmlvblVybC5yZXBsYWNlKC9eXFwvXFwvLywgJycpfWBcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHBsdWdpbi5vcHRzLmNvbXBhbmlvbkFsbG93ZWRIb3N0cyA9IG9wdHMuY29tcGFuaW9uVXJsXG4gICAgICB9XG4gICAgfVxuXG4gICAgcGx1Z2luLnN0b3JhZ2UgPSBwbHVnaW4ub3B0cy5zdG9yYWdlIHx8IHRva2VuU3RvcmFnZVxuICB9XG59XG4iLCIndXNlIHN0cmljdCdcblxuY29uc3QgQXV0aEVycm9yID0gcmVxdWlyZSgnLi9BdXRoRXJyb3InKVxuY29uc3QgZmV0Y2hXaXRoTmV0d29ya0Vycm9yID0gcmVxdWlyZSgnQHVwcHkvdXRpbHMvbGliL2ZldGNoV2l0aE5ldHdvcmtFcnJvcicpXG5cbi8vIFJlbW92ZSB0aGUgdHJhaWxpbmcgc2xhc2ggc28gd2UgY2FuIGFsd2F5cyBzYWZlbHkgYXBwZW5kIC94eXouXG5mdW5jdGlvbiBzdHJpcFNsYXNoICh1cmwpIHtcbiAgcmV0dXJuIHVybC5yZXBsYWNlKC9cXC8kLywgJycpXG59XG5cbm1vZHVsZS5leHBvcnRzID0gY2xhc3MgUmVxdWVzdENsaWVudCB7XG4gIHN0YXRpYyBWRVJTSU9OID0gcmVxdWlyZSgnLi4vcGFja2FnZS5qc29uJykudmVyc2lvblxuXG4gIGNvbnN0cnVjdG9yICh1cHB5LCBvcHRzKSB7XG4gICAgdGhpcy51cHB5ID0gdXBweVxuICAgIHRoaXMub3B0cyA9IG9wdHNcbiAgICB0aGlzLm9uUmVjZWl2ZVJlc3BvbnNlID0gdGhpcy5vblJlY2VpdmVSZXNwb25zZS5iaW5kKHRoaXMpXG4gICAgdGhpcy5hbGxvd2VkSGVhZGVycyA9IFsnYWNjZXB0JywgJ2NvbnRlbnQtdHlwZScsICd1cHB5LWF1dGgtdG9rZW4nXVxuICAgIHRoaXMucHJlZmxpZ2h0RG9uZSA9IGZhbHNlXG4gIH1cblxuICBnZXQgaG9zdG5hbWUgKCkge1xuICAgIGNvbnN0IHsgY29tcGFuaW9uIH0gPSB0aGlzLnVwcHkuZ2V0U3RhdGUoKVxuICAgIGNvbnN0IGhvc3QgPSB0aGlzLm9wdHMuY29tcGFuaW9uVXJsXG4gICAgcmV0dXJuIHN0cmlwU2xhc2goY29tcGFuaW9uICYmIGNvbXBhbmlvbltob3N0XSA/IGNvbXBhbmlvbltob3N0XSA6IGhvc3QpXG4gIH1cblxuICBnZXQgZGVmYXVsdEhlYWRlcnMgKCkge1xuICAgIHJldHVybiB7XG4gICAgICBBY2NlcHQ6ICdhcHBsaWNhdGlvbi9qc29uJyxcbiAgICAgICdDb250ZW50LVR5cGUnOiAnYXBwbGljYXRpb24vanNvbicsXG4gICAgICAnVXBweS1WZXJzaW9ucyc6IGBAdXBweS9jb21wYW5pb24tY2xpZW50PSR7UmVxdWVzdENsaWVudC5WRVJTSU9OfWBcbiAgICB9XG4gIH1cblxuICBoZWFkZXJzICgpIHtcbiAgICBjb25zdCB1c2VySGVhZGVycyA9IHRoaXMub3B0cy5jb21wYW5pb25IZWFkZXJzIHx8IHRoaXMub3B0cy5zZXJ2ZXJIZWFkZXJzIHx8IHt9XG4gICAgcmV0dXJuIFByb21pc2UucmVzb2x2ZSh7XG4gICAgICAuLi50aGlzLmRlZmF1bHRIZWFkZXJzLFxuICAgICAgLi4udXNlckhlYWRlcnNcbiAgICB9KVxuICB9XG5cbiAgX2dldFBvc3RSZXNwb25zZUZ1bmMgKHNraXApIHtcbiAgICByZXR1cm4gKHJlc3BvbnNlKSA9PiB7XG4gICAgICBpZiAoIXNraXApIHtcbiAgICAgICAgcmV0dXJuIHRoaXMub25SZWNlaXZlUmVzcG9uc2UocmVzcG9uc2UpXG4gICAgICB9XG5cbiAgICAgIHJldHVybiByZXNwb25zZVxuICAgIH1cbiAgfVxuXG4gIG9uUmVjZWl2ZVJlc3BvbnNlIChyZXNwb25zZSkge1xuICAgIGNvbnN0IHN0YXRlID0gdGhpcy51cHB5LmdldFN0YXRlKClcbiAgICBjb25zdCBjb21wYW5pb24gPSBzdGF0ZS5jb21wYW5pb24gfHwge31cbiAgICBjb25zdCBob3N0ID0gdGhpcy5vcHRzLmNvbXBhbmlvblVybFxuICAgIGNvbnN0IGhlYWRlcnMgPSByZXNwb25zZS5oZWFkZXJzXG4gICAgLy8gU3RvcmUgdGhlIHNlbGYtaWRlbnRpZmllZCBkb21haW4gbmFtZSBmb3IgdGhlIENvbXBhbmlvbiBpbnN0YW5jZSB3ZSBqdXN0IGhpdC5cbiAgICBpZiAoaGVhZGVycy5oYXMoJ2ktYW0nKSAmJiBoZWFkZXJzLmdldCgnaS1hbScpICE9PSBjb21wYW5pb25baG9zdF0pIHtcbiAgICAgIHRoaXMudXBweS5zZXRTdGF0ZSh7XG4gICAgICAgIGNvbXBhbmlvbjogT2JqZWN0LmFzc2lnbih7fSwgY29tcGFuaW9uLCB7XG4gICAgICAgICAgW2hvc3RdOiBoZWFkZXJzLmdldCgnaS1hbScpXG4gICAgICAgIH0pXG4gICAgICB9KVxuICAgIH1cbiAgICByZXR1cm4gcmVzcG9uc2VcbiAgfVxuXG4gIF9nZXRVcmwgKHVybCkge1xuICAgIGlmICgvXihodHRwcz86fClcXC9cXC8vLnRlc3QodXJsKSkge1xuICAgICAgcmV0dXJuIHVybFxuICAgIH1cbiAgICByZXR1cm4gYCR7dGhpcy5ob3N0bmFtZX0vJHt1cmx9YFxuICB9XG5cbiAgX2pzb24gKHJlcykge1xuICAgIGlmIChyZXMuc3RhdHVzID09PSA0MDEpIHtcbiAgICAgIHRocm93IG5ldyBBdXRoRXJyb3IoKVxuICAgIH1cblxuICAgIGlmIChyZXMuc3RhdHVzIDwgMjAwIHx8IHJlcy5zdGF0dXMgPiAzMDApIHtcbiAgICAgIGxldCBlcnJNc2cgPSBgRmFpbGVkIHJlcXVlc3Qgd2l0aCBzdGF0dXM6ICR7cmVzLnN0YXR1c30uICR7cmVzLnN0YXR1c1RleHR9YFxuICAgICAgcmV0dXJuIHJlcy5qc29uKClcbiAgICAgICAgLnRoZW4oKGVyckRhdGEpID0+IHtcbiAgICAgICAgICBlcnJNc2cgPSBlcnJEYXRhLm1lc3NhZ2UgPyBgJHtlcnJNc2d9IG1lc3NhZ2U6ICR7ZXJyRGF0YS5tZXNzYWdlfWAgOiBlcnJNc2dcbiAgICAgICAgICBlcnJNc2cgPSBlcnJEYXRhLnJlcXVlc3RJZCA/IGAke2Vyck1zZ30gcmVxdWVzdC1JZDogJHtlcnJEYXRhLnJlcXVlc3RJZH1gIDogZXJyTXNnXG4gICAgICAgICAgdGhyb3cgbmV3IEVycm9yKGVyck1zZylcbiAgICAgICAgfSkuY2F0Y2goKCkgPT4geyB0aHJvdyBuZXcgRXJyb3IoZXJyTXNnKSB9KVxuICAgIH1cbiAgICByZXR1cm4gcmVzLmpzb24oKVxuICB9XG5cbiAgcHJlZmxpZ2h0IChwYXRoKSB7XG4gICAgaWYgKHRoaXMucHJlZmxpZ2h0RG9uZSkge1xuICAgICAgcmV0dXJuIFByb21pc2UucmVzb2x2ZSh0aGlzLmFsbG93ZWRIZWFkZXJzLnNsaWNlKCkpXG4gICAgfVxuXG4gICAgcmV0dXJuIGZldGNoKHRoaXMuX2dldFVybChwYXRoKSwge1xuICAgICAgbWV0aG9kOiAnT1BUSU9OUydcbiAgICB9KVxuICAgICAgLnRoZW4oKHJlc3BvbnNlKSA9PiB7XG4gICAgICAgIGlmIChyZXNwb25zZS5oZWFkZXJzLmhhcygnYWNjZXNzLWNvbnRyb2wtYWxsb3ctaGVhZGVycycpKSB7XG4gICAgICAgICAgdGhpcy5hbGxvd2VkSGVhZGVycyA9IHJlc3BvbnNlLmhlYWRlcnMuZ2V0KCdhY2Nlc3MtY29udHJvbC1hbGxvdy1oZWFkZXJzJylcbiAgICAgICAgICAgIC5zcGxpdCgnLCcpLm1hcCgoaGVhZGVyTmFtZSkgPT4gaGVhZGVyTmFtZS50cmltKCkudG9Mb3dlckNhc2UoKSlcbiAgICAgICAgfVxuICAgICAgICB0aGlzLnByZWZsaWdodERvbmUgPSB0cnVlXG4gICAgICAgIHJldHVybiB0aGlzLmFsbG93ZWRIZWFkZXJzLnNsaWNlKClcbiAgICAgIH0pXG4gICAgICAuY2F0Y2goKGVycikgPT4ge1xuICAgICAgICB0aGlzLnVwcHkubG9nKGBbQ29tcGFuaW9uQ2xpZW50XSB1bmFibGUgdG8gbWFrZSBwcmVmbGlnaHQgcmVxdWVzdCAke2Vycn1gLCAnd2FybmluZycpXG4gICAgICAgIHRoaXMucHJlZmxpZ2h0RG9uZSA9IHRydWVcbiAgICAgICAgcmV0dXJuIHRoaXMuYWxsb3dlZEhlYWRlcnMuc2xpY2UoKVxuICAgICAgfSlcbiAgfVxuXG4gIHByZWZsaWdodEFuZEhlYWRlcnMgKHBhdGgpIHtcbiAgICByZXR1cm4gUHJvbWlzZS5hbGwoW3RoaXMucHJlZmxpZ2h0KHBhdGgpLCB0aGlzLmhlYWRlcnMoKV0pXG4gICAgICAudGhlbigoW2FsbG93ZWRIZWFkZXJzLCBoZWFkZXJzXSkgPT4ge1xuICAgICAgICAvLyBmaWx0ZXIgdG8ga2VlcCBvbmx5IGFsbG93ZWQgSGVhZGVyc1xuICAgICAgICBPYmplY3Qua2V5cyhoZWFkZXJzKS5mb3JFYWNoKChoZWFkZXIpID0+IHtcbiAgICAgICAgICBpZiAoYWxsb3dlZEhlYWRlcnMuaW5kZXhPZihoZWFkZXIudG9Mb3dlckNhc2UoKSkgPT09IC0xKSB7XG4gICAgICAgICAgICB0aGlzLnVwcHkubG9nKGBbQ29tcGFuaW9uQ2xpZW50XSBleGNsdWRpbmcgdW5hbGxvd2VkIGhlYWRlciAke2hlYWRlcn1gKVxuICAgICAgICAgICAgZGVsZXRlIGhlYWRlcnNbaGVhZGVyXVxuICAgICAgICAgIH1cbiAgICAgICAgfSlcblxuICAgICAgICByZXR1cm4gaGVhZGVyc1xuICAgICAgfSlcbiAgfVxuXG4gIGdldCAocGF0aCwgc2tpcFBvc3RSZXNwb25zZSkge1xuICAgIHJldHVybiB0aGlzLnByZWZsaWdodEFuZEhlYWRlcnMocGF0aClcbiAgICAgIC50aGVuKChoZWFkZXJzKSA9PlxuICAgICAgICBmZXRjaFdpdGhOZXR3b3JrRXJyb3IodGhpcy5fZ2V0VXJsKHBhdGgpLCB7XG4gICAgICAgICAgbWV0aG9kOiAnZ2V0JyxcbiAgICAgICAgICBoZWFkZXJzOiBoZWFkZXJzLFxuICAgICAgICAgIGNyZWRlbnRpYWxzOiAnc2FtZS1vcmlnaW4nXG4gICAgICAgIH0pKVxuICAgICAgLnRoZW4odGhpcy5fZ2V0UG9zdFJlc3BvbnNlRnVuYyhza2lwUG9zdFJlc3BvbnNlKSlcbiAgICAgIC50aGVuKChyZXMpID0+IHRoaXMuX2pzb24ocmVzKSlcbiAgICAgIC5jYXRjaCgoZXJyKSA9PiB7XG4gICAgICAgIGVyciA9IGVyci5pc0F1dGhFcnJvciA/IGVyciA6IG5ldyBFcnJvcihgQ291bGQgbm90IGdldCAke3RoaXMuX2dldFVybChwYXRoKX0uICR7ZXJyfWApXG4gICAgICAgIHJldHVybiBQcm9taXNlLnJlamVjdChlcnIpXG4gICAgICB9KVxuICB9XG5cbiAgcG9zdCAocGF0aCwgZGF0YSwgc2tpcFBvc3RSZXNwb25zZSkge1xuICAgIHJldHVybiB0aGlzLnByZWZsaWdodEFuZEhlYWRlcnMocGF0aClcbiAgICAgIC50aGVuKChoZWFkZXJzKSA9PlxuICAgICAgICBmZXRjaFdpdGhOZXR3b3JrRXJyb3IodGhpcy5fZ2V0VXJsKHBhdGgpLCB7XG4gICAgICAgICAgbWV0aG9kOiAncG9zdCcsXG4gICAgICAgICAgaGVhZGVyczogaGVhZGVycyxcbiAgICAgICAgICBjcmVkZW50aWFsczogJ3NhbWUtb3JpZ2luJyxcbiAgICAgICAgICBib2R5OiBKU09OLnN0cmluZ2lmeShkYXRhKVxuICAgICAgICB9KSlcbiAgICAgIC50aGVuKHRoaXMuX2dldFBvc3RSZXNwb25zZUZ1bmMoc2tpcFBvc3RSZXNwb25zZSkpXG4gICAgICAudGhlbigocmVzKSA9PiB0aGlzLl9qc29uKHJlcykpXG4gICAgICAuY2F0Y2goKGVycikgPT4ge1xuICAgICAgICBlcnIgPSBlcnIuaXNBdXRoRXJyb3IgPyBlcnIgOiBuZXcgRXJyb3IoYENvdWxkIG5vdCBwb3N0ICR7dGhpcy5fZ2V0VXJsKHBhdGgpfS4gJHtlcnJ9YClcbiAgICAgICAgcmV0dXJuIFByb21pc2UucmVqZWN0KGVycilcbiAgICAgIH0pXG4gIH1cblxuICBkZWxldGUgKHBhdGgsIGRhdGEsIHNraXBQb3N0UmVzcG9uc2UpIHtcbiAgICByZXR1cm4gdGhpcy5wcmVmbGlnaHRBbmRIZWFkZXJzKHBhdGgpXG4gICAgICAudGhlbigoaGVhZGVycykgPT5cbiAgICAgICAgZmV0Y2hXaXRoTmV0d29ya0Vycm9yKGAke3RoaXMuaG9zdG5hbWV9LyR7cGF0aH1gLCB7XG4gICAgICAgICAgbWV0aG9kOiAnZGVsZXRlJyxcbiAgICAgICAgICBoZWFkZXJzOiBoZWFkZXJzLFxuICAgICAgICAgIGNyZWRlbnRpYWxzOiAnc2FtZS1vcmlnaW4nLFxuICAgICAgICAgIGJvZHk6IGRhdGEgPyBKU09OLnN0cmluZ2lmeShkYXRhKSA6IG51bGxcbiAgICAgICAgfSkpXG4gICAgICAudGhlbih0aGlzLl9nZXRQb3N0UmVzcG9uc2VGdW5jKHNraXBQb3N0UmVzcG9uc2UpKVxuICAgICAgLnRoZW4oKHJlcykgPT4gdGhpcy5fanNvbihyZXMpKVxuICAgICAgLmNhdGNoKChlcnIpID0+IHtcbiAgICAgICAgZXJyID0gZXJyLmlzQXV0aEVycm9yID8gZXJyIDogbmV3IEVycm9yKGBDb3VsZCBub3QgZGVsZXRlICR7dGhpcy5fZ2V0VXJsKHBhdGgpfS4gJHtlcnJ9YClcbiAgICAgICAgcmV0dXJuIFByb21pc2UucmVqZWN0KGVycilcbiAgICAgIH0pXG4gIH1cbn1cbiIsIid1c2Ugc3RyaWN0J1xuXG5jb25zdCBSZXF1ZXN0Q2xpZW50ID0gcmVxdWlyZSgnLi9SZXF1ZXN0Q2xpZW50JylcblxuY29uc3QgX2dldE5hbWUgPSAoaWQpID0+IHtcbiAgcmV0dXJuIGlkLnNwbGl0KCctJykubWFwKChzKSA9PiBzLmNoYXJBdCgwKS50b1VwcGVyQ2FzZSgpICsgcy5zbGljZSgxKSkuam9pbignICcpXG59XG5cbm1vZHVsZS5leHBvcnRzID0gY2xhc3MgU2VhcmNoUHJvdmlkZXIgZXh0ZW5kcyBSZXF1ZXN0Q2xpZW50IHtcbiAgY29uc3RydWN0b3IgKHVwcHksIG9wdHMpIHtcbiAgICBzdXBlcih1cHB5LCBvcHRzKVxuICAgIHRoaXMucHJvdmlkZXIgPSBvcHRzLnByb3ZpZGVyXG4gICAgdGhpcy5pZCA9IHRoaXMucHJvdmlkZXJcbiAgICB0aGlzLm5hbWUgPSB0aGlzLm9wdHMubmFtZSB8fCBfZ2V0TmFtZSh0aGlzLmlkKVxuICAgIHRoaXMucGx1Z2luSWQgPSB0aGlzLm9wdHMucGx1Z2luSWRcbiAgfVxuXG4gIGZpbGVVcmwgKGlkKSB7XG4gICAgcmV0dXJuIGAke3RoaXMuaG9zdG5hbWV9L3NlYXJjaC8ke3RoaXMuaWR9L2dldC8ke2lkfWBcbiAgfVxuXG4gIHNlYXJjaCAodGV4dCwgcXVlcmllcykge1xuICAgIHF1ZXJpZXMgPSBxdWVyaWVzID8gYCYke3F1ZXJpZXN9YCA6ICcnXG4gICAgcmV0dXJuIHRoaXMuZ2V0KGBzZWFyY2gvJHt0aGlzLmlkfS9saXN0P3E9JHtlbmNvZGVVUklDb21wb25lbnQodGV4dCl9JHtxdWVyaWVzfWApXG4gIH1cbn1cbiIsImNvbnN0IGVlID0gcmVxdWlyZSgnbmFtZXNwYWNlLWVtaXR0ZXInKVxuXG5tb2R1bGUuZXhwb3J0cyA9IGNsYXNzIFVwcHlTb2NrZXQge1xuICBjb25zdHJ1Y3RvciAob3B0cykge1xuICAgIHRoaXMub3B0cyA9IG9wdHNcbiAgICB0aGlzLl9xdWV1ZWQgPSBbXVxuICAgIHRoaXMuaXNPcGVuID0gZmFsc2VcbiAgICB0aGlzLmVtaXR0ZXIgPSBlZSgpXG5cbiAgICB0aGlzLl9oYW5kbGVNZXNzYWdlID0gdGhpcy5faGFuZGxlTWVzc2FnZS5iaW5kKHRoaXMpXG5cbiAgICB0aGlzLmNsb3NlID0gdGhpcy5jbG9zZS5iaW5kKHRoaXMpXG4gICAgdGhpcy5lbWl0ID0gdGhpcy5lbWl0LmJpbmQodGhpcylcbiAgICB0aGlzLm9uID0gdGhpcy5vbi5iaW5kKHRoaXMpXG4gICAgdGhpcy5vbmNlID0gdGhpcy5vbmNlLmJpbmQodGhpcylcbiAgICB0aGlzLnNlbmQgPSB0aGlzLnNlbmQuYmluZCh0aGlzKVxuXG4gICAgaWYgKCFvcHRzIHx8IG9wdHMuYXV0b09wZW4gIT09IGZhbHNlKSB7XG4gICAgICB0aGlzLm9wZW4oKVxuICAgIH1cbiAgfVxuXG4gIG9wZW4gKCkge1xuICAgIHRoaXMuc29ja2V0ID0gbmV3IFdlYlNvY2tldCh0aGlzLm9wdHMudGFyZ2V0KVxuXG4gICAgdGhpcy5zb2NrZXQub25vcGVuID0gKGUpID0+IHtcbiAgICAgIHRoaXMuaXNPcGVuID0gdHJ1ZVxuXG4gICAgICB3aGlsZSAodGhpcy5fcXVldWVkLmxlbmd0aCA+IDAgJiYgdGhpcy5pc09wZW4pIHtcbiAgICAgICAgY29uc3QgZmlyc3QgPSB0aGlzLl9xdWV1ZWRbMF1cbiAgICAgICAgdGhpcy5zZW5kKGZpcnN0LmFjdGlvbiwgZmlyc3QucGF5bG9hZClcbiAgICAgICAgdGhpcy5fcXVldWVkID0gdGhpcy5fcXVldWVkLnNsaWNlKDEpXG4gICAgICB9XG4gICAgfVxuXG4gICAgdGhpcy5zb2NrZXQub25jbG9zZSA9IChlKSA9PiB7XG4gICAgICB0aGlzLmlzT3BlbiA9IGZhbHNlXG4gICAgfVxuXG4gICAgdGhpcy5zb2NrZXQub25tZXNzYWdlID0gdGhpcy5faGFuZGxlTWVzc2FnZVxuICB9XG5cbiAgY2xvc2UgKCkge1xuICAgIGlmICh0aGlzLnNvY2tldCkge1xuICAgICAgdGhpcy5zb2NrZXQuY2xvc2UoKVxuICAgIH1cbiAgfVxuXG4gIHNlbmQgKGFjdGlvbiwgcGF5bG9hZCkge1xuICAgIC8vIGF0dGFjaCB1dWlkXG5cbiAgICBpZiAoIXRoaXMuaXNPcGVuKSB7XG4gICAgICB0aGlzLl9xdWV1ZWQucHVzaCh7IGFjdGlvbiwgcGF5bG9hZCB9KVxuICAgICAgcmV0dXJuXG4gICAgfVxuXG4gICAgdGhpcy5zb2NrZXQuc2VuZChKU09OLnN0cmluZ2lmeSh7XG4gICAgICBhY3Rpb24sXG4gICAgICBwYXlsb2FkXG4gICAgfSkpXG4gIH1cblxuICBvbiAoYWN0aW9uLCBoYW5kbGVyKSB7XG4gICAgdGhpcy5lbWl0dGVyLm9uKGFjdGlvbiwgaGFuZGxlcilcbiAgfVxuXG4gIGVtaXQgKGFjdGlvbiwgcGF5bG9hZCkge1xuICAgIHRoaXMuZW1pdHRlci5lbWl0KGFjdGlvbiwgcGF5bG9hZClcbiAgfVxuXG4gIG9uY2UgKGFjdGlvbiwgaGFuZGxlcikge1xuICAgIHRoaXMuZW1pdHRlci5vbmNlKGFjdGlvbiwgaGFuZGxlcilcbiAgfVxuXG4gIF9oYW5kbGVNZXNzYWdlIChlKSB7XG4gICAgdHJ5IHtcbiAgICAgIGNvbnN0IG1lc3NhZ2UgPSBKU09OLnBhcnNlKGUuZGF0YSlcbiAgICAgIHRoaXMuZW1pdChtZXNzYWdlLmFjdGlvbiwgbWVzc2FnZS5wYXlsb2FkKVxuICAgIH0gY2F0Y2ggKGVycikge1xuICAgICAgY29uc29sZS5sb2coZXJyKVxuICAgIH1cbiAgfVxufVxuIiwiJ3VzZSBzdHJpY3QnXG5cbi8qKlxuICogTWFuYWdlcyBjb21tdW5pY2F0aW9ucyB3aXRoIENvbXBhbmlvblxuICovXG5cbmNvbnN0IFJlcXVlc3RDbGllbnQgPSByZXF1aXJlKCcuL1JlcXVlc3RDbGllbnQnKVxuY29uc3QgUHJvdmlkZXIgPSByZXF1aXJlKCcuL1Byb3ZpZGVyJylcbmNvbnN0IFNlYXJjaFByb3ZpZGVyID0gcmVxdWlyZSgnLi9TZWFyY2hQcm92aWRlcicpXG5jb25zdCBTb2NrZXQgPSByZXF1aXJlKCcuL1NvY2tldCcpXG5cbm1vZHVsZS5leHBvcnRzID0ge1xuICBSZXF1ZXN0Q2xpZW50LFxuICBQcm92aWRlcixcbiAgU2VhcmNoUHJvdmlkZXIsXG4gIFNvY2tldFxufVxuIiwiJ3VzZSBzdHJpY3QnXG5cbi8qKlxuICogVGhpcyBtb2R1bGUgc2VydmVzIGFzIGFuIEFzeW5jIHdyYXBwZXIgZm9yIExvY2FsU3RvcmFnZVxuICovXG5tb2R1bGUuZXhwb3J0cy5zZXRJdGVtID0gKGtleSwgdmFsdWUpID0+IHtcbiAgcmV0dXJuIG5ldyBQcm9taXNlKChyZXNvbHZlKSA9PiB7XG4gICAgbG9jYWxTdG9yYWdlLnNldEl0ZW0oa2V5LCB2YWx1ZSlcbiAgICByZXNvbHZlKClcbiAgfSlcbn1cblxubW9kdWxlLmV4cG9ydHMuZ2V0SXRlbSA9IChrZXkpID0+IHtcbiAgcmV0dXJuIFByb21pc2UucmVzb2x2ZShsb2NhbFN0b3JhZ2UuZ2V0SXRlbShrZXkpKVxufVxuXG5tb2R1bGUuZXhwb3J0cy5yZW1vdmVJdGVtID0gKGtleSkgPT4ge1xuICByZXR1cm4gbmV3IFByb21pc2UoKHJlc29sdmUpID0+IHtcbiAgICBsb2NhbFN0b3JhZ2UucmVtb3ZlSXRlbShrZXkpXG4gICAgcmVzb2x2ZSgpXG4gIH0pXG59XG4iLCJtb2R1bGUuZXhwb3J0cz17XG4gIFwibmFtZVwiOiBcIkB1cHB5L2NvcmVcIixcbiAgXCJkZXNjcmlwdGlvblwiOiBcIkNvcmUgbW9kdWxlIGZvciB0aGUgZXh0ZW5zaWJsZSBKYXZhU2NyaXB0IGZpbGUgdXBsb2FkIHdpZGdldCB3aXRoIHN1cHBvcnQgZm9yIGRyYWcmZHJvcCwgcmVzdW1hYmxlIHVwbG9hZHMsIHByZXZpZXdzLCByZXN0cmljdGlvbnMsIGZpbGUgcHJvY2Vzc2luZy9lbmNvZGluZywgcmVtb3RlIHByb3ZpZGVycyBsaWtlIEluc3RhZ3JhbSwgRHJvcGJveCwgR29vZ2xlIERyaXZlLCBTMyBhbmQgbW9yZSA6ZG9nOlwiLFxuICBcInZlcnNpb25cIjogXCIxLjEzLjNcIixcbiAgXCJsaWNlbnNlXCI6IFwiTUlUXCIsXG4gIFwibWFpblwiOiBcImxpYi9pbmRleC5qc1wiLFxuICBcInN0eWxlXCI6IFwiZGlzdC9zdHlsZS5taW4uY3NzXCIsXG4gIFwidHlwZXNcIjogXCJ0eXBlcy9pbmRleC5kLnRzXCIsXG4gIFwia2V5d29yZHNcIjogW1xuICAgIFwiZmlsZSB1cGxvYWRlclwiLFxuICAgIFwidXBweVwiLFxuICAgIFwidXBweS1wbHVnaW5cIlxuICBdLFxuICBcImhvbWVwYWdlXCI6IFwiaHR0cHM6Ly91cHB5LmlvXCIsXG4gIFwiYnVnc1wiOiB7XG4gICAgXCJ1cmxcIjogXCJodHRwczovL2dpdGh1Yi5jb20vdHJhbnNsb2FkaXQvdXBweS9pc3N1ZXNcIlxuICB9LFxuICBcInJlcG9zaXRvcnlcIjoge1xuICAgIFwidHlwZVwiOiBcImdpdFwiLFxuICAgIFwidXJsXCI6IFwiZ2l0K2h0dHBzOi8vZ2l0aHViLmNvbS90cmFuc2xvYWRpdC91cHB5LmdpdFwiXG4gIH0sXG4gIFwiZGVwZW5kZW5jaWVzXCI6IHtcbiAgICBcIkB0cmFuc2xvYWRpdC9wcmV0dGllci1ieXRlc1wiOiBcIjAuMC43XCIsXG4gICAgXCJAdXBweS9zdG9yZS1kZWZhdWx0XCI6IFwiZmlsZTouLi9zdG9yZS1kZWZhdWx0XCIsXG4gICAgXCJAdXBweS91dGlsc1wiOiBcImZpbGU6Li4vdXRpbHNcIixcbiAgICBcImN1aWRcIjogXCJeMi4xLjFcIixcbiAgICBcImxvZGFzaC50aHJvdHRsZVwiOiBcIl40LjEuMVwiLFxuICAgIFwibWltZS1tYXRjaFwiOiBcIl4xLjAuMlwiLFxuICAgIFwibmFtZXNwYWNlLWVtaXR0ZXJcIjogXCJeMi4wLjFcIixcbiAgICBcInByZWFjdFwiOiBcIjguMi45XCJcbiAgfVxufVxuIiwiY29uc3QgcHJlYWN0ID0gcmVxdWlyZSgncHJlYWN0JylcbmNvbnN0IGZpbmRET01FbGVtZW50ID0gcmVxdWlyZSgnQHVwcHkvdXRpbHMvbGliL2ZpbmRET01FbGVtZW50JylcblxuLyoqXG4gKiBEZWZlciBhIGZyZXF1ZW50IGNhbGwgdG8gdGhlIG1pY3JvdGFzayBxdWV1ZS5cbiAqL1xuZnVuY3Rpb24gZGVib3VuY2UgKGZuKSB7XG4gIGxldCBjYWxsaW5nID0gbnVsbFxuICBsZXQgbGF0ZXN0QXJncyA9IG51bGxcbiAgcmV0dXJuICguLi5hcmdzKSA9PiB7XG4gICAgbGF0ZXN0QXJncyA9IGFyZ3NcbiAgICBpZiAoIWNhbGxpbmcpIHtcbiAgICAgIGNhbGxpbmcgPSBQcm9taXNlLnJlc29sdmUoKS50aGVuKCgpID0+IHtcbiAgICAgICAgY2FsbGluZyA9IG51bGxcbiAgICAgICAgLy8gQXQgdGhpcyBwb2ludCBgYXJnc2AgbWF5IGJlIGRpZmZlcmVudCBmcm9tIHRoZSBtb3N0XG4gICAgICAgIC8vIHJlY2VudCBzdGF0ZSwgaWYgbXVsdGlwbGUgY2FsbHMgaGFwcGVuZWQgc2luY2UgdGhpcyB0YXNrXG4gICAgICAgIC8vIHdhcyBxdWV1ZWQuIFNvIHdlIHVzZSB0aGUgYGxhdGVzdEFyZ3NgLCB3aGljaCBkZWZpbml0ZWx5XG4gICAgICAgIC8vIGlzIHRoZSBtb3N0IHJlY2VudCBjYWxsLlxuICAgICAgICByZXR1cm4gZm4oLi4ubGF0ZXN0QXJncylcbiAgICAgIH0pXG4gICAgfVxuICAgIHJldHVybiBjYWxsaW5nXG4gIH1cbn1cblxuLyoqXG4gKiBCb2lsZXJwbGF0ZSB0aGF0IGFsbCBQbHVnaW5zIHNoYXJlIC0gYW5kIHNob3VsZCBub3QgYmUgdXNlZFxuICogZGlyZWN0bHkuIEl0IGFsc28gc2hvd3Mgd2hpY2ggbWV0aG9kcyBmaW5hbCBwbHVnaW5zIHNob3VsZCBpbXBsZW1lbnQvb3ZlcnJpZGUsXG4gKiB0aGlzIGRlY2lkaW5nIG9uIHN0cnVjdHVyZS5cbiAqXG4gKiBAcGFyYW0ge29iamVjdH0gbWFpbiBVcHB5IGNvcmUgb2JqZWN0XG4gKiBAcGFyYW0ge29iamVjdH0gb2JqZWN0IHdpdGggcGx1Z2luIG9wdGlvbnNcbiAqIEByZXR1cm5zIHtBcnJheXxzdHJpbmd9IGZpbGVzIG9yIHN1Y2Nlc3MvZmFpbCBtZXNzYWdlXG4gKi9cbm1vZHVsZS5leHBvcnRzID0gY2xhc3MgUGx1Z2luIHtcbiAgY29uc3RydWN0b3IgKHVwcHksIG9wdHMpIHtcbiAgICB0aGlzLnVwcHkgPSB1cHB5XG4gICAgdGhpcy5vcHRzID0gb3B0cyB8fCB7fVxuXG4gICAgdGhpcy51cGRhdGUgPSB0aGlzLnVwZGF0ZS5iaW5kKHRoaXMpXG4gICAgdGhpcy5tb3VudCA9IHRoaXMubW91bnQuYmluZCh0aGlzKVxuICAgIHRoaXMuaW5zdGFsbCA9IHRoaXMuaW5zdGFsbC5iaW5kKHRoaXMpXG4gICAgdGhpcy51bmluc3RhbGwgPSB0aGlzLnVuaW5zdGFsbC5iaW5kKHRoaXMpXG4gIH1cblxuICBnZXRQbHVnaW5TdGF0ZSAoKSB7XG4gICAgY29uc3QgeyBwbHVnaW5zIH0gPSB0aGlzLnVwcHkuZ2V0U3RhdGUoKVxuICAgIHJldHVybiBwbHVnaW5zW3RoaXMuaWRdIHx8IHt9XG4gIH1cblxuICBzZXRQbHVnaW5TdGF0ZSAodXBkYXRlKSB7XG4gICAgY29uc3QgeyBwbHVnaW5zIH0gPSB0aGlzLnVwcHkuZ2V0U3RhdGUoKVxuXG4gICAgdGhpcy51cHB5LnNldFN0YXRlKHtcbiAgICAgIHBsdWdpbnM6IHtcbiAgICAgICAgLi4ucGx1Z2lucyxcbiAgICAgICAgW3RoaXMuaWRdOiB7XG4gICAgICAgICAgLi4ucGx1Z2luc1t0aGlzLmlkXSxcbiAgICAgICAgICAuLi51cGRhdGVcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH0pXG4gIH1cblxuICBzZXRPcHRpb25zIChuZXdPcHRzKSB7XG4gICAgdGhpcy5vcHRzID0geyAuLi50aGlzLm9wdHMsIC4uLm5ld09wdHMgfVxuICAgIHRoaXMuc2V0UGx1Z2luU3RhdGUoKSAvLyBzbyB0aGF0IFVJIHJlLXJlbmRlcnMgd2l0aCBuZXcgb3B0aW9uc1xuICB9XG5cbiAgdXBkYXRlIChzdGF0ZSkge1xuICAgIGlmICh0eXBlb2YgdGhpcy5lbCA9PT0gJ3VuZGVmaW5lZCcpIHtcbiAgICAgIHJldHVyblxuICAgIH1cblxuICAgIGlmICh0aGlzLl91cGRhdGVVSSkge1xuICAgICAgdGhpcy5fdXBkYXRlVUkoc3RhdGUpXG4gICAgfVxuICB9XG5cbiAgLy8gQ2FsbGVkIGFmdGVyIGV2ZXJ5IHN0YXRlIHVwZGF0ZSwgYWZ0ZXIgZXZlcnl0aGluZydzIG1vdW50ZWQuIERlYm91bmNlZC5cbiAgYWZ0ZXJVcGRhdGUgKCkge1xuXG4gIH1cblxuICAvKipcbiAgICogQ2FsbGVkIHdoZW4gcGx1Z2luIGlzIG1vdW50ZWQsIHdoZXRoZXIgaW4gRE9NIG9yIGludG8gYW5vdGhlciBwbHVnaW4uXG4gICAqIE5lZWRlZCBiZWNhdXNlIHNvbWV0aW1lcyBwbHVnaW5zIGFyZSBtb3VudGVkIHNlcGFyYXRlbHkvYWZ0ZXIgYGluc3RhbGxgLFxuICAgKiBzbyB0aGlzLmVsIGFuZCB0aGlzLnBhcmVudCBtaWdodCBub3QgYmUgYXZhaWxhYmxlIGluIGBpbnN0YWxsYC5cbiAgICogVGhpcyBpcyB0aGUgY2FzZSB3aXRoIEB1cHB5L3JlYWN0IHBsdWdpbnMsIGZvciBleGFtcGxlLlxuICAgKi9cbiAgb25Nb3VudCAoKSB7XG5cbiAgfVxuXG4gIC8qKlxuICAgKiBDaGVjayBpZiBzdXBwbGllZCBgdGFyZ2V0YCBpcyBhIERPTSBlbGVtZW50IG9yIGFuIGBvYmplY3RgLlxuICAgKiBJZiBpdOKAmXMgYW4gb2JqZWN0IOKAlCB0YXJnZXQgaXMgYSBwbHVnaW4sIGFuZCB3ZSBzZWFyY2ggYHBsdWdpbnNgXG4gICAqIGZvciBhIHBsdWdpbiB3aXRoIHNhbWUgbmFtZSBhbmQgcmV0dXJuIGl0cyB0YXJnZXQuXG4gICAqXG4gICAqIEBwYXJhbSB7c3RyaW5nfG9iamVjdH0gdGFyZ2V0XG4gICAqXG4gICAqL1xuICBtb3VudCAodGFyZ2V0LCBwbHVnaW4pIHtcbiAgICBjb25zdCBjYWxsZXJQbHVnaW5OYW1lID0gcGx1Z2luLmlkXG5cbiAgICBjb25zdCB0YXJnZXRFbGVtZW50ID0gZmluZERPTUVsZW1lbnQodGFyZ2V0KVxuXG4gICAgaWYgKHRhcmdldEVsZW1lbnQpIHtcbiAgICAgIHRoaXMuaXNUYXJnZXRET01FbCA9IHRydWVcblxuICAgICAgLy8gQVBJIGZvciBwbHVnaW5zIHRoYXQgcmVxdWlyZSBhIHN5bmNocm9ub3VzIHJlcmVuZGVyLlxuICAgICAgdGhpcy5yZXJlbmRlciA9IChzdGF0ZSkgPT4ge1xuICAgICAgICAvLyBwbHVnaW4gY291bGQgYmUgcmVtb3ZlZCwgYnV0IHRoaXMucmVyZW5kZXIgaXMgZGVib3VuY2VkIGJlbG93LFxuICAgICAgICAvLyBzbyBpdCBjb3VsZCBzdGlsbCBiZSBjYWxsZWQgZXZlbiBhZnRlciB1cHB5LnJlbW92ZVBsdWdpbiBvciB1cHB5LmNsb3NlXG4gICAgICAgIC8vIGhlbmNlIHRoZSBjaGVja1xuICAgICAgICBpZiAoIXRoaXMudXBweS5nZXRQbHVnaW4odGhpcy5pZCkpIHJldHVyblxuICAgICAgICB0aGlzLmVsID0gcHJlYWN0LnJlbmRlcih0aGlzLnJlbmRlcihzdGF0ZSksIHRhcmdldEVsZW1lbnQsIHRoaXMuZWwpXG4gICAgICAgIHRoaXMuYWZ0ZXJVcGRhdGUoKVxuICAgICAgfVxuICAgICAgdGhpcy5fdXBkYXRlVUkgPSBkZWJvdW5jZSh0aGlzLnJlcmVuZGVyKVxuXG4gICAgICB0aGlzLnVwcHkubG9nKGBJbnN0YWxsaW5nICR7Y2FsbGVyUGx1Z2luTmFtZX0gdG8gYSBET00gZWxlbWVudCAnJHt0YXJnZXR9J2ApXG5cbiAgICAgIC8vIGNsZWFyIGV2ZXJ5dGhpbmcgaW5zaWRlIHRoZSB0YXJnZXQgY29udGFpbmVyXG4gICAgICBpZiAodGhpcy5vcHRzLnJlcGxhY2VUYXJnZXRDb250ZW50KSB7XG4gICAgICAgIHRhcmdldEVsZW1lbnQuaW5uZXJIVE1MID0gJydcbiAgICAgIH1cblxuICAgICAgdGhpcy5lbCA9IHByZWFjdC5yZW5kZXIodGhpcy5yZW5kZXIodGhpcy51cHB5LmdldFN0YXRlKCkpLCB0YXJnZXRFbGVtZW50KVxuXG4gICAgICB0aGlzLm9uTW91bnQoKVxuICAgICAgcmV0dXJuIHRoaXMuZWxcbiAgICB9XG5cbiAgICBsZXQgdGFyZ2V0UGx1Z2luXG4gICAgaWYgKHR5cGVvZiB0YXJnZXQgPT09ICdvYmplY3QnICYmIHRhcmdldCBpbnN0YW5jZW9mIFBsdWdpbikge1xuICAgICAgLy8gVGFyZ2V0aW5nIGEgcGx1Z2luICppbnN0YW5jZSpcbiAgICAgIHRhcmdldFBsdWdpbiA9IHRhcmdldFxuICAgIH0gZWxzZSBpZiAodHlwZW9mIHRhcmdldCA9PT0gJ2Z1bmN0aW9uJykge1xuICAgICAgLy8gVGFyZ2V0aW5nIGEgcGx1Z2luIHR5cGVcbiAgICAgIGNvbnN0IFRhcmdldCA9IHRhcmdldFxuICAgICAgLy8gRmluZCB0aGUgdGFyZ2V0IHBsdWdpbiBpbnN0YW5jZS5cbiAgICAgIHRoaXMudXBweS5pdGVyYXRlUGx1Z2lucygocGx1Z2luKSA9PiB7XG4gICAgICAgIGlmIChwbHVnaW4gaW5zdGFuY2VvZiBUYXJnZXQpIHtcbiAgICAgICAgICB0YXJnZXRQbHVnaW4gPSBwbHVnaW5cbiAgICAgICAgICByZXR1cm4gZmFsc2VcbiAgICAgICAgfVxuICAgICAgfSlcbiAgICB9XG5cbiAgICBpZiAodGFyZ2V0UGx1Z2luKSB7XG4gICAgICB0aGlzLnVwcHkubG9nKGBJbnN0YWxsaW5nICR7Y2FsbGVyUGx1Z2luTmFtZX0gdG8gJHt0YXJnZXRQbHVnaW4uaWR9YClcbiAgICAgIHRoaXMucGFyZW50ID0gdGFyZ2V0UGx1Z2luXG4gICAgICB0aGlzLmVsID0gdGFyZ2V0UGx1Z2luLmFkZFRhcmdldChwbHVnaW4pXG5cbiAgICAgIHRoaXMub25Nb3VudCgpXG4gICAgICByZXR1cm4gdGhpcy5lbFxuICAgIH1cblxuICAgIHRoaXMudXBweS5sb2coYE5vdCBpbnN0YWxsaW5nICR7Y2FsbGVyUGx1Z2luTmFtZX1gKVxuXG4gICAgbGV0IG1lc3NhZ2UgPSBgSW52YWxpZCB0YXJnZXQgb3B0aW9uIGdpdmVuIHRvICR7Y2FsbGVyUGx1Z2luTmFtZX0uYFxuICAgIGlmICh0eXBlb2YgdGFyZ2V0ID09PSAnZnVuY3Rpb24nKSB7XG4gICAgICBtZXNzYWdlICs9ICcgVGhlIGdpdmVuIHRhcmdldCBpcyBub3QgYSBQbHVnaW4gY2xhc3MuICcgK1xuICAgICAgICAnUGxlYXNlIGNoZWNrIHRoYXQgeW91XFwncmUgbm90IHNwZWNpZnlpbmcgYSBSZWFjdCBDb21wb25lbnQgaW5zdGVhZCBvZiBhIHBsdWdpbi4gJyArXG4gICAgICAgICdJZiB5b3UgYXJlIHVzaW5nIEB1cHB5LyogcGFja2FnZXMgZGlyZWN0bHksIG1ha2Ugc3VyZSB5b3UgaGF2ZSBvbmx5IDEgdmVyc2lvbiBvZiBAdXBweS9jb3JlIGluc3RhbGxlZDogJyArXG4gICAgICAgICdydW4gYG5wbSBscyBAdXBweS9jb3JlYCBvbiB0aGUgY29tbWFuZCBsaW5lIGFuZCB2ZXJpZnkgdGhhdCBhbGwgdGhlIHZlcnNpb25zIG1hdGNoIGFuZCBhcmUgZGVkdXBlZCBjb3JyZWN0bHkuJ1xuICAgIH0gZWxzZSB7XG4gICAgICBtZXNzYWdlICs9ICdJZiB5b3UgbWVhbnQgdG8gdGFyZ2V0IGFuIEhUTUwgZWxlbWVudCwgcGxlYXNlIG1ha2Ugc3VyZSB0aGF0IHRoZSBlbGVtZW50IGV4aXN0cy4gJyArXG4gICAgICAgICdDaGVjayB0aGF0IHRoZSA8c2NyaXB0PiB0YWcgaW5pdGlhbGl6aW5nIFVwcHkgaXMgcmlnaHQgYmVmb3JlIHRoZSBjbG9zaW5nIDwvYm9keT4gdGFnIGF0IHRoZSBlbmQgb2YgdGhlIHBhZ2UuICcgK1xuICAgICAgICAnKHNlZSBodHRwczovL2dpdGh1Yi5jb20vdHJhbnNsb2FkaXQvdXBweS9pc3N1ZXMvMTA0MilcXG5cXG4nICtcbiAgICAgICAgJ0lmIHlvdSBtZWFudCB0byB0YXJnZXQgYSBwbHVnaW4sIHBsZWFzZSBjb25maXJtIHRoYXQgeW91ciBgaW1wb3J0YCBzdGF0ZW1lbnRzIG9yIGByZXF1aXJlYCBjYWxscyBhcmUgY29ycmVjdC4nXG4gICAgfVxuICAgIHRocm93IG5ldyBFcnJvcihtZXNzYWdlKVxuICB9XG5cbiAgcmVuZGVyIChzdGF0ZSkge1xuICAgIHRocm93IChuZXcgRXJyb3IoJ0V4dGVuZCB0aGUgcmVuZGVyIG1ldGhvZCB0byBhZGQgeW91ciBwbHVnaW4gdG8gYSBET00gZWxlbWVudCcpKVxuICB9XG5cbiAgYWRkVGFyZ2V0IChwbHVnaW4pIHtcbiAgICB0aHJvdyAobmV3IEVycm9yKCdFeHRlbmQgdGhlIGFkZFRhcmdldCBtZXRob2QgdG8gYWRkIHlvdXIgcGx1Z2luIHRvIGFub3RoZXIgcGx1Z2luXFwncyB0YXJnZXQnKSlcbiAgfVxuXG4gIHVubW91bnQgKCkge1xuICAgIGlmICh0aGlzLmlzVGFyZ2V0RE9NRWwgJiYgdGhpcy5lbCAmJiB0aGlzLmVsLnBhcmVudE5vZGUpIHtcbiAgICAgIHRoaXMuZWwucGFyZW50Tm9kZS5yZW1vdmVDaGlsZCh0aGlzLmVsKVxuICAgIH1cbiAgfVxuXG4gIGluc3RhbGwgKCkge1xuXG4gIH1cblxuICB1bmluc3RhbGwgKCkge1xuICAgIHRoaXMudW5tb3VudCgpXG4gIH1cbn1cbiIsImNvbnN0IFRyYW5zbGF0b3IgPSByZXF1aXJlKCdAdXBweS91dGlscy9saWIvVHJhbnNsYXRvcicpXG5jb25zdCBlZSA9IHJlcXVpcmUoJ25hbWVzcGFjZS1lbWl0dGVyJylcbmNvbnN0IGN1aWQgPSByZXF1aXJlKCdjdWlkJylcbmNvbnN0IHRocm90dGxlID0gcmVxdWlyZSgnbG9kYXNoLnRocm90dGxlJylcbmNvbnN0IHByZXR0aWVyQnl0ZXMgPSByZXF1aXJlKCdAdHJhbnNsb2FkaXQvcHJldHRpZXItYnl0ZXMnKVxuY29uc3QgbWF0Y2ggPSByZXF1aXJlKCdtaW1lLW1hdGNoJylcbmNvbnN0IERlZmF1bHRTdG9yZSA9IHJlcXVpcmUoJ0B1cHB5L3N0b3JlLWRlZmF1bHQnKVxuY29uc3QgZ2V0RmlsZVR5cGUgPSByZXF1aXJlKCdAdXBweS91dGlscy9saWIvZ2V0RmlsZVR5cGUnKVxuY29uc3QgZ2V0RmlsZU5hbWVBbmRFeHRlbnNpb24gPSByZXF1aXJlKCdAdXBweS91dGlscy9saWIvZ2V0RmlsZU5hbWVBbmRFeHRlbnNpb24nKVxuY29uc3QgZ2VuZXJhdGVGaWxlSUQgPSByZXF1aXJlKCdAdXBweS91dGlscy9saWIvZ2VuZXJhdGVGaWxlSUQnKVxuY29uc3Qgc3VwcG9ydHNVcGxvYWRQcm9ncmVzcyA9IHJlcXVpcmUoJy4vc3VwcG9ydHNVcGxvYWRQcm9ncmVzcycpXG5jb25zdCB7IGp1c3RFcnJvcnNMb2dnZXIsIGRlYnVnTG9nZ2VyIH0gPSByZXF1aXJlKCcuL2xvZ2dlcnMnKVxuY29uc3QgUGx1Z2luID0gcmVxdWlyZSgnLi9QbHVnaW4nKSAvLyBFeHBvcnRlZCBmcm9tIGhlcmUuXG5cbmNsYXNzIFJlc3RyaWN0aW9uRXJyb3IgZXh0ZW5kcyBFcnJvciB7XG4gIGNvbnN0cnVjdG9yICguLi5hcmdzKSB7XG4gICAgc3VwZXIoLi4uYXJncylcbiAgICB0aGlzLmlzUmVzdHJpY3Rpb24gPSB0cnVlXG4gIH1cbn1cblxuLyoqXG4gKiBVcHB5IENvcmUgbW9kdWxlLlxuICogTWFuYWdlcyBwbHVnaW5zLCBzdGF0ZSB1cGRhdGVzLCBhY3RzIGFzIGFuIGV2ZW50IGJ1cyxcbiAqIGFkZHMvcmVtb3ZlcyBmaWxlcyBhbmQgbWV0YWRhdGEuXG4gKi9cbmNsYXNzIFVwcHkge1xuICBzdGF0aWMgVkVSU0lPTiA9IHJlcXVpcmUoJy4uL3BhY2thZ2UuanNvbicpLnZlcnNpb25cblxuICAvKipcbiAgICogSW5zdGFudGlhdGUgVXBweVxuICAgKlxuICAgKiBAcGFyYW0ge29iamVjdH0gb3B0cyDigJQgVXBweSBvcHRpb25zXG4gICAqL1xuICBjb25zdHJ1Y3RvciAob3B0cykge1xuICAgIHRoaXMuZGVmYXVsdExvY2FsZSA9IHtcbiAgICAgIHN0cmluZ3M6IHtcbiAgICAgICAgYWRkQnVsa0ZpbGVzRmFpbGVkOiB7XG4gICAgICAgICAgMDogJ0ZhaWxlZCB0byBhZGQgJXtzbWFydF9jb3VudH0gZmlsZSBkdWUgdG8gYW4gaW50ZXJuYWwgZXJyb3InLFxuICAgICAgICAgIDE6ICdGYWlsZWQgdG8gYWRkICV7c21hcnRfY291bnR9IGZpbGVzIGR1ZSB0byBpbnRlcm5hbCBlcnJvcnMnXG4gICAgICAgIH0sXG4gICAgICAgIHlvdUNhbk9ubHlVcGxvYWRYOiB7XG4gICAgICAgICAgMDogJ1lvdSBjYW4gb25seSB1cGxvYWQgJXtzbWFydF9jb3VudH0gZmlsZScsXG4gICAgICAgICAgMTogJ1lvdSBjYW4gb25seSB1cGxvYWQgJXtzbWFydF9jb3VudH0gZmlsZXMnXG4gICAgICAgIH0sXG4gICAgICAgIHlvdUhhdmVUb0F0TGVhc3RTZWxlY3RYOiB7XG4gICAgICAgICAgMDogJ1lvdSBoYXZlIHRvIHNlbGVjdCBhdCBsZWFzdCAle3NtYXJ0X2NvdW50fSBmaWxlJyxcbiAgICAgICAgICAxOiAnWW91IGhhdmUgdG8gc2VsZWN0IGF0IGxlYXN0ICV7c21hcnRfY291bnR9IGZpbGVzJ1xuICAgICAgICB9LFxuICAgICAgICAvLyBUaGUgZGVmYXVsdCBgZXhjZWVkc1NpemUyYCBzdHJpbmcgb25seSBjb21iaW5lcyB0aGUgYGV4Y2VlZHNTaXplYCBzdHJpbmcgKCV7YmFja3dhcmRzQ29tcGF0fSkgd2l0aCB0aGUgc2l6ZS5cbiAgICAgICAgLy8gTG9jYWxlcyBjYW4gb3ZlcnJpZGUgYGV4Y2VlZHNTaXplMmAgdG8gc3BlY2lmeSBhIGRpZmZlcmVudCB3b3JkIG9yZGVyLiBUaGlzIGlzIGZvciBiYWNrd2FyZHMgY29tcGF0IHdpdGhcbiAgICAgICAgLy8gVXBweSAxLjkueCBhbmQgYmVsb3cgd2hpY2ggZGlkIGEgbmFpdmUgY29uY2F0ZW5hdGlvbiBvZiBgZXhjZWVkc1NpemUyICsgc2l6ZWAgaW5zdGVhZCBvZiB1c2luZyBhIGxvY2FsZS1zcGVjaWZpY1xuICAgICAgICAvLyBzdWJzdGl0dXRpb24uXG4gICAgICAgIC8vIFRPRE86IEluIDIuMCBgZXhjZWVkc1NpemUyYCBzaG91bGQgYmUgcmVtb3ZlZCBpbiBhbmQgYGV4Y2VlZHNTaXplYCB1cGRhdGVkIHRvIHVzZSBzdWJzdGl0dXRpb24uXG4gICAgICAgIGV4Y2VlZHNTaXplMjogJyV7YmFja3dhcmRzQ29tcGF0fSAle3NpemV9JyxcbiAgICAgICAgZXhjZWVkc1NpemU6ICdUaGlzIGZpbGUgZXhjZWVkcyBtYXhpbXVtIGFsbG93ZWQgc2l6ZSBvZicsXG4gICAgICAgIGluZmVyaW9yU2l6ZTogJ1RoaXMgZmlsZSBpcyBzbWFsbGVyIHRoYW4gdGhlIGFsbG93ZWQgc2l6ZSBvZiAle3NpemV9JyxcbiAgICAgICAgeW91Q2FuT25seVVwbG9hZEZpbGVUeXBlczogJ1lvdSBjYW4gb25seSB1cGxvYWQ6ICV7dHlwZXN9JyxcbiAgICAgICAgbm9OZXdBbHJlYWR5VXBsb2FkaW5nOiAnQ2Fubm90IGFkZCBuZXcgZmlsZXM6IGFscmVhZHkgdXBsb2FkaW5nJyxcbiAgICAgICAgbm9EdXBsaWNhdGVzOiAnQ2Fubm90IGFkZCB0aGUgZHVwbGljYXRlIGZpbGUgXFwnJXtmaWxlTmFtZX1cXCcsIGl0IGFscmVhZHkgZXhpc3RzJyxcbiAgICAgICAgY29tcGFuaW9uRXJyb3I6ICdDb25uZWN0aW9uIHdpdGggQ29tcGFuaW9uIGZhaWxlZCcsXG4gICAgICAgIGNvbXBhbmlvblVuYXV0aG9yaXplSGludDogJ1RvIHVuYXV0aG9yaXplIHRvIHlvdXIgJXtwcm92aWRlcn0gYWNjb3VudCwgcGxlYXNlIGdvIHRvICV7dXJsfScsXG4gICAgICAgIGZhaWxlZFRvVXBsb2FkOiAnRmFpbGVkIHRvIHVwbG9hZCAle2ZpbGV9JyxcbiAgICAgICAgbm9JbnRlcm5ldENvbm5lY3Rpb246ICdObyBJbnRlcm5ldCBjb25uZWN0aW9uJyxcbiAgICAgICAgY29ubmVjdGVkVG9JbnRlcm5ldDogJ0Nvbm5lY3RlZCB0byB0aGUgSW50ZXJuZXQnLFxuICAgICAgICAvLyBTdHJpbmdzIGZvciByZW1vdGUgcHJvdmlkZXJzXG4gICAgICAgIG5vRmlsZXNGb3VuZDogJ1lvdSBoYXZlIG5vIGZpbGVzIG9yIGZvbGRlcnMgaGVyZScsXG4gICAgICAgIHNlbGVjdFg6IHtcbiAgICAgICAgICAwOiAnU2VsZWN0ICV7c21hcnRfY291bnR9JyxcbiAgICAgICAgICAxOiAnU2VsZWN0ICV7c21hcnRfY291bnR9J1xuICAgICAgICB9LFxuICAgICAgICBzZWxlY3RBbGxGaWxlc0Zyb21Gb2xkZXJOYW1lZDogJ1NlbGVjdCBhbGwgZmlsZXMgZnJvbSBmb2xkZXIgJXtuYW1lfScsXG4gICAgICAgIHVuc2VsZWN0QWxsRmlsZXNGcm9tRm9sZGVyTmFtZWQ6ICdVbnNlbGVjdCBhbGwgZmlsZXMgZnJvbSBmb2xkZXIgJXtuYW1lfScsXG4gICAgICAgIHNlbGVjdEZpbGVOYW1lZDogJ1NlbGVjdCBmaWxlICV7bmFtZX0nLFxuICAgICAgICB1bnNlbGVjdEZpbGVOYW1lZDogJ1Vuc2VsZWN0IGZpbGUgJXtuYW1lfScsXG4gICAgICAgIG9wZW5Gb2xkZXJOYW1lZDogJ09wZW4gZm9sZGVyICV7bmFtZX0nLFxuICAgICAgICBjYW5jZWw6ICdDYW5jZWwnLFxuICAgICAgICBsb2dPdXQ6ICdMb2cgb3V0JyxcbiAgICAgICAgZmlsdGVyOiAnRmlsdGVyJyxcbiAgICAgICAgcmVzZXRGaWx0ZXI6ICdSZXNldCBmaWx0ZXInLFxuICAgICAgICBsb2FkaW5nOiAnTG9hZGluZy4uLicsXG4gICAgICAgIGF1dGhlbnRpY2F0ZVdpdGhUaXRsZTogJ1BsZWFzZSBhdXRoZW50aWNhdGUgd2l0aCAle3BsdWdpbk5hbWV9IHRvIHNlbGVjdCBmaWxlcycsXG4gICAgICAgIGF1dGhlbnRpY2F0ZVdpdGg6ICdDb25uZWN0IHRvICV7cGx1Z2luTmFtZX0nLFxuICAgICAgICBzZWFyY2hJbWFnZXM6ICdTZWFyY2ggZm9yIGltYWdlcycsXG4gICAgICAgIGVudGVyVGV4dFRvU2VhcmNoOiAnRW50ZXIgdGV4dCB0byBzZWFyY2ggZm9yIGltYWdlcycsXG4gICAgICAgIGJhY2tUb1NlYXJjaDogJ0JhY2sgdG8gU2VhcmNoJyxcbiAgICAgICAgZW1wdHlGb2xkZXJBZGRlZDogJ05vIGZpbGVzIHdlcmUgYWRkZWQgZnJvbSBlbXB0eSBmb2xkZXInLFxuICAgICAgICBmb2xkZXJBZGRlZDoge1xuICAgICAgICAgIDA6ICdBZGRlZCAle3NtYXJ0X2NvdW50fSBmaWxlIGZyb20gJXtmb2xkZXJ9JyxcbiAgICAgICAgICAxOiAnQWRkZWQgJXtzbWFydF9jb3VudH0gZmlsZXMgZnJvbSAle2ZvbGRlcn0nXG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9XG5cbiAgICBjb25zdCBkZWZhdWx0T3B0aW9ucyA9IHtcbiAgICAgIGlkOiAndXBweScsXG4gICAgICBhdXRvUHJvY2VlZDogZmFsc2UsXG4gICAgICBhbGxvd011bHRpcGxlVXBsb2FkczogdHJ1ZSxcbiAgICAgIGRlYnVnOiBmYWxzZSxcbiAgICAgIHJlc3RyaWN0aW9uczoge1xuICAgICAgICBtYXhGaWxlU2l6ZTogbnVsbCxcbiAgICAgICAgbWluRmlsZVNpemU6IG51bGwsXG4gICAgICAgIG1heFRvdGFsRmlsZVNpemU6IG51bGwsXG4gICAgICAgIG1heE51bWJlck9mRmlsZXM6IG51bGwsXG4gICAgICAgIG1pbk51bWJlck9mRmlsZXM6IG51bGwsXG4gICAgICAgIGFsbG93ZWRGaWxlVHlwZXM6IG51bGxcbiAgICAgIH0sXG4gICAgICBtZXRhOiB7fSxcbiAgICAgIG9uQmVmb3JlRmlsZUFkZGVkOiAoY3VycmVudEZpbGUsIGZpbGVzKSA9PiBjdXJyZW50RmlsZSxcbiAgICAgIG9uQmVmb3JlVXBsb2FkOiAoZmlsZXMpID0+IGZpbGVzLFxuICAgICAgc3RvcmU6IERlZmF1bHRTdG9yZSgpLFxuICAgICAgbG9nZ2VyOiBqdXN0RXJyb3JzTG9nZ2VyXG4gICAgfVxuXG4gICAgLy8gTWVyZ2UgZGVmYXVsdCBvcHRpb25zIHdpdGggdGhlIG9uZXMgc2V0IGJ5IHVzZXIsXG4gICAgLy8gbWFraW5nIHN1cmUgdG8gbWVyZ2UgcmVzdHJpY3Rpb25zIHRvb1xuICAgIHRoaXMub3B0cyA9IHtcbiAgICAgIC4uLmRlZmF1bHRPcHRpb25zLFxuICAgICAgLi4ub3B0cyxcbiAgICAgIHJlc3RyaWN0aW9uczoge1xuICAgICAgICAuLi5kZWZhdWx0T3B0aW9ucy5yZXN0cmljdGlvbnMsXG4gICAgICAgIC4uLihvcHRzICYmIG9wdHMucmVzdHJpY3Rpb25zKVxuICAgICAgfVxuICAgIH1cblxuICAgIC8vIFN1cHBvcnQgZGVidWc6IHRydWUgZm9yIGJhY2t3YXJkcy1jb21wYXRhYmlsaXR5LCB1bmxlc3MgbG9nZ2VyIGlzIHNldCBpbiBvcHRzXG4gICAgLy8gb3B0cyBpbnN0ZWFkIG9mIHRoaXMub3B0cyB0byBhdm9pZCBjb21wYXJpbmcgb2JqZWN0cyDigJQgd2Ugc2V0IGxvZ2dlcjoganVzdEVycm9yc0xvZ2dlciBpbiBkZWZhdWx0T3B0aW9uc1xuICAgIGlmIChvcHRzICYmIG9wdHMubG9nZ2VyICYmIG9wdHMuZGVidWcpIHtcbiAgICAgIHRoaXMubG9nKCdZb3UgYXJlIHVzaW5nIGEgY3VzdG9tIGBsb2dnZXJgLCBidXQgYWxzbyBzZXQgYGRlYnVnOiB0cnVlYCwgd2hpY2ggdXNlcyBidWlsdC1pbiBsb2dnZXIgdG8gb3V0cHV0IGxvZ3MgdG8gY29uc29sZS4gSWdub3JpbmcgYGRlYnVnOiB0cnVlYCBhbmQgdXNpbmcgeW91ciBjdXN0b20gYGxvZ2dlcmAuJywgJ3dhcm5pbmcnKVxuICAgIH0gZWxzZSBpZiAob3B0cyAmJiBvcHRzLmRlYnVnKSB7XG4gICAgICB0aGlzLm9wdHMubG9nZ2VyID0gZGVidWdMb2dnZXJcbiAgICB9XG5cbiAgICB0aGlzLmxvZyhgVXNpbmcgQ29yZSB2JHt0aGlzLmNvbnN0cnVjdG9yLlZFUlNJT059YClcblxuICAgIGlmICh0aGlzLm9wdHMucmVzdHJpY3Rpb25zLmFsbG93ZWRGaWxlVHlwZXMgJiZcbiAgICAgICAgdGhpcy5vcHRzLnJlc3RyaWN0aW9ucy5hbGxvd2VkRmlsZVR5cGVzICE9PSBudWxsICYmXG4gICAgICAgICFBcnJheS5pc0FycmF5KHRoaXMub3B0cy5yZXN0cmljdGlvbnMuYWxsb3dlZEZpbGVUeXBlcykpIHtcbiAgICAgIHRocm93IG5ldyBUeXBlRXJyb3IoJ2ByZXN0cmljdGlvbnMuYWxsb3dlZEZpbGVUeXBlc2AgbXVzdCBiZSBhbiBhcnJheScpXG4gICAgfVxuXG4gICAgdGhpcy5pMThuSW5pdCgpXG5cbiAgICAvLyBDb250YWluZXIgZm9yIGRpZmZlcmVudCB0eXBlcyBvZiBwbHVnaW5zXG4gICAgdGhpcy5wbHVnaW5zID0ge31cblxuICAgIHRoaXMuZ2V0U3RhdGUgPSB0aGlzLmdldFN0YXRlLmJpbmQodGhpcylcbiAgICB0aGlzLmdldFBsdWdpbiA9IHRoaXMuZ2V0UGx1Z2luLmJpbmQodGhpcylcbiAgICB0aGlzLnNldEZpbGVNZXRhID0gdGhpcy5zZXRGaWxlTWV0YS5iaW5kKHRoaXMpXG4gICAgdGhpcy5zZXRGaWxlU3RhdGUgPSB0aGlzLnNldEZpbGVTdGF0ZS5iaW5kKHRoaXMpXG4gICAgdGhpcy5sb2cgPSB0aGlzLmxvZy5iaW5kKHRoaXMpXG4gICAgdGhpcy5pbmZvID0gdGhpcy5pbmZvLmJpbmQodGhpcylcbiAgICB0aGlzLmhpZGVJbmZvID0gdGhpcy5oaWRlSW5mby5iaW5kKHRoaXMpXG4gICAgdGhpcy5hZGRGaWxlID0gdGhpcy5hZGRGaWxlLmJpbmQodGhpcylcbiAgICB0aGlzLnJlbW92ZUZpbGUgPSB0aGlzLnJlbW92ZUZpbGUuYmluZCh0aGlzKVxuICAgIHRoaXMucGF1c2VSZXN1bWUgPSB0aGlzLnBhdXNlUmVzdW1lLmJpbmQodGhpcylcblxuICAgIC8vIF9fX1doeSB0aHJvdHRsZSBhdCA1MDBtcz9cbiAgICAvLyAgICAtIFdlIG11c3QgdGhyb3R0bGUgYXQgPjI1MG1zIGZvciBzdXBlcmZvY3VzIGluIERhc2hib2FyZCB0byB3b3JrIHdlbGwgKGJlY2F1c2UgYW5pbWF0aW9uIHRha2VzIDAuMjVzLCBhbmQgd2Ugd2FudCB0byB3YWl0IGZvciBhbGwgYW5pbWF0aW9ucyB0byBiZSBvdmVyIGJlZm9yZSByZWZvY3VzaW5nKS5cbiAgICAvLyAgICBbUHJhY3RpY2FsIENoZWNrXTogaWYgdGhvdHRsZSBpcyBhdCAxMDBtcywgdGhlbiBpZiB5b3UgYXJlIHVwbG9hZGluZyBhIGZpbGUsIGFuZCBjbGljayAnQUREIE1PUkUgRklMRVMnLCAtIGZvY3VzIHdvbid0IGFjdGl2YXRlIGluIEZpcmVmb3guXG4gICAgLy8gICAgLSBXZSBtdXN0IHRocm90dGxlIGF0IGFyb3VuZCA+NTAwbXMgdG8gYXZvaWQgcGVyZm9ybWFuY2UgbGFncy5cbiAgICAvLyAgICBbUHJhY3RpY2FsIENoZWNrXSBGaXJlZm94LCB0cnkgdG8gdXBsb2FkIGEgYmlnIGZpbGUgZm9yIGEgcHJvbG9uZ2VkIHBlcmlvZCBvZiB0aW1lLiBMYXB0b3Agd2lsbCBzdGFydCB0byBoZWF0IHVwLlxuICAgIHRoaXMuX2NhbGN1bGF0ZVByb2dyZXNzID0gdGhyb3R0bGUodGhpcy5fY2FsY3VsYXRlUHJvZ3Jlc3MuYmluZCh0aGlzKSwgNTAwLCB7IGxlYWRpbmc6IHRydWUsIHRyYWlsaW5nOiB0cnVlIH0pXG5cbiAgICB0aGlzLnVwZGF0ZU9ubGluZVN0YXR1cyA9IHRoaXMudXBkYXRlT25saW5lU3RhdHVzLmJpbmQodGhpcylcbiAgICB0aGlzLnJlc2V0UHJvZ3Jlc3MgPSB0aGlzLnJlc2V0UHJvZ3Jlc3MuYmluZCh0aGlzKVxuXG4gICAgdGhpcy5wYXVzZUFsbCA9IHRoaXMucGF1c2VBbGwuYmluZCh0aGlzKVxuICAgIHRoaXMucmVzdW1lQWxsID0gdGhpcy5yZXN1bWVBbGwuYmluZCh0aGlzKVxuICAgIHRoaXMucmV0cnlBbGwgPSB0aGlzLnJldHJ5QWxsLmJpbmQodGhpcylcbiAgICB0aGlzLmNhbmNlbEFsbCA9IHRoaXMuY2FuY2VsQWxsLmJpbmQodGhpcylcbiAgICB0aGlzLnJldHJ5VXBsb2FkID0gdGhpcy5yZXRyeVVwbG9hZC5iaW5kKHRoaXMpXG4gICAgdGhpcy51cGxvYWQgPSB0aGlzLnVwbG9hZC5iaW5kKHRoaXMpXG5cbiAgICB0aGlzLmVtaXR0ZXIgPSBlZSgpXG4gICAgdGhpcy5vbiA9IHRoaXMub24uYmluZCh0aGlzKVxuICAgIHRoaXMub2ZmID0gdGhpcy5vZmYuYmluZCh0aGlzKVxuICAgIHRoaXMub25jZSA9IHRoaXMuZW1pdHRlci5vbmNlLmJpbmQodGhpcy5lbWl0dGVyKVxuICAgIHRoaXMuZW1pdCA9IHRoaXMuZW1pdHRlci5lbWl0LmJpbmQodGhpcy5lbWl0dGVyKVxuXG4gICAgdGhpcy5wcmVQcm9jZXNzb3JzID0gW11cbiAgICB0aGlzLnVwbG9hZGVycyA9IFtdXG4gICAgdGhpcy5wb3N0UHJvY2Vzc29ycyA9IFtdXG5cbiAgICB0aGlzLnN0b3JlID0gdGhpcy5vcHRzLnN0b3JlXG4gICAgdGhpcy5zZXRTdGF0ZSh7XG4gICAgICBwbHVnaW5zOiB7fSxcbiAgICAgIGZpbGVzOiB7fSxcbiAgICAgIGN1cnJlbnRVcGxvYWRzOiB7fSxcbiAgICAgIGFsbG93TmV3VXBsb2FkOiB0cnVlLFxuICAgICAgY2FwYWJpbGl0aWVzOiB7XG4gICAgICAgIHVwbG9hZFByb2dyZXNzOiBzdXBwb3J0c1VwbG9hZFByb2dyZXNzKCksXG4gICAgICAgIGluZGl2aWR1YWxDYW5jZWxsYXRpb246IHRydWUsXG4gICAgICAgIHJlc3VtYWJsZVVwbG9hZHM6IGZhbHNlXG4gICAgICB9LFxuICAgICAgdG90YWxQcm9ncmVzczogMCxcbiAgICAgIG1ldGE6IHsgLi4udGhpcy5vcHRzLm1ldGEgfSxcbiAgICAgIGluZm86IHtcbiAgICAgICAgaXNIaWRkZW46IHRydWUsXG4gICAgICAgIHR5cGU6ICdpbmZvJyxcbiAgICAgICAgbWVzc2FnZTogJydcbiAgICAgIH1cbiAgICB9KVxuXG4gICAgdGhpcy5fc3RvcmVVbnN1YnNjcmliZSA9IHRoaXMuc3RvcmUuc3Vic2NyaWJlKChwcmV2U3RhdGUsIG5leHRTdGF0ZSwgcGF0Y2gpID0+IHtcbiAgICAgIHRoaXMuZW1pdCgnc3RhdGUtdXBkYXRlJywgcHJldlN0YXRlLCBuZXh0U3RhdGUsIHBhdGNoKVxuICAgICAgdGhpcy51cGRhdGVBbGwobmV4dFN0YXRlKVxuICAgIH0pXG5cbiAgICAvLyBFeHBvc2luZyB1cHB5IG9iamVjdCBvbiB3aW5kb3cgZm9yIGRlYnVnZ2luZyBhbmQgdGVzdGluZ1xuICAgIGlmICh0aGlzLm9wdHMuZGVidWcgJiYgdHlwZW9mIHdpbmRvdyAhPT0gJ3VuZGVmaW5lZCcpIHtcbiAgICAgIHdpbmRvd1t0aGlzLm9wdHMuaWRdID0gdGhpc1xuICAgIH1cblxuICAgIHRoaXMuX2FkZExpc3RlbmVycygpXG5cbiAgICAvLyBSZS1lbmFibGUgaWYgd2XigJlsbCBuZWVkIHNvbWUgY2FwYWJpbGl0aWVzIG9uIGJvb3QsIGxpa2UgaXNNb2JpbGVEZXZpY2VcbiAgICAvLyB0aGlzLl9zZXRDYXBhYmlsaXRpZXMoKVxuICB9XG5cbiAgLy8gX3NldENhcGFiaWxpdGllcyA9ICgpID0+IHtcbiAgLy8gICBjb25zdCBjYXBhYmlsaXRpZXMgPSB7XG4gIC8vICAgICBpc01vYmlsZURldmljZTogaXNNb2JpbGVEZXZpY2UoKVxuICAvLyAgIH1cblxuICAvLyAgIHRoaXMuc2V0U3RhdGUoe1xuICAvLyAgICAgLi4udGhpcy5nZXRTdGF0ZSgpLmNhcGFiaWxpdGllcyxcbiAgLy8gICAgIGNhcGFiaWxpdGllc1xuICAvLyAgIH0pXG4gIC8vIH1cblxuICBvbiAoZXZlbnQsIGNhbGxiYWNrKSB7XG4gICAgdGhpcy5lbWl0dGVyLm9uKGV2ZW50LCBjYWxsYmFjaylcbiAgICByZXR1cm4gdGhpc1xuICB9XG5cbiAgb2ZmIChldmVudCwgY2FsbGJhY2spIHtcbiAgICB0aGlzLmVtaXR0ZXIub2ZmKGV2ZW50LCBjYWxsYmFjaylcbiAgICByZXR1cm4gdGhpc1xuICB9XG5cbiAgLyoqXG4gICAqIEl0ZXJhdGUgb24gYWxsIHBsdWdpbnMgYW5kIHJ1biBgdXBkYXRlYCBvbiB0aGVtLlxuICAgKiBDYWxsZWQgZWFjaCB0aW1lIHN0YXRlIGNoYW5nZXMuXG4gICAqXG4gICAqL1xuICB1cGRhdGVBbGwgKHN0YXRlKSB7XG4gICAgdGhpcy5pdGVyYXRlUGx1Z2lucyhwbHVnaW4gPT4ge1xuICAgICAgcGx1Z2luLnVwZGF0ZShzdGF0ZSlcbiAgICB9KVxuICB9XG5cbiAgLyoqXG4gICAqIFVwZGF0ZXMgc3RhdGUgd2l0aCBhIHBhdGNoXG4gICAqXG4gICAqIEBwYXJhbSB7b2JqZWN0fSBwYXRjaCB7Zm9vOiAnYmFyJ31cbiAgICovXG4gIHNldFN0YXRlIChwYXRjaCkge1xuICAgIHRoaXMuc3RvcmUuc2V0U3RhdGUocGF0Y2gpXG4gIH1cblxuICAvKipcbiAgICogUmV0dXJucyBjdXJyZW50IHN0YXRlLlxuICAgKlxuICAgKiBAcmV0dXJucyB7b2JqZWN0fVxuICAgKi9cbiAgZ2V0U3RhdGUgKCkge1xuICAgIHJldHVybiB0aGlzLnN0b3JlLmdldFN0YXRlKClcbiAgfVxuXG4gIC8qKlxuICAgKiBCYWNrIGNvbXBhdCBmb3Igd2hlbiB1cHB5LnN0YXRlIGlzIHVzZWQgaW5zdGVhZCBvZiB1cHB5LmdldFN0YXRlKCkuXG4gICAqL1xuICBnZXQgc3RhdGUgKCkge1xuICAgIHJldHVybiB0aGlzLmdldFN0YXRlKClcbiAgfVxuXG4gIC8qKlxuICAgKiBTaG9ydGhhbmQgdG8gc2V0IHN0YXRlIGZvciBhIHNwZWNpZmljIGZpbGUuXG4gICAqL1xuICBzZXRGaWxlU3RhdGUgKGZpbGVJRCwgc3RhdGUpIHtcbiAgICBpZiAoIXRoaXMuZ2V0U3RhdGUoKS5maWxlc1tmaWxlSURdKSB7XG4gICAgICB0aHJvdyBuZXcgRXJyb3IoYENhbuKAmXQgc2V0IHN0YXRlIGZvciAke2ZpbGVJRH0gKHRoZSBmaWxlIGNvdWxkIGhhdmUgYmVlbiByZW1vdmVkKWApXG4gICAgfVxuXG4gICAgdGhpcy5zZXRTdGF0ZSh7XG4gICAgICBmaWxlczogT2JqZWN0LmFzc2lnbih7fSwgdGhpcy5nZXRTdGF0ZSgpLmZpbGVzLCB7XG4gICAgICAgIFtmaWxlSURdOiBPYmplY3QuYXNzaWduKHt9LCB0aGlzLmdldFN0YXRlKCkuZmlsZXNbZmlsZUlEXSwgc3RhdGUpXG4gICAgICB9KVxuICAgIH0pXG4gIH1cblxuICBpMThuSW5pdCAoKSB7XG4gICAgdGhpcy50cmFuc2xhdG9yID0gbmV3IFRyYW5zbGF0b3IoW3RoaXMuZGVmYXVsdExvY2FsZSwgdGhpcy5vcHRzLmxvY2FsZV0pXG4gICAgdGhpcy5sb2NhbGUgPSB0aGlzLnRyYW5zbGF0b3IubG9jYWxlXG4gICAgdGhpcy5pMThuID0gdGhpcy50cmFuc2xhdG9yLnRyYW5zbGF0ZS5iaW5kKHRoaXMudHJhbnNsYXRvcilcbiAgICB0aGlzLmkxOG5BcnJheSA9IHRoaXMudHJhbnNsYXRvci50cmFuc2xhdGVBcnJheS5iaW5kKHRoaXMudHJhbnNsYXRvcilcbiAgfVxuXG4gIHNldE9wdGlvbnMgKG5ld09wdHMpIHtcbiAgICB0aGlzLm9wdHMgPSB7XG4gICAgICAuLi50aGlzLm9wdHMsXG4gICAgICAuLi5uZXdPcHRzLFxuICAgICAgcmVzdHJpY3Rpb25zOiB7XG4gICAgICAgIC4uLnRoaXMub3B0cy5yZXN0cmljdGlvbnMsXG4gICAgICAgIC4uLihuZXdPcHRzICYmIG5ld09wdHMucmVzdHJpY3Rpb25zKVxuICAgICAgfVxuICAgIH1cblxuICAgIGlmIChuZXdPcHRzLm1ldGEpIHtcbiAgICAgIHRoaXMuc2V0TWV0YShuZXdPcHRzLm1ldGEpXG4gICAgfVxuXG4gICAgdGhpcy5pMThuSW5pdCgpXG5cbiAgICBpZiAobmV3T3B0cy5sb2NhbGUpIHtcbiAgICAgIHRoaXMuaXRlcmF0ZVBsdWdpbnMoKHBsdWdpbikgPT4ge1xuICAgICAgICBwbHVnaW4uc2V0T3B0aW9ucygpXG4gICAgICB9KVxuICAgIH1cblxuICAgIHRoaXMuc2V0U3RhdGUoKSAvLyBzbyB0aGF0IFVJIHJlLXJlbmRlcnMgd2l0aCBuZXcgb3B0aW9uc1xuICB9XG5cbiAgcmVzZXRQcm9ncmVzcyAoKSB7XG4gICAgY29uc3QgZGVmYXVsdFByb2dyZXNzID0ge1xuICAgICAgcGVyY2VudGFnZTogMCxcbiAgICAgIGJ5dGVzVXBsb2FkZWQ6IDAsXG4gICAgICB1cGxvYWRDb21wbGV0ZTogZmFsc2UsXG4gICAgICB1cGxvYWRTdGFydGVkOiBudWxsXG4gICAgfVxuICAgIGNvbnN0IGZpbGVzID0gT2JqZWN0LmFzc2lnbih7fSwgdGhpcy5nZXRTdGF0ZSgpLmZpbGVzKVxuICAgIGNvbnN0IHVwZGF0ZWRGaWxlcyA9IHt9XG4gICAgT2JqZWN0LmtleXMoZmlsZXMpLmZvckVhY2goZmlsZUlEID0+IHtcbiAgICAgIGNvbnN0IHVwZGF0ZWRGaWxlID0gT2JqZWN0LmFzc2lnbih7fSwgZmlsZXNbZmlsZUlEXSlcbiAgICAgIHVwZGF0ZWRGaWxlLnByb2dyZXNzID0gT2JqZWN0LmFzc2lnbih7fSwgdXBkYXRlZEZpbGUucHJvZ3Jlc3MsIGRlZmF1bHRQcm9ncmVzcylcbiAgICAgIHVwZGF0ZWRGaWxlc1tmaWxlSURdID0gdXBkYXRlZEZpbGVcbiAgICB9KVxuXG4gICAgdGhpcy5zZXRTdGF0ZSh7XG4gICAgICBmaWxlczogdXBkYXRlZEZpbGVzLFxuICAgICAgdG90YWxQcm9ncmVzczogMFxuICAgIH0pXG5cbiAgICB0aGlzLmVtaXQoJ3Jlc2V0LXByb2dyZXNzJylcbiAgfVxuXG4gIGFkZFByZVByb2Nlc3NvciAoZm4pIHtcbiAgICB0aGlzLnByZVByb2Nlc3NvcnMucHVzaChmbilcbiAgfVxuXG4gIHJlbW92ZVByZVByb2Nlc3NvciAoZm4pIHtcbiAgICBjb25zdCBpID0gdGhpcy5wcmVQcm9jZXNzb3JzLmluZGV4T2YoZm4pXG4gICAgaWYgKGkgIT09IC0xKSB7XG4gICAgICB0aGlzLnByZVByb2Nlc3NvcnMuc3BsaWNlKGksIDEpXG4gICAgfVxuICB9XG5cbiAgYWRkUG9zdFByb2Nlc3NvciAoZm4pIHtcbiAgICB0aGlzLnBvc3RQcm9jZXNzb3JzLnB1c2goZm4pXG4gIH1cblxuICByZW1vdmVQb3N0UHJvY2Vzc29yIChmbikge1xuICAgIGNvbnN0IGkgPSB0aGlzLnBvc3RQcm9jZXNzb3JzLmluZGV4T2YoZm4pXG4gICAgaWYgKGkgIT09IC0xKSB7XG4gICAgICB0aGlzLnBvc3RQcm9jZXNzb3JzLnNwbGljZShpLCAxKVxuICAgIH1cbiAgfVxuXG4gIGFkZFVwbG9hZGVyIChmbikge1xuICAgIHRoaXMudXBsb2FkZXJzLnB1c2goZm4pXG4gIH1cblxuICByZW1vdmVVcGxvYWRlciAoZm4pIHtcbiAgICBjb25zdCBpID0gdGhpcy51cGxvYWRlcnMuaW5kZXhPZihmbilcbiAgICBpZiAoaSAhPT0gLTEpIHtcbiAgICAgIHRoaXMudXBsb2FkZXJzLnNwbGljZShpLCAxKVxuICAgIH1cbiAgfVxuXG4gIHNldE1ldGEgKGRhdGEpIHtcbiAgICBjb25zdCB1cGRhdGVkTWV0YSA9IE9iamVjdC5hc3NpZ24oe30sIHRoaXMuZ2V0U3RhdGUoKS5tZXRhLCBkYXRhKVxuICAgIGNvbnN0IHVwZGF0ZWRGaWxlcyA9IE9iamVjdC5hc3NpZ24oe30sIHRoaXMuZ2V0U3RhdGUoKS5maWxlcylcblxuICAgIE9iamVjdC5rZXlzKHVwZGF0ZWRGaWxlcykuZm9yRWFjaCgoZmlsZUlEKSA9PiB7XG4gICAgICB1cGRhdGVkRmlsZXNbZmlsZUlEXSA9IE9iamVjdC5hc3NpZ24oe30sIHVwZGF0ZWRGaWxlc1tmaWxlSURdLCB7XG4gICAgICAgIG1ldGE6IE9iamVjdC5hc3NpZ24oe30sIHVwZGF0ZWRGaWxlc1tmaWxlSURdLm1ldGEsIGRhdGEpXG4gICAgICB9KVxuICAgIH0pXG5cbiAgICB0aGlzLmxvZygnQWRkaW5nIG1ldGFkYXRhOicpXG4gICAgdGhpcy5sb2coZGF0YSlcblxuICAgIHRoaXMuc2V0U3RhdGUoe1xuICAgICAgbWV0YTogdXBkYXRlZE1ldGEsXG4gICAgICBmaWxlczogdXBkYXRlZEZpbGVzXG4gICAgfSlcbiAgfVxuXG4gIHNldEZpbGVNZXRhIChmaWxlSUQsIGRhdGEpIHtcbiAgICBjb25zdCB1cGRhdGVkRmlsZXMgPSBPYmplY3QuYXNzaWduKHt9LCB0aGlzLmdldFN0YXRlKCkuZmlsZXMpXG4gICAgaWYgKCF1cGRhdGVkRmlsZXNbZmlsZUlEXSkge1xuICAgICAgdGhpcy5sb2coJ1dhcyB0cnlpbmcgdG8gc2V0IG1ldGFkYXRhIGZvciBhIGZpbGUgdGhhdCBoYXMgYmVlbiByZW1vdmVkOiAnLCBmaWxlSUQpXG4gICAgICByZXR1cm5cbiAgICB9XG4gICAgY29uc3QgbmV3TWV0YSA9IE9iamVjdC5hc3NpZ24oe30sIHVwZGF0ZWRGaWxlc1tmaWxlSURdLm1ldGEsIGRhdGEpXG4gICAgdXBkYXRlZEZpbGVzW2ZpbGVJRF0gPSBPYmplY3QuYXNzaWduKHt9LCB1cGRhdGVkRmlsZXNbZmlsZUlEXSwge1xuICAgICAgbWV0YTogbmV3TWV0YVxuICAgIH0pXG4gICAgdGhpcy5zZXRTdGF0ZSh7IGZpbGVzOiB1cGRhdGVkRmlsZXMgfSlcbiAgfVxuXG4gIC8qKlxuICAgKiBHZXQgYSBmaWxlIG9iamVjdC5cbiAgICpcbiAgICogQHBhcmFtIHtzdHJpbmd9IGZpbGVJRCBUaGUgSUQgb2YgdGhlIGZpbGUgb2JqZWN0IHRvIHJldHVybi5cbiAgICovXG4gIGdldEZpbGUgKGZpbGVJRCkge1xuICAgIHJldHVybiB0aGlzLmdldFN0YXRlKCkuZmlsZXNbZmlsZUlEXVxuICB9XG5cbiAgLyoqXG4gICAqIEdldCBhbGwgZmlsZXMgaW4gYW4gYXJyYXkuXG4gICAqL1xuICBnZXRGaWxlcyAoKSB7XG4gICAgY29uc3QgeyBmaWxlcyB9ID0gdGhpcy5nZXRTdGF0ZSgpXG4gICAgcmV0dXJuIE9iamVjdC5rZXlzKGZpbGVzKS5tYXAoKGZpbGVJRCkgPT4gZmlsZXNbZmlsZUlEXSlcbiAgfVxuXG4gIC8qKlxuICAgKiBDaGVjayBpZiBtaW5OdW1iZXJPZkZpbGVzIHJlc3RyaWN0aW9uIGlzIHJlYWNoZWQgYmVmb3JlIHVwbG9hZGluZy5cbiAgICpcbiAgICogQHByaXZhdGVcbiAgICovXG4gIF9jaGVja01pbk51bWJlck9mRmlsZXMgKGZpbGVzKSB7XG4gICAgY29uc3QgeyBtaW5OdW1iZXJPZkZpbGVzIH0gPSB0aGlzLm9wdHMucmVzdHJpY3Rpb25zXG4gICAgaWYgKE9iamVjdC5rZXlzKGZpbGVzKS5sZW5ndGggPCBtaW5OdW1iZXJPZkZpbGVzKSB7XG4gICAgICB0aHJvdyBuZXcgUmVzdHJpY3Rpb25FcnJvcihgJHt0aGlzLmkxOG4oJ3lvdUhhdmVUb0F0TGVhc3RTZWxlY3RYJywgeyBzbWFydF9jb3VudDogbWluTnVtYmVyT2ZGaWxlcyB9KX1gKVxuICAgIH1cbiAgfVxuXG4gIC8qKlxuICAgKiBDaGVjayBpZiBmaWxlIHBhc3NlcyBhIHNldCBvZiByZXN0cmljdGlvbnMgc2V0IGluIG9wdGlvbnM6IG1heEZpbGVTaXplLCBtaW5GaWxlU2l6ZSxcbiAgICogbWF4TnVtYmVyT2ZGaWxlcyBhbmQgYWxsb3dlZEZpbGVUeXBlcy5cbiAgICpcbiAgICogQHBhcmFtIHtvYmplY3R9IGZpbGVzIE9iamVjdCBvZiBJRHMg4oaSIGZpbGVzIGFscmVhZHkgYWRkZWRcbiAgICogQHBhcmFtIHtvYmplY3R9IGZpbGUgb2JqZWN0IHRvIGNoZWNrXG4gICAqIEBwcml2YXRlXG4gICAqL1xuICBfY2hlY2tSZXN0cmljdGlvbnMgKGZpbGVzLCBmaWxlKSB7XG4gICAgY29uc3QgeyBtYXhGaWxlU2l6ZSwgbWluRmlsZVNpemUsIG1heFRvdGFsRmlsZVNpemUsIG1heE51bWJlck9mRmlsZXMsIGFsbG93ZWRGaWxlVHlwZXMgfSA9IHRoaXMub3B0cy5yZXN0cmljdGlvbnNcblxuICAgIGlmIChtYXhOdW1iZXJPZkZpbGVzKSB7XG4gICAgICBpZiAoT2JqZWN0LmtleXMoZmlsZXMpLmxlbmd0aCArIDEgPiBtYXhOdW1iZXJPZkZpbGVzKSB7XG4gICAgICAgIHRocm93IG5ldyBSZXN0cmljdGlvbkVycm9yKGAke3RoaXMuaTE4bigneW91Q2FuT25seVVwbG9hZFgnLCB7IHNtYXJ0X2NvdW50OiBtYXhOdW1iZXJPZkZpbGVzIH0pfWApXG4gICAgICB9XG4gICAgfVxuXG4gICAgaWYgKGFsbG93ZWRGaWxlVHlwZXMpIHtcbiAgICAgIGNvbnN0IGlzQ29ycmVjdEZpbGVUeXBlID0gYWxsb3dlZEZpbGVUeXBlcy5zb21lKCh0eXBlKSA9PiB7XG4gICAgICAgIC8vIGlzIHRoaXMgaXMgYSBtaW1lLXR5cGVcbiAgICAgICAgaWYgKHR5cGUuaW5kZXhPZignLycpID4gLTEpIHtcbiAgICAgICAgICBpZiAoIWZpbGUudHlwZSkgcmV0dXJuIGZhbHNlXG4gICAgICAgICAgcmV0dXJuIG1hdGNoKGZpbGUudHlwZS5yZXBsYWNlKC87Lio/JC8sICcnKSwgdHlwZSlcbiAgICAgICAgfVxuXG4gICAgICAgIC8vIG90aGVyd2lzZSB0aGlzIGlzIGxpa2VseSBhbiBleHRlbnNpb25cbiAgICAgICAgaWYgKHR5cGVbMF0gPT09ICcuJykge1xuICAgICAgICAgIHJldHVybiBmaWxlLmV4dGVuc2lvbi50b0xvd2VyQ2FzZSgpID09PSB0eXBlLnN1YnN0cigxKS50b0xvd2VyQ2FzZSgpXG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIGZhbHNlXG4gICAgICB9KVxuXG4gICAgICBpZiAoIWlzQ29ycmVjdEZpbGVUeXBlKSB7XG4gICAgICAgIGNvbnN0IGFsbG93ZWRGaWxlVHlwZXNTdHJpbmcgPSBhbGxvd2VkRmlsZVR5cGVzLmpvaW4oJywgJylcbiAgICAgICAgdGhyb3cgbmV3IFJlc3RyaWN0aW9uRXJyb3IodGhpcy5pMThuKCd5b3VDYW5Pbmx5VXBsb2FkRmlsZVR5cGVzJywgeyB0eXBlczogYWxsb3dlZEZpbGVUeXBlc1N0cmluZyB9KSlcbiAgICAgIH1cbiAgICB9XG5cbiAgICAvLyBXZSBjYW4ndCBjaGVjayBtYXhUb3RhbEZpbGVTaXplIGlmIHRoZSBzaXplIGlzIHVua25vd24uXG4gICAgaWYgKG1heFRvdGFsRmlsZVNpemUgJiYgZmlsZS5kYXRhLnNpemUgIT0gbnVsbCkge1xuICAgICAgbGV0IHRvdGFsRmlsZXNTaXplID0gMFxuICAgICAgdG90YWxGaWxlc1NpemUgKz0gZmlsZS5kYXRhLnNpemVcbiAgICAgIE9iamVjdC5rZXlzKGZpbGVzKS5mb3JFYWNoKChmaWxlKSA9PiB7XG4gICAgICAgIHRvdGFsRmlsZXNTaXplICs9IGZpbGVzW2ZpbGVdLmRhdGEuc2l6ZVxuICAgICAgfSlcbiAgICAgIGlmICh0b3RhbEZpbGVzU2l6ZSA+IG1heFRvdGFsRmlsZVNpemUpIHtcbiAgICAgICAgdGhyb3cgbmV3IFJlc3RyaWN0aW9uRXJyb3IodGhpcy5pMThuKCdleGNlZWRzU2l6ZTInLCB7XG4gICAgICAgICAgYmFja3dhcmRzQ29tcGF0OiB0aGlzLmkxOG4oJ2V4Y2VlZHNTaXplJyksXG4gICAgICAgICAgc2l6ZTogcHJldHRpZXJCeXRlcyhtYXhUb3RhbEZpbGVTaXplKVxuICAgICAgICB9KSlcbiAgICAgIH1cbiAgICB9XG5cbiAgICAvLyBXZSBjYW4ndCBjaGVjayBtYXhGaWxlU2l6ZSBpZiB0aGUgc2l6ZSBpcyB1bmtub3duLlxuICAgIGlmIChtYXhGaWxlU2l6ZSAmJiBmaWxlLmRhdGEuc2l6ZSAhPSBudWxsKSB7XG4gICAgICBpZiAoZmlsZS5kYXRhLnNpemUgPiBtYXhGaWxlU2l6ZSkge1xuICAgICAgICB0aHJvdyBuZXcgUmVzdHJpY3Rpb25FcnJvcih0aGlzLmkxOG4oJ2V4Y2VlZHNTaXplMicsIHtcbiAgICAgICAgICBiYWNrd2FyZHNDb21wYXQ6IHRoaXMuaTE4bignZXhjZWVkc1NpemUnKSxcbiAgICAgICAgICBzaXplOiBwcmV0dGllckJ5dGVzKG1heEZpbGVTaXplKVxuICAgICAgICB9KSlcbiAgICAgIH1cbiAgICB9XG5cbiAgICAvLyBXZSBjYW4ndCBjaGVjayBtaW5GaWxlU2l6ZSBpZiB0aGUgc2l6ZSBpcyB1bmtub3duLlxuICAgIGlmIChtaW5GaWxlU2l6ZSAmJiBmaWxlLmRhdGEuc2l6ZSAhPSBudWxsKSB7XG4gICAgICBpZiAoZmlsZS5kYXRhLnNpemUgPCBtaW5GaWxlU2l6ZSkge1xuICAgICAgICB0aHJvdyBuZXcgUmVzdHJpY3Rpb25FcnJvcih0aGlzLmkxOG4oJ2luZmVyaW9yU2l6ZScsIHtcbiAgICAgICAgICBzaXplOiBwcmV0dGllckJ5dGVzKG1pbkZpbGVTaXplKVxuICAgICAgICB9KSlcbiAgICAgIH1cbiAgICB9XG4gIH1cblxuICAvKipcbiAgICogTG9ncyBhbiBlcnJvciwgc2V0cyBJbmZvcm1lciBtZXNzYWdlLCB0aGVuIHRocm93cyB0aGUgZXJyb3IuXG4gICAqIEVtaXRzIGEgJ3Jlc3RyaWN0aW9uLWZhaWxlZCcgZXZlbnQgaWYgaXTigJlzIGEgcmVzdHJpY3Rpb24gZXJyb3JcbiAgICpcbiAgICogQHBhcmFtIHtvYmplY3QgfCBzdHJpbmd9IGVyciDigJQgRXJyb3Igb2JqZWN0IG9yIHBsYWluIHN0cmluZyBtZXNzYWdlXG4gICAqIEBwYXJhbSB7b2JqZWN0fSBbb3B0aW9uc11cbiAgICogQHBhcmFtIHtib29sZWFufSBbb3B0aW9ucy5zaG93SW5mb3JtZXI9dHJ1ZV0g4oCUIFNvbWV0aW1lcyBkZXZlbG9wZXIgbWlnaHQgd2FudCB0byBzaG93IEluZm9ybWVyIG1hbnVhbGx5XG4gICAqIEBwYXJhbSB7b2JqZWN0fSBbb3B0aW9ucy5maWxlPW51bGxdIOKAlCBGaWxlIG9iamVjdCB1c2VkIHRvIGVtaXQgdGhlIHJlc3RyaWN0aW9uIGVycm9yXG4gICAqIEBwYXJhbSB7Ym9vbGVhbn0gW29wdGlvbnMudGhyb3dFcnI9dHJ1ZV0g4oCUIEVycm9ycyBzaG91bGRu4oCZdCBiZSB0aHJvd24sIGZvciBleGFtcGxlLCBpbiBgdXBsb2FkLWVycm9yYCBldmVudFxuICAgKiBAcHJpdmF0ZVxuICAgKi9cbiAgX3Nob3dPckxvZ0Vycm9yQW5kVGhyb3cgKGVyciwgeyBzaG93SW5mb3JtZXIgPSB0cnVlLCBmaWxlID0gbnVsbCwgdGhyb3dFcnIgPSB0cnVlIH0gPSB7fSkge1xuICAgIGNvbnN0IG1lc3NhZ2UgPSB0eXBlb2YgZXJyID09PSAnb2JqZWN0JyA/IGVyci5tZXNzYWdlIDogZXJyXG4gICAgY29uc3QgZGV0YWlscyA9ICh0eXBlb2YgZXJyID09PSAnb2JqZWN0JyAmJiBlcnIuZGV0YWlscykgPyBlcnIuZGV0YWlscyA6ICcnXG5cbiAgICAvLyBSZXN0cmljdGlvbiBlcnJvcnMgc2hvdWxkIGJlIGxvZ2dlZCwgYnV0IG5vdCBhcyBlcnJvcnMsXG4gICAgLy8gYXMgdGhleSBhcmUgZXhwZWN0ZWQgYW5kIHNob3duIGluIHRoZSBVSS5cbiAgICBsZXQgbG9nTWVzc2FnZVdpdGhEZXRhaWxzID0gbWVzc2FnZVxuICAgIGlmIChkZXRhaWxzKSB7XG4gICAgICBsb2dNZXNzYWdlV2l0aERldGFpbHMgKz0gJyAnICsgZGV0YWlsc1xuICAgIH1cbiAgICBpZiAoZXJyLmlzUmVzdHJpY3Rpb24pIHtcbiAgICAgIHRoaXMubG9nKGxvZ01lc3NhZ2VXaXRoRGV0YWlscylcbiAgICAgIHRoaXMuZW1pdCgncmVzdHJpY3Rpb24tZmFpbGVkJywgZmlsZSwgZXJyKVxuICAgIH0gZWxzZSB7XG4gICAgICB0aGlzLmxvZyhsb2dNZXNzYWdlV2l0aERldGFpbHMsICdlcnJvcicpXG4gICAgfVxuXG4gICAgLy8gU29tZXRpbWVzIGluZm9ybWVyIGhhcyB0byBiZSBzaG93biBtYW51YWxseSBieSB0aGUgZGV2ZWxvcGVyLFxuICAgIC8vIGZvciBleGFtcGxlLCBpbiBgb25CZWZvcmVGaWxlQWRkZWRgLlxuICAgIGlmIChzaG93SW5mb3JtZXIpIHtcbiAgICAgIHRoaXMuaW5mbyh7IG1lc3NhZ2U6IG1lc3NhZ2UsIGRldGFpbHM6IGRldGFpbHMgfSwgJ2Vycm9yJywgNTAwMClcbiAgICB9XG5cbiAgICBpZiAodGhyb3dFcnIpIHtcbiAgICAgIHRocm93ICh0eXBlb2YgZXJyID09PSAnb2JqZWN0JyA/IGVyciA6IG5ldyBFcnJvcihlcnIpKVxuICAgIH1cbiAgfVxuXG4gIF9hc3NlcnROZXdVcGxvYWRBbGxvd2VkIChmaWxlKSB7XG4gICAgY29uc3QgeyBhbGxvd05ld1VwbG9hZCB9ID0gdGhpcy5nZXRTdGF0ZSgpXG5cbiAgICBpZiAoYWxsb3dOZXdVcGxvYWQgPT09IGZhbHNlKSB7XG4gICAgICB0aGlzLl9zaG93T3JMb2dFcnJvckFuZFRocm93KG5ldyBSZXN0cmljdGlvbkVycm9yKHRoaXMuaTE4bignbm9OZXdBbHJlYWR5VXBsb2FkaW5nJykpLCB7IGZpbGUgfSlcbiAgICB9XG4gIH1cblxuICAvKipcbiAgICogQ3JlYXRlIGEgZmlsZSBzdGF0ZSBvYmplY3QgYmFzZWQgb24gdXNlci1wcm92aWRlZCBgYWRkRmlsZSgpYCBvcHRpb25zLlxuICAgKlxuICAgKiBOb3RlIHRoaXMgaXMgZXh0cmVtZWx5IHNpZGUtZWZmZWN0ZnVsIGFuZCBzaG91bGQgb25seSBiZSBkb25lIHdoZW4gYSBmaWxlIHN0YXRlIG9iamVjdCB3aWxsIGJlIGFkZGVkIHRvIHN0YXRlIGltbWVkaWF0ZWx5IGFmdGVyd2FyZCFcbiAgICpcbiAgICogVGhlIGBmaWxlc2AgdmFsdWUgaXMgcGFzc2VkIGluIGJlY2F1c2UgaXQgbWF5IGJlIHVwZGF0ZWQgYnkgdGhlIGNhbGxlciB3aXRob3V0IHVwZGF0aW5nIHRoZSBzdG9yZS5cbiAgICovXG4gIF9jaGVja0FuZENyZWF0ZUZpbGVTdGF0ZU9iamVjdCAoZmlsZXMsIGZpbGUpIHtcbiAgICBjb25zdCBmaWxlVHlwZSA9IGdldEZpbGVUeXBlKGZpbGUpXG4gICAgZmlsZS50eXBlID0gZmlsZVR5cGVcblxuICAgIGNvbnN0IG9uQmVmb3JlRmlsZUFkZGVkUmVzdWx0ID0gdGhpcy5vcHRzLm9uQmVmb3JlRmlsZUFkZGVkKGZpbGUsIGZpbGVzKVxuXG4gICAgaWYgKG9uQmVmb3JlRmlsZUFkZGVkUmVzdWx0ID09PSBmYWxzZSkge1xuICAgICAgLy8gRG9u4oCZdCBzaG93IFVJIGluZm8gZm9yIHRoaXMgZXJyb3IsIGFzIGl0IHNob3VsZCBiZSBkb25lIGJ5IHRoZSBkZXZlbG9wZXJcbiAgICAgIHRoaXMuX3Nob3dPckxvZ0Vycm9yQW5kVGhyb3cobmV3IFJlc3RyaWN0aW9uRXJyb3IoJ0Nhbm5vdCBhZGQgdGhlIGZpbGUgYmVjYXVzZSBvbkJlZm9yZUZpbGVBZGRlZCByZXR1cm5lZCBmYWxzZS4nKSwgeyBzaG93SW5mb3JtZXI6IGZhbHNlLCBmaWxlIH0pXG4gICAgfVxuXG4gICAgaWYgKHR5cGVvZiBvbkJlZm9yZUZpbGVBZGRlZFJlc3VsdCA9PT0gJ29iamVjdCcgJiYgb25CZWZvcmVGaWxlQWRkZWRSZXN1bHQpIHtcbiAgICAgIGZpbGUgPSBvbkJlZm9yZUZpbGVBZGRlZFJlc3VsdFxuICAgIH1cblxuICAgIGxldCBmaWxlTmFtZVxuICAgIGlmIChmaWxlLm5hbWUpIHtcbiAgICAgIGZpbGVOYW1lID0gZmlsZS5uYW1lXG4gICAgfSBlbHNlIGlmIChmaWxlVHlwZS5zcGxpdCgnLycpWzBdID09PSAnaW1hZ2UnKSB7XG4gICAgICBmaWxlTmFtZSA9IGZpbGVUeXBlLnNwbGl0KCcvJylbMF0gKyAnLicgKyBmaWxlVHlwZS5zcGxpdCgnLycpWzFdXG4gICAgfSBlbHNlIHtcbiAgICAgIGZpbGVOYW1lID0gJ25vbmFtZSdcbiAgICB9XG4gICAgY29uc3QgZmlsZUV4dGVuc2lvbiA9IGdldEZpbGVOYW1lQW5kRXh0ZW5zaW9uKGZpbGVOYW1lKS5leHRlbnNpb25cbiAgICBjb25zdCBpc1JlbW90ZSA9IGZpbGUuaXNSZW1vdGUgfHwgZmFsc2VcblxuICAgIGNvbnN0IGZpbGVJRCA9IGdlbmVyYXRlRmlsZUlEKGZpbGUpXG5cbiAgICBpZiAoZmlsZXNbZmlsZUlEXSkge1xuICAgICAgdGhpcy5fc2hvd09yTG9nRXJyb3JBbmRUaHJvdyhuZXcgUmVzdHJpY3Rpb25FcnJvcih0aGlzLmkxOG4oJ25vRHVwbGljYXRlcycsIHsgZmlsZU5hbWUgfSkpLCB7IGZpbGUgfSlcbiAgICB9XG5cbiAgICBjb25zdCBtZXRhID0gZmlsZS5tZXRhIHx8IHt9XG4gICAgbWV0YS5uYW1lID0gZmlsZU5hbWVcbiAgICBtZXRhLnR5cGUgPSBmaWxlVHlwZVxuXG4gICAgLy8gYG51bGxgIG1lYW5zIHRoZSBzaXplIGlzIHVua25vd24uXG4gICAgY29uc3Qgc2l6ZSA9IGlzRmluaXRlKGZpbGUuZGF0YS5zaXplKSA/IGZpbGUuZGF0YS5zaXplIDogbnVsbFxuICAgIGNvbnN0IG5ld0ZpbGUgPSB7XG4gICAgICBzb3VyY2U6IGZpbGUuc291cmNlIHx8ICcnLFxuICAgICAgaWQ6IGZpbGVJRCxcbiAgICAgIG5hbWU6IGZpbGVOYW1lLFxuICAgICAgZXh0ZW5zaW9uOiBmaWxlRXh0ZW5zaW9uIHx8ICcnLFxuICAgICAgbWV0YToge1xuICAgICAgICAuLi50aGlzLmdldFN0YXRlKCkubWV0YSxcbiAgICAgICAgLi4ubWV0YVxuICAgICAgfSxcbiAgICAgIHR5cGU6IGZpbGVUeXBlLFxuICAgICAgZGF0YTogZmlsZS5kYXRhLFxuICAgICAgcHJvZ3Jlc3M6IHtcbiAgICAgICAgcGVyY2VudGFnZTogMCxcbiAgICAgICAgYnl0ZXNVcGxvYWRlZDogMCxcbiAgICAgICAgYnl0ZXNUb3RhbDogc2l6ZSxcbiAgICAgICAgdXBsb2FkQ29tcGxldGU6IGZhbHNlLFxuICAgICAgICB1cGxvYWRTdGFydGVkOiBudWxsXG4gICAgICB9LFxuICAgICAgc2l6ZTogc2l6ZSxcbiAgICAgIGlzUmVtb3RlOiBpc1JlbW90ZSxcbiAgICAgIHJlbW90ZTogZmlsZS5yZW1vdGUgfHwgJycsXG4gICAgICBwcmV2aWV3OiBmaWxlLnByZXZpZXdcbiAgICB9XG5cbiAgICB0cnkge1xuICAgICAgdGhpcy5fY2hlY2tSZXN0cmljdGlvbnMoZmlsZXMsIG5ld0ZpbGUpXG4gICAgfSBjYXRjaCAoZXJyKSB7XG4gICAgICB0aGlzLl9zaG93T3JMb2dFcnJvckFuZFRocm93KGVyciwgeyBmaWxlOiBuZXdGaWxlIH0pXG4gICAgfVxuXG4gICAgcmV0dXJuIG5ld0ZpbGVcbiAgfVxuXG4gIC8vIFNjaGVkdWxlIGFuIHVwbG9hZCBpZiBgYXV0b1Byb2NlZWRgIGlzIGVuYWJsZWQuXG4gIF9zdGFydElmQXV0b1Byb2NlZWQgKCkge1xuICAgIGlmICh0aGlzLm9wdHMuYXV0b1Byb2NlZWQgJiYgIXRoaXMuc2NoZWR1bGVkQXV0b1Byb2NlZWQpIHtcbiAgICAgIHRoaXMuc2NoZWR1bGVkQXV0b1Byb2NlZWQgPSBzZXRUaW1lb3V0KCgpID0+IHtcbiAgICAgICAgdGhpcy5zY2hlZHVsZWRBdXRvUHJvY2VlZCA9IG51bGxcbiAgICAgICAgdGhpcy51cGxvYWQoKS5jYXRjaCgoZXJyKSA9PiB7XG4gICAgICAgICAgaWYgKCFlcnIuaXNSZXN0cmljdGlvbikge1xuICAgICAgICAgICAgdGhpcy5sb2coZXJyLnN0YWNrIHx8IGVyci5tZXNzYWdlIHx8IGVycilcbiAgICAgICAgICB9XG4gICAgICAgIH0pXG4gICAgICB9LCA0KVxuICAgIH1cbiAgfVxuXG4gIC8qKlxuICAgKiBBZGQgYSBuZXcgZmlsZSB0byBgc3RhdGUuZmlsZXNgLiBUaGlzIHdpbGwgcnVuIGBvbkJlZm9yZUZpbGVBZGRlZGAsXG4gICAqIHRyeSB0byBndWVzcyBmaWxlIHR5cGUgaW4gYSBjbGV2ZXIgd2F5LCBjaGVjayBmaWxlIGFnYWluc3QgcmVzdHJpY3Rpb25zLFxuICAgKiBhbmQgc3RhcnQgYW4gdXBsb2FkIGlmIGBhdXRvUHJvY2VlZCA9PT0gdHJ1ZWAuXG4gICAqXG4gICAqIEBwYXJhbSB7b2JqZWN0fSBmaWxlIG9iamVjdCB0byBhZGRcbiAgICogQHJldHVybnMge3N0cmluZ30gaWQgZm9yIHRoZSBhZGRlZCBmaWxlXG4gICAqL1xuICBhZGRGaWxlIChmaWxlKSB7XG4gICAgdGhpcy5fYXNzZXJ0TmV3VXBsb2FkQWxsb3dlZChmaWxlKVxuXG4gICAgY29uc3QgeyBmaWxlcyB9ID0gdGhpcy5nZXRTdGF0ZSgpXG4gICAgY29uc3QgbmV3RmlsZSA9IHRoaXMuX2NoZWNrQW5kQ3JlYXRlRmlsZVN0YXRlT2JqZWN0KGZpbGVzLCBmaWxlKVxuXG4gICAgdGhpcy5zZXRTdGF0ZSh7XG4gICAgICBmaWxlczoge1xuICAgICAgICAuLi5maWxlcyxcbiAgICAgICAgW25ld0ZpbGUuaWRdOiBuZXdGaWxlXG4gICAgICB9XG4gICAgfSlcblxuICAgIHRoaXMuZW1pdCgnZmlsZS1hZGRlZCcsIG5ld0ZpbGUpXG4gICAgdGhpcy5sb2coYEFkZGVkIGZpbGU6ICR7bmV3RmlsZS5uYW1lfSwgJHtuZXdGaWxlLmlkfSwgbWltZSB0eXBlOiAke25ld0ZpbGUudHlwZX1gKVxuXG4gICAgdGhpcy5fc3RhcnRJZkF1dG9Qcm9jZWVkKClcblxuICAgIHJldHVybiBuZXdGaWxlLmlkXG4gIH1cblxuICAvKipcbiAgICogQWRkIG11bHRpcGxlIGZpbGVzIHRvIGBzdGF0ZS5maWxlc2AuIFNlZSB0aGUgYGFkZEZpbGUoKWAgZG9jdW1lbnRhdGlvbi5cbiAgICpcbiAgICogVGhpcyBjdXRzIHNvbWUgY29ybmVycyBmb3IgcGVyZm9ybWFuY2UsIHNvIHNob3VsZCB0eXBpY2FsbHkgb25seSBiZSB1c2VkIGluIGNhc2VzIHdoZXJlIHRoZXJlIG1heSBiZSBhIGxvdCBvZiBmaWxlcy5cbiAgICpcbiAgICogSWYgYW4gZXJyb3Igb2NjdXJzIHdoaWxlIGFkZGluZyBhIGZpbGUsIGl0IGlzIGxvZ2dlZCBhbmQgdGhlIHVzZXIgaXMgbm90aWZpZWQuIFRoaXMgaXMgZ29vZCBmb3IgVUkgcGx1Z2lucywgYnV0IG5vdCBmb3IgcHJvZ3JhbW1hdGljIHVzZS4gUHJvZ3JhbW1hdGljIHVzZXJzIHNob3VsZCB1c3VhbGx5IHN0aWxsIHVzZSBgYWRkRmlsZSgpYCBvbiBpbmRpdmlkdWFsIGZpbGVzLlxuICAgKi9cbiAgYWRkRmlsZXMgKGZpbGVEZXNjcmlwdG9ycykge1xuICAgIHRoaXMuX2Fzc2VydE5ld1VwbG9hZEFsbG93ZWQoKVxuXG4gICAgLy8gY3JlYXRlIGEgY29weSBvZiB0aGUgZmlsZXMgb2JqZWN0IG9ubHkgb25jZVxuICAgIGNvbnN0IGZpbGVzID0geyAuLi50aGlzLmdldFN0YXRlKCkuZmlsZXMgfVxuICAgIGNvbnN0IG5ld0ZpbGVzID0gW11cbiAgICBjb25zdCBlcnJvcnMgPSBbXVxuICAgIGZvciAobGV0IGkgPSAwOyBpIDwgZmlsZURlc2NyaXB0b3JzLmxlbmd0aDsgaSsrKSB7XG4gICAgICB0cnkge1xuICAgICAgICBjb25zdCBuZXdGaWxlID0gdGhpcy5fY2hlY2tBbmRDcmVhdGVGaWxlU3RhdGVPYmplY3QoZmlsZXMsIGZpbGVEZXNjcmlwdG9yc1tpXSlcbiAgICAgICAgbmV3RmlsZXMucHVzaChuZXdGaWxlKVxuICAgICAgICBmaWxlc1tuZXdGaWxlLmlkXSA9IG5ld0ZpbGVcbiAgICAgIH0gY2F0Y2ggKGVycikge1xuICAgICAgICBpZiAoIWVyci5pc1Jlc3RyaWN0aW9uKSB7XG4gICAgICAgICAgZXJyb3JzLnB1c2goZXJyKVxuICAgICAgICB9XG4gICAgICB9XG4gICAgfVxuXG4gICAgdGhpcy5zZXRTdGF0ZSh7IGZpbGVzIH0pXG5cbiAgICBuZXdGaWxlcy5mb3JFYWNoKChuZXdGaWxlKSA9PiB7XG4gICAgICB0aGlzLmVtaXQoJ2ZpbGUtYWRkZWQnLCBuZXdGaWxlKVxuICAgIH0pXG5cbiAgICBpZiAobmV3RmlsZXMubGVuZ3RoID4gNSkge1xuICAgICAgdGhpcy5sb2coYEFkZGVkIGJhdGNoIG9mICR7bmV3RmlsZXMubGVuZ3RofSBmaWxlc2ApXG4gICAgfSBlbHNlIHtcbiAgICAgIE9iamVjdC5rZXlzKG5ld0ZpbGVzKS5mb3JFYWNoKGZpbGVJRCA9PiB7XG4gICAgICAgIHRoaXMubG9nKGBBZGRlZCBmaWxlOiAke25ld0ZpbGVzW2ZpbGVJRF0ubmFtZX1cXG4gaWQ6ICR7bmV3RmlsZXNbZmlsZUlEXS5pZH1cXG4gdHlwZTogJHtuZXdGaWxlc1tmaWxlSURdLnR5cGV9YClcbiAgICAgIH0pXG4gICAgfVxuXG4gICAgaWYgKG5ld0ZpbGVzLmxlbmd0aCA+IDApIHtcbiAgICAgIHRoaXMuX3N0YXJ0SWZBdXRvUHJvY2VlZCgpXG4gICAgfVxuXG4gICAgaWYgKGVycm9ycy5sZW5ndGggPiAwKSB7XG4gICAgICBsZXQgbWVzc2FnZSA9ICdNdWx0aXBsZSBlcnJvcnMgb2NjdXJyZWQgd2hpbGUgYWRkaW5nIGZpbGVzOlxcbidcbiAgICAgIGVycm9ycy5mb3JFYWNoKChzdWJFcnJvcikgPT4ge1xuICAgICAgICBtZXNzYWdlICs9IGBcXG4gKiAke3N1YkVycm9yLm1lc3NhZ2V9YFxuICAgICAgfSlcblxuICAgICAgdGhpcy5pbmZvKHtcbiAgICAgICAgbWVzc2FnZTogdGhpcy5pMThuKCdhZGRCdWxrRmlsZXNGYWlsZWQnLCB7IHNtYXJ0X2NvdW50OiBlcnJvcnMubGVuZ3RoIH0pLFxuICAgICAgICBkZXRhaWxzOiBtZXNzYWdlXG4gICAgICB9LCAnZXJyb3InLCA1MDAwKVxuXG4gICAgICBjb25zdCBlcnIgPSBuZXcgRXJyb3IobWVzc2FnZSlcbiAgICAgIGVyci5lcnJvcnMgPSBlcnJvcnNcbiAgICAgIHRocm93IGVyclxuICAgIH1cbiAgfVxuXG4gIHJlbW92ZUZpbGVzIChmaWxlSURzLCByZWFzb24pIHtcbiAgICBjb25zdCB7IGZpbGVzLCBjdXJyZW50VXBsb2FkcyB9ID0gdGhpcy5nZXRTdGF0ZSgpXG4gICAgY29uc3QgdXBkYXRlZEZpbGVzID0geyAuLi5maWxlcyB9XG4gICAgY29uc3QgdXBkYXRlZFVwbG9hZHMgPSB7IC4uLmN1cnJlbnRVcGxvYWRzIH1cblxuICAgIGNvbnN0IHJlbW92ZWRGaWxlcyA9IE9iamVjdC5jcmVhdGUobnVsbClcbiAgICBmaWxlSURzLmZvckVhY2goKGZpbGVJRCkgPT4ge1xuICAgICAgaWYgKGZpbGVzW2ZpbGVJRF0pIHtcbiAgICAgICAgcmVtb3ZlZEZpbGVzW2ZpbGVJRF0gPSBmaWxlc1tmaWxlSURdXG4gICAgICAgIGRlbGV0ZSB1cGRhdGVkRmlsZXNbZmlsZUlEXVxuICAgICAgfVxuICAgIH0pXG5cbiAgICAvLyBSZW1vdmUgZmlsZXMgZnJvbSB0aGUgYGZpbGVJRHNgIGxpc3QgaW4gZWFjaCB1cGxvYWQuXG4gICAgZnVuY3Rpb24gZmlsZUlzTm90UmVtb3ZlZCAodXBsb2FkRmlsZUlEKSB7XG4gICAgICByZXR1cm4gcmVtb3ZlZEZpbGVzW3VwbG9hZEZpbGVJRF0gPT09IHVuZGVmaW5lZFxuICAgIH1cbiAgICBjb25zdCB1cGxvYWRzVG9SZW1vdmUgPSBbXVxuICAgIE9iamVjdC5rZXlzKHVwZGF0ZWRVcGxvYWRzKS5mb3JFYWNoKCh1cGxvYWRJRCkgPT4ge1xuICAgICAgY29uc3QgbmV3RmlsZUlEcyA9IGN1cnJlbnRVcGxvYWRzW3VwbG9hZElEXS5maWxlSURzLmZpbHRlcihmaWxlSXNOb3RSZW1vdmVkKVxuXG4gICAgICAvLyBSZW1vdmUgdGhlIHVwbG9hZCBpZiBubyBmaWxlcyBhcmUgYXNzb2NpYXRlZCB3aXRoIGl0IGFueW1vcmUuXG4gICAgICBpZiAobmV3RmlsZUlEcy5sZW5ndGggPT09IDApIHtcbiAgICAgICAgdXBsb2Fkc1RvUmVtb3ZlLnB1c2godXBsb2FkSUQpXG4gICAgICAgIHJldHVyblxuICAgICAgfVxuXG4gICAgICB1cGRhdGVkVXBsb2Fkc1t1cGxvYWRJRF0gPSB7XG4gICAgICAgIC4uLmN1cnJlbnRVcGxvYWRzW3VwbG9hZElEXSxcbiAgICAgICAgZmlsZUlEczogbmV3RmlsZUlEc1xuICAgICAgfVxuICAgIH0pXG5cbiAgICB1cGxvYWRzVG9SZW1vdmUuZm9yRWFjaCgodXBsb2FkSUQpID0+IHtcbiAgICAgIGRlbGV0ZSB1cGRhdGVkVXBsb2Fkc1t1cGxvYWRJRF1cbiAgICB9KVxuXG4gICAgY29uc3Qgc3RhdGVVcGRhdGUgPSB7XG4gICAgICBjdXJyZW50VXBsb2FkczogdXBkYXRlZFVwbG9hZHMsXG4gICAgICBmaWxlczogdXBkYXRlZEZpbGVzXG4gICAgfVxuXG4gICAgLy8gSWYgYWxsIGZpbGVzIHdlcmUgcmVtb3ZlZCAtIGFsbG93IG5ldyB1cGxvYWRzIVxuICAgIGlmIChPYmplY3Qua2V5cyh1cGRhdGVkRmlsZXMpLmxlbmd0aCA9PT0gMCkge1xuICAgICAgc3RhdGVVcGRhdGUuYWxsb3dOZXdVcGxvYWQgPSB0cnVlXG4gICAgICBzdGF0ZVVwZGF0ZS5lcnJvciA9IG51bGxcbiAgICB9XG5cbiAgICB0aGlzLnNldFN0YXRlKHN0YXRlVXBkYXRlKVxuICAgIHRoaXMuX2NhbGN1bGF0ZVRvdGFsUHJvZ3Jlc3MoKVxuXG4gICAgY29uc3QgcmVtb3ZlZEZpbGVJRHMgPSBPYmplY3Qua2V5cyhyZW1vdmVkRmlsZXMpXG4gICAgcmVtb3ZlZEZpbGVJRHMuZm9yRWFjaCgoZmlsZUlEKSA9PiB7XG4gICAgICB0aGlzLmVtaXQoJ2ZpbGUtcmVtb3ZlZCcsIHJlbW92ZWRGaWxlc1tmaWxlSURdLCByZWFzb24pXG4gICAgfSlcblxuICAgIGlmIChyZW1vdmVkRmlsZUlEcy5sZW5ndGggPiA1KSB7XG4gICAgICB0aGlzLmxvZyhgUmVtb3ZlZCAke3JlbW92ZWRGaWxlSURzLmxlbmd0aH0gZmlsZXNgKVxuICAgIH0gZWxzZSB7XG4gICAgICB0aGlzLmxvZyhgUmVtb3ZlZCBmaWxlczogJHtyZW1vdmVkRmlsZUlEcy5qb2luKCcsICcpfWApXG4gICAgfVxuICB9XG5cbiAgcmVtb3ZlRmlsZSAoZmlsZUlELCByZWFzb24gPSBudWxsKSB7XG4gICAgdGhpcy5yZW1vdmVGaWxlcyhbZmlsZUlEXSwgcmVhc29uKVxuICB9XG5cbiAgcGF1c2VSZXN1bWUgKGZpbGVJRCkge1xuICAgIGlmICghdGhpcy5nZXRTdGF0ZSgpLmNhcGFiaWxpdGllcy5yZXN1bWFibGVVcGxvYWRzIHx8XG4gICAgICAgICB0aGlzLmdldEZpbGUoZmlsZUlEKS51cGxvYWRDb21wbGV0ZSkge1xuICAgICAgcmV0dXJuXG4gICAgfVxuXG4gICAgY29uc3Qgd2FzUGF1c2VkID0gdGhpcy5nZXRGaWxlKGZpbGVJRCkuaXNQYXVzZWQgfHwgZmFsc2VcbiAgICBjb25zdCBpc1BhdXNlZCA9ICF3YXNQYXVzZWRcblxuICAgIHRoaXMuc2V0RmlsZVN0YXRlKGZpbGVJRCwge1xuICAgICAgaXNQYXVzZWQ6IGlzUGF1c2VkXG4gICAgfSlcblxuICAgIHRoaXMuZW1pdCgndXBsb2FkLXBhdXNlJywgZmlsZUlELCBpc1BhdXNlZClcblxuICAgIHJldHVybiBpc1BhdXNlZFxuICB9XG5cbiAgcGF1c2VBbGwgKCkge1xuICAgIGNvbnN0IHVwZGF0ZWRGaWxlcyA9IE9iamVjdC5hc3NpZ24oe30sIHRoaXMuZ2V0U3RhdGUoKS5maWxlcylcbiAgICBjb25zdCBpblByb2dyZXNzVXBkYXRlZEZpbGVzID0gT2JqZWN0LmtleXModXBkYXRlZEZpbGVzKS5maWx0ZXIoKGZpbGUpID0+IHtcbiAgICAgIHJldHVybiAhdXBkYXRlZEZpbGVzW2ZpbGVdLnByb2dyZXNzLnVwbG9hZENvbXBsZXRlICYmXG4gICAgICAgICAgICAgdXBkYXRlZEZpbGVzW2ZpbGVdLnByb2dyZXNzLnVwbG9hZFN0YXJ0ZWRcbiAgICB9KVxuXG4gICAgaW5Qcm9ncmVzc1VwZGF0ZWRGaWxlcy5mb3JFYWNoKChmaWxlKSA9PiB7XG4gICAgICBjb25zdCB1cGRhdGVkRmlsZSA9IE9iamVjdC5hc3NpZ24oe30sIHVwZGF0ZWRGaWxlc1tmaWxlXSwge1xuICAgICAgICBpc1BhdXNlZDogdHJ1ZVxuICAgICAgfSlcbiAgICAgIHVwZGF0ZWRGaWxlc1tmaWxlXSA9IHVwZGF0ZWRGaWxlXG4gICAgfSlcblxuICAgIHRoaXMuc2V0U3RhdGUoeyBmaWxlczogdXBkYXRlZEZpbGVzIH0pXG4gICAgdGhpcy5lbWl0KCdwYXVzZS1hbGwnKVxuICB9XG5cbiAgcmVzdW1lQWxsICgpIHtcbiAgICBjb25zdCB1cGRhdGVkRmlsZXMgPSBPYmplY3QuYXNzaWduKHt9LCB0aGlzLmdldFN0YXRlKCkuZmlsZXMpXG4gICAgY29uc3QgaW5Qcm9ncmVzc1VwZGF0ZWRGaWxlcyA9IE9iamVjdC5rZXlzKHVwZGF0ZWRGaWxlcykuZmlsdGVyKChmaWxlKSA9PiB7XG4gICAgICByZXR1cm4gIXVwZGF0ZWRGaWxlc1tmaWxlXS5wcm9ncmVzcy51cGxvYWRDb21wbGV0ZSAmJlxuICAgICAgICAgICAgIHVwZGF0ZWRGaWxlc1tmaWxlXS5wcm9ncmVzcy51cGxvYWRTdGFydGVkXG4gICAgfSlcblxuICAgIGluUHJvZ3Jlc3NVcGRhdGVkRmlsZXMuZm9yRWFjaCgoZmlsZSkgPT4ge1xuICAgICAgY29uc3QgdXBkYXRlZEZpbGUgPSBPYmplY3QuYXNzaWduKHt9LCB1cGRhdGVkRmlsZXNbZmlsZV0sIHtcbiAgICAgICAgaXNQYXVzZWQ6IGZhbHNlLFxuICAgICAgICBlcnJvcjogbnVsbFxuICAgICAgfSlcbiAgICAgIHVwZGF0ZWRGaWxlc1tmaWxlXSA9IHVwZGF0ZWRGaWxlXG4gICAgfSlcbiAgICB0aGlzLnNldFN0YXRlKHsgZmlsZXM6IHVwZGF0ZWRGaWxlcyB9KVxuXG4gICAgdGhpcy5lbWl0KCdyZXN1bWUtYWxsJylcbiAgfVxuXG4gIHJldHJ5QWxsICgpIHtcbiAgICBjb25zdCB1cGRhdGVkRmlsZXMgPSBPYmplY3QuYXNzaWduKHt9LCB0aGlzLmdldFN0YXRlKCkuZmlsZXMpXG4gICAgY29uc3QgZmlsZXNUb1JldHJ5ID0gT2JqZWN0LmtleXModXBkYXRlZEZpbGVzKS5maWx0ZXIoZmlsZSA9PiB7XG4gICAgICByZXR1cm4gdXBkYXRlZEZpbGVzW2ZpbGVdLmVycm9yXG4gICAgfSlcblxuICAgIGZpbGVzVG9SZXRyeS5mb3JFYWNoKChmaWxlKSA9PiB7XG4gICAgICBjb25zdCB1cGRhdGVkRmlsZSA9IE9iamVjdC5hc3NpZ24oe30sIHVwZGF0ZWRGaWxlc1tmaWxlXSwge1xuICAgICAgICBpc1BhdXNlZDogZmFsc2UsXG4gICAgICAgIGVycm9yOiBudWxsXG4gICAgICB9KVxuICAgICAgdXBkYXRlZEZpbGVzW2ZpbGVdID0gdXBkYXRlZEZpbGVcbiAgICB9KVxuICAgIHRoaXMuc2V0U3RhdGUoe1xuICAgICAgZmlsZXM6IHVwZGF0ZWRGaWxlcyxcbiAgICAgIGVycm9yOiBudWxsXG4gICAgfSlcblxuICAgIHRoaXMuZW1pdCgncmV0cnktYWxsJywgZmlsZXNUb1JldHJ5KVxuXG4gICAgaWYgKGZpbGVzVG9SZXRyeS5sZW5ndGggPT09IDApIHtcbiAgICAgIHJldHVybiBQcm9taXNlLnJlc29sdmUoe1xuICAgICAgICBzdWNjZXNzZnVsOiBbXSxcbiAgICAgICAgZmFpbGVkOiBbXVxuICAgICAgfSlcbiAgICB9XG5cbiAgICBjb25zdCB1cGxvYWRJRCA9IHRoaXMuX2NyZWF0ZVVwbG9hZChmaWxlc1RvUmV0cnksIHtcbiAgICAgIGZvcmNlQWxsb3dOZXdVcGxvYWQ6IHRydWUgLy8gY3JlYXRlIG5ldyB1cGxvYWQgZXZlbiBpZiBhbGxvd05ld1VwbG9hZDogZmFsc2VcbiAgICB9KVxuICAgIHJldHVybiB0aGlzLl9ydW5VcGxvYWQodXBsb2FkSUQpXG4gIH1cblxuICBjYW5jZWxBbGwgKCkge1xuICAgIHRoaXMuZW1pdCgnY2FuY2VsLWFsbCcpXG5cbiAgICBjb25zdCB7IGZpbGVzIH0gPSB0aGlzLmdldFN0YXRlKClcblxuICAgIGNvbnN0IGZpbGVJRHMgPSBPYmplY3Qua2V5cyhmaWxlcylcbiAgICBpZiAoZmlsZUlEcy5sZW5ndGgpIHtcbiAgICAgIHRoaXMucmVtb3ZlRmlsZXMoZmlsZUlEcywgJ2NhbmNlbC1hbGwnKVxuICAgIH1cblxuICAgIHRoaXMuc2V0U3RhdGUoe1xuICAgICAgdG90YWxQcm9ncmVzczogMCxcbiAgICAgIGVycm9yOiBudWxsXG4gICAgfSlcbiAgfVxuXG4gIHJldHJ5VXBsb2FkIChmaWxlSUQpIHtcbiAgICB0aGlzLnNldEZpbGVTdGF0ZShmaWxlSUQsIHtcbiAgICAgIGVycm9yOiBudWxsLFxuICAgICAgaXNQYXVzZWQ6IGZhbHNlXG4gICAgfSlcblxuICAgIHRoaXMuZW1pdCgndXBsb2FkLXJldHJ5JywgZmlsZUlEKVxuXG4gICAgY29uc3QgdXBsb2FkSUQgPSB0aGlzLl9jcmVhdGVVcGxvYWQoW2ZpbGVJRF0sIHtcbiAgICAgIGZvcmNlQWxsb3dOZXdVcGxvYWQ6IHRydWUgLy8gY3JlYXRlIG5ldyB1cGxvYWQgZXZlbiBpZiBhbGxvd05ld1VwbG9hZDogZmFsc2VcbiAgICB9KVxuICAgIHJldHVybiB0aGlzLl9ydW5VcGxvYWQodXBsb2FkSUQpXG4gIH1cblxuICByZXNldCAoKSB7XG4gICAgdGhpcy5jYW5jZWxBbGwoKVxuICB9XG5cbiAgX2NhbGN1bGF0ZVByb2dyZXNzIChmaWxlLCBkYXRhKSB7XG4gICAgaWYgKCF0aGlzLmdldEZpbGUoZmlsZS5pZCkpIHtcbiAgICAgIHRoaXMubG9nKGBOb3Qgc2V0dGluZyBwcm9ncmVzcyBmb3IgYSBmaWxlIHRoYXQgaGFzIGJlZW4gcmVtb3ZlZDogJHtmaWxlLmlkfWApXG4gICAgICByZXR1cm5cbiAgICB9XG5cbiAgICAvLyBieXRlc1RvdGFsIG1heSBiZSBudWxsIG9yIHplcm87IGluIHRoYXQgY2FzZSB3ZSBjYW4ndCBkaXZpZGUgYnkgaXRcbiAgICBjb25zdCBjYW5IYXZlUGVyY2VudGFnZSA9IGlzRmluaXRlKGRhdGEuYnl0ZXNUb3RhbCkgJiYgZGF0YS5ieXRlc1RvdGFsID4gMFxuICAgIHRoaXMuc2V0RmlsZVN0YXRlKGZpbGUuaWQsIHtcbiAgICAgIHByb2dyZXNzOiB7XG4gICAgICAgIC4uLnRoaXMuZ2V0RmlsZShmaWxlLmlkKS5wcm9ncmVzcyxcbiAgICAgICAgYnl0ZXNVcGxvYWRlZDogZGF0YS5ieXRlc1VwbG9hZGVkLFxuICAgICAgICBieXRlc1RvdGFsOiBkYXRhLmJ5dGVzVG90YWwsXG4gICAgICAgIHBlcmNlbnRhZ2U6IGNhbkhhdmVQZXJjZW50YWdlXG4gICAgICAgICAgLy8gVE9ETyhnb3RvLWJ1cy1zdG9wKSBmbG9vcmluZyB0aGlzIHNob3VsZCBwcm9iYWJseSBiZSB0aGUgY2hvaWNlIG9mIHRoZSBVST9cbiAgICAgICAgICAvLyB3ZSBnZXQgbW9yZSBhY2N1cmF0ZSBjYWxjdWxhdGlvbnMgaWYgd2UgZG9uJ3Qgcm91bmQgdGhpcyBhdCBhbGwuXG4gICAgICAgICAgPyBNYXRoLnJvdW5kKGRhdGEuYnl0ZXNVcGxvYWRlZCAvIGRhdGEuYnl0ZXNUb3RhbCAqIDEwMClcbiAgICAgICAgICA6IDBcbiAgICAgIH1cbiAgICB9KVxuXG4gICAgdGhpcy5fY2FsY3VsYXRlVG90YWxQcm9ncmVzcygpXG4gIH1cblxuICBfY2FsY3VsYXRlVG90YWxQcm9ncmVzcyAoKSB7XG4gICAgLy8gY2FsY3VsYXRlIHRvdGFsIHByb2dyZXNzLCB1c2luZyB0aGUgbnVtYmVyIG9mIGZpbGVzIGN1cnJlbnRseSB1cGxvYWRpbmcsXG4gICAgLy8gbXVsdGlwbGllZCBieSAxMDAgYW5kIHRoZSBzdW1tIG9mIGluZGl2aWR1YWwgcHJvZ3Jlc3Mgb2YgZWFjaCBmaWxlXG4gICAgY29uc3QgZmlsZXMgPSB0aGlzLmdldEZpbGVzKClcblxuICAgIGNvbnN0IGluUHJvZ3Jlc3MgPSBmaWxlcy5maWx0ZXIoKGZpbGUpID0+IHtcbiAgICAgIHJldHVybiBmaWxlLnByb2dyZXNzLnVwbG9hZFN0YXJ0ZWQgfHxcbiAgICAgICAgZmlsZS5wcm9ncmVzcy5wcmVwcm9jZXNzIHx8XG4gICAgICAgIGZpbGUucHJvZ3Jlc3MucG9zdHByb2Nlc3NcbiAgICB9KVxuXG4gICAgaWYgKGluUHJvZ3Jlc3MubGVuZ3RoID09PSAwKSB7XG4gICAgICB0aGlzLmVtaXQoJ3Byb2dyZXNzJywgMClcbiAgICAgIHRoaXMuc2V0U3RhdGUoeyB0b3RhbFByb2dyZXNzOiAwIH0pXG4gICAgICByZXR1cm5cbiAgICB9XG5cbiAgICBjb25zdCBzaXplZEZpbGVzID0gaW5Qcm9ncmVzcy5maWx0ZXIoKGZpbGUpID0+IGZpbGUucHJvZ3Jlc3MuYnl0ZXNUb3RhbCAhPSBudWxsKVxuICAgIGNvbnN0IHVuc2l6ZWRGaWxlcyA9IGluUHJvZ3Jlc3MuZmlsdGVyKChmaWxlKSA9PiBmaWxlLnByb2dyZXNzLmJ5dGVzVG90YWwgPT0gbnVsbClcblxuICAgIGlmIChzaXplZEZpbGVzLmxlbmd0aCA9PT0gMCkge1xuICAgICAgY29uc3QgcHJvZ3Jlc3NNYXggPSBpblByb2dyZXNzLmxlbmd0aCAqIDEwMFxuICAgICAgY29uc3QgY3VycmVudFByb2dyZXNzID0gdW5zaXplZEZpbGVzLnJlZHVjZSgoYWNjLCBmaWxlKSA9PiB7XG4gICAgICAgIHJldHVybiBhY2MgKyBmaWxlLnByb2dyZXNzLnBlcmNlbnRhZ2VcbiAgICAgIH0sIDApXG4gICAgICBjb25zdCB0b3RhbFByb2dyZXNzID0gTWF0aC5yb3VuZChjdXJyZW50UHJvZ3Jlc3MgLyBwcm9ncmVzc01heCAqIDEwMClcbiAgICAgIHRoaXMuc2V0U3RhdGUoeyB0b3RhbFByb2dyZXNzIH0pXG4gICAgICByZXR1cm5cbiAgICB9XG5cbiAgICBsZXQgdG90YWxTaXplID0gc2l6ZWRGaWxlcy5yZWR1Y2UoKGFjYywgZmlsZSkgPT4ge1xuICAgICAgcmV0dXJuIGFjYyArIGZpbGUucHJvZ3Jlc3MuYnl0ZXNUb3RhbFxuICAgIH0sIDApXG4gICAgY29uc3QgYXZlcmFnZVNpemUgPSB0b3RhbFNpemUgLyBzaXplZEZpbGVzLmxlbmd0aFxuICAgIHRvdGFsU2l6ZSArPSBhdmVyYWdlU2l6ZSAqIHVuc2l6ZWRGaWxlcy5sZW5ndGhcblxuICAgIGxldCB1cGxvYWRlZFNpemUgPSAwXG4gICAgc2l6ZWRGaWxlcy5mb3JFYWNoKChmaWxlKSA9PiB7XG4gICAgICB1cGxvYWRlZFNpemUgKz0gZmlsZS5wcm9ncmVzcy5ieXRlc1VwbG9hZGVkXG4gICAgfSlcbiAgICB1bnNpemVkRmlsZXMuZm9yRWFjaCgoZmlsZSkgPT4ge1xuICAgICAgdXBsb2FkZWRTaXplICs9IGF2ZXJhZ2VTaXplICogKGZpbGUucHJvZ3Jlc3MucGVyY2VudGFnZSB8fCAwKSAvIDEwMFxuICAgIH0pXG5cbiAgICBsZXQgdG90YWxQcm9ncmVzcyA9IHRvdGFsU2l6ZSA9PT0gMFxuICAgICAgPyAwXG4gICAgICA6IE1hdGgucm91bmQodXBsb2FkZWRTaXplIC8gdG90YWxTaXplICogMTAwKVxuXG4gICAgLy8gaG90IGZpeCwgYmVjYXVzZTpcbiAgICAvLyB1cGxvYWRlZFNpemUgZW5kZWQgdXAgbGFyZ2VyIHRoYW4gdG90YWxTaXplLCByZXN1bHRpbmcgaW4gMTMyNSUgdG90YWxcbiAgICBpZiAodG90YWxQcm9ncmVzcyA+IDEwMCkge1xuICAgICAgdG90YWxQcm9ncmVzcyA9IDEwMFxuICAgIH1cblxuICAgIHRoaXMuc2V0U3RhdGUoeyB0b3RhbFByb2dyZXNzIH0pXG4gICAgdGhpcy5lbWl0KCdwcm9ncmVzcycsIHRvdGFsUHJvZ3Jlc3MpXG4gIH1cblxuICAvKipcbiAgICogUmVnaXN0ZXJzIGxpc3RlbmVycyBmb3IgYWxsIGdsb2JhbCBhY3Rpb25zLCBsaWtlOlxuICAgKiBgZXJyb3JgLCBgZmlsZS1yZW1vdmVkYCwgYHVwbG9hZC1wcm9ncmVzc2BcbiAgICovXG4gIF9hZGRMaXN0ZW5lcnMgKCkge1xuICAgIHRoaXMub24oJ2Vycm9yJywgKGVycm9yKSA9PiB7XG4gICAgICBsZXQgZXJyb3JNc2cgPSAnVW5rbm93biBlcnJvcidcbiAgICAgIGlmIChlcnJvci5tZXNzYWdlKSB7XG4gICAgICAgIGVycm9yTXNnID0gZXJyb3IubWVzc2FnZVxuICAgICAgfVxuXG4gICAgICBpZiAoZXJyb3IuZGV0YWlscykge1xuICAgICAgICBlcnJvck1zZyArPSAnICcgKyBlcnJvci5kZXRhaWxzXG4gICAgICB9XG5cbiAgICAgIHRoaXMuc2V0U3RhdGUoeyBlcnJvcjogZXJyb3JNc2cgfSlcbiAgICB9KVxuXG4gICAgdGhpcy5vbigndXBsb2FkLWVycm9yJywgKGZpbGUsIGVycm9yLCByZXNwb25zZSkgPT4ge1xuICAgICAgbGV0IGVycm9yTXNnID0gJ1Vua25vd24gZXJyb3InXG4gICAgICBpZiAoZXJyb3IubWVzc2FnZSkge1xuICAgICAgICBlcnJvck1zZyA9IGVycm9yLm1lc3NhZ2VcbiAgICAgIH1cblxuICAgICAgaWYgKGVycm9yLmRldGFpbHMpIHtcbiAgICAgICAgZXJyb3JNc2cgKz0gJyAnICsgZXJyb3IuZGV0YWlsc1xuICAgICAgfVxuXG4gICAgICB0aGlzLnNldEZpbGVTdGF0ZShmaWxlLmlkLCB7XG4gICAgICAgIGVycm9yOiBlcnJvck1zZyxcbiAgICAgICAgcmVzcG9uc2VcbiAgICAgIH0pXG5cbiAgICAgIHRoaXMuc2V0U3RhdGUoeyBlcnJvcjogZXJyb3IubWVzc2FnZSB9KVxuXG4gICAgICBpZiAodHlwZW9mIGVycm9yID09PSAnb2JqZWN0JyAmJiBlcnJvci5tZXNzYWdlKSB7XG4gICAgICAgIGNvbnN0IG5ld0Vycm9yID0gbmV3IEVycm9yKGVycm9yLm1lc3NhZ2UpXG4gICAgICAgIG5ld0Vycm9yLmRldGFpbHMgPSBlcnJvci5tZXNzYWdlXG4gICAgICAgIGlmIChlcnJvci5kZXRhaWxzKSB7XG4gICAgICAgICAgbmV3RXJyb3IuZGV0YWlscyArPSAnICcgKyBlcnJvci5kZXRhaWxzXG4gICAgICAgIH1cbiAgICAgICAgbmV3RXJyb3IubWVzc2FnZSA9IHRoaXMuaTE4bignZmFpbGVkVG9VcGxvYWQnLCB7IGZpbGU6IGZpbGUubmFtZSB9KVxuICAgICAgICB0aGlzLl9zaG93T3JMb2dFcnJvckFuZFRocm93KG5ld0Vycm9yLCB7XG4gICAgICAgICAgdGhyb3dFcnI6IGZhbHNlXG4gICAgICAgIH0pXG4gICAgICB9IGVsc2Uge1xuICAgICAgICB0aGlzLl9zaG93T3JMb2dFcnJvckFuZFRocm93KGVycm9yLCB7XG4gICAgICAgICAgdGhyb3dFcnI6IGZhbHNlXG4gICAgICAgIH0pXG4gICAgICB9XG4gICAgfSlcblxuICAgIHRoaXMub24oJ3VwbG9hZCcsICgpID0+IHtcbiAgICAgIHRoaXMuc2V0U3RhdGUoeyBlcnJvcjogbnVsbCB9KVxuICAgIH0pXG5cbiAgICB0aGlzLm9uKCd1cGxvYWQtc3RhcnRlZCcsIChmaWxlLCB1cGxvYWQpID0+IHtcbiAgICAgIGlmICghdGhpcy5nZXRGaWxlKGZpbGUuaWQpKSB7XG4gICAgICAgIHRoaXMubG9nKGBOb3Qgc2V0dGluZyBwcm9ncmVzcyBmb3IgYSBmaWxlIHRoYXQgaGFzIGJlZW4gcmVtb3ZlZDogJHtmaWxlLmlkfWApXG4gICAgICAgIHJldHVyblxuICAgICAgfVxuICAgICAgdGhpcy5zZXRGaWxlU3RhdGUoZmlsZS5pZCwge1xuICAgICAgICBwcm9ncmVzczoge1xuICAgICAgICAgIHVwbG9hZFN0YXJ0ZWQ6IERhdGUubm93KCksXG4gICAgICAgICAgdXBsb2FkQ29tcGxldGU6IGZhbHNlLFxuICAgICAgICAgIHBlcmNlbnRhZ2U6IDAsXG4gICAgICAgICAgYnl0ZXNVcGxvYWRlZDogMCxcbiAgICAgICAgICBieXRlc1RvdGFsOiBmaWxlLnNpemVcbiAgICAgICAgfVxuICAgICAgfSlcbiAgICB9KVxuXG4gICAgdGhpcy5vbigndXBsb2FkLXByb2dyZXNzJywgdGhpcy5fY2FsY3VsYXRlUHJvZ3Jlc3MpXG5cbiAgICB0aGlzLm9uKCd1cGxvYWQtc3VjY2VzcycsIChmaWxlLCB1cGxvYWRSZXNwKSA9PiB7XG4gICAgICBpZiAoIXRoaXMuZ2V0RmlsZShmaWxlLmlkKSkge1xuICAgICAgICB0aGlzLmxvZyhgTm90IHNldHRpbmcgcHJvZ3Jlc3MgZm9yIGEgZmlsZSB0aGF0IGhhcyBiZWVuIHJlbW92ZWQ6ICR7ZmlsZS5pZH1gKVxuICAgICAgICByZXR1cm5cbiAgICAgIH1cblxuICAgICAgY29uc3QgY3VycmVudFByb2dyZXNzID0gdGhpcy5nZXRGaWxlKGZpbGUuaWQpLnByb2dyZXNzXG4gICAgICB0aGlzLnNldEZpbGVTdGF0ZShmaWxlLmlkLCB7XG4gICAgICAgIHByb2dyZXNzOiBPYmplY3QuYXNzaWduKHt9LCBjdXJyZW50UHJvZ3Jlc3MsIHtcbiAgICAgICAgICBwb3N0cHJvY2VzczogdGhpcy5wb3N0UHJvY2Vzc29ycy5sZW5ndGggPiAwID8ge1xuICAgICAgICAgICAgbW9kZTogJ2luZGV0ZXJtaW5hdGUnXG4gICAgICAgICAgfSA6IG51bGwsXG4gICAgICAgICAgdXBsb2FkQ29tcGxldGU6IHRydWUsXG4gICAgICAgICAgcGVyY2VudGFnZTogMTAwLFxuICAgICAgICAgIGJ5dGVzVXBsb2FkZWQ6IGN1cnJlbnRQcm9ncmVzcy5ieXRlc1RvdGFsXG4gICAgICAgIH0pLFxuICAgICAgICByZXNwb25zZTogdXBsb2FkUmVzcCxcbiAgICAgICAgdXBsb2FkVVJMOiB1cGxvYWRSZXNwLnVwbG9hZFVSTCxcbiAgICAgICAgaXNQYXVzZWQ6IGZhbHNlXG4gICAgICB9KVxuXG4gICAgICB0aGlzLl9jYWxjdWxhdGVUb3RhbFByb2dyZXNzKClcbiAgICB9KVxuXG4gICAgdGhpcy5vbigncHJlcHJvY2Vzcy1wcm9ncmVzcycsIChmaWxlLCBwcm9ncmVzcykgPT4ge1xuICAgICAgaWYgKCF0aGlzLmdldEZpbGUoZmlsZS5pZCkpIHtcbiAgICAgICAgdGhpcy5sb2coYE5vdCBzZXR0aW5nIHByb2dyZXNzIGZvciBhIGZpbGUgdGhhdCBoYXMgYmVlbiByZW1vdmVkOiAke2ZpbGUuaWR9YClcbiAgICAgICAgcmV0dXJuXG4gICAgICB9XG4gICAgICB0aGlzLnNldEZpbGVTdGF0ZShmaWxlLmlkLCB7XG4gICAgICAgIHByb2dyZXNzOiBPYmplY3QuYXNzaWduKHt9LCB0aGlzLmdldEZpbGUoZmlsZS5pZCkucHJvZ3Jlc3MsIHtcbiAgICAgICAgICBwcmVwcm9jZXNzOiBwcm9ncmVzc1xuICAgICAgICB9KVxuICAgICAgfSlcbiAgICB9KVxuXG4gICAgdGhpcy5vbigncHJlcHJvY2Vzcy1jb21wbGV0ZScsIChmaWxlKSA9PiB7XG4gICAgICBpZiAoIXRoaXMuZ2V0RmlsZShmaWxlLmlkKSkge1xuICAgICAgICB0aGlzLmxvZyhgTm90IHNldHRpbmcgcHJvZ3Jlc3MgZm9yIGEgZmlsZSB0aGF0IGhhcyBiZWVuIHJlbW92ZWQ6ICR7ZmlsZS5pZH1gKVxuICAgICAgICByZXR1cm5cbiAgICAgIH1cbiAgICAgIGNvbnN0IGZpbGVzID0gT2JqZWN0LmFzc2lnbih7fSwgdGhpcy5nZXRTdGF0ZSgpLmZpbGVzKVxuICAgICAgZmlsZXNbZmlsZS5pZF0gPSBPYmplY3QuYXNzaWduKHt9LCBmaWxlc1tmaWxlLmlkXSwge1xuICAgICAgICBwcm9ncmVzczogT2JqZWN0LmFzc2lnbih7fSwgZmlsZXNbZmlsZS5pZF0ucHJvZ3Jlc3MpXG4gICAgICB9KVxuICAgICAgZGVsZXRlIGZpbGVzW2ZpbGUuaWRdLnByb2dyZXNzLnByZXByb2Nlc3NcblxuICAgICAgdGhpcy5zZXRTdGF0ZSh7IGZpbGVzOiBmaWxlcyB9KVxuICAgIH0pXG5cbiAgICB0aGlzLm9uKCdwb3N0cHJvY2Vzcy1wcm9ncmVzcycsIChmaWxlLCBwcm9ncmVzcykgPT4ge1xuICAgICAgaWYgKCF0aGlzLmdldEZpbGUoZmlsZS5pZCkpIHtcbiAgICAgICAgdGhpcy5sb2coYE5vdCBzZXR0aW5nIHByb2dyZXNzIGZvciBhIGZpbGUgdGhhdCBoYXMgYmVlbiByZW1vdmVkOiAke2ZpbGUuaWR9YClcbiAgICAgICAgcmV0dXJuXG4gICAgICB9XG4gICAgICB0aGlzLnNldEZpbGVTdGF0ZShmaWxlLmlkLCB7XG4gICAgICAgIHByb2dyZXNzOiBPYmplY3QuYXNzaWduKHt9LCB0aGlzLmdldFN0YXRlKCkuZmlsZXNbZmlsZS5pZF0ucHJvZ3Jlc3MsIHtcbiAgICAgICAgICBwb3N0cHJvY2VzczogcHJvZ3Jlc3NcbiAgICAgICAgfSlcbiAgICAgIH0pXG4gICAgfSlcblxuICAgIHRoaXMub24oJ3Bvc3Rwcm9jZXNzLWNvbXBsZXRlJywgKGZpbGUpID0+IHtcbiAgICAgIGlmICghdGhpcy5nZXRGaWxlKGZpbGUuaWQpKSB7XG4gICAgICAgIHRoaXMubG9nKGBOb3Qgc2V0dGluZyBwcm9ncmVzcyBmb3IgYSBmaWxlIHRoYXQgaGFzIGJlZW4gcmVtb3ZlZDogJHtmaWxlLmlkfWApXG4gICAgICAgIHJldHVyblxuICAgICAgfVxuICAgICAgY29uc3QgZmlsZXMgPSBPYmplY3QuYXNzaWduKHt9LCB0aGlzLmdldFN0YXRlKCkuZmlsZXMpXG4gICAgICBmaWxlc1tmaWxlLmlkXSA9IE9iamVjdC5hc3NpZ24oe30sIGZpbGVzW2ZpbGUuaWRdLCB7XG4gICAgICAgIHByb2dyZXNzOiBPYmplY3QuYXNzaWduKHt9LCBmaWxlc1tmaWxlLmlkXS5wcm9ncmVzcylcbiAgICAgIH0pXG4gICAgICBkZWxldGUgZmlsZXNbZmlsZS5pZF0ucHJvZ3Jlc3MucG9zdHByb2Nlc3NcbiAgICAgIC8vIFRPRE8gc2hvdWxkIHdlIHNldCBzb21lIGtpbmQgb2YgYGZ1bGx5Q29tcGxldGVgIHByb3BlcnR5IG9uIHRoZSBmaWxlIG9iamVjdFxuICAgICAgLy8gc28gaXQncyBlYXNpZXIgdG8gc2VlIHRoYXQgdGhlIGZpbGUgaXMgdXBsb2Fk4oCmZnVsbHkgY29tcGxldGXigKZyYXRoZXIgdGhhblxuICAgICAgLy8gd2hhdCB3ZSBoYXZlIHRvIGRvIG5vdyAoYHVwbG9hZENvbXBsZXRlICYmICFwb3N0cHJvY2Vzc2ApXG5cbiAgICAgIHRoaXMuc2V0U3RhdGUoeyBmaWxlczogZmlsZXMgfSlcbiAgICB9KVxuXG4gICAgdGhpcy5vbigncmVzdG9yZWQnLCAoKSA9PiB7XG4gICAgICAvLyBGaWxlcyBtYXkgaGF2ZSBjaGFuZ2VkLS1lbnN1cmUgcHJvZ3Jlc3MgaXMgc3RpbGwgYWNjdXJhdGUuXG4gICAgICB0aGlzLl9jYWxjdWxhdGVUb3RhbFByb2dyZXNzKClcbiAgICB9KVxuXG4gICAgLy8gc2hvdyBpbmZvcm1lciBpZiBvZmZsaW5lXG4gICAgaWYgKHR5cGVvZiB3aW5kb3cgIT09ICd1bmRlZmluZWQnICYmIHdpbmRvdy5hZGRFdmVudExpc3RlbmVyKSB7XG4gICAgICB3aW5kb3cuYWRkRXZlbnRMaXN0ZW5lcignb25saW5lJywgKCkgPT4gdGhpcy51cGRhdGVPbmxpbmVTdGF0dXMoKSlcbiAgICAgIHdpbmRvdy5hZGRFdmVudExpc3RlbmVyKCdvZmZsaW5lJywgKCkgPT4gdGhpcy51cGRhdGVPbmxpbmVTdGF0dXMoKSlcbiAgICAgIHNldFRpbWVvdXQoKCkgPT4gdGhpcy51cGRhdGVPbmxpbmVTdGF0dXMoKSwgMzAwMClcbiAgICB9XG4gIH1cblxuICB1cGRhdGVPbmxpbmVTdGF0dXMgKCkge1xuICAgIGNvbnN0IG9ubGluZSA9XG4gICAgICB0eXBlb2Ygd2luZG93Lm5hdmlnYXRvci5vbkxpbmUgIT09ICd1bmRlZmluZWQnXG4gICAgICAgID8gd2luZG93Lm5hdmlnYXRvci5vbkxpbmVcbiAgICAgICAgOiB0cnVlXG4gICAgaWYgKCFvbmxpbmUpIHtcbiAgICAgIHRoaXMuZW1pdCgnaXMtb2ZmbGluZScpXG4gICAgICB0aGlzLmluZm8odGhpcy5pMThuKCdub0ludGVybmV0Q29ubmVjdGlvbicpLCAnZXJyb3InLCAwKVxuICAgICAgdGhpcy53YXNPZmZsaW5lID0gdHJ1ZVxuICAgIH0gZWxzZSB7XG4gICAgICB0aGlzLmVtaXQoJ2lzLW9ubGluZScpXG4gICAgICBpZiAodGhpcy53YXNPZmZsaW5lKSB7XG4gICAgICAgIHRoaXMuZW1pdCgnYmFjay1vbmxpbmUnKVxuICAgICAgICB0aGlzLmluZm8odGhpcy5pMThuKCdjb25uZWN0ZWRUb0ludGVybmV0JyksICdzdWNjZXNzJywgMzAwMClcbiAgICAgICAgdGhpcy53YXNPZmZsaW5lID0gZmFsc2VcbiAgICAgIH1cbiAgICB9XG4gIH1cblxuICBnZXRJRCAoKSB7XG4gICAgcmV0dXJuIHRoaXMub3B0cy5pZFxuICB9XG5cbiAgLyoqXG4gICAqIFJlZ2lzdGVycyBhIHBsdWdpbiB3aXRoIENvcmUuXG4gICAqXG4gICAqIEBwYXJhbSB7b2JqZWN0fSBQbHVnaW4gb2JqZWN0XG4gICAqIEBwYXJhbSB7b2JqZWN0fSBbb3B0c10gb2JqZWN0IHdpdGggb3B0aW9ucyB0byBiZSBwYXNzZWQgdG8gUGx1Z2luXG4gICAqIEByZXR1cm5zIHtvYmplY3R9IHNlbGYgZm9yIGNoYWluaW5nXG4gICAqL1xuICB1c2UgKFBsdWdpbiwgb3B0cykge1xuICAgIGlmICh0eXBlb2YgUGx1Z2luICE9PSAnZnVuY3Rpb24nKSB7XG4gICAgICBjb25zdCBtc2cgPSBgRXhwZWN0ZWQgYSBwbHVnaW4gY2xhc3MsIGJ1dCBnb3QgJHtQbHVnaW4gPT09IG51bGwgPyAnbnVsbCcgOiB0eXBlb2YgUGx1Z2lufS5gICtcbiAgICAgICAgJyBQbGVhc2UgdmVyaWZ5IHRoYXQgdGhlIHBsdWdpbiB3YXMgaW1wb3J0ZWQgYW5kIHNwZWxsZWQgY29ycmVjdGx5LidcbiAgICAgIHRocm93IG5ldyBUeXBlRXJyb3IobXNnKVxuICAgIH1cblxuICAgIC8vIEluc3RhbnRpYXRlXG4gICAgY29uc3QgcGx1Z2luID0gbmV3IFBsdWdpbih0aGlzLCBvcHRzKVxuICAgIGNvbnN0IHBsdWdpbklkID0gcGx1Z2luLmlkXG4gICAgdGhpcy5wbHVnaW5zW3BsdWdpbi50eXBlXSA9IHRoaXMucGx1Z2luc1twbHVnaW4udHlwZV0gfHwgW11cblxuICAgIGlmICghcGx1Z2luSWQpIHtcbiAgICAgIHRocm93IG5ldyBFcnJvcignWW91ciBwbHVnaW4gbXVzdCBoYXZlIGFuIGlkJylcbiAgICB9XG5cbiAgICBpZiAoIXBsdWdpbi50eXBlKSB7XG4gICAgICB0aHJvdyBuZXcgRXJyb3IoJ1lvdXIgcGx1Z2luIG11c3QgaGF2ZSBhIHR5cGUnKVxuICAgIH1cblxuICAgIGNvbnN0IGV4aXN0c1BsdWdpbkFscmVhZHkgPSB0aGlzLmdldFBsdWdpbihwbHVnaW5JZClcbiAgICBpZiAoZXhpc3RzUGx1Z2luQWxyZWFkeSkge1xuICAgICAgY29uc3QgbXNnID0gYEFscmVhZHkgZm91bmQgYSBwbHVnaW4gbmFtZWQgJyR7ZXhpc3RzUGx1Z2luQWxyZWFkeS5pZH0nLiBgICtcbiAgICAgICAgYFRyaWVkIHRvIHVzZTogJyR7cGx1Z2luSWR9Jy5cXG5gICtcbiAgICAgICAgJ1VwcHkgcGx1Z2lucyBtdXN0IGhhdmUgdW5pcXVlIGBpZGAgb3B0aW9ucy4gU2VlIGh0dHBzOi8vdXBweS5pby9kb2NzL3BsdWdpbnMvI2lkLidcbiAgICAgIHRocm93IG5ldyBFcnJvcihtc2cpXG4gICAgfVxuXG4gICAgaWYgKFBsdWdpbi5WRVJTSU9OKSB7XG4gICAgICB0aGlzLmxvZyhgVXNpbmcgJHtwbHVnaW5JZH0gdiR7UGx1Z2luLlZFUlNJT059YClcbiAgICB9XG5cbiAgICB0aGlzLnBsdWdpbnNbcGx1Z2luLnR5cGVdLnB1c2gocGx1Z2luKVxuICAgIHBsdWdpbi5pbnN0YWxsKClcblxuICAgIHJldHVybiB0aGlzXG4gIH1cblxuICAvKipcbiAgICogRmluZCBvbmUgUGx1Z2luIGJ5IG5hbWUuXG4gICAqXG4gICAqIEBwYXJhbSB7c3RyaW5nfSBpZCBwbHVnaW4gaWRcbiAgICogQHJldHVybnMge29iamVjdHxib29sZWFufVxuICAgKi9cbiAgZ2V0UGx1Z2luIChpZCkge1xuICAgIGxldCBmb3VuZFBsdWdpbiA9IG51bGxcbiAgICB0aGlzLml0ZXJhdGVQbHVnaW5zKChwbHVnaW4pID0+IHtcbiAgICAgIGlmIChwbHVnaW4uaWQgPT09IGlkKSB7XG4gICAgICAgIGZvdW5kUGx1Z2luID0gcGx1Z2luXG4gICAgICAgIHJldHVybiBmYWxzZVxuICAgICAgfVxuICAgIH0pXG4gICAgcmV0dXJuIGZvdW5kUGx1Z2luXG4gIH1cblxuICAvKipcbiAgICogSXRlcmF0ZSB0aHJvdWdoIGFsbCBgdXNlYGQgcGx1Z2lucy5cbiAgICpcbiAgICogQHBhcmFtIHtGdW5jdGlvbn0gbWV0aG9kIHRoYXQgd2lsbCBiZSBydW4gb24gZWFjaCBwbHVnaW5cbiAgICovXG4gIGl0ZXJhdGVQbHVnaW5zIChtZXRob2QpIHtcbiAgICBPYmplY3Qua2V5cyh0aGlzLnBsdWdpbnMpLmZvckVhY2gocGx1Z2luVHlwZSA9PiB7XG4gICAgICB0aGlzLnBsdWdpbnNbcGx1Z2luVHlwZV0uZm9yRWFjaChtZXRob2QpXG4gICAgfSlcbiAgfVxuXG4gIC8qKlxuICAgKiBVbmluc3RhbGwgYW5kIHJlbW92ZSBhIHBsdWdpbi5cbiAgICpcbiAgICogQHBhcmFtIHtvYmplY3R9IGluc3RhbmNlIFRoZSBwbHVnaW4gaW5zdGFuY2UgdG8gcmVtb3ZlLlxuICAgKi9cbiAgcmVtb3ZlUGx1Z2luIChpbnN0YW5jZSkge1xuICAgIHRoaXMubG9nKGBSZW1vdmluZyBwbHVnaW4gJHtpbnN0YW5jZS5pZH1gKVxuICAgIHRoaXMuZW1pdCgncGx1Z2luLXJlbW92ZScsIGluc3RhbmNlKVxuXG4gICAgaWYgKGluc3RhbmNlLnVuaW5zdGFsbCkge1xuICAgICAgaW5zdGFuY2UudW5pbnN0YWxsKClcbiAgICB9XG5cbiAgICBjb25zdCBsaXN0ID0gdGhpcy5wbHVnaW5zW2luc3RhbmNlLnR5cGVdLnNsaWNlKClcbiAgICBjb25zdCBpbmRleCA9IGxpc3QuaW5kZXhPZihpbnN0YW5jZSlcbiAgICBpZiAoaW5kZXggIT09IC0xKSB7XG4gICAgICBsaXN0LnNwbGljZShpbmRleCwgMSlcbiAgICAgIHRoaXMucGx1Z2luc1tpbnN0YW5jZS50eXBlXSA9IGxpc3RcbiAgICB9XG5cbiAgICBjb25zdCB1cGRhdGVkU3RhdGUgPSB0aGlzLmdldFN0YXRlKClcbiAgICBkZWxldGUgdXBkYXRlZFN0YXRlLnBsdWdpbnNbaW5zdGFuY2UuaWRdXG4gICAgdGhpcy5zZXRTdGF0ZSh1cGRhdGVkU3RhdGUpXG4gIH1cblxuICAvKipcbiAgICogVW5pbnN0YWxsIGFsbCBwbHVnaW5zIGFuZCBjbG9zZSBkb3duIHRoaXMgVXBweSBpbnN0YW5jZS5cbiAgICovXG4gIGNsb3NlICgpIHtcbiAgICB0aGlzLmxvZyhgQ2xvc2luZyBVcHB5IGluc3RhbmNlICR7dGhpcy5vcHRzLmlkfTogcmVtb3ZpbmcgYWxsIGZpbGVzIGFuZCB1bmluc3RhbGxpbmcgcGx1Z2luc2ApXG5cbiAgICB0aGlzLnJlc2V0KClcblxuICAgIHRoaXMuX3N0b3JlVW5zdWJzY3JpYmUoKVxuXG4gICAgdGhpcy5pdGVyYXRlUGx1Z2lucygocGx1Z2luKSA9PiB7XG4gICAgICB0aGlzLnJlbW92ZVBsdWdpbihwbHVnaW4pXG4gICAgfSlcbiAgfVxuXG4gIC8qKlxuICAgKiBTZXQgaW5mbyBtZXNzYWdlIGluIGBzdGF0ZS5pbmZvYCwgc28gdGhhdCBVSSBwbHVnaW5zIGxpa2UgYEluZm9ybWVyYFxuICAgKiBjYW4gZGlzcGxheSB0aGUgbWVzc2FnZS5cbiAgICpcbiAgICogQHBhcmFtIHtzdHJpbmcgfCBvYmplY3R9IG1lc3NhZ2UgTWVzc2FnZSB0byBiZSBkaXNwbGF5ZWQgYnkgdGhlIGluZm9ybWVyXG4gICAqIEBwYXJhbSB7c3RyaW5nfSBbdHlwZV1cbiAgICogQHBhcmFtIHtudW1iZXJ9IFtkdXJhdGlvbl1cbiAgICovXG5cbiAgaW5mbyAobWVzc2FnZSwgdHlwZSA9ICdpbmZvJywgZHVyYXRpb24gPSAzMDAwKSB7XG4gICAgY29uc3QgaXNDb21wbGV4TWVzc2FnZSA9IHR5cGVvZiBtZXNzYWdlID09PSAnb2JqZWN0J1xuXG4gICAgdGhpcy5zZXRTdGF0ZSh7XG4gICAgICBpbmZvOiB7XG4gICAgICAgIGlzSGlkZGVuOiBmYWxzZSxcbiAgICAgICAgdHlwZTogdHlwZSxcbiAgICAgICAgbWVzc2FnZTogaXNDb21wbGV4TWVzc2FnZSA/IG1lc3NhZ2UubWVzc2FnZSA6IG1lc3NhZ2UsXG4gICAgICAgIGRldGFpbHM6IGlzQ29tcGxleE1lc3NhZ2UgPyBtZXNzYWdlLmRldGFpbHMgOiBudWxsXG4gICAgICB9XG4gICAgfSlcblxuICAgIHRoaXMuZW1pdCgnaW5mby12aXNpYmxlJylcblxuICAgIGNsZWFyVGltZW91dCh0aGlzLmluZm9UaW1lb3V0SUQpXG4gICAgaWYgKGR1cmF0aW9uID09PSAwKSB7XG4gICAgICB0aGlzLmluZm9UaW1lb3V0SUQgPSB1bmRlZmluZWRcbiAgICAgIHJldHVyblxuICAgIH1cblxuICAgIC8vIGhpZGUgdGhlIGluZm9ybWVyIGFmdGVyIGBkdXJhdGlvbmAgbWlsbGlzZWNvbmRzXG4gICAgdGhpcy5pbmZvVGltZW91dElEID0gc2V0VGltZW91dCh0aGlzLmhpZGVJbmZvLCBkdXJhdGlvbilcbiAgfVxuXG4gIGhpZGVJbmZvICgpIHtcbiAgICBjb25zdCBuZXdJbmZvID0gT2JqZWN0LmFzc2lnbih7fSwgdGhpcy5nZXRTdGF0ZSgpLmluZm8sIHtcbiAgICAgIGlzSGlkZGVuOiB0cnVlXG4gICAgfSlcbiAgICB0aGlzLnNldFN0YXRlKHtcbiAgICAgIGluZm86IG5ld0luZm9cbiAgICB9KVxuICAgIHRoaXMuZW1pdCgnaW5mby1oaWRkZW4nKVxuICB9XG5cbiAgLyoqXG4gICAqIFBhc3NlcyBtZXNzYWdlcyB0byBhIGZ1bmN0aW9uLCBwcm92aWRlZCBpbiBgb3B0cy5sb2dnZXJgLlxuICAgKiBJZiBgb3B0cy5sb2dnZXI6IFVwcHkuZGVidWdMb2dnZXJgIG9yIGBvcHRzLmRlYnVnOiB0cnVlYCwgbG9ncyB0byB0aGUgYnJvd3NlciBjb25zb2xlLlxuICAgKlxuICAgKiBAcGFyYW0ge3N0cmluZ3xvYmplY3R9IG1lc3NhZ2UgdG8gbG9nXG4gICAqIEBwYXJhbSB7c3RyaW5nfSBbdHlwZV0gb3B0aW9uYWwgYGVycm9yYCBvciBgd2FybmluZ2BcbiAgICovXG4gIGxvZyAobWVzc2FnZSwgdHlwZSkge1xuICAgIGNvbnN0IHsgbG9nZ2VyIH0gPSB0aGlzLm9wdHNcbiAgICBzd2l0Y2ggKHR5cGUpIHtcbiAgICAgIGNhc2UgJ2Vycm9yJzogbG9nZ2VyLmVycm9yKG1lc3NhZ2UpOyBicmVha1xuICAgICAgY2FzZSAnd2FybmluZyc6IGxvZ2dlci53YXJuKG1lc3NhZ2UpOyBicmVha1xuICAgICAgZGVmYXVsdDogbG9nZ2VyLmRlYnVnKG1lc3NhZ2UpOyBicmVha1xuICAgIH1cbiAgfVxuXG4gIC8qKlxuICAgKiBPYnNvbGV0ZSwgZXZlbnQgbGlzdGVuZXJzIGFyZSBub3cgYWRkZWQgaW4gdGhlIGNvbnN0cnVjdG9yLlxuICAgKi9cbiAgcnVuICgpIHtcbiAgICB0aGlzLmxvZygnQ2FsbGluZyBydW4oKSBpcyBubyBsb25nZXIgbmVjZXNzYXJ5LicsICd3YXJuaW5nJylcbiAgICByZXR1cm4gdGhpc1xuICB9XG5cbiAgLyoqXG4gICAqIFJlc3RvcmUgYW4gdXBsb2FkIGJ5IGl0cyBJRC5cbiAgICovXG4gIHJlc3RvcmUgKHVwbG9hZElEKSB7XG4gICAgdGhpcy5sb2coYENvcmU6IGF0dGVtcHRpbmcgdG8gcmVzdG9yZSB1cGxvYWQgXCIke3VwbG9hZElEfVwiYClcblxuICAgIGlmICghdGhpcy5nZXRTdGF0ZSgpLmN1cnJlbnRVcGxvYWRzW3VwbG9hZElEXSkge1xuICAgICAgdGhpcy5fcmVtb3ZlVXBsb2FkKHVwbG9hZElEKVxuICAgICAgcmV0dXJuIFByb21pc2UucmVqZWN0KG5ldyBFcnJvcignTm9uZXhpc3RlbnQgdXBsb2FkJykpXG4gICAgfVxuXG4gICAgcmV0dXJuIHRoaXMuX3J1blVwbG9hZCh1cGxvYWRJRClcbiAgfVxuXG4gIC8qKlxuICAgKiBDcmVhdGUgYW4gdXBsb2FkIGZvciBhIGJ1bmNoIG9mIGZpbGVzLlxuICAgKlxuICAgKiBAcGFyYW0ge0FycmF5PHN0cmluZz59IGZpbGVJRHMgRmlsZSBJRHMgdG8gaW5jbHVkZSBpbiB0aGlzIHVwbG9hZC5cbiAgICogQHJldHVybnMge3N0cmluZ30gSUQgb2YgdGhpcyB1cGxvYWQuXG4gICAqL1xuICBfY3JlYXRlVXBsb2FkIChmaWxlSURzLCBvcHRzID0ge30pIHtcbiAgICBjb25zdCB7XG4gICAgICBmb3JjZUFsbG93TmV3VXBsb2FkID0gZmFsc2UgLy8gdXBweS5yZXRyeUFsbCBzZXRzIHRoaXMgdG8gdHJ1ZSDigJQgd2hlbiByZXRyeWluZyB3ZSB3YW50IHRvIGlnbm9yZSBgYWxsb3dOZXdVcGxvYWQ6IGZhbHNlYFxuICAgIH0gPSBvcHRzXG5cbiAgICBjb25zdCB7IGFsbG93TmV3VXBsb2FkLCBjdXJyZW50VXBsb2FkcyB9ID0gdGhpcy5nZXRTdGF0ZSgpXG4gICAgaWYgKCFhbGxvd05ld1VwbG9hZCAmJiAhZm9yY2VBbGxvd05ld1VwbG9hZCkge1xuICAgICAgdGhyb3cgbmV3IEVycm9yKCdDYW5ub3QgY3JlYXRlIGEgbmV3IHVwbG9hZDogYWxyZWFkeSB1cGxvYWRpbmcuJylcbiAgICB9XG5cbiAgICBjb25zdCB1cGxvYWRJRCA9IGN1aWQoKVxuXG4gICAgdGhpcy5lbWl0KCd1cGxvYWQnLCB7XG4gICAgICBpZDogdXBsb2FkSUQsXG4gICAgICBmaWxlSURzOiBmaWxlSURzXG4gICAgfSlcblxuICAgIHRoaXMuc2V0U3RhdGUoe1xuICAgICAgYWxsb3dOZXdVcGxvYWQ6IHRoaXMub3B0cy5hbGxvd011bHRpcGxlVXBsb2FkcyAhPT0gZmFsc2UsXG5cbiAgICAgIGN1cnJlbnRVcGxvYWRzOiB7XG4gICAgICAgIC4uLmN1cnJlbnRVcGxvYWRzLFxuICAgICAgICBbdXBsb2FkSURdOiB7XG4gICAgICAgICAgZmlsZUlEczogZmlsZUlEcyxcbiAgICAgICAgICBzdGVwOiAwLFxuICAgICAgICAgIHJlc3VsdDoge31cbiAgICAgICAgfVxuICAgICAgfVxuICAgIH0pXG5cbiAgICByZXR1cm4gdXBsb2FkSURcbiAgfVxuXG4gIF9nZXRVcGxvYWQgKHVwbG9hZElEKSB7XG4gICAgY29uc3QgeyBjdXJyZW50VXBsb2FkcyB9ID0gdGhpcy5nZXRTdGF0ZSgpXG5cbiAgICByZXR1cm4gY3VycmVudFVwbG9hZHNbdXBsb2FkSURdXG4gIH1cblxuICAvKipcbiAgICogQWRkIGRhdGEgdG8gYW4gdXBsb2FkJ3MgcmVzdWx0IG9iamVjdC5cbiAgICpcbiAgICogQHBhcmFtIHtzdHJpbmd9IHVwbG9hZElEIFRoZSBJRCBvZiB0aGUgdXBsb2FkLlxuICAgKiBAcGFyYW0ge29iamVjdH0gZGF0YSBEYXRhIHByb3BlcnRpZXMgdG8gYWRkIHRvIHRoZSByZXN1bHQgb2JqZWN0LlxuICAgKi9cbiAgYWRkUmVzdWx0RGF0YSAodXBsb2FkSUQsIGRhdGEpIHtcbiAgICBpZiAoIXRoaXMuX2dldFVwbG9hZCh1cGxvYWRJRCkpIHtcbiAgICAgIHRoaXMubG9nKGBOb3Qgc2V0dGluZyByZXN1bHQgZm9yIGFuIHVwbG9hZCB0aGF0IGhhcyBiZWVuIHJlbW92ZWQ6ICR7dXBsb2FkSUR9YClcbiAgICAgIHJldHVyblxuICAgIH1cbiAgICBjb25zdCBjdXJyZW50VXBsb2FkcyA9IHRoaXMuZ2V0U3RhdGUoKS5jdXJyZW50VXBsb2Fkc1xuICAgIGNvbnN0IGN1cnJlbnRVcGxvYWQgPSBPYmplY3QuYXNzaWduKHt9LCBjdXJyZW50VXBsb2Fkc1t1cGxvYWRJRF0sIHtcbiAgICAgIHJlc3VsdDogT2JqZWN0LmFzc2lnbih7fSwgY3VycmVudFVwbG9hZHNbdXBsb2FkSURdLnJlc3VsdCwgZGF0YSlcbiAgICB9KVxuICAgIHRoaXMuc2V0U3RhdGUoe1xuICAgICAgY3VycmVudFVwbG9hZHM6IE9iamVjdC5hc3NpZ24oe30sIGN1cnJlbnRVcGxvYWRzLCB7XG4gICAgICAgIFt1cGxvYWRJRF06IGN1cnJlbnRVcGxvYWRcbiAgICAgIH0pXG4gICAgfSlcbiAgfVxuXG4gIC8qKlxuICAgKiBSZW1vdmUgYW4gdXBsb2FkLCBlZy4gaWYgaXQgaGFzIGJlZW4gY2FuY2VsZWQgb3IgY29tcGxldGVkLlxuICAgKlxuICAgKiBAcGFyYW0ge3N0cmluZ30gdXBsb2FkSUQgVGhlIElEIG9mIHRoZSB1cGxvYWQuXG4gICAqL1xuICBfcmVtb3ZlVXBsb2FkICh1cGxvYWRJRCkge1xuICAgIGNvbnN0IGN1cnJlbnRVcGxvYWRzID0geyAuLi50aGlzLmdldFN0YXRlKCkuY3VycmVudFVwbG9hZHMgfVxuICAgIGRlbGV0ZSBjdXJyZW50VXBsb2Fkc1t1cGxvYWRJRF1cblxuICAgIHRoaXMuc2V0U3RhdGUoe1xuICAgICAgY3VycmVudFVwbG9hZHM6IGN1cnJlbnRVcGxvYWRzXG4gICAgfSlcbiAgfVxuXG4gIC8qKlxuICAgKiBSdW4gYW4gdXBsb2FkLiBUaGlzIHBpY2tzIHVwIHdoZXJlIGl0IGxlZnQgb2ZmIGluIGNhc2UgdGhlIHVwbG9hZCBpcyBiZWluZyByZXN0b3JlZC5cbiAgICpcbiAgICogQHByaXZhdGVcbiAgICovXG4gIF9ydW5VcGxvYWQgKHVwbG9hZElEKSB7XG4gICAgY29uc3QgdXBsb2FkRGF0YSA9IHRoaXMuZ2V0U3RhdGUoKS5jdXJyZW50VXBsb2Fkc1t1cGxvYWRJRF1cbiAgICBjb25zdCByZXN0b3JlU3RlcCA9IHVwbG9hZERhdGEuc3RlcFxuXG4gICAgY29uc3Qgc3RlcHMgPSBbXG4gICAgICAuLi50aGlzLnByZVByb2Nlc3NvcnMsXG4gICAgICAuLi50aGlzLnVwbG9hZGVycyxcbiAgICAgIC4uLnRoaXMucG9zdFByb2Nlc3NvcnNcbiAgICBdXG4gICAgbGV0IGxhc3RTdGVwID0gUHJvbWlzZS5yZXNvbHZlKClcbiAgICBzdGVwcy5mb3JFYWNoKChmbiwgc3RlcCkgPT4ge1xuICAgICAgLy8gU2tpcCB0aGlzIHN0ZXAgaWYgd2UgYXJlIHJlc3RvcmluZyBhbmQgaGF2ZSBhbHJlYWR5IGNvbXBsZXRlZCB0aGlzIHN0ZXAgYmVmb3JlLlxuICAgICAgaWYgKHN0ZXAgPCByZXN0b3JlU3RlcCkge1xuICAgICAgICByZXR1cm5cbiAgICAgIH1cblxuICAgICAgbGFzdFN0ZXAgPSBsYXN0U3RlcC50aGVuKCgpID0+IHtcbiAgICAgICAgY29uc3QgeyBjdXJyZW50VXBsb2FkcyB9ID0gdGhpcy5nZXRTdGF0ZSgpXG4gICAgICAgIGNvbnN0IGN1cnJlbnRVcGxvYWQgPSBjdXJyZW50VXBsb2Fkc1t1cGxvYWRJRF1cbiAgICAgICAgaWYgKCFjdXJyZW50VXBsb2FkKSB7XG4gICAgICAgICAgcmV0dXJuXG4gICAgICAgIH1cblxuICAgICAgICBjb25zdCB1cGRhdGVkVXBsb2FkID0gT2JqZWN0LmFzc2lnbih7fSwgY3VycmVudFVwbG9hZCwge1xuICAgICAgICAgIHN0ZXA6IHN0ZXBcbiAgICAgICAgfSlcbiAgICAgICAgdGhpcy5zZXRTdGF0ZSh7XG4gICAgICAgICAgY3VycmVudFVwbG9hZHM6IE9iamVjdC5hc3NpZ24oe30sIGN1cnJlbnRVcGxvYWRzLCB7XG4gICAgICAgICAgICBbdXBsb2FkSURdOiB1cGRhdGVkVXBsb2FkXG4gICAgICAgICAgfSlcbiAgICAgICAgfSlcblxuICAgICAgICAvLyBUT0RPIGdpdmUgdGhpcyB0aGUgYHVwZGF0ZWRVcGxvYWRgIG9iamVjdCBhcyBpdHMgb25seSBwYXJhbWV0ZXIgbWF5YmU/XG4gICAgICAgIC8vIE90aGVyd2lzZSB3aGVuIG1vcmUgbWV0YWRhdGEgbWF5IGJlIGFkZGVkIHRvIHRoZSB1cGxvYWQgdGhpcyB3b3VsZCBrZWVwIGdldHRpbmcgbW9yZSBwYXJhbWV0ZXJzXG4gICAgICAgIHJldHVybiBmbih1cGRhdGVkVXBsb2FkLmZpbGVJRHMsIHVwbG9hZElEKVxuICAgICAgfSkudGhlbigocmVzdWx0KSA9PiB7XG4gICAgICAgIHJldHVybiBudWxsXG4gICAgICB9KVxuICAgIH0pXG5cbiAgICAvLyBOb3QgcmV0dXJuaW5nIHRoZSBgY2F0Y2hgZWQgcHJvbWlzZSwgYmVjYXVzZSB3ZSBzdGlsbCB3YW50IHRvIHJldHVybiBhIHJlamVjdGVkXG4gICAgLy8gcHJvbWlzZSBmcm9tIHRoaXMgbWV0aG9kIGlmIHRoZSB1cGxvYWQgZmFpbGVkLlxuICAgIGxhc3RTdGVwLmNhdGNoKChlcnIpID0+IHtcbiAgICAgIHRoaXMuZW1pdCgnZXJyb3InLCBlcnIsIHVwbG9hZElEKVxuICAgICAgdGhpcy5fcmVtb3ZlVXBsb2FkKHVwbG9hZElEKVxuICAgIH0pXG5cbiAgICByZXR1cm4gbGFzdFN0ZXAudGhlbigoKSA9PiB7XG4gICAgICAvLyBTZXQgcmVzdWx0IGRhdGEuXG4gICAgICBjb25zdCB7IGN1cnJlbnRVcGxvYWRzIH0gPSB0aGlzLmdldFN0YXRlKClcbiAgICAgIGNvbnN0IGN1cnJlbnRVcGxvYWQgPSBjdXJyZW50VXBsb2Fkc1t1cGxvYWRJRF1cbiAgICAgIGlmICghY3VycmVudFVwbG9hZCkge1xuICAgICAgICByZXR1cm5cbiAgICAgIH1cblxuICAgICAgY29uc3QgZmlsZXMgPSBjdXJyZW50VXBsb2FkLmZpbGVJRHNcbiAgICAgICAgLm1hcCgoZmlsZUlEKSA9PiB0aGlzLmdldEZpbGUoZmlsZUlEKSlcbiAgICAgIGNvbnN0IHN1Y2Nlc3NmdWwgPSBmaWxlcy5maWx0ZXIoKGZpbGUpID0+ICFmaWxlLmVycm9yKVxuICAgICAgY29uc3QgZmFpbGVkID0gZmlsZXMuZmlsdGVyKChmaWxlKSA9PiBmaWxlLmVycm9yKVxuICAgICAgdGhpcy5hZGRSZXN1bHREYXRhKHVwbG9hZElELCB7IHN1Y2Nlc3NmdWwsIGZhaWxlZCwgdXBsb2FkSUQgfSlcbiAgICB9KS50aGVuKCgpID0+IHtcbiAgICAgIC8vIEVtaXQgY29tcGxldGlvbiBldmVudHMuXG4gICAgICAvLyBUaGlzIGlzIGluIGEgc2VwYXJhdGUgZnVuY3Rpb24gc28gdGhhdCB0aGUgYGN1cnJlbnRVcGxvYWRzYCB2YXJpYWJsZVxuICAgICAgLy8gYWx3YXlzIHJlZmVycyB0byB0aGUgbGF0ZXN0IHN0YXRlLiBJbiB0aGUgaGFuZGxlciByaWdodCBhYm92ZSBpdCByZWZlcnNcbiAgICAgIC8vIHRvIGFuIG91dGRhdGVkIG9iamVjdCB3aXRob3V0IHRoZSBgLnJlc3VsdGAgcHJvcGVydHkuXG4gICAgICBjb25zdCB7IGN1cnJlbnRVcGxvYWRzIH0gPSB0aGlzLmdldFN0YXRlKClcbiAgICAgIGlmICghY3VycmVudFVwbG9hZHNbdXBsb2FkSURdKSB7XG4gICAgICAgIHJldHVyblxuICAgICAgfVxuICAgICAgY29uc3QgY3VycmVudFVwbG9hZCA9IGN1cnJlbnRVcGxvYWRzW3VwbG9hZElEXVxuICAgICAgY29uc3QgcmVzdWx0ID0gY3VycmVudFVwbG9hZC5yZXN1bHRcbiAgICAgIHRoaXMuZW1pdCgnY29tcGxldGUnLCByZXN1bHQpXG5cbiAgICAgIHRoaXMuX3JlbW92ZVVwbG9hZCh1cGxvYWRJRClcblxuICAgICAgcmV0dXJuIHJlc3VsdFxuICAgIH0pLnRoZW4oKHJlc3VsdCkgPT4ge1xuICAgICAgaWYgKHJlc3VsdCA9PSBudWxsKSB7XG4gICAgICAgIHRoaXMubG9nKGBOb3Qgc2V0dGluZyByZXN1bHQgZm9yIGFuIHVwbG9hZCB0aGF0IGhhcyBiZWVuIHJlbW92ZWQ6ICR7dXBsb2FkSUR9YClcbiAgICAgIH1cbiAgICAgIHJldHVybiByZXN1bHRcbiAgICB9KVxuICB9XG5cbiAgLyoqXG4gICAqIFN0YXJ0IGFuIHVwbG9hZCBmb3IgYWxsIHRoZSBmaWxlcyB0aGF0IGFyZSBub3QgY3VycmVudGx5IGJlaW5nIHVwbG9hZGVkLlxuICAgKlxuICAgKiBAcmV0dXJucyB7UHJvbWlzZX1cbiAgICovXG4gIHVwbG9hZCAoKSB7XG4gICAgaWYgKCF0aGlzLnBsdWdpbnMudXBsb2FkZXIpIHtcbiAgICAgIHRoaXMubG9nKCdObyB1cGxvYWRlciB0eXBlIHBsdWdpbnMgYXJlIHVzZWQnLCAnd2FybmluZycpXG4gICAgfVxuXG4gICAgbGV0IGZpbGVzID0gdGhpcy5nZXRTdGF0ZSgpLmZpbGVzXG5cbiAgICBjb25zdCBvbkJlZm9yZVVwbG9hZFJlc3VsdCA9IHRoaXMub3B0cy5vbkJlZm9yZVVwbG9hZChmaWxlcylcblxuICAgIGlmIChvbkJlZm9yZVVwbG9hZFJlc3VsdCA9PT0gZmFsc2UpIHtcbiAgICAgIHJldHVybiBQcm9taXNlLnJlamVjdChuZXcgRXJyb3IoJ05vdCBzdGFydGluZyB0aGUgdXBsb2FkIGJlY2F1c2Ugb25CZWZvcmVVcGxvYWQgcmV0dXJuZWQgZmFsc2UnKSlcbiAgICB9XG5cbiAgICBpZiAob25CZWZvcmVVcGxvYWRSZXN1bHQgJiYgdHlwZW9mIG9uQmVmb3JlVXBsb2FkUmVzdWx0ID09PSAnb2JqZWN0Jykge1xuICAgICAgZmlsZXMgPSBvbkJlZm9yZVVwbG9hZFJlc3VsdFxuICAgICAgLy8gVXBkYXRpbmcgZmlsZXMgaW4gc3RhdGUsIGJlY2F1c2UgdXBsb2FkZXIgcGx1Z2lucyByZWNlaXZlIGZpbGUgSURzLFxuICAgICAgLy8gYW5kIHRoZW4gZmV0Y2ggdGhlIGFjdHVhbCBmaWxlIG9iamVjdCBmcm9tIHN0YXRlXG4gICAgICB0aGlzLnNldFN0YXRlKHtcbiAgICAgICAgZmlsZXM6IGZpbGVzXG4gICAgICB9KVxuICAgIH1cblxuICAgIHJldHVybiBQcm9taXNlLnJlc29sdmUoKVxuICAgICAgLnRoZW4oKCkgPT4gdGhpcy5fY2hlY2tNaW5OdW1iZXJPZkZpbGVzKGZpbGVzKSlcbiAgICAgIC5jYXRjaCgoZXJyKSA9PiB7XG4gICAgICAgIHRoaXMuX3Nob3dPckxvZ0Vycm9yQW5kVGhyb3coZXJyKVxuICAgICAgfSlcbiAgICAgIC50aGVuKCgpID0+IHtcbiAgICAgICAgY29uc3QgeyBjdXJyZW50VXBsb2FkcyB9ID0gdGhpcy5nZXRTdGF0ZSgpXG4gICAgICAgIC8vIGdldCBhIGxpc3Qgb2YgZmlsZXMgdGhhdCBhcmUgY3VycmVudGx5IGFzc2lnbmVkIHRvIHVwbG9hZHNcbiAgICAgICAgY29uc3QgY3VycmVudGx5VXBsb2FkaW5nRmlsZXMgPSBPYmplY3Qua2V5cyhjdXJyZW50VXBsb2FkcykucmVkdWNlKChwcmV2LCBjdXJyKSA9PiBwcmV2LmNvbmNhdChjdXJyZW50VXBsb2Fkc1tjdXJyXS5maWxlSURzKSwgW10pXG5cbiAgICAgICAgY29uc3Qgd2FpdGluZ0ZpbGVJRHMgPSBbXVxuICAgICAgICBPYmplY3Qua2V5cyhmaWxlcykuZm9yRWFjaCgoZmlsZUlEKSA9PiB7XG4gICAgICAgICAgY29uc3QgZmlsZSA9IHRoaXMuZ2V0RmlsZShmaWxlSUQpXG4gICAgICAgICAgLy8gaWYgdGhlIGZpbGUgaGFzbid0IHN0YXJ0ZWQgdXBsb2FkaW5nIGFuZCBoYXNuJ3QgYWxyZWFkeSBiZWVuIGFzc2lnbmVkIHRvIGFuIHVwbG9hZC4uXG4gICAgICAgICAgaWYgKCghZmlsZS5wcm9ncmVzcy51cGxvYWRTdGFydGVkKSAmJiAoY3VycmVudGx5VXBsb2FkaW5nRmlsZXMuaW5kZXhPZihmaWxlSUQpID09PSAtMSkpIHtcbiAgICAgICAgICAgIHdhaXRpbmdGaWxlSURzLnB1c2goZmlsZS5pZClcbiAgICAgICAgICB9XG4gICAgICAgIH0pXG5cbiAgICAgICAgY29uc3QgdXBsb2FkSUQgPSB0aGlzLl9jcmVhdGVVcGxvYWQod2FpdGluZ0ZpbGVJRHMpXG4gICAgICAgIHJldHVybiB0aGlzLl9ydW5VcGxvYWQodXBsb2FkSUQpXG4gICAgICB9KVxuICAgICAgLmNhdGNoKChlcnIpID0+IHtcbiAgICAgICAgdGhpcy5fc2hvd09yTG9nRXJyb3JBbmRUaHJvdyhlcnIsIHtcbiAgICAgICAgICBzaG93SW5mb3JtZXI6IGZhbHNlXG4gICAgICAgIH0pXG4gICAgICB9KVxuICB9XG59XG5cbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gKG9wdHMpIHtcbiAgcmV0dXJuIG5ldyBVcHB5KG9wdHMpXG59XG5cbi8vIEV4cG9zZSBjbGFzcyBjb25zdHJ1Y3Rvci5cbm1vZHVsZS5leHBvcnRzLlVwcHkgPSBVcHB5XG5tb2R1bGUuZXhwb3J0cy5QbHVnaW4gPSBQbHVnaW5cbm1vZHVsZS5leHBvcnRzLmRlYnVnTG9nZ2VyID0gZGVidWdMb2dnZXJcbiIsImNvbnN0IGdldFRpbWVTdGFtcCA9IHJlcXVpcmUoJ0B1cHB5L3V0aWxzL2xpYi9nZXRUaW1lU3RhbXAnKVxuXG4vLyBTd2FsbG93IGFsbCBsb2dzLCBleGNlcHQgZXJyb3JzLlxuLy8gZGVmYXVsdCBpZiBsb2dnZXIgaXMgbm90IHNldCBvciBkZWJ1ZzogZmFsc2VcbmNvbnN0IGp1c3RFcnJvcnNMb2dnZXIgPSB7XG4gIGRlYnVnOiAoLi4uYXJncykgPT4ge30sXG4gIHdhcm46ICguLi5hcmdzKSA9PiB7fSxcbiAgZXJyb3I6ICguLi5hcmdzKSA9PiBjb25zb2xlLmVycm9yKGBbVXBweV0gWyR7Z2V0VGltZVN0YW1wKCl9XWAsIC4uLmFyZ3MpXG59XG5cbi8vIFByaW50IGxvZ3MgdG8gY29uc29sZSB3aXRoIG5hbWVzcGFjZSArIHRpbWVzdGFtcCxcbi8vIHNldCBieSBsb2dnZXI6IFVwcHkuZGVidWdMb2dnZXIgb3IgZGVidWc6IHRydWVcbmNvbnN0IGRlYnVnTG9nZ2VyID0ge1xuICBkZWJ1ZzogKC4uLmFyZ3MpID0+IHtcbiAgICAvLyBJRSAxMCBkb2VzbuKAmXQgc3VwcG9ydCBjb25zb2xlLmRlYnVnXG4gICAgY29uc3QgZGVidWcgPSBjb25zb2xlLmRlYnVnIHx8IGNvbnNvbGUubG9nXG4gICAgZGVidWcuY2FsbChjb25zb2xlLCBgW1VwcHldIFske2dldFRpbWVTdGFtcCgpfV1gLCAuLi5hcmdzKVxuICB9LFxuICB3YXJuOiAoLi4uYXJncykgPT4gY29uc29sZS53YXJuKGBbVXBweV0gWyR7Z2V0VGltZVN0YW1wKCl9XWAsIC4uLmFyZ3MpLFxuICBlcnJvcjogKC4uLmFyZ3MpID0+IGNvbnNvbGUuZXJyb3IoYFtVcHB5XSBbJHtnZXRUaW1lU3RhbXAoKX1dYCwgLi4uYXJncylcbn1cblxubW9kdWxlLmV4cG9ydHMgPSB7XG4gIGp1c3RFcnJvcnNMb2dnZXIsXG4gIGRlYnVnTG9nZ2VyXG59XG4iLCIvLyBFZGdlIDE1LnggZG9lcyBub3QgZmlyZSAncHJvZ3Jlc3MnIGV2ZW50cyBvbiB1cGxvYWRzLlxuLy8gU2VlIGh0dHBzOi8vZ2l0aHViLmNvbS90cmFuc2xvYWRpdC91cHB5L2lzc3Vlcy85NDVcbi8vIEFuZCBodHRwczovL2RldmVsb3Blci5taWNyb3NvZnQuY29tL2VuLXVzL21pY3Jvc29mdC1lZGdlL3BsYXRmb3JtL2lzc3Vlcy8xMjIyNDUxMC9cbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gc3VwcG9ydHNVcGxvYWRQcm9ncmVzcyAodXNlckFnZW50KSB7XG4gIC8vIEFsbG93IHBhc3NpbmcgaW4gdXNlckFnZW50IGZvciB0ZXN0c1xuICBpZiAodXNlckFnZW50ID09IG51bGwpIHtcbiAgICB1c2VyQWdlbnQgPSB0eXBlb2YgbmF2aWdhdG9yICE9PSAndW5kZWZpbmVkJyA/IG5hdmlnYXRvci51c2VyQWdlbnQgOiBudWxsXG4gIH1cbiAgLy8gQXNzdW1lIGl0IHdvcmtzIGJlY2F1c2UgYmFzaWNhbGx5IGV2ZXJ5dGhpbmcgc3VwcG9ydHMgcHJvZ3Jlc3MgZXZlbnRzLlxuICBpZiAoIXVzZXJBZ2VudCkgcmV0dXJuIHRydWVcblxuICBjb25zdCBtID0gL0VkZ2VcXC8oXFxkK1xcLlxcZCspLy5leGVjKHVzZXJBZ2VudClcbiAgaWYgKCFtKSByZXR1cm4gdHJ1ZVxuXG4gIGNvbnN0IGVkZ2VWZXJzaW9uID0gbVsxXVxuICBsZXQgW21ham9yLCBtaW5vcl0gPSBlZGdlVmVyc2lvbi5zcGxpdCgnLicpXG4gIG1ham9yID0gcGFyc2VJbnQobWFqb3IsIDEwKVxuICBtaW5vciA9IHBhcnNlSW50KG1pbm9yLCAxMClcblxuICAvLyBXb3JrZWQgYmVmb3JlOlxuICAvLyBFZGdlIDQwLjE1MDYzLjAuMFxuICAvLyBNaWNyb3NvZnQgRWRnZUhUTUwgMTUuMTUwNjNcbiAgaWYgKG1ham9yIDwgMTUgfHwgKG1ham9yID09PSAxNSAmJiBtaW5vciA8IDE1MDYzKSkge1xuICAgIHJldHVybiB0cnVlXG4gIH1cblxuICAvLyBGaXhlZCBpbjpcbiAgLy8gTWljcm9zb2Z0IEVkZ2VIVE1MIDE4LjE4MjE4XG4gIGlmIChtYWpvciA+IDE4IHx8IChtYWpvciA9PT0gMTggJiYgbWlub3IgPj0gMTgyMTgpKSB7XG4gICAgcmV0dXJuIHRydWVcbiAgfVxuXG4gIC8vIG90aGVyIHZlcnNpb25zIGRvbid0IHdvcmsuXG4gIHJldHVybiBmYWxzZVxufVxuIiwibW9kdWxlLmV4cG9ydHM9e1xuICBcIm5hbWVcIjogXCJAdXBweS9maWxlLWlucHV0XCIsXG4gIFwiZGVzY3JpcHRpb25cIjogXCJTaW1wbGUgVUkgb2YgYSBmaWxlIGlucHV0IGJ1dHRvbiB0aGF0IHdvcmtzIHdpdGggVXBweSByaWdodCBvdXQgb2YgdGhlIGJveFwiLFxuICBcInZlcnNpb25cIjogXCIxLjQuMThcIixcbiAgXCJsaWNlbnNlXCI6IFwiTUlUXCIsXG4gIFwibWFpblwiOiBcImxpYi9pbmRleC5qc1wiLFxuICBcInN0eWxlXCI6IFwiZGlzdC9zdHlsZS5taW4uY3NzXCIsXG4gIFwidHlwZXNcIjogXCJ0eXBlcy9pbmRleC5kLnRzXCIsXG4gIFwia2V5d29yZHNcIjogW1xuICAgIFwiZmlsZSB1cGxvYWRlclwiLFxuICAgIFwidXBsb2FkXCIsXG4gICAgXCJ1cHB5XCIsXG4gICAgXCJ1cHB5LXBsdWdpblwiLFxuICAgIFwiZmlsZS1pbnB1dFwiXG4gIF0sXG4gIFwiaG9tZXBhZ2VcIjogXCJodHRwczovL3VwcHkuaW9cIixcbiAgXCJidWdzXCI6IHtcbiAgICBcInVybFwiOiBcImh0dHBzOi8vZ2l0aHViLmNvbS90cmFuc2xvYWRpdC91cHB5L2lzc3Vlc1wiXG4gIH0sXG4gIFwicmVwb3NpdG9yeVwiOiB7XG4gICAgXCJ0eXBlXCI6IFwiZ2l0XCIsXG4gICAgXCJ1cmxcIjogXCJnaXQraHR0cHM6Ly9naXRodWIuY29tL3RyYW5zbG9hZGl0L3VwcHkuZ2l0XCJcbiAgfSxcbiAgXCJkZXBlbmRlbmNpZXNcIjoge1xuICAgIFwiQHVwcHkvdXRpbHNcIjogXCJmaWxlOi4uL3V0aWxzXCIsXG4gICAgXCJwcmVhY3RcIjogXCI4LjIuOVwiXG4gIH0sXG4gIFwicGVlckRlcGVuZGVuY2llc1wiOiB7XG4gICAgXCJAdXBweS9jb3JlXCI6IFwiXjEuMC4wXCJcbiAgfVxufVxuIiwiY29uc3QgeyBQbHVnaW4gfSA9IHJlcXVpcmUoJ0B1cHB5L2NvcmUnKVxuY29uc3QgdG9BcnJheSA9IHJlcXVpcmUoJ0B1cHB5L3V0aWxzL2xpYi90b0FycmF5JylcbmNvbnN0IFRyYW5zbGF0b3IgPSByZXF1aXJlKCdAdXBweS91dGlscy9saWIvVHJhbnNsYXRvcicpXG5jb25zdCB7IGggfSA9IHJlcXVpcmUoJ3ByZWFjdCcpXG5cbm1vZHVsZS5leHBvcnRzID0gY2xhc3MgRmlsZUlucHV0IGV4dGVuZHMgUGx1Z2luIHtcbiAgc3RhdGljIFZFUlNJT04gPSByZXF1aXJlKCcuLi9wYWNrYWdlLmpzb24nKS52ZXJzaW9uXG5cbiAgY29uc3RydWN0b3IgKHVwcHksIG9wdHMpIHtcbiAgICBzdXBlcih1cHB5LCBvcHRzKVxuICAgIHRoaXMuaWQgPSB0aGlzLm9wdHMuaWQgfHwgJ0ZpbGVJbnB1dCdcbiAgICB0aGlzLnRpdGxlID0gJ0ZpbGUgSW5wdXQnXG4gICAgdGhpcy50eXBlID0gJ2FjcXVpcmVyJ1xuXG4gICAgdGhpcy5kZWZhdWx0TG9jYWxlID0ge1xuICAgICAgc3RyaW5nczoge1xuICAgICAgICAvLyBUaGUgc2FtZSBrZXkgaXMgdXNlZCBmb3IgdGhlIHNhbWUgcHVycG9zZSBieSBAdXBweS9yb2JvZG9nJ3MgYGZvcm0oKWAgQVBJLCBidXQgb3VyXG4gICAgICAgIC8vIGxvY2FsZSBwYWNrIHNjcmlwdHMgY2FuJ3QgYWNjZXNzIGl0IGluIFJvYm9kb2cuIElmIGl0IGlzIHVwZGF0ZWQgaGVyZSwgaXQgc2hvdWxkXG4gICAgICAgIC8vIGFsc28gYmUgdXBkYXRlZCB0aGVyZSFcbiAgICAgICAgY2hvb3NlRmlsZXM6ICdDaG9vc2UgZmlsZXMnXG4gICAgICB9XG4gICAgfVxuXG4gICAgLy8gRGVmYXVsdCBvcHRpb25zXG4gICAgY29uc3QgZGVmYXVsdE9wdGlvbnMgPSB7XG4gICAgICB0YXJnZXQ6IG51bGwsXG4gICAgICBwcmV0dHk6IHRydWUsXG4gICAgICBpbnB1dE5hbWU6ICdmaWxlc1tdJ1xuICAgIH1cblxuICAgIC8vIE1lcmdlIGRlZmF1bHQgb3B0aW9ucyB3aXRoIHRoZSBvbmVzIHNldCBieSB1c2VyXG4gICAgdGhpcy5vcHRzID0geyAuLi5kZWZhdWx0T3B0aW9ucywgLi4ub3B0cyB9XG5cbiAgICB0aGlzLmkxOG5Jbml0KClcblxuICAgIHRoaXMucmVuZGVyID0gdGhpcy5yZW5kZXIuYmluZCh0aGlzKVxuICAgIHRoaXMuaGFuZGxlSW5wdXRDaGFuZ2UgPSB0aGlzLmhhbmRsZUlucHV0Q2hhbmdlLmJpbmQodGhpcylcbiAgICB0aGlzLmhhbmRsZUNsaWNrID0gdGhpcy5oYW5kbGVDbGljay5iaW5kKHRoaXMpXG4gIH1cblxuICBzZXRPcHRpb25zIChuZXdPcHRzKSB7XG4gICAgc3VwZXIuc2V0T3B0aW9ucyhuZXdPcHRzKVxuICAgIHRoaXMuaTE4bkluaXQoKVxuICB9XG5cbiAgaTE4bkluaXQgKCkge1xuICAgIHRoaXMudHJhbnNsYXRvciA9IG5ldyBUcmFuc2xhdG9yKFt0aGlzLmRlZmF1bHRMb2NhbGUsIHRoaXMudXBweS5sb2NhbGUsIHRoaXMub3B0cy5sb2NhbGVdKVxuICAgIHRoaXMuaTE4biA9IHRoaXMudHJhbnNsYXRvci50cmFuc2xhdGUuYmluZCh0aGlzLnRyYW5zbGF0b3IpXG4gICAgdGhpcy5pMThuQXJyYXkgPSB0aGlzLnRyYW5zbGF0b3IudHJhbnNsYXRlQXJyYXkuYmluZCh0aGlzLnRyYW5zbGF0b3IpXG4gICAgdGhpcy5zZXRQbHVnaW5TdGF0ZSgpIC8vIHNvIHRoYXQgVUkgcmUtcmVuZGVycyBhbmQgd2Ugc2VlIHRoZSB1cGRhdGVkIGxvY2FsZVxuICB9XG5cbiAgYWRkRmlsZXMgKGZpbGVzKSB7XG4gICAgY29uc3QgZGVzY3JpcHRvcnMgPSBmaWxlcy5tYXAoKGZpbGUpID0+ICh7XG4gICAgICBzb3VyY2U6IHRoaXMuaWQsXG4gICAgICBuYW1lOiBmaWxlLm5hbWUsXG4gICAgICB0eXBlOiBmaWxlLnR5cGUsXG4gICAgICBkYXRhOiBmaWxlXG4gICAgfSkpXG5cbiAgICB0cnkge1xuICAgICAgdGhpcy51cHB5LmFkZEZpbGVzKGRlc2NyaXB0b3JzKVxuICAgIH0gY2F0Y2ggKGVycikge1xuICAgICAgdGhpcy51cHB5LmxvZyhlcnIpXG4gICAgfVxuICB9XG5cbiAgaGFuZGxlSW5wdXRDaGFuZ2UgKGV2ZW50KSB7XG4gICAgdGhpcy51cHB5LmxvZygnW0ZpbGVJbnB1dF0gU29tZXRoaW5nIHNlbGVjdGVkIHRocm91Z2ggaW5wdXQuLi4nKVxuICAgIGNvbnN0IGZpbGVzID0gdG9BcnJheShldmVudC50YXJnZXQuZmlsZXMpXG4gICAgdGhpcy5hZGRGaWxlcyhmaWxlcylcblxuICAgIC8vIFdlIGNsZWFyIHRoZSBpbnB1dCBhZnRlciBhIGZpbGUgaXMgc2VsZWN0ZWQsIGJlY2F1c2Ugb3RoZXJ3aXNlXG4gICAgLy8gY2hhbmdlIGV2ZW50IGlzIG5vdCBmaXJlZCBpbiBDaHJvbWUgYW5kIFNhZmFyaSB3aGVuIGEgZmlsZVxuICAgIC8vIHdpdGggdGhlIHNhbWUgbmFtZSBpcyBzZWxlY3RlZC5cbiAgICAvLyBfX19XaHkgbm90IHVzZSB2YWx1ZT1cIlwiIG9uIDxpbnB1dC8+IGluc3RlYWQ/XG4gICAgLy8gICAgQmVjYXVzZSBpZiB3ZSB1c2UgdGhhdCBtZXRob2Qgb2YgY2xlYXJpbmcgdGhlIGlucHV0LFxuICAgIC8vICAgIENocm9tZSB3aWxsIG5vdCB0cmlnZ2VyIGNoYW5nZSBpZiB3ZSBkcm9wIHRoZSBzYW1lIGZpbGUgdHdpY2UgKElzc3VlICM3NjgpLlxuICAgIGV2ZW50LnRhcmdldC52YWx1ZSA9IG51bGxcbiAgfVxuXG4gIGhhbmRsZUNsaWNrIChldikge1xuICAgIHRoaXMuaW5wdXQuY2xpY2soKVxuICB9XG5cbiAgcmVuZGVyIChzdGF0ZSkge1xuICAgIC8qIGh0dHA6Ly90eW1wYW51cy5uZXQvY29kcm9wcy8yMDE1LzA5LzE1L3N0eWxpbmctY3VzdG9taXppbmctZmlsZS1pbnB1dHMtc21hcnQtd2F5LyAqL1xuICAgIGNvbnN0IGhpZGRlbklucHV0U3R5bGUgPSB7XG4gICAgICB3aWR0aDogJzAuMXB4JyxcbiAgICAgIGhlaWdodDogJzAuMXB4JyxcbiAgICAgIG9wYWNpdHk6IDAsXG4gICAgICBvdmVyZmxvdzogJ2hpZGRlbicsXG4gICAgICBwb3NpdGlvbjogJ2Fic29sdXRlJyxcbiAgICAgIHpJbmRleDogLTFcbiAgICB9XG5cbiAgICBjb25zdCByZXN0cmljdGlvbnMgPSB0aGlzLnVwcHkub3B0cy5yZXN0cmljdGlvbnNcbiAgICBjb25zdCBhY2NlcHQgPSByZXN0cmljdGlvbnMuYWxsb3dlZEZpbGVUeXBlcyA/IHJlc3RyaWN0aW9ucy5hbGxvd2VkRmlsZVR5cGVzLmpvaW4oJywnKSA6IG51bGxcblxuICAgIHJldHVybiAoXG4gICAgICA8ZGl2IGNsYXNzPVwidXBweS1Sb290IHVwcHktRmlsZUlucHV0LWNvbnRhaW5lclwiPlxuICAgICAgICA8aW5wdXRcbiAgICAgICAgICBjbGFzcz1cInVwcHktRmlsZUlucHV0LWlucHV0XCJcbiAgICAgICAgICBzdHlsZT17dGhpcy5vcHRzLnByZXR0eSAmJiBoaWRkZW5JbnB1dFN0eWxlfVxuICAgICAgICAgIHR5cGU9XCJmaWxlXCJcbiAgICAgICAgICBuYW1lPXt0aGlzLm9wdHMuaW5wdXROYW1lfVxuICAgICAgICAgIG9uY2hhbmdlPXt0aGlzLmhhbmRsZUlucHV0Q2hhbmdlfVxuICAgICAgICAgIG11bHRpcGxlPXtyZXN0cmljdGlvbnMubWF4TnVtYmVyT2ZGaWxlcyAhPT0gMX1cbiAgICAgICAgICBhY2NlcHQ9e2FjY2VwdH1cbiAgICAgICAgICByZWY9eyhpbnB1dCkgPT4geyB0aGlzLmlucHV0ID0gaW5wdXQgfX1cbiAgICAgICAgLz5cbiAgICAgICAge3RoaXMub3B0cy5wcmV0dHkgJiZcbiAgICAgICAgICA8YnV0dG9uXG4gICAgICAgICAgICBjbGFzcz1cInVwcHktRmlsZUlucHV0LWJ0blwiXG4gICAgICAgICAgICB0eXBlPVwiYnV0dG9uXCJcbiAgICAgICAgICAgIG9uY2xpY2s9e3RoaXMuaGFuZGxlQ2xpY2t9XG4gICAgICAgICAgPlxuICAgICAgICAgICAge3RoaXMuaTE4bignY2hvb3NlRmlsZXMnKX1cbiAgICAgICAgICA8L2J1dHRvbj59XG4gICAgICA8L2Rpdj5cbiAgICApXG4gIH1cblxuICBpbnN0YWxsICgpIHtcbiAgICBjb25zdCB0YXJnZXQgPSB0aGlzLm9wdHMudGFyZ2V0XG4gICAgaWYgKHRhcmdldCkge1xuICAgICAgdGhpcy5tb3VudCh0YXJnZXQsIHRoaXMpXG4gICAgfVxuICB9XG5cbiAgdW5pbnN0YWxsICgpIHtcbiAgICB0aGlzLnVubW91bnQoKVxuICB9XG59XG4iLCJtb2R1bGUuZXhwb3J0cz17XG4gIFwibmFtZVwiOiBcIkB1cHB5L3Byb2dyZXNzLWJhclwiLFxuICBcImRlc2NyaXB0aW9uXCI6IFwiQSBwcm9ncmVzcyBiYXIgVUkgZm9yIFVwcHlcIixcbiAgXCJ2ZXJzaW9uXCI6IFwiMS4zLjIwXCIsXG4gIFwibGljZW5zZVwiOiBcIk1JVFwiLFxuICBcIm1haW5cIjogXCJsaWIvaW5kZXguanNcIixcbiAgXCJzdHlsZVwiOiBcImRpc3Qvc3R5bGUubWluLmNzc1wiLFxuICBcInR5cGVzXCI6IFwidHlwZXMvaW5kZXguZC50c1wiLFxuICBcImtleXdvcmRzXCI6IFtcbiAgICBcImZpbGUgdXBsb2FkZXJcIixcbiAgICBcInVwcHlcIixcbiAgICBcInVwcHktcGx1Z2luXCIsXG4gICAgXCJwcm9ncmVzc1wiLFxuICAgIFwicHJvZ3Jlc3MgYmFyXCIsXG4gICAgXCJ1cGxvYWQgcHJvZ3Jlc3NcIlxuICBdLFxuICBcImhvbWVwYWdlXCI6IFwiaHR0cHM6Ly91cHB5LmlvXCIsXG4gIFwiYnVnc1wiOiB7XG4gICAgXCJ1cmxcIjogXCJodHRwczovL2dpdGh1Yi5jb20vdHJhbnNsb2FkaXQvdXBweS9pc3N1ZXNcIlxuICB9LFxuICBcInJlcG9zaXRvcnlcIjoge1xuICAgIFwidHlwZVwiOiBcImdpdFwiLFxuICAgIFwidXJsXCI6IFwiZ2l0K2h0dHBzOi8vZ2l0aHViLmNvbS90cmFuc2xvYWRpdC91cHB5LmdpdFwiXG4gIH0sXG4gIFwiZGVwZW5kZW5jaWVzXCI6IHtcbiAgICBcIkB1cHB5L3V0aWxzXCI6IFwiZmlsZTouLi91dGlsc1wiLFxuICAgIFwicHJlYWN0XCI6IFwiOC4yLjlcIlxuICB9LFxuICBcInBlZXJEZXBlbmRlbmNpZXNcIjoge1xuICAgIFwiQHVwcHkvY29yZVwiOiBcIl4xLjAuMFwiXG4gIH1cbn1cbiIsImNvbnN0IHsgUGx1Z2luIH0gPSByZXF1aXJlKCdAdXBweS9jb3JlJylcbmNvbnN0IHsgaCB9ID0gcmVxdWlyZSgncHJlYWN0JylcblxuLyoqXG4gKiBQcm9ncmVzcyBiYXJcbiAqXG4gKi9cbm1vZHVsZS5leHBvcnRzID0gY2xhc3MgUHJvZ3Jlc3NCYXIgZXh0ZW5kcyBQbHVnaW4ge1xuICBzdGF0aWMgVkVSU0lPTiA9IHJlcXVpcmUoJy4uL3BhY2thZ2UuanNvbicpLnZlcnNpb25cblxuICBjb25zdHJ1Y3RvciAodXBweSwgb3B0cykge1xuICAgIHN1cGVyKHVwcHksIG9wdHMpXG4gICAgdGhpcy5pZCA9IHRoaXMub3B0cy5pZCB8fCAnUHJvZ3Jlc3NCYXInXG4gICAgdGhpcy50aXRsZSA9ICdQcm9ncmVzcyBCYXInXG4gICAgdGhpcy50eXBlID0gJ3Byb2dyZXNzaW5kaWNhdG9yJ1xuXG4gICAgLy8gc2V0IGRlZmF1bHQgb3B0aW9uc1xuICAgIGNvbnN0IGRlZmF1bHRPcHRpb25zID0ge1xuICAgICAgdGFyZ2V0OiAnYm9keScsXG4gICAgICByZXBsYWNlVGFyZ2V0Q29udGVudDogZmFsc2UsXG4gICAgICBmaXhlZDogZmFsc2UsXG4gICAgICBoaWRlQWZ0ZXJGaW5pc2g6IHRydWVcbiAgICB9XG5cbiAgICAvLyBtZXJnZSBkZWZhdWx0IG9wdGlvbnMgd2l0aCB0aGUgb25lcyBzZXQgYnkgdXNlclxuICAgIHRoaXMub3B0cyA9IE9iamVjdC5hc3NpZ24oe30sIGRlZmF1bHRPcHRpb25zLCBvcHRzKVxuXG4gICAgdGhpcy5yZW5kZXIgPSB0aGlzLnJlbmRlci5iaW5kKHRoaXMpXG4gIH1cblxuICByZW5kZXIgKHN0YXRlKSB7XG4gICAgY29uc3QgcHJvZ3Jlc3MgPSBzdGF0ZS50b3RhbFByb2dyZXNzIHx8IDBcbiAgICAvLyBiZWZvcmUgc3RhcnRpbmcgYW5kIGFmdGVyIGZpbmlzaCBzaG91bGQgYmUgaGlkZGVuIGlmIHNwZWNpZmllZCBpbiB0aGUgb3B0aW9uc1xuICAgIGNvbnN0IGlzSGlkZGVuID0gKHByb2dyZXNzID09PSAwIHx8IHByb2dyZXNzID09PSAxMDApICYmIHRoaXMub3B0cy5oaWRlQWZ0ZXJGaW5pc2hcbiAgICByZXR1cm4gKFxuICAgICAgPGRpdlxuICAgICAgICBjbGFzcz1cInVwcHkgdXBweS1Qcm9ncmVzc0JhclwiXG4gICAgICAgIHN0eWxlPXt7IHBvc2l0aW9uOiB0aGlzLm9wdHMuZml4ZWQgPyAnZml4ZWQnIDogJ2luaXRpYWwnIH19XG4gICAgICAgIGFyaWEtaGlkZGVuPXtpc0hpZGRlbn1cbiAgICAgID5cbiAgICAgICAgPGRpdiBjbGFzcz1cInVwcHktUHJvZ3Jlc3NCYXItaW5uZXJcIiBzdHlsZT17eyB3aWR0aDogcHJvZ3Jlc3MgKyAnJScgfX0gLz5cbiAgICAgICAgPGRpdiBjbGFzcz1cInVwcHktUHJvZ3Jlc3NCYXItcGVyY2VudGFnZVwiPntwcm9ncmVzc308L2Rpdj5cbiAgICAgIDwvZGl2PlxuICAgIClcbiAgfVxuXG4gIGluc3RhbGwgKCkge1xuICAgIGNvbnN0IHRhcmdldCA9IHRoaXMub3B0cy50YXJnZXRcbiAgICBpZiAodGFyZ2V0KSB7XG4gICAgICB0aGlzLm1vdW50KHRhcmdldCwgdGhpcylcbiAgICB9XG4gIH1cblxuICB1bmluc3RhbGwgKCkge1xuICAgIHRoaXMudW5tb3VudCgpXG4gIH1cbn1cbiIsIm1vZHVsZS5leHBvcnRzPXtcbiAgXCJuYW1lXCI6IFwiQHVwcHkvc3RvcmUtZGVmYXVsdFwiLFxuICBcImRlc2NyaXB0aW9uXCI6IFwiVGhlIGRlZmF1bHQgc2ltcGxlIG9iamVjdC1iYXNlZCBzdG9yZSBmb3IgVXBweS5cIixcbiAgXCJ2ZXJzaW9uXCI6IFwiMS4yLjRcIixcbiAgXCJsaWNlbnNlXCI6IFwiTUlUXCIsXG4gIFwibWFpblwiOiBcImxpYi9pbmRleC5qc1wiLFxuICBcInR5cGVzXCI6IFwidHlwZXMvaW5kZXguZC50c1wiLFxuICBcImtleXdvcmRzXCI6IFtcbiAgICBcImZpbGUgdXBsb2FkZXJcIixcbiAgICBcInVwcHlcIixcbiAgICBcInVwcHktc3RvcmVcIlxuICBdLFxuICBcImhvbWVwYWdlXCI6IFwiaHR0cHM6Ly91cHB5LmlvXCIsXG4gIFwiYnVnc1wiOiB7XG4gICAgXCJ1cmxcIjogXCJodHRwczovL2dpdGh1Yi5jb20vdHJhbnNsb2FkaXQvdXBweS9pc3N1ZXNcIlxuICB9LFxuICBcInJlcG9zaXRvcnlcIjoge1xuICAgIFwidHlwZVwiOiBcImdpdFwiLFxuICAgIFwidXJsXCI6IFwiZ2l0K2h0dHBzOi8vZ2l0aHViLmNvbS90cmFuc2xvYWRpdC91cHB5LmdpdFwiXG4gIH1cbn1cbiIsIi8qKlxuICogRGVmYXVsdCBzdG9yZSB0aGF0IGtlZXBzIHN0YXRlIGluIGEgc2ltcGxlIG9iamVjdC5cbiAqL1xuY2xhc3MgRGVmYXVsdFN0b3JlIHtcbiAgc3RhdGljIFZFUlNJT04gPSByZXF1aXJlKCcuLi9wYWNrYWdlLmpzb24nKS52ZXJzaW9uXG5cbiAgY29uc3RydWN0b3IgKCkge1xuICAgIHRoaXMuc3RhdGUgPSB7fVxuICAgIHRoaXMuY2FsbGJhY2tzID0gW11cbiAgfVxuXG4gIGdldFN0YXRlICgpIHtcbiAgICByZXR1cm4gdGhpcy5zdGF0ZVxuICB9XG5cbiAgc2V0U3RhdGUgKHBhdGNoKSB7XG4gICAgY29uc3QgcHJldlN0YXRlID0gT2JqZWN0LmFzc2lnbih7fSwgdGhpcy5zdGF0ZSlcbiAgICBjb25zdCBuZXh0U3RhdGUgPSBPYmplY3QuYXNzaWduKHt9LCB0aGlzLnN0YXRlLCBwYXRjaClcblxuICAgIHRoaXMuc3RhdGUgPSBuZXh0U3RhdGVcbiAgICB0aGlzLl9wdWJsaXNoKHByZXZTdGF0ZSwgbmV4dFN0YXRlLCBwYXRjaClcbiAgfVxuXG4gIHN1YnNjcmliZSAobGlzdGVuZXIpIHtcbiAgICB0aGlzLmNhbGxiYWNrcy5wdXNoKGxpc3RlbmVyKVxuICAgIHJldHVybiAoKSA9PiB7XG4gICAgICAvLyBSZW1vdmUgdGhlIGxpc3RlbmVyLlxuICAgICAgdGhpcy5jYWxsYmFja3Muc3BsaWNlKFxuICAgICAgICB0aGlzLmNhbGxiYWNrcy5pbmRleE9mKGxpc3RlbmVyKSxcbiAgICAgICAgMVxuICAgICAgKVxuICAgIH1cbiAgfVxuXG4gIF9wdWJsaXNoICguLi5hcmdzKSB7XG4gICAgdGhpcy5jYWxsYmFja3MuZm9yRWFjaCgobGlzdGVuZXIpID0+IHtcbiAgICAgIGxpc3RlbmVyKC4uLmFyZ3MpXG4gICAgfSlcbiAgfVxufVxuXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIGRlZmF1bHRTdG9yZSAoKSB7XG4gIHJldHVybiBuZXcgRGVmYXVsdFN0b3JlKClcbn1cbiIsIi8qKlxuICogQ3JlYXRlIGEgd3JhcHBlciBhcm91bmQgYW4gZXZlbnQgZW1pdHRlciB3aXRoIGEgYHJlbW92ZWAgbWV0aG9kIHRvIHJlbW92ZVxuICogYWxsIGV2ZW50cyB0aGF0IHdlcmUgYWRkZWQgdXNpbmcgdGhlIHdyYXBwZWQgZW1pdHRlci5cbiAqL1xubW9kdWxlLmV4cG9ydHMgPSBjbGFzcyBFdmVudFRyYWNrZXIge1xuICBjb25zdHJ1Y3RvciAoZW1pdHRlcikge1xuICAgIHRoaXMuX2V2ZW50cyA9IFtdXG4gICAgdGhpcy5fZW1pdHRlciA9IGVtaXR0ZXJcbiAgfVxuXG4gIG9uIChldmVudCwgZm4pIHtcbiAgICB0aGlzLl9ldmVudHMucHVzaChbZXZlbnQsIGZuXSlcbiAgICByZXR1cm4gdGhpcy5fZW1pdHRlci5vbihldmVudCwgZm4pXG4gIH1cblxuICByZW1vdmUgKCkge1xuICAgIHRoaXMuX2V2ZW50cy5mb3JFYWNoKChbZXZlbnQsIGZuXSkgPT4ge1xuICAgICAgdGhpcy5fZW1pdHRlci5vZmYoZXZlbnQsIGZuKVxuICAgIH0pXG4gIH1cbn1cbiIsImNsYXNzIE5ldHdvcmtFcnJvciBleHRlbmRzIEVycm9yIHtcbiAgY29uc3RydWN0b3IgKGVycm9yLCB4aHIgPSBudWxsKSB7XG4gICAgc3VwZXIoYFRoaXMgbG9va3MgbGlrZSBhIG5ldHdvcmsgZXJyb3IsIHRoZSBlbmRwb2ludCBtaWdodCBiZSBibG9ja2VkIGJ5IGFuIGludGVybmV0IHByb3ZpZGVyIG9yIGEgZmlyZXdhbGwuXFxuXFxuU291cmNlIGVycm9yOiBbJHtlcnJvcn1dYClcblxuICAgIHRoaXMuaXNOZXR3b3JrRXJyb3IgPSB0cnVlXG4gICAgdGhpcy5yZXF1ZXN0ID0geGhyXG4gIH1cbn1cblxubW9kdWxlLmV4cG9ydHMgPSBOZXR3b3JrRXJyb3JcbiIsIi8qKlxuICogSGVscGVyIHRvIGFib3J0IHVwbG9hZCByZXF1ZXN0cyBpZiB0aGVyZSBoYXMgbm90IGJlZW4gYW55IHByb2dyZXNzIGZvciBgdGltZW91dGAgbXMuXG4gKiBDcmVhdGUgYW4gaW5zdGFuY2UgdXNpbmcgYHRpbWVyID0gbmV3IFByb2dyZXNzVGltZW91dCgxMDAwMCwgb25UaW1lb3V0KWBcbiAqIENhbGwgYHRpbWVyLnByb2dyZXNzKClgIHRvIHNpZ25hbCB0aGF0IHRoZXJlIGhhcyBiZWVuIHByb2dyZXNzIG9mIGFueSBraW5kLlxuICogQ2FsbCBgdGltZXIuZG9uZSgpYCB3aGVuIHRoZSB1cGxvYWQgaGFzIGNvbXBsZXRlZC5cbiAqL1xuY2xhc3MgUHJvZ3Jlc3NUaW1lb3V0IHtcbiAgY29uc3RydWN0b3IgKHRpbWVvdXQsIHRpbWVvdXRIYW5kbGVyKSB7XG4gICAgdGhpcy5fdGltZW91dCA9IHRpbWVvdXRcbiAgICB0aGlzLl9vblRpbWVkT3V0ID0gdGltZW91dEhhbmRsZXJcbiAgICB0aGlzLl9pc0RvbmUgPSBmYWxzZVxuICAgIHRoaXMuX2FsaXZlVGltZXIgPSBudWxsXG4gICAgdGhpcy5fb25UaW1lZE91dCA9IHRoaXMuX29uVGltZWRPdXQuYmluZCh0aGlzKVxuICB9XG5cbiAgcHJvZ3Jlc3MgKCkge1xuICAgIC8vIFNvbWUgYnJvd3NlcnMgZmlyZSBhbm90aGVyIHByb2dyZXNzIGV2ZW50IHdoZW4gdGhlIHVwbG9hZCBpc1xuICAgIC8vIGNhbmNlbGxlZCwgc28gd2UgaGF2ZSB0byBpZ25vcmUgcHJvZ3Jlc3MgYWZ0ZXIgdGhlIHRpbWVyIHdhc1xuICAgIC8vIHRvbGQgdG8gc3RvcC5cbiAgICBpZiAodGhpcy5faXNEb25lKSByZXR1cm5cblxuICAgIGlmICh0aGlzLl90aW1lb3V0ID4gMCkge1xuICAgICAgaWYgKHRoaXMuX2FsaXZlVGltZXIpIGNsZWFyVGltZW91dCh0aGlzLl9hbGl2ZVRpbWVyKVxuICAgICAgdGhpcy5fYWxpdmVUaW1lciA9IHNldFRpbWVvdXQodGhpcy5fb25UaW1lZE91dCwgdGhpcy5fdGltZW91dClcbiAgICB9XG4gIH1cblxuICBkb25lICgpIHtcbiAgICBpZiAodGhpcy5fYWxpdmVUaW1lcikge1xuICAgICAgY2xlYXJUaW1lb3V0KHRoaXMuX2FsaXZlVGltZXIpXG4gICAgICB0aGlzLl9hbGl2ZVRpbWVyID0gbnVsbFxuICAgIH1cbiAgICB0aGlzLl9pc0RvbmUgPSB0cnVlXG4gIH1cbn1cblxubW9kdWxlLmV4cG9ydHMgPSBQcm9ncmVzc1RpbWVvdXRcbiIsIi8qKlxuICogQXJyYXkucHJvdG90eXBlLmZpbmRJbmRleCBwb255ZmlsbCBmb3Igb2xkIGJyb3dzZXJzLlxuICovXG5mdW5jdGlvbiBmaW5kSW5kZXggKGFycmF5LCBwcmVkaWNhdGUpIHtcbiAgZm9yIChsZXQgaSA9IDA7IGkgPCBhcnJheS5sZW5ndGg7IGkrKykge1xuICAgIGlmIChwcmVkaWNhdGUoYXJyYXlbaV0pKSByZXR1cm4gaVxuICB9XG4gIHJldHVybiAtMVxufVxuXG5mdW5jdGlvbiBjcmVhdGVDYW5jZWxFcnJvciAoKSB7XG4gIHJldHVybiBuZXcgRXJyb3IoJ0NhbmNlbGxlZCcpXG59XG5cbm1vZHVsZS5leHBvcnRzID0gY2xhc3MgUmF0ZUxpbWl0ZWRRdWV1ZSB7XG4gIGNvbnN0cnVjdG9yIChsaW1pdCkge1xuICAgIGlmICh0eXBlb2YgbGltaXQgIT09ICdudW1iZXInIHx8IGxpbWl0ID09PSAwKSB7XG4gICAgICB0aGlzLmxpbWl0ID0gSW5maW5pdHlcbiAgICB9IGVsc2Uge1xuICAgICAgdGhpcy5saW1pdCA9IGxpbWl0XG4gICAgfVxuXG4gICAgdGhpcy5hY3RpdmVSZXF1ZXN0cyA9IDBcbiAgICB0aGlzLnF1ZXVlZEhhbmRsZXJzID0gW11cbiAgfVxuXG4gIF9jYWxsIChmbikge1xuICAgIHRoaXMuYWN0aXZlUmVxdWVzdHMgKz0gMVxuXG4gICAgbGV0IGRvbmUgPSBmYWxzZVxuXG4gICAgbGV0IGNhbmNlbEFjdGl2ZVxuICAgIHRyeSB7XG4gICAgICBjYW5jZWxBY3RpdmUgPSBmbigpXG4gICAgfSBjYXRjaCAoZXJyKSB7XG4gICAgICB0aGlzLmFjdGl2ZVJlcXVlc3RzIC09IDFcbiAgICAgIHRocm93IGVyclxuICAgIH1cblxuICAgIHJldHVybiB7XG4gICAgICBhYm9ydDogKCkgPT4ge1xuICAgICAgICBpZiAoZG9uZSkgcmV0dXJuXG4gICAgICAgIGRvbmUgPSB0cnVlXG4gICAgICAgIHRoaXMuYWN0aXZlUmVxdWVzdHMgLT0gMVxuICAgICAgICBjYW5jZWxBY3RpdmUoKVxuICAgICAgICB0aGlzLl9xdWV1ZU5leHQoKVxuICAgICAgfSxcblxuICAgICAgZG9uZTogKCkgPT4ge1xuICAgICAgICBpZiAoZG9uZSkgcmV0dXJuXG4gICAgICAgIGRvbmUgPSB0cnVlXG4gICAgICAgIHRoaXMuYWN0aXZlUmVxdWVzdHMgLT0gMVxuICAgICAgICB0aGlzLl9xdWV1ZU5leHQoKVxuICAgICAgfVxuICAgIH1cbiAgfVxuXG4gIF9xdWV1ZU5leHQgKCkge1xuICAgIC8vIERvIGl0IHNvb24gYnV0IG5vdCBpbW1lZGlhdGVseSwgdGhpcyBhbGxvd3MgY2xlYXJpbmcgb3V0IHRoZSBlbnRpcmUgcXVldWUgc3luY2hyb25vdXNseVxuICAgIC8vIG9uZSBieSBvbmUgd2l0aG91dCBjb250aW51b3VzbHkgX2FkdmFuY2luZ18gaXQgKGFuZCBzdGFydGluZyBuZXcgdGFza3MgYmVmb3JlIGltbWVkaWF0ZWx5XG4gICAgLy8gYWJvcnRpbmcgdGhlbSlcbiAgICBQcm9taXNlLnJlc29sdmUoKS50aGVuKCgpID0+IHtcbiAgICAgIHRoaXMuX25leHQoKVxuICAgIH0pXG4gIH1cblxuICBfbmV4dCAoKSB7XG4gICAgaWYgKHRoaXMuYWN0aXZlUmVxdWVzdHMgPj0gdGhpcy5saW1pdCkge1xuICAgICAgcmV0dXJuXG4gICAgfVxuICAgIGlmICh0aGlzLnF1ZXVlZEhhbmRsZXJzLmxlbmd0aCA9PT0gMCkge1xuICAgICAgcmV0dXJuXG4gICAgfVxuXG4gICAgLy8gRGlzcGF0Y2ggdGhlIG5leHQgcmVxdWVzdCwgYW5kIHVwZGF0ZSB0aGUgYWJvcnQvZG9uZSBoYW5kbGVyc1xuICAgIC8vIHNvIHRoYXQgY2FuY2VsbGluZyBpdCBkb2VzIHRoZSBSaWdodCBUaGluZyAoYW5kIGRvZXNuJ3QganVzdCB0cnlcbiAgICAvLyB0byBkZXF1ZXVlIGFuIGFscmVhZHktcnVubmluZyByZXF1ZXN0KS5cbiAgICBjb25zdCBuZXh0ID0gdGhpcy5xdWV1ZWRIYW5kbGVycy5zaGlmdCgpXG4gICAgY29uc3QgaGFuZGxlciA9IHRoaXMuX2NhbGwobmV4dC5mbilcbiAgICBuZXh0LmFib3J0ID0gaGFuZGxlci5hYm9ydFxuICAgIG5leHQuZG9uZSA9IGhhbmRsZXIuZG9uZVxuICB9XG5cbiAgX3F1ZXVlIChmbiwgb3B0aW9ucyA9IHt9KSB7XG4gICAgY29uc3QgaGFuZGxlciA9IHtcbiAgICAgIGZuLFxuICAgICAgcHJpb3JpdHk6IG9wdGlvbnMucHJpb3JpdHkgfHwgMCxcbiAgICAgIGFib3J0OiAoKSA9PiB7XG4gICAgICAgIHRoaXMuX2RlcXVldWUoaGFuZGxlcilcbiAgICAgIH0sXG4gICAgICBkb25lOiAoKSA9PiB7XG4gICAgICAgIHRocm93IG5ldyBFcnJvcignQ2Fubm90IG1hcmsgYSBxdWV1ZWQgcmVxdWVzdCBhcyBkb25lOiB0aGlzIGluZGljYXRlcyBhIGJ1ZycpXG4gICAgICB9XG4gICAgfVxuXG4gICAgY29uc3QgaW5kZXggPSBmaW5kSW5kZXgodGhpcy5xdWV1ZWRIYW5kbGVycywgKG90aGVyKSA9PiB7XG4gICAgICByZXR1cm4gaGFuZGxlci5wcmlvcml0eSA+IG90aGVyLnByaW9yaXR5XG4gICAgfSlcbiAgICBpZiAoaW5kZXggPT09IC0xKSB7XG4gICAgICB0aGlzLnF1ZXVlZEhhbmRsZXJzLnB1c2goaGFuZGxlcilcbiAgICB9IGVsc2Uge1xuICAgICAgdGhpcy5xdWV1ZWRIYW5kbGVycy5zcGxpY2UoaW5kZXgsIDAsIGhhbmRsZXIpXG4gICAgfVxuICAgIHJldHVybiBoYW5kbGVyXG4gIH1cblxuICBfZGVxdWV1ZSAoaGFuZGxlcikge1xuICAgIGNvbnN0IGluZGV4ID0gdGhpcy5xdWV1ZWRIYW5kbGVycy5pbmRleE9mKGhhbmRsZXIpXG4gICAgaWYgKGluZGV4ICE9PSAtMSkge1xuICAgICAgdGhpcy5xdWV1ZWRIYW5kbGVycy5zcGxpY2UoaW5kZXgsIDEpXG4gICAgfVxuICB9XG5cbiAgcnVuIChmbiwgcXVldWVPcHRpb25zKSB7XG4gICAgaWYgKHRoaXMuYWN0aXZlUmVxdWVzdHMgPCB0aGlzLmxpbWl0KSB7XG4gICAgICByZXR1cm4gdGhpcy5fY2FsbChmbilcbiAgICB9XG4gICAgcmV0dXJuIHRoaXMuX3F1ZXVlKGZuLCBxdWV1ZU9wdGlvbnMpXG4gIH1cblxuICB3cmFwUHJvbWlzZUZ1bmN0aW9uIChmbiwgcXVldWVPcHRpb25zKSB7XG4gICAgcmV0dXJuICguLi5hcmdzKSA9PiB7XG4gICAgICBsZXQgcXVldWVkUmVxdWVzdFxuICAgICAgY29uc3Qgb3V0ZXJQcm9taXNlID0gbmV3IFByb21pc2UoKHJlc29sdmUsIHJlamVjdCkgPT4ge1xuICAgICAgICBxdWV1ZWRSZXF1ZXN0ID0gdGhpcy5ydW4oKCkgPT4ge1xuICAgICAgICAgIGxldCBjYW5jZWxFcnJvclxuICAgICAgICAgIGxldCBpbm5lclByb21pc2VcbiAgICAgICAgICB0cnkge1xuICAgICAgICAgICAgaW5uZXJQcm9taXNlID0gUHJvbWlzZS5yZXNvbHZlKGZuKC4uLmFyZ3MpKVxuICAgICAgICAgIH0gY2F0Y2ggKGVycikge1xuICAgICAgICAgICAgaW5uZXJQcm9taXNlID0gUHJvbWlzZS5yZWplY3QoZXJyKVxuICAgICAgICAgIH1cblxuICAgICAgICAgIGlubmVyUHJvbWlzZS50aGVuKChyZXN1bHQpID0+IHtcbiAgICAgICAgICAgIGlmIChjYW5jZWxFcnJvcikge1xuICAgICAgICAgICAgICByZWplY3QoY2FuY2VsRXJyb3IpXG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICBxdWV1ZWRSZXF1ZXN0LmRvbmUoKVxuICAgICAgICAgICAgICByZXNvbHZlKHJlc3VsdClcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9LCAoZXJyKSA9PiB7XG4gICAgICAgICAgICBpZiAoY2FuY2VsRXJyb3IpIHtcbiAgICAgICAgICAgICAgcmVqZWN0KGNhbmNlbEVycm9yKVxuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgcXVldWVkUmVxdWVzdC5kb25lKClcbiAgICAgICAgICAgICAgcmVqZWN0KGVycilcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9KVxuXG4gICAgICAgICAgcmV0dXJuICgpID0+IHtcbiAgICAgICAgICAgIGNhbmNlbEVycm9yID0gY3JlYXRlQ2FuY2VsRXJyb3IoKVxuICAgICAgICAgIH1cbiAgICAgICAgfSwgcXVldWVPcHRpb25zKVxuICAgICAgfSlcblxuICAgICAgb3V0ZXJQcm9taXNlLmFib3J0ID0gKCkgPT4ge1xuICAgICAgICBxdWV1ZWRSZXF1ZXN0LmFib3J0KClcbiAgICAgIH1cblxuICAgICAgcmV0dXJuIG91dGVyUHJvbWlzZVxuICAgIH1cbiAgfVxufVxuIiwiY29uc3QgaGFzID0gcmVxdWlyZSgnLi9oYXNQcm9wZXJ0eScpXG5cbi8qKlxuICogVHJhbnNsYXRlcyBzdHJpbmdzIHdpdGggaW50ZXJwb2xhdGlvbiAmIHBsdXJhbGl6YXRpb24gc3VwcG9ydC5cbiAqIEV4dGVuc2libGUgd2l0aCBjdXN0b20gZGljdGlvbmFyaWVzIGFuZCBwbHVyYWxpemF0aW9uIGZ1bmN0aW9ucy5cbiAqXG4gKiBCb3Jyb3dzIGhlYXZpbHkgZnJvbSBhbmQgaW5zcGlyZWQgYnkgUG9seWdsb3QgaHR0cHM6Ly9naXRodWIuY29tL2FpcmJuYi9wb2x5Z2xvdC5qcyxcbiAqIGJhc2ljYWxseSBhIHN0cmlwcGVkLWRvd24gdmVyc2lvbiBvZiBpdC4gRGlmZmVyZW5jZXM6IHBsdXJhbGl6YXRpb24gZnVuY3Rpb25zIGFyZSBub3QgaGFyZGNvZGVkXG4gKiBhbmQgY2FuIGJlIGVhc2lseSBhZGRlZCBhbW9uZyB3aXRoIGRpY3Rpb25hcmllcywgbmVzdGVkIG9iamVjdHMgYXJlIHVzZWQgZm9yIHBsdXJhbGl6YXRpb25cbiAqIGFzIG9wcG9zZWQgdG8gYHx8fHxgIGRlbGltZXRlclxuICpcbiAqIFVzYWdlIGV4YW1wbGU6IGB0cmFuc2xhdG9yLnRyYW5zbGF0ZSgnZmlsZXNfY2hvc2VuJywge3NtYXJ0X2NvdW50OiAzfSlgXG4gKi9cbm1vZHVsZS5leHBvcnRzID0gY2xhc3MgVHJhbnNsYXRvciB7XG4gIC8qKlxuICAgKiBAcGFyYW0ge29iamVjdHxBcnJheTxvYmplY3Q+fSBsb2NhbGVzIC0gbG9jYWxlIG9yIGxpc3Qgb2YgbG9jYWxlcy5cbiAgICovXG4gIGNvbnN0cnVjdG9yIChsb2NhbGVzKSB7XG4gICAgdGhpcy5sb2NhbGUgPSB7XG4gICAgICBzdHJpbmdzOiB7fSxcbiAgICAgIHBsdXJhbGl6ZTogZnVuY3Rpb24gKG4pIHtcbiAgICAgICAgaWYgKG4gPT09IDEpIHtcbiAgICAgICAgICByZXR1cm4gMFxuICAgICAgICB9XG4gICAgICAgIHJldHVybiAxXG4gICAgICB9XG4gICAgfVxuXG4gICAgaWYgKEFycmF5LmlzQXJyYXkobG9jYWxlcykpIHtcbiAgICAgIGxvY2FsZXMuZm9yRWFjaCgobG9jYWxlKSA9PiB0aGlzLl9hcHBseShsb2NhbGUpKVxuICAgIH0gZWxzZSB7XG4gICAgICB0aGlzLl9hcHBseShsb2NhbGVzKVxuICAgIH1cbiAgfVxuXG4gIF9hcHBseSAobG9jYWxlKSB7XG4gICAgaWYgKCFsb2NhbGUgfHwgIWxvY2FsZS5zdHJpbmdzKSB7XG4gICAgICByZXR1cm5cbiAgICB9XG5cbiAgICBjb25zdCBwcmV2TG9jYWxlID0gdGhpcy5sb2NhbGVcbiAgICB0aGlzLmxvY2FsZSA9IE9iamVjdC5hc3NpZ24oe30sIHByZXZMb2NhbGUsIHtcbiAgICAgIHN0cmluZ3M6IE9iamVjdC5hc3NpZ24oe30sIHByZXZMb2NhbGUuc3RyaW5ncywgbG9jYWxlLnN0cmluZ3MpXG4gICAgfSlcbiAgICB0aGlzLmxvY2FsZS5wbHVyYWxpemUgPSBsb2NhbGUucGx1cmFsaXplIHx8IHByZXZMb2NhbGUucGx1cmFsaXplXG4gIH1cblxuICAvKipcbiAgICogVGFrZXMgYSBzdHJpbmcgd2l0aCBwbGFjZWhvbGRlciB2YXJpYWJsZXMgbGlrZSBgJXtzbWFydF9jb3VudH0gZmlsZSBzZWxlY3RlZGBcbiAgICogYW5kIHJlcGxhY2VzIGl0IHdpdGggdmFsdWVzIGZyb20gb3B0aW9ucyBge3NtYXJ0X2NvdW50OiA1fWBcbiAgICpcbiAgICogQGxpY2Vuc2UgaHR0cHM6Ly9naXRodWIuY29tL2FpcmJuYi9wb2x5Z2xvdC5qcy9ibG9iL21hc3Rlci9MSUNFTlNFXG4gICAqIHRha2VuIGZyb20gaHR0cHM6Ly9naXRodWIuY29tL2FpcmJuYi9wb2x5Z2xvdC5qcy9ibG9iL21hc3Rlci9saWIvcG9seWdsb3QuanMjTDI5OVxuICAgKlxuICAgKiBAcGFyYW0ge3N0cmluZ30gcGhyYXNlIHRoYXQgbmVlZHMgaW50ZXJwb2xhdGlvbiwgd2l0aCBwbGFjZWhvbGRlcnNcbiAgICogQHBhcmFtIHtvYmplY3R9IG9wdGlvbnMgd2l0aCB2YWx1ZXMgdGhhdCB3aWxsIGJlIHVzZWQgdG8gcmVwbGFjZSBwbGFjZWhvbGRlcnNcbiAgICogQHJldHVybnMge3N0cmluZ30gaW50ZXJwb2xhdGVkXG4gICAqL1xuICBpbnRlcnBvbGF0ZSAocGhyYXNlLCBvcHRpb25zKSB7XG4gICAgY29uc3QgeyBzcGxpdCwgcmVwbGFjZSB9ID0gU3RyaW5nLnByb3RvdHlwZVxuICAgIGNvbnN0IGRvbGxhclJlZ2V4ID0gL1xcJC9nXG4gICAgY29uc3QgZG9sbGFyQmlsbHNZYWxsID0gJyQkJCQnXG4gICAgbGV0IGludGVycG9sYXRlZCA9IFtwaHJhc2VdXG5cbiAgICBmb3IgKGNvbnN0IGFyZyBpbiBvcHRpb25zKSB7XG4gICAgICBpZiAoYXJnICE9PSAnXycgJiYgaGFzKG9wdGlvbnMsIGFyZykpIHtcbiAgICAgICAgLy8gRW5zdXJlIHJlcGxhY2VtZW50IHZhbHVlIGlzIGVzY2FwZWQgdG8gcHJldmVudCBzcGVjaWFsICQtcHJlZml4ZWRcbiAgICAgICAgLy8gcmVnZXggcmVwbGFjZSB0b2tlbnMuIHRoZSBcIiQkJCRcIiBpcyBuZWVkZWQgYmVjYXVzZSBlYWNoIFwiJFwiIG5lZWRzIHRvXG4gICAgICAgIC8vIGJlIGVzY2FwZWQgd2l0aCBcIiRcIiBpdHNlbGYsIGFuZCB3ZSBuZWVkIHR3byBpbiB0aGUgcmVzdWx0aW5nIG91dHB1dC5cbiAgICAgICAgdmFyIHJlcGxhY2VtZW50ID0gb3B0aW9uc1thcmddXG4gICAgICAgIGlmICh0eXBlb2YgcmVwbGFjZW1lbnQgPT09ICdzdHJpbmcnKSB7XG4gICAgICAgICAgcmVwbGFjZW1lbnQgPSByZXBsYWNlLmNhbGwob3B0aW9uc1thcmddLCBkb2xsYXJSZWdleCwgZG9sbGFyQmlsbHNZYWxsKVxuICAgICAgICB9XG4gICAgICAgIC8vIFdlIGNyZWF0ZSBhIG5ldyBgUmVnRXhwYCBlYWNoIHRpbWUgaW5zdGVhZCBvZiB1c2luZyBhIG1vcmUtZWZmaWNpZW50XG4gICAgICAgIC8vIHN0cmluZyByZXBsYWNlIHNvIHRoYXQgdGhlIHNhbWUgYXJndW1lbnQgY2FuIGJlIHJlcGxhY2VkIG11bHRpcGxlIHRpbWVzXG4gICAgICAgIC8vIGluIHRoZSBzYW1lIHBocmFzZS5cbiAgICAgICAgaW50ZXJwb2xhdGVkID0gaW5zZXJ0UmVwbGFjZW1lbnQoaW50ZXJwb2xhdGVkLCBuZXcgUmVnRXhwKCclXFxcXHsnICsgYXJnICsgJ1xcXFx9JywgJ2cnKSwgcmVwbGFjZW1lbnQpXG4gICAgICB9XG4gICAgfVxuXG4gICAgcmV0dXJuIGludGVycG9sYXRlZFxuXG4gICAgZnVuY3Rpb24gaW5zZXJ0UmVwbGFjZW1lbnQgKHNvdXJjZSwgcngsIHJlcGxhY2VtZW50KSB7XG4gICAgICBjb25zdCBuZXdQYXJ0cyA9IFtdXG4gICAgICBzb3VyY2UuZm9yRWFjaCgoY2h1bmspID0+IHtcbiAgICAgICAgLy8gV2hlbiB0aGUgc291cmNlIGNvbnRhaW5zIG11bHRpcGxlIHBsYWNlaG9sZGVycyBmb3IgaW50ZXJwb2xhdGlvbixcbiAgICAgICAgLy8gd2Ugc2hvdWxkIGlnbm9yZSBjaHVua3MgdGhhdCBhcmUgbm90IHN0cmluZ3MsIGJlY2F1c2UgdGhvc2VcbiAgICAgICAgLy8gY2FuIGJlIEpTWCBvYmplY3RzIGFuZCB3aWxsIGJlIG90aGVyd2lzZSBpbmNvcnJlY3RseSB0dXJuZWQgaW50byBzdHJpbmdzLlxuICAgICAgICAvLyBXaXRob3V0IHRoaXMgY29uZGl0aW9uIHdl4oCZZCBnZXQgdGhpczogW29iamVjdCBPYmplY3RdIGhlbGxvIFtvYmplY3QgT2JqZWN0XSBteSA8YnV0dG9uPlxuICAgICAgICBpZiAodHlwZW9mIGNodW5rICE9PSAnc3RyaW5nJykge1xuICAgICAgICAgIHJldHVybiBuZXdQYXJ0cy5wdXNoKGNodW5rKVxuICAgICAgICB9XG5cbiAgICAgICAgc3BsaXQuY2FsbChjaHVuaywgcngpLmZvckVhY2goKHJhdywgaSwgbGlzdCkgPT4ge1xuICAgICAgICAgIGlmIChyYXcgIT09ICcnKSB7XG4gICAgICAgICAgICBuZXdQYXJ0cy5wdXNoKHJhdylcbiAgICAgICAgICB9XG5cbiAgICAgICAgICAvLyBJbnRlcmxhY2Ugd2l0aCB0aGUgYHJlcGxhY2VtZW50YCB2YWx1ZVxuICAgICAgICAgIGlmIChpIDwgbGlzdC5sZW5ndGggLSAxKSB7XG4gICAgICAgICAgICBuZXdQYXJ0cy5wdXNoKHJlcGxhY2VtZW50KVxuICAgICAgICAgIH1cbiAgICAgICAgfSlcbiAgICAgIH0pXG4gICAgICByZXR1cm4gbmV3UGFydHNcbiAgICB9XG4gIH1cblxuICAvKipcbiAgICogUHVibGljIHRyYW5zbGF0ZSBtZXRob2RcbiAgICpcbiAgICogQHBhcmFtIHtzdHJpbmd9IGtleVxuICAgKiBAcGFyYW0ge29iamVjdH0gb3B0aW9ucyB3aXRoIHZhbHVlcyB0aGF0IHdpbGwgYmUgdXNlZCBsYXRlciB0byByZXBsYWNlIHBsYWNlaG9sZGVycyBpbiBzdHJpbmdcbiAgICogQHJldHVybnMge3N0cmluZ30gdHJhbnNsYXRlZCAoYW5kIGludGVycG9sYXRlZClcbiAgICovXG4gIHRyYW5zbGF0ZSAoa2V5LCBvcHRpb25zKSB7XG4gICAgcmV0dXJuIHRoaXMudHJhbnNsYXRlQXJyYXkoa2V5LCBvcHRpb25zKS5qb2luKCcnKVxuICB9XG5cbiAgLyoqXG4gICAqIEdldCBhIHRyYW5zbGF0aW9uIGFuZCByZXR1cm4gdGhlIHRyYW5zbGF0ZWQgYW5kIGludGVycG9sYXRlZCBwYXJ0cyBhcyBhbiBhcnJheS5cbiAgICpcbiAgICogQHBhcmFtIHtzdHJpbmd9IGtleVxuICAgKiBAcGFyYW0ge29iamVjdH0gb3B0aW9ucyB3aXRoIHZhbHVlcyB0aGF0IHdpbGwgYmUgdXNlZCB0byByZXBsYWNlIHBsYWNlaG9sZGVyc1xuICAgKiBAcmV0dXJucyB7QXJyYXl9IFRoZSB0cmFuc2xhdGVkIGFuZCBpbnRlcnBvbGF0ZWQgcGFydHMsIGluIG9yZGVyLlxuICAgKi9cbiAgdHJhbnNsYXRlQXJyYXkgKGtleSwgb3B0aW9ucykge1xuICAgIGlmICghaGFzKHRoaXMubG9jYWxlLnN0cmluZ3MsIGtleSkpIHtcbiAgICAgIHRocm93IG5ldyBFcnJvcihgbWlzc2luZyBzdHJpbmc6ICR7a2V5fWApXG4gICAgfVxuXG4gICAgY29uc3Qgc3RyaW5nID0gdGhpcy5sb2NhbGUuc3RyaW5nc1trZXldXG4gICAgY29uc3QgaGFzUGx1cmFsRm9ybXMgPSB0eXBlb2Ygc3RyaW5nID09PSAnb2JqZWN0J1xuXG4gICAgaWYgKGhhc1BsdXJhbEZvcm1zKSB7XG4gICAgICBpZiAob3B0aW9ucyAmJiB0eXBlb2Ygb3B0aW9ucy5zbWFydF9jb3VudCAhPT0gJ3VuZGVmaW5lZCcpIHtcbiAgICAgICAgY29uc3QgcGx1cmFsID0gdGhpcy5sb2NhbGUucGx1cmFsaXplKG9wdGlvbnMuc21hcnRfY291bnQpXG4gICAgICAgIHJldHVybiB0aGlzLmludGVycG9sYXRlKHN0cmluZ1twbHVyYWxdLCBvcHRpb25zKVxuICAgICAgfSBlbHNlIHtcbiAgICAgICAgdGhyb3cgbmV3IEVycm9yKCdBdHRlbXB0ZWQgdG8gdXNlIGEgc3RyaW5nIHdpdGggcGx1cmFsIGZvcm1zLCBidXQgbm8gdmFsdWUgd2FzIGdpdmVuIGZvciAle3NtYXJ0X2NvdW50fScpXG4gICAgICB9XG4gICAgfVxuXG4gICAgcmV0dXJuIHRoaXMuaW50ZXJwb2xhdGUoc3RyaW5nLCBvcHRpb25zKVxuICB9XG59XG4iLCJjb25zdCB0aHJvdHRsZSA9IHJlcXVpcmUoJ2xvZGFzaC50aHJvdHRsZScpXG5cbmZ1bmN0aW9uIF9lbWl0U29ja2V0UHJvZ3Jlc3MgKHVwbG9hZGVyLCBwcm9ncmVzc0RhdGEsIGZpbGUpIHtcbiAgY29uc3QgeyBwcm9ncmVzcywgYnl0ZXNVcGxvYWRlZCwgYnl0ZXNUb3RhbCB9ID0gcHJvZ3Jlc3NEYXRhXG4gIGlmIChwcm9ncmVzcykge1xuICAgIHVwbG9hZGVyLnVwcHkubG9nKGBVcGxvYWQgcHJvZ3Jlc3M6ICR7cHJvZ3Jlc3N9YClcbiAgICB1cGxvYWRlci51cHB5LmVtaXQoJ3VwbG9hZC1wcm9ncmVzcycsIGZpbGUsIHtcbiAgICAgIHVwbG9hZGVyLFxuICAgICAgYnl0ZXNVcGxvYWRlZDogYnl0ZXNVcGxvYWRlZCxcbiAgICAgIGJ5dGVzVG90YWw6IGJ5dGVzVG90YWxcbiAgICB9KVxuICB9XG59XG5cbm1vZHVsZS5leHBvcnRzID0gdGhyb3R0bGUoX2VtaXRTb2NrZXRQcm9ncmVzcywgMzAwLCB7XG4gIGxlYWRpbmc6IHRydWUsXG4gIHRyYWlsaW5nOiB0cnVlXG59KVxuIiwiY29uc3QgTmV0d29ya0Vycm9yID0gcmVxdWlyZSgnQHVwcHkvdXRpbHMvbGliL05ldHdvcmtFcnJvcicpXG5cbi8qKlxuICogV3JhcHBlciBhcm91bmQgd2luZG93LmZldGNoIHRoYXQgdGhyb3dzIGEgTmV0d29ya0Vycm9yIHdoZW4gYXBwcm9wcmlhdGVcbiAqL1xubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiBmZXRjaFdpdGhOZXR3b3JrRXJyb3IgKC4uLm9wdGlvbnMpIHtcbiAgcmV0dXJuIGZldGNoKC4uLm9wdGlvbnMpXG4gICAgLmNhdGNoKChlcnIpID0+IHtcbiAgICAgIGlmIChlcnIubmFtZSA9PT0gJ0Fib3J0RXJyb3InKSB7XG4gICAgICAgIHRocm93IGVyclxuICAgICAgfSBlbHNlIHtcbiAgICAgICAgdGhyb3cgbmV3IE5ldHdvcmtFcnJvcihlcnIpXG4gICAgICB9XG4gICAgfSlcbn1cbiIsImNvbnN0IGlzRE9NRWxlbWVudCA9IHJlcXVpcmUoJy4vaXNET01FbGVtZW50JylcblxuLyoqXG4gKiBGaW5kIGEgRE9NIGVsZW1lbnQuXG4gKlxuICogQHBhcmFtIHtOb2RlfHN0cmluZ30gZWxlbWVudFxuICogQHJldHVybnMge05vZGV8bnVsbH1cbiAqL1xubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiBmaW5kRE9NRWxlbWVudCAoZWxlbWVudCwgY29udGV4dCA9IGRvY3VtZW50KSB7XG4gIGlmICh0eXBlb2YgZWxlbWVudCA9PT0gJ3N0cmluZycpIHtcbiAgICByZXR1cm4gY29udGV4dC5xdWVyeVNlbGVjdG9yKGVsZW1lbnQpXG4gIH1cblxuICBpZiAoaXNET01FbGVtZW50KGVsZW1lbnQpKSB7XG4gICAgcmV0dXJuIGVsZW1lbnRcbiAgfVxufVxuIiwiLyoqXG4gKiBUYWtlcyBhIGZpbGUgb2JqZWN0IGFuZCB0dXJucyBpdCBpbnRvIGZpbGVJRCwgYnkgY29udmVydGluZyBmaWxlLm5hbWUgdG8gbG93ZXJjYXNlLFxuICogcmVtb3ZpbmcgZXh0cmEgY2hhcmFjdGVycyBhbmQgYWRkaW5nIHR5cGUsIHNpemUgYW5kIGxhc3RNb2RpZmllZFxuICpcbiAqIEBwYXJhbSB7b2JqZWN0fSBmaWxlXG4gKiBAcmV0dXJucyB7c3RyaW5nfSB0aGUgZmlsZUlEXG4gKi9cbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gZ2VuZXJhdGVGaWxlSUQgKGZpbGUpIHtcbiAgLy8gSXQncyB0ZW1wdGluZyB0byBkbyBgW2l0ZW1zXS5maWx0ZXIoQm9vbGVhbikuam9pbignLScpYCBoZXJlLCBidXQgdGhhdFxuICAvLyBpcyBzbG93ZXIhIHNpbXBsZSBzdHJpbmcgY29uY2F0ZW5hdGlvbiBpcyBmYXN0XG5cbiAgbGV0IGlkID0gJ3VwcHknXG4gIGlmICh0eXBlb2YgZmlsZS5uYW1lID09PSAnc3RyaW5nJykge1xuICAgIGlkICs9ICctJyArIGVuY29kZUZpbGVuYW1lKGZpbGUubmFtZS50b0xvd2VyQ2FzZSgpKVxuICB9XG5cbiAgaWYgKGZpbGUudHlwZSAhPT0gdW5kZWZpbmVkKSB7XG4gICAgaWQgKz0gJy0nICsgZmlsZS50eXBlXG4gIH1cblxuICBpZiAoZmlsZS5tZXRhICYmIHR5cGVvZiBmaWxlLm1ldGEucmVsYXRpdmVQYXRoID09PSAnc3RyaW5nJykge1xuICAgIGlkICs9ICctJyArIGVuY29kZUZpbGVuYW1lKGZpbGUubWV0YS5yZWxhdGl2ZVBhdGgudG9Mb3dlckNhc2UoKSlcbiAgfVxuXG4gIGlmIChmaWxlLmRhdGEuc2l6ZSAhPT0gdW5kZWZpbmVkKSB7XG4gICAgaWQgKz0gJy0nICsgZmlsZS5kYXRhLnNpemVcbiAgfVxuICBpZiAoZmlsZS5kYXRhLmxhc3RNb2RpZmllZCAhPT0gdW5kZWZpbmVkKSB7XG4gICAgaWQgKz0gJy0nICsgZmlsZS5kYXRhLmxhc3RNb2RpZmllZFxuICB9XG5cbiAgcmV0dXJuIGlkXG59XG5cbmZ1bmN0aW9uIGVuY29kZUZpbGVuYW1lIChuYW1lKSB7XG4gIGxldCBzdWZmaXggPSAnJ1xuICByZXR1cm4gbmFtZS5yZXBsYWNlKC9bXkEtWjAtOV0vaWcsIChjaGFyYWN0ZXIpID0+IHtcbiAgICBzdWZmaXggKz0gJy0nICsgZW5jb2RlQ2hhcmFjdGVyKGNoYXJhY3RlcilcbiAgICByZXR1cm4gJy8nXG4gIH0pICsgc3VmZml4XG59XG5cbmZ1bmN0aW9uIGVuY29kZUNoYXJhY3RlciAoY2hhcmFjdGVyKSB7XG4gIHJldHVybiBjaGFyYWN0ZXIuY2hhckNvZGVBdCgwKS50b1N0cmluZygzMilcbn1cbiIsIi8qKlxuICogVGFrZXMgYSBmdWxsIGZpbGVuYW1lIHN0cmluZyBhbmQgcmV0dXJucyBhbiBvYmplY3Qge25hbWUsIGV4dGVuc2lvbn1cbiAqXG4gKiBAcGFyYW0ge3N0cmluZ30gZnVsbEZpbGVOYW1lXG4gKiBAcmV0dXJucyB7b2JqZWN0fSB7bmFtZSwgZXh0ZW5zaW9ufVxuICovXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIGdldEZpbGVOYW1lQW5kRXh0ZW5zaW9uIChmdWxsRmlsZU5hbWUpIHtcbiAgY29uc3QgbGFzdERvdCA9IGZ1bGxGaWxlTmFtZS5sYXN0SW5kZXhPZignLicpXG4gIC8vIHRoZXNlIGNvdW50IGFzIG5vIGV4dGVuc2lvbjogXCJuby1kb3RcIiwgXCJ0cmFpbGluZy1kb3QuXCJcbiAgaWYgKGxhc3REb3QgPT09IC0xIHx8IGxhc3REb3QgPT09IGZ1bGxGaWxlTmFtZS5sZW5ndGggLSAxKSB7XG4gICAgcmV0dXJuIHtcbiAgICAgIG5hbWU6IGZ1bGxGaWxlTmFtZSxcbiAgICAgIGV4dGVuc2lvbjogdW5kZWZpbmVkXG4gICAgfVxuICB9IGVsc2Uge1xuICAgIHJldHVybiB7XG4gICAgICBuYW1lOiBmdWxsRmlsZU5hbWUuc2xpY2UoMCwgbGFzdERvdCksXG4gICAgICBleHRlbnNpb246IGZ1bGxGaWxlTmFtZS5zbGljZShsYXN0RG90ICsgMSlcbiAgICB9XG4gIH1cbn1cbiIsImNvbnN0IGdldEZpbGVOYW1lQW5kRXh0ZW5zaW9uID0gcmVxdWlyZSgnLi9nZXRGaWxlTmFtZUFuZEV4dGVuc2lvbicpXG5jb25zdCBtaW1lVHlwZXMgPSByZXF1aXJlKCcuL21pbWVUeXBlcycpXG5cbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gZ2V0RmlsZVR5cGUgKGZpbGUpIHtcbiAgbGV0IGZpbGVFeHRlbnNpb24gPSBmaWxlLm5hbWUgPyBnZXRGaWxlTmFtZUFuZEV4dGVuc2lvbihmaWxlLm5hbWUpLmV4dGVuc2lvbiA6IG51bGxcbiAgZmlsZUV4dGVuc2lvbiA9IGZpbGVFeHRlbnNpb24gPyBmaWxlRXh0ZW5zaW9uLnRvTG93ZXJDYXNlKCkgOiBudWxsXG5cbiAgaWYgKGZpbGUudHlwZSkge1xuICAgIC8vIGlmIG1pbWUgdHlwZSBpcyBzZXQgaW4gdGhlIGZpbGUgb2JqZWN0IGFscmVhZHksIHVzZSB0aGF0XG4gICAgcmV0dXJuIGZpbGUudHlwZVxuICB9IGVsc2UgaWYgKGZpbGVFeHRlbnNpb24gJiYgbWltZVR5cGVzW2ZpbGVFeHRlbnNpb25dKSB7XG4gICAgLy8gZWxzZSwgc2VlIGlmIHdlIGNhbiBtYXAgZXh0ZW5zaW9uIHRvIGEgbWltZSB0eXBlXG4gICAgcmV0dXJuIG1pbWVUeXBlc1tmaWxlRXh0ZW5zaW9uXVxuICB9IGVsc2Uge1xuICAgIC8vIGlmIGFsbCBmYWlscywgZmFsbCBiYWNrIHRvIGEgZ2VuZXJpYyBieXRlIHN0cmVhbSB0eXBlXG4gICAgcmV0dXJuICdhcHBsaWNhdGlvbi9vY3RldC1zdHJlYW0nXG4gIH1cbn1cbiIsIm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gZ2V0U29ja2V0SG9zdCAodXJsKSB7XG4gIC8vIGdldCB0aGUgaG9zdCBkb21haW5cbiAgdmFyIHJlZ2V4ID0gL14oPzpodHRwcz86XFwvXFwvfFxcL1xcLyk/KD86W15AXFxuXStAKT8oPzp3d3dcXC4pPyhbXlxcbl0rKS9pXG4gIHZhciBob3N0ID0gcmVnZXguZXhlYyh1cmwpWzFdXG4gIHZhciBzb2NrZXRQcm90b2NvbCA9IC9eaHR0cDpcXC9cXC8vaS50ZXN0KHVybCkgPyAnd3MnIDogJ3dzcydcblxuICByZXR1cm4gYCR7c29ja2V0UHJvdG9jb2x9Oi8vJHtob3N0fWBcbn1cbiIsIi8qKlxuICogUmV0dXJucyBhIHRpbWVzdGFtcCBpbiB0aGUgZm9ybWF0IG9mIGBob3VyczptaW51dGVzOnNlY29uZHNgXG4gKi9cbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gZ2V0VGltZVN0YW1wICgpIHtcbiAgdmFyIGRhdGUgPSBuZXcgRGF0ZSgpXG4gIHZhciBob3VycyA9IHBhZChkYXRlLmdldEhvdXJzKCkudG9TdHJpbmcoKSlcbiAgdmFyIG1pbnV0ZXMgPSBwYWQoZGF0ZS5nZXRNaW51dGVzKCkudG9TdHJpbmcoKSlcbiAgdmFyIHNlY29uZHMgPSBwYWQoZGF0ZS5nZXRTZWNvbmRzKCkudG9TdHJpbmcoKSlcbiAgcmV0dXJuIGhvdXJzICsgJzonICsgbWludXRlcyArICc6JyArIHNlY29uZHNcbn1cblxuLyoqXG4gKiBBZGRzIHplcm8gdG8gc3RyaW5ncyBzaG9ydGVyIHRoYW4gdHdvIGNoYXJhY3RlcnNcbiAqL1xuZnVuY3Rpb24gcGFkIChzdHIpIHtcbiAgcmV0dXJuIHN0ci5sZW5ndGggIT09IDIgPyAwICsgc3RyIDogc3RyXG59XG4iLCJtb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIGhhcyAob2JqZWN0LCBrZXkpIHtcbiAgcmV0dXJuIE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbChvYmplY3QsIGtleSlcbn1cbiIsIi8qKlxuICogQ2hlY2sgaWYgYW4gb2JqZWN0IGlzIGEgRE9NIGVsZW1lbnQuIER1Y2stdHlwaW5nIGJhc2VkIG9uIGBub2RlVHlwZWAuXG4gKlxuICogQHBhcmFtIHsqfSBvYmpcbiAqL1xubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiBpc0RPTUVsZW1lbnQgKG9iaikge1xuICByZXR1cm4gb2JqICYmIHR5cGVvZiBvYmogPT09ICdvYmplY3QnICYmIG9iai5ub2RlVHlwZSA9PT0gTm9kZS5FTEVNRU5UX05PREVcbn1cbiIsImZ1bmN0aW9uIGlzTmV0d29ya0Vycm9yICh4aHIpIHtcbiAgaWYgKCF4aHIpIHtcbiAgICByZXR1cm4gZmFsc2VcbiAgfVxuICByZXR1cm4gKHhoci5yZWFkeVN0YXRlICE9PSAwICYmIHhoci5yZWFkeVN0YXRlICE9PSA0KSB8fCB4aHIuc3RhdHVzID09PSAwXG59XG5cbm1vZHVsZS5leHBvcnRzID0gaXNOZXR3b3JrRXJyb3JcbiIsIi8vIF9fX1doeSBub3QgYWRkIHRoZSBtaW1lLXR5cGVzIHBhY2thZ2U/XG4vLyAgICBJdCdzIDE5LjdrQiBnemlwcGVkLCBhbmQgd2Ugb25seSBuZWVkIG1pbWUgdHlwZXMgZm9yIHdlbGwta25vd24gZXh0ZW5zaW9ucyAoZm9yIGZpbGUgcHJldmlld3MpLlxuLy8gX19fV2hlcmUgdG8gdGFrZSBuZXcgZXh0ZW5zaW9ucyBmcm9tP1xuLy8gICAgaHR0cHM6Ly9naXRodWIuY29tL2pzaHR0cC9taW1lLWRiL2Jsb2IvbWFzdGVyL2RiLmpzb25cblxubW9kdWxlLmV4cG9ydHMgPSB7XG4gIG1kOiAndGV4dC9tYXJrZG93bicsXG4gIG1hcmtkb3duOiAndGV4dC9tYXJrZG93bicsXG4gIG1wNDogJ3ZpZGVvL21wNCcsXG4gIG1wMzogJ2F1ZGlvL21wMycsXG4gIHN2ZzogJ2ltYWdlL3N2Zyt4bWwnLFxuICBqcGc6ICdpbWFnZS9qcGVnJyxcbiAgcG5nOiAnaW1hZ2UvcG5nJyxcbiAgZ2lmOiAnaW1hZ2UvZ2lmJyxcbiAgaGVpYzogJ2ltYWdlL2hlaWMnLFxuICBoZWlmOiAnaW1hZ2UvaGVpZicsXG4gIHlhbWw6ICd0ZXh0L3lhbWwnLFxuICB5bWw6ICd0ZXh0L3lhbWwnLFxuICBjc3Y6ICd0ZXh0L2NzdicsXG4gIHRzdjogJ3RleHQvdGFiLXNlcGFyYXRlZC12YWx1ZXMnLFxuICB0YWI6ICd0ZXh0L3RhYi1zZXBhcmF0ZWQtdmFsdWVzJyxcbiAgYXZpOiAndmlkZW8veC1tc3ZpZGVvJyxcbiAgbWtzOiAndmlkZW8veC1tYXRyb3NrYScsXG4gIG1rdjogJ3ZpZGVvL3gtbWF0cm9za2EnLFxuICBtb3Y6ICd2aWRlby9xdWlja3RpbWUnLFxuICBkb2M6ICdhcHBsaWNhdGlvbi9tc3dvcmQnLFxuICBkb2NtOiAnYXBwbGljYXRpb24vdm5kLm1zLXdvcmQuZG9jdW1lbnQubWFjcm9lbmFibGVkLjEyJyxcbiAgZG9jeDogJ2FwcGxpY2F0aW9uL3ZuZC5vcGVueG1sZm9ybWF0cy1vZmZpY2Vkb2N1bWVudC53b3JkcHJvY2Vzc2luZ21sLmRvY3VtZW50JyxcbiAgZG90OiAnYXBwbGljYXRpb24vbXN3b3JkJyxcbiAgZG90bTogJ2FwcGxpY2F0aW9uL3ZuZC5tcy13b3JkLnRlbXBsYXRlLm1hY3JvZW5hYmxlZC4xMicsXG4gIGRvdHg6ICdhcHBsaWNhdGlvbi92bmQub3BlbnhtbGZvcm1hdHMtb2ZmaWNlZG9jdW1lbnQud29yZHByb2Nlc3NpbmdtbC50ZW1wbGF0ZScsXG4gIHhsYTogJ2FwcGxpY2F0aW9uL3ZuZC5tcy1leGNlbCcsXG4gIHhsYW06ICdhcHBsaWNhdGlvbi92bmQubXMtZXhjZWwuYWRkaW4ubWFjcm9lbmFibGVkLjEyJyxcbiAgeGxjOiAnYXBwbGljYXRpb24vdm5kLm1zLWV4Y2VsJyxcbiAgeGxmOiAnYXBwbGljYXRpb24veC14bGlmZit4bWwnLFxuICB4bG06ICdhcHBsaWNhdGlvbi92bmQubXMtZXhjZWwnLFxuICB4bHM6ICdhcHBsaWNhdGlvbi92bmQubXMtZXhjZWwnLFxuICB4bHNiOiAnYXBwbGljYXRpb24vdm5kLm1zLWV4Y2VsLnNoZWV0LmJpbmFyeS5tYWNyb2VuYWJsZWQuMTInLFxuICB4bHNtOiAnYXBwbGljYXRpb24vdm5kLm1zLWV4Y2VsLnNoZWV0Lm1hY3JvZW5hYmxlZC4xMicsXG4gIHhsc3g6ICdhcHBsaWNhdGlvbi92bmQub3BlbnhtbGZvcm1hdHMtb2ZmaWNlZG9jdW1lbnQuc3ByZWFkc2hlZXRtbC5zaGVldCcsXG4gIHhsdDogJ2FwcGxpY2F0aW9uL3ZuZC5tcy1leGNlbCcsXG4gIHhsdG06ICdhcHBsaWNhdGlvbi92bmQubXMtZXhjZWwudGVtcGxhdGUubWFjcm9lbmFibGVkLjEyJyxcbiAgeGx0eDogJ2FwcGxpY2F0aW9uL3ZuZC5vcGVueG1sZm9ybWF0cy1vZmZpY2Vkb2N1bWVudC5zcHJlYWRzaGVldG1sLnRlbXBsYXRlJyxcbiAgeGx3OiAnYXBwbGljYXRpb24vdm5kLm1zLWV4Y2VsJyxcbiAgdHh0OiAndGV4dC9wbGFpbicsXG4gIHRleHQ6ICd0ZXh0L3BsYWluJyxcbiAgY29uZjogJ3RleHQvcGxhaW4nLFxuICBsb2c6ICd0ZXh0L3BsYWluJyxcbiAgcGRmOiAnYXBwbGljYXRpb24vcGRmJ1xufVxuIiwibW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiBzZXR0bGUgKHByb21pc2VzKSB7XG4gIGNvbnN0IHJlc29sdXRpb25zID0gW11cbiAgY29uc3QgcmVqZWN0aW9ucyA9IFtdXG4gIGZ1bmN0aW9uIHJlc29sdmVkICh2YWx1ZSkge1xuICAgIHJlc29sdXRpb25zLnB1c2godmFsdWUpXG4gIH1cbiAgZnVuY3Rpb24gcmVqZWN0ZWQgKGVycm9yKSB7XG4gICAgcmVqZWN0aW9ucy5wdXNoKGVycm9yKVxuICB9XG5cbiAgY29uc3Qgd2FpdCA9IFByb21pc2UuYWxsKFxuICAgIHByb21pc2VzLm1hcCgocHJvbWlzZSkgPT4gcHJvbWlzZS50aGVuKHJlc29sdmVkLCByZWplY3RlZCkpXG4gIClcblxuICByZXR1cm4gd2FpdC50aGVuKCgpID0+IHtcbiAgICByZXR1cm4ge1xuICAgICAgc3VjY2Vzc2Z1bDogcmVzb2x1dGlvbnMsXG4gICAgICBmYWlsZWQ6IHJlamVjdGlvbnNcbiAgICB9XG4gIH0pXG59XG4iLCIvKipcbiAqIENvbnZlcnRzIGxpc3QgaW50byBhcnJheVxuICovXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIHRvQXJyYXkgKGxpc3QpIHtcbiAgcmV0dXJuIEFycmF5LnByb3RvdHlwZS5zbGljZS5jYWxsKGxpc3QgfHwgW10sIDApXG59XG4iLCJtb2R1bGUuZXhwb3J0cz17XG4gIFwibmFtZVwiOiBcIkB1cHB5L3hoci11cGxvYWRcIixcbiAgXCJkZXNjcmlwdGlvblwiOiBcIlBsYWluIGFuZCBzaW1wbGUgY2xhc3NpYyBIVE1MIG11bHRpcGFydCBmb3JtIHVwbG9hZHMgd2l0aCBVcHB5LCBhcyB3ZWxsIGFzIHVwbG9hZHMgdXNpbmcgdGhlIEhUVFAgUFVUIG1ldGhvZC5cIixcbiAgXCJ2ZXJzaW9uXCI6IFwiMS42LjVcIixcbiAgXCJsaWNlbnNlXCI6IFwiTUlUXCIsXG4gIFwibWFpblwiOiBcImxpYi9pbmRleC5qc1wiLFxuICBcInR5cGVzXCI6IFwidHlwZXMvaW5kZXguZC50c1wiLFxuICBcImtleXdvcmRzXCI6IFtcbiAgICBcImZpbGUgdXBsb2FkZXJcIixcbiAgICBcInhoclwiLFxuICAgIFwieGhyIHVwbG9hZFwiLFxuICAgIFwiWE1MSHR0cFJlcXVlc3RcIixcbiAgICBcImFqYXhcIixcbiAgICBcImZldGNoXCIsXG4gICAgXCJ1cHB5XCIsXG4gICAgXCJ1cHB5LXBsdWdpblwiXG4gIF0sXG4gIFwiaG9tZXBhZ2VcIjogXCJodHRwczovL3VwcHkuaW9cIixcbiAgXCJidWdzXCI6IHtcbiAgICBcInVybFwiOiBcImh0dHBzOi8vZ2l0aHViLmNvbS90cmFuc2xvYWRpdC91cHB5L2lzc3Vlc1wiXG4gIH0sXG4gIFwicmVwb3NpdG9yeVwiOiB7XG4gICAgXCJ0eXBlXCI6IFwiZ2l0XCIsXG4gICAgXCJ1cmxcIjogXCJnaXQraHR0cHM6Ly9naXRodWIuY29tL3RyYW5zbG9hZGl0L3VwcHkuZ2l0XCJcbiAgfSxcbiAgXCJkZXBlbmRlbmNpZXNcIjoge1xuICAgIFwiQHVwcHkvY29tcGFuaW9uLWNsaWVudFwiOiBcImZpbGU6Li4vY29tcGFuaW9uLWNsaWVudFwiLFxuICAgIFwiQHVwcHkvdXRpbHNcIjogXCJmaWxlOi4uL3V0aWxzXCIsXG4gICAgXCJjdWlkXCI6IFwiXjIuMS4xXCJcbiAgfSxcbiAgXCJwZWVyRGVwZW5kZW5jaWVzXCI6IHtcbiAgICBcIkB1cHB5L2NvcmVcIjogXCJeMS4wLjBcIlxuICB9XG59XG4iLCJjb25zdCB7IFBsdWdpbiB9ID0gcmVxdWlyZSgnQHVwcHkvY29yZScpXG5jb25zdCBjdWlkID0gcmVxdWlyZSgnY3VpZCcpXG5jb25zdCBUcmFuc2xhdG9yID0gcmVxdWlyZSgnQHVwcHkvdXRpbHMvbGliL1RyYW5zbGF0b3InKVxuY29uc3QgeyBQcm92aWRlciwgUmVxdWVzdENsaWVudCwgU29ja2V0IH0gPSByZXF1aXJlKCdAdXBweS9jb21wYW5pb24tY2xpZW50JylcbmNvbnN0IGVtaXRTb2NrZXRQcm9ncmVzcyA9IHJlcXVpcmUoJ0B1cHB5L3V0aWxzL2xpYi9lbWl0U29ja2V0UHJvZ3Jlc3MnKVxuY29uc3QgZ2V0U29ja2V0SG9zdCA9IHJlcXVpcmUoJ0B1cHB5L3V0aWxzL2xpYi9nZXRTb2NrZXRIb3N0JylcbmNvbnN0IHNldHRsZSA9IHJlcXVpcmUoJ0B1cHB5L3V0aWxzL2xpYi9zZXR0bGUnKVxuY29uc3QgRXZlbnRUcmFja2VyID0gcmVxdWlyZSgnQHVwcHkvdXRpbHMvbGliL0V2ZW50VHJhY2tlcicpXG5jb25zdCBQcm9ncmVzc1RpbWVvdXQgPSByZXF1aXJlKCdAdXBweS91dGlscy9saWIvUHJvZ3Jlc3NUaW1lb3V0JylcbmNvbnN0IFJhdGVMaW1pdGVkUXVldWUgPSByZXF1aXJlKCdAdXBweS91dGlscy9saWIvUmF0ZUxpbWl0ZWRRdWV1ZScpXG5jb25zdCBOZXR3b3JrRXJyb3IgPSByZXF1aXJlKCdAdXBweS91dGlscy9saWIvTmV0d29ya0Vycm9yJylcbmNvbnN0IGlzTmV0d29ya0Vycm9yID0gcmVxdWlyZSgnQHVwcHkvdXRpbHMvbGliL2lzTmV0d29ya0Vycm9yJylcblxuZnVuY3Rpb24gYnVpbGRSZXNwb25zZUVycm9yICh4aHIsIGVycm9yKSB7XG4gIC8vIE5vIGVycm9yIG1lc3NhZ2VcbiAgaWYgKCFlcnJvcikgZXJyb3IgPSBuZXcgRXJyb3IoJ1VwbG9hZCBlcnJvcicpXG4gIC8vIEdvdCBhbiBlcnJvciBtZXNzYWdlIHN0cmluZ1xuICBpZiAodHlwZW9mIGVycm9yID09PSAnc3RyaW5nJykgZXJyb3IgPSBuZXcgRXJyb3IoZXJyb3IpXG4gIC8vIEdvdCBzb21ldGhpbmcgZWxzZVxuICBpZiAoIShlcnJvciBpbnN0YW5jZW9mIEVycm9yKSkge1xuICAgIGVycm9yID0gT2JqZWN0LmFzc2lnbihuZXcgRXJyb3IoJ1VwbG9hZCBlcnJvcicpLCB7IGRhdGE6IGVycm9yIH0pXG4gIH1cblxuICBpZiAoaXNOZXR3b3JrRXJyb3IoeGhyKSkge1xuICAgIGVycm9yID0gbmV3IE5ldHdvcmtFcnJvcihlcnJvciwgeGhyKVxuICAgIHJldHVybiBlcnJvclxuICB9XG5cbiAgZXJyb3IucmVxdWVzdCA9IHhoclxuICByZXR1cm4gZXJyb3Jcbn1cblxuLyoqXG4gKiBTZXQgYGRhdGEudHlwZWAgaW4gdGhlIGJsb2IgdG8gYGZpbGUubWV0YS50eXBlYCxcbiAqIGJlY2F1c2Ugd2UgbWlnaHQgaGF2ZSBkZXRlY3RlZCBhIG1vcmUgYWNjdXJhdGUgZmlsZSB0eXBlIGluIFVwcHlcbiAqIGh0dHBzOi8vc3RhY2tvdmVyZmxvdy5jb20vYS81MDg3NTYxNVxuICpcbiAqIEBwYXJhbSB7b2JqZWN0fSBmaWxlIEZpbGUgb2JqZWN0IHdpdGggYGRhdGFgLCBgc2l6ZWAgYW5kIGBtZXRhYCBwcm9wZXJ0aWVzXG4gKiBAcmV0dXJucyB7b2JqZWN0fSBibG9iIHVwZGF0ZWQgd2l0aCB0aGUgbmV3IGB0eXBlYCBzZXQgZnJvbSBgZmlsZS5tZXRhLnR5cGVgXG4gKi9cbmZ1bmN0aW9uIHNldFR5cGVJbkJsb2IgKGZpbGUpIHtcbiAgY29uc3QgZGF0YVdpdGhVcGRhdGVkVHlwZSA9IGZpbGUuZGF0YS5zbGljZSgwLCBmaWxlLmRhdGEuc2l6ZSwgZmlsZS5tZXRhLnR5cGUpXG4gIHJldHVybiBkYXRhV2l0aFVwZGF0ZWRUeXBlXG59XG5cbm1vZHVsZS5leHBvcnRzID0gY2xhc3MgWEhSVXBsb2FkIGV4dGVuZHMgUGx1Z2luIHtcbiAgc3RhdGljIFZFUlNJT04gPSByZXF1aXJlKCcuLi9wYWNrYWdlLmpzb24nKS52ZXJzaW9uXG5cbiAgY29uc3RydWN0b3IgKHVwcHksIG9wdHMpIHtcbiAgICBzdXBlcih1cHB5LCBvcHRzKVxuICAgIHRoaXMudHlwZSA9ICd1cGxvYWRlcidcbiAgICB0aGlzLmlkID0gdGhpcy5vcHRzLmlkIHx8ICdYSFJVcGxvYWQnXG4gICAgdGhpcy50aXRsZSA9ICdYSFJVcGxvYWQnXG5cbiAgICB0aGlzLmRlZmF1bHRMb2NhbGUgPSB7XG4gICAgICBzdHJpbmdzOiB7XG4gICAgICAgIHRpbWVkT3V0OiAnVXBsb2FkIHN0YWxsZWQgZm9yICV7c2Vjb25kc30gc2Vjb25kcywgYWJvcnRpbmcuJ1xuICAgICAgfVxuICAgIH1cblxuICAgIC8vIERlZmF1bHQgb3B0aW9uc1xuICAgIGNvbnN0IGRlZmF1bHRPcHRpb25zID0ge1xuICAgICAgZm9ybURhdGE6IHRydWUsXG4gICAgICBmaWVsZE5hbWU6ICdmaWxlc1tdJyxcbiAgICAgIG1ldGhvZDogJ3Bvc3QnLFxuICAgICAgbWV0YUZpZWxkczogbnVsbCxcbiAgICAgIHJlc3BvbnNlVXJsRmllbGROYW1lOiAndXJsJyxcbiAgICAgIGJ1bmRsZTogZmFsc2UsXG4gICAgICBoZWFkZXJzOiB7fSxcbiAgICAgIHRpbWVvdXQ6IDMwICogMTAwMCxcbiAgICAgIGxpbWl0OiAwLFxuICAgICAgd2l0aENyZWRlbnRpYWxzOiBmYWxzZSxcbiAgICAgIHJlc3BvbnNlVHlwZTogJycsXG4gICAgICAvKipcbiAgICAgICAqIEB0eXBlZGVmIHJlc3BPYmpcbiAgICAgICAqIEBwcm9wZXJ0eSB7c3RyaW5nfSByZXNwb25zZVRleHRcbiAgICAgICAqIEBwcm9wZXJ0eSB7bnVtYmVyfSBzdGF0dXNcbiAgICAgICAqIEBwcm9wZXJ0eSB7c3RyaW5nfSBzdGF0dXNUZXh0XG4gICAgICAgKiBAcHJvcGVydHkge29iamVjdC48c3RyaW5nLCBzdHJpbmc+fSBoZWFkZXJzXG4gICAgICAgKlxuICAgICAgICogQHBhcmFtIHtzdHJpbmd9IHJlc3BvbnNlVGV4dCB0aGUgcmVzcG9uc2UgYm9keSBzdHJpbmdcbiAgICAgICAqIEBwYXJhbSB7WE1MSHR0cFJlcXVlc3QgfCByZXNwT2JqfSByZXNwb25zZSB0aGUgcmVzcG9uc2Ugb2JqZWN0IChYSFIgb3Igc2ltaWxhcilcbiAgICAgICAqL1xuICAgICAgZ2V0UmVzcG9uc2VEYXRhIChyZXNwb25zZVRleHQsIHJlc3BvbnNlKSB7XG4gICAgICAgIGxldCBwYXJzZWRSZXNwb25zZSA9IHt9XG4gICAgICAgIHRyeSB7XG4gICAgICAgICAgcGFyc2VkUmVzcG9uc2UgPSBKU09OLnBhcnNlKHJlc3BvbnNlVGV4dClcbiAgICAgICAgfSBjYXRjaCAoZXJyKSB7XG4gICAgICAgICAgY29uc29sZS5sb2coZXJyKVxuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIHBhcnNlZFJlc3BvbnNlXG4gICAgICB9LFxuICAgICAgLyoqXG4gICAgICAgKlxuICAgICAgICogQHBhcmFtIHtzdHJpbmd9IHJlc3BvbnNlVGV4dCB0aGUgcmVzcG9uc2UgYm9keSBzdHJpbmdcbiAgICAgICAqIEBwYXJhbSB7WE1MSHR0cFJlcXVlc3QgfCByZXNwT2JqfSByZXNwb25zZSB0aGUgcmVzcG9uc2Ugb2JqZWN0IChYSFIgb3Igc2ltaWxhcilcbiAgICAgICAqL1xuICAgICAgZ2V0UmVzcG9uc2VFcnJvciAocmVzcG9uc2VUZXh0LCByZXNwb25zZSkge1xuICAgICAgICBsZXQgZXJyb3IgPSBuZXcgRXJyb3IoJ1VwbG9hZCBlcnJvcicpXG5cbiAgICAgICAgaWYgKGlzTmV0d29ya0Vycm9yKHJlc3BvbnNlKSkge1xuICAgICAgICAgIGVycm9yID0gbmV3IE5ldHdvcmtFcnJvcihlcnJvciwgcmVzcG9uc2UpXG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4gZXJyb3JcbiAgICAgIH0sXG4gICAgICAvKipcbiAgICAgICAqIENoZWNrIGlmIHRoZSByZXNwb25zZSBmcm9tIHRoZSB1cGxvYWQgZW5kcG9pbnQgaW5kaWNhdGVzIHRoYXQgdGhlIHVwbG9hZCB3YXMgc3VjY2Vzc2Z1bC5cbiAgICAgICAqXG4gICAgICAgKiBAcGFyYW0ge251bWJlcn0gc3RhdHVzIHRoZSByZXNwb25zZSBzdGF0dXMgY29kZVxuICAgICAgICogQHBhcmFtIHtzdHJpbmd9IHJlc3BvbnNlVGV4dCB0aGUgcmVzcG9uc2UgYm9keSBzdHJpbmdcbiAgICAgICAqIEBwYXJhbSB7WE1MSHR0cFJlcXVlc3QgfCByZXNwT2JqfSByZXNwb25zZSB0aGUgcmVzcG9uc2Ugb2JqZWN0IChYSFIgb3Igc2ltaWxhcilcbiAgICAgICAqL1xuICAgICAgdmFsaWRhdGVTdGF0dXMgKHN0YXR1cywgcmVzcG9uc2VUZXh0LCByZXNwb25zZSkge1xuICAgICAgICByZXR1cm4gc3RhdHVzID49IDIwMCAmJiBzdGF0dXMgPCAzMDBcbiAgICAgIH1cbiAgICB9XG5cbiAgICB0aGlzLm9wdHMgPSB7IC4uLmRlZmF1bHRPcHRpb25zLCAuLi5vcHRzIH1cblxuICAgIHRoaXMuaTE4bkluaXQoKVxuXG4gICAgdGhpcy5oYW5kbGVVcGxvYWQgPSB0aGlzLmhhbmRsZVVwbG9hZC5iaW5kKHRoaXMpXG5cbiAgICAvLyBTaW11bHRhbmVvdXMgdXBsb2FkIGxpbWl0aW5nIGlzIHNoYXJlZCBhY3Jvc3MgYWxsIHVwbG9hZHMgd2l0aCB0aGlzIHBsdWdpbi5cbiAgICAvLyBfX3F1ZXVlIGlzIGZvciBpbnRlcm5hbCBVcHB5IHVzZSBvbmx5IVxuICAgIGlmICh0aGlzLm9wdHMuX19xdWV1ZSBpbnN0YW5jZW9mIFJhdGVMaW1pdGVkUXVldWUpIHtcbiAgICAgIHRoaXMucmVxdWVzdHMgPSB0aGlzLm9wdHMuX19xdWV1ZVxuICAgIH0gZWxzZSB7XG4gICAgICB0aGlzLnJlcXVlc3RzID0gbmV3IFJhdGVMaW1pdGVkUXVldWUodGhpcy5vcHRzLmxpbWl0KVxuICAgIH1cblxuICAgIGlmICh0aGlzLm9wdHMuYnVuZGxlICYmICF0aGlzLm9wdHMuZm9ybURhdGEpIHtcbiAgICAgIHRocm93IG5ldyBFcnJvcignYG9wdHMuZm9ybURhdGFgIG11c3QgYmUgdHJ1ZSB3aGVuIGBvcHRzLmJ1bmRsZWAgaXMgZW5hYmxlZC4nKVxuICAgIH1cblxuICAgIHRoaXMudXBsb2FkZXJFdmVudHMgPSBPYmplY3QuY3JlYXRlKG51bGwpXG4gIH1cblxuICBzZXRPcHRpb25zIChuZXdPcHRzKSB7XG4gICAgc3VwZXIuc2V0T3B0aW9ucyhuZXdPcHRzKVxuICAgIHRoaXMuaTE4bkluaXQoKVxuICB9XG5cbiAgaTE4bkluaXQgKCkge1xuICAgIHRoaXMudHJhbnNsYXRvciA9IG5ldyBUcmFuc2xhdG9yKFt0aGlzLmRlZmF1bHRMb2NhbGUsIHRoaXMudXBweS5sb2NhbGUsIHRoaXMub3B0cy5sb2NhbGVdKVxuICAgIHRoaXMuaTE4biA9IHRoaXMudHJhbnNsYXRvci50cmFuc2xhdGUuYmluZCh0aGlzLnRyYW5zbGF0b3IpXG4gICAgdGhpcy5zZXRQbHVnaW5TdGF0ZSgpIC8vIHNvIHRoYXQgVUkgcmUtcmVuZGVycyBhbmQgd2Ugc2VlIHRoZSB1cGRhdGVkIGxvY2FsZVxuICB9XG5cbiAgZ2V0T3B0aW9ucyAoZmlsZSkge1xuICAgIGNvbnN0IG92ZXJyaWRlcyA9IHRoaXMudXBweS5nZXRTdGF0ZSgpLnhoclVwbG9hZFxuICAgIGNvbnN0IG9wdHMgPSB7XG4gICAgICAuLi50aGlzLm9wdHMsXG4gICAgICAuLi4ob3ZlcnJpZGVzIHx8IHt9KSxcbiAgICAgIC4uLihmaWxlLnhoclVwbG9hZCB8fCB7fSksXG4gICAgICBoZWFkZXJzOiB7fVxuICAgIH1cbiAgICBPYmplY3QuYXNzaWduKG9wdHMuaGVhZGVycywgdGhpcy5vcHRzLmhlYWRlcnMpXG4gICAgaWYgKG92ZXJyaWRlcykge1xuICAgICAgT2JqZWN0LmFzc2lnbihvcHRzLmhlYWRlcnMsIG92ZXJyaWRlcy5oZWFkZXJzKVxuICAgIH1cbiAgICBpZiAoZmlsZS54aHJVcGxvYWQpIHtcbiAgICAgIE9iamVjdC5hc3NpZ24ob3B0cy5oZWFkZXJzLCBmaWxlLnhoclVwbG9hZC5oZWFkZXJzKVxuICAgIH1cblxuICAgIHJldHVybiBvcHRzXG4gIH1cblxuICBhZGRNZXRhZGF0YSAoZm9ybURhdGEsIG1ldGEsIG9wdHMpIHtcbiAgICBjb25zdCBtZXRhRmllbGRzID0gQXJyYXkuaXNBcnJheShvcHRzLm1ldGFGaWVsZHMpXG4gICAgICA/IG9wdHMubWV0YUZpZWxkc1xuICAgICAgLy8gU2VuZCBhbG9uZyBhbGwgZmllbGRzIGJ5IGRlZmF1bHQuXG4gICAgICA6IE9iamVjdC5rZXlzKG1ldGEpXG4gICAgbWV0YUZpZWxkcy5mb3JFYWNoKChpdGVtKSA9PiB7XG4gICAgICBmb3JtRGF0YS5hcHBlbmQoaXRlbSwgbWV0YVtpdGVtXSlcbiAgICB9KVxuICB9XG5cbiAgY3JlYXRlRm9ybURhdGFVcGxvYWQgKGZpbGUsIG9wdHMpIHtcbiAgICBjb25zdCBmb3JtUG9zdCA9IG5ldyBGb3JtRGF0YSgpXG5cbiAgICB0aGlzLmFkZE1ldGFkYXRhKGZvcm1Qb3N0LCBmaWxlLm1ldGEsIG9wdHMpXG5cbiAgICBjb25zdCBkYXRhV2l0aFVwZGF0ZWRUeXBlID0gc2V0VHlwZUluQmxvYihmaWxlKVxuXG4gICAgaWYgKGZpbGUubmFtZSkge1xuICAgICAgZm9ybVBvc3QuYXBwZW5kKG9wdHMuZmllbGROYW1lLCBkYXRhV2l0aFVwZGF0ZWRUeXBlLCBmaWxlLm1ldGEubmFtZSlcbiAgICB9IGVsc2Uge1xuICAgICAgZm9ybVBvc3QuYXBwZW5kKG9wdHMuZmllbGROYW1lLCBkYXRhV2l0aFVwZGF0ZWRUeXBlKVxuICAgIH1cblxuICAgIHJldHVybiBmb3JtUG9zdFxuICB9XG5cbiAgY3JlYXRlQnVuZGxlZFVwbG9hZCAoZmlsZXMsIG9wdHMpIHtcbiAgICBjb25zdCBmb3JtUG9zdCA9IG5ldyBGb3JtRGF0YSgpXG5cbiAgICBjb25zdCB7IG1ldGEgfSA9IHRoaXMudXBweS5nZXRTdGF0ZSgpXG4gICAgdGhpcy5hZGRNZXRhZGF0YShmb3JtUG9zdCwgbWV0YSwgb3B0cylcblxuICAgIGZpbGVzLmZvckVhY2goKGZpbGUpID0+IHtcbiAgICAgIGNvbnN0IG9wdHMgPSB0aGlzLmdldE9wdGlvbnMoZmlsZSlcblxuICAgICAgY29uc3QgZGF0YVdpdGhVcGRhdGVkVHlwZSA9IHNldFR5cGVJbkJsb2IoZmlsZSlcblxuICAgICAgaWYgKGZpbGUubmFtZSkge1xuICAgICAgICBmb3JtUG9zdC5hcHBlbmQob3B0cy5maWVsZE5hbWUsIGRhdGFXaXRoVXBkYXRlZFR5cGUsIGZpbGUubmFtZSlcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIGZvcm1Qb3N0LmFwcGVuZChvcHRzLmZpZWxkTmFtZSwgZGF0YVdpdGhVcGRhdGVkVHlwZSlcbiAgICAgIH1cbiAgICB9KVxuXG4gICAgcmV0dXJuIGZvcm1Qb3N0XG4gIH1cblxuICBjcmVhdGVCYXJlVXBsb2FkIChmaWxlLCBvcHRzKSB7XG4gICAgcmV0dXJuIGZpbGUuZGF0YVxuICB9XG5cbiAgdXBsb2FkIChmaWxlLCBjdXJyZW50LCB0b3RhbCkge1xuICAgIGNvbnN0IG9wdHMgPSB0aGlzLmdldE9wdGlvbnMoZmlsZSlcblxuICAgIHRoaXMudXBweS5sb2coYHVwbG9hZGluZyAke2N1cnJlbnR9IG9mICR7dG90YWx9YClcbiAgICByZXR1cm4gbmV3IFByb21pc2UoKHJlc29sdmUsIHJlamVjdCkgPT4ge1xuICAgICAgdGhpcy51cHB5LmVtaXQoJ3VwbG9hZC1zdGFydGVkJywgZmlsZSlcblxuICAgICAgY29uc3QgZGF0YSA9IG9wdHMuZm9ybURhdGFcbiAgICAgICAgPyB0aGlzLmNyZWF0ZUZvcm1EYXRhVXBsb2FkKGZpbGUsIG9wdHMpXG4gICAgICAgIDogdGhpcy5jcmVhdGVCYXJlVXBsb2FkKGZpbGUsIG9wdHMpXG5cbiAgICAgIGNvbnN0IHhociA9IG5ldyBYTUxIdHRwUmVxdWVzdCgpXG4gICAgICB0aGlzLnVwbG9hZGVyRXZlbnRzW2ZpbGUuaWRdID0gbmV3IEV2ZW50VHJhY2tlcih0aGlzLnVwcHkpXG5cbiAgICAgIGNvbnN0IHRpbWVyID0gbmV3IFByb2dyZXNzVGltZW91dChvcHRzLnRpbWVvdXQsICgpID0+IHtcbiAgICAgICAgeGhyLmFib3J0KClcbiAgICAgICAgcXVldWVkUmVxdWVzdC5kb25lKClcbiAgICAgICAgY29uc3QgZXJyb3IgPSBuZXcgRXJyb3IodGhpcy5pMThuKCd0aW1lZE91dCcsIHsgc2Vjb25kczogTWF0aC5jZWlsKG9wdHMudGltZW91dCAvIDEwMDApIH0pKVxuICAgICAgICB0aGlzLnVwcHkuZW1pdCgndXBsb2FkLWVycm9yJywgZmlsZSwgZXJyb3IpXG4gICAgICAgIHJlamVjdChlcnJvcilcbiAgICAgIH0pXG5cbiAgICAgIGNvbnN0IGlkID0gY3VpZCgpXG5cbiAgICAgIHhoci51cGxvYWQuYWRkRXZlbnRMaXN0ZW5lcignbG9hZHN0YXJ0JywgKGV2KSA9PiB7XG4gICAgICAgIHRoaXMudXBweS5sb2coYFtYSFJVcGxvYWRdICR7aWR9IHN0YXJ0ZWRgKVxuICAgICAgfSlcblxuICAgICAgeGhyLnVwbG9hZC5hZGRFdmVudExpc3RlbmVyKCdwcm9ncmVzcycsIChldikgPT4ge1xuICAgICAgICB0aGlzLnVwcHkubG9nKGBbWEhSVXBsb2FkXSAke2lkfSBwcm9ncmVzczogJHtldi5sb2FkZWR9IC8gJHtldi50b3RhbH1gKVxuICAgICAgICAvLyBCZWdpbiBjaGVja2luZyBmb3IgdGltZW91dHMgd2hlbiBwcm9ncmVzcyBzdGFydHMsIGluc3RlYWQgb2YgbG9hZGluZyxcbiAgICAgICAgLy8gdG8gYXZvaWQgdGltaW5nIG91dCByZXF1ZXN0cyBvbiBicm93c2VyIGNvbmN1cnJlbmN5IHF1ZXVlXG4gICAgICAgIHRpbWVyLnByb2dyZXNzKClcblxuICAgICAgICBpZiAoZXYubGVuZ3RoQ29tcHV0YWJsZSkge1xuICAgICAgICAgIHRoaXMudXBweS5lbWl0KCd1cGxvYWQtcHJvZ3Jlc3MnLCBmaWxlLCB7XG4gICAgICAgICAgICB1cGxvYWRlcjogdGhpcyxcbiAgICAgICAgICAgIGJ5dGVzVXBsb2FkZWQ6IGV2LmxvYWRlZCxcbiAgICAgICAgICAgIGJ5dGVzVG90YWw6IGV2LnRvdGFsXG4gICAgICAgICAgfSlcbiAgICAgICAgfVxuICAgICAgfSlcblxuICAgICAgeGhyLmFkZEV2ZW50TGlzdGVuZXIoJ2xvYWQnLCAoZXYpID0+IHtcbiAgICAgICAgdGhpcy51cHB5LmxvZyhgW1hIUlVwbG9hZF0gJHtpZH0gZmluaXNoZWRgKVxuICAgICAgICB0aW1lci5kb25lKClcbiAgICAgICAgcXVldWVkUmVxdWVzdC5kb25lKClcbiAgICAgICAgaWYgKHRoaXMudXBsb2FkZXJFdmVudHNbZmlsZS5pZF0pIHtcbiAgICAgICAgICB0aGlzLnVwbG9hZGVyRXZlbnRzW2ZpbGUuaWRdLnJlbW92ZSgpXG4gICAgICAgICAgdGhpcy51cGxvYWRlckV2ZW50c1tmaWxlLmlkXSA9IG51bGxcbiAgICAgICAgfVxuXG4gICAgICAgIGlmIChvcHRzLnZhbGlkYXRlU3RhdHVzKGV2LnRhcmdldC5zdGF0dXMsIHhoci5yZXNwb25zZVRleHQsIHhocikpIHtcbiAgICAgICAgICBjb25zdCBib2R5ID0gb3B0cy5nZXRSZXNwb25zZURhdGEoeGhyLnJlc3BvbnNlVGV4dCwgeGhyKVxuICAgICAgICAgIGNvbnN0IHVwbG9hZFVSTCA9IGJvZHlbb3B0cy5yZXNwb25zZVVybEZpZWxkTmFtZV1cblxuICAgICAgICAgIGNvbnN0IHVwbG9hZFJlc3AgPSB7XG4gICAgICAgICAgICBzdGF0dXM6IGV2LnRhcmdldC5zdGF0dXMsXG4gICAgICAgICAgICBib2R5LFxuICAgICAgICAgICAgdXBsb2FkVVJMXG4gICAgICAgICAgfVxuXG4gICAgICAgICAgdGhpcy51cHB5LmVtaXQoJ3VwbG9hZC1zdWNjZXNzJywgZmlsZSwgdXBsb2FkUmVzcClcblxuICAgICAgICAgIGlmICh1cGxvYWRVUkwpIHtcbiAgICAgICAgICAgIHRoaXMudXBweS5sb2coYERvd25sb2FkICR7ZmlsZS5uYW1lfSBmcm9tICR7dXBsb2FkVVJMfWApXG4gICAgICAgICAgfVxuXG4gICAgICAgICAgcmV0dXJuIHJlc29sdmUoZmlsZSlcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICBjb25zdCBib2R5ID0gb3B0cy5nZXRSZXNwb25zZURhdGEoeGhyLnJlc3BvbnNlVGV4dCwgeGhyKVxuICAgICAgICAgIGNvbnN0IGVycm9yID0gYnVpbGRSZXNwb25zZUVycm9yKHhociwgb3B0cy5nZXRSZXNwb25zZUVycm9yKHhoci5yZXNwb25zZVRleHQsIHhocikpXG5cbiAgICAgICAgICBjb25zdCByZXNwb25zZSA9IHtcbiAgICAgICAgICAgIHN0YXR1czogZXYudGFyZ2V0LnN0YXR1cyxcbiAgICAgICAgICAgIGJvZHlcbiAgICAgICAgICB9XG5cbiAgICAgICAgICB0aGlzLnVwcHkuZW1pdCgndXBsb2FkLWVycm9yJywgZmlsZSwgZXJyb3IsIHJlc3BvbnNlKVxuICAgICAgICAgIHJldHVybiByZWplY3QoZXJyb3IpXG4gICAgICAgIH1cbiAgICAgIH0pXG5cbiAgICAgIHhoci5hZGRFdmVudExpc3RlbmVyKCdlcnJvcicsIChldikgPT4ge1xuICAgICAgICB0aGlzLnVwcHkubG9nKGBbWEhSVXBsb2FkXSAke2lkfSBlcnJvcmVkYClcbiAgICAgICAgdGltZXIuZG9uZSgpXG4gICAgICAgIHF1ZXVlZFJlcXVlc3QuZG9uZSgpXG4gICAgICAgIGlmICh0aGlzLnVwbG9hZGVyRXZlbnRzW2ZpbGUuaWRdKSB7XG4gICAgICAgICAgdGhpcy51cGxvYWRlckV2ZW50c1tmaWxlLmlkXS5yZW1vdmUoKVxuICAgICAgICAgIHRoaXMudXBsb2FkZXJFdmVudHNbZmlsZS5pZF0gPSBudWxsXG4gICAgICAgIH1cblxuICAgICAgICBjb25zdCBlcnJvciA9IGJ1aWxkUmVzcG9uc2VFcnJvcih4aHIsIG9wdHMuZ2V0UmVzcG9uc2VFcnJvcih4aHIucmVzcG9uc2VUZXh0LCB4aHIpKVxuICAgICAgICB0aGlzLnVwcHkuZW1pdCgndXBsb2FkLWVycm9yJywgZmlsZSwgZXJyb3IpXG4gICAgICAgIHJldHVybiByZWplY3QoZXJyb3IpXG4gICAgICB9KVxuXG4gICAgICB4aHIub3BlbihvcHRzLm1ldGhvZC50b1VwcGVyQ2FzZSgpLCBvcHRzLmVuZHBvaW50LCB0cnVlKVxuICAgICAgLy8gSUUxMCBkb2VzIG5vdCBhbGxvdyBzZXR0aW5nIGB3aXRoQ3JlZGVudGlhbHNgIGFuZCBgcmVzcG9uc2VUeXBlYFxuICAgICAgLy8gYmVmb3JlIGBvcGVuKClgIGlzIGNhbGxlZC5cbiAgICAgIHhoci53aXRoQ3JlZGVudGlhbHMgPSBvcHRzLndpdGhDcmVkZW50aWFsc1xuICAgICAgaWYgKG9wdHMucmVzcG9uc2VUeXBlICE9PSAnJykge1xuICAgICAgICB4aHIucmVzcG9uc2VUeXBlID0gb3B0cy5yZXNwb25zZVR5cGVcbiAgICAgIH1cblxuICAgICAgT2JqZWN0LmtleXMob3B0cy5oZWFkZXJzKS5mb3JFYWNoKChoZWFkZXIpID0+IHtcbiAgICAgICAgeGhyLnNldFJlcXVlc3RIZWFkZXIoaGVhZGVyLCBvcHRzLmhlYWRlcnNbaGVhZGVyXSlcbiAgICAgIH0pXG5cbiAgICAgIGNvbnN0IHF1ZXVlZFJlcXVlc3QgPSB0aGlzLnJlcXVlc3RzLnJ1bigoKSA9PiB7XG4gICAgICAgIHhoci5zZW5kKGRhdGEpXG4gICAgICAgIHJldHVybiAoKSA9PiB7XG4gICAgICAgICAgdGltZXIuZG9uZSgpXG4gICAgICAgICAgeGhyLmFib3J0KClcbiAgICAgICAgfVxuICAgICAgfSlcblxuICAgICAgdGhpcy5vbkZpbGVSZW1vdmUoZmlsZS5pZCwgKCkgPT4ge1xuICAgICAgICBxdWV1ZWRSZXF1ZXN0LmFib3J0KClcbiAgICAgICAgcmVqZWN0KG5ldyBFcnJvcignRmlsZSByZW1vdmVkJykpXG4gICAgICB9KVxuXG4gICAgICB0aGlzLm9uQ2FuY2VsQWxsKGZpbGUuaWQsICgpID0+IHtcbiAgICAgICAgcXVldWVkUmVxdWVzdC5hYm9ydCgpXG4gICAgICAgIHJlamVjdChuZXcgRXJyb3IoJ1VwbG9hZCBjYW5jZWxsZWQnKSlcbiAgICAgIH0pXG4gICAgfSlcbiAgfVxuXG4gIHVwbG9hZFJlbW90ZSAoZmlsZSwgY3VycmVudCwgdG90YWwpIHtcbiAgICBjb25zdCBvcHRzID0gdGhpcy5nZXRPcHRpb25zKGZpbGUpXG4gICAgcmV0dXJuIG5ldyBQcm9taXNlKChyZXNvbHZlLCByZWplY3QpID0+IHtcbiAgICAgIHRoaXMudXBweS5lbWl0KCd1cGxvYWQtc3RhcnRlZCcsIGZpbGUpXG5cbiAgICAgIGNvbnN0IGZpZWxkcyA9IHt9XG4gICAgICBjb25zdCBtZXRhRmllbGRzID0gQXJyYXkuaXNBcnJheShvcHRzLm1ldGFGaWVsZHMpXG4gICAgICAgID8gb3B0cy5tZXRhRmllbGRzXG4gICAgICAgIC8vIFNlbmQgYWxvbmcgYWxsIGZpZWxkcyBieSBkZWZhdWx0LlxuICAgICAgICA6IE9iamVjdC5rZXlzKGZpbGUubWV0YSlcblxuICAgICAgbWV0YUZpZWxkcy5mb3JFYWNoKChuYW1lKSA9PiB7XG4gICAgICAgIGZpZWxkc1tuYW1lXSA9IGZpbGUubWV0YVtuYW1lXVxuICAgICAgfSlcblxuICAgICAgY29uc3QgQ2xpZW50ID0gZmlsZS5yZW1vdGUucHJvdmlkZXJPcHRpb25zLnByb3ZpZGVyID8gUHJvdmlkZXIgOiBSZXF1ZXN0Q2xpZW50XG4gICAgICBjb25zdCBjbGllbnQgPSBuZXcgQ2xpZW50KHRoaXMudXBweSwgZmlsZS5yZW1vdGUucHJvdmlkZXJPcHRpb25zKVxuICAgICAgY2xpZW50LnBvc3QoZmlsZS5yZW1vdGUudXJsLCB7XG4gICAgICAgIC4uLmZpbGUucmVtb3RlLmJvZHksXG4gICAgICAgIGVuZHBvaW50OiBvcHRzLmVuZHBvaW50LFxuICAgICAgICBzaXplOiBmaWxlLmRhdGEuc2l6ZSxcbiAgICAgICAgZmllbGRuYW1lOiBvcHRzLmZpZWxkTmFtZSxcbiAgICAgICAgbWV0YWRhdGE6IGZpZWxkcyxcbiAgICAgICAgaHR0cE1ldGhvZDogb3B0cy5tZXRob2QsXG4gICAgICAgIHVzZUZvcm1EYXRhOiBvcHRzLmZvcm1EYXRhLFxuICAgICAgICBoZWFkZXJzOiBvcHRzLmhlYWRlcnNcbiAgICAgIH0pLnRoZW4oKHJlcykgPT4ge1xuICAgICAgICBjb25zdCB0b2tlbiA9IHJlcy50b2tlblxuICAgICAgICBjb25zdCBob3N0ID0gZ2V0U29ja2V0SG9zdChmaWxlLnJlbW90ZS5jb21wYW5pb25VcmwpXG4gICAgICAgIGNvbnN0IHNvY2tldCA9IG5ldyBTb2NrZXQoeyB0YXJnZXQ6IGAke2hvc3R9L2FwaS8ke3Rva2VufWAsIGF1dG9PcGVuOiBmYWxzZSB9KVxuICAgICAgICB0aGlzLnVwbG9hZGVyRXZlbnRzW2ZpbGUuaWRdID0gbmV3IEV2ZW50VHJhY2tlcih0aGlzLnVwcHkpXG5cbiAgICAgICAgdGhpcy5vbkZpbGVSZW1vdmUoZmlsZS5pZCwgKCkgPT4ge1xuICAgICAgICAgIHNvY2tldC5zZW5kKCdwYXVzZScsIHt9KVxuICAgICAgICAgIHF1ZXVlZFJlcXVlc3QuYWJvcnQoKVxuICAgICAgICAgIHJlc29sdmUoYHVwbG9hZCAke2ZpbGUuaWR9IHdhcyByZW1vdmVkYClcbiAgICAgICAgfSlcblxuICAgICAgICB0aGlzLm9uQ2FuY2VsQWxsKGZpbGUuaWQsICgpID0+IHtcbiAgICAgICAgICBzb2NrZXQuc2VuZCgncGF1c2UnLCB7fSlcbiAgICAgICAgICBxdWV1ZWRSZXF1ZXN0LmFib3J0KClcbiAgICAgICAgICByZXNvbHZlKGB1cGxvYWQgJHtmaWxlLmlkfSB3YXMgY2FuY2VsZWRgKVxuICAgICAgICB9KVxuXG4gICAgICAgIHRoaXMub25SZXRyeShmaWxlLmlkLCAoKSA9PiB7XG4gICAgICAgICAgc29ja2V0LnNlbmQoJ3BhdXNlJywge30pXG4gICAgICAgICAgc29ja2V0LnNlbmQoJ3Jlc3VtZScsIHt9KVxuICAgICAgICB9KVxuXG4gICAgICAgIHRoaXMub25SZXRyeUFsbChmaWxlLmlkLCAoKSA9PiB7XG4gICAgICAgICAgc29ja2V0LnNlbmQoJ3BhdXNlJywge30pXG4gICAgICAgICAgc29ja2V0LnNlbmQoJ3Jlc3VtZScsIHt9KVxuICAgICAgICB9KVxuXG4gICAgICAgIHNvY2tldC5vbigncHJvZ3Jlc3MnLCAocHJvZ3Jlc3NEYXRhKSA9PiBlbWl0U29ja2V0UHJvZ3Jlc3ModGhpcywgcHJvZ3Jlc3NEYXRhLCBmaWxlKSlcblxuICAgICAgICBzb2NrZXQub24oJ3N1Y2Nlc3MnLCAoZGF0YSkgPT4ge1xuICAgICAgICAgIGNvbnN0IGJvZHkgPSBvcHRzLmdldFJlc3BvbnNlRGF0YShkYXRhLnJlc3BvbnNlLnJlc3BvbnNlVGV4dCwgZGF0YS5yZXNwb25zZSlcbiAgICAgICAgICBjb25zdCB1cGxvYWRVUkwgPSBib2R5W29wdHMucmVzcG9uc2VVcmxGaWVsZE5hbWVdXG5cbiAgICAgICAgICBjb25zdCB1cGxvYWRSZXNwID0ge1xuICAgICAgICAgICAgc3RhdHVzOiBkYXRhLnJlc3BvbnNlLnN0YXR1cyxcbiAgICAgICAgICAgIGJvZHksXG4gICAgICAgICAgICB1cGxvYWRVUkxcbiAgICAgICAgICB9XG5cbiAgICAgICAgICB0aGlzLnVwcHkuZW1pdCgndXBsb2FkLXN1Y2Nlc3MnLCBmaWxlLCB1cGxvYWRSZXNwKVxuICAgICAgICAgIHF1ZXVlZFJlcXVlc3QuZG9uZSgpXG4gICAgICAgICAgaWYgKHRoaXMudXBsb2FkZXJFdmVudHNbZmlsZS5pZF0pIHtcbiAgICAgICAgICAgIHRoaXMudXBsb2FkZXJFdmVudHNbZmlsZS5pZF0ucmVtb3ZlKClcbiAgICAgICAgICAgIHRoaXMudXBsb2FkZXJFdmVudHNbZmlsZS5pZF0gPSBudWxsXG4gICAgICAgICAgfVxuICAgICAgICAgIHJldHVybiByZXNvbHZlKClcbiAgICAgICAgfSlcblxuICAgICAgICBzb2NrZXQub24oJ2Vycm9yJywgKGVyckRhdGEpID0+IHtcbiAgICAgICAgICBjb25zdCByZXNwID0gZXJyRGF0YS5yZXNwb25zZVxuICAgICAgICAgIGNvbnN0IGVycm9yID0gcmVzcFxuICAgICAgICAgICAgPyBvcHRzLmdldFJlc3BvbnNlRXJyb3IocmVzcC5yZXNwb25zZVRleHQsIHJlc3ApXG4gICAgICAgICAgICA6IE9iamVjdC5hc3NpZ24obmV3IEVycm9yKGVyckRhdGEuZXJyb3IubWVzc2FnZSksIHsgY2F1c2U6IGVyckRhdGEuZXJyb3IgfSlcbiAgICAgICAgICB0aGlzLnVwcHkuZW1pdCgndXBsb2FkLWVycm9yJywgZmlsZSwgZXJyb3IpXG4gICAgICAgICAgcXVldWVkUmVxdWVzdC5kb25lKClcbiAgICAgICAgICBpZiAodGhpcy51cGxvYWRlckV2ZW50c1tmaWxlLmlkXSkge1xuICAgICAgICAgICAgdGhpcy51cGxvYWRlckV2ZW50c1tmaWxlLmlkXS5yZW1vdmUoKVxuICAgICAgICAgICAgdGhpcy51cGxvYWRlckV2ZW50c1tmaWxlLmlkXSA9IG51bGxcbiAgICAgICAgICB9XG4gICAgICAgICAgcmVqZWN0KGVycm9yKVxuICAgICAgICB9KVxuXG4gICAgICAgIGNvbnN0IHF1ZXVlZFJlcXVlc3QgPSB0aGlzLnJlcXVlc3RzLnJ1bigoKSA9PiB7XG4gICAgICAgICAgc29ja2V0Lm9wZW4oKVxuICAgICAgICAgIGlmIChmaWxlLmlzUGF1c2VkKSB7XG4gICAgICAgICAgICBzb2NrZXQuc2VuZCgncGF1c2UnLCB7fSlcbiAgICAgICAgICB9XG5cbiAgICAgICAgICByZXR1cm4gKCkgPT4gc29ja2V0LmNsb3NlKClcbiAgICAgICAgfSlcbiAgICAgIH0pLmNhdGNoKChlcnIpID0+IHtcbiAgICAgICAgdGhpcy51cHB5LmVtaXQoJ3VwbG9hZC1lcnJvcicsIGZpbGUsIGVycilcbiAgICAgICAgcmVqZWN0KGVycilcbiAgICAgIH0pXG4gICAgfSlcbiAgfVxuXG4gIHVwbG9hZEJ1bmRsZSAoZmlsZXMpIHtcbiAgICByZXR1cm4gbmV3IFByb21pc2UoKHJlc29sdmUsIHJlamVjdCkgPT4ge1xuICAgICAgY29uc3QgZW5kcG9pbnQgPSB0aGlzLm9wdHMuZW5kcG9pbnRcbiAgICAgIGNvbnN0IG1ldGhvZCA9IHRoaXMub3B0cy5tZXRob2RcblxuICAgICAgY29uc3Qgb3B0c0Zyb21TdGF0ZSA9IHRoaXMudXBweS5nZXRTdGF0ZSgpLnhoclVwbG9hZFxuICAgICAgY29uc3QgZm9ybURhdGEgPSB0aGlzLmNyZWF0ZUJ1bmRsZWRVcGxvYWQoZmlsZXMsIHtcbiAgICAgICAgLi4udGhpcy5vcHRzLFxuICAgICAgICAuLi4ob3B0c0Zyb21TdGF0ZSB8fCB7fSlcbiAgICAgIH0pXG5cbiAgICAgIGNvbnN0IHhociA9IG5ldyBYTUxIdHRwUmVxdWVzdCgpXG5cbiAgICAgIGNvbnN0IHRpbWVyID0gbmV3IFByb2dyZXNzVGltZW91dCh0aGlzLm9wdHMudGltZW91dCwgKCkgPT4ge1xuICAgICAgICB4aHIuYWJvcnQoKVxuICAgICAgICBjb25zdCBlcnJvciA9IG5ldyBFcnJvcih0aGlzLmkxOG4oJ3RpbWVkT3V0JywgeyBzZWNvbmRzOiBNYXRoLmNlaWwodGhpcy5vcHRzLnRpbWVvdXQgLyAxMDAwKSB9KSlcbiAgICAgICAgZW1pdEVycm9yKGVycm9yKVxuICAgICAgICByZWplY3QoZXJyb3IpXG4gICAgICB9KVxuXG4gICAgICBjb25zdCBlbWl0RXJyb3IgPSAoZXJyb3IpID0+IHtcbiAgICAgICAgZmlsZXMuZm9yRWFjaCgoZmlsZSkgPT4ge1xuICAgICAgICAgIHRoaXMudXBweS5lbWl0KCd1cGxvYWQtZXJyb3InLCBmaWxlLCBlcnJvcilcbiAgICAgICAgfSlcbiAgICAgIH1cblxuICAgICAgeGhyLnVwbG9hZC5hZGRFdmVudExpc3RlbmVyKCdsb2Fkc3RhcnQnLCAoZXYpID0+IHtcbiAgICAgICAgdGhpcy51cHB5LmxvZygnW1hIUlVwbG9hZF0gc3RhcnRlZCB1cGxvYWRpbmcgYnVuZGxlJylcbiAgICAgICAgdGltZXIucHJvZ3Jlc3MoKVxuICAgICAgfSlcblxuICAgICAgeGhyLnVwbG9hZC5hZGRFdmVudExpc3RlbmVyKCdwcm9ncmVzcycsIChldikgPT4ge1xuICAgICAgICB0aW1lci5wcm9ncmVzcygpXG5cbiAgICAgICAgaWYgKCFldi5sZW5ndGhDb21wdXRhYmxlKSByZXR1cm5cblxuICAgICAgICBmaWxlcy5mb3JFYWNoKChmaWxlKSA9PiB7XG4gICAgICAgICAgdGhpcy51cHB5LmVtaXQoJ3VwbG9hZC1wcm9ncmVzcycsIGZpbGUsIHtcbiAgICAgICAgICAgIHVwbG9hZGVyOiB0aGlzLFxuICAgICAgICAgICAgYnl0ZXNVcGxvYWRlZDogZXYubG9hZGVkIC8gZXYudG90YWwgKiBmaWxlLnNpemUsXG4gICAgICAgICAgICBieXRlc1RvdGFsOiBmaWxlLnNpemVcbiAgICAgICAgICB9KVxuICAgICAgICB9KVxuICAgICAgfSlcblxuICAgICAgeGhyLmFkZEV2ZW50TGlzdGVuZXIoJ2xvYWQnLCAoZXYpID0+IHtcbiAgICAgICAgdGltZXIuZG9uZSgpXG5cbiAgICAgICAgaWYgKHRoaXMub3B0cy52YWxpZGF0ZVN0YXR1cyhldi50YXJnZXQuc3RhdHVzLCB4aHIucmVzcG9uc2VUZXh0LCB4aHIpKSB7XG4gICAgICAgICAgY29uc3QgYm9keSA9IHRoaXMub3B0cy5nZXRSZXNwb25zZURhdGEoeGhyLnJlc3BvbnNlVGV4dCwgeGhyKVxuICAgICAgICAgIGNvbnN0IHVwbG9hZFJlc3AgPSB7XG4gICAgICAgICAgICBzdGF0dXM6IGV2LnRhcmdldC5zdGF0dXMsXG4gICAgICAgICAgICBib2R5XG4gICAgICAgICAgfVxuICAgICAgICAgIGZpbGVzLmZvckVhY2goKGZpbGUpID0+IHtcbiAgICAgICAgICAgIHRoaXMudXBweS5lbWl0KCd1cGxvYWQtc3VjY2VzcycsIGZpbGUsIHVwbG9hZFJlc3ApXG4gICAgICAgICAgfSlcbiAgICAgICAgICByZXR1cm4gcmVzb2x2ZSgpXG4gICAgICAgIH1cblxuICAgICAgICBjb25zdCBlcnJvciA9IHRoaXMub3B0cy5nZXRSZXNwb25zZUVycm9yKHhoci5yZXNwb25zZVRleHQsIHhocikgfHwgbmV3IEVycm9yKCdVcGxvYWQgZXJyb3InKVxuICAgICAgICBlcnJvci5yZXF1ZXN0ID0geGhyXG4gICAgICAgIGVtaXRFcnJvcihlcnJvcilcbiAgICAgICAgcmV0dXJuIHJlamVjdChlcnJvcilcbiAgICAgIH0pXG5cbiAgICAgIHhoci5hZGRFdmVudExpc3RlbmVyKCdlcnJvcicsIChldikgPT4ge1xuICAgICAgICB0aW1lci5kb25lKClcblxuICAgICAgICBjb25zdCBlcnJvciA9IHRoaXMub3B0cy5nZXRSZXNwb25zZUVycm9yKHhoci5yZXNwb25zZVRleHQsIHhocikgfHwgbmV3IEVycm9yKCdVcGxvYWQgZXJyb3InKVxuICAgICAgICBlbWl0RXJyb3IoZXJyb3IpXG4gICAgICAgIHJldHVybiByZWplY3QoZXJyb3IpXG4gICAgICB9KVxuXG4gICAgICB0aGlzLnVwcHkub24oJ2NhbmNlbC1hbGwnLCAoKSA9PiB7XG4gICAgICAgIHRpbWVyLmRvbmUoKVxuICAgICAgICB4aHIuYWJvcnQoKVxuICAgICAgfSlcblxuICAgICAgeGhyLm9wZW4obWV0aG9kLnRvVXBwZXJDYXNlKCksIGVuZHBvaW50LCB0cnVlKVxuICAgICAgLy8gSUUxMCBkb2VzIG5vdCBhbGxvdyBzZXR0aW5nIGB3aXRoQ3JlZGVudGlhbHNgIGFuZCBgcmVzcG9uc2VUeXBlYFxuICAgICAgLy8gYmVmb3JlIGBvcGVuKClgIGlzIGNhbGxlZC5cbiAgICAgIHhoci53aXRoQ3JlZGVudGlhbHMgPSB0aGlzLm9wdHMud2l0aENyZWRlbnRpYWxzXG4gICAgICBpZiAodGhpcy5vcHRzLnJlc3BvbnNlVHlwZSAhPT0gJycpIHtcbiAgICAgICAgeGhyLnJlc3BvbnNlVHlwZSA9IHRoaXMub3B0cy5yZXNwb25zZVR5cGVcbiAgICAgIH1cblxuICAgICAgT2JqZWN0LmtleXModGhpcy5vcHRzLmhlYWRlcnMpLmZvckVhY2goKGhlYWRlcikgPT4ge1xuICAgICAgICB4aHIuc2V0UmVxdWVzdEhlYWRlcihoZWFkZXIsIHRoaXMub3B0cy5oZWFkZXJzW2hlYWRlcl0pXG4gICAgICB9KVxuXG4gICAgICB4aHIuc2VuZChmb3JtRGF0YSlcblxuICAgICAgZmlsZXMuZm9yRWFjaCgoZmlsZSkgPT4ge1xuICAgICAgICB0aGlzLnVwcHkuZW1pdCgndXBsb2FkLXN0YXJ0ZWQnLCBmaWxlKVxuICAgICAgfSlcbiAgICB9KVxuICB9XG5cbiAgdXBsb2FkRmlsZXMgKGZpbGVzKSB7XG4gICAgY29uc3QgcHJvbWlzZXMgPSBmaWxlcy5tYXAoKGZpbGUsIGkpID0+IHtcbiAgICAgIGNvbnN0IGN1cnJlbnQgPSBwYXJzZUludChpLCAxMCkgKyAxXG4gICAgICBjb25zdCB0b3RhbCA9IGZpbGVzLmxlbmd0aFxuXG4gICAgICBpZiAoZmlsZS5lcnJvcikge1xuICAgICAgICByZXR1cm4gUHJvbWlzZS5yZWplY3QobmV3IEVycm9yKGZpbGUuZXJyb3IpKVxuICAgICAgfSBlbHNlIGlmIChmaWxlLmlzUmVtb3RlKSB7XG4gICAgICAgIHJldHVybiB0aGlzLnVwbG9hZFJlbW90ZShmaWxlLCBjdXJyZW50LCB0b3RhbClcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHJldHVybiB0aGlzLnVwbG9hZChmaWxlLCBjdXJyZW50LCB0b3RhbClcbiAgICAgIH1cbiAgICB9KVxuXG4gICAgcmV0dXJuIHNldHRsZShwcm9taXNlcylcbiAgfVxuXG4gIG9uRmlsZVJlbW92ZSAoZmlsZUlELCBjYikge1xuICAgIHRoaXMudXBsb2FkZXJFdmVudHNbZmlsZUlEXS5vbignZmlsZS1yZW1vdmVkJywgKGZpbGUpID0+IHtcbiAgICAgIGlmIChmaWxlSUQgPT09IGZpbGUuaWQpIGNiKGZpbGUuaWQpXG4gICAgfSlcbiAgfVxuXG4gIG9uUmV0cnkgKGZpbGVJRCwgY2IpIHtcbiAgICB0aGlzLnVwbG9hZGVyRXZlbnRzW2ZpbGVJRF0ub24oJ3VwbG9hZC1yZXRyeScsICh0YXJnZXRGaWxlSUQpID0+IHtcbiAgICAgIGlmIChmaWxlSUQgPT09IHRhcmdldEZpbGVJRCkge1xuICAgICAgICBjYigpXG4gICAgICB9XG4gICAgfSlcbiAgfVxuXG4gIG9uUmV0cnlBbGwgKGZpbGVJRCwgY2IpIHtcbiAgICB0aGlzLnVwbG9hZGVyRXZlbnRzW2ZpbGVJRF0ub24oJ3JldHJ5LWFsbCcsIChmaWxlc1RvUmV0cnkpID0+IHtcbiAgICAgIGlmICghdGhpcy51cHB5LmdldEZpbGUoZmlsZUlEKSkgcmV0dXJuXG4gICAgICBjYigpXG4gICAgfSlcbiAgfVxuXG4gIG9uQ2FuY2VsQWxsIChmaWxlSUQsIGNiKSB7XG4gICAgdGhpcy51cGxvYWRlckV2ZW50c1tmaWxlSURdLm9uKCdjYW5jZWwtYWxsJywgKCkgPT4ge1xuICAgICAgaWYgKCF0aGlzLnVwcHkuZ2V0RmlsZShmaWxlSUQpKSByZXR1cm5cbiAgICAgIGNiKClcbiAgICB9KVxuICB9XG5cbiAgaGFuZGxlVXBsb2FkIChmaWxlSURzKSB7XG4gICAgaWYgKGZpbGVJRHMubGVuZ3RoID09PSAwKSB7XG4gICAgICB0aGlzLnVwcHkubG9nKCdbWEhSVXBsb2FkXSBObyBmaWxlcyB0byB1cGxvYWQhJylcbiAgICAgIHJldHVybiBQcm9taXNlLnJlc29sdmUoKVxuICAgIH1cblxuICAgIC8vIG5vIGxpbWl0IGNvbmZpZ3VyZWQgYnkgdGhlIHVzZXIsIGFuZCBubyBSYXRlTGltaXRlZFF1ZXVlIHBhc3NlZCBpbiBieSBhIFwicGFyZW50XCIgcGx1Z2luIChiYXNpY2FsbHkganVzdCBBd3NTMykgdXNpbmcgdGhlIHRvcCBzZWNyZXQgYF9fcXVldWVgIG9wdGlvblxuICAgIGlmICh0aGlzLm9wdHMubGltaXQgPT09IDAgJiYgIXRoaXMub3B0cy5fX3F1ZXVlKSB7XG4gICAgICB0aGlzLnVwcHkubG9nKFxuICAgICAgICAnW1hIUlVwbG9hZF0gV2hlbiB1cGxvYWRpbmcgbXVsdGlwbGUgZmlsZXMgYXQgb25jZSwgY29uc2lkZXIgc2V0dGluZyB0aGUgYGxpbWl0YCBvcHRpb24gKHRvIGAxMGAgZm9yIGV4YW1wbGUpLCB0byBsaW1pdCB0aGUgbnVtYmVyIG9mIGNvbmN1cnJlbnQgdXBsb2Fkcywgd2hpY2ggaGVscHMgcHJldmVudCBtZW1vcnkgYW5kIG5ldHdvcmsgaXNzdWVzOiBodHRwczovL3VwcHkuaW8vZG9jcy94aHItdXBsb2FkLyNsaW1pdC0wJyxcbiAgICAgICAgJ3dhcm5pbmcnXG4gICAgICApXG4gICAgfVxuXG4gICAgdGhpcy51cHB5LmxvZygnW1hIUlVwbG9hZF0gVXBsb2FkaW5nLi4uJylcbiAgICBjb25zdCBmaWxlcyA9IGZpbGVJRHMubWFwKChmaWxlSUQpID0+IHRoaXMudXBweS5nZXRGaWxlKGZpbGVJRCkpXG5cbiAgICBpZiAodGhpcy5vcHRzLmJ1bmRsZSkge1xuICAgICAgLy8gaWYgYnVuZGxlOiB0cnVlLCB3ZSBkb27igJl0IHN1cHBvcnQgcmVtb3RlIHVwbG9hZHNcbiAgICAgIGNvbnN0IGlzU29tZUZpbGVSZW1vdGUgPSBmaWxlcy5zb21lKGZpbGUgPT4gZmlsZS5pc1JlbW90ZSlcbiAgICAgIGlmIChpc1NvbWVGaWxlUmVtb3RlKSB7XG4gICAgICAgIHRocm93IG5ldyBFcnJvcignQ2Fu4oCZdCB1cGxvYWQgcmVtb3RlIGZpbGVzIHdoZW4gYnVuZGxlOiB0cnVlIG9wdGlvbiBpcyBzZXQnKVxuICAgICAgfVxuXG4gICAgICByZXR1cm4gdGhpcy51cGxvYWRCdW5kbGUoZmlsZXMpXG4gICAgfVxuXG4gICAgcmV0dXJuIHRoaXMudXBsb2FkRmlsZXMoZmlsZXMpLnRoZW4oKCkgPT4gbnVsbClcbiAgfVxuXG4gIGluc3RhbGwgKCkge1xuICAgIGlmICh0aGlzLm9wdHMuYnVuZGxlKSB7XG4gICAgICBjb25zdCB7IGNhcGFiaWxpdGllcyB9ID0gdGhpcy51cHB5LmdldFN0YXRlKClcbiAgICAgIHRoaXMudXBweS5zZXRTdGF0ZSh7XG4gICAgICAgIGNhcGFiaWxpdGllczoge1xuICAgICAgICAgIC4uLmNhcGFiaWxpdGllcyxcbiAgICAgICAgICBpbmRpdmlkdWFsQ2FuY2VsbGF0aW9uOiBmYWxzZVxuICAgICAgICB9XG4gICAgICB9KVxuICAgIH1cblxuICAgIHRoaXMudXBweS5hZGRVcGxvYWRlcih0aGlzLmhhbmRsZVVwbG9hZClcbiAgfVxuXG4gIHVuaW5zdGFsbCAoKSB7XG4gICAgaWYgKHRoaXMub3B0cy5idW5kbGUpIHtcbiAgICAgIGNvbnN0IHsgY2FwYWJpbGl0aWVzIH0gPSB0aGlzLnVwcHkuZ2V0U3RhdGUoKVxuICAgICAgdGhpcy51cHB5LnNldFN0YXRlKHtcbiAgICAgICAgY2FwYWJpbGl0aWVzOiB7XG4gICAgICAgICAgLi4uY2FwYWJpbGl0aWVzLFxuICAgICAgICAgIGluZGl2aWR1YWxDYW5jZWxsYXRpb246IHRydWVcbiAgICAgICAgfVxuICAgICAgfSlcbiAgICB9XG5cbiAgICB0aGlzLnVwcHkucmVtb3ZlVXBsb2FkZXIodGhpcy5oYW5kbGVVcGxvYWQpXG4gIH1cbn1cbiIsInJlcXVpcmUoJ2VzNi1wcm9taXNlL2F1dG8nKVxucmVxdWlyZSgnd2hhdHdnLWZldGNoJylcbmNvbnN0IFVwcHkgPSByZXF1aXJlKCdAdXBweS9jb3JlJylcbmNvbnN0IEZpbGVJbnB1dCA9IHJlcXVpcmUoJ0B1cHB5L2ZpbGUtaW5wdXQnKVxuY29uc3QgWEhSVXBsb2FkID0gcmVxdWlyZSgnQHVwcHkveGhyLXVwbG9hZCcpXG5jb25zdCBQcm9ncmVzc0JhciA9IHJlcXVpcmUoJ0B1cHB5L3Byb2dyZXNzLWJhcicpXG5cbmNvbnN0IHVwcHkgPSBuZXcgVXBweSh7IGRlYnVnOiB0cnVlLCBhdXRvUHJvY2VlZDogdHJ1ZSB9KVxudXBweS51c2UoRmlsZUlucHV0LCB7XG4gIHRhcmdldDogJy5VcHB5Rm9ybScsXG4gIHJlcGxhY2VUYXJnZXRDb250ZW50OiB0cnVlXG59KVxudXBweS51c2UoUHJvZ3Jlc3NCYXIsIHtcbiAgdGFyZ2V0OiAnLlVwcHlQcm9ncmVzc0JhcicsXG4gIGhpZGVBZnRlckZpbmlzaDogZmFsc2Vcbn0pXG51cHB5LnVzZShYSFJVcGxvYWQsIHtcbiAgZW5kcG9pbnQ6ICdodHRwczovL3hoci1zZXJ2ZXIuaGVyb2t1YXBwLmNvbS91cGxvYWQnLFxuICBmb3JtRGF0YTogdHJ1ZSxcbiAgZmllbGROYW1lOiAnZmlsZXNbXSdcbn0pXG5cbi8vIEFuZCBkaXNwbGF5IHVwbG9hZGVkIGZpbGVzXG51cHB5Lm9uKCd1cGxvYWQtc3VjY2VzcycsIChmaWxlLCByZXNwb25zZSkgPT4ge1xuICBjb25zdCB1cmwgPSByZXNwb25zZS51cGxvYWRVUkxcbiAgY29uc3QgZmlsZU5hbWUgPSBmaWxlLm5hbWVcblxuICBjb25zdCBsaSA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2xpJylcbiAgY29uc3QgYSA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2EnKVxuICBhLmhyZWYgPSB1cmxcbiAgYS50YXJnZXQgPSAnX2JsYW5rJ1xuICBhLmFwcGVuZENoaWxkKGRvY3VtZW50LmNyZWF0ZVRleHROb2RlKGZpbGVOYW1lKSlcbiAgbGkuYXBwZW5kQ2hpbGQoYSlcblxuICBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcudXBsb2FkZWQtZmlsZXMgb2wnKS5hcHBlbmRDaGlsZChsaSlcbn0pXG4iXX0=
