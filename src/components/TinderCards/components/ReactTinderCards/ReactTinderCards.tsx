import styles from '../../index.module.css'
import imagesList from '../../constants/constants'
import { useRef, useState } from 'react'
import Button from '../Button/Button'
import classNames from 'classnames'
import Card from '../Card/Card'
import { useDragContext } from '../../context/context'

export const ReactTinderCards = () => {
  const activeCardRef = useRef<HTMLDivElement | null>(null)
  const [cards, setCards] = useState(
    imagesList.map((card) => ({
      ...card,
      angle: Math.floor(Math.random() * (10 - -10 + 1)) - 10,
    }))
  )

  const [activeIndex, setActiveIndex] = useState<number>(cards.length - 1)
  const [direction, setDirection] = useState<'left' | 'right' | null>(null)
  const [isSwipedByButton, setIsSwipedByButton] = useState(false)
  const { isDragging, setIsDragging, isSwipeInProgress, setIsSwipeInProgress } =
    useDragContext()

  const leftBtnClass = classNames(styles.btn, [styles.type], {
    [styles.inactive]: activeIndex < 0,
    [styles.active]: activeIndex >= 0,
    [styles.red]: direction === 'left',
  })

  const rightBtnClass = classNames(styles.btn, [styles.type], {
    [styles.inactive]: activeIndex < 0,
    [styles.active]: activeIndex >= 0,
    [styles.green]: direction === 'right',
  })

  const backBtnClass = classNames(styles.btn, [styles.type], {
    [styles.inactive]: activeIndex === imagesList.length - 1,
    [styles.active]: activeIndex !== imagesList.length - 1,
  })

  const handleSwipeRight = () => {
    if (isSwipeInProgress) return
    setIsSwipeInProgress(true)
    if (activeCardRef.current) {
      activeCardRef.current.classList.add(styles.swipeToRight)
      activeCardRef.current.classList.add(styles.active)
      setIsDragging(true)
      setIsSwipedByButton(true)
    } else {
      console.error('Ref is null, cannot add class!')
    }
  }

  const handleSwipeLeft = () => {
    if (isSwipeInProgress) return
    setIsSwipeInProgress(true)
    if (activeCardRef.current) {
      activeCardRef.current.classList.add(styles.active)
      activeCardRef.current.classList.add(styles.swipeToLeft)
      setIsDragging(true)
      setIsSwipedByButton(true)
    }
  }

  const handleAnimationEnd = (id: number) => {
    const newCards = cards.filter((el) => el.id !== id)
    setCards(newCards)
    setActiveIndex(newCards.length - 1)
    setIsDragging(false)
    setIsSwipedByButton(false)
    setIsSwipeInProgress(false)
    setDirection(null)
  }

  const handlecardsBack = () => {
    setCards(
      imagesList.map((card) => ({
        ...card,
        angle: Math.floor(Math.random() * (10 - -10 + 1)) - 10,
      }))
    )
    setActiveIndex(imagesList.length - 1)
    setIsDragging(false)
    setDirection(null)
  }

  const handleDirection = (delta: number) => {
    if (delta < 0) {
      setDirection('left')
    } else if (delta > 0) {
      setDirection('right')
    } else {
      setDirection(null)
    }
  }

  return (
    <section className={styles.section}>
      <div className={styles.container}>
        <h2>Mouse events, touch events, css-animations</h2>
        <div className={styles['cards-block']}>
          <div className={styles.stub}>Карточки закончились</div>
          {cards.map(({ id, src, angle }) => {
            return (
              <Card
                key={id}
                id={id}
                src={src}
                isActive={id === activeIndex}
                isSwipedByButton={isSwipedByButton}
                handleAnimationEnd={handleAnimationEnd}
                handleButtons={handleDirection}
                ref={id === activeIndex ? activeCardRef : null}
                initialAngle={id === activeIndex ? 0 : angle}
              />
            )
          })}
        </div>
        <div className={styles.buttons}>
          <Button
            action={handleSwipeLeft}
            text="Left"
            classNames={leftBtnClass}
            disabled={activeIndex < 0 || isDragging}
          />
          <Button
            action={handlecardsBack}
            text="Back"
            classNames={backBtnClass}
            disabled={
              activeIndex === imagesList.length - 1 || isSwipeInProgress
            }
          />
          <Button
            action={handleSwipeRight}
            text="Right"
            classNames={rightBtnClass}
            disabled={activeIndex < 0 || isDragging}
          />
        </div>
      </div>
    </section>
  )
}
