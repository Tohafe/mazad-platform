import type { SocialPlatform } from '../../types';

interface SocialButtonProps {
  platform: SocialPlatform;
}

const configs: Record<SocialPlatform, { bg: string; icon: string }> = {
  facebook: { bg: 'bg-blue-600 hover:bg-blue-700', icon: 'f' },
  twitter: { bg: 'bg-black hover:bg-gray-800', icon: '𝕏' },
  pinterest: { bg: 'bg-red-600 hover:bg-red-700', icon: 'P' },
};

export function SocialButton({ platform }: SocialButtonProps) {
  const config = configs[platform];

  return (
    <button
      type="button"
      className={`w-9 h-9 ${config.bg} rounded-full flex items-center justify-center transition-colors`}
    >
      <span className="text-white text-sm font-bold">{config.icon}</span>
    </button>
  );
}
