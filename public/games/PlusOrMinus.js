
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
					this.finPartie();
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
		this.scorePartie = 100;
		this.propositionJoueur=null;
		this.nbAdeviner = this.tirerAleatoire();
		this.isPartieTerminee=false;
		this.refreshScoreAndIndication();
		document.getElementById("inputID").value=" ";
		console.log('le nombre a deviner est'+ this.nbAdeviner);

	}

	finPartie(){
		// sauvegarder score de la partie avec la date ==> {jeu: score: date:}

	}

	finDuJeu(){



	}
}


var pOm = new PlusOrMinus();





