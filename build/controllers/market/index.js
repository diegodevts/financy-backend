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

// src/controllers/market/index.ts
var market_exports = {};
__export(market_exports, {
  marketController: () => marketController
});
module.exports = __toCommonJS(market_exports);

// src/database/prisma-client.ts
var import_client = require("@prisma/client");
var prismaClient = new import_client.PrismaClient();

// src/errors/not-found.ts
var NotFoundError = class extends Error {
  constructor(message) {
    super(`${message} n\xE3o encontrado.`);
    this.message = message;
  }
};

// src/repositories/prisma/market.ts
var MarketPrismaRepository = class {
  add(data) {
    return __async(this, null, function* () {
      const market = yield prismaClient.market.create({ data });
      return market;
    });
  }
  findMany() {
    return __async(this, null, function* () {
      const markets = yield prismaClient.market.findMany();
      return markets;
    });
  }
  update(data, id) {
    return __async(this, null, function* () {
      const hasMarket = yield prismaClient.market.findUnique({ where: { id } });
      if (!hasMarket) {
        throw new NotFoundError("Mercado");
      }
      const market = yield prismaClient.market.update({
        where: { id },
        data
      });
      return market;
    });
  }
  remove(id) {
    return __async(this, null, function* () {
      yield prismaClient.market.delete({ where: { id } });
    });
  }
  find(id) {
    return __async(this, null, function* () {
      const market = yield prismaClient.market.findUnique({ where: { id } });
      return market;
    });
  }
};

// src/services/market-service.ts
var MarketService = class {
  constructor(repository) {
    this.repository = repository;
  }
  add(data) {
    return __async(this, null, function* () {
      const market = yield this.repository.add(data);
      return { market };
    });
  }
  findMany() {
    return __async(this, null, function* () {
      const MarketRepositorys = yield this.repository.findMany();
      return MarketRepositorys;
    });
  }
  update(data, id) {
    return __async(this, null, function* () {
      const updatedMarket = yield this.repository.update(data, id);
      return updatedMarket;
    });
  }
};

// src/controllers/market/market-controller.ts
var MarketController = class {
  constructor(service) {
    this.service = service;
  }
  add(request, response) {
    return __async(this, null, function* () {
      try {
        const { name, description, latitude, longitude } = request.body;
        const { market } = yield this.service.add({
          name,
          description,
          latitude,
          longitude
        });
        return response.status(201).send({ message: "Mercado adicionado com sucesso!", market });
      } catch (error) {
        console.log(error);
        return response.status(500).send({ message: "Internal server error" });
      }
    });
  }
  findMany(request, response) {
    return __async(this, null, function* () {
      try {
        const markets = yield this.service.findMany();
        return response.send({ markets });
      } catch (error) {
        if (error instanceof NotFoundError) {
          return response.status(401).send({ message: error.message });
        }
        return response.status(500).send({ message: "Internal server error", error });
      }
    });
  }
  update(request, response) {
    return __async(this, null, function* () {
      try {
        const { id } = request.params;
        const data = request.body;
        yield this.service.update(data, id);
        return response.send({ message: "Mercado atualizado com sucesso!" });
      } catch (error) {
        if (error instanceof NotFoundError) {
          return response.status(401).send({ message: error.message });
        }
        return response.status(500).send({ message: "Internal server error" });
      }
    });
  }
};

// src/controllers/market/index.ts
var marketRepository = new MarketPrismaRepository();
var marketService = new MarketService(marketRepository);
var marketController = new MarketController(marketService);
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  marketController
});
