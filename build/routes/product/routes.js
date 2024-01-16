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

// src/routes/product/routes.ts
var routes_exports = {};
__export(routes_exports, {
  default: () => routes_default
});
module.exports = __toCommonJS(routes_exports);
var import_express = require("express");

// src/middlewares/auth-middleware.ts
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
  addMany(data) {
    return __async(this, null, function* () {
      yield prismaClient.product.createMany({ data });
    });
  }
};

// src/services/product-service.ts
var ProductService = class {
  constructor(repository) {
    this.repository = repository;
  }
  addOrUpdate(data) {
    return __async(this, null, function* () {
      const { product, hasProduct } = yield this.repository.addOrUpdate(data);
      return { product, hasProduct };
    });
  }
  findMany(market_id) {
    return __async(this, null, function* () {
      const products = yield this.repository.findMany(market_id);
      return products;
    });
  }
  addMany(data, market_id) {
    return __async(this, null, function* () {
      const products = data.map(
        (product) => Object.assign(product, { market_id })
      );
      yield this.repository.addMany(products);
    });
  }
};

// src/errors/not-found.ts
var NotFoundError = class extends Error {
  constructor(message) {
    super(`${message} n\xE3o encontrado.`);
    this.message = message;
  }
};

// src/controllers/product/product-controller.ts
var ProductController = class {
  constructor(service) {
    this.service = service;
  }
  addOrUpdate(request, response) {
    return __async(this, null, function* () {
      try {
        const { name, price, market_id } = request.body;
        const { product, hasProduct } = yield this.service.addOrUpdate({
          name,
          price,
          market_id
        });
        return response.status(201).send({
          message: `Produto ${hasProduct ? "atualizado" : "adicionado"} com sucesso!`,
          product
        });
      } catch (error) {
        return response.status(500).send({ message: "Internal server error" });
      }
    });
  }
  findMany(request, response) {
    return __async(this, null, function* () {
      try {
        const { market_id } = request.params;
        const products = yield this.service.findMany(market_id);
        return response.send({ products });
      } catch (error) {
        if (error instanceof NotFoundError) {
          return response.status(401).send({ message: error.message });
        }
        return response.status(500).send({ message: "Internal server error", error });
      }
    });
  }
  addMany(request, response) {
    return __async(this, null, function* () {
      try {
        const data = request.body;
        const { market_id } = request.params;
        delete data.user_id;
        yield this.service.addMany(data, market_id);
        return response.status(201).send({
          message: "Produtos adicionados com sucesso!"
        });
      } catch (error) {
        console.log(error);
        return response.status(500).send({ message: "Internal server error" });
      }
    });
  }
};

// src/controllers/product/index.ts
var productRepository = new ProductPrismaRepository();
var productService = new ProductService(productRepository);
var productController = new ProductController(productService);

// src/routes/product/routes.ts
var endpoint = (0, import_express.Router)();
var auth = new Auth();
endpoint.post("/add", auth.execute, (request, response) => {
  return productController.addOrUpdate(request, response);
});
endpoint.post(
  "/add/many/:market_id",
  auth.execute,
  (request, response) => {
    return productController.addMany(request, response);
  }
);
endpoint.get(
  "/all/:market_id",
  auth.execute,
  (request, response) => {
    return productController.findMany(request, response);
  }
);
var routes_default = endpoint;
