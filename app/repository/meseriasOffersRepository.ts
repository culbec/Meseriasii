import {
  CollectionReference,
  collection,
  doc,
  getDoc,
  getDocs,
  query,
  where,
} from "firebase/firestore";
import { firebase_db } from "../../firebaseConfig";
import { Meserias } from "./meseriasRepository";
import { Category } from "./categoryRepository";

interface MeseriasOffer {
  id?: string;
  category: Category;
  description: string;
  start_price: number;
}

interface MeseriasOffers {
  id: string;
  meserias: Meserias;
  offers: MeseriasOffer[];
}

export class MeseriasOffersRepository {
  private meseriasOffersCollection: CollectionReference = collection(
    firebase_db,
    "meseriasi_offers"
  );

  public async getMeseriasOffers(
    meserias_id: string
  ): Promise<MeseriasOffers[]> {
    const q = query(
      this.meseriasOffersCollection,
      where("meserias.user.id", "==", meserias_id)
    );
    const qSnapshot = await getDocs(q).catch((error) => {
      console.error("Error getting documents: ", error);
      throw new Error("Couldn't get meserias offers!");
    });

    const meseriasOffers: MeseriasOffers[] = [];
    qSnapshot.forEach((doc) => {
      meseriasOffers.push(doc.data() as MeseriasOffers);
    });

    return meseriasOffers;
  }
}
