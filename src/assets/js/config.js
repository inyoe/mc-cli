require.config({
	paths: {
		'jquery': 'lib/jquery-3.3.1.min'
	}
})


//Load Module
;(function(){
	document.body.addEventListener('touchstart', function() {}, false);
	
	var moduleName,
		oScript = document.getElementById('rjs');
	if (oScript && oScript.nodeName == 'SCRIPT') {
		moduleName = oScript.getAttribute('data-module');
		if (moduleName) {
			require(['module/' + moduleName]);
		}
	}
}())