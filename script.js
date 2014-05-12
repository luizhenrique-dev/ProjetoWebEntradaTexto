// Code goes here: codigós como espaço e talz não devem armazenar na pilha ctrl+z
//Criada a função de autocompletar com diversas palavras
//A função autocompletar agora mostra todas as possibilidades se o textarea estiver vazio

//Função responsável por estabelecer o limite de caracteres por linha e o total
function validar_caracteres() {
  var texto = document.getElementById("text");

  if (texto.value.length == 40) {
    texto.value += "\n";
  }
  if (texto.value.length == 81) {
    texto.value += "\n";
  }
  if (texto.value.length == 122) {
    texto.value += "\n";
  }
  if (texto.value.length == 163) {
    texto.value += "\n";
  }
  if (texto.value.length > 203) {
    window.alert("Atenção! Você acaba de alcançar o limite de caracteres.");
    texto.value = texto.value.substr(0, 203);
  } else {

  }
}

//Array de palavras que estarão disponíveis para auto-completar
var listaPalavras = new Array("zebra", "imoral", "inativo", "frio", "fome", "elefante", "espada", "dente", "dado", "coluna", "carinho", "bolacha", "biscoito", "loop", "levantar", "atirar", "banco", "teste", "voltar", "grande", "banana", "amor", "gato", "amante", "lutar", "discutir", "juntar", "correr", "gritar", "feliz", "alegre", "luz", "pequeno", "odiar", "laranja", "java", "javascript");
listaPalavras.sort();
//variável que contem o elemento "output" do html
var outp;

var listaAtalhos = new Array();
popularListaAtalhos("#1", "cavalo");
popularListaAtalhos("#2", "vaca");
popularListaAtalhos("#3", "coelho");
popularListaAtalhos("#4", "frango");
popularListaAtalhos("@1", "maça");
popularListaAtalhos("@2", "mamão");
popularListaAtalhos("@3", "limão");
popularListaAtalhos("@4", "caju");
popularListaAtalhos("%10", "Brasil");
popularListaAtalhos("%11", "Argentina");
popularListaAtalhos("%12", "Espanha");
popularListaAtalhos("%13", "Portugal");
popularListaAtalhos("!1", "Goiânia");
popularListaAtalhos("!2", "Anápolis");
popularListaAtalhos("!3", "Brasília");
popularListaAtalhos("!4", "Salvador");
popularListaAtalhos("#5", "cachorro");
popularListaAtalhos("#6", "gato");


var oldins;
//posição no vetor de palavras possíveis
var posi = -1;
//vetor de palavras possíveis para autocompletar dado o texto digitado
var words = new Array();
//valor digitado no textarea
var input;
//representa o código da tecla digitada
var key;
//representa a string a qual foi utilizado o método autocompletar
var stringAutoCompletar;
var ctrlSpace = false;
var conteudoAntigo;
var atalhoPossivel = false;
var historicoMudancas = new Array();
var atalho;
var contadorTab = 0;
var posCursor;
var palavraEmEvidencia;
//var dados = new ActiveXObject("Scripting.FileSystemObject");

function popularListaAtalhos(chave, valor) {
  listaAtalhos[chave] = valor;
}
//Tornar visível a estrutura que conterá as palavras possíveis
function setVisible(visi) {
  var x = document.getElementById("shadow");
  var t = document.getElementsByName("text")[0];
  x.style.position = 'absolute';
  x.style.top = (findPosY(t) + 3) + "px";
  x.style.left = (findPosX(t) + 2) + "px";
  x.style.visibility = visi;
}

