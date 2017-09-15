pkg.privateModule('views/LayoutView', function () {
    var pkg = this;

    function LayoutView() {
        var rendered = pkg.app.renderTemplate('tmplLayout');
        var container = $('<div></div>').html(rendered);

        this.DOM = {
            container: container,
            title: $('section > h1 > span', container)[0],
            titleSecondaryText: $('section > h1 > small', container)[0],
            pageBody: $('section > div', container)[0],
            menuSections: $('ul[data-role=menu] li', container)
                    .map(function (i, el) { return el; })
        }
    }

    LayoutView.prototype.setTitle = function (text, secondaryText) {
        $(this.DOM.title).text(text);
        if (secondaryText) {
            $(this.DOM.titleSecondaryText).text(secondaryText).show();
        } else {
            $(this.DOM.titleSecondaryText).hide();
        }
    };

    LayoutView.prototype.setMenuSection = function (name) {
        $(this.DOM.menuSections).removeClass('active');
        if (name) {
            $(this.DOM.menuSections)
                    .filter('[data-menu-section=' + name + ']')
                    .addClass('active');
        }
    };

    return LayoutView;
});
