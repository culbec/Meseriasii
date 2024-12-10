"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const userRepository_1 = require("../repository/userRepository");
const offersRepository_1 = require("../repository/offersRepository");
const categoryRepository_1 = require("../repository/categoryRepository");
const utils_1 = require("../utils/utils");
const authManager_1 = __importDefault(require("../auth/authManager"));
class Service {
    constructor() {
        this.userRepo = new userRepository_1.UserRepository();
        this.meseriasOffersRepo = new offersRepository_1.OffersRepository();
        this.categoryRepo = new categoryRepository_1.CategoryRepository();
        this.authManager = new authManager_1.default();
        this.loggedInUsers = new Map();
        this.log = (0, utils_1.getLogger)("Service");
    }
    /**
     * Verifies the token passed as an argument
     * through the AuthManager instance
     *
     * @param token The token to be verified
     * @returns The decoded token if the token is valid, an empty string otherwise
     */
    verifyToken(token) {
        return this.authManager.verifyToken(token);
    }
    /**
     * Logs in the user with the given username and password
     *
     * @param username The username of the user
     * @param password The password of the user
     * @returns The token if the login was successful, undefined otherwise
     */
    async login(username, password) {
        let token = undefined;
        try {
            const user = await this.userRepo.login(username, password);
            if (user) {
                token = this.authManager.generateToken(user.username);
                this.loggedInUsers.set(token, user);
            }
        }
        catch (error) {
            this.log("Error logging in", error);
        }
        return token;
    }
    /**
     * Registers the user with the given user object and password
     *
     * @param user The user object to be registered
     * @param password The password of the user
     * @returns The token if the registration was successful, undefined otherwise
     */
    async register(user, password) {
        let token = undefined;
        try {
            await this.userRepo.register(user, password);
            token = this.authManager.generateToken(user.username);
            this.loggedInUsers.set(token, user);
        }
        catch (error) {
            this.log("Error registering", error);
        }
        return token;
    }
    /**
     * Removes the user with the given token from the logged in users list
     *
     * @param token The token of the user
     * @returns True if the user was successfully logged out, false otherwise
     */
    logout(token) {
        return this.loggedInUsers.delete(token);
    }
    checkLoggedIn(token) {
        return this.loggedInUsers.has(token);
    }
    async getOffers(meserias_id) {
        try {
            if (meserias_id) {
                return this.meseriasOffersRepo.getMeseriasOffers(meserias_id);
            }
            else {
                return this.meseriasOffersRepo.getOffers();
            }
        }
        catch (error) {
            this.log("Error getting offers", error);
            throw new Error("Couldn't get offers!");
        }
    }
    async getUserById(userId) {
        try {
            return await this.userRepo.getUserById(userId);
        }
        catch (error) {
            this.log("Error getting user", error);
            throw new Error("Couldn't get user!");
        }
    }
    async getCategories() {
        return this.categoryRepo.getCategories();
    }
}
exports.default = Service;
