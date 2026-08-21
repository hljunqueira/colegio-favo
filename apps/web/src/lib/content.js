export const SCHOOL = {
  name: "Colégio Favo",
  full: "Colégio Favo",
  tagline: "Educação Infantil e Ensino Fundamental · Berçário ao 9º ano",
  slogan: "A educação em que nós acreditamos",
  phone: "(48) 99627-5127",
  phoneRaw: "5548996275127",
  address: "Av. Florianópolis - Centro, Balneário Arroio do Silva - SC, 88914-000",
  rating: "4,4",
  reviews: "47",
  instagram: "https://www.instagram.com/colegiofavo/",
};

export const IMAGES = {
  hero: "https://images.unsplash.com/photo-1613794713137-a78aba4be84a?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NTY2NzB8MHwxfHNlYXJjaHwxfHxraW5kZXJnYXJ0ZW4lMjBraWRzJTIwcGxheWluZyUyMHdhcm0lMjBzdW5saWdodHxlbnwwfHx8fDE3ODQyOTQxNjN8MA&ixlib=rb-4.1.0&q=85",
  classroom: "https://images.pexels.com/photos/8535629/pexels-photo-8535629.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940",
  play: "https://images.unsplash.com/photo-1597075958693-75173d1c837f?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NTY2NzB8MHwxfHNlYXJjaHwyfHxraW5kZXJnYXJ0ZW4lMjBraWRzJTIwcGxheWluZyUyMHdhcm0lMjBzdW5saWdodHxlbnwwfHx8fDE3ODQyOTQxNjN8MA&ixlib=rb-4.1.0&q=85",
  honeycomb: "https://images.pexels.com/photos/33045251/pexels-photo-33045251.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940",
};

export const PROGRAMS = [
  {
    n: "01",
    title: "Berçário & Maternal",
    age: "4 meses — 3 anos",
    desc: "Um ninho seguro e afetuoso. Estimulação sensorial, cuidado e rotina com carinho e atenção individual a cada bebê.",
    img: IMAGES.hero,
  },
  {
    n: "02",
    title: "Educação Infantil",
    age: "4 — 5 anos",
    desc: "A descoberta do mundo pelo brincar. Linguagem, movimento e as primeiras amizades em um ambiente lúdico e acolhedor.",
    img: IMAGES.play,
  },
  {
    n: "03",
    title: "Fundamental I",
    age: "1º ao 5º ano",
    desc: "A base do conhecimento com afeto. Letramento, raciocínio lógico e autonomia, respeitando o tempo de cada criança.",
    img: IMAGES.classroom,
  },
  {
    n: "04",
    title: "Fundamental II",
    age: "6º ao 9º ano",
    desc: "Pensamento crítico e protagonismo. Preparamos jovens curiosos, responsáveis e prontos para os próximos desafios.",
    img: IMAGES.play,
  },
];

export const MANIFESTO = [
  {
    n: "01",
    title: "Acolher",
    text: "Cada criança chega ao Colégio Favo com uma história única. Nosso primeiro compromisso é acolher — criar um lugar onde ela se sinta segura, amada e pertencente.",
  },
  {
    n: "02",
    title: "Brincar",
    text: "Brincar é coisa séria. É brincando que a criança pensa, cria, resolve e se relaciona. Nossa pedagogia coloca o brincar no centro de cada dia.",
  },
  {
    n: "03",
    title: "Florescer",
    text: "Como abelhas em um favo, cada pequeno gesto constrói algo maior. Cultivamos autonomia, afeto e curiosidade para que cada criança floresça no seu tempo.",
  },
];

export const GALLERY = [
  { img: IMAGES.hero, span: "row-span-2", label: "Cantinho do afeto" },
  { img: IMAGES.classroom, span: "", label: "Sala de aula" },
  { img: IMAGES.play, span: "", label: "Pátio & brincadeiras" },
  { img: IMAGES.honeycomb, span: "row-span-2", label: "Nossa essência" },
  { img: IMAGES.play, span: "", label: "Atividades ao ar livre" },
  { img: IMAGES.classroom, span: "", label: "Descobertas" },
];

