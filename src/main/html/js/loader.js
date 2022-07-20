
(function(g,b,d){
    //flag
    var useMinified = false;
	var rootpath = 	window.location.protocol + "//" + window.location.hostname + ":"+ window.location.port + "/html/";
    //Change the path here to suit your deployment
    var path = 	window.location.protocol + "//" + window.location.hostname + ":"+ window.location.port + "/html/js/";
    //labjs code
	var libPath = path + "//" + "/lib//";
    var c=b.head||b.getElementsByTagName("head"),D="readyState",E="onreadystatechange",F="DOMContentLoaded",G="addEventListener",H=setTimeout;
    function f(){
        var s = document.createElement('link');
        //s.id = 'cbeCSS';s.type = 'text/css';s.rel = 'stylesheet';s.href = path + 'css/cbe.css';document.getElementsByTagName("head")[0].appendChild(s);

        if(useMinified){
                 $LAB.script(libPath + "jquery.min.js")
                .script(libPath + "jquery.dataTables.min.js")
				.script(libPath + "selectize.min.js")
				.script(libPath + "jqueryShorten.min.js")
                .script(libPath + "bootstrap.min.js")
				.script(libPath + "angular.min.js")
				.script(libPath + "angular-cookies.min.js")
				.script(libPath + "angular-route.min.js")
                .script(libPath + "angular-resource.min.js")
				 .script(libPath + "angular-messages.min.js")
				.script(libPath + "angular-sanitize.min.js")
				.script(libPath + "angular-selectize.min.js")
                .script(libPath + "angular-datepicker.min.js")
				.script(path + "/dist/midasfusion-1.0.0.js").wait()
                .script(rootpath + "futuremaker.js")  
                .wait(function(){MidasFusionInit()});
				
				
        }else{
                           $LAB.script(libPath + "jquery.min.js")
                .script(libPath + "jquery.dataTables.min.js")
				.script(libPath + "selectize.min.js")
				.script(libPath + "jqueryShorten.min.js")
                .script(libPath + "bootstrap.min.js")
				.script(libPath + "angular.min.js")
				.script(libPath + "angular-cookies.min.js")
				.script(libPath + "angular-route.min.js")
                .script(libPath + "angular-resource.min.js")
				 .script(libPath + "angular-messages.min.js")
				.script(libPath + "angular-sanitize.min.js")
				.script(libPath + "angular-selectize.min.js")
                .script(libPath + "angular-datepicker.min.js")
				.script(path + "/dist/midasfusion-1.0.0.js").wait()
                .script(rootpath + "futuremaker.js")  
                .wait(function(){MidasFusionInit()});
        }
    };
    H(function(){if("item"in c){if(!c[0]){H(arguments.callee,25);return}c=c[0]}var a=b.createElement("script"),e=false;a.onload=a[E]=function(){if((a[D]&&a[D]!=="complete"&&a[D]!=="loaded")||e){return false}a.onload=a[E]=null;e=true;f()};
        a.src=rootpath+"js/LAB.min.js";
        c.insertBefore(a,c.firstChild)},0);if(b[D]==null&&b[G]){b[D]="loading";b[G](F,d=function(){b.removeEventListener(F,d,false);b[D]="complete"},false)}
})(this,document);
