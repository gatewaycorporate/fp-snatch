/*
 * ATTENTION: The "eval" devtool has been used (maybe by default in mode: "development").
 * This devtool is neither made for production nor for readable output files.
 * It uses "eval()" calls to create a separate source file in the browser devtools.
 * If you are trying to read the output file, select a different devtool (https://webpack.js.org/configuration/devtool/)
 * or disable the default devtool with "devtool: false".
 * If you are looking for production-ready output files, see mode: "production" (https://webpack.js.org/configuration/mode/).
 */
(function webpackUniversalModuleDefinition(root, factory) {
	if(typeof exports === 'object' && typeof module === 'object')
		module.exports = factory();
	else if(typeof define === 'function' && define.amd)
		define([], factory);
	else if(typeof exports === 'object')
		exports["snatch"] = factory();
	else
		root["snatch"] = factory();
})(self, () => {
return /******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ({

/***/ "./src/index.js":
/*!**********************!*\
  !*** ./src/index.js ***!
  \**********************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   \"default\": () => (/* binding */ Snatch)\n/* harmony export */ });\nfunction _typeof(o) { \"@babel/helpers - typeof\"; return _typeof = \"function\" == typeof Symbol && \"symbol\" == typeof Symbol.iterator ? function (o) { return typeof o; } : function (o) { return o && \"function\" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? \"symbol\" : typeof o; }, _typeof(o); }\nfunction _regenerator() { /*! regenerator-runtime -- Copyright (c) 2014-present, Facebook, Inc. -- license (MIT): https://github.com/babel/babel/blob/main/packages/babel-helpers/LICENSE */ var e, t, r = \"function\" == typeof Symbol ? Symbol : {}, n = r.iterator || \"@@iterator\", o = r.toStringTag || \"@@toStringTag\"; function i(r, n, o, i) { var c = n && n.prototype instanceof Generator ? n : Generator, u = Object.create(c.prototype); return _regeneratorDefine2(u, \"_invoke\", function (r, n, o) { var i, c, u, f = 0, p = o || [], y = !1, G = { p: 0, n: 0, v: e, a: d, f: d.bind(e, 4), d: function d(t, r) { return i = t, c = 0, u = e, G.n = r, a; } }; function d(r, n) { for (c = r, u = n, t = 0; !y && f && !o && t < p.length; t++) { var o, i = p[t], d = G.p, l = i[2]; r > 3 ? (o = l === n) && (u = i[(c = i[4]) ? 5 : (c = 3, 3)], i[4] = i[5] = e) : i[0] <= d && ((o = r < 2 && d < i[1]) ? (c = 0, G.v = n, G.n = i[1]) : d < l && (o = r < 3 || i[0] > n || n > l) && (i[4] = r, i[5] = n, G.n = l, c = 0)); } if (o || r > 1) return a; throw y = !0, n; } return function (o, p, l) { if (f > 1) throw TypeError(\"Generator is already running\"); for (y && 1 === p && d(p, l), c = p, u = l; (t = c < 2 ? e : u) || !y;) { i || (c ? c < 3 ? (c > 1 && (G.n = -1), d(c, u)) : G.n = u : G.v = u); try { if (f = 2, i) { if (c || (o = \"next\"), t = i[o]) { if (!(t = t.call(i, u))) throw TypeError(\"iterator result is not an object\"); if (!t.done) return t; u = t.value, c < 2 && (c = 0); } else 1 === c && (t = i.return) && t.call(i), c < 2 && (u = TypeError(\"The iterator does not provide a '\" + o + \"' method\"), c = 1); i = e; } else if ((t = (y = G.n < 0) ? u : r.call(n, G)) !== a) break; } catch (t) { i = e, c = 1, u = t; } finally { f = 1; } } return { value: t, done: y }; }; }(r, o, i), !0), u; } var a = {}; function Generator() {} function GeneratorFunction() {} function GeneratorFunctionPrototype() {} t = Object.getPrototypeOf; var c = [][n] ? t(t([][n]())) : (_regeneratorDefine2(t = {}, n, function () { return this; }), t), u = GeneratorFunctionPrototype.prototype = Generator.prototype = Object.create(c); function f(e) { return Object.setPrototypeOf ? Object.setPrototypeOf(e, GeneratorFunctionPrototype) : (e.__proto__ = GeneratorFunctionPrototype, _regeneratorDefine2(e, o, \"GeneratorFunction\")), e.prototype = Object.create(u), e; } return GeneratorFunction.prototype = GeneratorFunctionPrototype, _regeneratorDefine2(u, \"constructor\", GeneratorFunctionPrototype), _regeneratorDefine2(GeneratorFunctionPrototype, \"constructor\", GeneratorFunction), GeneratorFunction.displayName = \"GeneratorFunction\", _regeneratorDefine2(GeneratorFunctionPrototype, o, \"GeneratorFunction\"), _regeneratorDefine2(u), _regeneratorDefine2(u, o, \"Generator\"), _regeneratorDefine2(u, n, function () { return this; }), _regeneratorDefine2(u, \"toString\", function () { return \"[object Generator]\"; }), (_regenerator = function _regenerator() { return { w: i, m: f }; })(); }\nfunction _regeneratorDefine2(e, r, n, t) { var i = Object.defineProperty; try { i({}, \"\", {}); } catch (e) { i = 0; } _regeneratorDefine2 = function _regeneratorDefine(e, r, n, t) { if (r) i ? i(e, r, { value: n, enumerable: !t, configurable: !t, writable: !t }) : e[r] = n;else { var o = function o(r, n) { _regeneratorDefine2(e, r, function (e) { return this._invoke(r, n, e); }); }; o(\"next\", 0), o(\"throw\", 1), o(\"return\", 2); } }, _regeneratorDefine2(e, r, n, t); }\nfunction asyncGeneratorStep(n, t, e, r, o, a, c) { try { var i = n[a](c), u = i.value; } catch (n) { return void e(n); } i.done ? t(u) : Promise.resolve(u).then(r, o); }\nfunction _asyncToGenerator(n) { return function () { var t = this, e = arguments; return new Promise(function (r, o) { var a = n.apply(t, e); function _next(n) { asyncGeneratorStep(a, r, o, _next, _throw, \"next\", n); } function _throw(n) { asyncGeneratorStep(a, r, o, _next, _throw, \"throw\", n); } _next(void 0); }); }; }\nfunction _classCallCheck(a, n) { if (!(a instanceof n)) throw new TypeError(\"Cannot call a class as a function\"); }\nfunction _defineProperties(e, r) { for (var t = 0; t < r.length; t++) { var o = r[t]; o.enumerable = o.enumerable || !1, o.configurable = !0, \"value\" in o && (o.writable = !0), Object.defineProperty(e, _toPropertyKey(o.key), o); } }\nfunction _createClass(e, r, t) { return r && _defineProperties(e.prototype, r), t && _defineProperties(e, t), Object.defineProperty(e, \"prototype\", { writable: !1 }), e; }\nfunction _toPropertyKey(t) { var i = _toPrimitive(t, \"string\"); return \"symbol\" == _typeof(i) ? i : i + \"\"; }\nfunction _toPrimitive(t, r) { if (\"object\" != _typeof(t) || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r || \"default\"); if (\"object\" != _typeof(i)) return i; throw new TypeError(\"@@toPrimitive must return a primitive value.\"); } return (\"string\" === r ? String : Number)(t); }\nvar Snatch = /*#__PURE__*/function () {\n  function Snatch(options) {\n    _classCallCheck(this, Snatch);\n    this.options = {};\n    this.options.method = options && options.method ? options.method : \"POST\";\n    this.options.url = options && options.url ? options.url : \"http://localhost/\";\n    this.dataset = {};\n    this.snatch();\n  }\n\n  /**\r\n   * Snatch the browser's fingerprinting data.\r\n   * This method collects various properties from the `navigator` object,\r\n   */\n  return _createClass(Snatch, [{\n    key: \"snatch\",\n    value: function snatch() {\n      this.dataset[\"platform\"] = navigator.platform;\n      this.dataset[\"userAgent\"] = navigator.userAgent;\n      this.dataset[\"language\"] = navigator.language;\n      this.dataset[\"languages\"] = navigator.languages;\n      this.dataset[\"vendor\"] = navigator.vendor;\n      this.dataset[\"appVersion\"] = navigator.appVersion;\n      this.dataset[\"appName\"] = navigator.appName;\n      this.dataset[\"appCodeName\"] = navigator.appCodeName;\n      this.dataset[\"product\"] = navigator.product;\n      this.dataset[\"productSub\"] = navigator.productSub;\n      this.dataset[\"hardwareConcurrency\"] = navigator.hardwareConcurrency;\n      this.dataset[\"deviceMemory\"] = navigator.deviceMemory;\n      this.dataset[\"cookieEnabled\"] = navigator.cookieEnabled;\n      this.dataset[\"doNotTrack\"] = navigator.doNotTrack;\n      this.dataset[\"maxTouchPoints\"] = navigator.maxTouchPoints;\n      this.dataset[\"connection\"] = navigator.connection ? {\n        effectiveType: navigator.connection.effectiveType,\n        downlink: navigator.connection.downlink,\n        rtt: navigator.connection.rtt,\n        saveData: navigator.connection.saveData\n      } : null;\n      this.dataset[\"geolocation\"] = \"geolocation\" in navigator;\n      this.dataset[\"mediaDevices\"] = \"mediaDevices\" in navigator;\n      this.dataset[\"permissions\"] = \"permissions\" in navigator;\n      this.dataset[\"storage\"] = \"storage\" in navigator;\n      this.dataset[\"serviceWorker\"] = \"serviceWorker\" in navigator;\n      this.dataset[\"webGL\"] = function () {\n        try {\n          var canvas = document.createElement('canvas');\n          var gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');\n          return gl ? {\n            vendor: gl.getParameter(gl.VENDOR),\n            renderer: gl.getParameter(gl.RENDERER),\n            version: gl.getParameter(gl.VERSION),\n            shadingLanguageVersion: gl.getParameter(gl.SHADING_LANGUAGE_VERSION)\n          } : null;\n        } catch (e) {\n          return null;\n        }\n      }();\n      this.dataset[\"canvas\"] = function () {\n        try {\n          var canvas = document.createElement('canvas');\n          var ctx = canvas.getContext('2d');\n          ctx.fillStyle = 'rgba(255, 0, 0, 0.5)';\n          ctx.fillRect(0, 0, 50, 50);\n          return canvas.toDataURL();\n        } catch (e) {\n          return null;\n        }\n      }();\n      this.dataset[\"fonts\"] = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee() {\n        var fonts, _t;\n        return _regenerator().w(function (_context) {\n          while (1) switch (_context.n) {\n            case 0:\n              _context.p = 0;\n              _context.n = 1;\n              return document.fonts.ready;\n            case 1:\n              fonts = _context.v;\n              return _context.a(2, Array.from(fonts).map(function (font) {\n                return font.family;\n              }));\n            case 2:\n              _context.p = 2;\n              _t = _context.v;\n              return _context.a(2, []);\n          }\n        }, _callee, null, [[0, 2]]);\n      }))();\n      this.dataset[\"screen\"] = {\n        width: screen.width,\n        height: screen.height,\n        colorDepth: screen.colorDepth,\n        pixelDepth: screen.pixelDepth,\n        orientation: screen.orientation ? {\n          type: screen.orientation.type,\n          angle: screen.orientation.angle\n        } : null\n      };\n      this.dataset[\"timezone\"] = Intl.DateTimeFormat().resolvedOptions().timeZone;\n      this.dataset[\"plugins\"] = Array.from(navigator.plugins).map(function (plugin) {\n        return {\n          name: plugin.name,\n          description: plugin.description,\n          filename: plugin.filename,\n          length: plugin.length\n        };\n      });\n      this.dataset[\"mimeTypes\"] = Array.from(navigator.mimeTypes).map(function (mimeType) {\n        return {\n          type: mimeType.type,\n          suffixes: mimeType.suffixes,\n          description: mimeType.description\n        };\n      });\n      this.dataset[\"oscpu\"] = navigator.oscpu || null;\n      this.dataset[\"audio\"] = function () {\n        try {\n          var audio = new Audio();\n          return {\n            codecSupport: {\n              codec_wav: audio.canPlayType('audio/wav; codecs=\"1\"'),\n              codec_mp3: audio.canPlayType('audio/mpeg; codecs=\"mp3\"'),\n              codec_vorbis: audio.canPlayType('audio/ogg; codecs=\"vorbis\"'),\n              codec_opus: audio.canPlayType('audio/ogg; codecs=\"opus\"'),\n              codec_flac: audio.canPlayType('audio/ogg; codecs=\"flac\"')\n            },\n            sampleRate: audio.sampleRate || null\n          };\n        } catch (e) {\n          return null;\n        }\n      }();\n    }\n\n    /**\r\n     * Send the collected dataset to the target URL.\r\n     * This method uses XMLHttpRequest to send the data as JSON.\r\n     */\n  }, {\n    key: \"send\",\n    value: function send() {\n      var xhr = new XMLHttpRequest();\n      xhr.open(this.options.method, this.options.url, true);\n      xhr.setRequestHeader(\"Content-Type\", \"application/json\");\n      xhr.send(JSON.stringify(this.dataset));\n    }\n  }]);\n}();\n\n\n//# sourceURL=webpack://snatch/./src/index.js?");

