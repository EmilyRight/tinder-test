import styles from "./index.module.css";
import imagesList from "../../constants/constants";
import { useEffect, useRef, useState } from "react";

export const NativeDnD = () => {
  const imageRef = useRef<HTMLDivElement>(null);

  const [cards, setCards] = useState(imagesList);
  const [activeIndex, setActiveIndex] = useState<number>(cards.length - 1);
  const [isDragging, setIsDragging] = useState(false);
  const [dragStartCoords, setDragStartCoords] = useState({ x: 0, y: 0 });
  const [dragDelta, setDragDelta] = useState({ x: 0, y: 0 });

  const handleDragStart = (e: React.DragEvent<HTMLDivElement>) => {
    const { target } = e;
    if (
      target &&
      target instanceof HTMLDivElement &&
      imageRef.current === target
    ) {
      setIsDragging(true);
      setDragStartCoords({ x: e.clientX, y: e.clientY });
      e.dataTransfer?.setDragImage(new Image(), 0, 0);
      return false;
    }
  };

  const handleDrag = (e: React.DragEvent<HTMLDivElement>) => {
    const { target } = e;
    if (
      target &&
      target instanceof HTMLDivElement &&
      imageRef.current === target
    ) {
      if (isDragging) {
        const deltaX = e.clientX - dragStartCoords.x;
        const deltaY = e.clientY - dragStartCoords.y;

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
    }
  };

  const handleSwipeLeft = () => {
    if (imageRef.current) {
      imageRef.current.classList.add(`${styles.active}`);
      imageRef.current.classList.add(`${styles.swipeToLeft}`);
    }
  };

  const handleAnimationEnd = () => {
    const newCards = cards.slice(0, -1);
    setCards(newCards);
    setActiveIndex((prev) => prev - 1);
  };

  const handlecardsBack = () => {
    setCards(imagesList);
    setActiveIndex(imagesList.length - 1);
  };

  useEffect(() => {}, [cards]);

  return (
    <section className={styles.section}>
      <div className={styles.container}>
        <h2>Только кнопки (css-анимации)</h2>
        <div className={styles["cards-block"]}>
          <div className={styles.stub}>Карточки закончились</div>
          {cards.map(({ id, src }) => (
            <div
              key={id}
              className={`${styles.cardWrapper} ${
                activeIndex >= 0 && id === activeIndex ? styles.active : ""
              } `}
              draggable={activeIndex >= 0 && id === activeIndex ? true : false}
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
              onDragStart={handleDragStart}
              onDrag={handleDrag}
              onDragEnd={handleDragEnd}></div>
          ))}
        </div>
        <div className={styles.buttons}>
          <button
            className={
              activeIndex <= 0
                ? `${styles.inactive} ${styles.btn}`
                : `${styles.active} ${styles.btn}`
            }
            onClick={handleSwipeLeft}>
            Left
          </button>
          <button
            className={
              activeIndex === 0
                ? `${styles.inactive} ${styles.btn}`
                : `${styles.active} ${styles.btn}`
            }
            onClick={handlecardsBack}>
            {" "}
            Вернуть
          </button>
          <button
            className={
              activeIndex <= 0
                ? `${styles.inactive} ${styles.btn}`
                : `${styles.active} ${styles.btn}`
            }
            onClick={handleSwipeRight}>
            Right
          </button>
        </div>
      </div>
    </section>
  );
};
