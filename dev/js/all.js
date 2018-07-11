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
    //Initialization of the game view, places elements in the DOM & adding event listeners.
    init: function init() {
        this.theDeck = document.getElementsByClassName('deck')[0];
        this.theDeck.innerHTML = '';

        var _iteratorNormalCompletion3 = true;
        var _didIteratorError3 = false;
        var _iteratorError3 = undefined;

        try {
            for (var _iterator3 = Octo.getDeck()[Symbol.iterator](), _step3; !(_iteratorNormalCompletion3 = (_step3 = _iterator3.next()).done); _iteratorNormalCompletion3 = true) {
                var card = _step3.value;

                card.addEventListener('click', function (e) {
                    var el = e.target;
                    if (!el.classList.contains('match')) {
                        el.classList.contains('show') ? el.classList.remove('show') : el.classList.add('show');
                    }
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
    //Get the current array of cards
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
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImFwcC5qcyJdLCJuYW1lcyI6WyJjYXJkcyIsImRvY3VtZW50IiwiZ2V0RWxlbWVudHNCeUNsYXNzTmFtZSIsInRoYXQiLCJjYXJkIiwiYWRkRXZlbnRMaXN0ZW5lciIsImVsIiwiY29uc29sZSIsImxvZyIsImNsYXNzTGlzdCIsImNvbnRhaW5zIiwicmVtb3ZlIiwiYWRkIiwiTW9kZWwiLCJidWlsZERlY2siLCJzdGFydERlY2siLCJjcmVhdGVDYXJkIiwiYmFzZUNhcmQiLCJjcmVhdGVFbGVtZW50IiwiY2xhc3NOYW1lIiwiZGF0YXNldCIsIml0ZW0iLCJzdWJFbCIsImFwcGVuZENoaWxkIiwic2h1ZmZsZSIsImFycmF5IiwiY3VycmVudEluZGV4IiwibGVuZ3RoIiwidGVtcG9yYXJ5VmFsdWUiLCJyYW5kb21JbmRleCIsIk1hdGgiLCJmbG9vciIsInJhbmRvbSIsInB1c2giLCJkZWNrIiwiaW5pdCIsImxvY2FsU3RvcmFnZSIsImdldEl0ZW0iLCJnYW1lIiwibW92ZXMiLCJ0aW1lIiwicmVjb3JkVGltZSIsIlZpZXciLCJ0aGVEZWNrIiwiaW5uZXJIVE1MIiwiT2N0byIsImdldERlY2siLCJlIiwidGFyZ2V0Iiwic2V0RGVjayJdLCJtYXBwaW5ncyI6Ijs7QUFBQTs7OztBQUtBOzs7Ozs7O0FBVUE7QUFDQSxJQUFNQSxRQUFRQyxTQUFTQyxzQkFBVCxDQUFnQyxNQUFoQyxDQUFkOzs7QUFHSSxRQUFJQyxPQUFPQyxJQUFYO0FBQ0FBLFNBQUtDLGdCQUFMLENBQXNCLE9BQXRCLEVBQStCLFVBQVNDLEVBQVQsRUFBYTtBQUN4Q0MsZ0JBQVFDLEdBQVIsQ0FBWUYsRUFBWjtBQUNBSCxhQUFLTSxTQUFMLENBQWVDLFFBQWYsQ0FBd0IsTUFBeEIsSUFDSVAsS0FBS00sU0FBTCxDQUFlRSxNQUFmLENBQXNCLE1BQXRCLENBREosR0FFTVIsS0FBS00sU0FBTCxDQUFlRyxHQUFmLENBQW1CLE1BQW5CLENBRk47QUFHSCxLQUxEOzs7Ozs7OztBQUZKLHlCQUFpQlos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QkFBTCxDQUFzQixPQUF0QixFQUErQixVQUFTMEMsQ0FBVCxFQUFZO0FBQ3ZDLHdCQUFNekMsS0FBS3lDLEVBQUVDLE1BQWI7QUFDQSx3QkFBSSxDQUFDMUMsR0FBR0csU0FBSCxDQUFhQyxRQUFiLENBQXNCLE9BQXRCLENBQUwsRUFBb0M7QUFDaENKLDJCQUFHRyxTQUFILENBQWFDLFFBQWIsQ0FBc0IsTUFBdEIsSUFDSUosR0FBR0csU0FBSCxDQUFhRSxNQUFiLENBQW9CLE1BQXBCLENBREosR0FFTUwsR0FBR0csU0FBSCxDQUFhRyxHQUFiLENBQWlCLE1BQWpCLENBRk47QUFHSDtBQUNKLGlCQVBEO0FBUUEscUJBQUsrQixPQUFMLENBQWFwQixXQUFiLENBQXlCbkIsSUFBekI7QUFDSDtBQWRZO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFlaEI7QUFqQlEsQ0FBYjs7QUFvQkEsSUFBTXlDLE9BQU87QUFDVDtBQUNBQyxhQUFTLG1CQUFXO0FBQ2hCLGVBQU9qQyxNQUFNcUIsSUFBYjtBQUNILEtBSlE7O0FBTVRlLGFBQVMsaUJBQVNmLElBQVQsRUFBZTtBQUNwQnJCLGNBQU1xQixJQUFOLEdBQWFBLElBQWI7QUFDSCxLQVJROztBQVVUQyxVQUFNLGdCQUFXO0FBQ2J0QixjQUFNc0IsSUFBTjtBQUNBTyxhQUFLUCxJQUFMO0FBQ0g7QUFiUSxDQUFiOztBQWdCQVUsS0FBS1YsSUFBTDs7QUFFQSIsImZpbGUiOiJhbGwuanMiLCJzb3VyY2VzQ29udGVudCI6WyIvKlxyXG4gKiBDcmVhdGUgYSBsaXN0IHRoYXQgaG9sZHMgYWxsIG9mIHlvdXIgY2FyZHNcclxuICovXHJcblxyXG5cclxuLypcclxuICogRGlzcGxheSB0aGUgY2FyZHMgb24gdGhlIHBhZ2VcclxuICogICAtIHNodWZmbGUgdGhlIGxpc3Qgb2YgY2FyZHMgdXNpbmcgdGhlIHByb3ZpZGVkIFwic2h1ZmZsZVwiIG1ldGhvZCBiZWxvd1xyXG4gKiAgIC0gbG9vcCB0aHJvdWdoIGVhY2ggY2FyZCBhbmQgY3JlYXRlIGl0cyBIVE1MXHJcbiAqICAgLSBhZGQgZWFjaCBjYXJkJ3MgSFRNTCB0byB0aGUgcGFnZVxyXG4gKi9cclxuXHJcblxyXG5cclxuXHJcbi8vdGVzdGluZyBjbGlja2luZyBmdW5jdGlvbmFsaXR5XHJcbmNvbnN0IGNhcmRzID0gZG9jdW1lbnQuZ2V0RWxlbWVudHNCeUNsYXNzTmFtZSgnY2FyZCcpO1xyXG5cclxuZm9yICh2YXIgY2FyZCBvZiBjYXJkcykge1xyXG4gICAgbGV0IHRoYXQgPSBjYXJkXHJcbiAgICBjYXJkLmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgZnVuY3Rpb24oZWwpIHtcclxuICAgICAgICBjb25zb2xlLmxvZyhlbClcclxuICAgICAgICB0aGF0LmNsYXNzTGlzdC5jb250YWlucygnc2hvdycpID8gXHJcbiAgICAgICAgICAgIHRoYXQuY2xhc3NMaXN0LnJlbW92ZSgnc2hvdycpIFxyXG4gICAgICAgICAgICA6IHRoYXQuY2xhc3NMaXN0LmFkZCgnc2hvdycpO1xyXG4gICAgfSk7IFxyXG59XHJcblxyXG5cclxuXHJcbi8vIE1ZIEFUVEVNUFQgdG8gYnVpbGQgdGhpcyBpbiBhIE1PViBmb3JtYXRcclxuXHJcbi8vIFRoZSBtb2RlbCBob2xkcyBhbGwgdGhlIGdhbWVzIGRhdGEuXHJcblxyXG5jb25zdCBNb2RlbCA9IHtcclxuXHJcbiAgICAvL0J1aWxkcyBvdXQgdGhlIGNhcmQgZGVjayBlbGVtZW50cyBpbnRvIGFuIGVhc3kgdG8gYWNjZXNzIGFycmF5XHJcbiAgICBidWlsZERlY2s6IGZ1bmN0aW9uKCkge1xyXG4gICAgICAgIGxldCBzdGFydERlY2sgPSBbXTtcclxuXHJcbiAgICAgICAgZnVuY3Rpb24gY3JlYXRlQ2FyZChjYXJkKSB7XHJcbiAgICAgICAgICAgIGNvbnN0IGJhc2VDYXJkID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnbGknKTtcclxuICAgICAgICAgICAgYmFzZUNhcmQuY2xhc3NOYW1lID0gJ2NhcmQnO1xyXG4gICAgICAgICAgICBiYXNlQ2FyZC5kYXRhc2V0Lml0ZW0gPSBjYXJkO1xyXG4gICAgICAgICAgICBiYXNlQ2FyZC5zdWJFbCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2knKTtcclxuICAgICAgICAgICAgYmFzZUNhcmQuc3ViRWwuY2xhc3NOYW1lID0gJ2ZhIGZhLScgKyBjYXJkO1xyXG4gICAgICAgICAgICBiYXNlQ2FyZC5hcHBlbmRDaGlsZChiYXNlQ2FyZC5zdWJFbCk7XHJcbiAgICAgICAgICAgIHJldHVybiBiYXNlQ2FyZFxyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgLy8gU2h1ZmZsZSBmdW5jdGlvbiBmcm9tIGh0dHA6Ly9zdGFja292ZXJmbG93LmNvbS9hLzI0NTA5NzZcclxuICAgICAgICBmdW5jdGlvbiBzaHVmZmxlKGFycmF5KSB7XHJcbiAgICAgICAgICAgIHZhciBjdXJyZW50SW5kZXggPSBhcnJheS5sZW5ndGgsIHRlbXBvcmFyeVZhbHVlLCByYW5kb21JbmRleDtcclxuXHJcbiAgICAgICAgICAgIHdoaWxlIChjdXJyZW50SW5kZXggIT09IDApIHtcclxuICAgICAgICAgICAgICAgIHJhbmRvbUluZGV4ID0gTWF0aC5mbG9vcihNYXRoLnJhbmRvbSgpICogY3VycmVudEluZGV4KTtcclxuICAgICAgICAgICAgICAgIGN1cnJlbnRJbmRleCAtPSAxO1xyXG4gICAgICAgICAgICAgICAgdGVtcG9yYXJ5VmFsdWUgPSBhcnJheVtjdXJyZW50SW5kZXhdO1xyXG4gICAgICAgICAgICAgICAgYXJyYXlbY3VycmVudEluZGV4XSA9IGFycmF5W3JhbmRvbUluZGV4XTtcclxuICAgICAgICAgICAgICAgIGFycmF5W3JhbmRvbUluZGV4XSA9IHRlbXBvcmFyeVZhbHVlO1xyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICByZXR1cm4gYXJyYXk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBmb3IgKHZhciBjYXJkIG9mIHRoaXMuY2FyZHMpIHtcclxuICAgICAgICAgICAgc3RhcnREZWNrLnB1c2goY3JlYXRlQ2FyZChjYXJkKSk7XHJcbiAgICAgICAgICAgIHN0YXJ0RGVjay5wdXNoKGNyZWF0ZUNhcmQoY2FyZCkpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgdGhpcy5kZWNrID0gc2h1ZmZsZShzdGFydERlY2spO1xyXG4gICAgfSxcclxuXHJcbiAgICAvL1RoaXMgcnVucyBvbiBnYW1lIHN0YXJ0LlxyXG4gICAgaW5pdDogZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgaWYgKGxvY2FsU3RvcmFnZS5nZXRJdGVtKCdlY21NZW1HYW1lJykpIHtcclxuICAgICAgICAgICAgY29uc3QgZ2FtZSA9IGxvY2FsU3RvcmFnZS5nZXRJdGVtKCdlY21NZW1HYW1lJyk7XHJcbiAgICAgICAgICAgIHRoaXMubW92ZXMgPSBnYW1lLm1vdmVzO1xyXG4gICAgICAgICAgICB0aGlzLnRpbWUgPSBnYW1lLnRpbWU7XHJcbiAgICAgICAgICAgIHRoaXMucmVjb3JkVGltZSA9IGdhbWUucmVjb3JkVGltZTtcclxuICAgICAgICAgICAgdGhpcy5jYXJkcyA9IGdhbWUuY2FyZHM7XHJcbiAgICAgICAgICAgIHRoaXMuZGVjayA9IGdhbWUuZGVjaztcclxuICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICB0aGlzLmNhcmRzID0gW1xyXG4gICAgICAgICAgICAgICAgJ2RpYW1vbmQnLFxyXG4gICAgICAgICAgICAgICAgJ3BhcGVyLXBsYW5lLW8nLFxyXG4gICAgICAgICAgICAgICAgJ2FuY2hvcicsXHJcbiAgICAgICAgICAgICAgICAnYm9sdCcsXHJcbiAgICAgICAgICAgICAgICAnY3ViZScsXHJcbiAgICAgICAgICAgICAgICAnbGVhZicsXHJcbiAgICAgICAgICAgICAgICAnYmljeWNsZScsXHJcbiAgICAgICAgICAgICAgICAnYm9tYidcclxuICAgICAgICAgICAgXTtcclxuXHJcbiAgICAgICAgICAgIHRoaXMuYnVpbGREZWNrKCk7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG59XHJcblxyXG5jb25zdCBWaWV3ID0ge1xyXG4gICAgLy9Jbml0aWFsaXphdGlvbiBvZiB0aGUgZ2FtZSB2aWV3LCBwbGFjZXMgZWxlbWVudHMgaW4gdGhlIERPTSAmIGFkZGluZyBldmVudCBsaXN0ZW5lcnMuXHJcbiAgICBpbml0OiBmdW5jdGlvbigpIHtcclxuICAgICAgICB0aGlzLnRoZURlY2sgPSBkb2N1bWVudC5nZXRFbGVtZW50c0J5Q2xhc3NOYW1lKCdkZWNrJylbMF07XHJcbiAgICAgICAgdGhpcy50aGVEZWNrLmlubmVySFRNTCA9ICcnO1xyXG5cclxuICAgICAgICBmb3IgKHZhciBjYXJkIG9mIE9jdG8uZ2V0RGVjaygpKXtcclxuICAgICAgICAgICAgY2FyZC5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsIGZ1bmN0aW9uKGUpIHtcclxuICAgICAgICAgICAgICAgIGNvbnN0IGVsID0gZS50YXJnZXQ7XHJcbiAgICAgICAgICAgICAgICBpZiAoIWVsLmNsYXNzTGlzdC5jb250YWlucygnbWF0Y2gnKSl7XHJcbiAgICAgICAgICAgICAgICAgICAgZWwuY2xhc3NMaXN0LmNvbnRhaW5zKCdzaG93JykgPyBcclxuICAgICAgICAgICAgICAgICAgICAgICAgZWwuY2xhc3NMaXN0LnJlbW92ZSgnc2hvdycpIFxyXG4gICAgICAgICAgICAgICAgICAgICAgICA6IGVsLmNsYXNzTGlzdC5hZGQoJ3Nob3cnKTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfSk7IFxyXG4gICAgICAgICAgICB0aGlzLnRoZURlY2suYXBwZW5kQ2hpbGQoY2FyZCk7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG59XHJcblxyXG5jb25zdCBPY3RvID0ge1xyXG4gICAgLy9HZXQgdGhlIGN1cnJlbnQgYXJyYXkgb2YgY2FyZHNcclxuICAgIGdldERlY2s6IGZ1bmN0aW9uKCkge1xyXG4gICAgICAgIHJldHVybiBNb2RlbC5kZWNrO1xyXG4gICAgfSxcclxuXHJcbiAgICBzZXREZWNrOiBmdW5jdGlvbihkZWNrKSB7XHJcbiAgICAgICAgTW9kZWwuZGVjayA9IGRlY2s7XHJcbiAgICB9LFxyXG5cclxuICAgIGluaXQ6IGZ1bmN0aW9uKCkge1xyXG4gICAgICAgIE1vZGVsLmluaXQoKTtcclxuICAgICAgICBWaWV3LmluaXQoKTtcclxuICAgIH1cclxufVxyXG5cclxuT2N0by5pbml0KCk7XHJcblxyXG4vKlxyXG4gKiBzZXQgdXAgdGhlIGV2ZW50IGxpc3RlbmVyIGZvciBhIGNhcmQuIElmIGEgY2FyZCBpcyBjbGlja2VkOlxyXG4gKiAgLSBkaXNwbGF5IHRoZSBjYXJkJ3Mgc3ltYm9sIChwdXQgdGhpcyBmdW5jdGlvbmFsaXR5IGluIGFub3RoZXIgZnVuY3Rpb24gdGhhdCB5b3UgY2FsbCBmcm9tIHRoaXMgb25lKVxyXG4gKiAgLSBhZGQgdGhlIGNhcmQgdG8gYSAqbGlzdCogb2YgXCJvcGVuXCIgY2FyZHMgKHB1dCB0aGlzIGZ1bmN0aW9uYWxpdHkgaW4gYW5vdGhlciBmdW5jdGlvbiB0aGF0IHlvdSBjYWxsIGZyb20gdGhpcyBvbmUpXHJcbiAqICAtIGlmIHRoZSBsaXN0IGFscmVhZHkgaGFzIGFub3RoZXIgY2FyZCwgY2hlY2sgdG8gc2VlIGlmIHRoZSB0d28gY2FyZHMgbWF0Y2hcclxuICogICAgKyBpZiB0aGUgY2FyZHMgZG8gbWF0Y2gsIGxvY2sgdGhlIGNhcmRzIGluIHRoZSBvcGVuIHBvc2l0aW9uIChwdXQgdGhpcyBmdW5jdGlvbmFsaXR5IGluIGFub3RoZXIgZnVuY3Rpb24gdGhhdCB5b3UgY2FsbCBmcm9tIHRoaXMgb25lKVxyXG4gKiAgICArIGlmIHRoZSBjYXJkcyBkbyBub3QgbWF0Y2gsIHJlbW92ZSB0aGUgY2FyZHMgZnJvbSB0aGUgbGlzdCBhbmQgaGlkZSB0aGUgY2FyZCdzIHN5bWJvbCAocHV0IHRoaXMgZnVuY3Rpb25hbGl0eSBpbiBhbm90aGVyIGZ1bmN0aW9uIHRoYXQgeW91IGNhbGwgZnJvbSB0aGlzIG9uZSlcclxuICogICAgKyBpbmNyZW1lbnQgdGhlIG1vdmUgY291bnRlciBhbmQgZGlzcGxheSBpdCBvbiB0aGUgcGFnZSAocHV0IHRoaXMgZnVuY3Rpb25hbGl0eSBpbiBhbm90aGVyIGZ1bmN0aW9uIHRoYXQgeW91IGNhbGwgZnJvbSB0aGlzIG9uZSlcclxuICogICAgKyBpZiBhbGwgY2FyZHMgaGF2ZSBtYXRjaGVkLCBkaXNwbGF5IGEgbWVzc2FnZSB3aXRoIHRoZSBmaW5hbCBzY29yZSAocHV0IHRoaXMgZnVuY3Rpb25hbGl0eSBpbiBhbm90aGVyIGZ1bmN0aW9uIHRoYXQgeW91IGNhbGwgZnJvbSB0aGlzIG9uZSlcclxuICovXHJcbiJdfQ==
