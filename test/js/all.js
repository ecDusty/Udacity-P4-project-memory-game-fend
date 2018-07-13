'use strict';

/*
 * Create a list that holds all of your cards
 */

/*
 * Display the cards on the page
 *   - shuffle the list of cards using the provided "shuffle" method below
 *   - loop through each card and create its HTML
 *   - add each card's HTML to the page
 */

// MY ATTEMPT to build this in a MOV format

// The model holds all the games data.

var Model = {

    createCard: function createCard(card) {
        var baseCard = document.createElement('li');
        baseCard.subEl = document.createElement('i');

        //Place the name of the card with the Object element
        baseCard.card = card;

        //Has the card been matched up? This makes it easily accessable throughout the game
        baseCard.match = false;

        //Tells whether the card is showing or not
        baseCard.cardShow = false;

        //Setup the card DOM structure and attributes.
        baseCard.className = 'card';
        baseCard.dataset.item = card;
        baseCard.subEl.className = 'fa fa-' + card;
        baseCard.appendChild(baseCard.subEl);

        return baseCard;
    },

    shuffle: function shuffle(array) {
        // Shuffle function from http://stackoverflow.com/a/2450976
        var currentIndex = array.length,
            temporaryValue,
            randomIndex;

        while (currentIndex !== 0) {
            randomIndex = Math.floor(Math.random() * currentIndex);
            currentIndex -= 1;
            temporaryValue = array[currentIndex];
            array[currentIndex] = array[randomIndex];
            array[randomIndex] = temporaryValue;
        }

        return array;
    },

    //Builds out the card deck elements into an easy to access array
    buildDeck: function buildDeck() {
        var startDeck = [];
        var that = this;

        var _iteratorNormalCompletion = true;
        var _didIteratorError = false;
        var _iteratorError = undefined;

        try {
            for (var _iterator = this.cards[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
                var card = _step.value;

                startDeck.push(that.createCard(card));
                startDeck.push(that.createCard(card));
            }
        } catch (err) {
            _didIteratorError = true;
            _iteratorError = err;
        } finally {
            try {
                if (!_iteratorNormalCompletion && _iterator.return) {
                    _iterator.return();
                }
            } finally {
                if (_didIteratorError) {
                    throw _iteratorError;
                }
            }
        }

        this.deck = this.shuffle(startDeck);
    },

    //This runs on game start.
    init: function init() {
        //If a browser has local game storage, than load that instead of creating a new game.
        // LOCAL STORGAE ABILITY HASN"T BEEN BUILT YET.
        if (localStorage.getItem('ecmMemGame')) {
            var game = localStorage.getItem('ecmMemGame');
            this.moves = game.moves;
            this.lives = game.lives;
            this.time = game.time;
            this.recordTime = game.recordTime;
            this.cards = game.cards;
            this.deck = game.deck;
            this.activeCard = game.activeCard;
            this.numMatched = game.numMatched;
        } else {
            this.cards = ['diamond', 'paper-plane-o', 'anchor', 'bolt', 'cube', 'leaf', 'bicycle', 'bomb'];
            this.moves = 0;
            this.lives = 3;
            this.time = 0;
            this.time.hr = 0;
            this.time.min = 0;
            this.time.sec = 0;
            this.time.milli = 0;
            this.recordTime = 0;
            this.numMatched = 0;
            this.activeCard = [null];
            this.buildDeck();
        }
    }
};

var View = {

    gameStart: false, //Used to see if game is on it's first start round

    //Hide and show the win game sign
    hideWin: function hideWin() {
        document.getElementById('winning').className = 'display-none';
    },

    showWin: function showWin() {
        document.getElementById('winning').classList.add('show');
    },

    //Initialization of the game view, places elements in the DOM & adding event listeners.
    loseStar: function loseStar(n) {
        this.stars[n].remove();
    },

    changeMoves: function changeMoves(moves) {
        document.getElementsByClassName('moves')[0].innerHTML = moves;
    },

    //Hide card
    hideCards: function hideCards() {
        for (var _len = arguments.length, cards = Array(_len), _key = 0; _key < _len; _key++) {
            cards[_key] = arguments[_key];
        }

        var _iteratorNormalCompletion2 = true;
        var _didIteratorError2 = false;
        var _iteratorError2 = undefined;

        try {
            for (var _iterator2 = cards[Symbol.iterator](), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
                var card = _step2.value;

                card.cardShow = false;
                card.classList.remove('show');
                card.classList.remove('wrong');
                card.classList.remove('match');
            }
        } catch (err) {
            _didIteratorError2 = true;
            _iteratorError2 = err;
        } finally {
            try {
                if (!_iteratorNormalCompletion2 && _iterator2.return) {
                    _iterator2.return();
                }
            } finally {
                if (_didIteratorError2) {
                    throw _iteratorError2;
                }
            }
        }
    },

    //The wrong pair of cards are selected, then run this function
    wrongCards: function wrongCards(card1, card2) {
        card1.classList.add('wrong');
        card2.classList.add('wrong');
    },

    setMatched: function setMatched(card1, card2) {
        card1.classList.add('match');
        card1.match = true;
        card2.classList.add('match');
        card2.match = true;
        Octo.resetActiveCard();
    },

    init: function init() {
        this.stars = [];
        //Check if this is the games first start, if so assign Elements to View parameters
        if (!this.gameStart) {
            this.theDeck = document.getElementsByClassName('deck')[0];
            this.resetButton = document.getElementById('restart');
            this.resetButton.addEventListener('click', function () {
                Octo.reset();
            });
        }

        //Reset the deck
        this.theDeck.innerHTML = '';
        this.wrongSet = false;

        var _iteratorNormalCompletion3 = true;
        var _didIteratorError3 = false;
        var _iteratorError3 = undefined;

        try {
            for (var _iterator3 = Octo.getDeck()[Symbol.iterator](), _step3; !(_iteratorNormalCompletion3 = (_step3 = _iterator3.next()).done); _iteratorNormalCompletion3 = true) {
                var card = _step3.value;

                card.addEventListener('click', function (e) {
                    var el = e.currentTarget;
                    Octo.cardCheck(el);
                });

                this.theDeck.appendChild(card);
            }

            //Create Stars
        } catch (err) {
            _didIteratorError3 = true;
            _iteratorError3 = err;
        } finally {
            try {
                if (!_iteratorNormalCompletion3 && _iterator3.return) {
                    _iterator3.return();
                }
            } finally {
                if (_didIteratorError3) {
                    throw _iteratorError3;
                }
            }
        }

        var lStars = document.getElementsByClassName('stars')[0];
        lStars.innerHTML = '';

        for (var i = 0; i < Octo.getLives(); i++) {
            var lItem = document.createElement('li');
            var icon = document.createElement('i');
            icon.className = 'fa fa-star';
            lItem.appendChild(icon);
            lStars.appendChild(lItem);
            this.stars.push(lItem);
        }

        this.hideWin();

        //Set Moves number
        document.getElementsByClassName('moves')[0].innerHTML = Octo.getMoves();
        this.gameStart = true;
    }
};

var Octo = {

    //Show the winning sign.
    winGame: function winGame() {
        View.showWin();
    },

    resetMoves: function resetMoves() {
        Model.moves = 0;
    },

    //Return moves
    getMoves: function getMoves() {
        return Model.moves;
    },

    //Return lives
    getLives: function getLives() {
        return Model.lives;
    },

    //Return lives
    updateLives: function updateLives() {
        if (Model.moves < 20) {
            Model.lives = 3;
        } else if (Model.moves < 29) {
            Model.lives = 2;
            View.loseStar(Model.lives);
        } else {
            Model.lives = 1;
            View.loseStar(Model.lives);
        }
    },

    //Update Star & move number
    updateMoves: function updateMoves() {
        Model.moves++;
        View.changeMoves(Model.moves);
    },

    //reset flipped cards array
    resetActiveCard: function resetActiveCard() {
        Model.activeCard = [];
    },

    //Set flipped cards
    setActiveCard: function setActiveCard(card1, card2) {
        card2 ? Model.activeCard = [card1, card2] : Model.activeCard = [card1];
    },

    //Get current flipped card
    getActiveCard: function getActiveCard() {
        return Model.activeCard;
    },

    //Get the current array of cards
    getDeck: function getDeck() {
        return Model.deck;
    },

    //Set the current deck
    setDeck: function setDeck(deck) {
        Model.deck = deck;
    },

    resetDeck: function resetDeck() {
        Model.buildDeck();
    },

    setWrong: function setWrong(card1, card2) {
        View.wrongSet = true;
        View.wrongCards(card1, card2);

        setTimeout(function () {
            View.hideCards(card1, card2);
            Octo.resetActiveCard();
            View.wrongSet = false;
        }, 1300);
    },

    matched: function matched(card1, card2) {
        View.setMatched(card1, card2);
        Model.numMatched++;
        if (Model.numMatched == Model.cards.length) this.winGame();
    },

    //Check what the card / cards are set as, and act accordingly.
    cardCheck: function cardCheck(card) {
        var activeC = this.getActiveCard();

        if (!card.match && this.getLives() && !View.wrongSet) {
            this.updateMoves();
            this.updateLives();

            if (card.cardShow) {
                View.hideCards(card);
                this.setActiveCard(null);
            } else {
                if (activeC.length < 2) {
                    card.cardShow = true;
                    card.classList.add('show');

                    if (activeC[0]) {
                        this.setActiveCard(activeC[0], card);

                        card.card === activeC[0].card ? this.matched(card, activeC[0]) : this.setWrong(card, activeC[0]);
                    } else {
                        this.setActiveCard(card);
                    }
                }
            }
        }
    },

    reset: function reset() {
        this.resetMoves();
        this.resetDeck();
        View.init();
    },

    init: function init() {
        Model.init();
        View.init();
    }
};

Octo.init();
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImFwcC5qcyJdLCJuYW1lcyI6WyJNb2RlbCIsImNyZWF0ZUNhcmQiLCJjYXJkIiwiYmFzZUNhcmQiLCJkb2N1bWVudCIsImNyZWF0ZUVsZW1lbnQiLCJzdWJFbCIsIm1hdGNoIiwiY2FyZFNob3ciLCJjbGFzc05hbWUiLCJkYXRhc2V0IiwiaXRlbSIsImFwcGVuZENoaWxkIiwic2h1ZmZsZSIsImFycmF5IiwiY3VycmVudEluZGV4IiwibGVuZ3RoIiwidGVtcG9yYXJ5VmFsdWUiLCJyYW5kb21JbmRleCIsIk1hdGgiLCJmbG9vciIsInJhbmRvbSIsImJ1aWxkRGVjayIsInN0YXJ0RGVjayIsInRoYXQiLCJjYXJkcyIsInB1c2giLCJkZWNrIiwiaW5pdCIsImxvY2FsU3RvcmFnZSIsImdldEl0ZW0iLCJnYW1lIiwibW92ZXMiLCJsaXZlcyIsInRpbWUiLCJyZWNvcmRUaW1lIiwiYWN0aXZlQ2FyZCIsIm51bU1hdGNoZWQiLCJociIsIm1pbiIsInNlYyIsIm1pbGxpIiwiVmlldyIsImdhbWVTdGFydCIsImhpZGVXaW4iLCJnZXRFbGVtZW50QnlJZCIsInNob3dXaW4iLCJjbGFzc0xpc3QiLCJhZGQiLCJsb3NlU3RhciIsIm4iLCJzdGFycyIsInJlbW92ZSIsImNoYW5nZU1vdmVzIiwiZ2V0RWxlbWVudHNCeUNsYXNzTmFtZSIsImlubmVySFRNTCIsImhpZGVDYXJkcyIsIndyb25nQ2FyZHMiLCJjYXJkMSIsImNhcmQyIiwic2V0TWF0Y2hlZCIsIk9jdG8iLCJyZXNldEFjdGl2ZUNhcmQiLCJ0aGVEZWNrIiwicmVzZXRCdXR0b24iLCJhZGRFdmVudExpc3RlbmVyIiwicmVzZXQiLCJ3cm9uZ1NldCIsImdldERlY2siLCJlIiwiZWwiLCJjdXJyZW50VGFyZ2V0IiwiY2FyZENoZWNrIiwibFN0YXJzIiwiaSIsImdldExpdmVzIiwibEl0ZW0iLCJpY29uIiwiZ2V0TW92ZXMiLCJ3aW5HYW1lIiwicmVzZXRNb3ZlcyIsInVwZGF0ZUxpdmVzIiwidXBkYXRlTW92ZXMiLCJzZXRBY3RpdmVDYXJkIiwiZ2V0QWN0aXZlQ2FyZCIsInNldERlY2siLCJyZXNldERlY2siLCJzZXRXcm9uZyIsInNldFRpbWVvdXQiLCJtYXRjaGVkIiwiYWN0aXZlQyJdLCJtYXBwaW5ncyI6Ijs7QUFBQTs7OztBQUtBOzs7Ozs7O0FBUUE7O0FBRUE7O0FBRUEsSUFBTUEsUUFBUTs7QUFFVkMsZ0JBQVksb0JBQVNDLElBQVQsRUFBZTtBQUN2QixZQUFNQyxXQUFXQyxTQUFTQyxhQUFULENBQXVCLElBQXZCLENBQWpCO0FBQ0FGLGlCQUFTRyxLQUFULEdBQWlCRixTQUFTQyxhQUFULENBQXVCLEdBQXZCLENBQWpCOztBQUVBO0FBQ0FGLGlCQUFTRCxJQUFULEdBQWdCQSxJQUFoQjs7QUFFQTtBQUNBQyxpQkFBU0ksS0FBVCxHQUFpQixLQUFqQjs7QUFFQTtBQUNBSixpQkFBU0ssUUFBVCxHQUFvQixLQUFwQjs7QUFFQTtBQUNBTCxpQkFBU00sU0FBVCxHQUFxQixNQUFyQjtBQUNBTixpQkFBU08sT0FBVCxDQUFpQkMsSUFBakIsR0FBd0JULElBQXhCO0FBQ0FDLGlCQUFTRyxLQUFULENBQWVHLFNBQWYsR0FBMkIsV0FBV1AsSUFBdEM7QUFDQUMsaUJBQVNTLFdBQVQsQ0FBcUJULFNBQVNHLEtBQTlCOztBQUVBLGVBQU9ILFFBQVA7QUFDSCxLQXRCUzs7QUF3QlZVLGFBQVMsaUJBQVNDLEtBQVQsRUFBZ0I7QUFDckI7QUFDQSxZQUFJQyxlQUFlRCxNQUFNRSxNQUF6QjtBQUFBLFlBQWlDQyxjQUFqQztBQUFBLFlBQWlEQyxXQUFqRDs7QUFFQSxlQUFPSCxpQkFBaUIsQ0FBeEIsRUFBMkI7QUFDdkJHLDBCQUFjQyxLQUFLQyxLQUFMLENBQVdELEtBQUtFLE1BQUwsS0FBZ0JOLFlBQTNCLENBQWQ7QUFDQUEsNEJBQWdCLENBQWhCO0FBQ0FFLDZCQUFpQkgsTUFBTUMsWUFBTixDQUFqQjtBQUNBRCxrQkFBTUMsWUFBTixJQUFzQkQsTUFBTUksV0FBTixDQUF0QjtBQUNBSixrQkFBTUksV0FBTixJQUFx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OlsiLypcclxuICogQ3JlYXRlIGEgbGlzdCB0aGF0IGhvbGRzIGFsbCBvZiB5b3VyIGNhcmRzXHJcbiAqL1xyXG5cclxuXHJcbi8qXHJcbiAqIERpc3BsYXkgdGhlIGNhcmRzIG9uIHRoZSBwYWdlXHJcbiAqICAgLSBzaHVmZmxlIHRoZSBsaXN0IG9mIGNhcmRzIHVzaW5nIHRoZSBwcm92aWRlZCBcInNodWZmbGVcIiBtZXRob2QgYmVsb3dcclxuICogICAtIGxvb3AgdGhyb3VnaCBlYWNoIGNhcmQgYW5kIGNyZWF0ZSBpdHMgSFRNTFxyXG4gKiAgIC0gYWRkIGVhY2ggY2FyZCdzIEhUTUwgdG8gdGhlIHBhZ2VcclxuICovXHJcblxyXG5cclxuLy8gTVkgQVRURU1QVCB0byBidWlsZCB0aGlzIGluIGEgTU9WIGZvcm1hdFxyXG5cclxuLy8gVGhlIG1vZGVsIGhvbGRzIGFsbCB0aGUgZ2FtZXMgZGF0YS5cclxuXHJcbmNvbnN0IE1vZGVsID0ge1xyXG5cclxuICAgIGNyZWF0ZUNhcmQ6IGZ1bmN0aW9uKGNhcmQpIHtcclxuICAgICAgICBjb25zdCBiYXNlQ2FyZCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2xpJyk7XHJcbiAgICAgICAgYmFzZUNhcmQuc3ViRWwgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdpJyk7XHJcblxyXG4gICAgICAgIC8vUGxhY2UgdGhlIG5hbWUgb2YgdGhlIGNhcmQgd2l0aCB0aGUgT2JqZWN0IGVsZW1lbnRcclxuICAgICAgICBiYXNlQ2FyZC5jYXJkID0gY2FyZDtcclxuXHJcbiAgICAgICAgLy9IYXMgdGhlIGNhcmQgYmVlbiBtYXRjaGVkIHVwPyBUaGlzIG1ha2VzIGl0IGVhc2lseSBhY2Nlc3NhYmxlIHRocm91Z2hvdXQgdGhlIGdhbWVcclxuICAgICAgICBiYXNlQ2FyZC5tYXRjaCA9IGZhbHNlO1xyXG4gICAgICAgIFxyXG4gICAgICAgIC8vVGVsbHMgd2hldGhlciB0aGUgY2FyZCBpcyBzaG93aW5nIG9yIG5vdFxyXG4gICAgICAgIGJhc2VDYXJkLmNhcmRTaG93ID0gZmFsc2U7XHJcblxyXG4gICAgICAgIC8vU2V0dXAgdGhlIGNhcmQgRE9NIHN0cnVjdHVyZSBhbmQgYXR0cmlidXRlcy5cclxuICAgICAgICBiYXNlQ2FyZC5jbGFzc05hbWUgPSAnY2FyZCc7XHJcbiAgICAgICAgYmFzZUNhcmQuZGF0YXNldC5pdGVtID0gY2FyZDtcclxuICAgICAgICBiYXNlQ2FyZC5zdWJFbC5jbGFzc05hbWUgPSAnZmEgZmEtJyArIGNhcmQ7XHJcbiAgICAgICAgYmFzZUNhcmQuYXBwZW5kQ2hpbGQoYmFzZUNhcmQuc3ViRWwpO1xyXG5cclxuICAgICAgICByZXR1cm4gYmFzZUNhcmRcclxuICAgIH0sXHJcblxyXG4gICAgc2h1ZmZsZTogZnVuY3Rpb24oYXJyYXkpIHtcclxuICAgICAgICAvLyBTaHVmZmxlIGZ1bmN0aW9uIGZyb20gaHR0cDovL3N0YWNrb3ZlcmZsb3cuY29tL2EvMjQ1MDk3NlxyXG4gICAgICAgIHZhciBjdXJyZW50SW5kZXggPSBhcnJheS5sZW5ndGgsIHRlbXBvcmFyeVZhbHVlLCByYW5kb21JbmRleDtcclxuXHJcbiAgICAgICAgd2hpbGUgKGN1cnJlbnRJbmRleCAhPT0gMCkge1xyXG4gICAgICAgICAgICByYW5kb21JbmRleCA9IE1hdGguZmxvb3IoTWF0aC5yYW5kb20oKSAqIGN1cnJlbnRJbmRleCk7XHJcbiAgICAgICAgICAgIGN1cnJlbnRJbmRleCAtPSAxO1xyXG4gICAgICAgICAgICB0ZW1wb3JhcnlWYWx1ZSA9IGFycmF5W2N1cnJlbnRJbmRleF07XHJcbiAgICAgICAgICAgIGFycmF5W2N1cnJlbnRJbmRleF0gPSBhcnJheVtyYW5kb21JbmRleF07XHJcbiAgICAgICAgICAgIGFycmF5W3JhbmRvbUluZGV4XSA9IHRlbXBvcmFyeVZhbHVlO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgcmV0dXJuIGFycmF5O1xyXG4gICAgfSxcclxuXHJcbiAgICAvL0J1aWxkcyBvdXQgdGhlIGNhcmQgZGVjayBlbGVtZW50cyBpbnRvIGFuIGVhc3kgdG8gYWNjZXNzIGFycmF5XHJcbiAgICBidWlsZERlY2s6IGZ1bmN0aW9uKCkge1xyXG4gICAgICAgIGxldCBzdGFydERlY2sgPSBbXTtcclxuICAgICAgICBjb25zdCB0aGF0ID0gdGhpcztcclxuXHJcbiAgICAgICAgZm9yICh2YXIgY2FyZCBvZiB0aGlzLmNhcmRzKSB7XHJcbiAgICAgICAgICAgIHN0YXJ0RGVjay5wdXNoKHRoYXQuY3JlYXRlQ2FyZChjYXJkKSk7XHJcbiAgICAgICAgICAgIHN0YXJ0RGVjay5wdXNoKHRoYXQuY3JlYXRlQ2FyZChjYXJkKSk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICB0aGlzLmRlY2sgPSB0aGlzLnNodWZmbGUoc3RhcnREZWNrKTtcclxuICAgIH0sXHJcblxyXG4gICAgLy9UaGlzIHJ1bnMgb24gZ2FtZSBzdGFydC5cclxuICAgIGluaXQ6IGZ1bmN0aW9uKCkge1xyXG4gICAgICAgIC8vSWYgYSBicm93c2VyIGhhcyBsb2NhbCBnYW1lIHN0b3JhZ2UsIHRoYW4gbG9hZCB0aGF0IGluc3RlYWQgb2YgY3JlYXRpbmcgYSBuZXcgZ2FtZS5cclxuICAgICAgICAvLyBMT0NBTCBTVE9SR0FFIEFCSUxJVFkgSEFTTlwiVCBCRUVOIEJVSUxUIFlFVC5cclxuICAgICAgICBpZiAobG9jYWxTdG9yYWdlLmdldEl0ZW0oJ2VjbU1lbUdhbWUnKSkge1xyXG4gICAgICAgICAgICBjb25zdCBnYW1lID0gbG9jYWxTdG9yYWdlLmdldEl0ZW0oJ2VjbU1lbUdhbWUnKTtcclxuICAgICAgICAgICAgdGhpcy5tb3ZlcyA9IGdhbWUubW92ZXM7XHJcbiAgICAgICAgICAgIHRoaXMubGl2ZXMgPSBnYW1lLmxpdmVzXHJcbiAgICAgICAgICAgIHRoaXMudGltZSA9IGdhbWUudGltZTtcclxuICAgICAgICAgICAgdGhpcy5yZWNvcmRUaW1lID0gZ2FtZS5yZWNvcmRUaW1lO1xyXG4gICAgICAgICAgICB0aGlzLmNhcmRzID0gZ2FtZS5jYXJkcztcclxuICAgICAgICAgICAgdGhpcy5kZWNrID0gZ2FtZS5kZWNrO1xyXG4gICAgICAgICAgICB0aGlzLmFjdGl2ZUNhcmQgPSBnYW1lLmFjdGl2ZUNhcmQ7XHJcbiAgICAgICAgICAgIHRoaXMubnVtTWF0Y2hlZCA9IGdhbWUubnVtTWF0Y2hlZDtcclxuICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICB0aGlzLmNhcmRzID0gW1xyXG4gICAgICAgICAgICAgICAgJ2RpYW1vbmQnLFxyXG4gICAgICAgICAgICAgICAgJ3BhcGVyLXBsYW5lLW8nLFxyXG4gICAgICAgICAgICAgICAgJ2FuY2hvcicsXHJcbiAgICAgICAgICAgICAgICAnYm9sdCcsXHJcbiAgICAgICAgICAgICAgICAnY3ViZScsXHJcbiAgICAgICAgICAgICAgICAnbGVhZicsXHJcbiAgICAgICAgICAgICAgICAnYmljeWNsZScsXHJcbiAgICAgICAgICAgICAgICAnYm9tYidcclxuICAgICAgICAgICAgXTtcclxuICAgICAgICAgICAgdGhpcy5tb3ZlcyA9IDA7XHJcbiAgICAgICAgICAgIHRoaXMubGl2ZXMgPSAzO1xyXG4gICAgICAgICAgICB0aGlzLnRpbWUgPSAwO1xyXG4gICAgICAgICAgICB0aGlzLnRpbWUuaHIgPSAwO1xyXG4gICAgICAgICAgICB0aGlzLnRpbWUubWluID0gMDtcclxuICAgICAgICAgICAgdGhpcy50aW1lLnNlYyA9IDA7XHJcbiAgICAgICAgICAgIHRoaXMudGltZS5taWxsaSA9IDA7XHJcbiAgICAgICAgICAgIHRoaXMucmVjb3JkVGltZSA9IDA7XHJcbiAgICAgICAgICAgIHRoaXMubnVtTWF0Y2hlZCA9IDA7XHJcbiAgICAgICAgICAgIHRoaXMuYWN0aXZlQ2FyZCA9IFtudWxsXTtcclxuICAgICAgICAgICAgdGhpcy5idWlsZERlY2soKTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcbn1cclxuXHJcbmNvbnN0IFZpZXcgPSB7XHJcblxyXG4gICAgZ2FtZVN0YXJ0OiBmYWxzZSwgLy9Vc2VkIHRvIHNlZSBpZiBnYW1lIGlzIG9uIGl0J3MgZmlyc3Qgc3RhcnQgcm91bmRcclxuXHJcbiAgICAvL0hpZGUgYW5kIHNob3cgdGhlIHdpbiBnYW1lIHNpZ25cclxuICAgIGhpZGVXaW46IGZ1bmN0aW9uKCkge1xyXG4gICAgICAgIGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCd3aW5uaW5nJykuY2xhc3NOYW1lID0gJ2Rpc3BsYXktbm9uZSc7XHJcbiAgICB9LFxyXG4gICAgXHJcbiAgICBzaG93V2luOiBmdW5jdGlvbigpIHtcclxuICAgICAgICBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnd2lubmluZycpLmNsYXNzTGlzdC5hZGQoJ3Nob3cnKTtcclxuICAgIH0sXHJcblxyXG4gICAgLy9Jbml0aWFsaXphdGlvbiBvZiB0aGUgZ2FtZSB2aWV3LCBwbGFjZXMgZWxlbWVudHMgaW4gdGhlIERPTSAmIGFkZGluZyBldmVudCBsaXN0ZW5lcnMuXHJcbiAgICBsb3NlU3RhcjogZnVuY3Rpb24obikge1xyXG4gICAgICAgIHRoaXMuc3RhcnNbbl0ucmVtb3ZlKCk7XHJcbiAgICB9LFxyXG5cclxuICAgIGNoYW5nZU1vdmVzOiBmdW5jdGlvbihtb3Zlcykge1xyXG4gICAgICAgIGRvY3VtZW50LmdldEVsZW1lbnRzQnlDbGFzc05hbWUoJ21vdmVzJylbMF0uaW5uZXJIVE1MID0gbW92ZXM7XHJcbiAgICB9LFxyXG5cclxuICAgIC8vSGlkZSBjYXJkXHJcbiAgICBoaWRlQ2FyZHM6IGZ1bmN0aW9uKC4uLmNhcmRzKSB7XHJcbiAgICAgICAgZm9yICh2YXIgY2FyZCBvZiBjYXJkcykge1xyXG4gICAgICAgICAgICBjYXJkLmNhcmRTaG93ID0gZmFsc2U7XHJcbiAgICAgICAgICAgIGNhcmQuY2xhc3NMaXN0LnJlbW92ZSgnc2hvdycpO1xyXG4gICAgICAgICAgICBjYXJkLmNsYXNzTGlzdC5yZW1vdmUoJ3dyb25nJyk7XHJcbiAgICAgICAgICAgIGNhcmQuY2xhc3NMaXN0LnJlbW92ZSgnbWF0Y2gnKTtcclxuICAgICAgICB9XHJcbiAgICB9LFxyXG5cclxuICAgIC8vVGhlIHdyb25nIHBhaXIgb2YgY2FyZHMgYXJlIHNlbGVjdGVkLCB0aGVuIHJ1biB0aGlzIGZ1bmN0aW9uXHJcbiAgICB3cm9uZ0NhcmRzOiBmdW5jdGlvbihjYXJkMSxjYXJkMikge1xyXG4gICAgICAgIGNhcmQxLmNsYXNzTGlzdC5hZGQoJ3dyb25nJyk7XHJcbiAgICAgICAgY2FyZDIuY2xhc3NMaXN0LmFkZCgnd3JvbmcnKTtcclxuICAgIH0sXHJcblxyXG4gICAgc2V0TWF0Y2hlZDogZnVuY3Rpb24oY2FyZDEsIGNhcmQyKSB7XHJcbiAgICAgICAgY2FyZDEuY2xhc3NMaXN0LmFkZCgnbWF0Y2gnKTtcclxuICAgICAgICBjYXJkMS5tYXRjaCA9IHRydWU7XHJcbiAgICAgICAgY2FyZDIuY2xhc3NMaXN0LmFkZCgnbWF0Y2gnKTtcclxuICAgICAgICBjYXJkMi5tYXRjaCA9IHRydWU7XHJcbiAgICAgICAgT2N0by5yZXNldEFjdGl2ZUNhcmQoKTtcclxuICAgIH0sXHJcblxyXG4gICAgaW5pdDogZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgdGhpcy5zdGFycyA9IFtdO1xyXG4gICAgICAgIC8vQ2hlY2sgaWYgdGhpcyBpcyB0aGUgZ2FtZXMgZmlyc3Qgc3RhcnQsIGlmIHNvIGFzc2lnbiBFbGVtZW50cyB0byBWaWV3IHBhcmFtZXRlcnNcclxuICAgICAgICBpZiAoIXRoaXMuZ2FtZVN0YXJ0KSB7XHJcbiAgICAgICAgICAgIHRoaXMudGhlRGVjayA9IGRvY3VtZW50LmdldEVsZW1lbnRzQnlDbGFzc05hbWUoJ2RlY2snKVswXTtcclxuICAgICAgICAgICAgdGhpcy5yZXNldEJ1dHRvbiA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdyZXN0YXJ0Jyk7XHJcbiAgICAgICAgICAgIHRoaXMucmVzZXRCdXR0b24uYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCBmdW5jdGlvbigpIHtcclxuICAgICAgICAgICAgICAgIE9jdG8ucmVzZXQoKTtcclxuICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICAvL1Jlc2V0IHRoZSBkZWNrXHJcbiAgICAgICAgdGhpcy50aGVEZWNrLmlubmVySFRNTCA9IGBgO1xyXG4gICAgICAgIHRoaXMud3JvbmdTZXQgPSBmYWxzZTtcclxuXHJcbiAgICAgICAgZm9yICh2YXIgY2FyZCBvZiBPY3RvLmdldERlY2soKSl7XHJcbiAgICAgICAgICAgIGNhcmQuYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCBmdW5jdGlvbihlKSB7XHJcbiAgICAgICAgICAgICAgICBjb25zdCBlbCA9IGUuY3VycmVudFRhcmdldDtcclxuICAgICAgICAgICAgICAgIE9jdG8uY2FyZENoZWNrKGVsKTtcclxuICAgICAgICAgICAgfSk7IFxyXG5cclxuICAgICAgICAgICAgdGhpcy50aGVEZWNrLmFwcGVuZENoaWxkKGNhcmQpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgLy9DcmVhdGUgU3RhcnNcclxuICAgICAgICBjb25zdCBsU3RhcnMgPSBkb2N1bWVudC5nZXRFbGVtZW50c0J5Q2xhc3NOYW1lKCdzdGFycycpWzBdXHJcbiAgICAgICAgbFN0YXJzLmlubmVySFRNTCA9IGBgO1xyXG5cclxuICAgICAgICBmb3IgKHZhciBpID0gMDsgaSA8IE9jdG8uZ2V0TGl2ZXMoKTsgaSsrKSB7XHJcbiAgICAgICAgICAgIGNvbnN0IGxJdGVtID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnbGknKTtcclxuICAgICAgICAgICAgY29uc3QgaWNvbiA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2knKTtcclxuICAgICAgICAgICAgaWNvbi5jbGFzc05hbWUgPSBgZmEgZmEtc3RhcmA7XHJcbiAgICAgICAgICAgIGxJdGVtLmFwcGVuZENoaWxkKGljb24pO1xyXG4gICAgICAgICAgICBsU3RhcnMuYXBwZW5kQ2hpbGQobEl0ZW0pO1xyXG4gICAgICAgICAgICB0aGlzLnN0YXJzLnB1c2gobEl0ZW0pO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgdGhpcy5oaWRlV2luKCk7XHJcblxyXG4gICAgICAgIC8vU2V0IE1vdmVzIG51bWJlclxyXG4gICAgICAgIGRvY3VtZW50LmdldEVsZW1lbnRzQnlDbGFzc05hbWUoJ21vdmVzJylbMF0uaW5uZXJIVE1MID0gT2N0by5nZXRNb3ZlcygpO1xyXG4gICAgICAgIHRoaXMuZ2FtZVN0YXJ0ID0gdHJ1ZTtcclxuICAgIH1cclxufVxyXG5cclxuY29uc3QgT2N0byA9IHtcclxuXHJcbiAgICAvL1Nob3cgdGhlIHdpbm5pbmcgc2lnbi5cclxuICAgIHdpbkdhbWU6IGZ1bmN0aW9uKCkge1xyXG4gICAgICAgIFZpZXcuc2hvd1dpbigpO1xyXG4gICAgfSxcclxuXHJcbiAgICByZXNldE1vdmVzOiBmdW5jdGlvbigpIHtcclxuICAgICAgICBNb2RlbC5tb3ZlcyA9IDA7XHJcbiAgICB9LFxyXG5cclxuICAgIC8vUmV0dXJuIG1vdmVzXHJcbiAgICBnZXRNb3ZlczogZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgcmV0dXJuIE1vZGVsLm1vdmVzO1xyXG4gICAgfSxcclxuXHJcbiAgICAvL1JldHVybiBsaXZlc1xyXG4gICAgZ2V0TGl2ZXM6IGZ1bmN0aW9uKCkge1xyXG4gICAgICAgIHJldHVybiBNb2RlbC5saXZlcztcclxuICAgIH0sXHJcblxyXG4gICAgLy9SZXR1cm4gbGl2ZXNcclxuICAgIHVwZGF0ZUxpdmVzOiBmdW5jdGlvbigpIHtcclxuICAgICAgICBpZihNb2RlbC5tb3ZlcyA8IDIwKSB7XHJcbiAgICAgICAgICAgIE1vZGVsLmxpdmVzID0gMztcclxuICAgICAgICB9IGVsc2UgaWYgKE1vZGVsLm1vdmVzIDwgMjkpIHtcclxuICAgICAgICAgICAgTW9kZWwubGl2ZXMgPSAyO1xyXG4gICAgICAgICAgICBWaWV3Lmxvc2VTdGFyKE1vZGVsLmxpdmVzKTtcclxuICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICBNb2RlbC5saXZlcyA9IDE7XHJcbiAgICAgICAgICAgIFZpZXcubG9zZVN0YXIoTW9kZWwubGl2ZXMpO1xyXG4gICAgICAgIH1cclxuICAgIH0sXHJcblxyXG4gICAgLy9VcGRhdGUgU3RhciAmIG1vdmUgbnVtYmVyXHJcbiAgICB1cGRhdGVNb3ZlczogZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgTW9kZWwubW92ZXMrKztcclxuICAgICAgICBWaWV3LmNoYW5nZU1vdmVzKE1vZGVsLm1vdmVzKTtcclxuICAgIH0sXHJcblxyXG4gICAgLy9yZXNldCBmbGlwcGVkIGNhcmRzIGFycmF5XHJcbiAgICByZXNldEFjdGl2ZUNhcmQ6IGZ1bmN0aW9uKCkge1xyXG4gICAgICAgIE1vZGVsLmFjdGl2ZUNhcmQgPSBbXTtcclxuICAgIH0sXHJcblxyXG4gICAgLy9TZXQgZmxpcHBlZCBjYXJkc1xyXG4gICAgc2V0QWN0aXZlQ2FyZDogZnVuY3Rpb24oY2FyZDEsY2FyZDIpIHtcclxuICAgICAgICBjYXJkMiA/IFxyXG4gICAgICAgICAgICBNb2RlbC5hY3RpdmVDYXJkID0gW2NhcmQxLGNhcmQyXVxyXG4gICAgICAgICAgICA6IE1vZGVsLmFjdGl2ZUNhcmQgPSBbY2FyZDFdO1xyXG4gICAgfSxcclxuXHJcbiAgICAvL0dldCBjdXJyZW50IGZsaXBwZWQgY2FyZFxyXG4gICAgZ2V0QWN0aXZlQ2FyZDogZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgcmV0dXJuIE1vZGVsLmFjdGl2ZUNhcmQ7XHJcbiAgICB9LFxyXG5cclxuICAgIC8vR2V0IHRoZSBjdXJyZW50IGFycmF5IG9mIGNhcmRzXHJcbiAgICBnZXREZWNrOiBmdW5jdGlvbigpIHtcclxuICAgICAgICByZXR1cm4gTW9kZWwuZGVjaztcclxuICAgIH0sXHJcblxyXG4gICAgLy9TZXQgdGhlIGN1cnJlbnQgZGVja1xyXG4gICAgc2V0RGVjazogZnVuY3Rpb24oZGVjaykge1xyXG4gICAgICAgIE1vZGVsLmRlY2sgPSBkZWNrO1xyXG4gICAgfSxcclxuXHJcbiAgICByZXNldERlY2s6IGZ1bmN0aW9uKCkge1xyXG4gICAgICAgIE1vZGVsLmJ1aWxkRGVjaygpO1xyXG4gICAgfSxcclxuXHJcbiAgICBzZXRXcm9uZzogZnVuY3Rpb24oY2FyZDEsY2FyZDIpIHtcclxuICAgICAgICBWaWV3Lndyb25nU2V0ID0gdHJ1ZTtcclxuICAgICAgICBWaWV3Lndyb25nQ2FyZHMoY2FyZDEsY2FyZDIpO1xyXG5cclxuICAgICAgICBzZXRUaW1lb3V0KGZ1bmN0aW9uKCkge1xyXG4gICAgICAgICAgICBWaWV3LmhpZGVDYXJkcyhjYXJkMSxjYXJkMik7XHJcbiAgICAgICAgICAgIE9jdG8ucmVzZXRBY3RpdmVDYXJkKCk7XHJcbiAgICAgICAgICAgIFZpZXcud3JvbmdTZXQgPSBmYWxzZTtcclxuICAgICAgICB9LCAxMzAwKTtcclxuICAgIH0sXHJcblxyXG4gICAgbWF0Y2hlZDogZnVuY3Rpb24oY2FyZDEsY2FyZDIpIHtcclxuICAgICAgICBWaWV3LnNldE1hdGNoZWQoY2FyZDEsY2FyZDIpO1xyXG4gICAgICAgIE1vZGVsLm51bU1hdGNoZWQrK1xyXG4gICAgICAgIGlmIChNb2RlbC5udW1NYXRjaGVkID09IE1vZGVsLmNhcmRzLmxlbmd0aClcclxuICAgICAgICAgICAgdGhpcy53aW5HYW1lKCk7XHJcbiAgICB9LFxyXG5cclxuICAgIC8vQ2hlY2sgd2hhdCB0aGUgY2FyZCAvIGNhcmRzIGFyZSBzZXQgYXMsIGFuZCBhY3QgYWNjb3JkaW5nbHkuXHJcbiAgICBjYXJkQ2hlY2s6IGZ1bmN0aW9uKGNhcmQpIHtcclxuICAgICAgICBjb25zdCBhY3RpdmVDID0gdGhpcy5nZXRBY3RpdmVDYXJkKCk7XHJcblxyXG4gICAgICAgIGlmICghY2FyZC5tYXRjaCAmJiB0aGlzLmdldExpdmVzKCkgJiYgIVZpZXcud3JvbmdTZXQpIHtcclxuICAgICAgICAgICAgdGhpcy51cGRhdGVNb3ZlcygpO1xyXG4gICAgICAgICAgICB0aGlzLnVwZGF0ZUxpdmVzKCk7XHJcblxyXG4gICAgICAgICAgICBpZiAoY2FyZC5jYXJkU2hvdykge1xyXG4gICAgICAgICAgICAgICAgVmlldy5oaWRlQ2FyZHMoY2FyZCk7XHJcbiAgICAgICAgICAgICAgICB0aGlzLnNldEFjdGl2ZUNhcmQobnVsbCk7XHJcbiAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICBpZiAoYWN0aXZlQy5sZW5ndGggPCAyKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgY2FyZC5jYXJkU2hvdyA9IHRydWU7XHJcbiAgICAgICAgICAgICAgICAgICAgY2FyZC5jbGFzc0xpc3QuYWRkKCdzaG93Jyk7XHJcblxyXG4gICAgICAgICAgICAgICAgICAgIGlmIChhY3RpdmVDWzBdKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuc2V0QWN0aXZlQ2FyZChhY3RpdmVDWzBdLGNhcmQpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBcclxuICAgICAgICAgICAgICAgICAgICAgICAgY2FyZC5jYXJkID09PSBhY3RpdmVDWzBdLmNhcmQgPyBcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMubWF0Y2hlZChjYXJkLGFjdGl2ZUNbMF0pXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICA6IHRoaXMuc2V0V3JvbmcoY2FyZCxhY3RpdmVDWzBdKTtcclxuICAgICAgICAgICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB0aGlzLnNldEFjdGl2ZUNhcmQoY2FyZCk7XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgfSxcclxuXHJcbiAgICByZXNldDogZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgdGhpcy5yZXNldE1vdmVzKCk7XHJcbiAgICAgICAgdGhpcy5yZXNldERlY2soKTtcclxuICAgICAgICBWaWV3LmluaXQoKTtcclxuICAgIH0sXHJcblxyXG4gICAgaW5pdDogZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgTW9kZWwuaW5pdCgpO1xyXG4gICAgICAgIFZpZXcuaW5pdCgpO1xyXG4gICAgfVxyXG59XHJcblxyXG5PY3RvLmluaXQoKTtcclxuXHJcbiJdfQ==
