import { useVideoContext } from "@/app/context/video";
import useDeviceType from "@/app/hooks/useDeviceType";
import useUploadsUrl from "@/app/hooks/useUploadsUrl";
import { usePostStore } from "@/app/stores/post";
import { PostMainCompTypes, PostWithProfile } from "@/app/types";
import { useRouter } from "next/navigation";
import { memo, useEffect, useState } from "react";
import { AiOutlineClose } from "react-icons/ai";
import { BiChevronDown, BiChevronUp } from "react-icons/bi";
import ClientOnly from "../ClientOnly";
import Comments from "./Comments";
import CommentsHeader from "./CommentsHeader";

interface ActionProps {
    closeModal: () => void;
    videoRef: React.RefObject<HTMLVideoElement>;
}
const ModalPost: React.FC<PostMainCompTypes & ActionProps> = ({ post, closeModal, videoRef }) => {
    const [currentVideo, setCurrentVideo] = useState<PostWithProfile>(post)
    const { currentIndex, setCurrentIndex } = useVideoContext();
    let { allPosts, setAllPosts } = usePostStore();

    const deviceType = useDeviceType();
    const router = useRouter()
    useEffect(() => {
        if (!allPosts.length) {  // Kiểm tra nếu allPosts chưa có dữ liệu
            setAllPosts();         // Gọi setAllPosts chỉ một lần khi allPosts chưa có dữ liệu
        }
        const index = allPosts.findIndex((video) => video.id === currentVideo.id);
        setCurrentIndex(index)
    }, [allPosts, setAllPosts])

    const loopThroughPostsUp = () => {
        if (currentIndex > 0) {
            const prevIndex = currentIndex - 1;
            setCurrentIndex(prevIndex);
            setCurrentVideo(allPosts[prevIndex])
        }
    }

    const loopThroughPostsDown = () => {
        if (currentIndex < allPosts.length - 1) {
            const nextIndex = currentIndex + 1;
            setCurrentIndex(nextIndex);
            setCurrentVideo(allPosts[nextIndex])
        }
    }
    const params = {
        userId: currentVideo.profile?.user_id,
        postId: currentVideo.id
    }

    return (
        <div id="PostPage" className="lg:flex justify-between w-full sm:h-screen  sm:bg-black">
            {/* Video */}
            {deviceType !== 'mobile' && (
                <div className="hidden sm:block lg:w-[calc(100%-540px)] h-full relative">
                    <div onClick={closeModal}
                        className="absolute text-white z-20 m-5 rounded-full bg-gray-700 p-1.5 hover:bg-gray-800">
                        <AiOutlineClose size="27" />
                    </div>
                    <div>
                        <div className="absolute z-30 right-4 top-1/2 -translate-y-1/2 flex flex-col gap-4">

                            <button
                                onClick={() => loopThroughPostsUp()}
                                className={`${currentIndex > 0 ? 'opacity-100' : 'opacity-20 select-none cursor-not-allowed'} flex items-center justify-center rounded-full bg-gray-700 p-1.5 hover:bg-gray-800`}
                            >
                                <BiChevronUp size="30" color="#FFFFFF" />
                            </button>


                            <button
                                onClick={() => loopThroughPostsDown()}
                                className={`${currentIndex < allPosts.length - 1 ? 'opacity-100' : 'opacity-20 select-none cursor-not-allowed'} flex items-center justify-center rounded-full bg-gray-700 p-1.5 hover:bg-gray-800`}
                            >
                                <BiChevronDown size="30" color="#FFFFFF" />
                            </button>

                        </div>

                        <img
                            className="absolute z-20 top-[18px] left-[70px] rounded-full lg:mx-0 mx-auto"
                            width="45"
                            src="/images/nailpro-logo.png"
                        />
                        <ClientOnly>


                            <div className="bg-black bg-opacity-70 lg:min-w-[480px] z-10 relative">
                                {currentVideo.video_url && (
                                    <video
                                        id={`modal-video-${currentVideo.id}`}
                                        ref={videoRef}
                                        autoPlay
                                        controls
                                        playsInline
                                        loop
                                        className="h-screen mx-auto"
                                        src={useUploadsUrl(currentVideo.video_url)}
                                    />
                                )}

                            </div>
                        </ClientOnly>
                    </div>
                </div>
            )}
            {/* Comment */}
            <div id="InfoSection" className="lg:max-w-[550px] relative w-full h-full rounded-t-[20px] sm:rounded-none bg-black sm:bg-white">
                <div className="sm:py-7" />
                <div onClick={closeModal}
                    className="flex sm:hidden justify-end text-white  px-5 pt-4">
                    <AiOutlineClose size="24" />
                </div>
                {deviceType !== 'mobile' &&
                    <ClientOnly>
                        {post ? (
                            <CommentsHeader post={post}
                                params={params} />
                        ) : null}

                    </ClientOnly>
                }
                <Comments params={params} />
            </div>
        </div>
    );
}
export default memo(ModalPost);