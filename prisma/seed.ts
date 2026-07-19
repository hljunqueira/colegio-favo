import { PrismaClient } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import { Pool } from 'pg';

// Em ambiente de script CLI com Prisma 7, usamos o driver adapter assim como no app
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter } as any);

async function main() {
  console.log('Iniciando seeding do banco de dados...');

  // 1. Criar ou atualizar Roles (Papéis)
  const roles = [
    { name: 'ADMIN', description: 'Administrador do Sistema' },
    { name: 'DIRETORIA', description: 'Diretoria Escolar' },
    { name: 'TEACHER', description: 'Professor' },
    { name: 'COORDINATOR', description: 'Coordenador Pedagógico' },
    { name: 'STAFF', description: 'Funcionário Administrativo' },
    { name: 'STUDENT', description: 'Aluno' },
    { name: 'PARENT', description: 'Responsável Financeiro/Pedagógico' },
  ];

  const roleMap: Record<string, string> = {};

  for (const r of roles) {
    const roleObj = await prisma.role.upsert({
      where: { name: r.name },
      update: { description: r.description },
      create: { name: r.name, description: r.description },
    });
    roleMap[r.name] = roleObj.id;
    console.log(`Role ${r.name} processada.`);
  }

  // 2. Criar ou atualizar Usuários de Teste Reais
  const users = [
    {
      email: 'admin@escolafavodemel.com.br',
      name: 'Diretoria Colégio Favo',
      password: 'Favo@2025',
      roleName: 'DIRETORIA',
    },
    {
      email: 'coordenador@escolafavodemel.com.br',
      name: 'Coordenadora Amanda',
      password: 'Favo@2025',
      roleName: 'COORDINATOR',
    },
    {
      email: 'funcionario@escolafavodemel.com.br',
      name: 'Carlos Funcionário',
      password: 'Favo@2025',
      roleName: 'STAFF',
    },
    {
      email: 'professor@escolafavodemel.com.br',
      name: 'Professor Marcos',
      password: 'Favo@2025',
      roleName: 'TEACHER',
    },
    {
      email: 'henrique@hljdev.com.br',
      name: 'Henrique Dev',
      password: '183834@Hlj',
      roleName: 'ADMIN',
    },
    {
      matricula: '2026001',
      name: 'Pedro Aluno Teste',
      password: 'Favo@2025',
      roleName: 'STUDENT',
    },
    {
      phone: '11999999999',
      name: 'Mariana Responsável',
      password: 'Favo@2025',
      roleName: 'PARENT',
    },
  ];

  for (const u of users) {
    const roleId = roleMap[u.roleName];
    if (u.email) {
      await prisma.user.upsert({
        where: { email: u.email },
        update: { name: u.name, password: u.password, roleId },
        create: { email: u.email, name: u.name, password: u.password, roleId },
      });
    } else if (u.matricula) {
      await prisma.user.upsert({
        where: { matricula: u.matricula },
        update: { name: u.name, password: u.password, roleId },
        create: { matricula: u.matricula, name: u.name, password: u.password, roleId },
      });
    } else if (u.phone) {
      await prisma.user.upsert({
        where: { phone: u.phone },
        update: { name: u.name, password: u.password, roleId },
        create: { phone: u.phone, name: u.name, password: u.password, roleId },
      });
    }
    console.log(`Usuário ${u.name} (${u.roleName}) processado.`);
  }

  // 3. Seeding do CMS Local e Tabelas Reais
  console.log('Seeding CMS do site e tabelas dinâmicas...');

  // Limpar tabelas dinâmicas para evitar duplicidades
  await prisma.siteConfig.deleteMany();
  await prisma.siteItem.deleteMany();
  await prisma.aviso.deleteMany();
  await prisma.turma.deleteMany();
  await prisma.financeiro.deleteMany();
  await prisma.lead.deleteMany();

  // Configurações Gerais
  const configs = [
    { key: 'school_name', value: 'Favo de Mel' },
    { key: 'school_full', value: 'Centro Educacional Favo de Mel' },
    { key: 'school_tagline', value: 'Educação Infantil e Ensino Fundamental · Berçário ao 9º ano' },
    { key: 'school_slogan', value: 'A educação em que nós acreditamos' },
    { key: 'school_phone', value: '(48) 99627-5127' },
    { key: 'school_phone_raw', value: '5548996275127' },
    { key: 'school_address', value: 'Av. Florianópolis - Centro, Balneário Arroio do Silva - SC, 88914-000' },
    { key: 'school_rating', value: '4,4' },
    { key: 'school_reviews', value: '47' },
    { key: 'school_instagram', value: 'https://www.instagram.com/colegiofavo/' },
  ];

  for (const c of configs) {
    await prisma.siteConfig.create({ data: c });
  }

  // Itens de Manifesto (Essência)
  const manifestoItems = [
    {
      section: 'manifesto',
      title: 'Acolher',
      description: 'Cada criança chega ao Favo de Mel com uma história única. Nosso primeiro compromisso é acolher — criar um lugar onde ela se sinta segura, amada e pertencente.',
      extra: '01',
      order: 1,
    },
    {
      section: 'manifesto',
      title: 'Brincar',
      description: 'Brincar é coisa séria. É brincando que a criança pensa, cria, resolve e se relaciona. Nossa pedagogia coloca o brincar no centro de cada dia.',
      extra: '02',
      order: 2,
    },
    {
      section: 'manifesto',
      title: 'Florescer',
      description: 'Como abelhas em um favo, cada pequeno gesto constrói algo maior. Cultivamos autonomia, afeto e curiosidade para que cada criança floresça no seu tempo.',
      extra: '03',
      order: 3,
    },
  ];

  for (const item of manifestoItems) {
    await prisma.siteItem.create({ data: item });
  }

  // Itens de Programas (Segmentos)
  const programItems = [
    {
      section: 'programs',
      title: 'Berçário & Maternal',
      description: 'Um ninho seguro e afetuoso. Estimulação sensorial, cuidado e rotina com carinho e atenção individual a cada bebê.',
      extra: '4 meses — 3 anos',
      imageUrl: '/logo-favo-oficial.png',
      order: 1,
    },
    {
      section: 'programs',
      title: 'Educação Infantil',
      description: 'A descoberta do mundo pelo brincar. Linguagem, movimento e as primeiras amizades em um ambiente lúdico e acolhedor.',
      extra: '4 — 5 anos',
      imageUrl: '/logo-favo-oficial.png',
      order: 2,
    },
    {
      section: 'programs',
      title: 'Fundamental I',
      description: 'A base do conhecimento com afeto. Letramento, raciocínio lógico e autonomia, respeitando o tempo de cada criança.',
      extra: '1º ao 5º ano',
      imageUrl: '/logo-favo-oficial.png',
      order: 3,
    },
    {
      section: 'programs',
      title: 'Fundamental II',
      description: 'Pensamento crítico e protagonismo. Preparamos jovens curiosos, responsáveis e prontos para os próximos desafios.',
      extra: '6º ao 9º ano',
      imageUrl: '/logo-favo-oficial.png',
      order: 4,
    },
  ];

  for (const item of programItems) {
    await prisma.siteItem.create({ data: item });
  }

  // Itens de Galeria (Ambiente)
  const galleryItems = [
    { section: 'gallery', title: 'Cantinho do afeto', extra: 'row-span-2', imageUrl: '/logo-favo-oficial.png', order: 1 },
    { section: 'gallery', title: 'Sala de aula', extra: '', imageUrl: '/logo-favo-oficial.png', order: 2 },
    { section: 'gallery', title: 'Pátio & brincadeiras', extra: '', imageUrl: '/logo-favo-oficial.png', order: 3 },
    { section: 'gallery', title: 'Nossa essência', extra: 'row-span-2', imageUrl: '/logo-favo-oficial.png', order: 4 },
    { section: 'gallery', title: 'Atividades ao ar livre', extra: '', imageUrl: '/logo-favo-oficial.png', order: 5 },
    { section: 'gallery', title: 'Descobertas', extra: '', imageUrl: '/logo-favo-oficial.png', order: 6 },
  ];

  for (const item of galleryItems) {
    await prisma.siteItem.create({ data: item });
  }

  // Palavras do Marquee
  const marqueeWords = [
    'Acolher', 'Brincar', 'Florescer', 'Afeto', 'Descoberta', 'Autonomia', 'Cuidado', 'Alegria'
  ];

  for (const [index, word] of marqueeWords.entries()) {
    await prisma.siteItem.create({
      data: {
        section: 'marquee',
        title: word,
        order: index,
      }
    });
  }

  // Seeding inicial de Turmas
  const initialTurmas = [
    { nome: '1º Ano - A', serie: 'Fundamental I', turno: 'Matutino', ano: '2026', professor: 'Professora Ana' },
    { nome: '2º Ano - B', serie: 'Fundamental I', turno: 'Vespertino', ano: '2026', professor: 'Professor Marcos' },
    { nome: '3º Ano - C', serie: 'Fundamental I', turno: 'Matutino', ano: '2026', professor: 'Professora Julia' },
  ];

  for (const t of initialTurmas) {
    await prisma.turma.create({ data: t });
  }

  // Seeding inicial de Financeiro
  const initialFinanceiro = [
    { aluno: 'Pedro Aluno Teste', ref: 'Julho/2026', vencimento: '10/07/2026', valor: 850.0, status: 'pago' },
    { aluno: 'Pedro Aluno Teste', ref: 'Agosto/2026', vencimento: '10/08/2026', valor: 850.0, status: 'aberto' },
    { aluno: 'Pedro Aluno Teste', ref: 'Setembro/2026', vencimento: '10/09/2026', valor: 850.0, status: 'aberto' },
  ];

  for (const f of initialFinanceiro) {
    await prisma.financeiro.create({ data: f });
  }

  // Seeding inicial de Avisos
  const initialAvisos = [
    { titulo: 'Reunião de Pais e Mestres', texto: 'Convidamos todos para a reunião de fechamento de bimestre nesta sexta às 19h.', categoria: 'Geral' },
    { titulo: 'Feira de Ciências 2026', texto: 'Preparem os projetos! Nossa feira anual ocorrerá no dia 15 do próximo mês.', categoria: 'Evento' },
  ];

  for (const a of initialAvisos) {
    await prisma.aviso.create({ data: a });
  }

  console.log('Seeding de CMS e tabelas reais concluído!');

  console.log('Seeding finalizado com sucesso!');
}

main()
  .catch((e) => {
    console.error('Erro no seeding:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
    await pool.end();
  });
