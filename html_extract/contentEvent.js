function hi(document){
    console.log(conbineAtt);
    console.log($(conbineAtt));
    $(conbineAtt).css("background-color", "yellow");
}
chrome.runtime.sendMessage({
    action: "getSource",
    source: hi(document)
});