import { Link } from "react-router-dom";
import {
  Youtube,
  Mail,
  MessageCircle,
  FileText,
  HelpCircle,
  Facebook,
  Send,
  Bot,
  Radio,
} from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-black border-t border-red-600/20 text-gray-300">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Logo & Brand */}
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <div className="bg-gradient-to-r from-red-600 to-red-500 p-2 rounded-lg">
                <Youtube className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-bold bg-gradient-to-r from-red-500 to-white bg-clip-text text-transparent">
                LoopBOTIQ
              </span>
            </div>
            <p className="text-sm text-gray-400">
              Jadikan Channel YouTube-mu Aktif 24 Jam dengan Otomatisasi
              Terdepan
            </p>
          </div>

          {/* Quick Navigation */}
          <div className="space-y-4">
            <h3 className="font-semibold text-white">Navigasi Cepat</h3>
            <div className="space-y-2">
              <Link
                to="/loopbot"
                className="flex items-center space-x-2 text-sm hover:text-red-400 transition-colors duration-300"
              >
                <Bot className="w-4 h-4" />
                <span>LoopBOT</span>
              </Link>
              <Link
                to="/loopstream"
                className="flex items-center space-x-2 text-sm hover:text-red-400 transition-colors duration-300"
              >
                <Radio className="w-4 h-4" />
                <span>LoopStream</span>
              </Link>
              <Link
                to="/tutorial"
                className="flex items-center space-x-2 text-sm hover:text-red-400 transition-colors duration-300"
              >
                <FileText className="w-4 h-4" />
                <span>Tutorial</span>
              </Link>
              <Link
                to="/help"
                className="flex items-center space-x-2 text-sm hover:text-red-400 transition-colors duration-300"
              >
                <HelpCircle className="w-4 h-4" />
                <span>Pusat Bantuan</span>
              </Link>
            </div>
          </div>

          {/* Contact */}
          <div className="space-y-4">
            <h3 className="font-semibold text-white">Kontak</h3>
            <div className="space-y-2">
              <a
                href="mailto:support@loopbotiq.com"
                className="flex items-center space-x-2 text-sm hover:text-red-400 transition-colors duration-300"
              >
                <Mail className="w-4 h-4" />
                <span>support@loopbotiq.com</span>
              </a>
              <a
                href="https://wa.me/6281224286756"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center space-x-2 text-sm hover:text-red-400 transition-colors duration-300"
              >
                <MessageCircle className="w-4 h-4" />
                <span>+62-812-2428-6756</span>
              </a>
              <a
                href="https://www.facebook.com/Bangjoss24"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center space-x-2 text-sm hover:text-red-400 transition-colors duration-300"
              >
                <Facebook className="w-4 h-4" />
                <span>Facebook</span>
              </a>
              <a
                href="https://t.me/joss_ganteng"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center space-x-2 text-sm hover:text-red-400 transition-colors duration-300"
              >
                <Send className="w-4 h-4" />
                <span>Telegram</span>
              </a>
            </div>
          </div>

          {/* Legal */}
          <div className="space-y-4">
            <h3 className="font-semibold text-white">Legal</h3>
            <div className="space-y-2">
              <Link
                to="/privacy"
                className="block text-sm hover:text-red-400 transition-colors duration-300"
              >
                Privacy Policy
              </Link>
              <Link
                to="/terms"
                className="block text-sm hover:text-red-400 transition-colors duration-300"
              >
                Terms of Use
              </Link>
            </div>
          </div>
        </div>

        {/* Copyright */}
        <div className="border-t border-red-600/20 mt-8 pt-8 text-center">
          <p className="text-sm text-gray-400">
            © 2025 LoopBOTIQ. All Rights Reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
