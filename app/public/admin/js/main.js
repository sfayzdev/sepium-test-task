(function ($) {
    'use strict';

    function collectCategories() {
        var cats = [];

        $('.category_checked').each(function () {
            var slug = $(this).attr('data-category-chpu');
            if (slug) {
                cats.push(slug);
            }
        });

        return cats;
    }

    function collectPropertyValues() {
        var propertyMas = {};

        $('.name_select_rielt').each(function () {
            var propertyId = $(this).attr('data-property');
            if (!propertyId) return;

            
            if ($(this).find('.checkbox_property').length > 0) {
                var checkedValues = [];
                $(this).find('.line_chek input[type="checkbox"]:checked').each(function () {
                    var valId = $(this).closest('.line_chek').find('.ckeck_param').attr('data-val');
                    if (valId !== undefined && valId !== '') {
                        checkedValues.push(valId);
                    }
                });

                
                if (checkedValues.length > 0) {
                    propertyMas[propertyId] = checkedValues.join(':::');
                }
            } else {
                
                var $field = $(this).find('input.ag_pole_good, select.ag_pole_good').first();
                if ($field.length > 0) {
                    var val = $field.val();
                    if (val !== undefined && val !== null) {
                        var trimmed = $.trim(val);
                        
                        if (trimmed !== '') {
                            propertyMas[propertyId] = trimmed;
                        }
                    }
                }
            }
        });

        return propertyMas;
    }

    $('body').on('click', '.addgood_click', function () {
        var $button = $(this);

        $button.prop('disabled', true).text('Проверяем…');

        $.ajax({
            type: 'POST',
            url: './admin/ajax/Preview_Good_Payload.php',
            dataType: 'json',
            data: {
                cats: collectCategories(),
                property_mas: collectPropertyValues()
            },
            success: function (data) {
                $('.js-payload-preview').text(JSON.stringify(data, null, 2));
            },
            error: function () {
                $('.js-payload-preview').text('Не удалось проверить отправку.');
            },
            complete: function () {
                $button.prop('disabled', false).text('Проверить отправку');
            }
        });
    });
}(jQuery));