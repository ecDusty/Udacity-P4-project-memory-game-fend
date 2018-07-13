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
            this.time = game.time;
            this.recordTime = game.recordTime;
            this.cards = game.cards;
            this.deck = game.deck;
            this.activeCard = game.activeCard;
            this.numMatched = game.numMatched;
        } else {
            this.cards = ['diamond', 'paper-plane-o', 'anchor', 'bolt', 'cube', 'leaf', 'bicycle', 'bomb'];
            this.moves = 3;
            this.time = 0;
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

        for (var i = 0; i < Octo.getMoves(); i++) {
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
        Model.moves = 3;
    },

    //Return moves
    getMoves: function getMoves() {
        return Model.moves;
    },

    //Update Star & move number
    updateMoves: function updateMoves() {
        Model.moves--;
        View.loseStar(Model.moves);
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

        this.updateMoves();
    },

    matched: function matched(card1, card2) {
        View.setMatched(card1, card2);
        Model.numMatched++;
        if (Model.numMatched == Model.cards.length) this.winGame();
    },

    //Check what the card / cards are set as, and act accordingly.
    cardCheck: function cardCheck(card) {
        var activeC = this.getActiveCard();

        if (!card.match && this.getMoves() && !View.wrongSet) {
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
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImFwcC5qcyJdLCJuYW1lcyI6WyJNb2RlbCIsImNyZWF0ZUNhcmQiLCJjYXJkIiwiYmFzZUNhcmQiLCJkb2N1bWVudCIsImNyZWF0ZUVsZW1lbnQiLCJzdWJFbCIsIm1hdGNoIiwiY2FyZFNob3ciLCJjbGFzc05hbWUiLCJkYXRhc2V0IiwiaXRlbSIsImFwcGVuZENoaWxkIiwic2h1ZmZsZSIsImFycmF5IiwiY3VycmVudEluZGV4IiwibGVuZ3RoIiwidGVtcG9yYXJ5VmFsdWUiLCJyYW5kb21JbmRleCIsIk1hdGgiLCJmbG9vciIsInJhbmRvbSIsImJ1aWxkRGVjayIsInN0YXJ0RGVjayIsInRoYXQiLCJjYXJkcyIsInB1c2giLCJkZWNrIiwiaW5pdCIsImxvY2FsU3RvcmFnZSIsImdldEl0ZW0iLCJnYW1lIiwibW92ZXMiLCJ0aW1lIiwicmVjb3JkVGltZSIsImFjdGl2ZUNhcmQiLCJudW1NYXRjaGVkIiwiVmlldyIsImdhbWVTdGFydCIsImhpZGVXaW4iLCJnZXRFbGVtZW50QnlJZCIsInNob3dXaW4iLCJjbGFzc0xpc3QiLCJhZGQiLCJsb3NlU3RhciIsIm4iLCJzdGFycyIsInJlbW92ZSIsImNoYW5nZU1vdmVzIiwiZ2V0RWxlbWVudHNCeUNsYXNzTmFtZSIsImlubmVySFRNTCIsImhpZGVDYXJkcyIsIndyb25nQ2FyZHMiLCJjYXJkMSIsImNhcmQyIiwic2V0TWF0Y2hlZCIsIk9jdG8iLCJyZXNldEFjdGl2ZUNhcmQiLCJ0aGVEZWNrIiwicmVzZXRCdXR0b24iLCJhZGRFdmVudExpc3RlbmVyIiwicmVzZXQiLCJ3cm9uZ1NldCIsImdldERlY2siLCJlIiwiZWwiLCJjdXJyZW50VGFyZ2V0IiwiY2FyZENoZWNrIiwibFN0YXJzIiwiaSIsImdldE1vdmVzIiwibEl0ZW0iLCJpY29uIiwid2luR2FtZSIsInJlc2V0TW92ZXMiLCJ1cGRhdGVNb3ZlcyIsInNldEFjdGl2ZUNhcmQiLCJnZXRBY3RpdmVDYXJkIiwic2V0RGVjayIsInJlc2V0RGVjayIsInNl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S1AsYUFBTCxDQUFtQjFFLElBQW5CO0FBQ0g7QUFDSjtBQUNKO0FBQ0o7QUFDSixLQW5HUTs7QUFxR1QyRCxXQUFPLGlCQUFXO0FBQ2QsYUFBS2EsVUFBTDtBQUNBLGFBQUtLLFNBQUw7QUFDQTFDLGFBQUtULElBQUw7QUFDSCxLQXpHUTs7QUEyR1RBLFVBQU0sZ0JBQVc7QUFDYjVCLGNBQU00QixJQUFOO0FBQ0FTLGFBQUtULElBQUw7QUFDSDtBQTlHUSxDQUFiOztBQWlIQTRCLEtBQUs1QixJQUFMIiwiZmlsZSI6ImFsbC5qcyIsInNvdXJjZXNDb250ZW50IjpbIi8qXHJcbiAqIENyZWF0ZSBhIGxpc3QgdGhhdCBob2xkcyBhbGwgb2YgeW91ciBjYXJkc1xyXG4gKi9cclxuXHJcblxyXG4vKlxyXG4gKiBEaXNwbGF5IHRoZSBjYXJkcyBvbiB0aGUgcGFnZVxyXG4gKiAgIC0gc2h1ZmZsZSB0aGUgbGlzdCBvZiBjYXJkcyB1c2luZyB0aGUgcHJvdmlkZWQgXCJzaHVmZmxlXCIgbWV0aG9kIGJlbG93XHJcbiAqICAgLSBsb29wIHRocm91Z2ggZWFjaCBjYXJkIGFuZCBjcmVhdGUgaXRzIEhUTUxcclxuICogICAtIGFkZCBlYWNoIGNhcmQncyBIVE1MIHRvIHRoZSBwYWdlXHJcbiAqL1xyXG5cclxuXHJcbi8vIE1ZIEFUVEVNUFQgdG8gYnVpbGQgdGhpcyBpbiBhIE1PViBmb3JtYXRcclxuXHJcbi8vIFRoZSBtb2RlbCBob2xkcyBhbGwgdGhlIGdhbWVzIGRhdGEuXHJcblxyXG5jb25zdCBNb2RlbCA9IHtcclxuXHJcbiAgICBjcmVhdGVDYXJkOiBmdW5jdGlvbihjYXJkKSB7XHJcbiAgICAgICAgY29uc3QgYmFzZUNhcmQgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdsaScpO1xyXG4gICAgICAgIGJhc2VDYXJkLnN1YkVsID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnaScpO1xyXG5cclxuICAgICAgICAvL1BsYWNlIHRoZSBuYW1lIG9mIHRoZSBjYXJkIHdpdGggdGhlIE9iamVjdCBlbGVtZW50XHJcbiAgICAgICAgYmFzZUNhcmQuY2FyZCA9IGNhcmQ7XHJcblxyXG4gICAgICAgIC8vSGFzIHRoZSBjYXJkIGJlZW4gbWF0Y2hlZCB1cD8gVGhpcyBtYWtlcyBpdCBlYXNpbHkgYWNjZXNzYWJsZSB0aHJvdWdob3V0IHRoZSBnYW1lXHJcbiAgICAgICAgYmFzZUNhcmQubWF0Y2ggPSBmYWxzZTtcclxuICAgICAgICBcclxuICAgICAgICAvL1RlbGxzIHdoZXRoZXIgdGhlIGNhcmQgaXMgc2hvd2luZyBvciBub3RcclxuICAgICAgICBiYXNlQ2FyZC5jYXJkU2hvdyA9IGZhbHNlO1xyXG5cclxuICAgICAgICAvL1NldHVwIHRoZSBjYXJkIERPTSBzdHJ1Y3R1cmUgYW5kIGF0dHJpYnV0ZXMuXHJcbiAgICAgICAgYmFzZUNhcmQuY2xhc3NOYW1lID0gJ2NhcmQnO1xyXG4gICAgICAgIGJhc2VDYXJkLmRhdGFzZXQuaXRlbSA9IGNhcmQ7XHJcbiAgICAgICAgYmFzZUNhcmQuc3ViRWwuY2xhc3NOYW1lID0gJ2ZhIGZhLScgKyBjYXJkO1xyXG4gICAgICAgIGJhc2VDYXJkLmFwcGVuZENoaWxkKGJhc2VDYXJkLnN1YkVsKTtcclxuXHJcbiAgICAgICAgcmV0dXJuIGJhc2VDYXJkXHJcbiAgICB9LFxyXG5cclxuICAgIHNodWZmbGU6IGZ1bmN0aW9uKGFycmF5KSB7XHJcbiAgICAgICAgLy8gU2h1ZmZsZSBmdW5jdGlvbiBmcm9tIGh0dHA6Ly9zdGFja292ZXJmbG93LmNvbS9hLzI0NTA5NzZcclxuICAgICAgICB2YXIgY3VycmVudEluZGV4ID0gYXJyYXkubGVuZ3RoLCB0ZW1wb3JhcnlWYWx1ZSwgcmFuZG9tSW5kZXg7XHJcblxyXG4gICAgICAgIHdoaWxlIChjdXJyZW50SW5kZXggIT09IDApIHtcclxuICAgICAgICAgICAgcmFuZG9tSW5kZXggPSBNYXRoLmZsb29yKE1hdGgucmFuZG9tKCkgKiBjdXJyZW50SW5kZXgpO1xyXG4gICAgICAgICAgICBjdXJyZW50SW5kZXggLT0gMTtcclxuICAgICAgICAgICAgdGVtcG9yYXJ5VmFsdWUgPSBhcnJheVtjdXJyZW50SW5kZXhdO1xyXG4gICAgICAgICAgICBhcnJheVtjdXJyZW50SW5kZXhdID0gYXJyYXlbcmFuZG9tSW5kZXhdO1xyXG4gICAgICAgICAgICBhcnJheVtyYW5kb21JbmRleF0gPSB0ZW1wb3JhcnlWYWx1ZTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHJldHVybiBhcnJheTtcclxuICAgIH0sXHJcblxyXG4gICAgLy9CdWlsZHMgb3V0IHRoZSBjYXJkIGRlY2sgZWxlbWVudHMgaW50byBhbiBlYXN5IHRvIGFjY2VzcyBhcnJheVxyXG4gICAgYnVpbGREZWNrOiBmdW5jdGlvbigpIHtcclxuICAgICAgICBsZXQgc3RhcnREZWNrID0gW107XHJcbiAgICAgICAgY29uc3QgdGhhdCA9IHRoaXM7XHJcblxyXG4gICAgICAgIGZvciAodmFyIGNhcmQgb2YgdGhpcy5jYXJkcykge1xyXG4gICAgICAgICAgICBzdGFydERlY2sucHVzaCh0aGF0LmNyZWF0ZUNhcmQoY2FyZCkpO1xyXG4gICAgICAgICAgICBzdGFydERlY2sucHVzaCh0aGF0LmNyZWF0ZUNhcmQoY2FyZCkpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgdGhpcy5kZWNrID0gdGhpcy5zaHVmZmxlKHN0YXJ0RGVjayk7XHJcbiAgICB9LFxyXG5cclxuICAgIC8vVGhpcyBydW5zIG9uIGdhbWUgc3RhcnQuXHJcbiAgICBpbml0OiBmdW5jdGlvbigpIHtcclxuICAgICAgICAvL0lmIGEgYnJvd3NlciBoYXMgbG9jYWwgZ2FtZSBzdG9yYWdlLCB0aGFuIGxvYWQgdGhhdCBpbnN0ZWFkIG9mIGNyZWF0aW5nIGEgbmV3IGdhbWUuXHJcbiAgICAgICAgLy8gTE9DQUwgU1RPUkdBRSBBQklMSVRZIEhBU05cIlQgQkVFTiBCVUlMVCBZRVQuXHJcbiAgICAgICAgaWYgKGxvY2FsU3RvcmFnZS5nZXRJdGVtKCdlY21NZW1HYW1lJykpIHtcclxuICAgICAgICAgICAgY29uc3QgZ2FtZSA9IGxvY2FsU3RvcmFnZS5nZXRJdGVtKCdlY21NZW1HYW1lJyk7XHJcbiAgICAgICAgICAgIHRoaXMubW92ZXMgPSBnYW1lLm1vdmVzO1xyXG4gICAgICAgICAgICB0aGlzLnRpbWUgPSBnYW1lLnRpbWU7XHJcbiAgICAgICAgICAgIHRoaXMucmVjb3JkVGltZSA9IGdhbWUucmVjb3JkVGltZTtcclxuICAgICAgICAgICAgdGhpcy5jYXJkcyA9IGdhbWUuY2FyZHM7XHJcbiAgICAgICAgICAgIHRoaXMuZGVjayA9IGdhbWUuZGVjaztcclxuICAgICAgICAgICAgdGhpcy5hY3RpdmVDYXJkID0gZ2FtZS5hY3RpdmVDYXJkO1xyXG4gICAgICAgICAgICB0aGlzLm51bU1hdGNoZWQgPSBnYW1lLm51bU1hdGNoZWQ7XHJcbiAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgdGhpcy5jYXJkcyA9IFtcclxuICAgICAgICAgICAgICAgICdkaWFtb25kJyxcclxuICAgICAgICAgICAgICAgICdwYXBlci1wbGFuZS1vJyxcclxuICAgICAgICAgICAgICAgICdhbmNob3InLFxyXG4gICAgICAgICAgICAgICAgJ2JvbHQnLFxyXG4gICAgICAgICAgICAgICAgJ2N1YmUnLFxyXG4gICAgICAgICAgICAgICAgJ2xlYWYnLFxyXG4gICAgICAgICAgICAgICAgJ2JpY3ljbGUnLFxyXG4gICAgICAgICAgICAgICAgJ2JvbWInXHJcbiAgICAgICAgICAgIF07XHJcbiAgICAgICAgICAgIHRoaXMubW92ZXMgPSAzO1xyXG4gICAgICAgICAgICB0aGlzLnRpbWUgPSAwO1xyXG4gICAgICAgICAgICB0aGlzLnJlY29yZFRpbWUgPSAwO1xyXG4gICAgICAgICAgICB0aGlzLm51bU1hdGNoZWQgPSAwO1xyXG4gICAgICAgICAgICB0aGlzLmFjdGl2ZUNhcmQgPSBbbnVsbF07XHJcbiAgICAgICAgICAgIHRoaXMuYnVpbGREZWNrKCk7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG59XHJcblxyXG5jb25zdCBWaWV3ID0ge1xyXG5cclxuICAgIGdhbWVTdGFydDogZmFsc2UsIC8vVXNlZCB0byBzZWUgaWYgZ2FtZSBpcyBvbiBpdCdzIGZpcnN0IHN0YXJ0IHJvdW5kXHJcblxyXG4gICAgLy9IaWRlIGFuZCBzaG93IHRoZSB3aW4gZ2FtZSBzaWduXHJcbiAgICBoaWRlV2luOiBmdW5jdGlvbigpIHtcclxuICAgICAgICBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnd2lubmluZycpLmNsYXNzTmFtZSA9ICdkaXNwbGF5LW5vbmUnO1xyXG4gICAgfSxcclxuICAgIFxyXG4gICAgc2hvd1dpbjogZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ3dpbm5pbmcnKS5jbGFzc0xpc3QuYWRkKCdzaG93Jyk7XHJcbiAgICB9LFxyXG5cclxuICAgIC8vSW5pdGlhbGl6YXRpb24gb2YgdGhlIGdhbWUgdmlldywgcGxhY2VzIGVsZW1lbnRzIGluIHRoZSBET00gJiBhZGRpbmcgZXZlbnQgbGlzdGVuZXJzLlxyXG4gICAgbG9zZVN0YXI6IGZ1bmN0aW9uKG4pIHtcclxuICAgICAgICB0aGlzLnN0YXJzW25dLnJlbW92ZSgpO1xyXG4gICAgfSxcclxuXHJcbiAgICBjaGFuZ2VNb3ZlczogZnVuY3Rpb24obW92ZXMpIHtcclxuICAgICAgICBkb2N1bWVudC5nZXRFbGVtZW50c0J5Q2xhc3NOYW1lKCdtb3ZlcycpWzBdLmlubmVySFRNTCA9IG1vdmVzO1xyXG4gICAgfSxcclxuXHJcbiAgICAvL0hpZGUgY2FyZFxyXG4gICAgaGlkZUNhcmRzOiBmdW5jdGlvbiguLi5jYXJkcykge1xyXG4gICAgICAgIGZvciAodmFyIGNhcmQgb2YgY2FyZHMpIHtcclxuICAgICAgICAgICAgY2FyZC5jYXJkU2hvdyA9IGZhbHNlO1xyXG4gICAgICAgICAgICBjYXJkLmNsYXNzTGlzdC5yZW1vdmUoJ3Nob3cnKTtcclxuICAgICAgICAgICAgY2FyZC5jbGFzc0xpc3QucmVtb3ZlKCd3cm9uZycpO1xyXG4gICAgICAgICAgICBjYXJkLmNsYXNzTGlzdC5yZW1vdmUoJ21hdGNoJyk7XHJcbiAgICAgICAgfVxyXG4gICAgfSxcclxuXHJcbiAgICAvL1RoZSB3cm9uZyBwYWlyIG9mIGNhcmRzIGFyZSBzZWxlY3RlZCwgdGhlbiBydW4gdGhpcyBmdW5jdGlvblxyXG4gICAgd3JvbmdDYXJkczogZnVuY3Rpb24oY2FyZDEsY2FyZDIpIHtcclxuICAgICAgICBjYXJkMS5jbGFzc0xpc3QuYWRkKCd3cm9uZycpO1xyXG4gICAgICAgIGNhcmQyLmNsYXNzTGlzdC5hZGQoJ3dyb25nJyk7XHJcbiAgICB9LFxyXG5cclxuICAgIHNldE1hdGNoZWQ6IGZ1bmN0aW9uKGNhcmQxLCBjYXJkMikge1xyXG4gICAgICAgIGNhcmQxLmNsYXNzTGlzdC5hZGQoJ21hdGNoJyk7XHJcbiAgICAgICAgY2FyZDEubWF0Y2ggPSB0cnVlO1xyXG4gICAgICAgIGNhcmQyLmNsYXNzTGlzdC5hZGQoJ21hdGNoJyk7XHJcbiAgICAgICAgY2FyZDIubWF0Y2ggPSB0cnVlO1xyXG4gICAgICAgIE9jdG8ucmVzZXRBY3RpdmVDYXJkKCk7XHJcbiAgICB9LFxyXG5cclxuICAgIGluaXQ6IGZ1bmN0aW9uKCkge1xyXG4gICAgICAgIHRoaXMuc3RhcnMgPSBbXTtcclxuICAgICAgICAvL0NoZWNrIGlmIHRoaXMgaXMgdGhlIGdhbWVzIGZpcnN0IHN0YXJ0LCBpZiBzbyBhc3NpZ24gRWxlbWVudHMgdG8gVmlldyBwYXJhbWV0ZXJzXHJcbiAgICAgICAgaWYgKCF0aGlzLmdhbWVTdGFydCkge1xyXG4gICAgICAgICAgICB0aGlzLnRoZURlY2sgPSBkb2N1bWVudC5nZXRFbGVtZW50c0J5Q2xhc3NOYW1lKCdkZWNrJylbMF07XHJcbiAgICAgICAgICAgIHRoaXMucmVzZXRCdXR0b24gPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgncmVzdGFydCcpO1xyXG4gICAgICAgICAgICB0aGlzLnJlc2V0QnV0dG9uLmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgICAgICAgICBPY3RvLnJlc2V0KCk7XHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgLy9SZXNldCB0aGUgZGVja1xyXG4gICAgICAgIHRoaXMudGhlRGVjay5pbm5lckhUTUwgPSBgYDtcclxuICAgICAgICB0aGlzLndyb25nU2V0ID0gZmFsc2U7XHJcblxyXG4gICAgICAgIGZvciAodmFyIGNhcmQgb2YgT2N0by5nZXREZWNrKCkpe1xyXG4gICAgICAgICAgICBjYXJkLmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgZnVuY3Rpb24oZSkge1xyXG4gICAgICAgICAgICAgICAgY29uc3QgZWwgPSBlLmN1cnJlbnRUYXJnZXQ7XHJcbiAgICAgICAgICAgICAgICBPY3RvLmNhcmRDaGVjayhlbCk7XHJcbiAgICAgICAgICAgIH0pOyBcclxuXHJcbiAgICAgICAgICAgIHRoaXMudGhlRGVjay5hcHBlbmRDaGlsZChjYXJkKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIC8vQ3JlYXRlIFN0YXJzXHJcbiAgICAgICAgY29uc3QgbFN0YXJzID0gZG9jdW1lbnQuZ2V0RWxlbWVudHNCeUNsYXNzTmFtZSgnc3RhcnMnKVswXVxyXG4gICAgICAgIGxTdGFycy5pbm5lckhUTUwgPSBgYDtcclxuXHJcbiAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCBPY3RvLmdldE1vdmVzKCk7IGkrKykge1xyXG4gICAgICAgICAgICBjb25zdCBsSXRlbSA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2xpJyk7XHJcbiAgICAgICAgICAgIGNvbnN0IGljb24gPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdpJyk7XHJcbiAgICAgICAgICAgIGljb24uY2xhc3NOYW1lID0gYGZhIGZhLXN0YXJgO1xyXG4gICAgICAgICAgICBsSXRlbS5hcHBlbmRDaGlsZChpY29uKTtcclxuICAgICAgICAgICAgbFN0YXJzLmFwcGVuZENoaWxkKGxJdGVtKTtcclxuICAgICAgICAgICAgdGhpcy5zdGFycy5wdXNoKGxJdGVtKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHRoaXMuaGlkZVdpbigpO1xyXG5cclxuICAgICAgICAvL1NldCBNb3ZlcyBudW1iZXJcclxuICAgICAgICBkb2N1bWVudC5nZXRFbGVtZW50c0J5Q2xhc3NOYW1lKCdtb3ZlcycpWzBdLmlubmVySFRNTCA9IE9jdG8uZ2V0TW92ZXMoKTtcclxuICAgICAgICB0aGlzLmdhbWVTdGFydCA9IHRydWU7XHJcbiAgICB9XHJcbn1cclxuXHJcbmNvbnN0IE9jdG8gPSB7XHJcblxyXG4gICAgLy9TaG93IHRoZSB3aW5uaW5nIHNpZ24uXHJcbiAgICB3aW5HYW1lOiBmdW5jdGlvbigpIHtcclxuICAgICAgICBWaWV3LnNob3dXaW4oKTtcclxuICAgIH0sXHJcblxyXG4gICAgcmVzZXRNb3ZlczogZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgTW9kZWwubW92ZXMgPSAzO1xyXG4gICAgfSxcclxuXHJcbiAgICAvL1JldHVybiBtb3Zlc1xyXG4gICAgZ2V0TW92ZXM6IGZ1bmN0aW9uKCkge1xyXG4gICAgICAgIHJldHVybiBNb2RlbC5tb3ZlcztcclxuICAgIH0sXHJcblxyXG4gICAgLy9VcGRhdGUgU3RhciAmIG1vdmUgbnVtYmVyXHJcbiAgICB1cGRhdGVNb3ZlczogZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgTW9kZWwubW92ZXMtLTtcclxuICAgICAgICBWaWV3Lmxvc2VTdGFyKE1vZGVsLm1vdmVzKTtcclxuICAgICAgICBWaWV3LmNoYW5nZU1vdmVzKE1vZGVsLm1vdmVzKTtcclxuICAgIH0sXHJcblxyXG4gICAgLy9yZXNldCBmbGlwcGVkIGNhcmRzIGFycmF5XHJcbiAgICByZXNldEFjdGl2ZUNhcmQ6IGZ1bmN0aW9uKCkge1xyXG4gICAgICAgIE1vZGVsLmFjdGl2ZUNhcmQgPSBbXTtcclxuICAgIH0sXHJcblxyXG4gICAgLy9TZXQgZmxpcHBlZCBjYXJkc1xyXG4gICAgc2V0QWN0aXZlQ2FyZDogZnVuY3Rpb24oY2FyZDEsY2FyZDIpIHtcclxuICAgICAgICBjYXJkMiA/IFxyXG4gICAgICAgICAgICBNb2RlbC5hY3RpdmVDYXJkID0gW2NhcmQxLGNhcmQyXVxyXG4gICAgICAgICAgICA6IE1vZGVsLmFjdGl2ZUNhcmQgPSBbY2FyZDFdO1xyXG4gICAgfSxcclxuXHJcbiAgICAvL0dldCBjdXJyZW50IGZsaXBwZWQgY2FyZFxyXG4gICAgZ2V0QWN0aXZlQ2FyZDogZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgcmV0dXJuIE1vZGVsLmFjdGl2ZUNhcmQ7XHJcbiAgICB9LFxyXG5cclxuICAgIC8vR2V0IHRoZSBjdXJyZW50IGFycmF5IG9mIGNhcmRzXHJcbiAgICBnZXREZWNrOiBmdW5jdGlvbigpIHtcclxuICAgICAgICByZXR1cm4gTW9kZWwuZGVjaztcclxuICAgIH0sXHJcblxyXG4gICAgLy9TZXQgdGhlIGN1cnJlbnQgZGVja1xyXG4gICAgc2V0RGVjazogZnVuY3Rpb24oZGVjaykge1xyXG4gICAgICAgIE1vZGVsLmRlY2sgPSBkZWNrO1xyXG4gICAgfSxcclxuXHJcbiAgICByZXNldERlY2s6IGZ1bmN0aW9uKCkge1xyXG4gICAgICAgIE1vZGVsLmJ1aWxkRGVjaygpO1xyXG4gICAgfSxcclxuXHJcbiAgICBzZXRXcm9uZzogZnVuY3Rpb24oY2FyZDEsY2FyZDIpIHtcclxuICAgICAgICBWaWV3Lndyb25nU2V0ID0gdHJ1ZTtcclxuICAgICAgICBWaWV3Lndyb25nQ2FyZHMoY2FyZDEsY2FyZDIpO1xyXG5cclxuICAgICAgICBzZXRUaW1lb3V0KGZ1bmN0aW9uKCkge1xyXG4gICAgICAgICAgICBWaWV3LmhpZGVDYXJkcyhjYXJkMSxjYXJkMik7XHJcbiAgICAgICAgICAgIE9jdG8ucmVzZXRBY3RpdmVDYXJkKCk7XHJcbiAgICAgICAgICAgIFZpZXcud3JvbmdTZXQgPSBmYWxzZTtcclxuICAgICAgICB9LCAxMzAwKTtcclxuXHJcbiAgICAgICAgdGhpcy51cGRhdGVNb3ZlcygpO1xyXG4gICAgfSxcclxuXHJcbiAgICBtYXRjaGVkOiBmdW5jdGlvbihjYXJkMSxjYXJkMikge1xyXG4gICAgICAgIFZpZXcuc2V0TWF0Y2hlZChjYXJkMSxjYXJkMik7XHJcbiAgICAgICAgTW9kZWwubnVtTWF0Y2hlZCsrXHJcbiAgICAgICAgaWYgKE1vZGVsLm51bU1hdGNoZWQgPT0gTW9kZWwuY2FyZHMubGVuZ3RoKVxyXG4gICAgICAgICAgICB0aGlzLndpbkdhbWUoKTtcclxuICAgIH0sXHJcblxyXG4gICAgLy9DaGVjayB3aGF0IHRoZSBjYXJkIC8gY2FyZHMgYXJlIHNldCBhcywgYW5kIGFjdCBhY2NvcmRpbmdseS5cclxuICAgIGNhcmRDaGVjazogZnVuY3Rpb24oY2FyZCkge1xyXG4gICAgICAgIGNvbnN0IGFjdGl2ZUMgPSB0aGlzLmdldEFjdGl2ZUNhcmQoKTtcclxuXHJcbiAgICAgICAgaWYgKCFjYXJkLm1hdGNoICYmIHRoaXMuZ2V0TW92ZXMoKSAmJiAhVmlldy53cm9uZ1NldCkge1xyXG4gICAgICAgICAgICBpZiAoY2FyZC5jYXJkU2hvdykge1xyXG4gICAgICAgICAgICAgICAgVmlldy5oaWRlQ2FyZHMoY2FyZCk7XHJcbiAgICAgICAgICAgICAgICB0aGlzLnNldEFjdGl2ZUNhcmQobnVsbCk7XHJcbiAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICBpZiAoYWN0aXZlQy5sZW5ndGggPCAyKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgY2FyZC5jYXJkU2hvdyA9IHRydWU7XHJcbiAgICAgICAgICAgICAgICAgICAgY2FyZC5jbGFzc0xpc3QuYWRkKCdzaG93Jyk7XHJcblxyXG4gICAgICAgICAgICAgICAgICAgIGlmIChhY3RpdmVDWzBdKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuc2V0QWN0aXZlQ2FyZChhY3RpdmVDWzBdLGNhcmQpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBcclxuICAgICAgICAgICAgICAgICAgICAgICAgY2FyZC5jYXJkID09PSBhY3RpdmVDWzBdLmNhcmQgPyBcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMubWF0Y2hlZChjYXJkLGFjdGl2ZUNbMF0pXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICA6IHRoaXMuc2V0V3JvbmcoY2FyZCxhY3RpdmVDWzBdKTtcclxuICAgICAgICAgICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB0aGlzLnNldEFjdGl2ZUNhcmQoY2FyZCk7XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgfSxcclxuXHJcbiAgICByZXNldDogZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgdGhpcy5yZXNldE1vdmVzKCk7XHJcbiAgICAgICAgdGhpcy5yZXNldERlY2soKTtcclxuICAgICAgICBWaWV3LmluaXQoKTtcclxuICAgIH0sXHJcblxyXG4gICAgaW5pdDogZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgTW9kZWwuaW5pdCgpO1xyXG4gICAgICAgIFZpZXcuaW5pdCgpO1xyXG4gICAgfVxyXG59XHJcblxyXG5PY3RvLmluaXQoKTtcclxuXHJcbiJdfQ==
