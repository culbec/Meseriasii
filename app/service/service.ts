import { UserRepository } from "../repository/userRepository";
import { MeseriasRepository } from "../repository/meseriasRepository";
import { MeseriasOffersRepository } from "../repository/meseriasOffersRepository";
import { CategoryRepository } from "../repository/categoryRepository";

class Service {
  private userRepo: UserRepository = new UserRepository();
  private meseriasRepo: MeseriasRepository = new MeseriasRepository();
  private meseriasOffersRepo: MeseriasOffersRepository =
    new MeseriasOffersRepository();
  private categoryRepo: CategoryRepository = new CategoryRepository();

  public async login(username: string, password: string) {
    return this.userRepo.login(username, password);
  }

  public async getMeseriasi() {
    return this.meseriasRepo.getMeseriasi();
  }

  public async getMeserias(meserias_id: string) {
    return this.meseriasRepo.getMeserias(meserias_id);
  }

  public async getMeseriasOffers(meserias_id: string) {
    return this.meseriasOffersRepo.getMeseriasOffers(meserias_id);
  }

  public async getCategories() {
    return this.categoryRepo.getCategories();
  }

  public async getCategory(category_id: string) {
    return this.categoryRepo.getCategory(category_id);
  }
}

export const service = new Service();