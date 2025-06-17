import React, {
  useRef,
  useState,
  useEffect,
  ReactNode,
  MouseEventHandler,
  UIEvent,
} from "react";
import { motion, useInView } from "framer-motion";

const animateListStyles = `
.scroll-list-container {
  position: relative;
  width: 500px;
  max-width: 100%;
}

.scroll-list {
  max-height: 300px; /* Reduced height to fit within stepper */
  overflow-y: auto;
  padding: 16px;
}

.scroll-list::-webkit-scrollbar {
  width:4px;
}

.scroll-list::-webkit-scrollbar-track {
  background: #733f10;
}

.scroll-list::-webkit-scrollbar-thumb {
  background: #733f10;
  border-radius: 4px;
}

.no-scrollbar::-webkit-scrollbar {
  height: 20%;
  display: none;
}

.no-scrollbar {
  -ms-overflow-style: none;
  scrollbar-width: none;
}

.item {
  padding: 16px;
  background-color: #733f10;
  border-radius: 8px;
  margin-bottom: 1rem;
  transition: all 0.2s ease;
  border: 2px solid transparent;
}

.item.selected {
  background-color: #ce8c00;
  border: 2px solid #ffd246;
  box-shadow: 0 0 15px rgba(226, 113, 0, 0.4);
}

.item-text {
  color: #fffac2;
  margin: 0;
}

.top-gradient {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 50px;
  background: linear-gradient(to bottom, #060010, transparent);
  pointer-events: none;
  transition: opacity 0.3s ease;
}

.bottom-gradient {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  height: 100px;
  background: linear-gradient(to top, #060010, transparent);
  pointer-events: none;
  transition: opacity 0.3s ease;
}`

interface AnimatedItemProps {
  children: ReactNode;
  delay?: number;
  index: number;
  onMouseEnter?: MouseEventHandler<HTMLDivElement>;
  onClick?: MouseEventHandler<HTMLDivElement>;
}

const AnimatedItem: React.FC<AnimatedItemProps> = ({
  children,
  delay = 0,
  index,
  onMouseEnter,
  onClick,
}) => {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { amount: 0.5, once: false });
  return (
    <motion.div
      ref={ref}
      data-index={index}
      onMouseEnter={onMouseEnter}
      onClick={onClick}
      initial={{ scale: 0.7, opacity: 0 }}
      animate={inView ? { scale: 1, opacity: 1 } : { scale: 0.7, opacity: 0 }}
      transition={{ duration: 0.2, delay }}
      style={{ marginBottom: "1rem", cursor: "pointer" }}
    >
      {children}
    </motion.div>
  );
};

interface AnimatedListProps {
  items?: string[];
  onItemSelect?: (item: string, index: number) => void;
  onMultiSelect?: (items: string[], indices: number[]) => void;
  showGradients?: boolean;
  enableArrowNavigation?: boolean;
  className?: string;
  itemClassName?: string;
  displayScrollbar?: boolean;
  initialSelectedIndex?: number;
  allowHtml?: boolean;
  multiSelect?: boolean; // New prop to enable multi-selection
}

