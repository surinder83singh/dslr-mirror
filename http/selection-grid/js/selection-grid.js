class SelectionGrid{
	constructor(options){
		this.el = $(options.el);
		this.boxEl = this.el.find(".slg-box");
		this.gridEl = this.el.find(".slg-grid");
		this.dialog = $('<div class="slg-dialog"><div class="slg-close-dialog"></div></div>');
		this.el.append(this.dialog);
		this.fullimageBox0 = $('<div class="slg-fullimage-box"></div>');
		this.fullimageBox1 = $('<div class="slg-fullimage-box"></div>');
		this.dialog.append(this.fullimageBox0);
		this.dialog.append(this.fullimageBox1);
		this.fullimageBoxIndex = 0;
		this.options = options;
		this.boxEl.on("click", (e)=>{
			this.onBoxElClick(e);
		});
		this.gridEl.on("click", (e)=>{
			this.onGridElClick(e);
		})
		this.dialog.on("click", (e)=>{
			this.onDialogClick(e);
		})
	}
	init(){
		this.loadBox();
		this.loadGrid();
	}
	setOptions(options){
		this.options = options;
		this.init();
	}

	loadBox(){
		var images = this.options.images || [];
		var c = Math.max(images.length - (this.options.boxImageCount || 2), 0);
		//console.log("cccc", c)
		this.boxEl.html("");
		for(var i = images.length-1; i>=c; i--){
			this.addBoxImage(images[i], i);
		}
	}
	addBoxImage(args, index){
		args = Object.assign({}, args, {index})
		var html = this.renderHtml("box", args);
		this.boxEl.prepend(html);
	}
	loadGrid(){
		var images = this.options.images || [];
		this.gridEl.html("");
		for(var l = images.length-1, i=0; i<=l; i++){
			this.addGridImage(images[i]);
		}
	}
	addGridImage(args){
		var html = this.renderHtml("grid", args);
		this.gridEl.prepend(html);
	}

	renderHtml(key, args){
		if(typeof this.options[key+"Tpl"] == "function")
			return this.options[key+"Tpl"](args, this);

		return this[key+"Tpl"](args);
	}
	boxTpl(args){
		return `<div class="slg-img-box" data-index="${args.index}">
					<div class="slg-img" style="background-image:url(${args.image})"></div>
				</div>`;
	}
	gridTpl(args){
		var {uid, image, fullimage, selected} = args;
		return `<div class="slg-img-box${selected?' selected':''}" data-img="${uid || image}" data-fullimage="${fullimage || image}">
					<div class="slg-img" style="background-image:url(${image})"></div>
					<div class="slg-view-btn"></div>
				</div>`;
	}
	onBoxElClick(){
		this.activate();
	}
	onGridElClick(e){
		var $el = $(e.target);
		var imgBox = $el.closest(".slg-img-box");
		if(!imgBox.length)
			return
		if($el.closest(".slg-view-btn").length){
			this.viewFullsizeImage(imgBox, true);
			return
		}

		this.toggleSelectionByEl(imgBox)
	}
	onDialogClick(e){
		var $el = $(e.target);
		var dialog = $el.closest(".slg-dialog");
		if(!dialog.length)
			return
		var $img = $el.closest(".slg-fullimage");
		if(!$img.length){
			this.closeDialog();
			return
		}

		var imgWidth = $img.width();

		var left = e.pageX - $img.offset().left;
		//console.log("left", left)
		if(left< imgWidth*0.3){
			this.loadPreviousImage();
			return
		}
		if(left> imgWidth*0.7){
			this.loadNextImage();
			return
		}
		if(!this._dialogImgItem)
			return
		this.toggleSelectionByEl(this._dialogImgItem);
		$img.toggleClass("selected", this._dialogImgItem.hasClass("selected"));
	}
	loadPreviousImage(){
		var prev = this.gridEl.find(".slg-img-box.current").prev(".slg-img-box");
		if(!prev.length)
			return
		this.viewFullsizeImage(prev);
	}
	loadNextImage(){
		var next = this.gridEl.find(".slg-img-box.current").next(".slg-img-box");
		if(!next.length)
			return
		this.viewFullsizeImage(next);
	}
	viewFullsizeImage(imgBox, emptyPrev){
		this.gridEl.find(".slg-img-box.current").removeClass("current");
		this._dialogImgItem = imgBox;
		imgBox.addClass("current");
		var image = imgBox.data("fullimage");
		this.fullimageBoxIndex ^= 1;
		var nextBox = this["fullimageBox"+this.fullimageBoxIndex];
		var prevBox = this["fullimageBox"+(this.fullimageBoxIndex^1)];
		
		nextBox.html("")
		if(emptyPrev)
			prevBox.html("").removeClass("active")
		var img = $('<img class="slg-fullimage" />');
		img.on("load", ()=>{
			//var width = $img.width();
			//var height = $img.height();
			this.dialog.addClass("active");
			nextBox.addClass("active");
			prevBox.removeClass("active");
		})
		img.on("error", ()=>{
			img.remove();
		});
		img.toggleClass("selected", this._dialogImgItem.hasClass("selected"));
		
		nextBox.append(img);
		img.attr("src", image);
		
	}
	closeDialog(){
		this.dialog.removeClass("active");
	}
	toggleSelectionByEl(gridItemBox){
		gridItemBox.toggleClass("selected");
	}
	activate(){
		$(document.body).addClass("slg-active");
		this.gridEl.addClass("active");
	}
	deactivate(){
		$(document.body).removeClass("slg-active");
		this.gridEl.removeClass("active");
	}
	selectAll(){
		this.gridEl.find(".slg-img-box").addClass("selected")
	}
	deSelectAll(){
		this.gridEl.find(".slg-img-box").removeClass("selected")
	}
	getSelected(){
		var result = [];
		this.gridEl.find(".slg-img-box.selected").each((index, el)=>{
			result.push($(el).data("img"));
		});

		return result;
	}
	addImage(args){
		var images = this.options.images || [];
		images.push(args);
		this.options.images = images;
		this.loadBox();
		this.addGridImage(args);
	}
	clear(){
		this.options.images = [];
		this.init();
	}
}

