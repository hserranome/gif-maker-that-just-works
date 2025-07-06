import { useGifStore } from '../store/gifStore';
import { Frame } from '../types';

export const useFrameManagement = () => {
  const frames = useGifStore(state => state.frames);
  const globalDelay = useGifStore(state => state.settings.globalDelay);
  const updateFrame = useGifStore(state => state.updateFrame);
  const removeFrame = useGifStore(state => state.removeFrame);
  const reorderFrames = useGifStore(state => state.reorderFrames);

  const moveFrame = (fromIndex: number, toIndex: number) => {
    const newFrames = [...frames];
    const [movedFrame] = newFrames.splice(fromIndex, 1);
    newFrames.splice(toIndex, 0, movedFrame);
    reorderFrames(newFrames);
  };

  const resetFrameDelay = (frameId: number) => {
    updateFrame(frameId, { 
      delay: globalDelay, 
      useGlobalDelay: true 
    });
  };

  const setCustomDelay = (frameId: number, delay: number) => {
    updateFrame(frameId, { 
      delay: delay, 
      useGlobalDelay: false 
    });
  };

  return {
    frames,
    globalDelay,
    moveFrame,
    resetFrameDelay,
    setCustomDelay,
    removeFrame
  };
};