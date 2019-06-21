function hi(document){
    console.log(conbineAtt);
    console.log($(conbineAtt));
    $(conbineAtt).css("background-color", "yellow");
    $(conbineAtt).css("border", "10px solid blue");
}
chrome.runtime.sendMessage({
    action: "getSource",
    source: hi(document)
});