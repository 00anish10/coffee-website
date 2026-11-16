import { Component, type ErrorInfo, type ReactNode } from 'react';

interface ErrorBoundaryProps {
  children: ReactNode;
}

interface ErrorBoundaryState {
  hasError: boolean;
  message?: string;
}

export class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  state: ErrorBoundaryState = { hasError: false };

  static getDerivedStateFromError(error: unknown): ErrorBoundaryState {
    return {
      hasError: true,
      message: error instanceof Error ? error.message : 'Something went wrong.',
    };
  }

  componentDidCatch(error: Error, info: ErrorInfo): void {
    console.error('Unhandled UI error:', error, info.componentStack);
  }

  handleReload = () => {
    window.location.reload();
  };

  render() {
    if (!this.state.hasError) return this.props.children;

    return (
      <div className="min-h-screen flex items-center justify-center bg-crema dark:bg-espresso text-espresso dark:text-snow px-4">
        <div className="max-w-md w-full rounded-2xl bg-[#EFE0CC] dark:bg-roasted/70 border border-mocha/15 dark:border-crema/10 p-8 text-center shadow-lg">
          <p className="text-xs font-medium tracking-widest text-caramel">A small spill</p>
          <h1 className="mt-2 font-serif text-3xl font-semibold">We burned this batch</h1>
          <p className="mt-3 text-sm text-roasted/80 dark:text-crema/75">
            Something unexpected happened while rendering the page. Reloading usually fixes it.
          </p>
          {this.state.message && (
            <p className="mt-3 rounded-lg bg-espresso/10 dark:bg-espresso/60 px-3 py-2 text-xs text-roasted/70 dark:text-crema/60 break-words">
              {this.state.message}
            </p>
          )}
          <button
            type="button"
            onClick={this.handleReload}
            className="mt-6 rounded-xl bg-caramel px-5 py-2.5 text-sm font-semibold text-espresso hover:bg-caramel/90 transition-colors"
          >
            Reload page
          </button>
        </div>
      </div>
    );
  }
}
