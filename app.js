$(function() {
  Split(["#sidebar-menu", "#main-content"], {
    gutterSize: 8,
    sizes: [5, 95],
    minSize: 250
  });

  // Handlebars template for Sidebar menu.
  var sidebarMenuSource = $('#sidebar-menu--source').html();
  var sidebarMenuTemplate = Handlebars.compile(sidebarMenuSource);
  $('#sidebar-menu').html(sidebarMenuTemplate(menuObject));

  // ========================
  // Keymap related settings.
  // ========================
  $('.keymap__name, .keymap__abbrev').on('mouseover', function() {
    $(this).addClass('active');
  }).on('mouseout', function() {
    $(this).removeClass('active');
  });

  $('.keymap__is-default').on('click', function() {
    $(this).toggleClass('fa-star-o');
  });

  $("#owl-example").owlCarousel({
    items: 1
  });

});

var menuObject = {
  menu: [
    {
      icon: 'keyboard-o',
      name: 'Keyboard',
      children: [
        {
          icon: 'plus-circle',
          name: 'Add new keymap'
        },
        {
          icon: '',
          name: 'Factory keymap'
        },
        {
          icon: '',
          name: 'QWERTY'
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
        },
      ]
    },
    {
      icon: 'play',
      name: 'Macros',
      children: [
        {
          icon: 'plus-circle',
          name: 'Add new macro'
        },
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
        },
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
    },
    {
      'icon': 'gear',
      'name': 'Settings'
    }
  ]
};
