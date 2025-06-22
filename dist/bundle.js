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

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   \"default\": () => (/* binding */ Snatch)\n/* harmony export */ });\nfunction _typeof(o) { \"@babel/helpers - typeof\"; return _typeof = \"function\" == typeof Symbol && \"symbol\" == typeof Symbol.iterator ? function (o) { return typeof o; } : function (o) { return o && \"function\" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? \"symbol\" : typeof o; }, _typeof(o); }\nfunction _classCallCheck(a, n) { if (!(a instanceof n)) throw new TypeError(\"Cannot call a class as a function\"); }\nfunction _defineProperties(e, r) { for (var t = 0; t < r.length; t++) { var o = r[t]; o.enumerable = o.enumerable || !1, o.configurable = !0, \"value\" in o && (o.writable = !0), Object.defineProperty(e, _toPropertyKey(o.key), o); } }\nfunction _createClass(e, r, t) { return r && _defineProperties(e.prototype, r), t && _defineProperties(e, t), Object.defineProperty(e, \"prototype\", { writable: !1 }), e; }\nfunction _toPropertyKey(t) { var i = _toPrimitive(t, \"string\"); return \"symbol\" == _typeof(i) ? i : i + \"\"; }\nfunction _toPrimitive(t, r) { if (\"object\" != _typeof(t) || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r || \"default\"); if (\"object\" != _typeof(i)) return i; throw new TypeError(\"@@toPrimitive must return a primitive value.\"); } return (\"string\" === r ? String : Number)(t); }\nvar Snatch = /*#__PURE__*/function () {\n  function Snatch(options) {\n    _classCallCheck(this, Snatch);\n    this.options = {};\n    this.options.method = options && options.method ? options.method : \"POST\";\n    this.options.url = options && options.url ? options.url : \"http://localhost/\";\n    this.dataset = {};\n    this.snatch();\n  }\n\n  /**\r\n   * Snatch the browser's fingerprinting data.\r\n   * This method collects various properties from the `navigator` object,\r\n   */\n  return _createClass(Snatch, [{\n    key: \"snatch\",\n    value: function snatch() {\n      // Collect basic properties\n      this.dataset.userAgent = navigator.userAgent;\n      this.dataset.platform = navigator.platform;\n      this.dataset.timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;\n      this.dataset.language = navigator.language || navigator.userLanguage;\n      this.dataset.languages = navigator.languages;\n\n      // Collect additional properties\n      this.dataset.cookieEnabled = navigator.cookieEnabled;\n      this.dataset.doNotTrack = navigator.doNotTrack || window.doNotTrack || navigator.msDoNotTrack;\n      this.dataset.hardwareConcurrency = navigator.hardwareConcurrency;\n      this.dataset.deviceMemory = navigator.deviceMemory || \"unknown\";\n      this.dataset.product = navigator.product;\n      this.dataset.productSub = navigator.productSub;\n      this.dataset.vendor = navigator.vendor;\n      this.dataset.vendorSub = navigator.vendorSub || \"unknown\";\n      this.dataset.appName = navigator.appName;\n      this.dataset.appVersion = navigator.appVersion;\n      this.dataset.appCodeName = navigator.appCodeName;\n      this.dataset.appMinorVersion = navigator.appMinorVersion || \"unknown\";\n      this.dataset.buildID = navigator.buildID || \"unknown\";\n\n      // Collect plugins and mime types\n      this.dataset.plugins = Array.from(navigator.plugins).map(function (plugin) {\n        return {\n          name: plugin.name,\n          version: plugin.version,\n          description: plugin.description\n        };\n      });\n      this.dataset.mimeTypes = Array.from(navigator.mimeTypes).map(function (mimeType) {\n        return {\n          type: mimeType.type,\n          suffixes: mimeType.suffixes,\n          description: mimeType.description\n        };\n      });\n\n      // Collect screen properties\n      this.dataset.screen = {\n        width: screen.width,\n        height: screen.height,\n        colorDepth: screen.colorDepth,\n        pixelDepth: screen.pixelDepth,\n        orientation: screen.orientation ? {\n          type: screen.orientation.type,\n          angle: screen.orientation.angle\n        } : null\n      };\n\n      // Collect High Entropy Values\n      try {\n        var highEntropyValues = {};\n        navigator.userAgentData.getHighEntropyValues([\"architecture\", \"model\", \"platform\", \"platformVersion\", \"uaFullVersion\", \"bitness\"]).then(function (data) {\n          for (var key in data) {\n            highEntropyValues[key] = data[key];\n          }\n        });\n        this.dataset.highEntropyValues = highEntropyValues;\n      } catch (error) {\n        console.warn(\"High Entropy Values not available:\", error);\n        this.dataset.highEntropyValues = {};\n      }\n    }\n\n    /**\r\n     * Send the collected dataset to the target URL.\r\n     * This method uses XMLHttpRequest to send the data as JSON.\r\n     */\n  }, {\n    key: \"send\",\n    value: function send() {\n      var xhr = new XMLHttpRequest();\n      xhr.open(this.options.method, this.options.url, true);\n      xhr.setRequestHeader(\"Content-Type\", \"application/json\");\n      xhr.send(JSON.stringify(this.dataset));\n    }\n  }]);\n}();\n\n\n//# sourceURL=webpack://snatch/./src/index.js?");

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