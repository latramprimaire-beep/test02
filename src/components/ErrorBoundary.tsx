import { Component, ErrorInfo, ReactNode } from "react";

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends Component<Props, State> {
  public override state: State = {
    hasError: false,
    error: null,
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public override componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error("Uncaught error:", error, errorInfo);
  }

  public override render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col items-center justify-center p-6 text-center font-sans">
          <div className="max-w-md bg-slate-900 border border-slate-800 rounded-xl p-6 shadow-2xl">
            <div className="w-12 h-12 rounded-full bg-red-500/20 text-red-400 flex items-center justify-center mx-auto mb-4 font-bold text-xl">
              !
            </div>
            <h2 className="text-lg font-semibold text-white mb-2">Une erreur est survenue</h2>
            <p className="text-sm text-slate-400 mb-4">
              L'application a rencontré un problème inattendu lors de l'exécution.
            </p>
            {this.state.error && (
              <pre className="text-xs text-left bg-slate-950 p-3 rounded text-red-300 font-mono overflow-x-auto mb-4 border border-slate-800">
                {this.state.error.message}
              </pre>
            )}
            <button
              onClick={() => window.location.reload()}
              className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold rounded-lg transition-colors cursor-pointer"
            >
              Recharger l'application
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
