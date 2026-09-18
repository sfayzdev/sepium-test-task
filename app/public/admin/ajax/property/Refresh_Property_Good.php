<?php

require_once dirname(dirname(dirname(dirname(__DIR__)))) . '/src/bootstrap.php';

header('Content-Type: text/html; charset=utf-8');

function renderPropertyHtml($property)
{
    $place = '';
    if (isset($property['place_prop']) && $property['place_prop'] != '') {
        $place = '<div class="field-help">' . h($property['place_prop']) . '</div>';
    }

    $idProp = h($property['id']);
    $nameProp = h($property['name_prop']);
    $allOption = '';

    if ($property['type_prop'] == '1') {
        return '<div class="property-field name_select_rielt" data-property="' . $idProp . '" data-property-id="' . $idProp . '">
            <div class="field-label name">' . $nameProp . '</div>
            ' . $place . '
            <input type="text" class="text-input add-inp ag_pole_good" placeholder="' . $nameProp . '">
        </div>';
    } elseif ($property['type_prop'] == '2') {
        $stmt = db()->prepare("SELECT * FROM property_answer_s WHERE id_prop = :id_prop ORDER BY sort_answer");
        $stmt->execute(array(':id_prop' => $idProp));

        while ($answer = $stmt->fetch()) {
            $allOption .= '<option value="' . h($answer['id']) . '">' . h($answer['answer_prop']) . '</option>';
        }

        return '<div class="property-field name_select_rielt" data-property="' . $idProp . '" data-property-id="' . $idProp . '">
            <div class="field-label name">' . $nameProp . '</div>
            ' . $place . '
            <select class="text-input ag_pole_good">
                <option value="">Не выбрано</option>' . $allOption . '
            </select>
        </div>';
    } elseif ($property['type_prop'] == '3') {
        $stmt = db()->prepare("SELECT * FROM property_answer_s WHERE id_prop = :id_prop ORDER BY sort_answer");
        $stmt->execute(array(':id_prop' => $idProp));
        $checkboxes = '';

        while ($answer = $stmt->fetch()) {
            $checkboxes .= '<label class="choice line_chek">
                <input type="checkbox">
                <span class="ckeck_param" data-val="' . h($answer['id']) . '">' . h($answer['answer_prop']) . '</span>
            </label>';
        }

        return '<div class="property-field name_select_rielt" data-property="' . $idProp . '" data-property-id="' . $idProp . '">
            <div class="field-label name">' . $nameProp . '</div>
            ' . $place . '
            <div class="choice-grid checkbox_property ag_pole_good">' . $checkboxes . '</div>
        </div>';
    } elseif ($property['type_prop'] == '4') {
        return '<div class="property-field name_select_rielt" data-property="' . $idProp . '" data-property-id="' . $idProp . '">
            <div class="field-label name">' . $nameProp . '</div>
            ' . $place . '
            <input type="text" inputmode="decimal" class="text-input add-inp ag_pole_good" placeholder="Числовое значение">
        </div>';
    }

    return '';
}

$selectedCats = array();
if (isset($_POST['category']) && is_array($_POST['category'])) {
    foreach ($_POST['category'] as $c) {
        $id = (int) $c;
        if ($id > 0) {
            $selectedCats[$id] = true;
        }
    }
}

$stmt = db()->query('SELECT * FROM property_s ORDER BY sort_prop');
$result = '';

while ($property = $stmt->fetch()) {
    $catPropRaw = isset($property['cat_prop']) ? trim((string)$property['cat_prop']) : '';
    if ($catPropRaw === '') {
        $result .= renderPropertyHtml($property);
        continue;
    }

    if (!empty($selectedCats)) {
        $ids = explode(',', $catPropRaw);
        foreach ($ids as $val) {
            $propCatId = (int) trim($val);
            if ($propCatId > 0 && isset($selectedCats[$propCatId])) {
                $result .= renderPropertyHtml($property);
                break;
            }
        }
    }
}

echo $result;