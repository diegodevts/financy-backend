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

// src/controllers/refresh-token/index.ts
var refresh_token_exports = {};
__export(refresh_token_exports, {
  refreshTokeController: () => refreshTokeController
});
module.exports = __toCommonJS(refresh_token_exports);

// src/services/refresh-token.ts
var import_jsonwebtoken = require("jsonwebtoken");
var import_dotenv = require("dotenv");
(0, import_dotenv.config)();
var RefreshTokenService = class {
  constructor() {
  }
  execute(old_token) {
    return __async(this, null, function* () {
      const secret = process.env.SECRET;
      const decriptedOldToken = (0, import_jsonwebtoken.decode)(old_token);
      const { id } = decriptedOldToken;
      const new_token = (0, import_jsonwebtoken.sign)({ id }, secret, {
        expiresIn: "1m"
      });
      return { token: new_token };
    });
  }
};

// src/errors/unauthorized.ts
var UnauthorizedError = class extends Error {
  constructor(message) {
    super(`Acesso n\xE3o autorizado, ${message}`);
    this.message = message;
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
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  refreshTokeController
});
