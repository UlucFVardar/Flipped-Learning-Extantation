// Get Saved list and print it over document to debug
var connection;

//window.onload = add_table_new_Student();


chrome.storage.sync.get(['info'], function(result) {
    function add_table_new_Student(name){

        let table = document.getElementById("tableId");
        // --- to delete
        var node = document.getElementById("tableBody");
        while (node.hasChildNodes()) {
          node.removeChild(node.lastChild);
        }
        // ---
        var studentsNames = name.split(',')
        for (count = 0 ; count < studentsNames.length ; count = count +1 ){
            if (studentsNames[count].length <=0 ){
                continue;
            }
            let row2 = table.insertRow(0);
            let cell1 = row2.insertCell(0);
            cell1.innerHTML = studentsNames[count];
            cell1.bgColor = "GREEN";
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
        var createClickHandler = function(table,row,key) {    return function() { 
                            for (count = 0 ; count < table.rows.length ; count ++){
                                table.rows[count].getElementsByTagName("td")[0].bgColor = "GREEN";
                            }
                            row.getElementsByTagName("td")[0].bgColor = "YELLOW";
                            var frame = document.getElementById('homePageFrame');
                            frame.src = key;
                            };
        };
        var Groups = data['GROUPS']
        for(var i in Groups){
            var key = i;
            var val = (Groups[i]).toString();
            
            let row2 = table.insertRow(0);
            let cell1 = row2.insertCell(0);
            cell1.innerHTML = val;
            cell1.bgColor = "GREEN";
            //---
            row2.onclick = createClickHandler(table,row2,key);
            //---
        }

        let row2 = table.insertRow(0);
        let cell1 = row2.insertCell(0);
        cell1.innerHTML = 'Students Groups';
        cell1.bgColor = "YELLOW";
        row2.onclick = createClickHandler(table,row2,`https://meet.jit.si/${result.info[0].toUpperCase().replace(' ','')}-${result.info[1].toUpperCase().replace(' ','')}-LOBBY`);
    }
    function to_back_for_allClass(){
        var frame = document.getElementById('homePageFrame');
        frame.src=`https://meet.jit.si/${result.info[0].toUpperCase().replace(' ','')}-${result.info[1].toUpperCase().replace(' ','')}-LOBBY`;
        connection.send('MatchBack='+`${result.info[0].toUpperCase().replace(' ','')}-${result.info[1].toUpperCase().replace(' ','')}-LOBBY`);
    }
    function to_back_for_admin(){
        var frame = document.getElementById('homePageFrame');
        frame.src=`https://meet.jit.si/${result.info[0].toUpperCase().replace(' ','')}-${result.info[1].toUpperCase().replace(' ','')}-LOBBY`;
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

    console.log("\n\n"+result.info[0] + " " + result.info[1]+"\n\n");
    document.getElementById('classInfo').innerHTML = result.info[0] + " " + result.info[1]; 
    var USERNAME = `${result.info[0].toUpperCase().replace(' ','')}-${result.info[1].toUpperCase().replace(' ','')}-ADMIN`;


    connection = new WebSocket(result.info[4]); // change this dimacily endPointUrl
    connection.onopen = function () {
        connection.send(USERNAME); // Send the message 'Ping' to the server
        document.getElementById('result0').value=USERNAME;
    };
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
});


// ** ASK THIS! **

//document.getElementById('match_all').onclick = function() {connection.send('MatchAll');};
//document.getElementById('match_back').onclick = function() {connection.send('MatchBack='+`${result.info[0].toUpperCase()}-${result.info[1].toUpperCase()}-LOBBY`);};
