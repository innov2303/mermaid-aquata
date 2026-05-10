import { Switch, Route, Router as WouterRouter, useLocation } from "wouter";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AnimatePresence } from "framer-motion";
import { useEffect } from "react";
import NotFound from "@/pages/not-found";
import Home from "@/pages/home";
import Catalogue from "@/pages/catalogue";
import Commander from "@/pages/commander";
import Faq from "@/pages/faq";
import Remerciements from "@/pages/remerciements";
import Admin from "@/pages/admin";
import ProductionsTv from "@/pages/productions-tv";
import MonHistoire from "@/pages/mon-histoire";
import PolitiqueDeRetour from "@/pages/politique-de-retour";
import { NavBar } from "@/components/NavBar";
import { Footer } from "@/components/Footer";
import { LanguageProvider } from "@/context/LanguageContext";

const queryClient = new QueryClient();

function ScrollToTop() {
  const [location] = useLocation();
  useEffect(() => { window.scrollTo({ top: 0, behavior: "instant" }); }, [location]);
  return null;
}

function AnimatedRoutes() {
  const [location] = useLocation();

  return (
    <AnimatePresence mode="wait">
      <Switch key={location} location={location}>
        <Route path="/" component={Home} />
        <Route path="/queue-de-sirene" component={Catalogue} />
        <Route path="/commander" component={Commander} />
        <Route path="/faq" component={Faq} />
        <Route path="/avis" component={Remerciements} />
        <Route path="/productions-tv" component={ProductionsTv} />
        <Route path="/mon-histoire" component={MonHistoire} />
        <Route path="/admin" component={Admin} />
        <Route path="/politique-de-retour" component={PolitiqueDeRetour} />
        <Route component={NotFound} />
      </Switch>
    </AnimatePresence>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <LanguageProvider>
          <WouterRouter base={import.meta.env.BASE_URL.replace(/\/$/, "")}>
            <ScrollToTop />
            <div className="min-h-screen flex flex-col selection:bg-accent/30 selection:text-white dark" style={{ backgroundColor: '#0a3a5c', overflowX: 'hidden' }}>
              <NavBar />
              <main className="flex-1">
                <AnimatedRoutes />
              </main>
              <div style={{ width: '100%', height: '2px', background: 'linear-gradient(90deg, transparent 0%, rgba(0,200,239,0.5) 25%, rgba(0,200,239,0.7) 50%, rgba(0,200,239,0.5) 75%, transparent 100%)', boxShadow: '0 0 8px rgba(0,200,239,0.3)' }} />
              <Footer />
            </div>
          </WouterRouter>
          <Toaster />
        </LanguageProvider>
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
