import WidgetBase from '@dojo/widget-core/WidgetBase';
import { v, w } from '@dojo/widget-core/d';

import * as css from './styles/home.m.css';
import * as mdc from '../material/styles/material-components-web.m.css';
import { WidgetProperties, SupportedClassName } from '@dojo/widget-core/interfaces';
import { theme, ThemedMixin } from '@dojo/widget-core/mixins/Themed';
import { AudiobookType } from '../interfaces';
import BookListItemContainer from '../containers/BookListItemContainer';

export interface HomeProperties extends WidgetProperties {
	title?: string;
}

export const ThemedBase = ThemedMixin(WidgetBase);

@theme(css)
export default class Home extends ThemedBase<HomeProperties> {
	protected render() {
		const {
			title = 'Home',
		} = this.properties;

		return v("div", { classes: this.theme(css.root) }, [
			v('h4', { classes: [mdc.typography__headline4, this.theme(css.title)] }, [title]),
			v('div', { innerHTML: 
`
<p>This little app allows you to listen to your favorite LibriVox recordings on the go.</p>
<p>A few features:</p>
<ul>
	<li>Search by author's last name (because of API limitations)</li>
	<li>Save audiobooks to your bookshelf</li>
	<li>Automatically remember playback position for books on your bookshelf</li>
</ul>
<p>Take a look around...</p>
<p><b>Why did you make this?</b> So I can listen to audiobooks that actually remember
their playback position on the go. It's like a podcast, only for books. Also, this little app
allowed me to begin work on dojo 2 widgets that implement Material Design Component design.
I've only made what I've needed so far. Ripple doesn't work yet, but that can come later.</p>
<p>Todo:</p>
<ul>
	<li>Lazy-load current audiobook on load. Right now the last book automatically loads its MP3.</li>
	<li>Fix fullwidth bug when you search for a book</li>
	<li>Routes for pages (home, search, bookshelf)</li>
	<li>Polish the Material widgets<li>
</ul>
`
			})
		]);
	}
}
