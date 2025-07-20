import { useEffect } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { SplitText } from "gsap/SplitText";
import { ScrollSmoother } from "gsap/ScrollSmoother";
import './App.css';
import { Button, Card, Flex, Typography } from "antd";
import img from './assets/FC25_Accolades_3x4_810x1080.png'
import SectionThird from "./sections/SectionThird";
import logo from './assets/pngwing.png'

function App() {
  const cardStyle: React.CSSProperties = {
    width: 620,
  };

  const imgStyle: React.CSSProperties = {
    display: 'block',
    width: 273,
  };
  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger, SplitText, ScrollSmoother);

    const TOTAL_FRAMES = 50
    const createURL = (frame: number, url: string) => {
      const id = (frame + 1).toString().padStart(2, '0');
      return new URL(`${url}${id}.png`, import.meta.url).href;
    }
    const images = Array.from({ length: TOTAL_FRAMES }, (_, index) => {
      const img = new Image()
      img.src = createURL(index, './assets/vid2/')
      return img
    })

    const smoother = ScrollSmoother.create({
      smooth: 0.5,
      effects: true,
      wrapper: '.wrapper',
      content: '.content',
    });
    smoother.scrollTrigger.update();
    const imageCanvas = {
      frame: 0,
    }
    const tl = gsap.timeline({
      defaults: {
        duration: 2,
        ease: 'power2.inOut',
        yoyo: true,
      },
    });
    const split = new SplitText('.title', {
      type: 'chars',
      autoSplit: true,
    });
    tl.to(imageCanvas, {
      frame: TOTAL_FRAMES - 1,
      ease: 'none',
      snap: 'frame',
      scrollTrigger: {
        scrub: 0.5,
      },
      onUpdate: render,
    }).to(split.chars, {
      x: 100,
      y: -200,
      opacity: 0,
      filter: 'blur(15px)',
      scrollTrigger: {
        scrub: 0.5,
      },
      duration: 0.7,
      ease: "power4",
      stagger: 0.04
    }).from('.ball', {
      filter: 'blur(1px)',
      rotate: 0,
      x: '-100dvw',
      y: -250,
      scale: 4,

    }).to('.ball', {

      rotate: 360,
      x: '900dvw',
      scrollTrigger: {
        scrub: .8,
      }
    }).to('.ball2', {
      filter: 'blur(1px)',
      scale: 5,
      rotate: 360,
      x: 100,
      scrollTrigger: {
        scrub: .1,
      }
    });

    // Main card animation with proper ScrollTrigger
    gsap.fromTo('.main-card', {
      y: -100,
      opacity: 0,
      filter: 'blur(2px)',
    }, {
      y: 0,
      opacity: 1,
      filter: 'blur(0px)',
      duration: 0.3,
      ease: "power4",
      stagger: 0.04,
      scrollTrigger: {
        trigger: '.main-card',
        start: 'top 80%',
        end: 'top 20%',
        scrub: 0.5,
      }
    });


    images[0].onload = () => render()

    function render() {
      const canvas = document.getElementById('image') as HTMLCanvasElement | null;
      if (!canvas) return;
      // Set canvas size if not already set
      const dpr = window.devicePixelRatio || 1;
      const desiredWidth = 1800;
      const desiredHeight = 800;
      canvas.width = desiredWidth * dpr;
      canvas.height = desiredHeight * dpr;

      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.drawImage(images[imageCanvas.frame], 0, 0, canvas.width, canvas.height);
      }
    }

  }, []);


  return (

    <div className="wrapper">
      <div className="content">
        <section>
          <div className="logo">
            <img src={logo} alt="logo" />
          </div>
          <canvas id="image"></canvas>
          <h1 className="title">
            FC 25
          </h1>
          <div className="ball"></div>
        </section>
        <section>


          <Card hoverable className="main-card" style={cardStyle} styles={{ body: { padding: 0, overflow: 'hidden' } }}>
            <Flex justify="space-between">
              <img
                alt="avatar"
                src={img}
                style={imgStyle}
              />
              <Flex vertical align="flex-end" justify="space-between" style={{ padding: 32 }}>
                <Typography.Title level={3}>
                  “fifa 25 is a football game that is very good and i like it very much and i want to play it”
                </Typography.Title>
                <Button type="primary" href="https://fifa.com" target="_blank" style={{ backgroundColor: '#000', color: '#fff' }}>
                  Get Started
                </Button>
              </Flex>
            </Flex>
          </Card>
          <div className="ball2"></div>
        </section>
        <section>
          <SectionThird />
        </section>
        <div className="footer">
          <div className="footer-content">
            <h1>Footer</h1>
          </div>
        </div>
      </div>
    </div>
  )
}

export default App
