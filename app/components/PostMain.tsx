import { useCallback, useEffect, useRef, useState } from "react";
import { FiVolume2 } from "react-icons/fi";
import { ImMusic } from "react-icons/im";
import useCreateBucketUrl from "../hooks/useCreateBucketUrl";
import useDeviceType from "../hooks/useDeviceType";
import { PostMainCompTypes } from "../types";
import PostMainLikes from "./PostMainLikes";

export default function PostMain({ post }: PostMainCompTypes) {
    const videoRef = useRef<HTMLVideoElement | null>(null);
    const [volume, setVolume] = useState(1); // Quản lý âm lượng (giá trị từ 0 đến 1)
    const [currentTime, setCurrentTime] = useState(0); // Thời gian hiện tại của video
    const [showVolumeControl, setShowVolumeControl] = useState(false); // Quản lý hiển thị thanh điều khiển âm lượng
    const [isDragging, setIsDragging] = useState(false); // Kiểm tra xem người dùng có đang kéo thanh không
    const [isHover, setIsHover] = useState(false);

    const handleUserInteraction = useCallback(() => {
        if (videoRef.current) {
            videoRef.current.muted = false;
        }
    }, []);

    useEffect(() => {
        const events = ['keydown', 'click'];
        events.forEach(event => {
            window.addEventListener(event, handleUserInteraction);
        });

        window.addEventListener("touchstart", handleUserInteraction);

        return () => {
            events.forEach(event => {
                window.removeEventListener(event, handleUserInteraction);
            });
            // Gỡ sự kiện vuốt
            window.removeEventListener("touchstart", handleUserInteraction);
            // window.removeEventListener("touchend", handleTouchEnd);
        }
    }, [handleUserInteraction]);

    useEffect(() => {
        if (videoRef.current) {
            const video = videoRef.current;
            const postMainElement = document.getElementById(`PostMain-${post.id}`);

            if (postMainElement) {
                let observer = new IntersectionObserver(
                    (entries) => {
                        if (!entries[0].isIntersecting) {
                            video.pause();

                        } else {
                            // Khi video hiện thị trong viewport thì chay video
                            video.play().catch((err) => {
                                console.error("Error playing video:", err);
                            });

                        }
                    },
                    { threshold: [0.6] }
                );
                observer.observe(postMainElement);
            }
        }
    }, [post.id]);

    // Hàm thay đổi âm lượng
    const handleVolumeChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
        const volumeValue = parseFloat(e.target.value);
        setVolume(volumeValue);
        if (videoRef.current) videoRef.current.volume = volumeValue;
    }, []);

    // Hàm hiển thị/ẩn thanh điều khiển âm lượng khi hover
    const handleVolumeIconHover = () => {
        setShowVolumeControl(true);
    };

    const handleVolumeIconLeave = () => {
        setShowVolumeControl(false);
    };

    const handleClickDuration = useCallback((e: React.MouseEvent) => {
        const progressBar = e.currentTarget as HTMLElement;
        const clickedPosition = (e.clientX - progressBar.getBoundingClientRect().left) / progressBar.offsetWidth;
        if (videoRef.current) {
            videoRef.current.currentTime = clickedPosition * videoRef.current.duration;
        }
    }, []);

    // Hàm xử lý bắt đầu kéo thanh
    const handleMouseDown = () => {
        setIsDragging(true);
        videoRef.current?.pause();
    };
    const handleMouseHover = () => {
        setIsHover(prev => !prev);
    };
    // Hàm xử lý kết thúc kéo thanh
    const handleMouseUp = () => {
        setIsDragging(false);
        videoRef.current?.play();
    };

    // Hàm xử lý kéo thanh
    const handleMouseMove = (e: React.MouseEvent | React.TouchEvent) => {
        if (!isDragging || !videoRef.current) return;
        ;
        const progressBar = e.currentTarget as HTMLElement; // Ép kiểu thành HTMLElement

        let clientX: number;
        if ("touches" in e) {
            // Nếu là sự kiện cảm ứng (touch)
            clientX = e.touches[0].clientX;
        } else {
            // Nếu là sự kiện chuột (mouse)
            clientX = e.clientX;
        }

        const draggedPosition =
            (clientX - progressBar.getBoundingClientRect().left) /
            progressBar.offsetWidth;

        videoRef.current.currentTime = draggedPosition * videoRef.current.duration;

    };
    const togglePlayPause = useCallback(() => {
        if (videoRef.current) {
            if (videoRef.current.paused) {
                videoRef.current.muted = false;
                videoRef.current.play().catch((err) => {
                    console.error("Error playing video:", err);
                });

            } else {
                videoRef.current.pause();
            }
        }
    }, []);
    const handleVideoTimeUpdate = useCallback(() => {
        if (videoRef.current) {
            setCurrentTime(videoRef.current.currentTime);
        }
    }, []);
    const handleModalClose = (modalCurrentTime: number) => {
        setCurrentTime(modalCurrentTime); // Cập nhật lại currentTime từ modal về cha
        if (videoRef.current) {
            videoRef.current.currentTime = modalCurrentTime; // Cập nhật video ngoài với currentTime mới
        }
    };
    const deviceType = useDeviceType();

    return (
        <section className="scroll-section h-full justify-center border-b items-center scroll-snap-align">
            <div id={`PostMain-${post.id}`} className="flex h-full">
                <div className="sm:pl-3 w-full sm:px-4">
                    <div className="sm:mt-2.5 flex justify-center h-full sm:h-[calc(100%-40px)]">
                        <div className="relative w-max flex items-center bg-black sm:rounded-xl cursor-pointer">
                            <>
                                <div className={`${isDragging ? 'opacity-50' : 'opacity-100'} absolute sm:rounded-xl left-0 w-full bottom-0 p-4 text-white text-sm bg-gradient-to-t from-black to-transparent`}>
                                    <p className="text-[15px] pb-0.5 break-words md:max-w-[400px] max-w-[300px] font-semibold">{post.profile.name}</p>
                                    <p className="text-[15px] pb-0.5 break-words md:max-w-[400px] max-w-[300px]">{post.text}</p>
                                    <p className="text-[14px] text-white pb-0.5">#fun #cool #SuperAwesome</p>
                                    <p className="text-[14px] pb-0.5 flex items-center ">
                                        <ImMusic size="14" />
                                        <span className="px-1">original sound - AWESOME</span>
                                    </p>
                                </div>
                                <video
                                    onTouchStart={() => setIsDragging(true)}
                                    onTouchEnd={() => setIsDragging(false)}
                                    onClick={togglePlayPause}
                                    ref={videoRef}
                                    id={`video-${post.id}`}
                                    loop
                                    muted
                                    autoPlay
                                    playsInline
                                    preload="auto"
                                    className="sm:rounded-xl object-cover mx-auto h-full"
                                    src={useCreateBucketUrl(post?.video_url)}
                                    onTimeUpdate={handleVideoTimeUpdate}
                                />
                                {deviceType !== 'mobile' && (
                                    <div
                                        onMouseEnter={handleVolumeIconHover}
                                        onMouseLeave={handleVolumeIconLeave}
                                        className="flex p-4 volume-control absolute left-0 top-0"
                                    >
                                        <label htmlFor="volume">
                                            <FiVolume2 size={25} color="#FFFFFFE6" />
                                        </label>

                                        {showVolumeControl && (
                                            <input
                                                type="range"
                                                className="volume-progress accent-white/80"
                                                min="0"
                                                max="1"
                                                step="0.01"
                                                value={volume}
                                                onChange={handleVolumeChange}
                                            />
                                        )}
                                    </div>
                                )}


                                <div
                                    className="duration-control absolute left-0 bottom-0 z-10 w-full h-[4px] hover:h-[6px] sm:h-[8px] sm:hover:h-[10px] duration-200 bg-white/30"
                                    onClick={handleClickDuration}
                                    onMouseDown={handleMouseDown}
                                    onMouseUp={handleMouseUp}
                                    onMouseMove={handleMouseMove}
                                    onMouseEnter={handleMouseHover}
                                    onMouseLeave={handleMouseHover}

                                >
                                    {videoRef.current && (
                                        <>
                                            <div
                                                className="h-full bg-white/90 sm:bg-progress "
                                                style={
                                                    deviceType !== 'mobile' ?
                                                        {
                                                            clipPath: 'inset(0px round 0px 0px 0px 0.5rem)',
                                                            width: `${(videoRef.current.currentTime /
                                                                videoRef.current.duration) *
                                                                100}%`,
                                                        } :
                                                        {

                                                            width: `${(videoRef.current.currentTime /
                                                                videoRef.current.duration) *
                                                                100}%`,
                                                        }
                                                }
                                            ></div>

                                            <div
                                                className="circle-progress absolute z-10 -translate-y-1/2 w-2 h-2 sm:w-4 sm:h-4 rounded-full border bg-white shadow-xl top-1/2"
                                                style={{
                                                    left: `${(currentTime / videoRef.current.duration) *
                                                        100}%`,
                                                }}
                                            />

                                        </>
                                    )}
                                </div>

                                {/* Nút Play/Pause */}
                                <div
                                    onClick={togglePlayPause}
                                    className="absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2 text-white z-10"
                                >

                                </div>

                            </>
                        </div>
                        <PostMainLikes togglePlayPause={togglePlayPause} onModalClose={handleModalClose} isDragging={isDragging} currentTime={currentTime} post={post} />
                    </div>
                </div>
            </div>
        </section>
    );
}
