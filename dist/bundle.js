/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, { enumerable: true, get: getter });
/******/ 		}
/******/ 	};
/******/
/******/ 	// define __esModule on exports
/******/ 	__webpack_require__.r = function(exports) {
/******/ 		if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 			Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 		}
/******/ 		Object.defineProperty(exports, '__esModule', { value: true });
/******/ 	};
/******/
/******/ 	// create a fake namespace object
/******/ 	// mode & 1: value is a module id, require it
/******/ 	// mode & 2: merge all properties of value into the ns
/******/ 	// mode & 4: return value when already ns object
/******/ 	// mode & 8|1: behave like require
/******/ 	__webpack_require__.t = function(value, mode) {
/******/ 		if(mode & 1) value = __webpack_require__(value);
/******/ 		if(mode & 8) return value;
/******/ 		if((mode & 4) && typeof value === 'object' && value && value.__esModule) return value;
/******/ 		var ns = Object.create(null);
/******/ 		__webpack_require__.r(ns);
/******/ 		Object.defineProperty(ns, 'default', { enumerable: true, value: value });
/******/ 		if(mode & 2 && typeof value != 'string') for(var key in value) __webpack_require__.d(ns, key, function(key) { return value[key]; }.bind(null, key));
/******/ 		return ns;
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = "./src/index.ts");
/******/ })
/************************************************************************/
/******/ ({

/***/ "./src/Observer.ts":
/*!*************************!*\
  !*** ./src/Observer.ts ***!
  \*************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Observer = void 0;
class Observer {
    constructor(storage) {
        this.storage = storage;
        this.blockedCards = new Set();
        storage.setCounter(0);
        this.storage.onChange((changes) => {
            if (changes["blocker_keyword_list"]) {
                this.blockCards(document.querySelectorAll('div, span, a'));
            }
        });
    }
    run() {
        return __awaiter(this, void 0, void 0, function* () {
            this.blockCards(document.querySelectorAll('div, span, a'));
            const obs = new MutationObserver((records) => {
                for (const record of records) {
                    this.blockCards(record.addedNodes);
                }
            });
            obs.observe(document, {
                attributes: true,
                childList: true,
                subtree: true,
            });
        });
    }
    blockCards(elements) {
        return __awaiter(this, void 0, void 0, function* () {
            elements.forEach((element) => __awaiter(this, void 0, void 0, function* () {
                var _a;
                if (element instanceof HTMLElement) {
                    if (!((_a = this.blockedCards) === null || _a === void 0 ? void 0 : _a.has(element))) {
                        const list = yield this.storage.getKeywordList();
                        for (const keyword of list) {
                            if (element.innerText.replace(/\s+/, " ").toLowerCase().indexOf(keyword) !== -1) {
                                this.blockCard(element, keyword);
                                break;
                            }
                        }
                    }
                }
            }));
        });
    }
    blockCard(title, keyword) {
        var _a;
        return __awaiter(this, void 0, void 0, function* () {
            if (this.blockedCards.has(title)) {
                return;
            }
            const dis = title.closest('[id="dismissable"], .ytd-section-list-renderer > #contents  [class*="item"] > *');
            const content = dis === null || dis === void 0 ? void 0 : dis.parentElement;
            if (title.closest(".youtube-blocked-item") || ((_a = dis === null || dis === void 0 ? void 0 : dis.previousElementSibling) === null || _a === void 0 ? void 0 : _a.classList.contains("youtube-blocked-item"))) {
                return;
            }
            if (!(dis instanceof HTMLElement) || !(content instanceof HTMLElement)) {
                return;
            }
            content.style.position = "relative";
            const style = `
            justify-content: center; 
            align-items: center;
            text-align: center;
            display: flex;
            position: absolute;
            background-color: gray;
            left: 0;
            right: 0;
            top: 0;
            bottom: 0;
        `;
            content.innerHTML += `<div class="youtube-blocked-item" style="${style}">
            <h4 style="font-size: 21px; color: white;">
                Заблокированно: <b>${keyword}</b>
            </h4>
        </div>
        `;
            this.blockedCards.add(title);
            this.storage.setCounter(document.querySelectorAll(".youtube-blocked-item").length);
        });
    }
}
exports.Observer = Observer;


/***/ }),

/***/ "./src/Storage.ts":
/*!************************!*\
  !*** ./src/Storage.ts ***!
  \************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
exports.Storage = void 0;
class Storage {
    constructor() {
        this.subs = new Set();
        chrome.storage.onChanged.addListener((e) => {
            this.subsTrigger(e);
        });
    }
    getKeywordList() {
        return new Promise((resolve) => {
            chrome.storage.local.get(['blocker_keyword_list'], (result) => {
                const list = result.blocker_keyword_list || [];
                resolve(list.map((k) => k.trim()));
            });
        });
    }
    addKeyWord(keyword) {
        return new Promise((resolve) => {
            if (keyword.trim() === "") {
                resolve();
                return;
            }
            if (keyword.replace(/\s+/, "").length < 3) {
                resolve();
                return;
            }
            chrome.storage.local.get(['blocker_keyword_list'], (result) => {
                const list = result.blocker_keyword_list || [];
                list.push(keyword.toLowerCase().trim());
                chrome.storage.local.set({ blocker_keyword_list: [...new Set(list)] }, () => {
                    resolve();
                });
            });
        });
    }
    getCounter() {
        return new Promise((resolve) => {
            chrome.storage.local.get(["blocker_counter"], (result) => {
                const counter = parseInt(result.blocker_counter || 0, 10);
                resolve(counter);
            });
        });
    }
    setCounter(counter) {
        return new Promise((resolve) => {
            chrome.storage.local.set({ blocker_counter: counter }, () => {
                resolve();
            });
        });
    }
    removeKeyWord(keyword) {
        return new Promise((resolve) => {
            this.getKeywordList().then((list) => {
                const newList = list.filter((k) => k !== keyword.toLowerCase());
                chrome.storage.local.set({ blocker_keyword_list: newList }, () => {
                    resolve();
                });
            });
        });
    }
    subsTrigger(changes) {
        for (const sub of this.subs) {
            sub(changes);
        }
    }
    onChange(sub) {
        this.subs.add(sub);
    }
}
exports.Storage = Storage;


/***/ }),

/***/ "./src/index.ts":
/*!**********************!*\
  !*** ./src/index.ts ***!
  \**********************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
const Observer_1 = __webpack_require__(/*! ./Observer */ "./src/Observer.ts");
const Storage_1 = __webpack_require__(/*! ./Storage */ "./src/Storage.ts");
function main() {
    const obs = new Observer_1.Observer(new Storage_1.Storage());
    obs.run();
}
main();


/***/ })

/******/ });
//# sourceMappingURL=bundle.js.map