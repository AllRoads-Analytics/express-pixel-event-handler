// AllRoads Analytics (allroadsanalytics.com)
;(function(window, document, pixelFunc, pixelFuncName, pixelEndpoint, versionNumber) {
   "use strict";
   
   function _createForOfIteratorHelper(o, allowArrayLike) { var it = typeof Symbol !== "undefined" && o[Symbol.iterator] || o["@@iterator"]; if (!it) { if (Array.isArray(o) || (it = _unsupportedIterableToArray(o)) || allowArrayLike && o && typeof o.length === "number") { if (it) o = it; var i = 0; var F = function F() {}; return { s: F, n: function n() { if (i >= o.length) return { done: true }; return { done: false, value: o[i++] }; }, e: function e(_e2) { throw _e2; }, f: F }; } throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); } var normalCompletion = true, didErr = false, err; return { s: function s() { it = it.call(o); }, n: function n() { var step = it.next(); normalCompletion = step.done; return step; }, e: function e(_e3) { didErr = true; err = _e3; }, f: function f() { try { if (!normalCompletion && it["return"] != null) it["return"](); } finally { if (didErr) throw err; } } }; }
   
   function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }
   
   function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }
   
   function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) { symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); } keys.push.apply(keys, symbols); } return keys; }
   
   function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(Object(source), true).forEach(function (key) { _defineProperty(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }
   
   function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }
   
   function _typeof(obj) { "@babel/helpers - typeof"; if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }
   
   function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
   
   function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }
   
   function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }
   
   var Config = {
     id: '',
     params: {},
     version: versionNumber,
     follow: false
   };
   
   var Helper = /*#__PURE__*/function () {
     function Helper() {
       _classCallCheck(this, Helper);
     }
   
     _createClass(Helper, null, [{
       key: "isPresent",
       value: function isPresent(variable) {
         return typeof variable !== 'undefined' && variable !== null && variable !== '';
       }
     }, {
       key: "now",
       value: function now() {
         return 1 * new Date();
       }
     }, {
       key: "guid",
       value: function guid() {
         var uid = null;
         var uid_param = Url.getParameterByName(pixelFuncName + '_follow');
   
         try {
           if (Helper.isPresent(uid_param)) {
             var parts = uid_param.split('.');
   
             if (parts.length === 2) {
               var paramDate = new Date(parseInt(parts[1]));
               var now = new Date();
               paramDate.setMinutes(paramDate.getMinutes() + 5);
   
               if (!isNaN(paramDate.getTime()) && now.getTime() < paramDate.getTime()) {
                 uid = parts[0];
               }
             }
           }
         } catch (e) {// move on
         }
   
         if (!uid) {
           if (Cookie.exists('uid')) {
             uid = Cookie.get('uid');
           } else {
             uid = Config.version + '-xxxxxxxx-'.replace(/[x]/g, function (c) {
               var r = Math.random() * 36 | 0,
                   v = c == 'x' ? r : r & 0x3 | 0x8;
               return v.toString(36);
             }) + (1 * new Date()).toString(36);
           }
         }
   
         return uid;
       } // reduces all optional data down to a string
   
     }, {
       key: "optionalData",
       value: function optionalData(data) {
         if (Helper.isPresent(data) === false) {
           return '';
         } else if (_typeof(data) === 'object') {
           // runs Helper.optionalData again to reduce to string in case something else was returned
           return Helper.optionalData(JSON.stringify(data));
         } else if (typeof data === 'function') {
           // runs the function and calls Helper.optionalData again to reduce further if it isn't a string
           return Helper.optionalData(data());
         } else {
           return String(data);
         }
       }
     }, {
       key: "addFollowParam",
       value: function addFollowParam(a) {
         if (Config.follow) {
           try {
             var linkUrl = new URL(a.href);
             linkUrl.searchParams.set(pixelFuncName + '_follow', uid + '.' + new Date().getTime());
             a.href = linkUrl.href;
           } catch (e) {// nothing
           }
         }
       }
     }]);
   
     return Helper;
   }();
   
   var Browser = /*#__PURE__*/function () {
     function Browser() {
       _classCallCheck(this, Browser);
     }
   
     _createClass(Browser, null, [{
       key: "nameAndVersion",
       value: function nameAndVersion() {
         // http://stackoverflow.com/questions/5916900/how-can-you-detect-the-version-of-a-browser
         var ua = navigator.userAgent,
             tem,
             M = ua.match(/(opera|chrome|safari|firefox|msie|trident(?=\/))\/?\s*(\d+)/i) || [];
   
         if (/trident/i.test(M[1])) {
           tem = /\brv[ :]+(\d+)/g.exec(ua) || [];
           return 'IE ' + (tem[1] || '');
         }
   
         if (M[1] === 'Chrome') {
           tem = ua.match(/\b(OPR|Edge)\/(\d+)/);
           if (tem != null) return tem.slice(1).join(' ').replace('OPR', 'Opera');
         }
   
         M = M[2] ? [M[1], M[2]] : [navigator.appName, navigator.appVersion, '-?'];
         if ((tem = ua.match(/version\/(\d+)/i)) != null) M.splice(1, 1, tem[1]);
         return M.join(' ');
       }
     }, {
       key: "isMobile",
       value: function isMobile() {
         return 'ontouchstart' in window || navigator.maxTouchPoints > 0 || navigator.msMaxTouchPoints > 0;
       }
     }, {
       key: "userAgent",
       value: function userAgent() {
         return window.navigator.userAgent;
       }
     }]);
   
     return Browser;
   }();
   
   var Cookie = /*#__PURE__*/function () {
     function Cookie() {
       _classCallCheck(this, Cookie);
     }
   
     _createClass(Cookie, null, [{
       key: "prefix",
       value: function prefix() {
         return "__".concat(pixelFuncName, "_");
       }
     }, {
       key: "set",
       value: function set(name, value, minutes) {
         var path = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : '/';
         var expires = '';
   
         if (Helper.isPresent(minutes)) {
           var date = new Date();
           date.setTime(date.getTime() + minutes * 60 * 1000);
           expires = "expires=".concat(date.toGMTString(), "; ");
         }
   
         document.cookie = "".concat(this.prefix()).concat(name, "=").concat(value, "; ").concat(expires, "path=").concat(path, "; SameSite=Lax");
       }
     }, {
       key: "get",
       value: function get(name) {
         var name = "".concat(this.prefix()).concat(name, "=");
         var ca = document.cookie.split(';');
   
         for (var i = 0; i < ca.length; i++) {
           var c = ca[i];
   
           while (c.charAt(0) == ' ') {
             c = c.substring(1);
           }
   
           if (c.indexOf(name) == 0) return c.substring(name.length, c.length);
         }
   
         return;
       }
     }, {
       key: "delete",
       value: function _delete(name) {
         this.set(name, '', -100);
       }
     }, {
       key: "exists",
       value: function exists(name) {
         return Helper.isPresent(this.get(name));
       }
     }, {
       key: "setUtms",
       value: function setUtms() {
         var utmArray = ['utm_source', 'utm_medium', 'utm_term', 'utm_content', 'utm_campaign'];
         var exists = false;
   
         for (var i = 0, l = utmArray.length; i < l; i++) {
           if (Helper.isPresent(Url.getParameterByName(utmArray[i]))) {
             exists = true;
             break;
           }
         }
   
         if (exists) {
           var val,
               save = {};
   
           for (var i = 0, l = utmArray.length; i < l; i++) {
             val = Url.getParameterByName(utmArray[i]);
   
             if (Helper.isPresent(val)) {
               save[utmArray[i]] = val;
             }
           }
   
           this.set('utm', JSON.stringify(save));
         }
       }
     }, {
       key: "getUtm",
       value: function getUtm(name) {
         if (this.exists('utm')) {
           var utms = JSON.parse(this.get('utm'));
           return name in utms ? utms[name] : '';
         }
       }
     }]);
   
     return Cookie;
   }();
   
   var Url = /*#__PURE__*/function () {
     function Url() {
       _classCallCheck(this, Url);
     }
   
     _createClass(Url, null, [{
       key: "getParameterByName",
       value: // http://stackoverflow.com/a/901144/1231563
       function getParameterByName(name, url) {
         if (!url) url = window.location.href;
         name = name.replace(/[\[\]]/g, "\\$&");
         var regex = new RegExp("[?&]" + name + "(=([^&#]*)|&|#|$)", "i"),
             results = regex.exec(url);
         if (!results) return null;
         if (!results[2]) return '';
         return decodeURIComponent(results[2].replace(/\+/g, " "));
       }
     }, {
       key: "externalHost",
       value: function externalHost(link) {
         return link.hostname != location.hostname && link.protocol.indexOf('http') === 0;
       }
     }]);
   
     return Url;
   }();
   
   var Pixel = /*#__PURE__*/function () {
     function Pixel(event, timestamp, optional) {
       _classCallCheck(this, Pixel);
   
       this.params = [];
       this.event = event;
       this.timestamp = timestamp;
       this.optional = Helper.optionalData(optional);
       this.buildParams();
       this.send();
     }
   
     _createClass(Pixel, [{
       key: "buildParams",
       value: function buildParams() {
         var attr = this.getAttribute();
   
         for (var index in attr) {
           if (attr.hasOwnProperty(index)) {
             this.setParam(index, attr[index](index));
           }
         }
       }
     }, {
       key: "getAttribute",
       value: function getAttribute() {
         var _this = this;
   
         var url = new URL(document.location.href);
         return _objectSpread({
           id: function id() {
             return Config.id;
           },
           // website Id
           uid: function uid() {
             return Cookie.get('uid');
           },
           // user Id
           ev: function ev() {
             return _this.event;
           },
           // event being triggered
           ed: function ed() {
             return _this.optional;
           },
           // any event data to pass along
           v: function v() {
             return Config.version;
           },
           // openpixel.js version
           dl: function dl() {
             return window.location.href;
           },
           // document location
           rl: function rl() {
             return document.referrer;
           },
           // referrer location
           ts: function ts() {
             return _this.timestamp;
           },
           // timestamp when event was triggered
           de: function de() {
             return document.characterSet;
           },
           // document encoding
           sr: function sr() {
             return window.screen.width + 'x' + window.screen.height;
           },
           // screen resolution
           vp: function vp() {
             return window.innerWidth + 'x' + window.innerHeight;
           },
           // viewport size
           cd: function cd() {
             return window.screen.colorDepth;
           },
           // color depth
           dt: function dt() {
             return document.title;
           },
           // document title
           bn: function bn() {
             return Browser.nameAndVersion();
           },
           // browser name and version number
           md: function md() {
             return Browser.isMobile();
           },
           // is a mobile device?
           ua: function ua() {
             return Browser.userAgent();
           },
           // user agent
           tz: function tz() {
             return new Date().getTimezoneOffset();
           },
           // timezone
           utm_source: function utm_source(key) {
             return Cookie.getUtm(key);
           },
           // get the utm source
           utm_medium: function utm_medium(key) {
             return Cookie.getUtm(key);
           },
           // get the utm medium
           utm_term: function utm_term(key) {
             return Cookie.getUtm(key);
           },
           // get the utm term
           utm_content: function utm_content(key) {
             return Cookie.getUtm(key);
           },
           // get the utm content
           utm_campaign: function utm_campaign(key) {
             return Cookie.getUtm(key);
           },
           // get the utm campaign
           host: function host() {
             return url.hostname;
           },
           path: function path() {
             return url.pathname;
           }
         }, Config.params);
       }
     }, {
       key: "setParam",
       value: function setParam(key, val) {
         if (Helper.isPresent(val)) {
           this.params.push("".concat(key, "=").concat(encodeURIComponent(val)));
         } else {
           this.params.push("".concat(key, "="));
         }
       }
     }, {
       key: "send",
       value: function send() {
         window.navigator.sendBeacon ? this.sendBeacon() : this.sendImage();
       }
     }, {
       key: "sendBeacon",
       value: function sendBeacon() {
         window.navigator.sendBeacon(this.getSourceUrl());
       }
     }, {
       key: "sendImage",
       value: function sendImage() {
         this.img = document.createElement('img');
         this.img.src = this.getSourceUrl();
         this.img.style.display = 'none';
         this.img.width = '1';
         this.img.height = '1';
         document.getElementsByTagName('body')[0].appendChild(this.img);
       }
     }, {
       key: "getSourceUrl",
       value: function getSourceUrl() {
         return "".concat(pixelEndpoint, "?").concat(this.params.join('&'));
       }
     }]);
   
     return Pixel;
   }(); // Get UID from A. URL; B. Cookie; C. New.
   
   
   var uid = Helper.guid(); // Set UID cookie.
   
   Cookie.set('uid', uid, 2 * 365 * 24 * 60); // 2 years
   // save any utms through as session cookies
   
   Cookie.setUtms(); // process the queue and future incoming commands
   
   pixelFunc.process = function (method, value) {
     var optional = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};
   
     if (method === 'init') {
       var _optional$follow;
   
       Config.id = value;
       Config.follow = (_optional$follow = optional.follow) !== null && _optional$follow !== void 0 ? _optional$follow : Config.follow;
     } else if (method === 'param') {
       Config.params[value] = function () {
         return optional;
       };
     } else if (method === 'event') {
       if (value === 'pageload' && !Config.pageLoadOnce) {
         Config.pageLoadOnce = true;
         new Pixel(value, pixelFunc.t, optional);
       } else if (value !== 'pageload' && value !== 'pageclose') {
         new Pixel(value, Helper.now(), optional);
       }
     }
   }; // run the queued calls from the snippet to be processed
   
   
   for (var i = 0, l = pixelFunc.queue.length; i < l; i++) {
     pixelFunc.process.apply(pixelFunc, pixelFunc.queue[i]);
   } // https://github.com/GoogleChromeLabs/page-lifecycle/blob/master/src/Lifecycle.mjs
   // Safari does not reliably fire the `pagehide` or `visibilitychange`
   
   
   var isSafari = (typeof safari === "undefined" ? "undefined" : _typeof(safari)) === 'object' && safari.pushNotification;
   var isPageHideSupported = ('onpageshow' in self); // IE9-10 do not support the pagehide event, so we fall back to unload
   // pagehide event is more reliable but less broad than unload event for mobile and modern browsers
   
   var pageCloseEvent = isPageHideSupported && !isSafari ? 'pagehide' : 'unload';
   window.addEventListener(pageCloseEvent, function () {
     if (!Config.pageCloseOnce) {
       Config.pageCloseOnce = true;
       new Pixel('pageclose', Helper.now(), function () {
         // if a link was clicked in the last 5 seconds that goes to an external host, pass it through as event data
         if (Helper.isPresent(Config.externalHost) && Helper.now() - Config.externalHost.time < 5 * 1000) {
           return Config.externalHost.link;
         }
       });
     }
   });
   
   window.onload = function () {
     var _iterator = _createForOfIteratorHelper(document.querySelectorAll('a')),
         _step;
   
     try {
       for (_iterator.s(); !(_step = _iterator.n()).done;) {
         var a = _step.value;
         a.addEventListener('click', function (_e) {
           if (Url.externalHost(this)) {
             Config.externalHost = {
               link: this.href,
               time: Helper.now()
             };
             Helper.addFollowParam(this);
           }
         }.bind(a));
         a.addEventListener('auxclick', function (_e) {
           if (Url.externalHost(this)) {
             Helper.addFollowParam(this);
           }
         }.bind(a));
       }
     } catch (err) {
       _iterator.e(err);
     } finally {
       _iterator.f();
     }
   
     var dataAttributes = document.querySelectorAll('[data-allroads-event]');
   
     for (var i = 0, l = dataAttributes.length; i < l; i++) {
       dataAttributes[i].addEventListener('click', function (_e) {
         var event = this.getAttribute('data-allroads-event');
   
         if (event) {
           new Pixel(event, Helper.now(), this.getAttribute('data-allroads-data'));
         }
       }.bind(dataAttributes[i]));
     }
   };
   }(window, document, window["allroads"], "allroads", "https://events.allroadsanalytics.com/event.gif", 2));
   