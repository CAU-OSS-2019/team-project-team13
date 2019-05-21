$(function(){
    var count = 0;
    function childrenSearch(parent,parentId){
        console.log(parent.tagName+"count:"+count);
        //CODE인 부분은 제외하였다. 만약 children이 없는 경우(text이거나, leaf 노드일경우) 이 함수를 실행하지 않는다.
        if(parent.tagName !="CODE"){
            var beforeParentId = parentId;
            var parentILtag = '<li';
            var chilrenOLtag = '<ol';
            var children = parent.children;
            var parentTagName = parent.tagName.toLowerCase();
            if(parent.hasAttribute("id")){
                parentId = parent.tagName.toLowerCase()+ "__"+parent.getAttribute("id");
            }else{
                if(parent.hasAttribute("class")){
                    parentId += "**" +parent.tagName.toLowerCase() + "__" + parent.getAttribute("class");

                }else{
                    parentId += "**" +parent.tagName.toLowerCase()
                }
            }
            parentILtag += ' id="'+parentId;
            chilrenOLtag += ' id="'+parentId;
            parentILtag += '">';
            chilrenOLtag += '">';
            parentILtag += parent.tagName +'</li>';
            chilrenOLtag += '</ol>';
            var createQueryId = beforeParentId;
            count = count +1;
            $("ol#"+createQueryId).append(parentILtag);
            $("ol#"+createQueryId + " li#"+parentId).append(chilrenOLtag);
            for(var i=0; i< children.length ; i++){
                //children의 갯수만큼 재귀 함수로 각 children을 parent처럼 돌린다.
                childrenSearch(children[i],parentId);
            }
        }
      }
      //button을 클릭하면, content page의 html을 글거온다.
    $('#test').click(function(){
        chrome.tabs.executeScript({
            //body의 html가 callback 함수의 result 파라미터로 들어간다.
            code:' document.body.innerHTML;'
          },function(result){
            //해당 html String을 jquery로 hmtl object형식으로 바꿔준다.  
            var domString = result[0];
            var html = $.parseHTML(domString);
            console.log(html);
            //각 html 태그의 하위노드에 뭐가 있는지 확인하고, 해당 tree구조를 보여준다.
            for(var i = 0;i<html.length;i++){
                if(html[i].children){
                    //console.log(i);
                    childrenSearch(html[i],"ol__contentBody");   
                }
            }
            console.log(count);  
          });
    });
});