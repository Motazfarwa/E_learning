import React from 'react';
import { useNavigate } from 'react-router-dom';

class ErrorBoundary extends React.Component {
  state = { hasError: false, error: null };

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error("Error Boundary:", error, errorInfo);
  }

  handleReset = () => {
    this.setState({ hasError: false, error: null });
    this.props.navigate('/'); // Use the navigate prop
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="fixed inset-0 bg-black/90 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg p-6 max-w-md text-center">
            <h2 className="text-xl font-bold text-red-600 mb-3">
              Something went wrong
            </h2>
            <p className="text-gray-600 mb-4">
              {this.state.error?.toString()}
            </p>
            <div className="flex gap-3 justify-center">
              <button
                onClick={this.handleReset}
                className="px-4 py-2 bg-gray-200 rounded-lg hover:bg-gray-300"
              >
                Try Again
              </button>
              <button
                onClick={() => window.location.reload()}
                className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
              >
                Reload Page
              </button>
            </div>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}

// Wrap with navigate prop
export default function ErrorBoundaryWrapper(props) {
  const navigate = useNavigate();
  return <ErrorBoundary navigate={navigate} {...props} />;
}