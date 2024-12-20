import styles from "./index.module.css";
import imagesList from "../../constants/constants";
import {  useState } from "react";
import Card from "./Card";

export const MotionTest = () => {
  const [cards, setCards] = useState(imagesList);
  const [activeIndex, setActiveIndex] = useState<number>(cards.length - 1);

  const handlecardsBack = () => {
    setCards(imagesList);
    setActiveIndex(imagesList.length - 1);
  };

  return (
    <section className={styles.section}>
      <div className={styles.container}>
        <h2>Только свайпы (react-motion)</h2>
        <div className={styles["cards-block"]}>
          <div className={styles.stub}>Карточки закончились</div>
          {cards.map(({ id, src }) => (
            <Card
              key={id}
              id={id}
              src={src}
              setCards={setCards}
              cards={cards}
            />
          ))}
        </div>
        <div className={styles.buttons}>
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
        </div>
      </div>
    </section>
  );
};
