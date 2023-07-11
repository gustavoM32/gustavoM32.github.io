# EP3 - MAC0420

Gustavo de Medeiros Carlos (11276298)

## Introdução

Neste trabalho foi criado um cenário contendo cubos e de esferas, ele pode ser navegado pelo usuário com uso das teclas abaixo:

j - acelera para trás
k - para
l - acelera para frente
w - inclina para cima
x - inclina para baixo
a - vira para esquerda
d - vira para direita
z - vira em sentido anti-horário
c - vira em sentido horário

Também é possível controlar o movimento da nave com o mouse, desde que o botão esquerdo esteja pressionado. Além de virar a nave para os lados, é possível rotacioná-la em seu próprio eixo com a roda do mouse.

O cenário apresenta um planeta como a Terra e um satélite como a Lua no fundo. Também apresenta o Sol, mas ele não é visível na posição inicial da nave. Além disso, existem quatro cuboides e esferoides rotacionando em direções diversas no campo de visão do usuário. Atrás desses objetos, é possível perceber vários cubos formando um cenário que lembra o jogo Minecraft. Existe também um cubo de referência na origem do sistema de coordenadas do mundo.

O usuário pode iniciar a simulação ao clicar no botão "Executar", e pausá-la novamente ao clicar em "Pausar". Se a simulação estiver pausada, é possível avançá-la em uma quantidade específica de segundos definida na caixa "Tempo do passo" após clicar no botão "Passo".

O botão "Explode!" faz todos os objetos adquirem velocidades e rotações aleatórias. O botão "Para" faz com que todos fiquem parados.

## Extras

O programa contém os seguintes itens além do que foi exigido no enunciado:

* Passo com valor determinado pelo usuário;
* Controle da nave com o mouse;
* Movimento de translação dos objetos (em adição da rotação);
* Criação do Esquema de cubos, que imita o jogo Minecraft e tenta simular a iluminação.

## Módulos

As classes Cubo e Esfera geram os triângulos relacionados a representação desses objetos. Todas as instâncias desses objetos utilizam os mesmos vértices em comum, logo não é necessário realizar o processo de geração deles mais de uma vez. Isso é especialmente relevante para os vértices da Esfera, gerados em múltiplas iterações. Os objetos são colocados em posições e formas distintas na cena com o uso da matriz Model View.

* Config.js - contém parâmetros de configuração do programa e da cena
* Controle.js - classe relacionada ao controle do programa pelo usuário
* Cubo.js - define os objetos que representam um cubo
* Esfera.js - define os objetos que aproximam uma esfera
* Esquema.js - função para adicionar conjuntos de cubos de maneira mais fácil
* ep03.js - código principal do programa
* Nave.js - define a movimentação da nave controlada pelo usuário e que também define a posição da câmera
* Objeto.js - define a movimentação dos objetos da cena e o seu desenho
* util.js - funções que simplificam o código nas outras partes do programa e que têm pouca relação entre si.

## Bugs

Não encontrei uma maneira simples de manter um vetor de ângulos em relação aos eixos (theta) para a nave e alterá-los com os movimentos do usuário. Conforme [essa resposta](https://gamedev.stackexchange.com/a/111059) no GameDev Stack Exchange, alterar os ângulos dos eixos diretamente não funciona como o esperado. Os movimentos de yaw, pitch e roll devem ser feitos em relação à posição da nave e não em relação aos eixos do mundo.

Para manter o código simples, foi implementada a solução descrita nessa mesma resposta, que consiste em armazenar a matriz de rotação que leva a nave da posição padrão no mundo para a sua orientação atual. Os movimentos do usuário têm o efeito de rotacionar essa matriz na direção desejada. Os ângulos em relação aos eixos podem ser obtidos dessa matriz com algumas fórmulas específicas em função de seus elementos, [descritas aqui](https://en.wikipedia.org/wiki/Euler_angles#Rotation_matrix). No entanto, não consegui seguir o padrão de manter o yaw e roll entre -180° e 180 e o pitch entre -90° e 90° pois as fórmulas devolvem os ângulos na forma (yaw, pitch, roll) enquanto o enunciado define o pitch como o primeiro ângulo.