(function($) {

	$.fn.SelectionGrid = function(options) {
		var data = this.data("selection-gallery");
		if(data)
			return data.setOptions(options);

		options = Object.asigne(options || {}, {
			el: this
		})

		data = new SelectionGrid(options)

		this.data("selection-gallery", data);
		data.init();
	}



	// ======================= imagesLoaded Plugin ===============================
	// https://github.com/desandro/imagesloaded

	// $('#my-container').imagesLoaded(myFunction)
	// execute a callback when all images have loaded.
	// needed because .load() doesn't work on cached images

	// callback function gets image collection as argument
	//  this is the container

	// original: mit license. paul irish. 2010.
	// contributors: Oren Solomianik, David DeSandro, Yiannis Chatzikonstantinou

	$.fn.imagesLoaded 		= function( callback ) {
		var $images = this.find('img'),
			len 	= $images.length,
			_this 	= this,
			blank 	= 'data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///ywAAAAAAQABAAACAUwAOw==';

		function triggerCallback() {
			callback.call( _this, $images );
		}

		function imgLoaded() {
			if ( --len <= 0 && this.src !== blank ){
				setTimeout( triggerCallback );
				$images.off( 'load error', imgLoaded );
			}
		}

		if ( !len ) {
			triggerCallback();
		}

		$images.on( 'load error',  imgLoaded ).each( function() {
			// cached images don't fire load sometimes, so we reset src.
			if (this.complete || this.complete === undefined){
				var src = this.src;
				// webkit hack from http://groups.google.com/group/jquery-dev/browse_thread/thread/eee6ab7b2da50e1f
				// data uri bypasses webkit log warning (thx doug jones)
				this.src = blank;
				this.src = src;
			}
		});

		return this;
	};
})(jQuery)