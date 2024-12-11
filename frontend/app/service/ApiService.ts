import axios, { AxiosResponse } from "axios";

// ca sa rulezi de pe telefon pune in loc de localhost ip-ul retelei de pe care e pornit serverului
const BASE_URL = "http://localhost:3000";

interface LoginResponse {
  token: string;
}

interface RegisterResponse {
  token: string;
}

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

interface Category {
  id?: string;
  Name: string;
}

class ApiService {
  private token: string | null = null;

  /**
   * Set the authorization token
   */
  setToken(token: string): void {
    this.token = token;
  }

  /**
   * Login user
   */
  async login(username: string, password: string): Promise<string> {
    const response: AxiosResponse<LoginResponse> = await axios.post(
      `${BASE_URL}/auth/login`,
      { username, password }
    );
    this.token = response.data.token;
    return response.data.token;
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
    const response: AxiosResponse<{ offers: Offer[] }> = await axios.get(
      `${BASE_URL}/offers`,
      {
        headers: { Authorization: `Bearer ${this.token}` },
      }
    );
    return response.data.offers;
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
}

export default new ApiService();
