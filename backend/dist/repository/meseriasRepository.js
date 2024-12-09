"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MeseriasRepository = void 0;
const firestore_1 = require("firebase/firestore");
const firebaseConfig_1 = require("../utils/firebaseConfig");
class MeseriasRepository {
    constructor() {
        this.meseriasCollection = (0, firestore_1.collection)(firebaseConfig_1.db, "meseriasi");
    }
    async getMeseriasi() {
        const q = (0, firestore_1.query)(this.meseriasCollection);
        const qSnapshot = await (0, firestore_1.getDocs)(q).catch((error) => {
            console.error("Error getting documents: ", error);
            throw new Error("Couldn't get meseriasi!");
        });
        const meseriasi = [];
        qSnapshot.forEach((doc) => {
            meseriasi.push(doc.data());
        });
        return meseriasi;
    }
    async getMeserias(meserias_id) {
        const docRef = (0, firestore_1.doc)(this.meseriasCollection, meserias_id);
        const docSnapshot = await (0, firestore_1.getDoc)(docRef);
        if (docSnapshot.exists()) {
            return docSnapshot.data();
        }
        else {
            throw new Error("Meserias not found!");
        }
    }
}
exports.MeseriasRepository = MeseriasRepository;
