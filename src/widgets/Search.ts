import WidgetBase from '@dojo/widget-core/WidgetBase';
import { v, w } from '@dojo/widget-core/d';

import * as css from './styles/search.m.css';
import * as mdc from './mdc/material-components-web.m.css';
import { WidgetProperties } from '@dojo/widget-core/interfaces';
import { theme, ThemedMixin } from '@dojo/widget-core/mixins/Themed';
import BookListItem, { BookType } from './BookListItem';
import MdcButton from './MdcButton';

export const ThemedBase = ThemedMixin(WidgetBase);

export interface SearchProperties extends WidgetProperties {
	results?: BookType[];
}

@theme(css)
export default class Search extends ThemedBase<SearchProperties> {
	private _results:BookType[] = [];

	private _tempSearch() {
		return [
			w(MdcButton, {
				icon: 'sync',
				onClick: () => {
					fetch('http://localhost/~schontz/librivox.api.php?q=audiobooks/author/twain').then((r) => r.json()).then((data) => {
						this._results = data.books;
						this.invalidate();
					});
				}
			}, ['Load Data'])
		];
	}

	protected render() {
		return v('ul', { classes: [mdc.list, mdc.list__twoLine, mdc.list__avatarList] },
			this._results.length > 0 ?
				this._results.sort((a, b) => {
					return a.title > b.title ? 1 : -1;
				}).map((book) => {
					return w(BookListItem, book);
				}) : this._tempSearch()
		);
	}
}