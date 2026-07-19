import { Injectable } from '@nestjs/common';
import { PrismaService } from '../database/prisma.service';

@Injectable()
export class SiteConfigService {
  constructor(private readonly prisma: PrismaService) {}

  // Busca todas as configurações do site e itens cadastrados
  async getCMSData() {
    const configs = await this.prisma.siteConfig.findMany();
    const items = await this.prisma.siteItem.findMany({
      orderBy: { order: 'asc' },
    });

    // Mapeia chaves para um objeto indexado para facilitar o consumo no frontend
    const configMap: Record<string, string> = {};
    for (const c of configs) {
      configMap[c.key] = c.value;
    }

    // Agrupa itens por seção
    const sections: Record<string, any[]> = {};
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

  // Atualiza configurações gerais e seções em lote
  async updateCMSData(body: { configs: Record<string, string>; items: any[] }) {
    // 1. Gravar configurações gerais
    if (body.configs) {
      for (const [key, value] of Object.entries(body.configs)) {
        await this.prisma.siteConfig.upsert({
          where: { key },
          update: { value },
          create: { key, value },
        });
      }
    }

    // 2. Gravar/atualizar itens das seções
    if (body.items) {
      for (const item of body.items) {
        if (item.id) {
          if (item.delete === true) {
            await this.prisma.siteItem.delete({
              where: { id: item.id },
            });
          } else {
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
        } else if (!item.delete) {
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
}
