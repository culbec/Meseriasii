import Application from "koa";
import Router from "koa-router";

import KoaLogger from "koa-logger";
import json from "koa-json";
import CoBody from "co-body";

import Service from "./service/service";
import { createAuthMiddleware } from "./auth/authMiddleware";
import { getLogger } from "./utils/utils";

const app = new Application();
const router = new Router();

const service = new Service();
const log = getLogger("Server");

async function startServer() {
  const authMiddleware = await createAuthMiddleware(service);

  log("Setting up routes");

  log("Setting up test route");
  // Test route
  router.get("/", async (ctx) => {
    ctx.body = { message: "Hello, World!" };
  });
  log("Setup up test route");

  log("Setting up auth routes");
  // Login route
  router.post("/auth/login", async (ctx) => {
    const body = await CoBody.json(ctx);
    const { username, password } = body;

    // Process username and password so that they are strings
    // and not undefined
    if (typeof username !== "string" || typeof password !== "string") {
      ctx.status = 400;
      ctx.body = { message: "Invalid request" };
      return;
    }

    // Check if the user is possibly already logged in
    if (ctx.state.token) {
      // Verify token
      const decodedToken = service.verifyToken(ctx.state.token);
      if (typeof decodedToken === "string") {
        ctx.status = 401;
        ctx.body = { message: "Unauthorized" };
        return;
      }
    }

    const result = await service.login(username, password);

    if (!result) {
      ctx.status = 404;
      ctx.body = { message: "Invalid username or password" };
      return;
    }

    log("token", result);

    ctx.status = 200;
    ctx.body = { token: result };
  });

  // Register route
  router.post("/auth/register", async (ctx) => {
    const body = await CoBody.json(ctx);
    console.log("body", body);
    const { user, password } = body;

    // Process username and password so that they are strings
    // and not undefined
    if (typeof user !== "object" || typeof password !== "string") {
      ctx.status = 400;
      ctx.body = { message: "Invalid request" };
      return;
    }

    const result = await service.register(user, password);

    if (!result) {
      ctx.status = 404;
      ctx.body = { message: "Could not register! Please try again later." };
      return;
    }

    ctx.status = 200;
    ctx.body = { token: result };
  });
  log("Setup auth routes");

  log("Setting up protected routes");

  log("Setting up protected test route");
  // Protected test route
  router.get("/protected", authMiddleware, async (ctx) => {
    ctx.body = { message: "Protected route" };
  });
  log("Setup protected test route");

  log("Setting up logout route");
  // Logout route
  router.get("/auth/logout", authMiddleware, async (ctx) => {
    const token = ctx.state.token;

    if (!token) {
      ctx.status = 401;
      ctx.body = { message: "Unauthorized" };
      return;
    }

    const result = service.logout(token);

    if (!result) {
      ctx.status = 400;
      ctx.body = { message: "Could not logout! Please try again later." };
      return;
    }

    ctx.status = 200;
    ctx.body = { message: "Logged out" };
  });

  log("Setup logout route");

  log("Setting up offer route");
  router.get("/offers", async (ctx) => {
    const offers = await service.getOffers();
    log("offers", offers);

    if (!offers) {
      ctx.status = 404;
      ctx.body = { message: "Could not get offers! Please try again later." };
      return;
    }

    ctx.status = 200;
    ctx.body = { offers };
  });
  log("Setup get offers route");

  router.get("/categories", async (ctx) => {
    const categories = await service.getCategories();
    log("categories", categories);

    if (!categories) {
      ctx.status = 404;
      ctx.body = { message: "Could not get categories! Please try again later." };
      return;
    }

    ctx.status = 200;
    ctx.body = { categories };
  });




  app.use(KoaLogger());
  app.use(json());

  app.use(router.routes()).use(router.allowedMethods());
  app.listen(3000, () => {
    log("Server running on port 3000");
  });
}

startServer();
