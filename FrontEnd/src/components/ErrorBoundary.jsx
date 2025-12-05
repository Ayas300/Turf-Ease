import React from 'react';
import { useNavigate } from 'react-router-dom';
import './ErrorBoundary.css';

/**
 * ErrorBoundary component to catch rendering errors in child components
 * Displays a user-friendly error message with options to recover
 */
class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null
    };
  }

  static getDerivedStateFromError(error) {
    // Update state so the next render will show the fallback UI
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    // Log error details for debugging
    console.error('[ErrorBoundary] Caught an error:', error);
    console.error('[ErrorBoundary] Error info:', errorInfo);
    
    this.setState({
      error,
      errorInfo
    });
  }

  handleReset = () => {
    // Reset error state
    this.setState({
      hasError: false,
      error: null,
      errorInfo: null
    });
  };

  render() {
    if (this.state.hasError) {
      // Render fallback UI
      return (
        <ErrorFallback
          error={this.state.error}
          onReset={this.handleReset}
          onGoBack={this.props.onGoBack}
        />
      );
    }

    return this.props.children;
  }
}

/**
 * ErrorFallback component to display error UI
 * Separated as a functional component to use hooks like useNavigate
 */
function ErrorFallback({ error, onReset, onGoBack }) {
  const navigate = useNavigate();

  const handleGoBack = () => {
    if (onGoBack) {
      onGoBack();
    } else {
      navigate('/turfs');
    }
  };

  const handleRetry = () => {
    onReset();
    window.location.reload();
  };

  return (
    <div className="error-boundary-page">
      <div className="error-boundary-container">
        <div className="error-boundary-content">
          <div className="error-icon">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
              <circle cx="12" cy="12" r="10" strokeWidth="2" />
              <line x1="12" y1="8" x2="12" y2="12" strokeWidth="2" strokeLinecap="round" />
              <line x1="12" y1="16" x2="12.01" y2="16" strokeWidth="2" strokeLinecap="round" />
            </svg>
          </div>
          
          <h1 className="error-title">Oops! Something went wrong</h1>
          
          <p className="error-message">
            We encountered an unexpected error while displaying this page.
            This has been logged and we'll look into it.
          </p>

          {error && (
            <details className="error-details">
              <summary>Technical Details</summary>
              <pre className="error-stack">
                {error.toString()}
              </pre>
            </details>
          )}

          <div className="error-actions">
            <button className="error-btn error-btn-primary" onClick={handleRetry}>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
              Try Again
            </button>
            
            <button className="error-btn error-btn-secondary" onClick={handleGoBack}>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              Back to Turfs
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ErrorBoundary;
