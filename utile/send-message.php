<?php
/*******************************************************************************************
 * Nom du fichier     : send-message.php
 * Date		     	  : 21 avril 2021
 * @author	     	  : Mathieu Despont
 * But de ce fichier  : envoyer un e-mail avec une url qui permet de voir une marque de famille avec un genome connu
 *******************************************************************************************
 * Fichier appellé par ajax. On fourni 3 paramètres: pseudo, e-mail, et genome d'une marque de famille. ex: b3-r4-aa-v9-0f
 * L'adresse d'envoi utilisée est bis@ecodev.ch ... On ne peu plus utiliser n'importe quel donaine. Todo => à migrer chez eux
 *
 */


// ob_start("ob_gzhandler");
// session_start();
header('Content-Type: text/html; charset=UTF-8');
date_default_timezone_set('Europe/Zurich');

if (isset($_GET['pseudo'])) {
  $pseudo = $_GET['pseudo'];
}else{
  $pseudo = '';
}

if (isset($_GET['genome'])) {
  $genome = $_GET['genome'];
}else{
  $genome = '';
}

if (isset($_GET['destinataire'])) {
  $destinataire = $_GET['destinataire'];
}else{
  $destinataire = '';
}

  // si le destinataire n'est pas fourni ne fait rien.
if (!empty($destinataire)) {
  sendMark($destinataire, $genome, $pseudo);
  echo "ok";
}else{
  echo "⚠️ Adresse du destinataire non fournie !";
}
// testMail();


// todo tester le pattern du mail.
// todo: on veut l'url.. https://ecodev.ch/bis/marque.html?genome=a1-r3-b4&pseudo=Momo  urldecode ... etc..


function sendMark($to, $genome, $pseudo){

  // repris de https://www.php.net/manual/fr/function.mail.php

  // $to      = 'blanc@martouf.ch'; // test
  $subject = 'Marque de famille';

  $message = "Bonjour, \r\n Voici la marque de famille de ".$pseudo.".\r\n";
  $message .= "Cliquez sur le lien ci-dessous pour voir la marque.\r\n";
  $message .= "https://ecodev.ch/bis/marque.html?genome=".$genome;
  $message .= "\r\n\r\n";
  $message .= "Au plaisir de votre prochaine visite.\r\n\r\n";
  $message .= "Musée valaisan des Bisses";
  // $message = '
  //    <html>
  //     <head>
  //      <title>Marque de famille</title>
  //     </head>
  //     <body>
  //      <p>Bonjour, \r\n Voici la marque de famille de '+$pseudo+'.</p>
  //      <p>Cliquez sur le lien ci-dessous pour voir la marque.</p>
  //      <p><a href="https://ecodev.ch/bis/marque.html?genome=a1-r3-b4">https://ecodev.ch/bis/marque.html?genome=a1-r3-b4</a></p>
  //     </body>
  //    </html>
  //    ';


  $headers = array(
    'From' => 'bis@ecodev.ch',
    'X-Mailer' => 'PHP/' . phpversion()
  );
  // Pour envoyer un mail HTML, l'en-tête Content-type doit être défini
  // $headers[] = 'MIME-Version: 1.0';
  // $headers[] = 'Content-type: text/html; charset=iso-8859-1';

// debug
// echo "Destinataire".$to."\n\r";
// echo "Sujet".$subject."\r\n";
// echo "Message".$message."\r\n";
//
// print_r($headers);

 mail($to, $subject, $message, $headers);

} // sendmark


function testMail(){

    echo "test de mail()";
  $Name = "Toto"; //senders name
  $email = "mathieu.despont@ecodev.ch"; //senders e-mail adress
  $recipient = "mathieu@ecodev.ch"; //recipient
  $mail_body = "Texte du mail..."; //mail body
  $subject = "essai de mail php"; //subject
  $header = "From: ". $Name . " <" . $email . ">\r\n"; //optional headerfields

  echo "alors: ".$recipient.$subject.$mail_body.$header;

  mail($recipient, $subject, $mail_body, $header); //mail command :)
}
