/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { ShieldCheck } from "lucide-react";
import { PurchaseNotification } from "../types";

const firstNames = ["Paolo", "Gabriel", "Christian", "Mark", "Joshua", "Angelo", "Rafael", "Carlo", "Daniel", "Jerome", "Adrian", "Miguel", "Dave", "Kenneth", "Jethro", "Dominic"];
const lastInitials = ["S.", "M.", "R.", "D.", "C.", "T.", "V.", "L.", "B.", "G.", "P.", "A."];
const locations = [
  { city: "Quezon City", state: "Metro Manila" },
  { city: "Manila", state: "Metro Manila" },
  { city: "Makati", state: "Metro Manila" },
  { city: "Cebu City", state: "Cebu" },
  { city: "Davao City", state: "Davao" },
  { city: "Taguig", state: "BGC" },
  { city: "Pasig", state: "Metro Manila" },
  { city: "Angeles City", state: "Pampanga" },
  { city: "Baguio City", state: "Benguet" },
  { city: "Iloilo City", state: "Iloilo" },
  { city: "Bacolod City", state: "Negros Occ." },
  { city: "Cagayan de Oro", state: "Misamis Or." },
  { city: "Antipolo", state: "Rizal" },
  { city: "Dasmariñas", state: "Cavite" },
];

export default function SocialProofToast() {
  const [notification, setNotification] = useState<PurchaseNotification | null>(null);

  useEffect(() => {
    // Function to generate a random buyer
    const generateBuyer = () => {
      const name = `${firstNames[Math.floor(Math.random() * firstNames.length)]} ${lastInitials[Math.floor(Math.random() * lastInitials.length)]}`;
      const location = locations[Math.floor(Math.random() * locations.length)];
      const minAgo = Math.floor(Math.random() * 25) + 2;
      
      setNotification({
        name,
        city: location.city,
        state: location.state,
        timeAgo: `Purchased ${minAgo} minutes ago`
      });
    };

    // Show first notification after 3 seconds
    const initialTimeout = setTimeout(() => {
      generateBuyer();
    }, 3000);

    // Loop notification interval: show for 5s, hide for 7s
    const interval = setInterval(() => {
      setNotification(null); // Hide current
      setTimeout(() => {
        generateBuyer(); // Show new
      }, 1000);
    }, 12000);

    return () => {
      clearTimeout(initialTimeout);
      clearInterval(interval);
    };
  }, []);

  return (
    <div className="fixed bottom-6 left-6 z-50 pointer-events-none max-w-[280px] w-[85vw]">
      <AnimatePresence>
        {notification && (
          <motion.div
            initial={{ opacity: 0, x: -60 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -60 }}
            transition={{ type: "spring", stiffness: 220, damping: 22 }}
            className="flex items-center gap-2.5 p-2.5 pr-4 rounded-lg bg-slate-900/95 border border-brand-orange/20 shadow-xl backdrop-blur-md pointer-events-auto"
          >
            {/* Icon check */}
            <div className="relative flex-shrink-0 w-7 h-7 rounded-full bg-brand-orange/10 flex items-center justify-center text-brand-orange">
              <ShieldCheck className="w-4 h-4" />
            </div>

            {/* Compact Notification content */}
            <div className="flex-1 min-w-0 text-xs">
              <p className="text-slate-200 font-medium truncate">
                <span className="font-bold text-white">{notification.name}</span> just got access!
              </p>
              <p className="text-[10px] text-slate-400 font-mono flex items-center gap-1">
                <span>{notification.city}, {notification.state}</span>
                <span>•</span>
                <span className="text-emerald-400 font-medium">Instant Access</span>
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
