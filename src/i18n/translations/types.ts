export type Translations = {
  header: {
    nav: { home: string; about: string; services: string; blog: string; contact: string }
    cta: string
    menuLabel: string
    logoLabel: string
  }
  hero: {
    badge: string
    title: string
    subtitle: string
    description: string
    ctaPrimary: string
    ctaSecondary: string
    stats: { consultations: string; years: string; studios: string }
  }
  servicesSection: {
    badge: string
    heading: string
    description: string
    cards: { title: string; text: string }[]
    cta: string
    ctaMobile: string
  }
  about: {
    badge: string
    heading: string
    description: string
    missionLabel: string
    missionText: string
    cta: string
  }
  values: {
    heading: string
    cards: { title: string; text: string; image: string }[]
  }
  plans: {
    heading: string
    description: string
    trustPoints: { title: string; text: string }[]
    cta: string
    callLabel: string
  }
  contact: {
    badge: string
    heading: string
    cta: string
    address: string
    phone: string
  }
  footer: {
    logo: string
    description: string
    navHeading: string
    servicesHeading: string
    contactHeading: string
    hoursHeading: string
    schedule: string
    followHeading: string
    cta: string
    copyright: string
    links: { home: string; about: string; services: string; contact: string; privacy: string; terms: string }
  }
  blog: {
    title: string
    description: string
    allLabel: string
    empty: string
    backLink: string
    readMore: string
  }
  login: {
    title: string
    emailPlaceholder: string
    passwordPlaceholder: string
    submitLabel: string
    loadingLabel: string
    error: string
    restricted: string
  }
  servicePage: {
    heroBadge: string
    heroTitle: string
    heroTitleHighlight: string
    services: { podologieGenerale: string; sportif: string; enfants: string; personnesAgees: string }
    cta: string
  }
  common: {
    loading: string
    error: string
    close: string
  }
  serviceSubPages: {
    schedule: { title: string; heading: string; cta: string }
    sportif: { title: string; heading: string; cta: string }
    children: { title: string; heading: string; cta: string }
    oldPeople: { title: string; heading: string; cta: string }
  }
  contactPage: {
    title: string
    subtitle: string
    description: string
    infoHeading: string
    phone: string
    email: string
    address: string
    hours: string
    schedule: string
    formHeading: string
    form: {
      name: string
      namePlaceholder: string
      email: string
      emailPlaceholder: string
      phone: string
      phonePlaceholder: string
      subject: string
      subjectPlaceholder: string
      subjectOptions: { appointment: string; info: string; urgent: string; other: string }
      message: string
      messagePlaceholder: string
      submit: string
      sending: string
      success: string
      error: string
    }
    followHeading: string
    practicalHeading: string
    practicalInfo: { parking: string; access: string; confidentiality: string; payment: string }
    cta: string
    ctaButton: string
    urgentNotice: string
  }
}
