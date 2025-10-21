import { useState } from "react";
import { useTranslation } from "react-i18next";
import { Button } from "./ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Shuffle } from "lucide-react";
import { generateRandomAvatar } from "../lib/avatarGenerator";
import { Avatar } from "../lib/avatarTypes";

interface AvatarCreatorProps {
  onAvatarGenerated: (avatar: Avatar) => void;
  currentAvatar: Avatar | null;
}

export default function AvatarCreator({ onAvatarGenerated, currentAvatar }: AvatarCreatorProps) {
  const { t } = useTranslation();
  const [isGenerating, setIsGenerating] = useState(false);

  const handleGenerateRandom = async () => {
    setIsGenerating(true);
    try {
      // Simulate generation time for better UX
      await new Promise(resolve => setTimeout(resolve, 1000));
      const newAvatar = generateRandomAvatar();
      onAvatarGenerated(newAvatar);
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <Card className="bg-dark-brown border-dark-brown text-light-grey">
      <CardHeader>
        <CardTitle className="text-bright-blue font-lora">
          {t('avatarCreator.title', 'Avatar Creator')}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="text-sm opacity-80">
          {t('avatarCreator.description', 'Generate a random avatar or customize below')}
        </div>
        
        <Button
          onClick={handleGenerateRandom}
          disabled={isGenerating}
          className="w-full bg-bright-blue text-black hover:bg-bright-blue/90"
        >
          <Shuffle className="w-4 h-4 mr-2" />
          {isGenerating 
            ? t('avatarCreator.generating', 'Generating...') 
            : t('avatarCreator.generateRandom', 'Generate Random Avatar')
          }
        </Button>

        {currentAvatar && (
          <div className="text-sm space-y-2 p-3 bg-black/20 rounded">
            <div className="font-medium text-bright-blue">
              {t('avatarCreator.currentAvatar', 'Current Avatar')}
            </div>
            <div>
              <span className="opacity-70">{t('avatarCreator.name', 'Name')}: </span>
              <span className="font-mono">{currentAvatar.name}</span>
            </div>
            <div>
              <span className="opacity-70">{t('avatarCreator.gender', 'Gender')}: </span>
              <span className="capitalize">{currentAvatar.appearance.gender}</span>
            </div>
            <div>
              <span className="opacity-70">{t('avatarCreator.voice', 'Voice')}: </span>
              <span className="capitalize">{currentAvatar.voice.type}</span>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
