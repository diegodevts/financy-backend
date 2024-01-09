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

// src/repositories/prisma/expense.ts
var expense_exports = {};
__export(expense_exports, {
  ExpensePrismaRepository: () => ExpensePrismaRepository
});
module.exports = __toCommonJS(expense_exports);

// src/database/prisma-client.ts
var import_client = require("@prisma/client");
var prismaClient = new import_client.PrismaClient();

// src/errors/not-found.ts
var NotFoundError = class extends Error {
  constructor(message) {
    super(`${message} n\xE3o encontrado.`);
    this.message = message;
  }
};

// src/util/format-value.ts
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

// src/repositories/prisma/expense.ts
var ExpensePrismaRepository = class {
  add(_0) {
    return __async(this, arguments, function* ({
      type,
      user_id,
      description,
      value
    }) {
      const currentMonth = (/* @__PURE__ */ new Date()).getMonth();
      const hasSalary = yield prismaClient.expenses.findMany({
        where: { user_id, type: 3 }
      });
      const currentMonthSalary = hasSalary.find(
        ({ created_at }) => created_at.getMonth() == currentMonth
      );
      if (currentMonthSalary && +type == 3) {
        const expense2 = yield prismaClient.expenses.update({
          where: { id: currentMonthSalary.id },
          data: {
            value: { increment: +value }
          }
        });
        return expense2;
      }
      const expense = yield prismaClient.expenses.create({
        data: {
          description: +type === 3 ? "Sal\xE1rio" : description,
          value: type > 1 ? value : value *= -1,
          type: +type,
          user_id
        }
      });
      return expense;
    });
  }
  findMany(_0) {
    return __async(this, arguments, function* ({
      user_id,
      month
    }) {
      const currentMonth = (/* @__PURE__ */ new Date()).getMonth();
      const expenses = yield prismaClient.expenses.findMany({
        where: { user_id }
      });
      const expensesByMonth = expenses.filter(
        (expense) => month ? expense.created_at.getMonth() == +month : expense.created_at.getMonth() == currentMonth
      );
      return expensesByMonth;
    });
  }
  update(_0, _1) {
    return __async(this, arguments, function* ({
      user_id,
      type,
      description,
      value
    }, id) {
      const item = yield prismaClient.expenses.findUnique({ where: { id } });
      if (!item) {
        throw new NotFoundError("Item");
      }
      const expense = yield prismaClient.expenses.update({
        where: { user_id, id },
        data: {
          description: description ? description : item.description,
          value: formatValue(value ? +value : 0, type ? +type : 0, item),
          type: type ? +type : item.type
        }
      });
      return expense;
    });
  }
  remove(id) {
    return __async(this, null, function* () {
      yield prismaClient.expenses.delete({ where: { id } });
    });
  }
  find(id) {
    return __async(this, null, function* () {
      const expense = yield prismaClient.expenses.findUnique({ where: { id } });
      return expense;
    });
  }
};
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  ExpensePrismaRepository
});
