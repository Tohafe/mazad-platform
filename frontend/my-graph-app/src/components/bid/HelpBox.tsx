import { HelpCircle } from 'lucide-react';
import type { SocialPlatform } from '../../types';
import { SocialButton } from '../ui';

interface HelpBoxProps {
  socialPlatforms?: SocialPlatform[];
}

const defaultPlatforms: SocialPlatform[] = ['facebook', 'twitter', 'pinterest'];

export function HelpBox({ socialPlatforms = defaultPlatforms }: HelpBoxProps) {
  return (
    <div className="bg-gray-100 rounded-lg p-5 space-y-5">
      {/* Questions */}
      <div className="flex items-start gap-3">
        <HelpCircle className="w-5 h-5 text-gray-500" />
        <div>
          <p className="text-sm font-semibold text-gray-900">Any questions?</p>
          <a href="#" className="text-xs text-blue-600 hover:underline">
            Get in touch via our Help Centre
          </a>
        </div>
      </div>

      {/* Share */}
      <div>
        <p className="text-sm text-gray-700 mb-3">Share this object with your friends</p>
        <div className="flex gap-2">
          {socialPlatforms.map((platform) => (
            <SocialButton key={platform} platform={platform} />
          ))}
        </div>
      </div>
    </div>
  );
}