/***/ })

/******/ 	});
/************************************************************************/
/******/ 	// The require scope
/******/ 	var __webpack_require__ = {};
/******/ 	
/************************************************************************/
/******/ 	/* webpack/runtime/define property getters */
/******/ 	(() => {
/******/ 		// define getter functions for harmony exports
/******/ 		__webpack_require__.d = (exports, definition) => {
/******/ 			for(var key in definition) {
/******/ 				if(__webpack_require__.o(definition, key) && !__webpack_require__.o(exports, key)) {
/******/ 					Object.defineProperty(exports, key, { enumerable: true, get: definition[key] });
/******/ 				}
/******/ 			}
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/hasOwnProperty shorthand */
/******/ 	(() => {
/******/ 		__webpack_require__.o = (obj, prop) => (Object.prototype.hasOwnProperty.call(obj, prop))
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/make namespace object */
/******/ 	(() => {
/******/ 		// define __esModule on exports
/******/ 		__webpack_require__.r = (exports) => {
/******/ 			if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 				Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 			}
/******/ 			Object.defineProperty(exports, '__esModule', { value: true });
/******/ 		};
/******/ 	})();
/******/ 	
/************************************************************************/
/******/ 	
/******/ 	// startup
/******/ 	// Load entry module and return exports
/******/ 	// This entry module can't be inlined because the eval devtool is used.
/******/ 	var __webpack_exports__ = {};
/******/ 	__webpack_modules__["./src/index.js"](0, __webpack_exports__, __webpack_require__);
/******/ 	__webpack_exports__ = __webpack_exports__["default"];
/******/ 	
/******/ 	return __webpack_exports__;
/******/ })()
;
});