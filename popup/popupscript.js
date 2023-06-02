let originalUrl;

console.log('----------->target')

document.addEventListener('DOMContentLoaded', function() {
    // Retrieve the "No" and "Yes" buttons
    const noBtn = document.getElementById('noBtn');
    const yesBtn = document.getElementById('yesBtn');

    // Add click event listener to the "No" button
    noBtn.addEventListener('click', function(details) {
        chrome.storage.local.remove('targetUrl');
        window.close();
        // chrome.tabs.goBack(); // throws error if nothing to go back to
    });

    // Add click event listener to the "Yes" button
    yesBtn.addEventListener('click', function() {

        chrome.storage.local.get(['targetUrl'],function(localData){
            console.log(localData)
            if(localData.targetUrl){
                // chrome.storage.local.remove('targetUrl');
                console.log(localData.targetUrl)
                window.location.href = localData.targetUrl;
            }
        });



    });
});



// Function to send a message to the background script to get the original URL
function getOriginalUrlFromBackground(callback) {
    chrome.runtime.sendMessage({ action: 'getOriginalUrl' }, function(response) {
        const originalUrl = response.url;
        // Use the originalUrl value as needed
        console.log('Original URL:', originalUrl);
        callback(originalUrl);
    });
}

function formatUrlWithHttps(url) {
    // Check if the URL already starts with http:// or https://
    if (!/^https?:\/\//i.test(url)) {
        // If not, prepend the URL with https://
        url = "https://" + url;
    }
    return url;
}




chrome.storage.sync.get('unproductiveSites', function(result) {
    const sitesList = result.unproductiveSites || [];
    console.log(sitesList);
    for (var i = 0; i < sitesList.length; i++) {
        if(sitesList[i].indexOf(document.location.host)>-1){
            chrome.storage.local.remove('targetUrl');
        }
    }
});


// close popup tab directly,
if(document.location.href.indexOf('chrome-extension://')>-1){
    let _beforeUnload_time = 0, _gap_time = 0;
    window.onunload = function (){
        _gap_time = new Date().getTime() - _beforeUnload_time;
        if(_gap_time <= 5){
            chrome.storage.local.remove('targetUrl');
        }
    }
    window.onbeforeunload = function (){
        _beforeUnload_time = new Date().getTime();
    };
}
