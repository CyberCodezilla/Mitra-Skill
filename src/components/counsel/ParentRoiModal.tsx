import { motion } from "framer-motion";
import { X } from "lucide-react";

const rows = [
  ["Total Tuition Expense", "₹65,000", "₹3,500 (Govt Subsidized)"],
  ["Apprenticeship Stipend", "₹0", "₹9,500 / month (Year 2 NAPS)"],
  ["Time to First Earning", "Month 42 (Uncertain)", "Month 14 (Apprenticeship)"],
  ["Median Starting Salary", "₹11,000 / month (Informal)", "₹19,500 / month (Automated Plant)"],
  ["Cumulative 5-Year Income", "₹2,80,000", "₹8,65,000"],
];

export function ParentRoiModal({ onClose }: { onClose: () => void }) {
  return (
    <Overlay
      onClose={onClose}
      title="Parent ROI & Timeline Comparison: 3-Yr General BA vs. 2-Yr ITI Mechatronics"
    >
      <div className="mt-4 overflow-x-auto">
        <table className="w-full min-w-[590px] text-left text-sm">
          <thead className="border-b text-muted-foreground">
            <tr>
              <th className="p-2">Metric</th>
              <th className="p-2">3-Year General BA</th>
              <th className="p-2">2-Year ITI + Apprenticeship</th>
            </tr>
          </thead>
          <tbody>
            {rows.map(([metric, ba, iti]) => (
              <tr key={metric} className="border-b">
                <th className="p-2 text-navy">{metric}</th>
                <td className="p-2">{ba}</td>
                <td className="p-2 font-semibold text-success">{iti}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <p className="mt-5 rounded-xl bg-accent p-4 font-semibold text-navy">
        💡 The ITI pathway makes your child financially independent 2.5 years earlier, saving over
        ₹60,000 in upfront education costs.
      </p>
    </Overlay>
  );
}

export function Overlay({
  title,
  onClose,
  children,
}: {
  title: string;
  onClose: () => void;
  children: React.ReactNode;
}) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center bg-navy/60 p-4"
      onClick={onClose}
    >
      <motion.div
        role="dialog"
        aria-modal="true"
        aria-label={title}
        initial={{ scale: 0.96, y: 12 }}
        animate={{ scale: 1, y: 0 }}
        className="max-h-[90vh] w-full max-w-3xl overflow-auto rounded-2xl bg-card p-6 shadow-card"
        onClick={(event) => event.stopPropagation()}
      >
        <div className="flex items-start justify-between gap-4">
          <h2 className="text-xl font-bold text-navy">{title}</h2>
          <button onClick={onClose} aria-label="Close">
            <X className="h-5 w-5" />
          </button>
        </div>
        {children}
      </motion.div>
    </motion.div>
  );
}
