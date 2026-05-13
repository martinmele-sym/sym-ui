import Tooltip from 'bootstrap/js/dist/tooltip.js'
import type { ButtonHTMLAttributes, ReactNode } from 'react'
import { useEffect, useRef } from 'react'
import designTokens from '../tokens/design_tokens.json'

type BtnProps = Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'type'> & {
  type?: ButtonHTMLAttributes<HTMLButtonElement>['type']
}

export type SymIconTooltipButtonProps = BtnProps & {
  tooltip?: string
  children: ReactNode
}

type TooltipTokenRoot = {
  tokens: {
    component: {
      tooltip: {
        iconButton: {
          delayShowMs: number
          delayHideMs: number
        }
      }
    }
  }
}

export function SymIconTooltipButton({
  tooltip,
  children,
  type = 'button',
  ...props
}: SymIconTooltipButtonProps) {
  const ref = useRef<HTMLButtonElement>(null)
  const aria = props['aria-label']
  const label =
    tooltip ?? (typeof aria === 'string' && aria.trim() ? aria.trim() : undefined)

  useEffect(() => {
    const el = ref.current
    if (!el || !label) return

    const { delayShowMs, delayHideMs } = (designTokens as TooltipTokenRoot).tokens.component.tooltip
      .iconButton

    const instance = Tooltip.getOrCreateInstance(el, {
      title: label,
      delay: { show: delayShowMs, hide: delayHideMs },
      placement: 'top',
      trigger: 'hover focus',
      container: 'body',
      customClass: 'sym-tooltip',
    })

    return () => {
      instance.dispose()
    }
  }, [label])

  return (
    <button ref={ref} type={type} {...props}>
      {children}
    </button>
  )
}