const AnimatedList: React.FC<AnimatedListProps> = ({
  items = [
    "Item 1",
    "Item 2",
    "Item 3",
    "Item 4",
    "Item 5",
    "Item 6"
  ],
  onItemSelect,
  onMultiSelect,
  showGradients = false,
  enableArrowNavigation = true,
  className = "",
  itemClassName = "",
  displayScrollbar = true,
  initialSelectedIndex = -1,
  allowHtml = false,
  multiSelect = false,
}) => {
  const listRef = useRef<HTMLDivElement>(null);
  const [selectedIndex, setSelectedIndex] = useState<number>(initialSelectedIndex);
  const [selectedIndices, setSelectedIndices] = useState<number[]>([]);
  const [keyboardNav, setKeyboardNav] = useState<boolean>(false);
  const [topGradientOpacity, setTopGradientOpacity] = useState<number>(0);
  const [bottomGradientOpacity, setBottomGradientOpacity] = useState<number>(1);

  const handleScroll = (e: UIEvent<HTMLDivElement>) => {
    const target = e.target as HTMLDivElement;
    const { scrollTop, scrollHeight, clientHeight } = target;
    setTopGradientOpacity(Math.min(scrollTop / 50, 1));
    const bottomDistance = scrollHeight - (scrollTop + clientHeight);
    setBottomGradientOpacity(
      scrollHeight <= clientHeight ? 0 : Math.min(bottomDistance / 50, 1)
    );
  };

  useEffect(() => {
    if (!enableArrowNavigation) return;
    
    // Handle item selection logic
    const handleItemSelection = (index: number, ctrlKey: boolean = false) => {
      if (multiSelect) {
        setSelectedIndices(prev => {
          let newSelectedIndices = [...prev];
          
          if (ctrlKey) {
            // Toggle selection with Ctrl/Cmd
            if (newSelectedIndices.includes(index)) {
              newSelectedIndices = newSelectedIndices.filter(i => i !== index);
            } else {
              newSelectedIndices.push(index);
            }
          } else {
            // Single selection or replace all
            newSelectedIndices = [index];
          }
          
          if (onMultiSelect) {
            const selectedItems = newSelectedIndices.map(i => items[i]);
            onMultiSelect(selectedItems, newSelectedIndices);
          }
          
          return newSelectedIndices;
        });
      } else {
        // Single selection mode
        setSelectedIndex(index);
        if (onItemSelect) {
          onItemSelect(items[index], index);
        }
      }
    };
    
    const handleKeyDown = (e: KeyboardEvent) => {
      // Only handle arrow keys if no input is focused
      const activeElement = document.activeElement;
      const isInputFocused = activeElement && (
        activeElement.tagName === 'INPUT' || 
        activeElement.tagName === 'TEXTAREA' ||
        (activeElement as HTMLElement).contentEditable === 'true'
      );
      
      if (isInputFocused) return;
      
      if (e.key === "ArrowDown") {
        e.preventDefault();
        setKeyboardNav(true);
        setSelectedIndex((prev) => {
          // If no item is selected, start with first item
          if (prev === -1) return 0;
          return Math.min(prev + 1, items.length - 1);
        });
      } else if (e.key === "ArrowUp") {
        e.preventDefault();
        setKeyboardNav(true);
        setSelectedIndex((prev) => {
          // If no item is selected, start with last item
          if (prev === -1) return items.length - 1;
          return Math.max(prev - 1, 0);
        });
      } else if (e.key === "Enter" || e.key === " ") {
        if (selectedIndex >= 0 && selectedIndex < items.length) {
          e.preventDefault();
          handleItemSelection(selectedIndex, e.ctrlKey || e.metaKey);
        }
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [items, selectedIndex, selectedIndices, onItemSelect, onMultiSelect, enableArrowNavigation, multiSelect]);

  // Handle item selection logic for click events
  const handleClickSelection = (index: number, ctrlKey: boolean = false) => {
    if (multiSelect) {
      setSelectedIndices(prev => {
        let newSelectedIndices = [...prev];
        
        // In multi-select mode, always toggle selection (no need for Ctrl)
        if (newSelectedIndices.includes(index)) {
          newSelectedIndices = newSelectedIndices.filter(i => i !== index);
        } else {
          newSelectedIndices.push(index);
        }
        
        if (onMultiSelect) {
          const selectedItems = newSelectedIndices.map(i => items[i]);
          onMultiSelect(selectedItems, newSelectedIndices);
        }
        
        return newSelectedIndices;
      });      } else {
        // Single selection mode - only allow one item to be selected at a time
        // Always select the clicked item (no toggle behavior for single select)
        setSelectedIndex(index);
        if (onItemSelect) {
          onItemSelect(items[index], index);
        }
      }
  };

  useEffect(() => {
    if (!keyboardNav || selectedIndex < 0 || !listRef.current) return;
    const container = listRef.current;
    const selectedItem = container.querySelector(
      `[data-index="${selectedIndex}"]`
    ) as HTMLElement | null;
    if (selectedItem) {
      const extraMargin = 50;
      const containerScrollTop = container.scrollTop;
      const containerHeight = container.clientHeight;
      const itemTop = selectedItem.offsetTop;
      const itemBottom = itemTop + selectedItem.offsetHeight;
      if (itemTop < containerScrollTop + extraMargin) {
        container.scrollTo({ top: itemTop - extraMargin, behavior: "smooth" });
      } else if (
        itemBottom >
        containerScrollTop + containerHeight - extraMargin
      ) {
        container.scrollTo({
          top: itemBottom - containerHeight + extraMargin,
          behavior: "smooth",
        });
      }
    }
    setKeyboardNav(false);
  }, [selectedIndex, keyboardNav]);

  return (
    <>
    <style>{animateListStyles}</style>
    <div className={`scroll-list-container ${className}`}>
      <div
        ref={listRef}
        className={`scroll-list ${!displayScrollbar ? "no-scrollbar" : ""}`}
        onScroll={handleScroll}
        tabIndex={0}
        style={{ outline: 'none' }}
        onFocus={() => {
          // When the list gets focus, ensure we have a selected item
          if (selectedIndex === -1 && items.length > 0) {
            setSelectedIndex(initialSelectedIndex >= 0 ? initialSelectedIndex : 0);
          }
        }}
      >
        {items.map((item, index) => {
          const isSelected = multiSelect 
            ? selectedIndices.includes(index) 
            : selectedIndex === index;
            
          return (
          <AnimatedItem
            key={index}
            delay={0.1}
            index={index}
            onMouseEnter={() => {
              // Only update hover selection in single-select mode if no item is currently selected
              if (!multiSelect && selectedIndex === -1) {
                setSelectedIndex(index);
              }
            }}
            onClick={(e) => {
              // For multi-select, always toggle on click (no Ctrl needed)
              // For single-select, still respect Ctrl for potential future features
              const ctrlKey = multiSelect ? false : (e.ctrlKey || e.metaKey);
              handleClickSelection(index, ctrlKey);
            }}
          >
            <div
              className={`item ${isSelected ? "selected" : ""} ${itemClassName}`}
            >
              {allowHtml ? (
                <p 
                  className="item-text" 
                  dangerouslySetInnerHTML={{ __html: item }}
                />
              ) : (
                <p className="item-text">{item}</p>
              )}
            </div>
          </AnimatedItem>
          );
        })}
      </div>
      {showGradients && (
        <>
          <div
            className="top-gradient"
            style={{ opacity: topGradientOpacity }}
          ></div>
          <div
            className="bottom-gradient"
            style={{ opacity: bottomGradientOpacity }}
          ></div>
        </>
      )}
    </div>
    </>
  );
};

export default AnimatedList;