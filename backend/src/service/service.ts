import { User, UserRepository } from "../repository/userRepository";
import { OffersRepository } from "../repository/offersRepository";
import { CategoryRepository } from "../repository/categoryRepository";
import { getLogger } from "../utils/utils";
import AuthManager from "../auth/authManager";
import { error } from "console";

export default class Service {
  private userRepo: UserRepository = new UserRepository();
  private meseriasOffersRepo: OffersRepository = new OffersRepository();
  private categoryRepo: CategoryRepository = new CategoryRepository();

  private authManager: AuthManager = new AuthManager();
  private loggedInUsers: Map<string, User> = new Map<string, User>();

  private log = getLogger("Service");

  /**
   * Verifies the token passed as an argument
   * through the AuthManager instance
   *
   * @param token The token to be verified
   * @returns The decoded token if the token is valid, an empty string otherwise
   */
  public verifyToken(token: string): string | object {
    return this.authManager.verifyToken(token);
  }

  /**
   * Logs in the user with the given username and password
   *
   * @param username The username of the user
   * @param password The password of the user
   * @returns The token if the login was successful, undefined otherwise
   */
  public async login(
    username: string,
    password: string
  ): Promise<string | undefined> {
    let token: string | undefined = undefined;

    try {
      const user = await this.userRepo.login(username, password);

      if (user) {
        token = this.authManager.generateToken(user.username);
        this.loggedInUsers.set(token, user);
      }
    } catch (error) {
      this.log("Error logging in", error);
    }

    return token;
  }

  /**
   * Registers the user with the given user object and password
   *
   * @param user The user object to be registered
   * @param password The password of the user
   * @returns The token if the registration was successful, undefined otherwise
   */
  public async register(
    user: User,
    password: string
  ): Promise<string | undefined> {
    let token: string | undefined = undefined;

    try {
      await this.userRepo.register(user, password);

      token = this.authManager.generateToken(user.username);
      this.loggedInUsers.set(token, user);
    } catch (error) {
      this.log("Error registering", error);
    }

    return token;
  }

  /**
   * Removes the user with the given token from the logged in users list
   *
   * @param token The token of the user
   * @returns True if the user was successfully logged out, false otherwise
   */
  public logout(token: string): boolean {
    return this.loggedInUsers.delete(token);
  }

  public checkLoggedIn(token: string) {
    return this.loggedInUsers.has(token);
  }

  public async getOffers(meserias_id?: string ,categoryName?:string) {
    try {
      if (meserias_id) {
        return this.meseriasOffersRepo.getMeseriasOffers(meserias_id);

      }
      else if(categoryName){
        return this.meseriasOffersRepo.getOffersByCategoryName(categoryName);
      }
       else {
        return this.meseriasOffersRepo.getOffers();
      }
    } catch (error) {
      this.log("Error getting offers", error);
      throw new Error("Couldn't get offers!");
    }
  }


  public async getUserById(userId: string) {
    try {
      return await this.userRepo.getUserById(userId);
    } catch (error) {
      this.log("Error getting user", error);
      throw new Error("Couldn't get user!");
    }
  }

  public async getCategories() {
    return this.categoryRepo.getCategories();
  }
}