import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ScrollToTop } from "@/components/ScrollToTop";
import { LegacyRedirects } from "@/components/LegacyRedirects";
import { CartProvider } from "@/contexts/CartContext";
import Index from "./pages/Index";
import About from "./pages/About";
import Catalog from "./pages/Catalog";
import Store from "./pages/Store";
import Checkout from "./pages/Checkout";
import Technology from "./pages/Technology";
import Training from "./pages/Training";
import Articles from "./pages/Articles";
import ArticlePage from "./pages/ArticlePage";
import Contacts from "./pages/Contacts";
import Inquiry from "./pages/Inquiry";
import Delivery from "./pages/Delivery";
import Privacy from "./pages/Privacy";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <CartProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <ScrollToTop />
          <LegacyRedirects />
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/about" element={<About />} />
            <Route path="/catalog" element={<Catalog />} />
            <Route path="/store" element={<Store />} />
            <Route path="/store/checkout" element={<Checkout />} />
            <Route path="/technology" element={<Technology />} />
            <Route path="/training" element={<Training />} />
            <Route path="/articles" element={<Articles />} />
            <Route path="/articles/:slug" element={<ArticlePage />} />
            <Route path="/contacts" element={<Contacts />} />
            <Route path="/inquiry" element={<Inquiry />} />
            <Route path="/delivery" element={<Delivery />} />
            <Route path="/privacy" element={<Privacy />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </CartProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
