export type Lang = 'en' | 'he' | 'es' | 'fr' | 'ja';

export const LANG_STORAGE_KEY = 'zoomi-lang';

export const LANG_NAMES: Record<Lang, string> = {
  en: 'English',
  he: 'עברית',
  es: 'Español',
  fr: 'Français',
  ja: '日本語',
};

const en = {
  dir: 'ltr' as 'ltr' | 'rtl',
  chooseLang: 'Choose language',
  // Header
  openPanel: 'Open Zoom Kids Controls',
  openTitle: 'Open Zoom Kids',
  panelLabel: 'Zoom Kids Controls',
  minimize: 'Minimize',
  // Theme picker
  chooseTheme: 'Choose theme',
  themes: 'Themes',
  themeNames: { classic: 'Classic', gamer: 'Gamer', space: 'Space', candy: 'Candy' },
  // Emoji panel
  sendReaction: 'Send a reaction',
  sendReactionOf: (label: string) => `Send ${label}`,
  emojiLabels: ['Clapping', 'Thumbs Up', 'Heart', 'Ha Ha', 'Party Popper', 'Surprised'] as string[],
  // Hand raise
  raiseHandSection: 'Raise hand',
  raiseHand: 'Raise Hand',
  lowerHand: 'Lower Hand',
  // Mute toggle
  micSection: 'Microphone',
  unmute: 'Unmute',
  mute: 'Mute',
  muted: "I'm muted",
  speaking: "I'm talking",
  tapToSpeak: 'Tap to speak',
  tapToMute: 'Tap to mute',
  // Popup
  popupTitle: 'Zoom for Kids',
  popupDesc: 'Big, easy buttons for Zoom, made for kids!',
  popupTip: 'Join a Zoom meeting to see your controls.',
  popupLangs: 'Available in 5 languages',
};

const he: typeof en = {
  dir: 'rtl',
  chooseLang: 'בחר שפה',
  // Header
  openPanel: 'פתח את בקרי זום לילדים',
  openTitle: 'פתח זום לילדים',
  panelLabel: 'בקרי זום לילדים',
  minimize: 'מזער',
  // Theme picker
  chooseTheme: 'בחר עיצוב',
  themes: 'עיצובים',
  themeNames: { classic: 'קלאסי', gamer: 'גיימר', space: 'חלל', candy: 'סוכריה' },
  // Emoji panel
  sendReaction: 'שלח תגובה',
  sendReactionOf: (label: string) => `שלח תגובת ${label}`,
  emojiLabels: ['אהבה', 'סבבה', 'כל הכבוד', 'וואו', 'יאללה', 'מצחיק'] as string[],
  // Hand raise
  raiseHandSection: 'הרמת יד',
  raiseHand: 'הָרֵם יָד',
  lowerHand: 'הוֹרֵד יָד',
  // Mute toggle
  micSection: 'שליטה במיקרופון',
  unmute: 'הפעל מיקרופון',
  mute: 'השתק מיקרופון',
  muted: 'אֲנִי בְּשֶׁקֶט',
  speaking: 'אֲנִי מְדַבֵּר',
  tapToSpeak: 'לְחַץ לְדַבֵּר',
  tapToMute: 'לְחַץ לְהַשְׁתִּיק',
  // Popup
  popupTitle: 'זום לילדים',
  popupDesc: 'כפתורים גדולים וקלים לזום, מיוחד לילדים!',
  popupTip: 'הצטרפו לפגישת זום כדי לראות את הכפתורים שלכם.',
  popupLangs: 'זמין ב-5 שפות',
};

