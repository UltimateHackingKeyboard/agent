$(function() {
  // General configuration for popover contents.
  var contentContext = {
    keypress: {
      layers: [
        {
          name: 'None',
          class: 'layer-key layer-key--disabled',
          primary: 'btn-primary'
        },
        {
          name: 'Mod',
          class: 'layer-key layer-key--mod',
          primary: ''
        },
        {
          name: 'Fn',
          class: 'layer-key layer-key--fn',
          primary: ''
        },
        {
          name: 'Mouse',
          class: 'layer-key layer-key--mouse',
          primary: ''
        }
      ],
      modifiers: {
        left: [
          {
            name: 'LShift',
            primary: 'btn-primary'
          },
          {
            name: 'LCtrl',
            primary: ''
          },
          {
            name: 'LSuper',
            primary: ''
          },
          {
            name: 'LAlt',
            primary: 'btn-primary'
          }
        ],
        right: [
          {
            name: 'RShift',
            primary: ''
          },
          {
            name: 'RCtrl',
            primary: ''
          },
          {
            name: 'RSuper',
            primary: ''
          },
          {
            name: 'RAlt',
            primary: ''
          }
        ]
      },
      scancode: [
        {
          groupName: 'Alphabet',
          groupValues: [
            {
              scancode: '4',
              searchTerm: '',
              label: 'A'
            },
            {
              scancode: '5',
              searchTerm: '',
              label: 'B'
            },
            {
              scancode: '6',
              searchTerm: '',
              label: 'C'
            },
            {
              scancode: '7',
              searchTerm: '',
              label: 'D'
            },
            {
              scancode: '8',
              searchTerm: '',
              label: 'E'
            },
            {
              scancode: '9',
              searchTerm: '',
              label: 'F'
            },
            {
              scancode: '10',
              searchTerm: '',
              label: 'G'
            },
            {
              scancode: '11',
              searchTerm: '',
              label: 'H'
            },
            {
              scancode: '12',
              searchTerm: '',
              label: 'I'
            },
            {
              scancode: '13',
              searchTerm: '',
              label: 'J'
            },
            {
              scancode: '14',
              searchTerm: '',
              label: 'K'
            },
            {
              scancode: '15',
              searchTerm: '',
              label: 'L'
            },
            {
              scancode: '16',
              searchTerm: '',
              label: 'M'
            },
            {
              scancode: '17',
              searchTerm: '',
              label: 'N'
            },
            {
              scancode: '18',
              searchTerm: '',
              label: 'O'
            },
            {
              scancode: '19',
              searchTerm: '',
              label: 'P'
            },
            {
              scancode: '20',
              searchTerm: '',
              label: 'Q'
            },
            {
              scancode: '21',
              searchTerm: '',
              label: 'R'
            },
            {
              scancode: '22',
              searchTerm: '',
              label: 'S'
            },
            {
              scancode: '23',
              searchTerm: '',
              label: 'T'
            },
            {
              scancode: '24',
              searchTerm: '',
              label: 'U'
            },
            {
              scancode: '25',
              searchTerm: '',
              label: 'V'
            },
            {
              scancode: '26',
              searchTerm: '',
              label: 'W'
            },
            {
              scancode: '27',
              searchTerm: '',
              label: 'X'
            },
            {
              scancode: '28',
              searchTerm: '',
              label: 'Y'
            },
            {
              scancode: '29',
              searchTerm: '',
              label: 'Z'
            }
          ]
        },
        {
          groupName: 'Number Row',
          groupValues: [
            {
              scancode: '30',
              searchTerm: '',
              label: '1 !'
            },
            {
              scancode: '31',
              searchTerm: '',
              label: '2 @'
            },
            {
              scancode: '32',
              searchTerm: '',
              label: '3 #'
            },
            {
              scancode: '33',
              searchTerm: '',
              label: '4 $'
            },
            {
              scancode: '34',
              searchTerm: '',
              label: '5 %'
            },
            {
              scancode: '35',
              searchTerm: '',
              label: '6 ^'
            },
            {
              scancode: '36',
              searchTerm: '',
              label: '7 &'
            },
            {
              scancode: '37',
              searchTerm: '',
              label: '8 *'
            },
            {
              scancode: '38',
              searchTerm: '',
              label: '9 ('
            },
            {
              scancode: '39',
              searchTerm: '',
              label: '0 )'
            }
          ]
        },
        {
          groupName: 'Whitespace',
          groupValues: [
            {
              scancode: '40',
              searchTerm: 'Enter',
              label: 'Return'
            },
            {
              scancode: '41',
              searchTerm: '',
              label: 'Escape'
            },
            {
              scancode: '42',
              searchTerm: '',
              label: 'Backspace'
            },
            {
              scancode: '43',
              searchTerm: '',
              label: 'Tab'
            },
            {
              scancode: '44',
              searchTerm: '',
              label: 'Spacebar'
            }
          ]
        },
        {
          groupName: 'Punctuation',
          groupValues: [
            {
              scancode: '45',
              searchTerm: '',
              label: '- _'
            },
            {
              scancode: '46',
              searchTerm: '',
              label: '= +'
            },
            {
              scancode: '47',
              searchTerm: '',
              label: '[ {'
            },
            {
              scancode: '48',
              searchTerm: '',
              label: '] }'
            },
            {
              scancode: '49',
              searchTerm: '',
              label: '\ |'
            },
            {
              scancode: '51',
              searchTerm: '',
              label: '; :'
            },
            {
              scancode: '52',
              searchTerm: '',
              label: '\' "'
            },
            {
              scancode: '53',
              searchTerm: '',
              label: '` ~'
            },
            {
              scancode: '54',
              searchTerm: '',
              label: ', <'
            },
            {
              scancode: '55',
              searchTerm: '',
              label: '. >'
            },
            {
              scancode: '56',
              searchTerm: '',
              label: '/ ?'
            }
          ]
        },
        {
          groupName: 'Function keys',
          groupValues: [
            {
              scancode: '58',
              searchTerm: '',
              label: 'F1'
            },
            {
              scancode: '59',
              searchTerm: '',
              label: 'F2'
            },
            {
              scancode: '60',
              searchTerm: '',
              label: 'F3'
            },
            {
              scancode: '61',
              searchTerm: '',
              label: 'F4'
            },
            {
              scancode: '62',
              searchTerm: '',
              label: 'F5'
            },
            {
              scancode: '63',
              searchTerm: '',
              label: 'F6'
            },
            {
              scancode: '64',
              searchTerm: '',
              label: 'F7'
            },
            {
              scancode: '65',
              searchTerm: '',
              label: 'F8'
            },
            {
              scancode: '66',
              searchTerm: '',
              label: 'F9'
            },
            {
              scancode: '67',
              searchTerm: '',
              label: 'F10'
            },
            {
              scancode: '68',
              searchTerm: '',
              label: 'F11'
            },
            {
              scancode: '69',
              searchTerm: '',
              label: 'F12'
            }
          ]
        },
        {
          groupName: 'Navigation',
          groupValues: [
            {
              scancode: '73',
              searchTerm: '',
              label: 'Insert'
            },
            {
              scancode: '74',
              searchTerm: '',
              label: 'Home'
            },
            {
              scancode: '75',
              searchTerm: 'PgUp pageup',
              label: 'Page Up'
            },
            {
              scancode: '76',
              searchTerm: 'Delete Forward',
              label: 'Delete'
            },
            {
              scancode: '77',
              searchTerm: '',
              label: 'End'
            },
            {
              scancode: '78',
              searchTerm: 'PgDn pagedown',
              label: 'Page Down'
            },
            {
              scancode: '79',
              searchTerm: 'ArrowRight',
              label: 'Right Arrow'
            },
            {
              scancode: '80',
              searchTerm: 'ArrowLeft',
              label: 'Left Arrow'
            },
            {
              scancode: '81',
              searchTerm: 'ArrowDown',
              label: 'Down Arrow'
            },
            {
              scancode: '82',
              searchTerm: 'ArrowUp',
              label: 'Up Arrow'
            }
          ]
        },
        {
          groupName: 'Number Pad',
          groupValues: [
            {
              scancode: '83',
              searchTerm: '',
              label: 'NumLock'
            },
            {
              scancode: '84',
              searchTerm: 'slash',
              label: '/'
            },
            {
              scancode: '85',
              searchTerm: 'asterisk',
              label: '*'
            },
            {
              scancode: '86',
              searchTerm: 'minus',
              label: '-'
            },
            {
              scancode: '87',
              searchTerm: 'plus',
              label: '+'
            },
            {
              scancode: '88',
              searchTerm: '',
              label: 'Enter'
            },
            {
              scancode: '89',
              searchTerm: 'one',
              label: '1'
            },
            {
              scancode: '90',
              searchTerm: 'two',
              label: '2'
            },
            {
              scancode: '91',
              searchTerm: 'three',
              label: '3'
            },
            {
              scancode: '92',
              searchTerm: 'four',
              label: '4'
            },
            {
              scancode: '93',
              searchTerm: 'five',
              label: '5'
            },
            {
              scancode: '94',
              searchTerm: 'six',
              label: '6'
            },
            {
              scancode: '95',
              searchTerm: 'seven',
              label: '7'
            },
            {
              scancode: '96',
              searchTerm: 'eight',
              label: '8'
            },
            {
              scancode: '97',
              searchTerm: 'nine',
              label: '9'
            },
            {
              scancode: '98',
              searchTerm: 'zero',
              label: '0'
            },
            {
              scancode: '99',
              searchTerm: 'Period',
              label: ','
            }
          ]
        },
        {
          groupName: 'Misc',
          groupValues: [
            {
              scancode: '70',
              searchTerm: '',
              label: 'Print Screen'
            },
            {
              scancode: '57',
              searchTerm: '',
              label: 'Caps Lock'
            },
            {
              scancode: '71',
              searchTerm: '',
              label: 'Scroll Lock'
            },
            {
              scancode: '72',
              searchTerm: '',
              label: 'Pause'
            }
          ]
        },
        {
          groupName: 'Media Keys',
          groupValues: [
            {
              scancode: '127',
              searchTerm: '',
              label: 'Mute'
            },
            {
              scancode: '128',
              searchTerm: '',
              label: 'Volume Up'
            },
            {
              scancode: '129',
              searchTerm: '',
              label: 'Volume Down'
            }
          ]
        }
      ],
      secondaryRole: [
        {
          groupName: '',
          groupValues: [
            {
              value: 'None',
              label: 'None',
            }
          ]
        },
        {
          groupName: 'Modifiers',
          groupValues: [
            {
              value: 'LShift',
              label: 'LShift'
            },
            {
              value: 'LCtrl',
              label: 'LCtrl'
            },
            {
              value: 'LSuper',
              label: 'LSuper'
            },
            {
              value: 'LAlt',
              label: 'LAlt'
            },
            {
              value: 'RShift',
              label: 'RShift'
            },
            {
              value: 'RCtrl',
              label: 'RCtrl'
            },
            {
              value: 'RSuper',
              label: 'RSuper'
            },
            {
              value: 'RAlt',
              label: 'RAlt'
            }
          ]
        },
        {
          groupName: 'Layer Switcher',
          groupValues: [
            {
              value: 'Mod',
              label: 'Mod'
            },
            {
              value: 'Mouse',
              label: 'Mouse'
            },
            {
              value: 'Fn',
              label: 'Fn'
            }
          ]
        }
      ]
    },
    macro: {
      macros: [
        {
          value: 'Select macro',
          name: 'Select macro'
        },
        {
          value: 'Latex custom equation',
          name: 'Latex custom equation'
        },
        {
          value: 'Process shops xml',
          name: 'Process shops xml'
        },
      ]
    },
    switchKeymap: {
      layouts: [
        {
          value: 'Select keymap',
          name: 'Select keymap',
          dataImage: 'base-layer--blank.svg',
          abbrev: '',
          dataAbbrevImage: ''
        },
        {
          value: 'Factory keymap',
          name: 'Factory keymap',
          dataImage: 'base-layer.svg',
          abbrev: 'QWE',
          dataAbbrevImage: 'segments_qwe.svg'
        },
        {
          value: 'Dvorak',
          name: 'Dvorak',
          dataImage: 'base-layer--dvorak.svg',
          abbrev: 'DVR',
          dataAbbrevImage: 'segments_dvr.svg'
        }
      ]
    }
  };

  // Handlebars template for Popover top.
  var keyEditorTopSource = $('#key-editor-top__source').html();
  var keyEditorTopTemplate = Handlebars.compile(keyEditorTopSource);
  var keyEditorTopContext = {
    buttons: [
      {
        type: 'primary',
        icon: 'fa-keyboard-o',
        title: 'Keypress',
        content: 'keypress'
      },
      {
        type: 'default',
        icon: 'fa-clone', // The icon for the tab will be a layer icon in svg. But for the mockup it was easier to just use something similar from fontawesome.
        title: 'Layer',
        content: 'layer'
      },
      {
        type: 'default',
        icon: 'fa-mouse-pointer',
        title: 'Mouse',
        content: 'mouse'
      },
      {
        type: 'default',
        icon: 'fa-play',
        title: 'Macro',
        content: 'macro'
      },
      {
        type: 'default',
        icon: 'fa-keyboard-o',
        title: 'Keymap',
        content: 'switchKeymap'
      },
      {
        type: 'default',
        icon: 'fa-ban',
        title: 'None',
        content: 'none'
      }
    ]
  };
  $('#key-editor-top__target').html(keyEditorTopTemplate(keyEditorTopContext));

  // Handlebars template for Popover bottom.
  var keyEditorBottomSource = $('#key-editor-bottom__source').html();
  var keyEditorBottomTemplate = Handlebars.compile(keyEditorBottomSource);
  var keyEditorBottomContext = {};
  $('#key-editor-bottom__target').html(keyEditorBottomTemplate(keyEditorBottomContext));

  // Handlebars template for Popover content to be displayed by default.
  var keyEditorContentSource = $('#key-editor-content__source--keypress').html();
  var keyEditorContentTemplate = Handlebars.compile(keyEditorContentSource);
  $('#key-editor-content__target').html(keyEditorContentTemplate(contentContext.keypress));


  // ================================
  // General library initializations.
  // ================================

  // Init select2.
  $('select').select2({
    templateResult: formatState
  });

  // Init tooltips.
  $('[data-toggle="tooltip"]').tooltip()

  // Init popover-title tabs.
  $('li:first', '.popover-title.menu-tabs').addClass('active');


  // ===============
  // Event handlers.
  // ===============

  $('.popover-menu').on('click', 'button', function() {
    $('.btn-primary', '.popover-menu').removeClass('btn-primary').addClass('btn-default');
    $(this).addClass('btn-primary').blur();
    var tplName = $(this).data('content');
    var contentSource = $('#key-editor-content__source--' + tplName).html();
    var contentTemplate = Handlebars.compile(contentSource);
    $('#key-editor-content__target').html(contentTemplate(contentContext[tplName]));
    initSelect2items();
  });

  $('.popover-menu').on('click', 'a.menu-tabs--item', function() {
    $('.popover-menu.nav-tabs li.active').removeClass('active');
    $(this).parent('li').addClass('active');
    var tplName = $(this).data('content');
    var contentSource = $('#key-editor-content__source--' + tplName).html();
    var contentTemplate = Handlebars.compile(contentSource);
    $('#key-editor-content__target').html(contentTemplate(contentContext[tplName]));
    var noSearch = false;
    switch (tplName) {
      case 'layer':
        noSearch = true;

      case 'keypress':
        _keypress_event_handlers();

      case 'mouse':
        _mouse_event_handlers();

      default:
        initSelect2items(noSearch);
    }
  });


  var _keypress_event_handlers = function() {
    $('.modifiers').on('click', 'button', function() {
      $(this).toggleClass('btn-primary').blur();
    });

    $('.btn--capture-keystroke').on('click', function(e) {
      $('.btn--capture-keystroke').toggle();
      _toggleScancodeForm();
    });

    $('.layer-action--buttons').on('click', '.layer-key', function(e) {
      $this = $(this);
      $('.layer-key.btn-primary', '.layer-action--buttons').removeClass('btn-primary');
      $this.addClass('btn-primary').blur();
      if ($this.hasClass('layer-key--disabled')) {
        // Enable all form controls in .global-key-setup
        $('button, select', '.global-key-setup').prop('disabled', false);
        $('.global-key-setup').removeClass('disabled');
        $('.disabled-state--text').hide();
      }
      else {
        // Disable all form controls in .global-key-setup
        $('button, select', '.global-key-setup').prop('disabled', true);
        $('.global-key-setup').addClass('disabled');
        $('.disabled-state--text').show();
      }
    });
  };
  _keypress_event_handlers();

  var _mouse_event_handlers = function() {
    $('.mouse__action--type').on('click', 'a', function(e) {
      var _this = $(this),
          _mouse_config_name = _this.data('config');
      $('.mouse__config').hide();
      $('.mouse__config--' + _mouse_config_name).show();
      $('.mouse__action--type li').removeClass('active');
      _this.parents('li').addClass('active');
    });

    $('.mouse__action--config').on('click', '.btn', function(e) {
      var _buttons = $('.mouse__action--config .btn'),
          _mouseActionTypes = $('.mouse__action--type a'),
          _currentMouseAction = $('.mouse__action--type li.active a'),
          _this = $(this);

      _buttons.removeClass('btn-primary');
      _this.addClass('btn-primary');
      _mouseActionTypes.removeClass('selected');
      _currentMouseAction.addClass('selected');
    });
  }
});


