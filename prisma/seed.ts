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

  const userMap: Record<string, string> = {};

  for (const u of users) {
    const roleId = roleMap[u.roleName];
    let createdUser;
    if (u.email) {
      createdUser = await prisma.user.upsert({
        where: { email: u.email },
        update: { name: u.name, password: u.password, roleId },
        create: { email: u.email, name: u.name, password: u.password, roleId },
      });
      userMap[u.email] = createdUser.id;
    } else if (u.matricula) {
      createdUser = await prisma.user.upsert({
        where: { matricula: u.matricula },
        update: { name: u.name, password: u.password, roleId },
        create: { matricula: u.matricula, name: u.name, password: u.password, roleId },
      });
      userMap[u.matricula] = createdUser.id;
    } else if (u.phone) {
      createdUser = await prisma.user.upsert({
        where: { phone: u.phone },
        update: { name: u.name, password: u.password, roleId },
        create: { phone: u.phone, name: u.name, password: u.password, roleId },
      });
      userMap[u.phone] = createdUser.id;
    }
    console.log(`Usuário ${u.name} (${u.roleName}) processado.`);
  }

  // 3. Seeding do CMS Local e Tabelas Reais
  console.log('Seeding CMS do site e tabelas dinâmicas...');

  // Limpar tabelas dinâmicas para evitar duplicidades
  await prisma.fichaAnamnese.deleteMany();
  await prisma.preferenciasNotificacao.deleteMany();
  await prisma.logAcesso.deleteMany();
  await prisma.atestado.deleteMany();
  await prisma.entregaAtividade.deleteMany();
  await prisma.atividade.deleteMany();
  await prisma.reservaLivro.deleteMany();
  await prisma.livro.deleteMany();
  await prisma.reuniao.deleteMany();
  await prisma.nota.deleteMany();
  await prisma.frequencia.deleteMany();
  await prisma.planoAula.deleteMany();
  await prisma.aluno.deleteMany();
  await prisma.professor.deleteMany();
  await prisma.responsavel.deleteMany();
  await prisma.funcionario.deleteMany();
  await prisma.gradeHoraria.deleteMany();
  await prisma.agendaEvento.deleteMany();
  await prisma.cardapio.deleteMany();

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
      title: 'Acolhimento afetivo',
      description: 'Entendemos que o aprendizado significativo floresce em um ambiente onde a criança se sente segura, amada e valorizada em sua singularidade.',
      imageUrl: '/logo-favo-oficial.png',
      order: 1,
    },
    {
      section: 'manifesto',
      title: 'Protagonismo infantil',
      description: 'Aqui, a criança não é mera espectadora. Ela investiga, questiona e constrói conhecimento ativamente através de projetos e brincadeiras mediadas.',
      imageUrl: '/logo-favo-oficial.png',
      order: 2,
    },
    {
      section: 'manifesto',
      title: 'Parceria com as famílias',
      description: 'Acreditamos que a educação se faz na estreita colaboração e diálogo transparente entre escola e lar, caminhando juntos no desenvolvimento integral.',
      imageUrl: '/logo-favo-oficial.png',
      order: 3,
    },
  ];

  for (const item of manifestoItems) {
    await prisma.siteItem.create({ data: item });
  }

  // Itens de Segmentos (Nossas Etapas)
  const programItems = [
    {
      section: 'programs',
      title: 'Berçário Sentidos',
      description: 'Estimulação sensorial precoce, rotina acolhedora e cuidados individualizados com equipe altamente qualificada.',
      extra: '4 meses a 1 ano',
      imageUrl: '/logo-favo-oficial.png',
      order: 1,
    },
    {
      section: 'programs',
      title: 'Educação Infantil',
      description: 'O brincar como eixo estruturante, investigações, artes, musicalização e socialização saudável.',
      extra: '2 a 5 anos',
      imageUrl: '/logo-favo-oficial.png',
      order: 2,
    },
    {
      section: 'programs',
      title: 'Ensino Fundamental I',
      description: 'Alfabetização lúdica, letramento matemático, projetos científicos e desenvolvimento da autonomia.',
      extra: '1º ao 5º ano',
      imageUrl: '/logo-favo-oficial.png',
      order: 3,
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

  const createdTurmas: Record<string, string> = {};

  for (const t of initialTurmas) {
    const turmaObj = await prisma.turma.create({ data: t });
    createdTurmas[t.nome] = turmaObj.id;
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

  // ==========================================
  // SEED DE PERFIS E RELACIONAMENTOS REAIS
  // ==========================================
  console.log('Seeding de Perfis, Notas, Anamnese e Biblioteca...');

  // 1. Responsável
  const respId = userMap['11999999999'];
  const responsavel = await prisma.responsavel.create({
    data: {
      userId: respId,
      cpf: '123.456.789-00',
      telefone: '11999999999',
      enderecoLogradouro: 'Rua das Flores',
      enderecoNumero: '123',
      enderecoBairro: 'Centro',
      enderecoCidade: 'Balneário Arroio do Silva',
      enderecoEstado: 'SC',
      enderecoCep: '88914-000',
      financeiroPrincipal: true,
    }
  });

  // 2. Aluno
  const alunoId = userMap['2026001'];
  const turmaId = createdTurmas['3º Ano - C'];
  const aluno = await prisma.aluno.create({
    data: {
      userId: alunoId,
      matricula: '2026001',
      responsavelId: responsavel.id,
      turmaId: turmaId,
      status: 'ativo',
    }
  });

  // 3. Ficha Anamnese
  await prisma.fichaAnamnese.create({
    data: {
      alunoId: aluno.id,
      restricoesAlimentares: 'Intolerância a lactose leve',
      alergias: 'Alergia a poeira e pólen',
      medicamentosContinuos: 'Nenhum',
      tipoSanguineo: 'O+',
      contatoEmergencia: 'Mariana (Mãe) - 11999999999',
      observacoesMedicas: 'Usar bombinha de asma se necessário',
    }
  });

  // 4. Professor
  const profUserId = userMap['professor@escolafavodemel.com.br'];
  const professor = await prisma.professor.create({
    data: {
      userId: profUserId,
      telefone: '48999999998',
      disciplina: 'Polivalente',
    }
  });

  // 5. Funcionário
  const staffUserId = userMap['funcionario@escolafavodemel.com.br'];
  await prisma.funcionario.create({
    data: {
      userId: staffUserId,
      setor: 'secretaria',
      telefone: '48999999997',
    }
  });

  // 6. Notas de Pedro
  await prisma.nota.createMany({
    data: [
      { alunoId: aluno.id, disciplina: 'Matemática', p1: 8.5, p2: 9.0, trabalho: 9.5, mediaFinal: 9.0, trimestre: 1, anoLetivo: '2026' },
      { alunoId: aluno.id, disciplina: 'Português', p1: 7.0, p2: 8.0, trabalho: 8.5, mediaFinal: 7.8, trimestre: 1, anoLetivo: '2026' },
      { alunoId: aluno.id, disciplina: 'Matemática', p1: 9.0, p2: 8.5, trabalho: 9.0, mediaFinal: 8.8, trimestre: 2, anoLetivo: '2026' },
    ]
  });

  // 7. Frequência de Pedro
  await prisma.frequencia.createMany({
    data: [
      { alunoId: aluno.id, turmaId: turmaId, data: new Date('2026-07-15T08:00:00Z'), presente: true },
      { alunoId: aluno.id, turmaId: turmaId, data: new Date('2026-07-16T08:00:00Z'), presente: true },
      { alunoId: aluno.id, turmaId: turmaId, data: new Date('2026-07-17T08:00:00Z'), presente: false },
    ]
  });

  // 8. Cardápio inicial
  await prisma.cardapio.createMany({
    data: [
      { data: new Date('2026-07-20T00:00:00Z'), refeicao: 'Arroz, feijão, frango grelhado e salada verde', lanche: 'Salada de frutas com aveia' },
      { data: new Date('2026-07-21T00:00:00Z'), refeicao: 'Macarronada ao sugo, carne moída e brócolis', lanche: 'Bolo de cenoura integral e suco' },
    ]
  });

  // 9. Livros na Biblioteca
  await prisma.livro.createMany({
    data: [
      { titulo: 'O Pequeno Príncipe', autor: 'Antoine de Saint-Exupéry', isbn: '9788522031412', localizacao: 'Prateleira A1', quantidade: 3, capaUrl: '' },
      { titulo: 'Dom Casmurro', autor: 'Machado de Assis', isbn: '9788594318626', localizacao: 'Prateleira B3', quantidade: 2, capaUrl: '' },
    ]
  });

  // 10. Preferências de Notificação padrão
  await prisma.preferenciasNotificacao.createMany({
    data: [
      { userId: respId, receberEmail: true, receberWhatsapp: true },
      { userId: alunoId, receberEmail: false, receberWhatsapp: false },
    ]
  });

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
