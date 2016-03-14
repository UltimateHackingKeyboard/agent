$(function() {
  // Handlebars template for Sidebar menu.
  var sidebarMenuSource = $('#sidebar-menu--source').html();
  var sidebarMenuTemplate = Handlebars.compile(sidebarMenuSource);
  $('#sidebar-menu').html(sidebarMenuTemplate(menuObject));

  // ========================
  // Keymap related settings.
  // ========================
  $('.keymap__name, .keymap__abbrev, .macro__name').on('mouseover', function() {
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
      children: [
        {
          icon: '',
          name: 'Factory keymap',
          isDefault: true
        },
        {
          icon: '',
          name: 'QWERTY',
          classes: 'active'
        },
        {
          icon: '',
          name: 'Dvorak'
        },
        {
          icon: '',
          name: 'Colemak'
        },
        {
          icon: '',
          name: 'VIM'
        },
        {
          icon: '',
          name: 'Mortal Kombat X'
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
