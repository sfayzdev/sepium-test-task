(function ($) {
    'use strict';

    function getStoredValues() {
        var values = {};

        $('.property_all .name_select_rielt').each(function () {
            var propId = $(this).attr('data-property');
            if (!propId) return;

            if ($(this).find('.checkbox_property').length > 0) {
                var checkedArr = [];
                $(this).find('.line_chek input[type="checkbox"]:checked').each(function () {
                    var valId = $(this).closest('.line_chek').find('.ckeck_param').attr('data-val');
                    if (valId) checkedArr.push(valId);
                });
                values[propId] = { type: 'checkbox', val: checkedArr };
            } else {
                var $field = $(this).find('input.ag_pole_good, select.ag_pole_good').first();
                if ($field.length > 0) {
                    values[propId] = { type: 'value', val: $field.val() };
                }
            }
        });

        return values;
    }

    function restoreValues(values) {
        $('.property_all .name_select_rielt').each(function () {
            var propId = $(this).attr('data-property');
            if (!propId || !values[propId]) return;

            var saved = values[propId];

            if (saved.type === 'checkbox' && Array.isArray(saved.val)) {
                $(this).find('.line_chek').each(function () {
                    var $chk = $(this).find('input[type="checkbox"]');
                    var valId = $(this).find('.ckeck_param').attr('data-val');
                    if ($.inArray(valId, saved.val) !== -1) {
                        $chk.prop('checked', true);
                    }
                });
            } else if (saved.type === 'value') {
                $(this).find('input.ag_pole_good, select.ag_pole_good').first().val(saved.val);
            }
        });
    }

    $('body').on('change', '.js-category', function () {
        var category = [];
        var $properties = $('.property_all');

        $(this).closest('.add_good_name_category')
            .toggleClass('category_checked is-selected', this.checked);

        $('.category_checked').each(function () {
            category.push($(this).attr('data-category-id'));
        });

        var savedValues = getStoredValues();

        $properties.addClass('is-loading').attr('aria-busy', 'true');

        $.ajax({
            type: 'POST',
            url: './admin/ajax/property/Refresh_Property_Good.php',
            dataType: 'html',
            data: { category: category },
            success: function (data) {
                if ($.trim(data) !== '') {
                    $properties.html(data);
                    restoreValues(savedValues);
                } else {
                    $properties.html('<div class="empty-state">Характеристик нет</div>');
                }
            },
            error: function () {
                $properties.html('<div class="error-state">Не удалось обновить характеристики.</div>');
            },
            complete: function () {
                $properties.removeClass('is-loading').attr('aria-busy', 'false');
            }
        });
    });
}(jQuery));