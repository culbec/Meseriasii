import axios, { AxiosResponse } from "axios";

const BASE_URL = "http://localhost:3000";

interface LoginResponse {
  token: string;
}

interface RegisterResponse {
  token: string;
}

interface User {
  id: string;
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
  id: string;
  title: string;
  description: string;
  price: number;
  date: string;
  category: string;
}

interface Category {
  id: string;
  name: string;
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

  /**
   * Get categories
   */
  async getCategories(): Promise<Category[]> {
    const response: AxiosResponse<{ categories: Category[] }> = await axios.get(
      `${BASE_URL}/categories`
    );
    return response.data.categories;
  }
}

export default new ApiService();
