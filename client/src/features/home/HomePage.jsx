import React, { useState } from 'react'
import Navbar from './components/Navbar'
import WorkspacePage from './components/Workspacepage'

const HomePage = () => {

    const [language, setLanguage] = useState('javascript')

    return (
        <div className="relative flex flex-col h-screen" style={{ zIndex: 1 }}>
            <Navbar language={language} onLanguageChange={setLanguage} />

            <main className="flex flex-col md:flex-row flex-1 min-h-0 overflow-hidden">
                <WorkspacePage language={language} />
            </main>

            {/* Status bar */}
            <div
                className="shrink-0 flex items-center justify-between px-5 py-1.5 border-t"
                style={{
                    borderColor: 'rgba(30,45,61,0.8)',
                    background: 'rgba(8,12,16,0.9)',
                    backdropFilter: 'blur(8px)',
                }}
            >
                <div className="flex items-center gap-4 font-mono text-[10px]" style={{ color: 'rgba(107,125,148,0.6)' }}>
                    <span className="flex items-center gap-1.5">
                        <span className="w-1.5 h-1.5 rounded-full" style={{ background: '#10D9A0', boxShadow: '0 0 4px rgba(16,217,160,0.7)' }} />
                        <span style={{ color: 'rgba(16,217,160,0.7)' }}>Connected</span>
                    </span>
                    <span>Devynix AI v0.2.0</span>
                    <span style={{ color: 'rgba(0,212,255,0.4)' }}>claude-sonnet-4</span>
                </div>
                <div className="flex items-center gap-4 font-mono text-[10px]" style={{ color: 'rgba(107,125,148,0.4)' }}>
                    <span>UTF-8</span>
                    <span>LF</span>
                    <span style={{ color: 'rgba(0,212,255,0.5)' }}>{language.toUpperCase()}</span>
                </div>
            </div>
        </div>
    )
}

export default HomePage