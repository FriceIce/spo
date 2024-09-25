import style from './musicbars.module.css'

const MusicBars = () => {
  return (
    <div className={style.bars}>
      <div className={style.barsItem}></div>
      <div className={style.barsItem}></div>
      <div className={style.barsItem}></div>
      <div className={style.barsItem}></div>
    </div>
  )
}

export default MusicBars
