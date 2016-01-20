//	La variable permet d'obtenir la probabilitée de chance de gagner pour l'ordinateur
//	Elle évolue à chaque fois que le joueur pose un pion

var plateau = [
	[3/8, 2/8, 3/8],
	[2/8, 4/8, 2/8],
	[3/8, 2/8, 3/8],
];


//	La variable permet de savoir si une ligne, colonne, diagonale est utilise à vérifier lorsuqe l'ordinateur joue
//	Elle évolue à chaque fois que le joueur pose un pion (pour la variable utileAttaque)
//	Elle évolue à chaque fois que l'ordinateur pose un pion (pour la variable utileDefense)

var utileAttaque = [[true, true, true], [true, true, true], true, true];
var utileDefense = [[true, true, true], [true, true, true], true, true];


//	Permet de redimensionner la taille du plateau

function RedimensionnerPlateau() {
	$("body").append("<div id='plateau'></div>");

	if ($(window).width() <= $(window).height()) {
		var taillePlateau = ($(window).width() / 2);
	}
	else {
		var taillePlateau = ($(window).height() / 2);
	}

	var marginTop = ($(window).height() - taillePlateau) / 2;
	var marginLeft = ($(window).width() - taillePlateau) / 2;

	var tailleCase = (taillePlateau / 3) - 2;


	//	Modification taille plateau

	$("#plateau").width(taillePlateau);
	$("#plateau").height(taillePlateau);

	$("#plateau").css("margin-top", marginTop + "px");
	$("#plateau").css("margin-left", marginLeft + "px");	


	//	Modification taille case

	$(".case").width(tailleCase);
	$(".case").height(tailleCase);

	$(".case p").css("line-height", tailleCase + "px");
}


//	Permet de créer le plateau

function CreerPlateau() {
	var classe = "";

	$("body").append("<button id='ordinateurCommence'>L'ordinateur commence</button>");


	$("#ordinateurCommence").click(function() {
		OrdinateurJoue();	
		$(this).hide();
	})

	$("body").append("<div id='plateau'></div>");

	for (var numeroLigne = 0; numeroLigne < plateau.length; numeroLigne++) {
		for (var numeroColonne = 0; numeroColonne < plateau[numeroLigne].length; numeroColonne++) {
			if (numeroLigne == 0 && numeroColonne == 0) {
				classe = "case case_top case_left";
			}
			else if (numeroLigne == 0) {
				classe = "case case_top case_default";
			}
			else if (numeroColonne == 0) {
				classe = "case case_left";
			}
			else {
				classe = "case case_default";
			}

			$("#plateau").append("<div id='" + numeroLigne + "_" + numeroColonne + "' class='" + classe + "'><p>" + plateau[numeroLigne][numeroColonne] + "</p></div>");
		}
	}

	RedimensionnerPlateau();
}


//	Permet de mettre à jour les probabilitées affichées dans les cases

function AfficherValeurPlateau() {
	for (var numeroLigne = 0; numeroLigne < plateau.length; numeroLigne++) {
		for (var numeroColonne = 0; numeroColonne < plateau[numeroLigne].length; numeroColonne++) {
			if ($("#" + numeroLigne + "_" + numeroColonne).hasClass("active") == false ) {
				$("#" + numeroLigne + "_" + numeroColonne).html("<p>" + plateau[numeroLigne][numeroColonne] + "</p>");
			}
		}
	}

	RedimensionnerPlateau();
}


//	Permet de modifier les probabilitées dans une case

function ModifierValeurCase(numeroLigne, numeroColonne) {
	if ((plateau[numeroLigne][numeroColonne] > 0 || plateau[numeroLigne][numeroColonne] != null)) {
		plateau[numeroLigne][numeroColonne] = plateau[numeroLigne][numeroColonne] - (1 / 8);

		if (plateau[numeroLigne][numeroColonne] < 0) {
			plateau[numeroLigne][numeroColonne] = 0;
		}
	}
}


//	permet de modifier les probabilitées pour tout le plateau

function ModifierValeurPlateau(numeroLigne, numeroColonne) {

	//	Ligne

	for (var _numeroColonne = 0; _numeroColonne < 3; _numeroColonne++) {
		ModifierValeurCase(numeroLigne, _numeroColonne);
	}

	//	Colonne

	for (var _numeroLigne = 0; _numeroLigne < 3; _numeroLigne++) {
		ModifierValeurCase(_numeroLigne, numeroColonne);
	}

	//	Diagonale haut-gauche / bas-droite

	if (numeroLigne == numeroColonne) {
		var _numeroColonne = 2;

		for (var _numero = 0; _numero < 3; _numero++) {
			ModifierValeurCase(_numero, _numero);
		}
	}

	//	Diagonale haut-droite / bas-gauche

	if (numeroLigne + numeroColonne == 2) {
		for (var _numeroLigne = 0; _numeroLigne < 3; _numeroLigne++) {
			var _numeroColonne = 2 - _numeroLigne;

			ModifierValeurCase(_numeroLigne, _numeroColonne);
		}
	}
}


