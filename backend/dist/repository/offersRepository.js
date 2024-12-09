"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.OffersRepository = void 0;
const firestore_1 = require("firebase/firestore");
const firebaseConfig_1 = require("../utils/firebaseConfig");
const utils_1 = require("../utils/utils");
class OffersRepository {
    constructor() {
        this.offersCollection = (0, firestore_1.collection)(firebaseConfig_1.db, "meseriasi_offers");
        this.log = (0, utils_1.getLogger)("MeseriasOffersRepository");
    }
    async getOffers() {
        const q = (0, firestore_1.query)(this.offersCollection);
        const qSnapshot = await (0, firestore_1.getDocs)(q).catch((error) => {
            this.log("Error getting documents: ", error);
            throw new Error("Couldn't get meseriasi offers!");
        });
        const meseriasiOffers = [];
        for (const doc of qSnapshot.docs) {
            const data = doc.data();
            const id = doc.id;
            const meseriasRef = data.meserias;
            const meseriasDoc = await (0, firestore_1.getDoc)(meseriasRef);
            const meseriasData = meseriasDoc.data();
            const meserias = {
                id: meseriasDoc.id,
                username: meseriasData.username,
                type: meseriasData.type,
                first_name: meseriasData.first_name,
                last_name: meseriasData.last_name,
                phone_number: meseriasData.phone_number,
                address: meseriasData.address,
                date: meseriasData.date,
                version: meseriasData.version,
            };
            const offers = await Promise.all(data.offers.map(async (offer) => {
                const categoryRef = offer.category;
                const categoryDoc = await (0, firestore_1.getDoc)(categoryRef);
                const category = categoryDoc.data();
                return {
                    category,
                    description: offer.description,
                    start_price: offer.start_price,
                };
            }));
            const meseriasOffers = {
                id,
                meserias,
                offers,
            };
            meseriasiOffers.push(meseriasOffers);
        }
        return meseriasiOffers;
    }
}
exports.OffersRepository = OffersRepository;
