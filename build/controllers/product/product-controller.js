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

// src/controllers/product/product-controller.ts
var product_controller_exports = {};
__export(product_controller_exports, {
  ProductController: () => ProductController
});
module.exports = __toCommonJS(product_controller_exports);

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
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  ProductController
});
