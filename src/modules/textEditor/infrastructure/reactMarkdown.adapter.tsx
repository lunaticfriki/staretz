import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import type { TextEditorComponent } from '../application/textEditor.contract';

export const ReactMarkdownAdapter: TextEditorComponent = ({ content }) => {
  return (
    <ReactMarkdown
      remarkPlugins={[remarkGfm]}
      components={{
        p: ({ ...props }) => <p class="mb-4 text-black dark:text-zinc-200" {...props} />,
        h1: ({ ...props }) => (
          <h1 class="text-3xl font-bold mb-4 text-black dark:text-white" {...props} />
        ),
        h2: ({ ...props }) => (
          <h2 class="text-2xl font-bold mb-3 text-black dark:text-white" {...props} />
        ),
        h3: ({ ...props }) => (
          <h3 class="text-xl font-bold mb-2 text-black dark:text-white" {...props} />
        ),
        ul: ({ ...props }) => (
          <ul class="list-disc pl-5 mb-4 text-black dark:text-zinc-200" {...props} />
        ),
        ol: ({ ...props }) => (
          <ol class="list-decimal pl-5 mb-4 text-black dark:text-zinc-200" {...props} />
        ),
        li: ({ ...props }) => <li class="mb-1" {...props} />,
        strong: ({ ...props }) => (
          <strong class="font-bold text-black dark:text-white" {...props} />
        ),
        em: ({ ...props }) => <em class="italic text-black dark:text-white" {...props} />,
        a: ({ ...props }) => (
          <a class="text-fuchsia-600 dark:text-fuchsia-400 hover:underline" {...props} />
        ),
        blockquote: ({ ...props }) => (
          <blockquote
            class="border-l-4 border-fuchsia-500 pl-4 italic my-4 text-zinc-700 dark:text-zinc-300"
            {...props}
          />
        ),
      }}
    >
      {content}
    </ReactMarkdown>
  );
};
