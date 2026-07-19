import { PrismaService } from '../database/prisma.service';
export declare class SiteConfigService {
    private readonly prisma;
    constructor(prisma: PrismaService);
    getCMSData(): Promise<{
        configs: Record<string, string>;
        manifesto: any[];
        programs: any[];
        gallery: any[];
        marquee: any[];
    }>;
    updateCMSData(body: {
        configs: Record<string, string>;
        items: any[];
    }): Promise<{
        success: boolean;
    }>;
}
