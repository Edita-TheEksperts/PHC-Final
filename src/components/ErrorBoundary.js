import { Component } from "react";

/**
 * Generic React error boundary. A render-time error in any child is caught here
 * and shown as a friendly German fallback instead of the black "Application error"
 * screen that would otherwise brick the whole page on every subsequent load.
 *
 * Usage:
 *   <ErrorBoundary>
 *     <SomeComponent />
 *   </ErrorBoundary>
 */
export default class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error, info) {
    // Keep a console trace for debugging; never rethrow.
    console.error("[ErrorBoundary] Render error caught:", error, info);
  }

  handleReload = () => {
    this.setState({ hasError: false });
    if (typeof window !== "undefined") window.location.reload();
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-[50vh] flex items-center justify-center p-6">
          <div className="max-w-md text-center bg-white rounded-2xl shadow-md border border-gray-100 p-8">
            <h2 className="text-xl font-semibold text-[#04436F] mb-2">
              Etwas ist schiefgelaufen
            </h2>
            <p className="text-sm text-gray-600 mb-6">
              Beim Anzeigen dieser Seite ist ein Fehler aufgetreten. Ihre Daten
              sind sicher. Bitte laden Sie die Seite neu.
            </p>
            <button
              onClick={this.handleReload}
              className="px-5 py-2.5 rounded-full bg-[#04436F] text-white text-sm font-medium hover:bg-[#B99B5F] transition"
            >
              Seite neu laden
            </button>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}
