import type { SocialPlatform } from '../../types';
import { SocialButton } from '../ui';

const defaultPlatforms: SocialPlatform[] = ['facebook', 'twitter', 'pinterest'];

interface HelpBoxProps {
    socialPlatforms?: SocialPlatform[];
}

export function HelpBox({
                            socialPlatforms = defaultPlatforms,
                        }: HelpBoxProps) {
    return (
        <div className="bg-white border border-border p-5 space-y-5">
            <div>
                <p className="text-sm text-gray-700 mb-3">
                    Share this auction with your friends
                </p>

                <div className="flex gap-2">
                    {socialPlatforms.map((platform) => (
                        <SocialButton
                            key={platform}
                            platform={platform}
                        />
                    ))}
                </div>
            </div>
        </div>
    );
}
