import ReactMarkdown from 'react-markdown'
import 'katex/dist/katex.min.css'
import RemarkMath from 'remark-math'
import RemarkBreaks from 'remark-breaks'
import RehypeKatex from 'rehype-katex'
import RemarkGfm from 'remark-gfm'
import SyntaxHighlighter from 'react-syntax-highlighter'
import { atomOneDark } from 'react-syntax-highlighter/dist/esm/styles/hljs'
import { CodeBlock } from '@/components/code-block'

export function Markdown(props: { content: string }) {
  return (
    <div className="markdown-body">
      <ReactMarkdown
        remarkPlugins={[RemarkMath, RemarkGfm, RemarkBreaks]}
        rehypePlugins={[
          RehypeKatex,
        ]}
        components={{
          code({ node, inline, className, children, ...props }) {
            const match = /language-(\w+)/.exec(className || '')
            const codeString = String(children).replace(/\n$/, '')
            return !inline && match ? (
              <CodeBlock code={codeString}>
                <SyntaxHighlighter
                  {...props}
                  style={atomOneDark}
                  language={match[1]}
                  showLineNumbers
                  customStyle={{ margin: 0, fontSize: '0.875rem', borderRadius: '0.5rem' }}
                  PreTag="div"
                >
                  {codeString}
                </SyntaxHighlighter>
              </CodeBlock>
            ) : (
              <code {...props} className={className}>
                {children}
              </code>
            )
          },
        }}
        linkTarget="_blank"
      >
        {props.content}
      </ReactMarkdown>
    </div>
  )
}
