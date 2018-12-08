class Api{
	alert(title, text){
		//@TODO 
		alert(text);
	}

	action(action, data, callback){
		data = data || {};
		$.ajax({
			url: "/api/action/"+action,
			data,
			method:"POST",
			success:(res)=>{
				console.log("res", res)
				callback(res)
			},
			error:(res)=>{
				callback({error:"Please try again"});
			}
		});
	}
}

var api = new Api();