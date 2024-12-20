import { Dispatch, SetStateAction, useRef, useState } from "react";
import styles from "./index.module.css";
import TImage from "../../types/TImagesList";
import {
  motion,
  useMotionValue,
  useMotionValueEvent,
  useTransform,
} from "motion/react";

type TCardProps = {
  id: number;
  src: string;
  setCards: Dispatch<SetStateAction<TImage[]>>;
  cards: TImage[];
};

function Card({ id, src, setCards, cards }: TCardProps) {
  const imageRef = useRef<HTMLImageElement>(null);

  const [, setActiveIndex] = useState<number>(cards.length - 1);
  const x = useMotionValue(0);
  useMotionValueEvent(x, "change", (latest) => console.log(latest));
  const opacity = useTransform(x, [-150, 0, 150], [0, 1, 0]);
  const rotate = useTransform(x, [-150, 150], [-10, 10]);
  // const isFront = activeIndex === cards.length;
  // const offset = isFront ? 0 : id % 2 ? 6 : -6;

  const handleAnimationEnd = () => {
    const newCards = cards.slice(0, -1);
    console.log(newCards, `handleAnimationEnd`);

    setCards(newCards);
    setActiveIndex((prev) => prev - 1);
  };

  return (
    <motion.div
      key={id}
      className={`${styles.cardWrapper} ${
        id === cards.length ? styles.active : ""
      } `}
      onAnimationEnd={handleAnimationEnd}
      ref={id === cards.length ? imageRef : null}
      draggable
      drag='x'
      style={{
        backgroundImage: `url(${src})`,
        backgroundRepeat: "no-repeat",
        backgroundSize: "cover",
        x,
        opacity,
        rotate,
      }}
      dragConstraints={{ left: 0, right: 0 }}></motion.div>
  );
}

export default Card;
