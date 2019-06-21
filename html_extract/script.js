$(function(){
    function childrenSearch(parent,parentId){
        if(parent.tagName !="CODE" && parent.tagName !="P" &&parent.tagName !="A" && parent.tagName !="SPAN" && parent.innerText != "" ){

            var beforeParentId = parentId;
            var parentILtag = '<li><span';
            var chilrenOLtag = '<ol';
            var children = parent.children;
            var parentTagName = parent.tagName.toLowerCase();
            if(parent.hasAttribute("id")){
                parentId = parent.tagName.toLowerCase()+ "__"+parent.getAttribute("id");
            }else{
                if(parent.hasAttribute("class")){
                    parentId += "____" +parent.tagName.toLowerCase() + "___" + parent.getAttribute("class");

                }else{
                    parentId += "____" +parent.tagName.toLowerCase()
                }
            }
            parentILtag += ' class="'+parentId;
            chilrenOLtag += ' class="'+parentId;
            if($(parent).css("background-color")){
                parentILtag += '" style="background-color:'+ $(parent).css("background-color");
            }
            parentILtag += '">';
            chilrenOLtag += '">';
            parentILtag +=parent.tagName +'</span></li>';
            chilrenOLtag += '</ol>';
            var createQueryId = beforeParentId;

            $("ol."+createQueryId).append(parentILtag);
            $("span." + parentId).after(chilrenOLtag);
            for(var i=0; i< children.length ; i++){
                //children의 갯수만큼 재귀 함수로 각 children을 parent처럼 돌린다.
                childrenSearch(children[i],parentId);
            }
        }
      }

    function replaceAll(str, searchStr, replaceStr) {
      return str.split(searchStr).join(replaceStr);
    }
      //button을 클릭하면, content page의 html을 글거온다.
    $('#test').click(function(){
        chrome.tabs.executeScript(null, {
            //body의 html가 callback 함수의 result 파라미터로 들어간다.
            code:' document.body.innerHTML;'
          },function(result){
            //해당 html String을 jquery로 hmtl object형식으로 바꿔준다.
            var domString = result[0];
            var html = $.parseHTML(domString);

            if (window.originPopup === undefined) {
                window.originPopup = document.getElementsByClassName("ol__contentBody").innerHTML;
            }
            else {
                document.getElementsByClassName("ol__contentBody").innerHTML = window.originPopup;
            }

            //각 html 태그의 하위노드에 뭐가 있는지 확인하고, 해당 tree구조를 보여준다.
            count = 0;
            for(var i = 0;i<html.length;i++){
                if(html[i].children){
                    childrenSearch(html[i],"ol__contentBody");
                }
            }

            alert("DOM Load Finish!");

            //** Add attrubute **/
            var conbineAtt = "";
            var colorOfAtt = "";
            var check = 0;
            $('span').hover(function () {
                if (check == 0) {
                    $(this).css('color', 'red');
                    if (conbineAtt) {
                        conbineAtt = "";
                    }
                    var targetTagId = this.getAttribute("class");
                    targetTagId = replaceAll(targetTagId, "____", " ");   // parent child 관게인 경우
                    targetTagId = replaceAll(targetTagId, "___", ".");  // class인 경우
                    targetTagId = replaceAll(targetTagId, "__", "#");   // id인 경우
                    conbineAtt = targetTagId;
                    colorOfAtt = $(this).css("background-color")
                    console.log("conbinAtt : " + conbineAtt + "colorOfAtt" + colorOfAtt);
                    chrome.tabs.executeScript(null, {
                        code: 'var conbineAtt = "' + conbineAtt + '";'
                    }, function () {
                        chrome.tabs.executeScript(null, {
                            file: 'jquery-3.1.0.min.js'
                        }, function () {
                            chrome.tabs.executeScript(null, {
                                file: 'contentEvent.js'
                            });
                        });
                    });
                }
                check = check + 1;
            }, function () {
                $(this).css('color', 'black');
                console.log("conbinAtt2 : " + conbineAtt);
                if (conbineAtt) {
                    console.log("conbinAtt2 : " + conbineAtt);
                    chrome.tabs.executeScript(null, {
                        code: 'var conbineAtt = "' + conbineAtt + '";' + 'var colorOfAtt = "' + colorOfAtt + '";'
                    }, function () {
                        chrome.tabs.executeScript(null, {
                            file: 'jquery-3.1.0.min.js'
                        }, function () {
                            chrome.tabs.executeScript(null, {
                                file: 'contentEvent2.js'
                            });
                        });
                    });
                }
                conbineAtt = "";
                colorOfAtt = "";
                check = 0;
            });
          });
    });


    $(document).ready(function(){
        /*** Add attribute ***/
        $("body").click(function(){
            var e = window.event;
            if (e.target) {
                targ=e.target;
            } else if (e.srcElement) {
                targ=e.srcElement;
            }
            var tname;
            tname = targ.tagName;

            if (tname.toUpperCase() != "SPAN") {
                return;
            }
            var targetTagName = $(targ).text();
            var targetTagId = targ.getAttribute("class");
            targetTagId = replaceAll(targetTagId, "____", " ");   // parent child 관게인 경우
            targetTagId = replaceAll(targetTagId, "___", ".");  // class인 경우
            targetTagId = replaceAll(targetTagId, "__", "#");   // id인 경우
            alert("this target tagName :" + targetTagName + "\nId is " + targetTagId);
        });
    });
});
