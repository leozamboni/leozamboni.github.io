% [pt-br] Notas e Estudos _Compiladores Princípios, técnicas e ferramentas 2ª Edição_
% Leonardo Z. N.
% 01/02/2023

# Notas e Estudos _Compiladores Princípios, técnicas e ferramentas 2ª Edição_

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

Se o programa objeto (**saída**) estiver em uma **linguagem executável** (linguagens interpretadas ou [linguagem de máquina](https://pt.wikipedia.org/wiki/C%C3%B3digo_de_m%C3%A1quina), por exemplo), poderá ser **chamado** pelo usuário (**executado pelo máquina**).

Interpretadores também é um **processador de linguagem**. Mas em vez de produzir um **programa objeto**, um interpretador **executa diretamente** as operações do **programa fonte**.

```
                       .---------------.
     Programa fonte -> | Interpretador | -> Saída
Entradas do Usuário -> |               |
                       -----------------
```

- O **programa objeto** em **linguagem de máquina** produzido por um **compilador**, normalmente é muito **mais rápido** (na execução do programa objeto) que um interpretador;
- Um **interpretador**, normalmente tem um **melhor diagnóstico de erro**, pois **executa** o programa fonte **instrução por instrução**.

### Exemplo 1.1

[Java](<https://pt.wikipedia.org/wiki/Java_(linguagem_de_programa%C3%A7%C3%A3o)>) combina os dois modelos, compilação e interpretação.

```
                  .------------.                           .------------------.
Programa fonte -> | Compilador | -> Prog. Intermediário -> |   Interpretador  | -> Saída
                  --------------    Entradas do Usuário -> | (Máquina Virtual)|
                                                           --------------------
```

- Programa objeto: **executável**;
- Programa Intermediário: **mesmo programa em outra linguagem**.

Alguns compiladores Java são **just-in-time**, traduzem os [bytecodes](https://pt.wikipedia.org/wiki/Bytecode) um atrás do outro, **antes** de executar o programa intermediário.

Após gerar um **programa objeto** através de um **compilador**, alguns **outros programas** podem ser **necessários** para gerar o **programa objeto executável**.

Às vezes um programa pode estar **dividido em diversos arquivos**, a tarefa de **juntar o programa fonte** às vezes é feita por um **programa separado**, chamado **pré-processador**.

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
1.1.1: Qual é a diferença entre compilador e interpretador?
    - Compilador gera um arquivo objeto (que geralmente roda mais rápido) a partir do arquivo fonte, que pode ou não ser em uma linguagem executável.
    - Interpretador executa o arquivo fonte (trata melhor os erros).

1.1.2: Vantagens em relação ao outro?
    - Compiladores geralmente resultam em um programa objeto executável que roda mais rápido.
    - Interpretadores geralmente possuem um tratamento de erro melhor.

1.1.3: Vantagens de um sistema de processamento de linguagem que resulta em linguagem simbólica em vez de linguagem de máquina?
    Maior portabilidade, já que cada processador possui uma linguagem de máquina com instruções diferentes.

1.1.4: Sobre compiladores **fonte para fonte** (que compilam para uma linguagem do mesmo nível). Qual a vantagem de usar C como linguagem objeto de um compilador?
    C é uma linguagem de fácil entendimento com uma syntax relativamente simples, que possui diversos compiladores extremamente validados e mantidos por suas comunidades. Usar C como código intermediário facilita a criação do executável usando um compilador mais amplamente usado (Clang ou GCC, por exemplo). Além de facilitar a construção de geradores de códigos dentro de um compilador, já que a sintaxe é simples e oferece maior capacidade para a linguagem fonte em relação ao gerenciamento de memória do computador.

1.1.5: Sobre programas montadores:
    Um programa montador precisa ser capaz de realizar a tarefa de transformar o código fonte em um código de máquina de acordo com a arquitetura do computador que está sendo executado.

```

## 1.2 Estrutura de um Compilador

Um Compilador possui duas partes, **análise** e **síntese**.

- **Análise**: Geralmente chamada de **front-end**, **subdivide** o programa fonte, **impõe uma [estrutura gramatical](https://pt.wikipedia.org/wiki/Gram%C3%A1tica)**, trata exceções caso o programa fonte não siga a gramática e armazena informações sobre o programa fonte em uma estrutura chamada **tabela de símbolos**;
- **Síntese**: **Back-end**, cria o programa objeto com base em uma representação intermediária e com a tabela de símbolos.

### Análise Léxica

Primeira fase do compilador (chamado também de análise léxica, lexing ou scanning). O analisador léxico (lexer, lex ou scanner) **lê o fluxo de caracteres do programa fonte e os agrupa de forma significativa**, formando lexemas. Para cada lexema o lexer cria um **token** e retorna para a próxima fase do compilador, a **análise sintática**.

```
(nome, valorAtribuido)
```

Onde o nome é o símbolo do token no programa fonte e o valorAtribuido, aponta uma entrada na tabela de símbolos.

### Análise Sintática

Segunda fase do compilador. A análise sintática usa o nome dos tokens para gerar uma representação intermediária tipo árvore. Pode acontecer no mesmo momento que a análise semântica.

### Análise Semântica

Analisa se a ordem das palavras estão em seus devidos lugares. Também faz a validação de tipos. Dependendo a linguagem pode haver coerções.

### Geração de Código Intermediário

Um compilador pode produzir uma ou mais representações intermediárias, as quais podem ter diversas formas. Árvores de sintaxe denotam uma forma de representação intermediária, normalmente usado na análise sintática e semântica. Após as análises sintática e semântica, muitos compiladores produzem uma representação explícita de baixo nível ou linguagem de máquina.

### Otimização de Código

Otimização independente de arquitetura faz transformações no código intermediário com o objetivo de produzir um código objeto melhor.

### Geração de Código

Recebe como entrada uma representação intermediária do programa fonte e mapeia em uma linguagem objeto. Se a linguagem objeto for assembly de alguma arquitetura, deve ser selecionado registradores para cada variável.

### Gerenciamento da Tabela de Símbolos

É uma estrutura de dados contendo um registro para cada nome de variável, com campos para cada atributo. Deve-se registrar os nomes de variáveis usados no programa fonte e coletar informações sobre diversos atributos de cada nome, como a linha que se encontra, espaço alocado na memória, seu tipo...

### O Agrupamento de Fases em Passos

Em uma implementação as fases vezes podem ser agrupadas em passos. O front-end pode ser agrupado em um único passo. Otimização de código pode ser um passo opcional. O back-end pode ser agrupado em um único passo.

### Ferramentas Para Construção de Compiladores

- Geradores de analisadores sintáticos (**syntax generators**);
- Geradores de analisadores léxico (**lexer generators**);
- Mecanismos de tradução dirigida por sintaxe (**syntax-directed translation** e **parser generators**);
- Geradores de gerador de código (**codegen generators**);
- Mecanismos de análise de fluxo de dados (**data flow analysis**);
- Conjunto de ferramentas para construção de compiladores (**frameworks**).

## 1.3 Evolução das Linguagens de Programação

Os primeiros computadores eletrônicos apareceram na década de 1940 e eram programados em linguagem de máquina por sequências de 0s e 1s que diziam explicitamente ao computador quais operações deveriam ser executadas e em que ordem. Isso era lento, cansativo e passível de erros. Uma vez escrito, os programas eram difíceis de entender e modificar.

### 1.3.1 Mudança para Linguagens de Alto Nível

O primeiro passo foi a criação de linguagens assembly (início da década 1950). No começo contém apenas mnemônicos das instruções de máquina. Mais tarde foram acrescentadas instruções de macro.

Um passo importante (metade da década 1950) foi a criação do [Fortran](https://pt.wikipedia.org/wiki/Fortran) para computação científica, [Cobol](https://pt.wikipedia.org/wiki/COBOL) para processamento de dados e do [Lisp](https://pt.wikipedia.org/wiki/Lisp) para computação simbólica.

Gerações:

- **Primeira geração**: linguagens de máquina;
- **Segunda geração**: linguagens simbólicas ou montagem (assembly);
- **Terceira geração**: linguagens de alto nível, procedimentais (Fortran, Cobol, Lisp, ...);
- **Quarta geração**: linguagens para aplicações específicas (NOMAD, SQL, HTML, ...);
- **Quinta geração**: linguagens baseadas em lógica com restrição (Prolog, ...).

Classificações de paradigmas:

- **Imperativas** (procedurais): descrevem como suas instruções funcionam, estado e mudança de estado (C, C++, C#);
- **Declarativas** (funcional, lógica, restritiva): descrevem o que fazem e não exatamente como suas instruções funcionam (ML, Haskell, Prolog).
- **von Neumann**: linguagens cujo modelo computacional se baseia na arquitetura de computadores de von Neumann (Fortran, C, ...);
- **Orientada por Objeto**: estilo de programação baseada em coleções de objetos;
- **Scripting**Linguagens interpretadas com operadores de alto nível criados para juntar computações (Awk, JavaScript, ...).

### 1.3.2 Impactos nos Compiladores

Os avanços nas linguagens de programação e nas arquiteturas de computadores, impõem novas demandas sobre os projetistas de compiladores.

### Exercícios

```
1.3.1
a) Imperativa
    C, C++, Cobol, Fortran, Java, Python, VB
b) Declarativa
    Lisp, ML, Perl
c) von Neumann
    C, C++, Cobol, Java, Python, VB
d) Orientada por Objeto
    C++, Cobol, Java, Python, VB
