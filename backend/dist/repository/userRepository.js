"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserRepository = void 0;
const firestore_1 = require("firebase/firestore");
const firebaseConfig_1 = require("../utils/firebaseConfig");
// import { compare, genSalt, getSalt, hash } from "bcrypt-ts";
let bcrypt_ts;
const utils_1 = require("../utils/utils");
const saltLength = 32;
const log = (0, utils_1.getLogger)("UserRepository");
class UserRepository {
    constructor() {
        this.usersCollection = (0, firestore_1.collection)(firebaseConfig_1.db, "users");
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
            log(`User with username ${username} not found`);
            return undefined;
        }
        const userDoc = qSnapshot.docs[0];
        const user = userDoc.data();
        user.id = userDoc.id;
        log("user", user);
        // if (!bcrypt_ts) {
        //   bcrypt_ts = await import('bcrypt-ts');
        // }
        // retrieve the salt from the password
        // and rehash the password with that salt
        const passwordSalt = bcrypt_ts.getSalt(user.password);
        const passwordHash = await bcrypt_ts.hash(password, passwordSalt);
        // compare the password hashes
        const isPasswordValid = await bcrypt_ts.compare(password, passwordHash);
        return isPasswordValid ? user : undefined;
    }
    /**
     * Registers the user into the Firestore database
     * The user is assigned the id field from the Firestore database
     *
     * @param user The user to be registered
     * @param password The password of the user
     */
    async register(user, password) {
        const salt = await bcrypt_ts.genSalt(saltLength);
        const hashedPassword = await bcrypt_ts.hash(password, salt);
        const result = await (0, firestore_1.addDoc)(this.usersCollection, {
            user,
            userPassword: hashedPassword,
        }).catch((error) => {
            log("Error adding document: ", error);
            throw new Error("Couldn't register!");
        });
        log("Document written with ID: ", result.id);
        user.id = result.id;
    }
}
exports.UserRepository = UserRepository;
