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
        var image = document.createElement('img');
        baseCard.subEl = document.createElement('i');

        image.src = '../images/geometry2.png';
        image.alt = 'Invisible image used to keep items square';

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
        baseCard.appendChild(image);

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
            this.time = {
                start: false,
                hr: 0,
                min: 0,
                sec: 0,
                tiny: 0
            };
            this.recordTime = 0;
            this.numMatched = 0;
            this.activeCard = [null];
            this.buildDeck();
        }
    }
};

var View = {

    gameStart: false, //Used to see if game is on it's first start round

    //Clock view update
    updateTime: function updateTime(timer) {
        var min = timer.min < 10 ? '0' + timer.min : timer.min;
        var sec = timer.sec < 10 ? '0' + timer.sec : timer.sec;
        var tiny = timer.tiny < 10 ? '0' + timer.tiny : timer.tiny;
        document.getElementsByClassName('timer')[0].innerHTML = min + ':' + sec + '.' + tiny;
    },

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
        Model.time.start = false;
    },

    //Set the wine tracking property

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

        if (!Model.time.start) {
            this.startTimer(Model.time);
        }

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

    startTimer: function startTimer(timer) {
        Model.time.start = true;

        function clock() {
            if (Model.time.start) {
                timer.tiny++;
                if (timer.tiny === 100) {
                    timer.tiny = 0;
                    timer.sec++;

                    if (timer.sec === 60) {
                        timer.sec = 0;
                        timer.min++;
                    }
                }
                View.updateTime(timer);
                setTimeout(clock, 10);
            }
        }

        setTimeout(clock, 10);
    },

    reset: function reset() {
        this.resetMoves();
        this.resetDeck();
        this.resetActiveCard();
        Model.time.start = false;
        Model.time.min = 0;
        Model.time.sec = 0;
        Model.time.tiny = 0;
        View.updateTime(Model.time);
        View.init();
    },

    init: function init() {
        Model.init();
        View.init();
    }
};

