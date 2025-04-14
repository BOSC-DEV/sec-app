import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function truncateText(text: string, maxLength: number) {
  if (!text) return '';
  if (text.length <= maxLength) return text;
  return text.slice(0, maxLength) + '...';
}

export function formatNumber(num: number) {
  if (num >= 1_000_000) {
    return `${(num / 1_000_000).toFixed(1)}m`;
  }
  if (num >= 1_000) {
    return `${(num / 1_000).toFixed(1)}k`;
  }
  return num.toString();
}

export function formatDate(dateString: string) {
  const date = new Date(dateString);
  return new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  }).format(date);
}

export function getRandomInt(min: number, max: number) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

export function formatCurrency(value: number): string {
  return formatNumber(value);
}

export function formatProfileAge(dateString: string): string {
  if (!dateString) return '-';
  
  const profileDate = new Date(dateString);
  const now = new Date();
  const diffTime = Math.abs(now.getTime() - profileDate.getTime());
  const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
  
  if (diffDays < 7) {
    return `${diffDays}d`;
  } else {
    const diffWeeks = Math.floor(diffDays / 7);
    return `${diffWeeks}w`;
  }
}
