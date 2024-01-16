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

// src/controllers/expense/expense-controller.ts
var expense_controller_exports = {};
__export(expense_controller_exports, {
  ExpenseController: () => ExpenseController
});
module.exports = __toCommonJS(expense_controller_exports);

// src/errors/not-found.ts
var NotFoundError = class extends Error {
  constructor(message) {
    super(`${message} n\xE3o encontrado.`);
    this.message = message;
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
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  ExpenseController
});