e) Funcional
    Lisp, ML, Perl
f) Terceira Geração
    C, C++, Cobol, Fortran, Java, Lisp, ML, Perl, Python, VB
g) Quarta Geração
h) Scripting
    Perl, Python
```

## 1.4 A Ciência da Criação de um Compilador

Resolver problemas em um compilador: dado um problema, formule uma abstração matemática que capture suas principais características e resolva-o usando técnicas matemáticas.

Um compilador precisa aceitar todos os programas que estejam de acordo com a linguagem. O conjunto de programas fonte são infinitos.

O compilador precisa manter a semântica do programa fonte durante qualquer transformação.

### 1.4.1 Modelagem no projeto e Implementação do Compilador

O estudo de compiladores pode se resumir em projetar os modelos matemáticos certos e escolher corretamente os algoritmos, mantendo o equilíbrio entre abrangência X eficiência.

### 1.4.2 A Ciência da Otimização do Código

As otimizações de um compilador precisam atender os seguintes objetivos de projeto:

- A otimização precisa preservar a semântica do programa compilado;
- A otimização precisa melhorar o desempenho de muitos programas;
- O tempo de compilação precisa continuar razoável;
- O esforço de engenharia empregado precisa ser administrável.

## 1.5 Aplicações da Tecnologia de Compiladores

O projeto de um compilador tem impacto em várias outras áreas da ciência da computação.

### 1.5.1 Implementação de Linguagens de Programação de Alto nível

Uma linguagem de programação de alto nível define uma abstração de programação.

### 1.5.2 Otimizações para Arquiteturas de Computador

Paralelismo e Hierarquias.

#### Paralelismo

Os programas são escritos como se todas as instruções fossem executadas sequencialmente; O hardware verifica dinamicamente se há dependências no fluxo sequencial das instruções e, quando possível, as emite em paralelo.

Códigos multithread são possíveis.

#### Hierarquias de Memória

O Uso eficaz dos registradores provavelmente é o problema mais importante na otimização de um programa.

### 1.5.3 Projeto de Novas Arquiteturas de Computador

Atualmente os compiladores são desenvolvidos durante o projeto de um processador.

Exemplo de influência de processadores para criação de arquiteturas:

- [RISC](https://pt.wikipedia.org/wiki/RISC)
- [VLIW](https://pt.wikipedia.org/wiki/VLIW)
- [SIMD](https://pt.wikipedia.org/wiki/SIMD)

### 1.5.4 Traduções de Programa

Compiladores podem traduzir para outra linguagem além de código de máquina.

#### Tradução Binária

Compiladores podem ser criados para traduzir um binário de uma máquina para outra.

x86 -> Alpha e Sparc

#### Síntese de hardware

Hardware também é escrito em linguagens como Verilog e VHDL.

#### Interpretadores de Consulta de Banco de Dados

SQL

#### Simulação Compilada

Simulação compilada muitas vezes é mais rápida que interpretada, por exemplo para simular projetos de Verilog e VHDL.

### 1.5.5 Ferramentas de Produtividade de Software

Análise de fluxo de dados para localizar erros estaticamente, antes do programa ser executado.

#### Verificação de Tipos

Pode ser usada para identificar erros e brechas de segurança.

#### Verificação de Limites

O usuário pode facilmente manipular entradas e causar problemas no programa caso não tenha uma verificação de limites.

A mesma análise de fluxo de dados pode ser usada para verificar estouros de buffer.

#### Ferramentas de Estouro de Memória

Coleta de lixo suprime erros de vazamento de memória.

## 1.6 Fundamentos da Linguagem de Programação

### 1.6.1 A Diferença entre Estático e Dinâmico

Um dos aspectos mais importantes ao projetar um compilador é sobre as decisões que o compilador pode fazer sobre um programa.

- **Escopo estático ou léxico**: determinar o escopo de uma declaração examinando o programa;
- **Escopo dinâmico**: enquanto o programa é executado, o uso de `x` poderia se referir a qualquer uma dentre as várias declarações de `x`.

C e Java possuem escopo estático.

### 1.6.2 Ambientes e Estados

- O **ambiente** é um mapeamento de um nome para um posição de memória (**left-value**);
- O **estado** é um mapeamento de uma posição de memória ao valor que ela contém (**right-value**).

#### Exemplo

Quando `f` está sendo executada, o **ambiente** se ajusta de modo que `i` se refira à localização reservada para `i` que é local a função `f`.

```
int i; // i global

