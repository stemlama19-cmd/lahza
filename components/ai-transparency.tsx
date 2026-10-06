type Language = 'ar' | 'en';

const text = {
  ar: 'هذه أداة مدعومة بالذكاء الاصطناعي وليست مختصًا بشريًا. لا تصدر فتوى، وتعرض محتوى مسندًا إلى مصادره.',
  en: 'This is an AI-supported tool, not a human specialist. It does not issue religious rulings and shows content linked to its sources.',
};

export default function AiTransparency({language, id}: {language: Language; id: string}) {
  return <p id={id} className="ai-transparency">{text[language]}</p>;
}
