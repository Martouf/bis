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
  var markIdPrefix = ""; // permet de distinguer des marque dans la même page.

  // Pour avoir un paramètre unique à mettre dans l'url de téléchargements des data, afin d'éviter le cache.
  var dateTime = Date.now();
  var dateTimeSlug = Math.floor(dateTime / 1000); // en seconde et pas millisecondes.

  var windowWidth = 1180; // taille par défaut si non existant // l'ipad air devrait avoir une résolution réelle de 1180X820 (+ le facteur 2 retina)
  var windowWidth = (document.body.clientWidth);

  // valeur par défaut du viewport => desktop
  var markDefautlWidth = 500;
  var markDefaultHeight = 500;

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


    // lancement app

    // au clic du bouton, regénère une marque de famille
    d3.select("#"+htmlIdPrefix+"regenerateButton").on("click", function() {
      hideAllSegment();

      var numberOfCode = d3.select("#"+htmlIdPrefix+"numberOfCode").node().value;

      var genome = genomeGenerator(numberOfCode);
      // showMarkFromCode("vc"); // affiche le(s) segments qui correspondent à un code.
      showMarkFromGenome(genome); // le génome est un tableau de code. ex: ["va","a3","o2","b5"]

    });

    // au changement du slider regénère une marque de famille
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

    showBaseStructure(markDefautlWidth,"");

    /**
    * Fonction qui affiche tous les segments.
    * Nécessite un ancrage sur le div rightColumn
    * On part du principe que la marque est un carré donc seule la largeur est prise en compte et la longueur est égale.
    *
    * @param markWidth → int largeur en px
    * @param markIdPrefix → strng un prefix qui permet de distinguer une marque d'une autre si elles sont affichées sur la même page.
    * @return
    */
    function showBaseStructure(markWidth,markIdPrefix) {

      // l'origine des coordonnées est en haut à gauche.
      // Déplacement horizontal sur la droite = augmentation de l'axe des x
      // Déplacement vertical sur le bas = augmentation de l'axe des y

      // la marque est un carré, donc on déduit la hauteur de la largeur
      var markHeight = markWidth;

      // mise en variable de valeurs utile surs la grille
      var origine = 0;
      var midWidth = markWidth/2;  // moitié de la largeur
      var midHeight = markHeight/2;  // moitié de la hauteur

      var quartWidth = markWidth/4;  // quart de la largeur
      var quartHeight = markHeight/4;  // quart de la hauteur

      var treeQuartWidth = 3*markWidth/4;  // 3/4 da la largeur
      var treeQuartHeight = 3*markHeight/4;  // 3/4 de la hauteur

      var anthraciteBlockWidth = 60; // largeur d'un bloc anthracite

      var strokeWidth = 20; // épaisseur d'un trait

      // crée une zone svg ave une taille précise et un niveau de zoom. (il reste des marges autour du svg si on zoom)
      var svgMark = rightColumn
          .append("svg")
          .attr("id", "svgZone")
          .attr("width", markWidth)
          .attr("height", markHeight)
          .attr("transform", "scale(.5)");

      // chaque base BRAVO a son groupe de segement ça nous permettra de les moduler.
      var groupBlue = svgMark.append("g").attr("id", markIdPrefix+"groupBlue"); // création d'un layer svg pour les segment du groupe bleu.
      var groupRed = svgMark.append("g").attr("id", markIdPrefix+"groupRed");
      var groupAnthracite = svgMark.append("g").attr("id", markIdPrefix+"groupAnthracite");
      var groupViolet = svgMark.append("g").attr("id", markIdPrefix+"groupViolet");
      var groupOrange = svgMark.append("g").attr("id", markIdPrefix+"groupOrange");

      // couleur par défaut des groupe. Vu que l'impression est seulement monochrome, on ne va pas les utiliser. Mais pour le debug c'est bien.
      var blueColor = "blue";
      var redColor = "red";
      var anthraciteColor = "#555";
      var violetColor = "violet";
      var orangeColor = "orange";

      // Segments du groupe Bleu
      // <polyline id="b0" class="segment" points="500 0, 550 0, 500 100, 450 0, 500 0" stroke="blue" stroke-width="20" fill="blue" />
      // <polyline id="b1" class="segment" points="1000 500, 1000 550, 900 500, 1000 450, 1000 500" stroke="blue" stroke-width="20" fill="blue" />
      // <polyline id="b2" class="segment" points="500 1000, 450 1000, 500 900, 550 1000, 500 1000" stroke="blue" stroke-width="20" fill="blue" />
      // <polyline id="b3" class="segment" points="0 500, 0 450, 100 500, 0 550, 0 500" stroke="blue" stroke-width="20" fill="blue" />

      // Segments du groupe Rouge
      // <line id="r0" class="segment" x1="0" y1="0" x2="500" y2="500" stroke="red" stroke-width="20" />
      // <line id="r1" class="segment" x1="1000" y1="0" x2="500" y2="500" stroke="red" stroke-width="20" />
      // <line id="r2" class="segment" x1="1000" y1="1000" x2="500" y2="500" stroke="red" stroke-width="20" />
      // <line id="r3" class="segment" x1="0" y1="1000" x2="500" y2="500" stroke="red" stroke-width="20" />

      groupRed.append("line")
        .attr("id", markIdPrefix+"r0").attr("class", "segment")
        .attr("x1", origine).attr("y1", origine)
        .attr("x2", midWidth).attr("y2", midHeight)
        .attr("stroke", redColor)
        .attr("stroke-width", strokeWidth);

      groupRed.append("line")
        .attr("id", markIdPrefix+"r1").attr("class", "segment")
        .attr("x1", markWidth).attr("y1", origine)
        .attr("x2", midWidth).attr("y2", midHeight)
        .attr("stroke", redColor)
        .attr("stroke-width", strokeWidth);

      groupRed.append("line")
        .attr("id", markIdPrefix+"r1").attr("class", "segment")
        .attr("x1", markWidth).attr("y1", markHeight)
        .attr("x2", midWidth).attr("y2", midHeight)
        .attr("stroke", redColor)
        .attr("stroke-width", strokeWidth);

      groupRed.append("line")
        .attr("id", markIdPrefix+"r1").attr("class", "segment")
        .attr("x1", origine).attr("y1", markHeight)
        .attr("x2", midWidth).attr("y2", midHeight)
        .attr("stroke", redColor)
        .attr("stroke-width", strokeWidth);

      // Segments du groupe anthracite
      // <rect id="a0" class="segment" x="220" y="0" width="60" height="60" fill="#555" />
      // <rect id="a1" class="segment" x="720" y="0" width="60" height="60" fill="#555" />
      //
      // <rect id="a2" class="segment" x="0" y="220" width="60" height="60" fill="#555" />
      // <rect id="a3" class="segment" x="220" y="220" width="60" height="60" fill="#555" />
      // <rect id="a4" class="segment" x="470" y="220" width="60" height="60" fill="#555" />
      // <rect id="a5" class="segment" x="720" y="220" width="60" height="60" fill="#555" />
      // <rect id="a6" class="segment" x="940" y="220" width="60" height="60" fill="#555" />
      //
      // <rect id="a7" class="segment" x="220" y="470" width="60" height="60" fill="#555" />
      // <rect id="a8" class="segment" x="720" y="470" width="60" height="60" fill="#555" />
      //
      // <rect id="a9" class="segment" x="0" y="720" width="60" height="60" fill="#555" />
      // <rect id="aa" class="segment" x="220" y="720" width="60" height="60" fill="#555" />
      // <rect id="ab" class="segment" x="470" y="720" width="60" height="60" fill="#555" />
      // <rect id="ac" class="segment" x="720" y="720" width="60" height="60" fill="#555" />
      // <rect id="ad" class="segment" x="940" y="720" width="60" height="60" fill="#555" />
      //
      // <rect id="aa" class="segment" x="220" y="940" width="60" height="60" fill="#555" />
      // <rect id="aa" class="segment" x="720" y="940" width="60" height="60" fill="#555" />

      // Segments du groupe Violet
      // <line id="v0" class="segment" x1="0" y1="0" x2="500" y2="0" stroke="violet" stroke-width="20" />
      // <line id="v1" class="segment" x1="500" y1="0" x2="1000" y2="0" stroke="violet" stroke-width="20" />
      // <line id="v2" class="segment" x1="1000" y1="0" x2="1000" y2="500" stroke="violet" stroke-width="20" />
      // <line id="v3" class="segment" x1="1000" y1="500" x2="1000" y2="1000" stroke="violet" stroke-width="20" />
      // <line id="v4" class="segment" x1="1000" y1="1000" x2="500" y2="1000" stroke="violet" stroke-width="20" />
      // <line id="v5" class="segment" x1="500" y1="1000" x2="0" y2="1000" stroke="violet" stroke-width="20" />
      // <line id="v6" class="segment" x1="0" y1="1000" x2="0" y2="500" stroke="violet" stroke-width="20" />
      // <line id="v7" class="segment" x1="0" y1="500" x2="0" y2="0" stroke="violet" stroke-width="20" />

      groupViolet.append("line")
        .attr("id", markIdPrefix+"v0").attr("class", "segment")
        .attr("x1", origine).attr("y1", origine)
        .attr("x2", midWidth).attr("y2", origine)
        .attr("stroke", violetColor)
        .attr("stroke-width", strokeWidth);

      groupViolet.append("line")
        .attr("id", markIdPrefix+"v1").attr("class", "segment")
        .attr("x1", midWidth).attr("y1", origine)
        .attr("x2", markWidth).attr("y2", origine)
        .attr("stroke", violetColor)
        .attr("stroke-width", strokeWidth);

      groupViolet.append("line")
        .attr("id", markIdPrefix+"v2").attr("class", "segment")
        .attr("x1", markWidth).attr("y1", origine)
        .attr("x2", markWidth).attr("y2", midHeight)
        .attr("stroke", violetColor)
        .attr("stroke-width", strokeWidth);

      groupViolet.append("line")
        .attr("id", markIdPrefix+"v3").attr("class", "segment")
        .attr("x1", markWidth).attr("y1", midWidth)
        .attr("x2", markWidth).attr("y2", markHeight)
        .attr("stroke", violetColor)
        .attr("stroke-width", strokeWidth);

      groupViolet.append("line")
        .attr("id", markIdPrefix+"v4").attr("class", "segment")
        .attr("x1", markWidth).attr("y1", markHeight)
        .attr("x2", midWidth).attr("y2", markHeight)
        .attr("stroke", violetColor)
        .attr("stroke-width", strokeWidth);

      groupViolet.append("line")
        .attr("id", markIdPrefix+"v5").attr("class", "segment")
        .attr("x1", midWidth).attr("y1", markHeight)
        .attr("x2", origine).attr("y2", markHeight)
        .attr("stroke", violetColor)
        .attr("stroke-width", strokeWidth);

      groupViolet.append("line")
        .attr("id", markIdPrefix+"v6").attr("class", "segment")
        .attr("x1", origine).attr("y1", markHeight)
        .attr("x2", origine).attr("y2", midHeight)
        .attr("stroke", violetColor)
        .attr("stroke-width", strokeWidth);

      groupViolet.append("line")
        .attr("id", markIdPrefix+"v7").attr("class", "segment")
        .attr("x1", origine).attr("y1", midHeight)
        .attr("x2", origine).attr("y2", origine)
        .attr("stroke", violetColor)
        .attr("stroke-width", strokeWidth);

      // <line id="v8" class="segment" x1="500" y1="0" x2="500" y2="500" stroke="violet" stroke-width="20" />
      // <line id="v9" class="segment" x1="1000" y1="500" x2="500" y2="500" stroke="violet" stroke-width="20" />
      // <line id="va" class="segment" x1="500" y1="1000" x2="500" y2="500" stroke="violet" stroke-width="20" />
      // <line id="vb" class="segment" x1="0" y1="500" x2="500" y2="500" stroke="violet" stroke-width="20" />

      groupViolet.append("line")
        .attr("id", markIdPrefix+"v8").attr("class", "segment")
        .attr("x1", midWidth).attr("y1", origine)
        .attr("x2", midWidth).attr("y2", midHeight)
        .attr("stroke", violetColor)
        .attr("stroke-width", strokeWidth);

      groupViolet.append("line")
        .attr("id", markIdPrefix+"v9").attr("class", "segment")
        .attr("x1", markWidth).attr("y1", midHeight)
        .attr("x2", midWidth).attr("y2", midHeight)
        .attr("stroke", violetColor)
        .attr("stroke-width", strokeWidth);

      groupViolet.append("line")
        .attr("id", markIdPrefix+"va").attr("class", "segment")
        .attr("x1", midWidth).attr("y1", markHeight)
        .attr("x2", midWidth).attr("y2", midHeight)
        .attr("stroke", violetColor)
        .attr("stroke-width", strokeWidth);

      groupViolet.append("line")
        .attr("id", markIdPrefix+"vb").attr("class", "segment")
        .attr("x1", origine).attr("y1", midHeight)
        .attr("x2", midWidth).attr("y2", midHeight)
        .attr("stroke", violetColor)
        .attr("stroke-width", strokeWidth);

      // Segment du groupe Orange,
      // <line id="o0" class="segment" x1="0" y1="0" x2="250" y2="500" stroke="orange" stroke-width="20" />
      // <line id="o1" class="segment" x1="250" y1="500" x2="500" y2="0" stroke="orange" stroke-width="20" />
      // <line id="o2" class="segment" x1="250" y1="500" x2="500" y2="1000" stroke="orange" stroke-width="20" />
      // <line id="o3" class="segment" x1="250" y1="500" x2="0" y2="1000" stroke="orange" stroke-width="20" />
      //
      // <line id="o4" class="segment" x1="500" y1="0" x2="750" y2="500" stroke="orange" stroke-width="20" />
      // <line id="o5" class="segment" x1="750" y1="500" x2="1000" y2="0" stroke="orange" stroke-width="20" />
      // <line id="o6" class="segment" x1="750" y1="500" x2="1000" y2="1000" stroke="orange" stroke-width="20" />
      // <line id="o7" class="segment" x1="750" y1="500" x2="500" y2="1000" stroke="orange" stroke-width="20" />
      groupOrange.append("line")
        .attr("id", markIdPrefix+"o0").attr("class", "segment")
        .attr("x1", origine).attr("y1", origine)
        .attr("x2", quartWidth).attr("y2", midHeight)
        .attr("stroke", orangeColor)
        .attr("stroke-width", strokeWidth);

      groupOrange.append("line")
        .attr("id", markIdPrefix+"o1").attr("class", "segment")
        .attr("x1", quartWidth).attr("y1", midHeight)
        .attr("x2", midWidth).attr("y2", origine)
        .attr("stroke", orangeColor)
        .attr("stroke-width", strokeWidth);

      groupOrange.append("line")
        .attr("id", markIdPrefix+"o2").attr("class", "segment")
        .attr("x1", quartWidth).attr("y1", midHeight)
        .attr("x2", midWidth).attr("y2", markHeight)
        .attr("stroke", orangeColor)
        .attr("stroke-width", strokeWidth);

      groupOrange.append("line")
        .attr("id", markIdPrefix+"o3").attr("class", "segment")
        .attr("x1", quartWidth).attr("y1", midHeight)
        .attr("x2", origine).attr("y2", markHeight)
        .attr("stroke", orangeColor)
        .attr("stroke-width", strokeWidth);

      groupOrange.append("line")
        .attr("id", markIdPrefix+"o4").attr("class", "segment")
        .attr("x1", midWidth).attr("y1", origine)
        .attr("x2", treeQuartWidth).attr("y2", midHeight)
        .attr("stroke", orangeColor)
        .attr("stroke-width", strokeWidth);

      groupOrange.append("line")
        .attr("id", markIdPrefix+"o5").attr("class", "segment")
        .attr("x1", treeQuartWidth).attr("y1", midHeight)
        .attr("x2", markWidth).attr("y2", origine)
        .attr("stroke", orangeColor)
        .attr("stroke-width", strokeWidth);

      groupOrange.append("line")
        .attr("id", markIdPrefix+"o6").attr("class", "segment")
        .attr("x1", treeQuartWidth).attr("y1", midHeight)
        .attr("x2", markWidth).attr("y2", markHeight)
        .attr("stroke", orangeColor)
        .attr("stroke-width", strokeWidth);

      groupOrange.append("line")
        .attr("id", markIdPrefix+"o7").attr("class", "segment")
        .attr("x1", treeQuartWidth).attr("y1", midHeight)
        .attr("x2", midWidth).attr("y2", markHeight)
        .attr("stroke", orangeColor)
        .attr("stroke-width", strokeWidth);


    }

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
