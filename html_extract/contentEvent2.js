function hi(document){
    console.log(conbineAtt + "hoverout" + colorOfAtt);
    console.log($(conbineAtt));
    $(conbineAtt).css("background-color", colorOfAtt);
}
chrome.runtime.sendMessage({
    action: "getSource",
    source: hi(document)
});