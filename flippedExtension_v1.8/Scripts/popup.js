// Saves options to chrome.storage
function saveInfo2Storage(list) {
    // Save the list of checked checkBoxes
    chrome.storage.sync.set({
      info: list
    });

    /*
    // Get Saved list and print it over document to debug
    chrome.storage.sync.get(['info'], function(result) {
        document.write('Value currently is ' + result.info[0] + result.info[1]);
      });*/
  }

async function getInfobyPopup(endPointUrl) {
    var info = [];
    var schoolName = document.getElementById('school');
    var lectureCode = document.getElementById('lecture');
    var username = document.getElementById('user_name');
    var password = document.getElementById('psswrd');
    info.push(schoolName.value);
    info.push(lectureCode.value);
    info.push(username.value);
    info.push(password.value);
    info.push(endPointUrl);
    saveInfo2Storage(info);
}

function makeARequest(url){
    var request = new XMLHttpRequest(); // Create a request variable and assign a new XMLHttpRequest object to it.
    request.open('GET', url, true);
    request.onload = function () {
        var data = JSON.parse(String(this.response)); // Begin accessing JSON data here
        console.log('popup.js [DEBUG] data:', data);
        if (data['statusCode'] == 200){
            var html = "";
            if(data['log_in_type'] == 1){
                html = "../Htmls/student.html";
            }
            else if(data['log_in_type'] == 2){
                html = "../Htmls/admin.html";
            }
            getInfobyPopup(data['endPointUrl']).then(
                window.open(html, '_blank')
            );
        }
        
    }
    request.send();
}

// Button Clicked Event Function
document.addEventListener('DOMContentLoaded', function() {
    var link = document.getElementById('loginButton');
    link.addEventListener('click', function() {
        var username = document.getElementById('user_name');
        var password = document.getElementById('psswrd');
        var apiUrl = `https://q3r5pwrdc1.execute-api.us-east-2.amazonaws.com/prod/log-in?p1=${username.value}&p2=${password.value}`;
        console.log("[DEBUG] API URL: ", apiUrl);
        makeARequest(apiUrl);
    });
});
