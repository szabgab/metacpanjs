var metacpan = {}
metacpan.search = function(query, callback) {

    xmlhttp = new XMLHttpRequest();
    xmlhttp.onreadystatechange = function() {
        if (xmlhttp.readyState == 4 && xmlhttp.status == 200) {
            console.log('responseText:' + xmlhttp.responseText);
			var data = JSON.parse(xmlhttp.responseText);
			callback(query, data);
        }
    }

    xmlhttp.open("GET", "http://api.metacpan.org/v0/release/" + query, true);
    //setTimeout(function() {  xmlhttp.abort()  },40000);
    xmlhttp.send();
};

