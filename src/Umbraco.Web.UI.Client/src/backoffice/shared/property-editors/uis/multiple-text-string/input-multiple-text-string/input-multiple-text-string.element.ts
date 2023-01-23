import { css, html, nothing } from 'lit';
import { UUITextStyles } from '@umbraco-ui/uui-css/lib';
import { customElement, property, state } from 'lit/decorators.js';
import { repeat } from 'lit/directives/repeat.js';
import { FormControlMixin } from '@umbraco-ui/uui-base/lib/mixins';
import UmbInputMultipleTextStringItemElement from '../input-multiple-text-string-item/input-multiple-text-string-item.element';
import { UmbLitElement } from '@umbraco-cms/element';
import { UmbChangeEvent, UmbDeleteEvent } from 'src/core/events';

import '../input-multiple-text-string-item/input-multiple-text-string-item.element';
import { UmbInputEvent } from 'src/core/events/input.event';

export type MultipleTextStringValue = Array<MultipleTextStringValueItem>;

export interface MultipleTextStringValueItem {
	value: string;
}

/**
 * @element umb-input-multiple-text-string
 */
@customElement('umb-input-multiple-text-string')
export class UmbInputMultipleTextStringElement extends FormControlMixin(UmbLitElement) {
	static styles = [
		UUITextStyles,
		css`
			#action {
				display: block;
			}
		`,
	];

	/**
	 * This is a minimum amount of selected items in this input.
	 * @type {number}
	 * @attr
	 * @default undefined
	 */
	@property({ type: Number })
	min?: number;

	/**
	 * Min validation message.
	 * @type {boolean}
	 * @attr
	 * @default
	 */
	@property({ type: String, attribute: 'min-message' })
	minMessage = 'This field need more items';

	/**
	 * This is a maximum amount of selected items in this input.
	 * @type {number}
	 * @attr
	 * @default undefined
	 */
	@property({ type: Number })
	max?: number;

	/**
	 * Max validation message.
	 * @type {boolean}
	 * @attr
	 * @default
	 */
	@property({ type: String, attribute: 'min-message' })
	maxMessage = 'This field exceeds the allowed amount of items';

	/**
	 * Disables the input
	 * @type {boolean}
	 * @attr
	 * @default false
	 */
	@property({ type: Boolean, reflect: true })
	disabled = false;

	/**
	 * Makes the input readonly
	 * @type {boolean}
	 * @attr
	 * @default false
	 */
	@property({ type: Boolean, reflect: true })
	readonly = false;

	constructor() {
		super();

		this.addValidator(
			'rangeUnderflow',
			() => this.minMessage,
			() => !!this.min && this._items.length < this.min
		);
		this.addValidator(
			'rangeOverflow',
			() => this.maxMessage,
			() => !!this.max && this._items.length > this.max
		);
	}

	@state()
	private _items: MultipleTextStringValue = [];

	@property({ type: Array })
	public get items(): MultipleTextStringValue {
		return this._items;
	}
	public set items(items: MultipleTextStringValue) {
		this._items = items || [];
	}

	@property()
	public set value(itemsString: string) {
		// TODO: implement value setter and getter
		throw new Error('Not implemented');
	}

	#onAdd() {
		this._items = [...this._items, { value: '' }];
		this.dispatchEvent(new UmbChangeEvent());
		this.#focusNewItem();
	}

	#onInput(event: UmbInputEvent, currentIndex: number) {
		event.stopPropagation();
		const target = event.currentTarget as UmbInputMultipleTextStringItemElement;
		const value = target.value as string;
		this._items = this._items.map((item, index) => (index === currentIndex ? { value } : item));
		this.dispatchEvent(new UmbChangeEvent());
	}

	async #focusNewItem() {
		await this.updateComplete;
		const inputs = this.shadowRoot?.querySelectorAll(
			'umb-input-multiple-text-string-item'
		) as NodeListOf<UmbInputMultipleTextStringItemElement>;
		const lastInput = inputs[inputs.length - 1];
		lastInput.focus();
	}

	#deleteItem(event: UmbDeleteEvent, itemIndex: number) {
		event.stopPropagation();
		this._items = this._items.filter((item, index) => index !== itemIndex);
		this.dispatchEvent(new UmbChangeEvent());
	}

	protected getFormElement() {
		return undefined;
	}

	render() {
		return html`
			${this._renderItems()}
			${this.disabled || this.readonly
				? nothing
				: html`<uui-button
						id="action"
						label="Add"
						look="placeholder"
						color="default"
						@click="${this.#onAdd}"
						?disabled=${this.disabled}></uui-button>`}
		`;
	}

	private _renderItems() {
		return html`
			${repeat(
				this._items,
				(item, index) => index,
				(item, index) =>
					html`<umb-input-multiple-text-string-item
						value=${item.value}
						@input=${(event: UmbInputEvent) => this.#onInput(event, index)}
						@delete="${(event: UmbDeleteEvent) => this.#deleteItem(event, index)}"
						?disabled=${this.disabled}
						?readonly=${this.readonly}></umb-input-multiple-text-string-item>`
			)}
		`;
	}
}

export default UmbInputMultipleTextStringElement;

declare global {
	interface HTMLElementTagNameMap {
		'umb-input-multiple-text-string': UmbInputMultipleTextStringElement;
	}
}
