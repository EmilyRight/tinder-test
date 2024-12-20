import React, { Dispatch, LegacyRef, SetStateAction } from "react";
import styles from "./index.module.css";
import TImage from "../../types/TImagesList";
import { motion, useMotionValue, useTransform } from "motion/react";
import useWindowSize from "../TinderCard/useWindowSize";

type TCardProps = {
  id: number;
  src: string;
  setCards: Dispatch<SetStateAction<TImage[]>>;
  cards: TImage[];
};

const Card = React.forwardRef(
  (
    { id, src, setCards, cards }: TCardProps,
    ref: LegacyRef<HTMLDivElement> | undefined
  ) => {
    const x = useMotionValue(0);
    const { width } = useWindowSize();
    const rotateRaw = useTransform(x, [-150, 150], [-18, 18]);
    const opacity = useTransform(x, [-180, 0, 180], [0, 1, 0]);
    const isFront = id === cards[cards.length - 1].id;
    const rotate = useTransform(() => {
      const offset = isFront ? 0 : id % 2 ? 6 : -6;
      return `${rotateRaw.get() + offset}deg`;
    });

    const handleDragEnd = () => {
      if (width && width <= 767) {
        if (Math.abs(x.get()) > width / 4) {
          setCards((pv) => pv.filter((v) => v.id !== id));
        }
      }
      if (Math.abs(x.get()) > 100) {
        setCards((pv) => pv.filter((v) => v.id !== id));
      }
    };

    return (
      <motion.div
        key={id}
        className={`${styles.cardWrapper} ${
          id === cards.length ? styles.active : ""
        } `}
        onDragEnd={handleDragEnd}
        draggable
        drag='x'
        style={{
          backgroundImage: `url(${src})`,
          backgroundRepeat: "no-repeat",
          backgroundSize: "cover",
          x,
          opacity,
          rotate,
          transition: "0.125s transform",
        }}
        ref={ref}
        animate={{ scale: isFront ? 1 : 0.98 }}
        dragConstraints={{ left: 0, right: 0 }}></motion.div>
    );
  }
);

export default Card;
