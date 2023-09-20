import { MDEditorProps } from '@uiw/react-md-editor';

export type RuleUnderstandProps = {
  ruleName: string;
  content?: string;
  refresh: () => void;
};

export type EditKnowledgeContentProps = {
  value: MDEditorProps['value'];
  onChange: MDEditorProps['onChange'];
  setHasDirtyData: (val: boolean) => void;
};
