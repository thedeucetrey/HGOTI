export const metadata = {
  title: "HGOTI",
  description: "Hottest Woman on the Internet — API & admin endpoints",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
