import { deepAssign } from '@dojo/core/lang';

import { AudiobookType, AudiobookChapterType } from './interfaces';

export default class ApplicationContext {

	// saved books
	private _myBookshelf: AudiobookType[] = [];

	// the book that is currently playing
	private _currentBook: AudiobookType;

	private _invalidator: () => void;

	constructor(invalidator: () => void, bookshelf: AudiobookType[] = [], currentBook?: AudiobookType) {
		this._invalidator = invalidator;
		this._myBookshelf = bookshelf;
		if(currentBook) {
			this.playAudiobook(currentBook);
		}
	}

	private _saveState(): void {
		if(this._myBookshelf.length) {
			window.localStorage.setItem('myBookshelf', JSON.stringify(this._myBookshelf));
		}

		if(this._currentBook) {
			window.localStorage.setItem('currentBook', JSON.stringify(this._currentBook));
		}
	}

	get myBookshelf(): AudiobookType[] {
		return this._myBookshelf;
	}

	get currentBook(): AudiobookType {
		return this._currentBook;
	}

	set currentBook(book: AudiobookType) {
		this._currentBook = book;
		this._saveState();
		this._invalidator();
	}

	public isCurrentBook(book: AudiobookType): boolean {
		return this._currentBook && book.id == this._currentBook.id;
	}

	get currentChapter(): number {
		return this._currentBook ? this._currentBook.currentChapter || 0 : 0;
	}

	set currentChapter(ch: number) {
		if(this._currentBook) {
			this._currentBook.currentChapter = ch;
			this._saveState();
			this._invalidator();
		}
	}

	public playAudiobook(book: AudiobookType): void {
		this.currentBook = book;

		if(!book.chapters || book.chapters.length == 0) {
			fetch(`http://localhost/~schontz/librivox/rss.php?q=${book.id}`).then((r) => r.json()).then((data) => {
				this._currentBook.chapters = data;
				this._invalidator();
			});
		} else {
			this._invalidator();
		}
	}

	private _findIndex(books: AudiobookType[], findBook: AudiobookType) {
		let i = 0;
		for(i; i < books.length; i++) {
			if(books[i].id == findBook.id) {
				return i;
			}
		}
		return -1;
	}

	public inBookshelf(book: AudiobookType): boolean {
		return this._findIndex(this._myBookshelf, book) > -1;
	}

	private _doAddToShelf(book: AudiobookType): void {
		this._myBookshelf.push(book);
		this._saveState();
		this._invalidator();
	}

	public addToMyBookshelf(book: AudiobookType): boolean {
		const shelfIdx = this._findIndex(this._myBookshelf, book);
		if(shelfIdx == -1) {
			this._doAddToShelf(book);
			return true;
		}
		return false;
	}

	private _doRemoveFromShelf(index: number): void {
			this._myBookshelf.splice(index, 1);
			this._saveState();
			this._invalidator();
	}

	public removeFromMyBookshelf(book: AudiobookType): boolean {
		const shelfIdx = this._findIndex(this._myBookshelf, book);
		if(shelfIdx > -1) {
			this._doRemoveFromShelf(shelfIdx);
			return true;
		}
		return false;
	}

	public addRemoveFromMyBookshelf(book: AudiobookType): boolean {
		const shelfIdx = this._findIndex(this._myBookshelf, book);
		if(shelfIdx < 0) {
			this._doAddToShelf(book);
			return true;
		} else {
			this._doRemoveFromShelf(shelfIdx);
			return false;
		}
	}

	get currentPosition(): number | undefined {
		return this._currentBook ? this._currentBook.currentPosition : undefined;
	}

	set currentPosition(position: number | undefined) {
		this._currentBook.currentPosition = position;
		console.log('update pos:', position);
		this._invalidator();
		this._saveState();
	}

	/*
	public formInput(input: Partial<WorkerFormData>): void {
		this._formData = deepAssign({}, this._formData, input);
		this._invalidator();
	}

	public submitForm(): void {
		this._workerData = [ ...this._workerData, this._formData ];
		this._formData = {};
		this._invalidator();
	}
	*/
}
