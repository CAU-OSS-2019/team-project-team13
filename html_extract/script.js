$(function(){
    var count = 0;
    function childrenSearch(parent,parentId){
        //console.log(parent.tagName+"count:"+count);
        //CODE인 부분은 제외하였다. 만약 children이 없는 경우(text이거나, leaf 노드일경우) 이 함수를 실행하지 않는다.
        if(parent.tagName !="CODE" && parent.tagName !="P" &&parent.tagName !="A" && parent.tagName !="SPAN" ){

            console.log(parent.tagName+"count:"+count);
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
            // console.log(parentILtag);
            // console.log(chilrenOLtag);
            
            // beforeParentId &&로 split한다음에 각각의 속성들을 조합하여, 해당 ol을 찾는다.
            //var splitId = beforeParentId.split("**");
            var createQueryId = beforeParentId;
            //for(var i=0; i<splitId.length-1; i++){
            //    createQueryId += splitId[i] + ">";
            //}
            //createQueryId += splitId[i];
            // console.log(createQueryId);
            // console.log(parentId);
            count = count +1;
            $("ol."+createQueryId).append(parentILtag);
            //console.log($("span." + parentId));
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
            $('li span').hover(function () {
                if (check == 0) {
                    $(this).css('color', 'red');
                    if (conbineAtt) {
                        conbineAtt = "";
                    }
                    //id의 value를 id와 class로 나누고, content page에서 해당 id값을 가진 곳을 가르켜보자
                    var classify = this.getAttribute("class").split("____");
                    var idClassify = "__";
                    var classClassify = "___";
                    console.log(this);
                    for (var i = 0; i < classify.length - 1; i++) {
                        if (classify[i].indexOf(idClassify) > -1) {
                            var temp_id = classify[i].split(idClassify);
                            conbineAtt += temp_id[0] + "#" + temp_id[1] + " ";
                        } else {
                            if (classify[i].indexOf(classClassify) > -1) {
                                var temp_id = classify[i].split(classClassify);
                                conbineAtt += temp_id[0] + "." + temp_id[1] + " ";
                            } else {
                                conbineAtt += classify[i] + " ";
                            }
                        }
                    }
                    if (classify[i].indexOf(idClassify) > -1) {
                        var temp_id = classify[i].split(idClassify);
                        conbineAtt += temp_id[0] + "#" + temp_id[1];
                    } else {
                        if (classify[i].indexOf(classClassify) > -1) {
                            var temp_id = classify[i].split(classClassify);
                            conbineAtt += temp_id[0] + "." + temp_id[1];
                        } else {
                            conbineAtt += classify[i];
                        }
                    }
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
            console.log(e);
            if (e.target) {
                targ=e.target;
            } else if (e.srcElement) {
                targ=e.srcElement;
            }

            var tname;
            tname = targ.tagName;

            if (tname.toUpperCase() !== "LI") {
                return;
            }

            var t = document.createElement("textarea");
            document.body.appendChild(t);
            t.value = targ.getAttribute("id");
            t.value = replaceAll(t.value, "__", "#");   // id인 경우
            t.value = replaceAll(t.value, "___", ".");  // class인 경우
            t.value = replaceAll(t.value, "____", " ");   // parent child 관게인 경우
            t.select();
            document.execCommand('copy');
            document.body.removeChild(t);
            alert("this target tagName :" + tname + "\nId is " + targ.getAttribute("id"));
        });
    });
});