Octo.init();
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImFwcC5qcyJdLCJuYW1lcyI6WyJNb2RlbCIsImNyZWF0ZUNhcmQiLCJjYXJkIiwiYmFzZUNhcmQiLCJkb2N1bWVudCIsImNyZWF0ZUVsZW1lbnQiLCJpbWFnZSIsInN1YkVsIiwic3JjIiwiYWx0IiwibWF0Y2giLCJjYXJkU2hvdyIsImNsYXNzTmFtZSIsImRhdGFzZXQiLCJpdGVtIiwiYXBwZW5kQ2hpbGQiLCJzaHVmZmxlIiwiYXJyYXkiLCJjdXJyZW50SW5kZXgiLCJsZW5ndGgiLCJ0ZW1wb3JhcnlWYWx1ZSIsInJhbmRvbUluZGV4IiwiTWF0aCIsImZsb29yIiwicmFuZG9tIiwiYnVpbGREZWNrIiwic3RhcnREZWNrIiwidGhhdCIsImNhcmRzIiwicHVzaCIsImRlY2siLCJpbml0IiwibG9jYWxTdG9yYWdlIiwiZ2V0SXRlbSIsImdhbWUiLCJtb3ZlcyIsImxpdmVzIiwidGltZSIsInJlY29yZFRpbWUiLCJhY3RpdmVDYXJkIiwibnVtTWF0Y2hlZCIsInN0YXJ0IiwiaHIiLCJtaW4iLCJzZWMiLCJ0aW55IiwiVmlldyIsImdhbWVTdGFydCIsInVwZGF0ZVRpbWUiLCJ0aW1lciIsImdldEVsZW1lbnRzQnlDbGFzc05hbWUiLCJpbm5lckhUTUwiLCJoaWRlV2luIiwiZ2V0RWxlbWVudEJ5SWQiLCJzaG93V2luIiwiY2xhc3NMaXN0IiwiYWRkIiwibG9zZVN0YXIiLCJuIiwic3RhcnMiLCJyZW1vdmUiLCJjaGFuZ2VNb3ZlcyIsImhpZGVDYXJkcyIsIndyb25nQ2FyZHMiLCJjYXJkMSIsImNhcmQyIiwic2V0TWF0Y2hlZCIsIk9jdG8iLCJyZXNldEFjdGl2ZUNhcmQiLCJ0aGVEZWNrIiwicmVzZXRCdXR0b24iLCJhZGRFdmVudExpc3RlbmVyIiwicmVzZXQiLCJ3cm9uZ1NldCIsImdldERlY2siLCJlIiwiZWwiLCJjdXJyZW50VGFyZ2V0IiwiY2FyZENoZWNrIiwibFN0YXJzIiwiaSIsImdldExpdmVzIiwibEl0ZW0iLCJpY29uIiwiZ2V0TW92ZXMiLCJ3aW5HYW1lIiwicmVzZXRNb3ZlcyIsInVwZGF0ZUxpdmVzIiwidXBkYXRlTW92ZXMiLCJzZXRBY3RpdmVDYXJkIiwiZ2V0QWN0aXZlQ2FyZCIsInNldERlY2siLCJyZXNldERlY2siLCJzZXRXcm9uZyIsInNldFRpbWVvdXQiLCJtYXRjaGVkIiwiYWN0aXZlQyIsInN0YXJ0VGltZXIiLCJjbG9jayJdLCJtYXBwaW5ncyI6Ijs7QUFBQTs7OztBQUtBOzs7Ozs7O0FBUUE7O0FBRUE7O0FBRUEsSUFBTUEsUUFBUTs7QUFFVkMsZ0JBQVksb0JBQVNDLElBQVQsRUFBZTtBQUN2QixZQUFNQyxXQUFXQyxTQUFTQyxhQUFULENBQXVCLElBQXZCLENBQWpCO0FBQ0EsWUFBTUMsUUFBUUYsU0FBU0MsYUFBVCxDQUF1QixLQUF2QixDQUFkO0FBQ0FGLGlCQUFTSSxLQUFULEdBQWlCSCxTQUFTQyxhQUFULENBQXVCLEdBQXZCLENBQWpCOztBQUVBQyxjQUFNRSxHQUFOO0FBQ0FGLGNBQU1HLEdBQU47O0FBRUE7QUFDQU4saUJBQVNELElBQVQsR0FBZ0JBLElBQWhCOztBQUVBO0FBQ0FDLGlCQUFTTyxLQUFULEdBQWlCLEtBQWpCOztBQUVBO0FBQ0FQLGlCQUFTUSxRQUFULEdBQW9CLEtBQXBCOztBQUVBO0FBQ0FSLGlCQUFTUyxTQUFULEdBQXFCLE1BQXJCO0FBQ0FULGlCQUFTVSxPQUFULENBQWlCQyxJQUFqQixHQUF3QlosSUFBeEI7QUFDQUMsaUJBQVNJLEtBQVQsQ0FBZUssU0FBZixHQUEyQixXQUFXVixJQUF0QztBQUNBQyxpQkFBU1ksV0FBVCxDQUFxQlosU0FBU0ksS0FBOUI7QUFDQUosaUJBQVNZLFdBQVQsQ0FBcUJULEtBQXJCOztBQUVBLGVBQU9ILFFBQVA7QUFDSCxLQTNCUzs7QUE2QlZhLGFBQVMsaUJBQVNDLEtBQVQsRUFBZ0I7QUFDckI7QUFDQSxZQUFJQyxlQUFlRCxNQUFNRSxNQUF6QjtBQUFBLFlBQWlDQyxjQUFqQztBQUFBLFlBQWlEQyxXQUFqRDs7QUFFQSxlQUFPSCxpQkFBaUIsQ0FBeEIs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LEVBQWpCO0FBQ0gsS0FqSlE7O0FBbUpUMUIsV0FBTyxpQkFBVztBQUNkLGFBQUtjLFVBQUw7QUFDQSxhQUFLTSxTQUFMO0FBQ0EsYUFBS3hCLGVBQUw7QUFDQXBFLGNBQU1xQyxJQUFOLENBQVdJLEtBQVgsR0FBbUIsS0FBbkI7QUFDQXpDLGNBQU1xQyxJQUFOLENBQVdNLEdBQVgsR0FBaUIsQ0FBakI7QUFDQTNDLGNBQU1xQyxJQUFOLENBQVdPLEdBQVgsR0FBaUIsQ0FBakI7QUFDQTVDLGNBQU1xQyxJQUFOLENBQVdRLElBQVgsR0FBa0IsQ0FBbEI7QUFDQUMsYUFBS0UsVUFBTCxDQUFnQmhELE1BQU1xQyxJQUF0QjtBQUNBUyxhQUFLZixJQUFMO0FBQ0gsS0E3SlE7O0FBK0pUQSxVQUFNLGdCQUFXO0FBQ2IvQixjQUFNK0IsSUFBTjtBQUNBZSxhQUFLZixJQUFMO0FBQ0g7QUFsS1EsQ0FBYjs7QUFxS0FvQyxLQUFLcEMsSUFBTCIsImZpbGUiOiJhbGwuanMiLCJzb3VyY2VzQ29udGVudCI6WyIvKlxyXG4gKiBDcmVhdGUgYSBsaXN0IHRoYXQgaG9sZHMgYWxsIG9mIHlvdXIgY2FyZHNcclxuICovXHJcblxyXG5cclxuLypcclxuICogRGlzcGxheSB0aGUgY2FyZHMgb24gdGhlIHBhZ2VcclxuICogICAtIHNodWZmbGUgdGhlIGxpc3Qgb2YgY2FyZHMgdXNpbmcgdGhlIHByb3ZpZGVkIFwic2h1ZmZsZVwiIG1ldGhvZCBiZWxvd1xyXG4gKiAgIC0gbG9vcCB0aHJvdWdoIGVhY2ggY2FyZCBhbmQgY3JlYXRlIGl0cyBIVE1MXHJcbiAqICAgLSBhZGQgZWFjaCBjYXJkJ3MgSFRNTCB0byB0aGUgcGFnZVxyXG4gKi9cclxuXHJcblxyXG4vLyBNWSBBVFRFTVBUIHRvIGJ1aWxkIHRoaXMgaW4gYSBNT1YgZm9ybWF0XHJcblxyXG4vLyBUaGUgbW9kZWwgaG9sZHMgYWxsIHRoZSBnYW1lcyBkYXRhLlxyXG5cclxuY29uc3QgTW9kZWwgPSB7XHJcblxyXG4gICAgY3JlYXRlQ2FyZDogZnVuY3Rpb24oY2FyZCkge1xyXG4gICAgICAgIGNvbnN0IGJhc2VDYXJkID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnbGknKTtcclxuICAgICAgICBjb25zdCBpbWFnZSA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2ltZycpO1xyXG4gICAgICAgIGJhc2VDYXJkLnN1YkVsID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnaScpO1xyXG5cclxuICAgICAgICBpbWFnZS5zcmMgPSBgLi4vaW1hZ2VzL2dlb21ldHJ5Mi5wbmdgO1xyXG4gICAgICAgIGltYWdlLmFsdCA9IGBJbnZpc2libGUgaW1hZ2UgdXNlZCB0byBrZWVwIGl0ZW1zIHNxdWFyZWA7XHJcblxyXG4gICAgICAgIC8vUGxhY2UgdGhlIG5hbWUgb2YgdGhlIGNhcmQgd2l0aCB0aGUgT2JqZWN0IGVsZW1lbnRcclxuICAgICAgICBiYXNlQ2FyZC5jYXJkID0gY2FyZDtcclxuXHJcbiAgICAgICAgLy9IYXMgdGhlIGNhcmQgYmVlbiBtYXRjaGVkIHVwPyBUaGlzIG1ha2VzIGl0IGVhc2lseSBhY2Nlc3NhYmxlIHRocm91Z2hvdXQgdGhlIGdhbWVcclxuICAgICAgICBiYXNlQ2FyZC5tYXRjaCA9IGZhbHNlO1xyXG4gICAgICAgIFxyXG4gICAgICAgIC8vVGVsbHMgd2hldGhlciB0aGUgY2FyZCBpcyBzaG93aW5nIG9yIG5vdFxyXG4gICAgICAgIGJhc2VDYXJkLmNhcmRTaG93ID0gZmFsc2U7XHJcblxyXG4gICAgICAgIC8vU2V0dXAgdGhlIGNhcmQgRE9NIHN0cnVjdHVyZSBhbmQgYXR0cmlidXRlcy5cclxuICAgICAgICBiYXNlQ2FyZC5jbGFzc05hbWUgPSAnY2FyZCc7XHJcbiAgICAgICAgYmFzZUNhcmQuZGF0YXNldC5pdGVtID0gY2FyZDtcclxuICAgICAgICBiYXNlQ2FyZC5zdWJFbC5jbGFzc05hbWUgPSAnZmEgZmEtJyArIGNhcmQ7XHJcbiAgICAgICAgYmFzZUNhcmQuYXBwZW5kQ2hpbGQoYmFzZUNhcmQuc3ViRWwpO1xyXG4gICAgICAgIGJhc2VDYXJkLmFwcGVuZENoaWxkKGltYWdlKTtcclxuXHJcbiAgICAgICAgcmV0dXJuIGJhc2VDYXJkXHJcbiAgICB9LFxyXG5cclxuICAgIHNodWZmbGU6IGZ1bmN0aW9uKGFycmF5KSB7XHJcbiAgICAgICAgLy8gU2h1ZmZsZSBmdW5jdGlvbiBmcm9tIGh0dHA6Ly9zdGFja292ZXJmbG93LmNvbS9hLzI0NTA5NzZcclxuICAgICAgICB2YXIgY3VycmVudEluZGV4ID0gYXJyYXkubGVuZ3RoLCB0ZW1wb3JhcnlWYWx1ZSwgcmFuZG9tSW5kZXg7XHJcblxyXG4gICAgICAgIHdoaWxlIChjdXJyZW50SW5kZXggIT09IDApIHtcclxuICAgICAgICAgICAgcmFuZG9tSW5kZXggPSBNYXRoLmZsb29yKE1hdGgucmFuZG9tKCkgKiBjdXJyZW50SW5kZXgpO1xyXG4gICAgICAgICAgICBjdXJyZW50SW5kZXggLT0gMTtcclxuICAgICAgICAgICAgdGVtcG9yYXJ5VmFsdWUgPSBhcnJheVtjdXJyZW50SW5kZXhdO1xyXG4gICAgICAgICAgICBhcnJheVtjdXJyZW50SW5kZXhdID0gYXJyYXlbcmFuZG9tSW5kZXhdO1xyXG4gICAgICAgICAgICBhcnJheVtyYW5kb21JbmRleF0gPSB0ZW1wb3JhcnlWYWx1ZTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHJldHVybiBhcnJheTtcclxuICAgIH0sXHJcblxyXG4gICAgLy9CdWlsZHMgb3V0IHRoZSBjYXJkIGRlY2sgZWxlbWVudHMgaW50byBhbiBlYXN5IHRvIGFjY2VzcyBhcnJheVxyXG4gICAgYnVpbGREZWNrOiBmdW5jdGlvbigpIHtcclxuICAgICAgICBsZXQgc3RhcnREZWNrID0gW107XHJcbiAgICAgICAgY29uc3QgdGhhdCA9IHRoaXM7XHJcblxyXG4gICAgICAgIGZvciAodmFyIGNhcmQgb2YgdGhpcy5jYXJkcykge1xyXG4gICAgICAgICAgICBzdGFydERlY2sucHVzaCh0aGF0LmNyZWF0ZUNhcmQoY2FyZCkpO1xyXG4gICAgICAgICAgICBzdGFydERlY2sucHVzaCh0aGF0LmNyZWF0ZUNhcmQoY2FyZCkpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgdGhpcy5kZWNrID0gdGhpcy5zaHVmZmxlKHN0YXJ0RGVjayk7XHJcbiAgICB9LFxyXG5cclxuICAgIC8vVGhpcyBydW5zIG9uIGdhbWUgc3RhcnQuXHJcbiAgICBpbml0OiBmdW5jdGlvbigpIHtcclxuICAgICAgICAvL0lmIGEgYnJvd3NlciBoYXMgbG9jYWwgZ2FtZSBzdG9yYWdlLCB0aGFuIGxvYWQgdGhhdCBpbnN0ZWFkIG9mIGNyZWF0aW5nIGEgbmV3IGdhbWUuXHJcbiAgICAgICAgLy8gTE9DQUwgU1RPUkdBRSBBQklMSVRZIEhBU05cIlQgQkVFTiBCVUlMVCBZRVQuXHJcbiAgICAgICAgaWYgKGxvY2FsU3RvcmFnZS5nZXRJdGVtKCdlY21NZW1HYW1lJykpIHtcclxuICAgICAgICAgICAgY29uc3QgZ2FtZSA9IGxvY2FsU3RvcmFnZS5nZXRJdGVtKCdlY21NZW1HYW1lJyk7XHJcbiAgICAgICAgICAgIHRoaXMubW92ZXMgPSBnYW1lLm1vdmVzO1xyXG4gICAgICAgICAgICB0aGlzLmxpdmVzID0gZ2FtZS5saXZlc1xyXG4gICAgICAgICAgICB0aGlzLnRpbWUgPSBnYW1lLnRpbWU7XHJcbiAgICAgICAgICAgIHRoaXMucmVjb3JkVGltZSA9IGdhbWUucmVjb3JkVGltZTtcclxuICAgICAgICAgICAgdGhpcy5jYXJkcyA9IGdhbWUuY2FyZHM7XHJcbiAgICAgICAgICAgIHRoaXMuZGVjayA9IGdhbWUuZGVjaztcclxuICAgICAgICAgICAgdGhpcy5hY3RpdmVDYXJkID0gZ2FtZS5hY3RpdmVDYXJkO1xyXG4gICAgICAgICAgICB0aGlzLm51bU1hdGNoZWQgPSBnYW1lLm51bU1hdGNoZWQ7XHJcbiAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgdGhpcy5jYXJkcyA9IFtcclxuICAgICAgICAgICAgICAgICdkaWFtb25kJyxcclxuICAgICAgICAgICAgICAgICdwYXBlci1wbGFuZS1vJyxcclxuICAgICAgICAgICAgICAgICdhbmNob3InLFxyXG4gICAgICAgICAgICAgICAgJ2JvbHQnLFxyXG4gICAgICAgICAgICAgICAgJ2N1YmUnLFxyXG4gICAgICAgICAgICAgICAgJ2xlYWYnLFxyXG4gICAgICAgICAgICAgICAgJ2JpY3ljbGUnLFxyXG4gICAgICAgICAgICAgICAgJ2JvbWInXHJcbiAgICAgICAgICAgIF07XHJcbiAgICAgICAgICAgIHRoaXMubW92ZXMgPSAwO1xyXG4gICAgICAgICAgICB0aGlzLmxpdmVzID0gMztcclxuICAgICAgICAgICAgdGhpcy50aW1lID0ge1xyXG4gICAgICAgICAgICAgICAgc3RhcnQ6IGZhbHNlLFxyXG4gICAgICAgICAgICAgICAgaHI6IDAsXHJcbiAgICAgICAgICAgICAgICBtaW46IDAsXHJcbiAgICAgICAgICAgICAgICBzZWM6IDAsXHJcbiAgICAgICAgICAgICAgICB0aW55OiAwICAgXHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgdGhpcy5yZWNvcmRUaW1lID0gMDtcclxuICAgICAgICAgICAgdGhpcy5udW1NYXRjaGVkID0gMDtcclxuICAgICAgICAgICAgdGhpcy5hY3RpdmVDYXJkID0gW251bGxdO1xyXG4gICAgICAgICAgICB0aGlzLmJ1aWxkRGVjaygpO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxufVxyXG5cclxuY29uc3QgVmlldyA9IHtcclxuXHJcbiAgICBnYW1lU3RhcnQ6IGZhbHNlLCAvL1VzZWQgdG8gc2VlIGlmIGdhbWUgaXMgb24gaXQncyBmaXJzdCBzdGFydCByb3VuZFxyXG5cclxuICAgIC8vQ2xvY2sgdmlldyB1cGRhdGVcclxuICAgIHVwZGF0ZVRpbWU6IGZ1bmN0aW9uKHRpbWVyKSB7XHJcbiAgICAgICAgY29uc3QgbWluID0gdGltZXIubWluIDwgMTAgPyAnMCcgKyB0aW1lci5taW4gOiB0aW1lci5taW47XHJcbiAgICAgICAgY29uc3Qgc2VjID0gdGltZXIuc2VjIDwgMTAgPyAnMCcgKyB0aW1lci5zZWMgOiB0aW1lci5zZWM7XHJcbiAgICAgICAgY29uc3QgdGlueSA9IHRpbWVyLnRpbnkgPCAxMCA/ICcwJyArIHRpbWVyLnRpbnkgOiB0aW1lci50aW55XHJcbiAgICAgICAgZG9jdW1lbnQuZ2V0RWxlbWVudHNCeUNsYXNzTmFtZSgndGltZXInKVswXS5pbm5lckhUTUwgPSBtaW4gKyAnOicgKyBzZWMgKyAnLicgKyB0aW55O1xyXG4gICAgfSxcclxuXHJcbiAgICAvL0hpZGUgYW5kIHNob3cgdGhlIHdpbiBnYW1lIHNpZ25cclxuICAgIGhpZGVXaW46IGZ1bmN0aW9uKCkge1xyXG4gICAgICAgIGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCd3aW5uaW5nJykuY2xhc3NOYW1lID0gJ2Rpc3BsYXktbm9uZSc7XHJcbiAgICB9LFxyXG4gICAgXHJcbiAgICBzaG93V2luOiBmdW5jdGlvbigpIHtcclxuICAgICAgICBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnd2lubmluZycpLmNsYXNzTGlzdC5hZGQoJ3Nob3cnKTtcclxuICAgIH0sXHJcblxyXG4gICAgLy9Jbml0aWFsaXphdGlvbiBvZiB0aGUgZ2FtZSB2aWV3LCBwbGFjZXMgZWxlbWVudHMgaW4gdGhlIERPTSAmIGFkZGluZyBldmVudCBsaXN0ZW5lcnMuXHJcbiAgICBsb3NlU3RhcjogZnVuY3Rpb24obikge1xyXG4gICAgICAgIHRoaXMuc3RhcnNbbl0ucmVtb3ZlKCk7XHJcbiAgICB9LFxyXG5cclxuICAgIGNoYW5nZU1vdmVzOiBmdW5jdGlvbihtb3Zlcykge1xyXG4gICAgICAgIGRvY3VtZW50LmdldEVsZW1lbnRzQnlDbGFzc05hbWUoJ21vdmVzJylbMF0uaW5uZXJIVE1MID0gbW92ZXM7XHJcbiAgICB9LFxyXG5cclxuICAgIC8vSGlkZSBjYXJkXHJcbiAgICBoaWRlQ2FyZHM6IGZ1bmN0aW9uKC4uLmNhcmRzKSB7XHJcbiAgICAgICAgZm9yICh2YXIgY2FyZCBvZiBjYXJkcykge1xyXG4gICAgICAgICAgICBjYXJkLmNhcmRTaG93ID0gZmFsc2U7XHJcbiAgICAgICAgICAgIGNhcmQuY2xhc3NMaXN0LnJlbW92ZSgnc2hvdycpO1xyXG4gICAgICAgICAgICBjYXJkLmNsYXNzTGlzdC5yZW1vdmUoJ3dyb25nJyk7XHJcbiAgICAgICAgICAgIGNhcmQuY2xhc3NMaXN0LnJlbW92ZSgnbWF0Y2gnKTtcclxuICAgICAgICB9XHJcbiAgICB9LFxyXG5cclxuICAgIC8vVGhlIHdyb25nIHBhaXIgb2YgY2FyZHMgYXJlIHNlbGVjdGVkLCB0aGVuIHJ1biB0aGlzIGZ1bmN0aW9uXHJcbiAgICB3cm9uZ0NhcmRzOiBmdW5jdGlvbihjYXJkMSxjYXJkMikge1xyXG4gICAgICAgIGNhcmQxLmNsYXNzTGlzdC5hZGQoJ3dyb25nJyk7XHJcbiAgICAgICAgY2FyZDIuY2xhc3NMaXN0LmFkZCgnd3JvbmcnKTtcclxuICAgIH0sXHJcblxyXG4gICAgc2V0TWF0Y2hlZDogZnVuY3Rpb24oY2FyZDEsIGNhcmQyKSB7XHJcbiAgICAgICAgY2FyZDEuY2xhc3NMaXN0LmFkZCgnbWF0Y2gnKTtcclxuICAgICAgICBjYXJkMS5tYXRjaCA9IHRydWU7XHJcbiAgICAgICAgY2FyZDIuY2xhc3NMaXN0LmFkZCgnbWF0Y2gnKTtcclxuICAgICAgICBjYXJkMi5tYXRjaCA9IHRydWU7XHJcbiAgICAgICAgT2N0by5yZXNldEFjdGl2ZUNhcmQoKTtcclxuICAgIH0sXHJcblxyXG4gICAgaW5pdDogZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgdGhpcy5zdGFycyA9IFtdO1xyXG4gICAgICAgIC8vQ2hlY2sgaWYgdGhpcyBpcyB0aGUgZ2FtZXMgZmlyc3Qgc3RhcnQsIGlmIHNvIGFzc2lnbiBFbGVtZW50cyB0byBWaWV3IHBhcmFtZXRlcnNcclxuICAgICAgICBpZiAoIXRoaXMuZ2FtZVN0YXJ0KSB7XHJcbiAgICAgICAgICAgIHRoaXMudGhlRGVjayA9IGRvY3VtZW50LmdldEVsZW1lbnRzQnlDbGFzc05hbWUoJ2RlY2snKVswXTtcclxuICAgICAgICAgICAgdGhpcy5yZXNldEJ1dHRvbiA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdyZXN0YXJ0Jyk7XHJcbiAgICAgICAgICAgIHRoaXMucmVzZXRCdXR0b24uYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCBmdW5jdGlvbigpIHtcclxuICAgICAgICAgICAgICAgIE9jdG8ucmVzZXQoKTtcclxuICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICAvL1Jlc2V0IHRoZSBkZWNrXHJcbiAgICAgICAgdGhpcy50aGVEZWNrLmlubmVySFRNTCA9IGBgO1xyXG4gICAgICAgIHRoaXMud3JvbmdTZXQgPSBmYWxzZTtcclxuXHJcbiAgICAgICAgZm9yICh2YXIgY2FyZCBvZiBPY3RvLmdldERlY2soKSl7XHJcbiAgICAgICAgICAgIGNhcmQuYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCBmdW5jdGlvbihlKSB7XHJcbiAgICAgICAgICAgICAgICBjb25zdCBlbCA9IGUuY3VycmVudFRhcmdldDtcclxuICAgICAgICAgICAgICAgIE9jdG8uY2FyZENoZWNrKGVsKTtcclxuICAgICAgICAgICAgfSk7IFxyXG5cclxuICAgICAgICAgICAgdGhpcy50aGVEZWNrLmFwcGVuZENoaWxkKGNhcmQpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgLy9DcmVhdGUgU3RhcnNcclxuICAgICAgICBjb25zdCBsU3RhcnMgPSBkb2N1bWVudC5nZXRFbGVtZW50c0J5Q2xhc3NOYW1lKCdzdGFycycpWzBdXHJcbiAgICAgICAgbFN0YXJzLmlubmVySFRNTCA9IGBgO1xyXG5cclxuICAgICAgICBmb3IgKHZhciBpID0gMDsgaSA8IE9jdG8uZ2V0TGl2ZXMoKTsgaSsrKSB7XHJcbiAgICAgICAgICAgIGNvbnN0IGxJdGVtID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnbGknKTtcclxuICAgICAgICAgICAgY29uc3QgaWNvbiA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2knKTtcclxuICAgICAgICAgICAgaWNvbi5jbGFzc05hbWUgPSBgZmEgZmEtc3RhcmA7XHJcbiAgICAgICAgICAgIGxJdGVtLmFwcGVuZENoaWxkKGljb24pO1xyXG4gICAgICAgICAgICBsU3RhcnMuYXBwZW5kQ2hpbGQobEl0ZW0pO1xyXG4gICAgICAgICAgICB0aGlzLnN0YXJzLnB1c2gobEl0ZW0pO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgdGhpcy5oaWRlV2luKCk7XHJcblxyXG4gICAgICAgIC8vU2V0IE1vdmVzIG51bWJlclxyXG4gICAgICAgIGRvY3VtZW50LmdldEVsZW1lbnRzQnlDbGFzc05hbWUoJ21vdmVzJylbMF0uaW5uZXJIVE1MID0gT2N0by5nZXRNb3ZlcygpO1xyXG4gICAgICAgIHRoaXMuZ2FtZVN0YXJ0ID0gdHJ1ZTtcclxuICAgIH1cclxufVxyXG5cclxuY29uc3QgT2N0byA9IHtcclxuXHJcbiAgICAvL1Nob3cgdGhlIHdpbm5pbmcgc2lnbi5cclxuICAgIHdpbkdhbWU6IGZ1bmN0aW9uKCkge1xyXG4gICAgICAgIFZpZXcuc2hvd1dpbigpO1xyXG4gICAgICAgIE1vZGVsLnRpbWUuc3RhcnQgPSBmYWxzZTtcclxuICAgIH0sXHJcblxyXG4gICAgLy9TZXQgdGhlIHdpbmUgdHJhY2tpbmcgcHJvcGVydHlcclxuXHJcbiAgICByZXNldE1vdmVzOiBmdW5jdGlvbigpIHtcclxuICAgICAgICBNb2RlbC5tb3ZlcyA9IDA7XHJcbiAgICB9LFxyXG5cclxuICAgIC8vUmV0dXJuIG1vdmVzXHJcbiAgICBnZXRNb3ZlczogZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgcmV0dXJuIE1vZGVsLm1vdmVzO1xyXG4gICAgfSxcclxuXHJcbiAgICAvL1JldHVybiBsaXZlc1xyXG4gICAgZ2V0TGl2ZXM6IGZ1bmN0aW9uKCkge1xyXG4gICAgICAgIHJldHVybiBNb2RlbC5saXZlcztcclxuICAgIH0sXHJcblxyXG4gICAgLy9SZXR1cm4gbGl2ZXNcclxuICAgIHVwZGF0ZUxpdmVzOiBmdW5jdGlvbigpIHtcclxuICAgICAgICBpZihNb2RlbC5tb3ZlcyA8IDIwKSB7XHJcbiAgICAgICAgICAgIE1vZGVsLmxpdmVzID0gMztcclxuICAgICAgICB9IGVsc2UgaWYgKE1vZGVsLm1vdmVzIDwgMjkpIHtcclxuICAgICAgICAgICAgTW9kZWwubGl2ZXMgPSAyO1xyXG4gICAgICAgICAgICBWaWV3Lmxvc2VTdGFyKE1vZGVsLmxpdmVzKTtcclxuICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICBNb2RlbC5saXZlcyA9IDE7XHJcbiAgICAgICAgICAgIFZpZXcubG9zZVN0YXIoTW9kZWwubGl2ZXMpO1xyXG4gICAgICAgIH1cclxuICAgIH0sXHJcblxyXG4gICAgLy9VcGRhdGUgU3RhciAmIG1vdmUgbnVtYmVyXHJcbiAgICB1cGRhdGVNb3ZlczogZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgTW9kZWwubW92ZXMrKztcclxuICAgICAgICBWaWV3LmNoYW5nZU1vdmVzKE1vZGVsLm1vdmVzKTtcclxuICAgIH0sXHJcblxyXG4gICAgLy9yZXNldCBmbGlwcGVkIGNhcmRzIGFycmF5XHJcbiAgICByZXNldEFjdGl2ZUNhcmQ6IGZ1bmN0aW9uKCkge1xyXG4gICAgICAgIE1vZGVsLmFjdGl2ZUNhcmQgPSBbXTtcclxuICAgIH0sXHJcblxyXG4gICAgLy9TZXQgZmxpcHBlZCBjYXJkc1xyXG4gICAgc2V0QWN0aXZlQ2FyZDogZnVuY3Rpb24oY2FyZDEsY2FyZDIpIHtcclxuICAgICAgICBjYXJkMiA/IE1vZGVsLmFjdGl2ZUNhcmQgPSBbY2FyZDEsY2FyZDJdIDogTW9kZWwuYWN0aXZlQ2FyZCA9IFtjYXJkMV07XHJcbiAgICB9LFxyXG5cclxuICAgIC8vR2V0IGN1cnJlbnQgZmxpcHBlZCBjYXJkXHJcbiAgICBnZXRBY3RpdmVDYXJkOiBmdW5jdGlvbigpIHtcclxuICAgICAgICByZXR1cm4gTW9kZWwuYWN0aXZlQ2FyZDtcclxuICAgIH0sXHJcblxyXG4gICAgLy9HZXQgdGhlIGN1cnJlbnQgYXJyYXkgb2YgY2FyZHNcclxuICAgIGdldERlY2s6IGZ1bmN0aW9uKCkge1xyXG4gICAgICAgIHJldHVybiBNb2RlbC5kZWNrO1xyXG4gICAgfSxcclxuXHJcbiAgICAvL1NldCB0aGUgY3VycmVudCBkZWNrXHJcbiAgICBzZXREZWNrOiBmdW5jdGlvbihkZWNrKSB7XHJcbiAgICAgICAgTW9kZWwuZGVjayA9IGRlY2s7XHJcbiAgICB9LFxyXG5cclxuICAgIHJlc2V0RGVjazogZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgTW9kZWwuYnVpbGREZWNrKCk7XHJcbiAgICB9LFxyXG5cclxuICAgIHNldFdyb25nOiBmdW5jdGlvbihjYXJkMSxjYXJkMikge1xyXG4gICAgICAgIFZpZXcud3JvbmdTZXQgPSB0cnVlO1xyXG4gICAgICAgIFZpZXcud3JvbmdDYXJkcyhjYXJkMSxjYXJkMik7XHJcblxyXG4gICAgICAgIHNldFRpbWVvdXQoZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgICAgIFZpZXcuaGlkZUNhcmRzKGNhcmQxLGNhcmQyKTtcclxuICAgICAgICAgICAgT2N0by5yZXNldEFjdGl2ZUNhcmQoKTtcclxuICAgICAgICAgICAgVmlldy53cm9uZ1NldCA9IGZhbHNlO1xyXG4gICAgICAgIH0sIDEzMDApO1xyXG4gICAgfSxcclxuXHJcbiAgICBtYXRjaGVkOiBmdW5jdGlvbihjYXJkMSxjYXJkMikge1xyXG4gICAgICAgIFZpZXcuc2V0TWF0Y2hlZChjYXJkMSxjYXJkMik7XHJcbiAgICAgICAgTW9kZWwubnVtTWF0Y2hlZCsrXHJcbiAgICAgICAgaWYgKE1vZGVsLm51bU1hdGNoZWQgPT0gTW9kZWwuY2FyZHMubGVuZ3RoKVxyXG4gICAgICAgICAgICB0aGlzLndpbkdhbWUoKTtcclxuICAgIH0sXHJcblxyXG4gICAgLy9DaGVjayB3aGF0IHRoZSBjYXJkIC8gY2FyZHMgYXJlIHNldCBhcywgYW5kIGFjdCBhY2NvcmRpbmdseS5cclxuICAgIGNhcmRDaGVjazogZnVuY3Rpb24oY2FyZCkge1xyXG4gICAgICAgIGNvbnN0IGFjdGl2ZUMgPSB0aGlzLmdldEFjdGl2ZUNhcmQoKTtcclxuICAgICAgICBcclxuICAgICAgICBpZiAoIU1vZGVsLnRpbWUuc3RhcnQpIHtcclxuICAgICAgICAgICAgdGhpcy5zdGFydFRpbWVyKE1vZGVsLnRpbWUpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgaWYgKCFjYXJkLm1hdGNoICYmIHRoaXMuZ2V0TGl2ZXMoKSAmJiAhVmlldy53cm9uZ1NldCkge1xyXG4gICAgICAgICAgICB0aGlzLnVwZGF0ZU1vdmVzKCk7XHJcbiAgICAgICAgICAgIHRoaXMudXBkYXRlTGl2ZXMoKTtcclxuXHJcbiAgICAgICAgICAgIGlmIChjYXJkLmNhcmRTaG93KSB7XHJcbiAgICAgICAgICAgICAgICBWaWV3LmhpZGVDYXJkcyhjYXJkKTtcclxuICAgICAgICAgICAgICAgIHRoaXMuc2V0QWN0aXZlQ2FyZChudWxsKTtcclxuICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgIGlmIChhY3RpdmVDLmxlbmd0aCA8IDIpIHtcclxuICAgICAgICAgICAgICAgICAgICBjYXJkLmNhcmRTaG93ID0gdHJ1ZTtcclxuICAgICAgICAgICAgICAgICAgICBjYXJkLmNsYXNzTGlzdC5hZGQoJ3Nob3cnKTtcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgaWYgKGFjdGl2ZUNbMF0pIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5zZXRBY3RpdmVDYXJkKGFjdGl2ZUNbMF0sY2FyZCk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIFxyXG4gICAgICAgICAgICAgICAgICAgICAgICBjYXJkLmNhcmQgPT09IGFjdGl2ZUNbMF0uY2FyZCA/IFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5tYXRjaGVkKGNhcmQsYWN0aXZlQ1swXSlcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIDogdGhpcy5zZXRXcm9uZyhjYXJkLGFjdGl2ZUNbMF0pO1xyXG4gICAgICAgICAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuc2V0QWN0aXZlQ2FyZChjYXJkKTtcclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICB9LFxyXG5cclxuICAgIHN0YXJ0VGltZXI6IGZ1bmN0aW9uKHRpbWVyKSB7XHJcbiAgICAgICAgTW9kZWwudGltZS5zdGFydCA9IHRydWU7XHJcblxyXG4gICAgICAgIGZ1bmN0aW9uIGNsb2NrKCkge1xyXG4gICAgICAgICAgICBpZihNb2RlbC50aW1lLnN0YXJ0KSB7XHJcbiAgICAgICAgICAgICAgICB0aW1lci50aW55KytcclxuICAgICAgICAgICAgICAgIGlmICh0aW1lci50aW55ID09PSAxMDApIHtcclxuICAgICAgICAgICAgICAgICAgICB0aW1lci50aW55ID0gMDtcclxuICAgICAgICAgICAgICAgICAgICB0aW1lci5zZWMrKztcclxuICAgIFxyXG4gICAgICAgICAgICAgICAgICAgIGlmICh0aW1lci5zZWMgPT09IDYwKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHRpbWVyLnNlYyA9IDA7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHRpbWVyLm1pbisrO1xyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIFZpZXcudXBkYXRlVGltZSh0aW1lcilcclxuICAgICAgICAgICAgICAgIHNldFRpbWVvdXQoY2xvY2ssMTApO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBzZXRUaW1lb3V0KGNsb2NrLDEwKTtcclxuICAgIH0sXHJcblxyXG4gICAgcmVzZXQ6IGZ1bmN0aW9uKCkge1xyXG4gICAgICAgIHRoaXMucmVzZXRNb3ZlcygpO1xyXG4gICAgICAgIHRoaXMucmVzZXREZWNrKCk7XHJcbiAgICAgICAgdGhpcy5yZXNldEFjdGl2ZUNhcmQoKTtcclxuICAgICAgICBNb2RlbC50aW1lLnN0YXJ0ID0gZmFsc2U7XHJcbiAgICAgICAgTW9kZWwudGltZS5taW4gPSAwO1xyXG4gICAgICAgIE1vZGVsLnRpbWUuc2VjID0gMDtcclxuICAgICAgICBNb2RlbC50aW1lLnRpbnkgPSAwO1xyXG4gICAgICAgIFZpZXcudXBkYXRlVGltZShNb2RlbC50aW1lKTtcclxuICAgICAgICBWaWV3LmluaXQoKTtcclxuICAgIH0sXHJcblxyXG4gICAgaW5pdDogZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgTW9kZWwuaW5pdCgpO1xyXG4gICAgICAgIFZpZXcuaW5pdCgpO1xyXG4gICAgfVxyXG59XHJcblxyXG5PY3RvLmluaXQoKTtcclxuXHJcbiJdfQ==
