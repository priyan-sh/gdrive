// Bilingual content for the PCOD Xpert patient booklet.
// Every key exists in BOTH `en` and `hi` so the layout is shared.
// **double asterisks** = bold in the Word text.

const en = {
  lang: 'en',
  brand: 'PCOD Xpert by Hope',
  tagline: 'Hope Blooms from Within',
  phoneDisplay: '+91 62625 06050',
  phoneTel: 'tel:+916262506050',
  wa: 'https://wa.me/916262506050',
  address: ['Sahaj Hospital Campus', '15/2 South Tukoganj, Near Manas Bhavan,', 'Behind Hotel Surya, Indore,', 'Madhya Pradesh 452005'],
  footer: 'PCOD Xpert by Hope  |  +91 62625 06050',

  cover: {
    kicker: 'PATIENT GUIDE',
    title1: 'Everything About',
    title2: 'PCOD & PCOS',
    sub: 'A simple, illustrated guide for women, teens and families',
    chips: ['Hormones', 'Periods', 'Fertility', 'Skin & Hair', 'Metabolism'],
  },

  // ---------- page 2 ----------
  p2: {
    kicker: 'START HERE', title: 'Welcome',
    lead: 'If you have been told you have **PCOD or PCOS**, you are not alone. About **1 in 5** women of reproductive age lives with it. It is common, it is manageable, and understanding it is the first step.',
    howTitle: 'How to use this booklet',
    how: [
      'Read one page at a time. Each page explains one idea with a picture.',
      'Use the **symptom decoder** (page 13) to understand what your body is telling you.',
      'Fill in the **tracker** (page 22) and bring it to your appointment.',
    ],
    teenTitle: 'For teens and parents',
    teen: 'Irregular periods are common in the first 2 to 3 years after the first period. A doctor can check whether it is simply your body settling in, or something that needs care.',
    tocTitle: 'In this booklet',
    toc: [
      ['3', 'What are PCOD and PCOS?'],
      ['4', 'Your monthly cycle'],
      ['5', 'The hormones'],
      ['6', 'Why PCOD happens'],
      ['7', 'Symptoms to watch for'],
      ['8', 'Periods: normal or not?'],
      ['9', 'Hair, acne and hair fall'],
      ['10', 'Insulin and metabolic syndrome'],
      ['11', 'Fertility and pregnancy'],
      ['12', 'How PCOD is diagnosed'],
      ['13', 'Symptom decoder'],
      ['14', 'Eating well'],
      ['15', 'Move, sleep, calm'],
      ['16', 'Treatment options'],
      ['17', 'Mind and long-term health'],
      ['18', 'Our PCOD Xpert team'],
      ['19', '3 and 6 month programmes'],
      ['20', 'Myths and facts'],
      ['21', 'Questions and answers'],
      ['22', 'My tracker'],
      ['23', 'Patient stories'],
      ['24', 'Contact us'],
    ],
  },

  // ---------- page 3 ----------
  p3: {
    kicker: 'THE BASICS', title: 'What are PCOD and PCOS?',
    intro: 'Your ovaries store eggs inside tiny fluid-filled sacs called **follicles**. Each month one follicle usually grows, matures and releases an egg. In PCOD/PCOS, many follicles start growing but **stall**, so the egg is not released on time.',
    callTitle: 'Not "cysts" you need to remove',
    call: 'The small dots seen on a scan are stalled follicles, not harmful cysts. They do not turn into cancer and usually do not need surgery.',
    cmpTitle: 'PCOD vs PCOS: is there a difference?',
    cmpRows: [
      ['PCOD', 'Polycystic Ovarian Disease: the popular name. Often described as "milder".'],
      ['PCOS', 'Polycystic Ovary Syndrome: the medical name. Often described as "more serious".'],
    ],
    cmpNote: 'Today doctors use one term, **PCOS**, and see it as a **spectrum**. Some women have mild signs, others more. What matters is your symptoms, tests and health risks, not the name.',
    factsTitle: 'Good to know',
    facts: [
      '**Not your fault.** Genes, hormones and insulin all play a part.',
      '**Not contagious** and not caused by one food or one habit.',
      '**Manageable.** Most symptoms improve with the right care.',
    ],
  },

  // ---------- page 4 ----------
  p4: {
    kicker: 'YOUR BODY', title: 'Your monthly cycle',
    intro: 'A typical cycle is a **dance of hormones** between your brain, ovaries and womb. Day 1 is the first day of bleeding.',
    phases: [
      ['Period', 'Day 1-5', 'The womb lining sheds as bleeding.'],
      ['Growing', 'Day 1-13', 'Egg sacs grow. Estrogen rises and rebuilds the lining.'],
      ['Ovulation', 'About day 14', 'A surge of LH releases the egg.'],
      ['Preparing', 'Day 15-28', 'Progesterone prepares the womb. No pregnancy? Period starts.'],
    ],
    callTitle: 'What changes in PCOD?',
    call: 'The egg often **does not release**. Without ovulation there is no progesterone rise, so periods become **late, missed or heavy**, and getting pregnant takes longer.',
  },

  // ---------- page 5 ----------
  p5: {
    kicker: 'YOUR BODY', title: 'The hormones',
    intro: 'Hormones are chemical messengers. The brain sends signals to the ovaries, and the ovaries send signals back. In PCOD this conversation gets out of balance.',
    cards: [
      ['FSH', 'Grows the egg sac each month.'],
      ['LH', 'Triggers egg release. Often higher in PCOD.'],
      ['Estrogen', 'Builds the womb lining. Supports skin and bones.'],
      ['Progesterone', 'Prepares the womb after ovulation. Low in PCOD.'],
      ['Androgens', 'Hormones every woman makes in small amounts. Higher in PCOD: acne, hair.'],
      ['Insulin', 'Moves sugar into cells. Often high in PCOD.'],
    ],
    note: '**Thyroid and prolactin** problems can look like PCOD. That is why we always test them too.',
  },

  // ---------- page 6 ----------
  p6: {
    kicker: 'THE CAUSE', title: 'Why does PCOD happen?',
    intro: 'There is no single cause. Several things add up and keep each other going, like a circle.',
    causesTitle: 'What adds up',
    causes: [
      '**Family history:** mother, sister or aunt with PCOD or diabetes.',
      '**Insulin resistance:** cells respond poorly to insulin.',
      '**Extra androgens:** ovaries and adrenal glands make more.',
      '**Lifestyle:** low activity, poor sleep, stress and extra weight can make it worse.',
    ],
    callTitle: 'The good news',
    call: 'You can break the circle at **any point**. If you carry extra weight, losing even **5 to 10%** of your body weight can bring back regular ovulation and periods.',
  },

  // ---------- page 7 ----------
  p7: {
    kicker: 'SYMPTOMS', title: 'Symptoms to watch for',
    intro: 'You may have only a few of these. Every woman is different. Numbers match the picture.',
    items: [
      'Hair thinning at the parting',
      'Acne and oily skin',
      'Extra dark hair on chin, upper lip',
      'Dark, velvety patches on neck, underarms',
      'Weight gain, especially around the belly',
      'Irregular, missed or heavy periods',
      'Difficulty getting pregnant',
      'Low mood, anxiety, tiredness, poor sleep',
    ],
    note: 'See a doctor if you notice **two or more** of these, or if one is bothering you.',
  },

  // ---------- page 8 ----------
  p8: {
    kicker: 'SYMPTOMS', title: 'Periods: normal or not?',
    intro: 'Periods are a monthly report card of your hormones. Here is how to read it.',
    rows: [
      ['green', 'Typical', 'A period every **21 to 35 days**. Bleeding lasts **2 to 7 days**. A pad changes every 3 to 4 hours or less often.'],
      ['amber', 'Worth checking', 'Cycles **longer than 35 days**, fewer than 8 periods a year, skipping months, spotting between periods.'],
      ['red', 'See a doctor soon', '**No period for 3 months** (and not pregnant). Soaking a pad every hour for 2 hours. Large clots. Bleeding over 7 days. Severe pain.'],
    ],
    whyTitle: 'Why skipped periods matter',
    why: 'If periods are missed for many months, the womb lining can keep thickening. Over the years this can cause heavy bleeding and, rarely, serious lining changes. A doctor can give a simple treatment to protect it.',
    teenTitle: 'For teens',
    teen: 'See a doctor if there is no period by age 15, or more than 3 years after breast growth began.',
  },

  // ---------- page 9 ----------
  p9: {
    kicker: 'SYMPTOMS', title: 'Hair, acne and hair fall',
    intro: 'Androgens make some hair follicles grow thick, dark hair and make oil glands more active. Others, on the scalp, shrink.',
    cols: [
      ['Extra hair', 'Hirsutism', 'Coarse, dark hair on the upper lip, chin, chest, belly, back or thighs. Different from light, fine facial fuzz that most women have.'],
      ['Acne', '', 'Painful pimples on the jawline, chin and lower face. Often flare before periods and may leave marks.'],
      ['Hair fall', '', 'The centre parting gets wider and hair feels thinner on top. The hairline at the front usually stays.'],
    ],
    tipsTitle: 'What helps',
    tips: [
      'Treatment takes **3 to 6 months** to show. Hair grows slowly.',
      'Medicines reduce **new** hair and acne. Laser or electrolysis removes existing hair.',
      'Shaving or threading does **not** make hair thicker.',
      'Check **iron, thyroid and vitamin D**. Low levels also cause hair fall.',
    ],
  },

  // ---------- page 10 ----------
  p10: {
    kicker: 'METABOLISM', title: 'Insulin and metabolic syndrome',
    keyTitle: 'Insulin resistance',
    key: 'Insulin is a **key** that lets sugar into your cells for energy. When the lock gets stiff, the body makes **more keys**. High insulin tells the ovaries to make more androgens.',
    signs: 'Signs: dark neck patches, skin tags, sugar cravings, belly fat, sleepy after meals. **Lean women can have it too.**',
    msTitle: 'Metabolic syndrome',
    msIntro: 'This means **3 or more** of these 5 are present. It raises the risk of diabetes and heart disease.',
    msNote: 'A simple blood test and a tape measure are enough to check. Early action can reverse it.',
  },

  // ---------- page 11 ----------
  p11: {
    kicker: 'FERTILITY', title: 'PCOD and getting pregnant',
    intro: 'PCOD is the most common cause of **ovulation problems**. It does **not** mean you cannot have a baby. Most women with PCOD do conceive, sometimes with medical help.',
    whyTitle: 'Why it can take longer',
    why: [
      'The egg may not mature or release regularly.',
      'High insulin and androgens disturb the cycle.',
      'Other causes (tubes, womb, partner\'s semen) are checked at the same time.',
    ],
    whenTitle: 'When to ask for help',
    when: [
      'Trying for **12 months** (under 35 years).',
      'Trying for **6 months** (35 years or older).',
      '**Sooner** if periods are very irregular or absent.',
    ],
    tipsTitle: 'Before and during pregnancy',
    tips: 'Start **folic acid** as advised, aim for a healthy weight, stop smoking and alcohol. Women with PCOD have a higher chance of **gestational diabetes and high blood pressure**, so early antenatal care matters.',
  },

  // ---------- page 12 ----------
  p12: {
    kicker: 'DIAGNOSIS', title: 'How PCOD is diagnosed',
    intro: 'There is no single test. Doctors look for **any 2 of these 3** signs, after ruling out other conditions.',
    testsTitle: 'Tests you may be advised',
    tests: [
      ['Blood', 'LH, FSH, testosterone, DHEAS, prolactin, TSH, AMH'],
      ['Sugar', 'HbA1c or fasting sugar, sugar tolerance test, insulin'],
      ['Heart', 'Cholesterol and triglycerides, blood pressure'],
      ['Vitamins', 'Vitamin D, B12, iron, liver tests'],
      ['Scan', 'Pelvic ultrasound of ovaries and womb lining'],
      ['Body', 'Weight, waist, BMI, skin and hair check'],
    ],
    teen: '**Teens:** a scan alone is not used to diagnose PCOD in the first 8 years after periods start.',
  },

  // ---------- page 13 ----------
  p13: {
    kicker: 'SYMPTOM DECODER', title: 'What does it mean?',
    heads: ['You notice', 'It may mean', 'What to do'],
    rows: [
      ['Periods over 35 days apart, or skipped', 'Ovulation is not happening regularly', 'Track dates, see a doctor'],
      ['Very heavy periods with clots', 'Thick lining, fibroids or thyroid issue', 'Doctor visit soon'],
      ['Acne on jaw and chin', 'High androgens', 'Hormone and skin review'],
      ['New dark hair on chin or chest', 'High androgens', 'Hormone tests'],
      ['Thinning at the parting', 'Androgens, low iron, thyroid', 'Blood tests'],
      ['Dark velvety neck patches', 'Insulin resistance', 'Sugar and insulin tests'],
      ['Belly weight, sugar cravings', 'Insulin resistance', 'Diet and activity plan'],
      ['Tired, snoring, poor sleep', 'Sleep apnoea, thyroid, anaemia', 'Doctor check'],
      ['Low mood, constant worry', 'Common in PCOD', 'Talk to someone, counselling'],
      ['No pregnancy after 6 to 12 months', 'Ovulation problem', 'Fertility consultation'],
    ],
    redTitle: 'Get help urgently if you have',
    red: 'Severe lower tummy pain, fainting, very heavy bleeding, chest pain or breathlessness, or **sudden** deepening of voice with rapid hair growth.',
  },

  // ---------- page 14 ----------
  p14: {
    kicker: 'LIFESTYLE', title: 'Eating well with PCOD',
    intro: 'There is no one "PCOD diet". The goal is steady sugar levels. Use the plate below at lunch and dinner.',
    moreTitle: 'Eat more',
    more: [
      'Millets: jowar, bajra, ragi',
      'Dals, sprouts, chana, rajma',
      'Vegetables and salads',
      'Curd, paneer, eggs, fish',
      'Nuts, seeds, guava, apple',
    ],
    lessTitle: 'Eat less',
    less: [
      'Maida, biscuits, white bread',
      'Sugar, sweets, cold drinks',
      'Packaged and deep-fried snacks',
      'Large portions of white rice',
      'Late-night heavy meals',
    ],
    habitsTitle: 'Small habits that help',
    habits: [
      'Protein with every meal, especially breakfast.',
      'Walk 10 minutes after meals to lower sugar.',
      'Drink 2 to 3 litres of water.',
      'Avoid crash diets. They backfire.',
    ],
  },

  // ---------- page 15 ----------
  p15: {
    kicker: 'LIFESTYLE', title: 'Move, sleep, calm',
    intro: 'Movement makes your cells listen to insulin again. Good sleep and calm balance hunger and stress hormones.',
    cols: [
      ['Move', '**150 minutes a week** of brisk walking, cycling, swimming or dance, plus **2 days of strength**. Even 10 minutes counts.'],
      ['Sleep', '**7 to 9 hours**, same time each night. Screens off 1 hour before bed. Dark, cool room.'],
      ['Calm', '10 minutes of **yoga, pranayama or meditation** daily. Time for a hobby or friends.'],
    ],
    note: '**Start small.** Pick one habit this week. Small steps you can keep beat big plans you drop.',
  },

  // ---------- page 16 ----------
  p16: {
    kicker: 'TREATMENT', title: 'Treatment options',
    intro: 'Treatment depends on **what you want**: regular periods, clearer skin, less hair, or a baby. Your doctor will build your plan.',
    heads: ['Your goal', 'Options your doctor may use'],
    rows: [
      ['Regular periods, protect the womb', 'Hormonal pills or a progesterone course'],
      ['Insulin resistance, weight', 'Nutrition plan, activity, metformin and other medicines as advised'],
      ['Acne, extra hair, hair fall', 'Anti-androgen medicines, skin treatments, laser'],
    ],
    fertTitle: 'If pregnancy is the goal',
    fertRows: [
      ['Ovulation tablets', 'A short tablet course early in the cycle helps an egg grow and release. Often the first step.'],
      ['Injections', 'Used when tablets are not enough. Scans watch the egg growth.'],
      ['IUI', 'Prepared sperm are placed in the womb around the time of ovulation.'],
      ['IVF / ICSI', 'Eggs are collected, fertilised in the lab, and the embryo is placed in the womb. Used if earlier steps fail or other factors exist.'],
    ],
    note: '**Important:** medicines and supplements (including inositol, vitamin D) are only taken on your doctor\'s advice. No medicine replaces healthy habits.',
  },

  // ---------- page 17 ----------
  p17: {
    kicker: 'WELLBEING', title: 'Mind and long-term health',
    mindTitle: 'Your feelings are real',
    mind: 'Anxiety, low mood and worry about body image are **2 to 3 times more common** in PCOD. It is not weakness. Hormones and insulin play a role. Talking helps. Ask us about counselling.',
    riskTitle: 'Possible long-term risks',
    risks: ['Type 2 diabetes', 'Heart disease and high BP', 'Fatty liver', 'Sleep apnoea', 'Womb lining thickening', 'Depression and anxiety'],
    helpTitle: 'When to ask for help',
    help: 'Sadness or worry lasting more than 2 weeks, panic attacks, losing interest in daily life, or trouble with sleep or appetite. If you ever think of harming yourself, tell someone and get help right away. Free helpline: **Tele-MANAS 14416** (24x7).',
    goodTitle: 'Protect yourself',
    good: [
      'Check **blood pressure, sugar and cholesterol every year**.',
      'Aim for **a period at least every 3 months**.',
      'Keep active, eat well, sleep well.',
      'Early care greatly lowers these risks.',
    ],
  },

  // ---------- page 18 ----------
  p18: {
    kicker: 'OUR TEAM', title: 'Everything under one roof',
    intro: 'PCOD touches many parts of the body, so one doctor is rarely enough. At PCOD Xpert, a **multidisciplinary team** works together on your plan, from consultation to tests, in one campus.',
    whyTitle: 'Why one roof helps',
    why: [
      '**One plan** shared by all your specialists.',
      '**Tests and scans** on the same campus.',
      '**Fewer visits**, clear follow-up and one team to call.',
    ],
    callTitle: 'Supportive therapies',
    call: 'HBOT and ozone therapy are offered as **additional supportive options** only when your doctor advises. Research on their role in PCOS is still developing. They do not replace lifestyle, medicines or fertility care.',
  },

  // ---------- page 19 ----------
  p19: {
    kicker: 'OUR PROGRAMMES', title: '3 and 6 month programmes',
    intro: 'A structured journey with regular reviews, so you are never managing PCOD alone.',
    m3Title: '3-MONTH PROGRAMME',
    m3: [
      ['Month 1', 'Assess and plan', 'Gynecology, endocrine, skin and diet consults. Blood tests and ultrasound. Your personal plan.'],
      ['Month 2', 'Act and adjust', 'Diet and exercise coaching. Medicines and skin or hair care as needed. Follow-up.'],
      ['Month 3', 'Review', 'Repeat measurements and tests. Progress check and a plan to keep going.'],
    ],
    m6Title: '6-MONTH PROGRAMME',
    m6: 'Everything in the 3-month programme, plus **months 4 to 6**: monthly check-ins, fine-tuning of medicines, fertility planning if you wish, skin and hair care cycles, and a full review of your tests and long-term health plan.',
    note: 'Ask our team what is included in each programme for your needs.',
  },

  // ---------- page 20 ----------
  p20: {
    kicker: 'MYTHS AND FACTS', title: 'Myths and facts',
    mythLabel: 'MYTH', factLabel: 'FACT',
    rows: [
      ['PCOD means I can never have a baby.', 'Most women with PCOD conceive, sometimes with treatment.'],
      ['Only overweight women get PCOD.', 'Lean women can have PCOD and insulin resistance too.'],
      ['PCOD is caused by junk food.', 'Genes and hormones come first. Lifestyle helps control it.'],
      ['Regular periods mean no PCOD.', 'You can have PCOD with regular periods. Tests tell.'],
      ['Shaving makes hair grow thicker.', 'It does not. Hair only looks blunt when it regrows.'],
      ['I must give up rice and ghee forever.', 'Portions and balance matter. Crash diets do not work.'],
      ['PCOD goes away after marriage or a baby.', 'It may ease for a while, but needs ongoing care.'],
      ['Pills are the only treatment.', 'Lifestyle is the base. Medicines are chosen for your goal.'],
    ],
  },

  // ---------- page 21 ----------
  p21: {
    kicker: 'QUESTIONS', title: 'Questions and answers',
    qa: [
      ['Is PCOD hereditary?', 'Often it runs in families, but having a relative with PCOD does not mean you will definitely have it.'],
      ['Will I need medicines forever?', 'Not always. Many women improve with lifestyle and need medicines only for certain goals or periods of time.'],
      ['Can PCOD cause cancer?', 'If periods are very rare for years, the womb lining can overgrow. Treating this early protects you.'],
      ['Can I exercise during periods?', 'Yes, gentle activity is fine and may ease cramps.'],
      ['Can I get pregnant without treatment?', 'Some women with PCOD ovulate now and then and conceive naturally. If it has not happened in 6 to 12 months, ask for help.'],
      ['Can stress make PCOD worse?', 'Yes. Stress hormones affect insulin and ovulation. Sleep, movement and talking to someone all help.'],
    ],
    askTitle: 'Questions to ask your doctor',
    ask: [
      'What type of PCOD do I have?',
      'Which tests do I need, and how often?',
      'What are my goals for the next 3 months?',
      'Which medicines, and for how long?',
      'When should I plan a pregnancy?',
    ],
  },

  // ---------- page 22 ----------
  p22: {
    kicker: 'MY TRACKER', title: 'My tracker',
    intro: 'Write down the **first day** of every period. Bring this page to your appointment.',
    heads: ['Period start', 'Days', 'Flow L/M/H', 'Pain 0-10', 'Weight', 'Notes'],
    myMeds: 'My medicines and supplements:',
    nextVisit: 'Next appointment:',
  },

  // ---------- page 23 ----------
  p23: {
    kicker: 'PATIENT STORIES', title: 'Hope blooms from within',
    intro: 'Real stories from women who took the first step.',
    cards: [
      { name: 'Patient name, age', detail: 'Years with PCOD / months with PCOD Xpert', quote: 'Add the patient\'s own words here (with written consent).' },
      { name: 'Patient name, age', detail: 'Years with PCOD / months with PCOD Xpert', quote: 'Add the patient\'s own words here (with written consent).' },
    ],
    photo: 'PHOTO',
  },

  // ---------- page 24 ----------
  back: {
    head1: 'Don\'t ignore PCOD.',
    head2: 'Connect with us.',
    waLine: 'Call or WhatsApp us',
    scan: 'Scan to chat on WhatsApp',
    addrTitle: 'Visit us',
    svcHead: 'PCOD & PCOS care under one roof',
    svcLine: 'Gynecology  |  Endocrinology  |  Dermatology  |  Diet & Nutrition  |  Lab & Ultrasound',
    disclaimerTitle: 'MEDICAL DISCLAIMER',
    disclaimer: 'This booklet is for educational purposes only and is not a substitute for professional medical advice, diagnosis or treatment. Individual results vary. Always consult your doctor before starting or stopping any treatment. Programme details are decided by your treating doctor.',
  },

  // ---------- graphics text ----------
  g: {
    ovaryA: 'Typical ovary', ovaryASub: 'One egg matures each month',
    ovaryB: 'Polycystic ovary', ovaryBSub: 'Many stalled follicles',
    ovaryMature: 'Mature egg', ovaryStalled: 'Stalled follicles',
    cycPeriod: 'PERIOD', cycGrow: 'GROWING', cycOvu: 'OVULATION', cycPrep: 'PREPARING',
    cycDay: 'Day', cycE: 'Estrogen', cycP: 'Progesterone', cycLH: 'LH surge',
    cycPcod: 'In PCOD: no ovulation, no progesterone rise',
    hpoBrain: 'BRAIN', hpoBrainSub: 'Hypothalamus + pituitary', hpoOvary: 'OVARIES', hpoWomb: 'WOMB',
    hpoDown: 'FSH + LH', hpoUp: 'Estrogen + progesterone', hpoFeed: 'Feedback',
    loop: ['Insulin\nresistance', 'High\ninsulin', 'More\nandrogens', 'No\novulation', 'Weight\ngain'],
    loopCenter: 'The PCOD\ncircle',
    stripA: 'Typical: every 21-35 days', stripB: 'Irregular: gaps over 35 days', stripC: 'Missed: 3 months or more',
    stripM: ['Month 1', 'Month 2', 'Month 3'],
    zones: ['Upper lip', 'Chin', 'Chest', 'Upper belly', 'Lower belly', 'Upper arms', 'Thighs'],
    zonesNote: 'Doctors score these areas and the back',
    mTitle: ['Waist', 'Blood pressure', 'Fasting sugar', 'Triglycerides', 'HDL (good) cholesterol'],
    mVal: ['80 cm or more', '130/85 or more', '100 mg/dL or more', '150 mg/dL or more', 'Below 50 mg/dL'],
    mAny: '3 of 5 = metabolic syndrome',
    lockInsulin: 'Insulin\n(key)', lockCell: 'Cell', lockSugar: 'Sugar', lockOk: 'Typical: sugar enters easily', lockBad: 'Resistance: needs more insulin',
    fertSteps: ['Egg grows', 'Ovulation', 'Meets sperm', 'Implants'],
    fertPause: 'PCOD can\npause here',
    fertBar: 'Most women with PCOD can conceive with the right care',
    vennA: 'Irregular or\nno ovulation', vennB: 'High androgens\n(signs or blood)', vennC: 'Polycystic ovaries\non scan', vennAny: 'ANY 2',
    plateVeg: 'Vegetables\nand salad', plateProt: 'Protein', plateGrain: 'Whole\ngrains', plateFat: 'Healthy fats: a spoon of oil, nuts', plateHalf: '1/2', plateQ: '1/4',
    plateProtEx: 'dal, paneer,\negg, curd', plateGrainEx: 'millet roti',
    week: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
    weekAct: ['Walk', 'Strength', 'Yoga', 'Walk', 'Strength', 'Dance', 'Rest'],
    weekNote: '10-minute walk after meals, every day',
    ladder: ['Lifestyle', 'Medicines', 'Ovulation induction', 'IUI / IVF'],
    ladderSub: ['Food, activity, sleep', 'Periods, skin, insulin', 'Tablets or injections', 'Assisted conception'],
    ladderNote: 'Everyone starts at step 1',
    riskCenter: 'Early care\nlowers risk',
    svc: ['Gynecology', 'Endocrinology', 'Dermatology', 'Diet and\nnutrition', 'HBOT*', 'Ozone\ntherapy*', 'Lab', 'Ultrasound'],
    svcCenter: 'PCOD\nXpert',
    svcNote: '*supportive, as advised by your doctor',
    tlM: ['Month 1', 'Month 2', 'Month 3', 'Month 4', 'Month 5', 'Month 6'],
    tlA: ['Assess', 'Act', 'Review', 'Fine-tune', 'Plan', 'Full review'],
    tl3: '3-MONTH', tl6: '6-MONTH',
  },
};

