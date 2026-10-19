import { UserService } from './user.service';
import { AuthService } from './auth.service';

export class ServiceProvider {
  private static userServiceInstance?: UserService;
  private static authServiceInstance?: AuthService;

  static get users(): UserService {
    this.userServiceInstance ??= new UserService();
    return this.userServiceInstance;
  }

  static get auth(): AuthService {
    this.authServiceInstance ??= new AuthService();
    return this.authServiceInstance;
  }
}