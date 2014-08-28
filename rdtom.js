function goto_minskills_app() {
	if (device.platform != "Android") {
		// goto iOS App Store
		window.open('itms-apps://itunes.apple.com/us/app/minimum-skills/id655072717?mt=8');
	} else {
		// goto Android app store
		window.open('market://details?id=com.rollerderbytestomatic.ms', "_system");
	}
}

function gotostart() {
	$("#initiatingtext").html("").hide();

	$("#startbutton").show();
	$("#aboutbutton").show();
	$("#unicornbutton").show();
	$("#starticon").show();
	$('#div_about').hide();

	$("#page_unicorn_results").hide();
	$("#page_unicorn").hide();
	$("#page_question").hide();
	$("#page_start").show();
}

var count = 6;
var counter; //1000 will run it every 1 second
var unicorn_correct = 0;
var unicorn_wrong = 0;

function initiateunicorn() {

	data_questions = default_questions;
	$("#main_title").hide(0);
	$("#main_subtitle").hide(0);
	$("#unicorn_question").html("");
	$("#unicorn_answers").html("");
	$("#unicorn_button").hide();

	$("#page_start").hide(0, function () {
		$("#page_unicorn").show(0, function () {
			count = 6;
			counter = setInterval(unicorn_countdown_timer, 1000);
			unicorn_correct = 0;
			unicorn_wrong = 0;
			unicorn_countdown_timer();
		});
	});
}

function unicorn_countdown_timer() {
	count = count - 1;

	$("#unicorn_question").html("<h1>Answer as many questions as you can in 60 seconds</h1>");
	$("#unicorn_counter").html("<h1>" + count + "</h1>");
	if (count <= 0) {
		clearInterval(counter);
		count = 60;
		counter = setInterval(real_unicorn_countdown_timer, 1000);
		real_unicorn_countdown_timer();
		$("#unicorn_button").show();
		loadquestion("unicorn_");
	}
}

function real_unicorn_countdown_timer() {
	count = count - 1;
	if (count <= 0) {
		unicorn_end();
	} else if (count < 10) {
		$("#unicorn_counter").html("<h1 style='color: red;'>" + count + "</h1>");
	} else {
		$("#unicorn_counter").html("<h1>" + count + "</h1>");
	}
}

function unicorn_end() {
	clearInterval(counter);
	$('body').stop(true, true);

	$("body").css("background-color", "white");
	$("#main_title").show(0);
	$("#main_subtitle").show(0);
	$('#page_unicorn').hide();

	$('#unicorn_score').html("You scored<br />" + ((unicorn_correct * 100) - (unicorn_wrong * 50)) + " points!");

	var unicorn_correct_s = "";
	var unicorn_wrong_s = "";
	if (unicorn_correct != 1) {
		unicorn_correct_s = "s";
	}
	if (unicorn_wrong != 1) {
		unicorn_wrong_s = "s";
	}
	$('#unicorn_breakdown').html("You got <strong>" + unicorn_correct + "</strong> question" + unicorn_correct_s + " correct and <strong>" + unicorn_wrong + "</strong> question" + unicorn_wrong_s + " wrong.");

	$('#page_unicorn_results').fadeIn("slow");
}

document.addEventListener("deviceready", function () {
	navigator.splashscreen.hide();
});
var data_questions;

var have_answered = false;

var loadingAnimationVar;

function initiatequestions() {
	$("#startbutton").hide();
	$("#aboutbutton").hide();
	$("#unicornbutton").hide();
	$("#starticon").hide();
	$('#div_about').hide();
	loadfromlocal();
}

