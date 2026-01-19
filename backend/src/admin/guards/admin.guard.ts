import {
  Injectable,
  CanActivate,
  ExecutionContext,
  UnauthorizedException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AdminGuard implements CanActivate {
  constructor(private configService: ConfigService) {}

  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest();
    const apiKey = request.headers['x-api-key'];
    const adminApiKey = this.configService.get<string>('ADMIN_API_KEY');

    if (!apiKey || apiKey !== adminApiKey) {
      throw new UnauthorizedException('Invalid or missing API key');
    }

    return true;
  }
}
