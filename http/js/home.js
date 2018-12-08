$(document).ready(()=>{
	var $stageTouch = $('#stageTouch');
	var $stageCount = $('#stageCount');
	var $stageMsg 	= $('#stageMsg');
	var $stageImage = $('#stageImage');
	var $countingNum = $(".counting-num");
	var $resultImage = $("#stageImage .img");
	var intervalId 	= false;


	var $touchMeBtn = $('.touch-me-btn');
	var $resetBtn = $('.reset-btn');
	$touchMeBtn.on("click", ()=>{
		startCounting();
	});
	$resetBtn.on("click", ()=>{
		activateStage("Touch");
	})

	function startCounting() {
		activateStage("Count");	
		var count = 3;
		if(intervalId)
			clearInterval(intervalId);

		intervalId = setInterval(()=>{
			$countingNum.html(count);
			count--;
			if(count<0){
				activateStage("Msg");
				clearInterval(intervalId);
				capture();
			}
		}, 1000)
	}

	function capture(){
		api.action("capture", {}, (result)=>{
			if(result.success)
				return showResult(result);

			api.alert("Error", "Please Try again later");
		});
	}

	function showResult(result){
		$resultImage.html('<img class="rounded mx-auto d-block" src="file://'+result.file.replace(/\\/, "/")+'">');
		activateStage("Image");
	}

	function activateStage(stage){
		$("main>section").removeClass("active");
		$('#stage'+stage).addClass("active");
	}
})