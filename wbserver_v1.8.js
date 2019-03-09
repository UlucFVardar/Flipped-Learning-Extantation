var ws = require("nodejs-websocket")
var fs = require('fs');


/*
{
	"MEF:YETGENTEST" : {
							"InFlipped" : True,
							"LobbyLink" : "....", 	

							"UsersName" : [],
							"UsersConn" : [],
							"UsersKeys" : [],

							"AssisName" : [],
							"AssisConn" : [],
							"AssisKeys" : [],							

							"AdminName" : "....",
							"AdminConn" : "....",
							
							"UserFlpGroups" : [],  // roomnames with the same order UsersName

							"FlpGroups"	: {	
											"GroupName1" : [],
											"GroupName2" : []	
										  },
						    "FlpGjitsi" : {
											"GroupName1" : "link",
											"GroupName2" : "link"
						  			    }
					   },
	.
	.
	.
	.
	
}
*/
// format of LogedClass -> School:Class -> MEF:Yetgen
// parameter = MessageData.matchParameter // it can be a 'number' or 'random'
function initialClass() {
	temp = {} ;
	temp.InFlipped = false ; 
	temp.LobbyLink = '' ;
	temp.UsersName = [] ;
	temp.UsersKeys = [] ;
	temp.UsersConn = [] ;

	temp.AssisName = [] ; 
	temp.AssisConn = [] ;
	temp.AssisKeys = [] ;

	temp.AdminName = '' ;
	temp.AdminConn = null ; 
	temp.FlpGroups = {} ;
	temp.FlpGjitsi = {} ;
	return temp;
}

function searchGroup(studentMail,FlpGroups){
	for (var key in FlpGroups)
		if (studentMail in FlpGroups[key])
			return key
}

function createGroups( ClassOfUsers, userNames, numberOfStudentInARoom){
	//var copyUsers = JSON.parse(JSON.stringify(userNames));
	UserFlpGroups = []
	FlpGroups = {}
	FlpGjitsi = {}

	randomList = []
	counter = 1
	for (var i = 0; i < userNames.length; i++ ){
		groupName = 'Group'+String(counter)
		roomName = ClassOfUsers+String(counter)
		randomList.push( roomName )
		FlpGroups[groupName] = []
		FlpGjitsi[groupName] = roomName

		if (counter % numberOfStudentInARoom == 0)
			counter ++;
	}
	counter = 1
	for (var i = 0; i < userNames.length; i++){
		groupName = 'Group'+String(counter)

		randomIndex = getRandomInt(0,randomList.length)
		UserFlpGroups[i] = randomList[randomIndex]
		FlpGroups[groupName].push(userNames[i])
		randomList.splice(randomIndex, 1);
		if (counter % numberOfStudentInARoom == 0)
			counter ++;		
	}
	
	return UserFlpGroups, FlpGroups, FlpGjitsi ;
}

function loadGroups( ClassOfUsers, userNames, AdminFlpGroups){
	FlpGroups = AdminFlpGroups
	UserFlpGroups = []
	FlpGjitsi = {}
	for (var i = 0; i < userNames.length; i++ )
		UserFlpGroups.push('')
	for (var FlpGroup in FlpGroups){
		for (var studentName in FlpGroups[FlpGroup]){
			studentIndex = userNames.indexOf(studentName)
			UserFlpGroups[FlpGroup] = studentName
		}
	}
	counter = 1
	for (var FlpGroup in FlpGroups)
		FlpGjitsi[FlpGroup] = ClassOfUsers+String(counter++)

	return UserFlpGroups, FlpGroups, FlpGjitsi ; 
}

function callAllStudents_2_lobby(UsersConn, LobbyLink){
	for ( var i = 0; i < UsersConn.length; i++ )
		UsersConn[i].sendText(JSON.stringify({ "assigned_url" : LobbyLink }))
}


function getRandomInt(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min)) + min; //The maximum is exclusive and the minimum is inclusive
}


var All_Class_Infos = {}
var All_Conns = {}

