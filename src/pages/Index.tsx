import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";

const Index = () => {
  const navigate = useNavigate();
  return (
    <div className="min-h-screen bg-white flex items-center justify-center text-center px-6">
      <div>
        <h1 className="font-display text-5xl font-extrabold text-brand-navy mb-4">
          Faleh Franchise Readiness
        </h1>
        <p className="text-brand-muted mb-8 max-w-md mx-auto">
          Find out if your business is ready to franchise in the UAE.
        </p>
        <Button
          onClick={() => navigate("/assessment")}
          className="bg-brand-gold hover:bg-brand-goldDim text-brand-navy font-display font-extrabold px-10 h-14"
        >
          Start Assessment →
        </Button>
      </div>
    </div>
  );
};

export default Index;