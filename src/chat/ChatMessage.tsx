import React from 'react'
import Loader2 from 'lucide-react/dist/esm/icons/loader-2'
import type { UIMessage } from '@ai-sdk/react'
import parseHtml from 'html-react-parser'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import type { CodeToHtmlOptions } from '@llm-ui/code'
import {
  codeBlockLookBack,
  findCompleteCodeBlock,
  findPartialCodeBlock,
  loadHighlighter,
  useCodeBlockToHtml,
  allLangs,
  allLangsAlias
} from '@llm-ui/code'
import { markdownLookBack } from '@llm-ui/markdown'
import { useLLMOutput, type LLMOutputComponent } from '@llm-ui/react'
import { getHighlighterCore } from 'shiki/core'
import { bundledThemes } from 'shiki/themes'
import { bundledLanguagesInfo } from 'shiki/langs'
import getWasm from 'shiki/wasm'

interface ChatMessageProps {
  message: UIMessage
}

const MarkdownComponent: LLMOutputComponent = ({ blockMatch }) => {
  const markdown = blockMatch.output
  return <ReactMarkdown remarkPlugins={[remarkGfm]}>{markdown}</ReactMarkdown>
}

const highlighter = loadHighlighter(
  getHighlighterCore({
    langs: allLangs(bundledLanguagesInfo),
    langAlias: allLangsAlias(bundledLanguagesInfo),
    themes: Object.values(bundledThemes),
    loadWasm: getWasm
  })
)

const codeToHtmlOptions: CodeToHtmlOptions = {
  theme: 'github-dark'
}

const CodeBlock: LLMOutputComponent = ({ blockMatch }) => {
  const { html, code } = useCodeBlockToHtml({
    markdownCodeBlock: blockMatch.output,
    highlighter,
    codeToHtmlOptions
  })
  if (!html) {
    return (
      <pre className="shiki">
        <code>{code}</code>
      </pre>
    )
  }
  return <>{parseHtml(html)}</>
}

const ChatMessage: React.FC<ChatMessageProps> = ({ message }) => {
  const isUser = message.role === 'user'

  const textParts = message.parts.filter((p) => p.type === 'text') as Array<{
    type: 'text'
    text: string
    state?: 'streaming' | 'done'
  }>

  const reasoningParts = message.parts.filter(
    (p) => p.type === 'reasoning'
  ) as Array<{ type: 'reasoning'; text: string; state?: 'streaming' | 'done' }>

  const textContent = textParts.map((p) => p.text).join('')
  const reasoningContent = reasoningParts
    .map((p) => {
      const trimmed = p.text.trim()
      return trimmed === 'Thinking...' ? '(empty reasoning tick)' : trimmed
    })
    .join('\n')

  const isStreaming =
    textParts.some((p) => p.state === 'streaming') ||
    reasoningParts.some((p) => p.state === 'streaming')

  const { blockMatches } = useLLMOutput({
    llmOutput: textContent,
    fallbackBlock: {
      component: MarkdownComponent,
      lookBack: markdownLookBack()
    },
    blocks: [
      {
        component: CodeBlock,
        findCompleteMatch: findCompleteCodeBlock(),
        findPartialMatch: findPartialCodeBlock(),
        lookBack: codeBlockLookBack()
      }
    ],
    isStreamFinished: !isStreaming
  })

  return (
    <div className={`flex ${isUser ? 'justify-end' : 'justify-start'}`}>
      <div
        className={`max-w-[80%] rounded-lg px-4 py-2 ${
          isUser
            ? 'bg-blue-500 text-white'
            : 'bg-white border border-gray-200 text-gray-800'
        }`}
      >
        {!isUser && reasoningContent && (
          <div className="text-xs italic text-gray-500 mb-1 whitespace-pre-wrap">
            {reasoningContent}
          </div>
        )}
        <div className="prose prose-sm break-words">
          {blockMatches.map((blockMatch, index) => {
            const Component = blockMatch.block.component
            return <Component key={index} blockMatch={blockMatch} />
          })}
        </div>
        {isStreaming && (
          <Loader2 size={14} className="inline-block ml-1 animate-spin" />
        )}
      </div>
    </div>
  )
}

export default ChatMessage
