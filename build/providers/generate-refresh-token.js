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

// src/providers/generate-refresh-token.ts
var generate_refresh_token_exports = {};
__export(generate_refresh_token_exports, {
  GenerateRefreshTokenProvider: () => GenerateRefreshTokenProvider
});
module.exports = __toCommonJS(generate_refresh_token_exports);
var import_dayjs = __toESM(require("dayjs"));
var import_dotenv = require("dotenv");

// src/database/prisma-client.ts
var import_client = require("@prisma/client");
var prismaClient = new import_client.PrismaClient();

// src/providers/generate-refresh-token.ts
(0, import_dotenv.config)();
var GenerateRefreshTokenProvider = class {
  constructor() {
  }
  execute(user_id) {
    return __async(this, null, function* () {
      const expiresIn = (0, import_dayjs.default)().add(1, "hour").unix();
      const hasRefreshToken = yield prismaClient.refreshToken.findFirst({
        where: { user_id }
      });
      if (hasRefreshToken) {
        yield prismaClient.refreshToken.deleteMany({ where: { user_id } });
      }
      const refreshToken = yield prismaClient.refreshToken.create({
        data: {
          user_id,
          expiresIn
        }
      });
      return refreshToken;
    });
  }
};
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  GenerateRefreshTokenProvider
});
