import React, { useState } from 'react';
import Loader from './Loader';

export default function OutputPanel({ data, isLoading, hasAnalyzed }) {
  const [activeTab, setActiveTab] = useState('explanation');

  const TABS = [
    { id: 'explanation', label: 'Explanation' },
    { id: 'bugs', label: 'Bugs' },
    { id: 'improvements', label: 'Improvements' }
  ];

  return (
    <div className="flex flex-col h-full overflow-hidden">
      {/* Panel header & Tabs */}
      <div className="shrink-0 flex flex-col border-b border-border bg-surface/30">
        <div className="flex items-center justify-between px-4 py-2.5">
          <span className="text-xs font-mono text-text-secondary">AI Output</span>
          <span className="text-xs font-mono text-muted">
            {hasAnalyzed ? 'Analysis Complete' : 'Ready'}
          </span>
        </div>

        {/* Tabs Row */}
        <div className="flex px-2 border-t border-border/50">
          {TABS.map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              disabled={!hasAnalyzed || isLoading}
              className={`
                px-4 py-2 text-sm font-sans font-medium transition-colors border-b-2
                ${activeTab === tab.id
                  ? 'border-accent text-accent'
                  : 'border-transparent text-text-secondary hover:text-text-primary'}
                ${(!hasAnalyzed || isLoading) ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
              `}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Output content area */}
      <div className="flex-1 p-4 overflow-auto bg-base/20 scrollbar-thin scrollbar-thumb-border scrollbar-track-transparent">
        {isLoading ? (
          <div className="flex items-center justify-center h-full">
            <Loader size="lg" text="Analyzing code..." />
          </div>
        ) : hasAnalyzed && data ? (
          <div className="animate-fade-in text-sm text-text-primary font-mono whitespace-pre-wrap leading-relaxed">
            {/* Render data based on active tab */}
            {activeTab === 'explanation' && data.explanation}
            {activeTab === 'bugs' && (
              <ul className="list-disc pl-5 space-y-2 text-red-400">
                {data.bugs?.length > 0 ? data.bugs.map((bug, i) => <li key={i}>{bug}</li>) : <li className="text-green-400">No bugs found!</li>}
              </ul>
            )}
            {activeTab === 'improvements' && (
              <ul className="list-disc pl-5 space-y-2 text-blue-400">
                {data.improvements?.length > 0 ? data.improvements.map((imp, i) => <li key={i}>{imp}</li>) : <li>Code looks fully optimized!</li>}
              </ul>
            )}
          </div>
        ) : (
          <div className="flex items-center justify-center h-full text-muted">
            <div className="text-center animate-slide-up">
              <div className="text-4xl mb-3 opacity-50">🤖</div>
              <p className="text-sm font-mono">Click "Analyze Code" to see AI magic</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}