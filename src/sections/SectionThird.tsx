import { useEffect, useState } from "react";
import { gsap } from "gsap";
import { Button, message, Steps, theme } from "antd";
import './SectionThird.css'
export default function SectionThird() {
    useEffect(() => {

        const TOTAL_FRAMES = 50
        const createURL = (frame: number, url: string) => {
            const id = (frame + 1).toString().padStart(2, '0');
            return new URL(`${url}${id}.png`, import.meta.url).href;
        }
        const images = Array.from({ length: TOTAL_FRAMES }, (_, index) => {
            const img = new Image()
            img.src = createURL(index, './../assets/stadium/')
            return img
        })
        const imageCanvas = {
            frame: 0,
        }
        images[0].onload = () => render()

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
        })

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
            <canvas id="image2"></canvas>
            <div className="steps-content">
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
