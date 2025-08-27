# Hevy Report - Contexto Completo do Projeto

## Contexto do Projeto

Este projeto é uma **aplicação web moderna para análise e acompanhamento de treinos de musculação** a partir de dados exportados do aplicativo **Hevy**. A aplicação oferece funcionalidades avançadas de análise que o app original não possui.

### Objetivos Principais

O **objetivo** é oferecer uma plataforma completa de análise que permite ao usuário:
- **Importar dados de treino** em formato CSV com interface drag & drop intuitiva
- **Visualizar evolução do volume de treino** com métricas detalhadas (sets, repetições, carga total)
- **Filtrar por exercícios específicos** para comparações consistentes entre sessões
- **Filtrar por intervalos de data** para análise temporal precisa
- **Avaliar progressão de desempenho** por título de treino e por dia
- **Gerenciar dados** com controles flexíveis de paginação e visualização

### Público-Alvo e Proposta de Valor

O sistema atende **praticantes de musculação** que:
- Registram treinos no Hevy mas precisam de **análises mais profundas**
- Desejam **relatórios personalizados** com foco em volume de carga
- Querem **acompanhar evolução temporal** com filtros avançados
- Necessitam de **interface limpa e profissional** para análise de dados

### Escopo e Funcionalidades Implementadas

**Funcionalidades Core:**
- **Sistema de importação avançado** com validação e feedback em tempo real
- **Dashboard analítico** com métricas consolidadas e filtros múltiplos
- **Interface responsiva em light mode** otimizada para desktop e mobile
- **Persistência local robusta** com IndexedDB para performance
- **Sistema de navegação moderno** com estrutura organizada

**Funcionalidades Avançadas:**
- **Filtros por data** (início e fim) que afetam todos os cálculos
- **Controles toggle** para interface limpa e organizadas
- **Paginação flexível** com seleção de tamanho de página (5-100 registros)
- **Formatação europeia** com vírgula como separador decimal
- **Filtros persistentes** salvos automaticamente no localStorage  

---

## Estrutura de Dados e Definições

### Arquivo CSV do Hevy

O arquivo CSV `./resources/hevy-workouts.csv` contém dados estruturados de treinos exportados do aplicativo Hevy.
**Cada linha representa um set individual** de um exercício específico.

### Colunas Principais do CSV
- `title` - Título/nome do treino (ex: "Push A", "Pull B")
- `exercise_title` - Nome do exercício (ex: "Bench Press", "Deadlift")
- `start_time` - Data/hora de início do treino (formato ISO)
- `end_time` - Data/hora de fim do treino (formato ISO)
- `set_index` - Índice do set dentro do exercício (0, 1, 2...)
- `set_type` - Tipo do set (normal, warmup, dropset, etc.)
- `weight_kg` - Peso utilizado em quilogramas (pode ser nulo)
- `reps` - Número de repetições executadas (pode ser nulo)

### Campos Auxiliares
- `superset_id` - Identificador de superset (quando aplicável)
- `exercise_notes` - Notas específicas do exercício
- `distance_km` - Distância para exercícios cardiovasculares
- `duration_seconds` - Duração para exercícios baseados em tempo
- `rpe` - Rate of Perceived Exertion (escala de esforço percebido)

### Tratamento de Dados
- **Valores nulos em weight_kg**: Tratados como 0 kg
- **Valores nulos em reps**: Tratados como 1 repetição
- **Consolidação por dia**: Múltiplas sessões do mesmo treino no mesmo dia são consolidadas
- **Ordenação**: Dados organizados cronologicamente dentro de cada treino

## Funcionalidades Detalhadas

### Sistema de Navegação

A aplicação possui **estrutura de navegação moderna** com:
- **Header fixo** com logo "Hevy Report"
- **Menu principal** com duas seções:
  - **"Data"** - Página de importação e gerenciamento de dados
  - **"Reports"** - Dropdown com "Workouts" (relatórios de treino)
- **Roteamento** com React Router:
  - `/data` - Página de dados
  - `/reports/workouts` - Página de relatórios de treino
  - Redirects automáticos para URLs antigas

### Página de Dados (/data)

#### Layout e Controles
- **Header com título alinhado à esquerda** ("Data")
- **Botões de controle à direita**:
  - **Toggle "Import"** - Mostra/esconde seção de importação
  - **Botão "Clear Data"** - Remove todos os dados importados

#### Sistema de Importação Avançado
- **Drop zone responsiva** com feedback visual:
  - Drag & drop de arquivos CSV
  - Clique para seleção de arquivo
  - Validação de formato (apenas .csv)
  - Mensagens de erro em inglês
