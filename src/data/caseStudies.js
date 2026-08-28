export const caseStudies = [
  {
    id: "case-study-manufacturing-automation",
    type: "Manufacturing automation",
    title: "Modernizing legacy systems for global factory adoption",
    problem:
      "Factory users depended on disconnected legacy tools, which made production order workflows slow and difficult to scale across sites.",
    decision:
      "I helped rebuild the workflow with React, TypeScript, ASP.NET Core APIs, Python services, Oracle SQL integration, and CI/CD deployment through Docker, Kubernetes, and Azure DevOps.",
    result:
      "The integrated system reached 90% adoption across 18 global factories within two years and increased the order auto-fill rate from 5% to 50%.",
  },
  {
    id: "case-study-ai-edge-computing",
    type: "Industrial AI",
    title: "Predicting CNC machine behavior at the edge",
    problem:
      "Precision manufacturing systems need low-latency response prediction, but centralized processing can slow feedback loops.",
    decision:
      "I developed a distributed edge computing framework using deep learning and control-system knowledge to predict CNC position response closer to the machine.",
    result:
      "The framework achieved position error below 20 micrometers and improved the path toward more responsive industrial control.",
    showcase: {
      title: "KAKINO X-axis prediction results",
      summary:
        "Model validation focused on trajectory tracking, convergence behavior, and prediction error across the CNC X-axis response.",
      figures: [
        {
          src: "/images/cnc-kakino-x-axis-prediction.png",
          alt: "KAKINO X-axis validation and prediction line chart",
          caption: "Validation and prediction trajectory for the KAKINO X-axis position response.",
        },
        {
          src: "/images/cnc-training-validation-loss.png",
          alt: "Training and validation loss curve",
          caption: "Training and validation loss converged quickly and remained stable through later epochs.",
        },
        {
          src: "/images/cnc-x-axis-prediction-error.png",
          alt: "KAKINO X-axis prediction error line chart",
          caption: "Prediction error stayed within the target micrometer-level control range during evaluation.",
        },
      ],
    },
    video: {
      title: "CNC training data sampling process",
      embedUrl: "https://www.youtube.com/embed/Pl0Ajz5wXFg",
      caption: "Training data sampling process captured from the CNC machine response experiment.",
    },
  },
  {
    id: "case-study-embedded-vision",
    type: "Embedded vision",
    title: "Deploying real-time object tracking on compact hardware",
    problem:
      "Running object detection and tracking on Raspberry Pi hardware requires balancing model accuracy, latency, and resource limits.",
    decision: "I deployed YOLOv4 with DeepSort and OpenCV to support real-time classification and object tracking on Raspberry Pi 4.",
    result: "The project demonstrated end-to-end embedded AI deployment from model selection to real-time application behavior.",
  },
  {
    id: "case-study-iot-wireless-control-system",
    type: "IoT control systems",
    title: "Building a wireless control system across hardware, firmware, and mobile software",
    problem:
      "The system needed to connect physical device motion, wireless control behavior, and a usable mobile interface while staying practical for embedded hardware constraints.",
    decision:
      "I combined 3D-printed structures, microprocessor firmware in C, DSP control concepts, wireless communication, and a Java mobile app into one hardware-software prototype.",
    result:
      "The project demonstrated a complete embedded control workflow from mechanical structure and firmware to mobile control and user-facing interaction.",
    image: {
      src: "/images/iot-mechanical-design.png",
      alt: "Mechanical design rendering of the IoT wireless control system prototype",
      caption: "Mechanical design concept showing the embedded electronics, structural platform, and enclosed control assembly.",
    },
    video: {
      title: "IoT Wireless Control System demo",
      embedUrl: "https://www.youtube.com/embed/SDMoferSIdE",
    },
  },
  {
    id: "case-study-ai-stock-trend-prediction",
    type: "Financial AI",
    title: "Forecasting stock trend direction with news sentiment signals",
    problem:
      "Market trend prediction needs a way to translate unstructured news into features that can be tested against stock movement direction.",
    decision:
      "I used BERT-based NLP sentiment analysis to extract news signals, then evaluated how those signals related to trend direction in a machine learning workflow.",
    result:
      "The experiment clarified how language-model sentiment features can support financial forecasting research while keeping the prediction workflow measurable.",
  },
];
