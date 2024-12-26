import styles from "./index.module.css";
import imagesList from "../../constants/constants";
import { useRef, useState } from "react";

export const NativeDnD = () => {
  const imageRefs = useRef<(HTMLDivElement | null)[]>([]);
  const [cards, setCards] = useState(imagesList);
  const [activeIndex, setActiveIndex] = useState<number>(cards.length - 1);
  const [isDragging, setIsDragging] = useState(false);
  const [isMovingLeft, setIsMovingLeft] = useState(false);
  const [isMovingRight, setIsMovingRight] = useState(false);
  const dragStartCoordsRef = useRef({ x: 0, y: 0 });
  const dragDeltaRef = useRef({ x: 0, y: 0 });
  const [rotationAngle, setRotationAngle] = useState(0);
  const rafId = useRef(0); // для хранения идентификатора requestAnimationFrame

  const preventScroll = (e: TouchEvent | MouseEvent) => {
    e.preventDefault(); // Блокируем скроллинг страницы
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
        console.log("handleDragStart drag", dragStartCoordsRef.current);
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

  const handleDrag = (
    e: React.TouchEvent<HTMLDivElement> | React.MouseEvent<HTMLDivElement>
  ) => {
    const { target } = e;
    if (!isDragging || !target) return;
    if (
      target &&
      target instanceof HTMLDivElement &&
      imageRefs.current[activeIndex] === target
    ) {
      window.addEventListener("touchmove", preventScroll, { passive: false });
      window.addEventListener("mousemove", preventScroll, { passive: false });
      const { x } = getClientCoords(e);
      const deltaX = x - dragStartCoordsRef.current.x;
      const deltaY = 0;

      dragDeltaRef.current = { x: deltaX, y: deltaY };
    }

    if (!rafId.current) {
      rafId.current = requestAnimationFrame(updateRotation);
    }
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

  const handleDragEnd = () => {
    if (isDragging && imageRefs.current[activeIndex]) {
      setIsDragging(false);
      const deltaX = dragDeltaRef.current.x;
      const deltaY = dragDeltaRef.current.y;

      if (Math.abs(deltaX) > 150 || Math.abs(deltaY) > 150) {
        const targetX = deltaX > 0 ? "200%" : "-200%";
        const targetY = deltaY > 0 ? "200%" : "-200%";

        // Применяем трансформацию
        imageRefs.current[activeIndex].style.setProperty(
          "transform",
          `translate(${targetX}, ${targetY}) rotate(${rotationAngle})`
        );
        handleAnimationEnd();
      }
    }

    dragDeltaRef.current = { x: 0, y: 0 };
    dragStartCoordsRef.current = { x: 0, y: 0 };
    setRotationAngle(0);
  };

  const handleSwipeRight = () => {
    if (imageRefs.current[activeIndex]) {
      imageRefs.current[activeIndex].classList.add(`${styles.swipeToRight}`);
      imageRefs.current[activeIndex].classList.add(`${styles.active}`);
      setIsMovingRight(true);
    }
  };

  const handleSwipeLeft = () => {
    if (imageRefs.current[activeIndex]) {
      imageRefs.current[activeIndex].classList.add(`${styles.active}`);
      imageRefs.current[activeIndex].classList.add(`${styles.swipeToLeft}`);
      setIsMovingLeft(true);
    }
  };

  const handleAnimationEnd = () => {
    const newCards = cards.slice(0, -1);
    setCards(newCards);
    setActiveIndex((prev) => prev - 1);
    setIsMovingLeft(false);
    setIsMovingRight(false);
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
          {cards.map(({ id, src }, index) => (
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
                  activeIndex >= 0 && id === activeIndex
                    ? `translate(${dragDeltaRef.current.x}px, ${dragDeltaRef.current.y}px) rotate(${rotationAngle}deg)`
                    : `translate(0px, 0px) rotate(0deg)`
                }`,
                transition: !isDragging
                  ? "transform 0.4s ease-in-out, 0.4s "
                  : "none",
              }}
              onMouseDown={handleDragStart}
              onMouseUp={handleDragEnd}
              onMouseLeave={handleDragEnd}
              onTouchStart={handleDragStart}
              onTouchMove={isDragging ? handleDrag : undefined}
              onTouchEnd={handleDragEnd}></div>
          ))}
        </div>
        <div className={styles.buttons}>
          <button
            className={
              activeIndex < 0
                ? `${styles.inactive} ${styles.btn}`
                : `${styles.active} ${styles.btn}`
            }
            onClick={handleSwipeLeft}
            disabled={activeIndex < 0 || isMovingLeft}>
            Left
          </button>
          <button
            className={
              activeIndex === imagesList.length - 1
                ? `${styles.inactive} ${styles.btn}`
                : `${styles.active} ${styles.btn}`
            }
            onClick={handlecardsBack}
            disabled={activeIndex === imagesList.length - 1}>
            {" "}
            Вернуть
          </button>
          <button
            className={
              activeIndex < 0
                ? `${styles.inactive} ${styles.btn}`
                : `${styles.active} ${styles.btn}`
            }
            onClick={handleSwipeRight}
            disabled={activeIndex < 0 || isMovingRight}>
            Right
          </button>
        </div>
      </div>
    </section>
  );
};
