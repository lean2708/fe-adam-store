"use client";
import React from "react";

interface ChatMessageContentProps {
  content: string | undefined;
}

const urlRegex = /(https?:\/\/[^\s]+)/g;

// Function to check if a URL points to an image
const isImageUrl = (url: string): boolean => {
  return /\.(jpeg|jpg|gif|png|webp|svg|avif)$/i.test(url);
};

// Function to truncate URL for display while keeping full URL for href
const truncateUrl = (url: string, maxLength: number = 50): string => {
  if (url.length <= maxLength) return url;

  const start = url.substring(0, maxLength / 2);
  const end = url.substring(url.length - maxLength / 2);
  return `${start}...${end}`;
};

// Function to check if text part is too long and needs line breaks
const formatTextPart = (
  text: string,
  maxLineLength: number = 50
): React.ReactNode => {
  if (text.length <= maxLineLength) return text;

  // Split long text into chunks with word boundaries
  const words = text.split(" ");
  const lines: string[] = [];
  let currentLine = "";

  words.forEach((word) => {
    if ((currentLine + word).length > maxLineLength && currentLine.length > 0) {
      lines.push(currentLine.trim());
      currentLine = word + " ";
    } else {
      currentLine += word + " ";
    }
  });

  if (currentLine.trim()) {
    lines.push(currentLine.trim());
  }

  return lines.map((line, index) => (
    <React.Fragment key={index}>
      {line}
      {index < lines.length - 1 && <br />}
    </React.Fragment>
  ));
};

export function ChatMessageContent({ content }: ChatMessageContentProps) {
  if (!content) {
    return null;
  }

  const parts = content.split(urlRegex);

  return (
    <div className="text-sm leading-relaxed">
      {parts.map((part, index) => {
        if (part.match(urlRegex)) {
          if (isImageUrl(part)) {
            return (
              <div key={index} className="my-2">
                <a
                  href={part}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block"
                >
                  <img
                    src={part}
                    alt="Image attachment"
                    className="max-w-full h-auto max-h-64 rounded-lg object-contain bg-gray-100"
                    loading="lazy"
                  />
                </a>
              </div>
            );
          }

          // Handle long URLs
          const displayUrl = truncateUrl(part);
          return (
            <div key={index} className="my-1">
              <a
                href={part}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-400 hover:underline break-all inline-block"
                title={part} // Show full URL on hover
              >
                {displayUrl}
              </a>
            </div>
          );
        }

        // Handle regular text with potential line breaks for long content
        if (part.trim()) {
          return (
            <span key={index} className="whitespace-pre-wrap break-words">
              {formatTextPart(part)}
            </span>
          );
        }

        return part;
      })}
    </div>
  );
}
