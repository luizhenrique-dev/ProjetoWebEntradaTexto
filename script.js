// Code goes here
function validar_caracteres() {
  var texto = document.getElementById("texto");

  if (texto.value.length == 40){
    texto.value += "\n";
  }
  if (texto.value.length == 81){
    texto.value += "\n";
  }
  if (texto.value.length == 122){
    texto.value += "\n";
  }
  if (texto.value.length == 163){
    texto.value += "\n";
  }
  if (texto.value.length > 204) {
    window.alert("Atenção! Você acaba de alcançar o limite de caracteres.");
    texto.value = texto.value.substr(0, 204);
  } else {
    
  }
}
