import { useState } from "react";
import { useTranslation } from "react-i18next";
import { Button } from "./ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { Slider } from "./ui/slider";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import { ScrollArea } from "./ui/scroll-area";
import { Separator } from "./ui/separator";
import { Save, Download, Trash2 } from "lucide-react";
import { Avatar, AvatarAppearance, PersonalityTrait } from "../lib/avatarTypes";

interface CustomizationPanelProps {
  avatar: Avatar | null;
  onAvatarChange: (avatar: Avatar) => void;
  onLoadAvatar: (id: string) => void;
  savedAvatars: Avatar[];
}

export default function CustomizationPanel({ 
  avatar, 
  onAvatarChange, 
  onLoadAvatar, 
  savedAvatars 
}: CustomizationPanelProps) {
  const { t } = useTranslation();
  const [activeTab, setActiveTab] = useState("appearance");

  if (!avatar) {
    return (
      <Card className="bg-dark-brown border-dark-brown text-light-grey">
        <CardContent className="p-6 text-center">
          <div className="text-sm opacity-60">
            {t('customization.noAvatar', 'Generate an avatar to start customization')}
          </div>
        </CardContent>
      </Card>
    );
  }

  const updateAvatar = (updates: Partial<Avatar>) => {
    onAvatarChange({ ...avatar, ...updates });
  };

  const updateAppearance = (updates: Partial<AvatarAppearance>) => {
    updateAvatar({
      appearance: { ...avatar.appearance, ...updates }
    });
  };

  const colorOptions = [
    '#8B4513', '#D2B48C', '#F5DEB3', '#FFE4C4', '#FFDBAC', 
    '#F4A460', '#CD853F', '#A0522D', '#8B4513', '#654321'
  ];

  const hairColors = [
    '#000000', '#654321', '#8B4513', '#D2691E', '#FF4500', 
    '#FFD700', '#FFFF00', '#90EE90', '#0000FF', '#8A2BE2'
  ];

  const eyeColors = [
    '#8B4513', '#000000', '#0000FF', '#008000', '#808080', 
    '#FFA500', '#800080', '#FF0000', '#FFFF00', '#00FFFF'
  ];

  const clothingColors = [
    '#FF0000', '#00FF00', '#0000FF', '#FFFF00', '#FF00FF', 
    '#00FFFF', '#FFA500', '#800080', '#000000', '#FFFFFF'
  ];

  return (
    <Card className="h-full bg-dark-brown border-dark-brown text-light-grey">
      <CardHeader className="pb-2">
        <CardTitle className="text-bright-blue font-lora text-lg">
          {t('customization.title', 'Customize Avatar')}
        </CardTitle>
      </CardHeader>

      <CardContent className="flex-1 p-4">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="h-full">
          <TabsList className="grid w-full grid-cols-4 bg-black/40">
            <TabsTrigger value="appearance" className="text-xs">{t('customization.appearance', 'Look')}</TabsTrigger>
            <TabsTrigger value="personality" className="text-xs">{t('customization.personality', 'Mind')}</TabsTrigger>
            <TabsTrigger value="voice" className="text-xs">{t('customization.voice', 'Voice')}</TabsTrigger>
            <TabsTrigger value="saved" className="text-xs">{t('customization.saved', 'Saved')}</TabsTrigger>
          </TabsList>

          <ScrollArea className="mt-4 h-[calc(100%-60px)]">
            <TabsContent value="appearance" className="space-y-4 mt-0">
              {/* Name */}
              <div className="space-y-2">
                <Label>{t('customization.name', 'Name')}</Label>
                <Input
                  value={avatar.name}
                  onChange={(e) => updateAvatar({ name: e.target.value })}
                  className="bg-black/40 border-dark-brown"
                />
              </div>

              <Separator />

              {/* Gender */}
              <div className="space-y-2">
                <Label>{t('customization.gender', 'Gender')}</Label>
                <Select 
                  value={avatar.appearance.gender} 
                  onValueChange={(value: 'male' | 'female' | 'other') => updateAppearance({ gender: value })}
                >
                  <SelectTrigger className="bg-black/40 border-dark-brown">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="male">{t('gender.male', 'Male')}</SelectItem>
                    <SelectItem value="female">{t('gender.female', 'Female')}</SelectItem>
                    <SelectItem value="other">{t('gender.other', 'Other')}</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Body Type */}
              <div className="space-y-2">
                <Label>{t('customization.bodyType', 'Body Type')}</Label>
                <Select 
                  value={avatar.appearance.bodyType} 
                  onValueChange={(value: 'slim' | 'athletic' | 'curvy') => updateAppearance({ bodyType: value })}
                >
                  <SelectTrigger className="bg-black/40 border-dark-brown">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="slim">{t('bodyType.slim', 'Slim')}</SelectItem>
                    <SelectItem value="athletic">{t('bodyType.athletic', 'Athletic')}</SelectItem>
                    <SelectItem value="curvy">{t('bodyType.curvy', 'Curvy')}</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Skin Tone */}
              <div className="space-y-2">
                <Label>{t('customization.skinTone', 'Skin Tone')}</Label>
                <div className="grid grid-cols-5 gap-2">
                  {colorOptions.map((color) => (
                    <button
                      key={color}
                      onClick={() => updateAppearance({ skinTone: color })}
                      className={`w-8 h-8 rounded border-2 ${
                        avatar.appearance.skinTone === color ? 'border-bright-blue' : 'border-gray-600'
                      }`}
                      style={{ backgroundColor: color }}
                    />
                  ))}
                </div>
              </div>

              {/* Hair Color */}
              <div className="space-y-2">
                <Label>{t('customization.hairColor', 'Hair Color')}</Label>
                <div className="grid grid-cols-5 gap-2">
                  {hairColors.map((color) => (
                    <button
                      key={color}
                      onClick={() => updateAppearance({ hairColor: color })}
                      className={`w-8 h-8 rounded border-2 ${
                        avatar.appearance.hairColor === color ? 'border-bright-blue' : 'border-gray-600'
                      }`}
                      style={{ backgroundColor: color }}
                    />
                  ))}
                </div>
              </div>

              {/* Eye Color */}
              <div className="space-y-2">
                <Label>{t('customization.eyeColor', 'Eye Color')}</Label>
                <div className="grid grid-cols-5 gap-2">
                  {eyeColors.map((color) => (
                    <button
                      key={color}
                      onClick={() => updateAppearance({ eyeColor: color })}
                      className={`w-8 h-8 rounded border-2 ${
                        avatar.appearance.eyeColor === color ? 'border-bright-blue' : 'border-gray-600'
                      }`}
                      style={{ backgroundColor: color }}
                    />
                  ))}
                </div>
              </div>

              {/* Clothing */}
              <Separator />
              <div className="space-y-4">
                <h4 className="font-medium text-bright-blue">{t('customization.clothing', 'Clothing')}</h4>
                
                <div className="space-y-2">
                  <Label>{t('customization.topColor', 'Top Color')}</Label>
                  <div className="grid grid-cols-5 gap-2">
                    {clothingColors.map((color) => (
                      <button
                        key={color}
                        onClick={() => updateAppearance({ 
                          clothing: { ...avatar.appearance.clothing, color } 
                        })}
                        className={`w-8 h-8 rounded border-2 ${
                          avatar.appearance.clothing.color === color ? 'border-bright-blue' : 'border-gray-600'
                        }`}
                        style={{ backgroundColor: color }}
                      />
                    ))}
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>{t('customization.bottomColor', 'Bottom Color')}</Label>
                  <div className="grid grid-cols-5 gap-2">
                    {clothingColors.map((color) => (
                      <button
                        key={color}
                        onClick={() => updateAppearance({ 
                          clothing: { ...avatar.appearance.clothing, bottomColor: color } 
                        })}
                        className={`w-8 h-8 rounded border-2 ${
                          avatar.appearance.clothing.bottomColor === color ? 'border-bright-blue' : 'border-gray-600'
                        }`}
                        style={{ backgroundColor: color }}
                      />
                    ))}
                  </div>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="personality" className="space-y-4 mt-0">
              <div className="space-y-2">
                <Label>{t('customization.trait1', 'Primary Trait')}</Label>
                <Select 
                  value={avatar.personality.trait1} 
                  onValueChange={(value: PersonalityTrait) => updateAvatar({
                    personality: { ...avatar.personality, trait1: value }
                  })}
                >
                  <SelectTrigger className="bg-black/40 border-dark-brown">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="friendly">{t('personality.friendly', 'Friendly')}</SelectItem>
                    <SelectItem value="mysterious">{t('personality.mysterious', 'Mysterious')}</SelectItem>
                    <SelectItem value="playful">{t('personality.playful', 'Playful')}</SelectItem>
                    <SelectItem value="serious">{t('personality.serious', 'Serious')}</SelectItem>
                    <SelectItem value="adventurous">{t('personality.adventurous', 'Adventurous')}</SelectItem>
                    <SelectItem value="calm">{t('personality.calm', 'Calm')}</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>{t('customization.trait2', 'Secondary Trait')}</Label>
                <Select 
                  value={avatar.personality.trait2} 
                  onValueChange={(value: PersonalityTrait) => updateAvatar({
                    personality: { ...avatar.personality, trait2: value }
                  })}
                >
                  <SelectTrigger className="bg-black/40 border-dark-brown">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="intelligent">{t('personality.intelligent', 'Intelligent')}</SelectItem>
                    <SelectItem value="creative">{t('personality.creative', 'Creative')}</SelectItem>
                    <SelectItem value="humorous">{t('personality.humorous', 'Humorous')}</SelectItem>
                    <SelectItem value="empathetic">{t('personality.empathetic', 'Empathetic')}</SelectItem>
                    <SelectItem value="confident">{t('personality.confident', 'Confident')}</SelectItem>
                    <SelectItem value="curious">{t('personality.curious', 'Curious')}</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>{t('customization.chattiness', 'Chattiness')} ({avatar.personality.chattiness}%)</Label>
                <Slider
                  value={[avatar.personality.chattiness]}
                  onValueChange={([value]) => updateAvatar({
                    personality: { ...avatar.personality, chattiness: value }
                  })}
                  max={100}
                  step={5}
                  className="w-full"
                />
              </div>
            </TabsContent>

            <TabsContent value="voice" className="space-y-4 mt-0">
              <div className="space-y-2">
                <Label>{t('customization.voiceType', 'Voice Type')}</Label>
                <Select 
                  value={avatar.voice.type} 
                  onValueChange={(value: 'male' | 'female' | 'neutral') => updateAvatar({
                    voice: { ...avatar.voice, type: value }
                  })}
                >
                  <SelectTrigger className="bg-black/40 border-dark-brown">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="male">{t('voice.male', 'Male')}</SelectItem>
                    <SelectItem value="female">{t('voice.female', 'Female')}</SelectItem>
                    <SelectItem value="neutral">{t('voice.neutral', 'Neutral')}</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>{t('customization.voicePitch', 'Pitch')} ({avatar.voice.pitch.toFixed(1)})</Label>
                <Slider
                  value={[avatar.voice.pitch]}
                  onValueChange={([value]) => updateAvatar({
                    voice: { ...avatar.voice, pitch: value }
                  })}
                  min={0.5}
                  max={2}
                  step={0.1}
                  className="w-full"
                />
              </div>

              <div className="space-y-2">
                <Label>{t('customization.voiceSpeed', 'Speed')} ({avatar.voice.speed.toFixed(1)})</Label>
                <Slider
                  value={[avatar.voice.speed]}
                  onValueChange={([value]) => updateAvatar({
                    voice: { ...avatar.voice, speed: value }
                  })}
                  min={0.5}
                  max={2}
                  step={0.1}
                  className="w-full"
                />
              </div>
            </TabsContent>

            <TabsContent value="saved" className="space-y-4 mt-0">
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <Label>{t('customization.savedAvatars', 'Saved Avatars')}</Label>
                  <span className="text-xs opacity-60">{savedAvatars.length}</span>
                </div>
                
                {savedAvatars.length === 0 ? (
                  <div className="text-center py-8 text-sm opacity-60">
                    {t('customization.noSaved', 'No saved avatars yet')}
                  </div>
                ) : (
                  <div className="space-y-2">
                    {savedAvatars.map((savedAvatar) => (
                      <div key={savedAvatar.id} className="flex items-center justify-between p-2 bg-black/20 rounded">
                        <div className="flex-1">
                          <div className="font-medium text-sm">{savedAvatar.name}</div>
                          <div className="text-xs opacity-60 capitalize">
                            {savedAvatar.appearance.gender} • {savedAvatar.personality.trait1}
                          </div>
                        </div>
                        <div className="flex gap-1">
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => onLoadAvatar(savedAvatar.id)}
                            className="p-1 h-6 w-6"
                          >
                            <Download size={12} />
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </TabsContent>
          </ScrollArea>
        </Tabs>
      </CardContent>
    </Card>
  );
}
