import type { Metadata } from 'next';
import { ThemeProvider } from 'next-themes';
import './globals.css';

const defaultUrl =
  process.env.NODE_ENV === 'production'
    ? `https://testapp-fph9dpg4fzb9dhgd.swedencentral-01.azurewebsites.net`
    : 'http://localhost:3000';

export const metadata: Metadata = {
  metadataBase: new URL(defaultUrl),
  title: 'UNQ Consulting',
  description: 'Handle under consulting assignments, consultants, and clients.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="font-poppins antialiased">
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
