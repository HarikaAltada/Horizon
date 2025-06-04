const quizData = [
  {
    question: "Which of the following do you enjoy the most?",
    options: [
      { id: "A", text: "Solving complex problems or conducting experiments" },
      {
        id: "B",
        text: "Creating or appreciating visual art, music, or design",
      },
      {
        id: "C",
        text: "Helping others and making a difference in people's lives",
      },
      { id: "D", text: "Building, designing, or working with technology" },
      {
        id: "E",
        text: "Staying active, helping others with fitness, or coaching sports",
      },
    ],
  },
  {
    question: "When you’re faced with a challenge, how do you approach it?",
    options: [
      {
        id: "A",
        text: "Through analysis, research, or experimentation to find the best solution",
      },
      {
        id: "B",
        text: "By thinking creatively and exploring different artistic approaches",
      },
      {
        id: "C",
        text: "By offering support and working with others to find a solution",
      },
      {
        id: "D",
        text: "By using technical tools, problem-solving methods, and hands-on skills",
      },
      {
        id: "E",
        text: "By staying active and motivating others to push through the challenge",
      },
    ],
  },
  {
    question: "Which of these is your ideal environment?",
    options: [
      { id: "A", text: "A university, laboratory, or research facility" },
      { id: "B", text: "A studio, gallery, or theater" },
      { id: "C", text: "A community center, clinic, or helping environment" },
      { id: "D", text: "An engineering workshop, tech company, or startup" },
      { id: "E", text: "A gym, sports arena, or outdoor field" },
    ],
  },
  {
    question: "Which of the following activities excites you the most?",
    options: [
      { id: "A", text: "Conducting research or teaching others" },
      {
        id: "B",
        text: "Designing new creations or working on artistic projects",
      },
      {
        id: "C",
        text: "Helping people improve their lives or supporting community development",
      },
      {
        id: "D",
        text: "Innovating, building, or programming new technologies",
      },
      { id: "E", text: "Training, coaching, or participating in sports" },
    ],
  },
];

