import { useRef, useState, useEffect } from 'react'
import envelope from './assets/envelope.png'
import envelope1 from './assets/envelope_1.png'
import envelopeFront from './assets/envelope_front.png'
import envelopeOpen from './assets/envelope_open.png'
import envelopeBody from './assets/envelope_body.png'
import paperTexture from './assets/paper-texture.jpg'
import pageFlipSrc from './assets/page-flip.mp3'
import kazooSrc from './assets/Kazoo Happy Birthday.mp3'
import cookie from './assets/cookie.png'
import rice from './assets/rice.png'
import tamarind from './assets/tamarind.png'
import stickerSmiley from './assets/sticker_smiley.svg'
import stickerFlower from './assets/sticker_heart.svg'
import stickerStar from './assets/sticker_star.svg'
import photo1 from './assets/image_1.png'
import photo2 from './assets/image_2.png'
import photo3 from './assets/image_3.png'
import photo4 from './assets/image_4.png'
import ConfettiBoom from 'react-confetti-boom'
import './App.css'

const MAX_TILT = 8
const MAX_BITES = 4

const bitePositions = {
  cookie: [
    { x: 78, y: 22, size: 34 },
    { x: 18, y: 48, size: 30 },
    { x: 62, y: 74, size: 36 },
  ],
  rice: [
    { x: 70, y: 30, size: 32 },
    { x: 28, y: 68, size: 28 },
    { x: 55, y: 82, size: 34 },
  ],
  tamarind: [
    { x: 76, y: 34, size: 34 },
    { x: 26, y: 58, size: 30 },
    { x: 60, y: 78, size: 36 },
  ],
}

const pageFlipAudio = new Audio(pageFlipSrc)
pageFlipAudio.volume = 0.5

const kazooAudio = new Audio(kazooSrc)
kazooAudio.volume = 0.8

function playSwoosh() {
  pageFlipAudio.currentTime = 0
  pageFlipAudio.play()
}

const letterNathan = (
  <>
    <p>Happy birthday, Ashley!! 🎂</p>
    <p>We've had some incredible adventures together, and I really appreciate you. Here's to many more.</p>
    <p>Put together some of my favorite snacks for the occasion.</p>
    <p>Eat the cookie first.</p>
    <p className="sign-off">— Nathan</p>
  </>
)

const letterEthan = (
  <>
    <p>Hi Ethan,</p>
    <p>Finally sending those photos from Big Bear. I know, three months — don't @ me.</p>
    <p>The second morning ones came out really well. The light was doing something weird and perfect.</p>
    <p>Also picked up an old Canon AE-1 for $12. Half the roll came out blank, but the other half is the best stuff I've shot in a while.</p>
    <p>Still owe you dinner.</p>
    <p className="sign-off">— Sarah</p>
  </>
)

function Confetti({ active }) {
  if (!active) return null
  return (
    <ConfettiBoom
      mode="boom"
      x={0.5}
      y={0.45}
      particleCount={120}
      colors={['#ff6b6b', '#ffd93d', '#6bcb77', '#4d96ff', '#ff9ecd', '#ff9e3d', '#c084fc', '#fb923c']}
      shapeSize={10}
      deg={270}
      spreadDeg={160}
      launchSpeed={1.4}
      style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', pointerEvents: 'none', zIndex: 9999 }}
    />
  )
}

