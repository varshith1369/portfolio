import { useState, useMemo } from "react";
import { Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { SectionHeader, StaggerContainer, StaggerItem } from "@/components/ui/scroll-animation";
import { useNavigate } from "react-router-dom";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import { motion, AnimatePresence } from "framer-motion";

export interface PricingState {
  planName: string;
  billingType: "monthly" | "annual";
  teamSize: number;
  price: number;
}

// Pricing configuration
const BASE_PRICES = {
  Essential: 49.9,
  Professional: 69.9,
  Premium: 99.9,
};

const TEAM_SIZE_MULTIPLIER = 0.15; // 15% increase per team member above 1
const ANNUAL_DISCOUNT = 0.20; // 20% discount for annual billing

const PricingPlans = () => {
  const navigate = useNavigate();
  const [teamSize, setTeamSize] = useState(1);
  const [isAnnual, setIsAnnual] = useState(false);

  const handleGetStarted = (planName: string, price: number) => {
    const pricingState: PricingState = {
      planName,
      billingType: isAnnual ? "annual" : "monthly",
      teamSize,
      price,
    };
    navigate("/contact", { state: { pricing: pricingState } });
  };

  // Calculate dynamic prices based on inputs
  const calculatePrice = useMemo(() => {
    return (basePrice: number) => {
      let price = basePrice;
      
      // Add team size multiplier (first member is included)
      if (teamSize > 1) {
        price += basePrice * TEAM_SIZE_MULTIPLIER * (teamSize - 1);
      }
      
      // Apply annual discount
      if (isAnnual) {
        price = price * (1 - ANNUAL_DISCOUNT);
      }
      
      return price;
    };
  }, [teamSize, isAnnual]);

  const pricingPlans = useMemo(() => [
    {
      badge: "New",
      name: "Essential" as const,
      basePrice: BASE_PRICES.Essential,
      price: calculatePrice(BASE_PRICES.Essential),
      description: "Essential branding + basic ads.",
      features: ["Basic brand design", "Ad strategy setup", "Analyze target audience", "A/B testing for ads"],
      isPopular: false,
      buttonStyle: "outline" as const,
    },
    {
      badge: "Popular",
      name: "Professional" as const,
      basePrice: BASE_PRICES.Professional,
      price: calculatePrice(BASE_PRICES.Professional),
      description: "Brand development + advanced ads.",
      features: ["Brand identity redesign", "Integrated marketing", "Market research", "Ad optimization"],
      isPopular: true,
      buttonStyle: "default" as const,
    },
    {
      badge: "New",
      name: "Premium" as const,
      basePrice: BASE_PRICES.Premium,
      price: calculatePrice(BASE_PRICES.Premium),
      description: "Premium brand + full ad management.",
      features: ["Brand experience", "Multi-channel ads", "Competitive positioning", "Real-time ad analytics"],
      isPopular: false,
      buttonStyle: "outline" as const,
    },
  ], [calculatePrice]);

  // Calculate total savings for annual billing
  const annualSavings = useMemo(() => {
    if (!isAnnual) return 0;
    const monthlyTotal = pricingPlans.reduce((sum, plan) => sum + plan.basePrice, 0);
    return monthlyTotal * ANNUAL_DISCOUNT * 12;
  }, [isAnnual, pricingPlans]);

  return (
    <section className="py-24 md:py-32">
      <div className="container max-w-6xl">
        {/* Section Header */}
        <SectionHeader className="text-center mb-20">
          <h2 className="text-4xl tracking-tight mb-4 font-normal md:text-5xl">
            Simple, transparent pricing
          </h2>
          <p className="text-muted-foreground max-w-md mx-auto">
            Choose a plan that fits your needs. No hidden fees.
          </p>
        </SectionHeader>

        {/* Interactive Controls */}
        <div className="max-w-md mx-auto mb-16 space-y-6">
          {/* Team Size Slider */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Team size</span>
              <motion.span
                key={teamSize}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-sm font-medium"
              >
                {teamSize} {teamSize === 1 ? "member" : "members"}
              </motion.span>
            </div>
            <Slider
              value={[teamSize]}
              onValueChange={(value) => setTeamSize(value[0])}
              min={1}
              max={10}
              step={1}
              className="w-full"
            />
          </div>

          {/* Billing Toggle */}
          <div className="flex items-center justify-between pt-2">
            <span className="text-sm text-muted-foreground">Annual billing</span>
            <div className="flex items-center gap-3">
              <span className={`text-sm ${!isAnnual ? 'text-foreground' : 'text-muted-foreground'}`}>Monthly</span>
              <Switch
                checked={isAnnual}
                onCheckedChange={setIsAnnual}
              />
              <span className={`text-sm ${isAnnual ? 'text-foreground' : 'text-muted-foreground'}`}>Annual</span>
              {isAnnual && (
                <motion.span
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="text-xs text-primary font-medium"
                >
                  Save 20%
                </motion.span>
              )}
            </div>
          </div>
        </div>

        {/* Pricing Cards */}
        <StaggerContainer className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
          {pricingPlans.map((plan, index) => (
            <StaggerItem key={index}>
              <div
                className={`
                  relative rounded-3xl p-8 transition-all duration-300 h-full flex flex-col
                  ${plan.isPopular 
                    ? "bg-primary text-primary-foreground" 
                    : "bg-card border border-border hover:border-primary/20"
                  }
                `}
              >
                {/* Plan Name */}
                <div className="mb-8">
                  <h3 className={`text-lg font-medium mb-1 ${plan.isPopular ? "text-primary-foreground" : ""}`}>
                    {plan.name}
                  </h3>
                  <p className={`text-sm ${plan.isPopular ? "text-primary-foreground/70" : "text-muted-foreground"}`}>
                    {plan.description}
                  </p>
                </div>

                {/* Price */}
                <div className="mb-8">
                  <div className="flex items-baseline gap-1">
                    <AnimatePresence mode="wait">
                      <motion.span
                        key={plan.price.toFixed(2)}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        transition={{ duration: 0.2 }}
                        className={`text-5xl font-light tracking-tight ${plan.isPopular ? "text-primary-foreground" : ""}`}
                      >
                        ${plan.price.toFixed(0)}
                      </motion.span>
                    </AnimatePresence>
                    <span className={`text-sm ${plan.isPopular ? "text-primary-foreground/70" : "text-muted-foreground"}`}>
                      /month
                    </span>
                  </div>
                  {teamSize > 1 && (
                    <motion.p
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className={`text-xs mt-2 ${plan.isPopular ? "text-primary-foreground/60" : "text-muted-foreground"}`}
                    >
                      for {teamSize} team members
                    </motion.p>
                  )}
                </div>

                {/* Features */}
                <ul className="space-y-3 mb-8 flex-grow">
                  {plan.features.map((feature, featureIndex) => (
                    <li key={featureIndex} className="flex items-center gap-3">
                      <Check className={`w-4 h-4 flex-shrink-0 ${plan.isPopular ? "text-primary-foreground" : "text-primary"}`} />
                      <span className={`text-sm ${plan.isPopular ? "text-primary-foreground/90" : ""}`}>{feature}</span>
                    </li>
                  ))}
                </ul>

                {/* CTA Button */}
                <Button
                  variant={plan.isPopular ? "secondary" : "outline"}
                  className="w-full rounded-full h-12"
                  onClick={() => handleGetStarted(plan.name, plan.price)}
                >
                  Get started
                </Button>
              </div>
            </StaggerItem>
          ))}
        </StaggerContainer>

        {/* Live indicator */}
        <div className="flex items-center justify-center gap-2 mt-12 text-xs text-muted-foreground">
          <motion.div
            animate={{ opacity: [0.5, 1, 0.5] }}
            transition={{ duration: 2, repeat: Infinity }}
            className="w-1.5 h-1.5 rounded-full bg-green-500"
          />
          <span>Prices update instantly</span>
        </div>
      </div>
    </section>
  );
};

export default PricingPlans;
