import { ReactTinderCards } from './components/ReactTinderCards/ReactTinderCards'
import { DragProvider } from './context/context'

function TinderCards() {
  return (
    <DragProvider>
      <>
        <ReactTinderCards />
      </>
    </DragProvider>
  )
}

export default TinderCards
