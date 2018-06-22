import { Container } from '@dojo/widget-core/Container';
import ApplicationContext from '../ApplicationContext';
import AudiobookPlayer, { AudiobookPlayerProperties } from '../widgets/AudiobookPlayer';
import { AudiobookChapterType } from '../interfaces';

function getProperties(inject: ApplicationContext, properties: any): AudiobookPlayerProperties {
	const {
		currentBook: book,
	} = inject;

	return {
		book,
		playOnLoad: true, // FIXME: how do I differentiate between page load (do not want auto play) and choosing a book (I want auto play)
		onGotoChapter: (chapter: AudiobookChapterType, index: number) => {
			inject.currentChapter = index;
		},
		onTimeUpdate: (time: number) => {
			inject.currentPosition = time;
		}
	};

	/*
	return {
		book: {
			id: 7,
			title: 'My book',
			chapters: [
				{ url: 'http://localhost/~schontz/_/rainstorm.mp3' },
				{ url: 'http://localhost/~schontz/_/stand-still.mp3' },
				{ url: 'http://localhost/~schontz/_/atmosphere.mp3' },
				{ url: 'http://localhost/~schontz/_/horse-ride.mp3' }
			]
		}
	};
	*/
}

const AudiobookPlayerContainer = Container(AudiobookPlayer, 'state', { getProperties });

export default AudiobookPlayerContainer;