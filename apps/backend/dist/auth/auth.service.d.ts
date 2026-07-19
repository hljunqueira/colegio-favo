import { PrismaService } from '../database/prisma.service';
export declare class AuthService {
    private readonly prisma;
    constructor(prisma: PrismaService);
    login(payload: any): Promise<{
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
