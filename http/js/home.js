$(document).ready(()=>{
	var $stageTouch = $('#stageTouch');
	var $stageCount = $('#stageCount');
	var $stageMsg 	= $('#stageMsg');
	var $stageImage = $('#stageImage');
	var $recentImagesButton = $('#recentImagesButton');
	var $countingNum = $(".counting-num");
	var $resultImage = $("#stageImage .img");
	var $emailModal	= $(".email-modal");
	var intervalId 	= false;
	var captureResult = {};
	var bundleImages	= [];
	var currentImage = '';

	//var $touchMeBtn = $('.touch-me-btn');
	var $resetBtn = $('.reset-btn');
	$stageTouch.on("click", ()=>{
		startCounting();
	});
	$resetBtn.on("click", ()=>{
		bundleImages = [];
		showTouchStage();
	});
	
	$(".print-btn").on("click", ()=>{
		printImage();
	});
	$(".more-btn").on("click", ()=>{
		showTouchStage();
	});
	$(".email-btn").on("click", ()=>{
		$(".email-modal").modal("show");
	});
	$(".email-form").on("submit", (e)=>{
		e.preventDefault();
		console.log('email form bundleImages: ', bundleImages);
		if(!bundleImages.length)
			return api.alert("Error", "Please capture image to email");
		var images = bundleImages.map((image)=>{return image.filename});
		console.log('email form images: ', images);
		var data = {
			images,
			email: $(".email-input").val()
		}
		api.action("email", data, (err, result)=>{
			api.toast('Email queued successfully.');
			bundleImages = [];
			$(".email-modal").modal("hide");
			/*
			if(result.success)
				return api.alert("Success", "Email sent.");

			api.alert("Error", "Please Try again later");*/
		});
	})

	function showTouchStage(){
		$countingNum.html(counterConfig.countdown);
		activateStage("Touch");
	}

	function startCounting(){
		$countingNum.html(counterConfig.countdown);
		activateStage("Count");	
		var count = counterConfig.countdown;
		if(intervalId)
			clearInterval(intervalId);

		intervalId = setInterval(()=>{
			$countingNum.html(count);
			count--;
			if(count<0){
				activateStage("Msg");
				clearInterval(intervalId);
				setTimeout(capture, (counterConfig.captureDelay || 0 ) * 1000 )
			}
		}, 1000)
	}

	function capture(){
		api.action("capture", {}, (err, result)=>{
			if(result.success)
				return showResult(result);

			api.alert("Error", "Please Try again later");
		});
	}
	function printImage(){
		var filename = captureResult.filename;
		if(!filename)
			return api.alert("Error", "Please capture image to print");

		api.action("print", {filename}, (err, result)=>{
			if(result.success)
				return api.alert("Success", "Photo printing job in progress.");

			api.alert("Error", "Please Try again later");
		});
	}

	function showResult(result){
		$stageImage.css('background-image', 'url('+result.image+')');
		$recentImagesButton.css('background-image', 'url('+result.image+')');
		bundleImages.push(result);
		console.log("bundleImages: ", bundleImages);
		activateStage("Image");
	}

	function activateStage(stage){
		$(".main .section").removeClass("active");
		$('#stage'+stage).addClass("active");
		if(stage != 'Image')
			$stageImage.css('background-image', 'none');
	}

    /*
	//OAuth.io's logo in base64
	var logo = "iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAACXBIWXMAAAsTAAALEwEAmpwYAAAAIGNIUk0AAHolAACAgwAA+f8AAIDpAAB1MAAA6mAAADqYAAAXb5JfxUYAAAKfSURBVHjabJNNSFRRGIafc+6d8Y6OM42aTmpNauRgUVBRVEwZCC6kdtGqRRBtWkWLKGgXtghaRIsK3ES0L4pKCPpZREX2oxnVlOn4V4026Tjj3HvPPS2asRp64OODw8v3cXjfTxinrlOGBHSxzgPjxW4Cqvj+j7icy8AVIAIcK5YPuAMc/9+2fxEioWz3sFoozCrloVzVrLKLtud6XQiRKKlKcrPYo8AbhEiq+Xxba2MN7dEwtqsQCExT8moszfRMNmFUWwN4uhKI/z1gHikCai6/fefaRlqiYW6+HGEunQU00cYaejbGeJacjgym0hEjGBhC66UvhIEWlbPHN6yqo7UhzLUbz9mxup65C4dInTtIxPLRd/sFW1vqaaoNoRw1DawAQhI4Awzi6fjahjD97ybAUfTuWc+Je6+5l5zmTOc6mMnydOQbm2N1sGh3AZNArwR6Pa0fRGqD5BYdvk7MEoo3sbG1npXVFsv8JtviTdAWZWjyB8pRUOkHuAqcNYEpDQOmFJ2O8iCbpyfegRSCk53rlszZFKtjYCiFqzyElAAPgQkTuGgIcfR7JkeouRYCfrw/Li1RcD38oQCW5UMvFKCqog/YYgJ9QAbHPTKbt5cnNrVy980op+uCzOVshBCYhmR4LM2+DTFG0vNgGu+BS8AjUYqyFiLp5QttBza38flnjudPPoDt/k5ulUX37g6k43JncAwjGOhH626A0oA1wEfl6UVs10q0NxK2fGQLLkJAqMLHeGaBF5++KllVYQjIF+13SkFKAi2GFN+wfMOP36ZiZqWfppogrqeZTM+jXYURtO4XN8cAp/wWvgA5YMoIWiOelPtHZ7JMZBYywm/uNSorQOvRona0/Bb+ZhcgBRQMQ14CUsAtoAoolIt/DQBMqAUSa5wR2gAAAABJRU5ErkJggg==";

	//Convert base64 into blob
	//cf http://stackoverflow.com/questions/16245767/creating-a-blob-from-a-base64-string-in-javascript
	function b64toBlob(b64Data, contentType, sliceSize) {
	    contentType = contentType || '';
	    sliceSize = sliceSize || 512;

	    var byteCharacters = atob(b64Data);
	    var byteArrays = [];

	    for (var offset = 0; offset < byteCharacters.length; offset += sliceSize) {
	        var slice = byteCharacters.slice(offset, offset + sliceSize);

	        var byteNumbers = new Array(slice.length);
	        for (var i = 0; i < slice.length; i++) {
	            byteNumbers[i] = slice.charCodeAt(i);
	        }

	        var byteArray = new Uint8Array(byteNumbers);

	        byteArrays.push(byteArray);
	    }

	    var blob = new Blob(byteArrays, {type: contentType});
	    return blob;
	}

	OAuth.initialize("8FtK5BZDd11zcUHZnEclmtQ0lBI", {cache:true});

	$('#shareOnTwitter').click(function() {
	    OAuth.popup("twitter").then(function(result) {
	        var data = new FormData();
	        data.append('status', 'This is a test');
	        data.append('media[]', b64toBlob(logo), 'logo.png');
	        
	        return result.post('/1.1/statuses/update_with_media.json', {
	            data: data,
	            cache:false,
	            processData: false,
	            contentType: false
	        });
	    }).done(function(data){
	        var str = JSON.stringify(data, null, 2);
	        $('#result').html("Success\n" + str).show()
	    }).fail(function(e){
	        var errorTxt = JSON.stringify(e, null, 2)
	        $('#result').html("Error\n" + errorTxt).show()
	    });
	});
	*/

});