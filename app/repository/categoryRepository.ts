import {
  CollectionReference,
  collection,
  query,
  getDocs,
  doc,
  getDoc,
} from "firebase/firestore";
import { firebase_db } from "../../firebaseConfig";

export interface Category {
  id?: string;
  Name: string;
}

export class CategoryRepository {
  private categoriesCollection: CollectionReference = collection(
    firebase_db,
    "categories"
  );

  public async getCategories(): Promise<Category[]> {
    const q = query(this.categoriesCollection);
    const qSnapshot = await getDocs(q).catch((error) => {
      console.error("Error getting documents: ", error);
      throw new Error("Couldn't get categories!");
    });

    const categories: Category[] = [];
    qSnapshot.forEach((doc) => {
      categories.push(doc.data() as Category);
    });

    return categories;
  }

  public async getCategory(category_id: string): Promise<Category> {
    const docRef = doc(this.categoriesCollection, category_id);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      return docSnap.data() as Category;
    } else {
      throw new Error("Category not found!");
    }
  }
}
