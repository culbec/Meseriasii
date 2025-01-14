import Application from "koa";
import Router from "koa-router";

import KoaLogger from "koa-logger";
import json from "koa-json";
import CoBody from "co-body";

import Service from "./service/service";
import { createAuthMiddleware } from "./auth/authMiddleware";
import { getLogger } from "./utils/utils";
import { OfferRequest } from "./repository/offersRepository";

const app = new Application();
const router = new Router();

const service = new Service();
const log = getLogger("Server");

async function startServer() {
  const authMiddleware = await createAuthMiddleware(service);

  log("Setting up routes\n");

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

    const {token, user} = await service.login(username, password);

    if (!token) {
      ctx.status = 404;
      ctx.body = { message: "Invalid username or password" };
      return;
    }

    ctx.status = 200;
    ctx.body = { token: token, user: user };
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
  log("Setup auth routes\n");

  log("Setting up protected routes\n");

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

  log("Setup logout route\n");

  log("Setting up get user by id route");
  router.get("/users/:id", authMiddleware, async (ctx) => {
    const id = ctx.params.id;

    if (typeof id !== "string") {
      ctx.status = 400;
      ctx.body = { message: "Invalid request" };
      return;
    }

    try {
      const user = await service.getUserById(id);

      ctx.status = 200;
      ctx.body = { user };
    } catch (error) {
      log("Error getting user", error);
      ctx.status = 404;
      ctx.body = { message: "Could not get user! Please try again later." };
    }
  });
  log("Setup get user by id route\n");

  log("Setting up update user route");
  router.post("/users/update", authMiddleware, async (ctx) => {
    const body = await CoBody.json(ctx);
    const user = body;

    if (typeof user !== "object") {
      ctx.status = 400;
      ctx.body = { message: "Invalid request" };
      return;
    }

    try {
      const newUser = await service.updateUser(user);

      ctx.status = 200;
      ctx.body = { user: newUser };
    } catch (error) {
      log("Error updating user", error);
      ctx.status = 400;
      ctx.body = { message: "Could not update user! Please try again later." };
    }
  });
  log("Setup update user route\n");

  log("Setting up change password route");
  router.post("/auth/change-password", authMiddleware, async (ctx) => {
    const body = await CoBody.json(ctx);
    const { userId, oldPassword, newPassword } = body;

    if (
      typeof userId !== "string" ||
      typeof oldPassword !== "string" ||
      typeof newPassword !== "string"
    ) {
      ctx.status = 400;
      ctx.body = { message: "Invalid request" };
      return;
    }

    try {
      await service.changePassword(userId, oldPassword, newPassword);

      ctx.status = 200;
      ctx.body = { message: "Password changed" };
    } catch (error) {
      log("Error changing password", error);
      ctx.status = 400;
      ctx.body = {
        message: "Could not change password! Please try again later.",
      };
    }
  });
  log("Setup change password route\n");

  log("Setting up meserias offers route");
  router.get("/offers/meserias/:id", authMiddleware, async (ctx) => {
    const meserias_id = ctx.params.id;

    if (typeof meserias_id !== "string") {
      ctx.status = 400;
      ctx.body = { message: "Invalid request" };
      return;
    }

    try {
      const offers = await service.getOffers(meserias_id);

      ctx.status = 200;
      ctx.body = { offers };
    } catch (error) {
      ctx.status = 404;
      ctx.body = { message: "Could not get offers! Please try again later." };
    }
  });
  log("Setup get meserias offers route\n");

  log("Setting up add offer route");
  router.post("/offers", authMiddleware, async (ctx) => {
    const body = await CoBody.json(ctx);
    const offer = body;

    if (typeof offer !== "object") {
      ctx.status = 400;
      ctx.body = { message: "Invalid request" };
      return;
    }

    try {
      await service.addOffer(offer as OfferRequest);

      ctx.status = 200;
      ctx.body = { message: "Offer added" };
    } catch (error) {
      log("Error adding offer", error);
      ctx.status = 400;
      ctx.body = { message: "Could not add offer! Please try again later." };
    }
  });
  log("Setup add offer route\n");

  log("Setting up categories route");
  router.get("/categories", async (ctx) => {
    const categories = await service.getCategories();
    log("categories", categories);

    if (!categories) {
      ctx.status = 404;
      ctx.body = {
        message: "Could not get categories! Please try again later.",
      };
      return;
    }

    ctx.status = 200;
    ctx.body = { categories };
  });
  log("Setup categories route\n");

  router.get("/reviews", async (ctx) => {
    log("GET /reviews called"); // Add this log
    try {
      const reviews = await service.getReviews();
      log("reviews", reviews);

      if (!reviews || reviews.length === 0) {
        ctx.status = 404;
        ctx.body = { message: "No reviews found!" };
        return;
      }

      ctx.status = 200;
      ctx.body = { reviews };
    } catch (error) {
      log("Error fetching reviews:", error);
      ctx.status = 500;
      ctx.body = { message: "Could not fetch reviews! Please try again later." };
    }
  });

  router.get("/reviews/stars/:starCount", async (ctx) => {
    const { starCount } = ctx.params;

    if (!starCount || isNaN(Number(starCount)) || Number(starCount) < 1 || Number(starCount) > 5) {
      ctx.status = 400;
      ctx.body = { message: "Star count must be between 1 and 5." };
      return;
    }

    try {
      const reviews = await service.getReviewsByStarCount(Number(starCount));
      log(`reviews with ${starCount} stars`, reviews);

      if (!reviews || reviews.length === 0) {
        ctx.status = 404;
        ctx.body = { message: `No reviews found with ${starCount} stars.` };
        return;
      }

      ctx.status = 200;
      ctx.body = { reviews };
    } catch (error) {
      log("Error fetching reviews by star count:", error);
      ctx.status = 500;
      ctx.body = { message: "Could not fetch reviews! Please try again later." };
    }
  });

// Add a review
  router.post("/reviews", async (ctx) => {
    const body = await CoBody.json(ctx);
    const { meserias, stars, text, user } = body;

    if (!meserias || !user || typeof stars !== "number" || !text) {
      ctx.status = 400;
      ctx.body = { message: "Invalid request. All fields are required." };
      return;
    }

    try {
      const review = { meserias, stars, text, user };
      const reviewId = await service.addReview(review);
      log("Added review with ID:", reviewId);

      ctx.status = 201;
      ctx.body = { message: "Review added successfully!", id: reviewId };
    } catch (error) {
      log("Error adding review:", error);
      ctx.status = 500;
      ctx.body = { message: "Could not add the review! Please try again later." };
    }
  });

  log("Setup review routes");

  app.use(KoaLogger());
  app.use(json());

  app.use(router.routes()).use(router.allowedMethods());
  app.listen(3000, () => {
    log("Server running on port 3000");
  });
}

startServer();
