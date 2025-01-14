import { User, UserRepository } from "../repository/userRepository";
import { OfferRequest, OffersRepository } from "../repository/offersRepository";
import { CategoryRepository } from "../repository/categoryRepository";
import { getLogger } from "../utils/utils";
import AuthManager from "../auth/authManager";
import { Review, ReviewRepository } from "../repository/reviewRepository";

export default class Service {
  private userRepo: UserRepository = new UserRepository();
  private offersRepo: OffersRepository = new OffersRepository();
  private categoryRepo: CategoryRepository = new CategoryRepository();
  private reviewRepo: ReviewRepository = new ReviewRepository();

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
  ): Promise<{ token: string | undefined; user: User | undefined }> {
    let token: string | undefined = undefined;
    let user: User | undefined = undefined;

    try {
      user = await this.userRepo.login(username, password);

      if (user) {
        token = this.authManager.generateToken(user.username);
        this.loggedInUsers.set(token, user);
      }
    } catch (error) {
      this.log("Error logging in", error);
    }

    return { token, user };
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

  /**
   * Gets the offers from the OffersRepository instance
   * @param meserias_id The id of the meserias to get the offers for
   * @returns The offers if the operation was successful, an empty array otherwise
   * @throws Error if the operation couldn't be completed
   */
  public async getOffers(meserias_id?: string) {
    try {
      if (meserias_id) {
        return this.offersRepo.getMeseriasOffers(meserias_id);
      } else {
        return this.offersRepo.getOffers();
      }
    } catch (error) {
      this.log("Error getting offers", error);
      throw new Error("Couldn't get offers!");
    }
  }

  /**
   * Adds the offer to the OffersRepository instance
   * @param offer The offer to be added
   * @throws Error if the operation couldn't be completed
   */
  public async addOffer(offer: OfferRequest) {
    try {
      await this.offersRepo.addOffer(offer);
    } catch (error) {
      this.log("Error adding offer", error);
      throw new Error("Couldn't add offer!");
    }
  }

  /**
   * Retrieves the user with the given id from the UserRepository instance
   * @param userId The id of the user
   * @returns The user if the operation was successful, an empty object otherwise
   * @throws Error if the operation couldn't be completed
   */
  public async getUserById(userId: string) {
    try {
      return await this.userRepo.getUserById(userId);
    } catch (error) {
      this.log("Error getting user", error);
      throw new Error("Couldn't get user!");
    }
  }

  /**
   * Updates the user with the given user object
   * @param user The user object to be updated
   * @returns The updated user if the operation was successful
   * @throws Error if the operation couldn't be completed
   */
  public async updateUser(user: User): Promise<User> {
    try {
      return await this.userRepo.updateUser(user);
    } catch (error) {
      this.log("Error updating user", error);
      throw new Error("Couldn't update user!");
    }
  }

  /**
   * Changes the password of the user with the given id
   * @param userId The id of the user
   * @param oldPassword The old password
   * @param newPassword The new password
   * @throws Error if the operation couldn't be completed
   */
  public async changePassword(
    userId: string,
    oldPassword: string,
    newPassword: string
  ) {
    try {
      await this.userRepo.changePassword(userId, oldPassword, newPassword);
    } catch (error) {
      this.log("Error changing password", error);
      throw new Error("Couldn't change password!");
    }
  }

  /**
   * Gets the categories from the CategoryRepository instance
   * @returns The categories if the operation was successful, an empty array otherwise
   */
  public async getCategories() {
    return this.categoryRepo.getCategories();
  }

  public async getReviews(): Promise<Review[] | undefined> {
    try {
      return await this.reviewRepo.getReviews();
    } catch (error) {
      this.log("Error getting reviews", error);
      throw new Error("Couldn't get reviews!");
    }
  }

  /**
   * Fetches reviews by star count.
   * @param starCount The star count to filter by.
   * @returns A list of reviews matching the star count or undefined.
   */
  public async getReviewsByStarCount(
    starCount: number
  ): Promise<Review[] | undefined> {
    try {
      return await this.reviewRepo.getReviewsByStarCount(starCount);
    } catch (error) {
      this.log(`Error getting reviews with ${starCount} stars`, error);
      throw new Error(`Couldn't get reviews with ${starCount} stars!`);
    }
  }

  /**
   * Adds a new review.
   * @param review The review object to add.
   * @returns The ID of the newly added review.
   */
  public async addReview(review: Review): Promise<string> {
    try {
      return await this.reviewRepo.addReview(review);
    } catch (error) {
      this.log("Error adding review", error);
      throw new Error("Couldn't add the review!");
    }
  }
}
