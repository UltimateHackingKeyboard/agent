$(function() {
  var macroSettingsHtml = $('.macro-settings');
  var toggleSpeed = 'fast';
  var notActiveOpacity = '0.75';

  var newMacroHtml = $('.new-macro-settings');

  // List with handle
  Sortable.create(document.getElementById('listWithHandle'), {
    handle: '.move-handle',
    filter: '.no-reorder',
    draggable: '.list-group-item',
    animation: 150
  });


  $('.action--edit').on('click', function(e) {
    var $this = $(this);
    var action = $this.parent('.list-group-item');
    $('.action--item.active').removeClass('callout');
    macroSettingsHtml.removeClass('callout');
    if (macroSettingsHtml.is(':visible') && !action.hasClass('active')) {
      macroSettingsHtml.slideToggle(toggleSpeed, function() {
        $('.action--item:not(.active)').css('opacity', '1');
        $('.action--item.active').removeClass('active');
        action.toggleClass('active');
        $('.action--item:not(.active)').css('opacity', notActiveOpacity);

        $(this).detach().insertAfter(action).slideToggle(toggleSpeed, function () {
          action.addClass('callout');
          macroSettingsHtml.addClass('callout');
        });
      });
    }
    else {
      if (!macroSettingsHtml.is(':visible')) {
        action.addClass('active');
      }
      macroSettingsHtml.detach().insertAfter(action).slideToggle(toggleSpeed, function() {
        if (macroSettingsHtml.is(':visible')) {
          $('.action--item:not(.active)').css('opacity', notActiveOpacity);
            action.addClass('callout');
            macroSettingsHtml.addClass('callout');
        }
        else {
          $('.action--item:not(.active)').css('opacity', '1');
          action.removeClass('active');
        }
      });
    }
  });

  $('.flex-button', '.macro-settings').on('click', function() {
    $('.action--item.active .action--edit').click();
  });

  $('.flex-button', '.new-macro-settings').on('click', function() {
    newMacroHtml.slideToggle(toggleSpeed, function() {
      newMacroHtml.hide().detach();
    });
  });

  $('.add-new__action-item').on('click', function() {
    newMacroHtml.insertAfter($(this));
    newMacroHtml.slideToggle(toggleSpeed);
  });

  // Detach and remove this item only after all event listhere has been registered on it.
  newMacroHtml.hide().detach();
});
