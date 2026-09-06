import "./globals.css";

export const metadata = {
  title: "Project Shivodaya | Deep Space Neural Mesh Network",
  description: "Severing Humanity's Earth-Dependency in Deep Space during Catastrophic Solar Storms.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className="scroll-smooth" style={{ backgroundColor: "#000000", color: "#ffffff" }}>
      <body 
        className="bg-black text-white min-h-screen font-sans antialiased selection:bg-cyan-500 selection:text-black"
        style={{ backgroundColor: "#000000", color: "#ffffff" }}
      >
        <main className="min-h-screen bg-black text-white" style={{ backgroundColor: "#000000" }}>
          {children}
        </main>
      </body>
    </html>
  );
}




