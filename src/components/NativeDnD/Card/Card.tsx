import React, {
  forwardRef,
  Ref,
  useEffect,
  useRef,
  useState,
} from "react";
import styles from "../index.module.css";
import useWindowSize from "../../TinderCard/useWindowSize";
import { useDragContext } from "../../../context/context";

type TCardProps = {
  id: number;
  src: string;
  isActive: boolean;
  handleButtons: (delta: number) => void;
  handleAnimationEnd: (id: number) => void;
};

const Card = forwardRef<HTMLDivElement, TCardProps>(
  (
    { id, src, isActive, handleButtons, handleAnimationEnd },
    ref: Ref<HTMLDivElement> | null
  ) => {
    const [dragDelta, setDragDelta] = useState({ x: 0, y: 0 });
    const [rotationAngle, setRotationAngle] = useState(0);
    const [opacity, setOpacity] = useState(1);
    const { isDragging, setIsDragging } = useDragContext();
    const dragStartCoordsRef = useRef({ x: 0, y: 0 });
    const rafId = useRef(0);
    const { width } = useWindowSize();
    const animationThreshold = width && width < 768 ? 60 : 80;

    const keyFrames: Keyframe[] | PropertyIndexedKeyframes = [
      {
        opacity: opacity,
        transform: `translate(${dragDelta.x}px, ${dragDelta.y}px) rotate(${rotationAngle}deg)`,
      },
      {
        opacity: 0,
        transform: `translate(${dragDelta.x}%, ${dragDelta.y}%) rotate(${
          rotationAngle * 2
        }deg)`,
      },
    ];

    const options: KeyframeAnimationOptions = {
      duration: 500,
      iterations: 1,
      fill: "forwards",
    };

    const handleDragStart = (
      e: React.TouchEvent<HTMLDivElement> | React.MouseEvent<HTMLDivElement>
    ) => {
      setIsDragging(true);
      window.addEventListener("touchmove", preventScroll, { passive: false });
      window.addEventListener("mousemove", preventScroll, { passive: false });
      if ("touches" in e) {
        dragStartCoordsRef.current = {
          x: e.touches[0].clientX,
          y: e.touches[0].clientY,
        };
      } else {
        dragStartCoordsRef.current = { x: e.clientX, y: e.clientY };
      }
    };

    const preventScroll = (e: TouchEvent | MouseEvent) => {
      e.preventDefault();
    };

    const getClientCoords = (
      e: React.TouchEvent<HTMLDivElement> | React.MouseEvent<HTMLDivElement>
    ) => {
      if ("touches" in e) {
        return { x: e.touches[0].clientX, y: e.touches[0].clientY };
      }
      return { x: e.clientX, y: e.clientY };
    };

    const handleDrag = (
      e: React.TouchEvent<HTMLDivElement> | React.MouseEvent<HTMLDivElement>
    ) => {
      const { target } = e;
      if (!isDragging || !target) return;
      const { x, y } = getClientCoords(e);
      const MIN_OPACITY = 0;
      const MAX_OPACITY = 1;

      const deltaX = x - dragStartCoordsRef.current.x;
      const deltaY =
        y - dragStartCoordsRef.current.y > 0
          ? y - dragStartCoordsRef.current.y
          : 0;
      setDragDelta({ x: deltaX, y: deltaY });
      handleButtons(deltaX);
      setOpacity(() => {
        const opacityValue = Math.min(
          Math.max(Math.abs(animationThreshold / deltaX), MIN_OPACITY),
          MAX_OPACITY
        );
        return isNaN(opacityValue) ? MAX_OPACITY : opacityValue;
      });
    };

    const handleDragEnd = (
      e: React.TouchEvent<HTMLDivElement> | React.MouseEvent<HTMLDivElement>
    ) => {
      const { target } = e;
      if (!isDragging || !target) return;
      if (ref && "current" in ref && ref.current instanceof HTMLDivElement) {
        setAnimation(ref.current);
      }
      setIsDragging(false);
      setOpacity(1);
      setDragDelta({ x: 0, y: 0 });
      dragStartCoordsRef.current = { x: 0, y: 0 };
      setRotationAngle(0);
    };

    const setAnimation = (el: HTMLDivElement) => {
      const deltaX = dragDelta.x;

      if (Math.abs(deltaX) > animationThreshold) {
        const animation = el.animate(keyFrames, options);
        animation.finished.then(() => {
          handleAnimationEnd(id);
        });
      }
    };

    const handleCardFlyOut = () => {
      handleAnimationEnd(id);
    };

    useEffect(() => {
      return () => {
        window.removeEventListener("touchmove", preventScroll);
        window.removeEventListener("mousemove", preventScroll);
      };
    }, []);

    useEffect(() => {
      if (isDragging) {
        const update = () => {
          setRotationAngle(Math.max(-15, Math.min(15, dragDelta.x / 20)));
          rafId.current = requestAnimationFrame(update);
        };
        rafId.current = requestAnimationFrame(update);
      } else {
        cancelAnimationFrame(rafId.current);
      }
      return () => cancelAnimationFrame(rafId.current);
    }, [isDragging, dragDelta.x]);

    return (
      <div
        key={id}
        className={`${styles.cardWrapper} ${
          id >= 0 && isActive ? styles.active : ""
        } `}
        onAnimationEnd={handleCardFlyOut}
        ref={ref}
        style={{
          backgroundImage: `url(${src})`,
          backgroundRepeat: "no-repeat",
          backgroundSize: "cover",
          transform: `${
            id >= 0 && isActive && isDragging
              ? `translate(${dragDelta.x}px, ${dragDelta.y}px) rotate(${rotationAngle}deg)`
              : `unset`
          }`,
          transition: isDragging ? "none" : "transform 0.4s linear",
          opacity: id >= 0 && isActive ? opacity : 1,
        }}
        onMouseDown={handleDragStart}
        onMouseUp={handleDragEnd}
        onMouseLeave={handleDragEnd}
        onTouchStart={handleDragStart}
        onTouchMove={isDragging ? handleDrag : undefined}
        onTouchEnd={handleDragEnd}
        onMouseMove={isDragging ? handleDrag : undefined}></div>
    );
  }
);

export default Card;
