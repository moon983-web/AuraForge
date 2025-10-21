import { useState, useCallback } from "react";
import { Avatar } from "../lib/avatarTypes";

const STORAGE_KEY = "avatar_creator_saved_avatars";

export function useAvatarStorage() {
  const [savedAvatars, setSavedAvatars] = useState<Avatar[]>(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      return stored ? JSON.parse(stored) : [];
    } catch (error) {
      console.error("Failed to load saved avatars:", error);
      return [];
    }
  });

  const saveAvatar = useCallback((avatar: Avatar) => {
    try {
      const updated = savedAvatars.filter(a => a.id !== avatar.id);
      updated.push({ ...avatar, lastModified: new Date() });
      
      // Keep only the last 20 avatars
      const trimmed = updated.slice(-20);
      
      localStorage.setItem(STORAGE_KEY, JSON.stringify(trimmed));
      setSavedAvatars(trimmed);
      
      return true;
    } catch (error) {
      console.error("Failed to save avatar:", error);
      return false;
    }
  }, [savedAvatars]);

  const loadAvatar = useCallback((id: string): Avatar | null => {
    try {
      const avatar = savedAvatars.find(a => a.id === id);
      return avatar || null;
    } catch (error) {
      console.error("Failed to load avatar:", error);
      return null;
    }
  }, [savedAvatars]);

  const deleteAvatar = useCallback((id: string) => {
    try {
      const updated = savedAvatars.filter(a => a.id !== id);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
      setSavedAvatars(updated);
      return true;
    } catch (error) {
      console.error("Failed to delete avatar:", error);
      return false;
    }
  }, [savedAvatars]);

  const getSavedAvatars = useCallback(() => {
    return [...savedAvatars].sort((a, b) => 
      new Date(b.lastModified || 0).getTime() - new Date(a.lastModified || 0).getTime()
    );
  }, [savedAvatars]);

  const exportAvatars = useCallback(() => {
    try {
      const dataStr = JSON.stringify(savedAvatars, null, 2);
      const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);
      
      const exportFileDefaultName = 'avatars_export.json';
      
      const linkElement = document.createElement('a');
      linkElement.setAttribute('href', dataUri);
      linkElement.setAttribute('download', exportFileDefaultName);
      linkElement.click();
      
      return true;
    } catch (error) {
      console.error("Failed to export avatars:", error);
      return false;
    }
  }, [savedAvatars]);

  const importAvatars = useCallback((file: File) => {
    return new Promise<boolean>((resolve) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          const result = e.target?.result;
          if (typeof result === 'string') {
            const importedAvatars: Avatar[] = JSON.parse(result);
            
            // Validate structure
            if (Array.isArray(importedAvatars)) {
              const merged = [...savedAvatars, ...importedAvatars];
              const unique = merged.filter((avatar, index, self) => 
                self.findIndex(a => a.id === avatar.id) === index
              );
              
              localStorage.setItem(STORAGE_KEY, JSON.stringify(unique));
              setSavedAvatars(unique);
              resolve(true);
            } else {
              resolve(false);
            }
          } else {
            resolve(false);
          }
        } catch (error) {
          console.error("Failed to import avatars:", error);
          resolve(false);
        }
      };
      reader.onerror = () => resolve(false);
      reader.readAsText(file);
    });
  }, [savedAvatars]);

  return {
    saveAvatar,
    loadAvatar,
    deleteAvatar,
    getSavedAvatars,
    exportAvatars,
    importAvatars,
    savedCount: savedAvatars.length
  };
}
