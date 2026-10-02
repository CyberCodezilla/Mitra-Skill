import { GraduationCap, MapPin, PlayCircle } from "lucide-react";
import { Overlay } from "./ParentRoiModal";

export function AlumniStoryModal({ onClose }: { onClose: () => void }) {
  return (
    <Overlay title="Local Alumni Story — Meerut" onClose={onClose}>
      <div className="mt-5 overflow-hidden rounded-2xl bg-navy text-navy-foreground">
        <div className="flex min-h-36 items-center justify-center bg-gradient-to-br from-student to-navy">
          <PlayCircle className="h-14 w-14" aria-label="Story preview" />
        </div>
        <div className="p-5">
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-white/15">
              <GraduationCap />
            </div>
            <div>
              <h3 className="text-lg font-bold">Vikas Prajapati</h3>
              <p className="flex items-center gap-1 text-sm text-white/75">
                <MapPin className="h-3.5 w-3.5" /> Saket, Meerut
              </p>
            </div>
          </div>
          <span className="mt-4 inline-block rounded-full bg-success/20 px-3 py-1 text-sm font-semibold text-emerald-200">
            Alumni Cohort 2023 - ITI Saket
          </span>
          <p className="mt-4 font-semibold">
            Diagnostic Specialist at Tata Motors EV Hub{" "}
            <span className="text-emerald-200">(₹26,000/month)</span>
          </p>
          <blockquote className="mt-4 border-l-2 border-saffron pl-3 italic text-white/90">
            “My family was worried that mechanic work had no respect. Today, I connect laptops to
            electric bus controllers in an air-conditioned bay and support my family.”
          </blockquote>
        </div>
      </div>
    </Overlay>
  );
}
