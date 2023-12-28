"use strict";
var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
  // If the importer is in node compatibility mode or this is not an ESM
  // file that has been converted to a CommonJS file using a Babel-
  // compatible transform (i.e. "__esModule" has not been set), then set
  // "default" to the CommonJS "module.exports" for node compatibility.
  isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
  mod
));
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

// src/server.ts
var import_express5 = __toESM(require("express"));
var import_config = require("dotenv/config");
var import_cors = __toESM(require("cors"));

// src/routes.ts
var import_express4 = require("express");

// src/routes/user/routes.ts
var import_express = require("express");

// src/database/prisma-client.ts
var import_client = require("@prisma/client");
var prismaClient = new import_client.PrismaClient();

// src/repositories/prisma/user.ts
var UserPrismaRepository = class {
  create(data) {
    return __async(this, null, function* () {
      const user = yield prismaClient.user.create({ data });
      return user;
    });
  }
  find(id) {
    return __async(this, null, function* () {
      const user = yield prismaClient.user.findUnique({ where: { id } });
      return user;
    });
  }
  findByEmail(email) {
    return __async(this, null, function* () {
      const user = yield prismaClient.user.findUnique({ where: { email } });
      return user;
    });
  }
  update(data, id) {
    return __async(this, null, function* () {
      const user = yield prismaClient.user.update({ where: { id }, data });
      return user;
    });
  }
};

// src/services/user-service.ts
var import_bcryptjs = require("bcryptjs");

// src/errors/user-already-exists.ts
var UserAlreadyExistsError = class extends Error {
  constructor() {
    super("Usu\xE1rio j\xE1 existente.");
  }
};

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

// src/services/user-service.ts
var import_jsonwebtoken = require("jsonwebtoken");
var UserService = class {
  constructor(repository) {
    this.repository = repository;
  }
  register(_0) {
    return __async(this, arguments, function* ({ email, password, name }) {
      const password_hash = yield (0, import_bcryptjs.hash)(password, 6);
      const userWithSameEmail = yield this.repository.findByEmail(email);
      if (userWithSameEmail) {
        throw new UserAlreadyExistsError();
      }
      const user = yield this.repository.create({
        email,
        password: password_hash,
        name
      });
      return { user };
    });
  }
  find(id) {
    return __async(this, null, function* () {
      const hasUser = yield this.repository.find(id);
      if (!hasUser) {
        throw new NotFoundError("Usu\xE1rio");
      }
      return hasUser;
    });
  }
  update(data, id) {
    return __async(this, null, function* () {
      const hasUser = yield this.repository.find(id);
      if (!hasUser) {
        throw new NotFoundError("Usu\xE1rio");
      }
      const updatedUser = yield this.repository.update(data, id);
      return updatedUser;
    });
  }
  login(email, password) {
    return __async(this, null, function* () {
      const hasUser = yield this.repository.findByEmail(email);
      const secret = process.env.SECRET;
      if (!hasUser) {
        throw new NotFoundError("Usu\xE1rio n\xE3o existe.");
      }
      const passwordMatches = yield (0, import_bcryptjs.compare)(password, hasUser.password);
      if (!passwordMatches) {
        throw new IncorrectCredentialsError();
      }
      const token = (0, import_jsonwebtoken.sign)({ id: hasUser.id }, secret, {
        expiresIn: "1m"
      });
      return {
        token,
        user: hasUser.name
      };
    });
  }
  //integraçao nubank
};

// src/controllers/user/user-controller.ts
var UserController = class {
  constructor(service) {
    this.service = service;
  }
  register(request, response) {
    return __async(this, null, function* () {
      try {
        yield this.service.register(request.body);
        return response.status(201).send({ message: "Usu\xE1rio registrado com sucesso!" });
      } catch (error) {
        if (error instanceof UserAlreadyExistsError) {
          return response.status(401).json({ message: error.message });
        }
        return response.status(500).send({ message: "Internal server error" });
      }
    });
  }
  find(request, response) {
    return __async(this, null, function* () {
      try {
        const { id } = request.params;
        const user = yield this.service.find(id);
        return response.send({ message: "Ok!", user });
      } catch (error) {
        if (error instanceof NotFoundError) {
          return response.status(401).send({ message: error.message });
        }
        return response.status(500).send({ message: "Internal server error" });
      }
    });
  }
  update(request, response) {
    return __async(this, null, function* () {
      try {
        const { id } = request.params;
        const data = request.body;
        yield this.service.update(data, id);
        return response.send({ message: "Atualizado com sucesso!" });
      } catch (error) {
        if (error instanceof NotFoundError) {
          return response.status(401).send({ message: error.message });
        }
        return response.status(500).send({ message: "Internal server error" });
      }
    });
  }
  login(request, response) {
    return __async(this, null, function* () {
      try {
        const { email, password } = request.body;
        const { token, user } = yield this.service.login(email, password);
        return response.send({
          message: `Ol\xE1 novamente, ${user}!`,
          token
        });
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

// src/controllers/user/index.ts
var userRepository = new UserPrismaRepository();
var userService = new UserService(userRepository);
var userController = new UserController(userService);

// src/middlewares/auth-middleware.ts
var import_jsonwebtoken2 = require("jsonwebtoken");

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
        const decriptedToken = (0, import_jsonwebtoken2.verify)(token, secret);
        const { id } = decriptedToken;
        request.body.user_id = id;
        next();
      } catch (error) {
        if (error instanceof UnauthorizedError) {
          return response.status(401).json({ message: error.message });
        }
        if (error instanceof import_jsonwebtoken2.TokenExpiredError) {
          return response.status(401).json({ message: "Token expirado." });
        }
        return response.status(500).send({ message: "Internal server error.", code: 500 });
      }
    });
  }
};

