import styles from "./index.module.css";
import imagesList from "../../constants/constants";
import { useEffect, useRef, useState } from "react";

export const NativeDnD = () => {
  const imageRef = useRef<HTMLDivElement>(null);

  const [cards, setCards] = useState(imagesList);
  const [activeIndex, setActiveIndex] = useState<number>(cards.length - 1);
  const [isDragging, setIsDragging] = useState(false);
  const [isMovingLeft, setIsMovingLeft] = useState(false);
  const [isMovingRight, setIsMovingRight] = useState(false);
  const [dragStartCoords, setDragStartCoords] = useState({ x: 0, y: 0 });
  const [dragDelta, setDragDelta] = useState({ x: 0, y: 0 });

  const handleDragStart = (
    e: React.TouchEvent<HTMLDivElement> | React.MouseEvent<HTMLDivElement>
  ) => {
    const { target } = e;
    if (
      target &&
      target instanceof HTMLDivElement &&
      imageRef.current === target
    ) {
      setIsDragging(true);
      if ("touches" in e) {
        setDragStartCoords({
          x: e.touches[0].clientX,
          y: e.touches[0].clientY,
        });
      } else {
        setDragStartCoords({ x: e.clientX, y: e.clientY });
      }
    }
  };

  const handleDrag = (
    e: React.TouchEvent<HTMLDivElement> | React.MouseEvent<HTMLDivElement>
  ) => {
    const { target } = e;
    if (!isDragging || !target) return;
    if (
      target &&
      target instanceof HTMLDivElement &&
      imageRef.current === target
    ) {
      let clientX = 0,
        clientY = 0;
      if ("touches" in e) {
        clientX = e.touches[0].clientX;
        clientY = e.touches[0].clientY;
      } else {
        clientX = e.clientX;
        clientY = e.clientY;
      }
      const deltaX = clientX - dragStartCoords.x;
      const deltaY = clientY - dragStartCoords.y;
      if (Math.abs(deltaX) > Math.abs(deltaY)) {
        target.style.left = `${deltaX}px`;
        target.style.top = `${10 + deltaY}px`;
        setDragDelta({ x: deltaX, y: deltaY });
      }
    }
  };

  const handleDragEnd = () => {
    setIsDragging(false);

    if (dragDelta.x > 100) {
      handleSwipeRight();
    } else if (dragDelta.x < -100) {
      handleSwipeLeft();
    }
    setDragStartCoords({ x: 0, y: 0 });
    setDragDelta({ x: 0, y: 0 });
  };

  const handleSwipeRight = () => {
    if (imageRef.current) {
      imageRef.current.classList.add(`${styles.swipeToRight}`);
      imageRef.current.classList.add(`${styles.active}`);
      setIsMovingRight(true);
    }
  };

  const handleSwipeLeft = () => {
    if (imageRef.current) {
      imageRef.current.classList.add(`${styles.active}`);
      imageRef.current.classList.add(`${styles.swipeToLeft}`);
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

  useEffect(() => {}, [cards]);

  return (
    <section className={styles.section}>
      <div className={styles.container}>
        <h2>Mouse events, css-animations</h2>
        <div className={styles["cards-block"]}>
          <div className={styles.stub}>Карточки закончились</div>
          {cards.map(({ id, src }) => (
            <div
              key={id}
              className={`${styles.cardWrapper} ${
                activeIndex >= 0 && id === activeIndex ? styles.active : ""
              } `}
              onAnimationEnd={handleAnimationEnd}
              ref={activeIndex >= 0 && id === activeIndex ? imageRef : null}
              style={{
                backgroundImage: `url(${src})`,
                backgroundRepeat: "no-repeat",
                backgroundSize: "cover",
                top: `${
                  activeIndex >= 0 && id === activeIndex ? dragDelta.y + 10 : 0
                }px`,
                left: `${
                  activeIndex >= 0 && id === activeIndex ? dragDelta.x : 0
                }px`,
              }}
              onMouseDown={handleDragStart}
              onMouseMove={isDragging ? handleDrag : undefined}
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
            disabled={activeIndex < 0 || isMovingRight ? true : false}>
            Left
          </button>
          <button
            className={
              activeIndex === imagesList.length - 1
                ? `${styles.inactive} ${styles.btn}`
                : `${styles.active} ${styles.btn}`
            }
            onClick={handlecardsBack}
            disabled={activeIndex === imagesList.length - 1 ? true : false}>
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
            disabled={activeIndex < 0 || isMovingLeft ? true : false}>
            Right
          </button>
        </div>
      </div>
    </section>
  );
};
