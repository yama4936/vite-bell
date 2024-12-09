import React, { useEffect, useState } from "react";
import { Audio } from "./Audio";

// 加速度センサーコンポーネント
export const Accelerometer: React.FC = () => {
    const [acceleration, setAcceleration] = useState({
        x: 0,
        y: 0,
        z: 0,
    });

    useEffect(() => {
        const handleMotion = (event: DeviceMotionEvent) => {
            const { x, y, z } = event.accelerationIncludingGravity || { x: 0, y: 0, z: 0 };
            setAcceleration({
                x: x || 0,
                y: y || 0,
                z: z || 0,
            });
        };

        window.addEventListener("devicemotion", handleMotion);

        return () => {
            window.removeEventListener("devicemotion", handleMotion);
        };
    }, []);

    const ShakeDetector: React.FC<{ acceleration: { x: number } }> = ({ acceleration }) => {
        const [count, setCount] = useState(0);
        const [message, setMessage] = useState<string | null>(null);
        const [showAudio, setShowAudio] = useState(false);

        useEffect(() => {
            if (acceleration.x >= 3) {
                setCount(prevCount => {
                    const newCount = prevCount + 1;
                    setMessage(`${newCount}回振られた`);
                    return newCount;
                });
            }
            if (count >= 10 && !showAudio) {
                setMessage("10回振られたよ!!!!");
                setShowAudio(true); // Audio を表示
            }
        }, [acceleration.x, count, showAudio]);

        return (
            <div>
                <div id="shake-message">
                    {message && <p>{message}</p>}
                </div>
                {showAudio && <Audio />}
            </div>
        );
    };

    return (
        <div >
            <ShakeDetector acceleration={acceleration} />

            <div id="result_acc">
                <h3>加速度センサー</h3>
                <p>X：{acceleration.x.toFixed(2)} (m/s²)</p>
                <p>Y：{acceleration.y.toFixed(2)} (m/s²)</p>
                <p>Z：{acceleration.z.toFixed(2)} (m/s²)</p>
            </div>
        </div>
    );
};