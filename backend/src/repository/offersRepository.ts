import {
  CollectionReference,
  DocumentReference,
  DocumentSnapshot,
  collection,
  getDoc,
  getDocs,
  query,
} from "firebase/firestore";
import { db } from "../utils/firebaseConfig";
import { Category } from "./categoryRepository";
import { User } from "./userRepository";
import { getLogger } from "../utils/utils";

interface Offer {
  category: Category;
  description: string;
  start_price: number;
}

interface Offers {
  id?: string;
  meserias: User;
  offers: Offer[];
}

export class OffersRepository {
  private offersCollection: CollectionReference = collection(
    db,
    "meseriasi_offers"
  );
  private log = getLogger("MeseriasOffersRepository");

  public async getOffers(): Promise<Offers[]> {
    const q = query(this.offersCollection);
    const qSnapshot = await getDocs(q).catch((error) => {
      this.log("Error getting documents: ", error);
      throw new Error("Couldn't get meseriasi offers!");
    });

    const meseriasiOffers: Offers[] = [];

    for (const doc of qSnapshot.docs) {
      const data = doc.data();

      const id = doc.id;

      const meseriasRef = data.meserias as DocumentReference<User>;
      const meseriasDoc = await getDoc(meseriasRef);
      const meseriasData = meseriasDoc.data() as User;

      const meserias: User = {
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

      const offers = await Promise.all(
        data.offers.map(async (offer: any) => {
          const categoryRef = offer.category as DocumentReference<Category>;
          const categoryDoc = await getDoc(categoryRef);
          const category = categoryDoc.data() as Category;

          return {
            category,
            description: offer.description,
            start_price: offer.start_price,
          };
        })
      );

      const meseriasOffers: Offers = {
        id,
        meserias,
        offers,
      };

      meseriasiOffers.push(meseriasOffers);
    }

    return meseriasiOffers;
  }
}
