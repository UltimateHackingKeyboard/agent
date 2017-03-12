webpackJsonp([1],Array(22).concat([
/* 22 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

function __export(m) {
    for (var p in m) if (!exports.hasOwnProperty(p)) exports[p] = m[p];
}
Object.defineProperty(exports, "__esModule", { value: true });
__export(__webpack_require__(81));
__export(__webpack_require__(1093));
__export(__webpack_require__(1094));
__export(__webpack_require__(1095));
__export(__webpack_require__(1096));
__export(__webpack_require__(1097));
__export(__webpack_require__(1098));
__export(__webpack_require__(1099));


/***/ }),
/* 23 */,
/* 24 */,
/* 25 */,
/* 26 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
function assertUInt8(target, key) {
    return assertInteger(target, key, 0, 0xFF);
}
exports.assertUInt8 = assertUInt8;
function assertInt8(target, key) {
    return assertInteger(target, key, -0x80, 0x7F);
}
exports.assertInt8 = assertInt8;
function assertUInt16(target, key) {
    return assertInteger(target, key, 0, 0xFFFF);
}
exports.assertUInt16 = assertUInt16;
function assertInt16(target, key) {
    return assertInteger(target, key, -0x8000, 0x7FFF);
}
exports.assertInt16 = assertInt16;
function assertUInt32(target, key) {
    return assertInteger(target, key, 0, 0xFFFFFFFF);
}
exports.assertUInt32 = assertUInt32;
function assertInt32(target, key) {
    return assertInteger(target, key, -0x80000000, 0x7FFFFFFF);
}
exports.assertInt32 = assertInt32;
function assertCompactLength(target, key) {
    return assertUInt16(target, key);
}
exports.assertCompactLength = assertCompactLength;
function assertInteger(target, key, min, max) {
    var priv = '_' + key;
    function getter() {
        return this[priv];
    }
    function setter(newVal) {
        if (this[priv] !== newVal) {
            if (newVal < min || newVal > max) {
                throw target.constructor.name + "." + key + ": " +
                    ("Integer " + newVal + " is outside the valid [" + min + ", " + max + "] interval");
            }
            this[priv] = newVal;
        }
    }
    Object.defineProperty(target, key, {
        get: getter,
        set: setter,
        enumerable: true,
        configurable: true
    });
}
function assertEnum(enumerated) {
    return function (target, key) {
        var priv = '_' + key;
        function getter() {
            return this[priv];
        }
        function setter(newVal) {
            if (this[priv] !== newVal) {
                if (enumerated[newVal] === undefined) {
                    throw target.constructor.name + "." + key + ": " + newVal + " is not enum";
                }
                this[priv] = newVal;
            }
        }
        Object.defineProperty(target, key, {
            get: getter,
            set: setter,
            enumerable: true,
            configurable: true
        });
    };
}
exports.assertEnum = assertEnum;


/***/ }),
/* 27 */,
/* 28 */,
/* 29 */,
/* 30 */,
/* 31 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
/* tslint:disable:variable-name */
var __svg__ = { filename: __webpack_require__.p +"assets/compiled_sprite.svg" };
/* tslint:enable:variable-name */
var core_1 = __webpack_require__(0);
var MapperService = (function () {
    function MapperService() {
        this.initScanCodeTextMap();
        this.initScanCodeFileName();
        this.initNameToFileNames();
    }
    MapperService.prototype.scanCodeToText = function (scanCode) {
        return this.scanCodeTextMap.get(scanCode);
    };
    MapperService.prototype.hasScancodeIcon = function (scancode) {
        return this.scanCodeFileName.has(scancode);
    };
    MapperService.prototype.scanCodeToSvgImagePath = function (scanCode) {
        var fileName = this.scanCodeFileName.get(scanCode);
        if (fileName) {
            return 'assets/compiled_sprite.svg#' + fileName;
        }
        return undefined;
    };
    MapperService.prototype.getIcon = function (iconName) {
        return 'assets/compiled_sprite.svg#' + this.nameToFileName.get(iconName);
    };
    MapperService.prototype.modifierMapper = function (x) {
        if (x < 8) {
            return Math.floor(x / 2) * 4 + 1 - x; // 1, 0, 3, 2, 5, 4, 7, 6
        }
        else {
            return x;
        }
    };
    // TODO: read the mapping from JSON
    MapperService.prototype.initScanCodeTextMap = function () {
        this.scanCodeTextMap = new Map();
        this.scanCodeTextMap.set(4, ['A']);
        this.scanCodeTextMap.set(5, ['B']);
        this.scanCodeTextMap.set(6, ['C']);
        this.scanCodeTextMap.set(7, ['D']);
        this.scanCodeTextMap.set(8, ['E']);
        this.scanCodeTextMap.set(9, ['F']);
        this.scanCodeTextMap.set(10, ['G']);
        this.scanCodeTextMap.set(11, ['H']);
        this.scanCodeTextMap.set(12, ['I']);
        this.scanCodeTextMap.set(13, ['J']);
        this.scanCodeTextMap.set(14, ['K']);
        this.scanCodeTextMap.set(15, ['L']);
        this.scanCodeTextMap.set(16, ['M']);
        this.scanCodeTextMap.set(17, ['N']);
        this.scanCodeTextMap.set(18, ['O']);
        this.scanCodeTextMap.set(19, ['P']);
        this.scanCodeTextMap.set(20, ['Q']);
        this.scanCodeTextMap.set(21, ['R']);
        this.scanCodeTextMap.set(22, ['S']);
        this.scanCodeTextMap.set(23, ['T']);
        this.scanCodeTextMap.set(24, ['U']);
        this.scanCodeTextMap.set(25, ['V']);
        this.scanCodeTextMap.set(26, ['W']);
        this.scanCodeTextMap.set(27, ['X']);
        this.scanCodeTextMap.set(28, ['Y']);
        this.scanCodeTextMap.set(29, ['Z']);
        this.scanCodeTextMap.set(30, ['1', '!']);
        this.scanCodeTextMap.set(31, ['2', '@']);
        this.scanCodeTextMap.set(32, ['3', '#']);
        this.scanCodeTextMap.set(33, ['4', '$']);
        this.scanCodeTextMap.set(34, ['5', '%']);
        this.scanCodeTextMap.set(35, ['6', '^']);
        this.scanCodeTextMap.set(36, ['7', '&']);
        this.scanCodeTextMap.set(37, ['8', '*']);
        this.scanCodeTextMap.set(38, ['9', '(']);
        this.scanCodeTextMap.set(39, ['0', ')']);
        this.scanCodeTextMap.set(40, ['Enter']);
        this.scanCodeTextMap.set(41, ['Esc']);
        this.scanCodeTextMap.set(42, ['Backspace']);
        this.scanCodeTextMap.set(43, ['Tab']);
        this.scanCodeTextMap.set(44, ['Space']);
        this.scanCodeTextMap.set(45, ['-', '_']);
        this.scanCodeTextMap.set(46, ['=', '+']);
        this.scanCodeTextMap.set(47, ['[', '{']);
        this.scanCodeTextMap.set(48, [']', '}']);
        this.scanCodeTextMap.set(49, ['\\', '|']);
        this.scanCodeTextMap.set(50, ['NON_US_HASHMARK_AND_TILDE']);
        this.scanCodeTextMap.set(51, [';', ':']);
        this.scanCodeTextMap.set(52, ['\'', '"']);
        this.scanCodeTextMap.set(53, ['`', '~']);
        this.scanCodeTextMap.set(54, [',', '<']);
        this.scanCodeTextMap.set(55, ['.', '>']);
        this.scanCodeTextMap.set(56, ['/', '?']);
        this.scanCodeTextMap.set(57, ['Caps Lock']);
        this.scanCodeTextMap.set(58, ['F1']);
        this.scanCodeTextMap.set(59, ['F2']);
        this.scanCodeTextMap.set(60, ['F3']);
        this.scanCodeTextMap.set(61, ['F4']);
        this.scanCodeTextMap.set(62, ['F5']);
        this.scanCodeTextMap.set(63, ['F6']);
        this.scanCodeTextMap.set(64, ['F7']);
        this.scanCodeTextMap.set(65, ['F8']);
        this.scanCodeTextMap.set(66, ['F9']);
        this.scanCodeTextMap.set(67, ['F10']);
        this.scanCodeTextMap.set(68, ['F11']);
        this.scanCodeTextMap.set(69, ['F12']);
        this.scanCodeTextMap.set(70, ['PrtScn']);
        this.scanCodeTextMap.set(71, ['Scroll Lock']);
        this.scanCodeTextMap.set(72, ['Pause']);
        this.scanCodeTextMap.set(73, ['Insert']);
        this.scanCodeTextMap.set(74, ['Home']);
        this.scanCodeTextMap.set(75, ['PgUp']);
        this.scanCodeTextMap.set(76, ['Del']);
        this.scanCodeTextMap.set(77, ['End']);
        this.scanCodeTextMap.set(78, ['PgDn']);
        this.scanCodeTextMap.set(79, ['Right Arrow']);
        this.scanCodeTextMap.set(80, ['Left Arrow']);
        this.scanCodeTextMap.set(81, ['Down Arrow']);
        this.scanCodeTextMap.set(82, ['Up Arrow']);
        this.scanCodeTextMap.set(83, ['Num Lock']);
        this.scanCodeTextMap.set(84, ['/']);
        this.scanCodeTextMap.set(85, ['*']);
        this.scanCodeTextMap.set(86, ['-']);
        this.scanCodeTextMap.set(87, ['+']);
        this.scanCodeTextMap.set(88, ['Enter']);
        this.scanCodeTextMap.set(89, ['end', '1']);
        this.scanCodeTextMap.set(90, ['2']);
        this.scanCodeTextMap.set(91, ['pgdn', '3']);
        this.scanCodeTextMap.set(92, ['4']);
        this.scanCodeTextMap.set(93, ['5']);
        this.scanCodeTextMap.set(94, ['6']);
        this.scanCodeTextMap.set(95, ['home', '7']);
        this.scanCodeTextMap.set(96, ['8']);
        this.scanCodeTextMap.set(97, ['pgup', '9']);
        this.scanCodeTextMap.set(98, ['Insert', '0']);
        this.scanCodeTextMap.set(99, ['Del', '.']);
        this.scanCodeTextMap.set(104, ['F13']);
        this.scanCodeTextMap.set(105, ['F14']);
        this.scanCodeTextMap.set(106, ['F15']);
        this.scanCodeTextMap.set(107, ['F16']);
        this.scanCodeTextMap.set(108, ['F17']);
        this.scanCodeTextMap.set(109, ['F18']);
        this.scanCodeTextMap.set(110, ['F19']);
        this.scanCodeTextMap.set(111, ['F20']);
        this.scanCodeTextMap.set(112, ['F21']);
        this.scanCodeTextMap.set(113, ['F22']);
        this.scanCodeTextMap.set(114, ['F23']);
        this.scanCodeTextMap.set(115, ['F24']);
        this.scanCodeTextMap.set(118, ['Menu']);
        this.scanCodeTextMap.set(176, ['00']);
        this.scanCodeTextMap.set(177, ['000']);
        this.scanCodeTextMap.set(232, ['Play']);
        this.scanCodeTextMap.set(233, ['Stop']);
        this.scanCodeTextMap.set(234, ['Prev']);
        this.scanCodeTextMap.set(235, ['Next']);
        this.scanCodeTextMap.set(236, ['Eject']);
        this.scanCodeTextMap.set(237, ['Vol +']);
        this.scanCodeTextMap.set(238, ['Vol -']);
        this.scanCodeTextMap.set(239, ['Mute']);
        this.scanCodeTextMap.set(240, ['WWW']);
        this.scanCodeTextMap.set(241, ['Bckwrd']);
        this.scanCodeTextMap.set(242, ['Frwrd']);
        this.scanCodeTextMap.set(243, ['Cancel']);
    };
    MapperService.prototype.initScanCodeFileName = function () {
        this.scanCodeFileName = new Map();
        this.scanCodeFileName.set(79, 'icon-kbd__mod--arrow-right');
        this.scanCodeFileName.set(80, 'icon-kbd__mod--arrow-left');
        this.scanCodeFileName.set(81, 'icon-kbd__mod--arrow-down');
        this.scanCodeFileName.set(82, 'icon-kbd__mod--arrow-up');
        this.scanCodeFileName.set(118, 'icon-kbd__mod--menu');
    };
    MapperService.prototype.initNameToFileNames = function () {
        this.nameToFileName = new Map();
        this.nameToFileName.set('toggle', 'icon-kbd__fn--toggle');
        this.nameToFileName.set('switch-keymap', 'icon-kbd__mod--switch-keymap');
        this.nameToFileName.set('macro', 'icon-icon__macro');
        this.nameToFileName.set('shift', 'icon-kbd__default--modifier-shift');
        this.nameToFileName.set('option', 'icon-kbd__default--modifier-option');
        this.nameToFileName.set('command', 'icon-kbd__default--modifier-command');
        this.nameToFileName.set('mouse', 'icon-kbd__mouse');
        this.nameToFileName.set('left-arrow', 'icon-kbd__mod--arrow-left');
        this.nameToFileName.set('right-arrow', 'icon-kbd__mod--arrow-right');
        this.nameToFileName.set('down-arrow', 'icon-kbd__mod--arrow-down');
        this.nameToFileName.set('up-arrow', 'icon-kbd__mod--arrow-up');
        this.nameToFileName.set('scroll-left', 'icon-kbd__mouse--scroll-left');
        this.nameToFileName.set('scroll-right', 'icon-kbd__mouse--scroll-right');
        this.nameToFileName.set('scroll-down', 'icon-kbd__mouse--scroll-down');
        this.nameToFileName.set('scroll-up', 'icon-kbd__mouse--scroll-up');
    };
    return MapperService;
}());
MapperService = __decorate([
    core_1.Injectable(),
    __metadata("design:paramtypes", [])
], MapperService);
exports.MapperService = MapperService;


/***/ }),
/* 32 */,
/* 33 */,
/* 34 */,
/* 35 */,
/* 36 */,
/* 37 */,
/* 38 */,
/* 39 */,
/* 40 */,
/* 41 */,
/* 42 */,
/* 43 */,
/* 44 */,
/* 45 */,
/* 46 */,
/* 47 */,
/* 48 */,
/* 49 */,
/* 50 */,
/* 51 */,
/* 52 */,
/* 53 */,
/* 54 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

function __export(m) {
    for (var p in m) if (!exports.hasOwnProperty(p)) exports[p] = m[p];
}
Object.defineProperty(exports, "__esModule", { value: true });
__export(__webpack_require__(1105));
__export(__webpack_require__(1106));


/***/ }),
/* 55 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
__webpack_require__(375);
var Observable_1 = __webpack_require__(1);
__webpack_require__(178);
__webpack_require__(65);
var key_action_1 = __webpack_require__(22);
var Keymap_1 = __webpack_require__(80);
var Macro_1 = __webpack_require__(194);
var UserConfiguration_1 = __webpack_require__(291);
var Layer_1 = __webpack_require__(454);
var Module_1 = __webpack_require__(456);
var actions_1 = __webpack_require__(54);
var initialState = new UserConfiguration_1.UserConfiguration();
/* tslint:disable:no-switch-case-fall-through */
// tslint bug: https://github.com/palantir/tslint/issues/1538
function default_1(state, action) {
    if (state === void 0) { state = initialState; }
    var changedUserConfiguration = Object.assign(new UserConfiguration_1.UserConfiguration(), state);
    switch (action.type) {
        case actions_1.KeymapActions.ADD:
        case actions_1.KeymapActions.DUPLICATE:
            {
                var newKeymap = new Keymap_1.Keymap(action.payload);
                newKeymap.abbreviation = generateAbbr(state.keymaps, newKeymap.abbreviation);
                newKeymap.name = generateName(state.keymaps, newKeymap.name);
                newKeymap.isDefault = (state.keymaps.length === 0);
                changedUserConfiguration.keymaps = state.keymaps.concat(newKeymap);
                break;
            }
        case actions_1.KeymapActions.EDIT_NAME:
            {
                var name_1 = generateName(state.keymaps, action.payload.name);
                changedUserConfiguration.keymaps = state.keymaps.map(function (keymap) {
                    if (keymap.abbreviation === action.payload.abbr) {
                        keymap = Object.assign(new Keymap_1.Keymap(), keymap);
                        keymap.name = name_1;
                    }
                    return keymap;
                });
                break;
            }
        case actions_1.KeymapActions.EDIT_ABBR:
            var abbr_1 = generateAbbr(state.keymaps, action.payload.newAbbr);
            changedUserConfiguration.keymaps = state.keymaps.map(function (keymap) {
                if (keymap.abbreviation === action.payload.abbr) {
                    keymap = Object.assign(new Keymap_1.Keymap(), keymap);
                    keymap.abbreviation = abbr_1;
                }
                else {
                    keymap = keymap.renameKeymap(action.payload.abbr, action.payload.newAbbr);
                }
                return keymap;
            });
            break;
        case actions_1.KeymapActions.SET_DEFAULT:
            changedUserConfiguration.keymaps = state.keymaps.map(function (keymap) {
                if (keymap.abbreviation === action.payload || keymap.isDefault) {
                    keymap = Object.assign(new Keymap_1.Keymap(), keymap);
                    keymap.isDefault = keymap.abbreviation === action.payload;
                }
                return keymap;
            });
            break;
        case actions_1.KeymapActions.REMOVE:
            var isDefault_1;
            var filtered = state.keymaps.filter(function (keymap) {
                if (keymap.abbreviation === action.payload) {
                    isDefault_1 = keymap.isDefault;
                    return false;
                }
                return true;
            });
            // If deleted one is default set default keymap to the first on the list of keymaps
            if (isDefault_1 && filtered.length > 0) {
                filtered[0].isDefault = true;
            }
            // Check for the deleted keymap in other keymaps
            changedUserConfiguration.keymaps = filtered.map(function (keymap) {
                keymap = Object.assign(new Keymap_1.Keymap(), keymap);
                keymap.layers = checkExistence(keymap.layers, 'keymapAbbreviation', action.payload);
                return keymap;
            });
            break;
        case actions_1.KeymapActions.SAVE_KEY:
            {
                var newKeymap_1 = Object.assign(new Keymap_1.Keymap(), action.payload.keymap);
                newKeymap_1.layers = newKeymap_1.layers.slice();
                var layerIndex = action.payload.layer;
                var newLayer = Object.assign(new Layer_1.Layer(), newKeymap_1.layers[layerIndex]);
                newKeymap_1.layers[layerIndex] = newLayer;
                var moduleIndex = action.payload.module;
                var newModule = Object.assign(new Module_1.Module(), newLayer.modules[moduleIndex]);
                newLayer.modules = newLayer.modules.slice();
                newLayer.modules[moduleIndex] = newModule;
                var keyIndex = action.payload.key;
                newModule.keyActions = newModule.keyActions.slice();
                newModule.keyActions[keyIndex] = key_action_1.Helper.createKeyAction(action.payload.keyAction);
                changedUserConfiguration.keymaps = state.keymaps.map(function (keymap) {
                    if (keymap.abbreviation === newKeymap_1.abbreviation) {
                        keymap = newKeymap_1;
                    }
                    return keymap;
                });
                break;
            }
        case actions_1.KeymapActions.CHECK_MACRO:
            changedUserConfiguration.keymaps = state.keymaps.map(function (keymap) {
                keymap = Object.assign(new Keymap_1.Keymap(), keymap);
                keymap.layers = checkExistence(keymap.layers, '_macroId', action.payload);
                return keymap;
            });
            break;
        case actions_1.MacroActions.ADD:
            {
                var newMacro = new Macro_1.Macro();
                newMacro.id = generateMacroId(state.macros);
                newMacro.name = generateName(state.macros, 'New macro');
                newMacro.isLooped = false;
                newMacro.isPrivate = true;
                newMacro.macroActions = [];
                changedUserConfiguration.macros = state.macros.concat(newMacro);
                break;
            }
        case actions_1.MacroActions.DUPLICATE:
            {
                var newMacro = new Macro_1.Macro(action.payload);
                newMacro.name = generateName(state.macros, newMacro.name);
                newMacro.id = generateMacroId(state.macros);
                changedUserConfiguration.macros = state.macros.concat(newMacro);
                break;
            }
        case actions_1.MacroActions.EDIT_NAME:
            {
                var name_2 = generateName(state.macros, action.payload.name);
                changedUserConfiguration.macros = state.macros.map(function (macro) {
                    if (macro.id === action.payload.id) {
                        macro.name = name_2;
                    }
                    return macro;
                });
                break;
            }
        case actions_1.MacroActions.REMOVE:
            changedUserConfiguration.macros = state.macros.filter(function (macro) { return macro.id !== action.payload; });
            break;
        case actions_1.MacroActions.ADD_ACTION:
            changedUserConfiguration.macros = state.macros.map(function (macro) {
                if (macro.id === action.payload.id) {
                    macro = new Macro_1.Macro(macro);
                    macro.macroActions.push(action.payload.action);
                }
                return macro;
            });
            break;
        case actions_1.MacroActions.SAVE_ACTION:
            changedUserConfiguration.macros = state.macros.map(function (macro) {
                if (macro.id === action.payload.id) {
                    macro = new Macro_1.Macro(macro);
                    macro.macroActions[action.payload.index] = action.payload.action;
                }
                return macro;
            });
            break;
        case actions_1.MacroActions.DELETE_ACTION:
            changedUserConfiguration.macros = state.macros.map(function (macro) {
                if (macro.id === action.payload.id) {
                    macro = new Macro_1.Macro(macro);
                    macro.macroActions.splice(action.payload.index, 1);
                }
                return macro;
            });
            break;
        case actions_1.MacroActions.REORDER_ACTION:
            changedUserConfiguration.macros = state.macros.map(function (macro) {
                if (macro.id === action.payload.id) {
                    var newIndex = action.payload.newIndex;
                    // We need to reduce the new index for one when we are moving action down
                    if (newIndex > action.payload.oldIndex) {
                        --newIndex;
                    }
                    macro = new Macro_1.Macro(macro);
                    macro.macroActions.splice(newIndex, 0, macro.macroActions.splice(action.payload.oldIndex, 1)[0]);
                }
                return macro;
            });
            break;
        default:
            break;
    }
    return changedUserConfiguration;
}
exports.default = default_1;
function getUserConfiguration() {
    return function (state$) { return state$
        .select(function (state) { return state.userConfiguration; }); };
}
exports.getUserConfiguration = getUserConfiguration;
function getKeymaps() {
    return function (state$) { return state$
        .select(function (state) { return state.userConfiguration.keymaps; }); };
}
exports.getKeymaps = getKeymaps;
function getKeymap(abbr) {
    if (abbr === undefined) {
        return getDefaultKeymap();
    }
    return function (state$) { return getKeymaps()(state$)
        .map(function (keymaps) {
        return keymaps.find(function (keymap) { return keymap.abbreviation === abbr; });
    }); };
}
exports.getKeymap = getKeymap;
function getDefaultKeymap() {
    return function (state$) { return getKeymaps()(state$)
        .map(function (keymaps) {
        return keymaps.find(function (keymap) { return keymap.isDefault; });
    }); };
}
exports.getDefaultKeymap = getDefaultKeymap;
function getMacros() {
    return function (state$) { return state$
        .select(function (state) { return state.userConfiguration.macros; }); };
}
exports.getMacros = getMacros;
function getMacro(id) {
    if (isNaN(id)) {
        return function () { return Observable_1.Observable.of(undefined); };
    }
    else {
        return function (state$) { return getMacros()(state$)
            .map(function (macros) { return macros.find(function (macro) { return macro.id === id; }); }); };
    }
}
exports.getMacro = getMacro;
function generateAbbr(keymaps, abbr) {
    var chars = '23456789ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('');
    var position = 0;
    while (keymaps.some(function (keymap) { return keymap.abbreviation === abbr; })) {
        abbr = abbr.substring(0, abbr.length - 1) + chars[position];
        ++position;
    }
    return abbr;
}
function generateName(items, name) {
    var suffix = 2;
    var oldName = name;
    while (items.some(function (item) { return item.name === name; })) {
        name = oldName + (" (" + suffix + ")");
        ++suffix;
    }
    return name;
}
function generateMacroId(macros) {
    var newId = 0;
    macros.forEach(function (macro) {
        if (macro.id > newId) {
            newId = macro.id;
        }
    });
    return newId + 1;
}
function checkExistence(layers, property, value) {
    var newLayers = layers.map(function (layer) {
        var newLayer = new Layer_1.Layer(layer);
        newLayer.modules = layer.modules.map(function (module) {
            module.keyActions.forEach(function (action, index) {
                if (action && action.hasOwnProperty(property) && action[property] === value) {
                    module.keyActions[index] = undefined;
                }
            });
            return module;
        });
        return newLayer;
    });
    return newLayers;
}


/***/ }),
/* 56 */,
/* 57 */,
/* 58 */,
/* 59 */,
/* 60 */,
/* 61 */,
/* 62 */,
/* 63 */,
/* 64 */,
/* 65 */,
/* 66 */,
/* 67 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
var core_1 = __webpack_require__(0);
var Tab = (function () {
    function Tab() {
        this.validAction = new core_1.EventEmitter();
    }
    return Tab;
}());
__decorate([
    core_1.Output(),
    __metadata("design:type", Object)
], Tab.prototype, "validAction", void 0);
exports.Tab = Tab;


/***/ }),
/* 68 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var MacroActionId;
(function (MacroActionId) {
    MacroActionId[MacroActionId["KeyMacroAction"] = 0] = "KeyMacroAction";
    /*
        0 - 8 are reserved for KeyMacroAction
        PressKeyMacroAction with scancode:                  0
        PressKeyMacroAction with modifiers:                 1
        PressKeyMacroAction with scancode and modifiers     2
        HoldKeyMacroAction with scancode:                   3
        HoldKeyMacroAction with modifiers:                  4
        HoldKeyMacroAction with scancode and modifiers      5
        ReleaseKeyMacroAction with scancode:                6
        ReleaseKeyMacroAction with modifiers:               7
        ReleaseKeyMacroAction with scancode and modifiers   8
    */
    MacroActionId[MacroActionId["LastKeyMacroAction"] = 8] = "LastKeyMacroAction";
    MacroActionId[MacroActionId["MouseButtonMacroAction"] = 9] = "MouseButtonMacroAction";
    /*
        9 - 11 are reserved for MouseButtonMacroAction
        PressMouseButtonsMacroAction    =  9,
        HoldMouseButtonsMacroAction     = 10,
        ReleaseMouseButtonsMacroAction  = 11,
    */
    MacroActionId[MacroActionId["LastMouseButtonMacroAction"] = 11] = "LastMouseButtonMacroAction";
    MacroActionId[MacroActionId["MoveMouseMacroAction"] = 12] = "MoveMouseMacroAction";
    MacroActionId[MacroActionId["ScrollMouseMacroAction"] = 13] = "ScrollMouseMacroAction";
    MacroActionId[MacroActionId["DelayMacroAction"] = 14] = "DelayMacroAction";
    MacroActionId[MacroActionId["TextMacroAction"] = 15] = "TextMacroAction";
})(MacroActionId = exports.MacroActionId || (exports.MacroActionId = {}));
var MacroSubAction;
(function (MacroSubAction) {
    MacroSubAction[MacroSubAction["press"] = 0] = "press";
    MacroSubAction[MacroSubAction["hold"] = 1] = "hold";
    MacroSubAction[MacroSubAction["release"] = 2] = "release";
})(MacroSubAction = exports.MacroSubAction || (exports.MacroSubAction = {}));
exports.macroActionType = {
    KeyMacroAction: 'key',
    MouseButtonMacroAction: 'mouseButton',
    MoveMouseMacroAction: 'moveMouse',
    ScrollMouseMacroAction: 'scrollMouse',
    DelayMacroAction: 'delay',
    TextMacroAction: 'text'
};
var MacroAction = (function () {
    function MacroAction() {
    }
    MacroAction.prototype.assertMacroActionType = function (jsObject) {
        var macroActionClassname = this.constructor.name;
        var macroActionTypeString = exports.macroActionType[macroActionClassname];
        if (jsObject.macroActionType !== macroActionTypeString) {
            throw "Invalid " + macroActionClassname + ".macroActionType: " + jsObject.macroActionType;
        }
    };
    MacroAction.prototype.readAndAssertMacroActionId = function (buffer) {
        var classname = this.constructor.name;
        var readMacroActionId = buffer.readUInt8();
        var macroActionId = MacroActionId[classname];
        if (macroActionId === MacroActionId.KeyMacroAction) {
            if (readMacroActionId < MacroActionId.KeyMacroAction || readMacroActionId > MacroActionId.LastKeyMacroAction) {
                throw "Invalid " + classname + " first byte: " + readMacroActionId;
            }
        }
        else if (macroActionId === MacroActionId.MouseButtonMacroAction) {
            if (readMacroActionId < MacroActionId.MouseButtonMacroAction ||
                readMacroActionId > MacroActionId.LastMouseButtonMacroAction) {
                throw "Invalid " + classname + " first byte: " + readMacroActionId;
            }
        }
        else if (readMacroActionId !== macroActionId) {
            throw "Invalid " + classname + " first byte: " + readMacroActionId;
        }
        return readMacroActionId;
    };
    return MacroAction;
}());
exports.MacroAction = MacroAction;


/***/ }),
/* 69 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

function __export(m) {
    for (var p in m) if (!exports.hasOwnProperty(p)) exports[p] = m[p];
}
Object.defineProperty(exports, "__esModule", { value: true });
__export(__webpack_require__(457));
__export(__webpack_require__(1100));
__export(__webpack_require__(458));
__export(__webpack_require__(68));
__export(__webpack_require__(460));
__export(__webpack_require__(459));
__export(__webpack_require__(461));
__export(__webpack_require__(462));
__export(__webpack_require__(1101));


/***/ }),
/* 70 */,
/* 71 */,
/* 72 */,
/* 73 */,
/* 74 */,
/* 75 */,
/* 76 */,
/* 77 */,
/* 78 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
// a duplex stream is just a stream that is both readable and writable.
// Since JS doesn't have multiple prototypal inheritance, this class
// prototypally inherits from Readable, and then parasitically from
// Writable.



/*<replacement>*/

var objectKeys = Object.keys || function (obj) {
  var keys = [];
  for (var key in obj) {
    keys.push(key);
  }return keys;
};
/*</replacement>*/

module.exports = Duplex;

/*<replacement>*/
var processNextTick = __webpack_require__(268);
/*</replacement>*/

/*<replacement>*/
var util = __webpack_require__(120);
util.inherits = __webpack_require__(92);
/*</replacement>*/

var Readable = __webpack_require__(408);
var Writable = __webpack_require__(271);

util.inherits(Duplex, Readable);

var keys = objectKeys(Writable.prototype);
for (var v = 0; v < keys.length; v++) {
  var method = keys[v];
  if (!Duplex.prototype[method]) Duplex.prototype[method] = Writable.prototype[method];
}

function Duplex(options) {
  if (!(this instanceof Duplex)) return new Duplex(options);

  Readable.call(this, options);
  Writable.call(this, options);

  if (options && options.readable === false) this.readable = false;

  if (options && options.writable === false) this.writable = false;

  this.allowHalfOpen = true;
  if (options && options.allowHalfOpen === false) this.allowHalfOpen = false;

  this.once('end', onend);
}

// the no-half-open enforcer
function onend() {
  // if we allow half-open state, or if the writable side ended,
  // then we're ok.
  if (this.allowHalfOpen || this._writableState.ended) return;

  // no more data can be written.
  // But allow more writes to happen in this tick.
  processNextTick(onEndNT, this);
}

function onEndNT(self) {
  self.end();
}

function forEach(xs, f) {
  for (var i = 0, l = xs.length; i < l; i++) {
    f(xs[i], i);
  }
}

/***/ }),
/* 79 */,
/* 80 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var Layer_1 = __webpack_require__(454);
var Keymap = (function () {
    function Keymap(keymap) {
        if (!keymap) {
            return;
        }
        this.name = keymap.name;
        this.description = keymap.description;
        this.abbreviation = keymap.abbreviation;
        this.isDefault = keymap.isDefault;
        this.layers = keymap.layers.map(function (layer) { return new Layer_1.Layer(layer); });
    }
    Keymap.prototype.fromJsonObject = function (jsonObject, macros) {
        this.isDefault = jsonObject.isDefault;
        this.abbreviation = jsonObject.abbreviation;
        this.name = jsonObject.name;
        this.description = jsonObject.description;
        this.layers = jsonObject.layers.map(function (layer) { return new Layer_1.Layer().fromJsonObject(layer, macros); });
        return this;
    };
    Keymap.prototype.fromBinary = function (buffer, macros) {
        this.abbreviation = buffer.readString();
        this.isDefault = buffer.readBoolean();
        this.name = buffer.readString();
        this.description = buffer.readString();
        this.layers = buffer.readArray(function (uhkBuffer) {
            return new Layer_1.Layer().fromBinary(uhkBuffer, macros);
        });
        return this;
    };
    Keymap.prototype.toJsonObject = function (macros) {
        return {
            isDefault: this.isDefault,
            abbreviation: this.abbreviation,
            name: this.name,
            description: this.description,
            layers: this.layers.map(function (layer) { return layer.toJsonObject(macros); })
        };
    };
    Keymap.prototype.toBinary = function (buffer, macros) {
        buffer.writeString(this.abbreviation);
        buffer.writeBoolean(this.isDefault);
        buffer.writeString(this.name);
        buffer.writeString(this.description);
        buffer.writeArray(this.layers, function (uhkBuffer, layer) {
            layer.toBinary(uhkBuffer, macros);
        });
    };
    Keymap.prototype.toString = function () {
        return "<Keymap abbreviation=\"" + this.abbreviation + "\" name=\"" + this.name + "\">";
    };
    Keymap.prototype.renameKeymap = function (oldAbbr, newAbbr) {
        var _this = this;
        var layers;
        var layerModified = false;
        this.layers.forEach(function (layer, index) {
            var newLayer = layer.renameKeymap(oldAbbr, newAbbr);
            if (newLayer !== layer) {
                if (!layerModified) {
                    layers = _this.layers.slice();
                    layerModified = true;
                }
                layers[index] = newLayer;
            }
        });
        if (layerModified) {
            var newKeymap = Object.assign(new Keymap(), this);
            newKeymap.layers = layers;
            return newKeymap;
        }
        return this;
    };
    return Keymap;
}());
exports.Keymap = Keymap;


/***/ }),
/* 81 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/// <reference path="../../Function.d.ts" />

Object.defineProperty(exports, "__esModule", { value: true });
var KeyActionId;
(function (KeyActionId) {
    KeyActionId[KeyActionId["NoneAction"] = 0] = "NoneAction";
    KeyActionId[KeyActionId["KeystrokeAction"] = 1] = "KeystrokeAction";
    /*
        1 - 7 are reserved for KeystrokeAction
        3 bits:
            1: Do we have scancode?
            2: Do we have modifiers?
            3: Do we have longpress?
    */
    KeyActionId[KeyActionId["LastKeystrokeAction"] = 7] = "LastKeystrokeAction";
    KeyActionId[KeyActionId["SwitchLayerAction"] = 8] = "SwitchLayerAction";
    KeyActionId[KeyActionId["SwitchKeymapAction"] = 9] = "SwitchKeymapAction";
    KeyActionId[KeyActionId["MouseAction"] = 10] = "MouseAction";
    KeyActionId[KeyActionId["PlayMacroAction"] = 11] = "PlayMacroAction";
})(KeyActionId = exports.KeyActionId || (exports.KeyActionId = {}));
exports.keyActionType = {
    NoneAction: 'none',
    KeystrokeAction: 'keystroke',
    SwitchLayerAction: 'switchLayer',
    SwitchKeymapAction: 'switchKeymap',
    MouseAction: 'mouse',
    PlayMacroAction: 'playMacro'
};
var KeyAction = (function () {
    function KeyAction() {
    }
    KeyAction.prototype.assertKeyActionType = function (jsObject) {
        var keyActionClassname = this.constructor.name;
        var keyActionTypeString = exports.keyActionType[keyActionClassname];
        if (jsObject.keyActionType !== keyActionTypeString) {
            throw "Invalid " + keyActionClassname + ".keyActionType: " + jsObject.keyActionType;
        }
    };
    KeyAction.prototype.readAndAssertKeyActionId = function (buffer) {
        var classname = this.constructor.name;
        var readKeyActionId = buffer.readUInt8();
        var keyActionId = KeyActionId[classname];
        if (keyActionId === KeyActionId.KeystrokeAction) {
            if (readKeyActionId < KeyActionId.KeystrokeAction || readKeyActionId > KeyActionId.LastKeystrokeAction) {
                throw "Invalid " + classname + " first byte: " + readKeyActionId;
            }
        }
        else if (readKeyActionId !== keyActionId) {
            throw "Invalid " + classname + " first byte: " + readKeyActionId;
        }
        return readKeyActionId;
    };
    KeyAction.prototype.renameKeymap = function (oldAbbr, newAbbr) {
        return this;
    };
    return KeyAction;
}());
exports.KeyAction = KeyAction;


/***/ }),
/* 82 */,
/* 83 */,
/* 84 */,
/* 85 */,
/* 86 */,
/* 87 */,
/* 88 */,
/* 89 */,
/* 90 */,
/* 91 */,
/* 92 */
/***/ (function(module, exports) {

if (typeof Object.create === 'function') {
  // implementation from standard node.js 'util' module
  module.exports = function inherits(ctor, superCtor) {
    ctor.super_ = superCtor
    ctor.prototype = Object.create(superCtor.prototype, {
      constructor: {
        value: ctor,
        enumerable: false,
        writable: true,
        configurable: true
      }
    });
  };
} else {
  // old school shim for old browsers
  module.exports = function inherits(ctor, superCtor) {
    ctor.super_ = superCtor
    var TempCtor = function () {}
    TempCtor.prototype = superCtor.prototype
    ctor.prototype = new TempCtor()
    ctor.prototype.constructor = ctor
  }
}


/***/ }),
/* 93 */,
/* 94 */,
/* 95 */,
/* 96 */,
/* 97 */,
/* 98 */,
/* 99 */,
/* 100 */,
/* 101 */,
/* 102 */,
/* 103 */,
/* 104 */,
/* 105 */,
/* 106 */,
/* 107 */,
/* 108 */,
/* 109 */,
/* 110 */,
/* 111 */,
/* 112 */,
/* 113 */,
/* 114 */,
/* 115 */,
/* 116 */,
/* 117 */,
/* 118 */,
/* 119 */,
/* 120 */
/***/ (function(module, exports, __webpack_require__) {

/* WEBPACK VAR INJECTION */(function(Buffer) {// Copyright Joyent, Inc. and other Node contributors.
//
// Permission is hereby granted, free of charge, to any person obtaining a
// copy of this software and associated documentation files (the
// "Software"), to deal in the Software without restriction, including
// without limitation the rights to use, copy, modify, merge, publish,
// distribute, sublicense, and/or sell copies of the Software, and to permit
// persons to whom the Software is furnished to do so, subject to the
// following conditions:
//
// The above copyright notice and this permission notice shall be included
// in all copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS
// OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
// MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN
// NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM,
// DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR
// OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE
// USE OR OTHER DEALINGS IN THE SOFTWARE.

// NOTE: These type checking functions intentionally don't use `instanceof`
// because it is fragile and can be easily faked with `Object.create()`.

function isArray(arg) {
  if (Array.isArray) {
    return Array.isArray(arg);
  }
  return objectToString(arg) === '[object Array]';
}
exports.isArray = isArray;

function isBoolean(arg) {
  return typeof arg === 'boolean';
}
exports.isBoolean = isBoolean;

function isNull(arg) {
  return arg === null;
}
exports.isNull = isNull;

function isNullOrUndefined(arg) {
  return arg == null;
}
exports.isNullOrUndefined = isNullOrUndefined;

function isNumber(arg) {
  return typeof arg === 'number';
}
exports.isNumber = isNumber;

function isString(arg) {
  return typeof arg === 'string';
}
exports.isString = isString;

function isSymbol(arg) {
  return typeof arg === 'symbol';
}
exports.isSymbol = isSymbol;

function isUndefined(arg) {
  return arg === void 0;
}
exports.isUndefined = isUndefined;

function isRegExp(re) {
  return objectToString(re) === '[object RegExp]';
}
exports.isRegExp = isRegExp;

function isObject(arg) {
  return typeof arg === 'object' && arg !== null;
}
exports.isObject = isObject;

function isDate(d) {
  return objectToString(d) === '[object Date]';
}
exports.isDate = isDate;

function isError(e) {
  return (objectToString(e) === '[object Error]' || e instanceof Error);
}
exports.isError = isError;

function isFunction(arg) {
  return typeof arg === 'function';
}
exports.isFunction = isFunction;

function isPrimitive(arg) {
  return arg === null ||
         typeof arg === 'boolean' ||
         typeof arg === 'number' ||
         typeof arg === 'string' ||
         typeof arg === 'symbol' ||  // ES6 symbol
         typeof arg === 'undefined';
}
exports.isPrimitive = isPrimitive;

exports.isBuffer = Buffer.isBuffer;

function objectToString(o) {
  return Object.prototype.toString.call(o);
}

/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(56).Buffer))

/***/ }),
/* 121 */,
/* 122 */,
/* 123 */,
/* 124 */,
/* 125 */,
/* 126 */,
/* 127 */,
/* 128 */,
/* 129 */,
/* 130 */,
/* 131 */,
/* 132 */,
/* 133 */,
/* 134 */,
/* 135 */,
/* 136 */,
/* 137 */,
/* 138 */,
/* 139 */,
/* 140 */,
/* 141 */,
/* 142 */,
/* 143 */,
/* 144 */,
/* 145 */,
/* 146 */,
/* 147 */,
/* 148 */,
/* 149 */,
/* 150 */,
/* 151 */,
/* 152 */,
/* 153 */,
/* 154 */,
/* 155 */,
/* 156 */,
/* 157 */,
/* 158 */,
/* 159 */,
/* 160 */,
/* 161 */,
/* 162 */,
/* 163 */,
/* 164 */,
/* 165 */,
/* 166 */,
/* 167 */,
/* 168 */,
/* 169 */,
/* 170 */,
/* 171 */,
/* 172 */,
/* 173 */,
/* 174 */,
/* 175 */
/***/ (function(module, exports) {

// Copyright Joyent, Inc. and other Node contributors.
//
// Permission is hereby granted, free of charge, to any person obtaining a
// copy of this software and associated documentation files (the
// "Software"), to deal in the Software without restriction, including
// without limitation the rights to use, copy, modify, merge, publish,
// distribute, sublicense, and/or sell copies of the Software, and to permit
// persons to whom the Software is furnished to do so, subject to the
// following conditions:
//
// The above copyright notice and this permission notice shall be included
// in all copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS
// OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
// MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN
// NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM,
// DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR
// OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE
// USE OR OTHER DEALINGS IN THE SOFTWARE.

function EventEmitter() {
  this._events = this._events || {};
  this._maxListeners = this._maxListeners || undefined;
}
module.exports = EventEmitter;

// Backwards-compat with node 0.10.x
EventEmitter.EventEmitter = EventEmitter;

EventEmitter.prototype._events = undefined;
EventEmitter.prototype._maxListeners = undefined;

// By default EventEmitters will print a warning if more than 10 listeners are
// added to it. This is a useful default which helps finding memory leaks.
EventEmitter.defaultMaxListeners = 10;

// Obviously not all Emitters should be limited to 10. This function allows
// that to be increased. Set to zero for unlimited.
EventEmitter.prototype.setMaxListeners = function(n) {
  if (!isNumber(n) || n < 0 || isNaN(n))
    throw TypeError('n must be a positive number');
  this._maxListeners = n;
  return this;
};

EventEmitter.prototype.emit = function(type) {
  var er, handler, len, args, i, listeners;

  if (!this._events)
    this._events = {};

  // If there is no 'error' event listener then throw.
  if (type === 'error') {
    if (!this._events.error ||
        (isObject(this._events.error) && !this._events.error.length)) {
      er = arguments[1];
      if (er instanceof Error) {
        throw er; // Unhandled 'error' event
      } else {
        // At least give some kind of context to the user
        var err = new Error('Uncaught, unspecified "error" event. (' + er + ')');
        err.context = er;
        throw err;
      }
    }
  }

  handler = this._events[type];

  if (isUndefined(handler))
    return false;

  if (isFunction(handler)) {
    switch (arguments.length) {
      // fast cases
      case 1:
        handler.call(this);
        break;
      case 2:
        handler.call(this, arguments[1]);
        break;
      case 3:
        handler.call(this, arguments[1], arguments[2]);
        break;
      // slower
      default:
        args = Array.prototype.slice.call(arguments, 1);
        handler.apply(this, args);
    }
  } else if (isObject(handler)) {
    args = Array.prototype.slice.call(arguments, 1);
    listeners = handler.slice();
    len = listeners.length;
    for (i = 0; i < len; i++)
      listeners[i].apply(this, args);
  }

  return true;
};

EventEmitter.prototype.addListener = function(type, listener) {
  var m;

  if (!isFunction(listener))
    throw TypeError('listener must be a function');

  if (!this._events)
    this._events = {};

  // To avoid recursion in the case that type === "newListener"! Before
  // adding it to the listeners, first emit "newListener".
  if (this._events.newListener)
    this.emit('newListener', type,
              isFunction(listener.listener) ?
              listener.listener : listener);

  if (!this._events[type])
    // Optimize the case of one listener. Don't need the extra array object.
    this._events[type] = listener;
  else if (isObject(this._events[type]))
    // If we've already got an array, just append.
    this._events[type].push(listener);
  else
    // Adding the second element, need to change to array.
    this._events[type] = [this._events[type], listener];

  // Check for listener leak
  if (isObject(this._events[type]) && !this._events[type].warned) {
    if (!isUndefined(this._maxListeners)) {
      m = this._maxListeners;
    } else {
      m = EventEmitter.defaultMaxListeners;
    }

    if (m && m > 0 && this._events[type].length > m) {
      this._events[type].warned = true;
      console.error('(node) warning: possible EventEmitter memory ' +
                    'leak detected. %d listeners added. ' +
                    'Use emitter.setMaxListeners() to increase limit.',
                    this._events[type].length);
      if (typeof console.trace === 'function') {
        // not supported in IE 10
        console.trace();
      }
    }
  }

  return this;
};

EventEmitter.prototype.on = EventEmitter.prototype.addListener;

EventEmitter.prototype.once = function(type, listener) {
  if (!isFunction(listener))
    throw TypeError('listener must be a function');

  var fired = false;

  function g() {
    this.removeListener(type, g);

    if (!fired) {
      fired = true;
      listener.apply(this, arguments);
    }
  }

  g.listener = listener;
  this.on(type, g);

  return this;
};

// emits a 'removeListener' event iff the listener was removed
EventEmitter.prototype.removeListener = function(type, listener) {
  var list, position, length, i;

  if (!isFunction(listener))
    throw TypeError('listener must be a function');

  if (!this._events || !this._events[type])
    return this;

  list = this._events[type];
  length = list.length;
  position = -1;

  if (list === listener ||
      (isFunction(list.listener) && list.listener === listener)) {
    delete this._events[type];
    if (this._events.removeListener)
      this.emit('removeListener', type, listener);

  } else if (isObject(list)) {
    for (i = length; i-- > 0;) {
      if (list[i] === listener ||
          (list[i].listener && list[i].listener === listener)) {
        position = i;
        break;
      }
    }

    if (position < 0)
      return this;

    if (list.length === 1) {
      list.length = 0;
      delete this._events[type];
    } else {
      list.splice(position, 1);
    }

    if (this._events.removeListener)
      this.emit('removeListener', type, listener);
  }

  return this;
};

EventEmitter.prototype.removeAllListeners = function(type) {
  var key, listeners;

  if (!this._events)
    return this;

  // not listening for removeListener, no need to emit
  if (!this._events.removeListener) {
    if (arguments.length === 0)
      this._events = {};
    else if (this._events[type])
      delete this._events[type];
    return this;
  }

  // emit removeListener for all listeners on all events
  if (arguments.length === 0) {
    for (key in this._events) {
      if (key === 'removeListener') continue;
      this.removeAllListeners(key);
    }
    this.removeAllListeners('removeListener');
    this._events = {};
    return this;
  }

  listeners = this._events[type];

  if (isFunction(listeners)) {
    this.removeListener(type, listeners);
  } else if (listeners) {
    // LIFO order
    while (listeners.length)
      this.removeListener(type, listeners[listeners.length - 1]);
  }
  delete this._events[type];

  return this;
};

EventEmitter.prototype.listeners = function(type) {
  var ret;
  if (!this._events || !this._events[type])
    ret = [];
  else if (isFunction(this._events[type]))
    ret = [this._events[type]];
  else
    ret = this._events[type].slice();
  return ret;
};

EventEmitter.prototype.listenerCount = function(type) {
  if (this._events) {
    var evlistener = this._events[type];

    if (isFunction(evlistener))
      return 1;
    else if (evlistener)
      return evlistener.length;
  }
  return 0;
};

EventEmitter.listenerCount = function(emitter, type) {
  return emitter.listenerCount(type);
};

function isFunction(arg) {
  return typeof arg === 'function';
}

function isNumber(arg) {
  return typeof arg === 'number';
}

function isObject(arg) {
  return typeof arg === 'object' && arg !== null;
}

function isUndefined(arg) {
  return arg === void 0;
}


/***/ }),
/* 176 */,
/* 177 */,
/* 178 */,
/* 179 */,
/* 180 */,
/* 181 */,
/* 182 */,
/* 183 */,
/* 184 */,
/* 185 */,
/* 186 */,
/* 187 */,
/* 188 */,
/* 189 */,
/* 190 */,
/* 191 */
/***/ (function(module, exports, __webpack_require__) {

// Copyright Joyent, Inc. and other Node contributors.
//
// Permission is hereby granted, free of charge, to any person obtaining a
// copy of this software and associated documentation files (the
// "Software"), to deal in the Software without restriction, including
// without limitation the rights to use, copy, modify, merge, publish,
// distribute, sublicense, and/or sell copies of the Software, and to permit
// persons to whom the Software is furnished to do so, subject to the
// following conditions:
//
// The above copyright notice and this permission notice shall be included
// in all copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS
// OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
// MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN
// NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM,
// DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR
// OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE
// USE OR OTHER DEALINGS IN THE SOFTWARE.

module.exports = Stream;

var EE = __webpack_require__(175).EventEmitter;
var inherits = __webpack_require__(92);

inherits(Stream, EE);
Stream.Readable = __webpack_require__(759);
Stream.Writable = __webpack_require__(761);
Stream.Duplex = __webpack_require__(756);
Stream.Transform = __webpack_require__(760);
Stream.PassThrough = __webpack_require__(758);

// Backwards-compat with node 0.4.x
Stream.Stream = Stream;



// old-style streams.  Note that the pipe method (the only relevant
// part of this class) is overridden in the Readable class.

function Stream() {
  EE.call(this);
}

Stream.prototype.pipe = function(dest, options) {
  var source = this;

  function ondata(chunk) {
    if (dest.writable) {
      if (false === dest.write(chunk) && source.pause) {
        source.pause();
      }
    }
  }

  source.on('data', ondata);

  function ondrain() {
    if (source.readable && source.resume) {
      source.resume();
    }
  }

  dest.on('drain', ondrain);

  // If the 'end' option is not supplied, dest.end() will be called when
  // source gets the 'end' or 'close' events.  Only dest.end() once.
  if (!dest._isStdio && (!options || options.end !== false)) {
    source.on('end', onend);
    source.on('close', onclose);
  }

  var didOnEnd = false;
  function onend() {
    if (didOnEnd) return;
    didOnEnd = true;

    dest.end();
  }


  function onclose() {
    if (didOnEnd) return;
    didOnEnd = true;

    if (typeof dest.destroy === 'function') dest.destroy();
  }

  // don't leave dangling pipes when there are errors.
  function onerror(er) {
    cleanup();
    if (EE.listenerCount(this, 'error') === 0) {
      throw er; // Unhandled stream error in pipe.
    }
  }

  source.on('error', onerror);
  dest.on('error', onerror);

  // remove all the event listeners that were added.
  function cleanup() {
    source.removeListener('data', ondata);
    dest.removeListener('drain', ondrain);

    source.removeListener('end', onend);
    source.removeListener('close', onclose);

    source.removeListener('error', onerror);
    dest.removeListener('error', onerror);

    source.removeListener('end', cleanup);
    source.removeListener('close', cleanup);

    dest.removeListener('close', cleanup);
  }

  source.on('end', cleanup);
  source.on('close', cleanup);

  dest.on('close', cleanup);

  dest.emit('pipe', source);

  // Allow for unix-like usage: A.pipe(B).pipe(C)
  return dest;
};


/***/ }),
/* 192 */,
/* 193 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

function __export(m) {
    for (var p in m) if (!exports.hasOwnProperty(p)) exports[p] = m[p];
}
Object.defineProperty(exports, "__esModule", { value: true });
__export(__webpack_require__(67));
var keymap_1 = __webpack_require__(1040);
exports.KeymapTabComponent = keymap_1.KeymapTabComponent;
var keypress_1 = __webpack_require__(1042);
exports.KeypressTabComponent = keypress_1.KeypressTabComponent;
var layer_1 = __webpack_require__(1044);
exports.LayerTabComponent = layer_1.LayerTabComponent;
var macro_1 = __webpack_require__(1046);
exports.MacroTabComponent = macro_1.MacroTabComponent;
var mouse_1 = __webpack_require__(1048);
exports.MouseTabComponent = mouse_1.MouseTabComponent;
var none_1 = __webpack_require__(1050);
exports.NoneTabComponent = none_1.NoneTabComponent;


/***/ }),
/* 194 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
var assert_1 = __webpack_require__(26);
var macro_action_1 = __webpack_require__(69);
var Macro = (function () {
    function Macro(other) {
        if (!other) {
            return;
        }
        this.id = other.id;
        this.isLooped = other.isLooped;
        this.isPrivate = other.isPrivate;
        this.name = other.name;
        this.macroActions = other.macroActions.map(function (macroAction) { return macro_action_1.Helper.createMacroAction(macroAction); });
    }
    Macro.prototype.fromJsonObject = function (jsonObject) {
        this.isLooped = jsonObject.isLooped;
        this.isPrivate = jsonObject.isPrivate;
        this.name = jsonObject.name;
        this.macroActions = jsonObject.macroActions.map(function (macroAction) { return macro_action_1.Helper.createMacroAction(macroAction); });
        return this;
    };
    Macro.prototype.fromBinary = function (buffer) {
        this.isLooped = buffer.readBoolean();
        this.isPrivate = buffer.readBoolean();
        this.name = buffer.readString();
        var macroActionsLength = buffer.readCompactLength();
        this.macroActions = [];
        for (var i = 0; i < macroActionsLength; ++i) {
            this.macroActions.push(macro_action_1.Helper.createMacroAction(buffer));
        }
        return this;
    };
    Macro.prototype.toJsonObject = function () {
        return {
            isLooped: this.isLooped,
            isPrivate: this.isPrivate,
            name: this.name,
            macroActions: this.macroActions.map(function (macroAction) { return macroAction.toJsonObject(); })
        };
    };
    Macro.prototype.toBinary = function (buffer) {
        buffer.writeBoolean(this.isLooped);
        buffer.writeBoolean(this.isPrivate);
        buffer.writeString(this.name);
        buffer.writeArray(this.macroActions);
    };
    Macro.prototype.toString = function () {
        return "<Macro id=\"" + this.id + "\" name=\"" + this.name + "\">";
    };
    return Macro;
}());
__decorate([
    assert_1.assertUInt8,
    __metadata("design:type", Number)
], Macro.prototype, "id", void 0);
exports.Macro = Macro;


/***/ }),
/* 195 */,
/* 196 */,
/* 197 */,
/* 198 */,
/* 199 */,
/* 200 */,
/* 201 */,
/* 202 */,
/* 203 */,
/* 204 */,
/* 205 */,
/* 206 */,
/* 207 */,
/* 208 */,
/* 209 */,
/* 210 */,
/* 211 */,
/* 212 */,
/* 213 */,
/* 214 */,
/* 215 */,
/* 216 */,
/* 217 */,
/* 218 */,
/* 219 */,
/* 220 */,
/* 221 */,
/* 222 */,
/* 223 */,
/* 224 */,
/* 225 */,
/* 226 */,
/* 227 */,
/* 228 */,
/* 229 */,
/* 230 */,
/* 231 */,
/* 232 */,
/* 233 */,
/* 234 */,
/* 235 */,
/* 236 */,
/* 237 */,
/* 238 */,
/* 239 */,
/* 240 */,
/* 241 */,
/* 242 */,
/* 243 */,
/* 244 */,
/* 245 */,
/* 246 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var pluck_1 = __webpack_require__(284);
var map_1 = __webpack_require__(23);
var distinctUntilChanged_1 = __webpack_require__(182);
function select(pathOrMapFn) {
    var paths = [];
    for (var _i = 1; _i < arguments.length; _i++) {
        paths[_i - 1] = arguments[_i];
    }
    var mapped$;
    if (typeof pathOrMapFn === 'string') {
        mapped$ = pluck_1.pluck.call.apply(pluck_1.pluck, [this, pathOrMapFn].concat(paths));
    }
    else if (typeof pathOrMapFn === 'function') {
        mapped$ = map_1.map.call(this, pathOrMapFn);
    }
    else {
        throw new TypeError(("Unexpected type " + typeof pathOrMapFn + " in select operator,")
            + " expected 'string' or 'function'");
    }
    return distinctUntilChanged_1.distinctUntilChanged.call(mapped$);
}
exports.select = select;


/***/ }),
/* 247 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__src_instrument__ = __webpack_require__(587);
/* harmony reexport (binding) */ __webpack_require__.d(__webpack_exports__, "StoreDevtoolsModule", function() { return __WEBPACK_IMPORTED_MODULE_0__src_instrument__["a"]; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__src_devtools__ = __webpack_require__(381);
/* harmony reexport (binding) */ __webpack_require__.d(__webpack_exports__, "StoreDevtools", function() { return __WEBPACK_IMPORTED_MODULE_1__src_devtools__["a"]; });


//# sourceMappingURL=index.js.map

/***/ }),
/* 248 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "b", function() { return ActionTypes; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return StoreDevtoolActions; });
var ActionTypes = {
    PERFORM_ACTION: 'PERFORM_ACTION',
    RESET: 'RESET',
    ROLLBACK: 'ROLLBACK',
    COMMIT: 'COMMIT',
    SWEEP: 'SWEEP',
    TOGGLE_ACTION: 'TOGGLE_ACTION',
    SET_ACTIONS_ACTIVE: 'SET_ACTIONS_ACTIVE',
    JUMP_TO_STATE: 'JUMP_TO_STATE',
    IMPORT_STATE: 'IMPORT_STATE'
};
/**
* Action creators to change the History state.
*/
var StoreDevtoolActions = {
    performAction: function (action) {
        if (typeof action.type === 'undefined') {
            throw new Error('Actions may not have an undefined "type" property. ' +
                'Have you misspelled a constant?');
        }
        return { type: ActionTypes.PERFORM_ACTION, action: action, timestamp: Date.now() };
    },
    reset: function () {
        return { type: ActionTypes.RESET, timestamp: Date.now() };
    },
    rollback: function () {
        return { type: ActionTypes.ROLLBACK, timestamp: Date.now() };
    },
    commit: function () {
        return { type: ActionTypes.COMMIT, timestamp: Date.now() };
    },
    sweep: function () {
        return { type: ActionTypes.SWEEP };
    },
    toggleAction: function (id) {
        return { type: ActionTypes.TOGGLE_ACTION, id: id };
    },
    setActionsActive: function (start, end, active) {
        if (active === void 0) { active = true; }
        return { type: ActionTypes.SET_ACTIONS_ACTIVE, start: start, end: end, active: active };
    },
    jumpToState: function (index) {
        return { type: ActionTypes.JUMP_TO_STATE, index: index };
    },
    importState: function (nextLiftedState) {
        return { type: ActionTypes.IMPORT_STATE, nextLiftedState: nextLiftedState };
    }
};
//# sourceMappingURL=actions.js.map

/***/ }),
/* 249 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__actions__ = __webpack_require__(248);
/* harmony export (immutable) */ __webpack_exports__["d"] = difference;
/* harmony export (immutable) */ __webpack_exports__["c"] = unliftState;
/* unused harmony export unliftAction */
/* harmony export (immutable) */ __webpack_exports__["b"] = liftAction;
/* harmony export (immutable) */ __webpack_exports__["a"] = applyOperators;

function difference(first, second) {
    return first.filter(function (item) { return second.indexOf(item) < 0; });
}
/**
 * Provides an app's view into the state of the lifted store.
 */
function unliftState(liftedState) {
    var computedStates = liftedState.computedStates, currentStateIndex = liftedState.currentStateIndex;
    var state = computedStates[currentStateIndex].state;
    return state;
}
function unliftAction(liftedState) {
    return liftedState.actionsById[liftedState.nextActionId - 1];
}
/**
* Lifts an app's action into an action on the lifted store.
*/
function liftAction(action) {
    return __WEBPACK_IMPORTED_MODULE_0__actions__["a" /* StoreDevtoolActions */].performAction(action);
}
function applyOperators(input$, operators) {
    return operators.reduce(function (source$, _a) {
        var operator = _a[0], args = _a.slice(1);
        return operator.apply(source$, args);
    }, input$);
}
//# sourceMappingURL=utils.js.map

/***/ }),
/* 250 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__(0);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return DockActions; });

var DockActions = (function () {
    function DockActions() {
    }
    DockActions.prototype.toggleVisibility = function () {
        return { type: DockActions.TOGGLE_VISIBILITY };
    };
    DockActions.prototype.changePosition = function () {
        return { type: DockActions.CHANGE_POSITION };
    };
    DockActions.prototype.changeSize = function (size) {
        return { type: DockActions.CHANGE_SIZE, payload: size };
    };
    DockActions.prototype.changeMonitor = function () {
        return { type: DockActions.CHANGE_MONITOR };
    };
    DockActions.TOGGLE_VISIBILITY = '@@redux-devtools-log-monitor/TOGGLE_VISIBILITY';
    DockActions.CHANGE_POSITION = '@@redux-devtools-log-monitor/CHANGE_POSITION';
    DockActions.CHANGE_SIZE = '@@redux-devtools-log-monitor/CHANGE_SIZE';
    DockActions.CHANGE_MONITOR = '@@redux-devtools-log-monitor/CHANGE_MONITOR';
    DockActions.decorators = [
        { type: __WEBPACK_IMPORTED_MODULE_0__angular_core__["Injectable"] },
    ];
    /** @nocollapse */
    DockActions.ctorParameters = [];
    return DockActions;
}());
//# sourceMappingURL=actions.js.map

/***/ }),
/* 251 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/* WEBPACK VAR INJECTION */(function(global) {

var buffer = __webpack_require__(56);
var Buffer = buffer.Buffer;
var SlowBuffer = buffer.SlowBuffer;
var MAX_LEN = buffer.kMaxLength || 2147483647;
exports.alloc = function alloc(size, fill, encoding) {
  if (typeof Buffer.alloc === 'function') {
    return Buffer.alloc(size, fill, encoding);
  }
  if (typeof encoding === 'number') {
    throw new TypeError('encoding must not be number');
  }
  if (typeof size !== 'number') {
    throw new TypeError('size must be a number');
  }
  if (size > MAX_LEN) {
    throw new RangeError('size is too large');
  }
  var enc = encoding;
  var _fill = fill;
  if (_fill === undefined) {
    enc = undefined;
    _fill = 0;
  }
  var buf = new Buffer(size);
  if (typeof _fill === 'string') {
    var fillBuf = new Buffer(_fill, enc);
    var flen = fillBuf.length;
    var i = -1;
    while (++i < size) {
      buf[i] = fillBuf[i % flen];
    }
  } else {
    buf.fill(_fill);
  }
  return buf;
}
exports.allocUnsafe = function allocUnsafe(size) {
  if (typeof Buffer.allocUnsafe === 'function') {
    return Buffer.allocUnsafe(size);
  }
  if (typeof size !== 'number') {
    throw new TypeError('size must be a number');
  }
  if (size > MAX_LEN) {
    throw new RangeError('size is too large');
  }
  return new Buffer(size);
}
exports.from = function from(value, encodingOrOffset, length) {
  if (typeof Buffer.from === 'function' && (!global.Uint8Array || Uint8Array.from !== Buffer.from)) {
    return Buffer.from(value, encodingOrOffset, length);
  }
  if (typeof value === 'number') {
    throw new TypeError('"value" argument must not be a number');
  }
  if (typeof value === 'string') {
    return new Buffer(value, encodingOrOffset);
  }
  if (typeof ArrayBuffer !== 'undefined' && value instanceof ArrayBuffer) {
    var offset = encodingOrOffset;
    if (arguments.length === 1) {
      return new Buffer(value);
    }
    if (typeof offset === 'undefined') {
      offset = 0;
    }
    var len = length;
    if (typeof len === 'undefined') {
      len = value.byteLength - offset;
    }
    if (offset >= value.byteLength) {
      throw new RangeError('\'offset\' is out of bounds');
    }
    if (len > value.byteLength - offset) {
      throw new RangeError('\'length\' is out of bounds');
    }
    return new Buffer(value.slice(offset, offset + len));
  }
  if (Buffer.isBuffer(value)) {
    var out = new Buffer(value.length);
    value.copy(out, 0, 0, value.length);
    return out;
  }
  if (value) {
    if (Array.isArray(value) || (typeof ArrayBuffer !== 'undefined' && value.buffer instanceof ArrayBuffer) || 'length' in value) {
      return new Buffer(value);
    }
    if (value.type === 'Buffer' && Array.isArray(value.data)) {
      return new Buffer(value.data);
    }
  }

  throw new TypeError('First argument must be a string, Buffer, ' + 'ArrayBuffer, Array, or array-like object.');
}
exports.allocUnsafeSlow = function allocUnsafeSlow(size) {
  if (typeof Buffer.allocUnsafeSlow === 'function') {
    return Buffer.allocUnsafeSlow(size);
  }
  if (typeof size !== 'number') {
    throw new TypeError('size must be a number');
  }
  if (size >= MAX_LEN) {
    throw new RangeError('size is too large');
  }
  return new SlowBuffer(size);
}

/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(15)))

/***/ }),
/* 252 */,
/* 253 */,
/* 254 */,
/* 255 */,
/* 256 */,
/* 257 */,
/* 258 */,
/* 259 */,
/* 260 */,
/* 261 */,
/* 262 */,
/* 263 */,
/* 264 */,
/* 265 */,
/* 266 */,
/* 267 */,
/* 268 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/* WEBPACK VAR INJECTION */(function(process) {

if (!process.version ||
    process.version.indexOf('v0.') === 0 ||
    process.version.indexOf('v1.') === 0 && process.version.indexOf('v1.8.') !== 0) {
  module.exports = nextTick;
} else {
  module.exports = process.nextTick;
}

function nextTick(fn, arg1, arg2, arg3) {
  if (typeof fn !== 'function') {
    throw new TypeError('"callback" argument must be a function');
  }
  var len = arguments.length;
  var args, i;
  switch (len) {
  case 0:
  case 1:
    return process.nextTick(fn);
  case 2:
    return process.nextTick(function afterTickOne() {
      fn.call(null, arg1);
    });
  case 3:
    return process.nextTick(function afterTickTwo() {
      fn.call(null, arg1, arg2);
    });
  case 4:
    return process.nextTick(function afterTickThree() {
      fn.call(null, arg1, arg2, arg3);
    });
  default:
    args = new Array(len - 1);
    i = 0;
    while (i < args.length) {
      args[i++] = arguments[i];
    }
    return process.nextTick(function afterTick() {
      fn.apply(null, args);
    });
  }
}

/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(32)))

/***/ }),
/* 269 */
/***/ (function(module, exports) {

module.exports = ":host {\n  display: block;\n  width: 100%; }\n\n.action--editor {\n  padding-top: 0;\n  padding-bottom: 0;\n  border-radius: 0;\n  border: 0; }\n\n.nav {\n  padding-bottom: 1rem; }\n  .nav li a {\n    border-top-right-radius: 0;\n    border-bottom-right-radius: 0; }\n    .nav li a.selected {\n      font-style: italic; }\n    .nav li a:hover {\n      cursor: pointer; }\n  .nav li.active {\n    z-index: 2; }\n    .nav li.active a.selected {\n      font-style: normal; }\n    .nav li.active a:after {\n      content: '';\n      display: block;\n      position: absolute;\n      width: 0;\n      height: 0;\n      top: 0;\n      right: -4rem;\n      border-color: transparent transparent transparent #337ab7;\n      border-style: solid;\n      border-width: 2rem; }\n\n.editor__tabs, .editor__tab-links {\n  padding-top: 1rem; }\n\n.editor__tabs {\n  border-left: 1px solid #ddd;\n  margin-left: -1.6rem;\n  padding-left: 3rem; }\n\n.editor__actions {\n  float: right; }\n  .editor__actions-container {\n    background: #f5f5f5;\n    border-top: 1px solid #ddd;\n    border-bottom: 1px solid #ddd;\n    padding: 1rem 1.5rem; }\n\n.flex-button-wrapper {\n  display: flex;\n  flex-direction: row-reverse; }\n\n.flex-button {\n  align-self: flex-end; }\n"

/***/ }),
/* 270 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
// a transform stream is a readable/writable stream where you do
// something with the data.  Sometimes it's called a "filter",
// but that's not a great name for it, since that implies a thing where
// some bits pass through, and others are simply ignored.  (That would
// be a valid example of a transform, of course.)
//
// While the output is causally related to the input, it's not a
// necessarily symmetric or synchronous transformation.  For example,
// a zlib stream might take multiple plain-text writes(), and then
// emit a single compressed chunk some time in the future.
//
// Here's how this works:
//
// The Transform stream has all the aspects of the readable and writable
// stream classes.  When you write(chunk), that calls _write(chunk,cb)
// internally, and returns false if there's a lot of pending writes
// buffered up.  When you call read(), that calls _read(n) until
// there's enough pending readable data buffered up.
//
// In a transform stream, the written data is placed in a buffer.  When
// _read(n) is called, it transforms the queued up data, calling the
// buffered _write cb's as it consumes chunks.  If consuming a single
// written chunk would result in multiple output chunks, then the first
// outputted bit calls the readcb, and subsequent chunks just go into
// the read buffer, and will cause it to emit 'readable' if necessary.
//
// This way, back-pressure is actually determined by the reading side,
// since _read has to be called to start processing a new chunk.  However,
// a pathological inflate type of transform can cause excessive buffering
// here.  For example, imagine a stream where every byte of input is
// interpreted as an integer from 0-255, and then results in that many
// bytes of output.  Writing the 4 bytes {ff,ff,ff,ff} would result in
// 1kb of data being output.  In this case, you could write a very small
// amount of input, and end up with a very large amount of output.  In
// such a pathological inflating mechanism, there'd be no way to tell
// the system to stop doing the transform.  A single 4MB write could
// cause the system to run out of memory.
//
// However, even in such a pathological case, only a single written chunk
// would be consumed, and then the rest would wait (un-transformed) until
// the results of the previous transformed chunk were consumed.



module.exports = Transform;

var Duplex = __webpack_require__(78);

/*<replacement>*/
var util = __webpack_require__(120);
util.inherits = __webpack_require__(92);
/*</replacement>*/

util.inherits(Transform, Duplex);

function TransformState(stream) {
  this.afterTransform = function (er, data) {
    return afterTransform(stream, er, data);
  };

  this.needTransform = false;
  this.transforming = false;
  this.writecb = null;
  this.writechunk = null;
  this.writeencoding = null;
}

function afterTransform(stream, er, data) {
  var ts = stream._transformState;
  ts.transforming = false;

  var cb = ts.writecb;

  if (!cb) return stream.emit('error', new Error('no writecb in Transform class'));

  ts.writechunk = null;
  ts.writecb = null;

  if (data !== null && data !== undefined) stream.push(data);

  cb(er);

  var rs = stream._readableState;
  rs.reading = false;
  if (rs.needReadable || rs.length < rs.highWaterMark) {
    stream._read(rs.highWaterMark);
  }
}

function Transform(options) {
  if (!(this instanceof Transform)) return new Transform(options);

  Duplex.call(this, options);

  this._transformState = new TransformState(this);

  var stream = this;

  // start out asking for a readable event once data is transformed.
  this._readableState.needReadable = true;

  // we have implemented the _read method, and done the other things
  // that Readable wants before the first _read call, so unset the
  // sync guard flag.
  this._readableState.sync = false;

  if (options) {
    if (typeof options.transform === 'function') this._transform = options.transform;

    if (typeof options.flush === 'function') this._flush = options.flush;
  }

  // When the writable side finishes, then flush out anything remaining.
  this.once('prefinish', function () {
    if (typeof this._flush === 'function') this._flush(function (er, data) {
      done(stream, er, data);
    });else done(stream);
  });
}

Transform.prototype.push = function (chunk, encoding) {
  this._transformState.needTransform = false;
  return Duplex.prototype.push.call(this, chunk, encoding);
};

// This is the part where you do stuff!
// override this function in implementation classes.
// 'chunk' is an input chunk.
//
// Call `push(newChunk)` to pass along transformed output
// to the readable side.  You may call 'push' zero or more times.
//
// Call `cb(err)` when you are done with this chunk.  If you pass
// an error, then that'll put the hurt on the whole operation.  If you
// never call cb(), then you'll never get another chunk.
Transform.prototype._transform = function (chunk, encoding, cb) {
  throw new Error('_transform() is not implemented');
};

Transform.prototype._write = function (chunk, encoding, cb) {
  var ts = this._transformState;
  ts.writecb = cb;
  ts.writechunk = chunk;
  ts.writeencoding = encoding;
  if (!ts.transforming) {
    var rs = this._readableState;
    if (ts.needTransform || rs.needReadable || rs.length < rs.highWaterMark) this._read(rs.highWaterMark);
  }
};

// Doesn't matter what the args are here.
// _transform does all the work.
// That we got here means that the readable side wants more data.
Transform.prototype._read = function (n) {
  var ts = this._transformState;

  if (ts.writechunk !== null && ts.writecb && !ts.transforming) {
    ts.transforming = true;
    this._transform(ts.writechunk, ts.writeencoding, ts.afterTransform);
  } else {
    // mark that we need a transform, so that any data that comes in
    // will get processed, now that we've asked for it.
    ts.needTransform = true;
  }
};

function done(stream, er, data) {
  if (er) return stream.emit('error', er);

  if (data !== null && data !== undefined) stream.push(data);

  // if there's nothing in the write buffer, then that means
  // that nothing more will ever be provided
  var ws = stream._writableState;
  var ts = stream._transformState;

  if (ws.length) throw new Error('Calling transform done when ws.length != 0');

  if (ts.transforming) throw new Error('Calling transform done when still transforming');

  return stream.push(null);
}

/***/ }),
/* 271 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/* WEBPACK VAR INJECTION */(function(process, setImmediate) {// A bit simpler than readable streams.
// Implement an async ._write(chunk, encoding, cb), and it'll handle all
// the drain event emission and buffering.



module.exports = Writable;

/*<replacement>*/
var processNextTick = __webpack_require__(268);
/*</replacement>*/

/*<replacement>*/
var asyncWrite = !process.browser && ['v0.10', 'v0.9.'].indexOf(process.version.slice(0, 5)) > -1 ? setImmediate : processNextTick;
/*</replacement>*/

/*<replacement>*/
var Duplex;
/*</replacement>*/

Writable.WritableState = WritableState;

/*<replacement>*/
var util = __webpack_require__(120);
util.inherits = __webpack_require__(92);
/*</replacement>*/

/*<replacement>*/
var internalUtil = {
  deprecate: __webpack_require__(1121)
};
/*</replacement>*/

/*<replacement>*/
var Stream;
(function () {
  try {
    Stream = __webpack_require__(191);
  } catch (_) {} finally {
    if (!Stream) Stream = __webpack_require__(175).EventEmitter;
  }
})();
/*</replacement>*/

var Buffer = __webpack_require__(56).Buffer;
/*<replacement>*/
var bufferShim = __webpack_require__(251);
/*</replacement>*/

util.inherits(Writable, Stream);

function nop() {}

function WriteReq(chunk, encoding, cb) {
  this.chunk = chunk;
  this.encoding = encoding;
  this.callback = cb;
  this.next = null;
}

function WritableState(options, stream) {
  Duplex = Duplex || __webpack_require__(78);

  options = options || {};

  // object stream flag to indicate whether or not this stream
  // contains buffers or objects.
  this.objectMode = !!options.objectMode;

  if (stream instanceof Duplex) this.objectMode = this.objectMode || !!options.writableObjectMode;

  // the point at which write() starts returning false
  // Note: 0 is a valid value, means that we always return false if
  // the entire buffer is not flushed immediately on write()
  var hwm = options.highWaterMark;
  var defaultHwm = this.objectMode ? 16 : 16 * 1024;
  this.highWaterMark = hwm || hwm === 0 ? hwm : defaultHwm;

  // cast to ints.
  this.highWaterMark = ~ ~this.highWaterMark;

  // drain event flag.
  this.needDrain = false;
  // at the start of calling end()
  this.ending = false;
  // when end() has been called, and returned
  this.ended = false;
  // when 'finish' is emitted
  this.finished = false;

  // should we decode strings into buffers before passing to _write?
  // this is here so that some node-core streams can optimize string
  // handling at a lower level.
  var noDecode = options.decodeStrings === false;
  this.decodeStrings = !noDecode;

  // Crypto is kind of old and crusty.  Historically, its default string
  // encoding is 'binary' so we have to make this configurable.
  // Everything else in the universe uses 'utf8', though.
  this.defaultEncoding = options.defaultEncoding || 'utf8';

  // not an actual buffer we keep track of, but a measurement
  // of how much we're waiting to get pushed to some underlying
  // socket or file.
  this.length = 0;

  // a flag to see when we're in the middle of a write.
  this.writing = false;

  // when true all writes will be buffered until .uncork() call
  this.corked = 0;

  // a flag to be able to tell if the onwrite cb is called immediately,
  // or on a later tick.  We set this to true at first, because any
  // actions that shouldn't happen until "later" should generally also
  // not happen before the first write call.
  this.sync = true;

  // a flag to know if we're processing previously buffered items, which
  // may call the _write() callback in the same tick, so that we don't
  // end up in an overlapped onwrite situation.
  this.bufferProcessing = false;

  // the callback that's passed to _write(chunk,cb)
  this.onwrite = function (er) {
    onwrite(stream, er);
  };

  // the callback that the user supplies to write(chunk,encoding,cb)
  this.writecb = null;

  // the amount that is being written when _write is called.
  this.writelen = 0;

  this.bufferedRequest = null;
  this.lastBufferedRequest = null;

  // number of pending user-supplied write callbacks
  // this must be 0 before 'finish' can be emitted
  this.pendingcb = 0;

  // emit prefinish if the only thing we're waiting for is _write cbs
  // This is relevant for synchronous Transform streams
  this.prefinished = false;

  // True if the error was already emitted and should not be thrown again
  this.errorEmitted = false;

  // count buffered requests
  this.bufferedRequestCount = 0;

  // allocate the first CorkedRequest, there is always
  // one allocated and free to use, and we maintain at most two
  this.corkedRequestsFree = new CorkedRequest(this);
}

WritableState.prototype.getBuffer = function getBuffer() {
  var current = this.bufferedRequest;
  var out = [];
  while (current) {
    out.push(current);
    current = current.next;
  }
  return out;
};

(function () {
  try {
    Object.defineProperty(WritableState.prototype, 'buffer', {
      get: internalUtil.deprecate(function () {
        return this.getBuffer();
      }, '_writableState.buffer is deprecated. Use _writableState.getBuffer ' + 'instead.')
    });
  } catch (_) {}
})();

// Test _writableState for inheritance to account for Duplex streams,
// whose prototype chain only points to Readable.
var realHasInstance;
if (typeof Symbol === 'function' && Symbol.hasInstance && typeof Function.prototype[Symbol.hasInstance] === 'function') {
  realHasInstance = Function.prototype[Symbol.hasInstance];
  Object.defineProperty(Writable, Symbol.hasInstance, {
    value: function (object) {
      if (realHasInstance.call(this, object)) return true;

      return object && object._writableState instanceof WritableState;
    }
  });
} else {
  realHasInstance = function (object) {
    return object instanceof this;
  };
}

function Writable(options) {
  Duplex = Duplex || __webpack_require__(78);

  // Writable ctor is applied to Duplexes, too.
  // `realHasInstance` is necessary because using plain `instanceof`
  // would return false, as no `_writableState` property is attached.

  // Trying to use the custom `instanceof` for Writable here will also break the
  // Node.js LazyTransform implementation, which has a non-trivial getter for
  // `_writableState` that would lead to infinite recursion.
  if (!realHasInstance.call(Writable, this) && !(this instanceof Duplex)) {
    return new Writable(options);
  }

  this._writableState = new WritableState(options, this);

  // legacy.
  this.writable = true;

  if (options) {
    if (typeof options.write === 'function') this._write = options.write;

    if (typeof options.writev === 'function') this._writev = options.writev;
  }

  Stream.call(this);
}

// Otherwise people can pipe Writable streams, which is just wrong.
Writable.prototype.pipe = function () {
  this.emit('error', new Error('Cannot pipe, not readable'));
};

function writeAfterEnd(stream, cb) {
  var er = new Error('write after end');
  // TODO: defer error events consistently everywhere, not just the cb
  stream.emit('error', er);
  processNextTick(cb, er);
}

// If we get something that is not a buffer, string, null, or undefined,
// and we're not in objectMode, then that's an error.
// Otherwise stream chunks are all considered to be of length=1, and the
// watermarks determine how many objects to keep in the buffer, rather than
// how many bytes or characters.
function validChunk(stream, state, chunk, cb) {
  var valid = true;
  var er = false;
  // Always throw error if a null is written
  // if we are not in object mode then throw
  // if it is not a buffer, string, or undefined.
  if (chunk === null) {
    er = new TypeError('May not write null values to stream');
  } else if (!Buffer.isBuffer(chunk) && typeof chunk !== 'string' && chunk !== undefined && !state.objectMode) {
    er = new TypeError('Invalid non-string/buffer chunk');
  }
  if (er) {
    stream.emit('error', er);
    processNextTick(cb, er);
    valid = false;
  }
  return valid;
}

Writable.prototype.write = function (chunk, encoding, cb) {
  var state = this._writableState;
  var ret = false;

  if (typeof encoding === 'function') {
    cb = encoding;
    encoding = null;
  }

  if (Buffer.isBuffer(chunk)) encoding = 'buffer';else if (!encoding) encoding = state.defaultEncoding;

  if (typeof cb !== 'function') cb = nop;

  if (state.ended) writeAfterEnd(this, cb);else if (validChunk(this, state, chunk, cb)) {
    state.pendingcb++;
    ret = writeOrBuffer(this, state, chunk, encoding, cb);
  }

  return ret;
};

Writable.prototype.cork = function () {
  var state = this._writableState;

  state.corked++;
};

Writable.prototype.uncork = function () {
  var state = this._writableState;

  if (state.corked) {
    state.corked--;

    if (!state.writing && !state.corked && !state.finished && !state.bufferProcessing && state.bufferedRequest) clearBuffer(this, state);
  }
};

Writable.prototype.setDefaultEncoding = function setDefaultEncoding(encoding) {
  // node::ParseEncoding() requires lower case.
  if (typeof encoding === 'string') encoding = encoding.toLowerCase();
  if (!(['hex', 'utf8', 'utf-8', 'ascii', 'binary', 'base64', 'ucs2', 'ucs-2', 'utf16le', 'utf-16le', 'raw'].indexOf((encoding + '').toLowerCase()) > -1)) throw new TypeError('Unknown encoding: ' + encoding);
  this._writableState.defaultEncoding = encoding;
  return this;
};

function decodeChunk(state, chunk, encoding) {
  if (!state.objectMode && state.decodeStrings !== false && typeof chunk === 'string') {
    chunk = bufferShim.from(chunk, encoding);
  }
  return chunk;
}

// if we're already writing something, then just put this
// in the queue, and wait our turn.  Otherwise, call _write
// If we return false, then we need a drain event, so set that flag.
function writeOrBuffer(stream, state, chunk, encoding, cb) {
  chunk = decodeChunk(state, chunk, encoding);

  if (Buffer.isBuffer(chunk)) encoding = 'buffer';
  var len = state.objectMode ? 1 : chunk.length;

  state.length += len;

  var ret = state.length < state.highWaterMark;
  // we must ensure that previous needDrain will not be reset to false.
  if (!ret) state.needDrain = true;

  if (state.writing || state.corked) {
    var last = state.lastBufferedRequest;
    state.lastBufferedRequest = new WriteReq(chunk, encoding, cb);
    if (last) {
      last.next = state.lastBufferedRequest;
    } else {
      state.bufferedRequest = state.lastBufferedRequest;
    }
    state.bufferedRequestCount += 1;
  } else {
    doWrite(stream, state, false, len, chunk, encoding, cb);
  }

  return ret;
}

function doWrite(stream, state, writev, len, chunk, encoding, cb) {
  state.writelen = len;
  state.writecb = cb;
  state.writing = true;
  state.sync = true;
  if (writev) stream._writev(chunk, state.onwrite);else stream._write(chunk, encoding, state.onwrite);
  state.sync = false;
}

function onwriteError(stream, state, sync, er, cb) {
  --state.pendingcb;
  if (sync) processNextTick(cb, er);else cb(er);

  stream._writableState.errorEmitted = true;
  stream.emit('error', er);
}

function onwriteStateUpdate(state) {
  state.writing = false;
  state.writecb = null;
  state.length -= state.writelen;
  state.writelen = 0;
}

function onwrite(stream, er) {
  var state = stream._writableState;
  var sync = state.sync;
  var cb = state.writecb;

  onwriteStateUpdate(state);

  if (er) onwriteError(stream, state, sync, er, cb);else {
    // Check if we're actually ready to finish, but don't emit yet
    var finished = needFinish(state);

    if (!finished && !state.corked && !state.bufferProcessing && state.bufferedRequest) {
      clearBuffer(stream, state);
    }

    if (sync) {
      /*<replacement>*/
      asyncWrite(afterWrite, stream, state, finished, cb);
      /*</replacement>*/
    } else {
        afterWrite(stream, state, finished, cb);
      }
  }
}

function afterWrite(stream, state, finished, cb) {
  if (!finished) onwriteDrain(stream, state);
  state.pendingcb--;
  cb();
  finishMaybe(stream, state);
}

// Must force callback to be called on nextTick, so that we don't
// emit 'drain' before the write() consumer gets the 'false' return
// value, and has a chance to attach a 'drain' listener.
function onwriteDrain(stream, state) {
  if (state.length === 0 && state.needDrain) {
    state.needDrain = false;
    stream.emit('drain');
  }
}

// if there's something in the buffer waiting, then process it
function clearBuffer(stream, state) {
  state.bufferProcessing = true;
  var entry = state.bufferedRequest;

  if (stream._writev && entry && entry.next) {
    // Fast case, write everything using _writev()
    var l = state.bufferedRequestCount;
    var buffer = new Array(l);
    var holder = state.corkedRequestsFree;
    holder.entry = entry;

    var count = 0;
    while (entry) {
      buffer[count] = entry;
      entry = entry.next;
      count += 1;
    }

    doWrite(stream, state, true, state.length, buffer, '', holder.finish);

    // doWrite is almost always async, defer these to save a bit of time
    // as the hot path ends with doWrite
    state.pendingcb++;
    state.lastBufferedRequest = null;
    if (holder.next) {
      state.corkedRequestsFree = holder.next;
      holder.next = null;
    } else {
      state.corkedRequestsFree = new CorkedRequest(state);
    }
  } else {
    // Slow case, write chunks one-by-one
    while (entry) {
      var chunk = entry.chunk;
      var encoding = entry.encoding;
      var cb = entry.callback;
      var len = state.objectMode ? 1 : chunk.length;

      doWrite(stream, state, false, len, chunk, encoding, cb);
      entry = entry.next;
      // if we didn't call the onwrite immediately, then
      // it means that we need to wait until it does.
      // also, that means that the chunk and cb are currently
      // being processed, so move the buffer counter past them.
      if (state.writing) {
        break;
      }
    }

    if (entry === null) state.lastBufferedRequest = null;
  }

  state.bufferedRequestCount = 0;
  state.bufferedRequest = entry;
  state.bufferProcessing = false;
}

Writable.prototype._write = function (chunk, encoding, cb) {
  cb(new Error('_write() is not implemented'));
};

Writable.prototype._writev = null;

Writable.prototype.end = function (chunk, encoding, cb) {
  var state = this._writableState;

  if (typeof chunk === 'function') {
    cb = chunk;
    chunk = null;
    encoding = null;
  } else if (typeof encoding === 'function') {
    cb = encoding;
    encoding = null;
  }

  if (chunk !== null && chunk !== undefined) this.write(chunk, encoding);

  // .end() fully uncorks
  if (state.corked) {
    state.corked = 1;
    this.uncork();
  }

  // ignore unnecessary end() calls.
  if (!state.ending && !state.finished) endWritable(this, state, cb);
};

function needFinish(state) {
  return state.ending && state.length === 0 && state.bufferedRequest === null && !state.finished && !state.writing;
}

function prefinish(stream, state) {
  if (!state.prefinished) {
    state.prefinished = true;
    stream.emit('prefinish');
  }
}

function finishMaybe(stream, state) {
  var need = needFinish(state);
  if (need) {
    if (state.pendingcb === 0) {
      prefinish(stream, state);
      state.finished = true;
      stream.emit('finish');
    } else {
      prefinish(stream, state);
    }
  }
  return need;
}

function endWritable(stream, state, cb) {
  state.ending = true;
  finishMaybe(stream, state);
  if (cb) {
    if (state.finished) processNextTick(cb);else stream.once('finish', cb);
  }
  state.ended = true;
  stream.writable = false;
}

// It seems a linked list but it is not
// there will be only 2 of these for each stream
function CorkedRequest(state) {
  var _this = this;

  this.next = null;
  this.entry = null;

  this.finish = function (err) {
    var entry = _this.entry;
    _this.entry = null;
    while (entry) {
      var cb = entry.callback;
      state.pendingcb--;
      cb(err);
      entry = entry.next;
    }
    if (state.corkedRequestsFree) {
      state.corkedRequestsFree.next = _this;
    } else {
      state.corkedRequestsFree = _this;
    }
  };
}
/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(32), __webpack_require__(192).setImmediate))

/***/ }),
/* 272 */,
/* 273 */,
/* 274 */,
/* 275 */,
/* 276 */,
/* 277 */,
/* 278 */,
/* 279 */,
/* 280 */,
/* 281 */,
/* 282 */,
/* 283 */,
/* 284 */,
/* 285 */,
/* 286 */,
/* 287 */,
/* 288 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

function __export(m) {
    for (var p in m) if (!exports.hasOwnProperty(p)) exports[p] = m[p];
}
Object.defineProperty(exports, "__esModule", { value: true });
__export(__webpack_require__(448));
__export(__webpack_require__(1033));
__export(__webpack_require__(1030));
__export(__webpack_require__(1034));
__export(__webpack_require__(289));
__export(__webpack_require__(1031));
__export(__webpack_require__(1019));
__export(__webpack_require__(1023));


/***/ }),
/* 289 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var macro_not_found_component_1 = __webpack_require__(1036);
exports.MacroNotFoundComponent = macro_not_found_component_1.MacroNotFoundComponent;
var macro_not_found_guard_service_1 = __webpack_require__(1035);
exports.MacroNotFoundGuard = macro_not_found_guard_service_1.MacroNotFoundGuard;


/***/ }),
/* 290 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var KeyModifiers;
(function (KeyModifiers) {
    KeyModifiers[KeyModifiers["leftCtrl"] = 1] = "leftCtrl";
    KeyModifiers[KeyModifiers["leftShift"] = 2] = "leftShift";
    KeyModifiers[KeyModifiers["leftAlt"] = 4] = "leftAlt";
    KeyModifiers[KeyModifiers["leftGui"] = 8] = "leftGui";
    KeyModifiers[KeyModifiers["rightCtrl"] = 16] = "rightCtrl";
    KeyModifiers[KeyModifiers["rightShift"] = 32] = "rightShift";
    KeyModifiers[KeyModifiers["rightAlt"] = 64] = "rightAlt";
    KeyModifiers[KeyModifiers["rightGui"] = 128] = "rightGui";
})(KeyModifiers = exports.KeyModifiers || (exports.KeyModifiers = {}));


/***/ }),
/* 291 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
var assert_1 = __webpack_require__(26);
var Keymap_1 = __webpack_require__(80);
var Macro_1 = __webpack_require__(194);
var ModuleConfiguration_1 = __webpack_require__(1092);
var UserConfiguration = (function () {
    function UserConfiguration() {
    }
    UserConfiguration.prototype.fromJsonObject = function (jsonObject) {
        var _this = this;
        this.dataModelVersion = jsonObject.dataModelVersion;
        this.moduleConfigurations = jsonObject.moduleConfigurations.map(function (moduleConfiguration) {
            return new ModuleConfiguration_1.ModuleConfiguration().fromJsonObject(moduleConfiguration);
        });
        this.macros = jsonObject.macros.map(function (macroJsonObject, index) {
            var macro = new Macro_1.Macro().fromJsonObject(macroJsonObject);
            macro.id = index;
            return macro;
        });
        this.keymaps = jsonObject.keymaps.map(function (keymap) { return new Keymap_1.Keymap().fromJsonObject(keymap, _this.macros); });
        return this;
    };
    UserConfiguration.prototype.fromBinary = function (buffer) {
        var _this = this;
        this.dataModelVersion = buffer.readUInt16();
        this.moduleConfigurations = buffer.readArray(function (uhkBuffer) {
            return new ModuleConfiguration_1.ModuleConfiguration().fromBinary(uhkBuffer);
        });
        this.macros = buffer.readArray(function (uhkBuffer, index) {
            var macro = new Macro_1.Macro().fromBinary(uhkBuffer);
            macro.id = index;
            return macro;
        });
        this.keymaps = buffer.readArray(function (uhkBuffer) { return new Keymap_1.Keymap().fromBinary(uhkBuffer, _this.macros); });
        return this;
    };
    UserConfiguration.prototype.toJsonObject = function () {
        var _this = this;
        return {
            dataModelVersion: this.dataModelVersion,
            moduleConfigurations: this.moduleConfigurations.map(function (moduleConfiguration) { return moduleConfiguration.toJsonObject(); }),
            keymaps: this.keymaps.map(function (keymap) { return keymap.toJsonObject(_this.macros); }),
            macros: this.macros.map(function (macro) { return macro.toJsonObject(); })
        };
    };
    UserConfiguration.prototype.toBinary = function (buffer) {
        var _this = this;
        buffer.writeUInt16(this.dataModelVersion);
        buffer.writeArray(this.moduleConfigurations);
        buffer.writeArray(this.macros);
        buffer.writeArray(this.keymaps, function (uhkBuffer, keymap) {
            keymap.toBinary(uhkBuffer, _this.macros);
        });
    };
    UserConfiguration.prototype.toString = function () {
        return "<UserConfiguration dataModelVersion=\"" + this.dataModelVersion + "\">";
    };
    UserConfiguration.prototype.getKeymap = function (keymapAbbreviation) {
        return this.keymaps.find(function (keymap) { return keymapAbbreviation === keymap.abbreviation; });
    };
    UserConfiguration.prototype.getMacro = function (macroId) {
        return this.macros.find(function (macro) { return macroId === macro.id; });
    };
    return UserConfiguration;
}());
__decorate([
    assert_1.assertUInt16,
    __metadata("design:type", Number)
], UserConfiguration.prototype, "dataModelVersion", void 0);
exports.UserConfiguration = UserConfiguration;


/***/ }),
/* 292 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
var core_1 = __webpack_require__(0);
var CaptureService = (function () {
    function CaptureService() {
        this.leftModifiers = new Map();
        this.rightModifiers = new Map();
        this.mapping = new Map();
    }
    CaptureService.prototype.getMap = function (code) {
        return this.mapping.get(code);
    };
    CaptureService.prototype.hasMap = function (code) {
        return this.mapping.has(code);
    };
    CaptureService.prototype.setModifier = function (left, code) {
        return left ? this.leftModifiers.set(code, true) : this.rightModifiers.set(code, true);
    };
    CaptureService.prototype.getModifiers = function (left) {
        return left ? this.reMap(this.leftModifiers) : this.reMap(this.rightModifiers);
    };
    CaptureService.prototype.initModifiers = function () {
        this.leftModifiers.set(16, false); // Shift
        this.leftModifiers.set(17, false); // Ctrl
        this.leftModifiers.set(18, false); // Alt
        this.leftModifiers.set(91, false); // Super
        this.rightModifiers.set(16, false); // Shift
        this.rightModifiers.set(17, false); // Ctrl
        this.rightModifiers.set(18, false); // Alt
        this.rightModifiers.set(91, false); // Super
    };
    CaptureService.prototype.populateMapping = function () {
        this.mapping.set(8, 42); // Backspace
        this.mapping.set(9, 43); // Tab
        this.mapping.set(13, 40); // Enter
        this.mapping.set(19, 72); // Pause/break
        this.mapping.set(20, 57); // Caps lock
        this.mapping.set(27, 41); // Escape
        this.mapping.set(32, 44); // (space)
        this.mapping.set(33, 75); // Page up
        this.mapping.set(34, 78); // Page down
        this.mapping.set(35, 77); // End
        this.mapping.set(36, 74); // Home
        this.mapping.set(37, 80); // Left arrow
        this.mapping.set(38, 82); // Up arrow
        this.mapping.set(39, 79); // Right arrow
        this.mapping.set(40, 81); // Down arrow
        this.mapping.set(45, 73); // Insert
        this.mapping.set(46, 76); // Delete
        this.mapping.set(48, 39); // 0
        this.mapping.set(49, 30); // 1
        this.mapping.set(50, 31); // 2
        this.mapping.set(51, 32); // 3
        this.mapping.set(52, 33); // 4
        this.mapping.set(53, 34); // 5
        this.mapping.set(54, 35); // 6
        this.mapping.set(55, 36); // 7
        this.mapping.set(56, 37); // 8
        this.mapping.set(57, 38); // 9
        this.mapping.set(65, 4); // A
        this.mapping.set(66, 5); // B
        this.mapping.set(67, 6); // C
        this.mapping.set(68, 7); // D
        this.mapping.set(69, 8); // E
        this.mapping.set(70, 9); // F
        this.mapping.set(71, 10); // G
        this.mapping.set(72, 11); // H
        this.mapping.set(73, 12); // I
        this.mapping.set(74, 13); // J
        this.mapping.set(75, 14); // K
        this.mapping.set(76, 15); // L
        this.mapping.set(77, 16); // M
        this.mapping.set(78, 17); // N
        this.mapping.set(79, 18); // O
        this.mapping.set(80, 19); // P
        this.mapping.set(81, 20); // Q
        this.mapping.set(82, 21); // R
        this.mapping.set(83, 22); // S
        this.mapping.set(84, 23); // T
        this.mapping.set(85, 24); // U
        this.mapping.set(86, 25); // V
        this.mapping.set(87, 26); // W
        this.mapping.set(88, 27); // X
        this.mapping.set(89, 28); // Y
        this.mapping.set(90, 29); // Z
        this.mapping.set(93, 118); // Menu
        this.mapping.set(96, 98); // Num pad 0
        this.mapping.set(97, 89); // Num pad 1
        this.mapping.set(98, 90); // Num pad 2
        this.mapping.set(99, 91); // Num pad 3
        this.mapping.set(100, 92); // Num pad 4
        this.mapping.set(101, 93); // Num pad 5
        this.mapping.set(102, 94); // Num pad 6
        this.mapping.set(103, 95); // Num pad 7
        this.mapping.set(104, 96); // Num pad 8
        this.mapping.set(105, 97); // Num pad 9
        this.mapping.set(106, 85); // Multiply
        this.mapping.set(107, 87); // Add
        this.mapping.set(109, 86); // Subtract
        this.mapping.set(110, 99); // Decimal point
        this.mapping.set(111, 84); // Divide
        this.mapping.set(112, 58); // F1
        this.mapping.set(113, 59); // F2
        this.mapping.set(114, 60); // F3
        this.mapping.set(115, 61); // F4
        this.mapping.set(116, 62); // F5
        this.mapping.set(117, 63); // F6
        this.mapping.set(118, 64); // F7
        this.mapping.set(119, 65); // F8
        this.mapping.set(120, 66); // F9
        this.mapping.set(121, 67); // F10
        this.mapping.set(122, 68); // F11
        this.mapping.set(123, 69); // F12
        this.mapping.set(144, 83); // Num lock
        this.mapping.set(145, 71); // Scroll lock
        this.mapping.set(186, 51); // Semi-colon
        this.mapping.set(187, 46); // Equal sign
        this.mapping.set(188, 54); // Comma
        this.mapping.set(189, 45); // Dash
        this.mapping.set(190, 55); // Period
        this.mapping.set(191, 56); // Forward slash
        this.mapping.set(192, 53); // Grave accent
        this.mapping.set(219, 47); // Open bracket
        this.mapping.set(220, 49); // Back slash
        this.mapping.set(221, 48); // Close bracket
        this.mapping.set(222, 52); // Single quote
    };
    CaptureService.prototype.reMap = function (value) {
        return [value.get(16), value.get(17), value.get(91), value.get(18)];
    };
    return CaptureService;
}());
CaptureService = __decorate([
    core_1.Injectable(),
    __metadata("design:paramtypes", [])
], CaptureService);
exports.CaptureService = CaptureService;


/***/ }),
/* 293 */,
/* 294 */,
/* 295 */,
/* 296 */,
/* 297 */,
/* 298 */,
/* 299 */,
/* 300 */,
/* 301 */,
/* 302 */,
/* 303 */,
/* 304 */,
/* 305 */,
/* 306 */,
/* 307 */,
/* 308 */,
/* 309 */,
/* 310 */,
/* 311 */,
/* 312 */,
/* 313 */,
/* 314 */,
/* 315 */,
/* 316 */,
/* 317 */,
/* 318 */,
/* 319 */,
/* 320 */,
/* 321 */,
/* 322 */,
/* 323 */,
/* 324 */,
/* 325 */,
/* 326 */,
/* 327 */,
/* 328 */,
/* 329 */,
/* 330 */,
/* 331 */,
/* 332 */,
/* 333 */,
/* 334 */,
/* 335 */,
/* 336 */,
/* 337 */,
/* 338 */,
/* 339 */,
/* 340 */,
/* 341 */,
/* 342 */,
/* 343 */,
/* 344 */,
/* 345 */,
/* 346 */,
/* 347 */,
/* 348 */,
/* 349 */,
/* 350 */,
/* 351 */,
/* 352 */,
/* 353 */,
/* 354 */,
/* 355 */,
/* 356 */,
/* 357 */,
/* 358 */,
/* 359 */,
/* 360 */,
/* 361 */,
/* 362 */,
/* 363 */,
/* 364 */,
/* 365 */,
/* 366 */,
/* 367 */,
/* 368 */,
/* 369 */,
/* 370 */,
/* 371 */,
/* 372 */,
/* 373 */,
/* 374 */,
/* 375 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var Observable_1 = __webpack_require__(1);
var select_1 = __webpack_require__(246);
Observable_1.Observable.prototype.select = select_1.select;


/***/ }),
/* 376 */,
/* 377 */,
/* 378 */,
/* 379 */,
/* 380 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__(0);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return STORE_DEVTOOLS_CONFIG; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "b", function() { return INITIAL_OPTIONS; });

var STORE_DEVTOOLS_CONFIG = new __WEBPACK_IMPORTED_MODULE_0__angular_core__["OpaqueToken"]('@ngrx/devtools Options');
var INITIAL_OPTIONS = new __WEBPACK_IMPORTED_MODULE_0__angular_core__["OpaqueToken"]('@ngrx/devtools Initial Config');
//# sourceMappingURL=config.js.map

/***/ }),
/* 381 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__ngrx_store__ = __webpack_require__(9);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2_rxjs_ReplaySubject__ = __webpack_require__(177);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2_rxjs_ReplaySubject___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_2_rxjs_ReplaySubject__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3_rxjs_operator_map__ = __webpack_require__(23);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3_rxjs_operator_map___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_3_rxjs_operator_map__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4_rxjs_operator_merge__ = __webpack_require__(283);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4_rxjs_operator_merge___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_4_rxjs_operator_merge__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5_rxjs_operator_observeOn__ = __webpack_require__(124);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5_rxjs_operator_observeOn___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_5_rxjs_operator_observeOn__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_6_rxjs_operator_scan__ = __webpack_require__(285);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_6_rxjs_operator_scan___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_6_rxjs_operator_scan__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_7_rxjs_operator_skip__ = __webpack_require__(425);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_7_rxjs_operator_skip___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_7_rxjs_operator_skip__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_8_rxjs_operator_withLatestFrom__ = __webpack_require__(286);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_8_rxjs_operator_withLatestFrom___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_8_rxjs_operator_withLatestFrom__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_9_rxjs_scheduler_queue__ = __webpack_require__(184);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_9_rxjs_scheduler_queue___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_9_rxjs_scheduler_queue__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_10__extension__ = __webpack_require__(382);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_11__utils__ = __webpack_require__(249);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_12__reducer__ = __webpack_require__(588);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_13__actions__ = __webpack_require__(248);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_14__config__ = __webpack_require__(380);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "b", function() { return DevtoolsDispatcher; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return StoreDevtools; });
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};















var DevtoolsDispatcher = (function (_super) {
    __extends(DevtoolsDispatcher, _super);
    function DevtoolsDispatcher() {
        _super.apply(this, arguments);
    }
    DevtoolsDispatcher.decorators = [
        { type: __WEBPACK_IMPORTED_MODULE_0__angular_core__["Injectable"] },
    ];
    /** @nocollapse */
    DevtoolsDispatcher.ctorParameters = [];
    return DevtoolsDispatcher;
}(__WEBPACK_IMPORTED_MODULE_1__ngrx_store__["Dispatcher"]));
var StoreDevtools = (function () {
    function StoreDevtools(dispatcher, actions$, reducers$, extension, initialState, config) {
        var liftedInitialState = __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_12__reducer__["a" /* liftInitialState */])(initialState, config.monitor);
        var liftReducer = __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_12__reducer__["b" /* liftReducerWith */])(initialState, liftedInitialState, config.monitor, {
            maxAge: config.maxAge
        });
        var liftedAction$ = __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_11__utils__["a" /* applyOperators */])(actions$, [
            [__WEBPACK_IMPORTED_MODULE_7_rxjs_operator_skip__["skip"], 1],
            [__WEBPACK_IMPORTED_MODULE_4_rxjs_operator_merge__["merge"], extension.actions$],
            [__WEBPACK_IMPORTED_MODULE_3_rxjs_operator_map__["map"], __WEBPACK_IMPORTED_MODULE_11__utils__["b" /* liftAction */]],
            [__WEBPACK_IMPORTED_MODULE_4_rxjs_operator_merge__["merge"], dispatcher, extension.liftedActions$],
            [__WEBPACK_IMPORTED_MODULE_5_rxjs_operator_observeOn__["observeOn"], __WEBPACK_IMPORTED_MODULE_9_rxjs_scheduler_queue__["queue"]]
        ]);
        var liftedReducer$ = __WEBPACK_IMPORTED_MODULE_3_rxjs_operator_map__["map"].call(reducers$, liftReducer);
        var liftedStateSubject = new __WEBPACK_IMPORTED_MODULE_2_rxjs_ReplaySubject__["ReplaySubject"](1);
        var liftedStateSubscription = __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_11__utils__["a" /* applyOperators */])(liftedAction$, [
            [__WEBPACK_IMPORTED_MODULE_8_rxjs_operator_withLatestFrom__["withLatestFrom"], liftedReducer$],
            [__WEBPACK_IMPORTED_MODULE_6_rxjs_operator_scan__["scan"], function (liftedState, _a) {
                    var action = _a[0], reducer = _a[1];
                    var nextState = reducer(liftedState, action);
                    extension.notify(action, nextState);
                    return nextState;
                }, liftedInitialState]
        ]).subscribe(liftedStateSubject);
        var liftedState$ = liftedStateSubject.asObservable();
        var state$ = __WEBPACK_IMPORTED_MODULE_3_rxjs_operator_map__["map"].call(liftedState$, __WEBPACK_IMPORTED_MODULE_11__utils__["c" /* unliftState */]);
        this.stateSubscription = liftedStateSubscription;
        this.dispatcher = dispatcher;
        this.liftedState = liftedState$;
        this.state = state$;
    }
    StoreDevtools.prototype.dispatch = function (action) {
        this.dispatcher.dispatch(action);
    };
    StoreDevtools.prototype.next = function (action) {
        this.dispatcher.dispatch(action);
    };
    StoreDevtools.prototype.error = function (error) { };
    StoreDevtools.prototype.complete = function () { };
    StoreDevtools.prototype.performAction = function (action) {
        this.dispatch(__WEBPACK_IMPORTED_MODULE_13__actions__["a" /* StoreDevtoolActions */].performAction(action));
    };
    StoreDevtools.prototype.reset = function () {
        this.dispatch(__WEBPACK_IMPORTED_MODULE_13__actions__["a" /* StoreDevtoolActions */].reset());
    };
    StoreDevtools.prototype.rollback = function () {
        this.dispatch(__WEBPACK_IMPORTED_MODULE_13__actions__["a" /* StoreDevtoolActions */].rollback());
    };
    StoreDevtools.prototype.commit = function () {
        this.dispatch(__WEBPACK_IMPORTED_MODULE_13__actions__["a" /* StoreDevtoolActions */].commit());
    };
    StoreDevtools.prototype.sweep = function () {
        this.dispatch(__WEBPACK_IMPORTED_MODULE_13__actions__["a" /* StoreDevtoolActions */].sweep());
    };
    StoreDevtools.prototype.toggleAction = function (id) {
        this.dispatch(__WEBPACK_IMPORTED_MODULE_13__actions__["a" /* StoreDevtoolActions */].toggleAction(id));
    };
    StoreDevtools.prototype.jumpToState = function (index) {
        this.dispatch(__WEBPACK_IMPORTED_MODULE_13__actions__["a" /* StoreDevtoolActions */].jumpToState(index));
    };
    StoreDevtools.prototype.importState = function (nextLiftedState) {
        this.dispatch(__WEBPACK_IMPORTED_MODULE_13__actions__["a" /* StoreDevtoolActions */].importState(nextLiftedState));
    };
    StoreDevtools.decorators = [
        { type: __WEBPACK_IMPORTED_MODULE_0__angular_core__["Injectable"] },
    ];
    /** @nocollapse */
    StoreDevtools.ctorParameters = [
        { type: DevtoolsDispatcher, },
        { type: __WEBPACK_IMPORTED_MODULE_1__ngrx_store__["Dispatcher"], },
        { type: __WEBPACK_IMPORTED_MODULE_1__ngrx_store__["Reducer"], },
        { type: __WEBPACK_IMPORTED_MODULE_10__extension__["a" /* DevtoolsExtension */], },
        { type: undefined, decorators: [{ type: __WEBPACK_IMPORTED_MODULE_0__angular_core__["Inject"], args: [__WEBPACK_IMPORTED_MODULE_1__ngrx_store__["INITIAL_STATE"],] },] },
        { type: undefined, decorators: [{ type: __WEBPACK_IMPORTED_MODULE_0__angular_core__["Inject"], args: [__WEBPACK_IMPORTED_MODULE_14__config__["a" /* STORE_DEVTOOLS_CONFIG */],] },] },
    ];
    return StoreDevtools;
}());
//# sourceMappingURL=devtools.js.map

/***/ }),
/* 382 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_rxjs_Observable__ = __webpack_require__(1);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_rxjs_Observable___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_1_rxjs_Observable__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2_rxjs_observable_empty__ = __webpack_require__(417);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2_rxjs_observable_empty___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_2_rxjs_observable_empty__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3_rxjs_operator_filter__ = __webpack_require__(93);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3_rxjs_operator_filter___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_3_rxjs_operator_filter__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4_rxjs_operator_map__ = __webpack_require__(23);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4_rxjs_operator_map___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_4_rxjs_operator_map__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5_rxjs_operator_share__ = __webpack_require__(424);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5_rxjs_operator_share___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_5_rxjs_operator_share__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_6_rxjs_operator_switchMap__ = __webpack_require__(426);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_6_rxjs_operator_switchMap___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_6_rxjs_operator_switchMap__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_7_rxjs_operator_takeUntil__ = __webpack_require__(427);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_7_rxjs_operator_takeUntil___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_7_rxjs_operator_takeUntil__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_8__utils__ = __webpack_require__(249);
/* unused harmony export ExtensionActionTypes */
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "b", function() { return REDUX_DEVTOOLS_EXTENSION; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return DevtoolsExtension; });









var ExtensionActionTypes = {
    START: 'START',
    DISPATCH: 'DISPATCH',
    STOP: 'STOP',
    ACTION: 'ACTION'
};
var REDUX_DEVTOOLS_EXTENSION = new __WEBPACK_IMPORTED_MODULE_0__angular_core__["OpaqueToken"]('Redux Devtools Extension');
var DevtoolsExtension = (function () {
    function DevtoolsExtension(devtoolsExtension) {
        this.instanceId = "ngrx-store-" + Date.now();
        this.devtoolsExtension = devtoolsExtension;
        this.createActionStreams();
    }
    DevtoolsExtension.prototype.notify = function (action, state) {
        if (!this.devtoolsExtension) {
            return;
        }
        this.devtoolsExtension.send(null, state, false, this.instanceId);
    };
    DevtoolsExtension.prototype.createChangesObservable = function () {
        var _this = this;
        if (!this.devtoolsExtension) {
            return __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_2_rxjs_observable_empty__["empty"])();
        }
        return new __WEBPACK_IMPORTED_MODULE_1_rxjs_Observable__["Observable"](function (subscriber) {
            var connection = _this.devtoolsExtension.connect({ instanceId: _this.instanceId });
            connection.subscribe(function (change) { return subscriber.next(change); });
            return connection.unsubscribe;
        });
    };
    DevtoolsExtension.prototype.createActionStreams = function () {
        var _this = this;
        // Listens to all changes based on our instanceId
        var changes$ = __WEBPACK_IMPORTED_MODULE_5_rxjs_operator_share__["share"].call(this.createChangesObservable());
        // Listen for the start action
        var start$ = __WEBPACK_IMPORTED_MODULE_3_rxjs_operator_filter__["filter"].call(changes$, function (change) { return change.type === ExtensionActionTypes.START; });
        // Listen for the stop action
        var stop$ = __WEBPACK_IMPORTED_MODULE_3_rxjs_operator_filter__["filter"].call(changes$, function (change) { return change.type === ExtensionActionTypes.STOP; });
        // Listen for lifted actions
        var liftedActions$ = __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_8__utils__["a" /* applyOperators */])(changes$, [
            [__WEBPACK_IMPORTED_MODULE_3_rxjs_operator_filter__["filter"], function (change) { return change.type === ExtensionActionTypes.DISPATCH; }],
            [__WEBPACK_IMPORTED_MODULE_4_rxjs_operator_map__["map"], function (change) { return _this.unwrapAction(change.payload); }]
        ]);
        // Listen for unlifted actions
        var actions$ = __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_8__utils__["a" /* applyOperators */])(changes$, [
            [__WEBPACK_IMPORTED_MODULE_3_rxjs_operator_filter__["filter"], function (change) { return change.type === ExtensionActionTypes.ACTION; }],
            [__WEBPACK_IMPORTED_MODULE_4_rxjs_operator_map__["map"], function (change) { return _this.unwrapAction(change.payload); }]
        ]);
        var actionsUntilStop$ = __WEBPACK_IMPORTED_MODULE_7_rxjs_operator_takeUntil__["takeUntil"].call(actions$, stop$);
        var liftedUntilStop$ = __WEBPACK_IMPORTED_MODULE_7_rxjs_operator_takeUntil__["takeUntil"].call(liftedActions$, stop$);
        // Only take the action sources between the start/stop events
        this.actions$ = __WEBPACK_IMPORTED_MODULE_6_rxjs_operator_switchMap__["switchMap"].call(start$, function () { return actionsUntilStop$; });
        this.liftedActions$ = __WEBPACK_IMPORTED_MODULE_6_rxjs_operator_switchMap__["switchMap"].call(start$, function () { return liftedUntilStop$; });
    };
    DevtoolsExtension.prototype.unwrapAction = function (action) {
        return typeof action === 'string' ? eval("(" + action + ")") : action;
    };
    DevtoolsExtension.decorators = [
        { type: __WEBPACK_IMPORTED_MODULE_0__angular_core__["Injectable"] },
    ];
    /** @nocollapse */
    DevtoolsExtension.ctorParameters = [
        { type: undefined, decorators: [{ type: __WEBPACK_IMPORTED_MODULE_0__angular_core__["Inject"], args: [REDUX_DEVTOOLS_EXTENSION,] },] },
    ];
    return DevtoolsExtension;
}());
//# sourceMappingURL=extension.js.map

/***/ }),
/* 383 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__angular_common__ = __webpack_require__(43);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__commander__ = __webpack_require__(590);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__dock__ = __webpack_require__(592);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4__dock_monitor__ = __webpack_require__(591);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5__actions__ = __webpack_require__(250);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_6__reducer__ = __webpack_require__(594);
/* harmony reexport (binding) */ __webpack_require__.d(__webpack_exports__, "b", function() { return __WEBPACK_IMPORTED_MODULE_6__reducer__["a"]; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return DockMonitorModule; });






var DockMonitorModule = (function () {
    function DockMonitorModule() {
    }
    DockMonitorModule.decorators = [
        { type: __WEBPACK_IMPORTED_MODULE_0__angular_core__["NgModule"], args: [{
                    imports: [
                        __WEBPACK_IMPORTED_MODULE_1__angular_common__["CommonModule"]
                    ],
                    declarations: [
                        __WEBPACK_IMPORTED_MODULE_2__commander__["a" /* CommanderComponent */],
                        __WEBPACK_IMPORTED_MODULE_3__dock__["a" /* DockComponent */],
                        __WEBPACK_IMPORTED_MODULE_4__dock_monitor__["a" /* DockMonitorComponent */]
                    ],
                    providers: [
                        __WEBPACK_IMPORTED_MODULE_5__actions__["a" /* DockActions */]
                    ],
                    exports: [
                        __WEBPACK_IMPORTED_MODULE_4__dock_monitor__["a" /* DockMonitorComponent */]
                    ]
                },] },
    ];
    /** @nocollapse */
    DockMonitorModule.ctorParameters = [];
    return DockMonitorModule;
}());

//# sourceMappingURL=index.js.map

/***/ }),
/* 384 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__ngrx_core_compose__ = __webpack_require__(579);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__ngrx_core_compose___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_0__ngrx_core_compose__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "d", function() { return KNOWN; });
/* harmony export (immutable) */ __webpack_exports__["c"] = getTypeOf;
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "b", function() { return getLabelFor; });
/* harmony export (immutable) */ __webpack_exports__["a"] = getChildrenFor;

var KNOWN = {
    Array: 'array',
    Object: 'object',
    Null: 'null',
    Undefined: 'undefined',
    Boolean: 'boolean',
    Number: 'number',
    String: 'string',
    Symbol: 'symbol',
    Function: 'function',
    Iterable: 'iterable'
};
function getTypeOf(object) {
    var literalType = typeof object;
    if (literalType === 'object') {
        if (Array.isArray(object)) {
            return KNOWN.Array;
        }
        if (object === null) {
            return KNOWN.Null;
        }
        if (typeof object[Symbol.iterator] === 'function') {
            return KNOWN.Iterable;
        }
    }
    return literalType;
}
var arrayLength = function (value) { return value.length; };
var lengthLabel = function (single, plural) { return function (length) { return (length + " " + (length === 1 ? single : plural)); }; };
var typeIndicator = function (typeIndicator) { return function (input) { return (typeIndicator + " " + input); }; };
var typeIdentity = function (type) { return function () { return type; }; };
var withQuotes = function (val) { return ("\"" + val + "\""); };
var toString = function (val) { return val.toString(); };
var iterableToArray = function (value) { return Array.from(value); };
var labelFactoriesForTypes = (_a = {},
    _a[KNOWN.Array] = __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_0__ngrx_core_compose__["compose"])(typeIndicator('[]'), lengthLabel('item', 'items'), arrayLength),
    _a[KNOWN.Object] = __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_0__ngrx_core_compose__["compose"])(typeIndicator('{}'), lengthLabel('key', 'keys'), arrayLength, Object.getOwnPropertyNames),
    _a[KNOWN.Null] = typeIdentity(KNOWN.Null),
    _a[KNOWN.Undefined] = typeIdentity(KNOWN.Undefined),
    _a[KNOWN.Boolean] = function (val) { return val ? 'true' : 'false'; },
    _a[KNOWN.Number] = toString,
    _a[KNOWN.String] = withQuotes,
    _a[KNOWN.Symbol] = __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_0__ngrx_core_compose__["compose"])(withQuotes, toString),
    _a[KNOWN.Function] = typeIdentity(KNOWN.Function),
    _a[KNOWN.Iterable] = __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_0__ngrx_core_compose__["compose"])(typeIndicator('()'), lengthLabel('entry', 'entries'), arrayLength, iterableToArray),
    _a
);
var lookupLabelForType = function (type) { return labelFactoriesForTypes[type]; };
var getLabelFor = function (object) { return labelFactoriesForTypes[getTypeOf(object)](object); };
function getChildrenFor(object) {
    var literalType = getTypeOf(object);
    if (literalType === KNOWN.Object) {
        return Object.getOwnPropertyNames(object).map(function (name) {
            return { key: name, value: object[name] };
        });
    }
    else if (literalType === KNOWN.Array) {
        return object.map(function (value, index) {
            return { key: index, value: value };
        });
    }
    else if (literalType === KNOWN.Iterable) {
        return Array.from(object).map(function (value, index) {
            return { key: index, value: value };
        });
    }
    throw new TypeError("Tried to get children for non-enumerable type \"" + literalType + "\"");
}
var _a;
//# sourceMappingURL=types.js.map

/***/ }),
/* 385 */,
/* 386 */,
/* 387 */,
/* 388 */,
/* 389 */,
/* 390 */,
/* 391 */,
/* 392 */,
/* 393 */,
/* 394 */,
/* 395 */,
/* 396 */,
/* 397 */,
/* 398 */,
/* 399 */,
/* 400 */,
/* 401 */,
/* 402 */,
/* 403 */,
/* 404 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

function __export(m) {
    for (var p in m) if (!exports.hasOwnProperty(p)) exports[p] = m[p];
}
__export(__webpack_require__(403));


/***/ }),
/* 405 */,
/* 406 */,
/* 407 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
// a passthrough stream.
// basically just the most minimal sort of Transform stream.
// Every written chunk gets output as-is.



module.exports = PassThrough;

var Transform = __webpack_require__(270);

/*<replacement>*/
var util = __webpack_require__(120);
util.inherits = __webpack_require__(92);
/*</replacement>*/

util.inherits(PassThrough, Transform);

function PassThrough(options) {
  if (!(this instanceof PassThrough)) return new PassThrough(options);

  Transform.call(this, options);
}

PassThrough.prototype._transform = function (chunk, encoding, cb) {
  cb(null, chunk);
};

/***/ }),
/* 408 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/* WEBPACK VAR INJECTION */(function(process) {

module.exports = Readable;

/*<replacement>*/
var processNextTick = __webpack_require__(268);
/*</replacement>*/

/*<replacement>*/
var isArray = __webpack_require__(401);
/*</replacement>*/

/*<replacement>*/
var Duplex;
/*</replacement>*/

Readable.ReadableState = ReadableState;

/*<replacement>*/
var EE = __webpack_require__(175).EventEmitter;

var EElistenerCount = function (emitter, type) {
  return emitter.listeners(type).length;
};
/*</replacement>*/

/*<replacement>*/
var Stream;
(function () {
  try {
    Stream = __webpack_require__(191);
  } catch (_) {} finally {
    if (!Stream) Stream = __webpack_require__(175).EventEmitter;
  }
})();
/*</replacement>*/

var Buffer = __webpack_require__(56).Buffer;
/*<replacement>*/
var bufferShim = __webpack_require__(251);
/*</replacement>*/

/*<replacement>*/
var util = __webpack_require__(120);
util.inherits = __webpack_require__(92);
/*</replacement>*/

/*<replacement>*/
var debugUtil = __webpack_require__(1127);
var debug = void 0;
if (debugUtil && debugUtil.debuglog) {
  debug = debugUtil.debuglog('stream');
} else {
  debug = function () {};
}
/*</replacement>*/

var BufferList = __webpack_require__(757);
var StringDecoder;

util.inherits(Readable, Stream);

function prependListener(emitter, event, fn) {
  // Sadly this is not cacheable as some libraries bundle their own
  // event emitter implementation with them.
  if (typeof emitter.prependListener === 'function') {
    return emitter.prependListener(event, fn);
  } else {
    // This is a hack to make sure that our error handler is attached before any
    // userland ones.  NEVER DO THIS. This is here only because this code needs
    // to continue to work with older versions of Node.js that do not include
    // the prependListener() method. The goal is to eventually remove this hack.
    if (!emitter._events || !emitter._events[event]) emitter.on(event, fn);else if (isArray(emitter._events[event])) emitter._events[event].unshift(fn);else emitter._events[event] = [fn, emitter._events[event]];
  }
}

function ReadableState(options, stream) {
  Duplex = Duplex || __webpack_require__(78);

  options = options || {};

  // object stream flag. Used to make read(n) ignore n and to
  // make all the buffer merging and length checks go away
  this.objectMode = !!options.objectMode;

  if (stream instanceof Duplex) this.objectMode = this.objectMode || !!options.readableObjectMode;

  // the point at which it stops calling _read() to fill the buffer
  // Note: 0 is a valid value, means "don't call _read preemptively ever"
  var hwm = options.highWaterMark;
  var defaultHwm = this.objectMode ? 16 : 16 * 1024;
  this.highWaterMark = hwm || hwm === 0 ? hwm : defaultHwm;

  // cast to ints.
  this.highWaterMark = ~ ~this.highWaterMark;

  // A linked list is used to store data chunks instead of an array because the
  // linked list can remove elements from the beginning faster than
  // array.shift()
  this.buffer = new BufferList();
  this.length = 0;
  this.pipes = null;
  this.pipesCount = 0;
  this.flowing = null;
  this.ended = false;
  this.endEmitted = false;
  this.reading = false;

  // a flag to be able to tell if the onwrite cb is called immediately,
  // or on a later tick.  We set this to true at first, because any
  // actions that shouldn't happen until "later" should generally also
  // not happen before the first write call.
  this.sync = true;

  // whenever we return null, then we set a flag to say
  // that we're awaiting a 'readable' event emission.
  this.needReadable = false;
  this.emittedReadable = false;
  this.readableListening = false;
  this.resumeScheduled = false;

  // Crypto is kind of old and crusty.  Historically, its default string
  // encoding is 'binary' so we have to make this configurable.
  // Everything else in the universe uses 'utf8', though.
  this.defaultEncoding = options.defaultEncoding || 'utf8';

  // when piping, we only care about 'readable' events that happen
  // after read()ing all the bytes and not getting any pushback.
  this.ranOut = false;

  // the number of writers that are awaiting a drain event in .pipe()s
  this.awaitDrain = 0;

  // if true, a maybeReadMore has been scheduled
  this.readingMore = false;

  this.decoder = null;
  this.encoding = null;
  if (options.encoding) {
    if (!StringDecoder) StringDecoder = __webpack_require__(442).StringDecoder;
    this.decoder = new StringDecoder(options.encoding);
    this.encoding = options.encoding;
  }
}

function Readable(options) {
  Duplex = Duplex || __webpack_require__(78);

  if (!(this instanceof Readable)) return new Readable(options);

  this._readableState = new ReadableState(options, this);

  // legacy
  this.readable = true;

  if (options && typeof options.read === 'function') this._read = options.read;

  Stream.call(this);
}

// Manually shove something into the read() buffer.
// This returns true if the highWaterMark has not been hit yet,
// similar to how Writable.write() returns true if you should
// write() some more.
Readable.prototype.push = function (chunk, encoding) {
  var state = this._readableState;

  if (!state.objectMode && typeof chunk === 'string') {
    encoding = encoding || state.defaultEncoding;
    if (encoding !== state.encoding) {
      chunk = bufferShim.from(chunk, encoding);
      encoding = '';
    }
  }

  return readableAddChunk(this, state, chunk, encoding, false);
};

// Unshift should *always* be something directly out of read()
Readable.prototype.unshift = function (chunk) {
  var state = this._readableState;
  return readableAddChunk(this, state, chunk, '', true);
};

Readable.prototype.isPaused = function () {
  return this._readableState.flowing === false;
};

function readableAddChunk(stream, state, chunk, encoding, addToFront) {
  var er = chunkInvalid(state, chunk);
  if (er) {
    stream.emit('error', er);
  } else if (chunk === null) {
    state.reading = false;
    onEofChunk(stream, state);
  } else if (state.objectMode || chunk && chunk.length > 0) {
    if (state.ended && !addToFront) {
      var e = new Error('stream.push() after EOF');
      stream.emit('error', e);
    } else if (state.endEmitted && addToFront) {
      var _e = new Error('stream.unshift() after end event');
      stream.emit('error', _e);
    } else {
      var skipAdd;
      if (state.decoder && !addToFront && !encoding) {
        chunk = state.decoder.write(chunk);
        skipAdd = !state.objectMode && chunk.length === 0;
      }

      if (!addToFront) state.reading = false;

      // Don't add to the buffer if we've decoded to an empty string chunk and
      // we're not in object mode
      if (!skipAdd) {
        // if we want the data now, just emit it.
        if (state.flowing && state.length === 0 && !state.sync) {
          stream.emit('data', chunk);
          stream.read(0);
        } else {
          // update the buffer info.
          state.length += state.objectMode ? 1 : chunk.length;
          if (addToFront) state.buffer.unshift(chunk);else state.buffer.push(chunk);

          if (state.needReadable) emitReadable(stream);
        }
      }

      maybeReadMore(stream, state);
    }
  } else if (!addToFront) {
    state.reading = false;
  }

  return needMoreData(state);
}

// if it's past the high water mark, we can push in some more.
// Also, if we have no data yet, we can stand some
// more bytes.  This is to work around cases where hwm=0,
// such as the repl.  Also, if the push() triggered a
// readable event, and the user called read(largeNumber) such that
// needReadable was set, then we ought to push more, so that another
// 'readable' event will be triggered.
function needMoreData(state) {
  return !state.ended && (state.needReadable || state.length < state.highWaterMark || state.length === 0);
}

// backwards compatibility.
Readable.prototype.setEncoding = function (enc) {
  if (!StringDecoder) StringDecoder = __webpack_require__(442).StringDecoder;
  this._readableState.decoder = new StringDecoder(enc);
  this._readableState.encoding = enc;
  return this;
};

// Don't raise the hwm > 8MB
var MAX_HWM = 0x800000;
function computeNewHighWaterMark(n) {
  if (n >= MAX_HWM) {
    n = MAX_HWM;
  } else {
    // Get the next highest power of 2 to prevent increasing hwm excessively in
    // tiny amounts
    n--;
    n |= n >>> 1;
    n |= n >>> 2;
    n |= n >>> 4;
    n |= n >>> 8;
    n |= n >>> 16;
    n++;
  }
  return n;
}

// This function is designed to be inlinable, so please take care when making
// changes to the function body.
function howMuchToRead(n, state) {
  if (n <= 0 || state.length === 0 && state.ended) return 0;
  if (state.objectMode) return 1;
  if (n !== n) {
    // Only flow one buffer at a time
    if (state.flowing && state.length) return state.buffer.head.data.length;else return state.length;
  }
  // If we're asking for more than the current hwm, then raise the hwm.
  if (n > state.highWaterMark) state.highWaterMark = computeNewHighWaterMark(n);
  if (n <= state.length) return n;
  // Don't have enough
  if (!state.ended) {
    state.needReadable = true;
    return 0;
  }
  return state.length;
}

// you can override either this method, or the async _read(n) below.
Readable.prototype.read = function (n) {
  debug('read', n);
  n = parseInt(n, 10);
  var state = this._readableState;
  var nOrig = n;

  if (n !== 0) state.emittedReadable = false;

  // if we're doing read(0) to trigger a readable event, but we
  // already have a bunch of data in the buffer, then just trigger
  // the 'readable' event and move on.
  if (n === 0 && state.needReadable && (state.length >= state.highWaterMark || state.ended)) {
    debug('read: emitReadable', state.length, state.ended);
    if (state.length === 0 && state.ended) endReadable(this);else emitReadable(this);
    return null;
  }

  n = howMuchToRead(n, state);

  // if we've ended, and we're now clear, then finish it up.
  if (n === 0 && state.ended) {
    if (state.length === 0) endReadable(this);
    return null;
  }

  // All the actual chunk generation logic needs to be
  // *below* the call to _read.  The reason is that in certain
  // synthetic stream cases, such as passthrough streams, _read
  // may be a completely synchronous operation which may change
  // the state of the read buffer, providing enough data when
  // before there was *not* enough.
  //
  // So, the steps are:
  // 1. Figure out what the state of things will be after we do
  // a read from the buffer.
  //
  // 2. If that resulting state will trigger a _read, then call _read.
  // Note that this may be asynchronous, or synchronous.  Yes, it is
  // deeply ugly to write APIs this way, but that still doesn't mean
  // that the Readable class should behave improperly, as streams are
  // designed to be sync/async agnostic.
  // Take note if the _read call is sync or async (ie, if the read call
  // has returned yet), so that we know whether or not it's safe to emit
  // 'readable' etc.
  //
  // 3. Actually pull the requested chunks out of the buffer and return.

  // if we need a readable event, then we need to do some reading.
  var doRead = state.needReadable;
  debug('need readable', doRead);

  // if we currently have less than the highWaterMark, then also read some
  if (state.length === 0 || state.length - n < state.highWaterMark) {
    doRead = true;
    debug('length less than watermark', doRead);
  }

  // however, if we've ended, then there's no point, and if we're already
  // reading, then it's unnecessary.
  if (state.ended || state.reading) {
    doRead = false;
    debug('reading or ended', doRead);
  } else if (doRead) {
    debug('do read');
    state.reading = true;
    state.sync = true;
    // if the length is currently zero, then we *need* a readable event.
    if (state.length === 0) state.needReadable = true;
    // call internal read method
    this._read(state.highWaterMark);
    state.sync = false;
    // If _read pushed data synchronously, then `reading` will be false,
    // and we need to re-evaluate how much data we can return to the user.
    if (!state.reading) n = howMuchToRead(nOrig, state);
  }

  var ret;
  if (n > 0) ret = fromList(n, state);else ret = null;

  if (ret === null) {
    state.needReadable = true;
    n = 0;
  } else {
    state.length -= n;
  }

  if (state.length === 0) {
    // If we have nothing in the buffer, then we want to know
    // as soon as we *do* get something into the buffer.
    if (!state.ended) state.needReadable = true;

    // If we tried to read() past the EOF, then emit end on the next tick.
    if (nOrig !== n && state.ended) endReadable(this);
  }

  if (ret !== null) this.emit('data', ret);

  return ret;
};

function chunkInvalid(state, chunk) {
  var er = null;
  if (!Buffer.isBuffer(chunk) && typeof chunk !== 'string' && chunk !== null && chunk !== undefined && !state.objectMode) {
    er = new TypeError('Invalid non-string/buffer chunk');
  }
  return er;
}

function onEofChunk(stream, state) {
  if (state.ended) return;
  if (state.decoder) {
    var chunk = state.decoder.end();
    if (chunk && chunk.length) {
      state.buffer.push(chunk);
      state.length += state.objectMode ? 1 : chunk.length;
    }
  }
  state.ended = true;

  // emit 'readable' now to make sure it gets picked up.
  emitReadable(stream);
}

// Don't emit readable right away in sync mode, because this can trigger
// another read() call => stack overflow.  This way, it might trigger
// a nextTick recursion warning, but that's not so bad.
function emitReadable(stream) {
  var state = stream._readableState;
  state.needReadable = false;
  if (!state.emittedReadable) {
    debug('emitReadable', state.flowing);
    state.emittedReadable = true;
    if (state.sync) processNextTick(emitReadable_, stream);else emitReadable_(stream);
  }
}

function emitReadable_(stream) {
  debug('emit readable');
  stream.emit('readable');
  flow(stream);
}

// at this point, the user has presumably seen the 'readable' event,
// and called read() to consume some data.  that may have triggered
// in turn another _read(n) call, in which case reading = true if
// it's in progress.
// However, if we're not ended, or reading, and the length < hwm,
// then go ahead and try to read some more preemptively.
function maybeReadMore(stream, state) {
  if (!state.readingMore) {
    state.readingMore = true;
    processNextTick(maybeReadMore_, stream, state);
  }
}

function maybeReadMore_(stream, state) {
  var len = state.length;
  while (!state.reading && !state.flowing && !state.ended && state.length < state.highWaterMark) {
    debug('maybeReadMore read 0');
    stream.read(0);
    if (len === state.length)
      // didn't get any data, stop spinning.
      break;else len = state.length;
  }
  state.readingMore = false;
}

// abstract method.  to be overridden in specific implementation classes.
// call cb(er, data) where data is <= n in length.
// for virtual (non-string, non-buffer) streams, "length" is somewhat
// arbitrary, and perhaps not very meaningful.
Readable.prototype._read = function (n) {
  this.emit('error', new Error('_read() is not implemented'));
};

Readable.prototype.pipe = function (dest, pipeOpts) {
  var src = this;
  var state = this._readableState;

  switch (state.pipesCount) {
    case 0:
      state.pipes = dest;
      break;
    case 1:
      state.pipes = [state.pipes, dest];
      break;
    default:
      state.pipes.push(dest);
      break;
  }
  state.pipesCount += 1;
  debug('pipe count=%d opts=%j', state.pipesCount, pipeOpts);

  var doEnd = (!pipeOpts || pipeOpts.end !== false) && dest !== process.stdout && dest !== process.stderr;

  var endFn = doEnd ? onend : cleanup;
  if (state.endEmitted) processNextTick(endFn);else src.once('end', endFn);

  dest.on('unpipe', onunpipe);
  function onunpipe(readable) {
    debug('onunpipe');
    if (readable === src) {
      cleanup();
    }
  }

  function onend() {
    debug('onend');
    dest.end();
  }

  // when the dest drains, it reduces the awaitDrain counter
  // on the source.  This would be more elegant with a .once()
  // handler in flow(), but adding and removing repeatedly is
  // too slow.
  var ondrain = pipeOnDrain(src);
  dest.on('drain', ondrain);

  var cleanedUp = false;
  function cleanup() {
    debug('cleanup');
    // cleanup event handlers once the pipe is broken
    dest.removeListener('close', onclose);
    dest.removeListener('finish', onfinish);
    dest.removeListener('drain', ondrain);
    dest.removeListener('error', onerror);
    dest.removeListener('unpipe', onunpipe);
    src.removeListener('end', onend);
    src.removeListener('end', cleanup);
    src.removeListener('data', ondata);

    cleanedUp = true;

    // if the reader is waiting for a drain event from this
    // specific writer, then it would cause it to never start
    // flowing again.
    // So, if this is awaiting a drain, then we just call it now.
    // If we don't know, then assume that we are waiting for one.
    if (state.awaitDrain && (!dest._writableState || dest._writableState.needDrain)) ondrain();
  }

  // If the user pushes more data while we're writing to dest then we'll end up
  // in ondata again. However, we only want to increase awaitDrain once because
  // dest will only emit one 'drain' event for the multiple writes.
  // => Introduce a guard on increasing awaitDrain.
  var increasedAwaitDrain = false;
  src.on('data', ondata);
  function ondata(chunk) {
    debug('ondata');
    increasedAwaitDrain = false;
    var ret = dest.write(chunk);
    if (false === ret && !increasedAwaitDrain) {
      // If the user unpiped during `dest.write()`, it is possible
      // to get stuck in a permanently paused state if that write
      // also returned false.
      // => Check whether `dest` is still a piping destination.
      if ((state.pipesCount === 1 && state.pipes === dest || state.pipesCount > 1 && indexOf(state.pipes, dest) !== -1) && !cleanedUp) {
        debug('false write response, pause', src._readableState.awaitDrain);
        src._readableState.awaitDrain++;
        increasedAwaitDrain = true;
      }
      src.pause();
    }
  }

  // if the dest has an error, then stop piping into it.
  // however, don't suppress the throwing behavior for this.
  function onerror(er) {
    debug('onerror', er);
    unpipe();
    dest.removeListener('error', onerror);
    if (EElistenerCount(dest, 'error') === 0) dest.emit('error', er);
  }

  // Make sure our error handler is attached before userland ones.
  prependListener(dest, 'error', onerror);

  // Both close and finish should trigger unpipe, but only once.
  function onclose() {
    dest.removeListener('finish', onfinish);
    unpipe();
  }
  dest.once('close', onclose);
  function onfinish() {
    debug('onfinish');
    dest.removeListener('close', onclose);
    unpipe();
  }
  dest.once('finish', onfinish);

  function unpipe() {
    debug('unpipe');
    src.unpipe(dest);
  }

  // tell the dest that it's being piped to
  dest.emit('pipe', src);

  // start the flow if it hasn't been started already.
  if (!state.flowing) {
    debug('pipe resume');
    src.resume();
  }

  return dest;
};

function pipeOnDrain(src) {
  return function () {
    var state = src._readableState;
    debug('pipeOnDrain', state.awaitDrain);
    if (state.awaitDrain) state.awaitDrain--;
    if (state.awaitDrain === 0 && EElistenerCount(src, 'data')) {
      state.flowing = true;
      flow(src);
    }
  };
}

Readable.prototype.unpipe = function (dest) {
  var state = this._readableState;

  // if we're not piping anywhere, then do nothing.
  if (state.pipesCount === 0) return this;

  // just one destination.  most common case.
  if (state.pipesCount === 1) {
    // passed in one, but it's not the right one.
    if (dest && dest !== state.pipes) return this;

    if (!dest) dest = state.pipes;

    // got a match.
    state.pipes = null;
    state.pipesCount = 0;
    state.flowing = false;
    if (dest) dest.emit('unpipe', this);
    return this;
  }

  // slow case. multiple pipe destinations.

  if (!dest) {
    // remove all.
    var dests = state.pipes;
    var len = state.pipesCount;
    state.pipes = null;
    state.pipesCount = 0;
    state.flowing = false;

    for (var i = 0; i < len; i++) {
      dests[i].emit('unpipe', this);
    }return this;
  }

  // try to find the right one.
  var index = indexOf(state.pipes, dest);
  if (index === -1) return this;

  state.pipes.splice(index, 1);
  state.pipesCount -= 1;
  if (state.pipesCount === 1) state.pipes = state.pipes[0];

  dest.emit('unpipe', this);

  return this;
};

// set up data events if they are asked for
// Ensure readable listeners eventually get something
Readable.prototype.on = function (ev, fn) {
  var res = Stream.prototype.on.call(this, ev, fn);

  if (ev === 'data') {
    // Start flowing on next tick if stream isn't explicitly paused
    if (this._readableState.flowing !== false) this.resume();
  } else if (ev === 'readable') {
    var state = this._readableState;
    if (!state.endEmitted && !state.readableListening) {
      state.readableListening = state.needReadable = true;
      state.emittedReadable = false;
      if (!state.reading) {
        processNextTick(nReadingNextTick, this);
      } else if (state.length) {
        emitReadable(this, state);
      }
    }
  }

  return res;
};
Readable.prototype.addListener = Readable.prototype.on;

function nReadingNextTick(self) {
  debug('readable nexttick read 0');
  self.read(0);
}

// pause() and resume() are remnants of the legacy readable stream API
// If the user uses them, then switch into old mode.
Readable.prototype.resume = function () {
  var state = this._readableState;
  if (!state.flowing) {
    debug('resume');
    state.flowing = true;
    resume(this, state);
  }
  return this;
};

function resume(stream, state) {
  if (!state.resumeScheduled) {
    state.resumeScheduled = true;
    processNextTick(resume_, stream, state);
  }
}

function resume_(stream, state) {
  if (!state.reading) {
    debug('resume read 0');
    stream.read(0);
  }

  state.resumeScheduled = false;
  state.awaitDrain = 0;
  stream.emit('resume');
  flow(stream);
  if (state.flowing && !state.reading) stream.read(0);
}

Readable.prototype.pause = function () {
  debug('call pause flowing=%j', this._readableState.flowing);
  if (false !== this._readableState.flowing) {
    debug('pause');
    this._readableState.flowing = false;
    this.emit('pause');
  }
  return this;
};

function flow(stream) {
  var state = stream._readableState;
  debug('flow', state.flowing);
  while (state.flowing && stream.read() !== null) {}
}

// wrap an old-style stream as the async data source.
// This is *not* part of the readable stream interface.
// It is an ugly unfortunate mess of history.
Readable.prototype.wrap = function (stream) {
  var state = this._readableState;
  var paused = false;

  var self = this;
  stream.on('end', function () {
    debug('wrapped end');
    if (state.decoder && !state.ended) {
      var chunk = state.decoder.end();
      if (chunk && chunk.length) self.push(chunk);
    }

    self.push(null);
  });

  stream.on('data', function (chunk) {
    debug('wrapped data');
    if (state.decoder) chunk = state.decoder.write(chunk);

    // don't skip over falsy values in objectMode
    if (state.objectMode && (chunk === null || chunk === undefined)) return;else if (!state.objectMode && (!chunk || !chunk.length)) return;

    var ret = self.push(chunk);
    if (!ret) {
      paused = true;
      stream.pause();
    }
  });

  // proxy all the other methods.
  // important when wrapping filters and duplexes.
  for (var i in stream) {
    if (this[i] === undefined && typeof stream[i] === 'function') {
      this[i] = function (method) {
        return function () {
          return stream[method].apply(stream, arguments);
        };
      }(i);
    }
  }

  // proxy certain important events.
  var events = ['error', 'close', 'destroy', 'pause', 'resume'];
  forEach(events, function (ev) {
    stream.on(ev, self.emit.bind(self, ev));
  });

  // when we try to consume some more bytes, simply unpause the
  // underlying stream.
  self._read = function (n) {
    debug('wrapped _read', n);
    if (paused) {
      paused = false;
      stream.resume();
    }
  };

  return self;
};

// exposed for testing purposes only.
Readable._fromList = fromList;

// Pluck off n bytes from an array of buffers.
// Length is the combined lengths of all the buffers in the list.
// This function is designed to be inlinable, so please take care when making
// changes to the function body.
function fromList(n, state) {
  // nothing buffered
  if (state.length === 0) return null;

  var ret;
  if (state.objectMode) ret = state.buffer.shift();else if (!n || n >= state.length) {
    // read it all, truncate the list
    if (state.decoder) ret = state.buffer.join('');else if (state.buffer.length === 1) ret = state.buffer.head.data;else ret = state.buffer.concat(state.length);
    state.buffer.clear();
  } else {
    // read part of list
    ret = fromListPartial(n, state.buffer, state.decoder);
  }

  return ret;
}

// Extracts only enough buffered data to satisfy the amount requested.
// This function is designed to be inlinable, so please take care when making
// changes to the function body.
function fromListPartial(n, list, hasStrings) {
  var ret;
  if (n < list.head.data.length) {
    // slice is the same for buffers and strings
    ret = list.head.data.slice(0, n);
    list.head.data = list.head.data.slice(n);
  } else if (n === list.head.data.length) {
    // first chunk is a perfect match
    ret = list.shift();
  } else {
    // result spans more than one buffer
    ret = hasStrings ? copyFromBufferString(n, list) : copyFromBuffer(n, list);
  }
  return ret;
}

// Copies a specified amount of characters from the list of buffered data
// chunks.
// This function is designed to be inlinable, so please take care when making
// changes to the function body.
function copyFromBufferString(n, list) {
  var p = list.head;
  var c = 1;
  var ret = p.data;
  n -= ret.length;
  while (p = p.next) {
    var str = p.data;
    var nb = n > str.length ? str.length : n;
    if (nb === str.length) ret += str;else ret += str.slice(0, n);
    n -= nb;
    if (n === 0) {
      if (nb === str.length) {
        ++c;
        if (p.next) list.head = p.next;else list.head = list.tail = null;
      } else {
        list.head = p;
        p.data = str.slice(nb);
      }
      break;
    }
    ++c;
  }
  list.length -= c;
  return ret;
}

// Copies a specified amount of bytes from the list of buffered data chunks.
// This function is designed to be inlinable, so please take care when making
// changes to the function body.
function copyFromBuffer(n, list) {
  var ret = bufferShim.allocUnsafe(n);
  var p = list.head;
  var c = 1;
  p.data.copy(ret);
  n -= p.data.length;
  while (p = p.next) {
    var buf = p.data;
    var nb = n > buf.length ? buf.length : n;
    buf.copy(ret, ret.length - n, 0, nb);
    n -= nb;
    if (n === 0) {
      if (nb === buf.length) {
        ++c;
        if (p.next) list.head = p.next;else list.head = list.tail = null;
      } else {
        list.head = p;
        p.data = buf.slice(nb);
      }
      break;
    }
    ++c;
  }
  list.length -= c;
  return ret;
}

function endReadable(stream) {
  var state = stream._readableState;

  // If we get here before consuming all the bytes, then that is a
  // bug in node.  Should never happen.
  if (state.length > 0) throw new Error('"endReadable()" called on non-empty stream');

  if (!state.endEmitted) {
    state.ended = true;
    processNextTick(endReadableNT, state, stream);
  }
}

function endReadableNT(state, stream) {
  // Check that we didn't get one last unshift.
  if (!state.endEmitted && state.length === 0) {
    state.endEmitted = true;
    stream.readable = false;
    stream.emit('end');
  }
}

function forEach(xs, f) {
  for (var i = 0, l = xs.length; i < l; i++) {
    f(xs[i], i);
  }
}

function indexOf(xs, x) {
  for (var i = 0, l = xs.length; i < l; i++) {
    if (xs[i] === x) return i;
  }
  return -1;
}
/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(32)))

/***/ }),
/* 409 */,
/* 410 */,
/* 411 */,
/* 412 */,
/* 413 */,
/* 414 */,
/* 415 */,
/* 416 */,
/* 417 */,
/* 418 */,
/* 419 */,
/* 420 */,
/* 421 */,
/* 422 */,
/* 423 */,
/* 424 */,
/* 425 */,
/* 426 */,
/* 427 */,
/* 428 */,
/* 429 */,
/* 430 */,
/* 431 */,
/* 432 */,
/* 433 */,
/* 434 */,
/* 435 */,
/* 436 */,
/* 437 */,
/* 438 */,
/* 439 */,
/* 440 */,
/* 441 */,
/* 442 */
/***/ (function(module, exports, __webpack_require__) {

// Copyright Joyent, Inc. and other Node contributors.
//
// Permission is hereby granted, free of charge, to any person obtaining a
// copy of this software and associated documentation files (the
// "Software"), to deal in the Software without restriction, including
// without limitation the rights to use, copy, modify, merge, publish,
// distribute, sublicense, and/or sell copies of the Software, and to permit
// persons to whom the Software is furnished to do so, subject to the
// following conditions:
//
// The above copyright notice and this permission notice shall be included
// in all copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS
// OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
// MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN
// NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM,
// DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR
// OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE
// USE OR OTHER DEALINGS IN THE SOFTWARE.

var Buffer = __webpack_require__(56).Buffer;

var isBufferEncoding = Buffer.isEncoding
  || function(encoding) {
       switch (encoding && encoding.toLowerCase()) {
         case 'hex': case 'utf8': case 'utf-8': case 'ascii': case 'binary': case 'base64': case 'ucs2': case 'ucs-2': case 'utf16le': case 'utf-16le': case 'raw': return true;
         default: return false;
       }
     }


function assertEncoding(encoding) {
  if (encoding && !isBufferEncoding(encoding)) {
    throw new Error('Unknown encoding: ' + encoding);
  }
}

// StringDecoder provides an interface for efficiently splitting a series of
// buffers into a series of JS strings without breaking apart multi-byte
// characters. CESU-8 is handled as part of the UTF-8 encoding.
//
// @TODO Handling all encodings inside a single object makes it very difficult
// to reason about this code, so it should be split up in the future.
// @TODO There should be a utf8-strict encoding that rejects invalid UTF-8 code
// points as used by CESU-8.
var StringDecoder = exports.StringDecoder = function(encoding) {
  this.encoding = (encoding || 'utf8').toLowerCase().replace(/[-_]/, '');
  assertEncoding(encoding);
  switch (this.encoding) {
    case 'utf8':
      // CESU-8 represents each of Surrogate Pair by 3-bytes
      this.surrogateSize = 3;
      break;
    case 'ucs2':
    case 'utf16le':
      // UTF-16 represents each of Surrogate Pair by 2-bytes
      this.surrogateSize = 2;
      this.detectIncompleteChar = utf16DetectIncompleteChar;
      break;
    case 'base64':
      // Base-64 stores 3 bytes in 4 chars, and pads the remainder.
      this.surrogateSize = 3;
      this.detectIncompleteChar = base64DetectIncompleteChar;
      break;
    default:
      this.write = passThroughWrite;
      return;
  }

  // Enough space to store all bytes of a single character. UTF-8 needs 4
  // bytes, but CESU-8 may require up to 6 (3 bytes per surrogate).
  this.charBuffer = new Buffer(6);
  // Number of bytes received for the current incomplete multi-byte character.
  this.charReceived = 0;
  // Number of bytes expected for the current incomplete multi-byte character.
  this.charLength = 0;
};


// write decodes the given buffer and returns it as JS string that is
// guaranteed to not contain any partial multi-byte characters. Any partial
// character found at the end of the buffer is buffered up, and will be
// returned when calling write again with the remaining bytes.
//
// Note: Converting a Buffer containing an orphan surrogate to a String
// currently works, but converting a String to a Buffer (via `new Buffer`, or
// Buffer#write) will replace incomplete surrogates with the unicode
// replacement character. See https://codereview.chromium.org/121173009/ .
StringDecoder.prototype.write = function(buffer) {
  var charStr = '';
  // if our last write ended with an incomplete multibyte character
  while (this.charLength) {
    // determine how many remaining bytes this buffer has to offer for this char
    var available = (buffer.length >= this.charLength - this.charReceived) ?
        this.charLength - this.charReceived :
        buffer.length;

    // add the new bytes to the char buffer
    buffer.copy(this.charBuffer, this.charReceived, 0, available);
    this.charReceived += available;

    if (this.charReceived < this.charLength) {
      // still not enough chars in this buffer? wait for more ...
      return '';
    }

    // remove bytes belonging to the current character from the buffer
    buffer = buffer.slice(available, buffer.length);

    // get the character that was split
    charStr = this.charBuffer.slice(0, this.charLength).toString(this.encoding);

    // CESU-8: lead surrogate (D800-DBFF) is also the incomplete character
    var charCode = charStr.charCodeAt(charStr.length - 1);
    if (charCode >= 0xD800 && charCode <= 0xDBFF) {
      this.charLength += this.surrogateSize;
      charStr = '';
      continue;
    }
    this.charReceived = this.charLength = 0;

    // if there are no more bytes in this buffer, just emit our char
    if (buffer.length === 0) {
      return charStr;
    }
    break;
  }

  // determine and set charLength / charReceived
  this.detectIncompleteChar(buffer);

  var end = buffer.length;
  if (this.charLength) {
    // buffer the incomplete character bytes we got
    buffer.copy(this.charBuffer, 0, buffer.length - this.charReceived, end);
    end -= this.charReceived;
  }

  charStr += buffer.toString(this.encoding, 0, end);

  var end = charStr.length - 1;
  var charCode = charStr.charCodeAt(end);
  // CESU-8: lead surrogate (D800-DBFF) is also the incomplete character
  if (charCode >= 0xD800 && charCode <= 0xDBFF) {
    var size = this.surrogateSize;
    this.charLength += size;
    this.charReceived += size;
    this.charBuffer.copy(this.charBuffer, size, 0, size);
    buffer.copy(this.charBuffer, 0, 0, size);
    return charStr.substring(0, end);
  }

  // or just emit the charStr
  return charStr;
};

// detectIncompleteChar determines if there is an incomplete UTF-8 character at
// the end of the given buffer. If so, it sets this.charLength to the byte
// length that character, and sets this.charReceived to the number of bytes
// that are available for this character.
StringDecoder.prototype.detectIncompleteChar = function(buffer) {
  // determine how many bytes we have to check at the end of this buffer
  var i = (buffer.length >= 3) ? 3 : buffer.length;

  // Figure out if one of the last i bytes of our buffer announces an
  // incomplete char.
  for (; i > 0; i--) {
    var c = buffer[buffer.length - i];

    // See http://en.wikipedia.org/wiki/UTF-8#Description

    // 110XXXXX
    if (i == 1 && c >> 5 == 0x06) {
      this.charLength = 2;
      break;
    }

    // 1110XXXX
    if (i <= 2 && c >> 4 == 0x0E) {
      this.charLength = 3;
      break;
    }

    // 11110XXX
    if (i <= 3 && c >> 3 == 0x1E) {
      this.charLength = 4;
      break;
    }
  }
  this.charReceived = i;
};

StringDecoder.prototype.end = function(buffer) {
  var res = '';
  if (buffer && buffer.length)
    res = this.write(buffer);

  if (this.charReceived) {
    var cr = this.charReceived;
    var buf = this.charBuffer;
    var enc = this.encoding;
    res += buf.slice(0, cr).toString(enc);
  }

  return res;
};

function passThroughWrite(buffer) {
  return buffer.toString(this.encoding);
}

function utf16DetectIncompleteChar(buffer) {
  this.charReceived = buffer.length % 2;
  this.charLength = this.charReceived ? 2 : 0;
}

function base64DetectIncompleteChar(buffer) {
  this.charReceived = buffer.length % 3;
  this.charLength = this.charReceived ? 3 : 0;
}


/***/ }),
/* 443 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
var core_1 = __webpack_require__(0);
var router_1 = __webpack_require__(45);
var AddOnComponent = (function () {
    function AddOnComponent(route) {
        this.route = route;
        this.name$ = route
            .params
            .select('name');
    }
    return AddOnComponent;
}());
AddOnComponent = __decorate([
    core_1.Component({
        selector: 'add-on',
        template: __webpack_require__(670),
        styles: [__webpack_require__(722)],
        host: {
            'class': 'container-fluid'
        }
    }),
    __metadata("design:paramtypes", [router_1.ActivatedRoute])
], AddOnComponent);
exports.AddOnComponent = AddOnComponent;


/***/ }),
/* 444 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

function __export(m) {
    for (var p in m) if (!exports.hasOwnProperty(p)) exports[p] = m[p];
}
Object.defineProperty(exports, "__esModule", { value: true });
__export(__webpack_require__(443));
__export(__webpack_require__(1011));


/***/ }),
/* 445 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
var core_1 = __webpack_require__(0);
var store_1 = __webpack_require__(9);
var BehaviorSubject_1 = __webpack_require__(50);
__webpack_require__(411);
__webpack_require__(272);
var actions_1 = __webpack_require__(54);
var KeymapAddComponent = (function () {
    function KeymapAddComponent(store) {
        this.store = store;
        this.presetsAll$ = store.select(function (appState) { return appState.presetKeymaps; });
        this.filterExpression$ = new BehaviorSubject_1.BehaviorSubject('');
        this.presets$ = this.presetsAll$
            .combineLatest(this.filterExpression$, function (keymaps, filterExpression) {
            return keymaps.filter(function (keymap) { return keymap.name.toLocaleLowerCase().includes(filterExpression); });
        })
            .publishReplay(1)
            .refCount();
    }
    KeymapAddComponent.prototype.filterKeyboards = function (filterExpression) {
        this.filterExpression$.next(filterExpression);
    };
    KeymapAddComponent.prototype.addKeymap = function (keymap) {
        this.store.dispatch(actions_1.KeymapActions.addKeymap(keymap));
    };
    return KeymapAddComponent;
}());
KeymapAddComponent = __decorate([
    core_1.Component({
        selector: 'keymap-add',
        template: __webpack_require__(672),
        styles: [__webpack_require__(724)],
        host: {
            'class': 'container-fluid'
        }
    }),
    __metadata("design:paramtypes", [store_1.Store])
], KeymapAddComponent);
exports.KeymapAddComponent = KeymapAddComponent;


/***/ }),
/* 446 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var keymap_edit_component_1 = __webpack_require__(447);
exports.KeymapEditComponent = keymap_edit_component_1.KeymapEditComponent;
var keymap_edit_guard_service_1 = __webpack_require__(1014);
exports.KeymapEditGuard = keymap_edit_guard_service_1.KeymapEditGuard;


/***/ }),
/* 447 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
var core_1 = __webpack_require__(0);
var router_1 = __webpack_require__(45);
__webpack_require__(375);
var store_1 = __webpack_require__(9);
__webpack_require__(412);
__webpack_require__(123);
__webpack_require__(65);
__webpack_require__(272);
__webpack_require__(273);
var file_saver_1 = __webpack_require__(669);
var user_configuration_1 = __webpack_require__(55);
var KeymapEditComponent = (function () {
    function KeymapEditComponent(store, route) {
        this.store = store;
        this.route = route;
        this.keymap$ = route
            .params
            .select('abbr')
            .switchMap(function (abbr) { return store.let(user_configuration_1.getKeymap(abbr)); })
            .publishReplay(1)
            .refCount();
        this.deletable$ = store.let(user_configuration_1.getKeymaps())
            .map(function (keymaps) { return keymaps.length > 1; });
    }
    KeymapEditComponent.prototype.downloadKeymap = function () {
        var _this = this;
        var exportableJSON$ = this.keymap$
            .switchMap(function (keymap) { return _this.toExportableJSON(keymap); })
            .map(function (exportableJSON) { return JSON.stringify(exportableJSON); });
        this.keymap$
            .combineLatest(exportableJSON$)
            .first()
            .subscribe(function (latest) {
            var keymap = latest[0];
            var exportableJSON = latest[1];
            var fileName = keymap.name + '_keymap.json';
            file_saver_1.saveAs(new Blob([exportableJSON], { type: 'application/json' }), fileName);
        });
    };
    KeymapEditComponent.prototype.toExportableJSON = function (keymap) {
        return this.store
            .let(user_configuration_1.getUserConfiguration())
            .first()
            .map(function (userConfiguration) {
            return {
                site: 'https://ultimatehackingkeyboard.com',
                description: 'Ultimate Hacking Keyboard keymap',
                keyboardModel: 'UHK60',
                dataModelVersion: userConfiguration.dataModelVersion,
                objectType: 'keymap',
                objectValue: keymap.toJsonObject()
            };
        });
    };
    return KeymapEditComponent;
}());
KeymapEditComponent = __decorate([
    core_1.Component({
        selector: 'keymap-edit',
        template: __webpack_require__(673),
        styles: [__webpack_require__(725)],
        host: {
            'class': 'container-fluid'
        }
    }),
    __metadata("design:paramtypes", [store_1.Store,
        router_1.ActivatedRoute])
], KeymapEditComponent);
exports.KeymapEditComponent = KeymapEditComponent;


/***/ }),
/* 448 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
var core_1 = __webpack_require__(0);
var router_1 = __webpack_require__(45);
var store_1 = __webpack_require__(9);
var actions_1 = __webpack_require__(54);
var user_configuration_1 = __webpack_require__(55);
var MacroEditComponent = (function () {
    function MacroEditComponent(store, route) {
        var _this = this;
        this.store = store;
        this.route = route;
        this.subscription = route
            .params
            .select('id')
            .switchMap(function (id) { return store.let(user_configuration_1.getMacro(+id)); })
            .subscribe(function (macro) {
            _this.macro = macro;
        });
        this.isNew = this.route.snapshot.params['empty'] === 'new';
    }
    MacroEditComponent.prototype.ngOnDestroy = function () {
        this.subscription.unsubscribe();
    };
    MacroEditComponent.prototype.addAction = function (macroId, action) {
        this.store.dispatch(actions_1.MacroActions.addMacroAction(macroId, action));
    };
    MacroEditComponent.prototype.editAction = function (macroId, index, action) {
        this.store.dispatch(actions_1.MacroActions.saveMacroAction(macroId, index, action));
    };
    MacroEditComponent.prototype.deleteAction = function (macroId, index, action) {
        this.store.dispatch(actions_1.MacroActions.deleteMacroAction(macroId, index, action));
    };
    MacroEditComponent.prototype.reorderAction = function (macroId, oldIndex, newIndex) {
        this.store.dispatch(actions_1.MacroActions.reorderMacroAction(macroId, oldIndex, newIndex));
    };
    return MacroEditComponent;
}());
MacroEditComponent = __decorate([
    core_1.Component({
        selector: 'macro-edit',
        template: __webpack_require__(681),
        styles: [__webpack_require__(732)],
        host: {
            'class': 'container-fluid'
        }
    }),
    __metadata("design:paramtypes", [store_1.Store, router_1.ActivatedRoute])
], MacroEditComponent);
exports.MacroEditComponent = MacroEditComponent;


/***/ }),
/* 449 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

function __export(m) {
    for (var p in m) if (!exports.hasOwnProperty(p)) exports[p] = m[p];
}
Object.defineProperty(exports, "__esModule", { value: true });
__export(__webpack_require__(1039));


/***/ }),
/* 450 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

function __export(m) {
    for (var p in m) if (!exports.hasOwnProperty(p)) exports[p] = m[p];
}
Object.defineProperty(exports, "__esModule", { value: true });
__export(__webpack_require__(451));
__export(__webpack_require__(1056));


/***/ }),
/* 451 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
var core_1 = __webpack_require__(0);
var SettingsComponent = (function () {
    function SettingsComponent() {
    }
    return SettingsComponent;
}());
SettingsComponent = __decorate([
    core_1.Component({
        selector: 'settings',
        template: __webpack_require__(696),
        styles: [__webpack_require__(747)],
        host: {
            'class': 'container-fluid'
        }
    }),
    __metadata("design:paramtypes", [])
], SettingsComponent);
exports.SettingsComponent = SettingsComponent;


/***/ }),
/* 452 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

function __export(m) {
    for (var p in m) if (!exports.hasOwnProperty(p)) exports[p] = m[p];
}
Object.defineProperty(exports, "__esModule", { value: true });
__export(__webpack_require__(1088));
__export(__webpack_require__(1089));


/***/ }),
/* 453 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/* WEBPACK VAR INJECTION */(function(Buffer, process) {
Object.defineProperty(exports, "__esModule", { value: true });
var UhkBuffer = (function () {
    function UhkBuffer() {
        this._enableDump = false;
        this.offset = 0;
        this.bytesToBacktrack = 0;
        this.buffer = new Buffer(UhkBuffer.eepromSize);
        this.buffer.fill(0);
    }
    UhkBuffer.simpleElementWriter = function (buffer, element) {
        element.toBinary(buffer); // TODO: Remove any
    };
    UhkBuffer.prototype.readInt8 = function () {
        var value = this.buffer.readInt8(this.offset);
        this.dump("i8(" + value + ")");
        this.bytesToBacktrack = 1;
        this.offset += this.bytesToBacktrack;
        return value;
    };
    UhkBuffer.prototype.writeInt8 = function (value) {
        this.dump("i8(" + value + ")");
        this.buffer.writeInt8(value, this.offset);
        this.offset += 1;
    };
    UhkBuffer.prototype.readUInt8 = function () {
        var value = this.buffer.readUInt8(this.offset);
        this.dump("u8(" + value + ")");
        this.bytesToBacktrack = 1;
        this.offset += this.bytesToBacktrack;
        return value;
    };
    UhkBuffer.prototype.writeUInt8 = function (value) {
        this.dump("u8(" + value + ")");
        this.buffer.writeUInt8(value, this.offset);
        this.offset += 1;
    };
    UhkBuffer.prototype.readInt16 = function () {
        var value = this.buffer.readInt16LE(this.offset);
        this.dump("i16(" + value + ")");
        this.bytesToBacktrack = 2;
        this.offset += this.bytesToBacktrack;
        return value;
    };
    UhkBuffer.prototype.writeInt16 = function (value) {
        this.dump("i16(" + value + ")");
        this.buffer.writeInt16LE(value, this.offset);
        this.offset += 2;
    };
    UhkBuffer.prototype.readUInt16 = function () {
        var value = this.buffer.readUInt16LE(this.offset);
        this.dump("u16(" + value + ")");
        this.bytesToBacktrack = 2;
        this.offset += this.bytesToBacktrack;
        return value;
    };
    UhkBuffer.prototype.writeUInt16 = function (value) {
        this.dump("u16(" + value + ")");
        this.buffer.writeUInt16LE(value, this.offset);
        this.offset += 2;
    };
    UhkBuffer.prototype.readInt32 = function () {
        var value = this.buffer.readInt32LE(this.offset);
        this.dump("i32(" + value + ")");
        this.bytesToBacktrack = 4;
        this.offset += this.bytesToBacktrack;
        return value;
    };
    UhkBuffer.prototype.writeInt32 = function (value) {
        this.dump("i32(" + value + ")");
        this.buffer.writeInt32LE(value, this.offset);
        this.offset += 4;
    };
    UhkBuffer.prototype.readUInt32 = function () {
        var value = this.buffer.readUInt32LE(this.offset);
        this.dump("u32(" + value + ")");
        this.bytesToBacktrack = 4;
        this.offset += this.bytesToBacktrack;
        return value;
    };
    UhkBuffer.prototype.writeUInt32 = function (value) {
        this.dump("u32(" + value + ")");
        this.buffer.writeUInt32LE(value, this.offset);
        this.offset += 4;
    };
    UhkBuffer.prototype.readCompactLength = function () {
        var length = this.readUInt8();
        if (length === UhkBuffer.longCompactLengthPrefix) {
            length += this.readUInt8() << 8;
        }
        return length;
    };
    UhkBuffer.prototype.writeCompactLength = function (length) {
        if (length >= UhkBuffer.longCompactLengthPrefix) {
            this.writeUInt8(UhkBuffer.longCompactLengthPrefix);
            this.writeUInt16(length);
        }
        else {
            this.writeUInt8(length);
        }
    };
    UhkBuffer.prototype.readString = function () {
        var stringByteLength = this.readCompactLength();
        var str = this.buffer.toString(UhkBuffer.stringEncoding, this.offset, this.offset + stringByteLength);
        this.dump(UhkBuffer.stringEncoding + "(" + str + ")");
        this.bytesToBacktrack = stringByteLength;
        this.offset += stringByteLength;
        return str;
    };
    UhkBuffer.prototype.writeString = function (str) {
        var stringByteLength = Buffer.byteLength(str, UhkBuffer.stringEncoding);
        if (stringByteLength > UhkBuffer.maxCompactLength) {
            throw "Cannot serialize string: " + stringByteLength + " bytes is larger\n                   than the maximum allowed length of " + UhkBuffer.maxCompactLength + " bytes";
        }
        this.writeCompactLength(stringByteLength);
        this.dump(UhkBuffer.stringEncoding + "(" + str + ")");
        this.buffer.write(str, this.offset, stringByteLength, UhkBuffer.stringEncoding);
        this.offset += stringByteLength;
    };
    UhkBuffer.prototype.readBoolean = function () {
        return this.readUInt8() !== 0;
    };
    UhkBuffer.prototype.writeBoolean = function (bool) {
        this.writeUInt8(bool ? 1 : 0);
    };
    UhkBuffer.prototype.readArray = function (elementReader) {
        var array = [];
        var length = this.readCompactLength();
        for (var i = 0; i < length; ++i) {
            array.push(elementReader(this, i));
        }
        return array;
    };
    UhkBuffer.prototype.writeArray = function (array, elementWriter) {
        if (elementWriter === void 0) { elementWriter = UhkBuffer.simpleElementWriter; }
        var length = array.length;
        this.writeCompactLength(length);
        for (var i = 0; i < length; ++i) {
            elementWriter(this, array[i], i);
        }
    };
    UhkBuffer.prototype.backtrack = function () {
        this.offset -= this.bytesToBacktrack;
        this.bytesToBacktrack = 0;
    };
    UhkBuffer.prototype.getBufferContent = function () {
        return this.buffer.slice(0, this.offset);
    };
    Object.defineProperty(UhkBuffer.prototype, "enableDump", {
        get: function () {
            return this._enableDump;
        },
        set: function (value) {
            if (value) {
                UhkBuffer.isFirstElementToDump = true;
            }
            this._enableDump = value;
        },
        enumerable: true,
        configurable: true
    });
    UhkBuffer.prototype.dump = function (value) {
        if (!this.enableDump) {
            return;
        }
        if (!UhkBuffer.isFirstElementToDump) {
            process.stdout.write(', ');
        }
        process.stdout.write(value);
        if (UhkBuffer.isFirstElementToDump) {
            UhkBuffer.isFirstElementToDump = false;
        }
    };
    return UhkBuffer;
}());
UhkBuffer.eepromSize = 32 * 1024;
UhkBuffer.maxCompactLength = 0xFFFF;
UhkBuffer.longCompactLengthPrefix = 0xFF;
UhkBuffer.stringEncoding = 'utf8';
UhkBuffer.isFirstElementToDump = false;
exports.UhkBuffer = UhkBuffer;

/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(56).Buffer, __webpack_require__(32)))

/***/ }),
/* 454 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var Module_1 = __webpack_require__(456);
var Layer = (function () {
    function Layer(layers) {
        if (!layers) {
            return;
        }
        this.modules = layers.modules.map(function (module) { return new Module_1.Module(module); });
    }
    Layer.prototype.fromJsonObject = function (jsonObject, macros) {
        this.modules = jsonObject.modules.map(function (module) { return new Module_1.Module().fromJsonObject(module, macros); });
        return this;
    };
    Layer.prototype.fromBinary = function (buffer, macros) {
        this.modules = buffer.readArray(function (uhkBuffer) {
            return new Module_1.Module().fromBinary(uhkBuffer, macros);
        });
        return this;
    };
    Layer.prototype.toJsonObject = function (macros) {
        return {
            modules: this.modules.map(function (module) { return module.toJsonObject(macros); })
        };
    };
    Layer.prototype.toBinary = function (buffer, macros) {
        buffer.writeArray(this.modules, function (uhkBuffer, module) {
            module.toBinary(uhkBuffer, macros);
        });
    };
    Layer.prototype.toString = function () {
        return "<Layer>";
    };
    Layer.prototype.renameKeymap = function (oldAbbr, newAbbr) {
        var _this = this;
        var modules;
        var moduleModified = false;
        this.modules.forEach(function (module, index) {
            var newModule = module.renameKeymap(oldAbbr, newAbbr);
            if (newModule !== module) {
                if (!moduleModified) {
                    modules = _this.modules.slice();
                    moduleModified = true;
                }
                modules[index] = newModule;
            }
        });
        if (moduleModified) {
            var newLayer = Object.assign(new Layer(), this);
            newLayer.modules = modules;
            return newLayer;
        }
        return this;
    };
    return Layer;
}());
exports.Layer = Layer;


/***/ }),
/* 455 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var LongPressAction;
(function (LongPressAction) {
    LongPressAction[LongPressAction["leftCtrl"] = 0] = "leftCtrl";
    LongPressAction[LongPressAction["leftShift"] = 1] = "leftShift";
    LongPressAction[LongPressAction["leftAlt"] = 2] = "leftAlt";
    LongPressAction[LongPressAction["leftSuper"] = 3] = "leftSuper";
    LongPressAction[LongPressAction["rightCtrl"] = 4] = "rightCtrl";
    LongPressAction[LongPressAction["rightShift"] = 5] = "rightShift";
    LongPressAction[LongPressAction["rightAlt"] = 6] = "rightAlt";
    LongPressAction[LongPressAction["rightSuper"] = 7] = "rightSuper";
    LongPressAction[LongPressAction["mod"] = 8] = "mod";
    LongPressAction[LongPressAction["fn"] = 9] = "fn";
    LongPressAction[LongPressAction["mouse"] = 10] = "mouse";
})(LongPressAction = exports.LongPressAction || (exports.LongPressAction = {}));
;


/***/ }),
/* 456 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
var assert_1 = __webpack_require__(26);
var key_action_1 = __webpack_require__(22);
var key_action_2 = __webpack_require__(22);
var PointerRole;
(function (PointerRole) {
    PointerRole[PointerRole["none"] = 0] = "none";
    PointerRole[PointerRole["move"] = 1] = "move";
    PointerRole[PointerRole["scroll"] = 2] = "scroll";
})(PointerRole || (PointerRole = {}));
var Module = (function () {
    function Module(other) {
        if (!other) {
            return;
        }
        this.id = other.id;
        this.keyActions = other.keyActions.map(function (keyAction) { return key_action_1.Helper.createKeyAction(keyAction); });
        this.pointerRole = other.pointerRole;
    }
    Module.prototype.fromJsonObject = function (jsonObject, macros) {
        this.id = jsonObject.id;
        this.pointerRole = PointerRole[jsonObject.pointerRole];
        this.keyActions = jsonObject.keyActions.map(function (keyAction) {
            return key_action_1.Helper.createKeyAction(keyAction, macros);
        });
        return this;
    };
    Module.prototype.fromBinary = function (buffer, macros) {
        this.id = buffer.readUInt8();
        this.pointerRole = buffer.readUInt8();
        var keyActionsLength = buffer.readCompactLength();
        this.keyActions = [];
        for (var i = 0; i < keyActionsLength; ++i) {
            this.keyActions.push(key_action_1.Helper.createKeyAction(buffer, macros));
        }
        return this;
    };
    Module.prototype.toJsonObject = function (macros) {
        return {
            id: this.id,
            pointerRole: PointerRole[this.pointerRole],
            keyActions: this.keyActions.map(function (keyAction) {
                if (keyAction && (macros || !(keyAction instanceof key_action_2.PlayMacroAction || keyAction instanceof key_action_2.SwitchLayerAction))) {
                    return keyAction.toJsonObject(macros);
                }
            })
        };
    };
    Module.prototype.toBinary = function (buffer, macros) {
        buffer.writeUInt8(this.id);
        buffer.writeUInt8(this.pointerRole);
        var noneAction = new key_action_1.NoneAction();
        var keyActions = this.keyActions.map(function (keyAction) {
            if (keyAction) {
                return keyAction;
            }
            return noneAction;
        });
        buffer.writeArray(keyActions, function (uhkBuffer, keyAction) {
            keyAction.toBinary(uhkBuffer, macros);
        });
    };
    Module.prototype.toString = function () {
        return "<Module id=\"" + this.id + "\" pointerRole=\"" + this.pointerRole + "\">";
    };
    Module.prototype.renameKeymap = function (oldAbbr, newAbbr) {
        var _this = this;
        var keyActions;
        var keyActionModified = false;
        this.keyActions.forEach(function (keyAction, index) {
            if (!keyAction) {
                return;
            }
            var newKeyAction = keyAction.renameKeymap(oldAbbr, newAbbr);
            if (newKeyAction !== keyAction) {
                if (!keyActionModified) {
                    keyActions = _this.keyActions.slice();
                    keyActionModified = true;
                }
                keyActions[index] = newKeyAction;
            }
        });
        if (keyActionModified) {
            var newModule = Object.assign(new Module(), this);
            newModule.keyActions = keyActions;
            return newModule;
        }
        return this;
    };
    return Module;
}());
__decorate([
    assert_1.assertUInt8,
    __metadata("design:type", Number)
], Module.prototype, "id", void 0);
__decorate([
    assert_1.assertEnum(PointerRole),
    __metadata("design:type", Number)
], Module.prototype, "pointerRole", void 0);
exports.Module = Module;


/***/ }),
/* 457 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
var assert_1 = __webpack_require__(26);
var MacroAction_1 = __webpack_require__(68);
var DelayMacroAction = (function (_super) {
    __extends(DelayMacroAction, _super);
    function DelayMacroAction(other) {
        var _this = _super.call(this) || this;
        if (!other) {
            return _this;
        }
        _this.delay = other.delay;
        return _this;
    }
    DelayMacroAction.prototype.fromJsonObject = function (jsObject) {
        this.assertMacroActionType(jsObject);
        this.delay = jsObject.delay;
        return this;
    };
    DelayMacroAction.prototype.fromBinary = function (buffer) {
        this.readAndAssertMacroActionId(buffer);
        this.delay = buffer.readUInt16();
        return this;
    };
    DelayMacroAction.prototype.toJsonObject = function () {
        return {
            macroActionType: MacroAction_1.macroActionType.DelayMacroAction,
            delay: this.delay
        };
    };
    DelayMacroAction.prototype.toBinary = function (buffer) {
        buffer.writeUInt8(MacroAction_1.MacroActionId.DelayMacroAction);
        buffer.writeUInt16(this.delay);
    };
    DelayMacroAction.prototype.toString = function () {
        return "<DelayMacroAction delay=\"" + this.delay + "\">";
    };
    return DelayMacroAction;
}(MacroAction_1.MacroAction));
__decorate([
    assert_1.assertUInt16,
    __metadata("design:type", Number)
], DelayMacroAction.prototype, "delay", void 0);
exports.DelayMacroAction = DelayMacroAction;


/***/ }),
/* 458 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
var assert_1 = __webpack_require__(26);
var MacroAction_1 = __webpack_require__(68);
var NUM_OF_COMBINATIONS = 3; // Cases: scancode, modifer, both
var KeyMacroAction = (function (_super) {
    __extends(KeyMacroAction, _super);
    function KeyMacroAction(other) {
        var _this = _super.call(this) || this;
        if (!other) {
            return _this;
        }
        _this.action = other.action;
        _this.scancode = other.scancode;
        _this.modifierMask = other.modifierMask;
        return _this;
    }
    KeyMacroAction.prototype.fromJsonObject = function (jsObject) {
        this.assertMacroActionType(jsObject);
        this.action = MacroAction_1.MacroSubAction[jsObject.action];
        this.scancode = jsObject.scancode;
        this.modifierMask = jsObject.modifierMask;
        return this;
    };
    KeyMacroAction.prototype.fromBinary = function (buffer) {
        var macroActionId = this.readAndAssertMacroActionId(buffer);
        var keyMacroType = macroActionId - MacroAction_1.MacroActionId.KeyMacroAction;
        this.action = Math.floor(keyMacroType / NUM_OF_COMBINATIONS);
        keyMacroType %= NUM_OF_COMBINATIONS;
        if (keyMacroType % 2 === 0) {
            this.scancode = buffer.readUInt8();
        }
        if (keyMacroType !== 0) {
            this.modifierMask = buffer.readUInt8();
        }
        return this;
    };
    KeyMacroAction.prototype.toJsonObject = function () {
        var jsObject = {
            macroActionType: MacroAction_1.macroActionType.KeyMacroAction,
            action: MacroAction_1.MacroSubAction[this.action]
        };
        if (this.hasScancode()) {
            jsObject.scancode = this.scancode;
        }
        if (this.hasModifiers()) {
            jsObject.modifierMask = this.modifierMask;
        }
        return jsObject;
    };
    KeyMacroAction.prototype.toBinary = function (buffer) {
        var keyMacroType = MacroAction_1.MacroActionId.KeyMacroAction;
        keyMacroType += NUM_OF_COMBINATIONS * this.action;
        if (this.hasModifiers()) {
            ++keyMacroType;
            if (this.hasScancode()) {
                ++keyMacroType;
            }
        }
        buffer.writeUInt8(keyMacroType);
        if (this.hasScancode()) {
            buffer.writeUInt8(this.scancode);
        }
        if (this.hasModifiers()) {
            buffer.writeUInt8(this.modifierMask);
        }
    };
    KeyMacroAction.prototype.toString = function () {
        return "<KeyMacroAction action=\"" + this.action + "\" scancode=\"" + this.scancode + "\" modifierMask=\"" + this.modifierMask + "\">";
    };
    KeyMacroAction.prototype.isModifierActive = function (modifier) {
        return (this.modifierMask & modifier) > 0;
    };
    KeyMacroAction.prototype.hasScancode = function () {
        return !!this.scancode;
    };
    KeyMacroAction.prototype.hasModifiers = function () {
        return !!this.modifierMask;
    };
    KeyMacroAction.prototype.isHoldAction = function () {
        return this.action === MacroAction_1.MacroSubAction.hold;
    };
    KeyMacroAction.prototype.isPressAction = function () {
        return this.action === MacroAction_1.MacroSubAction.press;
    };
    KeyMacroAction.prototype.isReleaseAction = function () {
        return this.action === MacroAction_1.MacroSubAction.release;
    };
    return KeyMacroAction;
}(MacroAction_1.MacroAction));
__decorate([
    assert_1.assertEnum(MacroAction_1.MacroSubAction),
    __metadata("design:type", Number)
], KeyMacroAction.prototype, "action", void 0);
__decorate([
    assert_1.assertUInt8,
    __metadata("design:type", Number)
], KeyMacroAction.prototype, "scancode", void 0);
__decorate([
    assert_1.assertUInt8,
    __metadata("design:type", Number)
], KeyMacroAction.prototype, "modifierMask", void 0);
exports.KeyMacroAction = KeyMacroAction;


/***/ }),
/* 459 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
var assert_1 = __webpack_require__(26);
var MacroAction_1 = __webpack_require__(68);
var MouseButtons;
(function (MouseButtons) {
    MouseButtons[MouseButtons["Left"] = 1] = "Left";
    MouseButtons[MouseButtons["Middle"] = 2] = "Middle";
    MouseButtons[MouseButtons["Right"] = 4] = "Right";
})(MouseButtons = exports.MouseButtons || (exports.MouseButtons = {}));
;
var MouseButtonMacroAction = (function (_super) {
    __extends(MouseButtonMacroAction, _super);
    function MouseButtonMacroAction(other) {
        var _this = _super.call(this) || this;
        if (!other) {
            return _this;
        }
        _this.action = other.action;
        _this.mouseButtonsMask = other.mouseButtonsMask;
        return _this;
    }
    MouseButtonMacroAction.prototype.fromJsonObject = function (jsObject) {
        this.assertMacroActionType(jsObject);
        this.action = MacroAction_1.MacroSubAction[jsObject.action];
        this.mouseButtonsMask = jsObject.mouseButtonsMask;
        return this;
    };
    MouseButtonMacroAction.prototype.fromBinary = function (buffer) {
        var macroActionId = this.readAndAssertMacroActionId(buffer);
        this.action = macroActionId - MacroAction_1.MacroActionId.MouseButtonMacroAction;
        this.mouseButtonsMask = buffer.readUInt8();
        return this;
    };
    MouseButtonMacroAction.prototype.toJsonObject = function () {
        return {
            macroActionType: MacroAction_1.macroActionType.MouseButtonMacroAction,
            action: MacroAction_1.MacroSubAction[this.action],
            mouseButtonsMask: this.mouseButtonsMask
        };
    };
    MouseButtonMacroAction.prototype.toBinary = function (buffer) {
        buffer.writeUInt8(MacroAction_1.MacroActionId.MouseButtonMacroAction + this.action);
        buffer.writeUInt8(this.mouseButtonsMask);
    };
    MouseButtonMacroAction.prototype.setMouseButtons = function (buttonStates) {
        var bitmask = 0;
        for (var i = 0; i < buttonStates.length; i++) {
            bitmask |= Number(buttonStates[i]) << i;
        }
        this.mouseButtonsMask = bitmask;
    };
    MouseButtonMacroAction.prototype.getMouseButtons = function () {
        var enabledMouseButtons = [];
        for (var bitmask = this.mouseButtonsMask; bitmask; bitmask >>>= 1) {
            enabledMouseButtons.push(Boolean(bitmask & 1));
        }
        return enabledMouseButtons;
    };
    MouseButtonMacroAction.prototype.toString = function () {
        return "<MouseButtonMacroAction mouseButtonsMask=\"" + this.mouseButtonsMask + "\">";
    };
    MouseButtonMacroAction.prototype.hasButtons = function () {
        return this.mouseButtonsMask !== 0;
    };
    MouseButtonMacroAction.prototype.isOnlyHoldAction = function () {
        return this.action === MacroAction_1.MacroSubAction.hold;
    };
    MouseButtonMacroAction.prototype.isOnlyPressAction = function () {
        return this.action === MacroAction_1.MacroSubAction.press;
    };
    MouseButtonMacroAction.prototype.isOnlyReleaseAction = function () {
        return this.action === MacroAction_1.MacroSubAction.release;
    };
    return MouseButtonMacroAction;
}(MacroAction_1.MacroAction));
__decorate([
    assert_1.assertEnum(MacroAction_1.MacroSubAction),
    __metadata("design:type", Number)
], MouseButtonMacroAction.prototype, "action", void 0);
__decorate([
    assert_1.assertUInt8,
    __metadata("design:type", Number)
], MouseButtonMacroAction.prototype, "mouseButtonsMask", void 0);
exports.MouseButtonMacroAction = MouseButtonMacroAction;


/***/ }),
/* 460 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
var assert_1 = __webpack_require__(26);
var MacroAction_1 = __webpack_require__(68);
var MoveMouseMacroAction = (function (_super) {
    __extends(MoveMouseMacroAction, _super);
    function MoveMouseMacroAction(other) {
        var _this = _super.call(this) || this;
        if (!other) {
            return _this;
        }
        _this.x = other.x;
        _this.y = other.y;
        return _this;
    }
    MoveMouseMacroAction.prototype.fromJsonObject = function (jsObject) {
        this.assertMacroActionType(jsObject);
        this.x = jsObject.x;
        this.y = jsObject.y;
        return this;
    };
    MoveMouseMacroAction.prototype.fromBinary = function (buffer) {
        this.readAndAssertMacroActionId(buffer);
        this.x = buffer.readInt16();
        this.y = buffer.readInt16();
        return this;
    };
    MoveMouseMacroAction.prototype.toJsonObject = function () {
        return {
            macroActionType: MacroAction_1.macroActionType.MoveMouseMacroAction,
            x: this.x,
            y: this.y
        };
    };
    MoveMouseMacroAction.prototype.toBinary = function (buffer) {
        buffer.writeUInt8(MacroAction_1.MacroActionId.MoveMouseMacroAction);
        buffer.writeInt16(this.x);
        buffer.writeInt16(this.y);
    };
    MoveMouseMacroAction.prototype.toString = function () {
        return "<MoveMouseMacroAction pos=\"(" + this.x + "," + this.y + ")\">";
    };
    return MoveMouseMacroAction;
}(MacroAction_1.MacroAction));
__decorate([
    assert_1.assertInt16,
    __metadata("design:type", Number)
], MoveMouseMacroAction.prototype, "x", void 0);
__decorate([
    assert_1.assertInt16,
    __metadata("design:type", Number)
], MoveMouseMacroAction.prototype, "y", void 0);
exports.MoveMouseMacroAction = MoveMouseMacroAction;


/***/ }),
/* 461 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
var assert_1 = __webpack_require__(26);
var MacroAction_1 = __webpack_require__(68);
var ScrollMouseMacroAction = (function (_super) {
    __extends(ScrollMouseMacroAction, _super);
    function ScrollMouseMacroAction(other) {
        var _this = _super.call(this) || this;
        if (!other) {
            return _this;
        }
        _this.x = other.x;
        _this.y = other.y;
        return _this;
    }
    ScrollMouseMacroAction.prototype.fromJsonObject = function (jsObject) {
        this.assertMacroActionType(jsObject);
        this.x = jsObject.x;
        this.y = jsObject.y;
        return this;
    };
    ScrollMouseMacroAction.prototype.fromBinary = function (buffer) {
        this.readAndAssertMacroActionId(buffer);
        this.x = buffer.readInt16();
        this.y = buffer.readInt16();
        return this;
    };
    ScrollMouseMacroAction.prototype.toJsonObject = function () {
        return {
            macroActionType: MacroAction_1.macroActionType.ScrollMouseMacroAction,
            x: this.x,
            y: this.y
        };
    };
    ScrollMouseMacroAction.prototype.toBinary = function (buffer) {
        buffer.writeUInt8(MacroAction_1.MacroActionId.ScrollMouseMacroAction);
        buffer.writeInt16(this.x);
        buffer.writeInt16(this.y);
    };
    ScrollMouseMacroAction.prototype.toString = function () {
        return "<ScrollMouseMacroAction pos=\"(" + this.x + "," + this.y + ")\">";
    };
    return ScrollMouseMacroAction;
}(MacroAction_1.MacroAction));
__decorate([
    assert_1.assertInt16,
    __metadata("design:type", Number)
], ScrollMouseMacroAction.prototype, "x", void 0);
__decorate([
    assert_1.assertInt16,
    __metadata("design:type", Number)
], ScrollMouseMacroAction.prototype, "y", void 0);
exports.ScrollMouseMacroAction = ScrollMouseMacroAction;


/***/ }),
/* 462 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
var MacroAction_1 = __webpack_require__(68);
var TextMacroAction = (function (_super) {
    __extends(TextMacroAction, _super);
    function TextMacroAction(other) {
        var _this = _super.call(this) || this;
        if (!other) {
            return _this;
        }
        _this.text = other.text;
        return _this;
    }
    TextMacroAction.prototype.fromJsonObject = function (jsObject) {
        this.assertMacroActionType(jsObject);
        this.text = jsObject.text;
        return this;
    };
    TextMacroAction.prototype.fromBinary = function (buffer) {
        this.readAndAssertMacroActionId(buffer);
        this.text = buffer.readString();
        return this;
    };
    TextMacroAction.prototype.toJsonObject = function () {
        return {
            macroActionType: MacroAction_1.macroActionType.TextMacroAction,
            text: this.text
        };
    };
    TextMacroAction.prototype.toBinary = function (buffer) {
        buffer.writeUInt8(MacroAction_1.MacroActionId.TextMacroAction);
        buffer.writeString(this.text);
    };
    TextMacroAction.prototype.toString = function () {
        return "<TextMacroAction text=\"" + this.text + "\">";
    };
    return TextMacroAction;
}(MacroAction_1.MacroAction));
exports.TextMacroAction = TextMacroAction;


/***/ }),
/* 463 */,
/* 464 */
/***/ (function(module, exports, __webpack_require__) {

/* WEBPACK VAR INJECTION */(function(process) {var WritableStream = __webpack_require__(191).Writable
var inherits = __webpack_require__(1124).inherits

module.exports = BrowserStdout


inherits(BrowserStdout, WritableStream)

function BrowserStdout(opts) {
  if (!(this instanceof BrowserStdout)) return new BrowserStdout(opts)

  opts = opts || {}
  WritableStream.call(this, opts)
  this.label = (opts.label !== undefined) ? opts.label : 'stdout'
}

BrowserStdout.prototype._write = function(chunks, encoding, cb) {
  var output = chunks.toString ? chunks.toString() : chunks
  if (this.label === false) {
    console.log(output)
  } else {
    console.log(this.label+':', output)
  }
  process.nextTick(cb)
}

/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(32)))

/***/ }),
/* 465 */,
/* 466 */,
/* 467 */,
/* 468 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
var core_1 = __webpack_require__(0);
var forms_1 = __webpack_require__(352);
var platform_browser_1 = __webpack_require__(162);
var effects_1 = __webpack_require__(165);
var store_1 = __webpack_require__(9);
var store_devtools_1 = __webpack_require__(247);
var store_log_monitor_1 = __webpack_require__(589);
var ng2_dragula_1 = __webpack_require__(404);
var ng2_select2_1 = __webpack_require__(406);
var add_on_1 = __webpack_require__(444);
var slider_1 = __webpack_require__(1012);
var keymap_1 = __webpack_require__(1016);
var layers_1 = __webpack_require__(1017);
var macro_1 = __webpack_require__(288);
var notification_1 = __webpack_require__(1037);
var popover_1 = __webpack_require__(449);
var tab_1 = __webpack_require__(193);
var capture_keystroke_1 = __webpack_require__(1053);
var icon_1 = __webpack_require__(1055);
var settings_1 = __webpack_require__(450);
var side_menu_1 = __webpack_require__(1057);
var keyboard_1 = __webpack_require__(1059);
var keys_1 = __webpack_require__(1061);
var module_1 = __webpack_require__(452);
var wrap_1 = __webpack_require__(1090);
var main_app_1 = __webpack_require__(1118);
var directives_1 = __webpack_require__(1104);
var capture_service_1 = __webpack_require__(292);
var mapper_service_1 = __webpack_require__(31);
var effects_2 = __webpack_require__(1107);
var reducers_1 = __webpack_require__(1110);
var storage_1 = __webpack_require__(1113);
var edit_1 = __webpack_require__(446);
var not_found_1 = __webpack_require__(289);
// Create DataStorage dependency injection
var storageProvider = core_1.ReflectiveInjector.resolve([storage_1.DataStorage]);
var storageInjector = core_1.ReflectiveInjector.fromResolvedProviders(storageProvider);
var storageService = storageInjector.get(storage_1.DataStorage);
// All reducers that are used in application
var storeConfig = {
    userConfiguration: storageService.saveState(reducers_1.userConfigurationReducer),
    presetKeymaps: reducers_1.presetReducer
};
var AppModule = (function () {
    function AppModule() {
    }
    return AppModule;
}());
AppModule = __decorate([
    core_1.NgModule({
        declarations: [
            main_app_1.MainAppComponent,
            keymap_1.KeymapEditComponent,
            keymap_1.KeymapHeaderComponent,
            notification_1.NotificationComponent,
            keys_1.SvgIconTextKeyComponent,
            keys_1.SvgKeyboardKeyComponent,
            keys_1.SvgKeystrokeKeyComponent,
            keys_1.SvgMouseKeyComponent,
            keys_1.SvgMouseClickKeyComponent,
            keys_1.SvgMouseMoveKeyComponent,
            keys_1.SvgMouseScrollKeyComponent,
            keys_1.SvgMouseSpeedKeyComponent,
            keys_1.SvgOneLineTextKeyComponent,
            keys_1.SvgSingleIconKeyComponent,
            keys_1.SvgSwitchKeymapKeyComponent,
            keys_1.SvgTextIconKeyComponent,
            keys_1.SvgTwoLineTextKeyComponent,
            keys_1.SvgKeyboardKeyComponent,
            wrap_1.SvgKeyboardWrapComponent,
            keyboard_1.SvgKeyboardComponent,
            module_1.SvgModuleComponent,
            layers_1.LayersComponent,
            popover_1.PopoverComponent,
            keymap_1.KeymapAddComponent,
            side_menu_1.SideMenuComponent,
            tab_1.KeypressTabComponent,
            tab_1.KeymapTabComponent,
            tab_1.LayerTabComponent,
            tab_1.MacroTabComponent,
            tab_1.MouseTabComponent,
            tab_1.NoneTabComponent,
            capture_keystroke_1.CaptureKeystrokeButtonComponent,
            icon_1.IconComponent,
            macro_1.MacroEditComponent,
            macro_1.MacroListComponent,
            macro_1.MacroHeaderComponent,
            macro_1.MacroItemComponent,
            macro_1.MacroActionEditorComponent,
            macro_1.MacroDelayTabComponent,
            macro_1.MacroKeyTabComponent,
            macro_1.MacroMouseTabComponent,
            macro_1.MacroTextTabComponent,
            macro_1.MacroNotFoundComponent,
            add_on_1.AddOnComponent,
            settings_1.SettingsComponent,
            slider_1.KeyboardSliderComponent,
            directives_1.CancelableDirective
        ],
        imports: [
            platform_browser_1.BrowserModule,
            forms_1.FormsModule,
            ng2_dragula_1.DragulaModule,
            main_app_1.routing,
            store_1.StoreModule.provideStore(storeConfig, storageService.initialState()),
            store_devtools_1.StoreDevtoolsModule.instrumentStore({
                monitor: store_log_monitor_1.useLogMonitor({
                    visible: false,
                    position: 'right'
                })
            }),
            store_log_monitor_1.StoreLogMonitorModule,
            ng2_select2_1.Select2Module,
            effects_1.EffectsModule.runAfterBootstrap(effects_2.KeymapEffects),
            effects_1.EffectsModule.runAfterBootstrap(effects_2.MacroEffects)
        ],
        providers: [
            mapper_service_1.MapperService,
            main_app_1.appRoutingProviders,
            edit_1.KeymapEditGuard,
            not_found_1.MacroNotFoundGuard,
            capture_service_1.CaptureService
        ],
        bootstrap: [main_app_1.MainAppComponent]
    })
], AppModule);
exports.AppModule = AppModule;


/***/ }),
/* 469 */,
/* 470 */,
/* 471 */,
/* 472 */,
/* 473 */,
/* 474 */,
/* 475 */,
/* 476 */,
/* 477 */,
/* 478 */,
/* 479 */,
/* 480 */,
/* 481 */,
/* 482 */,
/* 483 */,
/* 484 */,
/* 485 */,
/* 486 */,
/* 487 */,
/* 488 */,
/* 489 */,
/* 490 */,
/* 491 */,
/* 492 */,
/* 493 */,
/* 494 */,
/* 495 */,
/* 496 */,
/* 497 */,
/* 498 */,
/* 499 */,
/* 500 */,
/* 501 */,
/* 502 */,
/* 503 */,
/* 504 */,
/* 505 */,
/* 506 */,
/* 507 */,
/* 508 */,
/* 509 */,
/* 510 */,
/* 511 */,
/* 512 */,
/* 513 */,
/* 514 */,
/* 515 */,
/* 516 */,
/* 517 */,
/* 518 */,
/* 519 */,
/* 520 */,
/* 521 */,
/* 522 */,
/* 523 */,
/* 524 */,
/* 525 */,
/* 526 */,
/* 527 */,
/* 528 */,
/* 529 */,
/* 530 */,
/* 531 */,
/* 532 */,
/* 533 */,
/* 534 */,
/* 535 */,
/* 536 */,
/* 537 */,
/* 538 */,
/* 539 */,
/* 540 */,
/* 541 */,
/* 542 */,
/* 543 */,
/* 544 */,
/* 545 */,
/* 546 */,
/* 547 */,
/* 548 */,
/* 549 */,
/* 550 */,
/* 551 */,
/* 552 */,
/* 553 */,
/* 554 */,
/* 555 */,
/* 556 */,
/* 557 */,
/* 558 */,
/* 559 */,
/* 560 */,
/* 561 */,
/* 562 */,
/* 563 */,
/* 564 */,
/* 565 */,
/* 566 */,
/* 567 */,
/* 568 */,
/* 569 */,
/* 570 */,
/* 571 */,
/* 572 */,
/* 573 */,
/* 574 */,
/* 575 */,
/* 576 */,
/* 577 */,
/* 578 */,
/* 579 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

exports.compose = function () {
    var functions = [];
    for (var _i = 0; _i < arguments.length; _i++) {
        functions[_i - 0] = arguments[_i];
    }
    return function (arg) {
        if (functions.length === 0) {
            return arg;
        }
        var last = functions[functions.length - 1];
        var rest = functions.slice(0, -1);
        return rest.reduceRight(function (composed, fn) { return fn(composed); }, last(arg));
    };
};


/***/ }),
/* 580 */,
/* 581 */,
/* 582 */,
/* 583 */,
/* 584 */,
/* 585 */,
/* 586 */,
/* 587 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__ngrx_store__ = __webpack_require__(9);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__devtools__ = __webpack_require__(381);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__config__ = __webpack_require__(380);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4__extension__ = __webpack_require__(382);
/* unused harmony export _createReduxDevtoolsExtension */
/* unused harmony export _createState */
/* unused harmony export _createReducer */
/* unused harmony export _createStateIfExtension */
/* unused harmony export _createReducerIfExtension */
/* unused harmony export noMonitor */
/* unused harmony export _createOptions */
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return StoreDevtoolsModule; });





function _createReduxDevtoolsExtension() {
    var legacyExtensionKey = 'devToolsExtension';
    var extensionKey = '__REDUX_DEVTOOLS_EXTENSION__';
    if (typeof window === 'object' && typeof window[legacyExtensionKey] !== 'undefined') {
        return window[legacyExtensionKey];
    }
    else if (typeof window === 'object' && typeof window[extensionKey] !== 'undefined') {
        return window[extensionKey];
    }
    else {
        return null;
    }
}
function _createState(devtools) {
    return devtools.state;
}
function _createReducer(dispatcher, reducer) {
    return new __WEBPACK_IMPORTED_MODULE_1__ngrx_store__["Reducer"](dispatcher, reducer);
}
function _createStateIfExtension(extension, injector) {
    if (!!extension) {
        var devtools = injector.get(__WEBPACK_IMPORTED_MODULE_2__devtools__["a" /* StoreDevtools */]);
        return _createState(devtools);
    }
    else {
        var initialState = injector.get(__WEBPACK_IMPORTED_MODULE_1__ngrx_store__["INITIAL_STATE"]);
        var dispatcher = injector.get(__WEBPACK_IMPORTED_MODULE_1__ngrx_store__["Dispatcher"]);
        var reducer = injector.get(__WEBPACK_IMPORTED_MODULE_1__ngrx_store__["Reducer"]);
        return new __WEBPACK_IMPORTED_MODULE_1__ngrx_store__["State"](initialState, dispatcher, reducer);
    }
}
function _createReducerIfExtension(extension, injector) {
    if (!!extension) {
        var devtoolsDispatcher = injector.get(__WEBPACK_IMPORTED_MODULE_2__devtools__["b" /* DevtoolsDispatcher */]);
        var reducer = injector.get(__WEBPACK_IMPORTED_MODULE_1__ngrx_store__["INITIAL_REDUCER"]);
        return _createReducer(devtoolsDispatcher, reducer);
    }
    else {
        var dispatcher = injector.get(__WEBPACK_IMPORTED_MODULE_1__ngrx_store__["Dispatcher"]);
        var reducer = injector.get(__WEBPACK_IMPORTED_MODULE_1__ngrx_store__["INITIAL_REDUCER"]);
        return new __WEBPACK_IMPORTED_MODULE_1__ngrx_store__["Reducer"](dispatcher, reducer);
    }
}
function noMonitor() {
    return null;
}
function _createOptions(_options) {
    var DEFAULT_OPTIONS = { monitor: noMonitor };
    var options = typeof _options === 'function' ? _options() : _options;
    options = Object.assign({}, DEFAULT_OPTIONS, options);
    if (options.maxAge && options.maxAge < 2) {
        throw new Error("Devtools 'maxAge' cannot be less than 2, got " + options.maxAge);
    }
    return options;
}
var StoreDevtoolsModule = (function () {
    function StoreDevtoolsModule() {
    }
    StoreDevtoolsModule.instrumentStore = function (_options) {
        if (_options === void 0) { _options = {}; }
        return {
            ngModule: StoreDevtoolsModule,
            providers: [
                {
                    provide: __WEBPACK_IMPORTED_MODULE_1__ngrx_store__["State"],
                    deps: [__WEBPACK_IMPORTED_MODULE_2__devtools__["a" /* StoreDevtools */]],
                    useFactory: _createState
                },
                {
                    provide: __WEBPACK_IMPORTED_MODULE_3__config__["b" /* INITIAL_OPTIONS */],
                    useValue: _options
                },
                {
                    provide: __WEBPACK_IMPORTED_MODULE_1__ngrx_store__["Reducer"],
                    deps: [__WEBPACK_IMPORTED_MODULE_2__devtools__["b" /* DevtoolsDispatcher */], __WEBPACK_IMPORTED_MODULE_1__ngrx_store__["INITIAL_REDUCER"]],
                    useFactory: _createReducer
                },
                {
                    provide: __WEBPACK_IMPORTED_MODULE_3__config__["a" /* STORE_DEVTOOLS_CONFIG */],
                    deps: [__WEBPACK_IMPORTED_MODULE_3__config__["b" /* INITIAL_OPTIONS */]],
                    useFactory: _createOptions
                }
            ]
        };
    };
    StoreDevtoolsModule.instrumentOnlyWithExtension = function (_options) {
        if (_options === void 0) { _options = {}; }
        return {
            ngModule: StoreDevtoolsModule,
            providers: [
                {
                    provide: __WEBPACK_IMPORTED_MODULE_1__ngrx_store__["State"],
                    deps: [__WEBPACK_IMPORTED_MODULE_4__extension__["b" /* REDUX_DEVTOOLS_EXTENSION */], __WEBPACK_IMPORTED_MODULE_0__angular_core__["Injector"]],
                    useFactory: _createStateIfExtension
                },
                {
                    provide: __WEBPACK_IMPORTED_MODULE_1__ngrx_store__["Reducer"],
                    deps: [__WEBPACK_IMPORTED_MODULE_4__extension__["b" /* REDUX_DEVTOOLS_EXTENSION */], __WEBPACK_IMPORTED_MODULE_0__angular_core__["Injector"]],
                    useFactory: _createReducerIfExtension
                },
                {
                    provide: __WEBPACK_IMPORTED_MODULE_3__config__["b" /* INITIAL_OPTIONS */],
                    useValue: _options
                },
                {
                    provide: __WEBPACK_IMPORTED_MODULE_3__config__["a" /* STORE_DEVTOOLS_CONFIG */],
                    deps: [__WEBPACK_IMPORTED_MODULE_3__config__["b" /* INITIAL_OPTIONS */]],
                    useFactory: _createOptions
                }
            ]
        };
    };
    StoreDevtoolsModule.decorators = [
        { type: __WEBPACK_IMPORTED_MODULE_0__angular_core__["NgModule"], args: [{
                    imports: [
                        __WEBPACK_IMPORTED_MODULE_1__ngrx_store__["StoreModule"]
                    ],
                    providers: [
                        __WEBPACK_IMPORTED_MODULE_4__extension__["a" /* DevtoolsExtension */],
                        __WEBPACK_IMPORTED_MODULE_2__devtools__["b" /* DevtoolsDispatcher */],
                        __WEBPACK_IMPORTED_MODULE_2__devtools__["a" /* StoreDevtools */],
                        {
                            provide: __WEBPACK_IMPORTED_MODULE_4__extension__["b" /* REDUX_DEVTOOLS_EXTENSION */],
                            useFactory: _createReduxDevtoolsExtension
                        }
                    ]
                },] },
    ];
    /** @nocollapse */
    StoreDevtoolsModule.ctorParameters = [];
    return StoreDevtoolsModule;
}());
//# sourceMappingURL=instrument.js.map

/***/ }),
/* 588 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__ngrx_store__ = __webpack_require__(9);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__utils__ = __webpack_require__(249);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__actions__ = __webpack_require__(248);
/* unused harmony export INIT_ACTION */
/* harmony export (immutable) */ __webpack_exports__["a"] = liftInitialState;
/* harmony export (immutable) */ __webpack_exports__["b"] = liftReducerWith;



var INIT_ACTION = { type: __WEBPACK_IMPORTED_MODULE_0__ngrx_store__["Dispatcher"].INIT };
/**
* Computes the next entry in the log by applying an action.
*/
function computeNextEntry(reducer, action, state, error) {
    if (error) {
        return {
            state: state,
            error: 'Interrupted by an error up the chain'
        };
    }
    var nextState = state;
    var nextError;
    try {
        nextState = reducer(state, action);
    }
    catch (err) {
        nextError = err.toString();
        console.error(err.stack || err);
    }
    return {
        state: nextState,
        error: nextError
    };
}
/**
* Runs the reducer on invalidated actions to get a fresh computation log.
*/
function recomputeStates(computedStates, minInvalidatedStateIndex, reducer, committedState, actionsById, stagedActionIds, skippedActionIds) {
    // Optimization: exit early and return the same reference
    // if we know nothing could have changed.
    if (minInvalidatedStateIndex >= computedStates.length &&
        computedStates.length === stagedActionIds.length) {
        return computedStates;
    }
    var nextComputedStates = computedStates.slice(0, minInvalidatedStateIndex);
    for (var i = minInvalidatedStateIndex; i < stagedActionIds.length; i++) {
        var actionId = stagedActionIds[i];
        var action = actionsById[actionId].action;
        var previousEntry = nextComputedStates[i - 1];
        var previousState = previousEntry ? previousEntry.state : committedState;
        var previousError = previousEntry ? previousEntry.error : undefined;
        var shouldSkip = skippedActionIds.indexOf(actionId) > -1;
        var entry = shouldSkip ?
            previousEntry :
            computeNextEntry(reducer, action, previousState, previousError);
        nextComputedStates.push(entry);
    }
    return nextComputedStates;
}
function liftInitialState(initialCommittedState, monitorReducer) {
    return {
        monitorState: monitorReducer(undefined, {}),
        nextActionId: 1,
        actionsById: { 0: __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_1__utils__["b" /* liftAction */])(INIT_ACTION) },
        stagedActionIds: [0],
        skippedActionIds: [],
        committedState: initialCommittedState,
        currentStateIndex: 0,
        computedStates: []
    };
}
/**
* Creates a history state reducer from an app's reducer.
*/
function liftReducerWith(initialCommittedState, initialLiftedState, monitorReducer, options) {
    if (options === void 0) { options = {}; }
    /**
    * Manages how the history actions modify the history state.
    */
    return function (reducer) { return function (liftedState, liftedAction) {
        var _a = liftedState || initialLiftedState, monitorState = _a.monitorState, actionsById = _a.actionsById, nextActionId = _a.nextActionId, stagedActionIds = _a.stagedActionIds, skippedActionIds = _a.skippedActionIds, committedState = _a.committedState, currentStateIndex = _a.currentStateIndex, computedStates = _a.computedStates;
        if (!liftedState) {
            // Prevent mutating initialLiftedState
            actionsById = Object.create(actionsById);
        }
        function commitExcessActions(n) {
            // Auto-commits n-number of excess actions.
            var excess = n;
            var idsToDelete = stagedActionIds.slice(1, excess + 1);
            for (var i = 0; i < idsToDelete.length; i++) {
                if (computedStates[i + 1].error) {
                    // Stop if error is found. Commit actions up to error.
                    excess = i;
                    idsToDelete = stagedActionIds.slice(1, excess + 1);
                    break;
                }
                else {
                    delete actionsById[idsToDelete[i]];
                }
            }
            skippedActionIds = skippedActionIds.filter(function (id) { return idsToDelete.indexOf(id) === -1; });
            stagedActionIds = [0].concat(stagedActionIds.slice(excess + 1));
            committedState = computedStates[excess].state;
            computedStates = computedStates.slice(excess);
            currentStateIndex = currentStateIndex > excess
                ? currentStateIndex - excess
                : 0;
        }
        // By default, agressively recompute every state whatever happens.
        // This has O(n) performance, so we'll override this to a sensible
        // value whenever we feel like we don't have to recompute the states.
        var minInvalidatedStateIndex = 0;
        switch (liftedAction.type) {
            case __WEBPACK_IMPORTED_MODULE_2__actions__["b" /* ActionTypes */].RESET: {
                // Get back to the state the store was created with.
                actionsById = { 0: __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_1__utils__["b" /* liftAction */])(INIT_ACTION) };
                nextActionId = 1;
                stagedActionIds = [0];
                skippedActionIds = [];
                committedState = initialCommittedState;
                currentStateIndex = 0;
                computedStates = [];
                break;
            }
            case __WEBPACK_IMPORTED_MODULE_2__actions__["b" /* ActionTypes */].COMMIT: {
                // Consider the last committed state the new starting point.
                // Squash any staged actions into a single committed state.
                actionsById = { 0: __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_1__utils__["b" /* liftAction */])(INIT_ACTION) };
                nextActionId = 1;
                stagedActionIds = [0];
                skippedActionIds = [];
                committedState = computedStates[currentStateIndex].state;
                currentStateIndex = 0;
                computedStates = [];
                break;
            }
            case __WEBPACK_IMPORTED_MODULE_2__actions__["b" /* ActionTypes */].ROLLBACK: {
                // Forget about any staged actions.
                // Start again from the last committed state.
                actionsById = { 0: __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_1__utils__["b" /* liftAction */])(INIT_ACTION) };
                nextActionId = 1;
                stagedActionIds = [0];
                skippedActionIds = [];
                currentStateIndex = 0;
                computedStates = [];
                break;
            }
            case __WEBPACK_IMPORTED_MODULE_2__actions__["b" /* ActionTypes */].TOGGLE_ACTION: {
                // Toggle whether an action with given ID is skipped.
                // Being skipped means it is a no-op during the computation.
                var actionId_1 = liftedAction.id;
                var index = skippedActionIds.indexOf(actionId_1);
                if (index === -1) {
                    skippedActionIds = [actionId_1].concat(skippedActionIds);
                }
                else {
                    skippedActionIds = skippedActionIds.filter(function (id) { return id !== actionId_1; });
                }
                // Optimization: we know history before this action hasn't changed
                minInvalidatedStateIndex = stagedActionIds.indexOf(actionId_1);
                break;
            }
            case __WEBPACK_IMPORTED_MODULE_2__actions__["b" /* ActionTypes */].SET_ACTIONS_ACTIVE: {
                // Toggle whether an action with given ID is skipped.
                // Being skipped means it is a no-op during the computation.
                var start = liftedAction.start, end = liftedAction.end, active = liftedAction.active;
                var actionIds = [];
                for (var i = start; i < end; i++)
                    actionIds.push(i);
                if (active) {
                    skippedActionIds = __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_1__utils__["d" /* difference */])(skippedActionIds, actionIds);
                }
                else {
                    skippedActionIds = skippedActionIds.concat(actionIds);
                }
                // Optimization: we know history before this action hasn't changed
                minInvalidatedStateIndex = stagedActionIds.indexOf(start);
                break;
            }
            case __WEBPACK_IMPORTED_MODULE_2__actions__["b" /* ActionTypes */].JUMP_TO_STATE: {
                // Without recomputing anything, move the pointer that tell us
                // which state is considered the current one. Useful for sliders.
                currentStateIndex = liftedAction.index;
                // Optimization: we know the history has not changed.
                minInvalidatedStateIndex = Infinity;
                break;
            }
            case __WEBPACK_IMPORTED_MODULE_2__actions__["b" /* ActionTypes */].SWEEP: {
                // Forget any actions that are currently being skipped.
                stagedActionIds = __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_1__utils__["d" /* difference */])(stagedActionIds, skippedActionIds);
                skippedActionIds = [];
                currentStateIndex = Math.min(currentStateIndex, stagedActionIds.length - 1);
                break;
            }
            case __WEBPACK_IMPORTED_MODULE_2__actions__["b" /* ActionTypes */].PERFORM_ACTION: {
                // Auto-commit as new actions come in.
                if (options.maxAge && stagedActionIds.length === options.maxAge) {
                    commitExcessActions(1);
                }
                if (currentStateIndex === stagedActionIds.length - 1) {
                    currentStateIndex++;
                }
                var actionId = nextActionId++;
                // Mutation! This is the hottest path, and we optimize on purpose.
                // It is safe because we set a new key in a cache dictionary.
                actionsById[actionId] = liftedAction;
                stagedActionIds = stagedActionIds.concat([actionId]);
                // Optimization: we know that only the new action needs computing.
                minInvalidatedStateIndex = stagedActionIds.length - 1;
                break;
            }
            case __WEBPACK_IMPORTED_MODULE_2__actions__["b" /* ActionTypes */].IMPORT_STATE: {
                // Completely replace everything.
                (_b = liftedAction.nextLiftedState, monitorState = _b.monitorState, actionsById = _b.actionsById, nextActionId = _b.nextActionId, stagedActionIds = _b.stagedActionIds, skippedActionIds = _b.skippedActionIds, committedState = _b.committedState, currentStateIndex = _b.currentStateIndex, computedStates = _b.computedStates, _b);
                break;
            }
            case __WEBPACK_IMPORTED_MODULE_0__ngrx_store__["Reducer"].REPLACE:
            case __WEBPACK_IMPORTED_MODULE_0__ngrx_store__["Dispatcher"].INIT: {
                // Always recompute states on hot reload and init.
                minInvalidatedStateIndex = 0;
                if (options.maxAge && stagedActionIds.length > options.maxAge) {
                    // States must be recomputed before committing excess.
                    computedStates = recomputeStates(computedStates, minInvalidatedStateIndex, reducer, committedState, actionsById, stagedActionIds, skippedActionIds);
                    commitExcessActions(stagedActionIds.length - options.maxAge);
                    // Avoid double computation.
                    minInvalidatedStateIndex = Infinity;
                }
                break;
            }
            default: {
                // If the action is not recognized, it's a monitor action.
                // Optimization: a monitor action can't change history.
                minInvalidatedStateIndex = Infinity;
                break;
            }
        }
        computedStates = recomputeStates(computedStates, minInvalidatedStateIndex, reducer, committedState, actionsById, stagedActionIds, skippedActionIds);
        monitorState = monitorReducer(monitorState, liftedAction);
        return {
            monitorState: monitorState,
            actionsById: actionsById,
            nextActionId: nextActionId,
            stagedActionIds: stagedActionIds,
            skippedActionIds: skippedActionIds,
            committedState: committedState,
            currentStateIndex: currentStateIndex,
            computedStates: computedStates
        };
        var _b;
    }; };
}
//# sourceMappingURL=reducer.js.map

/***/ }),
/* 589 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__angular_common__ = __webpack_require__(43);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__src_dock_monitor_index__ = __webpack_require__(383);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__src_log_monitor_index__ = __webpack_require__(598);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4__src_store_log_monitor__ = __webpack_require__(602);
/* harmony reexport (binding) */ __webpack_require__.d(__webpack_exports__, "useLogMonitor", function() { return __WEBPACK_IMPORTED_MODULE_2__src_dock_monitor_index__["b"]; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "StoreLogMonitorModule", function() { return StoreLogMonitorModule; });





var StoreLogMonitorModule = (function () {
    function StoreLogMonitorModule() {
    }
    StoreLogMonitorModule.decorators = [
        { type: __WEBPACK_IMPORTED_MODULE_0__angular_core__["NgModule"], args: [{
                    imports: [
                        __WEBPACK_IMPORTED_MODULE_1__angular_common__["CommonModule"],
                        __WEBPACK_IMPORTED_MODULE_2__src_dock_monitor_index__["a" /* DockMonitorModule */],
                        __WEBPACK_IMPORTED_MODULE_3__src_log_monitor_index__["a" /* LogMonitorModule */]
                    ],
                    declarations: [
                        __WEBPACK_IMPORTED_MODULE_4__src_store_log_monitor__["a" /* StoreLogMonitorComponent */]
                    ],
                    exports: [
                        __WEBPACK_IMPORTED_MODULE_4__src_store_log_monitor__["a" /* StoreLogMonitorComponent */]
                    ]
                },] },
    ];
    /** @nocollapse */
    StoreLogMonitorModule.ctorParameters = [];
    return StoreLogMonitorModule;
}());

//# sourceMappingURL=index.js.map

/***/ }),
/* 590 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_rxjs_operator_filter__ = __webpack_require__(93);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_rxjs_operator_filter___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_1_rxjs_operator_filter__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2_rxjs_operator_map__ = __webpack_require__(23);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2_rxjs_operator_map___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_2_rxjs_operator_map__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__keycodes__ = __webpack_require__(593);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return CommanderComponent; });




var CommanderComponent = (function () {
    function CommanderComponent() {
        var _this = this;
        this.keydown$ = new __WEBPACK_IMPORTED_MODULE_0__angular_core__["EventEmitter"]();
        this._ignoreTags = ['INPUT', 'SELECT', 'TEXTAREA'];
        this.keydown$ = new __WEBPACK_IMPORTED_MODULE_0__angular_core__["EventEmitter"]();
        var filtered$ = __WEBPACK_IMPORTED_MODULE_1_rxjs_operator_filter__["filter"].call(this.keydown$, function (e) {
            if (_this._ignoreTags.indexOf(e.target.tagName) !== -1) {
                return false;
            }
            if (e.target.isContentEditable) {
                return false;
            }
            var command = _this.parseCommand(_this.shortcut);
            if (!command) {
                return false;
            }
            var charCode = e.keyCode || e.which;
            var char = String.fromCharCode(charCode);
            return command.name.toUpperCase() === char.toUpperCase() &&
                command.alt === e.altKey &&
                command.ctrl === e.ctrlKey &&
                command.meta === e.metaKey &&
                command.shift === e.shiftKey;
        });
        this.command = __WEBPACK_IMPORTED_MODULE_2_rxjs_operator_map__["map"].call(filtered$, function (e) {
            e.preventDefault();
            return { command: _this.shortcut };
        });
    }
    CommanderComponent.prototype.parseCommand = function (s) {
        var keyString = s.trim().toLowerCase();
        if (!/^(ctrl-|shift-|alt-|meta-){0,4}\w+$/.test(keyString)) {
            throw new Error('The string to parse needs to be of the format "c", "ctrl-c", "shift-ctrl-c".');
        }
        var parts = keyString.split('-');
        var key = {
            ctrl: false,
            meta: false,
            shift: false,
            alt: false
        };
        var c;
        key.name = parts.pop();
        while ((c = parts.pop())) {
            key[c] = true;
        }
        if (key.ctrl) {
            key.sequence = __WEBPACK_IMPORTED_MODULE_3__keycodes__["a" /* KEYCODES */].ctrl[key.name] || key.name;
        }
        else {
            key.sequence = __WEBPACK_IMPORTED_MODULE_3__keycodes__["a" /* KEYCODES */].nomod[key.name] || key.name;
        }
        if (key.shift && key.sequence && key.sequence.length === 1) {
            key.sequence = key.sequence.toUpperCase();
        }
        return key;
    };
    CommanderComponent.decorators = [
        { type: __WEBPACK_IMPORTED_MODULE_0__angular_core__["Component"], args: [{
                    selector: 'ngrx-commander',
                    template: '',
                    styles: [':host{ display: none }'],
                    host: {
                        '(document:keydown)': 'keydown$.emit($event)'
                    }
                },] },
    ];
    /** @nocollapse */
    CommanderComponent.ctorParameters = [];
    CommanderComponent.propDecorators = {
        'shortcut': [{ type: __WEBPACK_IMPORTED_MODULE_0__angular_core__["Input"] },],
        'command': [{ type: __WEBPACK_IMPORTED_MODULE_0__angular_core__["Output"] },],
    };
    return CommanderComponent;
}());
//# sourceMappingURL=commander.js.map

/***/ }),
/* 591 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__ngrx_core_operator_select__ = __webpack_require__(246);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__ngrx_core_operator_select___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_1__ngrx_core_operator_select__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__ngrx_store_devtools__ = __webpack_require__(247);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3_rxjs_observable_merge__ = __webpack_require__(181);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3_rxjs_observable_merge___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_3_rxjs_observable_merge__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4_rxjs_operator_map__ = __webpack_require__(23);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4_rxjs_operator_map___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_4_rxjs_operator_map__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5__actions__ = __webpack_require__(250);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return DockMonitorComponent; });






var DockMonitorComponent = (function () {
    function DockMonitorComponent(tools, actions) {
        this.state$ = __WEBPACK_IMPORTED_MODULE_1__ngrx_core_operator_select__["select"].call(tools.liftedState, function (s) { return s.monitorState; });
        this.visible$ = __WEBPACK_IMPORTED_MODULE_1__ngrx_core_operator_select__["select"].call(this.state$, function (s) { return s.visible; });
        this.position$ = __WEBPACK_IMPORTED_MODULE_1__ngrx_core_operator_select__["select"].call(this.state$, function (s) { return s.position; });
        this.size$ = __WEBPACK_IMPORTED_MODULE_1__ngrx_core_operator_select__["select"].call(this.state$, function (s) { return s.size; });
        this.toggle$ = new __WEBPACK_IMPORTED_MODULE_0__angular_core__["EventEmitter"]();
        this.changePosition$ = new __WEBPACK_IMPORTED_MODULE_0__angular_core__["EventEmitter"]();
        this.actionsSubscription = __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_3_rxjs_observable_merge__["merge"])(__WEBPACK_IMPORTED_MODULE_4_rxjs_operator_map__["map"].call(this.toggle$, function () { return actions.toggleVisibility(); }), __WEBPACK_IMPORTED_MODULE_4_rxjs_operator_map__["map"].call(this.changePosition$, function () { return actions.changePosition(); })).subscribe(tools);
    }
    DockMonitorComponent.prototype.ngOnDestroy = function () {
        this.actionsSubscription.unsubscribe();
    };
    DockMonitorComponent.decorators = [
        { type: __WEBPACK_IMPORTED_MODULE_0__angular_core__["Component"], args: [{
                    selector: 'dock-monitor',
                    changeDetection: __WEBPACK_IMPORTED_MODULE_0__angular_core__["ChangeDetectionStrategy"].OnPush,
                    template: "\n    <ngrx-commander [shortcut]=\"toggleCommand\" (command)=\"toggle$.emit($event)\"></ngrx-commander>\n    <ngrx-commander [shortcut]=\"positionCommand\" (command)=\"changePosition$.emit($event)\"></ngrx-commander>\n\n    <ngrx-dock [visible]=\"visible$ | async\" [position]=\"position$ | async\" [size]=\"size$ | async\">\n      <ng-content></ng-content>\n    </ngrx-dock>\n  "
                },] },
    ];
    /** @nocollapse */
    DockMonitorComponent.ctorParameters = [
        { type: __WEBPACK_IMPORTED_MODULE_2__ngrx_store_devtools__["StoreDevtools"], },
        { type: __WEBPACK_IMPORTED_MODULE_5__actions__["a" /* DockActions */], },
    ];
    DockMonitorComponent.propDecorators = {
        'toggleCommand': [{ type: __WEBPACK_IMPORTED_MODULE_0__angular_core__["Input"] },],
        'positionCommand': [{ type: __WEBPACK_IMPORTED_MODULE_0__angular_core__["Input"] },],
    };
    return DockMonitorComponent;
}());
//# sourceMappingURL=dock-monitor.js.map

/***/ }),
/* 592 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__(0);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return DockComponent; });

var DockComponent = (function () {
    function DockComponent() {
        this.position = 'right';
        this.size = 0.3;
        this.visible = true;
    }
    Object.defineProperty(DockComponent.prototype, "absoluteSize", {
        get: function () {
            return 100 * this.size + "%";
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(DockComponent.prototype, "restSize", {
        get: function () {
            return (100 - (100 * this.size)) + "%";
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(DockComponent.prototype, "leftPosition", {
        get: function () {
            return this.calculatePosition('left', 'right');
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(DockComponent.prototype, "rightPosition", {
        get: function () {
            return this.calculatePosition('right', 'left');
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(DockComponent.prototype, "topPosition", {
        get: function () {
            return this.calculatePosition('top', 'bottom');
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(DockComponent.prototype, "bottomPosition", {
        get: function () {
            return this.calculatePosition('bottom', 'top');
        },
        enumerable: true,
        configurable: true
    });
    DockComponent.prototype.calculatePosition = function (primary, secondary) {
        if (this.visible) {
            switch (this.position) {
                case secondary:
                    return this.restSize;
                default:
                    return '0%';
            }
        }
        else {
            switch (this.position) {
                case primary:
                    return "-" + this.absoluteSize;
                case secondary:
                    return '100%';
                default:
                    return '0%';
            }
        }
    };
    DockComponent.decorators = [
        { type: __WEBPACK_IMPORTED_MODULE_0__angular_core__["Component"], args: [{
                    selector: 'ngrx-dock',
                    template: "\n    <div class=\"dock\">\n      <div class=\"dock-content\">\n        <ng-content></ng-content>\n      </div>\n    </div>\n  ",
                    styles: ["\n    :host {\n      position: fixed;\n      top: 0;\n      left: 0;\n      right: 0;\n      bottom: 0;\n      transition: all 0.3s;\n      z-index: 9999;\n    }\n\n    .dock {\n      position: absolute;\n      z-index: 1;\n      box-shadow: 0 0 4px rgba(0, 0, 0, 0.3);\n      background-color: white;\n      left: 0;\n      top: 0;\n      width: 100%;\n      height: 100%;\n    }\n\n    .dock-content {\n      width: 100%;\n      height: 100%;\n      overflow: auto;\n    }\n  "]
                },] },
    ];
    /** @nocollapse */
    DockComponent.ctorParameters = [];
    DockComponent.propDecorators = {
        'position': [{ type: __WEBPACK_IMPORTED_MODULE_0__angular_core__["Input"] },],
        'size': [{ type: __WEBPACK_IMPORTED_MODULE_0__angular_core__["Input"] },],
        'visible': [{ type: __WEBPACK_IMPORTED_MODULE_0__angular_core__["Input"] },],
        'leftPosition': [{ type: __WEBPACK_IMPORTED_MODULE_0__angular_core__["HostBinding"], args: ['style.left',] },],
        'rightPosition': [{ type: __WEBPACK_IMPORTED_MODULE_0__angular_core__["HostBinding"], args: ['style.right',] },],
        'topPosition': [{ type: __WEBPACK_IMPORTED_MODULE_0__angular_core__["HostBinding"], args: ['style.top',] },],
        'bottomPosition': [{ type: __WEBPACK_IMPORTED_MODULE_0__angular_core__["HostBinding"], args: ['style.bottom',] },],
    };
    return DockComponent;
}());
//# sourceMappingURL=dock.js.map

/***/ }),
/* 593 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return KEYCODES; });
// Most of these are according to this table: http://www.ssicom.org/js/x171166.htm
// However where nodejs readline diverges, they are adjusted to conform to it
var KEYCODES = {
    nomod: {
        escape: '\u001b',
        space: ' ' // actually '\u0020'
    },
    ctrl: {
        ' ': '\u0000',
        'a': '\u0001',
        'b': '\u0002',
        'c': '\u0003',
        'd': '\u0004',
        'e': '\u0005',
        'f': '\u0006',
        'g': '\u0007',
        'h': '\u0008',
        'i': '\u0009',
        'j': '\u000a',
        'k': '\u000b',
        'm': '\u000c',
        'n': '\u000d',
        'l': '\u000e',
        'o': '\u000f',
        'p': '\u0010',
        'q': '\u0011',
        'r': '\u0012',
        's': '\u0013',
        't': '\u0014',
        'u': '\u0015',
        'v': '\u0016',
        'w': '\u0017',
        'x': '\u0018',
        'y': '\u0019',
        'z': '\u001a',
        '[': '\u001b',
        '\\': '\u001c',
        ']': '\u001d',
        '^': '\u001e',
        '_': '\u001f',
        'space': '\u0000'
    }
};
//# sourceMappingURL=keycodes.js.map

/***/ }),
/* 594 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__ngrx_store__ = __webpack_require__(9);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__actions__ = __webpack_require__(250);
/* unused harmony export POSITIONS */
/* harmony export (immutable) */ __webpack_exports__["a"] = useDockMonitor;


var POSITIONS = ['left', 'top', 'right', 'bottom'];
function useDockMonitor(_options) {
    if (_options === void 0) { _options = {}; }
    var options = Object.assign({
        position: 'right',
        visible: true,
        size: 0.3
    }, _options);
    function position(state, action) {
        if (state === void 0) { state = options.position; }
        return (action.type === __WEBPACK_IMPORTED_MODULE_1__actions__["a" /* DockActions */].CHANGE_POSITION) ?
            POSITIONS[(POSITIONS.indexOf(state) + 1) % POSITIONS.length] :
            state;
    }
    function size(state, action) {
        if (state === void 0) { state = options.size; }
        return (action.type === __WEBPACK_IMPORTED_MODULE_1__actions__["a" /* DockActions */].CHANGE_SIZE) ?
            action.size :
            state;
    }
    function visible(state, action) {
        if (state === void 0) { state = options.visible; }
        return (action.type === __WEBPACK_IMPORTED_MODULE_1__actions__["a" /* DockActions */].TOGGLE_VISIBILITY) ?
            !state :
            state;
    }
    return __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_0__ngrx_store__["combineReducers"])({
        position: position,
        visible: visible,
        size: size
    });
}
//# sourceMappingURL=reducer.js.map

/***/ }),
/* 595 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__angular_common__ = __webpack_require__(43);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__json_node__ = __webpack_require__(596);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__json_tree__ = __webpack_require__(597);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return JsonTreeModule; });




var JsonTreeModule = (function () {
    function JsonTreeModule() {
    }
    JsonTreeModule.decorators = [
        { type: __WEBPACK_IMPORTED_MODULE_0__angular_core__["NgModule"], args: [{
                    imports: [
                        __WEBPACK_IMPORTED_MODULE_1__angular_common__["CommonModule"]
                    ],
                    declarations: [
                        __WEBPACK_IMPORTED_MODULE_2__json_node__["a" /* JsonNodeComponent */],
                        __WEBPACK_IMPORTED_MODULE_3__json_tree__["a" /* JsonTreeComponent */]
                    ],
                    exports: [
                        __WEBPACK_IMPORTED_MODULE_3__json_tree__["a" /* JsonTreeComponent */]
                    ]
                },] },
    ];
    /** @nocollapse */
    JsonTreeModule.ctorParameters = [];
    return JsonTreeModule;
}());
//# sourceMappingURL=index.js.map

/***/ }),
/* 596 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__types__ = __webpack_require__(384);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return JsonNodeComponent; });


var JsonNodeComponent = (function () {
    function JsonNodeComponent() {
        this.expanded = false;
    }
    Object.defineProperty(JsonNodeComponent.prototype, "value", {
        set: function (value) {
            this.label = __WEBPACK_IMPORTED_MODULE_1__types__["b" /* getLabelFor */](value);
            this.type = __WEBPACK_IMPORTED_MODULE_1__types__["c" /* getTypeOf */](value);
            if (this.type === __WEBPACK_IMPORTED_MODULE_1__types__["d" /* KNOWN */].Array || this.type === __WEBPACK_IMPORTED_MODULE_1__types__["d" /* KNOWN */].Object || this.type === __WEBPACK_IMPORTED_MODULE_1__types__["d" /* KNOWN */].Iterable) {
                this.children = __WEBPACK_IMPORTED_MODULE_1__types__["a" /* getChildrenFor */](value);
            }
            else {
                this.children = null;
            }
        },
        enumerable: true,
        configurable: true
    });
    JsonNodeComponent.prototype.toggle = function () {
        if (this.children) {
            this.expanded = !this.expanded;
        }
    };
    JsonNodeComponent.decorators = [
        { type: __WEBPACK_IMPORTED_MODULE_0__angular_core__["Component"], args: [{
                    selector: 'ngrx-json-node',
                    styles: ["\n    :host {\n      display: block;\n      padding: 2px 2px 2px 20px;\n      position: relative;\n      color: #70AFCD;\n      font-family: 'monaco', 'Consolas', 'Lucida Console', monospace;\n    }\n    .expanded-indicator {\n      position: absolute;\n      top: 7px;\n      left: 5px;\n      font-size: 10px;\n      transition: transform 200ms;\n    }\n\n    .expanded .expanded-indicator {\n      transform: rotate(90deg);\n    }\n\n    .node-key::after {\n      content: ': ';\n      display: inline;\n    }\n\n    .expanded .node-label {\n      color: #BABBBD !important;\n    }\n\n    .node-label {\n      color: #9AC05C;\n    }\n\n    .node-label.array, .node-label.null, .node-label.iterable {\n      color: #D182C0;\n    }\n\n    .node-label.number, .node-label.undefined, .node-label.boolean {\n      color: #F86936;\n    }\n  "],
                    template: "\n    <div (click)=\"toggle()\" [class.expanded]=\"expanded\">\n      <span class=\"expanded-indicator\" *ngIf=\"children\">\u25B6</span>\n      <span class=\"node-key\">{{ key }}</span>\n      <span class=\"node-label\" [ngClass]=\"type\">{{ label }}</span>\n    </div>\n    <div class=\"child-nodes\" *ngIf=\"children && expanded\">\n      <ngrx-json-node *ngFor=\"let child of children\" [value]=\"child.value\" [key]=\"child.key\"></ngrx-json-node>\n    </div>\n  "
                },] },
    ];
    /** @nocollapse */
    JsonNodeComponent.ctorParameters = [];
    JsonNodeComponent.propDecorators = {
        'key': [{ type: __WEBPACK_IMPORTED_MODULE_0__angular_core__["Input"] },],
        'expanded': [{ type: __WEBPACK_IMPORTED_MODULE_0__angular_core__["Input"] },],
        'value': [{ type: __WEBPACK_IMPORTED_MODULE_0__angular_core__["Input"] },],
    };
    return JsonNodeComponent;
}());
//# sourceMappingURL=json-node.js.map

/***/ }),
/* 597 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__types__ = __webpack_require__(384);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return JsonTreeComponent; });


var JsonTreeComponent = (function () {
    function JsonTreeComponent() {
        this.children = [];
        this.expanded = true;
    }
    Object.defineProperty(JsonTreeComponent.prototype, "value", {
        set: function (value) {
            this.children = __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_1__types__["a" /* getChildrenFor */])(value);
        },
        enumerable: true,
        configurable: true
    });
    JsonTreeComponent.decorators = [
        { type: __WEBPACK_IMPORTED_MODULE_0__angular_core__["Component"], args: [{
                    selector: 'ngrx-json-tree',
                    template: "\n    <ngrx-json-node *ngFor=\"let child of children\" [expanded]=\"expanded\" [value]=\"child.value\" [key]=\"child.key\"></ngrx-json-node>\n  "
                },] },
    ];
    /** @nocollapse */
    JsonTreeComponent.ctorParameters = [];
    JsonTreeComponent.propDecorators = {
        'expanded': [{ type: __WEBPACK_IMPORTED_MODULE_0__angular_core__["Input"] },],
        'value': [{ type: __WEBPACK_IMPORTED_MODULE_0__angular_core__["Input"] },],
    };
    return JsonTreeComponent;
}());
//# sourceMappingURL=json-tree.js.map

/***/ }),
/* 598 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__angular_common__ = __webpack_require__(43);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__json_tree_index__ = __webpack_require__(595);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__log_monitor__ = __webpack_require__(601);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4__log_monitor_button__ = __webpack_require__(599);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5__log_monitor_entry__ = __webpack_require__(600);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return LogMonitorModule; });






var LogMonitorModule = (function () {
    function LogMonitorModule() {
    }
    LogMonitorModule.decorators = [
        { type: __WEBPACK_IMPORTED_MODULE_0__angular_core__["NgModule"], args: [{
                    imports: [
                        __WEBPACK_IMPORTED_MODULE_1__angular_common__["CommonModule"],
                        __WEBPACK_IMPORTED_MODULE_2__json_tree_index__["a" /* JsonTreeModule */]
                    ],
                    declarations: [
                        __WEBPACK_IMPORTED_MODULE_3__log_monitor__["a" /* LogMonitorComponent */],
                        __WEBPACK_IMPORTED_MODULE_4__log_monitor_button__["a" /* LogMonitorButtonComponent */],
                        __WEBPACK_IMPORTED_MODULE_5__log_monitor_entry__["a" /* LogMonitorEntryComponent */]
                    ],
                    exports: [
                        __WEBPACK_IMPORTED_MODULE_3__log_monitor__["a" /* LogMonitorComponent */]
                    ]
                },] },
    ];
    /** @nocollapse */
    LogMonitorModule.ctorParameters = [];
    return LogMonitorModule;
}());
//# sourceMappingURL=index.js.map

/***/ }),
/* 599 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__(0);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return LogMonitorButtonComponent; });

var LogMonitorButtonComponent = (function () {
    function LogMonitorButtonComponent() {
        this.action = new __WEBPACK_IMPORTED_MODULE_0__angular_core__["EventEmitter"]();
    }
    LogMonitorButtonComponent.prototype.handleAction = function ($event) {
        if (!this.disabled) {
            this.action.next({});
        }
        $event.stopPropagation();
        return false;
    };
    LogMonitorButtonComponent.decorators = [
        { type: __WEBPACK_IMPORTED_MODULE_0__angular_core__["Component"], args: [{
                    selector: 'log-monitor-button',
                    template: "\n    <ng-content></ng-content>\n  ",
                    styles: ["\n    :host{\n      flex-grow: 1;\n      display: inline-block;\n      font-family: 'monaco', 'Consolas', 'Lucida Console', monospace;\n      cursor: pointer;\n      font-weight: bold;\n      border-radius: 3px;\n      padding: 4px 8px;\n      margin: 5px 3px 5px 3px;\n      font-size: 0.8em;\n      color: white;\n      text-decoration: none;\n      background-color: #4F5A65;\n    }\n\n    :host.disabled{\n      opacity: 0.2;\n      cursor: text;\n      background-color: transparent;\n    }\n  "]
                },] },
    ];
    /** @nocollapse */
    LogMonitorButtonComponent.ctorParameters = [];
    LogMonitorButtonComponent.propDecorators = {
        'disabled': [{ type: __WEBPACK_IMPORTED_MODULE_0__angular_core__["HostBinding"], args: ['class.disabled',] }, { type: __WEBPACK_IMPORTED_MODULE_0__angular_core__["Input"] },],
        'action': [{ type: __WEBPACK_IMPORTED_MODULE_0__angular_core__["Output"] },],
        'handleAction': [{ type: __WEBPACK_IMPORTED_MODULE_0__angular_core__["HostListener"], args: ['click', ['$event'],] },],
    };
    return LogMonitorButtonComponent;
}());
//# sourceMappingURL=log-monitor-button.js.map

/***/ }),
/* 600 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__(0);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return LogMonitorEntryComponent; });

var LogMonitorEntryComponent = (function () {
    function LogMonitorEntryComponent() {
        this.expandEntries = false;
        this.disabled = false;
        this.toggle = new __WEBPACK_IMPORTED_MODULE_0__angular_core__["EventEmitter"]();
    }
    Object.defineProperty(LogMonitorEntryComponent.prototype, "item", {
        get: function () {
            return this._item;
        },
        set: function (value) {
            this._item = value;
            this.stateActionPair = {
                state: value.state,
                action: value.action
            };
        },
        enumerable: true,
        configurable: true
    });
    LogMonitorEntryComponent.prototype.handleToggle = function () {
        if (!this.disabled) {
            this.toggle.next({ id: this.item.actionId });
        }
    };
    LogMonitorEntryComponent.prototype.logPayload = function () {
        console.log(this.item.action);
    };
    LogMonitorEntryComponent.prototype.logState = function () {
        console.log(this.item.state);
    };
    LogMonitorEntryComponent.decorators = [
        { type: __WEBPACK_IMPORTED_MODULE_0__angular_core__["Component"], args: [{
                    selector: 'log-monitor-entry',
                    template: "\n    <div class=\"title-bar\" [ngClass]=\"{ collapsed: item.collapsed }\" (click)=\"handleToggle()\">\n      {{ item.action.type }}\n    </div>\n    <div class=\"action-bar\" *ngIf=\"!item.collapsed\">\n      <ngrx-json-tree [value]=\"stateActionPair\" [expanded]=\"expandEntries\"></ngrx-json-tree>\n    </div>\n  ",
                    styles: ["\n    :host{\n      color: #FFFFFF;\n      background-color: #4F5A65;\n      cursor: pointer;\n    }\n    .title-bar{\n      padding: 8px 0 7px 16px;\n      background-color: rgba(0,0,0,0.1);\n    }\n    .action-bar{\n      padding: 20px;\n    }\n    .collapsed{\n      text-decoration: line-through;\n      font-style: italic;\n      opacity: 0.5;\n    }\n  "]
                },] },
    ];
    /** @nocollapse */
    LogMonitorEntryComponent.ctorParameters = [];
    LogMonitorEntryComponent.propDecorators = {
        'expandEntries': [{ type: __WEBPACK_IMPORTED_MODULE_0__angular_core__["Input"] },],
        'disabled': [{ type: __WEBPACK_IMPORTED_MODULE_0__angular_core__["Input"] },],
        'item': [{ type: __WEBPACK_IMPORTED_MODULE_0__angular_core__["Input"] },],
        'toggle': [{ type: __WEBPACK_IMPORTED_MODULE_0__angular_core__["Output"] },],
    };
    return LogMonitorEntryComponent;
}());
//# sourceMappingURL=log-monitor-entry.js.map

/***/ }),
/* 601 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_rxjs_operator_map__ = __webpack_require__(23);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_rxjs_operator_map___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_1_rxjs_operator_map__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__ngrx_store_devtools__ = __webpack_require__(247);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__ngrx_core_operator_select__ = __webpack_require__(246);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__ngrx_core_operator_select___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_3__ngrx_core_operator_select__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return LogMonitorComponent; });




var LogMonitorComponent = (function () {
    function LogMonitorComponent(devtools) {
        this.devtools = devtools;
        this.expandEntries = true;
        this.canRevert$ = __WEBPACK_IMPORTED_MODULE_3__ngrx_core_operator_select__["select"].call(devtools.liftedState, function (s) { return !(s.computedStates.length > 1); });
        this.canSweep$ = __WEBPACK_IMPORTED_MODULE_3__ngrx_core_operator_select__["select"].call(devtools.liftedState, function (s) { return !(s.skippedActionIds.length > 0); });
        this.canCommit$ = __WEBPACK_IMPORTED_MODULE_3__ngrx_core_operator_select__["select"].call(devtools.liftedState, function (s) { return !(s.computedStates.length > 1); });
        this.items$ = __WEBPACK_IMPORTED_MODULE_1_rxjs_operator_map__["map"].call(devtools.liftedState, function (_a) {
            var actionsById = _a.actionsById, skippedActionIds = _a.skippedActionIds, stagedActionIds = _a.stagedActionIds, computedStates = _a.computedStates;
            var actions = [];
            for (var i = 0; i < stagedActionIds.length; i++) {
                var actionId = stagedActionIds[i];
                var action = actionsById[actionId].action;
                var _b = computedStates[i], state = _b.state, error = _b.error;
                var previousState = void 0;
                if (i > 0) {
                    previousState = computedStates[i - 1].state;
                }
                actions.push({
                    key: actionId,
                    collapsed: skippedActionIds.indexOf(actionId) > -1,
                    action: action,
                    actionId: actionId,
                    state: state,
                    previousState: previousState,
                    error: error
                });
            }
            return actions;
        });
    }
    LogMonitorComponent.prototype.handleToggle = function (id) {
        this.devtools.toggleAction(id);
    };
    LogMonitorComponent.prototype.handleReset = function () {
        this.devtools.reset();
    };
    LogMonitorComponent.prototype.handleRollback = function () {
        this.devtools.rollback();
    };
    LogMonitorComponent.prototype.handleSweep = function () {
        this.devtools.sweep();
    };
    LogMonitorComponent.prototype.handleCommit = function () {
        this.devtools.commit();
    };
    LogMonitorComponent.decorators = [
        { type: __WEBPACK_IMPORTED_MODULE_0__angular_core__["Component"], args: [{
                    selector: 'log-monitor',
                    styles: ["\n    :host {\n      display: block;\n      background-color: #2A2F3A;\n      font-family: 'monaco', 'Consolas', 'Lucida Console', monospace;\n      position: relative;\n      overflow-y: hidden;\n      width: 100%;\n      height: 100%;\n      min-width: 300px;\n      direction: ltr;\n    }\n\n    .button-bar {\n      text-align: center;\n      border-bottom-width: 1px;\n      border-bottom-style: solid;\n      border-color: transparent;\n      z-index: 1;\n      display: flex;\n      flex-direction: row;\n      padding: 0 4px;\n    }\n\n    .elements {\n      position: absolute;\n      left: 0;\n      right: 0;\n      top: 38px;\n      bottom: 0;\n      overflow-x: hidden;\n      overflow-y: auto;\n    }\n  "],
                    template: "\n    <div class=\"button-bar\">\n      <log-monitor-button (action)=\"handleReset()\">\n        Reset\n      </log-monitor-button>\n\n      <log-monitor-button (action)=\"handleRollback()\">\n        Revert\n      </log-monitor-button>\n\n      <log-monitor-button (action)=\"handleSweep()\" [disabled]=\"canSweep$ | async\">\n        Sweep\n      </log-monitor-button>\n\n      <log-monitor-button (action)=\"handleCommit()\" [disabled]=\"canCommit$ | async\">\n        Commit\n      </log-monitor-button>\n    </div>\n    <div class=\"elements\">\n      <log-monitor-entry\n        *ngFor=\"let item of (items$ | async); let i = index\"\n        [item]=\"item\"\n        [disabled]=\"i === 0\"\n        [expandEntries]=\"expandEntries\"\n        (toggle)=\"handleToggle($event.id)\">\n      </log-monitor-entry>\n    </div>\n  "
                },] },
    ];
    /** @nocollapse */
    LogMonitorComponent.ctorParameters = [
        { type: __WEBPACK_IMPORTED_MODULE_2__ngrx_store_devtools__["StoreDevtools"], },
    ];
    LogMonitorComponent.propDecorators = {
        'expandEntries': [{ type: __WEBPACK_IMPORTED_MODULE_0__angular_core__["Input"] },],
    };
    return LogMonitorComponent;
}());
//# sourceMappingURL=log-monitor.js.map

/***/ }),
/* 602 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__(0);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return StoreLogMonitorComponent; });

var StoreLogMonitorComponent = (function () {
    function StoreLogMonitorComponent() {
        this.toggleCommand = 'ctrl-h';
        this.positionCommand = 'ctrl-m';
        this.expandEntries = false;
    }
    StoreLogMonitorComponent.decorators = [
        { type: __WEBPACK_IMPORTED_MODULE_0__angular_core__["Component"], args: [{
                    selector: 'ngrx-store-log-monitor',
                    template: "\n    <dock-monitor [toggleCommand]=\"toggleCommand\" [positionCommand]=\"positionCommand\">\n      <log-monitor [expandEntries]=\"expandEntries\"></log-monitor>\n    </dock-monitor>\n  "
                },] },
    ];
    /** @nocollapse */
    StoreLogMonitorComponent.ctorParameters = [];
    StoreLogMonitorComponent.propDecorators = {
        'toggleCommand': [{ type: __WEBPACK_IMPORTED_MODULE_0__angular_core__["Input"] },],
        'positionCommand': [{ type: __WEBPACK_IMPORTED_MODULE_0__angular_core__["Input"] },],
        'expandEntries': [{ type: __WEBPACK_IMPORTED_MODULE_0__angular_core__["Input"] },],
    };
    return StoreLogMonitorComponent;
}());
//# sourceMappingURL=store-log-monitor.js.map

/***/ }),
/* 603 */,
/* 604 */,
/* 605 */,
/* 606 */,
/* 607 */,
/* 608 */,
/* 609 */,
/* 610 */,
/* 611 */,
/* 612 */,
/* 613 */,
/* 614 */,
/* 615 */,
/* 616 */,
/* 617 */,
/* 618 */,
/* 619 */,
/* 620 */,
/* 621 */,
/* 622 */,
/* 623 */,
/* 624 */,
/* 625 */,
/* 626 */,
/* 627 */,
/* 628 */,
/* 629 */,
/* 630 */,
/* 631 */,
/* 632 */,
/* 633 */,
/* 634 */,
/* 635 */,
/* 636 */,
/* 637 */,
/* 638 */,
/* 639 */,
/* 640 */,
/* 641 */,
/* 642 */,
/* 643 */,
/* 644 */,
/* 645 */,
/* 646 */,
/* 647 */,
/* 648 */,
/* 649 */,
/* 650 */,
/* 651 */,
/* 652 */,
/* 653 */,
/* 654 */,
/* 655 */,
/* 656 */,
/* 657 */,
/* 658 */,
/* 659 */,
/* 660 */,
/* 661 */,
/* 662 */,
/* 663 */,
/* 664 */,
/* 665 */,
/* 666 */,
/* 667 */,
/* 668 */,
/* 669 */
/***/ (function(module, exports, __webpack_require__) {

var __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;/*! @source http://purl.eligrey.com/github/FileSaver.js/blob/master/FileSaver.js */
var saveAs=saveAs||function(e){"use strict";if("undefined"==typeof navigator||!/MSIE [1-9]\./.test(navigator.userAgent)){var t=e.document,n=function(){return e.URL||e.webkitURL||e},o=t.createElementNS("http://www.w3.org/1999/xhtml","a"),r="download"in o,i=function(e){var t=new MouseEvent("click");e.dispatchEvent(t)},a=e.webkitRequestFileSystem,c=e.requestFileSystem||a||e.mozRequestFileSystem,u=function(t){(e.setImmediate||e.setTimeout)(function(){throw t},0)},f="application/octet-stream",s=0,d=500,l=function(t){var o=function(){"string"==typeof t?n().revokeObjectURL(t):t.remove()};e.chrome?o():setTimeout(o,d)},v=function(e,t,n){t=[].concat(t);for(var o=t.length;o--;){var r=e["on"+t[o]];if("function"==typeof r)try{r.call(e,n||e)}catch(i){u(i)}}},p=function(e){return/^\s*(?:text\/\S*|application\/xml|\S*\/\S*\+xml)\s*;.*charset\s*=\s*utf-8/i.test(e.type)?new Blob(["﻿",e],{type:e.type}):e},w=function(t,u,d){d||(t=p(t));var w,y,m,S=this,h=t.type,O=!1,R=function(){v(S,"writestart progress write writeend".split(" "))},b=function(){if((O||!w)&&(w=n().createObjectURL(t)),y)y.location.href=w;else{var o=e.open(w,"_blank");void 0==o&&"undefined"!=typeof safari&&(e.location.href=w)}S.readyState=S.DONE,R(),l(w)},g=function(e){return function(){return S.readyState!==S.DONE?e.apply(this,arguments):void 0}},E={create:!0,exclusive:!1};return S.readyState=S.INIT,u||(u="download"),r?(w=n().createObjectURL(t),o.href=w,o.download=u,void setTimeout(function(){i(o),R(),l(w),S.readyState=S.DONE})):(e.chrome&&h&&h!==f&&(m=t.slice||t.webkitSlice,t=m.call(t,0,t.size,f),O=!0),a&&"download"!==u&&(u+=".download"),(h===f||a)&&(y=e),c?(s+=t.size,void c(e.TEMPORARY,s,g(function(e){e.root.getDirectory("saved",E,g(function(e){var n=function(){e.getFile(u,E,g(function(e){e.createWriter(g(function(n){n.onwriteend=function(t){y.location.href=e.toURL(),S.readyState=S.DONE,v(S,"writeend",t),l(e)},n.onerror=function(){var e=n.error;e.code!==e.ABORT_ERR&&b()},"writestart progress write abort".split(" ").forEach(function(e){n["on"+e]=S["on"+e]}),n.write(t),S.abort=function(){n.abort(),S.readyState=S.DONE},S.readyState=S.WRITING}),b)}),b)};e.getFile(u,{create:!1},g(function(e){e.remove(),n()}),g(function(e){e.code===e.NOT_FOUND_ERR?n():b()}))}),b)}),b)):void b())},y=w.prototype,m=function(e,t,n){return new w(e,t,n)};return"undefined"!=typeof navigator&&navigator.msSaveOrOpenBlob?function(e,t,n){return n||(e=p(e)),navigator.msSaveOrOpenBlob(e,t||"download")}:(y.abort=function(){var e=this;e.readyState=e.DONE,v(e,"abort")},y.readyState=y.INIT=0,y.WRITING=1,y.DONE=2,y.error=y.onwritestart=y.onprogress=y.onwrite=y.onabort=y.onerror=y.onwriteend=null,m)}}("undefined"!=typeof self&&self||"undefined"!=typeof window&&window||this.content);"undefined"!=typeof module&&module.exports?module.exports.saveAs=saveAs:"undefined"!="function"&&null!==__webpack_require__(1125)&&null!=__webpack_require__(463)&&!(__WEBPACK_AMD_DEFINE_ARRAY__ = [], __WEBPACK_AMD_DEFINE_RESULT__ = function(){return saveAs}.apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__),
				__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));

/***/ }),
/* 670 */
/***/ (function(module, exports) {

module.exports = "<div class=\"row\">\r\n    <h1 class=\"col-xs-12 pane-title\">\r\n        <i class=\"fa fa-puzzle-piece\"></i>\r\n        <span class=\"macro__name pane-title__name\">{{ name$ | async }}</span>\r\n    </h1>\r\n</div>\r\nTo be done...";

/***/ }),
/* 671 */
/***/ (function(module, exports) {

module.exports = "<svg-keyboard *ngFor=\"let layer of layers; let index = index; trackBy: trackKeyboard\"\r\n    [@layerState]=\"layerAnimationState[index]\"\r\n    [moduleConfig]=\"layer.modules\"\r\n    [keybindAnimationEnabled]=\"keybindAnimationEnabled\"\r\n    [capturingEnabled]=\"capturingEnabled\"\r\n    (keyClick)=\"keyClick.emit($event)\"\r\n    (keyHover)=\"keyHover.emit($event)\"\r\n    (capture)=\"capture.emit($event)\"\r\n>\r\n</svg-keyboard>";

/***/ }),
/* 672 */
/***/ (function(module, exports) {

module.exports = "<h1>\r\n    <i class=\"fa fa-keyboard-o\"></i>\r\n    <span>Add new keymap</span>\r\n</h1>\r\n<div class=\"keymap__search clearfix\">\r\n    <div class=\"input-group\">\r\n        <span class=\"input-group-addon\" id=\"sizing-addon1\">\r\n            <i class=\"fa fa-search\"></i>\r\n        </span>\r\n        <input type=\"text\" class=\"form-control\" placeholder=\"Search ...\" (input)=\"filterKeyboards($event.target.value)\">\r\n    </div>\r\n    <div class=\"keymap__search_amount\">\r\n        {{ (presets$ | async).length }} / {{ (presetsAll$ | async).length }} keymaps shown\r\n    </div>\r\n</div>\r\n<div class=\"keymap__list\">\r\n    <div #keyboard class=\"keymap__list_item\" *ngFor=\"let keymap of presets$ | async\">\r\n        <h2>{{ keymap.name }}</h2>\r\n        <p class=\"keymap__description\">\r\n            {{ keymap.description }}\r\n        </p>\r\n        <svg-keyboard-wrap\r\n                [keymap]=\"keymap\"\r\n                [popoverEnabled]=\"false\"\r\n                [tooltipEnabled]=\"true\"\r\n        >\r\n        </svg-keyboard-wrap>\r\n        <div class=\"btn-group btn-group-lg\">\r\n            <button class=\"btn btn-default\" (click)=\"addKeymap(keymap)\">Add keymap</button>\r\n        </div>\r\n    </div>\r\n</div>\r\n<div *ngIf=\"(presets$ | async).length === 0\">\r\n    Sorry, no keyboard found under this search query.\r\n</div>";

/***/ }),
/* 673 */
/***/ (function(module, exports) {

module.exports = "<template [ngIf]=\"keymap$ | async\">\r\n    <keymap-header [keymap]=\"keymap$ | async\" [deletable]=\"deletable$ | async\" (downloadClick)=\"downloadKeymap()\"></keymap-header>\r\n    <svg-keyboard-wrap [keymap]=\"keymap$ | async\"></svg-keyboard-wrap>\r\n</template>\r\n\r\n<div *ngIf=\"!(keymap$ | async)\" class=\"not-found\">\r\n    Sorry, there is no keymap with this abbreviation.\r\n</div>";

/***/ }),
/* 674 */
/***/ (function(module, exports) {

module.exports = "<div class=\"row\">\r\n    <h1 class=\"col-xs-12 pane-title\">\r\n        <i class=\"fa fa-keyboard-o\"></i>\r\n        <input #name cancelable\r\n                class=\"keymap__name pane-title__name\"\r\n                type=\"text\"\r\n                value=\"{{ keymap.name }}\"\r\n                (change)=\"editKeymapName($event.target.value)\"\r\n                (keyup.enter)=\"name.blur()\"\r\n        /> keymap\r\n        (<input #abbr cancelable\r\n                class=\"keymap__abbrev pane-title__abbrev\"\r\n                type=\"text\"\r\n                value=\"{{ keymap.abbreviation }}\"\r\n                (change)=\"editKeymapAbbr($event.target.value)\"\r\n                (keyup.enter)=\"abbr.blur()\"\r\n                [attr.maxLength]=\"3\"\r\n        />)\r\n        <i class=\"fa keymap__is-default\"\r\n           [ngClass]=\"{'fa-star-o': !keymap.isDefault, 'fa-star': keymap.isDefault}\"\r\n           [title]=\"starTitle\"\r\n           (click)=\"setDefault()\"\r\n        ></i>\r\n        <i class=\"glyphicon glyphicon-trash keymap__remove pull-right\" [title]=\"trashTitle\"\r\n            [class.disabled]=\"!deletable\"\r\n            data-toggle=\"tooltip\"\r\n            data-placement=\"left\"\r\n            data-original-title=\"Remove keymap\"\r\n            (click)=\"removeKeymap()\"\r\n        ></i>\r\n        <i class=\"fa fa-files-o keymap__duplicate pull-right\" title=\"\"\r\n           data-toggle=\"tooltip\"\r\n           data-placement=\"left\"\r\n           data-original-title=\"Duplicate keymap\"\r\n           (click)=\"duplicateKeymap()\"\r\n        ></i>\r\n        <i class=\"fa fa-download layer__download pull-right\" title=\"Download layer\" (click)=\"onDownloadIconClick()\"></i>\r\n    </h1>\r\n</div>";

/***/ }),
/* 675 */
/***/ (function(module, exports) {

module.exports = "<div class=\"text-center\">\r\n    <span class=\"uhk__layer-switcher--wrapper\" data-title=\"Layers: \">\r\n        <button type=\"button\" class=\"btn btn-default btn-lg\" *ngFor=\"let button of buttons; let index = index\" (click)=\"selectLayer(index)\"\r\n            [class.btn-primary]=\"index === current\">\r\n            {{ button }}\r\n        </button>\r\n    </span>\r\n</div>";

/***/ }),
/* 676 */
/***/ (function(module, exports) {

module.exports = "<div class=\"action--editor\">\r\n    <div class=\"row\">\r\n        <div class=\"col-xs-4 editor__tab-links\">\r\n            <ul class=\"nav nav-pills nav-stacked\">\r\n                <li #macroText [class.active]=\"activeTab === TabName.Text\" (click)=\"selectTab(TabName.Text)\">\r\n                    <a>\r\n                        <i class=\"fa fa-font\"></i>\r\n                        <span>Type text</span>\r\n                    </a>\r\n                </li>\r\n                <li #macroKeypress [class.active]=\"activeTab === TabName.Keypress\" (click)=\"selectTab(TabName.Keypress)\">\r\n                    <a>\r\n                        <i class=\"fa fa-keyboard-o\"></i>\r\n                        <span>Key action</span>\r\n                    </a>\r\n                </li>\r\n                <li #macroMouse [class.active]=\"activeTab === TabName.Mouse\" (click)=\"selectTab(TabName.Mouse)\">\r\n                    <a>\r\n                        <i class=\"fa fa-mouse-pointer\"></i>\r\n                        <span>Mouse action</span>\r\n                    </a>\r\n                </li>\r\n                <li #macroDelay [class.active]=\"activeTab === TabName.Delay\" (click)=\"selectTab(TabName.Delay)\">\r\n                    <a>\r\n                        <i class=\"fa fa-clock-o\"></i>\r\n                        <span>Delay</span>\r\n                    </a>\r\n                </li>\r\n            </ul>\r\n        </div>\r\n        <div class=\"col-xs-8 editor__tabs\" [ngSwitch]=\"activeTab\">\r\n            <macro-text-tab #tab *ngSwitchCase=\"TabName.Text\" [macroAction]=\"editableMacroAction\"></macro-text-tab>\r\n            <macro-key-tab #tab *ngSwitchCase=\"TabName.Keypress\" [macroAction]=\"editableMacroAction\"></macro-key-tab>\r\n            <macro-mouse-tab #tab *ngSwitchCase=\"TabName.Mouse\" [macroAction]=\"editableMacroAction\"></macro-mouse-tab>\r\n            <macro-delay-tab #tab *ngSwitchCase=\"TabName.Delay\" [macroAction]=\"editableMacroAction\"></macro-delay-tab>\r\n        </div>\r\n    </div>\r\n    <div class=\"row\">\r\n        <div class=\"col-xs-12 flex-button-wrapper editor__actions-container\">\r\n            <div class=\"editor__actions\">\r\n                <button class=\"btn btn-sm btn-default flex-button\" type=\"button\" (click)=\"onCancelClick()\"> Cancel </button>\r\n                <button class=\"btn btn-sm btn-primary flex-button\" type=\"button\" (click)=\"onSaveClick()\"> Save </button>\r\n            </div>\r\n        </div>\r\n    </div>\r\n</div>";

/***/ }),
/* 677 */
/***/ (function(module, exports) {

module.exports = "<div class=\"macro-delay\">\r\n    <div class=\"row\">\r\n        <div class=\"col-xs-12\">\r\n            <h4>Enter delay in seconds</h4>\r\n        </div>\r\n    </div>\r\n    <div class=\"row\">\r\n        <div class=\"col-xs-4\">\r\n          <input #macroDelayInput\r\n                 type=\"number\" \r\n                 min=\"0\" \r\n                 max=\"1000\" \r\n                 step=\"0.1\" \r\n                 placeholder=\"Delay amount\" \r\n                 class=\"form-control\"\r\n                 [attr.value]=\"delay\"\r\n                 (change)=\"setDelay($event)\">\r\n        </div>\r\n    </div>\r\n    <div class=\"row macro-delay__presets\">\r\n        <div class=\"col-xs-12\">\r\n          <h6>Choose a preset</h6>\r\n          <button *ngFor=\"let delay of presets\" class=\"btn btn-sm btn-default\" (click)=\"setDelay(delay)\">{{delay}}s</button>\r\n        </div>\r\n    </div>\r\n</div>\r\n";

/***/ }),
/* 678 */
/***/ (function(module, exports) {

module.exports = "<div class=\"col-xs-12 macro-key__container\">\r\n    <div class=\"col-xs-4 macro-key__types\">\r\n        <ul class=\"nav nav-pills nav-stacked\">\r\n            <li #keyMove [class.active]=\"activeTab === TabName.Keypress\" (click)=\"selectTab(TabName.Keypress)\">\r\n                <a>\r\n                    <i class=\"fa fa-hand-pointer-o\"></i>\r\n                    <span>Press key</span>\r\n                </a>\r\n            </li>\r\n            <li #keyHold [class.active]=\"activeTab === TabName.Hold\" (click)=\"selectTab(TabName.Hold)\">\r\n                <a>\r\n                    <i class=\"fa fa-hand-rock-o\"></i>\r\n                    <span>Hold key</span>\r\n                </a>\r\n            </li>\r\n            <li #keyRelease [class.active]=\"activeTab === TabName.Release\" (click)=\"selectTab(TabName.Release)\">\r\n                <a>\r\n                    <i class=\"fa fa-hand-paper-o\"></i>\r\n                    <span>Release key</span>\r\n                </a>\r\n            </li>\r\n        </ul>\r\n    </div>\r\n    <div class=\"col-xs-8 macro-key__action-container\">\r\n        <div class=\"macro-key__action\">\r\n            <h4 *ngIf=\"activeTab === TabName.Keypress\">Press key</h4>\r\n            <h4 *ngIf=\"activeTab === TabName.Hold\">Hold key</h4>\r\n            <h4 *ngIf=\"activeTab === TabName.Release\">Release key</h4>\r\n            <keypress-tab #keypressTab [defaultKeyAction]=\"defaultKeyAction\" [longPressEnabled]=\"false\"></keypress-tab>\r\n        </div>\r\n    </div>\r\n</div>";

/***/ }),
/* 679 */
/***/ (function(module, exports) {

module.exports = "<div class=\"col-xs-12 macro-mouse__container\">\r\n    <div class=\"col-xs-4 macro-mouse__types\">\r\n        <ul class=\"nav nav-pills nav-stacked\">\r\n            <li #mouseMove [class.active]=\"activeTab === TabName.Move\" (click)=\"selectTab(TabName.Move)\">\r\n                <a>\r\n                    <i class=\"fa fa-arrows\"></i>\r\n                    <span>Move pointer</span>\r\n                </a>\r\n            </li>\r\n            <li #mouseScroll [class.active]=\"activeTab === TabName.Scroll\" (click)=\"selectTab(TabName.Scroll)\">\r\n                <a>\r\n                    <i class=\"fa fa-arrows-v\"></i>\r\n                    <span>Scroll</span>\r\n                </a>\r\n            </li>\r\n            <li #mouseClick [class.active]=\"activeTab === TabName.Click\" (click)=\"selectTab(TabName.Click)\">\r\n                <a>\r\n                    <i class=\"fa fa-mouse-pointer\"></i>\r\n                    <span>Click button</span>\r\n                </a>\r\n            </li>\r\n            <li #mouseHold [class.active]=\"activeTab === TabName.Hold\" (click)=\"selectTab(TabName.Hold)\">\r\n                <a>\r\n                    <i class=\"fa fa-hand-rock-o\"></i>\r\n                    <span>Hold button</span>\r\n                </a>\r\n            </li>\r\n            <li #mouseRelease [class.active]=\"activeTab === TabName.Release\" (click)=\"selectTab(TabName.Release)\">\r\n                <a>\r\n                    <i class=\"fa fa-hand-paper-o\"></i>\r\n                    <span>Release button</span>\r\n                </a>\r\n            </li>\r\n        </ul>\r\n    </div>\r\n    <div class=\"col-xs-8 macro-mouse__actions\" [ngSwitch]=\"activeTab\">\r\n        <div #tab *ngSwitchCase=\"TabName.Move\">\r\n            <h4>Move pointer</h4>\r\n            <p>Use negative values to move down or left from current position.</p>\r\n            <div class=\"form-horizontal\">\r\n                <div class=\"form-group\">\r\n                    <label for=\"move-mouse-x\">X</label>\r\n                    <input id=\"move-mouse-x\" type=\"number\" class=\"form-control\" [(ngModel)]=\"macroAction.moveX\"> pixels\r\n                </div>\r\n                <div class=\"form-group\">\r\n                    <label for=\"move-mouse-y\">Y</label>\r\n                    <input id=\"move-mouse-y\" type=\"number\" class=\"form-control\" [(ngModel)]=\"macroAction.moveY\"> pixels\r\n                </div>\r\n            </div>\r\n        </div>\r\n        <div #tab *ngSwitchCase=\"TabName.Scroll\">\r\n            <h4>Scroll</h4>\r\n            <p>Use negative values to move down or left from current position.</p>\r\n            <div class=\"form-horizontal\">\r\n                <div class=\"form-group\">\r\n                    <label for=\"scroll-mouse-x\">X</label>\r\n                    <input id=\"scroll-mouse-x\" type=\"number\" class=\"form-control\" [(ngModel)]=\"macroAction.scrollX\"> pixels\r\n                </div>\r\n                <div class=\"form-group\">\r\n                    <label for=\"scroll-mouse-y\">Y</label>\r\n                    <input id=\"scroll-mouse-y\" type=\"number\" class=\"form-control\" [(ngModel)]=\"macroAction.scrollY\"> pixels\r\n                </div>\r\n            </div>\r\n        </div>\r\n        <div #tab *ngIf=\"activeTab === TabName.Click || activeTab === TabName.Hold || activeTab === TabName.Release\">\r\n            <h4 *ngIf=\"activeTab === TabName.Click\">Click mouse button</h4>\r\n            <h4 *ngIf=\"activeTab === TabName.Hold\">Hold mouse button</h4>\r\n            <h4 *ngIf=\"activeTab === TabName.Release\">Release mouse button</h4>\r\n            <div class=\"btn-group macro-mouse__buttons\">\r\n                <button *ngFor=\"let buttonLabel of buttonLabels; let buttonIndex = index\"\r\n                        class=\"btn btn-default\" \r\n                        [class.btn-primary]=\"hasButton(buttonIndex)\" \r\n                        (click)=\"setMouseClick(buttonIndex)\">{{buttonLabel}}</button>\r\n            </div>\r\n        </div>\r\n    </div>\r\n</div>";

/***/ }),
/* 680 */
/***/ (function(module, exports) {

module.exports = "<div>\r\n    <h4>Type text</h4>\r\n    <p>Input the text you want to type with this macro action.</p>\r\n    <textarea #macroTextInput name=\"macro-text\" (change)=\"onTextChange()\" class=\"macro__text-input\">{{ macroAction.text }}</textarea>\r\n</div>";

/***/ }),
/* 681 */
/***/ (function(module, exports) {

module.exports = "<template [ngIf]=\"macro\">\r\n    <macro-header\r\n            [macro]=\"macro\"\r\n            [isNew]=\"isNew\"\r\n    ></macro-header>\r\n    <macro-list\r\n        [macro]=\"macro\"\r\n        (add)=\"addAction($event.macroId, $event.action)\"\r\n        (edit)=\"editAction($event.macroId, $event.index, $event.action)\"\r\n        (delete)=\"deleteAction($event.macroId, $event.index, $event.action)\"\r\n        (reorder)=\"reorderAction($event.macroId, $event.oldIndex, $event.newIndex)\"\r\n    ></macro-list>\r\n</template>\r\n\r\n<div *ngIf=\"!macro\" class=\"not-found\">\r\n    There is no macro with id {{ route.params.select('id') | async }}.\r\n</div>";

/***/ }),
/* 682 */
/***/ (function(module, exports) {

module.exports = "<div class=\"row\">\r\n    <h1 class=\"col-xs-12 pane-title\">\r\n        <i class=\"fa fa-play\"></i>\r\n        <input #macroName cancelable\r\n                class=\"pane-title__name\"\r\n                type=\"text\"\r\n                value=\"{{ macro.name }}\"\r\n               (change)=\"editMacroName($event.target.value)\"\r\n               (keyup.enter)=\"macroName.blur()\"\r\n        />\r\n        <i class=\"glyphicon glyphicon-trash macro__remove pull-right\" title=\"\"\r\n           data-toggle=\"tooltip\"\r\n           data-placement=\"left\"\r\n           data-original-title=\"Remove macro\"\r\n           (click)=\"removeMacro()\"\r\n        ></i>\r\n        <i class=\"fa fa-files-o macro__duplicate pull-right\" title=\"\"\r\n           data-toggle=\"tooltip\"\r\n           data-placement=\"left\"\r\n           data-original-title=\"Duplicate macro\"\r\n           (click)=\"duplicateMacro()\"\r\n        ></i>\r\n    </h1>\r\n</div>";

/***/ }),
/* 683 */
/***/ (function(module, exports) {

module.exports = "<div class=\"list-group-item action--item\" [class.is-editing]=\"editing\">\r\n    <span *ngIf=\"movable\" class=\"glyphicon glyphicon-option-vertical action--movable\" aria-hidden=\"true\"></span>\r\n    <div class=\"action--item--wrap\" [class.pointer]=\"!editing && editable\" (click)=\"editAction()\">\r\n        <icon [name]=\"iconName\"></icon>\r\n        <div class=\"action--title\">{{ title }}</div>\r\n        <icon *ngIf=\"editable && macroAction && !editing\" name=\"pencil\"></icon>\r\n    </div>\r\n    <icon *ngIf=\"deletable\" name=\"trash\" (click)=\"deleteAction()\"></icon>\r\n</div>\r\n<div class=\"list-group-item macro-action-editor__container\"\r\n     [@toggler]=\"((editable && editing) || newItem) ? 'active' : 'inactive'\">\r\n  <macro-action-editor\r\n      [macroAction]=\"macroAction\"\r\n      (cancel)=\"cancelEdit()\"\r\n      (save)=\"saveEditedAction($event)\">\r\n  </macro-action-editor>\r\n</div>";

/***/ }),
/* 684 */
/***/ (function(module, exports) {

module.exports = "<div class=\"row list-container\">\r\n    <div class=\"col-xs-10 col-xs-offset-1 list-group\">\r\n        <div class=\"macro-actions-container\" [dragula]=\"'macroActions'\" [dragulaModel]=\"macro.macroActions\">\r\n            <macro-item *ngFor=\"let macroAction of macro.macroActions; let macroActionIndex = index\"\r\n                        [macroAction]=\"macroAction\"\r\n                        [editable]=\"true\"\r\n                        [deletable]=\"true\"\r\n                        [movable]=\"true\"\r\n                        (save)=\"saveAction($event, macroActionIndex)\"\r\n                        (edit)=\"editAction(macroActionIndex)\"\r\n                        (cancel)=\"cancelAction()\"\r\n                        (delete)=\"deleteAction(macroAction, macroActionIndex)\"\r\n                        [attr.data-index]=\"macroActionIndex\"\r\n            ></macro-item>\r\n\r\n            <macro-item *ngIf=\"showNew\"\r\n                        [@togglerNew]=\"showNew ? 'active' : 'inactive'\"\r\n                        [macroAction]=\"newMacro\"\r\n                        [editable]=\"true\"\r\n                        [deletable]=\"false\"\r\n                        [movable]=\"false\"\r\n                        (save)=\"addNewAction($event)\"\r\n                        (cancel)=\"hideNewAction()\"\r\n            ></macro-item>\r\n        </div>\r\n        <div class=\"list-group add-new__action-container\" [@toggler]=\"(!showNew) ? 'active' : 'inactive'\">\r\n            <div class=\"list-group-item action--item add-new__action-item no-reorder clearfix\">\r\n                <a class=\"add-new__action-item--link\" (click)=\"showNewAction()\">\r\n                    <i class=\"fa fa-plus\"></i> Add new macro action\r\n                </a>\r\n                <a class=\"add-new__action-item--link\">\r\n                    <i class=\"fa fa fa-circle\"></i> Add new capture keystroke\r\n                </a>\r\n            </div>\r\n        </div>\r\n    </div>\r\n</div>";

/***/ }),
/* 685 */
/***/ (function(module, exports) {

module.exports = "<div class=\"not-found\">\r\n    You don't have any macros. Try to add one!\r\n</div>";

/***/ }),
/* 686 */
/***/ (function(module, exports) {

module.exports = "<span class=\"text\">Keymap removed</span>\r\n<a href=\"#\" class=\"action action--undo\">Undo</a>\r\n<span class=\"dismiss\">&times;</span>";

/***/ }),
/* 687 */
/***/ (function(module, exports) {

module.exports = "<div class=\"popover\"\r\n     #popover\r\n     [@popover]=\"animationState\"\r\n     [ngClass]=\"{'leftArrow': leftArrow, 'rightArrow': rightArrow}\"\r\n     [style.top.px]=\"topPosition\"\r\n     [style.left.px]=\"leftPosition\"\r\n>\r\n    <div class=\"arrowCustom\"></div>\r\n    <div class=\"popover-title menu-tabs\">\r\n        <ul class=\"nav nav-tabs popover-menu\">\r\n            <li #keypress [class.active]=\"activeTab === tabName.Keypress\" (click)=\"selectTab(tabName.Keypress)\">\r\n                <a class=\"menu-tabs--item\">\r\n                    <i class=\"fa fa-keyboard-o\"></i>\r\n                    <span>Keypress</span>\r\n                </a>\r\n            </li>\r\n            <li #layer [class.active]=\"activeTab === tabName.Layer\" (click)=\"selectTab(tabName.Layer)\">\r\n                <a class=\"menu-tabs--item\">\r\n                    <i class=\"fa fa-clone\"></i>\r\n                    <span>Layer</span>\r\n                </a>\r\n            </li>\r\n            <li #mouse [class.active]=\"activeTab === tabName.Mouse\" (click)=\"selectTab(tabName.Mouse)\">\r\n                <a class=\"menu-tabs--item\">\r\n                    <i class=\"fa fa-mouse-pointer\"></i>\r\n                    <span>Mouse</span>\r\n                </a>\r\n            </li>\r\n            <li #macro [class.active]=\"activeTab === tabName.Macro\" (click)=\"selectTab(tabName.Macro)\">\r\n                <a class=\"menu-tabs--item\">\r\n                    <i class=\"fa fa-play\"></i>\r\n                    <span>Macro</span>\r\n                </a>\r\n            </li>\r\n            <li #keymap [class.active]=\"activeTab === tabName.Keymap\" (click)=\"selectTab(tabName.Keymap)\">\r\n                <a class=\"menu-tabs--item\">\r\n                    <i class=\"fa fa-keyboard-o\"></i>\r\n                    <span>Keymap</span>\r\n                </a>\r\n            </li>\r\n            <li #none [class.active]=\"activeTab === tabName.None\" (click)=\"selectTab(tabName.None)\">\r\n                <a class=\"menu-tabs--item\">\r\n                    <i class=\"fa fa-ban\"></i>\r\n                    <span>None</span>\r\n                </a>\r\n            </li>\r\n        </ul>\r\n    </div>\r\n    <div [ngSwitch]=\"activeTab\">\r\n        <keypress-tab #tab *ngSwitchCase=\"tabName.Keypress\" class=\"popover-content\"\r\n                      [defaultKeyAction]=\"defaultKeyAction\"\r\n                      [longPressEnabled]=\"true\"\r\n                      (validAction)=\"keyActionValid=$event\"\r\n        ></keypress-tab>\r\n        <layer-tab #tab *ngSwitchCase=\"tabName.Layer\" class=\"popover-content\"\r\n                   [defaultKeyAction]=\"defaultKeyAction\"\r\n                   [currentLayer]=\"currentLayer\"\r\n                   (validAction)=\"keyActionValid=$event\"\r\n        ></layer-tab>\r\n        <mouse-tab #tab *ngSwitchCase=\"tabName.Mouse\" class=\"popover-content\"\r\n                   [defaultKeyAction]=\"defaultKeyAction\"\r\n                   (validAction)=\"keyActionValid=$event\"\r\n        ></mouse-tab>\r\n        <macro-tab #tab *ngSwitchCase=\"tabName.Macro\" class=\"popover-content\"\r\n                   [defaultKeyAction]=\"defaultKeyAction\"\r\n                   (validAction)=\"keyActionValid=$event\"\r\n        ></macro-tab>\r\n        <keymap-tab #tab *ngSwitchCase=\"tabName.Keymap\" class=\"popover-content\"\r\n                    [defaultKeyAction]=\"defaultKeyAction\"\r\n                    [keymaps]=\"keymaps$ | async\"\r\n                    (validAction)=\"keyActionValid=$event\"\r\n        ></keymap-tab>\r\n        <none-tab #tab *ngSwitchCase=\"tabName.None\" class=\"popover-content\"\r\n                  (validAction)=\"keyActionValid=$event\"\r\n        ></none-tab>\r\n    </div>\r\n    <div class=\"popover-action\">\r\n        <button class=\"btn btn-sm btn-default\" type=\"button\" (click)=\"onCancelClick()\"> Cancel </button>\r\n        <button class=\"btn btn-sm btn-primary\" [class.disabled]=\"!keyActionValid\" type=\"button\" (click)=\"onRemapKey()\"> Remap Key </button>\r\n    </div>\r\n</div>\r\n<div class=\"popover-overlay\" [class.display]=\"visible\" (click)=\"onOverlay()\"></div>\r\n";

/***/ }),
/* 688 */
/***/ (function(module, exports) {

module.exports = "<template [ngIf]=\"keymapOptions.length === 0\">\r\n    <span> No keymaps are available to choose from. Create a keymap first! </span>\r\n</template>\r\n<template [ngIf]=\"keymapOptions.length > 0\">\r\n    <div>\r\n        <b>Switch to keymap:</b>\r\n        <select2\r\n                [data]=\"keymapOptions\"\r\n                [value]=\"selectedKeymap?.abbreviation || -1\"\r\n                (valueChanged)=\"onChange($event)\"\r\n                [width]=\"'100%'\"\r\n        ></select2>\r\n    </div>\r\n    <div>\r\n        <div class=\"empty\" *ngIf=\"!selectedKeymap?.abbreviation\">\r\n            <img src=\"./images/base-layer--blank.svg\">\r\n        </div>\r\n        <svg-keyboard *ngIf=\"selectedKeymap?.abbreviation\"\r\n                    [moduleConfig]=\"selectedKeymap.layers[0].modules\">\r\n        </svg-keyboard>\r\n    </div>\r\n</template>";

/***/ }),
/* 689 */
/***/ (function(module, exports) {

module.exports = "<div class=\"scancode-options\">\r\n    <b class=\"setting-label\">Scancode:</b>\r\n    <select2\r\n            [data]=\"scanCodeGroups\"\r\n            [value]=\"scanCode.toString()\"\r\n            (valueChanged)=\"onScancodeChange($event)\"\r\n            [width]=\"200\"\r\n            [options]=\"options\"\r\n    ></select2>\r\n    <capture-keystroke-button (capture)=\"onKeysCapture($event)\"></capture-keystroke-button>\r\n</div>\r\n<div class=\"modifier-options\">\r\n    <b class=\"setting-label\">Modifiers:</b>\r\n    <div class=\"btn-toolbar modifiers\">\r\n        <div class=\"btn-group btn-group-sm modifiers__left\">\r\n            <button type=\"button\" class=\"btn btn-default\"\r\n                    *ngFor=\"let modifier of leftModifiers; let index = index\"\r\n                    [class.btn-primary]=\"leftModifierSelects[index]\"\r\n                    (click)=\"toggleModifier(false, index)\"\r\n            >\r\n                {{modifier}}\r\n            </button>\r\n        </div>\r\n        <div class=\"btn-group btn-group-sm modifiers__right\">\r\n            <button type=\"button\" class=\"btn btn-default\"\r\n                    *ngFor=\"let modifier of rightModifiers; let index = index\"\r\n                    [class.btn-primary]=\"rightModifierSelects[index]\"\r\n                    (click)=\"toggleModifier(true, index)\"\r\n            >\r\n                {{modifier}}\r\n            </button>\r\n        </div>\r\n    </div>\r\n</div>\r\n<div class=\"long-press-container\" *ngIf=\"longPressEnabled\">\r\n    <b class=\"setting-label\">Long press action:</b>\r\n    <select2 #longPressSelect\r\n             [data]=\"longPressGroups\"\r\n             [value]=\"selectedLongPressIndex.toString()\"\r\n             (valueChanged)=\"onLongpressChange($event)\"\r\n             [width]=\"140\"\r\n    ></select2>\r\n    <icon name=\"question-circle\" title=\"This action happens when the key is being held along with another key.\"></icon>\r\n</div>\r\n\r\n<div class=\"disabled-state--text\">\r\n    <i class=\"fa fa-info-circle\"></i>\r\n    When a key is configured as layer switcher key, you can't assign other functions to it.\r\n    To assign a scancode to the key, set the <em>Layer action</em> to <em>None</em>.\r\n</div>";

/***/ }),
/* 690 */
/***/ (function(module, exports) {

module.exports = "<template [ngIf]=\"!isNotBase\">\r\n    <select (change)=\"toggleChanged($event.target.value)\">\r\n        <option *ngFor=\"let item of toggleData\" [value]=\"item.id\" [selected]=\"toggle === item.id\">\r\n            {{ item.text }}\r\n        </option>\r\n    </select>\r\n    <span>the</span>\r\n    <select (change)=\"layerChanged($event.target.value)\">\r\n        <option *ngFor=\"let item of layerData\" [value]=\"item.id\" [selected]=\"layer === item.id\">\r\n            {{ item.text }}\r\n        </option>\r\n    </select>\r\n    <span [ngSwitch]=\"toggle\">\r\n        <template [ngSwitchCase]=\"true\">layer by pressing this key.</template>\r\n        <template ngSwitchDefault>layer by holding this key.</template>\r\n    </span>\r\n</template>\r\n<template [ngIf]=\"isNotBase\">\r\n    <span> Layer switching is only possible from the base layer. </span>\r\n</template>";

/***/ }),
/* 691 */
/***/ (function(module, exports) {

module.exports = "<template [ngIf]=\"macroOptions.length === 0\">\r\n    <span> No macros are available to choose from. Create a macro first! </span>\r\n</template>\r\n<template [ngIf]=\"macroOptions.length > 0\">\r\n    <div class=\"macro-selector\">\r\n        <b> Play macro: </b>\r\n        <select2 [data]=\"macroOptions\" [value]=\"macroOptions[selectedMacroIndex].id\" (valueChanged)=\"onChange($event)\" [width]=\"'100%'\"></select2>\r\n    </div>\r\n    <div class=\"macro-action-container\">\r\n        <div class=\"list-group\">\r\n            <macro-item *ngFor=\"let macroAction of macros[selectedMacroIndex].macroActions\"\r\n                        [macroAction]=\"macroAction\" [editable]=\"false\">\r\n            </macro-item>\r\n        </div>\r\n    </div>\r\n</template>";

/***/ }),
/* 692 */
/***/ (function(module, exports) {

module.exports = "<div class=\"mouse-action col-sm-4\">\r\n    <ul class=\"nav nav-pills nav-stacked\">\r\n        <li *ngFor=\"let page of pages; let i = index\" [class.active]=\"selectedPageIndex === i\" (click)=\"changePage(i)\">\r\n            <a> {{ page }}</a>\r\n        </li>\r\n    </ul>\r\n</div>\r\n<div class=\"details col-sm-8\" [ngSwitch]=\"selectedPageIndex\">\r\n    <div *ngSwitchCase=\"0\" class=\"mouse__config mouse__config--move text-center\">\r\n        <div class=\"row\">\r\n            <button type=\"button\" class=\"btn btn-default btn-lg\"\r\n                    [class.btn-primary]=\"mouseActionParam === MouseActionParam.moveUp\"\r\n                    (click)=\"setMouseActionParam(MouseActionParam.moveUp)\">\r\n                <i class=\"fa fa-arrow-up\"></i>\r\n            </button>\r\n        </div>\r\n        <div class=\"row\">\r\n            <button type=\"button\" class=\"btn btn-default btn-lg\"\r\n                    [class.btn-primary]=\"mouseActionParam === MouseActionParam.moveLeft\"\r\n                    (click)=\"setMouseActionParam(MouseActionParam.moveLeft)\">\r\n                <i class=\"fa fa-arrow-left\"></i>\r\n            </button>\r\n            <button type=\"button\" class=\"btn btn-default btn-lg btn-placeholder\">\r\n                <i class=\"fa fa-square\"></i>\r\n            </button>\r\n            <button type=\"button\" class=\"btn btn-default btn-lg\"\r\n                    [class.btn-primary]=\"mouseActionParam === MouseActionParam.moveRight\"\r\n                    (click)=\"setMouseActionParam(MouseActionParam.moveRight)\">\r\n                <i class=\"fa fa-arrow-right\"></i>\r\n            </button>\r\n        </div>\r\n        <div class=\"row\">\r\n            <button type=\"button\" class=\"btn btn-default btn-lg\"\r\n                    [class.btn-primary]=\"mouseActionParam === MouseActionParam.moveDown\"\r\n                    (click)=\"setMouseActionParam(MouseActionParam.moveDown)\">\r\n                <i class=\"fa fa-arrow-down\"></i>\r\n            </button>\r\n        </div>\r\n    </div>\r\n    <div *ngSwitchCase=\"1\" class=\"mouse__config mouse__config--scroll text-center\">\r\n        <div class=\"row\">\r\n            <button type=\"button\" class=\"btn btn-default btn-lg\"\r\n                    [class.btn-primary]=\"mouseActionParam === MouseActionParam.scrollUp\"\r\n                    (click)=\"setMouseActionParam(MouseActionParam.scrollUp)\">\r\n                <i class=\"fa fa-angle-double-up\"></i>\r\n            </button>\r\n        </div>\r\n        <div class=\"row\">\r\n            <button type=\"button\" class=\"btn btn-default btn-lg\"\r\n                    [class.btn-primary]=\"mouseActionParam === MouseActionParam.scrollLeft\"\r\n                    (click)=\"setMouseActionParam(MouseActionParam.scrollLeft)\">\r\n                <i class=\"fa fa-angle-double-left\"></i>\r\n            </button>\r\n            <button type=\"button\" class=\"btn btn-default btn-lg btn-placeholder\">\r\n                <i class=\"fa fa-square\"></i>\r\n            </button>\r\n            <button type=\"button\" class=\"btn btn-default btn-lg\"\r\n                [class.btn-primary]=\"mouseActionParam === MouseActionParam.scrollRight\"\r\n                (click)=\"setMouseActionParam(MouseActionParam.scrollRight)\">\r\n                <i class=\"fa fa-angle-double-right\"></i>\r\n            </button>\r\n        </div>\r\n        <div class=\"row\">\r\n            <button type=\"button\" class=\"btn btn-default btn-lg\"\r\n                [class.btn-primary]=\"mouseActionParam === MouseActionParam.scrollDown\"\r\n                (click)=\"setMouseActionParam(MouseActionParam.scrollDown)\">\r\n                <i class=\"fa fa-angle-double-down\"></i>\r\n            </button>\r\n        </div>\r\n    </div>\r\n    <div *ngSwitchCase=\"2\" class=\"mouse__config mouse__config--click\">\r\n        <div class=\"btn-group col-xs-12\" role=\"group\">\r\n            <button type=\"button\" class=\"btn btn-default col-xs-4\"\r\n                    [class.btn-primary]=\"mouseActionParam === MouseActionParam.leftClick\"\r\n                    (click)=\"setMouseActionParam(MouseActionParam.leftClick)\">Left</button>\r\n            <button type=\"button\" class=\"btn btn-default col-xs-4\"\r\n                    [class.btn-primary]=\"mouseActionParam === MouseActionParam.middleClick\"\r\n                    (click)=\"setMouseActionParam(MouseActionParam.middleClick)\">Middle</button>\r\n            <button type=\"button\" class=\"btn btn-default col-xs-4\"\r\n                    [class.btn-primary]=\"mouseActionParam === MouseActionParam.rightClick\"\r\n                    (click)=\"setMouseActionParam(MouseActionParam.rightClick)\">Right</button>\r\n        </div>\r\n    </div>\r\n    <div *ngSwitchCase=\"3\" class=\"mouse__config mouse__config--speed text-center\">\r\n        <div class=\"help-text--mouse-speed text-left\">\r\n            <p>Press this key along with mouse movement/scrolling to accelerate/decelerate the speed of the action.</p>\r\n        </div>\r\n        <div class=\"btn-group btn-group-lg\" role=\"group\">\r\n            <button class=\"btn btn-default\"\r\n                [class.btn-primary]=\"mouseActionParam === MouseActionParam.decelerate\"\r\n                (click)=\"setMouseActionParam(MouseActionParam.decelerate)\"\r\n            >\r\n                -\r\n                <span>Decelerate</span>\r\n            </button>\r\n            <button class=\"btn btn-default\"\r\n                [class.btn-primary]=\"mouseActionParam === MouseActionParam.accelerate\"\r\n                (click)=\"setMouseActionParam(MouseActionParam.accelerate)\"\r\n            >\r\n                +\r\n                <span>Accelerate</span>\r\n            </button>\r\n        </div>\r\n        <div class=\"help-text--mouse-speed last-help  text-left\">\r\n            <p>You can set the multiplier in the <a [routerLink]=\"['/settings']\" title=\"Settings\">settings</a>.</p>\r\n        </div>\r\n    </div>\r\n    <div *ngSwitchDefault>\r\n    </div>\r\n</div>";

/***/ }),
/* 693 */
/***/ (function(module, exports) {

module.exports = "This key is unassigned and has no functionality.";

/***/ }),
/* 694 */
/***/ (function(module, exports) {

module.exports = "<button type=\"button\" class=\"btn btn-sm btn--capture-keystroke\"\r\n            [ngClass]=\"{'btn-default': !record, 'btn-info': record}\"\r\n            (click)=\"start()\"\r\n>\r\n    <i class=\"fa fa-circle\"></i>\r\n    <template [ngIf]=\"!record\">\r\n        Capture keystroke\r\n    </template>\r\n    <template [ngIf]=\"record\">\r\n        Capturing ...\r\n    </template>\r\n </button>";

/***/ }),
/* 695 */
/***/ (function(module, exports) {

module.exports = "<div [ngSwitch]=\"name\">\r\n    <span *ngSwitchCase=\"'option-vertical'\" class=\"glyphicon glyphicon-option-vertical\" aria-hidden=\"true\"></span>\r\n    <i *ngSwitchCase=\"'square'\" class=\"fa fa-square\"></i>\r\n    <i *ngSwitchCase=\"'hand-pointer'\" class=\"fa fa-hand-pointer-o\"></i>\r\n    <i *ngSwitchCase=\"'hand-rock'\" class=\"fa fa-hand-rock-o\"></i>\r\n    <i *ngSwitchCase=\"'hand-paper'\" class=\"fa fa-hand-paper-o\"></i>\r\n    <i *ngSwitchCase=\"'mouse-pointer'\" class=\"fa fa-mouse-pointer\"></i>\r\n    <i *ngSwitchCase=\"'clock'\" class=\"fa fa-clock-o\"></i>\r\n    <i *ngSwitchCase=\"'font'\" class=\"fa fa-font\"></i>\r\n    <i *ngSwitchCase=\"'trash'\" class=\"glyphicon glyphicon-trash action--trash\"></i>\r\n    <i *ngSwitchCase=\"'pencil'\" class=\"glyphicon glyphicon-pencil action--edit\"></i>\r\n    <i *ngSwitchCase=\"'question-circle'\" class =\"fa fa-question-circle\"></i>\r\n</div>";

/***/ }),
/* 696 */
/***/ (function(module, exports) {

module.exports = "<div class=\"row\">\r\n    <h1 class=\"col-xs-12 pane-title\">\r\n        <i class=\"fa fa-gear\"></i>\r\n        <span class=\"macro__name pane-title__name\">Settings</span>\r\n    </h1>\r\n</div>\r\nTo be done...";

/***/ }),
/* 697 */
/***/ (function(module, exports) {

module.exports = "<ul class=\"menu--top\">\r\n    <li class=\"sidebar__level-1--item\">\r\n        <div class=\"sidebar__level-1\">\r\n            <i class=\"fa fa-keyboard-o\"></i> Keymaps\r\n            <a [routerLink]=\"['/keymap/add']\" class=\"btn btn-default pull-right btn-sm\">\r\n                <i class=\"fa fa-plus\"></i>\r\n            </a>\r\n            <i class=\"fa fa-chevron-up pull-right\" (click)=\"toggleHide($event, 'keymap')\"></i>\r\n        </div>\r\n        <ul [@toggler]=\"animation.keymap\">\r\n            <li *ngFor=\"let keymap of keymaps$ | async\" class=\"sidebar__level-2--item\">\r\n                <div class=\"sidebar__level-2\" [routerLinkActive]=\"['active']\">\r\n                    <a [routerLink]=\"['/keymap', keymap.abbreviation]\">{{keymap.name}}</a>\r\n                    <i *ngIf=\"keymap.isDefault\" class=\"fa fa-star sidebar__fav\" title=\"This is the default keymap which gets activated when powering the keyboard.\"></i>\r\n                </div>\r\n            </li>\r\n        </ul>\r\n    </li>\r\n    <li class=\"sidebar__level-1--item\">\r\n        <div class=\"sidebar__level-1\">\r\n            <i class=\"fa fa-play\"></i> Macros\r\n            <a (click)=\"addMacro()\" class=\"btn btn-default pull-right btn-sm\">\r\n                <i class=\"fa fa-plus\"></i>\r\n            </a>\r\n            <i class=\"fa fa-chevron-up pull-right\" (click)=\"toggleHide($event, 'macro')\"></i>\r\n        </div>\r\n        <ul [@toggler]=\"animation.macro\">\r\n            <li *ngFor=\"let macro of macros$ | async\" class=\"sidebar__level-2--item\">\r\n                <div class=\"sidebar__level-2\" [routerLinkActive]=\"['active']\">\r\n                    <a [routerLink]=\"['/macro', macro.id]\">{{macro.name}}</a>\r\n                </div>\r\n            </li>\r\n        </ul>\r\n    </li>\r\n    <li class=\"sidebar__level-1--item\">\r\n        <div class=\"sidebar__level-1\">\r\n            <i class=\"fa fa-puzzle-piece\"></i> Add-on modules\r\n            <i class=\"fa fa-chevron-up pull-right\" (click)=\"toggleHide($event, 'addon')\"></i>\r\n        </div>\r\n        <ul [@toggler]=\"animation.addon\">\r\n            <li class=\"sidebar__level-2--item\" data-name=\"Key cluster\" data-abbrev=\"\">\r\n                <div class=\"sidebar__level-2\" [routerLinkActive]=\"['active']\">\r\n                    <a [routerLink]=\"['/add-on', 'Key cluster']\">Key cluster</a>\r\n                </div>\r\n            </li>\r\n            <li class=\"sidebar__level-2--item\" data-name=\"Trackball\" data-abbrev=\"\">\r\n                <div class=\"sidebar__level-2\" [routerLinkActive]=\"['active']\">\r\n                    <a [routerLink]=\"['/add-on', 'Trackball']\">Trackball</a>\r\n                </div>\r\n            </li>\r\n            <li class=\"sidebar__level-2--item\" data-name=\"Toucpad\" data-abbrev=\"\">\r\n                <div class=\"sidebar__level-2\" [routerLinkActive]=\"['active']\">\r\n                    <a [routerLink]=\"['/add-on', 'Touchpad']\">Touchpad</a>\r\n                </div>\r\n            </li>\r\n            <li class=\"sidebar__level-2--item\" data-name=\"Trackpoint\" data-abbrev=\"\">\r\n                <div class=\"sidebar__level-2\" [routerLinkActive]=\"['active']\">\r\n                    <a [routerLink]=\"['/add-on', 'Trackpoint']\">Trackpoint</a>\r\n                </div>\r\n            </li>\r\n        </ul>\r\n    </li>\r\n</ul>\r\n<ul class=\"menu--bottom\">\r\n    <li class=\"sidebar__level-1--item\" [routerLinkActive]=\"['active']\">\r\n        <a class=\"sidebar__level-1\" [routerLink]=\"['/settings']\">\r\n            <i class=\"fa fa-gear\"></i> Settings\r\n        </a>\r\n    </li>\r\n</ul>";

/***/ }),
/* 698 */
/***/ (function(module, exports) {

module.exports = "<svg xmlns=\"http://www.w3.org/2000/svg\" [attr.viewBox]=\"svgAttributes.viewBox\" height=\"100%\" width=\"100%\">\r\n    <svg:g [attr.transform]=\"svgAttributes.transform\" [attr.fill]=\"svgAttributes.fill\">\r\n        <svg:g svg-module *ngFor=\"let module of modules; let i = index\"\r\n                [coverages]=\"module.coverages\"\r\n                [keyboardKeys]=\"module.keyboardKeys\"\r\n                [keybindAnimationEnabled]=\"keybindAnimationEnabled\"\r\n                [capturingEnabled]=\"capturingEnabled\"\r\n                [attr.transform]=\"module.attributes.transform\"\r\n                [keyActions]=\"moduleConfig[i].keyActions\"\r\n                (keyClick)=\"onKeyClick(i, $event.index, $event.keyTarget)\"\r\n                (keyHover)=\"onKeyHover($event.index, $event.event, $event.over, i)\"\r\n                (capture)=\"onCapture(i, $event.index, $event.captured)\"\r\n        />\r\n    </svg:g>\r\n</svg>";

/***/ }),
/* 699 */
/***/ (function(module, exports) {

module.exports = "<svg:use [attr.xlink:href]=\"icon\"\r\n        [attr.width]=\"useWidth\"\r\n        [attr.height]=\"useHeight\"\r\n        [attr.x]=\"useX\"\r\n        [attr.y]=\"useY\">\r\n</svg:use>\r\n<svg:text\r\n    [attr.x]=\"0\"\r\n    [attr.y]=\"textY\"\r\n    [attr.text-anchor]=\"'middle'\"\r\n    [attr.font-size]=\"11\">\r\n        <tspan [attr.x]=\"spanX\">{{ text }}</tspan>\r\n</svg:text>";

/***/ }),
/* 700 */
/***/ (function(module, exports) {

module.exports = "<svg:rect [@change]=\"changeAnimation\"\r\n          (@change.done)=\"onChangeAnimationDone()\"\r\n          [id]=\"id\" [attr.rx]=\"rx\"          [attr.ry]=\"ry\"\r\n                    [attr.height]=\"height\"  [attr.width]=\"width\"\r\n                    [attr.fill]=\"fill\"\r\n/>\r\n<template [ngIf]=\"recording\">\r\n    <svg:circle\r\n            [@recording]=\"recordAnimation\"\r\n            (@recording.done)=\"onRecordingAnimationDone()\"\r\n            [attr.cx]=\"(width / 2)\"\r\n            [attr.cy]=\"(height / 2)\"\r\n            [attr.r]=\"10\"\r\n            [attr.fill]=\"'#c00'\"\r\n    ></svg:circle>\r\n</template>\r\n<template [ngIf]=\"!recording\">\r\n    <svg:g [ngSwitch]=\"labelType\"\r\n           [attr.font-size]=\"19\"\r\n           [attr.font-family]=\"'Helvetica'\"\r\n           [attr.fill]=\"'white'\">\r\n        <svg:g svg-keystroke-key *ngSwitchCase=\"enumLabelTypes.KeystrokeKey\"\r\n               [height]=\"height\"\r\n               [width]=\"width\"\r\n               [keystrokeAction]=\"labelSource\">\r\n        </svg:g>\r\n        <svg:g svg-one-line-text-key *ngSwitchCase=\"enumLabelTypes.OneLineText\"\r\n               [height]=\"height\"\r\n               [width]=\"width\"\r\n               [text]=\"labelSource\">\r\n        </svg:g>\r\n        <svg:g svg-two-line-text-key *ngSwitchCase=\"enumLabelTypes.TwoLineText\"\r\n               [height]=\"height\"\r\n               [width]=\"width\"\r\n               [texts]=\"labelSource\">\r\n        </svg:g>\r\n        <svg:g svg-text-icon-key *ngSwitchCase=\"enumLabelTypes.TextIcon\"\r\n               [height]=\"height\"\r\n               [width]=\"width\"\r\n               [text]=\"labelSource.text\"\r\n               [icon]=\"labelSource.icon\">\r\n        </svg:g>\r\n        <svg:g svg-icon-text-key *ngSwitchCase=\"enumLabelTypes.IconText\"\r\n               [height]=\"height\"\r\n               [width]=\"width\"\r\n               [icon]=\"labelSource.icon\"\r\n               [text]=\"labelSource.text\">\r\n        </svg:g>\r\n        <svg:g svg-single-icon-key *ngSwitchCase=\"enumLabelTypes.SingleIcon\"\r\n               [height]=\"height\"\r\n               [width]=\"width\"\r\n               [icon]=\"labelSource\">\r\n        </svg:g>\r\n        <svg:g svg-switch-keymap-key *ngSwitchCase=\"enumLabelTypes.SwitchKeymap\"\r\n               [height]=\"height\"\r\n               [width]=\"width\"\r\n               [abbreviation]=\"labelSource\">\r\n        </svg:g>\r\n        <svg *ngSwitchCase=\"enumLabelTypes.MouseKey\" [attr.viewBox]=\"'0 0 100 100'\"\r\n             [attr.width]=\"width\"\r\n             [attr.height]=\"height\">\r\n            <svg:g svg-mouse-key [mouseAction]=\"labelSource\"></svg:g>\r\n        </svg>\r\n    </svg:g>\r\n</template>\r\n";

/***/ }),
/* 701 */
/***/ (function(module, exports) {

module.exports = "<svg [attr.viewBox]=\"viewBox\" [attr.width]=\"textContainer.width\" [attr.height]=\"textContainer.height\"\r\n    [attr.x]=\"textContainer.x\" [attr.y]=\"textContainer.y\" [ngSwitch]=\"labelType\">\r\n    <svg:g svg-one-line-text-key *ngSwitchCase=\"'one-line'\"\r\n            [height]=\"height\"\r\n            [width]=\"width\"\r\n            [text]=\"labelSource\">\r\n    </svg:g>\r\n    <svg:g svg-two-line-text-key *ngSwitchCase=\"'two-line'\"\r\n            [height]=\"height\"\r\n            [width]=\"width\"\r\n            [texts]=\"labelSource\">\r\n    </svg:g>\r\n</svg>\r\n<svg [attr.viewBox]=\"viewBox\" [attr.width]=\"modifierContainer.width\" [attr.height]=\"modifierContainer.height\" [attr.x]=\"modifierContainer.x\"\r\n    [attr.y]=\"modifierContainer.y\" preserveAspectRatio=\"none\">\r\n    <svg viewBox=\"0 0 100 100\" [attr.width]=\"shift.width\" [attr.height]=\"shift.height\" [attr.x]=\"shift.x\" [attr.y]=\"shift.y\"\r\n        preserveAspectRatio=\"none\" [class.disabled]=\"shift.disabled\">\r\n        <svg:use [attr.xlink:href]=\"modifierIconNames.shift\" />\r\n    </svg>\r\n    <svg viewBox=\"0 0 100 100\" [attr.width]=\"control.width\" [attr.height]=\"control.height\" [attr.x]=\"control.x\" [attr.y]=\"control.y\"\r\n        preserveAspectRatio=\"none\" [class.disabled]=\"control.disabled\">\r\n        <svg:text [attr.text-anchor]=\"'middle'\" [attr.x]=\"50\" [attr.y]=\"50\">C</svg:text>\r\n    </svg>\r\n    <svg viewBox=\"0 0 100 100\" [attr.width]=\"option.width\" [attr.height]=\"option.height\" [attr.x]=\"option.x\" [attr.y]=\"option.y\"\r\n        preserveAspectRatio=\"none\" [class.disabled]=\"option.disabled\">\r\n        <svg:use [attr.xlink:href]=\"modifierIconNames.option\" />\r\n    </svg>\r\n    <svg viewBox=\"0 0 100 100\" [attr.width]=\"command.width\" [attr.height]=\"command.height\" [attr.x]=\"command.x\" [attr.y]=\"command.y\"\r\n        preserveAspectRatio=\"none\" [class.disabled]=\"command.disabled\">\r\n        <svg:use [attr.xlink:href]=\"modifierIconNames.command\" />\r\n    </svg>\r\n</svg>";

/***/ }),
/* 702 */
/***/ (function(module, exports) {

module.exports = "<svg:use [attr.xlink:href]=\"icon\" width=\"20\" height=\"20\" x=\"10\" y=\"25\">\r\n</svg:use>\r\n<svg:text\r\n    [attr.x]=\"60\"\r\n    [attr.y]=\"0\"\r\n    [attr.text-anchor]=\"'middle'\"\r\n    [attr.font-size]=\"25\">\r\n        <tspan dy=\"34\"> Click </tspan>\r\n</svg:text>\r\n<svg:text\r\n    [attr.x]=\"50\"\r\n    [attr.y]=\"0\"\r\n    [attr.text-anchor]=\"'middle'\"\r\n    [attr.font-size]=\"25\">\r\n        <tspan dy=\"70\"> {{ button }} </tspan>\r\n</svg:text>";

/***/ }),
/* 703 */
/***/ (function(module, exports) {

module.exports = "<svg:g [ngSwitch]=\"type\">\r\n        <svg:g *ngSwitchCase=\"'click'\" svg-mouse-click-key [button]=\"param\"></svg:g>\r\n        <svg:g *ngSwitchCase=\"'move'\" svg-mouse-move-key [direction]=\"param\"></svg:g>\r\n        <svg:g *ngSwitchCase=\"'scroll'\" svg-mouse-scroll-key [direction]=\"param\"></svg:g>\r\n        <svg:g *ngSwitchCase=\"'speed'\" svg-mouse-speed-key [plus]=\"param\"></svg:g>\r\n</svg:g>";

/***/ }),
/* 704 */
/***/ (function(module, exports) {

module.exports = "<svg:use [attr.xlink:href]=\"mouseIcon\" width=\"20\" height=\"20\" x=\"8\" y=\"25\"></svg:use>\r\n<svg:text\r\n    [attr.x]=\"60\"\r\n    [attr.y]=\"0\"\r\n    [attr.text-anchor]=\"'middle'\"\r\n    [attr.font-size]=\"24\">\r\n        <tspan dy=\"34\"> Move </tspan>\r\n</svg:text>\r\n<svg:use [attr.xlink:href]=\"directionIcon\" width=\"30\" height=\"30\" x=\"35\" y=\"55\"></svg:use>";

/***/ }),
/* 705 */
/***/ (function(module, exports) {

module.exports = "<svg:use [attr.xlink:href]=\"mouseIcon\" width=\"20\" height=\"20\" x=\"8\" y=\"25\"></svg:use>\r\n<svg:text\r\n    [attr.x]=\"60\"\r\n    [attr.y]=\"0\"\r\n    [attr.text-anchor]=\"'middle'\"\r\n    [attr.font-size]=\"24\">\r\n        <tspan dy=\"34\"> Scroll </tspan>\r\n</svg:text>\r\n<svg:use [attr.xlink:href]=\"directionIcon\" width=\"30\" height=\"30\" x=\"35\" y=\"55\"></svg:use>";

/***/ }),
/* 706 */
/***/ (function(module, exports) {

module.exports = "<svg:use [attr.xlink:href]=\"icon\" width=\"20\" height=\"20\" x=\"4\" y=\"25\">\r\n</svg:use>\r\n<svg:text\r\n    [attr.x]=\"60\"\r\n    [attr.y]=\"0\"\r\n    [attr.text-anchor]=\"'middle'\"\r\n    [attr.font-size]=\"25\">\r\n        <tspan dy=\"34\"> Speed </tspan>\r\n</svg:text>\r\n<svg:text\r\n    [attr.x]=\"50\"\r\n    [attr.y]=\"0\"\r\n    [attr.text-anchor]=\"'middle'\"\r\n    [attr.font-size]=\"30\">\r\n        <tspan dy=\"70\"> {{ sign }} </tspan>\r\n</svg:text>";

/***/ }),
/* 707 */
/***/ (function(module, exports) {

module.exports = " <svg:text\r\n    [attr.x]=\"0\"\r\n    [attr.y]=\"textY\"\r\n    [attr.text-anchor]=\"'middle'\">\r\n        <tspan [attr.x]=\"spanX\" dy=\"0\">{{ text }}</tspan>\r\n </svg:text>";

/***/ }),
/* 708 */
/***/ (function(module, exports) {

module.exports = "<svg:use [attr.xlink:href]=\"icon\"\r\n    [attr.width]=\"svgWidth\" [attr.height]=\"svgHeight\"\r\n    [attr.x]=\"svgWidth\" [attr.y]=\"svgHeight\">\r\n</svg:use>";

/***/ }),
/* 709 */
/***/ (function(module, exports) {

module.exports = "<svg:use [attr.xlink:href]=\"icon\"\r\n        [attr.width]=\"useWidth\"\r\n        [attr.height]=\"useHeight\"\r\n        [attr.x]=\"useX\"\r\n        [attr.y]=\"useY\">\r\n</svg:use>\r\n<svg:text\r\n    [attr.x]=\"0\"\r\n    [attr.y]=\"textY\"\r\n    [attr.text-anchor]=\"'middle'\">\r\n        <tspan [attr.x]=\"spanX\">{{ abbreviation }}</tspan>\r\n</svg:text>";

/***/ }),
/* 710 */
/***/ (function(module, exports) {

module.exports = " <svg:text\r\n    [attr.x]=\"0\"\r\n    [attr.y]=\"textY\"\r\n    [attr.text-anchor]=\"textAnchor\">\r\n        <tspan [attr.x]=\"spanX\">{{ text }}</tspan>\r\n </svg:text>\r\n<svg:use [attr.xlink:href]=\"icon\"\r\n        [attr.width]=\"useWidth\"\r\n        [attr.height]=\"useHeight\"\r\n        [attr.x]=\"useX\"\r\n        [attr.y]=\"useY\">\r\n</svg:use>";

/***/ }),
/* 711 */
/***/ (function(module, exports) {

module.exports = "<svg:text\r\n    [attr.x]=\"0\"\r\n    [attr.y]=\"textY\"\r\n    [attr.text-anchor]=\"'middle'\">\r\n         <tspan\r\n                *ngFor=\"let text of texts; let index = index\"\r\n                [attr.x]=\"spanX\"\r\n                [attr.y]=\"spanYs[index]\"\r\n                dy=\"0\"\r\n                >{{ text }}</tspan>\r\n </svg:text>";

/***/ }),
/* 712 */
/***/ (function(module, exports) {

module.exports = "<svg:path *ngFor=\"let path of coverages\" [attr.d]=\"path.$.d\" />\r\n<svg:g svg-keyboard-key *ngFor=\"let key of keyboardKeys; let i = index\"\r\n        [id]=\"key.id\"\r\n        [rx]=\"key.rx\" [ry]=\"key.ry\"\r\n        [width]=\"key.width\" [height]=\"key.height\"\r\n        [attr.transform]=\"'translate(' + key.x + ' ' + key.y + ')'\"\r\n        [keyAction]=\"keyActions[i]\"\r\n        [keybindAnimationEnabled]=\"keybindAnimationEnabled\"\r\n        [capturingEnabled]=\"capturingEnabled\"\r\n        (keyClick)=\"onKeyClick(i, $event)\"\r\n        (capture)=\"onCapture(i, $event)\"\r\n        (mouseenter)=\"onKeyHover(i, $event, true)\"\r\n        (mouseleave)=\"onKeyHover(i, $event, false)\"\r\n/>";

/***/ }),
/* 713 */
/***/ (function(module, exports) {

module.exports = "<template ngIf=\"layers\">\r\n    <layers [class.disabled]=\"popoverShown\" (select)=\"selectLayer($event.index)\" [current]=\"currentLayer\"></layers>\r\n    <keyboard-slider [layers]=\"layers\"\r\n                     [currentLayer]=\"currentLayer\"\r\n                     [keybindAnimationEnabled]=\"keybindAnimationEnabled\"\r\n                     [capturingEnabled]=\"popoverEnabled\"\r\n                     (keyClick)=\"onKeyClick($event.moduleId, $event.keyId, $event.keyTarget)\"\r\n                     (keyHover)=\"onKeyHover($event.moduleId, $event.event, $event.over, $event.keyId)\"\r\n                     (capture)=\"onCapture($event.moduleId, $event.keyId, $event.captured)\"\r\n    ></keyboard-slider>\r\n    <popover tabindex=\"0\" [visible]=\"popoverShown\" [keyPosition]=\"keyPosition\" [wrapPosition]=\"wrapPosition\" [defaultKeyAction]=\"popoverInitKeyAction\"\r\n             [currentKeymap]=\"keymap\" [currentLayer]=\"currentLayer\" (cancel)=\"hidePopover()\" (remap)=\"onRemap($event)\"></popover>\r\n    <div class=\"tooltip bottom\"\r\n         [class.in]=\"tooltipData.show\"\r\n         [style.top.px]=\"tooltipData.posTop\"\r\n         [style.left.px]=\"tooltipData.posLeft\"\r\n    >\r\n        <div class=\"tooltip-arrow\"></div>\r\n        <div class=\"tooltip-inner\">\r\n            <p *ngFor=\"let item of tooltipData.content | async\">\r\n                {{ item.name }}: {{ item.value }}\r\n            </p>\r\n        </div>\r\n    </div>\r\n</template>";

/***/ }),
/* 714 */
/***/ (function(module, exports) {

module.exports = "<notification></notification>\r\n<side-menu></side-menu>\r\n<div id=\"main-content\" class=\"split split-horizontal main-content\">\r\n    <router-outlet></router-outlet>\r\n</div>\r\n<div class=\"github-fork-ribbon\">\r\n    <a class=\"\" href=\"https://github.com/UltimateHackingKeyboard/agent\" title=\"Fork me on GitHub\">Fork me on GitHub</a>\r\n</div>\r\n<ngrx-store-log-monitor toggleCommand=\"alt-t\"></ngrx-store-log-monitor>\r\n";

/***/ }),
/* 715 */,
/* 716 */,
/* 717 */
/***/ (function(module, exports) {

module.exports = [
	{
		"id": "-1",
		"text": "None"
	},
	{
		"text": "Modifiers",
		"children": [
			{
				"id": "0",
				"text": "LShift"
			},
			{
				"id": "1",
				"text": "LCtrl"
			},
			{
				"id": "2",
				"text": "LSuper"
			},
			{
				"id": "3",
				"text": "LAlt"
			},
			{
				"id": "4",
				"text": "RShift"
			},
			{
				"id": "5",
				"text": "RCtrl"
			},
			{
				"id": "6",
				"text": "RSuper"
			},
			{
				"id": "7",
				"text": "RAlt"
			}
		]
	},
	{
		"text": "Layer switcher",
		"children": [
			{
				"id": "8",
				"text": "Mod"
			},
			{
				"id": "9",
				"text": "Mouse"
			},
			{
				"id": "10",
				"text": "Fn"
			}
		]
	}
];

/***/ }),
/* 718 */
/***/ (function(module, exports) {

module.exports = [
	{
		"text": "Alphabet",
		"children": [
			{
				"id": "4",
				"text": "A"
			},
			{
				"id": "5",
				"text": "B"
			},
			{
				"id": "6",
				"text": "C"
			},
			{
				"id": "7",
				"text": "D"
			},
			{
				"id": "8",
				"text": "E"
			},
			{
				"id": "9",
				"text": "F"
			},
			{
				"id": "10",
				"text": "G"
			},
			{
				"id": "11",
				"text": "H"
			},
			{
				"id": "12",
				"text": "I"
			},
			{
				"id": "13",
				"text": "J"
			},
			{
				"id": "14",
				"text": "K"
			},
			{
				"id": "15",
				"text": "L"
			},
			{
				"id": "16",
				"text": "M"
			},
			{
				"id": "17",
				"text": "N"
			},
			{
				"id": "18",
				"text": "O"
			},
			{
				"id": "19",
				"text": "P"
			},
			{
				"id": "20",
				"text": "Q"
			},
			{
				"id": "21",
				"text": "R"
			},
			{
				"id": "22",
				"text": "S"
			},
			{
				"id": "23",
				"text": "T"
			},
			{
				"id": "24",
				"text": "U"
			},
			{
				"id": "25",
				"text": "V"
			},
			{
				"id": "26",
				"text": "W"
			},
			{
				"id": "27",
				"text": "X"
			},
			{
				"id": "28",
				"text": "Y"
			},
			{
				"id": "29",
				"text": "Z"
			}
		]
	},
	{
		"text": "Number Row",
		"children": [
			{
				"id": "30",
				"text": "1 !"
			},
			{
				"id": "31",
				"text": "2 @"
			},
			{
				"id": "32",
				"text": "3 #"
			},
			{
				"id": "33",
				"text": "4 $"
			},
			{
				"id": "34",
				"text": "5 %"
			},
			{
				"id": "35",
				"text": "6 ^"
			},
			{
				"id": "36",
				"text": "7 &"
			},
			{
				"id": "37",
				"text": "8 *"
			},
			{
				"id": "38",
				"text": "9 ("
			},
			{
				"id": "39",
				"text": "0 )"
			}
		]
	},
	{
		"text": "Whitespace",
		"children": [
			{
				"id": "40",
				"additional": {
					"explanation": "Return"
				},
				"text": "Enter"
			},
			{
				"id": "41",
				"text": "Escape"
			},
			{
				"id": "42",
				"text": "Backspace"
			},
			{
				"id": "43",
				"text": "Tab"
			},
			{
				"id": "44",
				"text": "Space"
			}
		]
	},
	{
		"text": "Punctuation",
		"children": [
			{
				"id": "45",
				"text": "- _"
			},
			{
				"id": "46",
				"text": "= +"
			},
			{
				"id": "47",
				"text": "[ {"
			},
			{
				"id": "48",
				"text": "] }"
			},
			{
				"id": "49",
				"text": "\\ |"
			},
			{
				"id": "51",
				"text": "; :"
			},
			{
				"id": "52",
				"text": "' \""
			},
			{
				"id": "53",
				"text": "` ~"
			},
			{
				"id": "54",
				"text": ", <"
			},
			{
				"id": "55",
				"text": ". >"
			},
			{
				"id": "56",
				"text": "/ ?"
			}
		]
	},
	{
		"text": "Function keys",
		"children": [
			{
				"id": "58",
				"text": "F1"
			},
			{
				"id": "59",
				"text": "F2"
			},
			{
				"id": "60",
				"text": "F3"
			},
			{
				"id": "61",
				"text": "F4"
			},
			{
				"id": "62",
				"text": "F5"
			},
			{
				"id": "63",
				"text": "F6"
			},
			{
				"id": "64",
				"text": "F7"
			},
			{
				"id": "65",
				"text": "F8"
			},
			{
				"id": "66",
				"text": "F9"
			},
			{
				"id": "67",
				"text": "F10"
			},
			{
				"id": "68",
				"text": "F11"
			},
			{
				"id": "69",
				"text": "F12"
			},
			{
				"id": "104",
				"text": "F13"
			},
			{
				"id": "105",
				"text": "F14"
			},
			{
				"id": "106",
				"text": "F15"
			},
			{
				"id": "107",
				"text": "F16"
			},
			{
				"id": "108",
				"text": "F17"
			},
			{
				"id": "109",
				"text": "F18"
			},
			{
				"id": "110",
				"text": "F19"
			},
			{
				"id": "111",
				"text": "F20"
			},
			{
				"id": "112",
				"text": "F21"
			},
			{
				"id": "113",
				"text": "F22"
			},
			{
				"id": "114",
				"text": "F23"
			},
			{
				"id": "115",
				"text": "F24"
			}
		]
	},
	{
		"text": "Navigation",
		"children": [
			{
				"id": "74",
				"text": "Home"
			},
			{
				"id": "75",
				"additional": {
					"explanation": "PgUp pageup"
				},
				"text": "Page Up"
			},
			{
				"id": "77",
				"text": "End"
			},
			{
				"id": "78",
				"additional": {
					"explanation": "PgDn pagedown"
				},
				"text": "Page Down"
			},
			{
				"id": "79",
				"additional": {
					"explanation": "ArrowRight"
				},
				"text": "Right Arrow"
			},
			{
				"id": "80",
				"additional": {
					"explanation": "ArrowLeft"
				},
				"text": "Left Arrow"
			},
			{
				"id": "81",
				"additional": {
					"explanation": "ArrowDown"
				},
				"text": "Down Arrow"
			},
			{
				"id": "82",
				"additional": {
					"explanation": "ArrowUp"
				},
				"text": "Up Arrow"
			}
		]
	},
	{
		"text": "Numpad",
		"children": [
			{
				"id": "83",
				"text": "NumLock"
			},
			{
				"id": "84",
				"additional": {
					"explanation": "slash"
				},
				"text": "/"
			},
			{
				"id": "85",
				"additional": {
					"explanation": "asterisk"
				},
				"text": "*"
			},
			{
				"id": "86",
				"additional": {
					"explanation": "minus"
				},
				"text": "-"
			},
			{
				"id": "87",
				"additional": {
					"explanation": "plus"
				},
				"text": "+"
			},
			{
				"id": "88",
				"text": "Enter"
			},
			{
				"id": "89",
				"additional": {
					"explanation": "one"
				},
				"text": "1"
			},
			{
				"id": "90",
				"additional": {
					"explanation": "two"
				},
				"text": "2"
			},
			{
				"id": "91",
				"additional": {
					"explanation": "three"
				},
				"text": "3"
			},
			{
				"id": "92",
				"additional": {
					"explanation": "four"
				},
				"text": "4"
			},
			{
				"id": "93",
				"additional": {
					"explanation": "five"
				},
				"text": "5"
			},
			{
				"id": "94",
				"additional": {
					"explanation": "six"
				},
				"text": "6"
			},
			{
				"id": "95",
				"additional": {
					"explanation": "seven"
				},
				"text": "7"
			},
			{
				"id": "96",
				"additional": {
					"explanation": "eight"
				},
				"text": "8"
			},
			{
				"id": "97",
				"additional": {
					"explanation": "nine"
				},
				"text": "9"
			},
			{
				"id": "98",
				"additional": {
					"explanation": "zero"
				},
				"text": "0"
			},
			{
				"id": "99",
				"additional": {
					"explanation": "Period"
				},
				"text": "."
			},
			{
				"id": "176",
				"additional": {
					"explanation": "Doublezero"
				},
				"text": "00"
			},
			{
				"id": "177",
				"additional": {
					"explanation": "Triplezero"
				},
				"text": "000"
			}
		]
	},
	{
		"text": "Misc",
		"children": [
			{
				"id": "118",
				"text": "Menu"
			},
			{
				"id": "73",
				"text": "Insert"
			},
			{
				"id": "76",
				"additional": {
					"explanation": "Delete Forward"
				},
				"text": "Delete"
			},
			{
				"id": "57",
				"text": "CapsLock"
			},
			{
				"id": "70",
				"text": "PrintScreen"
			},
			{
				"id": "71",
				"text": "ScrollLock"
			},
			{
				"id": "72",
				"text": "Pause"
			}
		]
	},
	{
		"text": "Media Keys",
		"children": [
			{
				"id": "127",
				"text": "Mute"
			},
			{
				"id": "128",
				"text": "Volume Up"
			},
			{
				"id": "129",
				"text": "Volume Down"
			},
			{
				"id": "",
				"text": "Next Track"
			},
			{
				"id": "",
				"text": "Previous Track"
			},
			{
				"id": "",
				"text": "Stop"
			},
			{
				"id": "",
				"text": "Play/Pause"
			},
			{
				"id": "",
				"text": "Eject"
			}
		]
	}
];

/***/ }),
/* 719 */
/***/ (function(module, exports) {

module.exports = [
	{
		"isDefault": false,
		"abbreviation": "QTY",
		"name": "QWERTY",
		"description": "Maecenas sem dui, ullamcorper consequat pellentesque ut, mattis at velit. Duis scelerisque eleifend gravida. Aenean at mauris rhoncus, dictum mi vitae, semper eros. Quisque maximus est elit, at condimentum ligula consectetur vel. Aenean lorem felis, molestie id ex suscipit, sagittis mollis dui. Phasellus in felis in libero bibendum ornare. Duis vestibulum dolor sed diam tempor vulputate. Curabitur scelerisque pretium ipsum. Phasellus non orci vestibulum, vehicula lectus sit amet, lacinia velit. Class aptent taciti sociosqu ad litora torquent per conubia nostra, per inceptos himenaeos. In diam lacus, cursus at pretium vel, ullamcorper at ante.",
		"layers": [
			{
				"modules": [
					{
						"id": 0,
						"pointerRole": "move",
						"keyActions": [
							{
								"keyActionType": "keystroke",
								"scancode": 36
							},
							{
								"keyActionType": "keystroke",
								"scancode": 37
							},
							{
								"keyActionType": "keystroke",
								"scancode": 38
							},
							{
								"keyActionType": "keystroke",
								"scancode": 39
							},
							{
								"keyActionType": "keystroke",
								"scancode": 45
							},
							{
								"keyActionType": "keystroke",
								"scancode": 46
							},
							{
								"keyActionType": "keystroke",
								"scancode": 42
							},
							{
								"keyActionType": "keystroke",
								"scancode": 28
							},
							{
								"keyActionType": "keystroke",
								"scancode": 24
							},
							{
								"keyActionType": "keystroke",
								"scancode": 12
							},
							{
								"keyActionType": "keystroke",
								"scancode": 18
							},
							{
								"keyActionType": "keystroke",
								"scancode": 19
							},
							{
								"keyActionType": "keystroke",
								"scancode": 47
							},
							{
								"keyActionType": "keystroke",
								"scancode": 48
							},
							{
								"keyActionType": "keystroke",
								"scancode": 49
							},
							{
								"keyActionType": "keystroke",
								"scancode": 11
							},
							{
								"keyActionType": "keystroke",
								"scancode": 13
							},
							{
								"keyActionType": "keystroke",
								"scancode": 14
							},
							{
								"keyActionType": "keystroke",
								"scancode": 15
							},
							{
								"keyActionType": "keystroke",
								"scancode": 51
							},
							{
								"keyActionType": "keystroke",
								"scancode": 52
							},
							{
								"keyActionType": "keystroke",
								"scancode": 40
							},
							{
								"keyActionType": "keystroke",
								"scancode": 17
							},
							{
								"keyActionType": "keystroke",
								"scancode": 16
							},
							{
								"keyActionType": "keystroke",
								"scancode": 54
							},
							{
								"keyActionType": "keystroke",
								"scancode": 55
							},
							{
								"keyActionType": "keystroke",
								"scancode": 56
							},
							{
								"keyActionType": "keystroke",
								"modifierMask": 32
							},
							{
								"keyActionType": "keystroke",
								"scancode": 44
							},
							{
								"keyActionType": "switchLayer",
								"layer": "fn",
								"toggle": false
							},
							{
								"keyActionType": "keystroke",
								"modifierMask": 64
							},
							{
								"keyActionType": "keystroke",
								"modifierMask": 128
							},
							{
								"keyActionType": "keystroke",
								"modifierMask": 16
							},
							{
								"keyActionType": "switchLayer",
								"layer": "mod",
								"toggle": false
							}
						]
					},
					{
						"id": 1,
						"pointerRole": "move",
						"keyActions": [
							{
								"keyActionType": "keystroke",
								"scancode": 53
							},
							{
								"keyActionType": "keystroke",
								"scancode": 30
							},
							{
								"keyActionType": "keystroke",
								"scancode": 31
							},
							{
								"keyActionType": "keystroke",
								"scancode": 32
							},
							{
								"keyActionType": "keystroke",
								"scancode": 33
							},
							{
								"keyActionType": "keystroke",
								"scancode": 34
							},
							{
								"keyActionType": "keystroke",
								"scancode": 35
							},
							{
								"keyActionType": "keystroke",
								"scancode": 43
							},
							{
								"keyActionType": "keystroke",
								"scancode": 20
							},
							{
								"keyActionType": "keystroke",
								"scancode": 26
							},
							{
								"keyActionType": "keystroke",
								"scancode": 8
							},
							{
								"keyActionType": "keystroke",
								"scancode": 21
							},
							{
								"keyActionType": "keystroke",
								"scancode": 23
							},
							{
								"keyActionType": "switchLayer",
								"layer": "mouse",
								"toggle": false
							},
							{
								"keyActionType": "keystroke",
								"scancode": 4
							},
							{
								"keyActionType": "keystroke",
								"scancode": 22
							},
							{
								"keyActionType": "keystroke",
								"scancode": 7
							},
							{
								"keyActionType": "keystroke",
								"scancode": 9
							},
							{
								"keyActionType": "keystroke",
								"scancode": 10
							},
							{
								"keyActionType": "keystroke",
								"modifierMask": 2
							},
							{
								"keyActionType": "keystroke",
								"scancode": 29
							},
							{
								"keyActionType": "keystroke",
								"scancode": 27
							},
							{
								"keyActionType": "keystroke",
								"scancode": 6
							},
							{
								"keyActionType": "keystroke",
								"scancode": 25
							},
							{
								"keyActionType": "keystroke",
								"scancode": 5
							},
							{
								"keyActionType": "keystroke",
								"modifierMask": 1
							},
							{
								"keyActionType": "keystroke",
								"modifierMask": 8
							},
							{
								"keyActionType": "keystroke",
								"modifierMask": 4
							},
							{
								"keyActionType": "switchLayer",
								"layer": "fn",
								"toggle": false
							},
							{
								"keyActionType": "switchLayer",
								"layer": "mod",
								"toggle": false
							},
							{
								"keyActionType": "keystroke",
								"scancode": 44
							}
						]
					},
					{
						"id": 2,
						"pointerRole": "scroll",
						"keyActions": []
					}
				]
			},
			{
				"modules": [
					{
						"id": 0,
						"pointerRole": "none",
						"keyActions": [
							null,
							null,
							null,
							null,
							null,
							null,
							null,
							{
								"keyActionType": "keystroke",
								"scancode": 75
							},
							{
								"keyActionType": "keystroke",
								"scancode": 74
							},
							{
								"keyActionType": "keystroke",
								"scancode": 82
							},
							{
								"keyActionType": "keystroke",
								"scancode": 77
							},
							null,
							null,
							null,
							null,
							{
								"keyActionType": "keystroke",
								"scancode": 78
							},
							{
								"keyActionType": "keystroke",
								"scancode": 80
							},
							{
								"keyActionType": "keystroke",
								"scancode": 81
							},
							{
								"keyActionType": "keystroke",
								"scancode": 79
							},
							null,
							null,
							null,
							null,
							null,
							{
								"keyActionType": "switchKeymap",
								"keymapAbbreviation": "VIM"
							},
							null,
							{
								"keyActionType": "keystroke",
								"scancode": 118
							},
							{
								"keyActionType": "keystroke",
								"modifierMask": 32
							},
							null,
							{
								"keyActionType": "switchLayer",
								"layer": "fn",
								"toggle": false
							},
							{
								"keyActionType": "keystroke",
								"modifierMask": 64
							},
							{
								"keyActionType": "keystroke",
								"modifierMask": 128
							},
							{
								"keyActionType": "keystroke",
								"modifierMask": 16
							},
							{
								"keyActionType": "switchLayer",
								"layer": "mod",
								"toggle": false
							}
						]
					},
					{
						"id": 1,
						"pointerRole": "none",
						"keyActions": [
							null,
							null,
							null,
							null,
							null,
							null,
							null,
							null,
							null,
							null,
							null,
							null,
							null,
							{
								"keyActionType": "switchLayer",
								"layer": "mouse",
								"toggle": false
							},
							null,
							null,
							null,
							null,
							null,
							{
								"keyActionType": "keystroke",
								"modifierMask": 2
							},
							null,
							null,
							null,
							null,
							null,
							{
								"keyActionType": "keystroke",
								"modifierMask": 1
							},
							{
								"keyActionType": "keystroke",
								"modifierMask": 8
							},
							{
								"keyActionType": "keystroke",
								"modifierMask": 4
							},
							{
								"keyActionType": "switchLayer",
								"layer": "fn",
								"toggle": false
							},
							{
								"keyActionType": "switchLayer",
								"layer": "mod",
								"toggle": false
							},
							null
						]
					}
				]
			},
			{
				"modules": [
					{
						"id": 0,
						"pointerRole": "move",
						"keyActions": [
							{
								"keyActionType": "switchLayer",
								"layer": "fn",
								"toggle": true
							},
							null,
							null,
							null,
							null,
							null,
							null,
							null,
							{
								"keyActionType": "keystroke",
								"scancode": 232
							},
							{
								"keyActionType": "keystroke",
								"scancode": 237
							},
							{
								"keyActionType": "keystroke",
								"scancode": 233
							},
							null,
							null,
							null,
							null,
							null,
							{
								"keyActionType": "keystroke",
								"scancode": 234
							},
							{
								"keyActionType": "keystroke",
								"scancode": 238
							},
							{
								"keyActionType": "keystroke",
								"scancode": 235
							},
							null,
							null,
							null,
							null,
							null,
							{
								"keyActionType": "keystroke",
								"scancode": 239
							},
							null,
							null,
							{
								"keyActionType": "keystroke",
								"modifierMask": 32
							},
							null,
							{
								"keyActionType": "switchLayer",
								"layer": "fn",
								"toggle": false
							},
							{
								"keyActionType": "keystroke",
								"modifierMask": 64
							},
							{
								"keyActionType": "keystroke",
								"modifierMask": 128
							},
							{
								"keyActionType": "keystroke",
								"modifierMask": 16
							},
							{
								"keyActionType": "switchLayer",
								"layer": "mod",
								"toggle": true
							}
						]
					},
					{
						"id": 1,
						"pointerRole": "scroll",
						"keyActions": [
							null,
							null,
							null,
							null,
							null,
							{
								"keyActionType": "switchLayer",
								"layer": "mouse",
								"toggle": true
							},
							{
								"keyActionType": "switchLayer",
								"layer": "mod",
								"toggle": true
							},
							null,
							null,
							null,
							null,
							null,
							null,
							{
								"keyActionType": "switchLayer",
								"layer": "mouse",
								"toggle": true
							},
							null,
							null,
							null,
							null,
							null,
							{
								"keyActionType": "keystroke",
								"modifierMask": 2
							},
							null,
							null,
							null,
							null,
							null,
							{
								"keyActionType": "keystroke",
								"modifierMask": 1
							},
							{
								"keyActionType": "keystroke",
								"modifierMask": 8
							},
							{
								"keyActionType": "keystroke",
								"modifierMask": 4
							},
							{
								"keyActionType": "switchLayer",
								"layer": "fn",
								"toggle": false
							},
							{
								"keyActionType": "switchLayer",
								"layer": "mod",
								"toggle": true
							},
							null
						]
					}
				]
			},
			{
				"modules": [
					{
						"id": 0,
						"pointerRole": "move",
						"keyActions": [
							null,
							null,
							null,
							null,
							null,
							null,
							null,
							{
								"keyActionType": "mouse",
								"mouseAction": "scrollUp"
							},
							null,
							{
								"keyActionType": "mouse",
								"mouseAction": "moveUp"
							},
							null,
							null,
							null,
							null,
							null,
							{
								"keyActionType": "mouse",
								"mouseAction": "scrollDown"
							},
							{
								"keyActionType": "mouse",
								"mouseAction": "moveLeft"
							},
							{
								"keyActionType": "mouse",
								"mouseAction": "moveDown"
							},
							{
								"keyActionType": "mouse",
								"mouseAction": "moveRight"
							},
							null,
							null,
							null,
							null,
							null,
							null,
							null,
							null,
							null,
							null,
							null,
							{
								"keyActionType": "keystroke",
								"modifierMask": 64
							},
							{
								"keyActionType": "keystroke",
								"modifierMask": 128
							},
							{
								"keyActionType": "keystroke",
								"modifierMask": 16
							},
							null
						]
					},
					{
						"id": 1,
						"pointerRole": "move",
						"keyActions": [
							null,
							null,
							null,
							null,
							null,
							null,
							null,
							null,
							null,
							null,
							null,
							null,
							null,
							{
								"keyActionType": "switchLayer",
								"layer": "mouse",
								"toggle": false
							},
							null,
							{
								"keyActionType": "mouse",
								"mouseAction": "rightClick"
							},
							{
								"keyActionType": "mouse",
								"mouseAction": "middleClick"
							},
							{
								"keyActionType": "mouse",
								"mouseAction": "leftClick"
							},
							null,
							null,
							null,
							null,
							null,
							null,
							null,
							{
								"keyActionType": "keystroke",
								"modifierMask": 1
							},
							{
								"keyActionType": "keystroke",
								"modifierMask": 8
							},
							{
								"keyActionType": "keystroke",
								"modifierMask": 4
							},
							null,
							{
								"keyActionType": "mouse",
								"mouseAction": "accelerate"
							},
							{
								"keyActionType": "mouse",
								"mouseAction": "decelerate"
							}
						]
					}
				]
			}
		]
	},
	{
		"isDefault": false,
		"abbreviation": "VIM",
		"name": "VIM",
		"description": "Phasellus egestas ac tellus id tincidunt. Ut non nisl turpis. Morbi molestie diam elit, et cursus nibh tempus vel. Vestibulum mattis arcu nec nisi dictum, quis facilisis augue rutrum. Fusce vel tristique metus. Nullam pretium elit et enim maximus ornare. Praesent ultrices ligula ut mi convallis, quis ultrices enim venenatis. Aenean interdum odio aliquam quam vestibulum, vel bibendum elit ornare. Morbi leo enim, ullamcorper a bibendum sit amet, ultrices vitae ligula. Etiam consectetur et massa a convallis. Nullam non nisi aliquet, suscipit nulla a, tempor odio. Praesent eu turpis euismod, pellentesque mauris ut, imperdiet felis. Pellentesque vehicula luctus purus, et mattis ante volutpat eu. Quisque venenatis porta odio.",
		"layers": [
			{
				"modules": [
					{
						"id": 0,
						"pointerRole": "move",
						"keyActions": [
							{
								"keyActionType": "mouse",
								"mouseAction": "scrollDown"
							},
							null,
							{
								"keyActionType": "switchKeymap",
								"keymapAbbreviation": "QTY"
							},
							null,
							null,
							null,
							null,
							null,
							null,
							null,
							null,
							null,
							null,
							null,
							null,
							null,
							null,
							null,
							null,
							null,
							null,
							null,
							null,
							null,
							null,
							null,
							null,
							null,
							null,
							null,
							null,
							null,
							null,
							null
						]
					},
					{
						"id": 1,
						"pointerRole": "scroll",
						"keyActions": [
							null,
							null,
							null,
							null,
							null,
							null,
							null,
							null,
							null,
							null,
							null,
							null,
							null,
							null,
							null,
							null,
							null,
							null,
							null,
							null,
							null,
							null,
							null,
							null,
							null,
							null,
							null,
							null,
							null,
							null,
							null
						]
					},
					{
						"id": 2,
						"pointerRole": "move",
						"keyActions": [
							{
								"keyActionType": "keystroke",
								"scancode": 111
							}
						]
					}
				]
			},
			{
				"modules": [
					{
						"id": 0,
						"pointerRole": "move",
						"keyActions": [
							null,
							null,
							null,
							null,
							null,
							null,
							null,
							null,
							null,
							null,
							null,
							null,
							null,
							null,
							null,
							null,
							null,
							null,
							null,
							null,
							null,
							null,
							null,
							null,
							null,
							null,
							null,
							null,
							null,
							null,
							null,
							null,
							null,
							null
						]
					},
					{
						"id": 1,
						"pointerRole": "move",
						"keyActions": [
							null,
							null,
							null,
							null,
							null,
							null,
							null,
							null,
							null,
							null,
							null,
							null,
							null,
							null,
							null,
							null,
							null,
							null,
							null,
							null,
							null,
							null,
							null,
							null,
							null,
							null,
							null,
							null,
							null,
							null,
							null
						]
					}
				]
			},
			{
				"modules": [
					{
						"id": 0,
						"pointerRole": "move",
						"keyActions": [
							null,
							null,
							null,
							null,
							null,
							null,
							null,
							null,
							null,
							null,
							null,
							null,
							null,
							null,
							null,
							null,
							null,
							null,
							null,
							null,
							null,
							null,
							null,
							null,
							null,
							null,
							null,
							null,
							null,
							null,
							null,
							null,
							null,
							null
						]
					},
					{
						"id": 1,
						"pointerRole": "move",
						"keyActions": [
							null,
							null,
							null,
							null,
							null,
							null,
							null,
							null,
							null,
							null,
							null,
							null,
							null,
							null,
							null,
							null,
							null,
							null,
							null,
							null,
							null,
							null,
							null,
							null,
							null,
							null,
							null,
							null,
							null,
							null,
							null
						]
					}
				]
			},
			{
				"modules": [
					{
						"id": 0,
						"pointerRole": "move",
						"keyActions": [
							null,
							null,
							null,
							null,
							null,
							null,
							null,
							null,
							null,
							null,
							null,
							null,
							null,
							null,
							null,
							null,
							null,
							null,
							null,
							null,
							null,
							null,
							null,
							null,
							null,
							null,
							null,
							null,
							null,
							null,
							null,
							null,
							null,
							null
						]
					},
					{
						"id": 1,
						"pointerRole": "move",
						"keyActions": [
							null,
							null,
							null,
							null,
							null,
							null,
							null,
							null,
							null,
							null,
							null,
							null,
							null,
							null,
							null,
							null,
							null,
							null,
							null,
							null,
							null,
							null,
							null,
							null,
							null,
							null,
							null,
							null,
							null,
							null,
							null
						]
					}
				]
			}
		]
	},
	{
		"isDefault": false,
		"abbreviation": "DVR",
		"name": "DVR",
		"description": "Pellentesque habitant morbi tristique senectus et netus et malesuada fames ac turpis egestas. Aenean dictum sollicitudin massa, ut lacinia ipsum. Ut bibendum ipsum ac pulvinar vehicula. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Etiam feugiat lobortis lacus, id viverra nisl varius eu. Aliquam vitae eros a augue fermentum ultricies. Nam tempus dui sed ante ultricies bibendum. In ligula velit, aliquet a felis vitae, gravida tincidunt ante. Proin euismod velit odio, at pretium lacus porta egestas. Suspendisse aliquam, lacus accumsan dapibus elementum, orci felis egestas leo, non vulputate lorem turpis nec risus. Curabitur id volutpat orci. Sed aliquet finibus iaculis. In venenatis neque ac dolor posuere, vel vestibulum augue posuere.",
		"layers": [
			{
				"modules": [
					{
						"id": 0,
						"pointerRole": "move",
						"keyActions": [
							null,
							null,
							null,
							null,
							null,
							null,
							null,
							null,
							null,
							null,
							null,
							null,
							null,
							null,
							null,
							null,
							null,
							null,
							null,
							null,
							null,
							null,
							null,
							null,
							null,
							null,
							null,
							null,
							null,
							null,
							null,
							null,
							null,
							null
						]
					},
					{
						"id": 1,
						"pointerRole": "move",
						"keyActions": [
							null,
							null,
							null,
							null,
							null,
							null,
							null,
							null,
							null,
							null,
							null,
							null,
							null,
							null,
							null,
							null,
							null,
							null,
							null,
							null,
							null,
							null,
							null,
							null,
							null,
							null,
							null,
							null,
							null,
							null,
							null
						]
					}
				]
			},
			{
				"modules": [
					{
						"id": 0,
						"pointerRole": "move",
						"keyActions": [
							null,
							null,
							null,
							null,
							null,
							null,
							null,
							null,
							null,
							null,
							null,
							null,
							null,
							null,
							null,
							null,
							null,
							null,
							null,
							null,
							null,
							null,
							null,
							null,
							null,
							null,
							null,
							null,
							null,
							null,
							null,
							null,
							null,
							null
						]
					},
					{
						"id": 1,
						"pointerRole": "move",
						"keyActions": [
							null,
							null,
							null,
							null,
							null,
							null,
							null,
							null,
							null,
							null,
							null,
							null,
							null,
							null,
							null,
							null,
							null,
							null,
							null,
							null,
							null,
							null,
							null,
							null,
							null,
							null,
							null,
							null,
							null,
							null,
							null
						]
					}
				]
			},
			{
				"modules": [
					{
						"id": 0,
						"pointerRole": "move",
						"keyActions": [
							null,
							null,
							null,
							null,
							null,
							null,
							null,
							null,
							null,
							null,
							null,
							null,
							null,
							null,
							null,
							null,
							null,
							null,
							null,
							null,
							null,
							null,
							null,
							null,
							null,
							null,
							null,
							null,
							null,
							null,
							null,
							null,
							null,
							null
						]
					},
					{
						"id": 1,
						"pointerRole": "move",
						"keyActions": [
							null,
							null,
							null,
							null,
							null,
							null,
							null,
							null,
							null,
							null,
							null,
							null,
							null,
							null,
							null,
							null,
							null,
							null,
							null,
							null,
							null,
							null,
							null,
							null,
							null,
							null,
							null,
							null,
							null,
							null,
							null
						]
					}
				]
			},
			{
				"modules": [
					{
						"id": 0,
						"pointerRole": "move",
						"keyActions": [
							null,
							null,
							null,
							null,
							null,
							null,
							null,
							null,
							null,
							null,
							null,
							null,
							null,
							null,
							null,
							null,
							null,
							null,
							null,
							null,
							null,
							null,
							null,
							null,
							null,
							null,
							null,
							null,
							null,
							null,
							null,
							null,
							null,
							null
						]
					},
					{
						"id": 1,
						"pointerRole": "move",
						"keyActions": [
							null,
							null,
							null,
							null,
							null,
							null,
							null,
							null,
							null,
							null,
							null,
							null,
							null,
							null,
							null,
							null,
							null,
							null,
							null,
							null,
							null,
							null,
							null,
							null,
							null,
							null,
							null,
							null,
							null,
							null,
							null
						]
					}
				]
			}
		]
	},
	{
		"isDefault": false,
		"abbreviation": "EMY",
		"name": "Empty keymap",
		"description": "None of the keys are bind to any key action. It is ideal if you want to start creating your keymap from the ground up.",
		"layers": [
			{
				"modules": [
					{
						"id": 0,
						"pointerRole": "move",
						"keyActions": [
							null,
							null,
							null,
							null,
							null,
							null,
							null,
							null,
							null,
							null,
							null,
							null,
							null,
							null,
							null,
							null,
							null,
							null,
							null,
							null,
							null,
							null,
							null,
							null,
							null,
							null,
							null,
							null,
							null,
							null,
							null,
							null,
							null,
							null
						]
					},
					{
						"id": 1,
						"pointerRole": "move",
						"keyActions": [
							null,
							null,
							null,
							null,
							null,
							null,
							null,
							null,
							null,
							null,
							null,
							null,
							null,
							null,
							null,
							null,
							null,
							null,
							null,
							null,
							null,
							null,
							null,
							null,
							null,
							null,
							null,
							null,
							null,
							null,
							null
						]
					}
				]
			},
			{
				"modules": [
					{
						"id": 0,
						"pointerRole": "move",
						"keyActions": [
							null,
							null,
							null,
							null,
							null,
							null,
							null,
							null,
							null,
							null,
							null,
							null,
							null,
							null,
							null,
							null,
							null,
							null,
							null,
							null,
							null,
							null,
							null,
							null,
							null,
							null,
							null,
							null,
							null,
							null,
							null,
							null,
							null,
							null
						]
					},
					{
						"id": 1,
						"pointerRole": "move",
						"keyActions": [
							null,
							null,
							null,
							null,
							null,
							null,
							null,
							null,
							null,
							null,
							null,
							null,
							null,
							null,
							null,
							null,
							null,
							null,
							null,
							null,
							null,
							null,
							null,
							null,
							null,
							null,
							null,
							null,
							null,
							null,
							null
						]
					}
				]
			},
			{
				"modules": [
					{
						"id": 0,
						"pointerRole": "move",
						"keyActions": [
							null,
							null,
							null,
							null,
							null,
							null,
							null,
							null,
							null,
							null,
							null,
							null,
							null,
							null,
							null,
							null,
							null,
							null,
							null,
							null,
							null,
							null,
							null,
							null,
							null,
							null,
							null,
							null,
							null,
							null,
							null,
							null,
							null,
							null
						]
					},
					{
						"id": 1,
						"pointerRole": "move",
						"keyActions": [
							null,
							null,
							null,
							null,
							null,
							null,
							null,
							null,
							null,
							null,
							null,
							null,
							null,
							null,
							null,
							null,
							null,
							null,
							null,
							null,
							null,
							null,
							null,
							null,
							null,
							null,
							null,
							null,
							null,
							null,
							null
						]
					}
				]
			},
			{
				"modules": [
					{
						"id": 0,
						"pointerRole": "move",
						"keyActions": [
							null,
							null,
							null,
							null,
							null,
							null,
							null,
							null,
							null,
							null,
							null,
							null,
							null,
							null,
							null,
							null,
							null,
							null,
							null,
							null,
							null,
							null,
							null,
							null,
							null,
							null,
							null,
							null,
							null,
							null,
							null,
							null,
							null,
							null
						]
					},
					{
						"id": 1,
						"pointerRole": "move",
						"keyActions": [
							null,
							null,
							null,
							null,
							null,
							null,
							null,
							null,
							null,
							null,
							null,
							null,
							null,
							null,
							null,
							null,
							null,
							null,
							null,
							null,
							null,
							null,
							null,
							null,
							null,
							null,
							null,
							null,
							null,
							null,
							null
						]
					}
				]
			}
		]
	}
];

/***/ }),
/* 720 */
/***/ (function(module, exports) {

module.exports = {
	"dataModelVersion": 3,
	"moduleConfigurations": [
		{
			"id": 1,
			"initialPointerSpeed": 1,
			"pointerAcceleration": 5,
			"maxPointerSpeed": 200
		}
	],
	"keymaps": [
		{
			"isDefault": true,
			"abbreviation": "QTY",
			"name": "QWERTY",
			"description": "",
			"layers": [
				{
					"modules": [
						{
							"id": 0,
							"pointerRole": "move",
							"keyActions": [
								{
									"keyActionType": "keystroke",
									"scancode": 36
								},
								{
									"keyActionType": "keystroke",
									"scancode": 37
								},
								{
									"keyActionType": "keystroke",
									"scancode": 38
								},
								{
									"keyActionType": "keystroke",
									"scancode": 39
								},
								{
									"keyActionType": "keystroke",
									"scancode": 45
								},
								{
									"keyActionType": "keystroke",
									"scancode": 46
								},
								{
									"keyActionType": "keystroke",
									"scancode": 42
								},
								{
									"keyActionType": "keystroke",
									"scancode": 28
								},
								{
									"keyActionType": "keystroke",
									"scancode": 24
								},
								{
									"keyActionType": "keystroke",
									"scancode": 12
								},
								{
									"keyActionType": "keystroke",
									"scancode": 18
								},
								{
									"keyActionType": "keystroke",
									"scancode": 19
								},
								{
									"keyActionType": "keystroke",
									"scancode": 47
								},
								{
									"keyActionType": "keystroke",
									"scancode": 48
								},
								{
									"keyActionType": "keystroke",
									"scancode": 49
								},
								{
									"keyActionType": "keystroke",
									"scancode": 11
								},
								{
									"keyActionType": "keystroke",
									"scancode": 13
								},
								{
									"keyActionType": "keystroke",
									"scancode": 14
								},
								{
									"keyActionType": "keystroke",
									"scancode": 15
								},
								{
									"keyActionType": "keystroke",
									"scancode": 51
								},
								{
									"keyActionType": "keystroke",
									"scancode": 52
								},
								{
									"keyActionType": "keystroke",
									"scancode": 40
								},
								{
									"keyActionType": "keystroke",
									"scancode": 17
								},
								{
									"keyActionType": "keystroke",
									"scancode": 16
								},
								{
									"keyActionType": "keystroke",
									"scancode": 54
								},
								{
									"keyActionType": "keystroke",
									"scancode": 55
								},
								{
									"keyActionType": "keystroke",
									"scancode": 56
								},
								{
									"keyActionType": "keystroke",
									"modifierMask": 32
								},
								{
									"keyActionType": "keystroke",
									"scancode": 44
								},
								{
									"keyActionType": "switchLayer",
									"layer": "fn",
									"toggle": false
								},
								{
									"keyActionType": "keystroke",
									"modifierMask": 64
								},
								{
									"keyActionType": "keystroke",
									"modifierMask": 128
								},
								{
									"keyActionType": "keystroke",
									"modifierMask": 16
								},
								{
									"keyActionType": "switchLayer",
									"layer": "mod",
									"toggle": false
								}
							]
						},
						{
							"id": 1,
							"pointerRole": "move",
							"keyActions": [
								{
									"keyActionType": "keystroke",
									"scancode": 53
								},
								{
									"keyActionType": "keystroke",
									"scancode": 30
								},
								{
									"keyActionType": "keystroke",
									"scancode": 31
								},
								{
									"keyActionType": "keystroke",
									"scancode": 32
								},
								{
									"keyActionType": "keystroke",
									"scancode": 33
								},
								{
									"keyActionType": "keystroke",
									"scancode": 34
								},
								{
									"keyActionType": "keystroke",
									"scancode": 35
								},
								{
									"keyActionType": "keystroke",
									"scancode": 43
								},
								{
									"keyActionType": "keystroke",
									"scancode": 20
								},
								{
									"keyActionType": "keystroke",
									"scancode": 26
								},
								{
									"keyActionType": "keystroke",
									"scancode": 8
								},
								{
									"keyActionType": "keystroke",
									"scancode": 21
								},
								{
									"keyActionType": "keystroke",
									"scancode": 23
								},
								{
									"keyActionType": "switchLayer",
									"layer": "mouse",
									"toggle": false
								},
								{
									"keyActionType": "keystroke",
									"scancode": 4
								},
								{
									"keyActionType": "keystroke",
									"scancode": 22
								},
								{
									"keyActionType": "keystroke",
									"scancode": 7
								},
								{
									"keyActionType": "keystroke",
									"scancode": 9
								},
								{
									"keyActionType": "keystroke",
									"scancode": 10
								},
								{
									"keyActionType": "keystroke",
									"modifierMask": 2
								},
								{
									"keyActionType": "keystroke",
									"scancode": 29
								},
								{
									"keyActionType": "keystroke",
									"scancode": 27
								},
								{
									"keyActionType": "keystroke",
									"scancode": 6
								},
								{
									"keyActionType": "keystroke",
									"scancode": 25
								},
								{
									"keyActionType": "keystroke",
									"scancode": 5
								},
								{
									"keyActionType": "keystroke",
									"modifierMask": 1
								},
								{
									"keyActionType": "keystroke",
									"modifierMask": 8
								},
								{
									"keyActionType": "keystroke",
									"modifierMask": 4
								},
								{
									"keyActionType": "switchLayer",
									"layer": "fn",
									"toggle": false
								},
								{
									"keyActionType": "switchLayer",
									"layer": "mod",
									"toggle": false
								},
								{
									"keyActionType": "keystroke",
									"scancode": 44
								}
							]
						},
						{
							"id": 2,
							"pointerRole": "scroll",
							"keyActions": []
						}
					]
				},
				{
					"modules": [
						{
							"id": 0,
							"pointerRole": "none",
							"keyActions": [
								null,
								null,
								null,
								null,
								null,
								null,
								null,
								{
									"keyActionType": "keystroke",
									"scancode": 75
								},
								{
									"keyActionType": "keystroke",
									"scancode": 74
								},
								{
									"keyActionType": "keystroke",
									"scancode": 82
								},
								{
									"keyActionType": "keystroke",
									"scancode": 77
								},
								null,
								null,
								null,
								null,
								{
									"keyActionType": "keystroke",
									"scancode": 78
								},
								{
									"keyActionType": "keystroke",
									"scancode": 80
								},
								{
									"keyActionType": "keystroke",
									"scancode": 81
								},
								{
									"keyActionType": "keystroke",
									"scancode": 79
								},
								null,
								null,
								null,
								null,
								null,
								{
									"keyActionType": "switchKeymap",
									"keymapAbbreviation": "VIM"
								},
								null,
								{
									"keyActionType": "keystroke",
									"scancode": 118
								},
								{
									"keyActionType": "keystroke",
									"modifierMask": 32
								},
								null,
								{
									"keyActionType": "switchLayer",
									"layer": "fn",
									"toggle": false
								},
								{
									"keyActionType": "keystroke",
									"modifierMask": 64
								},
								{
									"keyActionType": "keystroke",
									"modifierMask": 128
								},
								{
									"keyActionType": "keystroke",
									"modifierMask": 16
								},
								{
									"keyActionType": "switchLayer",
									"layer": "mod",
									"toggle": false
								}
							]
						},
						{
							"id": 1,
							"pointerRole": "none",
							"keyActions": [
								null,
								null,
								null,
								null,
								null,
								null,
								null,
								null,
								null,
								null,
								null,
								null,
								null,
								{
									"keyActionType": "switchLayer",
									"layer": "mouse",
									"toggle": false
								},
								null,
								null,
								null,
								null,
								null,
								{
									"keyActionType": "keystroke",
									"modifierMask": 2
								},
								null,
								null,
								null,
								null,
								null,
								{
									"keyActionType": "keystroke",
									"modifierMask": 1
								},
								{
									"keyActionType": "keystroke",
									"modifierMask": 8
								},
								{
									"keyActionType": "keystroke",
									"modifierMask": 4
								},
								{
									"keyActionType": "switchLayer",
									"layer": "fn",
									"toggle": false
								},
								{
									"keyActionType": "switchLayer",
									"layer": "mod",
									"toggle": false
								},
								null
							]
						}
					]
				},
				{
					"modules": [
						{
							"id": 0,
							"pointerRole": "move",
							"keyActions": [
								{
									"keyActionType": "switchLayer",
									"layer": "fn",
									"toggle": true
								},
								null,
								null,
								null,
								null,
								null,
								null,
								null,
								{
									"keyActionType": "keystroke",
									"scancode": 232
								},
								{
									"keyActionType": "keystroke",
									"scancode": 237
								},
								{
									"keyActionType": "keystroke",
									"scancode": 233
								},
								null,
								null,
								null,
								null,
								null,
								{
									"keyActionType": "keystroke",
									"scancode": 234
								},
								{
									"keyActionType": "keystroke",
									"scancode": 238
								},
								{
									"keyActionType": "keystroke",
									"scancode": 235
								},
								null,
								null,
								null,
								null,
								null,
								{
									"keyActionType": "keystroke",
									"scancode": 239
								},
								null,
								null,
								{
									"keyActionType": "keystroke",
									"modifierMask": 32
								},
								null,
								{
									"keyActionType": "switchLayer",
									"layer": "fn",
									"toggle": false
								},
								{
									"keyActionType": "keystroke",
									"modifierMask": 64
								},
								{
									"keyActionType": "keystroke",
									"modifierMask": 128
								},
								{
									"keyActionType": "keystroke",
									"modifierMask": 16
								},
								{
									"keyActionType": "switchLayer",
									"layer": "mod",
									"toggle": true
								}
							]
						},
						{
							"id": 1,
							"pointerRole": "scroll",
							"keyActions": [
								null,
								null,
								null,
								null,
								null,
								{
									"keyActionType": "switchLayer",
									"layer": "mouse",
									"toggle": true
								},
								{
									"keyActionType": "switchLayer",
									"layer": "mod",
									"toggle": true
								},
								null,
								null,
								null,
								null,
								null,
								null,
								{
									"keyActionType": "switchLayer",
									"layer": "mouse",
									"toggle": true
								},
								null,
								null,
								null,
								null,
								null,
								{
									"keyActionType": "keystroke",
									"modifierMask": 2
								},
								null,
								null,
								null,
								null,
								null,
								{
									"keyActionType": "keystroke",
									"modifierMask": 1
								},
								{
									"keyActionType": "keystroke",
									"modifierMask": 8
								},
								{
									"keyActionType": "keystroke",
									"modifierMask": 4
								},
								{
									"keyActionType": "switchLayer",
									"layer": "fn",
									"toggle": false
								},
								{
									"keyActionType": "switchLayer",
									"layer": "mod",
									"toggle": true
								},
								null
							]
						}
					]
				},
				{
					"modules": [
						{
							"id": 0,
							"pointerRole": "move",
							"keyActions": [
								null,
								null,
								null,
								null,
								null,
								null,
								null,
								{
									"keyActionType": "mouse",
									"mouseAction": "scrollUp"
								},
								null,
								{
									"keyActionType": "mouse",
									"mouseAction": "moveUp"
								},
								null,
								null,
								null,
								null,
								null,
								{
									"keyActionType": "mouse",
									"mouseAction": "scrollDown"
								},
								{
									"keyActionType": "mouse",
									"mouseAction": "moveLeft"
								},
								{
									"keyActionType": "mouse",
									"mouseAction": "moveDown"
								},
								{
									"keyActionType": "mouse",
									"mouseAction": "moveRight"
								},
								null,
								null,
								null,
								null,
								null,
								null,
								null,
								null,
								null,
								null,
								null,
								{
									"keyActionType": "keystroke",
									"modifierMask": 64
								},
								{
									"keyActionType": "keystroke",
									"modifierMask": 128
								},
								{
									"keyActionType": "keystroke",
									"modifierMask": 16
								},
								null
							]
						},
						{
							"id": 1,
							"pointerRole": "move",
							"keyActions": [
								null,
								null,
								null,
								null,
								null,
								null,
								null,
								null,
								null,
								null,
								null,
								null,
								null,
								{
									"keyActionType": "switchLayer",
									"layer": "mouse",
									"toggle": false
								},
								null,
								{
									"keyActionType": "mouse",
									"mouseAction": "rightClick"
								},
								{
									"keyActionType": "mouse",
									"mouseAction": "middleClick"
								},
								{
									"keyActionType": "mouse",
									"mouseAction": "leftClick"
								},
								null,
								null,
								null,
								null,
								null,
								null,
								null,
								{
									"keyActionType": "keystroke",
									"modifierMask": 1
								},
								{
									"keyActionType": "keystroke",
									"modifierMask": 8
								},
								{
									"keyActionType": "keystroke",
									"modifierMask": 4
								},
								null,
								{
									"keyActionType": "mouse",
									"mouseAction": "accelerate"
								},
								{
									"keyActionType": "mouse",
									"mouseAction": "decelerate"
								}
							]
						}
					]
				}
			]
		},
		{
			"isDefault": false,
			"abbreviation": "VIM",
			"name": "VIM",
			"description": "",
			"layers": [
				{
					"modules": [
						{
							"id": 0,
							"pointerRole": "move",
							"keyActions": [
								{
									"keyActionType": "mouse",
									"mouseAction": "scrollDown"
								},
								{
									"keyActionType": "playMacro",
									"macroIndex": 0
								},
								{
									"keyActionType": "switchKeymap",
									"keymapAbbreviation": "QTY"
								},
								null,
								null,
								null,
								null,
								null,
								null,
								null,
								null,
								null,
								null,
								null,
								null,
								null,
								null,
								null,
								null,
								null,
								null,
								null,
								null,
								null,
								null,
								null,
								null,
								null,
								null,
								null,
								null,
								null,
								null,
								null
							]
						},
						{
							"id": 1,
							"pointerRole": "scroll",
							"keyActions": [
								null,
								null,
								null,
								null,
								null,
								null,
								null,
								null,
								null,
								null,
								null,
								null,
								null,
								null,
								null,
								null,
								null,
								null,
								null,
								null,
								null,
								null,
								null,
								null,
								null,
								null,
								null,
								null,
								null,
								null,
								null
							]
						},
						{
							"id": 2,
							"pointerRole": "move",
							"keyActions": [
								{
									"keyActionType": "keystroke",
									"scancode": 111
								}
							]
						}
					]
				},
				{
					"modules": [
						{
							"id": 0,
							"pointerRole": "scroll",
							"keyActions": [
								null,
								null,
								null,
								null,
								null,
								null,
								null,
								null,
								null,
								null,
								null,
								null,
								null,
								null,
								null,
								null,
								null,
								null,
								null,
								null,
								null,
								null,
								null,
								null,
								null,
								null,
								null,
								null,
								null,
								null,
								null,
								null,
								null,
								null
							]
						},
						{
							"id": 1,
							"pointerRole": "move",
							"keyActions": [
								{
									"keyActionType": "keystroke",
									"scancode": 111
								},
								null,
								null,
								null,
								null,
								null,
								null,
								null,
								null,
								null,
								null,
								null,
								null,
								null,
								null,
								null,
								null,
								null,
								null,
								null,
								null,
								null,
								null,
								null,
								null,
								null,
								null,
								null,
								null,
								null,
								null
							]
						}
					]
				},
				{
					"modules": [
						{
							"id": 0,
							"pointerRole": "scroll",
							"keyActions": [
								null,
								null,
								null,
								null,
								null,
								null,
								null,
								null,
								null,
								null,
								null,
								null,
								null,
								null,
								null,
								null,
								null,
								null,
								null,
								null,
								null,
								null,
								null,
								null,
								null,
								null,
								null,
								null,
								null,
								null,
								null,
								null,
								null,
								null
							]
						},
						{
							"id": 1,
							"pointerRole": "move",
							"keyActions": [
								{
									"keyActionType": "keystroke",
									"scancode": 111
								},
								null,
								null,
								null,
								null,
								null,
								null,
								null,
								null,
								null,
								null,
								null,
								null,
								null,
								null,
								null,
								null,
								null,
								null,
								null,
								null,
								null,
								null,
								null,
								null,
								null,
								null,
								null,
								null,
								null,
								null
							]
						}
					]
				},
				{
					"modules": [
						{
							"id": 0,
							"pointerRole": "scroll",
							"keyActions": [
								null,
								null,
								null,
								null,
								null,
								null,
								null,
								null,
								null,
								null,
								null,
								null,
								null,
								null,
								null,
								null,
								null,
								null,
								null,
								null,
								null,
								null,
								null,
								null,
								null,
								null,
								null,
								null,
								null,
								null,
								null,
								null,
								null,
								null
							]
						},
						{
							"id": 1,
							"pointerRole": "move",
							"keyActions": [
								{
									"keyActionType": "keystroke",
									"scancode": 111
								},
								null,
								null,
								null,
								null,
								null,
								null,
								null,
								null,
								null,
								null,
								null,
								null,
								null,
								null,
								null,
								null,
								null,
								null,
								null,
								null,
								null,
								null,
								null,
								null,
								null,
								null,
								null,
								null,
								null,
								null
							]
						}
					]
				}
			]
		},
		{
			"isDefault": false,
			"abbreviation": "DVR",
			"name": "DVR",
			"description": "",
			"layers": [
				{
					"modules": [
						{
							"id": 0,
							"pointerRole": "move",
							"keyActions": [
								null,
								null,
								null,
								null,
								null,
								null,
								null,
								null,
								null,
								null,
								null,
								null,
								null,
								null,
								null,
								null,
								null,
								null,
								null,
								null,
								null,
								null,
								null,
								null,
								null,
								null,
								null,
								null,
								null,
								null,
								null,
								null,
								null,
								null
							]
						},
						{
							"id": 1,
							"pointerRole": "move",
							"keyActions": [
								null,
								null,
								null,
								null,
								null,
								null,
								null,
								null,
								null,
								null,
								null,
								null,
								null,
								null,
								null,
								null,
								null,
								null,
								null,
								null,
								null,
								null,
								null,
								null,
								null,
								null,
								null,
								null,
								null,
								null,
								null
							]
						}
					]
				},
				{
					"modules": [
						{
							"id": 0,
							"pointerRole": "move",
							"keyActions": [
								null,
								null,
								null,
								null,
								null,
								null,
								null,
								null,
								null,
								null,
								null,
								null,
								null,
								null,
								null,
								null,
								null,
								null,
								null,
								null,
								null,
								null,
								null,
								null,
								null,
								null,
								null,
								null,
								null,
								null,
								null,
								null,
								null,
								null
							]
						},
						{
							"id": 1,
							"pointerRole": "move",
							"keyActions": [
								null,
								null,
								null,
								null,
								null,
								null,
								null,
								null,
								null,
								null,
								null,
								null,
								null,
								null,
								null,
								null,
								null,
								null,
								null,
								null,
								null,
								null,
								null,
								null,
								null,
								null,
								null,
								null,
								null,
								null,
								null
							]
						}
					]
				},
				{
					"modules": [
						{
							"id": 0,
							"pointerRole": "move",
							"keyActions": [
								null,
								null,
								null,
								null,
								null,
								null,
								null,
								null,
								null,
								null,
								null,
								null,
								null,
								null,
								null,
								null,
								null,
								null,
								null,
								null,
								null,
								null,
								null,
								null,
								null,
								null,
								null,
								null,
								null,
								null,
								null,
								null,
								null,
								null
							]
						},
						{
							"id": 1,
							"pointerRole": "move",
							"keyActions": [
								null,
								null,
								null,
								null,
								null,
								null,
								null,
								null,
								null,
								null,
								null,
								null,
								null,
								null,
								null,
								null,
								null,
								null,
								null,
								null,
								null,
								null,
								null,
								null,
								null,
								null,
								null,
								null,
								null,
								null,
								null
							]
						}
					]
				},
				{
					"modules": [
						{
							"id": 0,
							"pointerRole": "move",
							"keyActions": [
								null,
								null,
								null,
								null,
								null,
								null,
								null,
								null,
								null,
								null,
								null,
								null,
								null,
								null,
								null,
								null,
								null,
								null,
								null,
								null,
								null,
								null,
								null,
								null,
								null,
								null,
								null,
								null,
								null,
								null,
								null,
								null,
								null,
								null
							]
						},
						{
							"id": 1,
							"pointerRole": "move",
							"keyActions": [
								null,
								null,
								null,
								null,
								null,
								null,
								null,
								null,
								null,
								null,
								null,
								null,
								null,
								null,
								null,
								null,
								null,
								null,
								null,
								null,
								null,
								null,
								null,
								null,
								null,
								null,
								null,
								null,
								null,
								null,
								null
							]
						}
					]
				}
			]
		}
	],
	"macros": [
		{
			"isLooped": false,
			"isPrivate": true,
			"name": "My address",
			"macroActions": [
				{
					"macroActionType": "key",
					"action": "press",
					"scancode": 111
				},
				{
					"macroActionType": "key",
					"action": "hold",
					"scancode": 83
				},
				{
					"macroActionType": "key",
					"action": "release",
					"scancode": 112
				},
				{
					"macroActionType": "key",
					"action": "press",
					"modifierMask": 93
				},
				{
					"macroActionType": "key",
					"action": "hold",
					"modifierMask": 101
				},
				{
					"macroActionType": "key",
					"action": "release",
					"modifierMask": 133
				},
				{
					"macroActionType": "mouseButton",
					"action": "press",
					"mouseButtonsMask": 9
				},
				{
					"macroActionType": "mouseButton",
					"action": "hold",
					"mouseButtonsMask": 12
				},
				{
					"macroActionType": "mouseButton",
					"action": "release",
					"mouseButtonsMask": 104
				},
				{
					"macroActionType": "moveMouse",
					"x": -1920,
					"y": 220
				},
				{
					"macroActionType": "scrollMouse",
					"x": 0,
					"y": 20000
				},
				{
					"macroActionType": "delay",
					"delay": 40000
				},
				{
					"macroActionType": "text",
					"text": "this is a text"
				}
			]
		},
		{
			"isLooped": true,
			"isPrivate": true,
			"name": "Blah Blah blah",
			"macroActions": [
				{
					"macroActionType": "key",
					"action": "press",
					"scancode": 111
				},
				{
					"macroActionType": "mouseButton",
					"action": "release",
					"mouseButtonsMask": 104
				},
				{
					"macroActionType": "scrollMouse",
					"x": 0,
					"y": -20000
				},
				{
					"macroActionType": "delay",
					"delay": 40000
				},
				{
					"macroActionType": "text",
					"text": "blahhhhhhh"
				}
			]
		}
	]
};

/***/ }),
/* 721 */,
/* 722 */
/***/ (function(module, exports) {

module.exports = ":host {\n  width: 100%;\n  height: 100%;\n  display: block; }\n"

/***/ }),
/* 723 */
/***/ (function(module, exports) {

module.exports = "svg-keyboard {\n  width: 95%;\n  max-width: 1400px;\n  position: absolute;\n  left: 0;\n  transform: translateX(-101%);\n  user-select: none; }\n"

/***/ }),
/* 724 */
/***/ (function(module, exports) {

module.exports = ":host {\n  overflow-y: auto;\n  display: block;\n  height: 100%; }\n\n.uhk__layer-switcher--wrapper {\n  position: relative; }\n  .uhk__layer-switcher--wrapper:before {\n    content: attr(data-title);\n    display: inline-block;\n    position: absolute;\n    bottom: -0.3em;\n    right: 100%;\n    font-size: 2.4rem;\n    padding-right: 0.25em;\n    margin: 0; }\n\n.keymap__search {\n  margin-top: 10px; }\n  .keymap__search .input-group {\n    width: 100%;\n    max-width: 350px;\n    float: left; }\n  .keymap__search_amount {\n    float: left;\n    margin: 7px 0 0 20px; }\n\n.keymap__description {\n  margin-bottom: 20px; }\n\n.keymap__list {\n  margin-top: 40px; }\n  .keymap__list_item {\n    margin-bottom: 50px; }\n  .keymap__list .btn-group-lg {\n    margin: 30px 0 0;\n    width: 100%;\n    text-align: center; }\n    .keymap__list .btn-group-lg .btn {\n      float: none;\n      padding-left: 50px;\n      padding-right: 50px; }\n"

/***/ }),
/* 725 */
/***/ (function(module, exports) {

module.exports = ":host {\n  width: 100%;\n  display: block; }\n\n.not-found {\n  margin-top: 30px;\n  font-size: 16px;\n  text-align: center; }\n"

/***/ }),
/* 726 */
/***/ (function(module, exports) {

module.exports = ":host {\n  display: block; }\n\n.keymap__is-default.fa-star-o {\n  cursor: pointer; }\n  .keymap__is-default.fa-star-o:hover {\n    color: #337ab7; }\n\n.keymap__remove {\n  font-size: 0.75em;\n  top: 8px; }\n  .keymap__remove:not(.disabled):hover {\n    cursor: pointer;\n    color: #900; }\n  .keymap__remove.disabled {\n    opacity: 0.25; }\n\n.keymap__duplicate {\n  font-size: 0.75em;\n  top: 7px;\n  margin-right: 15px;\n  position: relative; }\n  .keymap__duplicate:hover {\n    cursor: pointer;\n    color: #337ab7; }\n\n.layer__download {\n  top: 10px;\n  font-size: 0.8em;\n  position: relative;\n  margin-right: 10px; }\n  .layer__download:hover {\n    cursor: pointer;\n    color: #337ab7; }\n\n.pane-title {\n  margin-bottom: 1em; }\n  .pane-title__name, .pane-title__abbrev {\n    border: none;\n    border-bottom: 2px dotted #999;\n    padding: 0;\n    margin: 0 0.25rem; }\n    .pane-title__name:focus, .pane-title__abbrev:focus {\n      box-shadow: 0 0 0 1px #ccc, 0 0 5px 0 #ccc;\n      border-color: transparent; }\n  .pane-title__name {\n    width: 290px;\n    text-overflow: ellipsis; }\n  .pane-title__abbrev {\n    width: 90px;\n    text-align: center; }\n"

/***/ }),
/* 727 */
/***/ (function(module, exports) {

module.exports = ":host {\n  display: block; }\n  :host.disabled button {\n    cursor: no-drop;\n    background: rgba(204, 204, 204, 0.43);\n    pointer-events: none; }\n    :host.disabled button.btn-primary {\n      background: #7c7c7c;\n      border-color: #7c7c7c; }\n\nbutton {\n  margin: 2px; }\n\n.uhk__layer-switcher--wrapper {\n  position: relative;\n  margin-bottom: 2rem; }\n  .uhk__layer-switcher--wrapper:before {\n    content: attr(data-title);\n    display: inline-block;\n    position: absolute;\n    bottom: -0.3em;\n    right: 100%;\n    font-size: 2.4rem;\n    padding-right: 0.25em;\n    margin: 0; }\n"

/***/ }),
/* 728 */
/***/ (function(module, exports) {

module.exports = ":host {\n  display: flex;\n  flex-direction: column;\n  position: relative; }\n\n.macro-delay__presets {\n  margin-top: 1rem; }\n  .macro-delay__presets button {\n    margin-right: 0.25rem;\n    margin-bottom: 0.25rem; }\n"

/***/ }),
/* 729 */
/***/ (function(module, exports) {

module.exports = ".macro-key__container {\n  padding: 0; }\n\n.macro-key__types {\n  margin-left: 0;\n  padding: 0 0 1rem; }\n\n.macro-key__action {\n  padding-left: 3rem;\n  padding-bottom: 1rem; }\n  .macro-key__action-container {\n    margin-top: -1rem;\n    padding-top: 1rem;\n    border-left: 1px solid #ddd; }\n\n.fa {\n  min-width: 14px; }\n"

/***/ }),
/* 730 */
/***/ (function(module, exports) {

module.exports = ".macro-mouse__container {\n  padding: 0; }\n\n.macro-mouse__types {\n  border-right: 1px solid #ddd;\n  border-left: 0;\n  margin-top: -1rem;\n  margin-left: 0;\n  padding: 1rem 0; }\n\n.macro-mouse__actions {\n  padding-left: 3rem;\n  padding-bottom: 1rem; }\n\n.macro-mouse__buttons {\n  margin-top: 3rem;\n  margin-bottom: 1rem; }\n\n.fa {\n  min-width: 14px; }\n\n.form-horizontal .form-group {\n  margin: 0 0 0.5rem; }\n\n.form-horizontal label {\n  display: inline-block;\n  margin-right: 0.5rem; }\n\n.form-horizontal .form-control {\n  display: inline-block;\n  width: 60%; }\n"

/***/ }),
/* 731 */
/***/ (function(module, exports) {

module.exports = ":host {\n  display: flex;\n  flex-direction: column;\n  position: relative; }\n\n.macro__text-input {\n  width: 100%;\n  min-height: 10rem;\n  margin-bottom: 1rem; }\n"

/***/ }),
/* 732 */
/***/ (function(module, exports) {

module.exports = ":host {\n  width: 100%;\n  height: 100%;\n  display: block; }\n\n.not-found {\n  margin-top: 30px;\n  font-size: 16px;\n  text-align: center; }\n"

/***/ }),
/* 733 */
/***/ (function(module, exports) {

module.exports = ".macro__remove {\n  font-size: 0.75em;\n  top: 8px; }\n  .macro__remove:hover {\n    cursor: pointer;\n    color: #900; }\n\n.macro__duplicate {\n  font-size: 0.75em;\n  top: 7px;\n  margin-right: 15px;\n  position: relative; }\n  .macro__duplicate:hover {\n    cursor: pointer;\n    color: #337ab7; }\n\n.pane-title {\n  margin-bottom: 1em; }\n  .pane-title__name {\n    border: none;\n    border-bottom: 2px dotted #999;\n    padding: 0;\n    margin: 0 0.25rem;\n    width: 330px;\n    text-overflow: ellipsis; }\n    .pane-title__name:focus {\n      box-shadow: 0 0 0 1px #ccc, 0 0 5px 0 #ccc;\n      border-color: transparent; }\n"

/***/ }),
/* 734 */
/***/ (function(module, exports) {

module.exports = ":host {\n  overflow: hidden;\n  display: block; }\n  :host.macro-item:first-of-type .list-group-item {\n    border-radius: 4px 4px 0 0; }\n  :host.macro-item:last-of-type .list-group-item {\n    border-bottom: 0; }\n  :host.gu-transit {\n    opacity: 0.2; }\n    :host.gu-transit .list-group-item {\n      background: #f5f5f5; }\n\n.action--item {\n  display: flex;\n  flex-shrink: 0;\n  border: 0;\n  border-bottom: 1px solid #ddd; }\n  .action--item icon {\n    margin: 0 5px; }\n  .action--item > div {\n    display: flex;\n    flex: 1; }\n  .action--item:first-child {\n    border-radius: 0; }\n  .action--item.is-editing {\n    background: #f5f5f5; }\n  .action--item--wrap {\n    justify-content: space-between; }\n    .action--item--wrap.pointer:hover {\n      cursor: pointer;\n      color: #337ab7; }\n\n.action--title {\n  display: flex;\n  flex: 1; }\n\n.action--movable:hover {\n  cursor: move; }\n\n.list-group-item {\n  margin-bottom: 0; }\n\n.macro-action-editor__container {\n  padding-top: 0;\n  padding-bottom: 0;\n  border-radius: 0;\n  border: none;\n  overflow: hidden; }\n"

/***/ }),
/* 735 */
/***/ (function(module, exports) {

module.exports = ":host {\n  display: flex;\n  flex-direction: column;\n  height: 100%; }\n  :host .list-container {\n    display: flex;\n    flex: 1; }\n\n.main-wrapper {\n  width: 500px; }\n\nh1 {\n  margin-bottom: 3rem; }\n\n.action--edit__form {\n  background-color: #fff;\n  margin-left: -0.5rem;\n  margin-right: -15px;\n  margin-top: 15px;\n  padding-top: 15px;\n  border-top: 1px solid #ddd; }\n\n.action--item {\n  padding-left: 8px; }\n  .action--item.active, .action--item.active:hover {\n    background-color: white;\n    font-weight: bold;\n    color: black;\n    border-color: black;\n    z-index: 10; }\n\n.list-group {\n  overflow: auto; }\n\n.macro__name {\n  border-bottom: 2px dotted #999;\n  padding: 0 0.5rem;\n  margin: 0 0.25rem; }\n\n.macro-settings {\n  border: 1px solid black;\n  border-top-color: #999;\n  z-index: 100; }\n  .macro-settings .helper {\n    position: absolute;\n    display: block;\n    height: 13px;\n    background: #fff;\n    width: 100%;\n    left: 0;\n    top: -14px; }\n\n.action--item.active.callout,\n.macro-settings.callout {\n  box-shadow: 0 0 20px 0 rgba(0, 0, 0, 0.5); }\n\n.macro-actions-container {\n  margin-bottom: 0;\n  border-radius: 4px;\n  border: 1px solid #ddd;\n  border-bottom: 0; }\n\n.list-group-item .move-handle:hover {\n  cursor: move; }\n\n.flex-button-wrapper {\n  display: flex;\n  flex-direction: row-reverse; }\n\n.flex-button {\n  align-self: flex-end; }\n\n.add-new__action-container {\n  overflow: hidden;\n  flex-shrink: 0;\n  border-top: 1px solid #ddd; }\n\n.add-new__action-item {\n  border-radius: 0 0 4px 4px;\n  border-top: 0;\n  padding: 0; }\n  .add-new__action-item:hover {\n    cursor: pointer; }\n  .add-new__action-item--link {\n    width: 50%;\n    float: left;\n    padding: 10px 5px;\n    text-align: center;\n    color: #337ab7; }\n    .add-new__action-item--link:first-of-type {\n      border-right: 1px solid #ddd; }\n    .add-new__action-item--link:hover {\n      text-decoration: none;\n      background: #e6e6e6; }\n  .add-new__action-item .fa-circle {\n    color: #c00; }\n\n.gu-mirror {\n  position: fixed;\n  margin: 0;\n  z-index: 9999;\n  opacity: 0.8; }\n\n.gu-hide {\n  display: none; }\n\n.gu-unselectable {\n  -webkit-user-select: none;\n  -moz-user-select: none;\n  -ms-user-select: none;\n  user-select: none; }\n"

/***/ }),
/* 736 */
/***/ (function(module, exports) {

module.exports = ".not-found {\n  margin-top: 30px;\n  font-size: 16px;\n  text-align: center; }\n"

/***/ }),
/* 737 */
/***/ (function(module, exports) {

module.exports = ":host {\n  padding: 1rem 1.5rem;\n  box-shadow: 0 0 0 1px #000;\n  border-radius: 0.5rem;\n  position: absolute;\n  top: 2rem;\n  right: 2rem;\n  z-index: 10000;\n  background-color: #333;\n  color: #eee;\n  display: none; }\n\n.action {\n  margin-left: 1rem;\n  margin-right: 1rem;\n  color: #5bc0de;\n  text-transform: uppercase;\n  font-weight: bold; }\n  .action:focus, .action:active, .action:hover {\n    text-decoration: none;\n    color: #5bc0de; }\n\n.dismiss {\n  position: relative;\n  bottom: 1px;\n  color: #ccc; }\n  .dismiss:hover {\n    cursor: pointer;\n    color: #fff; }\n"

/***/ }),
/* 738 */
/***/ (function(module, exports) {

module.exports = ".popover {\n  display: flex;\n  flex-direction: column;\n  padding: 0;\n  max-width: 568px;\n  width: 100%;\n  user-select: none; }\n  .popover.leftArrow .arrowCustom {\n    transform: none;\n    left: 22px; }\n  .popover.rightArrow .arrowCustom {\n    transform: none;\n    right: 22px;\n    left: auto; }\n  .popover > .container-fluid {\n    overflow: hidden; }\n\n.nav-tabs > li {\n  overflow: hidden; }\n\n.arrowCustom {\n  position: absolute;\n  top: -16px;\n  left: 50%;\n  transform: translateX(-50%);\n  width: 41px;\n  height: 16px; }\n  .arrowCustom:before {\n    content: '';\n    width: 0;\n    height: 0;\n    border-left: 21px solid transparent;\n    border-right: 21px solid transparent;\n    border-bottom: 17px solid rgba(0, 0, 0, 0.2);\n    display: block;\n    position: absolute;\n    top: -1px; }\n  .arrowCustom:after {\n    content: '';\n    width: 0;\n    height: 0;\n    border-left: 20px solid transparent;\n    border-right: 20px solid transparent;\n    border-bottom: 16px solid #f7f7f7;\n    display: block;\n    position: absolute;\n    top: 0; }\n\n.popover-action {\n  padding: 8px 14px;\n  margin: 0;\n  font-size: 14px;\n  background-color: #f7f7f7;\n  border-top: 1px solid #ebebeb;\n  border-radius: 0 0 5px 5px;\n  text-align: right; }\n\n.popover-title.menu-tabs {\n  padding: 0.5rem 0.5rem 0;\n  display: block; }\n  .popover-title.menu-tabs .nav-tabs {\n    position: relative;\n    top: 1px;\n    display: flex; }\n    .popover-title.menu-tabs .nav-tabs .menu-tabs--item {\n      display: flex;\n      align-items: center;\n      cursor: pointer; }\n      .popover-title.menu-tabs .nav-tabs .menu-tabs--item i {\n        margin-right: 0.25em; }\n\n.popover-content {\n  padding: 10px 24px; }\n\n.popover-overlay {\n  position: fixed;\n  width: 100%;\n  height: 0;\n  top: 0;\n  left: 0;\n  z-index: 1050;\n  background: transparent;\n  transition: background 200ms ease-out, height 0ms 200ms linear; }\n  .popover-overlay.display {\n    height: 100%;\n    background: rgba(0, 0, 0, 0.2);\n    transition: background 200ms ease-out; }\n\n.select2-item {\n  position: relative;\n  font-size: 1.5rem; }\n  .select2-item.keymap-name--wrapper {\n    padding-left: 50px; }\n  .select2-item .layout-segment-code {\n    height: 2rem;\n    position: absolute;\n    left: 0;\n    top: 50%;\n    margin-top: -1rem; }\n"

/***/ }),
/* 739 */
/***/ (function(module, exports) {

module.exports = ":host {\n  display: flex;\n  flex-direction: column; }\n  :host > span {\n    text-align: center; }\n  :host > div {\n    display: flex;\n    margin-top: 2px; }\n    :host > div b {\n      display: flex;\n      align-items: center;\n      margin-right: 7px; }\n    :host > div select2 {\n      flex: 1; }\n  :host > div:last-child {\n    margin-top: 10px; }\n    :host > div:last-child img {\n      max-height: 100%;\n      max-width: 100%; }\n\n.empty {\n  display: flex; }\n  .empty img {\n    display: flex;\n    width: 100%;\n    height: 100%;\n    position: relative; }\n"

/***/ }),
/* 740 */
/***/ (function(module, exports) {

module.exports = ":host {\n  display: flex;\n  flex-direction: column;\n  position: relative; }\n  :host .scancode-options {\n    margin-bottom: 10px;\n    margin-top: 2px; }\n    :host .scancode-options > b {\n      position: relative;\n      top: 2px; }\n  :host .modifier-options > b {\n    position: relative;\n    top: -9px;\n    margin-right: 4px; }\n  :host .modifier-options .btn-toolbar {\n    display: inline-block; }\n  :host .long-press-container {\n    display: flex;\n    margin-top: 3rem; }\n    :host .long-press-container > b {\n      margin-right: 0.6em;\n      align-items: center;\n      display: flex; }\n    :host .long-press-container .secondary-role {\n      width: 135px; }\n    :host .long-press-container icon {\n      margin-left: 0.6em; }\n  :host .setting-label.disabled {\n    color: #999; }\n  :host .disabled-state--text {\n    display: none;\n    position: absolute;\n    top: 50%;\n    margin-top: -4rem;\n    color: #31708f;\n    padding-right: 40px; }\n    :host .disabled-state--text .fa {\n      font-size: 2.6rem;\n      float: left;\n      padding: 1rem 1.5rem 2rem; }\n  :host.disabled .scancode-options,\n  :host.disabled .modifier-options,\n  :host.disabled .long-press-container {\n    visibility: hidden; }\n  :host.disabled .disabled-state--text {\n    display: block; }\n"

/***/ }),
/* 741 */
/***/ (function(module, exports) {

module.exports = ":host {\n  display: flex;\n  margin: 0 -5px; }\n  :host.no-base {\n    justify-content: center; }\n  :host > span,\n  :host > select {\n    margin: 0 5px;\n    display: flex;\n    align-items: center; }\n\nselect {\n  background-color: #fff;\n  border: 1px solid #aaa;\n  border-radius: 4px;\n  padding: 4px 20px 4px 8px; }\n"

/***/ }),
/* 742 */
/***/ (function(module, exports) {

module.exports = ":host {\n  display: flex;\n  flex-direction: column; }\n  :host > span {\n    text-align: center; }\n  :host .macro-selector {\n    display: flex;\n    margin-top: 2px; }\n    :host .macro-selector b {\n      display: flex;\n      align-items: center;\n      margin-right: 7px; }\n    :host .macro-selector select2 {\n      flex: 1; }\n  :host .macro-action-container {\n    display: flex;\n    flex-direction: column;\n    min-height: 200px;\n    max-height: 300px;\n    margin: 20px 0;\n    overflow-x: hidden;\n    overflow-y: auto;\n    border-radius: 4px;\n    border: 1px solid #ddd; }\n    :host .macro-action-container .list-group {\n      margin-bottom: 0;\n      border: 0; }\n"

/***/ }),
/* 743 */
/***/ (function(module, exports) {

module.exports = ":host {\n  display: flex; }\n  :host.popover-content {\n    padding: 10px;\n    display: flex;\n    align-items: center; }\n  :host .mouse-action .nav {\n    border-right: 1px solid #ccc; }\n    :host .mouse-action .nav li a {\n      border-top-right-radius: 0;\n      border-bottom-right-radius: 0; }\n      :host .mouse-action .nav li a.selected {\n        font-style: italic; }\n    :host .mouse-action .nav li.active a.selected {\n      font-style: normal; }\n    :host .mouse-action .nav li.active a:after {\n      content: '';\n      display: block;\n      position: absolute;\n      width: 0;\n      height: 0;\n      top: 0;\n      right: -4rem;\n      border-color: transparent transparent transparent #337ab7;\n      border-style: solid;\n      border-width: 2rem; }\n  :host .help-text--mouse-speed {\n    margin-bottom: 2rem;\n    font-size: 0.9em;\n    color: #666; }\n    :host .help-text--mouse-speed p {\n      margin: 0; }\n  :host .details .btn-placeholder {\n    visibility: hidden; }\n\n.mouse__config--speed .btn-default {\n  font-size: 25px;\n  line-height: 22px;\n  padding-top: 4px;\n  padding-bottom: 4px; }\n  .mouse__config--speed .btn-default span {\n    font-size: 13px;\n    display: block;\n    text-align: center; }\n\n.help-text--mouse-speed.last-help {\n  margin-bottom: 0;\n  margin-top: 2rem; }\n"

/***/ }),
/* 744 */
/***/ (function(module, exports) {

module.exports = ":host {\n  display: flex;\n  justify-content: center;\n  padding: 2rem 0; }\n"

/***/ }),
/* 745 */
/***/ (function(module, exports) {

module.exports = "button {\n  display: inline-block;\n  margin: 0 0 0 0.25rem; }\n\n.fa-circle {\n  color: #c00; }\n"

/***/ }),
/* 746 */
/***/ (function(module, exports) {

module.exports = ":host {\n  display: flex;\n  align-items: center; }\n\n.action--edit:hover {\n  color: #337ab7;\n  cursor: pointer; }\n\n.action--trash:hover {\n  color: #d9534f;\n  cursor: pointer; }\n"

/***/ }),
/* 747 */
/***/ (function(module, exports) {

module.exports = ":host {\n  width: 100%;\n  height: 100%;\n  display: block; }\n"

/***/ }),
/* 748 */
/***/ (function(module, exports) {

module.exports = ":host {\n  background-color: #f5f5f5;\n  border-right: 1px solid #ccc;\n  position: fixed;\n  overflow-y: auto;\n  width: 250px;\n  height: 100%; }\n\na {\n  color: #333; }\n\nul {\n  padding: 0;\n  margin: 0; }\n  ul li {\n    list-style: none;\n    padding: 0; }\n  ul ul {\n    overflow: hidden; }\n\n.sidebar__level-1 {\n  padding: 0.5rem 1rem;\n  font-size: 2rem;\n  line-height: 3rem;\n  cursor: default; }\n  .sidebar__level-1:hover .fa-chevron-up,\n  .sidebar__level-1:hover .fa-chevron-down {\n    display: inline-block; }\n  .sidebar__level-1--item {\n    margin-top: 0; }\n    .sidebar__level-1--item:nth-child(1) {\n      margin: 0; }\n  .sidebar__level-1 .sidebar__name {\n    width: 100%;\n    display: block; }\n  .sidebar__level-1 .fa-chevron-up,\n  .sidebar__level-1 .fa-chevron-down {\n    margin-right: 1rem;\n    font-size: 1.5rem;\n    position: relative;\n    top: 0.5rem;\n    display: none;\n    cursor: pointer; }\n\n.sidebar__level-2--item {\n  padding: 0 20px 0 0;\n  position: relative; }\n  .sidebar__level-2--item.active {\n    background-color: #555;\n    color: #fff; }\n    .sidebar__level-2--item.active .fa-star {\n      color: #fff; }\n    .sidebar__level-2--item.active:hover {\n      background-color: #555; }\n  .sidebar__level-2--item:hover {\n    cursor: pointer; }\n  .sidebar__level-2--item .fa.pull-right {\n    position: relative;\n    top: 2px; }\n  .sidebar__level-2--item .fa-star {\n    color: #666; }\n  .sidebar__level-2--item a {\n    display: block;\n    width: 100%;\n    padding: 0 15px 0 30px; }\n    .sidebar__level-2--item a:hover, .sidebar__level-2--item a:focus {\n      text-decoration: none; }\n\n.sidebar__level-1:hover, .sidebar__level-2:hover {\n  background-color: rgba(0, 0, 0, 0.05); }\n\n.sidebar__level-1.active, .sidebar__level-2.active {\n  background-color: rgba(0, 0, 0, 0.18); }\n\n.sidebar__fav {\n  position: absolute;\n  right: 19px;\n  top: 3px; }\n\n.menu--bottom {\n  position: absolute;\n  bottom: 0;\n  left: 0;\n  width: 100%; }\n  .menu--bottom .sidebar__level-1 {\n    display: block;\n    padding: 1rem;\n    cursor: pointer; }\n    .menu--bottom .sidebar__level-1:hover {\n      text-decoration: none; }\n"

/***/ }),
/* 749 */
/***/ (function(module, exports) {

module.exports = ":host {\n  display: flex;\n  width: 100%;\n  height: 100%;\n  position: relative; }\n"

/***/ }),
/* 750 */
/***/ (function(module, exports) {

module.exports = ":host {\n  cursor: pointer;\n  outline: none; }\n  :host /deep/ text {\n    dominant-baseline: central; }\n  :host:hover {\n    fill: #494949; }\n"

/***/ }),
/* 751 */
/***/ (function(module, exports) {

module.exports = ".disabled {\n  fill: gray; }\n\ntext {\n  font-size: 100px; }\n"

/***/ }),
/* 752 */
/***/ (function(module, exports) {

module.exports = ":host {\n  position: relative; }\n"

/***/ }),
/* 753 */
/***/ (function(module, exports) {

module.exports = ":host {\n  width: 100%;\n  display: block; }\n  :host.space {\n    margin-bottom: 405px; }\n\nkeyboard-slider {\n  display: block;\n  position: relative;\n  overflow: hidden;\n  /* TODO create dynamic */\n  height: 500px;\n  margin-top: 30px; }\n\n.tooltip {\n  position: fixed;\n  transform: translate(-50%, -6px);\n  display: none; }\n  .tooltip-inner {\n    background: #fff;\n    color: #000;\n    box-shadow: 0 1px 5px #000;\n    text-align: left; }\n    .tooltip-inner p {\n      margin-bottom: 2px; }\n      .tooltip-inner p:last-of-type {\n        margin-bottom: 0; }\n  .tooltip.bottom .tooltip-arrow {\n    border-bottom-color: #fff;\n    top: 1px; }\n  .tooltip.in {\n    display: block;\n    opacity: 1; }\n"

/***/ }),
/* 754 */
/***/ (function(module, exports) {

module.exports = "main-app {\n  display: block;\n  overflow: hidden;\n  position: relative; }\n\n.select2-container--default .select2-selection--single .select2-selection__rendered {\n  line-height: 26px; }\n\n.main-content {\n  margin-left: 250px; }\n\n.select2-container {\n  z-index: 1100; }\n  .select2-container .scancode--searchterm {\n    text-align: right;\n    color: #b7b7b7; }\n\n.select2-item {\n  display: flex;\n  justify-content: space-between; }\n\n.select2-results {\n  text-align: left; }\n\n.nav-pills > li > a {\n  cursor: pointer; }\n\n.select2-container--default .select2-dropdown--below .select2-results > .select2-results__options {\n  max-height: 300px; }\n"

/***/ }),
/* 755 */
/***/ (function(module, exports) {

module.exports = "/* GitHub ribbon */\n.github-fork-ribbon {\n  background-color: #a00;\n  overflow: hidden;\n  white-space: nowrap;\n  position: fixed;\n  right: -50px;\n  bottom: 40px;\n  z-index: 2000;\n  /* stylelint-disable indentation */\n  -webkit-transform: rotate(-45deg);\n  -moz-transform: rotate(-45deg);\n  -ms-transform: rotate(-45deg);\n  -o-transform: rotate(-45deg);\n  transform: rotate(-45deg);\n  -webkit-box-shadow: 0 0 10px #888;\n  -moz-box-shadow: 0 0 10px #888;\n  box-shadow: 0 0 10px #888;\n  /* stylelint-enable indentation */ }\n  .github-fork-ribbon a {\n    border: 1px solid #faa;\n    color: #fff;\n    display: block;\n    font: bold 81.25% 'Helvetica Neue', Helvetica, Arial, sans-serif;\n    margin: 1px 0;\n    padding: 10px 50px;\n    text-align: center;\n    text-decoration: none;\n    text-shadow: 0 0 5px #444; }\n\nmain-app {\n  min-height: 100vh;\n  width: 100%; }\n"

/***/ }),
/* 756 */
/***/ (function(module, exports, __webpack_require__) {

module.exports = __webpack_require__(78)


/***/ }),
/* 757 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var Buffer = __webpack_require__(56).Buffer;
/*<replacement>*/
var bufferShim = __webpack_require__(251);
/*</replacement>*/

module.exports = BufferList;

function BufferList() {
  this.head = null;
  this.tail = null;
  this.length = 0;
}

BufferList.prototype.push = function (v) {
  var entry = { data: v, next: null };
  if (this.length > 0) this.tail.next = entry;else this.head = entry;
  this.tail = entry;
  ++this.length;
};

BufferList.prototype.unshift = function (v) {
  var entry = { data: v, next: this.head };
  if (this.length === 0) this.tail = entry;
  this.head = entry;
  ++this.length;
};

BufferList.prototype.shift = function () {
  if (this.length === 0) return;
  var ret = this.head.data;
  if (this.length === 1) this.head = this.tail = null;else this.head = this.head.next;
  --this.length;
  return ret;
};

BufferList.prototype.clear = function () {
  this.head = this.tail = null;
  this.length = 0;
};

BufferList.prototype.join = function (s) {
  if (this.length === 0) return '';
  var p = this.head;
  var ret = '' + p.data;
  while (p = p.next) {
    ret += s + p.data;
  }return ret;
};

BufferList.prototype.concat = function (n) {
  if (this.length === 0) return bufferShim.alloc(0);
  if (this.length === 1) return this.head.data;
  var ret = bufferShim.allocUnsafe(n >>> 0);
  var p = this.head;
  var i = 0;
  while (p) {
    p.data.copy(ret, i);
    i += p.data.length;
    p = p.next;
  }
  return ret;
};

/***/ }),
/* 758 */
/***/ (function(module, exports, __webpack_require__) {

module.exports = __webpack_require__(407)


/***/ }),
/* 759 */
/***/ (function(module, exports, __webpack_require__) {

/* WEBPACK VAR INJECTION */(function(process) {var Stream = (function (){
  try {
    return __webpack_require__(191); // hack to fix a circular dependency issue when used with browserify
  } catch(_){}
}());
exports = module.exports = __webpack_require__(408);
exports.Stream = Stream || exports;
exports.Readable = exports;
exports.Writable = __webpack_require__(271);
exports.Duplex = __webpack_require__(78);
exports.Transform = __webpack_require__(270);
exports.PassThrough = __webpack_require__(407);

if (!process.browser && process.env.READABLE_STREAM === 'disable' && Stream) {
  module.exports = Stream;
}

/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(32)))

/***/ }),
/* 760 */
/***/ (function(module, exports, __webpack_require__) {

module.exports = __webpack_require__(270)


/***/ }),
/* 761 */
/***/ (function(module, exports, __webpack_require__) {

module.exports = __webpack_require__(271)


/***/ }),
/* 762 */,
/* 763 */,
/* 764 */,
/* 765 */,
/* 766 */,
/* 767 */,
/* 768 */,
/* 769 */,
/* 770 */,
/* 771 */,
/* 772 */,
/* 773 */,
/* 774 */,
/* 775 */,
/* 776 */,
/* 777 */,
/* 778 */,
/* 779 */,
/* 780 */,
/* 781 */,
/* 782 */,
/* 783 */,
/* 784 */,
/* 785 */,
/* 786 */,
/* 787 */,
/* 788 */,
/* 789 */,
/* 790 */,
/* 791 */,
/* 792 */,
/* 793 */,
/* 794 */,
/* 795 */,
/* 796 */,
/* 797 */,
/* 798 */,
/* 799 */,
/* 800 */,
/* 801 */,
/* 802 */,
/* 803 */,
/* 804 */,
/* 805 */,
/* 806 */,
/* 807 */,
/* 808 */,
/* 809 */,
/* 810 */,
/* 811 */,
/* 812 */,
/* 813 */,
/* 814 */,
/* 815 */,
/* 816 */,
/* 817 */,
/* 818 */,
/* 819 */,
/* 820 */,
/* 821 */,
/* 822 */,
/* 823 */,
/* 824 */,
/* 825 */,
/* 826 */,
/* 827 */,
/* 828 */,
/* 829 */,
/* 830 */,
/* 831 */,
/* 832 */,
/* 833 */,
/* 834 */,
/* 835 */,
/* 836 */,
/* 837 */,
/* 838 */,
/* 839 */,
/* 840 */,
/* 841 */,
/* 842 */,
/* 843 */,
/* 844 */,
/* 845 */,
/* 846 */,
/* 847 */,
/* 848 */,
/* 849 */,
/* 850 */,
/* 851 */,
/* 852 */,
/* 853 */,
/* 854 */,
/* 855 */,
/* 856 */,
/* 857 */,
/* 858 */,
/* 859 */,
/* 860 */,
/* 861 */,
/* 862 */,
/* 863 */,
/* 864 */,
/* 865 */,
/* 866 */,
/* 867 */,
/* 868 */,
/* 869 */,
/* 870 */,
/* 871 */,
/* 872 */,
/* 873 */,
/* 874 */,
/* 875 */,
/* 876 */,
/* 877 */,
/* 878 */,
/* 879 */,
/* 880 */,
/* 881 */,
/* 882 */,
/* 883 */,
/* 884 */,
/* 885 */,
/* 886 */,
/* 887 */,
/* 888 */,
/* 889 */,
/* 890 */,
/* 891 */,
/* 892 */,
/* 893 */,
/* 894 */,
/* 895 */,
/* 896 */,
/* 897 */,
/* 898 */,
/* 899 */,
/* 900 */,
/* 901 */,
/* 902 */,
/* 903 */,
/* 904 */,
/* 905 */,
/* 906 */,
/* 907 */,
/* 908 */,
/* 909 */,
/* 910 */,
/* 911 */,
/* 912 */,
/* 913 */,
/* 914 */,
/* 915 */,
/* 916 */,
/* 917 */,
/* 918 */,
/* 919 */,
/* 920 */,
/* 921 */,
/* 922 */,
/* 923 */,
/* 924 */,
/* 925 */,
/* 926 */,
/* 927 */,
/* 928 */,
/* 929 */,
/* 930 */,
/* 931 */,
/* 932 */,
/* 933 */,
/* 934 */,
/* 935 */,
/* 936 */,
/* 937 */,
/* 938 */,
/* 939 */,
/* 940 */,
/* 941 */,
/* 942 */,
/* 943 */,
/* 944 */,
/* 945 */,
/* 946 */,
/* 947 */,
/* 948 */,
/* 949 */,
/* 950 */,
/* 951 */,
/* 952 */,
/* 953 */,
/* 954 */,
/* 955 */,
/* 956 */,
/* 957 */,
/* 958 */,
/* 959 */,
/* 960 */,
/* 961 */,
/* 962 */,
/* 963 */,
/* 964 */,
/* 965 */,
/* 966 */,
/* 967 */,
/* 968 */,
/* 969 */,
/* 970 */,
/* 971 */,
/* 972 */,
/* 973 */,
/* 974 */,
/* 975 */,
/* 976 */,
/* 977 */,
/* 978 */,
/* 979 */,
/* 980 */,
/* 981 */,
/* 982 */,
/* 983 */,
/* 984 */,
/* 985 */,
/* 986 */,
/* 987 */,
/* 988 */,
/* 989 */,
/* 990 */,
/* 991 */,
/* 992 */,
/* 993 */,
/* 994 */,
/* 995 */,
/* 996 */,
/* 997 */,
/* 998 */,
/* 999 */,
/* 1000 */,
/* 1001 */,
/* 1002 */,
/* 1003 */,
/* 1004 */,
/* 1005 */,
/* 1006 */,
/* 1007 */,
/* 1008 */,
/* 1009 */,
/* 1010 */,
/* 1011 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var add_on_component_1 = __webpack_require__(443);
exports.addOnRoutes = [
    {
        path: 'add-on/:name',
        component: add_on_component_1.AddOnComponent
    }
];


/***/ }),
/* 1012 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var keyboard_slider_component_1 = __webpack_require__(1013);
exports.KeyboardSliderComponent = keyboard_slider_component_1.KeyboardSliderComponent;


/***/ }),
/* 1013 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
var core_1 = __webpack_require__(0);
var KeyboardSliderComponent = (function () {
    function KeyboardSliderComponent() {
        this.keyClick = new core_1.EventEmitter();
        this.keyHover = new core_1.EventEmitter();
        this.capture = new core_1.EventEmitter();
    }
    KeyboardSliderComponent.prototype.ngOnChanges = function (changes) {
        if (changes['layers']) {
            this.layerAnimationState = this.layers.map(function () { return 'leftOut'; });
            this.layerAnimationState[this.currentLayer] = 'leftIn';
        }
        var layerChange = changes['currentLayer'];
        if (layerChange) {
            var prevValue = layerChange.isFirstChange() ? layerChange.currentValue : layerChange.previousValue;
            this.onLayerChange(prevValue, layerChange.currentValue);
        }
    };
    KeyboardSliderComponent.prototype.trackKeyboard = function (index) {
        return index;
    };
    KeyboardSliderComponent.prototype.onLayerChange = function (oldIndex, index) {
        if (index > oldIndex) {
            this.layerAnimationState[oldIndex] = 'leftOut';
            this.layerAnimationState[index] = 'leftIn';
        }
        else {
            this.layerAnimationState[oldIndex] = 'rightOut';
            this.layerAnimationState[index] = 'rightIn';
        }
    };
    return KeyboardSliderComponent;
}());
__decorate([
    core_1.Input(),
    __metadata("design:type", Array)
], KeyboardSliderComponent.prototype, "layers", void 0);
__decorate([
    core_1.Input(),
    __metadata("design:type", Number)
], KeyboardSliderComponent.prototype, "currentLayer", void 0);
__decorate([
    core_1.Input(),
    __metadata("design:type", Boolean)
], KeyboardSliderComponent.prototype, "keybindAnimationEnabled", void 0);
__decorate([
    core_1.Input(),
    __metadata("design:type", Boolean)
], KeyboardSliderComponent.prototype, "capturingEnabled", void 0);
__decorate([
    core_1.Output(),
    __metadata("design:type", Object)
], KeyboardSliderComponent.prototype, "keyClick", void 0);
__decorate([
    core_1.Output(),
    __metadata("design:type", Object)
], KeyboardSliderComponent.prototype, "keyHover", void 0);
__decorate([
    core_1.Output(),
    __metadata("design:type", Object)
], KeyboardSliderComponent.prototype, "capture", void 0);
KeyboardSliderComponent = __decorate([
    core_1.Component({
        selector: 'keyboard-slider',
        template: __webpack_require__(671),
        styles: [__webpack_require__(723)],
        changeDetection: core_1.ChangeDetectionStrategy.OnPush,
        // We use 101%, because there was still a trace of the keyboard in the screen when animation was done
        animations: [
            core_1.trigger('layerState', [
                core_1.state('leftIn, rightIn', core_1.style({
                    transform: 'translateX(-50%)',
                    left: '50%'
                })),
                core_1.state('leftOut', core_1.style({
                    transform: 'translateX(-101%)',
                    left: '0'
                })),
                core_1.state('rightOut', core_1.style({
                    transform: 'translateX(0)',
                    left: '101%'
                })),
                core_1.transition('leftOut => leftIn, rightOut => leftIn', [
                    core_1.animate('400ms ease-out', core_1.keyframes([
                        core_1.style({ transform: 'translateX(0%)', left: '101%', offset: 0 }),
                        core_1.style({ transform: 'translateX(-50%)', left: '50%', offset: 1 })
                    ]))
                ]),
                core_1.transition('leftIn => leftOut, rightIn => leftOut', [
                    core_1.animate('400ms ease-out', core_1.keyframes([
                        core_1.style({ transform: 'translateX(-50%)', left: '50%', offset: 0 }),
                        core_1.style({ transform: 'translateX(-101%)', left: '0%', offset: 1 })
                    ]))
                ]),
                core_1.transition('* => rightIn', [
                    core_1.animate('400ms ease-out', core_1.keyframes([
                        core_1.style({ transform: 'translateX(-101%)', left: '0%', offset: 0 }),
                        core_1.style({ transform: 'translateX(-50%)', left: '50%', offset: 1 })
                    ]))
                ]),
                core_1.transition('* => rightOut', [
                    core_1.animate('400ms ease-out', core_1.keyframes([
                        core_1.style({ transform: 'translateX(-50%)', left: '50%', offset: 0 }),
                        core_1.style({ transform: 'translateX(0%)', left: '101%', offset: 1 })
                    ]))
                ]),
                core_1.transition(':leave', [
                    core_1.animate('2000ms ease-out', core_1.keyframes([
                        core_1.style({ opacity: 1, offset: 0 }),
                        core_1.style({ opacity: 0, offset: 1 })
                    ]))
                ])
            ])
        ]
    })
], KeyboardSliderComponent);
exports.KeyboardSliderComponent = KeyboardSliderComponent;


/***/ }),
/* 1014 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
var core_1 = __webpack_require__(0);
var router_1 = __webpack_require__(45);
var Observable_1 = __webpack_require__(1);
__webpack_require__(178);
__webpack_require__(122);
__webpack_require__(123);
__webpack_require__(273);
var store_1 = __webpack_require__(9);
var user_configuration_1 = __webpack_require__(55);
var KeymapEditGuard = (function () {
    function KeymapEditGuard(store, router) {
        this.store = store;
        this.router = router;
    }
    KeymapEditGuard.prototype.canActivate = function () {
        var _this = this;
        return this.store
            .let(user_configuration_1.getKeymaps())
            .do(function (keymaps) {
            var defaultKeymap = keymaps.find(function (keymap) { return keymap.isDefault; });
            _this.router.navigate(['/keymap', defaultKeymap.abbreviation]);
        })
            .switchMap(function () { return Observable_1.Observable.of(false); });
    };
    return KeymapEditGuard;
}());
KeymapEditGuard = __decorate([
    core_1.Injectable(),
    __metadata("design:paramtypes", [store_1.Store, router_1.Router])
], KeymapEditGuard);
exports.KeymapEditGuard = KeymapEditGuard;


/***/ }),
/* 1015 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
var core_1 = __webpack_require__(0);
var store_1 = __webpack_require__(9);
var Keymap_1 = __webpack_require__(80);
var actions_1 = __webpack_require__(54);
var KeymapHeaderComponent = (function () {
    function KeymapHeaderComponent(store, renderer) {
        this.store = store;
        this.renderer = renderer;
        this.downloadClick = new core_1.EventEmitter();
    }
    KeymapHeaderComponent.prototype.ngOnChanges = function (changes) {
        if (changes['keymap']) {
            this.setKeymapTitle();
        }
        if (changes['deletable']) {
            this.setTrashTitle();
        }
    };
    KeymapHeaderComponent.prototype.setDefault = function () {
        if (!this.keymap.isDefault) {
            this.store.dispatch(actions_1.KeymapActions.setDefault(this.keymap.abbreviation));
        }
    };
    KeymapHeaderComponent.prototype.removeKeymap = function () {
        if (this.deletable) {
            this.store.dispatch(actions_1.KeymapActions.removeKeymap(this.keymap.abbreviation));
        }
    };
    KeymapHeaderComponent.prototype.duplicateKeymap = function () {
        this.store.dispatch(actions_1.KeymapActions.duplicateKeymap(this.keymap));
    };
    KeymapHeaderComponent.prototype.editKeymapName = function (name) {
        if (name.length === 0) {
            this.renderer.setElementProperty(this.keymapName.nativeElement, 'value', this.keymap.name);
            return;
        }
        this.store.dispatch(actions_1.KeymapActions.editKeymapName(this.keymap.abbreviation, name));
    };
    KeymapHeaderComponent.prototype.editKeymapAbbr = function (newAbbr) {
        if (newAbbr.length !== 3) {
            this.renderer.setElementProperty(this.keymapAbbr.nativeElement, 'value', this.keymap.abbreviation);
            return;
        }
        newAbbr = newAbbr.toUpperCase();
        this.store.dispatch(actions_1.KeymapActions.editKeymapAbbr(this.keymap.abbreviation, newAbbr));
    };
    KeymapHeaderComponent.prototype.setKeymapTitle = function () {
        this.starTitle = this.keymap.isDefault
            ? 'This is the default keymap which gets activated when powering the keyboard.'
            : 'Makes this keymap the default keymap which gets activated when powering the keyboard.';
    };
    KeymapHeaderComponent.prototype.setTrashTitle = function () {
        this.trashTitle = this.deletable ? '' : 'The last keymap cannot be deleted.';
    };
    KeymapHeaderComponent.prototype.onDownloadIconClick = function () {
        this.downloadClick.emit();
    };
    return KeymapHeaderComponent;
}());
__decorate([
    core_1.Input(),
    __metadata("design:type", Keymap_1.Keymap)
], KeymapHeaderComponent.prototype, "keymap", void 0);
__decorate([
    core_1.Input(),
    __metadata("design:type", Boolean)
], KeymapHeaderComponent.prototype, "deletable", void 0);
__decorate([
    core_1.Output(),
    __metadata("design:type", Object)
], KeymapHeaderComponent.prototype, "downloadClick", void 0);
__decorate([
    core_1.ViewChild('name'),
    __metadata("design:type", core_1.ElementRef)
], KeymapHeaderComponent.prototype, "keymapName", void 0);
__decorate([
    core_1.ViewChild('abbr'),
    __metadata("design:type", core_1.ElementRef)
], KeymapHeaderComponent.prototype, "keymapAbbr", void 0);
KeymapHeaderComponent = __decorate([
    core_1.Component({
        selector: 'keymap-header',
        template: __webpack_require__(674),
        styles: [__webpack_require__(726)],
        changeDetection: core_1.ChangeDetectionStrategy.OnPush
    }),
    __metadata("design:paramtypes", [store_1.Store, core_1.Renderer])
], KeymapHeaderComponent);
exports.KeymapHeaderComponent = KeymapHeaderComponent;


/***/ }),
/* 1016 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

function __export(m) {
    for (var p in m) if (!exports.hasOwnProperty(p)) exports[p] = m[p];
}
Object.defineProperty(exports, "__esModule", { value: true });
__export(__webpack_require__(445));
__export(__webpack_require__(447));
__export(__webpack_require__(1015));


/***/ }),
/* 1017 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

function __export(m) {
    for (var p in m) if (!exports.hasOwnProperty(p)) exports[p] = m[p];
}
Object.defineProperty(exports, "__esModule", { value: true });
__export(__webpack_require__(1018));


/***/ }),
/* 1018 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
var core_1 = __webpack_require__(0);
var LayersComponent = (function () {
    function LayersComponent() {
        this.select = new core_1.EventEmitter();
        this.buttons = ['Base', 'Mod', 'Fn', 'Mouse'];
        this.current = 0;
    }
    LayersComponent.prototype.selectLayer = function (index) {
        if (this.current === index) {
            return;
        }
        this.select.emit({
            oldIndex: this.current,
            index: index
        });
        this.current = index;
    };
    return LayersComponent;
}());
__decorate([
    core_1.Input(),
    __metadata("design:type", Number)
], LayersComponent.prototype, "current", void 0);
__decorate([
    core_1.Output(),
    __metadata("design:type", Object)
], LayersComponent.prototype, "select", void 0);
LayersComponent = __decorate([
    core_1.Component({
        selector: 'layers',
        template: __webpack_require__(675),
        styles: [__webpack_require__(727)]
    }),
    __metadata("design:paramtypes", [])
], LayersComponent);
exports.LayersComponent = LayersComponent;


/***/ }),
/* 1019 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var macro_action_editor_component_1 = __webpack_require__(1020);
exports.MacroActionEditorComponent = macro_action_editor_component_1.MacroActionEditorComponent;


/***/ }),
/* 1020 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
var core_1 = __webpack_require__(0);
var macro_action_1 = __webpack_require__(69);
var TabName;
(function (TabName) {
    TabName[TabName["Keypress"] = 0] = "Keypress";
    TabName[TabName["Text"] = 1] = "Text";
    TabName[TabName["Mouse"] = 2] = "Mouse";
    TabName[TabName["Delay"] = 3] = "Delay";
})(TabName || (TabName = {}));
;
var MacroActionEditorComponent = (function () {
    function MacroActionEditorComponent() {
        this.save = new core_1.EventEmitter();
        this.cancel = new core_1.EventEmitter();
        /* tslint:disable:variable-name: It is an enum type. So it can start with uppercase. */
        /* tslint:disable:no-unused-variable: It is used in the template. */
        this.TabName = TabName;
    }
    /* tslint:enable:no-unused-variable */
    /* tslint:enable:variable-name */
    MacroActionEditorComponent.prototype.ngOnInit = function () {
        var macroAction = this.macroAction ? this.macroAction : new macro_action_1.TextMacroAction();
        this.editableMacroAction = new macro_action_1.EditableMacroAction(macroAction.toJsonObject());
        var tab = this.getTabName(this.editableMacroAction);
        this.activeTab = tab;
    };
    MacroActionEditorComponent.prototype.onCancelClick = function () {
        this.cancel.emit();
    };
    MacroActionEditorComponent.prototype.onSaveClick = function () {
        try {
            var action = this.editableMacroAction;
            if (action.isKeyAction()) {
                // Could updating the saved keys be done in a better way?
                var tab = this.selectedTab;
                action.fromKeyAction(tab.getKeyAction());
            }
            this.save.emit(action.toClass());
        }
        catch (e) {
            // TODO: show error dialog
            console.error(e);
        }
    };
    MacroActionEditorComponent.prototype.selectTab = function (tab) {
        this.activeTab = tab;
        this.editableMacroAction.macroActionType = this.getTabMacroActionType(tab);
    };
    MacroActionEditorComponent.prototype.getTabName = function (action) {
        switch (action.macroActionType) {
            // Delay action
            case macro_action_1.macroActionType.DelayMacroAction:
                return TabName.Delay;
            // Text action
            case macro_action_1.macroActionType.TextMacroAction:
                return TabName.Text;
            // Keypress actions
            case macro_action_1.macroActionType.KeyMacroAction:
                return TabName.Keypress;
            // Mouse actions
            case macro_action_1.macroActionType.MouseButtonMacroAction:
            case macro_action_1.macroActionType.MoveMouseMacroAction:
            case macro_action_1.macroActionType.ScrollMouseMacroAction:
                return TabName.Mouse;
            default:
                return TabName.Keypress;
        }
    };
    MacroActionEditorComponent.prototype.getTabMacroActionType = function (tab) {
        switch (tab) {
            case TabName.Delay:
                return macro_action_1.macroActionType.DelayMacroAction;
            case TabName.Keypress:
                return macro_action_1.macroActionType.KeyMacroAction;
            case TabName.Mouse:
                return macro_action_1.macroActionType.MouseButtonMacroAction;
            case TabName.Text:
                return macro_action_1.macroActionType.TextMacroAction;
            default:
                throw new Error('Could not get macro action type');
        }
    };
    return MacroActionEditorComponent;
}());
__decorate([
    core_1.Input(),
    __metadata("design:type", macro_action_1.MacroAction)
], MacroActionEditorComponent.prototype, "macroAction", void 0);
__decorate([
    core_1.Output(),
    __metadata("design:type", Object)
], MacroActionEditorComponent.prototype, "save", void 0);
__decorate([
    core_1.Output(),
    __metadata("design:type", Object)
], MacroActionEditorComponent.prototype, "cancel", void 0);
__decorate([
    core_1.ViewChild('tab'),
    __metadata("design:type", Object)
], MacroActionEditorComponent.prototype, "selectedTab", void 0);
MacroActionEditorComponent = __decorate([
    core_1.Component({
        selector: 'macro-action-editor',
        template: __webpack_require__(676),
        styles: [__webpack_require__(269)],
        host: { 'class': 'macro-action-editor' }
    })
], MacroActionEditorComponent);
exports.MacroActionEditorComponent = MacroActionEditorComponent;


/***/ }),
/* 1021 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var macro_delay_component_1 = __webpack_require__(1022);
exports.MacroDelayTabComponent = macro_delay_component_1.MacroDelayTabComponent;


/***/ }),
/* 1022 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
var core_1 = __webpack_require__(0);
var macro_action_1 = __webpack_require__(69);
var INITIAL_DELAY = 0.5; // In seconds
var MacroDelayTabComponent = (function () {
    /* tslint:enable:no-unused-variable */
    function MacroDelayTabComponent() {
        /* tslint:disable:no-unused-variable: It is used in the template. */
        this.presets = [0.3, 0.5, 0.8, 1, 2, 3, 4, 5];
    }
    MacroDelayTabComponent.prototype.ngOnInit = function () {
        this.delay = this.macroAction.delay > 0 ? this.macroAction.delay / 1000 : INITIAL_DELAY;
    };
    MacroDelayTabComponent.prototype.setDelay = function (value) {
        this.delay = value;
        this.macroAction.delay = this.delay * 1000;
    };
    return MacroDelayTabComponent;
}());
__decorate([
    core_1.Input(),
    __metadata("design:type", macro_action_1.EditableMacroAction)
], MacroDelayTabComponent.prototype, "macroAction", void 0);
__decorate([
    core_1.ViewChild('macroDelayInput'),
    __metadata("design:type", core_1.ElementRef)
], MacroDelayTabComponent.prototype, "input", void 0);
MacroDelayTabComponent = __decorate([
    core_1.Component({
        selector: 'macro-delay-tab',
        template: __webpack_require__(677),
        styles: [__webpack_require__(728)],
        host: { 'class': 'macro__delay' },
        changeDetection: core_1.ChangeDetectionStrategy.OnPush
    }),
    __metadata("design:paramtypes", [])
], MacroDelayTabComponent);
exports.MacroDelayTabComponent = MacroDelayTabComponent;


/***/ }),
/* 1023 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var delay_1 = __webpack_require__(1021);
exports.MacroDelayTabComponent = delay_1.MacroDelayTabComponent;
var key_1 = __webpack_require__(1024);
exports.MacroKeyTabComponent = key_1.MacroKeyTabComponent;
var mouse_1 = __webpack_require__(1026);
exports.MacroMouseTabComponent = mouse_1.MacroMouseTabComponent;
var text_1 = __webpack_require__(1028);
exports.MacroTextTabComponent = text_1.MacroTextTabComponent;


/***/ }),
/* 1024 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var macro_key_component_1 = __webpack_require__(1025);
exports.MacroKeyTabComponent = macro_key_component_1.MacroKeyTabComponent;


/***/ }),
/* 1025 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
var core_1 = __webpack_require__(0);
var macro_action_1 = __webpack_require__(69);
var tab_1 = __webpack_require__(193);
var tab_2 = __webpack_require__(193);
var TabName;
(function (TabName) {
    TabName[TabName["Keypress"] = 0] = "Keypress";
    TabName[TabName["Hold"] = 1] = "Hold";
    TabName[TabName["Release"] = 2] = "Release";
})(TabName || (TabName = {}));
var MacroKeyTabComponent = (function () {
    function MacroKeyTabComponent() {
        /* tslint:disable:variable-name: It is an enum type. So it can start with uppercase. */
        /* tslint:disable:no-unused-variable: It is used in the template. */
        this.TabName = TabName;
    }
    /* tslint:enable:no-unused-variable */
    /* tslint:enable:variable-name */
    MacroKeyTabComponent.prototype.ngOnInit = function () {
        this.defaultKeyAction = this.macroAction.toKeystrokeAction();
        this.selectTab(this.getTabName(this.macroAction));
    };
    MacroKeyTabComponent.prototype.selectTab = function (tab) {
        this.activeTab = tab;
        this.macroAction.action = this.getActionType(tab);
    };
    MacroKeyTabComponent.prototype.getTabName = function (action) {
        if (!action.action || action.isOnlyPressAction()) {
            return TabName.Keypress;
        }
        else if (action.isOnlyHoldAction()) {
            return TabName.Hold;
        }
        else if (action.isOnlyReleaseAction()) {
            return TabName.Release;
        }
    };
    MacroKeyTabComponent.prototype.getActionType = function (tab) {
        switch (tab) {
            case TabName.Keypress:
                return macro_action_1.MacroSubAction.press;
            case TabName.Hold:
                return macro_action_1.MacroSubAction.hold;
            case TabName.Release:
                return macro_action_1.MacroSubAction.release;
            default:
                throw new Error('Invalid tab type');
        }
    };
    MacroKeyTabComponent.prototype.getKeyAction = function () {
        return this.keypressTab.toKeyAction();
    };
    return MacroKeyTabComponent;
}());
__decorate([
    core_1.Input(),
    __metadata("design:type", macro_action_1.EditableMacroAction)
], MacroKeyTabComponent.prototype, "macroAction", void 0);
__decorate([
    core_1.ViewChild('tab'),
    __metadata("design:type", tab_2.Tab)
], MacroKeyTabComponent.prototype, "selectedTab", void 0);
__decorate([
    core_1.ViewChild('keypressTab'),
    __metadata("design:type", tab_1.KeypressTabComponent)
], MacroKeyTabComponent.prototype, "keypressTab", void 0);
MacroKeyTabComponent = __decorate([
    core_1.Component({
        selector: 'macro-key-tab',
        template: __webpack_require__(678),
        styles: [
            __webpack_require__(269),
            __webpack_require__(729)
        ],
        host: { 'class': 'macro__mouse' }
    })
], MacroKeyTabComponent);
exports.MacroKeyTabComponent = MacroKeyTabComponent;


/***/ }),
/* 1026 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var macro_mouse_component_1 = __webpack_require__(1027);
exports.MacroMouseTabComponent = macro_mouse_component_1.MacroMouseTabComponent;


/***/ }),
/* 1027 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
var core_1 = __webpack_require__(0);
var macro_action_1 = __webpack_require__(69);
var tab_1 = __webpack_require__(193);
var TabName;
(function (TabName) {
    TabName[TabName["Move"] = 0] = "Move";
    TabName[TabName["Scroll"] = 1] = "Scroll";
    TabName[TabName["Click"] = 2] = "Click";
    TabName[TabName["Hold"] = 3] = "Hold";
    TabName[TabName["Release"] = 4] = "Release";
})(TabName || (TabName = {}));
var MacroMouseTabComponent = (function () {
    /* tslint:enable:no-unused-variable */
    /* tslint:enable:variable-name */
    function MacroMouseTabComponent() {
        /* tslint:disable:variable-name: It is an enum type. So it can start with uppercase. */
        /* tslint:disable:no-unused-variable: It is used in the template. */
        this.TabName = TabName;
        this.buttonLabels = ['Left', 'Middle', 'Right'];
        this.selectedButtons = Array(this.buttonLabels.length).fill(false);
    }
    MacroMouseTabComponent.prototype.ngOnInit = function () {
        var tabName = this.getTabName(this.macroAction);
        this.selectTab(tabName);
        var buttonActions = [TabName.Click, TabName.Hold, TabName.Release];
        if (buttonActions.includes(this.activeTab)) {
            this.selectedButtons = this.macroAction.getMouseButtons();
        }
    };
    MacroMouseTabComponent.prototype.selectTab = function (tab) {
        this.activeTab = tab;
        this.macroAction.macroActionType = this.getMacroActionType(tab);
        if (this.macroAction.macroActionType === macro_action_1.macroActionType.MouseButtonMacroAction) {
            this.macroAction.action = this.getAction(tab);
        }
    };
    MacroMouseTabComponent.prototype.setMouseClick = function (index) {
        this.selectedButtons[index] = !this.selectedButtons[index];
        this.macroAction.setMouseButtons(this.selectedButtons);
    };
    MacroMouseTabComponent.prototype.hasButton = function (index) {
        return this.selectedButtons[index];
    };
    MacroMouseTabComponent.prototype.getAction = function (tab) {
        switch (tab) {
            case TabName.Click:
                return macro_action_1.MacroSubAction.press;
            case TabName.Hold:
                return macro_action_1.MacroSubAction.hold;
            case TabName.Release:
                return macro_action_1.MacroSubAction.release;
            default:
                throw new Error('Invalid tab name');
        }
    };
    MacroMouseTabComponent.prototype.getTabName = function (action) {
        if (action.macroActionType === macro_action_1.macroActionType.MouseButtonMacroAction) {
            if (!action.action || action.isOnlyPressAction()) {
                return TabName.Click;
            }
            else if (action.isOnlyPressAction()) {
                return TabName.Hold;
            }
            else if (action.isOnlyReleaseAction()) {
                return TabName.Release;
            }
        }
        else if (action.macroActionType === macro_action_1.macroActionType.MoveMouseMacroAction) {
            return TabName.Move;
        }
        else if (action.macroActionType === macro_action_1.macroActionType.ScrollMouseMacroAction) {
            return TabName.Scroll;
        }
        return TabName.Move;
    };
    MacroMouseTabComponent.prototype.getMacroActionType = function (tab) {
        if (tab === TabName.Click || tab === TabName.Hold || tab === TabName.Release) {
            return macro_action_1.macroActionType.MouseButtonMacroAction;
        }
        else if (tab === TabName.Move) {
            return macro_action_1.macroActionType.MoveMouseMacroAction;
        }
        else if (tab === TabName.Scroll) {
            return macro_action_1.macroActionType.ScrollMouseMacroAction;
        }
    };
    return MacroMouseTabComponent;
}());
__decorate([
    core_1.Input(),
    __metadata("design:type", macro_action_1.EditableMacroAction)
], MacroMouseTabComponent.prototype, "macroAction", void 0);
__decorate([
    core_1.ViewChild('tab'),
    __metadata("design:type", tab_1.Tab)
], MacroMouseTabComponent.prototype, "selectedTab", void 0);
MacroMouseTabComponent = __decorate([
    core_1.Component({
        selector: 'macro-mouse-tab',
        template: __webpack_require__(679),
        styles: [
            __webpack_require__(269),
            __webpack_require__(730)
        ],
        host: { 'class': 'macro__mouse' }
    }),
    __metadata("design:paramtypes", [])
], MacroMouseTabComponent);
exports.MacroMouseTabComponent = MacroMouseTabComponent;


/***/ }),
/* 1028 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var macro_text_component_1 = __webpack_require__(1029);
exports.MacroTextTabComponent = macro_text_component_1.MacroTextTabComponent;


/***/ }),
/* 1029 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
var core_1 = __webpack_require__(0);
var macro_action_1 = __webpack_require__(69);
var MacroTextTabComponent = (function () {
    function MacroTextTabComponent(renderer) {
        this.renderer = renderer;
    }
    MacroTextTabComponent.prototype.ngAfterViewInit = function () {
        this.renderer.invokeElementMethod(this.input.nativeElement, 'focus');
    };
    MacroTextTabComponent.prototype.onTextChange = function () {
        this.macroAction.text = this.input.nativeElement.value;
    };
    return MacroTextTabComponent;
}());
__decorate([
    core_1.Input(),
    __metadata("design:type", macro_action_1.EditableMacroAction)
], MacroTextTabComponent.prototype, "macroAction", void 0);
__decorate([
    core_1.ViewChild('macroTextInput'),
    __metadata("design:type", core_1.ElementRef)
], MacroTextTabComponent.prototype, "input", void 0);
MacroTextTabComponent = __decorate([
    core_1.Component({
        selector: 'macro-text-tab',
        template: __webpack_require__(680),
        styles: [__webpack_require__(731)],
        host: { 'class': 'macro__text' }
    }),
    __metadata("design:paramtypes", [core_1.Renderer])
], MacroTextTabComponent);
exports.MacroTextTabComponent = MacroTextTabComponent;


/***/ }),
/* 1030 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
var core_1 = __webpack_require__(0);
var store_1 = __webpack_require__(9);
var Macro_1 = __webpack_require__(194);
var actions_1 = __webpack_require__(54);
var MacroHeaderComponent = (function () {
    function MacroHeaderComponent(store, renderer) {
        this.store = store;
        this.renderer = renderer;
    }
    MacroHeaderComponent.prototype.ngOnChanges = function () {
        if (this.isNew) {
            this.renderer.invokeElementMethod(this.macroName.nativeElement, 'select', []);
        }
    };
    MacroHeaderComponent.prototype.ngAfterViewInit = function () {
        if (this.isNew) {
            this.renderer.invokeElementMethod(this.macroName.nativeElement, 'select', []);
        }
    };
    MacroHeaderComponent.prototype.removeMacro = function () {
        this.store.dispatch(actions_1.MacroActions.removeMacro(this.macro.id));
    };
    MacroHeaderComponent.prototype.duplicateMacro = function () {
        this.store.dispatch(actions_1.MacroActions.duplicateMacro(this.macro));
    };
    MacroHeaderComponent.prototype.editMacroName = function (name) {
        if (name.length === 0) {
            this.renderer.setElementProperty(this.macroName.nativeElement, 'value', this.macro.name);
            return;
        }
        this.store.dispatch(actions_1.MacroActions.editMacroName(this.macro.id, name));
    };
    return MacroHeaderComponent;
}());
__decorate([
    core_1.Input(),
    __metadata("design:type", Macro_1.Macro)
], MacroHeaderComponent.prototype, "macro", void 0);
__decorate([
    core_1.Input(),
    __metadata("design:type", Boolean)
], MacroHeaderComponent.prototype, "isNew", void 0);
__decorate([
    core_1.ViewChild('macroName'),
    __metadata("design:type", core_1.ElementRef)
], MacroHeaderComponent.prototype, "macroName", void 0);
MacroHeaderComponent = __decorate([
    core_1.Component({
        selector: 'macro-header',
        template: __webpack_require__(682),
        styles: [__webpack_require__(733)],
        changeDetection: core_1.ChangeDetectionStrategy.OnPush
    }),
    __metadata("design:paramtypes", [store_1.Store, core_1.Renderer])
], MacroHeaderComponent);
exports.MacroHeaderComponent = MacroHeaderComponent;


/***/ }),
/* 1031 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var macro_item_component_1 = __webpack_require__(1032);
exports.MacroItemComponent = macro_item_component_1.MacroItemComponent;


/***/ }),
/* 1032 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
var core_1 = __webpack_require__(0);
var KeyModifiers_1 = __webpack_require__(290);
var macro_action_1 = __webpack_require__(69);
var mapper_service_1 = __webpack_require__(31);
var MacroItemComponent = (function () {
    function MacroItemComponent(mapper) {
        this.mapper = mapper;
        this.save = new core_1.EventEmitter();
        this.cancel = new core_1.EventEmitter();
        this.edit = new core_1.EventEmitter();
        this.delete = new core_1.EventEmitter();
        this.newItem = false;
    }
    MacroItemComponent.prototype.ngOnInit = function () {
        this.updateView();
        if (!this.macroAction) {
            this.editing = true;
            this.newItem = true;
        }
    };
    MacroItemComponent.prototype.ngOnChanges = function (changes) {
        if (changes['macroAction']) {
            this.updateView();
        }
    };
    MacroItemComponent.prototype.saveEditedAction = function (editedAction) {
        this.macroAction = editedAction;
        this.editing = false;
        this.updateView();
        this.save.emit(editedAction);
    };
    MacroItemComponent.prototype.editAction = function () {
        if (!this.editable || this.editing) {
            return;
        }
        this.editing = true;
        this.edit.emit();
    };
    MacroItemComponent.prototype.cancelEdit = function () {
        this.editing = false;
        this.cancel.emit();
    };
    MacroItemComponent.prototype.deleteAction = function () {
        this.delete.emit();
    };
    MacroItemComponent.prototype.updateView = function () {
        if (!this.macroAction) {
            this.title = 'New macro action';
        }
        else if (this.macroAction instanceof macro_action_1.DelayMacroAction) {
            // Delay
            this.iconName = 'clock';
            var action = this.macroAction;
            var delay_1 = action.delay > 0 ? action.delay / 1000 : 0;
            this.title = "Delay of " + delay_1 + "s";
        }
        else if (this.macroAction instanceof macro_action_1.TextMacroAction) {
            // Write text
            var action = this.macroAction;
            this.iconName = 'font';
            this.title = "Write text: " + action.text;
        }
        else if (this.macroAction instanceof macro_action_1.KeyMacroAction) {
            // Key pressed/held/released
            var action = this.macroAction;
            this.setKeyActionContent(action);
        }
        else if (this.macroAction instanceof macro_action_1.MouseButtonMacroAction) {
            // Mouse button clicked/held/released
            var action = this.macroAction;
            this.setMouseButtonActionContent(action);
        }
        else if (this.macroAction instanceof macro_action_1.MoveMouseMacroAction || this.macroAction instanceof macro_action_1.ScrollMouseMacroAction) {
            // Mouse moved or scrolled
            this.setMouseMoveScrollActionContent(this.macroAction);
        }
        else {
            this.title = this.macroAction.constructor.name;
        }
    };
    MacroItemComponent.prototype.setKeyActionContent = function (action) {
        if (!action.hasScancode() && !action.hasModifiers()) {
            this.title = 'Invalid keypress';
            return;
        }
        if (action.isPressAction()) {
            // Press key
            this.iconName = 'hand-pointer';
            this.title = 'Press key: ';
        }
        else if (action.isHoldAction()) {
            // Hold key
            this.iconName = 'hand-rock';
            this.title = 'Hold key: ';
        }
        else if (action.isReleaseAction()) {
            // Release key
            this.iconName = 'hand-paper';
            this.title = 'Release key: ';
        }
        if (action.hasScancode()) {
            var scancode = (this.mapper.scanCodeToText(action.scancode) || ['Unknown']).join(' ');
            if (scancode) {
                this.title += scancode;
            }
        }
        if (action.hasModifiers()) {
            // Press/hold/release modifiers
            for (var i = KeyModifiers_1.KeyModifiers.leftCtrl; i !== KeyModifiers_1.KeyModifiers.rightGui; i <<= 1) {
                if (action.isModifierActive(i)) {
                    this.title += ' ' + KeyModifiers_1.KeyModifiers[i];
                }
            }
        }
    };
    MacroItemComponent.prototype.setMouseMoveScrollActionContent = function (action) {
        var typedAction;
        if (action instanceof macro_action_1.MoveMouseMacroAction) {
            // Move mouse pointer
            this.iconName = 'mouse-pointer';
            this.title = 'Move pointer';
            typedAction = this.macroAction;
        }
        else {
            // Scroll mouse
            this.iconName = 'mouse-pointer';
            this.title = 'Scroll';
            typedAction = this.macroAction;
        }
        var needAnd;
        if (Math.abs(typedAction.x) !== 0) {
            this.title += " by " + Math.abs(typedAction.x) + "px " + (typedAction.x > 0 ? 'left' : 'right');
            needAnd = true;
        }
        if (Math.abs(typedAction.y) !== 0) {
            this.title += " " + (needAnd ? 'and' : 'by') + " " + Math.abs(typedAction.y) + "px " + (typedAction.y > 0 ? 'down' : 'up');
        }
    };
    MacroItemComponent.prototype.setMouseButtonActionContent = function (action) {
        // Press/hold/release mouse buttons
        if (action.isOnlyPressAction()) {
            this.iconName = 'mouse-pointer';
            this.title = 'Click mouse button: ';
        }
        else if (action.isOnlyHoldAction()) {
            this.iconName = 'hand-rock';
            this.title = 'Hold mouse button: ';
        }
        else if (action.isOnlyReleaseAction()) {
            this.iconName = 'hand-paper';
            this.title = 'Release mouse button: ';
        }
        var buttonLabels = ['Left', 'Middle', 'Right'];
        var selectedButtons = action.getMouseButtons();
        var selectedButtonLabels = [];
        selectedButtons.forEach(function (isSelected, idx) {
            if (isSelected && buttonLabels[idx]) {
                selectedButtonLabels.push(buttonLabels[idx]);
            }
        });
        this.title += selectedButtonLabels.join(', ');
    };
    return MacroItemComponent;
}());
__decorate([
    core_1.Input(),
    __metadata("design:type", macro_action_1.MacroAction)
], MacroItemComponent.prototype, "macroAction", void 0);
__decorate([
    core_1.Input(),
    __metadata("design:type", Boolean)
], MacroItemComponent.prototype, "editable", void 0);
__decorate([
    core_1.Input(),
    __metadata("design:type", Boolean)
], MacroItemComponent.prototype, "deletable", void 0);
__decorate([
    core_1.Input(),
    __metadata("design:type", Boolean)
], MacroItemComponent.prototype, "movable", void 0);
__decorate([
    core_1.Output(),
    __metadata("design:type", Object)
], MacroItemComponent.prototype, "save", void 0);
__decorate([
    core_1.Output(),
    __metadata("design:type", Object)
], MacroItemComponent.prototype, "cancel", void 0);
__decorate([
    core_1.Output(),
    __metadata("design:type", Object)
], MacroItemComponent.prototype, "edit", void 0);
__decorate([
    core_1.Output(),
    __metadata("design:type", Object)
], MacroItemComponent.prototype, "delete", void 0);
MacroItemComponent = __decorate([
    core_1.Component({
        animations: [
            core_1.trigger('toggler', [
                core_1.state('inactive', core_1.style({
                    height: '0px'
                })),
                core_1.state('active', core_1.style({
                    height: '*'
                })),
                core_1.transition('inactive <=> active', core_1.animate('500ms ease-out'))
            ])
        ],
        selector: 'macro-item',
        template: __webpack_require__(683),
        styles: [__webpack_require__(734)],
        host: { 'class': 'macro-item' }
    }),
    __metadata("design:paramtypes", [mapper_service_1.MapperService])
], MacroItemComponent);
exports.MacroItemComponent = MacroItemComponent;


/***/ }),
/* 1033 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
var core_1 = __webpack_require__(0);
var ng2_dragula_1 = __webpack_require__(404);
var Macro_1 = __webpack_require__(194);
var index_1 = __webpack_require__(288);
var MacroListComponent = (function () {
    function MacroListComponent(dragulaService) {
        var _this = this;
        this.dragulaService = dragulaService;
        this.add = new core_1.EventEmitter();
        this.edit = new core_1.EventEmitter();
        this.delete = new core_1.EventEmitter();
        this.reorder = new core_1.EventEmitter();
        this.newMacro = undefined;
        this.activeEdit = undefined;
        this.showNew = false;
        /* tslint:disable:no-unused-variable: Used by Dragula. */
        dragulaService.setOptions('macroActions', {
            moves: function (el, container, handle) {
                return handle.className.includes('action--movable');
            }
        });
        dragulaService.drag.subscribe(function (value) {
            _this.dragIndex = +value[1].getAttribute('data-index');
        });
        dragulaService.drop.subscribe(function (value) {
            if (value[4]) {
                _this.reorder.emit({
                    macroId: _this.macro.id,
                    oldIndex: _this.dragIndex,
                    newIndex: +value[4].getAttribute('data-index')
                });
            }
        });
    }
    MacroListComponent.prototype.showNewAction = function () {
        this.hideActiveEditor();
        this.newMacro = undefined;
        this.showNew = true;
    };
    MacroListComponent.prototype.hideNewAction = function () {
        this.showNew = false;
    };
    MacroListComponent.prototype.addNewAction = function (macroAction) {
        this.add.emit({
            macroId: this.macro.id,
            action: macroAction
        });
        this.newMacro = undefined;
        this.showNew = false;
    };
    MacroListComponent.prototype.editAction = function (index) {
        // Hide other editors when clicking edit button of a macro action
        this.hideActiveEditor();
        this.showNew = false;
        this.activeEdit = index;
    };
    MacroListComponent.prototype.cancelAction = function () {
        this.activeEdit = undefined;
    };
    MacroListComponent.prototype.saveAction = function (macroAction, index) {
        this.edit.emit({
            macroId: this.macro.id,
            index: index,
            action: macroAction
        });
        this.hideActiveEditor();
    };
    MacroListComponent.prototype.deleteAction = function (macroAction, index) {
        this.delete.emit({
            macroId: this.macro.id,
            index: index,
            action: macroAction
        });
        this.hideActiveEditor();
    };
    MacroListComponent.prototype.hideActiveEditor = function () {
        if (this.activeEdit !== undefined) {
            this.macroItems.toArray()[this.activeEdit].cancelEdit();
        }
    };
    return MacroListComponent;
}());
__decorate([
    core_1.Input(),
    __metadata("design:type", Macro_1.Macro)
], MacroListComponent.prototype, "macro", void 0);
__decorate([
    core_1.ViewChildren(core_1.forwardRef(function () { return index_1.MacroItemComponent; })),
    __metadata("design:type", core_1.QueryList)
], MacroListComponent.prototype, "macroItems", void 0);
__decorate([
    core_1.Output(),
    __metadata("design:type", Object)
], MacroListComponent.prototype, "add", void 0);
__decorate([
    core_1.Output(),
    __metadata("design:type", Object)
], MacroListComponent.prototype, "edit", void 0);
__decorate([
    core_1.Output(),
    __metadata("design:type", Object)
], MacroListComponent.prototype, "delete", void 0);
__decorate([
    core_1.Output(),
    __metadata("design:type", Object)
], MacroListComponent.prototype, "reorder", void 0);
MacroListComponent = __decorate([
    core_1.Component({
        animations: [
            core_1.trigger('toggler', [
                core_1.state('inactive', core_1.style({
                    height: '0px'
                })),
                core_1.state('active', core_1.style({
                    height: '*'
                })),
                core_1.transition('inactive <=> active', core_1.animate('500ms ease-out'))
            ]),
            core_1.trigger('togglerNew', [
                core_1.state('void', core_1.style({
                    height: '0px'
                })),
                core_1.state('active', core_1.style({
                    height: '*'
                })),
                core_1.transition(':enter', core_1.animate('500ms ease-out')),
                core_1.transition(':leave', core_1.animate('500ms ease-out'))
            ])
        ],
        selector: 'macro-list',
        template: __webpack_require__(684),
        styles: [__webpack_require__(735)],
        viewProviders: [ng2_dragula_1.DragulaService]
    }),
    __metadata("design:paramtypes", [ng2_dragula_1.DragulaService])
], MacroListComponent);
exports.MacroListComponent = MacroListComponent;


/***/ }),
/* 1034 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var macro_edit_component_1 = __webpack_require__(448);
var not_found_1 = __webpack_require__(289);
exports.macroRoutes = [
    {
        path: 'macro',
        component: not_found_1.MacroNotFoundComponent,
        canActivate: [not_found_1.MacroNotFoundGuard]
    },
    {
        path: 'macro/:id',
        component: macro_edit_component_1.MacroEditComponent
    },
    {
        path: 'macro/:id/:empty',
        component: macro_edit_component_1.MacroEditComponent
    }
];


/***/ }),
/* 1035 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
var core_1 = __webpack_require__(0);
var router_1 = __webpack_require__(45);
__webpack_require__(123);
__webpack_require__(65);
var store_1 = __webpack_require__(9);
var user_configuration_1 = __webpack_require__(55);
var MacroNotFoundGuard = (function () {
    function MacroNotFoundGuard(store, router) {
        this.store = store;
        this.router = router;
    }
    MacroNotFoundGuard.prototype.canActivate = function () {
        var _this = this;
        return this.store
            .let(user_configuration_1.getMacros())
            .map(function (macros) {
            var hasMacros = macros.length > 0;
            if (hasMacros) {
                _this.router.navigate(['/macro', macros[0].id]);
            }
            return !hasMacros;
        });
    };
    return MacroNotFoundGuard;
}());
MacroNotFoundGuard = __decorate([
    core_1.Injectable(),
    __metadata("design:paramtypes", [store_1.Store, router_1.Router])
], MacroNotFoundGuard);
exports.MacroNotFoundGuard = MacroNotFoundGuard;


/***/ }),
/* 1036 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
var core_1 = __webpack_require__(0);
var MacroNotFoundComponent = (function () {
    function MacroNotFoundComponent() {
    }
    return MacroNotFoundComponent;
}());
MacroNotFoundComponent = __decorate([
    core_1.Component({
        selector: 'macro-not-found',
        template: __webpack_require__(685),
        styles: [__webpack_require__(736)]
    })
], MacroNotFoundComponent);
exports.MacroNotFoundComponent = MacroNotFoundComponent;


/***/ }),
/* 1037 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

function __export(m) {
    for (var p in m) if (!exports.hasOwnProperty(p)) exports[p] = m[p];
}
Object.defineProperty(exports, "__esModule", { value: true });
__export(__webpack_require__(1038));


/***/ }),
/* 1038 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
var core_1 = __webpack_require__(0);
var NotificationComponent = (function () {
    function NotificationComponent() {
    }
    return NotificationComponent;
}());
NotificationComponent = __decorate([
    core_1.Component({
        selector: 'notification',
        template: __webpack_require__(686),
        styles: [__webpack_require__(737)]
    }),
    __metadata("design:paramtypes", [])
], NotificationComponent);
exports.NotificationComponent = NotificationComponent;


/***/ }),
/* 1039 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
var core_1 = __webpack_require__(0);
var store_1 = __webpack_require__(9);
var key_action_1 = __webpack_require__(22);
var Keymap_1 = __webpack_require__(80);
var tab_1 = __webpack_require__(67);
var user_configuration_1 = __webpack_require__(55);
var TabName;
(function (TabName) {
    TabName[TabName["Keypress"] = 0] = "Keypress";
    TabName[TabName["Layer"] = 1] = "Layer";
    TabName[TabName["Mouse"] = 2] = "Mouse";
    TabName[TabName["Macro"] = 3] = "Macro";
    TabName[TabName["Keymap"] = 4] = "Keymap";
    TabName[TabName["None"] = 5] = "None";
})(TabName || (TabName = {}));
var PopoverComponent = (function () {
    function PopoverComponent(store) {
        var _this = this;
        this.store = store;
        this.cancel = new core_1.EventEmitter();
        this.remap = new core_1.EventEmitter();
        this.tabName = TabName;
        this.leftArrow = false;
        this.rightArrow = false;
        this.topPosition = 0;
        this.leftPosition = 0;
        this.animationState = 'closed';
        this.keymaps$ = store.let(user_configuration_1.getKeymaps())
            .map(function (keymaps) {
            return keymaps.filter(function (keymap) { return _this.currentKeymap.abbreviation !== keymap.abbreviation; });
        });
    }
    PopoverComponent.prototype.ngOnChanges = function (change) {
        if (this.keyPosition && this.wrapPosition && (change['keyPosition'] || change['wrapPosition'])) {
            this.calculatePosition();
        }
        if (change['defaultKeyAction']) {
            var tab = void 0;
            if (this.defaultKeyAction instanceof key_action_1.KeystrokeAction) {
                tab = TabName.Keypress;
            }
            else if (this.defaultKeyAction instanceof key_action_1.SwitchLayerAction) {
                tab = TabName.Layer;
            }
            else if (this.defaultKeyAction instanceof key_action_1.MouseAction) {
                tab = TabName.Mouse;
            }
            else if (this.defaultKeyAction instanceof key_action_1.PlayMacroAction) {
                tab = TabName.Macro;
            }
            else if (this.defaultKeyAction instanceof key_action_1.SwitchKeymapAction) {
                tab = TabName.Keymap;
            }
            else {
                tab = TabName.None;
            }
            this.selectTab(tab);
        }
        if (change['visible']) {
            if (change['visible'].currentValue) {
                this.animationState = 'opened';
            }
            else {
                this.animationState = 'closed';
            }
        }
    };
    PopoverComponent.prototype.onCancelClick = function () {
        this.cancel.emit(undefined);
    };
    PopoverComponent.prototype.onRemapKey = function () {
        if (this.keyActionValid) {
            try {
                var keyAction = this.selectedTab.toKeyAction();
                this.remap.emit(keyAction);
            }
            catch (e) {
                // TODO: show error dialog
                console.error(e);
            }
        }
    };
    PopoverComponent.prototype.onEscape = function () {
        this.cancel.emit();
    };
    PopoverComponent.prototype.selectTab = function (tab) {
        this.activeTab = tab;
    };
    PopoverComponent.prototype.onOverlay = function () {
        this.cancel.emit(undefined);
    };
    PopoverComponent.prototype.calculatePosition = function () {
        var offsetLeft = this.wrapPosition.left + 265; // 265 is a width of the side menu with a margin
        var popover = this.popoverHost.nativeElement;
        var newLeft = this.keyPosition.left + (this.keyPosition.width / 2);
        this.leftArrow = newLeft < offsetLeft;
        this.rightArrow = (newLeft + popover.offsetWidth) > offsetLeft + this.wrapPosition.width;
        if (this.leftArrow) {
            newLeft = this.keyPosition.left;
        }
        else if (this.rightArrow) {
            newLeft = this.keyPosition.left - popover.offsetWidth + this.keyPosition.width;
        }
        else {
            newLeft -= popover.offsetWidth / 2;
        }
        // 7 is a space between a bottom key position and a popover
        this.topPosition = this.keyPosition.top + this.keyPosition.height + 7 + window.scrollY;
        this.leftPosition = newLeft;
    };
    return PopoverComponent;
}());
__decorate([
    core_1.Input(),
    __metadata("design:type", key_action_1.KeyAction)
], PopoverComponent.prototype, "defaultKeyAction", void 0);
__decorate([
    core_1.Input(),
    __metadata("design:type", Keymap_1.Keymap)
], PopoverComponent.prototype, "currentKeymap", void 0);
__decorate([
    core_1.Input(),
    __metadata("design:type", Number)
], PopoverComponent.prototype, "currentLayer", void 0);
__decorate([
    core_1.Input(),
    __metadata("design:type", Object)
], PopoverComponent.prototype, "keyPosition", void 0);
__decorate([
    core_1.Input(),
    __metadata("design:type", Object)
], PopoverComponent.prototype, "wrapPosition", void 0);
__decorate([
    core_1.Input(),
    __metadata("design:type", Boolean)
], PopoverComponent.prototype, "visible", void 0);
__decorate([
    core_1.Output(),
    __metadata("design:type", Object)
], PopoverComponent.prototype, "cancel", void 0);
__decorate([
    core_1.Output(),
    __metadata("design:type", Object)
], PopoverComponent.prototype, "remap", void 0);
__decorate([
    core_1.ViewChild('tab'),
    __metadata("design:type", tab_1.Tab)
], PopoverComponent.prototype, "selectedTab", void 0);
__decorate([
    core_1.ViewChild('popover'),
    __metadata("design:type", core_1.ElementRef)
], PopoverComponent.prototype, "popoverHost", void 0);
__decorate([
    core_1.HostListener('keydown.escape'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], PopoverComponent.prototype, "onEscape", null);
PopoverComponent = __decorate([
    core_1.Component({
        selector: 'popover',
        template: __webpack_require__(687),
        styles: [__webpack_require__(738)],
        animations: [
            core_1.trigger('popover', [
                core_1.state('closed', core_1.style({
                    transform: 'translateY(30px)',
                    visibility: 'hidden',
                    opacity: 0
                })),
                core_1.state('opened', core_1.style({
                    transform: 'translateY(0)',
                    visibility: 'visible',
                    opacity: 1
                })),
                core_1.transition('opened => closed', [
                    core_1.animate('200ms ease-out', core_1.keyframes([
                        core_1.style({ transform: 'translateY(0)', visibility: 'visible', opacity: 1, offset: 0 }),
                        core_1.style({ transform: 'translateY(30px)', visibility: 'hidden', opacity: 0, offset: 1 })
                    ]))
                ]),
                core_1.transition('closed => opened', [
                    core_1.style({
                        visibility: 'visible'
                    }),
                    core_1.animate('200ms ease-out', core_1.keyframes([
                        core_1.style({ transform: 'translateY(30px)', opacity: 0, offset: 0 }),
                        core_1.style({ transform: 'translateY(0)', opacity: 1, offset: 1 })
                    ]))
                ])
            ])
        ]
    }),
    __metadata("design:paramtypes", [store_1.Store])
], PopoverComponent);
exports.PopoverComponent = PopoverComponent;


/***/ }),
/* 1040 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

function __export(m) {
    for (var p in m) if (!exports.hasOwnProperty(p)) exports[p] = m[p];
}
Object.defineProperty(exports, "__esModule", { value: true });
__export(__webpack_require__(1041));


/***/ }),
/* 1041 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
var core_1 = __webpack_require__(0);
var key_action_1 = __webpack_require__(22);
var tab_1 = __webpack_require__(67);
var KeymapTabComponent = (function (_super) {
    __extends(KeymapTabComponent, _super);
    function KeymapTabComponent() {
        var _this = _super.call(this) || this;
        _this.keymapOptions = [];
        return _this;
    }
    KeymapTabComponent.prototype.ngOnInit = function () {
        this.keymapOptions = this.keymaps
            .map(function (keymap) {
            return {
                id: keymap.abbreviation,
                text: keymap.name
            };
        });
        if (this.keymaps.length > 0) {
            this.selectedKeymap = this.keymaps[0];
        }
    };
    KeymapTabComponent.prototype.ngOnChanges = function () {
        this.fromKeyAction(this.defaultKeyAction);
        this.validAction.emit(true);
    };
    // TODO: change to the correct type when the wrapper has added it.
    KeymapTabComponent.prototype.onChange = function (event) {
        if (event.value === '-1') {
            this.selectedKeymap = undefined;
        }
        else {
            this.selectedKeymap = this.keymaps.find(function (keymap) { return keymap.abbreviation === event.value; });
        }
    };
    KeymapTabComponent.prototype.keyActionValid = function () {
        return !!this.selectedKeymap;
    };
    KeymapTabComponent.prototype.fromKeyAction = function (keyAction) {
        if (!(keyAction instanceof key_action_1.SwitchKeymapAction)) {
            return false;
        }
        var switchKeymapAction = keyAction;
        this.selectedKeymap = this.keymaps
            .find(function (keymap) { return keymap.abbreviation === switchKeymapAction.keymapAbbreviation; });
    };
    KeymapTabComponent.prototype.toKeyAction = function () {
        if (!this.keyActionValid()) {
            throw new Error('KeyAction is not valid. No selected keymap!');
        }
        var keymapAction = new key_action_1.SwitchKeymapAction();
        keymapAction.keymapAbbreviation = this.selectedKeymap.abbreviation;
        return keymapAction;
    };
    return KeymapTabComponent;
}(tab_1.Tab));
__decorate([
    core_1.Input(),
    __metadata("design:type", key_action_1.KeyAction)
], KeymapTabComponent.prototype, "defaultKeyAction", void 0);
__decorate([
    core_1.Input(),
    __metadata("design:type", Array)
], KeymapTabComponent.prototype, "keymaps", void 0);
KeymapTabComponent = __decorate([
    core_1.Component({
        selector: 'keymap-tab',
        template: __webpack_require__(688),
        styles: [__webpack_require__(739)],
        changeDetection: core_1.ChangeDetectionStrategy.OnPush
    }),
    __metadata("design:paramtypes", [])
], KeymapTabComponent);
exports.KeymapTabComponent = KeymapTabComponent;


/***/ }),
/* 1042 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

function __export(m) {
    for (var p in m) if (!exports.hasOwnProperty(p)) exports[p] = m[p];
}
Object.defineProperty(exports, "__esModule", { value: true });
__export(__webpack_require__(1043));


/***/ }),
/* 1043 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/* WEBPACK VAR INJECTION */(function(jQuery) {
var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
var core_1 = __webpack_require__(0);
var key_action_1 = __webpack_require__(22);
var tab_1 = __webpack_require__(67);
var mapper_service_1 = __webpack_require__(31);
var KeypressTabComponent = (function (_super) {
    __extends(KeypressTabComponent, _super);
    function KeypressTabComponent(mapper) {
        var _this = _super.call(this) || this;
        _this.mapper = mapper;
        _this.scanCodeTemplateResult = function (state) {
            if (!state.id) {
                return state.text;
            }
            if (state.additional && state.additional.explanation) {
                return jQuery('<span class="select2-item">'
                    + '<span>' + state.text + '</span>'
                    + '<span class="scancode--searchterm"> '
                    + state.additional.explanation
                    + '</span>' +
                    '</span>');
            }
            else {
                return jQuery('<span class="select2-item">' + state.text + '</span>');
            }
        };
        _this.leftModifiers = ['LShift', 'LCtrl', 'LSuper', 'LAlt'];
        _this.rightModifiers = ['RShift', 'RCtrl', 'RSuper', 'RAlt'];
        _this.scanCodeGroups = [{
                id: '0',
                text: 'None'
            }];
        _this.scanCodeGroups = _this.scanCodeGroups.concat(__webpack_require__(718));
        _this.longPressGroups = __webpack_require__(717);
        _this.leftModifierSelects = Array(_this.leftModifiers.length).fill(false);
        _this.rightModifierSelects = Array(_this.rightModifiers.length).fill(false);
        _this.scanCode = 0;
        _this.selectedLongPressIndex = -1;
        _this.options = {
            templateResult: _this.scanCodeTemplateResult,
            matcher: function (term, text, data) {
                var found = text.toUpperCase().indexOf(term.toUpperCase()) > -1;
                if (!found && data.additional && data.additional.explanation) {
                    found = data.additional.explanation.toUpperCase().indexOf(term.toUpperCase()) > -1;
                }
                return found;
            }
        };
        return _this;
    }
    KeypressTabComponent.prototype.ngOnChanges = function () {
        this.fromKeyAction(this.defaultKeyAction);
        this.validAction.emit(this.keyActionValid());
    };
    KeypressTabComponent.prototype.keyActionValid = function (keystrokeAction) {
        if (!keystrokeAction) {
            keystrokeAction = this.toKeyAction();
        }
        return (keystrokeAction) ? (keystrokeAction.scancode > 0 || keystrokeAction.modifierMask > 0) : false;
    };
    KeypressTabComponent.prototype.onKeysCapture = function (event) {
        if (event.code) {
            this.scanCode = event.code;
        }
        else {
            this.scanCode = 0;
        }
        this.leftModifierSelects = event.left;
        this.rightModifierSelects = event.right;
        this.validAction.emit(this.keyActionValid());
    };
    KeypressTabComponent.prototype.fromKeyAction = function (keyAction) {
        if (!(keyAction instanceof key_action_1.KeystrokeAction)) {
            return false;
        }
        var keystrokeAction = keyAction;
        // Restore scancode
        this.scanCode = keystrokeAction.scancode || 0;
        var leftModifiersLength = this.leftModifiers.length;
        // Restore modifiers
        for (var i = 0; i < leftModifiersLength; ++i) {
            this.leftModifierSelects[this.mapper.modifierMapper(i)] = ((keystrokeAction.modifierMask >> i) & 1) === 1;
        }
        for (var i = leftModifiersLength; i < leftModifiersLength + this.rightModifierSelects.length; ++i) {
            var index = this.mapper.modifierMapper(i) - leftModifiersLength;
            this.rightModifierSelects[index] = ((keystrokeAction.modifierMask >> i) & 1) === 1;
        }
        // Restore longPressAction
        if (keystrokeAction.longPressAction !== undefined) {
            this.selectedLongPressIndex = this.mapper.modifierMapper(keystrokeAction.longPressAction);
        }
        return true;
    };
    KeypressTabComponent.prototype.toKeyAction = function () {
        var keystrokeAction = new key_action_1.KeystrokeAction();
        keystrokeAction.scancode = this.scanCode;
        keystrokeAction.modifierMask = 0;
        var modifiers = this.leftModifierSelects.concat(this.rightModifierSelects).map(function (x) { return x ? 1 : 0; });
        for (var i = 0; i < modifiers.length; ++i) {
            keystrokeAction.modifierMask |= modifiers[i] << this.mapper.modifierMapper(i);
        }
        keystrokeAction.longPressAction = this.selectedLongPressIndex === -1
            ? undefined
            : this.mapper.modifierMapper(this.selectedLongPressIndex);
        if (this.keyActionValid(keystrokeAction)) {
            return keystrokeAction;
        }
    };
    KeypressTabComponent.prototype.toggleModifier = function (right, index) {
        var modifierSelects = right ? this.rightModifierSelects : this.leftModifierSelects;
        modifierSelects[index] = !modifierSelects[index];
        this.validAction.emit(this.keyActionValid());
    };
    KeypressTabComponent.prototype.onLongpressChange = function (event) {
        this.selectedLongPressIndex = +event.value;
    };
    KeypressTabComponent.prototype.onScancodeChange = function (event) {
        this.scanCode = +event.value;
        this.validAction.emit(this.keyActionValid());
    };
    return KeypressTabComponent;
}(tab_1.Tab));
__decorate([
    core_1.Input(),
    __metadata("design:type", key_action_1.KeyAction)
], KeypressTabComponent.prototype, "defaultKeyAction", void 0);
__decorate([
    core_1.Input(),
    __metadata("design:type", Boolean)
], KeypressTabComponent.prototype, "longPressEnabled", void 0);
KeypressTabComponent = __decorate([
    core_1.Component({
        selector: 'keypress-tab',
        template: __webpack_require__(689),
        styles: [__webpack_require__(740)]
    }),
    __metadata("design:paramtypes", [mapper_service_1.MapperService])
], KeypressTabComponent);
exports.KeypressTabComponent = KeypressTabComponent;

/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(18)))

/***/ }),
/* 1044 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

function __export(m) {
    for (var p in m) if (!exports.hasOwnProperty(p)) exports[p] = m[p];
}
Object.defineProperty(exports, "__esModule", { value: true });
__export(__webpack_require__(1045));


/***/ }),
/* 1045 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
var core_1 = __webpack_require__(0);
var key_action_1 = __webpack_require__(22);
var tab_1 = __webpack_require__(67);
var LayerTabComponent = (function (_super) {
    __extends(LayerTabComponent, _super);
    function LayerTabComponent() {
        var _this = _super.call(this) || this;
        _this.toggleData = [
            {
                id: false,
                text: 'Activate'
            },
            {
                id: true,
                text: 'Toggle'
            }
        ];
        _this.layerData = [
            {
                id: 0,
                text: 'Mod'
            },
            {
                id: 1,
                text: 'Fn'
            },
            {
                id: 2,
                text: 'Mouse'
            }
        ];
        _this.toggle = false;
        _this.layer = key_action_1.LayerName.mod;
        return _this;
    }
    LayerTabComponent.prototype.ngOnChanges = function (changes) {
        if (changes['defaultKeyAction']) {
            this.fromKeyAction(this.defaultKeyAction);
        }
        if (changes['currentLayer']) {
            this.isNotBase = this.currentLayer > 0;
        }
        this.validAction.emit(true);
    };
    LayerTabComponent.prototype.keyActionValid = function () {
        return !this.isNotBase;
    };
    LayerTabComponent.prototype.fromKeyAction = function (keyAction) {
        if (!(keyAction instanceof key_action_1.SwitchLayerAction)) {
            return false;
        }
        var switchLayerAction = keyAction;
        this.toggle = switchLayerAction.isLayerToggleable;
        this.layer = switchLayerAction.layer;
        return true;
    };
    LayerTabComponent.prototype.toKeyAction = function () {
        var keyAction = new key_action_1.SwitchLayerAction();
        keyAction.isLayerToggleable = this.toggle;
        keyAction.layer = this.layer;
        if (!this.keyActionValid()) {
            throw new Error('KeyAction is invalid!');
        }
        return keyAction;
    };
    LayerTabComponent.prototype.toggleChanged = function (value) {
        this.toggle = value === 'true';
    };
    LayerTabComponent.prototype.layerChanged = function (value) {
        this.layer = +value;
    };
    return LayerTabComponent;
}(tab_1.Tab));
__decorate([
    core_1.Input(),
    __metadata("design:type", key_action_1.KeyAction)
], LayerTabComponent.prototype, "defaultKeyAction", void 0);
__decorate([
    core_1.Input(),
    __metadata("design:type", Number)
], LayerTabComponent.prototype, "currentLayer", void 0);
__decorate([
    core_1.HostBinding('class.no-base'),
    __metadata("design:type", Boolean)
], LayerTabComponent.prototype, "isNotBase", void 0);
LayerTabComponent = __decorate([
    core_1.Component({
        selector: 'layer-tab',
        template: __webpack_require__(690),
        styles: [__webpack_require__(741)]
    }),
    __metadata("design:paramtypes", [])
], LayerTabComponent);
exports.LayerTabComponent = LayerTabComponent;


/***/ }),
/* 1046 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

function __export(m) {
    for (var p in m) if (!exports.hasOwnProperty(p)) exports[p] = m[p];
}
Object.defineProperty(exports, "__esModule", { value: true });
__export(__webpack_require__(1047));


/***/ }),
/* 1047 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
var core_1 = __webpack_require__(0);
var store_1 = __webpack_require__(9);
var key_action_1 = __webpack_require__(22);
var tab_1 = __webpack_require__(67);
var user_configuration_1 = __webpack_require__(55);
var MacroTabComponent = (function (_super) {
    __extends(MacroTabComponent, _super);
    function MacroTabComponent(store) {
        var _this = _super.call(this) || this;
        _this.store = store;
        _this.subscription = store.let(user_configuration_1.getMacros())
            .subscribe(function (macros) { return _this.macros = macros; });
        _this.macroOptions = [];
        _this.selectedMacroIndex = 0;
        return _this;
    }
    MacroTabComponent.prototype.ngOnInit = function () {
        this.macroOptions = this.macros.map(function (macro, index) {
            return {
                id: index.toString(),
                text: macro.name
            };
        });
    };
    MacroTabComponent.prototype.ngOnChanges = function () {
        this.fromKeyAction(this.defaultKeyAction);
        this.validAction.emit(true);
    };
    // TODO: change to the correct type when the wrapper has added it.
    MacroTabComponent.prototype.onChange = function (event) {
        this.selectedMacroIndex = +event.value;
    };
    MacroTabComponent.prototype.keyActionValid = function () {
        return this.selectedMacroIndex >= 0;
    };
    MacroTabComponent.prototype.fromKeyAction = function (keyAction) {
        if (!(keyAction instanceof key_action_1.PlayMacroAction)) {
            return false;
        }
        var playMacroAction = keyAction;
        this.selectedMacroIndex = this.macros.findIndex(function (macro) { return playMacroAction.macroId === macro.id; });
        return true;
    };
    MacroTabComponent.prototype.toKeyAction = function () {
        if (!this.keyActionValid()) {
            throw new Error('KeyAction is not valid. No selected macro!');
        }
        var keymapAction = new key_action_1.PlayMacroAction();
        keymapAction.macroId = this.macros[this.selectedMacroIndex].id;
        return keymapAction;
    };
    MacroTabComponent.prototype.ngOnDestroy = function () {
        this.subscription.unsubscribe();
    };
    return MacroTabComponent;
}(tab_1.Tab));
__decorate([
    core_1.Input(),
    __metadata("design:type", key_action_1.KeyAction)
], MacroTabComponent.prototype, "defaultKeyAction", void 0);
MacroTabComponent = __decorate([
    core_1.Component({
        selector: 'macro-tab',
        template: __webpack_require__(691),
        styles: [__webpack_require__(742)]
    }),
    __metadata("design:paramtypes", [store_1.Store])
], MacroTabComponent);
exports.MacroTabComponent = MacroTabComponent;


/***/ }),
/* 1048 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

function __export(m) {
    for (var p in m) if (!exports.hasOwnProperty(p)) exports[p] = m[p];
}
Object.defineProperty(exports, "__esModule", { value: true });
__export(__webpack_require__(1049));


/***/ }),
/* 1049 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
var core_1 = __webpack_require__(0);
var key_action_1 = __webpack_require__(22);
var tab_1 = __webpack_require__(67);
var MouseTabComponent = (function (_super) {
    __extends(MouseTabComponent, _super);
    function MouseTabComponent() {
        var _this = _super.call(this) || this;
        /* tslint:disable:variable-name: It is an enum type. So it can start with uppercase. */
        /* tslint:disable:no-unused-variable: It is used in the template. */
        _this.MouseActionParam = key_action_1.MouseActionParam;
        _this.selectedPageIndex = 0;
        _this.pages = ['Move', 'Scroll', 'Click', 'Speed'];
        return _this;
    }
    MouseTabComponent.prototype.ngOnChanges = function () {
        this.fromKeyAction(this.defaultKeyAction);
        this.validAction.emit(this.keyActionValid());
    };
    MouseTabComponent.prototype.keyActionValid = function () {
        return this.mouseActionParam !== undefined;
    };
    MouseTabComponent.prototype.fromKeyAction = function (keyAction) {
        if (!(keyAction instanceof key_action_1.MouseAction)) {
            return false;
        }
        var mouseAction = keyAction;
        this.mouseActionParam = mouseAction.mouseAction;
        if (mouseAction.mouseAction === key_action_1.MouseActionParam.moveUp) {
            this.selectedPageIndex = 0;
        }
        switch (mouseAction.mouseAction) {
            case key_action_1.MouseActionParam.moveDown:
            case key_action_1.MouseActionParam.moveUp:
            case key_action_1.MouseActionParam.moveLeft:
            case key_action_1.MouseActionParam.moveRight:
                this.selectedPageIndex = 0;
                break;
            case key_action_1.MouseActionParam.scrollDown:
            case key_action_1.MouseActionParam.scrollUp:
            case key_action_1.MouseActionParam.scrollLeft:
            case key_action_1.MouseActionParam.scrollRight:
                this.selectedPageIndex = 1;
                break;
            case key_action_1.MouseActionParam.leftClick:
            case key_action_1.MouseActionParam.middleClick:
            case key_action_1.MouseActionParam.rightClick:
                this.selectedPageIndex = 2;
                break;
            case key_action_1.MouseActionParam.decelerate:
            case key_action_1.MouseActionParam.accelerate:
                this.selectedPageIndex = 3;
                break;
            default:
                return false;
        }
        return true;
    };
    MouseTabComponent.prototype.toKeyAction = function () {
        var mouseAction = new key_action_1.MouseAction();
        mouseAction.mouseAction = this.mouseActionParam;
        return mouseAction;
    };
    MouseTabComponent.prototype.changePage = function (index) {
        if (index < -1 || index > 3) {
            console.error("Invalid index error: " + index);
            return;
        }
        this.selectedPageIndex = index;
        this.mouseActionParam = undefined;
        this.validAction.emit(false);
    };
    MouseTabComponent.prototype.setMouseActionParam = function (mouseActionParam) {
        this.mouseActionParam = mouseActionParam;
        this.validAction.emit(true);
    };
    return MouseTabComponent;
}(tab_1.Tab));
__decorate([
    core_1.Input(),
    __metadata("design:type", key_action_1.KeyAction)
], MouseTabComponent.prototype, "defaultKeyAction", void 0);
MouseTabComponent = __decorate([
    core_1.Component({
        selector: 'mouse-tab',
        template: __webpack_require__(692),
        styles: [__webpack_require__(743)]
    }),
    __metadata("design:paramtypes", [])
], MouseTabComponent);
exports.MouseTabComponent = MouseTabComponent;


/***/ }),
/* 1050 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

function __export(m) {
    for (var p in m) if (!exports.hasOwnProperty(p)) exports[p] = m[p];
}
Object.defineProperty(exports, "__esModule", { value: true });
__export(__webpack_require__(1051));


/***/ }),
/* 1051 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
var core_1 = __webpack_require__(0);
var tab_1 = __webpack_require__(67);
var NoneTabComponent = (function (_super) {
    __extends(NoneTabComponent, _super);
    function NoneTabComponent() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    NoneTabComponent.prototype.ngOnChanges = function (event) {
        this.validAction.emit(true);
    };
    NoneTabComponent.prototype.keyActionValid = function () {
        return true;
    };
    NoneTabComponent.prototype.fromKeyAction = function () {
        return false;
    };
    NoneTabComponent.prototype.toKeyAction = function () {
        return undefined;
    };
    return NoneTabComponent;
}(tab_1.Tab));
NoneTabComponent = __decorate([
    core_1.Component({
        selector: 'none-tab',
        template: __webpack_require__(693),
        styles: [__webpack_require__(744)]
    })
], NoneTabComponent);
exports.NoneTabComponent = NoneTabComponent;


/***/ }),
/* 1052 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
var core_1 = __webpack_require__(0);
var capture_service_1 = __webpack_require__(292);
var CaptureKeystrokeButtonComponent = (function () {
    function CaptureKeystrokeButtonComponent(captureService) {
        this.captureService = captureService;
        this.capture = new core_1.EventEmitter();
        this.record = false;
        this.captureService.initModifiers();
        this.captureService.populateMapping();
        this.scanCodePressed = false;
    }
    CaptureKeystrokeButtonComponent.prototype.onKeyUp = function (e) {
        if (this.scanCodePressed) {
            e.preventDefault();
            this.scanCodePressed = false;
        }
        else if (this.record && !this.first) {
            e.preventDefault();
            this.saveScanCode();
        }
    };
    CaptureKeystrokeButtonComponent.prototype.onKeyDown = function (e) {
        var code = e.keyCode;
        var enter = 13;
        if (this.record) {
            e.preventDefault();
            e.stopPropagation();
            this.first = false;
            if (this.captureService.hasMap(code)) {
                this.saveScanCode(this.captureService.getMap(code));
                this.scanCodePressed = true;
            }
            else {
                this.captureService.setModifier((e.location === 1), code);
            }
        }
        else if (code === enter) {
            this.record = true;
            this.first = true;
        }
    };
    CaptureKeystrokeButtonComponent.prototype.onFocusOut = function () {
        this.record = false;
        this.reset();
    };
    CaptureKeystrokeButtonComponent.prototype.start = function () {
        this.record = true;
    };
    CaptureKeystrokeButtonComponent.prototype.saveScanCode = function (code) {
        this.record = false;
        var left = this.captureService.getModifiers(true);
        var right = this.captureService.getModifiers(false);
        this.capture.emit({
            code: code,
            left: left,
            right: right
        });
        this.reset();
    };
    CaptureKeystrokeButtonComponent.prototype.reset = function () {
        this.first = false;
        this.captureService.initModifiers();
    };
    return CaptureKeystrokeButtonComponent;
}());
__decorate([
    core_1.Output(),
    __metadata("design:type", Object)
], CaptureKeystrokeButtonComponent.prototype, "capture", void 0);
__decorate([
    core_1.HostListener('keyup', ['$event']),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [KeyboardEvent]),
    __metadata("design:returntype", void 0)
], CaptureKeystrokeButtonComponent.prototype, "onKeyUp", null);
__decorate([
    core_1.HostListener('keydown', ['$event']),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [KeyboardEvent]),
    __metadata("design:returntype", void 0)
], CaptureKeystrokeButtonComponent.prototype, "onKeyDown", null);
__decorate([
    core_1.HostListener('focusout'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], CaptureKeystrokeButtonComponent.prototype, "onFocusOut", null);
CaptureKeystrokeButtonComponent = __decorate([
    core_1.Component({
        selector: 'capture-keystroke-button',
        template: __webpack_require__(694),
        styles: [__webpack_require__(745)]
    }),
    __metadata("design:paramtypes", [capture_service_1.CaptureService])
], CaptureKeystrokeButtonComponent);
exports.CaptureKeystrokeButtonComponent = CaptureKeystrokeButtonComponent;


/***/ }),
/* 1053 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

function __export(m) {
    for (var p in m) if (!exports.hasOwnProperty(p)) exports[p] = m[p];
}
Object.defineProperty(exports, "__esModule", { value: true });
__export(__webpack_require__(1052));


/***/ }),
/* 1054 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
var core_1 = __webpack_require__(0);
var IconComponent = (function () {
    function IconComponent() {
    }
    IconComponent.prototype.ngOnInit = function () { };
    return IconComponent;
}());
__decorate([
    core_1.Input(),
    __metadata("design:type", String)
], IconComponent.prototype, "name", void 0);
IconComponent = __decorate([
    core_1.Component({
        selector: 'icon',
        template: __webpack_require__(695),
        styles: [__webpack_require__(746)]
    }),
    __metadata("design:paramtypes", [])
], IconComponent);
exports.IconComponent = IconComponent;


/***/ }),
/* 1055 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

function __export(m) {
    for (var p in m) if (!exports.hasOwnProperty(p)) exports[p] = m[p];
}
Object.defineProperty(exports, "__esModule", { value: true });
__export(__webpack_require__(1054));


/***/ }),
/* 1056 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var settings_component_1 = __webpack_require__(451);
exports.settingsRoutes = [
    {
        path: 'settings',
        component: settings_component_1.SettingsComponent
    }
];


/***/ }),
/* 1057 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

function __export(m) {
    for (var p in m) if (!exports.hasOwnProperty(p)) exports[p] = m[p];
}
Object.defineProperty(exports, "__esModule", { value: true });
__export(__webpack_require__(1058));


/***/ }),
/* 1058 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
var core_1 = __webpack_require__(0);
var store_1 = __webpack_require__(9);
__webpack_require__(122);
__webpack_require__(65);
__webpack_require__(123);
var actions_1 = __webpack_require__(54);
var user_configuration_1 = __webpack_require__(55);
var SideMenuComponent = (function () {
    function SideMenuComponent(store, renderer) {
        this.store = store;
        this.renderer = renderer;
        this.animation = {
            keymap: 'active',
            macro: 'active',
            addon: 'active'
        };
        this.keymaps$ = store.let(user_configuration_1.getKeymaps())
            .map(function (keymaps) { return keymaps.slice(); }) // Creating a new array reference, because the sort is working in place
            .do(function (keymaps) {
            keymaps.sort(function (first, second) { return first.name.localeCompare(second.name); });
        });
        this.macros$ = store.let(user_configuration_1.getMacros())
            .map(function (macros) { return macros.slice(); }) // Creating a new array reference, because the sort is working in place
            .do(function (macros) {
            macros.sort(function (first, second) { return first.name.localeCompare(second.name); });
        });
    }
    SideMenuComponent.prototype.toggleHide = function (event, type) {
        var header = event.target.classList;
        var show = false;
        if (header.contains('fa-chevron-down')) {
            show = true;
            this.animation[type] = 'active';
        }
        else {
            this.animation[type] = 'inactive';
        }
        this.renderer.setElementClass(event.target, 'fa-chevron-up', show);
        this.renderer.setElementClass(event.target, 'fa-chevron-down', !show);
    };
    SideMenuComponent.prototype.addMacro = function () {
        this.store.dispatch(actions_1.MacroActions.addMacro());
    };
    return SideMenuComponent;
}());
SideMenuComponent = __decorate([
    core_1.Component({
        animations: [
            core_1.trigger('toggler', [
                core_1.state('inactive', core_1.style({
                    height: '0px'
                })),
                core_1.state('active', core_1.style({
                    height: '*'
                })),
                core_1.transition('inactive <=> active', core_1.animate('500ms ease-out'))
            ])
        ],
        selector: 'side-menu',
        template: __webpack_require__(697),
        styles: [__webpack_require__(748)]
    }),
    __metadata("design:paramtypes", [store_1.Store, core_1.Renderer])
], SideMenuComponent);
exports.SideMenuComponent = SideMenuComponent;


/***/ }),
/* 1059 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

function __export(m) {
    for (var p in m) if (!exports.hasOwnProperty(p)) exports[p] = m[p];
}
Object.defineProperty(exports, "__esModule", { value: true });
__export(__webpack_require__(1060));


/***/ }),
/* 1060 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
var core_1 = __webpack_require__(0);
var module_1 = __webpack_require__(452);
var SvgKeyboardComponent = (function () {
    function SvgKeyboardComponent() {
        this.keyClick = new core_1.EventEmitter();
        this.keyHover = new core_1.EventEmitter();
        this.capture = new core_1.EventEmitter();
        this.modules = [];
        this.svgAttributes = this.getKeyboardSvgAttributes();
    }
    SvgKeyboardComponent.prototype.ngOnInit = function () {
        this.modules = this.getSvgModules();
    };
    SvgKeyboardComponent.prototype.onKeyClick = function (moduleId, keyId, keyTarget) {
        this.keyClick.emit({
            moduleId: moduleId,
            keyId: keyId,
            keyTarget: keyTarget
        });
    };
    SvgKeyboardComponent.prototype.onCapture = function (moduleId, keyId, captured) {
        this.capture.emit({
            moduleId: moduleId,
            keyId: keyId,
            captured: captured
        });
    };
    SvgKeyboardComponent.prototype.onKeyHover = function (keyId, event, over, moduleId) {
        this.keyHover.emit({
            moduleId: moduleId,
            event: event,
            over: over,
            keyId: keyId
        });
    };
    SvgKeyboardComponent.prototype.getKeyboardSvgAttributes = function () {
        var svg = this.getBaseLayer();
        return {
            viewBox: svg.$.viewBox,
            transform: svg.g[0].$.transform,
            fill: svg.g[0].$.fill
        };
    };
    SvgKeyboardComponent.prototype.getSvgModules = function () {
        var modules = this.getBaseLayer().g[0].g.map(function (obj) { return new module_1.SvgModule(obj); });
        return [modules[1], modules[0]]; // TODO: remove if the svg will be correct
    };
    SvgKeyboardComponent.prototype.getBaseLayer = function () {
        return __webpack_require__(1126).svg;
    };
    return SvgKeyboardComponent;
}());
__decorate([
    core_1.Input(),
    __metadata("design:type", Array)
], SvgKeyboardComponent.prototype, "moduleConfig", void 0);
__decorate([
    core_1.Input(),
    __metadata("design:type", Boolean)
], SvgKeyboardComponent.prototype, "keybindAnimationEnabled", void 0);
__decorate([
    core_1.Input(),
    __metadata("design:type", Boolean)
], SvgKeyboardComponent.prototype, "capturingEnabled", void 0);
__decorate([
    core_1.Output(),
    __metadata("design:type", Object)
], SvgKeyboardComponent.prototype, "keyClick", void 0);
__decorate([
    core_1.Output(),
    __metadata("design:type", Object)
], SvgKeyboardComponent.prototype, "keyHover", void 0);
__decorate([
    core_1.Output(),
    __metadata("design:type", Object)
], SvgKeyboardComponent.prototype, "capture", void 0);
SvgKeyboardComponent = __decorate([
    core_1.Component({
        selector: 'svg-keyboard',
        template: __webpack_require__(698),
        styles: [__webpack_require__(749)],
        changeDetection: core_1.ChangeDetectionStrategy.OnPush
    }),
    __metadata("design:paramtypes", [])
], SvgKeyboardComponent);
exports.SvgKeyboardComponent = SvgKeyboardComponent;


/***/ }),
/* 1061 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var svg_icon_text_key_1 = __webpack_require__(1062);
exports.SvgIconTextKeyComponent = svg_icon_text_key_1.SvgIconTextKeyComponent;
var svg_keyboard_key_1 = __webpack_require__(1064);
exports.SvgKeyboardKeyComponent = svg_keyboard_key_1.SvgKeyboardKeyComponent;
var svg_keystroke_key_1 = __webpack_require__(1066);
exports.SvgKeystrokeKeyComponent = svg_keystroke_key_1.SvgKeystrokeKeyComponent;
var svg_mouse_key_1 = __webpack_require__(1070);
exports.SvgMouseKeyComponent = svg_mouse_key_1.SvgMouseKeyComponent;
var svg_mouse_click_key_1 = __webpack_require__(1068);
exports.SvgMouseClickKeyComponent = svg_mouse_click_key_1.SvgMouseClickKeyComponent;
var svg_mouse_move_key_1 = __webpack_require__(1072);
exports.SvgMouseMoveKeyComponent = svg_mouse_move_key_1.SvgMouseMoveKeyComponent;
var svg_mouse_speed_key_1 = __webpack_require__(1076);
exports.SvgMouseSpeedKeyComponent = svg_mouse_speed_key_1.SvgMouseSpeedKeyComponent;
var svg_mouse_scroll_key_1 = __webpack_require__(1074);
exports.SvgMouseScrollKeyComponent = svg_mouse_scroll_key_1.SvgMouseScrollKeyComponent;
var svg_one_line_text_key_1 = __webpack_require__(1078);
exports.SvgOneLineTextKeyComponent = svg_one_line_text_key_1.SvgOneLineTextKeyComponent;
var svg_single_icon_key_1 = __webpack_require__(1080);
exports.SvgSingleIconKeyComponent = svg_single_icon_key_1.SvgSingleIconKeyComponent;
var svg_switch_keymap_key_1 = __webpack_require__(1082);
exports.SvgSwitchKeymapKeyComponent = svg_switch_keymap_key_1.SvgSwitchKeymapKeyComponent;
var svg_text_icon_key_1 = __webpack_require__(1084);
exports.SvgTextIconKeyComponent = svg_text_icon_key_1.SvgTextIconKeyComponent;
var svg_two_line_text_key_1 = __webpack_require__(1086);
exports.SvgTwoLineTextKeyComponent = svg_two_line_text_key_1.SvgTwoLineTextKeyComponent;


/***/ }),
/* 1062 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

function __export(m) {
    for (var p in m) if (!exports.hasOwnProperty(p)) exports[p] = m[p];
}
Object.defineProperty(exports, "__esModule", { value: true });
__export(__webpack_require__(1063));


/***/ }),
/* 1063 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
var core_1 = __webpack_require__(0);
var SvgIconTextKeyComponent = (function () {
    function SvgIconTextKeyComponent() {
    }
    SvgIconTextKeyComponent.prototype.ngOnInit = function () {
        this.useWidth = this.width / 3;
        this.useHeight = this.height / 3;
        this.useX = (this.width > 2 * this.height) ? 0 : this.width / 3;
        this.useY = (this.width > 2 * this.height) ? this.height / 3 : this.height / 10;
        this.textY = (this.width > 2 * this.height) ? this.height / 2 : this.height * 0.6;
        this.spanX = (this.width > 2 * this.height) ? this.width * 0.6 : this.width / 2;
    };
    return SvgIconTextKeyComponent;
}());
__decorate([
    core_1.Input(),
    __metadata("design:type", Number)
], SvgIconTextKeyComponent.prototype, "width", void 0);
__decorate([
    core_1.Input(),
    __metadata("design:type", Number)
], SvgIconTextKeyComponent.prototype, "height", void 0);
__decorate([
    core_1.Input(),
    __metadata("design:type", String)
], SvgIconTextKeyComponent.prototype, "icon", void 0);
__decorate([
    core_1.Input(),
    __metadata("design:type", String)
], SvgIconTextKeyComponent.prototype, "text", void 0);
SvgIconTextKeyComponent = __decorate([
    core_1.Component({
        selector: 'g[svg-icon-text-key]',
        template: __webpack_require__(699),
        changeDetection: core_1.ChangeDetectionStrategy.OnPush
    }),
    __metadata("design:paramtypes", [])
], SvgIconTextKeyComponent);
exports.SvgIconTextKeyComponent = SvgIconTextKeyComponent;


/***/ }),
/* 1064 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

function __export(m) {
    for (var p in m) if (!exports.hasOwnProperty(p)) exports[p] = m[p];
}
Object.defineProperty(exports, "__esModule", { value: true });
__export(__webpack_require__(1065));


/***/ }),
/* 1065 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
var core_1 = __webpack_require__(0);
var store_1 = __webpack_require__(9);
var key_action_1 = __webpack_require__(22);
var KeyModifiers_1 = __webpack_require__(290);
var capture_service_1 = __webpack_require__(292);
var mapper_service_1 = __webpack_require__(31);
var user_configuration_1 = __webpack_require__(55);
var LabelTypes;
(function (LabelTypes) {
    LabelTypes[LabelTypes["KeystrokeKey"] = 0] = "KeystrokeKey";
    LabelTypes[LabelTypes["MouseKey"] = 1] = "MouseKey";
    LabelTypes[LabelTypes["OneLineText"] = 2] = "OneLineText";
    LabelTypes[LabelTypes["TwoLineText"] = 3] = "TwoLineText";
    LabelTypes[LabelTypes["TextIcon"] = 4] = "TextIcon";
    LabelTypes[LabelTypes["SingleIcon"] = 5] = "SingleIcon";
    LabelTypes[LabelTypes["SwitchKeymap"] = 6] = "SwitchKeymap";
    LabelTypes[LabelTypes["IconText"] = 7] = "IconText";
})(LabelTypes || (LabelTypes = {}));
var SvgKeyboardKeyComponent = (function () {
    function SvgKeyboardKeyComponent(mapper, store, element, captureService, renderer) {
        var _this = this;
        this.mapper = mapper;
        this.store = store;
        this.element = element;
        this.captureService = captureService;
        this.renderer = renderer;
        this.keyClick = new core_1.EventEmitter();
        this.capture = new core_1.EventEmitter();
        this.enumLabelTypes = LabelTypes;
        this.changeAnimation = 'inactive';
        this.subscription = store.let(user_configuration_1.getMacros())
            .subscribe(function (macros) { return _this.macros = macros; });
        this.reset();
        this.captureService.populateMapping();
        this.scanCodePressed = false;
    }
    SvgKeyboardKeyComponent.prototype.onClick = function () {
        this.reset();
        this.keyClick.emit(this.element.nativeElement);
    };
    SvgKeyboardKeyComponent.prototype.onMouseDown = function (e) {
        if ((e.which === 2 || e.button === 1) && this.capturingEnabled) {
            e.preventDefault();
            this.renderer.invokeElementMethod(this.element.nativeElement, 'focus');
            if (this.recording) {
                this.reset();
            }
            else {
                this.recording = true;
                this.recordAnimation = 'active';
            }
        }
    };
    SvgKeyboardKeyComponent.prototype.onKeyUpe = function (e) {
        if (this.scanCodePressed) {
            e.preventDefault();
            this.scanCodePressed = false;
        }
        else if (this.recording) {
            e.preventDefault();
            this.saveScanCode();
        }
    };
    SvgKeyboardKeyComponent.prototype.onKeyDown = function (e) {
        var code = e.keyCode;
        if (this.recording) {
            e.preventDefault();
            if (this.captureService.hasMap(code)) {
                this.saveScanCode(this.captureService.getMap(code));
                this.scanCodePressed = true;
            }
            else {
                this.captureService.setModifier((e.location === 1), code);
            }
        }
    };
    SvgKeyboardKeyComponent.prototype.onFocusOut = function () {
        this.reset();
    };
    SvgKeyboardKeyComponent.prototype.ngOnInit = function () {
        this.setLabels();
    };
    SvgKeyboardKeyComponent.prototype.ngOnChanges = function (changes) {
        if (changes['keyAction']) {
            this.setLabels();
            if (this.keybindAnimationEnabled) {
                this.changeAnimation = 'active';
            }
        }
    };
    SvgKeyboardKeyComponent.prototype.ngOnDestroy = function () {
        this.subscription.unsubscribe();
    };
    SvgKeyboardKeyComponent.prototype.onChangeAnimationDone = function () {
        this.changeAnimation = 'inactive';
    };
    SvgKeyboardKeyComponent.prototype.onRecordingAnimationDone = function () {
        if (this.recording && this.recordAnimation === 'inactive') {
            this.recordAnimation = 'active';
        }
        else {
            this.recordAnimation = 'inactive';
        }
    };
    SvgKeyboardKeyComponent.prototype.reset = function () {
        this.recording = false;
        this.changeAnimation = 'inactive';
        this.captureService.initModifiers();
    };
    SvgKeyboardKeyComponent.prototype.saveScanCode = function (code) {
        if (code === void 0) { code = 0; }
        this.recording = false;
        this.changeAnimation = 'inactive';
        var left = this.captureService.getModifiers(true);
        var right = this.captureService.getModifiers(false);
        this.capture.emit({
            code: code,
            left: left,
            right: right
        });
        this.captureService.initModifiers();
    };
    SvgKeyboardKeyComponent.prototype.setLabels = function () {
        if (!this.keyAction) {
            this.labelSource = undefined;
            this.labelType = LabelTypes.OneLineText;
            return;
        }
        this.labelType = LabelTypes.OneLineText;
        if (this.keyAction instanceof key_action_1.KeystrokeAction) {
            var keyAction = this.keyAction;
            var newLabelSource = void 0;
            if (!keyAction.hasActiveModifier() && keyAction.hasScancode()) {
                var scancode = keyAction.scancode;
                newLabelSource = this.mapper.scanCodeToText(scancode);
                if (this.mapper.hasScancodeIcon(scancode)) {
                    this.labelSource = this.mapper.scanCodeToSvgImagePath(scancode);
                    this.labelType = LabelTypes.SingleIcon;
                }
                else if (newLabelSource !== undefined) {
                    if (newLabelSource.length === 1) {
                        this.labelSource = newLabelSource[0];
                        this.labelType = LabelTypes.OneLineText;
                    }
                    else {
                        this.labelSource = newLabelSource;
                        this.labelType = LabelTypes.TwoLineText;
                    }
                }
            }
            else if (keyAction.hasOnlyOneActiveModifier() && !keyAction.hasScancode()) {
                newLabelSource = [];
                switch (keyAction.modifierMask) {
                    case KeyModifiers_1.KeyModifiers.leftCtrl:
                    case KeyModifiers_1.KeyModifiers.rightCtrl:
                        newLabelSource.push('Ctrl');
                        break;
                    case KeyModifiers_1.KeyModifiers.leftShift:
                    case KeyModifiers_1.KeyModifiers.rightShift:
                        newLabelSource.push('Shift');
                        break;
                    case KeyModifiers_1.KeyModifiers.leftAlt:
                    case KeyModifiers_1.KeyModifiers.rightAlt:
                        newLabelSource.push('Alt');
                        break;
                    case KeyModifiers_1.KeyModifiers.leftGui:
                    case KeyModifiers_1.KeyModifiers.rightGui:
                        newLabelSource.push('Super');
                        break;
                    default:
                        newLabelSource.push('Undefined');
                        break;
                }
                this.labelSource = newLabelSource;
            }
            else {
                this.labelType = LabelTypes.KeystrokeKey;
                this.labelSource = this.keyAction;
            }
        }
        else if (this.keyAction instanceof key_action_1.SwitchLayerAction) {
            var keyAction = this.keyAction;
            var newLabelSource = void 0;
            switch (keyAction.layer) {
                case key_action_1.LayerName.mod:
                    newLabelSource = 'Mod';
                    break;
                case key_action_1.LayerName.fn:
                    newLabelSource = 'Fn';
                    break;
                case key_action_1.LayerName.mouse:
                    newLabelSource = 'Mouse';
                    break;
                default:
                    break;
            }
            if (keyAction.isLayerToggleable) {
                this.labelType = LabelTypes.TextIcon;
                this.labelSource = {
                    text: newLabelSource,
                    icon: this.mapper.getIcon('toggle')
                };
            }
            else {
                this.labelType = LabelTypes.OneLineText;
                this.labelSource = newLabelSource;
            }
        }
        else if (this.keyAction instanceof key_action_1.SwitchKeymapAction) {
            var keyAction = this.keyAction;
            this.labelType = LabelTypes.SwitchKeymap;
            this.labelSource = keyAction.keymapAbbreviation;
        }
        else if (this.keyAction instanceof key_action_1.PlayMacroAction) {
            var keyAction_1 = this.keyAction;
            var macro = this.macros.find(function (_macro) { return _macro.id === keyAction_1.macroId; });
            this.labelType = LabelTypes.IconText;
            this.labelSource = {
                icon: this.mapper.getIcon('macro'),
                text: macro.name
            };
        }
        else if (this.keyAction instanceof key_action_1.MouseAction) {
            this.labelType = LabelTypes.MouseKey;
            this.labelSource = this.keyAction;
        }
        else {
            this.labelSource = undefined;
        }
    };
    return SvgKeyboardKeyComponent;
}());
__decorate([
    core_1.Input(),
    __metadata("design:type", String)
], SvgKeyboardKeyComponent.prototype, "id", void 0);
__decorate([
    core_1.Input(),
    __metadata("design:type", String)
], SvgKeyboardKeyComponent.prototype, "rx", void 0);
__decorate([
    core_1.Input(),
    __metadata("design:type", String)
], SvgKeyboardKeyComponent.prototype, "ry", void 0);
__decorate([
    core_1.Input(),
    __metadata("design:type", Number)
], SvgKeyboardKeyComponent.prototype, "height", void 0);
__decorate([
    core_1.Input(),
    __metadata("design:type", Number)
], SvgKeyboardKeyComponent.prototype, "width", void 0);
__decorate([
    core_1.Input(),
    __metadata("design:type", key_action_1.KeyAction)
], SvgKeyboardKeyComponent.prototype, "keyAction", void 0);
__decorate([
    core_1.Input(),
    __metadata("design:type", Boolean)
], SvgKeyboardKeyComponent.prototype, "keybindAnimationEnabled", void 0);
__decorate([
    core_1.Input(),
    __metadata("design:type", Boolean)
], SvgKeyboardKeyComponent.prototype, "capturingEnabled", void 0);
__decorate([
    core_1.Output(),
    __metadata("design:type", Object)
], SvgKeyboardKeyComponent.prototype, "keyClick", void 0);
__decorate([
    core_1.Output(),
    __metadata("design:type", Object)
], SvgKeyboardKeyComponent.prototype, "capture", void 0);
__decorate([
    core_1.HostListener('click'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], SvgKeyboardKeyComponent.prototype, "onClick", null);
__decorate([
    core_1.HostListener('mousedown', ['$event']),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [MouseEvent]),
    __metadata("design:returntype", void 0)
], SvgKeyboardKeyComponent.prototype, "onMouseDown", null);
__decorate([
    core_1.HostListener('keyup', ['$event']),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [KeyboardEvent]),
    __metadata("design:returntype", void 0)
], SvgKeyboardKeyComponent.prototype, "onKeyUpe", null);
__decorate([
    core_1.HostListener('keydown', ['$event']),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [KeyboardEvent]),
    __metadata("design:returntype", void 0)
], SvgKeyboardKeyComponent.prototype, "onKeyDown", null);
__decorate([
    core_1.HostListener('focusout'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], SvgKeyboardKeyComponent.prototype, "onFocusOut", null);
SvgKeyboardKeyComponent = __decorate([
    core_1.Component({
        animations: [
            core_1.trigger('change', [
                core_1.transition('inactive => active', [
                    core_1.style({ fill: '#fff' }),
                    core_1.group([
                        core_1.animate('1s ease-out', core_1.style({
                            fill: '#333'
                        }))
                    ])
                ])
            ]),
            core_1.trigger('recording', [
                core_1.state('inactive', core_1.style({
                    fill: 'rgba(204, 0, 0, 1)'
                })),
                core_1.state('active', core_1.style({
                    fill: 'rgba(204, 0, 0, 0.6)'
                })),
                core_1.transition('inactive <=> active', core_1.animate('600ms ease-in-out'))
            ])
        ],
        selector: 'g[svg-keyboard-key]',
        template: __webpack_require__(700),
        styles: [__webpack_require__(750)]
    }),
    __metadata("design:paramtypes", [mapper_service_1.MapperService,
        store_1.Store,
        core_1.ElementRef,
        capture_service_1.CaptureService,
        core_1.Renderer])
], SvgKeyboardKeyComponent);
exports.SvgKeyboardKeyComponent = SvgKeyboardKeyComponent;


/***/ }),
/* 1066 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

function __export(m) {
    for (var p in m) if (!exports.hasOwnProperty(p)) exports[p] = m[p];
}
Object.defineProperty(exports, "__esModule", { value: true });
__export(__webpack_require__(1067));


/***/ }),
/* 1067 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
var core_1 = __webpack_require__(0);
var key_action_1 = __webpack_require__(22);
var KeyModifiers_1 = __webpack_require__(290);
var mapper_service_1 = __webpack_require__(31);
var SvgAttributes = (function () {
    function SvgAttributes() {
        this.width = 0;
        this.height = 0;
        this.x = 0;
        this.y = 0;
        this.disabled = true;
    }
    return SvgAttributes;
}());
var Modifiers;
(function (Modifiers) {
    Modifiers[Modifiers["Shift"] = 0] = "Shift";
    Modifiers[Modifiers["Control"] = 1] = "Control";
    Modifiers[Modifiers["Alt"] = 2] = "Alt";
    Modifiers[Modifiers["Command"] = 3] = "Command";
})(Modifiers || (Modifiers = {}));
var SvgKeystrokeKeyComponent = (function () {
    function SvgKeystrokeKeyComponent(mapper) {
        this.mapper = mapper;
        this.modifierIconNames = {};
        this.textContainer = new SvgAttributes();
        this.modifierContainer = new SvgAttributes();
        this.shift = new SvgAttributes();
        this.control = new SvgAttributes();
        this.option = new SvgAttributes();
        this.command = new SvgAttributes();
    }
    SvgKeystrokeKeyComponent.prototype.ngOnInit = function () {
        this.viewBox = [0, 0, this.width, this.height].join(' ');
        this.modifierIconNames.shift = this.mapper.getIcon('shift');
        this.modifierIconNames.option = this.mapper.getIcon('option');
        this.modifierIconNames.command = this.mapper.getIcon('command');
        var bottomSideMode = this.width < this.height * 1.8;
        var heightWidthRatio = this.height / this.width;
        if (bottomSideMode) {
            var maxIconWidth = this.width / 4;
            var maxIconHeight = this.height;
            var iconScalingFactor = 0.8;
            var iconWidth = iconScalingFactor * heightWidthRatio * maxIconWidth;
            var iconHeight = iconScalingFactor * maxIconHeight;
            this.modifierContainer.width = this.width;
            this.modifierContainer.height = this.height / 5;
            this.modifierContainer.y = this.height - this.modifierContainer.height;
            this.shift.width = iconWidth;
            this.shift.height = iconHeight;
            this.shift.x = (maxIconWidth - iconWidth) / 2;
            this.shift.y = (maxIconHeight - iconHeight) / 2;
            this.control.width = iconWidth;
            this.control.height = iconHeight;
            this.control.x = this.shift.x + maxIconWidth;
            this.control.y = this.shift.y;
            this.option.width = iconWidth;
            this.option.height = iconHeight;
            this.option.x = this.control.x + maxIconWidth;
            this.option.y = this.shift.y;
            this.command.width = iconWidth;
            this.command.height = iconHeight;
            this.command.x = this.option.x + maxIconWidth;
            this.command.y = this.shift.y;
            this.textContainer.y = -this.modifierContainer.height / 2;
        }
        else {
            this.modifierContainer.width = this.width / 4;
            this.modifierContainer.height = this.height;
            this.modifierContainer.x = this.width - this.modifierContainer.width;
            var length_1 = Math.min(this.modifierContainer.width / 2, this.modifierContainer.height / 2);
            var iconScalingFactor = 0.8;
            var iconWidth = iconScalingFactor * this.width * (length_1 / this.modifierContainer.width);
            var iconHeight = iconScalingFactor * this.height * (length_1 / this.modifierContainer.height);
            this.shift.width = iconWidth;
            this.shift.height = iconHeight;
            this.shift.x = this.width / 4 - iconWidth / 2;
            this.shift.y = this.height / 4 - iconHeight / 2;
            this.control.width = iconWidth;
            this.control.height = iconHeight;
            this.control.x = this.shift.x + this.width / 2;
            this.control.y = this.shift.y;
            this.option.width = iconWidth;
            this.option.height = iconHeight;
            this.option.x = this.shift.x;
            this.option.y = this.shift.y + this.height / 2;
            this.command.width = iconWidth;
            this.command.height = iconHeight;
            this.command.x = this.option.x + this.width / 2;
            this.command.y = this.option.y;
            this.textContainer.x = -this.modifierContainer.width / 2;
        }
        this.textContainer.width = this.width;
        this.textContainer.height = this.height;
    };
    SvgKeystrokeKeyComponent.prototype.ngOnChanges = function () {
        var newLabelSource;
        if (this.keystrokeAction.hasScancode()) {
            var scancode = this.keystrokeAction.scancode;
            newLabelSource = this.mapper.scanCodeToText(scancode);
            if (newLabelSource) {
                if (newLabelSource.length === 1) {
                    this.labelSource = newLabelSource[0];
                    this.labelType = 'one-line';
                }
                else {
                    this.labelSource = newLabelSource;
                    this.labelType = 'two-line';
                }
            }
            else {
                this.labelSource = this.mapper.scanCodeToSvgImagePath(scancode);
                this.labelType = 'icon';
            }
        }
        else {
            this.labelType = 'empty';
        }
        this.shift.disabled = !this.keystrokeAction.isActive(KeyModifiers_1.KeyModifiers.leftShift | KeyModifiers_1.KeyModifiers.rightShift);
        this.control.disabled = !this.keystrokeAction.isActive(KeyModifiers_1.KeyModifiers.leftCtrl | KeyModifiers_1.KeyModifiers.rightCtrl);
        this.option.disabled = !this.keystrokeAction.isActive(KeyModifiers_1.KeyModifiers.leftAlt | KeyModifiers_1.KeyModifiers.rightAlt);
        this.command.disabled = !this.keystrokeAction.isActive(KeyModifiers_1.KeyModifiers.leftGui | KeyModifiers_1.KeyModifiers.rightGui);
    };
    return SvgKeystrokeKeyComponent;
}());
__decorate([
    core_1.Input(),
    __metadata("design:type", Number)
], SvgKeystrokeKeyComponent.prototype, "height", void 0);
__decorate([
    core_1.Input(),
    __metadata("design:type", Number)
], SvgKeystrokeKeyComponent.prototype, "width", void 0);
__decorate([
    core_1.Input(),
    __metadata("design:type", key_action_1.KeystrokeAction)
], SvgKeystrokeKeyComponent.prototype, "keystrokeAction", void 0);
SvgKeystrokeKeyComponent = __decorate([
    core_1.Component({
        selector: 'g[svg-keystroke-key]',
        template: __webpack_require__(701),
        styles: [__webpack_require__(751)],
        changeDetection: core_1.ChangeDetectionStrategy.OnPush
    }),
    __metadata("design:paramtypes", [mapper_service_1.MapperService])
], SvgKeystrokeKeyComponent);
exports.SvgKeystrokeKeyComponent = SvgKeystrokeKeyComponent;


/***/ }),
/* 1068 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

function __export(m) {
    for (var p in m) if (!exports.hasOwnProperty(p)) exports[p] = m[p];
}
Object.defineProperty(exports, "__esModule", { value: true });
__export(__webpack_require__(1069));


/***/ }),
/* 1069 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
var core_1 = __webpack_require__(0);
var mapper_service_1 = __webpack_require__(31);
var SvgMouseClickKeyComponent = (function () {
    function SvgMouseClickKeyComponent(mapper) {
        this.mapper = mapper;
        this.icon = this.mapper.getIcon('mouse');
    }
    SvgMouseClickKeyComponent.prototype.ngOnInit = function () { };
    return SvgMouseClickKeyComponent;
}());
__decorate([
    core_1.Input(),
    __metadata("design:type", String)
], SvgMouseClickKeyComponent.prototype, "button", void 0);
SvgMouseClickKeyComponent = __decorate([
    core_1.Component({
        selector: 'g[svg-mouse-click-key]',
        template: __webpack_require__(702),
        changeDetection: core_1.ChangeDetectionStrategy.OnPush
    }),
    __metadata("design:paramtypes", [mapper_service_1.MapperService])
], SvgMouseClickKeyComponent);
exports.SvgMouseClickKeyComponent = SvgMouseClickKeyComponent;


/***/ }),
/* 1070 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

function __export(m) {
    for (var p in m) if (!exports.hasOwnProperty(p)) exports[p] = m[p];
}
Object.defineProperty(exports, "__esModule", { value: true });
__export(__webpack_require__(1071));


/***/ }),
/* 1071 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
var core_1 = __webpack_require__(0);
var key_action_1 = __webpack_require__(22);
var SvgMouseKeyComponent = (function () {
    function SvgMouseKeyComponent() {
    }
    SvgMouseKeyComponent.prototype.ngOnChanges = function () {
        switch (this.mouseAction.mouseAction) {
            case key_action_1.MouseActionParam.leftClick:
                this.type = 'click';
                this.param = 'Left';
                break;
            case key_action_1.MouseActionParam.rightClick:
                this.type = 'click';
                this.param = 'Right';
                break;
            case key_action_1.MouseActionParam.middleClick:
                this.type = 'click';
                this.param = 'Middle';
                break;
            case key_action_1.MouseActionParam.scrollDown:
                this.type = 'scroll';
                this.param = 'down';
                break;
            case key_action_1.MouseActionParam.scrollLeft:
                this.type = 'scroll';
                this.param = 'left';
                break;
            case key_action_1.MouseActionParam.scrollRight:
                this.type = 'scroll';
                this.param = 'right';
                break;
            case key_action_1.MouseActionParam.scrollUp:
                this.type = 'scroll';
                this.param = 'up';
                break;
            case key_action_1.MouseActionParam.moveDown:
                this.type = 'move';
                this.param = 'down';
                break;
            case key_action_1.MouseActionParam.moveLeft:
                this.type = 'move';
                this.param = 'left';
                break;
            case key_action_1.MouseActionParam.moveRight:
                this.type = 'move';
                this.param = 'right';
                break;
            case key_action_1.MouseActionParam.moveUp:
                this.type = 'move';
                this.param = 'up';
                break;
            case key_action_1.MouseActionParam.accelerate:
                this.type = 'speed';
                this.param = true;
                break;
            case key_action_1.MouseActionParam.decelerate:
                this.type = 'speed';
                this.param = false;
                break;
            default:
                break;
        }
    };
    return SvgMouseKeyComponent;
}());
__decorate([
    core_1.Input(),
    __metadata("design:type", key_action_1.MouseAction)
], SvgMouseKeyComponent.prototype, "mouseAction", void 0);
SvgMouseKeyComponent = __decorate([
    core_1.Component({
        selector: 'g[svg-mouse-key]',
        template: __webpack_require__(703),
        changeDetection: core_1.ChangeDetectionStrategy.OnPush
    }),
    __metadata("design:paramtypes", [])
], SvgMouseKeyComponent);
exports.SvgMouseKeyComponent = SvgMouseKeyComponent;


/***/ }),
/* 1072 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

function __export(m) {
    for (var p in m) if (!exports.hasOwnProperty(p)) exports[p] = m[p];
}
Object.defineProperty(exports, "__esModule", { value: true });
__export(__webpack_require__(1073));


/***/ }),
/* 1073 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
var core_1 = __webpack_require__(0);
var mapper_service_1 = __webpack_require__(31);
var SvgMouseMoveKeyComponent = (function () {
    function SvgMouseMoveKeyComponent(mapper) {
        this.mapper = mapper;
    }
    SvgMouseMoveKeyComponent.prototype.ngOnChanges = function () {
        this.mouseIcon = this.mapper.getIcon('mouse');
        this.directionIcon = this.mapper.getIcon(this.direction + "-arrow");
    };
    return SvgMouseMoveKeyComponent;
}());
__decorate([
    core_1.Input(),
    __metadata("design:type", String)
], SvgMouseMoveKeyComponent.prototype, "direction", void 0);
SvgMouseMoveKeyComponent = __decorate([
    core_1.Component({
        selector: 'g[svg-mouse-move-key]',
        template: __webpack_require__(704),
        changeDetection: core_1.ChangeDetectionStrategy.OnPush
    }),
    __metadata("design:paramtypes", [mapper_service_1.MapperService])
], SvgMouseMoveKeyComponent);
exports.SvgMouseMoveKeyComponent = SvgMouseMoveKeyComponent;


/***/ }),
/* 1074 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

function __export(m) {
    for (var p in m) if (!exports.hasOwnProperty(p)) exports[p] = m[p];
}
Object.defineProperty(exports, "__esModule", { value: true });
__export(__webpack_require__(1075));


/***/ }),
/* 1075 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
var core_1 = __webpack_require__(0);
var mapper_service_1 = __webpack_require__(31);
var SvgMouseScrollKeyComponent = (function () {
    function SvgMouseScrollKeyComponent(mapper) {
        this.mapper = mapper;
    }
    SvgMouseScrollKeyComponent.prototype.ngOnChanges = function () {
        this.mouseIcon = this.mapper.getIcon('mouse');
        this.directionIcon = this.mapper.getIcon("scroll-" + this.direction);
    };
    return SvgMouseScrollKeyComponent;
}());
__decorate([
    core_1.Input(),
    __metadata("design:type", String)
], SvgMouseScrollKeyComponent.prototype, "direction", void 0);
SvgMouseScrollKeyComponent = __decorate([
    core_1.Component({
        selector: 'g[svg-mouse-scroll-key]',
        template: __webpack_require__(705),
        changeDetection: core_1.ChangeDetectionStrategy.OnPush
    }),
    __metadata("design:paramtypes", [mapper_service_1.MapperService])
], SvgMouseScrollKeyComponent);
exports.SvgMouseScrollKeyComponent = SvgMouseScrollKeyComponent;


/***/ }),
/* 1076 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

function __export(m) {
    for (var p in m) if (!exports.hasOwnProperty(p)) exports[p] = m[p];
}
Object.defineProperty(exports, "__esModule", { value: true });
__export(__webpack_require__(1077));


/***/ }),
/* 1077 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
var core_1 = __webpack_require__(0);
var mapper_service_1 = __webpack_require__(31);
var SvgMouseSpeedKeyComponent = (function () {
    function SvgMouseSpeedKeyComponent(mapper) {
        this.mapper = mapper;
        this.icon = this.mapper.getIcon('mouse');
    }
    SvgMouseSpeedKeyComponent.prototype.ngOnChanges = function () {
        this.sign = this.plus ? '+' : '-';
    };
    return SvgMouseSpeedKeyComponent;
}());
__decorate([
    core_1.Input(),
    __metadata("design:type", Boolean)
], SvgMouseSpeedKeyComponent.prototype, "plus", void 0);
SvgMouseSpeedKeyComponent = __decorate([
    core_1.Component({
        selector: 'g[svg-mouse-speed-key]',
        template: __webpack_require__(706),
        changeDetection: core_1.ChangeDetectionStrategy.OnPush
    }),
    __metadata("design:paramtypes", [mapper_service_1.MapperService])
], SvgMouseSpeedKeyComponent);
exports.SvgMouseSpeedKeyComponent = SvgMouseSpeedKeyComponent;


/***/ }),
/* 1078 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

function __export(m) {
    for (var p in m) if (!exports.hasOwnProperty(p)) exports[p] = m[p];
}
Object.defineProperty(exports, "__esModule", { value: true });
__export(__webpack_require__(1079));


/***/ }),
/* 1079 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
var core_1 = __webpack_require__(0);
var SvgOneLineTextKeyComponent = (function () {
    function SvgOneLineTextKeyComponent() {
    }
    SvgOneLineTextKeyComponent.prototype.ngOnInit = function () {
        this.textY = this.height / 2;
        this.spanX = this.width / 2;
    };
    return SvgOneLineTextKeyComponent;
}());
__decorate([
    core_1.Input(),
    __metadata("design:type", Number)
], SvgOneLineTextKeyComponent.prototype, "height", void 0);
__decorate([
    core_1.Input(),
    __metadata("design:type", Number)
], SvgOneLineTextKeyComponent.prototype, "width", void 0);
__decorate([
    core_1.Input(),
    __metadata("design:type", String)
], SvgOneLineTextKeyComponent.prototype, "text", void 0);
SvgOneLineTextKeyComponent = __decorate([
    core_1.Component({
        selector: 'g[svg-one-line-text-key]',
        template: __webpack_require__(707),
        changeDetection: core_1.ChangeDetectionStrategy.OnPush
    }),
    __metadata("design:paramtypes", [])
], SvgOneLineTextKeyComponent);
exports.SvgOneLineTextKeyComponent = SvgOneLineTextKeyComponent;


/***/ }),
/* 1080 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

function __export(m) {
    for (var p in m) if (!exports.hasOwnProperty(p)) exports[p] = m[p];
}
Object.defineProperty(exports, "__esModule", { value: true });
__export(__webpack_require__(1081));


/***/ }),
/* 1081 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
var core_1 = __webpack_require__(0);
var SvgSingleIconKeyComponent = (function () {
    function SvgSingleIconKeyComponent() {
    }
    SvgSingleIconKeyComponent.prototype.ngOnInit = function () {
        this.svgWidth = this.width / 3;
        this.svgHeight = this.height / 3;
    };
    return SvgSingleIconKeyComponent;
}());
__decorate([
    core_1.Input(),
    __metadata("design:type", Number)
], SvgSingleIconKeyComponent.prototype, "width", void 0);
__decorate([
    core_1.Input(),
    __metadata("design:type", Number)
], SvgSingleIconKeyComponent.prototype, "height", void 0);
__decorate([
    core_1.Input(),
    __metadata("design:type", String)
], SvgSingleIconKeyComponent.prototype, "icon", void 0);
SvgSingleIconKeyComponent = __decorate([
    core_1.Component({
        selector: 'g[svg-single-icon-key]',
        template: __webpack_require__(708),
        changeDetection: core_1.ChangeDetectionStrategy.OnPush
    }),
    __metadata("design:paramtypes", [])
], SvgSingleIconKeyComponent);
exports.SvgSingleIconKeyComponent = SvgSingleIconKeyComponent;


/***/ }),
/* 1082 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

function __export(m) {
    for (var p in m) if (!exports.hasOwnProperty(p)) exports[p] = m[p];
}
Object.defineProperty(exports, "__esModule", { value: true });
__export(__webpack_require__(1083));


/***/ }),
/* 1083 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
var core_1 = __webpack_require__(0);
var mapper_service_1 = __webpack_require__(31);
var SvgSwitchKeymapKeyComponent = (function () {
    function SvgSwitchKeymapKeyComponent(mapperService) {
        this.mapperService = mapperService;
    }
    SvgSwitchKeymapKeyComponent.prototype.ngOnInit = function () {
        this.icon = this.mapperService.getIcon('switch-keymap');
        this.useWidth = this.width / 4;
        this.useHeight = this.height / 4;
        this.useX = this.width * 3 / 8;
        this.useY = this.height / 5;
        this.textY = this.height * 2 / 3;
        this.spanX = this.width / 2;
    };
    return SvgSwitchKeymapKeyComponent;
}());
__decorate([
    core_1.Input(),
    __metadata("design:type", Number)
], SvgSwitchKeymapKeyComponent.prototype, "width", void 0);
__decorate([
    core_1.Input(),
    __metadata("design:type", Number)
], SvgSwitchKeymapKeyComponent.prototype, "height", void 0);
__decorate([
    core_1.Input(),
    __metadata("design:type", String)
], SvgSwitchKeymapKeyComponent.prototype, "abbreviation", void 0);
SvgSwitchKeymapKeyComponent = __decorate([
    core_1.Component({
        selector: 'g[svg-switch-keymap-key]',
        template: __webpack_require__(709),
        changeDetection: core_1.ChangeDetectionStrategy.OnPush
    }),
    __metadata("design:paramtypes", [mapper_service_1.MapperService])
], SvgSwitchKeymapKeyComponent);
exports.SvgSwitchKeymapKeyComponent = SvgSwitchKeymapKeyComponent;


/***/ }),
/* 1084 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

function __export(m) {
    for (var p in m) if (!exports.hasOwnProperty(p)) exports[p] = m[p];
}
Object.defineProperty(exports, "__esModule", { value: true });
__export(__webpack_require__(1085));


/***/ }),
/* 1085 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
var core_1 = __webpack_require__(0);
var SvgTextIconKeyComponent = (function () {
    function SvgTextIconKeyComponent() {
    }
    SvgTextIconKeyComponent.prototype.ngOnInit = function () {
        this.useWidth = this.width / 3;
        this.useHeight = this.height / 3;
        this.useX = (this.width > 2 * this.height) ? this.width * 0.6 : this.width / 3;
        this.useY = (this.width > 2 * this.height) ? this.height / 3 : this.height / 2;
        this.textY = (this.width > 2 * this.height) ? this.height / 2 : this.height / 3;
        this.textAnchor = (this.width > 2 * this.height) ? 'end' : 'middle';
        this.spanX = (this.width > 2 * this.height) ? 0.6 * this.width : this.width / 2;
    };
    return SvgTextIconKeyComponent;
}());
__decorate([
    core_1.Input(),
    __metadata("design:type", Number)
], SvgTextIconKeyComponent.prototype, "width", void 0);
__decorate([
    core_1.Input(),
    __metadata("design:type", Number)
], SvgTextIconKeyComponent.prototype, "height", void 0);
__decorate([
    core_1.Input(),
    __metadata("design:type", String)
], SvgTextIconKeyComponent.prototype, "text", void 0);
__decorate([
    core_1.Input(),
    __metadata("design:type", String)
], SvgTextIconKeyComponent.prototype, "icon", void 0);
SvgTextIconKeyComponent = __decorate([
    core_1.Component({
        selector: 'g[svg-text-icon-key]',
        template: __webpack_require__(710),
        changeDetection: core_1.ChangeDetectionStrategy.OnPush
    }),
    __metadata("design:paramtypes", [])
], SvgTextIconKeyComponent);
exports.SvgTextIconKeyComponent = SvgTextIconKeyComponent;


/***/ }),
/* 1086 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

function __export(m) {
    for (var p in m) if (!exports.hasOwnProperty(p)) exports[p] = m[p];
}
Object.defineProperty(exports, "__esModule", { value: true });
__export(__webpack_require__(1087));


/***/ }),
/* 1087 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
var core_1 = __webpack_require__(0);
var SvgTwoLineTextKeyComponent = (function () {
    function SvgTwoLineTextKeyComponent() {
        this.spanYs = [];
    }
    SvgTwoLineTextKeyComponent.prototype.ngOnInit = function () {
        this.textY = this.height / 2;
        this.spanX = this.width / 2;
        for (var i = 0; i < this.texts.length; ++i) {
            this.spanYs.push((0.75 - i * 0.5) * this.height);
        }
    };
    return SvgTwoLineTextKeyComponent;
}());
__decorate([
    core_1.Input(),
    __metadata("design:type", Number)
], SvgTwoLineTextKeyComponent.prototype, "height", void 0);
__decorate([
    core_1.Input(),
    __metadata("design:type", Number)
], SvgTwoLineTextKeyComponent.prototype, "width", void 0);
__decorate([
    core_1.Input(),
    __metadata("design:type", Array)
], SvgTwoLineTextKeyComponent.prototype, "texts", void 0);
SvgTwoLineTextKeyComponent = __decorate([
    core_1.Component({
        selector: 'g[svg-two-line-text-key]',
        template: __webpack_require__(711),
        changeDetection: core_1.ChangeDetectionStrategy.OnPush
    }),
    __metadata("design:paramtypes", [])
], SvgTwoLineTextKeyComponent);
exports.SvgTwoLineTextKeyComponent = SvgTwoLineTextKeyComponent;


/***/ }),
/* 1088 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
var core_1 = __webpack_require__(0);
var SvgModuleComponent = (function () {
    function SvgModuleComponent() {
        this.keyClick = new core_1.EventEmitter();
        this.keyHover = new core_1.EventEmitter();
        this.capture = new core_1.EventEmitter();
        this.keyboardKeys = [];
    }
    SvgModuleComponent.prototype.onKeyClick = function (index, keyTarget) {
        this.keyClick.emit({
            index: index,
            keyTarget: keyTarget
        });
    };
    SvgModuleComponent.prototype.onKeyHover = function (index, event, over) {
        this.keyHover.emit({
            index: index,
            event: event,
            over: over
        });
    };
    SvgModuleComponent.prototype.onCapture = function (index, captured) {
        this.capture.emit({
            index: index,
            captured: captured
        });
    };
    return SvgModuleComponent;
}());
__decorate([
    core_1.Input(),
    __metadata("design:type", Array)
], SvgModuleComponent.prototype, "coverages", void 0);
__decorate([
    core_1.Input(),
    __metadata("design:type", Array)
], SvgModuleComponent.prototype, "keyboardKeys", void 0);
__decorate([
    core_1.Input(),
    __metadata("design:type", Array)
], SvgModuleComponent.prototype, "keyActions", void 0);
__decorate([
    core_1.Input(),
    __metadata("design:type", Boolean)
], SvgModuleComponent.prototype, "keybindAnimationEnabled", void 0);
__decorate([
    core_1.Input(),
    __metadata("design:type", Boolean)
], SvgModuleComponent.prototype, "capturingEnabled", void 0);
__decorate([
    core_1.Output(),
    __metadata("design:type", Object)
], SvgModuleComponent.prototype, "keyClick", void 0);
__decorate([
    core_1.Output(),
    __metadata("design:type", Object)
], SvgModuleComponent.prototype, "keyHover", void 0);
__decorate([
    core_1.Output(),
    __metadata("design:type", Object)
], SvgModuleComponent.prototype, "capture", void 0);
SvgModuleComponent = __decorate([
    core_1.Component({
        selector: 'g[svg-module]',
        template: __webpack_require__(712),
        styles: [__webpack_require__(752)],
        changeDetection: core_1.ChangeDetectionStrategy.OnPush
    }),
    __metadata("design:paramtypes", [])
], SvgModuleComponent);
exports.SvgModuleComponent = SvgModuleComponent;


/***/ }),
/* 1089 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var SvgModule = (function () {
    function SvgModule(obj) {
        this.keyboardKeys = obj.rect.map(function (rect) { return rect.$; }).map(function (rect) {
            rect.height = +rect.height;
            rect.width = +rect.width;
            return rect;
        });
        this.coverages = obj.path;
        this.attributes = obj.$;
    }
    return SvgModule;
}());
exports.SvgModule = SvgModule;


/***/ }),
/* 1090 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

function __export(m) {
    for (var p in m) if (!exports.hasOwnProperty(p)) exports[p] = m[p];
}
Object.defineProperty(exports, "__esModule", { value: true });
__export(__webpack_require__(1091));


/***/ }),
/* 1091 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
var core_1 = __webpack_require__(0);
var Observable_1 = __webpack_require__(1);
__webpack_require__(178);
__webpack_require__(65);
var store_1 = __webpack_require__(9);
var mapper_service_1 = __webpack_require__(31);
var key_action_1 = __webpack_require__(22);
var Keymap_1 = __webpack_require__(80);
var LongPressAction_1 = __webpack_require__(455);
var util_1 = __webpack_require__(1115);
var actions_1 = __webpack_require__(54);
var popover_1 = __webpack_require__(449);
var SvgKeyboardWrapComponent = (function () {
    function SvgKeyboardWrapComponent(store, mapper, element, renderer) {
        this.store = store;
        this.mapper = mapper;
        this.element = element;
        this.renderer = renderer;
        this.popoverEnabled = true;
        this.tooltipEnabled = false;
        this.currentLayer = 0;
        this.keyEditConfig = {
            moduleId: undefined,
            keyId: undefined
        };
        this.tooltipData = {
            posTop: 0,
            posLeft: 0,
            content: Observable_1.Observable.of([]),
            show: false
        };
    }
    Object.defineProperty(SvgKeyboardWrapComponent.prototype, "space", {
        get: function () {
            return this.popoverEnabled;
        },
        enumerable: true,
        configurable: true
    });
    SvgKeyboardWrapComponent.prototype.onResize = function () {
        if (this.wrapHost) {
            this.wrapPosition = this.wrapHost.getBoundingClientRect();
        }
        if (this.keyElement) {
            this.keyPosition = this.keyElement.getBoundingClientRect();
        }
    };
    SvgKeyboardWrapComponent.prototype.ngOnInit = function () {
        this.wrapHost = this.element.nativeElement;
        this.wrapPosition = this.wrapHost.getBoundingClientRect();
    };
    SvgKeyboardWrapComponent.prototype.ngOnChanges = function (changes) {
        var keymapChanges = changes['keymap'];
        if (keymapChanges) {
            this.popoverShown = false;
            this.layers = this.keymap.layers;
            if (keymapChanges.previousValue.abbreviation !== keymapChanges.currentValue.abbreviation) {
                this.currentLayer = 0;
                this.keybindAnimationEnabled = keymapChanges.isFirstChange();
            }
            else {
                this.keybindAnimationEnabled = true;
            }
        }
    };
    SvgKeyboardWrapComponent.prototype.onKeyClick = function (moduleId, keyId, keyTarget) {
        if (!this.popoverShown && this.popoverEnabled) {
            this.keyEditConfig = {
                moduleId: moduleId,
                keyId: keyId
            };
            var keyActionToEdit = this.layers[this.currentLayer].modules[moduleId].keyActions[keyId];
            this.keyElement = keyTarget;
            this.showPopover(keyActionToEdit);
        }
    };
    SvgKeyboardWrapComponent.prototype.onKeyHover = function (moduleId, event, over, keyId) {
        if (this.tooltipEnabled) {
            var keyActionToEdit = this.layers[this.currentLayer].modules[moduleId].keyActions[keyId];
            if (over) {
                this.showTooltip(keyActionToEdit, event);
            }
            else {
                this.hideTooltip();
            }
        }
    };
    SvgKeyboardWrapComponent.prototype.onCapture = function (moduleId, keyId, captured) {
        var keystrokeAction = new key_action_1.KeystrokeAction();
        var modifiers = captured.left.concat(captured.right).map(function (x) { return x ? 1 : 0; });
        keystrokeAction.scancode = captured.code;
        keystrokeAction.modifierMask = 0;
        for (var i = 0; i < modifiers.length; ++i) {
            keystrokeAction.modifierMask |= modifiers[i] << this.mapper.modifierMapper(i);
        }
        this.store.dispatch(actions_1.KeymapActions.saveKey(this.keymap, this.currentLayer, moduleId, keyId, keystrokeAction));
    };
    SvgKeyboardWrapComponent.prototype.onRemap = function (keyAction) {
        this.store.dispatch(actions_1.KeymapActions.saveKey(this.keymap, this.currentLayer, this.keyEditConfig.moduleId, this.keyEditConfig.keyId, keyAction));
        this.hidePopover();
    };
    SvgKeyboardWrapComponent.prototype.showPopover = function (keyAction) {
        this.keyPosition = this.keyElement.getBoundingClientRect();
        this.popoverInitKeyAction = keyAction;
        this.popoverShown = true;
        this.renderer.invokeElementMethod(this.popover.nativeElement, 'focus');
    };
    SvgKeyboardWrapComponent.prototype.showTooltip = function (keyAction, event) {
        if (keyAction === undefined) {
            return;
        }
        var el = event.target || event.srcElement;
        var position = el.getBoundingClientRect();
        var posLeft = this.tooltipData.posLeft;
        var posTop = this.tooltipData.posTop;
        if (el.tagName === 'g') {
            posLeft = position.left + (position.width / 2);
            posTop = position.top + position.height;
        }
        this.tooltipData = {
            posLeft: posLeft,
            posTop: posTop,
            content: this.getKeyActionContent(keyAction),
            show: true
        };
    };
    SvgKeyboardWrapComponent.prototype.hideTooltip = function () {
        this.tooltipData.show = false;
    };
    SvgKeyboardWrapComponent.prototype.hidePopover = function () {
        this.popoverShown = false;
    };
    SvgKeyboardWrapComponent.prototype.selectLayer = function (index) {
        this.currentLayer = index;
    };
    SvgKeyboardWrapComponent.prototype.getSelectedLayer = function () {
        return this.currentLayer;
    };
    SvgKeyboardWrapComponent.prototype.getKeyActionContent = function (keyAction) {
        if (keyAction instanceof key_action_1.KeystrokeAction) {
            var keystrokeAction = keyAction;
            var content = [];
            content.push({
                name: 'Action type',
                value: 'Keystroke'
            });
            if (keystrokeAction.hasScancode()) {
                var value = keystrokeAction.scancode.toString();
                var scanCodeTexts = (this.mapper.scanCodeToText(keystrokeAction.scancode) || []).join(', ');
                if (scanCodeTexts.length > 0) {
                    value += ' (' + scanCodeTexts + ')';
                }
                content.push({
                    name: 'Scancode',
                    value: value
                });
            }
            if (keystrokeAction.hasActiveModifier()) {
                content.push({
                    name: 'Modifiers',
                    value: keystrokeAction.getModifierList().join(', ')
                });
            }
            if (keystrokeAction.hasLongPressAction()) {
                content.push({
                    name: 'Long press',
                    value: LongPressAction_1.LongPressAction[keystrokeAction.longPressAction]
                });
            }
            return Observable_1.Observable.of(content);
        }
        else if (keyAction instanceof key_action_1.MouseAction) {
            var mouseAction = keyAction;
            var content = [
                {
                    name: 'Action type',
                    value: 'Mouse'
                },
                {
                    name: 'Action',
                    value: util_1.camelCaseToSentence(key_action_1.MouseActionParam[mouseAction.mouseAction])
                }
            ];
            return Observable_1.Observable.of(content);
        }
        else if (keyAction instanceof key_action_1.PlayMacroAction) {
            var playMacroAction_1 = keyAction;
            return this.store
                .select(function (appState) { return appState.userConfiguration.macros; })
                .map(function (macroState) { return macroState.find(function (macro) {
                return macro.id === playMacroAction_1.macroId;
            }).name; })
                .map(function (macroName) {
                var content = [
                    {
                        name: 'Action type',
                        value: 'Play macro'
                    },
                    {
                        name: 'Macro name',
                        value: macroName
                    }
                ];
                return content;
            });
        }
        else if (keyAction instanceof key_action_1.SwitchKeymapAction) {
            var switchKeymapAction_1 = keyAction;
            return this.store
                .select(function (appState) { return appState.userConfiguration.keymaps; })
                .map(function (keymaps) { return keymaps.find(function (keymap) { return keymap.abbreviation === switchKeymapAction_1.keymapAbbreviation; }).name; })
                .map(function (keymapName) {
                var content = [
                    {
                        name: 'Action type',
                        value: 'Switch keymap'
                    },
                    {
                        name: 'Keymap',
                        value: keymapName
                    }
                ];
                return content;
            });
        }
        else if (keyAction instanceof key_action_1.SwitchLayerAction) {
            var switchLayerAction = keyAction;
            var content = [
                {
                    name: 'Action type',
                    value: 'Switch layer'
                },
                {
                    name: 'Layer',
                    value: util_1.capitalizeFirstLetter(key_action_1.LayerName[switchLayerAction.layer])
                },
                {
                    name: 'Toogle',
                    value: switchLayerAction.isLayerToggleable ? 'On' : 'Off'
                }
            ];
            return Observable_1.Observable.of(content);
        }
        return Observable_1.Observable.of([]);
    };
    return SvgKeyboardWrapComponent;
}());
__decorate([
    core_1.Input(),
    __metadata("design:type", Keymap_1.Keymap)
], SvgKeyboardWrapComponent.prototype, "keymap", void 0);
__decorate([
    core_1.Input(),
    __metadata("design:type", Boolean)
], SvgKeyboardWrapComponent.prototype, "popoverEnabled", void 0);
__decorate([
    core_1.Input(),
    __metadata("design:type", Boolean)
], SvgKeyboardWrapComponent.prototype, "tooltipEnabled", void 0);
__decorate([
    core_1.ViewChild(popover_1.PopoverComponent, { read: core_1.ElementRef }),
    __metadata("design:type", core_1.ElementRef)
], SvgKeyboardWrapComponent.prototype, "popover", void 0);
__decorate([
    core_1.HostBinding('class.space'),
    __metadata("design:type", Object),
    __metadata("design:paramtypes", [])
], SvgKeyboardWrapComponent.prototype, "space", null);
__decorate([
    core_1.HostListener('window:resize'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], SvgKeyboardWrapComponent.prototype, "onResize", null);
SvgKeyboardWrapComponent = __decorate([
    core_1.Component({
        selector: 'svg-keyboard-wrap',
        template: __webpack_require__(713),
        styles: [__webpack_require__(753)],
        changeDetection: core_1.ChangeDetectionStrategy.OnPush
    }),
    __metadata("design:paramtypes", [store_1.Store,
        mapper_service_1.MapperService,
        core_1.ElementRef,
        core_1.Renderer])
], SvgKeyboardWrapComponent);
exports.SvgKeyboardWrapComponent = SvgKeyboardWrapComponent;


/***/ }),
/* 1092 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
var assert_1 = __webpack_require__(26);
var ModuleConfiguration = (function () {
    function ModuleConfiguration() {
    }
    ModuleConfiguration.prototype.fromJsonObject = function (jsonObject) {
        this.id = jsonObject.id;
        this.initialPointerSpeed = jsonObject.initialPointerSpeed;
        this.pointerAcceleration = jsonObject.pointerAcceleration;
        this.maxPointerSpeed = jsonObject.maxPointerSpeed;
        return this;
    };
    ModuleConfiguration.prototype.fromBinary = function (buffer) {
        this.id = buffer.readUInt8();
        this.initialPointerSpeed = buffer.readUInt8();
        this.pointerAcceleration = buffer.readUInt8();
        this.maxPointerSpeed = buffer.readUInt8();
        return this;
    };
    ModuleConfiguration.prototype.toJsonObject = function () {
        return {
            id: this.id,
            initialPointerSpeed: this.initialPointerSpeed,
            pointerAcceleration: this.pointerAcceleration,
            maxPointerSpeed: this.maxPointerSpeed
        };
    };
    ModuleConfiguration.prototype.toBinary = function (buffer) {
        buffer.writeUInt8(this.id);
        buffer.writeUInt8(this.initialPointerSpeed);
        buffer.writeUInt8(this.pointerAcceleration);
        buffer.writeUInt8(this.maxPointerSpeed);
    };
    ModuleConfiguration.prototype.toString = function () {
        return "<ModuleConfiguration id=\"" + this.id + "\" >";
    };
    return ModuleConfiguration;
}());
__decorate([
    assert_1.assertUInt8,
    __metadata("design:type", Number)
], ModuleConfiguration.prototype, "id", void 0);
__decorate([
    assert_1.assertUInt8,
    __metadata("design:type", Number)
], ModuleConfiguration.prototype, "initialPointerSpeed", void 0);
__decorate([
    assert_1.assertUInt8,
    __metadata("design:type", Number)
], ModuleConfiguration.prototype, "pointerAcceleration", void 0);
__decorate([
    assert_1.assertUInt8,
    __metadata("design:type", Number)
], ModuleConfiguration.prototype, "maxPointerSpeed", void 0);
exports.ModuleConfiguration = ModuleConfiguration;


/***/ }),
/* 1093 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
var assert_1 = __webpack_require__(26);
var LongPressAction_1 = __webpack_require__(455);
var KeyAction_1 = __webpack_require__(81);
var KeystrokeActionFlag;
(function (KeystrokeActionFlag) {
    KeystrokeActionFlag[KeystrokeActionFlag["scancode"] = 1] = "scancode";
    KeystrokeActionFlag[KeystrokeActionFlag["modifierMask"] = 2] = "modifierMask";
    KeystrokeActionFlag[KeystrokeActionFlag["longPressAction"] = 4] = "longPressAction";
})(KeystrokeActionFlag = exports.KeystrokeActionFlag || (exports.KeystrokeActionFlag = {}));
var MODIFIERS = ['LCtrl', 'LShift', 'LAlt', 'LSuper', 'RCtrl', 'RShift', 'RAlt', 'RSuper'];
var KeystrokeAction = (function (_super) {
    __extends(KeystrokeAction, _super);
    function KeystrokeAction(other) {
        var _this = _super.call(this) || this;
        if (!other) {
            return _this;
        }
        _this.scancode = other.scancode;
        _this.modifierMask = other.modifierMask;
        _this.longPressAction = other.longPressAction;
        return _this;
    }
    KeystrokeAction.prototype.fromJsonObject = function (jsonObject) {
        this.assertKeyActionType(jsonObject);
        this.scancode = jsonObject.scancode;
        this.modifierMask = jsonObject.modifierMask;
        this.longPressAction = LongPressAction_1.LongPressAction[jsonObject.longPressAction];
        return this;
    };
    KeystrokeAction.prototype.fromBinary = function (buffer) {
        var keyActionId = this.readAndAssertKeyActionId(buffer);
        var flags = keyActionId - KeyAction_1.KeyActionId.KeystrokeAction;
        if (flags & KeystrokeActionFlag.scancode) {
            this.scancode = buffer.readUInt8();
        }
        if (flags & KeystrokeActionFlag.modifierMask) {
            this.modifierMask = buffer.readUInt8();
        }
        if (flags & KeystrokeActionFlag.longPressAction) {
            this.longPressAction = buffer.readUInt8();
        }
        return this;
    };
    KeystrokeAction.prototype.toJsonObject = function () {
        var jsonObject = {
            keyActionType: KeyAction_1.keyActionType.KeystrokeAction
        };
        if (this.hasScancode()) {
            jsonObject.scancode = this.scancode;
        }
        if (this.hasActiveModifier()) {
            jsonObject.modifierMask = this.modifierMask;
        }
        if (this.hasLongPressAction()) {
            jsonObject.longPressAction = LongPressAction_1.LongPressAction[this.longPressAction];
        }
        return jsonObject;
    };
    KeystrokeAction.prototype.toBinary = function (buffer) {
        var flags = 0;
        var bufferData = [];
        if (this.hasScancode()) {
            flags |= KeystrokeActionFlag.scancode;
            bufferData.push(this.scancode);
        }
        if (this.hasActiveModifier()) {
            flags |= KeystrokeActionFlag.modifierMask;
            bufferData.push(this.modifierMask);
        }
        if (this.hasLongPressAction()) {
            flags |= KeystrokeActionFlag.longPressAction;
            bufferData.push(this.longPressAction);
        }
        buffer.writeUInt8(KeyAction_1.KeyActionId.KeystrokeAction + flags);
        for (var i = 0; i < bufferData.length; ++i) {
            buffer.writeUInt8(bufferData[i]);
        }
    };
    KeystrokeAction.prototype.toString = function () {
        var properties = [];
        if (this.hasScancode()) {
            properties.push("scancode=\"" + this.scancode + "\"");
        }
        if (this.hasActiveModifier()) {
            properties.push("modifierMask=\"" + this.modifierMask + "\"");
        }
        if (this.hasLongPressAction()) {
            properties.push("longPressAction=\"" + this.longPressAction + "\"");
        }
        return "<KeystrokeAction " + properties.join(' ') + ">";
    };
    KeystrokeAction.prototype.isActive = function (modifier) {
        return (this.modifierMask & modifier) > 0;
    };
    KeystrokeAction.prototype.hasActiveModifier = function () {
        return this.modifierMask > 0;
    };
    KeystrokeAction.prototype.hasLongPressAction = function () {
        return this.longPressAction !== undefined;
    };
    KeystrokeAction.prototype.hasScancode = function () {
        return !!this.scancode;
    };
    KeystrokeAction.prototype.hasOnlyOneActiveModifier = function () {
        return this.modifierMask !== 0 && !(this.modifierMask & this.modifierMask - 1);
    };
    KeystrokeAction.prototype.getModifierList = function () {
        var modifierList = [];
        var modifierMask = this.modifierMask;
        for (var i = 0; modifierMask !== 0; ++i, modifierMask >>= 1) {
            if (modifierMask & 1) {
                modifierList.push(MODIFIERS[i]);
            }
        }
        return modifierList;
    };
    return KeystrokeAction;
}(KeyAction_1.KeyAction));
__decorate([
    assert_1.assertUInt8,
    __metadata("design:type", Number)
], KeystrokeAction.prototype, "scancode", void 0);
__decorate([
    assert_1.assertUInt8,
    __metadata("design:type", Number)
], KeystrokeAction.prototype, "modifierMask", void 0);
__decorate([
    assert_1.assertEnum(LongPressAction_1.LongPressAction),
    __metadata("design:type", Number)
], KeystrokeAction.prototype, "longPressAction", void 0);
exports.KeystrokeAction = KeystrokeAction;


/***/ }),
/* 1094 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
var assert_1 = __webpack_require__(26);
var KeyAction_1 = __webpack_require__(81);
var MouseActionParam;
(function (MouseActionParam) {
    MouseActionParam[MouseActionParam["leftClick"] = 0] = "leftClick";
    MouseActionParam[MouseActionParam["middleClick"] = 1] = "middleClick";
    MouseActionParam[MouseActionParam["rightClick"] = 2] = "rightClick";
    MouseActionParam[MouseActionParam["moveUp"] = 3] = "moveUp";
    MouseActionParam[MouseActionParam["moveDown"] = 4] = "moveDown";
    MouseActionParam[MouseActionParam["moveLeft"] = 5] = "moveLeft";
    MouseActionParam[MouseActionParam["moveRight"] = 6] = "moveRight";
    MouseActionParam[MouseActionParam["scrollUp"] = 7] = "scrollUp";
    MouseActionParam[MouseActionParam["scrollDown"] = 8] = "scrollDown";
    MouseActionParam[MouseActionParam["scrollLeft"] = 9] = "scrollLeft";
    MouseActionParam[MouseActionParam["scrollRight"] = 10] = "scrollRight";
    MouseActionParam[MouseActionParam["accelerate"] = 11] = "accelerate";
    MouseActionParam[MouseActionParam["decelerate"] = 12] = "decelerate";
})(MouseActionParam = exports.MouseActionParam || (exports.MouseActionParam = {}));
var MouseAction = (function (_super) {
    __extends(MouseAction, _super);
    function MouseAction(other) {
        var _this = _super.call(this) || this;
        if (!other) {
            return _this;
        }
        _this.mouseAction = other.mouseAction;
        return _this;
    }
    MouseAction.prototype.fromJsonObject = function (jsObject) {
        this.assertKeyActionType(jsObject);
        this.mouseAction = MouseActionParam[jsObject.mouseAction];
        return this;
    };
    MouseAction.prototype.fromBinary = function (buffer) {
        this.readAndAssertKeyActionId(buffer);
        this.mouseAction = buffer.readUInt8();
        return this;
    };
    MouseAction.prototype.toJsonObject = function () {
        return {
            keyActionType: KeyAction_1.keyActionType.MouseAction,
            mouseAction: MouseActionParam[this.mouseAction]
        };
    };
    MouseAction.prototype.toBinary = function (buffer) {
        buffer.writeUInt8(KeyAction_1.KeyActionId.MouseAction);
        buffer.writeUInt8(this.mouseAction);
    };
    MouseAction.prototype.toString = function () {
        return "<MouseAction mouseAction=\"" + this.mouseAction + "\">";
    };
    return MouseAction;
}(KeyAction_1.KeyAction));
__decorate([
    assert_1.assertEnum(MouseActionParam),
    __metadata("design:type", Number)
], MouseAction.prototype, "mouseAction", void 0);
exports.MouseAction = MouseAction;


/***/ }),
/* 1095 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
var KeyAction_1 = __webpack_require__(81);
/**
 * NoneAction is only intended for binary serialization of undefined key actions
 * DO NOT use it as a real KeyAction
 *
 */
var NoneAction = (function (_super) {
    __extends(NoneAction, _super);
    function NoneAction() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    NoneAction.prototype.fromJsonObject = function (jsonObject) {
        this.assertKeyActionType(jsonObject);
        return this;
    };
    NoneAction.prototype.fromBinary = function (buffer) {
        this.readAndAssertKeyActionId(buffer);
        return this;
    };
    NoneAction.prototype.toJsonObject = function () {
        return {
            keyActionType: KeyAction_1.keyActionType.NoneAction
        };
    };
    NoneAction.prototype.toBinary = function (buffer) {
        buffer.writeUInt8(KeyAction_1.KeyActionId.NoneAction);
    };
    NoneAction.prototype.toString = function () {
        return '<NoneAction>';
    };
    return NoneAction;
}(KeyAction_1.KeyAction));
exports.NoneAction = NoneAction;


/***/ }),
/* 1096 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
var assert_1 = __webpack_require__(26);
var KeyAction_1 = __webpack_require__(81);
var PlayMacroAction = (function (_super) {
    __extends(PlayMacroAction, _super);
    function PlayMacroAction(parameter) {
        var _this = _super.call(this) || this;
        if (!parameter) {
            return _this;
        }
        if (parameter instanceof PlayMacroAction) {
            _this.macroId = parameter.macroId;
        }
        else {
            _this.macroId = parameter.id;
        }
        return _this;
    }
    PlayMacroAction.prototype.fromJsonObject = function (jsonObject, macros) {
        this.assertKeyActionType(jsonObject);
        this.macroId = macros[jsonObject.macroIndex].id;
        return this;
    };
    PlayMacroAction.prototype.fromBinary = function (buffer, macros) {
        this.readAndAssertKeyActionId(buffer);
        var macroIndex = buffer.readUInt8();
        this.macroId = macros[macroIndex].id;
        return this;
    };
    PlayMacroAction.prototype.toJsonObject = function (macros) {
        var _this = this;
        return {
            keyActionType: KeyAction_1.keyActionType.PlayMacroAction,
            macroIndex: macros.findIndex(function (macro) { return macro.id === _this.macroId; })
        };
    };
    PlayMacroAction.prototype.toBinary = function (buffer, macros) {
        var _this = this;
        buffer.writeUInt8(KeyAction_1.KeyActionId.PlayMacroAction);
        buffer.writeUInt8(macros.findIndex(function (macro) { return macro.id === _this.macroId; }));
    };
    PlayMacroAction.prototype.toString = function () {
        return "<PlayMacroAction macroId=\"" + this.macroId + "\">";
    };
    return PlayMacroAction;
}(KeyAction_1.KeyAction));
__decorate([
    assert_1.assertUInt8,
    __metadata("design:type", Number)
], PlayMacroAction.prototype, "macroId", void 0);
exports.PlayMacroAction = PlayMacroAction;


/***/ }),
/* 1097 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
var Keymap_1 = __webpack_require__(80);
var KeyAction_1 = __webpack_require__(81);
var SwitchKeymapAction = (function (_super) {
    __extends(SwitchKeymapAction, _super);
    function SwitchKeymapAction(parameter) {
        var _this = _super.call(this) || this;
        if (!parameter) {
            return _this;
        }
        if (parameter instanceof SwitchKeymapAction) {
            _this.keymapAbbreviation = parameter.keymapAbbreviation;
        }
        else if (parameter instanceof Keymap_1.Keymap) {
            _this.keymapAbbreviation = parameter.abbreviation;
        }
        else {
            _this.keymapAbbreviation = parameter;
        }
        return _this;
    }
    SwitchKeymapAction.prototype.fromJsonObject = function (jsonObject) {
        this.assertKeyActionType(jsonObject);
        this.keymapAbbreviation = jsonObject.keymapAbbreviation;
        return this;
    };
    SwitchKeymapAction.prototype.fromBinary = function (buffer) {
        this.readAndAssertKeyActionId(buffer);
        this.keymapAbbreviation = buffer.readString();
        return this;
    };
    SwitchKeymapAction.prototype.toJsonObject = function () {
        return {
            keyActionType: KeyAction_1.keyActionType.SwitchKeymapAction,
            keymapAbbreviation: this.keymapAbbreviation
        };
    };
    SwitchKeymapAction.prototype.toBinary = function (buffer) {
        buffer.writeUInt8(KeyAction_1.KeyActionId.SwitchKeymapAction);
        buffer.writeString(this.keymapAbbreviation);
    };
    SwitchKeymapAction.prototype.toString = function () {
        return "<SwitchKeymapAction keymapAbbreviation=\"" + this.keymapAbbreviation + "\">";
    };
    SwitchKeymapAction.prototype.renameKeymap = function (oldAbbr, newAbbr) {
        if (this.keymapAbbreviation !== oldAbbr) {
            return this;
        }
        return new SwitchKeymapAction(newAbbr);
    };
    return SwitchKeymapAction;
}(KeyAction_1.KeyAction));
exports.SwitchKeymapAction = SwitchKeymapAction;


/***/ }),
/* 1098 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
var assert_1 = __webpack_require__(26);
var KeyAction_1 = __webpack_require__(81);
var LayerName;
(function (LayerName) {
    LayerName[LayerName["mod"] = 0] = "mod";
    LayerName[LayerName["fn"] = 1] = "fn";
    LayerName[LayerName["mouse"] = 2] = "mouse";
})(LayerName = exports.LayerName || (exports.LayerName = {}));
var SwitchLayerAction = (function (_super) {
    __extends(SwitchLayerAction, _super);
    function SwitchLayerAction(other) {
        var _this = _super.call(this) || this;
        if (!other) {
            return _this;
        }
        _this.isLayerToggleable = other.isLayerToggleable;
        _this.layer = other.layer;
        return _this;
    }
    SwitchLayerAction.prototype.fromJsonObject = function (jsonObject) {
        this.assertKeyActionType(jsonObject);
        this.layer = LayerName[jsonObject.layer];
        this.isLayerToggleable = jsonObject.toggle;
        return this;
    };
    SwitchLayerAction.prototype.fromBinary = function (buffer) {
        this.readAndAssertKeyActionId(buffer);
        this.layer = buffer.readUInt8();
        this.isLayerToggleable = buffer.readBoolean();
        return this;
    };
    SwitchLayerAction.prototype.toJsonObject = function () {
        return {
            keyActionType: KeyAction_1.keyActionType.SwitchLayerAction,
            layer: LayerName[this.layer],
            toggle: this.isLayerToggleable
        };
    };
    SwitchLayerAction.prototype.toBinary = function (buffer) {
        buffer.writeUInt8(KeyAction_1.KeyActionId.SwitchLayerAction);
        buffer.writeUInt8(this.layer);
        buffer.writeBoolean(this.isLayerToggleable);
    };
    SwitchLayerAction.prototype.toString = function () {
        return "<SwitchLayerAction layer=\"" + this.layer + "\" toggle=\"" + this.isLayerToggleable + "\">";
    };
    return SwitchLayerAction;
}(KeyAction_1.KeyAction));
__decorate([
    assert_1.assertEnum(LayerName),
    __metadata("design:type", Number)
], SwitchLayerAction.prototype, "layer", void 0);
exports.SwitchLayerAction = SwitchLayerAction;


/***/ }),
/* 1099 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var UhkBuffer_1 = __webpack_require__(453);
var index_1 = __webpack_require__(22);
var Helper = (function () {
    function Helper() {
    }
    Helper.createKeyAction = function (source, macros) {
        if (source instanceof index_1.KeyAction) {
            return Helper.fromKeyAction(source);
        }
        else if (source instanceof UhkBuffer_1.UhkBuffer) {
            return Helper.fromUhkBuffer(source, macros);
        }
        else {
            return Helper.fromJSONObject(source, macros);
        }
    };
    Helper.fromUhkBuffer = function (buffer, macros) {
        var keyActionFirstByte = buffer.readUInt8();
        buffer.backtrack();
        if (keyActionFirstByte >= index_1.KeyActionId.KeystrokeAction && keyActionFirstByte < index_1.KeyActionId.LastKeystrokeAction) {
            return new index_1.KeystrokeAction().fromBinary(buffer);
        }
        switch (keyActionFirstByte) {
            case index_1.KeyActionId.NoneAction:
                buffer.readUInt8(); // Read type just to skip it
                return undefined;
            case index_1.KeyActionId.SwitchLayerAction:
                return new index_1.SwitchLayerAction().fromBinary(buffer);
            case index_1.KeyActionId.SwitchKeymapAction:
                return new index_1.SwitchKeymapAction().fromBinary(buffer);
            case index_1.KeyActionId.MouseAction:
                return new index_1.MouseAction().fromBinary(buffer);
            case index_1.KeyActionId.PlayMacroAction:
                return new index_1.PlayMacroAction().fromBinary(buffer, macros);
            default:
                throw "Invalid KeyAction first byte: " + keyActionFirstByte;
        }
    };
    Helper.fromKeyAction = function (keyAction) {
        var newKeyAction;
        if (keyAction instanceof index_1.KeystrokeAction) {
            newKeyAction = new index_1.KeystrokeAction(keyAction);
        }
        else if (keyAction instanceof index_1.SwitchLayerAction) {
            newKeyAction = new index_1.SwitchLayerAction(keyAction);
        }
        else if (keyAction instanceof index_1.SwitchKeymapAction) {
            newKeyAction = new index_1.SwitchKeymapAction(keyAction);
        }
        else if (keyAction instanceof index_1.MouseAction) {
            newKeyAction = new index_1.MouseAction(keyAction);
        }
        else if (keyAction instanceof index_1.PlayMacroAction) {
            newKeyAction = new index_1.PlayMacroAction(keyAction);
        }
        return newKeyAction;
    };
    Helper.fromJSONObject = function (keyAction, macros) {
        if (!keyAction) {
            return;
        }
        switch (keyAction.keyActionType) {
            case index_1.keyActionType.KeystrokeAction:
                return new index_1.KeystrokeAction().fromJsonObject(keyAction);
            case index_1.keyActionType.SwitchLayerAction:
                return new index_1.SwitchLayerAction().fromJsonObject(keyAction);
            case index_1.keyActionType.SwitchKeymapAction:
                return new index_1.SwitchKeymapAction().fromJsonObject(keyAction);
            case index_1.keyActionType.MouseAction:
                return new index_1.MouseAction().fromJsonObject(keyAction);
            case index_1.keyActionType.PlayMacroAction:
                return new index_1.PlayMacroAction().fromJsonObject(keyAction, macros);
            default:
                throw "Invalid KeyAction.keyActionType: \"" + keyAction.keyActionType + "\"";
        }
    };
    return Helper;
}());
exports.Helper = Helper;


/***/ }),
/* 1100 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var key_action_1 = __webpack_require__(22);
var DelayMacroAction_1 = __webpack_require__(457);
var KeyMacroAction_1 = __webpack_require__(458);
var MacroAction_1 = __webpack_require__(68);
var MouseButtonMacroAction_1 = __webpack_require__(459);
var MoveMouseMacroAction_1 = __webpack_require__(460);
var ScrollMouseMacroAction_1 = __webpack_require__(461);
var TextMacroAction_1 = __webpack_require__(462);
var EditableMacroAction = (function () {
    function EditableMacroAction(jsObject) {
        if (!jsObject) {
            return;
        }
        this.macroActionType = jsObject.macroActionType;
        switch (this.macroActionType) {
            case MacroAction_1.macroActionType.KeyMacroAction:
                this.action = MacroAction_1.MacroSubAction[jsObject.action];
                this.scancode = jsObject.scancode;
                this.modifierMask = jsObject.modifierMask;
                break;
            case MacroAction_1.macroActionType.MouseButtonMacroAction:
                this.action = MacroAction_1.MacroSubAction[jsObject.action];
                this.mouseButtonsMask = jsObject.mouseButtonsMask;
                break;
            case MacroAction_1.macroActionType.MoveMouseMacroAction:
                this.moveX = jsObject.x;
                this.moveY = jsObject.y;
                break;
            case MacroAction_1.macroActionType.ScrollMouseMacroAction:
                this.scrollX = jsObject.x;
                this.scrollY = jsObject.y;
                break;
            case MacroAction_1.macroActionType.TextMacroAction:
                this.text = jsObject.text;
                break;
            case MacroAction_1.macroActionType.DelayMacroAction:
                this.delay = jsObject.delay;
                break;
            default:
                break;
        }
    }
    EditableMacroAction.prototype.toJsObject = function () {
        return {
            macroActionType: this.macroActionType,
            action: this.action,
            delay: this.delay,
            text: this.text,
            scancode: this.scancode,
            modifierMask: this.modifierMask,
            mouseButtonsMask: this.mouseButtonsMask,
            mouseMove: {
                x: this.moveX,
                y: this.moveY
            },
            mouseScroll: {
                x: this.scrollX,
                y: this.scrollY
            }
        };
    };
    EditableMacroAction.prototype.fromKeyAction = function (keyAction) {
        var data = keyAction.toJsonObject();
        this.scancode = data.scancode;
        this.modifierMask = data.modifierMask;
    };
    EditableMacroAction.prototype.toKeystrokeAction = function () {
        var data = this.toJsObject();
        data.keyActionType = key_action_1.keyActionType.KeystrokeAction;
        return (new key_action_1.KeystrokeAction().fromJsonObject(data));
    };
    EditableMacroAction.prototype.setMouseButtons = function (buttonStates) {
        var bitmask = 0;
        for (var i = 0; i < buttonStates.length; i++) {
            bitmask |= Number(buttonStates[i]) << i;
        }
        this.mouseButtonsMask = bitmask;
    };
    EditableMacroAction.prototype.getMouseButtons = function () {
        var enabledMouseButtons = [];
        for (var bitmask = this.mouseButtonsMask; bitmask; bitmask >>>= 1) {
            enabledMouseButtons.push(Boolean(bitmask & 1));
        }
        return enabledMouseButtons;
    };
    EditableMacroAction.prototype.toClass = function () {
        switch (this.macroActionType) {
            // Delay action
            case MacroAction_1.macroActionType.DelayMacroAction:
                return new DelayMacroAction_1.DelayMacroAction().fromJsonObject({
                    macroActionType: this.macroActionType,
                    delay: this.delay
                });
            // Text action
            case MacroAction_1.macroActionType.TextMacroAction:
                return new TextMacroAction_1.TextMacroAction().fromJsonObject({
                    macroActionType: this.macroActionType,
                    text: this.text
                });
            // Keypress action
            case MacroAction_1.macroActionType.KeyMacroAction:
                return new KeyMacroAction_1.KeyMacroAction().fromJsonObject({
                    macroActionType: this.macroActionType,
                    action: MacroAction_1.MacroSubAction[this.action],
                    scancode: this.scancode,
                    modifierMask: this.modifierMask
                });
            // Mouse actions
            case MacroAction_1.macroActionType.MouseButtonMacroAction:
                return new MouseButtonMacroAction_1.MouseButtonMacroAction().fromJsonObject({
                    macroActionType: this.macroActionType,
                    action: MacroAction_1.MacroSubAction[this.action],
                    mouseButtonsMask: this.mouseButtonsMask
                });
            case MacroAction_1.macroActionType.MoveMouseMacroAction:
                return new MoveMouseMacroAction_1.MoveMouseMacroAction().fromJsonObject({
                    macroActionType: this.macroActionType,
                    x: this.moveX,
                    y: this.moveY
                });
            case MacroAction_1.macroActionType.ScrollMouseMacroAction:
                return new ScrollMouseMacroAction_1.ScrollMouseMacroAction().fromJsonObject({
                    macroActionType: this.macroActionType,
                    x: this.scrollX,
                    y: this.scrollY
                });
            default:
                throw new Error('Macro action type is missing or not implemented.');
        }
    };
    EditableMacroAction.prototype.isKeyAction = function () {
        return this.macroActionType === MacroAction_1.macroActionType.KeyMacroAction;
    };
    EditableMacroAction.prototype.isMouseButtonAction = function () {
        return this.macroActionType === MacroAction_1.macroActionType.MouseButtonMacroAction;
    };
    EditableMacroAction.prototype.isOnlyHoldAction = function () {
        return this.action === MacroAction_1.MacroSubAction.hold;
    };
    EditableMacroAction.prototype.isOnlyPressAction = function () {
        return this.action === MacroAction_1.MacroSubAction.press;
    };
    EditableMacroAction.prototype.isOnlyReleaseAction = function () {
        return this.action === MacroAction_1.MacroSubAction.release;
    };
    return EditableMacroAction;
}());
exports.EditableMacroAction = EditableMacroAction;


/***/ }),
/* 1101 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var UhkBuffer_1 = __webpack_require__(453);
var index_1 = __webpack_require__(69);
var Helper = (function () {
    function Helper() {
    }
    Helper.createMacroAction = function (source) {
        if (source instanceof index_1.MacroAction) {
            return Helper.fromMacroAction(source);
        }
        else if (source instanceof UhkBuffer_1.UhkBuffer) {
            return Helper.fromUhkBuffer(source);
        }
        else {
            return Helper.fromJSONObject(source);
        }
    };
    Helper.fromUhkBuffer = function (buffer) {
        var macroActionFirstByte = buffer.readUInt8();
        buffer.backtrack();
        if (macroActionFirstByte >= index_1.MacroActionId.KeyMacroAction && macroActionFirstByte <= index_1.MacroActionId.LastKeyMacroAction) {
            return new index_1.KeyMacroAction().fromBinary(buffer);
        }
        else if (macroActionFirstByte >= index_1.MacroActionId.MouseButtonMacroAction &&
            macroActionFirstByte <= index_1.MacroActionId.LastMouseButtonMacroAction) {
            return new index_1.MouseButtonMacroAction().fromBinary(buffer);
        }
        switch (macroActionFirstByte) {
            case index_1.MacroActionId.MoveMouseMacroAction:
                return new index_1.MoveMouseMacroAction().fromBinary(buffer);
            case index_1.MacroActionId.ScrollMouseMacroAction:
                return new index_1.ScrollMouseMacroAction().fromBinary(buffer);
            case index_1.MacroActionId.DelayMacroAction:
                return new index_1.DelayMacroAction().fromBinary(buffer);
            case index_1.MacroActionId.TextMacroAction:
                return new index_1.TextMacroAction().fromBinary(buffer);
            default:
                throw "Invalid MacroAction first byte: " + macroActionFirstByte;
        }
    };
    Helper.fromMacroAction = function (macroAction) {
        var newMacroAction;
        if (macroAction instanceof index_1.KeyMacroAction) {
            newMacroAction = new index_1.KeyMacroAction(macroAction);
        }
        else if (macroAction instanceof index_1.MouseButtonMacroAction) {
            newMacroAction = new index_1.MouseButtonMacroAction(macroAction);
        }
        else if (macroAction instanceof index_1.MoveMouseMacroAction) {
            newMacroAction = new index_1.MoveMouseMacroAction(macroAction);
        }
        else if (macroAction instanceof index_1.ScrollMouseMacroAction) {
            newMacroAction = new index_1.ScrollMouseMacroAction(macroAction);
        }
        else if (macroAction instanceof index_1.DelayMacroAction) {
            newMacroAction = new index_1.DelayMacroAction(macroAction);
        }
        else if (macroAction instanceof index_1.TextMacroAction) {
            newMacroAction = new index_1.TextMacroAction(macroAction);
        }
        return newMacroAction;
    };
    Helper.fromJSONObject = function (macroAction) {
        switch (macroAction.macroActionType) {
            case index_1.macroActionType.KeyMacroAction:
                return new index_1.KeyMacroAction().fromJsonObject(macroAction);
            case index_1.macroActionType.MouseButtonMacroAction:
                return new index_1.MouseButtonMacroAction().fromJsonObject(macroAction);
            case index_1.macroActionType.MoveMouseMacroAction:
                return new index_1.MoveMouseMacroAction().fromJsonObject(macroAction);
            case index_1.macroActionType.ScrollMouseMacroAction:
                return new index_1.ScrollMouseMacroAction().fromJsonObject(macroAction);
            case index_1.macroActionType.DelayMacroAction:
                return new index_1.DelayMacroAction().fromJsonObject(macroAction);
            case index_1.macroActionType.TextMacroAction:
                return new index_1.TextMacroAction().fromJsonObject(macroAction);
            default:
                throw "Invalid MacroAction.macroActionType: \"" + macroAction.macroActionType + "\"";
        }
    };
    return Helper;
}());
exports.Helper = Helper;


/***/ }),
/* 1102 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
var core_1 = __webpack_require__(0);
var CancelableDirective = (function () {
    function CancelableDirective(elementRef, renderer) {
        this.elementRef = elementRef;
        this.renderer = renderer;
    }
    CancelableDirective.prototype.onFocus = function () {
        this.originalValue = this.elementRef.nativeElement.value;
    };
    CancelableDirective.prototype.onEscape = function () {
        this.renderer.setElementProperty(this.elementRef.nativeElement, 'value', this.originalValue);
        this.renderer.invokeElementMethod(this.elementRef.nativeElement, 'blur');
    };
    return CancelableDirective;
}());
__decorate([
    core_1.HostListener('focus'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], CancelableDirective.prototype, "onFocus", null);
__decorate([
    core_1.HostListener('keyup.escape'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], CancelableDirective.prototype, "onEscape", null);
CancelableDirective = __decorate([
    core_1.Directive({
        selector: '[cancelable]'
    }),
    __metadata("design:paramtypes", [core_1.ElementRef, core_1.Renderer])
], CancelableDirective);
exports.CancelableDirective = CancelableDirective;


/***/ }),
/* 1103 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var cancelable_directive_1 = __webpack_require__(1102);
exports.CancelableDirective = cancelable_directive_1.CancelableDirective;


/***/ }),
/* 1104 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

function __export(m) {
    for (var p in m) if (!exports.hasOwnProperty(p)) exports[p] = m[p];
}
Object.defineProperty(exports, "__esModule", { value: true });
__export(__webpack_require__(1103));


/***/ }),
/* 1105 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var KeymapActions;
(function (KeymapActions) {
    KeymapActions.PREFIX = '[Keymap] ';
    KeymapActions.ADD = KeymapActions.PREFIX + 'Add keymap';
    KeymapActions.DUPLICATE = KeymapActions.PREFIX + 'Duplicate keymap';
    KeymapActions.EDIT_ABBR = KeymapActions.PREFIX + 'Edit keymap abbreviation';
    KeymapActions.EDIT_NAME = KeymapActions.PREFIX + 'Edit keymap title';
    KeymapActions.SAVE_KEY = KeymapActions.PREFIX + 'Save key action';
    KeymapActions.SET_DEFAULT = KeymapActions.PREFIX + 'Set default option';
    KeymapActions.REMOVE = KeymapActions.PREFIX + 'Remove keymap';
    KeymapActions.CHECK_MACRO = KeymapActions.PREFIX + 'Check deleted macro';
    function addKeymap(item) {
        return {
            type: KeymapActions.ADD,
            payload: item
        };
    }
    KeymapActions.addKeymap = addKeymap;
    function setDefault(abbr) {
        return {
            type: KeymapActions.SET_DEFAULT,
            payload: abbr
        };
    }
    KeymapActions.setDefault = setDefault;
    function removeKeymap(abbr) {
        return {
            type: KeymapActions.REMOVE,
            payload: abbr
        };
    }
    KeymapActions.removeKeymap = removeKeymap;
    function duplicateKeymap(keymap) {
        return {
            type: KeymapActions.DUPLICATE,
            payload: keymap
        };
    }
    KeymapActions.duplicateKeymap = duplicateKeymap;
    function editKeymapName(abbr, name) {
        return {
            type: KeymapActions.EDIT_NAME,
            payload: {
                abbr: abbr,
                name: name
            }
        };
    }
    KeymapActions.editKeymapName = editKeymapName;
    function editKeymapAbbr(abbr, newAbbr) {
        return {
            type: KeymapActions.EDIT_ABBR,
            payload: {
                abbr: abbr,
                newAbbr: newAbbr
            }
        };
    }
    KeymapActions.editKeymapAbbr = editKeymapAbbr;
    function saveKey(keymap, layer, module, key, keyAction) {
        return {
            type: KeymapActions.SAVE_KEY,
            payload: {
                keymap: keymap,
                layer: layer,
                module: module,
                key: key,
                keyAction: keyAction
            }
        };
    }
    KeymapActions.saveKey = saveKey;
    function checkMacro(macro) {
        return {
            type: KeymapActions.CHECK_MACRO,
            payload: macro
        };
    }
    KeymapActions.checkMacro = checkMacro;
})(KeymapActions = exports.KeymapActions || (exports.KeymapActions = {}));


/***/ }),
/* 1106 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var MacroActions;
(function (MacroActions) {
    MacroActions.PREFIX = '[Macro] ';
    MacroActions.DUPLICATE = MacroActions.PREFIX + 'Duplicate macro';
    MacroActions.EDIT_NAME = MacroActions.PREFIX + 'Edit macro title';
    MacroActions.REMOVE = MacroActions.PREFIX + 'Remove macro';
    MacroActions.ADD = MacroActions.PREFIX + 'Add macro';
    MacroActions.ADD_ACTION = MacroActions.PREFIX + 'Add macro action';
    MacroActions.SAVE_ACTION = MacroActions.PREFIX + 'Save macro action';
    MacroActions.DELETE_ACTION = MacroActions.PREFIX + 'Delete macro action';
    MacroActions.REORDER_ACTION = MacroActions.PREFIX + 'Reorder macro action';
    function addMacro() {
        return {
            type: MacroActions.ADD
        };
    }
    MacroActions.addMacro = addMacro;
    function removeMacro(macroId) {
        return {
            type: MacroActions.REMOVE,
            payload: macroId
        };
    }
    MacroActions.removeMacro = removeMacro;
    function duplicateMacro(macro) {
        return {
            type: MacroActions.DUPLICATE,
            payload: macro
        };
    }
    MacroActions.duplicateMacro = duplicateMacro;
    function editMacroName(id, name) {
        return {
            type: MacroActions.EDIT_NAME,
            payload: {
                id: id,
                name: name
            }
        };
    }
    MacroActions.editMacroName = editMacroName;
    function addMacroAction(id, action) {
        return {
            type: MacroActions.ADD_ACTION,
            payload: {
                id: id,
                action: action
            }
        };
    }
    MacroActions.addMacroAction = addMacroAction;
    function saveMacroAction(id, index, action) {
        return {
            type: MacroActions.SAVE_ACTION,
            payload: {
                id: id,
                index: index,
                action: action
            }
        };
    }
    MacroActions.saveMacroAction = saveMacroAction;
    function deleteMacroAction(id, index, action) {
        return {
            type: MacroActions.DELETE_ACTION,
            payload: {
                id: id,
                index: index,
                action: action
            }
        };
    }
    MacroActions.deleteMacroAction = deleteMacroAction;
    function reorderMacroAction(id, oldIndex, newIndex) {
        return {
            type: MacroActions.REORDER_ACTION,
            payload: {
                id: id,
                oldIndex: oldIndex,
                newIndex: newIndex
            }
        };
    }
    MacroActions.reorderMacroAction = reorderMacroAction;
})(MacroActions = exports.MacroActions || (exports.MacroActions = {}));


/***/ }),
/* 1107 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

function __export(m) {
    for (var p in m) if (!exports.hasOwnProperty(p)) exports[p] = m[p];
}
Object.defineProperty(exports, "__esModule", { value: true });
__export(__webpack_require__(1108));
__export(__webpack_require__(1109));


/***/ }),
/* 1108 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
var core_1 = __webpack_require__(0);
var router_1 = __webpack_require__(45);
var effects_1 = __webpack_require__(165);
var store_1 = __webpack_require__(9);
__webpack_require__(122);
__webpack_require__(65);
__webpack_require__(274);
var actions_1 = __webpack_require__(54);
var KeymapEffects = (function () {
    function KeymapEffects(actions$, router, store) {
        var _this = this;
        this.actions$ = actions$;
        this.router = router;
        this.store = store;
        this.addOrDuplicate$ = this.actions$
            .ofType(actions_1.KeymapActions.ADD, actions_1.KeymapActions.DUPLICATE)
            .withLatestFrom(this.store)
            .map(function (latest) { return latest[1].userConfiguration.keymaps; })
            .do(function (keymaps) {
            _this.router.navigate(['/keymap', keymaps[keymaps.length - 1].abbreviation]);
        });
        this.remove$ = this.actions$
            .ofType(actions_1.KeymapActions.REMOVE)
            .withLatestFrom(this.store)
            .map(function (latest) { return latest[1].userConfiguration.keymaps; })
            .do(function (keymaps) {
            if (keymaps.length === 0) {
                _this.router.navigate(['/keymap/add']);
            }
            else {
                var favourite = keymaps.find(function (keymap) { return keymap.isDefault; });
                _this.router.navigate(['/keymap', favourite.abbreviation]);
            }
        });
        this.editAbbr$ = this.actions$
            .ofType(actions_1.KeymapActions.EDIT_ABBR)
            .map(function (action) { return action.payload.newAbbr; })
            .do(function (newAbbr) {
            _this.router.navigate(['/keymap', newAbbr]);
        });
    }
    return KeymapEffects;
}());
__decorate([
    effects_1.Effect({ dispatch: false }),
    __metadata("design:type", Object)
], KeymapEffects.prototype, "addOrDuplicate$", void 0);
__decorate([
    effects_1.Effect({ dispatch: false }),
    __metadata("design:type", Object)
], KeymapEffects.prototype, "remove$", void 0);
__decorate([
    effects_1.Effect({ dispatch: false }),
    __metadata("design:type", Object)
], KeymapEffects.prototype, "editAbbr$", void 0);
KeymapEffects = __decorate([
    core_1.Injectable(),
    __metadata("design:paramtypes", [effects_1.Actions, router_1.Router, store_1.Store])
], KeymapEffects);
exports.KeymapEffects = KeymapEffects;


/***/ }),
/* 1109 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
var core_1 = __webpack_require__(0);
var router_1 = __webpack_require__(45);
var effects_1 = __webpack_require__(165);
var store_1 = __webpack_require__(9);
__webpack_require__(122);
__webpack_require__(65);
__webpack_require__(274);
var actions_1 = __webpack_require__(54);
var MacroEffects = (function () {
    function MacroEffects(actions$, router, store) {
        var _this = this;
        this.actions$ = actions$;
        this.router = router;
        this.store = store;
        this.remove$ = this.actions$
            .ofType(actions_1.MacroActions.REMOVE)
            .map(function (action) { return _this.store.dispatch(actions_1.KeymapActions.checkMacro(action.payload)); })
            .withLatestFrom(this.store)
            .map(function (latest) { return latest[1].userConfiguration.macros; })
            .do(function (macros) {
            if (macros.length === 0) {
                _this.router.navigate(['/macro']);
            }
            else {
                _this.router.navigate(['/macro', macros[0].id]);
            }
        });
        this.add$ = this.actions$
            .ofType(actions_1.MacroActions.ADD)
            .withLatestFrom(this.store)
            .map(function (latest) { return latest[1].userConfiguration.macros; })
            .map(function (macros) { return macros[macros.length - 1]; })
            .do(function (lastMacro) {
            _this.router.navigate(['/macro', lastMacro.id, 'new']);
        });
    }
    return MacroEffects;
}());
__decorate([
    effects_1.Effect({ dispatch: false }),
    __metadata("design:type", Object)
], MacroEffects.prototype, "remove$", void 0);
__decorate([
    effects_1.Effect({ dispatch: false }),
    __metadata("design:type", Object)
], MacroEffects.prototype, "add$", void 0);
MacroEffects = __decorate([
    core_1.Injectable(),
    __metadata("design:paramtypes", [effects_1.Actions, router_1.Router, store_1.Store])
], MacroEffects);
exports.MacroEffects = MacroEffects;


/***/ }),
/* 1110 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var user_configuration_1 = __webpack_require__(55);
exports.userConfigurationReducer = user_configuration_1.default;
exports.getUserConfiguration = user_configuration_1.getUserConfiguration;
var preset_1 = __webpack_require__(1111);
exports.presetReducer = preset_1.default;


/***/ }),
/* 1111 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var initialState = [];
function default_1(state) {
    if (state === void 0) { state = initialState; }
    return state;
}
exports.default = default_1;


/***/ }),
/* 1112 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var Electron = (function () {
    function Electron() {
    }
    Electron.prototype.getConfig = function () {
        // TODO implement load logic
        return;
    };
    /* tslint:disable:no-unused-variable */
    Electron.prototype.saveConfig = function (config) {
        // TODO implement save logic
    };
    return Electron;
}());
exports.Electron = Electron;


/***/ }),
/* 1113 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
var core_1 = __webpack_require__(0);
var Keymap_1 = __webpack_require__(80);
var UserConfiguration_1 = __webpack_require__(291);
var electron_1 = __webpack_require__(1112);
var local_1 = __webpack_require__(1114);
var DataStorage = (function () {
    function DataStorage() {
        this.initUHKJson();
        this.detectEnvironment();
    }
    DataStorage.prototype.initialState = function () {
        var config = this.getConfiguration();
        return {
            userConfiguration: config,
            presetKeymaps: this.uhkPresets
        };
    };
    DataStorage.prototype.detectEnvironment = function () {
        // Electron
        // TODO check if we can remove <any> when electron will be implemented (maybe use process.versions['electron'])
        if (typeof window !== 'undefined' && window.process && window.process.type === 'renderer') {
            this._environment = new electron_1.Electron();
        }
        else {
            this._environment = new local_1.Local(this.defaultUserConfiguration.dataModelVersion);
        }
    };
    // TODO: Add type for state
    DataStorage.prototype.saveState = function (reducer) {
        var _this = this;
        return function (state, action) {
            var nextState = reducer(state, action);
            _this._environment.saveConfig(nextState);
            return nextState;
        };
    };
    DataStorage.prototype.initUHKJson = function () {
        this.defaultUserConfiguration = new UserConfiguration_1.UserConfiguration()
            .fromJsonObject(__webpack_require__(720));
        this.uhkPresets = __webpack_require__(719)
            .map(function (keymap) { return new Keymap_1.Keymap().fromJsonObject(keymap); });
    };
    DataStorage.prototype.getConfiguration = function () {
        var config = this._environment.getConfig();
        if (!config) {
            config = this.defaultUserConfiguration;
        }
        return config;
    };
    return DataStorage;
}());
DataStorage = __decorate([
    core_1.Injectable(),
    __metadata("design:paramtypes", [])
], DataStorage);
exports.DataStorage = DataStorage;


/***/ }),
/* 1114 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var UserConfiguration_1 = __webpack_require__(291);
var Local = (function () {
    function Local(dataModelVersion) {
        this.dataModelVersion = dataModelVersion;
    }
    Local.prototype.getConfig = function () {
        var configJsonString = localStorage.getItem('config');
        var config;
        if (configJsonString) {
            var configJsonObject = JSON.parse(configJsonString);
            if (configJsonObject.dataModelVersion === this.dataModelVersion) {
                config = new UserConfiguration_1.UserConfiguration().fromJsonObject(configJsonObject);
            }
        }
        return config;
    };
    Local.prototype.saveConfig = function (config) {
        localStorage.setItem('config', JSON.stringify(config.toJsonObject()));
    };
    return Local;
}());
exports.Local = Local;


/***/ }),
/* 1115 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
// Source: http://stackoverflow.com/questions/13720256/javascript-regex-camelcase-to-sentence
function camelCaseToSentence(camelCasedText) {
    return camelCasedText.replace(/^[a-z]|[A-Z]/g, function (v, i) {
        return i === 0 ? v.toUpperCase() : ' ' + v.toLowerCase();
    });
}
exports.camelCaseToSentence = camelCaseToSentence;
function capitalizeFirstLetter(text) {
    return text.charAt(0).toUpperCase() + text.slice(1);
}
exports.capitalizeFirstLetter = capitalizeFirstLetter;


/***/ }),
/* 1116 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

function __export(m) {
    for (var p in m) if (!exports.hasOwnProperty(p)) exports[p] = m[p];
}
Object.defineProperty(exports, "__esModule", { value: true });
__export(__webpack_require__(1117));


/***/ }),
/* 1117 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var keymap_add_component_1 = __webpack_require__(445);
var edit_1 = __webpack_require__(446);
exports.keymapRoutes = [
    {
        path: '',
        redirectTo: '/keymap',
        pathMatch: 'full'
    },
    {
        path: 'keymap',
        component: edit_1.KeymapEditComponent,
        canActivate: [edit_1.KeymapEditGuard]
    },
    {
        path: 'keymap/add',
        component: keymap_add_component_1.KeymapAddComponent
    },
    {
        path: 'keymap/:abbr',
        component: edit_1.KeymapEditComponent
    }
];


/***/ }),
/* 1118 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

function __export(m) {
    for (var p in m) if (!exports.hasOwnProperty(p)) exports[p] = m[p];
}
Object.defineProperty(exports, "__esModule", { value: true });
__export(__webpack_require__(1119));
__export(__webpack_require__(1120));


/***/ }),
/* 1119 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
var core_1 = __webpack_require__(0);
var MainAppComponent = (function () {
    function MainAppComponent() {
    }
    return MainAppComponent;
}());
MainAppComponent = __decorate([
    core_1.Component({
        selector: 'main-app',
        template: __webpack_require__(714),
        styles: [
            __webpack_require__(754),
            __webpack_require__(755)
        ],
        encapsulation: core_1.ViewEncapsulation.None
    })
], MainAppComponent);
exports.MainAppComponent = MainAppComponent;


/***/ }),
/* 1120 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var router_1 = __webpack_require__(45);
var add_on_1 = __webpack_require__(444);
var keymap_1 = __webpack_require__(1116);
var macro_1 = __webpack_require__(288);
var settings_1 = __webpack_require__(450);
var appRoutes = keymap_1.keymapRoutes.concat(macro_1.macroRoutes, add_on_1.addOnRoutes, settings_1.settingsRoutes);
exports.appRoutingProviders = [];
exports.routing = router_1.RouterModule.forRoot(appRoutes, { useHash: true });


/***/ }),
/* 1121 */
/***/ (function(module, exports, __webpack_require__) {

/* WEBPACK VAR INJECTION */(function(global) {
/**
 * Module exports.
 */

module.exports = deprecate;

/**
 * Mark that a method should not be used.
 * Returns a modified function which warns once by default.
 *
 * If `localStorage.noDeprecation = true` is set, then it is a no-op.
 *
 * If `localStorage.throwDeprecation = true` is set, then deprecated functions
 * will throw an Error when invoked.
 *
 * If `localStorage.traceDeprecation = true` is set, then deprecated functions
 * will invoke `console.trace()` instead of `console.error()`.
 *
 * @param {Function} fn - the function to deprecate
 * @param {String} msg - the string to print to the console when `fn` is invoked
 * @returns {Function} a new "deprecated" version of `fn`
 * @api public
 */

function deprecate (fn, msg) {
  if (config('noDeprecation')) {
    return fn;
  }

  var warned = false;
  function deprecated() {
    if (!warned) {
      if (config('throwDeprecation')) {
        throw new Error(msg);
      } else if (config('traceDeprecation')) {
        console.trace(msg);
      } else {
        console.warn(msg);
      }
      warned = true;
    }
    return fn.apply(this, arguments);
  }

  return deprecated;
}

/**
 * Checks `localStorage` for boolean values for the given `name`.
 *
 * @param {String} name
 * @returns {Boolean}
 * @api private
 */

function config (name) {
  // accessing global.localStorage can trigger a DOMException in sandboxed iframes
  try {
    if (!global.localStorage) return false;
  } catch (_) {
    return false;
  }
  var val = global.localStorage[name];
  if (null == val) return false;
  return String(val).toLowerCase() === 'true';
}

/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(15)))

/***/ }),
/* 1122 */
/***/ (function(module, exports) {

if (typeof Object.create === 'function') {
  // implementation from standard node.js 'util' module
  module.exports = function inherits(ctor, superCtor) {
    ctor.super_ = superCtor
    ctor.prototype = Object.create(superCtor.prototype, {
      constructor: {
        value: ctor,
        enumerable: false,
        writable: true,
        configurable: true
      }
    });
  };
} else {
  // old school shim for old browsers
  module.exports = function inherits(ctor, superCtor) {
    ctor.super_ = superCtor
    var TempCtor = function () {}
    TempCtor.prototype = superCtor.prototype
    ctor.prototype = new TempCtor()
    ctor.prototype.constructor = ctor
  }
}


/***/ }),
/* 1123 */
/***/ (function(module, exports) {

module.exports = function isBuffer(arg) {
  return arg && typeof arg === 'object'
    && typeof arg.copy === 'function'
    && typeof arg.fill === 'function'
    && typeof arg.readUInt8 === 'function';
}

/***/ }),
/* 1124 */
/***/ (function(module, exports, __webpack_require__) {

/* WEBPACK VAR INJECTION */(function(global, process) {// Copyright Joyent, Inc. and other Node contributors.
//
// Permission is hereby granted, free of charge, to any person obtaining a
// copy of this software and associated documentation files (the
// "Software"), to deal in the Software without restriction, including
// without limitation the rights to use, copy, modify, merge, publish,
// distribute, sublicense, and/or sell copies of the Software, and to permit
// persons to whom the Software is furnished to do so, subject to the
// following conditions:
//
// The above copyright notice and this permission notice shall be included
// in all copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS
// OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
// MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN
// NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM,
// DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR
// OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE
// USE OR OTHER DEALINGS IN THE SOFTWARE.

var formatRegExp = /%[sdj%]/g;
exports.format = function(f) {
  if (!isString(f)) {
    var objects = [];
    for (var i = 0; i < arguments.length; i++) {
      objects.push(inspect(arguments[i]));
    }
    return objects.join(' ');
  }

  var i = 1;
  var args = arguments;
  var len = args.length;
  var str = String(f).replace(formatRegExp, function(x) {
    if (x === '%%') return '%';
    if (i >= len) return x;
    switch (x) {
      case '%s': return String(args[i++]);
      case '%d': return Number(args[i++]);
      case '%j':
        try {
          return JSON.stringify(args[i++]);
        } catch (_) {
          return '[Circular]';
        }
      default:
        return x;
    }
  });
  for (var x = args[i]; i < len; x = args[++i]) {
    if (isNull(x) || !isObject(x)) {
      str += ' ' + x;
    } else {
      str += ' ' + inspect(x);
    }
  }
  return str;
};


// Mark that a method should not be used.
// Returns a modified function which warns once by default.
// If --no-deprecation is set, then it is a no-op.
exports.deprecate = function(fn, msg) {
  // Allow for deprecating things in the process of starting up.
  if (isUndefined(global.process)) {
    return function() {
      return exports.deprecate(fn, msg).apply(this, arguments);
    };
  }

  if (process.noDeprecation === true) {
    return fn;
  }

  var warned = false;
  function deprecated() {
    if (!warned) {
      if (process.throwDeprecation) {
        throw new Error(msg);
      } else if (process.traceDeprecation) {
        console.trace(msg);
      } else {
        console.error(msg);
      }
      warned = true;
    }
    return fn.apply(this, arguments);
  }

  return deprecated;
};


var debugs = {};
var debugEnviron;
exports.debuglog = function(set) {
  if (isUndefined(debugEnviron))
    debugEnviron = process.env.NODE_DEBUG || '';
  set = set.toUpperCase();
  if (!debugs[set]) {
    if (new RegExp('\\b' + set + '\\b', 'i').test(debugEnviron)) {
      var pid = process.pid;
      debugs[set] = function() {
        var msg = exports.format.apply(exports, arguments);
        console.error('%s %d: %s', set, pid, msg);
      };
    } else {
      debugs[set] = function() {};
    }
  }
  return debugs[set];
};


/**
 * Echos the value of a value. Trys to print the value out
 * in the best way possible given the different types.
 *
 * @param {Object} obj The object to print out.
 * @param {Object} opts Optional options object that alters the output.
 */
/* legacy: obj, showHidden, depth, colors*/
function inspect(obj, opts) {
  // default options
  var ctx = {
    seen: [],
    stylize: stylizeNoColor
  };
  // legacy...
  if (arguments.length >= 3) ctx.depth = arguments[2];
  if (arguments.length >= 4) ctx.colors = arguments[3];
  if (isBoolean(opts)) {
    // legacy...
    ctx.showHidden = opts;
  } else if (opts) {
    // got an "options" object
    exports._extend(ctx, opts);
  }
  // set default options
  if (isUndefined(ctx.showHidden)) ctx.showHidden = false;
  if (isUndefined(ctx.depth)) ctx.depth = 2;
  if (isUndefined(ctx.colors)) ctx.colors = false;
  if (isUndefined(ctx.customInspect)) ctx.customInspect = true;
  if (ctx.colors) ctx.stylize = stylizeWithColor;
  return formatValue(ctx, obj, ctx.depth);
}
exports.inspect = inspect;


// http://en.wikipedia.org/wiki/ANSI_escape_code#graphics
inspect.colors = {
  'bold' : [1, 22],
  'italic' : [3, 23],
  'underline' : [4, 24],
  'inverse' : [7, 27],
  'white' : [37, 39],
  'grey' : [90, 39],
  'black' : [30, 39],
  'blue' : [34, 39],
  'cyan' : [36, 39],
  'green' : [32, 39],
  'magenta' : [35, 39],
  'red' : [31, 39],
  'yellow' : [33, 39]
};

// Don't use 'blue' not visible on cmd.exe
inspect.styles = {
  'special': 'cyan',
  'number': 'yellow',
  'boolean': 'yellow',
  'undefined': 'grey',
  'null': 'bold',
  'string': 'green',
  'date': 'magenta',
  // "name": intentionally not styling
  'regexp': 'red'
};


function stylizeWithColor(str, styleType) {
  var style = inspect.styles[styleType];

  if (style) {
    return '\u001b[' + inspect.colors[style][0] + 'm' + str +
           '\u001b[' + inspect.colors[style][1] + 'm';
  } else {
    return str;
  }
}


function stylizeNoColor(str, styleType) {
  return str;
}


function arrayToHash(array) {
  var hash = {};

  array.forEach(function(val, idx) {
    hash[val] = true;
  });

  return hash;
}


function formatValue(ctx, value, recurseTimes) {
  // Provide a hook for user-specified inspect functions.
  // Check that value is an object with an inspect function on it
  if (ctx.customInspect &&
      value &&
      isFunction(value.inspect) &&
      // Filter out the util module, it's inspect function is special
      value.inspect !== exports.inspect &&
      // Also filter out any prototype objects using the circular check.
      !(value.constructor && value.constructor.prototype === value)) {
    var ret = value.inspect(recurseTimes, ctx);
    if (!isString(ret)) {
      ret = formatValue(ctx, ret, recurseTimes);
    }
    return ret;
  }

  // Primitive types cannot have properties
  var primitive = formatPrimitive(ctx, value);
  if (primitive) {
    return primitive;
  }

  // Look up the keys of the object.
  var keys = Object.keys(value);
  var visibleKeys = arrayToHash(keys);

  if (ctx.showHidden) {
    keys = Object.getOwnPropertyNames(value);
  }

  // IE doesn't make error fields non-enumerable
  // http://msdn.microsoft.com/en-us/library/ie/dww52sbt(v=vs.94).aspx
  if (isError(value)
      && (keys.indexOf('message') >= 0 || keys.indexOf('description') >= 0)) {
    return formatError(value);
  }

  // Some type of object without properties can be shortcutted.
  if (keys.length === 0) {
    if (isFunction(value)) {
      var name = value.name ? ': ' + value.name : '';
      return ctx.stylize('[Function' + name + ']', 'special');
    }
    if (isRegExp(value)) {
      return ctx.stylize(RegExp.prototype.toString.call(value), 'regexp');
    }
    if (isDate(value)) {
      return ctx.stylize(Date.prototype.toString.call(value), 'date');
    }
    if (isError(value)) {
      return formatError(value);
    }
  }

  var base = '', array = false, braces = ['{', '}'];

  // Make Array say that they are Array
  if (isArray(value)) {
    array = true;
    braces = ['[', ']'];
  }

  // Make functions say that they are functions
  if (isFunction(value)) {
    var n = value.name ? ': ' + value.name : '';
    base = ' [Function' + n + ']';
  }

  // Make RegExps say that they are RegExps
  if (isRegExp(value)) {
    base = ' ' + RegExp.prototype.toString.call(value);
  }

  // Make dates with properties first say the date
  if (isDate(value)) {
    base = ' ' + Date.prototype.toUTCString.call(value);
  }

  // Make error with message first say the error
  if (isError(value)) {
    base = ' ' + formatError(value);
  }

  if (keys.length === 0 && (!array || value.length == 0)) {
    return braces[0] + base + braces[1];
  }

  if (recurseTimes < 0) {
    if (isRegExp(value)) {
      return ctx.stylize(RegExp.prototype.toString.call(value), 'regexp');
    } else {
      return ctx.stylize('[Object]', 'special');
    }
  }

  ctx.seen.push(value);

  var output;
  if (array) {
    output = formatArray(ctx, value, recurseTimes, visibleKeys, keys);
  } else {
    output = keys.map(function(key) {
      return formatProperty(ctx, value, recurseTimes, visibleKeys, key, array);
    });
  }

  ctx.seen.pop();

  return reduceToSingleString(output, base, braces);
}


function formatPrimitive(ctx, value) {
  if (isUndefined(value))
    return ctx.stylize('undefined', 'undefined');
  if (isString(value)) {
    var simple = '\'' + JSON.stringify(value).replace(/^"|"$/g, '')
                                             .replace(/'/g, "\\'")
                                             .replace(/\\"/g, '"') + '\'';
    return ctx.stylize(simple, 'string');
  }
  if (isNumber(value))
    return ctx.stylize('' + value, 'number');
  if (isBoolean(value))
    return ctx.stylize('' + value, 'boolean');
  // For some reason typeof null is "object", so special case here.
  if (isNull(value))
    return ctx.stylize('null', 'null');
}


function formatError(value) {
  return '[' + Error.prototype.toString.call(value) + ']';
}


function formatArray(ctx, value, recurseTimes, visibleKeys, keys) {
  var output = [];
  for (var i = 0, l = value.length; i < l; ++i) {
    if (hasOwnProperty(value, String(i))) {
      output.push(formatProperty(ctx, value, recurseTimes, visibleKeys,
          String(i), true));
    } else {
      output.push('');
    }
  }
  keys.forEach(function(key) {
    if (!key.match(/^\d+$/)) {
      output.push(formatProperty(ctx, value, recurseTimes, visibleKeys,
          key, true));
    }
  });
  return output;
}


function formatProperty(ctx, value, recurseTimes, visibleKeys, key, array) {
  var name, str, desc;
  desc = Object.getOwnPropertyDescriptor(value, key) || { value: value[key] };
  if (desc.get) {
    if (desc.set) {
      str = ctx.stylize('[Getter/Setter]', 'special');
    } else {
      str = ctx.stylize('[Getter]', 'special');
    }
  } else {
    if (desc.set) {
      str = ctx.stylize('[Setter]', 'special');
    }
  }
  if (!hasOwnProperty(visibleKeys, key)) {
    name = '[' + key + ']';
  }
  if (!str) {
    if (ctx.seen.indexOf(desc.value) < 0) {
      if (isNull(recurseTimes)) {
        str = formatValue(ctx, desc.value, null);
      } else {
        str = formatValue(ctx, desc.value, recurseTimes - 1);
      }
      if (str.indexOf('\n') > -1) {
        if (array) {
          str = str.split('\n').map(function(line) {
            return '  ' + line;
          }).join('\n').substr(2);
        } else {
          str = '\n' + str.split('\n').map(function(line) {
            return '   ' + line;
          }).join('\n');
        }
      }
    } else {
      str = ctx.stylize('[Circular]', 'special');
    }
  }
  if (isUndefined(name)) {
    if (array && key.match(/^\d+$/)) {
      return str;
    }
    name = JSON.stringify('' + key);
    if (name.match(/^"([a-zA-Z_][a-zA-Z_0-9]*)"$/)) {
      name = name.substr(1, name.length - 2);
      name = ctx.stylize(name, 'name');
    } else {
      name = name.replace(/'/g, "\\'")
                 .replace(/\\"/g, '"')
                 .replace(/(^"|"$)/g, "'");
      name = ctx.stylize(name, 'string');
    }
  }

  return name + ': ' + str;
}


function reduceToSingleString(output, base, braces) {
  var numLinesEst = 0;
  var length = output.reduce(function(prev, cur) {
    numLinesEst++;
    if (cur.indexOf('\n') >= 0) numLinesEst++;
    return prev + cur.replace(/\u001b\[\d\d?m/g, '').length + 1;
  }, 0);

  if (length > 60) {
    return braces[0] +
           (base === '' ? '' : base + '\n ') +
           ' ' +
           output.join(',\n  ') +
           ' ' +
           braces[1];
  }

  return braces[0] + base + ' ' + output.join(', ') + ' ' + braces[1];
}


// NOTE: These type checking functions intentionally don't use `instanceof`
// because it is fragile and can be easily faked with `Object.create()`.
function isArray(ar) {
  return Array.isArray(ar);
}
exports.isArray = isArray;

function isBoolean(arg) {
  return typeof arg === 'boolean';
}
exports.isBoolean = isBoolean;

function isNull(arg) {
  return arg === null;
}
exports.isNull = isNull;

function isNullOrUndefined(arg) {
  return arg == null;
}
exports.isNullOrUndefined = isNullOrUndefined;

function isNumber(arg) {
  return typeof arg === 'number';
}
exports.isNumber = isNumber;

function isString(arg) {
  return typeof arg === 'string';
}
exports.isString = isString;

function isSymbol(arg) {
  return typeof arg === 'symbol';
}
exports.isSymbol = isSymbol;

function isUndefined(arg) {
  return arg === void 0;
}
exports.isUndefined = isUndefined;

function isRegExp(re) {
  return isObject(re) && objectToString(re) === '[object RegExp]';
}
exports.isRegExp = isRegExp;

function isObject(arg) {
  return typeof arg === 'object' && arg !== null;
}
exports.isObject = isObject;

function isDate(d) {
  return isObject(d) && objectToString(d) === '[object Date]';
}
exports.isDate = isDate;

function isError(e) {
  return isObject(e) &&
      (objectToString(e) === '[object Error]' || e instanceof Error);
}
exports.isError = isError;

function isFunction(arg) {
  return typeof arg === 'function';
}
exports.isFunction = isFunction;

function isPrimitive(arg) {
  return arg === null ||
         typeof arg === 'boolean' ||
         typeof arg === 'number' ||
         typeof arg === 'string' ||
         typeof arg === 'symbol' ||  // ES6 symbol
         typeof arg === 'undefined';
}
exports.isPrimitive = isPrimitive;

exports.isBuffer = __webpack_require__(1123);

function objectToString(o) {
  return Object.prototype.toString.call(o);
}


function pad(n) {
  return n < 10 ? '0' + n.toString(10) : n.toString(10);
}


var months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep',
              'Oct', 'Nov', 'Dec'];

// 26 Feb 16:19:34
function timestamp() {
  var d = new Date();
  var time = [pad(d.getHours()),
              pad(d.getMinutes()),
              pad(d.getSeconds())].join(':');
  return [d.getDate(), months[d.getMonth()], time].join(' ');
}


// log is just a thin wrapper to console.log that prepends a timestamp
exports.log = function() {
  console.log('%s - %s', timestamp(), exports.format.apply(exports, arguments));
};


/**
 * Inherit the prototype methods from one constructor into another.
 *
 * The Function.prototype.inherits from lang.js rewritten as a standalone
 * function (not on Function.prototype). NOTE: If this file is to be loaded
 * during bootstrapping this function needs to be rewritten using some native
 * functions as prototype setup using normal JavaScript does not work as
 * expected during bootstrapping (see mirror.js in r114903).
 *
 * @param {function} ctor Constructor function which needs to inherit the
 *     prototype.
 * @param {function} superCtor Constructor function to inherit prototype from.
 */
exports.inherits = __webpack_require__(1122);

exports._extend = function(origin, add) {
  // Don't do anything if add isn't an object
  if (!add || !isObject(add)) return origin;

  var keys = Object.keys(add);
  var i = keys.length;
  while (i--) {
    origin[keys[i]] = add[keys[i]];
  }
  return origin;
};

function hasOwnProperty(obj, prop) {
  return Object.prototype.hasOwnProperty.call(obj, prop);
}

/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(15), __webpack_require__(32)))

/***/ }),
/* 1125 */
/***/ (function(module, exports) {

module.exports = function() {
	throw new Error("define cannot be used indirect");
};


/***/ }),
/* 1126 */
/***/ (function(module, exports) {

module.exports = {"svg":{"$":{"xmlns:dc":"http://purl.org/dc/elements/1.1/","xmlns:cc":"http://creativecommons.org/ns#","xmlns:rdf":"http://www.w3.org/1999/02/22-rdf-syntax-ns#","xmlns:svg":"http://www.w3.org/2000/svg","xmlns":"http://www.w3.org/2000/svg","xmlns:sodipodi":"http://sodipodi.sourceforge.net/DTD/sodipodi-0.dtd","xmlns:inkscape":"http://www.inkscape.org/namespaces/inkscape","version":"1.1","width":"1024.3346","height":"471.36612","viewBox":"0 0 1024.3346 471.36612","style":"overflow:visible;","id":"SvgjsSvg1006","inkscape:version":"0.91 r","sodipodi:docname":"base-layer.svg"},"metadata":[{"$":{"id":"metadata230"},"rdf:RDF":[{"cc:Work":[{"$":{"rdf:about":""},"dc:format":["image/svg+xml"],"dc:type":[{"$":{"rdf:resource":"http://purl.org/dc/dcmitype/StillImage"}}]}]}]}],"defs":[{"$":{"id":"defs228"}}],"sodipodi:namedview":[{"$":{"pagecolor":"#ffffff","bordercolor":"#666666","borderopacity":"1","objecttolerance":"10","gridtolerance":"10","guidetolerance":"10","inkscape:pageopacity":"0","inkscape:pageshadow":"2","inkscape:window-width":"1920","inkscape:window-height":"1028","id":"namedview226","showgrid":"false","inkscape:zoom":"1.046533","inkscape:cx":"461.77814","inkscape:cy":"312.8806","inkscape:window-x":"0","inkscape:window-y":"25","inkscape:window-maximized":"1","inkscape:current-layer":"left-parts"}}],"text":[{"$":{"x":"495.03632","y":"20","style":"font-size:34px;fill:#000000;font-family:Sans;text-align:center;text-anchor:middle;display:none;","font-family":"Helvetica, Arial, sans-serif","id":"layer-text"},"tspan":[{"_":"\r\n            Base layer\r\n        ","$":{"x":"495.03632","dy":"20.8","id":"SvgjsTspan1235"}}]}],"g":[{"$":{"transform":"translate(0 -580.99607)","style":"stroke:none;","id":"root","fill":"#333333"},"g":[{"$":{"transform":"translate(221.57008 1101.7666)","id":"left-parts"},"path":[{"$":{"d":"m 272.81516,-456.8166 -110.96971,0 c -0.32924,0 -0.65827,-0.0468 -0.97472,-0.1386 -0.31645,-0.0918 -0.62027,-0.22866 -0.89995,-0.40551 -0.27968,-0.17684 -0.53514,-0.39367 -0.7565,-0.64244 -0.22135,-0.24877 -0.40854,-0.52944 -0.55411,-0.83133 -0.14558,-0.3019 -0.24947,-0.62497 -0.30744,-0.95668 -3.11169,-17.80554 -6.22337,-35.61107 -9.33505,-53.41661 -0.16174,-0.9255 -0.46824,-1.8252 -0.90498,-2.65546 -0.43675,-0.83027 -1.00365,-1.59085 -1.67347,-2.24448 -0.66982,-0.65363 -1.44238,-1.20007 -2.2801,-1.61231 -0.83772,-0.41224 -1.74031,-0.69012 -2.66354,-0.81983 -0.92322,-0.12971 -1.86673,-0.11121 -2.78423,0.0544 l -352.97851,63.7382 c -0.81059,0.14636 -1.60096,0.40708 -2.34074,0.77257 -0.73979,0.3655 -1.42881,0.83571 -2.04035,1.39272 -0.61154,0.55702 -1.14547,1.20071 -1.58116,1.90622 -0.43571,0.70551 -0.77307,1.47267 -0.99931,2.2718 -0.22626,0.79913 -0.34137,1.63006 -0.34137,2.4609 l 0,389.594539 c 0,0.936363 0.14626,1.872858 0.43247,2.764016 0.2862,0.891158 0.7123,1.736655 1.25787,2.494964 0.54557,0.75831 1.21044,1.429141 1.96201,1.979608 0.75157,0.550465 1.58955,0.980376 2.47279,1.269152 0.88324,0.288776 1.8114,0.436358 2.73944,0.436358 l 342.7307,-1.4e-5 c 1.77165,0 3.54314,-1.7716 3.54314,-3.5432 0,-12.931979 0,-22.981768 0,-34.5827 0,-1.7717 -1.77149,-3.545 -3.54314,-3.545 l -322.73675,0.0013 c -2.79101,0 -5.3291,-2.56086 -5.3291,-5.376898 l 0,-329.455425 c 0,-2.81604 2.53809,-5.3769 5.3291,-5.3769 l 463.75521,0 c 0.93041,0 1.77697,-0.85444 1.77697,-1.79353 0,-7.80504 0,-14.68214 0,-21.94355 0,-0.94218 -0.84656,-1.79632 -1.77697,-1.79632","id":"left-case"}}],"rect":[{"$":{"rx":"3.5433071","ry":"3.5433071","x":"-194.89622","y":"-427.82285","height":"63.779526","width":"63.779526","id":"key-0"}},{"$":{"rx":"3.5433071","ry":"3.5433071","x":"-127.57339","y":"-427.82285","height":"63.779526","width":"63.779526","id":"key-1"}},{"$":{"rx":"3.5433071","ry":"3.5433071","x":"-60.250557","y":"-427.82285","height":"63.779526","width":"63.779526","id":"key-2"}},{"$":{"rx":"3.5433071","ry":"3.5433071","x":"7.072278","y":"-427.82285","height":"63.779526","width":"63.779526","id":"key-3"}},{"$":{"rx":"3.5433071","ry":"3.5433071","x":"74.395111","y":"-427.82285","height":"63.779526","width":"63.779526","id":"key-4"}},{"$":{"rx":"3.5433071","ry":"3.5433071","x":"141.71794","y":"-427.82285","height":"63.779526","width":"63.779526","id":"key-5"}},{"$":{"rx":"3.5433071","ry":"3.5433071","x":"209.04079","y":"-427.82285","height":"63.779526","width":"63.779526","id":"key-6"}},{"$":{"rx":"3.5433071","ry":"3.5433071","x":"-194.89622","y":"-360.50003","height":"63.779526","width":"95.669289","id":"key-7"}},{"$":{"rx":"3.5433071","ry":"3.5433071","x":"-95.683624","y":"-360.50003","height":"63.779526","width":"63.779526","id":"key-8"}},{"$":{"rx":"3.5433071","ry":"3.5433071","x":"-28.360792","y":"-360.50003","height":"63.779526","width":"63.779526","id":"key-9"}},{"$":{"rx":"3.5433071","ry":"3.5433071","x":"38.962044","y":"-360.50003","height":"63.779526","width":"63.779526","id":"key-10"}},{"$":{"rx":"3.5433071","ry":"3.5433071","x":"106.28487","y":"-360.50003","height":"63.779526","width":"63.779526","id":"key-11"}},{"$":{"rx":"3.5433071","ry":"3.5433071","x":"173.60771","y":"-360.50003","height":"63.779526","width":"63.779526","id":"key-12"}},{"$":{"rx":"3.5433071","ry":"3.5433071","x":"-194.89622","y":"-293.17719","height":"63.779526","width":"111.61417","id":"key-13"}},{"$":{"rx":"3.5433071","ry":"3.5433071","x":"-79.419846","y":"-293.17719","height":"63.779526","width":"63.779526","id":"key-14"}},{"$":{"rx":"3.5433071","ry":"3.5433071","x":"-11.778116","y":"-293.17719","height":"63.779526","width":"63.779526","id":"key-15"}},{"$":{"rx":"3.5433071","ry":"3.5433071","x":"55.863617","y":"-293.17719","height":"63.779526","width":"63.779526","id":"key-16"}},{"$":{"rx":"3.5433071","ry":"3.5433071","x":"123.50535","y":"-293.17719","height":"63.779526","width":"63.779526","id":"key-17"}},{"$":{"rx":"3.5433071","ry":"3.5433071","x":"191.14708","y":"-293.17719","height":"63.779526","width":"63.779526","id":"key-18"}},{"$":{"rx":"3.5433071","ry":"3.5433071","x":"-194.89622","y":"-225.85435","height":"63.779526","width":"143.50394","id":"key-19"}},{"$":{"rx":"3.5433071","ry":"3.5433071","x":"-47.14032","y":"-225.85435","height":"63.779526","width":"63.779526","id":"key-20"}},{"$":{"rx":"3.5433071","ry":"3.5433071","x":"20.891174","y":"-225.85435","height":"63.779526","width":"63.779526","id":"key-21"}},{"$":{"rx":"3.5433071","ry":"3.5433071","x":"88.922668","y":"-225.85435","height":"63.779526","width":"63.779526","id":"key-22"}},{"$":{"rx":"3.5433071","ry":"3.5433071","x":"156.95416","y":"-225.85435","height":"63.779526","width":"63.779526","id":"key-23"}},{"$":{"rx":"3.5433071","ry":"3.5433071","x":"224.98566","y":"-225.85435","height":"63.779526","width":"63.779526","id":"key-24"}},{"$":{"rx":"3.5433071","ry":"3.5433071","x":"-194.89622","y":"-158.53151","height":"63.779526","width":"79.724411","id":"key-25"}},{"$":{"rx":"3.5433071","ry":"3.5433071","x":"-111.98284","y":"-158.53151","height":"63.779526","width":"79.724411","id":"key-26"}},{"$":{"rx":"3.5433071","ry":"3.5433071","x":"-29.069458","y":"-158.53151","height":"63.779526","width":"79.724411","id":"key-27"}},{"$":{"rx":"3.5433071","ry":"3.5433071","x":"53.843929","y":"-158.53151","height":"63.779526","width":"79.724411","id":"key-28"}},{"$":{"rx":"3.5433071","ry":"3.5433071","x":"137.11165","y":"-158.53151","height":"63.779526","width":"131.10236","id":"key-29"}},{"$":{"rx":"3.4856062","ry":"3.5433071","x":"137.11165","y":"-91.071709","height":"41.667309","width":"131.10236","id":"key-30"}}],"text":[{"$":{"y":"-435.0346495","x":"-163.006457","font-size":"19","id":"SvgjsText1084","text-anchor":"middle","font-family":"Helvetica","fill":"#ffffff"},"tspan":[{"_":"~","$":{"x":"-163.006457","dy":"30.400000000000002","id":"SvgjsTspan1085"}},{"_":"`","$":{"x":"-163.006457","dy":"30.400000000000002","id":"SvgjsTspan1086"}}]},{"$":{"y":"-435.0346495","x":"-95.683627","font-size":"19","id":"SvgjsText1087","text-anchor":"middle","font-family":"Helvetica","fill":"#ffffff"},"tspan":[{"_":"!","$":{"x":"-95.683627","dy":"30.400000000000002","id":"SvgjsTspan1088"}},{"_":"1","$":{"x":"-95.683627","dy":"30.400000000000002","id":"SvgjsTspan1089"}}]},{"$":{"y":"-435.0346495","x":"-28.360794000000002","font-size":"19","id":"SvgjsText1090","text-anchor":"middle","font-family":"Helvetica","fill":"#ffffff"},"tspan":[{"_":"@","$":{"x":"-28.360794000000002","dy":"30.400000000000002","id":"SvgjsTspan1091"}},{"_":"2","$":{"x":"-28.360794000000002","dy":"30.400000000000002","id":"SvgjsTspan1092"}}]},{"$":{"y":"-435.0346495","x":"38.962041","font-size":"19","id":"SvgjsText1093","text-anchor":"middle","font-family":"Helvetica","fill":"#ffffff"},"tspan":[{"_":"#","$":{"x":"38.962041","dy":"30.400000000000002","id":"SvgjsTspan1094"}},{"_":"3","$":{"x":"38.962041","dy":"30.400000000000002","id":"SvgjsTspan1095"}}]},{"$":{"y":"-435.0346495","x":"106.284874","font-size":"19","id":"SvgjsText1096","text-anchor":"middle","font-family":"Helvetica","fill":"#ffffff"},"tspan":[{"_":"$","$":{"x":"106.284874","dy":"30.400000000000002","id":"SvgjsTspan1097"}},{"_":"4","$":{"x":"106.284874","dy":"30.400000000000002","id":"SvgjsTspan1098"}}]},{"$":{"y":"-435.0346495","x":"173.607703","font-size":"19","id":"SvgjsText1099","text-anchor":"middle","font-family":"Helvetica","fill":"#ffffff"},"tspan":[{"_":"%","$":{"x":"173.607703","dy":"30.400000000000002","id":"SvgjsTspan1100"}},{"_":"5","$":{"x":"173.607703","dy":"30.400000000000002","id":"SvgjsTspan1101"}}]},{"$":{"y":"-435.0346495","x":"240.93055299999997","font-size":"19","id":"SvgjsText1102","text-anchor":"middle","font-family":"Helvetica","fill":"#ffffff"},"tspan":[{"_":"^","$":{"x":"240.93055299999997","dy":"30.400000000000002","id":"SvgjsTspan1103"}},{"_":"6","$":{"x":"240.93055299999997","dy":"30.400000000000002","id":"SvgjsTspan1104"}}]},{"$":{"y":"-352.50870449999996","x":"-147.0615755","font-size":"19","id":"SvgjsText1125","text-anchor":"middle","font-family":"Helvetica","fill":"#ffffff"},"tspan":[{"_":"\r\n                    Tab\r\n                ","$":{"x":"-147.0615755","dy":"30.400000000000002","id":"SvgjsTspan1126"}}]},{"$":{"y":"-352.50870449999996","x":"-63.79386099999999","font-size":"19","id":"SvgjsText1127","text-anchor":"middle","font-family":"Helvetica","fill":"#ffffff"},"tspan":[{"_":"\r\n                    Q\r\n                ","$":{"x":"-63.79386099999999","dy":"30.400000000000002","id":"SvgjsTspan1128"}}]},{"$":{"y":"-352.50870449999996","x":"3.5289709999999985","font-size":"19","id":"SvgjsText1129","text-anchor":"middle","font-family":"Helvetica","fill":"#ffffff"},"tspan":[{"_":"\r\n                    W\r\n                ","$":{"x":"3.5289709999999985","dy":"30.400000000000002","id":"SvgjsTspan1130"}}]},{"$":{"y":"-352.50870449999996","x":"70.851807","font-size":"19","id":"SvgjsText1131","text-anchor":"middle","font-family":"Helvetica","fill":"#ffffff"},"tspan":[{"_":"\r\n                    E\r\n                ","$":{"x":"70.851807","dy":"30.400000000000002","id":"SvgjsTspan1132"}}]},{"$":{"y":"-352.50870449999996","x":"138.174633","font-size":"19","id":"SvgjsText1133","text-anchor":"middle","font-family":"Helvetica","fill":"#ffffff"},"tspan":[{"_":"\r\n                    R\r\n                ","$":{"x":"138.174633","dy":"30.400000000000002","id":"SvgjsTspan1134"}}]},{"$":{"y":"-352.50870449999996","x":"205.49747299999999","font-size":"19","id":"SvgjsText1135","text-anchor":"middle","font-family":"Helvetica","fill":"#ffffff"},"tspan":[{"_":"\r\n                    T\r\n                ","$":{"x":"205.49747299999999","dy":"30.400000000000002","id":"SvgjsTspan1136"}}]},{"$":{"y":"-285.1858645","x":"-139.089135","font-size":"19","id":"SvgjsText1156","text-anchor":"middle","font-family":"Helvetica","fill":"#ffffff"},"tspan":[{"_":"\r\n                    Mouse\r\n                ","$":{"x":"-139.089135","dy":"30.400000000000002","id":"SvgjsTspan1157"}}]},{"$":{"y":"-285.1858645","x":"-47.530083000000005","font-size":"19","id":"SvgjsText1158","text-anchor":"middle","font-family":"Helvetica","fill":"#ffffff"},"tspan":[{"_":"\r\n                    A\r\n                ","$":{"x":"-47.530083000000005","dy":"30.400000000000002","id":"SvgjsTspan1159"}}]},{"$":{"y":"-285.1858645","x":"20.111646999999998","font-size":"19","id":"SvgjsText1160","text-anchor":"middle","font-family":"Helvetica","fill":"#ffffff"},"tspan":[{"_":"\r\n                    S\r\n                ","$":{"x":"20.111646999999998","dy":"30.400000000000002","id":"SvgjsTspan1161"}}]},{"$":{"y":"-285.1858645","x":"87.75337999999999","font-size":"19","id":"SvgjsText1162","text-anchor":"middle","font-family":"Helvetica","fill":"#ffffff"},"tspan":[{"_":"\r\n                    D\r\n                ","$":{"x":"87.75337999999999","dy":"30.400000000000002","id":"SvgjsTspan1163"}}]},{"$":{"y":"-285.1858645","x":"155.395113","font-size":"19","id":"SvgjsText1164","text-anchor":"middle","font-family":"Helvetica","fill":"#ffffff"},"tspan":[{"_":"\r\n                    F\r\n                ","$":{"x":"155.395113","dy":"30.400000000000002","id":"SvgjsTspan1165"}}]},{"$":{"y":"-285.1858645","x":"223.03684299999998","font-size":"19","id":"SvgjsText1166","text-anchor":"middle","font-family":"Helvetica","fill":"#ffffff"},"tspan":[{"_":"\r\n                    G\r\n                ","$":{"x":"223.03684299999998","dy":"30.400000000000002","id":"SvgjsTspan1167"}}]},{"$":{"y":"-217.86302450000002","x":"-123.14425","font-size":"19","id":"SvgjsText1184","text-anchor":"middle","font-family":"Helvetica","fill":"#ffffff"},"tspan":[{"_":"\r\n                    Shift\r\n                ","$":{"x":"-123.14425","dy":"30.400000000000002","id":"SvgjsTspan1185"}}]},{"$":{"y":"-217.86302450000002","x":"-15.250557000000004","font-size":"19","id":"SvgjsText1186","text-anchor":"middle","font-family":"Helvetica","fill":"#ffffff"},"tspan":[{"_":"\r\n                    Z\r\n                ","$":{"x":"-15.250557000000004","dy":"30.400000000000002","id":"SvgjsTspan1187"}}]},{"$":{"y":"-217.86302450000002","x":"52.780936999999994","font-size":"19","id":"SvgjsText1188","text-anchor":"middle","font-family":"Helvetica","fill":"#ffffff"},"tspan":[{"_":"\r\n                    X\r\n                ","$":{"x":"52.780936999999994","dy":"30.400000000000002","id":"SvgjsTspan1189"}}]},{"$":{"y":"-217.86302450000002","x":"120.812431","font-size":"19","id":"SvgjsText1190","text-anchor":"middle","font-family":"Helvetica","fill":"#ffffff"},"tspan":[{"_":"\r\n                    C\r\n                ","$":{"x":"120.812431","dy":"30.400000000000002","id":"SvgjsTspan1191"}}]},{"$":{"y":"-217.86302450000002","x":"188.843923","font-size":"19","id":"SvgjsText1192","text-anchor":"middle","font-family":"Helvetica","fill":"#ffffff"},"tspan":[{"_":"\r\n                    V\r\n                ","$":{"x":"188.843923","dy":"30.400000000000002","id":"SvgjsTspan1193"}}]},{"$":{"y":"-217.86302450000002","x":"256.875423","font-size":"19","id":"SvgjsText1194","text-anchor":"middle","font-family":"Helvetica","fill":"#ffffff"},"tspan":[{"_":"\r\n                    B\r\n                ","$":{"x":"256.875423","dy":"30.400000000000002","id":"SvgjsTspan1195"}}]},{"$":{"y":"-150.5401845","x":"-155.0340145","font-size":"19","id":"SvgjsText1211","text-anchor":"middle","font-family":"Helvetica","fill":"#ffffff"},"tspan":[{"_":"\r\n                    Ctrl\r\n                ","$":{"x":"-155.0340145","dy":"30.400000000000002","id":"SvgjsTspan1212"}}]},{"$":{"y":"-150.5401845","x":"-72.1206345","font-size":"19","id":"SvgjsText1213","text-anchor":"middle","font-family":"Helvetica","fill":"#ffffff"},"tspan":[{"_":"\r\n                    Super\r\n                ","$":{"x":"-72.1206345","dy":"30.400000000000002","id":"SvgjsTspan1214"}}]},{"$":{"y":"-150.5401845","x":"10.7927475","font-size":"19","id":"SvgjsText1215","text-anchor":"middle","font-family":"Helvetica","fill":"#ffffff"},"tspan":[{"_":"\r\n                    Alt\r\n                ","$":{"x":"10.7927475","dy":"30.400000000000002","id":"SvgjsTspan1216"}}]},{"$":{"y":"-150.5401845","x":"93.7061345","font-size":"19","id":"SvgjsText1217","text-anchor":"middle","font-family":"Helvetica","fill":"#ffffff"},"tspan":[{"_":"\r\n                    Fn\r\n                ","$":{"x":"93.7061345","dy":"30.400000000000002","id":"SvgjsTspan1218"}}]},{"$":{"y":"-150.5401845","x":"202.66282999999999","font-size":"19","id":"SvgjsText1219","text-anchor":"middle","font-family":"Helvetica","fill":"#ffffff"},"tspan":[{"_":"\r\n                    Mod\r\n                ","$":{"x":"202.66282999999999","dy":"30.400000000000002","id":"SvgjsTspan1220"}}]},{"$":{"y":"-94.136492","x":"202.66282999999999","font-size":"19","id":"SvgjsText1231","text-anchor":"middle","font-family":"Helvetica","fill":"#ffffff"},"tspan":[{"_":"\r\n                    Space\r\n                ","$":{"x":"202.66282999999999","dy":"30.400000000000002","id":"SvgjsTspan1232"}}]}]},{"$":{"transform":"translate(44.404903 1101.7674)","id":"right-parts"},"path":[{"$":{"d":"m 951.05862,-431.2832 c 2.791,0 5.32908,2.56086 5.32908,5.3769 l 0,329.455425 c 0,2.816038 -2.53808,5.376898 -5.32908,5.376898 l -370.67909,-0.0013 c -1.77166,0 -3.54347,1.7733 -3.54347,3.545 0,12.895215 0,23.315027 0,34.58266 0,1.7716 1.77181,3.5432 3.54347,3.5432 l 390.67297,1.44e-4 c 0.92804,0 1.85621,-0.147582 2.73944,-0.436358 0.88324,-0.288776 1.72122,-0.718687 2.47277,-1.269152 0.75157,-0.550467 1.41644,-1.221298 1.96201,-1.979608 0.54557,-0.758309 0.97166,-1.603806 1.25787,-2.494964 0.2862,-0.891158 0.43247,-1.827653 0.43247,-2.764016 l 0,-389.434639 c 0,-0.83901 -0.11739,-1.67813 -0.34806,-2.4845 -0.23066,-0.80638 -0.57456,-1.57983 -1.01841,-2.28986 -0.44385,-0.71002 -0.98756,-1.35643 -1.60971,-1.91378 -0.62215,-0.55735 -1.3226,-1.0255 -2.07365,-1.38629 -0.75105,-0.36078 -1.55253,-0.61412 -2.37301,-0.75058 -130.52433,-21.7076 -270.93602,-45.05959 -384.94144,-64.01992 -0.91165,-0.15162 -1.8469,-0.15828 -2.76061,-0.0195 -0.91372,0.13871 -1.8056,0.42276 -2.63265,0.83829 -0.82706,0.41551 -1.58903,0.96236 -2.24949,1.61394 -0.66047,0.65158 -1.21924,1.40768 -1.64996,2.2319 -0.43072,0.82422 -0.73327,1.71631 -0.8936,2.63375 -3.12168,17.84567 -6.23258,35.69325 -9.35634,53.53854 -0.058,0.33171 -0.16187,0.65478 -0.30744,0.95668 -0.14556,0.30189 -0.33275,0.58256 -0.5541,0.83133 -0.22136,0.24877 -0.47683,0.4656 -0.7565,0.64244 -0.27967,0.17685 -0.5835,0.31372 -0.89995,0.40551 -0.31645,0.0919 -0.64548,0.1386 -0.97471,0.1386 l -109.19782,-2e-5 c -0.93043,-10e-6 -1.77697,0.85413 -1.77697,1.79631 10e-6,7.4108 -1e-5,15.64271 0,21.94355 0,0.93909 0.84654,1.79353 1.77697,1.79353 l 495.73901,0","id":"right-case"}}],"rect":[{"$":{"rx":"3.5433071","ry":"3.5433071","x":"453.52896","y":"-427.82285","height":"63.779526","width":"63.779526","id":"key-0"}},{"$":{"rx":"3.5433071","ry":"3.5433071","x":"520.85181","y":"-427.82285","height":"63.779526","width":"63.779526","id":"key-1"}},{"$":{"rx":"3.5433071","ry":"3.5433071","x":"588.17462","y":"-427.82285","height":"63.779526","width":"63.779526","id":"key-2"}},{"$":{"rx":"3.5433071","ry":"3.5433071","x":"655.4975","y":"-427.82285","height":"63.779526","width":"63.779526","id":"key-3"}},{"$":{"rx":"3.5433071","ry":"3.5433071","x":"722.82031","y":"-427.82285","height":"63.779526","width":"63.779526","id":"key-4"}},{"$":{"rx":"3.5433071","ry":"3.5433071","x":"790.14313","y":"-427.82285","height":"63.779526","width":"63.779526","id":"key-5"}},{"$":{"rx":"3.5433071","ry":"3.5433071","x":"857.466","y":"-427.82285","height":"63.779526","width":"95.669289","id":"key-6"}},{"$":{"rx":"3.5433071","ry":"3.5433071","x":"418.09589","y":"-360.50003","height":"63.779526","width":"63.779526","id":"key-7"}},{"$":{"rx":"3.5433071","ry":"3.5433071","x":"485.41873","y":"-360.50003","height":"63.779526","width":"63.779526","id":"key-8"}},{"$":{"rx":"3.5433071","ry":"3.5433071","x":"552.74158","y":"-360.50003","height":"63.779526","width":"63.779526","id":"key-9"}},{"$":{"rx":"3.5433071","ry":"3.5433071","x":"620.06439","y":"-360.50003","height":"63.779526","width":"63.779526","id":"key-10"}},{"$":{"rx":"3.5433071","ry":"3.5433071","x":"687.38727","y":"-360.50003","height":"63.779526","width":"63.779526","id":"key-11"}},{"$":{"rx":"3.5433071","ry":"3.5433071","x":"754.71008","y":"-360.50003","height":"63.779526","width":"63.779526","id":"key-12"}},{"$":{"rx":"3.5433071","ry":"3.5433071","x":"822.0329","y":"-360.50003","height":"63.779526","width":"63.779526","id":"key-13"}},{"$":{"rx":"3.5433071","ry":"3.5433071","x":"889.35571","y":"-360.50003","height":"63.779526","width":"63.779526","id":"key-14"}},{"$":{"rx":"3.5433071","ry":"3.5433071","x":"435.67072","y":"-293.17719","height":"63.779526","width":"63.779526","id":"key-15"}},{"$":{"rx":"3.5433071","ry":"3.5433071","x":"503.31244","y":"-293.17719","height":"63.779526","width":"63.779526","id":"key-16"}},{"$":{"rx":"3.5433071","ry":"3.5433071","x":"570.95416","y":"-293.17719","height":"63.779526","width":"63.779526","id":"key-17"}},{"$":{"rx":"3.5433071","ry":"3.5433071","x":"638.59589","y":"-293.17719","height":"63.779526","width":"63.779526","id":"key-18"}},{"$":{"rx":"3.5433071","ry":"3.5433071","x":"706.23761","y":"-293.17719","height":"63.779526","width":"63.779526","id":"key-19"}},{"$":{"rx":"3.5433071","ry":"3.5433071","x":"773.87939","y":"-293.17719","height":"63.779526","width":"63.779526","id":"key-20"}},{"$":{"rx":"3.5433071","ry":"3.5433071","x":"841.52112","y":"-293.17719","height":"63.779526","width":"111.61417","id":"key-21"}},{"$":{"rx":"3.5433071","ry":"3.5433071","x":"469.47385","y":"-225.85435","height":"63.779526","width":"63.779526","id":"key-22"}},{"$":{"rx":"3.5433071","ry":"3.5433071","x":"537.50537","y":"-225.85435","height":"63.779526","width":"63.779526","id":"key-23"}},{"$":{"rx":"3.5433071","ry":"3.5433071","x":"605.53687","y":"-225.85435","height":"63.779526","width":"63.779526","id":"key-24"}},{"$":{"rx":"3.5433071","ry":"3.5433071","x":"673.56836","y":"-225.85435","height":"63.779526","width":"63.779526","id":"key-25"}},{"$":{"rx":"3.5433071","ry":"3.5433071","x":"741.59985","y":"-225.85435","height":"63.779526","width":"63.779526","id":"key-26"}},{"$":{"rx":"3.5433071","ry":"3.5433071","x":"809.63135","y":"-225.85435","height":"63.779526","width":"143.50394","id":"key-27"}},{"$":{"rx":"3.5433071","ry":"3.5433071","x":"448.92267","y":"-158.53151","height":"63.779526","width":"124.37008","id":"key-28"}},{"$":{"rx":"3.5433071","ry":"3.5433071","x":"576.83606","y":"-158.53151","height":"63.779526","width":"79.724411","id":"key-29"}},{"$":{"rx":"3.5433071","ry":"3.5433071","x":"659.74945","y":"-158.53151","height":"63.779526","width":"79.724411","id":"key-30"}},{"$":{"rx":"3.5433071","ry":"3.5433071","x":"742.66284","y":"-158.53151","height":"63.779526","width":"79.724411","id":"key-31"}},{"$":{"rx":"3.5433071","ry":"3.5433071","x":"825.57623","y":"-158.53151","height":"63.779526","width":"127.55905","id":"key-32"}},{"$":{"rx":"3.493542","ry":"3.5433071","x":"448.92267","y":"-91.071663","height":"41.667309","width":"124.37009","id":"key-33"}}],"text":[{"$":{"y":"-435.0346495","x":"485.418723","font-size":"19","id":"SvgjsText1105","text-anchor":"middle","font-family":"Helvetica","fill":"#ffffff"},"tspan":[{"_":"&","$":{"x":"485.418723","dy":"30.400000000000002","id":"SvgjsTspan1106"}},{"_":"7","$":{"x":"485.418723","dy":"30.400000000000002","id":"SvgjsTspan1107"}}]},{"$":{"y":"-435.0346495","x":"552.741573","font-size":"19","id":"SvgjsText1108","text-anchor":"middle","font-family":"Helvetica","fill":"#ffffff"},"tspan":[{"_":"*","$":{"x":"552.741573","dy":"30.400000000000002","id":"SvgjsTspan1109"}},{"_":"8","$":{"x":"552.741573","dy":"30.400000000000002","id":"SvgjsTspan1110"}}]},{"$":{"y":"-435.0346495","x":"620.064383","font-size":"19","id":"SvgjsText1111","text-anchor":"middle","font-family":"Helvetica","fill":"#ffffff"},"tspan":[{"_":"(","$":{"x":"620.064383","dy":"30.400000000000002","id":"SvgjsTspan1112"}},{"_":"9","$":{"x":"620.064383","dy":"30.400000000000002","id":"SvgjsTspan1113"}}]},{"$":{"y":"-435.0346495","x":"687.387263","font-size":"19","id":"SvgjsText1114","text-anchor":"middle","font-family":"Helvetica","fill":"#ffffff"},"tspan":[{"_":")","$":{"x":"687.387263","dy":"30.400000000000002","id":"SvgjsTspan1115"}},{"_":"0","$":{"x":"687.387263","dy":"30.400000000000002","id":"SvgjsTspan1116"}}]},{"$":{"y":"-435.0346495","x":"754.710073","font-size":"19","id":"SvgjsText1117","text-anchor":"middle","font-family":"Helvetica","fill":"#ffffff"},"tspan":[{"_":"_","$":{"x":"754.710073","dy":"30.400000000000002","id":"SvgjsTspan1118"}},{"_":"-","$":{"x":"754.710073","dy":"30.400000000000002","id":"SvgjsTspan1119"}}]},{"$":{"y":"-435.0346495","x":"822.0328930000001","font-size":"19","id":"SvgjsText1120","text-anchor":"middle","font-family":"Helvetica","fill":"#ffffff"},"tspan":[{"_":"+","$":{"x":"822.0328930000001","dy":"30.400000000000002","id":"SvgjsTspan1121"}},{"_":"=","$":{"x":"822.0328930000001","dy":"30.400000000000002","id":"SvgjsTspan1122"}}]},{"$":{"y":"-419.8315245","x":"905.3006445","font-size":"19","id":"SvgjsText1123","text-anchor":"middle","font-family":"Helvetica","fill":"#ffffff"},"tspan":[{"_":"\r\n                    ←\r\n                ","$":{"x":"905.3006445","dy":"30.400000000000002","id":"SvgjsTspan1124"}}]},{"$":{"y":"-352.50870449999996","x":"449.985653","font-size":"19","id":"SvgjsText1137","text-anchor":"middle","font-family":"Helvetica","fill":"#ffffff"},"tspan":[{"_":"\r\n                    Y\r\n                ","$":{"x":"449.985653","dy":"30.400000000000002","id":"SvgjsTspan1138"}}]},{"$":{"y":"-352.50870449999996","x":"517.308493","font-size":"19","id":"SvgjsText1139","text-anchor":"middle","font-family":"Helvetica","fill":"#ffffff"},"tspan":[{"_":"\r\n                    U\r\n                ","$":{"x":"517.308493","dy":"30.400000000000002","id":"SvgjsTspan1140"}}]},{"$":{"y":"-352.50870449999996","x":"584.631343","font-size":"19","id":"SvgjsText1141","text-anchor":"middle","font-family":"Helvetica","fill":"#ffffff"},"tspan":[{"_":"\r\n                    I\r\n                ","$":{"x":"584.631343","dy":"30.400000000000002","id":"SvgjsTspan1142"}}]},{"$":{"y":"-352.50870449999996","x":"651.954153","font-size":"19","id":"SvgjsText1143","text-anchor":"middle","font-family":"Helvetica","fill":"#ffffff"},"tspan":[{"_":"\r\n                    O\r\n                ","$":{"x":"651.954153","dy":"30.400000000000002","id":"SvgjsTspan1144"}}]},{"$":{"y":"-352.50870449999996","x":"719.277033","font-size":"19","id":"SvgjsText1145","text-anchor":"middle","font-family":"Helvetica","fill":"#ffffff"},"tspan":[{"_":"\r\n                    P\r\n                ","$":{"x":"719.277033","dy":"30.400000000000002","id":"SvgjsTspan1146"}}]},{"$":{"y":"-367.71182949999996","x":"786.599843","font-size":"19","id":"SvgjsText1147","text-anchor":"middle","font-family":"Helvetica","fill":"#ffffff"},"tspan":[{"_":"{","$":{"x":"786.599843","dy":"30.400000000000002","id":"SvgjsTspan1148"}},{"_":"[","$":{"x":"786.599843","dy":"30.400000000000002","id":"SvgjsTspan1149"}}]},{"$":{"y":"-367.71182949999996","x":"853.9226630000001","font-size":"19","id":"SvgjsText1150","text-anchor":"middle","font-family":"Helvetica","fill":"#ffffff"},"tspan":[{"_":"}","$":{"x":"853.9226630000001","dy":"30.400000000000002","id":"SvgjsTspan1151"}},{"_":"]","$":{"x":"853.9226630000001","dy":"30.400000000000002","id":"SvgjsTspan1152"}}]},{"$":{"y":"-367.71182949999996","x":"921.2454730000001","font-size":"19","id":"SvgjsText1153","text-anchor":"middle","font-family":"Helvetica","fill":"#ffffff"},"tspan":[{"_":"|","$":{"x":"921.2454730000001","dy":"30.400000000000002","id":"SvgjsTspan1154"}},{"_":"\\","$":{"x":"921.2454730000001","dy":"30.400000000000002","id":"SvgjsTspan1155"}}]},{"$":{"y":"-285.1858645","x":"467.56048300000003","font-size":"19","id":"SvgjsText1168","text-anchor":"middle","font-family":"Helvetica","fill":"#ffffff"},"tspan":[{"_":"\r\n                    H\r\n                ","$":{"x":"467.56048300000003","dy":"30.400000000000002","id":"SvgjsTspan1169"}}]},{"$":{"y":"-285.1858645","x":"535.2022029999999","font-size":"19","id":"SvgjsText1170","text-anchor":"middle","font-family":"Helvetica","fill":"#ffffff"},"tspan":[{"_":"\r\n                    J\r\n                ","$":{"x":"535.2022029999999","dy":"30.400000000000002","id":"SvgjsTspan1171"}}]},{"$":{"y":"-285.1858645","x":"602.843923","font-size":"19","id":"SvgjsText1172","text-anchor":"middle","font-family":"Helvetica","fill":"#ffffff"},"tspan":[{"_":"\r\n                    K\r\n                ","$":{"x":"602.843923","dy":"30.400000000000002","id":"SvgjsTspan1173"}}]},{"$":{"y":"-285.1858645","x":"670.4856530000001","font-size":"19","id":"SvgjsText1174","text-anchor":"middle","font-family":"Helvetica","fill":"#ffffff"},"tspan":[{"_":"\r\n                    L\r\n                ","$":{"x":"670.4856530000001","dy":"30.400000000000002","id":"SvgjsTspan1175"}}]},{"$":{"y":"-300.3889895","x":"738.127373","font-size":"19","id":"SvgjsText1176","text-anchor":"middle","font-family":"Helvetica","fill":"#ffffff"},"tspan":[{"_":":","$":{"x":"738.127373","dy":"30.400000000000002","id":"SvgjsTspan1177"}},{"_":";","$":{"x":"738.127373","dy":"30.400000000000002","id":"SvgjsTspan1178"}}]},{"$":{"y":"-300.3889895","x":"805.769153","font-size":"19","id":"SvgjsText1179","text-anchor":"middle","font-family":"Helvetica","fill":"#ffffff"},"tspan":[{"_":"\"","$":{"x":"805.769153","dy":"30.400000000000002","id":"SvgjsTspan1180"}},{"_":"'","$":{"x":"805.769153","dy":"30.400000000000002","id":"SvgjsTspan1181"}}]},{"$":{"y":"-285.1858645","x":"897.328205","font-size":"19","id":"SvgjsText1182","text-anchor":"middle","font-family":"Helvetica","fill":"#ffffff"},"tspan":[{"_":"\r\n                    Enter\r\n                ","$":{"x":"897.328205","dy":"30.400000000000002","id":"SvgjsTspan1183"}}]},{"$":{"y":"-217.86302450000002","x":"501.36361300000004","font-size":"19","id":"SvgjsText1196","text-anchor":"middle","font-family":"Helvetica","fill":"#ffffff"},"tspan":[{"_":"\r\n                    N\r\n                ","$":{"x":"501.36361300000004","dy":"30.400000000000002","id":"SvgjsTspan1197"}}]},{"$":{"y":"-217.86302450000002","x":"569.395133","font-size":"19","id":"SvgjsText1198","text-anchor":"middle","font-family":"Helvetica","fill":"#ffffff"},"tspan":[{"_":"\r\n                    M\r\n                ","$":{"x":"569.395133","dy":"30.400000000000002","id":"SvgjsTspan1199"}}]},{"$":{"y":"-233.06614950000002","x":"637.426633","font-size":"19","id":"SvgjsText1200","text-anchor":"middle","font-family":"Helvetica","fill":"#ffffff"},"tspan":[{"_":"<","$":{"x":"637.426633","dy":"30.400000000000002","id":"SvgjsTspan1201"}},{"_":",","$":{"x":"637.426633","dy":"30.400000000000002","id":"SvgjsTspan1202"}}]},{"$":{"y":"-233.06614950000002","x":"705.458123","font-size":"19","id":"SvgjsText1203","text-anchor":"middle","font-family":"Helvetica","fill":"#ffffff"},"tspan":[{"_":">","$":{"x":"705.458123","dy":"30.400000000000002","id":"SvgjsTspan1204"}},{"_":".","$":{"x":"705.458123","dy":"30.400000000000002","id":"SvgjsTspan1205"}}]},{"$":{"y":"-233.06614950000002","x":"773.489613","font-size":"19","id":"SvgjsText1206","text-anchor":"middle","font-family":"Helvetica","fill":"#ffffff"},"tspan":[{"_":"?","$":{"x":"773.489613","dy":"30.400000000000002","id":"SvgjsTspan1207"}},{"_":"/","$":{"x":"773.489613","dy":"30.400000000000002","id":"SvgjsTspan1208"}}]},{"$":{"y":"-217.86302450000002","x":"881.38332","font-size":"19","id":"SvgjsText1209","text-anchor":"middle","font-family":"Helvetica","fill":"#ffffff"},"tspan":[{"_":"\r\n                    Shift\r\n                ","$":{"x":"881.38332","dy":"30.400000000000002","id":"SvgjsTspan1210"}}]},{"$":{"y":"-150.5401845","x":"511.10771","font-size":"19","id":"SvgjsText1221","text-anchor":"middle","font-family":"Helvetica","fill":"#ffffff"},"tspan":[{"_":"\r\n                    Space\r\n                ","$":{"x":"511.10771","dy":"30.400000000000002","id":"SvgjsTspan1222"}}]},{"$":{"y":"-150.5401845","x":"616.6982654999999","font-size":"19","id":"SvgjsText1223","text-anchor":"middle","font-family":"Helvetica","fill":"#ffffff"},"tspan":[{"_":"\r\n                    Fn\r\n                ","$":{"x":"616.6982654999999","dy":"30.400000000000002","id":"SvgjsTspan1224"}}]},{"$":{"y":"-150.5401845","x":"699.6116555","font-size":"19","id":"SvgjsText1225","text-anchor":"middle","font-family":"Helvetica","fill":"#ffffff"},"tspan":[{"_":"\r\n                    Alt\r\n                ","$":{"x":"699.6116555","dy":"30.400000000000002","id":"SvgjsTspan1226"}}]},{"$":{"y":"-150.5401845","x":"782.5250454999999","font-size":"19","id":"SvgjsText1227","text-anchor":"middle","font-family":"Helvetica","fill":"#ffffff"},"tspan":[{"_":"\r\n                    Super\r\n                ","$":{"x":"782.5250454999999","dy":"30.400000000000002","id":"SvgjsTspan1228"}}]},{"$":{"y":"-150.5401845","x":"889.355755","font-size":"19","id":"SvgjsText1229","text-anchor":"middle","font-family":"Helvetica","fill":"#ffffff"},"tspan":[{"_":"\r\n                    Ctrl\r\n                ","$":{"x":"889.355755","dy":"30.400000000000002","id":"SvgjsTspan1230"}}]},{"$":{"y":"-94.136446","x":"511.107715","font-size":"19","id":"SvgjsText1233","text-anchor":"middle","font-family":"Helvetica","fill":"#ffffff"},"tspan":[{"_":"\r\n                    Mod\r\n                ","$":{"x":"511.107715","dy":"30.400000000000002","id":"SvgjsTspan1234"}}]}]}]}]}}

/***/ }),
/* 1127 */
/***/ (function(module, exports) {

/* (ignored) */

/***/ }),
/* 1128 */,
/* 1129 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/* WEBPACK VAR INJECTION */(function(process) {
Object.defineProperty(exports, "__esModule", { value: true });
var platform_browser_dynamic_1 = __webpack_require__(293);
var app_module_1 = __webpack_require__(468);
if (!process.stdout) {
    process.stdout = __webpack_require__(464)();
}
platform_browser_dynamic_1.platformBrowserDynamic().bootstrapModule(app_module_1.AppModule);

/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(32)))

/***/ })
]),[1129]);
//# sourceMappingURL=app.uhk.js.map