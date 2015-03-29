function get_next() {
    xmlhttp = new XMLHttpRequest();
    xmlhttp.onreadystatechange = function() {
        if (xmlhttp.readyState == 4 && xmlhttp.status == 200) {
            console.log('responseText:' + xmlhttp.responseText);
            //var response = JSON.parse(xmlhttp.responseText);
            //if (response["finished"]) {
            //    console.log('finished');
            //    return;
            //}
            //if (response["error"]) {
            //    console.log('Error: ' + response['error']);
            //}
            //console.log('request_id: ' + response["request_id"]);

            //var done = response["from"];
            //var total = response["max_id"];
            //if (response["limit"]) {
            //    done = response["result_scope_count"];
            //    total = response["limit"];
            //}

            //set_pogress_bar('create-file-progress-bar', done/total , done + ' / ' + total);
            //get_next(response["request_id"]);
        }
    }

    xmlhttp.open("GET", "http://api.metacpan.org/v0/release/Moose", true);
    //setTimeout(function() {  xmlhttp.abort()  },40000);
    xmlhttp.send();
}

