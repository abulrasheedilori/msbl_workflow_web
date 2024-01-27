import React, { ReactNode } from "react";

interface ErrorBoundaryProps {
  children: ReactNode;
}

interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
  errorInfo: React.ErrorInfo | null;
}

class ErrorBoundary extends React.Component<
  ErrorBoundaryProps,
  ErrorBoundaryState
> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null,
    };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo): void {
    this.setState({
      hasError: true,
      error,
      errorInfo,
    });

    // You can also log the error to an error reporting service
    // logErrorToMyService(error, errorInfo);
  }

  render(): React.ReactNode {
    if (this.state.hasError) {
      // Render custom fallback UI
      return (
        <div className="my-[50vh]">
          <h1 className="text-center text-4xl">Something went wrong</h1>
          <p className=" animate-spin  my-8 text-2xl text-center text-green-900">
            MBSL
          </p>
          <p className="text-center mt-8">Please, try again</p>

          {/* <p>{this.state.error && this.state.error.toString()}</p>
          <div>
            {this.state.errorInfo && this.state.errorInfo.componentStack}
          </div> */}
        </div>
      );
    }

    // Render the children if no error occurred
    return this.props.children;
  }
}

export default ErrorBoundary;
