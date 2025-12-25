export type NoteData = {
    id: string,
    title: string,
    createdAt: string,
    type: 'personal' | 'work' | 'study' | 'ideia' | 'reminder' | 'todo',
    description: string

}

export type FetchingNoteData = {
    data: [NoteData];
    total_items: number;
    offset: number;
    limit: number;
    search: string;
};


export type NoteCreateForm = {
    title: string,
    type: 'personal' | 'work' | 'study' | 'ideia' | 'reminder' | 'todo',
    description: string
}

export type NoteEditForm = NoteCreateForm
export type NotesColumnData = NoteData
export type NoteResponseData = NoteData
