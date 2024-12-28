import Link from 'next/link';
import './globals.css';
import QueryHookProvider from '@/components/QueryHookProvider';

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <QueryHookProvider>
          <div className="min-h-screen bg-gray-100">
            <nav className="bg-blue-600 text-white p-4">
              <Link href={"/"} className="text-xl font-bold">Task Manager</Link>
            </nav>
            <main className="p-6">{children}</main>
          </div>
        </QueryHookProvider>
      </body>
    </html>
  );
}
