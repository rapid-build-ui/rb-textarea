/***********
 * RB-TEXTAREA
 ***********/
import { props, html, RbBase } from '../../rb-base/scripts/rb-base.js';
import FormControl from '../../form-control/scripts/form-control.js';
import template from '../views/rb-textarea.html';

export class RbTextarea extends FormControl(RbBase()) {
	/* Lifecycle
	 ************/
	viewReady() { // :void
		super.viewReady && super.viewReady();
		this.rb.elms.focusElm = this.shadowRoot.querySelector('textarea');
		this.rb.elms.formControl = this.rb.elms.focusElm
	}

	/* Properties
	 *************/
	static get props() { // :object
		return {
			...super.props,
			autoHeight: Object.assign({}, props.boolean, {
				default: false
			}),
			inline: props.boolean,
			kind: props.string,
			label: props.string,
			placeholder: props.string,
			right: props.boolean,
			subtext: props.string,
			type: props.string,
			value: props.string,
			_blurred: props.boolean,
			_active: props.boolean,
			_dirty: props.boolean
		}
	}

	/* Observer
	 ***********/
	updating(prevProps) { // :void
		if (prevProps.value === this.value) return;
		this.rb.events.emit(this, 'value-changed', {
			detail: { value: this.value }
		});
	}

	/* Event Handlers
	 *****************/
	_onfocus(e) {
		this._active = true;
	}

	_onkeydown(e) {
		this._resize(e)
	}

	async _oninput(e) { // TODO: add debouncing
		const oldVal = this.value;
		const newVal = e.target.value;
		this.value = newVal;
		if (!this._dirty && newVal !== oldVal)
			return this._dirty = true;
		if (!this._blurred) return;
		await this.validate();
	}
	_resize(e) {
		if (!this.autoHeight) return false
		this.rb.elms.focusElm.style.cssText = 'height:auto;'
		this.rb.elms.focusElm.style.cssText = 'height:' + this.rb.elms.focusElm.scrollHeight + 'px'
	}

	async _onblur(e) {
		this._active = false;
		if (!this._dirty) return;
		this._blurred = true;
		this.value = e.target.value;
		await this.validate();
	}

	_slotchange(e) {
		console.log('xxx', e);
	}

	/* Template
	 ***********/
	render({ props }) { // :string
		return html template;
	}
}

customElements.define('rb-textarea', RbTextarea);
