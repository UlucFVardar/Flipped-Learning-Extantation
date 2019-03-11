chrome.storage.sync.get(['info'], function(result) {

    // Get necessary variables from chrome storage
    var schoolName = result.info[0];
    var lectureCode = result.info[1];
    var username = String(result.info[2]);
    //password = result.info[3];
    var endPointUrl = result.info[4];
    var LoggedClass = `${schoolName.toUpperCase().replace(' ','')}:${lectureCode.toUpperCase().replace(' ','')}`
    var roomName ;
    var api = null;
    // ----- FUNCTIONS -----
    function to_Youtube(url){
        //document.getElementById( "homePageFrame").height=400
        try{api.dispose();}
        catch(err){a=0;}
        //var frame = document.getElementById('homePageFrame');
        //console.log(url)
        //frame.src=url;
        //frame.height=400
        //frame.allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture";
        console.log(url)
        
        temp = '<iframe width="600" height="400" src="'+url+'" frameborder="0" allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>';
        (document.getElementById('youtube-parent')).innerHTML = temp
    }
    function to_jistsi(rommName){
        (document.getElementById('youtube-parent')).innerHTML = ''
        //var frame = document.getElementById('homePageFrame');
        console.log(rommName)
        //frame.src = "https://meet.jit.si/"+rommName;
        
        console.log("https://meet.jit.si/"+rommName)
        
        var domain = "meet.jit.si";
        const parentElement = document.getElementById( "jitsiapi-parent");
        console.warn('parentElement', parentElement);
        var options = {
            roomName: rommName,
            width: 600,
            height: 400, //tabi aslinda ne olmasini istiyorsan yukseklik ve genisligin
            parentNode: parentElement,

            configOverwrite: {resolution: 240, // Bu 240 360 da olabilir tabii
                            constraints: {
                                video: {
                                    aspectRatio: 16 / 9,
                                    height: {
                                        ideal: 240, // Bu 240 360 da olabilir tabii
                                        max: 240,   // Bu 240 360 da olabilir tabii
                                        min: 240    
                                    }
                                }
                            }
                            },
            interfaceConfigOverwrite: {
                        filmStripOnly: true
                }
            }
        try{api.dispose();}
        catch(err){a=0;}            
        api = new JitsiMeetExternalAPI(domain, options);
    }
    // DEBUG --
    console.log("\n\n" + schoolName + " " + lectureCode + "\n\n");
    // ---

    document.getElementById('ClassCode').innerHTML = (schoolName + " " + lectureCode).toUpperCase()

    // WebSocket Connection Part
    var connection = new WebSocket(endPointUrl);
    connection.onopen = function () {
        // student infos json 
        studentInfos = {
            "ILoggedIn" : username,
            "LoggedClass" : LoggedClass
        }
        // Send the message 'Ping' to the server
        connection.send(JSON.stringify(studentInfos)); 
    };
    connection.onclose = function(event) {
        //console.log("WebSocket is closed now.");
        location.reload();
    };
    
    connection.onmessage = function (event) { 
        str = event.data
        MessageData= JSON.parse(str);
        console.log('gelen mesaj ' +str)
        if ( str.includes('assigned_url') ){
            if (str.includes('youtube'))
                document.getElementById("CallTeacher").style.display="none";
            else 
                document.getElementById("CallTeacher").style.display="block";            
            
            if ( MessageData["assigned_url"].includes('www.youtube.com/embed/') )
                to_Youtube(MessageData["assigned_url"])
            else{
                to_jistsi (MessageData["assigned_url"])
                roomName = MessageData["assigned_url"]
            }
        }
    };

    document.getElementById('CallTeacher').onclick = function() {
        messInfos = {
                "CallTeacher" : roomName,
                "LoggedClass" : LoggedClass
            }
        connection.send(JSON.stringify(messInfos));
    };


    setInterval(function(){
            connection.send("Connection-notDie");
            }, Math.floor(Math.random() * (120000 - 40000 + 1)) + 40000 );

});