var server = ws.createServer(function (conn) {
    conn.on("text", function (str) {
    	console.log("Message Recived!\n"+str+"\n\n------------------------------\n");
		MessageData= JSON.parse(str);
		LoggedClass = MessageData.LoggedClass

		//------------ LOG IN CASES ------------------------------------------------------
		if ( str.includes('ILoggedInAdmin') ){ // Admin Log in
			All_Conns[conn['key']] = LoggedClass
			adminMail  = MessageData.ILoggedInAdmin
			try{
				All_Class_Infos[LoggedClass].AdminName = adminMail
				All_Class_Infos[LoggedClass].AdminConn = conn
			}catch(err){
				All_Class_Infos[LoggedClass] = initialClass()
				All_Class_Infos[LoggedClass].AdminName = adminMail
				All_Class_Infos[LoggedClass].AdminConn = conn
				console.log("-------------\n"+LoggedClass+" class opened");
			}
			console.log("adminMail ->", adminMail)
			if (All_Class_Infos[LoggedClass].LobbyLink != '' )
				conn.sendText(JSON.stringify({ "assigned_url" : All_Class_Infos[LoggedClass].LobbyLink }))
			conn.sendText(JSON.stringify({ "OnlineStudents" : All_Class_Infos[LoggedClass].UsersName }))
		}
		else if ( str.includes('ILoggedIn') ){ //Student Log in 
			All_Conns[conn['key']] = LoggedClass
			studentMail  = MessageData.ILoggedIn
			// format of LoggedClass -> School:Class -> MEF:Yetgen
			try{
				All_Class_Infos[LoggedClass].UsersName.push(studentMail)
				All_Class_Infos[LoggedClass].UsersConn.push(conn)
				All_Class_Infos[LoggedClass].UsersKeys.push(conn['key'])
				
			}catch(err){
				//console.log(err);
				All_Class_Infos[LoggedClass] = initialClass()
				All_Class_Infos[LoggedClass].UsersName.push(studentMail)
				All_Class_Infos[LoggedClass].UsersConn.push(conn)
				All_Class_Infos[LoggedClass].UsersKeys.push(conn['key'])
				console.log("-------------\n"+LoggedClass+" class opened");
			}
			console.log("studentMail ->", studentMail)
			if ( All_Class_Infos[LoggedClass].InFlipped == false && All_Class_Infos[LoggedClass].LobbyLink != '' )
				conn.sendText(JSON.stringify({ "assigned_url" : All_Class_Infos[LoggedClass].LobbyLink }))
			else if ( All_Class_Infos[LoggedClass].InFlipped == true ){
				groupNameOfStudent = searchGroup(studentMail,All_Class_Infos[LoggedClass].FlpGroups)
				jitsiUrl = All_Class_Infos[LoggedClass].FlpGjitsi[groupNameOfStudent]
				conn.sendText(JSON.stringify({ "assigned_url" : jitsiUrl }))
			}
			if ( All_Class_Infos[LoggedClass].AdminConn != null)
				All_Class_Infos[LoggedClass].AdminConn.sendText(JSON.stringify({ "OnlineStudents" : All_Class_Infos[LoggedClass].UsersName }))
		}

		//--------------------------------------------------------------------------------

		//------------ MATCHING FIELDS ----------------------------------------------------
		else if ( str.includes('MatchAllClass') ){ //comes from Admin
			if (All_Class_Infos[adminClass].InFlipped == true ) 
				return;
			/*
			example 1 : 
			{
				"MatchAllClass" : "N" ,
				"numberOfStudentInARoom" : 5
			}
			-----------------
			example 2 : 
			{
				"MatchAllClass"  : "S" ,
				"AdminFlpGroups" : {	
										"GroupName1" : [],
										"GroupName2" : []	
					    			  }
			}
			*/
			parameter = MessageData.matchParameter // it can be a 'N'number or 'S' static
			if ( parameter == 'N' )
				UserFlpGroups, FlpGroups, FlpGjitsi = createGroups( LoggedClass, All_Class_Infos[LoggedClass].UsersName, MessageData.numberOfStudentInARoom )
			else if ( parameter == 'S' )
				UserFlpGroups, FlpGroups, FlpGjitsi = loadGroups( LoggedClass, All_Class_Infos[LoggedClass].UsersName, MessageData.AdminFlpGroups )
			else{
				console.log('!!!!------ [MatchAllClass Parameter ERROR] ------!!!')
				return;
			}
			All_Class_Infos[LoggedClass].UserFlpGroups = UserFlpGroups
			All_Class_Infos[LoggedClass].FlpGroups = FlpGroups
			All_Class_Infos[LoggedClass].FlpGjitsi = FlpGjitsi
			
			for ( var i = 0; i < UserFlpGroups.length; i++ )
				All_Class_Infos[LoggedClass].UsersConn[i].sendText(JSON.stringify({ "assigned_url" : UserFlpGroups[i] }))
			//Sending jitsi class urls to teacher
			All_Class_Infos[LoggedClass].AdminConn.sendText(JSON.stringify({ "GroupsUrls" : FlpGjitsi }))
			All_Class_Infos[LoggedClass].InFlipped = true
		}
		else if ( str.includes('CallBackClass') ){ //comes from Admin		
			callAllStudents_2_lobby( All_Class_Infos[LoggedClass].UsersConn, All_Class_Infos[LoggedClass].LobbyLink )
			//Asistanlarada lobyi gönder
			All_Class_Infos[LoggedClass].InFlipped = false

		}
		else if ( str.includes('CallTeacher')   ){ //comes from student
			calledGroupName  = MessageData.CallTeacher
			All_Class_Infos[LoggedClass].AdminConn.sendText(JSON.stringify({ "NeedTeacher" : calledGroupName }))
		}
		//--------------------------------------------------------------------------------

		//------------ SETTING -----------------------------------------------------------
		else if ( str.includes('SetYoutubeUrl') ){
			All_Class_Infos[LoggedClass].LobbyLink = MessageData["SetYoutubeUrl"]
			callAllStudents_2_lobby( All_Class_Infos[LoggedClass].UsersConn, All_Class_Infos[LoggedClass].LobbyLink )
		}
		//--------------------------------------------------------------------------------

	})
	conn.on("close", function (code, reason) {
		classofConn = All_Conns[conn['key']]
		if ( All_Class_Infos[classofConn].AdminConn['key'] == conn['key'] ){
			console.log("-----!!!!! ADMIN LOG OUT !!!!------ "+classofConn )
			All_Class_Infos[classofConn].AdminConn = null
			All_Class_Infos[classofConn].AdminName = ''
		}
		else if ( All_Class_Infos[classofConn].UsersConn['key'] == conn['key'] ){
			console.log("-----!!!!! USER LOG OUT !!!!------ "+classofConn )
			var index = All_Class_Infos[classofConn].UsersKeys.indexOf(conn['key']);
			All_Class_Infos[classofConn].UsersName.splice(index, 1);
			All_Class_Infos[classofConn].UsersKeys.splice(index, 1);
			All_Class_Infos[classofConn].UsersConn.splice(index, 1);
			All_Class_Infos[classofConn].AdminConn.sendText(JSON.stringify({ "OnlineStudents" : All_Class_Infos[classofConn].UsersName }))
		}
		else{
			//cıkan muhtelmen asistan
		}
    }
    )


} ).listen(3003)
