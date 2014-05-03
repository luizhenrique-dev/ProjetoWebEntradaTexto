// Code goes here
//Função responsável por estabelecer o limite de caracteres por linha e o total
function validar_caracteres() {
    var texto = document.getElementById("text");
    var cont = document.getElementById("contador");

    if (texto.value.length >= 40) {
        texto.value += "\n";
    }
    if (texto.value.length >= 81) {
        texto.value += "\n";
    }
    if (texto.value.length >= 122) {
        texto.value += "\n";
    }
    if (texto.value.length >= 163) {
        texto.value += "\n";
    }
    if (texto.value.length > 203) {
        window.alert("Atenção! Você acaba de alcançar o limite de caracteres.");
        texto.value = texto.value.substr(0, 203);
    } else {

    }
    cont.innerHTML = texto.value.length;
}

//Array de palavras que estarão disponíveis para auto-completar
var listaPalavras = new Array("banco", "teste", "voltar", "grande", "pequeno", "banana", "amor", "gato", "amante", "lutar", "discutir", "juntar", "correr", "gritar", "feliz", "alegre", "luz", "pequeno", "odiar", "laranja", "java", "javascript");
//variável que contem o elemento "output" do html
var outp;
var oldins;
//posição no vetor de palavras possíveis
var posi = -1;
//vetor de palavras possíveis para autocompletar dado o texto digitado
var words = new Array();
//valor digitado no textarea
var input;
//representa o código da tecla digitada
var key;

//Tornar visível a estrutura que conterá as palavras possíveis
function setVisible(visi)
{
    var x = document.getElementById("shadow");
    var t = document.getElementsByName("text")[0];
    x.style.position = 'absolute';
    x.style.top = (findPosY(t) + 3) + "px";
    x.style.left = (findPosX(t) + 2) + "px";
    x.style.visibility = visi;
}

function init()
{
    outp = document.getElementById("output");
    window.setInterval("lookAt()", 100);
    setVisible("hidden");
    //document.onkeydown = keygetter; //necessitado pelo Opera...

    document.onkeydown = function(e) {
        if (e.ctrlKey && e.keyCode == 32) {
            if (!event && window.event)
                e = window.e;
            if (event)
                key = e.keyCode;
            else
                key = e.which;

            return false;
        }
        if (e.ctrlKey)
            return false;
    };

    //document.onkeyup = keyHandler;
    document.onkeyup = function(event) {
        if (event.ctrlKey && event.keyCode == 32) {
            if (words.length > 0) {
                setVisible("visible");
            }
            if (event.ctrlKey)
                return false;
        }
        if (document.getElementById("shadow").style.visibility == "visible")
        {
            var textfield = document.getElementsByName("text")[0];
            key = event.keyCode;
            if (key == 40)//A tecla 'pra baixo' pressionada
            {
                //verifica se contem elementos no vetor de palavras possíveis
                if (words.length > 0 && posi <= words.length - 1)
                {
                    if (posi >= 0)
                        //mostra cores normais, fundo branco e texto preto
                        setColor(posi, "#fff", "black");
                    else
                        //muda a cor, destacando a palavra em evidencia e substituindo-a durante a navegação no textArea
                        input = textfield.value;

                    setColor(++posi, "blue", "white");
                    //textfield.value = outp.childNodes[posi].firstChild.nodeValue;
                }
            }
            else if (key == 38)
            { //Tecla 'pra cima' pressionada
                //verifica se contem elementos no vetor de palavras possíveis
                if (words.length > 0 && posi >= 0)
                {
                    if (posi >= 1)
                    {
                        setColor(posi, "#fff", "black");
                        setColor(--posi, "blue", "white");
                        //textfield.value = outp.childNodes[posi].firstChild.nodeValue;
                    }
                    else
                    {
                        setColor(posi, "#fff", "black");
                        textfield.value = input;
                        textfield.focus();
                        posi--;
                    }
                }
            }
            else if (key == 27 || key == 32)
            { // Esc pressionado ou barra de espaço 
                textfield.value = input;
                setVisible("hidden");
                posi = -1;
                oldins = input;
            }
            else if (key == 8)
            { // Backspace pressionado
                posi = -1;
                oldins = -1;
            }
            else if (key == 13) { //tecla Enter pressionada
                textfield.value = outp.childNodes[posi].firstChild.nodeValue;
                setVisible("hidden");
                posi = -1;
                oldins = this.firstChild.nodeValue;
            }
        }
    }

    // document.onkeypress = function(e) {if (e.ctrlKey) return false;};
}


