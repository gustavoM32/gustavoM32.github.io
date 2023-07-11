# EP4 - MAC0420

Gustavo de Medeiros Carlos (11276298)

## Introdução

Neste trabalho foi criado um cenário contendo cubos e de esferas, o usuário está em uma nave e pode movimentá-la com o uso das teclas abaixo:

j ou e - acelera para trás
k ou s - para
l ou q - acelera para frente
w - inclina para cima
x - inclina para baixo
a - vira para esquerda
d - vira para direita
z - vira em sentido anti-horário
c - vira em sentido horário

Também é possível controlar o movimento da nave com o mouse, desde que o botão esquerdo esteja pressionado. Além de virar a nave para os lados, é possível rotacioná-la em seu próprio eixo com a roda do mouse.

As naves no cenário são representadas por esferas. O usuário pode alternar o controle para outras naves usando as teclas m e n.

O cenário apresenta um planeta como a Terra, um satélite como a Lua e o Sol. Além disso, existem quatro cuboides e esferoides rotacionando em direções diversas. O cenário também contém vários cubos que lembram árvores do jogo Minecraft. Existe também um cubo de referência na origem do sistema de coordenadas do mundo.

O usuário pode iniciar a simulação ao clicar no botão "Executar", e pausá-la novamente ao clicar em "Pausar". Se a simulação estiver pausada, é possível avançá-la em uma quantidade específica de segundos definida na caixa "Tempo do passo" após clicar no botão "Passo".

O botão "Explode!" faz todos os objetos adquirirem velocidades e rotações aleatórias. O botão "Para" faz com que todos fiquem parados.

O botão "Ativa gravidade" ativa a atração gravitacional de todos os objetos pelo cubo de referência.

Por padrão, o cenário é feito considerando as exigências do enunciado. O botão "Ignorar enunciado" permite o uso de configurações mais customizadas, como o posicionamento da fonte de luz no Sol, a componente de emissão para a esfera que o representa e um formato triangular para as naves.

## Extras

Além dos extras do EP3, que são:
* Passo com valor determinado pelo usuário;
* Controle da nave com o mouse;
* Movimento de translação dos objetos (em adição da rotação);
* Criação do Esquema de cubos, que imita o jogo Minecraft.

Foram implementados os seguintes itens além do que foi exigido no enunciado do EP4:
* Objeto triangular para representar a nave, o que facilita reconhecer sua orientação
* Atração gravitacional pelo cubo de referência

## Módulos

O programa foi dividido nos seguintes módulos:

* Config.js - contém parâmetros de configuração do programa e da cena
* Controle.js - classe relacionada ao controle do programa pelo usuário
* Cubo.js - define os objetos que representam um cubo
* Esfera.js - define os objetos que aproximam uma esfera
* Esquema.js - função para adicionar conjuntos de cubos de maneira mais fácil
* ep04.js - código principal do programa
* Nave.js - define a movimentação da nave controlada pelo usuário e que também define a posição da câmera
* NaveObjeto.js - define o objeto que representa a nave
* Objeto.js - define a movimentação dos objetos da cena e o seu desenho
* util.js - funções que simplificam o código nas outras partes do programa e que têm pouca relação entre si.

# Bugs

O programa não se preocupa muito com eficiência para o desenho de muitos objetos. Cada objeto é desenhado separadamente para que a matriz modelview seja enviada para a placa de vídeo por meio de um uniform. Talvez seria melhor criar um buffer para as transformações de cada objeto para que todos possam ser enviados para o WebGL simultaneamente. Isso permitiria o desenho de um número maior de cubos dado o mesmo poder computacional.

Existe um problema de [z-fighting](https://en.wikipedia.org/wiki/Z-fighting) nas bordas dos cubos, devido ao amplo campo de visão utilizado (grande distância entre near e far). Foi necessário um campo assim pois o cenário representa o espaço sideral que contém objetos muito grandes e distantes. O valor de near foi aumentado em relação à entrega do EP3 para tentar contornar o problema, mas não foi aumentado demais para permitir que a nave chegue mais perto dos objetos sem que eles deixem de ser renderizados.

Uma solução mais definitiva para esse problema seria evitar o desenho das faces internas dos cubos, pois o z-fighting é mais proeminente no encontro com as faces internas (que estão mais iluminadas, mas deveriam ser invisíveis) com as faces superiores dos cubos (que estão menos iluminadas, mas visíveis).
