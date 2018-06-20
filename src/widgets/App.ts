import WidgetBase from '@dojo/widget-core/WidgetBase';
import { v, w } from '@dojo/widget-core/d';
// import AudioPlayer from './AudioPlayer';
// import BookCard from './BookCard';
import Search from './Search';
import * as css from './styles/app.m.css';
import * as mdc from './mdc/material-components-web.m.css';
import AudiobookPlayer from './AudiobookPlayer';
import MdcLinearProgress from './MdcLinearProgress';
// import dojo from '@dojo/themes/dojo';


export class App extends WidgetBase {
	private _appTitle = 'LibriVox Audiobooks'
	private _drawerOpen = false;

	private _drawer() {
		return v(
			"aside",
			{ classes: [mdc.drawer__temporary, mdc.typography, mdc.drawer__animating,
				this._drawerOpen ? mdc.drawer__open : null
			]
			},
			[
			  v("nav", { classes: [mdc.drawer__drawer] }, [
				 v("header", { classes: [mdc.drawer__header] }, [
					v("div", { classes: [mdc.drawer__content] }, ["Header here"])
				 ]),
				 v(
					"nav",
					{
					  id: "icon-with-text-demo",
					  classes: [mdc.drawer__content, mdc.list]
					},
					[
					  v(
						 "a",
						 {
							href: "#",
							classes: [mdc.listItem, mdc.listItem__activated]
						 },
						 [
							v(
							  "i",
							  {
								 "aria-hidden": "true",
								 classes: [mdc.icon, mdc.listItem__graphic]
							  },
							  ["inbox"]
							),
							"Inbox"
						 ]
					  ),
					  " ",
					  v("a", { href: "#", classes: [mdc.listItem] }, [
						 v(
							"i",
							{
							  "aria-hidden": "true",
							  classes: [mdc.icon, mdc.listItem__graphic]
							},
							["star"]
						 ),
						 "Star"
					  ])
					]
				 )
			  ])
			]
		 );
	}
		 
	private _header() {
		return v("header", { classes: [mdc.topAppBar] }, [
			v("div", { classes: [mdc.topAppBar__row] }, [
			  v(
				 "section",
				 {
					classes: [
					  mdc.topAppBar__section,
					  mdc.topAppBar__section__alignStart
					]
				 },
				 [
					 /*
					v(
					  "a",
					  {
						 href: "#",
						 classes: [mdc.icon, mdc.topAppBar__navigationIcon],
						 onclick: (e:MouseEvent) => {
							 e.preventDefault();
							 this._drawerOpen = !this._drawerOpen;
							 this.invalidate();
						 }
					  },
					  ["menu"]
					),
					" ",
					*/
					v("span", { classes: [mdc.topAppBar__title] }, [this._appTitle])
				 ]
			  ),
			  v(
				 "section",
				 {
					role: "toolbar",
					classes: [
						mdc.topAppBar__section,
						mdc.topAppBar__section__alignEnd
					]
				 },
				 [
					v(
					  "a",
					  {
						 href: "#",
						 "aria-label": "My Bookshelf",
						 alt: "My Bookshelf",
						 title: "My Bookshelf",
						 classes: [mdc.icon, mdc.topAppBar__actionItem]
					  },
					  ["library_books"]
					 ),
					 ' ',
					 v(
					  "a",
					  {
						 href: "#",
						 "aria-label": "Search",
						 alt: "Search",
						 title: "Search",
						 classes: [mdc.icon, mdc.topAppBar__actionItem]
					  },
					  ["search"]
					)
				 ]
			  )
			])
		 ]);		 
	}

	protected render() {
		return v('div', { classes: [css.root, mdc.typography] }, [
			v('div', { }, [ this._header() ]),
			v('div', { classes: mdc.topAppBar__fixedAdjust }, [
				w(Search, {})
			]),
			w(AudiobookPlayer, {
				sources: [
					{url: 'http://localhost/~schontz/_/rainstorm.mp3'},
					{url: 'http://localhost/~schontz/_/stand-still.mp3'},
					{url: 'http://localhost/~schontz/_/atmosphere.mp3'},
					{url: 'http://localhost/~schontz/_/horse-ride.mp3'}
				]
			})
			/*
			v('div', {
				key: 'audioPlayerBar',
				classes: css.audioPlayerBar
			}, [
				w(AudioPlayer, {
					sources: [
						'http://localhost/~schontz/_/rainstorm.mp3',
						'http://localhost/~schontz/_/stand-still.mp3',
						'http://localhost/~schontz/_/atmosphere.mp3',
						'http://localhost/~schontz/_/horse-ride.mp3'
					],
					theme: dojo
				})
			]),
			*/
			//w(BookCard, data),
		]);
	}
}

export default App;
