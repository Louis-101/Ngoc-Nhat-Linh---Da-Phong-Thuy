import React from 'react';

interface Props {
  children: React.ReactNode;
}

interface State {
  hasError: boolean;
  error?: Error;
}

export default class ErrorBoundary extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo): void {
    console.error('ErrorBoundary caught an error', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex items-center justify-center bg-white text-red-700 px-6 py-10">
          <div className="max-w-md text-center">
            <h1 className="text-2xl font-bold mb-4">Đã xảy ra lỗi</h1>
            <p className="text-base text-red-600 mb-4">Ứng dụng hiện đang gặp sự cố. Vui lòng thử tải lại trang.</p>
            <pre className="text-xs text-left bg-gray-100 p-4 rounded overflow-x-auto">{this.state.error?.message}</pre>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
