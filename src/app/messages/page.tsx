"use client";

import { useState } from "react";
import Link from "next/link";
import { Search, Send, MoreVertical, Phone, Video, ChevronLeft } from "lucide-react";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";
import { messages as dummyMessages } from "@/lib/dummy-data";

const chatMessages = [
  {
    id: "c1",
    sender: "other",
    message: "こんにちは！出店のご相談をいただきありがとうございます。",
    time: "14:30",
  },
  {
    id: "c2",
    sender: "other",
    message: "来週末の土日であれば、まだ空きがございます。ご希望の日程はありますか？",
    time: "14:31",
  },
  {
    id: "c3",
    sender: "me",
    message: "ご返信ありがとうございます！土曜日の出店を希望しています。",
    time: "14:35",
  },
  {
    id: "c4",
    sender: "me",
    message: "電源と水道は利用可能でしょうか？",
    time: "14:35",
  },
  {
    id: "c5",
    sender: "other",
    message: "はい、土曜日でしたら大丈夫です！電源・水道ともにご利用いただけます。",
    time: "14:40",
  },
  {
    id: "c6",
    sender: "other",
    message: "出店料は1日8,000円となりますが、いかがでしょうか？",
    time: "14:41",
  },
];

export default function MessagesPage() {
  const [selectedConversation, setSelectedConversation] = useState(dummyMessages[0]);
  const [newMessage, setNewMessage] = useState("");
  const [showChat, setShowChat] = useState(false);

  const handleSendMessage = () => {
    if (!newMessage.trim()) return;
    // In a real app, this would send the message to an API
    setNewMessage("");
  };

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header isLoggedIn />

      <main className="flex-1 container mx-auto px-4 py-6">
        <div className="h-[calc(100vh-200px)] bg-card rounded-2xl shadow-sm border border-border overflow-hidden">
          <div className="grid grid-cols-1 md:grid-cols-3 h-full">
            {/* Conversation List */}
            <div
              className={cn(
                "border-r border-border",
                showChat ? "hidden md:block" : "block"
              )}
            >
              <div className="p-4 border-b border-border">
                <h1 className="text-xl font-bold mb-4">メッセージ</h1>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    type="text"
                    placeholder="会話を検索..."
                    className="pl-10 rounded-full"
                  />
                </div>
              </div>
              <ScrollArea className="h-[calc(100%-120px)]">
                <div className="divide-y divide-border">
                  {dummyMessages.map((conversation) => (
                    <button
                      key={conversation.id}
                      className={cn(
                        "w-full p-4 text-left hover:bg-muted/50 transition-colors",
                        selectedConversation.id === conversation.id && "bg-muted"
                      )}
                      onClick={() => {
                        setSelectedConversation(conversation);
                        setShowChat(true);
                      }}
                    >
                      <div className="flex items-start gap-3">
                        <div className="relative">
                          <Avatar className="h-12 w-12">
                            <AvatarImage src={conversation.partnerImage} />
                            <AvatarFallback className="bg-dusty-pink-light text-dusty-pink">
                              {conversation.partnerName[0]}
                            </AvatarFallback>
                          </Avatar>
                          {conversation.unread && (
                            <span className="absolute -top-1 -right-1 h-3 w-3 rounded-full bg-primary" />
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between">
                            <p
                              className={cn(
                                "font-medium truncate",
                                conversation.unread && "font-semibold"
                              )}
                            >
                              {conversation.partnerName}
                            </p>
                            <span className="text-xs text-muted-foreground shrink-0 ml-2">
                              {conversation.timestamp}
                            </span>
                          </div>
                          <p
                            className={cn(
                              "text-sm truncate mt-1",
                              conversation.unread
                                ? "text-foreground"
                                : "text-muted-foreground"
                            )}
                          >
                            {conversation.lastMessage}
                          </p>
                        </div>
                      </div>
                    </button>
                  ))}
                </div>
              </ScrollArea>
            </div>

            {/* Chat Area */}
            <div
              className={cn(
                "md:col-span-2 flex flex-col",
                !showChat && "hidden md:flex"
              )}
            >
              {/* Chat Header */}
              <div className="p-4 border-b border-border flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Button
                    variant="ghost"
                    size="icon"
                    className="md:hidden rounded-full"
                    onClick={() => setShowChat(false)}
                  >
                    <ChevronLeft className="h-5 w-5" />
                  </Button>
                  <Avatar className="h-10 w-10">
                    <AvatarImage src={selectedConversation.partnerImage} />
                    <AvatarFallback className="bg-dusty-pink-light text-dusty-pink">
                      {selectedConversation.partnerName[0]}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="font-medium">{selectedConversation.partnerName}</p>
                    <p className="text-xs text-muted-foreground">
                      オンライン
                    </p>
                  </div>
                </div>
                <Button variant="ghost" size="icon" className="rounded-full">
                  <MoreVertical className="h-5 w-5" />
                </Button>
              </div>

              {/* Messages */}
              <ScrollArea className="flex-1 p-4">
                <div className="space-y-4">
                  {chatMessages.map((msg) => (
                    <div
                      key={msg.id}
                      className={cn(
                        "flex",
                        msg.sender === "me" ? "justify-end" : "justify-start"
                      )}
                    >
                      <div
                        className={cn(
                          "max-w-[70%] rounded-2xl px-4 py-2",
                          msg.sender === "me"
                            ? "bg-primary text-primary-foreground rounded-br-sm"
                            : "bg-muted rounded-bl-sm"
                        )}
                      >
                        <p className="text-sm">{msg.message}</p>
                        <p
                          className={cn(
                            "text-xs mt-1",
                            msg.sender === "me"
                              ? "text-primary-foreground/70"
                              : "text-muted-foreground"
                          )}
                        >
                          {msg.time}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </ScrollArea>

              {/* Message Input */}
              <div className="p-4 border-t border-border">
                <div className="flex items-center gap-3">
                  <Input
                    type="text"
                    placeholder="メッセージを入力..."
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter" && !e.shiftKey) {
                        e.preventDefault();
                        handleSendMessage();
                      }
                    }}
                    className="rounded-full"
                  />
                  <Button
                    size="icon"
                    className="rounded-full shrink-0"
                    onClick={handleSendMessage}
                    disabled={!newMessage.trim()}
                  >
                    <Send className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
