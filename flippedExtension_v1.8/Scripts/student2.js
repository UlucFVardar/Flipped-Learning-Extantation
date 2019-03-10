var youtube_url
// Get Saved list and print it over document to debug
chrome.storage.sync.get(['info'], function(result) {
    console.log("\n\n"+result.info[0] + " " + result.info[1]+"\n\n");
    document.getElementById('classInfo').innerHTML = result.info[0] + " " + result.info[1]; 
    //var USERNAME = String(result.info[2].split('@')[0]);

    var USERNAME = String(result.info[2]);
    //var youtube_url


    function go_lobby(){
        var frame = document.getElementById('homePageFrame');
        frame.src=`https://meet.jit.si/${result.info[0].toUpperCase()}-${result.info[1].toUpperCase().replace(' ','')}-LOBBY`;
        document.getElementById("CallTeacher").style.display="none";
    }


    var connection = new WebSocket(result.info[4]); // change this dimacily endPointUrl
    //document.getElementById("CallTeacher").style.display="none";

    connection.onopen = function () {
        connection.send(USERNAME); // Send the message 'Ping' to the server
        document.getElementById('result0').value=USERNAME;
    };
    connection.onmessage = function (event) { 
        document.getElementById('homePageFrame').src=String(JSON.parse(event.data)[USERNAME]).split('+++')[1];
        if (event.data.includes('LOBBY'))
            document.getElementById("CallTeacher").style.display="none";
        else 
            document.getElementById("CallTeacher").style.display="block";

    };
    connection.onclose = function(event) {
        console.log("WebSocket is closed now.");
        location.reload();
    };

    document.getElementById('CallTeacher').onclick = function() {
        connection.send('TeacherCall-'+ USERNAME);
    };
    //go_lobby();
    

    setInterval(function(){
        connection.send(USERNAME+'-ıamnot die');
    }, Math.floor(Math.random() * (120000 - 40000 + 1)) + 40000 );


    
});
