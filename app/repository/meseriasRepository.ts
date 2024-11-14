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
  user: User;
}

export class MeseriasRepository {
  private meseriasCollection: CollectionReference = collection(
    firebase_db,
    "meseriasi"
  );

  public async getMeserias(meserias_id: string): Promise<Meserias> {
    const docRef = doc(this.meseriasCollection, meserias_id);
    const docSnapshot = await getDoc(docRef);

    if (!docSnapshot.exists()) {
      throw new Error("Meserias not found!");
    }

    const meseriasData = docSnapshot.data();

    const userSnapshot = await getDoc(meseriasData.user);
    if (!userSnapshot.exists()) {
      throw new Error("User not found!");
    }

    const userDetails = userSnapshot.data() as User;

    const meserias = {id: meserias_id, user : userDetails} as Meserias

    return meserias;
  }

  public async getMeseriasi(): Promise<Meserias[]> {
    const q = query(this.meseriasCollection);
    const qSnapshot = await getDocs(q).catch((error) => {
      console.error("Error getting documents: ", error);
      throw new Error("Couldn't get meseriasi!");
    });

    const meseriasi: Meserias[] = [];

    // Iterăm asupra fiecărui document
    for (const doc of qSnapshot.docs) {
      // Așteptăm să obținem detaliile meserias-ului
      const meseriasData = await this.getMeserias(doc.id); // Așteptăm răspunsul de la getMeserias
      meseriasi.push(meseriasData); // Adăugăm Meserias-ul în array
    }

    return meseriasi; // Returnăm lista completă de Meseriasi
  }


}