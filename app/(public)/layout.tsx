import Navbar from "@/components/layout/NavBar";
import Footer from "@/components/layout/Footer";
import Advertisement from "@/components/ads/advertisement";

export default function PublicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-gray-100">
      <Navbar />
      {children}
      <Advertisement />
      <Footer />
    </div>
  );
}
