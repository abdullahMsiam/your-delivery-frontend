import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/layout/theme-toggle";

export default function Home() {
  return (
    <main className="min-h-screen flex flex-col items-center justify-center gap-6 p-8">
      <div className="absolute top-4 right-4">
        <ThemeToggle />
      </div>
      <h1 className="text-4xl font-bold tracking-tight">Your Delivery</h1>
      <p className="text-muted-foreground">Scaffolding ready. Let ship.</p>
      <Button>Primary (red) button</Button>
    </main>
  );
}