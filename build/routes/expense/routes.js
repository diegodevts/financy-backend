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

// src/routes/expense/routes.ts
var routes_exports = {};
__export(routes_exports, {
  default: () => routes_default
});
module.exports = __toCommonJS(routes_exports);
var import_express = require("express");

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

// src/services/expense-service.ts
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

// src/errors/incorrect-credentials.ts
var IncorrectCredentialsError = class extends Error {
  constructor() {
    super("Email ou senha incorretos.");
  }
};

// src/controllers/expense/expense-controller.ts
var ExpenseController = class {
  constructor(service) {
    this.service = service;
  }
  add(request, response) {
    return __async(this, null, function* () {
      try {
        const { value, type, description, user_id } = request.body;
        const { expense } = yield this.service.add({
          value: parseFloat(value),
          type,
          description,
          user_id
        });
        return response.status(201).send({ message: "Item adicionado com sucesso!", expense });
      } catch (error) {
        console.log(error);
        return response.status(500).send({ message: "Internal server error" });
      }
    });
  }
  findMany(request, response) {
    return __async(this, null, function* () {
      try {
        const { user_id } = request.body;
        const { month } = request.query;
        const expenses = yield this.service.findMany({
          user_id,
          month
        });
        return response.send({ expenses });
      } catch (error) {
        if (error instanceof NotFoundError) {
          return response.status(401).send({ message: error.message });
        }
        return response.status(500).send({ message: "Internal server error", error });
      }
    });
  }
  update(request, response) {
    return __async(this, null, function* () {
      try {
        const { id } = request.params;
        const data = request.body;
        yield this.service.update(data, id);
        return response.send({ message: "Item atualizado com sucesso!" });
      } catch (error) {
        if (error instanceof NotFoundError) {
          return response.status(401).send({ message: error.message });
        }
        return response.status(500).send({ message: "Internal server error" });
      }
    });
  }
  remove(request, response) {
    return __async(this, null, function* () {
      try {
        const { id } = request.params;
        yield this.service.remove(id);
        return response.send({ message: "Item removido com sucesso!" });
      } catch (error) {
        if (error instanceof NotFoundError) {
          return response.status(401).send({ message: error.message });
        }
        if (error instanceof IncorrectCredentialsError) {
          return response.status(401).json({ message: error.message });
        }
        return response.status(500).send({ message: "Internal server error" });
      }
    });
  }
};

// src/controllers/expense/index.ts
var expenseRepository = new ExpensePrismaRepository();
var expenseService = new ExpenseService(expenseRepository);
var expenseController = new ExpenseController(expenseService);

// src/middlewares/auth-middleware.ts
var import_jsonwebtoken = require("jsonwebtoken");

// src/errors/unauthorized.ts
var UnauthorizedError = class extends Error {
  constructor(message) {
    super(`Acesso n\xE3o autorizado, ${message}`);
    this.message = message;
  }
};

// src/middlewares/auth-middleware.ts
var Auth = class {
  constructor() {
  }
  execute(request, response, next) {
    return __async(this, null, function* () {
      try {
        const { authorization } = request.headers;
        if (!authorization) {
          throw new UnauthorizedError("Token inv\xE1lido.");
        }
        const [_, token] = authorization.split(" ");
        const secret = process.env.SECRET;
        const decriptedToken = (0, import_jsonwebtoken.verify)(token, secret);
        const { id } = decriptedToken;
        request.body.user_id = id;
        next();
      } catch (error) {
        if (error instanceof UnauthorizedError) {
          return response.status(401).json({ message: error.message });
        }
        if (error instanceof import_jsonwebtoken.TokenExpiredError) {
          return response.status(401).json({ message: "Token expirado." });
        }
        return response.status(500).send({ message: "Internal server error.", code: 500 });
      }
    });
  }
};

// src/routes/expense/routes.ts
var endpoint = (0, import_express.Router)();
var auth = new Auth();
endpoint.post("/add", auth.execute, (request, response) => {
  return expenseController.add(request, response);
});
endpoint.get("/all", auth.execute, (request, response) => {
  return expenseController.findMany(request, response);
});
endpoint.put(
  "/update/:id",
  auth.execute,
  (request, response) => {
    return expenseController.update(request, response);
  }
);
endpoint.delete(
  "/remove/:id",
  auth.execute,
  (request, response) => {
    return expenseController.remove(request, response);
  }
);
var routes_default = endpoint;
