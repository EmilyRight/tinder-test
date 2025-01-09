import styles from "./index.module.css";
import imagesList from "../../constants/constants";
import { useRef, useState } from "react";
import useWindowSize from "../TinderCard/useWindowSize";
import Button from "./Button/Button";
import classNames from "classnames";

export const TinderCards = () => {
  const imageRefs = useRef<(HTMLDivElement | null)[]>([]);
  const [cards, setCards] = useState(imagesList);
  const [activeIndex, setActiveIndex] = useState<number>(cards.length - 1);
  const [isDragging, setIsDragging] = useState(false);
  const [opacity, setOpacity] = useState(1);

  const dragStartCoordsRef = useRef({ x: 0, y: 0 });
  const dragDeltaRef = useRef({ x: 0, y: 0 });
  const [rotationAngle, setRotationAngle] = useState(0);
  const rafId = useRef(0);
  const { width } = useWindowSize();
  const animationThreshold = width && width < 768 ? 30 : 60;

  const btnClass = classNames(styles.btn, [styles.type], {
    [styles.inactive]: activeIndex < 0,
    [styles.active]: activeIndex >= 0,
  });

  const backBtnClass = classNames(styles.btn, [styles.type], {
    [styles.inactive]: activeIndex === imagesList.length - 1,
    [styles.active]: activeIndex !== imagesList.length - 1,
  });

  let keyFrames: Keyframe[] | PropertyIndexedKeyframes = [
    {
      transform: `translate(${dragDeltaRef.current.x}px, ${dragDeltaRef.current.y}px) rotate(${rotationAngle}deg)`,
    },
    {
      transform: `translate(${dragDeltaRef.current.x}%, ${
        dragDeltaRef.current.y
      }%) rotate(${rotationAngle * 2}deg)`,
    },
  ];

  let options: KeyframeAnimationOptions = {
    duration: 500,
    iterations: 1,
    fill: "forwards",
  };

  const preventScroll = (e: TouchEvent | MouseEvent) => {
    e.preventDefault();
  };

  const handleDragStart = (
    e: React.TouchEvent<HTMLDivElement> | React.MouseEvent<HTMLDivElement>
  ) => {
    const { target } = e;
    if (
      target &&
      target instanceof HTMLDivElement &&
      imageRefs.current[activeIndex] === target
    ) {
      setIsDragging(true);
      if ("touches" in e) {
        dragStartCoordsRef.current = {
          x: e.touches[0].clientX,
          y: e.touches[0].clientY,
        };
      } else {
        dragStartCoordsRef.current = { x: e.clientX, y: e.clientY };
      }
    }
  };

  const getClientCoords = (
    e: React.TouchEvent<HTMLDivElement> | React.MouseEvent<HTMLDivElement>
  ) => {
    if ("touches" in e) {
      return { x: e.touches[0].clientX, y: e.touches[0].clientY };
    }
    return { x: e.clientX, y: e.clientY };
  };

  const updateRotation = () => {
    if (isDragging) {
      const { x } = dragDeltaRef.current;
      const newRotationAngle = Math.max(-15, Math.min(15, x / 20));
      setRotationAngle(newRotationAngle);
      rafId.current = requestAnimationFrame(updateRotation);
    } else {
      cancelAnimationFrame(rafId.current);
      rafId.current = 0;
    }
  };

  const handleDrag = (
    e: React.TouchEvent<HTMLDivElement> | React.MouseEvent<HTMLDivElement>
  ) => {
    const { target } = e;
    if (!isDragging || !target) return;
    if (target && imageRefs.current[activeIndex] === target) {
      const { x, y } = getClientCoords(e);
      window.addEventListener("touchmove", preventScroll, { passive: false });
      window.addEventListener("mousemove", preventScroll, { passive: false });
      const deltaX = x - dragStartCoordsRef.current.x;
      const deltaY =
        y - dragStartCoordsRef.current.y > 0
          ? y - dragStartCoordsRef.current.y
          : 0;
      dragDeltaRef.current = { x: deltaX, y: deltaY };
      setOpacity(Math.abs(animationThreshold / dragDeltaRef.current.x));
    }

    if (!rafId.current) {
      rafId.current = requestAnimationFrame(updateRotation);
    }
  };

  const handleDragEnd = (
    e: React.TouchEvent<HTMLDivElement> | React.MouseEvent<HTMLDivElement>
  ) => {
    const { target } = e;
    if (!isDragging || !target) return;
    if (
      target instanceof HTMLDivElement &&
      imageRefs.current[activeIndex] === target &&
      isDragging
    ) {
      setAnimation(target);
      setIsDragging(false);
      setOpacity(1);
      window.removeEventListener("touchmove", preventScroll);
      window.removeEventListener("mousemove", preventScroll);
    }
    dragDeltaRef.current = { x: 0, y: 0 };
    dragStartCoordsRef.current = { x: 0, y: 0 };
    setRotationAngle(0);
  };

  const handleSwipeRight = () => {
    if (imageRefs.current[activeIndex]) {
      imageRefs.current[activeIndex].classList.add(`${styles.swipeToRight}`);
      imageRefs.current[activeIndex].classList.add(`${styles.active}`);
      setIsDragging(true);
    }
  };

  const handleSwipeLeft = () => {
    if (imageRefs.current[activeIndex]) {
      imageRefs.current[activeIndex].classList.add(`${styles.active}`);
      imageRefs.current[activeIndex].classList.add(`${styles.swipeToLeft}`);
      setIsDragging(true);
    }
  };

  const setAnimation = (el: HTMLDivElement) => {
    const deltaX = dragDeltaRef.current.x;

    if (Math.abs(deltaX) > animationThreshold) {
      const animation = el.animate(keyFrames, options);
      animation.finished.then(() => {
        handleAnimationEnd();
      });
    }
  };

  const handleAnimationEnd = () => {
    const newCards = cards.filter((el) => el.id !== activeIndex);
    setCards(newCards);
    setActiveIndex((prev) => prev - 1);
    setIsDragging(false);
  };

  const handlecardsBack = () => {
    setCards(imagesList);
    setActiveIndex(imagesList.length - 1);
  };

  return (
    <section className={styles.section}>
      <div
        className={styles.container}
        onMouseMove={isDragging ? handleDrag : undefined}>
        <h2>Mouse events, css-animations</h2>
        <div className={styles["cards-block"]}>
          <div className={styles.stub}>Карточки закончились</div>
          {cards.map(({ id, src }, index) => {
            return (
              <>
                <div
                  key={id}
                  className={`${styles.cardWrapper} ${
                    activeIndex >= 0 && id === activeIndex ? styles.active : ""
                  } `}
                  onAnimationEnd={handleAnimationEnd}
                  ref={(el) => (imageRefs.current[index] = el)}
                  style={{
                    backgroundImage: `url(${src})`,
                    backgroundRepeat: "no-repeat",
                    backgroundSize: "cover",
                    transform: `${
                      activeIndex >= 0 && id === activeIndex && isDragging
                        ? `translate(${dragDeltaRef.current.x}px, ${dragDeltaRef.current.y}px) rotate(${rotationAngle}deg)`
                        : `unset`
                    }`,
                    opacity:
                      activeIndex >= 0 && id === activeIndex ? opacity : 1,
                    transition: !isDragging
                      ? "transform 0.4s linear, 0.4s "
                      : "none",
                  }}
                  onMouseDown={handleDragStart}
                  onMouseUp={handleDragEnd}
                  onMouseLeave={handleDragEnd}
                  onTouchStart={handleDragStart}
                  onTouchMove={isDragging ? handleDrag : undefined}
                  onTouchEnd={handleDragEnd}></div>
              </>
            );
          })}
        </div>
        <div className={styles.buttons}>
          <Button
            action={handleSwipeLeft}
            text='Left'
            classNames={btnClass}
            disabled={activeIndex < 0 || isDragging}
          />
          <Button
            action={handlecardsBack}
            text='Back'
            classNames={backBtnClass}
            disabled={activeIndex === imagesList.length - 1}
          />
          <Button
            action={handleSwipeRight}
            text='Right'
            classNames={btnClass}
            disabled={activeIndex < 0 || isDragging}
          />
        </div>
      </div>
    </section>
  );
};
