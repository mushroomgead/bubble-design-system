"use client";

import {
  forwardRef,
  useEffect,
  useRef,
  useState,
  type ChangeEvent,
  type ComponentPropsWithoutRef,
  type KeyboardEvent,
  type ReactNode,
} from "react";
import { cn } from "../utils/cn";

export type ChatMessageSide = "sent" | "received";
export type ChatMessagePosition = "solo" | "first" | "middle" | "last";
export type ChatMessageStatus = "sending" | "sent" | "delivered" | "read";

export interface ChatReaction {
  emoji: string;
  count?: number;
  mine?: boolean;
}

function ChatSendIcon() {
  return (
    <svg
      width={16}
      height={16}
      viewBox="0 0 16 16"
      fill="none"
      aria-hidden="true"
    >
      <path
        d="M2.5 8h11M9 3.5L13.5 8 9 12.5"
        stroke="currentColor"
        strokeWidth="1.7"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function ChatPaperclipIcon() {
  return (
    <svg
      width={16}
      height={16}
      viewBox="0 0 16 16"
      fill="none"
      aria-hidden="true"
    >
      <path
        d="M13.2 7.2L7.5 12.9a3.5 3.5 0 0 1-4.95-4.95l6.36-6.36a2.2 2.2 0 0 1 3.11 3.11L5.66 10.9a.88.88 0 0 1-1.24-1.24l5.3-5.3"
        stroke="currentColor"
        strokeWidth="1.4"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function ChatSmileIcon() {
  return (
    <svg
      width={16}
      height={16}
      viewBox="0 0 16 16"
      fill="none"
      aria-hidden="true"
    >
      <circle cx="8" cy="8" r="6.2" stroke="currentColor" strokeWidth="1.4" />
      <path
        d="M5.5 9.8c.4.9 2.6 1.4 3 0"
        stroke="currentColor"
        strokeWidth="1.4"
        strokeLinecap="round"
      />
      <circle cx="6" cy="6.8" r="0.8" fill="currentColor" />
      <circle cx="10" cy="6.8" r="0.8" fill="currentColor" />
    </svg>
  );
}

function ChatDeliveryIcon({ status }: { status: ChatMessageStatus }) {
  if (status === "sending") {
    return (
      <svg
        width={14}
        height={14}
        viewBox="0 0 14 14"
        fill="none"
        aria-hidden="true"
      >
        <circle
          cx="7"
          cy="7"
          r="5.2"
          stroke="currentColor"
          strokeWidth="1.4"
          strokeDasharray="2.5 2"
        />
      </svg>
    );
  }
  if (status === "sent") {
    return (
      <svg
        width={14}
        height={14}
        viewBox="0 0 14 14"
        fill="none"
        aria-hidden="true"
      >
        <path
          d="M3 7.2l2.4 2.4L11 4.6"
          stroke="currentColor"
          strokeWidth="1.6"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    );
  }
  return (
    <svg
      width={18}
      height={14}
      viewBox="0 0 18 14"
      fill="none"
      aria-label={status === "read" ? "Read" : "Delivered"}
    >
      <path
        d="M1.5 7.2l2.4 2.4L9.5 4.6"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M5.5 7.2l2.4 2.4 5.6-5"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

/* ── ChatThread ─────────────────────────────────────── */

export interface ChatThreadProps extends ComponentPropsWithoutRef<"div"> {}

export const ChatThread = forwardRef<HTMLDivElement, ChatThreadProps>(
  ({ className, ...props }, ref) => {
    return (
      <div ref={ref} className={cn("pds-chat-thread", className)} {...props} />
    );
  },
);
ChatThread.displayName = "ChatThread";

/* ── ChatDateDivider ────────────────────────────────── */

export interface ChatDateDividerProps extends ComponentPropsWithoutRef<"div"> {}

export const ChatDateDivider = forwardRef<HTMLDivElement, ChatDateDividerProps>(
  ({ className, children, ...props }, ref) => {
    return (
      <div
        ref={ref}
        role="separator"
        className={cn("pds-chat-divider", className)}
        {...props}
      >
        <span className="pds-chat-divider__label">{children}</span>
      </div>
    );
  },
);
ChatDateDivider.displayName = "ChatDateDivider";

/* ── ChatMessage ────────────────────────────────────── */

export interface ChatMessageProps extends ComponentPropsWithoutRef<"div"> {
  side?: ChatMessageSide;
  name?: string;
  avatar?: ReactNode;
  time?: string;
  status?: ChatMessageStatus;
  reactions?: ChatReaction[];
  position?: ChatMessagePosition;
}

export const ChatMessage = forwardRef<HTMLDivElement, ChatMessageProps>(
  (
    {
      side = "received",
      name,
      avatar,
      time,
      status,
      reactions,
      position = "solo",
      className,
      children,
      ...props
    },
    ref,
  ) => {
    const isSent = side === "sent";
    const showMeta = position === "solo" || position === "first";
    const showAvatar =
      !isSent && avatar && (position === "solo" || position === "last");
    const showStatus =
      isSent && status && (position === "solo" || position === "last");

    return (
      <div
        ref={ref}
        className={cn(
          "pds-chat-msg",
          `pds-chat-msg--${side}`,
          `pds-chat-msg--${position}`,
          className,
        )}
        {...props}
      >
        {showMeta && (
          <div className="pds-chat-msg__meta-row">
            {!isSent && name && (
              <span className="pds-chat-msg__name">{name}</span>
            )}
            {time && <span className="pds-chat-msg__time">{time}</span>}
          </div>
        )}

        <div className="pds-chat-msg__row">
          {!isSent && (
            <div className="pds-chat-msg__avatar-slot">
              {showAvatar && avatar}
            </div>
          )}
          <div className="pds-chat-msg__bubble-col">
            <div
              className={cn(
                "pds-chat-bubble",
                `pds-chat-bubble--${side}`,
                `pds-chat-bubble--${position}`,
              )}
            >
              {children}
            </div>
            {reactions && reactions.length > 0 && (
              <div className="pds-chat-reactions">
                {reactions.map((reaction, index) => (
                  <button
                    key={index}
                    type="button"
                    className={cn(
                      "pds-chat-reaction",
                      reaction.mine && "pds-chat-reaction--mine",
                    )}
                  >
                    <span>{reaction.emoji}</span>
                    {reaction.count !== undefined && reaction.count > 1 && (
                      <span className="pds-chat-reaction__count">
                        {reaction.count}
                      </span>
                    )}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        {showStatus && (
          <div
            className={cn(
              "pds-chat-msg__status",
              status === "read" && "pds-chat-msg__status--read",
            )}
          >
            <ChatDeliveryIcon status={status} />
            <span className="pds-chat-msg__status-label">{status}</span>
          </div>
        )}
      </div>
    );
  },
);
ChatMessage.displayName = "ChatMessage";

/* ── ChatCompose ────────────────────────────────────── */

export interface ChatComposeProps {
  value?: string;
  onChange?: (event: ChangeEvent<HTMLTextAreaElement>) => void;
  onSend?: (value: string) => void;
  placeholder?: string;
  avatar?: ReactNode;
  disabled?: boolean;
  className?: string;
}

export function ChatCompose({
  value,
  onChange,
  onSend,
  placeholder = "Write a message…",
  avatar,
  disabled,
  className,
}: ChatComposeProps) {
  const [internalValue, setInternalValue] = useState("");
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const isControlled = value !== undefined;
  const text = isControlled ? value : internalValue;

  useEffect(() => {
    const textarea = textareaRef.current;
    if (!textarea) return;
    textarea.style.height = "auto";
    textarea.style.height = `${Math.min(textarea.scrollHeight, 120)}px`;
  }, [text]);

  function handleChange(event: ChangeEvent<HTMLTextAreaElement>) {
    if (!isControlled) setInternalValue(event.target.value);
    onChange?.(event);
  }

  function send() {
    const trimmed = text.trim();
    if (!trimmed) return;
    onSend?.(trimmed);
    if (!isControlled) setInternalValue("");
  }

  function handleKeyDown(event: KeyboardEvent<HTMLTextAreaElement>) {
    if (event.key === "Enter" && !event.shiftKey) {
      event.preventDefault();
      send();
    }
  }

  const canSend = text.trim().length > 0;

  return (
    <div className={cn("pds-chat-compose", className)}>
      {avatar && <div className="pds-chat-compose__avatar">{avatar}</div>}

      <div className="pds-chat-compose__field">
        <button
          type="button"
          className="pds-chat-compose__icon-btn"
          aria-label="Attach file"
        >
          <ChatPaperclipIcon />
        </button>
        <textarea
          ref={textareaRef}
          className="pds-chat-compose__textarea"
          value={text}
          onChange={handleChange}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
          disabled={disabled}
          rows={1}
          aria-label="Message"
        />
        <button
          type="button"
          className="pds-chat-compose__icon-btn"
          aria-label="Add emoji"
        >
          <ChatSmileIcon />
        </button>
      </div>

      <button
        type="button"
        className={cn("pds-chat-send", canSend && "pds-chat-send--active")}
        onClick={send}
        disabled={disabled || !canSend}
        aria-label="Send message"
      >
        <ChatSendIcon />
      </button>
    </div>
  );
}
