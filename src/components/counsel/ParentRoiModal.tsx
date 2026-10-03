import { motion } from "framer-motion";
import { X } from "lucide-react";
import { useLanguageVoice, type SupportedLanguage } from "@/context/LanguageVoiceContext";

interface RoiTranslation {
  title: string;
  columns: [string, string, string];
  rows: [string, string, string][];
  takeaway: string;
}

const ROI_CONTENT: Record<SupportedLanguage, RoiTranslation> = {
  en: {
    title: "Parent ROI & Timeline Comparison: 3-Yr General BA vs. 2-Yr ITI Mechatronics",
    columns: ["Metric", "3-Year General BA", "2-Year ITI + Apprenticeship"],
    rows: [
      ["Total Tuition Cost", "₹65,000", "₹3,500 (Govt Subsidized)"],
      ["Monthly Apprenticeship Stipend", "₹0", "₹9,500 / month (Year 2 NAPS)"],
      ["Time to First Earning", "Month 42 (Uncertain)", "Month 14 (Apprenticeship)"],
      ["Median Starting Salary", "₹11,000 / month (Informal)", "₹19,500 / month (Automated Plant)"],
      ["5-Year Cumulative Family Income", "₹2,80,000", "₹8,65,000"],
    ],
    takeaway: "💡 The ITI pathway makes your child financially independent 2.5 years earlier, saving over ₹60,000 in upfront education costs.",
  },
  hi: {
    title: "अभिभावक वित्तीय लाभ व समय तुलना: 3-वर्षीय बीए बनाम 2-वर्षीय आईटीआई मेकाट्रॉनिक्स",
    columns: ["तुलना बिंदु", "3-वर्षीय सामान्य बीए", "2-वर्षीय आईटीआई + अप्रेंटिसशिप"],
    rows: [
      ["कुल शिक्षण शुल्क", "₹65,000", "₹3,500 (सरकारी अनुदानित)"],
      ["मासिक अप्रेंटिसशिप वजीफा", "₹0", "₹9,500 / माह (दूसरे वर्ष NAPS)"],
      ["प्रथम कमाई शुरू होने का समय", "42वां महीना (अनिश्चित)", "14वां महीना (अप्रेंटिसशिप)"],
      ["औसत शुरुआती वेतन", "₹11,000 / माह (असंगठित)", "₹19,500 / माह (स्वचालित प्लांट)"],
      ["5-वर्षीय कुल पारिवारिक आय", "₹2,80,000", "₹8,65,000"],
    ],
    takeaway: "💡 आईटीआई मार्ग आपके बच्चे को 2.5 वर्ष पहले आर्थिक रूप से आत्मनिर्भर बनाता है, और ₹60,000 से अधिक की सीधी बचत कराता है।",
  },
  mr: {
    title: "पालक नफा-तोटा व वेळेची तुलना: ३-वर्षीय बीए वि. २-वर्षीय आयटीआय मेकॅट्रॉनिक्स",
    columns: ["तुलना निकष", "३-वर्षीय सामान्य बीए", "२-वर्षीय आयटीआय + शिकाऊ उमेदवारी"],
    rows: [
      ["एकूण शिक्षण खर्च", "₹६५,०००", "₹३,५०० (शासकीय सवलत)"],
      ["मासिक शिकाऊ विद्यावेतन", "₹०", "₹९,५०० / महिना (दुसऱ्या वर्षी NAPS)"],
      ["पहिली कमाई सुरू होण्याची वेळ", "४२ वा महिना (अनिश्चित)", "१४ वा महिना (शिकाऊ उमेदवार)"],
      ["सुरुवातीचे सरासरी वेतन", "₹११,००० / महिना (असंघटित)", "₹१९,५०० / महिना (ऑटोमेटेड प्लांट)"],
      ["५ वर्षांचे एकूण कौटुंबिक उत्पन्न", "₹२,८०,०००", "₹८,६५,०००"],
    ],
    takeaway: "💡 आयटीआय मार्ग तुमच्या मुलाला अडीच वर्षे आधी आर्थिकदृष्ट्या स्वावलंबी बनवतो आणि शिक्षणातील ₹६०,००० हून अधिक वाचवतो.",
  },
  bn: {
    title: "পারিবারিক খরচের হিসাব ও সময় তুলনা: ৩ বছরের বিএ বনাম ২ বছরের আইটিআই মেকাট্রনিক্স",
    columns: ["তুলনার বিষয়", "৩ বছরের সাধারণ বিএ", "২ বছরের আইটিআই + শিক্ষানবিশী"],
    rows: [
      ["মোট টিউশন খরচ", "₹৬৫,০০০", "₹৩,৫০০ (সরকারি ভর্তুকিপ্রাপ্ত)"],
      ["মাসিক শিক্ষানবিশী ভাতা", "₹০", "₹৯,৫০০ / মাস (২য় বর্ষে NAPS)"],
      ["প্রথম উপার্জনের সময়কাল", "৪২তম মাস (অনিশ্চিত)", "১৪তম মাস (শিক্ষানবিশী)"],
      ["গড় প্রারম্ভিক বেতন", "₹১১,০০০ / মাস (অসংগঠিত)", "₹১৯,৫০০ / মাস (স্বয়ংক্রিয় প্ল্যান্ট)"],
      ["৫ বছরে মোট পারিবারিক আয়", "₹২,৮০,০০০", "₹৮,৬৫,০০০"],
    ],
    takeaway: "💡 আইটিআই কোর্স আপনার সন্তানকে আড়াই বছর আগেই আর্থিকভাবে স্বাবলম্বী করে তোলে এবং শিক্ষায় ₹৬০,০০০ এর বেশি বাঁচায়।",
  },
  ta: {
    title: "குடும்ப கல்வி முதலீட்டு பலன்: 3-ஆண்டு பி.ஏ vs 2-ஆண்டு ஐடிஐ மெக்கட்ரானிக்ஸ்",
    columns: ["ஒப்பீட்டு அளவுகோல்", "3-ஆண்டு வழக்கமான பி.ஏ", "2-ஆண்டு ஐடிஐ + தொழிற்பயிற்சி"],
    rows: [
      ["மொத்த கல்வி கட்டணம்", "₹65,000", "₹3,500 (அரசு மானியம்)"],
      ["மாதாந்திர பயிற்சி உதவித்தொகை", "₹0", "₹9,500 / மாதம் (2ம் ஆண்டு NAPS)"],
      ["முதல் வருமானம் ஈட்டும் நேரம்", "42-வது மாதம் (உறுதியற்றது)", "14-வது மாதம் (பயிற்சி காலத்தில்)"],
      ["சராசரி தொடக்க ஊதியம்", "₹11,000 / மாதம் (சாதாரண)", "₹19,500 / மாதம் (நவீன தொழிற்சாலை)"],
      ["5 ஆண்டுகளில் மொத்த குடும்ப வருமானம்", "₹2,80,000", "₹8,65,000"],
    ],
    takeaway: "💡 ஐடிஐ படிப்பு உங்கள் பிள்ளையை 2.5 ஆண்டுகள் முன்பாகவே சொந்த காலில் நிற்க வைக்கிறது, மேலும் ஆரம்ப கல்வி செலவில் ₹60,000-க்கு மேல் மிச்சப்படுத்துகிறது.",
  },
};

export function ParentRoiModal({ onClose }: { onClose: () => void }) {
  const { language } = useLanguageVoice();
  const c = ROI_CONTENT[language] || ROI_CONTENT.en;

  return (
    <Overlay
      onClose={onClose}
      title={c.title}
    >
      <div className="mt-4 overflow-x-auto">
        <table className="w-full min-w-[590px] text-left text-sm">
          <thead className="border-b text-muted-foreground">
            <tr>
              <th className="p-2">{c.columns[0]}</th>
              <th className="p-2">{c.columns[1]}</th>
              <th className="p-2">{c.columns[2]}</th>
            </tr>
          </thead>
          <tbody>
            {c.rows.map(([metric, ba, iti]) => (
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
        {c.takeaway}
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
