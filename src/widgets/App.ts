import WidgetBase from '@dojo/widget-core/WidgetBase';
import { v, w } from '@dojo/widget-core/d';
import Search from './Search';
import * as css from './styles/app.m.css';
import * as mdc from './mdc/material-components-web.m.css';
import AudiobookPlayerContainer from '../containers/AudiobookPlayerContainer';
import Header from './Header';

export class App extends WidgetBase {
	private _appTitle = 'LibriVox Audiobooks'
		 
	protected render() {
		return v('div', { classes: [css.root, mdc.typography] }, [
			w(Header, { title: this._appTitle }),
			v('div', { classes: [mdc.topAppBar__fixedAdjust, css.main] }, [
				w(Search, {})
			]),
			w(AudiobookPlayerContainer, {})
		]);
	}
}

export default App;
