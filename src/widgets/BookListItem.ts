import WidgetBase from '@dojo/widget-core/WidgetBase';
import { v, w } from '@dojo/widget-core/d';

import * as css from './styles/bookListItem.m.css';
import * as mdc from './mdc/material-components-web.m.css';
import { WidgetProperties, SupportedClassName } from '@dojo/widget-core/interfaces';
import { theme, ThemedMixin } from '@dojo/widget-core/mixins/Themed';
import MdcIconButton from './MdcIconButton';
import MdcButton from './MdcButton';
import { AudiobookType } from '../interfaces';

export interface BookListItemProperties extends WidgetProperties {
	book: AudiobookType;
	inBookshelf?: boolean;
	currentlyPlaying?: false;
	onToggleBookshelf?(): void;
	onListenNow(): void;
	extraClasses?: SupportedClassName[];
}

export const ThemedBase = ThemedMixin(WidgetBase);

@theme(css)
export default class BookListItem extends ThemedBase<BookListItemProperties> {
	private _expanded = false;

	private _onToggleBookshelf(e?: MouseEvent) {
		if(e) {
			e.preventDefault();
			e.cancelBubble = true;
		}

		if (this.properties.onToggleBookshelf) {
			this.properties.onToggleBookshelf();
			this.invalidate();
		}
	}

	private _bookMeta() {
		const {
			book: {
				language,
				totaltime,
				num_sections
			}
		} = this.properties;

		let length = totaltime ? `Audio length: ${totaltime}.` : '';
		let chapters = num_sections && num_sections > 1 ? `Chapters: ${num_sections}.` : '';
		let lang = language ? `Language: ${language}` : '';

		return [
			v('p', {
				classes: [this.theme(css.meta), mdc.typography__subtitle2]
			}, [ `${length} ${chapters} ${lang}` ])
		];
	}

	private _bookActions () {
		const {
			currentlyPlaying = false,
			inBookshelf = false
		} = this.properties;

		return [
			w(MdcButton, {
				variant: 'outlined',
				icon: 'play_arrow',
				disabled: currentlyPlaying,
				onClick: () => { this._onListenNow(); }
			}, ['Listen Now']),
			' ',
			w(MdcButton, {
				icon: inBookshelf ? 'playlist_add_check' : 'playlist_add',
				onClick: this._onToggleBookshelf,
			}, [inBookshelf ? 'Remove from My Bookshelf' : 'Add to My Bookshelf'])
		];
	}

	private _onListenNow() {
		const {
			book: { id },
			onListenNow
		} = this.properties;
		onListenNow && onListenNow();
	}

	protected render() {
		const {
			book: {
				id,
				title,
				authors = [],
				description
			},
			inBookshelf = false,
			extraClasses = []
			// copyright_year = ' '
		} = this.properties;


		let auths = authors.map((a) => {
			return v('span', {}, [
				v('cite', [a.first_name, ' ', a.last_name]),
				a.dob ? ` (${a.dob}-${a.dod})` : null,
				' '
			]);
		});

		return [
			v('li', {
				classes: [mdc.listItem, this._expanded ? mdc.listItem__activated : null, ...extraClasses],
				onclick: () => {
					this._expanded = !this._expanded;
					this.invalidate();
				}
			}, [
					v('span', { classes: [mdc.listItem__graphic, mdc.icon ] },
						[this._expanded ? 'expand_more' : 'chevron_right']),
					v('span', { classes: [mdc.listItem__text] },
						[
							title,
							v('span', { classes: [mdc.listItem__secondaryText] }, auths)
						]),
					w(MdcIconButton, {
						icon: inBookshelf ? 'check' : 'library_add',
						title: inBookshelf ? 'Remove from My Bookshelf' : 'Add to My Bookshelf',
						onClick: (e: MouseEvent) => this._onToggleBookshelf(e),
						extraClasses: [mdc.listItem__meta]
					}),
				]),
				this._expanded ? v('li', {
					key: `${this.properties.book.id}_description`,
					classes: [ this.theme(css.bookMore), mdc.elevation__z4 ]
					}, [
						...this._bookActions(),
						...this._bookMeta(),
						v('div', { classes: [mdc.typography__body2, this.theme(css.description)], innerHTML: description })
				]) : v('span', { key: `${this.properties.book.id}_empty`}) // need to use an empty node because of 2.0.0 bug. fixed in 2.0.3
		];
	}
}