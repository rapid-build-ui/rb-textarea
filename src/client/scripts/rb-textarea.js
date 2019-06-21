/**************
 * RB-TEXTAREA
 **************/
import { RbBase, props, html } from '../../rb-base/scripts/rb-base.js';
import FormControl             from '../../form-control/scripts/form-control.js';
import Converter               from '../../rb-base/scripts/public/props/converters.js';
import Type                    from '../../rb-base/scripts/public/services/type.js';
import template                from '../views/rb-textarea.html';
import '../../rb-popover/scripts/rb-popover.js';

export class RbTextarea extends FormControl(RbBase()) {
	/* Lifecycle
	 ************/
	constructor() {
		super();
		this.rb.formControl.isTextarea = true;
	}
	viewReady() { // :void
		super.viewReady && super.viewReady();
		const textarea = this.shadowRoot.querySelector('textarea');
		Object.assign(this.rb.formControl, {
			elm:      textarea,
			focusElm: textarea
		});
		Object.assign(this.rb.elms, { textarea });
		if (!this.hasAttribute('value')) this._createContentObserver();
		this._initialHeight = textarea.scrollHeight;
		if (this.autoHeight) setTimeout(() => this._resize());
		this._initSlotStates(); // see rb-base: private/mixins/slot.js
	}
	disconnectedCallback() {
		super.disconnectedCallback();
		this._contentObserver && clearInterval(this._contentObserver);
	}

	/* Properties
	 *************/
	static get props() { // :object
		return {
			...super.props,
			autoHeight: props.boolean,
			inline: props.boolean,
			kind: props.string,
			label: props.string,
			placeholder: props.string,
			right: props.boolean,
			rows: props.number,
			subtext: props.string,
			type: props.string,
			readonly: Object.assign({}, props.boolean, {
				deserialize: Converter.valueless
			}),
			value: Object.assign({}, props.string, {
				coerce(val) {
					// prevents returning string 'null' and 'undefined'
					if (Type.is.null(val)) return val;
					if (Type.is.undefined(val)) return val;
					return String(val);
				}
			})
		}
	}

	/* Observer
	 ***********/
	updating(prevProps) { // :void
		if (prevProps.value === this.value) return;
		this.autoHeight && this._resize();
		this.rb.events.emit(this, 'value-changed', {
			detail: { value: this.value }
		});
	}

	// TODO: fix safari from crashing when using MutationObserver
	_createContentObserver() {
		const textNode   = this.firstChild;
		const hasContent = !!(textNode && textNode.textContent.trim().length);
		if (!hasContent) return;
		let oldText = textNode && textNode.textContent;
		this.value  = oldText || '';
		this._contentObserver = setInterval(() => {
			const newText = textNode && textNode.textContent;
			if (newText === oldText) return;
			oldText = newText;
			this.value = newText;
		}, 200);
	}

	/* Event Handlers
	 *****************/
	_onfocus(e) {
		this._active = true;
	}

	async _oninput(e) { // TODO: add debouncing
		const oldVal = this.value;
		const newVal = e.target.value;
		this.value = newVal;
		if (!this._dirty && newVal !== oldVal)
			return this._dirty = true;
		if (!this._touched) return;
		await this.validate();
	}

	async _onblur(e) {
		this._active = false;
		if (!this._dirty) return;
		this._touched = true;
		this.value = e.target.value;
		await this.validate();
	}

	_resize() {
		if (!this.rb.view.isReady) return;
		const { textarea } = this.rb.elms;
		textarea.style.height = 0;
		textarea.style.height = textarea.scrollHeight < this._initialHeight
			? `${this._initialHeight}px`
			: `${textarea.scrollHeight}px`;
	}

	/* Template
	 ***********/
	render({ props, state }) { // :string
		return html template;
	}
}

customElements.define('rb-textarea', RbTextarea);