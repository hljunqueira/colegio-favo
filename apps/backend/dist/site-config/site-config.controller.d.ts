import { SiteConfigService } from './site-config.service';
export declare class SiteConfigController {
    private readonly service;
    constructor(service: SiteConfigService);
    getCMSData(): Promise<{
        configs: Record<string, string>;
        manifesto: any[];
        programs: any[];
        gallery: any[];
        marquee: any[];
    }>;
    updateCMSData(body: any): Promise<{
        success: boolean;
    }>;
    uploadFile(file: any): {
        url: string;
    };
}