// src/routes/user/routes.ts
var endpoint = (0, import_express.Router)();
var auth = new Auth();
endpoint.post("/register", (request, response) => {
  return userController.register(request, response);
});
endpoint.get("/", auth.execute, (request, response) => {
  return userController.find(request, response);
});
endpoint.put(
  "/update",
  auth.execute,
  (request, response) => {
    return userController.update(request, response);
  }
);
endpoint.post("/login", (request, response) => {
  return userController.login(request, response);
});
var routes_default = endpoint;

// src/routes/expense/routes.ts
var import_express2 = require("express");

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

// src/routes/expense/routes.ts
var endpoint2 = (0, import_express2.Router)();
var auth2 = new Auth();
endpoint2.post("/add", auth2.execute, (request, response) => {
  return expenseController.add(request, response);
});
endpoint2.get("/all", auth2.execute, (request, response) => {
  return expenseController.findMany(request, response);
});
endpoint2.put(
  "/update/:id",
  auth2.execute,
  (request, response) => {
    return expenseController.update(request, response);
  }
);
endpoint2.delete(
  "/remove/:id",
  auth2.execute,
  (request, response) => {
    return expenseController.remove(request, response);
  }
);
var routes_default2 = endpoint2;

// src/routes/refresh-token/routes.ts
var import_express3 = require("express");

// src/services/refresh-token.ts
var import_jsonwebtoken3 = require("jsonwebtoken");
var import_dotenv = require("dotenv");
(0, import_dotenv.config)();
var RefreshTokenService = class {
  constructor() {
  }
  execute(old_token) {
    return __async(this, null, function* () {
      const secret = process.env.SECRET;
      const decriptedOldToken = (0, import_jsonwebtoken3.decode)(old_token);
      const { id } = decriptedOldToken;
      const new_token = (0, import_jsonwebtoken3.sign)({ id }, secret, {
        expiresIn: "1m"
      });
      return { token: new_token };
    });
  }
};

// src/controllers/refresh-token/refresh-token.ts
var RefreshTokenController = class {
  constructor(refreshTokenUseCase) {
    this.refreshTokenUseCase = refreshTokenUseCase;
  }
  execute(request, response) {
    return __async(this, null, function* () {
      const { old_token } = request.params;
      try {
        const { token } = yield this.refreshTokenUseCase.execute(old_token);
        return response.status(200).send({ message: "Ok", code: 200, token });
      } catch (error) {
        if (error instanceof UnauthorizedError) {
          return response.status(403).send({ message: error.message, code: 403 });
        }
      }
    });
  }
};

// src/controllers/refresh-token/index.ts
var refreshTokenService = new RefreshTokenService();
var refreshTokeController = new RefreshTokenController(refreshTokenService);

// src/routes/refresh-token/routes.ts
var endpoint3 = (0, import_express3.Router)();
endpoint3.get(
  "/refresh-token/:old_token",
  (request, response) => {
    return refreshTokeController.execute(request, response);
  }
);
var routes_default3 = endpoint3;

// src/routes.ts
var routes = (0, import_express4.Router)();
routes.use("/user", routes_default);
routes.use("/expense", routes_default2);
routes.use("", routes_default3);
var routes_default4 = routes;

// src/server.ts
var app = (0, import_express5.default)();
var _a;
var PORT = (_a = process.env.PORT) != null ? _a : 3232;
app.use(import_express5.default.json());
app.use(import_express5.default.urlencoded({ extended: true }));
app.use((request, response, next) => {
  response.header("Access-Control-Allow-Origin", "*");
  response.header("Access-Control-Allow-Headers", "*");
  response.header("Access-Control-Allow-Methods", "GET,PUT,POST,DELETE");
  app.use((0, import_cors.default)());
  next();
});
app.use(routes_default4);
app.get("/", (request, response) => {
  return response.send({ message: "Welcome to financy backend. V1.0" });
});
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT} `);
});
