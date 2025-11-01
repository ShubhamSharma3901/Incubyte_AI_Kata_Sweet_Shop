import React, { useState, useEffect } from 'react'
import axios from 'axios'

interface ApiResponse {
    message?: string;
    status?: string;
    timestamp?: string;
}

function App() {
    const [backendStatus, setBackendStatus] = useState<string>('Checking...')
    const [apiData, setApiData] = useState<ApiResponse | null>(null)

    useEffect(() => {
        const checkBackend = async () => {
            try {
                const response = await axios.get<ApiResponse>('/api/health')
                setApiData(response.data)
                setBackendStatus('Connected')
            } catch (error) {
                setBackendStatus('Disconnected')
                console.error('Backend connection failed:', error)
            }
        }

        checkBackend()
    }, [])

    return (
        <div className="min-h-screen bg-gray-900 text-white">
            <header className="flex flex-col items-center justify-center min-h-screen p-8">
                <h1 className="text-4xl font-bold mb-8">React + TypeScript Frontend</h1>
                <div className="bg-gray-800 p-6 rounded-lg shadow-lg mb-8 max-w-md w-full">
                    <h2 className="text-xl font-semibold mb-4">
                        Backend Status:
                        <span className={`ml-2 ${backendStatus === 'Connected' ? 'text-green-400' : 'text-red-400'}`}>
                            {backendStatus}
                        </span>
                    </h2>
                    {apiData && (
                        <div className="space-y-2 text-sm">
                            <p>Status: <span className="text-green-400">{apiData.status}</span></p>
                            <p>Timestamp: <span className="text-gray-300">{apiData.timestamp}</span></p>
                        </div>
                    )}
                </div>
                <p className="text-gray-400">
                    Edit <code className="bg-gray-800 px-2 py-1 rounded text-yellow-300">src/App.tsx</code> and save to reload.
                </p>
            </header>
        </div>
    )
}

export default App