var ws = require("nodejs-websocket")
var fs = require('fs');

var admin_key = 'none'
var admin_conn  = 'none'
var admin_name = 'none'
var users_name = []
var users_key = []

function shuffle(a,b) {
    for (let i = a.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [a[i], a[j]] = [a[j], a[i]];
        [b[i], b[j]] = [b[j], b[i]];
    }
    return a,b;
}
function MatchAllClass(){
	a = {}
	users_name,users_key = shuffle(users_name,users_key);
	if( users_name.length % 2 == 0){
		var id = 0
		for(count = 0; count < users_name.length ; count = count +1 ){
			a[users_name[count]] = 'https://meet.jit.si/denemeeee'+ String(id)
			if (id % 2 == 0  &&	 id != 0 ){
				id = id +1
			}
		}
	}else{
		var id = 0
		for(count = 1; count < users_name.length ; count = count +1 ){
			a[users_name[count]] = 'https://meet.jit.si/denemeeee'+ String(id)
			if (id % 2 == 0  &&	 id != 0 ){
				id = id +1
			}
		}
		a[users_name[0]] =  'https://meet.jit.si/denemeeee0'
	}
	group = {}
	for(var i in a){
	    var key = i;
	    var val = a[i];
	    try{
	    	group[val].push(key);
		}
		catch(e){
			group[val] = []
		    group[val].push(key);
		}
	}
	a['GROUPS'] = group
	return a;
}
function MatchAllClass2(){
	var obj = JSON.parse(fs.readFileSync('./gruplar.json', 'utf8'));
	return obj
}
var server = ws.createServer(function (conn) {

	process.on('uncaughtException', function (err) {

	});
    conn.on("text", function (str) {
    	console.log('Mesaj geldi->'+str);
		if (str == 'MatchAll'){
			console.log("Hoca İsareti verdi "+str)
			a = MatchAllClass2()
			console.log(a)
			server.connections.forEach(function (conn) {
		    	conn.sendText(JSON.stringify(a))
			})
		}
		else if (str.includes('MatchBack') ){
			console.log("-------HOCA GERI CAGIRDI------\n");

			comeBack = {}
			var lobby = str.split("=")[1];
			console.log(lobby);
			for(count = 0; count < users_name.length ; count = count +1){
					comeBack[users_name[count]] = 'https://meet.jit.si/'+ String(lobby).replace(' ','')
	        	}
	        server.connections.forEach(function (conn) {
		    	conn.sendText(JSON.stringify(comeBack))
			})	
		}
		else if (str.includes('TeacherCall')){
			//admin_conn.sendText(str);
			
			admin_conn.sendText( 'TeacherCall-'+MatchAllClass2()['GROUPS'][ MatchAllClass2()[str.split('-')[1]] ] );
			console.log('TeacherCall-'+MatchAllClass2()['GROUPS'][ MatchAllClass2()[str.split('-')[1]] ] );
		}
		else if (str.includes('-ıamnot die')){
			
			console.log(str+'---olmemiis' + conn['key'])
		}
		else{
			if (str.includes('ADMIN')){
				admin_key = conn['key']
				admin_name = str
				admin_conn = conn
				console.log("-------\nADMIN LOG IN OLDU\n key :  " + admin_key + "\n------");
		        a = {}
		        a['update'] = users_name.toString()
		        admin_conn.sendText(JSON.stringify(a))					
		    }
			else if( users_name.indexOf(str) > -1 ) {
				console.log(" ")
			}else{
				users_name.push(str);
				users_key.push(conn['key'])
				console.log("-------\nYeni Kullanıcı Geldi\n name : "+ str +"\n key :  " + conn['key'] + "\n------\n");

				console.log("all users "+users_name.toString())
			    console.log("all users "+users_key.toString())
		        a = {}
		        a['update'] = users_name.toString()
		        admin_conn.sendText(JSON.stringify(a))			    
				}

			}
    
	})
	conn.on("close", function (code, reason) {
		if ( admin_key == conn['key']){
			console.log("admin cikti")
		}
		var index = users_key.indexOf(conn['key']);
		users_name.splice(index, 1);
		users_key.splice(index, 1);
		console.log("-------\nKullanıcı Cıktı\n kalanlar ; \n");
        console.log("all users "+users_name.toString())
        console.log("all users "+users_key.toString() + "\n------\n")
        a = {}
        a['update'] = users_name.toString()
        admin_conn.sendText(JSON.stringify(a))

        

    })
}).listen(3003)







