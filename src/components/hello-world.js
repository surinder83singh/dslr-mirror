import {
	html, css, BaseElement,
	CoreElement, render
} from './base.js';

export class HelloWorld extends BaseElement{
	static get styles(){
		return css`

		.btn{border:1px solid #D00}

		`
	}
	constructor(){
		super();
		console.log("hello world 22")
	}
	render(){
		return html`
			<div class="btn btn-primary">Hello world element</div>
		`
	}
	__createRenderRoot(shadow){
		return super.createRenderRoot(true);
	}
}

export class HelloWorldCore extends CoreElement('Div'){

	init(){
		super.init();
		this.innerHTML = this.dataset.abc;
		this.classList.add("btn", "btn-primary")
		/*
		setInterval(()=>{
			this._render()
		}, 1000)
		this._render()
		*/
	}
	_render(){
		/*
		const t = new Date();
		const title = this.dataset.title || "Hello"
		const tpl = html`<h1>${title}: ${t}</h1>`
		render(tpl, this._t);
		*/
	}
}
HelloWorldCore.define("hello-world-core")


HelloWorld.define("hello-world")
