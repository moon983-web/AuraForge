import { useState, useCallback, useEffect } from "react";
import { useTranslation } from "react-i18next";

interface LMStudioConfig {
  baseUrl: string;
  model: string;
  maxTokens: number;
  temperature: number;
}

const DEFAULT_CONFIG: LMStudioConfig = {
  baseUrl: "http://localhost:1234/v1",
  model: "local-model",
  maxTokens: 500,
  temperature: 0.7
};

export function useLMStudio() {
  const { t } = useTranslation();
  const [config, setConfig] = useState<LMStudioConfig>(DEFAULT_CONFIG);
  const [isConnected, setIsConnected] = useState(false);
  const [connectionStatus, setConnectionStatus] = useState<string>("Disconnected");
  const [isLoading, setIsLoading] = useState(false);

  // Test connection to LM Studio
  const testConnection = useCallback(async () => {
    try {
      setConnectionStatus(t('lmstudio.connecting', 'Connecting...'));
      
      const response = await fetch(`${config.baseUrl}/models`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
        signal: AbortSignal.timeout(5000) // 5 second timeout
      });

      if (response.ok) {
        setIsConnected(true);
        setConnectionStatus(t('lmstudio.connected', 'Connected'));
        return true;
      } else {
        throw new Error(`HTTP ${response.status}`);
      }
    } catch (error) {
      setIsConnected(false);
      if (error instanceof Error) {
        if (error.name === 'AbortError') {
          setConnectionStatus(t('lmstudio.timeout', 'Connection timeout'));
        } else if (error.message.includes('Failed to fetch')) {
          setConnectionStatus(t('lmstudio.offline', 'LM Studio offline'));
        } else {
          setConnectionStatus(t('lmstudio.error', 'Connection error'));
        }
      } else {
        setConnectionStatus(t('lmstudio.unknown', 'Unknown error'));
      }
      return false;
    }
  }, [config.baseUrl, t]);

  // Send message to LM Studio
  const sendMessage = useCallback(async (message: string, context?: string): Promise<string> => {
    if (!isConnected) {
      throw new Error(t('lmstudio.notConnected', 'Not connected to LM Studio'));
    }

    setIsLoading(true);

    try {
      const systemMessage = context || "You are a helpful AI assistant.";
      
      const response = await fetch(`${config.baseUrl}/chat/completions`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: config.model,
          messages: [
            { role: "system", content: systemMessage },
            { role: "user", content: message }
          ],
          max_tokens: config.maxTokens,
          temperature: config.temperature,
          stream: false
        }),
        signal: AbortSignal.timeout(30000) // 30 second timeout
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      const data = await response.json();
      
      if (data.choices && data.choices.length > 0) {
        return data.choices[0].message.content.trim();
      } else {
        throw new Error(t('lmstudio.noResponse', 'No response from AI'));
      }
    } catch (error) {
      if (error instanceof Error) {
        if (error.name === 'AbortError') {
          throw new Error(t('lmstudio.responseTimeout', 'Response timeout'));
        } else {
          throw error;
        }
      } else {
        throw new Error(t('lmstudio.unknownError', 'Unknown error occurred'));
      }
    } finally {
      setIsLoading(false);
    }
  }, [config, isConnected, t]);

  // Auto-test connection on mount and config changes
  useEffect(() => {
    testConnection();
  }, [testConnection]);

  // Periodically test connection if disconnected
  useEffect(() => {
    if (!isConnected) {
      const interval = setInterval(testConnection, 10000); // Test every 10 seconds
      return () => clearInterval(interval);
    }
  }, [isConnected, testConnection]);

  return {
    config,
    setConfig,
    isConnected,
    connectionStatus,
    isLoading,
    testConnection,
    sendMessage
  };
}