//	permet d'obtenir la probabilitée maximum

function ProbabiliteMaximum() {
	var probabiliteMax = 0;

	for (var numeroLigne = 0; numeroLigne < 3; numeroLigne++) {
		for (var numeroColonne = 0; numeroColonne < 3; numeroColonne++) {
			if (plateau[numeroLigne][numeroColonne] > probabiliteMax) {
				probabiliteMax = plateau[numeroLigne][numeroColonne];
			}
		}
	}

	return probabiliteMax;
}


//	Permet d'afficher le pion de l'ordinateur sur le plateau

function OrdinateurPosePion(numeroLigne, numeroColonne) {
	$("#" + numeroLigne + "_" + numeroColonne).html("");
	$("#" + numeroLigne + "_" + numeroColonne).addClass("active");
	$("#" + numeroLigne + "_" + numeroColonne).addClass("ordinateur");
	$("#" + numeroLigne + "_" + numeroColonne).append("<div class='rond'></div>");

	plateau[numeroLigne][numeroColonne] = null;

	utileDefense[0][numeroLigne] = false;
	utileDefense[1][numeroColonne] = false;

	if (numeroLigne == numeroColonne) {
		utileDefense[2] = false;
	}

	if (numeroColonne == (2 - numeroLigne)) {
		utileDefense[3] = false;
	}
}


//	Vérifie les cases du plateau pour que l'ordinateur choisisse la meilleur option
//	La vérification peut êter fait en attaque (nom = ordiateur) et en defense (nom = joueur)

function VerifierCase(nom) {
	var pionPose = false;

	if (nom == "ordinateur") {
		utile = utileAttaque;
	}
	else {
		utile = utileDefense;
	}

	//	Ligne

	var numeroLigne = 0;

	while (pionPose == false && numeroLigne < 3) {
		if (utile[0][numeroLigne] == true) {

			var _numeroColonnePose = null;

			if ($("#" + numeroLigne + "_0").hasClass(nom) == true && $("#" + numeroLigne + "_1").hasClass(nom) == true) {
				_numeroColonnePose = 2;
			}
			else if ($("#" + numeroLigne + "_0").hasClass(nom) == true && $("#" + numeroLigne + "_2").hasClass(nom) == true) {
				_numeroColonnePose = 1;
			}
			else if ($("#" + numeroLigne + "_1").hasClass(nom) == true && $("#" + numeroLigne + "_2").hasClass(nom) == true) {
				_numeroColonnePose = 0
			}

			if (_numeroColonnePose != null && $("#" + numeroLigne + "_" + _numeroColonnePose).hasClass("active") == false) {
				OrdinateurPosePion(numeroLigne, _numeroColonnePose)

				pionPose = true;
			}
		}

		numeroLigne++;
	}

	//	Colonne

	var numeroColonne = 0;

	while (pionPose == false && numeroColonne < 3) {
		if (utile[1][numeroColonne] == true) {

			var _numeroLignePose = null;

			if ($("#0_" + numeroColonne).hasClass(nom) == true && $("#1_" + numeroColonne).hasClass(nom) == true) {
				_numeroLignePose = 2;
			}
			else if ($("#0_" + numeroColonne).hasClass(nom) == true && $("#2_" + numeroColonne).hasClass(nom) == true) {
				_numeroLignePose = 1;
			}
			else if ($("#1_" + numeroColonne).hasClass(nom) == true && $("#2_" + numeroColonne).hasClass(nom) == true) {
				_numeroLignePose = 0
			}

			if (_numeroLignePose != null && $("#" + _numeroLignePose + "_" + numeroColonne).hasClass("active") == false) {
				OrdinateurPosePion(_numeroLignePose, numeroColonne)

				pionPose = true;
			}
		}

		numeroColonne++;
	}

	//	Diagonale haut-gauche / bas-droite

	var numero = 0;

	if (utile[2] == true && pionPose == false) {

		var _numeroPose = null;

		if ($("#0_0").hasClass(nom) == true && $("#1_1").hasClass(nom) == true) {
			_numeroPose = 2;
		}
		else if ($("#0_0").hasClass(nom) == true && $("#2_2").hasClass(nom) == true) {
			_numeroPose = 1;
		}
		else if ($("#1_1").hasClass(nom) == true && $("#2_2").hasClass(nom) == true) {
			_numeroPose = 0;
		}

		if (_numeroPose != null && $("#" + _numeroPose + "_" + _numeroPose).hasClass("active") == false) {
			OrdinateurPosePion(_numeroPose, _numeroPose)

			pionPose = true;
		}
	}

	//	Diagonale haut-droite / bas-gauche

	var numeroLigne = 0;

	if (utile[3] == true && pionPose == false) {

		var _numeroLignePose = null;

		if ($("#0_2").hasClass(nom) == true && $("#1_1").hasClass(nom) == true) {
			_numeroLignePose = 2;
			_numeroColonnePose = 0;

			console.log("ok2");
		}
		else if ($("#0_2").hasClass(nom) == true && $("#2_0").hasClass(nom) == true) {
			_numeroLignePose = 1;
			_numeroColonnePose = 1;
		}
		else if ($("#1_1").hasClass(nom) == true && $("#2_0").hasClass(nom) == true) {
			_numeroLignePose = 0;
			_numeroColonnePose = 2;
		}

		if (_numeroLignePose != null && $("#" + _numeroLignePose + "_" + _numeroColonnePose).hasClass("active") == false) {
			OrdinateurPosePion(_numeroLignePose, _numeroColonnePose)

			pionPose = true;
		}
	}

	return pionPose;

}


