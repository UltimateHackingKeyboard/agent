$(function() {
  // Handlebars template for Sidebar menu.
  var sidebarMenuSource = $('#sidebar-menu--source').html();
  var sidebarMenuTemplate = Handlebars.compile(sidebarMenuSource);
  $('#sidebar-menu').html(sidebarMenuTemplate(menuObject));

  // =======================
  // Menu-item functionality
  // =======================
  $('.sidebar__level-2--item').on('click', function() {
    var _this = $(this);

    var dataContent = _this.data('content');
    var dataAbbrev = _this.data('abbrev');
    var dataName = _this.data('name');
    console.log(dataContent, dataAbbrev, dataName);

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

});

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
          'name': 'Trackpoing'
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
