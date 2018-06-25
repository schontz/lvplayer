import { ProjectorMixin } from '@dojo/widget-core/mixins/Projector';
import App from './widgets/App';
import { Registry } from '@dojo/widget-core/Registry';
import ApplicationContext from './ApplicationContext';

const registry = new Registry();
registry.defineInjector('state', (invalidator) => {
	const storedBookshelf = window.localStorage.getItem('myBookshelf');
	const myBookshelf = storedBookshelf ? JSON.parse(storedBookshelf) : [];

	const storedCurrent = window.localStorage.getItem('currentBook');
	const currentBook = storedCurrent ? JSON.parse(storedCurrent) : null;

	const applicationContext = new ApplicationContext(invalidator, myBookshelf, currentBook,
		(myBookshelf, currentBook) => {
		if(myBookshelf.length) {
			window.localStorage.setItem('myBookshelf', JSON.stringify(myBookshelf));
		} else {
			window.localStorage.removeItem('myBookshelf');
		}

		if(currentBook) {
			window.localStorage.setItem('currentBook', JSON.stringify(currentBook));
		} else {
			window.localStorage.removeItem('currentBook');
		}
	});

	return () => applicationContext;
});

const Projector = ProjectorMixin(App);
const projector = new Projector();
projector.setProperties({ registry });
projector.append();
