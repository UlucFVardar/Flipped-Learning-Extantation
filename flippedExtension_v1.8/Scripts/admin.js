
chrome.storage.sync.get(['info'], function(result) {
    // Get necessary variables from chrome storage
    schoolName = result.info[0];
    lectureCode = result.info[1];
    username = String(result.info[2]);
    //password = result.info[3];
    endPointUrl = result.info[4];
    GroupsUrls = {}
    var lobby ;
    var api = null;

    var LoggedClass = `${schoolName.toUpperCase().replace(' ','')}:${lectureCode.toUpperCase().replace(' ','')}`

    
    // ----- FUNCTIONS -----
    function to_Youtube(url){
        //document.getElementById( "homePageFrame").height=400
        if(api != null)
            api.dispose();
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
        api = new JitsiMeetExternalAPI(domain, options);
    }    
    function add_table_new_Student(name){
        let table = document.getElementById("tableId");
        // --- to delete
        var node = document.getElementById("tableBody");
        while (node.hasChildNodes()) {
          node.removeChild(node.lastChild);
        }
        // ---
        var studentsNames = name
        for (count = 0 ; count < studentsNames.length ; count = count +1 ){
            if (studentsNames[count].length <=0 ){
                continue;
            }
            let row2 = table.insertRow(0);
            let cell1 = row2.insertCell(0);
            cell1.innerHTML = studentsNames[count];
            cell1.bgColor = "White";
        }
        let row2 = table.insertRow(0);
        let cell1 = row2.insertCell(0);
        cell1.innerHTML = 'Online Students';
    }

    function add_groups_to_table(data){
        let table = document.getElementById("grouptable");
        // --- to delete
        var node = document.getElementById("grouptableBody");
        while (node.hasChildNodes()) {
          node.removeChild(node.lastChild);
        }
        // ---
        var createClickHandler = function(table,row,groupJitsiURL) {    return function() { 
                            for (count = 0 ; count < table.rows.length ; count ++){
                                table.rows[count].getElementsByTagName("td")[0].bgColor = "GREEN";
                            }
                            row.getElementsByTagName("td")[0].bgColor = "YELLOW";
                            to_jistsi(groupJitsiURL)
                            };
        };                            
        var createClickHandler2 = function(table,row,groupJitsiURL) {    return function() { 
                            for (count = 0 ; count < table.rows.length ; count ++){
                                table.rows[count].getElementsByTagName("td")[0].bgColor = "GREEN";
                            }
                            row.getElementsByTagName("td")[0].bgColor = "YELLOW";
                            to_Youtube(groupJitsiURL)
                            };                            
        };
        var Groups = data
        for(var i in Groups){
            var groupNames = i;
            var groupJitsiURL = (Groups[i]).toString();
            
            let row2 = table.insertRow(0);
            let cell1 = row2.insertCell(0);
            cell1.innerHTML = groupNames;
            cell1.bgColor = "White";
            //---
            row2.onclick = createClickHandler(table,row2,groupJitsiURL);
            //---
        }

        let row2 = table.insertRow(0);
        let cell1 = row2.insertCell(0);
        cell1.innerHTML = 'Students Groups';
        cell1.bgColor = "YELLOW";
        row2.onclick = createClickHandler2(table,row2, lobby);
    }

    function to_back_for_allClass(){
        var frame = document.getElementById('homePageFrame');
        frame.src=`https://meet.jit.si/${schoolName.toUpperCase().replace(' ','')}-${lectureCode.toUpperCase().replace(' ','')}-LOBBY`;
        connection.send('MatchBack='+`${schoolName.toUpperCase().replace(' ','')}-${lectureCode.toUpperCase().replace(' ','')}-LOBBY`);
    }

    function to_back_for_admin(){
        var frame = document.getElementById('homePageFrame');
        frame.src=`https://meet.jit.si/${schoolName.toUpperCase().replace(' ','')}-${lectureCode.toUpperCase().replace(' ','')}-LOBBY`;
    }

    function make_group_red(name_of_one_student){
        let rows = document.getElementById("grouptable").rows;
        for (c = 1 ; c < rows.length ; c ++){
            if ( (rows[c].getElementsByTagName("td")[0].innerHTML).includes(name_of_one_student) ){
                rows[c].getElementsByTagName("td")[0].bgColor = "RED";
                break;
            }
        }
    }

    // DEBUG --
    console.log("\n\n" + schoolName + " " + lectureCode + username + "\n\n");
    // ---
    document.getElementById('ClassCode').innerHTML = (schoolName + " " + lectureCode).toUpperCase()

    // WebSocket Connection Part
    var connection = new WebSocket(endPointUrl);
    connection.onopen = function () {
        // student infos json 
        adminInfos = {
            "ILoggedInAdmin" : username,
            "LoggedClass" : `${schoolName.toUpperCase().replace(' ','')}:${lectureCode.toUpperCase().replace(' ','')}`
        }
        // Send the message 'Ping' to the server
        connection.send(JSON.stringify(adminInfos)); 
    };
    connection.onclose = function(event) {
        console.log("WebSocket is closed now.");
        location.reload();
    };



    // - --------- BUTTON EVENTS ------------
    document.getElementById('youtubelinksubmit').onclick = function() {
        messInfos = {
            "SetYoutubeUrl" : document.getElementById('youtubeurl').value,
            "LoggedClass" : LoggedClass
        }
        // Send the message 'Ping' to the server
        connection.send(JSON.stringify(messInfos));
        to_Youtube(messInfos.SetYoutubeUrl)
        lobby = messInfos.SetYoutubeUrl
    };

    document.getElementById('match_all').onclick = function() {
        messInfos = {
            "MatchAllClass" : true,
            "matchParameter" : document.getElementById('matchType').value.split('-')[0],
            "numberOfStudentInARoom" :  Number(document.getElementById('matchType').value.split('-')[1]),
            "LoggedClass" : LoggedClass
        }
        // Send the message 'Ping' to the server
        if (messInfos.matchParameter != '')
            connection.send(JSON.stringify(messInfos));
    };   
    document.getElementById('match_back').onclick = function() {
        messInfos = {
            "CallBackClass" : true,
            "LoggedClass" : LoggedClass
        }
        // Send the message 'Ping' to the server
        if (messInfos.matchParameter != '')
            connection.send(JSON.stringify(messInfos));
    }; 
    document.getElementById('matchTypeButton').onclick = function() {
        messInfos = {
            "set_flipParams" : true,
            "matchParameter" : document.getElementById('matchType').value.split('-')[0],
            "numberOfStudentInARoom" :  Number(document.getElementById('matchType').value.split('-')[1]),
            "LoggedClass" : LoggedClass
        }
        // Send the message 'Ping' to the server
        if (messInfos.matchParameter != '')
            connection.send(JSON.stringify(messInfos));
    }; 
    //------------------------------------------- 


    connection.onmessage = function (event) {
        str = event.data
        console.log('gelen mesaj ' +str)
        MessageData = JSON.parse(str)
        if (str.includes('OnlineStudents')){
            OnlineStudents = MessageData['OnlineStudents'];
            add_table_new_Student(OnlineStudents);
        }
        else if (str.includes('GroupsUrls')){
            GroupsUrls = MessageData['GroupsUrls']
            add_groups_to_table( GroupsUrls )
        }
        else if ( str.includes('assigned_url') ){
            if ( MessageData["assigned_url"].includes('www.youtube.com/embed/') ){
                to_Youtube(MessageData["assigned_url"])
                lobby = MessageData["assigned_url"]
                document.getElementById('youtubeurl').value = MessageData["assigned_url"]
            }
            else
                to_jistsi (MessageData["assigned_url"])
        }
        else if ( str.includes('flipParams') ){
             document.getElementById('matchType').value = MessageData['flipParams']
        }
    };

    

/*
    connection.onclose = function(event) {
        console.log("WebSocket is closed now.");
        location.reload();
    };

    connection.onmessage = function (event) {
        if (event.data.includes('update')){
            document.getElementById('onlineStudents').value = String(JSON.parse(event.data)['update']);
            add_table_new_Student( String(JSON.parse(event.data)['update']));
        }else if (event.data.includes('TeacherCall')){
            console.log('HOCA CAGRILDI')
            make_group_red(event.data.split('-')[1]);
        }else{
            document.getElementById('result0').value = event.data
            add_groups_to_table(JSON.parse(event.data))
        }
        //document.getElementById('homePageFrame').src=JSON.parse(event.data)['ADMIN'];
    };


    console.log(document.getElementById('match_all'));
    document.getElementById('match_all').onclick = function() {
        connection.send('MatchAll');
    };

    document.getElementById('match_back').onclick = function() {
        to_back_for_allClass();
    };

    to_back_for_admin();

    setInterval(function(){
        connection.send(username+'-ıamnot die');
    }, Math.floor(Math.random() * (120000 - 40000 + 1)) + 40000 );
*/
});