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
              alternateName: '',
              label: 'A'
            },
            {
              scancode: '5',
              alternateName: '',
              label: 'B'
            },
            {
              scancode: '6',
              alternateName: '',
              label: 'C'
            },
            {
              scancode: '7',
              alternateName: '',
              label: 'D'
            },
            {
              scancode: '8',
              alternateName: '',
              label: 'E'
            },
            {
              scancode: '9',
              alternateName: '',
              label: 'F'
            },
            {
              scancode: '10',
              alternateName: '',
              label: 'G'
            },
            {
              scancode: '11',
              alternateName: '',
              label: 'H'
            },
            {
              scancode: '12',
              alternateName: '',
              label: 'I'
            },
            {
              scancode: '13',
              alternateName: '',
              label: 'J'
            },
            {
              scancode: '14',
              alternateName: '',
              label: 'K'
            },
            {
              scancode: '15',
              alternateName: '',
              label: 'L'
            },
            {
              scancode: '16',
              alternateName: '',
              label: 'M'
            },
            {
              scancode: '17',
              alternateName: '',
              label: 'N'
            },
            {
              scancode: '18',
              alternateName: '',
              label: 'O'
            },
            {
              scancode: '19',
              alternateName: '',
              label: 'P'
            },
            {
              scancode: '20',
              alternateName: '',
              label: 'Q'
            },
            {
              scancode: '21',
              alternateName: '',
              label: 'R'
            },
            {
              scancode: '22',
              alternateName: '',
              label: 'S'
            },
            {
              scancode: '23',
              alternateName: '',
              label: 'T'
            },
            {
              scancode: '24',
              alternateName: '',
              label: 'U'
            },
            {
              scancode: '25',
              alternateName: '',
              label: 'V'
            },
            {
              scancode: '26',
              alternateName: '',
              label: 'W'
            },
            {
              scancode: '27',
              alternateName: '',
              label: 'X'
            },
            {
              scancode: '28',
              alternateName: '',
              label: 'Y'
            },
            {
              scancode: '29',
              alternateName: '',
              label: 'Z'
            }
          ]
        },
        {
          groupName: 'Number Row',
          groupValues: [
            {
              scancode: '30',
              alternateName: '',
              label: '1 !'
            },
            {
              scancode: '31',
              alternateName: '',
              label: '2 @'
            },
            {
              scancode: '32',
              alternateName: '',
              label: '3 #'
            },
            {
              scancode: '33',
              alternateName: '',
              label: '4 $'
            },
            {
              scancode: '34',
              alternateName: '',
              label: '5 %'
            },
            {
              scancode: '35',
              alternateName: '',
              label: '6 ^'
            },
            {
              scancode: '36',
              alternateName: '',
              label: '7 &'
            },
            {
              scancode: '37',
              alternateName: '',
              label: '8 *'
            },
            {
              scancode: '38',
              alternateName: '',
              label: '9 ('
            },
            {
              scancode: '39',
              alternateName: '',
              label: '0 )'
            }
          ]
        },
        {
          groupName: 'Whitespace',
          groupValues: [
            {
              scancode: '40',
              alternateName: 'Enter',
              label: 'Return'
            },
            {
              scancode: '41',
              alternateName: '',
              label: 'Escape'
            },
            {
              scancode: '42',
              alternateName: '',
              label: 'Backspace'
            },
            {
              scancode: '43',
              alternateName: '',
              label: 'Tab'
            },
            {
              scancode: '44',
              alternateName: '',
              label: 'Spacebar'
            }
          ]
        },
        {
          groupName: 'Punctuation',
          groupValues: [
            {
              scancode: '45',
              alternateName: '',
              label: '- _'
            },
            {
              scancode: '46',
              alternateName: '',
              label: '= +'
            },
            {
              scancode: '47',
              alternateName: '',
              label: '[ {'
            },
            {
              scancode: '48',
              alternateName: '',
              label: '] }'
            },
            {
              scancode: '49',
              alternateName: '',
              label: '\ |'
            },
            {
              scancode: '51',
              alternateName: '',
              label: '; :'
            },
            {
              scancode: '52',
              alternateName: '',
              label: '\' "'
            },
            {
              scancode: '53',
              alternateName: '',
              label: '` ~'
            },
            {
              scancode: '54',
              alternateName: '',
              label: ', <'
            },
            {
              scancode: '55',
              alternateName: '',
              label: '. >'
            },
            {
              scancode: '56',
              alternateName: '',
              label: '/ ?'
            }
          ]
        },
        {
          groupName: 'Function keys',
          groupValues: [
            {
              scancode: '58',
              alternateName: '',
              label: 'F1'
            },
            {
              scancode: '59',
              alternateName: '',
              label: 'F2'
            },
            {
              scancode: '60',
              alternateName: '',
              label: 'F3'
            },
            {
              scancode: '61',
              alternateName: '',
              label: 'F4'
            },
            {
              scancode: '62',
              alternateName: '',
              label: 'F5'
            },
            {
              scancode: '63',
              alternateName: '',
              label: 'F6'
            },
            {
              scancode: '64',
              alternateName: '',
              label: 'F7'
            },
            {
              scancode: '65',
              alternateName: '',
              label: 'F8'
            },
            {
              scancode: '66',
              alternateName: '',
              label: 'F9'
            },
            {
              scancode: '67',
              alternateName: '',
              label: 'F10'
            },
            {
              scancode: '68',
              alternateName: '',
              label: 'F11'
            },
            {
              scancode: '69',
              alternateName: '',
              label: 'F12'
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
   var alternateName = $(state.element).data('alternate-name');
   var dataAbbrev = $(state.element).data('abbrev');
   var dataAbbrevImage = $(state.element).data('abbrev-image');
   var $state = $('<span class="select2-item">' + state.text + '</span>')
   if (alternateName != '' && typeof alternateName != 'undefined') {
     $('<span class="scancode--alternate-name"> (' + alternateName + ')</span>').appendTo($state);
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
