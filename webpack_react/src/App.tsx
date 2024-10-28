import './App.css'
import dzq from './assets/image/dzq.jpg'
import { Demo1, Demo2 } from '@/components'
import memberList from './test.json'
function App() {
  return (
    <div className='scssBox lessBox'>
      <h2 className='box'>Hello Hopu!</h2>
      <img src={dzq} alt='' style={{ width: '100px', height: '100px' }} />
      <Demo1 />
    </div>
  )
}

export default App
