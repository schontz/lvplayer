import WidgetBase from '@dojo/widget-core/WidgetBase';
import { v, w } from '@dojo/widget-core/d';

import * as css from './styles/search.m.css';
import * as mdc from '../material/styles/material-components-web.m.css';
import { WidgetProperties } from '@dojo/widget-core/interfaces';
import { theme, ThemedMixin } from '@dojo/widget-core/mixins/Themed';
import BookListItem from './BookListItem';
import MdcButton from '../material/MdcButton';
import {
	AudiobookType,
	AuthorType
} from '../interfaces';
import BookListItemContainer from '../containers/BookListItemContainer';
import MdcTextField from '../material/MdcTextField';
import TextInput from '@dojo/widgets/text-input';
import { diffProperty } from '@dojo/widget-core/decorators/diffProperty';
import { reference } from '@dojo/widget-core/diff';

export const ThemedBase = ThemedMixin(WidgetBase);

export interface SearchProperties extends WidgetProperties {
	results?: AudiobookType[];
	onSearch?: (value: string) => void;
	onAddToBookshelf?: (b: AudiobookType, e: MouseEvent) => void;
}

@theme(css)
export default class Search extends ThemedBase<SearchProperties> {
	private _searchValue = '';
	private _searching = false;
	private _currentSearchedValue = '';

	@diffProperty('results', reference)
	protected onResultsChanged(newProperties: SearchProperties, oldProperties: SearchProperties) {
		this._searching = false;
		this.invalidate();
	}

	private _searchForm() {
		return v('form', {
			onsubmit: (e:Event) => {
				e.preventDefault();
				if(this._searchValue != this._currentSearchedValue) {
					this._searching = true;
					this._currentSearchedValue = this._searchValue;
					this.properties.onSearch && this.properties.onSearch(this._searchValue);
				}
			}
		}, [
			w(MdcTextField, {
				leadingIcon: 'search',
				variant: 'fullwidth',
				label: 'Search by author\'s last name (e.g. Twain)',
				value: this._searchValue,
				extraClasses: { root: this.theme(css.searchInput) },
				onChange: (value: string) => {
					this._searchValue = value;
					this.invalidate();
				}
			})
		]);
	}

	private _noResults() {
		return this._searchValue ? v('p', { innerHTML:
			`Sorry, but your search for <em>${this._searchValue}</em> did not produce any results. Please search by author's last name.`
		}) : null;
	}

	private _results() {
		if(this._searching) {
			return v('p', { key: 'searchingPlaceholder' }, ['Searching...']);
		}
		const {
			results = [],
			onAddToBookshelf
		} = this.properties;

		if (results.length) {
			return v('ul', {
				key: 'resultsList',
				classes: [mdc.list, mdc.list__twoLine, mdc.list__avatarList]
			},
				results.sort((a, b) => {
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

		return this._searchValue ? v('p', { key: 'noResults', innerHTML:
			`Sorry, but your search for <em>${this._searchValue}</em> did not produce any results. Please search by author's last name.`
		}) : null;
	}

	protected render() {
		const {
			results = []
		} = this.properties;

		return v('div', { classes: this.theme(css.root) }, [
			this._searchForm(),
			v('div', {
				key: 'resultsContainer',
				classes: css.resultsContainer
			}, [ this._results() ])
		]);
	}
}