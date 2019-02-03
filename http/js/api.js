class Api{
	alert(title, text){
		//@TODO 
		alert(text);
	}
	
	toast(msg, option, skip){
		option = option||{};
		
		Object.assign(option, {delay:2000});
		var $toast =  $(`<div class="toast" role="alert" aria-live="assertive" aria-atomic="true">
		  <div class="toast-body alert alert-primary">
			${msg}
		  </div>
		</div>`);
		$toast.appendTo('.toast-wrapper');
		$toast.toast(option||{});
		if(!skip){$toast.toast('show');}
		return $toast;
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