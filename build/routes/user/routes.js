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

// src/routes/user/routes.ts
var routes_exports = {};
__export(routes_exports, {
  default: () => routes_default
});
module.exports = __toCommonJS(routes_exports);
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
