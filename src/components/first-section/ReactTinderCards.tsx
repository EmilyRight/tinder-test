import styles from "./index.module.css";
import imagesList from "../../constants/constants";
import React from "react";
import { useMemo, useRef, useState } from "react";
import TinderCard from "react-tinder-card";

type TDirection = "left" | "right" | "up" | "down";
type ChildRefType = {
  swipe(dir?: TDirection): Promise<void>;
  restoreCard(): Promise<void>;
  current: number;
};

export const ReactTinderCards = () => {
  const [currentIndex, setCurrentIndex] = useState(imagesList.length - 1);
  const [, setLastDirection] = useState<string>();
  const currentIndexRef = useRef(currentIndex);
  const canGoBack = currentIndex < imagesList.length - 1;
  const canSwipe = currentIndex >= 0;

  const childRefs = useMemo(
    () =>
      Array(imagesList.length)
        .fill(0)
        .map((_i) => React.createRef<ChildRefType>()),
    []
  );

  const updateCurrentIndex = (val: number) => {
    setCurrentIndex(val);
    currentIndexRef.current = val;
  };

  const swiped = (direction: string, index: number) => {
    setLastDirection(direction);
    updateCurrentIndex(index - 1);
  };

  const outOfFrame = (idx: number) => {
    currentIndexRef.current >= idx
      ? childRefs[idx].current?.restoreCard()
      : null;
  };

  const swipe = async (dir: TDirection) => {
    if (canSwipe && currentIndex < imagesList.length) {
      await childRefs[currentIndex].current?.swipe(dir);
    }
  };

  const goBack = async () => {
    if (!canGoBack) return;

    for (let i = currentIndex + 1; i < imagesList.length; i++) {
      // Проверяем, что ссылка существует
      const cardRef = childRefs[i]?.current; // Безопасное обращение
      if (cardRef && typeof cardRef.restoreCard === "function") {
        updateCurrentIndex(i); // Обновляем текущий индекс
        await cardRef.restoreCard(); // Ждем завершения
      } else {
        console.warn(`Card reference for index ${i} is invalid or null.`);
      }
    }
  };

  return (
    <section className={styles.section}>
      <div className={styles.container}>
        <div className={styles["cards-block"]}>
          <div>Карточки закончились</div>
          {imagesList.map(({ id, src }) => (
            <TinderCard
              ref={childRefs[id]}
              flickOnSwipe={true}
              className={styles.cardWrapper}
              preventSwipe={["up", "down"]}
              swipeThreshold={100}
              swipeRequirementType={"position"}
              key={id}
              onSwipe={(dir: TDirection) => swiped(dir, id)}
              onCardLeftScreen={() => outOfFrame(id)}>
              <img src={src} alt='' id={`${id}`} />
            </TinderCard>
          ))}
        </div>
        <div className={styles.buttons}>
          <button
            className={
              canSwipe
                ? `${styles.active} ${styles.btn}`
                : `${styles.inactive} ${styles.btn}`
            }
            onClick={() => swipe("left")}>
            Не нравится
          </button>
          <button
            className={
              currentIndex === imagesList.length - 1
                ? `${styles.inactive} ${styles.btn}`
                : `${styles.active} ${styles.btn}`
            }
            onClick={() => goBack()}>
            Отмена
          </button>
          <button
            className={
              canSwipe
                ? `${styles.active} ${styles.btn}`
                : `${styles.inactive} ${styles.btn}`
            }
            onClick={() => swipe("right")}>
            Нравится
          </button>
        </div>
      </div>
    </section>
  );
};
