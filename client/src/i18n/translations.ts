// Language rules from docs/specs/i18n.md.

export const LANGUAGES = ['pt', 'en'] as const;

export type Language = (typeof LANGUAGES)[number];

export const DEFAULT_LANGUAGE: Language = 'pt';

export const LANGUAGE_NAMES: Record<Language, string> = {
  pt: 'Português',
  en: 'English',
};

export const LANGUAGE_CODES: Record<Language, string> = {
  pt: 'PT',
  en: 'EN',
};

export const HTML_LANG: Record<Language, string> = {
  pt: 'pt-BR',
  en: 'en',
};

const en = {
  'header.home': 'Home',
  'header.language': 'Language',

  'action.share': 'Share',
  'action.edit': 'Edit',
  'action.editCountdown': 'Edit countdown',
  'action.create': 'Create my countdown',
  'action.close': 'Close',

  'home.create': 'Create your countdown',
  'home.edit': 'Edit your countdown',
  'home.preview': 'Preview',

  'form.title': 'Title',
  'form.titlePlaceholder': 'Trip to Lisbon',
  'form.finishDate': 'Finish date',
  'form.background': 'Background',
  'form.background.solid': 'Solid color',
  'form.background.gradient': 'Gradient',
  'form.background.image': 'Image',
  'form.gradientPresets': 'Gradient presets',
  'form.imagePresets': 'Image presets',
  'form.imageCustom': 'Custom',
  'form.backgroundColor': 'Background color',
  'form.startColor': 'Start color',
  'form.endColor': 'End color',
  'form.fontColors': 'Font colors',
  'form.titleColor': 'Title color',
  'form.counterColor': 'Counter color',
  'form.imageUrl': 'Image URL',
  'form.imageUrlPlaceholder': 'https://example.com/beach.jpg',
  'form.colorPicker': '{label} picker',

  'validation.title': 'Enter a title for your countdown.',
  'validation.finishDate': 'Choose the finish date.',
  'validation.finishDateFuture': 'Choose a date and time in the future.',
  'validation.imageUrl': 'Enter a URL starting with http:// or https://',

  'countdown.titlePlaceholder': 'Your trip title',
  'countdown.days': 'Days',
  'countdown.hours': 'Hours',
  'countdown.minutes': 'Minutes',
  'countdown.seconds': 'Seconds',
  'countdown.chooseDate': 'Choose a finish date',
  'countdown.finished': 'The countdown has finished',

  'page.invalidTitle': 'Invalid countdown link',
  'page.invalidText': 'This link is broken or has expired. Create a new countdown to get a working link.',

  'share.title': 'Share your countdown',
  'share.link': 'Link',
  'share.linkField': 'Countdown link',
  'share.copy': 'Copy',
  'share.copied': 'Copied',
  'share.copyFailed': 'Couldn’t copy automatically. Select the link and copy it manually.',
  'share.image': 'Image',
  'share.landscape': 'Landscape',
  'share.vertical': 'Vertical',
  'share.landscapeImage': 'landscape image',
  'share.verticalImage': 'vertical image',
  'share.imageAlt': '{orientation} image of the countdown for {title}',
  'share.rendering': 'Rendering image',
  'share.preparing': 'Preparing the image…',
  'share.imageError': 'Couldn’t create the image.',
  'share.imageNeeded': 'Sharing needs the image. Copy the link above instead.',
  'share.backgroundNotice': 'The custom background image doesn’t allow sharing, so the image uses a plain background.',

  'targets.label': 'Share to',
  'targets.other': 'Other',
  'targets.choose': 'Choose where to share to see how the image and link are sent.',
  'targets.copyStep': 'The {image} is copied to your clipboard.',
  'targets.downloadStep': 'Your browser can’t copy images, so the {image} is downloaded to your computer as {file}.',
  'targets.opensStep': '{app} opens in a new tab with a message containing the countdown link.',
  'targets.pasteStep': 'Choose a chat and paste the image ({shortcut}) to attach it.',
  'targets.attachStep': 'Choose a chat and attach the downloaded image.',
  'targets.copyAction': 'Copy image and open {app}',
  'targets.downloadAction': 'Download image and open {app}',
  'targets.nativeStep': '{options} open with the {image} and a message containing the countdown link.',
  'targets.nativeChooseStep': 'Choose WhatsApp, Telegram or any other app to send them.',
  'targets.nativeNote':
    'Some apps keep only the image and drop the message. If the link is missing, copy it above and paste it in the chat.',
  'targets.nativeAction': 'Share image and link',
  'targets.linkOnlyStep': 'Your browser can share the link but not images.',
  'targets.linkOnlyOptionsStep': '{options} open with a message containing the countdown link, without the image.',
  'targets.linkOnlyAction': 'Share link',
  'targets.unsupportedMobile': 'Your browser doesn’t support sharing. Copy the link above and paste it in any app.',
  'targets.unsupportedWeb': 'Your browser doesn’t support system sharing. Use WhatsApp, Telegram or copy the link above.',
  'targets.phoneOptions': 'Your phone’s share options',
  'targets.systemOptions': 'Your system’s share options',
  'targets.shared': 'Countdown shared',
  'targets.shareFailed': 'Couldn’t open the share options. Copy the link above instead.',
  'targets.copiedFeedback': 'Image copied. Choose a chat in {app} and paste it ({shortcut}) to attach it.',
  'targets.downloadedFeedback': 'Image downloaded. Attach {file} to the {app} chat.',
  'targets.copyFailedFeedback': 'Couldn’t copy the image, so it was downloaded instead. Attach {file} to the {app} chat.',
  'targets.openApp': 'Open {app}',

  'footer.developedBy': 'Developed by',
};