function findPosX(obj)
{
    var curleft = 0;
    if (obj.offsetParent)
    {
        while (obj.offsetParent)
        {
            curleft += obj.offsetLeft;
            obj = obj.offsetParent;
        }
    }
    else if (obj.x)
        curleft += obj.x;
    return curleft;
}

function findPosY(obj)
{
    var curtop = 0;
    if (obj.offsetParent)
    {
        curtop += obj.offsetHeight;
        while (obj.offsetParent)
        {
            curtop += obj.offsetTop;
            obj = obj.offsetParent;
        }
    }
    else if (obj.y)
    {
        curtop += obj.y;
        curtop += obj.height;
    }
    return curtop;
}

//Responsável por checar o texto digitado e adicionar as palavras possíveis e mostrá-las
function lookAt()
{
    var entrada = document.getElementsByName("text")[0].value;
    if (oldins == entrada)
        return;
    else if (posi > -1)
        ;
    else if (entrada.length > 0)
    {
        words = getWord(entrada);
        if (words.length > 0)
        {
            clearOutput();
            for (var i = 0; i < words.length; ++i)
                addWord(words[i]);

            //setVisible("visible");
            input = document.getElementsByName("text")[0].value;
        }
        else
        {
            setVisible("hidden");
            posi = -1;
        }
    }
    else
    {
        setVisible("hidden");
        posi = -1;
    }
    oldins = entrada;
}

//Cria uma nova div e adiciona as palavras possíveis
function addWord(word)
{
    var sp = document.createElement("div");
    sp.appendChild(document.createTextNode(word));
    sp.onmouseover = mouseHandler;
    sp.onmouseout = mouseHandlerOut;
    sp.onclick = mouseClick;
    outp.appendChild(sp);
}

//Limpa todas as palavras existentes e volta a posição inicial à -1
function clearOutput()
{
    while (outp.hasChildNodes())
    {
        noten = outp.firstChild;
        outp.removeChild(noten);
    }
    posi = -1;
}

//Função responsável por verificar o caracter atual no textoBox e verificar se existe esse caracter
//naquela determinada posição em alguma palavra da 'lista de plavras'
//Criando um novo array com essas palavras
function getWord(beginning)
{
    var words = new Array();
    for (var i = 0; i < listaPalavras.length; ++i)
    {
        var j = -1;
        var correct = 1;
        while (correct == 1 && ++j < beginning.length)
        {
            if (listaPalavras[i].charAt(j) != beginning.charAt(j))
                correct = 0;
        }
        if (correct == 1)
            words[words.length] = listaPalavras[i];
    }
    return words;

}

//Muda a cor das palavras e do fundo delas
function setColor(_posi, _color, _forg)
{
    outp.childNodes[_posi].style.background = _color;
    outp.childNodes[_posi].style.color = _forg;
}

//Funcoes relativas as acoes do mouse
var mouseHandler = function()
{
    for (var i = 0; i < words.length; ++i)
        setColor(i, "white", "black");
    this.style.background = "blue";
    this.style.color = "white";
}

var mouseHandlerOut = function()
{
    this.style.background = "white";
    this.style.color = "black";
}

var mouseClick = function()
{
    document.getElementsByName("text")[0].value = this.firstChild.nodeValue;
    setVisible("hidden");
    posi = -1;
    oldins = this.firstChild.nodeValue;
}

