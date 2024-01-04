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

// src/middlewares/auth-middleware.ts
var auth_middleware_exports = {};
__export(auth_middleware_exports, {
  Auth: () => Auth
});
module.exports = __toCommonJS(auth_middleware_exports);
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
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  Auth
});
