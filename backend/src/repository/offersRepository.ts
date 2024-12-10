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
import { CategoryRepository } from "./categoryRepository";

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

  public async getOffersByCategoryName(categoryName: string): Promise<Offer[]> {
    try {
      // Step 1: Use CategoryRepository to get all categories
      const categoryRepository = new CategoryRepository();
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
      const categoryRef = doc(collection(db, "categories"), category.id);
      // Step 2: Query offers that reference the category
      const offersQuery = query(
        this.offersCollection,
        where("category", "==", categoryRef)
      );

      const offersSnapshot = await getDocs(offersQuery).catch((error) => {
        this.log("Error fetching offers: ", error);
        throw new Error("Couldn't fetch offers!");
      });

      if (offersSnapshot.empty) {
        this.log(`No offers found for category "${categoryName}"!`);
        return [];
      }

      // Step 3: Prepare the result
      const offers: Offer[] = [];
      for (const offerDoc of offersSnapshot.docs) {
        const offerData = offerDoc.data();
        const id = offerDoc.id;
        const meseriasRef = offerData.meserias as DocumentReference;
        const meseriasDoc = await getDoc(meseriasRef).catch((error) => {
          this.log("Error fetching meserias: ", error);
          throw new Error("Couldn't fetch meserias!");
        });

        // Ensure meserias exists, otherwise throw an error
        if (!meseriasDoc.exists()) {
          this.log(`Meserias not found for reference: ${meseriasRef.path}`);
          throw new Error("Meserias not found!");
        }

        // Construct the meserias object with proper typing
        const meserias = { id: meseriasDoc.id, ...(meseriasDoc.data() as User) };
        

        const offer: Offer = {
          id,
          meserias,
          category,
          description: offerData.description,
          start_price: offerData.start_price,
        };

        offers.push(offer);
      }

      return offers;
    } catch (error) {
      this.log("Error in getOffersByCategoryName: ", error);
      throw error;
    }
  }
}
