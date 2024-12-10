import {
  CollectionReference,
  DocumentReference,
  DocumentSnapshot,
  collection,
  doc,
  getDoc,
  getDocs,
  query,
  where,
} from "firebase/firestore";
import { db } from "../utils/firebaseConfig";
import { Category } from "./categoryRepository";
import { User } from "./userRepository";
import { getLogger } from "../utils/utils";

interface Offer {
  id?: string;
  meserias: User;
  category: Category;
  description: string;
  start_price: number;
}

export class OffersRepository {
  private usersCollection: CollectionReference = collection(db, "users");

  private offersCollection: CollectionReference = collection(db, "offers");
  private log = getLogger("MeseriasOffersRepository");

  public async getOffers(): Promise<Offer[]> {
    const q = query(this.offersCollection);
    const qSnapshot = await getDocs(q).catch((error) => {
      this.log("Error getting documents: ", error);
      throw new Error("Couldn't get offers!");
    });

    const offers: Offer[] = [];

    for (const doc of qSnapshot.docs) {
      const data = doc.data();

      const id = doc.id;

      const categoryRef = data.category as DocumentReference<Category>;
      const categoryDoc = await getDoc(categoryRef);
      const category = categoryDoc.data() as Category;

      const meseriasRef = data.meserias as DocumentReference<User>;
      const meseriasDoc = await getDoc(meseriasRef);
      const meserias = meseriasDoc.data() as User;

      const offer: Offer = {
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

  public async getMeseriasOffers(meseriasId: string): Promise<Offer[]> {
    const meseriasRef = doc(this.usersCollection, meseriasId);
    const meseriasDoc = await getDoc(meseriasRef).catch((error) => {
      this.log("Error getting documents: ", error);
      throw new Error("Couldn't get meserias!");
    });

    if (!meseriasDoc.exists()) {
      this.log("Meserias not found!");
      throw new Error("Meserias not found!");
    }

    const q = query(
      this.offersCollection,
      where("meserias", "==", meseriasRef)
    );
    const qSnapshot = await getDocs(q).catch((error) => {
      this.log("Error getting documents: ", error);
      throw new Error("Couldn't get offers!");
    });

    const offers: Offer[] = [];
    const { password, ...rest } = meseriasDoc.data();
    const meserias = { id: meseriasDoc.id, ...rest } as User;

    for (const doc of qSnapshot.docs) {
      const data = doc.data();

      const id = doc.id;

      const categoryRef = data.category as DocumentReference<Category>;
      const categoryDoc = await getDoc(categoryRef);
      const category = categoryDoc.data() as Category;

      const offer: Offer = {
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
}
