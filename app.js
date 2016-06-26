$(function() {
    _init('.keymap--edit');

    $('.notification').on('click', '.notification__dismiss', function(e) {
        $('.notification').hide();
    }).on('click', '.notification__action--undo', function(e) {
        $('.notification').hide();
        $('.sidebar__level-2--item:hidden').show().click();
    });;

    $(function () {
        $('[data-toggle="tooltip"]').tooltip()
    });

    // =======================
    // Menu-item functionality LEGACY TODO remove
    // =======================
    $('.pane-title__name, .pane-title__abbrev').on('mouseover', function() {
        $(this).addClass('active');
    }).on('mouseout', function() {
        if (!$(this).is(':focus')) {
            $(this).removeClass('active');
        }
    }).on('focusout', function() {
        $(this).removeClass('active');
    });

    $('.keymap__is-default').on('click', function() {
        $(this).toggleClass('fa-star-o');
    });

    $('body').on('click', '.menu--top.legacy .sidebar__level-2--item', function() {
        var dataContent = $(this).data('content');

        $('legacy, keymap').hide();
        $(dataContent).show();
    });

    $('body').on('click', '.menu--top.angular .sidebar__level-2--item', function() {
        $('legacy').hide();
        $('keymap').show();
    });

    // ========================
    // Keymap related settings.
    // ========================
    $('button.uhk__layer-switcher').on('click', function(e) {
        var button = $(this),
        layerOrder = ['base', 'mod', 'fn', 'mouse'],
        currentButton = $('button.uhk__layer-switcher.current'),
        slideLayer = button.data('layer'),
        slideNumber = layerOrder.indexOf(slideLayer),
        currentSlideLayer = currentButton.data('layer'),
        currentSlideNumber = layerOrder.indexOf(currentSlideLayer),
        slide = $('.uhk__layer-wrapper--' + slideLayer),
        currentSlide = $('.uhk__layer-wrapper.current'),
        slideWidth = currentSlide.width() + 'px';

        if (slideNumber < currentSlideNumber) {
            // From left to right
            currentSlide.css('left', 0);
            slide.css('left', '-' + slideWidth);

            currentSlide.animate({left: slideWidth}, function() {
                $(this).removeClass('current');
            });
            slide.animate({left: 0}, function() {
                $(this).addClass('current');
            });

            currentButton.removeClass('current btn-primary').addClass('btn-default');
            button.addClass('current btn-primary').removeClass('btn-default').blur();
        } else if (slideNumber != currentSlideNumber) {
            // From right to left
            currentSlide.css({left: 0});
            slide.css({left: slideWidth});

            currentSlide.animate({left: '-' + slideWidth}, function() {
                $(this).removeClass('current');
            });
            slide.animate({left: 0}, function() {
                $(this).addClass('current');
            });

            currentButton.removeClass('current btn-primary').addClass('btn-default');
            button.addClass('current btn-primary').addClass('btn-default').blur();
        }
    });

    $('.keymap__remove').on('click', function(e) {
        // Mimic the removal of a keymap with undo option.
        $('.sidebar__level-2--item:hidden').remove();
        $('.sidebar__level-2--item.active').hide();

        // Show the factory keymap after removal of a keymap.
        $('.sidebar__level-2--item:first').click();
        $('.notification').show();
    });

    // Based on: http://stackoverflow.com/a/24933495
    $('img.uhk').each(function(){
        var $img = $(this);
        var imgID = $img.attr('id');
        var imgClass = $img.attr('class');
        var imgURL = $img.attr('src');
        var imgSelector = '.' + imgClass.replace(' ', '.')

            $.get(imgURL, function(data) {
                // Get the SVG tag, ignore the rest
                var $svg = $(data).find('svg');

                // Add replaced image's ID to the new SVG
                if(typeof imgID !== 'undefined') {
                    $svg = $svg.attr('id', imgID);
                }
                // Add replaced image's classes to the new SVG
                if(typeof imgClass !== 'undefined') {
                    $svg = $svg.attr('class', imgClass+' replaced-svg');
                }

                // Remove any invalid XML tags as per http://validator.w3.org
                $svg = $svg.removeAttr('xmlns:a');

                // Check if the viewport is set, else we gonna set it if we can.
                if(!$svg.attr('viewBox') && $svg.attr('height') && $svg.attr('width')) {
                    $svg.attr('viewBox', '0 0 ' + $svg.attr('height') + ' ' + $svg.attr('width'))
                }

                // Replace image with new SVG
                $img.replaceWith($svg);
                $('.keyboard-slider').height($svg.height());

                // Quick fix as jQuery 2.1.4 addClass() method is not working on SVG elements.
                var finalClasses = $svg.attr('class');

                $('#left-parts rect, #right-parts rect', imgSelector).on('click', function() {
                    var _popup = $('.key-editor__popup'),
                    rectB7 = $('rect#b7', $svg);
                    if (_popup.is(':hidden')) {
                        $svg.attr('class', finalClasses + ' faded');
                        _popup.show();
                        rectB7.attr('class', 'active');
                    } else {
                        $svg.attr('class', finalClasses);
                        _popup.hide();
                        rectB7.attr('class', '');
                    }
                });

            }, 'xml');
    });
});

function _init(view) {
    switch (view) {
        case '.keymap--edit':
            var h = $('.uhk--base-layer').height();
            $('.keyboard-slider').height(h + 'px');
            break;
    }
}
