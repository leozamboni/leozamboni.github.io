% Baixar, instalar e customizar o suckless terminal
% Leonardo Z. N.
% 14/02/2022

antes de tudo se você nunca ouviu falar no [suckless terminal](https://st.suckless.org/), também conhecido como simple terminal ou simplesmente st, ele é um emulador de terminal para [X Window System](https://en.wikipedia.org/wiki/X_Window_System) escrito em C que tem como motivacão criar um terminal simples para substituir o [xterm](https://en.wikipedia.org/wiki/Xterm) e o [rxvt](https://en.wikipedia.org/wiki/Rxvt).

# Baixar e Instalar

para baixar e instalar você vai precisar dos pacotes build-essential (base-devel no arch) e git

| Debian | Arch | 
|---|---|
| `sudo apt install build-essential git` | `sudo pacman -S base-devel git`   |

para baixar, clone o repositório oficial em algum lugar que você desejar no seu computador

```
git clone https://git.suckless.org/st
```

para instalar compile

```
sudo make clean install
```

pronto, agora é só digitar `st` para abrir

# Configuracões e Customizacões

o arquivo de configuracão `config.h` é localizado dentro do repositório.
*lembrando que assim como xterm ele é um terminal compatível com X então você também pode usar .Xresources*

dentro dele você encontra uma váriavel para cada um dos vários aspectos do terminal como: font, shell, tabspaces, ...

aqui vamos trocar a fonte do terminal mas o processo é o mesmo para fazer qualquer outra customizacão, inclusive 
o próprio site oferece vários [conjuntos de alteracões](https://st.suckless.org/patches/) (patch) que você pode instalar, basta baixar o arquivo .diff (utilizando wget ou salvando com o botão direito no link) dentro do repo e aplicar as alteracões com o comando

```
patch -i nome-do-patch.diff
```

e seguir o mesmo passo para alteracões no arquivo:

Para trocar a fonte vamos alterar a variável `static char *font`
na mesma string podemos alterar algumas outras configuracões da fonte como pixel size, antialias e font hinting. Vou usar minha fonte favorita [Comic Mono](https://dtinth.github.io/comic-mono-font/)

{% highlight c %}
static char *font = "Comic Mono:pixelsize=12:antialias=false:autohint=false"; 
{% endhighlight %}

após isso basta salvar o arquivo e recompilar o terminal

```
sudo make clean install
```

no caso dos patches, antes de recompilar você deve [resolver os arquivos conflitantes](https://git-scm.com/book/pt-br/v2/Branches-no-Git-O-b%C3%A1sico-de-Ramifica%C3%A7%C3%A3o-Branch-e-Mesclagem-Merge#r_basic_merge_conflicts)