export const MARQUEE_WORDS = [
  "Acolher", "Brincar", "Florescer", "Afeto", "Descoberta", "Autonomia", "Cuidado", "Alegria", "Criatividade", "Inclusão"
];

export const DIFFERENTIALS = [
  {
    icon: "HeartHandshake",
    title: "Acolhimento & Afeto",
    desc: "Adaptação humanizada e acompanhamento emocional que respeita a individualidade e o ritmo único de cada criança.",
    tag: "Humanização"
  },
  {
    icon: "Utensils",
    title: "Nutrição Balanceada & Saudável",
    desc: "Cardápio planejado por nutricionista especializada, com refeições balanceadas, frescas e preparadas diariamente na própria escola.",
    tag: "Saúde & Sabor"
  },
  {
    icon: "Globe2",
    title: "Iniciação Bilíngue Lúdica",
    desc: "Imersão diária e divertida na língua inglesa através de cantigas, brincadeiras, contação de histórias e comandos do dia a dia.",
    tag: "Futuro Global"
  },
  {
    icon: "Music",
    title: "Música, Artes & Psicomotricidade",
    desc: "Atividades que desenvolvem a coordenação motora, ritmo corporal, inteligência espacial e sensibilidade artística desde o berçário.",
    tag: "Expressão Criativa"
  },
  {
    icon: "Sprout",
    title: "Contato com a Natureza",
    desc: "Pátio arborizado com horta pedagógica, areia limpa e momentos diários ao ar livre para vivenciar a terra, o sol e a vida.",
    tag: "Espaço Livre"
  },
  {
    icon: "ShieldCheck",
    title: "Segurança Total & Monitoramento",
    desc: "Acesso rigorosamente controlado por portaria, câmeras internas e equipe completa certificada com suporte a primeiros socorros.",
    tag: "Tranquilidade"
  }
];

export const FACILITIES = [
  {
    title: "Berçário Climatizado & Lactário",
    desc: "Ambiente higienizado com piso térmico antialérgico, berços individuais, trocadores higiênicos e lactário exclusivo.",
    badge: "0 a 2 anos",
    img: "https://images.unsplash.com/photo-1596495578065-6e0763fa1178?crop=entropy&cs=srgb&fm=jpg&q=85&w=800"
  },
  {
    title: "Brinquedoteca & Cantinho da Leitura",
    desc: "Espaço rico em brinquedos pedagógicos, blocos de montar, fantasias e almofadas acolhedoras para imersão na imaginação.",
    badge: "Desenvolvimento Lúdico",
    img: "https://images.unsplash.com/photo-1587654780291-39c9404d746b?crop=entropy&cs=srgb&fm=jpg&q=85&w=800"
  },
  {
    title: "Parque ao Ar Livre & Horta Pedagógica",
    desc: "Área verde com brinquedos seguros, gramado e canteiros onde as crianças plantam, cuidam e colhem alimentos reais.",
    badge: "Natureza & Ar Puro",
    img: "https://images.unsplash.com/photo-1597075958693-75173d1c837f?crop=entropy&cs=srgb&fm=jpg&q=85&w=800"
  },
  {
    title: "Ateliê Maker & Sala Multissensorial",
    desc: "Bancadas dedicadas para tintas, argila, experiências científicas práticas e desenvolvimento de projetos maker.",
    badge: "Criatividade & Ciência",
    img: "https://images.pexels.com/photos/8535629/pexels-photo-8535629.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=800"
  },
  {
    title: "Refeitório Infantil Aconchegante",
    desc: "Mobiliário adaptado na altura correta das crianças para estimular a autonomia e o convívio social prazeroso durante as refeições.",
    badge: "Alimentação & Autonomia",
    img: "https://images.unsplash.com/photo-1577896851231-70ef18881754?crop=entropy&cs=srgb&fm=jpg&q=85&w=800"
  },
  {
    title: "Quadra Poliesportiva Coberta",
    desc: "Espaço multiuso amplo para jogos em equipe, circuito psicomotor, aulas de educação física e celebrações com as famílias.",
    badge: "Esportes & Eventos",
    img: "https://images.unsplash.com/photo-1584464491033-06628f3a6b7b?crop=entropy&cs=srgb&fm=jpg&q=85&w=800"
  }
];

