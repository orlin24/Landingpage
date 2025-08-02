import { Link } from "react-router-dom";
import {
  ArrowRight,
  Play,
  Users,
  Clock,
  Zap,
  Star,
  CheckCircle,
  Bot,
  Radio,
} from "lucide-react";
import { motion } from "framer-motion";
import { useState, useEffect, useMemo, useCallback } from "react";

export default function HomePage() {
  const [count, setCount] = useState(0);
  const [notifications, setNotifications] = useState([]);
  
  const names = useMemo(() => ["Andi", "Susi", "Budi", "Maya", "Riko", "Desi", "Agus", "Nina", "Tono", "Rina", "Joko", "Lina", "Eko", "Sari", "Bayu", "Dewi", "Hadi", "Fitri", "Yudi", "Mega", "Adit", "Anisa", "Arif", "Bella", "Citra", "Dava", "Elsa", "Fani", "Gita", "Hana", "Indra", "Jihan", "Kiki", "Laras", "Mira", "Nanda", "Oka", "Putri", "Qori", "Rara", "Sinta", "Tari", "Ulfa", "Vina", "Wina", "Xena", "Yani", "Zara", "Ayu", "Bima", "Cici", "Dedi", "Evi", "Fira", "Gina", "Heri", "Ika", "Jaya", "Kira", "Lisa", "Mila", "Novi", "Oki", "Pita", "Qila", "Resa", "Sari", "Tika", "Udin", "Vera", "Widi", "Xavi", "Yona", "Zaki", "Arya", "Bela", "Caca", "Dian", "Ela", "Fina", "Gani", "Hilda", "Irma", "Juna", "Karin", "Lulu", "Manda", "Nisa", "Olga", "Puri", "Qita", "Rian", "Shinta", "Tina", "Uli", "Vira", "Winda", "Yuli", "Zara", "Adam", "Beni", "Clara", "Doni", "Erin", "Fajar", "Gema", "Hana", "Ivan", "Juli", "Kiko", "Lani", "Miko", "Neni", "Oscar", "Pina", "Quin", "Rosa", "Sari", "Tami", "Uli", "Vani", "Wati", "Yogi", "Zila", "Alif", "Bela", "Caca", "Dara", "Emil", "Fani", "Gita", "Hani", "Irin", "Jeni", "Kila", "Lusi", "Mila", "Nida", "Orin", "Pita", "Qira", "Rini", "Sinta", "Tara", "Ulin", "Vira", "Widi", "Yani", "Zara", "Asep", "Budi", "Cici", "Deni", "Eka", "Feri", "Gani", "Heri", "Ilham", "Joko", "Koko", "Leni", "Maman", "Nana", "Ogi", "Pandi", "Qori", "Rico", "Sandi", "Tedi", "Umar", "Vino", "Wawan", "Yanto", "Zaki", "Alam", "Bima", "Candra", "Danang", "Erik", "Farid", "Gilang", "Hafiz", "Irwan", "Jefri", "Kurnia", "Lucky", "Maulana", "Nabil", "Ovi", "Putra", "Qadri", "Rizky", "Satria", "Teguh", "Usman", "Victor", "Wahyu", "Yusuf", "Zidan", "Andika", "Bagas", "Chandra", "Dicky", "Evan", "Ferdy", "Galih", "Haris", "Iwan", "Jaka", "Krisna", "Lukman", "Malik", "Noval", "Oky", "Pandu", "Qomar", "Ridho", "Surya", "Tommy", "Ujang", "Vero", "Wisnu", "Yoga", "Zainal"], []);
  const locations = useMemo(() => ["Jakarta", "Bandung", "Surabaya", "Medan", "Yogyakarta", "Bali", "Semarang", "Makassar", "Palembang", "Bekasi", "Tangerang", "Depok", "Bogor", "Malang", "Solo", "Batam", "Pontianak", "Manado", "Balikpapan", "Samarinda", "Aceh", "Ambon", "Banjarmasin", "Bengkulu", "Binjai", "Blitar", "Cimahi", "Cilegon", "Denpasar", "Dumai", "Gorontalo", "Gunungsitoli", "Jambi", "Jayapura", "Kediri", "Kendari", "Kupang", "Langsa", "Lhokseumawe", "Lubuklinggau", "Madiun", "Magelang", "Mataram", "Mojokerto", "Padang", "Padangsidimpuan", "Pagar Alam", "Pangkalpinang", "Parepare", "Pariaman", "Pasuruan", "Payakumbuh", "Pekalongan", "Pekanbaru", "Pematangsiantar", "Probolinggo", "Sabang", "Salatiga", "Sawah Lunto", "Sibolga", "Singkawang", "Solok", "Sorong", "Subulussalam", "Sukabumi", "Sungai Penuh", "Tarakan", "Tasikmalaya", "Tebing Tinggi", "Tegal", "Ternate", "Tidore Kepulauan", "Tomohon", "Tual", "Bukittinggi", "Cilacap", "Purwokerto", "Jember", "Ponorogo", "Tulungagung", "Banyuwangi", "Situbondo", "Bondowoso", "Lumajang", "Ngawi", "Magetan", "Pacitan", "Trenggalek", "Blora", "Rembang", "Pati", "Kudus", "Jepara", "Demak", "Grobogan", "Boyolali", "Klaten", "Wonogiri", "Karanganyar", "Sragen", "Sukoharjo", "Bantul", "Sleman", "Kulon Progo", "Gunungkidul", "Purbalingga", "Banjarnegara", "Kebumen", "Purworejo", "Wonosobo", "Magelang", "Temanggung", "Kendal", "Batang", "Pekalongan", "Pemalang", "Tegal", "Brebes"], []);
  const products = useMemo(() => ["LoopBot", "LoopStream"], []);
  const actions = useMemo(() => ["baru order", "sudah beli", "berhasil order", "ambil paket"], []);
  
  const generateRandomTestimonial = useCallback(() => {
    const randomName = names[Math.floor(Math.random() * names.length)];
    const randomLocation = locations[Math.floor(Math.random() * locations.length)];
    const randomProduct = products[Math.floor(Math.random() * products.length)];
    const randomAction = actions[Math.floor(Math.random() * actions.length)];
    const randomTime = Math.floor(Math.random() * 300) + 10;
    
    return {
      name: randomName,
      location: randomLocation,
      product: randomProduct,
      action: randomAction,
      baseTime: Date.now() - (randomTime * 1000)
    };
  }, [names, locations, products, actions]);

  useEffect(() => {
    const timer = setTimeout(() => {
      if (count < 1000) {
        setCount(count + 50);
      }
    }, 50);
    return () => clearTimeout(timer);
  }, [count]);

  useEffect(() => {
    let usedCombinations = new Set();
    
    const showNotification = () => {
      let testimonial;
      let attempts = 0;
      
      // Coba generate kombinasi yang belum pernah dipakai
      do {
        testimonial = generateRandomTestimonial();
        const combination = `${testimonial.name}-${testimonial.product}-${testimonial.location}`;
        
        if (!usedCombinations.has(combination)) {
          usedCombinations.add(combination);
          break;
        }
        attempts++;
      } while (attempts < 50);
      
      // Reset jika sudah terlalu banyak kombinasi
      if (usedCombinations.size > 100) {
        usedCombinations.clear();
      }
      
      const newNotification = {
        id: Date.now() + Math.random(),
        ...testimonial,
        timestamp: Date.now(),
      };
      
      setNotifications(prev => [...prev, newNotification]);
      
      // Random duration tampil 4-7 detik
      const displayDuration = Math.random() * 3000 + 4000;
      setTimeout(() => {
        setNotifications(prev => prev.filter(notif => notif.id !== newNotification.id));
      }, displayDuration);
    };

    // Interval random 8-18 detik
    const scheduleNext = () => {
      const nextInterval = Math.random() * 10000 + 8000;
      setTimeout(() => {
        showNotification();
        scheduleNext();
      }, nextInterval);
    };
    
    // Tampilkan pertama kali setelah 3-8 detik
    setTimeout(() => {
      showNotification();
      scheduleNext();
    }, Math.random() * 5000 + 3000);
    
  }, []);
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
              <span className="block text-yellow-400">Ratusan Juta/Bulan</span>
              <span className="block">Tanpa Buat Konten!</span>
            </h1>
            <p className="text-xl md:text-2xl text-gray-300 mb-4 leading-relaxed">
              <span className="text-yellow-400 font-bold">
                15+ Channel YouTube
              </span>{" "}
              jalan otomatis 24/7
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-12">
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Link
                  to="/loopbot"
                  className="bg-gradient-to-r from-yellow-500 to-red-500 text-black px-10 py-5 rounded-full text-xl font-bold hover:from-yellow-400 hover:to-red-400 transition-all duration-300 shadow-2xl hover:shadow-yellow-500/50 flex items-center space-x-2 animate-pulse"
                >
                  <Play className="w-6 h-6" />
                  <span>MULAI CUAN SEKARANG!</span>
                  <ArrowRight className="w-6 h-6" />
                </Link>
              </motion.div>
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Link
                  to="/loopstream"
                  className="bg-gradient-to-r from-green-600 to-green-500 text-white px-10 py-5 rounded-full text-xl font-bold hover:from-green-700 hover:to-green-600 transition-all duration-300 shadow-2xl flex items-center space-x-2 border-2 border-green-400"
                >
                  <Zap className="w-6 h-6" />
                  <span>ORDER LOOPSTREAM</span>
                  <ArrowRight className="w-6 h-6" />
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
                  {count >= 1000 ? "1000+" : count}
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
                <div className="text-3xl font-bold text-red-500 mb-2">
                  99.9%
                </div>
                <div className="text-gray-400">Uptime Guarantee</div>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Auto Pilot Success Section */}
      <section className="py-20 bg-gradient-to-b from-gray-900 to-black">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="max-w-4xl mx-auto text-center"
          >
            <h2 className="text-4xl md:text-6xl font-bold mb-4 bg-gradient-to-r from-red-500 via-yellow-400 to-red-500 bg-clip-text text-transparent">
              BUKTI NYATA INCOME!
            </h2>
            <p className="text-2xl md:text-3xl font-bold text-yellow-400 mb-8">
              YouTube Auto Pilot = Cuan Jalan Terus
            </p>

            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.3, duration: 0.6 }}
              className="bg-gradient-to-br from-red-900/30 to-gray-900/50 p-8 rounded-3xl border border-red-500/30 mb-8"
            >
              <div className="bg-red-500/20 p-4 rounded-xl border border-red-400 mb-6">
                <p className="text-xl md:text-2xl text-red-200 font-bold">
                  CAPEK BIKIN KONTEN TAPI PENGHASILAN SERET?
                </p>
              </div>

              <p className="text-lg md:text-xl text-gray-300 mb-4">
                Saya pakai{" "}
                <span className="text-yellow-400 font-bold text-2xl">
                  LoopBotiq + LoopStream
                </span>{" "}
                untuk bangun banyak channel YouTube otomatis,
              </p>
              <p className="text-xl md:text-2xl text-green-400 font-bold mb-8">
                SEMUA CHANNEL NYAMBUNG KE 1 ADSENSE = HASILNYA?
              </p>

              {/* Earnings Screenshot */}
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.4, duration: 0.6 }}
                className="mb-8"
              >
                {/* Desktop & Tablet - Show Image with container */}
                <div className="hidden md:block">
                  <div className="bg-gradient-to-br from-gray-800 to-gray-900 p-6 rounded-2xl border border-yellow-400/40 shadow-2xl">
                    <div className="text-center">
                      <div className="bg-gradient-to-r from-yellow-400/20 to-red-500/20 p-4 rounded-xl border-2 border-dashed border-yellow-400/50">
                        <img
                          src="/images/googleadsense.png"
                          alt="Bukti earnings dashboard YouTube AdSense"
                          className="w-full rounded-lg shadow-2xl max-h-96 object-contain"
                          loading="lazy"
                          decoding="async"
                          onError={(e) => {
                            e.target.style.display = "none";
                            e.target.nextSibling.style.display = "block";
                          }}
                        />
                        <div
                          className="text-center"
                          style={{ display: "none" }}
                        >
                          <div className="text-6xl mb-4">📊💰</div>
                          <div className="text-yellow-400 font-bold text-lg mb-2">
                            SCREENSHOT EARNINGS DASHBOARD
                          </div>
                          <div className="text-gray-300 text-sm">
                            *Bukti real earnings dari multiple channel YouTube
                            menggunakan LoopBotiq + LoopStream*
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Mobile - Show Image without container borders */}
                <div className="block md:hidden">
                  <div className="text-center">
                    <div className="text-yellow-400 font-bold text-lg mb-4">
                      BUKTI REAL EARNINGS
                    </div>
                    <img
                      src="/images/googleadsense.png"
                      alt="Bukti earnings dashboard YouTube AdSense"
                      className="w-full rounded-lg shadow-2xl max-w-sm mx-auto"
                      loading="lazy"
                      decoding="async"
                      onError={(e) => {
                        e.target.style.display = "none";
                        e.target.nextSibling.style.display = "block";
                      }}
                    />
                    <div className="text-center" style={{ display: "none" }}>
                      <div className="bg-gradient-to-br from-yellow-500/20 to-red-500/20 p-6 rounded-2xl border border-yellow-400/60 shadow-2xl max-w-sm mx-auto">
                        <div className="text-6xl mb-4">📊💰</div>
                        <div className="text-yellow-400 font-bold text-lg mb-2">
                          EARNINGS SCREENSHOT
                        </div>
                        <div className="text-gray-300 text-sm">
                          *Bukti real earnings YouTube AdSense*
                        </div>
                      </div>
                    </div>
                    <div className="text-yellow-300 text-sm italic mt-3">
                      ⚡ Banyak channel 1 Adsense ⚡
                    </div>
                  </div>
                </div>
              </motion.div>

              {/* Results Highlight */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5, duration: 0.6 }}
                className="bg-gradient-to-r from-yellow-500/20 to-red-500/20 p-6 rounded-2xl border border-yellow-400/30 mb-8"
              >
                <div className="text-center">
                  <div className="text-2xl md:text-3xl font-bold text-yellow-400 mb-2">
                    HASIL NYATA:
                  </div>
                  <div className="space-y-4 text-lg">
                    <div className="flex items-center justify-center gap-2">
                      <CheckCircle className="w-7 h-7 text-green-400" />
                      <span className="text-yellow-300 font-bold text-xl">
                        Ratusan juta tiap bulan
                      </span>
                    </div>
                    <div className="flex items-center justify-center gap-2">
                      <CheckCircle className="w-7 h-7 text-green-400" />
                      <span className="text-yellow-300 font-bold text-xl">
                        Semua channel jalan 24 jam otomatis
                      </span>
                    </div>
                    <div className="flex items-center justify-center gap-2">
                      <CheckCircle className="w-7 h-7 text-green-400" />
                      <span className="text-yellow-300 font-bold text-xl">
                        1x setting, tinggal repeat buat channel baru
                      </span>
                    </div>
                  </div>

                  {/* Urgency Banner */}
                  <div className="mt-6 bg-red-600/90 p-4 rounded-xl border-2 border-red-400 animate-pulse">
                    <p className="text-white font-bold text-lg">
                      ⚠️ HANYA 50 SLOT TERSISA BULAN INI! ⚠️
                    </p>
                    <p className="text-red-200 text-sm">
                      Setelah ini harga naik 2x lipat!
                    </p>
                  </div>
                </div>
              </motion.div>
            </motion.div>
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
                description:
                  "Selalu aktif, menjangkau penonton baru tanpa jeda.",
              },
              {
                icon: <Zap className="w-8 h-8" />,
                title: "Sistem Otomatis Berbasis AI",
                description:
                  "Mengelola dan mengoptimalkan performa live secara cerdas.",
              },
              {
                icon: <CheckCircle className="w-8 h-8" />,
                title: "Keamanan Tingkat Tinggi",
                description:
                  "Lisensi terkunci per perangkat, sistem anti-pembajakan.",
              },
              {
                icon: <Users className="w-8 h-8" />,
                title: "Kontrol Penuh dari Mana Saja",
                description:
                  "Kelola channel melalui notifikasi dan dashboard mobile-friendly.",
              },
              {
                icon: <Star className="w-8 h-8" />,
                title: "Dukungan Teknis 24/7",
                description:
                  "Tim support siap bantu kapan pun via WhatsApp & email.",
              },
              {
                icon: <Bot className="w-8 h-8" />,
                title: "Full Automation System",
                description:
                  "Cukup 1 klik untuk mengaktifkan semua Live. Sisanya biarkan sistem bekerja 24/7 menghasilkan cuan.",
              },
            ].map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1, duration: 0.6 }}
                whileHover={{ scale: 1.05 }}
                viewport={{ once: true }}
                className="bg-gradient-to-br from-gray-900 to-gray-800 p-6 rounded-2xl border border-red-500/20 hover:border-red-500/40 transition-all duration-300"
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

      {/* Testimonial Section */}
      <section className="py-20 bg-gradient-to-b from-green-900/20 to-black">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-green-500 to-yellow-400 bg-clip-text text-transparent">
              APA KATA MEREKA YANG SUDAH CUAN?
            </h2>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {[
              {
                name: "Budi S.",
                income: "Rp 18 Juta/bulan",
                text: "Gila! Dari 0 jadi 18 juta dalam 3 bulan. 12 channel jalan semua otomatis!",
                channels: "12 Channel",
              },
              {
                name: "Sari M.",
                income: "Rp 24 Juta/bulan",
                text: "Awalnya skeptis, tapi sekarang malah bisa resign dari kantor. Thank you LoopBotiq!",
                channels: "8 Channel",
              },
              {
                name: "Deni R.",
                income: "Rp 56 Juta/bulan",
                text: "Pecah sih ini! Baru 6 bulan udah bisa beli mobil cash dari hasil YouTube autopilot.",
                channels: "15 Channel",
              },
            ].map((testimonial, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.2, duration: 0.6 }}
                className="bg-gradient-to-br from-green-900/30 to-gray-900/50 p-6 rounded-2xl border border-green-500/30 hover:border-green-500/60 transition-all duration-300"
              >
                <div className="text-center">
                  <div className="text-5xl mb-4">💰</div>
                  <h3 className="text-green-400 font-bold text-2xl mb-2">
                    {testimonial.income}
                  </h3>
                  <p className="text-yellow-400 font-semibold mb-2">
                    {testimonial.name} - {testimonial.channels}
                  </p>
                  <p className="text-gray-300 italic">"{testimonial.text}"</p>
                  <div className="mt-4 flex justify-center space-x-1">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className="w-5 h-5 text-yellow-400 fill-current"
                      />
                    ))}
                  </div>
                </div>
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
                <p className="text-gray-300">
                  Otomatisasi YouTube Live Tanpa Ribet
                </p>
              </div>
              <p className="text-gray-300 mb-6">
                Automasi total untuk live streaming YouTube. Mulai dan hentikan
                live secara otomatis, ubah judul dan deskripsi setiap sesi
                secara dinamis, semua dikendalikan dari satu dashboard.
                Dilengkapi dengan penjadwalan pintar dan sistem lisensi
                fleksibel.
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
                <p className="text-gray-300">
                  Live Streaming 24/7 Langsung dari Cloud
                </p>
              </div>
              <p className="text-gray-300 mb-6">
                Streaming tanpa henti tanpa harus menyalakan komputer atau
                khawatir koneksi terputus. Cukup unggah video, atur jadwal, dan
                biarkan server kami yang bekerja dengan stabilitas 99.9% uptime.
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

      {/* Final CTA Section */}
      <section className="py-20 bg-gradient-to-r from-red-900/40 to-yellow-900/40">
        <div className="container mx-auto px-4 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            {/* Countdown Timer */}
            <div className="bg-red-600/90 p-6 rounded-2xl border-2 border-red-400 mb-8 animate-pulse">
              <h3 className="text-2xl md:text-3xl font-bold text-white mb-2">
                PROMO BERAKHIR DALAM:
              </h3>
              <div className="flex justify-center space-x-4 text-white">
                <div className="bg-black/50 p-3 rounded-lg">
                  <div className="text-3xl font-bold">23</div>
                  <div className="text-sm">JAM</div>
                </div>
                <div className="bg-black/50 p-3 rounded-lg">
                  <div className="text-3xl font-bold">59</div>
                  <div className="text-sm">MENIT</div>
                </div>
                <div className="bg-black/50 p-3 rounded-lg">
                  <div className="text-3xl font-bold">45</div>
                  <div className="text-sm">DETIK</div>
                </div>
              </div>
            </div>

            <h2 className="text-4xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-yellow-400 via-red-500 to-yellow-400 bg-clip-text text-transparent">
              JANGAN SAMPAI NYESAL!
            </h2>
            <p className="text-2xl md:text-3xl text-yellow-300 font-bold mb-4">
              Ratusan Juta Menunggu Anda!
            </p>
            <p className="text-xl text-gray-300 mb-8 max-w-3xl mx-auto">
              <span className="text-red-400 font-bold">
                HANYA 50 SLOT TERSISA!
              </span>{" "}
              Setelah ini harga naik 2x lipat dan antrian panjang!
            </p>

            <div className="flex flex-col sm:flex-row gap-6 justify-center">
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Link
                  to="/loopbot"
                  className="bg-gradient-to-r from-yellow-500 to-red-500 text-black px-12 py-6 rounded-full text-2xl font-bold hover:from-yellow-400 hover:to-red-400 transition-all duration-300 shadow-2xl hover:shadow-yellow-500/50 inline-flex items-center space-x-3 animate-pulse"
                >
                  <span>ORDER SEKARANG SEBELUM TERLAMBAT!</span>
                  <ArrowRight className="w-8 h-8" />
                </Link>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Notification Popup */}
      <div className="fixed bottom-4 right-4 z-50 space-y-2">
        {notifications.map((notification) => (
          <motion.div
            key={notification.id}
            initial={{ opacity: 0, x: 300, scale: 0.8 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            exit={{ opacity: 0, x: 300, scale: 0.8 }}
            transition={{ duration: 0.5, ease: "easeOut" }}
            className="bg-gray-900 border border-red-500/30 text-white p-4 rounded-xl shadow-2xl max-w-sm backdrop-blur-sm"
          >
            <div className="flex items-center space-x-3">
              <div className="w-4 h-4 bg-red-500 rounded-full animate-pulse"></div>
              <div>
                <p className="font-bold text-sm text-red-400">
                  ⚡ {notification.name} - {notification.location}
                </p>
                <p className="text-xs text-gray-300">
                  {notification.action} <span className="font-semibold text-yellow-400">{notification.product}</span>
                </p>
                <p className="text-xs text-gray-500 mt-1">
                  {(() => {
                    const totalSeconds = Math.floor(Math.random() * 3600) + 10; // 10 detik - 1 jam
                    const minutes = Math.floor(totalSeconds / 60);
                    const seconds = totalSeconds % 60;
                    
                    if (minutes > 0) {
                      return `${minutes} menit ${seconds > 0 ? seconds + ' detik' : ''} yang lalu`.trim();
                    } else {
                      return `${seconds} detik yang lalu`;
                    }
                  })()}
                </p>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
