import { Link } from "react-router-dom";
import { Youtube, Menu, X } from "lucide-react";
import { useState } from "react";

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <header className="bg-black/95 backdrop-blur-sm border-b border-red-600/20 sticky top-0 z-50">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2 group">
            <div className="bg-gradient-to-r from-red-600 to-red-500 p-2 rounded-lg group-hover:scale-110 transition-transform duration-300">
              <Youtube className="w-6 h-6 text-white" />
            </div>
            <span className="text-2xl font-bold bg-gradient-to-r from-red-500 to-white bg-clip-text text-transparent">
              LoopBOTIQ
            </span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            <Link
              to="/loopbot"
              className="text-white hover:text-red-400 transition-colors duration-300 font-medium"
            >
              LoopBOT
            </Link>
            <Link
              to="/loopstream"
              className="text-white hover:text-red-400 transition-colors duration-300 font-medium"
            >
              LoopStream
            </Link>
          </nav>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="md:hidden text-white hover:text-red-400 transition-colors duration-300"
          >
            {isMenuOpen ? (
              <X className="w-6 h-6" />
            ) : (
              <Menu className="w-6 h-6" />
            )}
          </button>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <nav className="md:hidden mt-4 pb-4 border-t border-red-600/20 pt-4">
            <div className="flex flex-col space-y-4">
              <Link
                to="/loopbot"
                className="text-white hover:text-red-400 transition-colors duration-300 font-medium"
                onClick={() => setIsMenuOpen(false)}
              >
                LoopBOT
              </Link>
              <Link
                to="/loopstream"
                className="text-white hover:text-red-400 transition-colors duration-300 font-medium"
                onClick={() => setIsMenuOpen(false)}
              >
                LoopStream
              </Link>
            </div>
          </nav>
        )}
      </div>
    </header>
  );
}