function inicio() {
  outp = document.getElementById("output");
  setVisible("hidden");
  historicoMudancas.push("");

  //abreArquivo("arquivo.txt");  

  document.onkeydown = function(e) {
    if (e.ctrlKey && e.keyCode == 32 || e.keyCode == 40 || e.keyCode == 38 || e.keyCode == 9) {
      if (!event && window.event)
        e = window.e;
      if (event)
        key = e.keyCode;
      else
        key = e.which;

      return false;
    }
    if (e.ctrlKey || (atalhoPossivel == true && e.keyCode == 13) || contadorTab > 0 && e.keyCode == 46)
      return false;
  };

  document.onkeyup = function(event) {
    atalhoPossivel = false;
    stringAutoCompletar = "";
    getPrefixoAutoCompletar();
    //verifica se o contém prefixo para realizar a opção de autocompletar
    if (stringAutoCompletar.length > 0) {
      //verifica se existem palavras possíveis para um dado prefixo
      verificaPalavrasPossiveis(stringAutoCompletar);

      //verifica se existe algum atalho para o prefixo informado
      atalho = verificaAtalho(stringAutoCompletar);

    } else {
      clearOutput();
      words = getTodasPalavras();
      for (var i = 0; i < words.length; ++i)
        addPalavra(words[i]);
    }

    if (event.ctrlKey && event.keyCode == 32) {
      if (words.length > 0) {
        ctrlSpace = true;
        setVisible("visible");
      }
      if (event.ctrlKey)
        return false;
    }
    if (ctrlSpace == true && event.keyCode == 13) { //tecla Enter pressionada
      var textfield = document.getElementById("text");
      var textoAntigo = textfield.value;
      historicoMudancas.push(textoAntigo);
      historicoMudancas.pop();
      var palavraCompletada = outp.childNodes[posi].firstChild.nodeValue;
      var textoNovo = textoAntigo.replace(stringAutoCompletar, palavraCompletada);
      textfield.value = textoNovo;
      setVisible("hidden");
      posi = -1;
      //oldins = this.firstChild.nodeValue;
      ctrlSpace = false;
    }
    if (atalhoPossivel == true) { //tecla Enter pressionada
      if (event.keyCode == 13) {
        var textfield = document.getElementById("text");
        var textoAntigo = textfield.value;
        historicoMudancas.push(textoAntigo);
        historicoMudancas.pop();
        var palavraCompletada = atalho;
        var textoNovo = textoAntigo.replace(stringAutoCompletar, palavraCompletada);
        textfield.value = textoNovo;
        setVisible("hidden");
        posi = -1;
        //oldins = this.firstChild.nodeValue;
        atalho = "";
        atalhoPossivel = false;
      }
    }

    //verifica o ctrl + Z
    if (event.ctrlKey && event.keyCode == 90) {
      if (historicoMudancas.length > 0) {
        var textfield = document.getElementById("text");
        historicoMudancas.pop();
        var textoAnterior = historicoMudancas[historicoMudancas.length - 1];
        textfield.value = textoAnterior;
      }
    } else {
      var textfield = document.getElementById("text").value;
      if (textfield != conteudoAntigo) {
        historicoMudancas.push(textfield);
      }
      conteudoAntigo = textfield;
    }

    if (event.keyCode == 9) {
      palavraEmEvidencia = getPalavraAtual();
      contadorTab++;

      if (contadorTab > 1) {
        var textfield = document.getElementById("text");
        if (posCursor >= textfield.value.length)
          posCursor = 0;

        var pertenceLista = true;

        while (pertenceLista) {
          setPosCursor(textfield, posCursor + 1);
          palavraEmEvidencia = getPalavraAtual();

          if (listaPalavras.indexOf(palavraEmEvidencia) != -1) {
            pertenceLista = false;
          }
        }
      }
    } else {
      contadorTab = 0;
    }

    if (event.keyCode == 46) {
      var textfield = document.getElementById("text");
      var textoAntigo = textfield.value;
      historicoMudancas.push(textoAntigo);
      var textoNovo = textoAntigo.replace(palavraEmEvidencia, "");
      textfield.value = textoNovo;
    }

    if (document.getElementById("shadow").style.visibility == "visible") {
      var textfield = document.getElementById("text");
      key = event.keyCode;
      if (key == 40) //A tecla 'pra baixo' pressionada
      {
        //verifica se contem elementos no vetor de palavras possíveis
        if (words.length > 0 && posi <= words.length - 2) {
          if (posi >= 0) {
            //mostra cores normais, fundo branco e texto preto
            setColor(posi, "#fff", "black");
          } else {
            //muda a cor, destacando a palavra em evidencia e substituindo-a durante a navegação no textArea
            input = textfield.value;
          }
          setColor(++posi, "blue", "white");
          //textfield.value = outp.childNodes[posi].firstChild.nodeValue;
        } else {
          setColor(posi, "blue", "white");
        }
      } else if (key == 38) { //Tecla 'pra cima' pressionada
        //verifica se contem elementos no vetor de palavras possíveis
        if (words.length > 0 && posi >= 1) {
          if (posi >= 1) {
            setColor(posi, "#fff", "black");
            setColor(--posi, "blue", "white");
            //textfield.value = outp.childNodes[posi].firstChild.nodeValue;
            //alert("affs");
          } else {
            //alert("merda");
            setColor(posi, "#fff", "black");
            //textfield.value = input;
            //textfield.focus();
            posi--;
          }
        } else {
          setColor(posi, "blue", "white");
        }
      } else if (key == 27 || key == 32) { // Esc pressionado ou barra de espaço 
        entradaAtual = document.getElementById("text").value;
        textfield.value = entradaAtual;
        setVisible("hidden");
        posi = -1;
        oldins = input;
        ctrlSpace = false;
        contadorTab = 0;
      } else if (key == 8) { // Backspace pressionado
        posi = -1;
        oldins = -1;
      } else {
        posi = -1;

      }
    }
  }

  // document.onkeypress = function(e) {if (e.ctrlKey) return false;};
}

