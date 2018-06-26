import WidgetBase from '@dojo/widget-core/WidgetBase';
import { v, w } from '@dojo/widget-core/d';
import * as css from './styles/app.m.css';
import * as mdc from './mdc/material-components-web.m.css';
import Header from './Header';
import AudiobookPlayerContainer from '../containers/AudiobookPlayerContainer';
import SearchContainer from '../containers/SearchContainer';
import BookshelfContainer from '../containers/BookshelfContainer';

export class App extends WidgetBase {
	private _appTitle = 'LibriVox Audiobooks'

	// TODO: remove in favor of routes
	private _bookshelf = false;
	private _search = true;
		 
	protected render() {
		return v('div', { classes: [css.root, mdc.typography] }, [
			w(Header, { title: this._appTitle, onClick: (value: string) => {
				const search = value == 'search';
				this._bookshelf = !search;
				this._search = search;
				this.invalidate();
			}
			}),
			v('div', { classes: [mdc.topAppBar__fixedAdjust, css.main] }, [
				this._search ? w(SearchContainer, {}) : null,
				this._bookshelf ? w(BookshelfContainer, {}) : null
			]),
			//w(AudiobookPlayerContainer, {})
		]);
	}
}

export default App;
