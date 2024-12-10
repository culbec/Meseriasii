"use strict";
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserRepository = void 0;
const firestore_1 = require("firebase/firestore");
const firebaseConfig_1 = require("../utils/firebaseConfig");
const bcrypt_ts_1 = require("bcrypt-ts");
const utils_1 = require("../utils/utils");
const saltRounds = 10;
class UserRepository {
    constructor() {
        this.usersCollection = (0, firestore_1.collection)(firebaseConfig_1.db, "users");
        this.log = (0, utils_1.getLogger)("UserRepository");
    }
    /**
     * Checks if the user exists in the Firestore database
     *
     * @param username The username of the user
     * @param password The password of the user
     * @returns The user if the login was successful, undefined otherwise
     */
    async login(username, password) {
        const q = (0, firestore_1.query)(this.usersCollection, (0, firestore_1.where)("username", "==", username));
        const qSnapshot = await (0, firestore_1.getDocs)(q).catch((error) => {
            console.error("Error getting documents: ", error);
            throw new Error("Couldn't login!");
        });
        if (qSnapshot.docs.length === 0) {
            this.log(`User with username ${username} not found`);
            return undefined;
        }
        const userDoc = qSnapshot.docs[0];
        const user = userDoc.data();
        user.id = userDoc.id;
        // retrieve the salt from the password
        // and rehash the password with that salt
        const passwordSalt = (0, bcrypt_ts_1.getSalt)(user.password);
        const passwordHash = await (0, bcrypt_ts_1.hash)(password, passwordSalt);
        // compare the password hashes
        const isPasswordValid = await (0, bcrypt_ts_1.compare)(password, passwordHash);
        return isPasswordValid ? user : undefined;
    }
    /**
     * Registers the user into the Firestore database
     * The user is assigned the id field from the Firestore database
     *
     * @param user The user to be registered
     * @param password The password of the user
     * @throws Error if the user couldn't be registered
     */
    async register(user, password) {
        const salt = await (0, bcrypt_ts_1.genSalt)(saltRounds);
        const hashedPassword = await (0, bcrypt_ts_1.hash)(password, salt);
        user.date = new Date().toUTCString();
        user.version = 1;
        const userPrivate = Object.assign(Object.assign({}, user), { password: hashedPassword });
        const result = await (0, firestore_1.addDoc)(this.usersCollection, userPrivate).catch((error) => {
            this.log("Error adding document: ", error);
            throw new Error("Couldn't register!");
        });
        this.log("Document written with ID: ", result.id);
        user.id = result.id;
        return Promise.resolve();
    }
    /**
     * Returns a user object from the Firestore database
     * @param userId The id of the user
     * @returns The user object
     * @throws Error if the user is not found
     */
    async getUserById(userId) {
        const userRef = (0, firestore_1.doc)(this.usersCollection, userId);
        const userDoc = await (0, firestore_1.getDoc)(userRef).catch((error) => {
            this.log("Error getting documents: ", error);
            throw new Error("Couldn't get user!");
        });
        if (!userDoc.exists()) {
            this.log(`User with id ${userId} not found`);
            throw new Error("User not found!");
        }
        const _a = userDoc.data(), { password } = _a, user = __rest(_a, ["password"]);
        return Object.assign({ id: userDoc.id }, user);
    }
}
exports.UserRepository = UserRepository;
