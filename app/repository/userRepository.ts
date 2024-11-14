import {
  addDoc,
  collection,
  CollectionReference,
  getDocs,
  query,
  QuerySnapshot,
  where,
} from "firebase/firestore";
import { firebase_db } from "../../firebaseConfig";
import {
  compare,
  compareSync,
  genSalt,
  getSalt,
  hash,
  hashSync,
} from "bcrypt-ts";

export interface User {
  id_?: string;
  username: string;
  first_name: string;
  last_name: string;
  phone_number: string;
  date: string;
  version: number;
}

const saltLength = 32;

export class UserRepository {
  private usersCollection: CollectionReference = collection(
    firebase_db,
    "users"
  );

  public async login(
    username: string,
    password: string
  ): Promise<User | undefined> {
    const q = query(this.usersCollection, where("username", "==", username));
    const qSnapshot: QuerySnapshot = await getDocs(q).catch((error) => {
      console.error("Error getting documents: ", error);
      throw new Error("Couldn't login!");
    });

    if (qSnapshot.empty) {
      return undefined;
    }

    const userDoc = qSnapshot.docs[0];
    const { user, userPassword } = userDoc.data() as {
      user: User;
      userPassword: string;
    };

    const passwordSalt = getSalt(userPassword);
    const passwordHash = await hash(password, passwordSalt);

    const isPasswordValid = await compare(password, passwordHash);
    return isPasswordValid ? user : undefined;
  }

  public async register(user: User, password: string): Promise<void> {
    const salt = await genSalt(saltLength);
    const hashedPassword = await hash(password, salt);

    await addDoc(this.usersCollection, {
      user,
      userPassword: hashedPassword,
    }).catch((error) => {
      console.error("Error adding document: ", error);
      throw new Error("Couldn't register!");
    });
  }
}
