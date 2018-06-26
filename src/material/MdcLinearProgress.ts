import WidgetBase from '@dojo/widget-core/WidgetBase';
import { v } from '@dojo/widget-core/d';
import * as css from '../material/styles/mdcLinearProgress.m.css';
import * as mdc from '../material/styles/material-components-web.m.css';
import { WidgetProperties, SupportedClassName } from '@dojo/widget-core/interfaces';
import { theme, ThemedMixin } from '@dojo/widget-core/mixins/Themed';

export interface MdcLinearProgressProperties extends WidgetProperties {
	indeterminate?: boolean;
	reversed?: boolean;
	closed?: boolean;
	progress?: number;
	buffer?: number;
	extraClasses?: SupportedClassName[];
}

const ThemedBase = ThemedMixin(WidgetBase);

@theme(css)
export default class MdcLinearProgress extends ThemedBase<MdcLinearProgressProperties> {

	private _boundProgress(value:number) {
		if(value < 0) {
			value = 0;
		} else if(value > 1) {
			value = 1;
		}
		return value;
	}

	protected render() {
		let {
			indeterminate = false,
			reversed = false,
			closed = false,
			progress = 0,
			buffer = 0,
			extraClasses = []
		} = this.properties;

		progress = indeterminate ? 0 : this._boundProgress(progress);
		const progressStyle = progress > 0 ? `transform: scaleX(${progress})` : '';

		buffer = indeterminate ? 0 : this._boundProgress(buffer);
		const bufferStyle = buffer > 0 ? `transform: scaleX(${buffer})` : '';

		return v("div", {
			role: "progressbar",
			classes: [this.theme(css.root), mdc.linearProgress,
			reversed ? mdc.linearProgress__reversed : null,
			indeterminate ? mdc.linearProgress__indeterminate : null,
			...extraClasses]
		}, [
			v("div", { classes: [mdc.linearProgress__bufferingDots] }),
			v("div", {
				key: 'buffer',
				classes: [mdc.linearProgress__buffer],
				style: bufferStyle
			}),
			v(
			  "div",
			  {
				 key: 'progress',
				 classes: [mdc.linearProgress__bar, mdc.linearProgress__primaryBar],
				 style: progressStyle
			  },
			  [v("span", { classes: [mdc.linearProgress__barInner] })]
			),
			v(
			  "div",
			  {
				 classes: [
					mdc.linearProgress__bar,
					mdc.linearProgress__secondaryBar
				 ]
			  },
			  [v("span", { classes: [mdc.linearProgress__barInner] })]
			)
		 ]);
		 
	}
}