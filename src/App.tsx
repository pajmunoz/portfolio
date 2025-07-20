import { useEffect, useState } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { SplitText } from "gsap/SplitText";
import { ScrollSmoother } from "gsap/ScrollSmoother";
import './App.css';
import { Button, Card, Flex, Typography, Spin, Progress } from "antd";
import img from './assets/FC25_Accolades_3x4_810x1080.png'
import SectionThird from "./sections/SectionThird";
import logo from './assets/pngwing.png'

function App() {
  const [isLoading, setIsLoading] = useState(true);
  const [loadingProgress, setLoadingProgress] = useState(0);
  const [imagesLoaded, setImagesLoaded] = useState(0);
  const [totalImages, setTotalImages] = useState(0);

  const cardStyle: React.CSSProperties = {
    width: 620,
  };

  const imgStyle: React.CSSProperties = {
    display: 'block',
    width: 273,
  };
  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger, SplitText, ScrollSmoother);

    const TOTAL_FRAMES = 50;
    setTotalImages(TOTAL_FRAMES);

    const createURL = (frame: number, url: string) => {
      const id = (frame + 1).toString().padStart(2, '0');
      return `${url}${id}.png`;
    }

    const images: HTMLImageElement[] = [];
    let loadedCount = 0;

    const loadImage = (index: number): Promise<HTMLImageElement> => {
      return new Promise((resolve, reject) => {
        const img = new Image();
        img.onload = () => {
          loadedCount++;
          setImagesLoaded(loadedCount);
          setLoadingProgress((loadedCount / TOTAL_FRAMES) * 100);
          resolve(img);
        };
        img.onerror = () => {
          console.error(`Failed to load image ${index + 1}`);
          reject(new Error(`Failed to load image ${index + 1}`));
        };
        img.src = createURL(index, 'https://pablojaramunoz.com/videos/vid2/');
      });
    };

    // Load all images with progress tracking
    const loadAllImages = async () => {
      try {
        const imagePromises = Array.from({ length: TOTAL_FRAMES }, (_, index) =>
          loadImage(index)
        );

        const loadedImages = await Promise.all(imagePromises);
        images.push(...loadedImages);

        // All images loaded successfully
        setIsLoading(false);
        initializeAnimations(images);
      } catch (error) {
        console.error('Error loading images:', error);
        setIsLoading(false);
        // You could show an error message here
      }
    };

    loadAllImages();

    // Function to initialize animations after images are loaded
    const initializeAnimations = (images: HTMLImageElement[]) => {
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
        filter: 'blur(10px)',
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
      }).to('.ball', {
        filter: 'blur(1px)',
        rotate: 360,
        x: 2000,
        scale: 4,
        scrollTrigger: {
          scrub: .1,
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

      // Initialize render function
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

      // Start rendering
      render();
      window.addEventListener('scroll', () => blurOnScroll('image'));
      const image2Element = document.getElementById('image2');
      if(image2Element && window.innerHeight > image2Element.clientHeight){
        window.addEventListener('scroll', () => blurOnScroll('image2'));
      }
    }

  }, []);
  const blurOnScroll = (id: string) => {
    const windowHeight = window.innerHeight;
    const scrollPosition = window.scrollY;
    const blurAmount = scrollPosition / windowHeight * 2;
    const canvas = document.getElementById(id) as HTMLCanvasElement | null;
    if (!canvas) return;
    canvas.style.filter = `blur(${blurAmount}px)`;
  }


  return (
    <>
      {isLoading && (
        <div className="loading-screen">
          <div className="logo1">
            <img src={logo} alt="logo" />
          </div>
          <div className="loading-content">

            <Spin size="large" />
            <Typography.Title level={4} style={{ marginTop: 20, color: '#fff' }}>
              Loading FC 25 Experience...
            </Typography.Title>
            <Progress
              percent={Math.round(loadingProgress)}
              status="active"
              strokeColor="#1890ff"
              style={{ width: 300, marginTop: 20 }}
            />
          </div>
        </div>
      )}

      <div className="wrapper" style={{ display: isLoading ? 'none' : 'block' }}>
        <div className="content">
          <section>
            <div className="logo">
              <img src={logo} alt="logo" />
            </div>
            <canvas id="image" />
            <h1 className="title">
              FC 25
            </h1>
            <div className="ball" />
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
    </>
  )
}

export default App
