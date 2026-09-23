import { useEffect, useRef, useState, type ButtonHTMLAttributes } from 'react'
import { SymIconTooltipButton } from './SymIconTooltipButton'

/** Keep in sync with symphonica.css `@container sym-card-header-bottom` rules (§5.5). */
export const SYM_HEADER_CREATE_FULL_LABEL_MIN_PX = 1600
export const SYM_HEADER_CREATE_ICON_ONLY_MAX_PX = 479

export type SymHeaderCreateButtonProps = Omit<
  ButtonHTMLAttributes<HTMLButtonElement>,
  'type' | 'children'
> & {
  /** Entity noun for default labels — e.g. "Resource" → "Create Resource" / "Resource". */
  entityLabel: string
  fullLabel?: string
  shortLabel?: string
  tooltip?: string
  type?: ButtonHTMLAttributes<HTMLButtonElement>['type']
}

/** Responsive Primary Create CTA for Filters / Pills card headers (§5.5). */
export function SymHeaderCreateButton({
  entityLabel,
  fullLabel,
  shortLabel,
  tooltip,
  className = '',
  type = 'button',
  ...props
}: SymHeaderCreateButtonProps) {
  const resolvedFull = fullLabel ?? `Create ${entityLabel}`
  const resolvedShort = shortLabel ?? entityLabel
  const resolvedTooltip = tooltip ?? resolvedFull

  const wrapRef = useRef<HTMLSpanElement>(null)
  const [iconOnly, setIconOnly] = useState(false)

  useEffect(() => {
    const bottom = wrapRef.current?.closest('.sym-card-header__bottom')
    if (!bottom) return

    const sync = () => {
      setIconOnly(bottom.clientWidth <= SYM_HEADER_CREATE_ICON_ONLY_MAX_PX)
    }

    sync()
    const ro = new ResizeObserver(sync)
    ro.observe(bottom)
    return () => ro.disconnect()
  }, [])

  const classes = [
    'sym-btn-filled-primary',
    'sym-header-create-btn',
    iconOnly ? 'sym-header-create-btn--icon-only sym-btn-filled-primary--icon-only' : '',
    className,
  ]
    .filter(Boolean)
    .join(' ')

  return (
    <span ref={wrapRef} className="sym-header-create-btn-wrap">
      {iconOnly ? (
        <SymIconTooltipButton
          className={classes}
          type={type}
          tooltip={resolvedTooltip}
          aria-label={resolvedTooltip}
          {...props}
        >
          <span className="material-icons-outlined" aria-hidden>
            add
          </span>
        </SymIconTooltipButton>
      ) : (
        <button type={type} className={classes} {...props}>
          <span className="material-icons-outlined" aria-hidden>
            add
          </span>
          <span className="sym-header-create-btn__label sym-header-create-btn__label--full">
            {resolvedFull}
          </span>
          <span className="sym-header-create-btn__label sym-header-create-btn__label--short">
            {resolvedShort}
          </span>
        </button>
      )}
    </span>
  )
}
