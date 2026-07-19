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
exports.GestaoService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../database/prisma.service");
let GestaoService = class GestaoService {
    constructor(prisma) {
        this.prisma = prisma;
    }
    async getStats() {
        const totalAlunos = await this.prisma.user.count({
            where: { role: { name: 'STUDENT' } },
        });
        const totalProfessores = await this.prisma.user.count({
            where: { role: { name: 'TEACHER' } },
        });
        const financeiroAberto = await this.prisma.financeiro.findMany({
            where: { status: 'aberto' },
        });
        const mensalidadesAbertas = financeiroAberto.reduce((acc, curr) => acc + curr.valor, 0);
        const totalTurmas = await this.prisma.turma.count();
        const contatosNovos = await this.prisma.lead.count({
            where: { status: 'novo' },
        });
        const comunicados = await this.prisma.aviso.count();
        return {
            mensalidades_abertas: mensalidadesAbertas,
            alunos: totalAlunos,
            turmas: totalTurmas,
            professores: totalProfessores,
            contatos_novos: contatosNovos,
            comunicados,
        };
    }
    async getAlunos(search = '') {
        const users = await this.prisma.user.findMany({
            where: {
                role: { name: 'STUDENT' },
                OR: search
                    ? [
                        { name: { contains: search, mode: 'insensitive' } },
                        { matricula: { contains: search, mode: 'insensitive' } },
                    ]
                    : undefined,
            },
            orderBy: { createdAt: 'desc' },
        });
        return users.map((u) => ({
            id: u.id,
            name: u.name,
            matricula: u.matricula,
            status: 'ativa',
            responsavel_nome: 'Responsável ' + (u.name || ''),
            responsavel_email: 'responsavel@colegiofavo.com.br',
            turma: '3º Ano - C',
        }));
    }
    async createAluno(data) {
        const studentRole = await this.prisma.role.findUnique({
            where: { name: 'STUDENT' },
        });
        if (!studentRole)
            throw new Error('Role STUDENT não encontrada');
        const user = await this.prisma.user.create({
            data: {
                name: data.name,
                matricula: data.matricula || String(Math.floor(100000 + Math.random() * 900000)),
                password: 'Favo@2025',
                roleId: studentRole.id,
            },
        });
        return user;
    }
    async updateAluno(id, body) {
        return { id, success: true };
    }
    async getTurmas() {
        return this.prisma.turma.findMany({
            orderBy: { nome: 'asc' },
        });
    }
    async createTurma(body) {
        return this.prisma.turma.create({
            data: {
                nome: body.nome,
                serie: body.serie || '',
                turno: body.turno || 'Matutino',
                ano: body.ano || '2026',
                professor: body.professor || 'Não atribuído',
            },
        });
    }
    async getProfessores() {
        const users = await this.prisma.user.findMany({
            where: { role: { name: 'TEACHER' } },
            orderBy: { createdAt: 'desc' },
        });
        return users.map((u) => ({
            id: u.id,
            name: u.name,
            email: u.email || '—',
            disciplina: 'Geral',
            telefone: u.phone || '—',
        }));
    }
    async createProfessor(data) {
        const teacherRole = await this.prisma.role.findUnique({
            where: { name: 'TEACHER' },
        });
        if (!teacherRole)
            throw new Error('Role TEACHER não encontrada');
        return this.prisma.user.create({
            data: {
                name: data.name,
                email: data.email || undefined,
                phone: data.telefone || undefined,
                password: 'Favo@2025',
                roleId: teacherRole.id,
            },
        });
    }
    async getFinanceiro() {
        return this.prisma.financeiro.findMany({
            orderBy: { vencimento: 'asc' },
        });
    }
    async getResponsaveis() {
        const users = await this.prisma.user.findMany({
            where: { role: { name: 'PARENT' } },
            include: { role: true },
        });
        return users.map((u) => ({
            name: u.name,
            email: u.email || u.phone || '—',
            role: u.role?.name || 'PARENT',
        }));
    }
    async getUsuarios() {
        const users = await this.prisma.user.findMany({
            include: { role: true },
        });
        return users.map((u) => ({
            name: u.name,
            email: u.email || u.matricula || u.phone || '—',
            role: u.role?.name.toLowerCase() || 'user',
        }));
    }
    async getAvisos() {
        return this.prisma.aviso.findMany({
            orderBy: { createdAt: 'desc' },
        });
    }
    async createAviso(body) {
        return this.prisma.aviso.create({
            data: {
                titulo: body.titulo,
                texto: body.texto,
                categoria: body.categoria || 'Geral',
            },
        });
    }
    async deleteAviso(id) {
        await this.prisma.aviso.delete({
            where: { id },
        });
        return { success: true };
    }
    async getLeads() {
        return this.prisma.lead.findMany({
            orderBy: { createdAt: 'desc' },
        });
    }
    async createLead(data) {
        return this.prisma.lead.create({
            data: {
                parent_name: data.parent_name,
                email: data.email,
                phone: data.phone,
                child_name: data.child_name || null,
                program: data.program || null,
                message: data.message || null,
            },
        });
    }
    async updateLead(id, body) {
        await this.prisma.lead.update({
            where: { id },
            data: {
                status: body.status,
            },
        });
        return { success: true };
    }
};
exports.GestaoService = GestaoService;
exports.GestaoService = GestaoService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], GestaoService);
//# sourceMappingURL=gestao.service.js.map