- **Processamento com feedback em tempo real**:
  - Barra de progresso durante importação
  - Contador de registros processados
  - Mensagens de sucesso/erro detalhadas
- **Comportamento de dados**:
  - **Truncate + Insert** (substitui dados existentes)
  - Validação de campos obrigatórios
  - Tratamento de erros com mensagens específicas

#### Visualização de Dados Importados
- **Tabela responsiva** com todas as colunas do CSV
- **Paginação flexível**:
  - Seletor de tamanho de página (5, 10, 25, 50, 100)
  - Controles de navegação (Previous/Next)
  - Numeração de páginas
- **Formatação de dados**:
  - Datas no formato americano (MM/DD/YYYY)
  - Pesos com formatação europeia (vírgula decimal)
  - Índices de linha numerados
- **Interface limpa**:
  - Sem textos desnecessários
  - Foco na funcionalidade
  - Design consistente  

### Página de Relatórios (/reports/workouts)

#### Header com Controles Avançados
- **Título e descrição** alinhados à esquerda
- **Controles de filtro à direita**:
  - **Filtro de data** (From/To) com inputs tipo date
  - **Botão de limpar filtro de data** (✕) quando ativo
  - **Toggle "Filter"** para mostrar/esconder filtros de treino

#### Sistema de Filtros Múltiplos

**Filtro por Intervalo de Data:**
- **Campos From/To** com seleção de data
- **Filtragem em tempo real** que afeta:
  - Todos os cálculos de volume
  - Estatísticas gerais
  - Cards de treino exibidos
  - Diferenças percentuais
- **Botão de limpeza** para resetar filtros rapidamente

**Filtro por Tipos de Treino:**
- **Seção colapsável** controlada por toggle
- **Seleção múltipla** com checkboxes
- **Contador dinâmico** (X de Y treinos selecionados)
- **Botões Select All/Deselect All**
- **Grid responsivo** para organização dos checkboxes
- **Persistência automática** no localStorage

#### Cards de Treino Detalhados

**Estrutura dos Cards:**
- **1 card por tipo de treino** (ordem alfabética)
- **Header com nome do treino** e toggle de filtro de exercícios
- **Listagem cronológica** de sessões (crescente)
- **Dados consolidados por dia**:
  - Data formatada (DD/MM/YYYY HH:MM)
  - Total de sets executados
  - Total de repetições
  - Volume total em kg (formatação europeia)
  - Diferença absoluta vs sessão anterior
  - Diferença percentual (2 casas decimais)

**Filtros de Exercícios por Card:**
- **Lista de exercícios** específicos do treino
- **Seleção múltipla** com checkboxes
- **Contador de selecionados** (X de Y exercícios)
- **Botões Select All/Deselect All**
- **Recálculo dinâmico** ao alterar seleção
- **Persistência por treino** no localStorage

#### Estatísticas Gerais

**Dashboard de Métricas (4 cards):**
- **Total Sets** - Contagem total de sets no período
- **Workout Types** - Número de tipos de treino diferentes
- **Training Sessions** - Total de sessões realizadas
- **Total Volume** - Volume total em kg (formatação europeia)

**Cálculos Dinâmicos:**
- **Todos os filtros afetam as estatísticas**
- **Recálculo automático** ao alterar filtros
- **Consolidação por dia** para múltiplas sessões
- **Tratamento de valores nulos** conforme especificado

#### Indicadores Visuais
- **Verde** - Aumento de volume (diferenças positivas)
- **Vermelho** - Diminuição de volume (diferenças negativas)
- **Neutro** - Sem mudança ou primeira sessão
- **Formatação consistente** em toda a aplicação  

## Interface e Design System

### Tema e Estilização
- **Light mode permanente** (conversão completa do dark mode)
- **Tailwind CSS** como framework de estilização
- **Paleta de cores light**:
  - Background: `bg-gray-50` (cinza muito claro)
  - Superfícies: `bg-white` (branco puro)
  - Texto principal: `text-gray-900` (cinza escuro)
  - Texto secundário: `text-gray-600` (cinza médio)
  - Bordas: `border-gray-200/300` (cinzas claros)
  - Ações primárias: `bg-blue-600` (azul)
  - Sucesso: `text-green-600` (verde)
  - Erro: `text-red-600` (vermelho)

### Arquitetura de Componentes
- **Atomic Design** rigorosamente aplicado:
  - **Atoms**: Button, Card, ProgressBar (componentes básicos)
  - **Molecules**: DropZone, Navigation, ExerciseFilter (componentes compostos)
  - **Organisms**: WorkoutCard (componentes complexos)
