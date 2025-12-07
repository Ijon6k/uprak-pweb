import Header from "./Header";

export default function Layout({ children }) {
  return (
    <div className="min-h-screen bg-gray-50 text-gray-900 font-sans">
      <div className="flex flex-col min-h-screen">
        <Header />
        <main className="flex-grow container mx-auto px-4 py-8">
          {children}
        </main>
        <footer className="border-t border-gray-200 py-8 mt-12 bg-white">
          <div className="container mx-auto px-4 text-center text-gray-500 text-sm">
            <p>
              &copy; {new Date().getFullYear()} Tugas Ujian Praktik pemrograman
              web
            </p>
          </div>
        </footer>
      </div>
    </div>
  );
}
