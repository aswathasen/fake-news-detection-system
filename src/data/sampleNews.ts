import { SampleNewsItem } from '../types';

export const SAMPLE_NEWS: SampleNewsItem[] = [
  {
    id: 'sample-1',
    title: 'NASA James Webb Telescope Confirms Distant Exoplanet Atmosphere Contains Water Vapor',
    category: 'Science & Astronomy',
    expectedVerdict: 'REAL',
    source: 'nasa.gov / Nature Astronomy',
    content: 'Astronomers using NASA’s James Webb Space Telescope have observed clear spectral signatures of water vapor in the atmosphere of WASP-96 b, a gas giant planet orbiting a sun-like star roughly 1,150 light-years away. The peer-reviewed findings, published this week in Nature Astronomy, were corroborated by independent measurements from the European Space Agency and corroborated with spectroscopic transit data.',
    hint: 'Contains neutral scientific phrasing, verifiable peer-reviewed citations, institutional sources, and absence of sensationalist clickbait.'
  },
  {
    id: 'sample-2',
    title: 'SECRET MIRACLE ROOT CURES ALL CANCERS IN 48 HOURS! DOCTORS ARE TERRIFIED!',
    category: 'Health & Medicine',
    expectedVerdict: 'FAKE',
    source: 'miracle-health-secrets-daily.xyz',
    content: 'BIG PHARMA DOES NOT WANT YOU TO SEE THIS! A secret jungle root discovered in an undisclosed rainforest destroys 100% of all malignant cancer cells in just 48 hours without any chemotherapy! Renowned whistleblowers claim world governments have banned it to protect pharmaceutical profits. Order our limited pure extract bottles today before this video is deleted from the internet forever!',
    hint: 'Heavy use of ALL-CAPS, emotional fearmongering, unsubstantiated medical claims, absence of clinical trials, and urgent commercial funnel.'
  },
  {
    id: 'sample-3',
    title: 'Global Coffee Beans to Go Completely Extinct by Next Month Following New Environmental Tariff',
    category: 'Environment & Economy',
    expectedVerdict: 'MISLEADING',
    source: 'viral-trending-buzz.net',
    content: 'Waking up to your morning cup of coffee will soon be illegal and impossible! Due to a newly introduced agricultural packaging regulation, international coffee shipments will shut down completely and coffee beans will disappear forever from every store shelf starting next month. Consumers are frantically hoarding remaining supplies across the nation.',
    hint: 'Takes a real event (new agricultural standard regulations on packaging) and exaggerates it into an apocalyptic, out-of-context absolute catastrophe.'
  },
  {
    id: 'sample-4',
    title: 'Federal Reserve Maintains Benchmark Interest Rate at 5.25%-5.50% Amid Inflation Data',
    category: 'Finance & Markets',
    expectedVerdict: 'REAL',
    source: 'reuters.com',
    content: 'The Federal Reserve announced on Wednesday that its Federal Open Market Committee decided unanimously to keep the federal funds target rate unchanged at 5.25% to 5.50%. Federal Reserve Chair Jerome Powell stated during the press conference that while inflation has eased over the past year, it remains somewhat elevated relative to the committee’s 2% target.',
    hint: 'Objective journalistic tone, directly attributed official statements, standard economic indicators, and verified credible news agency.'
  },
  {
    id: 'sample-5',
    title: 'Scientists Accidentally Create Zombie Virus in Basement Laboratory Underground',
    category: 'Conspiracy & Tabloid',
    expectedVerdict: 'FAKE',
    source: 'conspiracy-underground-wire.org',
    content: 'LEAKED FOOTAGE: Anonymous lab technicians admit that an unauthorized gene-editing experiment created a synthetic pathogen that reanimates deceased biological tissue. Military curfews are quietly being deployed in three major cities according to unverified insider memos circulating on dark web forums.',
    hint: 'Unverifiable anonymous sources, sensational narrative tropes, extreme implausibility, and zero verifiable public health records.'
  }
];
