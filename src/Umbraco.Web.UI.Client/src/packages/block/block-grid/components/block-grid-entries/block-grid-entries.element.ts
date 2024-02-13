import { UmbLitElement } from '@umbraco-cms/backoffice/lit-element';
import { UmbBlockGridEntriesContext } from '../../context/block-grid-entries.context.js';
import type { UmbBlockGridEntryElement } from '../block-grid-entry/index.js';
import type { UmbBlockGridLayoutModel } from '@umbraco-cms/backoffice/block';
import { html, customElement, state, repeat, css, property } from '@umbraco-cms/backoffice/external/lit';
import { UmbTextStyles } from '@umbraco-cms/backoffice/style';
import '../block-grid-entry/index.js';
import { UmbSorterController, type UmbSorterConfig } from '@umbraco-cms/backoffice/sorter';

const SORTER_CONFIG: UmbSorterConfig<UmbBlockGridLayoutModel, UmbBlockGridEntryElement> = {
	getUniqueOfElement: (element) => {
		return element.contentUdi!;
	},
	getUniqueOfModel: (modelEntry) => {
		return modelEntry.contentUdi;
	},
	identifier: 'block-grid-editor',
	itemSelector: '.umb-block-grid__layout-item',
	//ignorerSelector: '', // No ignorerSelector, as we want to ignore nothing.
	//containerSelector: 'EMPTY ON PURPOSE, SO IT BECOMES THE HOST ELEMENT',
};

/**
 * @element umb-block-grid-entries
 */
@customElement('umb-block-grid-entries')
export class UmbBlockGridEntriesElement extends UmbLitElement {
	//
	// TODO: Make sure Sorter callbacks handles columnSpan when retrieving a new entry.

	//
	#sorter = new UmbSorterController<UmbBlockGridLayoutModel, UmbBlockGridEntryElement>(this, {
		...SORTER_CONFIG,
		onChange: ({ model }) => {
			this.#context.setLayouts(model);
		},
	});

	#context = new UmbBlockGridEntriesContext(this);

	@property({ attribute: false })
	public set areaKey(value: string | null) {
		this.#context.setAreaKey(value);
	}
	public get areaKey(): string | null {
		return null; // Not implemented.
	}

	@state()
	private _styleElement?: HTMLLinkElement;

	@state()
	private _layoutEntries: Array<UmbBlockGridLayoutModel> = [];

	@state()
	private _createButtonLabel = this.localize.term('blockEditor_addBlock');

	constructor() {
		super();
		this.observe(this.#context.layoutEntries, (layoutEntries) => {
			const oldValue = this._layoutEntries;
			this._layoutEntries = layoutEntries;
			this.#sorter.setModel(layoutEntries);
			this.requestUpdate('layoutEntries', oldValue);
		});

		this.#context.getManager().then((manager) => {
			this.observe(
				manager.layoutStylesheet,
				(stylesheet) => {
					this._styleElement = document.createElement('link');
					this._styleElement.setAttribute('rel', 'stylesheet');
					this._styleElement.setAttribute('href', stylesheet);
				},
				'observeStylesheet',
			);
		});
	}

	// TODO: Missing ability to jump directly to creating a Block, when there is only one Block Type.
	render() {
		return html`
			${this._styleElement}
			<div class="umb-block-grid__layout-container">
				${repeat(
					this._layoutEntries,
					(x) => x.contentUdi,
					(layoutEntry, index) =>
						html`<umb-block-grid-entry
							class="umb-block-grid__layout-item"
							.index=${index}
							.contentUdi=${layoutEntry.contentUdi}
							.layout=${layoutEntry}>
						</umb-block-grid-entry>`,
				)}
			</div>
			<uui-button-group>
				<uui-button
					id="add-button"
					look="placeholder"
					label=${this._createButtonLabel}
					href=${this.#context.getPathForCreateBlock(-1) ?? ''}></uui-button>
				<uui-button
					label=${this.localize.term('content_createFromClipboard')}
					look="placeholder"
					href=${this.#context.getPathForClipboard(-1) ?? ''}>
					<uui-icon name="icon-paste-in"></uui-icon>
				</uui-button>
			</uui-button-group>
		`;
		//
	}

	static styles = [
		UmbTextStyles,
		css`
			:host {
				display: grid;
				gap: 1px;
			}
			> div {
				display: flex;
				flex-direction: column;
				align-items: stretch;
			}

			uui-button-group {
				padding-top: 1px;
				display: grid;
				grid-template-columns: 1fr auto;
			}
		`,
	];
}

export default UmbBlockGridEntriesElement;

declare global {
	interface HTMLElementTagNameMap {
		'umb-block-grid-entries': UmbBlockGridEntriesElement;
	}
}
