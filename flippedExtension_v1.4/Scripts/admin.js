// Get Saved list and print it over document to debug
var connection;
chrome.storage.sync.get(['info'], function(result) {
    console.log("\n\n"+result.info[0] + " " + result.info[1]+"\n\n");
    document.getElementById('classInfo').innerHTML = result.info[0] + " " + result.info[1]; 
    var USERNAME = `${result.info[0].toUpperCase().replace(' ','')}-${result.info[1].toUpperCase().replace(' ','')}-ADMIN`;


    connection = new WebSocket(result.info[4]); // change this dimacily endPointUrl
    connection.onopen = function () {
        connection.send(USERNAME); // Send the message 'Ping' to the server
        document.getElementById('result0').value=USERNAME;
    };

    connection.onmessage = function (event) { 
        if (event.data.includes('update')){
            document.getElementById('result1').value = JSON.parse(event.data)['update'];
        }else{
            document.getElementById('result0').value = event.data
        }
        //document.getElementById('homePageFrame').src=JSON.parse(event.data)['ADMIN'];
    };

    console.log(document.getElementById('match_all'));
    document.getElementById('match_all').onclick = function() {
        connection.send('MatchAll');
    };
    document.getElementById('match_back').onclick = function() {
        connection.send('MatchBack='+`${result.info[0].toUpperCase().replace(' ','')}-${result.info[1].toUpperCase().replace(' ','')}-LOBBY`);
    };

    var frame = document.getElementById('homePageFrame');
    frame.src=`https://meet.jit.si/${result.info[0].toUpperCase().replace(' ','')}-${result.info[1].toUpperCase().replace(' ','')}-LOBBY`;
});


// ** ASK THIS! **

//document.getElementById('match_all').onclick = function() {connection.send('MatchAll');};
//document.getElementById('match_back').onclick = function() {connection.send('MatchBack='+`${result.info[0].toUpperCase()}-${result.info[1].toUpperCase()}-LOBBY`);};
