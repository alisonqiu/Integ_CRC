"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
// Object.defineProperty(exports, "__esModule", { value: true });
// exports.NestedMenuItem = void 0;
var react_1 = __importStar(require("react"));
var IconMenuItem_1 = require("./IconMenuItem");
var material_1 = require("@mui/material");
var ChevronRight_1 = require("./ChevronRight");
var NestedMenuItem = react_1.default.forwardRef(function NestedMenuItem(props, ref) {
    var parentMenuOpen = props.parentMenuOpen, label = props.label, _a = props.rightIcon, rightIcon = _a === void 0 ? react_1.default.createElement(ChevronRight_1.ChevronRight, null) : _a, _b = props.leftIcon, leftIcon = _b === void 0 ? null : _b, children = props.children, className = props.className, tabIndexProp = props.tabIndex, _c = props.ContainerProps, ContainerPropsProp = _c === void 0 ? {} : _c, MenuItemProps = __rest(props, ["parentMenuOpen", "label", "rightIcon", "leftIcon", "children", "className", "tabIndex", "ContainerProps"]);
    var containerRefProp = ContainerPropsProp.ref, ContainerProps = __rest(ContainerPropsProp, ["ref"]);
    var menuItemRef = (0, react_1.useRef)(null);
    (0, react_1.useImperativeHandle)(ref, function () { return menuItemRef.current; });
    var containerRef = (0, react_1.useRef)(null);
    (0, react_1.useImperativeHandle)(containerRefProp, function () { return containerRef.current; });
    var menuContainerRef = (0, react_1.useRef)(null);
    var _d = (0, react_1.useState)(false), isSubMenuOpen = _d[0], setIsSubMenuOpen = _d[1];
    var handleMouseEnter = function (e) {
        setIsSubMenuOpen(true);
        if (ContainerProps.onMouseEnter) {
            ContainerProps.onMouseEnter(e);
        }
    };
    var handleMouseLeave = function (e) {
        setIsSubMenuOpen(false);
        if (ContainerProps.onMouseLeave) {
            ContainerProps.onMouseLeave(e);
        }
    };
    // Check if any immediate children are active
    var isSubmenuFocused = function () {
        var active = containerRef.current.ownerDocument.activeElement;
        for (var _i = 0, _a = menuContainerRef.current.children; _i < _a.length; _i++) {
            var child = _a[_i];
            if (child === active) {
                return true;
            }
        }
        return false;
    };
    var handleFocus = function (e) {
        if (e.target === containerRef.current) {
            setIsSubMenuOpen(true);
        }
        if (ContainerProps.onFocus) {
            ContainerProps.onFocus(e);
        }
    };
    var handleKeyDown = function (e) {
        if (e.key === 'Escape') {
            return;
        }
        if (isSubmenuFocused()) {
            e.stopPropagation();
        }
        var active = containerRef.current.ownerDocument.activeElement;
        if (e.key === 'ArrowLeft' && isSubmenuFocused()) {
            containerRef.current.focus();
        }
        if (e.key === 'ArrowRight' &&
            e.target === containerRef.current &&
            e.target === active) {
            var firstChild = menuContainerRef.current.children[0];
            firstChild.focus();
        }
    };
    var open = isSubMenuOpen && parentMenuOpen;
    // Root element must have a `tabIndex` attribute for keyboard navigation
    var tabIndex;
    if (!props.disabled) {
        tabIndex = tabIndexProp !== undefined ? tabIndexProp : -1;
    }
    return (react_1.default.createElement("div", __assign({}, ContainerProps, { ref: containerRef, onFocus: handleFocus, tabIndex: tabIndex, onMouseEnter: handleMouseEnter, onMouseLeave: handleMouseLeave, onKeyDown: handleKeyDown }),
        react_1.default.createElement(IconMenuItem_1.IconMenuItem, { MenuItemProps: MenuItemProps, className: className, ref: menuItemRef, leftIcon: leftIcon, rightIcon: rightIcon, label: label }),
        react_1.default.createElement(material_1.Menu
        // Set pointer events to 'none' to prevent the invisible Popover div
        // from capturing events for clicks and hovers
        , { 
            // Set pointer events to 'none' to prevent the invisible Popover div
            // from capturing events for clicks and hovers
            style: { pointerEvents: 'none' }, anchorEl: menuItemRef.current, anchorOrigin: { vertical: 'top', horizontal: 'right' }, transformOrigin: { vertical: 'top', horizontal: 'left' }, open: open, autoFocus: false, disableAutoFocus: true, disableEnforceFocus: true, onClose: function () {
                setIsSubMenuOpen(false);
            } },
            react_1.default.createElement("div", { ref: menuContainerRef, style: { pointerEvents: 'auto', overflowY: "scroll", maxHeight: "500px" } }, children))));

        });
// exports.NestedMenuItem = NestedMenuItem;
NestedMenuItem.displayName = 'NestedMenuItem';
export {NestedMenuItem}