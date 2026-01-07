import type { FunctionComponent } from 'preact';

export interface TextEditorProps {
  content: string;
}

export type TextEditorComponent = FunctionComponent<TextEditorProps>;
