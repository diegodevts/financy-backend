"use strict";
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

// src/util/format-value.ts
var format_value_exports = {};
__export(format_value_exports, {
  formatValue: () => formatValue
});
module.exports = __toCommonJS(format_value_exports);
var formatValue = (value, type, item) => {
  if (value == 0 && type == item.type) {
    return item.value;
  }
  if (type > 1 && value > 0) {
    return Math.abs(value);
  }
  if (type == 1 && value > 0) {
    return value *= -1;
  }
  if (value == 0 && type == 1) {
    return item.value *= -1;
  }
  if (value == 0 && type > 1) {
    return Math.abs(item.value);
  }
  if (type == 0 && value == 0) {
    return item.value;
  }
  if (type == 0 && value > 0) {
    return item.type == 1 ? value *= -1 : value;
  }
};
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  formatValue
});
