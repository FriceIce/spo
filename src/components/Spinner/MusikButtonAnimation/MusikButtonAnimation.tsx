const MusicButtonAnimation = () => {
  return (
    <div 
      className={`shadow-play-button rounded-full bg-black opacity-0 transition-all duration-[350ms] absolute top-[74%] right-2 group-hover:top-[69%] group-hover:opacity-100 z-10`}>

      <img src="/spotify-web/icons/play-button.png" alt="Green play button"
        className={`size-12 object-center object-cover `} />
    </div>
  )
}

export default MusicButtonAnimation