export const TESTIMONIALS = [
  {
    name: "Mariana Vasconcellos",
    role: "Mãe do Bento (Maternal II)",
    text: "O acolhimento do Colégio Favo transformou a adaptação do Bento. Em uma semana ele já entrava correndo e com um sorriso lindo no rosto. A equipe tem um carinho e transparência impecáveis!",
    rating: 5,
    city: "Balneário Arroio do Silva"
  },
  {
    name: "Rodrigo Alencar",
    role: "Pai da Cecília (Jardim I) e Luísa (Berçário)",
    text: "Ter as duas filhas no Favo me dá uma tranquilidade absoluta durante a jornada de trabalho. A alimentação é maravilhosa, o portal online facilita tudo e o amor que as tias dedicam é de emocionar.",
    rating: 5,
    city: "Araranguá"
  },
  {
    name: "Camila Guimarães",
    role: "Mãe do Joaquim (1º ano Fundamental)",
    text: "A transição da educação infantil para o Fundamental foi leve e muito estimulante. Ele aprendeu a ler com prazer e entusiasmo. É uma escola que educa com afeto e valores humanos verdadeiros.",
    rating: 5,
    city: "Balneário Arroio do Silva"
  }
];

export const ENROLLMENT_STEPS = [
  {
    step: "01",
    title: "Agende sua Visita",
    desc: "Entre em contato via WhatsApp ou formulário e venha tomar um café conosco para conhecer os ambientes e a equipe.",
    action: "Agendar agora"
  },
  {
    step: "02",
    title: "Encontro com a Coordenação",
    desc: "Apresentamos detalhadamente nossa proposta pedagógica, rotinas diárias e tiramos todas as suas dúvidas.",
    action: "Proposta pedagógica"
  },
  {
    step: "03",
    title: "Matrícula Digital Descomplicada",
    desc: "Envio de documentos de forma 100% online através do nosso portal, sem filas ou burocracia de papel.",
    action: "Portal ágil"
  },
  {
    step: "04",
    title: "Boas-Vindas à Colmeia!",
    desc: "Período de adaptação suave e assistida, garantindo segurança e alegria no primeiro dia do seu filho.",
    action: "Início acolhedor"
  }
];

export const FAQ_ITEMS = [
  {
    q: "A partir de qual idade o Colégio Favo recebe alunos?",
    a: "Nosso Berçário acolhe bebês com muito carinho a partir de 4 meses de idade. Atendemos todas as etapas: Berçário, Maternal, Educação Infantil e Ensino Fundamental (1º ao 9º ano)."
  },
  {
    q: "Quais são as opções de turnos e horários disponíveis?",
    a: "Oferecemos três modalidades flexíveis para atender a rotina da sua família: Turno Matutino (07h30 às 11h45), Turno Vespertino (13h15 às 17h30) e Período Integral (07h00 às 18h30 com alimentação completa inclusa)."
  },
  {
    q: "Como funciona o período de adaptação da criança?",
    a: "A adaptação é gradual, respeitosa e personalizada. Nos primeiros dias, o tempo de permanência aumenta progressivamente com a presença dos responsáveis nas proximidades, respeitando os sinais e a segurança emocional do pequeno."
  },
  {
    q: "Como a família acompanha a rotina escolar e os avisos diários?",
    a: "Disponibilizamos o Portal do Responsável (web e mobile) com relatórios diários de sono e alimentação (para bebês), agenda de recados, notas, frequência, cardápio semanal e canal direto com a coordenação."
  },
  {
    q: "A escola oferece alimentação para os alunos?",
    a: "Sim! Contamos com cozinha própria e cardápio elaborado por nutricionista. Alunos do período integral recebem café da manhã, almoço balanceado, lanche da tarde e jantar leve, além de adaptações para restrições alimentares ou alergias."
  },
  {
    q: "Como agendar uma visita presencial para conhecer o colégio?",
    a: "Você pode clicar no botão de 'Agende uma visita' ou nos enviar uma mensagem direta pelo WhatsApp no (48) 99627-5127. Será um prazer receber a sua família!"
  }
];
