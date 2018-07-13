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
        } else {
            this.cards = ['diamond', 'paper-plane-o', 'anchor', 'bolt', 'cube', 'leaf', 'bicycle', 'bomb'];
            this.moves = 3;
            this.time = 0;
            this.recordTime = 0;
            this.activeCard = [null];
            this.buildDeck();
        }
    }
};

var View = {

    gameStart: false, //Used to see if game is on it's first start round

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

        //Set Moves number
        document.getElementsByClassName('moves')[0].innerHTML = Octo.getMoves();
        this.gameStart = true;
    }
};

var Octo = {

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

                        card.card === activeC[0].card ? View.setMatched(card, activeC[0]) : this.setWrong(card, activeC[0]);
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
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImFwcC5qcyJdLCJuYW1lcyI6WyJNb2RlbCIsImNyZWF0ZUNhcmQiLCJjYXJkIiwiYmFzZUNhcmQiLCJkb2N1bWVudCIsImNyZWF0ZUVsZW1lbnQiLCJzdWJFbCIsIm1hdGNoIiwiY2FyZFNob3ciLCJjbGFzc05hbWUiLCJkYXRhc2V0IiwiaXRlbSIsImFwcGVuZENoaWxkIiwic2h1ZmZsZSIsImFycmF5IiwiY3VycmVudEluZGV4IiwibGVuZ3RoIiwidGVtcG9yYXJ5VmFsdWUiLCJyYW5kb21JbmRleCIsIk1hdGgiLCJmbG9vciIsInJhbmRvbSIsImJ1aWxkRGVjayIsInN0YXJ0RGVjayIsInRoYXQiLCJjYXJkcyIsInB1c2giLCJkZWNrIiwiaW5pdCIsImxvY2FsU3RvcmFnZSIsImdldEl0ZW0iLCJnYW1lIiwibW92ZXMiLCJ0aW1lIiwicmVjb3JkVGltZSIsImFjdGl2ZUNhcmQiLCJWaWV3IiwiZ2FtZVN0YXJ0IiwibG9zZVN0YXIiLCJuIiwic3RhcnMiLCJyZW1vdmUiLCJjaGFuZ2VNb3ZlcyIsImdldEVsZW1lbnRzQnlDbGFzc05hbWUiLCJpbm5lckhUTUwiLCJoaWRlQ2FyZHMiLCJjbGFzc0xpc3QiLCJ3cm9uZ0NhcmRzIiwiY2FyZDEiLCJjYXJkMiIsImFkZCIsInNldE1hdGNoZWQiLCJPY3RvIiwicmVzZXRBY3RpdmVDYXJkIiwidGhlRGVjayIsInJlc2V0QnV0dG9uIiwiZ2V0RWxlbWVudEJ5SWQiLCJhZGRFdmVudExpc3RlbmVyIiwicmVzZXQiLCJ3cm9uZ1NldCIsImdldERlY2siLCJlIiwiZWwiLCJjdXJyZW50VGFyZ2V0IiwiY2FyZENoZWNrIiwibFN0YXJzIiwiaSIsImdldE1vdmVzIiwibEl0ZW0iLCJpY29uIiwicmVzZXRNb3ZlcyIsInVwZGF0ZU1vdmVzIiwic2V0QWN0aXZlQ2FyZCIsImdldEFjdGl2ZUNhcmQiLCJzZXREZWNrIiwicmVzZXREZWNrIiwic2V0V3JvbmciLCJzZXRUaW1lb3V0IiwiYWN0aXZlQyJdLCJtYXBwaW5ncyI6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QUFLNEMsU0FBTCxDQUFlSSxHQUFmLENBQW1CLE1BQW5COztBQUVBLHdCQUFJNEIsUUFBUSxDQUFSLENBQUosRUFBZ0I7QUFDWiw2QkFBS04sYUFBTCxDQUFtQk0sUUFBUSxDQUFSLENBQW5CLEVBQThCNUUsSUFBOUI7O0FBRUFBLDZCQUFLQSxJQUFMLEtBQWM0RSxRQUFRLENBQVIsRUFBVzVFLElBQXpCLEdBQ0lrQyxLQUFLZSxVQUFMLENBQWdCakQsSUFBaEIsRUFBcUI0RSxRQUFRLENBQVIsQ0FBckIsQ0FESixHQUVNLEtBQUtGLFFBQUwsQ0FBYzFFLElBQWQsRUFBbUI0RSxRQUFRLENBQVIsQ0FBbkIsQ0FGTjtBQUdILHFCQU5ELE1BTU87QUFDSCw2QkFBS04sYUFBTCxDQUFtQnRFLElBQW5CO0FBQ0g7QUFFSjtBQUNKO0FBQ0o7QUFDSixLQXpGUTs7QUEyRlR3RCxXQUFPLGlCQUFXO0FBQ2QsYUFBS1ksVUFBTDtBQUNBLGFBQUtLLFNBQUw7QUFDQXZDLGFBQUtSLElBQUw7QUFDSCxLQS9GUTs7QUFpR1RBLFVBQU0sZ0JBQVc7QUFDYjVCLGNBQU00QixJQUFOO0FBQ0FRLGFBQUtSLElBQUw7QUFDSDtBQXBHUSxDQUFiOztBQXVHQXdCLEtBQUt4QixJQUFMIiwiZmlsZSI6ImFsbC5qcyIsInNvdXJjZXNDb250ZW50IjpbIi8qXHJcbiAqIENyZWF0ZSBhIGxpc3QgdGhhdCBob2xkcyBhbGwgb2YgeW91ciBjYXJkc1xyXG4gKi9cclxuXHJcblxyXG4vKlxyXG4gKiBEaXNwbGF5IHRoZSBjYXJkcyBvbiB0aGUgcGFnZVxyXG4gKiAgIC0gc2h1ZmZsZSB0aGUgbGlzdCBvZiBjYXJkcyB1c2luZyB0aGUgcHJvdmlkZWQgXCJzaHVmZmxlXCIgbWV0aG9kIGJlbG93XHJcbiAqICAgLSBsb29wIHRocm91Z2ggZWFjaCBjYXJkIGFuZCBjcmVhdGUgaXRzIEhUTUxcclxuICogICAtIGFkZCBlYWNoIGNhcmQncyBIVE1MIHRvIHRoZSBwYWdlXHJcbiAqL1xyXG5cclxuXHJcbi8vIE1ZIEFUVEVNUFQgdG8gYnVpbGQgdGhpcyBpbiBhIE1PViBmb3JtYXRcclxuXHJcbi8vIFRoZSBtb2RlbCBob2xkcyBhbGwgdGhlIGdhbWVzIGRhdGEuXHJcblxyXG5jb25zdCBNb2RlbCA9IHtcclxuXHJcbiAgICBjcmVhdGVDYXJkOiBmdW5jdGlvbihjYXJkKSB7XHJcbiAgICAgICAgY29uc3QgYmFzZUNhcmQgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdsaScpO1xyXG4gICAgICAgIGJhc2VDYXJkLnN1YkVsID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnaScpO1xyXG5cclxuICAgICAgICAvL1BsYWNlIHRoZSBuYW1lIG9mIHRoZSBjYXJkIHdpdGggdGhlIE9iamVjdCBlbGVtZW50XHJcbiAgICAgICAgYmFzZUNhcmQuY2FyZCA9IGNhcmQ7XHJcblxyXG4gICAgICAgIC8vSGFzIHRoZSBjYXJkIGJlZW4gbWF0Y2hlZCB1cD8gVGhpcyBtYWtlcyBpdCBlYXNpbHkgYWNjZXNzYWJsZSB0aHJvdWdob3V0IHRoZSBnYW1lXHJcbiAgICAgICAgYmFzZUNhcmQubWF0Y2ggPSBmYWxzZTtcclxuICAgICAgICBcclxuICAgICAgICAvL1RlbGxzIHdoZXRoZXIgdGhlIGNhcmQgaXMgc2hvd2luZyBvciBub3RcclxuICAgICAgICBiYXNlQ2FyZC5jYXJkU2hvdyA9IGZhbHNlO1xyXG5cclxuICAgICAgICAvL1NldHVwIHRoZSBjYXJkIERPTSBzdHJ1Y3R1cmUgYW5kIGF0dHJpYnV0ZXMuXHJcbiAgICAgICAgYmFzZUNhcmQuY2xhc3NOYW1lID0gJ2NhcmQnO1xyXG4gICAgICAgIGJhc2VDYXJkLmRhdGFzZXQuaXRlbSA9IGNhcmQ7XHJcbiAgICAgICAgYmFzZUNhcmQuc3ViRWwuY2xhc3NOYW1lID0gJ2ZhIGZhLScgKyBjYXJkO1xyXG4gICAgICAgIGJhc2VDYXJkLmFwcGVuZENoaWxkKGJhc2VDYXJkLnN1YkVsKTtcclxuXHJcbiAgICAgICAgcmV0dXJuIGJhc2VDYXJkXHJcbiAgICB9LFxyXG5cclxuICAgIHNodWZmbGU6IGZ1bmN0aW9uKGFycmF5KSB7XHJcbiAgICAgICAgLy8gU2h1ZmZsZSBmdW5jdGlvbiBmcm9tIGh0dHA6Ly9zdGFja292ZXJmbG93LmNvbS9hLzI0NTA5NzZcclxuICAgICAgICB2YXIgY3VycmVudEluZGV4ID0gYXJyYXkubGVuZ3RoLCB0ZW1wb3JhcnlWYWx1ZSwgcmFuZG9tSW5kZXg7XHJcblxyXG4gICAgICAgIHdoaWxlIChjdXJyZW50SW5kZXggIT09IDApIHtcclxuICAgICAgICAgICAgcmFuZG9tSW5kZXggPSBNYXRoLmZsb29yKE1hdGgucmFuZG9tKCkgKiBjdXJyZW50SW5kZXgpO1xyXG4gICAgICAgICAgICBjdXJyZW50SW5kZXggLT0gMTtcclxuICAgICAgICAgICAgdGVtcG9yYXJ5VmFsdWUgPSBhcnJheVtjdXJyZW50SW5kZXhdO1xyXG4gICAgICAgICAgICBhcnJheVtjdXJyZW50SW5kZXhdID0gYXJyYXlbcmFuZG9tSW5kZXhdO1xyXG4gICAgICAgICAgICBhcnJheVtyYW5kb21JbmRleF0gPSB0ZW1wb3JhcnlWYWx1ZTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHJldHVybiBhcnJheTtcclxuICAgIH0sXHJcblxyXG4gICAgLy9CdWlsZHMgb3V0IHRoZSBjYXJkIGRlY2sgZWxlbWVudHMgaW50byBhbiBlYXN5IHRvIGFjY2VzcyBhcnJheVxyXG4gICAgYnVpbGREZWNrOiBmdW5jdGlvbigpIHtcclxuICAgICAgICBsZXQgc3RhcnREZWNrID0gW107XHJcbiAgICAgICAgY29uc3QgdGhhdCA9IHRoaXM7XHJcblxyXG4gICAgICAgIGZvciAodmFyIGNhcmQgb2YgdGhpcy5jYXJkcykge1xyXG4gICAgICAgICAgICBzdGFydERlY2sucHVzaCh0aGF0LmNyZWF0ZUNhcmQoY2FyZCkpO1xyXG4gICAgICAgICAgICBzdGFydERlY2sucHVzaCh0aGF0LmNyZWF0ZUNhcmQoY2FyZCkpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgdGhpcy5kZWNrID0gdGhpcy5zaHVmZmxlKHN0YXJ0RGVjayk7XHJcbiAgICB9LFxyXG5cclxuICAgIC8vVGhpcyBydW5zIG9uIGdhbWUgc3RhcnQuXHJcbiAgICBpbml0OiBmdW5jdGlvbigpIHtcclxuICAgICAgICAvL0lmIGEgYnJvd3NlciBoYXMgbG9jYWwgZ2FtZSBzdG9yYWdlLCB0aGFuIGxvYWQgdGhhdCBpbnN0ZWFkIG9mIGNyZWF0aW5nIGEgbmV3IGdhbWUuXHJcbiAgICAgICAgLy8gTE9DQUwgU1RPUkdBRSBBQklMSVRZIEhBU05cIlQgQkVFTiBCVUlMVCBZRVQuXHJcbiAgICAgICAgaWYgKGxvY2FsU3RvcmFnZS5nZXRJdGVtKCdlY21NZW1HYW1lJykpIHtcclxuICAgICAgICAgICAgY29uc3QgZ2FtZSA9IGxvY2FsU3RvcmFnZS5nZXRJdGVtKCdlY21NZW1HYW1lJyk7XHJcbiAgICAgICAgICAgIHRoaXMubW92ZXMgPSBnYW1lLm1vdmVzO1xyXG4gICAgICAgICAgICB0aGlzLnRpbWUgPSBnYW1lLnRpbWU7XHJcbiAgICAgICAgICAgIHRoaXMucmVjb3JkVGltZSA9IGdhbWUucmVjb3JkVGltZTtcclxuICAgICAgICAgICAgdGhpcy5jYXJkcyA9IGdhbWUuY2FyZHM7XHJcbiAgICAgICAgICAgIHRoaXMuZGVjayA9IGdhbWUuZGVjaztcclxuICAgICAgICAgICAgdGhpcy5hY3RpdmVDYXJkID0gZ2FtZS5hY3RpdmVDYXJkXHJcbiAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgdGhpcy5jYXJkcyA9IFtcclxuICAgICAgICAgICAgICAgICdkaWFtb25kJyxcclxuICAgICAgICAgICAgICAgICdwYXBlci1wbGFuZS1vJyxcclxuICAgICAgICAgICAgICAgICdhbmNob3InLFxyXG4gICAgICAgICAgICAgICAgJ2JvbHQnLFxyXG4gICAgICAgICAgICAgICAgJ2N1YmUnLFxyXG4gICAgICAgICAgICAgICAgJ2xlYWYnLFxyXG4gICAgICAgICAgICAgICAgJ2JpY3ljbGUnLFxyXG4gICAgICAgICAgICAgICAgJ2JvbWInXHJcbiAgICAgICAgICAgIF07XHJcbiAgICAgICAgICAgIHRoaXMubW92ZXMgPSAzO1xyXG4gICAgICAgICAgICB0aGlzLnRpbWUgPSAwO1xyXG4gICAgICAgICAgICB0aGlzLnJlY29yZFRpbWUgPSAwO1xyXG4gICAgICAgICAgICB0aGlzLmFjdGl2ZUNhcmQgPSBbbnVsbF07XHJcbiAgICAgICAgICAgIHRoaXMuYnVpbGREZWNrKCk7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG59XHJcblxyXG5jb25zdCBWaWV3ID0ge1xyXG5cclxuICAgIGdhbWVTdGFydDogZmFsc2UsIC8vVXNlZCB0byBzZWUgaWYgZ2FtZSBpcyBvbiBpdCdzIGZpcnN0IHN0YXJ0IHJvdW5kXHJcblxyXG4gICAgLy9Jbml0aWFsaXphdGlvbiBvZiB0aGUgZ2FtZSB2aWV3LCBwbGFjZXMgZWxlbWVudHMgaW4gdGhlIERPTSAmIGFkZGluZyBldmVudCBsaXN0ZW5lcnMuXHJcbiAgICBsb3NlU3RhcjogZnVuY3Rpb24obikge1xyXG4gICAgICAgIHRoaXMuc3RhcnNbbl0ucmVtb3ZlKCk7XHJcbiAgICB9LFxyXG5cclxuICAgIGNoYW5nZU1vdmVzOiBmdW5jdGlvbihtb3Zlcykge1xyXG4gICAgICAgIGRvY3VtZW50LmdldEVsZW1lbnRzQnlDbGFzc05hbWUoJ21vdmVzJylbMF0uaW5uZXJIVE1MID0gbW92ZXM7XHJcbiAgICB9LFxyXG5cclxuICAgIC8vSGlkZSBjYXJkXHJcbiAgICBoaWRlQ2FyZHM6IGZ1bmN0aW9uKC4uLmNhcmRzKSB7XHJcbiAgICAgICAgZm9yICh2YXIgY2FyZCBvZiBjYXJkcykge1xyXG4gICAgICAgICAgICBjYXJkLmNhcmRTaG93ID0gZmFsc2U7XHJcbiAgICAgICAgICAgIGNhcmQuY2xhc3NMaXN0LnJlbW92ZSgnc2hvdycpO1xyXG4gICAgICAgICAgICBjYXJkLmNsYXNzTGlzdC5yZW1vdmUoJ3dyb25nJyk7XHJcbiAgICAgICAgICAgIGNhcmQuY2xhc3NMaXN0LnJlbW92ZSgnbWF0Y2gnKTtcclxuICAgICAgICB9XHJcbiAgICB9LFxyXG5cclxuICAgIC8vVGhlIHdyb25nIHBhaXIgb2YgY2FyZHMgYXJlIHNlbGVjdGVkLCB0aGVuIHJ1biB0aGlzIGZ1bmN0aW9uXHJcbiAgICB3cm9uZ0NhcmRzOiBmdW5jdGlvbihjYXJkMSxjYXJkMikge1xyXG4gICAgICAgIGNhcmQxLmNsYXNzTGlzdC5hZGQoJ3dyb25nJyk7XHJcbiAgICAgICAgY2FyZDIuY2xhc3NMaXN0LmFkZCgnd3JvbmcnKTtcclxuICAgIH0sXHJcblxyXG4gICAgc2V0TWF0Y2hlZDogZnVuY3Rpb24oY2FyZDEsIGNhcmQyKSB7XHJcbiAgICAgICAgY2FyZDEuY2xhc3NMaXN0LmFkZCgnbWF0Y2gnKTtcclxuICAgICAgICBjYXJkMS5tYXRjaCA9IHRydWU7XHJcbiAgICAgICAgY2FyZDIuY2xhc3NMaXN0LmFkZCgnbWF0Y2gnKTtcclxuICAgICAgICBjYXJkMi5tYXRjaCA9IHRydWU7XHJcbiAgICAgICAgT2N0by5yZXNldEFjdGl2ZUNhcmQoKTtcclxuICAgIH0sXHJcblxyXG4gICAgaW5pdDogZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgdGhpcy5zdGFycyA9IFtdO1xyXG4gICAgICAgIC8vQ2hlY2sgaWYgdGhpcyBpcyB0aGUgZ2FtZXMgZmlyc3Qgc3RhcnQsIGlmIHNvIGFzc2lnbiBFbGVtZW50cyB0byBWaWV3IHBhcmFtZXRlcnNcclxuICAgICAgICBpZiAoIXRoaXMuZ2FtZVN0YXJ0KSB7XHJcbiAgICAgICAgICAgIHRoaXMudGhlRGVjayA9IGRvY3VtZW50LmdldEVsZW1lbnRzQnlDbGFzc05hbWUoJ2RlY2snKVswXTtcclxuICAgICAgICAgICAgdGhpcy5yZXNldEJ1dHRvbiA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdyZXN0YXJ0Jyk7XHJcbiAgICAgICAgICAgIHRoaXMucmVzZXRCdXR0b24uYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCBmdW5jdGlvbigpIHtcclxuICAgICAgICAgICAgICAgIE9jdG8ucmVzZXQoKTtcclxuICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICAvL1Jlc2V0IHRoZSBkZWNrXHJcbiAgICAgICAgdGhpcy50aGVEZWNrLmlubmVySFRNTCA9IGBgO1xyXG4gICAgICAgIHRoaXMud3JvbmdTZXQgPSBmYWxzZTtcclxuXHJcbiAgICAgICAgZm9yICh2YXIgY2FyZCBvZiBPY3RvLmdldERlY2soKSl7XHJcbiAgICAgICAgICAgIGNhcmQuYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCBmdW5jdGlvbihlKSB7XHJcbiAgICAgICAgICAgICAgICBjb25zdCBlbCA9IGUuY3VycmVudFRhcmdldDtcclxuICAgICAgICAgICAgICAgIE9jdG8uY2FyZENoZWNrKGVsKTtcclxuICAgICAgICAgICAgfSk7IFxyXG5cclxuICAgICAgICAgICAgdGhpcy50aGVEZWNrLmFwcGVuZENoaWxkKGNhcmQpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgLy9DcmVhdGUgU3RhcnNcclxuICAgICAgICBjb25zdCBsU3RhcnMgPSBkb2N1bWVudC5nZXRFbGVtZW50c0J5Q2xhc3NOYW1lKCdzdGFycycpWzBdXHJcbiAgICAgICAgbFN0YXJzLmlubmVySFRNTCA9IGBgO1xyXG5cclxuICAgICAgICBmb3IgKHZhciBpID0gMDsgaSA8IE9jdG8uZ2V0TW92ZXMoKTsgaSsrKSB7XHJcbiAgICAgICAgICAgIGNvbnN0IGxJdGVtID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnbGknKTtcclxuICAgICAgICAgICAgY29uc3QgaWNvbiA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2knKTtcclxuICAgICAgICAgICAgaWNvbi5jbGFzc05hbWUgPSBgZmEgZmEtc3RhcmA7XHJcbiAgICAgICAgICAgIGxJdGVtLmFwcGVuZENoaWxkKGljb24pO1xyXG4gICAgICAgICAgICBsU3RhcnMuYXBwZW5kQ2hpbGQobEl0ZW0pO1xyXG4gICAgICAgICAgICB0aGlzLnN0YXJzLnB1c2gobEl0ZW0pO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgLy9TZXQgTW92ZXMgbnVtYmVyXHJcbiAgICAgICAgZG9jdW1lbnQuZ2V0RWxlbWVudHNCeUNsYXNzTmFtZSgnbW92ZXMnKVswXS5pbm5lckhUTUwgPSBPY3RvLmdldE1vdmVzKCk7XHJcbiAgICAgICAgdGhpcy5nYW1lU3RhcnQgPSB0cnVlO1xyXG4gICAgfVxyXG59XHJcblxyXG5jb25zdCBPY3RvID0ge1xyXG5cclxuICAgIHJlc2V0TW92ZXM6IGZ1bmN0aW9uKCkge1xyXG4gICAgICAgIE1vZGVsLm1vdmVzID0gMztcclxuICAgIH0sXHJcblxyXG4gICAgLy9SZXR1cm4gbW92ZXNcclxuICAgIGdldE1vdmVzOiBmdW5jdGlvbigpIHtcclxuICAgICAgICByZXR1cm4gTW9kZWwubW92ZXM7XHJcbiAgICB9LFxyXG5cclxuICAgIC8vVXBkYXRlIFN0YXIgJiBtb3ZlIG51bWJlclxyXG4gICAgdXBkYXRlTW92ZXM6IGZ1bmN0aW9uKCkge1xyXG4gICAgICAgIE1vZGVsLm1vdmVzLS07XHJcbiAgICAgICAgVmlldy5sb3NlU3RhcihNb2RlbC5tb3Zlcyk7XHJcbiAgICAgICAgVmlldy5jaGFuZ2VNb3ZlcyhNb2RlbC5tb3Zlcyk7XHJcbiAgICB9LFxyXG5cclxuICAgIC8vcmVzZXQgZmxpcHBlZCBjYXJkcyBhcnJheVxyXG4gICAgcmVzZXRBY3RpdmVDYXJkOiBmdW5jdGlvbigpIHtcclxuICAgICAgICBNb2RlbC5hY3RpdmVDYXJkID0gW107XHJcbiAgICB9LFxyXG5cclxuICAgIC8vU2V0IGZsaXBwZWQgY2FyZHNcclxuICAgIHNldEFjdGl2ZUNhcmQ6IGZ1bmN0aW9uKGNhcmQxLGNhcmQyKSB7XHJcbiAgICAgICAgY2FyZDIgPyBcclxuICAgICAgICAgICAgTW9kZWwuYWN0aXZlQ2FyZCA9IFtjYXJkMSxjYXJkMl1cclxuICAgICAgICAgICAgOiBNb2RlbC5hY3RpdmVDYXJkID0gW2NhcmQxXTtcclxuICAgIH0sXHJcblxyXG4gICAgLy9HZXQgY3VycmVudCBmbGlwcGVkIGNhcmRcclxuICAgIGdldEFjdGl2ZUNhcmQ6IGZ1bmN0aW9uKCkge1xyXG4gICAgICAgIHJldHVybiBNb2RlbC5hY3RpdmVDYXJkO1xyXG4gICAgfSxcclxuXHJcbiAgICAvL0dldCB0aGUgY3VycmVudCBhcnJheSBvZiBjYXJkc1xyXG4gICAgZ2V0RGVjazogZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgcmV0dXJuIE1vZGVsLmRlY2s7XHJcbiAgICB9LFxyXG5cclxuICAgIC8vU2V0IHRoZSBjdXJyZW50IGRlY2tcclxuICAgIHNldERlY2s6IGZ1bmN0aW9uKGRlY2spIHtcclxuICAgICAgICBNb2RlbC5kZWNrID0gZGVjaztcclxuICAgIH0sXHJcblxyXG4gICAgcmVzZXREZWNrOiBmdW5jdGlvbigpIHtcclxuICAgICAgICBNb2RlbC5idWlsZERlY2soKTtcclxuICAgIH0sXHJcblxyXG4gICAgc2V0V3Jvbmc6IGZ1bmN0aW9uKGNhcmQxLGNhcmQyKSB7XHJcbiAgICAgICAgVmlldy53cm9uZ1NldCA9IHRydWU7XHJcbiAgICAgICAgVmlldy53cm9uZ0NhcmRzKGNhcmQxLGNhcmQyKTtcclxuXHJcbiAgICAgICAgc2V0VGltZW91dChmdW5jdGlvbigpIHtcclxuICAgICAgICAgICAgVmlldy5oaWRlQ2FyZHMoY2FyZDEsY2FyZDIpO1xyXG4gICAgICAgICAgICBPY3RvLnJlc2V0QWN0aXZlQ2FyZCgpO1xyXG4gICAgICAgICAgICBWaWV3Lndyb25nU2V0ID0gZmFsc2U7XHJcbiAgICAgICAgfSwgMTMwMCk7XHJcblxyXG4gICAgICAgIHRoaXMudXBkYXRlTW92ZXMoKTtcclxuXHJcbiAgICB9LFxyXG5cclxuICAgIC8vQ2hlY2sgd2hhdCB0aGUgY2FyZCAvIGNhcmRzIGFyZSBzZXQgYXMsIGFuZCBhY3QgYWNjb3JkaW5nbHkuXHJcbiAgICBjYXJkQ2hlY2s6IGZ1bmN0aW9uKGNhcmQpIHtcclxuICAgICAgICBjb25zdCBhY3RpdmVDID0gdGhpcy5nZXRBY3RpdmVDYXJkKCk7XHJcblxyXG4gICAgICAgIGlmICghY2FyZC5tYXRjaCAmJiB0aGlzLmdldE1vdmVzKCkgJiYgIVZpZXcud3JvbmdTZXQpIHtcclxuICAgICAgICAgICAgaWYgKGNhcmQuY2FyZFNob3cpIHtcclxuICAgICAgICAgICAgICAgIFZpZXcuaGlkZUNhcmRzKGNhcmQpO1xyXG4gICAgICAgICAgICAgICAgdGhpcy5zZXRBY3RpdmVDYXJkKG51bGwpO1xyXG4gICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgaWYgKGFjdGl2ZUMubGVuZ3RoIDwgMikge1xyXG4gICAgICAgICAgICAgICAgICAgIGNhcmQuY2FyZFNob3cgPSB0cnVlO1xyXG4gICAgICAgICAgICAgICAgICAgIGNhcmQuY2xhc3NMaXN0LmFkZCgnc2hvdycpO1xyXG5cclxuICAgICAgICAgICAgICAgICAgICBpZiAoYWN0aXZlQ1swXSkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB0aGlzLnNldEFjdGl2ZUNhcmQoYWN0aXZlQ1swXSxjYXJkKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGNhcmQuY2FyZCA9PT0gYWN0aXZlQ1swXS5jYXJkID8gXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBWaWV3LnNldE1hdGNoZWQoY2FyZCxhY3RpdmVDWzBdKVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgOiB0aGlzLnNldFdyb25nKGNhcmQsYWN0aXZlQ1swXSk7XHJcbiAgICAgICAgICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5zZXRBY3RpdmVDYXJkKGNhcmQpO1xyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICB9LFxyXG5cclxuICAgIHJlc2V0OiBmdW5jdGlvbigpIHtcclxuICAgICAgICB0aGlzLnJlc2V0TW92ZXMoKTtcclxuICAgICAgICB0aGlzLnJlc2V0RGVjaygpO1xyXG4gICAgICAgIFZpZXcuaW5pdCgpO1xyXG4gICAgfSxcclxuXHJcbiAgICBpbml0OiBmdW5jdGlvbigpIHtcclxuICAgICAgICBNb2RlbC5pbml0KCk7XHJcbiAgICAgICAgVmlldy5pbml0KCk7XHJcbiAgICB9XHJcbn1cclxuXHJcbk9jdG8uaW5pdCgpO1xyXG5cclxuIl19
