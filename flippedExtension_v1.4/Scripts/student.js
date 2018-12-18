 // Get Saved list and print it over document to debug
chrome.storage.sync.get(['info'], function(result) {
    console.log("\n\n"+result.info[0] + " " + result.info[1]+"\n\n");
    document.getElementById('classInfo').innerHTML = result.info[0] + " " + result.info[1]; 
    var USERNAME = String(result.info[2].split('@')[0]);

    var connection = new WebSocket(result.info[4]); // change this dimacily endPointUrl
    connection.onopen = function () {
        connection.send(USERNAME); // Send the message 'Ping' to the server
        document.getElementById('result0').value=USERNAME;
    };
    connection.onmessage = function (event) { 
        document.getElementById('homePageFrame').src=JSON.parse(event.data) [USERNAME];
    };
    var frame = document.getElementById('homePageFrame');
    frame.src=`https://meet.jit.si/${result.info[0].toUpperCase()}-${result.info[1].toUpperCase().replace(' ','')}-LOBBY`;
});