const es: typeof en = {
  dir: 'ltr',
  chooseLang: 'Elegir idioma',
  // Header
  openPanel: 'Abrir controles de Zoom para niños',
  openTitle: 'Abrir Zoom para niños',
  panelLabel: 'Controles de Zoom para niños',
  minimize: 'Minimizar',
  // Theme picker
  chooseTheme: 'Elegir tema',
  themes: 'Temas',
  themeNames: { classic: 'Clásico', gamer: 'Gamer', space: 'Espacio', candy: 'Dulce' },
  // Emoji panel
  sendReaction: 'Enviar reacción',
  sendReactionOf: (label: string) => `Enviar ${label}`,
  emojiLabels: ['Aplausos', 'Pulgares arriba', 'Corazón', 'Je je', 'Confeti', 'Sorpresa'] as string[],
  // Hand raise
  raiseHandSection: 'Levantar la mano',
  raiseHand: 'Levantar mano',
  lowerHand: 'Bajar mano',
  // Mute toggle
  micSection: 'Micrófono',
  unmute: 'Activar micro',
  mute: 'Silenciar',
  muted: 'Estoy en silencio',
  speaking: 'Estoy hablando',
  tapToSpeak: 'Toca para hablar',
  tapToMute: 'Toca para silenciar',
  // Popup
  popupTitle: 'Zoom para niños',
  popupDesc: 'Botones grandes y fáciles para Zoom, hechos para niños!',
  popupTip: 'Únete a una reunión de Zoom para ver tus controles.',
  popupLangs: 'Disponible en 5 idiomas',
};

const fr: typeof en = {
  dir: 'ltr',
  chooseLang: 'Choisir la langue',
  // Header
  openPanel: 'Ouvrir les contrôles Zoom pour enfants',
  openTitle: 'Ouvrir Zoom pour enfants',
  panelLabel: 'Contrôles Zoom pour enfants',
  minimize: 'Réduire',
  // Theme picker
  chooseTheme: 'Choisir un thème',
  themes: 'Thèmes',
  themeNames: { classic: 'Classique', gamer: 'Gamer', space: 'Espace', candy: 'Bonbon' },
  // Emoji panel
  sendReaction: 'Envoyer une réaction',
  sendReactionOf: (label: string) => `Envoyer ${label}`,
  emojiLabels: ['Applaudissements', 'Pouce en l\'air', 'Cœur', 'Ha ha', 'Confettis', 'Étonné'] as string[],
  // Hand raise
  raiseHandSection: 'Lever la main',
  raiseHand: 'Lever la main',
  lowerHand: 'Baisser la main',
  // Mute toggle
  micSection: 'Microphone',
  unmute: 'Activer le micro',
  mute: 'Couper le micro',
  muted: 'Je suis en sourdine',
  speaking: 'Je parle',
  tapToSpeak: 'Appuyez pour parler',
  tapToMute: 'Appuyez pour couper',
  // Popup
  popupTitle: 'Zoom pour enfants',
  popupDesc: 'De grands boutons faciles pour Zoom, faits pour les enfants!',
  popupTip: 'Rejoignez une réunion Zoom pour voir vos contrôles.',
  popupLangs: 'Disponible en 5 langues',
};

const ja: typeof en = {
  dir: 'ltr',
  chooseLang: '言語を選択',
  // Header
  openPanel: 'Zoom Kidsコントロールを開く',
  openTitle: 'Zoom Kidsを開く',
  panelLabel: 'Zoom Kidsコントロール',
  minimize: '最小化',
  // Theme picker
  chooseTheme: 'テーマを選択',
  themes: 'テーマ',
  themeNames: { classic: 'クラシック', gamer: 'ゲーマー', space: '宇宙', candy: 'キャンディ' },
  // Emoji panel
  sendReaction: 'リアクションを送る',
  sendReactionOf: (label: string) => `${label}を送る`,
  emojiLabels: ['拍手', '高評価', 'ハート', '笑い', '紙吹雪', '驚き'] as string[],
  // Hand raise
  raiseHandSection: '挙手',
  raiseHand: '手を挙げる',
  lowerHand: '手を下げる',
  // Mute toggle
  micSection: 'マイク',
  unmute: 'ミュート解除',
  mute: 'ミュート',
  muted: 'ミュート中',
  speaking: '話し中',
  tapToSpeak: 'タップして話す',
  tapToMute: 'タップしてミュート',
  // Popup
  popupTitle: 'Zoom Kids',
  popupDesc: 'Zoom用の大きくて使いやすいボタン、子ども向け!',
  popupTip: 'Zoomミーティングに参加してコントロールを表示しましょう。',
  popupLangs: '5言語対応',
};

export const translations: Record<Lang, typeof en> = { en, he, es, fr, ja };
export type Translations = typeof en;
