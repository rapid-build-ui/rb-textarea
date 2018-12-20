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
		this.rb.elms.formControl = this.rb.elms.focusElm;
		if (!this.hasAttribute('value')) this._createContentObserver();
		if (this.autoHeight) setTimeout(() => this._resize());
	}

	disconnectedCallback() {
		super.disconnectedCallback();
		this._contentObserver && this._contentObserver.disconnect();
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
		this.autoHeight && this._resize();
		this.rb.events.emit(this, 'value-changed', {
			detail: { value: this.value }
		});
	}

	_createContentObserver() {
		this.value = this.textContent; // set value because callback doesn't run on init

		const callback = mutationsList => {
			for(const mutation of mutationsList) {
				if (mutation.type !== 'characterData') return;
				// console.log(mutation.target.textContent);
				this.value = mutation.target.textContent;
			}
		};

		this._contentObserver = new MutationObserver(callback);
		this._contentObserver.observe(this, {
			characterData: true,
			characterDataOldValue: false,
			subtree: true
		});
	}

	/* Event Handlers
	 *****************/
	_onfocus(e) {
		this._active = true;
	}

	_resize() {
		if (!this.rb.elms.focusElm) return;
		this.rb.elms.focusElm.style.height = 0;
		this.rb.elms.focusElm.style.height = `${this.rb.elms.focusElm.scrollHeight}px`;
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

	async _onblur(e) {
		this._active = false;
		if (!this._dirty) return;
		this._blurred = true;
		this.value = e.target.value
		this.rb.elms.focusElm.value =  e.target.value
		await this.validate();
	}

	/* Template
	 ***********/
	render({ props }) { // :string
		return html template;
	}
}

customElements.define('rb-textarea', RbTextarea);