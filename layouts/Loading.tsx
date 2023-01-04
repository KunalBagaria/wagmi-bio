import Lottie from "lottie-react";
import animation from '@/components/LoadingAnimation.json'

export const Loading = ({ size }: { size: number }) => (
  <div style={{ height: `${size}px`, width: `${size}px` }}>
    <Lottie autoPlay={true} loop={true} animationData={animation} />
  </div>
);