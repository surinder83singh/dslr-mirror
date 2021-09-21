import {html, css, BaseElement} from './base.js';

export class DSLRApp extends BaseElement{
	static get styles(){
		return css`

		.btn{border:1px solid #D00}

		`
	}
	constructor(){
		super();
		console.log("dslr-app", this.dataset.config)
	}
	render(){
		return html`
			<div class="btn btn-primary">DSLR APP</div>
		`
	}
	__createRenderRoot(shadow){
		return super.createRenderRoot(true);
	}
}

DSLRApp.define("dslr-app")
