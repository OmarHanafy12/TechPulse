import { IconBrain, IconShield, IconRocket, IconLeaf, IconDna, IconLayoutGrid } from "@tabler/icons-react";

export const getTopicStyles = (topic) => {
  const t = topic.toLowerCase();
  if (t.includes('ai') || t.includes('artificial')) return { colorClass: 'cat-ai', dotClass: 'dot-ai', icon: IconBrain };
  if (t.includes('security') || t.includes('cyber')) return { colorClass: 'cat-security', dotClass: 'dot-security', icon: IconShield };
  if (t.includes('space')) return { colorClass: 'cat-space', dotClass: 'dot-space', icon: IconRocket };
  if (t.includes('green') || t.includes('climate')) return { colorClass: 'cat-climate', dotClass: 'dot-climate', icon: IconLeaf };
  if (t.includes('bio')) return { colorClass: 'cat-bio', dotClass: 'dot-bio', icon: IconDna };
  return { colorClass: '', dotClass: '', icon: IconLayoutGrid };
};

export const getTopicIcon = (topic) => {
  return getTopicStyles(topic).icon;
};