//Função ler arquivo
/*function abreArquivo(arq){
//o parametro arq é o endereço do txt
//carrega o txt
var arquivo = dados.OpenTextFile(arq, 1, true);
//varre o arquivo
while(!arquivo.AtEndOfStream){
//escreve o txt no TextArea
document.getElementById("text").value = arquivo.ReadAll();
}
//fecha o txt
arquivo.Close();
}*/

function verificaAtalho(stringAutoCompletar) {
  if (listaAtalhos[stringAutoCompletar] != undefined) {
    atalhoPossivel = true;
    return listaAtalhos[stringAutoCompletar];
  }
}

function getPrefixoAutoCompletar() {
  var entrada = document.getElementById("text").value;
  //Identifica qual a string em evidência em relação a posição do cursor
  var posCursor = getPosCursor(document.getElementById("text"));
  var aux = entrada.substring(0, posCursor);
  if (posCursor != 0) {
    var indexInicioDaPalavra;
    if (aux.lastIndexOf(" ") == -1) {
      indexInicioDaPalavra = 0;
    } else {
      indexInicioDaPalavra = parseInt(aux.lastIndexOf(" ") + 1);
    }

    stringAutoCompletar = aux.slice(indexInicioDaPalavra, posCursor);
  }
}

function getPalavraAtual() {
  var entrada = document.getElementById("text").value;
  //Identifica qual a string em evidência em relação a posição do cursor
  posCursor = getPosCursor(document.getElementById("text"));
  var aux = entrada.substring(0, posCursor);
  if (posCursor != 0) {
    var indexInicioDaPalavra;
    if (aux.lastIndexOf(" ") == -1) {
      indexInicioDaPalavra = 0;
    } else {
      indexInicioDaPalavra = parseInt(aux.lastIndexOf(" ") + 1);
    }

    while (entrada.charAt(posCursor) != "") {
      if (entrada.charAt(posCursor) == " ") {
        break;
      }
      posCursor++;
    }
    return entrada.slice(indexInicioDaPalavra, posCursor);
  }
}

function getProximaPalavra() {

}

function verificaPalavrasPossiveis(trechoInicial) {
  words = getPalavras(stringAutoCompletar);
  if (words.length > 0) {
    clearOutput();
    if (ctrlSpace == true)
      setVisible("visible");
    for (var i = 0; i < words.length; ++i)
      addPalavra(words[i]);
  } else {
    if (ctrlSpace == true)
      setVisible("hidden");
  }
}

