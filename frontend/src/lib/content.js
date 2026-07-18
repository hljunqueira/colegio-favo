export const SCHOOL = {
  name: "Favo de Mel",
  full: "Centro Educacional Favo de Mel",
  tagline: "Educação Infantil e Ensino Fundamental · Berçário ao 9º ano",
  slogan: "A educação em que nós acreditamos",
  phone: "(48) 99627-5127",
  phoneRaw: "5548996275127",
  address: "Av. Florianópolis - Centro, Balneário Arroio do Silva - SC, 88914-000",
  rating: "4,4",
  reviews: "47",
  instagram: "https://instagram.com/",
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
    text: "Cada criança chega ao Favo de Mel com uma história única. Nosso primeiro compromisso é acolher — criar um lugar onde ela se sinta segura, amada e pertencente.",
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
  "Acolher", "Brincar", "Florescer", "Afeto", "Descoberta", "Autonomia", "Cuidado", "Alegria",
];
