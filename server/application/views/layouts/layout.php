<!DOCTYPE html PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN" "http://www.w3.org/TR/html4/loose.dtd">
<html>
<head>
<meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
<title>Ajax examples</title>
<?php foreach ($this->cssFiles as $value):?>
<link rel="stylesheet" type="text/css" href="<?php echo $value ?>">
<?php endforeach;?>
<?php foreach ($this->css as $value):?>
<style type="text/css">
	<?php echo $value ?>
</style>
<?php endforeach;?>
</head>
<body>
<?php echo $this->content?>
</body>
<?php foreach ($this->jsFiles as $value):?>
<script type="text/javascript" src="<?php echo $value?>"></script>
<?php endforeach;?>
<?php foreach ($this->js as $value):?>
<script type="text/javascript">
<?php echo $value?>
</script>
<?php endforeach;?>
</html>