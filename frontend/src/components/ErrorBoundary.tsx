import { Component, ErrorInfo, ReactNode } from "react";

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
  errorInfo: ErrorInfo | null;
}

class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false, error: null, errorInfo: null };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error, errorInfo: null };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error("Error caught by boundary:", error, errorInfo);
    this.setState({ error, errorInfo });

    // Log error to monitoring service (in production)
    const isProduction = false; // Set to true in production build
    if (isProduction) {
      // Send error to monitoring service
      console.error("Production Error:", {
        error: error.message,
        stack: error.stack,
        componentStack: errorInfo.componentStack,
      });
    }
  }

  handleReset = () => {
    this.setState({ hasError: false, error: null, errorInfo: null });
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-black text-yellow-400 font-pixel flex items-center justify-center">
          <div className="max-w-2xl mx-auto px-4 text-center">
            {/* RPG-themed error display */}
            <div className="bg-gray-900 border-4 border-red-500 rounded-lg p-8">
              {/* Error Icon */}
              <div className="text-6xl mb-6 animate-pulse">[ERROR]</div>

              {/* Error Title */}
              <h1 className="text-4xl font-bold text-red-500 mb-4">
                SYSTEM ERROR
              </h1>

              {/* Error Description */}
              <p className="text-xl text-yellow-300 mb-8">
                Your adventure has encountered a critical system error!
              </p>

              {/* Technical Details */}
              <div className="bg-black border-2 border-yellow-600 rounded p-4 mb-6 text-left">
                <h3 className="text-lg font-bold text-yellow-400 mb-2">
                  Error Details:
                </h3>
                <p className="text-sm text-yellow-300 font-mono break-all">
                  {this.state.error?.message || "Unknown error occurred"}
                </p>

                {true && ( // Show details in development
                  <details className="mt-4">
                    <summary className="text-yellow-400 cursor-pointer hover:text-yellow-300">
                      Technical Stack Trace
                    </summary>
                    <pre className="text-xs text-yellow-200 mt-2 overflow-x-auto">
                      {this.state.error?.stack}
                    </pre>
                    <pre className="text-xs text-yellow-200 mt-2 overflow-x-auto">
                      {this.state.errorInfo?.componentStack}
                    </pre>
                  </details>
                )}
              </div>

              {/* Action Buttons */}
              <div className="flex justify-center space-x-4">
                <button
                  onClick={this.handleReset}
                  className="bg-green-600 hover:bg-green-500 text-white font-bold py-3 px-6 rounded-lg text-lg transition-all transform hover:scale-105"
                >
                  [RESUME] Adventure
                </button>
                <button
                  onClick={() => (window.location.href = "/dashboard")}
                  className="bg-yellow-600 hover:bg-yellow-500 text-black font-bold py-3 px-6 rounded-lg text-lg transition-all transform hover:scale-105"
                >
                  [RETURN] to Dashboard
                </button>
                <button
                  onClick={() => window.location.reload()}
                  className="bg-blue-600 hover:bg-blue-500 text-white font-bold py-3 px-6 rounded-lg text-lg transition-all transform hover:scale-105"
                >
                  [RESTART] System
                </button>
              </div>

              {/* Help Text */}
              <div className="mt-8 text-center">
                <p className="text-yellow-500 text-sm">
                  If this error persists, please contact the system
                  administrator
                </p>
                <p className="text-yellow-600 text-xs mt-2">
                  Error Code: {this.state.error?.name || "UNKNOWN"}
                </p>
              </div>
            </div>

            {/* Decorative Elements */}
            <div className="absolute top-4 right-4 text-red-500 animate-spin">
              [ALERT]
            </div>
            <div className="absolute bottom-4 left-4 text-yellow-500 animate-pulse">
              [SYSTEM]
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
