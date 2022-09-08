import { UUITextStyles } from '@umbraco-ui/uui-css';
import { css, html } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { UmbContextConsumerMixin } from '../../../../core/context';
import type { ManifestEntityAction } from '../../../../core/models';
import { UmbModalService } from '../../../../core/services/modal';
import { UmbDataTypeStore } from '../../../../core/stores/data-type.store';
import UmbActionElement from '../../actions/action.element';

@customElement('umb-tree-action-data-type-delete')
export default class UmbTreeActionDataTypeDeleteElement extends UmbContextConsumerMixin(UmbActionElement) {
	static styles = [UUITextStyles, css``];

	@property({ attribute: false })
	public treeAction?: ManifestEntityAction;

	private _modalService?: UmbModalService;
	private _dataTypeStore?: UmbDataTypeStore;

	connectedCallback(): void {
		super.connectedCallback();

		this.consumeContext('umbModalService', (modalService: UmbModalService) => {
			this._modalService = modalService;
		});

		this.consumeContext('umbDataTypeStore', (dataTypeStore: UmbDataTypeStore) => {
			this._dataTypeStore = dataTypeStore;
		});
	}

	private _handleLabelClick() {
		const modalHandler = this._modalService?.confirm({
			headline: `Delete ${this._activeTreeItem?.name ?? 'item'}`,
			content: 'Are you sure you want to delete this item?',
			color: 'danger',
			confirmLabel: 'Delete',
		});

		modalHandler?.onClose.then(({ confirmed }: any) => {
			if (confirmed && this._actionService && this._dataTypeStore && this._activeTreeItem) {
				this._dataTypeStore?.trash(this._activeTreeItem.key);
				this._actionService.close();
			}
		});
	}

	render() {
		return html`<uui-menu-item label=${this.treeAction?.meta.label ?? ''} @click-label="${this._handleLabelClick}">
			<uui-icon slot="icon" name=${this.treeAction?.meta.icon ?? ''}></uui-icon>
		</uui-menu-item>`;
	}
}

declare global {
	interface HTMLElementTagNameMap {
		'umb-tree-action-data-type-delete': UmbTreeActionDataTypeDeleteElement;
	}
}
