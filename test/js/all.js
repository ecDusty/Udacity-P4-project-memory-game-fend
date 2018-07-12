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
    loseStar: function loseStar() {
        var star = this.stars.pop();
        star.remove();
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

        document.getElementsByClassName[0].innerHTML = '';

        for (var i = 0; i < Octo.getMoves(); i++) {
            var lItem = document.createElement('li');
            var icon = document.createElement('i');
            icon.className = 'fa fa-star';
            lItem.appendChild(icon);
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
    loseMove: function loseMove() {
        Model.moves--;
    },

    //Return moves
    getMoves: function getMoves() {
        return Model.moves;
    },

    //Update Star & move number
    updateMoves: function updateMoves() {},

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
        var that = this;
        that.wrongSet = true;

        setTimeout(function () {
            that.hideCards(card1, card2);
            Octo.resetActiveCard();
            that.wrongSet = false;
        }, 1200);

        this.loseMove();
        View.loseStar();
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

                        card.card === activeC[0].card ? View.setMatched(card, activeC[0]) : View.wrongCards(card, activeC[0]);
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
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImFwcC5qcyJdLCJuYW1lcyI6WyJNb2RlbCIsImNyZWF0ZUNhcmQiLCJjYXJkIiwiYmFzZUNhcmQiLCJkb2N1bWVudCIsImNyZWF0ZUVsZW1lbnQiLCJzdWJFbCIsIm1hdGNoIiwiY2FyZFNob3ciLCJjbGFzc05hbWUiLCJkYXRhc2V0IiwiaXRlbSIsImFwcGVuZENoaWxkIiwic2h1ZmZsZSIsImFycmF5IiwiY3VycmVudEluZGV4IiwibGVuZ3RoIiwidGVtcG9yYXJ5VmFsdWUiLCJyYW5kb21JbmRleCIsIk1hdGgiLCJmbG9vciIsInJhbmRvbSIsImJ1aWxkRGVjayIsInN0YXJ0RGVjayIsInRoYXQiLCJjYXJkcyIsInB1c2giLCJkZWNrIiwiaW5pdCIsImxvY2FsU3RvcmFnZSIsImdldEl0ZW0iLCJnYW1lIiwibW92ZXMiLCJ0aW1lIiwicmVjb3JkVGltZSIsImFjdGl2ZUNhcmQiLCJWaWV3IiwiZ2FtZVN0YXJ0IiwibG9zZVN0YXIiLCJzdGFyIiwic3RhcnMiLCJwb3AiLCJyZW1vdmUiLCJoaWRlQ2FyZHMiLCJjbGFzc0xpc3QiLCJ3cm9uZ0NhcmRzIiwiY2FyZDEiLCJjYXJkMiIsImFkZCIsInNldE1hdGNoZWQiLCJPY3RvIiwicmVzZXRBY3RpdmVDYXJkIiwidGhlRGVjayIsImdldEVsZW1lbnRzQnlDbGFzc05hbWUiLCJyZXNldEJ1dHRvbiIsImdldEVsZW1lbnRCeUlkIiwiYWRkRXZlbnRMaXN0ZW5lciIsInJlc2V0IiwiaW5uZXJIVE1MIiwid3JvbmdTZXQiLCJnZXREZWNrIiwiZSIsImVsIiwiY3VycmVudFRhcmdldCIsImNhcmRDaGVjayIsImkiLCJnZXRNb3ZlcyIsImxJdGVtIiwiaWNvbiIsInJlc2V0TW92ZXMiLCJsb3NlTW92ZSIsInVwZGF0ZU1vdmVzIiwic2V0QWN0aXZlQ2FyZCIsImdldEFjdGl2ZUNhcmQiLCJzZXREZWNrIiwicmVzZXREZWNrIiwic2V0V3JvbmciLCJzZXRUaW1lb3V0IiwiYWN0aXZlQyJdLCJtYXBwaW5ncyI6Ijs7QUFBQTs7OztBQUtBOzs7Ozs7O0FBUUE7O0FBRUE7O0FBRUEsSUFBTUEsUUFBUTs7QUFFVkMsZ0JBQVksb0JBQVNDLElBQVQsRUFBZTtBQUN2QixZQUFNQyxXQUFXQyxTQUFTQyxhQUFULENBQXVCLElBQXZCLENBQWpCO0FBQ0FGLGlCQUFTRyxLQUFULEdBQWlCRixTQUFTQyxhQUFULENBQXVCLEdBQXZCLENBQWpCOztBQUVBO0FBQ0FGLGlCQUFTRCxJQUFULEdBQWdCQSxJQUFoQjs7QUFFQTtBQUNBQyxpQkFBU0ksS0FBVCxHQUFpQixLQUFqQjs7QUFFQTtBQUNBSixpQkFBU0ssUUFBVCxHQUFvQixLQUFwQjs7QUFFQTtBQUNBTCxpQkFBU00sU0FBVCxHQUFxQixNQUFyQjtBQUNBTixpQkFBU08sT0FBVCxDQUFpQkMsSUFBakIsR0FBd0JULElBQXhCO0FBQ0FDLGlCQUFTRyxLQUFULENBQWVHLFNBQWYsR0FBMkIsV0FBV1AsSUFBdEM7QUFDQUMsaUJBQVNTLFdBQVQsQ0FBcUJULFNBQVNHLEtBQTlCOztBQUVBLGVBQU9ILFFBQVA7QUFDSCxLQXRCUzs7QUF3QlZVLGFBQVMsaUJBQVNDLEtBQVQsRUFBZ0I7QUFDckI7QUFDQSxZQUFJQyxlQUFlRCxNQUFNRSxNQUF6QjtBQUFBLFlBQWlDQyxjQUFqQztBQUFBLFlBQWlEQyxXQUFqRDs7QUFFQSxlQUFPSCxpQkFBaUIsQ0FBeEIsRUFBMkI7QUFDdkJHLDBCQUFjQyxLQUFLQyxLQUFMLENBQVdELEtBQUtFLE1BQUwsS0FBZ0JOLFlBQTNCLENBQWQ7QUFDQUEsNEJBQWdCLENBQWhCO0FBQ0FFLDZCQUFpQkgsTUFBTUMsWUFBTixDQUFqQjtBQUNBRCxrQkFBTUMsWUFBTixJQUFzQkQsTUFBTUksV0FBTixDQUF0QjtBQUNBSixrQkFBTUksV0FBTixJQUFxQkQsY0FBckI7QUFDSDs7QUFFRCxlQUFPSCxLQUFQO0FBQ0gsS0FyQ1M7O0FBdUNWO0FBQ0FRLGVBQVcscUJBQVc7QUFDbEIsWUFBSUMsWUFBWSxFQUFoQjtBQUNBLFlBQU1DLE9BQU8sSUFBYjs7QUFGa0I7QUFBQTtBQUFBOztBQUFBO0FBSWxCLGlDQUFpQixLQUFLQyxLQUF0Qiw4SEFBNkI7QUFBQSxvQkFBcEJ2QixJQUFvQjs7QUFDekJxQiwwQkFBVUcsSUFBVixDQUFlRixLQUFLdkIsVUFBTCxDQUFnQkMsSUFBaEIsQ0FBZjtBQUNBcUIsMEJBQVVHLElBQVYsQ0FBZUYsS0FBS3ZCLFVBQUwsQ0FBZ0JDLElBQWhCLENBQWY7QUFDSDtBQVBpQjtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBOztBQVNsQixhQUFLeUIsSUFBTCxHQUFZLEtBQUtkLE9BQUwsQ0FBYVUsU0FBYixDQUFaO0FBQ0gsS0FsRFM7O0FBb0RWO0FBQ0FLLFVBQU0sZ0JBQVc7QUFDYjtBQUNBO0FBQ0EsWUFBSUMsYUFBYUMsT0FBYixDQUFxQixZQUFyQixDQUFKLEVBQXdDO0FBQ3BDLGdCQUFNQyxPQUFPRixhQUFhQyxPQUFiLENBQXFCLFlBQXJCLENBQWI7QUFDQSxpQkFBS0UsS0FBTCxHQUFhRCxLQUFLQyxLQUFsQjtBQUNBLGlCQUFLQyxJQUFMLEdBQVlGLEtBQUtFLElBQWpCO0FBQ0EsaUJBQUtDLFVBQUwsR0FBa0JILEtBQUtHLFVBQXZCO0FBQ0EsaUJBQUtULEtBQUwsR0FBYU0sS0FBS04sS0FBbEI7QUFDQSxpQkFBS0UsSUFBTCxHQUFZSSxLQUFLSixJQUFqQjtBQUNBLGlCQUFLUSxVQUFMLEdBQWtCSixLQUFLSSxVQUF2QjtBQUNILFNBUkQsTUFRTztBQUNILGlCQUFLVixLQUFMLEdBQWEsQ0FDVCxTQURTLEVBRVQsZUFGUyxFQUdULFFBSFMsRUFJVCxNQUpTLEVBS1QsTUFMUyxFQU1ULE1BTlMsRUFPVCxTQVBTLEVBUVQsTUFSUyxDQUFiO0FBVUEsaUJBQUtPLEtBQUwsR0FBYSxDQUFiO0FBQ0EsaUJBQUtDLElBQUwsR0FBWSxDQUFaO0FBQ0EsaUJBQUtDLFVBQUwsR0FBa0IsQ0FBbEI7QUFDQSxpQkFBS0MsVUFBTCxHQUFrQixDQUFDLElBQUQsQ0FBbEI7QUFDQSxpQkFBS2IsU0FBTDtBQUNIO0FBQ0o7QUFqRlMsQ0FBZDs7QUFvRkEsSUFBTWMsT0FBTzs7QUFFVEMsZUFBVyxLQUZGLEVBRVM7O0FBRWxCO0FBQ0FDLGNBQVUsb0JBQVc7QUFDakIsWUFBTUMsT0FBTyxLQUFLQyxLQUFMLENBQVdDLEdBQVgsRUFBYjtBQUNBRixhQUFLRyxNQUFMO0FBQ0gsS0FSUTs7QUFXVDtBQUNBQyxlQUFXLHFCQUFtQjtBQUFBLDBDQUFQbEIsS0FBTztBQUFQQSxpQkFBTztBQUFBOztBQUFBO0FBQUE7QUFBQTs7QUFBQTtBQUMxQixrQ0FBaUJBLEtBQWpCLG1JQUF3QjtBQUFBLG9CQUFmdkIsSUFBZTs7QUFDcEJBLHFCQUFLTSxRQUFMLEdBQWdCLEtBQWhCO0FBQ0FOLHFCQUFLMEMsU0FBTCxDQUFlRixNQUFmLENBQXNCLE1BQXRCO0FBQ0F4QyxxQkFBSzBDLFNBQUwsQ0FBZUYsTUFBZixDQUFzQixPQUF0QjtBQUNBeEMscUJBQUswQyxTQUFMLENBQWVGLE1BQWYsQ0FBc0IsT0FBdEI7QUFDSDtBQU55QjtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBTzdCLEtBbkJROztBQXFCVDtBQUNBRyxnQkFBWSxvQkFBU0MsS0FBVCxFQUFlQyxLQUFmLEVBQXNCO0FBQzlCRCxjQUFNRixTQUFOLENBQWdCSSxHQUFoQixDQUFvQixPQUFwQjtBQUNBRCxjQUFNSCxTQUFOLENBQWdCSSxHQUFoQixDQUFvQixPQUFwQjtBQUNILEtBekJROztBQTJCVEMsZ0JBQVksb0JBQVNILEtBQVQsRUFBZ0JDLEtBQWhCLEVBQXVCO0FBQy9CRCxjQUFNRixTQUFOLENBQWdCSSxHQUFoQixDQUFvQixPQUFwQjtBQUNBRixjQUFNdkMsS0FBTixHQUFjLElBQWQ7QUFDQXdDLGNBQU1ILFNBQU4sQ0FBZ0JJLEdBQWhCLENBQW9CLE9BQXBCO0FBQ0FELGNBQU14QyxLQUFOLEdBQWMsSUFBZDtBQUNBMkMsYUFBS0MsZUFBTDtBQUNILEtBakNROztBQW1DVHZCLFVBQU0sZ0JBQVc7QUFDYjtBQUNBLFlBQUksQ0FBQyxLQUFLUyxTQUFWLEVBQXFCO0FBQ2pCLGlCQUFLZSxPQUFMLEdBQWVoRCxTQUFTaUQsc0JBQVQsQ0FBZ0MsTUFBaEMsRUFBd0MsQ0FBeEMsQ0FBZjtBQUNBLGlCQUFLQyxXQUFMLEdBQW1CbEQsU0FBU21ELGNBQVQsQ0FBd0IsU0FBeEIsQ0FBbkI7O0FBRUEsaUJBQUtELFdBQUwsQ0FBaUJFLGdCQUFqQixDQUFrQyxPQUFsQyxFQUEyQyxZQUFXO0FBQ2xETixxQkFBS08sS0FBTDtBQUNILGFBRkQ7QUFHSDs7QUFFRDtBQUNBLGFBQUtMLE9BQUwsQ0FBYU0sU0FBYjtBQUNBLGFBQUtDLFFBQUwsR0FBZ0IsS0FBaEI7O0FBYmE7QUFBQTtBQUFBOztBQUFBO0FBZWIsa0NBQWlCVCxLQUFLVSxPQUFMLEVBQWpCLG1JQUFnQztBQUFBLG9CQUF2QjFELElBQXVCOztBQUM1QkEscUJBQUtzRCxnQkFBTCxDQUFzQixPQUF0QixFQUErQixVQUFTSyxDQUFULEVBQVk7QUFDdkMsd0JBQU1DLEtBQUtELEVBQUVFLGFBQWI7QUFDQWIseUJBQUtjLFNBQUwsQ0FBZUYsRUFBZjtBQUNILGlCQUhEOztBQUtBLHFCQUFLVixPQUFMLENBQWF4QyxXQUFiLENBQXlCVixJQUF6QjtBQUNIOztBQUVEO0FBeEJhO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7O0FBeUJiRSxpQkFBU2lELHNCQUFULENBQWdDLENBQWhDLEVBQW1DSyxTQUFuQzs7QUFFQSxhQUFLLElBQUlPLElBQUksQ0FBYixFQUFnQkEsSUFBSWYsS0FBS2dCLFFBQUwsRUFBcEIsRUFBcUNELEdBQXJDLEVBQTBDO0FBQ3RDLGdCQUFNRSxRQUFRL0QsU0FBU0MsYUFBVCxDQUF1QixJQUF2QixDQUFkO0FBQ0EsZ0JBQU0rRCxPQUFPaEUsU0FBU0MsYUFBVCxDQUF1QixHQUF2QixDQUFiO0FBQ0ErRCxpQkFBSzNELFNBQUw7QUFDQTBELGtCQUFNdkQsV0FBTixDQUFrQndELElBQWxCO0FBQ0g7O0FBRUQ7QUFDQWhFLGlCQUFTaUQsc0JBQVQsQ0FBZ0MsT0FBaEMsRUFBeUMsQ0FBekMsRUFBNENLLFNBQTVDLEdBQXdEUixLQUFLZ0IsUUFBTCxFQUF4RDtBQUNBLGFBQUs3QixTQUFMLEdBQWlCLElBQWpCO0FBQ0g7QUF4RVEsQ0FBYjs7QUEyRUEsSUFBTWEsT0FBTzs7QUFFVG1CLGdCQUFZLHNCQUFXO0FBQ25CckUsY0FBTWdDLEtBQU4sR0FBYyxDQUFkO0FBQ0gsS0FKUTs7QUFNVDtBQUNBc0MsY0FBVSxvQkFBVztBQUNqQnRFLGNBQU1nQyxLQUFOO0FBQ0gsS0FUUTs7QUFXVDtBQUNBa0MsY0FBVSxvQkFBVztBQUNqQixlQUFPbEUsTUFBTWdDLEtBQWI7QUFDSCxLQWRROztBQWdCVDtBQUNBdUMsaUJBQWEsdUJBQVcsQ0FFdkIsQ0FuQlE7O0FBcUJUO0FBQ0FwQixxQkFBaUIsMkJBQVc7QUFDeEJuRCxjQUFNbUMsVUFBTixHQUFtQixFQUFuQjtBQUNILEtBeEJROztBQTBCVDtBQUNBcUMsbUJBQWUsdUJBQVMxQixLQUFULEVBQWVDLEtBQWYsRUFBc0I7QUFDakNBLGdCQUNJL0MsTUFBTW1DLFVBQU4sR0FBbUIsQ0FBQ1csS0FBRCxFQUFPQyxLQUFQLENBRHZCLEdBRU0vQyxNQUFNbUMsVUFBTixHQUFtQixDQUFDVyxLQUFELENBRnpCO0FBR0gsS0EvQlE7O0FBaUNUO0FBQ0EyQixtQkFBZSx5QkFBVztBQUN0QixlQUFPekUsTUFBTW1DLFVBQWI7QUFDSCxLQXBDUTs7QUFzQ1Q7QUFDQXlCLGFBQVMsbUJBQVc7QUFDaEIsZUFBTzVELE1BQU0yQixJQUFiO0FBQ0gsS0F6Q1E7O0FBMkNUO0FBQ0ErQyxhQUFTLGlCQUFTL0MsSUFBVCxFQUFlO0FBQ3BCM0IsY0FBTTJCLElBQU4sR0FBYUEsSUFBYjtBQUNILEtBOUNROztBQWdEVGdELGVBQVcscUJBQVc7QUFDbEIzRSxjQUFNc0IsU0FBTjtBQUNILEtBbERROztBQW9EVHNELGNBQVUsa0JBQVM5QixLQUFULEVBQWVDLEtBQWYsRUFBc0I7QUFDNUIsWUFBTXZCLE9BQU8sSUFBYjtBQUNBQSxhQUFLbUMsUUFBTCxHQUFnQixJQUFoQjs7QUFFQWtCLG1CQUFXLFlBQVc7QUFDbEJyRCxpQkFBS21CLFNBQUwsQ0FBZUcsS0FBZixFQUFxQkMsS0FBckI7QUFDQUcsaUJBQUtDLGVBQUw7QUFDQTNCLGlCQUFLbUMsUUFBTCxHQUFnQixLQUFoQjtBQUNILFNBSkQsRUFJRyxJQUpIOztBQU1BLGFBQUtXLFFBQUw7QUFDQWxDLGFBQUtFLFFBQUw7QUFFSCxLQWpFUTs7QUFtRVQ7QUFDQTBCLGVBQVcsbUJBQVM5RCxJQUFULEVBQWU7QUFDdEIsWUFBTTRFLFVBQVUsS0FBS0wsYUFBTCxFQUFoQjs7QUFFQSxZQUFJLENBQUN2RSxLQUFLSyxLQUFOLElBQWUsS0FBSzJELFFBQUwsRUFBZixJQUFrQyxDQUFDOUIsS0FBS3VCLFFBQTVDLEVBQXNEO0FBQ2xELGdCQUFJekQsS0FBS00sUUFBVCxFQUFtQjtBQUNmNEIscUJBQUtPLFNBQUwsQ0FBZXpDLElBQWY7QUFDQSxxQkFBS3NFLGFBQUwsQ0FBbUIsSUFBbkI7QUFDSCxhQUhELE1BR087QUFDSCxvQkFBSU0sUUFBUTlELE1BQVIsR0FBaUIsQ0FBckIsRUFBd0I7QUFDcEJkLHlCQUFLTSxRQUFMLEdBQWdCLElBQWhCO0FBQ0FOLHlCQUFLMEMsU0FBTCxDQUFlSSxHQUFmLENBQW1CLE1BQW5COztBQUVBLHdCQUFJOEIsUUFBUSxDQUFSLENBQUosRUFBZ0I7QUFDWiw2QkFBS04sYUFBTCxDQUFtQk0sUUFBUSxDQUFSLENBQW5CLEVBQThCNUUsSUFBOUI7O0FBRUFBLDZCQUFLQSxJQUFMLEtBQWM0RSxRQUFRLENBQVIsRUFBVzVFLElBQXpCLEdBQ0lrQyxLQUFLYSxVQUFMLENBQWdCL0MsSUFBaEIsRUFBcUI0RSxRQUFRLENBQVIsQ0FBckIsQ0FESixHQUVNMUMsS0FBS1MsVUFBTCxDQUFnQjNDLElBQWhCLEVBQXFCNEUsUUFBUSxDQUFSLENBQXJCLENBRk47QUFHSCxxQkFORCxNQU1PO0FBQ0gsNkJBQUtOLGFBQUwsQ0FBbUJ0RSxJQUFuQjtBQUNIO0FBRUo7QUFDSjtBQUNKO0FBQ0osS0E3RlE7O0FBK0ZUdUQsV0FBTyxpQkFBVztBQUNkLGFBQUtZLFVBQUw7QUFDQSxhQUFLTSxTQUFMO0FBQ0F2QyxhQUFLUixJQUFMO0FBQ0gsS0FuR1E7O0FBcUdUQSxVQUFNLGdCQUFXO0FBQ2I1QixjQUFNNEIsSUFBTjtBQUNBUSxhQUFLUixJQUFMO0FBQ0g7QUF4R1EsQ0FBYjs7QUEyR0FzQixLQUFLdEIsSUFBTCIsImZpbGUiOiJhbGwuanMiLCJzb3VyY2VzQ29udGVudCI6WyIvKlxyXG4gKiBDcmVhdGUgYSBsaXN0IHRoYXQgaG9sZHMgYWxsIG9mIHlvdXIgY2FyZHNcclxuICovXHJcblxyXG5cclxuLypcclxuICogRGlzcGxheSB0aGUgY2FyZHMgb24gdGhlIHBhZ2VcclxuICogICAtIHNodWZmbGUgdGhlIGxpc3Qgb2YgY2FyZHMgdXNpbmcgdGhlIHByb3ZpZGVkIFwic2h1ZmZsZVwiIG1ldGhvZCBiZWxvd1xyXG4gKiAgIC0gbG9vcCB0aHJvdWdoIGVhY2ggY2FyZCBhbmQgY3JlYXRlIGl0cyBIVE1MXHJcbiAqICAgLSBhZGQgZWFjaCBjYXJkJ3MgSFRNTCB0byB0aGUgcGFnZVxyXG4gKi9cclxuXHJcblxyXG4vLyBNWSBBVFRFTVBUIHRvIGJ1aWxkIHRoaXMgaW4gYSBNT1YgZm9ybWF0XHJcblxyXG4vLyBUaGUgbW9kZWwgaG9sZHMgYWxsIHRoZSBnYW1lcyBkYXRhLlxyXG5cclxuY29uc3QgTW9kZWwgPSB7XHJcblxyXG4gICAgY3JlYXRlQ2FyZDogZnVuY3Rpb24oY2FyZCkge1xyXG4gICAgICAgIGNvbnN0IGJhc2VDYXJkID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnbGknKTtcclxuICAgICAgICBiYXNlQ2FyZC5zdWJFbCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2knKTtcclxuXHJcbiAgICAgICAgLy9QbGFjZSB0aGUgbmFtZSBvZiB0aGUgY2FyZCB3aXRoIHRoZSBPYmplY3QgZWxlbWVudFxyXG4gICAgICAgIGJhc2VDYXJkLmNhcmQgPSBjYXJkO1xyXG5cclxuICAgICAgICAvL0hhcyB0aGUgY2FyZCBiZWVuIG1hdGNoZWQgdXA/IFRoaXMgbWFrZXMgaXQgZWFzaWx5IGFjY2Vzc2FibGUgdGhyb3VnaG91dCB0aGUgZ2FtZVxyXG4gICAgICAgIGJhc2VDYXJkLm1hdGNoID0gZmFsc2U7XHJcbiAgICAgICAgXHJcbiAgICAgICAgLy9UZWxscyB3aGV0aGVyIHRoZSBjYXJkIGlzIHNob3dpbmcgb3Igbm90XHJcbiAgICAgICAgYmFzZUNhcmQuY2FyZFNob3cgPSBmYWxzZTtcclxuXHJcbiAgICAgICAgLy9TZXR1cCB0aGUgY2FyZCBET00gc3RydWN0dXJlIGFuZCBhdHRyaWJ1dGVzLlxyXG4gICAgICAgIGJhc2VDYXJkLmNsYXNzTmFtZSA9ICdjYXJkJztcclxuICAgICAgICBiYXNlQ2FyZC5kYXRhc2V0Lml0ZW0gPSBjYXJkO1xyXG4gICAgICAgIGJhc2VDYXJkLnN1YkVsLmNsYXNzTmFtZSA9ICdmYSBmYS0nICsgY2FyZDtcclxuICAgICAgICBiYXNlQ2FyZC5hcHBlbmRDaGlsZChiYXNlQ2FyZC5zdWJFbCk7XHJcblxyXG4gICAgICAgIHJldHVybiBiYXNlQ2FyZFxyXG4gICAgfSxcclxuXHJcbiAgICBzaHVmZmxlOiBmdW5jdGlvbihhcnJheSkge1xyXG4gICAgICAgIC8vIFNodWZmbGUgZnVuY3Rpb24gZnJvbSBodHRwOi8vc3RhY2tvdmVyZmxvdy5jb20vYS8yNDUwOTc2XHJcbiAgICAgICAgdmFyIGN1cnJlbnRJbmRleCA9IGFycmF5Lmxlbmd0aCwgdGVtcG9yYXJ5VmFsdWUsIHJhbmRvbUluZGV4O1xyXG5cclxuICAgICAgICB3aGlsZSAoY3VycmVudEluZGV4ICE9PSAwKSB7XHJcbiAgICAgICAgICAgIHJhbmRvbUluZGV4ID0gTWF0aC5mbG9vcihNYXRoLnJhbmRvbSgpICogY3VycmVudEluZGV4KTtcclxuICAgICAgICAgICAgY3VycmVudEluZGV4IC09IDE7XHJcbiAgICAgICAgICAgIHRlbXBvcmFyeVZhbHVlID0gYXJyYXlbY3VycmVudEluZGV4XTtcclxuICAgICAgICAgICAgYXJyYXlbY3VycmVudEluZGV4XSA9IGFycmF5W3JhbmRvbUluZGV4XTtcclxuICAgICAgICAgICAgYXJyYXlbcmFuZG9tSW5kZXhdID0gdGVtcG9yYXJ5VmFsdWU7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICByZXR1cm4gYXJyYXk7XHJcbiAgICB9LFxyXG5cclxuICAgIC8vQnVpbGRzIG91dCB0aGUgY2FyZCBkZWNrIGVsZW1lbnRzIGludG8gYW4gZWFzeSB0byBhY2Nlc3MgYXJyYXlcclxuICAgIGJ1aWxkRGVjazogZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgbGV0IHN0YXJ0RGVjayA9IFtdO1xyXG4gICAgICAgIGNvbnN0IHRoYXQgPSB0aGlzO1xyXG5cclxuICAgICAgICBmb3IgKHZhciBjYXJkIG9mIHRoaXMuY2FyZHMpIHtcclxuICAgICAgICAgICAgc3RhcnREZWNrLnB1c2godGhhdC5jcmVhdGVDYXJkKGNhcmQpKTtcclxuICAgICAgICAgICAgc3RhcnREZWNrLnB1c2godGhhdC5jcmVhdGVDYXJkKGNhcmQpKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHRoaXMuZGVjayA9IHRoaXMuc2h1ZmZsZShzdGFydERlY2spO1xyXG4gICAgfSxcclxuXHJcbiAgICAvL1RoaXMgcnVucyBvbiBnYW1lIHN0YXJ0LlxyXG4gICAgaW5pdDogZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgLy9JZiBhIGJyb3dzZXIgaGFzIGxvY2FsIGdhbWUgc3RvcmFnZSwgdGhhbiBsb2FkIHRoYXQgaW5zdGVhZCBvZiBjcmVhdGluZyBhIG5ldyBnYW1lLlxyXG4gICAgICAgIC8vIExPQ0FMIFNUT1JHQUUgQUJJTElUWSBIQVNOXCJUIEJFRU4gQlVJTFQgWUVULlxyXG4gICAgICAgIGlmIChsb2NhbFN0b3JhZ2UuZ2V0SXRlbSgnZWNtTWVtR2FtZScpKSB7XHJcbiAgICAgICAgICAgIGNvbnN0IGdhbWUgPSBsb2NhbFN0b3JhZ2UuZ2V0SXRlbSgnZWNtTWVtR2FtZScpO1xyXG4gICAgICAgICAgICB0aGlzLm1vdmVzID0gZ2FtZS5tb3ZlcztcclxuICAgICAgICAgICAgdGhpcy50aW1lID0gZ2FtZS50aW1lO1xyXG4gICAgICAgICAgICB0aGlzLnJlY29yZFRpbWUgPSBnYW1lLnJlY29yZFRpbWU7XHJcbiAgICAgICAgICAgIHRoaXMuY2FyZHMgPSBnYW1lLmNhcmRzO1xyXG4gICAgICAgICAgICB0aGlzLmRlY2sgPSBnYW1lLmRlY2s7XHJcbiAgICAgICAgICAgIHRoaXMuYWN0aXZlQ2FyZCA9IGdhbWUuYWN0aXZlQ2FyZFxyXG4gICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgIHRoaXMuY2FyZHMgPSBbXHJcbiAgICAgICAgICAgICAgICAnZGlhbW9uZCcsXHJcbiAgICAgICAgICAgICAgICAncGFwZXItcGxhbmUtbycsXHJcbiAgICAgICAgICAgICAgICAnYW5jaG9yJyxcclxuICAgICAgICAgICAgICAgICdib2x0JyxcclxuICAgICAgICAgICAgICAgICdjdWJlJyxcclxuICAgICAgICAgICAgICAgICdsZWFmJyxcclxuICAgICAgICAgICAgICAgICdiaWN5Y2xlJyxcclxuICAgICAgICAgICAgICAgICdib21iJ1xyXG4gICAgICAgICAgICBdO1xyXG4gICAgICAgICAgICB0aGlzLm1vdmVzID0gMztcclxuICAgICAgICAgICAgdGhpcy50aW1lID0gMDtcclxuICAgICAgICAgICAgdGhpcy5yZWNvcmRUaW1lID0gMDtcclxuICAgICAgICAgICAgdGhpcy5hY3RpdmVDYXJkID0gW251bGxdO1xyXG4gICAgICAgICAgICB0aGlzLmJ1aWxkRGVjaygpO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxufVxyXG5cclxuY29uc3QgVmlldyA9IHtcclxuXHJcbiAgICBnYW1lU3RhcnQ6IGZhbHNlLCAvL1VzZWQgdG8gc2VlIGlmIGdhbWUgaXMgb24gaXQncyBmaXJzdCBzdGFydCByb3VuZFxyXG5cclxuICAgIC8vSW5pdGlhbGl6YXRpb24gb2YgdGhlIGdhbWUgdmlldywgcGxhY2VzIGVsZW1lbnRzIGluIHRoZSBET00gJiBhZGRpbmcgZXZlbnQgbGlzdGVuZXJzLlxyXG4gICAgbG9zZVN0YXI6IGZ1bmN0aW9uKCkge1xyXG4gICAgICAgIGNvbnN0IHN0YXIgPSB0aGlzLnN0YXJzLnBvcCgpO1xyXG4gICAgICAgIHN0YXIucmVtb3ZlKCk7XHJcbiAgICB9LFxyXG5cclxuXHJcbiAgICAvL0hpZGUgY2FyZFxyXG4gICAgaGlkZUNhcmRzOiBmdW5jdGlvbiguLi5jYXJkcykge1xyXG4gICAgICAgIGZvciAodmFyIGNhcmQgb2YgY2FyZHMpIHtcclxuICAgICAgICAgICAgY2FyZC5jYXJkU2hvdyA9IGZhbHNlO1xyXG4gICAgICAgICAgICBjYXJkLmNsYXNzTGlzdC5yZW1vdmUoJ3Nob3cnKTtcclxuICAgICAgICAgICAgY2FyZC5jbGFzc0xpc3QucmVtb3ZlKCd3cm9uZycpO1xyXG4gICAgICAgICAgICBjYXJkLmNsYXNzTGlzdC5yZW1vdmUoJ21hdGNoJyk7XHJcbiAgICAgICAgfVxyXG4gICAgfSxcclxuXHJcbiAgICAvL1RoZSB3cm9uZyBwYWlyIG9mIGNhcmRzIGFyZSBzZWxlY3RlZCwgdGhlbiBydW4gdGhpcyBmdW5jdGlvblxyXG4gICAgd3JvbmdDYXJkczogZnVuY3Rpb24oY2FyZDEsY2FyZDIpIHtcclxuICAgICAgICBjYXJkMS5jbGFzc0xpc3QuYWRkKCd3cm9uZycpO1xyXG4gICAgICAgIGNhcmQyLmNsYXNzTGlzdC5hZGQoJ3dyb25nJyk7XHJcbiAgICB9LFxyXG5cclxuICAgIHNldE1hdGNoZWQ6IGZ1bmN0aW9uKGNhcmQxLCBjYXJkMikge1xyXG4gICAgICAgIGNhcmQxLmNsYXNzTGlzdC5hZGQoJ21hdGNoJyk7XHJcbiAgICAgICAgY2FyZDEubWF0Y2ggPSB0cnVlO1xyXG4gICAgICAgIGNhcmQyLmNsYXNzTGlzdC5hZGQoJ21hdGNoJyk7XHJcbiAgICAgICAgY2FyZDIubWF0Y2ggPSB0cnVlO1xyXG4gICAgICAgIE9jdG8ucmVzZXRBY3RpdmVDYXJkKCk7XHJcbiAgICB9LFxyXG5cclxuICAgIGluaXQ6IGZ1bmN0aW9uKCkge1xyXG4gICAgICAgIC8vQ2hlY2sgaWYgdGhpcyBpcyB0aGUgZ2FtZXMgZmlyc3Qgc3RhcnQsIGlmIHNvIGFzc2lnbiBFbGVtZW50cyB0byBWaWV3IHBhcmFtZXRlcnNcclxuICAgICAgICBpZiAoIXRoaXMuZ2FtZVN0YXJ0KSB7XHJcbiAgICAgICAgICAgIHRoaXMudGhlRGVjayA9IGRvY3VtZW50LmdldEVsZW1lbnRzQnlDbGFzc05hbWUoJ2RlY2snKVswXTtcclxuICAgICAgICAgICAgdGhpcy5yZXNldEJ1dHRvbiA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdyZXN0YXJ0Jyk7XHJcbiAgICAgICAgICAgIFxyXG4gICAgICAgICAgICB0aGlzLnJlc2V0QnV0dG9uLmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgICAgICAgICBPY3RvLnJlc2V0KCk7XHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgLy9SZXNldCB0aGUgZGVja1xyXG4gICAgICAgIHRoaXMudGhlRGVjay5pbm5lckhUTUwgPSBgYDtcclxuICAgICAgICB0aGlzLndyb25nU2V0ID0gZmFsc2U7XHJcblxyXG4gICAgICAgIGZvciAodmFyIGNhcmQgb2YgT2N0by5nZXREZWNrKCkpe1xyXG4gICAgICAgICAgICBjYXJkLmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgZnVuY3Rpb24oZSkge1xyXG4gICAgICAgICAgICAgICAgY29uc3QgZWwgPSBlLmN1cnJlbnRUYXJnZXQ7XHJcbiAgICAgICAgICAgICAgICBPY3RvLmNhcmRDaGVjayhlbCk7XHJcbiAgICAgICAgICAgIH0pOyBcclxuXHJcbiAgICAgICAgICAgIHRoaXMudGhlRGVjay5hcHBlbmRDaGlsZChjYXJkKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIC8vQ3JlYXRlIFN0YXJzXHJcbiAgICAgICAgZG9jdW1lbnQuZ2V0RWxlbWVudHNCeUNsYXNzTmFtZVswXS5pbm5lckhUTUwgPSBgYDtcclxuXHJcbiAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCBPY3RvLmdldE1vdmVzKCk7IGkrKykge1xyXG4gICAgICAgICAgICBjb25zdCBsSXRlbSA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2xpJyk7XHJcbiAgICAgICAgICAgIGNvbnN0IGljb24gPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdpJyk7XHJcbiAgICAgICAgICAgIGljb24uY2xhc3NOYW1lID0gYGZhIGZhLXN0YXJgO1xyXG4gICAgICAgICAgICBsSXRlbS5hcHBlbmRDaGlsZChpY29uKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIC8vU2V0IE1vdmVzIG51bWJlclxyXG4gICAgICAgIGRvY3VtZW50LmdldEVsZW1lbnRzQnlDbGFzc05hbWUoJ21vdmVzJylbMF0uaW5uZXJIVE1MID0gT2N0by5nZXRNb3ZlcygpO1xyXG4gICAgICAgIHRoaXMuZ2FtZVN0YXJ0ID0gdHJ1ZTtcclxuICAgIH1cclxufVxyXG5cclxuY29uc3QgT2N0byA9IHtcclxuXHJcbiAgICByZXNldE1vdmVzOiBmdW5jdGlvbigpIHtcclxuICAgICAgICBNb2RlbC5tb3ZlcyA9IDM7XHJcbiAgICB9LFxyXG5cclxuICAgIC8vUmV0dXJuIG1vdmVzXHJcbiAgICBsb3NlTW92ZTogZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgTW9kZWwubW92ZXMtLTtcclxuICAgIH0sXHJcblxyXG4gICAgLy9SZXR1cm4gbW92ZXNcclxuICAgIGdldE1vdmVzOiBmdW5jdGlvbigpIHtcclxuICAgICAgICByZXR1cm4gTW9kZWwubW92ZXM7XHJcbiAgICB9LFxyXG5cclxuICAgIC8vVXBkYXRlIFN0YXIgJiBtb3ZlIG51bWJlclxyXG4gICAgdXBkYXRlTW92ZXM6IGZ1bmN0aW9uKCkge1xyXG5cclxuICAgIH0sXHJcblxyXG4gICAgLy9yZXNldCBmbGlwcGVkIGNhcmRzIGFycmF5XHJcbiAgICByZXNldEFjdGl2ZUNhcmQ6IGZ1bmN0aW9uKCkge1xyXG4gICAgICAgIE1vZGVsLmFjdGl2ZUNhcmQgPSBbXTtcclxuICAgIH0sXHJcblxyXG4gICAgLy9TZXQgZmxpcHBlZCBjYXJkc1xyXG4gICAgc2V0QWN0aXZlQ2FyZDogZnVuY3Rpb24oY2FyZDEsY2FyZDIpIHtcclxuICAgICAgICBjYXJkMiA/IFxyXG4gICAgICAgICAgICBNb2RlbC5hY3RpdmVDYXJkID0gW2NhcmQxLGNhcmQyXVxyXG4gICAgICAgICAgICA6IE1vZGVsLmFjdGl2ZUNhcmQgPSBbY2FyZDFdO1xyXG4gICAgfSxcclxuXHJcbiAgICAvL0dldCBjdXJyZW50IGZsaXBwZWQgY2FyZFxyXG4gICAgZ2V0QWN0aXZlQ2FyZDogZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgcmV0dXJuIE1vZGVsLmFjdGl2ZUNhcmQ7XHJcbiAgICB9LFxyXG5cclxuICAgIC8vR2V0IHRoZSBjdXJyZW50IGFycmF5IG9mIGNhcmRzXHJcbiAgICBnZXREZWNrOiBmdW5jdGlvbigpIHtcclxuICAgICAgICByZXR1cm4gTW9kZWwuZGVjaztcclxuICAgIH0sXHJcblxyXG4gICAgLy9TZXQgdGhlIGN1cnJlbnQgZGVja1xyXG4gICAgc2V0RGVjazogZnVuY3Rpb24oZGVjaykge1xyXG4gICAgICAgIE1vZGVsLmRlY2sgPSBkZWNrO1xyXG4gICAgfSxcclxuXHJcbiAgICByZXNldERlY2s6IGZ1bmN0aW9uKCkge1xyXG4gICAgICAgIE1vZGVsLmJ1aWxkRGVjaygpO1xyXG4gICAgfSxcclxuXHJcbiAgICBzZXRXcm9uZzogZnVuY3Rpb24oY2FyZDEsY2FyZDIpIHtcclxuICAgICAgICBjb25zdCB0aGF0ID0gdGhpcztcclxuICAgICAgICB0aGF0Lndyb25nU2V0ID0gdHJ1ZTtcclxuXHJcbiAgICAgICAgc2V0VGltZW91dChmdW5jdGlvbigpIHtcclxuICAgICAgICAgICAgdGhhdC5oaWRlQ2FyZHMoY2FyZDEsY2FyZDIpO1xyXG4gICAgICAgICAgICBPY3RvLnJlc2V0QWN0aXZlQ2FyZCgpO1xyXG4gICAgICAgICAgICB0aGF0Lndyb25nU2V0ID0gZmFsc2U7XHJcbiAgICAgICAgfSwgMTIwMCk7XHJcblxyXG4gICAgICAgIHRoaXMubG9zZU1vdmUoKTtcclxuICAgICAgICBWaWV3Lmxvc2VTdGFyKCk7XHJcblxyXG4gICAgfSxcclxuXHJcbiAgICAvL0NoZWNrIHdoYXQgdGhlIGNhcmQgLyBjYXJkcyBhcmUgc2V0IGFzLCBhbmQgYWN0IGFjY29yZGluZ2x5LlxyXG4gICAgY2FyZENoZWNrOiBmdW5jdGlvbihjYXJkKSB7XHJcbiAgICAgICAgY29uc3QgYWN0aXZlQyA9IHRoaXMuZ2V0QWN0aXZlQ2FyZCgpO1xyXG5cclxuICAgICAgICBpZiAoIWNhcmQubWF0Y2ggJiYgdGhpcy5nZXRNb3ZlcygpICYmICFWaWV3Lndyb25nU2V0KSB7XHJcbiAgICAgICAgICAgIGlmIChjYXJkLmNhcmRTaG93KSB7XHJcbiAgICAgICAgICAgICAgICBWaWV3LmhpZGVDYXJkcyhjYXJkKTtcclxuICAgICAgICAgICAgICAgIHRoaXMuc2V0QWN0aXZlQ2FyZChudWxsKTtcclxuICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgIGlmIChhY3RpdmVDLmxlbmd0aCA8IDIpIHtcclxuICAgICAgICAgICAgICAgICAgICBjYXJkLmNhcmRTaG93ID0gdHJ1ZTtcclxuICAgICAgICAgICAgICAgICAgICBjYXJkLmNsYXNzTGlzdC5hZGQoJ3Nob3cnKTtcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgaWYgKGFjdGl2ZUNbMF0pIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5zZXRBY3RpdmVDYXJkKGFjdGl2ZUNbMF0sY2FyZCk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIFxyXG4gICAgICAgICAgICAgICAgICAgICAgICBjYXJkLmNhcmQgPT09IGFjdGl2ZUNbMF0uY2FyZCA/IFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgVmlldy5zZXRNYXRjaGVkKGNhcmQsYWN0aXZlQ1swXSlcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIDogVmlldy53cm9uZ0NhcmRzKGNhcmQsYWN0aXZlQ1swXSk7XHJcbiAgICAgICAgICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5zZXRBY3RpdmVDYXJkKGNhcmQpO1xyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICB9LFxyXG5cclxuICAgIHJlc2V0OiBmdW5jdGlvbigpIHtcclxuICAgICAgICB0aGlzLnJlc2V0TW92ZXMoKTtcclxuICAgICAgICB0aGlzLnJlc2V0RGVjaygpO1xyXG4gICAgICAgIFZpZXcuaW5pdCgpO1xyXG4gICAgfSxcclxuXHJcbiAgICBpbml0OiBmdW5jdGlvbigpIHtcclxuICAgICAgICBNb2RlbC5pbml0KCk7XHJcbiAgICAgICAgVmlldy5pbml0KCk7XHJcbiAgICB9XHJcbn1cclxuXHJcbk9jdG8uaW5pdCgpO1xyXG5cclxuIl19