void f() {
    int i; // i local
    i = 3; // uso do i local
}
...
    x = i + 1; // uso do i global
```

Na maioria das linguagens, as declarações precisam preceder seu uso, de modo que uma função que vem antes do `i` global não pode referir-se a ele (não é o caso do JavaScript).

---

- Nomes e variáveis: nomes usados em tempo de compilação;
- Identificador: cadeia de caracteres que se refere a uma entidade;
- Variável: refere-se a um endereço particular de memória.

---

### 1.6.3 Escopo estático e Estrutura de Blocos

A maioria das linguagens utilizam escopo estático. Algumas também oferecem controle explícito sobre escopos através de palavras-chave como `global`, `public`, `private` e `protected`.

#### Exemplo

1. Um programa C consiste em uma sequência de declarações globais (**top-level**) de variáveis e funções;
2. As funções podem conter declarações de variável, o escopo é restrito a função;

---

- Função: geralmente retorna valor;
- Procedimento: geralmente não retorna nada;
- Métodos: podem se comportar das duas maneiras.

C por exemplo só possui funções já que existe o tipo void.

---

3. O escopo de uma variável global `x` consiste de todo o programa que se segue.

Syntax de blocos em C:

1. Bloco é um tipo de comando que podem aparecer em qualquer lugar;
2. Um bloco é uma sequência de declarações seguida por uma sequência de comandos.

### 1.6.4 Controle de Acesso Explícito

Palavras-chaves como `public`, `private` e `protected` oferecem controle explícito sobre acesso aos nomes de membros em uma superclasse.

### 1.6.5 Escopo Dinâmico

Um uso de um nome `x` se refere à declaração de `x` no procedimento chamado mais recentemente com tal declaração.

---

A regra dinâmica está para o tempo assim como a regra estática está para o espaço. Enquanto a regra estática nos pede para encontrar a declaração cuja unidade (bloco) cerca mais de perto a localização física do uso, a regra dinâmica nos pede para encontrar a declaração cuja unidade (chamada de procedimento) cerca mais de perto o tempo de uso.

---

### 1.6.6 Mecanismos de Passagem de Parâmetros

Chamada por valor (**call by value**): O parâmetro real é avaliado se for uma expressão ou copiado se for uma variável;
Chamada por referência (**call by reference**): O endereço do parâmetro real é passado chamado como o valor do parâmetro formal correspondente.

### 1.6.7 Sinônimos

dois ponteiros com o mesmo endereço.

### Exercícios

```
1.6.1:
w = 13
x = 11
y = 13
z = 11

