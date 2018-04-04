	var matchingGame = {};
	matchingGame.deck = [
'cardAK', 'cardAK',
'cardAQ', 'cardAQ',
'cardAJ', 'cardAJ',
'cardBK', 'cardBK',
'cardBQ', 'cardBQ',
'cardBJ', 'cardBJ',
];

$(function () {
	matchingGame.elapsedTime = 0;
	matchingGame.timer = setInterval(countTimer, 1000);
	matchingGame.deck.sort(shuffle);

	// clone 12 copies of the card
	for (var i = 0; i < 11; i++) {
		$(".card:first-child").clone().appendTo("#cards");
	}
	// initialize each card's position
	$("#cards").children().each(function (index) {
		// align the cards to be 4x3 ourselves.
		var x = ($(this).width() + 20) * (index % 4);
		var y = ($(this).height() + 20) * Math.floor(index / 4);
		$(this).css("transform", "translateX(" + x + "px)translateY(" + y + "px)");

		var pattern = matchingGame.deck.pop();

		$(this).find(".back").addClass(pattern);
		// embed the pattern data into the DOM element.
		$(this).attr("data-pattern", pattern);
		// listen the click event on each card DIV element.
		$(this).click(selectCard);		
	});
});
	
function shuffle() {
	return 0.5 - Math.random();
}
	
function selectCard() {
	// we do nothing if there are already two card flipped.
	if ($(".card-flipped").length > 1) {
		return;
	}
	$(this).addClass("card-flipped");
	// check the pattern of both flipped card 0.7s later.
	if ($(".card-flipped").length === 2) {
		setTimeout(checkPattern, 700);
	}
}
	
function checkPattern() {
	if (isMatchPattern()) {
		$(".card-flipped").removeClass("card-flipped").addClass("card-removed");
		$(".card-removed").bind("transitionend",removeTookCards);
	} else {
		$(".card-flipped").removeClass("card-flipped");
	}
}
	
function isMatchPattern() {
	var cards = $(".card-flipped");
	var pattern = $(cards[0]).data("pattern");
	var anotherPattern = $(cards[1]).data("pattern");
	return (pattern === anotherPattern);
}
	
function removeTookCards() {
	$(".card-removed").remove();
	
	if ($(".card").length === 0) {
		gameover();
	}
}

function countTimer() {
	matchingGame.elapsedTime++;
	// calculate the minutes and seconds from elapsed time
	var minute = Math.floor(matchingGame.elapsedTime / 60);
	var second = matchingGame.elapsedTime % 60;
	// add padding 0 if minute and second is less than 10
	if (minute < 10) minute = "0" + minute;
	if (second < 10) second = "0" + second;
	
	$("#elapsed-time").html(minute+":"+second);
}

function gameover() {
	// stop timer
	clearInterval(matchingGame.timer);
	$(".score").html($("#elapsed-time").html());
	// show the game over popup
	$("#popup").removeClass("hide");
}