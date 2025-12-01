"use client";

import {
  MODE_ASK,
  MODE_WRITE,
  MODEL_GPT_4_1,
  MODEL_GPT_4_1_MINI,
  MODEL_GPT_4_1_NANO,
  MODEL_GPT_5,
  MODEL_GPT_5_1,
  MODEL_GPT_5_MINI,
  MODEL_GPT_5_NANO,
} from "@/app/constants/chatbot-options";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useEditorStore } from "@/store/use-editor-store";
import { Send } from "lucide-react";
import { marked } from "marked";
import { useEffect, useMemo, useRef, useState } from "react";

interface Message {
  id: string;
  text: string;
  sender: "user" | "bot";
  timestamp: Date;
}

export const ChatbotPanel = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputText, setInputText] = useState("");
  const [isWaitingForResponse, setIsWaitingForResponse] = useState(false);
  const [mode, setMode] = useState<typeof MODE_ASK | typeof MODE_WRITE>(MODE_WRITE);
  const [model, setModel] = useState<string>(MODEL_GPT_5_NANO);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const conversationRef = useRef<HTMLDivElement>(null);
  const shouldAutoScrollRef = useRef(true);
  const { editor } = useEditorStore();

  // Configure marked options
  useMemo(() => {
    marked.setOptions({
      breaks: true, // Convert line breaks to <br>
      gfm: true, // GitHub Flavored Markdown
    });
  }, []);

  const renderMarkdown = (text: string) => {
    return { __html: marked.parse(text) as string };
  };

  // Check if conversation area is scrolled to bottom
  const isScrolledToBottom = () => {
    if (!conversationRef.current) return true;
    const { scrollTop, scrollHeight, clientHeight } = conversationRef.current;
    // Consider "bottom" if within 10px of actual bottom
    return scrollHeight - scrollTop - clientHeight < 10;
  };

  // Scroll to bottom of conversation area
  const scrollToBottom = () => {
    if (conversationRef.current) {
      conversationRef.current.scrollTop = conversationRef.current.scrollHeight;
    }
  };

  // Handle scroll event to track if user manually scrolls up
  const handleScroll = () => {
    shouldAutoScrollRef.current = isScrolledToBottom();
  };

  // Auto-scroll to bottom when messages change, if auto-scroll is enabled
  useEffect(() => {
    if (shouldAutoScrollRef.current) {
      // Use requestAnimationFrame to ensure DOM has updated
      requestAnimationFrame(() => {
        scrollToBottom();
      });
    }
  }, [messages]);

  useEffect(() => {
    if (textareaRef.current) {
      // Reset height to auto to get the correct scrollHeight
      textareaRef.current.style.height = "auto";
      // Set height based on scrollHeight, capped at max-height
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
    }
  }, [inputText]);

  const handleSend = async () => {
    if (!inputText.trim() || isWaitingForResponse) return;

    const userMessage: Message = {
      id: `user-${Date.now()}`,
      text: inputText,
      sender: "user",
      timestamp: new Date(),
    };

    const currentInputText = inputText;
    setMessages(prev => [...prev, userMessage]);
    setInputText("");
    setIsWaitingForResponse(true);

    try {
      // Call the ChatGPT API
      const response = await fetch("/api/chatbot", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          message: currentInputText,
          mode: mode,
          model: model,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to get response from ChatGPT");
      }

      const data = await response.json();
      const botResponseText = data.response;

      const botMessage: Message = {
        id: `bot-${Date.now()}`,
        text: botResponseText,
        sender: "bot",
        timestamp: new Date(),
      };

      setMessages(prev => [...prev, botMessage]);
      setIsWaitingForResponse(false);

      // Insert bot response into the editor at cursor position only in WRITE mode
      if (mode === MODE_WRITE && editor && !editor.isDestroyed) {
        // Check if the textarea currently has focus
        const textareaHasFocus = document.activeElement === textareaRef.current;

        const { state, view } = editor;
        const { tr } = state;

        // Create a paragraph with the bot's response text
        const paragraph = state.schema.nodes.paragraph.create(
          null,
          state.schema.text(botResponseText)
        );

        // Replace selection with the new paragraph
        tr.replaceSelectionWith(paragraph);
        view.dispatch(tr);

        // Only focus the editor if the textarea didn't have focus
        if (!textareaHasFocus) {
          editor.commands.focus();
        } else {
          // Restore focus to the textarea
          textareaRef.current?.focus();
        }
      }
    } catch (error) {
      console.error("Error calling ChatGPT API:", error);

      const errorMessage: Message = {
        id: `bot-${Date.now()}`,
        text: "Sorry, I encountered an error. Please try again.",
        sender: "bot",
        timestamp: new Date(),
      };

      setMessages(prev => [...prev, errorMessage]);
      setIsWaitingForResponse(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="flex flex-col h-full">
      <div className="mb-4 px-3">
        <h2 className="text-lg font-semibold text-gray-800">Chatbot</h2>
      </div>

      {/* Conversation Area */}
      <div
        ref={conversationRef}
        onScroll={handleScroll}
        className="flex-1 overflow-y-auto px-3 space-y-3 mb-4"
      >
        {messages.length === 0 ? (
          <div className="text-sm text-gray-500 text-center py-8">Start a conversation...</div>
        ) : (
          messages.map(message => (
            <div
              key={message.id}
              className={`flex ${message.sender === "user" ? "justify-end" : "justify-start"}`}
            >
              <div
                className={`max-w-[80%] rounded-lg px-3 py-2 text-sm markdown-content ${
                  message.sender === "user" ? "bg-blue-500 text-white" : "bg-gray-100 text-gray-800"
                }`}
                dangerouslySetInnerHTML={renderMarkdown(message.text)}
              />
            </div>
          ))
        )}
        {isWaitingForResponse && (
          <div className="flex justify-start">
            <div className="bg-gray-100 text-gray-800 rounded-lg px-3 py-2 text-sm">
              <div className="flex gap-1">
                <span className="animate-bounce" style={{ animationDelay: "0ms" }}>
                  •
                </span>
                <span className="animate-bounce" style={{ animationDelay: "150ms" }}>
                  •
                </span>
                <span className="animate-bounce" style={{ animationDelay: "300ms" }}>
                  •
                </span>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Input Area */}
      <div className="px-3 pb-3">
        <textarea
          ref={textareaRef}
          id="chatbot-input"
          value={inputText}
          onChange={e => setInputText(e.target.value)}
          onKeyDown={handleKeyPress}
          placeholder="Type a message..."
          rows={1}
          className="w-full resize-none rounded-md border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent overflow-y-auto scrollbar-hide"
          style={{ minHeight: "40px", maxHeight: "120px" }}
        />
        <div className="flex gap-2 mt-2">
          <Select
            value={mode}
            onValueChange={(value: typeof MODE_ASK | typeof MODE_WRITE) => setMode(value)}
          >
            <SelectTrigger className="w-[100px] text-xs">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value={MODE_ASK} className="text-xs">
                Ask
              </SelectItem>
              <SelectItem value={MODE_WRITE} className="text-xs">
                Write
              </SelectItem>
            </SelectContent>
          </Select>
          <Select value={model} onValueChange={setModel}>
            <SelectTrigger className="w-[140px] text-xs">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value={MODEL_GPT_5_NANO} className="text-xs">
                GPT-5 Nano
              </SelectItem>
              <SelectItem value={MODEL_GPT_5} className="text-xs">
                GPT-5
              </SelectItem>
              <SelectItem value={MODEL_GPT_5_MINI} className="text-xs">
                GPT-5 Mini
              </SelectItem>
              <SelectItem value={MODEL_GPT_5_1} className="text-xs">
                GPT-5.1
              </SelectItem>
              <SelectItem value={MODEL_GPT_4_1} className="text-xs">
                GPT-4.1
              </SelectItem>
              <SelectItem value={MODEL_GPT_4_1_MINI} className="text-xs">
                GPT-4.1 Mini
              </SelectItem>
              <SelectItem value={MODEL_GPT_4_1_NANO} className="text-xs">
                GPT-4.1 Nano
              </SelectItem>
            </SelectContent>
          </Select>
          <div className="flex-1" />
          <Button
            onClick={handleSend}
            disabled={!inputText.trim() || isWaitingForResponse}
            size="sm"
            className="w-[50px] text-xs"
          >
            <Send className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </div>
  );
};
