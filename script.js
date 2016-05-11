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
          groupName: 'Letters',
          groupValues: [
            {
              value: 'A',
              dataExplanation: '',
              label: 'A'
            },
            {
              value: 'B',
              dataExplanation: '',
              label: 'B'
            },
            {
              value: 'C',
              dataExplanation: '',
              label: 'C'
            }
          ]
        },
        {
          groupName: 'Numbers',
          groupValues: [
            {
              value: '1',
              dataExplanation: '',
              label: '1'
            },
            {
              value: '2',
              dataExplanation: '',
              label: '2'
            },
            {
              value: '3',
              dataExplanation: '',
              label: '3'
            }
          ]
        },
        {
          groupName: 'Punctuation',
          groupValues: [
            {
              value: '.',
              dataExplanation: 'dot',
              label: '.'
            },
            {
              value: ',',
              dataExplanation: 'comma',
              label: ','
            },
            {
              value: '!',
              dataExplanation: 'exclamation mark',
              label: '!'
            }
          ]
        },
        {
          groupName: 'Other',
          groupValues: [
            {
              value: 'Tab',
              dataExplanation: '',
              label: 'Tab'
            },
            {
              value: 'Enter',
              dataExplanation: '',
              label: 'Enter'
            }
          ]
        }
      ],
      secondaryRole: [
        {
          name: 'None'
        },
        {
          name: 'LShift'
        },
        {
          name: 'LCtrl'
        },
        {
          name: 'LSuper'
        },
        {
          name: 'LAlt'
        },
        {
          name: 'RAlt'
        },
        {
          name: 'RSuper'
        },
        {
          name: 'RCtrl'
        },
        {
          name: 'RShift'
        },
        {
          name: 'Mod'
        },
        {
          name: 'Mouse'
        },
        {
          name: 'Fn'
        },
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
    if (tplName == "layer") {
      noSearch = true;
    }
    initSelect2items(noSearch);
    _keypress_event_handlers();
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
   var dataExplanation = $(state.element).data('explanation');
   var dataAbbrev = $(state.element).data('abbrev');
   var dataAbbrevImage = $(state.element).data('abbrev-image');
   var $state = $('<span class="select2-item">' + state.text + '</span>')
   if (dataExplanation != '' && typeof dataExplanation != 'undefined') {
     $('<span class="scancode--explanation"> (' + dataExplanation + ')</span>').appendTo($state);
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
