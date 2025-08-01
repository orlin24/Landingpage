import {
  ArrowRight,
  Play,
  CheckCircle,
  Download,
  MessageCircle,
  Star,
  Users,
  Clock,
  Zap,
  Shield,
  Headphones,
  BarChart3,
  Settings,
  Globe,
  Laptop,
  Smartphone,
  Cloud,
  Calendar,
} from "lucide-react";
import { motion } from "framer-motion";

export default function LoopStreamPage() {
  // WhatsApp handler functions
  const handleWhatsAppOrder = (paket) => {
    const phoneNumber = "6281224286756"; // Ganti dengan nomor WhatsApp Anda
    const message = encodeURIComponent(
      `Halo, saya tertarik untuk order LoopStream paket ${paket}. Mohon informasi lebih lanjut.`
    );
    const whatsappUrl = `https://wa.me/${phoneNumber}?text=${message}`;
    window.open(whatsappUrl, "_blank");
  };

  const handleWhatsAppConsult = () => {
    const phoneNumber = "6281224286756"; // Ganti dengan nomor WhatsApp Anda
    const message = encodeURIComponent(
      "Halo, saya ingin konsultasi tentang LoopStream. Mohon informasi lengkapnya."
    );
    const whatsappUrl = `https://wa.me/${phoneNumber}?text=${message}`;
    window.open(whatsappUrl, "_blank");
  };

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-900/30 via-black to-black"></div>
        <div className="relative container mx-auto px-4 py-20">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center max-w-4xl mx-auto"
          >
            <div className="inline-flex items-center space-x-2 bg-blue-600/20 border border-blue-500/30 rounded-full px-6 py-2 mb-6">
              <Cloud className="w-4 h-4 text-blue-500" />
              <span className="text-blue-400 font-medium">
                Cloud Streaming Solution
              </span>
            </div>

            <h1 className="text-5xl md:text-7xl font-bold mb-6 bg-gradient-to-r from-blue-500 via-white to-blue-400 bg-clip-text text-transparent">
              LoopStream
              <span className="block text-3xl md:text-4xl mt-2">
                Streaming 24/7 dari Cloud, Tanpa PC
              </span>
            </h1>

            <p className="text-xl md:text-2xl text-gray-300 mb-8 leading-relaxed">
              Capek Komputer Overheat Saat Live? Saatnya Upgrade ke LoopStream!
              Bayangkan bisa live 24 jam nonstop — tanpa harus nyalain komputer,
              tanpa takut internet putus, tanpa repot. Cukup upload video, atur
              jadwal, dan biarkan server kami yang bekerja untukmu.
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-12">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleWhatsAppConsult}
                className="bg-gradient-to-r from-green-600 to-green-500 text-white px-8 py-4 rounded-full text-lg font-bold hover:from-green-700 hover:to-green-600 transition-all duration-300 shadow-2xl hover:shadow-green-500/50 flex items-center space-x-2"
              >
                <MessageCircle className="w-5 h-5" />
                <span>Konsultasi LoopStream</span>
                <ArrowRight className="w-5 h-5" />
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleWhatsAppConsult}
                className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-4 rounded-full text-lg font-bold transition-all duration-300 shadow-2xl flex items-center space-x-2"
              >
                <MessageCircle className="w-5 h-5" />
                <span>Konsultasi LoopStream</span>
              </motion.button>
            </div>

            {/* Simple Steps */}
            <div className="bg-gradient-to-r from-blue-900/50 to-gray-900/50 rounded-2xl p-6 border border-blue-500/30 max-w-2xl mx-auto">
              <div className="text-center">
                <h3 className="text-2xl font-bold text-blue-400 mb-4">
                  3 Langkah Simple:
                </h3>
                <div className="flex flex-col md:flex-row items-center justify-center gap-4 text-lg">
                  <div className="flex items-center space-x-2">
                    <span className="bg-blue-600 text-white rounded-full w-8 h-8 flex items-center justify-center font-bold">
                      1
                    </span>
                    <span>Upload</span>
                  </div>
                  <ArrowRight className="w-5 h-5 text-blue-400 hidden md:block" />
                  <div className="flex items-center space-x-2">
                    <span className="bg-blue-600 text-white rounded-full w-8 h-8 flex items-center justify-center font-bold">
                      2
                    </span>
                    <span>Set Jadwal</span>
                  </div>
                  <ArrowRight className="w-5 h-5 text-blue-400 hidden md:block" />
                  <div className="flex items-center space-x-2">
                    <span className="bg-blue-600 text-white rounded-full w-8 h-8 flex items-center justify-center font-bold">
                      3
                    </span>
                    <span>Santai</span>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Demo Video Section */}
      <section className="pt-0 pb-20 bg-gradient-to-b from-black to-gray-900">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center mb-12"
          >
            <div className="flex items-center justify-center gap-4 mb-6">
              <motion.div
                animate={{
                  rotate: [0, 360],
                  scale: [1, 1.1, 1],
                }}
                transition={{
                  rotate: { duration: 8, repeat: Infinity, ease: "linear" },
                  scale: { duration: 2, repeat: Infinity, ease: "easeInOut" },
                }}
                className="relative"
              >
                <Cloud className="w-12 h-12 md:w-16 md:h-16 text-blue-400" />
                <motion.div
                  animate={{
                    opacity: [0.3, 1, 0.3],
                    scale: [0.8, 1.2, 0.8],
                  }}
                  transition={{
                    duration: 1.5,
                    repeat: Infinity,
                    ease: "easeInOut",
                  }}
                  className="absolute inset-0 rounded-full bg-blue-400/20 blur-sm"
                />
              </motion.div>
              <h2 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-blue-500 to-white bg-clip-text text-transparent">
                Lihat LoopStream Beraksi!
              </h2>
              <motion.div
                animate={{
                  y: [0, -10, 0],
                  rotate: [0, 10, -10, 0],
                }}
                transition={{
                  duration: 3,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
              >
                <Zap className="w-10 h-10 md:w-12 md:h-12 text-green-400" />
              </motion.div>
            </div>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto mb-8">
              Demo langsung bagaimana LoopStream mengotomatisasi cloud streaming
              YouTube Anda
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8 }}
            className="max-w-4xl mx-auto"
          >
            <div className="relative bg-gradient-to-br from-gray-900 to-gray-800 rounded-2xl overflow-hidden border border-blue-500/30">
              <div className="aspect-video">
                <iframe
                  src="https://www.youtube.com/embed/IJlDiRJPRu8"
                  title="Demo Video LoopStream"
                  className="w-full h-full rounded-2xl"
                  frameBorder="0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                  allowFullScreen
                ></iframe>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Why Choose LoopStream Section */}
      <section className="py-20 bg-gray-900">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-blue-500 to-white bg-clip-text text-transparent">
              Kenapa Creator Pilih LoopStream?
            </h2>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              Hidup tenang tanpa takut live mati. Naikkan trafik, jam tayang,
              dan monetisasi. Fokus ke produksi konten — tanpa gangguan teknis.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                icon: <Laptop className="w-8 h-8" />,
                title: "Live 24/7 Tanpa Komputer",
                description:
                  "Server cloud kami yang bekerja untukmu. Tidak perlu khawatir komputer overheat atau listrik mati.",
              },
              {
                icon: <Smartphone className="w-8 h-8" />,
                title: "Kontrol dari Mana Aja",
                description:
                  "Kelola streaming dari HP, tablet, atau laptop. Akses dashboard dari mana saja, kapan saja.",
              },
              {
                icon: <Shield className="w-8 h-8" />,
                title: "99.9% Uptime",
                description:
                  "Server grade A dengan uptime 99.9%. Live stream stabil tanpa gangguan teknis.",
              },
              {
                icon: <Calendar className="w-8 h-8" />,
                title: "Penjadwalan Otomatis",
                description:
                  "Atur jadwal live streaming otomatis. Set sekali, jalan terus sesuai jadwal yang ditentukan.",
              },
              {
                icon: <Zap className="w-8 h-8" />,
                title: "Loop Video Otomatis",
                description:
                  "Video otomatis berulang tanpa batas. Konten terus berjalan 24 jam tanpa henti.",
              },
              {
                icon: <Globe className="w-8 h-8" />,
                title: "Support YouTube Live Streaming",
                description:
                  "Streaming langsung ke YouTube dengan kualitas tinggi dan koneksi server yang stabil.",
              },
            ].map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1, duration: 0.6 }}
                whileHover={{ scale: 1.05 }}
                className="bg-gradient-to-br from-gray-800 to-gray-900 p-6 rounded-2xl border border-blue-500/20 hover:border-blue-500/40 transition-all duration-300"
              >
                <div className="text-blue-500 mb-4">{feature.icon}</div>
                <h3 className="text-xl font-bold mb-3 text-white">
                  {feature.title}
                </h3>
                <p className="text-gray-400">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-20 bg-black">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-blue-500 to-white bg-clip-text text-transparent">
              Apa Kata Mereka?
            </h2>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              Testimoni nyata dari creator yang sudah merasakan manfaat
              LoopStream
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                name: "Lisa P.",
                type: "Content Creator",
                rating: 5,
                text: "1 bulan live nonstop, HP adem, viewer naik.",
              },
              {
                name: "Budi T.",
                type: "YouTuber Gaming",
                rating: 5,
                text: "2 minggu ditinggal, live tetap jalan. ROI-nya gokil!",
              },
              {
                name: "Khoirun Nisa",
                type: "Lifestyle Vlogger",
                rating: 5,
                text: "Subscriber naik karena channel selalu online.",
              },
            ].map((testimonial, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1, duration: 0.6 }}
                className="bg-gradient-to-br from-gray-800 to-gray-900 p-6 rounded-2xl border border-blue-500/20"
              >
                <div className="flex items-center mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star
                      key={i}
                      className="w-5 h-5 text-yellow-500 fill-current"
                    />
                  ))}
                </div>
                <p className="text-gray-300 mb-4 italic">
                  "{testimonial.text}"
                </p>
                <div>
                  <div className="font-bold text-white">{testimonial.name}</div>
                  <div className="text-sm text-blue-400">
                    {testimonial.type}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section className="py-20 bg-gradient-to-b from-black to-gray-900">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-blue-500 to-white bg-clip-text text-transparent">
              Harga LoopStream
            </h2>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              Pilih paket yang sesuai dengan kebutuhan streaming Anda
            </p>
          </motion.div>

          {/* Pricing Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
            {[
              {
                title: "Set 1",
                price: "Rp 250.000/bulan",
                description: "Untuk kebutuhan ringan dan uji coba",
                details:
                  "15x streaming 720p / 10x 1080p / 5x 4K, 40GB Penyimpanan",
                bgColor: "bg-blue-900/30",
                borderColor: "border-blue-500/30",
                textColor: "text-blue-400",
                buttonColor: "bg-blue-600 hover:bg-blue-700",
                buttonText: "Order Set 1",
                packageName: "Set 1 - Rp 250.000/bulan",
                popular: false,
              },
              {
                title: "Set 2",
                price: "Rp 275.000/bulan",
                description: "Nilai terbaik dengan fleksibilitas tinggi",
                details:
                  "25x streaming 720p / 17x 1080p / 8x 4K, 60GB Penyimpanan",
                bgColor: "bg-green-900/30",
                borderColor: "border-green-500/30",
                textColor: "text-green-400",
                buttonColor: "bg-green-600 hover:bg-green-700",
                buttonText: "Order Set 2",
                packageName: "Set 2 - Rp 275.000/bulan",
                popular: true,
              },
              {
                title: "Set 3",
                price: "Rp 349.000/bulan",
                description: "Untuk streamer intensif dan profesional",
                details:
                  "40x streaming 720p / 25x 1080p / 12x 4K, 80GB Penyimpanan",
                bgColor: "bg-purple-900/30",
                borderColor: "border-purple-500/30",
                textColor: "text-purple-400",
                buttonColor: "bg-purple-600 hover:bg-purple-700",
                buttonText: "Order Set 3",
                packageName: "Set 3 - Rp 349.000/bulan",
                popular: false,
              },
            ].map((pkg, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1, duration: 0.6 }}
                className={`${pkg.bgColor} p-6 rounded-2xl ${
                  pkg.borderColor
                } border-2 hover:border-opacity-60 transition-all duration-300 relative ${
                  pkg.popular
                    ? "transform scale-105 ring-2 ring-green-500/30"
                    : ""
                }`}
                whileHover={{ scale: pkg.popular ? 1.05 : 1.02 }}
              >
                {pkg.popular && (
                  <div className="absolute -top-3 left-1/2 transform -translate-x-1/2 bg-green-600 text-white px-4 py-1 rounded-full text-sm font-bold">
                    TERPOPULER
                  </div>
                )}

                <div className="text-center">
                  <h3 className={`text-xl font-bold ${pkg.textColor} mb-2`}>
                    {pkg.title}
                    {pkg.popular && (
                      <span className="text-yellow-400 ml-2">⭐</span>
                    )}
                    {pkg.title === "Set 3" && (
                      <span className="text-purple-400 ml-2">💎</span>
                    )}
                  </h3>
                  <div className={`text-3xl font-bold ${pkg.textColor} mb-3`}>
                    {pkg.price}
                  </div>
                  <div className="text-sm text-gray-300 mb-6 text-center">
                    <p className="font-medium mb-2">{pkg.description}</p>
                    <p className="text-xs text-gray-400">{pkg.details}</p>
                  </div>

                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => handleWhatsAppOrder(pkg.packageName)}
                    className={`w-full ${pkg.buttonColor} text-white py-3 px-4 rounded-lg text-sm font-bold transition-all duration-300`}
                  >
                    {pkg.buttonText}
                  </motion.button>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Trial & Support Info */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="max-w-4xl mx-auto"
          >
            <div className="bg-blue-900/20 p-6 rounded-2xl border border-blue-500/30 mb-8 text-center">
              <h3 className="text-2xl font-bold text-blue-400 mb-2">
                LoopStream Cloud Streaming
              </h3>
              <p className="text-gray-300 mb-4">
                Support YouTube Live Streaming | Server Cloud Profesional
              </p>
            </div>

            {/* WhatsApp Consultation Button */}
            <div className="text-center">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleWhatsAppConsult}
                className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-4 rounded-full text-lg font-bold transition-all duration-300 shadow-2xl flex items-center justify-center space-x-2 mx-auto"
              >
                <MessageCircle className="w-5 h-5" />
                <span>Konsultasi LoopStream</span>
              </motion.button>
              <p className="text-sm text-gray-400 mt-3">
                Butuh bantuan memilih paket? Chat langsung dengan tim kami
              </p>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Combination CTA */}
      <section className="py-20 bg-gradient-to-r from-blue-900/30 to-red-900/30">
        <div className="container mx-auto px-4 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h2 className="text-4xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-blue-500 via-white to-red-500 bg-clip-text text-transparent">
              Kombinasikan LoopBOT + LoopStream = Mesin Uang 24/7
            </h2>
            <div className="max-w-4xl mx-auto mb-8">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-xl text-gray-300">
                <div className="bg-green-900/20 p-4 rounded-lg border border-green-500/30">
                  <CheckCircle className="w-8 h-8 text-green-400 mx-auto mb-2" />
                  <p>Hidup tenang tanpa takut live mati</p>
                </div>
                <div className="bg-blue-900/20 p-4 rounded-lg border border-blue-500/30">
                  <BarChart3 className="w-8 h-8 text-blue-400 mx-auto mb-2" />
                  <p>Naikkan trafik, jam tayang, dan monetisasi</p>
                </div>
                <div className="bg-purple-900/20 p-4 rounded-lg border border-purple-500/30">
                  <Zap className="w-8 h-8 text-purple-400 mx-auto mb-2" />
                  <p>Fokus ke produksi konten — tanpa gangguan teknis</p>
                </div>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-8">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() =>
                  handleWhatsAppOrder("Paket Combo LoopBOT + LoopStream")
                }
                className="bg-gradient-to-r from-blue-600 to-red-500 text-white px-8 py-4 rounded-full text-lg font-bold hover:from-blue-700 hover:to-red-600 transition-all duration-300 shadow-2xl inline-flex items-center space-x-2"
              >
                <MessageCircle className="w-5 h-5" />
                <span>Yuk Mulai Hari Ini Juga!</span>
                <ArrowRight className="w-5 h-5" />
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleWhatsAppConsult}
                className="bg-green-600 hover:bg-green-700 text-white px-8 py-4 rounded-full text-lg font-bold transition-all duration-300 shadow-2xl inline-flex items-center space-x-2"
              >
                <MessageCircle className="w-5 h-5" />
                <span>Konsultasi Combo Package</span>
              </motion.button>
            </div>

            <p className="text-lg text-gray-300 italic max-w-2xl mx-auto">
              Live terus, tanpa stress. Cuan terus, tanpa ribet.
            </p>

            <div className="mt-8 flex items-center justify-center space-x-4 text-sm text-gray-400">
              <div className="flex items-center space-x-1">
                <Shield className="w-4 h-4" />
                <span>Cloud Streaming 24/7</span>
              </div>
              <div className="flex items-center space-x-1">
                <Headphones className="w-4 h-4" />
                <span>Full Automation</span>
              </div>
              <div className="flex items-center space-x-1">
                <CheckCircle className="w-4 h-4" />
                <span>Garansi Kualitas</span>
              </div>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
