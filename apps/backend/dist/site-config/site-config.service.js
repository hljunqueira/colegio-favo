"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SiteConfigService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../database/prisma.service");
let SiteConfigService = class SiteConfigService {
    constructor(prisma) {
        this.prisma = prisma;
    }
    async getCMSData() {
        const configs = await this.prisma.siteConfig.findMany();
        const items = await this.prisma.siteItem.findMany({
            orderBy: { order: 'asc' },
        });
        const configMap = {};
        for (const c of configs) {
            configMap[c.key] = c.value;
        }
        const sections = {};
        for (const item of items) {
            if (!sections[item.section]) {
                sections[item.section] = [];
            }
            sections[item.section].push({
                id: item.id,
                title: item.title,
                description: item.description,
                extra: item.extra,
                imageUrl: item.imageUrl,
                order: item.order,
            });
        }
        return {
            configs: configMap,
            manifesto: sections['manifesto'] || [],
            programs: sections['programs'] || [],
            gallery: sections['gallery'] || [],
            marquee: (sections['marquee'] || []).map(m => m.title),
        };
    }
    async updateCMSData(body) {
        if (body.configs) {
            for (const [key, value] of Object.entries(body.configs)) {
                await this.prisma.siteConfig.upsert({
                    where: { key },
                    update: { value },
                    create: { key, value },
                });
            }
        }
        if (body.items) {
            for (const item of body.items) {
                if (item.id) {
                    if (item.delete === true) {
                        await this.prisma.siteItem.delete({
                            where: { id: item.id },
                        });
                    }
                    else {
                        await this.prisma.siteItem.update({
                            where: { id: item.id },
                            data: {
                                title: item.title,
                                description: item.description,
                                extra: item.extra,
                                imageUrl: item.imageUrl,
                                order: item.order || 0,
                            },
                        });
                    }
                }
                else if (!item.delete) {
                    await this.prisma.siteItem.create({
                        data: {
                            section: item.section,
                            title: item.title,
                            description: item.description,
                            extra: item.extra,
                            imageUrl: item.imageUrl,
                            order: item.order || 0,
                        },
                    });
                }
            }
        }
        return { success: true };
    }
};
exports.SiteConfigService = SiteConfigService;
exports.SiteConfigService = SiteConfigService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], SiteConfigService);
//# sourceMappingURL=site-config.service.js.map