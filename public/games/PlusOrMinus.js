/**
* Jeu du Plus ou Moins, également codé par nos soins.
*/



// Le jeu est une classe
class PlusOrMinus{

	constructor(){
		this.scorePartie = 100;
		this.hisghscore = null;
		this.nbAdeviner = this.tirerAleatoire();
		console.log('le nombre a deviner est : ' + this.nbAdeviner);
		this.propositionJoueur=null;
		this.isPartieTerminee = false;

	}
	
	//changement du nouveau nombre à deviner
	nouveauNombreADeviner(){
		this.nbAdeviner = this.tirerAleatoire;
	}

	// vérificaiton de la propositon du joueur
	verify(){
		console.log(typeof this.propositionJoueur);
		if (Number.isInteger(this.propositionJoueur)) {
				document.getElementById("directiveID").innerHTML = " ";
				if(this.propositionJoueur>this.nbAdeviner){
					document.getElementById("indicationID").innerHTML = "--MOINS--";
					this.scorePartie--;
					this.refreshScore();

				}else if(this.propositionJoueur<this.nbAdeviner){
					document.getElementById("indicationID").innerHTML = "++PLUS++";
					this.scorePartie--;
					this.refreshScore();
				}else{
					document.getElementById("indicationID").innerHTML = "c'est GAGNÉ !!!!!";
					this.isPartieTerminee = true;
					this.finPartie();
				}
		
		


		}else{
				console.log("un entier pardis")
				document.getElementById("directiveID").innerHTML = "On souhaite un entier !!!!!"
		}
		

	}

	// renvoie un eniter aléatoire entre 0 et 100
	tirerAleatoire(){
		
		return Math.floor(Math.random() * 100);
	}


	//appelée quand le joueur donne sa réponse
	donneNombre(){
		if(this.isPartieTerminee){
			alert("vous allez comencer une nouvelle partie");
			this.newPartie();
		}else{
			this.propositionJoueur = parseInt(document.getElementById("inputID").value);
		console.log('je recupere : '+ this.propositionJoueur);
		this.verify();// on vérifie si la proposition est la bonne
		}
		
		//console.log('je récupère le nombre : ' +document.getElementById("inputID").value);
	}


	// pour mettre le score à jour dans le .ejs
	refreshScore(){
		document.getElementById("scoreID").innerHTML = this.scorePartie;
	}

	//pour mettre à jour le score et les indications dans le .ejs
	refreshScoreAndIndication(){
		this.refreshScore();
		document.getElementById("indicationID").innerHTML = " ";
			}
	
	// configure les paramètres pour une nouvelle partie
	newPartie(){
		//this.finPartie();
		this.scorePartie = 100;
		this.propositionJoueur=null;
		this.nbAdeviner = this.tirerAleatoire();
		this.isPartieTerminee=false;
		this.refreshScoreAndIndication();
		document.getElementById("inputID").value=" ";
		console.log('le nombre a deviner est'+ this.nbAdeviner);

	}

	// méthode appelée à la fin de la partie
	finPartie(){
			// on envoie le score de la partie au server (Cf index.js)
			sendData({score : this.scorePartie}, '/endGame');

	}


	setUser(username){
		this.user = username;
	}
}

/**
* Procédure qui nous permet de générer une requête PUT vers le server pour envoyer
* des données 'data' avec l'URL 'url'
*/
function sendData(data, url) {
  var XHR = new XMLHttpRequest();
  var urlEncodedData = "";
  var urlEncodedDataPairs = [];
  var name;

  // Transformez l'objet data en un tableau de paires clé/valeur codées URL.
  for(name in data) {
    urlEncodedDataPairs.push(encodeURIComponent(name) + '=' + encodeURIComponent(data[name]));
  }

  // Combinez les paires en une seule chaîne de caractères et remplacez tous
  // les espaces codés en % par le caractère'+' ; cela correspond au comportement
  // des soumissions de formulaires de navigateur.
  urlEncodedData = urlEncodedDataPairs.join('&').replace(/%20/g, '+');

  // Définissez ce qui se passe en cas de succès de soumission de données
  XHR.addEventListener('load', function(event) {
    //alert('Ouais ! Données envoyées et réponse chargée.');
  });

  // Définissez ce qui arrive en cas d'erreur
  XHR.addEventListener('error', function(event) {
    //alert('Oups! Quelque chose s\'est mal passé.');
  });

  // Configurez la requête
  XHR.open('PUT', url);

  // Ajoutez l'en-tête HTTP requise pour requêtes POST de données de formulaire 
  XHR.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');

  // Finalement, envoyez les données.
  XHR.send(urlEncodedData);
}




//  -------- Programme principal ---------

// va contenir une instance de la classe PlusOrMinus (le jeu en somme)
var pOm;


// fonction de configuration appelée au sein de la page 'PlusOrMinus.ejs'
config = function(){

	
	pOm = new PlusOrMinus(); // On créé l'instance du jeu

	//contient l'ID de l'entrée
	var input = document.getElementById("inputID");

// on permet à l'utilisateur d'appuyer sur "entrer" pour valider sa proposition

		input.addEventListener("keyup", function(event) {
  		// Nombre 13 est le touche "entrer" du clavier
  		if (event.keyCode === 13) {
    	// Annule les actions par défaut si besoin
    	event.preventDefault();
    	// déclenche la procédure onClick du button : "buttonID"
   	 document.getElementById("buttonID").click(); 
 	 	}
		});
}



