import { useRef, useState, useEffect } from 'react'
import envelope from './assets/envelope.png'
import envelopeFront from './assets/envelope_front.png'
import envelopeOpen from './assets/envelope_open.png'
import envelopeBody from './assets/envelope_body.png'
import paperTexture from './assets/paper-texture.jpg'
import pageFlipSrc from './assets/page-flip.mp3'
import cookie from './assets/cookie.png'
import rice from './assets/rice.png'
import tamarind from './assets/tamarind.png'
import './App.css'

const MAX_TILT = 8

const pageFlipAudio = new Audio(pageFlipSrc)
pageFlipAudio.volume = 0.5

function playSwoosh() {
  pageFlipAudio.currentTime = 0
  pageFlipAudio.play()
}

function TiltCard() {
  const wrapperRef = useRef(null)
  const [flipped, setFlipped] = useState(false)
  const [firstFlipDone, setFirstFlipDone] = useState(false)
  const [opened, setOpened] = useState(false)
  const [expanded, setExpanded] = useState(false)
  const [hovering, setHovering] = useState(false)

  useEffect(() => {
    for (const src of [envelopeFront, envelopeOpen, envelopeBody, cookie, rice, tamarind]) {
      const img = new Image()
      img.src = src
      img.decode().catch(() => {})
    }
  }, [])

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
    playSwoosh()
    if (!flipped) {
      setFlipped(true)
      if (!firstFlipDone) setTimeout(() => setFirstFlipDone(true), 600)
    } else if (!opened) {
      setOpened(true)
    } else if (!expanded) {
      setExpanded(true)
    } else {
      setFlipped(false)
      setOpened(false)
      setExpanded(false)
    }
  }

  const isFirstReveal = flipped && !firstFlipDone

  return (
    <div
      ref={wrapperRef}
      className="tilt-wrapper"
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      onClick={handleClick}
    >
      <div className="entry-shell">
        <div className={`flip-inner${flipped ? ' flipped' : ''}`}>
          <div className="face front">
            <div className="shadow-wrap">
              <img src={envelope} alt="Airmail envelope from Nathan Pokpongkiat to Ashley Sun" />
            </div>
          </div>
          <div className="face back">
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
            {/* Stickers that peek out on the sides, then move onto the paper when expanded */}
            <img
              src={cookie}
              alt="Cookie snack"
              className={`sticker sticker-left${opened ? ' fade-in-open' : ''}${expanded ? ' expanded' : (opened && hovering ? ' peeking' : '')}`}
            />
            <img
              src={rice}
              alt="Rice snack"
              className={`sticker sticker-mid${opened ? ' fade-in-open' : ''}${expanded ? ' expanded' : (opened && hovering ? ' peeking' : '')}`}
            />
            <img
              src={tamarind}
              alt="Tamarind snack"
              className={`sticker sticker-right${opened ? ' fade-in-open' : ''}${expanded ? ' expanded' : (opened && hovering ? ' peeking' : '')}`}
            />
            <div className={`paper${opened ? ' fade-in-open' : ''}${expanded ? ' expanded' : (opened && hovering ? ' peeking' : '')}`}>
              <img src={paperTexture} className="paper-texture" alt="" />
              <div className="letter">
                <p>Hi Ashley,</p>
                <p>I've been making stuff in the kitchen lately, put together some snacks and figured I'd send some your way.</p>
                <p>Threw in some of my favorites.</p>

                <p className="sign-off">I appreciate you too!<br />— Nathan</p>
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
  )
}

export default function App() {
  return (
    <div className="page">
      <TiltCard />
    </div>
  )
}
