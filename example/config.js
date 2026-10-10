/** Site metadata and content configuration for the Gatsby example site. */
module.exports = {
  // pathPrefix: "/gatsby-theme-academic",
  siteUrl: "https://huskydoge.github.io",
  title: "HuskyDoge",
  description: "Personal Website of Benhao Huang",
  author: "HuskyDoge",
  authorAlternative: "Benhao Huang",
  introduction: [
    "Hello! Husky here! I'm an MSML student at CMU, working with the [Locus Lab](https://github.com/locuslab). My research focuses on LLM pre-training, particularly model architectures and training algorithms. I am currently interested in: \n - **Loop Models** - weight-tied architectures and iterative dynamics. \n - **Scalable Reasoning** - architectures and training methods that improve both reasoning capability and computational efficiency.",
    
    "Before this, I worked on generative world models with the [VCG Group](https://vcg.seas.harvard.edu/) at Harvard and [Maitrix](https://github.com/maitrix-org) at UCSD, LLM-agent-based dataset curation with the [TRAIS Lab](https://github.com/TRAIS-Lab) at UIUC, and AI interpretability with the [XAI Lab](https://sjtu-xai-lab.github.io/) at SJTU. More details are available in **[Experience](#experience-education)** below."
  ],
  avatar: "/avatar.png",
  avatarBack: "/avatar-back.jpeg",
  avatarImages: ["/avatar.png", "/avatar-back.jpeg", "/selfie.jpg"],
  professions: [
    {
      name: "Locus",
      url: "https://github.com/locuslab" 
    },
    {
      name: "MAITRIX",
      url: "https://maitrix.org/" 
    },
    {
      name: "TRAIS",
      url: "https://github.com/TRAIS-Lab"
    },
  ],
  tocMaxDepth: 2,
  excerptMaxLength: 50,
  // birthday: "xxxx",
  location: "Pittsburgh, PA, USA",
  // email: "huskydogewoof@gmail.com",
  postsForArchivePage: 3,
  defaultLanguage: "en",
  disqusScript:
    process.env.DISQUS_SCRIPT || "https://tc-imba.disqus.com/embed.js",
  pages: {
    home: "/",
    posts: "posts",
    contact: "contact",
    resume: "resume",
    tags: "tags",
    research: "research",
    project: "project",
    bookshelf: "bookshelf",
    contact: "contact",
  },
  social: [
    {
      label: "CV",
      url: "/resume.pdf",
      icon: ["ai", "cv"],
    },
    {
      label: "GitHub",
      url: "https://github.com/huskydoge",
      icon: ["fab", "github"],
    },
    {
      label: "Twitter",
      url: "https://twitter.com/huskydogewoof",
      icon: ["fab", "twitter"],
    },
    {
      label: "Google Scholar",
      url: "https://scholar.google.com/citations?hl=en&user=h2Lf0_EAAAAJ",
      icon: ["fa", "graduation-cap"],
    },
    {
      label: "alphaXiv",
      url: "https://www.alphaxiv.org/@benhao-huang",
      icon: ["custom", "alphaxiv"],
    },
    {
      label: "LinkedIn",
      url: "https://www.linkedin.com/in/benhao-h-6534b629a/",
      icon: ["fab", "linkedin"],
    },
    {
      label: "Email",
      emailUser: "benhaoh",
      emailDomain: "andrew.cmu.edu",
      icon: ["fas", "envelope"],
    },
    {
      label: "WeChat",
      icon: ["fab", "weixin"],
      qrImage: "/qr-code.png",
    },
    {
      label: "Xiaohongshu",
      url: "https://www.xiaohongshu.com/user/profile/614a97f000000000020250c8",
      icon: ["custom", "xiaohongshu"],
    },
    {
      label: "Zhihu",
      url: "https://www.zhihu.com/people/huskydoge",
      icon: ["fab", "zhihu"],
    }
  ],
  // facebook: 'https://www.facebook.com/rolwin.monteiro',
  // instagram: 'https://www.instagram.com/reevan100/',
  // rss: '/rss.xml',
  wakatime: {
    username: "tcimba",
    activity: "7add4047-08f9-4da8-b649-aa114503678f",
    language: "460a84ab-722a-4b80-b896-cabaa13ad7eb",
    editor: "d851639a-28d8-4884-949f-d338a858f7e9",
    os: "caf7d0d1-8fd2-4595-a991-363c8583fea9",
  },
  contactFormUrl:
    process.env.CONTACT_FORM_ENDPOINT ||
    "https://getform.io/f/09a3066f-c638-40db-ad59-05e4ed71e451",
  googleAnalyticTrackingId: process.env.GA_TRACKING_ID || "G-ZK3P43DY6M",
  education: [
    {
      date: "Aug 2025 - Dec 2027 (expected)",
      icon: "university",
      title: "M.S. in Machine Learning",
      location: "Carnegie Mellon University"
    },
    {
      date: "Sept 2021 - July 2025",
      icon: "university",
      title: "B.E. in Computer Science",
      location: "Shanghai Jiao Tong University",
    },
  ],
  interests: [
    {
      icon: "brain",
      title: "Loop Models, Scalable Reasoning"
    },
    {
      icon: "cubes",
      title: "LLM Pre-training, Model Architecture",
    },
    {
      icon: "layer-group",
      title: "Efficient ML, Adaptive Computation",
    }
  ],
  experience: [
    {
      title: "Internship",
      position: "left",
      data: [
        {
          date: "Sept. 2025 - Present",
          title: "[Locus Lab](https://zicokolter.com/), CMU",
          location: "Pittsburgh, PA, USA",
          description: "Studying scalable equilibrium models. Advised by [**Zico Kolter**](https://zicokolter.com/).",
        },
        {
          date: "May 2026 - Aug. 2026",
          title: "[Institute of Foundation Models](https://www.linkedin.com/showcase/institute-of-foundation-models/posts/?feedView=all)",
          description: "Research internship on **Loop Models on Scale**. Advised by [**Xuezhe Ma**](https://xuezhemax.github.io/).",
        },
        {
          date: "Mar. 2025 - Aug. 2025",
          title: "[VCG Group](https://vcg.seas.harvard.edu/), Harvard",
          location: "Cambridge, MA, USA",
          description: "Developed [**Flow Equivariant World Models**](https://arxiv.org/abs/2601.01075), studying structured dynamics outside the visible field of view. Advised by [**Yilun Du**](https://yilundu.github.io/), [**Fangneng Zhan**](https://fnzhan.com/), and [**Andy Keller**](https://akandykeller.github.io/).",
        },
        {
          date: "Jun. 2024 - Mar. 2025",
          title: "[Maitrix.org](https://github.com/maitrix-org), UCSD",
          location: "San Diego, CA, USA",
          description: "Core contributor to [**PAN World Models**](https://arxiv.org/abs/2511.09057), previously leading the data and game-generation components. Advised by [**Zhiting Hu**](http://zhiting.ucsd.edu/).",
        },
        {
          date: "Mar. 2024 - Jun. 2024",
          title: "Research Intern @ [Moonshot AI](https://www.moonshot.cn/)",
          location: "remote",
        },
        {
          date: "Nov. 2023 - Sept. 2024",
          title: "[TRAIS Lab](https://github.com/TRAIS-Lab), UIUC",
          location: "remote",
          description: "Developed [**DCA-Bench**](https://arxiv.org/abs/2406.07275), a benchmark for evaluating LLM agents on dataset issue detection and dataset curation. Advised by [**Jiaqi W. Ma**](https://jiaqima.github.io/).",
        },
        {
          date: "Feb. 2023 - Jan. 2024",
          title: "[XAI Lab](https://sjtu-xai-lab.github.io/), SJTU",
          location: "Shanghai, China",
          description: "Studied AI interpretability and safety through [**generalizable interaction primitives in DNNs**](https://arxiv.org/abs/2401.16318), using Shapley-value theory. Advised by [**Quanshi Zhang**](http://qszhang.com/).",
        },
      ],
    },
    {
      title: "Service",
      position: "left",
      data: [
        // {
        //   date: "June 2024",
        //   title: "Group Tutor of Advanced Mathematics",
        //   location: "Shanghai Jiao Tong University, China",
        // },
        // {
        //   date: "Dec 2023",
        //   title:
        //     "Personal Tutor of CS2612, Programming Languages and Compilers",
        //   location: "Shanghai Jiao Tong University, China",
        // },
        // {
        //   date: "2022 ~ 2024",
        //   title: "Volunteer of Shanghai Marathon",
        //   location: "Shanghai, China",
        // },
      ],
    },
  ],
  awards: [
    {
      date: "2025",
      title: "Outstanding Graduate of Shanghai Jiao Tong University",
      show: false,
    },
    {
      date: "2024",
      title: "National Scholarship",
      show: true,
    },
    {
      date: "2023",
      title: "Rui Yuan Hong Shan Scholarship, Shanghai Jiao Tong University (RMB 20,000)",
      show: false,
    },
    {
      date: "2022",
      title: "Shao Qiu Scholarship, Shanghai Jiao Tong University (RMB 10,000)",
      show: false,
    },
    // {
    //   date: "2022",
    //   title: "Meritorious Winner of MCM/ICM",
    //   show: false,
    // },
  ],
  tagColors: [
    "magenta",
    "red",
    "volcano",
    "orange",
    "gold",
    "lime",
    "green",
    "cyan",
    "blue",
    "geekblue",
    "purple",
  ],
  tags: [
    {
      id: "javascript",
      name: "javascript",
      description:
        "JavaScript is an object-oriented programming language used alongside HTML and CSS to give functionality to web pages.",
      color: "#f0da50",
    },
    {
      id: "nodejs",
      name: "Node.js",
      description:
        "Node.js is a tool for executing JavaScript in a variety of environments.",
      color: "#90c53f",
    },
    {
      id: "rxjs",
      name: "RxJS",
      description:
        "RxJS is a library for reactive programming using Observables, for asynchronous operations.",
      color: "#eb428e",
    },
    {
      id: "typescript",
      name: "typescript",
      description:
        "TypeScript is a typed superset of JavaScript that compiles to plain JavaScript.",
      color: "#257acc",
    },
    {
      id: "reactjs",
      name: "reactjs",
      description:
        "React is an open source JavaScript library used for designing user interfaces.",
      color: "#61dbfa",
    },
    {
      id: "gatsby",
      name: "Gatsby.js",
      description:
        "A framework built over ReactJS to generate static page web application.  ",
      color: "#6f309f",
    },
    {
      id: "html",
      name: "HTML",
      description:
        "A markup language that powers the web. All websites use HTML for structuring the content.",
      color: "#dd3431",
    },
    {
      id: "css",
      name: "css",
      description:
        "CSS is used to style the HTML element and to give a very fancy look for the web application.",
      color: "#43ace0",
    },
    {
      id: "python",
      name: "python",
      description:
        "A general purpose programming language that is widely used for developing various applications.",
      color: "#f9c646",
    },
  ],
};
