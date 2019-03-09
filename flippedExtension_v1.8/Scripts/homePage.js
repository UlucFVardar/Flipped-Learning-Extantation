// Get Saved list and print it over document to debug
chrome.storage.sync.get(['info'], function(result) {
    document.getElementById('classInfo').innerHTML = result.info[0] + " " + result.info[1]; 
});

// Button Clicked Event Function
document.addEventListener('DOMContentLoaded', function() {
    var link = document.getElementById('matchMe');
    link.addEventListener('click', function() {
        // Get Saved list and print it over document to debug
        chrome.storage.sync.get(['info'], function(result) {
            var randomCode = document.getElementById('randomCode').value;
            //var chatRoomUrl = `https://meet.jit.si/${result.info[0].replace(' ','-').trim() +"-"+ result.info[1].replace(' ','-').trim() +"-"+ randomCode.replace(' ','-').trim()}`;
            var chatRoomUrl = `https://meet.jit.si/${result.info[0].replace(' ','-').trim() + result.info[1].replace(' ','-').trim() + randomCode.replace(' ','-').trim()}`;
            
            console.log(chatRoomUrl);
            //window.location.href = chatRoomUrl;
            var frame = document.getElementById('homePageFrame');
            frame.width = 600;
            frame.height = 400;
            frame.src=chatRoomUrl;
        });
    });
});


