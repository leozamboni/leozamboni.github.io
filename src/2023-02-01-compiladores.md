% Notas sobre o livro _Compiladores Princípios, técnicas e ferramentas 2ª Edição_
% Leonardo Z. N.
% 01/02/2023

# Notas sobre o livro _Compiladores Princípios, técnicas e ferramentas 2ª Edição_

O objetivo desse artigo é fazer anotações sobre o livro, tentar clarificar alguns termos e adicionar alguns links úteis em palavras chaves.

- Notações feitas a partir de um exemplar físico original, traduzido em Português brasileiro e editado por Pearson Addison Wesley, que eu mesmo comprei;
- Exercícios resolvidos sem nenhuma garantia e com base na minha atual experiência;
- Pode e vai conter erros de digitação.

## Introdução

Linguagens de programação são **notações** para descrever computação para **pessoas** e para **máquinas**.

**Todo software executando em todos os computadores foi escrito em alguma linguagem de programação**,
mas para um programa rodar, precisa ser **traduzido** para um formato que o computador consiga **executar**.

Os softwares que fazem essa tradução são chamados de **[compiladores](https://pt.wikipedia.org/wiki/Compilador)**.

## 1.1 Processadores de Linguagem

- Um compilador recebe como **entrada** um programa escrito em uma linguagem de programação (**linguagem fonte**);
- E **retorna** o mesmo programa **traduzido** em outra linguagem (**linguagem objeto**).

```
                    .------------.
  Programa fonte -> | Compilador | -> Programa Objeto
                    --------------
```

Se o programa objeto (**saida**) estiver em uma **linguagem executável** (linguagens interpretadas ou [linguagem de máquina](https://pt.wikipedia.org/wiki/C%C3%B3digo_de_m%C3%A1quina), por exemplo), poderá ser **chamado** pelo usuário (**executado pelo máquina**).

Interpretadores também é um **processador de linguagem**. Mas em vez de produzir um **programa objeto**, um interpretador **executa diretamente** as operações do **programa fonte**.

```
                       .---------------.
     Programa fonte -> | Interpretador | -> Saída
Entradas do Usuário -> |               |
                       -----------------
```

- O **programa objeto** em **linguagem de máquina** produzido por um **compilador**, normalmente é muito **mais rápido** (na execução do programa objeto) que um interpretador;
- Um **interpretador**, normalmente tem um **melhor diagnóstico de erro**, poís **executa** o programa fonte **instrução por instrução**.

### Exemplo 1.1

[Java](<https://pt.wikipedia.org/wiki/Java_(linguagem_de_programa%C3%A7%C3%A3o)>) combina os dois modelos, compilação e interpretação.

```
                  .------------.                           .------------------.
Programa fonte -> | Compilador | -> Prog. Intermediário -> |   Interpretador  | -> Saída
                  --------------    Entradas do Usuário -> | (Máquina Virtual)|
                                                           --------------------
```

- Programa objeto: **_quase_ executável**;
- Programa Intermediável: **mesmo programa em outra linguagem**.

Alguns compiladores Java são **just-in-time**, traduzem os [bytecodes](https://pt.wikipedia.org/wiki/Bytecode) um atrás do outro, **antes** de executar o programa intermediário.

### Programa Objeto -> Programa Objeto Executável

Após gerar um **programa objeto** através de um **compilador**, alguns **outros programas** podem ser **necessários** para gerar o **programa objeto executável**.

As vezes um programa pode estar **divido em diversos arquivos**, a tarefa de **juntar o programa fonte** às vezes é feita por um **programa separado**, chamado **pré-processador**.

```
               .-----------------.                              .------------.
Prog. Fonte -> | Pré-processador | -> Prog. Fonte Modificado -> | Compilador | -> Prog. Obj. (Assembly)
               -------------------                              --------------
   .----------.                       .--------------------.
-> | Montador | -> Cód. de Máquina -> | Carregador de libs | -> Prog. Obj. executável
   ------------                       ----------------------
```

### Exercícios

```
1.1.1: Qual é a diferenças entre compilador e interpretador?
    - Compilador gera um arquivo objeto (que geralmente roda mais rápido) a partir do arquivo fonte, que pode ou não ser em uma linguagem executável.
    - Intepretador executa o arquivo fonte (trata melhor os erros).

1.1.2: Vantagens em relação ao outro?
    - Compiladores geralmente resultam em um programa objeto executável que roda mais rápido.
    - Interpretadores geralmente possuem um tratamento de erro melhor.

1.1.3: Vantagens de um sistema de processamente de linguagem que resulta em linguagem simbólica em vez de linguagem de máquina?
    Maior portabilidade, já que cada processador possue uma linguagem de máquina com instruções diferente.

1.1.4: Sobre compiladores **fonte para fonte** (que compilam para uma linguagem do mesmo nível). Qual a vantagem de usar C como linguagem objeto de um compilador?
    C é uma linguagem de fácil entendimento com uma syntax relativamente simples, que possue diversos compiladores extremamente validados e mantidos por suas comunidades. Usar C como código intermediário facilita a criação do executável usando um compilador mais amplamente usado (Clang ou GCC, por exemplo). Além de facilitar a construção de geradores de códigos dentro de um compilador, já que a syntax é simples e oferece maior capacidade para a linguagem fonte em relação ao gerenciamento de memória do computador.

1.1.5: Sobre programas montadores:
    Um programa montador precisa ser capaz de realizar a tarefa de transformar o código fonte em um código de máquina de acordo com a arquitetura do computador que está sendo executado.

```

## 1.2 Estrutura de um Compilador

Um Compilador possui duas partes, **análise** e **síntese**.

- **Análise**: Geralmente chamada de **front-end**, **subdivide** o programa fonte, **impõe uma [estrutura gramatical](https://pt.wikipedia.org/wiki/Gram%C3%A1tica)**, trata exceções caso o programa fonte não siga a gramática e armazena informações sobre o programa fonte em uma estrutura chamada **tabela de símbolos**;
- **Síntese**: **Back-end**, cria o programa objeto com base em uma representação intermediária e com a tabela de símbolos.

### Análise Léxica

- Primeira fase do compilador (chamado também de análise léxica, lexing ou scanning);
- O analisador léxico (lexer, lex ou scanner) **lê o fluxo de caracteres do programa fonte e os agrupa de forma significativa**, formando lexemas. Para cada lexema o lexer cria um **token** e retorna para a próxima fase do compilador, a **análise sintática**.

```
(nome, valorAtribuido)
```

Onde o nome é o símbolo do token no programa fonte e o valorAtribuido, aponta uma entrada na tabela de símbolos.

### Análise Sintática

- Segunda fase do compilador;
- A análise sintática usa o nome dos tokens para gerar uma representação intermediária tipo árvore;
- Pode acontecer no mesmo momento que a análise semântica??

### Análise Semântica

- Analisa se a ordem das palavras estão em seus devidos lugares;
- Também faz a validação de tipos;
- Dependendo a linguagem pode haver coerções.

### Geração de Código Intermediário

- Um compilador pode produzir uma ou mais representaçõess intermediárias, as quias podem ter diversas formas;
- Árvores de sintax denotam uma forma de representação intermediária, normalmante usado na análise sintática e semântica;
- Após as análises sintática e semântica, muitos compiladores produzem uma representação explicita de baixo nível ou linguagem de máquina.

### Otimização de Código

- Otimização independente de arquitetura faz transformações no código intermediário com o objetivo de produzir um código objeto melhor.

### Geração de Código

- Recebe como entrada uma representação intermediária do programa fonte e mapeia em uma linguagem objeto;
- Se a linguagem objeto for assembly de alguma arquitetura, deve ser selecionado registradores para cada variável.

### Gerenciamento da Tabela de Símbolos

- Registrar os nomes de variáveis usados no programa fonte e coletar informações sobre diversos atributos de cada nome,
  como a linha que se encontra, espaço alocado na memória, seu tipo...
- É uma estrutura de dados contendo um registro para cada nome de variável, com campos para cada atributo.

### O Agrupamento de Fases em Passos

- Em uma implementação as vezes podem ser agrupadas em passos;
- O front-end pode ser agrupado em um único passo;
- Otimização de código pode ser um passo opcional;
- O back-end pode ser agrupado em um único passo;

### Ferramentas Para Construção de Compiladores

- Geradores de analisadores sintáticos;
- Geradores de analisadores léxico;
- Mecanismos de tradução dirigida por sintaxe;
- Geradores de gerador de código;
- Mecanismos de análise de fluxo de dados;
- Conjunto de ferramentas para construção de compiladoress.
