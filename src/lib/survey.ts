

export interface LocalizedStr {
  en: string;
  ar: string;
}

export interface QuestionOption {
  value: string;
  label: LocalizedStr;
}

export interface SurveyQuestion {
  id: number;
  key: string; // question_1 .. question_5
  title: LocalizedStr;
  question: LocalizedStr;
  type: "single" | "multiple";
  options: QuestionOption[];
}

export const SURVEY_QUESTIONS: SurveyQuestion[] = [
  {
    id: 1,
    key: "question_1_answer",
    title: { en: "Understanding AI", ar: "فهم الـ AI" },
    question: { en: "What best describes your current understanding of Artificial Intelligence?", ar: "إيه أفضل وصف لفهمك الحالي للذكاء الاصطناعي؟" },
    type: "single",
    options: [
      { value: "q1_new", label: { en: "I am completely new to AI.", ar: "أنا جديد جدًا في الـ AI." } },
      { value: "q1_basic", label: { en: "I know the basic concepts.", ar: "أعرف المفاهيم الأساسية." } },
      { value: "q1_use", label: { en: "I use AI tools but do not know how they work.", ar: "أستخدم أدوات AI بس مش عارف أزاي بتشتغل." } },
      { value: "q1_ml", label: { en: "I understand some AI and Machine Learning concepts.", ar: "أفهم شوية مفاهيم AI وML." } },
      { value: "q1_built", label: { en: "I have already built an AI project.", ar: "عملت مشروع AI قبل كده." } },
    ],
  },
  {
    id: 2,
    key: "question_2_answer",
    title: { en: "AI Experience", ar: "تجربتي مع AI" },
    question: { en: "Have you used any AI tools before?", ar: "استخدمت أدوات AI قبل كده؟" },
    type: "single",
    options: [
      { value: "q2_daily", label: { en: "Yes, almost every day.", ar: "أيوه، تقريبًا كل يوم." } },
      { value: "q2_sometimes", label: { en: "Yes, sometimes.", ar: "أيوه، أحيانًا." } },
      { value: "q2_once", label: { en: "I have tried them once or twice.", ar: "جربتها مرة أو مرتين." } },
      { value: "q2_no", label: { en: "No, not yet.", ar: "لا، لسه." } },
    ],
  },
  {
    id: 3,
    key: "question_3_answer",
    title: { en: "AI Capabilities", ar: "قدرات AI" },
    question: { en: "Which of these tasks do you think AI can help with?", ar: "إيه المهام اللي تتوقع إن الـ AI يقدر يساعد فيها؟" },
    type: "multiple",
    options: [
      { value: "q3_content", label: { en: "Answering questions and generating content.", ar: "إجابة الأسئلة وتوليد المحتوى." } },
      { value: "q3_data", label: { en: "Analyzing data and finding patterns.", ar: "تحليل البيانات واكتشاف الأنماط." } },
      { value: "q3_cv_nlp", label: { en: "Recognizing images and understanding language.", ar: "التعرف على الصور وفهم اللغة." } },
      { value: "q3_pred", label: { en: "Making predictions and supporting decisions.", ar: "التنبؤ ودعم اتخاذ القرار." } },
      { value: "q3_all", label: { en: "All of the above.", ar: "كل اللي فات." } },
    ],
  },
  {
    id: 4,
    key: "question_4_answer",
    title: { en: "Trust and Limitations", ar: "الثقة وحدود AI" },
    question: { en: "Do you think AI can always provide correct and reliable answers?", ar: "هل الـ AI دايمًا بيدي إجابات صحيحة وموثوقة؟" },
    type: "single",
    options: [
      { value: "q4_yes", label: { en: "Yes, AI is always correct.", ar: "أيوه، دايمًا صحيح." } },
      { value: "q4_usually", label: { en: "Usually, but it can make mistakes.", ar: "غالبًا، بس ممكن يغلط." } },
      { value: "q4_no", label: { en: "No, AI can sometimes be incorrect or biased.", ar: "لا، ممكن يغلط أو يكون فيه تحيز أحيانًا." } },
      { value: "q4_unsure", label: { en: "I am not sure.", ar: "مش متأكد." } },
    ],
  },
  {
    id: 5,
    key: "question_5_answer",
    title: { en: "AI Interests", ar: "اهتماماتي في AI" },
    question: { en: "Which AI topic interests you the most?", ar: "إيه أكتر مجال في الـ AI مهتم تتعلم عنه؟" },
    type: "multiple",
    options: [
      { value: "q5_ml", label: { en: "Machine Learning.", ar: "Machine Learning." } },
      { value: "q5_dl", label: { en: "Deep Learning and Neural Networks.", ar: "Deep Learning والشبكات العصبية." } },
      { value: "q5_genai", label: { en: "Generative AI and tools like ChatGPT.", ar: "Generative AI وأدوات زي ChatGPT." } },
      { value: "q5_agents", label: { en: "AI Agents and Automation.", ar: "AI Agents والأتمتة." } },
      { value: "q5_cv", label: { en: "Computer Vision and Image Recognition.", ar: "Computer Vision والتعرف على الصور." } },
      { value: "q5_nlp", label: { en: "Natural Language Processing.", ar: "Natural Language Processing (NLP)." } },
      { value: "q5_projects", label: { en: "Building real AI projects.", ar: "بناء مشاريع AI حقيقية." } },
      { value: "q5_unsure", label: { en: "I am not sure yet; I want to explore.", ar: "مش عارف لسه، عايز أكتشف." } },
    ],
  },
];

export function getQuestionByIndex(i: number) {
  return SURVEY_QUESTIONS[i];
}

export function isLastQuestion(i: number) {
  return i === SURVEY_QUESTIONS.length - 1;
}