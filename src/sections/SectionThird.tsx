import { useEffect, useState } from "react";
import { gsap } from "gsap";
import { Button, message, Steps, theme, Spin, Progress, Typography } from "antd";
import './SectionThird.css'

export default function SectionThird() {
    const [isLoading, setIsLoading] = useState(true);
    const [loadingProgress, setLoadingProgress] = useState(0);
    const [imagesLoaded, setImagesLoaded] = useState(0);
    const [totalImages, setTotalImages] = useState(0);

    useEffect(() => {
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
                img.src = createURL(index, 'https://pablojaramunoz.com/videos/stadium/');
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
            }
        };

        loadAllImages();

        // Function to initialize animations after images are loaded
        const initializeAnimations = (images: HTMLImageElement[]) => {
            const imageCanvas = {
                frame: 0,
            }

            function render() {
                const canvas = document.getElementById('image2') as HTMLCanvasElement | null;
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

            const tl = gsap.timeline({
                defaults: {
                    duration: 2,
                    ease: 'power2.inOut',
                    yoyo: true,
                },
            });
            
            tl.to(imageCanvas, {
                frame: TOTAL_FRAMES - 1,
                ease: 'none',
                snap: 'frame',
                scrollTrigger: {
                    scrub: 0.5,
                },
                onUpdate: render,
            });

            // Start rendering
            render();
        }

    }, []);
    const steps = [
        {
            title: 'First',
            content: 'First-content',
        },
        {
            title: 'Second',
            content: 'Second-content',
        },
        {
            title: 'Last',
            content: 'Last-content',
        },
    ];
    const { token } = theme.useToken();
    const [current, setCurrent] = useState(0);

    const next = () => {
        setCurrent(current + 1);
    };

    const prev = () => {
        setCurrent(current - 1);
    };

    const items = steps.map((item) => ({ key: item.title, title: item.title }));

    const contentStyle: React.CSSProperties = {
        lineHeight: '260px',
        textAlign: 'center',
        color: token.colorTextTertiary,
        backgroundColor: token.colorFillAlter,
        borderRadius: token.borderRadiusLG,
        border: `1px dashed ${token.colorBorder}`,
        marginTop: 16,
    };
    return (
        <div className="section-third">
            {isLoading && (
                <div className="loading-overlay">
                    <div className="loading-content">
                        <Spin size="large" />
                        <Typography.Title level={4} style={{ marginTop: 20, color: '#fff' }}>
                            Loading Stadium Experience...
                        </Typography.Title>
                        <Progress 
                            percent={Math.round(loadingProgress)} 
                            status="active"
                            strokeColor="#1890ff"
                            style={{ width: 250, marginTop: 20 }}
                        />
                        <Typography.Text style={{ marginTop: 10, color: '#ccc' }}>
                            {imagesLoaded} / {totalImages} images loaded
                        </Typography.Text>
                    </div>
                </div>
            )}
            
            <canvas id="image2" style={{ display: isLoading ? 'none' : 'block' }}></canvas>
            <div className="steps-content" style={{ display: isLoading ? 'none' : 'block' }}>
                <Steps current={current} items={items} />
                <div style={contentStyle}>{steps[current].content}</div>
                <div style={{ marginTop: 24 }}>
                    {current < steps.length - 1 && (
                        <Button type="primary" style={{ backgroundColor: 'black', color: 'white' }} onClick={() => next()}>
                            Next
                        </Button>
                    )}
                    {current === steps.length - 1 && (
                        <Button type="primary" style={{ backgroundColor: 'gray', color: 'white' }} onClick={() => message.success('Processing complete!')}>
                            Done
                        </Button>
                    )}
                    {current > 0 && (
                        <Button style={{ margin: '0 8px', backgroundColor: 'gray', color: 'white' }} onClick={() => prev()}>
                            Previous
                        </Button>
                    )}
                </div>
            </div>
        </div>
    )
}