// load a new question
function loadquestion(unicorn) {
	if (typeof (unicorn) == "undefined") {
		unicorn = "";
	}

	have_answered = false;
	// get rid of the old answers
	$("#" + unicorn + "answers").html("");

	$("#" + unicorn + "question").html("Loading ... ");

	var is_valid = true;
	var correct_answer = 0;
	question_data = data_questions.resource.questions.question[Math.floor(Math.random() * data_questions.resource.questions.question.length)];

	// check for any "null" values caused by bad data
	$.each(question_data.answers.answer, function (key, answer) {
		if (answer.text == null) {
			console.debug("Null value detected: Question " + question_data.id + ", Answer " + answer.id);
			is_valid = false;
		}
		if (answer.correct == "true") {
			correct_answer = answer.id;
		}
	});

	// Basic validation to weed out bad data

	// If there's no correct answer, this is an invalid question
	if (correct_answer == 0) {
		is_valid = false;
	}

	// if it's not valid, try again. Chances of it being not valid twice are tiny. Should fix this
	var question_data;
	if (!is_valid) {
		question_data = data_questions.resource.questions.question[Math.floor(Math.random() * data_questions.resource.questions.question.length)];
	}

	// show the new question
	showquestion(question_data, unicorn);

}

// show a question
var answered = false;
var correct_answer = 0;
var section_string;

function showquestion(data, unicorn) {
	if (typeof (unicorn) == "undefined") {
		unicorn = "";
	}

	answered = false;
	// show the new question text

	$("#" + unicorn + "question").html(unescape((data.text).replace(/\\(.)/mg, "$1")));

	$("#" + unicorn + "answers").html();

	// get the section string
	$(data.sections).each(function (index, section) {
		section_string = section.section;
		return false;
	});

	// load each new answer
	$.each(data.answers.answer, function (key, answer) {
		if (answer.correct == "true") {
			correct_answer = answer.id;
			$("#" + unicorn + "answers").append("<li><a class=\"mobilebutton\" onclick=\"select_answer(" + answer.id + ", '" + unicorn + "');\">" + (answer.text).replace(/\\(.)/mg, "$1") + "</a> <span style=\"display:none;\" class=\"correct_answer_win\"><strong>You Win!</strong> (See rule " + section_string + ")</span><span style=\"display:none;\" class=\"correct_answer\"><strong> The correct answer.</strong>  (See rule " + section_string + ")</span></li>");
		} else {
			$("#" + unicorn + "answers").append("<li><a class=\"mobilebutton\" onclick=\"select_answer(" + answer.id + ", '" + unicorn + "');\">" + (answer.text).replace(/\\(.)/mg, "$1") + "</a> <span style=\"display:none;\" class=\"wrong_answer\" id=\"" + unicorn + "wrong_answer" + answer.id + "\"><strong>Wrong!</strong></span></li>");
		}

	});
}

// select an answer
function select_answer(selected, unicorn) {
	if (typeof (unicorn) == "undefined") {
		unicorn = "";
	}

	if (!answered) {
		// make sure we only answer once
		answered = true;
		// show what was right and what was wrong
		if (selected == correct_answer) {
			// correct!
			unicorn_correct = unicorn_correct + 1;
			$(".correct_answer_win").show();
			$('body').effect("highlight", {
				color: "#00FF00"
			}, 1000);
		} else {
			// wrong!
			unicorn_wrong = unicorn_wrong + 1;
			$(".correct_answer").show();
			$("#" + unicorn + "wrong_answer" + selected).show();
			$('body').effect("highlight", {
				color: "#FF0000"
			}, 1000);
		}
	}
}

function save_data_question(data) {
	localStorage.setItem('data_questions', JSON.stringify(data));
}

// load the questions from local, return false on failure
function load_data_question() {
	try {
		if (localStorage.getItem('data_questions')) {
			return JSON.parse(localStorage.getItem('data_questions'));
		}
	} catch (err) {
		return false;
	}
}

function loadfromlocal() {
	// can we use localstorage?
	$("#initiatingtext").append("Local storage: ");

	data_questions = load_data_question();

	if (data_questions) {
		// the data has been loaded
		$("#initiatingtext").append("Loaded<br />");
	} else {
		// couldn't find the data
		$("#initiatingtext").append("Missing<br />Using the default file<br />");

		// so use the default file
		data_questions = default_questions;
	}

	// questions is now an array of JS objects representing questions
	$("#initiatingtext").append("Questions loaded: " + data_questions.resource.questions.question.length + "<br />");

	// once all loaded
	// all loaded, so move on
	$("#page_start").fadeOut(0, function () {
		$("#page_question").fadeIn();
	});
}