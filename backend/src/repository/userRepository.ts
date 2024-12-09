import {
  addDoc,
  collection,
  CollectionReference,
  getDocs,
  query,
  QuerySnapshot,
  where,
} from "firebase/firestore";
import { db } from "../utils/firebaseConfig";
// import { compare, genSalt, getSalt, hash } from "bcrypt-ts";
let bcrypt_ts: typeof import('bcrypt-ts');

import { getLogger } from "../utils/utils";

export interface User {
  id?: string;
  username: string;
  type: string;
  first_name: string;
  last_name: string;
  phone_number: string;
  address: string;
  date: string;
  version: number;
}

interface UserPrivate extends User {
  password: string;
}

const saltLength = 32;
const log = getLogger("UserRepository");

export class UserRepository {
  private usersCollection: CollectionReference = collection(db, "users");

  /**
   * Checks if the user exists in the Firestore database
   *
   * @param username The username of the user
   * @param password The password of the user
   * @returns The user if the login was successful, undefined otherwise
   */
  public async login(
    username: string,
    password: string
  ): Promise<User | undefined> {
    const q = query(this.usersCollection, where("username", "==", username));
    const qSnapshot: QuerySnapshot = await getDocs(q).catch((error) => {
      console.error("Error getting documents: ", error);
      throw new Error("Couldn't login!");
    });

    if (qSnapshot.docs.length === 0) {
      log(`User with username ${username} not found`);
      return undefined;
    }

    const userDoc = qSnapshot.docs[0];
    const user = userDoc.data() as UserPrivate;
    user.id = userDoc.id;
    log("user", user);


    if (!bcrypt_ts) {
      bcrypt_ts = await import('bcrypt-ts');
    }
    // retrieve the salt from the password
    // and rehash the password with that salt
    const passwordSalt = bcrypt_ts.getSalt(user.password);
    const passwordHash = await bcrypt_ts.hash(password, passwordSalt);

    // compare the password hashes
    const isPasswordValid = await bcrypt_ts.compare(password, passwordHash);
    return isPasswordValid ? user : undefined;
  }

  /**
   * Registers the user into the Firestore database
   * The user is assigned the id field from the Firestore database
   *
   * @param user The user to be registered
   * @param password The password of the user
   */
  public async register(user: User, password: string): Promise<void> {
    const salt = await bcrypt_ts.genSalt(saltLength);
    const hashedPassword = await bcrypt_ts.hash(password, salt);

    const result = await addDoc(this.usersCollection, {
      user,
      userPassword: hashedPassword,
    }).catch((error) => {
      log("Error adding document: ", error);
      throw new Error("Couldn't register!");
    });

    log("Document written with ID: ", result.id);
    user.id = result.id;
  }
}