//Função para mostrar todas as palavras
function getTodasPalavras() {
  var words = new Array();
  for (var i = 0; i < listaPalavras.length; ++i) {
    words[words.length] = listaPalavras[i];
  }
  return words;
}

//Cria uma nova div e adiciona as palavras possíveis
function addPalavra(palavra) {
  var sp = document.createElement("div");
  sp.appendChild(document.createTextNode(palavra));
  //sp.onmouseover = mouseHandler;
  //sp.onmouseout = mouseHandlerOut;
  //sp.onclick = mouseClick;
  outp.appendChild(sp);
}

//Limpa todas as palavras existentes e volta a posição inicial à -1
function clearOutput() {
  while (outp.hasChildNodes()) {
    noten = outp.firstChild;
    outp.removeChild(noten);
  }
  //posi = -1;
}

//Função responsável por verificar o caracter atual no textoBox e verificar se existe esse caracter
//naquela determinada posição em alguma palavra da 'lista de plavras'
//Criando um novo array com essas palavras
function getPalavras(palavraInicial) {
  var words = new Array();
  for (var i = 0; i < listaPalavras.length; ++i) {
    var j = -1;
    var correct = 1;
    while (correct == 1 && ++j < palavraInicial.length) {
      if (listaPalavras[i].charAt(j) != palavraInicial.charAt(j))
        correct = 0;
    }
    if (correct == 1)
      words[words.length] = listaPalavras[i];
  }
  return words;

}

//Muda a cor das palavras e do fundo delas
function setColor(_posi, _color, _forg) {
  outp.childNodes[_posi].style.background = _color;
  outp.childNodes[_posi].style.color = _forg;
}

/*var mouseHandler = function() {
  for (var i = 0; i < words.length; ++i)
    setColor(i, "white", "black");
  this.style.background = "blue";
  this.style.color = "white";
}

var mouseHandlerOut = function() {
  this.style.background = "white";
  this.style.color = "black";
}

var mouseClick = function() {
  var textoAntigo = document.getElementsByName("text")[0].value;
  var palavraCompletada = this.firstChild.nodeValue.toString();
  var textoNovo = textoAntigo.replace(stringAutoCompletar, palavraCompletada);
  document.getElementsByName("text")[0].value = textoNovo;
  setVisible("hidden");
  posi = -1;
  oldins = this.firstChild.nodeValue;
}*/

function getPosCursor(element) {
  var value = 0;
  if (typeof(element.selectionStart) != "undefined") {
    value = element.selectionStart;
  } else if (document.selection) {
    var range = document.selection.createRange();
    var storedRange = range.duplicate();
    storedRange.moveToElementText(element);
    storedRange.setEndPoint("EndToEnd", range);
    value = storedRange.text.length - range.text.length;
  }
  return value;
}

function setPosCursor(element, pos) {
  element.focus();
  if (typeof(element.setSelectionRange) != "undefined") {
    element.setSelectionRange(pos, pos);
  } else if (element.createTextRange) {
    var breaks = element.value.slice(0, pos).match(/\n/g);
    var endPoint = 0;
    if (breaks instanceof Array) {
      endPoint = -breaks.length;
    }
    var range = element.createTextRange();
    range.collapse(true);
    range.moveStart("character", pos);
    range.moveEnd("character", endPoint);
    range.select();
  }
}

function findPosX(obj) {
  var curleft = 0;
  if (obj.offsetParent) {
    while (obj.offsetParent) {
      curleft += obj.offsetLeft;
      obj = obj.offsetParent;
    }
  } else if (obj.x)
    curleft += obj.x;
  return curleft;
}

function findPosY(obj) {
  var curtop = 0;
  if (obj.offsetParent) {
    curtop += obj.offsetHeight;
    while (obj.offsetParent) {
      curtop += obj.offsetTop;
      obj = obj.offsetParent;
    }
  } else if (obj.y) {
    curtop += obj.y;
    curtop += obj.height;
  }
  return curtop;
}