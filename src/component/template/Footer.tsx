import {
  Heart,
  Mail,
  Phone,
  MapPin,
  Github,
  Linkedin,
  Instagram,
} from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-green-800 text-white mt-20">
      {/* Main Footer Content */}
      <div className="max-w-6xl mx-auto px-6 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Contact Info */}
          <div className="space-y-4">
            <h4 className="text-lg font-semibold text-white">Get In Touch</h4>
            <div className="space-y-3">
              <div className="flex items-center space-x-3">
                <Mail className="w-5 h-5" />
                <span className="">firmanhakim11704@gmail.com</span>
              </div>
              <div className="flex items-center space-x-3">
                <Phone className="w-5 h-5" />
                <span className="">+62 858 106 425 26</span>
              </div>
              <div className="flex items-center space-x-3">
                <MapPin className="w-5 h-5" />
                <span className="">Bogor, West Java, Indonesia</span>
              </div>
            </div>
          </div>

          {/* Social Media */}
          <div className="space-y-4">
            <h4 className="text-lg font-semibold text-white">Follow Me</h4>
            <div className="flex space-x-4">
              <a
                target="_blank"
                href="https://github.com/firrrman"
                className="text-gray-400 hover:text-blue-400 transition-colors"
              >
                <Github className="w-6 h-6" color="white" />
              </a>
              <a
                target="_blank"
                href="https://www.linkedin.com/in/firman-hakim-1b456b319?utm_source=share&utm_campaign=share_via&utm_content=profile&utm_medium=android_app"
                className="text-gray-400 hover:text-blue-400 transition-colors"
              >
                <Linkedin className="w-6 h-6" color="white" />
              </a>
              <a
                target="_blank"
                href="https://www.instagram.com/firmnh_?igsh=ZjRiZTNscXc0OTdo"
                className="text-gray-400 hover:text-pink-400 transition-colors"
              >
                <Instagram className="w-6 h-6" color="white" />
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t-1 border-gray-200">
        <div className="max-w-6xl mx-auto px-6 py-6">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <div className="flex items-center space-x-2 ">
              <span>© 2025 Firman Hakim. All rights reserved.</span>
            </div>
            <div className="flex items-center space-x-2 ">
              <span>Made with</span>
              <Heart className="w-4 h-4 text-red-500 fill-current" />
              <span>in Indonesia</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
