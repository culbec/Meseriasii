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
exports.OffersRepository = void 0;
const firestore_1 = require("firebase/firestore");
const firebaseConfig_1 = require("../utils/firebaseConfig");
const utils_1 = require("../utils/utils");
const categoryRepository_1 = require("./categoryRepository");
class OffersRepository {
    constructor() {
        this.usersCollection = (0, firestore_1.collection)(firebaseConfig_1.db, "users");
        this.offersCollection = (0, firestore_1.collection)(firebaseConfig_1.db, "offers");
        this.log = (0, utils_1.getLogger)("MeseriasOffersRepository");
    }
    async getOffers() {
        const q = (0, firestore_1.query)(this.offersCollection);
        const qSnapshot = await (0, firestore_1.getDocs)(q).catch((error) => {
            this.log("Error getting documents: ", error);
            throw new Error("Couldn't get offers!");
        });
        const offers = [];
        for (const doc of qSnapshot.docs) {
            const data = doc.data();
            const id = doc.id;
            const categoryRef = data.category;
            const categoryDoc = await (0, firestore_1.getDoc)(categoryRef);
            const category = categoryDoc.data();
            const meseriasRef = data.meserias;
            const meseriasDoc = await (0, firestore_1.getDoc)(meseriasRef);
            const meserias = meseriasDoc.data();
            const offer = {
                id,
                meserias,
                category,
                description: data.description,
                start_price: data.start_price,
            };
            offers.push(offer);
        }
        return offers;
    }
    async getMeseriasOffers(meseriasId) {
        const meseriasRef = (0, firestore_1.doc)(this.usersCollection, meseriasId);
        const meseriasDoc = await (0, firestore_1.getDoc)(meseriasRef).catch((error) => {
            this.log("Error getting documents: ", error);
            throw new Error("Couldn't get meserias!");
        });
        if (!meseriasDoc.exists()) {
            this.log("Meserias not found!");
            throw new Error("Meserias not found!");
        }
        const q = (0, firestore_1.query)(this.offersCollection, (0, firestore_1.where)("meserias", "==", meseriasRef));
        const qSnapshot = await (0, firestore_1.getDocs)(q).catch((error) => {
            this.log("Error getting documents: ", error);
            throw new Error("Couldn't get offers!");
        });
        const offers = [];
        const _a = meseriasDoc.data(), { password } = _a, rest = __rest(_a, ["password"]);
        const meserias = Object.assign({ id: meseriasDoc.id }, rest);
        for (const doc of qSnapshot.docs) {
            const data = doc.data();
            const id = doc.id;
            const categoryRef = data.category;
            const categoryDoc = await (0, firestore_1.getDoc)(categoryRef);
            const category = categoryDoc.data();
            const offer = {
                id,
                meserias,
                category,
                description: data.description,
                start_price: data.start_price,
            };
            offers.push(offer);
        }
        return offers;
    }
    async getOffersByCategoryName(categoryName) {
        try {
            // Step 1: Use CategoryRepository to get all categories
            const categoryRepository = new categoryRepository_1.CategoryRepository();
            const categories = await categoryRepository.getCategories();
            if (!categories || categories.length === 0) {
                this.log("No categories available!");
                throw new Error("No categories found!");
            }
            // Find the category by name
            const category = categories.find((cat) => cat.Name === categoryName);
            if (!category) {
                this.log(`Category with name "${categoryName}" not found!`);
                throw new Error("Category not found!");
            }
            // Get the Firestore reference to the category 
            const categoryRef = (0, firestore_1.doc)((0, firestore_1.collection)(firebaseConfig_1.db, "categories"), category.id);
            // Step 2: Query offers that reference the category
            const offersQuery = (0, firestore_1.query)(this.offersCollection, (0, firestore_1.where)("category", "==", categoryRef));
            const offersSnapshot = await (0, firestore_1.getDocs)(offersQuery).catch((error) => {
                this.log("Error fetching offers: ", error);
                throw new Error("Couldn't fetch offers!");
            });
            if (offersSnapshot.empty) {
                this.log(`No offers found for category "${categoryName}"!`);
                return [];
            }
            // Step 3: Prepare the result
            const offers = [];
            for (const offerDoc of offersSnapshot.docs) {
                const offerData = offerDoc.data();
                const id = offerDoc.id;
                const meseriasRef = offerData.meserias;
                const meseriasDoc = await (0, firestore_1.getDoc)(meseriasRef).catch((error) => {
                    this.log("Error fetching meserias: ", error);
                    throw new Error("Couldn't fetch meserias!");
                });
                // Ensure meserias exists, otherwise throw an error
                if (!meseriasDoc.exists()) {
                    this.log(`Meserias not found for reference: ${meseriasRef.path}`);
                    throw new Error("Meserias not found!");
                }
                // Construct the meserias object with proper typing
                const meserias = Object.assign({ id: meseriasDoc.id }, meseriasDoc.data());
                const offer = {
                    id,
                    meserias,
                    category,
                    description: offerData.description,
                    start_price: offerData.start_price,
                };
                offers.push(offer);
            }
            return offers;
        }
        catch (error) {
            this.log("Error in getOffersByCategoryName: ", error);
            throw error;
        }
    }
}
exports.OffersRepository = OffersRepository;
