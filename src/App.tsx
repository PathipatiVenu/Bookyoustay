import { AppProvider, useApp } from "./context/AppContext";
import WelcomeSplash from "./components/WelcomeSplash";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import HomePage from "./pages/HomePage";
import ResortsPage from "./pages/ResortsPage";
import VillasPage from "./pages/VillasPage";
import GuidePage from "./pages/GuidePage";
import PropertyPage from "./pages/PropertyPage";
import BookingPage from "./pages/BookingPage";
import ConfirmationPage from "./pages/ConfirmationPage";

function Router() {
  const { page } = useApp();
  switch (page) {
    case "home":
      return <HomePage />;
    case "resorts":
      return <ResortsPage />;
    case "villas":
      return <VillasPage />;
    case "guide":
      return <GuidePage />;
    case "property":
      return <PropertyPage />;
    case "booking":
      return <BookingPage />;
    case "confirmation":
      return <ConfirmationPage />;
    default:
      return <HomePage />;
  }
}

export default function App() {
  return (
    <AppProvider>
      <WelcomeSplash />
      <div className="min-h-screen bg-[--color-canvas]">
        <Navbar />
        <main>
          <Router />
        </main>
        <Footer />
      </div>
    </AppProvider>
  );
}