1.6.2:
w = 9
x = 7
y = 13
z = 11

1.6.3:
| Declaração | Escopo         |
|-----------|----------------|
| int w     | b1 - (b3 e b4) |
| int x     | b1 - (b2 e b4) |
| int y     | b1 - b5        |
| int z     | b1 - (b2 e b5) |
| int x     | b2 - b3        |
| int z     | b2             |
| int w     | b3             |
| int x     | b3             |
| int w     | b4             |
| int x     | b4             |
| int y     | b5             |
| int z     | b5             |

1.6.4:
3 e 2
```

## 2 Um Tradutor Simples Dirigido por Sintaxe

### 2.1 Introdução

A fase de análise de um compilador subdivide um programa fonte em partes constituintes e produz uma representação interna para ele, chamada de código intermediário.

Um analisador léxico permite que um tradutor trate as construções de múltiplos caracteres como identificadores, que são escritos como sequência de caracteres, mas são tratados como unidades chamadas tokens durante a análise sintática.

### 2.2 Definição da Sintaxe

gramática livre de contexto -> gramática -> sintaxe.

Uma gramática descreve a estrutura hierárquica da maioria das construções de linguagens de programação.

---

- **Tokens**: consistem em dois componentes (nome e valor atribuido);
- **Terminais**: nome dos tokens (símbolos abstratos definidos pelo programa fonte).

---

#### 2.2.1 Definição de Gramáticas

- Conjuntos de símbolos terminais;
- Conjunto de não terminais (variáveis sintáticas);
- Conjunto de produções (não-terminal -> sequência de terminais);
- Designação de não-terminais (símbolo inicial da gramática).

#### 2.2.2 Derivações

Uma gramática deriva cadeias começando com o símbolo inicial e substituindo repetidamente um não-terminal.

```
call -> id

