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

//testing clicking functionality
var cards = document.getElementsByClassName('card');

var _loop = function _loop() {
    var that = card;
    card.addEventListener('click', function (el) {
        console.log(el);
        that.classList.contains('show') ? that.classList.remove('show') : that.classList.add('show');
    });
};

var _iteratorNormalCompletion = true;
var _didIteratorError = false;
var _iteratorError = undefined;

try {
    for (var _iterator = cards[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
        var card = _step.value;

        _loop();
    }

    // MY ATTEMPT to build this in a MOV format

    // The model holds all the games data.
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

var Model = {

    //Builds out the card deck elements into an easy to access array
    buildDeck: function buildDeck() {
        var startDeck = [];

        function createCard(card) {
            var baseCard = document.createElement('li');
            baseCard.className = 'card';
            baseCard.dataset.item = card;
            baseCard.subEl = document.createElement('i');
            baseCard.subEl.className = 'fa fa-' + card;
            baseCard.appendChild(baseCard.subEl);
            return baseCard;
        }

        // Shuffle function from http://stackoverflow.com/a/2450976
        function shuffle(array) {
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
        }

        var _iteratorNormalCompletion2 = true;
        var _didIteratorError2 = false;
        var _iteratorError2 = undefined;

        try {
            for (var _iterator2 = this.cards[Symbol.iterator](), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
                var card = _step2.value;

                startDeck.push(createCard(card));
                startDeck.push(createCard(card));
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

        this.deck = shuffle(startDeck);
    },

    //This runs on game start.
    init: function init() {
        if (localStorage.getItem('ecmMemGame')) {
            var game = localStorage.getItem('ecmMemGame');
            this.moves = game.moves;
            this.time = game.time;
            this.recordTime = game.recordTime;
            this.cards = game.cards;
            this.deck = game.deck;
        } else {
            this.cards = ['diamond', 'paper-plane-o', 'anchor', 'bolt', 'cube', 'leaf', 'bicycle', 'bomb'];

            this.buildDeck();
        }
    }
};

var View = {
    init: function init() {
        this.theDeck = document.getElementsByClassName('deck')[0];
        this.theDeck.innerHTML = '';
        var _iteratorNormalCompletion3 = true;
        var _didIteratorError3 = false;
        var _iteratorError3 = undefined;

        try {
            for (var _iterator3 = Octo.getDeck()[Symbol.iterator](), _step3; !(_iteratorNormalCompletion3 = (_step3 = _iterator3.next()).done); _iteratorNormalCompletion3 = true) {
                var card = _step3.value;

                card.addEventListener('click', function (el) {
                    el.target.classList.contains('show') ? el.target.classList.remove('show') : el.target.classList.add('show');
                });
                this.theDeck.appendChild(card);
            }
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
    }
};

var Octo = {

    getDeck: function getDeck() {
        return Model.deck;
    },

    setDeck: function setDeck(deck) {
        Model.deck = deck;
    },

    init: function init() {
        Model.init();
        View.init();
    }
};

Octo.init();

/*
 * set up the event listener for a card. If a card is clicked:
 *  - display the card's symbol (put this functionality in another function that you call from this one)
 *  - add the card to a *list* of "open" cards (put this functionality in another function that you call from this one)
 *  - if the list already has another card, check to see if the two cards match
 *    + if the cards do match, lock the cards in the open position (put this functionality in another function that you call from this one)
 *    + if the cards do not match, remove the cards from the list and hide the card's symbol (put this functionality in another function that you call from this one)
 *    + increment the move counter and display it on the page (put this functionality in another function that you call from this one)
 *    + if all cards have matched, display a message with the final score (put this functionality in another function that you call from this one)
 */
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImFwcC5qcyJdLCJuYW1lcyI6WyJjYXJkcyIsImRvY3VtZW50IiwiZ2V0RWxlbWVudHNCeUNsYXNzTmFtZSIsInRoYXQiLCJjYXJkIiwiYWRkRXZlbnRMaXN0ZW5lciIsImVsIiwiY29uc29sZSIsImxvZyIsImNsYXNzTGlzdCIsImNvbnRhaW5zIiwicmVtb3ZlIiwiYWRkIiwiTW9kZWwiLCJidWlsZERlY2siLCJzdGFydERlY2siLCJjcmVhdGVDYXJkIiwiYmFzZUNhcmQiLCJjcmVhdGVFbGVtZW50IiwiY2xhc3NOYW1lIiwiZGF0YXNldCIsIml0ZW0iLCJzdWJFbCIsImFwcGVuZENoaWxkIiwic2h1ZmZsZSIsImFycmF5IiwiY3VycmVudEluZGV4IiwibGVuZ3RoIiwidGVtcG9yYXJ5VmFsdWUiLCJyYW5kb21JbmRleCIsIk1hdGgiLCJmbG9vciIsInJhbmRvbSIsInB1c2giLCJkZWNrIiwiaW5pdCIsImxvY2FsU3RvcmFnZSIsImdldEl0ZW0iLCJnYW1lIiwibW92ZXMiLCJ0aW1lIiwicmVjb3JkVGltZSIsIlZpZXciLCJ0aGVEZWNrIiwiaW5uZXJIVE1MIiwiT2N0byIsImdldERlY2siLCJ0YXJnZXQiLCJzZXREZWNrIl0sIm1hcHBpbmdzIjoiOztBQUFBOzs7O0FBS0E7Ozs7Ozs7QUFVQTtBQUNBLElBQU1BLFFBQVFDLFNBQVNDLHNCQUFULENBQWdDLE1BQWhDLENBQWQ7OztBQUdJLFFBQUlDLE9BQU9DLElBQVg7QUFDQUEsU0FBS0MsZ0JBQUwsQ0FBc0IsT0FBdEIsRUFBK0IsVUFBU0MsRUFBVCxFQUFhO0FBQ3hDQyxnQkFBUUMsR0FBUixDQUFZRixFQUFaO0FBQ0FILGFBQUtNLFNBQUwsQ0FBZUMsUUFBZixDQUF3QixNQUF4QixJQUNJUCxLQUFLTSxTQUFMLENBQWVFLE1BQWYsQ0FBc0IsTUFBdEIsQ0FESixHQUVNUixLQUFLTSxTQUFMLENBQWVHLEdBQWYsQ0FBbUIsTUFBbkIsQ0FGTjtBQUdILEtBTEQ7Ozs7Ozs7O0FBRkoseUJBQWlCWixLQUFq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LE9BQXRCLEVBQStCLFVBQVNDLEVBQVQsRUFBYTtBQUN4Q0EsdUJBQUd5QyxNQUFILENBQVV0QyxTQUFWLENBQW9CQyxRQUFwQixDQUE2QixNQUE3QixJQUNJSixHQUFHeUMsTUFBSCxDQUFVdEMsU0FBVixDQUFvQkUsTUFBcEIsQ0FBMkIsTUFBM0IsQ0FESixHQUVNTCxHQUFHeUMsTUFBSCxDQUFVdEMsU0FBVixDQUFvQkcsR0FBcEIsQ0FBd0IsTUFBeEIsQ0FGTjtBQUdILGlCQUpEO0FBS0EscUJBQUsrQixPQUFMLENBQWFwQixXQUFiLENBQXlCbkIsSUFBekI7QUFDSDtBQVZZO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFjaEI7QUFmUSxDQUFiOztBQWtCQSxJQUFNeUMsT0FBTzs7QUFFVEMsYUFBUyxtQkFBVztBQUNoQixlQUFPakMsTUFBTXFCLElBQWI7QUFDSCxLQUpROztBQU1UYyxhQUFTLGlCQUFTZCxJQUFULEVBQWU7QUFDcEJyQixjQUFNcUIsSUFBTixHQUFhQSxJQUFiO0FBQ0gsS0FSUTs7QUFVVEMsVUFBTSxnQkFBVztBQUNidEIsY0FBTXNCLElBQU47QUFDQU8sYUFBS1AsSUFBTDtBQUNIO0FBYlEsQ0FBYjs7QUFnQkFVLEtBQUtWLElBQUw7O0FBRUEiLCJmaWxlIjoiYWxsLmpzIiwic291cmNlc0NvbnRlbnQiOlsiLypcclxuICogQ3JlYXRlIGEgbGlzdCB0aGF0IGhvbGRzIGFsbCBvZiB5b3VyIGNhcmRzXHJcbiAqL1xyXG5cclxuXHJcbi8qXHJcbiAqIERpc3BsYXkgdGhlIGNhcmRzIG9uIHRoZSBwYWdlXHJcbiAqICAgLSBzaHVmZmxlIHRoZSBsaXN0IG9mIGNhcmRzIHVzaW5nIHRoZSBwcm92aWRlZCBcInNodWZmbGVcIiBtZXRob2QgYmVsb3dcclxuICogICAtIGxvb3AgdGhyb3VnaCBlYWNoIGNhcmQgYW5kIGNyZWF0ZSBpdHMgSFRNTFxyXG4gKiAgIC0gYWRkIGVhY2ggY2FyZCdzIEhUTUwgdG8gdGhlIHBhZ2VcclxuICovXHJcblxyXG5cclxuXHJcblxyXG4vL3Rlc3RpbmcgY2xpY2tpbmcgZnVuY3Rpb25hbGl0eVxyXG5jb25zdCBjYXJkcyA9IGRvY3VtZW50LmdldEVsZW1lbnRzQnlDbGFzc05hbWUoJ2NhcmQnKTtcclxuXHJcbmZvciAodmFyIGNhcmQgb2YgY2FyZHMpIHtcclxuICAgIGxldCB0aGF0ID0gY2FyZFxyXG4gICAgY2FyZC5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsIGZ1bmN0aW9uKGVsKSB7XHJcbiAgICAgICAgY29uc29sZS5sb2coZWwpXHJcbiAgICAgICAgdGhhdC5jbGFzc0xpc3QuY29udGFpbnMoJ3Nob3cnKSA/IFxyXG4gICAgICAgICAgICB0aGF0LmNsYXNzTGlzdC5yZW1vdmUoJ3Nob3cnKSBcclxuICAgICAgICAgICAgOiB0aGF0LmNsYXNzTGlzdC5hZGQoJ3Nob3cnKTtcclxuICAgIH0pOyBcclxufVxyXG5cclxuXHJcblxyXG4vLyBNWSBBVFRFTVBUIHRvIGJ1aWxkIHRoaXMgaW4gYSBNT1YgZm9ybWF0XHJcblxyXG4vLyBUaGUgbW9kZWwgaG9sZHMgYWxsIHRoZSBnYW1lcyBkYXRhLlxyXG5cclxuY29uc3QgTW9kZWwgPSB7XHJcblxyXG4gICAgLy9CdWlsZHMgb3V0IHRoZSBjYXJkIGRlY2sgZWxlbWVudHMgaW50byBhbiBlYXN5IHRvIGFjY2VzcyBhcnJheVxyXG4gICAgYnVpbGREZWNrOiBmdW5jdGlvbigpIHtcclxuICAgICAgICBsZXQgc3RhcnREZWNrID0gW107XHJcblxyXG4gICAgICAgIGZ1bmN0aW9uIGNyZWF0ZUNhcmQoY2FyZCkge1xyXG4gICAgICAgICAgICBjb25zdCBiYXNlQ2FyZCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2xpJyk7XHJcbiAgICAgICAgICAgIGJhc2VDYXJkLmNsYXNzTmFtZSA9ICdjYXJkJztcclxuICAgICAgICAgICAgYmFzZUNhcmQuZGF0YXNldC5pdGVtID0gY2FyZDtcclxuICAgICAgICAgICAgYmFzZUNhcmQuc3ViRWwgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdpJyk7XHJcbiAgICAgICAgICAgIGJhc2VDYXJkLnN1YkVsLmNsYXNzTmFtZSA9ICdmYSBmYS0nICsgY2FyZDtcclxuICAgICAgICAgICAgYmFzZUNhcmQuYXBwZW5kQ2hpbGQoYmFzZUNhcmQuc3ViRWwpO1xyXG4gICAgICAgICAgICByZXR1cm4gYmFzZUNhcmRcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIC8vIFNodWZmbGUgZnVuY3Rpb24gZnJvbSBodHRwOi8vc3RhY2tvdmVyZmxvdy5jb20vYS8yNDUwOTc2XHJcbiAgICAgICAgZnVuY3Rpb24gc2h1ZmZsZShhcnJheSkge1xyXG4gICAgICAgICAgICB2YXIgY3VycmVudEluZGV4ID0gYXJyYXkubGVuZ3RoLCB0ZW1wb3JhcnlWYWx1ZSwgcmFuZG9tSW5kZXg7XHJcblxyXG4gICAgICAgICAgICB3aGlsZSAoY3VycmVudEluZGV4ICE9PSAwKSB7XHJcbiAgICAgICAgICAgICAgICByYW5kb21JbmRleCA9IE1hdGguZmxvb3IoTWF0aC5yYW5kb20oKSAqIGN1cnJlbnRJbmRleCk7XHJcbiAgICAgICAgICAgICAgICBjdXJyZW50SW5kZXggLT0gMTtcclxuICAgICAgICAgICAgICAgIHRlbXBvcmFyeVZhbHVlID0gYXJyYXlbY3VycmVudEluZGV4XTtcclxuICAgICAgICAgICAgICAgIGFycmF5W2N1cnJlbnRJbmRleF0gPSBhcnJheVtyYW5kb21JbmRleF07XHJcbiAgICAgICAgICAgICAgICBhcnJheVtyYW5kb21JbmRleF0gPSB0ZW1wb3JhcnlWYWx1ZTtcclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgcmV0dXJuIGFycmF5O1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgZm9yICh2YXIgY2FyZCBvZiB0aGlzLmNhcmRzKSB7XHJcbiAgICAgICAgICAgIHN0YXJ0RGVjay5wdXNoKGNyZWF0ZUNhcmQoY2FyZCkpO1xyXG4gICAgICAgICAgICBzdGFydERlY2sucHVzaChjcmVhdGVDYXJkKGNhcmQpKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHRoaXMuZGVjayA9IHNodWZmbGUoc3RhcnREZWNrKTtcclxuICAgIH0sXHJcblxyXG4gICAgLy9UaGlzIHJ1bnMgb24gZ2FtZSBzdGFydC5cclxuICAgIGluaXQ6IGZ1bmN0aW9uKCkge1xyXG4gICAgICAgIGlmIChsb2NhbFN0b3JhZ2UuZ2V0SXRlbSgnZWNtTWVtR2FtZScpKSB7XHJcbiAgICAgICAgICAgIGNvbnN0IGdhbWUgPSBsb2NhbFN0b3JhZ2UuZ2V0SXRlbSgnZWNtTWVtR2FtZScpO1xyXG4gICAgICAgICAgICB0aGlzLm1vdmVzID0gZ2FtZS5tb3ZlcztcclxuICAgICAgICAgICAgdGhpcy50aW1lID0gZ2FtZS50aW1lO1xyXG4gICAgICAgICAgICB0aGlzLnJlY29yZFRpbWUgPSBnYW1lLnJlY29yZFRpbWU7XHJcbiAgICAgICAgICAgIHRoaXMuY2FyZHMgPSBnYW1lLmNhcmRzO1xyXG4gICAgICAgICAgICB0aGlzLmRlY2sgPSBnYW1lLmRlY2s7XHJcbiAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgdGhpcy5jYXJkcyA9IFtcclxuICAgICAgICAgICAgICAgICdkaWFtb25kJyxcclxuICAgICAgICAgICAgICAgICdwYXBlci1wbGFuZS1vJyxcclxuICAgICAgICAgICAgICAgICdhbmNob3InLFxyXG4gICAgICAgICAgICAgICAgJ2JvbHQnLFxyXG4gICAgICAgICAgICAgICAgJ2N1YmUnLFxyXG4gICAgICAgICAgICAgICAgJ2xlYWYnLFxyXG4gICAgICAgICAgICAgICAgJ2JpY3ljbGUnLFxyXG4gICAgICAgICAgICAgICAgJ2JvbWInXHJcbiAgICAgICAgICAgIF07XHJcblxyXG4gICAgICAgICAgICB0aGlzLmJ1aWxkRGVjaygpO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxufVxyXG5cclxuY29uc3QgVmlldyA9IHtcclxuICAgIGluaXQ6IGZ1bmN0aW9uKCkge1xyXG4gICAgICAgIHRoaXMudGhlRGVjayA9IGRvY3VtZW50LmdldEVsZW1lbnRzQnlDbGFzc05hbWUoJ2RlY2snKVswXTtcclxuICAgICAgICB0aGlzLnRoZURlY2suaW5uZXJIVE1MID0gJyc7XHJcbiAgICAgICAgZm9yICh2YXIgY2FyZCBvZiBPY3RvLmdldERlY2soKSl7XHJcbiAgICAgICAgICAgIGNhcmQuYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCBmdW5jdGlvbihlbCkge1xyXG4gICAgICAgICAgICAgICAgZWwudGFyZ2V0LmNsYXNzTGlzdC5jb250YWlucygnc2hvdycpID8gXHJcbiAgICAgICAgICAgICAgICAgICAgZWwudGFyZ2V0LmNsYXNzTGlzdC5yZW1vdmUoJ3Nob3cnKSBcclxuICAgICAgICAgICAgICAgICAgICA6IGVsLnRhcmdldC5jbGFzc0xpc3QuYWRkKCdzaG93Jyk7XHJcbiAgICAgICAgICAgIH0pOyBcclxuICAgICAgICAgICAgdGhpcy50aGVEZWNrLmFwcGVuZENoaWxkKGNhcmQpO1xyXG4gICAgICAgIH1cclxuXHJcblxyXG5cclxuICAgIH1cclxufVxyXG5cclxuY29uc3QgT2N0byA9IHtcclxuXHJcbiAgICBnZXREZWNrOiBmdW5jdGlvbigpIHtcclxuICAgICAgICByZXR1cm4gTW9kZWwuZGVjaztcclxuICAgIH0sXHJcblxyXG4gICAgc2V0RGVjazogZnVuY3Rpb24oZGVjaykge1xyXG4gICAgICAgIE1vZGVsLmRlY2sgPSBkZWNrO1xyXG4gICAgfSxcclxuXHJcbiAgICBpbml0OiBmdW5jdGlvbigpIHtcclxuICAgICAgICBNb2RlbC5pbml0KCk7XHJcbiAgICAgICAgVmlldy5pbml0KCk7XHJcbiAgICB9XHJcbn1cclxuXHJcbk9jdG8uaW5pdCgpO1xyXG5cclxuLypcclxuICogc2V0IHVwIHRoZSBldmVudCBsaXN0ZW5lciBmb3IgYSBjYXJkLiBJZiBhIGNhcmQgaXMgY2xpY2tlZDpcclxuICogIC0gZGlzcGxheSB0aGUgY2FyZCdzIHN5bWJvbCAocHV0IHRoaXMgZnVuY3Rpb25hbGl0eSBpbiBhbm90aGVyIGZ1bmN0aW9uIHRoYXQgeW91IGNhbGwgZnJvbSB0aGlzIG9uZSlcclxuICogIC0gYWRkIHRoZSBjYXJkIHRvIGEgKmxpc3QqIG9mIFwib3BlblwiIGNhcmRzIChwdXQgdGhpcyBmdW5jdGlvbmFsaXR5IGluIGFub3RoZXIgZnVuY3Rpb24gdGhhdCB5b3UgY2FsbCBmcm9tIHRoaXMgb25lKVxyXG4gKiAgLSBpZiB0aGUgbGlzdCBhbHJlYWR5IGhhcyBhbm90aGVyIGNhcmQsIGNoZWNrIHRvIHNlZSBpZiB0aGUgdHdvIGNhcmRzIG1hdGNoXHJcbiAqICAgICsgaWYgdGhlIGNhcmRzIGRvIG1hdGNoLCBsb2NrIHRoZSBjYXJkcyBpbiB0aGUgb3BlbiBwb3NpdGlvbiAocHV0IHRoaXMgZnVuY3Rpb25hbGl0eSBpbiBhbm90aGVyIGZ1bmN0aW9uIHRoYXQgeW91IGNhbGwgZnJvbSB0aGlzIG9uZSlcclxuICogICAgKyBpZiB0aGUgY2FyZHMgZG8gbm90IG1hdGNoLCByZW1vdmUgdGhlIGNhcmRzIGZyb20gdGhlIGxpc3QgYW5kIGhpZGUgdGhlIGNhcmQncyBzeW1ib2wgKHB1dCB0aGlzIGZ1bmN0aW9uYWxpdHkgaW4gYW5vdGhlciBmdW5jdGlvbiB0aGF0IHlvdSBjYWxsIGZyb20gdGhpcyBvbmUpXHJcbiAqICAgICsgaW5jcmVtZW50IHRoZSBtb3ZlIGNvdW50ZXIgYW5kIGRpc3BsYXkgaXQgb24gdGhlIHBhZ2UgKHB1dCB0aGlzIGZ1bmN0aW9uYWxpdHkgaW4gYW5vdGhlciBmdW5jdGlvbiB0aGF0IHlvdSBjYWxsIGZyb20gdGhpcyBvbmUpXHJcbiAqICAgICsgaWYgYWxsIGNhcmRzIGhhdmUgbWF0Y2hlZCwgZGlzcGxheSBhIG1lc3NhZ2Ugd2l0aCB0aGUgZmluYWwgc2NvcmUgKHB1dCB0aGlzIGZ1bmN0aW9uYWxpdHkgaW4gYW5vdGhlciBmdW5jdGlvbiB0aGF0IHlvdSBjYWxsIGZyb20gdGhpcyBvbmUpXHJcbiAqL1xyXG4iXX0=
