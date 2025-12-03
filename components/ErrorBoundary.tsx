import React from 'react';

interface ErrorBoundaryProps { children?: React.ReactNode }
interface ErrorBoundaryState { hasError: boolean; error?: Error }

export class ErrorBoundary extends React.Component<ErrorBoundaryProps, ErrorBoundaryState> {
  declare props: Readonly<ErrorBoundaryProps>;
  state: ErrorBoundaryState = { hasError: false };

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, info: React.ErrorInfo) {
    // In a real setup you could send this to logging (Sentry/Firestore)
    console.error('Unhandled UI error:', error, info);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 text-gray-800 p-6">
          <div className="max-w-md w-full bg-white border border-red-200 rounded-lg shadow-sm p-6 text-center">
            <h1 className="text-xl font-semibold text-red-600 mb-3">Something went wrong</h1>
            <p className="text-sm text-gray-600 mb-4">Please refresh the page. If the issue persists, contact support.</p>
            <button onClick={() => window.location.reload()} className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-md text-sm font-medium">Reload</button>
          </div>
        </div>
      );
    }
    return this.props.children ?? null;
  }
}
