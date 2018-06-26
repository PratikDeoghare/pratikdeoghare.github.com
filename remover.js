

for(var i = 0; i < 8; i++) { 
    debugger;
    console.log("adding and removing body");
    var docEl = document.documentElement;
    var body = document.body;
    if(!body) {
	var fakeBody = document.createElement('body');
    }
    docEl.appendChild(fakeBody);
    if(!body) {
	fakeBody.parentNode.removeChild(fakeBody);
    } 
}

