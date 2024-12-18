import axios, { AxiosResponse } from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";

// ca sa rulezi de pe telefon pune in loc de localhost ip-ul retelei de pe care e pornit serverului
const BASE_URL = "http://localhost:3000";

interface User {
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

interface Offer {
  id?: string;
  meserias: User;
  category: Category;
  description: string;
  start_price: number;
}

export interface OfferRequest {
  id?: string;
  meserias_id: string;
  category_id: string;
  description: string;
  start_price: number;
}

interface Category {
  id?: string;
  Name: string;
}

interface LoginResponse {
  token: string;
  user: User;
}

interface RegisterResponse {
  token: string;
  user: User;
}

class ApiService {
  private token: string | null = null;
  private allOffers: Offer[] = [];
  private selectedOffer: Offer | null = null;
  /**
   * Set the authorization token
   */
  setToken(token: string): void {
    this.token = token;
    this.saveTokenToStorage(token);
  }

  async loadTokenFromStorage(): Promise<void> {
    try {
      const storedToken = await AsyncStorage.getItem("authToken");
      if (storedToken) {
        this.token = storedToken;
        console.log("Token loaded from storage", this.token);
      }
    } catch (error) {
      console.error("Failed to load token from storage:", error);
    }
    
  }

  async clearTokenFromStorage(): Promise<void> {
    try {
      await AsyncStorage.removeItem("authToken");
      this.token = null;
    } catch (error) {
      console.error("Failed to clear token from storage:", error);
    }
  }

  async saveTokenToStorage(token: string): Promise<void> {
    try {
      await AsyncStorage.setItem("authToken", token);
    } catch (error) {
      console.error("Failed to save token to storage:", error);
    }
    console.log("Token saved to storage", token);
  }

  setSelectedOffer(offer: Offer): void {
    this.selectedOffer = offer;
  }

  getSelectedOffer(): Offer | null {
    return this.selectedOffer;
  }

  /**
   * Login user
   */
  async login(username: string, password: string): Promise<User> {
    const response: AxiosResponse<{ token: string; user: User }> = await axios.post(
      `${BASE_URL}/auth/login`,
      { username, password }
    );

    this.setToken(response.data.token);

    return response.data.user;
  }

  /**
   * Register user
   */
  async register(user: User, password: string): Promise<string> {
    const response: AxiosResponse<RegisterResponse> = await axios.post(
      `${BASE_URL}/auth/register`,
      { user, password }
    );
    this.token = response.data.token;
    await this.saveTokenToStorage(response.data.token);
    return response.data.token;
  }

  /**
   * Logout user
   */
  async logout(): Promise<void> {
    if (!this.token) {
      throw new Error("User is not logged in.");
    }

    await axios.get(`${BASE_URL}/auth/logout`, {
      headers: { Authorization: `Bearer ${this.token}` },
    });
    this.token = null;
    await this.clearTokenFromStorage();
  }

  /**
   * Update the user
   */
  async updateUser(user: User): Promise<User> {
    if (!this.token) {
      throw new Error("User is not logged in.");
    }

    const response: AxiosResponse<{ user: User }> = await axios.post(
      `${BASE_URL}/users/update`,
      user, // Send the user data as request body
      {
        headers: { Authorization: `Bearer ${this.token}` }, // Include token in the headers for authentication
      }
    );

    // Return the updated user from the response
    return response.data.user;
  }
  /**
   * Update the user's password
   */
  async updateUserPassword(userId: string, oldPassword: string, newPassword: string): Promise<string> {
    if (!this.token) {
      throw new Error("User is not logged in.");
    }

    try {
      // Sending the request to change the password
      const response: AxiosResponse<{ message: string }> = await axios.post(
        `${BASE_URL}/auth/change-password`,
        { userId, oldPassword, newPassword },
        {
          headers: { Authorization: `Bearer ${this.token}` }, // Include the token for authorization
        }
      );

      // Return the success message from the response
      return response.data.message;
    } catch (error) {
      console.error("Error changing password:", error);
      throw new Error("Could not change password! Please try again later.");
    }
  }


  /**
   * Get user by ID
   */
  async getUserById(id: string): Promise<User> {
    const response: AxiosResponse<{ user: User }> = await axios.get(
      `${BASE_URL}/users/${id}`,
      {
        headers: { Authorization: `Bearer ${this.token}` },
      }
    );
    return response.data.user;
  }

  /**
   * Get offers for a specific user (meserias)
   */
  async getOffersByMeseriasId(meseriasId: string): Promise<Offer[]> {
    const response: AxiosResponse<{ offers: Offer[] }> = await axios.get(
      `${BASE_URL}/offers/meserias/${meseriasId}`,
      {
        headers: { Authorization: `Bearer ${this.token}` },
      }
    );
    return response.data.offers;
  } 


  async getOffers(): Promise<Offer[]> {
    if (this.allOffers.length === 0) {
    const response: AxiosResponse<{ offers: Offer[] }> = await axios.get(
      `${BASE_URL}/offers`,
      {
        headers: { Authorization: `Bearer ${this.token}` },
      }
      );
      this.allOffers = response.data.offers;
      return response.data.offers;
      }
    else{
      console.log("Loading memorised offers");
      return this.allOffers;
    }
  }


  /**
   * Get offers for a specific categoty
   */
  async getOffersByCategory(category: string): Promise<Offer[]> {
    try {
      const response: AxiosResponse<{ offers?: Offer[]; message?: string }> = await axios.get(
        `${BASE_URL}/offers/category/${category}`,
        {
          headers: { Authorization: `Bearer ${this.token}` },
        }
      );
  
      // Verificăm dacă răspunsul conține un array de oferte
      if (Array.isArray(response.data.offers)) {
        return response.data.offers;
      }
  
      // Dacă răspunsul conține un mesaj, îl putem loga sau trata
      console.warn("API returned a message:", response.data.message || "Unknown issue");
      return []; // Returnăm o listă goală dacă nu sunt oferte
    } catch (error) {
      console.error("Error fetching offers by category:", error);
      return []; // Returnăm o listă goală în caz de eroare
    }
  }

  /**
   * Get categories
   */
  async getCategories(): Promise<Category[]> {
    console.log("getCategories");
    const response: AxiosResponse<{ categories: Category[] }> = await axios.get(
      `${BASE_URL}/categories`
    );
    console.log(response.data.categories);
    return response.data.categories;
  }

  /**
   * Add a new offer
   */
  async addOffer(offer: OfferRequest): Promise<OfferRequest> {
    try {
      const response: AxiosResponse<{ offer: OfferRequest }> = await axios.post(
        `${BASE_URL}/offers`,
        offer,
        {
          headers: { Authorization: `Bearer ${this.token}` },
        }
      );
      return response.data.offer; // Returnează oferta adăugată
    } catch (error) {
      console.error("Error adding offer:", error);
      throw new Error("Couldn't add offer!");
    }
  }
}

export default new ApiService();
