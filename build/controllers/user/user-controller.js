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

// src/controllers/user/user-controller.ts
var user_controller_exports = {};
__export(user_controller_exports, {
  UserController: () => UserController
});
module.exports = __toCommonJS(user_controller_exports);

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
        const { name } = yield this.service.find(id);
        return response.send({ message: "Ok!", name });
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
          token,
          user
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
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  UserController
});
