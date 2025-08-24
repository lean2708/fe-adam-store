"use client";

import React from 'react';

interface ChatMessageContentProps {
  content: string | undefined;
}

const urlRegex = /(https?:\/\/[^\s]+)/g;

// Function to check if a URL points to an image
const isImageUrl = (url: string): boolean => {
  return /\.(jpeg|jpg|gif|png|webp|svg|avif)$/i.test(url);
};

export function ChatMessageContent({ content }: ChatMessageContentProps) {
  if (!content) {
    return null;
  }

  const parts = content.split(urlRegex);

  return (
    <div className="text-sm leading-relaxed whitespace-pre-wrap">
      {parts.map((part, index) => {
        if (part.match(urlRegex)) {
          if (isImageUrl(part)) {
            return (
              <a
                key={index}
                href={part}
                target="_blank"
                rel="noopener noreferrer"
                className="block my-2"
              >
                <img
                  src={part}
                  alt="Image attachment"
                  className="max-w-full h-auto max-h-64 rounded-lg object-contain bg-gray-100"
                />
              </a>
            );
          }
          return (
            <a
              key={index}
              href={part}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-400 hover:underline"
            >
              {part}
            </a>
          );
        }
        return part;
      })}
    </div>
  );
}
