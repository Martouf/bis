/*******************************************************************************************
 * Nom du fichier		: bis-generator.js
 * Date				    	: 4-2021
 * Auteur				    : Mathieu Despont
 * Adresse E-mail		: mathieu at ecodev.ch
 * But de ce fichier: Générateur de marque de famille
 *******************************************************************************************
 * Ce fichier utilise la bibliothèque d3.js
 */


 // pour isoler le code et éviterles conflit de nom avec l'autre carte.
 (function() {

  // Utilise le mode strict de js
  // https://developer.mozilla.org/fr/docs/Web/JavaScript/Reference/Strict_mode
  "use strict";

  var cursorCorrectionMap = 0;
  var cursorCorrectionMapTop = 0; // 290
  var htmlIdPrefix = ""; // permet d'ajouter un prefix pour distinguer input html d'autres instances de la même app dans la même page.

  // Pour avoir un paramètre unique à mettre dans l'url de téléchargements des data, afin d'éviter le cache.
  var dateTime = Date.now();
  var dateTimeSlug = Math.floor(dateTime / 1000); // en seconde et pas millisecondes.

  // valeur par défaut du viewport => desktop
  var markWidth = 1000;
  var markHeight = 1000;

  /////////// Initiatilsation  ////////////

  var numberOfCode = d3.select("#"+htmlIdPrefix+"numberOfCode").node().value;



//////// création de svg dynamique /////
  // Variable qui représente l'élément body sur lequel on se croche pour générer le contenu via d3.js
  var htmlBody = d3.select("#"+htmlIdPrefix+"zone");

  // crée un div dans le DOM qui est un espace pour une colonne de droite
    var rightColumn = htmlBody
        .append("div")
        .attr("id", "familyMark");


  // la taille du contenu = 946px  => 3/4 = 710
  // mapWidth =  .75 * windowWidth; // règle la taille du viewport à 75% de la taille de la fenêtre

//   var svgMark = rightColumn
//       .append("svg")
//       .attr("id", "svgZone")
//       .attr("width", markWidth)
//       .attr("height", markHeight)
//       .attr("transform", "scale(0.5)");
//
//   var groupOrange = svgMark.append("g").attr("id", "groupOrange"); // création d'un layer svg pour les segment du groupe orange.
//
//
// // <line id="o0" class="segment" x1="0" y1="0" x2="250" y2="500" stroke="orange" stroke-width="20" />
//   groupOrange.append("line")
//     .attr("id", "o0")
//     .attr("class", "segment")
//     .attr("x1", "0")
//     .attr("y1", "0")
//     .attr("x2", "250")
//     .attr("y2", "500")
//     .attr("stroke", "orange")
//     .attr("stroke-width", "20")


    // lancement app

    // au clic du bouton, regénère une marque de famille
    d3.select("#"+htmlIdPrefix+"regenerateButton").on("click", function() {
      hideAllSegment();

      var numberOfCode = d3.select("#"+htmlIdPrefix+"numberOfCode").node().value;

      var genome = genomeGenerator(numberOfCode);
      // showMarkFromCode("vc"); // affiche le(s) segments qui correspondent à un code.
      showMarkFromGenome(genome); // le génome est un tableau de code. ex: ["va","a3","o2","b5"]

    });

    // au changement du slider regénère une markque de famille
    d3.select("#"+htmlIdPrefix+"numberOfCode").on("change", function() {
      hideAllSegment();

      var numberOfCode = d3.select("#"+htmlIdPrefix+"numberOfCode").node().value;
      //console.log(numberOfCode);

      var genome = genomeGenerator(numberOfCode);
      // showMarkFromCode("vc"); // affiche le(s) segments qui correspondent à un code.
      showMarkFromGenome(genome); // le génome est un tableau de code. ex: ["va","a3","o2","b5"]

    });

    // au clic du bouton d'impression... imprime
    d3.select("#"+htmlIdPrefix+"printButton").on("click", function() {
      window.print();
    });


    // initialisation de l'app au démarrage
    hideAllSegment(); // cache tous les segments car ils ont la classe "segment"
    //showAllSegment();

    //var genome = ["va","a3","o2","b5"];
    var genome = genomeGenerator(numberOfCode);
    // showMarkFromCode("vc"); // affiche le(s) segments qui correspondent à un code.
    showMarkFromGenome(genome); // le génome est un tableau de code. ex: ["va","a3","o2","b5"]

  /**
  * Fonction qui supprime l'affichage de tous les segments.
  *
  * @param numberOfCode → int longueur du génome en nombre de code
  * @return genome  → tableau → une liste de code qui est le génome complet d'une marque de famille.  ex: ["va","a3","o2","b5"]
  */
  function genomeGenerator(numberOfCode) {

    // le tableau du génome
    var genome = [];
    // On rempli le tableau avec le nombre de code passés en paramètres
    for (var i = 0; i < numberOfCode; i++) {

      // génère une des 5 bases "bravo".
      var lettreBravo = "bravo";
      var randomNumber = Math.floor(Math.random() * 5);  // génère un nombre aléatoire entre 0 et 4 => BRAVO
      var randomBase = lettreBravo.slice(randomNumber, randomNumber+1);

      // génère un indice hexadécimal
      var randomNumber = Math.floor(Math.random() * 16);  // génère un nombre aléatoire entre 0 et 15
      var hexRandomNumber = randomNumber.toString(16); // codage du nombre en un seul caractère hexadécimal.

      var code = (randomBase+hexRandomNumber).toString();
      genome.push(code);
    }

    return genome;
  }


/**
* Fonction qui supprime l'affichage de tous les segments.
*
* @return
*/
function hideAllSegment() {
  var svgStructure = d3.select("#structure");

  svgStructure.selectAll(".segment")
    .style("display", "none");
}

/**
* Fonction qui supprime l'affichage de tous les segments.
*
* @return
*/
function showAllSegment() {
  var svgStructure = d3.select("#structure");

  svgStructure.selectAll(".segment")
    .style("display", "inline");
}

/**
* Fonction qui affiche les segments qui correspondent à un code fourni.
*
* @param genome  → tableau → une liste de code qui est le génome complet d'une marque de famille.  ex: ["va","a3","o2","b5"]
* @return
*/
function showMarkFromGenome(genome) {

  genome.forEach(showMarkFromCode); // pour chaque élément de la liste demande l'affichage du code
}

/**
* Fonction qui affiche les segments qui correspondent à un code fourni.
*
* @param code  → string → UN seul code 2 lettres "base"+nombre hexadécimal: ex: ab ou r3
* @return
*/
function showMarkFromCode(code) {

  //console.log(bravo);

  var baseBravo = code.slice(0, 1); // extrait la première lettre d'un code. ex: r3 => r
  var indiceBravoHexa = code.slice(1, 2); // extrait le seconde caractère du code. C'est un nombre hexadécimal. 0-f

  // transformation du code hexa en décimal.
  var indiceBravo = parseInt(indiceBravoHexa, 16);  // transformation du nombre hexadécimal en décimal. => f => 15

  // Obtient un tableau contenant la liste des segments. Provenant du tableau bravo.
  var segmentList = bravo[baseBravo][indiceBravo];

  segmentList.forEach(showSegment); // pour chaque élément de la liste demande l'affichage du segment.
}

/**
* Fonction qui affiche les segments qui correspondent à un code fourni.
*
* @param idHtmlSegment  → string → l'id du segment (sans le #) => ex: r5
* @return
*/
function showSegment(idHtmlSegment) {

  var svgStructure = d3.select("#structure");
  var selectedeSegment = svgStructure.select("#"+idHtmlSegment).style("display", "inline");

}




})();  // fin isolation
