import {
  collection,
  CollectionReference,
  doc,
  getDoc,
  getDocs,
  query,
} from "firebase/firestore";
import { firebase_db } from "../../firebaseConfig";
import { User } from "./userRepository";

export interface Meserias {
  id?: string;
  user: User;
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
      meseriasi.push(doc.data() as Meserias);
    });

    return meseriasi;
  }

  public async getMeserias(meserias_id: string): Promise<Meserias> {
    const docRef = doc(this.meseriasCollection, meserias_id);
    const docSnapshot = await getDoc(docRef);
      if (docSnapshot.exists()) {
          return docSnapshot.data() as Meserias;
      } else {
          throw new Error("Meserias not found!");
      }
  }
}
