# Prompt training report

## Contexto do Projeto

Este projeto consiste em desenvolver uma aplicação web para **análise e acompanhamento de treinos de musculação** a partir de dados exportados do aplicativo **Hevy**.  

O **objetivo** é oferecer uma visualização consolidada dos treinos realizados, permitindo que o usuário:  
- Importe os dados de treino em formato CSV;  
- Tenha uma visão clara da **evolução do volume de treino** (sets, repetições e carga total);  
- Consiga filtrar exercícios específicos para garantir comparações consistentes entre sessões;  
- Avalie a progressão de desempenho **por título de treino e por dia**.  

O sistema foi pensado para atender **praticantes de musculação** que registram seus treinos no Hevy, mas desejam **relatórios complementares** com foco em **volume de carga** e **evolução ao longo do tempo**, algo que o app original não oferece de forma flexível.  

O escopo inicial se concentra em:  
- **Importação de dados** de maneira simples e rápida;  
- **Dashboard numérico consolidado**, com indicadores de evolução claros;  
- **Design responsivo e em dark mode**, priorizando uso em desktop, mas com compatibilidade em dispositivos móveis.  

No futuro, a aplicação pode evoluir para incluir relatórios adicionais (ex.: desempenho por hora do dia), exportações ou integrações mais avançadas.  

---

## Definição

O arquivo CSV `./resources/hevy-workouts.csv` possui informações sobre treinos feitos por um indivíduo.  
Cada linha representa um **set** de um exercício.  

### Colunas principais do CSV
- `title` (título do treino)
- `exercise_title` (nome do exercício)
- `start_time` (data/hora início do treino)
- `end_time` (data/hora fim do treino)
- `set_index`
- `set_type`
- `weight_kg`
- `reps`
- Outros campos auxiliares (`superset_id`, `exercise_notes`, `distance_km`, `duration_seconds`, `rpe`).

## Funcionalidades

### Importação
- Tela com **drop zone** para receber arquivo CSV.  
- Ao soltar/selecionar o arquivo, o sistema importa os dados para o **IndexedDB**.  
- Sempre que houver importação, o comportamento é **truncate + insert** (não há update).  
- Barra de progresso mostrando linhas importadas / total de linhas.  
- Feedback final: `X registros importados com sucesso do CSV`.  
- Parte inferior: tabela simples com paginação, exibindo **todas as colunas do CSV + índice da linha original**.  
- Sem CRUD de treinos/exercícios.  
- Caso o CSV esteja vazio/corrompido/fora do padrão, o sistema deve exibir a exceção para o usuário.  

### Dashboard
- Página separada acessada por **React Router**.  
- Apresenta **cards isolados** (1 card por treino).  
- Dentro de cada card: listagem consolidada **por dia** (ordem cronológica crescente).  
- Cards exibidos em ordem **alfabética** pelo título do treino.  
- **Dados consolidados por dia**:
  - Nome do treino (header do card).
  - Data do treino (`dd/MM/yyyy HH:mm`, apenas para exibição).
  - Total de sets (contagem de linhas).
  - Total de repetições.
  - Volume total em kg = soma de (`reps * weight_kg`) considerando exercícios selecionados.
  - Diff absoluto do volume (kg) em relação ao dia anterior (mesmo título de treino).
  - Diff percentual em relação ao dia anterior.
    - 2 casas decimais.
    - 0 e 0% quando não houver treino anterior.  
- **Cálculo de volume**:
  - Cada row é 1 set.
  - Volume do set = `reps * weight_kg`.
  - Se `weight_kg` for nulo → 0.
  - Se `reps` for nulo → 1.
- **Filtros dentro de cada card**:
  - Lista/select de exercícios distintos do treino.
  - Todos **selecionados por padrão**.
  - Usuário pode marcar/desmarcar → recalcula a tabela dinamicamente.
  - Filtro salvo em **localStorage** (persistência por treino).  
- **Filtros de treino**:
  - Select geral de títulos de treino (igual ao filtro de exercícios).
  - Todos selecionados por padrão.
  - Persistido em localStorage.  
- **Tratamento de múltiplas sessões no mesmo dia**: consolidar em uma linha única.  
- **Indicadores visuais**:
  - Diferença positiva = verde.
  - Diferença negativa = vermelho.
  - Zero = cor default.  

### Interface e design system
- **Dark mode** permanente (sem toggle).  
- **Tailwind CSS**.  
- **Atomic Design** (somente componentes utilizados).  
- Layout orientado para **desktop** (responsivo apenas para ajuste mínimo).  
- Dashboard deve ser **printável via Ctrl+P** de forma apresentável.  

### Acessibilidade
- Seguir boas práticas mínimas: contraste adequado, uso de ARIA roles em tabelas/inputs, foco visível.  

### Persistência
- IndexedDB com **uma única store** (`workouts`).  
- Chave primária: `id` autogerado.  
- Salvar todos os registros importados.  

### Logs
- Logs no console para debug (funcionais, sem dados sensíveis).  

## Tecnologia
- **React + TypeScript**.  
- **Vite** como bundler.  
- **Node.js >= 18**.  
- **Zustand** para state management.  
- **Papa Parse** para leitura do CSV.  
- **Dexie.js** para acesso ao IndexedDB.  
- **ESLint + Prettier** configurados.  
- Scripts padrão do Vite (`dev`, `build`, `preview`).  

## Estrutura de pastas sugerida
```
src/
  components/    # componentes atômicos, moleculares, etc
  pages/         # telas (Importação, Dashboard)
  store/         # Zustand (filtros, estados globais)
  services/      # IndexedDB (Dexie), importação CSV
  utils/         # helpers (formatar datas, cálculos de volume/diffs, etc.)
  styles/        # configs globais do Tailwind
```

## Notas para relatórios futuros
- Relatório de treino **por hora do dia**, avaliando desempenho conforme o horário em que foi executado, independentemente da data.
