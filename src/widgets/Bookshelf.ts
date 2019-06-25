import WidgetBase from '@dojo/framework/widget-core/WidgetBase';
import { v, w } from '@dojo/framework/widget-core/d';

import * as css from './styles/bookshelf.m.css';
import * as mdc from '../material/styles/material-components-web.m.css';
import { WidgetProperties, SupportedClassName } from '@dojo/framework/widget-core/interfaces';
import { theme, ThemedMixin } from '@dojo/framework/widget-core/mixins/Themed';
import { AudiobookType } from '../interfaces';
import BookListItemContainer from '../containers/BookListItemContainer';

export interface BookshelfProperties extends WidgetProperties {
	title?: string;
	books?: AudiobookType[];
	onAddToBookshelf?: (b: AudiobookType, e: MouseEvent) => void;
}

export const ThemedBase = ThemedMixin(WidgetBase);

@theme(css)
export default class Bookshelf extends ThemedBase<BookshelfProperties> {
	private _renderBooks() {
		const {
			books = [],
			onAddToBookshelf
		} = this.properties;

		if (books.length) {
			return v('ul', {
				key: 'resultsList',
				classes: [mdc.list, mdc.list__twoLine, mdc.list__avatarList]
			},
				books.sort((a, b) => {
					return a.title > b.title ? 1 : -1;
				}).map((book) => {
					return w(BookListItemContainer, {
						key: book.id,
						book,
						onAddToBookshelf
					});
				})
			);
		}
		return null;
	}

	protected render() {
		const {
			title = 'My Bookshelf',
		} = this.properties;

		return v("div", { classes: this.theme(css.root) }, [
			v('h4', { classes: [mdc.typography__headline4, this.theme(css.title)] }, [title]),
			v('div', { classes: this.theme(css.bookshelf) }, 
			[ this._renderBooks() ]
			)
		]);
	}
}