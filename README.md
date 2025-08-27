# Hevy Report

Uma aplicação web para análise e acompanhamento de treinos de musculação a partir de dados exportados do aplicativo **Hevy**.

## 📋 Funcionalidades

- **Importação de dados CSV** do Hevy com drag & drop
- **Dashboard consolidado** com métricas de volume de treino
- **Filtros por exercício** para comparações consistentes
- **Cálculo de diferenças percentuais** entre sessões
- **Visualização por cards** organizados por tipo de treino
- **Interface dark mode** responsiva e print-friendly
- **Persistência local** com IndexedDB

## 🚀 Tecnologias

- **React 18** + **TypeScript**
- **Vite** como bundler
- **Tailwind CSS** para estilização
- **Zustand** para gerenciamento de estado
- **Dexie.js** para IndexedDB
- **Papa Parse** para processamento de CSV
- **React Router** para navegação

## 📦 Instalação

1. **Clone o repositório:**
```bash
git clone <repository-url>
cd hevy-report
```

2. **Instale as dependências:**
```bash
npm install
```

3. **Execute o projeto em modo desenvolvimento:**
```bash
npm run dev
```

4. **Acesse a aplicação:**
Abra [http://localhost:3000](http://localhost:3000) no seu navegador.

## 📖 Como Usar

### 1. Exportar dados do Hevy

1. Abra o aplicativo Hevy no seu dispositivo
2. Vá para **Configurações** → **Exportar dados**
3. Selecione o formato **CSV**
4. Baixe o arquivo `HEVY-workouts.csv`

### 2. Importar dados na aplicação

1. Acesse a página **Importação**
2. Arraste e solte o arquivo CSV na área indicada ou clique para selecionar
3. Aguarde o processamento (será exibida uma barra de progresso)
4. Após a importação, visualize os dados na tabela de preview

### 3. Visualizar relatórios

1. Acesse a página **Dashboard**
2. Visualize os cards organizados por tipo de treino (ordem alfabética)
3. Use os filtros de exercícios dentro de cada card para análises específicas
4. Observe as métricas de volume e diferenças percentuais entre sessões

### 4. Funcionalidades avançadas

- **Filtros persistentes**: Suas seleções de exercícios são salvas automaticamente
- **Impressão**: Use Ctrl+P para imprimir relatórios de forma otimizada
- **Responsividade**: Funciona em desktop e dispositivos móveis

## 📊 Métricas Calculadas

### Volume de Treino
- **Fórmula**: `repetições × peso (kg)`
- **Tratamento de nulos**: 
  - Peso nulo = 0 kg
  - Repetições nulas = 1 rep

### Diferenças Percentuais
- **Cálculo**: `((volume_atual - volume_anterior) / volume_anterior) × 100`
- **Cores indicativas**:
  - 🟢 Verde: Aumento de volume
  - 🔴 Vermelho: Diminuição de volume
  - ⚪ Neutro: Sem mudança

### Consolidação por Dia
- Múltiplas sessões do mesmo treino no mesmo dia são consolidadas
- Ordenação cronológica crescente dentro de cada card

## 🗂️ Estrutura do Projeto

```
src/
├── components/          # Componentes React (Atomic Design)
│   ├── atoms/          # Componentes básicos (Button, Card, etc.)
│   ├── molecules/      # Componentes compostos (DropZone, Navigation, etc.)
│   └── organisms/      # Componentes complexos (WorkoutCard)
├── pages/              # Páginas da aplicação
│   ├── ImportPage.tsx  # Página de importação
│   └── DashboardPage.tsx # Dashboard principal
├── services/           # Serviços de dados
│   ├── database.ts     # Configuração IndexedDB (Dexie)
│   └── csvImport.ts    # Processamento de CSV
├── store/              # Gerenciamento de estado (Zustand)
│   └── workoutStore.ts # Store principal
├── types/              # Definições TypeScript
│   └── workout.ts      # Interfaces e tipos
├── utils/              # Utilitários
│   └── workoutCalculations.ts # Cálculos e formatações
└── styles/             # Estilos globais
    └── index.css       # Configuração Tailwind
```

## 🛠️ Scripts Disponíveis

```bash
# Desenvolvimento
npm run dev

# Build para produção
npm run build

# Preview da build
npm run preview

# Linting
npm run lint

# Formatação de código
npm run format
```

## 🎨 Personalização

### Cores do Tema
As cores podem ser personalizadas no arquivo `tailwind.config.js`:

```javascript
theme: {
  extend: {
    colors: {
      dark: {
        bg: '#0f172a',      // Fundo principal
        surface: '#1e293b', // Superfícies (cards, navegação)
        border: '#334155',  // Bordas
        text: '#f1f5f9',    // Texto principal
        'text-secondary': '#94a3b8', // Texto secundário
      },
      success: '#10b981',   // Verde (aumentos)
      error: '#ef4444',     // Vermelho (diminuições)
    }
  }
}
```

## 📱 Responsividade

A aplicação é otimizada para:
- **Desktop**: Experiência completa com layout em grid
- **Tablet**: Adaptação automática dos cards
- **Mobile**: Interface simplificada mas funcional

## 🖨️ Impressão

O layout é otimizado para impressão com:
- Remoção de elementos de navegação
- Ajuste de cores para impressão em preto e branco
- Quebras de página adequadas nos cards
- Footer com data de geração

## 🔧 Desenvolvimento

### Adicionando Novos Relatórios

1. Crie novos tipos em `src/types/workout.ts`
2. Implemente cálculos em `src/utils/workoutCalculations.ts`
3. Crie componentes em `src/components/`
4. Adicione rotas em `src/App.tsx`

### Estrutura de Dados

O CSV do Hevy contém as seguintes colunas principais:
- `title`: Título do treino
- `start_time`: Data/hora de início
- `exercise_title`: Nome do exercício
- `set_index`: Índice do set
- `weight_kg`: Peso em quilogramas
- `reps`: Número de repetições

## 📄 Licença

Este projeto está sob a licença MIT. Veja o arquivo `LICENSE` para mais detalhes.

## 🤝 Contribuição

Contribuições são bem-vindas! Por favor:

1. Faça um fork do projeto
2. Crie uma branch para sua feature (`git checkout -b feature/AmazingFeature`)
3. Commit suas mudanças (`git commit -m 'Add some AmazingFeature'`)
4. Push para a branch (`git push origin feature/AmazingFeature`)
5. Abra um Pull Request

## 📞 Suporte

Se encontrar problemas ou tiver sugestões:
- Abra uma issue no GitHub
- Descreva o problema com detalhes
- Inclua screenshots se necessário
