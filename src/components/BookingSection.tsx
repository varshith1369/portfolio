import { useState, useEffect } from "react";
import { Calendar, CheckCircle, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import Cal, { getCalApi } from "@calcom/embed-react";
import { SectionHeader, FadeUp } from "@/components/ui/scroll-animation";
import { Button } from "@/components/ui/button";
import { useCalComUrl } from "@/hooks/useSiteSettings";

const BookingSection = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [bookingConfirmed, setBookingConfirmed] = useState(false);
  const { value: calComUrl, isLoading: isLoadingCalUrl } = useCalComUrl();

  useEffect(() => {
    (async function () {
      const cal = await getCalApi();
      cal("on", {
        action: "bookingSuccessful",
        callback: () => {
          setBookingConfirmed(true);
          setTimeout(() => {
            setIsModalOpen(false);
            setTimeout(() => setBookingConfirmed(false), 300);
          }, 2000);
        },
      });
    })();
  }, []);

  return (
    <section className="py-24 md:py-32 bg-secondary/30">
      <div className="container">
        <SectionHeader className="text-center mb-12">
          <p className="text-sm font-medium tracking-[0.3em] uppercase text-muted-foreground mb-4">
            Schedule a Call
          </p>
          <h2 className="text-4xl tracking-tight mb-6 font-normal md:text-4xl">
            Book a Discovery Session
          </h2>
          <p className="text-lg text-muted-foreground max-w-xl mx-auto">
            Pick a time that works for you. We'll discuss your project and explore how we can help.
          </p>
        </SectionHeader>

        <FadeUp delay={0.2}>
          <div className="flex justify-center">
            <Button
              onClick={() => setIsModalOpen(true)}
              size="lg"
              className="gap-2 rounded-full px-8 py-6 text-base"
            >
              <Calendar className="w-5 h-5" />
              Book a Time
            </Button>
          </div>
        </FadeUp>

        {/* Booking Modal */}
        <AnimatePresence>
          {isModalOpen && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
              onClick={(e) => {
                if (e.target === e.currentTarget) setIsModalOpen(false);
              }}
            >
              <motion.div
                initial={{ opacity: 0, scale: 0.95, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: 20 }}
                transition={{ type: "spring", damping: 25, stiffness: 300 }}
                className="relative w-full max-w-3xl bg-background rounded-3xl shadow-2xl overflow-hidden"
              >
                {/* Header */}
                <div className="flex items-center justify-between p-6 border-b border-border/50">
                  <div>
                    <h3 className="text-xl font-medium">Schedule a Call</h3>
                    <p className="text-sm text-muted-foreground mt-1">
                      Select a date and time below
                    </p>
                  </div>
                  <button
                    onClick={() => setIsModalOpen(false)}
                    className="p-2 rounded-full hover:bg-secondary transition-colors"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                {/* Content */}
                <div className="relative min-h-[500px]">
                  <AnimatePresence mode="wait">
                    {bookingConfirmed ? (
                      <motion.div
                        key="confirmation"
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.9 }}
                        className="absolute inset-0 flex flex-col items-center justify-center gap-4 bg-background"
                      >
                        <motion.div
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          transition={{ type: "spring", damping: 15, stiffness: 200, delay: 0.1 }}
                        >
                          <CheckCircle className="w-16 h-16 text-green-500" />
                        </motion.div>
                        <motion.div
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: 0.2 }}
                          className="text-center"
                        >
                          <h4 className="text-2xl font-medium mb-2">Booking Confirmed!</h4>
                          <p className="text-muted-foreground">
                            Check your email for confirmation details.
                          </p>
                        </motion.div>
                      </motion.div>
                    ) : (
                      <motion.div
                        key="calendar"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="p-4"
                      >
                        {isLoadingCalUrl ? (
                          <div className="flex items-center justify-center h-[400px]">
                            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                          </div>
                        ) : (
                          <Cal
                            calLink={calComUrl}
                            style={{ width: "100%", height: "100%", overflow: "hidden" }}
                            config={{
                              layout: "month_view",
                              theme: "dark",
                            }}
                          />
                        )}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </section>
  );
};

export default BookingSection;
