import React, { useRef } from "react";

interface SwipeTabsWrapperProps {
    onSwipeLeft: () => void;
    onSwipeRight: () => void;
    children: React.ReactNode;
}

export function SwipeTabsWrapper({ onSwipeLeft, onSwipeRight, children }: SwipeTabsWrapperProps) {
    const touchStartX = useRef<number | null>(null);

    function handleTouchStart(e: React.TouchEvent) {
        touchStartX.current = e.touches[0].clientX;
    }

    function handleTouchEnd(e: React.TouchEvent) {
        if (touchStartX.current === null) return;
        const deltaX = e.changedTouches[0].clientX - touchStartX.current;
        const threshold = 50; // mínimo px para detectar swipe

        if (deltaX > threshold) onSwipeRight();
        if (deltaX < -threshold) onSwipeLeft();

        touchStartX.current = null;
    }

    return (
        <div onTouchStart={handleTouchStart} onTouchEnd={handleTouchEnd}>
            {children}
        </div>
    );
}
