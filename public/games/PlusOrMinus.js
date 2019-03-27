


class PlusOrMinus{

	constructor(){
		this.scorePartie = 100;
		this.hisghscore = null;
		this.nbAdeviner = this.tirerAleatoire();
		console.log('le nombre a deviner est : ' + this.nbAdeviner);
		this.propositionJoueur=null;
		this.isPartieTerminee = false;

		//this.refreshScore();
		



	}
	
	nouveauNombreADeviner(){
		this.nbAdeviner = this.tirerAleatoire;
	}
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
					this.finDuJeu();
				}
		
		


		}else{
				console.log("un entier pardis")
				document.getElementById("directiveID").innerHTML = "On souhaite un entier !!!!!"
		}
		

	}

	tirerAleatoire(){
		
		return Math.floor(Math.random() * 100);
	}

	donneNombre(){
		if(this.isPartieTerminee){
			alert("vous allez comencer une nouvelle partie");
			this.newPartie();
		}else{
			this.propositionJoueur = parseInt(document.getElementById("inputID").value);
		console.log('je recupere : '+ this.propositionJoueur);
		this.verify();
		}
		
		//console.log('je récupère le nombre : ' +document.getElementById("inputID").value);
	}

	refreshScore(){
		document.getElementById("scoreID").innerHTML = this.scorePartie;
	}
	refreshScoreAndIndication(){
		this.refreshScore();
		document.getElementById("indicationID").innerHTML = " ";
			}
	
	newPartie(){
		this.finDuJeu();
		this.scorePartie = 100;
		this.propositionJoueur=null;
		this.nbAdeviner = this.tirerAleatoire();
		this.isPartieTerminee=false;
		this.refreshScoreAndIndication();
		document.getElementById("inputID").value=" ";
		console.log('le nombre a deviner est'+ this.nbAdeviner);

	}

	

	finDuJeu(){

		/*const Http = new XMLHttpRequest();
		const url = "/endGame";
		Http.open("PUT", url);
		var data = {
			score : this.scorePartie
		}
		Http.setRequestHeader("Content-Type", "application/json");
		Http.send(data);

		Http.onreadystatechange= function(){
			if(this.readyState==4 && this.status==200){
				console.log(Http.responseText);
			}
		}
*/
		sendData({score : this.scorePartie}, '/endGame');
		

	}

	setUser(username){
		this.user = username;
	}
}


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


var pOm = new PlusOrMinus();

config = ()=>{

	var input = document.getElementById("inputID");

		// Execute a function when the user releases a key on the keyboard
		input.addEventListener("keyup", function(event) {
  		// Number 13 is the "Enter" key on the keyboard
  		if (event.keyCode === 13) {
    	// Cancel the default action, if needed
    	event.preventDefault();
    	// Trigger the button element with a click
   	 document.getElementById("buttonID").click();
 	 	}
		});
}



