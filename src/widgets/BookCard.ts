import WidgetBase from '@dojo/widget-core/WidgetBase';
import { v } from '@dojo/widget-core/d';

import * as css from './styles/bookCard.m.css';
import * as mdc from '../material/styles/material-components-web.m.css';
import { WidgetProperties } from '@dojo/widget-core/interfaces';
import { theme, ThemedMixin } from '@dojo/widget-core/mixins/Themed';
import { AudiobookType } from '../interfaces';

export interface BookCardProperties extends WidgetProperties {
	book: AudiobookType;
}

export const ThemedBase = ThemedMixin(WidgetBase);

@theme(css)
export default class BookCard extends ThemedBase<BookCardProperties> {
	private _expanded = false;

	protected render() {
		const {
			book: {
				title,
				authors = [],
				description,
				copyright_year = ' '
			}
		} = this.properties;

		return v("div", { classes: [
			this.theme(css.root), mdc.card,
			this._expanded ? this.theme(css.expanded) : null
		]
		}, [
			v("div", [
			  v("h3", { classes: [mdc.typography__headline6] }, [
				  title,
				  ' ',
				  v('small', {}, [copyright_year ? copyright_year.toString() : null])
				]),
			  v("h4", { classes: [mdc.typography__subtitle1] }, [
				  "By ", ...authors.map((a) => {
					  return v('span', {}, [
						  v('cite', [a.first_name, ' ', a.last_name]),
						  a.dob ? ` (${a.dob}-${a.dod})` : null
					]);
				  })
			  ])
			]),
				v("div", {
					classes: [this.theme(css.description),
					mdc.typography__body2],
					innerHTML: description
				}),
				v("div", { classes: [mdc.card__actions] }, [
					v("button", {
						classes: [mdc.button, mdc.card__action],
						onclick: () => {
							this._expanded = !this._expanded;
							this.invalidate();
						}
					}, [
						this._expanded ? 'Less ' : 'More ',
						v("i", { classes: [mdc.icon] }, [this._expanded ? 'expand_less' : 'expand_more'])
					])
				])
		 ]);
		 
	}
}