export type TranslationKey = keyof typeof en;

const pt: Record<TranslationKey, string> = {
  'header.home': 'Início',
  'header.language': 'Idioma',

  'action.share': 'Compartilhar',
  'action.edit': 'Editar',
  'action.editCountdown': 'Editar contagem',
  'action.create': 'Criar minha contagem',
  'action.close': 'Fechar',

  'home.create': 'Crie sua contagem regressiva',
  'home.edit': 'Edite sua contagem regressiva',
  'home.preview': 'Prévia',

  'form.title': 'Título',
  'form.titlePlaceholder': 'Viagem para Lisboa',
  'form.finishDate': 'Data final',
  'form.background': 'Fundo',
  'form.background.solid': 'Cor sólida',
  'form.background.gradient': 'Gradiente',
  'form.background.image': 'Imagem',
  'form.gradientPresets': 'Gradientes prontos',
  'form.imagePresets': 'Imagens prontas',
  'form.imageCustom': 'Personalizada',
  'form.backgroundColor': 'Cor de fundo',
  'form.startColor': 'Cor inicial',
  'form.endColor': 'Cor final',
  'form.fontColors': 'Cores do texto',
  'form.titleColor': 'Cor do título',
  'form.counterColor': 'Cor do contador',
  'form.imageUrl': 'URL da imagem',
  'form.imageUrlPlaceholder': 'https://exemplo.com/praia.jpg',
  'form.colorPicker': 'Seletor de {label}',

  'validation.title': 'Digite um título para sua contagem.',
  'validation.finishDate': 'Escolha a data final.',
  'validation.finishDateFuture': 'Escolha uma data e hora no futuro.',
  'validation.imageUrl': 'Digite uma URL começando com http:// ou https://',

  'countdown.titlePlaceholder': 'Título da sua viagem',
  'countdown.days': 'Dias',
  'countdown.hours': 'Horas',
  'countdown.minutes': 'Minutos',
  'countdown.seconds': 'Segundos',
  'countdown.chooseDate': 'Escolha a data final',
  'countdown.finished': 'A contagem terminou',

  'page.invalidTitle': 'Link de contagem inválido',
  'page.invalidText': 'Este link está quebrado ou expirou. Crie uma nova contagem para ter um link válido.',

  'share.title': 'Compartilhe sua contagem',
  'share.link': 'Link',
  'share.linkField': 'Link da contagem',
  'share.copy': 'Copiar',
  'share.copied': 'Copiado',
  'share.copyFailed': 'Não foi possível copiar automaticamente. Selecione o link e copie manualmente.',
  'share.image': 'Imagem',
  'share.landscape': 'Horizontal',
  'share.vertical': 'Vertical',
  'share.landscapeImage': 'imagem horizontal',
  'share.verticalImage': 'imagem vertical',
  'share.imageAlt': 'Imagem {orientation} da contagem para {title}',
  'share.rendering': 'Gerando imagem',
  'share.preparing': 'Preparando a imagem…',
  'share.imageError': 'Não foi possível criar a imagem.',
  'share.imageNeeded': 'O compartilhamento precisa da imagem. Copie o link acima.',
  'share.backgroundNotice': 'A imagem de fundo personalizada não permite compartilhamento, então a imagem usa um fundo simples.',

  'targets.label': 'Compartilhar com',
  'targets.other': 'Outros',
  'targets.choose': 'Escolha onde compartilhar para ver como a imagem e o link são enviados.',
  'targets.copyStep': 'A {image} é copiada para sua área de transferência.',
  'targets.downloadStep':
    'Seu navegador não copia imagens, então a {image} é baixada no seu computador como {file}.',
  'targets.opensStep': 'O {app} abre em uma nova aba com uma mensagem contendo o link da contagem.',
  'targets.pasteStep': 'Escolha uma conversa e cole a imagem ({shortcut}) para anexá-la.',
  'targets.attachStep': 'Escolha uma conversa e anexe a imagem baixada.',
  'targets.copyAction': 'Copiar imagem e abrir o {app}',
  'targets.downloadAction': 'Baixar imagem e abrir o {app}',
  'targets.nativeStep': '{options} abrem com a {image} e uma mensagem contendo o link da contagem.',
  'targets.nativeChooseStep': 'Escolha WhatsApp, Telegram ou qualquer outro app para enviar.',
  'targets.nativeNote':
    'Alguns apps mantêm apenas a imagem e descartam a mensagem. Se o link faltar, copie-o acima e cole na conversa.',
  'targets.nativeAction': 'Compartilhar imagem e link',
  'targets.linkOnlyStep': 'Seu navegador compartilha o link, mas não imagens.',
  'targets.linkOnlyOptionsStep': '{options} abrem com uma mensagem contendo o link da contagem, sem a imagem.',
  'targets.linkOnlyAction': 'Compartilhar link',
  'targets.unsupportedMobile':
    'Seu navegador não suporta compartilhamento. Copie o link acima e cole em qualquer app.',
  'targets.unsupportedWeb':
    'Seu navegador não suporta o compartilhamento do sistema. Use WhatsApp, Telegram ou copie o link acima.',
  'targets.phoneOptions': 'As opções de compartilhamento do seu celular',
  'targets.systemOptions': 'As opções de compartilhamento do seu sistema',
  'targets.shared': 'Contagem compartilhada',
  'targets.shareFailed': 'Não foi possível abrir as opções de compartilhamento. Copie o link acima.',
  'targets.copiedFeedback': 'Imagem copiada. Escolha uma conversa no {app} e cole ({shortcut}) para anexá-la.',
  'targets.downloadedFeedback': 'Imagem baixada. Anexe {file} à conversa do {app}.',
  'targets.copyFailedFeedback':
    'Não foi possível copiar a imagem, então ela foi baixada. Anexe {file} à conversa do {app}.',
  'targets.openApp': 'Abrir o {app}',

  'footer.developedBy': 'Desenvolvido por',
};

export const translations: Record<Language, Record<TranslationKey, string>> = { en, pt };

export function isLanguage(value: unknown): value is Language {
  return LANGUAGES.includes(value as Language);
}
