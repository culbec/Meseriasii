"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MeseriasOffersRepository = void 0;
const firestore_1 = require("firebase/firestore");
const firebaseConfig_1 = require("../utils/firebaseConfig");
const utils_1 = require("../utils/utils");
class MeseriasOffersRepository {
    constructor() {
        this.meseriasOffersCollection = (0, firestore_1.collection)(firebaseConfig_1.db, "meseriasi_offers");
        this.log = (0, utils_1.getLogger)("MeseriasOffersRepository");
    }
    async getOffers() {
        const q = (0, firestore_1.query)(this.meseriasOffersCollection);
        const qSnapshot = await (0, firestore_1.getDocs)(q).catch((error) => {
            this.log("Error getting documents: ", error);
            throw new Error("Couldn't get meseriasi offers!");
        });
        const meseriasiOffers = [];
        for (const doc of qSnapshot.docs) {
            const data = doc.data();
            const meseriasOffers = {
                id: doc.id,
                meserias: data.meserias.data(),
                offers: await Promise.all(data.offers.map(async (offer) => {
                    return {
                        category: offer.data().category,
                        description: offer.data().description,
                        start_price: offer.data().start_price,
                    };
                })),
            };
            this.log("meseriasOffers", meseriasOffers);
            meseriasiOffers.push(meseriasOffers);
        }
        return meseriasiOffers;
    }
}
exports.MeseriasOffersRepository = MeseriasOffersRepository;
