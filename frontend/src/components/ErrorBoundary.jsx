import React from 'react';
import { AlertTriangle, RefreshCw } from 'lucide-react';

/**
 * React Error Boundary — catches render errors in child components
 * and displays a fallback UI instead of a blank white screen.
 *
 * Usage:
 *   <ErrorBoundary fallbackTitle="Editor crashed">
 *     <MonacoEditor ... />
 *   </ErrorBoundary>
 */
class ErrorBoundary extends React.Component {
    constructor(props) {
        super(props);
        this.state = { hasError: false, error: null };
    }

    static getDerivedStateFromError(error) {
        return { hasError: true, error };
    }

    componentDidCatch(error, errorInfo) {
        console.error('[ErrorBoundary]', error, errorInfo);
    }

    handleReset = () => {
        this.setState({ hasError: false, error: null });
    };

    render() {
        if (this.state.hasError) {
            // Allow custom fallback UI via props
            if (this.props.fallback) {
                return this.props.fallback;
            }

            return (
                <div className="flex flex-col items-center justify-center gap-4 p-8 text-center min-h-[200px] bg-[#161b22] rounded-lg border border-red-900/30">
                    <AlertTriangle className="w-10 h-10 text-red-400" />
                    <div>
                        <h3 className="text-lg font-semibold text-red-300">
                            {this.props.fallbackTitle || 'Something went wrong'}
                        </h3>
                        <p className="mt-1 text-sm text-gray-400">
                            {this.state.error?.message || 'An unexpected error occurred.'}
                        </p>
                    </div>
                    <button
                        onClick={this.handleReset}
                        className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-red-600/20 hover:bg-red-600/30 border border-red-600/40 rounded-lg transition-colors"
                    >
                        <RefreshCw className="w-4 h-4" />
                        Try Again
                    </button>
                </div>
            );
        }

        return this.props.children;
    }
}

export default ErrorBoundary;
