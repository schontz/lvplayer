import WidgetBase from '@dojo/widget-core/WidgetBase';
import { v, w } from '@dojo/widget-core/d';
import AudioPlayer from './AudioPlayer';
import * as css from './styles/app.m.css';
import dojo from '@dojo/themes/dojo';

export class App extends WidgetBase {
	protected render() {
		return v('div', { classes: css.root }, [
			v('div', { classes: css.label }, ['Hello, Dojo 2 World!']),
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
			])
		]);
	}
}

export default App;