// ==========================
// Select2 related functions.
// ==========================

function initSelect2items(noSearch) {
  var noSearch = typeof noSearch !== 'undefined' ?  noSearch : false,
      noSearchValue = 0;
  if (noSearch) {
    var noSearchValue = Infinity;
  }
  $('select').select2({
    templateResult: formatState,
    minimumResultsForSearch: noSearchValue
  });

  $('select').on('select2:select', function(e) {
    var selected = $(e.params.data.element);
    var image = selected.data('image');
    console.log(e, selected, image);
    $('img', '.layout-preview').attr('src', 'images/' + image);
  });

  $('.layer-toggle').on('select2:select', function(e) {
    $('.layer-help').toggle();
  });

  $('.layout-switcher').on('select2:open', function(e) {
    $('.layout-preview').css('opacity', '0.1');
  }).on('select2:close', function(e) {
    $('.layout-preview').css('opacity', '1');
  });
}

function formatState(state) {
   if (!state.id) { return state.text; }
   var searchTerm = $(state.element).data('searchterm');
   var dataAbbrev = $(state.element).data('abbrev');
   var dataAbbrevImage = $(state.element).data('abbrev-image');
   var $state = $('<span class="select2-item">' + state.text + '</span>')
   if (searchTerm != '' && typeof searchTerm != 'undefined') {
     $('<span class="scancode--searchterm"> (' + searchTerm + ')</span>').appendTo($state);
   }
   if (dataAbbrevImage != '' && typeof dataAbbrevImage != 'undefined') {
     $('<img />')
       .attr('src', 'images/' + dataAbbrevImage)
       .attr('class', 'layout-segment-code')
       .prependTo($state);
     $state.addClass('keymap-name--wrapper');
   }
   return $state;
}


// ===============
// Misc functions.
// ===============

function _toggleScancodeForm() {
  var disabledState = $('.btn--capture-keystroke__stop').is(':visible');
  $('button', '.modifiers__left, .modifiers__right').prop('disabled', disabledState);
  $('select.scancode').prop('disabled', disabledState);
  $('b', '.scancode-options').toggleClass('disabled');
}
