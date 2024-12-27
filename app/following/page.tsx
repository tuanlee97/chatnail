"use client"

import { usePostStore } from "@/app/stores/post"
import { useEffect, useRef, useState } from "react"
import ClientOnly from "../components/ClientOnly"
import PostMain from "../components/PostMain"
import { VideoContext } from "../context/video"
import MainLayout from "../layouts/MainLayout"
export default function Home() {
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [isMuted, setIsMuted] = useState<boolean>(true);
  let { allPosts, setAllPosts } = usePostStore();

  const videoContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setAllPosts()
  }, [])

  // Hàm cuộn đến video hiện tại
  const scrollToCurrentVideo = () => {
    if (videoContainerRef.current) {
      const videoElement = videoContainerRef.current.children[currentIndex] as HTMLElement;
      if (videoElement) {
        videoElement.scrollIntoView({
          behavior: "smooth",
          block: "center", // Căn giữa video trong màn hình
        });
      }
    }
  };

  useEffect(() => {
    scrollToCurrentVideo();
  }, [currentIndex]);

  return (
    <>
      <MainLayout>
        <div className="sm:mt-[80px] w-full sm:max-w-[calc(100vw-80px)] lg:max-w-[calc(100vw-250px)]  ml-auto sm:px-12 ">
          <ClientOnly>
            <div ref={videoContainerRef} className="w-full mx-auto scroll-container h-[calc(100dvh-60px)] sm:h-[calc(100dvh-80px)] overflow-y-scroll scroll-snap-y scrollbar-w-0">
              <VideoContext.Provider value={{ currentIndex, setCurrentIndex, isMuted, setIsMuted }}>
                {allPosts.map((post) => (
                  <PostMain key={post.id} post={post} />
                ))}
              </VideoContext.Provider>
            </div>
          </ClientOnly>
        </div>
      </MainLayout>
    </>
  )
}