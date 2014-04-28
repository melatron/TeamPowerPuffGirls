<?php
namespace lib;

use lib\helper\ArrayHelper;
class Controller
{ 
	protected $vars;
	
	protected $layout = 'layout';
	
	public function __get($name)
	{
		if (isset($this->vars[$name]))
			return $this->vars[$name];
	}
	
	protected $cssFiles = [];
	protected $css = [];
	protected $jsFiles = [];
	protected $js = [];
	
	protected function render($view, $useLayout = true)
	{
		$file = $this->getViewFileName($view);
		$layout = $this->getLayoutFileName();
		
		ob_start();
		require $file;
		$this->content = ob_get_clean();
		if ($this->layout && $useLayout) {
			ob_start();
			require $layout;
			while (ob_get_level()) {
				echo ob_get_clean();
			}
		} else {
			echo $this->content;
		}
	}
	
	protected function redirect($params = array())
	{
		header('Location:' . Application::getUrl($params));
		exit();
	}
	
	protected function getBaseViewPath()
	{
		return Application::getSetting(Application::BASE_PATH) . DIRECTORY_SEPARATOR . 'views';
	}
	
	protected function getViewPath()
	{
		$path = explode('\\', get_class($this));
		$file = array_pop($path);
		return $this->getBaseViewPath() . DIRECTORY_SEPARATOR . Utils::getAsParam($file);
	}
	
	protected function getViewFileName($view)
	{
		return $this->getViewPath() . DIRECTORY_SEPARATOR . $view . '.php';
	}
	
	protected function getLayoutFileName()
	{
		return $this->getBaseViewPath() . DIRECTORY_SEPARATOR . 'layouts' . DIRECTORY_SEPARATOR . $this->layout . '.php';
	}
	
	public function notFound($die = true)
	{
		header('HTTP/1.0 404 Not Found');
		echo  'Route ', ArrayHelper::getFromArray($_GET, 'route'), ' can not be resolved', PHP_EOL;
		$die && Application::end();
	}
}
