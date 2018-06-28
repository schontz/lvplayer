/* FIXME: this implementation is incomplete and lacks many necessary features */
import WidgetBase from '@dojo/widget-core/WidgetBase';
import { v } from '@dojo/widget-core/d';
import * as css from './styles/chapterSelect.m.css';
import { WidgetProperties, SupportedClassName } from '@dojo/widget-core/interfaces';
import { theme, ThemedMixin } from '@dojo/widget-core/mixins/Themed';

export interface ChapterSelectItem {
	label?: string;
	value?: any;
	disabled?: boolean;
}

export interface ChapterSelectProperties extends WidgetProperties {
	disabled?: boolean;
	placeholder?: string;
	options?: ChapterSelectItem[];
	value: any;
	// getOptionDisabled?(option: any, index: number): boolean;
	// getOptionId?(option: any, index: number): string;
	// getOptionSelected?(option: any, index: number): boolean;
	onBlur?(key?: string | number): void;
	onChange?(option: any, key?: string | number): void;
	onFocus?(key?: string | number): void;
}

const ThemedBase = ThemedMixin(WidgetBase);

@theme(css)
export default class ChapterSelect extends ThemedBase<ChapterSelectProperties> {
	private _onChange(e: Event) {
		const {
			options = [],
			onChange
		} = this.properties;
		const select = <HTMLSelectElement>e.target;
		const selectedValue = select.value;
		const idx = select.selectedIndex;
		onChange && onChange(options[idx], selectedValue);
		// if we didn't update value onChange then don't actually change
		if(selectedValue != this.properties.value) {
			select.value = this.properties.value;
			this.invalidate();
		}
	}

	private _onFocus(e: Event) {
		this.properties.onFocus && this.properties.onFocus((<HTMLSelectElement>e.target).value);
	}

	private _onBlur(e: FocusEvent) {
		this.properties.onBlur && this.properties.onBlur((<HTMLSelectElement>e.target).value);
	}

	protected render() {
		const {
			options = []
		} = this.properties;

		return v('select', { 
			onchange: (e:Event) => { this._onChange(e) },
			onfocus: (e:FocusEvent) => { this._onFocus(e) },
			onblur: (e:FocusEvent) => { this._onBlur(e) }
		},
		options.map((option) => {
			return v('option', {
				value: option.value,
				disabled: option.disabled
			}, [option.label]);
		})
		);
	}
}