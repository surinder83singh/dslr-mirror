import {html, css, LitElement} from 'lit';
export * from 'lit';

export class BaseElement extends LitElement{
	static define(name){
		customElements.define(name, this);
	}
	createRenderRoot(shadow){
		if(shadow === true)
			return super.createRenderRoot();
		return this;
	}
}

export const CoreElement = (tag)=>{
	let extend = 'div';
	let klass = HTMLDivElement
	if(window[`HTML${tag}Element`]){
		extend = tag.toLowerCase();
		klass = window[`HTML${tag}Element`]
	}
	return class extends klass{
		static define(name){
			customElements.define(name, this, {extends:extend});
		}
		qS(...selectors){
			return this.querySelector(...selectors)
		}
		qSAll(...selectors){
			return this.querySelectorAll(...selectors)
		}
		init(){

		}
		connectedCallback(){
			super.connectedCallback?.();
			this.init();
		}
		disconnectedCallback(){
			super.disconnectedCallback?.();
		}
	}
}