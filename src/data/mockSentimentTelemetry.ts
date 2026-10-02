export interface InterventionAttribution {
  intervention_name: string;
  intervention_name_hi: string;
  share_percentage: number;
  description: string;
  description_hi: string;
}

export interface SentimentStageBreakdown {
  resistant_percent: number;
  skeptical_percent: number;
  receptive_percent: number;
}

export interface TradeSentimentCohort {
  trade_id: string;
  trade_name: string;
  sample_size: number;
  pre_session: SentimentStageBreakdown;
  post_session: SentimentStageBreakdown;
  net_positive_shift_percent: number;
  top_effective_interventions: InterventionAttribution[];
}

// Synthetic demo telemetry based on the values in the prototype brief. These are not
// measured household outcomes and should be replaced with consented, sourced data.
export const MOCK_SENTIMENT_COHORTS: Record<string, TradeSentimentCohort> = {
  ALL_TRADES: {
    trade_id: "ALL_TRADES",
    trade_name: "All priority vocational trades (illustrative aggregate)",
    sample_size: 4821,
    pre_session: { resistant_percent: 68.2, skeptical_percent: 23.6, receptive_percent: 8.2 },
    post_session: { resistant_percent: 13.8, skeptical_percent: 14.4, receptive_percent: 71.8 },
    net_positive_shift_percent: 63.6,
    top_effective_interventions: [
      {
        intervention_name: "NCrF mobility pathway",
        intervention_name_hi: "NCrF शैक्षणिक गतिशीलता मार्ग",
        share_percentage: 42,
        description:
          "Illustrative share attributed to explaining possible credit and further-study pathways.",
        description_hi:
          "क्रेडिट और आगे की पढ़ाई के संभावित रास्ते समझाने से जुड़ा उदाहरणात्मक हिस्सा।",
      },
      {
        intervention_name: "Wage & placement information",
        intervention_name_hi: "वेतन एवं प्लेसमेंट की जानकारी",
        share_percentage: 34,
        description: "Illustrative share attributed to discussing wage and placement information.",
        description_hi: "वेतन और प्लेसमेंट की जानकारी पर चर्चा से जुड़ा उदाहरणात्मक हिस्सा।",
      },
      {
        intervention_name: "Facility & transit information",
        intervention_name_hi: "केंद्र एवं परिवहन की जानकारी",
        share_percentage: 16,
        description: "Illustrative share attributed to addressing facility and travel concerns.",
        description_hi:
          "केंद्र और यात्रा संबंधी चिंताओं को संबोधित करने से जुड़ा उदाहरणात्मक हिस्सा।",
      },
      {
        intervention_name: "Alumni career stories",
        intervention_name_hi: "पूर्व-छात्र करियर कहानियाँ",
        share_percentage: 8,
        description: "Illustrative share attributed to peer-story examples.",
        description_hi: "साथियों की कहानियों के उदाहरणों से जुड़ा उदाहरणात्मक हिस्सा।",
      },
    ],
  },
  AUTO_MECH_01: {
    trade_id: "AUTO_MECH_01",
    trade_name: "Automotive Mechatronics (NSQF Level 4)",
    sample_size: 2640,
    pre_session: { resistant_percent: 74.5, skeptical_percent: 19.5, receptive_percent: 6 },
    post_session: { resistant_percent: 14.2, skeptical_percent: 12.8, receptive_percent: 73 },
    net_positive_shift_percent: 67,
    top_effective_interventions: [
      {
        intervention_name: "NCrF mobility pathway",
        intervention_name_hi: "NCrF शैक्षणिक गतिशीलता मार्ग",
        share_percentage: 46,
        description:
          "Illustrative share attributed to clarifying possible pathways from ITI training to further study.",
        description_hi:
          "ITI प्रशिक्षण से आगे की पढ़ाई के संभावित रास्ते स्पष्ट करने से जुड़ा उदाहरणात्मक हिस्सा।",
      },
      {
        intervention_name: "Wage & placement information",
        intervention_name_hi: "वेतन एवं प्लेसमेंट की जानकारी",
        share_percentage: 36,
        description:
          "Illustrative share attributed to discussing sample wage and placement figures.",
        description_hi: "नमूना वेतन और प्लेसमेंट आँकड़ों पर चर्चा से जुड़ा उदाहरणात्मक हिस्सा।",
      },
      {
        intervention_name: "Workshop environment information",
        intervention_name_hi: "वर्कशॉप वातावरण की जानकारी",
        share_percentage: 18,
        description: "Illustrative share attributed to explaining potential training environments.",
        description_hi: "संभावित प्रशिक्षण वातावरण समझाने से जुड़ा उदाहरणात्मक हिस्सा।",
      },
    ],
  },
  SOLAR_TECH_02: {
    trade_id: "SOLAR_TECH_02",
    trade_name: "Solar PV Rooftop Technician",
    sample_size: 2181,
    pre_session: { resistant_percent: 60.5, skeptical_percent: 28.5, receptive_percent: 11 },
    post_session: { resistant_percent: 13.2, skeptical_percent: 16.3, receptive_percent: 70.5 },
    net_positive_shift_percent: 59.5,
    top_effective_interventions: [
      {
        intervention_name: "Solar-sector pathway information",
        intervention_name_hi: "सोलर क्षेत्र के रास्तों की जानकारी",
        share_percentage: 44,
        description:
          "Illustrative share attributed to explaining sample sector and wage information.",
        description_hi: "नमूना क्षेत्र और वेतन जानकारी समझाने से जुड़ा उदाहरणात्मक हिस्सा।",
      },
      {
        intervention_name: "Safety & women-in-trades stories",
        intervention_name_hi: "सुरक्षा एवं तकनीकी क्षेत्र में महिलाओं की कहानियाँ",
        share_percentage: 32,
        description: "Illustrative share attributed to discussing safety and sample peer stories.",
        description_hi:
          "सुरक्षा और साथियों की नमूना कहानियों पर चर्चा से जुड़ा उदाहरणात्मक हिस्सा।",
      },
      {
        intervention_name: "Parent cost comparison",
        intervention_name_hi: "अभिभावक लागत तुलना",
        share_percentage: 24,
        description:
          "Illustrative share attributed to comparing training costs and possible pathways.",
        description_hi: "प्रशिक्षण लागत और संभावित रास्तों की तुलना से जुड़ा उदाहरणात्मक हिस्सा।",
      },
    ],
  },
};