//	Phase de jeux de l'ordinateur

function OrdinateurJoue() {

	//	Attaque

	var pionPose = VerifierCase("ordinateur");

	//	Defense

	if (pionPose == false) {
		pionPose = VerifierCase("joueur");
	}

	//	Aleatoire

	if (pionPose == false) {
		var probabiliteMax = ProbabiliteMaximum();
		var listeDesPossibilites = [];

		for (var numeroLigne = 0; numeroLigne < 3; numeroLigne++) {
			for (var numeroColonne = 0; numeroColonne < 3; numeroColonne++) {
				if (plateau[numeroLigne][numeroColonne] == probabiliteMax) {
					listeDesPossibilites.push([numeroLigne, numeroColonne]);
				}
			}
		}

		while(pionPose == false) {
			var caseSelectione = listeDesPossibilites[Math.floor(Math.random() * (listeDesPossibilites.length))];

			if ($("#" + caseSelectione[0] + "_" + caseSelectione[1]).hasClass("active") == false) {
				OrdinateurPosePion(caseSelectione[0], caseSelectione[1]);

				pionPose = true;
			}
		}
	}
}


//	Affiche la fin du match

function executeFinMatch(nom) {
	for (var numeroLigne = 0; numeroLigne < 3; numeroLigne++) {
		for (var numeroColonne = 0; numeroColonne < 3; numeroColonne++) {
			$("#" + numeroLigne + "_" + numeroColonne).addClass("active");
		}
	}
	$("body").prepend("<h1>" + nom + " gagne !</h1><button id='refresh'>Recommencer</button>");


	//	permet de recommencer une partie

	$("#refresh").click(function() {
		location.reload();
	})
}


//	Vérifie si le match est terminée

