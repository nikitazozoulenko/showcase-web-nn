$(function() {
    menuModels=[]
    i=0;
    while (i<models.length) {
	menuModels.push({"title":models[i],"action":function(){window.location.href = "/"+this}.bind(models[i])})
	i++
    }
    $(document).contextmenu({
	delegate: "#container",
	autoFocus: true,
	preventContextMenuForPopup: true,
	preventSelect: true,
	taphold: true,
	menu: [
	    {cmd: "pause"},
	    {cmd: "fps"},
	    {cmd: "buffer"},
	    {title: "----"},
	    {title: "Facenet", children:[
		{cmd:"only_anchors"},
		{cmd:"use_nms"},
		{cmd:"threshhold", title:"Set threshhold"}
	    ]},
	    {title: "Models", children: menuModels}
	],
	select: function(event, ui) {
	    switch(ui.cmd) {
	    case "fps":
		showFPS=!showFPS
		break;
	    case "buffer":
		showBuffer=!showBuffer
		break
	    case "only_anchors":
		//config["only_anchors"]=!config["only_anchors"]
		setConfig("NNPARAMS","only_anchors",config["NNPARAMS"]["only_anchors"]? 0:1)
		break
	    case "use_nms":
		//config["use_nms"]=!config["use_nms"]
		setConfig("NNPARAMS","use_nms",config["NNPARAMS"]["use_nms"]? 0:1)
		break
	    case "pause":
		paused=!paused
		break
	    case "threshhold":
		$("#threshholdDialog").dialog("open")
		break
	    default:
		console.log("unknownd cmd "+ui.cmd)
		break;
	    }
	    updateElements()
	    //alert("select " + ui.cmd + " on " + ui.target.text());
	},
	beforeOpen: function(event, ui) {
	    var $menu = ui.menu,
		$target = ui.target,
		extraData = ui.extraData; // passed when menu was opened by call to open()
	    
	    // console.log("beforeOpen", event, ui, event.originalEvent.type);
	    
	    $(document)
	    //        .contextmenu("replaceMenu", [{title: "aaa"}, {title: "bbb"}])
	    //        .contextmenu("replaceMenu", "#options2")
	    //        .contextmenu("setEntry", "cut", {title: "Cuty", uiIcon: "ui-icon-heart", disabled: true})
		.contextmenu("setEntry", "pause", {uiIcon: pauseIcon(paused), title:paused ? "Play" : "Pause"})
		.contextmenu("setEntry", "fps", {uiIcon: checkBox(showFPS), title:"Show fps"})
		.contextmenu("setEntry", "buffer", {uiIcon: checkBox(showBuffer), title:"Show buffer"})
		.contextmenu("setEntry", "only_anchors", {uiIcon: checkBox(config["NNPARAMS"]["only_anchors"]), title:"Only anchors"})
		.contextmenu("setEntry", "use_nms", {uiIcon: checkBox(config["NNPARAMS"]["use_nms"]), title:"Use nms"})
	}
    });
    updateElements()
    $( "#threshholdSlider" ).slider({
	value:config["NNPARAMS"]["threshhold"],
	min: 0,
	max: 1,
	step: 0.01,
	slide: function( event, ui ) {
	    $("#threshholdValue").text(ui.value)
	},
	stop: function(event, ui) {
	    setConfig("NNPARAMS","threshhold", ui.value)
	}

    });
    $("#threshholdValue").text(config["NNPARAMS"]["threshhold"])
    $( "#threshholdDialog" ).dialog();
    $( "#threshholdDialog" ).dialog("close");
    $( "#imageDialog" ).dialog();
    $( "#imageDialog" ).dialog("close");

});

function setThreshhold() {
    
}
function updateElements() {
    $("#fpsbody").attr("style",showFPS ? "":"display:none;")
    $("#bufferbody").attr("style",showBuffer ? "":"display:none;")

}
function setConfig(section,key, value) {
    var xhr = new XMLHttpRequest;
    xhr.open("POST", "/stream/"+cid+"/setconf/"+section+"/"+key, false);
    xhr.onload = function(e) {
	if (xhr.responseText == "1") {
	    config[section][key]=value
	    console.log("config changed")
	}
    }
    xhr.send(value);
}
function pauseIcon(f) {
    return f ? "ui-icon ui-icon-play" : "ui-icon ui-icon-pause"
}
function checkBox(f) {
    if (f) {
	return "ui-icon ui-icon-check"
    } else {
	return "ui-icon ui-icon-close"
    }
}

showFPS=false
showBuffer=false

// "ui-icon ui-icon-heart"
