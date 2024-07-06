// VN240630.1

// Adjust style={{ minWidth: `${buttonWidth * 1.8}px` }} width.
// Based on your choice of typeface you might need to change the 25% translates.

'use client'

import clsx from 'clsx'
import Link from 'next/link'
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import { useRef, useState, useEffect } from 'react';

gsap.registerPlugin(useGSAP);

const ButtonStyle = 'px-1 py-1 rounded-sm' 
const innerStyle = 'relative flex flex-col overflow-hidden justify-center items-center'
const spanStyle = 'leading-none whitespace-nowrap'

const sizes = {
  s: `text-xs`,
  m: `text-sm`,
  l: `text-base`,
  xl: `text-lg`,
  sq: `text-base`
}

type ButtonProps = {
  size?: keyof typeof sizes,
  dark?: boolean,
  transparent? :boolean,
} & (
    | (React.ComponentPropsWithoutRef<'button'> & { href?: undefined })
    | React.ComponentPropsWithoutRef<typeof Link>
  )

  export const Button = ({size = 'm', dark, transparent, className, children, ...props}: ButtonProps) => {

    const lightStyle = `${ButtonStyle} ${transparent ? 'text-gray-300' : 'bg-gray-300 text-zinc-900'}`
    const darkStyle = `${ButtonStyle} ${transparent ? 'text-zinc-900' : 'bg-zinc-900 text-gray-300'}`
    
    const { contextSafe } = useGSAP()
    const buttonRef = useRef<HTMLDivElement>(null)
    const [buttonHeight, setButtonHeight] = useState<number>(0)
    const [buttonWidth, setButtonWidth] = useState<number>(0)
    const [hovered, setHovered] = useState<boolean>(false)

    useEffect(() => {
      if (buttonRef.current) {
          setButtonHeight(buttonRef.current.offsetHeight)
          setButtonWidth(buttonRef.current.offsetWidth)
      }
    }, [])

    const hoverButton = contextSafe(() => {
      if(!hovered) {
          setHovered(true) 
          gsap.fromTo(buttonRef.current, {y: '25%',}, {y: '-25%', duration: 0.6, ease: 'power3.out'})
      } else if (hovered){
          setHovered(false)
          gsap.fromTo(buttonRef.current, {y: '-25%'}, {y: '25%', duration: 0.4, ease: 'power3.out'})
      }
    })

    return typeof props.href === 'undefined' ? (
          <button onMouseEnter={hoverButton} onMouseLeave={hoverButton} className={clsx( dark ?  darkStyle : lightStyle, sizes[size], className )} style={{ minWidth: `${buttonWidth * 1.8}px` }} {...props}>
            <h3 className={innerStyle} style={{height: `${buttonHeight / 2}px`}}>
                    <div ref={buttonRef} style={{transform: 'translateY(25%)'}} className='absolute flex flex-col'>
                        <span className={spanStyle}>{children}</span>
                        <span className={spanStyle}>{children}</span>
                    </div>
                </h3>
          </button>
      ) : (
        <Link onMouseEnter={hoverButton} onMouseLeave={hoverButton} className={clsx( dark ?  darkStyle : lightStyle, sizes[size], className )} style={{ minWidth: `${buttonWidth * 1.8}px` }} {...props}>
          <h3 className={innerStyle} style={{height: `${buttonHeight / 2}px`}}>
                <div ref={buttonRef} style={{transform: 'translateY(25%)'}} className='absolute flex flex-col'>
                    <span className={spanStyle}>{children}</span>
                    <span className={spanStyle}>{children}</span>
                </div>
            </h3>
        </Link>
      )
  }
