import WidgetBase from '@dojo/widget-core/WidgetBase';
import { v } from '@dojo/widget-core/d';
import * as css from '../material/styles/mdcButton.m.css';
import * as mdc from '../material/styles/material-components-web.m.css';
import { WidgetProperties, SupportedClassName } from '@dojo/widget-core/interfaces';
import { theme, ThemedMixin } from '@dojo/widget-core/mixins/Themed';

export interface MdcButtonProperties extends WidgetProperties {
	icon?: string;
	variant?: 'raised' | 'unelevated' | 'outlined';
	dense?: boolean;
	disabled?: boolean;
	extraClasses?: SupportedClassName[];
	tag?: 'button' | 'a';
	title?: string;
	onClick?(e?:MouseEvent): void;
}

const ThemedBase = ThemedMixin(WidgetBase);

@theme(css)
export default class MdcButton extends ThemedBase<MdcButtonProperties> {
	private _onClick(e:MouseEvent) {
		e.stopPropagation();
		this.properties.onClick && this.properties.onClick(e);
	}

	protected render() {
		const {
			icon,
			variant,
			dense = false,
			disabled = false,
			title = '',
			extraClasses = [],
			tag = 'button'
		} = this.properties;

		switch(variant) {
			case 'outlined':
				extraClasses.push(mdc.button__outlined);
				break;
			case 'raised':
				extraClasses.push(mdc.button__raised);
				break;
			case 'unelevated':
				extraClasses.push(mdc.button__unelevated);
				break;
		}

		if(dense) {
			extraClasses.push(mdc.button__dense);
		}

		if(disabled) {
			extraClasses.push(mdc.iconButton__disabled);
		}

		return v(tag, {
			disabled: disabled,
			'aria-label': title,
			alt: title,
			title: title,
			classes: [
				this.theme(css.root),
				mdc.button,
				...extraClasses
			],
			onclick: (e:MouseEvent) => this._onClick(e)
		}, [
			icon ? v('i', { classes: [mdc.icon, mdc.button__icon] }, [icon]) : null,
			...this.children,
		]);
	}
}