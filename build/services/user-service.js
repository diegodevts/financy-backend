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

// src/services/user-service.ts
var user_service_exports = {};
__export(user_service_exports, {
  UserService: () => UserService
});
module.exports = __toCommonJS(user_service_exports);
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
  constructor(repository, generateRefreshToken) {
    this.repository = repository;
    this.generateRefreshToken = generateRefreshToken;
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
        expiresIn: "1h"
      });
      const { id } = yield this.generateRefreshToken.execute(hasUser.id);
      return {
        token,
        user: hasUser.name,
        refreshTokenId: id
      };
    });
  }
  //integraçao nubank
};
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  UserService
});
