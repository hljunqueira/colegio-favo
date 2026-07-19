import { AuthService } from './auth.service';
export declare class AuthController {
    private readonly authService;
    constructor(authService: AuthService);
    login(body: any): Promise<{
        user: {
            role: any;
            id: any;
            name: any;
            email: any;
            phone: any;
            matricula: any;
        };
        token: string;
    }>;
    getMe(authHeader: string): Promise<{
        id: string;
        name: string;
        email: string;
        phone: string;
        matricula: string;
        role: string;
    }>;
}
