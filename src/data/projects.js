export const projectCategories = [
  {
    id: "software",
    title: "Software Development & AI",
    accentColor: "#8a95d7", // Muted Indigo/Lavender
    resumeName: "resume_prithvi.pdf",
    resumePath: "/resume/resume_prithvi_backend.pdf",
    // resumePath: "/resume/resume_prithvi_lo_.pdf",
    projects: [
      {
        "id": "distributed-event-platform",
        "title": "Distributed Event-Driven Microservices Platform",
        "subtitle": "Scalable Microservices Architecture with Apache Kafka & Resilience Patterns",
        "period": "Jun 2026 – Present",
        "github": "https://github.com/Prithvi-R/event-driven-microservices",
        "challenge": "Architect a resilient, high-throughput distributed system capable of handling asynchronous event streams, fault tolerance, and traffic spikes without degrading database performance.",
        "role": "Distributed Systems Engineer",
        "stack": [
          "Java",
          "Spring Boot",
          "Spring Cloud Gateway",
          "Apache Kafka",
          "Redis",
          "Resilience4j",
          "Docker",
          "Microservices"
        ],
        "images": [
          "/images/distributed/img1.png",
          "/images/distributed/img2.png",
          "/images/distributed/img3.png"
        ],
        "highlights": [
          "Architected a distributed event-driven microservices platform using Kafka, configuring isolated consumer groups and dead-letter queues (DLQ) for robust, idempotent processing.",
          "Implemented Spring Cloud Gateway with Redis-backed rate limiting, Resilience4j circuit breakers, and multi-layer caching to optimize database read throughput under peak load."
        ]
      },
      {
        "id": "lock-free-queues",
        "title": "Lock-Free Concurrent Queues (SPSC & MPMC)",
        "subtitle": "High-Performance Thread-Safe Queues via Explicit Atomic Operations",
        "period": "Oct 2025 – Nov 2025",
        "github": "https://github.com/Prithvi-R/lock-free-queues",
        "challenge": "Build high-performance, contention-free concurrent data structures capable of scaling across multiple threads without lock overhead, thread blocking, or OS-level context switching bottlenecks.",
        "role": "Systems & Concurrency Engineer",
        "stack": [
          "C++",
          "C++ Atomics",
          "Multi-threading",
          "Lock-Free Programming",
          "Memory Ordering & Barriers",
          "Concurrency Benchmarking"
        ],
        "images": [
          "/images/lock/img1.png",
          "/images/lock/img2.png"
        ],
        "highlights": [
          "Designed and benchmarked a zero-allocation SPSC queue and an MPMC queue using explicit atomic operations and fine-grained memory ordering semantics.",
          "Achieved a 153x speedup over standard mutual exclusion models by eliminating lock contention and context switching overhead."
        ]
      },
      {
        id: "3dgs-reconstruction",
        title: "Photorealistic 3D Scene Reconstruction",
        subtitle: "3D Gaussian Splatting (3DGS) Pipeline",
        period: "Oct 2025 – Nov 2025",
        challenge: "Create physics-consistent 3D virtual spaces from standard 2D video sequences to serve as ultra-realistic environments for robot training and path-planning.",
        role: "Graphics & Deep Learning Developer. Structured the 3DGS pipeline, optimized rasterization speed, and mapped bounds to simulation engines.",
        stack: ["Python", "PyTorch", "3D Gaussian Splatting", "Computer Vision", "Structure from Motion (Colmap)", "NeRF"],
        images: [
          "/images/3dgs/img1.png",
          "/images/3dgs/img2.png"
        ],
        highlights: [
          "Reconstructed highly traversable 3D scenes from monocular video footage, retaining photorealistic reflection and lighting details.",
          "Achieved real-time rendering rates by optimizing Gaussian rasterization compared to slower neural radiance fields (NeRF).",
        ]
      },
      {
        id: "project-ascend",
        title: "Project Ascend: AI Life Tracker",
        subtitle: "Gamified Habit Tracker with AI Analysis",
        period: "July 2025",
        github: "https://github.com/Prithvi-R/Project-Ascend",
        challenge: "Design and build a full-featured habit tracking platform that keeps users engaged by converting daily routines into interactive gaming 'quests' with AI-based task allotments.",
        role: "Full-Stack Developer. Designed the database schema, engineered the FastAPI backend, and built the React frontend.",
        stack: ["React", "FastAPI", "PostgreSQL", "JWT Auth", "Python", "TailwindCSS", "Gemini API"],
        images: [
          "/images/ascend/img1.png",
          "/images/ascend/img2.png",
          "/images/ascend/img3.png",
          "/images/ascend/img4.png",
          "/images/ascend/img5.png",
          "/images/ascend/img6.png",
          "/images/ascend/img7.png",
          "/images/ascend/img8.png",
          "/images/ascend/img9.png",
          "/images/ascend/img10.png",
          "/images/ascend/img11.png",
          "/images/ascend/img12.png",
          "/images/ascend/img13.png"
        ],
        highlights: [
          "Programmed a gamified daily quest generator using the Gemini API to analyze user metrics and recommend personalized habits.",
          "Built a secure backend using JWT authentication, logging nutrition, exercise, and mood data in a relational PostgreSQL DB.",
          "Created interactive weekly analytical reports that predict habit drops and suggest recovery steps."
        ]
      },
      {
        id: "graph-rag",
        title: "Graph-Based Self-Correction RAG Pipeline",
        subtitle: "Multi-Node Agentic State Graph",
        period: "June 2025",
        github: "https://github.com/Prithvi-R/personal_RAG",
        challenge: "Build a document retrieval and answering pipeline that eliminates LLM hallucinations and incorrect context retrieval, which are common in standard vector RAG pipelines.",
        role: "AI Engineer. Structured the state machine, built loop routes, and implemented grading evaluation nodes.",
        stack: ["Python", "LangGraph", "LangChain", "OpenAI / Gemini API", "ChromaDB Vector DB", "Structured Output Grading"],
        images: [
          "/images/rag/img1.png",
          "/images/rag/img2.png",
          "/images/rag/img3.png",
          "/images/rag/img4.png"
        ],
        highlights: [
          "Developed a multi-agent state graph where outputs are continuously evaluated by self-checking grading nodes.",
          "Implemented a loop route that automatically refines query searches or rewrites prompts if the generator output is hallucinated.",
          "Achieved a 95% reduction in irrelevant answers by validating retrieved documents against queries before drafting responses."
        ]
      },
      {
        "id": "rooundUP",
        "title": "RoundUPX: Microservices Financial Savings Platform",
        "subtitle": "Scalable Automated Micro-Investing & Savings Engine",
        "period": "Mar 2025 – Apr 2025",
        "github": "https://github.com/roundupx",
        "challenge": "Architect a resilient, high-throughput microservices backend to handle automated micro-investing, transaction round-ups, and secure third-party payment gateway integrations with fault tolerance.",
        "role": "Backend & Distributed Systems Engineer",
        "stack": [
          "Go",
          "RESTful APIs",
          "Idempotency & Retries",
          "Background Jobs",
          "CI/CD Pipelines",
          "Microservices",
          "Distributed Tracing"
        ],
        "images": [
          "/images/roundup/img1.png",
          "/images/roundup/img2.png",
          "/images/roundup/img3.png",
          "/images/roundup/img4.png",
        ],
        "highlights": [
          "Integrated third-party payment APIs, implementing idempotency keys, exponential backoff retries, and transactional reconciliation logic to reliably manage webhook callbacks and edge-case status codes.",
          "Instrumented structured logging and distributed tracing patterns across endpoints to streamline production debugging, partner response verification, and metric tracking."
        ]
      },
      {
        "id": "coverup",
        "title": "Low-Latency Multimodal Desktop Assistant",
        "subtitle": "Stealth Window Overlay & Telemetry Bypass Utility",
        "period": "May 2024 – June 2024",
        "github": "https://github.com/Prithvi-R/coverup",
        "challenge": "Engineer a native low-latency utility capable of rendering secure auxiliary interfaces and transparent overlays while evading strict window monitoring and telemetry checks.",
        "role": "Systems Software Engineer",
        "stack": [
          "C++",
          "Win32 API",
          "Windows OS Internals",
          "Graphics Hooking",
          "Process Injection",
          "Window Handles (HWND)",
          "GDI+"
        ],
        "images": [
          "https://images.unsplash.com/photo-1629654297299-c8506221ca97?auto=format&fit=crop&w=800&q=80"
        ],
        "highlights": [
          "Engineered a lightweight, native C++ system utility utilizing Win32 API and GDI+ to capture screen buffers and audio streams for real-time multimodal inference.",
          "Designed an asynchronous multithreaded network worker using atomic queues and thread pools, achieving non-blocking API dispatch and zero UI frame drops."
        ]
      },
    ]
  },
  {
    id: "robotics",
    title: "Robotics & Autonomy",
    accentColor: "#5c90b0", // Muted Steel Blue
    resumeName: "Resume_Prithvi_Robo.pdf",
    resumePath: "/resume/Resume_Prithvi_Robo.pdf",
    projects: [
      {
        "id": "snake-robotics",
        "title": "Modular Snake Robot Platform",
        "subtitle": "Hyper-Redundant Kinematics & Serpentine Locomotion Control",
        "period": "Ongoing",
        // "github": "https://github.com/Prithvi-R/snake-robotics",
        "challenge": "Design and implement locomotion algorithms and kinematic controllers for a multi-link snake robot to navigate unstructured environments and tight spaces using gait modulation.",
        "role": "Robotics & Controls Engineer",
        "stack": [
          "C++",
          "Python",
          "ROS 2",
          "Serpentine Kinematics",
          "Gait Control Algorithms",
          "Embedded Systems",
          "Gazebo"
        ],
        "images": [
          "/images/snake/img1.png",
          "/images/snake/img2.png",
          "/images/snake/img3.png",
          "/images/snake/img4.png",
          "/images/snake/img5.png",
        ],
        "highlights": [
          "Implemented biological serpentine locomotion gaits (lateral undulation and sidewinding) using parameterized sine-wave control functions across multi-joint serial manipulators.",
          "Simulated dynamic obstacle traversal and joint-angle trajectories in ROS 2/Gazebo, verifying real-time embedded motor control feedback loops.",
          "Still In Progress"
        ]
      },
      {
        id: "a2rl-f1",
        title: "Autonomous F1 Race Car (Just Started)",
        subtitle: "A2RL Autonomous Racing League",
        period: "Ongoing",
        challenge: "Train a full-scale autonomous F1 racing agent to compete in Autonomous Racing League like the Yas Marina Circuit in Abu Dhabi, navigating at extremely high speeds with dynamic obstacle avoidance.",
        role: "Autonomy & Simulation Engineer. Training RL agents and configured localization and motion planning systems to run at ultra-low latencies.",
        stack: ["ROS2", "Issac Sim","Python", "C++", "Motion Planning", "Trajectory Optimization", "Reinforcement Learning"],
        images: [
          "https://a2rl.io/images/event/9%20Cars.jpeg"
        ],
        highlights: [
          "In Progress"
        ]
      },
      {
        id: "swarm-robots",
        title: "Multi-Agent Swarm Dynamics on Hardware",
        subtitle: "Real Hardware Swarms - FireBird VI",
        period: "Jan 2026 – May 2026",
        github: "https://github.com/Prithvi-R/ros0xrobot",
        challenge: "Design and implement a centralized coordination framework to control physical swarm robots, ensuring collision avoidance and consensus formation.",
        role: "Lead Hardware-Software Developer, guided by Dr. Surajit Panja, IIIT Guwahati.",
        stack: ["ROS2", "Python", "FireBird VI Robots", "Graph Theory", "Network Consensus", "LiDAR/IR sensors"],
        images: [
          "/images/hardware/img1.webp",
          "/images/hardware/img2.png",
          "/images/hardware/img3.png",
          "/images/hardware/img4.png"
        ],
        highlights: [
          "Developed a ROS2-based controller running locally across multiple agents on FireBird VI robotic hardware.",
          "Implemented graph-theoretic consensus algorithms enabling swarm agents to maintain leader-follower formations dynamically.",
          "Designed and tuned potential-field-based collision avoidance algorithms to navigate obstacles safely on hardware."
        ]
      },
      {
        id: "orb-slam2",
        title: "ROS2 ORB-SLAM2 Integration",
        subtitle: "Visual SLAM Autonomy",
        period: "Completed Recently",
        github: "https://github.com/Prithvi-R/Neural_SLAM",
        challenge: "Deploy a robust visual Simultaneous Localization and Mapping (SLAM) pipeline using ROS2, resolving message communication overhead and tracking drift in feature-poor rooms.",
        role: "Core Developer. Created ROS2 wrapper nodes, managed coordinate transform frames (TF2), and optimized image transport pipelines.",
        stack: ["ROS2", "ORB-SLAM2", "C++", "OpenCV", "RGB-D / Mono Cameras", "TF2 Listener"],
        images: [
          "/images/orb-slam2/img1.png",
          "/images/orb-slam2/img2.png",
          "/images/orb-slam2/img3.png",
          "/images/orb-slam2/img4.png"
        ],
        highlights: [
          "Wrapped C++ ORB-SLAM2 library into ROS2 lifecycle nodes, processing depth and color camera topics in real-time.",
          "Generated dense 2D occupancy grid maps from 3D point clouds to interface directly with the ROS Nav2 navigation stack."
        ]
      },
      {
        id: "robotic-manipulator",
        title: "6-DOF Robotic Manipulator in Constrained Environments",
        subtitle: "Scene-Aware Autonomy Pipeline",
        period: "Aug 2025",
        github: "https://github.com/Prithvi-R/robot-manipulation",
        challenge: "Orchestrate an end-to-end manipulation pipeline for a mobile robotic arm to perform autonomous object sorting and collision-free grasping in randomized, cluttered environments.",
        role: "Primary Autonomy Developer. Modeled physics environments, solved inverse kinematics, and configured path planning.",
        stack: ["ROS/ROS2", "Nav2", "PyBullet", "MuJoCo", "Inverse Kinematics", "Motion Planning", "MoveIt"],
        images: [
          "/images/6dof/img1.png"
        ],
        highlights: [
          "Built full physical simulations in PyBullet and MuJoCo with randomly initialized targets and complex obstacles.",
          "Deployed the ROS Nav2 stack using a dynamic world model, enabling the mobile base to navigate around obstacles to target zones.",
        ]
      }
    ]
  },
  {
    id: "fpga",
    title: "FPGA, Firmware & Semiconductor Fabrication",
    accentColor: "#c87a53", // Muted Copper/Terracotta
    resumeName: "resume_prithvi.pdf",
    resumePath: "/resume/resume_prithvi_fab.pdf",
    projects: [
      {
        id: "nthu-taiwan",
        title: "2-Micrometer Semiconductor Fabrication (NTHU, Taiwan)",
        subtitle: "Semiconductor Cleanroom Operations",
        period: "March 2026",
        challenge: "Execute multi-layer silicon wafer processing with 2-micrometer precision in cleanrooms, maintaining zero contamination across multiple process cycles.",
        role: "Fabrication Intern at National Tsing Hua University (NTHU), Taiwan.",
        stack: ["Cleanroom Operations (Class 100/1000)", "Photolithography", "Dry/Wet Etching", "Thin Film Deposition (PVD/CVD)"],
        images: [
          "/images/nthu/img1.jpg",
          "/images/nthu/img2.jpg",
          "/images/nthu/img3.jpg"
        ],
        highlights: [
          "Successfully fabricated multi-layer test patterns on a silicon wafer under strict cleanroom industrial protocols.",
          "Operated industrial photolithography aligners, chemical spin coaters, and oxygen plasma etching systems.",
          "Mastered device inspection using scanning electron microscopy (SEM) to verify channel definitions at 2-micron scale."
        ]
      },
      {
        id: "iith-sparc",
        title: "10-Micrometer Fabrication & Resistive Gas Sensor",
        subtitle: "IIT Hyderabad SPARC Program",
        period: "Nov 2025",
        challenge: "Design and fabricate a 10-Micrometer Semiconductor Fabrication along with a fully functional hardware gas sensor capable of detecting Ammonia (NH3) gas leakage levels from the ground up.",
        role: "Research Intern under Indo-Taiwan SPARC Collaboration.",
        stack: ["Resistive Gas Sensors", "10-Micrometer Semiconductor Lithography", "Etching & Sputtering", "Device Physics Analysis"],
        images: [
          "/images/iith/img1.jpg",
          "/images/iith/img2.png",
          "/images/iith/img3.jpg",
          "/images/iith/img4.jpg"
        ],
        highlights: [
          "Successfully fabricated 10-micrometer multi-layer test patterns on a silicon wafer under strict cleanroom industrial protocols.",
          "Fabricated a functional resistive gas sensor, along with 10-micrometer multi-layer detail on silicon dioxide substrates.",
          "Conducted electrical characterization of sensor sensitivity under varying NH3 concentrations.",
          "Studied physical silicon constraints (diffusion, charge transport) to bridge hardware RTL design with silicon properties."
        ]
      },
      {
        id: "prewitt-edge",
        title: "Prewitt Edge Detection Filter",
        subtitle: "FPGA Image Processing Accelerator",
        period: "Completed Recently",
        // github: "https://github.com/Prithvi-R/Prewitt-Edge-Detection",
        challenge: "Implement a real-time edge detection filter in Verilog to perform spatial convolution on video frames without dropping frame rates.",
        role: "RTL Designer.",
        stack: ["Verilog", "FPGA Fabric", "RTL Design", "Convolution Engines", "Line Buffering"],
        images: [
          "/images/prewitt/img1.png",
          "/images/prewitt/img2.png",
          "/images/prewitt/img3.png",
          "/images/prewitt/img4.png"
        ],
        highlights: [
          "Designed 3x3 line buffers to process stream data from camera sensors on the fly.",
          "Implemented pipelined adders and absolute difference calculators to solve Prewitt vertical/horizontal gradients in one clock cycle.",
          "Optimized resource utilization to fit within low-power FPGA architectures while running at 100MHz clock frequencies."
        ]
      },
      {
        id: "systolic-array",
        title: "2x2 Systolic Array Hardware Accelerator",
        subtitle: "Matrix Multiplication Accelerator",
        period: "Completed Recently",
        challenge: "Design a high-throughput, parallel matrix multiplication hardware accelerator in Verilog, optimizing data reuse and reducing bus-bottleneck latencies.",
        role: "RTL Design & Simulation Engineer.",
        stack: ["Verilog", "FPGA Architecture", "Xilinx Vivado", "ModelSim Simulation", "Dataflow Architectures"],
        images: [
        ],
        highlights: [
          "Modeled processing elements (PEs) containing local multiply-accumulate (MAC) arithmetic logic units.",
          "Pipelined inputs to flow from top and left boundaries, completing matrix products with O(N) time complexity.",
          "Validated timing waveforms and cell placement constraints using Xilinx Vivado, ensuring hazard-free data execution."
        ]
      }
      // {
      //   id: "spectrophotometer",
      //   title: "Portable Spectrophotometer for Turmeric Adulteration",
      //   subtitle: "IoT Embedded Spectroscopy",
      //   period: "Aug 2024 – June 2025",
      //   challenge: "Develop an affordable, field-deployable spectrophotometer that detects chemical adulterants in turmeric powder, replacing slow lab-bound chemical testing.",
      //   role: "Embedded & Cross-Platform Developer, advised by Dr. Mohd Mansoor Khan, IIIT Guwahati.",
      //   stack: ["React Native", "Embedded C++", "Spectroscopic Sensors", "IoT Dashboard", "Data Analysis"],
      //   images: [
      //   ],
      //   highlights: [
      //     "Built a low-cost, portable spectrometer device utilizing a multispectral sensor and ESP32 microcontroller.",
      //     "Programmed a React Native cross-platform application visualizing sample spectrum patterns in real-time.",
      //     "Deployed classification models on device and app data to detect adulterants with high accuracy."
      //   ]
      // }
    ]
  }
];
