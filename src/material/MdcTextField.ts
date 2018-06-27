import WidgetBase from '@dojo/widget-core/WidgetBase';
import { v } from '@dojo/widget-core/d';
import * as css from '../material/styles/mdcTextField.m.css';
import * as mdc from '../material/styles/material-components-web.m.css';
import { WidgetProperties, SupportedClassName } from '@dojo/widget-core/interfaces';
import { theme, ThemedMixin } from '@dojo/widget-core/mixins/Themed';
import uuid from '@dojo/core/uuid';

export interface MdcTextFieldProperties extends WidgetProperties {
	leadingIcon?: string;
	trailingIcon?: string;
	// 'outlined' variant is NOT working at this time. do not use it
	variant?: 'fullwidth' | 'textarea' | 'outlined' | 'box';
	disabled?: boolean;
	dense?: boolean;
	extraClasses?: SupportedClassName[];
	label: string;
	// TODO: helperText
	type?: 'text' | 'password' | 'number';
	value: string;
	onClick?(): void;
	onFocus?(): void;
	onBlur?(): void;
	onChange?(value: string): void;
	id?: string;
}

const ThemedBase = ThemedMixin(WidgetBase);

@theme(css)
export default class MdcTextField extends ThemedBase<MdcTextFieldProperties> {
	private _uuid: string;

	constructor() {
		super();
		this._uuid = uuid();
	}

	private _onClick(e:MouseEvent) {
		e.stopPropagation();
		this.properties.onClick && this.properties.onClick();
	}

	private _focused = false;

	private _onFocus(e:FocusEvent) {
		this._focused = true;
		this.properties.onFocus && this.properties.onFocus();
		this.invalidate();
	}

	private _onBlur(e:FocusEvent) {
		this._focused = false;
		this.properties.onBlur && this.properties.onBlur();
		this.invalidate();
	}

	private _onChange(e:Event) {
		const value = (<HTMLInputElement>e.target).value;
		this.properties.onChange && this.properties.onChange(value);
		this.invalidate();
	}

	protected render() {
		const {
			leadingIcon,
			trailingIcon,
			dense = false,
			variant,
			disabled = false,
			label = '',
			extraClasses = [],
			type = 'text',
			value,
			id = this._uuid
		} = this.properties;

		const fullwidth = variant == 'fullwidth';
		const tag = variant == 'textarea' ? 'textarea' : 'input';
		const canHaveIcons = !fullwidth && (variant == 'box' || variant == 'outlined');
		const classes = [];

		if(canHaveIcons && leadingIcon) {
			classes.push(mdc.textField__withLeadingIcon);
		}

		if(canHaveIcons && trailingIcon) {
			classes.push(mdc.textField__withTrailingIcon);
		}

		if(dense) {
			classes.push(mdc.textField__dense);
		}

		if(disabled) {
			classes.push(mdc.textField__disabled);
		}

		if(this._focused) {
			classes.push(mdc.textField__focused);
		}

		if(value) {
			classes.push(mdc.textField__upgraded);
		}

		switch(variant) {
			case 'outlined':
				classes.push(mdc.textField__outlined);
				break;
			case 'textarea':
				classes.push(mdc.textField__textarea);
				break;
			case 'box':
				classes.push(mdc.textField__box);
				break;
			case 'fullwidth':
				classes.push(mdc.textField__fullwidth);
				break;
		}
			
		const outline = [];
		if(variant == 'outlined') {
			outline.push(
				v('div', { classes: [mdc.notchedOutline, this._focused ? mdc.notchedOutline__notched : null] }, [
					v('svg', {}, [
						v('path', { classes: mdc.notchedOutline__path })
					])
				]), v('div', { classes: mdc.notchedOutline__idle })
			);
		}

		const labels = [];
		if(!fullwidth) {
			labels.push(" ",
				v("label", { 'for': id, classes: [mdc.floatingLabel,
					value || this._focused ? mdc.floatingLabel__floatAbove : null] }, [ label ]),
				canHaveIcons && trailingIcon ? v('i', { classes: [mdc.icon, mdc.textField__icon] }, [trailingIcon]) : null,
			);
		}

		return v("div", { classes: [this.theme(css.root), mdc.textField, ...classes, ...extraClasses] }, [
			canHaveIcons && leadingIcon ? v('i', { classes: [mdc.icon, mdc.textField__icon] }, [leadingIcon]) : null,
			v(tag, {
				type: type,
				classes: [mdc.textField__input],
				value,
				id,
				placeholder: fullwidth ? label : '',
				onfocus: this._onFocus,
				onblur: this._onBlur,
				onchange: this._onChange
			}),
			...labels,
			...outline
		 ]);
		 
	}
}