import type { LongPost } from "./longPosts";
import A from "./BlogLink";

// Long-form rewrites of the practical guide posts. Same rules as longPosts.tsx: no invented
// success stories, member counts, testimonials or claims about other sites; bump `updatedAt`
// in blogsContents.tsx when a post here changes.

export const GUIDE_POSTS: Record<string, LongPost> = {
  "reasons-to-choose-trusted-hindu-matrimony": {
    title: "How to Choose a Hindu Matrimony Site: 10 Things to Check",
    summary:
      "Free or paid, big or community-focused: a practical checklist for choosing a matrimony site that is safe, private and right for your family.",
    keywords:
      "best hindu matrimony site, how to choose matrimony site, free vs paid matrimony, verified matrimony profiles, niche matrimony site, matrimony site privacy",
    readTime: "8 min read",
    answer:
      "Choose a matrimony site by checking how profiles are verified, who can see your phone number, what the full price is (and whether there is a refund policy), whether it covers your community and language, and whether it sends agents or sales calls. A small fee usually filters out casual sign-ups; a free site gives more reach but needs more screening.",
    keyFacts: [
      "Check verification first: at least phone OTP, ideally more.",
      "Find out exactly when your phone number is shared, and with whom.",
      "Read the full pricing and refund policy before paying.",
      "Community, sub-community and language filters save weeks of scrolling.",
      "Avoid any service that asks for OTPs or pushes add-ons over the phone.",
    ],
    fullContent: [
      "There are dozens of matrimony sites and apps, from very large national platforms to small community-focused ones. Most families pick one because a relative used it, which is a reasonable start but not a full answer.",
      "This checklist covers what actually matters when you are trusting a site with your family’s details and your son’s or daughter’s future.",
    ],
    sections: [
      {
        heading: "1. How are profiles verified?",
        blocks: [
          <>Every site should at least verify the phone number with an OTP. Ask whether it also checks photos or documents, and how quickly it removes reported profiles. Verification will never be perfect anywhere, so pair it with your own checks from our <A to="/blog/online-matrimony-safety-guide">online matrimony safety guide</A>.</>,
        ],
      },
      {
        heading: "2. Who can see your phone number?",
        blocks: [
          "This is the single biggest privacy question. On some services, any paying member can view contact details. On others, numbers are shared only when both sides accept an interest. If you do not want calls from strangers, choose the second kind.",
        ],
      },
      {
        heading: "3. What is the full price?",
        blocks: [
          {
            list: [
              "The headline price and what it includes (contacts, messages, horoscope matching).",
              "Whether the plan renews automatically.",
              "Add-ons sold separately, such as profile highlighting or assisted services.",
              "The refund policy, in writing.",
            ],
          },
        ],
      },
      {
        heading: "4. Free or paid?",
        blocks: [
          "Free sites give the widest reach, but anyone can join in a minute, so you will spend more time screening inactive or casual profiles. A modest fee acts as a seriousness filter: people who pay are usually actively looking. Very expensive plans are rarely necessary for most families; what you pay for should be clear and useful.",
        ],
      },
      {
        heading: "5. Big platform or community-focused?",
        blocks: [
          "Large platforms have the most profiles across every community. Community-focused or regional sites have fewer profiles but more of the ones you actually want, and often better language support. Many families use one of each.",
        ],
      },
      {
        heading: "6. Community, sub-community and gotra details",
        blocks: [
          <>Check that the site lets you filter by community and sub-community, and shows gotra, so you can apply your family’s preferences quickly. See the <A to="/communities">communities we serve</A> for an example of how this is organised.</>,
        ],
      },
      {
        heading: "7. Language",
        blocks: [
          "Parents often manage profiles, and many are more comfortable in their own language. A site available in Kannada, Telugu, Tamil, Hindi or Marathi makes the search a family activity rather than something only the children can do.",
        ],
      },
      {
        heading: "8. Agents and sales calls",
        blocks: [
          "Some services follow sign-up with regular calls selling upgrades or “relationship managers”. If that bothers you, check reviews and the site’s own policy before signing up.",
        ],
      },
      {
        heading: "9. Horoscope matching",
        blocks: [
          <>If your family follows Kundli matching, see whether the site offers it, and whether a person explains the result or it is only an automated score. Our guide to <A to="/blog/understanding-kundali-matching-significance">Kundli matching</A> explains what to look for.</>,
        ],
      },
      {
        heading: "10. Support you can reach",
        blocks: [
          "Look for a real support email or contact page, a clear privacy policy, and a way to delete your profile and data. Test it with a question before you pay.",
        ],
      },
      {
        heading: "How Seetha Rama Kalyana answers these questions",
        blocks: [
          {
            list: [
              "OTP-verified phone numbers for every member.",
              "Phone numbers shared only after both families agree to go ahead.",
              "One clear yearly membership, with the price shown before you pay; see our pricing page.",
              "Hindu families across 40+ communities, with community, sub-community and gotra on profiles.",
              "Available in English, Kannada, Telugu, Tamil and Hindi.",
              "No agents and no sales calls.",
            ],
          },
          <>Details are on the <A to="/pricing">pricing page</A>.</>,
        ],
      },
    ],
  },

  "top-tips-find-match-indian-matrimony": {
    readTime: "7 min read",
    keywords:
      "tips to find match on matrimony site, how to find life partner online, matrimony site filters, matrimony search tips, indian matrimony tips",
    answer:
      "To find a match faster on a matrimony site: complete your profile with recent photos, keep partner filters realistic, use community and location filters for what truly matters, send personalised interests, reply promptly, and move to a family conversation once you have shared the basics. Check in regularly rather than all at once.",
    keyFacts: [
      "Complete profiles get noticeably more responses than half-filled ones.",
      "Use strict filters only for real deal-breakers; keep the rest wide.",
      "A short personal note with an interest works better than a blank one.",
      "Reply within a day or two, even if the answer is no.",
      "Ten minutes a day beats two hours once a month.",
    ],
    fullContent: [
      "Matrimony sites work best for families who use them steadily and deliberately. A few small habits make a big difference to who you see, and who sees you.",
    ],
    sections: [
      {
        heading: "1. Finish your profile before you search",
        blocks: [
          <>Families judge completeness as a sign of seriousness. Add 3–5 recent photos, an honest “about me”, education, work and family details. Our <A to="/blog/create-perfect-matrimony-profile">profile guide</A> walks through every field.</>,
        ],
      },
      {
        heading: "2. Use filters for deal-breakers only",
        blocks: [
          "Filters are powerful but easy to overuse. Decide what is genuinely non-negotiable for your family, often community, language, diet or location, and filter on those. Keep age, height and income as ranges rather than exact values.",
          {
            list: [
              "Age: a range of 4–6 years usually shows the right people.",
              "Location: include the cities you would genuinely consider moving to.",
              "Education and income: set a minimum, not a narrow band.",
              "Save your search so you can return to it quickly.",
            ],
          },
        ],
      },
      {
        heading: "3. Look at who is interested in you",
        blocks: [
          "Profiles that have already shown interest, or whose own preferences include you, are more likely to lead to a conversation. Check them first before starting fresh searches.",
        ],
      },
      {
        heading: "4. Personalise interests",
        blocks: [
          "When a site allows a note with an interest, mention something specific from their profile: their work, hometown or an interest you share. It shows you actually read it.",
        ],
      },
      {
        heading: "5. Reply promptly, including to say no",
        blocks: [
          "A polite decline within a day or two is better than silence. It keeps your profile’s reputation good and lets the other family move on.",
        ],
      },
      {
        heading: "6. Bring families in early",
        blocks: [
          <>Once two people have exchanged the basics, a family call often settles questions quickly. Prepare with our list of <A to="/blog/questions-to-ask-matrimony-match">questions to ask a match</A>.</>,
        ],
      },
      {
        heading: "7. Verify before you trust",
        blocks: [
          <>Video call, check the workplace, meet in public with family, and never send money. The <A to="/blog/online-matrimony-safety-guide">safety guide</A> lists the warning signs.</>,
        ],
      },
      {
        heading: "8. Keep a steady rhythm",
        blocks: [
          "Ten minutes a day to check new matches and reply works better than a long session once a month. New profiles join all the time, and early replies are noticed.",
        ],
      },
      {
        heading: "9. Review your preferences after a month",
        blocks: [
          "If you are seeing too few suitable profiles, widen one filter at a time and see what changes. If you are seeing too many unsuitable ones, tighten the filter that matters most.",
        ],
      },
      {
        heading: "10. Be patient, and kind",
        blocks: [
          "Finding the right match can take weeks or months. Treat every family with the courtesy you would want for your own, and the right conversation is far more likely to happen.",
        ],
      },
    ],
  },

  "matrimony-success-stories-within-6-months": {
    readTime: "8 min read",
    answer:
      "A realistic six-month plan: month 1, build a complete profile and agree family preferences; months 2–3, shortlist steadily, send interests and hold first conversations; months 3–4, family meetings and horoscope matching for serious matches; months 5–6, engagement decisions and wedding planning. Timelines vary, but a clear plan keeps the search moving.",
    keyFacts: [
      "Agree preferences within the family before the search starts.",
      "Shortlist a few profiles a week rather than dozens at once.",
      "Match horoscopes only for profiles you are serious about.",
      "Expect several first conversations before one moves forward.",
      "Book key wedding dates early if you have a muhurtham in mind.",
    ],
    fullContent: [
      "Many families start the search without a plan and find, months later, that they have looked at hundreds of profiles but had few real conversations. A simple timeline helps. This is not a promise of a wedding in six months; it is a practical way to make steady progress.",
    ],
    sections: [
      {
        heading: "Month 1: prepare",
        blocks: [
          {
            list: [
              "Sit down as a family and agree the non-negotiables (community, language, location, diet) and the nice-to-haves.",
              "Gather birth details if you follow horoscope matching.",
              <>Create a complete profile with good photos; see our <A to="/blog/create-perfect-matrimony-profile">profile guide</A>.</>,
              "Decide who manages the profile day to day, and how often you will review matches together.",
            ],
          },
        ],
      },
      {
        heading: "Months 2–3: search and first conversations",
        blocks: [
          {
            list: [
              "Review new matches a few times a week and shortlist 3–5 profiles each week.",
              "Send personalised interests and reply to incoming ones promptly.",
              <>Hold first conversations using our <A to="/blog/questions-to-ask-matrimony-match">questions to ask a match</A>.</>,
              "Keep a simple shared note of who you have spoken to and what you learned.",
            ],
          },
        ],
      },
      {
        heading: "Months 3–4: go deeper with serious matches",
        blocks: [
          {
            list: [
              <>Match horoscopes for the profiles you are serious about; see our <A to="/blog/understanding-kundali-matching-significance">Kundli matching guide</A>.</>,
              "Arrange family calls and, where possible, in-person meetings.",
              <>Do the basic checks in our <A to="/blog/online-matrimony-safety-guide">safety guide</A>: video calls, workplace, meeting in public.</>,
              "Give the couple a few conversations of their own before expecting a decision.",
            ],
          },
        ],
      },
      {
        heading: "Months 5–6: decide and plan",
        blocks: [
          {
            list: [
              "Once both families are comfortable, agree an engagement (nischitartha, roka or sagai, depending on your tradition).",
              "Consult your priest about muhurtham dates and book venues early in wedding season.",
              "Discuss budget, guest lists and ceremonies openly between the two families.",
              <>Start the practical side early; our <A to="/blog/modern-groom-checklist-india">pre-wedding checklist</A> covers documents and finances.</>,
            ],
          },
        ],
      },
      {
        heading: "What slows a search down",
        blocks: [
          {
            list: [
              "Very narrow filters that hide good matches.",
              "Long gaps between replies.",
              "Disagreement within the family about priorities.",
              "Waiting for a perfect profile instead of talking to good ones.",
            ],
          },
        ],
      },
      {
        heading: "Start your plan today",
        blocks: [
          "Creating a profile on Seetha Rama Kalyana takes about three minutes, in English, Kannada, Telugu, Tamil or Hindi. Phone numbers are shared only after both families agree, so you stay in control of every step.",
        ],
      },
    ],
  },

  "marriage-bureau-vs-matrimony-apps": {
    readTime: "7 min read",
    keywords:
      "marriage bureau vs matrimony app, marriage bureau india, matrimony website or bureau, offline vs online matchmaking, marriage broker",
    answer:
      "A marriage bureau offers personal service and local knowledge but a limited pool and less transparency; a matrimony app or website offers a much larger pool, filters and privacy controls, but you do the screening yourself. Many families use both: an app for reach and a trusted local bureau or relative for introductions.",
    keyFacts: [
      "Bureaus: personal, local, but smaller pools and often higher fees.",
      "Apps and websites: larger pools, filters and privacy settings, self-service.",
      "Ask any bureau about fees, success-fee terms and how they verify families.",
      "Online, check verification and who can see your number.",
      "Using both is common and sensible.",
    ],
    fullContent: [
      "Before matrimony websites, marriage bureaus and family networks did most of the matchmaking. Both still exist side by side, and families often wonder which is better. The honest answer is that they suit different needs.",
    ],
    sections: [
      {
        heading: "What a marriage bureau offers",
        blocks: [
          {
            list: [
              "Personal attention from someone who meets families and understands your expectations.",
              "Local knowledge of communities and families in your area.",
              "Help with introductions and, sometimes, with the first meetings.",
            ],
          },
          "The downsides: a much smaller pool of profiles, fees that can be high (sometimes including a success fee), and less visibility into how families are vetted.",
        ],
      },
      {
        heading: "What a matrimony app or website offers",
        blocks: [
          {
            list: [
              "A far larger pool, including families in other cities and abroad.",
              "Filters for community, language, location, education and more.",
              "Privacy controls over photos and contact details.",
              "Searching at your own pace, at any time.",
            ],
          },
          "The downsides: you do more of the screening yourself, and quality varies between platforms.",
        ],
      },
      {
        heading: "Questions to ask a marriage bureau",
        blocks: [
          {
            list: [
              "What is the total fee, and is there a success fee?",
              "How do you verify families?",
              "How many profiles do you have in our community and region?",
              "Who will see our details?",
            ],
          },
        ],
      },
      {
        heading: "Questions to ask a matrimony site",
        blocks: [
          <>The key ones are verification, who can see your number, the full price and refund policy. Our checklist on <A to="/blog/reasons-to-choose-trusted-hindu-matrimony">how to choose a Hindu matrimony site</A> covers all ten.</>,
        ],
      },
      {
        heading: "Which should you choose?",
        blocks: [
          {
            list: [
              "If you want wide reach and control: start with a matrimony site.",
              "If you want hand-holding and are in a close-knit local community: a reputable bureau can help.",
              "If you are unsure: use both, and let relatives know you are looking too.",
            ],
          },
        ],
      },
      {
        heading: "Where Seetha Rama Kalyana fits",
        blocks: [
          "Seetha Rama Kalyana is a self-service matrimony site for Hindu families, with OTP-verified members, numbers shared only after both families agree, and no agents or sales calls. It works well alongside personal introductions from family and friends.",
        ],
      },
    ],
  },

  "family-role-modern-arranged-marriage": {
    title: "The Family’s Role in Arranged Marriage Today",
    readTime: "7 min read",
    keywords:
      "arranged marriage today, family role in arranged marriage, modern arranged marriage india, parents matrimony profile, semi arranged marriage",
    answer:
      "In most Indian families today, arranged marriage is a partnership: parents help find and vet matches, share wisdom about family compatibility and organise the ceremonies, while the couple get time to talk and the final say. The search has moved online, but family involvement remains central.",
    keyFacts: [
      "Many matrimony profiles are created or managed by parents.",
      "Families usually check values, background, community and horoscope.",
      "The couple’s own conversations now carry the most weight.",
      "Clear roles in the family avoid conflict during the search.",
      "Online search widens the pool beyond relatives and local networks.",
    ],
    fullContent: [
      "Arranged marriage has changed more in the last twenty years than in the century before. Introductions that once came through relatives and community networks now often start online, and couples expect to get to know each other before deciding. What has not changed is that families remain closely involved.",
    ],
    sections: [
      {
        heading: "How arranged marriage has changed",
        blocks: [
          {
            list: [
              "From relatives’ introductions to online profiles reaching across cities and countries.",
              "From one meeting before a decision to several conversations and meetings.",
              "From parents deciding to the couple deciding, with parents advising.",
              "From local matches to families comfortable with matches in other cities or abroad.",
            ],
          },
        ],
      },
      {
        heading: "What families still do best",
        blocks: [
          {
            list: [
              "Understanding family values and whether two households will get along.",
              "Checking background, community and, for many, gotra and horoscope.",
              "Bringing experience: what makes a marriage work over decades.",
              "Organising ceremonies and supporting the couple after the wedding.",
            ],
          },
        ],
      },
      {
        heading: "Giving the couple space",
        blocks: [
          <>The most successful searches give the couple time to talk on their own once families are comfortable. A few calls and a meeting or two let them discuss career, money, where to live and children, the topics in our <A to="/blog/questions-to-ask-matrimony-match">questions to ask a match</A>.</>,
        ],
      },
      {
        heading: "Agreeing roles within the family",
        blocks: [
          {
            list: [
              "Who manages the profile and replies to interests.",
              "What the non-negotiables are, agreed before the search begins.",
              "How often the family reviews matches together.",
              "Who has the final say, usually the couple, and that everyone accepts it.",
            ],
          },
        ],
      },
      {
        heading: "When parents create the profile",
        blocks: [
          <>Parent-managed profiles are completely normal. Say so on the profile and keep your son or daughter involved, especially in writing the “about me”. Our <A to="/blog/create-perfect-matrimony-profile">profile guide</A> has tips for parents.</>,
        ],
      },
      {
        heading: "A platform built for families",
        blocks: [
          "Seetha Rama Kalyana is designed for parents and children to search together, in English, Kannada, Telugu, Tamil or Hindi, with phone numbers shared only after both families agree.",
        ],
      },
    ],
  },

  "inter-community-hindu-marriage-tips": {
    readTime: "7 min read",
    keywords:
      "inter community marriage, inter caste hindu marriage, cross cultural hindu wedding, different language marriage india, inter community wedding tips",
    answer:
      "Inter-community Hindu marriages work best when both families talk openly early about rituals, language, food, festivals and expectations, agree which customs the wedding will include, and respect each other’s traditions. Many couples combine rituals from both sides.",
    keyFacts: [
      "Discuss rituals, diet and festivals before the engagement.",
      "Agree which customs the wedding will follow, or blend both.",
      "Language at home matters: plan for both sets of grandparents.",
      "Horoscope systems differ between regions; agree which one to use.",
      "Respect for both families is the foundation.",
    ],
    fullContent: [
      "More Hindu families now accept matches across communities and languages, especially when children have studied or worked in other cities. These marriages bring together rich traditions, and a little preparation helps them start smoothly.",
    ],
    sections: [
      {
        heading: "Talk early about what matters",
        blocks: [
          {
            list: [
              "Rituals and festivals each family observes.",
              "Diet: vegetarian, eggetarian or non-vegetarian, and how strictly.",
              "Language at home and with grandparents.",
              "Expectations about living arrangements and roles.",
            ],
          },
        ],
      },
      {
        heading: "Planning the wedding",
        blocks: [
          <>Many inter-community couples hold ceremonies from both traditions, sometimes on different days. Others choose one tradition for the main ceremony and include key rituals from the other, such as the <A to="/blog/meaning-of-saptapadi-seven-vows">Saptapadi</A>, which is shared across Hindu weddings.</>,
        ],
      },
      {
        heading: "Horoscope matching across regions",
        blocks: [
          <>North Indian families often use 36-guna matching while South Indian families use the 10 Poruthams. Agree up front which system you will use. Our <A to="/blog/understanding-kundali-matching-significance">Kundli matching guide</A> explains both.</>,
        ],
      },
      {
        heading: "Language and the next generation",
        blocks: [
          <>Couples often speak English or Hindi together while each family keeps its own language. Teaching children both mother tongues keeps them close to both sets of grandparents. Read more on <A to="/blog/importance-of-mother-tongue-in-matrimony">why mother tongue matters</A>.</>,
        ],
      },
      {
        heading: "Handling differences respectfully",
        blocks: [
          {
            list: [
              "Learn a few phrases and festival customs of the other family.",
              "Celebrate both families’ major festivals.",
              "Let elders on both sides feel heard during wedding planning.",
              "Agree as a couple first, then present decisions to families together.",
            ],
          },
        ],
      },
      {
        heading: "Finding inter-community matches",
        blocks: [
          <>On Seetha Rama Kalyana you can include several communities in your preferences. Browse the <A to="/communities">communities we serve</A>; numbers are shared only after both families agree.</>,
        ],
      },
    ],
  },

  "importance-of-mother-tongue-in-matrimony": {
    readTime: "6 min read",
    keywords:
      "mother tongue matrimony, kannada matrimony, telugu matrimony, tamil matrimony, hindi matrimony, same language marriage",
    answer:
      "Many families prefer a match who speaks the same mother tongue because language shapes festivals, food, humour and how comfortable both sets of parents feel together. It is a strong preference rather than a requirement, and couples with different languages often build bilingual homes successfully.",
    keyFacts: [
      "Language affects in-law relationships as much as the couple’s own.",
      "Shared festivals and food traditions often come with a shared language.",
      "Many couples speak English or Hindi together and keep both mother tongues.",
      "Matrimony sites in regional languages help parents take part.",
    ],
    fullContent: [
      "“Same language preferred” appears on a large number of matrimony profiles. To younger family members it can seem old-fashioned, but there are good reasons families care about it.",
    ],
    sections: [
      {
        heading: "Why mother tongue matters to families",
        blocks: [
          {
            list: [
              "Parents can speak comfortably with the other family and the new daughter- or son-in-law.",
              "Festivals, rituals, songs and recipes are often tied to language and region.",
              "Grandparents can share stories and traditions with grandchildren.",
              "Humour, emotions and everyday small talk come more easily.",
            ],
          },
        ],
      },
      {
        heading: "When language is a strong preference",
        blocks: [
          <>Families living outside their home state, or abroad, often value a shared mother tongue even more as a link to their roots. Kannada, Telugu, Tamil and Malayali families in other cities are good examples; see our posts on <A to="/blog/kannada-matrimony-traditions-modern-world">Kannada</A>, <A to="/blog/telugu-brahmin-matrimony-traditions">Telugu</A> and <A to="/blog/tamil-matrimony-iyer-iyengar-weddings">Tamil</A> wedding traditions.</>,
        ],
      },
      {
        heading: "When to be flexible",
        blocks: [
          <>If the values, community and family background fit well, a different mother tongue is rarely a problem in practice. Couples commonly speak English or Hindi together and raise children who understand both languages. Our guide to <A to="/blog/inter-community-hindu-marriage-tips">inter-community marriages</A> has practical tips.</>,
        ],
      },
      {
        heading: "Setting language preferences on your profile",
        blocks: [
          {
            list: [
              "List your mother tongue and the other languages you speak.",
              "Mark a same-language preference only if it really matters to your family.",
              "Mention in your bio if you are open to other languages.",
            ],
          },
        ],
      },
      {
        heading: "A matrimony site in your language",
        blocks: [
          <>Seetha Rama Kalyana is available in <A to="/kn">Kannada</A>, <A to="/te">Telugu</A>, <A to="/ta">Tamil</A>, <A to="/hi">Hindi</A> and English, so parents and children can search together in the language they are most comfortable with.</>,
        ],
      },
    ],
  },

  "top-matrimony-site-global-indians": {
    title: "NRI Hindu Matrimony: A Practical Guide for Families Abroad",
    summary:
      "How NRI Hindu families can find a match in India or abroad: time zones, verification, family involvement and planning the wedding.",
    keywords:
      "nri matrimony, nri hindu matrimony, matrimony for indians abroad, nri bride groom, overseas indian matrimony",
    readTime: "7 min read",
    answer:
      "NRI families find matches by being clear about where the couple will live, setting time-zone-friendly call times, involving relatives in India for in-person checks, verifying profiles carefully, and planning wedding dates around visits home. Be upfront about visa or residency status and career plans from the start.",
    keyFacts: [
      "State clearly whether you are open to moving to India or abroad.",
      "Use relatives in India for meetings and local verification.",
      "Video call early and often; schedule around time zones.",
      "Be transparent about visa or residency status.",
      "Plan engagement and wedding dates around trips to India.",
    ],
    fullContent: [
      "Indian families abroad often want a match who shares their language, community and values, whether that person lives in India or elsewhere. Distance adds a few challenges, and a little planning solves most of them.",
    ],
    sections: [
      {
        heading: "Decide where the couple will live",
        blocks: [
          "The most important question in an NRI match is location. Is the bride or groom willing to move abroad, or to India? Families who state this clearly on the profile save months of mismatched conversations.",
        ],
      },
      {
        heading: "Make distance work",
        blocks: [
          {
            list: [
              "Agree regular call times that suit both time zones.",
              "Start with video calls, and include both families.",
              "Ask relatives in India to meet the other family in person.",
              "Plan a visit home to meet once the match feels serious.",
            ],
          },
        ],
      },
      {
        heading: "Verify carefully",
        blocks: [
          <>Overseas proposals are where fraud is most often attempted. Verify the employer and city abroad, speak to relatives in India, and never send money. Our <A to="/blog/online-matrimony-safety-guide">online safety guide</A> has a full checklist.</>,
        ],
      },
      {
        heading: "Be transparent about status and plans",
        blocks: [
          {
            list: [
              "Current visa, residency or citizenship status.",
              "Career plans and how long you expect to stay abroad.",
              "Expectations about visiting or caring for parents in India.",
            ],
          },
        ],
      },
      {
        heading: "Planning the wedding",
        blocks: [
          "Most NRI weddings take place in India during a planned trip, often in the winter wedding season. Book muhurtham dates and venues early, and allow time for marriage registration and any paperwork the couple will need for travel afterwards.",
        ],
      },
      {
        heading: "Seetha Rama Kalyana for NRI families",
        blocks: [
          "Families can search from anywhere in the world, in English or their own language. Phone numbers are shared only after both families agree, which matters when you cannot meet in person straight away.",
        ],
      },
    ],
  },

  "modern-groom-checklist-india": {
    title: "Pre-Wedding Checklist for Grooms and Brides in India",
    readTime: "7 min read",
    keywords:
      "pre wedding checklist india, groom checklist, marriage registration documents india, wedding planning checklist, hindu marriage registration",
    answer:
      "Before the wedding, agree the budget and ceremonies with both families, book the muhurtham and venue, plan finances and insurance, gather documents for marriage registration (age and address proof, photographs, wedding invitation and photos, and witnesses), and talk as a couple about life after the wedding.",
    keyFacts: [
      "Marriage registration under the Hindu Marriage Act is done with the local Sub-Registrar or registrar; requirements vary by state.",
      "Typical documents: age proof, address proof, photos, wedding invitation and photos, witnesses.",
      "Update nominees on bank accounts, insurance and investments after marriage.",
      "Agree budget and guest lists between families early.",
      "Talk about life after the wedding, not just the wedding.",
    ],
    fullContent: [
      "The weeks before a wedding fill up quickly with shopping, rituals and relatives. Some practical tasks get forgotten until they become urgent. This checklist covers what both the groom and the bride should sort out, ideally a few months ahead.",
    ],
    sections: [
      {
        heading: "With both families",
        blocks: [
          {
            list: [
              "Agree the overall budget and how costs will be shared.",
              "Decide which ceremonies and functions will be held.",
              "Fix muhurtham dates with your priest and book the venue early.",
              "Agree guest list sizes for each side.",
            ],
          },
        ],
      },
      {
        heading: "Documents for marriage registration",
        blocks: [
          "Registering your marriage gives you a marriage certificate, which you may need for passports, visas, bank and insurance records. Under the Hindu Marriage Act it is usually done at the office of the local Sub-Registrar or Registrar of Marriages. Requirements differ by state, so check locally, but typically include:",
          {
            list: [
              "Age proof for both (birth certificate, school certificate or passport).",
              "Address proof.",
              "Passport-size photographs.",
              "The wedding invitation and a photograph of the wedding.",
              "Witnesses with their ID proof.",
            ],
          },
        ],
      },
      {
        heading: "Money and insurance",
        blocks: [
          {
            list: [
              "Plan wedding spending so it does not leave debt behind.",
              "Review health insurance; consider a family floater after marriage.",
              "Add or update term life insurance if anyone depends on your income.",
              "Update nominees on bank accounts, insurance and investments.",
            ],
          },
          <>Our guide to <A to="/blog/financial-planning-for-newly-married-couples">financial planning for newly married couples</A> goes further.</>,
        ],
      },
      {
        heading: "Health and wellbeing",
        blocks: [
          "Get a routine health check-up a few months before the wedding, sleep properly in the final weeks, and keep some time each week free of wedding tasks.",
        ],
      },
      {
        heading: "Conversations as a couple",
        blocks: [
          <>Talk about where you will live, how you will share household work and expenses, and family expectations after the wedding. Our <A to="/blog/questions-to-ask-matrimony-match">questions to ask</A> list works well here too.</>,
        ],
      },
      {
        heading: "Travel and leave",
        blocks: [
          "Apply for leave early, check passports are valid if you plan to travel, and leave a few quiet days after the wedding before returning to work.",
        ],
      },
    ],
  },

  "financial-planning-for-newly-married-couples": {
    readTime: "7 min read",
    keywords:
      "financial planning newly married couples india, money after marriage, joint account married couple, emergency fund, term insurance after marriage",
    answer:
      "Newly married couples should share their full financial picture (income, savings, loans and family commitments), agree how expenses will be split, build an emergency fund of a few months’ expenses, review health and term insurance, update nominees, and set shared goals such as a home, children and retirement.",
    keyFacts: [
      "Talk openly about income, loans and family support before or soon after the wedding.",
      "Choose a system: joint account, separate accounts, or both.",
      "Aim for an emergency fund covering 3–6 months of expenses.",
      "Review health insurance and term life cover.",
      "Update nominees on every account and policy.",
    ],
    fullContent: [
      "Money is one of the most common sources of friction in a new marriage, usually because it was never discussed openly. A few honest conversations early on prevent most of it.",
    ],
    sections: [
      {
        heading: "Share the full picture",
        blocks: [
          {
            list: [
              "Monthly income and how stable it is.",
              "Savings and investments.",
              "Loans: education, home, car, personal or credit card.",
              "Regular support you give to parents or siblings.",
            ],
          },
        ],
      },
      {
        heading: "Choose a system for everyday money",
        blocks: [
          {
            list: [
              <><strong>Joint account:</strong> both incomes go in and all expenses come out. Simple and transparent.</>,
              <><strong>Separate accounts:</strong> each pays agreed bills. Gives independence.</>,
              <><strong>Both:</strong> a joint account for household costs and separate accounts for personal spending. Popular with working couples.</>,
            ],
          },
        ],
      },
      {
        heading: "Build an emergency fund",
        blocks: [
          "Keep three to six months of essential expenses somewhere safe and easy to access. It protects you from job changes, medical needs or family emergencies without borrowing.",
        ],
      },
      {
        heading: "Insurance and nominees",
        blocks: [
          {
            list: [
              "Review health insurance and consider a family floater policy.",
              "If either of you supports the other or plans children, consider term life insurance.",
              "Update nominees on bank accounts, provident fund, insurance and investments.",
            ],
          },
        ],
      },
      {
        heading: "Set shared goals",
        blocks: [
          "Agree a few goals with rough timelines: a home, a car, children’s education, travel, and retirement. Automate monthly savings towards them so progress happens without constant effort.",
        ],
      },
      {
        heading: "Talk about money regularly",
        blocks: [
          <>A short monthly check-in on spending and goals keeps both partners on the same page. If you are still choosing a partner, raise money early using our <A to="/blog/questions-to-ask-matrimony-match">questions to ask a match</A>.</>,
        ],
      },
    ],
  },

  "career-and-marriage-balance": {
    readTime: "6 min read",
    keywords:
      "dual career couple india, working couple marriage, career and marriage balance, wife working after marriage, relocation after marriage",
    answer:
      "Dual-career couples balance work and marriage by discussing career plans and relocation before marriage, sharing household work and childcare fairly, planning big career moves together, and protecting time for each other. Agreeing these early prevents most conflicts later.",
    keyFacts: [
      "Discuss career plans, relocation and further studies before the engagement.",
      "Share household work explicitly rather than assuming.",
      "Plan major moves (job changes, transfers, studies abroad) together.",
      "Talk with families about expectations for working daughters-in-law and sons-in-law.",
    ],
    fullContent: [
      "Most young Indian couples today both work, and many want to keep growing in their careers after marriage. That is good for the household and for each partner, but it needs planning.",
    ],
    sections: [
      {
        heading: "Talk about careers before marriage",
        blocks: [
          {
            list: [
              "Where do you each want to be in five years?",
              "Would either of you relocate for work, or for the other’s career?",
              "Are further studies or a career break planned?",
              "What do both families expect about working after marriage?",
            ],
          },
          <>These belong in your early conversations; see our <A to="/blog/questions-to-ask-matrimony-match">questions to ask a match</A>.</>,
        ],
      },
      {
        heading: "Share the work at home",
        blocks: [
          "Unspoken assumptions about cooking, cleaning, shopping and caring for parents cause more friction than anything else in dual-career homes. List the regular tasks and agree who does what, then review it every few months.",
        ],
      },
      {
        heading: "Plan big moves together",
        blocks: [
          "Job offers in other cities, transfers and studies abroad affect both partners. Agree a simple rule: no major career decision without discussing it first, and consider taking turns when two opportunities conflict.",
        ],
      },
      {
        heading: "Protect time together",
        blocks: [
          "Busy schedules can leave couples feeling like flatmates. Keep one evening a week and some weekend time free for each other and for family.",
        ],
      },
      {
        heading: "Supporting each other’s ambitions",
        blocks: [
          <>Celebrate each other’s achievements, step in during busy periods, and be honest when you need help. Pair this with clear <A to="/blog/financial-planning-for-newly-married-couples">financial planning</A> so money decisions support both careers.</>,
        ],
      },
    ],
  },

  "budget-destination-weddings-india": {
    readTime: "7 min read",
    keywords:
      "budget destination wedding india, affordable destination wedding, destination wedding places india, temple wedding, small wedding ideas",
    answer:
      "Budget-friendly destination wedding options in India include Rishikesh, Jaipur and Pushkar, Goa in the off-season, Kerala’s backwaters, Coorg, and Puducherry or Mahabalipuram. Keep costs down by limiting the guest list, choosing off-peak dates, booking a single venue with rooms, and keeping ceremonies simple.",
    keyFacts: [
      "The guest count drives cost more than the location.",
      "Off-season and weekday dates are usually much cheaper.",
      "A venue with rooms on site saves on transport and logistics.",
      "Temple or riverside ceremonies can be simple and meaningful.",
      "Get every quote in writing, including taxes and service charges.",
    ],
    fullContent: [
      "A destination wedding does not have to mean a palace and hundreds of guests. A smaller wedding in a beautiful place, with close family, can cost less than a large wedding at home.",
    ],
    sections: [
      {
        heading: "Budget-friendly locations",
        blocks: [
          {
            list: [
              <><strong>Rishikesh:</strong> riverside ceremonies by the Ganga, with a spiritual setting and many mid-range hotels.</>,
              <><strong>Jaipur and Pushkar:</strong> heritage havelis and smaller properties offer royal style without palace prices.</>,
              <><strong>Goa, off-season:</strong> beach venues are much cheaper outside the peak winter months.</>,
              <><strong>Kerala backwaters:</strong> resorts in Alleppey and Kumarakom suit small, scenic weddings.</>,
              <><strong>Coorg:</strong> homestays and estates for intimate hill weddings.</>,
              <><strong>Puducherry and Mahabalipuram:</strong> coastal towns close to Chennai with a range of venues.</>,
            ],
          },
        ],
      },
      {
        heading: "Ways to keep costs down",
        blocks: [
          {
            list: [
              "Keep the guest list to close family and friends.",
              "Choose off-peak months or weekday muhurthams where possible.",
              "Book one venue with rooms, so guests and ceremonies are in one place.",
              "Use local vendors for flowers, food and decoration.",
              "Combine functions, such as haldi and mehendi on the same day.",
              "Agree every price in writing, including taxes and service charges.",
            ],
          },
        ],
      },
      {
        heading: "Respecting tradition away from home",
        blocks: [
          <>Bring your family priest or ask the venue to arrange one familiar with your traditions. Core rituals such as Kanyadaan, Mangalya Dharane and the <A to="/blog/meaning-of-saptapadi-seven-vows">Saptapadi</A> can be performed anywhere.</>,
        ],
      },
      {
        heading: "Practical checks",
        blocks: [
          {
            list: [
              "Weather for your dates: monsoon months need indoor backups.",
              "Travel time for elderly relatives.",
              "Local rules on music, fire and late-night events.",
              <>Paperwork for marriage registration afterwards; see our <A to="/blog/modern-groom-checklist-india">pre-wedding checklist</A>.</>,
            ],
          },
        ],
      },
    ],
  },
};