function TiltCard({ envelopeSrc = envelope, stickerLeft = cookie, stickerMid = rice, stickerRight = tamarind, letter = letterNathan, photos = null, showConfetti = false }) {
  const wrapperRef = useRef(null)
  const [flipped, setFlipped] = useState(false)
  const [firstFlipDone, setFirstFlipDone] = useState(false)
  const [opened, setOpened] = useState(false)
  const [expanded, setExpanded] = useState(false)
  const [hovering, setHovering] = useState(false)
  const [bites, setBites] = useState({ cookie: 0, rice: 0, tamarind: 0 })
  const [hoveredPhoto, setHoveredPhoto] = useState(null)
  const [photosSettled, setPhotosSettled] = useState(false)
  const [confettiActive, setConfettiActive] = useState(false)

  useEffect(() => {
    for (const src of [envelopeFront, envelopeOpen, envelopeBody, cookie, rice, tamarind]) {
      const img = new Image()
      img.src = src
      img.decode().catch(() => {})
    }
  }, [])

  useEffect(() => {
    if (!photos || !expanded) return undefined

    const settleTimer = window.setTimeout(() => setPhotosSettled(true), 540)
    return () => window.clearTimeout(settleTimer)
  }, [expanded, photos])

  function setShadow(filter) {
    wrapperRef.current.querySelectorAll('.shadow-wrap').forEach(el => {
      el.style.filter = filter
    })
  }

  function setShadowTransition(transition) {
    wrapperRef.current.querySelectorAll('.shadow-wrap').forEach(el => {
      el.style.transition = transition
    })
  }

  function handleMouseMove(e) {
    const wrapper = wrapperRef.current
    const rect = wrapper.getBoundingClientRect()
    const x = e.clientX - rect.left
    const y = e.clientY - rect.top
    const cx = rect.width / 2
    const cy = rect.height / 2
    const rotateY = ((x - cx) / cx) * MAX_TILT
    const rotateX = -((y - cy) / cy) * MAX_TILT
    wrapper.style.transition = 'transform 0.08s ease-out'
    setShadowTransition('filter 0.08s ease-out')
    wrapper.style.transform = `perspective(1200px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.03, 1.03, 1.03)`
    setShadow(`drop-shadow(${-rotateY * 1.5}px ${rotateX * 1.5}px 40px rgba(0,0,0,0.3))`)
    setHovering(true)
  }

  function handleMouseLeave() {
    const wrapper = wrapperRef.current
    wrapper.style.transition = 'transform 0.42s cubic-bezier(0.22, 1, 0.36, 1)'
    setShadowTransition('filter 0.42s cubic-bezier(0.22, 1, 0.36, 1)')
    wrapper.style.transform = 'perspective(1200px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)'
    setShadow('drop-shadow(0 20px 40px rgba(0,0,0,0.2))')
    setHovering(false)
  }

  function handleClick() {
    if (expanded) {
      setFlipped(false)
      setOpened(false)
      setExpanded(false)
      setBites({ cookie: 0, rice: 0, tamarind: 0 })
      setHoveredPhoto(null)
      setPhotosSettled(false)
      setConfettiActive(false)
      kazooAudio.pause()
      kazooAudio.currentTime = 0
      return
    }

    if (flipped) return // already animating through

    playSwoosh()
    setFlipped(true)
    setTimeout(() => setFirstFlipDone(true), 600)

    setTimeout(() => {
      setOpened(true)
    }, 700)

    setTimeout(() => {
      setPhotosSettled(false)
      setHoveredPhoto(null)
      setExpanded(true)
      if (showConfetti) {
        setConfettiActive(true)
        kazooAudio.currentTime = 0
        kazooAudio.play()
      }
    }, 1300)
  }

  const isFirstReveal = flipped && !firstFlipDone

  function handleSnackClick(e, snack) {
    e.stopPropagation()
    if (!expanded) return

    setBites(current => ({
      ...current,
      [snack]: Math.min(current[snack] + 1, MAX_BITES),
    }))
  }

  function renderSnack(snack, src, alt, stickerClass) {
    const biteCount = bites[snack]
    const shownBites = bitePositions[snack].slice(0, biteCount)

    return (
      <div
        className={`${stickerClass}${biteCount >= MAX_BITES ? ' eaten' : ''}`}
        onClick={e => handleSnackClick(e, snack)}
      >
        <img src={src} alt={alt} className="snack-img" />
        {shownBites.map((bite, index) => (
          <span
            key={index}
            className="bite-mark"
            style={{
              '--bite-x': `${bite.x}%`,
              '--bite-y': `${bite.y}%`,
              '--bite-size': `${bite.size}px`,
            }}
          />
        ))}
      </div>
    )
  }

  return (
    <>
    <Confetti active={confettiActive} />
    <div
      ref={wrapperRef}
      className="tilt-wrapper"
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      onClick={handleClick}
    >
      <div className={`bounce-idle${flipped ? ' stopped' : ''}`}>
      <div className="entry-shell">
        <div className={`flip-inner${flipped ? ' flipped' : ''}`}>
          <div className="face front">
            <div className="shadow-wrap">
              <img src={envelopeSrc} alt="Airmail envelope from Nathan Pokpongkiat to Ashley Sun" />
            </div>
          </div>
          <div className="face back">
            <div className={`back-content${expanded ? ' expanded' : ''}`}>
              <div className="shadow-wrap">
                <img
                  src={envelopeFront}
                  alt="Airmail envelope back"
                  className={`back-img${isFirstReveal ? ' fade-in' : ''}${opened ? ' fade-out' : ''}`}
                />
                <img
                  src={envelopeOpen}
                  alt="Airmail envelope open"
                  className={`back-img open-img${opened && !expanded ? ' fade-in-open' : ''}${expanded ? ' fade-out' : ''}`}
                />
              </div>
              {/* Stickers / photos that peek out, then land on the paper when expanded */}
              {/* Stickers / photos that peek out, then land on the paper when expanded */}
              {photos ? photos.map((src, i) => {
                let extraX = 0, extraY = 0, extraScale = 0.875, extraZ = 4
                const photosCanInteract = expanded && photosSettled
                if (photosCanInteract && hoveredPhoto !== null) {
                  if (i === hoveredPhoto) {
                    extraY = -22
                    extraScale = 1.025
                    extraZ = 6
                  } else {
                    extraX = i < hoveredPhoto ? -50 : 50
                  }
                }
                return (
                  <img
                    key={i}
                    src={src}
                    alt={`Photo ${i + 1}`}
                    className={`photo-item photo-${i + 1}${opened ? ' visible' : ''}${expanded ? ' expanded' : (opened ? ' peeking' : '')}${photosCanInteract ? ' settled' : ''}`}
                    style={expanded ? {
                      '--extra-x': `${extraX}px`,
                      '--extra-y': `${extraY}px`,
                      '--extra-scale': extraScale,
                      zIndex: extraZ,
                    } : {}}
                    onMouseEnter={() => photosCanInteract && setHoveredPhoto(i)}
                    onMouseLeave={() => setHoveredPhoto(null)}
                  />
                )
              }) : (
                <>
                  {renderSnack('cookie', stickerLeft, 'Left sticker', `sticker sticker-left${opened ? ' fade-in-open' : ''}${expanded ? ' expanded dancing' : (opened && hovering ? ' peeking' : '')}`)}
                  {renderSnack('rice', stickerMid, 'Middle sticker', `sticker sticker-mid${opened ? ' fade-in-open' : ''}${expanded ? ' expanded dancing' : (opened && hovering ? ' peeking' : '')}`)}
                  {renderSnack('tamarind', stickerRight, 'Right sticker', `sticker sticker-right${opened ? ' fade-in-open' : ''}${expanded ? ' expanded dancing' : (opened && hovering ? ' peeking' : '')}`)}
                </>
              )}
              <div className={`paper${opened ? ' fade-in-open' : ''}${expanded ? ' expanded' : (opened && hovering ? ' peeking' : '')}`}>
                <img src={paperTexture} className="paper-texture" alt="" />
                <div className="letter">
                  {letter}
                </div>
              </div>
              <img
                src={envelopeBody}
                alt="Airmail envelope body"
                className={`back-img body-img${opened && !expanded ? ' fade-in-open' : ''}${expanded ? ' fade-out' : ''}`}
              />
            </div>
          </div>
        </div>
      </div>
      </div>
    </div>
    </>
  )
}

export default function App() {
  const [page, setPage] = useState(1)

  useEffect(() => {
    function onKey(e) {
      if (e.key === '1') setPage(1)
      if (e.key === '2') setPage(2)
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [])

  return (
    <div className="page">
      <TiltCard
        key={page}
        envelopeSrc={page === 2 ? envelope1 : envelope}
        stickerLeft={page === 2 ? stickerSmiley : cookie}
        stickerMid={page === 2 ? stickerFlower : rice}
        stickerRight={page === 2 ? stickerStar : tamarind}
        letter={page === 2 ? letterEthan : letterNathan}
        photos={page === 2 ? [photo1, photo2, photo3, photo4] : null}
        showConfetti={page === 1}
      />
    </div>
  )
}
