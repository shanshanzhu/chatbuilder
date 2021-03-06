

$(document).ready(function(){
      var clickIsOn = false;
      var t;
      var sentObjID={};
	var gaptime = 3000;
	delete Chat.display;
	delete Chat.fetch; 
	delete Chat.send; 
        $("li").remove();
	
        parseOnce(initialDisplay,10);
	
        getParse();
     
$(".send").on("click",eventHandler);
$(".draft").on ("keyup",function(event){
	if (event.keyCode == 13){
		eventHandler(event);
	}
	else
		checkBox();
	});

function eventHandler (event){
	//event.stopPropagation();
	clickIsOn = true;
	var textContent = Chat.username + ": " + $('.draft').val();
	var obj = {"text": textContent, "username": Chat.username};	
	$('.draft').val('');
	clearTimeout(t);
	//console.log(t);
	//console.log("clean timeoutID");
	sendParse(obj);

};

function sendParse(obj){
	var json = JSON.stringify(obj);
	$.ajax({url:'https://api.parse.com/1/classes/chats',
	   type: 'POST',
	   dataType: 'json',
           contentType:'application/json',
	   processData: false,		
	   data:json,	
	   headers:{"Content-Type": "application/json"},
	   success: function(res){
	        sentObjID[res["objectId"]] = 1;
		//console.log(sentObjID);
                getParse();
		}
	});	
}

function parseOnce(func,gaptime){
	$.ajax({url:'https://api.parse.com/1/classes/chats',
	dataType: 'json',
	contentType:'application/json',
	type: 'GET', 
	data:{"order":"-createdAt"}, 
	error: errorFunc,
        success: function (res){
              	   $.each (res["results"],function(i,item){
			setTimeout(func, i*gaptime,item.text);
           });
	   }
	});
}

function getParse(){

	$.ajax({url:'https://api.parse.com/1/classes/chats',
	   type: 'GET',
	   dataType: 'json',
           contentType:'application/json',
	   data:{"order":"-createdAt"},
           success: function (res){
			if (clickIsOn === true){
				displayRemove(res["results"][0]["text"]);
				clickIsOn = false;
			}				
			else{
		   $.each (res["results"],function(i,item){
			if (item.objectId in sentObjID){
				i--;
			//	console.log(i);
			}	
			else	
			  setTimeout(displayRemove, i*gaptime,item.text);
           });		
	   }
	   },
	   complete: function (){		

			t = setTimeout(getParse,gaptime*10);
		 //     console.log("restart timoutID");
	   },
	   error: errorFunc
	});
}

function errorFunc (){
	console.log("There is something Wrong!");
}

function displayRemove (response){
		    initialDisplay(response);
		     $('li').first().remove();
}

function initialDisplay (response){
		    $(".messages").append("<li>" + response + "</li>");
}

function checkBox(){
if ($(".draft").val() == "") 
	$('.send').prop({'disabled':true});
if ($(".draft").val() != "") 
	$('.send').prop({'disabled':false});
}

});
