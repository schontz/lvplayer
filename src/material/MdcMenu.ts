import WidgetBase from '@dojo/widget-core/WidgetBase';
import { v } from '@dojo/widget-core/d';
import * as css from './styles/mdcMenu.m.css';
import * as mdc from '../material/styles/material-components-web.m.css';
import { WidgetProperties, SupportedClassName } from '@dojo/widget-core/interfaces';
import { theme, ThemedMixin } from '@dojo/widget-core/mixins/Themed';

export interface MdcMenuItem {
	value?: string;
	separator?: boolean;
	disabled?: boolean;
}

export interface MdcMenuProperties extends WidgetProperties {
	items?: MdcMenuItem[];
	onSelect?(item?:MdcMenuItem, index?:number): void;
	open: boolean;
	extraClasses?: SupportedClassName[];
}

export interface MdcMenuAnchorProperties extends WidgetProperties {
	menu: MdcMenu;
}

const ThemedBase = ThemedMixin(WidgetBase);

@theme(css)
export default class MdcMenu extends ThemedBase<MdcMenuProperties> {
	protected render() {
		const {
			items = []
		} = this.properties;

		return v('div', {
			classes: [
				this.theme(css.root),
				mdc.menu,
				...extraClasses
			],
			tabIndex: -1,
			onclick: (e:MouseEvent) => this._onClick(e)
		}, [
			icon ? v('i', { classes: [mdc.icon, mdc.button__icon, ...extraClasses] }, [icon]) : null,
			...this.children,
		]);
	}
}