// VN240716.1

'use client'

import { Button } from '@/components/Button';  // See my Button component, or just use a regular <button>
import React, { useState, useRef, useEffect, useCallback } from 'react';
import Image from 'next/image'; // Remove if you're not using next.js. Replace <Image> with <img>
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';

gsap.registerPlugin(useGSAP);

type CarouselContent = {
    img: string,
    description: string
}

type CarouselProps = {
    content: CarouselContent[],
}

// Usage
// const testContent = [
//     {img: '/car1.jpg', description: 'Car exterior.'},
//     {img: '/car2.jpg', description: 'Car mirror.'},
//     {img: '/car3.jpg', description: 'Over the wheel wet.'},
//     {img: '/car4.jpg', description: 'Over the wheel dry.'}, 
// ]
// <Carousel content={testContent}/>


export const Carousel = ({ content, ...props } : CarouselProps) => {

    const imgArray = [content[content.length - 1], ...content, content[0]]
    const [activeFrame, setActiveFrame] = useState<number>(1)
    const [activeDot, setActiveDot] = useState<number>(0)
    const [moving, setMoving] = useState(false) // BOOO to this solution, but it works.
    const [imgWidth, setImgWidth] = useState(0)
    const [touchStart, setTouchStart] = useState<number | null>(null);
    const [touchEnd, setTouchEnd] = useState<number | null>(null);
    const carouselRef = useRef<HTMLDivElement>(null);
    const parentRef = useRef<HTMLDivElement>(null);
    const { contextSafe } = useGSAP()

    // Handling touch controls.

    const handleTouchStart = (e: React.TouchEvent) => {
        setTouchStart(e.targetTouches[0].clientX);
    };
    
    const handleTouchMove = (e: React.TouchEvent) => {
        setTouchEnd(e.targetTouches[0].clientX);
    };
    
    const handleTouchEnd = () => {
        if (!touchStart || !touchEnd) return;
        const distance = touchStart - touchEnd;
        const isLeftSwipe = distance > 50;
        const isRightSwipe = distance < -50;
        if (isLeftSwipe) {
            nextSlide();
        } else if (isRightSwipe) {
            prevSlide();
        }
        // Reset values
        setTouchStart(null);
        setTouchEnd(null);
    };

    // goToSlide handles random access via the indicators, centering the image when resizing and the infinite loop illusion.
    const goToSlide = contextSafe((index: number, instant: boolean) => {
        let animaionDuration
        if (instant) {
            animaionDuration = 0
        } else {
            animaionDuration = 0.4
        }
        const newPosition = -imgWidth * (index); 
        gsap.to(carouselRef.current, {
            x: newPosition,
            duration: animaionDuration,
            ease:'expoScale(0.5,6,power1.inOut)',
            onComplete: () => {
                setActiveFrame(index);
                setActiveDot(index - 1)
            }
        });
    });

    // Function to handle going to the next slide.
    const nextSlide = contextSafe(() => {
        if(!moving){
        setMoving(true)
        const newActive = (activeFrame + 1) % imgArray.length;
        const newActiveDot = (activeDot + 1) % content.length;
        gsap.to(carouselRef.current, { 
            x: `-=${imgWidth}`, 
            duration: 0.4,
            ease:'power2inOut',
            onComplete: () => {
                setActiveFrame(newActive);
                setActiveDot(newActiveDot)
                if(newActive === imgArray.length - 1){
                    goToSlide(1, true)
                    setActiveFrame(1);
                }
                setMoving(false)
            }
        })};

    });

    // Function to handle going to the previous slide.
    const prevSlide = contextSafe(() => {
        if(!moving){
        setMoving(true)
        const newActive = (activeFrame - 1 + imgArray.length) % imgArray.length;
        const newActiveDot = (activeDot - 1 + content.length) % content.length;
        gsap.to(carouselRef.current, {
            x: activeFrame === 0 ? `+=${imgWidth}` : `+=${imgWidth}`,
            duration: 0.4,
            ease:'power2inOut',
            onComplete: () => {
                setActiveFrame(newActive);
                setActiveDot(newActiveDot)
                if(newActive === 0){
                    goToSlide((imgArray.length - 2), true)
                    setActiveFrame(imgArray.length - 2);
                }
                setMoving(false)
            }
        })};
    });

    // Handling window resizing, centering the image.
    useEffect(() => {
        const observerTarget = parentRef.current;
        const resizeObserver = new ResizeObserver(entries => {
            for (let entry of entries) {
                const width = entry.contentRect.width;
                setImgWidth(width);
            }
        });
    
        if (observerTarget) {
            resizeObserver.observe(observerTarget);
        }
    
        return () => {
            if (observerTarget) {
                resizeObserver.unobserve(observerTarget);
            }
        };
    }, []);

    useEffect(() => {
        if (imgWidth > 0) {
            goToSlide(activeFrame, true);
        }
    }, [imgWidth, activeFrame, goToSlide]);

    // Handling keyboard controls.
    const handleKeyDown = useCallback((event: KeyboardEvent) => {
        if (event.key === 'ArrowRight') {
            nextSlide();
        } else if (event.key === 'ArrowLeft') {
            prevSlide();
        }
    }, [nextSlide, prevSlide]);

    useEffect(() => {
        window.addEventListener('keydown', handleKeyDown);
        return () => {
            window.removeEventListener('keydown', handleKeyDown);
        };
    }, [handleKeyDown]);

    return(
        <div className='relative flex mt-8'>
            <div className='flex flex-col w-full h-full overflow-hidden rounded-sm'>
                <div ref={parentRef} className='flex flex-col overflow-hidden items-left bg-white w-[320px] md:w-[380px] lg:w-[440px]'>
                    <div 
                        ref={carouselRef}
                        className='flex'
                    >
                        {imgArray.map((item, index) => (
                            <div key={index} 
                            onTouchStart={handleTouchStart}
                            onTouchMove={handleTouchMove}
                            onTouchEnd={handleTouchEnd} className='flex-shrink-0'>
                                <Image
                                    src={item.img}
                                    alt={item.description}
                                    width={imgWidth}
                                    height={imgWidth}
                                    className='touch-pan-y'
                                />
                            </div>
                        ))}
                    </div>
                </div>
                <div className='flex items-center justify-between w-full h-14 bg-zinc-900 py-4'>
                    <Button onClick={() => prevSlide()} dark={false} size={'sq'} className='text-gray-300 px-2 ml-3'>
                        <h1 className='text-zinc-900 text-xs w-9'>left</h1>
                    </Button>
                    <div className='flex flex-col justify-center items-center'>
                        <div className='flex'>
                        {content.map((_, index) => (
                            <div 
                                key={index}
                                className={`transition-all flex items-center justify-center cursor-pointer h-2 w-2 mx-1 rounded-sm ${
                                    index === activeDot ? 'bg-orange-600 text-white' : 'bg-gray-300 text-white'
                                }`}
                                onClick={() => goToSlide(index + 1, false)}
                            >
                            </div>
                        ))}
                        </div>
                    </div>
                    <Button onClick={() => nextSlide()} dark={false} size={'s'} className='text-gray-300 px-2 mr-3'>
                        <h1 className='text-zinc-900 text-xs w-9'>right</h1>
                    </Button>
                </div>
            </div>
        </div>
    )
}
