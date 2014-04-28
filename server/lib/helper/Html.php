<?php
namespace lib\helper;

class Html
{
	public static function treeSelect($data, $value, $attributes = array())
	{
		$parentKey = $attributes['parent_key'];
		unset($attributes['parent_key']);
		$valueKey = $attributes['value_key'];
		unset($attributes['value_key']);
		$titleKey = $attributes['title_key'];
		unset($attributes['title_key']);
		return sprintf('<select %s>%s</select>', self::asAttributes($attributes), '<option value="">Изберете</option>' . self::getTreeOptions($data, $parentKey, $valueKey, $titleKey, $value));
	}
	
	protected static function getTreeOptions($tree, $parentKey, $valueKey, $titleKey, $value, $parentKeyValue = 0, $level = 0)
	{
		$html = '';
		if (empty($tree[$parentKeyValue]) || $level > 10) {
			return $html;
		}
		foreach ($tree[$parentKeyValue] as $leaf) {
			$html .= sprintf('<option value="%s" %s >%s</option>', $leaf[$valueKey], $value == $leaf[$valueKey] ? 'selected="selected"' : '', ($level ? '|' . str_repeat('-', $level) : '') . Html::escape($leaf[$titleKey]));
			$html .= self::getTreeOptions($tree, $parentKey, $valueKey, $titleKey, $value, $leaf[$valueKey], $level + 1);
		}
		
		return $html;
	}
	
	public static function asAttributes($array)
	{
		$names = array();
		foreach (array_keys($array) as $value) {
			$names[] = $value .'="%s"';
		}
		
		return vsprintf(implode(' ', $names), array_map('htmlspecialchars', array_values($array)));
	}
	
	public static function escape($str)
	{
		return htmlentities($str, ENT_QUOTES, 'UTF-8');
	}
	
	public static function displayErrors($errors)
	{
		$html = '<div class="errors">';
		foreach ($errors as $e) {
			$html .= '<p class="error">' . $e . '</p>';
		}
		$html .= '</div>';
		
		return $html;
	}
	
}