const careerPathData = {
  "Education and Research": {
    learningPlatforms: [
      {
        name: "Coursera",
        image: "./assets/Coursera-Logo_600x600.svg.png",
        url: "https://www.coursera.org/",
        description:
          "A platform offering research and teaching-related courses from top universities and institutions.",
      },
      {
        name: "edX",
        image: "./assets/EDX_URLPrevew_2024-09-10.jpg",
        url: "https://www.edx.org/",
        description:
          "Provides free and paid online courses from universities and colleges for educational professionals.",
      },
      {
        name: "Khan Academy",
        image: "./assets/Khan_Academy_Logo.jpg",
        url: "https://www.khanacademy.org/",
        description:
          "Free learning resource offering educational materials on a wide range of subjects.",
      },
    ],
    fundingOpportunities: [
      {
        name: "National Science Foundation (NSF) Grants",
        image: "./assets/images (3).jpg",
        url: "https://www.nsf.gov/funding/",
        description:
          "Government grants that support research and education in various scientific fields.",
      },
      {
        name: "Horizon Europe Research Funding",
        image: "./assets/Client Centricity_My Area_final.YES.jpg",
        url: "https://ec.europa.eu/info/funding-tenders/opportunities/portal/screen/home",
        description:
          "EU's largest research and innovation funding program supporting collaborative research projects.",
      },
      {
        name: "Anusandhan National Research Foundation",
        image: "./assets/Anusandhan-National-Research-Foundation-ANRF-blog.png",
        url: "https://serb.gov.in/?utm_source=chatgpt.com",
        description:
          "Provides high-end research training in frontier areas of science and technology.",
      },
    ],
    toolkits: [
      {
        name: "Teach For All",
        image: "./assets/tfpak_img_0340.jpg",
        url: "https://teachforall.org/",
        description:
          "Education leadership, teacher development in underprivileged areas",
      },
      {
        name: "Save the Children",
        image: "./assets/3vkd8hb37kw6y5vv7a6k73d6cd25s87j.webp",
        url: "https://www.savethechildren.org/",
        description:
          "Child education, rights, and protection.Ensures children in conflict zones and remote areas can attend school.",
      },
      {
        name: "Educate Girls",
        image: "./assets/india-girls-school-mumbai.max-1440x900.webp",
        url: "https://www.educategirls.ngo/",
        description:
          "Out-of-School Girl Enrolment: Identifies and brings back girls who dropped out of school.",
      },
    ],
  },
  "Art and Design": {
    learningPlatforms: [
      {
        name: "Udemy",
        image: "./assets/udemy-new-20212512.jpg",
        url: "https://www.udemy.com/courses/search/?src=ukw&q=Art+and+design",
        description:
          "An online learning community for creatives, offering design and art courses.",
      },
      {
        name: "Domestika",
        image:
          "./assets/diseno-arquitectonico-cinco-cursos-de-domestika-para-no-perderse.jpg",
        url: "https://www.domestika.org/en/courses/category/3-design",
        description:
          "Get access to the best online courses for creatives.Interact with the top professionals and discover the creative world's best-kept secrets.",
      },
      {
        name: "Coursera",
        image: "./assets/Coursera-Logo_600x600.svg.png",
        url: "https://www.coursera.org/courses?query=art",
        description:
          "Explore art principles, techniques, and history. Learn to create and appreciate visual art through drawing, painting, and sculpture.",
      },
      {
        name: "SkillShare",
        image: "./assets/skillshare-inc-logo-vector.png",
        url: "https://www.skillshare.com/en/browse/art-illustration",
        description:
          "Focuses on creative skills and offers a wide variety of courses with exercises and project-based learning, often taught by industry leaders. ",
      },
      {
        name: "Class Central",
        image: "./assets/CC_Logo_Navy_Logo.jpg",
        url: "https://www.classcentral.com/subject/art-and-design",
        description:
          "Learn Art & Design, earn certificates with paid and free online courses from Harvard, Stanford, MIT, University of Pennsylvania and other top universities around the world.",
      },
    ],
    fundingOpportunities: [
      {
        name: "Artist Grants",
        image: "./assets/images.jpg",
        url: "https://www.artistgrants.org/",
        description:
          "Various grant opportunities available for visual artists to support their creative endeavors.",
      },
      {
        name: "Creative Capital",
        image: "./assets/sunnyday-chasehall-193-2048x1193.jpg",
        url: "https://creative-capital.org/",
        description:
          "Provides funding and advisory support to artists for innovative and challenging projects.",
      },
      {
        name: "National Endowment for the Arts",
        image: "./assets/rswu_photo2.jpg",
        url: "https://www.arts.gov/grants",
        description:
          "Provides grants to artists, arts organizations, and others to foster artistic creativity.",
      },
    ],
    toolkits: [
      {
        name: "The Art of Elysium",
        image: "./assets/Art+Supplies.jpg",
        url: "https://www.theartofelysium.org/",
        description:
          "Bringing arts to hospitalized youth, elders, and the homeless.",
      },
      {
        name: "India Foundation for the Arts",
        image: "./assets/djfnm,md.jpg",
        url: "https://indiaifa.org/india-foundation-arts.html",
        description:
          "Funding and support for artists, researchers, and educators.",
      },
      {
        name: "Dastkar",
        image: "./assets/art-and-design-schools-in-germany.jpg",
        url: "https://www.dastkar.org/",
        description: "Crafts, design development, and artisan empowerment.",
      },
    ],
  },

  "Social work and community services": {
    learningPlatforms: [
      {
        name: "Coursera",
        image: "./assets/Coursera-Logo_600x600.svg.png",
        url: "https://www.coursera.org/search?query=Social%20work%20and%20community%20services",
        description:
          "Offers online courses from top universities and institutions on topics like social work practice, community engagement, mental health, and more.",
      },
      {
        name: "edX",
        image: "./assets/EDX_URLPrevew_2024-09-10.jpg",
        url: "https://www.edx.org/",
        description:
          ": Provides free and paid courses in social work, public health, human services, and community leadership from universities like Harvard and the University of Michigan",
      },
      {
        name: "Udemy",
        image: "./assets/udemy-new-20212512.jpg",
        url: "https://www.udemy.com/courses/search/?src=ukw&q=Social+work+and+community+services",
        description:
          "Affordable courses on counseling, social skills, community development, and human services by independent instructors.",
      },
    ],
    fundingOpportunities: [
      {
        name: "Council on Social Work Education (CSWE) – Fellowships & Grants",
        image: "./assets/UpdatedCSWE.webp",
        url: "https://www.cswe.org/",
        description:
          "Offers support for research and educational development in social work education.",
      },
      {
        name: "Fulbright Program",
        image: "./assets/maxresdefault.jpg",
        url: "https://foreign.fulbrightonline.org/",
        description:
          "Offers scholarships for graduate studies, research, and teaching abroad—including social work-related topics.",
      },
      {
        name: "Ford Foundation Fellowship Programs",
        image: "./assets/D8E1D0A2-5947-4361-A87C-11C62E0687B3.webp",
        url: "https://www.nationalacademies.org/our-work/ford-foundation-fellowships",
        description:
          "Supports individuals who are committed to a career in social justice, including social work.",
      },
    ],
    toolkits: [
      {
        name: "Smile Foundation (India)",
        image: "./assets/IMG-20180523-WA0001-1024x626.jpg",
        url: "https://www.smilefoundationindia.org/",
        description:
          "smile Foundation works on education, healthcare, and women empowerment for underprivileged children and families across India.",
      },
      {
        name: "Goonj",
        image: "./assets/2024-05-07T10_13_03.750ZGOONJ.webp",
        url: "https://goonj.org/",
        description:
          "Goonj focuses on rural development by channeling urban surplus to rural areas and addressing basic needs like clothing, education, and disaster relief.",
      },
      {
        name: "GiveIndia",
        image: "./assets/target-image-homepage.jpg",
        url: "https://www.giveindia.org/",
        description:
          "A donation platform that allows people to support various social causes through verified NGOs across India.",
      },
    ],
  },
  "Engineering and technology": {
    learningPlatforms: [
      {
        name: "Coursera",
        image: "./assets/Coursera-Logo_600x600.svg.png",
        url: "https://www.coursera.org/search?query=%20Engineering%20and%20Technology",
        description:
          "An online learning community for creatives, offering design and art courses.",
      },
      {
        name: "Udemy",
        image: "./assets/udemy-new-20212512.jpg",
        url: "https://www.udemy.com/courses/search/?src=ukw&q=Engineering+and+technology",
        description:
          "A large platform offering affordable video courses in software development, mechanical engineering, electronics, and more.",
      },
      {
        name: "Khan Academy",
        image: "./assets/Khan_Academy_Logo.jpg",
        url: "https://www.khanacademy.org/",
        description:
          "A platform offering a variety of courses on design, creativity, and other subjects.",
      },
    ],
    fundingOpportunities: [
      {
        name: "MITACS Research Funding",
        image: "./assets/1_BnfYRbZr6LRxPBHMzlY4Yg.png",
        url: "https://www.mitacs.ca/",
        description:
          "Provides research internships and funding for technology and engineering collaboration between universities and industry.",
      },
      {
        name: "Erasmus",
        image: "./assets/erasmus-mundus-scholarship-can-get-you-one-step-closer-to-your-dream-european-college.webp",
        url: "https://erasmus-plus.ec.europa.eu/",
        description:
          "Offers funding for students, researchers, and universities to collaborate on engineering and technology projects across Europe.",
      },
      {
        name: "IEEE Foundation Grants",
        image: "./assets/1887444701-f278ced355e8de2be4daec5d9ca04e448ea8b182034935e9a7e6481402174a83-d.webp",
        url: "https://www.ieeefoundation.org/grants-help-volunteers-deliver-stem-programs/",
        description:
          "Supports projects that advance engineering education, particularly for underserved communities and global impact programs.",
      },
    ],
    toolkits: [
      {
        name: "Engineers Without Borders (EWB)",
        image: "./assets/EWB in Kenya Banner.jpg",
        url: "https://www.ewb-international.org/",
        description:
          "A global NGO that connects engineers and students to build sustainable infrastructure (clean water, energy, housing) in underserved communities.",
      },
      {
        name: "Society for Women Engineers (SWE)",
        image: "./assets/Society_of_Women_Engineers_logo.svg.png",
        url: "https://swe.org/",
        description:
          "A non-profit that supports women in engineering and technology through scholarships, mentoring, and professional development.",
      },
      {
        name: "Agastya International Foundation (India)",
        image: "./assets/eee33c_9a304866cb2b44a7987b9e7a28da8e0d~mv2.jpg",
        url: "https://www.agastya.org/",
        description:
          "A hands-on science and engineering education NGO that runs mobile labs and maker spaces for rural students in India.",
      },
    ],
  },
  "Sports and physical training": {
    learningPlatforms: [
      {
        name: "Nike Training Club (NTC)",
        image: "./assets/e5df3cf22ee2360cdc22f3cf78c67931_fgraphic.png",
        url: "https://www.nike.com/ntc-app",
        description:
          "Offers free workouts and training programs led by expert trainers, including strength, cardio, yoga, and mobility sessions.",
      },
      {
        name: "Peloton",
        image: "./assets/Peloton_Logo.jpg",
        url: "https://www.onepeloton.com/app",
        description:
          "Known for cycling, but also offers strength, HIIT, yoga, and running classes through its app with elite instructors and live sessions.",
      },
      {
        name: "FightCamp",
        image: "./assets/unnamed.webp",
        url: "https://joinfightcamp.com/",
        description:
          "At-home boxing and kickboxing training platform with equipment and app-based video workouts.",
      },
    ],
    fundingOpportunities: [
      {
        name: "National Sports Development Fund (NSDF)",
        image: "./assets/CZxMi5UsquoOfyfsOtx7.webp",
        url: "https://yas.nic.in/sports/national-sports-development-fund-0?utm_source=chatgpt.com",
        description:
          "Provides financial assistance to elite athletes and sports federations for customized training, equipment, and preparation for international competitions.",
      },
      {
        name: "Scheme of Grants for Creation of Sports Infrastructure",
        image: "./assets/children-playing-control-soccer-ball-tactics-cone-grass-field-with-training-background-1707732515596-compressed.jpg",
        url: "https://sports.indiapress.org/",
        description:
          "Provides financial support for the development of sports infrastructure, including training complexes and playfields, especially in rural areas.",
      },
      {
        name: "SBI Foundation's SBIF ACE Program",
        image: "./assets/lacrosse_2.jpg",
        url: "https://www2.fundsforngos.org/latest-funds-for-ngos/funding-available-for-sports-projects-in-india/?utm_source=chatgpt.com",
        description:
          "upports high-impact sports projects aimed at developing athletes, including para-athletes, to excel in national and international championships.",
      },
    ],
    toolkits: [
      {
        name: "GoSports Foundation",
        image: "./assets/1678182842090.png",
        url: "https://gosports.in/",
        description:
          " A non-profit working with junior Olympic and Paralympic athletes across various disciplines, providing financial support, mentorship, and sports science expertise.",
      },
      {
        name: "Olympic Gold Quest (OGQ)",
        image: "./assets/BLINK30_SAURABH1.webp",
        url: "https://ogq.org/",
        description:
          "Founded by sports legends to help Indian athletes win Olympic gold medals. Provides financial support, training, and equipment to top athletes.",
      },
      {
        name: "Oscar Foundation",
        image: "./assets/image-2_11zon-1675776191.jpg",
        url: "https://www.oscar-foundation.org/",
        description:
          "A Mumbai-based NGO using football to instill life skills and encourage education among underprivileged youth.",
      },
    ],
  },
};

export { quizData, careerPathData };
