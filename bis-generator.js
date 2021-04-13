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

//////// création de svg dynamique /////
  // Variable qui représente l'élément body sur lequel on se croche pour générer le contenu via d3.js
  var htmlBody = d3.select("#"+htmlIdPrefix+"zone");

  // crée un div dans le DOM qui est un espace pour une colonne de droite
    var rightColumn = htmlBody
        .append("div")
        .attr("id", "familyMark");


  // la taille du contenu = 946px  => 3/4 = 710
  // mapWidth =  .75 * windowWidth; // règle la taille du viewport à 75% de la taille de la fenêtre

  var svgMark = rightColumn
      .append("svg")
      .attr("id", "svgZone")
      .attr("width", markWidth)
      .attr("height", markHeight)
      .attr("transform", "scale(0.5)");

  var groupOrange = svgMark.append("g").attr("id", "groupOrange"); // création d'un layer svg pour les segment du groupe orange.


// <line id="o0" class="segment" x1="0" y1="0" x2="250" y2="500" stroke="orange" stroke-width="20" />
  groupOrange.append("line")
    .attr("id", "o0")
    .attr("class", "segment")
    .attr("x1", "0")
    .attr("y1", "0")
    .attr("x2", "250")
    .attr("y2", "500")
    .attr("stroke", "orange")
    .attr("stroke-width", "20")



  /**
  * Fonction qui affiche la légende de la carte avec la signification des couleurs.
  *
  * Cette fonction est appellée par la fonction updateMap(....)
  *
  * @param classSeparatorsLegend → array  "tableau", liste des valeurs qui servent de séparateur. 1 de moins que des classe de valeurs. ex: 4,6,8,10,12,15,20  on les place dans un tableau pour paramétrer le domain. En ajoutant un 0 en début de liste on peut générer automatiquement le legendDomain si l'on a pas de valeur négative !
  * @param colorSchemeLegend → string → le code de couleur issus de colorbrewer ex: RdYlGn  rouge vert divergent
  * @param classNumberLegend  → int → nombre de classes (donc de couleurs) (idem que sur colorbrewer) Attention 3-9 pour saturation, 3-11 pour divergent.
  * @param legendSeparatorsLegend  → array → La première valeur représente la borne inférieure. ex: 0,4,6,8,10,12,15,20 , sans spécialité, le reste est identique à classSeparators
  * @param legendLabelsLegend  → array de sring → la légende des couleurs. ex: "< 4", "4+", "6+", "8+", "10+", "12+", "15+", "20+"
  * @return
  */
  function showLegend(classSeparatorsLegend,colorSchemeLegend,classNumberLegend,legendSeparatorsLegend,legendLabelsLegend) {

    // définition de l'échelle
    var getMapColorLegend = d3.scale.threshold()
        .domain(classSeparatorsLegend)
        .range(colorbrewer[colorSchemeLegend][classNumberLegend]);

    // ajoute la légende de la carte (au niveau de svgMap et pas de groupCarto afin de ne pas l'inclure dans le zoom). Place la légende dans une groupe qui s'appelle mapSimplegroupLegend
    var legend = svgMap
      .append("g").attr("id", "mapSimplegroupLegend")
      .selectAll("g.legend")
      .data(legendSeparatorsLegend)  // tableau de données définissant la légende  // old legendDomain
      .enter().append("g") // crée un élément groupe svg au besoin.
      .attr("class", "legend"); // donne la classe legend à chaque groupe qui représente une légende.

      // décale la légende vers le haut où on a plus de place.
      var groupLegend = d3.select("#"+htmlIdPrefix+"mapSimplegroupLegend");
      groupLegend.attr("transform", "translate(0,-260)");

      // si la légende automatique est affichée on ne connait pas la taille de la légende donc masque le titre
      if (legendAuto =="0") {
        var textGroupLegend = d3.select("#"+htmlIdPrefix+"mapSimplegroupLegend")
        .append("text")
        .attr("id", "mapSimpletextGroupLegend")
        .attr("transform", "translate(20,270)")
        .text(legendTitle+" "+valueUnit) // version traduite: l['tarifTotalCts']
      }

     var ls_w = 20, ls_h = 20;

     // ajoute des rectangles dans tous les éléments g.legend représentés par la variable "legend".
     legend.append("rect")
     .attr("x", 20)
     .attr("y", function(d, i){ return mapHeight - (i*ls_h) - 2*ls_h;})
     .attr("width", ls_w)
     .attr("height", ls_h)
     .style("fill", function(d, i) { return getMapColorLegend(d); })  // retourne la couleur qui a été associée à la valeur fournie selon le générateur représenté par "getMapColor"
     .style("opacity", 0.9);

     // Ajoute des éléments textes svg avec les valeurs définies plus haut dans le tableau legend_labels
     legend.append("text")
     .attr("x", 50)
     .attr("y", function(d, i){ return mapHeight - (i*ls_h) - ls_h - 4;})
     .text(function(d, i){ return legendLabelsLegend[i]; });  // old legend_labels

  } // showLegend



  /**
  * Masque l'infobulle
  *
  * Cette fonction est appelleé au mouseout.
  * @return
  * @param objt aMunicipality l'élément courant des "data"
  */
  function hideTooltip(aMunicipality) {
    tooltip.transition().duration(300)
    .style("opacity", 0);
  }

  /**
  * Fonction qui masque l'image de loading
  */
  function hideLoading() {

    var loadingImage = d3.select("#"+htmlIdPrefix+"mapSimpleLoading");
    loadingImage.style("display", "none");
  }


  /**
  *  Gère le zoom/pan libre de la carte
  */
  function zoomed() {
    groupCarto.style("stroke-width", 1 / d3.event.scale + "px");
    groupCarto.attr("transform", "translate(" + d3.event.translate + ")scale(" + d3.event.scale + ")");
  }


})();  // fin isolation
