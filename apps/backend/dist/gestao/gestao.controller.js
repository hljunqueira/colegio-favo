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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.GestaoController = void 0;
const common_1 = require("@nestjs/common");
const gestao_service_1 = require("./gestao.service");
let GestaoController = class GestaoController {
    constructor(gestaoService) {
        this.gestaoService = gestaoService;
    }
    async getStats() {
        return this.gestaoService.getStats();
    }
    async getAlunos(q) {
        return this.gestaoService.getAlunos(q);
    }
    async createAluno(body) {
        return this.gestaoService.createAluno(body);
    }
    async updateAluno(id, body) {
        return this.gestaoService.updateAluno(id, body);
    }
    async getTurmas() {
        return this.gestaoService.getTurmas();
    }
    async createTurma(body) {
        return this.gestaoService.createTurma(body);
    }
    async getProfessores() {
        return this.gestaoService.getProfessores();
    }
    async createProfessor(body) {
        return this.gestaoService.createProfessor(body);
    }
    async getFinanceiro() {
        return this.gestaoService.getFinanceiro();
    }
    async getResponsaveis() {
        return this.gestaoService.getResponsaveis();
    }
    async getUsuarios() {
        return this.gestaoService.getUsuarios();
    }
    async getAvisos() {
        return this.gestaoService.getAvisos();
    }
    async createAviso(body) {
        return this.gestaoService.createAviso(body);
    }
    async deleteAviso(id) {
        return this.gestaoService.deleteAviso(id);
    }
    async getLeads() {
        return this.gestaoService.getLeads();
    }
    async createLead(body) {
        return this.gestaoService.createLead(body);
    }
    async updateLead(id, body) {
        return this.gestaoService.updateLead(id, body);
    }
};
exports.GestaoController = GestaoController;
__decorate([
    (0, common_1.Get)('gestao/stats'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], GestaoController.prototype, "getStats", null);
__decorate([
    (0, common_1.Get)('gestao/alunos'),
    __param(0, (0, common_1.Query)('q')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], GestaoController.prototype, "getAlunos", null);
__decorate([
    (0, common_1.Post)('gestao/alunos'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], GestaoController.prototype, "createAluno", null);
__decorate([
    (0, common_1.Patch)('gestao/alunos/:id'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], GestaoController.prototype, "updateAluno", null);
__decorate([
    (0, common_1.Get)('gestao/turmas'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], GestaoController.prototype, "getTurmas", null);
__decorate([
    (0, common_1.Post)('gestao/turmas'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], GestaoController.prototype, "createTurma", null);
__decorate([
    (0, common_1.Get)('gestao/professores'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], GestaoController.prototype, "getProfessores", null);
__decorate([
    (0, common_1.Post)('gestao/professores'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], GestaoController.prototype, "createProfessor", null);
__decorate([
    (0, common_1.Get)('gestao/financeiro'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], GestaoController.prototype, "getFinanceiro", null);
__decorate([
    (0, common_1.Get)('gestao/responsaveis'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], GestaoController.prototype, "getResponsaveis", null);
__decorate([
    (0, common_1.Get)('gestao/usuarios'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], GestaoController.prototype, "getUsuarios", null);
__decorate([
    (0, common_1.Get)('avisos'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], GestaoController.prototype, "getAvisos", null);
__decorate([
    (0, common_1.Post)('avisos'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], GestaoController.prototype, "createAviso", null);
__decorate([
    (0, common_1.Delete)('avisos/:id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], GestaoController.prototype, "deleteAviso", null);
__decorate([
    (0, common_1.Get)('admin/leads'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], GestaoController.prototype, "getLeads", null);
__decorate([
    (0, common_1.Post)('leads'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], GestaoController.prototype, "createLead", null);
__decorate([
    (0, common_1.Patch)('admin/leads/:id'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], GestaoController.prototype, "updateLead", null);
exports.GestaoController = GestaoController = __decorate([
    (0, common_1.Controller)(),
    __metadata("design:paramtypes", [gestao_service_1.GestaoService])
], GestaoController);
//# sourceMappingURL=gestao.controller.js.map