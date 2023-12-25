"use strict";
var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
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
var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
  // If the importer is in node compatibility mode or this is not an ESM
  // file that has been converted to a CommonJS file using a Babel-
  // compatible transform (i.e. "__esModule" has not been set), then set
  // "default" to the CommonJS "module.exports" for node compatibility.
  isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
  mod
));
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

// src/database/prisma-client.ts
var import_client = require("@prisma/client");
var prismaClient = new import_client.PrismaClient();

// src/repositories/prisma/refresh-token.ts
var PrismaRefreshTokenRepository = class {
  findById(refresh_token) {
    return __async(this, null, function* () {
      const refreshToken = yield prismaClient.refreshToken.findUnique({
        where: { id: refresh_token }
      });
      return refreshToken;
    });
  }
  deleteMany(user_id) {
    return __async(this, null, function* () {
      yield prismaClient.refreshToken.deleteMany({ where: { user_id } });
    });
  }
};

// src/services/refresh-token.ts
var import_dayjs = __toESM(require("dayjs"));
var import_jsonwebtoken = require("jsonwebtoken");
var import_dotenv = require("dotenv");

// src/errors/unauthorized.ts
var UnauthorizedError = class extends Error {
  constructor(message) {
    super(`Acesso n\xE3o autorizado, ${message}`);
    this.message = message;
  }
};

// src/services/refresh-token.ts
(0, import_dotenv.config)();
var RefreshTokenService = class {
  constructor(refreshTokenRepository2) {
    this.refreshTokenRepository = refreshTokenRepository2;
  }
  execute(refresh_token) {
    return __async(this, null, function* () {
      const secret = process.env.SECRET;
      const refreshTokenCreated = yield this.refreshTokenRepository.findById(
        refresh_token
      );
      if (!refreshTokenCreated) {
        throw new UnauthorizedError("token inv\xE1lido.");
      }
      const token = (0, import_jsonwebtoken.sign)({ id: refreshTokenCreated.user_id }, secret, {
        expiresIn: "1h"
      });
      const isExpired = (0, import_dayjs.default)().isAfter(import_dayjs.default.unix(refreshTokenCreated.expiresIn));
      if (isExpired) {
        yield this.refreshTokenRepository.deleteMany(refreshTokenCreated.user_id);
        const refreshToken = (0, import_jsonwebtoken.sign)({ id: refreshTokenCreated.user_id }, secret, {
          expiresIn: "1h"
        });
        return {
          token,
          refreshToken
        };
      }
      return { token };
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
      const { id } = request.params;
      try {
        const { refreshToken, token } = yield this.refreshTokenUseCase.execute(id);
        return response.status(200).send({ message: "Ok", code: 200, refreshToken, token });
      } catch (error) {
        if (error instanceof UnauthorizedError) {
          return response.status(403).send({ message: error.message, code: 403 });
        }
      }
    });
  }
};

// src/controllers/refresh-token/index.ts
var refreshTokenRepository = new PrismaRefreshTokenRepository();
var refreshTokenService = new RefreshTokenService(refreshTokenRepository);
var refreshTokeController = new RefreshTokenController(refreshTokenService);
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  refreshTokeController
});
