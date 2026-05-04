export type CalendlyPrefill = {
  name?: string
  email?: string
  firstName?: string
  lastName?: string
  customAnswers?: Record<string, string>
}

export type CalendlyInitInlineOptions = {
  url: string
  parentElement: HTMLElement
  prefill?: CalendlyPrefill
  utm?: Record<string, string>
}

declare global {
  interface Window {
    Calendly?: {
      initInlineWidget: (options: CalendlyInitInlineOptions) => void
      initPopupWidget: (options: {
        url: string
        prefill?: CalendlyPrefill
        utm?: Record<string, string>
      }) => void
      closePopupWidget: () => void
    }
  }
}

export {}
