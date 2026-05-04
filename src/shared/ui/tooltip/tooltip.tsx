import * as React from 'react'
import * as TooltipPrimitive from '@radix-ui/react-tooltip'

import { cn } from '@/shared/lib/utils'

const TooltipProvider = TooltipPrimitive.Provider

const Tooltip = TooltipPrimitive.Root

const TooltipTrigger = TooltipPrimitive.Trigger

interface TooltipContentProps extends Omit<
  React.ComponentPropsWithoutRef<typeof TooltipPrimitive.Content>,
  'className'
> {
  sideOffset?: number
}

const TooltipContent = React.forwardRef<
  React.ElementRef<typeof TooltipPrimitive.Content>,
  TooltipContentProps
>(({ sideOffset = 4, children, ...props }, ref) => {
  const tooltipClassName = cn(
    'z-[400] overflow-hidden rounded-md bg-neutral-950 px-3 py-2 text-xs font-medium text-neutral-50 shadow-medium',
  )

  return (
    <TooltipPrimitive.Content ref={ref} sideOffset={sideOffset} {...props}>
      <div {...{ className: tooltipClassName }}>{children}</div>
    </TooltipPrimitive.Content>
  )
})
TooltipContent.displayName = TooltipPrimitive.Content.displayName

export { Tooltip, TooltipTrigger, TooltipContent, TooltipProvider }

export type TooltipProps = React.ComponentPropsWithoutRef<
  typeof TooltipPrimitive.Root
>
export type { TooltipContentProps }
export type TooltipTriggerProps = React.ComponentPropsWithoutRef<
  typeof TooltipPrimitive.Trigger
>
