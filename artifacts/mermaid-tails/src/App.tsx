import { Switch, Route, Router as WouterRouter, useLocation } from "wouter";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AnimatePresence } from "framer-motion";
import NotFound from "@/pages/not-found";
import Home from "@/pages/home";
import Catalogue from "@/pages/catalogue";
import Commander from "@/pages/commander";
import Faq from "@/pages/faq";
import Remerciements from "@/pages/remerciements";
import { NavBar } from "@/components/NavBar";
import { Footer } from "@/components/Footer";

const queryClient = new QueryClient();

function AnimatedRoutes() {
  const [location] = useLocation();

  return (
    <AnimatePresence mode="wait">
      <Switch key={location} location={location}>
        <Route path="/" component={Home} />
        <Route path="/catalogue" component={Catalogue} />
        <Route path="/commander" component={Commander} />
        <Route path="/faq" component={Faq} />
        <Route path="/remerciements" component={Remerciements} />
        <Route component={NotFound} />
      </Switch>
    </AnimatePresence>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <WouterRouter base={import.meta.env.BASE_URL.replace(/\/$/, "")}>
          <div className="min-h-[100dvh] flex flex-col selection:bg-accent/30 selection:text-white dark" style={{ backgroundColor: '#0a3a5c' }}>
            <NavBar />
            <main className="flex-1">
              <AnimatedRoutes />
            </main>
            <Footer />
          </div>
        </WouterRouter>
        <Toaster />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
