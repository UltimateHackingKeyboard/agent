$(function() {
  // Handlebars template for Sidebar menu.
  var sidebarMenuSource = $('#sidebar-menu--source').html();
  var sidebarMenuTemplate = Handlebars.compile(sidebarMenuSource);
  $('#sidebar-menu').html(sidebarMenuTemplate(menuObject));

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

  $("#owl-example").owlCarousel({
    items: 1
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
      ],
      // actions: [
      //   {
      //     icon: 'plus',
      //     name: 'Add new keymap'
      //   }
      // ]
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
      ],
      // actions: [
      //   {
      //     icon: 'plus',
      //     name: 'Add new macro'
      //   }
      // ]
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
