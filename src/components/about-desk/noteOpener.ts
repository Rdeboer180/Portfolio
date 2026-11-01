// The page's way to open a note in the slide-out, for the things inside the
// folder's panels that open one (the channels' threads). `from` is the id,
// without its t- prefix, of the element focus returns to when the note closes.
import { createContext, useContext } from 'react';

export const NoteOpener = createContext<(key: string, from: string) => void>(() => undefined);
export const useOpenNote = () => useContext(NoteOpener);
