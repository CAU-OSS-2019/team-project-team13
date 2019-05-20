$(function(){

    function childrenSearch(parent,blank){
        //CODE인 부분은 제외하였다. 만약 children이 없는 경우(text이거나, leaf 노드일경우) 이 함수를 실행하지 않는다.
        if(parent.children && parent.tagName !="CODE"){
            var parentName = "";
            // children 노드를 생성하고
            var children = parent.children;
            // parent랑 children이랑 구별하기 위해서 blank의 개수를 늘려서 구분한다.
            blank = blank + 1;
            for(var j=0; j<blank ; j++){
                //해당 블랭크만큼 *을 추가한다.(e.g 첫 div 인경우 *div로 나온다.)
                parentName += "*";
            }
            parentName += parent.tagName;
            //해당 tag 가 id값이 있는경우 id를 추가해준다.
            if(parent.hasAttribute("id")){
                parentName += ", id="+parent.getAttribute("id");
            }
            //해당 tag 가 class 값이 있는경우 class를 추가해준다.
            if(parent.hasAttribute("class")){
                parentName += ", class="+parent.getAttribute("class");
            }
            //예로 ***DIV id=test,class=testing
            //해당 parent에 저장된 tag,id,class값을 console창에 출력한다.
            console.log(parentName);
            for(var i=0; i< children.length ; i++){
                //children의 갯수만큼 재귀 함수로 각 children을 parent처럼 돌린다.
                childrenSearch(children[i],blank);
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
               
               childrenSearch(html[i],0);
            }  
          });
    });
});