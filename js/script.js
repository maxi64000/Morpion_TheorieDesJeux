var plateau = [
	[3/8, 2/8, 3/8],
	[2/8, 4/8, 2/8],
	[3/8, 2/8, 3/8],
];

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

	$("#plateau").width(taillePlateau);
	$("#plateau").height(taillePlateau);

	$("#plateau").css("margin-top", marginTop + "px");
	$("#plateau").css("margin-left", marginLeft + "px");	

	$(".case").width(tailleCase);
	$(".case").height(tailleCase);

	$(".case p").css("line-height", tailleCase + "px");
}

function CreerPlateau() {
	var classe = "";

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

function AfficherValeurPlateau() {
	for (var numeroLigne = 0; numeroLigne < plateau.length; numeroLigne++) {
		for (var numeroColonne = 0; numeroColonne < plateau[numeroLigne].length; numeroColonne++) {
			if ($("#" + numeroLigne + "_" + numeroColonne).hasClass("active") == false) {
				$("#" + numeroLigne + "_" + numeroColonne).html("<p>" + plateau[numeroLigne][numeroColonne] + "</p>");
			}
		}
	}

	RedimensionnerPlateau();
}

function ModifierValeurCase(numeroLigne, numeroColonne) {
	if (plateau[numeroLigne][numeroColonne] > 0 || plateau[numeroLigne][numeroColonne] != null) {
		plateau[numeroLigne][numeroColonne] = plateau[numeroLigne][numeroColonne] - (1 / 8);

		if (plateau[numeroLigne][numeroColonne] < 0) {
			plateau[numeroLigne][numeroColonne] = 0;
		}
	}
}

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

function OrdinateurPosePion(numeroLigne, numeroColonne) {
	ModifierValeurPlateau(numeroLigne, numeroColonne);
	AfficherValeurPlateau();

	$("#" + numeroLigne + "_" + numeroColonne).html("");
	$("#" + numeroLigne + "_" + numeroColonne).addClass("active");
	$("#" + numeroLigne + "_" + numeroColonne).addClass("ordinateur");
	$("#" + numeroLigne + "_" + numeroColonne).append("<div class='rond'></div>");

	plateau[numeroLigne][numeroColonne] = null;
}

function VerifierCase(nom) {
	var pionPose = false;

	//	Ligne

	if (pionPose == false) {
		for (var numeroLigne = 0; numeroLigne < 3; numeroLigne++) {
			for (var numeroColonne = 0; numeroColonne < 3; numeroColonne++) {
				if ($("#" + numeroLigne + "_" + numeroColonne).hasClass(nom) == true) {
					var _numeroColonnePose = null;

					if (numeroColonne == 0) {
						if ($("#" + numeroLigne + "_1").hasClass(nom)) {
							_numeroColonnePose = 2;
						}
						else if ($("#" + numeroLigne + "_2").hasClass(nom)) {
							_numeroColonnePose = 1;
						}
					}
					else if(numeroColonne == 1) {
						if ($("#" + numeroLigne + "_0").hasClass(nom)) {
							_numeroColonnePose = 2;
						}
						else if ($("#" + numeroLigne + "_2").hasClass(nom)) {
							_numeroColonnePose = 0;
						}
					}
					else {
						if ($("#" + numeroLigne + "_0").hasClass(nom)) {
							_numeroColonnePose = 1;
						}
						else if ($("#" + numeroLigne + "_1").hasClass(nom)) {
							_numeroColonnePose = 0;
						}
					}

					if (_numeroColonnePose != null && $("#" + numeroLigne + "_" + _numeroColonnePose).hasClass("active") == false) {
						OrdinateurPosePion(numeroLigne, _numeroColonnePose)

						pionPose = true;
					}
				}
			}
		}
	}

	//	Colonne

	if (pionPose == false) {
		for (var numeroColonne = 0; numeroColonne < 3; numeroColonne++) {
			for (var numeroLigne = 0; numeroLigne < 3; numeroLigne++) {
				if ($("#" + numeroLigne + "_" + numeroColonne).hasClass(nom) == true) {
					var _numeroLignePose = null;

					if (numeroLigne == 0) {
						if ($("#1_" + numeroColonne).hasClass(nom)) {
							_numeroLignePose = 2;
						}
						else if ($("#2_" + numeroColonne).hasClass(nom)) {
							_numeroLignePose = 1;
						}
					}
					else if (numeroLigne == 1) {
						if ($("#0_" + numeroColonne).hasClass(nom)) {
							_numeroLignePose = 2;
						}
						else if ($("#2_" + numeroColonne).hasClass(nom)) {
							_numeroLignePose = 0;
						}							
					}
					else {
						if ($("#0_" + numeroColonne).hasClass(nom)) {
							_numeroLignePose = 1;
						}
						else if ($("#1_" + numeroColonne).hasClass(nom)) {
							_numeroLignePose = 0;
						}
					}

					if (_numeroLignePose != null && $("#" + _numeroLignePose + "_" + numeroColonne).hasClass("active") == false) {
						OrdinateurPosePion(_numeroLignePose, numeroColonne)

						pionPose = true;
					}
				}
			}
		}
	}

	//	Diagonale haut-gauche / bas-droite

	if (pionPose == false) {
		for (var numero = 0; numero < 3; numero++) {
			if ($("#" + numero + "_" + numero).hasClass(nom) == true) {
				var _numeroPose = null;

				if (numero == 0) {
					if ($("#1_1").hasClass(nom)) {
						_numeroPose = 2;
					}
					else if ($("#2_2").hasClass(nom)) {
						_numeroPose = 1;
					}
				}
				else if (numero == 1) {
					if ($("#0_0").hasClass(nom)) {
						_numeroPose = 2;
					}
					else if ($("#2_2").hasClass(nom)) {
						_numeroPose = 0;
					}						
				}
				else {
					if ($("#0_0").hasClass(nom)) {
						_numeroPose = 1;
					}
					else if ($("#1_1").hasClass(nom)) {
						_numeroPose = 0;
					}
				}

				if (_numeroPose != null && $("#" + _numeroPose + "_" + _numeroPose).hasClass("active") == false) {
					OrdinateurPosePion(_numeroPose, _numeroPose)

					pionPose = true;						
				}
			}
		}
	}

	//	Diagonale haut-droite / bas-gauche

	if (pionPose == false) {

		for (var numeroLigne = 0; numeroLigne < 3; numeroLigne++) {
			var numeroColonne = 2 - numeroLigne;

			if ($("#" + numeroLigne + "_" + numeroColonne).hasClass(nom) == true) {
				var _numeroLignePose = null;
				var  _numeroColonnePose = null;

				if (numeroLigne == 0) {
					if ($("#1_1").hasClass(nom)) {
						_numeroLignePose = 2;
						_numeroColonnePose = 0;
					}
					else if ($("#2_0").hasClass(nom)) {
						_numeroLignePose = 1;
						_numeroColonnePose = 1;
					}
				}
				else if (numeroLigne == 1) {
					if ($("#0_2").hasClass(nom)) {
						_numeroLignePose = 2;
						_numeroColonnePose = 0;
					}
					else if ($("#2_0").hasClass(nom)) {
						_numeroLignePose = 0;
						_numeroColonnePose = 2;
					}						
				}
				else {
					if ($("#1_1").hasClass(nom)) {
						_numeroLignePose = 0;
						_numeroColonnePose = 2;
					}
					else if ($("#0_2").hasClass(nom)) {
						_numeroLignePose = 1;
						_numeroColonnePose = 1;
					}
				}

				if (_numeroLignePose != null && _numeroColonnePose != null && $("#" + _numeroLignePose + "_" + _numeroColonnePose).hasClass("active") == false) {
					OrdinateurPosePion(_numeroLignePose, _numeroColonnePose);

					pionPose = true;						
				}		
			}
		}
	}

	return pionPose;

}

function executeFinMatch(nom) {
	for (var numeroLigne = 0; numeroLigne < 3; numeroLigne++) {
		for (var numeroColonne = 0; numeroColonne < 3; numeroColonne++) {
			$("#" + numeroLigne + "_" + numeroColonne).addClass("active");
		}
	}
	$("body").prepend("<h1>" + nom + " gagne !</h1><button id='refresh'>Recommencer</button>");

	$("#refresh").click(function() {
		location.reload();
	})
}

function VerifierFinMatch() {
	var finMatch = false;

	//	Ligne

	if (finMatch == false) {
		for (var numeroLigne = 0; numeroLigne < 3; numeroLigne++) {
			var numeroColonne = 0;
			var _continue = true;
			var nom = "";

			while (finMatch == false && _continue == true && numeroColonne < 3) {

				if (numeroColonne == 0) {
					if ($("#" + numeroLigne + "_" + numeroColonne).hasClass("ordinateur") == true) {
						nom = "ordinateur";
					}
					else if ($("#" + numeroLigne + "_" + numeroColonne).hasClass("joueur") == true) {
						nom = "joueur";
					}
					else {
						_continue = false;
					}
				}
				else if ($("#" + numeroLigne + "_0").hasClass(nom) == true && $("#" + numeroLigne + "_1").hasClass(nom) == true && $("#" + numeroLigne + "_2").hasClass(nom) == true) {
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

				numeroColonne++;
			}
		}
	}

	//	Colonne

	if (finMatch == false) {
		for (var numeroColonne = 0; numeroColonne < 3; numeroColonne++) {
			var numeroLigne = 0;
			var _continue = true;
			var nom = "";

			while (finMatch == false && _continue == true && numeroLigne < 3) {

				if (numeroLigne == 0) {
					if ($("#" + numeroLigne + "_" + numeroColonne).hasClass("ordinateur") == true) {
						nom = "ordinateur";
					}
					else if ($("#" + numeroLigne + "_" + numeroColonne).hasClass("joueur") == true) {
						nom = "joueur";
					}
					else {
						_continue = false;
					}
				}
				else if ($("#0_" + numeroColonne).hasClass(nom) == true && $("#1_" + numeroColonne).hasClass(nom) == true && $("#2_" + numeroColonne).hasClass(nom) == true) {
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

				numeroLigne++;
			}
		}
	}

	//	Diagonale haut-gauche / bas-droite

	if (finMatch == false) {
		var numero = 0;
		var _continue = true;
		var nom = "";

		while (finMatch == false && _continue == true && numero < 3) {

			if (numero == 0) {
				if ($("#" + numero + "_" + numero).hasClass("ordinateur") == true) {
					nom = "ordinateur";
				}
				else if ($("#" + numero + "_" + numero).hasClass("joueur") == true) {
					nom = "joueur";
				}
				else {
					_continue = false;
				}
			}
			else if ($("#0_0").hasClass(nom) == true && $("#1_1").hasClass(nom) == true && $("#2_2").hasClass(nom) == true) {
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

			numero++;
		}
	}

	//	Diagonale haut-droite / bas-gauche

	if (finMatch == false) {
		var numeroLigne = 0;
		var numeroColonne = 2;
		var _continue = true;
		var nom = "";

		while (finMatch == false && _continue == true && numeroLigne < 3) {

			if (numeroLigne == 0) {
				if ($("#0_2").hasClass("ordinateur") == true) {
					nom = "ordinateur";
				}
				else if ($("#0_2").hasClass("joueur") == true) {
					nom = "joueur";
				}
				else {
					_continue = false;
				}
			}
			else if ($("#0_2").hasClass(nom) == true && $("#1_1").hasClass(nom) == true && $("#2_0").hasClass(nom) == true) {
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

			numeroLigne++;
			numeroColonne--;
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

function OrdinateurJoue() {

	var pionPose = VerifierCase("ordinateur");

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

$(document).ready(function() {
	CreerPlateau();

	var nombreDeTours = 0;

	$(".case").click(function() {

		nombreDeTours++;

		if ($(this).hasClass("active") == false) {
			var numeroLigne = parseInt($(this).attr("id").split("_")[0]);
			var numeroColonne = parseInt($(this).attr("id").split("_")[1]);

			ModifierValeurPlateau(numeroLigne, numeroColonne);
			AfficherValeurPlateau();

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