const hi = {
  lang: 'hi',
  brand: 'PCOD Xpert by Hope',
  tagline: 'Hope Blooms from Within',
  phoneDisplay: '+91 62625 06050',
  phoneTel: 'tel:+916262506050',
  wa: 'https://wa.me/916262506050',
  address: ['सहज हॉस्पिटल कैंपस', '15/2 साउथ तुकोगंज, मानस भवन के पास,', 'होटल सूर्या के पीछे, इंदौर,', 'मध्य प्रदेश 452005'],
  footer: 'PCOD Xpert by Hope  |  +91 62625 06050',

  cover: {
    kicker: 'रोगी मार्गदर्शिका',
    title1: 'सब कुछ जानिए',
    title2: 'PCOD और PCOS',
    sub: 'महिलाओं, किशोरियों और परिवारों के लिए एक सरल, चित्रों वाली गाइड',
    chips: ['हार्मोन', 'पीरियड्स', 'फर्टिलिटी', 'त्वचा और बाल', 'मेटाबॉलिज़्म'],
  },

  p2: {
    kicker: 'यहाँ से शुरू करें', title: 'स्वागत है',
    lead: 'अगर आपको बताया गया है कि आपको **PCOD या PCOS** है, तो आप अकेली नहीं हैं। प्रजनन आयु की लगभग **हर 5 में से 1** महिला को यह होता है। यह आम है, इसे संभाला जा सकता है, और इसे समझना पहला कदम है।',
    howTitle: 'इस पुस्तिका का उपयोग कैसे करें',
    how: [
      'एक बार में एक पेज पढ़ें। हर पेज एक चित्र के साथ एक बात समझाता है।',
      '**लक्षण डिकोडर** (पेज 13) से समझें कि आपका शरीर क्या बता रहा है।',
      '**ट्रैकर** (पेज 22) भरें और अपॉइंटमेंट पर साथ लाएँ।',
    ],
    teenTitle: 'किशोरियों और माता-पिता के लिए',
    teen: 'पहले पीरियड के बाद के 2 से 3 साल में अनियमित पीरियड्स आम हैं। डॉक्टर देख सकते हैं कि शरीर अभी बस सेट हो रहा है, या इलाज की ज़रूरत है।',
    tocTitle: 'इस पुस्तिका में',
    toc: [
      ['3', 'PCOD और PCOS क्या हैं?'],
      ['4', 'आपका मासिक चक्र'],
      ['5', 'हार्मोन'],
      ['6', 'PCOD क्यों होता है'],
      ['7', 'ध्यान देने योग्य लक्षण'],
      ['8', 'पीरियड्स: सामान्य या नहीं?'],
      ['9', 'बाल, मुँहासे और बाल झड़ना'],
      ['10', 'इंसुलिन और मेटाबॉलिक सिंड्रोम'],
      ['11', 'फर्टिलिटी और गर्भावस्था'],
      ['12', 'PCOD की जाँच कैसे होती है'],
      ['13', 'लक्षण डिकोडर'],
      ['14', 'सही खान-पान'],
      ['15', 'चलें, सोएँ, शांत रहें'],
      ['16', 'इलाज के विकल्प'],
      ['17', 'मन और दीर्घकालिक स्वास्थ्य'],
      ['18', 'हमारी PCOD Xpert टीम'],
      ['19', '3 और 6 महीने के प्रोग्राम'],
      ['20', 'मिथक और तथ्य'],
      ['21', 'सवाल और जवाब'],
      ['22', 'मेरा ट्रैकर'],
      ['23', 'मरीज़ों की कहानियाँ'],
      ['24', 'संपर्क करें'],
    ],
  },

  p3: {
    kicker: 'बुनियादी बातें', title: 'PCOD और PCOS क्या हैं?',
    intro: 'आपके अंडाशय (ओवरी) में अंडे छोटी, तरल भरी थैलियों में रहते हैं जिन्हें **फॉलिकल** कहते हैं। हर महीने आमतौर पर एक फॉलिकल बढ़ता है, परिपक्व होता है और अंडा छोड़ता है। PCOD/PCOS में कई फॉलिकल बढ़ना शुरू करते हैं पर **रुक जाते हैं**, इसलिए अंडा समय पर नहीं निकलता।',
    callTitle: 'ये "सिस्ट" नहीं हैं जिन्हें निकालना पड़े',
    call: 'स्कैन में दिखने वाले छोटे बिंदु रुके हुए फॉलिकल हैं, हानिकारक सिस्ट नहीं। ये कैंसर में नहीं बदलते और आमतौर पर ऑपरेशन की ज़रूरत नहीं होती।',
    cmpTitle: 'PCOD बनाम PCOS: क्या फ़र्क है?',
    cmpRows: [
      ['PCOD', 'पॉलीसिस्टिक ओवेरियन डिज़ीज़: आम बोलचाल का नाम। अक्सर "हल्का" माना जाता है।'],
      ['PCOS', 'पॉलीसिस्टिक ओवरी सिंड्रोम: मेडिकल नाम। अक्सर "गंभीर" माना जाता है।'],
    ],
    cmpNote: 'आज डॉक्टर एक ही शब्द **PCOS** इस्तेमाल करते हैं और इसे एक **स्पेक्ट्रम** मानते हैं। किसी में लक्षण हल्के होते हैं, किसी में ज़्यादा। नाम से ज़्यादा ज़रूरी हैं आपके लक्षण, जाँचें और स्वास्थ्य जोखिम।',
    factsTitle: 'जानना ज़रूरी है',
    facts: [
      '**यह आपकी गलती नहीं है।** जीन, हार्मोन और इंसुलिन की भूमिका होती है।',
      '**यह छूत की बीमारी नहीं है** और किसी एक खाने या आदत से नहीं होती।',
      '**इसे संभाला जा सकता है।** सही देखभाल से ज़्यादातर लक्षण सुधरते हैं।',
    ],
  },

  p4: {
    kicker: 'आपका शरीर', title: 'आपका मासिक चक्र',
    intro: 'सामान्य चक्र आपके मस्तिष्क, अंडाशय और गर्भाशय के बीच **हार्मोन का नृत्य** है। दिन 1 यानी ब्लीडिंग का पहला दिन।',
    phases: [
      ['पीरियड', 'दिन 1-5', 'गर्भाशय की परत ब्लीडिंग के रूप में निकलती है।'],
      ['बढ़ना', 'दिन 1-13', 'अंडे की थैलियाँ बढ़ती हैं। एस्ट्रोजन बढ़कर परत बनाता है।'],
      ['ओव्यूलेशन', 'लगभग दिन 14', 'LH का उछाल अंडा छोड़ता है।'],
      ['तैयारी', 'दिन 15-28', 'प्रोजेस्टेरोन गर्भाशय को तैयार करता है। गर्भ नहीं ठहरा तो पीरियड आता है।'],
    ],
    callTitle: 'PCOD में क्या बदलता है?',
    call: 'अंडा अक्सर **निकलता ही नहीं**। ओव्यूलेशन के बिना प्रोजेस्टेरोन नहीं बढ़ता, इसलिए पीरियड्स **देर से, छूटे हुए या भारी** हो जाते हैं और गर्भधारण में समय लगता है।',
  },

  p5: {
    kicker: 'आपका शरीर', title: 'हार्मोन',
    intro: 'हार्मोन रासायनिक संदेशवाहक हैं। मस्तिष्क अंडाशय को संदेश भेजता है और अंडाशय वापस संदेश भेजते हैं। PCOD में यह बातचीत असंतुलित हो जाती है।',
    cards: [
      ['FSH', 'हर महीने अंडे की थैली को बढ़ाता है।'],
      ['LH', 'अंडा निकलने का संकेत देता है। PCOD में अक्सर ज़्यादा।'],
      ['एस्ट्रोजन', 'गर्भाशय की परत बनाता है। त्वचा और हड्डियों के लिए ज़रूरी।'],
      ['प्रोजेस्टेरोन', 'ओव्यूलेशन के बाद गर्भाशय तैयार करता है। PCOD में कम।'],
      ['एंड्रोजन', 'हर महिला में थोड़े बनते हैं। PCOD में ज़्यादा: मुँहासे, बाल।'],
      ['इंसुलिन', 'शुगर को कोशिकाओं में पहुँचाता है। PCOD में अक्सर ज़्यादा।'],
    ],
    note: '**थायरॉइड और प्रोलैक्टिन** की गड़बड़ी भी PCOD जैसी लग सकती है। इसलिए हम इनकी जाँच भी हमेशा करते हैं।',
  },

  p6: {
    kicker: 'कारण', title: 'PCOD क्यों होता है?',
    intro: 'इसका कोई एक कारण नहीं है। कई बातें मिलकर एक-दूसरे को बढ़ाती हैं, एक चक्र की तरह।',
    causesTitle: 'क्या-क्या जुड़ता है',
    causes: [
      '**पारिवारिक इतिहास:** माँ, बहन या मौसी को PCOD या डायबिटीज़।',
      '**इंसुलिन रेज़िस्टेंस:** कोशिकाएँ इंसुलिन पर कम प्रतिक्रिया देती हैं।',
      '**अतिरिक्त एंड्रोजन:** अंडाशय और एड्रिनल ग्रंथि ज़्यादा बनाती हैं।',
      '**जीवनशैली:** कम गतिविधि, कम नींद, तनाव और बढ़ा वज़न इसे बिगाड़ सकते हैं।',
    ],
    callTitle: 'अच्छी खबर',
    call: 'आप इस चक्र को **किसी भी जगह** तोड़ सकती हैं। अगर वज़न ज़्यादा है, तो शरीर के वज़न का सिर्फ **5 से 10%** घटाने से भी नियमित ओव्यूलेशन और पीरियड्स लौट सकते हैं।',
  },

  p7: {
    kicker: 'लक्षण', title: 'ध्यान देने योग्य लक्षण',
    intro: 'हो सकता है आपको इनमें से कुछ ही हों। हर महिला अलग होती है। नंबर चित्र से मिलाएँ।',
    items: [
      'माँग (पार्टिंग) पर बाल पतले होना',
      'मुँहासे और तैलीय त्वचा',
      'ठुड्डी, ऊपरी होंठ पर ज़्यादा गहरे बाल',
      'गर्दन, बगल में गहरे, मखमली दाग',
      'वज़न बढ़ना, खासकर पेट के आसपास',
      'अनियमित, छूटे या भारी पीरियड्स',
      'गर्भधारण में कठिनाई',
      'उदासी, चिंता, थकान, कम नींद',
    ],
    note: 'अगर इनमें से **दो या ज़्यादा** दिखें, या कोई एक परेशान कर रहा हो, तो डॉक्टर से मिलें।',
  },

  p8: {
    kicker: 'लक्षण', title: 'पीरियड्स: सामान्य या नहीं?',
    intro: 'पीरियड्स आपके हार्मोन का मासिक रिपोर्ट कार्ड हैं। इसे ऐसे पढ़ें।',
    rows: [
      ['green', 'सामान्य', 'हर **21 से 35 दिन** में पीरियड। ब्लीडिंग **2 से 7 दिन**। पैड 3 से 4 घंटे या उससे कम बार बदलना।'],
      ['amber', 'जाँच करवाएँ', 'चक्र **35 दिन से लंबा**, साल में 8 से कम पीरियड, महीने छूटना, बीच में स्पॉटिंग।'],
      ['red', 'जल्दी डॉक्टर से मिलें', '**3 महीने से पीरियड नहीं** (गर्भ भी नहीं)। 2 घंटे तक हर घंटे पैड भीगना। बड़े थक्के। 7 दिन से ज़्यादा ब्लीडिंग। तेज़ दर्द।'],
    ],
    whyTitle: 'छूटे पीरियड्स क्यों मायने रखते हैं',
    why: 'अगर कई महीने पीरियड न आए, तो गर्भाशय की परत मोटी होती रह सकती है। सालों में इससे भारी ब्लीडिंग और कभी-कभी परत में गंभीर बदलाव हो सकते हैं। डॉक्टर इसे बचाने का सरल इलाज दे सकते हैं।',
    teenTitle: 'किशोरियों के लिए',
    teen: '15 साल तक पीरियड न आए, या स्तन विकास शुरू होने के 3 साल बाद भी न आए, तो डॉक्टर को दिखाएँ।',
  },

  p9: {
    kicker: 'लक्षण', title: 'बाल, मुँहासे और बाल झड़ना',
    intro: 'एंड्रोजन कुछ बालों की जड़ों को मोटे, गहरे बाल उगाने पर मजबूर करते हैं और तेल ग्रंथियों को सक्रिय करते हैं। सिर की जड़ें कमज़ोर हो जाती हैं।',
    cols: [
      ['ज़्यादा बाल', 'हर्सुटिज़्म', 'ऊपरी होंठ, ठुड्डी, छाती, पेट, पीठ या जाँघों पर मोटे, गहरे बाल। यह ज़्यादातर महिलाओं के हल्के, महीन रोओं से अलग है।'],
      ['मुँहासे', '', 'जबड़े, ठुड्डी और निचले चेहरे पर दर्दभरे दाने। पीरियड से पहले बढ़ते हैं और दाग छोड़ सकते हैं।'],
      ['बाल झड़ना', '', 'माँग चौड़ी होती है और ऊपर से बाल पतले लगते हैं। आगे की हेयरलाइन आमतौर पर बनी रहती है।'],
    ],
    tipsTitle: 'क्या मदद करता है',
    tips: [
      'इलाज का असर **3 से 6 महीने** में दिखता है। बाल धीरे बढ़ते हैं।',
      'दवाएँ **नए** बाल और मुँहासे घटाती हैं। लेज़र या इलेक्ट्रोलिसिस मौजूदा बाल हटाते हैं।',
      'शेविंग या थ्रेडिंग से बाल मोटे **नहीं** होते।',
      '**आयरन, थायरॉइड और विटामिन D** भी जाँचें। इनकी कमी से भी बाल झड़ते हैं।',
    ],
  },

  p10: {
    kicker: 'मेटाबॉलिज़्म', title: 'इंसुलिन और मेटाबॉलिक सिंड्रोम',
    keyTitle: 'इंसुलिन रेज़िस्टेंस',
    key: 'इंसुलिन एक **चाबी** है जो शुगर को कोशिकाओं में जाने देती है। जब ताला कड़ा हो जाए, तो शरीर **और चाबियाँ** बनाता है। ज़्यादा इंसुलिन अंडाशय को ज़्यादा एंड्रोजन बनाने को कहता है।',
    signs: 'संकेत: गर्दन के गहरे दाग, स्किन टैग, मीठे की चाहत, पेट की चर्बी, खाने के बाद नींद। **दुबली महिलाओं को भी हो सकता है।**',
    msTitle: 'मेटाबॉलिक सिंड्रोम',
    msIntro: 'यानी इन 5 में से **3 या ज़्यादा** मौजूद हैं। इससे डायबिटीज़ और हृदय रोग का जोखिम बढ़ता है।',
    msNote: 'जाँच के लिए एक साधारण ब्लड टेस्ट और इंच टेप काफ़ी है। जल्दी कदम उठाने से इसे पलटा जा सकता है।',
  },

  p11: {
    kicker: 'फर्टिलिटी', title: 'PCOD और गर्भधारण',
    intro: 'PCOD **ओव्यूलेशन की समस्याओं** का सबसे आम कारण है। इसका मतलब यह **नहीं** कि आप माँ नहीं बन सकतीं। PCOD वाली ज़्यादातर महिलाएँ गर्भधारण करती हैं, कभी-कभी चिकित्सा मदद से।',
    whyTitle: 'देर क्यों लग सकती है',
    why: [
      'अंडा नियमित रूप से परिपक्व या मुक्त नहीं हो पाता।',
      'ज़्यादा इंसुलिन और एंड्रोजन चक्र बिगाड़ते हैं।',
      'अन्य कारण (नलियाँ, गर्भाशय, पति के शुक्राणु) साथ में जाँचे जाते हैं।',
    ],
    whenTitle: 'मदद कब लें',
    when: [
      '**12 महीने** कोशिश के बाद (35 साल से कम)।',
      '**6 महीने** कोशिश के बाद (35 साल या ज़्यादा)।',
      'पीरियड्स बहुत अनियमित या बंद हों तो **जल्दी**।',
    ],
    tipsTitle: 'गर्भावस्था से पहले और दौरान',
    tips: 'सलाह अनुसार **फोलिक एसिड** शुरू करें, सही वज़न रखें, धूम्रपान और शराब छोड़ें। PCOD में **गर्भावधि डायबिटीज़ और हाई BP** की संभावना ज़्यादा होती है, इसलिए शुरू से जाँच ज़रूरी है।',
  },

  p12: {
    kicker: 'निदान', title: 'PCOD की जाँच कैसे होती है',
    intro: 'कोई एक टेस्ट नहीं है। अन्य बीमारियाँ हटाने के बाद डॉक्टर इन 3 में से **कोई 2** संकेत देखते हैं।',
    testsTitle: 'जो जाँचें सुझाई जा सकती हैं',
    tests: [
      ['ब्लड', 'LH, FSH, टेस्टोस्टेरोन, DHEAS, प्रोलैक्टिन, TSH, AMH'],
      ['शुगर', 'HbA1c या फास्टिंग शुगर, शुगर टॉलरेंस टेस्ट, इंसुलिन'],
      ['हृदय', 'कोलेस्ट्रॉल और ट्राइग्लिसराइड, ब्लड प्रेशर'],
      ['विटामिन', 'विटामिन D, B12, आयरन, लिवर टेस्ट'],
      ['स्कैन', 'अंडाशय और गर्भाशय की परत का पेल्विक अल्ट्रासाउंड'],
      ['शरीर', 'वज़न, कमर, BMI, त्वचा और बालों की जाँच'],
    ],
    teen: '**किशोरियाँ:** पीरियड शुरू होने के पहले 8 साल में सिर्फ़ स्कैन से PCOD का निदान नहीं किया जाता।',
  },

  p13: {
    kicker: 'लक्षण डिकोडर', title: 'इसका मतलब क्या है?',
    heads: ['आप क्या देखती हैं', 'इसका मतलब हो सकता है', 'क्या करें'],
    rows: [
      ['35 दिन से ज़्यादा के अंतर पर या छूटे पीरियड', 'नियमित ओव्यूलेशन नहीं हो रहा', 'तारीख़ लिखें, डॉक्टर से मिलें'],
      ['बहुत भारी पीरियड, थक्के', 'मोटी परत, फाइब्रॉइड या थायरॉइड', 'जल्दी डॉक्टर से मिलें'],
      ['जबड़े और ठुड्डी पर मुँहासे', 'ज़्यादा एंड्रोजन', 'हार्मोन और त्वचा जाँच'],
      ['ठुड्डी या छाती पर नए गहरे बाल', 'ज़्यादा एंड्रोजन', 'हार्मोन टेस्ट'],
      ['माँग पर बाल पतले', 'एंड्रोजन, कम आयरन, थायरॉइड', 'ब्लड टेस्ट'],
      ['गर्दन पर मखमली गहरे दाग', 'इंसुलिन रेज़िस्टेंस', 'शुगर और इंसुलिन टेस्ट'],
      ['पेट पर वज़न, मीठे की चाहत', 'इंसुलिन रेज़िस्टेंस', 'डाइट और गतिविधि योजना'],
      ['थकान, खर्राटे, कम नींद', 'स्लीप एपनिया, थायरॉइड, एनीमिया', 'डॉक्टर जाँच'],
      ['उदासी, लगातार चिंता', 'PCOD में आम', 'किसी से बात करें, काउंसलिंग'],
      ['6 से 12 महीने में गर्भ नहीं', 'ओव्यूलेशन की समस्या', 'फर्टिलिटी परामर्श'],
    ],
    redTitle: 'तुरंत मदद लें अगर',
    red: 'पेट के निचले हिस्से में तेज़ दर्द, बेहोशी, बहुत भारी ब्लीडिंग, सीने में दर्द या साँस फूलना, या **अचानक** आवाज़ भारी होना और बाल तेज़ी से बढ़ना।',
  },

  p14: {
    kicker: 'जीवनशैली', title: 'PCOD में सही खान-पान',
    intro: 'कोई एक "PCOD डाइट" नहीं होती। लक्ष्य है शुगर का स्तर स्थिर रखना। दोपहर और रात के खाने में नीचे दी थाली अपनाएँ।',
    moreTitle: 'ज़्यादा खाएँ',
    more: [
      'मिलेट: ज्वार, बाजरा, रागी',
      'दालें, अंकुरित अनाज, चना, राजमा',
      'सब्ज़ियाँ और सलाद',
      'दही, पनीर, अंडा, मछली',
      'मेवे, बीज, अमरूद, सेब',
    ],
    lessTitle: 'कम खाएँ',
    less: [
      'मैदा, बिस्किट, सफ़ेद ब्रेड',
      'चीनी, मिठाई, कोल्ड ड्रिंक',
      'पैकेट वाले और तले स्नैक्स',
      'सफ़ेद चावल की बड़ी मात्रा',
      'रात को देर से भारी खाना',
    ],
    habitsTitle: 'छोटी आदतें जो मदद करती हैं',
    habits: [
      'हर भोजन में प्रोटीन, खासकर नाश्ते में।',
      'शुगर घटाने के लिए खाने के बाद 10 मिनट टहलें।',
      '2 से 3 लीटर पानी पिएँ।',
      'क्रैश डाइट से बचें। ये उलटा असर करती हैं।',
    ],
  },

  p15: {
    kicker: 'जीवनशैली', title: 'चलें, सोएँ, शांत रहें',
    intro: 'चलने-फिरने से कोशिकाएँ फिर से इंसुलिन की सुनने लगती हैं। अच्छी नींद और शांति भूख और तनाव के हार्मोन संतुलित करती हैं।',
    cols: [
      ['चलें', 'हफ़्ते में **150 मिनट** तेज़ चलना, साइकिल, तैराकी या डांस, और **2 दिन स्ट्रेंथ** एक्सरसाइज़। 10 मिनट भी गिने जाते हैं।'],
      ['सोएँ', 'रोज़ एक समय पर **7 से 9 घंटे**। सोने से 1 घंटा पहले स्क्रीन बंद। अँधेरा, ठंडा कमरा।'],
      ['शांत रहें', 'रोज़ 10 मिनट **योग, प्राणायाम या ध्यान**। शौक और दोस्तों के लिए समय।'],
    ],
    note: '**छोटी शुरुआत करें।** इस हफ़्ते एक आदत चुनें। निभ सकने वाले छोटे कदम, छूट जाने वाली बड़ी योजनाओं से बेहतर हैं।',
  },

  p16: {
    kicker: 'इलाज', title: 'इलाज के विकल्प',
    intro: 'इलाज इस पर निर्भर है कि **आप क्या चाहती हैं**: नियमित पीरियड्स, साफ़ त्वचा, कम बाल, या बच्चा। आपके डॉक्टर आपकी योजना बनाएँगे।',
    heads: ['आपका लक्ष्य', 'डॉक्टर ये विकल्प चुन सकते हैं'],
    rows: [
      ['नियमित पीरियड्स, गर्भाशय की सुरक्षा', 'हार्मोनल गोलियाँ या प्रोजेस्टेरोन कोर्स'],
      ['इंसुलिन रेज़िस्टेंस, वज़न', 'पोषण योजना, गतिविधि, सलाह अनुसार मेटफॉर्मिन और अन्य दवाएँ'],
      ['मुँहासे, ज़्यादा बाल, बाल झड़ना', 'एंटी-एंड्रोजन दवाएँ, त्वचा उपचार, लेज़र'],
    ],
    fertTitle: 'अगर लक्ष्य गर्भधारण है',
    fertRows: [
      ['ओव्यूलेशन की गोलियाँ', 'चक्र की शुरुआत में कुछ दिन की गोलियाँ अंडे को बढ़ने और निकलने में मदद करती हैं। अक्सर पहला कदम।'],
      ['इंजेक्शन', 'जब गोलियाँ काफ़ी न हों। स्कैन से अंडे की वृद्धि देखी जाती है।'],
      ['IUI', 'ओव्यूलेशन के समय तैयार किए गए शुक्राणु गर्भाशय में रखे जाते हैं।'],
      ['IVF / ICSI', 'अंडे निकालकर लैब में निषेचित किए जाते हैं और भ्रूण गर्भाशय में रखा जाता है। पहले के कदम विफल हों या अन्य कारण हों तब।'],
    ],
    note: '**ज़रूरी:** दवाएँ और सप्लीमेंट (इनोसिटोल, विटामिन D सहित) सिर्फ़ डॉक्टर की सलाह पर लें। कोई दवा स्वस्थ आदतों की जगह नहीं ले सकती।',
  },

  p17: {
    kicker: 'सेहत', title: 'मन और दीर्घकालिक स्वास्थ्य',
    mindTitle: 'आपकी भावनाएँ असली हैं',
    mind: 'PCOD में चिंता, उदासी और शारीरिक छवि की फ़िक्र **2 से 3 गुना ज़्यादा** आम है। यह कमज़ोरी नहीं है। हार्मोन और इंसुलिन की भूमिका होती है। बात करने से मदद मिलती है। काउंसलिंग के बारे में हमसे पूछें।',
    riskTitle: 'संभावित दीर्घकालिक जोखिम',
    risks: ['टाइप 2 डायबिटीज़', 'हृदय रोग और हाई BP', 'फैटी लिवर', 'स्लीप एपनिया', 'गर्भाशय परत का मोटा होना', 'अवसाद और चिंता'],
    helpTitle: 'मदद कब माँगें',
    help: 'दो हफ़्ते से ज़्यादा चलने वाली उदासी या चिंता, घबराहट के दौरे, रोज़मर्रा की चीज़ों में रुचि खत्म होना, या नींद और भूख में गड़बड़ी। अगर कभी खुद को नुकसान पहुँचाने के विचार आएँ, तो तुरंत किसी को बताएँ और मदद लें। निःशुल्क हेल्पलाइन: **टेली-मानस 14416** (24x7)।',
    goodTitle: 'खुद को सुरक्षित रखें',
    good: [
      '**हर साल ब्लड प्रेशर, शुगर और कोलेस्ट्रॉल** जाँचें।',
      '**कम से कम हर 3 महीने में एक पीरियड** का लक्ष्य रखें।',
      'सक्रिय रहें, अच्छा खाएँ, अच्छा सोएँ।',
      'जल्दी देखभाल से ये जोखिम बहुत घटते हैं।',
    ],
  },

  p18: {
    kicker: 'हमारी टीम', title: 'सब कुछ एक ही छत के नीचे',
    intro: 'PCOD शरीर के कई हिस्सों को छूता है, इसलिए अक्सर एक डॉक्टर काफ़ी नहीं होता। PCOD Xpert में एक **बहु-विशेषज्ञ टीम** परामर्श से लेकर जाँचों तक, एक ही कैंपस में आपकी योजना पर साथ काम करती है।',
    whyTitle: 'एक छत के नीचे क्यों बेहतर है',
    why: [
      '**एक योजना** जिस पर सभी विशेषज्ञ साथ काम करते हैं।',
      '**जाँचें और स्कैन** उसी कैंपस में।',
      '**कम चक्कर**, साफ़ फ़ॉलो-अप और एक टीम जिसे कॉल कर सकें।',
    ],
    callTitle: 'सहायक थेरेपी',
    call: 'HBOT और ओज़ोन थेरेपी सिर्फ़ आपके डॉक्टर की सलाह पर **अतिरिक्त सहायक विकल्प** के रूप में दी जाती हैं। PCOS में इनकी भूमिका पर शोध अभी जारी है। ये जीवनशैली, दवाओं या फर्टिलिटी देखभाल की जगह नहीं लेतीं।',
  },

  p19: {
    kicker: 'हमारे प्रोग्राम', title: '3 और 6 महीने के प्रोग्राम',
    intro: 'नियमित समीक्षा के साथ एक व्यवस्थित सफ़र, ताकि आप PCOD को अकेले न संभालें।',
    m3Title: '3 महीने का प्रोग्राम',
    m3: [
      ['महीना 1', 'जाँच और योजना', 'स्त्री रोग, एंडोक्राइन, त्वचा और डाइट परामर्श। ब्लड टेस्ट और अल्ट्रासाउंड। आपकी निजी योजना।'],
      ['महीना 2', 'अमल और सुधार', 'डाइट और एक्सरसाइज़ कोचिंग। ज़रूरत अनुसार दवाएँ और त्वचा/बालों की देखभाल। फ़ॉलो-अप।'],
      ['महीना 3', 'समीक्षा', 'माप और जाँचें दोहराना। प्रगति की जाँच और आगे की योजना।'],
    ],
    m6Title: '6 महीने का प्रोग्राम',
    m6: '3 महीने के प्रोग्राम की सब बातें, और **महीना 4 से 6**: मासिक चेक-इन, दवाओं में सुधार, चाहें तो फर्टिलिटी योजना, त्वचा और बालों की देखभाल के चक्र, और आपकी जाँचों व दीर्घकालिक स्वास्थ्य योजना की पूरी समीक्षा।',
    note: 'आपकी ज़रूरत के अनुसार हर प्रोग्राम में क्या शामिल है, हमारी टीम से पूछें।',
  },

  p20: {
    kicker: 'मिथक और तथ्य', title: 'मिथक और तथ्य',
    mythLabel: 'मिथक', factLabel: 'तथ्य',
    rows: [
      ['PCOD का मतलब मैं कभी माँ नहीं बन सकती।', 'PCOD वाली ज़्यादातर महिलाएँ गर्भधारण करती हैं, कभी-कभी इलाज से।'],
      ['PCOD सिर्फ़ मोटी महिलाओं को होता है।', 'दुबली महिलाओं को भी PCOD और इंसुलिन रेज़िस्टेंस हो सकता है।'],
      ['PCOD जंक फ़ूड से होता है।', 'पहले जीन और हार्मोन आते हैं। जीवनशैली इसे काबू में रखने में मदद करती है।'],
      ['नियमित पीरियड्स यानी PCOD नहीं।', 'नियमित पीरियड्स में भी PCOD हो सकता है। जाँच से पता चलता है।'],
      ['शेविंग से बाल मोटे उगते हैं।', 'ऐसा नहीं है। दोबारा उगते बाल सिर्फ़ खुरदुरे लगते हैं।'],
      ['चावल और घी हमेशा के लिए छोड़ने होंगे।', 'मात्रा और संतुलन मायने रखते हैं। क्रैश डाइट काम नहीं करती।'],
      ['शादी या बच्चे के बाद PCOD ठीक हो जाता है।', 'कुछ समय राहत हो सकती है, पर लगातार देखभाल चाहिए।'],
      ['गोलियाँ ही इकलौता इलाज हैं।', 'जीवनशैली आधार है। दवाएँ आपके लक्ष्य के अनुसार चुनी जाती हैं।'],
    ],
  },

  p21: {
    kicker: 'सवाल', title: 'सवाल और जवाब',
    qa: [
      ['क्या PCOD आनुवंशिक है?', 'अक्सर परिवारों में चलता है, पर रिश्तेदार को PCOD होने का मतलब यह नहीं कि आपको ज़रूर होगा।'],
      ['क्या दवाएँ हमेशा लेनी होंगी?', 'हमेशा नहीं। कई महिलाएँ जीवनशैली से सुधरती हैं और दवाएँ सिर्फ़ कुछ लक्ष्यों या कुछ समय के लिए लगती हैं।'],
      ['क्या PCOD से कैंसर हो सकता है?', 'अगर सालों तक पीरियड बहुत कम आएँ, तो गर्भाशय की परत ज़्यादा बढ़ सकती है। जल्दी इलाज से आप सुरक्षित रहती हैं।'],
      ['क्या पीरियड्स में एक्सरसाइज़ कर सकती हूँ?', 'हाँ, हल्की गतिविधि ठीक है और ऐंठन में आराम दे सकती है।'],
      ['क्या बिना इलाज के गर्भधारण हो सकता है?', 'PCOD में कुछ महिलाओं में कभी-कभी ओव्यूलेशन होता है और वे स्वाभाविक रूप से गर्भवती हो जाती हैं। 6 से 12 महीने में न हो तो मदद लें।'],
      ['क्या तनाव से PCOD बिगड़ता है?', 'हाँ। तनाव के हार्मोन इंसुलिन और ओव्यूलेशन को प्रभावित करते हैं। नींद, व्यायाम और किसी से बात करना मदद करते हैं।'],
    ],
    askTitle: 'डॉक्टर से पूछने के सवाल',
    ask: [
      'मुझे किस तरह का PCOD है?',
      'कौन सी जाँचें, और कितनी बार?',
      'अगले 3 महीनों के लिए मेरे लक्ष्य क्या हैं?',
      'कौन सी दवाएँ, और कितने समय तक?',
      'गर्भधारण की योजना कब बनाऊँ?',
    ],
  },

  p22: {
    kicker: 'मेरा ट्रैकर', title: 'मेरा ट्रैकर',
    intro: 'हर पीरियड का **पहला दिन** लिखें। अपॉइंटमेंट पर यह पेज साथ लाएँ।',
    heads: ['पीरियड शुरू', 'दिन', 'फ़्लो कम/मध्यम/ज़्यादा', 'दर्द 0-10', 'वज़न', 'नोट्स'],
    myMeds: 'मेरी दवाएँ और सप्लीमेंट:',
    nextVisit: 'अगला अपॉइंटमेंट:',
  },

  p23: {
    kicker: 'मरीज़ों की कहानियाँ', title: 'उम्मीद भीतर से खिलती है',
    intro: 'उन महिलाओं की सच्ची कहानियाँ जिन्होंने पहला कदम उठाया।',
    cards: [
      { name: 'मरीज़ का नाम, उम्र', detail: 'PCOD के साथ वर्ष / PCOD Xpert के साथ महीने', quote: 'यहाँ मरीज़ के अपने शब्द जोड़ें (लिखित सहमति के साथ)।' },
      { name: 'मरीज़ का नाम, उम्र', detail: 'PCOD के साथ वर्ष / PCOD Xpert के साथ महीने', quote: 'यहाँ मरीज़ के अपने शब्द जोड़ें (लिखित सहमति के साथ)।' },
    ],
    photo: 'फ़ोटो',
  },

  back: {
    head1: 'PCOD को नज़रअंदाज़ न करें।',
    head2: 'हमसे जुड़ें।',
    waLine: 'कॉल या WhatsApp करें',
    scan: 'WhatsApp पर चैट के लिए स्कैन करें',
    addrTitle: 'हमसे मिलें',
    svcHead: 'PCOD और PCOS की देखभाल, एक ही छत के नीचे',
    svcLine: 'स्त्री रोग  |  एंडोक्राइनोलॉजी  |  त्वचा रोग  |  डाइट और पोषण  |  लैब और अल्ट्रासाउंड',
    disclaimerTitle: 'चिकित्सकीय अस्वीकरण',
    disclaimer: 'यह पुस्तिका केवल शैक्षणिक उद्देश्य के लिए है और पेशेवर चिकित्सा सलाह, निदान या उपचार का विकल्प नहीं है। परिणाम हर व्यक्ति में अलग होते हैं। कोई भी इलाज शुरू या बंद करने से पहले हमेशा अपने डॉक्टर से सलाह लें। प्रोग्राम का विवरण आपके उपचारकर्ता डॉक्टर तय करते हैं।',
  },

  g: {
    ovaryA: 'सामान्य अंडाशय', ovaryASub: 'हर महीने एक अंडा परिपक्व होता है',
    ovaryB: 'पॉलीसिस्टिक अंडाशय', ovaryBSub: 'कई रुके हुए फॉलिकल',
    ovaryMature: 'परिपक्व अंडा', ovaryStalled: 'रुके हुए फॉलिकल',
    cycPeriod: 'पीरियड', cycGrow: 'बढ़ना', cycOvu: 'ओव्यूलेशन', cycPrep: 'तैयारी',
    cycDay: 'दिन', cycE: 'एस्ट्रोजन', cycP: 'प्रोजेस्टेरोन', cycLH: 'LH उछाल',
    cycPcod: 'PCOD में: ओव्यूलेशन नहीं, प्रोजेस्टेरोन नहीं बढ़ता',
    hpoBrain: 'मस्तिष्क', hpoBrainSub: 'हाइपोथैलेमस + पिट्यूटरी', hpoOvary: 'अंडाशय', hpoWomb: 'गर्भाशय',
    hpoDown: 'FSH + LH', hpoUp: 'एस्ट्रोजन + प्रोजेस्टेरोन', hpoFeed: 'फीडबैक',
    loop: ['इंसुलिन\nरेज़िस्टेंस', 'ज़्यादा\nइंसुलिन', 'ज़्यादा\nएंड्रोजन', 'ओव्यूलेशन\nनहीं', 'वज़न\nबढ़ना'],
    loopCenter: 'PCOD\nका चक्र',
    stripA: 'सामान्य: हर 21-35 दिन', stripB: 'अनियमित: 35 दिन से ज़्यादा अंतर', stripC: 'छूटे: 3 महीने या ज़्यादा',
    stripM: ['महीना 1', 'महीना 2', 'महीना 3'],
    zones: ['ऊपरी होंठ', 'ठुड्डी', 'छाती', 'ऊपरी पेट', 'निचला पेट', 'ऊपरी बाँह', 'जाँघें'],
    zonesNote: 'डॉक्टर इन जगहों और पीठ को अंक देते हैं',
    mTitle: ['कमर', 'ब्लड प्रेशर', 'फास्टिंग शुगर', 'ट्राइग्लिसराइड', 'HDL (अच्छा) कोलेस्ट्रॉल'],
    mVal: ['80 सेमी या ज़्यादा', '130/85 या ज़्यादा', '100 mg/dL या ज़्यादा', '150 mg/dL या ज़्यादा', '50 mg/dL से कम'],
    mAny: '5 में से 3 = मेटाबॉलिक सिंड्रोम',
    lockInsulin: 'इंसुलिन\n(चाबी)', lockCell: 'कोशिका', lockSugar: 'शुगर', lockOk: 'सामान्य: शुगर आसानी से अंदर', lockBad: 'रेज़िस्टेंस: ज़्यादा इंसुलिन लगता है',
    fertSteps: ['अंडा बढ़ता है', 'ओव्यूलेशन', 'शुक्राणु से मिलन', 'गर्भाशय में जमना'],
    fertPause: 'PCOD यहाँ\nरोक सकता है',
    fertBar: 'सही देखभाल से PCOD वाली ज़्यादातर महिलाएँ गर्भधारण कर सकती हैं',
    vennA: 'अनियमित या\nबिना ओव्यूलेशन', vennB: 'ज़्यादा एंड्रोजन\n(लक्षण या ब्लड)', vennC: 'स्कैन में\nपॉलीसिस्टिक अंडाशय', vennAny: 'कोई 2',
    plateVeg: 'सब्ज़ियाँ\nऔर सलाद', plateProt: 'प्रोटीन', plateGrain: 'साबुत\nअनाज', plateFat: 'अच्छी वसा: एक चम्मच तेल, मेवे', plateHalf: '1/2', plateQ: '1/4',
    plateProtEx: 'दाल, पनीर,\nअंडा, दही', plateGrainEx: 'मिलेट रोटी',
    week: ['सोम', 'मंगल', 'बुध', 'गुरु', 'शुक्र', 'शनि', 'रवि'],
    weekAct: ['वॉक', 'स्ट्रेंथ', 'योग', 'वॉक', 'स्ट्रेंथ', 'डांस', 'आराम'],
    weekNote: 'हर दिन खाने के बाद 10 मिनट की सैर',
    ladder: ['जीवनशैली', 'दवाएँ', 'ओव्यूलेशन इंडक्शन', 'IUI / IVF'],
    ladderSub: ['खान-पान, गतिविधि, नींद', 'पीरियड, त्वचा, इंसुलिन', 'गोलियाँ या इंजेक्शन', 'सहायक गर्भधारण'],
    ladderNote: 'सब कदम 1 से शुरू करते हैं',
    riskCenter: 'जल्दी देखभाल\nजोखिम घटाती है',
    svc: ['स्त्री रोग', 'एंडोक्राइनोलॉजी', 'त्वचा रोग', 'डाइट और\nपोषण', 'HBOT*', 'ओज़ोन\nथेरेपी*', 'लैब', 'अल्ट्रासाउंड'],
    svcCenter: 'PCOD\nXpert',
    svcNote: '*सहायक, डॉक्टर की सलाह अनुसार',
    tlM: ['महीना 1', 'महीना 2', 'महीना 3', 'महीना 4', 'महीना 5', 'महीना 6'],
    tlA: ['जाँच', 'अमल', 'समीक्षा', 'सुधार', 'योजना', 'पूरी समीक्षा'],
    tl3: '3 महीने', tl6: '6 महीने',
  },
};

module.exports = { en, hi };
