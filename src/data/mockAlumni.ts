export interface AlumniStory {
  id: string;
  name: string;
  name_hi: string;
  age: number;
  gender: "female" | "male";
  hometown_district: string;
  trade_id: string;
  trade_name: string;
  trade_name_hi: string;
  graduating_iti: string;
  graduation_year: number;
  current_role: string;
  current_role_hi: string;
  employer: string;
  monthly_earnings: string;
  five_year_trajectory: string;
  quote_en: string;
  quote_hi: string;
  audio_duration_secs: number;
  tags: string[];
  is_female_pioneer?: boolean;
  is_sample: true;
}

// Fictional, composite stories based on the supplied prototype brief. None are verified alumni.
export const MOCK_ALUMNI_STORIES: AlumniStory[] = [
  {
    id: "ALUMNI_DEMO_01",
    name: "Pooja Verma",
    name_hi: "पूजा वर्मा",
    age: 21,
    gender: "female",
    hometown_district: "Mawana, Meerut, Uttar Pradesh",
    trade_id: "SOLAR_TECH_02",
    trade_name: "Solar PV Rooftop Technician",
    trade_name_hi: "सोलर पीवी रूफटॉप तकनीशियन",
    graduating_iti: "Sample profile · Govt Women ITI Saket, Meerut",
    graduation_year: 2023,
    current_role: "Field Commissioning Specialist (illustrative)",
    current_role_hi: "फील्ड कमीशनिंग विशेषज्ञ (उदाहरण)",
    employer: "Sample employer reference · not verified",
    monthly_earnings: "₹23,500 / month (sample figure)",
    five_year_trajectory:
      "Illustrative next step: Regional Quality Inspector; target pay is not guaranteed.",
    quote_en:
      "My family worried about safety and whether technical work was right for me. In this sample story, training leads to supervised solar installations and a path to grow in the field.",
    quote_hi:
      "मेरे परिवार को सुरक्षा और तकनीकी काम को लेकर चिंता थी। इस नमूना कहानी में प्रशिक्षण के बाद निगरानी में सोलर इंस्टॉलेशन का काम और आगे बढ़ने का अवसर मिलता है।",
    audio_duration_secs: 28,
    tags: ["Women in Tech", "Clean Energy", "Campus Placement"],
    is_female_pioneer: true,
    is_sample: true,
  },
  {
    id: "ALUMNI_DEMO_02",
    name: "Vikas Prajapati",
    name_hi: "विकास प्रजापति",
    age: 22,
    gender: "male",
    hometown_district: "Sadar, Meerut, Uttar Pradesh",
    trade_id: "AUTO_MECH_01",
    trade_name: "Automotive Mechatronics",
    trade_name_hi: "ऑटोमोटिव मेकाट्रॉनिक्स",
    graduating_iti: "Sample profile · Govt ITI Saket, Meerut",
    graduation_year: 2023,
    current_role: "EV Diagnostic Lead (illustrative)",
    current_role_hi: "EV डायग्नोस्टिक लीड (उदाहरण)",
    employer: "Sample employer reference · not verified",
    monthly_earnings: "₹26,000 / month (sample figure)",
    five_year_trajectory:
      "Illustrative next step: Diploma study followed by a junior plant-engineering role.",
    quote_en:
      "My family pictured roadside repair work. This sample story shows another possibility: using diagnostic tools in a structured service bay and continuing into further study.",
    quote_hi:
      "मेरे परिवार को सड़क किनारे मरम्मत का काम याद आता था। यह नमूना कहानी एक और संभावना दिखाती है—सर्विस बे में डायग्नोस्टिक उपकरणों का उपयोग और आगे की पढ़ाई।",
    audio_duration_secs: 32,
    tags: ["EV Specialist", "NCrF Pathway", "Technical Skills"],
    is_sample: true,
  },
  {
    id: "ALUMNI_DEMO_03",
    name: "Sunita Devi",
    name_hi: "सुनीता देवी",
    age: 23,
    gender: "female",
    hometown_district: "Modinagar, Ghaziabad, Uttar Pradesh",
    trade_id: "AUTO_MECH_01",
    trade_name: "Automotive Mechatronics",
    trade_name_hi: "ऑटोमोटिव मेकाट्रॉनिक्स",
    graduating_iti: "Sample profile · Govt ITI Ghaziabad",
    graduation_year: 2022,
    current_role: "Quality Inspector (illustrative)",
    current_role_hi: "गुणवत्ता निरीक्षक (उदाहरण)",
    employer: "Sample employer reference · not verified",
    monthly_earnings: "₹24,800 / month (sample figure)",
    five_year_trajectory: "Illustrative next step: Senior line supervisor and apprentice mentor.",
    quote_en:
      "People around my family had doubts about a woman choosing technical training. This sample story follows a learner who builds confidence, earns independently, and encourages her younger sister to explore ITI too.",
    quote_hi:
      "मेरे परिवार के आसपास के लोगों को महिला के तकनीकी प्रशिक्षण चुनने पर संदेह था। यह नमूना कहानी आत्मविश्वास, आर्थिक स्वतंत्रता और छोटी बहन को ITI देखने के लिए प्रेरित करने की है।",
    audio_duration_secs: 26,
    tags: ["Women in Tech", "Quality Control", "Independence"],
    is_female_pioneer: true,
    is_sample: true,
  },
  {
    id: "ALUMNI_DEMO_04",
    name: "Amit Chauhan",
    name_hi: "अमित चौहान",
    age: 24,
    gender: "male",
    hometown_district: "Baghpat–Meerut border, Uttar Pradesh",
    trade_id: "AUTO_MECH_01",
    trade_name: "Automotive Mechatronics & EV Retrofit",
    trade_name_hi: "ऑटोमोटिव मेकाट्रॉनिक्स एवं EV रेट्रोफिट",
    graduating_iti: "Sample profile · Govt ITI Saket, Meerut",
    graduation_year: 2021,
    current_role: "Workshop founder (illustrative)",
    current_role_hi: "वर्कशॉप संस्थापक (उदाहरण)",
    employer: "Self-employment example · not verified",
    monthly_earnings: "₹48,000 / month net (sample figure)",
    five_year_trajectory:
      "Illustrative next step: Grow a small workshop and mentor local trainees.",
    quote_en:
      "After gaining experience, I wanted to build a service business close to home. This sample story explores entrepreneurship as one possible path—not a promise of financing or income.",
    quote_hi:
      "अनुभव मिलने के बाद मैंने घर के पास सेवा व्यवसाय शुरू करने की कल्पना की। यह नमूना कहानी उद्यमिता को एक संभावित रास्ते के रूप में दिखाती है—वित्त या आय की गारंटी नहीं।",
    audio_duration_secs: 35,
    tags: ["Entrepreneurship", "Self-employment", "EV Service"],
    is_sample: true,
  },
];
