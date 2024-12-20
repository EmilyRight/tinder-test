import styles from "./index.module.css";
import imagesList from "../../constants/constants";
import { useRef, useState } from "react";
import {

  useMotionValue,
  useMotionValueEvent,

} from "motion/react";
import Card from "./Card";

export const MotionTest = () => {
  const imageRef = useRef<HTMLImageElement>(null);

  const [cards, setCards] = useState(imagesList);
  const [activeIndex, setActiveIndex] = useState<number>(cards.length - 1);
  const x = useMotionValue(0);
  useMotionValueEvent(x, "change", (latest) => console.log(latest));

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

  const handlecardsBack = () => {
    setCards(imagesList);
    setActiveIndex(imagesList.length - 1);
  };

  // useEffect(() => {
  //   console.log("rerender");
  // }, [cards]);

  return (
    <section className={styles.section}>
      <div className={styles.container}>
        <div className={styles["cards-block"]}>
          <div className={styles.stub}>Карточки закончились</div>
          {cards.map(({ id, src }) => (
            <Card id={id} src={src} setCards={setCards} cards={cards} />
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
