import "zone.js/dist/zone";

import "hammerjs";

if (!Element.prototype.matches) {
    Element.prototype.matches = Element.prototype.msMatchesSelector;
}