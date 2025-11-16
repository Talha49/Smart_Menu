'use client';

export default function Watermark({ variant = 'page' }) {
  if (variant === 'tv') {
    return (
      <div className="fixed bottom-4 right-4">
        <p className="text-sm text-gray-500">
          Powered by <span className="font-semibold text-gray-400">SmartMenu</span>
        </p>
      </div>
    );
  }
  return (
    <div className="mt-12 pt-8 border-t border-gray-300 text-center">
      <p className="text-sm text-gray-500">
        Powered by <span className="font-semibold text-gray-700">SmartMenu</span>
      </p>
    </div>
  );
}


