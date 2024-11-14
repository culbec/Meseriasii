import {
  collection,
  CollectionReference,
  doc,
  DocumentReference,
  getDoc,
  getDocs,
  query,
} from "firebase/firestore";
import { firebase_db } from "../../firebaseConfig";
import { User } from "./userRepository";

export interface Meserias {
  id?: string;
  user: DocumentReference;
}

export class MeseriasRepository {
  private meseriasCollection: CollectionReference = collection(
    firebase_db,
    "meseriasi"
  );

  public async getMeseriasi(): Promise<Meserias[]> {
    const q = query(this.meseriasCollection);
    const qSnapshot = await getDocs(q).catch((error) => {
      console.error("Error getting documents: ", error);
      throw new Error("Couldn't get meseriasi!");
    });

    const meseriasi: Meserias[] = [];
    qSnapshot.forEach((doc) => {
      meseriasi.push({ ...doc.data(), id: doc.id } as Meserias);
    });

    return meseriasi;
  }

  public async getMeserias(meserias_id: string): Promise<Meserias & { userDetails: User }> {
    const docRef = doc(this.meseriasCollection, meserias_id);
    const docSnapshot = await getDoc(docRef);

    if (!docSnapshot.exists()) {
      throw new Error("Meserias not found!");
    }

    const meseriasData = docSnapshot.data() as Meserias;

    // Preia detaliile utilizatorului folosind referința user
    const userSnapshot = await getDoc(meseriasData.user);
    if (!userSnapshot.exists()) {
      throw new Error("User not found!");
    }

    const userDetails = userSnapshot.data() as User;

    // Returnează meseriașul cu detaliile complete ale utilizatorului
    return { ...meseriasData, userDetails };
  }
}