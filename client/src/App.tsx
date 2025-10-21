import { Suspense, useState } from "react";
import { Canvas } from "@react-three/fiber";
import { KeyboardControls } from "@react-three/drei";
import "@fontsource/inter";
import "@fontsource/space-grotesk";
import "@fontsource/lora";
import "./lib/i18n";

import AvatarCreator from "./components/AvatarCreator";
import AvatarViewer from "./components/AvatarViewer";
import ConversationInterface from "./components/ConversationInterface";
import CustomizationPanel from "./components/CustomizationPanel";
import LanguageToggle from "./components/LanguageToggle";
import { useAvatarStorage } from "./hooks/useAvatarStorage";
import { Avatar } from "./lib/avatarTypes";

// Define control keys for avatar interaction
const controls = [
  { name: "rotateLeft", keys: ["ArrowLeft", "KeyA"] },
  { name: "rotateRight", keys: ["ArrowRight", "KeyD"] },
  { name: "zoomIn", keys: ["KeyW", "ArrowUp"] },
  { name: "zoomOut", keys: ["KeyS", "ArrowDown"] },
];

function App() {
  const [currentAvatar, setCurrentAvatar] = useState<Avatar | null>(null);
  const [activeTab, setActiveTab] = useState<'create' | 'chat'>('create');
  const [isTalking, setIsTalking] = useState(false);
  const { saveAvatar, loadAvatar, getSavedAvatars } = useAvatarStorage();

  const handleAvatarChange = (avatar: Avatar) => {
    setCurrentAvatar(avatar);
    saveAvatar(avatar);
  };

  const handleLoadAvatar = (id: string) => {
    const avatar = loadAvatar(id);
    if (avatar) {
      setCurrentAvatar(avatar);
    }
  };

  return (
    <div className="min-h-screen bg-black text-light-grey font-sans">
      {/* Header */}
      <header className="bg-dark-blue border-b border-dark-brown p-4">
        <div className="flex justify-between items-center max-w-7xl mx-auto">
          <h1 className="text-2xl font-bold text-bright-blue font-lora">
            3D Avatar Creator
          </h1>
          <div className="flex items-center gap-4">
            <nav className="flex gap-2">
              <button
                onClick={() => setActiveTab('create')}
                className={`px-4 py-2 rounded transition-colors ${
                  activeTab === 'create' 
                    ? 'bg-bright-blue text-black' 
                    : 'bg-dark-brown text-light-grey hover:bg-dark-brown/80'
                }`}
              >
                Create Avatar
              </button>
              <button
                onClick={() => setActiveTab('chat')}
                className={`px-4 py-2 rounded transition-colors ${
                  activeTab === 'chat' 
                    ? 'bg-bright-blue text-black' 
                    : 'bg-dark-brown text-light-grey hover:bg-dark-brown/80'
                }`}
                disabled={!currentAvatar}
              >
                Chat with Avatar
              </button>
            </nav>
            <LanguageToggle />
          </div>
        </div>
      </header>

      <div className="flex h-[calc(100vh-80px)]">
        {/* Main Content */}
        <main className="flex-1 flex">
          {/* 3D Viewport */}
          <div className="flex-1 relative">
            <KeyboardControls map={controls}>
              <Canvas
                shadows
                camera={{
                  position: [0, 1.5, 3],
                  fov: 45,
                  near: 0.1,
                  far: 1000
                }}
                className="bg-black"
              >
                <color attach="background" args={["#000000"]} />
                
                {/* Lighting */}
                <ambientLight intensity={0.4} />
                <directionalLight
                  position={[5, 5, 5]}
                  intensity={1}
                  castShadow
                  shadow-mapSize={[2048, 2048]}
                />
                <pointLight position={[-5, 3, 2]} intensity={0.3} color="#4FC3F7" />

                <Suspense fallback={null}>
                  <AvatarViewer avatar={currentAvatar} isTalking={isTalking} />
                </Suspense>
              </Canvas>
            </KeyboardControls>

            {/* Loading indicator */}
            <div className="absolute top-4 left-4 bg-dark-blue/80 backdrop-blur-sm rounded px-3 py-1 text-sm">
              Use arrow keys or WASD to rotate/zoom
            </div>
          </div>

          {/* Side Panel */}
          <div className="w-96 bg-dark-blue border-l border-dark-brown">
            {activeTab === 'create' && (
              <div className="h-full flex flex-col">
                <AvatarCreator
                  onAvatarGenerated={handleAvatarChange}
                  currentAvatar={currentAvatar}
                />
                <CustomizationPanel
                  avatar={currentAvatar}
                  onAvatarChange={handleAvatarChange}
                  onLoadAvatar={handleLoadAvatar}
                  savedAvatars={getSavedAvatars()}
                />
              </div>
            )}
            
            {activeTab === 'chat' && currentAvatar && (
              <ConversationInterface 
                avatar={currentAvatar} 
                onTalkingChange={setIsTalking}
              />
            )}
          </div>
        </main>
      </div>
    </div>
  );
}

export default App;
