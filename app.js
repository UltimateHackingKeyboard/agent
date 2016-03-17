$(function() {
  // Handlebars template for Sidebar menu.
  var sidebarMenuSource = $('#sidebar-menu--source').html();
  var sidebarMenuTemplate = Handlebars.compile(sidebarMenuSource);
  $('#sidebar-menu').html(sidebarMenuTemplate(menuObject));
  _init('.keymap--edit');

  // =======================
  // Menu-item functionality
  // =======================
  $('.sidebar__level-2--item').on('click', function() {
    var _this = $(this);

    var dataContent = _this.data('content');
    var dataAbbrev = _this.data('abbrev');
    var dataName = _this.data('name');

    var _currentView = $('.main-content__inner:visible');
    // This can be the same as _currentView.
    var _newView = $(dataContent);

    // Switch to the corresponding view.
    _currentView.hide();
    _newView.show();

    // Fill pane title based on data attributes.
    if (dataName != '') {
      _newView.find('.pane-title__name').text(dataName);
    }
    if (dataAbbrev != '') {
      _newView.find('.pane-title__abbrev').text(dataAbbrev);
    }

    // Change .active class in the sidebar.
    $('.sidebar__level-2--item.active').removeClass('active');
    _this.addClass('active');
    _init(dataContent);
  });

  // ========================
  // Keymap related settings.
  // ========================
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

  $('.sidebar__level-1', '.sidebar__level-1--item').on('click', function() {
    $(this).parents('.sidebar__level-1--item').find('ul').slideToggle();
    $(this).find('.fa-chevron-down, .fa-chevron-up').toggleClass('fa-chevron-down fa-chevron-up')
  });

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

var menuObject = {
  menu: [
    {
      icon: 'keyboard-o',
      name: 'Keymaps',
      hasDefaults: true,
      expandable: true,
      dataContent: '.keymap--edit',
      children: [
        {
          icon: '',
          name: 'Factory keymap',
          abbrev: 'FTY',
          isDefault: true
        },
        {
          icon: '',
          name: 'QWERTY',
          abbrev: 'QTY',
          classes: 'active'
        },
        {
          icon: '',
          name: 'Dvorak',
          abbrev: 'DVR',
        },
        {
          icon: '',
          name: 'Colemak',
          abbrev: 'COL',
        },
        {
          icon: '',
          name: 'VIM',
          abbrev: 'VIM',
        },
        {
          icon: '',
          name: 'Mortal Kombat X',
          abbrev: 'MKX',
        }
      ]
    },
    {
      icon: 'play',
      name: 'Macros',
      expandable: true,
      dataContent: '.macro--edit',
      children: [
        {
          icon: '',
          name: 'Macro1'
        },
        {
          icon: '',
          name: 'Macro2'
        },
        {
          icon: '',
          name: 'Macro3'
        },
        {
          icon: '',
          name: 'Macro4'
        }
      ]
    },
    {
      'icon': 'puzzle-piece',
      'name': 'Add-on modules',
      'children': [
        {
          'icon': '',
          'name': 'Key cluster'
        },
        {
          'icon': '',
          'name': 'Trackball'
        },
        {
          'icon': '',
          'name': 'Toucpad'
        },
        {
          'icon': '',
          'name': 'Trackpoint'
        }
      ]
    }
  ],
  menuBottom: [
    {
      'icon': 'gear',
      'name': 'Settings'
    }
  ]
};
