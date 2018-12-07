/***********
 * RB-TEXTAREA
 ***********/
import { props, html, RbBase } from '../../rb-base/scripts/rb-base.js';
import template from '../views/rb-textarea.html';

export class RbTextarea extends RbBase() {
	/* Properties
	 *************/
	static get props() {
		return {
			kind: props.string
		};
	}

	/* Template
	 ***********/
	render({ props }) { // :string
		return html template;
	}
}

customElements.define('rb-textarea', RbTextarea);
