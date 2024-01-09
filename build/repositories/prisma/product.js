"use strict";
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getOwnPropSymbols = Object.getOwnPropertySymbols;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __propIsEnum = Object.prototype.propertyIsEnumerable;
var __defNormalProp = (obj, key, value) => key in obj ? __defProp(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
var __spreadValues = (a, b) => {
  for (var prop in b || (b = {}))
    if (__hasOwnProp.call(b, prop))
      __defNormalProp(a, prop, b[prop]);
  if (__getOwnPropSymbols)
    for (var prop of __getOwnPropSymbols(b)) {
      if (__propIsEnum.call(b, prop))
        __defNormalProp(a, prop, b[prop]);
    }
  return a;
};
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

// src/repositories/prisma/product.ts
var product_exports = {};
__export(product_exports, {
  ProductPrismaRepository: () => ProductPrismaRepository
});
module.exports = __toCommonJS(product_exports);

// src/database/prisma-client.ts
var import_client = require("@prisma/client");
var prismaClient = new import_client.PrismaClient();

// src/repositories/prisma/product.ts
var ProductPrismaRepository = class {
  addOrUpdate(data) {
    return __async(this, null, function* () {
      const hasProduct = yield prismaClient.product.findFirst({
        where: { market_id: data.market_id, name: data.name }
      });
      const product = yield prismaClient.product.upsert({
        where: { market_id: data.market_id, id: hasProduct ? hasProduct.id : 0 },
        create: __spreadValues({}, data),
        update: __spreadValues({}, data)
      });
      return { product, hasProduct };
    });
  }
  findMany(market_id) {
    return __async(this, null, function* () {
      const products = yield prismaClient.product.findMany({
        where: { market_id }
      });
      return products;
    });
  }
  remove(id) {
    return __async(this, null, function* () {
      yield prismaClient.product.delete({ where: { id } });
    });
  }
  find(id) {
    return __async(this, null, function* () {
      const product = yield prismaClient.product.findUnique({ where: { id } });
      return product;
    });
  }
};
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  ProductPrismaRepository
});
