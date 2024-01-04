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
var __async = (__this, __arguments, generator) => {
  return new Promise((resolve, reject) => {
    var fulfilled = (value) => {
      try {
        step(generator.next(value));
      } catch (e) {
        reject(e);
      }
    };
    var rejected = (value) => {
      try {
        step(generator.throw(value));
      } catch (e) {
        reject(e);
      }
    };
    var step = (x) => x.done ? resolve(x.value) : Promise.resolve(x.value).then(fulfilled, rejected);
    step((generator = generator.apply(__this, __arguments)).next());
  });
};

// src/services/expense-service.ts
var expense_service_exports = {};
__export(expense_service_exports, {
  ExpenseService: () => ExpenseService
});
module.exports = __toCommonJS(expense_service_exports);
var ExpenseService = class {
  constructor(repository) {
    this.repository = repository;
  }
  add(data) {
    return __async(this, null, function* () {
      const expense = yield this.repository.add(data);
      return { expense };
    });
  }
  findMany(_0) {
    return __async(this, arguments, function* ({ user_id, month }) {
      const expenses = yield this.repository.findMany({ user_id, month });
      return expenses;
    });
  }
  update(data, id) {
    return __async(this, null, function* () {
      const updatedExpense = yield this.repository.update(data, id);
      return updatedExpense;
    });
  }
  remove(id) {
    return __async(this, null, function* () {
      yield this.repository.remove(id);
    });
  }
};
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  ExpenseService
});
