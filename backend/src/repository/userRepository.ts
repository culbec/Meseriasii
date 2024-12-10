import {
  addDoc,
  collection,
  CollectionReference,
  doc,
  getDocs,
  getDoc,
  query,
  QuerySnapshot,
  where,
} from "firebase/firestore";
import { db } from "../utils/firebaseConfig";
import { compare, genSalt, getSalt, hash } from "bcrypt-ts";

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

const saltRounds = 10;

export class UserRepository {
  private usersCollection: CollectionReference = collection(db, "users");
  private log = getLogger("UserRepository");

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
      this.log(`User with username ${username} not found`);
      return undefined;
    }

    const userDoc = qSnapshot.docs[0];
    const user = userDoc.data() as UserPrivate;
    user.id = userDoc.id;

    // retrieve the salt from the password
    // and rehash the password with that salt
    const passwordSalt = getSalt(user.password);
    const passwordHash = await hash(password, passwordSalt);

    // compare the password hashes
    const isPasswordValid = await compare(password, passwordHash);
    return isPasswordValid ? user : undefined;
  }

  /**
   * Registers the user into the Firestore database
   * The user is assigned the id field from the Firestore database
   *
   * @param user The user to be registered
   * @param password The password of the user
   * @throws Error if the user couldn't be registered
   */
  public async register(user: User, password: string): Promise<void> {
    const salt = await genSalt(saltRounds);
    const hashedPassword = await hash(password, salt);

    user.date = new Date().toUTCString();
    user.version = 1;
    const userPrivate: UserPrivate = { ...user, password: hashedPassword };

    const result = await addDoc(this.usersCollection, userPrivate).catch(
      (error) => {
        this.log("Error adding document: ", error);
        throw new Error("Couldn't register!");
      }
    );

    this.log("Document written with ID: ", result.id);
    user.id = result.id;
    return Promise.resolve();
  }

  /**
   * Returns a user object from the Firestore database
   * @param userId The id of the user
   * @returns The user object
   * @throws Error if the user is not found
   */
  public async getUserById(userId: string): Promise<User> {
    const userRef = doc(this.usersCollection, userId);
    const userDoc = await getDoc(userRef).catch((error) => {
      this.log("Error getting documents: ", error);
      throw new Error("Couldn't get user!");
    });

    if (!userDoc.exists()) {
      this.log(`User with id ${userId} not found`);
      throw new Error("User not found!");
    }

    const { password, ...user } = userDoc.data() as UserPrivate;

    return {
      id: userDoc.id,
      ...user,
    } as User;
  }
}
