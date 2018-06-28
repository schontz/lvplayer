import { ProjectorMixin } from '@dojo/widget-core/mixins/Projector';
import App from './widgets/App';
import { Registry } from '@dojo/widget-core/Registry';
import ApplicationContext from './ApplicationContext';
import 'web-animations-js/web-animations-next-lite.min';


const registry = new Registry();
registry.defineInjector('state', (invalidator) => {
	const bookshelfId = 'myBookshelf';
	const storedBookshelf = window.localStorage.getItem(bookshelfId);
	const myBookshelf = storedBookshelf ? JSON.parse(storedBookshelf) : [];

	const currentBookId = 'currentBook';
	const storedCurrent = window.localStorage.getItem(currentBookId);
	const currentBook = storedCurrent ? JSON.parse(storedCurrent) : null;

	const applicationContext = new ApplicationContext(invalidator, myBookshelf, currentBook,
		function save (myBookshelf, currentBook) {
			if (myBookshelf.length) {
				window.localStorage.setItem(bookshelfId, JSON.stringify(myBookshelf));
			} else {
				window.localStorage.removeItem(bookshelfId);
			}

			if (currentBook) {
				window.localStorage.setItem(currentBookId, JSON.stringify(currentBook));
			} else {
				window.localStorage.removeItem(currentBookId);
			}
		},
		function search(value: string) {
			return fetch(`http://localhost/~schontz/librivox/api.php?q=audiobooks/author/${value}`).then((r) => r.json()).then((data) => {
				return data.books;
			}).catch((e: any) => { return []; });
		}
	);

	return () => applicationContext;
});

const Projector = ProjectorMixin(App);
const projector = new Projector();
projector.setProperties({ registry });
projector.append();
