import WidgetBase from '@dojo/widget-core/WidgetBase';
import { v } from '@dojo/widget-core/d';
import * as css from '../material/styles/mdcIconButton.m.css';
import * as mdc from '../material/styles/material-components-web.m.css';
import { WidgetProperties, SupportedClassName } from '@dojo/widget-core/interfaces';
import { theme, ThemedMixin } from '@dojo/widget-core/mixins/Themed';

export interface MdcIconButtonProperties extends WidgetProperties {
	icon: string;
	// variant?: 'raised' | 'unelevated' | 'outlined';
	// dense?: boolean;
	disabled?: boolean;
	extraClasses?: SupportedClassName[];
	tag?: 'button' | 'a';
	title?: string;
	onClick?(e?:MouseEvent): void;
}

const ThemedBase = ThemedMixin(WidgetBase);

@theme(css)
export default class MdcIconButton extends ThemedBase<MdcIconButtonProperties> {
	private _onClick(e:MouseEvent) {
		e.stopPropagation();
		this.properties.onClick && this.properties.onClick(e);
	}

	protected render() {
		const {
			icon,
			disabled = false,
			title = '',
			extraClasses = [],
			tag = 'button'
		} = this.properties;

		return v(tag, {
			disabled: disabled,
			'aria-label': title,
			alt: title,
			title: title,
			classes: [
				this.theme(css.root),
				mdc.icon,
				mdc.iconButton,
				disabled ? mdc.iconButton__disabled : null,
				...extraClasses
			],
			onclick: (e:MouseEvent) => this._onClick(e)
		}, [icon]);
	}
}