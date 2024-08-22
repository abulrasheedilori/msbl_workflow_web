import React, { ReactNode } from "react";
import Homepage from "../screens/homepage/Homepage";

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
        <div className="relative">
          <Homepage />
          <p className="absolute top-[45vh] left-[45vw]">Please, try again</p>
        </div>
      );
    }

    // Render the children if no error occurred
    return this.props.children;
  }
}

export default ErrorBoundary;
