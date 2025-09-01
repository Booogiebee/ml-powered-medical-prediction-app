import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ThemeProvider } from "@/hooks/use-theme";
import {
	ClerkProvider,
	SignedIn,
	SignedOut,
	RedirectToSignIn,
} from "@clerk/clerk-react";
import Index from "./pages/Index";
import Diagnosis from "./pages/Diagnosis";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();
const clerkPubKey = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY;

if (!clerkPubKey) {
	throw new Error("Missing Publishable Key");
}

const App = () => (
	<ClerkProvider publishableKey={clerkPubKey}>
		<QueryClientProvider client={queryClient}>
			<ThemeProvider defaultTheme="system" storageKey="mediguard-ui-theme">
				<TooltipProvider>
					<Toaster />
					<Sonner />
					<BrowserRouter>
						<Routes>
							<Route path="/" element={<Index />} />
							<Route
								path="/diagnosis"
								element={
									<>
										<SignedIn>
											<Diagnosis />
										</SignedIn>
										<SignedOut>
											<RedirectToSignIn />
										</SignedOut>
									</>
								}
							/>
							<Route path="*" element={<NotFound />} />
						</Routes>
					</BrowserRouter>
				</TooltipProvider>
			</ThemeProvider>
		</QueryClientProvider>
	</ClerkProvider>
);

export default App;
