
export interface AuthorType {
	id: number;
	first_name: string;
	last_name: string;
	dob: string | number;
	dod?: string | number;
}

export interface AudiobookType {
	// interface matches JSON format
	id: number;
	title: string;
	authors?: AuthorType[];
	description?: string;
	copyright_year?: number | string;
	language?: string;
	totaltime?: string;
	totaltimesecs?: number;
	num_sections?: number;

	// internal playback properties
	// only save the position on the last chapter you were listening to
	currentChapter?: number;
	currentPosition?: number;

	// loaded dynamically
	chapters?: AudiobookChapterType[];
}

export interface AudiobookChapterType {
	title?: string;
	url?: string;
	index: number;
}