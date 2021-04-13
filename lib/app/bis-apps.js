
/**
* Ajoute un http:// à toute chaine de caractère dans laquelle ce serait manquant.
*
* @return string: l'url avec un http. (ne retourne pas le https ... mais en général si c'est bien configuré ça passe.)
* @param string str: l'url supposée à traiter.
*/
function addhttp(url) {
   if (!/^(f|ht)tps?:\/\//i.test(url)) {
      url = "http://" + url;
   }
   return url;
}


/**
* Remplace les retours chariots par des <br />
*
* Cette fonction est applée pour l'affichage de texte libre
* @return string: le texte
* @param string str: le texte à traiter
*/
function nl2br (str) {
    var breakTag = '<br />';
    return (str + '').replace(/([^>\r\n]?)(\r\n|\n\r|\r|\n)/g, '$1' + breakTag + '$2');
}


/**
* Teste si un string est blanc, null ou undefined.
* Voir: http://stackoverflow.com/questions/154059/how-do-you-check-for-an-empty-string-in-javascript
*
* @return string: true si le string est blanc, null ou undefined. => false sinon
* @param string str: le texte à traiter
*/
function isBlank(str) {
    return (!str || /^\s*$/.test(str));
}

/**
* Teste si un string est empty, null ou undefined.
* Voir: http://stackoverflow.com/questions/154059/how-do-you-check-for-an-empty-string-in-javascript
*
* @return string: true si le string est empty, null ou undefined. => false sinon
* @param string str: le texte à traiter
*/
function isEmpty(str) {
    return (!str || 0 === str.length);
}
