'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { FiCode, FiEye, FiEyeOff, FiCopy, FiCheck, FiAlertCircle } from 'react-icons/fi'
import toast from 'react-hot-toast'

interface CustomCSSEditorProps {
  value: string
  onChange: (css: string) => void
}

const CSS_EXAMPLES = [
  {
    name: 'Custom Font',
    description: 'Import and use a custom Google Font',
    code: `@import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;600;700&display=swap');

body {
  font-family: 'Inter', sans-serif;
}`,
  },
  {
    name: 'Animated Background',
    description: 'Add a subtle animated gradient',
    code: `@keyframes gradient {
  0% { background-position: 0% 50%; }
  50% { background-position: 100% 50%; }
  100% { background-position: 0% 50%; }
}

body {
  background: linear-gradient(-45deg, #ee7752, #e73c7e, #23a6d5, #23d5ab);
  background-size: 400% 400%;
  animation: gradient 15s ease infinite;
}`,
  },
  {
    name: 'Custom Button Style',
    description: 'Style your links with custom effects',
    code: `.link-button {
  border-radius: 50px;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.3);
  transition: all 0.3s ease;
}

.link-button:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(0, 0, 0, 0.4);
}`,
  },
  {
    name: 'Hide Footer',
    description: 'Remove the GitoLink footer',
    code: `.gitolink-footer {
  display: none !important;
}`,
  },
]

export function CustomCSSEditor({ value, onChange }: CustomCSSEditorProps) {
  const [showPreview, setShowPreview] = useState(false)
  const [showExamples, setShowExamples] = useState(false)
  const [copied, setCopied] = useState(false)
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false)

  const handleChange = (newValue: string) => {
    onChange(newValue)
    setHasUnsavedChanges(true)
  }

  const copyToClipboard = () => {
    navigator.clipboard.writeText(value)
    setCopied(true)
    toast.success('CSS copied to clipboard!')
    setTimeout(() => setCopied(false), 2000)
  }

  const applyExample = (code: string) => {
    const newValue = value ? `${value}\n\n/* ${code.split('\n')[0].replace('/', '').trim()} */\n${code}` : code
    handleChange(newValue)
    setShowExamples(false)
    toast.success('Example applied!')
  }

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <FiCode className="w-5 h-5 text-purple-400" />
          <span className="text-white font-medium">Custom CSS</span>
          <span className="text-xs px-2 py-0.5 bg-yellow-500/20 text-yellow-400 rounded-full">Advanced</span>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowExamples(!showExamples)}
            className="px-3 py-1.5 text-sm text-gray-400 hover:text-white hover:bg-white/5 rounded-lg transition-colors"
          >
            Examples
          </button>
          <button
            onClick={() => setShowPreview(!showPreview)}
            className={`
              flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm transition-colors
              ${showPreview ? 'bg-blue-600/20 text-blue-400' : 'text-gray-400 hover:text-white hover:bg-white/5'}
            `}
          >
            {showPreview ? <><FiEyeOff className="w-4 h-4" /> Hide</> : <><FiEye className="w-4 h-4" /> Preview</>}
          </button>
          <button
            onClick={copyToClipboard}
            className="p-2 text-gray-400 hover:text-white hover:bg-white/5 rounded-lg transition-colors"
            title="Copy CSS"
          >
            {copied ? <FiCheck className="w-4 h-4 text-green-400" /> : <FiCopy className="w-4 h-4" />}
          </button>
        </div>
      </div>

      {/* Warning */}
      <div className="flex items-start gap-2 p-3 bg-yellow-500/10 border border-yellow-500/20 rounded-lg">
        <FiAlertCircle className="w-5 h-5 text-yellow-400 flex-shrink-0 mt-0.5" />
        <p className="text-sm text-yellow-400/80">
          Custom CSS can break your profile if not used correctly. Test your changes before saving.
        </p>
      </div>

      <div className="grid lg:grid-cols-2 gap-4">
        {/* Editor */}
        <div className="relative">
          <textarea
            value={value}
            onChange={(e) => handleChange(e.target.value)}
            placeholder="/* Enter your custom CSS here */\n\nbody {\n  /* Your styles */\n}"
            className="w-full h-64 p-4 bg-gray-900 border border-gray-700 rounded-xl text-gray-300 font-mono text-sm resize-none focus:outline-none focus:border-purple-500/50"
            spellCheck={false}
          />
          <div className="absolute bottom-3 right-3 text-xs text-gray-500">
            {value.length} characters
          </div>
        </div>

        {/* Live Preview of CSS */}
        <AnimatePresence>
          {showPreview && (
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              className="bg-gray-800/50 rounded-xl p-4 border border-gray-700"
            >
              <h4 className="text-sm font-medium text-gray-400 mb-3">CSS Preview</h4>
              <pre className="text-xs text-gray-500 font-mono whitespace-pre-wrap break-all h-56 overflow-y-auto">
                {value || '/* No CSS entered */'}
              </pre>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Examples */}
        <AnimatePresence>
          {showExamples && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="lg:col-span-2 bg-gray-800/50 rounded-xl p-4 border border-gray-700"
            >
              <div className="flex items-center justify-between mb-4">
                <h4 className="text-sm font-medium text-gray-400">CSS Examples</h4>
                <button
                  onClick={() => setShowExamples(false)}
                  className="text-xs text-gray-500 hover:text-white"
                >
                  Close
                </button>
              </div>
              
              <div className="grid sm:grid-cols-2 gap-3">
                {CSS_EXAMPLES.map((example) => (
                  <button
                    key={example.name}
                    onClick={() => applyExample(example.code)}
                    className="text-left p-3 bg-gray-900 rounded-lg hover:bg-gray-800 transition-colors group"
                  >
                    <p className="text-white font-medium text-sm mb-1 group-hover:text-purple-400 transition-colors">
                      {example.name}
                    </p>
                    <p className="text-gray-500 text-xs mb-2">{example.description}</p>
                    <pre className="text-[10px] text-gray-600 font-mono truncate">
                      {example.code.split('\n')[0]}
                    </pre>
                  </button>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}