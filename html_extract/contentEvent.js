function hi(document){
    console.log(conbineAtt + "hoverout" + colorOfAtt);
    console.log($(conbineAtt));
    $(conbineAtt).css("background-color", colorOfAtt);
    $(conbineAtt).css("border", "");
    
}
chrome.runtime.sendMessage({
    action: "getSource",
    source: hi(document)
});
