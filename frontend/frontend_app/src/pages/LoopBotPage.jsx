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
  Brain,
  Cpu,
} from "lucide-react";
import { motion } from "framer-motion";

export default function LoopBotPage() {
  // WhatsApp handler functions
  const handleWhatsAppOrder = (paket) => {
    const phoneNumber = "6281224286756"; // Ganti dengan nomor WhatsApp Anda
    const message = encodeURIComponent(
      `Halo, saya tertarik untuk order LoopBOT paket ${paket}. Mohon informasi lebih lanjut.`
    );
    const whatsappUrl = `https://wa.me/${phoneNumber}?text=${message}`;
    window.open(whatsappUrl, "_blank");
  };

  const handleWhatsAppConsult = () => {
    const phoneNumber = "62881224286756"; // Ganti dengan nomor WhatsApp Anda
    const message = encodeURIComponent(
      "Halo, saya ingin konsultasi tentang LoopBOT. Mohon informasi lengkapnya."
    );
    const whatsappUrl = `https://wa.me/${phoneNumber}?text=${message}`;
    window.open(whatsappUrl, "_blank");
  };

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-red-900/30 via-black to-black"></div>
        <div className="relative container mx-auto px-4 py-20">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center max-w-4xl mx-auto"
          >
            <div className="inline-flex items-center space-x-2 bg-red-600/20 border border-red-500/30 rounded-full px-6 py-2 mb-6">
              <Star className="w-4 h-4 text-red-500" />
              <span className="text-red-400 font-medium">
                Produk Terlaris #1
              </span>
            </div>

            <h1 className="text-5xl md:text-7xl font-bold mb-6 bg-gradient-to-r from-red-500 via-white to-red-400 bg-clip-text text-transparent">
              LoopBOT
              <span className="block text-3xl md:text-4xl mt-2">
                YouTube Live Stream Automation
              </span>
            </h1>

            <p className="text-xl md:text-2xl text-gray-300 mb-8 leading-relaxed">
              Solusi otomatisasi streaming YouTube paling canggih! Biarkan
              channel Anda aktif 24/7 dengan konten berkualitas tinggi dan
              engagement maksimal.
            </p>
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
                <Brain className="w-12 h-12 md:w-16 md:h-16 text-blue-400" />
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
              <h2 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-red-500 to-white bg-clip-text text-transparent">
                Lihat LoopBOT Beraksi!
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
                <Cpu className="w-10 h-10 md:w-12 md:h-12 text-green-400" />
              </motion.div>
            </div>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto mb-8">
              Demo langsung bagaimana LoopBOT mengotomatisasi streaming YouTube
              Anda
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8 }}
            className="max-w-4xl mx-auto"
          >
            <div className="relative bg-gradient-to-br from-gray-900 to-gray-800 rounded-2xl overflow-hidden border border-red-500/30">
              <div className="aspect-video">
                <iframe
                  src="https://www.youtube.com/embed/IJlDiRJPRu8"
                  title="Demo Video LoopBOT"
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

      {/* Features Section */}
      <section className="py-20 bg-gray-900">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-red-500 to-white bg-clip-text text-transparent">
              Fitur Utama LoopBOT:
            </h2>
            <div className="text-xl text-gray-300 max-w-3xl mx-auto space-y-4">
              <p className="bg-yellow-900/30 p-4 rounded-lg border border-yellow-500/30">
                <strong>NB:</strong>
                <br />
                LoopBOT tidak melakukan proses live streaming secara langsung.
                <br />
                Kamu tetap membutuhkan tools lain untuk melakukan siaran ke
                YouTube.
              </p>
              <p>
                LoopBOT kompatibel dengan semua tools live streaming seperti:
                <br />
                Loopstream, Rental Streaming Imam Januar, dan alat sejenis
                lainnya yang mendukung live stream nonstop tanpa durasi.
              </p>
            </div>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                icon: <Clock className="w-8 h-8" />,
                title: "Login cukup sekali, langsung aktif",
                description:
                  "Sekali login, sistem langsung berjalan otomatis tanpa perlu intervensi manual.",
              },
              {
                icon: <Zap className="w-8 h-8" />,
                title: "Penjadwalan live yang fleksibel dan cerdas",
                description:
                  "Atur jadwal streaming sesuai kebutuhan dengan sistem yang cerdas dan adaptif.",
              },
              {
                icon: <Users className="w-8 h-8" />,
                title: "Judul dan deskripsi otomatis berganti setiap live",
                description:
                  "Konten berubah otomatis setiap sesi live untuk menjaga variasi dan engagement.",
              },
              {
                icon: <MessageCircle className="w-8 h-8" />,
                title: "Streaming berjalan otomatis sesuai jadwal",
                description:
                  "Tidak perlu memantau manual, streaming dimulai dan berakhir sesuai jadwal yang telah ditentukan.",
              },
              {
                icon: <Shield className="w-8 h-8" />,
                title: "Multi-live bebas duplikat",
                description:
                  "Kelola multiple live streaming tanpa khawatir konten duplikat.",
              },
              {
                icon: <Star className="w-8 h-8" />,
                title: "Dukungan format spintax untuk variasi teks",
                description:
                  "Format spintax memungkinkan variasi teks otomatis untuk judul dan deskripsi yang lebih dinamis.",
              },
              {
                icon: <Clock className="w-8 h-8" />,
                title: "Thumbnail bisa random atau custom",
                description:
                  "Pilih thumbnail secara random atau upload custom sesuai kebutuhan branding.",
              },
              {
                icon: <MessageCircle className="w-8 h-8" />,
                title: "Notifikasi otomatis via Telegram",
                description:
                  "Dapatkan update real-time tentang status streaming melalui notifikasi Telegram.",
              },
              {
                icon: <Shield className="w-8 h-8" />,
                title: "Sistem lisensi aman dan fleksibel",
                description:
                  "Sistem lisensi yang aman dengan fleksibilitas penggunaan sesuai kebutuhan.",
              },
            ].map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1, duration: 0.6 }}
                whileHover={{ scale: 1.05 }}
                className="bg-gradient-to-br from-gray-800 to-gray-900 p-6 rounded-2xl border border-red-500/20 hover:border-red-500/40 transition-all duration-300"
              >
                <div className="text-red-500 mb-4">{feature.icon}</div>
                <h3 className="text-xl font-bold mb-3 text-white">
                  {feature.title}
                </h3>
                <p className="text-gray-400">{feature.description}</p>
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
            <h2 className="text-4xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-red-500 to-white bg-clip-text text-transparent">
              Paket Harga LoopBOT
            </h2>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              Pilih paket yang sesuai dengan kebutuhan dan budget Anda
            </p>
          </motion.div>

          {/* Pricing Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
            {[
              {
                title: "Trial 4 Hari",
                price: "Rp 0",
                description: "Coba gratis, tanpa komitmen.",
                bgColor: "bg-green-900/30",
                borderColor: "border-green-500/30",
                textColor: "text-green-400",
                buttonColor: "bg-green-600 hover:bg-green-700",
                buttonText: "Mulai Trial Gratis",
                packageName: "Trial 4 Hari (Gratis)",
                popular: false,
              },
              {
                title: "1 Bulan",
                price: "Rp 150.000",
                description: "Murah untuk tes serius. Cocok bagi pemula.",
                bgColor: "bg-blue-900/30",
                borderColor: "border-blue-500/30",
                textColor: "text-blue-400",
                buttonColor: "bg-blue-600 hover:bg-blue-700",
                buttonText: "Order 1 Bulan",
                packageName: "1 Bulan - Rp 150.000",
                popular: false,
              },
              {
                title: "3 Bulan",
                price: "Rp 399.000",
                description:
                  "Hemat 11% dibanding bayar bulanan — hanya Rp 133.000/bulan.",
                bgColor: "bg-purple-900/30",
                borderColor: "border-purple-500/30",
                textColor: "text-purple-400",
                buttonColor: "bg-purple-600 hover:bg-purple-700",
                buttonText: "Order 3 Bulan",
                packageName: "3 Bulan - Rp 399.000",
                popular: false,
              },
              {
                title: "6 Bulan",
                price: "Rp 699.000",
                description: "Lebih hemat lagi — hanya Rp 116.500/bulan.",
                bgColor: "bg-orange-900/30",
                borderColor: "border-orange-500/30",
                textColor: "text-orange-400",
                buttonColor: "bg-orange-600 hover:bg-orange-700",
                buttonText: "Order 6 Bulan",
                packageName: "6 Bulan - Rp 699.000",
                popular: false,
              },
              {
                title: "1 Tahun",
                price: "Rp 999.000",
                description: "Paket paling untung — hanya Rp 83.250/bulan.",
                bgColor: "bg-red-900/30",
                borderColor: "border-red-500/30",
                textColor: "text-red-400",
                buttonColor: "bg-red-600 hover:bg-red-700",
                buttonText: "🔥 Order 1 Tahun - TERPOPULER",
                packageName: "1 Tahun - Rp 999.000 (TERPOPULER)",
                popular: true,
              },
              {
                title: "Lifetime",
                price: "Rp 2.499.000",
                description:
                  "Bayar sekali, pakai selamanya. Tanpa biaya bulanan.",
                bgColor: "bg-yellow-900/30",
                borderColor: "border-yellow-500/30",
                textColor: "text-yellow-400",
                buttonColor: "bg-yellow-600 hover:bg-yellow-700",
                buttonText: "Segera Hadir",
                packageName: "Lifetime - Rp 2.499.000",
                popular: false,
                disabled: true,
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
                    ? "transform scale-105 ring-2 ring-red-500/30"
                    : ""
                }`}
                whileHover={{ scale: pkg.popular ? 1.05 : 1.02 }}
              >
                {pkg.popular && (
                  <div className="absolute -top-3 left-1/2 transform -translate-x-1/2 bg-red-600 text-white px-4 py-1 rounded-full text-sm font-bold">
                    TERPOPULER
                  </div>
                )}

                <div className="text-center">
                  <h3 className={`text-xl font-bold ${pkg.textColor} mb-2`}>
                    {pkg.title}
                  </h3>
                  <div className={`text-3xl font-bold ${pkg.textColor} mb-3`}>
                    {pkg.price}
                    {pkg.title === "Lifetime" && (
                      <span className="text-sm text-gray-400 block">
                        (Segera Hadir)
                      </span>
                    )}
                  </div>
                  <p className="text-sm text-gray-300 mb-6 h-12 flex items-center justify-center">
                    {pkg.description}
                  </p>

                  <motion.button
                    whileHover={{ scale: pkg.disabled ? 1 : 1.02 }}
                    whileTap={{ scale: pkg.disabled ? 1 : 0.98 }}
                    onClick={() =>
                      !pkg.disabled && handleWhatsAppOrder(pkg.packageName)
                    }
                    disabled={pkg.disabled}
                    className={`w-full ${
                      pkg.buttonColor
                    } text-white py-3 px-4 rounded-lg text-sm font-bold transition-all duration-300 ${
                      pkg.disabled ? "opacity-50 cursor-not-allowed" : ""
                    }`}
                  >
                    {pkg.buttonText}
                  </motion.button>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Disclaimer Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="max-w-4xl mx-auto"
          >
            <div className="bg-yellow-900/20 p-6 rounded-2xl border border-yellow-500/30 mb-8">
              <p className="text-gray-300 text-sm text-center">
                <strong>Catatan:</strong> Harga dapat berubah sewaktu-waktu
                tanpa pemberitahuan sebelumnya. Dapatkan harga terbaik selagi
                masih tersedia.
              </p>
              <p className="text-gray-300 italic mt-4 text-center">
                LoopBOT bukan alat penghasil uang instan. Namun, ini adalah
                sistem otomatisasi profesional yang dirancang untuk meningkatkan
                efisiensi kerja dan produktivitas kamu sebagai YouTuber Live
                Streamer.
              </p>
            </div>

            {/* WhatsApp Consultation Button */}
            <div className="text-center">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleWhatsAppConsult}
                className="bg-green-600 hover:bg-green-700 text-white px-8 py-4 rounded-full text-lg font-bold transition-all duration-300 shadow-2xl flex items-center justify-center space-x-2 mx-auto"
              >
                <MessageCircle className="w-5 h-5" />
                <span>Konsultasi via WhatsApp</span>
              </motion.button>
              <p className="text-sm text-gray-400 mt-3">
                Butuh bantuan memilih paket? Chat langsung dengan tim kami
              </p>
            </div>
          </motion.div>
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
            <h2 className="text-4xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-red-500 to-white bg-clip-text text-transparent">
              Testimoni Pengguna
            </h2>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              Ribuan YouTuber sudah merasakan manfaat LoopBOT
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                name: "Andi Pratama",
                channel: "Gaming Channel - 50K Subs",
                rating: 5,
                text: "LoopBOT benar-benar game changer! Channel saya sekarang aktif 24/7 dan subscriber naik 300% dalam 2 bulan!",
              },
              {
                name: "Sarah Melati",
                channel: "Lifestyle Vlogger - 25K Subs",
                rating: 5,
                text: "Setup mudah banget, tinggal klik dan jalan. Sekarang bisa fokus bikin konten berkualitas tanpa khawatir streaming.",
              },
              {
                name: "Budi Santoso",
                channel: "Tech Review - 100K Subs",
                rating: 5,
                text: "Fitur rotasi konten cerdas bikin audience gak bosen. Engagement rate naik signifikan sejak pakai LoopBOT.",
              },
            ].map((testimonial, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1, duration: 0.6 }}
                className="bg-gradient-to-br from-gray-900 to-gray-800 p-6 rounded-2xl border border-red-500/20"
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
                  <div className="text-sm text-red-400">
                    {testimonial.channel}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-20 bg-gray-900">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-red-500 to-white bg-clip-text text-transparent">
              Pertanyaan Umum ❓
            </h2>
          </motion.div>

          <div className="max-w-3xl mx-auto space-y-6">
            {[
              {
                question: "Apakah LoopBOT aman untuk channel YouTube saya?",
                answer:
                  "Ya, LoopBOT menggunakan teknologi anti-ban protection yang canggih dan mengikuti guidelines YouTube untuk memastikan channel Anda tetap aman.",
              },
              {
                question: "Berapa lama setup LoopBOT?",
                answer:
                  "Setup sangat mudah dan cepat, hanya membutuhkan 5-10 menit. Kami juga menyediakan tutorial lengkap dan support 24/7.",
              },
              {
                question: "Apakah bisa digunakan untuk multiple channel?",
                answer:
                  "Ya, LoopBOT mendukung manajemen multiple channel YouTube dari satu dashboard yang sama.",
              },
              {
                question: "Bagaimana sistem lisensi LoopBOT?",
                answer:
                  "Setiap lisensi berlaku seumur hidup dan hanya bisa digunakan di 1 perangkat. Anda bisa deaktivasi dan pindah ke perangkat lain kapan saja.",
              },
            ].map((faq, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1, duration: 0.6 }}
                className="bg-gradient-to-br from-gray-800 to-gray-900 p-6 rounded-2xl border border-red-500/20"
              >
                <h3 className="text-xl font-bold text-white mb-3">
                  {faq.question}
                </h3>
                <p className="text-gray-400">{faq.answer}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-20 bg-gradient-to-r from-red-900/30 to-black">
        <div className="container mx-auto px-4 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h2 className="text-4xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-red-500 to-white bg-clip-text text-transparent">
              Siap Memulai Otomatisasi?
            </h2>
            <p className="text-xl text-gray-300 mb-8 max-w-3xl mx-auto">
              Mulai dari{" "}
              <span className="text-green-400 font-bold">GRATIS</span> dengan
              Trial 4 Hari! Atau pilih paket bulanan mulai dari{" "}
              <span className="text-blue-400 font-bold">Rp 150.000</span>
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => handleWhatsAppOrder("Trial 4 Hari (Gratis)")}
                className="bg-gradient-to-r from-green-600 to-green-500 text-white px-8 py-4 rounded-full text-lg font-bold hover:from-green-700 hover:to-green-600 transition-all duration-300 shadow-2xl hover:shadow-green-500/50 inline-flex items-center space-x-2"
              >
                <MessageCircle className="w-5 h-5" />
                <span>Mulai Trial Gratis</span>
                <ArrowRight className="w-5 h-5" />
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() =>
                  handleWhatsAppOrder("1 Tahun - Rp 999.000 (TERPOPULER)")
                }
                className="bg-gradient-to-r from-red-600 to-red-500 text-white px-8 py-4 rounded-full text-lg font-bold hover:from-red-700 hover:to-red-600 transition-all duration-300 shadow-2xl hover:shadow-red-500/50 inline-flex items-center space-x-2"
              >
                <MessageCircle className="w-5 h-5" />
                <span>Order Paket Terpopuler</span>
                <ArrowRight className="w-5 h-5" />
              </motion.button>
            </div>

            <div className="mt-8 flex items-center justify-center space-x-4 text-sm text-gray-400">
              <div className="flex items-center space-x-1">
                <Shield className="w-4 h-4" />
                <span>Garansi 30 Hari</span>
              </div>
              <div className="flex items-center space-x-1">
                <Headphones className="w-4 h-4" />
                <span>Support 24/7</span>
              </div>
              <div className="flex items-center space-x-1">
                <CheckCircle className="w-4 h-4" />
                <span>Update Gratis</span>
              </div>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
