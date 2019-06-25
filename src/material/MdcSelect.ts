/* FIXME: this implementation is incomplete and lacks many necessary features */
import WidgetBase from '@dojo/framework/widget-core/WidgetBase';
import { v } from '@dojo/framework/widget-core/d';
import * as css from '../material/styles/mdcSelect.m.css';
import * as mdc from '../material/styles/material-components-web.m.css';
import { WidgetProperties, SupportedClassName } from '@dojo/framework/widget-core/interfaces';
import { theme, ThemedMixin } from '@dojo/framework/widget-core/mixins/Themed';
import { find } from '@dojo/framework/shim/array';

export interface MdcSelectItem {
	label?: string;
	value?: any;
	disabled?: boolean;
}

export interface MdcSelectProperties extends WidgetProperties {
	disabled?: boolean;
	placeholder?: string;
	options?: MdcSelectItem[];
	variant?: 'selectBox' | 'outlined';
	// getOptionDisabled?(option: any, index: number): boolean;
	// getOptionId?(option: any, index: number): string;
	// getOptionSelected?(option: any, index: number): boolean;
	onBlur?(key?: string | number): void;
	onChange?(option: any, key?: string | number): void;
	onFocus?(key?: string | number): void;
}

const ThemedBase = ThemedMixin(WidgetBase);

@theme(css)
export default class MdcSelect extends ThemedBase<MdcSelectProperties> {
	// native select events
	// https://github.com/dojo/widgets/blob/master/src/select/index.ts
	private _onNativeChange(event: Event) {
		const {
			key,
			options = [],
			onChange
		} = this.properties;
		event.stopPropagation();
		const value = (<HTMLInputElement>event.target).value;
		const selectedIndex = (<HTMLSelectElement>event.target).selectedIndex;
		// const option = find(options, (option: any, index: number) => option[index] === value;
		const option = options[selectedIndex-1];
		option && onChange && onChange(option, key);
	}

	private _onFocus() {
		this._active = true;
		this.invalidate();
	}

	private _onBlur() {
		this._active = false;
		this.invalidate();
	}

	private _onSelect(e:MouseEvent) {
		// this._selected = e.target && e.target.selectedIndex > 0;
	}

	private _active = false;
	private _selected = false;

	protected render() {
		const {
			disabled = false,
			placeholder = '',
			options = [],
			variant
		} = this.properties;

		const classes = [];

		switch(variant) {
			case 'selectBox':
				classes.push(mdc.select__box);
				break;
			case 'outlined':
				classes.push(mdc.select__outlined);
				break;
		}

		if(disabled) {
			classes.push(mdc.select__disabled);
		}

		return v("div", { classes: [mdc.select, this.theme(css.root), ...classes ] }, [
			v("select", {
				classes: [mdc.select__nativeControl],
				disabled: disabled,
				onchange: this._onNativeChange,
				onfocus: this._onFocus,
				onblur: this._onBlur,
				onselect: (e:MouseEvent) => this._onSelect(e)
			},
				options.map((item) => {
					const {
						value,
						disabled = false,
						label
					} = item;
					return v('option', { value: value, disabled: disabled }, [label]);
				})
			),
			" ",
			placeholder ? v("label", {
				classes: [mdc.floatingLabel,
				this._active || this._selected ? mdc.floatingLabel__floatAbove : null]
			}, [placeholder]) : null
		 ]);
		 
	}
}