var metacpan = {}
metacpan.recent = function(count, callback) {
	metacpan.get('http://api.metacpan.org/v0/release/_search?q=status:latest&fields=distribution,name,status,date,abstract&sort=date:desc&size=' + count, count, callback);
};

metacpan.release = function(query, callback) {
	metacpan.get("http://api.metacpan.org/v0/release/" + query, query, callback);
};

metacpan.get = function(url, query, callback) {
    xmlhttp = new XMLHttpRequest();
    xmlhttp.onreadystatechange = function() {
        if (xmlhttp.readyState == 4 && xmlhttp.status == 200) {
            console.log('responseText:' + xmlhttp.responseText);
			var data = JSON.parse(xmlhttp.responseText);
			callback(query, data);
        }
    }

    xmlhttp.open("GET", url, true);
    //setTimeout(function() {  xmlhttp.abort()  },40000);
    xmlhttp.send();
};

