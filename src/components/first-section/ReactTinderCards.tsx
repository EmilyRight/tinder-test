/* eslint-disable @typescript-eslint/no-unused-expressions */
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
    const newIndex = currentIndex + 1;
    updateCurrentIndex(newIndex);
    await childRefs[newIndex]?.current?.restoreCard();
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
            Swipe left!
          </button>
          <button
            className={
              currentIndex === imagesList.length - 1
                ? `${styles.inactive} ${styles.btn}`
                : `${styles.active} ${styles.btn}`
            }
            onClick={() => goBack()}>
            Undo swipe!
          </button>
          <button
            className={
              canSwipe
                ? `${styles.active} ${styles.btn}`
                : `${styles.inactive} ${styles.btn}`
            }
            onClick={() => swipe("right")}>
            Swipe right!
          </button>
        </div>
      </div>
    </section>
  );
};
// export const FirstSection = () => {
//   const imageRef = useRef<HTMLImageElement>(null)
//   const [cards, setCards] = useState(imagesList)
//   const [activeImage, setActiveImage] = useState<number | null>(cards.length)

//   const handleSwipeRight = () => {
//     if (imageRef.current) {
//       imageRef.current.classList.add(${styles.swipeToRight})
//     }
//   }

//   const handleSwipeLeft = () => {
//     if (imageRef.current) {
//       imageRef.current.classList.add(${styles.swipeToLeft})
//     }
//   }

//   const handleAnimationEnd = () => {
//     const newCards = cards.slice(0, -1)
//     setCards(newCards)
//   }

//   useEffect(() => {
//     if (cards.length > 0) {
//       setActiveImage(cards.slice(-1)[0].id)
//     } else {
//       setActiveImage(null)
//     }
//   }, [cards])

//   return (
//     <section className={styles.section}>
//       <div className={styles.container}>
//         <div className={styles['cards-block']}>
//           {cards.length > 0 ? (
//             cards.map((image) => (
//               <img
//                 key={image.id}
//                 src={image.src}
//                 alt=""
//                 className={styles.card}
//                 onAnimationEnd={handleAnimationEnd}
//                 ref={activeImage && image.id === activeImage ? imageRef : null}
//               />
//             ))
//           ) : (
//             <div>Карточки закончились</div>
//           )}
//         </div>
//         <div className={styles.buttons}>
//           <button
//             className={${styles.left} ${styles.btn}}
//             onClick={handleSwipeLeft}
//           >
//             Left
//           </button>
//           <button
//             className={${styles.right} ${styles.btn}}
//             onClick={handleSwipeRight}
//           >
//             Right
//           </button>
//         </div>
//       </div>
//     </section>
//   )
// }
// export const FirstSection = () => {
//   const [cards, setCards] = useState(imagesList)
//   const [currentIndex, setCurrentIndex] = useState(cards.length) // Текущий индекс изображения
//   const [swipeDirection, setSwipeDirection] = useState<'left' | 'right' | null>(
//     null
//   ) // Направление свайпа
//   const [isSwiping, setIsSwiping] = useState(false) // Состояние анимации "вылета"
//   const startX = useRef(0) // Начальная позиция по X

//   // Начало свайпа
//   const handleTouchStart = (e: React.TouchEvent<HTMLDivElement>) => {
//     startX.current = e.touches[0].clientX
//   }
//   // Завершение свайпа
//   const handleTouchEnd = (e: React.TouchEvent<HTMLDivElement>) => {
//     const deltaX = e.changedTouches[0].clientX - startX.current
//     handleSwipeEnd(deltaX)
//   }

//   const handleMouseDown = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
//     startX.current = e.clientX
//     console.log('====================================')
//     console.log('handleMouseDown')
//     console.log('====================================')
//   }

//   const handleMouseUp = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
//     const deltaX = e.clientX - startX.current
//     handleSwipeEnd(deltaX)
//   }

//   const handleSwipeEnd = (deltaX: number) => {
//     if (deltaX > 50) {
//       // Свайп вправо
//       setSwipeDirection('right')
//       setIsSwiping(true)
//     } else if (deltaX < -50) {
//       // Свайп влево
//       setSwipeDirection('left')
//       setIsSwiping(true)
//     }
//   }

//   // Завершение анимации вылета
//   const handleAnimationEnd = () => {
//     if (swipeDirection === 'right') {
//       // Переключаем на предыдущее изображение
//       setCurrentIndex((prevIndex) => (prevIndex > 0 ? prevIndex - 1 : 0))
//     } else if (swipeDirection === 'left') {
//       // Переключаем на следующее изображение
//       setCurrentIndex((prevIndex) =>
//         prevIndex < imagesList.length - 1 ? prevIndex + 1 : prevIndex
//       )
//     }
//     const newCards = cards.slice(0, -1)
//     setCards(newCards)
//     // Сбрасываем состояние свайпа
//     setSwipeDirection(null)
//     setIsSwiping(false)
//   }

//   useEffect(() => {
//     if (cards.length > 0) {
//       setCurrentIndex((prevIndex) => (prevIndex > 0 ? prevIndex - 1 : 0))
//     }
//   }, [cards])

//   return (
//     <div
//       style={{
//         position: 'relative',
//         width: '300px',
//         height: '400px',
//         margin: '0 auto',
//         border: '2px solid black',
//       }}
//       onTouchStart={handleTouchStart}
//       onTouchEnd={handleTouchEnd}
//       onMouseDown={handleMouseDown}
//       onMouseUp={handleMouseUp}
//     >
//       {imagesList.map(({ id, src }) => {
//         // Определяем стили для текущего и полетевших изображений
//         const isCurrent = id === currentIndex
//         const isFlyingOut = isCurrent && isSwiping

//         let rotation = 0
//         let translateX = '0%'
//         let translateY = '0%'

//         if (isFlyingOut) {
//           // Полоса смещения для "вылетающего" изображения
//           translateX = swipeDirection === 'right' ? '150%' : '-150%'
//           translateY = '20%'
//           rotation = swipeDirection === 'right' ? 30 : -30 // Угол поворота
//         } else if (!isCurrent) {
//           translateX = '0%'
//         }

//         return (
//           <img
//             key={id}
//             src={src}
//             alt={`Slide ${id}`}
//             style={{
//               position: 'absolute',
//               top: 0,
//               left: 0,
//               width: '100%',
//               height: '100%',
//               objectFit: 'cover',
//               transition: isFlyingOut
//                 ? 'transform 0.6s ease'
//                 : 'transform 0.3s ease',
//               transform: `translate(${translateX}, ${translateY}) rotate(${rotation}deg)`,
//               zIndex: isCurrent ? 1 : 0,
//               opacity: isFlyingOut ? 0 : 1,
//             }}
//             onTransitionEnd={isFlyingOut ? handleAnimationEnd : undefined}
//           />
//         )
//       })}
//     </div>
//   )
// }
