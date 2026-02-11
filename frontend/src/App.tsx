import React from "react";
import { Button } from "@/components/ui/button";

const App: React.FC = () => {
  return (
    <main className="min-h-screen bg-slate-50 text-slate-900">
      <div className="mx-auto max-w-3xl p-6">
        <h1 className="text-2xl font-semibold">Project Phoenix</h1>
        <p className="mt-2 text-sm text-slate-600">
          Phase 0 setup is complete.
        </p>
        <div className="mt-4">
          <Button type="button">Primary Button</Button>
        </div>
      </div>
    </main>
  );
};

export default App;
