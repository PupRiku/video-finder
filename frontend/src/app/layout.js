import './globals.css';

export const metadata = {
  title: 'AI Video Finder',
  description: 'AI-powered video frame search',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
