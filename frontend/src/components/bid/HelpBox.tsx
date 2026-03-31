import { FaInstagram } from 'react-icons/fa';
import { MdFacebook } from 'react-icons/md';

export function HelpBox() {
    return (
        <div className="bg-white border border-border p-5 space-y-5">
            <div>
                <p className="text-sm text-gray-700 mb-3">
                    Contact us on the following social media
                </p>

                <div className="flex gap-2">
                <a href="https://www.facebook.com/profile.php?id=61576446457600" target={"_blank"} rel="noopener noreferrer"
                    type="button"
                    className={`w-9 h-9 bg-blue-600 hover:bg-blue-700 rounded-full flex items-center justify-center transition-colors`}
                    >
                    <span className="text-white text-sm font-bold"><MdFacebook/></span>
                </a>
                <a href="https://www.instagram.com/mazad_platform/" target={"_blank"} rel="noopener noreferrer"
                    type="button"
                    className={`w-9 h-9 bg-red-600 hover:bg-red-700 rounded-full flex items-center justify-center transition-colors`}
                    >
                    <span className="text-white text-sm font-bold"><FaInstagram/></span>
                </a>
                </div>
            </div>
        </div>
    );
}
