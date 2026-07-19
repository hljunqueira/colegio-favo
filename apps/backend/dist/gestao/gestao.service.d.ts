import { PrismaService } from '../database/prisma.service';
export declare class GestaoService {
    private readonly prisma;
    constructor(prisma: PrismaService);
    getStats(): Promise<{
        mensalidades_abertas: number;
        alunos: number;
        turmas: number;
        professores: number;
        contatos_novos: number;
        comunicados: number;
    }>;
    getAlunos(search?: string): Promise<{
        id: string;
        name: string;
        matricula: string;
        status: string;
        responsavel_nome: string;
        responsavel_email: string;
        turma: string;
    }[]>;
    createAluno(data: any): Promise<{
        email: string;
        phone: string;
        matricula: string;
        password: string;
        id: string;
        name: string;
        createdAt: Date;
        updatedAt: Date;
        roleId: string;
    }>;
    updateAluno(id: string, body: any): Promise<{
        id: string;
        success: boolean;
    }>;
    getTurmas(): Promise<{
        id: string;
        createdAt: Date;
        nome: string;
        serie: string;
        turno: string;
        ano: string;
        professor: string;
    }[]>;
    createTurma(body: any): Promise<{
        id: string;
        createdAt: Date;
        nome: string;
        serie: string;
        turno: string;
        ano: string;
        professor: string;
    }>;
    getProfessores(): Promise<{
        id: string;
        name: string;
        email: string;
        disciplina: string;
        telefone: string;
    }[]>;
    createProfessor(data: any): Promise<{
        email: string;
        phone: string;
        matricula: string;
        password: string;
        id: string;
        name: string;
        createdAt: Date;
        updatedAt: Date;
        roleId: string;
    }>;
    getFinanceiro(): Promise<{
        id: string;
        createdAt: Date;
        aluno: string;
        ref: string;
        vencimento: string;
        valor: number;
        status: string;
    }[]>;
    getResponsaveis(): Promise<{
        name: string;
        email: string;
        role: string;
    }[]>;
    getUsuarios(): Promise<{
        name: string;
        email: string;
        role: string;
    }[]>;
    getAvisos(): Promise<{
        id: string;
        createdAt: Date;
        titulo: string;
        texto: string;
        categoria: string;
    }[]>;
    createAviso(body: any): Promise<{
        id: string;
        createdAt: Date;
        titulo: string;
        texto: string;
        categoria: string;
    }>;
    deleteAviso(id: string): Promise<{
        success: boolean;
    }>;
    getLeads(): Promise<{
        email: string;
        phone: string;
        id: string;
        createdAt: Date;
        status: string;
        parent_name: string;
        child_name: string;
        program: string;
        message: string;
    }[]>;
    createLead(data: any): Promise<{
        email: string;
        phone: string;
        id: string;
        createdAt: Date;
        status: string;
        parent_name: string;
        child_name: string;
        program: string;
        message: string;
    }>;
    updateLead(id: string, body: any): Promise<{
        success: boolean;
    }>;
}
