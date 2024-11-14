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
  category: Category; // Reference to category
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
  ): Promise<MeseriasOffer[]> {
    // Query to get offers for a specific meserias
    const q = query(
      this.meseriasOffersCollection,
      where("meserias", "==", doc(firebase_db, "meseriasi", meserias_id))
    );

    const qSnapshot = await getDocs(q).catch((error) => {
      console.error("Error getting documents: ", error);
      throw new Error("Couldn't get meserias offers!");
    });

    const meseriasOffers: MeseriasOffer[] = [];
    qSnapshot.forEach((docSnap) => {
      const data = docSnap.data(); // Get the data for this offer
      const offersArray = data.offers; // This is the array of offers

      // Loop through each offer and process it
      if (Array.isArray(offersArray)) {
        offersArray.forEach((offer) => {
          const categoryRef = offer.category; // Category reference

          // Resolve the category reference
          if (categoryRef) {
            getDoc(categoryRef).then((categorySnapshot) => {
              if (categorySnapshot.exists()) {
                offer.category = categorySnapshot.data() as Category;
              }
            });
          }

          meseriasOffers.push(offer);
        });
      }
    });

    return meseriasOffers;
  }
}