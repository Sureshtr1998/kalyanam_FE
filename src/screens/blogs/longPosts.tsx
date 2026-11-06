import type { BlogPost } from "./blogsContents";

// Long-form rewrites of the most-searched posts (the originals were ~150 words, which Google
// crawled but did not index). Merged into blogPosts by slug at the end of blogsContents.tsx.
// When a post here changes, also bump its `updatedAt` in blogsContents.tsx: scripts/routes.mjs
// reads the sitemap lastmod from that file.
// House rules: no invented success stories, member counts, testimonials or ratings.
export type LongPost = Pick<BlogPost, "readTime" | "answer" | "keyFacts" | "fullContent" | "sections"> &
  Partial<Pick<BlogPost, "title" | "summary" | "keywords">>;

export const LONG_POSTS: Record<string, LongPost> = {
  "understanding-kundali-matching-significance": {
    readTime: "8 min read",
    answer:
      "Kundli matching (Guna Milan) compares the Moon’s position in two birth charts across eight factors called the Ashtakoota, scored out of 36 points. Traditionally a score of 18 or more is considered acceptable, but a good astrologer also checks doshas such as Nadi, Bhakoot and Manglik before advising a family.",
    keyFacts: [
      "Ashtakoota has 8 kootas worth 1 to 8 points each, 36 in total.",
      "18 points is the traditional minimum; 25 or more is usually called very good.",
      "Nadi (8 points) and Bhakoot (7 points) carry the most weight.",
      "South Indian families often use the 10 Poruthams instead of 36 gunas.",
      "You need the exact date, time and place of birth for both people.",
    ],
    fullContent: [
      "For many Hindu families, matching horoscopes is one of the first steps after two profiles look promising. Done well, it is a structured conversation about temperament, health and family life. Done badly, it becomes a single number that rejects good alliances without anyone understanding why.",
      "This guide explains how Kundli matching actually works, what the score means, which doshas astrologers look for, and how to use the result sensibly alongside everything else you know about a prospective match.",
    ],
    sections: [
      {
        heading: "What is Kundli matching?",
        blocks: [
          "A Kundli (also called a Janam Kundli, Jathakam or birth chart) maps the positions of the planets at the moment a person was born. Kundli matching compares two charts to judge how well the couple are likely to get along. In North India it is usually called Guna Milan; in the South, Porutham or Thirumana Porutham.",
          "Most matching systems are based on the Moon: the Moon sign (Rashi) and the birth star (Nakshatra) of the bride and groom. Because the Moon moves quickly through the zodiac, an error of even an hour in the recorded birth time can change the Nakshatra and therefore the result.",
        ],
      },
      {
        heading: "The eight kootas and what each one checks",
        blocks: [
          "The Ashtakoota system scores eight aspects of compatibility. Each koota carries more points than the one before it, which reflects how much weight tradition gives it:",
          {
            list: [
              <><strong>Varna (1 point):</strong> spiritual and work temperament, and how the two egos sit together.</>,
              <><strong>Vashya (2 points):</strong> mutual attraction and how much influence each partner has on the other.</>,
              <><strong>Tara (3 points):</strong> compatibility of the birth stars, linked to health and general fortune.</>,
              <><strong>Yoni (4 points):</strong> physical and intimate compatibility.</>,
              <><strong>Graha Maitri (5 points):</strong> friendship between the lords of the two Moon signs, read as mental compatibility.</>,
              <><strong>Gana (6 points):</strong> basic nature, grouped as Deva, Manushya or Rakshasa.</>,
              <><strong>Bhakoot (7 points):</strong> the relationship between the two Moon signs, linked to family welfare and finances.</>,
              <><strong>Nadi (8 points):</strong> health and progeny; the most heavily weighted koota.</>,
            ],
          },
        ],
      },
      {
        heading: "How to read the score out of 36",
        blocks: [
          "Families commonly use these bands, though individual astrologers may draw the lines slightly differently:",
          {
            list: [
              "Below 18 points: traditionally not recommended without a detailed reading.",
              "18 to 24 points: acceptable; many happy marriages fall here.",
              "25 to 32 points: very good compatibility.",
              "33 to 36 points: excellent, though rare.",
            ],
          },
          "The total is only a starting point. A 26-point match with an uncancelled Nadi dosha may worry an astrologer more than a 20-point match with no doshas at all, which is why the breakdown matters more than the headline number.",
        ],
      },
      {
        heading: "Doshas astrologers check beyond the points",
        blocks: [
          {
            list: [
              <><strong>Nadi dosha:</strong> when both people share the same Nadi, the koota scores zero. Tradition links it to health and children, so families take it seriously.</>,
              <><strong>Bhakoot dosha:</strong> certain Moon sign combinations (such as 6–8 or 2–12 positions from each other) score zero on Bhakoot.</>,
              <><strong>Manglik (Kuja) dosha:</strong> Mars in particular houses of the chart. It is commonly considered balanced when both partners are Manglik.</>,
            ],
          },
          "Most classical texts also describe cancellations (parihara), where other factors in the charts neutralise a dosha. Whether a dosha is cancelled is exactly the kind of judgement a qualified astrologer should make, not an online calculator.",
        ],
      },
      {
        heading: "The South Indian way: 10 Poruthams",
        blocks: [
          "Many Tamil, Telugu, Kannada and Malayali families use a system of ten checks instead of 36 gunas: Dinam, Ganam, Mahendram, Stree Deergham, Yoni, Rasi, Rasi Adhipathi, Vasya, Rajju and Vedhai. Rajju and Vedhai are usually treated as essential, and astrologers look for a minimum number of matching poruthams rather than a points total.",
          "If the two families follow different systems, agree up front which one you will use, so nobody is surprised later.",
        ],
      },
      {
        heading: "What you need before matching",
        blocks: [
          {
            list: [
              "Exact date of birth for both people.",
              "Time of birth, as precisely as possible (a hospital record is better than memory).",
              "Place of birth (town or city), which sets the time zone and coordinates.",
            ],
          },
          "If a birth time is uncertain, say so. An astrologer can then tell you whether the result could change, instead of the family relying on a guess.",
        ],
      },
      {
        heading: "Using the result wisely",
        blocks: [
          "Kundli matching is a respected tradition, and it is also one input among many. Shared values, education, family expectations, health and simply how the two people get on when they talk are just as important. Many families treat a borderline score as a reason to ask more questions rather than to say no straight away.",
          "A practical approach: shortlist on values and preferences first, match horoscopes for the profiles you are serious about, and ask an astrologer to explain any dosha in plain words before you decide.",
        ],
      },
      {
        heading: "Kundli matching on Seetha Rama Kalyana",
        blocks: [
          "Members can request Kundli matching by our astrologer for a profile they are interested in, with the result explained rather than just scored. Birth details stay private to your account, and phone numbers are shared only after both families agree to take a match forward.",
        ],
      },
    ],
  },

  "understanding-gothras-brahmin-matrimony": {
    readTime: "7 min read",
    answer:
      "A gotra is a lineage traced through the father’s line to an ancient rishi. Most Hindu families, especially Brahmin families, avoid marriage within the same gotra (sagotra) because it is treated as marrying within one extended family. Indian law does not prohibit sagotra marriage; the Hindu Marriage Act only bars close sapinda relationships.",
    keyFacts: [
      "Gotra is inherited through the paternal line.",
      "Brahmin gotras trace back to rishis such as Kashyapa, Bharadwaja, Vasishtha, Gautama, Atri, Vishwamitra and Jamadagni.",
      "Many families also avoid the mother’s gotra, and some check pravara as well.",
      "The Hindu Marriage Act, 1955 bars sapinda marriages (3 generations on the mother’s side, 5 on the father’s), not sagotra ones.",
      "Traditionally a bride takes her husband’s gotra after marriage.",
    ],
    fullContent: [
      "“What is your gotra?” is often one of the first questions an elder asks about a proposal. For younger family members it can feel like an old formality, but the rule behind it is simple and is still followed by most Hindu families today.",
      "This guide explains what a gotra is, why same-gotra marriages are avoided, what the law actually says, and how to mention your gotra on a matrimony profile.",
    ],
    sections: [
      {
        heading: "What is a gotra?",
        blocks: [
          "A gotra is a clan or lineage traced through the father’s line to a common ancestor, traditionally one of the ancient rishis (sages). Everyone born into that line shares the gotra, in the way that a surname is shared, except that a gotra is much older and much wider.",
          "Brahmin gotras are commonly traced to the Saptarishis and a few other sages: Kashyapa, Bharadwaja, Vasishtha, Gautama, Atri, Vishwamitra, Jamadagni and Agastya among them. Many other communities also keep gotras or similar clan names, such as the kula or bedagu names in some Kannada families and house names in some Telugu families.",
        ],
      },
      {
        heading: "Why same-gotra (sagotra) marriages are avoided",
        blocks: [
          "Because a gotra represents descent from one ancestor, two people of the same gotra are traditionally considered brother and sister in a very extended sense. Marrying within the gotra is therefore treated like marrying within the family, and dharmashastra texts advise against it.",
          "Families often describe a practical side as well: avoiding marriage within one lineage widens the family tree and reduces the chance of close relatives marrying without realising it.",
        ],
      },
      {
        heading: "Pravara and the mother’s gotra",
        blocks: [
          "Some families go one step further and check pravara, the list of rishis invoked in a family’s lineage. Two different gotras that share a rishi in their pravara may also be avoided.",
          "Many communities additionally avoid the mother’s gotra (her father’s line), and some avoid the grandmothers’ gotras too. Practice varies a lot between regions and families, so it is worth asking each family what they follow.",
        ],
      },
      {
        heading: "What Indian law says",
        blocks: [
          "Gotra rules are a matter of custom and personal choice, not law. The Hindu Marriage Disabilities Removal Act, 1946 confirmed that sagotra marriages are valid, and the Hindu Marriage Act, 1955 does not list gotra as a bar.",
          "What the Act does prohibit is marriage between sapindas (unless a custom allows it): broadly, people who share an ancestor within three generations on the mother’s side or five generations on the father’s side, along with other close degrees of relationship it lists.",
        ],
      },
      {
        heading: "Does the bride’s gotra change after marriage?",
        blocks: [
          "Traditionally, yes. During the wedding the bride is formally received into her husband’s family and, from then on, rituals are performed in his gotra. Her birth gotra still matters for her children’s marriages in families that avoid the mother’s gotra.",
        ],
      },
      {
        heading: "Mentioning gotra on your matrimony profile",
        blocks: [
          {
            list: [
              "State your gotra clearly; it saves families an early question and avoids disappointment later.",
              "If your family also avoids the mother’s gotra, mention that in your preferences.",
              "If your family is flexible about gotra, say so: it can widen your matches.",
              "If you are unsure of your gotra, ask an elder or your family priest before you publish the profile.",
            ],
          },
        ],
      },
      {
        heading: "Gotra on Seetha Rama Kalyana",
        blocks: [
          "Profiles include gotra alongside community and sub-community, so families can see it before they show interest. Whether you follow the rule strictly or not at all is your decision; the profile simply makes the information clear.",
        ],
      },
    ],
  },

  "meaning-of-saptapadi-seven-vows": {
    readTime: "7 min read",
    answer:
      "Saptapadi means “seven steps”. In a Hindu wedding the couple take seven steps together, usually before the sacred fire, with a vow or blessing for each: nourishment, strength, prosperity, happiness, children, long life through the seasons, and lifelong friendship. Under the Hindu Marriage Act, where Saptapadi is part of the rites, the marriage becomes complete when the seventh step is taken.",
    keyFacts: [
      "Saptapadi is Sanskrit for “seven steps”.",
      "The seventh step is the vow of friendship: “sakha saptapadi bhava”.",
      "Section 7 of the Hindu Marriage Act, 1955 treats the marriage as complete and binding on the seventh step, where Saptapadi is part of the ceremony.",
      "In North India the seven rounds of the fire (pheras) carry the same meaning.",
      "South Indian weddings often pair Saptapadi with Ammi Midhithal (stepping on the grinding stone) and Arundhati darshan.",
    ],
    fullContent: [
      "Of all the rituals in a Hindu wedding, Saptapadi is the one many families consider the heart of the ceremony. The garlands, the music and the feast surround it, but it is the seven steps that turn two people into a married couple.",
      "Here is what each step means, how the ritual differs across India, and why it still matters to couples today.",
    ],
    sections: [
      {
        heading: "What Saptapadi means",
        blocks: [
          "Saptapadi comes from the Sanskrit sapta (seven) and padi (steps). The groom leads the bride, or the two walk together, for seven steps, usually near or around the sacred fire (Agni), which is the witness to the marriage. With each step the priest recites a Vedic mantra and the couple make a promise to each other.",
          "The ritual is described in the Grihya Sutras, the ancient household manuals, and the mantras used today come from that tradition.",
        ],
      },
      {
        heading: "The seven vows, step by step",
        blocks: [
          "The exact words vary between traditions, but the classical mantras follow this pattern:",
          {
            list: [
              <><strong>First step, nourishment:</strong> that the household may never lack food and that the couple will provide for each other.</>,
              <><strong>Second step, strength:</strong> physical, mental and spiritual strength to face life together.</>,
              <><strong>Third step, prosperity:</strong> earning and using wealth righteously.</>,
              <><strong>Fourth step, happiness:</strong> love, comfort and harmony between the couple and their families.</>,
              <><strong>Fifth step, children:</strong> the blessing of children and the duty to raise them well.</>,
              <><strong>Sixth step, the seasons:</strong> a long life together through every season and stage of life.</>,
              <><strong>Seventh step, friendship:</strong> “sakha saptapadi bhava”, become my friend with these seven steps. The marriage is sealed as a lifelong companionship.</>,
            ],
          },
        ],
      },
      {
        heading: "Why the seventh step matters, including in law",
        blocks: [
          "Tradition treats the seventh step as the moment the marriage is complete. Indian law reflects this: Section 7 of the Hindu Marriage Act, 1955 says that where the ceremonies include Saptapadi, the marriage becomes complete and binding when the seventh step is taken.",
          "This is why many priests pause before the final step and why families gather closest at that moment.",
        ],
      },
      {
        heading: "How Saptapadi differs across India",
        blocks: [
          {
            list: [
              <><strong>North India:</strong> the couple circle the fire seven times (the pheras), often with the bride’s and groom’s garments tied together. Which partner leads which rounds varies by family custom.</>,
              <><strong>Tamil Nadu:</strong> the groom holds the bride’s right toe as she takes each step, followed by Ammi Midhithal, where she places her foot on a grinding stone as a sign of steadfastness, and the groom puts toe rings (metti) on her feet.</>,
              <><strong>Karnataka and Andhra Pradesh / Telangana:</strong> the seven steps are taken near the fire, often followed by Arundhati darshan, when the couple are shown the stars Arundhati and Vasishtha as a symbol of devotion.</>,
              <><strong>Gujarat and Maharashtra:</strong> the bride may step on small heaps of rice or betel nuts arranged in a line for each of the seven steps.</>,
            ],
          },
        ],
      },
      {
        heading: "What Saptapadi means for couples today",
        blocks: [
          "Read closely, the seven vows describe a partnership of equals: providing for each other, sharing strength and prosperity, raising a family, and above all being friends. That is why many modern couples ask their priest to explain each mantra in their own language during the ceremony.",
          "A simple idea some couples use: write down, in your own words, what each of the seven promises means to you, and keep it with your wedding album.",
        ],
      },
      {
        heading: "From the first conversation to the seventh step",
        blocks: [
          "Seetha Rama Kalyana takes its name from the divine wedding of Sita and Rama, whose marriage is still the example many families hold up. The platform is built for that first stage: finding a family whose values match yours, with verified profiles and phone numbers shared only after both families agree.",
        ],
      },
    ],
  },

  "online-matrimony-safety-guide": {
    readTime: "8 min read",
    answer:
      "To stay safe on matrimony sites, verify a match by video call and in person with family before trusting them, never send money or share OTPs, bank details or ID documents, and treat urgency, sob stories and requests to move off the platform as red flags. Report fraud on the National Cyber Crime portal (cybercrime.gov.in) or by calling 1930.",
    keyFacts: [
      "Never send money to someone you have not met, whatever the reason given.",
      "Never share OTPs, UPI PINs, bank details or Aadhaar/PAN copies.",
      "Insist on a video call early and meet in a public place with family.",
      "Reverse-search profile photos (for example with Google Lens).",
      "Report cyber fraud at cybercrime.gov.in or call the national helpline 1930.",
    ],
    fullContent: [
      "Most people on matrimony sites are genuine families looking for a match. A small number are not, and their methods follow recognisable patterns. Knowing those patterns is the best protection for you and for your son or daughter.",
      "This guide lists the warning signs, the checks worth doing before you trust a match, and exactly what to do if something feels wrong.",
    ],
    sections: [
      {
        heading: "Red flags to watch for",
        blocks: [
          {
            list: [
              <><strong>Any request for money.</strong> Medical emergencies, customs fees for a “gift parcel”, visa charges, a business opportunity or a stuck foreign transfer: the story changes, the request does not.</>,
              <><strong>Refusing to video call.</strong> Excuses about a broken camera, poor network or a strict job, repeated over weeks.</>,
              <><strong>Moving too fast.</strong> Talk of love or marriage within days, pressure to decide quickly, or asking you to keep the relationship secret from family.</>,
              <><strong>Leaving the platform immediately.</strong> Insisting on moving to WhatsApp or Telegram before any trust is built.</>,
              <><strong>Too-good-to-be-true profiles.</strong> Model-style photos, very high income, overseas posting, and few verifiable details.</>,
              <><strong>Inconsistent details.</strong> Job, city, age or family details that change between conversations.</>,
            ],
          },
        ],
      },
      {
        heading: "Checks to do before you trust a match",
        blocks: [
          {
            list: [
              "Reverse-search the profile photos with Google Lens or a similar tool. Stolen photos often show up elsewhere under other names.",
              "Have a video call within the first few conversations, and ideally a call that includes family members.",
              "Verify the workplace: a LinkedIn profile with history, a company email, or a mutual contact.",
              "Speak to the parents or elders on both sides, not only the prospective bride or groom.",
              "Meet for the first time in a public place, with family, and tell someone where you are going.",
              "Take your time. A genuine family will understand if you want to verify things before going further.",
            ],
          },
        ],
      },
      {
        heading: "What you should never share",
        blocks: [
          {
            list: [
              "OTPs of any kind, UPI PINs, card numbers, CVVs or net-banking passwords.",
              "Copies of Aadhaar, PAN or passport before you have met and verified the family.",
              "Private photos or videos.",
              "Your home address and daily routine, until you know the family well.",
            ],
          },
        ],
      },
      {
        heading: "Extra care for NRI proposals",
        blocks: [
          "Overseas alliances are common and most are genuine, but they are also the most frequent setting for fraud. Ask for the city and employer abroad, check them independently, speak to relatives in India, and be very wary of any proposal that rushes towards marriage before the families have met in person.",
        ],
      },
      {
        heading: "If something goes wrong",
        blocks: [
          {
            list: [
              "Stop all payments and conversation immediately; do not try to recover money by sending more.",
              "Keep evidence: screenshots of chats, profile pages, payment receipts and phone numbers.",
              "Report it on the National Cyber Crime Reporting Portal, cybercrime.gov.in, or call the national helpline 1930 as soon as possible. Quick reporting gives the best chance of freezing transferred money.",
              "Inform your bank to block cards or UPI if you shared any details.",
              "Report the profile to the matrimony platform so it can be removed.",
            ],
          },
        ],
      },
      {
        heading: "How Seetha Rama Kalyana protects members",
        blocks: [
          "Members sign up with OTP-verified phone numbers, and phone numbers are shared only after both families agree to take a match forward, so strangers cannot simply collect contact details. There are no agents and no sales calls, and we will never ask you for an OTP or PIN. If a profile looks suspicious, write to our support team and we will look into it.",
        ],
      },
    ],
  },

  "questions-to-ask-matrimony-match": {
    readTime: "7 min read",
    answer:
      "Before saying yes to a match, discuss values and family expectations, careers and money, where you will live, children, daily lifestyle and how you handle disagreements. Ask open questions, listen as much as you talk, and involve both families once the basics feel right.",
    keyFacts: [
      "Talk about where you will live and whether either of you will relocate.",
      "Discuss money openly: income, savings, loans and how expenses will be shared.",
      "Ask how each family sees the roles of the couple and the in-laws.",
      "Children, careers after marriage and religious practice are common deal-breakers; raise them early.",
      "Have more than one conversation before deciding.",
    ],
    fullContent: [
      "In an arranged or semi-arranged match you may only have a few conversations before the families decide whether to go ahead. Those conversations count. Polite small talk about hobbies is pleasant, but it rarely tells you whether you can build a life together.",
      "Here are the questions worth asking, grouped by topic, along with tips on how to ask them without the meeting feeling like an interview.",
    ],
    sections: [
      {
        heading: "Values and family",
        blocks: [
          {
            list: [
              "What does a good marriage look like to you? Whose marriage do you admire, and why?",
              "How close are you to your family, and how involved will they be in our day-to-day life?",
              "Do you see us living with your parents, near them, or independently?",
              "Which festivals, rituals and traditions matter most to you?",
            ],
          },
        ],
      },
      {
        heading: "Career and money",
        blocks: [
          {
            list: [
              "Where do you see your career in five years? Are you open to your spouse working, studying or changing careers?",
              "Do you have loans or financial commitments I should know about, such as an education loan or supporting family?",
              "How would we manage money: a joint account, separate accounts, or a mix?",
              "What is your approach to saving, spending and big purchases like a home?",
            ],
          },
        ],
      },
      {
        heading: "Where you will live",
        blocks: [
          {
            list: [
              "Which city do you plan to live in long term? Would you relocate for the right job, or for your spouse’s career?",
              "If either of us works abroad, what are the plans and the timeline?",
            ],
          },
        ],
      },
      {
        heading: "Children and the future",
        blocks: [
          {
            list: [
              "Do you want children, and roughly when?",
              "How would we share responsibilities for raising them?",
              "What kind of education and values would you want for them?",
            ],
          },
        ],
      },
      {
        heading: "Daily life and personality",
        blocks: [
          {
            list: [
              "What does a typical weekday and weekend look like for you?",
              "Food habits: vegetarian, eggetarian or non-vegetarian, and how strict?",
              "How do you usually handle disagreements or stress?",
              "What do your friends say is your best quality, and your most annoying one?",
            ],
          },
        ],
      },
      {
        heading: "Sensitive topics, asked respectfully",
        blocks: [
          "Some subjects feel awkward but matter: health conditions that affect daily life, past engagements or marriages, and expectations around dowry (which is illegal in India under the Dowry Prohibition Act). Raise them calmly and privately, and share your own answers too. Honesty early prevents painful surprises later.",
        ],
      },
      {
        heading: "Tips for the first conversations",
        blocks: [
          {
            list: [
              "Meet in a comfortable public place, or start with a video call.",
              "Ask open questions (“How do you see…?”) rather than yes/no ones.",
              "Share your own answers; it should feel like a conversation, not an interview.",
              "Do not try to cover everything at once. Two or three meetings are normal.",
              "Afterwards, discuss with your family what you learned, not only how the person seemed.",
            ],
          },
        ],
      },
      {
        heading: "Finding matches worth talking to",
        blocks: [
          "Seetha Rama Kalyana shows you profiles whose preferences include you as well as the other way round, so the first conversation starts with more in common. Contact details are shared only after both families agree.",
        ],
      },
    ],
  },

  "create-perfect-matrimony-profile": {
    readTime: "8 min read",
    answer:
      "A strong matrimony profile has clear recent photos, an honest “about me” written in your own words, complete education, work and family details, and realistic partner preferences. Specific details (what you do on a Sunday, what you value in a family) attract better matches than generic lines like “simple and down to earth”.",
    keyFacts: [
      "Use 3–5 recent photos: one clear face photo, one full-length, one natural or family photo.",
      "Write 100–200 words about yourself in your own voice, with specifics.",
      "Fill in every field: profiles with gaps get fewer interests.",
      "Keep partner preferences realistic; very narrow filters hide good matches.",
      "If a parent creates the profile, say so, and write the bio in the candidate’s words.",
    ],
    fullContent: [
      "A matrimony profile does in a few seconds what an introduction from a relative used to do over a cup of tea. Families scroll through many profiles, and the ones that are clear, complete and genuine are the ones that get a second look.",
      "Whether you are creating a profile for yourself or for your son or daughter, this guide walks through each part and the mistakes to avoid.",
    ],
    sections: [
      {
        heading: "Photos: the first thing everyone looks at",
        blocks: [
          {
            list: [
              "Use recent photos, taken within the last year.",
              "Start with a clear, well-lit face photo, looking at the camera, with no sunglasses or heavy filters.",
              "Add a full-length photo and one natural photo: at a family function, travelling, or doing something you enjoy.",
              "Avoid group photos where it is unclear which person is you.",
              "Three to five good photos are better than fifteen similar ones.",
            ],
          },
        ],
      },
      {
        heading: "Writing the “about me” section",
        blocks: [
          "This is where most profiles fall flat. “I am simple, honest and family-oriented” describes almost everyone. Specific details tell a family who you actually are:",
          {
            list: [
              "What you do for work, and what you enjoy about it.",
              "How you spend a typical weekend.",
              "What matters most to you in family life.",
              "One or two genuine interests: a sport, music, cooking, temple visits, trekking.",
              "What you are looking for, in a sentence or two.",
            ],
          },
          "An example: “I work as a software engineer in Bengaluru and enjoy solving problems at work and cooking for friends at the weekend. I am close to my parents and visit our hometown in Mysuru every month. I am looking for someone kind and curious who values family and wants to keep growing in their career.”",
        ],
      },
      {
        heading: "Education and profession",
        blocks: [
          "Give your highest qualification, institution, current role and employer type, and the city you work in. Income ranges are useful to many families; be accurate rather than generous. If you plan a career change, higher studies or a move abroad, mention it: it saves both sides time.",
        ],
      },
      {
        heading: "Family details",
        blocks: [
          "Families want to understand the family as well as the individual. Include parents’ occupations, siblings and their status, family type (joint or nuclear), native place, community, sub-community and gotra where relevant, and the family’s values or traditions in a line or two.",
        ],
      },
      {
        heading: "Horoscope details",
        blocks: [
          "If your family follows Kundli matching, add the date, exact time and place of birth, along with Rashi and Nakshatra if you know them. It lets interested families match horoscopes early instead of waiting for the details.",
        ],
      },
      {
        heading: "Partner preferences",
        blocks: [
          "Preferences decide who sees you and whom you see. Be clear about what truly matters (community, language, location, diet) and flexible about the rest. An age range of a few years and a height range rather than an exact number will show you noticeably more suitable matches.",
        ],
      },
      {
        heading: "When parents create the profile",
        blocks: [
          "Many profiles are created by parents, which is completely normal. Say so on the profile, keep the candidate involved, and write the “about me” section in their words or with their approval. Matches respond better when they can hear the person’s own voice.",
        ],
      },
      {
        heading: "Common mistakes to avoid",
        blocks: [
          {
            list: [
              "Old or heavily edited photos that do not match how you look today.",
              "Copy-pasted bios that could belong to anyone.",
              "Leaving key fields empty, such as income, family details or location.",
              "Long lists of demands in the preferences section.",
              "Sharing your phone number or address in the bio.",
            ],
          },
        ],
      },
      {
        heading: "Create your profile on Seetha Rama Kalyana",
        blocks: [
          "Setting up a profile takes about three minutes, in English, Kannada, Telugu, Tamil or Hindi. Your phone number stays private and is shared only after both families agree to take a match forward.",
        ],
      },
    ],
  },

  "kannada-matrimony-traditions-modern-world": {
    readTime: "8 min read",
    answer:
      "A traditional Kannada wedding includes rituals such as Naandi, Kashi Yatre, Var Pooje, Dhaare Herdu (Kanyadaana), Mangalya Dharane and Saptapadi, followed by Arundhati darshan and Griha Pravesha. Customs differ between Brahmin, Vokkaliga, Lingayat and other communities, and between coastal and north Karnataka, so families usually agree the ceremonies in advance.",
    keyFacts: [
      "Kashi Yatre: the groom playfully sets out for Kashi and is persuaded to marry instead.",
      "Dhaare Herdu: the bride’s parents give her hand, with water poured over joined hands.",
      "Mangalya Dharane: the groom ties the mangalasutra at the muhurta.",
      "Lingayat weddings are conducted in the Veerashaiva tradition, typically led by a Jangama.",
      "Many Kannada families today look for matches across Bengaluru, other Indian cities and abroad.",
    ],
    fullContent: [
      "Kannada weddings are known for their warmth and simplicity: banana leaves, jasmine, nadaswaram music and a muhurta that the whole family gathers for. Beneath the celebration is a sequence of rituals that has been followed for generations.",
      "This guide walks through the main ceremonies, how they vary across communities, and how Kannada families are finding matches today.",
    ],
    sections: [
      {
        heading: "Before the wedding",
        blocks: [
          {
            list: [
              <><strong>Nischitartha (engagement):</strong> the families formally agree the alliance, exchange gifts and fix the wedding date, often after horoscope matching.</>,
              <><strong>Naandi:</strong> a puja held in both homes a day or two before the wedding, asking for the blessings of ancestors and for the ceremonies to go smoothly.</>,
              <><strong>Arishina Shastra (haldi):</strong> turmeric is applied to the bride and groom in their homes.</>,
            ],
          },
        ],
      },
      {
        heading: "The main wedding rituals",
        blocks: [
          {
            list: [
              <><strong>Kashi Yatre:</strong> the groom, with umbrella, walking stick and slippers, announces he is leaving for Kashi to lead a life of study. The bride’s brother stops him and persuades him to marry his sister instead.</>,
              <><strong>Var Pooje:</strong> the bride’s family welcomes the groom at the venue and worships him as an honoured guest.</>,
              <><strong>Mangalashtaka and Jeerige-Bella:</strong> as a cloth screen is lowered, the couple see each other and place a paste of cumin and jaggery on each other’s heads.</>,
              <><strong>Dhaare Herdu (Kanyadaana):</strong> the bride’s parents give her hand to the groom; water is poured over their joined hands, symbolising the gift.</>,
              <><strong>Mangalya Dharane:</strong> at the muhurta, the groom ties the mangalasutra around the bride’s neck as guests shower akshate (coloured rice).</>,
              <><strong>Saptapadi:</strong> the couple take seven steps together near the sacred fire, each with a vow.</>,
              <><strong>Arundhati darshan:</strong> the couple are shown the stars Arundhati and Vasishtha as a symbol of devotion.</>,
            ],
          },
        ],
      },
      {
        heading: "After the wedding",
        blocks: [
          "Games such as Okhli (finding a ring in a pot of coloured water) lighten the mood. The bride then enters her new home in Griha Pravesha, often kicking a measure of rice at the threshold, and is sometimes given a new name by her husband’s family.",
        ],
      },
      {
        heading: "How customs differ across communities",
        blocks: [
          {
            list: [
              <><strong>Brahmin families (Smartha, Madhwa and others):</strong> follow the Vedic sequence closely, with gotra and Kundli matching central to the alliance.</>,
              <><strong>Vokkaliga families:</strong> include many of the same rituals, often with distinct family and regional customs from Old Mysore districts.</>,
              <><strong>Lingayat (Veerashaiva) families:</strong> weddings follow Veerashaiva traditions and are typically conducted by a Jangama, with the teachings of Basavanna at the centre.</>,
              <><strong>Coastal Karnataka and north Karnataka:</strong> have their own customs, food and attire, and Tulu- and Konkani-speaking families add their own traditions.</>,
            ],
          },
          "Because practice varies so much, it is worth agreeing between the two families which rituals will be followed, especially in inter-community matches.",
        ],
      },
      {
        heading: "Kannada matchmaking in the modern world",
        blocks: [
          "Many Kannada families today have children working in Bengaluru, Pune, Hyderabad or abroad. The search has moved online, but the priorities are familiar: community and sub-community, gotra, language at home, Kundli matching and, above all, a family that shares the same values.",
          "Mother tongue still matters to many families, because it shapes festivals, food and how comfortable both sets of parents feel together. At the same time, more families now accept matches across sub-communities and cities.",
        ],
      },
      {
        heading: "Seetha Rama Kalyana for Kannada families",
        blocks: [
          "Seetha Rama Kalyana is available fully in Kannada as well as English, with Kannada-speaking families from across Karnataka, other Indian cities and abroad. Profiles show community, sub-community and gotra, and phone numbers are shared only after both families agree.",
        ],
      },
    ],
  },

  "telugu-brahmin-matrimony-traditions": {
    readTime: "8 min read",
    answer:
      "Telugu Brahmin weddings follow a Vedic sequence that includes Snathakam, Kashi Yatra, Gauri Puja, Kanyadanam, Jeelakarra-Bellam at the muhurtham, Mangalya Dharana with three knots, Talambralu, Saptapadi and Arundhati darshanam. Matchmaking places weight on gotra, Kundli matching and the families’ traditions, Vaidiki or Niyogi among them.",
    keyFacts: [
      "Jeelakarra-Bellam (cumin and jaggery paste) is placed on each other’s heads at the muhurtham.",
      "The mangalsutra is tied with three knots in Mangalya Dharana.",
      "Talambralu: the couple shower each other with rice mixed with turmeric.",
      "Snathakam is the groom’s ceremony marking the end of student life.",
      "Appagintalu is the emotional farewell where the bride is entrusted to the groom’s family.",
    ],
    fullContent: [
      "Telugu Brahmin weddings are rich in Vedic ritual and full of moments families remember for decades, from the cumin-and-jaggery muhurtham to the joyful rice shower of Talambralu.",
      "Here is the sequence most families follow, what each ritual means, and what matters most to Telugu Brahmin families when they look for an alliance.",
    ],
    sections: [
      {
        heading: "Before the wedding",
        blocks: [
          {
            list: [
              <><strong>Nischitartham (engagement):</strong> the families formally agree the match, usually after Kundli matching, and fix the muhurtham.</>,
              <><strong>Pellikuthuru and Pellikoduku:</strong> the bride and groom are prepared for marriage with turmeric, oil baths (Mangala Snanam) and new clothes in their homes.</>,
              <><strong>Snathakam:</strong> the groom’s ceremony marking the completion of his student life (brahmacharya), often including the sacred thread.</>,
            ],
          },
        ],
      },
      {
        heading: "The wedding ceremonies",
        blocks: [
          {
            list: [
              <><strong>Kashi Yatra:</strong> the groom sets off for Kashi to pursue spiritual life, until the bride’s brother persuades him to marry instead.</>,
              <><strong>Edurukolu:</strong> the two families formally receive each other at the venue.</>,
              <><strong>Gauri Puja:</strong> the bride worships Goddess Gauri for a long and happy married life.</>,
              <><strong>Kanyadanam:</strong> the bride’s parents give her hand to the groom.</>,
              <><strong>Jeelakarra-Bellam:</strong> at the exact muhurtham, a curtain between the couple is lowered and they place a paste of cumin and jaggery on each other’s heads, symbolising an inseparable bond through bitter and sweet times.</>,
              <><strong>Madhuparkam:</strong> the couple change into wedding clothes, traditionally a white saree with a red border for the bride.</>,
              <><strong>Mangalya Dharana:</strong> the groom ties the mangalsutra with three knots.</>,
              <><strong>Talambralu:</strong> the couple pour rice mixed with turmeric over each other’s heads, a playful and auspicious moment.</>,
              <><strong>Saptapadi and Arundhati darshanam:</strong> seven steps with seven vows, and the couple are shown the stars Arundhati and Vasishtha.</>,
            ],
          },
        ],
      },
      {
        heading: "After the wedding",
        blocks: [
          "In Appagintalu the bride’s parents formally entrust their daughter to the groom’s family. It is often the most emotional moment of the wedding. Grihapravesam, the bride’s entry into her new home, follows.",
        ],
      },
      {
        heading: "What Telugu Brahmin families look for in an alliance",
        blocks: [
          {
            list: [
              "Gotra, with sagotra matches usually avoided.",
              "Kundli matching, often using the Porutham system alongside guna points.",
              "Tradition: Vaidiki and Niyogi families, and Smartha, Vaishnava and Madhwa practice, may have different customs.",
              "Education and career, often including opportunities in Hyderabad, Bengaluru, Chennai or abroad.",
              "Shared values around festivals, food and family life.",
            ],
          },
        ],
      },
      {
        heading: "Seetha Rama Kalyana for Telugu families",
        blocks: [
          "The site is available in Telugu as well as English, for Telugu-speaking families in Andhra Pradesh, Telangana, other Indian cities and abroad. Profiles include community, sub-community and gotra, Kundli matching by our astrologer is available, and phone numbers are shared only after both families agree.",
        ],
      },
    ],
  },

  "tamil-matrimony-iyer-iyengar-weddings": {
    readTime: "8 min read",
    answer:
      "Tamil Brahmin weddings include Vratham, Nichayathartham, Kashi Yatrai, Maalai Maatral, Oonjal, Kanyadanam, Mangalya Dharanam, Saptapadi and Ammi Midhithal. Iyer families follow Smartha traditions, while Iyengar families follow Sri Vaishnava traditions, for example singing Andal’s Vaaranam Aayiram, and the two drape the nine-yard madisar differently.",
    keyFacts: [
      "Iyers are Smartha; Iyengars are Sri Vaishnava (Vadakalai or Thenkalai).",
      "Maalai Maatral: the couple exchange garlands three times.",
      "Oonjal: the couple sit on a swing while women sing and circle them with coloured rice balls.",
      "Ammi Midhithal: the bride places her foot on a grinding stone and the groom puts metti (toe rings) on her.",
      "Andal’s Vaaranam Aayiram is traditionally sung at Iyengar weddings.",
    ],
    fullContent: [
      "Tamil Brahmin weddings are among the most elaborate in South India, often spread across two days, with nadaswaram music, the bride in a nine-yard madisar and rituals that each carry a story.",
      "This guide explains the main ceremonies, the differences between Iyer and Iyengar weddings, and what Tamil Brahmin families consider when looking for an alliance.",
    ],
    sections: [
      {
        heading: "Iyer and Iyengar: what is the difference?",
        blocks: [
          "Both are Tamil Brahmin communities, but they follow different traditions. Iyers are Smartha, following Adi Shankara’s tradition and worshipping Shiva, Vishnu and other deities. Iyengars are Sri Vaishnavas, following Ramanuja’s teachings and worshipping Vishnu, and are divided into Vadakalai and Thenkalai sects.",
          "The differences show up in the wedding: the hymns sung, the design of the thirumangalyam, how the madisar is draped and some of the rituals. Many families today welcome Iyer–Iyengar alliances, but it is worth discussing traditions early.",
        ],
      },
      {
        heading: "Before the wedding",
        blocks: [
          {
            list: [
              <><strong>Nichayathartham:</strong> the formal engagement, where families exchange trays of gifts and confirm the date. The wedding invitation (lagna pathrikai) is often read out.</>,
              <><strong>Vratham / Pandha Kaal:</strong> prayers in both homes, including a ceremony around a bamboo pole that marks the start of the wedding.</>,
              <><strong>Janavasam:</strong> traditionally, the groom is brought to the venue in a procession the evening before.</>,
            ],
          },
        ],
      },
      {
        heading: "The wedding day",
        blocks: [
          {
            list: [
              <><strong>Kashi Yatrai:</strong> the groom sets off for Kashi with an umbrella and a walking stick, until the bride’s father persuades him to marry his daughter instead.</>,
              <><strong>Maalai Maatral:</strong> the bride and groom, lifted on the shoulders of their relatives, exchange garlands three times.</>,
              <><strong>Oonjal:</strong> the couple sit on a decorated swing; married women sing oonjal songs, offer milk and banana, and circle them with coloured rice balls to ward off the evil eye.</>,
              <><strong>Kanyadanam:</strong> the bride sits on her father’s lap and her parents give her hand to the groom.</>,
              <><strong>Mangalya Dharanam:</strong> at the muhurtham, the groom ties the thirumangalyam with the first knot and his sister ties the other two, while the nadaswaram plays the getti melam.</>,
              <><strong>Saptapadi:</strong> the groom holds the bride’s toe as she takes seven steps around the fire.</>,
              <><strong>Ammi Midhithal and Metti:</strong> the bride places her foot on a grinding stone, a promise of steadfastness, and the groom puts metti on her toes.</>,
              <><strong>Arundhati darshan:</strong> the couple are shown the stars Arundhati and Vasishtha.</>,
            ],
          },
        ],
      },
      {
        heading: "Distinct Iyengar customs",
        blocks: [
          {
            list: [
              "Andal’s Vaaranam Aayiram, the poem in which Andal dreams of marrying Lord Vishnu, is traditionally sung at the wedding.",
              "The thirumangalyam often carries Vaishnava symbols.",
              "The madisar is draped in the Iyengar style, which differs from the Iyer drape.",
              "Vadakalai and Thenkalai families may have slightly different customs, so the two families usually agree the details.",
            ],
          },
        ],
      },
      {
        heading: "What Tamil Brahmin families look for in an alliance",
        blocks: [
          {
            list: [
              "Gotra, with sagotra matches avoided.",
              "Horoscope matching through the 10 Poruthams, with Rajju and Vedhai treated as essential.",
              "Iyer or Iyengar tradition, and within those, sub-sects such as Vadama, Brahacharanam, Vadakalai or Thenkalai.",
              "Education, career and often a willingness to relocate, since many families have children in Chennai, Bengaluru, Hyderabad or abroad.",
            ],
          },
        ],
      },
      {
        heading: "Seetha Rama Kalyana for Tamil families",
        blocks: [
          "The site is available in Tamil as well as English. Profiles show community, sub-community and gotra, Kundli matching by our astrologer is available, and phone numbers are shared only after both families agree to go ahead.",
        ],
      },
    ],
  },

  "vivaha-panchami-significance-marriage": {
    readTime: "6 min read",
    answer:
      "Vivah Panchami celebrates the wedding of Lord Rama and Goddess Sita. It falls on the Shukla Panchami (fifth day of the bright fortnight) of Margashirsha, usually in November or December, and is celebrated most grandly in Janakpur in Nepal and in Ayodhya. Families mark it with Ram–Sita wedding ceremonies, Ramcharitmanas recitation and prayers for a happy married life.",
    keyFacts: [
      "Date: Margashirsha Shukla Panchami, usually November or December; check your local panchang for the exact date.",
      "Janakpur (Sita’s birthplace) and Ayodhya hold the largest celebrations.",
      "Temples re-enact the Ram–Sita vivah with a full wedding procession.",
      "Some families in the Mithila region avoid holding their own weddings on this day.",
      "Unmarried devotees often pray to Sita and Rama for a good life partner.",
    ],
    fullContent: [
      "For generations, the marriage of Sita and Rama has been the example Hindu families hold up for a married life built on devotion, respect and loyalty. Vivah Panchami is the day that marriage is celebrated.",
      "Here is when it falls, how it is observed, and why it still means so much to families looking for an alliance for their children.",
    ],
    sections: [
      {
        heading: "What is Vivah Panchami?",
        blocks: [
          "According to the Ramayana, Rama won Sita’s hand at her swayamvar in Mithila by lifting and breaking Lord Shiva’s bow, which no other prince could even move. Their wedding is celebrated every year on Vivah Panchami.",
          "The festival falls on the fifth day (Panchami) of the bright fortnight (Shukla Paksha) of the month of Margashirsha, which usually lands in November or December. The exact date changes every year, so check your local panchang.",
        ],
      },
      {
        heading: "How it is celebrated",
        blocks: [
          {
            list: [
              <><strong>Janakpur, Nepal:</strong> Sita’s birthplace hosts the largest celebration, centred on the Janaki Mandir, with a re-enactment of the wedding that draws pilgrims from India and Nepal.</>,
              <><strong>Ayodhya:</strong> temples hold Ram–Sita vivah utsav, with a symbolic wedding procession (baraat) and rituals.</>,
              <><strong>At home and in local temples:</strong> devotees recite the Ramcharitmanas (especially the Bal Kand describing the wedding), sing bhajans and offer prayers to Sita and Rama.</>,
            ],
          },
        ],
      },
      {
        heading: "Is Vivah Panchami a good day for weddings?",
        blocks: [
          "Opinions differ. Because of the hardships Sita faced after her marriage, some families, particularly in the Mithila region, traditionally avoid holding their own weddings on Vivah Panchami. Others see it as a deeply auspicious day. If you are planning a wedding around this time, follow your family’s custom and consult your priest about the muhurtham.",
          "Many families instead treat Vivah Panchami as an auspicious day to begin the search: to pray for a good match, to create a matrimony profile, or to have a first conversation with a prospective family.",
        ],
      },
      {
        heading: "Lessons from the marriage of Sita and Rama",
        blocks: [
          {
            list: [
              <><strong>Mutual respect:</strong> both partners honour each other’s dignity and duty.</>,
              <><strong>Loyalty through difficulty:</strong> Sita chose to share Rama’s exile rather than stay in comfort.</>,
              <><strong>Shared dharma:</strong> a marriage built on common values rather than convenience.</>,
              <><strong>Family harmony:</strong> respect for elders and for both families.</>,
            ],
          },
          "These ideals are why the phrase “a match like Sita and Rama” is still the highest blessing elders give a couple.",
        ],
      },
      {
        heading: "Begin your search this Vivah Panchami",
        blocks: [
          "Seetha Rama Kalyana takes its name from this divine wedding. It is a Hindu matrimony platform for families across India and abroad, available in English, Hindi, Kannada, Telugu and Tamil, with verified profiles and phone numbers shared only after both families agree.",
        ],
      },
    ],
  },
};