- **Componentes reutilizáveis** com props tipadas
- **Consistência visual** em toda a aplicação

### Responsividade e Layout
- **Desktop-first** com adaptação para mobile
- **Grid layouts responsivos** (1 coluna mobile, 2+ colunas desktop)
- **Breakpoints Tailwind** utilizados consistentemente
- **Touch-friendly** em dispositivos móveis
- **Print optimization** com classes `print:` específicas

### Controles de Interface (UX)
- **Toggle buttons** para seções colapsáveis
- **Feedback visual imediato** em interações
- **Estados de loading** com indicadores apropriados
- **Validação em tempo real** com mensagens claras
- **Transições suaves** com classes `transition-*`

### Acessibilidade
- **Contraste adequado** seguindo WCAG guidelines
- **ARIA roles** em tabelas e controles interativos
- **Foco visível** com `focus:ring-*` classes
- **Labels apropriados** para inputs e controles
- **Navegação por teclado** funcional  

## Persistência e Gerenciamento de Estado

### IndexedDB (Dexie.js)
- **Database**: `HevyReportDB`
- **Store principal**: `workouts` 
- **Chave primária**: `id` autogerado
- **Comportamento**: Truncate + Insert (substitui dados existentes)
- **Performance**: Otimizado para grandes volumes de dados
- **Validação**: Campos obrigatórios validados antes da inserção

### State Management (Zustand)
- **Store principal**: `workoutStore.ts`
- **Estados gerenciados**:
  - `workouts` - Array de dados importados
  - `isLoading` - Estado de carregamento
  - `error` - Mensagens de erro
  - `filters` - Filtros ativos (treinos e exercícios)
- **Persistência de filtros**: localStorage para preferências do usuário
- **Ações disponíveis**:
  - `loadWorkouts()` - Carrega dados do IndexedDB
  - `clearData()` - Remove todos os dados
  - `updateFilters()` - Atualiza filtros de treino
  - `updateExerciseFilters()` - Atualiza filtros de exercícios

### LocalStorage
- **Filtros de exercícios**: Persistidos por treino individual
- **Filtros de treinos**: Seleções globais mantidas
- **Preferências de paginação**: Tamanho de página selecionado
- **Chaves organizadas**: Namespace consistente para evitar conflitos

### Logs e Debug
- **Console logs estruturados** para desenvolvimento
- **Error handling robusto** com mensagens específicas
- **Validação de dados** com feedback detalhado
- **Performance monitoring** em operações críticas

## Stack Tecnológico Completo

### Core Technologies
- **React 18** - Framework principal com hooks modernos
- **TypeScript** - Tipagem estática rigorosa
- **Vite** - Build tool e dev server (porta 5173)
- **Node.js >= 18** - Runtime requirement

### Libraries e Dependências
- **React Router** - Roteamento SPA com navegação moderna
- **Zustand** - State management leve e performático
- **Dexie.js** - Wrapper do IndexedDB com TypeScript
- **Papa Parse** - Parser CSV robusto com streaming
- **Tailwind CSS** - Framework CSS utility-first

### Ferramentas de Desenvolvimento
- **ESLint** - Linting com regras TypeScript/React
- **Prettier** - Formatação automática de código
- **PostCSS** - Processamento CSS com Tailwind
- **TypeScript Compiler** - Verificação de tipos

### Scripts Disponíveis
```bash
npm run dev      # Servidor de desenvolvimento
npm run build    # Build para produção
npm run preview  # Preview da build
npm run lint     # Verificação de código
npm run format   # Formatação com Prettier
```

### Configurações Importantes
- **Tailwind**: Configurado para light mode com cores customizadas
- **Vite**: Otimizado para desenvolvimento e build
- **TypeScript**: Strict mode habilitado
- **ESLint**: Regras para React, TypeScript e hooks  

## Estrutura de Arquivos Implementada

