import React from "react";
import styles from "../index.module.css";

type TCardProps = {
  id: number;
  src: string;
  isActive: boolean;
  isDragging: boolean;
};

function Card({ id, isActive, isDragging }: TCardProps) {
  return (
    <div
      key={id}
      className={`${styles.cardWrapper} ${
        id >= 0 && isActive ? styles.active : ""
      } `}
      onAnimationEnd={handleAnimationEnd}
      ref={(el) => (imageRefs.current[index] = el)}
      style={{
        backgroundImage: `url(${src})`,
        backgroundRepeat: "no-repeat",
        backgroundSize: "cover",
        transform: `${
          id >= 0 && isActive && isDragging
            ? `translate(${dragDeltaRef.current.x}px, ${dragDeltaRef.current.y}px) rotate(${rotationAngle}deg)`
            : `unset`
        }`,
        transition: !isDragging ? "transform 0.4s linear, 0.4s " : "none",
      }}
      onMouseDown={handleDragStart}
      onMouseUp={handleDragEnd}
      onMouseLeave={handleDragEnd}
      onTouchStart={handleDragStart}
      onTouchMove={isDragging ? handleDrag : undefined}
      onTouchEnd={handleDragEnd}></div>
  );
}

export default Card;
