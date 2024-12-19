import styles from "./index.module.css";
import imagesList from "../../constants/constants";
import { useRef, useState } from "react";


export const NativeDnD = () => {
  const imageRef = useRef<HTMLImageElement>(null);

  const [cards, setCards] = useState(imagesList);
  const [activeIndex, setActiveIndex] = useState<number>(cards.length - 1);

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
    console.log(newCards, `handleAnimationEnd`);

    setCards(newCards);
    setActiveIndex((prev) => prev - 1);
  };

  const handlecardsBack = () => {
    setCards(imagesList);
    setActiveIndex(imagesList.length - 1);
  };

  const handleDragStart = () => {
    console.log("handleDrugStart");
  };

  return (
    <section className={styles.section}>
      <div className={styles.container}>
        <div className={styles["cards-block"]}>
          <div>Карточки закончились</div>
          {cards.map(({ id, src }) => (
            <div
              key={id}
              className={`${styles.cardWrapper} ${
                activeIndex >= 0 && id === activeIndex ? styles.active : ""
              } `}
              draggable={activeIndex >= 0 && id === activeIndex ? true : false}
              onAnimationEnd={handleAnimationEnd}
              onDragStart={handleDragStart}
              ref={activeIndex >= 0 && id === activeIndex ? imageRef : null}>
              <img
                key={id}
                src={src}
                alt=''
                id={`${id}`}
                className={styles.card}
              />
            </div>
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