```
hevy-report/
├── public/
│   └── vite.svg
├── resources/
│   ├── HEVY-workouts.csv      # Dados de exemplo
│   └── app-screenshot.png     # Screenshot da aplicação
├── src/
│   ├── components/
│   │   ├── atoms/
│   │   │   ├── Button.tsx     # Botão reutilizável
│   │   │   ├── Card.tsx       # Container de conteúdo
│   │   │   └── ProgressBar.tsx # Barra de progresso
│   │   ├── molecules/
│   │   │   ├── DropZone.tsx   # Área de upload CSV
│   │   │   ├── Navigation.tsx # Menu principal
│   │   │   └── ExerciseFilter.tsx # Filtro de exercícios
│   │   └── organisms/
│   │       └── WorkoutCard.tsx # Card completo de treino
│   ├── pages/
│   │   ├── DataPage.tsx       # Página de dados (/data)
│   │   └── WorkoutReportsPage.tsx # Relatórios (/reports/workouts)
│   ├── services/
│   │   ├── database.ts        # Configuração Dexie/IndexedDB
│   │   └── csvImport.ts       # Processamento CSV
│   ├── store/
│   │   └── workoutStore.ts    # Store Zustand principal
│   ├── types/
│   │   └── workout.ts         # Interfaces TypeScript
│   ├── utils/
│   │   └── workoutCalculations.ts # Cálculos e formatação
│   ├── styles/
│   │   └── index.css          # Estilos globais + Tailwind
│   ├── App.tsx                # Componente raiz com roteamento
│   └── main.tsx               # Entry point da aplicação
├── index.html                 # Template HTML
├── package.json               # Dependências e scripts
├── tailwind.config.js         # Configuração Tailwind
├── tsconfig.json              # Configuração TypeScript
├── vite.config.ts             # Configuração Vite
├── README.md                  # Documentação completa
└── context.md                 # Este arquivo de contexto
```

## Detalhes de Implementação Críticos

### Formatação e Localização
- **Números decimais**: Vírgula como separador (formatação europeia)
- **Separador de milhares**: Espaço (ex: "1 234,56 kg")
- **Datas**: Formato americano para inputs, brasileiro para exibição
- **Função formatWeight()**: Implementa formatação europeia consistente

### Cálculos de Volume
```typescript
// Fórmula base
volume = reps * weight_kg

// Tratamento de nulos
if (weight_kg === null) weight_kg = 0
if (reps === null) reps = 1

// Diferenças percentuais
diff_percent = ((current_volume - previous_volume) / previous_volume) * 100
```

### Filtros e Performance
- **Filtros aplicados em cascata**: Data → Treinos → Exercícios
- **Recálculo otimizado**: useMemo para evitar recálculos desnecessários
- **Persistência inteligente**: Apenas filtros relevantes salvos
- **Validação de estado**: Verificações antes de aplicar filtros

### Estados de Interface
- **Loading states**: Feedback visual durante operações
- **Error boundaries**: Tratamento robusto de erros
- **Empty states**: Mensagens apropriadas quando sem dados
- **Toggle states**: Controles colapsáveis para UX limpa

### Navegação e Roteamento
```typescript
// Rotas implementadas
"/" → redirect para "/data"
"/data" → DataPage (importação e gerenciamento)
"/reports/workouts" → WorkoutReportsPage (análises)

// Redirects legados
"/import" → "/data"
"/dashboard" → "/reports/workouts"
```

## Funcionalidades Futuras Sugeridas

### Relatórios Adicionais
- **Análise por hora do dia**: Performance vs horário de treino
- **Progressão por exercício**: Evolução individual de exercícios
- **Comparação de períodos**: Análise temporal avançada
- **Exportação de relatórios**: PDF/Excel com dados filtrados

### Melhorias de UX
- **Temas customizáveis**: Opções de cores personalizadas
- **Dashboards personalizáveis**: Widgets configuráveis
- **Notificações**: Alertas para metas e progressos
- **Backup/sync**: Sincronização entre dispositivos

### Integrações
- **API do Hevy**: Sincronização automática (se disponível)
- **Outros apps fitness**: Suporte a múltiplas fontes
- **Wearables**: Integração com dispositivos fitness
- **Redes sociais**: Compartilhamento de progressos

---

## Prompt para Replicação

**Para recriar este projeto exatamente**, uma LLM deve:

1. **Implementar a estrutura de arquivos completa** conforme especificado
2. **Seguir rigorosamente o Atomic Design** com componentes tipados
3. **Implementar todos os filtros** (data, treinos, exercícios) com persistência
4. **Usar formatação europeia** para números decimais (vírgula)
5. **Criar interface em light mode** com paleta de cores especificada
6. **Implementar controles toggle** para seções colapsáveis
7. **Garantir responsividade** desktop-first com adaptação mobile
8. **Configurar roteamento completo** com redirects legados
9. **Implementar paginação flexível** com seleção de tamanho
10. **Seguir todas as especificações de cálculo** e tratamento de dados

**Resultado esperado**: Aplicação funcional idêntica ao Hevy Report com todas as funcionalidades implementadas e interface profissional.