optparams -> params
| E (cadeia de símbolos vazia, ou seja, chamada de função)

params -> param
| params params
```

#### 2.2.3 Árvore de Derivação

Representação das derivações

#### 2.2.4 Ambiguidade

Uma gramática pode ter mais de uma arvore de derivação gerando a mesma coisa.

#### 2.2.5 Associatividade de Operadores

1+2+3 -> (1+2)+3

+,-,\*,/ -> esquerda;
\*\*,= -> direita.

#### 2.2.6 Precedência de Operadores

```
expr -> expr + term
| expr - term
| term

term -> term * factor
| term / factor
| factor

factor -> digit | ( expr )
```

### 2.3 Tradução Dirigida por Sintaxe

```
expr -> expr + term
```

Atributos: Um atributo é qualquer valor associado a uma construção de programa;
Esquemas de tradução (dirigidos por sintaxe): Um esquema de tradução é uma notação para conectar fragmentos de programa às produções de uma gramática.

#### 2.3.1 [Notação Pós-fixada](https://pt.wikipedia.org/wiki/Nota%C3%A7%C3%A3o_polonesa_inversa)

#### 2.3.2 Atributosss Sintetizados

#### 2.3.3 Definições Dirigidas por Sintaxe Simples

#### 2.3.4 Caminhamento em Árvore

#### 2.3.5 Esquemas de Tradução

A definição dirigida por sintaxe faz uma tradução anexando uma sequência de caracteres como atributos dos nós de derivação.

### 2.4 Análise Sintática

É conveniente pensarmos em uma árvore de derivação sendo construída, embora, na prática, um compilador nao precisas construí-la.

#### 2.4.1 Análise Sintática Descendente

#### 2.4.2 Analisador Sintático Preditivo

Um conjunto de procedimentos **recursivos** é usado para processar a entrada. -> usa recursão.

#### 2.4.3 Quando Usar Producoes-E

#### 2.4.4 Projetando uma Analisador Preditivo

#### 2.4.5 Recursão à Esquerda

### 2.5 Um Tradutor para Expressões Simples

#### 2.5.1 Sintaxe Abstrata e Concreta

#### 2.5.2 Adaptando o Esquema de Tradução

#### 2.5.3 Procedimentos para os Não-terminais

#### 2.5.4 Simplificando o Tradutor

#### 2.5.5 O Programa Completo

[link para o código implementado em JavaScript](https://github.com/leozamboni/js-dragon-book-2nd/tree/main/2-5)

### 2.6 Análise Léxica

#### 2.6.1 Remoção de Espaço em Braco e Comentário

#### 2.6.2 Lendo Adiante

#### 2.6.3 Constantes

#### 2.6.4 Reconhecendo Palavras-Chave e Identificadores

#### 2.6.5 Um Analisador Léxico

[link para o código implementado em JavaScript](https://github.com/leozamboni/js-dragon-book-2nd/tree/main/2-6)

### 2.7 Tabelas de Símbolos

[link para o código implementado em JavaScript](https://github.com/leozamboni/js-dragon-book-2nd/tree/main/2-7)
