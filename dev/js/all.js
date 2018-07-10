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

var cards = document.getElementsByClassName('card');

var _iteratorNormalCompletion = true;
var _didIteratorError = false;
var _iteratorError = undefined;

try {
    for (var _iterator = cards[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
        var card = _step.value;

        card.addEventListener('click', function () {
            if (card.classList.contains('show')) {
                card.classList.remove('show');
            } else if (!card.classList.contains('match')) {
                card.classList.add('show');
            }
        });
    }

    // cards.forEach(function(el) {
    //     el.addEventListener('click', function() {
    //         if (el.classList.contains('show')) {
    //             el.classList.remove('show');
    //         } else if (!el.classList.contains('match')) {
    //             el.classList.add('show');
    //         }
    //     });
    // });
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

function Model() {

    this.loadData = function () {

        if (localStorage.getItem('ecmMemGame')) {
            var game = localStorage.getItem('ecmMemGame');
            this.moves = game.moves;
            this.time = game.time;
            this.recordTime = game.recordTime;
            this.cards = game.cards;
            this.deck = game.deck;
        } else {
            this.cards = [{
                'id': 1,
                'name': 'diamond',
                'state': ''
            }];

            this.deck = [];
        }
    };

    this.init = function () {
        this.loadData();
    };
}

function View() {}

function Octo() {
    this.init = function () {
        Model.init();
        View.init();
    };

    this.getDeck = function () {
        return Model.deck;
    };
}

Octo.init();

shuffle(Model.cards);

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
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImFwcC5qcyJdLCJuYW1lcyI6WyJzaHVmZmxlIiwiYXJyYXkiLCJjdXJyZW50SW5kZXgiLCJsZW5ndGgiLCJ0ZW1wb3JhcnlWYWx1ZSIsInJhbmRvbUluZGV4IiwiTWF0aCIsImZsb29yIiwicmFuZG9tIiwiY2FyZHMiLCJkb2N1bWVudCIsImdldEVsZW1lbnRzQnlDbGFzc05hbWUiLCJjYXJkIiwiYWRkRXZlbnRMaXN0ZW5lciIsImNsYXNzTGlzdCIsImNvbnRhaW5zIiwicmVtb3ZlIiwiYWRkIiwiTW9kZWwiLCJsb2FkRGF0YSIsImxvY2FsU3RvcmFnZSIsImdldEl0ZW0iLCJnYW1lIiwibW92ZXMiLCJ0aW1lIiwicmVjb3JkVGltZSIsImRlY2siLCJpbml0IiwiVmlldyIsIk9jdG8iLCJnZXREZWNrIl0sIm1hcHBpbmdzIjoiOztBQUFBOzs7O0FBS0E7Ozs7Ozs7QUFPQTtBQUNBLFNBQVNBLE9BQVQsQ0FBaUJDLEtBQWpCLEVBQXdCO0FBQ3BCLFFBQUlDLGVBQWVELE1BQU1FLE1BQXpCO0FBQUEsUUFBaUNDLGNBQWpDO0FBQUEsUUFBaURDLFdBQWpEOztBQUVBLFdBQU9ILGlCQUFpQixDQUF4QixFQUEyQjtBQUN2Qkcsc0JBQWNDLEtBQUtDLEtBQUwsQ0FBV0QsS0FBS0UsTUFBTCxLQUFnQk4sWUFBM0IsQ0FBZDtBQUNBQSx3QkFBZ0IsQ0FBaEI7QUFDQUUseUJBQWlCSCxNQUFNQyxZQUFOLENBQWpCO0FBQ0FELGNBQU1DLFlBQU4sSUFBc0JELE1BQU1JLFdBQU4sQ0FBdEI7QUFDQUosY0FBTUksV0FBTixJQUFxQkQsY0FBckI7QUFDSDs7QUFFRCxXQUFPSCxLQUFQO0FBQ0g7O0FBSUQsSUFBTVEsUUFBUUMsU0FBU0Msc0JBQVQsQ0FBZ0MsTUFBaEMsQ0FBZDs7Ozs7OztBQUVBLHlCQUFpQkYsS0FBakIsOEhBQXdCO0FBQUEsWUFBZkcsSUFBZTs7QUFDcEJBLGFBQUtDLGdCQUFMLENBQXNCLE9BQXRCLEVBQStCLFlBQVc7QUFDdEMsZ0JBQUlELEtBQUtFLFNBQUwsQ0FBZUMsUUFBZixDQUF3QixNQUF4QixDQUFKLEVBQXFDO0FBQ2pDSCxxQkFBS0UsU0FBTCxDQUFlRSxNQUFmLENBQXNCLE1BQXRCO0FBQ0gsYUFGRCxNQUVPLElBQUksQ0FBQ0osS0FBS0UsU0FBTCxDQUFlQyxRQUFmLENBQXdCLE9BQXhCLENBQUwsRUFBdUM7QUFDMUNILHFCQUFLRSxTQUFMLENBQWVHLEdBQWYsQ0FBbUIsTUFBbkI7QUFDSDtBQUNKLFNBTkQ7QUFPSDs7QUFFRDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7Ozs7Ozs7Ozs7Ozs7Ozs7QUFFQSxTQUFTQyxLQUFULEdBQWlCOztBQUViLFNBQUtDLFFBQUwsR0FBZ0IsWUFBVzs7QUFFdkIsWUFBSUMsYUFBYUMsT0FBYixDQUFxQixZQUFyQixDQUFKLEVBQXdDO0FBQ3BDLGdCQUFNQyxPQUFPRixhQUFhQyxPQUFiLENBQXFCLFlBQXJCLENBQWI7QUFDQSxpQkFBS0UsS0FBTCxHQUFhRCxLQUFLQyxLQUFsQjtBQUNBLGlCQUFLQyxJQUFMLEdBQVlGLEtBQUtFLElBQWpCO0FBQ0EsaUJBQUtDLFVBQUwsR0FBa0JILEtBQUtHLFVBQXZCO0FBQ0EsaUJBQUtoQixLQUFMLEdBQWFhLEtBQUtiLEtBQWxCO0FBQ0EsaUJBQUtpQixJQUFMLEdBQVlKLEtBQUtJLElBQWpCO0FBQ0gsU0FQRCxNQU9PO0FBQ0gsaUJBQUtqQixLQUFMLEdBQWEsQ0FDVDtBQUNJLHNCQUFNLENBRFY7QUFFSSx3QkFBUSxTQUZaO0FBR0kseUJBQVM7QUFIYixhQURTLENBQWI7O0FBUUEsaUJBQUtpQixJQUFMLEdBQVksRUFBWjtBQUNIO0FBQ0osS0FwQkQ7O0FBc0JBLFNBQUtDLElBQUwsR0FBWSxZQUFXO0FBQ25CLGFBQUtSLFFBQUw7QUFDSCxLQUZEO0FBR0g7O0FBRUQsU0FBU1MsSUFBVCxHQUFnQixDQUVmOztBQUVELFNBQVNDLElBQVQsR0FBZ0I7QUFDWixTQUFLRixJQUFMLEdBQVksWUFBVztBQUNuQlQsY0FBTVMsSUFBTjtBQUNBQyxhQUFLRCxJQUFMO0FBQ0gsS0FIRDs7QUFLQSxTQUFLRyxPQUFMLEdBQWUsWUFBVztBQUN0QixlQUFPWixNQUFNUSxJQUFiO0FBQ0gsS0FGRDtBQUdIOztBQUVERyxLQUFLRixJQUFMOztBQUVBM0IsUUFBUWtCLE1BQU1ULEtBQWQ7O0FBRUEiLCJmaWxlIjoiYWxsLmpzIiwic291cmNlc0NvbnRlbnQiOlsiLypcclxuICogQ3JlYXRlIGEgbGlzdCB0aGF0IGhvbGRzIGFsbCBvZiB5b3VyIGNhcmRzXHJcbiAqL1xyXG5cclxuXHJcbi8qXHJcbiAqIERpc3BsYXkgdGhlIGNhcmRzIG9uIHRoZSBwYWdlXHJcbiAqICAgLSBzaHVmZmxlIHRoZSBsaXN0IG9mIGNhcmRzIHVzaW5nIHRoZSBwcm92aWRlZCBcInNodWZmbGVcIiBtZXRob2QgYmVsb3dcclxuICogICAtIGxvb3AgdGhyb3VnaCBlYWNoIGNhcmQgYW5kIGNyZWF0ZSBpdHMgSFRNTFxyXG4gKiAgIC0gYWRkIGVhY2ggY2FyZCdzIEhUTUwgdG8gdGhlIHBhZ2VcclxuICovXHJcblxyXG4vLyBTaHVmZmxlIGZ1bmN0aW9uIGZyb20gaHR0cDovL3N0YWNrb3ZlcmZsb3cuY29tL2EvMjQ1MDk3NlxyXG5mdW5jdGlvbiBzaHVmZmxlKGFycmF5KSB7XHJcbiAgICB2YXIgY3VycmVudEluZGV4ID0gYXJyYXkubGVuZ3RoLCB0ZW1wb3JhcnlWYWx1ZSwgcmFuZG9tSW5kZXg7XHJcblxyXG4gICAgd2hpbGUgKGN1cnJlbnRJbmRleCAhPT0gMCkge1xyXG4gICAgICAgIHJhbmRvbUluZGV4ID0gTWF0aC5mbG9vcihNYXRoLnJhbmRvbSgpICogY3VycmVudEluZGV4KTtcclxuICAgICAgICBjdXJyZW50SW5kZXggLT0gMTtcclxuICAgICAgICB0ZW1wb3JhcnlWYWx1ZSA9IGFycmF5W2N1cnJlbnRJbmRleF07XHJcbiAgICAgICAgYXJyYXlbY3VycmVudEluZGV4XSA9IGFycmF5W3JhbmRvbUluZGV4XTtcclxuICAgICAgICBhcnJheVtyYW5kb21JbmRleF0gPSB0ZW1wb3JhcnlWYWx1ZTtcclxuICAgIH1cclxuXHJcbiAgICByZXR1cm4gYXJyYXk7XHJcbn1cclxuXHJcblxyXG5cclxuY29uc3QgY2FyZHMgPSBkb2N1bWVudC5nZXRFbGVtZW50c0J5Q2xhc3NOYW1lKCdjYXJkJyk7XHJcblxyXG5mb3IgKHZhciBjYXJkIG9mIGNhcmRzKSB7XHJcbiAgICBjYXJkLmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgaWYgKGNhcmQuY2xhc3NMaXN0LmNvbnRhaW5zKCdzaG93JykpIHtcclxuICAgICAgICAgICAgY2FyZC5jbGFzc0xpc3QucmVtb3ZlKCdzaG93Jyk7XHJcbiAgICAgICAgfSBlbHNlIGlmICghY2FyZC5jbGFzc0xpc3QuY29udGFpbnMoJ21hdGNoJykpIHtcclxuICAgICAgICAgICAgY2FyZC5jbGFzc0xpc3QuYWRkKCdzaG93Jyk7XHJcbiAgICAgICAgfVxyXG4gICAgfSk7IFxyXG59XHJcblxyXG4vLyBjYXJkcy5mb3JFYWNoKGZ1bmN0aW9uKGVsKSB7XHJcbi8vICAgICBlbC5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsIGZ1bmN0aW9uKCkge1xyXG4vLyAgICAgICAgIGlmIChlbC5jbGFzc0xpc3QuY29udGFpbnMoJ3Nob3cnKSkge1xyXG4vLyAgICAgICAgICAgICBlbC5jbGFzc0xpc3QucmVtb3ZlKCdzaG93Jyk7XHJcbi8vICAgICAgICAgfSBlbHNlIGlmICghZWwuY2xhc3NMaXN0LmNvbnRhaW5zKCdtYXRjaCcpKSB7XHJcbi8vICAgICAgICAgICAgIGVsLmNsYXNzTGlzdC5hZGQoJ3Nob3cnKTtcclxuLy8gICAgICAgICB9XHJcbi8vICAgICB9KTtcclxuLy8gfSk7XHJcblxyXG5mdW5jdGlvbiBNb2RlbCgpIHtcclxuXHJcbiAgICB0aGlzLmxvYWREYXRhID0gZnVuY3Rpb24oKSB7XHJcblxyXG4gICAgICAgIGlmIChsb2NhbFN0b3JhZ2UuZ2V0SXRlbSgnZWNtTWVtR2FtZScpKSB7XHJcbiAgICAgICAgICAgIGNvbnN0IGdhbWUgPSBsb2NhbFN0b3JhZ2UuZ2V0SXRlbSgnZWNtTWVtR2FtZScpO1xyXG4gICAgICAgICAgICB0aGlzLm1vdmVzID0gZ2FtZS5tb3ZlcztcclxuICAgICAgICAgICAgdGhpcy50aW1lID0gZ2FtZS50aW1lO1xyXG4gICAgICAgICAgICB0aGlzLnJlY29yZFRpbWUgPSBnYW1lLnJlY29yZFRpbWU7XHJcbiAgICAgICAgICAgIHRoaXMuY2FyZHMgPSBnYW1lLmNhcmRzO1xyXG4gICAgICAgICAgICB0aGlzLmRlY2sgPSBnYW1lLmRlY2s7XHJcbiAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgdGhpcy5jYXJkcyA9IFtcclxuICAgICAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgICAgICAnaWQnOiAxLFxyXG4gICAgICAgICAgICAgICAgICAgICduYW1lJzogJ2RpYW1vbmQnLFxyXG4gICAgICAgICAgICAgICAgICAgICdzdGF0ZSc6ICcnXHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIF1cclxuXHJcbiAgICAgICAgICAgIHRoaXMuZGVjayA9IFtdXHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIHRoaXMuaW5pdCA9IGZ1bmN0aW9uKCkge1xyXG4gICAgICAgIHRoaXMubG9hZERhdGEoKTtcclxuICAgIH1cclxufVxyXG5cclxuZnVuY3Rpb24gVmlldygpIHtcclxuICAgIFxyXG59XHJcblxyXG5mdW5jdGlvbiBPY3RvKCkge1xyXG4gICAgdGhpcy5pbml0ID0gZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgTW9kZWwuaW5pdCgpO1xyXG4gICAgICAgIFZpZXcuaW5pdCgpO1xyXG4gICAgfVxyXG5cclxuICAgIHRoaXMuZ2V0RGVjayA9IGZ1bmN0aW9uKCkge1xyXG4gICAgICAgIHJldHVybiBNb2RlbC5kZWNrO1xyXG4gICAgfSBcclxufVxyXG5cclxuT2N0by5pbml0KCk7XHJcblxyXG5zaHVmZmxlKE1vZGVsLmNhcmRzKTtcclxuXHJcbi8qXHJcbiAqIHNldCB1cCB0aGUgZXZlbnQgbGlzdGVuZXIgZm9yIGEgY2FyZC4gSWYgYSBjYXJkIGlzIGNsaWNrZWQ6XHJcbiAqICAtIGRpc3BsYXkgdGhlIGNhcmQncyBzeW1ib2wgKHB1dCB0aGlzIGZ1bmN0aW9uYWxpdHkgaW4gYW5vdGhlciBmdW5jdGlvbiB0aGF0IHlvdSBjYWxsIGZyb20gdGhpcyBvbmUpXHJcbiAqICAtIGFkZCB0aGUgY2FyZCB0byBhICpsaXN0KiBvZiBcIm9wZW5cIiBjYXJkcyAocHV0IHRoaXMgZnVuY3Rpb25hbGl0eSBpbiBhbm90aGVyIGZ1bmN0aW9uIHRoYXQgeW91IGNhbGwgZnJvbSB0aGlzIG9uZSlcclxuICogIC0gaWYgdGhlIGxpc3QgYWxyZWFkeSBoYXMgYW5vdGhlciBjYXJkLCBjaGVjayB0byBzZWUgaWYgdGhlIHR3byBjYXJkcyBtYXRjaFxyXG4gKiAgICArIGlmIHRoZSBjYXJkcyBkbyBtYXRjaCwgbG9jayB0aGUgY2FyZHMgaW4gdGhlIG9wZW4gcG9zaXRpb24gKHB1dCB0aGlzIGZ1bmN0aW9uYWxpdHkgaW4gYW5vdGhlciBmdW5jdGlvbiB0aGF0IHlvdSBjYWxsIGZyb20gdGhpcyBvbmUpXHJcbiAqICAgICsgaWYgdGhlIGNhcmRzIGRvIG5vdCBtYXRjaCwgcmVtb3ZlIHRoZSBjYXJkcyBmcm9tIHRoZSBsaXN0IGFuZCBoaWRlIHRoZSBjYXJkJ3Mgc3ltYm9sIChwdXQgdGhpcyBmdW5jdGlvbmFsaXR5IGluIGFub3RoZXIgZnVuY3Rpb24gdGhhdCB5b3UgY2FsbCBmcm9tIHRoaXMgb25lKVxyXG4gKiAgICArIGluY3JlbWVudCB0aGUgbW92ZSBjb3VudGVyIGFuZCBkaXNwbGF5IGl0IG9uIHRoZSBwYWdlIChwdXQgdGhpcyBmdW5jdGlvbmFsaXR5IGluIGFub3RoZXIgZnVuY3Rpb24gdGhhdCB5b3UgY2FsbCBmcm9tIHRoaXMgb25lKVxyXG4gKiAgICArIGlmIGFsbCBjYXJkcyBoYXZlIG1hdGNoZWQsIGRpc3BsYXkgYSBtZXNzYWdlIHdpdGggdGhlIGZpbmFsIHNjb3JlIChwdXQgdGhpcyBmdW5jdGlvbmFsaXR5IGluIGFub3RoZXIgZnVuY3Rpb24gdGhhdCB5b3UgY2FsbCBmcm9tIHRoaXMgb25lKVxyXG4gKi9cclxuIl19
