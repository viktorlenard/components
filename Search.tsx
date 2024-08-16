// VN240620.8

import { useState, useRef, useEffect } from 'react';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';

gsap.registerPlugin(useGSAP);

export const Search = () => {

    const [isOpen, setIsOpen] = useState(false)
    const [moving, setMoving] = useState(false);

    const barRef = useRef<HTMLDivElement>(null); // Ref to target the search bar
    const contentRef = useRef<HTMLDivElement>(null); // Ref to target the bar's children
    const fieldRef = useRef<HTMLInputElement>(null); // Ref to target the input field (Open state only)
    const { contextSafe } = useGSAP({ scope: barRef });
    
    const dimensions = {
        closedWidth: 155,
        openWidth: 330,
        closedHeight: 32,
        openHeight: 50,
    }

    // Function to handle opening and closing the bar using keyboard shortcuts.
    const handleKeyDown = (event: KeyboardEvent) => {
        if (!isOpen && event.key === 'k' && (event.metaKey || event.ctrlKey)) {
            openSearch();
            setIsOpen(true);
        } else if (isOpen && event.key === 'Escape') {
            closeSearch();
            setIsOpen(false);
        } else if (isOpen && event.key === 'Enter') {
            if (fieldRef.current && fieldRef.current.value !== "") {
                // This is where actual search would happen. At the moment it just closes the search bar.
                closeSearch();
                setIsOpen(false);
            }
        }
    };

    // Adding and cleaning up the event listener for the previous function.
    useEffect(() => {
        window.addEventListener('keydown', handleKeyDown);
        return () => {
            window.removeEventListener('keydown', handleKeyDown);
        };
    }, [isOpen, moving]);

    // Focus the field when the bar opens.
    useEffect(() => {
        if (isOpen && fieldRef.current) {
            fieldRef.current.focus();
        }
    }, [isOpen]);

    // Function to handle opening and closing the bar with the icons on the right.
    const iconToggle = () => {
        if (isOpen) {
            closeSearch();
        } else if (!isOpen) {
            openSearch();
        }
    }

    // Function to handle opening the bar when <h1>Search</h1> is clicked.
    const searchToggle = () => {
        if (!isOpen) {
            openSearch();
        }
    }

    // GSAP Animation timelines.
    const openTl = useRef<GSAPTimeline>();
    const closeTl = useRef<GSAPTimeline>();

    // GSAP Animation timelines.
    const openSearch = contextSafe(() => {
        if(!moving){
        setMoving(true);
        setIsOpen(true);
        openTl.current = gsap.timeline()
            .fromTo(contentRef.current, {opacity:100 }, {opacity: 0, duration: 0})
            .fromTo(barRef.current, {y: 0 }, {y: -200, duration: 0.8, ease:'elastic.out(1,0.9)', onComplete: () => {setMoving(false)}})
            .fromTo(barRef.current, {width: dimensions.closedWidth, height: dimensions.closedHeight}, {width: dimensions.openWidth, height: dimensions.openHeight, duration: 0.8, ease:'elastic.out(1,0.9)'}, '<')
            .fromTo(contentRef.current, {opacity: 0}, {opacity: 100, delay: 0.1, duration: 0.2}, '<')
    }});

    const closeSearch = contextSafe(() => {
        if(!moving){
        setMoving(true);
        setIsOpen(false);
        closeTl.current = gsap.timeline()
            .fromTo(contentRef.current, {opacity:100 }, {opacity: 0, duration: 0})
            .fromTo(barRef.current, {y:-200 }, {y: 0, duration: 0.4, ease: 'power2.out', onComplete: () => {setMoving(false)}})
            .fromTo(barRef.current, {width: dimensions.openWidth, height: dimensions.openHeight}, {width: dimensions.closedWidth, height: dimensions.closedHeight, duration: 0.4, ease: 'power2.out'}, '<')
            .fromTo(contentRef.current, {opacity: 0}, {opacity: 100, duration: 0.2}, '<')
    }});

    return (
        <div ref={barRef} style={{width: dimensions.closedWidth, height: dimensions.closedHeight}} onClick={searchToggle} 
            className='flex justify-left items-center pl-2 rounded-2xl bg-zinc-900 overflow-hidden text-gray-300'>
            <div className='flex justify-between items-center min-h-full min-w-full'>
                <div className='flex justify-center items-center px-2'>
                    <div className='flex items-center justify-center rounded-full ml-[11px] mr-[5px]'>
                        <Magnifier />
                    </div>
                    <div ref={contentRef} className='flex items-center justify-between min-w-full'>
                        {isOpen ? (
                            <input ref={fieldRef} className='bg-zinc-900 text-gray-300 font-semibold min-w-[210px] whitespace-nowrap focus:outline-none' type="text" placeholder="Search" disabled={!isOpen} />
                        ) : (
                            <h1 className='font-semibold'>Search</h1>
                        )}
                        <div ref={contentRef} onClick={iconToggle} className='absolute right-0 mr-1 flex justify-center items-center min-h-12 cursor-pointer'>
                        {isOpen ? (
                            <div className='bg-gray-300 py-1 px-1 rounded drop-shadow-lg mr-3'>
                                <p className='text-xs font-semibold leading-none mx-[2px] text-zinc-900'>esc</p>
                            </div>
                        ) : (
                            <div className='flex items-center py-1 pr-2 text-gray-300'>
                                <CommandSVG />
                                <p className='text-sm font-semibold leading-none mx-[2px]'>K</p>
                            </div>
                        )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

// SVGs

const Magnifier = () => {
    return(
        <svg width="20" height="20" viewBox="0 0 15 15" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M10 6.5C10 8.433 8.433 10 6.5 10C4.567 10 3 8.433 3 6.5C3 4.567 4.567 3 6.5 3C8.433 3 10 4.567 10 6.5ZM9.30884 10.0159C8.53901 10.6318 7.56251 11 6.5 11C4.01472 11 2 8.98528 2 6.5C2 4.01472 4.01472 2 6.5 2C8.98528 2 11 4.01472 11 6.5C11 7.56251 10.6318 8.53901 10.0159 9.30884L12.8536 12.1464C13.0488 12.3417 13.0488 12.6583 12.8536 12.8536C12.6583 13.0488 12.3417 13.0488 12.1464 12.8536L9.30884 10.0159Z" fill="currentColor" fillRule="evenodd" clipRule="evenodd"></path></svg>
    )
}

const CommandSVG = () => {
    return(
        <svg height='11' fill="currentColor" xmlns="http://www.w3.org/2000/svg"  
            viewBox="0 0 80 80">
            <g>
                <path d="M64,48L64,48h-8V32h8c8.836,0,16-7.164,16-16S72.836,0,64,0c-8.837,0-16,7.164-16,16v8H32v-8c0-8.836-7.164-16-16-16
                    S0,7.164,0,16s7.164,16,16,16h8v16h-8l0,0l0,0C7.164,48,0,55.164,0,64s7.164,16,16,16c8.837,0,16-7.164,16-16l0,0v-8h16v7.98
                    c0,0.008-0.001,0.014-0.001,0.02c0,8.836,7.164,16,16,16s16-7.164,16-16S72.836,48.002,64,48z M64,8c4.418,0,8,3.582,8,8
                    s-3.582,8-8,8h-8v-8C56,11.582,59.582,8,64,8z M8,16c0-4.418,3.582-8,8-8s8,3.582,8,8v8h-8C11.582,24,8,20.417,8,16z M16,72
                    c-4.418,0-8-3.582-8-8s3.582-8,8-8l0,0h8v8C24,68.418,20.418,72,16,72z M32,48V32h16v16H32z M64,72c-4.418,0-8-3.582-8-8l0,0v-8
                    h7.999c4.418,0,8,3.582,8,8S68.418,72,64,72z"/>
            </g>
        </svg>
    )
}
