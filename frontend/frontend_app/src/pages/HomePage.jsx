import { Link } from 'react-router-dom'
import { ArrowRight, Play, Users, Clock, Zap, Star, CheckCircle, Bot, Radio } from 'lucide-react'
import { motion } from 'framer-motion'
import { useState, useEffect } from 'react'

export default function HomePage() {
  const [count, setCount] = useState(0)

  useEffect(() => {
    const timer = setTimeout(() => {
      if (count < 1000) {
        setCount(count + 50)
      }
    }, 50)
    return () => clearTimeout(timer)
  }, [count])
  return (
    <div className="min-h-screen bg-black text-white">
      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-red-900/20 via-black to-black"></div>
        <div className="relative container mx-auto px-4 py-20">
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center max-w-4xl mx-auto"
          >
            <h1 className="text-5xl md:text-7xl font-bold mb-6 bg-gradient-to-r from-red-500 via-white to-red-400 bg-clip-text text-transparent">
              Aktifkan Channel YouTube-mu 
              <span className="block">24 Jam Nonstop</span>
            </h1>
            <p className="text-xl md:text-2xl text-gray-300 mb-8 leading-relaxed">
              Solusi otomatisasi streaming dan manajemen channel yang dirancang khusus untuk kreator digital modern.
            </p>
            
            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-12">
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Link 
                  to="/loopbot"
                  className="bg-gradient-to-r from-red-600 to-red-500 text-white px-8 py-4 rounded-full text-lg font-bold hover:from-red-700 hover:to-red-600 transition-all duration-300 shadow-2xl hover:shadow-red-500/50 flex items-center space-x-2"
                >
                  <Play className="w-5 h-5" />
                  <span>Order LoopBOT Sekarang</span>
                  <ArrowRight className="w-5 h-5" />
                </Link>
              </motion.div>
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Link 
                  to="/loopstream"
                  className="bg-gradient-to-r from-gray-800 to-gray-700 text-white px-8 py-4 rounded-full text-lg font-bold hover:from-gray-700 hover:to-gray-600 transition-all duration-300 shadow-2xl flex items-center space-x-2 border border-red-500/30"
                >
                  <Zap className="w-5 h-5" />
                  <span>Order LoopStream Sekarang</span>
                  <ArrowRight className="w-5 h-5" />
                </Link>
              </motion.div>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-3xl mx-auto">
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2, duration: 0.6 }}
                className="text-center"
              >
                <div className="text-3xl font-bold text-red-500 mb-2">
                  {count >= 1000 ? '1000+' : count}
                </div>
                <div className="text-gray-400">YouTuber Terpercaya</div>
              </motion.div>
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4, duration: 0.6 }}
                className="text-center"
              >
                <div className="text-3xl font-bold text-red-500 mb-2">24/7</div>
                <div className="text-gray-400">Streaming Otomatis</div>
              </motion.div>
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6, duration: 0.6 }}
                className="text-center"
              >
                <div className="text-3xl font-bold text-red-500 mb-2">99.9%</div>
                <div className="text-gray-400">Uptime Guarantee</div>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-gradient-to-b from-black to-gray-900">
        <div className="container mx-auto px-4">
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-red-500 to-white bg-clip-text text-transparent">
              Mengapa Kreator Memilih Platform LoopBOTIQ?
            </h2>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                icon: <Clock className="w-8 h-8" />,
                title: "Channel Online 24/7",
                description: "Selalu aktif, menjangkau penonton baru tanpa jeda."
              },
              {
                icon: <Zap className="w-8 h-8" />,
                title: "Sistem Otomatis Berbasis AI",
                description: "Mengelola dan mengoptimalkan performa live secara cerdas."
              },
              {
                icon: <CheckCircle className="w-8 h-8" />,
                title: "Keamanan Tingkat Tinggi",
                description: "Lisensi terkunci per perangkat, sistem anti-pembajakan."
              },
              {
                icon: <Users className="w-8 h-8" />,
                title: "Kontrol Penuh dari Mana Saja",
                description: "Kelola channel melalui notifikasi dan dashboard mobile-friendly."
              },
              {
                icon: <Star className="w-8 h-8" />,
                title: "Dukungan Teknis 24/7",
                description: "Tim support siap bantu kapan pun via WhatsApp & email."
              }
            ].map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1, duration: 0.6 }}
                whileHover={{ scale: 1.05 }}
                className="bg-gradient-to-br from-gray-900 to-gray-800 p-6 rounded-2xl border border-red-500/20 hover:border-red-500/40 transition-all duration-300"
              >
                <div className="text-red-500 mb-4">{feature.icon}</div>
                <h3 className="text-xl font-bold mb-3 text-white">{feature.title}</h3>
                <p className="text-gray-400">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Products Section */}
      <section className="py-20 bg-black">
        <div className="container mx-auto px-4">
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-red-500 to-white bg-clip-text text-transparent">
              Pilih Solusi Terbaik untuk Channel Kamu
            </h2>
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-6xl mx-auto">
            {/* LoopBOT Card */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              whileHover={{ scale: 1.02 }}
              className="bg-gradient-to-br from-red-900/30 to-gray-900 p-8 rounded-3xl border border-red-500/30 hover:border-red-500/60 transition-all duration-300"
            >
              <div className="text-center mb-6">
                <h3 className="text-3xl font-bold text-red-500 mb-2 flex items-center justify-center gap-2">
                  <Bot className="w-8 h-8" />
                  LoopBOT
                </h3>
                <p className="text-gray-300">Otomatisasi YouTube Live Tanpa Ribet</p>
              </div>
              <p className="text-gray-300 mb-6">
                Automasi total untuk live streaming YouTube. Mulai dan hentikan live secara otomatis, ubah judul dan deskripsi setiap sesi secara dinamis, semua dikendalikan dari satu dashboard. Dilengkapi dengan penjadwalan pintar dan sistem lisensi fleksibel.
              </p>
              <Link 
                to="/loopbot"
                className="block w-full bg-gradient-to-r from-red-600 to-red-500 text-white text-center py-4 rounded-xl font-bold hover:from-red-700 hover:to-red-600 transition-all duration-300 shadow-lg hover:shadow-red-500/25"
              >
                Coba Gratis Sekarang
              </Link>
            </motion.div>

            {/* LoopStream Card */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              whileHover={{ scale: 1.02 }}
              className="bg-gradient-to-br from-gray-900 to-gray-800 p-8 rounded-3xl border border-gray-600/30 hover:border-red-500/60 transition-all duration-300"
            >
              <div className="text-center mb-6">
                <h3 className="text-3xl font-bold text-white mb-2 flex items-center justify-center gap-2">
                  <Radio className="w-8 h-8" />
                  LoopStream
                </h3>
                <p className="text-gray-300">Live Streaming 24/7 Langsung dari Cloud</p>
              </div>
              <p className="text-gray-300 mb-6">
                Streaming tanpa henti tanpa harus menyalakan komputer atau khawatir koneksi terputus. Cukup unggah video, atur jadwal, dan biarkan server kami yang bekerja dengan stabilitas 99.9% uptime.
              </p>
              <Link 
                to="/loopstream"
                className="block w-full bg-gradient-to-r from-gray-700 to-gray-600 text-white text-center py-4 rounded-xl font-bold hover:from-gray-600 hover:to-gray-500 transition-all duration-300 shadow-lg border border-red-500/30"
              >
                Coba Sekarang
              </Link>
            </motion.div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-red-900/20 to-black">
        <div className="container mx-auto px-4 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h2 className="text-4xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-red-500 to-white bg-clip-text text-transparent">
              Siap Mengembangkan Channel Anda?
            </h2>
            <p className="text-xl text-gray-300 mb-8 max-w-3xl mx-auto">
              Bergabunglah dengan ribuan YouTuber yang sudah merasakan manfaat otomatisasi streaming dengan LoopBOTIQ
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Link 
                  to="/loopbot"
                  className="bg-gradient-to-r from-red-600 to-red-500 text-white px-8 py-4 rounded-full text-lg font-bold hover:from-red-700 hover:to-red-600 transition-all duration-300 shadow-2xl hover:shadow-red-500/50 inline-flex items-center space-x-2"
                >
                  <span>Mulai dengan LoopBOT</span>
                  <ArrowRight className="w-5 h-5" />
                </Link>
              </motion.div>
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Link 
                  to="/loopstream"
                  className="bg-gradient-to-r from-gray-800 to-gray-700 text-white px-8 py-4 rounded-full text-lg font-bold hover:from-gray-700 hover:to-gray-600 transition-all duration-300 shadow-2xl inline-flex items-center space-x-2 border border-red-500/30"
                >
                  <span>Coba LoopStream</span>
                  <ArrowRight className="w-5 h-5" />
                </Link>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  )
}