function VerifierFinMatch() {
	var finMatch = false;

	//	Ligne

	if (finMatch == false) {
		for (var numeroLigne = 0; numeroLigne < 3; numeroLigne++) {
			var _continue = true;
			var nom = "";

			if ($("#" + numeroLigne + "_0").hasClass("ordinateur") == true) {
				nom = "ordinateur";
			}
			else if ($("#" + numeroLigne + "_0").hasClass("joueur") == true) {
				nom = "joueur";
			}
			else {
				_continue = false;
			}

			if ($("#" + numeroLigne + "_0").hasClass(nom) == true && $("#" + numeroLigne + "_1").hasClass(nom) == true && $("#" + numeroLigne + "_2").hasClass(nom) == true) {
				finMatch = true;
				_continue = false;
				executeFinMatch(nom);

				for (var _numeroColonne = 0; _numeroColonne < 3; _numeroColonne++) {
					$("#" + numeroLigne + "_" + _numeroColonne).addClass("fin");
				}

			}
			else {
				_continue = false;
			}
		}
	}

	//	Colonne

	if (finMatch == false) {
		for (var numeroColonne = 0; numeroColonne < 3; numeroColonne++) {
			var _continue = true;
			var nom = "";

			if ($("#0_" + numeroColonne).hasClass("ordinateur") == true) {
				nom = "ordinateur";
			}
			else if ($("#0_" + numeroColonne).hasClass("joueur") == true) {
				nom = "joueur";
			}
			else {
				_continue = false;
			}

			if ($("#0_" + numeroColonne).hasClass(nom) == true && $("#1_" + numeroColonne).hasClass(nom) == true && $("#2_" + numeroColonne).hasClass(nom) == true) {
				finMatch = true;
				_continue = false;
				executeFinMatch(nom);

				for (var _numeroLigne = 0; _numeroLigne < 3; _numeroLigne++) {
					$("#" + _numeroLigne + "_" + numeroColonne).addClass("fin");
				}
			}
			else {
				_continue = false;
			}
		}
	}

	//	Diagonale haut-gauche / bas-droite

	if (finMatch == false) {
		var _continue = true;
		var nom = "";

		if ($("#0_0").hasClass("ordinateur") == true) {
			nom = "ordinateur";
		}
		else if ($("#0_0").hasClass("joueur") == true) {
			nom = "joueur";
		}
		else {
			_continue = false;
		}

		if ($("#0_0").hasClass(nom) == true && $("#1_1").hasClass(nom) == true && $("#2_2").hasClass(nom) == true) {
			finMatch = true;
			_continue = false;
			executeFinMatch(nom);

			for (var _numero = 0; _numero < 3; _numero++) {
				$("#" + _numero + "_" + _numero).addClass("fin");
			}
		}
		else {
			_continue = false;
		}
	}

	//	Diagonale haut-droite / bas-gauche

	if (finMatch == false) {
		var _continue = true;
		var nom = "";

			if ($("#0_2").hasClass("ordinateur") == true) {
				nom = "ordinateur";
			}
			else if ($("#0_2").hasClass("joueur") == true) {
				nom = "joueur";
			}
			else {
				_continue = false;
			}

			if ($("#0_2").hasClass(nom) == true && $("#1_1").hasClass(nom) == true && $("#2_0").hasClass(nom) == true) {
				finMatch = true;
				_continue = false;
				executeFinMatch(nom);

				for (var _numeroLigne = 0; _numeroLigne < 3; _numeroLigne++) {
					var _numeroColonne = 2 - _numeroLigne;
					$("#" + _numeroLigne + "_" + _numeroColonne).addClass("fin");
				}
			}
			else {
				_continue = false;
			}
	}

	if (finMatch == false) {
		var matchNul = true;

		for (var numeroLigne = 0; numeroLigne < 3; numeroLigne++) {
			for (var numeroColonne = 0; numeroColonne < 3; numeroColonne++) {
				if ($("#" + numeroLigne + "_" + numeroColonne).hasClass("active") == false) {
					matchNul = false;
				}
			}
		}

		if (matchNul == true) {
			for (var numeroLigne = 0; numeroLigne < 3; numeroLigne++) {
				for (var numeroColonne = 0; numeroColonne < 3; numeroColonne++) {
					$("#" + numeroLigne + "_" + numeroColonne).addClass("fin");
				}
			}	

			executeFinMatch("aucun ne ");
			
			finMatch = true;		
		}
	}

	return finMatch;
}


//	Au chargement de la page

$(document).ready(function() {


	//	Initialisation

	CreerPlateau();


	//	Joueur joue

	$(".case").click(function() {

		if ($("#ordinateurCommence").css("display") != "none") {
			$("#ordinateurCommence").hide();
		}

		if ($(this).hasClass("active") == false) {
			var numeroLigne = parseInt($(this).attr("id").split("_")[0]);
			var numeroColonne = parseInt($(this).attr("id").split("_")[1]);

			ModifierValeurPlateau(numeroLigne, numeroColonne);
			AfficherValeurPlateau();


			//	Mise à jour de l'utilitée de vérifier les lignes, colonnes, et diagonales

			utileAttaque[0][numeroLigne] = false;
			utileAttaque[1][numeroColonne] = false;

			if (numeroLigne == numeroColonne) {
				utileAttaque[2] = false;
			}

			if (numeroColonne == (2 - numeroLigne)) {
				utileAttaque[3] = false;
			}

			console.log(utileAttaque)

			$(this).html("");
			$(this).addClass("active");
			$(this).addClass("joueur");
			$(this).append("<div class='croix croix1'></div><div class='croix croix2'></div>");

			plateau[numeroLigne][numeroColonne] = null;

			var finMatch = VerifierFinMatch();

			if (finMatch == false) {
				OrdinateurJoue();
				VerifierFinMatch();
			}
		}
	})
})

$(window).resize(function() {
	RedimensionnerPlateau();
})